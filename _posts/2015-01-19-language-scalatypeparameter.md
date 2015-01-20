---
layout: post
title: "scala中的类型参数化"
description: "scala 类型参数化 协变 逆变"
category: scala
tags: [scala]
---

类型参数化是我刚开始玩scala的时候一直无法理解的东西，可能是一直在玩java，所以思维一下子转变不过来，所以这份笔记就提前来写了，其中很多例子都是引用的scala编程中的，希望通过实践与理论的结合，从而可以理解这部分内容。

下面我们就按照scala编程中作者给我们提供的思路来看类型参数化。

*****定义一个Queue队列*****

在scala中纯函数式编程追求的是不可变性，于是作者提出了一个需求，针对于Queue队列，我们定义一个append操作如何使其实可变的，并且掌握效率。

下面是一个简单的实现方式，代码如下：
 
     class Queue[T](private val leading: List[T],
                    private val trailing: List[T]
                   ){

                   private def mirror = 
                      if(leading.isEmpty)
                          new Queue(trailing.reverse,Nil)
                      else
                          this

                  def head  = mirror.leading.head
               
                  def tail = {
                      val q = mirror
                      new Queue(q.leading.tail,q.trailing)
                  }

                  def append(x: T)  = new Queue(leading,x :: trailing)
      }

我自己将上述代码实现了一遍，我的感觉是用scala确实会高效并且爽很多，所以有些时候理论知识看多了，还是要自己手动去进行写一系列的代码。

     val q = new Queue(List(1),List(2))
     q head
     输出为：List(1)

     q append List(3)

大家可以自己去尝试上述代码。

让作者将问题带出来了：如何做到信息隐藏？即上述代码中对于如何对客户隐藏构造器中的相关参数问题。

*****信息隐藏*****

作者提出了几种解决方式。

看如下示例代码。

    class Queue[T] private (
       private val leading: List[T],
       private val trailing: List[T]
    )

    val q = new Queue(List(1),List(2))
    输出结果：报错

我们可以从输出结果中可以看到，这个对象是不可以访问的，只能在类本身及伴生对象中使用。而构造器是私有的，不可调用。

作者对其中添加了一种叫做辅助构造器的玩意，在前两份笔记中我也有相关的记载。

示例代码如下：

     class Queue[T] private(
      private val leading: List[T],
      private val trailing: List[T]
    ){
      def this(e:T*) = this(e.toList,Nil)
    }
 
    val q = new Queue(1,2)

这样我们就可以来使用构造器参数列表了。

或者我们可以使用之前说的伴生对象，例子如下：

    object Queue {
       def apply[T](x:T*) = new Queue(x.toList,Nil)
    }

这样也是一种可行的方式。

还有一种方式就是使用类似于接口的实现方式，正好巩固一下之前学的trait的知识。
 
    trait Queue[T] {
       def head: T
       def tail: Queue[T]
       def append(x: T): Queue[T]
    }

    
    object Queue {
       def apply[T](x:T*): Queue[T] = new QueueImple[T](x.toList,Nil)   
       private class QueueImple[T](
       private val leading: List[T],
       private val trailing: List[T]
       ) extends Queue[T]{
            private def mirror = 
                      if(leading.isEmpty)
                          new Queue(trailing.reverse,Nil)
                      else
                          this

                  def head  = mirror.leading.head
               
                  def tail = {
                      val q = mirror
                      new Queue(q.leading.tail,q.trailing)
                  }

                  def append(x: T)  = new Queue(leading,x :: trailing)
         }
     }

这也是一种可行的方式。都是有可以学习的地方。

*****变化型注解*****

我们定义一个Queue的特质。

    trait Queue[T]

    def createQ(q:Queue) = ""

    def createQ2(q:Queue[String]) = ""

我们可以发现第一个方法不可以创建，因为Queue是特质，不是类型，它带有类型参数。而第二种你可以随便的带类型参数，String、AnyRef等。

所以，作者带来了一个思考，在T型家族中是否存在父子类关系，例如String是AnyRef的子类，那么Queue[String]是否可以是Queue[AnyRef]的子类？推广更广泛点：

    若S是T的子类型，是否可以把Queue[S]当做Queue[T]的子类型？

    如果是，我们可以任务Queue特质与它的类型参数T保持协变的关系(或有弹性的)。

    协变的Queue意味着你可以把Queue[String]传给Queue[AnyRef]。

但是在scala中泛型类型缺省的是`非协变`的(或严谨的)子类型化。即不同类型的队列之间没有父子关系。

但是我们可以有变换的方式，从而要求队列是协变的。

    trait Queue[+T]

除此之外是逆变的子类型

    trait Queue[-T]
    即如果T是S的子类型，那么Queue[S]是Queue[T]的子类型。

这些都称为参数的变化型。


-----------------EOF------------------





















 









    







    


    




    



    
























    



    