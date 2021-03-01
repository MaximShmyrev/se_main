// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
prepareModules();sap.ui.define(["sap/base/util/LoaderExtensions","sap/ushell/appRuntime/ui5/AppRuntimePostMessageAPI","sap/ushell/appRuntime/ui5/AppCommunicationMgr","sap/ushell/appRuntime/ui5/AppRuntimeService","sap/ui/thirdparty/URI","sap/ushell/appRuntime/ui5/SessionHandlerAgent","sap/ushell/appRuntime/ui5/services/AppLifeCycleAgent","sap/ushell/appRuntime/ui5/services/ShellUIService","sap/ushell/ui5service/UserStatus","sap/ushell/appRuntime/ui5/services/AppConfiguration","sap/ushell/appRuntime/ui5/services/UserInfo","sap/ui/core/Popup","sap/ui/thirdparty/jquery","sap/base/util/isEmptyObject","sap/base/Log","sap/ui/core/ComponentContainer","sap/ushell/appRuntime/ui5/renderers/fiori2/AccessKeysAgent","sap/ui/core/BusyIndicator"],function(L,A,a,b,U,S,c,d,f,g,h,P,q,i,j,C,k,B){"use strict";var p=new U().search(true),o,s,E=false,l=false,m={};function n(){this.main=function(){var e=this;a.init();this.getPageConfig();Promise.all([c.getURLParameters(e._getURI()),e.fetchStartupPlugins()]).then(function(x){var y=x[0],z=y["sap-ui-app-id"];m=x[1];e.setModulePaths();e.init();Promise.all([e.initServicesContainer(),e.getAppInfo(z)]).then(function(x){var D=x[1];S.init();k.init();e.createApplication(z,y,D).then(function(R){e.renderApplication(R);});});});};this._getURI=function(){return new U().query(true);};this.init=function(){A.registerCommHandlers({"sap.ushell.appRuntime":{oServiceCalls:{"hashChange":{executeServiceCallFn:function(e){var H=e.oMessageData.body.sHash;if(H&&H.length>0){window.hasher.replaceHash(H);}return new q.Deferred().resolve().promise();}},"setDirtyFlag":{executeServiceCallFn:function(e){var I=e.oMessageData.body.bIsDirty;if(I!==sap.ushell.Container.getDirtyFlag()){sap.ushell.Container.setDirtyFlag(I);}return new q.Deferred().resolve().promise();}},"themeChange":{executeServiceCallFn:function(e){var x=e.oMessageData.body.currentThemeId;sap.ushell.Container.getUser().setTheme(x);return new q.Deferred().resolve().promise();}},"buttonClick":{executeServiceCallFn:function(e){sap.ushell.renderers.fiori2.Renderer.handleHeaderButtonClick(e.oMessageData.body.buttonId);return new q.Deferred().resolve().promise();}},"uiDensityChange":{executeServiceCallFn:function(e){var x=e.oMessageData.body.isTouch;q("body").toggleClass("sapUiSizeCompact",(x==="0")).toggleClass("sapUiSizeCozy",(x==="1"));return new q.Deferred().resolve().promise();}}}}});};this.getStartupPlugins=function(){return m;};this.inIframe=function(){try{return window.self!==window.top;}catch(e){return true;}};this.isInsideYellowBox=function(){var I=false,e=this;return new Promise(function(R){if(e.inIframe()){var T=setTimeout(function(){if(!I){R(false);}},500);b.sendMessageToOuterShell("sap.ushell.appRuntime.shellCheck",{}).then(function(){I=true;clearTimeout(T);R(I);});}else{R(false);}});};this.fetchStartupPlugins=function(){var e=this;return new Promise(function(R){e.isInsideYellowBox().then(function(I){if(I){b.sendMessageToOuterShell("sap.ushell.appRuntime.startupPlugins",{}).then(function(m){R(m);});}else{R({});}});});};this.getPageConfig=function(){var e,x={};e=q("meta[name='sap.ushellConfig.ui5appruntime']")[0];if(e!==undefined){x=JSON.parse(e.content);}window["sap-ushell-config"]=q.extend(true,{},r(),x);};this.setModulePaths=function(){if(window["sap-ushell-config"].modulePaths){var e=Object.keys(window["sap-ushell-config"].modulePaths);for(var x in e){(function(){var y={};y[e[x].replace(/\./g,"/")]=window["sap-ushell-config"].modulePaths[e[x]];sap.ui.loader.config({paths:y});}());}}};this.initServicesContainer=function(){return new Promise(function(R){sap.ui.require(["sap/ushell/appRuntime/ui5/services/Container"],function(e){e.bootstrap("apprt",{apprt:"sap.ushell.appRuntime.ui5.services.adapters"}).then(function(){R();});});});};this._getURIParams=function(){return p;};this.getAppInfo=function(e){var D=window["sap-ushell-config"].ui5appruntime.config.appIndex.data,M=window["sap-ushell-config"].ui5appruntime.config.appIndex.module,x=this;return new Promise(function(R){if(D&&!i(D)){c.init(M,x.createApplication.bind(x),x.renderApplication.bind(x),e,D);R(D);}else{c.init(M,x.createApplication.bind(x),x.renderApplication.bind(x));c.getAppInfo(e,document.URL).then(function(y){R(y);});}});};this.setApplicationParameters=function(e,x){var y,z,D,F=new q.Deferred();function G(H,I){var J="";if(H&&H.length>0){J=(H.startsWith("?")?"":"?")+H;}if(I&&I.length>0){J+=(J.length>0?"&":"?")+I;}return J;}if(x.hasOwnProperty("sap-startup-params")){y=(new U("?"+x["sap-startup-params"])).query(true);if(y.hasOwnProperty("sap-intent-param")){z=y["sap-intent-param"];delete y["sap-intent-param"];}D=(new U("?")).query(y).toString();if(z){b.sendMessageToOuterShell("sap.ushell.services.CrossApplicationNavigation.getAppStateData",{"sAppStateKey":z}).then(function(M){e.url+=G(D,M);F.resolve();},function(H){e.url+=G(D);F.resolve();});}else{e.url+=G(D);F.resolve();}}else{F.resolve();}return F.promise();};this.setHashChangedCallback=function(){function e(x){if(x&&typeof x==="string"&&x.length>0){b.sendMessageToOuterShell("sap.ushell.appRuntime.hashChange",{"newHash":x});}}window.hasher.changed.add(e.bind(this),this);};this.createApplication=function(e,x,y){var z=this,D=function(F){b.sendMessageToOuterShell("sap.ushell.services.ShellUIService.showShellUIBlocker",{"bShow":F.getParameters().visible});};return new Promise(function(R){o=new C({id:e+"-content",width:"100%",height:"100%"});var F="0";if(p.hasOwnProperty("sap-touch")){F=p["sap-touch"];if(F!=="0"&&F!=="1"){F="0";}}q("body").toggleClass("sapUiSizeCompact",(F==="0")).toggleClass("sapUiSizeCozy",(F==="1"));if(!s){sap.ushell.renderers.fiori2.utils.init();s=sap.ushell.Container.getService("ShellNavigation");s.init(function(){});s.registerNavigationFilter(function(){if(sap.ushell.Container.getDirtyFlag()){return s.NavigationFilterStatus.Abandon;}return s.NavigationFilterStatus.Continue;});}c.setComponent(o);new d({scopeObject:o,scopeType:"component"});new f({scopeObject:o,scopeType:"component"});if(P.attachBlockLayerStateChange){P.attachBlockLayerStateChange(D);}z.setApplicationParameters(y,x).done(function(){z.setHashChangedCallback();sap.ushell.Container.getServiceAsync("Ui5ComponentLoader").then(function(G){G.createComponent({ui5ComponentName:e,applicationDependencies:y,url:y.url},"todo-replaceDummyShellHash",false).then(function(H){sap.ushell.Container.getServiceAsync("AppLifeCycle").then(function(I){I.prepareCurrentAppObject("UI5",H.componentHandle.getInstance(),false,undefined);});z.overrideSendAsEmailFn();z.loadPlugins();R(H);});});});});};this.overrideSendAsEmailFn=function(){if(E===true){return;}E=true;if(sap.m&&sap.m.URLHelper&&sap.m.URLHelper.triggerEmail){sap.m.URLHelper.triggerEmail=function(T,e,x,y,z){b.sendMessageToOuterShell("sap.ushell.services.ShellUIService.sendEmail",{sTo:T,sSubject:e,sBody:x,sCc:y,sBcc:z,sIFrameURL:document.URL,bSetAppStateToPublic:true});};}};this.loadPlugins=function(){if(l===true){return;}u();v();w();l=true;sap.ushell.Container.getServiceAsync("PluginManager").then(function(e){e.loadPlugins("RendererExtensions");});};function u(){try{if(p.hasOwnProperty("sap-wapoc")&&p["sap-wapoc"]=="true"){q.getScript("https://education3.hana.ondemand.com/education3/pub/cflp_falko/adaptable/web_assistant_cflp_agent/Help4Agent.js");}}catch(e){j.error(e);}}function v(){sap.ushell.Container.getService("PluginManager").registerPlugins({RTAPluginAgent:{component:"sap.ushell.appRuntime.ui5.plugins.rtaAgent",url:q.sap.getResourcePath("sap/ushell/appRuntime/ui5/plugins/rtaAgent"),config:{"sap-plugin-agent":true}}});}function w(){var e;if(p.hasOwnProperty("sap-wa-debug")&&p["sap-wa-debug"]=="dev"){e="https://education3.hana.ondemand.com/education3/web_assistant/framework/FioriAgent.js";}else if(p.hasOwnProperty("sap-wa-debug")&&p["sap-wa-debug"]=="prev"){e="https://webassistant-outlook.enable-now.cloud.sap/web_assistant/framework/FioriAgent.js";}else{e="https://webassistant.enable-now.cloud.sap/web_assistant/framework/FioriAgent.js";}sap.ushell.Container.getService("PluginManager").registerPlugins({WAPluginAgent:{component:"sap.ushell.appRuntime.ui5.plugins.scriptAgent",url:q.sap.getResourcePath("sap/ushell/appRuntime/ui5/plugins/scriptAgent"),config:{"sap-plugin-agent":true,"url":e}}});}this.renderApplication=function(R){o.setComponent(R.componentHandle.getInstance()).placeAt("content");B.hide();};}function r(){return{services:{CrossApplicationNavigation:{module:"sap.ushell.appRuntime.ui5.services.CrossApplicationNavigation",adapter:{module:"sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"}},NavTargetResolution:{module:"sap.ushell.appRuntime.ui5.services.NavTargetResolution",adapter:{module:"sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"}},ShellNavigation:{module:"sap.ushell.appRuntime.ui5.services.ShellNavigation",adapter:{module:"sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"}},AppConfiguration:{module:"sap.ushell.appRuntime.ui5.services.AppConfiguration"},Bookmark:{module:"sap.ushell.appRuntime.ui5.services.Bookmark",adapter:{module:"sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"}},LaunchPage:{module:"sap.ushell.appRuntime.ui5.services.LaunchPage",adapter:{module:"sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"}},UserInfo:{module:"sap.ushell.appRuntime.ui5.services.UserInfo",adapter:{module:"sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"}},AppState:{module:"sap.ushell.appRuntime.ui5.services.AppState",adapter:{module:"sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"}},PluginManager:{module:"sap.ushell.appRuntime.ui5.services.PluginManager",config:{isBlueBox:true}},Ui5ComponentLoader:{config:{amendedLoading:false}}}};}var t=new n();t.main();return t;});
function prepareModules(){"use strict";sap.ui.require(["sap/ui/core/BusyIndicator"],function(B){B.show(0);});if(document.URL.indexOf("ui5appruntime")>0){sap.ui.define("sap/ushell/ApplicationType",[],function(){return{};});sap.ui.define("sap/ushell/components/applicationIntegration/AppLifeCycle",[],function(){return{};});sap.ui.define("sap/ushell/services/_AppState/WindowAdapter",[],function(){return function(){};});sap.ui.define("sap/ushell/services/_AppState/SequentializingAdapter",[],function(){return function(){};});sap.ui.define("sap/ushell/services/_AppState/Sequentializer",[],function(){return function(){};});sap.ui.define("sap/ushell/services/Configuration",[],function(){function C(){this.attachSizeBehaviorUpdate=function(){};this.hasNoAdapter=true;}C.hasNoAdapter=true;return C;});sap.ui.define("sap/ushell/services/_PluginManager/Extensions",[],function(){return function(){};});sap.ui.define("sap/ushell/TechnicalParameters",[],function(){return{getParameterValue:function(){return Promise.resolve([]);},getParameterValueSync:function(){return[];},getParameters:function(){return[];},getParameterNames:function(){return[];},isTechnicalParameter:function(){return false;}};});sap.ui.define("sap/ushell/AppInfoParameters",[],function(){return{getInfo:function(){return Promise.resolve({});}};});}}
