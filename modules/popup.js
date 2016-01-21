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

	initialize : function ($super, interaction, content, gravity) {
		$super();
		var attrs = this.$;

		attrs.frame = window.document.createElement('div');
		attrs.frame.id = 'popup';
		attrs.frame.handleBackPressed = this.handleBackPressed.bind(this);

		if (Object.isString(content)) {
			var elements = HTMLParser.parse(content);
			if (elements.length != 1)
				throw new Error('Invalid content');
			content = elements[0];
		}

		if (!(content instanceof HTMLElement) || content.tagName.toLowerCase() !== 'div')
			throw new Error('Content must be a <div> element');

		content.addEventListener('click', function (evt) { evt.stopPropagation(); });
		attrs.frame.appendChild(this.$.root = content);

		attrs.gravity = gravity;

		attrs.overlayManager = interaction.$.overlayManager;

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

	showAtLocation : function (x, y) {
		var attrs = this.$;
		attrs.x = x;
		attrs.y = y;

		if (!attrs.showing) {
			attrs.showing = true;
			attrs.overlayManager.attach(this);
			attrs.task.start(true);
		}

		this.adjustPopupPosition();
	},

	adjustPopupPosition : function () {
		var attrs = this.$;
		var ox = attrs.x, oy = attrs.y, x = ox, y = oy;

		var pgstrs = (attrs.gravity || '').replace(/\s+/g, '').split('|'), pgs = {};
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
		var attrs = this.$;
		var arect = anchor.getBoundingClientRect();

		var x = arect.left, y = arect.top;
		var agstrs = (gravity || '').replace(/\s+/g, '').split('|'), ags = {};
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
		this.$.gravity = gravity;
	},

	dismiss : function () {
		var attrs = this.$;

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
