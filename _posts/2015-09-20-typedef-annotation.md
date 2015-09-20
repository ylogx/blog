---
layout: post
title: Using TypeDef Annotation to avoid enums
subtitle: Enums are bad. See how to replace enum with integer constants.
date: '2015-09-20T00:00:00.000+05:30'
permalink: typedef-annotation
author: Shubham Chaudhary
comments: true
tags: android, enum, typedef, int, const
---

Enums are so good. You see:

* They provide type safety.
* They provide code readability.
* They are so useful.

Let us look at this dummy code for instance:
{% highlight java %}
public enum MusicType {
    POP,
    ROCK,
    JAZZ
};
public interface Rocker {
    void letsRock(MusicType musicType);
}
{% endhighlight %}

It's so clean. I know what `letsRock` wants. It can only take `POP`, `ROCK` or
`JAZZ`. It's like this piece of code is talking to me.
Now look at this ugly piece of shit:

{% highlight java %}
public static final int POP = 0;
public static final int ROCK = 1;
public static final int JAZZ = 2;

public interface Rocker {
    void letsRock(int musicType);
}
{% endhighlight %}

Who knows what on earth this `letsRock` is looking for. I might very well pass 0
if I don't know about your constants to play POP. Tomorrow some nucklehead will
come and change `POP = 10001` and all hell will break loose on my code.

True that.

But as it turns out - Enums are not so good.
Actually [Enums are bad][pref-matters], especially in mobile environment
where resources are limited.
Enums consume twice as much memory as static constants. They bloat your app's
 size (and reports have been found that they also eat your dog's food
from time to time). Well that doesn't sound good, right?

The question now becomes how to keep enum like behavior while avoiding enums.
In other words, just like enums how do you ensure that the client can only
supply these three music types to our interface - nothing more, nothing less.

### TypeDef Annotations:

You'd know about typedefs if you are coming from a C background. In android we
have a support annotation `IntDef` for something similar.

Basically the @IntDef annotation lets you create a **"typedef"** i.e. you can
create another _annotation_ which represents the type of music.
This annotation ensures that only the valid integer constants that you expect
are used.

So we decorate our API with a typedef annotation like this:

{% highlight java %}
import android.support.annotation.IntDef;
@IntDef({
    POP,
    ROCK,
    JAZZ
})
@Retention(RetentionPolicy.SOURCE)
public @interface MusicType {}
{% endhighlight %}

Now we can use this annotation as follows:

{% highlight java %}
public interface Rocker {
    void letsRock(@MusicType int musicType);
}
{% endhighlight %}

Now if the client tries to enter some int other than these three contants, he
will receive a lint error.

Android source itself uses it all over the places:

![Lint showing error due to TypeDef annotation][typedef-error]

There is also a string version of @IntDef, aptly named as @StringDef. Checkout
the links below to know more.

#### To know more:

1. [See this Android performance patterns talk to know more.][pref-matters]
1. [Checkout the documentation for support annotations][support-annotations]

[typedef-error]: {{site.baseurl}}/img/android-typedef.png
[pref-matters]: https://www.youtube.com/watch?v=Hzs6OBcvNQE
[support-annotations]: http://tools.android.com/tech-docs/support-annotations
