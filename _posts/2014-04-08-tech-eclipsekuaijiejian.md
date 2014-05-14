---
layout: post
title: "Eclipse快捷键大全"
description: "eclipse"
category: 技术
tags: [技术]
---
“工欲善其事，必先利其器”。以下是Eclipse大全，也是从网上照抄的，只是为了以后再登陆自己的博客的时候能够经常看到而已。

Ctrl+1 快速修复(最经典的快捷键,就不用多说了)

Ctrl+D: 删除当前行

Ctrl+Alt+↓ 复制当前行到下一行(复制增加)

Ctrl+Alt+↑ 复制当前行到上一行(复制增加)

Alt+↓ 当前行和下面一行交互位置(特别实用,可以省去先剪切,再粘贴了)

Alt+↑ 当前行和上面一行交互位置(同上)

Alt+← 前一个编辑的页面

Alt+→ 下一个编辑的页面(当然是针对上面那条来说了)

Alt+Enter 显示当前选择资源(工程,or 文件 or文件)的属性

Shift+Enter 在当前行的下一行插入空行(这时鼠标可以在当前行的任一位置,不一定是最后)

Shift+Ctrl+Enter 在当前行插入空行(原理同上条)

Ctrl+Q 定位到最后编辑的地方

Ctrl+L 定位在某行 (对于程序超过100的人就有福音了)

Ctrl+M 最大化当前的Edit或View (再按则反之)

Ctrl+/ 注释当前行,再按则取消注释

Ctrl+O 快速显示 OutLine

Ctrl+T 快速显示当前类的继承结构

Ctrl+W 关闭当前Editer

Ctrl+K 参照选中的Word快速定位到下一个

Ctrl+E 快速显示当前Editer的下拉列表(如果当前页面没有显示的用黑体表示)

Ctrl+/(小键盘) 折叠当前类中的所有代码

Ctrl+×(小键盘) 展开当前类中的所有代码

Ctrl+Space 代码助手完成一些代码的插入(但一般和输入法有冲突,可以修改输入法的热键,也可以暂用
Alt+/来代替)

Ctrl+Shift+E 显示管理当前打开的所有的View的管理器(可以选择关闭,激活等操作)

Ctrl+J 正向增量查找(按下Ctrl+J后,你所输入的每个字母编辑器都提供快速匹配定位到某个单词,如果
没有,则在stutes line中显示没有找到了,查一个单词时,特别实用,这个功能Idea两年前就有了)

Ctrl+Shift+J 反向增量查找(和上条相同,只不过是从后往前查)

Ctrl+Shift+F4 关闭所有打开的Editer

Ctrl+Shift+X 把当前选中的文本全部变为大写

Ctrl+Shift+Y 把当前选中的文本全部变为小写

Ctrl+Shift+F 格式化当前代码

Ctrl+Shift+P 定位到对于的匹配符(譬如{}) (从前面定位后面时,光标要在匹配符里面,后面到前面,则反之)
下面的快捷键是重构里面常用的,本人就自己喜欢且常用的整理一下(注:一般重构的快捷键都是Alt+Shift开头的了)

Alt+Shift+R 重命名 (是我自己最爱用的一个了,尤其是变量和类的Rename,比手工方法能节省很多劳动力)

Alt+Shift+M 抽取方法 (这是重构里面最常用的方法之一了,尤其是对一大堆泥团代码有用)

Alt+Shift+C 修改函数结构(比较实用,有N个函数调用了这个方法,修改一次搞定)

Alt+Shift+L 抽取本地变量( 可以直接把一些魔法数字和字符串抽取成一个变量,尤其是多处调用的时候)

Alt+Shift+F 把Class中的local变量变为field变量 (比较实用的功能)

Alt+Shift+I 合并变量(可能这样说有点不妥Inline)

Alt+Shift+V 移动函数和变量(不怎么常用)

Alt+Shift+Z 重构的后悔药(Undo)

##运行
单步返回  F7

单步执行  F6

单步跳入  F5

单步跳入选择  Ctrl+F5

调试上次启动  F11

继续  F8

使用过滤器单步执行  Shift+F5

添加/去除断点  Ctrl+Shift+B

显示  Ctrl+D

运行上次启动  Ctrl+F11

运行至行  Ctrl+R

执行  Ctrl+U

##编辑
查找并替换 Ctrl+F

查找上一个  Ctrl+Shift+K

查找下一个  Ctrl+K

删除当前行  Ctrl+D

当前行的下一行插入空行  Shift+Enter

当前行插入空行  Ctrl+Shift+Enter

定位到最后编辑的位置  Ctrl+Q

恢复上一个选择  Alt+Shift+↓

##查看
放大  Ctrl+=

缩小  Ctrl+-

##窗口

激活编辑器  F12

关闭所有编辑器  Ctrl+Shift+W

上一个编辑器  Ctrl+Shift+F6

上一个视图   Ctrl+Shift+F7

上一个透视图  Ctrl+Shift+F8

下一个编辑器  Ctrl+F6

下一个视图  Ctrl+F7

下一个透视图  Ctrl+F8

关闭当前窗口  Ctrl+W

显示视图菜单  Ctrl+F10

显示系统菜单  Alt+-

##导航
打开结构 Ctrl+F3

打开类型 Ctrl+Shift+T

打开类型层次结构 F4

打开声明  F3

打开外部javadoc  Shift+F2

打开资源  Ctrl+Shift+R

后退历史记录  Alt+←

前进历史记录  Alt+→

上一个  Ctrl+，

下一个  Ctrl+.

显示大纲  Ctrl+O

在层次结构中打开类型  Ctrl+Shift+H

转至匹配的括号  Ctrl+Shift+P

转至上一个编辑位置  Ctrl+Q

转至上一个成员  Ctrl+Shift+↑

转至下一个成员  Ctrl+Shift+↓

转至行  Ctrl+L

##重构

撤销重构  Alt+Shift+Z

抽取方法  Alt+Shift+M

抽取局部变量  Alt+Shift+L

内联  Alt+Shift+I

移动  Alt+Shift+V

重命名  Alt+Shift+R

重做  Alt+Shift+Y

##修改快捷键

依次打开window->preferrence->general->keys,在 binding一栏选择修改快捷键。

自己也有一系列的常用快捷键，虽然这些东西都是在软件层面上来说明的，但是在平常的项目开发中确实可以将自己的开发速度增快。

（完）