 /*
 * Copyright (C) 2021 iWARES Solution Provider
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
 * @file	core/task-manager.js
 * @author	Eric.Tsai
 *
 */

define('staple/task-manager', function (require, exports, module) {

	const $attrs = Symbol();

  const HTMLParser = require('staple/html-parser').default;
	const Task = require('staple/task').default;
	const UUID = require('staple/uuid').default;

  const snippets = '' +
		'<div id="staple-interrupter" class="staple-interrupter"></div>' +
		'<div id="staple-workspace" class="staple-workspace"></div>' +
		'';

	class TaskManager {

		constructor () {
			if (TaskManager.sharedInstance)
				throw new Error('Instance of TaskManager already exist.');
			this[$attrs] = {};
		}

		create () {
			let body = window.document.body;

			// Initialize loading indicator.
			let attrs = this[$attrs];
			let indicator = attrs.indicator = body.querySelector('#staple-indicator');
			attrs.loading = false;

			let elements = HTMLParser.parse(snippets);

			// Initialize a interrupter used to interrupt user inputs when framework is busy.
			let interrupter = attrs.interrupter = elements[0];
			attrs.busy = false;
			interrupter.style.backgroundColor = 'transparent';
			body.appendChild(interrupter);

			// Initialize workspace.
			let workspace = attrs.workspace = elements[1];
			body.appendChild(workspace);

			let tasks = attrs.tasks = [];
			tasks.remove = function(target) {
				let temp = this.concat();
				this.length = 0;
				for (let i = 0, task; task = temp[i]; ++i) {
					if (target === task)
						continue;
					this.push(task);
				}
				return this;
			};
			tasks.top = function() {
				return this[this.length - 1];
			};
			tasks.findByName = function(name) {
				for (let i = 0, task; task = this[i]; ++i)
					if (task.name == name)
						return task;
				return undefined;
			};

			attrs.maxTaskCount = 8;
			attrs.paused = true;
		}

		resume() {
			let attrs = this[$attrs];
			if (!attrs.paused)
				return;

			let task = attrs.tasks.top();
			if (task)
				task.resume(), staple.application.onTaskActivated(task.name, undefined);
			attrs.paused = false;
		}

		pause() {
			let attrs = this[$attrs];
			if (attrs.paused)
				return;

			let task = attrs.tasks.top();
			if (task)
				task.pause();
			attrs.paused = true;
		}

		destroy() {
			let tasks = this[$attrs].tasks;
			for (let task of tasks)
				task.destroy();
			tasks.length = 0;
		}

		saveState() {
			let attrs = this[$attrs], tasks = [];

			for (let task of attrs.tasks)
				tasks.push(task.saveState());

			if (tasks.length == 0)
				return undefined;

			return {tasks: tasks};
		}

		restoreState(state) {
			let attrs = this[$attrs], tasks = attrs.tasks;
			let taskStates = state.tasks;

			tasks.length = 0;
			for (let taskState of taskStates) {
				let task = new Task(this, undefined, $attrs);
				task.create();
				task.restoreState(taskState);
				tasks.push(task);
				staple.application.onTaskStarted(task.name);
			}
		}

		handleBackPressed () {
			let attrs = this[$attrs];
			if (attrs.paused)
				return;

			let task = attrs.tasks.top();
			if (!task)
				return;
			task.handleBackPressed();
		}

		startTask(name, interaction, extra) {
			let attrs = this[$attrs];

			name = (name && name != '@auto') ? name : UUID.randomUUID();
			let exist = attrs.tasks.findByName(name);
			if (exist)
				return name;

			let top = attrs.tasks.top();
			if (top && !attrs.paused)
				top.pause();

			let task = new Task(this, name, $attrs);
			attrs.tasks.push(task);
			task.create();
			if (!attrs.paused)
				task.resume();
			task.startInteraction(undefined, undefined, interaction, extra);
			staple.application.onTaskStarted(name);
			staple.application.onTaskActivated(name, top ? top.name : undefined);
			return name;
		}

		switchTask(name) {
			let attrs = this[$attrs];
			let task = attrs.tasks.findByName(name);
			if (!task)
				return;

			let top = attrs.tasks.top();
			if (task == top)
				return;

			attrs.tasks.remove(task);
			if (!attrs.paused) {
				top.pause();
				task.resume();
			}

			attrs.tasks.push(task);

			staple.application.onTaskActivated(task.name, top.name);
		}

		finishTask(name) {
			let attrs = this[$attrs];
			let task = attrs.tasks.findByName(name);
			if (!task)
				return;

			let isTop = (task == attrs.tasks.top());

			if (isTop && !attrs.paused)
				task.pause();

			task.destroy();
			attrs.tasks.remove(task);
			staple.application.onTaskFinished(name);

			let top = attrs.tasks.top();
			if (!top) {
				staple.application.onLastTaskFinished();
			} else if (isTop && !attrs.paused) {
				top.resume();
				staple.application.onTaskActivated(top.name, undefined);
			} else {
				// Do nothing.
			}
		}

		canGoBack (name) {
			let task = this[$attrs].tasks.findByName(name);
			if (!task)
				return false;
			return task.interactions > 1
		}

		hasTask (name) {
			let task = this[$attrs].tasks.findByName(name);
			return !!task;
		}

		setBusy (busy) {
			let attrs = this[$attrs];
			if (attrs.busy == busy)
				return;
			attrs.interrupter.style.zIndex = busy ? 2000000000 : 0;
			attrs.busy = busy;
		}

		setLoading (loading) {
			let attrs = this[$attrs];
			if (attrs.loading == loading)
				return;
			let classes = attrs.indicator.classList;
			if (loading)
				classes.add('staple-active');
			else
				classes.remove('staple-active');
			attrs.loading = loading;
		}

		get tasks () {
			let tasks = this[$attrs].tasks;
			let names = [];
			for (let task of tasks)
				names.push(task.name);
			return names;
		}

	}

	Object.defineProperty(TaskManager, "sharedInstance", {value: new TaskManager()});

	Object.defineProperty(exports, '__esModule', {value: true});
	Object.defineProperty(exports, 'TaskManager', {value: TaskManager});
	Object.defineProperty(exports, 'default', {value: TaskManager});

});
