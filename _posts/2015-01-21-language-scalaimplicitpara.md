---
layout: post
title: "scala中的隐式转换(2)"
description: "scala 隐式转换"
category: scala
tags: [scala]
---

这一份笔记是继续昨天的内容--隐式转换来写的，来看一下隐式参数的基本使用方式。

#####隐式参数#####

首先我们来看书中的一个例子。

    class SharePre(val pre: String)

    object Greeter {
        def greet(name: String)(implicit pre: SharePre) {
           println("Hello, "+name+".")
           println(pre.pre)
        }
    }

    val bPre = new SharePre("scala")
    Greeter.greet("java")(bPre)

    输出结果：
    Hello,java.
    scala

上面的例子我们可以隐式提供参数，同时也可以显示提供参数。

我们还记得前一章还提到过隐式转换的几个基本的规则，其中涉及作用域以及单一标示符规则。我们来看下面这个小例子。

     object MyPre {
        implicit val pre = new SharePre("My scala.")
     }

下面我们来使用这个定义好的object。

     import MyPre._

     Greeter.greet("java") 
     输出结果：
     Hello,java.
     My scala.

因为在同一个作用域，所以自然而然可以隐式转换成功。其实按照我的猜想，程序在运行的过程中会进行相关的查找。

在看下面的这个例子。

    class PreGao(val pre: String)
    class PreXu(val pre:String)

    object Greeter {
       def greet(name: String)(implicit pg:PreGao,px:PreXu) {
       println("Hello,MR."+name)
       println(pg.pre)
       println(px.pre)
      }
    }

    object MyPre {
        implicit val pg = new PreGao("Gao")
        implicit val px = new PreXu("Xu")  
    }

    import MyPre._
    
    Greeter.greet("Wang")(pg,px)

    输出为:
    Hello,MR.Wang
    Gao
    Xu

#####关于视界#####

引入视界的概念之前，我们先来看一个简单的例子。

    object View {
        def mxList[T <: Ordered[T]](ele: List[T]): T =
        ele match{
        case List() => throw new Exception("empty!")
        case List(x) => x
        case x::res =>
            val maxRes = maxList(res)
            if(x > maxRes) x
            else maxRes
       }
    }

以上使用了递归，在haskell中也会讲到这部分的内容。

我们会发现上面的代码我们约定了T要是Ordered的子类型，可是Int、String这些都不是的，所以自然而然机会显得非常的脆弱。

所以我们可以使用一个隐式转换的方式，如下面的例子：

     object ViewAn {
        def maxList[T](ele: List[T])(implicit order:T => Ordered[T]): T =
        ele match {
        case List() => throw new Exception("empty!")
        case List(x) => x
        case x::res =>
            val maxRes = maxList(res)(order)
            if(order(x) > maxRes) x
            else maxRes
        }
    }

    ViewAn.maxList(List(11,10,22))
    输出结果为:res: Int = 22

    ViewAn.maxList(List("a","B","C"))
    输出结果为：res: String = a

我们可以发现程序一下子强大了不少，其实就是添加了加类型转化我Ordered的隐式转换的方法。

我们在上面的例子中可以发现，在做比较的时候，我们通过使用`order(x) > maxRes`和`maxList(res)(order)`这种显示提供参数的方式来进行程序的使用，如果我们将两者去除呢？即如下的代码：

     object ViewThr {
        def maxList[T](ele: List[T])(implicit order:T => Ordered[T]): T =
        ele match {
        case List() => throw new Exception("empty!")
        case List(x) => x
        case x::res =>
            val maxRes = maxList(res)
            if(x > maxRes) x
            else maxRes
        }
    }

我们发现依然可以使用，原理其实是这样的：

     当发现T没有>这个操作符的时候其实就进行相关的隐式调用，而对于maxList(res)这在上面已经
     讲过就是一种隐式调用的例子。

假如我们将上面的order方法改为其他的方法，可行吗？

    object ViewThr {
        def maxList[T](ele: List[T])(implicit conver:T => Ordered[T]): T =
        ele match {
        case List() => throw new Exception("empty!")
        case List(x) => x
        case x::res =>
            val maxRes = maxList(res)
            if(x > maxRes) x
            else maxRes
        }
    }

依然可以使用，换成随便什么都可以，只要符合命名规范。那么我们可以想到一个问题：

    在数学中有一种方法叫归纳法，即万变为一，那么我们是否有哪种方式也可以将这些变量名都替换掉
    呢？

所有这就有了视界。

    object ViewTest {
        def maxList[T <% Ordered[T]](ele: List[T]): T =
        ele match {
        case List() => throw new Exception("empty!")
        case List(x) => x
        case x::res =>
            val maxRes = maxList(res)
            if(x > maxRes) x
            else maxRes
        }
    }

    ViewTest.maxList(List(1,2,3))
    输出结果为：res：Int = 3

这里我们不会发现任何隐式转换的函数，但是依然可以使用。

我们发现只是简单用了`<%`的符号，还记得`<:`(上界)符号么？

其实第一个符号可以用于获得更多的类型，范围更大，就这么简单。也就是在Predef存在着隐式鉴别函数，这个需要去看相关的源码。

    


    
        



-----------------EOF------------------





















 









    







    


    




    



    
























    



    