---
layout: post
title: "设计模式的那点事-行为型"
description: "java 设计模式 软件工程思想"
category: 软件思想
tags: [软件思想]
---

写了设计模式的前两章，立即感觉写这玩意确实很累，不过在写的过程中也确实发现在知识点的理解上面还需要进一步，多与实际中的使用多配合，这样才能加深对知识点的理解，下面我们介绍一下行为型中的各个设计模式的简单使用方法。

###Template Method(模板方法模式)

这个东西最好用也最好理解。举几个例子，我们在做ppt或者网页的时候，总是会找一些模板从而减少我们制作或者设计的时间，主要思想就是我们需要一个大体的设计框架，然后我们可以把其中一些具体的设计逻辑延迟到子类当中。思想就是这样，我们来举个我们日常生活中的例子，我们有时候请客吃饭，是吃沙拉呢还是吃意大利面呢？这个当然要看各位主主人的意愿了，所以我们来实现以下。

定义一个主人的抽象类，代码如下：

    package com.test.designpattern.behavior.template;

    public abstract class Host {

	public final void eat(){
		eatFoodType();
	}
	
	abstract public void eatFoodType();
    }

定义A主人的类：

    package com.test.designpattern.behavior.template;

    public class AHost extends Host {

	@Override
	public void eatFoodType() {
		System.out.println("Let's eat sala!");
	}
    }
定义B主人的类：

    package com.test.designpattern.behavior.template;

    public class BHost extends Host {

	@Override
	public void eatFoodType() {
		System.out.println("Let's eat noodles!");
	}
    }

咱们来测试一下：

    package com.test.designpattern.behavior.template;

    public class TestTemplate {
	public static void main(String[] args) {
      Host host = new AHost();
      host.eat();
      
      Host hostb = new BHost();
      hostb.eat();
	}
    }
运行结果：

    Let's eat sala!
    Let's eat noodles!
通过这种设计方式我们就可以很轻松地将一系列的具体实现方法延迟到子类当中，从而在后期调用的时候可以任意添加。

###Strategy(策略模式)

其实刚开始我对这个模式并不是太理解，后来去网上查了一些资料，发现这个模式在算法中使用的很多。定义一个主算法，而用户可以定义自己的算法与主算法进行相互配套使用。看下面这个例子：

定义一个主要的算法类：

    package com.test.designpattern.behavior.stratege;

    public abstract class AbCalculator {

	public int handle(int numa,int numb){
		return numa+numb;
	}
    }

咱们定义一个接口：

    package com.test.designpattern.behavior.stratege;

    public interface MathCalculate {

	public int claculate(int numa,int numb);
    }

用户自定义的算法结构，要配合主算法的使用：
 
    package com.test.designpattern.behavior.stratege;

    public class UserCalculator extends AbCalculator implements MathCalculate {

	@Override
	public int claculate(int numa, int numb) {
		int result = handle(numa, numb);
		return result*result;
	}
    }
咱们测试一下：

    package com.test.designpattern.behavior.stratege;

    public class StrategeTest {

	public static void main(String[] args) {
		int a = 10;
		int b = 1;
		MathCalculate m = new UserCalculator();
		int result = m.claculate(a, b);
		System.out.println(result);	
	}
    }
运行结果为：`121`。

###Observer(观察者模式)

不知道为什么观察者模式是我比较喜欢的一个设计模式，可能是这种设计哲学打动了我，我发现这种思想可以应用在很多方面，比如Android我们做的BroadCast、web中的RSS阅读器等等。下面咱们来模拟一个情节，我们假设学校每个周一校长都要下达一些命令给学生和老师，某些时候可能都是一些相同的消息，则我们定义一个邮件收发器，可以及时收到、更新。看如下的代码示例。

定义一个邮件的接口，其中包括各种方法：

    package com.test.designpattern.behavior.observer;

    public interface Mail {

	public void add(MailHost mh);
	public void notifyGeter();
	public void handle();
    }

再定义一个接口，用于定义接受者的类型与方法：

    package com.test.designpattern.behavior.observer;

    public interface MailHost {

	public void mailSendtoRe();
    }
定义属于学生的接受者：

    package com.test.designpattern.behavior.observer;

    public class StudentGeter implements MailHost {

	@Override
	public void mailSendtoRe() {
		System.out.println("mail is to stu successful");
	}
    }
定义老师接受者：

    package com.test.designpattern.behavior.observer;

    public class TeacherGeter implements MailHost {

	@Override
	public void mailSendtoRe() {
		System.out.println("mail is to tea successful");
	}
    }
定义一个抽象mail类，并且对其中的相关方法进行实现：

    package com.test.designpattern.behavior.observer;

    import java.util.Enumeration;
    import java.util.Vector;

    public abstract class AbMail implements Mail {
 
	Vector<MailHost> v = new Vector<MailHost>();
	@Override
	public void add(MailHost mh) {
		v.add(mh);
	}

	@Override
	public void notifyGeter() {
		Enumeration<MailHost> e = v.elements();
		while(e.hasMoreElements()){
			e.nextElement().mailSendtoRe();
		}
	}
    }

定义发送方，这里指校长：

    package com.test.designpattern.behavior.observer;

    public class SuperHostMail extends AbMail {

	@Override
	public void handle() {
		System.out.println("send the mail");
		notifyGeter();
	}
    }
咱们来测试一下这个模式：

    package com.test.designpattern.behavior.observer;

    public class TestObserver {

	public static void main(String[] args) {
		Mail m = new SuperHostMail();
		m.add(new StudentGeter());
		m.add(new TeacherGeter());
		m.notifyGeter();
	}
    }
运行结果如下：

    mail is to stu successful
    mail is to tea successful
是不是看上去很爽？哈哈

###Iterator(迭代子模式)

学过Java的童鞋都知道这个类，但是在这里是一个设计模式的术语，其实这个模式知道Java中这个玩意的实现的基本上理解起来没有压力，我们来做个小例子：

定义一个Iterator接口：

    package com.test.designpattern.behavior.iterator;

    public interface Iterator<E> {

	public boolean hasNext();
	public E next();
    }

定义一个Collection类：

    package com.test.designpattern.behavior.iterator;

    public interface Collection<E> {

	public Iterator<E> iterator();
	public void add(E o);
	public int size();
	public Object get(int i);
    }

继续，定义一个DefineIterator类来实现Iterator接口：

    package com.test.designpattern.behavior.iterator;

    public class DefineIterator<E> implements Iterator<E> {

	private Collection<E> c;
	int pos = -1;

	public DefineIterator(Collection<E> c) {
		this.c = c;
	}

	@Override
	public boolean hasNext() {
		if (pos < c.size() - 1) {
			return true;
		} else {
			return false;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public E next() {
		if(pos<c.size()-1){
			pos++;
		}
		return (E) c.get(pos);
	}
    }

OK，有了上面的基础，咱们就来实现一个不太完善的ArrayList类：

    package com.test.designpattern.behavior.iterator;

    import java.util.Arrays;

    public class ArrayList<E> implements Collection<E> {
	public  Object[] ob; 
	
	public int maxCapcity;
	
	int size = 0;
	
	int modCnt = 0;
	
	private int minNum = 100;
	
	public ArrayList(int capcity){
		this.ob = new Object[capcity];
		this.maxCapcity = capcity;
	}
	
	public ArrayList(){
		this.ob = new Object[minNum];
	}

	@Override
	public Iterator iterator() {
		return new DefineIterator(this);
	}

	@Override
	public void add(E o) {
		try {
			size = modCnt;
			modCnt++;
			Object[] oldData = ob;
			int oldCapcity = ob.length;
			int newCapcity = (oldCapcity * 3)/2 + 1;//使用原API中的方法
			ob = Arrays.copyOf(ob, newCapcity);
			ob[size] = o;
			//System.out.println("add");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public int size() {
		// TODO Auto-generated method stub
		return size+1;
	}

	@Override
	public Object get(int i) {
		// TODO Auto-generated method stub
		//System.out.println("get"+i);
		return (E)ob[i];
	}
    }

咱们来测试一下：

测试类User类，代码如下：

    package com.test.designpattern.behavior.iterator;

    public class User {

	private int id;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
 	}
    }

测试运行代码：

    package com.test.designpattern.behavior.iterator;

    public class Test {

	public static void main(String[] args) {
		Collection<User> al = new ArrayList<User>();
		for(int i=0;i<5;i++){
			User user =  new User();
			user.setId(i);
			al.add(user);
		}
		
		@SuppressWarnings("unchecked")
		Iterator<User> it = al.iterator();
		
		while(it.hasNext()){
			System.out.println(it.next().getId());
			
		}
	}
    }
运行结果：

    0
    1
    2
    3
    4
感觉就如同原生API中的差不多，突然感到一阵的成就感呀，不过还是与人家有点差距的。

###Chain of Responsibility(责任链模式)

责任链模式大体设计思想就是将各个类的使用状态形成一个类，从而一步步进行下去，我们先来看一个例子：

定义一个Solve接口：

    package com.test.designpattern.behavior.chain;

    public interface Solve {
	public void operation();
    }
定义一个抽象类：

    package com.test.designpattern.behavior.chain;

    public abstract class AbstractSolve {
	private Solve solve;

	public Solve getSolve() {
		return solve;
	}

	public void setSolve(Solve solve) {
		this.solve = solve;
	}
    }
定义一个实现类用于测试：

    package com.test.designpattern.behavior.chain;

    public class UserSolve extends AbstractSolve implements Solve {
	
	private String solveName;

	public UserSolve(String solveName) {
		this.solveName = solveName;
	}

	@Override
	public void operation() {
	
		System.out.println(solveName + " " + "done");
		
		if(null!=getSolve()){
			getSolve().operation();
		}	
	}
    }
咱们来测试一下这个模式：

    package com.test.designpattern.behavior.chain;

    public class TestChain {
	public static void main(String[] args) {
		UserSolve s1 = new UserSolve("mjgao");
		UserSolve s2 = new UserSolve("gemeni");
		UserSolve s3 = new UserSolve("gateskell");
        s1.setSolve(s2);
        s2.setSolve(s3);    
        s1.operation();
	}
    }
运行结果：

    mjgao done
    gemeni done
    gateskell done
是不是就呈现一个链式执行结果？

###Command(命令模式)

说到命令我们肯定就知道将军一个命令下去，到最后将军肯定只关注他的命令有没有被去实现，而不会去关注我这个命令士兵是怎样完成的。这种只关注结果的思想在我们学习考试生涯中让很多人进了坑(呵呵，咱们玩笑一下)。下面咱们看一个简单的例子：

定义一个命令接口：

    package com.test.designpattern.behavior.command;

    public interface Command {

	public void execute();
    }
咱们定义士兵类：

    package com.test.designpattern.behavior.command;

    public class Guard {

	public void receive(){
		System.out.println("have received");
	}
    }
定义将军的命令类：

    package com.test.designpattern.behavior.command;

    public class CommanderCommand implements Command {
	
	private Guard guard;

	public CommanderCommand(Guard guard) {
		this.guard = guard;
	}

	@Override
	public void execute() {
		guard.receive();
	}
    }
定义一个命令的执行器：

    package com.test.designpattern.behavior.command;

    public class Generator {

	private Command command;

	public Generator(Command command) {
		this.command = command;
	}

	public void execute() {
       command.execute();
	}
    }
咱们测试一下：

    package com.test.designpattern.behavior.command;

    public class TestCo {
	public static void main(String[] args) {
        Guard guard = new Guard();
        Command cmd = new CommanderCommand(guard);
        Generator ge = new Generator(cmd);
        ge.execute();
	}
    }
运行结果：

    have received
上述代码可以很简单地就能看出将军只关注最后的反馈，他并不会关心这个任务的过程，专门有执行器对这个任务进行完成传达解析等。

###Memento(备忘模式)

一看到备忘模式，我们自然而然会想到我们平常做的备忘录，总是会把一些将要做的事情添加到备忘录中，这样可以达到及时完成我们需要做的事情，下面我们来简单做一个模拟日志的备忘模式。

先定义一个普通的普通的日志对象，代码如下：

    package com.test.designpattern.behavior.memento;

    public class LogInfo {

	private String content;

	public LogInfo(String content) {
		this.content = content;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	
	public LogMemento createLM(){
		return new LogMemento(content);
	} 
	
	public void retoreLM(LogMemento lm){
		this.content = lm.getContent();
	}	
    }

定义一个日志备忘类的基本信息：

    package com.test.designpattern.behavior.memento;

    public class LogMemento {
	private String content;

	public LogMemento(String content) {
		this.content = content;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
    }
咱们定义一个容器来存储日志备忘系统：

    package com.test.designpattern.behavior.memento;

    public class LogStorage {

	private LogMemento lm;

	public LogStorage(LogMemento lm) {
		this.lm = lm;
	}

	public LogMemento getLm() {
		return lm;
	}

	public void setLm(LogMemento lm) {
		this.lm = lm;
	}
    }
做一个简单的测试：

    package com.test.designpattern.behavior.memento;

    public class Test {
	public static void main(String[] args) {
          LogInfo log = new LogInfo("add a record");
          LogStorage ls = new LogStorage(log.createLM());
          
          System.out.println("The initial content is:"+log.getContent());
          log.setContent("delete a record");
          System.out.println("The modified content is:"+log.getContent());
          
          log.retoreLM(ls.getLm());
          System.out.println("The restored content is:"+log.getContent());      
	}
    }
控制台输出信息如下：

    The initial content is:add a record
    The modified content is:delete a record
    The restored content is:add a record

###State(状态模式)

我们经常玩QQ，所以我们总会看到有些人处于隐身状态，有些人离线等等，所以我思考的状态模式也类似于这种，通过代码来实现以下：

普通状态类：

    package com.test.designpattern.behavior.state;

    public class State {

	private String value;

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
	public void show(){
		System.out.println("I am in!");
	}
	
	public void hide(){
		System.out.println("I am not in!");
	}
    }
定义一个状态切换类：

    package com.test.designpattern.behavior.state;

    public class StateContext {

	private State state;

	public StateContext(State state) {
		this.state = state;
	}

	public State getState() {
		return state;
	}

	public void setState(State state) {
		this.state = state;
	}
	
	public void showState(){
		if(state.getValue().equals("in")){
			state.show();
		}else if(state.getValue().equals("out")){
			state.hide();
		}
	}
    }
咱们来测试一下：

    package com.test.designpattern.behavior.state;

    public class Test {

	public static void main(String[] args) {
		State state = new State();
		StateContext sc = new StateContext(state);
		state.setValue("in");
		sc.showState();
		
		state.setValue("out");
		sc.showState();
		
	}
    }
我们看到打印如下信息：

    I am in!
    I am not in!

###Visitor(访问者模式)

想看这个模式的理论知识的可以去google，这里我利用外公与外孙的关系来模拟一遍这个模式，从而加深点印象。

定义一个被访问者的接口：

    package com.test.designpattern.behavior.visitor;

    public interface Host {

	public void acepet(Visitor visitor);
	public String getVname();
    }
定义一个外公类：

    package com.test.designpattern.behavior.visitor;

    public class Grandfather implements Host {

	@Override
	public void acepet(Visitor visitor) {
		visitor.visit(this);

	}

	@Override
	public String getVname() {
		// TODO Auto-generated method stub
		return "Grandson";
	}
    }
定义一个访问者的接口：

    package com.test.designpattern.behavior.visitor;

    public interface Visitor {

	public void visit(Host host);
    }
定义一个外孙类：

    package com.test.designpattern.behavior.visitor;

    public class Grandsons implements Visitor {

	@Override
	public void visit(Host host) {
		System.out.println("The type of visitor is :"+host.getVname());
	}
    }
写一个测试类：

    package com.test.designpattern.behavior.visitor;

    public class Test {

    public static void main(String[] args) {
		Visitor v = new Grandsons();
		Host h = new Grandfather();
		h.acepet(v);
	}
    }
我们看到打印台输出如下信息：

    The type of visitor is :I am your grandson

###Mediator(中间者模式)

网上有一篇文章是这样来讲解中间者模式的：公司中有员工，员工中有关系而且错综复杂，假如在系统中这无疑在交流上在交流网络上更加紊乱，假如现在有一个中间者，可以通过他，从而不会因为任何一方而使整个环节错乱，我们来实现一下这个环节。

定义一个同事抽象类：

    package com.test.designpattern.behavior.mediator;

    public abstract class Collegue {

	private Mediator mediator;

	public Collegue(Mediator mediator) {
		this.mediator = mediator;
	}
	
	public Mediator getMediator() {
		return mediator;
	}

	public abstract void work();
    }
定义A同事：

    package com.test.designpattern.behavior.mediator;

    public class CollegueA extends Collegue {

	public CollegueA(Mediator mediator) {
		super(mediator);
	}

	@Override
	public void work() {
		System.out.println("Hello,I am collegue A!");
	}
    }
定义B同事：

    package com.test.designpattern.behavior.mediator;

    public class CollegueB extends Collegue {

	public CollegueB(Mediator mediator) {
		super(mediator);
	}

	@Override
	public void work() {
		System.out.println("Hello,I am collegue B!");
	}
    }
定义一个中间者接口：

    package com.test.designpattern.behavior.mediator;

    public interface Mediator {

	public void createMediator();
	public void notifyCollegue();
    }
定义咱公司的中间者：

    package com.test.designpattern.behavior.mediator;

    public class CompanyMediator implements Mediator {
	
	private Collegue cA;
	private Collegue cB;

	@Override
	public void createMediator() {
		cA = new CollegueA(this);
		cB = new CollegueB(this);
	}

	public Collegue getcA() {
		return cA;
	}

	public Collegue getcB() {
		return cB;
	}

	@Override
	public void notifyCollegue() {
		cA.work();
		cB.work();
	}
    }
咱们测试一下：

    package com.test.designpattern.behavior.mediator;

    public class TestMediator {
	public static void main(String[] args) {
       Mediator cm = new CompanyMediator();
       cm.createMediator();
       cm.notifyCollegue();
	}
    }
输出如下信息：

    Hello,I am collegue A!
    Hello,I am collegue B!

###Interpreter(解释器模式)

解释器模式因为时间原因我没有去深入看一下，有空我去查下相关资料，但听说都用在编译器方面，所以感觉还是很高端。下面根据它大体思想我简单模拟一下：

定义一个Num接口：

    package com.test.designpattern.behavior.interpreter;

    public interface Num {
	public int interprete(WrapperNum wn);
    }
定义一个乘法：

    package com.test.designpattern.behavior.interpreter;

    public class Plus implements Num {

	@Override
	public int interprete(WrapperNum wn) {
		return wn.getWna() * wn.getWnb();
	}
    }
定义一个加法：

    package com.test.designpattern.behavior.interpreter;

    public class Plus implements Num {

	@Override
	public int interprete(WrapperNum wn) {
		return wn.getWna() * wn.getWnb();
	}
    }

定义一个封装类，代码如下：

    package com.test.designpattern.behavior.interpreter;

    public class WrapperNum {

	private int wna;
	private int wnb;
	public int getWna() {
		return wna;
	}
	public void setWna(int wna) {
		this.wna = wna;
	}
	public WrapperNum(int wna, int wnb) {
		this.wna = wna;
		this.wnb = wnb;
	}
	public int getWnb() {
		return wnb;
	}
	public void setWnb(int wnb) {
		this.wnb = wnb;
	}
    }
定义一个全局意义上的加法类：

    package com.test.designpattern.behavior.interpreter;

    public class Add implements Num {

	@Override
	public int interprete(WrapperNum wn) {
		return wn.getWna() + wn.getWnb();
	}
    }
咱们来测试一下：

    package com.test.designpattern.behavior.interpreter;

    public class TestInter {
	//2*3+2=8
	public static void main(String[] args) {
		int result = new Add().interprete(new WrapperNum(new Plus().interprete
        (new WrapperNum(2, 3)), 2));
		System.out.println(result);
	}
    }
以上代码算出的是`2*3+2=8`的值。

总结：二十几种设计模式我基本上也算是完成了，但也只是仅仅模拟了一下，所要掌握的知识点还是很多，包括这些这些模式如何在实际开发中国配套使用，我想不是几句话就能完成的，还是需要更多经验，更多的知识背景才能去理解这些东西，而理论的充斥就是为了以后更好地理解这些东西来做一定的铺垫。

(完)

###参考资料

1、[豆瓣所列设计模式的书籍](http://www.douban.com/search?source=suggest&q=%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F)

2、[《设计模式--可复用面向对象软件的基础》](http://book.douban.com/subject/1052241/)

3、[Java之美之设计模式](http://blog.csdn.net/zhangerqing/article/details/8194653)



    





    



 









    







    


    




    



    
























    



    