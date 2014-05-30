---
layout: post
title: "Learn Html5_Canvas_2D"
description: "HTML5 Canvas 2D"
category: html5
tags: [html5]
---

记得之前看过一些关于HTML5的相关知识，但是一直认为它只是一个HTML的升级版本，就没有去太关注这个，只是知道它的大体用法，以及出现的新的元素标签等内容。这几天逛了一下W3C，突然发现，原来HTML5中有很多好玩的元素，正好这几天需要坚持更新下博客，所以顺便记录一下自己所练习的东西。底下，我就简单介绍一下我在学习HTML5中的Canvas元素所遇到的一些内容。

`Canvas`其实就是画布的意思，记得之前做一个关于Android上的小玩意的时候，也遇到过这个，对比看了一下，整体操作思想差不多。按照我的理解，其实Canvas就是一个容器，而我们在将这个容器定义完之后，就需要在里面填充东西，就如同我们在使用ps等绘图工具的时候，建立一张画布，然后使用软件提供的例如画笔、蒙版、滤镜等各种东西来设计出我们想要的东西。不同的是一个是使用工具，一个是编码来实现，但是我更想的是，软件也是程序设计出来的，归根到底图像还是代码来实现。

`2D`就是二维的意思。当然还有3D，但是目前没有看那方面的内容，只是知道有一个`WebGL`的概念。

其实，在学习的过程中，我们还会知道SVG(Scalable Vector Graphics)可缩放矢量图，其实是用XML来进行对图像标记的方式，这也让我想起在Android中我们定义一些空间的格式，也会使用xml文件，感觉有异曲同工之意。

下面是摘抄W3C上的一段关于Canvas与SVG进行比较的话：

    Canvas 与 SVG 的比较

    Canvas
    依赖分辨率
    不支持事件处理器
    弱的文本渲染能力
    能够以 .png 或 .jpg 格式保存结果图像 
    最适合图像密集型的游戏，其中的许多对象会被频繁重绘
   
    SVG
    不依赖分辨率
    支持事件处理器
    最适合带有大型渲染区域的应用程序（比如谷歌地图）
    复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快）
    不适合游戏应用
针对于SVG的使用方法，准备在后期来简单学习一下。

接下来，就简单介绍一下Canvas2D中涉及的一些内容。

###入门：如何进行图像的绘画

根据HTML5的规则，我们首先在页面中定义如下：

    <!DOCTYPE HTML>
    <html>
    <body>
        <canvas id="my_cs">Your explorer does not support canvas</canvas>
    </body>
    <html>
我们可以通过css style来定义这块画布的大小，简单原因，我就不进行设置了。

下面，我们使用javascript来进行绘画。

    <script type="text/javascript">
	    var canvas = document.getElementById('my_cs');
	    var ctx = canvas.getContext('2d');
	    ctx.fillStyle = "#cccccc";//填充颜色
	    ctx.fillRect(20,20,60,100);//设置矩形
    </script>
我们将会看见输出如下效果：

<img src="/assets/images/h1.jpg" />

相关流程解释：

首先我们在页面中定义`Canvas`画布，然后我们在js中获得这块画布，并且使用`2D`的形式获得上下文，我们设置一个矩形(20,20:代表设置的图形相对于画布的偏移量，理解为x和y轴；60,80：代表此矩形的长和高)。

下面我们这样设置：

    <script type="text/javascript">
	    var canvas = document.getElementById('my_cs');
	    var ctx = canvas.getContext('2d');
	    ctx.strokeStyle = "red";//设置笔触颜色
	    ctx.strokeRect(20,20,60,100);//无填充矩形
    </script>
我们会看见输出如下效果：

<img src="/assets/images/h2.jpg" />

会发现，第一个是实心矩形，第二个是空心矩形。

###创建路径(Building Paths)

    <script type="text/javascript">
	    var canvas = document.getElementById('my_cs');
	    var ctx = canvas.getContext('2d');
	    ctx.beginPath();//起始路径
	    ctx.strokeStyle = "red";//设置路径样式
        ctx.moveTo(20,20);//设置起始位置
        ctx.lineTo(500,300);//设置路径方向
        ctx.stroke();//绘制已定义的路径，一定要加上，否则无效果
    </script>
我们会看见输出如下效果：

<img src="/assets/images/h3.jpg" />

我们会发现在html5中创建路径的方式很简单，首先要设置起始路径，然后定义坐标轴的起始地点，然后给出路线行走的方向，按照我的理解，其后台程序执行的起始就是一个类似于线性的函数，也许更复杂一点。

再来一种样式：

    <script type="text/javascript">	
	    var canvas = document.getElementById('my_cs');
	    var ctx = canvas.getContext('2d');
	    ctx.beginPath();
	    ctx.strokeStyle = "red";
        ctx.moveTo(20,20);
        ctx.lineTo(20,150);
        ctx.lineTo(70,150);
        ctx.closePath();//从当前点到起始点的闭合
        ctx.stroke();
    </script>
会看到输出如下效果：

<img src="/assets/images/h4.jpg" />

假如我们将`ctx.closePath();`去掉，将会看见如下效果：

<img src="/assets/images/h5.jpg" />

通过这两个图形的对比，我们可以更好地理解`closePath()`函数的含义。

下面我们简单定义一个圆形：

    var canvas = document.getElementById('my_cs');
	var ctx = canvas.getContext('2d');
	ctx.beginPath();
    ctx.arc(100,70,60,0,2*Math.PI);
    ctx.strokeStyle = "red";
    ctx.stroke();//或者用fill()方法
将会看到如下效果：

<img src="/assets/images/h6.jpg" />

这是我在W3C上截的一张关于圆形绘图的说明：

<img src="/assets/images/h7.jpg" />

绘制圆形的相关语法规则如下：

    context.arc(x,y,r,sAngle,eAngle,counterclockwise);

说明：

    参数	描述
    x	圆的中心的 x 坐标
    
    y	圆的中心的 y 坐标
 
    r	圆的半径

    sAngle	起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。

    eAngle	结束角，以弧度计。

    counterclockwise	可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。

###线条样式(Line Style)

    <script type="text/javascript">	
	    var canvas = document.getElementById('my_cs');
	    var ctx = canvas.getContext('2d');
	    ctx.beginPath();
	    ctx.strokeStyle = "red";
        ctx.moveTo(20,20);
        ctx.lineTo(500,300);
        ctx.lineWidth = 5.0;//设置线条的粗细
        ctx.stroke();
    </script>

效果如图所示，可以与上面的进行比较：

<img src="/assets/images/h8.jpg" />

再来看另一种样式：

    <script type="text/javascript">	
	    var canvas = document.getElementById('my_cs');
	    var ctx = canvas.getContext('2d');
	    ctx.beginPath();
	    ctx.strokeStyle = "red";
        ctx.moveTo(20,20);
        ctx.lineTo(500,300);
        ctx.lineWidth = 20.0;//设置线条的粗细
        ctx.lineCap = "round";//可以设置butt or round or square
        ctx.stroke();
    </script>

效果如下所示：

<img src="/assets/images/h9.jpg" />

可以看到`lineCap()`所起到的作用就是对一条路径的结束端点添加指定样式。

###设置字体样式(Text Styles)

        var canvas = document.getElementById('my_cs');
	    var ctx = canvas.getContext('2d');
	    ctx.font = "Bold italic 30px Arial";
	    ctx.textAlign = "center";
	    ctx.fillStyle = "red";
	    ctx.fillText("高木匠",100,50);//设置实心字体
	    ctx.strokeStyle = "red";//设置边框颜色
	    ctx.strokeText("高木匠",100,80);//设置空心字体
具体效果如图所示：

<img src="/assets/images/h10.jpg" />

###画布状态(Canvas State)

每一个上下文包含一个绘画状态栈，绘画状态包含如下几个方面：

    当前的transformation matrix
    
    当前的clipping region

    当前的如下属性值： strokeStyle, fillStyle, globalAlpha, lineWidth, lineCap, 

    lineJoin, miterLimit, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, 

    globalCompositeOperation, font, textAlign, textBaseline.

js方法说明：

    context.restore();//弹出当前栈的顶部状态

    context.save();//将一个状态压到栈中

示例如下：

        var canvas = document.getElementById('my_cs');
	    var ctx = canvas.getContext('2d');
	    ctx.save();
	    ctx.fillStyle = "#cccccc";
	    ctx.fillRect(20,20,100,50);
	    
	    ctx.shadowOffsetX = 5;
	    ctx.shadowOffsetY = 5;
	    ctx.shadowBlur = 10;//设置模糊度
	    ctx.shadowColor = "#000000";//设置阴影颜色
	    
	    ctx.restore();
	    
	    ctx.fillStyle = "red";
	    ctx.fillRect(20,20,100,50);
加与不加`save()`和`restore()`，将会出现如下两个情况：

<img src="/assets/images/h11.jpg" />

<img src="/assets/images/h12.jpg" />
我们会发现阴影效果的生成与缺失与方法有关。


###转换(Transformations)

>transtate()偏移

代码示例：
  
        var canvas = document.getElementById('my_cs');
	    var context = canvas.getContext('2d');
	    context.save();
	    
	    context.fillStyle = "#cccccc";
	    context.fillRect(20,20,50,50);
	    
	    context.restore();
	    context.translate(40,40);//进行转换
	    context.fillStyle = "#000000";
	    context.fillRect(20,20,50,50);

效果如图所示：

<img src="/assets/images/h13.jpg" />
我们发现黑色块位置大小和灰色块一样，但是我们使用了位移，则发生了一定位置的改变。

>setTransform()和transform()

        var canvas = document.getElementById('my_cs');
	    var context = canvas.getContext('2d');
	    context.setTransform(1,0,0,1,0,0);
	    //context.transform(2,0,0,2,0,0);//暂时屏蔽
	    context.fillStyle = "#cccccc";
	    context.fillRect(20,20,50,50);

效果如图：

<img src="/assets/images/h14.jpg" />

当把上面屏蔽的内容解开的时候，效果如下图：

<img src="/assets/images/h15.jpg" />

我们会发现图变大了。根据官网上的解释原理：

首先`context.setTransform(1,0,0,1,0,0)`设置为单位矩阵，然后我们通过`context.transform(2,0,0,2,0,0)`进行变换，我们会发现在页面中位置发生变化，大小发生变化。其实这就是线性代数中通过矩阵相乘的方式得到，根据语法：`transform(a, b, c, d, e, f)`，相乘的矩阵为：

    a	c	e
    b	d	f
    0	0	1

>roate()旋转变换

看下面这段程序：

    var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
    ctx.save();
    ctx.fillStyle = "red";
    ctx.fillRect(80,60,50,50);
    ctx.restore();
    ctx.rotate(30*Math.PI/180);
    ctx.fillStyle = "#cccccc;"
    ctx.fillRect(150,10,50,50);

效果如图所示：

<img src="/assets/images/h18.jpg" />

下面一段程序是在网上看到的，我修改一下，其中用到位移和旋转变换。

     var canvas = document.getElementById('my_cs');
	    var context = canvas.getContext('2d');
	    context.translate(75,75);
      for (var i=1;i<6;i++){
        context.save();
        context.fillStyle = "red";
          for (var j=0;j<i*6;j++){ 
          	  context.rotate(Math.PI*2/(i*6));
              context.beginPath();
              context.arc(0,i*12.5,5,0,Math.PI*2,true);
              context.fill();
         }
        context.restore();
      }
我们会发现效果图如下：

<img src="/assets/images/h16.jpg" />

>scale(x,y)缩放变换

看下面一段程序：

        var canvas = document.getElementById('my_cs');
	    var context = canvas.getContext('2d');
	    context.save();
	    context.fillStyle = "red";
	    context.fillRect(4,4,100,100);
	    context.restore();
	     context.scale(2,2);//缩放两倍
	    context.fillStyle = "#cccccc";
	    context.fillRect(5,5,40,40);

效果图如下所示：

<img src="/assets/images/h17.jpg" />

是不是看起来像盒模型？特别说明的是，对于`scale(arg)`的arg参数，当arg<1,缩小变换；arg>1，放大变换；arg=1，按照原来的像素变换。

###合成(Compositing)

合成的意思就是几个图像进行融合所发生的一系列的情况。而在HTML5的绘图当中，也提供了很多图像合成的方式，看下面几个示例。

以下几个示例，都是蓝色图先绘制，红色图后绘制。

>source-over(default)

看代码示例：

    var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
    ctx.fillStyle = "blue";
    ctx.fillRect(50,50,60,60);
    ctx.fillStyle = "red";
    ctx.fillRect(20,20,60,60);

效果图如下所示：

<img src="/assets/images/h19.JPG" />

可以看到红色块的一部分覆盖在蓝色块上。

>destination-over

代码示例：

    var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
    ctx.fillStyle = "blue";
    ctx.fillRect(50,50,60,60);
    ctx.globalCompositeOperation = "destination-over";//设置覆盖方式
    ctx.fillStyle = "red";
    ctx.fillRect(20,20,60,60);

效果如图所示：

<img src="/assets/images/h20.JPG" />

可以看到蓝色快覆盖在红色块上。

>source-atop

    ctx.globalCompositeOperation = "source-atop";//设置覆盖方式

<img src="/assets/images/h21.JPG" />

>destination-atop

    ctx.globalCompositeOperation = "destination-atop";//设置覆盖方式

<img src="/assets/images/h22.JPG" />

>source-in

    ctx.globalCompositeOperation = "source-in";//设置覆盖方式

<img src="/assets/images/h23.JPG" />

>destination-in

    ctx.globalCompositeOperation = "destination-in";//设置覆盖方式

<img src="/assets/images/h24.JPG" />

>source-out

    ctx.globalCompositeOperation = "source-out";//设置覆盖方式

<img src="/assets/images/h25.JPG" />

>destination-out

    ctx.globalCompositeOperation = "destination-out";//设置覆盖方式

<img src="/assets/images/h26.JPG" />

>lighter

    ctx.globalCompositeOperation = "lighter";//设置覆盖方式

<img src="/assets/images/h27.JPG" />

我们会发现重叠的区域会进行色彩的重新合成，官方称为加色处理

>darker

    ctx.globalCompositeOperation = "darker";//设置覆盖方式

<img src="/assets/images/h28.JPG" />

我们会发现重叠的区域会进行色彩的重新合成，官方称为减色处理

>copy

     ctx.globalCompositeOperation = "copy";//设置覆盖方式

<img src="/assets/images/h29.JPG" />

我们会发现只有新图形会保留下来。

>xor

    ctx.globalCompositeOperation = "xor";//设置覆盖方式

<img src="/assets/images/h30.JPG" />

重叠的部分会保持透明。

>globalAlpha = [=value]设置透明效果

在以上代码中加入：
 
    ctx.globalAlpha = 0.1;

看如下效果：

<img src="/assets/images/h31.JPG" />

我们会发现红色块变成透明效果了，当然这在css中也可以通过filter进行控制。

###设置渐变(Gradient)

我们在ps中都知道渐变这个概念，在html5中分为线性渐变、径向渐变，它们都可以使用代码来进行实现，具体如下。

>线性渐变

可以先看如下代码：

    var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
    var gradient = ctx.createLinearGradient(0,2,420,2);//设置线性渐变
    gradient.addColorStop(0,'rgba(200,0,0,0.8)');
    gradient.addColorStop(0.5,'rgba(0,200,0,0.8)');
    gradient.addColorStop(0,'rgba(200,0,200,0.8)');
    ctx.strokeStyle = "#99dd11";
    ctx.fillStyle = gradient;
    ctx.lineWidth = 10;
    ctx.fillRect(20,20,200,100);
    ctx.strokeRect(20,20,200,100);

`addColorStop(offset,color)`表示在指定位置设置渐变

效果图如下所示：

<img src="/assets/images/h32.JPG" />

>径向渐变

代码如下：

    var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
    var gradient = ctx.createRadialGradient(100,100,20,300,300,80);//设置线性渐变
    gradient.addColorStop(0,'rgba(200,0,0,0.8)');
    gradient.addColorStop(0.5,'rgba(0,200,0,0.8)');
    gradient.addColorStop(0,'rgba(200,0,200,0.8)');
    ctx.strokeStyle = "#99dd11";
    ctx.fillStyle = gradient;
    ctx.lineWidth = 10;
    ctx.fillRect(20,20,200,100);
    ctx.strokeRect(20,20,200,100);

看一下效果图：

<img src="/assets/images/h33.JPG" />

看起来就是一个手电筒效果，绘制过程都有相关的解释，感兴趣的可以到官网上或者找相关资料来看，这里我就不说了。

其实HTML5还涉及到很多内容，例如关于像素的操作、图像的操作等等，这里我就不再赘述了，可以去官网上去看一下具体的怎样来做。但是在学习的过程中，我发现，html5中涉及到如何解析你写的东西，包括如何在底层将这些效果渲染出来，我觉得这才是真正学习好一门知识或者语言的思考方式。

(完)

###参考资料

1、[W3C官方学习网站--html5部分](http://www.w3school.com.cn/tags/html_ref_canvas.asp)

2、[W3C HTML5 2D Canvas标准]()






    
















    
    


  











     















  