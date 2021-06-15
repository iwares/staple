/*
 * Copyright (C) 2018 iWARES Solution Provider
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
 * @file	core/interaction.js
 * @author	Eric.Tsai
 *
 */

// Base class of staple interaction.
define('staple/interaction', function (require, exports, module) {

	const Application = require('staple/application').default;
	const HTMLParser = require('staple/html-parser').default;
	const PeriodicalTask = require('staple/periodical-task').default;

	const [$attrs, $temps] = [Symbol(), Symbol()];

	class OverlayManager {

		constructor () {
			this.panel = window.document.createElement('div');
			this.panel.id = 'staple-overlay';
			this.panel.classList.add('staple-overlay');
			this.updater = new PeriodicalTask(100, false, this);
			this.darkness = 0;
		}

		resume () {
			window.document.body.appendChild(this.panel);
			this.updater.start(true);
		}

		pause () {
			this.updater.stop();
			window.document.body.removeChild(this.panel);
		}

		darken () {
			++this.darkness;
			this.updater.start(true);
		}

		lighten () {
			--this.darkness;
			this.updater.start(true);
		}

		run () {
			let panel = this.panel;

			if (panel.childElementCount === 0)
				panel.classList.remove('staple-active');
			else
				panel.classList.add('staple-active');

			if (this.darkness === 0)
				panel.classList.remove('staple-overlay-dim');
			else
				panel.classList.add('staple-overlay-dim');
		}

		attach (overlay) {
			this.panel.appendChild(overlay);
			this.updater.start(true);
		}

		detach (overlay) {
			this.panel.removeChild(overlay);
			this.run();
		}

		handleBackPressed () {
			let target = this.panel.lastElementChild;
			while (target) {
				if (target.handleBackPressed())
					return true;
				target = target.previousElementSibling;
			}
			return false;
		}

	}

	class Interaction {

		constructor (task, $peeker, context) {
			this[$attrs] = this[$peeker] = {task: task, context: context};
			this[$temps] = {};
		}

		invokeMethodAndEnsureSuperCalled (method) {
			this[$temps][method] = false;
			let result = this[method].apply(this, Array.prototype.slice.call(arguments, 1));
			if (this[$temps][method] != method)
				throw new Error('super.' + method + '() not called in ' + this.constructor.name + '.' + method + '()');
			delete this[$temps][method];
			return result;
		}

		notifySuperCalled (method) {
			this[$temps][method] = method;
		}

		create (state) {
			let attrs = this[$attrs];
			attrs.active = false;
			attrs.tasks = {};
			attrs.overlayManager = new OverlayManager();

			attrs.creating = true;
			this.invokeMethodAndEnsureSuperCalled('onCreate', state);
			delete attrs.creating;

			// Delegate click event.
			this[$attrs].root.onclick = event => {
				let target = event.target;
				while (target) {
					let handler = this[target.getAttribute('staple:click')];
					if (Object.prototype.toString.call(handler) === '[object Function]') {
						handler.call(this, target);
						event.preventDefault();
						break;
					}
					target = target.parentElement;
				}
			};
		}

		onCreate (state) {
			this.notifySuperCalled('onCreate');
		}

		performRestoreInstanceState (state) {
			this.onRestoreInstanceState(state);
		}

		onRestoreInstanceState (state) {
			// Default do nothing.
		}

		resume () {
			this[$attrs].active = true;
			Application.sharedInstance.onTitleChanged(this.getTitle());
			this[$attrs].overlayManager.resume();
			this.invokeMethodAndEnsureSuperCalled('onResume');
		}

		onResume () {
			this.notifySuperCalled('onResume');
		}

		onInteractionResult (request, result, data) {
			// Default do nothing.
		}

		pause () {
			this.invokeMethodAndEnsureSuperCalled('onPause');
			this[$attrs].overlayManager.pause();
			this[$attrs].active = false;
		}

		onPause () {
			this.notifySuperCalled('onPause');
		}

		performSaveInstanceState (state) {
			this.onSaveInstanceState(state);
		}

		onSaveInstanceState (state) {
			// Default do nothing.
		}

		destroy () {
			this.invokeMethodAndEnsureSuperCalled('onDestroy');
			let tasks = this[$attrs].tasks;
			for (let key in tasks) {
				let task = tasks[key];
				task.stop();
				delete tasks[key];
			}
		}

		onDestroy () {
			this.notifySuperCalled('onDestroy');
		}

		handleBackPressed () {
			if (this[$attrs].overlayManager.handleBackPressed())
				return;
			this.onBackPressed();
		}

		onBackPressed () {
			this.finish();
		}

		finish () {
			let task = this[$attrs].task;
			task.finishInteraction(this[$attrs].context.uuid);
		}

		startInteraction (name, extra, request) {
			let task = this[$attrs].task, context = this[$attrs].context,
				parent = request ? context.uuid : undefined;
			if (!request)
				request = undefined;
			task.startInteraction(parent, request, name, extra);
		}

		getExtra () {
			return this.extra;
		}

		get extra () {
			return this[$attrs].context.extra;
		}

		getUUID () {
			return this.uuid;
		}

		get uuid () {
			return this[$attrs].context.uuid;
		}

		get overlayManager () {
			return this[$attrs].overlayManager;
		}

		getApplication () {
			return this.application;
		}

		get application () {
			return Application.sharedInstance;
		}

		setResult (result, data) {
			let context = this[$attrs].context;
			context.resultCode = result;
			context.resultData = data;
		}

		getPreferences (name, shared) {
			return Application.sharedInstance.getPreferences(name, shared);
		}

		setContent (content) {
			if (!this[$attrs].creating)
				throw new Error('setContent() must be called during onCreate()');

			if (Object.prototype.toString.call(content) === '[object String]') {
				let elements = HTMLParser.parse(content);
				if (elements.length != 1)
					throw new Error('Invalid content');
				content = elements[0];
			}

			if (!(content instanceof HTMLElement))
				throw new Error('Content must be an HTML element');

			content.classList.add('staple-interaction');
			this[$attrs].root = content;
		}

		getTitle () {
			let root = this[$attrs].root, title = root ? root.dataset.title : undefined;
			return title ? title : Application.sharedInstance.title;
		}

		setTitle (title) {
			this[$attrs].root.dataset.title = title;
			if (!this[$attrs].active)
				return title;
			let reslovedTitle = title ? title : Application.sharedInstance.title;
			Application.sharedInstance.onTitleChanged(reslovedTitle);
			return title;
		}

		get title () {
			return getTitle();
		}

		set title (title) {
			return setTitle(title);
		}

		select(selector) {
			let root = this[$attrs].root;
			if (selector === '$root')
				return [ root ];
			return $A(root.querySelectorAll(selector));
		}

		selectOne(selector) {
			let root = this[$attrs].root;
			if (selector === '$root')
				return root;
			return root.querySelector(selector);
		}

		scheduleRunnable (runnable, ms, repeat) {
			let task = new PeriodicalTask(ms, repeat, runnable)
			task.runnable = runnable;
			this[$attrs].tasks[task.id] = task;
			task.start();
			return task.id;
		}

		cancelRunnables (runnable) {
			let tasks = this[$attrs].tasks;

			if (Number.isInteger(runnable)) {
				let task = tasks[runnable];
				if (task) {
					task.stop();
					delete tasks[runnable];
				}
			} else {
				for (let key in tasks) {
					let task = tasks[key];
					if (task.runnable !== runnable)
						continue;
					task.stop();
					delete tasks[key];
				}
			}
		}

	}

	Object.defineProperty(exports, '__esModule', {value: true});
	Object.defineProperty(exports, 'Interaction', {value: Interaction});
	Object.defineProperty(exports, 'default', {value: Interaction});

});
