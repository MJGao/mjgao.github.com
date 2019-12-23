---
layout: post
title: "Eureka Server端源码分析"
description: "learn eureka arch"
category: eureka
tags: [eureka]
---
上一篇我们对Eureka整体的架构，以及设计一款注册中心的产品需要我们去思考哪些内容做了一个简单的阐述，这一篇简单地通过对Eureka服务源码的分析，来看看Eureka服务端的设计的思路。

#### 1、如何设计注册中心的服务端
在阐述源码设计思路之前，我们还是按照之前的那种思考的方式，来思考一下，如果我们来设计一个注册中心的服务端，我们需要去思考哪些内容。

首先先阐述这么几个思考过程：

>既然我们要做服务端，那么其肯定开启后会不停地接收客户端的应用；

 那么其肯定也会有端口号以及属于它的启动过程；

 正如上一篇所说，多个服务端节点之间肯定也会做通信进行心跳交互；

..........

那么，我们就先从Eureka的服务端的启动过程说起。

做过web开发的同学应该都知道，既然要启动我们的应用，那么肯定是需要类似于tomcat或者apache这样的服务器进行搭载，然后依靠他们的启动带动我们所开发的应用的启动，整个应用的运行都在这些服务器容器中。那么，Eureka是如何来的呢？

#### 2、谈谈Eureka服务端的启动过程

Eureka其实提供了两种启动的方式，你可以使用jar的形式，也可以将其部署到tomcat。

我们可以看到在eureka-server的web模块下有一个web.xml文件，其中有一块初始化的内容，如下：

    <listener>
       <listener-class>com.netflix.eureka.EurekaBootStrap</listener-class>
    </listener>

同时，我们可以看到eureka-core-jersey2的模块中有一个启动类Jersey2EurekaBootStrap，其集成了EurekaBootStrap，所以猜想EurekaBootStrap应该就是Eureka服务端的启动类。下面就简单来分析一下。


    public class EurekaBootStrap implements ServletContextListener {
     
        public EurekaBootStrap() {
          this(null);
        }
     
        public EurekaBootStrap(EurekaClient eurekaClient) {
          this.eurekaClient = eurekaClient;
        }
     
        @Override
        public void contextInitialized(ServletContextEvent event) {
          try {
            initEurekaEnvironment();
            initEurekaServerContext();
     
            ServletContext sc = event.getServletContext();
            sc.setAttribute(EurekaServerContext.class.getName(), serverContext);
          } catch (Throwable e) {
            logger.error("Cannot bootstrap eureka server :", e);
            throw new RuntimeException("Cannot bootstrap eureka server :", e);
          }
        }
    }
    
如上的代码是EurekaBootStrap启动过程的一段代码，从中我们可以看到其本身还是依赖于serverlet容器，并没有自己来实现一个服务端启动和监控的功能，另外，我们看初始化，包含如下几个过程：

    initEurekaEnvironment()
    
初始化环境信息。所谓的初始化环境信息，就是将你在配置文件中配置的比如端口号、region、zone、同步的serviceUrl信息等值进行解析并加载到容器中。

    initEurekaServerContext()
    
初始化Eureka服务端上下文环境。这个是服务端做初始化最核心的一块内容。

接下来我们重点分析一下initEurekaServerContext()的过程。

    protected void initEurekaServerContext() throws Exception {
        EurekaServerConfig eurekaServerConfig = new DefaultEurekaServerConfig();
     
        ServerCodecs serverCodecs = new DefaultServerCodecs(eurekaServerConfig);
     
        ApplicationInfoManager applicationInfoManager = null;
     
        if (eurekaClient == null) {
          EurekaInstanceConfig instanceConfig = isCloud(ConfigurationManager.getDeploymentContext())
          ? new CloudInstanceConfig()
          : new MyDataCenterInstanceConfig();
     
          applicationInfoManager = new ApplicationInfoManager(
          instanceConfig, new EurekaConfigBasedInstanceInfoProvider(instanceConfig).get());
     
          EurekaClientConfig eurekaClientConfig = new DefaultEurekaClientConfig();
          eurekaClient = new DiscoveryClient(applicationInfoManager, eurekaClientConfig);
        } else {
          applicationInfoManager = eurekaClient.getApplicationInfoManager();
        }
     
        PeerAwareInstanceRegistry registry;
        if (isAws(applicationInfoManager.getInfo())) {
          registry = new AwsInstanceRegistry(
                         eurekaServerConfig,
                         eurekaClient.getEurekaClientConfig(),
                         serverCodecs,
                         eurekaClient
                     );
          awsBinder = new AwsBinderDelegate(eurekaServerConfig, eurekaClient.getEurekaClientConfig(), registry, applicationInfoManager);
          awsBinder.start();
        } else {
          registry = new PeerAwareInstanceRegistryImpl(
                         eurekaServerConfig,
                         eurekaClient.getEurekaClientConfig(),
                         serverCodecs,
                         eurekaClient
                     );
       }
     
        PeerEurekaNodes peerEurekaNodes = getPeerEurekaNodes(
                                          registry,
                                          eurekaServerConfig,
                                          eurekaClient.getEurekaClientConfig(),
                                          serverCodecs,
                                          applicationInfoManager
                                          );
     
        serverContext = new DefaultEurekaServerContext(
                                    eurekaServerConfig,
                                    serverCodecs,
                                    registry,
                                    peerEurekaNodes,
                                    applicationInfoManager
                                    );
     
        EurekaServerContextHolder.initialize(serverContext);
        serverContext.initialize();
        int registryCount = registry.syncUp();
        registry.openForTraffic(applicationInfoManager, registryCount);
        EurekaMonitors.registerAllStats();
    }
    
如上代码是我从这个方法中摘除的一部分，之前说过，Eureka本身就是网飞送给spring社区的产品，网飞当年和亚马逊云AWS有深入的合作，所以在代码中也是有不少关于AWS云的痕迹，在看源码的过程中其实可以忽略。下面我们只看重点。

    registry = new PeerAwareInstanceRegistryImpl(
 
          eurekaServerConfig,
 
          eurekaClient.getEurekaClientConfig(),
 
          serverCodecs, eurekaClient );
          
这个类主要的职责就是初始化注册中心实例，其核心内容包含如下的过程：

    public void init(PeerEurekaNodes peerEurekaNodes) throws Exception {
        this.numberOfReplicationsLastMin.start();
        this.peerEurekaNodes = peerEurekaNodes;
        initializedResponseCache();
        scheduleRenewalThresholdUpdateTask();
        initRemoteRegionRegistry();
     
        try {
          Monitors.registerObject(this);
        } catch (Throwable e) {
          logger.warn("Cannot register the JMX monitor for the InstanceRegistry :", e);
        }
    }
    
第一步：

初始化服务信息的缓存信息。其会通过guava创建一个只读缓存，以及通过ConcurrentHashMap创建一个读写缓存，主要存放服务的信息。比如服务信息的上线、删除、下线等，都会通过批处理定时对这个缓存进行更新，同时其也提供获取操作，客户端拿取每一个服务的信息其实就是从这些缓存中进行获取，因本篇只是作为抛砖引玉的作用，所以感兴趣的可以去深入研究。

第二步：

执行并更新续约任务的阈值。

第三步：

初始化远程Region中的注册中心的信息。这里有一个知识点的储备，就是Region、Zone的概念，这个其实也不是Eureka中独有的概念，熟悉一些网络架构的或者了解机房建设的同学，其实应该就能够了解这些内容。

接下来，我们来看一下Eureka是如何来获取各个注册节点的信息以及它们之间是如何来进行交互的。

    PeerEurekaNodes peerEurekaNodes = getPeerEurekaNodes( registry, eurekaServerConfig, eurekaClient.getEurekaClientConfig(), serverCodecs, applicationInfoManager );

如上的代码就是获取Eureka各个节点的信息。我们深入到里面去看一下。

    protected PeerEurekaNodes getPeerEurekaNodes(PeerAwareInstanceRegistry registry, EurekaServerConfig eurekaServerConfig, EurekaClientConfig eurekaClientConfig, ServerCodecs serverCodecs, ApplicationInfoManager applicationInfoManager) {
        PeerEurekaNodes peerEurekaNodes = new PeerEurekaNodes(
                                              registry,
                                              eurekaServerConfig,
                                              eurekaClientConfig,
                                              serverCodecs,
                                              applicationInfoManager
                                              );
     
        return peerEurekaNodes;
    }
    
如上是PeerEurekaNodes实例化的过程。我们再继续看。

    public void start() {
        taskExecutor = Executors.newSingleThreadScheduledExecutor(
         new ThreadFactory() {
           @Override
           public Thread newThread(Runnable r) {
              Thread thread = new Thread(r, "Eureka-PeerNodesUpdater");
              thread.setDaemon(true);
              return thread;
           }
         }
        );
        try {
          updatePeerEurekaNodes(resolvePeerUrls());
          Runnable peersUpdateTask = new Runnable() {
              @Override
              public void run() {
                try {
                   updatePeerEurekaNodes(resolvePeerUrls());
                } catch (Throwable e) {
                   logger.error("Cannot update the replica Nodes", e);
                }
     
              }
           };
         taskExecutor.scheduleWithFixedDelay(
                             peersUpdateTask,
                             serverConfig.getPeerEurekaNodesUpdateIntervalMs(),
                             serverConfig.getPeerEurekaNodesUpdateIntervalMs(),
                             TimeUnit.MILLISECONDS
                             );
         } catch (Exception e) {
               throw new IllegalStateException(e);
         }
         for (PeerEurekaNode node : peerEurekaNodes) {
               logger.info("Replica node URL: {}", node.getServiceUrl());
         }
    }
    
如上的代码所展示的过程就是Eureka节点启动的一个过程。其主要职责就是创建一个定时任务线程池，对每个节点的信息进行更新。

我们看一下 `updatePeerEurekaNodes(resolvePeerUrls())`的主要的功能。

    newNodeList.add(createPeerEurekaNode(peerUrl));
    
如上这段代码是updatePeerEurekaNodes(resolvePeerUrls())最核心的一个功能，其目标主要在于解析新的节点加入到列表中。

如下是`createPeerEurekaNode(peerUrl)`核心的功能代码。

    protected PeerEurekaNode createPeerEurekaNode(String peerEurekaNodeUrl) {
       HttpReplicationClient replicationClient = JerseyReplicationClient.createReplicationClient(serverConfig, serverCodecs, peerEurekaNodeUrl);
       String targetHost = hostFromUrl(peerEurekaNodeUrl);
       if (targetHost == null) {
         targetHost = "host";
       }
       return new PeerEurekaNode(registry, targetHost, peerEurekaNodeUrl, replicationClient, serverConfig);
    }
    
首先根据提供的服务地址以及配置信息创建一个http客户端。

然后，获得目标主机的信息。

通过如上创建的http客户端以及所获得的目的主机的信息，初始化每一个Eureka节点。

下面看一下每一个Eureka节点的初始化过程。

    this.registry = registry;
    this.targetHost = targetHost;
    this.replicationClient = replicationClient;
     
    this.serviceUrl = serviceUrl;
    this.config = config;
    this.maxProcessingDelayMs = config.getMaxTimeForReplication();
     
    String batcherName = getBatcherName();
    ReplicationTaskProcessor taskProcessor = new ReplicationTaskProcessor(targetHost, replicationClient);
    this.batchingDispatcher = TaskDispatchers.createBatchingTaskDispatcher(
                                               batcherName,
                                               config.getMaxElementsInPeerReplicationPool(),
                                               batchSize,
                                               config.getMaxThreadsForPeerReplication(),
                                               maxBatchingDelayMs,
                                               serverUnavailableSleepTimeMs,
                                               retrySleepTimeMs,
                                               taskProcessor
                                              );
    this.nonBatchingDispatcher = TaskDispatchers.createNonBatchingTaskDispatcher(
                                               targetHost,
                                               config.getMaxElementsInStatusReplicationPool(),
                                               config.getMaxThreadsForStatusReplication(),
                                               maxBatchingDelayMs,
                                               serverUnavailableSleepTimeMs,
                                               retrySleepTimeMs,
                                               taskProcessor
                                              );
                                              
根据目标主机以及所创建的同步客户端，生成一个注册中心之间做同步的Task，而在每一个注册中心的节点中包含如下的系列操作：

A、注册中心服务实例的注册：主要用于进行多个注册中心之间实例的注册同步；

B、注册中心服务实例的删除：用于多个注册中心之间服务实例的删除同步操作；

C、心跳检测：用于多个注册中心之间进行心跳检测操作，即存活性判断检测；

D、状态的更新：顾名思义，就是用于多个注册中心进行服务状态同步的操作。

以上几个主要的核心功能，主要由如上代码所生成的TaskProcessor任务执行器来执行，所生成的任务执行器其实就是一个统一的线程池，根据不同的任务执行不同的同步操作。

如上的代码即是一个注册中心的实例节点的核心流程。

那么整个的启动过程是哪里进行的呢？

我们可以看到在EurekaBootStrap的启动过程中会执行EurekaServerContextHolder.initialize(serverContext)操作，我们看一下它里面的过程：

    @PostConstruct
    @Override
    public void initialize() {
        logger.info("Initializing ...");
        peerEurekaNodes.start();
        try {
           registry.init(peerEurekaNodes);
        } catch (Exception e) {
           throw new RuntimeException(e);
        }
        logger.info("Initialized");
    }
    
从以上可以看出，进行了节点的初始化工作，最后进行整个注册中心的初始化的过程。

如上就是Eureka真个服务端的启动的过程。


-----------------EOF------------------





















 









    







    


    




    



    
























    



    