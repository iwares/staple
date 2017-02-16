# Staple

Staple is a handset SPA(single page web appliction) framework bases on [Prototype](http://prototypejs.org/) and [RequireJS](http://requirejs.org/). It implements complete page load/navigation logic and many other details, so developers can focus on their business. At the same time, object-oriented programming style makes code clean and maintainable. Staple can work with many other js libraries and frameworks, such as [jQuery](http://jquery.com/) and [bootstrap](http://getbootstrap.com/). Also, Staple is a perfect companion of [Cordova](http://cordova.apache.org/) to create a native-like App.

Staple是一个专为移动设备设计的SPA（单页面Web应用）开发框架。Staple解决了SPA应用开发过程中的许多细节问题，以便于让开发者专注与实际业务逻辑的开发。Staple基于[Prototype](http://prototypejs.org/)和[RequireJS](http://requirejs.org/)构建，提供了一种面向对象的、模块化的开发方式，使得的代码更易阅读和维护。Staple被设计成一个单纯的SPA框架，因此能很好的与其它JS框架集成，例如[jQuery](http://jquery.com/)，[bootstrap](http://getbootstrap.com/)等。另外，Staple可以与[Cordova](http://cordova.apache.org/)完美结合来开发接近原生体验的App。以下是Staple的主要特性：

Features:
* Fully object-oriented programming, modular programming.
* Resources(HTML/CSS/JavaScript) lazy loading, demand loading.
* Page load/navigation managment, support animations.
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

Install Staple via bower:

通过bower来安装Staple：

```bash
$ bower install staple
```

Want a compact version? Here it is:

如果你需要一个压缩的版本，可以通过下列指令来编译：

```bash
$ cd bower_compoments/staple
$ npm install uglify-js
$ ./build.js
```

# How to start 如何开始

[Here](docs/getting-started.md) is a simple tutorial.

你可以过阅读这份简单的[入门教程](docs/getting-started.md)。

# License 许可证

Apache License, Version 2.0
