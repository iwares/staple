# Build Your First App

## Set Up Project

Now, we are going to create and set up a project for your first Staple app.

First of all, we need a new folder:

```shell
$ mkdir helloworld
$ cd helloworld
```

Then, install [RequireJS](http://requirejs.org/) and Staple via bower:

```shell
$ bower install requirejs
$ bower install staple
```

However, [RequireJS](http://requirejs.org/) and Staple can be placed to anywhere, even another domain or CDN.

## index.html

Next, we will create an HTML file. It is the entry of your site, and also the container of Staple app.

```HTML
<!-- file: index.html -->
<!doctype html>
<html>

<head>
	<!-- common metas for mobile web site. -->
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<meta charset="utf-8" />
	<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />
	<meta name="msapplication-tap-highlight" content="no" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="format-detection" content="telephone=no" />

	<!-- version info of you app. required by Staple -->
	<meta name="version-name" content="1.0.0">
	<meta name="version-code" content="1">

	<!-- title of the page -->
	<title>My Staple App</title>

	<!-- import Staple styles -->
	<link rel="stylesheet" type="text/css" href="bower_components/staple/staple.css">

	<!-- inline styles for loading indicator-->
	<style type="text/css">
		html body>article#indicator {
			background-color: rgba(0, 0, 0, .8);
			color: white;
		}
		html body>article#indicator>div  {
			position: absolute;
			left: 50%;
			top: 50%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
		}
	</style>

	<!-- load RequireJS and Staple -->
	<script type="text/javascript" src="bower_components/requirejs/require.js"
		data-main="bower_components/staple/staple.js"
		data-home="js/main/home">
	</script>

</head>

<body>
	<!-- loading indicator, required by Staple! -->
	<article id="indicator" class="active">
		<div>Loading...</div>
	</article>
</body>

</html>
```

At the beginning of index.html, There are several &lt;meta&gt; tags to make the page fit handsets.

Then, you'll see two &lt;meta&gt; tags: "version-name" and "version-code". They are version information of you app. "version-name" is a human-readable string that describes current version of you Staple app. "version-code" is an integer value, you should increase it before each release, Staple will discard browser caches when "version-code" was changed.

The &lt;title&gt; tag measns that it means.

After the &lt;title&gt; tag, there is a CSS file(staple.css) which defines all styles that Staple required. Then, a &lt;style&gt; tag defines styles for the loading indicator.

At the end of &lt;head&gt;, we import [RequireJS](http://requirejs.org/) and then load Staple with it. The "data-main" attribute tells [RequireJS](http://requirejs.org/) to load Staple as the main module and the 'data-home' attribute specifies the home 'interaction' of Staple. An 'interaction' is a thing that can interact with the user, we will introduce it in the 'Interaction' section.

In the &lt;body&gt; tag, an &lt;article&gt; tag with id "indicator" and class "active" is required by Staple, and it must be first child of the &lt;body&gt; tag. This &lt;article&gt; element will be displayed when Staple is busy loading resources.

## appliction.js

Then, we are going to create the application class. Create a new file named application.js and fill with following content.

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

In this file, we declare a new class extended from 'staple/applcition'. Staple will instantiate a single, global instance for this class as soon as Staple is loaded. The "onCreate" method will be invoke after application was intantiated, so you can do some global initialization here. In this example, we did nothing.

## Interaction

An 'interaction' is a full-screen window that can interact with the user. Now, let's create the home interaction whitch mentioned in index.html.

In index.html, we specified 'js/main/home' module as the home interaction of our Staple app. According to [RequireJS](http://requirejs.org/) module name specification, it's a file named 'home.js' which located at 'js/main' folder.

Create the folder first:

```Shell
$ mkdir -p js/main
```

Then, create home.js:

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

This class extends Staple's interaction class and overrides the "onCreate()" method. "onCreate()" class will be called when an interaction instance is created. It is a good chance to do some initialization.

The "setContent()" method is used to set content(visual user interface) to current interaction. The parameter can be a DOM element or a HTML snippet. In this example, we use a [RequireJS](http://requirejs.org/) plugin 'snippet' which provided by Staple to load HTML snippet from an special HTML file -- snippets file. 'res/htmls/home' is the path of the snippets file while 'interaction' is the ID of the HTML snippet. Be note that the content of a interaction must be a &lt;section&gt; element.

Now, let's create this snippets file.

Create a folder to hold snippets files:

```Shell
$ mkdir -p res/htmls
```

Here is the content of the snippets file:

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

## Deploy and Run

Due to the origin security policy, staple apps can not access directly from file system. We have to deploy it to an HTTP server.

Copy folder "helloworld" to your HTTP server's root directory, then access "index.html".

```Text
http://<your-host>/helloworld/index.html
```

Staple is designed for handsets, you'd better browse it with cell-phones or Chrome's device mode.

## Start Another Interaction

Usually, an app may have several interactions. You must eager to know how to start another interaction.

First of all, we need another interaction. So, let'c create a new interaction with an input box.

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
		<input id="input" type="text" placeholder="请输入文字">
		<button data-click="onCancelClick">Cancel</button>
		<button data-click="onOkClick">OK</button>
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

You may notice the "data-click" attribute of button elements, this will bind buttons' click event to interaction's "onCancelClick()" and "onOkClick()" methods. "data-click" supports all visible HTML elements.

In the "onCancelClick()" method, interaction's "finish()" is called. This will finish current interaction and navigate back to the previous interaction. If there is no previous interaction, Staple app will stop.

In the "onOkClick()" method, we use interaction's "selectOne()" method to get the &lt;input&gt; element using CSS selector "#input" then disply it's content with alert dialog. "selectOne()" method will return the first element that matchs the given selector. There is another method "select()", returns all matched elements.

Then, add a button to home interaction.

Edit snippets file:

```HTML
<!-- file: res/htmls/home.html -->
...
	<section id="int-home" data-title="Home">
		<h1>Hello World</h1>
		<p>This is my first app!</p>
		<button data-click="onEditClick">Edit</button>
	</section>
...

```

Implement "onEditClick()" method:

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

Now, deploy and run your app again. Click 'Edit' button on "js/main/home" interaction, "js/main/input" interaction will be started. Click 'OK' button on "js/main/input" interaction, "js/main/input" interaction will be finished and then navigate back to "js/main/home" interaction. You can also finish current interaction with browser's "Go Back" button.

When a new interaction is started, it will be pushed into a stack -- "Interaction Stack", Staple always displays the interaction that at the top of the stack. When current interaction is finished, it will be popped form the stack, the previous one will get to the top of the stack then displayed again.

If you press the 'Refresh' button of the browser when "js/main/input" interaction is showing, you will find that "js/main/input" is still showing, and can still go back to "js/main/home" interaction -- Staple will remember the "Interaction Stack" for your app.

- - -

**[NEXT: DATA TRANSMISSION](data-transmission.md)**