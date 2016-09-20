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
 * @file	noumenon.js
 * @author	Eric.Tsai
 *
 */

/* This is a trimmed version of prototypejs v1.7.3.
 * We build prototypejs with following patch:
 *
 *   From d8d5f4c3c190dbc66197dbdccb54b215a5c63467 Mon Sep 17 00:00:00 2001
 *   From: "Eric.Tsai" <xiaodong.cai.ks@gmail.com>
 *   Date: Mon, 19 Oct 2015 12:20:51 +0800
 *   Subject: [PATCH] =?UTF-8?q?=E8=A3=81=E5=87=8F=E6=8E=89DOM=E7=9B=B8?=
 *    =?UTF-8?q?=E5=85=B3=E5=8A=9F=E8=83=BD?=
 *   MIME-Version: 1.0
 *   Content-Type: text/plain; charset=UTF-8
 *   Content-Transfer-Encoding: 8bit
 *   
 *   ---
 *    src/prototype.js      | 2 --
 *    src/prototype/ajax.js | 2 --
 *    2 files changed, 4 deletions(-)
 *   
 *   diff --git a/src/prototype.js b/src/prototype.js
 *   index f493a74..79488e7 100644
 *   --- a/src/prototype.js
 *   +++ b/src/prototype.js
 *   @@ -2,5 +2,3 @@
 *    //= require "./prototype/prototype"
 *    //= require "./prototype/lang"
 *    //= require "./prototype/ajax"
 *   -//= require "./prototype/dom"
 *   -//= require "./prototype/deprecated"
 *   diff --git a/src/prototype/ajax.js b/src/prototype/ajax.js
 *   index 55f2375..16a6114 100644
 *   --- a/src/prototype/ajax.js
 *   +++ b/src/prototype/ajax.js
 *   @@ -4,8 +4,6 @@
 *    //= require "ajax/base"
 *    //= require "ajax/request"
 *    //= require "ajax/response"
 *   -//= require "ajax/updater"
 *   -//= require "ajax/periodical_updater"
 *   
 *    /**
 *     *  == Ajax ==
 *   --
 *   2.3.8 (Apple Git-58)
 *
 * and then compress it using "uglifyjs" with "-c -m -r '$super'" options.
 * 
 */
function $A(t){if(!t)return[];if("toArray"in Object(t))return t.toArray();for(var e=t.length||0,n=new Array(e);e--;)n[e]=t[e];return n}function $w(t){return Object.isString(t)?(t=t.strip(),t?t.split(/\s+/):[]):[]}function $H(t){return new Hash(t)}function $R(t,e,n){return new ObjectRange(t,e,n)}var Prototype={Version:"1.7.3",Browser:function(){var t=navigator.userAgent,e="[object Opera]"==Object.prototype.toString.call(window.opera);return{IE:!!window.attachEvent&&!e,Opera:e,WebKit:t.indexOf("AppleWebKit/")>-1,Gecko:t.indexOf("Gecko")>-1&&-1===t.indexOf("KHTML"),MobileSafari:/Apple.*Mobile/.test(t)}}(),BrowserFeatures:{XPath:!!document.evaluate,SelectorsAPI:!!document.querySelector,ElementExtensions:function(){var t=window.Element||window.HTMLElement;return!(!t||!t.prototype)}(),SpecificElementExtensions:function(){if("undefined"!=typeof window.HTMLDivElement)return!0;var t=document.createElement("div"),e=document.createElement("form"),n=!1;return t.__proto__&&t.__proto__!==e.__proto__&&(n=!0),t=e=null,n}()},ScriptFragment:"<script[^>]*>([\\S\\s]*?)</script\\s*>",JSONFilter:/^\/\*-secure-([\s\S]*)\*\/\s*$/,emptyFunction:function(){},K:function(t){return t}};Prototype.Browser.MobileSafari&&(Prototype.BrowserFeatures.SpecificElementExtensions=!1);var Class=function(){function t(){}function e(){function e(){this.initialize.apply(this,arguments)}var n=null,r=$A(arguments);Object.isFunction(r[0])&&(n=r.shift()),Object.extend(e,Class.Methods),e.superclass=n,e.subclasses=[],n&&(t.prototype=n.prototype,e.prototype=new t,n.subclasses.push(e));for(var i=0,s=r.length;s>i;i++)e.addMethods(r[i]);return e.prototype.initialize||(e.prototype.initialize=Prototype.emptyFunction),e.prototype.constructor=e,e}function n(t){var e=this.superclass&&this.superclass.prototype,n=Object.keys(t);r&&(t.toString!=Object.prototype.toString&&n.push("toString"),t.valueOf!=Object.prototype.valueOf&&n.push("valueOf"));for(var i=0,s=n.length;s>i;i++){var o=n[i],a=t[o];if(e&&Object.isFunction(a)&&"$super"==a.argumentNames()[0]){var u=a;a=function(t){return function(){return e[t].apply(this,arguments)}}(o).wrap(u),a.valueOf=function(t){return function(){return t.valueOf.call(t)}}(u),a.toString=function(t){return function(){return t.toString.call(t)}}(u)}this.prototype[o]=a}return this}var r=function(){for(var t in{toString:1})if("toString"===t)return!1;return!0}();return{create:e,Methods:{addMethods:n}}}();!function(){function t(t){switch(t){case null:return O;case void 0:return j}var e=typeof t;switch(e){case"boolean":return x;case"number":return w;case"string":return A}return T}function e(t,e){for(var n in e)t[n]=e[n];return t}function n(t){try{return v(t)?"undefined":null===t?"null":t.inspect?t.inspect():String(t)}catch(e){if(e instanceof RangeError)return"...";throw e}}function r(t){return i("",{"":t},[])}function i(e,n,r){var s=n[e];t(s)===T&&"function"==typeof s.toJSON&&(s=s.toJSON(e));var o=S.call(s);switch(o){case R:case N:case P:s=s.valueOf()}switch(s){case null:return"null";case!0:return"true";case!1:return"false"}var a=typeof s;switch(a){case"string":return s.inspect(!0);case"number":return isFinite(s)?String(s):"null";case"object":for(var u=0,c=r.length;c>u;u++)if(r[u]===s)throw new TypeError("Cyclic reference to '"+s+"' in object");r.push(s);var h=[];if(o===C){for(var u=0,c=s.length;c>u;u++){var p=i(u,s,r);h.push("undefined"==typeof p?"null":p)}h="["+h.join(",")+"]"}else{for(var l=Object.keys(s),u=0,c=l.length;c>u;u++){var e=l[u],p=i(e,s,r);"undefined"!=typeof p&&h.push(e.inspect(!0)+":"+p)}h="{"+h.join(",")+"}"}return r.pop(),h}}function s(t){return JSON.stringify(t)}function o(t){return $H(t).toQueryString()}function a(t){return t&&t.toHTML?t.toHTML():String.interpret(t)}function u(e){if(t(e)!==T)throw new TypeError;var n=[];for(var r in e)b.call(e,r)&&n.push(r);if(M)for(var i=0;r=_[i];i++)b.call(e,r)&&n.push(r);return n}function c(t){var e=[];for(var n in t)e.push(t[n]);return e}function h(t){return e({},t)}function p(t){return!(!t||1!=t.nodeType)}function l(t){return S.call(t)===C}function f(t){return t instanceof Hash}function d(t){return S.call(t)===E}function g(t){return S.call(t)===P}function y(t){return S.call(t)===R}function m(t){return S.call(t)===J}function v(t){return"undefined"==typeof t}var S=Object.prototype.toString,b=Object.prototype.hasOwnProperty,O="Null",j="Undefined",x="Boolean",w="Number",A="String",T="Object",E="[object Function]",N="[object Boolean]",R="[object Number]",P="[object String]",C="[object Array]",J="[object Date]",H=window.JSON&&"function"==typeof JSON.stringify&&"0"===JSON.stringify(0)&&"undefined"==typeof JSON.stringify(Prototype.K),_=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],M=function(){for(var t in{toString:1})if("toString"===t)return!1;return!0}(),k="function"==typeof Array.isArray&&Array.isArray([])&&!Array.isArray({});k&&(l=Array.isArray),e(Object,{extend:e,inspect:n,toJSON:H?s:r,toQueryString:o,toHTML:a,keys:Object.keys||u,values:c,clone:h,isElement:p,isArray:l,isHash:f,isFunction:d,isString:g,isNumber:y,isDate:m,isUndefined:v})}(),Object.extend(Function.prototype,function(){function t(t,e){for(var n=t.length,r=e.length;r--;)t[n+r]=e[r];return t}function e(e,n){return e=h.call(e,0),t(e,n)}function n(){var t=this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g,"").replace(/\s+/g,"").split(",");return 1!=t.length||t[0]?t:[]}function r(t){if(arguments.length<2&&Object.isUndefined(arguments[0]))return this;if(!Object.isFunction(this))throw new TypeError("The object is not callable.");var n=function(){},r=this,i=h.call(arguments,1),s=function(){var n=e(i,arguments),o=this instanceof s?this:t;return r.apply(o,n)};return n.prototype=this.prototype,s.prototype=new n,s}function i(e){var n=this,r=h.call(arguments,1);return function(i){var s=t([i||window.event],r);return n.apply(e,s)}}function s(){if(!arguments.length)return this;var t=this,n=h.call(arguments,0);return function(){var r=e(n,arguments);return t.apply(this,r)}}function o(t){var e=this,n=h.call(arguments,1);return t=1e3*t,window.setTimeout(function(){return e.apply(e,n)},t)}function a(){var e=t([.01],arguments);return this.delay.apply(this,e)}function u(e){var n=this;return function(){var r=t([n.bind(this)],arguments);return e.apply(this,r)}}function c(){if(this._methodized)return this._methodized;var e=this;return this._methodized=function(){var n=t([this],arguments);return e.apply(null,n)}}var h=Array.prototype.slice,p={argumentNames:n,bindAsEventListener:i,curry:s,delay:o,defer:a,wrap:u,methodize:c};return Function.prototype.bind||(p.bind=r),p}()),function(t){function e(){return this.getUTCFullYear()+"-"+(this.getUTCMonth()+1).toPaddedString(2)+"-"+this.getUTCDate().toPaddedString(2)+"T"+this.getUTCHours().toPaddedString(2)+":"+this.getUTCMinutes().toPaddedString(2)+":"+this.getUTCSeconds().toPaddedString(2)+"Z"}function n(){return this.toISOString()}t.toISOString||(t.toISOString=e),t.toJSON||(t.toJSON=n)}(Date.prototype),RegExp.prototype.match=RegExp.prototype.test,RegExp.escape=function(t){return String(t).replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")};var PeriodicalExecuter=Class.create({initialize:function(t,e){this.callback=t,this.frequency=e,this.currentlyExecuting=!1,this.registerCallback()},registerCallback:function(){this.timer=setInterval(this.onTimerEvent.bind(this),1e3*this.frequency)},execute:function(){this.callback(this)},stop:function(){this.timer&&(clearInterval(this.timer),this.timer=null)},onTimerEvent:function(){if(!this.currentlyExecuting)try{this.currentlyExecuting=!0,this.execute(),this.currentlyExecuting=!1}catch(t){throw this.currentlyExecuting=!1,t}}});Object.extend(String,{interpret:function(t){return null==t?"":String(t)},specialChar:{"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\\":"\\\\"}}),Object.extend(String.prototype,function(){function prepareReplacement(t){if(Object.isFunction(t))return t;var e=new Template(t);return function(t){return e.evaluate(t)}}function isNonEmptyRegExp(t){return t.source&&"(?:)"!==t.source}function gsub(t,e){var n,r="",i=this;if(e=prepareReplacement(e),Object.isString(t)&&(t=RegExp.escape(t)),!t.length&&!isNonEmptyRegExp(t))return e=e(""),e+i.split("").join(e)+e;for(;i.length>0;)n=i.match(t),n&&n[0].length>0?(r+=i.slice(0,n.index),r+=String.interpret(e(n)),i=i.slice(n.index+n[0].length)):(r+=i,i="");return r}function sub(t,e,n){return e=prepareReplacement(e),n=Object.isUndefined(n)?1:n,this.gsub(t,function(t){return--n<0?t[0]:e(t)})}function scan(t,e){return this.gsub(t,e),String(this)}function truncate(t,e){return t=t||30,e=Object.isUndefined(e)?"...":e,this.length>t?this.slice(0,t-e.length)+e:String(this)}function strip(){return this.replace(/^\s+/,"").replace(/\s+$/,"")}function stripTags(){return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?(\/)?>|<\/\w+>/gi,"")}function stripScripts(){return this.replace(new RegExp(Prototype.ScriptFragment,"img"),"")}function extractScripts(){var t=new RegExp(Prototype.ScriptFragment,"img"),e=new RegExp(Prototype.ScriptFragment,"im");return(this.match(t)||[]).map(function(t){return(t.match(e)||["",""])[1]})}function evalScripts(){return this.extractScripts().map(function(script){return eval(script)})}function escapeHTML(){return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function unescapeHTML(){return this.stripTags().replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")}function toQueryParams(t){var e=this.strip().match(/([^?#]*)(#.*)?$/);return e?e[1].split(t||"&").inject({},function(t,e){if((e=e.split("="))[0]){var n=decodeURIComponent(e.shift()),r=e.length>1?e.join("="):e[0];void 0!=r&&(r=r.gsub("+"," "),r=decodeURIComponent(r)),n in t?(Object.isArray(t[n])||(t[n]=[t[n]]),t[n].push(r)):t[n]=r}return t}):{}}function toArray(){return this.split("")}function succ(){return this.slice(0,this.length-1)+String.fromCharCode(this.charCodeAt(this.length-1)+1)}function times(t){return 1>t?"":new Array(t+1).join(this)}function camelize(){return this.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})}function capitalize(){return this.charAt(0).toUpperCase()+this.substring(1).toLowerCase()}function underscore(){return this.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/-/g,"_").toLowerCase()}function dasherize(){return this.replace(/_/g,"-")}function inspect(t){var e=this.replace(/[\x00-\x1f\\]/g,function(t){return t in String.specialChar?String.specialChar[t]:"\\u00"+t.charCodeAt().toPaddedString(2,16)});return t?'"'+e.replace(/"/g,'\\"')+'"':"'"+e.replace(/'/g,"\\'")+"'"}function unfilterJSON(t){return this.replace(t||Prototype.JSONFilter,"$1")}function isJSON(){var t=this;return t.blank()?!1:(t=t.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@"),t=t.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]"),t=t.replace(/(?:^|:|,)(?:\s*\[)+/g,""),/^[\],:{}\s]*$/.test(t))}function evalJSON(sanitize){var json=this.unfilterJSON(),cx=/[\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff\u0000]/g;cx.test(json)&&(json=json.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)}));try{if(!sanitize||json.isJSON())return eval("("+json+")")}catch(e){}throw new SyntaxError("Badly formed JSON string: "+this.inspect())}function parseJSON(){var t=this.unfilterJSON();return JSON.parse(t)}function include(t){return this.indexOf(t)>-1}function startsWith(t,e){return e=Object.isNumber(e)?e:0,this.lastIndexOf(t,e)===e}function endsWith(t,e){t=String(t),e=Object.isNumber(e)?e:this.length,0>e&&(e=0),e>this.length&&(e=this.length);var n=e-t.length;return n>=0&&this.indexOf(t,n)===n}function empty(){return""==this}function blank(){return/^\s*$/.test(this)}function interpolate(t,e){return new Template(this,e).evaluate(t)}var NATIVE_JSON_PARSE_SUPPORT=window.JSON&&"function"==typeof JSON.parse&&JSON.parse('{"test": true}').test;return{gsub:gsub,sub:sub,scan:scan,truncate:truncate,strip:String.prototype.trim||strip,stripTags:stripTags,stripScripts:stripScripts,extractScripts:extractScripts,evalScripts:evalScripts,escapeHTML:escapeHTML,unescapeHTML:unescapeHTML,toQueryParams:toQueryParams,parseQuery:toQueryParams,toArray:toArray,succ:succ,times:times,camelize:camelize,capitalize:capitalize,underscore:underscore,dasherize:dasherize,inspect:inspect,unfilterJSON:unfilterJSON,isJSON:isJSON,evalJSON:NATIVE_JSON_PARSE_SUPPORT?parseJSON:evalJSON,include:include,startsWith:String.prototype.startsWith||startsWith,endsWith:String.prototype.endsWith||endsWith,empty:empty,blank:blank,interpolate:interpolate}}());var Template=Class.create({initialize:function(t,e){this.template=t.toString(),this.pattern=e||Template.Pattern},evaluate:function(t){return t&&Object.isFunction(t.toTemplateReplacements)&&(t=t.toTemplateReplacements()),this.template.gsub(this.pattern,function(e){if(null==t)return e[1]+"";var n=e[1]||"";if("\\"==n)return e[2];var r=t,i=e[3],s=/^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;if(e=s.exec(i),null==e)return n;for(;null!=e;){var o=e[1].startsWith("[")?e[2].replace(/\\\\]/g,"]"):e[1];if(r=r[o],null==r||""==e[3])break;i=i.substring("["==e[3]?e[1].length:e[0].length),e=s.exec(i)}return n+String.interpret(r)})}});Template.Pattern=/(^|.|\r|\n)(#\{(.*?)\})/;var $break={},Enumerable=function(){function t(t,e){try{this._each(t,e)}catch(n){if(n!=$break)throw n}return this}function e(t,e,n){var r=-t,i=[],s=this.toArray();if(1>t)return s;for(;(r+=t)<s.length;)i.push(s.slice(r,r+t));return i.collect(e,n)}function n(t,e){t=t||Prototype.K;var n=!0;return this.each(function(r,i){if(n=n&&!!t.call(e,r,i,this),!n)throw $break},this),n}function r(t,e){t=t||Prototype.K;var n=!1;return this.each(function(r,i){if(n=!!t.call(e,r,i,this))throw $break},this),n}function i(t,e){t=t||Prototype.K;var n=[];return this.each(function(r,i){n.push(t.call(e,r,i,this))},this),n}function s(t,e){var n;return this.each(function(r,i){if(t.call(e,r,i,this))throw n=r,$break},this),n}function o(t,e){var n=[];return this.each(function(r,i){t.call(e,r,i,this)&&n.push(r)},this),n}function a(t,e,n){e=e||Prototype.K;var r=[];return Object.isString(t)&&(t=new RegExp(RegExp.escape(t))),this.each(function(i,s){t.match(i)&&r.push(e.call(n,i,s,this))},this),r}function u(t){if(Object.isFunction(this.indexOf)&&-1!=this.indexOf(t))return!0;var e=!1;return this.each(function(n){if(n==t)throw e=!0,$break}),e}function c(t,e){return e=Object.isUndefined(e)?null:e,this.eachSlice(t,function(n){for(;n.length<t;)n.push(e);return n})}function h(t,e,n){return this.each(function(r,i){t=e.call(n,t,r,i,this)},this),t}function p(t){var e=$A(arguments).slice(1);return this.map(function(n){return n[t].apply(n,e)})}function l(t,e){t=t||Prototype.K;var n;return this.each(function(r,i){r=t.call(e,r,i,this),(null==n||r>=n)&&(n=r)},this),n}function f(t,e){t=t||Prototype.K;var n;return this.each(function(r,i){r=t.call(e,r,i,this),(null==n||n>r)&&(n=r)},this),n}function d(t,e){t=t||Prototype.K;var n=[],r=[];return this.each(function(i,s){(t.call(e,i,s,this)?n:r).push(i)},this),[n,r]}function g(t){var e=[];return this.each(function(n){e.push(n[t])}),e}function y(t,e){var n=[];return this.each(function(r,i){t.call(e,r,i,this)||n.push(r)},this),n}function m(t,e){return this.map(function(n,r){return{value:n,criteria:t.call(e,n,r,this)}},this).sort(function(t,e){var n=t.criteria,r=e.criteria;return r>n?-1:n>r?1:0}).pluck("value")}function v(){return this.map()}function S(){var t=Prototype.K,e=$A(arguments);Object.isFunction(e.last())&&(t=e.pop());var n=[this].concat(e).map($A);return this.map(function(e,r){return t(n.pluck(r))})}function b(){return this.toArray().length}function O(){return"#<Enumerable:"+this.toArray().inspect()+">"}return{each:t,eachSlice:e,all:n,every:n,any:r,some:r,collect:i,map:i,detect:s,findAll:o,select:o,filter:o,grep:a,include:u,member:u,inGroupsOf:c,inject:h,invoke:p,max:l,min:f,partition:d,pluck:g,reject:y,sortBy:m,toArray:v,entries:v,zip:S,size:b,inspect:O,find:s}}();Array.from=$A,function(){function t(t,e){for(var n=0,r=this.length>>>0;r>n;n++)n in this&&t.call(e,this[n],n,this)}function e(){return this.length=0,this}function n(){return this[0]}function r(){return this[this.length-1]}function i(){return this.select(function(t){return null!=t})}function s(){return this.inject([],function(t,e){return Object.isArray(e)?t.concat(e.flatten()):(t.push(e),t)})}function o(){var t=j.call(arguments,0);return this.select(function(e){return!t.include(e)})}function a(t){return(t===!1?this.toArray():this)._reverse()}function u(t){return this.inject([],function(e,n,r){return 0!=r&&(t?e.last()==n:e.include(n))||e.push(n),e})}function c(t){return this.uniq().findAll(function(e){return-1!==t.indexOf(e)})}function h(){return j.call(this,0)}function p(){return this.length}function l(){return"["+this.map(Object.inspect).join(", ")+"]"}function f(t,e){if(null==this)throw new TypeError;var n=Object(this),r=n.length>>>0;if(0===r)return-1;if(e=Number(e),isNaN(e)?e=0:0!==e&&isFinite(e)&&(e=(e>0?1:-1)*Math.floor(Math.abs(e))),e>r)return-1;for(var i=e>=0?e:Math.max(r-Math.abs(e),0);r>i;i++)if(i in n&&n[i]===t)return i;return-1}function d(t,e){if(null==this)throw new TypeError;var n=Object(this),r=n.length>>>0;if(0===r)return-1;Object.isUndefined(e)?e=r:(e=Number(e),isNaN(e)?e=0:0!==e&&isFinite(e)&&(e=(e>0?1:-1)*Math.floor(Math.abs(e))));for(var i=e>=0?Math.min(e,r-1):r-Math.abs(e);i>=0;i--)if(i in n&&n[i]===t)return i;return-1}function g(){var t,e=[],n=j.call(arguments,0),r=0;n.unshift(this);for(var i=0,s=n.length;s>i;i++)if(t=n[i],!Object.isArray(t)||"callee"in t)e[r++]=t;else for(var o=0,a=t.length;a>o;o++)o in t&&(e[r]=t[o]),r++;return e.length=r,e}function y(t){return function(){if(0===arguments.length)return t.call(this,Prototype.K);if(void 0===arguments[0]){var e=j.call(arguments,1);return e.unshift(Prototype.K),t.apply(this,e)}return t.apply(this,arguments)}}function m(t){if(null==this)throw new TypeError;t=t||Prototype.K;for(var e=Object(this),n=[],r=arguments[1],i=0,s=0,o=e.length>>>0;o>s;s++)s in e&&(n[i]=t.call(r,e[s],s,e)),i++;return n.length=i,n}function v(t){if(null==this||!Object.isFunction(t))throw new TypeError;for(var e,n=Object(this),r=[],i=arguments[1],s=0,o=n.length>>>0;o>s;s++)s in n&&(e=n[s],t.call(i,e,s,n)&&r.push(e));return r}function S(t){if(null==this)throw new TypeError;t=t||Prototype.K;for(var e=arguments[1],n=Object(this),r=0,i=n.length>>>0;i>r;r++)if(r in n&&t.call(e,n[r],r,n))return!0;return!1}function b(t){if(null==this)throw new TypeError;t=t||Prototype.K;for(var e=arguments[1],n=Object(this),r=0,i=n.length>>>0;i>r;r++)if(r in n&&!t.call(e,n[r],r,n))return!1;return!0}var O=Array.prototype,j=O.slice,x=O.forEach;x||(x=t),O.map&&(m=y(Array.prototype.map)),O.filter&&(v=Array.prototype.filter),O.some&&(S=y(Array.prototype.some)),O.every&&(b=y(Array.prototype.every)),Object.extend(O,Enumerable),O.entries===Enumerable.entries&&delete O.entries,O._reverse||(O._reverse=O.reverse),Object.extend(O,{_each:x,map:m,collect:m,select:v,filter:v,findAll:v,some:S,any:S,every:b,all:b,clear:e,first:n,last:r,compact:i,flatten:s,without:o,reverse:a,uniq:u,intersect:c,clone:h,toArray:h,size:p,inspect:l});var w=function(){return 1!==[].concat(arguments)[0][0]}(1,2);w&&(O.concat=g),O.indexOf||(O.indexOf=f),O.lastIndexOf||(O.lastIndexOf=d)}();var Hash=Class.create(Enumerable,function(){function t(t){this._object=Object.isHash(t)?t.toObject():Object.clone(t)}function e(t,e){var n=0;for(var r in this._object){var i=this._object[r],s=[r,i];s.key=r,s.value=i,t.call(e,s,n),n++}}function n(t,e){return this._object[t]=e}function r(t){return this._object[t]!==Object.prototype[t]?this._object[t]:void 0}function i(t){var e=this._object[t];return delete this._object[t],e}function s(){return Object.clone(this._object)}function o(){return this.pluck("key")}function a(){return this.pluck("value")}function u(t){var e=this.detect(function(e){return e.value===t});return e&&e.key}function c(t){return this.clone().update(t)}function h(t){return new Hash(t).inject(this,function(t,e){return t.set(e.key,e.value),t})}function p(t,e){return Object.isUndefined(e)?t:(e=String.interpret(e),e=e.gsub(/(\r)?\n/,"\r\n"),e=encodeURIComponent(e),e=e.gsub(/%20/,"+"),t+"="+e)}function l(){return this.inject([],function(t,e){var n=encodeURIComponent(e.key),r=e.value;if(r&&"object"==typeof r){if(Object.isArray(r)){for(var i,s=[],o=0,a=r.length;a>o;o++)i=r[o],s.push(p(n,i));return t.concat(s)}}else t.push(p(n,r));return t}).join("&")}function f(){return"#<Hash:{"+this.map(function(t){return t.map(Object.inspect).join(": ")}).join(", ")+"}>"}function d(){return new Hash(this)}return{initialize:t,_each:e,set:n,get:r,unset:i,toObject:s,toTemplateReplacements:s,keys:o,values:a,index:u,merge:c,update:h,toQueryString:l,inspect:f,toJSON:s,clone:d}}());Hash.from=$H,Object.extend(Number.prototype,function(){function t(){return this.toPaddedString(2,16)}function e(){return this+1}function n(t,e){return $R(0,this,!0).each(t,e),this}function r(t,e){var n=this.toString(e||10);return"0".times(t-n.length)+n}function i(){return Math.abs(this)}function s(){return Math.round(this)}function o(){return Math.ceil(this)}function a(){return Math.floor(this)}return{toColorPart:t,succ:e,times:n,toPaddedString:r,abs:i,round:s,ceil:o,floor:a}}());var ObjectRange=Class.create(Enumerable,function(){function t(t,e,n){this.start=t,this.end=e,this.exclusive=n}function e(t,e){var n,r=this.start;for(n=0;this.include(r);n++)t.call(e,r,n),r=r.succ()}function n(t){return t<this.start?!1:this.exclusive?t<this.end:t<=this.end}return{initialize:t,_each:e,include:n}}()),Abstract={},Try={these:function(){for(var t,e=0,n=arguments.length;n>e;e++){var r=arguments[e];try{t=r();break}catch(i){}}return t}},Ajax={getTransport:function(){return Try.these(function(){return new XMLHttpRequest},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")})||!1},activeRequestCount:0};Ajax.Responders={responders:[],_each:function(t,e){this.responders._each(t,e)},register:function(t){this.include(t)||this.responders.push(t)},unregister:function(t){this.responders=this.responders.without(t)},dispatch:function(t,e,n,r){this.each(function(i){if(Object.isFunction(i[t]))try{i[t].apply(i,[e,n,r])}catch(s){}})}},Object.extend(Ajax.Responders,Enumerable),Ajax.Responders.register({onCreate:function(){Ajax.activeRequestCount++},onComplete:function(){Ajax.activeRequestCount--}}),Ajax.Base=Class.create({initialize:function(t){this.options={method:"post",asynchronous:!0,contentType:"application/x-www-form-urlencoded",encoding:"UTF-8",parameters:"",evalJSON:!0,evalJS:!0},Object.extend(this.options,t||{}),this.options.method=this.options.method.toLowerCase(),Object.isHash(this.options.parameters)&&(this.options.parameters=this.options.parameters.toObject())}}),Ajax.Request=Class.create(Ajax.Base,{_complete:!1,initialize:function($super,t,e){$super(e),this.transport=Ajax.getTransport(),this.request(t)},request:function(t){this.url=t,this.method=this.options.method;var e=Object.isString(this.options.parameters)?this.options.parameters:Object.toQueryString(this.options.parameters);["get","post"].include(this.method)||(e+=(e?"&":"")+"_method="+this.method,this.method="post"),e&&"get"===this.method&&(this.url+=(this.url.include("?")?"&":"?")+e),this.parameters=e.toQueryParams();try{var n=new Ajax.Response(this);this.options.onCreate&&this.options.onCreate(n),Ajax.Responders.dispatch("onCreate",this,n),this.transport.open(this.method.toUpperCase(),this.url,this.options.asynchronous),this.options.asynchronous&&this.respondToReadyState.bind(this).defer(1),this.transport.onreadystatechange=this.onStateChange.bind(this),this.setRequestHeaders(),this.body="post"==this.method?this.options.postBody||e:null,this.transport.send(this.body),!this.options.asynchronous&&this.transport.overrideMimeType&&this.onStateChange()}catch(r){this.dispatchException(r)}},onStateChange:function(){var t=this.transport.readyState;t>1&&(4!=t||!this._complete)&&this.respondToReadyState(this.transport.readyState)},setRequestHeaders:function(){var t={"X-Requested-With":"XMLHttpRequest","X-Prototype-Version":Prototype.Version,Accept:"text/javascript, text/html, application/xml, text/xml, */*"};if("post"==this.method&&(t["Content-type"]=this.options.contentType+(this.options.encoding?"; charset="+this.options.encoding:""),this.transport.overrideMimeType&&(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]<2005&&(t.Connection="close")),"object"==typeof this.options.requestHeaders){var e=this.options.requestHeaders;if(Object.isFunction(e.push))for(var n=0,r=e.length;r>n;n+=2)t[e[n]]=e[n+1];else $H(e).each(function(e){t[e.key]=e.value})}for(var i in t)null!=t[i]&&this.transport.setRequestHeader(i,t[i])},success:function(){var t=this.getStatus();return!t||t>=200&&300>t||304==t},getStatus:function(){try{return 1223===this.transport.status?204:this.transport.status||0}catch(t){return 0}},respondToReadyState:function(t){var e=Ajax.Request.Events[t],n=new Ajax.Response(this);if("Complete"==e){try{this._complete=!0,(this.options["on"+n.status]||this.options["on"+(this.success()?"Success":"Failure")]||Prototype.emptyFunction)(n,n.headerJSON)}catch(r){this.dispatchException(r)}var i=n.getHeader("Content-type");("force"==this.options.evalJS||this.options.evalJS&&this.isSameOrigin()&&i&&i.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))&&this.evalResponse()}try{(this.options["on"+e]||Prototype.emptyFunction)(n,n.headerJSON),Ajax.Responders.dispatch("on"+e,this,n,n.headerJSON)}catch(r){this.dispatchException(r)}"Complete"==e&&(this.transport.onreadystatechange=Prototype.emptyFunction)},isSameOrigin:function(){var t=this.url.match(/^\s*https?:\/\/[^\/]*/);return!t||t[0]=="#{protocol}//#{domain}#{port}".interpolate({protocol:location.protocol,domain:document.domain,port:location.port?":"+location.port:""})},getHeader:function(t){try{return this.transport.getResponseHeader(t)||null}catch(e){return null}},evalResponse:function(){try{return eval((this.transport.responseText||"").unfilterJSON())}catch(e){this.dispatchException(e)}},dispatchException:function(t){(this.options.onException||Prototype.emptyFunction)(this,t),Ajax.Responders.dispatch("onException",this,t)}}),Ajax.Request.Events=["Uninitialized","Loading","Loaded","Interactive","Complete"],Ajax.Response=Class.create({initialize:function(t){this.request=t;var e=this.transport=t.transport,n=this.readyState=e.readyState;if((n>2&&!Prototype.Browser.IE||4==n)&&(this.status=this.getStatus(),this.statusText=this.getStatusText(),this.responseText=String.interpret(e.responseText),this.headerJSON=this._getHeaderJSON()),4==n){var r=e.responseXML;this.responseXML=Object.isUndefined(r)?null:r,this.responseJSON=this._getResponseJSON()}},status:0,statusText:"",getStatus:Ajax.Request.prototype.getStatus,getStatusText:function(){try{return this.transport.statusText||""}catch(t){return""}},getHeader:Ajax.Request.prototype.getHeader,getAllHeaders:function(){try{return this.getAllResponseHeaders()}catch(t){return null}},getResponseHeader:function(t){return this.transport.getResponseHeader(t)},getAllResponseHeaders:function(){return this.transport.getAllResponseHeaders()},_getHeaderJSON:function(){var t=this.getHeader("X-JSON");if(!t)return null;try{t=decodeURIComponent(escape(t))}catch(e){}try{return t.evalJSON(this.request.options.sanitizeJSON||!this.request.isSameOrigin())}catch(e){this.request.dispatchException(e)}},_getResponseJSON:function(){var t=this.request.options;if(!t.evalJSON||"force"!=t.evalJSON&&!(this.getHeader("Content-type")||"").include("application/json")||this.responseText.blank())return null;try{return this.responseText.evalJSON(t.sanitizeJSON||!this.request.isSameOrigin())}catch(e){this.request.dispatchException(e)}}});


(function () {


// Staple object.
var staple = {
	version : '0.9.0',
}


// Preprocess all query parameters.
var args = (sessionStorage['staple:///args'] || "{}").evalJSON();

var search = window.location.search;
var interaction, extra;

if (search) {
	var fields = search.substr(1).split('&');
	var args = { };

	for (var i = 0, field; field = fields[i]; ++i) {
		var kv = field.split('=');
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

	sessionStorage['staple:///args'] = Object.toJSON(args);
}


// Compute root path.
var mainScript = window.document.head.querySelector('script[data-main]');
var scriptPath = mainScript.dataset.main;
var base = mainScript.dataset.base;
var home = mainScript.dataset.home;
var stapleRoot = scriptPath.substr(0, scriptPath.lastIndexOf('/') + 1);

requirejs.config({
	baseUrl : base || '',
	paths : {
		'staple' : stapleRoot + 'modules'
	}
});

// Clean up unused local variables.
delete stapleRoot;
delete base;
delete scriptPath;
delete mainScript;
delete search;


// HTML parser.
define('staple/html-parser', function (require, exports, module) {

var factroy = window.document.createElement('div');

var Clazz = Class.create({

	initialize : function () {
		throw new Error('This class can not be initialized');
	},

});

Clazz.parse = function (html) {
	factroy.innerHTML = html;
	var children = factroy.children, result = [];
	for (var i = 0, child; child = children[i]; ++i)
		result.push(child);
	factroy.innerHTML = '';
	return result;
}

return Clazz;

});


// A module usd to load specified NLS(Native Language Support) bundle.
define('nls', function (require, exports, module) {

var NLSBundleLoader = Class.create({

	initialize : function (bundle, languages, require, onload) {
		this.bundle = bundle;
		this.languages = languages;
		this.require = require;
		this.onload = onload;
	},

	load : function () {
		// Load master of NLS bundle.
		require([this.bundle + '/master'], this.onMasterLoaded.bind(this));
	},

	onMasterLoaded : function (master) {
		var parts = this.parts = [], needed = this.needed = [],
			names = [];
		var languages = this.languages;

		this.master = master;

		// Checkout which stand-alone NLS parts need to load.
		for (var i = languages.length - 1; i >= 0; --i) {
			var language = languages[i];
			if (!language)
				continue;
			language = language.toLowerCase();
			var value = master[language];
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
	},

	onPartsLoaded : function () {
		var master = this.master, needed = this.needed, parts = this.parts,
			values = {};

		// Add add stand-along NLS part to master.
		for (var i = 0; i < needed.length; ++i)
			master[needed[i]] = arguments[i];

		// Mixin all locale parts into a bundle.
		var bundle = { '@name' : this.bundle };
		for (var i = 0, source; source = master[parts[i]]; ++i)
			for (prop in source)
				bundle[prop] = source[prop];

		// Notify bundle loaded.
		this.onload(bundle);
	},

});

function load (name, require, onload, config) {
	if (config.isBuild)
		return onload(null)

	var languages = [];

	// Custom language.
	try {
		var custom = localStorage['staple:///language'];
		if (custom) languages.push(custom);
	} catch (e) {
		// Do nothing.
	}

	// Browser languages
	if (navigator.language)
		languages.push(navigator.language);
	if (navigator.languages)
		languages = languages.concat(navigator.languages);

	// Default language
	languages.push('root');
	languages = languages.uniq();

	// Load bundle.
	var loader = new NLSBundleLoader(name, languages, require, onload);
	loader.load();
}

exports.load = load;

});


// A module usd to load specified snippet from specified HTML file.
define('snippet', function (require, exports, module) {

var HTMLParser = require('staple/html-parser');

var SnippetLoader = Class.create({

	htmls : {},

	initialize : function (path, id, require, onload) {
		this.path = path;
		this.id = id;
		this.require = require;
		this.onload = onload;
	},

	load : function() {
		// Load from js memory cache.
		var snippets = this.htmls[this.path];
		if (snippets)
			return this.onSnippetsLoaded(snippets);

		// Load via AJAX.
		var url = this.require.toUrl(this.path + '.html');
		var config = {
			onSuccess : this.onHTMLLoaded.bind(this),
			onFailure : this.onHTMLNotLoaded.bind(this),
			method : 'get',
		};
		new Ajax.Request(url, config);
	},

	onHTMLLoaded : function (xhr) {
		var html = xhr.responseText, head = window.document.head, snippets = {};

		for (var i = 0, els = HTMLParser.parse(html), el; el = els[i]; ++i) {
			switch (el.tagName.toLowerCase()) {
			case 'style':
				head.appendChild(el);
				break;
			case 'script':
				if (el.type !== 'text/html' || !el.id)
					break;
				snippets[el.id] = {
					html : el.innerHTML.trim(),
					ready : false,
				};
				break;
			default:
				break;
			}
		}

		this.onSnippetsLoaded(snippets);
	},

	onHTMLNotLoaded : function (xhr) {
		this.onload.error(new Error(
			'Failed to load snippet file: ' + this.path + '(' + xhr.status + ')'
			));
	},

	onSnippetsLoaded : function (snippets) {
		this.htmls[this.path] = snippets;
		var snippet = snippets[this.id];

		if (!snippet)
			return this.onload.error(new Error('Snippet not found: ' + this.id));

		// Return immediately if snippet is ready.
		if (snippet.ready)
			return this.onload(snippet.html);

		// Find all NLS placeholders.
		var matches = snippet.html.match(/\{nls\{[a-zA-Z0-9\-\/_]+:[a-zA-Z0-9\-_]+\}\}/g);

		// No NLS placeholders, mark ready and return.
		if (!matches || matches.length == 0) {
			snippet.ready = true;
			return this.onload(snippet.html);
		}

		// Prepare to load NLS bundles.
		var nlsphs = this.nlsphs = [], names = [];
		for (var i = 0, match; match = matches[i]; ++i) {
			var pair = match.substr(5, match.length - 7).split(':');
			nlsphs.push({
				match : match,
				name : pair[0],
				key : pair[1],
			});
			names.push('nls!' + pair[0]);
		}

		// Load NLS Bundles
		this.require(names.uniq(), this.onNLSBundlesLoaded.bind(this));
	},

	onNLSBundlesLoaded : function () {
		var nlsphs = this.nlsphs, snippet = this.htmls[this.path][this.id],
			html = snippet.html;

		// Build a lookup map for loaded NLS bundles.
		var bundles = {};
		for (var i = 0, bundle; bundle = arguments[i]; ++i)
			bundles[bundle['@name']] = bundle;

		// Replace all NLS placeholders with NLS strings.
		for (var i = 0, nlsph; nlsph = nlsphs[i]; ++i)
			html = html.replace(nlsph.match, bundles[nlsph.name][nlsph.key]);

		// Mark ready and notify loaded.
		snippet.ready = true;
		snippet.html = html;
		this.onload(html);
	},

});

function load (name, require, onload, config) {
	if (config.isBuild)
		return onload(null);

	var temp = name.split('#');
	var loader = new SnippetLoader(temp[0], temp[1], require, onload);
	loader.load();
};

exports.load = load;

});


// Base class of all staple classes.
define('staple/object', function (require, exports, module) {

return Class.create({

	initialize : function () {
		this.$attrs = {};
		this.$temps = {};
	},

	invokeMethodAndEnsureSuperCalled : function (method, a, b, c, d, e) {
		this.$temps[method] = false;
		var result = this[method](a, b, c, d, e);
		if (this.$temps[method] != method)
			throw new Error('$super() not called in ' + method);
		delete this.$temps[method];
		return result;
	},

	notifySuperCalled : function (method) {
		this.$temps[method] = method;
	},

});

});


// UUID generator.
define('staple/uuid', function (require, exports, module) {

var CHARS = "0123456789ABCDEF".split("");

var Clazz = Class.create({

	initialize : function () {
		throw new Error('This class can not be initialized');
	},

});

Clazz.randomUUID = function () {
	var chars = CHARS, uuid = new Array(36), rnd=0, r;
	for (var i = 0; i < 36; i++) {
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

return Clazz;

});


// Entry of the staple framework.
define('noumenon', function (require, exports, module) {

var Application = require('application');

var application = staple.application = new Application();

application.namespace = window.location.pathname;
application.title = window.document.title;
application.meta = window.document.head.meta;
application.args = args;

return application.start(home, interaction, extra);

});


// Export staple as a global variable.
window.staple = staple;


})();
