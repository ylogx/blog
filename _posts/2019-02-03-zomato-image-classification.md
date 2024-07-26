---
layout: post
title: Deep Learning for Image Classification
subtitle: Training and Deploying Our First Deep Learning-Based Image Classifier
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

At [Zomato][zomato-homepage], we manage over half a billion images across our platform, with a daily influx of approximately 500 GBs of new images, totaling close to 100,000 images every day. This blog details our journey in building a neural network-based machine learning model to classify these images into categories like food, ambiance, menu, etc. We will also discuss the challenges we faced when deploying such a model at Zomato's scale and our learnings from this deployment.

## Why Do We Need to Classify Images?

As a restaurant search, discovery, and delivery platform, our two primary sources for images are:

1. User-uploaded images when they visit or order from a restaurant and write reviews.
2. Images collected by our team from restaurants during the listing process.

At Zomato, image classification serves several use cases:

1. **User Experience**: We can help users find ambiance images quickly by categorizing images into collections like food and ambiance. Previously, we manually tagged around 10-20 images per restaurant. Automating this process allows us to categorize all images uploaded across the platform.
2. **Content Balance**: The majority of images uploaded on Zomato are food images. By categorizing images, we can surface ambiance images more effectively.
3. **Content Quality**: Ensuring high-quality content is crucial. Automated tagging (e.g., human, selfies) can improve our photo moderation turnaround time.
4. **Menu Management**: Identifying menu images helps our content team verify and ensure that only high-quality menu images are shown to users.

## How We Built This

Image classification is straightforward in a Jupyter notebook but challenging at Zomato's scale. We needed a system to moderate close to half a million images daily. This blog post covers our initial model built in 2016 and insights for future retraining.

### Dataset Gathering

Before convincing our PMs about the feasibility of deep learning, we needed a large labeled dataset. Our initial labels were food, ambiance, menu, and human. Future labels could include indoor shots, outdoor shots, drinks, and dishes.

![food, ambiance, menu, human image collage][fahm-collage]

#### Food & Ambiance

We used manually tagged images from Zomato, downloading 50,000 food and 50,000 ambiance images.

#### Menu

Menu dataset generation was straightforward due to our extensive, manually tagged menu collection. We downloaded 50,000 menu images from S3.

#### Humans

Human dataset creation was tricky. We used the [YouTube dataset][youtube-dataset], despite its mixed scenes. Using an initial model, we generated approximate labels, which our moderation team quickly corrected. Additionally, we used the [LFW dataset][lfw-dataset] for face shots.

![lfw images preview][lfw-images-preview]

### Dataset Preprocessing

With a large dataset categorized into food, ambiance, menu, and human, the next step was preprocessing. We used [HDF5][h5py-home] to build an out-of-memory iterable dataframe. Each image was resized to 227x227, cleaned, and augmented through rotation, scaling, zooming, and cropping. Future retraining might utilize the RecordIO format for storing images.

### Training the Model

We started with [AlexNet][alexnet-paper], a proven model in 2016, and also experimented with [Inception v3][inception-v3-paper] and [Google LeNet][goog-lenet-paper]. Given the complexities of setting up TensorFlow back then, we used [Theano][theano] as our backend with [Keras][keras] as the framework. Today, we would use [AWS Sagemaker][aws-sagemaker] for training.

![Alexnet layers description image][alexnet-layers-image]

Our models were initially trained on in-house GPU servers and later on [AWS GPU p2.xlarge instances][aws-gpu-instances]. We trained from scratch to better fit our restaurant domain photos, achieving ~92% validation accuracy with 50,000 images per class (food, ambiance, menu, human).

![Accuracy-Loss Graph][clazzify-accuracy-loss-graph]

### Deploying This in Production

We created an internal API based on Flask for model inference, later deploying it on AWS Elastic Beanstalk with Docker. Jenkins automated our deployment pipeline, running tests and creating Docker images containing the code and model. This API processed images in real-time, improving our moderation and user experience.

When an image is uploaded on Zomato, it is pushed to a queue, processed by multiple workers, and the classification scores are saved in our database. This system was initially used for backend moderation and later for live Food-Ambiance classification on our web and app platforms.

![Food Ambiance - results before and after classification][food-ambiance-web-gimp]

### Evolution

From our first model, we learned to streamline our data gathering and model training processes, reducing time-to-deployment. Future blog posts will cover our evolving ML training processes and other models in production. Stay tuned for updates.

We are rapidly expanding our machine learning team. Check out our [careers page][zomato-careers-page] if you’re interested in joining us.

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
