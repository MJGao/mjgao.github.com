---
layout: post
title: "初探Requirejs"
description: "javascript Requirejs"
category: javascript
tags: [javascript]
---

最近经常看阮一峰先生的博客，从中吸收了很多新东西。今天突然看见`AMD`，大体知道：js在浏览器中的加载都是单线程单个执行，有些时候我们会在页面中放置很多js文件，这样无疑就使加载速度变慢，但目前貌似也出现了在其中添加`async`等关键字。所以针对于以上出现的问题，就有了AMD，同时也出现了很多js库，例如require.js、commonJS等，所以我也顺便玩了一下require.js，通过在官网上的学习，大体明白其设计的思想与方式。

我们看[官网](http://requirejs.org/docs/api.html#usage)上对这个库的释义：

    RequireJS takes a different approach to script loading than traditional 

    <script> tags. While it can also run fast and optimize well, the primary goal 

    is to encourage modular code. As part of that, it encourages using module IDs 

    instead of URLs for script tags.

大体意思是说：不同于传统的使用script标签来引用js，其使用它自己的定义方式，目的是使运行变快同时更有效率，它鼓励模块化编程，利用模块id代替script标签。

我们自然而然就知道了核心关键词是：`模块化`。

下面，我从官网着手，一步步学习require.js。

###基本入门

首先，我们定义一个简单的web项目，目录格式如下：

>testrequire

>>index.html

>>scripts

>>app

>>>main.js

>>lib

>>>jquery.js

>>app.js

>>require.js

>>my

>>>shirt.js//用于测试

我们在index.html页面中填入标签：

`<script data-main="scripts/app.js" src="scripts/require.js"></script>`

这里解释一下：`data-main`类似于主程序入口，不过需要通过require进行调用。

我们打开浏览器的控制台，发现如下情况：

    <script type="text/javascript" charset="utf-8" async="" data-

    requirecontext="_" data-requiremodule="app" src="scripts/app.js"></script>
可以知道在加载过程中，其实是做了一定的转化。这里也会看见`async`关键字。

我们在app.js中这样写：

    requirejs.config({
      baseUrl: 'scripts/lib',
      paths: {
          app: '../app'        
      }
    });
    requirejs(['jquery','app/main'],function($,main){
       alert("Hello Require!");
    });  
关于`baseUrl`，官网上有这样一句话：`假如对这个关键字没有定义，则默认require.js的存放位置`。 

我们暂时还没有使用main模块，我只是先写在这里。

在官网上我们会发现：模块加载的几种方式：

>直接在baseUrl中定义路径

    requirejs.config({
      baseUrl: 'scripts/lib',
      paths: {
          "jquery": "jquery",
          "ractive": "ractive"         
      }
    });

>在paths中逐一写出

    requirejs.config({
      baseUrl: 'scripts/app',
      paths: {
          "jquery": "lib/jquery",
          "ractive": "lib/ractive"         
      }
    });

>假如某一模块在远程主机上

    requirejs.config({
      baseUrl: 'scripts/app',
      paths: {
          "jquery": "http://XXXXXX",
          "ractive": "http://ssssss"         
      }
    });



###注意点1：

假如有如下代码样式：

    <script data-main="scripts/main" src="scripts/require.js"></script>
    <script src="scripts/other.js"></script>

main.js中配置如下：

    require.config({
      paths: {
          foo: 'libs/foo-1.1.3'
      }
    });

在other.js文件中定义如下：

    require( ['foo'], function( foo ) {
        //TO-DO
    });

我们要清楚在使用了require.js后，对于其中文件的加载顺序。上面的先会加载other.js，之后才会触及到main。

###模块定义的基本使用

我们在shirt.js中定义如下代码：

    define({
        calSize: function(){
        alert("The size is xxl!");
     },
        shName: "Tshirt",
        color: "black"
    });

同时，我们在app.js中的`paths`中添加如下定义：`my: '../my'`

    requirejs(['jquery','my/shirt'],function($,shirt){
       alert(shirt.color);//输出black
    });  

###注意点2：硬盘上的每个文件只能定义一个模块

官方提供了几种定义模块的方式，并且模块的规范遵从[AMD规范](https://github.com/amdjs/amdjs-api/wiki/AMD)

>当没有任何其他模块或文件依赖的时候

    define({
       color: "black",
       shName: "Tshirt"
    });

>当没有任何模块或文件要依赖，但是需要使用函数去做一些事情

    define(function(){
         return {
             color: "black",
             shName: "Tshirt"    
         }
    });

###使用依赖定义相关方法

下面我们再对项目目录进行补充：

>>my

>>>cart.js

我们在cart.js中定义如下内容：

    define(["./shirt"],function(shirt){
      return {
         addShirt: function(){
           alert(shirt.color);
         }
      }
    });//说明cart需要引用shirt

在app.js中调用cart模块，则会输出相关内容。

###如何使用非规范模块

对于Backbone、Underscore这些js库，并没有提供相关AMD规范，但是假如要在require中使用它们，应该如何使用？

    requirejs.config({
       'backbone': {
         deps: ['underscore','jquery'],
         exports: 'Backbone'
     },
       'underscore': {
         exports: '_'
     },

    });

    define(['backbone'], function (Backbone) {
       return Backbone.Model.extend({});
    });

总体上，先码这么多了，其实还有很多内容，包括在使用这个库的时候需要注意的地方等，基本上来说，这个用于在前端的代码优化中，为开发人员制定快速的页面加载提供了帮助。

(完)

###参考资料

1、[avascript模块化编程（三）：require.js的用法](http://www.ruanyifeng.com/blog/2012/11/require_js.html)

2、[使用 RequireJS 优化 Web 应用前端](http://www.ibm.com/developerworks/cn/web/1209_shiwei_requirejs/)

3、[require.js官方API](http://www.requirejs.org/docs/api.html#config-shim)

4、[AMD规范英文版](https://github.com/amdjs/amdjs-api/wiki/AMD)

    
    


  











     















  