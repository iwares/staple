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
 * @file	core/snippets.js
 * @author	Eric.Tsai
 *
 */

// A module usd to load HTML snippets from an snippets file.
define('staple/snippets', function (require, exports, module) {

	const HTMLParser = require('staple/html-parser').default;
	const [loadersMap, snippetsMap] = [{}, {}];

	class SnippetsLoader {

		constructor (path, require, onload) {
			this.path = path;
			this.require = require;
			this.onload = onload;
		}

		notifyError (text) {
			let error = new Error('Failed to load snippet file: ' + this.path + '(' + text + ').');
			this.onload.error(error);
		}

		load () {
			let xhr = new XMLHttpRequest();
			xhr.open('get', this.require.toUrl(this.path + '.html'), true);
			xhr.onreadystatechange = evt => {
				if (xhr.readyState != 4)
					return;
				if (xhr.status != 200 && xhr.status != 0) // WKWebView returns 0 for file urls
					return this.onHTMLNotLoaded(xhr);
				this.onHTMLLoaded(xhr);
			};
			xhr.send();
		}

		onHTMLLoaded (xhr) {
			let html = this.html = xhr.responseText;

			// Find all NLS placeholders.
			let matches = html.match(/\[nls\@[a-zA-Z0-9\-\/_]+:[a-zA-Z0-9\-_]+\]/g);

			// No NLS placeholders, mark ready and return.
			if (!matches || !matches.length)
				return this.onNLSResolved();

			// Prepare to load NLS bundles.
			let nlsphs = this.nlsphs = [], names = [], namemap = {};
			for (let i = 0, match; match = matches[i]; ++i) {
				let pair = match.substr(5, match.length - 6).split(':');
				nlsphs.push({
					match : match,
					name : pair[0],
					key : pair[1],
				});
				if (namemap[pair[0]])
					continue;
				namemap[pair[0]] = true;
				names.push('staple/nls!' + pair[0]);
			}

			// Load NLS Bundles
			this.require(names, this.onNLSLoaded.bind(this));
		}

		onHTMLNotLoaded (xhr) {
			this.notifyError(xhr.status);
		}

		onNLSLoaded () {
			let nlsphs = this.nlsphs, html = this.html;

			// Build a lookup map for loaded NLS bundles.
			let bundles = {};
			for (let i = 0, bundle; bundle = arguments[i]; ++i)
				bundles[bundle.default['@name']] = bundle.default;

			// Replace all NLS placeholders with NLS strings.
			for (let i = 0, nlsph; nlsph = nlsphs[i]; ++i)
				html = html.replace(nlsph.match, bundles[nlsph.name][nlsph.key]);

			this.html = html;
			this.onNLSResolved();
		}

		onNLSResolved () {
			let html = this.html, head = window.document.head, snippets = {};

			for (let i = 0, els = HTMLParser.parse(html), el; el = els[i]; ++i) {
				switch (el.tagName.toLowerCase()) {
				case 'style':
					head.appendChild(el);
					break;
				case 'script':
					if (el.type !== 'text/html' || !el.id)
						break;
					Object.defineProperty(snippets, el.id, {value: el.innerHTML.trim()});
					break;
				default:
					break;
				}
			}

			Object.defineProperty(snippets, '__esModule', {value: true});
			Object.defineProperty(snippets, 'default', {value: snippets});
			this.onload(snippets);
		}

	}

	function load (name, require, onload, config) {
		if (config.isBuild)
			return onload(null);

		let loader = new SnippetsLoader(name, require, onload);
		loader.load();
	};

	exports.load = load;

});
