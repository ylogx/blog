---
layout: post
title: Unit Testing
subtitle: 'Is it really that freaking hard, No.'
date: '2015-08-28T00:00:00.000+05:30'
author: Shubham Chaudhary
permalink: unit-testing
comments: true
tags:
  - android
  - testing
  - unittest
  - unit test
  - robolectric
---

I have been planning to write this post since August, 2015. A lot has gone by
since then. I was working on Android apps back then. Since then I have moved
from working on backend apis, to working on machine learning applications.

> Is it really so hard to unit test android application?

> Why?
> Well all well and good but I'd rather prefer to go watch a movie than waste
my time writing extra code.
I totally agree, movies are awesome, and we "" are inherently lazy but just
imagine if you would, you had been writing code for past week like crazy, you
created 3 super freaking amazing features. You did the release and everything
was looking so good. You went home, called your friend, bought tickets for the
best movie ever, bought popcorn for you and your special one and all of a
sudden from nowhere you phone rings, and you find out that something is broken
in the production code. Well what can you do? You go home, open you laptop,
start digging through the code, attach debuggers, step through each line, and
find out that it was all because your dear collegue changed a condtion or
flipped a boolean. How'd that feel huh?

If only you had something that could tell that _stupid_ fellow that field
<code>mOnlyPositiveInteger</code> should never be set to negative.

> How?
Writing tests in a completely untested codebase:
* Start by writing tests for most trivial stuff.
* Building the entire framework for testing is the most crucial step 0
* Slowly and gradually start writing tests for complicated stuff
* In no time, you'll be writing tests for all new code that you write

> What should I be testing?

> How much should I test?

> This logic was very difficult to write. It will be equally diffuclt to test it.
I will just leave it as it is and make sure that no body changes it?


No it isn't hard. You're just lazy. It's fun to write code.
###########################################################


> Wait, FTW is unit testing.
Really, well go check this out.


<!-- TODO: Quora link for two developers. -->
