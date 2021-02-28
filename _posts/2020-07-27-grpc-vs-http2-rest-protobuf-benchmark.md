---
layout: post
title: gRPC vs HTTP2 with protobuf
subtitle: Benchmarking the performance to decide sticking with HTTP2/REST APIs or moving to gRPC world
date: '2020-07-27T01:22:46.973374000-04:00'
author: Shubham Chaudhary
# TODO: Replace with benchmark image
header-img: img/grpc/grpc-intro-dark.png
permalink: grpc-vs-http2-rest-protobuf-benchmark
comments: true
published: false
tags:
  - scalability
  - grpc
  - http2
  - engineering
---

## Background/Overview
### gRPC
[gRPC][grpc-home] is a high-performance, open source universal RPC framework.
If you're not familiar with gRPC, this might not be the right post for you.
I'd recommend you to visit [these documentations][grpc-docs] first.

#### Brief Overview
from [gRPC intro][grpc-intro]

> In gRPC, a client application can directly call a method on a server application on a different machine as if it were a local object, making it easier for you to create distributed applications and services. As in many RPC systems, gRPC is based around the idea of defining a service, specifying the methods that can be called remotely with their parameters and return types. On the server side, the server implements this interface and runs a gRPC server to handle client calls. On the client side, the client has a stub (referred to as just a client in some languages) that provides the same methods as the server.

![grpc intro][grpc-intro-img]

### Protobuf
[Protobuf][protobuf-home] is a replacement for data exchange format like JSON/XML.
The response is binary output and has a very low overhead/footprint.

### REST + JSON
REST + JSON has been the market standard for a long time. Earlier servers also used XML in place of JSON.
REST methods like GET/POST/PUT/DELETE are easy to understand and easy to mold into the existing usecases.

### HTTP2
HTTP2 is an amazing development in the world of HTTP.
You can checkout this nice demo from golang.org of [HTTP/1.0][http-1-demo] vs [HTTP/2.0][http-2-demo] where an image comprised of many tiles is loaded and each tile corresponds to an HTTP request.
There has been wide adoption from the existing cloud providers and CDNs.

### Best Parts
According to me, the following things stands out:
* protobuf saves the hassle of writing the code to convert native objects to json on the server side and back to the objects on client side. You can use generated code to replace all json ser/deser with the generated code.
* gRPC expands on this and allows using the generated methods like any other object and stop bothering about how the networking is working under the hood.
* HTTP/REST has been the standard for a long time and REST methods have been tried and tested to fit into all the existing applications

## Problem Definition
The major underlying benefit of gRPC is usually that it uses HTTP2 to avoid unnecessary handshakes and protobuf for a very small footprint of the response.
If these are the two major contributors to the superior performance of gRPC, a REST API that uses HTTP2 with protobuf as the response type should also perform just as well.
This way I can just easily convert my existing GET/POST/... requests to return responses using protobuf and enable HTTP2 on my server.
I want to validate this hypothesis that using a HTTP2/REST + protobuf API performances similar to gRPC based API.

### Let's get cracking

#### Benchmarking tool
There are several benchmarking tools but after looking through some of these, I finalized on the following:

* For REST api, we can use: [serverless-artillery][serverless-artillery]
* For gRPC, the current best is: [ghz][ghz]

#### Code Setup

##### Web Servers
I will create three web servers:
* HTTP/REST + JSON
* HTTP2/REST + protobuf
* gRPC

All the web server code will be same and the only different will be the output serialization method and the transporting method used.
I'll deploy these on a standard Google Cloud compute instance (equivalent of AWS EC2 instance).

##### Client Code
Since gRPC code is accessed using a client as a method, I will create a client to access this code.
This setup will also depend on what each benchmarking tool allows e.g. serverless artillery makes direct HTTP calls, ghz must require some other setup TODO.



[grpc-home]: https://grpc.io/
[grpc-docs]: https://grpc.io/docs/
[grpc-intro]: https://grpc.io/docs/what-is-grpc/introduction/
[grpc-intro-img]: img/grpc/grpc-intro.png
[protobuf-home]: https://developers.google.com/protocol-buffers/docs/overview
[serverless-artillery]: https://artillery.io/docs/basic-concepts/
[ghz]: https://ghz.sh/
[http-1-demo]: https://http1.golang.org/gophertiles?latency=200
[http-2-demo]: https://http2.golang.org/gophertiles?latency=200
[http3]: https://www.fastly.com/blog/why-fastly-loves-quic-http3
