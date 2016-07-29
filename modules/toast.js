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
 * @file	modules/toast.js
 * @author	Eric.Tsai
 *
 */

// Base class of staple interaction.
define('staple/toast', function (require, exports, module) {

var SuperClass = require('staple/object');
var PeriodicalTask = require('staple/periodical-task');
var HTMLParser = require('staple/html-parser');

return Class.create(SuperClass, {

	initialize : function ($super, interaction, content, duration) {
		$super();
		var attrs = this.$attrs;

		duration = (duration == 'long') ? 3800 : 1800;

		attrs.fadeoutTask = new PeriodicalTask(duration, false);
		attrs.fadeoutTask.run = function () {
			this.$attrs.frame.classList.remove('staple-active');
			this.$attrs.dismissTask.start();
		}.bind(this);

		attrs.dismissTask = new PeriodicalTask(200, false);
		attrs.dismissTask.run = this.dismiss.bind(this);

		if (content)
			this.setContent(content);

		attrs.overlayManager = interaction.$attrs.overlayManager;

		attrs.showing = false;
	},

	setContent : function (content) {
		var attrs = this.$attrs;
		if (attrs.frame)
			throw new Error('Cannot setContent for a toast after it is initialized');

		if (Object.isString(content)) {
			var elements = HTMLParser.parse(content);
			if (elements.length != 1)
				throw new Error('Invalid content');
			content = elements[0];
		}

		if (!(content instanceof HTMLElement) || content.tagName.toLowerCase() !== 'div')
			throw new Error('Content must be a <div> element');

		content.addEventListener('click', function (evt) {
			this.show();
			evt.stopPropagation();
		}.bind(this));
		content.classList.add('staple-toast');
		attrs.frame = this.$attrs.root = content;
		attrs.frame.handleBackPressed = this.handleBackPressed.bind(this);
	},

	show : function () {
		var attrs = this.$attrs;

		if (!attrs.showing) {
			attrs.showing = true;
			attrs.overlayManager.attach(this);
		}

		attrs.frame.classList.add('staple-active');
		attrs.dismissTask.stop();
		attrs.fadeoutTask.start(true);
	},

	dismiss : function () {
		var attrs = this.$attrs;

		if (!attrs.showing)
			return;

		attrs.dismissTask.stop();
		attrs.fadeoutTask.stop();
		attrs.overlayManager.detach(this);
		attrs.showing = false;
	},

	handleBackPressed : function () {
		return false;
	},

});

});
