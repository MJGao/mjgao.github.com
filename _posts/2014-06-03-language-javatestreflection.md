---
layout: post
title: "java学习知识点--关于反射机制和类加载器"
description: "java 反射 类加载器"
category: java
tags: [java]
---

今天看到Apple公布了一款新一代的语言--swift，这不禁让我想到与Taylor Swift是什么关系(纯属玩笑)。一直认为苹果的东西都是高大上，也没有那个金钱去这上面折腾，但是去看一下它所推出的语言还是应该的，大体看了一下，感觉就是js和scala的私生子，里面也囊括了模式匹配、闭包等各种元素，而且在语法上面都大体近似，假如有这些基础的话，我想学起来并不是太难。

以上面这些话开头，并不表示我想去学，而是觉得目前已经有若干的语言在不断发展，而且行业里貌似将这些语言分为`动态`和`非动态`。所谓动态，即在程序运行过程中允许改变变量或者结构的类型，例如python、ruby、perl、scala；而包括java、c++、c在内的并不属于，然而java却有一个反射(Reflection)机制，可以在程序运行期间探测、使用编译期间的未可知的class，并且可以通过API获得此class的文件结构，包括filed、constructor、attribute等。网上也有很多来剖析java反射机制的文章，感兴趣的可以去google一下。

###简单入门使用

我先不说什么理论的东西，先直接看代码，定义如下：

    public class TestRelection {

	    public TestRelection() {

	   }

	    public static void main(String[] args) {
		 Integer a = 1;
		 System.out,println(a.getClass().getName());
         System.out.println(cla.getSuperclass().getName());
	   }
 
    }
控制台将输出如下：
    
    java.lang.Integer
    java.lang.Number
上面的意思大体如下：

定义一个变量为Integer，然后通过获得a的class的名称，再获得它的超类的名称。

我们在连接数据库的时候经常使用`Class.forName("com.mysql.jdbc.Driver")`(我以Mysql数据库为例)来对数据库驱动进行注册，所以这里我们也来使用这个static method。


首先我我们新建一个PersonTool类用于测试，代码如下：

    package com.test.dao;

    public class PersonTool {

	     private String pwd;
	     private String userName;
	
	     public PersonTool(){
		
	     }
	
	     public PersonTool(String userName, String pwd) {
		    super();
		    this.userName = userName;
		    this.pwd = pwd;
	     }
	     public String getPwd() {
		    return pwd;
	     }
	     public String getUserName() {
		    return userName;
	     }
	     public void setPwd(String pwd) {
		    this.pwd = pwd;
	     }
	     public void setUserName(String userName) {
		    this.userName = userName;
	     }
	
	     public void addPerson(String s){
		  System.out.println(s);
	   }
	
     }
然后我们在TestRelection中定义如下：

     public class TestRelection {

	    public TestRelection() {

	   }

	    public static void main(String[] args) {
		  Class<?> clasz = Class.forName("com.test.dao.PersonTool");
		  System.out.println(clasz.getName());
		  System.out.println(clasz.getPackage().getName());
          Method[] ms = clasz.getMethods();
		   for(Method msname:ms){
			 System.out.println(msname.getName());
		 }
	   }
    }
我们会发现控制台输出如下内容：

    com.test.dao.PersonTool//类全限定名，可以调用getSimpleName()获得简单名称
    com.test.dao//包名称
    addPerson getPwd setPwd setUserName getUserName wait wait wait hashCode 
    getClass equals toString notify notifyAll//所获得的方法
因为PersonTool的超类是Object，所以会继承它所有的方法。

下面我们来看一下如何在运行期间动态执行相应的方法，代码定义如下：
 
     public class TestRelection {

	    public TestRelection() {

	   }

	    public static void main(String[] args) {
		 Class c = (Class) Class.forName("com.test.dao.PersonTool");
		 Object o = Class.forName("com.test.dao.PersonTool").newInstance();
		 Class types = Class.forName("java.lang.String");
		 Method m = c.getMethod("addPerson",types);//方法名、参数
		 String s = new String("mjgao");
		 m.invoke(o, s);//调用对应类中的对应方法
		 }
	   }
    }
我们将会发现控制台输出`mjgao`，这样我们可以进一步回忆我们以前所学过的加载数据库的驱动内部是如何实施的，你可以去看一下java API文档对这部分的讲解。

下面，我们再来看一个小例子：

     public class TestRelection {

	    public TestRelection() {

	   }

	    public static void main(String[] args) {
		 Class c = (Class) Class.forName("com.test.dao.PersonTool");
		 Object o = Class.forName("com.test.dao.PersonTool").newInstance();
		 Field field  = c.getField("pwd");
         field.set(o,"ecgaoxiang");
         System.out.println(field.get(o));
		 }
	   }
    }
我们将会发现报如下的错误：

    Exception in thread "main" java.lang.NoSuchFieldException: pwd
	  at java.lang.Class.getField(Class.java:1520)
	  at com.test.reflecttion.TestRelection.main(TestRelection.java:55)
原来是我们在定义pwd的时候使用的是`private`修饰，所以自然而然会找不到，所以我么需要修改一下，控制台输出如下结果：

    ecgaoxiang
以上的代码意思：`通过java的反射机制，从而动态的在运行过程中改变field的值`。

我们来看java反射机制的最后一个小例子：

     public class TestRelection {

	    public TestRelection() {

	   }

	    public static void main(String[] args) {
		 System.out.println(TestRelection.class.getClassLoader().getSystemClassLoader());
		 System.out.println(TestRelection.class.getClassLoader().getClass().getName());
        System.out.println(TestRelection.class.getClassLoader().getParent
        ().getClass().getName());
		 }
	   }
    }
我们将会看到控制台输出如下内容：

    sun.misc.Launcher$AppClassLoader@19821f
    sun.misc.Launcher$AppClassLoader
    sun.misc.Launcher$ExtClassLoader


我们可以大体知道，TestReflection类的系统类加载器、父加载器以及相关在加载时候真实使用的加载器

所以我们进入下一个小话题，关于类加载器。

###类加载器

记得我之前写过一篇关于class文件的文章，在其中大体简单分析了class文件中的内容都代表什么，class文件的内容是如何被jvm所认识的，最后还说明了class文件的加载过程，提到了三个类加载器，分别是：

    系统类加载器（System ClassLoader）、启动类加载器（Bootstrap ClassLoader）、
    扩展类加载器（Extension ClassLoader）

    启动类加载器：它是加载java的核心库
    扩展类加载器：加载一些扩展库
    系统类加载器：这是根据CLASSPATH中定义的一些库来进行加载

其实他们的主要作用就是对于class文件的加载进行`任务委派`，一个加载器加载不到就交给下一个，从而形成类似于`好吃的先老人来，然后再小的`的这种机制。当然目前新的规范中貌似这种还有了改变，我这里就不赘述了，感兴趣的可以去看文档。

我们记得在定义环境变量的时候会定义一个`CLASSPATH`环境变量，初学时候我一直不知道这个干吗用，只是按照流程走就行了，后来知道可以在其中添加很多jar包可以使我们全局使用。后来我也发现`sun.misc.Launcher$AppClassLoader`是属于rt.jar，按照我的理解这个应该是运行时处理class的jar包，同时知道这个类中有`<clinit>`方法，这个肯能涉及到源码的问题，以后有必要去深入看一下。貌似有点扯题了。其实我知道这个概念之后，我就想，我们是否能够定义用户个人的类加载器，从而来加载相应的class文件，就如同java那样，所以顺便查了一些资料，下面我就来定义一个自己的类加载器。

###First Step

###Notice

官方文档上有这样一则说明，翻译下来大体意思是这样：

    数组类的 Class 对象不是由类加载器创建的，而是由 Java 运行时根据需要自动创建。数组类的
    类加载器由 Class.getClassLoader() 返回，该加载器与其元素类型的类加载器是相同的；如果
    该元素类型是基本类型，则该数组类没有类加载器。
我觉得最后一句话特别重要，元素是基本类型的jvm自行创建，而不需要类加载器。

我们可以看一个代码示例：

     public class TestRelection {

	    public TestRelection() {

	   }

	    public static void main(String[] args) {
		System.out.println(Thread.class.getClassLoader());
		 }
	   }
    }

我们将会看到输出如下结果：

    null

其他的很多如Thread的基本类型都是如此。

根据官方文档以及我自己的理解：虚拟机根据所安装的平台，从而从本地文件系统加载类，例如前面所定义的CLASSPATH环境变量，通过其中的jar包从而可以进行加载。

所以，对于例如需要从网络等地方加载类的则需要定义一个类加载器。

###Second Step

定义一个类加载器我的思路大体如下：首先，我们需要获得class类文件的原内容，这个肯定需要相关io的操作，然后转换成class文件。然后再进行相关调用。

>定义一个类为自己的类加载器，类名称为`UserClassLoader`，具体代码如下：

    package com.test.load;

    import java.io.ByteArrayOutputStream;
    import java.io.FileInputStream;
    import java.io.FileNotFoundException;
    import java.io.IOException;

    public class UserClassLoader extends ClassLoader {
        public String classDFName;
	    @Override
	   protected Class<?> findClass(String fileName) throws ClassNotFoundException {
		String classDirName = classDFName + "\\" + (fileName.substring
       (fileName.lastIndexOf(".")+1)) + ".class";
		try {
			FileInputStream  fis = new FileInputStream(classDirName);
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			System.out.println("-----read the file-----");
			int b = -1;
			try {
				while((b=fis.read())!=-1){
					bos.write(b);
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
			byte[] bs = bos.toByteArray();
			return defineClass(null,bs, 0, bs.length);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		
		return null;
		
	}

	   public UserClassLoader(String classDFName) {
		this.classDFName = classDFName;
	   }
    }

>下面我们我们沿用以上的`PersonTool`类，并将生成后的class文件拷贝到userlib文件下。

>咱们定义一个测试自己定义的类加载器的文件，名称为`TestLoader`，代码如下：

    package com.test.load;

    import java.util.Date;

    public class TestLoader {

	public static void main(String[] args) throws ClassNotFoundException, 
    InstantiationException, IllegalAccessException {
	
	   Class<?> cs = new UserClassLoader("userlib").loadClass("com.test.dao.PersonTool");
	   System.out.println(cs.getName());
	   System.out.println(cs.getClassLoader().getClass().getName());
       System.out.println(cs.getClassLoader().getSystemClassLoader().getClass
       ().getName());
	   System.out.println(Thread.class.getClassLoader());
		
	  }
    }

我们会发现输出如下结果：

    com.test.dao.PersonTool
    sun.misc.Launcher$AppClassLoader
    sun.misc.Launcher$AppClassLoader
    null

这就是我们所要定义的类加载器，这个玩意在很多成熟框架上都用到了，并且是java中的一个重重之重，所以也打算在后期看源码的时候多去了解研究一下。

其实包括反射、类加载远不止这么多东西，还有很多需要我们去探索的，并且真正搞懂内部原理才算是精通。

(完)

###参考资料

1、[侯捷谈反射机制](http://hi.baidu.com/ismayday/item/fb4d7d8a073cd4ebe496e0ea)

3、[深入探讨 Java 类加载器](http://www.ibm.com/developerworks/cn/java/j-lo-classloader/)

4、[java类装载器--维基百科](http://zh.wikipedia.org/zh/Java%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%99%A8)






    



    