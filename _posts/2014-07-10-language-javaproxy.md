---
layout: post
title: "java中的动态代理"
description: "java 动态代理"
category: java
tags: [java]
---

有一段时间没有写东西了，感觉很多东西都变得有点生疏起来。上次去上海参加笔试，发现也有很多基础性的东西忘记了，所以这周回老家看一下，顺便调节一下情绪，顺便补充一下额外知识。

记得上半个月在苏州面试的时候，hr问起我关于动态代理的相关知识，以前确实看过这方面的内容，但是因为一直在项目中没有去进行使用，所以自然而然就开始生疏起来，今天乘着空闲，就将复习动态的代理的知识记录一下，因为这是个重要的知识点，并且在很多成熟的框架中都已经应用，并且针对于动态代理还出了cglib框架，所以，搞懂这个知识确实有必要。

说起动态代理，你肯定要问我，是不是还有静态代理？当然有。

记得在学习设计模式的时候，我们就知道代理模式，属于创建型。我们在回忆一下当时的代理的设计思想。看下面这个栗子。

    咱们假设一个场景：如今全国要做人口普查，有人数增多需要添加，人数发生变更，需要进行更新。
场景很简单，下面我们用程序来模拟出来。

定义一个用于人数操作的接口：`PersonDao`

    package com.test.aop;

    public interface PersonDao {
	public void add();//添加
	public void update();//更新
    }

实现这个接口：`PersonDaoImpleme`

    package com.test.aop;

    public class PersonDaoImple implements PersonDao {

	@Override
	public void add() {
		System.out.println("add a person!");
	}
	@Override
	public void update() {
		System.out.println("update a person!");
	}
    }

咱们定义一个代理类：`PersonProxy`

    package com.test.aop;

    public class PersonProxy implements PersonDao {

	private PersonDao pd;

	public PersonProxy(Object pd) {
		this.pd = (PersonDaoImple) pd;
	}

	@Override
	public void add() {
		System.out.println("start adding trans-----");
		pd.add();
		System.out.println("end adding trans-----");
	}

	@Override
	public void update() {
		System.out.println("start updating trans-----");
		pd.update();
		System.out.println("end updating trans-------");

	}

    }

测试一下：
 
    package com.test.aop;

    public class ProxyTest {

	public static void main(String[] args) {
		PersonDao pd = new PersonDaoImple();
		PersonProxy pp = new PersonProxy(pd);
		pp.add();
	}
    }

结果如下：

    start adding trans-----
    add a person!
    end adding trans-----

以上就是我们之前知道的静态代理，那么什么事动态代理呢？

其实，动态代理就是程序在运行期间指定接口列表。在原始JDK中就已经提供了一些用于动态代理的几个工具类：`Proxy`、`InvocationHandler`。

我们先来看一个关于动态代理的相关用栗子。

定义一个用于动态代理的程序：`HandleProxy`

    package com.test.aop;

    import java.lang.reflect.InvocationHandler;
    import java.lang.reflect.Method;
    import java.lang.reflect.Proxy;

    public class HandleProxy implements InvocationHandler {
	
	public Object target;
	
	public Object bind(Object target){
		this.target = target;
		return Proxy.newProxyInstance(target.getClass().getClassLoader(), 
        target.getClass().getInterfaces(), this);
	}

	@Override
	public Object invoke(Object proxy, Method method, Object[] args)
			throws Throwable {
		Object intVal = null;
		System.out.println("begin trans------");
		intVal = method.invoke(target, args);
		System.out.println("end trans------");
		System.out.println("The call method is:"+method.getName());
		return intVal;
	}
    }
咱们来测试一下：

    package com.test.aop;

    public class ProxyHandleT {
	
	public static void main(String[] args) {
		HandleProxy hp = new HandleProxy();
		PersonDao pd = (PersonDao) hp.bind(new PersonDaoImple());
	    pd.add();
	}	
    }
控制台打印如下信息：

    begin trans------
    add a person!
    end trans------
    The call method is:add
####ok，下面我们来看一下其中的几个重要的知识点。####

>1、Proxy.newProxyInstance(Foo.class.getClassLoader(), new Class[] { Foo.class },handler);
通过提供相关的接口和加载器，用于创建动态代理类和实例的静态方法

>2、public Object invoke(Object proxy, Method method, Object[] args)
通过实现InvocationHandler接口，从而调用应用程序，识别要代理的类的方法等参数。

其实，还有一些方法，这里我就不一一列举，感兴趣的可以直接去看官方文档就行了。

####小深入####

在实验的过程之中，我不禁想起，它这个API是如何实现的呢？为什么我们实例化之后，在调用PersonDao里的方法时，可以有相关定义的通知呢？它又是如何找到`invoke`的呢？

其实除了`Proxy.newProxyInstance`之外，我们还有一种方式代码如下：

    InvocationHandler handler = new MyInvocationHandler(...);
     Class proxyClass = Proxy.getProxyClass(
         Foo.class.getClassLoader(), new Class[] { Foo.class });
     Foo f = (Foo) proxyClass.
         getConstructor(new Class[] { InvocationHandler.class }).
         newInstance(new Object[] { handler });
以上代码是JDK API中的，我就不再对我的代码实现一遍了。

通过以上代码我们会发现，在动态代理中其实与之前说过的Java中的反射有很大的关系，只是，现在咱们都将方法封装起来了，并不需要你来手动对方法进行invoke了。

同时我们在JDK中关于Proxy的源代码的时候，会发现对于所载入的加载器和类都会放在缓存中，从而加快下次使用的效率。

基本上就完成了基础知识的复习了，但是还会有很多继续深入的问题再留着，需要时间来慢慢提升。

(完)

####参考资料

1、[动态代理---维基百科]()

2、[Java动态代理和cglib]()





`

   








 









    







    


    




    



    
























    



    