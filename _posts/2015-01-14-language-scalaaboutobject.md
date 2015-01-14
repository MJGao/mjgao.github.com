---
layout: post
title: "scala类和对象"
description: "scala 类 对象"
category: scala
tags: [scala]
---

前面一章节是大体对scala这门语言中的一些基本类型以及一些小的特性、函数的基本写法做个大体的复习，因为scala中也是面向对象的，所以也来总结一下scala中一些面向对象的知识点。

****类的基本定义方式****

看下面几个简单的例子。

*****1、与java相似的定义方式*****

     class Demo {
       val a = 1
     }

     val d = new Demo
     d.a
     输出结果为：res: Int = 1

我们知道在java中有`static`关键字，并且可以不需要new出一个对象而可以直接使用，但是scala中是没有的，由此出现了一个`伴生对象`，其实也叫做`single对象`，我们通过一个例子来看一下具体的使用方法，注意在定义的时候关键字为`object`。

     object SDemo {
        val b = 2
        def acc(a:Int):Int = a+b
     }
     
     SDemo.acc(3)
     输出结果为：res: Int = 5

每一个程序都有一个运行main入口，而scala也不例外，下面例子就是展示scala中的入口main函数的。

    object SMain {
      def main(args: Array[String]) = println("a")
    }

当然你也可以使用`Application`关键字，具体代码如下：
    
    object Smain extends Application{
      println("a")
    }

意思就是Application中已经封装了main函数，所以你可以减少代码的输入量。

接下来咱们继续，在java中我们可以把变量放在构造函数中，从而在new的时候进行相关的初始化，scala中也可以这样干，看下面的代码示例。

    class Structor(a:Int,b:Int) {
      println(a+b)
    }

    val stc = new Structor(1,2)
    输出结果为：3

注意在伴生对象中是不可以这样来做的，因为伴生对象不可以new，所以自然不可以加参数。

我们可以像java里面一样来重写相关的方法，例如`toString`，代码如下：

    class Sdef {
      override def toString = "Hello World"
    }

    输出结果为：Hello World

scala中还存在一个`require`的先决方法，示例如下：
    
    class ReqObj(aNum:Int,bNum:Int) {
       require(bNum!=0)
       override def toString = aNum + "/" + bNum
    }

    val req = new ReqObj(1,2)
    输出结果为：1/2

    val req2 = new ReqObj(1,0)
    将会报错

*****2、函数式对象*****

scala中有个`自指向`的概念，其实就是利用this关键字来做文章，比如看下面的几个例子。

    class SelfDemo {
      val a = 1
      def add(b:Int):Int = b+this.a
    }

    这里this关键字是可以省略的。

当然我们还可以看一个`辅助构造器`的例子。

    class ApplyDemo(a:Int,b:Int) {
      def this(a:Int) = this(a,2)
      override def toString = a + "/" + b
    }

    val ad = new ApplyDemo(1)
    输出结果为:1/2

是不是感觉辅助构造器是一个很神奇的东西。

以上都是在scala中定义类或对象的一些技巧，当然对于字段的作用域、方法的重载这些我在上面基本上在代码中都简单地提到过，所以总体而言本文写得相对简单，但是有很多内容需要自己以后在项目中注意，以后有新的东西在陆续添加。

-----------EOF---------------




















 









    







    


    




    



    
























    



    