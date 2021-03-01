// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/appRuntime/ui5/AppRuntimePostMessageAPI","sap/ushell/appRuntime/ui5/AppRuntimeService","sap/base/util/UriParameters","sap/ui/thirdparty/URI","sap/ui/thirdparty/jquery","sap/ushell/appRuntime/ui5/services/TunnelsAgent","sap/ushell/appRuntime/ui5/services/AppDelegationBootstrap","sap/ui/Device","sap/ui/core/BusyIndicator"],function(A,a,U,b,q,t,d,D,B){"use strict";function c(C){var e=this,s,o,f={},g,h={},r,R,i={};this.init=function(m,j,k,l,n){s=m;g=j;R=k;if(l&&n){f[l]=n;}A.registerCommHandlers({"sap.ushell.services.appLifeCycle":{"oServiceCalls":{"create":{executeServiceCallFn:function(M){var p=JSON.parse(M.oMessage.data),l=new U(p.body.sUrl).get("sap-ui-app-id");window.hasher.replaceHash(p.body.sHash);e.create(l,p.body.sUrl);return new q.Deferred().resolve().promise();}},"destroy":{executeServiceCallFn:function(M){var p=JSON.parse(M.oMessage.data);e.destroy(p.body.sCacheId);return new q.Deferred().resolve().promise();}},"store":{executeServiceCallFn:function(M){var p=JSON.parse(M.oMessage.data);e.store(p.body.sCacheId);return new q.Deferred().resolve().promise();}},"restore":{executeServiceCallFn:function(M){var p=JSON.parse(M.oMessage.data);window.hasher.replaceHash(p.body.sHash);e.restore(p.body.sCacheId);return new q.Deferred().resolve().promise();}}}},"sap.ushell.eventDelegation":{"oServiceCalls":{"registerEventHandler":{executeServiceCallFn:function(S){var E=JSON.parse(S.oMessageData.body.sEventObject),p=E.eventKey,u=E.eventData;if(i.hasOwnProperty(p)){var v=i[p];for(var w=0;w<v.length;w++){v[w](u);}}return new q.Deferred().resolve().promise();}}}}});this.initialSetup();};this.initialSetup=function(){d.bootstrap();a.sendMessageToOuterShell("sap.ushell.services.appLifeCycle.setup",{isStateful:true,isKeepAlive:true,lifecycle:{bActive:true,bSwitch:true,bStorageIdentifier:true},settings:{bTheme:true,bLocal:true},session:{bSignOffSupport:true,bExtendSessionSupport:true}});};this.restore=function(S){var j=h[S],k=j.getComponentInstance();j.setVisible(true);if(k){if(k.restore){k.restore();}if(k.getRouter&&k.getRouter()&&k.getRouter().initialize){k.getRouter().initialize();}r=j;}};this.store=function(S){var j=r,k;h[S]=j;k=j.getComponentInstance();j.setVisible(false);if(k){if(k.suspend){k.suspend();}if(k.getRouter&&k.getRouter()){k.getRouter().stop();}}};this.getURLParameters=function(u){return new Promise(function(j,k){if(u.hasOwnProperty("sap-intent-param")){var l=u["sap-intent-param"];a.sendMessageToOuterShell("sap.ushell.services.CrossApplicationNavigation.getAppStateData",{"sAppStateKey":l}).then(function(p){delete u["sap-intent-param"];var m=q.extend({},u,(new b("?"+p)).query(true),true);j(m);},function(E){j(u);});}else{j(u);}});};this.getAppInfo=function(j,u){return new Promise(function(k){function G(){o.getAppInfo(j,u).then(function(l){f[j]=JSON.parse(JSON.stringify(l));k(l);});}if(f[j]){k(JSON.parse(JSON.stringify(f[j])));}else if(o){G();}else{sap.ui.require([s.replace(/\./g,"/")],function(O){o=O;G();});}});};this.create=function(j,u){if(D.browser.chrome){B.show(0);}var k=new Promise(function(l){e.getAppInfo(j,u).then(function(m){l(m);});}).then(function(l){e.getURLParameters(new b(u).query(true)).then(function(m){g(j,m,l).then(function(n){R(n);});});});return k;};this.setComponent=function(j){r=j;};this.destroy=function(S){if(S){if(h[S]===r){r=undefined;}h[S].destroy();delete h[S];}else if(r){r.destroy();r=undefined;}};this.jsonStringifyFn=function(j){var k=JSON.stringify(j,function(l,v){return(typeof v==="function")?v.toString():v;});return k;};}return new c();},true);