---
layout: post
title: "java学习知识点--关于Java Annotation(java注解)"
description: "java Annotation 注解"
category: java
tags: [java]
---

以前在做一些java web项目的时候，总是会使用到诸如Struts、Hibernate、Spring这些框架，特别是在Hibernate中会用到一个叫做Hibernate Annotation的框架，省得在XML文件中对相关信息进行配置，这个无疑大力减少了开发的时间，降低了开发的成本，在Spring中注解也得到了大力应用，所以搞清楚Java Annotation是怎么一回事，还是有必要的，毕竟这些都是一些基础的东西，只有掌握了这些，看一些中大型的项目才能更清楚人家的设计流程。

###Java Annotation基本知识点


其实按照我的理解，Java Annotation(注解)其实就是Java提供了用于针对于程序中的各个元素关联一些信息的方法。在Java API中其表示一个接口，在定义了注解的程序中我们可以通过Java的反射机制来获取所定义的这些注解信息。是Java语言5.0版本开始支持加入源代码的特殊语法元数据，被注解标注过的元素，会被嵌入到字节码中，从而由JVM执行时获取到相关信息。

在Java中，包括Class、filed、argument、package等都可以进行注解，并且具有自反性。

###注解分类

1.JDK内置系统注解 2.元注解   3.自定义注解

###1、元注解：注解类型

Java中提供了如下的几种注释类型：

>@Retention:指示注释类型的注释要保留多久。如果注释类型声明中不存在 Retention 注释，则保留策略默认为 RetentionPolicy.CLASS。 其主要作用就是保存注解的生命周期。其使用RetenPolicy来指示相关属性

>>####RetentionPolicy分类

>>CLASS:编译器将把注释记录在类文件中，但在运行时 VM 不需要保留注释。

>>RUNTIME:编译器将把注释记录在类文件中，在运行时 VM 将保留注释，因此可以反射性地读取。

>>SOURCE:编译器要丢弃的注释。

>@Inherited:指示注释类型被自动继承。如果在注释类型声明中存在 Inherited 元注释，并且用户在某一类声明中查询该注释类型，同时该类声明中没有此类型的注释，则将在该类的超类中自动查询该注释类型。此过程会重复进行，直到找到此类型的注释或到达了该类层次结构的顶层 (Object) 为止。如果没有超类具有该类型的注释，则查询将指示当前类没有这样的注释。

>@Target:其指示相应的注释类型，如果注解中不包括此注解，则会应用到所有类型当中，在其中会包括一个value值，而在API中我们会使用ElementType来进行标注，ElementType包括如下几种样式：

>>####ElementType属性

>>#####其是一个枚举enum类型

>>ANNOTATION_TYPE:注释类型声明

>>FIELD：字段声明

>>METHOD：方法声明

>>PACKAGE:包声明

>>PARAMETER ：参数声明

>>CONSTRUCTOR :构造方法声明   

>>LOCAL_VARIABLE :局部变量声明

>>TYPE:用于描述类、接口(包括注解类型) 或enum声明

>例如以下代码示例：

    @Target(ElementType.TYPE)
    public @interface TestAnn{
       /*do something*/
    }
>以上程序的注解用于描述类、接口(包括注解类型) 或enum声明。

    @Target(ElementType.FIELD)
    public @interface TestAnn{
       /*do something*/
    }
>以上程序的注解只能用于字段声明。

>@Documented:指示某一类型的注释将通过 javadoc 和类似的默认工具进行文档化。应使用此类型来注释这些类型的声明：其注释会影响由其客户端注释的元素的使用。如果类型声明是用 Documented 来注释的，则其注释将成为注释元素的公共 API 的一部分。

###2、JDK内置系统注解

@Override：表示一个方法声明打算重写超类中的另一个方法声明。如果方法利用此注释类型进行注解但没有重写超类方法，则编译器会生成一条错误消息。

@Deprecated：用于修饰已经过时的方法;

@SuppressWarnnings:用于通知java编译器禁止特定的编译警告。

以上的一些理论概念我就不举什么代码例子了，在平常的项目开发中也都会用到。

###3、自定义注解解释器

有了以上的理论铺垫之后，现在我们自己来实现一个自定义的注解器，并且来使用这个注解器，从而加深对知识的巩固。

定义一个BikeName Annotation：

    package com.test.annotation;

    import java.lang.annotation.Documented;
    import java.lang.annotation.ElementType;
    import java.lang.annotation.Retention;
    import java.lang.annotation.RetentionPolicy;
    import java.lang.annotation.Target;

    @Target(ElementType.FIELD)
    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    public @interface BikeName {
        String value() default "";
    }

下面我们定义一个BikeSize Annotation：

    package com.test.annotation;

    import java.lang.annotation.Documented;
    import java.lang.annotation.ElementType;
    import java.lang.annotation.Retention;
    import java.lang.annotation.RetentionPolicy;
    import java.lang.annotation.Target;

    @Target(ElementType.FIELD)
    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    public @interface BikeSize {

	//define the sizes enumeration of bike
	public enum Size{ BIG,SMALL,MIDDLE};
	
	//define the size attr of bike
	Size bikeSie() default Size.BIG;
    }

定义一个Bike提供商的Annotation，定义如下：

    package com.test.annotation;

    import java.lang.annotation.Documented;
    import java.lang.annotation.ElementType;
    import java.lang.annotation.Retention;
    import java.lang.annotation.RetentionPolicy;
    import java.lang.annotation.Target;

    @Target(ElementType.FIELD)
    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    public @interface BikeProvider {

	public int id() default -1;//the provider's id
	public String proName() default "";//the provider's name
	public String proAddr() default "";//the provider's address
    }


下面我们定义一个叫做Geant的Bike类：

    package com.test.annotation;

    import com.test.annotation.BikeSize.Size;

    public class Geant {

	@BikeProvider(id=101,proAddr="AMERICA",proName="AMERICA BIKE COMPANY")
	private String bikeProvide;
	
	@BikeName("Geant")
	private String geantName;
	
	@BikeSize(bikeSie=Size.MIDDLE)
	private String geantSize;

	public String getBikeProvide() {
		return bikeProvide;
	}

	public String getGeantName() {
		return geantName;
	}

	public String getGeantSize() {
		return geantSize;
	}

	public void setBikeProvide(String bikeProvide) {
		this.bikeProvide = bikeProvide;
	}

	public void setGeantName(String geantName) {
		this.geantName = geantName;
	}

	public void setGeantSize(String geantSize) {
		this.geantSize = geantSize;
	}
	
	public void showName(){
		System.out.println("The bike's name is Geant");
	}
    }

定义一个BikeAnnoParse解析器，来获取相关信息，代码如下：

    package com.test.annotation;

    import java.lang.reflect.Field;

    public class BikeAnnoParse {

	public void getBikeInfo(Class<?> clazz) {

		String bName = "Bike's name:";
		String bSize = "Bike's size:";
		String bProvide = "Bike's provide:";

		Field[] fields = clazz.getDeclaredFields();

		for (Field f : fields) {
			if (f.isAnnotationPresent(BikeName.class)) {
				BikeName biName = (BikeName) f.getAnnotation(BikeName.class);
				bName = bName + biName.value();
				System.out.println(bName);
			} else if (f.isAnnotationPresent(BikeSize.class)) {
				BikeSize biSize = (BikeSize) f.getAnnotation(BikeSize.class);
				bSize = bSize + biSize.bikeSie().toString();
				System.out.println(bSize);
			} else if (f.isAnnotationPresent(BikeProvider.class)) {
				BikeProvider biProvider = (BikeProvider) f
						.getAnnotation(BikeProvider.class);
				bProvide = bProvide + "The provider's id is " + biProvider.id()
						+ ", and name is " + biProvider.proName()
						+ ", and addr is " + biProvider.proAddr();
				System.out.println(bProvide);
			}
		}
	}

    }


以上是通过Java的反射机制来获取先关的注解信息。

下面咱们来测试一下，定义一个TestParse类：

    package com.test.annotation;

    public class TestParse {

	public static void main(String[] args) {
		BikeAnnoParse bp = new BikeAnnoParse();
		bp.getBikeInfo(Geant.class);
	}
    }

我们会发现控制台输出如下信息：

    Bike's provide:The provider's id is 101, and name is AMERICA BIKE COMPANY, 
    and addr is AMERICA
    Bike's name:Geant
    Bike's size:MIDDLE

至此，我们自行定义的一个注解解释器就完成了。、

其实这些知识点都是很琐碎的但是又很重要，如果不掌握这些，我们在看一些人家写的框架上就不是那么得心应手，所以，在成熟之前我们总会经历这么一个过程。

(完)

###参考资料

1、[Java注解--维基百科](http://zh.wikipedia.org/zh/Java_%E6%B3%A8%E8%A7%A3)

2、[深入理解Java注解--自定义注解解释器](http://www.cnblogs.com/peida/archive/2013/04/26/3038503.html)

3、[详解 Spring 3.0 基于 Annotation 的依赖注入实现](http://www.ibm.com/developerworks/cn/opensource/os-cn-spring-iocannt/)

















    



    