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
 * @file	core/nls.js
 * @author	Eric.Tsai
 *
 */

// A module usd to load specified NLS(Native Language Support) bundle.
define('staple/nls', function (require, exports, module) {

	class NLSBundleLoader {

		constructor (bundle, languages, require, onload) {
			this.bundle = bundle;
			this.languages = languages;
			this.require = require;
			this.onload = onload;
		}

		load () {
			// Load master of NLS bundle.
			require([this.bundle + '/master'], this.onMasterLoaded.bind(this));
		}

		onMasterLoaded (master) {
			let parts = this.parts = [], needed = this.needed = [],
				names = [];
			let languages = this.languages;

			this.master = master = master.default;

			// Checkout which stand-alone NLS parts need to load.
			for (let i = languages.length - 1; i >= 0; --i) {
				let language = languages[i];
				if (!language)
					continue;
				language = language.toLowerCase();
				let value = master[language];
				if (!value)
					continue;
				parts.push(language);
				if (typeof value === 'object')
					continue;
				needed.push(language);
				names.push(this.bundle + '/' + language);
			}

			// Load needed stand-alone NLS parts
			this.require(names, this.onPartsLoaded.bind(this));
		}

		onPartsLoaded () {
			let master = this.master, needed = this.needed, parts = this.parts,
				values = {};

			// Add add stand-along NLS part to master.
			for (let i = 0; i < needed.length; ++i)
				master[needed[i]] = arguments[i].default;

			// Mixin all locale parts into a bundle.
			let bundle = {'@name' : this.bundle};
			for (let i = 0, source; source = master[parts[i]]; ++i)
				for (let prop in source)
					bundle[prop] = source[prop];

			// Create exports
			let exports = {};
			for (let prop in bundle)
				Object.defineProperty(exports, prop, {value: bundle[prop]});

			// Notify bundle loaded.
			Object.defineProperty(exports, '__esModule', {value: true});
			Object.defineProperty(exports, 'default', {value: exports});
			this.onload(exports);
		}

	}

	function load (name, require, onload, config) {
		if (config.isBuild)
			return onload(null)

		let languages = [];

		// Customized languages
		if (navigator.customizedLanguage)
			languages.push(navigator.customizedLanguage);

		// Browser languages
		if (navigator.language)
			languages.push(navigator.language);
		if (navigator.languages)
			languages = languages.concat(navigator.languages);

		// Default language
		languages.push('root');

		// Deduplicate
		let unique = [], map = {};
		for (let i = 0, lang; lang = languages[i]; ++i) {
			if (map[lang])
				continue;
			map[lang] = true;
			unique.push(lang);
		}
		languages = unique;

		// Load bundle.
		let loader = new NLSBundleLoader(name, languages, require, onload);
		loader.load();
	}

	exports.load = load;

});
