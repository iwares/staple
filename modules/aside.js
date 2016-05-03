/*
 * Copyright (C) 2015 iWARES Solution Provider
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/**
 * @file	modules/aside.js
 * @author	Eric.Tsai
 *
 */

// Base class of staple interaction.
define('staple/aside', function (require, exports, module) {

var SuperClass = require('staple/object');
var PeriodicalTask = require('staple/periodical-task');
var HTMLParser = require('staple/html-parser');

return Class.create(SuperClass, {

	initialize : function ($super, interaction, gravity, content) {
		$super();
		var attrs = this.$attrs;

		attrs.frame = window.document.createElement('div');
		attrs.frame.id = 'aside';
		attrs.frame.classList.add('dim');
		attrs.frame.handleBackPressed = this.handleBackPressed.bind(this);

		attrs.gravity = gravity;

		if (content)
			this.setContent(content);

		attrs.overlayManager = interaction.$attrs.overlayManager;

		var outsideTouchHandler = (function () {
			this.dismiss();
		}).bind(this);

		attrs.attachOutsideTouchHandler = function () {
			this.frame.addEventListener('click', outsideTouchHandler);
		};

		attrs.detachOutsideTouchHandler = function () {
			this.frame.removeEventListener('click', outsideTouchHandler);
		};

		attrs.task = new PeriodicalTask(800, false);
		attrs.task.run = attrs.attachOutsideTouchHandler.bind(attrs);

		attrs.showing = false;
	},

	setContent : function (content) {
		if (Object.isString(content)) {
			var elements = HTMLParser.parse(content);
			if (elements.length != 1)
				throw new Error('Invalid content');
			content = elements[0];
		}

		if (!(content instanceof HTMLElement) || content.tagName.toLowerCase() !== 'aside')
			throw new Error('Content must be a <aside> element');

		var attrs = this.$attrs;

		switch (attrs.gravity) {
		case 'bottom':
			content.classList.add('bottom');
			break;
		case 'top':
			content.classList.add('top');
			break;
		case 'right':
			content.classList.add('right');
			break;
		default:
			content.classList.add('left');
			break;
		}

		content.addEventListener('click', function (evt) { evt.stopPropagation(); });
		attrs.frame.innerHTML = '';
		attrs.frame.appendChild(this.$attrs.root = content);
	},

	show : function () {
		var attrs = this.$attrs;

		if (attrs.showing)
			return;

		attrs.showing = true;
		attrs.overlayManager.attach(this);
		attrs.task.start(true);
	},

	dismiss : function () {
		var attrs = this.$attrs;

		if (!attrs.showing)
			return;

		attrs.task.stop();
		attrs.detachOutsideTouchHandler();
		attrs.overlayManager.detach(this);
		attrs.showing = false;
	},

	handleBackPressed : function () {
		this.dismiss();
	},

});

});