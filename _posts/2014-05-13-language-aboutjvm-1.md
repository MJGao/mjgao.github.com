---
layout: post
title: "java学习知识点--关于jvm的class加载"
description: "java jvm class的加载"
category: java
tags: [java]
---

其实看jvm已经有一段时间了，对于其中的很多东西也有了大致的了解。在网上也看了很多人写的关于jvm的文章，给我的第一感觉是：`看起来容易，叫我来写确实很难`。所以这几天有空也来复习一下jvm方面的知识，正好也测试一下自己对这块内容的掌握程度，不过，可能还是要把之前的书籍、资料拿出来翻翻，因为确实发现有很多东西忘记了，只是在脑中停留了一个大体印象，知道写一个问题应该到哪里去查这些资料。

记得寒假的时候在家里尝试在Linux上编译openjdk，后来由于其他事情，所以一直把它忘记了。这段时间抽空准备在研习一下，顺便把C++补补。关于jvm的定义这些理论知识可以看维基百科关于jvm的讲解[Java虚拟机](http://zh.wikipedia.org/zh-cn/Java%E8%99%9A%E6%8B%9F%E6%9C%BA)，最起码至少对这玩意有个大体的认识。

以前刚开始学习java的时候我就觉得很痛苦，写一个项目、一段程序都是大量地调用API，但是后来想想，它内部的运行机制一直没有明白。所以总感觉自己如同一块冰，暂时漂浮在水面上，我在想什么时候我能够溶于水中？

由于实力有限，暂时先记录一下当初在窥探class加载的时候所看到的内容。

对于java的一些理论知识，例如对象、封装、继承、多态这些我觉得没有在这里细说了，我自己先写一段程序来对问题进行说明吧。

    class Test {
	  /*
	  Author:MJGao
	 */
       public static void main(String args[]){
          System.out.println("This is the frist blog about jvm!");	
       }	
    }
我们在命令行输入javac、java命令后就会发现结果的打印。我们当初都是这么来学习一段Hello World程序的，而且我们会知道此程序会生成一个Test.class文件。但是我们当时是否想过如下几个问题：

1、这段程序是如何编译的？

2、为什么输入java命令main函数就能执行？

3、main函数为什么定义成static的？

4、System.out.println是什么？为什么这样写就能够执行输出功能？

5、那个class文件有什么作用？

也许，还有更多的问题来思考，现在想想，当初完全没有对一个小的问题进行详细地深入过，所以确实感觉懒到家了，手懒到家，大脑懒到家。

####看一下class文件的内容构成
这里我是直接使用EditPlus打开的，假如用记事本打开将会出现乱码。

<img src="/assets/images/jvm-1.jpg" />

对于里面出现的一些内容在网上其实也有相关工具进行扫描。这里大家可以去网上搜索。而最又部的一些栏目，应该也可以看出一点头绪出来。

下面使用`javap -verbose Test`

    Compiled from "Test.java"
    class Test extends java.lang.Object
    SourceFile: "Test.java"
    minor version: 0
    major version: 50
    Constant pool:
    const #1 = Method      #6.#15; //  java/lang/Object."<init>":()V
    const #2 = Field       #16.#17;        //  java/lang/System.out:Ljava/io/PrintStream;
    const #3 = String      #18;    //  This is the frist blog about jvm!
    const #4 = Method      #19.#20;        //  java/io/PrintStream.println:(Ljava/l
    ang/String;)V
    const #5 = class       #21;    //  Test
    const #6 = class       #22;    //  java/lang/Object
    const #7 = Asciz       <init>;
    const #8 = Asciz       ()V;
    const #9 = Asciz       Code;
    const #10 = Asciz      LineNumberTable;
    const #11 = Asciz      main;
    const #12 = Asciz      ([Ljava/lang/String;)V;
    const #13 = Asciz      SourceFile;
    const #14 = Asciz      Test.java;
    const #15 = NameAndType #7:#8;//  "<init>":()V
    const #16 = class       #23;    //  java/lang/System
    const #17 = NameAndType #24:#25;//  out:Ljava/io/PrintStream;
    const #18 = Asciz       This is the frist blog about jvm!;
    const #19 = class       #26;    //  java/io/PrintStream
    const #20 = NameAndType #27:#28;//  println:(Ljava/lang/String;)V
    const #21 = Asciz       Test;
    const #22 = Asciz       java/lang/Object;
    const #23 = Asciz       java/lang/System;
    const #24 = Asciz       out;
    const #25 = Asciz       Ljava/io/PrintStream;;
    const #26 = Asciz       java/io/PrintStream;
    const #27 = Asciz       println;
    const #28 = Asciz       (Ljava/lang/String;)V;

这里我只是将内容复制了下来，我们可以看第一部分代码类似于注释的部分内容其实已经标注了从初始化到将代码加载到jvm中的过程，` class Test extends java.lang.Object`我们学过java都知道Object是所有类的父类，也就是祖宗类；`Constant pool`常量池是一个很重要的东西，jvm里面的变量、常量等内容都将会进行存储，后期将会说明讲解一下。同时我么也会看到`System.out.println`的简单加载过程等。

    {
    Test();
    Code:
     Stack=1, Locals=1, Args_size=1
     0:   aload_0
     1:   invokespecial   #1; //Method java/lang/Object."<init>":()V
     4:   return
    LineNumberTable:
     line 1: 0


     public static void main(java.lang.String[]);
     Code:
     Stack=2, Locals=1, Args_size=1
     0:   getstatic       #2; //Field java/lang/System.out:Ljava/io/PrintStream;
     3:   ldc     #3; //String This is the frist blog about jvm!
     5:   invokevirtual   #4; //Method java/io/PrintStream.println:(Ljava/lang/String;)V
     8:   return
    LineNumberTable:
     line 8: 0
     line 10: 8
    }
这是第二部分的代码展示。可以看到感觉很多内容如同学习过的汇编一样。`aload_0` `invokespecial` `getstatic` `ldc` `invokevirtual`这些关键的字眼都是在后期需要顺带讲解一下的，`#X`代表在jvm中调用第几个指令，而整个程序在jvm中都将会通过栈帧的方式进行存储调用。这些在后期要涉及到java的内存模型的相关内容。

上面的知识点都很琐碎，看上去不是那么容易理解，借用网上的一幅图来描述java程序在jvm中的各个过程。

<img src="/assets/images/jvmclassloader.jpg" />
java类加载的过程是由ClassLoader来完成的，而在jvm的过程中分为三个部分：
>系统类加载器（System ClassLoader）、启动类加载器（Bootstrap ClassLoader）、扩展类加载器（Extension ClassLoader）

根据以上所列出的类加载器，所以对于本例在jvm中所编译到运行的情况，就是从系统类加载器开始，并且连接其他相关的类，在后期这个部分将会写一些自定义的类加载进行分析。

后期，将会对程序怎样加载到虚拟机，并且这些数据、程序是如何进行存储、采用什么样的方式存储，都会进行进一步地分析。

总结：写这些内容还是需要一定功力的，后期自己还是需要进行相关复习与补充，而我认为写文章就是要简短一点，我也不想上太多的代码，自己知道明白清楚就行。

（完）

参考资料
==
>[简易Java（01）：从HelloWorld中可以学到什么？](http://www.diguage.com/archives/74.html)

>[深入java虚拟机](http://book.douban.com/subject/24722612/)

>[Java虚拟机规范(Java SE 7版)](http://book.douban.com/subject/25792515/)

>[taobaoJVM深刻定制版](http://jvm.taobao.org/index.php/%E9%A6%96%E9%A1%B5)




  