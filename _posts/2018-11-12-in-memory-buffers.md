---
layout: post
title: Use in memory buffers to avoid disk IO
subtitle: Avoiding writing to files by using memory buffers like BytesIO
date: '2018-11-12T23:59:16.758469000+05:30'
author: Shubham Chaudhary
permalink: /in-memory-buffers
comments: true
header-img: img/buffer-header.jpg
tags:
  - python
  - BytesIO
  - buffers
  - in-memory buffers
  - zomato
---

At [zomato][zblog] we work with a lot of images, close to hundred thousand new images every day.
There are a lot of usecases where we need to download images,
process them, and then pass them to our models.
The usual workflow is to fetch the image from a url, save it in a file and
then pass that filepath around for further processing.

```python
import logging
import os
import tempfile

import cv2
import requests

def download_image(url):
    logging.info('Downloading image from url: %s', url[:100])
    response_object = requests.get(url)
    file_descriptor, filename = tempfile.mkstemp(prefix='image-', suffix='.jpg')
    logging.info('Saving file: %s', filename)
    with open(file_descriptor, mode='wb') as f:
        f.write(response_object.content)
    return filename

url = 'https://chaudhary.page.link/test-zomato-img'
image_path = download_image(url)

img = cv2.imread(image_path)
resized_img = cv2.resize(img, (299, 299))
# preprocess(resized_image)
# prediction_score = model.predict(resized_img)
os.remove(image_path)
```

The problem with this workflow is that we create a lot of unnecessary disk IO.
When you do this for a few images it is fine, but when you're processing
millions of images at zomato scale, this is a lot of wastage.
<!--
Also when we run this in our dockerized environment, we create a lot of temporary files.
-->
We should not have to write it to disk only to later pass it to another function for loading again.

The solution for this is buffered streams.
They provide you an interface similar to Raw I/O device but are actually stored in RAM.
In python, you can create an in memory buffered streams using [`io.BytesIO`][io.BytesIO].
You can simply load the image into an in-memory buffer and this buffer can be passed around as a file pointer.
This buffer is deleted when you call `close` method (or once you go out of context when using context manager).


```python
from io import BytesIO

import cv2
import numpy as np
import requests


url = 'https://chaudhary.page.link/test-zomato-img'
response_object = requests.get(url)
image_data = BytesIO(response_object.content)
file_bytes = np.asarray(bytearray(image_data.read()), dtype=np.uint8)
img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
image_data.close()
resized_img = cv2.resize(img, (299, 299))
# preprocess(resized_image)
# prediction_score = model.predict(resized_img)
```

Since we are using `imdecode`, we don't even have to create a bytes io buffer. 
We can simplify this code as `np.asarray(bytearray(response_object.content), dtype=np.uint8)`

```python
import cv2
import numpy as np
import requests


url = 'https://chaudhary.page.link/test-zomato-img'
response_object = requests.get(url)
file_bytes = np.asarray(bytearray(response_object.content), dtype=np.uint8)
img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
resized_img = cv2.resize(img, (299, 299))
# preprocess(resized_image)
# prediction_score = model.predict(resized_img)
```

To analyse the performance of these methods, I wrote a simple test script. Here are the results on my system:

```
With File IO: 35.4 ms ± 2.07 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
With Bytes IO: 35.1 ms ± 3.05 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
With Direct Decode: 34.6 ms ± 1.74 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
```

The bytes IO is looking better than file IO,
but this is statistically insufficient to prove if one is better than the other.
However we know that the latter methods are not creating unnecessary disk IO, something which isn't measured by this perf test.
We can split this into multiple scripts and add a strace to see the number of OPEN calls, which will be lower in the latter methods.

The code for generating these perf numbers is simple to run and available [here][perf-code-gist].
Please let me know if you are able to reproduce similar results.

<!--
<script src="https://gist.github.com/7b5d7f0957a4aa3c84c010f3d7f27643.js"></script>
-->

[io.BytesIO]: https://docs.python.org/3/library/io.html#io.BytesIO
[perf-code-gist]: https://gist.github.com/7b5d7f0957a4aa3c84c010f3d7f27643
[zblog]: https://www.zomato.com/blog/
