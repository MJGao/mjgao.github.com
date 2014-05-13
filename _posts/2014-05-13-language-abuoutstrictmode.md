---
layout: post
title: "Strict Mode In Javascript(javascript中的严格模式)"
description: "javascript strict mode ecma"
category: javascript
tags: [javascript]
---

最近一直在玩javascript方面的东西，第一，发现以前对这门语言认识太少；第二，通过玩的过程中，发现了很多以前一直忽略的东西；第三，补充了我很多知识的不足；第四，对语言认识的误区有了一定的改善与修正。

javascript目前发展确实比较快，包括目前很流行的服务器端的Node.js，模块化的require.js等，还有一些一直都在使用的例如jQuery、Dojo等。而针对于一些列的此语言的标准可以看这份[Ecma官方文档](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)，说实话，最近也发现英语确实需要大补了，看这份官方文档确实看了好久，也仅仅掌握了那么一丢丢。

前面也说过最近一直在看这方面的资料，所以在自己深入的过程之中经常看的站点就是github了，这段时间看了一些人家写的开源项目，包括store.js、move.js等，都是一些小众的小型的项目，不过在看的途中我发现了很多项目里面都使用`use strict`这个关键词，所以特地去网上找了一系列的相关资料，以下一些内容是在[w3schools](http://www.w3schools.com/js/js_strict.asp)所找到的，具体内容大家可以看前面提到的官方文档。

以下是对这个关键词在w3schools中的释义：

    The "use strict" directive is new in JavaScript 1.8.5 (ECMAScript version 5).
    
    It is not a statement, but a literal expression, ignored by earlier versions 

    of JavaScript.

    The purpose of "use strict" is to indicate that the code should be executed 

    in "strict mode".
可以看出这个模式是在ECMAScript version 5中才添加进去的，而对于不在这个模式中运行的代码将会不予以考虑。

以下是为什么要使用这个关键词：

    Strict mode makes it easier to write "secure" JavaScript.

    Strict mode changes previously accepted "bad syntax" into real errors.

    As an example, in normal JavaScript, mistyping a variable name creates a new 

    global variable. In strict mode, this will throw an error, making it 

    impossible to accidentally create a global variable.

    In normal JavaScript, a developer will not receive any error feedback 

    assigning values to non-writable properties.

    In strict mode, any assignment to a non-writable property, a getter-only 

    property, a non-existing property, a non-existing variable, or a non-existing 

    object, will throw an error.
以上指出使用这个的目的是为了更简单地写出“安全性”的code，这个安全性按照我个人的理解可能就是针对于底下所列出的例如只具有可读性、未定义变量、属性、以及对象等内容在程序员搞错的时候都会抛出错误。而在以前正常的js中，某些错误可能并不会得到反馈。

说起来挺抽象的，下面列出几个例子，自己复习一下：

**1、关于全局变量定义的问题**

    function Test(){
	     //"use strict";
	       b = 1;
           alert(b);//正常输出		
    }	


    function Test(){
	       "use strict";
	       b = 1;
           alert(b);//错误	
    }	
之前我们在写js代码的时候，如果在变量前未加修饰，则会定义为全局变量，而如果在use strict模式下，这样的写法将会抛错。

**2、关于删除变量的问题**

    function Test(){
	      //"use strict";		
          var testV = "123";
          delete testV;
          alert("delete");//正常输出
    }	

    function Test(){
	      "use strict";		
          var testV = "123";
          delete testV;
          alert("delete");//抛出错误
    }	
javascript中有一个`delete`关键字用于删除变量，C++中也存在。而在use strict中，将会不允许读变量进行删除。

**3、定义一个属性的值重复超过一次**

    function Test(){
	      var testV = {
               v1:10,
               v2:20,
               v1:30
          };
          alert(testV.v1);//输出30
    }	

    function Test(){
          "use strict";	
	      var testV = {
               v1:10,
               v2:20,
               v1:30
          };
          alert(testV.v1);//出错
    }	
以往写js这样定义的时候，v1的值将会被后面的30覆盖，然而在use strict模式中，这种将会出错。

**4、关于重复定义字段的问题**
    
    <script>
    function Test(){
          testV(3,4);//将会输出4
    }
    
    function testV(p,p){
          alert(p); 
    }
    </script>

    <script>
       "use scrict";
    function Test(){
          testV(3,4);//将会报错
    }
    
    function testV(p,p){
          alert(p); 
    }
    </script>
其实这个问题还上面那个是差不多的关系，就没必要说了。不过在测试的过程之中，针对于use strict摆放的位置将会导致程序运行的结果不同，待会再说明。

**关于8进制的数字是否能够运行**
    
    function Test(){
      var testV = 010;
      alert(testV);//输出8
    }

    function Test(){
      "use strict";
      var testV = 010;
      alert(testV);//报错
    }

**对只读变量进行写的问题**

    function Test(){
      "use strcit";
       var testVObject = {};
       Object.defineProperties(testVObject,"v",{value:0,writable:false});
       testVObject.v = 3;
       alert(testVObject.v);
    }
这种在正常情况下将会加载失败，而在strict mode下将会出错。

**对仅仅getter属性的值进行赋值的问题**

    function Test(){
      var testV = {
     	  get V(){
     	  	return 0;
     	  	}
     	};
     	testV.v = 3;
     	alert(testV.v);//输出3
    }
在Test函数中加入`use strict`关键词将会报错。

**关于this关键字的问题**

    function Test(){
        alert(!this);//false
    }


    function Test(){
        "use strict";
        alert(!this);//true
    }
正常模式下`this`代表全局对象，所以！this会输出false，而在use strict模式下，因为并没有define，所以！this会输出true。

**关于with关键字的问题**

    function Test(){
        var v =1;
        with(this){
     	  v = 3;
     	}
        alert(v);//输出3
    }

     function Test(){
        "use strict";
        var v =1;
        with(this){
     	  v = 3;
     	}
        alert(v);//报错
    }
正如前面讨论关于this在两种情况下的使用情况，这里with的使用可以有一种继承的关系。（个人理解）。

**关于eval的问题**

    function Test(){
     var v = 1;
     alert(eval("var v = 2;v"));//输出2
     alert(v);//输出2
    }

    function Test(){
     "use strict";
     var v = 1;
     alert(eval("var v = 2;v"));//输出2
     alert(v);//输出1
    }
可以看到eval函数本身就有一个作用域，而在正常模式下，eval函数的作用域貌似是全局的，而在use strict模式下，将会严格控制作用域的问题。

**关于use strict摆放位置的问题**

    <script>
     "use strict";
    </sciript>
    ------此种将会在整个js代码中有效-------

    function Test(){
      "use strict";
    }
    ------此种将会在Test函数中有效-------

    （function(){
      "use strict";
    }）();
    ------此种是添加在自运行的匿名函数中使用-------


w3schools上还列出了一些不可以进行定义的保留关键字，列举如下：

`implements`  `interface`  `package`  `private`  `protected`  `public`  `static`  `yield`

总结：原来看语言更新换代再进行探索其中的某项细节也是一个很累的过程，包括之前在测试java8中一些新的特性的时候，不过在这个过程中自己也会逐渐养成对一个语言进行思考的习惯，学会判断一种语言的好坏，如果让你来设计你将会采取怎样的措施。以前写js总是很随意，对于一些注意点并没有多留心，这些天发现自身存在的对细节不去观察的毛病，所以导致很多语言都学习得不深刻，在此记录一下，后续改正。

[测试代码下载](http://mjgao.github.io/assets/testusestrict.rar)

(完)

参考资料
==
> [EcmaScript官方文档](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)

>[w3schools关于use strict模式的讲解](http://www.w3schools.com/js/js_strict.asp)

>[Javascript 严格模式详解](http://www.ruanyifeng.com/blog/2013/01/javascript_strict_mode.html)




