---
layout: post
title: "javascript中的call和apply"
description: "javascript call apply"
category: javascript
tags: [javascript]
---
前段时间有位朋友发给我一段js程序里面涉及到call和apply，说实话，以前知道这玩意的基本用法，但是还真没仔细去看看是怎么用的，今天试了一下几个简单的demo，在此记录一下，以防后期给忘了。

先看下面的这个简单的程序。

    (function(){
    
    /*
    About the method of(call apply)
    @author MJGao
    @time 2015-01-25 
    */
    
     var People  = function(name){
     
     this.name = name;
     this.getPeoplePro = function(){
        alert(this.name);
     }
    
    }
    
    var Man = function(name){
    this.name = name;
    
    }
    
    var people = new People();
    var man = new Man("man");
    people.getPeoplePro.call(man,'');
    
    })();

我们发现最后输出的结果为:man

当然`people.getPeoplePro.call(man,'');`我们可以改为`people.getPeoplePro.apply(man,[]);`也可以。

其实上面的意思就是说：将people里面的此方法赋予man来使用，而call方法是可以接受一个个的参数，而apply是要接受数组形式的参数。

我们通过这个玩意来写一个关于继承的例子。代码如下：

    (function(){
    
      /*
       About the method of(call apply)
       @author MJGao
       @time 2015-01-25 
     */
     
     var People  = function(name,age){
     this.age = age;
     this.name = name;
     this.getPeoplePro = function(){
        alert(this.name + ':' + this.age);
     }
    
    }
    
     var Man = function(name,age){
     People.call(this,name,age);
    }
    
     var man = new Man('mjgao',20);
    
     man.getPeoplePro();
    
    })();

我们看到输出的结果为：majgao:20

或者我们可以使用apply的写法：

     (function(){
     
      /*
       About the method of(call apply)
       @author MJGao
       @time 2015-01-25 
     */
    
     var People  = function(name,age){
     this.age = age;
     this.name = name;
     this.getPeoplePro = function(){
        alert(this.name + ':' + this.age);
     }
    
    }
    
     var Man = function(name,age){
     People.apply(this,[name,age]);
    }
    
     var man = new Man('mjgao',20);
    
     man.getPeoplePro();
    
    })();

同样可以输出如上的内容。

其实我们还可以将`People.apply(this,[name,age])`改为`People.apply(this,arguments)`也是一样的。

下面我们就来讲讲关于js中arguments的用法。其实学过java的都知道，java中的main函数需要提供相关的参数，而且我们可以获取到的。

看下面一个小例子。

    var People = function(name,age){
      alert(arguments.length);
    }
    
    var p = new People('mjgao',20);

我们可以看到输出结果为2，其实就是输出参数的个数。

我们也可以来访问其中的参数的值。

    var People = function(name,age){
      alert(arguments.length);
      alert(arguments[0]);
    }
    
    var p = new People('mjgao',20);

输出结果为：mjgao.

所以上面apply的例子改为arguments也是可以用的。arguments其实就是一个全局的参数。

写到这里，我还想起js中还有几个有意思的东西，caller和callee。

看几个小demo。

    (function(){
    
      /*
       About the method of(call apply)
       @author MJGao
       @time 2015-01-25 
      */
    
       function get(name,age){
          alert(arguments.callee);
          alert(get.caller);
       }
     
      
       function getA(){
       get('mjgao','20');
      }
     
       getA();
    
    })();

我们会发现get函数中的两个方法第一个会输出get整个代码段，第二个函数会输出getA方法的整个内容，其实callee就是针对于自身而言，而caller是针对于哪些调用了它这个函数来说话的，站的立场就是不一样的。

js其实也是一个很复杂的东西，就看你怎么来用了。其实上述的东西在很多开源项目中基本上很多模块都使用了。后期就要好好来研究这些开源的框架为自己以后打基础。




-----------------EOF------------------





















 









    







    


    




    



    
























    



    