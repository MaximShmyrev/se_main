/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/DataType","sap/base/Log"],function(D,L){"use strict";var H=new window.WeakMap();var M={};var k={};var h={};var f=["function"];var a={};var m={Table:{BindRows:{arguments:[{type:"object"}]},RowsBound:{arguments:[{type:"class:sap.ui.model.Binding"}]},UnbindRows:{arguments:[{type:"object"}]},RowsUnbound:{arguments:[]},RefreshRows:{arguments:[{type:j}]},UpdateRows:{arguments:[{type:j}]},UpdateSizes:{arguments:[{type:j}]},OpenMenu:{arguments:[{type:l},{type:"class:sap.ui.unified.Menu"}]}},Row:{UpdateState:{arguments:[{type:n}]},Expand:{arguments:[{type:"class:sap.ui.table.Row"}]},Collapse:{arguments:[{type:"class:sap.ui.table.Row"}]}},Column:{MenuItemNotification:{arguments:[{type:"class:sap.ui.table.Column"}],returnValue:"boolean"}},Signal:{arguments:[{type:"string"}]}};a.TableUtils=null;a.Keys=k;a.call=function(S,K){var i=H.get(S);if(!c(S)||!b(K)){return undefined;}var m=g(K);if(i==null){if(m.returnValue){return[];}return undefined;}var A=s(Array.prototype.slice.call(arguments,2));var o=v(m,A);if(!o){throw new Error("Hook with key "+K+" was not called. Invalid arguments passed\n"+S);}var r=i.map(function(p){if(p.key===M){var C={};var q=p.handlerContext==null?p.target:p.handlerContext;C[K]=A;return a.TableUtils.dynamicCall(p.target,C,q);}else if(p.key===K){return p.handler.apply(p.handlerContext,A);}});r=d(m,r);return r;};a.install=function(S,t,T){if(!t||!c(S)){return;}var i=H.get(S);if(i==null){i=[];}var o=i.some(function(p){return p.key===M&&p.target===t&&p.handlerContext===T;});if(o){return;}i.push({key:M,target:t,handlerContext:T});H.set(S,i);};a.uninstall=function(S,t,T){var o=H.get(S);if(o==null||!t){return;}for(var i=0;i<o.length;i++){var p=o[i];if(p.key===M&&p.target===t&&p.handlerContext===T){o.splice(i,1);break;}}if(o.length===0){H.delete(S);}else{H.set(S,o);}};a.register=function(S,K,i,t){if(typeof i!=="function"||!c(S)||!b(K)){return;}var o=H.get(S);if(o==null){o=[];}o.push({key:K,handler:i,handlerContext:t});H.set(S,o);};a.deregister=function(S,K,o,t){var p=H.get(S);if(p==null){return;}for(var i=0;i<p.length;i++){var q=p[i];if(q.key===K&&q.handler===o&&q.handlerContext===t){p.splice(i,1);break;}}if(p.length===0){H.delete(S);}else{H.set(S,p);}};function e(K,C,i){Object.keys(C).forEach(function(p){var o=i?i+"."+p:p;if("arguments"in C[p]){f.forEach(function(F){if(C[p].arguments.indexOf(F)>-1||C[p].returnValue===F){throw new Error("Forbidden type found in metadata of hook "+i+": "+F);}});K[p]=o;h[o]=C[p];}else{K[p]={};e(K[p],C[p],o);}});return K;}e(k,m);function b(K){return K in h;}function c(S){return a.TableUtils.isA(S,"sap.ui.table.Table")&&!S.bIsDestroyed&&!S._bIsBeingDestroyed;}function g(K){return h[K];}function s(A){while(A.length>0){var i=A.pop();if(i!=null){A.push(i);break;}}A.map(function(i){if(i===null){return undefined;}else{return i;}});return A;}function v(m,A){return m.arguments.length>=A.length&&A.every(function(V,i){var o=m.arguments[i];if(typeof o.type==="function"){return o.type(V);}if(o.type.startsWith("class:")){return a.TableUtils.isA(V,o.type.substring(6));}return o.optional===true&&V==null||D.getType(o.type).isValid(V);});}function d(m,V){if(!m.returnValue){return undefined;}var t=m.returnValue;return V.filter(function(i){if(i==null){return false;}else if(typeof t==="function"){return t(i);}else if(t==="Promise"){return i instanceof Promise;}else if(t.startsWith("class:")){return a.TableUtils.isA(i,t.substring(6));}else{return D.getType(t).isValid(i);}});}function j(r){return r in a.TableUtils.RowsUpdateReason||D.getType("sap.ui.model.ChangeReason").isValid(r);}function l(C){return C?typeof C.isOfType==="function":false;}function n(r){return r!=null&&r.hasOwnProperty("context")&&r.hasOwnProperty("Type")&&r.hasOwnProperty("type")&&r.type in r.Type;}return a;},true);
