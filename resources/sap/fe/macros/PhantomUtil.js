/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/model/json/JSONModel","sap/base/Log","sap/ui/base/ManagedObject","sap/fe/macros/ResourceModel","sap/ui/core/util/XMLPreprocessor","sap/ui/base/SyncPromise","./TraceInfo","sap/base/util/ObjectPath"],function(J,L,M,R,X,S,T,O){"use strict";var p="sap.fe.macros.PhantomUtil",I=R.getModel();I.bindContext=I.bindContext||function(){return{initialize:function(){},attachChange:function(){},detachChange:function(){},attachEvents:function(){},detachEvents:function(){},updateRequired:function(){},destroy:function(){},getContext:function(){}};};function v(n,C,o,k){var e,f;if(!C[k]){if(o.required){throw new Error(n+": "+"Required metadataContext '"+k+"' is missing");}}else{e=C[k];f=e.getObject();if(f){var h=Object.assign({},o);delete h.required;delete h.computed;delete h.type;if(f.hasOwnProperty("$kind")){delete h.$Type;}else{delete h.$kind;}Object.keys(h).forEach(function(P){var i=Array.isArray(h[P])?h[P]:[h[P]],V;if(typeof f==="object"){V=f[P];if(!V){if(f.hasOwnProperty("$Path")){V=e.getObject("$Path/"+P);}}}else if(typeof f==="string"){V=e.getObject(P);if(!V){V=i[0];}}else{V=null;}if(i.indexOf(V)===-1){throw new Error(n+": '"+k+"' must be '"+P+"' '"+i+"' but is '"+V+"': "+e.getPath());}});}}}function a(n,m,C,N){var e=(m.metadataContexts&&Object.keys(m.metadataContexts))||[],P=(m.properties&&Object.keys(m.properties))||[],A={};Object.keys(N.attributes).forEach(function(k){var K=N.attributes[k].name;if(K!=="metadataContexts"){A[K]=true;}});Object.keys(C).forEach(function(k){if(k!=="this"&&k!=="this.i18n"){A[k]=true;}});e.forEach(function(k){var o=m.metadataContexts[k];v(n,C,o,k);delete A[k];});P.forEach(function(k){var o=m.properties[k];if(!N.hasAttribute(k)){if(o.required&&!o.hasOwnProperty("defaultValue")){throw new Error(n+": "+"Required property '"+k+"' is missing");}}else{delete A[k];}});Object.keys(A).forEach(function(k){if(k.charAt(0)!=="_"&&k.indexOf(":")<0){L.warning("Unchecked parameter: "+n+": "+k,null,p);}});}function b(m){if(m){var P={};var o=m.metadataContexts||{};Object.keys(m.properties).forEach(function(s){if(m.properties[s].type!=="sap.ui.model.Context"){P[s]=m.properties[s];}else{o[s]=m.properties[s];}});if(m.events){Object.keys(m.events).forEach(function(e){P[e]=m.events[e];});}return{properties:P,aggregations:Object.assign({"dependents":{type:"sap.ui.core.Element"}},m.aggregations),metadataContexts:o};}else{return{metadataContexts:{},aggregations:{"dependents":{type:"sap.ui.core.Element"}},properties:{},events:{}};}}function w(k){return function(V){var o={};o[k]=V;return o;};}function g(n,k,D){return function(){var V=n.getAttribute(k);if(!V&&D.defaultValue){V=D.defaultValue;}return w(k)(V);};}function _(s,n,A,V){var m;if(n.hasAttribute(A)){var e=n.getAttribute(A),f;V.getResult(e,n);m=M.bindingParser(e);if(!m){if(A==="metaPath"&&s.bindingContexts.contextPath){if(e.startsWith("/")){f=e;}else{f=s.bindingContexts.contextPath.getPath(e);}m={model:"contextPath",path:f};}else{m={model:"metaModel",path:s.bindingContexts.entitySet?s.bindingContexts.entitySet.getPath(e):e};}}}else if(s.bindingContexts.hasOwnProperty(A)){m={model:A,path:""};}return m;}function r(m,n,V){var f=m.fragment||m.namespace+"."+m.name,N="this",s=N+".i18n",C={},A=new J(n),e=n.getAttribute("metadataContexts"),o={},h=V.getSettings(),j;var k=b(m.metadata);A._getObject=function(P,i){if((P===undefined||P==="")&&this.oProps){return this.oProps;}var H=O.get(P.replace(/\//g,"."),this.oProps);if(H!==undefined){return H;}if(this.oProps&&this.oProps.hasOwnProperty(P)){return this.oProps[P];}if(P.indexOf(":")===-1&&P.indexOf("/")===-1){L.error("Missing property "+P+" on macro metadata "+m.name);}return n.getAttribute(P);};A.getContextName=function(){return N;};A.$$valueAsPromise=true;C[s]=I.getContext("/");if(!h[f]){h[f]={};}var t=null;var l=true;var q={};if(m.hasValidation){var D=k.properties;var u=k.metadataContexts;var x=Object.keys(D);var y=Object.keys(u);var z=[];for(j=0;j<x.length;j++){var K=x[j];if(n.hasAttribute(K)){z.push(V.visitAttribute(n,n.attributes[K]).then(g(n,K,D[K])));}else{var B={};B[K]=D[K].defaultValue;z.push(Promise.resolve(B));}}l=false;for(j=0;j<y.length;j++){var E=y[j];var F=_(h,n,E,V);if(F){F.name=E;c(C,V,F,o);if((E==="entitySet"&&!h.bindingContexts.hasOwnProperty(E))||E==="contextPath"){h.bindingContexts[E]=C[E];}z.push(Promise.resolve(w(E)(C[E])));}else{q[E]=true;l=true;}}if(n.firstElementChild!==null){z.push(V.visitChildNodes(n));}t=S.all(z);}else{t=V.visitAttributes(n);}var G={};return t.then(function(P){if(P!=null){var H=P.reduce(function(Z,$){return Object.assign(Z,$);},{});Object.keys(k.properties).forEach(function(U){if(k.properties[U].type==="object"&&(!H.hasOwnProperty(U)||H[U]===undefined)){H[U]={};}});var Q=n.firstElementChild;while(Q!==null){var U=Q.localName;if(Object.keys(k.aggregations).indexOf(U)!==-1){G[Q.localName]=Q;}else if(Object.keys(k.properties).indexOf(U)!==-1){H[U]={};for(var i=0;i<Object.keys(Q.attributes).length;i++){var W=Object.keys(Q.attributes)[i];H[U][Q.attributes[W].localName]=Q.attributes[W].value;}}Q=Q.nextElementSibling;}if(m.create){var Y={};if(h.models.viewData){Y=h.models.viewData.getProperty("/controlConfiguration");}H=m.create(H,Y,h);Object.keys(k.metadataContexts).forEach(function(Z){if(k.metadataContexts[Z].computed){C[Z]=H[Z];}});Object.keys(q).forEach(function(Z){if(H.hasOwnProperty(Z)){C[Z]=H[Z];}});}A.oProps=H;}if(l&&e){o=e?M.bindingParser(e):{parts:[]};if(!o.parts){o={parts:[o]};}for(j=0;j<o.parts.length;j++){c(C,V,o.parts[j],o);V=V["with"](C,false);}}}).then(function(){var P;C[N]=A.getContext("/");if(T.isTraceInfoActive()){var i=T.traceMacroCalls(f,k,C,n,V);if(i){P=h["_macroInfo"];h["_macroInfo"]=i.macroInfo;}}a(f,k,C,n);var H=V["with"](C,true);var Q=n.parentNode;return H.insertFragment(f,n).then(function(){if(Object.keys(G).length>0){var U=Q.firstElementChild;Object.keys(G).forEach(function(W){var Y=G[W];var Z=document.createElementNS(U.namespaceURI,W);var $=Y.firstElementChild;while($){var a1=$.nextElementSibling;Z.appendChild($);$=a1;}U.appendChild(Z);});}if(P){h["_macroInfo"]=P;}else{delete h["_macroInfo"];}});});}function c(C,V,o,m){var k=o.name||o.model||undefined;if(m[k]){return;}try{var s=o.path;if(o.model!=null){s=o.model+">"+s;}C[k]=V.getContext(s);var e=V.getSettings();if(e&&e.bindingContexts&&e.bindingContexts.entitySet){C[k].$$configModelContext=V.getSettings().bindingContexts.entitySet.$$configModelContext;}m[k]=C[k];}catch(f){}}function d(m){X.plugIn(r.bind(this,m),m.namespace,m.name);}d._validateMacroSignature=a;return{register:d};});