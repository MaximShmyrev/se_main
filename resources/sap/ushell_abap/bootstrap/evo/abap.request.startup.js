// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils","./abap.bootstrap.utils","sap/base/util/ObjectPath","sap/base/Log","sap/ui2/srvc/utils"],function(u,a,O,L){"use strict";var s={};function r(q,p,S){var R="/sap/bc/ui2/start_up?",P=sap.ui2.srvc.getParameterMap(),x;if(q){R+=q+"&";}function c(n){var v=P[n];if(v){R+=n+"="+encodeURIComponent(v[0])+"&";}}p.forEach(c);R+="shellType="+sap.ushell_abap.getShellType()+"&depth=0";if(S){R+=a.getCacheIdAsQueryParameter(S);x=a.createAndOpenXHR(R,S);}return new Promise(function(b,d){sap.ui2.srvc.get(R,false,function(e){var o=JSON.parse(e);b(o);},d,x);});}s.requestStartupConfig=function(){var S=O.get("sap-ushell-config.services.Container.adapter.config");if(S){return Promise.resolve(S);}return r("",["sap-language","sap-client"]);};s.requestFullTM=function(S,n){if(n){return Promise.reject();}u.addTime("RequestFullTM");return r("so=%2A&action=%2A&systemAliasesFormat=object",["sap-language","sap-client","sap-ui2-cache-disable"],S).then(function(R){if(R){if(R.client){return Promise.reject("A start up response was returned in a target mappings request.");}return Promise.resolve(R);}return Promise.resolve({});},function(e){L.error("navTargetDataPromise rejected: "+e);return Promise.reject(e);});};s.requestDirectStart=function(S,n,p,i){if(n){return Promise.reject();}var f=sap.ui2.srvc.getFormFactor(),q="";q="so="+p.semanticObject+"&action="+p.action;q+="&systemAliasesFormat=object";Object.keys(i).forEach(function(k){q+="&"+k+"="+i[k];});if(f){q+="&formFactor="+encodeURIComponent(f);}u.addTime("RequestDirectStart");return r(q,["sap-language","sap-client"],S).then(function(R){u.addTime("ReceiveDirectStart");return Promise.resolve(R);});};return s;});
