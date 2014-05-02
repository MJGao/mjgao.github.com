---
layout: post
title: "NO.1-scala的基础入门"
description: "scala 入门"
category: scala
tags: [scala]
---
最近一段时间一直在玩scala，以前一直在学习java方面的内容，从一系列的框架使用到深入jvm的一些细节地方，总的来说，对此类语言有了大体的了解，同时最近也在一直补充vm的相关知识，不过，这个东西还是需要 其他语言的补充。而目前基于jvm的语言也有一些，例如python，scala，groovy等，所以看一下这类语言对自己还是有一定的提升。

前几天HBO出了一套美剧《硅谷》，里面某程序员说，他会java和scala，当时听到这句话，我顿时来了精神，不谈是否是有关讽刺，不过看到里面谈到scala，看来目前此语言推广的还是不错，就像当年java一样也是花了很多精力进行推广才有今天的效果，不过目前我不太喜欢这门语言，第一我觉得它很臃肿，第二觉得屏蔽了底层的东西，反而使自己像个傻瓜一样，只能作为项目的堆砌机器。

此次简单介绍一下scala的使用。

对于scala是什么，或者它有什么特色，相对于java它有什么新的元素，可以参看一下[维基百科对scala的介绍](http://zh.wikipedia.org/wiki/Scala)，针对于它的类型系统、[函数式编程](http://zh.wikipedia.org/wiki/%E5%87%BD%E6%95%B8%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80)、它的并发性这些涉及到概念的我就不介绍了，大家可以去寻找资料来补充。

按照如下步骤对scala进行安装（我是基于windows系统），linuxx也有相关介绍，可以看[官方教程](http://www.scala-lang.org/)。

----
>安装后直接在命令窗口输入scala,显示如下欢迎和版本信息：
  <img src="/assets/images/2.jpg" />
>直接写一个hello word程序，具体显示如下：
  <img src="/assets/images/1.jpg" />
 `我们可以看出scala可以不用使用分号这些既定的规则`
 `这里println的方法自动导入，不像java里面需要手动导入，这在后面需呀着重介绍一下`

>第二个简单的例子
  <img src="/assets/images/3.jpg" />
  <img src="/assets/images/4.jpg" />
 `我们可以看到在scala中可以自动进行类型的转换，这比较一些传统的类似java、c++有很大的不同`

>我们知道java中可以使用final来定义一个变量不可变，在scala中可以通过使用var和val两个关键字分别来定义变量，具体情况如下图所示：
  <img src="/assets/images/5.jpg" />
  `可以看出通过var关键字定义的变量具有可变性`
  <img src="/assets/images/6.jpg" />
  `可以看到通过val关键字定义的重新定义将会报错，这就为scala提供了一定的安全性`

以上的内容只是对scala有一个简单的认识，而对于scala所出现的若干的特性，例如协变和逆变、lambda表达式（在java7已经开始引入，目前java8也引入了很多新的特性，但貌似与scala有很多的类似的地方），并发编程、模式匹配、与java的融合使用等，这些会一步步记录下来。

    补充：目前scala的一些应用场景大家可以看一下twitter和一些股票系统、银行的相关业务。

总结：语言就是这样，需要手动验证才会获得最真实的体会，光说不练假把式。

（完）

参考资料
--------
1、[scala维基百科](http://zh.wikipedia.org/wiki/Scala)

2、[Effetive Scala](http://twitter.github.io/effectivescala/index-cn.html)

3、[《Scala程序设计》](http://book.douban.com/subject/4909629/)

4、[scala官方网站](http://www.scala-lang.org/)









  