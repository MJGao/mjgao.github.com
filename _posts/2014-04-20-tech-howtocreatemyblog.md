---
layout: post
title: "如何在github上创建自己的博客"
description: "github 博客"
category: 技术
tags: [技术]
---

最近终于将github上的博客创建成功，其中也确实遇到很多问题，包括对github不太了解，还是朋友推荐我来使用，所以作为一个生手的话确实还需要了解一下几个内容。

虽然网上已经有很多内容来介绍了，但是这里自己mark一下，做个简单记录。

这里对需要掌握的几个知识点罗列一下：

`1、需要对常用的git指令有一定的了解`

`2、需要对一个博客如何生成的内部原理有一定的认识，这里我使用的是jekyll`

`3、需要安装ruby等一系列的工具`

`4、环境搭建完成之后能够自己做一份简单的博客模板引擎`

`5、知道Liquid、markdown的基本书写方式`

具体操作如下：

>从[ruby](rubyinstaller.org)上下载ruby。

>选择对应ruby版本的devkit，可以在ruby官网上找到，输入如下几个命令进行安装：

    cd devkit
    ruby dk.rb init
    ruby dk.rb install
完成ruby的相关安装
>安装gem

>使用gem安装jekyll

    gem install jekyll

安装完成之后，输入`jekyll serve`可以如同服务器一样被打开，然后在浏览器中输入`loclahost:4000`。

如果自己写一个博客模板引擎，利用指令进入该文件。例如我是在windows下操作：

    cd jekylldemo//jekylldemo是我新建的项目

同时网上也提供很多漂亮的现成的模板引擎，可以参看人家[搜藏的模板引擎](http://yuanyong.org/blog/collect-jekyll-theme.html)，或者你可以去github上看人家的博客，然后copy下来修改。

如果有自己的域名，可以添加文件CNAME，在里面输入自己的域名地址即可。

如何写一个自己的模板引擎，可以参看[搭建一个免费的，无限流量的Blog----github Pages和Jekyll入门](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)或者[在Github上搭建Jekyll博客和创建主题](http://yansu.org/2014/02/12/how-to-deploy-a-blog-on-github-by-jekyll.html)两篇文章。

博客弄完之后直接按照github上的规则push到自己建的项目里面去就行了。如何新建自己的项目可以参看网上的文章。

>参考资料

>>[搭建一个免费的，无限流量的Blog----github Pages和Jekyll入门](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)

>>[在Github上搭建Jekyll博客和创建主题](http://yansu.org/2014/02/12/how-to-deploy-a-blog-on-github-by-jekyll.html)

>>[Liquid for designers](https://github.com/shopify/liquid/wiki/liquid-for-designers)

>>[Markdown 语法说明 (简体中文版)](http://wowubuntu.com/markdown/)









  