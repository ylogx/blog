---
layout: post
title: Machine Learning Software Development
subtitle: <TODO>
date: '2020-05-01T14:09:16.015016000-04:00'
author: Shubham Chaudhary
header-img: img/<TODO>
permalink: <TODO>
comments: true
tags:
  - ml
  - software development
---

<!-- Quote from google website about doing ML as software engineers -->

When we are doing machine learning model development, a lot of the aspects of the feature engineering and model tuning are uncertain in the beginning.
That's a fact and there's no denying that but in the end the model is supposed to go into production.

To manage this uncertaininty, the community built a lot of tools like jupyterlab, zeppelin, etc. to make the feedback more readily accessible.
These are extremely valuable tools, they easy the development so much.

The problem comes when we start substituting bouts of interactive programming with tons and tons of notebooks that perform your entire pipeline like from data fetching, to data processing, to model tuning.
Notebooks are nice, but putting notebooks into production is a very bad idea. Databricks for example provides support for adding notebooks into production (at a premium cost).
That sounds like a very scary idea, I'm talking especially for large notebooks.

The worst part about notebooks is that you can run any cell in any order. Due to this you can never be sure what the value of a particular dataframe for example is unless you go through all the cells again.
Now this is a situation that grows exponentially bad as the size of your notebook starts to increase.


When we are writing code, we usually think a lot about writing robust code while handling all the edge cases.
We write unit tests to verify the code we are writing won't break in the future.

My prefered methodology is to write reusable code in a python repo as proper python module.
Whereever possible, reuse the code from the python module in your notebook.
Perform all the interactive steps you need to take to understand your data and your code, then write it to your repo, so on and so forth.

You really don't lose any flexibility with this approach. Instead, you gain tons of benefits:

* With this approach, you can readily get feedback from your colleagues in code reviews. As always, the more eyes you can have on your code, the better.
* When you're adding code to your repo, IDEs can help surface subtle bugs, like a method your wrote that was reading global variable from your notebook and maybe you wanted it as a param.
* It makes it really easy to provide your code in a reusable fashion to your colleagues.
* Apart from all these benefits, most importantly, doing this avoids having huge notebooks. Your notebooks can be much smaller but still do the same thing and provide equal felxibility. 
