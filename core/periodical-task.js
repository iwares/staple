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
 * @file	core/periodical-task.js
 * @author	Eric.Tsai
 *
 */

// Periodical task.
define('staple/periodical-task', function (require, exports, module) {

const $attrs = Symbol();

class PeriodicalTask {

	constructor (ms, repeat, runnable) {
		this[$attrs] = {
			runnable: runnable,
			ms: ms,
			repeat: repeat,
		};
	}

	handler () {
		let attrs = this[$attrs];
		if (!attrs.repeat)
			delete attrs.tid;
		let runnable = attrs.runnable || this;
		runnable.run();
	}

	start (restart) {
		let attrs = this[$attrs];
		if (attrs.tid) {
			if (!restart)
				return;
			let stopFunc = attrs.repeat ? clearInterval : clearTimeout;
			stopFunc(attrs.tid);
		}
		let startFunc = attrs.repeat ? setInterval : setTimeout;
		attrs.tid = startFunc(this.handler.bind(this), attrs.ms);
	}

	stop () {
		let attrs = this[$attrs];
		if (!attrs.tid)
			return;
		let stopFunc = attrs.repeat ? clearInterval : clearTimeout;
		stopFunc(attrs.tid);
		delete attrs.tid;
	}

	get running () {
		return this[$attrs].tid ? true : false;
	}

}

Object.defineProperty(exports, '__esModule', {value: true});
Object.defineProperty(exports, 'PeriodicalTask', {value: PeriodicalTask});
Object.defineProperty(exports, 'default', {value: PeriodicalTask});

});
