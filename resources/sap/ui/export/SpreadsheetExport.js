/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global','sap/base/Log','sap/ui/Device'],function(q,L,D){'use strict';var a='sap/ui/export/provider/DataProviderBase',b='sap/ui/export/js/XLSXBuilder',c='sap/ui/export/js/libs/JSZip3';function d(p,C){function f(m){if(m instanceof MessageEvent&&m.data){m=m.data;}return C&&C(m);}function o(F,t){f({progress:true,fetched:F||0,total:t||0});}function g(e){f({error:e.message||e});}function h(A){f({finished:true,spreadsheet:A});}function i(){var s;var e;function l(m,X){e=m.getDataConverter(p);s=new X(p.workbook.columns,p.workbook.context,p.workbook.hierarchyLevel,p.customconfig);var r=p.dataSource.data||[];var t=r.length;var R=e(r.slice());s.append(R);o(t,t);s.build().then(h);}sap.ui.require([a,b,c],l);return{cancel:h};}function n(u){if(!u){return u;}try{return new URL(u,document.baseURI).toString();}catch(e){return window.URI(u).absoluteTo(document.baseURI).toString();}}function j(){var s,r;function e(t,X){var u=new t(p);s=new X(p.workbook.columns,p.workbook.context,p.workbook.hierarchyLevel,p.customconfig);r=u.requestData(l);}function l(M){if(M.error||typeof M.error==='string'){return g(M.error);}s.append(M.rows);o(M.fetched,M.total);M.finished&&s.build().then(h);}function m(){r.cancel();h();}sap.ui.require([a,b,c],e);return{cancel:m};}function k(){var s;var l=q.extend(true,{},p);var w=typeof l.worker==='object'?l.worker:{};var m=function(){s.postMessage({cancel:true});h();};function r(e){var y=new Worker(e);y.onmessage=f;if(navigator.userAgent.indexOf("Firefox")===-1||t(e)){y.onerror=g;}y.postMessage(l);return y;}function t(e){return e.indexOf(window.location.host)>0||/^[^/]+\/[^/].*$|^\/[^/].*$/i.test(e);}function u(){L.warning('Direct worker is not allowed. Load the worker via blob.');var e=window.URI(w.base).absoluteTo("").search("").hash("").toString();w.src=e+w.ref;var y='self.origin = "'+e+'"; '+'importScripts("'+w.src+'")';var z=new Blob([y]);var A=window.URL.createObjectURL(z);return r(A);}function v(){L.warning('Blob worker is not allowed. Use in-process export.');m=j(l).cancel;}function x(){try{s=r(w.src);s.addEventListener('error',function(e){s=u();s.addEventListener('error',function(e){v();e.preventDefault();});e.preventDefault();});}catch(y){try{s=u();}catch(z){v();}}}l.dataSource.dataUrl=n(l.dataSource.dataUrl);l.dataSource.serviceUrl=n(l.dataSource.serviceUrl);w.base=w.base||sap.ui.require.toUrl('sap/ui/export/js/','');w.ref=w.ref||'SpreadsheetWorker.js';w.src=w.base+w.ref;x();return{cancel:function(){m();}};}if(p.dataSource.type==='array'){return i();}else if(p.worker===false||sap.ui.disableExportWorkers===true||(D.browser.msie&&p.dataSource.dataUrl.indexOf('.')===0)){return j();}else{return k();}}return{execute:d};},true);
