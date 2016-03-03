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
 * @file	modules/periodical-task.js
 * @author	Eric.Tsai
 *
 */

// Periodical task.
define('staple/periodical-task', function (require, exports, module) {

var nextTaskId = 0;

return Class.create({

	initialize : function(ms, repeat, runnable) {
		var id = ++nextTaskId;
		this.$attrs = {
			id : id,
			runnable : runnable,
			ms : ms,
			repeat : repeat,
			};
	},

	handler : function () {
		var attrs = this.$attrs;
		if (!attrs.repeat)
			delete attrs.tid;
		var runnable = attrs.runnable || this;
		runnable.run();
	},

	start : function (restart) {
		var attrs = this.$attrs;
		if (attrs.tid) {
			if (!restart)
				return;
			var stopFunc = attrs.repeat ? clearInterval : clearTimeout;
			stopFunc(attrs.tid);
		}
		var startFunc = attrs.repeat ? setInterval : setTimeout;
		attrs.tid = startFunc(this.handler.bind(this), attrs.ms);
	},

	stop : function () {
		var attrs = this.$attrs;
		if (!attrs.tid)
			return;
		var stopFunc = attrs.repeat ? clearInterval : clearTimeout;
		stopFunc(attrs.tid);
		delete attrs.tid;
	},

	id : function () {
		return this.$attrs.id;
	},

	running : function () {
		return this.$attrs.tid ? true : false;
	},

});

});
