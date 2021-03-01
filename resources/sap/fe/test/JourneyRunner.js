sap.ui.define(["sap/ui/base/Object","sap/ui/test/Opa5","./Utils","./BaseArrangements","./BaseActions","./BaseAssertions","sap/ui/test/opaQunit","sap/base/Log"],function(B,O,U,a,b,c,o,L){"use strict";var _=Promise.resolve();var d;var J=B.extend("sap.fe.test.JourneyRunner",{constructor:function(s){B.apply(this);this._mInstanceSettings=U.mergeObjects(s);},run:function(s,j){var i=1;if(!U.isOfType(s,Object)){i=0;s=U.mergeObjects(this._mInstanceSettings);}else{s=U.mergeObjects(this._mInstanceSettings,s);}var e=U.getParametersArray(i,arguments),A=s.async,p;if(A){p=Promise.resolve();}else{p=_;}p=p.then(this._preRunActions.bind(this,s)).then(this._runActions.bind(this,e)).then(this._postRunActions.bind(this,s)).catch(function(E){L.error("JourneyRunner.run failed",E);});if(!A){_=p;}return p;},getBaseActions:function(){return new b();},getBaseAssertions:function(){return new c();},getBaseArrangements:function(s){return new a(s);},_preRunActions:function(s){L.setLevel(1,"sap.ui.test.matchers.Properties");L.setLevel(1,"sap.ui.test.matchers.Ancestor");O.extendConfig(this._getOpaConfig(s));O.createPageObjects(s.pages);},_runActions:function(j){var t=this,p=Promise.resolve(),r,e=new Promise(function(f){r=f;});L.info("JourneyRunner started");QUnit.done(function(){L.info("JourneyRunner ended");r();});j.forEach(function(v){if(U.isOfType(v,String)){p=p.then(function(){return new Promise(function(f,g){sap.ui.require([v],function(h){f(h);});});});}else{p=p.then(function(){return v;});}p=p.then(t._runJourney);});return p.then(function(){return e;});},_runJourney:function(j){if(U.isOfType(j,Function)){j.call();}},_postRunActions:function(){O.resetConfig();},_getOpaConfig:function(s){var C=Object.assign({viewNamespace:"sap.fe.templates",autoWait:true,timeout:60,logLevel:"ERROR",disableHistoryOverride:true,asyncPolling:true},s.opaConfig);if(!C.actions){C.actions=this.getBaseActions();}if(!C.assertions){C.assertions=this.getBaseAssertions();}if(!C.arrangements){C.arrangements=this.getBaseArrangements(s);}return C;}});J.getDefaultRunner=function(){if(!d){d=new J();}return d;};J.setDefaultRunner=function(D){d=D;};J.run=function(){var r=J.getDefaultRunner();r.run.apply(r,arguments);};return J;});