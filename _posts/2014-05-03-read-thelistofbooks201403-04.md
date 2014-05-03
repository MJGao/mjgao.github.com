---
layout: post
title: "2014年3月到4月所看的书"
description: "读书"
category: 读书
tags: [读书]
---

从2月份后期到4月份末期一直在学校呆着，期间除了参加了几次面试，学了点面经，吃了几次饭，打了几次重麻，将毕业设计做完，其余的时间貌似就是看电影、上网、看书了，想想时间过得确实很快，明天又要出发去苏州了，乘这个空闲时间，将这两个月所读的书籍做一下总结。

技术类：
---
《鸟哥的LINUX私房菜》

 <a href="http://book.douban.com/subject/1400361/"><img src="http://img3.douban.com/mpic/s1919084.jpg" /></a>

这本书从头到尾介绍了一下linux系统，对于一系列的常用指令都做了一下详细的讲解，同时在学习linux的时候所需要掌握的一系列的注意点，自己也是linux上的菜鸟，所以当时学的时候使用的是在windows下装的双系统，利用的是ubuntu版本，因为这对于新手学linux是很容易的，相比较其他的版本而言，在安装上面不需要花费太多的时间。

《Spring揭秘》

<a href="http://book.douban.com/subject/3897837/"><img src="http://img5.douban.com/mpic/s3949449.jpg" /></a>

这本书是我所认为spring中讲解的最好的一本书，不过作者确实很牛叉，原本就是淘宝的资深人士，所以能够写出这本书也是理所当然。不过目前市场上好像也没有纸质的再卖了，我还是找了很久在网上找到的电子档，如果是以为spring新手，或者从来没有使用过spring，或者仅仅是知道一些理论知识，建议不要看这本书，否则会很吃力。其中讲IOC、AOP都讲解的很详细，同时对于spring中的container的启动、bean的运行过程都描述得很清晰，有空再拿出来温习一遍。

《java多线程设计模式》

<a href="http://book.douban.com/subject/1281934/"><img src="http://img3.douban.com/mpic/s1406772.jpg" /></a>

这本书是偶然在图书馆看到的，后来看了一下感觉还不错。再读这本书的时候，建议还是要对os有一定的了解，os中所涉及的信号量机制、原语、一些经典的进程/线程分配算法（例如producer/consumer、银行家算法等）要有一定的认识，因为书中很多代码都是站在java thread的角度来进行编写，不过遗憾的是目前第二版没有中文版，只有日文版，因为此本书在当时并没有将NIO、concurrent并发包的内容加到里面。

《分布式java应用》

<a href="http://book.douban.com/subject/4848587/"><img src="http://img3.douban.com/mpic/s4372843.jpg" /></a>

说句不好听的话，身处同一地，写出的书会在水平上拉出很多层次。稍微读了一下这本书，个人觉得一般般，里面对NIO的select、epoll等都讲解的不是很清晰，同时在描述TCP和UDP网络编程的时候并没有讲解得很透彻，后面会涉及很多如何做高并发的工具，以及如何站在JVM的层面上进行相关调优，总的看下来，还是需要在行业里有一定的经验的人群阅读，对于我们这种学生目前可能只是只能了解一下，而想真正利用里面的东西可能对于绝大部分都不太现实。

《Scala虚拟机多核编程实战》

<a href="http://book.douban.com/subject/4909629/"><img src="http://img5.douban.com/mpic/s4911906.jpg" /></a>

去年就知道了scala，同时也将本书简单读了一下，这一学期又重新看了一下，对于里面的而一些基础知识又有了新的认识，上个月java8出来了，增加了lambda表达式、分布式处理等一些新的元素，不过很多内容都感觉与scala很相似。最近看到很多新闻都说目前很多公司都开始使用scala，包括spark也是使用scala。所以在后期还要重点学习一下，对于Actor的并发编程还要深入研究一下，才可以掌握这门语言。

《Android移动应用开发》
  
<a href="http://book.douban.com/subject/21266844/"><img src="http://img3.douban.com/mpic/s25116164.jpg" /></a>

因为毕业论文的原因，所以特地重新学习一下Android，市场上的Android相关书籍也越来越多，而好的书籍也就那基本，大体看了这本书，主要讲解的是Android中的网络编程、一些UI的设计、使用Canvas等内容，同时涉及了LBS操作，总体而言也是工具书，对于具体的内部细节也并没有深入多少，不过还是需要对Android有一定的认识的基础之上来看这本书。

《hadoop实战》

<a href="http://book.douban.com/subject/6860889/"><img src="http://img3.douban.com/mpic/s6950784.jpg" /></a>

属于cookbook一类的书籍，如果想尽快认识hadoop，并且通过hadoop认识诸如Hbase、zookeper、Pig等内容的可以去参看这本书，同时可以学习书中如何使用hadoop写一些小型的数据分析程序，以及hadoop中各节点是如何运行，如何部署单机式、伪分布式、分布式hadoop程序，并且如何使其余的一些大数据框架在hadoop中融合运行都做了简单的介绍，不过建议还是需要学习一下linux。其实看过google几年之前的三篇大数据的论文，其中就包括mapreduce算法，bigtable，hadoop的思想就源于此。

《MongoDB实战》

<a href="http://book.douban.com/subject/19977785/"><img src="http://img5.douban.com/mpic/s22720019.jpg" /></a>

最近几年NOSql确实比价火热，所以去掌握一些NOSql的数据库，例如MongoDB、Redis、couchDB等是提升自己的一个方面，抽空顺便看了一下这本书，里面谈到与json相对应的BSON数据的存储方式，包括如何相比较于传统的关系型数据库在垂直划分的优势，里面还讲到了如何使用此数据库进行集群划分，总的来说，对js有一定的了解人学习这门数据库还是相对而言容易一些，其实对于我来说，看这个，只是打开脑中的另一扇窗户，增长点知识。

《expert one-on-one J2EE Development without EJB 中文版》

<a href="http://book.douban.com/subject/1436131/"><img src="http://img5.douban.com/mpic/s1493446.jpg" /></a>

在这本书面前，突然发现自己学得是有多肤浅，同时对于行业中的知识知道得是有多稀缺。说实话这本书我压根就没有读得下来，虽然之前也看过一点EJB，但是对于里面涉及到的一些内容却是感觉压力很大，再加上是一本大块头的书籍，所以总体而言会让自己吃力不少，这本书目前貌似市场上也没有卖了，有的只剩下英文版，以后等工作了自己入手一本作为提升。（太坑）

《C程序设计语言》

<a href="http://book.douban.com/subject/1139336/"><img src="http://img3.douban.com/mpic/s1106934.jpg" /></a>

这是C语言系列中被大家公认的最好的一本书，哈哈，很荣幸我也读了一下。书确实是不厚，不过东西确实很多，也针对于对C有一定的了解的童鞋，看到书中编写的一系列的算法，例如atoi等，说实话，书大略看了一下，对于里面出现的一系列的算法着实还没有去深入，找个时间温习一下。

《HTTP权威指南》

<a href="http://book.douban.com/subject/10746113/"><img src="http://img3.douban.com/mpic/s9109250.jpg" /></a>

这本书确实是太贵了。还好我看的是电子档，没办法，等腰包真正鼓起来了我再支持正版吧。书中对http的相关协议讲解得都很到位，对于一些web中所出现的状态码、文件结构、缓存、代理、客户端与服务器交互、编码问题都有一定的介绍，总而言之相对于一本科普书籍。最近在看豆瓣的API，感觉他们做得还是不错，对于http中的put、delete等做得确实相当详细。

《大师之路》

<a href="http://book.douban.com/subject/2327417/"><img src="http://img5.douban.com/mpic/s2782547.jpg" /></a>

读这本书的原因很简单，并不是想让自己的ps技术达到多高超，我本身对这个也提不起多大的兴趣。第一，因为做Android应用需呀手动设计一些UI图标；第二，因为对于图形这些自己之前没怎么看过，所以补充一下。很庆幸自己选择了这本书籍，对于RGB色彩的原理、像素、变换、图层、滤镜这些东西我都有了一定的了解，这解决了我在编写css的时候，对于使用这些东西的时候感到一头雾水的问题。

《javascript DOM高级编程》

<a href="http://book.douban.com/subject/1921890/"><img src="http://img3.douban.com/mpic/s1958902.jpg" /></a>

这本书看完之后，瞬间觉得javascript高大上，同时也觉得自己对于js理解原本就是一塌糊涂，这是一个多么痛的领悟。

《javascript语言精粹》

<a href="http://book.douban.com/subject/3590768/"><img src="http://img3.douban.com/mpic/s3651235.jpg" /></a>

很薄的一本书，却可以彰显开发者的基础与真实水平，不信？你试试。

互联网文化类
----

《黑客与画家》

<a href="http://book.douban.com/subject/6021440/"><img src="http://img3.douban.com/mpic/s4669554.jpg" /></a>

很遗憾自己没早点来读这本书，对于里面的很多思想假如自己早些时候能够吸收的话确实现在又在想法方面有很大的不同。书中的内容我就不想书透了，感兴趣的可以去阅读以下，我最喜欢的是主人公对于创业的看法，对于语言的评判与划分，确实是很有意思。

《结网》

<a href="http://book.douban.com/subject/4736118/"><img src="http://img3.douban.com/mpic/s4254712.jpg" /></a>

这本书算是互联网文化中写得相对而言较好的书吧，讲述了作为一名产品经理需要掌握的一些基本原则与做事风范，同时作者从自身出发（可以去看作者简介），讲述了如何运营一个自己的产品，以及如何来做相关的时间规划，总体而言，对我的最大帮助是如何更好地对计划做好规划，如何高效完成自己的事情。

《代码阅读方法与实践》

<a href="http://book.douban.com/subject/1151672/"><img src="http://img3.douban.com/mpic/s1114890.jpg" /></a>

这本书是在火车上看的，总的而言，一般般，没有达到我的所想，对于如何阅读代码也说得也是模棱两可，正准备通过这本书来学习阅读一些中大型开源项目的代码，看来省省吧。

文学小说类
-----

《白夜行》

<a href="http://book.douban.com/subject/3259440/"><img src="http://img3.douban.com/mpic/s4610502.jpg" /></a>

很不错的一本小说，东野圭吾正常在侦探类的小说类很有建树，不过他的小说多了一些探讨人性邪恶的东西，同时在阅读的途中会给人不一样的思考，豆瓣上有很多书评，我就没必要在这里BB了。

《陆犯焉识》

<a href="http://book.douban.com/subject/6880158/"><img src="http://img3.douban.com/mpic/s7645594.jpg" /></a>

以前看过此作者写的《金陵十三钗》，然后看了这部，相比较而言，还是喜欢这部，将主人公的命运描写得真的是如此精致。老谋子的《归来》要上映了，就是根据这部小说改编，我正想要不要给中国票房做点贡献？

《荒原狼》

<a href="http://book.douban.com/subject/2165037/"><img src="http://img3.douban.com/mpic/s27059333.jpg" /></a>

这是一本我认为写的很有思想的书籍，从此我的偶像又多了黑塞。正值那段时间心情不好，给了我很多平复。

《丰乳肥臀》

<a href="http://book.douban.com/subject/1010349/"><img src="http://img3.douban.com/mpic/s1102803.jpg" /></a>

莫言的描写母亲历史长河的作品，内容夸张具有可读性，不过我当时猜想如果将这部作品拍成电影或电视剧那真是多有意思！哈哈

《沧浪之水》

<a href="http://book.douban.com/subject/1054917/"><img src="http://img3.douban.com/mpic/s1077712.jpg" /></a>

这本书比起《鸟官》来说不知道拉了多少条街，呵呵。看见豆瓣很多人的书评都说，假如早点看完这本书，将会少走很多弯路，我再想，有吗？说实话，我不是那么相信因为一本书就可以改变一个人的命运的这句话。可能读书只是一种去除心灵杂质的过程吧。

《棋王》

<a href="http://book.douban.com/subject/1020961/"><img src="http://img5.douban.com/mpic/s26237958.jpg" /></a>

在阿城的《棋王》、《树王》等作品中，我觉得写得最带劲的可能就是《棋王》，吃相的描写、棋艺的展示等等，都是让我感到有一种浑然天成、道家思维在里面，让人感觉到中国传统的思想的精髓也可以带到小说中给小说增添光彩。

《平凡的世界》

<a href="http://book.douban.com/subject/1084165/"><img src="http://img5.douban.com/mpic/s1120877.jpg" /></a>

这是我第二次看这部作品，我已经不想评价了，这是一套在我这个最尴尬的年纪、最尴尬的境遇给我宁静的书籍。

《罪与罚》

<a href="http://book.douban.com/subject/1022632/"><img src="http://img3.douban.com/mpic/s1940505.jpg" /></a>

不做评价，自己太过肤浅。

总结：多给自己做一个总结，后期希望自己能够将所读的书籍的范围做一下拓展，不是老在这几个栏目里挑选，引用毛姆在一片文章中的一个观点，我只是大体上记录一下：

    阅读的意义：阅读并不是让你通过书来获得你所需要的金钱财富，也许你阅读并不能像你学习一门手

    艺一样，可以给你带来面包，但是阅读是一种无形中的财产，会慢慢地改变你对一些问题的看法，会

    慢慢改变你对自身的看法，会慢慢改变你对人活着的看法。

（完）

