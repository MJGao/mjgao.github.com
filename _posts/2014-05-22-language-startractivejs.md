---
layout: post
title: "初探Ractivejs"
description: "javascript Ractivejs"
category: javascript
tags: [javascript]
---

之前一直写后端代码，对于前段的一系列的知识点学习的并不是那么完善。而MVC这种设计原理也一直是我们关注的。这几天我就在想，是否前端也有这类东西呢？后来我就上网搜索了一下，发现了最近几年有很多关于前端MVC框架的，例如backbone.js、AngularJS、Ember.js等等，这些成熟的前端框架无疑给开发人员带来了很大的便利。所以，我也找了一个可以来初探此内容并能够给我带来一些设计上的灵感的框架，所以今天将自己所学习的内容mark一下。针对于这款框架是什么，为什么需要这个，可以自己去搜索相关资料。

根据[官方](http://www.ractivejs.org/)的介绍，对于Ractivejs的说明是：` template-driven UI library`，所以我们可以看到其实一个模板驱动框架，它也提供了诸如`Two-way binding(双向数据绑定)`  `animations`  `SVG`等等功能，同时也为开发人员留下很多拓展性，让他们可以去写插件。当然，网上也有很多内容去介绍这款框架的使用方法，但我还是觉得自己手动操作一下，得到的经验总比单纯地看人家怎样使用来得快。

以下很多内容都来自[官方教程](http://learn.ractivejs.org/hello-world/1/)，Ractive官网专门有一个learn区域，可以在上面测试自己所写的代码，我觉得特别棒。

####使用步骤说明：

1、首先定义一个容器，用于后期render。代码如下：

    <div id='container'></div>

2、定义模板区域。

    <script id='template' type='text/ractive'>
    <p>My name is {uname}!</p>
    </script>

3、使用js代码进行数据的载入。

    <script>
     var ractive = new Ractive({
     el: 'container',
     template: '#template',
     data: {uname: 'MJGao'}
     });
    </script>

4、最后早在html文件中引入Ractivejs库，在浏览器中运行，你会发现页面显示出：`My name is MJGao!`

以上只是一个简单的初始入门，我们知道框架的组成都是包括人家定义出来的各种方法、属性，而作为用户我们需要去学会使用，因为你知道怎么用了，你才能够渐渐看它源码最终明白人家是怎么设计出来的。

####API的相关使用

>数据的更新

假如现在你叫Jason了，我们需要将uname内容改掉，那么我们可以使用如下方式：`ractive.set('uname','Jason');`就会看到页面显示：`My name is Jason!`

>关于KeyPath

官方定义` A keypath is a string representing the location of a piece of data`。所以我的想法是，数据对象也有自己所在的位置空间。例如，我们以前在看HashMap的时候，知道如何得到一个Key的Value，所以自然而然我们也能够知道这就是通过寻址来找自己的值位置。

我们可以定义复杂一点，例如：

    <script>
     var ractive = new Ractive({
     el: 'container',
     template: '#template',
     data: {
      uname: 'MJGao'，
      email: 'ecgaoxiang@gmail.com',
       country: {
            cname: 'CHINA',
            mlocation: 'Asia'
        }  
      }
     });
    alert(ractive.get('country.cname'));
    </script>
将会输出`CHINA`

假如现在叫MJGao的这B去了美国，则我们需要修正他的国家名称，我们可以这样使用：

    var country = ractive.get('country');//获得country这个对象
    country.cname = 'AMERICA';//对cname进行修改
    ractive.update('country');//使用API中的update方法
将会输出`AMERICA`

接下来，我们要将人口数量属性添加到这个国家，则使用ractive.add()，如下：

      ractive.add('country.population');
      country.population = '300';
      ractive.update('country');

接下来我们来看一下`observe`，按照我的理解，其充当一个观察者，监控一系列的数据的变化，例如现在CIA要检测到数据的变化情况，我们可以定义如下：

     observer = ractive.observe('country.cname',function(newValue,oldValue,keypath){
      alert(keypath + "is changed to" + newValue);
    });
    ractive.set('country.cname','INDIA');
运行过程中发现当上一个步骤将cname变为AMERICA的时候，也会检测到相应的变化。所以，我猜想，observer是否充当了全局的观察者？

不知道哪一天，公民都发现了这个监测事情(理解为棱镜计划吧)，所以很愤懑，要求取消，我们可以这样使用:

    observer.cancel();
    ractive.set('country.cname','CHINA');
将不会在监测到什么内容了。不过主人公也怪坎坷的，国籍是换个不停。
`关于observer官方文档上还有很多介绍，我这里就不再举例了，有兴趣的可以自行去发现。`

>关于Events

我们知道在js中事件是一个很重要的元素，在以往我们需要给一个元素添加事件的时候会使用到形如`X.addEventListener('XX',handle);`而在ractivejs中，我们也有相应地定义事件的方法，例如：
     
     html代码：
     <button on-click='activate'>Activate!</button>
     <button on-click='deactivate'>Deactivate!</button>
     
     js代码:
     ractive.on({
       activate: function(){
           alert(country.cname);
         },
    
       deactivate: function(){
           alert('hehe');
       }
     });

>关于数据的双向绑定

如果对于你在的APP中数据双向绑定并不适用，则你可以通过`twoway: false`进行取消即可。下面可以看几个例子：

      <input placeholder='Type your name' value='{{country.cname}}'>
我们在文本框中输入一个值，点击按钮，就会立即看到输入的值；或者可以将p标签中的改成{{country.cname}}可以更明显得看出来。
其实官方还介绍了融合`observer`来进行使用，所以我比较喜欢这个可以及时观察哪些东西改正了，比如可以使用这个写一个编辑器什么的，有空可以试试。

>关于Ractivejs中的Array

    在模板中定义如下：
     <ul>
      {#list}
      <li>{this}</li>
      {/list}
     </ul>

    var list = ['a','b','c','d'];//这个一定要在之前进行定义,因为有use strict的限制，一
   
    定要加var修饰。

    在data中添加list： list
我们会发现此模板会自动解析这个ul列表，顿时感觉很强大，也没写什么循环。

我们也会发现数组也定义了原始js中的方法，例如`pop`, `push`, `shift`, `unshift`, `splice`, `sort` and `reverse`等。感兴趣的可以一个个实验一下。

>关于Partials

其实我也不知道该如何定义这个词，我看有网友定义为`局部模板`，姑且我就先这样定义。

使用方法如下：

首先定义一个模板：

     <div class='items'>
       {#items}
          {>item}
       {/items}
     </div>

接着我们来使用这个定义的局部模板：
     
    <li class='item'>
       <!--{>item}-->
         <span>{filename}</span>
       <!--{/item}-->
    </li>

在data区域中增加数据如下：

     items: [
       {filename: '1.jpg'},
       {filename: '2.jpg'},
       {filename: '3.jpg'}
      ]
其实官网上还有很多需要去看的内容，而且很多内容需要去深入研究，总的来说，这类框架的好处在于将数据的挖掘、显示都进行分离，总而使逻辑变得清晰明了，代码也易于编写。而且之后我发现其实有很多都使用了很多设计模式。

总结：因为之前看过Velocity、php中smarty模板引擎的相关使用方法，包括这个博客的搭建里面的一些代码的编写感觉在模板的使用方面都差不多，当然应用的领域肯定有差别。后来知道Ractivejs是基于mustaches来做的，貌似很多模板引擎都是这样，昨天顺便看了一篇文章，对于此类框架的实现也有了一定的头绪，当然其中会涉及到Lex、Yacc等内容，突然发现学好编译原理是多么一件重要的事情。不清楚的可以看一下这篇文章[How to realize velocity template interpreters](http://shepherdwind.com/2012/11/29/how-to-realize-a-compiler/)当然想达到这种水平还是需要去不断学习。

计划：以下几天去看一下人家这些框架是如何实现的，只有这样才能说明真正搞清楚一个东西。

[测试代码下载](http://mjgao.github.io/assets/download/testreac.rar)

###ps：由于本博客模板解析的问题，所有的单`{}`改为里面再包一个{}

###参考资料

1、[How to realize velocity template interpreters](http://shepherdwind.com/2012/11/29/how-to-realize-a-compiler/)

2、[Ractivejs官网](http://www.ractivejs.org/)

3、[Ractive.js -- 前端MVC框架学习第一步](http://www.html-js.com/article/A-day-to-learn-JavaScript-Ractivejs-frontend-MVC-framework-for-learning-the-first-step)
    

     















  