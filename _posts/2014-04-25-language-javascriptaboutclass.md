---
layout: post
title: "javascript中所学习的一些知识点"
description: "javascript 知识点"
category: javascript
tags: [javascript]
---

这段时间一直在看javascript的相关内容，老早之前一直都觉得javascript是一个简单的东西，遇到做一些特效、网页工具什么的都可以直接copy人家写好的代码，最近想到发现自己确实是想错了，javascript还是需要花费一定时间去好好探索一下，包括其中的作用域、原型链、DOM操作、浏览器的兼容问题等。

记录一下javascript的定义“类”的方式。

一些有关javascript的书籍中开篇都提出`函数是一等公民`。javascript中的所谓的类都可以模拟，包括我们所熟知的一系列的`设计模式`，都可以通过javascript来进行模拟构造。

我正常使用的方式定义方式如下：

>使用构造方法

    function People(){                
   
    this.name = "mjgao";

    this.email = "ecgaoxiang@gmail.com";

    }

 可以通过`new`关键字生成实例

    var p = new People();

    alert(p.name);//显示name的值

 如果我们需要再给People添加一些额外的方法，可以使用`prototype`关键字

    People.prototype.run = function(){
 
      alert(People.name);

    };

>封装的方式

    var people = {

      name : "",

      email : "",

      run : function(){
        //.........
      }

    };

调用方式可以如同第一种方式。

我第一次使用的时候看上去如同json的封装方式，后来看过一篇文章，说json的数据封装方式采用的是面向对象的方法。

同时我们在定义一系列的函数的时候也可以采用一系列的简单方式，我常用的有如下：

    function run(){
    
     //..............
    
    }
或者

    var run = function(){

    //..............
    
    }


同时知道了有个叫自运行函数的用法，如下：

    （function(){

      var namespace = "";

      var version = "";

      var People = function(){

      //..............

    };

    }）()

突然发现对javascript中的很多东西目前了解的还是很少，再深入的途中确实也发现了很多的新东西，能够让自己去好好修正自己对一门预言的看法。

底下对javascript如何来模拟一系列的设计模式来简单学习一下。

>参考资料
>>1、[Javascript定义类（class）的三种方法](http://www.ruanyifeng.com/blog/2012/07/three_ways_to_define_a_javascript_class.html)

>>2、[《javascript语言精粹》](http://book.douban.com/subject/3590768/)







  