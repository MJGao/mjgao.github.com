---
layout: post
title: "将豆瓣信息导入到自己的blog"
description: "豆瓣 API"
category: 技术
tags: [技术]
---

  前几天将github上的blog部署好，之后决定将豆瓣上的书籍信息导入到github上的blog，以后可以

直接在github上查看自己的一系列的读书近况。

  其实将信息导入到bolg上很简单，具体步骤如下：

  目前豆瓣的API文档已经到了V2版本，还在测试的过程中，我看了一下，貌似不支持javascript的客户端做法，看了一下，返回的数据基本上都是以json封装。

  `假如想以javascript来进行调用的话，可能需要看一下`[V1版本的API](http://www.douban.com/service/)。

  1、进入到豆瓣的[开发者中心](http://developers.douban.com/)，可以看一下如何快速入门；

  2、根据自身的需求，可以去申请一下API KEY。同时，可以去了解一下OAuth的使用方法，我简单粗略地看了一下，貌似要对一系列的协议要有一定的了解。目前新浪等很多公司都使用OAuth认证，改天有时间去研究一下;

  3、因为我的需求仅仅是将一些书籍信息导入到blog中，用的是javascript进行简单调用，所以其他语言的API就仅仅看了一下;

  >以下是使用javascript来对进行进行导入：

  1、`将<script type="text/javascript" src="http://www.douban.com/js/api.js?v=2" />添加`

  2、`根据需求看是否设置豆瓣APIKEY`

  3、`在V1版本中需要对返回的数据进行相关解析，具体做法有两种：`
   
  _通过查看豆瓣的数据解析方法，不过官方文档只教你如何解析subject的方式，而如果你有其他的需求，需要看一下`api-parser.js`里面封装的一系列的方法，顺便可以看一下人家的数据解析是如何实现的，可以学到一些东西。_

  _或者可以自己写javascript来对数据进行解析，不过这要仔细看一下生成数据的格式_

  我使用的是jquery中的getJSON方法，同时要在url后添加`callback参数和设置alt=xd`，这些在官方文档上都已经清楚交代，用来解决`跨域`的问题

  之后如何将信息进行布局等等内容，熟悉网页设计的基本上都可以解决。

  总结：
  
  1、V2版本的貌似没有javascript的调用方式，刚开始看的是V2版本的，数据一直加载不到；

  2、使用jquery的Ajax要在url中添加一系列的参数，解决跨域问题；

  3、以后要仔细看官方文档，熟悉人家的流程。

  4、大体看了一下豆瓣的API觉得做得还是不错，对于http的一系列的内容做得很细化很完善。

  期望：

  因为自己调用的数据总量自己严格设置了一下，底下准备通过js做一下简单地`异步加载`，完善一下。

  学习人家的设计方式，例如豆瓣的一小段js是如何对数据解析，如何解决跨域问题，都可以看到。

  

  参考：[豆瓣开发文档V2](http://developers.douban.com/wiki/?title=guide)、[豆瓣开发文档V1](http://www.douban.com/service/)、[豆瓣API OAuth认证中文版](http://www.supidea.com/post/oauth.aspx)、[了解OAuth2.0](http://oauth.net/2/)、[豆瓣OAuth认证方法](http://code.google.com/p/oauth/)

  （完）

  



  
  

 
  


  