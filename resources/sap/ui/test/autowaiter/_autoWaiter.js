/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/base/Object","sap/ui/test/_OpaLogger","sap/ui/test/autowaiter/_XHRWaiter","sap/ui/test/autowaiter/_timeoutWaiter","sap/ui/test/autowaiter/_promiseWaiter","sap/ui/test/autowaiter/_navigationContainerWaiter","sap/ui/test/autowaiter/_UIUpdatesWaiter","sap/ui/test/autowaiter/_moduleWaiter"],function(q,U,_,a,b,c,d,e,f){"use strict";var w=[];var l=_.getLogger("sap.ui.test.autowaiter._autoWaiter");var A=U.extend("sap.ui.test.autowaiter._autoWaiter",{registerWaiter:function(n,W){return new Promise(function(r,R){if(typeof W==="string"){sap.ui.require([W],this._addWaiter(n,r,R),function(g){R("Failed to load waiter "+n+": "+g);});}else if(typeof W==="object"){this._addWaiter(n,r,R)(W);}}.bind(this));},hasToWait:function(){var r=false;w.forEach(function(W){if(!r&&W.waiter.isEnabled()&&W.waiter.hasPending()){r=true;}});if(!r){l.timestamp("opa.autoWaiter.syncPoint");l.debug("AutoWaiter syncpoint");}return r;},extendConfig:function(C){if(!q.isEmptyObject(C)){w.forEach(function(W){if(W.waiter.extendConfig){W.waiter.extendConfig(C[W.name]);}});}},getWaiters:function(){return w.slice();},_addWaiter:function(n,s,E){s=s||function(){};E=E||function(){};return function(W){if(typeof W.hasPending!=="function"){E("Waiter "+n+" should have a hasPending method");}else if(typeof W.isEnabled!=="function"){E("Waiter "+n+" should have an isEnabled method");}else{var g;w.forEach(function(m){if(m.name===n){l.debug("Waiter with name "+n+" will be overridden!");g=true;m.waiter=W;}});if(!g){w.push({name:n,waiter:W});}s(W);}};}});var o=new A();var D={xhrWaiter:a,timeoutWaiter:b,promiseWaiter:c,navigationWaiter:d,uiUpdatesWaiter:e,moduleWaiter:f};Object.keys(D).forEach(function(W){return o._addWaiter(W)(D[W]);});return o;},true);
