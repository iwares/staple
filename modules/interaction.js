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
 * @file	modules/interaction.js
 * @author	Eric.Tsai
 *
 */

// Base class of staple interaction.
define('staple/interaction', function (require, exports, module) {

var SuperClass = require('staple/object');
var InteractionManager = require('staple/interaction-manager');
var HTMLParser = require('staple/html-parser');
var PeriodicalTask = require('staple/periodical-task');

var OverlayManager = Class.create({

	initialize : function () {
		this.panel = window.document.createElement('article');
		this.panel.id = 'overlay';
		this.updater = new PeriodicalTask(100, false, this);
	},

	resume : function () {
		window.document.body.appendChild(this.panel);
		this.updater.start(true);
	},

	pause : function () {
		this.updater.stop();
		window.document.body.removeChild(this.panel);
	},

	run : function () {
		var panel = this.panel;

		var dialogs = panel.querySelectorAll("article#overlay>div.dim");
		for (var i = 0, dialog; dialog = dialogs[i]; ++i)
			dialog.classList.remove('active');
		if (dialogs.length)
			dialogs[dialogs.length - 1].classList.add('active');

		if (panel.childElementCount === 0)
			panel.classList.remove('active');
		else
			panel.classList.add('active');
	},

	attach : function (overlay) {
		this.panel.appendChild(overlay.$attrs.frame);
		this.updater.start(true);
	},

	detach : function (overlay) {
		this.panel.removeChild(overlay.$attrs.frame);
		this.run();
	},

	handleBackPressed : function () {
		var target = this.panel.lastElementChild;
		if (!target)
			return false;
		target.handleBackPressed();
		return true;
	},

});

return Class.create(SuperClass, {

	create : function (state) {
		var attrs = this.$attrs;
		attrs.active = false;
		attrs.tasks = {};
		attrs.overlayManager = new OverlayManager();

		attrs.creating = true;
		this.invokeMethodAndEnsureSuperCalled('onCreate', state);
		delete attrs.creating;

		// Delegate click event.
		this.$attrs.root.onclick = (function (event) {
			var handler = this[event.target.getAttribute('on-click')];
			if (!Object.isFunction(handler))
				return;
			handler.call(this, event.target);
		}).bind(this);
	},

	onCreate : function (state) {
		this.notifySuperCalled('onCreate');
	},

	performRestoreInstanceState : function (state) {
		this.onRestoreInstanceState(state);
	},

	onRestoreInstanceState : function (state) {
		// Default do nothing.
	},

	resume : function () {
		this.$attrs.active = true;
		staple.application.onTitleChanged(this.getTitle());
		this.$attrs.overlayManager.resume();
		this.invokeMethodAndEnsureSuperCalled('onResume');
	},

	onResume : function () {
		this.notifySuperCalled('onResume');
	},

	onInteractionResult : function (request, result, data) {
		// Default do nothing.
	},

	pause : function () {
		this.invokeMethodAndEnsureSuperCalled('onPause');
		this.$attrs.overlayManager.pause();
		this.$attrs.active = false;
	},

	onPause : function () {
		this.notifySuperCalled('onPause');
	},

	performSaveInstanceState : function (state) {
		this.onSaveInstanceState(state);
	},

	onSaveInstanceState : function (state) {
		// Default do nothing.
	},

	destroy : function () {
		this.invokeMethodAndEnsureSuperCalled('onDestroy');
		var tasks = this.$attrs.tasks;
		for (var key in tasks) {
			var task = tasks[key];
			task.stop();
			delete tasks[key];
		}
	},

	onDestroy : function () {
		this.notifySuperCalled('onDestroy');
	},

	handleBackPressed : function () {
		if (this.$attrs.overlayManager.handleBackPressed())
			return;
		this.onBackPressed();
	},

	onBackPressed : function () {
		this.finish();
	},

	finish : function () {
		var im = InteractionManager.sharedInstance();
		im.finishInteraction(this.$attrs.context.uuid);
	},

	startInteraction : function (name, extra, request) {
		var im = InteractionManager.sharedInstance(), context = this.$attrs.context,
			parent = request ? context.uuid : undefined;
		if (!request)
			request = undefined;
		im.startInteraction(parent, request, name, extra);
	},

	getExtra : function () {
		return this.$attrs.context.extra;
	},

	setResult : function (result, data) {
		var context = this.$attrs.context;
		context.resultCode = result;
		context.resultData = data;
	},

	getSharedPreferences : function (name, shared) {
		return staple.application.getSharedPreferences(name, shared);
	},

	setContent : function (content) {
		if (!this.$attrs.creating)
			throw new Error('setContent() must be called during onCreate()');

		if (Object.isString(content)) {
			var elements = HTMLParser.parse(content);
			if (elements.length != 1)
				throw new Error('Invalid content');
			content = elements[0];
		}

		if (!(content instanceof HTMLElement) || content.tagName.toLowerCase() !== 'section')
			throw new Error('Content must be a <section> element');

		this.$attrs.root = content;
	},

	getTitle : function () {
		var root = this.$attrs.root, title = root ? root.dataset.title : undefined;
		return title ? title : staple.application.title;
	},

	setTitle : function (title) {
		this.$attrs.root.dataset.title = title;
		if (!this.$attrs.active)
			return;
		var reslovedTitle = title ? title : staple.application.title;
		staple.application.onTitleChanged(reslovedTitle);
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

	scheduleRunnable : function (runnable, ms, repeat) {
		var task = new PeriodicalTask(ms, repeat, runnable)
		task.runnable = runnable;
		this.$attrs.tasks[task.id()] = task;
		task.start();
	},

	cancelRunnables : function (runnable) {
		var tasks = this.$attrs.tasks;
		for (var key in tasks) {
			var task = tasks[key];
			if (task.runnable !== runnable)
				continue;
			task.stop();
			delete tasks[key];
		}
	},

});

});
