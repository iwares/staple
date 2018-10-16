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
 * @file	core/noumenon.js
 * @author	Eric.Tsai
 *
 */


(function () {


// Staple object.
const staple = {value: '1.1.1'};

// Preprocess all query parameters.
let args = JSON.parse(window.sessionStorage['staple:///args'] || '{}');

let search = window.location.search;
let interaction, extra, bust;

if (search) {
	let fields = search.substr(1).split('&');
	args = { };

	for (let i = 0, field; field = fields[i]; ++i) {
		let kv = field.split('=');
		switch (kv[0]) {
		case '_int':
			interaction = decodeURIComponent(kv[1]);
			break;
		case '_ext':
			extra = decodeURIComponent(kv[1]);
			break;
		case '_bust':
			bust = decodeURIComponent(kv[1]);
			break;
		default:
			args[kv[0]] = decodeURIComponent(kv[1]);
			break;
		}
	}

	window.sessionStorage['staple:///args'] = JSON.stringify(args);
}

// Collect all meta data.
let metaTags = window.document.head.querySelectorAll("meta");
let meta = { };
for (let i = 0, tag; tag = metaTags[i]; ++i)
	meta[tag.name] = tag.content;
window.document.head.meta = meta;

// Build a query string which will be used to bust the http cache.
bust = window.sessionStorage['staple:///bust'] || bust || meta['version-code'];
if (bust == 'timestamp')
	bust = (new Date()).getTime();
window.sessionStorage['staple:///bust'] = bust || '';

// Compute root path.
let mainScript = window.document.head.querySelector('script[data-main]');
let scriptPath = mainScript.dataset.main;
let base = mainScript.dataset.base;
let home = mainScript.dataset.home;
let stapleRoot = scriptPath.substr(0, scriptPath.lastIndexOf('/') + 1);

requirejs.config({
	'baseUrl': base || '',
	'urlArgs': bust ? '_bust=' + bust : undefined,
	'waitSeconds': 15,
	'paths': {
		'staple': stapleRoot + 'modules'
	},
});


// Entry of the staple framework.
require(['application', 'staple/application'], function (subclass, baseclass) {

	const Application = subclass.default;
	const BaseClass = baseclass.default;
	const application = staple.application = new Application();

	if (!application instanceof BaseClass)
		throw new Error(subclass.name + ' is not a subclass of "staple/application"');

	Object.defineProperty(application, 'namespace', {value: window.location.pathname});
	Object.defineProperty(application, 'title', {value: window.document.title});
	Object.defineProperty(application, 'meta', {value: window.document.head.meta});
	Object.defineProperty(application, 'args', {value: args});

	return application.start(home, interaction, extra);

});


// Export staple as a global variable.
window.staple = staple;


})();
