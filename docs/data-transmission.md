# Data Transmission

Staple provides a mechanism to let you transmit data between interactions.

## Pass Data to New Started Interaction

When you start a new interaction using "startInteraction()" method, you can pass a JSON object to the new started interaction via second parameter. like that:

```JavaScript
startInteraction('js/main/input', { string : 'hello' });
```

Then, you can access this JSON object use new started interaction's "getExtra()" method. for example:

```JavaScript
var extra = this.getExtra();
alert(extra.string);
```

Now, let's do some practice with our "helloworld" app.

First, modify "js/main/home" interaction's "onEditClick()" method:

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

Then, We can use this content to initialize "js/main/input" interaction:

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

## Return Data to Parent Interaction.

Interaction can return data to the interaction that started it by it's "setResult()" method. "setResult()" method has 2 parameters, first one is a string called "result code" while second one is a JSON object called "result data".

Let's return user's input to "js/main/home" interaction when "js/main/input" interaction's "OK" button is clicked:

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

To get returned data from another interaction, you must start new interaction with a string which called "request code", it is the third parameter of "startInteraction()" method. "request code" is used to distinguish different results form different interactions.

Let's do this when starting "js/main/input" interaction.

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

It is recommended to invoke "$super()" for those requests that you don't care about.

- - -

NEXT: COMING SOON ...