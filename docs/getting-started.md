# Getting Started 入门

Welcome to training for Staple app development. Here you'll learn how to create a native-like handset web app using Staple framework.

欢迎阅读Staple应用开发教程，通过本教程，你将会了解如何使用Staple框架构建一个native-like的移动Web应用。

## Required Knowledge 知识背景

The two most important frameworks that Staple is based on are [Prototype](http://prototypejs.org/) and [RequireJS](http://requirejs.org/), you'd better study them before continuing this tutorial. Staple bases on a trimmed version of [Prototype](http://prototypejs.org/)(with out DOM related APIs), uses it to define classes and inheritance. [RequireJS](http://requirejs.org/) is a JavaScript file and module loader. We used it to load script files and resources.

Staple框架是基于[Prototype](http://prototypejs.org/)和[RequireJS](http://requirejs.org/)这两个JS框架开发的，因此，建议你先了解一下这两个框架，再继续阅读本教程。Staple框架内置了一个裁剪过的[Prototype](http://prototypejs.org/)（去掉了DOM相关的API），用它来实现类的定义和继承等。[RequireJS](http://requirejs.org/)是一个JavaScript模块加载器，可以正确的按照模块间的依赖关系加载所需模块，Staple用它来实现代码和资源文件的懒加载。

## Install Staple 安装Staple

Install Staple via bower:

通过bower来安装Staple：

```bash
$ bower install staple
```

If you want a compact version, build it with following commands:

如果你需要一个压缩的版本，可以通过下列指令来编译：

```bash
$ cd bower_compoments/staple
$ npm install uglify-js
$ ./build.js
```

## Modules 模块

Staple advocates object-oriented programming and modular programming. All APIs are provided as [RequireJS](http://requirejs.org/) modules while a module is a class.

Staple 提倡面向对象编程和模块化开发。Staple的所有API都以[RequireJS](http://requirejs.org/)模块的形式提供，每个模块就是一个类。

Here is a sample of Staple module:

以下是一个Staple模块的示例：

```JavaScript
define(function(require, exports, module) {

// Suppose 'path/of/my/dialog.js' is another Staple module.
// 假设'path/of/my/dialog.js'是另一个Staple模块
var MyDialog = require('path/of/my/dialog');

return Class.create({

	sayHello : function () {
		var dialog = new MyDialog("Hello World!");
		dialog.show();
	}

});

});

```

[RequireJS](http://requirejs.org/) supports both AMD and CMD specifications. Although AMD is recommended by [RequireJS](http://requirejs.org/), Staple recommends CMD for better readability: "var MyDialog = require('path/of/my/dialog')" is an obvious way to load another module, just like Java's "import" or C's "#include".

[RequireJS](http://requirejs.org/)同时支持AMD模块和CMD模块两种模块写法，尽管[RequireJS](http://requirejs.org/)官方推荐AMD写法，Staple框架还是建议使用CMD写法来获得更好的代码可读性：通过“var MyDialog = require('path/of/my/dialog')”来加载其他模块，阅读起来更清晰，就好像Java的“import”和C语言的“#include”一样。

- - -

**[NEXT: BUILD YOUR FIRST APP 创建第一个应用](build-your-first-app.md)**