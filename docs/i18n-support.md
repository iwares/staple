# I18n Support 支持国际化

With the gradual deepening of globalization, it is more and more necessary to provide multiple languages for users all over the world. You can do it easily with Staple framework.

随着全球化的逐步深化，为全世界的用户提供不同的语言翻译显得越来越有必要。而通过Staple框架，你可以很轻松地做到这一点。

## NLS Bundle 本地化语言包

NLS Bundle is a folder that contains one master file and several locale files. All native language strings are stored in locale files as key-value pairs. You can reference these strings with there keys in source code.

所谓“本地化语言包”，是一个包含了一个主控文件和若干区域语言文件的文件夹。所有的本地化翻译字符串都作为键值对存储在区域语言文件文件中。你可以在源代码中使用这些键名来引用这些字符串。

A typical NLS Bundle folder looks like this:

一个典型的本地化语言包的目录结构如下图所示：

```bash
strings --- master.js  // master file 主控文件
         |- root.js    // root(default) locale 根区域语言（默认域语语言）文件
         |- zh-cn.js   // Chinese(China) locale 中文（中国）区域语言文件
         |- ko-kr.js   // Korean(Korea) locale 韩文（韩国）区域语言文件
```

As you see, "strings" folder is the NSL Bundle itself. It cantains a master file - "master.js", and three locale files - "root.js", "zh-cn.js" and "ko-kr.js". Be note that the locale name must in lower case, eg: "zh-cn" rather then "zh-CN".

上面所示的“strings”文件夹就是一个本地化语言包。它包含了一个主控文件——“master.js”和三个区域语言文件——“root.js”、“zh-cn.js”和“ko-kr.js”。需要注意一下文件名中的区域语言必须是小写的形式，例如应该使用“zh-cn”而不是“zh-CN”。

## Master File 主控文件

Master module "master.js" describes all available locales. for example:

主控模块“master.js”描述了所有可用的区域语言，如下：

```JavaScript
define({

'root' : true,
'zh-cn' : true,
'ko-kr' : true,

});
```

## Locale Files 区域语言文件

Locale files are modules that store native language strings. Here is an example:

区域语言文件是存储本地语言字符串的模块，下面是一个例子：

```JavaScript
// root.js
defile({

color_red : 'Red',
color_green : 'Green',
color_blue : 'blue',

});
```

Here is another example for zh-CN locale:

下面是另一个zh-CN区域语言文件的例子：

```JavaScript
// root.js
defile({

color_red : '红色',
color_green : '绿色',
color_blue : '蓝色',

});
```

Then for ko-Kr:

然后是ko-Kr的：

```JavaScript
// root.js
defile({

color_red : '파란색',
color_green : '빨간색',
color_blue : '녹색',

});
```

## Root Locale File 根区域语言文件

Root locale file - "root.js" is the default locale file of the NLS Bundle. Usually, Staple will load corresponding native language strings according to Browser's current locale. But, if some native language strings are not provided by specified locale file or there is no matched locale file for current locale, Stale will use strings in this file. So, the root locale file must contans all strings used by the App.

根区域语言文件——“root.js”是本地化语言包的默认区域语言文件。通常情况下，Staple会根据浏览器当前的区域语言设置来加载本地化语言字符串。但是，如果当前的区域语言所对应的区域语言文件中缺少某些字符串的翻译，或者对应的区域语言文件不存在，那么Staple就会使用根区域语言文件中的字符串。因此，根区域语言文件必须包含所有在App中使用到的字符串。

## Usage 使用方法

In snippets files, Staple provides a placeholder to reference native language strings: "{nls{&lt;bundle-path&gt;:&lt;key&gt;}}". The &lt;bundle-path&gt; is the path of NLS Bundle, if you place the NSL Bundle at the root of your project, &lt;bundle-path&gt; is the name of NLS Bundle. &lt;key&gt; is the key of the strings which you want to use.

在snippets文件中，Staple提供了一个占位符来方便程序员引用本地化语言字符串：“{nls{&lt;bundle-path&gt;:&lt;key&gt;}}”。&lt;bundle-path&gt;就是本地化语言包的路径，如果你把本地化语言包放在你项目的根目录，那么这个路径就是本地化语言包的文件夹名称，在上面的例子中就是strings。&lt;key&gt;就是你想要引用的那个字符串的键名。

For example:

举个例子：

```HTML
<select id="color">
	<option value="red">{nls{strings:color_red}}</option>
	<option value="green">{nls{strings:color_green}}</option>
	<option value="blue">{nls{strings:color_blue}}</option>
</select>
```

In JavaScript files, Staple provides a [RequireJS](http://requirejs.org/) module called "nls" to load NLS Bundle. You can load and use NLS Bundle like this:

在JavaScript文件中，Staple提供了一个名为“nls”的[RequireJS](http://requirejs.org/)插件来加载本地化语言包。你可以像下面那样来加载和使用本地化语言包：

```JavaScript
var Strings = require('nls!strings');

// Some other code...

var redStr = Strings.color_red;
var greenStr = Strings.color_green;
var blueStr = Strings.color_blue;

```

## Inlined Locale Files 內联区域语言文件

If your App has few native language strings, you can inline them into the master file to reduce HTTP requests. Just like that:

如果你的App只用到了很少的本地化语言字符串，你可以将它们內联到主控文件中来减少加载时的HTTP请求次数。就像下面那样。

```JavaScript
// master.js

define({

'root' : {
	color_red : 'Red',
	color_green : 'Green',
	color_blue : 'blue',
},
'zh-cn' : {
	color_red : '红色',
	color_green : '绿色',
	color_blue : '蓝色',
},
'ko-kr' : {
	color_red : '파란색',
	color_green : '빨간색',
	color_blue : '녹색',
},

});

```

You can either inline some of locale files or all locale files into the master file.

你可以只內联其中的几个区域语言文件到主控文件里，也可以內联所有的区域语言文件。

## Practice 实践

Now, let's add Chinese language for "helloworld" App.

现在，我们来为“helloworld”应用增加中文语言的支持。

First, create a folder for NSL Bundle:

首先，为本地化语言包创建一个目录：

```bash
mkdir -p res/strings
```

Then, create the master file and inline "root" and "zh-cn" locale files:

然后，创建主控文件，并內联根区域语言文件和中文区域语言文件。

```JavaScript
define({

'root' : {
	title_home : 'Home',
	title_input : 'Edit',
	text_helloworld : 'Hello World',
	text_message : 'This is my first app!',
	btn_edit : 'Edit',
	btn_ok : 'OK',
	btn_cancel : 'Cancel',
	input_hint : 'Type something here',
},
'zh-cn' : {
	title_home : '首页',
	title_input : '编辑',
	text_helloworld : '你好，世界',
	text_message : '这是我的第一个应用！',
	btn_edit : '编辑',
	btn_ok : '确定',
	btn_cancel : '取消',
	input_hint : '请输入一些文字',
},

});
```

Then, modify snippets files to use native language strings:

然后，修改sinppets文件，引用本地化语言字符串：

```HTML
<!-- file: res/htmls/home.html -->

...

<script type="text/html" id="interaction">
	<section id="int-home" data-title="{nls{res/strings:title_home}}">
		<h1>{nls{res/strings:text_helloworld}}</h1>
		<p>{nls{res/strings:text_message}}</p>
		<button staple:click="onEditClick">{nls{res/strings:btn_edit}}</button>
	</section>
</script>
```

```HTML
<!-- res/htmls/input.html -->

...

<script type="text/html" id="interaction">
	<section id="int-input" data-title="{nls{res/strings:title_input}}">
		<input id="input" type="text" placeholder="{nls{res/strings:input_hint}}">
		<button staple:click="onCancelClick">{nls{res/strings:btn_cancel}}</button>
		<button staple:click="onOkClick">{nls{res/strings:btn_ok}}</button>
	</section>
</script>
```

Deploy, change your system or browser's language to "Chinese Simplified", then access you App.

重新部署，修改系统语言或浏览器语言为“简体中文”，然后再访问你的App看看效果。

You can also force Staple to use a specified locale by setting it to localStorage with key name "staple:///language". Don't forget refresh page to make it work.

你也可以强制Staple使用某个区域语言，只需在localStorage的“staple:///language”键中写入这个区域语言。别忘了刷新一下页面来使这个设置生效。

```JavaScript
localStorage.setItem('staple:///language', 'zh-CN');
```

- - -

NEXT: COMMING SOON ...
