---
layout: post
title: Deep Learning for image classification
subtitle: Training our first deep learning based image classifier and deploying it to production
date: '2017-05-01T00:00:00.000+05:30'
author: Shubham Chaudhary
permalink: zomato/ml/classification
comments: true
tags:
  - zomato
  - ml
  - classification
  - deep learning
  - neural network
  - alexnet
---

## Why we needed image classifier

Image classification is the process of categorizing images into bins.
Working at [Zomato][zomato-homepage] - a restaurant search and discovery platform,
we have two main sources for images uploaded on the platform:

1. Images uploaded by users when they visit a restaurant and write reviews about them on Zomato
2. Images uploaded by the data collection when we create new restaurant page

At Zomato, we had several use-cases for image classification:

1. We can help users find out ambiance images quickly if we show images in collections like food, ambiance.
Earlier we had two source from where we could gather food, ambiance shot data.
When moderators were uploading images for any restaurant, they had an option to mark an image as food or ambiance shot.
But this data was very limited. Moderators only uploaded very few images, ~10-20 per restaurant. Now if you divide
that into two categories, show 5-10 images is not much useful from product standpoint. We wanted to split all images
uploaded on any restaurant.
Future collections could be indoor shots, outdoor shots, drinks, dishes.
2. We want to remove selfies from showing up on restaurant page,
so detecting humans & selfies helps the moderation team take decisions quickly.
Human moderators can only do so much. We badly needed to automate this to improve our overall photo moderation TAT.
3. Along similar lines, if something looks like a menu,
we'd like our content team to have a look at it and not show this to users.
We want to ensure that only the highest quality menu images are shown to users
(the ones manually verified by our data collection team)
4. The ratio of images uploaded on zomato is heavily biased towards food as compared to ambiance.
This helps quickly surface the ambiance images to users.

## How will we build this

Image Classification is pretty straight forward from tech standpoint when you're doing it in jupyter notebook.
It was more challenging for us because this was our first deep learning based project going live.
Moreover to exacerbate our problems, the scale for this was enormous.
We had to build a system that could moderate close to half a million images on a daily basis.
We trained this model for the first time in 2016.
This blog post will be a combination of things that we did when we built this model for the first time and
also pointer to what we would do when retraining this now.

When building the model, we used [luigi][luigi-home] to tie our data gathering, data preprocessing, model training and validation together.
Luigi helped us build all these as a DAG based pipeline, since clearly each step depended on other steps for the final step to be completed.
Luigi also provided a nice visual interface to monitor progress of our data & model pipeline.

### Dataset Gathering:
Before we could prove to our PMs on whether this "new deep learning" based method would work or not,
we needed to collect labelled data - a whole lot of it.
The labels we decided to get started with were - food, ambiance, menu, human.

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
The problem with this dataset is that, it contains shots like the following image.
This contains human, but it can also has characteristics of an ambiance shot.
This confuses the ambiance and human classifiers and leads to incorrect classification.

![confusing image][confusing-youtube-human-image]

Youtube dataset didn't have a lot of face shots in it. To help the model learn face shots, we used [lfw dataset][lfw-dataset].

![lfw images preview][lfw-images-preview]

### Dataset Preprocessing
Now after all this we have a lot of data in four folders - food, ambiance, menu, human.
Next problem is that when you're training model, you need this data as a dataframe to be passed to keras.
We used [Hierarchical Data Format][hdf] ([HDF5][h5py-home]) to build a dataframe that was iterable and stayed out of memory.
Using the [pythonic interface][h5py-docs] of [h5py][h5py-git] you can slice and dice terabytes of data,
as if they were numpy arrays in memory.
When retraining we would also look into using recordio format.
We resized each image to 227x227 dimension, performed some cleaning steps.
We created multiple variations of each image by using rotation, scaling, zooming & cropping.


## Training the Model

In 2016, alexnet was the thing.
We started with [alexnet][alexnet-paper] as our [model][alexnet-implementation].
We also tried [inception v3][inception-v3-paper] and [google lenet][goog-lenet-paper].
Today we'd look at models like resnet and mobilenet.
We decided to use [keras][keras] as our framework because we liked its capability to switch the backend engine (theano, tensorflow) in future.
Back then it wasn't as simple as now to install tensorflow `pip install tensorflow`,
so we used [theano][theano] as our engine because it gave reliable, consistent results and was easier to setup with keras.
Keras would still be the choice for writing our models but doing this now we would use something like AWS
Sagemaker for training our models.

![Alexnet layers description image][alexnet-layers-image]

We trained the initial few iterations of our models on our in-house GPU servers. Then we shifted to [AWS GPU p2.xlarge
 instances][aws-gpu-instances].
We trained our models from scratch instead of doing transfer learning on an existing imagenet model
to better fit our restaurant industry domain photos.
We had 50000 images for each of our 4 classes - food, ambiance, menu, human.
As shown in the graph below, we were able to achieve ~92% validation accuracy.

![Accuracy-Loss Graph][clazzify-accuracy-loss-graph]


## Deploying this in production

For serving the model, we created an internal api based on flask.
We added authentication layers on top of it and exposed it to our internal vpc network.
Today you'd used something like onnx or tensorflow serving.
Back in 2016, there wasn't much work done on the inference of ML models, so we went ahead with this internal flask API.
We dockerized this API in a docker container based on miniconda3.
After every code merge, jenkins would run the unit tests and create the final docker image.
The docker image will contain both the code and the latest model.
Then we'd run automated tests on this image to check if it is doing good inference on a set of images.
Once this test is passed, we deploy this image on AWS elastic beanstalk, where this API is auto scaled based on the input load.

Once this api is up, from our web side whenever a image is uploaded on Zomato, we push it in a queue.
There are multiple workers running that pick the image from the queue, ask this api for inference scores and save these scores in our database.

We started using this in the backend for moderation and various other usecases in 2016.
We finally made this live on the product side [on 23 Mar 2017][project-deep-announcement] for Food Ambiance classification.
We first made this live on the web and apps soon added this in upcoming release.
Image below show results before and after using image classification.

![Food Ambiance - results before and after classification][food-ambiance-web]

This example clearly shows how image classification can make it easier to find food shots
in this case when the starting images of the restaurant page are predominantly filled with ambiance shots.


## Evolution

We learnt a lot from making this first model live.
Apart from evolving this model, we have evolved our data gathering and model training
process significantly to reduce the TAT from idea to model generation and api creation.
We will be making future blog posts about this soon. Please stay tuned, watch out for that ML tag and subscribe to the blog.

We are rapidly expanding our machine learning team and have grown in number by 5x in just last year.
We are hiring, please checkout our [careers page][zomato-careers-page].

<!-- Tensorflow Lite -->

<!--https://docs.google.com/presentation/d/1MaFPaTSEMG90qzjFIQbfDdCKT-p0xYqS7C6Pz-W6sZE/edit#slide=id.g198284fc4a_0_65-->

[food-ambiance-web]: {{site.baseurl}}/img/clazzify/food-ambiance.png
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
[clazzify-accuracy-loss-graph]: {{site.baseurl}}/img/clazzify/accuracy-loss-graph.png
[zomato-careers-page]: https://www.zomato.com/careers
