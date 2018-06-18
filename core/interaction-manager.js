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
 * @file	core/interaction-manager.js
 * @author	Eric.Tsai
 *
 */

define('staple/interaction-manager', function (require, exports, module) {

	const HTMLParser = require('staple/html-parser').default;
	const UUID = require('staple/uuid').default;

	const snippets = '' +
		'<article id="staple-interrupter"></article>' +
		'<article id="staple-desktop"></article>' +
		'';

	const $attrs = Symbol();

	class InteractionManager {

		constructor () {
			if (InteractionManager.sharedInstance)
				throw new Error('Instance of InteractionManager already exist.');
			this[$attrs] = {};
		}

		handleBackPressed () {
			let active = this[$attrs].active;
			if (!active)
				return;
			active.handleBackPressed();
		}

		create () {
			let body = window.document.body;

			// Initialize loading indicator.
			let attrs = this[$attrs];
			attrs.indicator = body.querySelector('article#staple-indicator');
			attrs.loading = false;

			let elements = HTMLParser.parse(snippets);

			// Initialize a interrupter used to interrupt user inputs when framework is busy.
			let interrupter = attrs.interrupter = elements[0];
			attrs.busy = false;
			interrupter.style.backgroundColor = 'transparent';
			body.appendChild(interrupter);

			// Initialize desktop.
			let desktop = attrs.desktop = elements[1];
			body.appendChild(desktop);

			// Reslove CSS prefix.
			let prefix = '', vendors = { Webkit: 'webkit', Moz: '', O: 'o' };
			for (let vendor in vendors) {
				if (desktop.style[vendor + 'TransitionProperty'] === undefined)
					continue;
				prefix = '-' + vendor.toLowerCase() + '-';
				break;
			}
			attrs.prefix = prefix;

			// Initialize interaction context stack.
			let contexts = attrs.contexts = [];
			contexts.remove = function(target) {
				let temp = this.concat();
				this.length = 0;
				for (let i = 0, context; context = temp[i]; ++i) {
					if (target === context)
						continue;
					this.push(context);
				}
				return this;
			};

			contexts.findByUUID = function(uuid) {
				for (let i = 0, context; context = this[i]; ++i) {
					if (context.uuid !== uuid)
						continue;
					return context;
				}
				return undefined;
			};

			contexts.top = function() {
				return this[this.length - 1];
			};

			attrs.active = attrs.previous = null;
			attrs.instances = {};
			attrs.maxInstanceCount = 8;
			attrs.paused = true;
		}

		pause () {
			let attrs = this[$attrs], interaction = attrs.active,
				contexts = attrs.contexts;

			if (attrs.paused)
				return;
			attrs.paused = true;

			if (contexts.length === 0 || !interaction)
				return;

			// Pause active interaction.
			let context = interaction[$attrs].context;
			interaction.pause();
			let state = {};
			interaction.performSaveInstanceState(state);
			context.state = state;
		}

		saveState () {
			if (this[$attrs].contexts.length === 0)
				return undefined;
			return { contexts : this[$attrs].contexts }
		}

		restoreState (state) {
			let attrs = this[$attrs], contexts = attrs.contexts;
			contexts.length = 0;
			Array.prototype.push.apply(contexts, state.contexts);
		}

		resume () {
			let attrs = this[$attrs], interaction = attrs.active;

			if (!attrs.paused)
				return;
			attrs.paused = false;

			if (interaction) {
				interaction.resume();
				return;
			}

			this.instantiateActivedInteraction();
		}

		destroy () {
			let attrs = this[$attrs], contexts = attrs.contexts,
				instances = attrs.instances;
			for (let i = contexts.length - 1, context; context = contexts[i]; --i) {
				let interaction = instances[context.uuid];
				if (!interaction)
					continue;
				interaction.destroy();
				delete instances[context.uuid];
			}
			contexts.length = 0;
		}

		startInteraction (parent, request, target, extra) {
			this.setBusy(true);
			if ("undefined" != typeof extra)
				extra = JSON.parse(JSON.stringify(extra));
			setTimeout(this.performStartInteraction.bind(this, parent, request, target, extra));
		}

		finishInteraction (uuid) {
			this.setBusy(true);
			setTimeout(this.performFinishInteraction.bind(this, uuid));
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

		performStartInteraction (parent, request, target, extra) {
			let attrs = this[$attrs], interaction = attrs.active,
				contexts = attrs.contexts,
				instances = attrs.instances;

			// Deactive actived interaction.
			if (interaction) {
				let context = contexts.top(), state = {};

				interaction.pause();
				interaction.performSaveInstanceState(state);
				context.state = state;

				attrs.previous = interaction;
				attrs.active = null;
			}

			// create context for new interaction.
			let context = {
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
				let excess = contexts[contexts.length - attrs.maxInstanceCount];
				let instance = instances[excess.uuid];
				if (instance)
					interaction.destroy();
				delete instances[excess.uuid];
			}

			// Push context to the stack and instantizte it.
			contexts.push(context);
			attrs.animation = 'start';
			this.instantiateActivedInteraction();
		}

		performFinishInteraction (uuid) {
			let attrs = this[$attrs], interaction = attrs.active,
				contexts = attrs.contexts,
				instances = attrs.instances;

			let context = contexts.findByUUID(uuid);
			if (!context)
				return;

			let parent = contexts.findByUUID(context.parent);
			if (parent) {
				let result = {
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
		}

		instantiateActivedInteraction () {
			// We are going to instantiate context which at the top of the stack.
			let attrs = this[$attrs], contexts = attrs.contexts,
				instances = attrs.instances;
			let context = contexts.top();

			if (!context || this[$attrs].paused)
				return;

			// lookup instance from the instance map.
			let interaction = instances[context.uuid];

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
			let require = window.require;
			require([context.name], this.doInteractionClassLoaded.bind(
				this, context
				));
		}

		doInteractionClassLoaded (context, clazz) {
			let attrs = this[$attrs], contexts = attrs.contexts;

			if (context != contexts.top())
				return;

			let interaction = new clazz.default($attrs, context);
			interaction[$attrs].context = context;

			interaction.create(context.state);
			this.doInteractionCreated(interaction);
		}

		doInteractionCreated (interaction) {
			let attrs = this[$attrs], contexts = attrs.contexts,
				instances = attrs.instances;
			let context = interaction[$attrs].context;

			if (context != contexts.top())
				return;

			instances[context.uuid] = interaction;
			this.setLoading(false);

			if (context.state)
				interaction.performRestoreInstanceState(context.state);
			delete context.state;

			let root = interaction[$attrs].root;
			if (!root)
				throw new Error('Please call setContent() during onCreate().');

			let EASINGI = 'cubic-bezier(.4,1,.6,1)',
				EASINGO = 'cubic-bezier(.4,0,.6,0)';

			let upper, lower, outer, ueasing, leasing, uanim, lanim, anim;

			// Reslove animation configuration.
			switch (attrs.animation) {
			case 'start':
				upper = interaction;
				lower = attrs.previous;
				outer = lower;
				anim = 'staple-it-' + (upper[$attrs].root.dataset.anim || 'default');
				uanim = anim + '-enter';
				ueasing = EASINGI;
				lanim = anim + '-push';
				leasing = EASINGO;
				attrs.desktop.appendChild(root);
				break;
			case 'finish':
				upper = attrs.previous;
				lower = interaction;
				outer = upper;
				anim = 'staple-it-' + (upper[$attrs].root.dataset.anim || 'default');
				uanim = anim + '-leave';
				ueasing = EASINGO;
				lanim = anim + '-pop';
				leasing = EASINGI;
				attrs.desktop.insertBefore(root, upper ? upper[$attrs].root : undefined);
				break;
			default:
				upper = interaction;
				attrs.desktop.appendChild(root);
				break;
			}

			// handle pending results.
			let results = context.pendingResults;
			// fatch and append external result.
			let key = 'staple:///results/' + context.uuid;
			let externalResult = sessionStorage[key];
			if (externalResult)
				results.push(externalResult.evalJSON());
			sessionStorage.removeItem(key);
			// dispatch pending results.
			for (let i = 0, r; r = results[i]; ++i)
				interaction.onInteractionResult(r.request, r.result, r.data);
			results.length = 0;

			interaction.resume();

			let upperCss = upper ? upper[$attrs].root.style.context : '';
			let lowerCss = lower ? lower[$attrs].root.style.context : '';

			function onAnimationComplete () {
				if (outer)
					attrs.desktop.removeChild(outer[$attrs].root);
				if (upper)
					upper[$attrs].root.style.cssText = upperCss;
				if (lower)
					lower[$attrs].root.style.cssText = lowerCss;
				this.setBusy(false);
			}

			if (anim && attrs.previous) {
				if (upper)
					upper[$attrs].root.style.cssText += ';'
						+ attrs.prefix + 'animation:' + uanim + ' .2s ' + ueasing + ';'
						+ attrs.prefix + 'animation-fill-mode: both' + ';';
				if (lower)
					lower[$attrs].root.style.cssText += ';'
						+ attrs.prefix + 'animation:' + lanim + ' .2s ' + leasing + ';'
						+ attrs.prefix + 'animation-fill-mode: both' + ';';
				setTimeout(onAnimationComplete.bind(this), 300);
			} else {
				onAnimationComplete.apply(this);
			}

			attrs.active = interaction;
		}

	}

	Object.defineProperty(InteractionManager, "sharedInstance", {value: new InteractionManager()});

	Object.defineProperty(exports, '__esModule', {value: true});
	Object.defineProperty(exports, 'InteractionManager', {value: InteractionManager});
	Object.defineProperty(exports, 'default', {value: InteractionManager});

});
