---
layout: post
title: "关于IOC---简单模拟Spring中的IOC"
description: "java 动态代理 IOC"
category: java
tags: [java]
---

很早就想摸清Spring中的IOC是如何工作的，这段时间在家又重新复习了一下相关的知识，阅读了一些书籍资料，顿时感到在Spring的世界中，运行机制和设计思想简直是太强大了，不花个一定的时间，想摸清楚Spring中的门道简直是不可能的。上次简单了模拟了一下Spring中的AOP，今天把Spring中的IOC的bean加载也模拟了一番，总而言之，确实有新的收获。

最近空闲，有了一些新的思考：在Java的层面上，如果我们站在架构的基础之上，确实会感到Java给我们的一些强大的特性；但是在语言层次方面，我某些时候会觉得反而不如一些弱类型的语言好用，而且用起来也不是那么轻松，毕竟Java中的东西实在是冗杂，而且需要弄懂很多衍生的框架知识。

直接进入正文。

关于IOC，我想学习Java或者使用过Spring的基本上都知道，其翻译下来叫做控制反转；其实，还有一个词，叫做DI，解释下来叫依赖注入，当然，我是喜欢后面这个词，它的发展也有一些故事，这里我就不细说了，感兴趣的可以去看看。

我们刚开始使用Spring的时候，总是喜欢通过一个XML文件，然后将相关的类配置、AOP配置等等都放在里面，然后由IOC容器进行加载。比如如下的一段配置文件：

    <?xml version="1.0" encoding="UTF-8"?>
    <beans>
	  <bean id="userDaoImple" class="com.test.myspring.dao.imple.UserDaoImple">
	  </bean>
	  <bean id="userService" class="com.test.myspring.service.UserService">
		<property name="userDaoImple" ref="userDaoImple">
	    </property>
	  </bean>
    </beans>
我们基本上都知道上述的配置含义，无非就是UserSerVice类引用了UserDaoImpleme。

配置完之后我们会定义相关的类，然后通过`BeanFactory`或者`ApplicationContext`进行对此文件加载，并且将bean信息注册到容器中，当然，这里按照我的猜想应该会将相关的信息放到缓存之中去，然后使用`getBean()`方法获得所要使用的bean。

按照我的简单思考，整体的加载流程就是这样。对于更深层次的加载注册机制，查阅官方文档你会看到有一个叫BeanDefinition的东西，同时会告诉你手动编码registry相关bean的方式。感兴趣的可以去看官方文档或者看王福强的这本书[《Spring揭秘》]()又或者直接去看源码就行了。

我这里并不准备对Spring中的源码进行分析，按照我个人的理解：

    看人家的源码，其实就是借鉴人家的设计思想，从而对自己以前的设计方法有相关的改进，又或者对
    于以前一些你不太清楚的实现机制，通过查看别人的实现，从而达到醍醐灌顶的效果。

下面，我们来实现一下Spring中的IOC。

####1、定义一个BeanFactory

里面会有`getBean()`方法，同时有用于加载xml文件的相关方法。具体代码如下：

#####定义一个加载xml文件的方法

    public void parseXML(String path) throws DocumentException {
		SAXReader read = new SAXReader();
		Document doc = (Document) read.read(new File(path));
		Element root = doc.getRootElement();
		// System.out.println(root);
		parseEle(root);
	}

#####定义DOM节点的解析方法：

     public void parseEle(Element ele) {
		parseAttr(ele);
		for (Iterator<Element> i = ele.elementIterator(); i.hasNext();) {
			Element element = (Element) i.next();
			if (!element.isTextOnly()) {
				parseEle(element);
			} else {
				parseAttr(element);
			}
		}
	 }

#####定义相关属性的解析方法：

    public void parseAttr(Element ele) {
		String key = null;
		String val = null;
		for (Iterator<Element> i = ele.attributeIterator(); i.hasNext();) {
			Attribute attr = (Attribute) i.next();
			if (ele.getQName().getName().equals("bean")) {
				if (attr.getQName().getName().equals("id")) {
					key = attr.getText();
				} else if (attr.getQName().getName().equals("class")) {
					val = attr.getText();
				}
				map.put(key, val);
			} else if (ele.getQName().getName().equals("property")) {
				if (attr.getQName().getName().equals("ref")) {
					key = ele.getParent().attribute("id").getText() + ".ref";
					val = attr.getText();
					map.put(key, val);
				}
			}
		}
	}

以上的代码，通过dom4j对xml文件进行解析，同时，我们通过对xml文件相关节点属性的类别，通过map进行封装。定义一个全局Map：

    public static Map<String, String> map = new HashMap<String, String>();

#####通过以上的相关XML文件的加载机制，定义一个getBean方法：

    public Object getBean(String name) throws InstantiationException,
			IllegalAccessException, SecurityException, NoSuchMethodException,
			IllegalArgumentException, InvocationTargetException {
		Object bean = null;
		String className = map.get(name);
		if (className.equals("")) {
			System.out.println("The bean is not existed!");
		} else {
			try {
				Class<?> clazz = Class.forName(className);
				bean = clazz.newInstance();
				if (map.get(name + ".ref") != null) {
					String refClass = map.get(name + ".ref");
					String coM = refClass.substring(0, 1).toUpperCase()
							+ refClass.substring(1, refClass.length());
					Object refBean = Class.forName(map.get(refClass))
							.newInstance();
					Method m = bean.getClass().getMethod("set" + coM,
							refBean.getClass().getInterfaces());
					m.invoke(bean, refBean);
				}
			} catch (ClassNotFoundException e) {
				e.printStackTrace();
			}
		}
		return bean;
	}
这里需要通过Java中的反射机制获得相关方法并且运行，我这里直接模拟的是通过set方法注入的方式，假如对通过构造方法注入的方式感兴趣的话也可以去模拟一下，大体原理相仿。

#####将构造器方法定义一下

    public BeanFactory() {
	}

	public BeanFactory(String path) {
		try {
			parseXML(path);
		} catch (DocumentException e) {
			e.printStackTrace();
		}
	}

####2、根据xml中的配置信息，进行定义

#####定义一个UserDao

    package com.test.myspring.dao;

    public interface UserDao {
	    public void save();
	    public void update();
    }

#####定义一个UserDaoImple

     package com.test.myspring.dao.imple;

     import com.test.myspring.dao.UserDao;

     public class UserDaoImple implements UserDao {

	   @Override
	   public void save() {
		System.out.println("saved");
	   }

	   @Override
	   public void update() {
		System.out.println("updated..");
	   }
     }

#####定义UserService

     package com.test.myspring.service;

     import com.test.myspring.dao.UserDao;

     public class UserService {

	   UserDao userDaoImple;

	   public void setUserDaoImple(UserDao userDaoImple) {
		this.userDaoImple = userDaoImple;
	   }
	
	   public void save(){
		userDaoImple.save();
	   }
	
	   public void update(){
		userDaoImple.update();
	   }
     }

####下面进行测试一下

     package com.test.myspring.test;

     import java.lang.reflect.InvocationTargetException;
     import com.test.myspring.BeanFactory;
     import com.test.myspring.service.UserService;

     public class Test {
	  public static void main(String[] args) throws SecurityException, 
      IllegalArgumentException, InstantiationException, IllegalAccessException, 
      NoSuchMethodException, InvocationTargetException {
		BeanFactory beans = new BeanFactory("E:\\beans.xml");
		UserService us = (UserService)beans.getBean("userService");
		us.save();
        us.update();
	 } 
     }
控制台打印出如下信息：

     saved
     updated.

这样，一个简单的IOC容器就实现了。

当然，我们还有很多后续工作要做，并且我上述代码并不是那么智能化，还暴露出许多问题，具体如下：

>1、我上面将bean定义的相关信息都放在HashMap中，其实那种方式是错误的，而且不安全，损耗性能，我记得之前查看过JDK中properties中关于load的机制，它使用的是HashTable进行存储。而对于原始Spring中使用的是哪种，又或者它是使用什么样的方式进行加载的，这个还是要深究一下；

>2、我们知道在Spring中对bean进行配置，一个bean的引用可能会涉及到很多的bean，而我的实现只涉及到一个，这里我只是简单模拟一下，等有空来补充一下。当然针对于各种方式的注入也是缺少的；

>3、针对于所使用文件类型的配置，在官方文档中我看到其实properties也可以，还可以通过手动进行编码将bean注册到容器中。

后续解决的就是上面三个问题，当然代码的编写等等还是存在着各种不完善的方式。

后记：我这里使用了最简单的方式来模拟IOC的相关内容，想想，将Spring中的所有特性都开发出来，确实需要强大的功底，也特别佩服Spring团队。

(完)

####参考资料

1、[《Spring揭秘》]()

2、[Spring官方文档]()

3、[维基百科--关于IOC]()










`

   








 









    







    


    




    



    
























    



    