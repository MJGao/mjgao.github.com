---
layout: post
title: "全文检索---Lucene的简单应用"
description: "java Lucene 搜索引擎 全文检索"
category: java
tags: [java]
---

Lucene应该是一个很熟悉的框架了，因为一直没有这方面的需求，所以也没去玩这个玩意。今天正好有空，就手动来尝试了一遍，先记下自己的感受：

    开源框架总是在不断地变更版本，所以对于版本地过渡就造成一个问题。有些时候新版本会不兼容老
    版本，而在学习的过程中，我发现Lucene貌似也存在这个问题，网上很多文章都是讲的一些老的版
    本，结果并不是很符合新版本的开发。
下面我来简单mark我利用Lucene做的小实验。Lucene使用的版本是`lucene-4.6.0`。

Lucene是一个全文检索的框架。目前大家都知道有个框架叫hadoop，我在网上查了一下资料，其实就是同一个人架构的。可以看出大师级别的就是不一样。

我记得看过一本搜索引擎入门的书籍，其中讲到搜索引擎中利用的`反向索引`的机制。这个机制主要是针对在海量的文件中，通过关键词如何能够快速地找到所对应的网页、文件、音频等。这种机制的主要思想就是建立词或者短语表，然后通过索引更快确立所查询字段对应的文档。而在建立词或者短语表的时候，使用什么样的手段可以大力减少存储空间，同时如何连接文档，这些成本都是需要被考虑的，本文就不讲解了。

###简单分析

做Java开发的都知道我们在使用一个框架的时候首要就是去官网上下载这个框架从而弄到本地来做开发。同时，我们可以在官网上看一段简单的demo，从而可以按照人家的流程来做自己的开发。

我们可以看到下载下来的包中包含很多文件，这里我们需要这几个文件夹中的文件：
    
    core文件夹下的lucene-core-4.6.0.jar、analysis/common文件夹下的lucene-analyzers-
    common-4.6.0.jar、queryparser文件夹下的lucene-queryparser-4.6.0.jar，假如想使用
    demo，也可以去加载。

全文索引，顾名思义，我们肯定要有索引的文件，才能够去进行索引。

以下程序都是在windows系统下进行操作。

###第一步：建立索引

1、首先我们在F盘下建立文件夹`luceneIndex`并且建立三个文件：a.txt、b.txt、c.txt，同时分别写上如下内容：

    a.txt:算法导论
    b.txt:算法引论
    c.txt:数据结构

2、再在F盘下建立findex文件夹，用来存放索引文件。

2、建立索引机制：

    package com.test.lucene;

    import java.io.BufferedReader;
    import java.io.File;
    import java.io.FileInputStream;
    import java.io.IOException;
    import java.io.InputStreamReader;

    import org.apache.lucene.analysis.Analyzer;
    import org.apache.lucene.analysis.standard.StandardAnalyzer;
    import org.apache.lucene.document.Document;
    import org.apache.lucene.document.Field;
    import org.apache.lucene.document.StringField;
    import org.apache.lucene.document.TextField;
    import org.apache.lucene.index.IndexWriter;
    import org.apache.lucene.index.IndexWriterConfig;
    import org.apache.lucene.store.Directory;
    import org.apache.lucene.store.FSDirectory;
    import org.apache.lucene.util.Version;

    public class TextFileIndexer {
	public static void main(String[] args) throws IOException {
		String indexDir = "F:\\fIndex";
		Directory indexD = FSDirectory.open(new File(indexDir));// store index
        File sdataDir = new File("F:\\luceneIndex");// The dir is to store file
        Analyzer analyzer = new StandardAnalyzer(Version.LUCENE_30);
		IndexWriterConfig iwc = new IndexWriterConfig(Version.LUCENE_30,
				analyzer);
		IndexWriter iw = new IndexWriter(indexD, iwc);

		File[] sFiles = sdataDir.listFiles();

		long startTime = System.currentTimeMillis();
		for (int i = 0; i < sFiles.length; i++) {
			if (sFiles[i].isFile() && sFiles[i].getName().endsWith(".txt")) {
				System.out.println("File" + sFiles[i].getCanonicalPath()
						+ "is indexing");
				Document document = new Document();
				Field pf = new StringField("path", sFiles[i].getPath(),
						Field.Store.YES);
				document.add(pf);
				FileInputStream fis = new FileInputStream(sFiles[i].getCanonicalFile());
				document.add(new TextField("contents", new BufferedReader(new 
                InputStreamReader(fis, "GBK"))));
				iw.addDocument(document);
			}
		}
		long endTime = System.currentTimeMillis();
		System.out.println(endTime - startTime);
		iw.close();
	}
    }

####流程分析

以上的代码其实也彰显了Lucene创建索引的流程，包括如下几个方面：

1、指定文件存储的路径和索引创建的文件夹路径,这里使用了`FSDirectory`，表示一个存储在文件中的索引地址；

2、创建分词器`Analyzer`，进行对内容分词；

3、`IndexWriterConfig`的配置，并且将分词器分装，我看了网上很多人的实现，在以前貌似没有这个步骤；

4、`IndexWriter`，创建索引的一个核心类；

5、`Field`的作用其实就是将一个文档进行分割，比如内容归内容，标题归标题；

6、各个Field组成一个Document，即组成一篇文档。

我们运行这段程序：

     FileF:\luceneIndex\a.txtis in dexing
     FileF:\luceneIndex\b.txtis in dexing
     FileF:\luceneIndex\c.txtis in dexing
     548
同时我们发现findex文件夹生成了很多文件，这些都是索引文件。

###关键词查找

我们先直接看程序，然后在分析：

    package com.test.lucene;

    import java.io.File;
    import java.io.IOException;

    import org.apache.lucene.analysis.Analyzer;
    import org.apache.lucene.analysis.standard.StandardAnalyzer;
    import org.apache.lucene.document.Document;
    import org.apache.lucene.index.DirectoryReader;
    import org.apache.lucene.index.IndexReader;
    import org.apache.lucene.queryparser.classic.ParseException;
    import org.apache.lucene.queryparser.classic.QueryParser;
    import org.apache.lucene.search.IndexSearcher;
    import org.apache.lucene.search.Query;
    import org.apache.lucene.search.ScoreDoc;
    import org.apache.lucene.search.TopDocs;
    import org.apache.lucene.store.FSDirectory;
    import org.apache.lucene.util.Version;

    public class TextFileSearcher {

	public static void main(String[] args) throws IOException, ParseException {
		String queryString = "数据";
		File file = new File("F:\\fIndex");
		FSDirectory dir = FSDirectory.open(file);
		IndexReader reader = DirectoryReader.open(dir);
		Analyzer analyzer  = new StandardAnalyzer(Version.LUCENE_40);
		IndexSearcher is = new IndexSearcher(reader);
		String field = "contents";
		QueryParser qp = new QueryParser(Version.LUCENE_40, field, analyzer);
		Query q = qp.parse(queryString.toLowerCase());
		TopDocs results = is.search(q, 2);
		ScoreDoc[] hits = results.scoreDocs;
		int numTotal = results.totalHits;
		System.out.println("Searching for: " + q.toString(field));
		for(int i=0;i<hits.length;i++){
			Document doc = is.doc(hits[i].doc);
			String path = doc.get("path");
			System.out.println(path);
		}
		System.out.println("The total nummber of the file is:"+numTotal);
		
	}
    }
我们看一下运行结果：

    Searching for: 数据
    F:\luceneIndex\c.txt
    The nummber of the total hit page is:1

我们发现我们利用关键词`数据`，快速搜索出文件所在的位置以及所包含关键词文件的数量。

####流程分析

1、我们要指定索引文件夹的位置，同时进行目录文件的读取；

2、定义需要查找的field,以及`IndexSearcher`；

3、对相关检索词进行解析，并且获得所对应的文档索引。

整体流程就基本上结束了，这就是通过Lucene来快速地检索出文件。它的应用领域也非常广泛，而且现在又有了很多框架，例如Nutch、Hadoop等，所以在大数据的今天掌握这些是提升自己的一个手段。

假如真正深入Lucene这个框架其实还有很多我们需要去了解的，比如其中的索引机制是如何实施的，分词器是如何完成的等等。也许，通过源码才能真正搞清楚人家的算法设计。

(完)

###参考资料

1、[实战 Lucene，第 1 部分: 初识 Lucene](http://www.ibm.com/developerworks/cn/java/j-lo-lucene1/#N10049)

2、[Lucene官网](http://lucene.apache.org/)






    



   








 









    







    


    




    



    
























    



    