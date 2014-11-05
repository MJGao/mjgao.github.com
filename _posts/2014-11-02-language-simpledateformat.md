---
layout: post
title: "聊聊SimpleDateFormat"
description: "SimpleDateFormat java 线程"
category: java
tags: [java]
---

在Java中我们对于SimpleDateFormat这个类应该很熟悉了，就是对时间进行处理的一个相关类，前几天我读文档的时候发现其实线程不安全的，这就来问题了，假如在网站或者系统负载比较大的时候，假如用到这个类，那我们应该如何处理呢？如何编写线程安全级别的程序呢？

下面我们先来看一下最简单粗暴的写法：

    package com.study.demo1;

    public class TestSimpleDateFormat extends Thread {

	SimpleDateFormat sdf  = new SimpleDateFormat("yyyy-MM-dd");
	@Override
	public void run() {
       System.out.println(sdf.parse(parseTime));
	}

	
	public static void main(String[] args) {
		
		/*
		 * The first method
		 * */
		for(int i=0;i<3;i++){
			TestSimpleDateFormat tsdf = new TestSimpleDateFormat();
			tsdf.start();
		}
	}
    }

这是最简单的一种写法，可是我们会发现一个问题，就是我们为每个线程都新建了一个对象，这个在高访问的系统中无疑使不可行的，会增加虚拟机的负载能力。

下面看第二种写法：

1、写一个时间处理的工具类：

    package com.study.demo1;

    import java.text.DateFormat;
    import java.text.ParseException;
    import java.text.SimpleDateFormat;

    public class DateFormatUtils {

	static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

	public void getParse() {
		synchronized (sdf) {
			if (null == sdf) {
				sdf = new SimpleDateFormat("yyyy-MM-dd");
				System.out.println("Create a new instance");
			}
			try {
				System.out.println(sdf.parse("2014-01-01"));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
	}
    }

2、测试类

    package com.study.demo1;


    public class TestSimpleDateFormat extends Thread {

	static DateFormatUtils dfu = new DateFormatUtils();
	@Override
	public void run() {
		dfu.getParse();
	}

	
	public static void main(String[] args) {
		
		/*
		 * The second method
		 * */
		for(int i=0;i<3;i++){
			TestSimpleDateFormat tsdf = new TestSimpleDateFormat();
			tsdf.start();
		}	
	}
    }


当然这里使用了同步机制，其实变相的是一种单例的实现。

后来我去网上看了相关的帖子，其实还有更进一步的写法，通过ThreadLocal来实现相关的线程安全，具体代码如下：

1、写一个时间处理的工具类：

    package com.study.demo1;

    import java.text.DateFormat;
    import java.text.ParseException;
    import java.text.SimpleDateFormat;

    public class DateFormatUtils {

	private static ThreadLocal<DateFormat> tl = new ThreadLocal<DateFormat>();

	public static DateFormat getDateFormat() {
		DateFormat df = tl.get();
		if (null == df) {
			df = new SimpleDateFormat("yyyy-MM-dd");
			tl.set(df);
		}
		return df;
	}

	public void getParse2() {

		try {
			System.out.println(getDateFormat().parse("2014-01-01"));
		} catch (ParseException e) {
			e.printStackTrace();
		}
	}
    }

2、测试类

    package com.study.demo1;


    public class TestSimpleDateFormat extends Thread {

	static DateFormatUtils dfu = new DateFormatUtils();
	@Override
	public void run() {
		dfu.getParse2();
	}

	
	public static void main(String[] args) {
		
		/*
		 * The second method
		 * */
		for(int i=0;i<3;i++){
			TestSimpleDateFormat tsdf = new TestSimpleDateFormat();
			tsdf.start();
		}	
	}
    }

以上几种方法都可以达到一定的线程安全，不过还是要具体情况具体使用了，我觉得也并不是一定要追求极致，看系统的负载能力等要求，选择一定的适合的方法就行了。

(完)








`

   








 









    







    


    




    



    
























    



    