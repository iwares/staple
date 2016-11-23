# Data Transmission 数据传递

Staple provides a mechanism to let you transmit data between interactions.

Staple框架提供了一个机制来允许交互之间传递数据。

## Pass Data to New Started Interaction 传递数据到新启动的交互

When you start a new interaction using "startInteraction()" method, you can pass a JSON object to the new started interaction via second parameter. like that:

当你通过“startInteraction()”方法来启动一个新交互的时候，你可以把一个JSON对象作为“startInteraction()”方法的第二个参数来传递到即将启动的那个交互中，就像下面那样：

```JavaScript
this.startInteraction('js/main/input', { string : 'hello' });
```

Then, you can access this JSON object use new started interaction's "getExtra()" method. for example:

然后，你就可以在新开启的那个交互中，使用“getExtra()”方法来读取这个JSON对象了，如下所示：

```JavaScript
var extra = this.getExtra();
alert(extra.string);
```

Now, let's do some practice with our "helloworld" app.

现在，让我们用之前的“helloworld”应用来做一下练习。

First, modify "js/main/home" interaction's "onEditClick()" method:

首先，修改“js/main/home”交互的“onEditClick()”方法：

```JavaScript
/**
 * file: js/main/home.js
 */
...
	onEditClick : function (button) {
		var text = this.selectOne('p').innerText;
		var extra = { text : text }
		this.startInteraction('js/main/input', extra);
	},
...
```

When "Edit" Button is clicked, we get the content of the &lt;p&gt; tag then pass it to "js/main/input" interaction.

当“Edit”按钮被点击时，我们把&lt;p&gt;元素中的内容传递给了新启动的“js/main/input”交互。

Then, We can use this content to initialize "js/main/input" interaction:

然后，我们使用这个内容来做初始化“js/main/input”交互：

```JavaScript
/**
 * file: js/main/input.js
 */
...
	onCreate : function ($super, state) {
		$super(state);
		this.setContent(require('snippet!res/htmls/input#interaction'));

		var input = this.selectOne("#input");
		input.value = this.getExtra().text;
	},
...
```

Deploy and run, see what happened.

部署运行一下，看看效果如何。

## Return Data to Parent Interaction 返回数据到父交互中

Interaction can return data to the interaction that started it by it's "setResult()" method. "setResult()" method has 2 parameters, first one is a string called "result code" while second one is a JSON object called "result data".

一个交互可以使用自身的“setResult()”方法将数据返回到启动它的那个交互中。“setResult()”方法接受两个参数，第一个参数是一个字符串，称为“result code”；第二个参数是一个JSON对象，称为“result data”。

Let's return user's input to "js/main/home" interaction when "js/main/input" interaction's "OK" button is clicked:

让我们试着在用户点击“js/main/input”交互的OK按钮时把用户输入的内容返回给“js/main/home”交互：

```JavaScript
/**
 * file: js/main/input.js
 */
...
	onOkClick : function(el) {
		var input = this.selectOne("#input");
		this.setResult('OK', { text : input.value});
		this.finish();
	},
...
```

Be note that, parent interaction won't receive any data form child interaction utill child interaction is finished. You can call "setResult()" method multiple times before finish, only the last result will be returned to parent interaction. If you don't call "setResult()" before finish, defualt "result code" "CANCEL" will be returned without any "result data".

需要注意的是，在子交互结束前，父交互不会收到任何数据。也就是说，你可以在调用“finish()”方法前多次调用“setResult()”方法，但只有最后一次调用的数据才会在交互结束后传递回父交互中。如果在交互结束时，你没有调用过“setResult()”方法，那么默认的“result code” “CANCEL”会被传递回父交互中，当然，“result data” 将会是undifined。

To get returned data from another interaction, you must start new interaction with a string which called "request code", it is the third parameter of "startInteraction()" method. "request code" is used to distinguish different results form different interactions.

想要接收到子交互传回的数据，你需要在调用“startInteraction()”方法时带上第三个参数，这个参数称为“request code”，也是一个字符串。“request code”的作用是用来区分从不同子交互中返回的数据。

Let's do this when starting "js/main/input" interaction.

让我们修改一下启动“js/main/input”交互的代码，带上“request code”。

```JavaScript
/**
 * file: js/main/home.js
 */
...
	onEditClick : function (button) {
		var text = this.selectOne('p').innerText;
		var extra = { text : text }
		this.startInteraction('js/main/input', extra, 'edit');
	},
...
```

Then you can override "onInteractionResult()" method to handle returned data:

接下来，我们就可以通过重载交互的“onInteractionResult()”方法来处理返回的数据了：

```JavaScript
/**
 * file: js/main/home.js
 */
...
	onEditClick : function (button) {
		var text = this.selectOne('p').innerText;
		var extra = { text : text }
		this.startInteraction('js/main/input', extra, 'edit');
	},

	onInteractionResult : function ($super, request, result, data) {
		switch(request) {
		case 'edit':
			if (result != 'OK')
				break;
			this.selectOne('p').innerText = data.text;
			break;
		default:
			$super(request, result, data);
			break;
		}
	},
...
```

"onInteractionResult()" has three parameters: first one is the "request code" when you start the new interaction, second one is the "result code" form the new interaction while third one is the "result data".

“onInteractionResult()”方法有三个参数，第一个是“request code”，也就是你启动子交互时的那个参数；第二个是从子交互返回的“result code”；第三个则是从子交互返回的“result data”。

It is recommended to invoke "$super()" for those requests that you don't care about.

对于你不关心的那些数据，建议直接调用$super()方法交给你的父类来处理。

- - -

**[NEXT: SAVE/RESTORE INSTANCE STATE 保存/恢复实例状态](save-restore-instance-state.md)**