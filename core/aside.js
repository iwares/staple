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
 * @file	core/aside.js
 * @author	Eric.Tsai
 *
 */

// Base class of staple aside.
define('staple/aside', function (require, exports, module) {

	const PeriodicalTask = require('staple/periodical-task').default;
	const HTMLParser = require('staple/html-parser').default;

	const $attrs = Symbol();

	class Aside {

		constructor (interaction, gravity, content) {
			let attrs = this[$attrs] = {};

			attrs.frame = window.document.createElement('div');
			attrs.frame.classList.add('staple-overlay-mask');
			attrs.frame.handleBackPressed = this.handleBackPressed.bind(this);

			attrs.gravity = gravity;

			if (content)
				this.setContent(content);

			attrs.overlayManager = interaction.overlayManager;

			let outsideTouchHandler = this.dismiss.bind(this);

			attrs.attachOutsideTouchHandler = function () {
				this.frame.addEventListener('click', outsideTouchHandler);
			};

			attrs.detachOutsideTouchHandler = function () {
				this.frame.removeEventListener('click', outsideTouchHandler);
			};

			attrs.fadeinTask = new PeriodicalTask(100, false);
			attrs.fadeinTask.run = () => {
				let root = this[$attrs].root;
				if (!root)
					return;
				root.classList.add('staple-active');
			};

			attrs.attachTask = new PeriodicalTask(800, false);
			attrs.attachTask.run = attrs.attachOutsideTouchHandler.bind(attrs);

			attrs.detachTask = new PeriodicalTask(300, false);
			attrs.detachTask.run = attrs.overlayManager.detach.bind(attrs.overlayManager, attrs.frame);

			attrs.showing = false;
		}

		setContent (content) {
			if (Object.prototype.toString.call(content) === '[object String]') {
				let elements = HTMLParser.parse(content);
				if (elements.length != 1)
					throw new Error('Invalid content');
				content = elements[0];
			}

			if (!(content instanceof HTMLElement))
				throw new Error('Content must be an HTML element');

			let attrs = this[$attrs];

			switch (attrs.gravity) {
			case 'bottom':
				content.classList.add('staple-aside-bottom');
				break;
			case 'top':
				content.classList.add('staple-aside-top');
				break;
			case 'right':
				content.classList.add('staple-aside-right');
				break;
			default:
				content.classList.add('staple-aside-left');
				break;
			}

			content.addEventListener('click', evt => evt.stopPropagation());
			content.classList.add('staple-aside');
			attrs.frame.innerHTML = '';
			attrs.frame.appendChild(this[$attrs].root = content);
		}

		select (selector) {
			let root = this[$attrs].root;
			if (selector === '$root')
				return [ root ];
			return $A(root.querySelectorAll(selector));
		}

		selectOne (selector) {
			let root = this[$attrs].root;
			if (selector === '$root')
				return root;
			return root.querySelector(selector);
		}

		show () {
			let attrs = this[$attrs];

			if (attrs.showing)
				return;

			attrs.showing = true;
			attrs.overlayManager.attach(attrs.frame);
			attrs.overlayManager.darken();

			attrs.fadeinTask.start(true);
			attrs.attachTask.start(true);
			attrs.detachTask.stop();
		}

		dismiss () {
			let attrs = this[$attrs];

			if (!attrs.showing)
				return;

			attrs.fadeinTask.stop();
			attrs.attachTask.stop();
			attrs.detachTask.start(true);
			attrs.detachOutsideTouchHandler();
			if (attrs.root)
				attrs.root.classList.remove('staple-active');
			attrs.overlayManager.lighten();
			attrs.showing = false;
		}

		get showing() {
			return this[$attrs].showing;
		}

		handleBackPressed () {
			this.dismiss();
			return true;
		}

	}

	Object.defineProperty(exports, '__esModule', {value: true});
	Object.defineProperty(exports, 'Aside', {value: Aside});
	Object.defineProperty(exports, 'default', {value: Aside});

});
