// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/_PluginManager/Extensions","sap/base/Log","sap/ushell/EventHub","sap/ui/thirdparty/jquery","sap/base/util/UriParameters","sap/ushell/utils","sap/ushell/components/applicationIntegration/application/PostMessageAPIInterface"],function(g,L,E,q,U,u,P){"use strict";var S="sap.ushell.services.PluginManager",a="sap-ushell-plugin-type",b="RendererExtensions",c="sap.ushell.components.shell.defaults",s=[b,"UserDefaults","UserImage","ContentProvider","AppWarmup"];function d(C,p,o){var t=this,f=[],h=false,l;this._oPluginCollection={};this._oCategoryLoadingProgress={};this._mInitializedComponentPromise={};this._sPluginAgentsNames="";this._oConfig=(o&&o.config)||{};if(this._oConfig.isBlueBox===undefined){this._oConfig.isBlueBox=false;}s.forEach(function(e){t._oPluginCollection[e]={};t._oCategoryLoadingProgress[e]=new q.Deferred();});this._handlePluginCreation=function(e,i,j,k){var t=this,m=(t._oPluginCollection[e])[i];u.setPerformanceMark("FLP -- PluginManager.loadPlugin["+e+"]["+i+"]");try{if(m.hasOwnProperty("component")){if(t._mInitializedComponentPromise.hasOwnProperty(m.component)){t._mInitializedComponentPromise[m.component].then(function(){t._instantiateComponent(m,j,k);},function(){t._instantiateComponent(m,j,k);});}else{t._mInitializedComponentPromise[m.component]=t._instantiateComponent(m,j,k);}}else{L.error("Invalid plugin configuration. The plugin "+i+" must contain a <component> key",S);}}catch(n){L.error("Error while loading bootstrap plugin: "+m.component||"",S);if(j){j.reject(n);}}};this._getFileNameForXhrAuth=function(){return"Component-preload.js";};this._handleXhrAuthentication=function(A,e){var x;if(A&&["true",true,"X"].indexOf(A["sap-ushell-xhr-authentication"])>-1){if(!e){L.error(["Illegal state: configuration parameter 'sap-ushell-xhr-authentication-timeout' set, but no component URL specified.","XHR authentication request will not be sent. Please check the target mapping definitions for plug-ins","and the application index."].join(" "),undefined,S);return q.when();}if(A.hasOwnProperty("sap-ushell-xhr-authentication-timeout")){x=parseInt(A["sap-ushell-xhr-authentication-timeout"],10);if(isNaN(x)){L.error(["Invalid value for configuration parameter 'sap-ushell-xhr-authentication-timeout' for plug-in component with URL '",e,"': '",A["sap-ushell-xhr-authentication-timeout"],"' is not a number. Timeout will be ignored."].join(""),undefined,S);}else{sap.ushell.Container.setXhrLogonTimeout(e,x);}}return q.ajax(e+"/"+this._getFileNameForXhrAuth());}return q.when();};this._instantiateComponent=function(e,i,j){var D=new q.Deferred(),k=JSON.parse(JSON.stringify(e)),A={ui5ComponentName:k.component,url:k.url,getExtensions:g.bind(null,e.component)};function m(r){return function(v){r=r||"Cannot create UI5 plugin component: (componentId/appdescrId :"+A.ui5ComponentName+")\n"+v+" properties "+JSON.stringify(A)+"\n This indicates a plugin misconfiguration, see e.g. Note 2316443.";v=v||"";L.error(r,v.stack,S);if(i){i.reject.apply(this,arguments);}D.reject.apply(this,arguments);};}function n(){sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(A).done(function(r){if(e.config&&e.config["sap-component-agents"]){f.push({componentName:e.component,url:e.url,agents:e.config["sap-component-agents"],pluginComp:r});}if(i){i.resolve(r);}D.resolve.apply(this,arguments);}).fail(m());}k.name=k.component;delete k.component;A.applicationDependencies=k;if(k.config){A.applicationConfiguration=k.config;delete k.config;}A.loadDefaultDependencies=false;if(j!==undefined){A.oPostMessageInterface=j;}this._handleXhrAuthentication(A.applicationConfiguration,k.url).done(n).fail(m("XHR logon for FLP plugin failed"));return D.promise();};this.getSupportedPluginCategories=function(){return JSON.parse(JSON.stringify(s));};this.getRegisteredPlugins=function(){return JSON.parse(JSON.stringify(this._oPluginCollection));};this.registerPlugins=function(i){var t=this,j,k,m,n=[],r,v;if(!i){return;}u.addTime("PluginManager.registerPlugins");if(this._oConfig.isBlueBox===true){r=new U(window.location.href).get("sap-plugins");if(r&&r.length>0){r=","+r+",";}else{r=undefined;}}else{E.emit("pluginConfiguration",i);}Object.keys(i).sort().forEach(function(w){j=i[w]||{};k=j.config||{};m=k[a]||"";if(j.enabled===false){return;}if(!t._isFormFactorSupported(j)){L.info("Plugin '"+w+"' filtered from result: form factor not supported");return;}if(t._oConfig.isBlueBox===true){if(j.config&&j.config["sap-plugin-agent"]===true){v=(j.config["sap-plugin-agent-id"]||w);if(!t.isPluginAgentSupported(v)){if(r){if(r.indexOf(","+v+",")<0){return;}}else{return;}}}}if(j.enabled===undefined){j.enabled=true;}if(j.hasOwnProperty("module")){L.error("Plugin "+w+" cannot get registered, because the module mechanism for plugins is not valid anymore. Plugins need to be defined as SAPUI5 components.",S);q.sap.require(j.module);return;}if(k&&k.hasOwnProperty(a)){if(s&&Array.prototype.indexOf.call(s,m)!==-1){if(n.indexOf(m)===-1){n.push(m);}t._oPluginCollection[m][w]=JSON.parse(JSON.stringify(j));}else{L.warning("Plugin "+w+" will not be inserted into the plugin collection of the PluginManager, because of unsupported category "+m,S);}}else{t._oPluginCollection[b][w]=JSON.parse(JSON.stringify(j));if(n.indexOf(b)===-1){n.push(b);}}});try{if(t._oConfig.isBlueBox!==true){t._buildNamesOfPluginsWithAgents();}}catch(e){L.error("failed to build plugin agents names list",(e.message||e.toString()),"sap.ushell.services.PluginManager");}n.forEach(function(w){if(t._oCategoryLoadingProgress.hasOwnProperty(w)&&t._oCategoryLoadingProgress[w].state()==="resolved"){t.loadPlugins(w);}});};this._isFormFactorSupported=function(e){var D=e.deviceTypes,i=u.getFormFactor();if(D&&D[i]===false){return false;}return true;};this.getPluginLoadingPromise=function(e){if(this._oCategoryLoadingProgress.hasOwnProperty(e)){return this._oCategoryLoadingProgress[e].promise();}};this.registerAgentLifeCycleManager=function(i){l=i;if(h){l(f);}};this.loadPlugins=function(e){var t=this,i,j,k,m;u.setPerformanceMark("FLP -- PluginManager.startLoadPlugins["+e+"]");u.addTime("PluginManager.startLoadPlugins["+e+"]");if(e===b){m=P.getInterface();}if(s&&Array.prototype.indexOf.call(s,e)!==-1){if(t._oCategoryLoadingProgress[e].pluginLoadingTriggered===undefined){t._oCategoryLoadingProgress[e].pluginLoadingTriggered=true;}if(Object.keys(t._oPluginCollection[e]).length>0){i=[];k=Object.keys(t._oPluginCollection[e]);if(new U(window.location.href).get("sap-ushell-xx-pluginmode")==="discard"&&(e==="RendererExtensions"||e==="AppWarmup")){k=k.filter(function(I){return(t._oPluginCollection[e][I].component===c);});}k.forEach(function(n){var r=t._oPluginCollection[e][n];if(!r.loaded){r.loaded=true;j=new q.Deferred();i.push(j.promise());t._handlePluginCreation(e,n,j,m);}});if(i.length>0){q.when.apply(undefined,i).done(function(){u.addTime("PluginManager.endLoadPlugins["+e+"]");u.setPerformanceMark("FLP -- PluginManager.endLoadPlugins["+e+"]");if(l){l(f);}h=true;t._oCategoryLoadingProgress[e].resolve();}).fail(t._oCategoryLoadingProgress[e].reject.bind());}}else{t._oCategoryLoadingProgress[e].resolve();}}else{L.error("Plugins with category "+e+" cannot be loaded by the PluginManager",S);t._oCategoryLoadingProgress[e].reject("Plugins with category "+e+" cannot be loaded by the PluginManager");}return t._oCategoryLoadingProgress[e].promise();};this._buildNamesOfPluginsWithAgents=function(){var t=this,n="",e;Object.keys(t._oPluginCollection).forEach(function(i){Object.keys(t._oPluginCollection[i]).forEach(function(j){e=t._oPluginCollection[i][j];if(e&&e.enabled&&e.enabled===true){if(e.config&&e.config["sap-plugin-agent"]===true){n+=(e.config["sap-plugin-agent-id"]||j)+",";}}});});if(n.endsWith(",")){n=n.slice(0,-1);}this._sPluginAgentsNames=n;};this._getNamesOfPluginsWithAgents=function(){return this._sPluginAgentsNames;};}d.hasNoAdapter=true;return d;},true);