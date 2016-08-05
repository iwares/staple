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
 * @file	modules/dialog.js
 * @author	Eric.Tsai
 *
 */

// Base class of staple interaction.
define('staple/dialog', function (require, exports, module) {

var SuperClass = require('staple/object');
var PeriodicalTask = require('staple/periodical-task');
var HTMLParser = require('staple/html-parser');

return Class.create(SuperClass, {

	initialize : function ($super, interaction, content) {
		$super();
		var attrs = this.$attrs;

		attrs.frame = window.document.createElement('div');
		attrs.frame.classList.add('staple-overlay-mask');
		attrs.frame.handleBackPressed = this.handleBackPressed.bind(this);

		if (content)
			this.setContent(content);

		attrs.overlayManager = interaction.$attrs.overlayManager;

		var outsideTouchHandler = (function () {
			if (!this.cancelable || !this.cancelOnTouchOutside)
				return;
			this.cancel();
		}).bind(this);

		attrs.attachOutsideTouchHandler = function () {
			this.frame.addEventListener('click', outsideTouchHandler);
		};

		attrs.detachOutsideTouchHandler = function () {
			this.frame.removeEventListener('click', outsideTouchHandler);
		};

		attrs.attachTask = new PeriodicalTask(800, false);
		attrs.attachTask.run = attrs.attachOutsideTouchHandler.bind(attrs);

		attrs.detachTask = new PeriodicalTask(200, false);
		attrs.detachTask.run = attrs.overlayManager.detach.bind(attrs.overlayManager, this);

		attrs.showing = false;
	},

	dispatchToListener : function (eventName) {
		var listener = this[eventName + 'Listener'] || this;
		if (!Object.isFunction(listener[eventName]))
			return;
		listener[eventName](this);
	},

	show : function () {
		var attrs = this.$attrs;

		if (attrs.showing)
			return;

		attrs.showing = true;
		attrs.overlayManager.attach(this);
		attrs.overlayManager.darken();

		attrs.fadeinTask.start(true);
		attrs.attachTask.start(true);
		attrs.detachTask.stop();

		this.dispatchToListener('onShow');
	},

	dismiss : function () {
		var attrs = this.$attrs;

		if (!attrs.showing)
			return;

		this.dispatchToListener('onDismiss');

		attrs.fadeinTask.stop();
		attrs.attachTask.stop();
		attrs.detachTask.start(true);
		attrs.detachOutsideTouchHandler();
		attrs.root.classList.remove('staple-active');
		attrs.overlayManager.lighten();
		attrs.showing = false;
	},

	cancel : function () {
		if (!this.$attrs.showing)
			return;
		this.dispatchToListener('onCancel');
		this.dismiss();
	},

	setContent : function (content) {
		if (Object.isString(content)) {
			var elements = HTMLParser.parse(content);
			if (elements.length != 1)
				throw new Error('Invalid content');
			content = elements[0];
		}

		if (!(content instanceof HTMLElement) || content.tagName.toLowerCase() !== 'dialog')
			throw new Error('Content must be a <dialog> element');

		content.addEventListener('click', function (evt) { evt.stopPropagation(); });
		content.open = true;
		content.classList.add('staple-dialog');
		var attrs = this.$attrs;
		attrs.fadeinTask = new PeriodicalTask(100, false);
		attrs.fadeinTask.run = content.classList.add.bind(content.classList, 'staple-active');
		attrs.frame.innerHTML = '';
		attrs.frame.appendChild(this.$attrs.root = content);
	},

	select : function(selector) {
		var root = this.$attrs.root;
		if (selector === '$root')
			return [ root ];
		return $A(root.querySelectorAll(selector));
	},

	selectOne : function(selector) {
		var root = this.$attrs.root;
		if (selector === '$root')
			return root;
		return root.querySelector(selector);
	},

	handleBackPressed : function () {
		this.onBackPressed();
		return true;
	},

	onBackPressed : function () {
		if (!this.cancelable)
			return;
		this.cancel();
	},

	isShowing : function () {
		return this.$attrs.showing;
	},

});

});
