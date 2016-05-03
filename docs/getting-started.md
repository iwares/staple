# Getting Started

Welcome to training for Staple app development. Here you'll learn how to create a native-like handset web app using Staple framework.

## Required Knowledge

The two most important frameworks that Staple is based on are [Prototype](http://prototypejs.org/) and [RequireJS](http://requirejs.org/), you'd better study them before continuing this tutorial. Staple bases on a trimmed version of [Prototype](http://prototypejs.org/)(with out DOM related APIs), uses it to define classes and inheritance. [RequireJS](http://requirejs.org/) is a JavaScript file and module loader. We used it to load script files and resources.

## Install Staple

Install Staple via bower.

```shell
$ bower install staple
```

If you want a compact version, build it with following commands:

```shell
$ cd bower_compoments/staple
$ npm install uglify-js
$ ./build.js
```

## Modules

Staple advocates object-oriented programming and modular programming. All APIs are provided as [RequireJS](http://requirejs.org/) modules while a module is a class.

Here is a sample of Staple module:

```JavaScript
define(function(require, exports, module) {

// Suppose 'path/of/my/dialog.js' is another staple module.
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

- - -

**[NEXT: BUILD YOUR FIRST APP](build-your-first-app.md)**