---
layout: post
title: "java中的RMI(远程方法调用)"
description: "java RMI"
category: java
tags: [java]
---

RMI应该算是比较老的概念了，很多人都喜欢将它与SOA、JMS等进行比较与说明。我之前也接触过这个，看Tomcat源码教程的时候也知道了有个叫JMS的东西，后来就顺势知道了这些。

这篇文章，简单讲述了一下什么是RMI，它有什么作用，我们应该如何使用RMI。我觉得只要掌握了这三点，简单入门应该算不成问题了，而之后的进阶我觉得可以去看相关框架中的应用，例如Spring中对RMI的运用等。

以下是维基百科对RMI的解释：

    Java远程方法调用，即Java RMI（Java Remote Method Invocation）是Java编程语言里，一
    种用于实现远程过程调用的应用程序编程接口。它使客户机上运行的程序可以调用远程服务器上的对
    象。远程方法调用特性使Java编程人员能够在网络环境中分布操作。RMI全部的宗旨就是尽可能简化
    远程接口对象的使用。
大体目的就是，程序员通过公布的接口，从而通过RMI提供的一系列的规范从而找到所要使用的对象，并正确运用其中的方法进行操作，这个在网络环境中可以进行分布操作，其实，RMI相关的JDK源码就知道，整体的操作流程与网络编程有很大的关系，只不过现在已经将一系列的操作进行封装，我们只要掌握具体的流程就可以了。

下面我们假设一个情景：在一个电子商务公司中，公司的主服务器上已经部署了相关业务代码，其中包括获取商品的相关信息、用户的信息等，现在该公司成了了很多附属子公司，但是公司的leader出于安全考虑不想把主核心代码也加到子公司的服务器中，而是将相关接口提供出来，子公司的系统中假如有需要嵌入的功能，则通过接口就行了。

在模拟这个业务情景之前，我们需要清楚以下几个流程：

>1、总部需要将相关功能开发出来，并且提供相关接口，部署到服务器中；

>2、各分部根据提供的相关接口从而来进行调用，达成自己的系统需求。

首先咱们定义一个商品的模式，代码如下：

    package com.test.rmi.entity;

    import java.io.Serializable;

    public class Goods implements Serializable {
	private static final long serialVersionUID = 1L;

	private int gId;

	public int getgId() {
		return gId;
	}

	public void setgId(int gId) {
		this.gId = gId;
	}

	public String getgName() {
		return gName;
	}

	public void setgName(String gName) {
		this.gName = gName;
	}

	private String gName;
    }
以上代码一定要实现序列换，因为在网络环境下，会涉及到字节码的相关传输。

下面咱们来实现针对于商品的业务逻辑操作，首先我们公布我们的接口：

    package com.test.rmi.service;

    import java.rmi.Remote;
    import java.rmi.RemoteException;
    import java.util.List;

    import com.test.rmi.entity.Goods;

    public interface GoodsService extends Remote {
	public List<Goods> getList() throws RemoteException;
    }

根据RMI的相关规范，以上代码一定要继承Remote。

对这个接口进行实现：

    package com.test.rmi.service.imple;

    import java.rmi.RemoteException;
    import java.rmi.server.UnicastRemoteObject;
    import java.util.ArrayList;
    import java.util.List;
    import com.test.rmi.entity.Goods;
    import com.test.rmi.service.GoodsService;

    public class GoodsServiceImple extends UnicastRemoteObject implements
		GoodsService {

	private static final long serialVersionUID = 1L;

	public GoodsServiceImple() throws RemoteException {
		super();
	}

	@Override
	public List<Goods> getList() {
		List<Goods> list = new ArrayList<Goods>();
		
		Goods goods = new Goods();
		goods.setgId(101);
		goods.setgName("Nike shoe");
		list.add(goods);
		
		Goods goods2 = new Goods();
		goods2.setgId(102);
		goods2.setgName("Adidas shoe");
		list.add(goods2);
		
		return list;
	}
    }

上面一系列的业务逻辑代码都存在了，那么我们如何在网络环境中公布我们的接口，从而子公司能够去调用相关实现呢？看如下代码：

    package com.test.rmi.server;

    import java.net.MalformedURLException;
    import java.rmi.AlreadyBoundException;
    import java.rmi.Naming;
    import java.rmi.RemoteException;
    import java.rmi.registry.LocateRegistry;

    import com.test.rmi.service.GoodsService;
    import com.test.rmi.service.imple.GoodsServiceImple;

    public class ServerDetachObject {

	public static void main(String[] args) throws RemoteException, 
    MalformedURLException, AlreadyBoundException {
		GoodsService gs = new GoodsServiceImple();
		LocateRegistry.createRegistry(7709);
		Naming.rebind("rmi://127.0.0.1:7709/GoodsService", gs);
		System.out.println("Let's start the server......");
		
	}
    }
上面代码注册了一个网络环境中的端口，假如没有注册，则默认为：1099，同时根据地址，使用Naming类进行业务的与地址的绑定。

总部已经将任务完成了，下面子公司的人员需要将其中的功能嵌入到自己的系统中，代码如下：

    package com.test.rmi.client;

    import java.net.MalformedURLException;
    import java.rmi.Naming;
    import java.rmi.NotBoundException;
    import java.rmi.RemoteException;
    import java.util.List;

    import com.test.rmi.entity.Goods;
    import com.test.rmi.service.GoodsService;

    public class Client {

	public static void main(String[] args) throws MalformedURLException, 
    RemoteException, NotBoundException {
        GoodsService gs = (GoodsService)Naming.lookup("rmi://127.0.0.1:7709/
        GoodsService");
        List<Goods> list = gs.getList();
        for(Goods g:list){
        	System.out.println("Good's id is:"+g.getgId()+" goods's name 
            is:"+g.getgName()+"");
        }
	}
    }
我们在代码中需要通过相关地址才能获得我们想要的内容，并且进行一系列的业务操作。

咱们来运行一下，首先我们运行`ServerDetachObject`类，开启公司提供的服务：

运行结果如下：

    Let's start the server......

咱们再来运行客户端类`Client`，运行结果如下：

    Good's id is:101 goods's name is:Nike shoe
    Good's id is:102 goods's name is:Adidas shoe
到此，一个简单的有关于RMI操作的业务流程就结束了，当然，难度不止这些，在实际环境中可能还涉及到很多问题需要解决，而且我们可以去看一下源代码人家是怎么通过网络来实现这个流程的，还可以通过查看一些成熟框架中对RMI的引用来进行提升。

ps：我记得我之前做一个Android的小项目涉及到与服务器的通信，web端使用的是java，当时是使用scoket数据传输然后转化成json数据并通过listview进行呈现，不知道RMI是否可以代替？感觉上理论可行，改天有时间试试。

(完)

###参考资料

1、[Java RMI---维基百科](http://zh.wikipedia.org/wiki/Java_RMI)

2、[java远程方法调用]()

   








 









    







    


    




    



    
























    



    