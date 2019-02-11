---
layout: post
title: Deep Learning for image classification
subtitle: Training our first deep learning based image classifier and deploying it to production
date: '2019-02-03T00:07:40.000+05:30'
author: Shubham Chaudhary
header-img: img/clazzify/fahm-gimp-dark.png
permalink: zomato/ml/images/classification
comments: true
published: false
tags:
  - zomato
  - ml
  - classification
  - deep learning
  - neural network
  - alexnet
---

At [Zomato][zomato-homepage] we have more than half a billion images used in various aspects of our platform.
On a daily basis, we deal with close to 100 thousand new images.
When you look at the size of the data, this turns into petabytes of images in total,
with a daily influx of approximately 500 GBs of fresh images.
This blog will go in details about how we built a neural network based machine learning model to classify images based on
their content into categories like food, ambiance, menu etc.
We will also discuss about the challenges we faced when deploying such a model at Zomato's scale and
our learning & evolution from deploying this first model.

## Why do we need to classify images?

<!-- Image classification is the process of categorizing images into bins. -->
As a restaurant search, discovery and delivery platform, the two biggest sources for images are:

1. Images uploaded by users when they visit/order a restaurant and write reviews about them on Zomato
2. Images our team collects from the restaurants while listing them on the platform

At Zomato, we have several use-cases for image classification:

1. We can help users find out ambiance images quickly if we show images in collections like food, ambiance.
Earlier for some restaurants, we manually tagged ~10-20 images as food & ambiance shots.
To make this more useful for our users, we wanted to categorize all images uploaded on any restaurant across platform.
2. The ratio of images uploaded on zomato is heavily biased towards food as compared to ambiance.
This helps quickly surface the ambiance images to users.
3. The quality of the content of our platform is very important to us.
To ensure good content quality, we have a team of moderators who work tirelessly to ensure that only the best content
is show to our users.
Having this tagging like human/selfies etc. will help us improve the overall photo moderation TAT.
4. Along similar lines, if something looks like a menu,
we'd like our content team to have a look at it and not show this to our users.
We want to ensure that only the highest quality menu images are shown to users
(the ones manually verified by our data collection team)

## How we built this?

Image Classification is pretty straight forward from tech standpoint when you're doing it in jupyter notebook.
It was more challenging for us because this was our first deep learning based project going live.
Moreover, to exacerbate our problems, the scale for this was enormous.
We had to build a system that could moderate close to half a million images on a daily basis.
We trained this model for the first time in 2016.
This blog post will be a combination of things that we did when we built this model for the first time and
also pointer to what we would do when retraining this now.

When building the model, we used [luigi][luigi-home] to tie our data gathering, data preprocessing, model training and validation together.
Luigi helped us build all these as a DAG based pipeline, since clearly each step depended on other steps for the final step to be completed.
Luigi also provided a nice visual interface to monitor progress of our data & model pipeline.

### Dataset Gathering:
Before we could prove to our PMs on whether this "new deep learning" based method would work or not,
we needed to collect labeled data - a whole lot of it.
The labels we decided to get started with were - food, ambiance, menu, human.
Future collections could be indoor shots, outdoor shots, drinks, dishes.

![food, ambiance, menu, human image collage][fahm-collage]

#### Food & Ambiance
At zomato, we had manually tagged images, marked as food and ambiance shots.
We downloaded 50,000 each - food and ambiance images for classification problem.

#### Menu
Generating dataset for menus was the easiest.
At zomato we have tons of menus, manually tagged and clustered into categories (that's kinda how the company started).
We downloaded 50,000 menu images from s3 distributed across randomly selected restaurants on zomato.

#### Humans
Finding the right dataset for humans was tricky.
There is a public dataset - [Youtube dataset][youtube-dataset].
The problem with this dataset is that, it contains shots which are mixture of multiple scenes.
For example some images contain humans, but it can also have characteristics of an ambiance shot.
This leads to some incorrect classification which we planned to tackle once we had a basic model ready.
Using this slightly incorrect basic model, we can generate approximate labels
and get them corrected by our internal moderation team much quickly than labelling images from scratch.

<!-- ![confusing image][confusing-youtube-human-image] -->

Youtube dataset did not have a lot of face shots in it.
To help the model learn face shots, we used [lfw dataset by umass][lfw-dataset] aka labeled faces in the wild dataset.

![lfw images preview][lfw-images-preview]

### Dataset Preprocessing
Now after all these exercises, we have a lot of data in our folders - food, ambiance, menu and human.
Next problem is that when you're training a model, you need to iterate over this data as a dataframe and pass it to keras.
We used [Hierarchical Data Format][hdf] ([HDF5][h5py-home]) to build a dataframe that was iterable and stayed out of memory.
Using the [pythonic interface][h5py-docs] of [h5py][h5py-git] you can slice and dice terabytes of data,
as if they were numpy arrays in memory.
We resized each image to 227x227 dimension and performed some cleaning steps.
We created multiple variations of each image by using rotation, scaling, zooming & cropping.
When retraining in future we would also look into using recordio format for storing images for classification tasks.


## Training the Model

We started with [alexnet][alexnet-paper] as our model.
Back in 2016, alexnet was a proven good model with multiple [open source implementations][alexnet-implementation] available.
We also tried [inception v3][inception-v3-paper] and [google lenet][goog-lenet-paper].
At the time of this post, there are several more accurate and optimal models available like resnet, mobilenet etc.
We decided to use [keras][keras] as our framework because we liked its capability to switch the backend engine (theano, tensorflow) in future.
Back then it wasn't as simple as now to install tensorflow `pip install tensorflow`,
so we used [theano][theano] as our engine because it gave reliable, consistent results and was easier to setup with keras.
Keras would still be the choice for writing our models but doing this now we would use something like
[AWS Sagemaker][aws-sagemaker] for training our models.

![Alexnet layers description image][alexnet-layers-image]

We trained the initial few iterations of our models on our in-house GPU servers. Then we shifted to [AWS GPU p2.xlarge
 instances][aws-gpu-instances].
We trained our models from scratch instead of doing transfer learning on an existing imagenet model
to better fit our restaurant industry domain photos.
We had 50000 images for each of our 4 classes - food, ambiance, menu, human.
As shown in the graph below, we were able to achieve ~92% validation accuracy.

![Accuracy-Loss Graph][clazzify-accuracy-loss-graph]


## Deploying this in production

For serving the model, we created an internal API based on flask.
We added authentication layers on top of it and exposed it to our internal vpc network.
Today one would use something like onnx and tensorflow serving for model inference.
Back in 2016, there wasn't much work done on the inference of ML models, so we went ahead with an internal flask API.
We dockerized our API using a docker container based on miniconda3.
After every code merge, jenkins would run the unit tests and create the final docker image.
The docker image will contain both the code and the latest model.
Then we'd run automated tests on this image to check if it is doing good inference on a set of images.
Once this test is passed, we deploy this image on AWS elastic beanstalk,
where this API is auto scaled based on the input request load.

Once this API is up, from our web app whenever an image is uploaded on Zomato, we push it in a queue.
There are multiple workers running that pick the image from the queue,
ask the API for inference scores and save these scores in our database.

We started using this in the backend for moderation and several other internal usecases.
On the product side, we made this [live][project-deep-announcement] for Food Ambiance classification.
We first made this live on the web and apps soon added this in upcoming releases.
Image below show results before and after using image classification.

![Food Ambiance - results before and after classification][food-ambiance-web-gimp]

This example shows how image classification can make it easier to find ambiance shots
in this case when the starting images of the restaurant page are predominantly filled with food shots.


## Evolution

We learnt a lot from training and deploying this first model in production.
Apart from evolving this model, we have evolved our data gathering and model training
process significantly to reduce the TAT from an idea to the model generation and API creation.
We will be making future blog posts about our ML training process and other machine learning models in production soon.
Please stay tuned, watch out for that ML tag and subscribe to the blog.

We are rapidly expanding our machine learning team and have grown in number by 5x in just last year.
We are hiring, please checkout our [careers page][zomato-careers-page].

<!-- Tensorflow Lite -->

<!--https://docs.google.com/presentation/d/1MaFPaTSEMG90qzjFIQbfDdCKT-p0xYqS7C6Pz-W6sZE/edit#slide=id.g198284fc4a_0_65-->

[food-ambiance-web]: {{site.baseurl}}/img/clazzify/food-ambiance.png
[food-ambiance-web-gimp]: {{site.baseurl}}/img/clazzify/food-ambiance-in-product.png
[project-deep-announcement]: https://twitter.com/ylogx/status/844817269297311744
[confusing-youtube-human-image]: {{site.baseurl}}/img/clazzify/human_in_action_1.jpg
[lfw-images-preview]: {{site.baseurl}}/img/clazzify/lfw_six_face_panels.jpg
[youtube-dataset]: http://www.cs.ucf.edu/~liujg/YouTube_Action_dataset.html
[lfw-dataset]: http://vis-www.cs.umass.edu/lfw/
[zomato-homepage]: https://www.zomato.com
[h5py-home]: https://www.h5py.org/
[h5py-git]: https://github.com/h5py/h5py
[h5py-docs]: http://docs.h5py.org/en/stable/quick.html
[hdf]: https://en.wikipedia.org/wiki/Hierarchical_Data_Format
[luigi-home]: https://github.com/spotify/luigi
[alexnet-paper]: https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf
[inception-v3-paper]: https://arxiv.org/pdf/1512.00567.pdf
[goog-lenet-paper]: https://www.cs.unc.edu/~wliu/papers/GoogLeNet.pdf
[alexnet-implementation]: https://github.com/Zomato/convnets-keras
[alexnet-layers-image]:  {{site.baseurl}}/img/clazzify/alexnet-layers.png
[keras]: https://keras.io/
[theano]: https://github.com/Theano/Theano
[aws-gpu-instances]: https://aws.amazon.com/ec2/instance-types/#Accelerated_Computing
[aws-sagemaker]: https://aws.amazon.com/sagemaker/
[clazzify-accuracy-loss-graph]: {{site.baseurl}}/img/clazzify/accuracy-loss-graph.png
[zomato-careers-page]: https://www.zomato.com/careers
[fahm-collage]: {{site.baseurl}}/img/clazzify/fahm-collage.png
