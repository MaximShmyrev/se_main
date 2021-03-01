// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/components/applicationIntegration/application/Application","sap/ushell/components/container/ApplicationContainer","sap/ushell/EventHub","sap/ui/thirdparty/URI","sap/ushell/components/applicationIntegration/application/PostMessageAPI","sap/ui/thirdparty/jquery","sap/base/Log","sap/base/util/UriParameters","sap/base/security/encodeXML"],function(A,a,E,U,P,q,L,b,e){"use strict";function B(){var c,m={},t=this,d,C={"isStateful":{handler:function(g,i){if(g&&(g.enabled===true||g===true)){return true;}return false;}},"isGUI":{handler:function(g,i){if(g&&g.protocol==="GUI"){return true;}return false;}},"isGUIStateful":{handler:function(g,i){return t.isCapUT(i,"isGUI")&&t.isCapUT(i,"isStateful");}},"isFLP":{handler:function(g,i){return!t.isCapUT(i,"isGUI")&&t.isCapUT(i,"isStateful");}}},o={},s={},S={},h={setup:function(T,g){},create:function(i,u,g,T){var D=new q.Deferred(),F,p;function j(){if(F){F["sap-flp-url"]=sap.ushell.Container.getFLPUrl(true);p["sap-flp-params"]=e(JSON.stringify(F));}sap.ui.getCore().getEventBus().publish("launchpad","appOpening",T);A.postMessageToIframeApp(i,"sap.ushell.services.appLifeCycle","create",p,true).then(function(){o[i].currentAppTarget=T;sap.ui.getCore().getEventBus().publish("sap.ushell","appOpened",T);D.resolve();});}u=a.prototype._checkNwbcUrlAdjustment(i,T.applicationType,u);u=a.prototype._adjustURLForIsolationOpeningWithoutURLTemplate(u);p={sCacheId:g,sUrl:u,sHash:window.hasher.getHash()};if(t._isOpenWithPost()===true){var I=[];var k=a.prototype._getParamKeys(u,I);if(k.length>0){var l=sap.ushell.Container.getService("CrossApplicationNavigation");l.getAppStateData(k).then(function(n){F={};I.forEach(function(r,v){if(n[v][0]){F[r]=n[v][0];}});j();},function(n){j();});}else{F={};j();}}else{j();}return D.promise();},destroy:function(i,g){var p;p=A.postMessageToIframeApp(i,"sap.ushell.services.appLifeCycle","destroy",{sCacheId:g},true);p.then(function(){sap.ui.getCore().getEventBus().publish("sap.ushell","appClosed",o[i].currentAppTarget);o[i].currentAppTarget=undefined;});return p;},store:function(i,g){var p;p=A.postMessageToIframeApp(i,"sap.ushell.services.appLifeCycle","store",{sCacheId:g},true);p.then(function(){sap.ui.getCore().getEventBus().publish("sap.ushell","appClosed",o[i].currentAppTarget);o[i].currentAppTarget=undefined;});return p;},restore:function(i,g,T){var p;sap.ui.getCore().getEventBus().publish("launchpad","appOpening",T);p=A.postMessageToIframeApp(i,"sap.ushell.services.appLifeCycle","restore",{sCacheId:g,sHash:window.hasher.getHash()},true);p.then(function(){o[i].currentAppTarget=T;sap.ui.getCore().getEventBus().publish("sap.ushell","appOpened",T);});return p;}},f=[{service:"sap.ushell.services.appLifeCycle",action:"create"},{service:"sap.ushell.services.appLifeCycle",action:"destroy"}];this._isOpenWithPost=function(){return((new b(window.location.href)).get("sap-post")==="true");};this.subscribePluginAgents=function(g,i){Object.keys(g).map(function(k){if(!m[k]){m[k]=[];}m[k].push(i);});};this._managePluginAgents=function(g){var t=this;var H=function(i,I,j,p){var k={"loading":{sInterface:"agentLoading"},"started":{sInterface:"agentStart"},"exit":{sInterface:"agentExit"}},l=k[j.status];if(l){if(I[l.sInterface]){I[l.sInterface](i,p,j);}}};g.forEach(function(M){var i=M.pluginComp.componentHandle.getInstance();Object.keys(o).map(function(j){Object.keys(M.agents).map(function(p){if(o[j].PlugIns&&o[j].PlugIns[p]){var k=o[j].PlugIns[p];H(o[j].BlueBox,i,k,p);}});});t.subscribePluginAgents(M.agents,function(j,p,k){H(j,i,k,p);});});};this.startPluginAgentsLifeCycle=function(){var t=this;sap.ushell.Container.getServiceAsync("PluginManager").then(function(p){p.registerAgentLifeCycleManager(t._managePluginAgents.bind(t));});};this.init=function(g,i,j){var t=this;c={};A.init(this);d=j;E.once("StepDone").do(function(){t.startPluginAgentsLifeCycle();});E.once("pluginConfiguration").do(function(k){var s={};Object.keys(k).forEach(function(K){if(k[K].config&&k[K].config["sap-component-agents"]){s=q.extend(true,s,k[K].config["sap-component-agents"]);}});t.setStartupPlugins(s);});if(i){S=q.extend(true,S,i.supportedTypes);}P.registerShellCommunicationHandler({"sap.ushell.appRuntime":{oServiceCalls:{"startupPlugins":{executeServiceCallFn:function(k){return new q.Deferred().resolve(s).promise();}},"shellCheck":{executeServiceCallFn:function(k){return new q.Deferred().resolve({InShell:true}).promise();}}}},"sap.ushell.services.pluginManager":{oServiceCalls:{"status":{executeServiceCallFn:function(k){var l=k.oMessageData.body,n;if(k.oContainer&&o[k.oContainer]&&l&&l.name&&o[k.oContainer].PlugIns[l.name]){o[k.oContainer].PlugIns[l.name].status=l.status;n=m[l.name];if(n){n.map(function(p){p(k.oContainer,l.name,l);});}return new q.Deferred().resolve(o[k.oContainer].PlugIns).promise();}return new q.Deferred().resolve({}).promise();}}}}});};this.setStartupPlugins=function(g){s=JSON.parse(JSON.stringify(g));Object.keys(s).forEach(function(k){s[k].status="unknown";});};this.getPluginAgentStatus=function(g,i){return JSON.parse(JSON.stringify(o[g].PlugIns[i]));};this.isStatefulContainerSupported=function(g){var i=this.isCapabilitySupported(g,"sap.ushell.services.appLifeCycle","create")&&this.isCapabilitySupported(g,"sap.ushell.services.appLifeCycle","destroy");return i;};this.isKeepAliveSupported=function(g){var i=this.isCapabilitySupported(g,"sap.ushell.services.appLifeCycle","store")&&this.isCapabilitySupported(g,"sap.ushell.services.appLifeCycle","restore");return i;};this.mapCapabilities=function(g,i){this.setCapabilities(g,i);};this.getCapabilities=function(g){return o[g].oCapMap;};this.isCapabilitySupported=function(g,i,I){if(o[g]&&o[g].oCapMap&&o[g].oCapMap[i]){return!!o[g].oCapMap[i][I];}return false;};this.setCapabilities=function(g,i){var j;if(!o[g]){this.InitBlueBoxBD(g);}if(!o[g].oCapMap){o[g].oCapMap={};}j=o[g].oCapMap;Object.keys(i).forEach(function(k){var l=i[k],n;if(!j[l.service]){j[l.service]={};}n=j[l.service];n[l.action]=true;});if(!g.getIsStateful()&&this.isStatefulContainerSupported(g)){g.setIsStateful(true);}};this.removeCapabilities=function(g){if(o[g]){o[g].oCapMap={};g.setIsStateful(false);}};this.hasIFrame=function(g){if(g&&g._getIFrame){return true;}return false;};this.getStorageKey=function(g){return o[g].sStorageKey;};this.InitBlueBoxBD=function(g){o[g]={BlueBox:g,PlugIns:JSON.parse(JSON.stringify(s))};};this.setAppCapabilities=function(g,T){if(!o[g]){this.InitBlueBoxBD(g);}o[g].currentAppTarget=T;o[g].appCapabilities=T.appCapabilities;if(T.appCapabilities&&T.appCapabilities.statefulContainer===true){this.setCapabilities(g,f);}};this.forEach=function(g){var k;for(k in o){if(o.hasOwnProperty(k)){g(o[k].BlueBox);}}};this.isCapByTarget=function(T,g){if(T.appCapabilities===undefined){return false;}if(C[g]&&T&&T.appCapabilities){return C[g].handler(T.appCapabilities);}return T.appCapabilities[g]||false;};this.isCapUT=function(g,i){var j=o[g];if(j===undefined||j.appCapabilities===undefined){return false;}if(C[i]&&j){return C[i].handler(j.appCapabilities,g);}return j.appCapabilities[i]||false;};this.setStorageKey=function(g,i){if(!o[g]){this.InitBlueBoxBD(g);}o[g].sStorageKey=i;};this.getStorageKey=function(g){if(!o[g]){return undefined;}return o[g].sStorageKey;};this.getHandler=function(){return h;};this._getBlueBoxCacheKey=function(u){var g,H,p,i="",j;if(u===undefined||u===""||u==="../"){return u;}try{g=new U(u);H=g.hostname();if(H===undefined||H===""){H=g.path();if(H===undefined||H===""){H=u;}}p=g.query(true);if(p["sap-iframe-hint"]){i="@"+p["sap-iframe-hint"];}}catch(k){L.error("URL '"+u+"' can not be parsed: "+k,"sap.ushell.components.applicationIntegration.application.BlueBoxHandler");H=u;}j=H+i;return j;};this.deleteStateFul=function(u){var g=this._getBlueBoxCacheKey(u);return this.delete(g);};this.getStateFul=function(u){if(u===undefined||Object.keys(c).length===0){return undefined;}var g=this._getBlueBoxCacheKey(u);if(g!==undefined){return this.get(g);}else{return undefined;}};this.destroyApp=function(g){d.postMessageToIframeApp("sap.ushell.services.appLifeCycle","destroy",{appId:g});};this.openApp=function(g){d.postMessageToIframeApp("sap.ushell.services.appLifeCycle","create",{appId:g,sHash:window.hasher.getHash()});};this.storeApp=function(g){d.postMessageToIframeApp("sap.ushell.services.appLifeCycle","store",{appId:g,sHash:window.hasher.getHash()});};this.restoreApp=function(g){d.postMessageToIframeApp("sap.ushell.services.appLifeCycle","restore",{appId:g,sHash:window.hasher.getHash()});};this.delete=function(u){if(c[u]){delete c[u];}};this.get=function(u){return c[u];};this.getById=function(i){for(var k in c){if(c.hasOwnProperty(k)){var g=c[k];if(g.sId===i){return g;}}}};this.set=function(u,i){var g=this._getBlueBoxCacheKey(u);c[g]=i;};}return new B();},true);
