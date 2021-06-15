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
 * @file	core/application.js
 * @author	Eric.Tsai
 *
 */

// Base class of staple application.
define('staple/application', function (require, exports, module) {

	const TaskManager = require('staple/task-manager').default;

	const browserFeatureCheckers = {

		sessionStorage : function () {
			let storage = window.sessionStorage;
			if (!storage)
				return false;
			try {
				let [key, value] = ['staple:///test/staple', 'staple'];
				storage.setItem(key, value);
				let result = (value === storage.getItem(key));
				storage.removeItem(key);
				return result;
			} catch (e) {
				return false;
			}
		},

		localStorage : function () {
			let storage = window.localStorage;
			if (!storage)
				return false;
			try {
				let [key, value] = ['staple:///test/staple', 'staple'];
				storage.setItem(key, value);
				let result = (value === storage.getItem(key));
				storage.removeItem(key);
				return result;
			} catch (e) {
				return false;
			}
		},

		historyManagement : function () {
			let h = window.history;
			return typeof(h.pushState) === 'function' && typeof(h.replaceState) === 'function';
		},

	};

	const requiredBrowserFeatures = ['sessionStorage'];

	const [$attrs, $temps] = [Symbol(), Symbol()];

	class Preferences {

		constructor (key) {
			this[$attrs] = {key: key};
			this.load();
		}

		load () {
			let json = localStorage.getItem(this[$attrs].key) || '{}';
			this[$attrs].data = JSON.parse(json);
			return this;
		}

		put (key, value) {
			this[$attrs].data[key] = value;
			return this;
		}

		get (key) {
			return this[$attrs].data[key];
		}

		clear () {
			this[$attrs].data = {};
			return this;
		}

		get raw () {
			return this[$attrs].data;
		}

		commit () {
			let json = JSON.stringify(this[$attrs].data)
			localStorage.setItem(this[$attrs].key, json);
		}

	}

	class Application {

		constructor () {
			if (Application.sharedInstance)
				throw new Error('Instance of Application already exist.');
			Object.defineProperty(Application, "sharedInstance", {value: this});
			this[$attrs] = {};
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

		onCreate () {
			let taskManager = TaskManager.sharedInstance;
			taskManager.create();
			this.notifySuperCalled('onCreate');
		}

		resume () {
			this.invokeMethodAndEnsureSuperCalled('onResume');
		}

		onResume () {
			let taskManager = TaskManager.sharedInstance;
			taskManager.resume();
			this.notifySuperCalled('onResume');
		}

		pause () {
			this.invokeMethodAndEnsureSuperCalled('onPause');
		}

		onPause () {
			let taskManager = TaskManager.sharedInstance;
			taskManager.pause();
			let state = {};
			state.taskManager = taskManager.saveState();
			this.saveApplicationState(state);
			this.notifySuperCalled('onPause');
		}

		onTitleChanged (title) {
			window.document.title = title;
		}

		onTaskStarted (name) {
			// Default do nothing.
		}

		onTaskActivated (name, retiree) {
			// Default do nothing.
		}

		onTaskFinished (name) {
			// Default do nothing.
		}

		onLastTaskFinished () {
			let history = window.history;
			if (history.length > 2) {
				history.go(-2);
			} else {
				window.close();
			}
		}

		onDestroy () {
			let taskManager = TaskManager.sharedInstance;
			taskManager.destroy();
			this.notifySuperCalled('onDestroy');
		}

		onBrowserFeaturesNotSupport (features) {
			alert('Browser Features Not Support:\n' + JSON.stringify(features));
			// Do not continue by default.
			return false;
		}

		loadThenDeleteApplicationState () {
			let key = 'staple://' + this.namespace + '/imstate';
			let json = sessionStorage[key];
			if (!json)
				return undefined;
			sessionStorage.removeItem(key);
			return JSON.parse(json);
		}

		saveApplicationState (state) {
			let key = 'staple://' + this.namespace + '/imstate';
			sessionStorage.removeItem(key);
			if (!state)
				return;
			let json = JSON.stringify(state);
			sessionStorage[key] = json;
		}

		checkBrowserFeatures (features) {
			let list = [], checked = {};
			for (let i = 0, feature; feature = features[i]; ++i) {
				let checker = browserFeatureCheckers[feature];
				if (checked[feature])
					continue;
				checked[feature] = true;
				if (checker && checker())
					continue;
				list.push(feature);
			}
			return list;
		}

		start (home, interaction, task, extra) {
			let history = window.history, location = window.location,
				attrs = this[$attrs], features = this.meta['browser-features'],
				taskManager = TaskManager.sharedInstance;

			let historyManagement = window.document.head.meta['history-management'] != 'disable';

			// Check required browser features.
			features = features ? features.split(',') : [];
			features.concat(requiredBrowserFeatures);
			if (historyManagement)
				features.push('historyManagement');
			features = this.checkBrowserFeatures(features);

			if (features.length && this.onBrowserFeaturesNotSupport(features))
				return;

			attrs.url = location.origin + location.pathname;
			attrs.back = false;

			if (historyManagement) {
				if (history.state !== '$1') {
					history.replaceState('$0', '', attrs.url);
					history.pushState('$1', '', attrs.url);
				} else {
					history.back();
					attrs.back = true;
				}
			} else {
				if (location.hash !== '#$1')
					location.hash = '$1'
				else
					interaction = undefined;
			}

			this.invokeMethodAndEnsureSuperCalled('onCreate');

			let state = this.loadThenDeleteApplicationState();

			if (extra)
				extra = JSON.parse(extra);

			if (interaction) {
				taskManager.startTask('@auto', interaction, extra);
			} else if (state && state.taskManager) {
				taskManager.restoreState(state.taskManager);
			} else if (home) {
				taskManager.startTask(task || '@auto', home, undefined);
			} else {
				throw new Error('Home not specified.');
			}

			this.invokeMethodAndEnsureSuperCalled('onResume');

			if (historyManagement) {
				window.addEventListener('popstate', this.handlePopState.bind(this));
			} else {
				window.addEventListener('hashchange', this.handleHashChange.bind(this));
			}

			window.addEventListener('unload', this.handleUnload.bind(this));
		}

		handlePopState () {
			let history = window.history, attrs = this[$attrs];
			if (history.state == '$1') {
				history.back();
				attrs.back = true;
			} else if (attrs.back) {
				history.pushState('$1', '', attrs.url);
				attrs.back = false;
			} else {
				this.handleBackPressed();
				history.pushState('$1', '', attrs.url);
			}
		}

		handleHashChange () {
			let location = window.location;
			if (location.hash !== '#$1') {
				this.handleBackPressed();
				location.hash = '$1';
			}
		}

		handleBackPressed () {
			let taskManager = TaskManager.sharedInstance;
			taskManager.handleBackPressed();
		}

		handleUnload () {
			this.invokeMethodAndEnsureSuperCalled('onPause');
			this.invokeMethodAndEnsureSuperCalled('onDestroy');
		}

		getPreferences (name, shared) {
			let namespace = shared ? '' : this.namespace,
				key = 'staple://' + namespace + '/prefs/' + name;
			let preferences = new Preferences(key);
			return preferences;
		}

	}

	Object.defineProperty(exports, '__esModule', {value: true});
	Object.defineProperty(exports, 'Application', {value: Application});
	Object.defineProperty(exports, 'default', {value: Application});

});
