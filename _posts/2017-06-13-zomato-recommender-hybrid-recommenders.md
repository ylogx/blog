---
layout: post
title: Recommender Systems - Hybrid Recommenders
subtitle: Combining two or more recommenders
date: '2017-06-13T01:00:00.000+05:30'
author: Shubham Chaudhary
permalink: zomato/recommender/hybrid
comments: true
tags:
  - zomato
  - ml
  - machine learning
  - recommender systems
  - matrix factorization
---

You can read the part 1 about [recommender system basics][overview-post], part 2 about [matrix factorization][matrix-factorization-post].

Hybrid Recommenders are recommenders that are made up of multiple recommenders combined together.

# Need for hybrid recommenders
The need for hybrid recommenders arises for the pros and cons of different recommenders.
When using a collaborative recommenders, surfacing items that haven't been visited by any users is a pain.
Whereas when you are using content based recommenders, there are items that are uniquely related to each other, such that only users can surface that pattern.

# Blending


[overview-post]: {{site_url}}/zomato/recommender/overview
[matrix-factorization-post]: {{site_url}}/zomato/recommender/matrix-factorization
