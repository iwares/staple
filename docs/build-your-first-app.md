# Build Your First App 创建第一个应用

## Set Up Project 创建项目

Now, we are going to create and set up a project for your first Staple app.

现在，让我们开始为第一个应用创建一个项目。

First of all, we need a new folder:

首先，我们需要一个新文件夹：

```bash
$ mkdir helloworld
$ cd helloworld
```

Then, install [RequireJS](http://requirejs.org/) and Staple via bower:

然后，通过bower安装[RequireJS](http://requirejs.org/)和Staple：

```bash
$ bower install requirejs
$ bower install staple
```

However, [RequireJS](http://requirejs.org/) and Staple can be placed to anywhere, even another domain or CDN.

这里说明一下，[RequireJS](http://requirejs.org/)和Staple可以放置在其他地方，例如放在别的域名下或是放在CDN上都是可以的。

## index.html 主页面文件

Next, we will create an HTML file. It is the entry of your site, and also the container of Staple app.

接下来，我们将创建一个HTML文件——index.html。它将是你网站的主页面，同时它也是Staple应用的“容器”。

```HTML
<!-- file: index.html -->
<!doctype html>
<html>

<head>
	<!-- common metas for mobile web site. -->
	<!-- 移动端页面所需的mata标签。 -->
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<meta charset="utf-8" />
	<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />
	<meta name="msapplication-tap-highlight" content="no" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="format-detection" content="telephone=no" />

	<!-- version info of you app. required by Staple. -->
	<!-- 应用的版本信息，Staple框架要求必须包含这两个meta。 -->
	<meta name="version-name" content="1.0.0">
	<meta name="version-code" content="1">

	<!-- title of the page. -->
	<!-- 页面标题。 -->
	<title>My Staple App</title>

	<!-- import Staple styles. -->
	<!-- 引入Staple框架的样式文件。 -->
	<link rel="stylesheet" type="text/css" href="bower_components/staple/staple.css">

	<!-- inline styles for loading indicator. -->
	<!-- “Loading”提示信息的样式。 -->
	<style type="text/css">
		#staple-indicator {
			background-color: rgba(0, 0, 0, .8);
			color: white;
		}
		#staple-indicator>div  {
			position: absolute;
			left: 50%;
			top: 50%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
		}
	</style>

	<!-- load RequireJS and Staple. -->
	<!-- 加载RequireJS和Staple框架。 -->
	<script type="text/javascript" src="bower_components/requirejs/require.js"
		data-main="bower_components/staple/staple.js"
		data-home="js/main/home">
	</script>

</head>

<body>
	<!-- loading indicator, required by Staple! -->
	<!-- Loading提示信息, Staple要求必须包含这个标签! -->
	<article id="staple-indicator" class="staple-active">
		<div>Loading...</div>
	</article>
</body>

</html>
```

At the beginning of index.html, There are several &lt;meta&gt; tags to make the page fit handsets.

在index.html文件的开始部分，有一些通用的&lt;meta&gt;标签来控制页面适配到移动设备。

Then, you'll see two &lt;meta&gt; tags: "version-name" and "version-code". They are version information of you app. "version-name" is a human-readable string that describes current version of you Staple app. "version-code" is an integer value, you should increase it before each release, Staple will discard browser caches when "version-code" was changed.

随后，有两个&lt;meta&gt;标签：“version-name”和“version-code”。这两个标签描述了应用的版本信息。“version-name”是一个便于阅读的字符串，用来描述当前的版本号，“version-code”则是一个随着版本递增的整型数字，你需要在每次版本更新时更新它。当“version-code”更新后，Staple框架会主动放弃浏览器的缓存，这有助于避免缓存过旧引起的一些奇怪的问题。

The &lt;title&gt; tag measns that it means.

接下来是&lt;title&gt;标签，不解释。

After the &lt;title&gt; tag, there is a CSS file(staple.css) which defines all styles that Staple required. Then, a &lt;style&gt; tag defines styles for the loading indicator.

在&lt;title&gt;标签后面，引入了Staple框架的样式文件，这个样式文件是必须的。随后，一个&lt;style&gt;标签定义了“Loading”提示信息的样式。

At the end of &lt;head&gt;, we import [RequireJS](http://requirejs.org/) and then load Staple with it. The "data-main" attribute tells [RequireJS](http://requirejs.org/) to load Staple as the main module and the "data-home" attribute specifies the home 'interaction' of Staple. An 'interaction' is a thing that can interact with the user, we will introduce it in the 'Interaction' section.

在&lt;head&gt;标签的最后，我们引入了[RequireJS](http://requirejs.org/)并使用它来加载Staple框架。“data-main”属性告诉[RequireJS](http://requirejs.org/)把Staple框架作为主模块进行加载，“data-home”属性则告诉Staple框架哪个“交互”是需要首先加载的。“交互”是一个可以同用户进行互动的可视化界面，我们将在“交互”一节中详细讨论。

In the &lt;body&gt; tag, an &lt;article&gt; tag with id "staple-indicator" and class "staple-active" is required by Staple, and it must be first child of the &lt;body&gt; tag. This &lt;article&gt; element will be displayed when Staple is busy loading resources.

在&lt;body&gt;标签中的，是一个ID为“staple-indicator”并且具有“staple-active”类名的&lt;article&gt;标签，这个标签也是必需的，并且这个标签必须是&lt;body&gt;标签的第一个子元素。当Staple框架在加载资源文件的时候，就会显示这个&lt;article&gt;标签。你可以随意定制它的内容。

## appliction.js

Then, we are going to create the application class. Create a new file named application.js and fill with following content.

接下来，我们来创建application类。新建一个application.js文件，在文件中写入以下内容。

```JavaScript
/**
 * file: appliction.js
 */
define(function (require, exports, module) {

var Application = require('staple/application')

return Class.create(Application, {

	onCreate : function ($super) {
		$super();
	},

});

});
```

In this file, we declare a new class extended from "staple/applcition". Staple will instantiate a single, global instance for this class as soon as Staple is loaded. The "onCreate" method will be invoke after application was intantiated, so you can do some global initialization here. In this example, we did nothing.

在这个文件里，我们定义了一个新的类，继承自“staple/applcition”类。当Staple框架加载完成后，会在第一时间创建这个类的一个全局的单例。“onCreate”方法将在单例实例化后被调用，因此你可以在这里做一些全局的初始化工作。在这个例子中，我们仅仅调用了父类的方法，没有做其他的事情。

## Interaction 交互

An "interaction" is a full-screen window that can interact with the user. Now, let's create the home interaction whitch mentioned in index.html.

“交互”是指一个可以和用户进行互动的全屏界面，接收用户输入并展示信息。现在我们就来创建在index.html文件中提到的那个主“交互”。

In index.html, we specified "js/main/home" module as the home interaction of our Staple app. According to [RequireJS](http://requirejs.org/) module name specification, it's a file named "home.js" which located at "js/main" folder.

在index.html文件中，我们把“js/main/home”模块指定为Staple应用的主“交互”。根据[RequireJS](http://requirejs.org/)的模块命名规范，它应该是位于“js/main”目录下的名为“home.js”文件。

Create the folder first:

先创建目录：

```bash
$ mkdir -p js/main
```

Then, create "home.js":

然后创建“home.js”文件：

```JavaScript
/**
 * file: js/main/home.js
 */
define(function (require, exports, module) {

var Interaction = require('staple/interaction');

return Class.create(Interaction, {

	onCreate : function ($super, state) {
		$super(state);
		this.setContent(require('snippet!res/htmls/home#interaction'));
	},

});

});
```

This class extends "staple/interaction" class and overrides the "onCreate()" method. "onCreate()" method will be called when an interaction instance is created. It is a good chance to do some initialization.

这里我们继承了“staple/interaction”类并重载了“onCreate()”方法。“onCreate()”方法会在交互实例创建后首先被执行，因此可以在这个方法里对交互进行初始化。

The "setContent()" method is used to set content(visual user interface) to current interaction. The parameter can be a DOM element or a HTML snippet. In this example, we use a [RequireJS](http://requirejs.org/) plugin "snippet" which provided by Staple to load HTML snippet from an special HTML file -- snippets file. "res/htmls/home" is the path of the snippets file while "interaction" is the ID of the HTML snippet. Be note that the content of a interaction must be a &lt;section&gt; element.

“setContent()”方法用来设置当前交互的内容（即UI界面）。这个方法的参数可以是一个DOM元素或是一段HTML代码片段。在这个例子中，我们使用了由Staple框架提供的[RequireJS](http://requirejs.org/)插件“snippet”来从snippets文件（一种特殊的HTML文件）中动态加载HTML片段，“res/htmls/home”是snippets文件的路径，而“interaction”则是HTML代码片段的ID。需要注意的是，交互的内容（UI界面）必须是一个&lt;section&gt;元素。

Now, let's create this snippets file.

现在，我们来创建这个snippts文件。

Create a folder to hold snippets files:

为snippets文件创建文件夹：

```bash
$ mkdir -p res/htmls
```

Here is the content of the snippets file:

以下是snippets文件的内容：

```HTML
<!-- file: res/htmls/home.html -->
<style type="text/css">
	section#int-home {
		padding: 16px;
	}
	section#int-home h1 {
		color: rgba(0, 0, 0, .87);
	}
	section#int-home p {
		color: rgba(0, 0, 0, .54);
	}
</style>

<script type="text/html" id="interaction">
	<section id="int-home" data-title="Home">
		<h1>Hello World</h1>
		<p>This is my first app!</p>
	</section>
</script>
```

A snippets file may contains one CSS snippet(Defined by the &lt;style&gt; tag) and several HTML snippets(Defined by &lt;script&gt; tag, with type "text/html"). CSS snippet will be loaded when any of HTML snippet in this file is loaded. Since CSS will effect on whole page, you'd better define unique selectors for each snippets file or each HTML snippet to avoid CSS conflicts.

一个snippets文件可以包含一个CSS代码片段（用&lt;style&gt;标签来定义）和多个HTML代码片段（用type属性为“text/html”的&lt;script&gt;标签来定义）。CSS代码片段会在这个snippets文件中的任何一个HTML代码段被加载时载入到浏览器中。由于CSS样式会对整个页面起作用，我们建议为每个snippets文件或是每个HTML片段使用单独的选择器来避免snippets文件之间的CSS冲突。

## Deploy and Run 部署和运行

Due to the origin security policy, Staple apps can not access directly from file system. We have to deploy it to an HTTP server.

由于浏览器的源安全策略，Staple应用无法直接通过文件系统进行访问。我们需要将它部署在一个HTTP进行访问。

Copy folder "helloworld" to your HTTP server's root directory, then access "index.html".

将“helloworld”文件夹拷贝到你的HTTP服务器的根目录下，然后访问“index.html”文件。

```HTTP
http://<your-host>/helloworld/index.html
```

Staple is designed for handsets, you'd better browse it with cell-phones or Chrome's device mode.

Staple是专为移动设备设计的，所以你最好使用手机或Chrome的设备模拟模式来查看效果。

## Start Another Interaction 启动另一个交互

Usually, an app may have several interactions. You must eager to know how to start another interaction.

通常情况下，一个应用会由多个交互组成，你一定很想知道怎么来启动另一个交互。

First of all, we need another interaction. So, let's create a new interaction with an input box.

首先，我们需要编写另一个交互。所以，让我们来创建一个新的交互，这个交互会拥有一个输入框和两个按钮。

```HTML
<!-- res/htmls/input.html -->
<style type="text/css">
	section#int-input {
		padding: 16px;
	}
	section#int-input #input{
		display: block;
		width: 100%;
		border-radius: 0;
		border: none;
		border-bottom: 1px solid black;
		line-height: 24px;
		margin: 16px 0;
	}
</style>

<script type="text/html" id="interaction">
	<section id="int-input" data-title="Edit">
		<input id="input" type="text" placeholder="Type something here">
		<button staple:click="onCancelClick">Cancel</button>
		<button staple:click="onOkClick">OK</button>
	</section>
</script>
```

```JavaScript
/**
 * file: js/main/input.js
 */
define(function (require, exports, module) {

var Interaction = require('staple/interaction');

return Class.create(Interaction, {

	onCreate : function ($super, state) {
		$super(state);
		this.setContent(require('snippet!res/htmls/input#interaction'));
	},

	onCancelClick : function (el) {
		this.finish();
	},

	onOkClick : function(el) {
		var input = this.selectOne("#input");
		alert(input.value);
	},

});

});
```

You may notice the "staple:click" attribute of button elements, this will bind buttons' click event to interaction's "onCancelClick()" and "onOkClick()" methods. "staple:click" supports all visible HTML elements.

你可能注意到了按钮元素的“staple:click”属性，这是一个语法糖，用来将按钮的click事件绑定到“交互”对象的“onCancelClick()”和“onOkClick()”方法。“staple:click”属性可以在所有可见的HTML元素中使用。

In the "onCancelClick()" method, interaction's "finish()" is called. This will finish current interaction and navigate back to the previous interaction. If there is no previous interaction, Staple app will stop.

在“onCancelClick()”方法中，调用了当前交互对象的“finish()”方法，这会让Staple框架立即结束当前交互，并返回到上一个交互。如果没有上一个交互，Staple应用就退出了。

In the "onOkClick()" method, we use interaction's "selectOne()" method to get the &lt;input&gt; element using CSS selector "#input" then disply it's content with alert dialog. "selectOne()" method will return the first element that matchs the given selector. There is another method "select()", returns all matched elements.

在“onOkClick()”方法中，我们使用了交互对象的“selectOne()”方法，利用它通过CSS选择器“#input”获取到了&lt;input&gt;元素，然后把&lt;input&gt;元素中的内容通过“alert()”显示出来。“selectOne()”方法会返回第一个匹配给定CSS选择器的元素。另一个类似的方法“select()”可以返回所有匹配的元素。

Then, add a button to "js/main/home" interaction.

接下来，在“js/main/home”交互中增加一个按钮。

Edit snippets file:

编辑sinppets文件：

```HTML
<!-- file: res/htmls/home.html -->
...
	<section id="int-home" data-title="Home">
		<h1>Hello World</h1>
		<p>This is my first app!</p>
		<button staple:click="onEditClick">Edit</button>
	</section>
...

```

Implement "onEditClick()" method:

实现“onEditClick()”方法：

```JavaScript
/**
 * file: js/main/home.js
 */
...
	onCreate : function ($super, state) {
		$super(state);
		this.setContent(require('snippet!res/htmls/home#interaction'));
	},

	onEditClick : function (button) {
		this.startInteraction('js/main/input');
	},
...
```

As you see, it's very esay to start another interaction -- just call current interaction's "startInteraction()" method.

正如你看到的，启动一个新交互的方法很简单，就是调用当前交互对象的“startInteraction()”方法。

Now, deploy and run your app again. Click "Edit" button on "js/main/home" interaction, "js/main/input" interaction will be started. Click 'Cancel' button on "js/main/input" interaction, "js/main/input" interaction will be finished and then navigate back to "js/main/home" interaction. You can also finish current interaction with browser's "Go Back" button.

现在，重新部署并访问你的应用。点击“js/main/home”交互上的“Edit”按钮，就可以启动“js/main/input”交互了。点击“js/main/input”交互上的“Cancel”按钮，“js/main/input”交互会结束并退回到“js/main/home”交互。你也可以通过浏览器的“后退”按钮来结束当前交互。

When a new interaction is started, it will be pushed into a stack -- "Interaction Stack", Staple always displays the interaction that at the top of the stack. When current interaction is finished, it will be popped form the stack, the previous one will get to the top of the stack then displayed again.

当一个新的交互启动时，它会被压入一个称为“交互堆栈”的堆栈中，Staple总是会展示处于堆栈顶部的交互。当堆栈顶部的交互结束时，它会被弹出堆栈，这样上一个交互就会重新处于堆栈的顶部，从而被再次展示出来。

If you press the 'Refresh' button of the browser when "js/main/input" interaction is showing, you will find that "js/main/input" is still showing, and can still go back to "js/main/home" interaction -- Staple will remember the "Interaction Stack" for your app.

当应用正在显示“js/main/input”交互时，如果你点击了浏览器的“刷新”按钮，你会发现页面刷新后仍然停留在“js/main/input”交互，而且仍然可以后退回“js/main/home”交互，没什么好奇怪的，Staple框架会自动保存和恢复交互堆栈。

- - -

**[NEXT: DATA TRANSMISSION 数据传递](data-transmission.md)**