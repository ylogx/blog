---
layout: post
title: Use In-Memory Buffers to Avoid Disk IO
subtitle: Optimizing Image Processing with BytesIO in Python
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

At [Zomato][zblog], we handle a vast number of images, with close to a hundred thousand new images daily. Often, we need to download, process, and then pass these images to our models. The traditional workflow involves fetching an image from a URL, saving it to a file, and then passing that file path for further processing.

### Traditional Workflow

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
# preprocess(resized_img)
# prediction_score = model.predict(resized_img)
os.remove(image_path)
```

While this approach works for a few images, it creates significant unnecessary disk IO when processing millions of images at Zomato's scale. Additionally, in a dockerized environment, it results in numerous temporary files.

### Optimized Workflow with In-Memory Buffers

To eliminate unnecessary disk IO, we can use in-memory buffers. In Python, `io.BytesIO` allows you to create a buffer in RAM, which can be used like a file pointer and is automatically deleted when closed or goes out of context when using context manager.

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
# preprocess(resized_img)
# prediction_score = model.predict(resized_img)
```

Using `imdecode`, we can simplify the process further, eliminating the need for a bytes IO buffer.

```python
import cv2
import numpy as np
import requests

url = 'https://chaudhary.page.link/test-zomato-img'
response_object = requests.get(url)
file_bytes = np.asarray(bytearray(response_object.content), dtype=np.uint8)
img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
resized_img = cv2.resize(img, (299, 299))
# preprocess(resized_img)
# prediction_score = model.predict(resized_img)
```

### Performance Analysis

To analyze the performance of these methods, I conducted a simple test. Here are the results on my system:

```
With File IO: 35.4 ms ± 2.07 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
With Bytes IO: 35.1 ms ± 3.05 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
With Direct Decode: 34.6 ms ± 1.74 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
```

The Bytes IO reduce unnecessary disk IO, which isn't measured in this test, even though the performance difference is minimal. Splitting the process into multiple scripts and adding `strace` can help see the number of `OPEN` calls, which will be lower in the in-memory methods.

You can find the code to generate these performance numbers [here][perf-code-gist]. Let me know if you achieve similar results.

<!--
<script src="https://gist.github.com/7b5d7f0957a4aa3c84c010f3d7f27643.js"></script>
-->

[io.BytesIO]: https://docs.python.org/3/library/io.html#io.BytesIO
[perf-code-gist]: https://gist.github.com/7b5d7f0957a4aa3c84c010f3d7f27643
[zblog]: https://www.zomato.com/blog/

### Conclusion

Using in-memory buffers can significantly optimize image processing workflows by reducing disk IO. This approach is especially beneficial at large scales, such as at Zomato, where it can lead to considerable performance improvements and resource savings.
