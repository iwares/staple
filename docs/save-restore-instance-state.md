# Save/Restore Instance State 保存/恢复实例状态

Although Staple will remember the "Interaction Stack" for your app, custom data such as user inputs will still lost after refresh. Take "helloworld" App for example, text you keyed in the input box will lost after refresh. In this section, you will learn how to save and restore state of a interaction instance.

尽管Staple会保存应用的交互堆栈，但是用户数据，例如用户输入的数据仍然会在页面刷新后丢失。以“helloworld”应用为例，你在输入框中键入的文字会在页面刷新后丢失。在这一节里，你将学到如何保存和恢复交互的状态。

## Why 为什么这么做

Sometimes, users will leave your App for a while, for example, clicked a hyperlink; sometimes, they just clicked the refresh button; and, If there are too many interactions in the "interaction stack", Staple will release interaction Instances that at bottom of the stack to save memory. In these cases, it's not friendly if states of these interactions are lost. So, when users come back, we should re-create these interaction instances and restore their states.

很多时候，用户会暂时离开你的应用，例如点击了一个超链接；有时，用户只是点了一下刷新按钮；还有，当交互堆栈中的交互太多的时候，Staple会把堆栈底部的交互实例释放以节约内存。在这些情况下，如果交互的状态丢失了，这对用户来讲是很不友好的。因此我们需要在用户回来的时候重建交互实例并恢复到用户离开前的样子。

## Save Instance State 保存实例状态

When Staple think it's time to store instance state, a method of interaction called "onSaveInstanceState" will be ivoked by Staple. Developers can override this method to save anything we want to save.

当Staple任务需要保存交互的状态以便将来恢复的时候，会调用交互的“onSaveInstanceState”方法。开发者们可以重载这个方法来保存想要保存的数据。

Modify "helloworld" App's "js/home.js" and "js/input.js":

修改“helloworld”应用的“js/home.js”和“js/input.js”文件：

```JavaScript
/**
 * file: js/main/home.js
 */
...
		$super(state);
		this.setContent(require('snippet!res/htmls/home#interaction'));
	},

	onRestoreInstanceState : function ($super, state) {
		$super(state);
		this.selectOne('p').innerText = state.text;
	},

	onEditClick : function (button) {
		var text = this.selectOne('p').innerText;
		var extra = { text : text }
...
```

```JavaScript

/**
 * file: js/main/input.js
 */
...
		var input = this.selectOne("#input");
		input.value = this.getExtra().text;
	},

	onSaveInstanceState : function ($super, state) {
		$super(state);
		var input = this.selectOne("#input");
		state.input = input.value;
	},

	onCancelClick : function (el) {
		this.finish();
...
```

When "onSaveInstanceState()" method is called, an empty JSON object will be passed to it, you can put data into this JSON object. Staple will save this JSON object for you. Don't forget call "$super()" method if you want your parent class to save it's data.

当“onSaveInstanceState()”被调用时，会传入一个空的JSON对象，你可以把想要保存的数据放进这个JSON对象里，Staple会帮你保存这个对象。如果你希望你的父类也保存它自己数据，那么别忘了调用“$super()”方法。

## Restore Instance State 恢复实例状态

After an instance of interaction was re-created by Staple, interaction's "onRestoreInstanceState()" method will be called and the save JSON object will be passed to it. Developers can override this method to restore state of the interaction instance.

当Staple重建一个交互实例后，会调用交互的“onRestoreInstanceState()”方法，并将之前保存的那个JSON对象作为参数传递进来。开发者可以重载这个函数来恢复交互实例的状态。

Modify "helloworld" App's "js/home.js" and "js/input.js":

修改“helloworld”应用的“js/home.js”和“js/input.js”文件：

```JavaScript
/**
 * file: js/main/home.js
 */
...
		$super(state);
		state.text = this.selectOne('p').innerText;
	},

	onRestoreInstanceState : function ($super, state) {
		$super(state);
		this.selectOne('p').innerText = state.text;
	},

	onEditClick : function (button) {
		var text = this.selectOne('p').innerText;
		var extra = { text : text }
});
```

```JavaScript
/**
 * file: js/main/input.js
 */
...
		var input = this.selectOne("#input");
		state.input = input.value;
	},

	onRestoreInstanceState : function ($super, state) {
		$super(state);
		var input = this.selectOne("#input");
		input.value = state.input;
	},

	onCancelClick : function (el) {
		this.finish();
...
```

Now, deploy and run your app again, click browsers refresh button and see how it works.

现在重新部署并运行你的应用, 点击浏览器的刷新按钮，观察这一机制是如何工作的。

## Restore state in onCreate() method 在onCreate()方法中恢复状态

You may have noticed the "state" parameter in "onCreate()" method. Yes, it's the same one in "onRestoreInstanceState()" method, so you can simply restore instance state in the "onCreate()" method. Of course, if it is a new started interaction instance, "state" parameter in the "onCreate()" method will be "undefined", and the "onRestoreInstanceState()" method won't be invoked at all.

你可能已经注意到，在之前的代码中，我们在重载onCreate()方法时定义了一个叫做state的参数，这个state参数跟传入跟传入onRestoreInstanceState()方法的是同一个，所以你也可以直接在onCreate()方法里进行状态恢复。当然，如果这是一个新启动的交互，那么onCreate()方法中的state将会是undefined，而onRestoreInstanceState()方法则根本不会被调用。

- - -

**[NEXT: INTERACTION LIFECYCLE 交互生命周期](interaction-lifecycle.md)**