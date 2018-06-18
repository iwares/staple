"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_createClass=function(){function n(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,t,a){return t&&n(e.prototype,t),a&&n(e,a),e}}();function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}define("staple/application",function(require,e,t){var c=require("staple/interaction-manager").default,r={sessionStorage:function(){var e=window.sessionStorage;if(!e)return!1;try{var t="staple:///test/staple",a="staple";e.setItem(t,a);var n=a===e.getItem(t);return e.removeItem(t),n}catch(e){return!1}},localStorage:function(){var e=window.localStorage;if(!e)return!1;try{var t="staple:///test/staple",a="staple";e.setItem(t,a);var n=a===e.getItem(t);return e.removeItem(t),n}catch(e){return!1}},historyManagement:function(){var e=window.history;return"function"==typeof e.pushState&&"function"==typeof e.replaceState}},d=["sessionStorage"],a=[Symbol(),Symbol()],h=a[0],n=a[1],s=function(){function t(e){_classCallCheck(this,t),this[h]={key:e},this.load()}return _createClass(t,[{key:"load",value:function(){var e=localStorage.getItem(this[h].key)||"{}";return this[h].data=JSON.parse(e),this}},{key:"put",value:function(e,t){return this[h].data[e]=t,this}},{key:"get",value:function(e){return this[h].data[e]}},{key:"clear",value:function(){return this[h].data={},this}},{key:"commit",value:function(){var e=JSON.stringify(this[h].data);localStorage.setItem(this[h].key,e)}},{key:"raw",get:function(){return this[h].data}}]),t}(),i=function(){function e(){if(_classCallCheck(this,e),e.sharedInstance)throw new Error("Instance of Application already exist.");Object.defineProperty(e,"sharedInstance",{value:this}),this[h]={},this[n]={}}return _createClass(e,[{key:"invokeMethodAndEnsureSuperCalled",value:function(e){this[n][e]=!1;var t=this[e].apply(this,Array.prototype.slice.call(arguments,1));if(this[n][e]!=e)throw new Error("super."+e+"() not called in "+this.constructor.name+"."+e+"()");return delete this[n][e],t}},{key:"notifySuperCalled",value:function(e){this[n][e]=e}},{key:"onCreate",value:function(){c.sharedInstance.create(),this.notifySuperCalled("onCreate")}},{key:"resume",value:function(){this.invokeMethodAndEnsureSuperCalled("onResume")}},{key:"onResume",value:function(){c.sharedInstance.resume(),this.notifySuperCalled("onResume")}},{key:"pause",value:function(){this.invokeMethodAndEnsureSuperCalled("onPause")}},{key:"onPause",value:function(){var e=c.sharedInstance;e.pause();var t={};t.interactionManager=e.saveState(),this.saveApplicationState(t),this.notifySuperCalled("onPause")}},{key:"onTitleChanged",value:function(e){window.document.title=e}},{key:"onLastInteractionFinished",value:function(){var e=window.history;2<e.length?e.go(-2):window.close()}},{key:"onDestroy",value:function(){c.sharedInstance.destroy(),this.notifySuperCalled("onDestroy")}},{key:"onBrowserFeaturesNotSupport",value:function(e){return alert("Browser Features Not Support:\n"+JSON.stringify(e)),!1}},{key:"loadThenDeleteApplicationState",value:function(){var e="staple://"+this.namespace+"/imstate",t=sessionStorage[e];if(t)return sessionStorage.removeItem(e),JSON.parse(t)}},{key:"saveApplicationState",value:function(e){var t="staple://"+this.namespace+"/imstate";if(sessionStorage.removeItem(t),e){var a=JSON.stringify(e);sessionStorage[t]=a}}},{key:"checkBrowserFeatures",value:function(e){for(var t,a=[],n={},s=0;t=e[s];++s){var i=r[t];n[t]||(n[t]=!0,i&&i()||a.push(t))}return a}},{key:"start",value:function(e,t,a){var n=window.history,s=window.location,i=this[h],r=this.meta["browser-features"],o=c.sharedInstance,l="disable"!=window.document.head.meta["history-management"];if((r=r?r.split(","):[]).concat(d),l&&r.push("historyManagement"),!(r=this.checkBrowserFeatures(r)).length||!this.onBrowserFeaturesNotSupport(r)){i.url=s.origin+s.pathname,i.back=!1,l?"$1"!==n.state?(n.replaceState("$0","",i.url),n.pushState("$1","",i.url)):(n.back(),i.back=!0):"#$1"!==s.hash?s.hash="$1":t=void 0,this.invokeMethodAndEnsureSuperCalled("onCreate");var u=this.loadThenDeleteApplicationState();if(a&&(a=JSON.parse(a)),t)o.startInteraction(void 0,void 0,t,a);else if(u&&u.interactionManager)o.restoreState(u.interactionManager);else{if(!e)throw new Error("Home not specified.");o.startInteraction(void 0,void 0,e,a)}this.invokeMethodAndEnsureSuperCalled("onResume"),l?window.addEventListener("popstate",this.handlePopState.bind(this)):window.addEventListener("hashchange",this.handleHashChange.bind(this)),window.addEventListener("unload",this.handleUnload.bind(this))}}},{key:"handlePopState",value:function(){var e=window.history,t=this[h];"$1"==e.state?(e.back(),t.back=!0):t.back?(e.pushState("$1","",t.url),t.back=!1):(this.handleBackPressed(),e.pushState("$1","",t.url))}},{key:"handleHashChange",value:function(){var e=window.location;"#$1"!==e.hash&&(this.handleBackPressed(),e.hash="$1")}},{key:"handleBackPressed",value:function(){c.sharedInstance.handleBackPressed()}},{key:"handleUnload",value:function(){this.invokeMethodAndEnsureSuperCalled("onPause"),this.invokeMethodAndEnsureSuperCalled("onDestroy")}},{key:"getPreferences",value:function(e,t){var a=t?"":this.namespace;return new s("staple://"+a+"/prefs/"+e)}}]),e}();Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"Application",{value:i}),Object.defineProperty(e,"default",{value:i})}),define("staple/aside",function(require,e,t){var o=require("staple/periodical-task").default,n=require("staple/html-parser").default,l=Symbol(),a=function(){function r(e,t,a){var n=this;_classCallCheck(this,r);var s=this[l]={};s.frame=window.document.createElement("div"),s.frame.classList.add("staple-overlay-mask"),s.frame.handleBackPressed=this.handleBackPressed.bind(this),s.gravity=t,a&&this.setContent(a),s.overlayManager=e.overlayManager;var i=this.dismiss.bind(this);s.attachOutsideTouchHandler=function(){this.frame.addEventListener("click",i)},s.detachOutsideTouchHandler=function(){this.frame.removeEventListener("click",i)},s.fadeinTask=new o(100,!1),s.fadeinTask.run=function(){var e=n[l].root;e&&e.classList.add("staple-active")},s.attachTask=new o(800,!1),s.attachTask.run=s.attachOutsideTouchHandler.bind(s),s.detachTask=new o(300,!1),s.detachTask.run=s.overlayManager.detach.bind(s.overlayManager,s.frame),s.showing=!1}return _createClass(r,[{key:"setContent",value:function(e){if("[object String]"===Object.prototype.toString.call(e)){var t=n.parse(e);if(1!=t.length)throw new Error("Invalid content");e=t[0]}if(!(e instanceof HTMLElement))throw new Error("Content must be an HTML element");var a=this[l];switch(a.gravity){case"bottom":e.classList.add("staple-aside-bottom");break;case"top":e.classList.add("staple-aside-top");break;case"right":e.classList.add("staple-aside-right");break;default:e.classList.add("staple-aside-left")}e.addEventListener("click",function(e){return e.stopPropagation()}),e.classList.add("staple-aside"),a.frame.innerHTML="",a.frame.appendChild(this[l].root=e)}},{key:"select",value:function(e){var t=this[l].root;return"$root"===e?[t]:$A(t.querySelectorAll(e))}},{key:"selectOne",value:function(e){var t=this[l].root;return"$root"===e?t:t.querySelector(e)}},{key:"show",value:function(){var e=this[l];e.showing||(e.showing=!0,e.overlayManager.attach(e.frame),e.overlayManager.darken(),e.fadeinTask.start(!0),e.attachTask.start(!0),e.detachTask.stop())}},{key:"dismiss",value:function(){var e=this[l];e.showing&&(e.fadeinTask.stop(),e.attachTask.stop(),e.detachTask.start(!0),e.detachOutsideTouchHandler(),e.root&&e.root.classList.remove("staple-active"),e.overlayManager.lighten(),e.showing=!1)}},{key:"handleBackPressed",value:function(){return this.dismiss(),!0}},{key:"showing",get:function(){return this[l].showing}}]),r}();Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"Aside",{value:a}),Object.defineProperty(e,"default",{value:a})}),define("staple/dialog",function(require,e,t){var r=require("staple/periodical-task").default,n=require("staple/html-parser").default,o=Symbol(),a=function(){function i(e,t){var a=this;_classCallCheck(this,i);var n=this[o]={};n.frame=window.document.createElement("div"),n.frame.classList.add("staple-overlay-mask"),n.frame.handleBackPressed=this.handleBackPressed.bind(this),t&&this.setContent(t),n.overlayManager=e.overlayManager;var s=function(){a.cancelable&&a.cancelOnTouchOutside&&a.cancel()};n.attachOutsideTouchHandler=function(){this.frame.addEventListener("click",s)},n.detachOutsideTouchHandler=function(){this.frame.removeEventListener("click",s)},n.fadeinTask=new r(100,!1),n.fadeinTask.run=function(){var e=a[o].root;e&&e.classList.add("staple-active")},n.attachTask=new r(800,!1),n.attachTask.run=n.attachOutsideTouchHandler.bind(n),n.detachTask=new r(300,!1),n.detachTask.run=n.overlayManager.detach.bind(n.overlayManager,n.frame),n.showing=!1}return _createClass(i,[{key:"dispatchToListener",value:function(e){var t=this[e+"Listener"]||this;"[object Function]"===Object.prototype.toString.call(t[e])&&t[e](this)}},{key:"show",value:function(){var e=this[o];e.showing||(e.showing=!0,e.overlayManager.attach(e.frame),e.overlayManager.darken(),e.fadeinTask.start(!0),e.attachTask.start(!0),e.detachTask.stop(),this.dispatchToListener("onShow"))}},{key:"dismiss",value:function(){var e=this[o];e.showing&&(this.dispatchToListener("onDismiss"),e.fadeinTask.stop(),e.attachTask.stop(),e.detachTask.start(!0),e.detachOutsideTouchHandler(),e.root&&e.root.classList.remove("staple-active"),e.overlayManager.lighten(),e.showing=!1)}},{key:"cancel",value:function(){this[o].showing&&(this.dispatchToListener("onCancel"),this.dismiss())}},{key:"setContent",value:function(e){if("[object String]"===Object.prototype.toString.call(e)){var t=n.parse(e);if(1!=t.length)throw new Error("Invalid content");e=t[0]}if(!(e instanceof HTMLElement))throw new Error("Content must be an HTML element");e.addEventListener("click",function(e){return e.stopPropagation()}),e.open=!0,e.classList.add("staple-dialog");var a=this[o];a.frame.innerHTML="",a.frame.appendChild(this[o].root=e)}},{key:"select",value:function(e){var t=this[o].root;return"$root"===e?[t]:$A(t.querySelectorAll(e))}},{key:"selectOne",value:function(e){var t=this[o].root;return"$root"===e?t:t.querySelector(e)}},{key:"handleBackPressed",value:function(){return this.onBackPressed(),!0}},{key:"onBackPressed",value:function(){this.cancelable&&this.cancel()}},{key:"showing",get:function(){return this[o].showing}}]),i}();Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"Dialog",{value:a}),Object.defineProperty(e,"default",{value:a})}),define("staple/html-parser",function(require,e,t){var i=window.document.createElement("div"),a=function e(){throw _classCallCheck(this,e),new Error("This class can not be initialized")};a.parse=function(e){i.innerHTML=e;for(var t,a=i.children,n=[],s=0;t=a[s];++s)n.push(t);return i.innerHTML="",n},Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"HTMLParser",{value:a}),Object.defineProperty(e,"default",{value:a})}),define("staple/interaction-manager",function(require,e,t){var l=require("staple/html-parser").default,h=require("staple/uuid").default,T=Symbol(),a=function(){function e(){if(_classCallCheck(this,e),e.sharedInstance)throw new Error("Instance of InteractionManager already exist.");this[T]={}}return _createClass(e,[{key:"handleBackPressed",value:function(){var e=this[T].active;e&&e.handleBackPressed()}},{key:"create",value:function(){var e=window.document.body,t=this[T];t.indicator=e.querySelector("article#staple-indicator"),t.loading=!1;var a=l.parse('<article id="staple-interrupter"></article><article id="staple-desktop"></article>'),n=t.interrupter=a[0];t.busy=!1,n.style.backgroundColor="transparent",e.appendChild(n);var s=t.desktop=a[1];e.appendChild(s);var i="";for(var r in{Webkit:"webkit",Moz:"",O:"o"})if(void 0!==s.style[r+"TransitionProperty"]){i="-"+r.toLowerCase()+"-";break}t.prefix=i;var o=t.contexts=[];o.remove=function(e){for(var t,a=this.concat(),n=this.length=0;t=a[n];++n)e!==t&&this.push(t);return this},o.findByUUID=function(e){for(var t,a=0;t=this[a];++a)if(t.uuid===e)return t},o.top=function(){return this[this.length-1]},t.active=t.previous=null,t.instances={},t.maxInstanceCount=8,t.paused=!0}},{key:"pause",value:function(){var e=this[T],t=e.active,a=e.contexts;if(!e.paused&&(e.paused=!0,0!==a.length&&t)){var n=t[T].context;t.pause();var s={};t.performSaveInstanceState(s),n.state=s}}},{key:"saveState",value:function(){if(0!==this[T].contexts.length)return{contexts:this[T].contexts}}},{key:"restoreState",value:function(e){var t=this[T].contexts;t.length=0,Array.prototype.push.apply(t,e.contexts)}},{key:"resume",value:function(){var e=this[T],t=e.active;e.paused&&(e.paused=!1,t?t.resume():this.instantiateActivedInteraction())}},{key:"destroy",value:function(){for(var e,t=this[T],a=t.contexts,n=t.instances,s=a.length-1;e=a[s];--s){var i=n[e.uuid];i&&(i.destroy(),delete n[e.uuid])}a.length=0}},{key:"startInteraction",value:function(e,t,a,n){this.setBusy(!0),void 0!==n&&(n=JSON.parse(JSON.stringify(n))),setTimeout(this.performStartInteraction.bind(this,e,t,a,n))}},{key:"finishInteraction",value:function(e){this.setBusy(!0),setTimeout(this.performFinishInteraction.bind(this,e))}},{key:"setBusy",value:function(e){var t=this[T];t.busy!=e&&(t.interrupter.style.zIndex=e?2e9:0,t.busy=e)}},{key:"setLoading",value:function(e){var t=this[T];if(t.loading!=e){var a=t.indicator.classList;e?a.add("staple-active"):a.remove("staple-active"),t.loading=e}}},{key:"performStartInteraction",value:function(e,t,a,n){var s=this[T],i=s.active,r=s.contexts,o=s.instances;if(i){var l=r.top(),u={};i.pause(),i.performSaveInstanceState(u),l.state=u,s.previous=i,s.active=null}var c={uuid:h.randomUUID(),parent:e,requestCode:t,name:a,extra:n,resultCode:"CANCEL",resultData:void 0,pendingResults:[]};if(r.length>=s.maxInstanceCount){var d=r[r.length-s.maxInstanceCount];o[d.uuid]&&i.destroy(),delete o[d.uuid]}r.push(c),s.animation="start",this.instantiateActivedInteraction()}},{key:"performFinishInteraction",value:function(e){var t=this[T],a=t.active,n=t.contexts,s=t.instances,i=n.findByUUID(e);if(i){var r=n.findByUUID(i.parent);if(r){var o={request:i.requestCode,result:i.resultCode,data:i.resultData};r.pendingResults.push(o)}if(delete s[i.uuid],i===n.top()){if(a.pause(),a.destroy(),t.previous=a,t.active=null,n.remove(i),0==n.length)return staple.application.onLastInteractionFinished(),void(t.desktop.innerHTML="");t.animation="finish",this.instantiateActivedInteraction()}else n.remove(i)}}},{key:"instantiateActivedInteraction",value:function(){var e=this[T],t=e.contexts,a=e.instances,n=t.top();if(n&&!this[T].paused){var s=a[n.uuid];if(s)return delete n.state,void this.doInteractionCreated(s);this.setLoading(!0),(0,window.require)([n.name],this.doInteractionClassLoaded.bind(this,n))}}},{key:"doInteractionClassLoaded",value:function(e,t){if(e==this[T].contexts.top()){var a=new t.default(T,e);a[T].context=e,a.create(e.state),this.doInteractionCreated(a)}}},{key:"doInteractionCreated",value:function(e){var t=this[T],a=t.contexts,n=t.instances,s=e[T].context;if(s==a.top()){n[s.uuid]=e,this.setLoading(!1),s.state&&e.performRestoreInstanceState(s.state),delete s.state;var i=e[T].root;if(!i)throw new Error("Please call setContent() during onCreate().");var r="cubic-bezier(.4,1,.6,1)",o="cubic-bezier(.4,0,.6,0)",l=void 0,u=void 0,c=void 0,d=void 0,h=void 0,f=void 0,v=void 0,p=void 0;switch(t.animation){case"start":l=e,u=t.previous,c=u,f=(p="staple-it-"+(l[T].root.dataset.anim||"default"))+"-enter",d=r,v=p+"-push",h=o,t.desktop.appendChild(i);break;case"finish":l=t.previous,u=e,f=(p="staple-it-"+((c=l)[T].root.dataset.anim||"default"))+"-leave",d=o,v=p+"-pop",h=r,t.desktop.insertBefore(i,l?l[T].root:void 0);break;default:l=e,t.desktop.appendChild(i)}var y=s.pendingResults,k="staple:///results/"+s.uuid,m=sessionStorage[k];m&&y.push(m.evalJSON()),sessionStorage.removeItem(k);for(var g,w=0;g=y[w];++w)e.onInteractionResult(g.request,g.result,g.data);y.length=0,e.resume();var b=l?l[T].root.style.context:"",C=u?u[T].root.style.context:"";p&&t.previous?(l&&(l[T].root.style.cssText+=";"+t.prefix+"animation:"+f+" .2s "+d+";"+t.prefix+"animation-fill-mode: both;"),u&&(u[T].root.style.cssText+=";"+t.prefix+"animation:"+v+" .2s "+h+";"+t.prefix+"animation-fill-mode: both;"),setTimeout(S.bind(this),300)):S.apply(this),t.active=e}function S(){c&&t.desktop.removeChild(c[T].root),l&&(l[T].root.style.cssText=b),u&&(u[T].root.style.cssText=C),this.setBusy(!1)}}}]),e}();Object.defineProperty(a,"sharedInstance",{value:new a}),Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"InteractionManager",{value:a}),Object.defineProperty(e,"default",{value:a})}),define("staple/interaction",function(require,e,t){var r=require("staple/interaction-manager").default,n=require("staple/application").default,s=require("staple/html-parser").default,i=require("staple/periodical-task").default,a=[Symbol(),Symbol()],o=a[0],l=a[1],u=function(){function e(){_classCallCheck(this,e),this.panel=window.document.createElement("article"),this.panel.id="staple-overlay",this.updater=new i(100,!1,this),this.darkness=0}return _createClass(e,[{key:"resume",value:function(){window.document.body.appendChild(this.panel),this.updater.start(!0)}},{key:"pause",value:function(){this.updater.stop(),window.document.body.removeChild(this.panel)}},{key:"darken",value:function(){++this.darkness,this.updater.start(!0)}},{key:"lighten",value:function(){--this.darkness,this.updater.start(!0)}},{key:"run",value:function(){var e=this.panel;0===e.childElementCount?e.classList.remove("staple-active"):e.classList.add("staple-active"),0===this.darkness?e.classList.remove("staple-overlay-dim"):e.classList.add("staple-overlay-dim")}},{key:"attach",value:function(e){this.panel.appendChild(e),this.updater.start(!0)}},{key:"detach",value:function(e){this.panel.removeChild(e),this.run()}},{key:"handleBackPressed",value:function(){for(var e=this.panel.lastElementChild;e;){if(e.handleBackPressed())return!0;e=e.previousElementSibling}return!1}}]),e}(),c=function(){function a(e,t){_classCallCheck(this,a),this[o]=this[e]={context:t},this[l]={}}return _createClass(a,[{key:"invokeMethodAndEnsureSuperCalled",value:function(e){this[l][e]=!1;var t=this[e].apply(this,Array.prototype.slice.call(arguments,1));if(this[l][e]!=e)throw new Error("super."+e+"() not called in "+this.constructor.name+"."+e+"()");return delete this[l][e],t}},{key:"notifySuperCalled",value:function(e){this[l][e]=e}},{key:"create",value:function(e){var n=this,t=this[o];t.active=!1,t.tasks={},t.overlayManager=new u,t.creating=!0,this.invokeMethodAndEnsureSuperCalled("onCreate",e),delete t.creating,this[o].root.onclick=function(e){for(var t=e.target;t;){var a=n[t.getAttribute("staple:click")];if("[object Function]"===Object.prototype.toString.call(a)){a.call(n,t),e.preventDefault();break}t=t.parentElement}}}},{key:"onCreate",value:function(e){this.notifySuperCalled("onCreate")}},{key:"performRestoreInstanceState",value:function(e){this.onRestoreInstanceState(e)}},{key:"onRestoreInstanceState",value:function(e){}},{key:"resume",value:function(){this[o].active=!0,n.sharedInstance.onTitleChanged(this.getTitle()),this[o].overlayManager.resume(),this.invokeMethodAndEnsureSuperCalled("onResume")}},{key:"onResume",value:function(){this.notifySuperCalled("onResume")}},{key:"onInteractionResult",value:function(e,t,a){}},{key:"pause",value:function(){this.invokeMethodAndEnsureSuperCalled("onPause"),this[o].overlayManager.pause(),this[o].active=!1}},{key:"onPause",value:function(){this.notifySuperCalled("onPause")}},{key:"performSaveInstanceState",value:function(e){this.onSaveInstanceState(e)}},{key:"onSaveInstanceState",value:function(e){}},{key:"destroy",value:function(){this.invokeMethodAndEnsureSuperCalled("onDestroy");var e=this[o].tasks;for(var t in e){e[t].stop(),delete e[t]}}},{key:"onDestroy",value:function(){this.notifySuperCalled("onDestroy")}},{key:"handleBackPressed",value:function(){this[o].overlayManager.handleBackPressed()||this.onBackPressed()}},{key:"onBackPressed",value:function(){this.finish()}},{key:"finish",value:function(){r.sharedInstance.finishInteraction(this[o].context.uuid)}},{key:"startInteraction",value:function(e,t,a){var n=r.sharedInstance,s=this[o].context,i=a?s.uuid:void 0;a||(a=void 0),n.startInteraction(i,a,e,t)}},{key:"getExtra",value:function(){return this.extra}},{key:"getUUID",value:function(){return this.uuid}},{key:"setResult",value:function(e,t){var a=this[o].context;a.resultCode=e,a.resultData=t}},{key:"getPreferences",value:function(e,t){return n.sharedInstance.getPreferences(e,t)}},{key:"setContent",value:function(e){if(!this[o].creating)throw new Error("setContent() must be called during onCreate()");if("[object String]"===Object.prototype.toString.call(e)){var t=s.parse(e);if(1!=t.length)throw new Error("Invalid content");e=t[0]}if(!(e instanceof HTMLElement))throw new Error("Content must be an HTML element");this[o].root=e}},{key:"getTitle",value:function(){var e=this[o].root,t=e?e.dataset.title:void 0;return t||n.sharedInstance.title}},{key:"setTitle",value:function(e){if(this[o].root.dataset.title=e,!this[o].active)return e;var t=e||n.sharedInstance.title;return n.sharedInstance.onTitleChanged(t),e}},{key:"select",value:function(e){var t=this[o].root;return"$root"===e?[t]:$A(t.querySelectorAll(e))}},{key:"selectOne",value:function(e){var t=this[o].root;return"$root"===e?t:t.querySelector(e)}},{key:"scheduleRunnable",value:function(e,t,a){var n=new i(t,a,e);n.runnable=e,(this[o].tasks[n.id()]=n).start()}},{key:"cancelRunnables",value:function(e){var t=this[o].tasks;for(var a in t){var n=t[a];n.runnable===e&&(n.stop(),delete t[a])}}},{key:"extra",get:function(){return this[o].context.extra}},{key:"uuid",get:function(){return this[o].context.uuid}},{key:"overlayManager",get:function(){return this[o].overlayManager}},{key:"title",get:function(){return getTitle()},set:function(e){return setTitle(e)}}]),a}();Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"Interaction",{value:c}),Object.defineProperty(e,"default",{value:c})}),define("staple/nls",function(require,e,t){var l=function(){function n(e,t,require,a){_classCallCheck(this,n),this.bundle=e,this.languages=t,this.require=require,this.onload=a}return _createClass(n,[{key:"load",value:function(){require([this.bundle+"/master"],this.onMasterLoaded.bind(this))}},{key:"onMasterLoaded",value:function(e){var t=this.parts=[],a=this.needed=[],n=[],s=this.languages;this.master=e=e.default;for(var i=s.length-1;0<=i;--i){var r=s[i];if(r){var o=e[r=r.toLowerCase()];o&&(t.push(r),"object"!==(void 0===o?"undefined":_typeof(o))&&(a.push(r),n.push(this.bundle+"/"+r)))}}this.require(n,this.onPartsLoaded.bind(this))}},{key:"onPartsLoaded",value:function(){for(var e=this.master,t=this.needed,a=this.parts,n=0;n<t.length;++n)e[t[n]]=arguments[n].default;for(var s,i={"@name":this.bundle},r=0;s=e[a[r]];++r)for(var o in s)i[o]=s[o];var l={};for(var u in i)Object.defineProperty(l,u,{value:i[u]});Object.defineProperty(l,"__esModule",{value:!0}),Object.defineProperty(l,"default",{value:l}),this.onload(l)}}]),n}();e.load=function(e,require,t,a){if(a.isBuild)return t(null);var n=[];navigator.customizedLanguage&&n.push(navigator.customizedLanguage),navigator.language&&n.push(navigator.language),navigator.languages&&(n=n.concat(navigator.languages)),n.push("root");for(var s,i=[],r={},o=0;s=n[o];++o)r[s]||(r[s]=!0,i.push(s));new l(e,n=i,require,t).load()}}),define("staple/periodical-task",function(require,e,t){var s=Symbol(),a=function(){function n(e,t,a){_classCallCheck(this,n),this[s]={runnable:a,ms:e,repeat:t}}return _createClass(n,[{key:"handler",value:function(){var e=this[s];e.repeat||delete e.tid,(e.runnable||this).run()}},{key:"start",value:function(e){var t=this[s];if(t.tid){if(!e)return;(t.repeat?clearInterval:clearTimeout)(t.tid)}var a=t.repeat?setInterval:setTimeout;t.tid=a(this.handler.bind(this),t.ms)}},{key:"stop",value:function(){var e=this[s];e.tid&&((e.repeat?clearInterval:clearTimeout)(e.tid),delete e.tid)}},{key:"running",get:function(){return!!this[s].tid}}]),n}();Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"PeriodicalTask",{value:a}),Object.defineProperty(e,"default",{value:a})}),define("staple/popup",function(require,e,t){var o=require("staple/periodical-task").default,n=require("staple/html-parser").default,l=Symbol(),a=function(){function r(e,t,a){var n=this;_classCallCheck(this,r);var s=this[l]={};s.frame=window.document.createElement("div"),s.frame.classList.add("staple-overlay-mask"),s.frame.handleBackPressed=this.handleBackPressed.bind(this),s.gravity=t,a&&this.setContent(a),s.overlayManager=e.overlayManager;var i=this.dismiss.bind(this);s.attachOutsideTouchHandler=function(){this.frame.addEventListener("click",i)},s.detachOutsideTouchHandler=function(){this.frame.removeEventListener("click",i)},s.fadeinTask=new o(100,!1),s.fadeinTask.run=function(){var e=n[l].root;e&&e.classList.add("staple-active")},s.attachTask=new o(800,!1),s.attachTask.run=s.attachOutsideTouchHandler.bind(s),s.detachTask=new o(300,!1),s.detachTask.run=s.overlayManager.detach.bind(s.overlayManager,s.frame),s.showing=!1}return _createClass(r,[{key:"setContent",value:function(e){if("[object String]"===Object.prototype.toString.call(e)){var t=n.parse(e);if(1!=t.length)throw new Error("Invalid content");e=t[0]}if(!(e instanceof HTMLElement))throw new Error("Content must be an HTML element");var a=this[l];e.addEventListener("click",function(e){return e.stopPropagation()}),e.classList.add("staple-popup"),a.frame.innerHTML="",a.frame.appendChild(this[l].root=e),a.showing&&this.adjustPopupPosition()}},{key:"select",value:function(e){var t=this[l].root;return"$root"===e?[t]:$A(t.querySelectorAll(e))}},{key:"selectOne",value:function(e){var t=this[l].root;return"$root"===e?t:t.querySelector(e)}},{key:"showAtLocation",value:function(e,t){var a=this[l];a.x=e,a.y=t,a.showing||(a.showing=!0,a.overlayManager.attach(a.frame),a.fadeinTask.start(!0),a.attachTask.start(!0),a.detachTask.stop()),this.adjustPopupPosition()}},{key:"adjustPopupPosition",value:function(){var e=this[l];if(e.showing&&e.root){for(var t,a=e.x,n=e.y,s=a,i=n,r=(e.gravity||"").replace(/\s+/g,"").split("|"),o=0;t=r[o];++o)switch(t){case"left":s=a;break;case"top":i=n;break;case"right":s=a-e.root.offsetWidth;break;case"bottom":i=n-e.root.offsetHeight}e.root.style.left=s+"px",e.root.style.top=i+"px"}}},{key:"showAsDropDown",value:function(e,t,a,n){for(var s,i=e.getBoundingClientRect(),r=i.left,o=i.top,l=(n||"").replace(/\s+/g,"").split("|"),u=0;s=l[u];++u)switch(s){case"left":r=i.left;break;case"top":o=i.top;break;case"right":r=i.right;break;case"bottom":o=i.bottom}this.showAtLocation(r+(t||0),o+(a||0))}},{key:"dismiss",value:function(){var e=this[l];e.showing&&(e.fadeinTask.stop(),e.attachTask.stop(),e.detachTask.start(!0),e.detachOutsideTouchHandler(),e.root&&e.root.classList.remove("staple-active"),e.showing=!1)}},{key:"handleBackPressed",value:function(){return this.dismiss(),!0}},{key:"gravity",set:function(e){return this[l].gravity=e},get:function(){return this[l].gravity}},{key:"showing",get:function(){return this[l].showing}}]),r}();Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"Popup",{value:a}),Object.defineProperty(e,"default",{value:a})}),define("staple/snippets",function(require,e,t){var r=require("staple/html-parser").default,n=function(){function a(e,require,t){_classCallCheck(this,a),this.path=e,this.require=require,this.onload=t}return _createClass(a,[{key:"notifyError",value:function(e){var t=new Error("Faild to load snippet file: "+this.path+"("+e+").");this.onload.error(t)}},{key:"load",value:function(){var t=this,a=new XMLHttpRequest;a.open("get",this.require.toUrl(this.path+".html"),!0),a.onreadystatechange=function(e){if(4==a.readyState)return 200!=a.status?t.onHTMLNotLoaded(a):void t.onHTMLLoaded(a)},a.send()}},{key:"onHTMLLoaded",value:function(e){var t=(this.html=e.responseText).match(/\[nls\@[a-zA-Z0-9\-\/_]+:[a-zA-Z0-9\-_]+\]/g);if(!t||!t.length)return this.onNLSResolved();for(var a,n=this.nlsphs=[],s=[],i={},r=0;a=t[r];++r){var o=a.substr(5,a.length-6).split(":");n.push({match:a,name:o[0],key:o[1]}),i[o[0]]||(i[o[0]]=!0,s.push("staple/nls!"+o[0]))}this.require(s,this.onNLSLoaded.bind(this))}},{key:"onHTMLNotLoaded",value:function(e){this.notifyError(e.status)}},{key:"onNLSLoaded",value:function(){for(var e,t=this.nlsphs,a=this.html,n={},s=0;e=arguments[s];++s)n[e.default["@name"]]=e.default;for(var i,r=0;i=t[r];++r)a=a.replace(i.match,n[i.name][i.key]);this.html=a,this.onNLSResolved()}},{key:"onNLSResolved",value:function(){for(var e,t=this.html,a=window.document.head,n={},s=0,i=r.parse(t);e=i[s];++s)switch(e.tagName.toLowerCase()){case"style":a.appendChild(e);break;case"script":if("text/html"!==e.type||!e.id)break;Object.defineProperty(n,e.id,{value:e.innerHTML.trim()})}Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"default",{value:n}),this.onload(n)}}]),a}();e.load=function(e,require,t,a){if(a.isBuild)return t(null);new n(e,require,t).load()}}),define("staple/toast",function(require,e,t){var r=require("staple/periodical-task").default,s=require("staple/html-parser").default,o=Symbol(),a=function(){function i(e,t,a){var n=this;_classCallCheck(this,i);var s=this[o]={};a="long"==a?3800:1800,s.fadeinTask=new r(100,!1),s.fadeinTask.run=function(){n[o].frame.classList.add("staple-active")},s.fadeoutTask=new r(a,!1),s.fadeoutTask.run=function(){n[o].frame.classList.remove("staple-active"),n[o].dismissTask.start()},s.dismissTask=new r(300,!1),s.dismissTask.run=this.dismiss.bind(this),t&&this.setContent(t),s.overlayManager=e.overlayManager,s.showing=!1}return _createClass(i,[{key:"setContent",value:function(e){var t=this,a=this[o];if(a.frame)throw new Error("Cannot setContent for a toast after it is initialized");if("[object String]"===Object.prototype.toString.call(e)){var n=s.parse(e);if(1!=n.length)throw new Error("Invalid content");e=n[0]}if(!(e instanceof HTMLElement))throw new Error("Content must be an HTML element");e.addEventListener("click",function(e){t.show(),e.stopPropagation()}),e.classList.add("staple-toast"),a.frame=this[o].root=e,a.frame.handleBackPressed=this.handleBackPressed.bind(this)}},{key:"select",value:function(e){var t=this[o].root;return"$root"===e?[t]:$A(t.querySelectorAll(e))}},{key:"selectOne",value:function(e){var t=this[o].root;return"$root"===e?t:t.querySelector(e)}},{key:"show",value:function(){var e=this[o];e.showing||(e.showing=!0,e.overlayManager.attach(e.frame)),e.fadeinTask.start(!1),e.fadeoutTask.start(!0),e.dismissTask.stop()}},{key:"dismiss",value:function(){var e=this[o];e.showing&&(e.fadeoutTask.stop(),e.fadeinTask.stop(),e.dismissTask.stop(),e.overlayManager.detach(e.frame),e.showing=!1)}},{key:"handleBackPressed",value:function(){return!1}},{key:"showing",get:function(){return this[o].showing}}]),i}();Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"Toast",{value:a}),Object.defineProperty(e,"default",{value:a})}),define("staple/uuid",function(require,e,t){var i="0123456789ABCDEF".split(""),a=function e(){throw _classCallCheck(this,e),new Error("This class can not be initialized")};a.randomUUID=function(){for(var e=i,t=new Array(36),a=0,n=void 0,s=0;s<36;s++)8==s||13==s||18==s||23==s?t[s]="-":14==s?t[s]="4":(a<=2&&(a=33554432+16777216*Math.random()|0),n=15&a,a>>=4,t[s]=e[19==s?3&n|8:n]);return t.join("")},Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"UUID",{value:a}),Object.defineProperty(e,"default",{value:a})}),function(){var i={value:"1.0.0"},r=JSON.parse(window.sessionStorage["staple:///args"]||"{}"),e=window.location.search,o=void 0,l=void 0,t=void 0;if(e){var a=e.substr(1).split("&");r={};for(var n,s=0;n=a[s];++s){var u=n.split("=");switch(u[0]){case"_int":o=decodeURIComponent(u[1]);break;case"_ext":l=decodeURIComponent(u[1]);break;case"_bust":t=decodeURIComponent(u[1]);break;default:r[u[0]]=decodeURIComponent(u[1])}}window.sessionStorage["staple:///args"]=JSON.stringify(r)}for(var c,d=window.document.head.querySelectorAll("meta"),h={},f=0;c=d[f];++f)h[c.name]=c.content;window.document.head.meta=h,"timestamp"==(t=window.sessionStorage["staple:///bust"]||t||h["version-code"])&&(t=(new Date).getTime()),window.sessionStorage["staple:///bust"]=t||"";var v=window.document.head.querySelector("script[data-main]"),p=v.dataset.main,y=v.dataset.base,k=v.dataset.home,m=p.substr(0,p.lastIndexOf("/")+1);requirejs.config({baseUrl:y||"",urlArgs:t?"_bust="+t:void 0,waitSeconds:15,paths:{staple:m+"modules"}}),require(["application","staple/application"],function(e,t){var a=e.default,n=t.default,s=i.application=new a;if(!s instanceof n)throw new Error(e.name+' is not a subclass of "staple/application"');return Object.defineProperty(s,"namespace",{value:window.location.pathname}),Object.defineProperty(s,"title",{value:window.document.title}),Object.defineProperty(s,"meta",{value:window.document.head.meta}),Object.defineProperty(s,"args",{value:r}),s.start(k,o,l)}),window.staple=i}();
//# sourceMappingURL=staple.js.map
