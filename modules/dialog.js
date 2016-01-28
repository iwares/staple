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

	initialize : function ($super, interaction) {
		$super();
		var attrs = this.$;

		attrs.overlayManager = interaction.$.overlayManager;

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

		attrs.task = new PeriodicalTask(800, false);
		attrs.task.run = attrs.attachOutsideTouchHandler.bind(attrs);

		attrs.created = false;
		attrs.showing = false;
	},

	onCreate : function (state) {
		// Default do nothing.
	},

	onRestoreInstanceState : function (state) {
		// Default do nothing.
	},

	onResume : function () {
		// Default do nothing.
	},

	onPause : function () {
		// Default do nothing.
	},

	onSaveInstanceState : function (state) {
		// Default do nothing.
	},

	dispatchToListener : function (eventName) {
		var listener = this[eventName + 'Listener'] || this;
		if (!Object.isFunction(listener[eventName]))
			return;
		listener[eventName](this);
	},

	show : function () {
		var attrs = this.$;

		if (attrs.showing)
			return;

		if (!attrs.created)
			this.dispatchOnCreate();

		attrs.showing = true;
		attrs.overlayManager.attach(this);
		attrs.task.start(true);

		this.onResume();
		this.dispatchToListener('onShow');
	},

	dispatchOnCreate : function (state) {
		var attrs = this.$;

		if (attrs.created)
			return;

		attrs.frame = window.document.createElement('div');
		attrs.frame.id = 'dialog';
		attrs.frame.classList.add('dim');
		attrs.frame.handleBackPressed = this.handleBackPressed.bind(this);

		attrs.creating = true;
		this.onCreate(state);
		delete attrs.creating;
		attrs.created = true;
	},

	dismiss : function () {
		var attrs = this.$;

		if (!attrs.showing)
			return;

		this.dispatchToListener('onDismiss');
		this.onPause();

		attrs.task.stop();
		attrs.detachOutsideTouchHandler();
		attrs.overlayManager.detach(this);
		attrs.showing = false;
	},

	cancel : function () {
		if (!this.$.showing)
			return;
		this.dispatchToListener('onCancel');
		this.dismiss();
	},

	setContent : function (content) {
		if (!this.$.creating)
			throw new Error('setContent() must be called during onCreate()');

		if (Object.isString(content)) {
			var elements = HTMLParser.parse(content);
			if (elements.length != 1)
				throw new Error('Invalid content');
			content = elements[0];
		}

		if (!(content instanceof HTMLElement) || content.tagName.toLowerCase() !== 'dialog')
			throw new Error('Content must be a <dialog> element');

		content.addEventListener('click', function (evt) { evt.stopPropagation(); });
		this.$.frame.innerHTML = '';
		this.$.frame.appendChild(this.$.root = content);
	},

	select : function(selector) {
		var root = this.$.root;
		if (selector === '$root')
			return [ root ];
		return $A(root.querySelectorAll(selector));
	},

	selectOne : function(selector) {
		var root = this.$.root;
		if (selector === '$root')
			return root;
		return root.querySelector(selector);
	},

	handleBackPressed : function () {
		this.onBackPressed();
	},

	onBackPressed : function () {
		if (!this.cancelable)
			return;
		this.cancel();
	},

});

});
