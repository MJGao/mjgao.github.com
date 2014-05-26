---
layout: post
title: "初探Backbonejs"
description: "javascript Backbonejs"
category: javascript
tags: [javascript]
---

今天和朋友跑步，顿感一个多月没有去运动的结果是：在仅仅五圈之后我突然感到有一种说不上来的尿分叉的违和感。朋友问起我最近在玩什么，我说js的一些成熟的框架。

对啊，自从毕业论文结束，我好像一直看的是js相关的内容，因为之前就说过，这东西其实并不是想象中那么简单。前几天和曾博吃饭也聊到js，记得他说：js其实并不是想象中那么容易，你们大学里学习的都是皮毛，等你真正研究起来你就会发现很多你没发现过的瓶颈。确实是这样，在github上我也看了人家用js写的很多东西，给我一个印象是，人类的头脑确实是太牛叉了，转念一想，我什么时候才能够用这语言写一个自己的东西呢？所以，今天我和朋友说，之所以这几天在研究这些框架，也是多学习一下，看看人家的设计思想与原理，从而在以后自己来写相关东西的时候可以有支撑。

    也许，看代码，犹如读一本书，不同的是，看完后多动手，你就可能知道怎么写，但是书读多了，你

    不一定能写出那种文章。

今天，整体玩了一下backbonejs，突然感觉与之前玩的ractivejs的使用方法上完全不在一个层次，前者更难一点，也是需要花一点时间去进行理解。当然在玩的过程中，我也看了一下人家是对这个框架怎么定义的，以及这个框架是什么，这个框架能够干什么事情。

以下是[官网](http://backbonejs.org/#examples-artsy)上对backbonejs的一段介绍，如下：

    Backbone.js gives structure to web applications by providing models with key-

    value binding and custom events, collections with a rich API of enumerable 

    functions, views with declarative event handling, and connects it all to your 

    existing API over a RESTful JSON interface.
以上，提到了backbonejs中三个重要的元素：`models`、`views`、`collections`，同时对此类框架的定义是：为web应用程序提供一个框架，主要的key-value数据绑定、用户事件、事件处理等内容都是可以通过以上的三个元素来解决。

在[开始学习Backbone](https://www.ibm.com/developerworks/cn/web/wa-backbonejs/)这篇文章中所说：backbone 是一个 JavaScript 框架，可用于创建模型-视图-控制器 (model-view-controller, MVC) 类应用程序和单页界面。其实我的理解就是：`对于如何协调大量数据与DOM的操作的问题，对此提供一个利用MVC模式设计思想的解决方案。`感兴趣的也可以从这篇文章着手。同时关于Backbone的应用场景可以看[Backbone.js 的最佳应用场景有哪些？](http://www.zhihu.com/question/19720745)这个问答帖。

下面，就从API着手，来尝试一下backbone的基本用法。

###注意：Backbone强制依赖underscore js库，而对于jQuery不强制依赖，在涉及到json数据解析的时候可以使用json2解析库。

>##关于Backbone.Model的基本用法

Model就是模型的意思，用来集合各种数据、操作。而在Backbone中通过使用`extend`关键字来使用。具体如下：

定义一个Student的Model：

    window.onload = function(){
      var Student = Backbone.Model.extend({
      initialize: function(){
         alert("I am a student!");
      }
     });
    }

下面我们实例化一个对象：

     var stu = new Student();

我们考虑到Student中还需要添加一些属性，可以这样：

     stu.set({'name':'mjgao'});
     
同时，我们想获得这个属性的值：

    stu.get("name");//输出mjgao

我们会发现上面程序除了输出mjgao，也会输出`I am a student!`，这是因为`initialize`关键字在Model实例化的时候会进行相关的初始化。

下面我们判断stu中是否有name属性，则使用：

    if(stu.has("name")){
      alert("yes");
    }else{
      alert("no");
    }

在Backbone的API中，针对于Model提供了一个`defauls`关键字，可以这样使用：
  
    var Student = Backbone.Model.extend({
      initialize: function(){
         alert("I am a student!");
      },

      defaults: {
         "school": "ctbu",
         "position": "stu"
     }
     });

可以这样使用上述定义内容：

    new Student.get("school");

我们知道在学习数据库的过程中，某些时候对于一条记录都会有一个唯一的标示符id，而在Model中也同样存在。

    var Student = Backbone.Model.extend({
      idAttribute: "_id"
     });

    var xStu = new Student({_id:1,name:"ecgx"});
    alert("stu id:"+xStu.id);

其实在官方文档中还会涉及到`id``cid`等用法，可以去相互比较一下。

在Backone的文档中设计两个关键词`save``sync``fetch`，他们可以相互配合使用。在与server进行相互通信的时候，主要对数据进行相关处理。使用方式如下：
  
    Backbone.sync = function(method,model){

    alert(method + ":"+JSON.stringify(model));

    //model.set('id',1);//官方文档中是这样使用，但是我测试的时候报错
    };

接下来定义Model:

    var book = new Backbone.Model({

    title: "ec",

    author: "gx"
    });
    book.save();
    book.save({author: "mjgao",id:1});//这样定义将会正常显示

我们会发现从`create`变为`update`，数据状态发生了改变。

backbone还提供了`validate`方法，同时针对于underscore中的一系列的调用方法也提供了支持，感兴趣的可以去看一下。


>##关于Backbone.Collection的基本用法

正如在java中一样，collection其实就是将各个模型进行整合，从而成为一个集合。   

我们定义如下：

    var lib = new Backbone.Collection([
      {name: "java",author: "jack"},
      {name: "Mysql",author: "emey"},
      {name: "php",author: "emey"}
    ]);
    alert(JSON.stringify(lib));

或者我们可以这样：

    var lib = Backbone.Collection.extend({
      model: book
    });

我们可以通过`get(id)`来获得其中的某个model。其实collection的各种操作就如同对数组进行相关操作，都具有相似性。可以查看官方文档上的各种方法进行试验。

>##关于Backbone.Router的基本用法

我们一看到这个词就想到`路由器`。在Backbone中其实通过`hash fragment(散列片段)`来识别一个特定的页面状态，之前的版本是使用类似于`#page`这样的标示符，而现在的版本支持标准的URLs格式：`/page`，看一下是如何使用的。

    var workspace = Backbone.Router.extend({
        "help":                 "help",    // #help
        "search/:query":        "search",  // #search/kiwis
        "search/:query/p:page": "search"   // #search/kiwis/p7
     },

        help: function() {
        ...
     },

       search: function(query, page) {
        ...
     }
    });

这是官网上的一段实例程序，根据不同的片段，出发不同的函数。

底下，我们可以进行实例化：

    var ws = new workspace();

根据文档的说明，在页面加载过程中，为了保证所有的route已经完成创建，需要调用如下的方式：

    ws.history.start(), or ws.history.start({pushState: true})

进行对初始url进行路由。

ps:暂时我也是先了解这个概念，实际操作放到后面再完成。

>##关于Backbone.View的基本用法

首先定义一个View的代码样式如下：

    var myDoc = Backbone.View.extend({
     tagName: "li",
     className: "content",
     events: {
     "click .icon":          "open",
     "click .button.edit":   "openEditDialog",
     "click .button.delete": "destroy"
    },

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
     },

    render: function() {
     //可以进行自主渲染
     }
    });

同时我们也可以像Ractivejs中一样，为了不让js中充斥大量的html，可以进行自含有模板，定义方式如下：

    <script id="myTemplate" type="text/template">
    <%= title %>
    </script>

同时，在js中这样写：

    var myDoc = Backbone.View.extend({
      className : '.team-element',
       tagName : 'div',
       model : book,
       render : function() {
            var Template = _.template($('#myTemplate').html());//渲染
            $(this.el).html(Template(this.model.toJSON()));
       }
    });
后面的几块内容，自己准备在明天做一个小项目，从而将这些东西都用到里面去。

总结：每一个别人写的库都会提供很多方法给程序员调用，而如何将这个库真正地应用在自己的项目或者产品中，并且能够产出最大的效益，是需要当做成本去进行评估的。而在学习的过程中，我的想法就是先学会用，再融合到项目中，最后深入源码进行深入。

（完）

###参考资料

1、[开始学习 Backbone](https://www.ibm.com/developerworks/cn/web/wa-backbonejs/)

2、[Backbone JS框架指南](http://blog.eood.cn/backbone)

3、[Backbone官网](http://backbonejs.org/#View-extend)
  











     















  