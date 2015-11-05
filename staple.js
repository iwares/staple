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
 * @file	staple.js
 * @author	Eric.Tsai
 *
 */

(function() {

// Collect all meta data.
var metaTags = window.document.head.querySelectorAll("meta");
var meta = { };
for (var i = 0, tag; tag = metaTags[i]; ++i)
	meta[tag.name] = tag.content;
window.document.head.meta = meta;

// Build a query string which will be used to bust the http cache.
var bust = sessionStorage && sessionStorage['$bust'];

if (!bust) {
	bust = location.search.match(/[\?\&]_bust=([^\&]+)/i);
	bust = (bust && bust.length > 1) ? decodeURIComponent(bust[1]) : meta['version'];
	if (bust == 'timestamp')
		bust = (new Date()).getTime();
	try {
		sessionStorage['$bust'] = bust;
	} catch (e) {
		// Do nothing.
	}
}

// Config bust.
requirejs.config({ urlArgs: '_bust=' + (bust || ''), waitSeconds: 15 });

// Load noumenon of the framework.
require(['noumenon'], function (noumenon) { });

})();
