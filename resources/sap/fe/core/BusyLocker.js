/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/Log"],function(L){"use strict";var _=30,a={},b={getId:function(){return"BusyLocker.ReferenceDummy";},setBusy:function(B){L.info("setBusy("+B+") triggered on dummy reference");}};function g(r,p){return r.getId()+(p||"/busy");}function i(r,p){return g(r,p)in a;}function c(r,p){if(!r||!r.getId){L.warning("No reference for BusyLocker, using dummy reference");r=b;}var p=p||"/busy",I=g(r,p);if(!(I in a)){a[I]={id:I,path:p,reference:r,count:0};}return a[I];}function d(l){delete a[l.id];}function e(l){var I=l.reference.isA&&l.reference.isA("sap.ui.model.Model"),B=l.count!==0;if(I){l.reference.setProperty(l.path,B);}else if(l.reference.setBusy){l.reference.setBusy(B);}clearTimeout(l.timeout);if(B){l.timeout=setTimeout(function(){L.error("busy lock for "+l.id+" with value "+l.count+" timed out after "+_+" seconds!");},_*1000);}else{d(l);}return B;}function f(l,D){if(D===0){l.count=0;L.info("busy lock count '"+l.id+"' was reset to 0");}else{l.count+=D;L.info("busy lock count '"+l.id+"' is "+l.count);}}return{lock:function(m,p){return this._updateLock(m,p,1);},unlock:function(m,p){return this._updateLock(m,p,-1);},isLocked:function(m,p){return i(m,p);},_updateLock:function(r,p,D){var l=c(r,p);f(l,D);return e(l);}};});
