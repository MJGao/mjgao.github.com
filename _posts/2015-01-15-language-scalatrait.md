---
layout: post
title: "scala中的特质(trait)"
description: "scala 特质 trait"
category: scala
tags: [scala]
---

这两天每天工作回来就开始写scala中的一些基本的东西，其实目的很简单，就是想将自己学习到的东西做个简单的总结，以后可以在自己的日记中随时打开随时复习。并且通过查看自己的工作进度，好给自己分期得定一些基本的目标。

前两章基本上是scala中一些基本的知识点。这一章还是继续一些基本的东西，分别阐述scala中的特质(trait)以及我们应该如何使用它。

在scala编程中对于特质(trait)的定义的：

    特质(trait)是scala里代码复用的基础单元。特质封装了方法和字段的定义，并可以通过(mixin)
    的方式进行重用。与java中的每一个类只能继承一个超类不同，scala可以同时混用很多特质。

其实总体与java的不同就是scala可以混入很多定义好的特质。

****特质基本入门****

*****1、简单使用*****

看下面一个简单的示例：

    trait TraitDemo {
       def pt() {
          println("Hello Trait!")
       }  
    }

基本定义方式和类的定义方式是一样的，只是关键字换成了`trait`，另外其实它是有超类的，为AnyRef,感兴趣的可以去看一下官方的相关文档。

下面我们可以来利用这个定义好的trait

    class TraitDemoChild extends TraitDemo {
       def ps() = println("Hello,I am the child!")
    }

    val tdc = new TraitDemoChild
    tdc.ps()
    输出结果为：Hello,I am the child!

    tdc.pt()
    输出结果为：Hello,I am the child!

我们来看一个使用`with`的简单例子。

    class Fruit 
    
    trait SquareFruit {
      override def toString = "I am the square fruit!"
      def printSqu() = println("I am square")
    }

    trait SweetFruit

    class Apple extends Fruit with SquareFruit with SweetFruit {
      override def toString = "I am an apple!"
    }
    
    val app = new Apple
    输出为：I am an apple!

    val sFruit: SquareFruit = new Apple
    sFruit.printSqu()
    输出为：I am square
    
    这种定义方式可以看到将类型加到了里面，更加明晰。

从上的例子我们可以看到确实可以混入多个特质从而使我们的类更加胖功能也更丰富。

所以特质的主要应用功能就是：`将一个瘦接口变成一个胖接口`，对于这个以后在做相关项目的时候遇到了在补充一个专门的例子来说明。

最后一个部分就来阐述一下scala中的`Ordered`特质。

*****2、Ordered特质的使用*****

Ordered其实就是用来对两个对象进行排序。在haskell也有这个特性，不过那里叫Order，是类型里面的一个元素。

我们先从这个例子着手，见下面：

    class MathRa(a:Int,b:Int) {
        private var cs:Int = a
        private var bcs:Int = b
        def < (that:MathRa) = this.cs*that.bcs > that.cs*this.bcs
        def > (that:MathRa) = that < this
        def <= (that:MathRa) = (this < that) || (this == that)
        def >= (that:MathRa) = (this > that) || (this == that)
    }

    var mathRa = new MathRa(1,2)
    mathRa < (new MathRa(2,3))
    输出结果为：false

其实我们就是对两个数字进行相互地比较，下面我们来看Ordered的使用方式。

    class MORa(a:Int,b:Int) extends Ordered[MORa] {
       private var cs:Int = a
       private var bcs:Int = b
       def compare(that:MORa) = (this.cs*that.bcs) - (that.cs*this.bcs)
    }

    val one = new MORa(1,2)
    val two = new MORa(2,3)
    one < two
    输出结果为：true

突然想起其实特质还有下面的一种使用方式，见下面的例子：

    class Animal
   
    class Dog extends Animal {
      override def toString = "is a dog"
    }
 
    trait PeopleFriend {
      def mkF() = println("The dog is our friend")
    }

    val dog = (new Dog with PeopleFriend)
    dog.mkF() 
    输出结果为：The dog is our friend

从上我们可以看到混入特质可以在new对象的这种动态的过程发生或者成为绑定。

*****3、特质中的线性化*****

线性化我觉得也是一个重要的概念，所以特地将读书笔记进行记录。看如下的一个例子。

    class Fruit
    trait SquareFruit extends Fruit
    trait Apple extends Fruit
    trait GreenApple extends Apple
    class SaledGreenSquareApple extends Fruit with SquareFruit with GreenApple

我们对上面定义的几个类、特质进行线性化分析，大体结果如下：
 
    Fruit->AnyRef->Any
    SquareFruit->Fruit->AnyRef->Any 
    Apple->Fruit->AnyRef->Any
    GreenApple->Apple->Fruit->AnyRef->Any
    SaledGreenSquareApple->GreenApple->Apple->SquareFruit->Fruit->AnyRef->Any

整体情形就是这个样子，是不是感觉还是挺容易分析的，当然你也可以把UML图画出来，我这里只是为了做个笔记就省略去了。

基本上特质的知识点记载也就差不多了，对于一些高级的话题暂时还没有涉及到。后面会逐步地引入。而对于特质我们该不该用，什么时候用，这个我们需要去看具体情况，特别是与java进行互相操作的时候，这方面就要多看文章多实践了。

每日记录自己的读书笔记，发现其实这个过程相对而言也使自己对很多知识点加深了印象，并且在模糊的地方可以再返回查阅资料。

-----------------EOF------------------





















 









    







    


    




    



    
























    



    