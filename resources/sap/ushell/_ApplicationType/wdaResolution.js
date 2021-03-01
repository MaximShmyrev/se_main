// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/URI","sap/ushell/_ApplicationType/utils","sap/ushell/_ApplicationType/systemAlias","sap/ui/thirdparty/jquery","sap/base/util/ObjectPath"],function(U,a,s,q,O){"use strict";function c(p,m){return new Promise(function(R,j){var E=q.extend(true,{},p);if(m.length>0){E["sap-ushell-defaultedParameterNames"]=[JSON.stringify(m)];}delete E["sap-system"];sap.ushell.Container.getService("ShellNavigation").compactParams(E,["sap-xapp-state","sap-ushell-defaultedParameterNames","sap-intent-params","sap-iframe-hint"],undefined,true).fail(function(k){j(k);}).done(function(o){var k=a.getURLParsing().paramsToString(o);R(k);});});}function b(u,j){var p=u.search();if(j){p=p+((p.indexOf("?")<0)?"?":"&")+j;}return u.search(p).toString();}function d(A,C,I,o,E){var S,j,u,k,l,m=q.extend(true,{},o);if(C){m["sap-wd-configId"]=C;}if(m["sap-system"]){S=m["sap-system"][0];delete m["sap-system"];}if(m.hasOwnProperty("sap-system-src")){j=m["sap-system-src"][0];delete m["sap-system-src"];}l=a.getURLParsing().paramsToString(m);if(I){u=e(A,l);}else{u=f(A,l);}k=new U(u);return s.spliceSapSystemIntoURI(k,s.LOCAL_SYSTEM_ALIAS,S,j,"WDA",s.SYSTEM_ALIAS_SEMANTICS.apply,E);}function e(A,u){return"/ui2/nwbc/~canvas;window=app/wda/"+A+"/"+"?"+u;}function f(n,u){var N=n.indexOf("/")!==0;if(N){n="sap/"+n;}return"/webdynpro/"+n+"?"+u;}function g(I,F,S,j){var R={"sap-system":S,url:F,text:I.title,applicationType:"NWBC"};if(typeof j==="string"){R["sap-system-src"]=j;}a.setSystemAlias(R,I.resolutionResult);["additionalInformation","applicationDependencies"].forEach(function(p){if(I.resolutionResult.hasOwnProperty(p)){R[p]=I.resolutionResult[p];}});return R;}function h(m,B,E){var I=O.get("inbound.resolutionResult",m),M=m.mappedIntentParamsPlusSimpleDefaults||{};var S=I.systemAlias;if(M["sap-system"]){S=M["sap-system"][0];}var j;if(M["sap-system-src"]){j=M["sap-system-src"][0];}var o={"sap-system":[S]};if(typeof j==="string"){o["sap-system-src"]=[j];}var C=I["sap.wda"].compatibilityMode;if(C===undefined){C=true;}return new Promise(function(R,k){d(I["sap.wda"].applicationId,I["sap.wda"].configId,C,o,E).done(function(w){var M=m.mappedIntentParamsPlusSimpleDefaults;c(M,m.mappedDefaultedParamNames).then(function(u){var F=b(w,u);var S=M["sap-system"]&&M["sap-system"][0];var j=M["sap-system-src"]&&M["sap-system-src"][0];var l=g(m.inbound,F,S,j);R(l);},function(l){k(l);});}).fail(function(l){k(l);});});}function i(m,B,E){var I=m.inbound,o=I&&I.resolutionResult,M=m.mappedIntentParamsPlusSimpleDefaults;var w=new U(B);var S=M["sap-system"]&&M["sap-system"][0];var j=M["sap-system-src"]&&M["sap-system-src"][0];return Promise.all([(new Promise(function(D,R){s.spliceSapSystemIntoURI(w,o.systemAlias,S,j,"WDA",o.systemAliasSemantics||s.SYSTEM_ALIAS_SEMANTICS.applied,E).fail(R).done(D);})),c(M,m.mappedDefaultedParamNames)]).then(function(R){var W=R[0];var u=R[1];var F=b(W,u);var k=g(I,F,S,j);return k;},function(k){return Promise.reject(k);});}function r(I,m,E){var C,A,o,j=true;A=I.params["sap-ui2-wd-app-id"][0];C=(O.get("params.sap-ui2-wd-conf-id",I)||[])[0];o=Object.keys(I.params).reduce(function(R,p){if(p!=="sap-ui2-wd-app-id"&&p!=="sap-ui2-wd-conf-id"){R[p]=I.params[p];}return R;},{});return new Promise(function(R,k){d(A,C,j,o,E).done(function(u){var S=I.params.hasOwnProperty("sap-system-src")&&I.params["sap-system-src"][0];var l=I.params.hasOwnProperty("sap-system")&&I.params["sap-system"][0];var n={url:u.toString(),applicationType:"NWBC",text:A,additionalInformation:"","sap-system":l};if(typeof S==="string"){n["sap-system-src"]=S;}if(m&&m.inbound&&m.inbound.resolutionResult&&m.inbound.resolutionResult["sap.platform.runtime"]){n["sap.platform.runtime"]=m.inbound.resolutionResult["sap.platform.runtime"];}R(n);}).fail(function(l){k(l);});});}return{resolveEasyAccessMenuIntentWDA:r,constructFullWDAResolutionResult:h,constructWDAResolutionResult:i};},false);
