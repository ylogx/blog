---
layout: post
title: Deep Learning for image classification
subtitle: Training an image classifier and deploying it to production
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

<!-- TODO: Use case for an image classifier -->
Image classification is the process of categorizing images into bins.

Working at Zomato - a restaurant search and discovery platform, we have two main sources for images uploaded on the platform:

1.  Images uploaded by the moderators when creating new restaurant listing
2.  Images uploaded by users when they visit a restaurant


At Zomato, we had several use-cases for image classification:
1.
2.
3.

Earlier we had two source from where we could gather food, ambience shot data.
When moderators were uploading images for any restaurant, they had an option to mark an image as food or ambience shot.
But this data was very limited. Moderators only uploaded very few images, ~10-20 per restaurant. Now if you divide that into two categories, show 5-10 images is not much useful from product standpoint.

Humans can only do so much. We badly needed to automate this and have the capability to moderate all the user generated images.

Apart from the food vs ambience image classification, we had another use-case where we wanted to remove any image that contained humans in it.
Automated image moderation - we don't show images with humans in them.


 Helps:


# Dataset Creation:

### Food & Ambience
At zomato, we had manually tagged images, marked as food and ambience shots. We downloaded 50,000 each - food and ambience images for classification problem.

### Menu
Generating dataset for menus was the easiest. At zomato we have tons of menus, manually tagged and clustered into categories (that's kinda how the company started). We downloaded 50,000 menu images from s3 distributed across randomly selected restaurants on zomato.

### Humans
Finding the right dataset for humans was tricky. There is a public dataset - [Youtube dataset][youtube-dataset]. The problem with this dataset is that, it contains shots like the following image. This contains human, but it can also has characteristics of an ambience shot. This confuses the ambience and human classifiers and leads to incorrect classification.

Youtube dataset didn't have a lot of face shots in it. To help the model learn face shots, we used [lfw dataset][lfw-dataset].

![confusing image][confusing-youtube-human-image]


[F/A classification][project-deep-announcement]

![Food Ambiance][food-ambience-web] Image show results before and after classification


<!--https://docs.google.com/presentation/d/1MaFPaTSEMG90qzjFIQbfDdCKT-p0xYqS7C6Pz-W6sZE/edit#slide=id.g198284fc4a_0_65-->

[food-ambience-web]: {{site.baseurl}}/img/food-ambience.png
[project-deep-announcement]: https://twitter.com/ylogx/status/844817269297311744
[confusing-youtube-human-image]: {{site.baseurl}}/img/food-ambience.png?FIXME
[youtube-dataset]: {{site.baseurl}}/img/food-ambience.png?FIXME
[lfw-dataset]: {{site.baseurl}}/img/food-ambience.png?FIXME
# FIXME: Fix this
