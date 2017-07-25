---
layout: post
title: Recommender Systems - Overview
subtitle: Overview of recommender system in 2017 and related jargon
date: '2017-06-12T00:00:00.000+05:30'
author: Shubham Chaudhary
permalink: zomato/recommender/overview
comments: true
tags:
  - zomato
  - ml
  - machine learning
  - recommender systems
---

## Job of a recommender
At the root level, the job of a recommender is to automatically predict how much a user will like an item.

The input for a recommender can be:

* Past behavior
* Relation to other users
* Item similarity
* Context

The core of recommendation system can be dialed down to a data mining problem.

![data-mining-problem][data-mining-problem]

The main requirements for recommender systems are:

* _Serendipity_ - recommend good new items that are different from my direct taste
* _Diversity_ - recommend different type of items
* _Awareness_
* _Explanation_ - ability to explain any given recommendation
* _User Interface_ - conveying the recommendation to user in a friendly way
* _Efficiency_
* _Scalability_
* _Privacy_


## User Feedback
When you start looking into recommender system papers, there are two types of feedback classifications that are mentioned regularly:

### Explicit feedback
When I go and rate an app 4.5 star on the app store, that is an explicit feedback.

### Implicit feedback
Keeping the same analogy, when I search for an app on the app store and I click on an app in results and then return back immediately, that's an implicit feedback that the app I saw was not what I was looking for.


## Evolution of recommender systems
The very first recommender systems were optimized to accurately predict the rating users was going to give to any given item. This gave rise to the famous million dollars [_Netflix Prize_][netflix-prize] competition.

![evolution-of-recommender-systems][evolution-of-recommender-systems]

But as time evolved, the relevancy of optimizing for ratings reduced. Case in point is that users are less likely to give explicit feedback as compared to implicit feedback in new products. There are tons of implicit signals all across products, which make them much more exhaustive and important data.


## Learning to rank
[Learning to rank][ltr-wiki] aims to apply machine learning to create models for ranking data. More concretely, given a training data that consists of lists of items in some order, the ranking model's purpose is to rank/reorder the items in new, unseen lists in a way which is "similar" to rankings in the training data in some sense.


## Papers
Google Scholars has [a comprehensive list][scholars-recommender-systems] of authors with influential papers in the field of recommender systems.


## References
* [Past Present Future of recommenders][past-present-future-of-recommender]


[data-mining-problem]: {{site.baseurl}}/img/recommenders/data-mining-problem.png
[evolution-of-recommender-systems]: {{site.baseurl}}/img/recommenders/evolution-of-recommender-systems.png

[scholars-recommender-systems]: https://scholar.google.co.in/citations?view_op=search_authors&hl=en&mauthors=label:recommender_systems
[past-present-future-of-recommender]: https://www.slideshare.net/xamat/past-present-and-future-of-recommender-systems-an-industry-perspective
[netflix-prize]: http://www.netflixprize.com/assets/GrandPrize2009_BPC_BellKor.pdf
[ltr-wiki]: https://en.wikipedia.org/wiki/Learning_to_rank
