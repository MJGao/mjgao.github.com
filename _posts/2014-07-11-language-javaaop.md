---
layout: post
title: "由动态代理来看AOP---简单模拟AOP"
description: "java 动态代理 AOP"
category: java
tags: [java]
---

其实，这篇文章应该接着上篇文章来继续写，但是因为时间和篇幅的问题，就分为了两个部分。

这篇文章是我对AOP学习的一些知识点的总结，当然这里的AOP基本上是看的Spring中的相关用法，因为想把其中的原理给弄清楚了，所以务必要自己来模拟一下AOP内部形成的过程。

我们知道AOP是Spring中的一个很重要的元素，并且里面也延伸了很多相对而言复杂的概念，例如切入点、通知、通知的类型、切面等等，而在查阅官方文档的时候会发现，在Spring里创建一个AOP代理的基本方法是使用org.springframework.aop.framework.ProxyFactoryBean。查阅API文档，知道其的接口为FactoryBean，其中会有如下几个实现的方法：

    getObject()、getProxy()、setBeanFactory(BeanFactory beanFactory)等。

所以，根据以上的几个知识点，我们来实现一个最简单的AOP框架，从而让我们加深对AOP的理解。

#####注：对于AOP的一些理论知识，我这里就不再细讲了，我上篇文章已经讲过，同时网上也有很多现成的资料#####

####1、我们首先定义一个 ProxyFactoryBean类，具体代码如下：

这里我们实现了getProxy()方法，通过使用JDK中的基于接口的动态代理，假如没有接口的话，那就要使用cglib等库来进行动态代理了。

    package com.test.aop;

    import java.lang.reflect.InvocationHandler;
    import java.lang.reflect.Method;
    import java.lang.reflect.Proxy;

    import com.test.advice.Advice;

    public class ProxyFactoryBean {

	private Advice advice;
	private Object target;

	public Advice getAdvice() {
		return advice;
	}

	public void setAdvice(Advice advice) {
		this.advice = advice;
	}

	public Object getTarget() {
		return target;
	}

	public void setTarget(Object target) {
		this.target = target;
	}

	public Object getProxy() {
		Object proxy = Proxy.newProxyInstance(this.target.getClass()
				.getClassLoader(), this.target.getClass().getInterfaces(),
				new InvocationHandler() {

					@Override
					public Object invoke(Object proxy, Method method,
							Object[] args) throws Throwable {

						advice.beforeMethod(method);
						Object retVal = method.invoke(target, args);
						advice.afterMethod(method);
						return retVal;
					}
				});
		return proxy;
	}
    }
####2、接着，我们回想一下在Spring中使用AOP的情况，这里我们使用XML文件的配置方式，并且我们也知道在Spring中对AOP的管理将会通过Spring IOC容器，所以我们还需要定义一个BeanFactory类(因为这里仅仅是模拟，所以就不一一来实现，直接在BeanFactory中写方法)，具体代码如下：

    package com.test.aop;

    import java.io.IOException;
    import java.io.InputStream;
    import java.util.Properties;

    import com.test.advice.Advice;

    public class BeanFactory {

	Properties pro = new Properties();

	public BeanFactory() {
	}

	public BeanFactory(InputStream is) {
		try {
			pro.load(is);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public Object getBean(String cName) {
		String clazzName = pro.getProperty(cName);
		Object bean = null;
		try {
			Class clazz = Class.forName(clazzName);
			try {
				bean = clazz.newInstance();
			} catch (InstantiationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		if (bean instanceof ProxyFactoryBean) {
			Object proxy = null;
			ProxyFactoryBean proxyFactoryBean = (ProxyFactoryBean) bean;
			try {
				Advice advice = null;
				try {
					advice = (Advice) Class.forName(
							pro.getProperty(cName + ".advice")).newInstance();
				} catch (InstantiationException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				Object target = null;
				try {
					target = Class.forName(pro.getProperty(cName + ".target"))
							.newInstance();
				} catch (InstantiationException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				proxyFactoryBean.setAdvice(advice);
				proxyFactoryBean.setTarget(target);
				proxy = proxyFactoryBean.getProxy();
			} catch (ClassNotFoundException e) {
				e.printStackTrace();
			}
			return proxy;
		}
		return bean;
	}
    }

####3、我们也来写一个配置文件，用来配置相关AOP，从而充当一个Spring IOC容器，文件名称为config.properties，具体内容如下：

    test=com.test.aop.ProxyFactoryBean
    test.advice=com.test.advice.AdviceImple
    test.target=java.util.ArrayList

####4、写一个基本的测试类，代码如下：

    package com.test.aop;

    import java.io.InputStream;
    import java.util.Collection;

    public class AopTest {
	public static void main(String[] args) {
		InputStream is = AopTest.class.getResourceAsStream("config.properties");
		BeanFactory bf = new BeanFactory(is);
		Object bean = bf.getBean("test");
		System.out.println(bean.getClass().getName());
		((Collection) bean).clear();
	}
    }

控制台打印出如下信息：

    $Proxy0
    I am in SuZhou
    clear
    I am at home

这里的Advice类用的是上一篇文章中测试的文件。

OK，到这里，动态代理这一部分就告一个段落了，仔细想来，这些都是一些基础的东西，只有把这些掌握得牢靠了，对于看人家的项目或者开源的代码才能够大体做到心中有数。

(完)

####参考资料

1、









`

   








 









    







    


    




    



    
























    



    