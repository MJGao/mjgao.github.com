---
layout: post
title: "scala基础综合"
description: "scala 基础知识"
category: scala
tags: [scala]
---

也看过了几种语言了，平时使用的以Java居多，不过总结了一下，编写代码的时候无非要知道你定义的变量的类型是什么、在函数或者方法中使用这些变量、函数或者方法中又会包括很多控制结构、再涉及一些编码的技巧、隶属于该语言的一些奇巧淫技、以及这门语言的一些高级特性，所以自己不是科班出身，但是对于语言的学习确实也需要做定期地总结，并且学会比较各种语言之间得区别。

在scala基本类型中包括整数类型和数类型，其中整数类型有：Byte、Short、Int、Long、Char；数类型包括：Float、Double，并且这些类型都相应的有自己的取值范围。

>****1、字面量****

>打开可爱的scala编译器，来做一些关于字面量的小实验。

>>*****整数字面量*****

>>>十六进制

>>>val hex = 0x1 --->hex :Int = 22

>>>八进制

>>>val oct = 011 --->oct :Int  = 9

>>如果整数字面量结束于L或者l，那么其就是Long类型。

>>>val lvalue = 11L --->lvalue :Long = 11

>>通过上面例子的输出结果我们看到不同于java这些语言，我们并没有给变量定义类型，但是编译器自动为我们推导出了类型，假如我们想定义一个Short类型的，那么可以这么做：

>>>val sValue : Short = 10 --->sValue :Short = 10

>>*****浮点数字面量*****

>>浮点数字面量是由十进制、可选的小数点、可选的E或者e以及相应的指数部分组成，看几个例子：

>>>val fv = 2.212 --->fv :Double = 2.212

>>>val feV = 2.11121e2 --->feV :Double = 211.121

>>以上我们看到类型会自动转为Double类型，那么我们怎么定义一个Float类型呢？看下面的例子：

>>>val fV = 2.1212F  --->fV :Float  = 2.1212

>>>val sFV = 10e5F --->sFV :Float = 1000000.0

>>假如在定义浮点数数的时候后面加了f或者F则为Float类型，否则为Double类型。

>>*****字符字面量*****

>>>val cV = 'B' --->cV :Char = B

>>>val cUV = '\45'--->cUV :Char = x

>>我们还可以这样写

>>>val A\u0045\u0046 = 10f --->AEF :Float = 10.0

>>即unicode编码可以出现在任何位置。

>>*****字符串字面量*****

>>>val s = "Hello WOrld" --->s :String  = Hello World

>>>只要以双引号("")括起来就行了。

>>在scala中还有一种特殊的符号，三引号(""")，看一下具体使用方式。

>>>println("""Hello World,My name is scala, 

>>>  nice to meet you.""")

>>我们可以看到输出的字符串并没有对齐，那么你可以这样写：

>>>println("""|Hello World,My name is scala,

>>>  |nice to meet you.""")

>>>就是在每个句子的前面加一个(|)管道符，这个我们在linux指令中是经常看到的。

>>*****布尔型字面量*****

>>>val bool = true --->bool :Boolean  = true

>>*****符号字面量******

>>>val symble = 'mjgao --->symble :Symbol = 'mjgao

>>>symble.name --->res2 :String = mjgao

>****2、操作符和方法****

>>这里我就举几个简单的例子来展示一下，毕竟想穷举下来确实需要费很多力气与时间。

>>>val k = 1+1 --->k :Int = 2

>>>val kk = (1).+(1) --->kk :Int = 2

>>>val str = "Hello World" --->str :String = Hello World

>>>val strL = "Hello World" length --->strL :Int = 11

>>其实在scala中操作符就是方法，而像上面字符串的那种写法也是方法的一种调用方式，只是写的时候省略了(.)号，但是编译器会自动地进行编译。

>****函数****

>>关于函数与方法的区别，这几天一直在看相关的文章，以后也要做一下小总结，这里只是列举几个例子来展示scala中的函数。

>>下面看几个函数的例子

>>>def insert(name:String,psw:String) = println("name:"+name+",psw:"+psw)

>>>输出为：insert(name:String,psw:String)Unit

>>>insert("mjgao","123")

>>>输出为：name:mjgao,psw:123

>>我们可以看到上面函数的返回类型是Unit，其实就相当于void，我上面的函数(方法)之所以那样写是因为方法体内比较简单。

>>>      def update(name:String,psw:String):String = {
>>>        "name:"+name+",psw:"+psw
>>>      }
>>>输出为：res4: String = name:mjgao,psw:123

>>>可以看到我们并没有定义返回值，其实scala方法中是以最后一个表达式为准，所以会正常输出。

>>再看一个小例子

>>>      def updateU(select:String=>String,name:String) = {
>>>            select(name)
>>>      }

>>>      def select(name:String) = println("My name is:"+name)

>>>      updateU("mjgao")

>>>输出结果为：My name is:mjgao

>>是不是觉得很奇怪，看到了("=>")以及将函数嵌入到函数中去了，其实这就是后面讲的闭包，类似的例子例如：

>>>     List(1,2,3).map(_*2)
>>>     输出结果为：res11: List[Int] = (2,4,6)

>>>     val aList = (1,2,3)
>>>     aList.foreach(println)
>>>     输出结果为：1 2 3

>>其实以上`aList.foreach(println)`还可以写成`aList.foreach(n=>println(n))`、
>>`aList.foreach(println _)`等几种形式，至于基本的原理后面再进行讲解。

>>下面看几个关于控制结构的例子

>>>     for(i <- 1 to 4)
>>>        println(i)
>>>     输出结果为：1 2 3 4

>>>     for(i <- 1 until 4)
>>>        println(i)
>>>     输出结果为：1 2 3

>>看一个关于过滤的例子

>>>    for(l <- List(1,2,3,4,5,6) if l>3)
>>>       println(l)
>>>     输出结果为：4 5 6

>>还可以使用`yield`来记住每个关键字

>>>    for {
>>>        l <- List(1,2,3,5)
>>>        if i>1
>>>    }yield i
>>>    输出结果为：res: List[Int] = list(2,3,5)

是不是感觉scala确实是灵活多变的一门语言。

大体上就写这么多了，再写的话还会涉及到很多引申的话题，这些都是一些基本的知识，说实话在写的过程中也确实挺累的，毕竟都是一些老生常谈的话题，但是只有把握好这些基础的，才可以进入下一个阶段。   

---------EOF---------------




















 









    







    


    




    



    
























    



    