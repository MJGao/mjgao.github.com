---
layout: post
title: "设计模式的那点事-创建型"
description: "java 设计模式 软件工程思想"
category: 软件思想
tags: [软件思想]
---

设计模式应该算是老早看过的一个内容了，前几天听到朋友说他这几天正在看这方面的内容，说实话，我觉得像类似于这种高屋建瓴的东西带点思想性的东西还是放在自己基础很扎实的基础上去学习，而且我个人觉得还需要一定的项目积累，否则只是学到了一系列的空理论，实际中还是会忘记。离开学校的时间越来越近了，所以决定乘着这几天空闲，就写个设计模式的系列，当然很多都是在别人已有的经验基础上，自己来进行改造一下，毕竟还是不能光死看书。

其实涉及设计模式的书籍确实也有不少，[《设计模式--可复用面向对象软件的基础》](http://book.douban.com/subject/1052241/)、[Head First 设计模式](http://book.douban.com/subject/2243615/)、[深入浅出设计模式](http://book.douban.com/subject/1488876/)，我看过的只有第一本，用c++来实现的，想看的可以自己去选择。

关于设计模式其实也有一定的历史发展，并且至今已经发展了20多种涉及模式，并且有其具体的分类。对于设计模式中的若干的理论知识我就不说了，毕竟那些都属于软件工程思想上面的，与本文关系不是那么大。

###设计模式分类

>####创建型

>>Factory Method(工厂)、Abstract Factory(抽象工厂)、Builder(创建者)、Prototype(原型)、Singleton(单例)

>####结构性

>>Adapter(适配器)、Bridge(桥接)、Compsite(组合)、Decorator(装饰器)、Facade(外观)、Flyweight(享元)、Proxy(代理)

>####行为型

>>Chain of Responsibi(责任链)、Command(命令)、Iterator(迭代)、Mediator(中间者)、Memento(备忘录)、Observer(观察者)、State(状态)、Strategy(策略)、Visitor(访问者)、Interpreter(解释器)、Template Method(模板方法)

理论的知识我就先讲这么多，假如想补充的的可以去找相关书籍和资料。这篇文章将主要介绍创建型的设计模式。

###创建型设计模式

从字面意思我们就能够了解这个是与相关的类的创建有关的一系列的设计模式的合称。其中包括：Factory Method(工厂)、Abstract Factory(抽象工厂)、Builder(创建者)、Prototype(原型)、Singleton(单例)这几种，下面一一来介绍。

我们先来看一个展示这些模式之间关系的图：**(来自于网络)**

<img src="/assets/images/pattern.jpg" />

###Factory

介绍这个模式之前，咱们先来设计一个场景：假如某一天人类的交通工具都在一个固定的工厂进行加工，有加工自行车的，有加工小汽车的，我们应该怎么来进行分配车间以及指责？好吧，让我们用代码来模拟一遍。

####第一种实现

首先咱们定义一个接口Producer，代码如下：

    package com.test.designpattern.creation.factory;
    public class ProduceCar implements Producer {
	@Override
	public void produce() {
		System.out.println("Produce car");
	}
    }

下面定义一个专门生产小汽车的车间，代码如下：

    package com.test.designpattern.creation.factory;
    public class ProduceCar implements Producer {
	@Override
	public void produce(){
		System.out.println("Produce car");
	}
    }

再定义一个专门生产自行车的车间，代码如下：

    package com.test.designpattern.creation.factory;
    public class ProduceBike implements Producer {
	@Override
	public void produce(){
		System.out.println("Produce bike");
	}
    }

下面定义一个工厂接口，以上定义的车间都在里面，代码如下：

    package com.test.designpattern.creation.factory;
    public interface Factory {
	public void produce(String fType);//每个工厂都有生产方法
    }

下面定义一个交通工具的实现类，代码如下：

    package com.test.designpattern.creation.factory;
    public class ProduceFactory {
	public Producer produce(String fType) {
		if(fType == "car"){
			return new ProduceCar();
		}else if(fType == "bike"){
			return new ProduceBike();
		}else {
			System.out.println("The type is wrong");
			return null;
		}
	}
    }

咱们来测试一下：

    package com.test.designpattern.creation.factory;
    public class ProduceFactoryTest {
	public static void main(String[] args) {
		//test the one factory
		ProduceFactory pf = new ProduceFactory();
		Producer car = pf.produce("car");
		car.produce();
	}	
    }
我们发现输出如下结果：`Produce car`。

以上代码虽然完成了，但是我们发现几个问题，比如现在我们要添加一个生产飞机的车间，则我们需要工厂中的相关方法，第二，我们利用的是通过关键字来进行判断，这并不是一个很好的方式，当判断不出来时候就会出错，从而在后期才知道，哦，原来没有此类车间，在花时间去建。所以，我们来看第二种实现方式。

####第二种实现

我们摒弃这种通过关键字类判断的方式，在测试的时候多了一个繁琐的环节，现在我们重现定义一个类，叫做多个车间类代码如下：

    package com.test.designpattern.creation.factory;
    public class MultiProducerFactory {
	public Producer produceBike(){
		return new ProduceBike();
	}
	public Producer produceCar(){
		return new ProduceCar();
	}
    }

下面咱们来测试一下，代码如下：

    package com.test.designpattern.creation.factory;
    public class ProduceFactoryTest {
	public static void main(String[] args) {
		//test multi factory
		MultiProducerFactory multiPf = new MultiProducerFactory();
		Producer bike = multiPf.produceBike();
		bike.produce();
	}
    }

我们发现输出如下结果：`Produce bike`。

比以上少去了类型判断，但是还是会出现上述第一种情况，我们待会解决。

####第三种实现

在上述的情况中，我们假如想要获得一个车间，不要要new一个工厂的实现，从而这回增加内存的开销，我们改一下：

    package com.test.designpattern.creation.factory;
    public class StaticProduceFactory {
	public static Producer produceBike(){
		return new ProduceBike();
	}	
	public static Producer produceCar(){
		return new ProduceCar();
	}
    }

下面咱们来测试一下：

    package com.test.designpattern.creation.factory;
    public class ProduceFactoryTest {
	public static void main(String[] args) {
		//test static factory
		Producer pbike = StaticProduceFactory.produceCar();
		pbike.produce();
	}	
    }

我们发现输出如下结果：`Produce bike`。

####第四种实现

随着世界经济一体化的流程加快，假如未来有一天所有公司都在一个很大的工厂里面，可以在这个工厂里创建自己的工厂。例如硅谷、中关村等。下面我们定义一个接口，代码如下：

    package com.test.designpattern.creation.factory;
    public interface ProviderFactory {
	public Producer produce();
    }

下面定义一个专门生产自行车的工厂，代码如下：

    package com.test.designpattern.creation.factory;
    public class BikeFactory implements ProviderFactory {
	@Override
	public Producer produce() {
		return new ProduceBike();
	}
    }

再定义一个专门生产小汽车的工厂，代码如下：

    package com.test.designpattern.creation.factory;
    public class CarFactory implements ProviderFactory {
	@Override
	public Producer produce() {	
		return new ProduceCar();
	}
    }

咱们来测试一下：

    package com.test.designpattern.creation.factory;
    public class ProduceFactoryTest {
	public static void main(String[] args) {
		//test abstract factory
		ProviderFactory pfs = new BikeFactory();
		Producer probike = pfs.produce();
		probike.produce();
	}	
    }

我们发现输出如下结果：`Produce bike`。

这个模式称为`抽象工厂模式`。其实就是我们站在一个更大的角度上来想问题，所有的对象有一个更大的对象来进行不断生产。这个好处就是假如我们想要一个小工厂，就直接在外面建就行了，而不要去改动原本装好的代码。这让我想起了`大象无形`这个具有哲学意义的成语，不过还是要把最基础的铺垫好，才能使自己看得很远。

###Builder

其实创建者模式就是将对以上的一系列的小车间进行专门的复制，而省去我们手动来实现，也许，比如现在的3D打印机，貌似与这个有相通之处。

我们创建一个小车间来生产car：

    package com.test.designpattern.creation.builder;
    public class CarProduce implements Producer {
	@Override
	public void produce() {
		System.out.println("Produce car");
	}
    }

再创建一个小车间生产bike:

    package com.test.designpattern.creation.builder;
    public class BikeProduce implements Producer {
	@Override
	public void produce() {
		System.out.println("Produce bike");
	}
    }

创建一个Builder类：

    package com.test.designpattern.creation.builder;

    import java.util.ArrayList;
    import java.util.List;

    public class Builder {
	List<Producer> list = new ArrayList<Producer>();
	public void produceCar(int cnt){
		for(int i=0;i<cnt;i++){
			list.add(new CarProduce());
			System.out.println("Produce the car's id is:"+i);
		}
	}
	
	public void produceBike(int cnt){
		for(int i =0;i<cnt;i++){
			list.add(new BikeProduce());
			System.out.println("Produce the bike's id is:"+i);
		}
	}
    }

咱们来测试一下：

    package com.test.designpattern.creation.builder;
    public class BuilderTest {
	public static void main(String[] args) {
      Builder b = new Builder();
      b.produceBike(5);
	}
    }

我们会发现输出如下结果：

    Produce the bike's id is:0
    Produce the bike's id is:1
    Produce the bike's id is:2
    Produce the bike's id is:3
    Produce the bike's id is:4

###Singleton

单例模式是一个老生常谈的话题，并且网上也有若干文章来对其进行讲解，我觉得我再多说我就太浪费时间了，这里我们看一下具体的代码实现：

####第一种实现

    package com.test.designpattern.creation.single;
    public class Singleton {
	public static Singleton instance = new Singleton();
   
	private Singleton() {
      //私有，免于外部实例化
	}

	public static Singleton getInstance() {
		if (null == instance) {
			instance = new Singleton();
		}
		return instance;
	}
    }

####第二种实现

    package com.test.designpattern.creation.single;
    public class Singleton {
	public static Singleton instance = new Singleton();
   
	private Singleton() {
      //私有，免于外部实例化
	}

	public static synchronized Singleton getSaveInstance() {
		if (null == instance) {
			instance = new Singleton();
		}
		return instance;
	}
    }

这种实现方式是针对于上面一种实现出现线程不安全而采用的一种同步方式，不过我们每次都需要锁住当前对象，这个无疑会有性能的花销，再来看第三种实现：

####第三种实现

    package com.test.designpattern.creation.single;
    public class Singleton {
	public static Singleton instance = new Singleton();
   
	private Singleton() {
      //私有，免于外部实例化
	}

	public static Singleton getAnInstance() {
		if (null == instance) {
			synchronized (instance) {
				if (null == instance) {
					instance = new Singleton();
				}
			}
		}
		return instance;
	}
    }

其实这种方式还是会出现问题，这里我就不进行分析了，毕竟这篇文章只是简单罗列一系列的设计模式，而对于内部细节我觉得等有时间花时间来说明。

单例模式更完美的做法其实还有几种，但是现实中本没有完全完美的东西，有的只是相对的，而且是根据业务的需要逐步完善的。

###Prototype

原型模式无非就是对现有类进行一个相关的复制，从而使用被复制对象中的方法、属性等内容。我们看一个简单的实现：

    package com.test.designpattern.creation.prototype;
 
    import java.io.IOException;

    public class Prototype implements Cloneable {
	
	@Override
	protected Object clone() throws CloneNotSupportedException {
		return (Prototype)super.clone();
	}
    }

这里的实现是利用clone()方法，所实现的接口中的此方法是空的，所以我们可以根据自己的需求来进行相关重新复写。此类实现方法还会涉及到`深复制`、`浅复制`的概念，感兴趣的可以看我下一篇文章对这两个概念的分析。

底下，还需要将另外两种类型的设计模式进行分析。

写博客确实是一件很累的事情，但是在写的过程中却可以对自己进行查漏补缺，对于自己还不完善的不理解的东西就会去查阅资料，从而更好正视自己有没有学通了。

(完)

###参考资料

1、[豆瓣所列设计模式的书籍](http://www.douban.com/search?source=suggest&q=%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F)

2、[《设计模式--可复用面向对象软件的基础》](http://book.douban.com/subject/1052241/)

3、[Java之美之设计模式](http://blog.csdn.net/zhangerqing/article/details/8194653)



    


    




    



    
























    



    