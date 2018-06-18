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
 * @file	core/html-parser.js
 * @author	Eric.Tsai
 *
 */

// HTML parser.
define('staple/html-parser', function (require, exports, module) {

	const factroy = window.document.createElement('div');

	class HTMLParser {

		constructor () {
			throw new Error('This class can not be initialized');
		}

	}

	HTMLParser.parse = function (html) {
		factroy.innerHTML = html;
		let children = factroy.children, result = [];
		for (let i = 0, child; child = children[i]; ++i)
			result.push(child);
		factroy.innerHTML = '';
		return result;
	}

	Object.defineProperty(exports, '__esModule', {value: true});
	Object.defineProperty(exports, 'HTMLParser', {value: HTMLParser});
	Object.defineProperty(exports, 'default', {value: HTMLParser});

});
