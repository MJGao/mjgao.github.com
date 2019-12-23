---
layout: post
title: "Eureka Client端源码分析"
description: "learn eureka arch"
category: eureka
tags: [eureka]
---
这篇我们来对Eureka客户端的源码做一个分析。

首先我们我们可以看平时的一个使用场景，见如下的图：

<img src="/assets/images/eureka-learn0104.png" />

那么这个EnableDiscoveryClient的注解是在哪里实现的呢？

首先需要解释的是，这个其实是springboot的AutoConfigration的一种特性，即无需我们以前那种大量xml配置文件的配置形式。目前大家所看到的很多starter也是使用此方式来实现。我们快速看一下spring.factories中的信息(这里面会涉及到部分的springboot的基础知识，如果不太熟悉的需要自行去学习)，我们可以看到里面有一个类：org.springframework.cloud.netflix.eureka.EurekaDiscoveryClientConfiguration，如下是此类中部分的代码：

    @Configuration
    @ConditionalOnClass(RefreshScopeRefreshedEvent.class)
    protected static class EurekaClientConfigurationRefresher
    implements ApplicationListener<RefreshScopeRefreshedEvent> {
     
      @Autowired(required = false)
      private EurekaClient eurekaClient;
     
      @Autowired(required = false)
      private EurekaAutoServiceRegistration autoRegistration;
     
      public void onApplicationEvent(RefreshScopeRefreshedEvent event) {
      // This will force the creation of the EurkaClient bean if not already created
      // to make sure the client will be reregistered after a refresh event
        if (eurekaClient != null) {
          eurekaClient.getApplications();
        }
        if (autoRegistration != null) {
      // register in case meta data changed
          this.autoRegistration.stop();
          this.autoRegistration.start();
        }
      }
    }
    
从以上代码我们可以知道，我们可以看到其会随着spring容器初始化，而进行客户端的调用过程，调用的方式为：eurekaClient.getApplications()。所以这下我们就可以去重点分析一下Eureka中客户端的源码情况了。

通过代码我们看到，EurekaClient是一个接口，其继承自LookupService接口，而实现EurekaClient的实现类为：DiscoveryClient，接下来我们分析下此类中的几个核心的流程，如下的代码都是摘取的部分核心功能，对全部流程感兴趣的可以自行下载Eureka的源码进行分析。

    //..........
    scheduler = Executors.newScheduledThreadPool(2,
    new ThreadFactoryBuilder()
    .setNameFormat("DiscoveryClient-%d")
    .setDaemon(true)
    .build());
     
    heartbeatExecutor = new ThreadPoolExecutor(
    1, clientConfig.getHeartbeatExecutorThreadPoolSize(), 0, TimeUnit.SECONDS,
    new SynchronousQueue<Runnable>(),
    new ThreadFactoryBuilder()
    .setNameFormat("DiscoveryClient-HeartbeatExecutor-%d")
    .setDaemon(true)
    .build()
    );
     
    cacheRefreshExecutor = new ThreadPoolExecutor(
    1, clientConfig.getCacheRefreshExecutorThreadPoolSize(), 0, TimeUnit.SECONDS,
    new SynchronousQueue<Runnable>(),
    new ThreadFactoryBuilder()
    .setNameFormat("DiscoveryClient-CacheRefreshExecutor-%d")
    .setDaemon(true)
    .build()
    );
     
    eurekaTransport = new EurekaTransport();
    scheduleServerEndpointTask(eurekaTransport, args);
     
    //...........
    initScheduledTasks();
    
以上代码进行了如下的一些初始化的工作：

1、生成一个统一的调度器Scheduler；

2、创建一个心跳检测的线程池；

2、创建一个任务缓存更新的线程池；

3、创建Eureka客户端与服务端通信的传输器；

4、开启与Server端的通信管道；

5、设置并开启心跳检测、任务本地缓存更新的定时任务。

我们先看一下心跳检测的过程。

客户端对服务端的心跳检测，也叫做”续约(renew)“的一个过程。其根据客户端或者默认的90s时间定时周期性地进行心跳检测操作。如下是代码的实现分析：

    boolean renew() {
       EurekaHttpResponse<InstanceInfo> httpResponse;
       try {
          httpResponse = eurekaTransport.registrationClient.sendHeartBeat(instanceInfo.getAppName(), instanceInfo.getId(), instanceInfo, null);
          logger.debug(PREFIX + "{} - Heartbeat status: {}", appPathIdentifier, httpResponse.getStatusCode());
          if (httpResponse.getStatusCode() == Status.NOT_FOUND.getStatusCode()) {
            REREGISTER_COUNTER.increment();
            logger.info(PREFIX + "{} - Re-registering apps/{}", appPathIdentifier, instanceInfo.getAppName());
            long timestamp = instanceInfo.setIsDirtyWithTime();
            boolean success = register();
            if (success) {
              instanceInfo.unsetIsDirty(timestamp);
            }
           return success;
          }
          return httpResponse.getStatusCode() == Status.OK.getStatusCode();
       } catch (Throwable e) {
          logger.error(PREFIX + "{} - was unable to send heartbeat!", appPathIdentifier, e);
          return false;
       }
    }
    
从如上的代码我们可以看到，客户端拿到本应用的实例信息通过Eureka与服务端的交互管道进行heatbeat通讯。

会包括如下的流程：

1、如果接收到心跳的返回状态是OK的话，那么就代表心跳交互成功；

2、如果服务端返回的状态码是”NOT_FOUND“，那么会进行一个服务注册的过程。服务注册的过程见如下的代码：

    boolean register() throws Throwable {
       logger.info(PREFIX + "{}: registering service...", appPathIdentifier);
       EurekaHttpResponse<Void> httpResponse;
       try {
          httpResponse = eurekaTransport.registrationClient.register(instanceInfo);
       } catch (Exception e) {
          logger.warn(PREFIX + "{} - registration failed {}", appPathIdentifier, e.getMessage(), e);
          throw e;
       }
       if (logger.isInfoEnabled()) {
          logger.info(PREFIX + "{} - registration status: {}", appPathIdentifier, httpResponse.getStatusCode());
       }
       return httpResponse.getStatusCode() == Status.NO_CONTENT.getStatusCode();
    }
    
从以上的代码可以看出，整个注册的过程也是走的Eureka客户端与服务端专门的交互管道。

我们再看一下客户端服务信息本地缓存更新的方法说明。

    void refreshRegistry() {
       try {
       //........
     
          boolean success = fetchRegistry(remoteRegionsModified);
          if (success) {
            registrySize = localRegionApps.get().size();
            lastSuccessfulRegistryFetchTimestamp = System.currentTimeMillis();
          }
       } catch (Throwable e) {
          logger.error("Cannot fetch registry from server", e);
       }
    }
    
以上代码是缓存更新的核心的代码，主要做的工作就是获取注册中心的服务的信息。如下是获取的详细的过程。

    private boolean fetchRegistry(boolean forceFullRegistryFetch) {
       Stopwatch tracer = FETCH_REGISTRY_TIMER.start();
     
       try {
         Applications applications = getApplications();
     
         if (clientConfig.shouldDisableDelta()
           || (!Strings.isNullOrEmpty(clientConfig.getRegistryRefreshSingleVipAddress()))
           || forceFullRegistryFetch
           || (applications == null)
           || (applications.getRegisteredApplications().size() == 0)
           || (applications.getVersion() == -1)) //Client application does not have latest library supporting delta
         {
           getAndStoreFullRegistry();
         } else {
           getAndUpdateDelta(applications);
         }
        applications.setAppsHashCode(applications.getReconcileHashCode());
       } catch (Throwable e) {
          return false;
       } finally {
          if (tracer != null) {
             tracer.stop();
          }
       }
       onCacheRefreshed();
       updateInstanceRemoteStatus();
       return true;
    }
    
首先getApplications()获取客户端本地缓存的所有的服务信息，接下来分为两个过程，我的理解其实就是做增量更新还是全量更新的操作。

先看全量更新getAndStoreFullRegistry()。代码如下：

    private void getAndStoreFullRegistry() throws Throwable {
       long currentUpdateGeneration = fetchRegistryGeneration.get();
     
       logger.info("Getting all instance registry info from the eureka server");
     
       Applications apps = null;
       EurekaHttpResponse<Applications> httpResponse = clientConfig.getRegistryRefreshSingleVipAddress() == null
       ? eurekaTransport.queryClient.getApplications(remoteRegionsRef.get())
       : eurekaTransport.queryClient.getVip(clientConfig.getRegistryRefreshSingleVipAddress(), remoteRegionsRef.get());
       if (httpResponse.getStatusCode() == Status.OK.getStatusCode()) {
          apps = httpResponse.getEntity();
       }
       logger.info("The response status is {}", httpResponse.getStatusCode());
     
       if (apps == null) {
          logger.error("The application is null for some reason. Not storing this information");
       } else if (fetchRegistryGeneration.compareAndSet(currentUpdateGeneration, currentUpdateGeneration + 1)) {
          localRegionApps.set(this.filterAndShuffle(apps));
          logger.debug("Got full registry with apps hashcode {}", apps.getAppsHashCode());
       } else {
          logger.warn("Not updating applications as another thread is updating it already");
       }
    }
    
一共有两种获取的方式，如果客户端配置的是以VIP的方式，则通过VIP的方式获取；否则就根据普通的方式获取。

获取成功之后会更新全局的Applications服务实例信息。

接下来再看一下getAndUpdateDelta(applications)增量的过程，代码如下：

    private void getAndUpdateDelta(Applications applications) throws Throwable {
       long currentUpdateGeneration = fetchRegistryGeneration.get();
     
       Applications delta = null;
       EurekaHttpResponse<Applications> httpResponse = eurekaTransport.queryClient.getDelta(remoteRegionsRef.get());
       if (httpResponse.getStatusCode() == Status.OK.getStatusCode()) {
          delta = httpResponse.getEntity();
       }
     
       if (delta == null) {
          logger.warn("The server does not allow the delta revision to be applied because it is not safe. "
          + "Hence got the full registry.");
          getAndStoreFullRegistry();
       } else if (fetchRegistryGeneration.compareAndSet(currentUpdateGeneration, currentUpdateGeneration + 1)) {
          logger.debug("Got delta update with apps hashcode {}", delta.getAppsHashCode());
          String reconcileHashCode = "";
          if (fetchRegistryUpdateLock.tryLock()) {
             try {
                updateDelta(delta);
                reconcileHashCode = getReconcileHashCode(applications);
             } finally {
                fetchRegistryUpdateLock.unlock();
             }
          } else {
              logger.warn("Cannot acquire update lock, aborting getAndUpdateDelta");
          }
     
          if (!reconcileHashCode.equals(delta.getAppsHashCode()) || clientConfig.shouldLogDeltaDiff()) {
             reconcileAndLogDifference(delta, reconcileHashCode); // this makes a remoteCall
          }
        } else {
          logger.warn("Not updating application delta as another thread is updating it already");
          logger.debug("Ignoring delta update with apps hashcode {}, as another thread is updating it already", delta.getAppsHashCode());
        }
    }
    
从以上的代码我们大体可以分析出如下的一些执行过程：

首先获取服务增量的信息，如果获取的增量服务信息为空，则会进行全量的更新。

如果获取到服务的增量信息，则会进行增量更新的过程。

    private void updateDelta(Applications delta) {
       int deltaCount = 0;
       for (Application app : delta.getRegisteredApplications()) {
          for (InstanceInfo instance : app.getInstances()) {
             Applications applications = getApplications();
             String instanceRegion = instanceRegionChecker.getInstanceRegion(instance);
             if (!instanceRegionChecker.isLocalRegion(instanceRegion)) {
                Applications remoteApps = remoteRegionVsApps.get(instanceRegion);
                if (null == remoteApps) {
                   remoteApps = new Applications();
                   remoteRegionVsApps.put(instanceRegion, remoteApps);
                }
                applications = remoteApps;
             }
     
             ++deltaCount;
             if (ActionType.ADDED.equals(instance.getActionType())) {
                Application existingApp = applications.getRegisteredApplications(instance.getAppName());
                if (existingApp == null) {
                   applications.addApplication(app);
                }
                logger.debug("Added instance {} to the existing apps in region {}", instance.getId(), instanceRegion);
                applications.getRegisteredApplications(instance.getAppName()).addInstance(instance);
             } else if (ActionType.MODIFIED.equals(instance.getActionType())) {
                Application existingApp = applications.getRegisteredApplications(instance.getAppName());
                if (existingApp == null) {
                   applications.addApplication(app);
                }
                logger.debug("Modified instance {} to the existing apps ", instance.getId());
     
                applications.getRegisteredApplications(instance.getAppName()).addInstance(instance);
     
            } else if (ActionType.DELETED.equals(instance.getActionType())) {
                Application existingApp = applications.getRegisteredApplications(instance.getAppName());
                if (existingApp != null) {
                   logger.debug("Deleted instance {} to the existing apps ", instance.getId());
                   existingApp.removeInstance(instance);
                   if (existingApp.getInstancesAsIsFromEureka().isEmpty()) {
                       applications.removeApplication(existingApp);
                   }
                }
           }
         }
       }
       logger.debug("The total number of instances fetched by the delta processor : {}", deltaCount);
     
       getApplications().setVersion(delta.getVersion());
       getApplications().shuffleInstances(clientConfig.shouldFilterOnlyUpInstances());
     
       for (Applications applications : remoteRegionVsApps.values()) {
          applications.setVersion(delta.getVersion());
          applications.shuffleInstances(clientConfig.shouldFilterOnlyUpInstances());
       }
    }
    
大体的原理是，每一个所注册的服务其实都会带一个ActionType的标识，会来标识这个服务是新增的，删除的，还是被修改过的。客户端根据这些标识进行对本地缓存做更新。

接下来onCacheRefreshed()，其主要功能就是输出通知缓存更新的通知。

最后一步，进行状态的更新。

    private synchronized void updateInstanceRemoteStatus() {
       // Determine this instance's status for this app and set to UNKNOWN if not found
       InstanceInfo.InstanceStatus currentRemoteInstanceStatus = null;
       if (instanceInfo.getAppName() != null) {
          Application app = getApplication(instanceInfo.getAppName());
          if (app != null) {
             InstanceInfo remoteInstanceInfo = app.getByInstanceId(instanceInfo.getId());
             if (remoteInstanceInfo != null) {
                 currentRemoteInstanceStatus = remoteInstanceInfo.getStatus();
             }
          }
       }
       if (currentRemoteInstanceStatus == null) {
          currentRemoteInstanceStatus = InstanceInfo.InstanceStatus.UNKNOWN;
       }
     
       // Notify if status changed
       if (lastRemoteInstanceStatus != currentRemoteInstanceStatus) {
          onRemoteStatusChanged(lastRemoteInstanceStatus, currentRemoteInstanceStatus);
          lastRemoteInstanceStatus = currentRemoteInstanceStatus;
       }
    }
    
首席按根据当前实例的名称获取远程服务的信息，接着在获取远程服务的状态，如果状态不为空，则将本地的服务状态进行变更；如果为空，则设置成UNKNOWN。

以上就是整个客户端的启动的过程分析。




-----------------EOF------------------





















 









    







    


    




    



    
























    



    