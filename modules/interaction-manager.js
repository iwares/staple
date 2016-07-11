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
 * @file	modules/interaction-manager.js
 * @author	Eric.Tsai
 *
 */

define('staple/interaction-manager', function (require, exports, module) {

var SuperClass = require('staple/object');
var HTMLParser = require('staple/html-parser');
var UUID = require('staple/uuid');

var created = false;

var snippets = '' +
	'<article id="interrupter"></article>' +
	'<article id="desktop"></article>' +
	'';

var Clazz = Class.create(SuperClass, {

	initialize : function ($super) {
		$super();
		if (created)
			throw new Error('Instance of InteractionManager already exist.');
		created = true;
	},

	handleBackPressed : function () {
		var active = this.$attrs.active;
		if (!active)
			return;
		active.handleBackPressed();
	},

	create : function () {
		var body = window.document.body;

		// Initialize loading indicator.
		var attrs = this.$attrs;
		attrs.indicator = body.firstElementChild;
		attrs.loading = false;

		var elements = HTMLParser.parse(snippets);

		// Initialize a interrupter used to interrupt user inputs when framework is busy.
		var interrupter = attrs.interrupter = elements[0];
		attrs.busy = false;
		interrupter.style.backgroundColor = 'transparent';
		body.appendChild(interrupter);

		// Initialize desktop.
		var desktop = attrs.desktop = elements[1];
		body.appendChild(desktop);

		// Reslove CSS prefix.
		var prefix = '', vendors = { Webkit: 'webkit', Moz: '', O: 'o' };
		for (var vendor in vendors) {
			if (desktop.style[vendor + 'TransitionProperty'] === undefined)
				continue;
			prefix = '-' + vendor.toLowerCase() + '-';
			break;
		}
		attrs.prefix = prefix;

		// Initialize interaction context stack.
		var contexts = attrs.contexts = [];
		Object.extend(contexts, {
			remove : function(context) {
				var temp = this.concat();
				this.clear();
				temp.each(function(val) {
					if (val !== context)
						this.push(val);
				}, this);
				return this;
			},
			findByUUID : function(uuid) {
				for (var i = 0, context; context = this[i]; ++i) {
					if (context.uuid !== uuid)
						continue;
					return context;
				}
				return undefined;
			},
			top : function() {
				return this[this.length - 1];
			},
		});

		attrs.active = attrs.previous = null;
		attrs.instances = {};
		attrs.maxInstanceCount = 8;
		attrs.paused = true;
	},

	pause : function () {
		var attrs = this.$attrs, interaction = attrs.active,
			contexts = attrs.contexts;

		if (attrs.paused)
			return;
		attrs.paused = true;

		if (contexts.length === 0 || !interaction)
			return;

		// Pause active interaction.
		var context = interaction.$attrs.context;
		interaction.pause();
		var state = {};
		interaction.performSaveInstanceState(state);
		context.state = state;
	},

	saveState : function () {
		if (this.$attrs.contexts.length === 0)
			return undefined;
		return { contexts : this.$attrs.contexts }
	},

	restoreState : function (state) {
		var attrs = this.$attrs, contexts = attrs.contexts;
		contexts.clear();
		Array.prototype.push.apply(contexts, state.contexts);
	},

	resume : function () {
		var attrs = this.$attrs, interaction = attrs.active;

		if (!attrs.paused)
			return;
		attrs.paused = false;

		if (interaction) {
			interaction.resume();
			return;
		}

		this.instantiateActivedInteraction();
	},

	destroy : function () {
		var attrs = this.$attrs, contexts = attrs.contexts,
			instances = attrs.instances;
		for (var i = contexts.length - 1, context; context = contexts[i]; --i) {
			var interaction = instances[context.uuid];
			if (!interaction)
				continue;
			interaction.destroy();
			delete instances[context.uuid];
		}
		contexts.clear();
	},

	startInteraction : function (parent, request, target, extra) {
		this.setBusy(true);
		setTimeout(this.performStartInteraction.bind(this, parent, request, target, extra));
	},

	finishInteraction : function (uuid) {
		this.setBusy(true);
		setTimeout(this.performFinishInteraction.bind(this, uuid));
	},

	setBusy : function (busy) {
		var attrs = this.$attrs;
		if (attrs.busy == busy)
			return;
		attrs.interrupter.style.zIndex = busy ? 1000000 : 0;
		attrs.busy = busy;
	},

	setLoading : function (loading) {
		var attrs = this.$attrs;
		if (attrs.loading == loading)
			return;
		var classes = attrs.indicator.classList;
		if (loading)
			classes.add('active');
		else
			classes.remove('active');
		attrs.loading = loading;
	},

	performStartInteraction : function (parent, request, target, extra) {
		var attrs = this.$attrs, interaction = attrs.active,
			contexts = attrs.contexts,
			instances = attrs.instances;

		// Deactive actived interaction.
		if (interaction) {
			var context = contexts.top(), state = {};

			interaction.pause();
			interaction.performSaveInstanceState(state);
			context.state = state;

			attrs.previous = interaction;
			attrs.active = null;
		}

		// create context for new interaction.
		var context = {
			uuid : UUID.randomUUID(),
			parent : parent,
			requestCode : request,
			name : target,
			extra : extra,
			resultCode : 'CANCEL',
			resultData : undefined,
			pendingResults : []
		};

		// Clean up instances if the stack size is to large.
		if (contexts.length >= attrs.maxInstanceCount) {
			var excess = contexts[contexts.length - attrs.maxInstanceCount];
			var instance = instances[excess.uuid];
			if (instance)
				interaction.destroy();
			delete instances[excess.uuid];
		}

		// Push context to the stack and instantizte it.
		contexts.push(context);
		attrs.animation = 'start';
		this.instantiateActivedInteraction();
	},

	performFinishInteraction : function (uuid) {
		var attrs = this.$attrs, interaction = attrs.active,
			contexts = attrs.contexts,
			instances = attrs.instances;

		var context = contexts.findByUUID(uuid);
		if (!context)
			return;

		var parent = contexts.findByUUID(context.parent);
		if (parent) {
			var result = {
				request : context.requestCode,
				result : context.resultCode,
				data : context.resultData,
			};
			parent.pendingResults.push(result);
		}

		delete instances[context.uuid];

		if (context !== contexts.top()) {
			contexts.remove(context);
			return;
		}

		var interaction = attrs.active;
		interaction.pause();
		interaction.destroy();

		attrs.previous = interaction;
		attrs.active = null;
		contexts.remove(context);

		if (contexts.length == 0) {
			staple.application.onLastInteractionFinished()
			attrs.desktop.innerHTML = '';
			return;
		}

		attrs.animation = 'finish';
		this.instantiateActivedInteraction();
	},

	instantiateActivedInteraction : function () {
		// We are going to instantiate context which at the top of the stack.
		var attrs = this.$attrs, contexts = attrs.contexts,
			instances = attrs.instances;
		var context = contexts.top();

		if (!context || this.$attrs.paused)
			return;

		// lookup instance from the instance map.
		var interaction = instances[context.uuid];

		if (interaction) {
			// instance exists, we don't need to restore state
			// just delete saved state.
			delete context.state;
			this.doInteractionCreated(interaction);
			return;
		}

		// We are going to do some async jobs, set the loading flag to true.
		this.setLoading(true);

		// Async load interaction class
		var require = window.require;
		require([context.name], this.doInteractionClassLoaded.bind(
			this, context
			));
	},

	doInteractionClassLoaded : function (context, clazz) {
		var attrs = this.$attrs, contexts = attrs.contexts;

		if (context != contexts.top())
			return;

		var interaction = new clazz();
		interaction.$attrs.context = context;

		interaction.create();
		this.doInteractionCreated(interaction);
	},

	doInteractionCreated : function (interaction) {
		var attrs = this.$attrs, contexts = attrs.contexts,
			instances = attrs.instances;
		var context = interaction.$attrs.context;

		if (context != contexts.top())
			return;

		instances[context.uuid] = interaction;
		this.setLoading(false);

		if (context.state)
			interaction.performRestoreInstanceState(context.state);
		delete context.state;

		var root = interaction.$attrs.root;
		if (!root)
			throw new Error('Please call setContent() during onCreate().');

		var EASINGI = 'cubic-bezier(.4,1,.6,1)',
			EASINGO = 'cubic-bezier(.4,0,.6,0)';
		var top, out, easing;
		var anim;// = root.dataset.anim ? root.dataset.anim : 'default';

		// Reslove animation configuration.
		switch (attrs.animation) {
		case 'start':
			top = interaction;
			out = attrs.previous;
			attrs.desktop.appendChild(root);
			easing = EASINGI;
			anim = 'staple-it-' + (top.$attrs.root.dataset.anim || 'default');
			break;
		case 'finish':
			top = attrs.previous;
			out = attrs.previous;
			attrs.desktop.insertBefore(root, top ? top.$attrs.root : undefined);
			easing = EASINGO;
			anim = 'staple-it-' + (top.$attrs.root.dataset.anim || 'default') + '-out';
			break;
		default:
			top = interaction;
			out = undefined;
			attrs.desktop.appendChild(root);
			easing = undefined;
			anim = undefined;
			break;
		}

		// handle pending results.
		var results = context.pendingResults;
		// fatch and append external result.
		var key = 'staple:///results/' + context.uuid;
		var externalResult = sessionStorage[key];
		if (externalResult)
			results.push(externalResult.evalJSON());
		sessionStorage.removeItem(key);
		// dispatch pending results.
		for (var i = 0, r; r = results[i]; ++i)
			interaction.onInteractionResult(r.request, r.result, r.data);
		results.clear();

		interaction.resume();
		var cssText = top ? top.$attrs.root.style.cssText : '';

		function onAnimationComplete () {
			if (top)
				top.$attrs.root.style.cssText = cssText;
			if (out)
				attrs.desktop.removeChild(out.$attrs.root);
			this.setBusy(false);
		}

		if (anim && out) {
			top.$attrs.root.style.cssText += ';' + attrs.prefix + 'animation:' + anim + ' .2s ' + easing;
			top.$attrs.root.style.cssText += ';' + attrs.prefix + 'animation-fill-mode: both';
			setTimeout(onAnimationComplete.bind(this), 300);
		} else {
			onAnimationComplete.apply(this);
		}

		attrs.active = interaction;
	},

});

var sharedInstance = undefined;

Clazz.sharedInstance = function () {
	if (!sharedInstance)
		sharedInstance = new Clazz();
	return sharedInstance;
};

return Clazz;

});
