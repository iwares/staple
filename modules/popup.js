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
 * @file	modules/popup.js
 * @author	Eric.Tsai
 *
 */

// Base class of staple interaction.
define('staple/popup', function (require, exports, module) {

var SuperClass = require('staple/object');
var PeriodicalTask = require('staple/periodical-task');
var HTMLParser = require('staple/html-parser');

return Class.create(SuperClass, {

	initialize : function ($super, interaction, gravity, content) {
		$super();
		var attrs = this.$attrs;

		attrs.frame = window.document.createElement('div');
		attrs.frame.classList.add('staple-overlay-mask');
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

		attrs.attachTask = new PeriodicalTask(800, false);
		attrs.attachTask.run = attrs.attachOutsideTouchHandler.bind(attrs);

		attrs.detachTask = new PeriodicalTask(200, false);
		attrs.detachTask.run = attrs.overlayManager.detach.bind(attrs.overlayManager, this);

		attrs.showing = false;
	},

	setContent : function (content) {
		if (Object.isString(content)) {
			var elements = HTMLParser.parse(content);
			if (elements.length != 1)
				throw new Error('Invalid content');
			content = elements[0];
		}

		if (!(content instanceof HTMLElement) || content.tagName.toLowerCase() !== 'div')
			throw new Error('Content must be a <div> element');

		var attrs = this.$attrs;
		content.addEventListener('click', function (evt) { evt.stopPropagation(); });
		content.classList.add('staple-popup');
		attrs.fadeinTask = new PeriodicalTask(100, false);
		attrs.fadeinTask.run = content.classList.add.bind(content.classList, 'staple-active');
		attrs.frame.innerHTML = '';
		attrs.frame.appendChild(this.$attrs.root = content);

		if (!attrs.showing)
			return;
		this.adjustPopupPosition();
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

	showAtLocation : function (x, y) {
		var attrs = this.$attrs;
		attrs.x = x;
		attrs.y = y;

		if (!attrs.showing) {
			attrs.showing = true;
			attrs.overlayManager.attach(this);
			attrs.fadeinTask.start(true);
			attrs.attachTask.start(true);
			attrs.detachTask.stop();
		}

		this.adjustPopupPosition();
	},

	adjustPopupPosition : function () {
		var attrs = this.$attrs;

		if (!attrs.showing || !attrs.root)
			return;

		var ox = attrs.x, oy = attrs.y, x = ox, y = oy;

		var pgstrs = (attrs.gravity || '').replace(/\s+/g, '').split('|');
		for (var i = 0, pg; pg = pgstrs[i]; ++i) {
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
	},

	showAsDropDown : function (anchor, tx, ty, gravity) {
		var arect = anchor.getBoundingClientRect();

		var x = arect.left, y = arect.top;
		var agstrs = (gravity || '').replace(/\s+/g, '').split('|');
		for (var i = 0, ag; ag = agstrs[i]; ++i) {
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
	},

	setGravity : function (gravity) {
		this.$attrs.gravity = gravity;
	},

	dismiss : function () {
		var attrs = this.$attrs;

		if (!attrs.showing)
			return;

		attrs.fadeinTask.stop();
		attrs.attachTask.stop();
		attrs.detachTask.start(true);
		attrs.detachOutsideTouchHandler();
		attrs.root.classList.remove('staple-active');
		attrs.showing = false;
	},

	handleBackPressed : function () {
		this.dismiss();
		return true;
	},

});

});
