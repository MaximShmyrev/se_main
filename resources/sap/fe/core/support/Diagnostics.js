sap.ui.define([],function(){"use strict";function _(i,C){if(!(i instanceof C)){throw new TypeError("Cannot call a class as a function");}}function a(t,p){for(var i=0;i<p.length;i++){var d=p[i];d.enumerable=d.enumerable||false;d.configurable=true;if("value"in d)d.writable=true;Object.defineProperty(t,d.key,d);}}function b(C,p,s){if(p)a(C.prototype,p);if(s)a(C,s);return C;}var D=function(){function D(){_(this,D);this._issues=[];}b(D,[{key:"addIssue",value:function g(i,c,d,e,s){var f=this.checkIfIssueExists(i,c,d,e,s);if(!f){this._issues.push({category:i,severity:c,details:d,subCategory:s});}}},{key:"getIssues",value:function g(){return this._issues;}},{key:"getIssuesByCategory",value:function g(i,s){if(s){return this._issues.filter(function(c){return c.category===i&&c.subCategory===s;});}else{return this._issues.filter(function(c){return c.category===i;});}}},{key:"checkIfIssueExists",value:function f(i,s,d,c,e){if(c&&c[i]&&e){return this._issues.some(function(g){return g.category===i&&g.severity===s&&g.details.replace(/\n/g,"")===d.replace(/\n/g,"")&&g.subCategory===e;});}return this._issues.some(function(g){return g.category===i&&g.severity===s&&g.details.replace(/\n/g,"")===d.replace(/\n/g,"");});}}]);return D;}();return D;},false);
