---
layout: post
title: "Java中的深浅拷贝"
description: "java 深浅拷贝"
category: java
tags: [java]
---

这篇文章简单介绍一下Java中的深浅复制，主要想法是来源于之前写设计模式的时候原型模式中的创建方法，里面就会涉及到深拷贝和浅拷贝，所以在网上看了一下基本资料之后，我也来简单研究一下这个东西，因为在看python的时候我也看到过关于这方面的知识，包括此项内容应该会涉及到jvm中对象的分配处理方式，所以暂时研究一下简单的原理可以为以后进行深入。

**浅拷贝：**被复制对象的所有变量都含有与原来的对象相同的值，而所有的对其他对象的引用仍然指向原来的对象。换言之，浅复制仅仅复制所考虑的对象，而不复制它所引用的对象。

**深拷贝：**被复制对象的所有变量都含有与原来的对象相同的值，除去那些引用其他对象的变量。那些引用其他对象的变量将指向被复制过的新对象，而不再是原有的那些被引用的对象。换言之，深复制把要复制的对象所引用的对象都复制了一遍。

理论介绍完毕，下面我们从代码方面来理解这两个术语。

代码内容如下：

    package com.test.designpattern.creation.prototype;

    import java.io.ByteArrayInputStream;
    import java.io.ByteArrayOutputStream;
    import java.io.IOException;
    import java.io.ObjectInputStream;
    import java.io.ObjectOutputStream;
    import java.io.Serializable;

    public class Prototype implements Cloneable,Serializable {

	/**
	 * 以下代码包括深拷贝和浅拷贝的相关代码
	 */
	private static final long serialVersionUID = 1L;
	private String oName;
	private Serializable obj;
	ReferencePro rp;
	
	public Prototype(String oName,ReferencePro rp){
		this.oName = oName;
		this.rp = rp;
	}
   	
    //浅拷贝的相关代码
	@Override
	protected Object clone() throws CloneNotSupportedException {
		
		return (Prototype)super.clone();
	}
	
	public String getoName() {
		return oName;
	}

	public void setoName(String oName) {
		this.oName = oName;
	}

	public Serializable getObj() {
		return obj;
	}

	public void setObj(Serializable obj) {
		this.obj = obj;
	}
    
    //深拷贝的相关代码
	public Object deepClone() throws IOException, ClassNotFoundException{
        //定义一个输出流，将当前对象输出到流中
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		ObjectOutputStream oos = new ObjectOutputStream(bos);
		oos.writeObject(this);
		//定义一个输入流，将当前对象输入到流中，通过反序列化，从而获得对象
		ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
		ObjectInputStream ois  =  new ObjectInputStream(bis);
		return ois.readObject();
	}
	
    }

**相关代码解释**

>####浅拷贝代码解释

>><li>如何进行浅拷贝</li>
>>>我们实现`Cloneable`接口，然后我们实现`clone()`方法，这个方法是空的，我们可以进行重写，然后返回对象即可。

>####深拷贝代码解释

>><li>如何进行深拷贝</li>
>>>我们需要将对象进行序列化，同时使用相关流的操作进行反序列化，最后得到一个对象。

下面我们再定义一个引用类，代码如下：

    package com.test.designpattern.creation.prototype;
    import java.io.Serializable;

    public class ReferencePro implements Serializable {
	
	private static final long serialVersionUID = 1L;
	public String rName;
	public ReferencePro(String rName) {
		this.rName = rName;
	}
    }

注意引用类要进行序列化，从而我们可以在原类中进行反序列化。

我们写一个简单的测试类进行相关测试：

    package com.test.designpattern.creation.prototype;

    import java.io.IOException;

    public class ProTest {
	public static void main(String[] args) throws CloneNotSupportedException, 
    IOException, ClassNotFoundException {
      ReferencePro rp = new ReferencePro("ecgaoxiang");
      Prototype p1 = new Prototype("jack", rp);
      Prototype p2 = (Prototype) p1.clone();
      p2.rp.rName = "gemeni";
      System.out.println(p1.rp.rName);//我们发现rp.rName变为gemeni
      
      Prototype p3 = (Prototype) p1.deepClone();
      p3.rp.rName = "gateskell";
      System.out.println(p1.rp.rName);//仍然是gemeni   
	}
    }

我们看到控制台输出如下信息：

    gemeni
    gemeni

显而易见，利用浅拷贝我们会使原对象的值改变，而是用深拷贝我们不会改变原来相关属性的值，所以这就是以上相关术语的解释，其实，深浅拷贝也会有相关的应用领域，由于时间问题，我就不说了，感兴趣的可以去网上搜索相关文章。

(完)

###参考资料

1、[JAVA深复制(深克隆)与浅复制(浅克隆)](http://www.cnblogs.com/yxnchinahlj/archive/2010/09/20/1831615.html)








    


    




    



    
























    



    