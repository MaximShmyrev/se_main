// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils","sap/ushell/System","sap/ushell/Ui5ServiceFactory","sap/ushell/Ui5NativeServiceFactory","sap/ui/base/EventProvider","sap/ui/core/service/ServiceFactoryRegistry","sap/ui/core/Control","sap/ui/performance/Measurement","sap/ui/thirdparty/URI","sap/ui/util/Mobile","sap/base/util/uid","sap/base/assert","sap/base/Log"],function(u,S,U,a,E,b,C,M,c,d,f,g,L){"use strict";var h="sap.ushell.services.Container",j="sap.ushell.Container.dirtyState.",o={},k,p,F,A=[];function l(){close();}function r(){document.location="about:blank";}function m(P){if(p&&p[P]){return p[P];}return"sap.ushell.adapters."+P;}function n(e){return(k.services&&k.services[e])||{};}function q(N,e,P,i){var v=n(N).adapter||{},w=v.module||m(e.getPlatform())+"."+N+"Adapter";function x(){return new(jQuery.sap.getObject(w))(e,P,{config:v.config||{}});}if(i){return new Promise(function(y,z){var B=w.replace(/\./g,"/");sap.ui.require([B],function(){try{y(x());}catch(D){z(D);}},z);});}jQuery.sap.require(w);return x();}function s(v){var w=new E(),x=false,R=[],y={},z="sap.ushell.Container."+v.getSystem().getPlatform()+".remoteSystem.",B={},G,D,H=u.getLocalStorage(),I=new u.Map(),J=new u.Map(),K="sap.ushell.Container."+v.getSystem().getPlatform()+".sessionTermination",N=this;this.cancelLogon=function(){if(this.oFrameLogonManager){this.oFrameLogonManager.cancelLogon();}};this.createRenderer=function(e,i){var Q,T,V;M.start("FLP:Container.InitLoading","Initial Loading","FLP");u.setPerformanceMark("FLP - renderer created");e=e||k.defaultRenderer;if(!e){throw new Error("Missing renderer name");}V=(k.renderers&&k.renderers[e])||{};T=V.module||(e.indexOf(".")<0?"sap.ushell.renderers."+e+".Renderer":e);if(V.componentData&&V.componentData.config){Q={config:V.componentData.config};}function W(){var X=new(jQuery.sap.getObject(T))({componentData:Q}),Y=X instanceof sap.ui.core.UIComponent?new sap.ui.core.ComponentContainer({component:X,height:"100%",width:"100%"}):X;if(!(Y instanceof C)){throw new Error("Unsupported renderer type for name "+e);}Y.placeAt=function(Z,$){var a1=Z,b1="canvas",c1=document.body;if(Z===c1.id){a1=document.createElement("div");a1.setAttribute("id",b1);a1.classList.add("sapUShellFullHeight");switch($){case"first":if(c1.firstChild){c1.insertBefore(a1,c1.firstChild);break;}case"only":c1.innerHTML="";default:c1.appendChild(a1);}Z=b1;$="";}C.prototype.placeAt.call(this,Z,$);};y[e]=X;w.fireEvent("rendererCreated",{renderer:X});return Y;}if(i){return new Promise(function(X,Y){var Z=T.replace(/\./g,"/");sap.ui.require([Z],function(){try{X(W());}catch($){Y($);}});});}jQuery.sap.require(T);return W();};this.getRenderer=function(e){var i,Q;e=e||k.defaultRenderer;if(e){i=y[e];}else{Q=Object.keys(y);if(Q.length===1){i=y[Q[0]];}else{L.warning("getRenderer() - cannot determine renderer, because no default renderer is configured and multiple instances exist.",null,h);}}if(i&&i.isA("sap.ui.core.ComponentContainer")){return i.getComponentInstance();}return i;};this.DirtyState={CLEAN:"CLEAN",DIRTY:"DIRTY",MAYBE_DIRTY:"MAYBE_DIRTY",PENDING:"PENDING",INITIAL:"INITIAL"};this.getGlobalDirty=function(){var i,Q=new jQuery.Deferred(),T=f(),V,W=0,X=this.DirtyState.CLEAN;function Y(){if(W===0||X===N.DirtyState.DIRTY){Q.resolve(X);L.debug("getGlobalDirty() Resolving: "+X,null,"sap.ushell.Container");}}function Z($){if($.key.indexOf(j)===0&&$.newValue!==N.DirtyState.INITIAL&&$.newValue!==N.DirtyState.PENDING){L.debug("getGlobalDirty() Receiving event key: "+$.key+" value: "+$.newValue,null,"sap.ushell.Container");if($.newValue===N.DirtyState.DIRTY||$.newValue===N.DirtyState.MAYBE_DIRTY){X=$.newValue;}W-=1;Y();}}try{H.setItem(T,"CHECK");H.removeItem(T);}catch(e){L.warning("Error calling localStorage.setItem(): "+e,null,"sap.ushell.Container");return Q.resolve(this.DirtyState.MAYBE_DIRTY).promise();}if(G){throw new Error("getGlobalDirty already called!");}G=Q;window.addEventListener("storage",Z);Q.always(function(){window.removeEventListener("storage",Z);G=undefined;});for(i=H.length-1;i>=0;i-=1){V=H.key(i);if(V.indexOf(j)===0){if(H.getItem(V)==="PENDING"){H.removeItem(V);L.debug("getGlobalDirty() Cleanup of unresolved 'PENDINGS':"+V,null,"sap.ushell.Container");}else{W+=1;u.localStorageSetItem(V,this.DirtyState.PENDING,true);L.debug("getGlobalDirty() Requesting status for: "+V,null,"sap.ushell.Container");}}}Y();setTimeout(function(){if(Q.state()!=="resolved"){Q.resolve("MAYBE_DIRTY");L.debug("getGlobalDirty() Timeout reached, - resolved 'MAYBE_DIRTY'",null,"sap.ushell.Container");}},W*2000);return Q.promise();};this.getLogonSystem=function(){return v.getSystem();};this.getUser=function(){return v.getUser();};this.getDirtyFlag=function(){var e=x;var Q=sap.ushell.Container.getService("ShellNavigation").getNavigationContext();for(var i=0;i<R.length;i++){e=e||R[i](Q);}return e;};this.setDirtyFlag=function(i){x=i;};this.sessionKeepAlive=function(){if(v.sessionKeepAlive){v.sessionKeepAlive();}};this.registerDirtyStateProvider=function(e){if(typeof e!=="function"){throw new Error("fnDirty must be a function");}R.push(e);};this.deregisterDirtyStateProvider=function(e){if(typeof e!=="function"){throw new Error("fnDirty must be a function");}var Q=-1;for(var i=R.length-1;i>=0;i--){if(R[i]===e){Q=i;break;}}if(Q===-1){return;}R.splice(Q,1);};this.getService=function(e,i,Q){L.warning("Deprecated API call of 'sap.ushell.Container.getService'. Please use 'getServiceAsync' instead",null,"sap.ushell.services.Container");return N._getService.apply(N,arguments);};this.getServiceAsync=function(e,i){return N._getService(e,i,true);};this._getService=function(e,i,Q){var T={},V,W,X,Y,Z,$;function a1(e1){var f1=new jQuery.Deferred();if(!e1){throw new Error("Missing system");}f1.resolve(q(e,e1,i));sap.ushell.Container.addRemoteSystem(e1);return f1.promise();}if(!e){throw new Error("Missing service name");}if(e.indexOf(".")>=0){throw new Error("Unsupported service name");}Z=n(e);V=Z.module||"sap.ushell.services."+e;W=V+"/"+(i||"");$={config:Z.config||{}};function b1(e1,Y){T.createAdapter=a1;return new e1(Y,T,i,$);}function c1(X,Q){var e1;if(X.hasNoAdapter){e1=new X(T,i,$);}else{Y=q(e,v.getSystem(),i,Q);if(Q){return Y.then(function(f1){var e1=b1(X,f1);I.put(W,e1);return e1;});}e1=b1(X,Y);}I.put(W,e1);return Q?Promise.resolve(e1):e1;}if(!I.containsKey(W)){if(Q){if(!J.containsKey(W)){var d1=new Promise(function(e1,f1){sap.ui.require([V.replace(/[.]/g,"/")],function(g1){e1(c1(g1,true));},f1);});J.put(W,d1);return d1;}return J.get(W);}X=sap.ui.requireSync(V.replace(/[.]/g,"/"));return c1(X);}if(Q){return Promise.resolve(I.get(W));}return I.get(W);};function O(){var Q,T,i,V;for(i=H.length-1;i>=0;i-=1){V=H.key(i);if(V.indexOf(z)===0){try{Q=V.substring(z.length);T=JSON.parse(H.getItem(V));B[Q]=new S(T);}catch(e){H.removeItem(V);}}}return B;}function P(){if(typeof OData==="undefined"){return;}function e(i,Q,T){L.warning(i,null,"sap.ushell.Container");if(T){setTimeout(T.bind(null,i),5000);}return{abort:function(){return;}};}OData.read=function(i,Q,T){return e("OData.read('"+(i&&i.Uri?i.requestUri:i)+"') disabled during logout processing",Q,T);};OData.request=function(i,Q,T){return e("OData.request('"+(i?i.requestUri:"")+"') disabled during logout processing",Q,T);};}this.addRemoteSystem=function(e){var i=e.getAlias(),Q=B[i];if(this._isLocalSystem(e)){return;}if(Q){if(Q.toString()===e.toString()){return;}L.warning("Replacing "+Q+" by "+e,null,"sap.ushell.Container");}else{L.debug("Added "+e,null,"sap.ushell.Container");}B[i]=e;u.localStorageSetItem(z+i,e);};this._isLocalSystem=function(e){var i=e.getAlias();if(i&&i.toUpperCase()==="LOCAL"){return true;}var Q=new c(u.getLocationHref()),T=this.getLogonSystem().getClient()||"";if(e.getBaseUrl()===Q.origin()&&e.getClient()===T){return true;}return false;};this.addRemoteSystemForServiceUrl=function(e){var i,Q={baseUrl:";o="};if(!e||e.charAt(0)!=="/"||e.indexOf("//")===0){return;}i=/^[^?]*;o=([^\/;?]*)/.exec(e);if(i&&i.length>=2){Q.alias=i[1];}e=e.replace(/;[^\/?]*/g,"");if(/^\/sap\/(bi|hana|hba)\//.test(e)){Q.platform="hana";Q.alias=Q.alias||"hana";}else if(/^\/sap\/opu\//.test(e)){Q.platform="abap";}if(Q.alias&&Q.platform){this.addRemoteSystem(new S(Q));}};this.attachLogoutEvent=function(e,Q){var T=false;if(Q===true){g(typeof(e)==="function","Container.attachLogoutEvent: fnFunction must be a function");for(var i=0;i<A.length;i++){if(A[i]===e){T=true;break;}}if(!T){A.push(e);}}else{w.attachEvent("Logout",e);}};this.detachLogoutEvent=function(e){w.detachEvent("Logout",e);for(var i=0;i<A.length;i++){if(A[i]===e){A.splice(i,1);break;}}};this.attachRendererCreatedEvent=function(e){w.attachEvent("rendererCreated",e);};this.detachRendererCreatedEvent=function(e){w.detachEvent("rendererCreated",e);};this.defaultLogout=function(){var Q=new jQuery.Deferred();function T(){v.logout(true).always(function(){H.removeItem(K);Q.resolve();});}function V(){var e=new jQuery.Deferred(),X=e.promise(),Y=[];if(A.length>0){for(var i=0;i<A.length;i++){Y.push(A[i]());}Promise.all(Y).then(e.resolve);setTimeout(e.resolve,4000);}else{e.resolve();}X.done(function(){if(w.fireEvent("Logout",true)){T();}else{setTimeout(T,1000);}});}function W(){var B,i=[];if(D){window.removeEventListener("storage",D);}u.localStorageSetItem(K,"pending");N._suppressOData();B=N._getRemoteSystems();Object.keys(B).forEach(function(X){try{i.push(q("Container",B[X]).logout(false));}catch(e){L.warning("Could not create adapter for "+X,e.toString(),"sap.ushell.Container");}H.removeItem(z+X);});jQuery.when.apply(jQuery,i).done(V);}if(typeof v.addFurtherRemoteSystems==="function"){v.addFurtherRemoteSystems().always(W);}else{W();}return Q.promise();};this.logout=this.defaultLogout;this.registerLogout=function(e){this.logout=e;};this.setLogonFrameProvider=function(e){if(this.oFrameLogonManager){this.oFrameLogonManager.logonFrameProvider=e;}};this.setXhrLogonTimeout=function(e,T){if(this.oFrameLogonManager){this.oFrameLogonManager.setTimeout(e,T);}};this.getFLPConfig=function(){var N=this,e=new Promise(function(i,Q){var T={URL:N.getFLPUrl()};if(o.CDMPromise){o.CDMPromise.then(function(V){V.getSite().then(function(W){T.scopeId=W.site.identification.id;i(T);});});}else{i(T);}});return e;};this.getFLPUrl=function(i){var e=u.getLocationHref(),Q=e.indexOf(this.getService("URLParsing").getShellHash(e));if(Q===-1||i===true){return e;}return e.substr(0,Q-1);};this._closeWindow=l;this._redirectWindow=r;this._getRemoteSystems=O;this._suppressOData=P;sap.ui.getCore().getEventBus().subscribe("sap.ushell.Container","addRemoteSystemForServiceUrl",function(e,i,Q){N.addRemoteSystemForServiceUrl(Q);});if(typeof v.logoutRedirect==="function"){D=function(e){function i(){N._closeWindow();N._redirectWindow();}if(sap.ushell.Container!==N){return;}if(e.key.indexOf(z)===0&&e.newValue&&e.newValue!==H.getItem(e.key)){u.localStorageSetItem(e.key,e.newValue);}if(e.key===K){if(e.newValue==="pending"){N._suppressOData();if(w.fireEvent("Logout",true)){i();}else{setTimeout(i,1000);}}}};window.addEventListener("storage",D);}this._getFunctionsForUnitTest=function(){return{createAdapter:q};};}function t(e,i){e.forEach(function(v){var w=U.createServiceFactory(v,i);b.register("sap.ushell.ui5service."+v,w);});}function _(e){e.forEach(function(i){var v=a.createServiceFactory(i);b.register("sap.ushell.ui5service."+i,v);});}sap.ushell.bootstrap=function(P,e){var i,D=new jQuery.Deferred();d.init();if(sap.ushell.Container!==undefined){i=new Error("Unified shell container is already initialized - cannot initialize twice.\nStacktrace of first initialization:"+F);L.error(i,i.stack,h);throw i;}F=(new Error()).stack;k=jQuery.extend({},true,window["sap-ushell-config"]||{});p=e;if(typeof window["sap.ushell.bootstrap.callback"]==="function"){setTimeout(window["sap.ushell.bootstrap.callback"]);}if(k.modulePaths){Object.keys(k.modulePaths).forEach(function(w){jQuery.sap.registerModulePath(w,k.modulePaths[w]);});}t(["Personalization","URLParsing","CrossApplicationNavigation"],true);t(["Configuration"],false);_(["CardNavigation","CardUserRecents","CardUserFrequents"]);var v=new S({alias:"",platform:k.platform||P});q("Container",v,null,true).then(function(w){w.load().then(function(){function x(){var z,B;var G=window["sap-ushell-config"];if(!G||!G.services){return false;}z=G.services.PluginManager;B=z&&z.config;return B&&B.loadPluginsFromSite;}sap.ushell.Container=new s(w);var y=[sap.ushell.Container.getServiceAsync("PluginManager")];if(x()){o.CDMPromise=sap.ushell.Container.getServiceAsync("CommonDataModel");y.push(o.CDMPromise);}Promise.all(y).then(function(z){var B=z[0],G=z[1];var H=G?G.getPlugins():jQuery.when({});H.then(function(I){var J=jQuery.extend(true,{},k.bootstrapPlugins,I);B.registerPlugins(J);});}).then(function(){if(u.hasFLPReady2NotificationCapability()){sap.ui.require(["sap/ushell/NWBCInterface"],function(N){u.getPrivateEpcm().doEventFlpReady2(N);});}else if(u.hasFLPReadyNotificationCapability()){u.getPrivateEpcm().doEventFlpReady();}sap.ui.require(["sap/ushell/Config"],function(z){if(z.last("/core/darkMode/enabled")){sap.ushell.Container.getService("DarkModeSupport").setup();}});});D.resolve();});});return D.promise();};});