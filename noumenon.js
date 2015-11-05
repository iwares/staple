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
 * and then compress it using "uglifyjs" with "-c" options.
 * 
 */
function $A(iterable){if(!iterable)return[];if("toArray"in Object(iterable))return iterable.toArray();for(var length=iterable.length||0,results=new Array(length);length--;)results[length]=iterable[length];return results}function $w(string){return Object.isString(string)?(string=string.strip(),string?string.split(/\s+/):[]):[]}function $H(object){return new Hash(object)}function $R(start,end,exclusive){return new ObjectRange(start,end,exclusive)}var Prototype={Version:"1.7.3",Browser:function(){var ua=navigator.userAgent,isOpera="[object Opera]"==Object.prototype.toString.call(window.opera);return{IE:!!window.attachEvent&&!isOpera,Opera:isOpera,WebKit:ua.indexOf("AppleWebKit/")>-1,Gecko:ua.indexOf("Gecko")>-1&&-1===ua.indexOf("KHTML"),MobileSafari:/Apple.*Mobile/.test(ua)}}(),BrowserFeatures:{XPath:!!document.evaluate,SelectorsAPI:!!document.querySelector,ElementExtensions:function(){var constructor=window.Element||window.HTMLElement;return!(!constructor||!constructor.prototype)}(),SpecificElementExtensions:function(){if("undefined"!=typeof window.HTMLDivElement)return!0;var div=document.createElement("div"),form=document.createElement("form"),isSupported=!1;return div.__proto__&&div.__proto__!==form.__proto__&&(isSupported=!0),div=form=null,isSupported}()},ScriptFragment:"<script[^>]*>([\\S\\s]*?)</script\\s*>",JSONFilter:/^\/\*-secure-([\s\S]*)\*\/\s*$/,emptyFunction:function(){},K:function(x){return x}};Prototype.Browser.MobileSafari&&(Prototype.BrowserFeatures.SpecificElementExtensions=!1);var Class=function(){function subclass(){}function create(){function klass(){this.initialize.apply(this,arguments)}var parent=null,properties=$A(arguments);Object.isFunction(properties[0])&&(parent=properties.shift()),Object.extend(klass,Class.Methods),klass.superclass=parent,klass.subclasses=[],parent&&(subclass.prototype=parent.prototype,klass.prototype=new subclass,parent.subclasses.push(klass));for(var i=0,length=properties.length;length>i;i++)klass.addMethods(properties[i]);return klass.prototype.initialize||(klass.prototype.initialize=Prototype.emptyFunction),klass.prototype.constructor=klass,klass}function addMethods(source){var ancestor=this.superclass&&this.superclass.prototype,properties=Object.keys(source);IS_DONTENUM_BUGGY&&(source.toString!=Object.prototype.toString&&properties.push("toString"),source.valueOf!=Object.prototype.valueOf&&properties.push("valueOf"));for(var i=0,length=properties.length;length>i;i++){var property=properties[i],value=source[property];if(ancestor&&Object.isFunction(value)&&"$super"==value.argumentNames()[0]){var method=value;value=function(m){return function(){return ancestor[m].apply(this,arguments)}}(property).wrap(method),value.valueOf=function(method){return function(){return method.valueOf.call(method)}}(method),value.toString=function(method){return function(){return method.toString.call(method)}}(method)}this.prototype[property]=value}return this}var IS_DONTENUM_BUGGY=function(){for(var p in{toString:1})if("toString"===p)return!1;return!0}();return{create:create,Methods:{addMethods:addMethods}}}();!function(){function Type(o){switch(o){case null:return NULL_TYPE;case void 0:return UNDEFINED_TYPE}var type=typeof o;switch(type){case"boolean":return BOOLEAN_TYPE;case"number":return NUMBER_TYPE;case"string":return STRING_TYPE}return OBJECT_TYPE}function extend(destination,source){for(var property in source)destination[property]=source[property];return destination}function inspect(object){try{return isUndefined(object)?"undefined":null===object?"null":object.inspect?object.inspect():String(object)}catch(e){if(e instanceof RangeError)return"...";throw e}}function toJSON(value){return Str("",{"":value},[])}function Str(key,holder,stack){var value=holder[key];Type(value)===OBJECT_TYPE&&"function"==typeof value.toJSON&&(value=value.toJSON(key));var _class=_toString.call(value);switch(_class){case NUMBER_CLASS:case BOOLEAN_CLASS:case STRING_CLASS:value=value.valueOf()}switch(value){case null:return"null";case!0:return"true";case!1:return"false"}var type=typeof value;switch(type){case"string":return value.inspect(!0);case"number":return isFinite(value)?String(value):"null";case"object":for(var i=0,length=stack.length;length>i;i++)if(stack[i]===value)throw new TypeError("Cyclic reference to '"+value+"' in object");stack.push(value);var partial=[];if(_class===ARRAY_CLASS){for(var i=0,length=value.length;length>i;i++){var str=Str(i,value,stack);partial.push("undefined"==typeof str?"null":str)}partial="["+partial.join(",")+"]"}else{for(var keys=Object.keys(value),i=0,length=keys.length;length>i;i++){var key=keys[i],str=Str(key,value,stack);"undefined"!=typeof str&&partial.push(key.inspect(!0)+":"+str)}partial="{"+partial.join(",")+"}"}return stack.pop(),partial}}function stringify(object){return JSON.stringify(object)}function toQueryString(object){return $H(object).toQueryString()}function toHTML(object){return object&&object.toHTML?object.toHTML():String.interpret(object)}function keys(object){if(Type(object)!==OBJECT_TYPE)throw new TypeError;var results=[];for(var property in object)_hasOwnProperty.call(object,property)&&results.push(property);if(IS_DONTENUM_BUGGY)for(var i=0;property=DONT_ENUMS[i];i++)_hasOwnProperty.call(object,property)&&results.push(property);return results}function values(object){var results=[];for(var property in object)results.push(object[property]);return results}function clone(object){return extend({},object)}function isElement(object){return!(!object||1!=object.nodeType)}function isArray(object){return _toString.call(object)===ARRAY_CLASS}function isHash(object){return object instanceof Hash}function isFunction(object){return _toString.call(object)===FUNCTION_CLASS}function isString(object){return _toString.call(object)===STRING_CLASS}function isNumber(object){return _toString.call(object)===NUMBER_CLASS}function isDate(object){return _toString.call(object)===DATE_CLASS}function isUndefined(object){return"undefined"==typeof object}var _toString=Object.prototype.toString,_hasOwnProperty=Object.prototype.hasOwnProperty,NULL_TYPE="Null",UNDEFINED_TYPE="Undefined",BOOLEAN_TYPE="Boolean",NUMBER_TYPE="Number",STRING_TYPE="String",OBJECT_TYPE="Object",FUNCTION_CLASS="[object Function]",BOOLEAN_CLASS="[object Boolean]",NUMBER_CLASS="[object Number]",STRING_CLASS="[object String]",ARRAY_CLASS="[object Array]",DATE_CLASS="[object Date]",NATIVE_JSON_STRINGIFY_SUPPORT=window.JSON&&"function"==typeof JSON.stringify&&"0"===JSON.stringify(0)&&"undefined"==typeof JSON.stringify(Prototype.K),DONT_ENUMS=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],IS_DONTENUM_BUGGY=function(){for(var p in{toString:1})if("toString"===p)return!1;return!0}(),hasNativeIsArray="function"==typeof Array.isArray&&Array.isArray([])&&!Array.isArray({});hasNativeIsArray&&(isArray=Array.isArray),extend(Object,{extend:extend,inspect:inspect,toJSON:NATIVE_JSON_STRINGIFY_SUPPORT?stringify:toJSON,toQueryString:toQueryString,toHTML:toHTML,keys:Object.keys||keys,values:values,clone:clone,isElement:isElement,isArray:isArray,isHash:isHash,isFunction:isFunction,isString:isString,isNumber:isNumber,isDate:isDate,isUndefined:isUndefined})}(),Object.extend(Function.prototype,function(){function update(array,args){for(var arrayLength=array.length,length=args.length;length--;)array[arrayLength+length]=args[length];return array}function merge(array,args){return array=slice.call(array,0),update(array,args)}function argumentNames(){var names=this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g,"").replace(/\s+/g,"").split(",");return 1!=names.length||names[0]?names:[]}function bind(context){if(arguments.length<2&&Object.isUndefined(arguments[0]))return this;if(!Object.isFunction(this))throw new TypeError("The object is not callable.");var nop=function(){},__method=this,args=slice.call(arguments,1),bound=function(){var a=merge(args,arguments),c=this instanceof bound?this:context;return __method.apply(c,a)};return nop.prototype=this.prototype,bound.prototype=new nop,bound}function bindAsEventListener(context){var __method=this,args=slice.call(arguments,1);return function(event){var a=update([event||window.event],args);return __method.apply(context,a)}}function curry(){if(!arguments.length)return this;var __method=this,args=slice.call(arguments,0);return function(){var a=merge(args,arguments);return __method.apply(this,a)}}function delay(timeout){var __method=this,args=slice.call(arguments,1);return timeout=1e3*timeout,window.setTimeout(function(){return __method.apply(__method,args)},timeout)}function defer(){var args=update([.01],arguments);return this.delay.apply(this,args)}function wrap(wrapper){var __method=this;return function(){var a=update([__method.bind(this)],arguments);return wrapper.apply(this,a)}}function methodize(){if(this._methodized)return this._methodized;var __method=this;return this._methodized=function(){var a=update([this],arguments);return __method.apply(null,a)}}var slice=Array.prototype.slice,extensions={argumentNames:argumentNames,bindAsEventListener:bindAsEventListener,curry:curry,delay:delay,defer:defer,wrap:wrap,methodize:methodize};return Function.prototype.bind||(extensions.bind=bind),extensions}()),function(proto){function toISOString(){return this.getUTCFullYear()+"-"+(this.getUTCMonth()+1).toPaddedString(2)+"-"+this.getUTCDate().toPaddedString(2)+"T"+this.getUTCHours().toPaddedString(2)+":"+this.getUTCMinutes().toPaddedString(2)+":"+this.getUTCSeconds().toPaddedString(2)+"Z"}function toJSON(){return this.toISOString()}proto.toISOString||(proto.toISOString=toISOString),proto.toJSON||(proto.toJSON=toJSON)}(Date.prototype),RegExp.prototype.match=RegExp.prototype.test,RegExp.escape=function(str){return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")};var PeriodicalExecuter=Class.create({initialize:function(callback,frequency){this.callback=callback,this.frequency=frequency,this.currentlyExecuting=!1,this.registerCallback()},registerCallback:function(){this.timer=setInterval(this.onTimerEvent.bind(this),1e3*this.frequency)},execute:function(){this.callback(this)},stop:function(){this.timer&&(clearInterval(this.timer),this.timer=null)},onTimerEvent:function(){if(!this.currentlyExecuting)try{this.currentlyExecuting=!0,this.execute(),this.currentlyExecuting=!1}catch(e){throw this.currentlyExecuting=!1,e}}});Object.extend(String,{interpret:function(value){return null==value?"":String(value)},specialChar:{"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\\":"\\\\"}}),Object.extend(String.prototype,function(){function prepareReplacement(replacement){if(Object.isFunction(replacement))return replacement;var template=new Template(replacement);return function(match){return template.evaluate(match)}}function isNonEmptyRegExp(regexp){return regexp.source&&"(?:)"!==regexp.source}function gsub(pattern,replacement){var match,result="",source=this;if(replacement=prepareReplacement(replacement),Object.isString(pattern)&&(pattern=RegExp.escape(pattern)),!pattern.length&&!isNonEmptyRegExp(pattern))return replacement=replacement(""),replacement+source.split("").join(replacement)+replacement;for(;source.length>0;)match=source.match(pattern),match&&match[0].length>0?(result+=source.slice(0,match.index),result+=String.interpret(replacement(match)),source=source.slice(match.index+match[0].length)):(result+=source,source="");return result}function sub(pattern,replacement,count){return replacement=prepareReplacement(replacement),count=Object.isUndefined(count)?1:count,this.gsub(pattern,function(match){return--count<0?match[0]:replacement(match)})}function scan(pattern,iterator){return this.gsub(pattern,iterator),String(this)}function truncate(length,truncation){return length=length||30,truncation=Object.isUndefined(truncation)?"...":truncation,this.length>length?this.slice(0,length-truncation.length)+truncation:String(this)}function strip(){return this.replace(/^\s+/,"").replace(/\s+$/,"")}function stripTags(){return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?(\/)?>|<\/\w+>/gi,"")}function stripScripts(){return this.replace(new RegExp(Prototype.ScriptFragment,"img"),"")}function extractScripts(){var matchAll=new RegExp(Prototype.ScriptFragment,"img"),matchOne=new RegExp(Prototype.ScriptFragment,"im");return(this.match(matchAll)||[]).map(function(scriptTag){return(scriptTag.match(matchOne)||["",""])[1]})}function evalScripts(){return this.extractScripts().map(function(script){return eval(script)})}function escapeHTML(){return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function unescapeHTML(){return this.stripTags().replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")}function toQueryParams(separator){var match=this.strip().match(/([^?#]*)(#.*)?$/);return match?match[1].split(separator||"&").inject({},function(hash,pair){if((pair=pair.split("="))[0]){var key=decodeURIComponent(pair.shift()),value=pair.length>1?pair.join("="):pair[0];void 0!=value&&(value=value.gsub("+"," "),value=decodeURIComponent(value)),key in hash?(Object.isArray(hash[key])||(hash[key]=[hash[key]]),hash[key].push(value)):hash[key]=value}return hash}):{}}function toArray(){return this.split("")}function succ(){return this.slice(0,this.length-1)+String.fromCharCode(this.charCodeAt(this.length-1)+1)}function times(count){return 1>count?"":new Array(count+1).join(this)}function camelize(){return this.replace(/-+(.)?/g,function(match,chr){return chr?chr.toUpperCase():""})}function capitalize(){return this.charAt(0).toUpperCase()+this.substring(1).toLowerCase()}function underscore(){return this.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/-/g,"_").toLowerCase()}function dasherize(){return this.replace(/_/g,"-")}function inspect(useDoubleQuotes){var escapedString=this.replace(/[\x00-\x1f\\]/g,function(character){return character in String.specialChar?String.specialChar[character]:"\\u00"+character.charCodeAt().toPaddedString(2,16)});return useDoubleQuotes?'"'+escapedString.replace(/"/g,'\\"')+'"':"'"+escapedString.replace(/'/g,"\\'")+"'"}function unfilterJSON(filter){return this.replace(filter||Prototype.JSONFilter,"$1")}function isJSON(){var str=this;return str.blank()?!1:(str=str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@"),str=str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]"),str=str.replace(/(?:^|:|,)(?:\s*\[)+/g,""),/^[\],:{}\s]*$/.test(str))}function evalJSON(sanitize){var json=this.unfilterJSON(),cx=/[\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff\u0000]/g;cx.test(json)&&(json=json.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));try{if(!sanitize||json.isJSON())return eval("("+json+")")}catch(e){}throw new SyntaxError("Badly formed JSON string: "+this.inspect())}function parseJSON(){var json=this.unfilterJSON();return JSON.parse(json)}function include(pattern){return this.indexOf(pattern)>-1}function startsWith(pattern,position){return position=Object.isNumber(position)?position:0,this.lastIndexOf(pattern,position)===position}function endsWith(pattern,position){pattern=String(pattern),position=Object.isNumber(position)?position:this.length,0>position&&(position=0),position>this.length&&(position=this.length);var d=position-pattern.length;return d>=0&&this.indexOf(pattern,d)===d}function empty(){return""==this}function blank(){return/^\s*$/.test(this)}function interpolate(object,pattern){return new Template(this,pattern).evaluate(object)}var NATIVE_JSON_PARSE_SUPPORT=window.JSON&&"function"==typeof JSON.parse&&JSON.parse('{"test": true}').test;return{gsub:gsub,sub:sub,scan:scan,truncate:truncate,strip:String.prototype.trim||strip,stripTags:stripTags,stripScripts:stripScripts,extractScripts:extractScripts,evalScripts:evalScripts,escapeHTML:escapeHTML,unescapeHTML:unescapeHTML,toQueryParams:toQueryParams,parseQuery:toQueryParams,toArray:toArray,succ:succ,times:times,camelize:camelize,capitalize:capitalize,underscore:underscore,dasherize:dasherize,inspect:inspect,unfilterJSON:unfilterJSON,isJSON:isJSON,evalJSON:NATIVE_JSON_PARSE_SUPPORT?parseJSON:evalJSON,include:include,startsWith:String.prototype.startsWith||startsWith,endsWith:String.prototype.endsWith||endsWith,empty:empty,blank:blank,interpolate:interpolate}}());var Template=Class.create({initialize:function(template,pattern){this.template=template.toString(),this.pattern=pattern||Template.Pattern},evaluate:function(object){return object&&Object.isFunction(object.toTemplateReplacements)&&(object=object.toTemplateReplacements()),this.template.gsub(this.pattern,function(match){if(null==object)return match[1]+"";var before=match[1]||"";if("\\"==before)return match[2];var ctx=object,expr=match[3],pattern=/^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;if(match=pattern.exec(expr),null==match)return before;for(;null!=match;){var comp=match[1].startsWith("[")?match[2].replace(/\\\\]/g,"]"):match[1];if(ctx=ctx[comp],null==ctx||""==match[3])break;expr=expr.substring("["==match[3]?match[1].length:match[0].length),match=pattern.exec(expr)}return before+String.interpret(ctx)})}});Template.Pattern=/(^|.|\r|\n)(#\{(.*?)\})/;var $break={},Enumerable=function(){function each(iterator,context){try{this._each(iterator,context)}catch(e){if(e!=$break)throw e}return this}function eachSlice(number,iterator,context){var index=-number,slices=[],array=this.toArray();if(1>number)return array;for(;(index+=number)<array.length;)slices.push(array.slice(index,index+number));return slices.collect(iterator,context)}function all(iterator,context){iterator=iterator||Prototype.K;var result=!0;return this.each(function(value,index){if(result=result&&!!iterator.call(context,value,index,this),!result)throw $break},this),result}function any(iterator,context){iterator=iterator||Prototype.K;var result=!1;return this.each(function(value,index){if(result=!!iterator.call(context,value,index,this))throw $break},this),result}function collect(iterator,context){iterator=iterator||Prototype.K;var results=[];return this.each(function(value,index){results.push(iterator.call(context,value,index,this))},this),results}function detect(iterator,context){var result;return this.each(function(value,index){if(iterator.call(context,value,index,this))throw result=value,$break},this),result}function findAll(iterator,context){var results=[];return this.each(function(value,index){iterator.call(context,value,index,this)&&results.push(value)},this),results}function grep(filter,iterator,context){iterator=iterator||Prototype.K;var results=[];return Object.isString(filter)&&(filter=new RegExp(RegExp.escape(filter))),this.each(function(value,index){filter.match(value)&&results.push(iterator.call(context,value,index,this))},this),results}function include(object){if(Object.isFunction(this.indexOf)&&-1!=this.indexOf(object))return!0;var found=!1;return this.each(function(value){if(value==object)throw found=!0,$break}),found}function inGroupsOf(number,fillWith){return fillWith=Object.isUndefined(fillWith)?null:fillWith,this.eachSlice(number,function(slice){for(;slice.length<number;)slice.push(fillWith);return slice})}function inject(memo,iterator,context){return this.each(function(value,index){memo=iterator.call(context,memo,value,index,this)},this),memo}function invoke(method){var args=$A(arguments).slice(1);return this.map(function(value){return value[method].apply(value,args)})}function max(iterator,context){iterator=iterator||Prototype.K;var result;return this.each(function(value,index){value=iterator.call(context,value,index,this),(null==result||value>=result)&&(result=value)},this),result}function min(iterator,context){iterator=iterator||Prototype.K;var result;return this.each(function(value,index){value=iterator.call(context,value,index,this),(null==result||result>value)&&(result=value)},this),result}function partition(iterator,context){iterator=iterator||Prototype.K;var trues=[],falses=[];return this.each(function(value,index){(iterator.call(context,value,index,this)?trues:falses).push(value)},this),[trues,falses]}function pluck(property){var results=[];return this.each(function(value){results.push(value[property])}),results}function reject(iterator,context){var results=[];return this.each(function(value,index){iterator.call(context,value,index,this)||results.push(value)},this),results}function sortBy(iterator,context){return this.map(function(value,index){return{value:value,criteria:iterator.call(context,value,index,this)}},this).sort(function(left,right){var a=left.criteria,b=right.criteria;return b>a?-1:a>b?1:0}).pluck("value")}function toArray(){return this.map()}function zip(){var iterator=Prototype.K,args=$A(arguments);Object.isFunction(args.last())&&(iterator=args.pop());var collections=[this].concat(args).map($A);return this.map(function(value,index){return iterator(collections.pluck(index))})}function size(){return this.toArray().length}function inspect(){return"#<Enumerable:"+this.toArray().inspect()+">"}return{each:each,eachSlice:eachSlice,all:all,every:all,any:any,some:any,collect:collect,map:collect,detect:detect,findAll:findAll,select:findAll,filter:findAll,grep:grep,include:include,member:include,inGroupsOf:inGroupsOf,inject:inject,invoke:invoke,max:max,min:min,partition:partition,pluck:pluck,reject:reject,sortBy:sortBy,toArray:toArray,entries:toArray,zip:zip,size:size,inspect:inspect,find:detect}}();Array.from=$A,function(){function each(iterator,context){for(var i=0,length=this.length>>>0;length>i;i++)i in this&&iterator.call(context,this[i],i,this)}function clear(){return this.length=0,this}function first(){return this[0]}function last(){return this[this.length-1]}function compact(){return this.select(function(value){return null!=value})}function flatten(){return this.inject([],function(array,value){return Object.isArray(value)?array.concat(value.flatten()):(array.push(value),array)})}function without(){var values=slice.call(arguments,0);return this.select(function(value){return!values.include(value)})}function reverse(inline){return(inline===!1?this.toArray():this)._reverse()}function uniq(sorted){return this.inject([],function(array,value,index){return 0!=index&&(sorted?array.last()==value:array.include(value))||array.push(value),array})}function intersect(array){return this.uniq().findAll(function(item){return-1!==array.indexOf(item)})}function clone(){return slice.call(this,0)}function size(){return this.length}function inspect(){return"["+this.map(Object.inspect).join(", ")+"]"}function indexOf(item,i){if(null==this)throw new TypeError;var array=Object(this),length=array.length>>>0;if(0===length)return-1;if(i=Number(i),isNaN(i)?i=0:0!==i&&isFinite(i)&&(i=(i>0?1:-1)*Math.floor(Math.abs(i))),i>length)return-1;for(var k=i>=0?i:Math.max(length-Math.abs(i),0);length>k;k++)if(k in array&&array[k]===item)return k;return-1}function lastIndexOf(item,i){if(null==this)throw new TypeError;var array=Object(this),length=array.length>>>0;if(0===length)return-1;Object.isUndefined(i)?i=length:(i=Number(i),isNaN(i)?i=0:0!==i&&isFinite(i)&&(i=(i>0?1:-1)*Math.floor(Math.abs(i))));for(var k=i>=0?Math.min(i,length-1):length-Math.abs(i);k>=0;k--)if(k in array&&array[k]===item)return k;return-1}function concat(){var item,array=[],items=slice.call(arguments,0),n=0;items.unshift(this);for(var i=0,length=items.length;length>i;i++)if(item=items[i],!Object.isArray(item)||"callee"in item)array[n++]=item;else for(var j=0,arrayLength=item.length;arrayLength>j;j++)j in item&&(array[n]=item[j]),n++;return array.length=n,array}function wrapNative(method){return function(){if(0===arguments.length)return method.call(this,Prototype.K);if(void 0===arguments[0]){var args=slice.call(arguments,1);return args.unshift(Prototype.K),method.apply(this,args)}return method.apply(this,arguments)}}function map(iterator){if(null==this)throw new TypeError;iterator=iterator||Prototype.K;for(var object=Object(this),results=[],context=arguments[1],n=0,i=0,length=object.length>>>0;length>i;i++)i in object&&(results[n]=iterator.call(context,object[i],i,object)),n++;return results.length=n,results}function filter(iterator){if(null==this||!Object.isFunction(iterator))throw new TypeError;for(var value,object=Object(this),results=[],context=arguments[1],i=0,length=object.length>>>0;length>i;i++)i in object&&(value=object[i],iterator.call(context,value,i,object)&&results.push(value));return results}function some(iterator){if(null==this)throw new TypeError;iterator=iterator||Prototype.K;for(var context=arguments[1],object=Object(this),i=0,length=object.length>>>0;length>i;i++)if(i in object&&iterator.call(context,object[i],i,object))return!0;return!1}function every(iterator){if(null==this)throw new TypeError;iterator=iterator||Prototype.K;for(var context=arguments[1],object=Object(this),i=0,length=object.length>>>0;length>i;i++)if(i in object&&!iterator.call(context,object[i],i,object))return!1;return!0}var arrayProto=Array.prototype,slice=arrayProto.slice,_each=arrayProto.forEach;_each||(_each=each),arrayProto.map&&(map=wrapNative(Array.prototype.map)),arrayProto.filter&&(filter=Array.prototype.filter),arrayProto.some&&(some=wrapNative(Array.prototype.some)),arrayProto.every&&(every=wrapNative(Array.prototype.every)),Object.extend(arrayProto,Enumerable),arrayProto.entries===Enumerable.entries&&delete arrayProto.entries,arrayProto._reverse||(arrayProto._reverse=arrayProto.reverse),Object.extend(arrayProto,{_each:_each,map:map,collect:map,select:filter,filter:filter,findAll:filter,some:some,any:some,every:every,all:every,clear:clear,first:first,last:last,compact:compact,flatten:flatten,without:without,reverse:reverse,uniq:uniq,intersect:intersect,clone:clone,toArray:clone,size:size,inspect:inspect});var CONCAT_ARGUMENTS_BUGGY=function(){return 1!==[].concat(arguments)[0][0]}(1,2);CONCAT_ARGUMENTS_BUGGY&&(arrayProto.concat=concat),arrayProto.indexOf||(arrayProto.indexOf=indexOf),arrayProto.lastIndexOf||(arrayProto.lastIndexOf=lastIndexOf)}();var Hash=Class.create(Enumerable,function(){function initialize(object){this._object=Object.isHash(object)?object.toObject():Object.clone(object)}function _each(iterator,context){var i=0;for(var key in this._object){var value=this._object[key],pair=[key,value];pair.key=key,pair.value=value,iterator.call(context,pair,i),i++}}function set(key,value){return this._object[key]=value}function get(key){return this._object[key]!==Object.prototype[key]?this._object[key]:void 0}function unset(key){var value=this._object[key];return delete this._object[key],value}function toObject(){return Object.clone(this._object)}function keys(){return this.pluck("key")}function values(){return this.pluck("value")}function index(value){var match=this.detect(function(pair){return pair.value===value});return match&&match.key}function merge(object){return this.clone().update(object)}function update(object){return new Hash(object).inject(this,function(result,pair){return result.set(pair.key,pair.value),result})}function toQueryPair(key,value){return Object.isUndefined(value)?key:(value=String.interpret(value),value=value.gsub(/(\r)?\n/,"\r\n"),value=encodeURIComponent(value),value=value.gsub(/%20/,"+"),key+"="+value)}function toQueryString(){return this.inject([],function(results,pair){var key=encodeURIComponent(pair.key),values=pair.value;if(values&&"object"==typeof values){if(Object.isArray(values)){for(var value,queryValues=[],i=0,len=values.length;len>i;i++)value=values[i],queryValues.push(toQueryPair(key,value));return results.concat(queryValues)}}else results.push(toQueryPair(key,values));return results}).join("&")}function inspect(){return"#<Hash:{"+this.map(function(pair){return pair.map(Object.inspect).join(": ")}).join(", ")+"}>"}function clone(){return new Hash(this)}return{initialize:initialize,_each:_each,set:set,get:get,unset:unset,toObject:toObject,toTemplateReplacements:toObject,keys:keys,values:values,index:index,merge:merge,update:update,toQueryString:toQueryString,inspect:inspect,toJSON:toObject,clone:clone}}());Hash.from=$H,Object.extend(Number.prototype,function(){function toColorPart(){return this.toPaddedString(2,16)}function succ(){return this+1}function times(iterator,context){return $R(0,this,!0).each(iterator,context),this}function toPaddedString(length,radix){var string=this.toString(radix||10);return"0".times(length-string.length)+string}function abs(){return Math.abs(this)}function round(){return Math.round(this)}function ceil(){return Math.ceil(this)}function floor(){return Math.floor(this)}return{toColorPart:toColorPart,succ:succ,times:times,toPaddedString:toPaddedString,abs:abs,round:round,ceil:ceil,floor:floor}}());var ObjectRange=Class.create(Enumerable,function(){function initialize(start,end,exclusive){this.start=start,this.end=end,this.exclusive=exclusive}function _each(iterator,context){var i,value=this.start;for(i=0;this.include(value);i++)iterator.call(context,value,i),value=value.succ()}function include(value){return value<this.start?!1:this.exclusive?value<this.end:value<=this.end}return{initialize:initialize,_each:_each,include:include}}()),Abstract={},Try={these:function(){for(var returnValue,i=0,length=arguments.length;length>i;i++){var lambda=arguments[i];try{returnValue=lambda();break}catch(e){}}return returnValue}},Ajax={getTransport:function(){return Try.these(function(){return new XMLHttpRequest},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")})||!1},activeRequestCount:0};Ajax.Responders={responders:[],_each:function(iterator,context){this.responders._each(iterator,context)},register:function(responder){this.include(responder)||this.responders.push(responder)},unregister:function(responder){this.responders=this.responders.without(responder)},dispatch:function(callback,request,transport,json){this.each(function(responder){if(Object.isFunction(responder[callback]))try{responder[callback].apply(responder,[request,transport,json])}catch(e){}})}},Object.extend(Ajax.Responders,Enumerable),Ajax.Responders.register({onCreate:function(){Ajax.activeRequestCount++},onComplete:function(){Ajax.activeRequestCount--}}),Ajax.Base=Class.create({initialize:function(options){this.options={method:"post",asynchronous:!0,contentType:"application/x-www-form-urlencoded",encoding:"UTF-8",parameters:"",evalJSON:!0,evalJS:!0},Object.extend(this.options,options||{}),this.options.method=this.options.method.toLowerCase(),Object.isHash(this.options.parameters)&&(this.options.parameters=this.options.parameters.toObject())}}),Ajax.Request=Class.create(Ajax.Base,{_complete:!1,initialize:function($super,url,options){$super(options),this.transport=Ajax.getTransport(),this.request(url)},request:function(url){this.url=url,this.method=this.options.method;var params=Object.isString(this.options.parameters)?this.options.parameters:Object.toQueryString(this.options.parameters);["get","post"].include(this.method)||(params+=(params?"&":"")+"_method="+this.method,this.method="post"),params&&"get"===this.method&&(this.url+=(this.url.include("?")?"&":"?")+params),this.parameters=params.toQueryParams();try{var response=new Ajax.Response(this);this.options.onCreate&&this.options.onCreate(response),Ajax.Responders.dispatch("onCreate",this,response),this.transport.open(this.method.toUpperCase(),this.url,this.options.asynchronous),this.options.asynchronous&&this.respondToReadyState.bind(this).defer(1),this.transport.onreadystatechange=this.onStateChange.bind(this),this.setRequestHeaders(),this.body="post"==this.method?this.options.postBody||params:null,this.transport.send(this.body),!this.options.asynchronous&&this.transport.overrideMimeType&&this.onStateChange()}catch(e){this.dispatchException(e)}},onStateChange:function(){var readyState=this.transport.readyState;readyState>1&&(4!=readyState||!this._complete)&&this.respondToReadyState(this.transport.readyState)
},setRequestHeaders:function(){var headers={"X-Requested-With":"XMLHttpRequest","X-Prototype-Version":Prototype.Version,Accept:"text/javascript, text/html, application/xml, text/xml, */*"};if("post"==this.method&&(headers["Content-type"]=this.options.contentType+(this.options.encoding?"; charset="+this.options.encoding:""),this.transport.overrideMimeType&&(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]<2005&&(headers.Connection="close")),"object"==typeof this.options.requestHeaders){var extras=this.options.requestHeaders;if(Object.isFunction(extras.push))for(var i=0,length=extras.length;length>i;i+=2)headers[extras[i]]=extras[i+1];else $H(extras).each(function(pair){headers[pair.key]=pair.value})}for(var name in headers)null!=headers[name]&&this.transport.setRequestHeader(name,headers[name])},success:function(){var status=this.getStatus();return!status||status>=200&&300>status||304==status},getStatus:function(){try{return 1223===this.transport.status?204:this.transport.status||0}catch(e){return 0}},respondToReadyState:function(readyState){var state=Ajax.Request.Events[readyState],response=new Ajax.Response(this);if("Complete"==state){try{this._complete=!0,(this.options["on"+response.status]||this.options["on"+(this.success()?"Success":"Failure")]||Prototype.emptyFunction)(response,response.headerJSON)}catch(e){this.dispatchException(e)}var contentType=response.getHeader("Content-type");("force"==this.options.evalJS||this.options.evalJS&&this.isSameOrigin()&&contentType&&contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))&&this.evalResponse()}try{(this.options["on"+state]||Prototype.emptyFunction)(response,response.headerJSON),Ajax.Responders.dispatch("on"+state,this,response,response.headerJSON)}catch(e){this.dispatchException(e)}"Complete"==state&&(this.transport.onreadystatechange=Prototype.emptyFunction)},isSameOrigin:function(){var m=this.url.match(/^\s*https?:\/\/[^\/]*/);return!m||m[0]=="#{protocol}//#{domain}#{port}".interpolate({protocol:location.protocol,domain:document.domain,port:location.port?":"+location.port:""})},getHeader:function(name){try{return this.transport.getResponseHeader(name)||null}catch(e){return null}},evalResponse:function(){try{return eval((this.transport.responseText||"").unfilterJSON())}catch(e){this.dispatchException(e)}},dispatchException:function(exception){(this.options.onException||Prototype.emptyFunction)(this,exception),Ajax.Responders.dispatch("onException",this,exception)}}),Ajax.Request.Events=["Uninitialized","Loading","Loaded","Interactive","Complete"],Ajax.Response=Class.create({initialize:function(request){this.request=request;var transport=this.transport=request.transport,readyState=this.readyState=transport.readyState;if((readyState>2&&!Prototype.Browser.IE||4==readyState)&&(this.status=this.getStatus(),this.statusText=this.getStatusText(),this.responseText=String.interpret(transport.responseText),this.headerJSON=this._getHeaderJSON()),4==readyState){var xml=transport.responseXML;this.responseXML=Object.isUndefined(xml)?null:xml,this.responseJSON=this._getResponseJSON()}},status:0,statusText:"",getStatus:Ajax.Request.prototype.getStatus,getStatusText:function(){try{return this.transport.statusText||""}catch(e){return""}},getHeader:Ajax.Request.prototype.getHeader,getAllHeaders:function(){try{return this.getAllResponseHeaders()}catch(e){return null}},getResponseHeader:function(name){return this.transport.getResponseHeader(name)},getAllResponseHeaders:function(){return this.transport.getAllResponseHeaders()},_getHeaderJSON:function(){var json=this.getHeader("X-JSON");if(!json)return null;try{json=decodeURIComponent(escape(json))}catch(e){}try{return json.evalJSON(this.request.options.sanitizeJSON||!this.request.isSameOrigin())}catch(e){this.request.dispatchException(e)}},_getResponseJSON:function(){var options=this.request.options;if(!options.evalJSON||"force"!=options.evalJSON&&!(this.getHeader("Content-type")||"").include("application/json")||this.responseText.blank())return null;try{return this.responseText.evalJSON(options.sanitizeJSON||!this.request.isSameOrigin())}catch(e){this.request.dispatchException(e)}}});



(function () {


// Staple object.
var staple = {
	version : '0.1.0.0',
}


// Preprocess all query parameters.
var args = (sessionStorage['$args'] || "{}").evalJSON();

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

	sessionStorage['$args'] = Object.toJSON(args);
}


// Compute root path.
var mainScript = window.document.head.querySelector('script[data-main]');
var scriptPath = mainScript.dataset.main;
var home = mainScript.dataset.home;
var stapleRoot = scriptPath.substr(0, scriptPath.lastIndexOf('/') + 1);

requirejs.config({
	baseUrl : '',
	paths : {
		'staple' : stapleRoot + 'modules'
	}
});

// Clean up unused local variables.
delete stapleRoot;
delete length;
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


// A module usd to load all snippets from specified HTML file.
define('snippets', function (require, exports, module) {

var HTMLParser = require('staple/html-parser');

function onAjaxSuccess (response, name, onload) {
	var html = response.responseText, head = window.document.head, snippets = {};

	for (var i = 0, els = HTMLParser.parse(html), el; el = els[i]; ++i) {
		switch (el.tagName.toLowerCase()) {
		case 'style':
			head.appendChild(el);
			break;
		case 'script':
			if (el.type !== 'text/html' || !el.id)
				break;
			snippets[el.id] = el.innerHTML;
			break;
		default:
			break;
		}
	}

	onload(snippets);
};

function load (name, require, onload, config) {
	new Ajax.Request(require.toUrl(name + '.html'), {
		method : 'get',
		onSuccess : function(response) {
			onAjaxSuccess(response, name, onload);
		}
	});
};

return { load : load };

});


// A module usd to load specified snippet from specified HTML file.
define('snippet', function () {

function load (name, require, onload, config) {
	var temp = name.split('#'), path = temp[0], id = temp[1];
	require(['snippets!' + path], function (snippets) {
		// TODO: handle exceptions.
		var snippet = snippets[id];
		onload(snippet);
	});
};

return { load : load };

});


// Base class of all staple classes.
define('staple/object', function (require, exports, module) {

return Class.create({

	initialize : function () {
		this.$ = {};
		this._ = {};
	},

	invokeMethodAndEnsureSuperCalled : function (method, a, b, c, d, e) {
		this._[method] = false;
		var result = this[method](a, b, c, d, e);
		if (this._[method] != method)
			throw new Error('$super() not called in ' + method);
		delete this._[method];
		return result;
	},

	notifySuperCalled : function (method) {
		this._[method] = method;
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
