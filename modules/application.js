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
 * @file	modules/application.js
 * @author	Eric.Tsai
 *
 */

// Base class of staple application.
define('staple/application', function (require, exports, module) {

var SuperClass = require('staple/object');
var InteractionManager = require('staple/interaction-manager');

var created = false;

var STATE_KEY = 'staple/application/state';

var browserFeatureCheckers = {

	sessionStorage : function () {
		var storage = window.sessionStorage;
		if (!storage)
			return false;
		try {
			storage.setItem('#@!~', '~!@#');
			var result = ('~!@#' === storage.getItem('#@!~'));
			storage.removeItem('#@!~');
			return result;
		} catch (e) {
			return false;
		}
	},

	localStorage : function () {
		var storage = window.localStorage;
		if (!storage)
			return false;
		try {
			storage.setItem('#@!~', '~!@#');
			var result = ('~!@#' === storage.getItem('#@!~'));
			storage.removeItem('#@!~');
			return result;
		} catch (e) {
			return false;
		}
	},

};

return Class.create(SuperClass, {

	initialize : function ($super) {
		$super();
		if (created)
			throw new Error('Instance of Application already exist.');
		created = true;
	},

	onCreate : function () {
		this.notifySuperCalled('onCreate');
	},

	onResume : function () {
		this.notifySuperCalled('onResume');
	},

	onPause : function () {
		this.notifySuperCalled('onPause');
	},

	onTitleChanged : function (title) {
		window.document.title = title;
	},

	onLastInteractionFinished : function () {
		var history = window.history;
		if (history.length > 2) {
			history.go(-2);
		} else {
			window.close();
		}
	},

	onDestroy : function () {
		this.notifySuperCalled('onDestroy');
	},

	onBrowserFeaturesNotSupport : function (features) {
		alert('Browser Features Not Support:\n' + Object.toJSON(features));
		// Staple cannot work without sessionStorage.
		return features.include('sessionStorage');
	},

	loadThenDeleteApplicationState : function () {
		var key = this.namespace + '$' + STATE_KEY;
		var json = sessionStorage[key];
		if (!json)
			return undefined;
		sessionStorage.removeItem(key);
		return json.evalJSON();
	},

	saveApplicationState : function (state) {
		var key = this.namespace + '$' + STATE_KEY;
		sessionStorage.removeItem(key);
		if (!state)
			return;
		var json = Object.toJSON(state);
		sessionStorage[key] = json;
	},

	checkBrowserFeatures : function (features) {
		var list = [];
		for (var i = 0, feature; feature = features[i]; ++i) {
			var checker = browserFeatureCheckers[feature];
			if (checker && checker())
				continue;
			list.push(feature);
		}
		return list.length ? list : undefined;
	},

	start : function (home, interaction, extra) {
		var history = window.history, location = window.location,
			attrs = this.$, features = this.meta['browser-features'],
			im = InteractionManager.sharedInstance();

		// Check required browser features.
		features = features ? features.split(',') : [];
		features.push('sessionStorage');
		features = this.checkBrowserFeatures(features.uniq());

		if (features && this.onBrowserFeaturesNotSupport(features))
			return;

		attrs.url = location.origin + location.pathname;
		attrs.back = false;

		if (history.state !== '$1') {
			history.replaceState('$0', '', attrs.url);
			history.pushState('$1', '', attrs.url);
		} else {
			history.back();
			attrs.back = true;
		}

		this.invokeMethodAndEnsureSuperCalled('onCreate');

		var state = this.loadThenDeleteApplicationState();

		if (interaction) {
			im.startInteraction(undefined, undefined, interaction, extra);
		} else if (state && state.interactionManager) {
			im.resume(state.interactionManager)
		} else if (home) {
			im.startInteraction(undefined, undefined, home, extra);
		} else {
			throw new Error('Home not specified.');
		}

		window.addEventListener('popstate', this.handlePopState.bind(this));
		window.addEventListener('unload', this.handleUnload.bind(this));
	},

	handlePopState : function () {
		var history = window.history, attrs = this.$;
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
	},

	handleBackPressed : function () {
		var im = InteractionManager.sharedInstance();
		im.handleBackPressed();
	},

	handleUnload : function () {
		var im = InteractionManager.sharedInstance();

		var state = {};
		state.interactionManager = im.pause();

		this.saveApplicationState(state);

		this.invokeMethodAndEnsureSuperCalled('onDestroy');
	},

});

});
