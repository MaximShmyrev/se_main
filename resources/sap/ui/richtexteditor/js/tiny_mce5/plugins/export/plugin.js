/* Tiny Export plugin
 *
 * Copyright 2020 Tiny Technologies LLC. All rights reserved.
 *
 * Version: 0.1.0-8
 */

!function(){"use strict";function n(t){return parseInt(t,10)}function i(t,e){var n=t-e;return 0==n?0:0<n?1:-1}function r(t,e,n){return{major:t,minor:e,patch:n}}function o(t){var e=/([0-9]+)\.([0-9]+)\.([0-9]+)(?:(\-.+)?)/.exec(t);return e?r(n(e[1]),n(e[2]),n(e[3])):r(0,0,0)}function f(t,e){return!!t&&-1===function(t,e){var n=i(t.major,e.major);if(0!==n)return n;var r=i(t.minor,e.minor);if(0!==r)return r;var o=i(t.patch,e.patch);return 0!==o?o:0}(o([(n=t).majorVersion,n.minorVersion].join(".").split(".").slice(0,3).join(".")),o(e));var n}function t(){}function s(t){return function(){return t}}function u(r){for(var o=[],t=1;t<arguments.length;t++)o[t-1]=arguments[t];return function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=o.concat(t);return r.apply(null,n)}}var e,c,a,l,d=s(!1),m=s(!0),p={},h={exports:p};c=p,a=h,l=e=void 0,function(t){if("object"==typeof c&&void 0!==a)a.exports=t();else if("function"==typeof e&&e.amd)e([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).EphoxContactWrapper=t()}}(function(){return function i(u,c,a){function f(e,t){if(!c[e]){if(!u[e]){var n="function"==typeof l&&l;if(!t&&n)return n(e,!0);if(s)return s(e,!0);var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}var o=c[e]={exports:{}};u[e][0].call(o.exports,function(t){return f(u[e][1][t]||t)},o,o.exports,i,u,c,a)}return c[e].exports}for(var s="function"==typeof l&&l,t=0;t<a.length;t++)f(a[t]);return f}({1:[function(t,e,n){var r,o,i=e.exports={};function u(){throw new Error("setTimeout has not been defined")}function c(){throw new Error("clearTimeout has not been defined")}function a(e){if(r===setTimeout)return setTimeout(e,0);if((r===u||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:u}catch(t){r=u}try{o="function"==typeof clearTimeout?clearTimeout:c}catch(t){o=c}}();var f,s=[],l=!1,d=-1;function m(){l&&f&&(l=!1,f.length?s=f.concat(s):d=-1,s.length&&p())}function p(){if(!l){var t=a(m);l=!0;for(var e=s.length;e;){for(f=s,s=[];++d<e;)f&&f[d].run();d=-1,e=s.length}f=null,l=!1,function(e){if(o===clearTimeout)return clearTimeout(e);if((o===c||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(e);try{o(e)}catch(t){try{return o.call(null,e)}catch(t){return o.call(this,e)}}}(t)}}function h(t,e){this.fun=t,this.array=e}function v(){}i.nextTick=function(t){var e=new Array(arguments.length-1);if(1<arguments.length)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];s.push(new h(t,e)),1!==s.length||l||a(p)},h.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=v,i.addListener=v,i.once=v,i.off=v,i.removeListener=v,i.removeAllListeners=v,i.emit=v,i.prependListener=v,i.prependOnceListener=v,i.listeners=function(t){return[]},i.binding=function(t){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(t){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},{}],2:[function(t,l,e){(function(e){function r(){}function i(t){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],s(t,this)}function o(n,r){for(;3===n._state;)n=n._value;0!==n._state?(n._handled=!0,i._immediateFn(function(){var t=1===n._state?r.onFulfilled:r.onRejected;if(null!==t){var e;try{e=t(n._value)}catch(t){return void c(r.promise,t)}u(r.promise,e)}else(1===n._state?u:c)(r.promise,n._value)})):n._deferreds.push(r)}function u(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof i)return e._state=3,e._value=t,void a(e);if("function"==typeof n)return void s((r=n,o=t,function(){r.apply(o,arguments)}),e)}e._state=1,e._value=t,a(e)}catch(t){c(e,t)}var r,o}function c(t,e){t._state=2,t._value=e,a(t)}function a(t){2===t._state&&0===t._deferreds.length&&i._immediateFn(function(){t._handled||i._unhandledRejectionFn(t._value)});for(var e=0,n=t._deferreds.length;e<n;e++)o(t,t._deferreds[e]);t._deferreds=null}function f(t,e,n){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof e?e:null,this.promise=n}function s(t,e){var n=!1;try{t(function(t){n||(n=!0,u(e,t))},function(t){n||(n=!0,c(e,t))})}catch(t){if(n)return;n=!0,c(e,t)}}var t,n;t=this,n=setTimeout,i.prototype.catch=function(t){return this.then(null,t)},i.prototype.then=function(t,e){var n=new this.constructor(r);return o(this,new f(t,e,n)),n},i.all=function(t){var c=Array.prototype.slice.call(t);return new i(function(r,o){if(0===c.length)return r([]);var i=c.length;function u(e,t){try{if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if("function"==typeof n)return void n.call(t,function(t){u(e,t)},o)}c[e]=t,0==--i&&r(c)}catch(t){o(t)}}for(var t=0;t<c.length;t++)u(t,c[t])})},i.resolve=function(e){return e&&"object"==typeof e&&e.constructor===i?e:new i(function(t){t(e)})},i.reject=function(n){return new i(function(t,e){e(n)})},i.race=function(o){return new i(function(t,e){for(var n=0,r=o.length;n<r;n++)o[n].then(t,e)})},i._immediateFn="function"==typeof e?function(t){e(t)}:function(t){n(t,0)},i._unhandledRejectionFn=function(t){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",t)},i._setImmediateFn=function(t){i._immediateFn=t},i._setUnhandledRejectionFn=function(t){i._unhandledRejectionFn=t},void 0!==l&&l.exports?l.exports=i:t.Promise||(t.Promise=i)}).call(this,t("timers").setImmediate)},{timers:3}],3:[function(a,t,f){(function(t,e){var r=a("process/browser.js").nextTick,n=Function.prototype.apply,o=Array.prototype.slice,i={},u=0;function c(t,e){this._id=t,this._clearFn=e}f.setTimeout=function(){return new c(n.call(setTimeout,window,arguments),clearTimeout)},f.setInterval=function(){return new c(n.call(setInterval,window,arguments),clearInterval)},f.clearTimeout=f.clearInterval=function(t){t.close()},c.prototype.unref=c.prototype.ref=function(){},c.prototype.close=function(){this._clearFn.call(window,this._id)},f.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e},f.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1},f._unrefActive=f.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;0<=e&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout()},e))},f.setImmediate="function"==typeof t?t:function(t){var e=u++,n=!(arguments.length<2)&&o.call(arguments,1);return i[e]=!0,r(function(){i[e]&&(n?t.apply(null,n):t.call(null),f.clearImmediate(e))}),e},f.clearImmediate="function"==typeof e?e:function(t){delete i[t]}}).call(this,a("timers").setImmediate,a("timers").clearImmediate)},{"process/browser.js":1,timers:3}],4:[function(t,e,n){var r=t("promise-polyfill"),o="undefined"!=typeof window?window:Function("return this;")();e.exports={boltExport:o.Promise||r}},{"promise-polyfill":2}]},{},[4])(4)});function v(){return g}var y=h.exports.boltExport,g={fold:function(t,e){return t()},is:d,isSome:d,isNone:m,getOr:b,getOrThunk:_,getOrDie:function(t){throw new Error(t||"error: getOrDie called on none.")},getOrNull:s(null),getOrUndefined:s(void 0),or:b,orThunk:_,map:v,each:t,bind:v,exists:d,forall:m,filter:v,equals:w,equals_:w,toArray:function(){return[]},toString:s("none()")};function w(t){return t.isNone()}function _(t){return t()}function b(t){return t}function T(e){return function(t){return typeof t===e}}function x(t,e){return n=t,r=e,-1<z.call(n,r);var n,r}function j(t,e){for(var n=t.length,r=new Array(n),o=0;o<n;o++){var i=t[o];r[o]=e(i,o)}return r}function P(t,e){for(var n=0,r=t.length;n<r;n++){e(t[n],n)}}function I(t,e){return function(t,e,n){for(var r=0,o=t.length;r<o;r++){var i=t[r];if(e(i,r))return q.some(i);if(n(i,r))break}return q.none()}(t,e,d)}function O(t){var e=t.getParam("export_formats","clientpdf","string").split(/[\s,]+/);return j(e,function(t){var e=t.split("=");return{name:e[0],text:function(t){switch(t){case"clientpdf":return"PDF";default:return""===(e=t)?"":e.charAt(0).toUpperCase()+e.substring(1)}var e}(e[1]||e[0])}})}function E(t){var e=t.getContent();return function(t,e,n){if(n.length<=0)return e;var r=new K({},t.schema);r.addNodeFilter(n.join(","),function(t){P(t,function(t){return t.remove()})});var o=r.parse(e,{forced_root_block:!1,isRootContent:!0});return new J({validate:!0},t.schema).serialize(o)}(t,e,t.getParam("export_ignore_elements",[],"string[]"))}function F(e){var n=e.dom.encode,r=e.getParam("content_css_cors",!1,"boolean")?'crossorigin="anonymous"':"",t=q.from(e.getParam("content_style","","string")).map(function(t){return'<style type="text/css">'+t+"</style>"});return j(e.contentCSS,function(t){return'<link type="text/css" rel="stylesheet" href="'+n(e.documentBaseURI.toAbsolute(t))+'" '+r+">"}).concat(t.toArray()).join("\n")}function R(t,e){for(var n=G(t),r=0,o=n.length;r<o;r++){var i=n[r];e(t[i],i)}}function k(t,e){var n=t.dom;R(e,function(t,e){!function(t,e,n){if(!(M(n)||B(n)||V(n)))throw console.error("Invalid call to Attribute.set. Key ",e,":: Value ",n,":: Element ",t),new Error("Attribute value was not simple");t.setAttribute(e,n+"")}(n,e,t)})}function A(t,e,n){if(!M(n))throw console.error("Invalid call to CSS.set. Property ",e,":: Value ",n,":: Element ",t),new Error("CSS value must be a string: "+n);var r;void 0!==(r=t).style&&H(r.style.getPropertyValue)&&t.style.setProperty(e,n)}function S(t,e){if(navigator.msSaveBlob)navigator.msSaveBlob(e,t);else{var n=URL.createObjectURL(e),r=Y.fromTag("a");k(r,{download:t,href:n}),c="display",a="none",f=r.dom,A(f,c,a),i=Z(Y.fromDom(document)),u=r,i.dom.appendChild(u.dom),r.dom.click(),null!==(o=r.dom).parentNode&&o.parentNode.removeChild(o),URL.revokeObjectURL(n)}var o,i,u,c,a,f}var U,C,N,L,D=function(n){function t(){return o}function e(t){return t(n)}var r=s(n),o={fold:function(t,e){return e(n)},is:function(t){return n===t},isSome:m,isNone:d,getOr:r,getOrThunk:r,getOrDie:r,getOrNull:r,getOrUndefined:r,or:t,orThunk:t,map:function(t){return D(t(n))},each:function(t){t(n)},bind:e,exists:e,forall:e,filter:function(t){return t(n)?o:g},toArray:function(){return[n]},toString:function(){return"some("+n+")"},equals:function(t){return t.is(n)},equals_:function(t,e){return t.fold(d,function(t){return e(n,t)})}};return o},q={some:D,none:v,from:function(t){return null==t?g:D(t)}},M=(U="string",function(t){return n=typeof(e=t),(null===e?"null":"object"==n&&(Array.prototype.isPrototypeOf(e)||e.constructor&&"Array"===e.constructor.name)?"array":"object"==n&&(String.prototype.isPrototypeOf(e)||e.constructor&&"String"===e.constructor.name)?"string":n)===U;var e,n}),B=T("boolean"),H=T("function"),V=T("number"),z=Array.prototype.indexOf,K=tinymce.html.DomParser,J=tinymce.html.Serializer,G=Object.keys,W=Object.hasOwnProperty,X=function(t,e){return W.call(t,e)},Q=("undefined"!=typeof window||Function("return this;")(),function(t){if(null==t)throw new Error("Node cannot be null or undefined");return{dom:t}}),Y={fromHtml:function(t,e){var n=(e||document).createElement("div");if(n.innerHTML=t,!n.hasChildNodes()||1<n.childNodes.length)throw console.error("HTML does not have a single root node",t),new Error("HTML must have a single root node");return Q(n.childNodes[0])},fromTag:function(t,e){var n=(e||document).createElement(t);return Q(n)},fromText:function(t,e){var n=(e||document).createTextNode(t);return Q(n)},fromDom:Q,fromPoint:function(t,e,n){return q.from(t.dom.elementFromPoint(e,n)).map(Q)}},Z=function(t){var e=t.dom.body;if(null==e)throw new Error("Body is not available yet");return Y.fromDom(e)},$=window.Promise?window.Promise:(C=window,N=tt.immediateFn||"function"==typeof C.setImmediate&&C.setImmediate||function(t){setTimeout(t,1)},L=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)},tt.prototype.catch=function(t){return this.then(null,t)},tt.prototype.then=function(n,r){var o=this;return new tt(function(t,e){nt.call(o,new ut(n,r,t,e))})},tt.all=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var c=Array.prototype.slice.call(1===t.length&&L(t[0])?t[0]:t);return new tt(function(r,o){if(0===c.length)return r([]);var i=c.length;function u(e,t){try{if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if("function"==typeof n)return void n.call(t,function(t){u(e,t)},o)}c[e]=t,0==--i&&r(c)}catch(t){o(t)}}for(var t=0;t<c.length;t++)u(t,c[t])})},tt.resolve=function(e){return e&&"object"==typeof e&&e.constructor===tt?e:new tt(function(t){t(e)})},tt.reject=function(n){return new tt(function(t,e){e(n)})},tt.race=function(o){return new tt(function(t,e){for(var n=0,r=o;n<r.length;n++)r[n].then(t,e)})},tt);function tt(t){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");this._state=null,this._value=null,this._deferreds=[],ct(t,et(rt,this),et(ot,this))}function et(t,e){return function(){return t.apply(e,arguments)}}function nt(n){var r=this;null!==this._state?N(function(){var t=r._state?n.onFulfilled:n.onRejected;if(null!==t){var e;try{e=t(r._value)}catch(t){return void n.reject(t)}n.resolve(e)}else(r._state?n.resolve:n.reject)(r._value)}):this._deferreds.push(n)}function rt(t){try{if(t===this)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var e=t.then;if("function"==typeof e)return void ct(et(e,t),et(rt,this),et(ot,this))}this._state=!0,this._value=t,it.call(this)}catch(t){ot.call(this,t)}}function ot(t){this._state=!1,this._value=t,it.call(this)}function it(){for(var t=0,e=this._deferreds;t<e.length;t++){var n=e[t];nt.call(this,n)}this._deferreds=[]}function ut(t,e,n,r){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof e?e:null,this.resolve=n,this.reject=r}function ct(t,e,n){var r=!1;try{t(function(t){r||(r=!0,e(t))},function(t){r||(r=!0,n(t))})}catch(t){if(r)return;r=!0,n(t)}}function at(e,r,o){return void 0===o&&(o=!1),new $(function(t){var n=new XMLHttpRequest;n.onreadystatechange=function(){4===n.readyState&&t({status:n.status,blob:n.response})},n.open("GET",e,!0),n.withCredentials=o,R(r,function(t,e){n.setRequestHeader(e,t)}),n.responseType="blob",n.send()})}function ft(t,e){var n,r,o=(n=function(t,e){return null!=t?t[e]:void 0},r=t,P(e,function(t){r=n(r,t)}),r);return q.from(o)}function st(t){var e,n=(e=t,"ImageProxy HTTP error: "+I(jt,function(t){return e===t.code}).fold(s("Unknown ImageProxy error"),function(t){return t.message}));return $.reject(n)}function lt(e){return I(Pt,function(t){return t.type===e}).fold(s("Unknown service error"),function(t){return t.message})}function dt(t){return"ImageProxy Service error: "+function(t){try{return q.some(JSON.parse(t))}catch(t){return q.none()}}(t).bind(function(t){return ft(t,["error","type"]).map(lt)}).getOr("Invalid JSON in service error message")}function mt(t){return r=t,new $(function(t,e){var n=new FileReader;n.onload=function(){t(n.result)},n.onerror=function(t){e(t)},n.readAsText(r)}).then(function(t){var e=dt(t);return $.reject(e)});var r}function pt(t){return t<200||300<=t}function ht(t,e){var n,r,o,i={"Content-Type":"application/json;charset=UTF-8","tiny-api-key":e};return at((r=e,o=-1===(n=t).indexOf("?")?"?":"&",/[?&]apiKey=/.test(n)?n:n+o+"apiKey="+encodeURIComponent(r)),i).then(function(t){return pt(t.status)?(e=t.status,n=t.blob,r=e,"application/json"!==(null==(o=n)?void 0:o.type)||400!==r&&403!==r&&404!==r&&500!==r?st(e):mt(n)):$.resolve(t.blob);var e,n,r,o})}function vt(t,e,n){return void 0===n&&(n=!1),e?ht(t,e):at(t,{},n).then(function(t){return pt(t.status)?st(t.status):$.resolve(t.blob)})}function yt(n,r){function o(){q.from(i.shift()).fold(function(){return n+=1},function(t){return setTimeout(t,0)})}var i=[];return function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return(0===n?new y(function(t){return i.push(t)}):(--n,y.resolve())).then(function(){return r.apply(void 0,t)}).then(function(t){return o(),t},function(t){return o(),y.reject(t)})}}function gt(t,e){return x((n=t,q.from(n.getParam("export_cors_hosts",void 0,"string[]")).getOrThunk(function(){return n.getParam("imagetools_cors_hosts",[],"string[]")})),new It(e).host);var n}function wt(n){return new y(function(t){var e=new FileReader;e.onload=function(){t(e.result)},e.readAsDataURL(n)})}function _t(a,u){return q.from((t=a,q.from(t.getParam("export_image_proxy",void 0,"string")).getOrThunk(function(){return t.getParam("imagetools_proxy",void 0,"string")}))).map(function(r){var t,o=(t=a,q.from(t.getParam("api_key",void 0,"string")).getOrThunk(function(){return t.getParam("export_api_key","","string")})),c={},e=new Ot({},a.schema);e.addNodeFilter("img",function(t){P(t,function(e){var t,n,r,o,i=e.attr("src"),u=a.documentBaseURI.toAbsolute(i);r=a,0===(o=u).indexOf("data:")||0===o.indexOf("blob:")||new It(o).host===r.documentBaseURI.host||gt(a,u)||(X(t=c,n=i)?q.from(t[n]):q.none()).fold(function(){return c[u]=[e]},function(t){return c[i]=t.concat(e)})})});var n=e.parse(u,{forced_root_block:!1,isRootContent:!0}),i=yt(a.getParam("export_image_proxy_max_in_flight",5,"number"),function(t){return vt((n=t,(e=r)+(-1===e.indexOf("?")?"?":"&")+"url="+encodeURIComponent(n)),o,!1).then(wt);var e,n});return y.all(j(G(c),function(e){return i(e).then(function(t){return{orig:e,base64:t}})})).then(function(t){return P(t,function(e){P(c[e.orig],function(t){t.attr("src",e.base64)})}),new Et({validate:!0},a.schema).serialize(n)})}).getOrThunk(function(){return y.resolve(u)});var t}function bt(n,t,e){var r=t+"/exporters/"+e+n.suffix+".js";return tinymce.Resource.load("export.exporter."+e,r).then(function(t){return t(n,{downloadAs:S,getContent:u(E,e=n),utils:{getStyles:u(F,e),proxyImages:u(_t,e)}});var e}).catch(function(t){return console.error(t),y.reject(n.translate(['Failed to load the "{0}" exporter',e]))})}function Tt(e,t,n,r){function o(){return e.setProgressState(!1)}return e.setProgressState(!0),bt(e,t,n).then(function(t){return r(t).then(t.download)}).then(o,function(t){o(),e.notificationManager.open({type:"error",text:t})})}function xt(t,e){var n,r,o,i,u,c,a;if(!f(tinymce,"5.5.0"))return r=e,o=j(O(n=t),function(t){return{type:"menuitem",text:t.text,onAction:function(){Tt(n,r,t.name,function(){return y.resolve({})})}}}),n.ui.registry.addMenuButton("export",{icon:"export",tooltip:"Export",fetch:function(t){return t(o)}}),n.ui.registry.addNestedMenuItem("export",{text:"Export",icon:"export",getSubmenuItems:s(o)}),u=e,(i=t).addCommand("mceExportDownload",function(t,e){var n=q.from(e.settings).getOr({});Tt(i,u,e.format,function(){return y.resolve(n)})}),c=t,a=e,{convert:function(t,e){return bt(c,a,t).then(function(t){return t.convert(e)})},download:function(t,e){bt(c,a,t).then(function(t){t.download(e)})}};console.error('The "export" plugin requires at least version 5.5.0 of TinyMCE.')}var jt=[{code:404,message:"Could not find Image Proxy"},{code:403,message:"Rejected request"},{code:0,message:"Incorrect Image Proxy URL"}],Pt=[{type:"not_found",message:"Failed to load image."},{type:"key_missing",message:"The request did not include an api key."},{type:"key_not_found",message:"The provided api key could not be found."},{type:"domain_not_trusted",message:"The api key is not valid for the request origins."}],It=tinymce.util.URI,Ot=tinymce.html.DomParser,Et=tinymce.html.Serializer;tinymce.PluginManager.add("export",xt)}();