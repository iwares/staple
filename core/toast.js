/*
 * Copyright (C) 2016 iWARES Solution Provider
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
 * @file	core/toast.js
 * @author	Eric.Tsai
 *
 */

// Base class of staple toast.
define('staple/toast', function (require, exports, module) {

	const PeriodicalTask = require('staple/periodical-task').default;
	const HTMLParser = require('staple/html-parser').default;

	const $attrs = Symbol();

	class Toast {

		constructor (interaction, content, duration) {
			let attrs = this[$attrs] = {};

			duration = (duration == 'long') ? 3800 : 1800;

			attrs.fadeinTask = new PeriodicalTask(100, false);
			attrs.fadeinTask.run = () => {
				this[$attrs].frame.classList.add('staple-active');
			};

			attrs.fadeoutTask = new PeriodicalTask(duration, false);
			attrs.fadeoutTask.run = () => {
				this[$attrs].frame.classList.remove('staple-active');
				this[$attrs].dismissTask.start();
			};

			attrs.dismissTask = new PeriodicalTask(300, false);
			attrs.dismissTask.run = this.dismiss.bind(this);

			if (content)
				this.setContent(content);

			attrs.overlayManager = interaction.overlayManager;

			attrs.showing = false;
		}

		setContent (content) {
			let attrs = this[$attrs];
			if (attrs.frame)
				throw new Error('Cannot setContent for a toast after it is initialized');

			if (Object.prototype.toString.call(content) === '[object String]') {
				let elements = HTMLParser.parse(content);
				if (elements.length != 1)
					throw new Error('Invalid content');
				content = elements[0];
			}

			if (!(content instanceof HTMLElement))
				throw new Error('Content must be an HTML element');

			content.addEventListener('click', evt => {
				this.show();
				evt.stopPropagation();
			});
			content.classList.add('staple-toast');
			attrs.frame = this[$attrs].root = content;
			attrs.frame.handleBackPressed = this.handleBackPressed.bind(this);
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

			if (!attrs.showing) {
				attrs.showing = true;
				attrs.overlayManager.attach(attrs.frame);
			}

			attrs.fadeinTask.start(false);
			attrs.fadeoutTask.start(true);
			attrs.dismissTask.stop();
		}

		dismiss () {
			let attrs = this[$attrs];

			if (!attrs.showing)
				return;

			attrs.fadeoutTask.stop();
			attrs.fadeinTask.stop();
			attrs.dismissTask.stop();
			attrs.overlayManager.detach(attrs.frame);
			attrs.showing = false;
		}

		get showing () {
			return this[$attrs].showing;
		}

		handleBackPressed () {
			return false;
		}

	}

	Object.defineProperty(exports, '__esModule', {value: true});
	Object.defineProperty(exports, 'Toast', {value: Toast});
	Object.defineProperty(exports, 'default', {value: Toast});

});
