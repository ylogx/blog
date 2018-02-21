---
layout: post
title: Paper Summary - End to End Interpretation of French Street Name Signs Dataset
date: '2018-02-21T11:00:51.000+05:30'
author: Shubham Chaudhary
permalink: papers/ml/fsns
header-img: img/fsns/header.png
comments: true
tags:
  - paper
  - summary
  - lstm
  - cnn
---

This is a summary for the research paper [End-to-End Interpretation of the French Street Name Signs Dataset][paper-ete-fsns].

This is a model that takes the multiple shots of street view signs as input and outputs the name in the format that will be directly shown in google maps.
A full end to end model. This includes reading image, parsing text, converting text for google maps standard and combining text from multiple images into the
most accurate version. Pretty interesting problem and solution. This is one of the inspiration paper for Tesseract LSTM model.
<!--This presents multiple ideas that can be applied to our problem.-->

First of all they broke the street sign transcription (img to text) into a simpler problem for their human moderators.
They detected the street signs using a neural network that gave the bounding box of street signs. Then they collected
multiple views of same sign using image capture geo coordinates. Then each image was transcribed using ocr,
recaptcha and human respectively. OCR gave basic data for recaptcha, humans verifies recaptcha input, incorrect
transcriptions were forwarded to humans. They never transcribed the text as it was shown in image, but the was
they wanted it to be shown in Google Maps.

![img-fsns-tiles][img-fsns-tiles]

<!--We can do something similar where we break the task of parsing menu from parsing entire menu to validating a blob of text.-->

## Recurrent Model - STREET
Then using this dataset they trained the [STREET model][gh-street] (StreetView Tensorflow Recurrent End-to-End
Transcription) for the end to end problem, from using a set of 4 views of street sign as input to transcribing the
street name to be used in Maps as output.

![image fsns network][img-fsns-network]

### CNN
Images are detiled into 4 images from single image, 2 convolution with max pooling is applied to reduce
dimensions from 150x150 to 25x25.

![img-fsns-conv][img-fsns-conv]

### Text Finding & Reading
Vertically summarizing Long Short-Term Memory (LSTM) cells are used to find text lines.
A vertically summarizing LSTM is a summarizing LSTM that scans the input **vertically**.
It is thus expected to compute a vertical summary of its input, which will be taken from the last vertical timestep.

![img-fsns-lstm][img-fsns-lstm]

Three different vertical summarizations are done and then combined later:

1. Upward to find the top textline.
2. Separate upward and downward LSTMs, with depth-concatenated outputs, to find the middle
textline.
3. Downward to find the bottom textline.

Although each vertically summarizing LSTM sees the same input, and could theoretically summarize
the entirety of what it sees, they are organized this way so that they only have to produce a summary
of the most recently seen information.

Since the _middle line is harder to find, that gets two LSTMs working in opposite directions_.
Each output from the CNN layers are passed to a separate bi-directional horizontal LSTM to recognize the text.
Bidirectional LSTMs have been shown to be able to read text with high accuracy.
The outputs of the bidirectional LSTMs are concatenated in the **x-dimension**, to string the text lines out in
reading order.

### Character Position Normalization and Combination of individual outputs
All four input images may have text positioned differently, the network is provided ability to shuffle data in x
dimension by adding two more LSTM layers - scanning left to right & right to left.

![img-fsns-cpn][img-fsns-cpn]

After this a unidirectional LSTM is used to combine the four views of each input image to produce the most accurate
text. This is the layer that will also learn the Title Case normalization. A 50% dropout if added b/w reshape for
regularization.

![img-fsns-comb][img-fsns-comb]

## Final Network

![img-fsns-layers][img-fsns-layers]


[paper-ete-fsns]: https://arxiv.org/abs/1702.03970
[img-ocr-datasets]: https://i.imgur.com/VJoGHfR.png
[img-fsns-network]: https://i.imgur.com/gu4JEjs.png
[img-fsns-conv]: https://i.imgur.com/tpyIs9I.png
[img-fsns-lstm]: https://i.imgur.com/GWEZWhb.png
[img-fsns-cpn]: https://i.imgur.com/Y7JHNKd.png
[img-fsns-comb]: https://i.imgur.com/FP4ebp7.png
[img-fsns-layers]: https://i.imgur.com/UBTlcBE.png
[img-fsns-tiles]: https://i.imgur.com/U9gaBqG.png
[gh-street]: https://github.com/tensorflow/models/tree/master/street
