---
layout: post
title: "scala中抽取器"
description: "scala 抽取器"
category: scala
tags: [scala]
---

对于scala中的抽取器我也学着书中所讲的写一个基本的邮件匹配的例子。

从原理上讲，其实抽取器就是将参数进行解构的过程，而我们知道有个apply方法，其实与之有对应的意思。我们来看这个小例子。

    object Email {
      def apply(u:String,d:String) = u + "@" + d
      def unapply(s:String): Option[(String,String)] = {
        val pair = s split "@" 
        if(pair.length==2) Some(pair(0),pair(1))  else None
      }
    }

    "gx@gmail.com" match {
        case Email("gx","gmail") => println("ok")
     } 

    输出结果：ok

    上面的就是一个基本的抽取器的例子。顺便提一下，如果不写apply，可以使用extends 
    (String,String) => String的方式。

以上我们使用了类型为Option,因为我们可以保证当存在的时候为Some(x),不存在的时候就为None报类型不匹配的错误。

我们还可以看[hongjiang关于抽取器](http://hongjiang.info/scala-pattern-matching-8/)的一个小例子，写的也是很有意思的。


-----------------EOF------------------





















 









    







    


    




    



    
























    



    