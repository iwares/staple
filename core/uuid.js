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
 * @file	core/uuid.js
 * @author	Eric.Tsai
 *
 */

// UUID generator.
define('staple/uuid', function (require, exports, module) {

	const CHARS = "0123456789ABCDEF".split("");

	class UUID {

		constructor () {
			throw new Error('This class can not be initialized');
		}

	}

	UUID.randomUUID = function () {
		let chars = CHARS, uuid = new Array(36), rnd=0, r;
		for (let i = 0; i < 36; i++) {
			if (i==8 || i==13 || i==18 || i==23) {
				uuid[i] = "-";
			} else if (i==14) {
				uuid[i] = "4";
			} else {
				if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
				r = rnd & 0xf;
				rnd = rnd >> 4;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
		return uuid.join("");
	};

	Object.defineProperty(exports, '__esModule', {value: true});
	Object.defineProperty(exports, 'UUID', {value: UUID});
	Object.defineProperty(exports, 'default', {value: UUID});

});
