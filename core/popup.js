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
 * @file	core/popup.js
 * @author	Eric.Tsai
 *
 */

// Base class of staple popup.
define('staple/popup', function (require, exports, module) {

	const PeriodicalTask = require('staple/periodical-task').default;
	const HTMLParser = require('staple/html-parser').default;

	const $attrs = Symbol();

	class Popup {

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
			content.addEventListener('click', evt => evt.stopPropagation());
			content.classList.add('staple-popup');
			attrs.frame.innerHTML = '';
			attrs.frame.appendChild(this[$attrs].root = content);

			if (!attrs.showing)
				return;
			this.adjustPopupPosition();
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

		showAtLocation (x, y) {
			let attrs = this[$attrs];
			attrs.x = x;
			attrs.y = y;

			if (!attrs.showing) {
				attrs.showing = true;
				attrs.overlayManager.attach(attrs.frame);
				attrs.fadeinTask.start(true);
				attrs.attachTask.start(true);
				attrs.detachTask.stop();
			}

			this.adjustPopupPosition();
		}

		adjustPopupPosition () {
			let attrs = this[$attrs];

			if (!attrs.showing || !attrs.root)
				return;

			let ox = attrs.x, oy = attrs.y, x = ox, y = oy;

			let pgstrs = (attrs.gravity || '').replace(/\s+/g, '').split('|');
			for (let i = 0, pg; pg = pgstrs[i]; ++i) {
				switch (pg) {
				case 'left':
					x = ox;
					break;
				case 'top':
					y = oy;
					break;
				case 'right':
					x = ox - attrs.root.offsetWidth;
					break;
				case 'bottom':
					y = oy - attrs.root.offsetHeight;
					break;
				default:
					break;
				}
			}

			attrs.root.style.left = x + 'px';
			attrs.root.style.top = y + 'px';
		}

		showAsDropDown (anchor, tx, ty, gravity) {
			let arect = anchor.getBoundingClientRect();

			let x = arect.left, y = arect.top;
			let agstrs = (gravity || '').replace(/\s+/g, '').split('|');
			for (let i = 0, ag; ag = agstrs[i]; ++i) {
				switch (ag) {
				case 'left':
					x = arect.left;
					break;
				case 'top':
					y = arect.top;
					break;
				case 'right':
					x = arect.right;
					break;
				case 'bottom':
					y = arect.bottom;
					break;
				default:
					break;
				}
			}

			this.showAtLocation(x + (tx || 0), y + (ty || 0));
		}

		set gravity (gravity) {
			this[$attrs].gravity = gravity;
			return gravity;
		}

		get gravity () {
			return this[$attrs].gravity;
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
			attrs.showing = false;
		}

		get showing () {
			return this[$attrs].showing;
		}

		handleBackPressed () {
			this.dismiss();
			return true;
		}

	}

	Object.defineProperty(exports, '__esModule', {value: true});
	Object.defineProperty(exports, 'Popup', {value: Popup});
	Object.defineProperty(exports, 'default', {value: Popup});

});
