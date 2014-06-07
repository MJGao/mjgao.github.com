---
layout: post
title: "设计模式的那点事-结构型"
description: "java 设计模式 软件工程思想"
category: 软件思想
tags: [软件思想]
---

博客又断了一下，昨天谢师宴结束了，说起来挺伤感的，反正是喝高了，总觉得大学是一转眼就过了，没个几天我也准备进入工作的大军了，也将自己要整理的东西都写成博客，好让自己能够日后复习，并且在工作中遇到以前理解错的问题能够做到查漏补缺。这段时间，就把设计模式系列的东西稍微模拟一下，也加深一下自己的理解。下面咱们就介绍一下有关结构型的几个设计模式。

结构型的设计包括哪几个，这里我就不赘述了，忘记的可以参看前面的博文。

###Adapter(适配器)

其实说起适配器设计模式，我们知道在日志框架log4j就存在，而且在Android开发listview内部也用了此模式，所以不懂这个模式的在那些方面会无法理解。我在网上查了一下资料，貌似在设计模式中Adapter设计模式分为了三个方面，其中包括类的适配器模式、对象的适配器模式、接口的适配器模式。所以咱也从这三个方面来说，看下面几个代码示例。

####1、类的适配器模式

我们来设想一个情景，例如世界工厂需要设计一辆飞机，飞机需要制造机翼、轮子等基础设备，而工厂可能各个设备需要各个车间去完成，先定义一个能够生产轮胎的代码：

    package com.test.designpattern.structure.adapter;

    public class ProduceAir {
	public void produceFlat(){
		System.out.println("The flat has finnished!");
	}
    }

以上制造轮胎的工厂可能属于日本，那么我们需要一对机翼，工厂内部也存在着各个制造工序，只是以上轮子的制造方法交给日本罢了。

    package com.test.designpattern.structure.adapter;

    public interface ProducePlane {
	public void produceFlat();
	public void produceButterfly();
    }

下面是工厂对飞机制造的实现方法：

    package com.test.designpattern.structure.adapter;

    public class Adapter extends ProduceAir implements ProducePlane {

	@Override
	public void produceButterfly() {
		System.out.println("The butterfly has done!");
	}
    }

下面我们测试一下：

    package com.test.designpattern.structure.adapter;

    public class AdapterTest {

	public static void main(String[] args) {
		Adapter adt = new Adapter();
		adt.produceFlat();
		adt.produceButterfly();
	}
    }

我们看以下运行结果：

    The flat has finnished!
    The butterfly has done!

小总结：其实类的适配器模式就是我们通过继承和接口实现的方法，将一个类中的方法转换成一个接口中的方法，从而达成各个类的适配。

####2、对象的适配器模式

在类的适配器中我们使用的implements和extends方法，下面咱们改一下策略，我们将制造轮胎的日本公司进行封装，看如下代码：

    package com.test.designpattern.structure.adapter;

    public class ObjectAdapter implements ProducePlane {
	ProduceAir pa;
	public ObjectAdapter(ProduceAir pa) {
		super();
		this.pa = pa;
	}

	@Override
	public void produceFlat() {
		pa.produceFlat();
	}

	@Override
	public void produceButterfly() {
		System.out.println("The butterfly has done!");
	}
    }

其实，上面有一个问题，比如我们封装的是一个具体的类，但是我们在后期可以将其换为接口类型，这样可以在用到其他国家的工厂的时候可以自行调用。

####3、接口的适配器模式

下面我们给一个类提供制造交通工具设备的各种方法：

    package com.test.designpattern.structure.adapter;

    public interface ProduceTraffic {
	public void produceFlat();
	public void produceButterfly();
    }

但是我们有一个情况是，我们并不是所有交通工具中都会有生产机翼的方法，比如自行车，我们需要实现特定的方法，看下一段代码：

    package com.test.designpattern.structure.adapter;

    public abstract class WrapperProduceMethod implements ProduceTraffic{

	@Override
	public void produceFlat() {
	}

	@Override
	public void produceButterfly() {
	}
    }

下面是自行车的类内容：

    package com.test.designpattern.structure.adapter;

    public class BikeProduce extends WrapperProduceMethod {

	@Override
	public void produceFlat() {
		System.out.println("the flat is done");
	}
    }

下面是飞机的内容：

    package com.test.designpattern.structure.adapter;

    public class PlaneProduce extends WrapperProduceMethod {
	
	@Override
	public void produceButterfly() {
		System.out.println("produce a butterfly");
	}
    }

至此我们的几个适配器的方式都已经完成。代码都比较简单，但是去理解还是要下一点功夫，毕竟这些东西特别抽象，想更深入地去研究这些东西还是可以去网上看相关文章的解析。

###Decorator(装饰者)

咱们还是以制造一架飞机为例，其中涉及到轮胎的制造、机翼的制造等方法，当工厂有一个需求的时候，比如用户提出了一个与原始需求不一样的需求，就是想在机身上喷上自己的名字，更简单的方式就是我们组建一个专门工作小组以后可以专门满足用户的需求，所以自然而然我们希望以后能够动态组建一个制造飞机的各个工作流程，所以我们看如下类：

首先，我们定义一个生产接口，代码如下：

    package com.test.designpattern.structure.decorator;

    public interface Produce {
	public void produce();
    }

实现轮胎的制造方法：

    package com.test.designpattern.structure.decorator;

    public class ProduceFlatInter implements Produce {

	@Override
	public void produce() {
		System.out.println("produce a flat");
	}
    }

实现机翼的制造方法：

    package com.test.designpattern.structure.decorator;

    public class ProduceButterInter implements Produce {

	@Override
	public void produce() {
		System.out.println("produce a butterfly");
	}
    }

定义一个装饰器，进行对方法封装，代码如下：

    package com.test.designpattern.structure.decorator;

    public class ProducPlaneDecorator implements Produce {
	
	public Produce tp;

	public ProducPlaneDecorator(Produce tp) {
		super();
		this.tp = tp;
	}
	
	@Override
	public void produce() {
		System.out.println("---start producing---");
        tp.produce();
        System.out.println("---done---");
	}
    }

咱们来测试一下：

    package com.test.designpattern.structure.decorator;

    public class DecoratorTest {

	public static void main(String[] args) {
		Produce fp = new ProduceFlatInter();
		ProducPlaneDecorator ppd = new ProducPlaneDecorator(fp);
		ppd.produce();
		
		Produce fp2 = new ProduceButterInter();
		ProducPlaneDecorator ppd2 = new ProducPlaneDecorator(fp2);
		ppd2.produce();
	}
    }
控制台输出如下信息：

     ---start producing---
        produce a flat
     ---done---
     ---start producing---
        produce a butterfly
     ---done---

###Proxy(代理模式)

代理模式是我认为所有模式中很好理解的之一，比如你想去买一款电脑，但是你对电脑配置不懂，所以你喊了同学小王陪你去，然后自然就会想买到你的电脑，买电脑这件事情就委托给别人完成。我们还以世界工厂为例，代码如下：

    package com.test.designpattern.structure.proxy;

    public interface WorldFactory {
	public void produce();
    }

中国工厂的生产环境中产生了一个简单的需求，要交给别人来做：

    package com.test.designpattern.structure.proxy;

    public class ChinaFactory implements WorldFactory {

	@Override
	public void produce() {
		System.out.println("We should produce a plane called v8");
	}
    }

再定义一个美国工厂的类：

    package com.test.designpattern.structure.proxy;

    public class Americafactory implements WorldFactory {
	
	private ChinaFactory cf;
	public Americafactory() {
		super();
		this.cf = new ChinaFactory();
	}

	@Override
	public void produce() {
		System.out.println("Someone sends a order.");
		cf.produce();
		System.out.println("We have done,please pay!");
	}
    }

咱们来测试一下：

    package com.test.designpattern.structure.proxy;

    public class ProxyTest {

	public static void main(String[] args) {
		WorldFactory wf = new Americafactory();
		wf.produce();
	}
    }

中国的这个需求就交给美国了，但是美国能不能做这是一个问题，还是希望中国的创新环境更猛烈一下吧。

###Facade(外观模式)

外观模式就是将很多类的关系配置到一个文件中，从而可以统一管理，而避免在以后的调用中出现很多差错。咱们以一个小汽车的启动过程为例，驾驶者在驾车的时候肯定要开门，开锁，启动，然后驾驶，再到关引擎、关锁、关门的一系列的操作，看如下代码演示：

定义一个汽车门类：
    package com.test.designpattern.structure.facade;

    public class CarDoor {
	public void open(){
		System.out.println("open the door");
	}
	
	public void close(){
		System.out.println("close the door");
	}
    }
定义一个汽车引擎类：
    package com.test.designpattern.structure.facade;

    public class CarEngine {
	
	public void open(){
		System.out.println("open the engine");
	}
	
	public void close(){
		System.out.println("close the engine");
	}
    }

定义一个汽车锁的类：

    package com.test.designpattern.structure.facade;

    public class CarLock {

	public void open(){
		System.out.println("open the lock");
	}
	
	public void close(){
		System.out.println("close the lock");
	}
    }
咱们车类：

    package com.test.designpattern.structure.facade;

    public class Car {
	
	private CarDoor cd;
	private CarLock cl;
	private CarEngine ce;

	public Car() {
		super();
		this.cd = new CarDoor();
		this.cl = new CarLock();
		this.ce = new CarEngine();
	}

	public void open(){
		System.out.println("start driving the car------");
		cd.open();
		cl.open();
		ce.open();
		System.out.println("run,take care");
	}
	
	public void close(){
		System.out.println("start stopping the car-----");
		ce.close();
		cl.close();
		cd.close();
		System.out.println("the driver has left.");
	}
    }

咱们做一下测试：

    package com.test.designpattern.structure.facade;

    public class Driver {
	public static void main(String[] args) {
       Car car = new Car();
       car.open();
       car.close();
	}
    }

控制台运行如下结果：

    start driving the car------
    open the door
    open the lock
    open the engine
    run,take care
    start stopping the car-----
    close the engine
    close the lock
    close the door
    the driver has left.
整个车的启动过程我们就直接交给了车了，这是理所当然。而且起到解耦的作用。

###Bridge(桥接模式)

桥接模式大家应该都很熟悉，举个简单的例子，比如我们平常使用的数据库，我们肯定要考虑到它的驱动吧，而这些驱动隶属于不同的厂商，例如Mysql、Oracle等，或者包括最近的Nosql等等。所以我们如何做到只要很简单的代码方式就能够兼容各厂商的驱动，我们来举个设置驱动的例子：

    package com.test.designpattern.structure.bridge;

    public interface SqlDriver {
	public void connect();
    }

我们定义Mysql驱动的额连接方式：

    package com.test.designpattern.structure.bridge;

    public class MysqlDriver implements SqlDriver {

	@Override
	public void connect() {
		System.out.println("This is mysql driver.");
	}
    }
我们定义Oracle驱动的连接方式：

    package com.test.designpattern.structure.bridge;

    public class OracleDriver implements SqlDriver {

	@Override
	public void connect() {
		System.out.println("This is oracle driver.");
		
	}
    }

定义一个驱动管理器：

    package com.test.designpattern.structure.bridge;

    public abstract class DriverManager {

	private SqlDriver sd;
	
	public void connect(){
		sd.connect();
	}

	public SqlDriver getSd() {
		return sd;
	}

	public void setSd(SqlDriver sd) {
		this.sd = sd;
	}
    }

定义自己公司的驱动管理方法：

    package com.test.designpattern.structure.bridge;

    public class CompanyDriverManager extends DriverManager {

	@Override
	public void connect() {
		getSd().connect();
	}	
    }

下面测试一下：

    package com.test.designpattern.structure.bridge;

    public class BridgeTest {
	public static void main(String[] args) {
		DriverManager sm = new CompanyDriverManager();
		SqlDriver md = new MysqlDriver();
		sm.setSd(md);
		sm.connect();
		
		SqlDriver od = new OracleDriver();
		sm.setSd(od);
		sm.connect();
	}
    }
运行结果：

    This is mysql driver.
    This is oracle driver.

是不是与我们平常数据库的连接方式很相似，其实我们可以通过这个看到平常我们连接驱动是怎样做的，多考虑一下它的内部实现。

###Composite(组合模式)

组合模式使用整体与部分的这种逻辑关系，按照我的看法它的使用哲学在很多应用中都有体现，例如二叉树、搜索引擎，当然包括人脑的神经元，都貌似与这个思想有点关系，下面我们实现一个简单的搜索引擎，具体代码如下：

设置一个URL的树关系：

    package com.test.designpattern.structure.composite;

    import java.util.Enumeration;
    import java.util.Vector;

    public class URLNode {

	private String urlName;
	private URLNode parentURL;
	private Vector<URLNode> childrenURL = new Vector<URLNode>();
	public URLNode(String urlName) {
		this.urlName = urlName;
	}
	public String getUrlName() {
		return urlName;
	}
	public void setUrlName(String urlName) {
		this.urlName = urlName;
	}
	public URLNode getParentURL() {
		return parentURL;
	}
	public void setParentURL(URLNode parentURL) {
		this.parentURL = parentURL;
	}
	public Vector<URLNode> getChildrenURL() {
		return childrenURL;
	}
	public void setChildrenURL(Vector<URLNode> childrenURL) {
		this.childrenURL = childrenURL;
	}
	
	public boolean add(URLNode churlNode){
		childrenURL.add(churlNode);
		return true;
	}
	
	public boolean remove(URLNode churlNode){
		childrenURL.remove(churlNode);
		return true;
	}
	
	public Enumeration<URLNode> getChildren(){
		return childrenURL.elements();
	}
    }
以上代码学过数据结构的基本上都可以很容易地去理解，无非就是形成各个结点。

下面再定义一个类：

    package com.test.designpattern.structure.composite;

    public class SearchEngin {

	URLNode root = null;

	public SearchEngin(String urlName) {
		root  = new URLNode(urlName);
	}	
    }
这个类的大体意思是设置一个根结点。

写一个测试类：

    package com.test.designpattern.structure.composite;

    import java.util.Enumeration;

    public class TestSearchEngin {
	public static void main(String[] args) {
      SearchEngin se = new SearchEngin("http://www.ctbu.edu.cn");
      URLNode un1 = new URLNode("http://news.ctbu.edu.cn");
      URLNode un2 = new URLNode("http://news.ctbu.edu.cn/new1.html");
      URLNode un3 = new URLNode("http://news.ctbu.edu.cn/new2.html");
      URLNode un4 = new URLNode("http://news.ctbu.edu.cn/new2.html/XXX.html");
      
      un3.add(un4);
      un1.add(un2);
      un1.add(un3);
      se.root.add(un1);
      
      Enumeration<URLNode> urls = se.root.getChildren();
      getNextChildren(urls);
	}

	public static void getNextChildren(Enumeration<URLNode> uChildren){
		 while(uChildren.hasMoreElements()){
	    	  URLNode url = uChildren.nextElement();
	    	  System.out.println(url.getUrlName());
	    	  if(url.getChildren()!=null){
	    		  getNextChildren(url.getChildren());
	    	  }
	      }
		 
	}
    }
以上使用到了简单的递归，从而将结果遍历出来，完成树的解析。

运行结果：

    http://news.ctbu.edu.cn
    http://news.ctbu.edu.cn/new1.html
    http://news.ctbu.edu.cn/new2.html
    http://news.ctbu.edu.cn/new2.html/XXX.html
以上属于树的深度遍历法，其实在搜索引擎中并不是很适用，前几天看过一本书，叫做[这就是搜索引擎]()，是一本搜索引擎的入门书籍，讲解了认识搜索引擎所要掌握的一些算法知识点，我觉得还是相当复杂，有机会我对这个东西来做下简单地分析一下，感觉还是很有意思。

###Flyweight(享元模式)

此模式类似于我们在建立数据库表表之间的关系-----一对多的关系，应用领域例如数据库的连接池、服务器的连接池，适用这种思想，我们可以降低访问的压力，下面我们看一个连接池的例子。

定义一个简单的服务器类：

    package com.test.designpattern.structure.flyweight;

    public class Server {
	
	public int id;
	private String ip;

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
    }

定义一个服务器管理类：

    package com.test.designpattern.structure.flyweight;

    public class ServerManager {

	public static Server getConnect(String url,String username,String pwd){
		System.out.println("The server is connected!");
		 return new Server();
	}
	
	public static void disConnect(){
		System.out.println("The server is disconnected!");
	}
    }

定义一个服务器连接池：

    package com.test.designpattern.structure.flyweight;

    import java.util.Vector;

    public class ServerPool {

	private int POOL_SIZE = 20;
	private String username = "root";
	private String pwd = "123456";
	private String url = "www.ctbu.cn";
	private Vector<Server> spool;
	Server server;
	
	public ServerPool(){
		spool = new Vector<Server>(POOL_SIZE);
		
		for(int i=0;i<POOL_SIZE;i++){
			server = ServerManager.getConnect(url, username, pwd);
			server.setId(i);
			spool.add(server);
		}
		
	}
	
	public Server gerServer(String ip){
		if(POOL_SIZE>0){
			Server s = spool.get(0);
			s.setIp(ip);
			spool.remove(s);
			return s;
		}else{
			return null;
		}
	}
	
	public void disServer(){
		ServerManager.disConnect();
		 spool.add(server);
	}
	
	public int getSize(){
		return spool.size();
	}
    }
以上的代码我就没必要讲解了，无非就是通过连接池来进行调用，下面我们来做下简单的测试：

    package com.test.designpattern.structure.flyweight;

    public class ServerTest {
	public static void main(String[] args) {
		ServerPool spool = new ServerPool();
		String ip = "12,12,11,11";
		Server s = spool.gerServer(ip);
		System.out.println("The ip is:"+s.getIp());
		System.out.println("The temp serverpool's num is:"+spool.getSize());
		spool.disServer();
		System.out.println("The temp serverpool's num is:"+spool.getSize());
	}
    }

运行结果如下：

    The server is connected!
    The ip is:12,12,11,11
    The temp serverpool's num is:19
    The server is disconnected!
    The temp serverpool's num is:20

可以看到在服务器连接池中开了20个，这样关掉一个就会在连接池中加一个，是不是很形象？这里说一下，其实服务器开发也是一个相当复杂的东西，需要掌握很多东西，包括如何做高并发、如何控制session等的管理，以及如何解析你所写的web等应用程序，这些都是不是轻而易举可以去完成的。

这一段算是写完了，但是并没有很深入地去研究设计模式的应用领域，只是简单地将其模拟出来，这东西对于语言没有限制，C++、js等都可以去实现，设计模式也相当抽象，但我觉得还是不能去滥用，只有在实际中应用才真正算是好东西。

(完)

###参考资料

1、[豆瓣所列设计模式的书籍](http://www.douban.com/search?source=suggest&q=%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F)

2、[《设计模式--可复用面向对象软件的基础》](http://book.douban.com/subject/1052241/)

3、[Java之美之设计模式](http://blog.csdn.net/zhangerqing/article/details/8194653)




 









    







    


    




    



    
























    



    