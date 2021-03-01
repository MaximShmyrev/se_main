sap.ui.define(["sap/ui/core/service/ServiceFactory","sap/ui/core/service/Service","../converters/MetaModelConverter"],function(S,a,M){"use strict";var D=M.DefaultEnvironmentCapabilities;function _(e,i){return g(e)||f(e,i)||c(e,i)||b();}function b(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function c(o,e){if(!o)return;if(typeof o==="string")return d(o,e);var n=Object.prototype.toString.call(o).slice(8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return Array.from(n);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return d(o,e);}function d(e,n){if(n==null||n>e.length)n=e.length;for(var i=0,o=new Array(n);i<n;i++){o[i]=e[i];}return o;}function f(e,i){if(typeof Symbol==="undefined"||!(Symbol.iterator in Object(e)))return;var n=[];var o=true;var p=false;var w=undefined;try{for(var x=e[Symbol.iterator](),y;!(o=(y=x.next()).done);o=true){n.push(y.value);if(i&&n.length===i)break;}}catch(z){p=true;w=z;}finally{try{if(!o&&x["return"]!=null)x["return"]();}finally{if(p)throw w;}}return n;}function g(e){if(Array.isArray(e))return e;}function h(i,C){if(!(i instanceof C)){throw new TypeError("Cannot call a class as a function");}}function j(e,p){for(var i=0;i<p.length;i++){var n=p[i];n.enumerable=n.enumerable||false;n.configurable=true;if("value"in n)n.writable=true;Object.defineProperty(e,n.key,n);}}function k(C,p,e){if(p)j(C.prototype,p);if(e)j(C,e);return C;}function l(e,i){if(typeof i!=="function"&&i!==null){throw new TypeError("Super expression must either be null or a function");}e.prototype=Object.create(i&&i.prototype,{constructor:{value:e,writable:true,configurable:true}});if(i)m(e,i);}function m(o,p){m=Object.setPrototypeOf||function m(o,p){o.__proto__=p;return o;};return m(o,p);}function q(e){return function(){var i=u(e),n;if(t()){var N=u(this).constructor;n=Reflect.construct(i,arguments,N);}else{n=i.apply(this,arguments);}return r(this,n);};}function r(e,i){if(i&&(typeof i==="object"||typeof i==="function")){return i;}return s(e);}function s(e){if(e===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return e;}function t(){if(typeof Reflect==="undefined"||!Reflect.construct)return false;if(Reflect.construct.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(Reflect.construct(Date,[],function(){}));return true;}catch(e){return false;}}function u(o){u=Object.setPrototypeOf?Object.getPrototypeOf:function u(o){return o.__proto__||Object.getPrototypeOf(o);};return u(o);}var E=function(i){l(E,i);var n=q(E);function E(){h(this,E);return n.apply(this,arguments);}k(E,[{key:"init",value:function o(){var e=this;this.initPromise=new Promise(function(p,w){e.resolveFn=p;e.rejectFn=w;});var C=this.getContext();this.environmentCapabilities=Object.assign({},D);Promise.all([this.resolveLibrary("sap.chart"),this.resolveLibrary("sap.suite.ui.microchart")]).then(function(p){var w=_(p,2),x=w[0],y=w[1];e.environmentCapabilities.Chart=x;e.environmentCapabilities.MicroChart=y;e.environmentCapabilities.UShell=!!(sap&&sap.ushell&&sap.ushell.Container);e.environmentCapabilities.IntentBasedNavigation=!!(sap&&sap.ushell&&sap.ushell.Container);e.environmentCapabilities=Object.assign(e.environmentCapabilities,C.settings);e.resolveFn(e);}).catch(this.rejectFn);}},{key:"resolveLibrary",value:function p(o){return new Promise(function(w){try{sap.ui.require(["".concat(o.replace(/\./g,"/"),"/library")],function(){w(true);},function(){w(false);});}catch(e){w(false);}});}},{key:"setCapabilities",value:function e(C){this.environmentCapabilities=C;}},{key:"getCapabilities",value:function e(){return this.environmentCapabilities;}},{key:"getInterface",value:function e(){return this;}}]);return E;}(a);var v=function(e){l(v,e);var i=q(v);function v(){h(this,v);return i.apply(this,arguments);}k(v,[{key:"createInstance",value:function p(o){var n=new E(o);return n.initPromise;}}]);return v;}(S);return v;},false);