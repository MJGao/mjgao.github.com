---
layout: post
title: "通过HttpClient学Http协议"
description: "HTTP协议 HttpClient"
category: HTTP
tags: [HTTP]
---

我记得有一本书是专门讲http协议的，自己貌似很久之前看过但是忘记书名了。

这几天一直在研究公司的项目代码，当然都是以前一些老员工和外包的一起组队开发的，整体看下来，确实是叫人吐血，我不知道经理怎么这么相信，把这么大的项目代码给我看，不知道我是新手小菜鸟吗？

在研究源码的过程中，得到了很多启发，这里借用写这篇文章的机会就mark一下：

>如何研究源码

>>记得上周拿到这份源码的时候，我一看，天啦，简直不是人看的，几百兆的大小，我在学校写的项目最大也就几十兆啊，好吧，那就硬着头皮看吧。后来发现商业源码中模块都划分地很清楚，不过你倒是给我写点注释吧。这提醒我，以后写代码要注释。

>遇到没用过的东西怎么办

>>说实话我在这个项目里面看见了若干我没用过的东西，关于网络、进程通信、有关Android中API的等等，还有很多开源技术以前也没碰过，这下麻烦来了，我记得当时我汗都出来了，后来没办法，那就查吧，能怎么办呢？查不到的就问，反正公司牛人多。

在看Android项目的时候我发现其中对于网络资源的处理都是使用的HttpClient这个开源框架，以前确实见到过，但是自己崇尚什么轮子都自己造的原则，就从来没使用过，后来发现这玩意功能确实挺强大，而且可以借助它来温习一下基本的Http协议的知识了。

对于Http是个什么东西，我想这个大家每天上网应该都用到吧。而对于它涉及到哪些东西，我就不一一说明了，可以使用最先进的搜索引擎-百度一下就知道了。当然底下我也会涉及到其中的一些知识点。

##HttpClient--Get方法

既然是实验驱动，我就直接上代码了，过多的理论知识只是为实践来进行铺垫的。

    package com.hc.test;

    import java.io.IOException;

    import org.apache.http.Header;
    import org.apache.http.HttpEntity;
    import org.apache.http.HttpResponse;
    import org.apache.http.client.ClientProtocolException;
    import org.apache.http.client.HttpClient;
    import org.apache.http.client.methods.HttpGet;
    import org.apache.http.impl.client.DefaultHttpClient;
    import org.apache.http.util.EntityUtils;

    public class TestGet {

	public static void main(String[] args) {
		System.out.println("----Test the HttpGet method----");
		HttpClient client = new DefaultHttpClient();
		HttpGet get = new HttpGet("http://www.xiami.com");
		System.out.println("I am accessing the site:" + get.getURI());
		System.out.println("-------------------");
		try {
			HttpResponse res = client.execute(get);
			
			Header[] header = res.getAllHeaders();
			for(int i=0;i<header.length;i++){
				System.out.println(header[i]);
			}
			
			System.out.println(res.getStatusLine());
			HttpEntity entities = res.getEntity();
			System.out.println("The content type is:"					
                 + entities.getContentType());
			System.out.println(entities.getContentEncoding());
			System.out.println("------------------");
			// System.out.println(EntityUtils.toString(entities));
			System.out.println("The contentlength is:"					
                 + EntityUtils.toByteArray(entities).length);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
    }

看一下打印台会输出一些什么东西。

     ----Test the HttpGet method----
    I am accessing the site:http://www.xiami.com
     -------------------
    Server: Tengine
    Date: Thu, 23 Oct 2014 13:03:22 GMT
    Content-Type: text/html; charset=utf-8
    Transfer-Encoding: chunked
    Connection: keep-alive
    Vary: Accept-Encoding
    Vary: Accept-Encoding
    Vary: Accept-Encoding
    Set-Cookie: _xiamitoken=54f8ae; expires=Wed, 29-
    Oct-2014 21:00:00 GMT; path=/; domain=.xiami.com
    Set-Cookie: _unsign_token=f4
    Oct-2015 21:00:00 GMT; path=/; domain=.xiami.com; httponly
    Cache-Controli: must-revalidate
    Pragma: no-cache
    HTTP/1.1 200 OK
    The content type is:Content-Type: text/html; charset=utf-8
     null
     ------------------
    The contentlength is:71893

我们可以打开浏览器的控制台，当访问一个网站的时候也会输出这些信息，其实这就是当在客户端输入一个网址的时候在网络中所发生的情况。

不知道看到这个`HTTP/1.1 200 OK`大家熟悉没有，这就表明我们的请求是成功的，大家可能还见过404,303等等各种状态码吧，想了解各种状态码的意思可以[参见这篇文章](http://baike.baidu.com/view/1628025.htm?from_id=1276942&type=syn&fromtitle=HTTP%E5%8D%8F%E8%AE%AE&fr=aladdin),里面都列示得很清楚。

##HttpClient--Post方法

我们有些时候在访问一些网页的时候都会带很多的参数，比如我们在访问虾米音乐的时候，想搜索当年情这首歌，那么我们肯定在搜索框中填入当年情，而链接发生什么情况呢？就是这样的`http://www.xiami.com/search?key=当年情&pos=1`

那么需求就来了，假如我们想要把虾米音乐关于当年情这首歌有哪些人唱过的信息给挖掘搜集一下，那么我们该怎么办呢？

可以看下面这块代码

    package com.hc.test;

    import java.io.IOException;
    import java.io.UnsupportedEncodingException;
    import java.util.ArrayList;
    import java.util.List;

    import org.apache.http.HttpResponse;
    import org.apache.http.NameValuePair;
    import org.apache.http.client.ClientProtocolException;
    import org.apache.http.client.HttpClient;
    import org.apache.http.client.entity.UrlEncodedFormEntity;
    import org.apache.http.client.methods.HttpPost;
    import org.apache.http.impl.client.DefaultHttpClient;
    import org.apache.http.message.BasicNameValuePair;
    import org.apache.http.util.EntityUtils;

     public class TestPost {

	public static void main(String[] args) throws UnsupportedEncodingException{
		System.out.println("----Test the post method----");
		HttpClient client = new DefaultHttpClient();
		String url = "http://www.xiami.com";
		HttpPost post = new HttpPost(url);
		List<NameValuePair> qList = new ArrayList<NameValuePair>();
		
		qList.add(new BasicNameValuePair("key", "当年情"));
		qList.add(new BasicNameValuePair("pos", "1"));
		post.setEntity(new UrlEncodedFormEntity(qList));
		System.out.println(post.getURI());
		HttpResponse res;
		try {
			res = client.execute(post);
			System.out.println(EntityUtils.toString(res.getEntity()));
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally{
			post.releaseConnection();
		}
		
	}
    }

我就不贴控制台的信息了，毕竟我没进行网页内容关键信息的解析，内容太多了，有兴趣的可以去尝试一下。

##HttpClient--Proxy方法

我们来回想一下代理。有些时候我们输入的一个地址实际解析的却是另外一个不同的地方，我们通过它可以绕过一些检查到达我们要的目的地。那么我们如何实现呢？

    package com.hc.test;

    import java.io.IOException;

    import org.apache.http.Header;
    import org.apache.http.HttpEntity;
    import org.apache.http.HttpHost;
    import org.apache.http.HttpResponse;
    import org.apache.http.client.ClientProtocolException;
    import org.apache.http.client.HttpClient;
    import org.apache.http.client.methods.HttpGet; 
    import org.apache.http.conn.params.ConnConnectionPNames;
    import org.apache.http.conn.params.ConnRoutePNames;
    import org.apache.http.impl.client.DefaultHttpClient;
    import org.apache.http.util.EntityUtils;

    public class TestProxy {

	public static void main(String[] args) {
		System.out.println("----Test the proxy method----");
		HttpClient client = new DefaultHttpClient();
		HttpHost proxy = new HttpHost("localhost", 80, "http");
		HttpHost target = new HttpHost("www.xiami.com",80,"http");
		HttpGet req = new HttpGet("/");
		client.getParams().setParameter(ConnRoutePNames.DEFAULT_PROXY,proxy);
		
		try {
			HttpResponse res =  client.execute(target, req);
			System.out.println(res.getStatusLine());
			
			Header[] headers = res.getAllHeaders();
			for(int i=0;i<headers.length;i++){
				System.out.println(headers[i]);
			}
			
			HttpEntity entity = res.getEntity();
			if(null!=entity){
				System.out.println(EntityUtils.toString(entity));
			}
			
			
			
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
	}
    }

看一下控制台的信息

     ----Test the proxy method----
    HTTP/1.1 200 OK
    Date: Thu, 23 Oct 2014 13:41:42 GMT
    Server: Apache/2.2.22 (Win32) PHP/5.3.5
    X-Powered-By: PHP/5.3.5
    Content-Length: 46
    Content-Type: text/html
    gx</br>xkj</br>gxxkjlyh</br>mayun</br>gaoxiang

我刚开始没明白，怎么输入的是这个信息，后来发现我的php服务器没有关掉，导致这个原因了。

其实HttpClient将关于http协议的大多内容都包含进去了，包括delete、trace等操作，同时还引入了多线程访问的模式，看了一下近几个release的代码，貌似还对Android平台专门出了一个开源框架。

就这样，还有很多东西留着以后写，比如关于http的管理，连接的管理，再深入点就是这玩意是如何实现的，有没有发现这些工程师确实是很强大？

(完)



















                 
