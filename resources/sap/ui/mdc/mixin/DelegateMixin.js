/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/util/loadModules","sap/base/Log"],function(l,L){"use strict";var _=function(c){if(!c||!c.name){throw new Error("Delegate configuration '"+(c&&JSON.stringify(c))+"' invalid");}};var a=function(r){if(!this.bIsDestroyed){if(r instanceof Error){this.fnRejectDelegate(r);}else{this._oDelegate=r[0];this.fnResolveDelegate(this._oDelegate);this.bDelegateInitialized=true;}}this.bDelegateLoading=false;delete this.fnResolveDelegate;delete this.fnRejectDelegate;};var D={};D.init=function(I){return function(){this.bDelegateInitialized=false;this.bDelegateLoading=false;this._oDelegateInitialized=new Promise(function(r,c){this.fnResolveDelegate=r;this.fnRejectDelegate=c;}.bind(this));this._oPropertyHelper=null;this._bPropertyHelperIsBeingInitialized=false;this._pInitPropertyHelper=new Promise(function(r,c){this._fnResolveInitPropertyHelper=r;this._fnRejectInitPropertyHelper=c;}.bind(this));if(I){I.apply(this,arguments);}};};D.applySettings=function(A){return function(s){A.apply(this,arguments);this._bDelegateLocked=true;return this;};};D.setDelegate=function(s){return function(c){if(this._bDelegateLocked){throw new Error("Runtime delegate configuration is not permitted.");}_(c);s.call(this,c);this._oPayload=c&&c.payload;return this;};};D.initControlDelegate=function(p){if(this.bIsDestroyed){L.warning("Delegate module initialization omitted as control is being destroyed.");}else if(!this._oDelegate&&!this.bDelegateLoading){if(p){a.call(this,[p]);}else{var d=this.getDelegate();_(d);this.bDelegateLoading=true;l(d.name).then(a.bind(this)).catch(a.bind(this));}}else{L.warning("Delegate module already initialized.");}return this._oDelegateInitialized;};D.getPayload=function(){if(!this._oPayload){var d=this.getDelegate();this._oPayload=d&&d.payload;}return this._oPayload;};D.getTypeUtil=function(){if(!this._oTypeUtil){if(!this._oDelegate){throw new Error("A delegate instance providing typeUtil is not (yet) available.");}this._oTypeUtil=this._oDelegate.getTypeUtil&&this._oDelegate.getTypeUtil(this._oPayload);}return this._oTypeUtil;};D.getControlDelegate=function(){if(!this._oDelegate){throw new Error("A delegate instance is not (yet) available. You must call initControlDelegate before calling getControlDelegate.");}return this._oDelegate;};D.awaitControlDelegate=function(){return this._oDelegateInitialized;};D.initPropertyHelper=function(C){if(C&&(!C.getMetadata||!C.getMetadata().isA("sap.ui.mdc.util.PropertyHelper"))){throw new Error("The custom property helper class must be sap.ui.mdc.util.PropertyHelper or a subclass of it.");}if(!this.bIsDestroyed&&!this._oPropertyHelper&&!this._bPropertyHelperIsBeingInitialized){this._bPropertyHelperIsBeingInitialized=true;this.awaitControlDelegate().then(function(d){if(this.bIsDestroyed){return;}if(typeof d.initPropertyHelper==="function"){return i(this,d,C);}return b(this,d,C);}.bind(this)).catch(function(e){this._fnRejectInitPropertyHelper(e);}.bind(this));}return this._pInitPropertyHelper;};function i(c,d,C){return d.initPropertyHelper(c).then(function(p){if(c.bIsDestroyed){return;}if(C){if(!(p instanceof C)){throw new Error("The property helper must be an instance of "+C.getMetadata().getName()+".");}}else if(!p||!p.isA||!p.isA("sap.ui.mdc.util.PropertyHelper")){throw new Error("The property helper must be an instance of sap.ui.mdc.util.PropertyHelper.");}f(c,p);});}function b(c,d,C){return Promise.all([C||l("sap/ui/mdc/util/PropertyHelper"),d.fetchProperties(c)]).then(function(r){if(c.bIsDestroyed){return;}var P=r[0][0]?r[0][0]:r[0];var p=r[1];f(c,new P(p,c));});}function f(c,p){c._oPropertyHelper=p;c._bPropertyHelperIsBeingInitialized=false;c._fnResolveInitPropertyHelper(p);}D.awaitPropertyHelper=function(){return this._pInitPropertyHelper;};D.getPropertyHelper=function(){if(!this._oPropertyHelper){throw new Error("A property helper is not (yet) available. You must first initialize the delegate and the property helper.");}return this._oPropertyHelper;};D.exit=function(e){return function(){this.fnResolveDelegate=null;this.fnRejectDelegate=null;this.bDelegateInitialized=false;this.bDelegateLoading=false;this._oDelegateInitialized=null;this._oDelegate=null;this._oPayload=null;this._oTypeUtil=null;if(this._oPropertyHelper){this._oPropertyHelper.destroy();}this._oPropertyHelper=null;this._fnResolveInitPropertyHelper=null;this._fnRejectInitPropertyHelper=null;this._bPropertyHelperIsBeingInitialized=false;this._pInitPropertyHelper=null;if(e){e.apply(this,arguments);}};};return function(){this.applySettings=D.applySettings(this.applySettings);this.exit=D.exit(this.exit);this.init=D.init(this.init);this.setDelegate=D.setDelegate(this.setDelegate);this.awaitControlDelegate=D.awaitControlDelegate;this.getControlDelegate=D.getControlDelegate;this.getPayload=D.getPayload;this.getTypeUtil=D.getTypeUtil;this.initControlDelegate=D.initControlDelegate;this.initPropertyHelper=D.initPropertyHelper;this.awaitPropertyHelper=D.awaitPropertyHelper;this.getPropertyHelper=D.getPropertyHelper;};},true);