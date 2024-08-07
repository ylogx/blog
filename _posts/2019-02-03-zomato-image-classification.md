---
layout: post
title: Deep Learning for Image Classification
subtitle: "Training and Deploying Zomato's First Deep Learning-Based Image Classifier"
date: '2019-02-03T00:07:40.000+05:30'
author: Shubham Chaudhary
header-img: img/clazzify/fahm-gimp-dark.png
permalink: zomato/ml/images/classification
comments: true
tags:
  - zomato
  - ml
  - classification
  - deep learning
  - neural network
  - alexnet
---

## Introduction
At [Zomato][zomato-homepage], we manage over half a billion images across our platform, with a daily influx of approximately 500 GBs of fresh visual data, totaling close to 100,000 new images every day. This blog details our journey in building a neural network-based machine learning model to classify these images into categories like food, ambiance, menu, etc. We will also discuss the challenges we faced when deploying such a model at Zomato's scale and our learnings from this deployment.

## The Need for Image Classification

As a restaurant search, discovery, and delivery platform, our primary sources of images are:

1. User-generated content from restaurant visit and food order reviews.
2. Professional photography from our restaurant listing team.

Image classification serves several critical functions at Zomato:

1. **User Experience**: We can help users find ambiance images quickly by categorizing images into collections like food and ambiance. Previously, we manually tagged around 10-20 images per restaurant. Automating this process allows us to categorize all images uploaded across the platform.
2. **Content Balance**: The majority of images uploaded on Zomato are food images. By categorizing images, we can surface ambiance images more effectively.
3. **Content Quality**: Ensuring high-quality content is crucial. Automated tagging (e.g., human, selfies) can improve our photo moderation turnaround time.
4. **Menu Management**: Identifying menu images helps our content team verify and ensure that only high-quality menu images are shown to users.

## Building the Classifier

Image classification is straightforward in a Jupyter notebook but challenging at Zomato's scale. We needed a system to moderate close to half a million images daily. This blog post covers our initial model built in 2016 and insights for future retraining.

When building the model, we used [Luigi][luigi-home] to tie our data gathering, data preprocessing, model training, and validation together. Luigi helped us build a DAG-based pipeline, ensuring that each step depended on the completion of previous steps. Luigi also provided a visual interface to monitor the progress of our data and model pipeline.

### Dataset Gathering

Before convincing our PMs about the feasibility of deep learning, we needed a large labeled dataset. Our initial labels were food, ambiance, menu, and human. Future labels could include indoor shots, outdoor shots, drinks, and dishes.

![food, ambiance, menu, human image collage][fahm-collage]

#### Food & Ambiance

We used manually tagged images from Zomato, downloading 50,000 food and 50,000 ambiance images.

#### Menu

Menu dataset generation was straightforward due to our extensive, manually tagged menu collection. We downloaded 50,000 menu images from S3.

#### Humans

Human dataset creation was tricky. We used the [YouTube dataset][youtube-dataset], despite its mixed scenes. Using an initial model, we generated approximate labels, which our moderation team quickly corrected. Additionally, to suppliment this dataset, we used the [LFW dataset][lfw-dataset] for face shots.

![lfw images preview][lfw-images-preview]

### Dataset Preprocessing

With a large dataset categorized into food, ambiance, menu, and human, the next step was preprocessing. We used [Hierarchical Data Format (HDF5)][h5py-home] to build an out-of-memory iterable dataframe. Using the pythonic interface of h5py allowed slicing and dicing terabytes of data, as if they were numpy arrays in-memory. Each image was resized to 227x227, cleaned, and augmented through rotation, scaling, zooming, and cropping. Future retraining might utilize the RecordIO format for storing images.

### Training the Model

We started with [AlexNet][alexnet-paper], a proven [open-source][alexnet-implementation] model in 2016, and also experimented with [Inception v3][inception-v3-paper] and [Google LeNet][goog-lenet-paper]. Given the complexities of setting up TensorFlow back then due to lack of pip packages, we used [Keras][keras] as the framework with [Theano][theano] as the backend. Today, we would still use Keras but with [AWS Sagemaker][aws-sagemaker] for training.

![Alexnet layers description image][alexnet-layers-image]

Our models were initially trained on in-house GPU servers and later on [AWS GPU p2.xlarge instances][aws-gpu-instances]. We trained from scratch to better fit our restaurant domain photos, achieving ~92% validation accuracy with 50,000 images per class (food, ambiance, menu, human).

![Accuracy-Loss Graph][clazzify-accuracy-loss-graph]

### Production Deployment

For serving the model, we developed an internal API using Flask. We enhanced it with authentication layers and deployed it within our internal VPC network. While today, tools like ONNX and TensorFlow Serving are commonly used for model inference, back in 2016, the landscape for ML model inference was still maturing. As a result, we chose to proceed with a Flask-based API.

We containerized the API using Docker, with a Miniconda3 base image. After every code merge, Jenkins would run unit tests and build the final Docker image, which included both the application code and the latest version of the model. Automated tests were then executed on this image to validate the inference accuracy on a predefined set of images. Once these tests passed, the Docker image was deployed to AWS Elastic Beanstalk, where the API could automatically scale based on incoming request load.

Once the API was live, every time an image was uploaded to Zomato, it was queued for processing. Multiple workers would pick the image from the queue, request inference scores from the API, and save these scores in our database.

Initially, we utilized this setup on the backend for moderation and various other internal use cases. On the product side, we made this [live][project-deep-announcement] for Food & Ambiance classification. It was first integrated into our web platform, with upcoming releases soon adding it to our mobile apps. The image below illustrates the impact of using image classification, showing the results before and after its implementation.

![Food Ambiance - results before and after classification][food-ambiance-web-gimp]

This example highlights how image classification can make it easier to find ambiance shots, especially when the initial images on the restaurant page are predominantly food shots.


### Evolution

From our first model, we learned to streamline our data gathering and model training processes significantly to reduce the TAT from an idea to the model generation, reducing time-to-deployment. Future blog posts will cover our evolving ML training processes and other models in production. Stay tuned for updates.

We are rapidly expanding our machine learning team and have grown in number by 5x in just last year. Check out our [careers page][zomato-careers-page] if you’re interested in joining us.


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
[alexnet-layers-image]: {{site.baseurl}}/img/clazzify/alexnet-layers.png
[keras]: https://keras.io/
[theano]: https://github.com/Theano/Theano
[aws-gpu-instances]: https://aws.amazon.com/ec2/instance-types/#Accelerated_Computing
[aws-sagemaker]: https://aws.amazon.com/sagemaker/
[clazzify-accuracy-loss-graph]: {{site.baseurl}}/img/clazzify/accuracy-loss-graph.png
[zomato-careers-page]: https://www.zomato.com/careers
[fahm-collage]: {{site.baseurl}}/img/clazzify/fahm-collage.png
