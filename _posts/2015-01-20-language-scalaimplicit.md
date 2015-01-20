---
layout: post
title: "scala中的隐式转换"
description: "scala 隐式转换"
category: scala
tags: [scala]
---

这几份笔记都是在重新阅读scala编程的过程中顺便将书中的代码进行相关改造，添上自己理解的东西，从而形成自己的笔记。所以，感觉在code的过程中在体会书中的理论知识，对自己而言是一个不小的进步。

这一份笔记是关于scala中隐式转换的。

我们先来看一个简单的例子。

假如我们编写如下一段代码，目的是让Int类型的数字转化成字符串的。

    val x:String = 123
    输出结果：报错->type mismatch

那么我们应该如何实现上面的这个需求呢？那就要使用隐式转换了，代码如下：

    implicit def intToString(x:Int) = x.toString
    val x: String = 123
    输出结果：x: String = 123

上面的第二个程序就可以正常输出了，其实其中就是将Int类型的数字转化成intToString(x)来进行调用，从而完成我们刚开始定的需求。

*****隐式操作规则*****

其实隐式转换就是调用了一个所谓的“转换器”，而且`只有标记为implicit的才可以使用`，这就是所谓的标记规则。

scala的隐式转换还有个作用域规则，大体意思是：

    插入的隐式转换必须以单一标示符的形式处于作用域中，或与转换的源或者目标类型关联在一起。

所以你必须把你想用的隐式转换器带入到作用域中，从而可以让其可以使用。

看书中的一个例子：

    object Dollar {
       implicit def dollarToEuro(x: Dollar): Euro = ..
    }

    class Dollar {....}

其实上面就是一个特殊的例子：源类型是dollar，目标类型是euro，所以你可以把隐式转换打包到伴生对象中去。

下面还有三个规则，分别为：
 
    无歧义规则：隐式转换唯有不存在其他可插入转换的前提下才能插入。我理解的就是具有唯一性。

    单一调用规则：只会尝试一个隐式操作。我理解的就是降低运行时间为本。

    显示操作先行规则：若编写的代码类型检查无误，则不会尝试任何隐式操作。

    命名隐式转换：隐式转换可以任意命名。 

最后一个规则我们可以看一个小例子：

    object Conversion {
       implicit def stringWrapper(s: String):..
       implicit def intToString(x: Int):String = ...
    }

可以这样使用其中的一个：`import Conversion.stringWrapper`

那么，隐式操作可以用在哪里呢？

书中给出了三个方式：

    转换为期望的类型、指定(方法)调用者的转换、隐式参数。

*****隐式转换为目标类型*****

    val x:Int = 1.2
    报错，和我们刚开始写的那个例子类似。

    implicit def doubleToInt(x:Double) = x.toInt
    val x:Int = 1.2
    输出结果：1

这就是把隐式转换带到了作用域中从而进行到目标对象的转换。

*****转换(方法调用的)接收者*****

>#####与新类型的交互操作#####

>看如下一个例子：  
>
>     class Rational(n:Int,d:Int) {
>         def + (that: Rational): Rational = ...
>         def + (that: Int): Rational = ...
>     }


>     val oneHalf = new Rational(1,2)
>     输出：oneHalf: Rational = 1/2
>     oneHalf + oneHalf
>     输出：oneHalf: Rational = 1/1
>     oneHalf + 1
>     输出: oneHalf: Rational = 3/2  
>     1 + oneHalf
>     报错
>     
> 针对于最后一个情况可以进行隐式转换
>     implicit def intToRational(x: Int) = new Rational(x,1)    

>#####模拟新的语法#####

>我们知道在Map中有个->的操作符，可是它是如何实现的呢，其实就是使用了隐式转换。

底下是关于隐式参数的，明天做个这方面的笔记。

-----------------EOF------------------





















 









    







    


    




    



    
























    



    