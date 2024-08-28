---
layout: post
title: Spark Streaming
subtitle: Overview about batch processing vs stream processing in spark
date: '2017-07-26T00:35:00.000+05:30'
author: Shubham Chaudhary
permalink: spark-streaming
comments: true
tags:
  - zomato
  - ml
  - machine learning
  - spark
  - streaming
  - spark streaming
---

## Extract Transform Load (ETL)
[ETL][etl-wiki] process is to _fetch_ data from different types of systems, _structure_ it and _save_ it into the destination database.

![ETL Pipeline](https://i.imgur.com/xyD2KsE.jpg)

## Batch
In the case of a batch job, the query will be run on the data saved at `source-path` and the transformed data will be saved at the destination `dest-path`.

![Batch Job](https://i.imgur.com/I7uQvCT.png)

## Streaming
In the case of a streaming job, the query will run on the data continuously from `source-path` and transformed data will be appended in the destination `dest-path` again and again as data comes in.

![Batch Job converted to streaming](https://i.imgur.com/SYOgWWV.png)


### Merging static data (DB) with streaming data
There might be use cases where you want to merge static data (e.g. MySQL) with the streaming data. You can do this as follows:

![Joining Streaming Data](https://i.imgur.com/8tyNqcT.png)


## Executing the Job

### Batch Execution
![Batch Plan](https://i.imgur.com/21afWnk.png)
![Batch Plan Execution](https://i.imgur.com/6dXWnmn.png)

### Stream Execution
With the planner's logical plan, incremental execution plan is generated on top of it
![Incremental](https://i.imgur.com/JV1wQcb.png)


## Resources
* [Apache Spark 2.0: A Deep Dive Into Structured Streaming - by Tathagata Das](https://www.youtube.com/watch?v=rl8dIzTpxrI)

[etl-wiki]: https://en.wikipedia.org/wiki/Extract,_transform,_load
