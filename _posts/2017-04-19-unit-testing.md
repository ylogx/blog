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

I have been planning to write this post since August, 2015\. A lot has gone by since then. I was working on Android apps back then. Since then I have moved from working on backend apis, to working on machine learning applications.

> Is it really so hard to unit test android application?

# Why?

> Well all well and good but I'd rather prefer to go watch a movie than waste my time writing extra code.

I totally agree, movies are awesome, and we "" are inherently lazy but just imagine if you would, you had been writing code for past week like crazy, you created 3 super freaking amazing features. You did the release and everything was looking so good. You went home, called your friend, bought tickets for the best movie ever, bought popcorn for you and your special one and all of a sudden from nowhere your phone rings, and you find out that something is broken in the production code. Well what can you do? You go home, open you laptop, start digging through the code, attach debuggers, step through each line, and find out that it was all because your dear colleague changed a condition or flipped a boolean. How'd that feel huh?

Sitting there wondering, you think if only you had something that could tell that _stupid_ fellow that field `mOnlyPositiveInteger` should never be set to negative.

> How?

Writing tests in a completely untested codebase:

- Start by writing tests for most trivial stuff.
- Building the entire framework for testing is the most crucial step 0
- Slowly and gradually start writing tests for complicated stuff
- In no time, you'll be writing tests for all new code that you write

> What should I be testing?

> How much should I test?

Start by testing easiest pieces of code. Setting up the basics is the crucial step 0\. Start writing tests for inbuilt library features. They act as expectation documentation and also help you when you are updating any library. As you develop a good chunk of helper methods and custom assertions, you should gradually pump up your coverage. Start testing tougher beasts.

One of the technique that has been really helpful for me is to -- first write tests for all bugs. They failure of test acts as a proof of failure. This also helps make sure that bug report is valid and repeatable. Then do your thing, fix the bug and make sure that the test passes. This practice is also brilliant because it pays its price right then and there. You save a lot of time by not having to repeat the tedious steps from the bug report again and again. At the end, hey, you just created a regression test for future. You're never going to see this bug ever again now (as long as CI works).

> This logic was very difficult to write. It will be equally difficult to test it. I will just leave it as it is and make sure that no body changes it?

No it isn't hard. You're just lazy. It's fun to write code.

> Wait, FTW is unit testing. Really, well go check this out.

<!-- TODO: Quora link for two developers. -->
