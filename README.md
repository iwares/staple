# Staple

Staple is a handset SPA(single page web appliction) framework bases on [Babel](http://babeljs.io/) and [RequireJS](http://requirejs.org/). It implements complete page load/navigation logic and many other details, so developers can focus on their business. At the same time, object-oriented programming style makes code clean and maintainable. Staple can work with many other js libraries and frameworks, such as [jQuery](http://jquery.com/) and [bootstrap](http://getbootstrap.com/). Also, Staple is a perfect companion of [Cordova](http://cordova.apache.org/) to create a native-like App.

Staple是一个专为移动设备设计的SPA（单页面Web应用）开发框架。Staple解决了SPA应用开发过程中的许多细节问题，以便于让开发者专注与实际业务逻辑的开发。Staple基于[Babel](http://babeljs.io/)和[RequireJS](http://requirejs.org/)构建，提供了一种面向对象的、模块化的开发方式，使得的代码更易阅读和维护。Staple被设计成一个单纯的SPA框架，因此能很好的与其它JS框架集成，例如[jQuery](http://jquery.com/)，[Bootstrap](http://getbootstrap.com/)等。另外，Staple可以与[Cordova](http://cordova.apache.org/)完美结合来开发接近原生体验的App。以下是Staple的主要特性：

Features:
* Fully object-oriented programming, modular programming.
* Resources(HTML/CSS/JavaScript) lazy loading, demand loading.
* Page load/navigation managment, with CSS animations.
* Page lifecycle managment.
* State staging and recovery when refresh or navigate back from other website.
* Transfer data between pages.
* Open specified page via url query parameters.
* I18n Support.

特性：
* 完全的面向对象编程风格，模块化编程
* 资源(HTML/CSS/JavaScript)懒加载、按需加载
* 界面加载和跳转管理，支持自定义CSS动画
* 界面生命周期管理
* 状态暂存及恢复，在页面刷新后或从其它页面后退回来时能恢复到离开时的状态
* 界面间数据传递
* 通过URL Query参数直接跳转的指定的界面
* 国际化(I18n)支持

# Install Staple 安装Staple

Install Staple via npm:

通过npm来安装Staple：

```bash
$ npm install -g staple.js
```

# How to start 如何开始

Create a new folder.

创建一个新的文件夹。

```bash
$ mkdir /some/path/to/your/project
$ cd /some/path/to/your/project
```

Create a new project via "staple.js" CLI.

通过“staple.js”命令行工具来创建一个新项目

```bash
$ staple.js init
project name: (project) stapledemo
version: (1.0.0) 1.0.0
description: A staple project demo.
author: Eric.Tsai
use jquery: (yes) yes
use art template: (yes) yes
use weui: (yes) yes
use typescript: (yes) yes

creating project "stapledemo" ...
done.

run "npm install" to install dependencies.
then run "npm start" to start.
```

There are 4 options: jQuery, artTemplate, WeUI and TypeScript.

[jQuery](http://jquery.com/) is the most popular JavaScript framework that makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler.
[artTemplate](https://github.com/lhywork/artTemplate) is an effective HTML render framework.
[WeUI](https://github.com/Tencent/weui) is the official UI framework of the WeChat app.
[TypeScript](http://www.typescriptlang.org) is a typed superset of JavaScript that compiles to plain JavaScript.

You can disable any of them by setting corresponding option to "no".

创建项目时有4个可选项：jQuery，artTemplate，WeUI和TypeScript.

[jQuery](http://jquery.com/)是最流行的JavaScript框架，可以使HTML文档遍历和操作，事件处理，动画以及Ajax等工作更简便。
[artTemplate](https://github.com/lhywork/artTemplate)是一个高效的HTML渲染框架。
[WeUI](https://github.com/Tencent/weui)是微信官方的UI框架。
[TypeScript](http://www.typescriptlang.org)是一个强类型的JavaScript超集，可以被编译成JavaScript。

你可以把对应的选项设置为“no”来关闭以上的任何一个特性。

Install dependencies:

安装依赖项：

```bash
$ npm install
```

Start project:

启动项目

```bash
$ npm start
```

# License 许可证

Apache License, Version 2.0
