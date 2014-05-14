---
layout: post
title: "Maven使用方式入门"
description: "maven"
category: Maven
tags: [技术,Maven]
---

以前在看struts的源码的时候老是发现有一个pom.xml的文件，当时一直不明白那个是啥玩意，后来知道原来是一个项目模块的构建文件。后来在看tomcat的源码的时候知道了Ant构建工具，在后来在图书馆偶然看到了Maven的书籍，但是一直时间原因没有对这个玩意来玩一遍，昨天在清理书籍的时候正好看到这本书，就将这本书简单看了一下，顺便动手实验了一下，发现原来java里面有这么多的好东西。

下面我就从最基本的知识一步步开始，对自己学习Maven的过程做一下记录。

    Maven, a Yiddish word meaning accumulator of knowledge, was originally 

    started as an attempt to simplify the build processes in the Jakarta Turbine 

    project. There were several projects each with their own Ant build files that 

    were all slightly different and JARs were checked into CVS. We wanted a 

    standard way to build the projects, a clear definition of what the project 

    consisted of, an easy way to publish project information and a way to share 

    JARs across several projects.

    The result is a tool that can now be used for building and managing any Java-

    based project. We hope that we have created something that will make the day-

    to-day work of Java developers easier and generally help with the
  
    comprehension of any Java-based project.

这是Apache官网上对Maven做得一个简单的introduction，最近一直在提升自己的英语水平，所以也一直在看这些官网上的各种文档介绍，发现对自己也是一个补充的过程。

根据官网上的介绍，Maven是一款可以加快、简化基于java开发的项目构建进程的工具，构建出来的项目可以打包成jar文件并且在几个项目中进行分享使用。大体理解就是这样，但是这个工具应该如何使用呢？

1、你需要下载jdk，并且配置环境变量。使用java的基本上都知道，再说就low了。

2、下载[Maven](http://maven.apache.org/download.cgi)，里面陈列了各种版本，我使用的是 3.2.1 版本，平台基于windows系统，linux下也会有相关介绍。

3、解压下载下来的Maven包，配置Maven的环境变量。不会配置的可以看[Maven环境变量配置](http://maven.apache.org/download.cgi)页面的倒数部分。

4、熟悉Maven中的一些术语、流程、基本的命令。

我在实验的过程之中做了一个小实验，具体步骤如下：

>输入命令行`mvn -v`

<img src="/assets/images/ma1.jpg" />

这里会显示我使用的版本信息等内容。

>新建一个构建取名为`hello-world`，并且在其中新建一个文件为`pom.xml`

内容如下：
 
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>

      <groupId>com.mjgao.oprint</groupId>//新建项目组名
      <artifactId>hello-world</artifactId>//构建的名称
      <version>1.0-SNAPSHOT</version>//快照的版本
      <packaging>jar</packaging>//打包的方式

      <name>Oprint Project</name>

      <dependencies>//依赖的工具
        <dependency>
          <groupId>junit</groupId>
           <artifactId>junit</artifactId>
          <version>4.8.2</version>
          <scope>test</scope>
        </dependency>
     </dependencies>
     </project>
以上所出现的术语以及里面的一些xml文件的内容将在后面会说明。

>在hello-world文件夹下依次建立src/main/java，同时在java文件下依次建立文件夹com/oprint/mjgao/helloworld

>建立第一个程序HelloWorld.java，内容如下

    package com.mjgao.oprint.helloworld;

    public class HelloWorld {
	
        public String sayHello(){
    	  
    	     return "Hello World!";
    	}	
    	
        public static void main(String[] args){
    	   
    	      System.out.println(new HelloWorld().sayHello());
    	}
	
     }
>进入项目的根目录，在命令行输入`mvn clean compile`

<img src="/assets/images/ma2.jpg" />

从图中可以看到输出的各种信息。并且我们会看见hello-world会生成一个target目录，并且其中会有相应编译后的class文件。

>在src文件下依次建立test/java文件夹，同时按照上面的规则，建立一个测试文件HelloWorldTest.java文件，内容如下：

    package com.mjgao.oprint.helloworld;

    import static org.junit.Assert.assertEquals;
    import org.junit.Test;

    public class HelloWorldTest {
	
    @Test
    
    public void testSayHello(){
    	
    	HelloWorld hw = new HelloWorld();
    	
    	String result = hw.sayHello();
    	
    	assertEquals("Hello World!",result);
    	
    	}
    }

>在命令行输入`mvn clean test`

<img src="/assets/images/ma3.jpg" />

我们同样会看到各种测试信息。

>接着在命令行输入`mvn clean package`，根据上面pom的规则，会生辰jar文件。

<img src="/assets/images/ma4.jpg" />

我们会发现`hello-world-1.0-SNAPSHOT.jar`的文件生成。

>我们想将程序运行出来，则可以先输入命令`mvn clean install`

<img src="/assets/images/ma5.jpg" />

>输入命令`java -cp target/hello-world-1.0-SNAPSHOT.jar com.mjgao.oprint.helloworld.HelloWorld`

<img src="/assets/images/ma6.jpg" />

我们可以看到控制台输出程序中的内容。

在我看《Maven权威指南》的时候发现还有一种方式将程序运行，不过那种要安装相关plugins，感兴趣的可以去演示，我是使用官方介绍的方法来进行运行。

以下几天再对Maven进行一些简单的研究，当然对于一些概念性的东西，我就不说了，毕竟实践为王。

注：可能版本问题，输出的信息也会不一样，还是以自己的版本为准。

（完）

##参考资料

1、[get start maven in 5 minutes](http://maven.apache.org/guides/getting-started/maven-in-five-minutes.html)

2、[《Maven实战》](http://book.douban.com/subject/5345682/)

3、[Maven_Maven教程](http://www.yiibai.com/maven/)

4、[Juven Xu--Maven博客](http://www.juvenxu.com/)











  