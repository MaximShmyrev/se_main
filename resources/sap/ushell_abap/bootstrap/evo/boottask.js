// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/bootstrap/common/common.boot.path","sap/ushell/bootstrap/common/common.load.xhrlogon","sap/ushell/utils","./abap.bootstrap.utils","./abap.request.server.config","./abap.request.startup","./abap.request.pageset","./abap.request.catalog","./abap.xhr.handler","./abap.theme.handler","sap/ushell/EventHub","sap/ui/performance/trace/initTraces","sap/base/Log","sap/ushell/services/Container","sap/ui/Device","sap/ui2/srvc/utils"],function(b,x,u,a,r,s,p,c,X,t,E,i,L){"use strict";var B={};sap.ushell_abap=sap.ushell_abap||{};sap.ushell_abap.bootstrap=sap.ushell_abap.bootstrap||{};sap.ushell_abap.getShellType=function(){return u.hasNativeNavigationCapability()?"NWBC":"FLP";};sap.ushell_abap.bootstrap.addPostParametersToNavTargetResultUrl=function(P,U){if(P){U+=(U.indexOf("?")<0)?"?":"&";U+=P;}return U;};sap.ushell_abap.bootstrap.adjustNavTargetResult=function(R){if(R){var U=R.url,e,N={applicationType:R.applicationType,additionalInformation:R.applicationData},O,P,Q,T;if(R.text){N.text=R.text;}if((R.applicationType==="URL"||R.applicationType==="SAPUI5")){P=/^SAPUI5\.Component=(.*)/.exec(R.applicationData);O=P&&P[1];if(O||R.applicationDependencies){if(O){N.ui5ComponentName=O;}if(R.applicationDependencies){try{Q=JSON.parse(R.applicationDependencies);T=Q.self;if(!N.ui5ComponentName&&T.name){N.ui5ComponentName=T.name;N.additionalInformation="SAPUI5.Component="+N.ui5ComponentName;}if(T&&T.url&&typeof T.url==="string"){var V=sap.ui.require("sap/ui/thirdparty/URI");e=U&&new V(U);if(e){if(T.url.toUpperCase().indexOf(e.path().toUpperCase())!==0){sap.ui2.srvc.log.debug("Component URL defined in target mapping "+"does not match the URL retrieved from application index. "+"The URL of the application index is used for further processing.","Target mapping URL: "+R.url+"\nApplication index URL: "+T.url,"sap.ushell_abap.bootstrap.abap");}e.path(T.url);U=e.toString();jQuery.sap.log.debug("ResolveLink result's component url has been replaced with the url specified "+"in Application Dependencies, which includes cache buster token");}else{U=T.url;}}N.applicationDependencies=Q;}catch(W){sap.ui2.srvc.log.error("Parsing of applicationDependencies attribute in resolveLink result failed for SAPUI5 component '"+O+"'",W,"sap.ushell_abap.bootstrap.abap");}}U=sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig(U);}}N.url=U;return N;}};var d=new RegExp("^(#)?([A-Za-z0-9_]+)-([A-Za-z0-9_]+)"),S,o;function f(e){function N(e){if(!e){return false;}return e.indexOf("Shell-home")===0||e.indexOf("Launchpad-openFLPPage")===0||e.indexOf("Shell-appfinder")===0||e.indexOf("Shell-catalog")===0||e.indexOf("shell-catalog")===0||e.indexOf("Action-search")===0;}function O(){return window["sap-ushell_abap-bootstrap-abap-noInitialTarget"]!==undefined;}var P=e.match(d);var Q=P&&P[2];var R=P&&P[3];var T=e&&!N(e)&&!O()&&Q&&R;return T;}function g(){var e,N=a.getLocationHref(),O=N.indexOf("#");if(O<0){return"";}e=decodeURI(N.slice(O+1));return e;}function h(){var e=g(),N=e.indexOf("&/");return N<0?e:e.slice(0,N);}function j(e){var N=e.match(d);return N?{semanticObject:N[2],action:N[3]}:undefined;}function k(e){if(!e||e==="#"){return true;}return(e.indexOf("Shell-home")===0)||(e.indexOf("Launchpad-openFLPPage")===0)||(e.indexOf("Shell-appfinder")===0)||(e.indexOf("Shell-catalog")===0)||(e.indexOf("shell-catalog")===0);}function l(O){if(O===undefined){return undefined;}try{return JSON.parse(JSON.stringify(O));}catch(e){sap.ui2.srvc.log.error("Could not clone object",null,"sap.ushell_abap.bootstrap");return undefined;}}function m(T){return T.indexOf("sap_")===0;}function n(e,N){var O=sap.ui.getCore(),P=O.getConfiguration(),Q=P.getFormatSettings();u.addTime("setSapui5Settings");L.debug("setSapui5Settings()",JSON.stringify(e),"sap.ushell_abap.bootstrap.abap");if(e.language){P.setLanguage(e.language,e.ABAPLanguage);}if(e.legacyDateFormat){Q.setLegacyDateFormat(e.legacyDateFormat);}if(e.legacyDateCalendarCustomizing){Q.setLegacyDateCalendarCustomizing(e.legacyDateCalendarCustomizing);}if(e.legacyNumberFormat){Q.setLegacyNumberFormat(e.legacyNumberFormat);}if(e.legacyTimeFormat){Q.setLegacyTimeFormat(e.legacyTimeFormat);}if(typeof N==="object"){Q.addCustomCurrencies(N);}}sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);function q(e){jQuery.sap.getObject("sap-ushell-config.services.Container.adapter.config",0).bootTheme=l(e);}sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);function v(e){if(!e){sap.ui2.srvc.log.error("extractSystemThemeRoot: mandatory parameter oStartupServiceResult not supplied");}if(e.themeRoot){return e.themeRoot;}if(e.client){sap.ui2.srvc.log.warning("Theme root was not contained in startup service result. A fallback to /sap/public/bc/themes/~client-<client number> is used",null,"sap.ushell_abap.bootstrap");return"/sap/public/bc/themes/~client-"+e.client;}sap.ui2.srvc.log.error("extractSystemThemeRoot: Could not determine system theme root");}sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);function w(e){var P,T;if(e&&e.userProfile){P=e.userProfile.filter(function(N){return N.id==="THEME";});T=P.length?P[0]:{};if(T.value){return T.value;}}if(e&&e.theme){return e.theme;}return"";}sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);function y(T,S){if(T&&m(T)){return"";}return S;}sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);function z(e,S){var T;T=w(e);return{theme:T,root:y(T,S)};}sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);function A(S){var T,e;T=a.getUrlParameterValue("sap-theme");if(T){if(T.indexOf("@")>0){e=T.split("@",2);return{theme:e[0],root:e[1]};}return{theme:T,root:y(T,S)};}return undefined;}function C(){var U=sap.ui2.srvc.getParameterMap()["sap-theme"]&&sap.ui2.srvc.getParameterMap()["sap-theme"][0];if(U){return U;}return undefined;}function D(e){var T=e;var N=e.indexOf("@");if(N>=0){var O=T.slice(N+1);return t.isThemeRootSafe(O);}return true;}function F(o,S){var U,e={},N,O=C();u.addTime("applyTheme");if(O&&D(O)){U=A(S);N=U;sap.ui2.srvc.log.debug("theme: URL theme = '"+N.theme+"' theme root = '"+N.root+"'",null,"sap.ushell_abap.bootstrap");if(N.root){sap.ui.getCore().setThemeRoot(N.theme,N.root.replace(/\/?$/,"/UI5/"));}}else if(o){N=o;sap.ui2.srvc.log.debug("theme: startup service theme = '"+N.theme+"' theme root = '"+N.root+"'",null,"sap.ushell_abap.bootstrap");if(N.root){sap.ui.getCore().applyTheme(N.theme,N.root+"/UI5/");}else{sap.ui.getCore().applyTheme(N.theme);}}else{e.theme=jQuery.sap.getObject("sap-ui-config.theme");if(e.theme){e.root=jQuery.sap.getObject("sap-ui-config.themeRoots."+e.theme||"");if(!e.root){e.root=y(e.theme,S);}N={theme:e.theme,root:e.root};sap.ui2.srvc.log.debug("theme: html file theme = '"+N.theme+"' theme root = '"+N.root+"'",null,"sap.ushell_abap.bootstrap");}else{N={theme:"",root:""};sap.ui2.srvc.log.error("Could not determine theme",null,"sap.ushell_abap.bootstrap");}}q(N);return N;}function G(e){var P=sap.ui2.srvc.getParameterMap(),R=a.getUrlParameterValue("sap-locale",P),U={},N;N=jQuery.sap.getObject("sap-ushell-config.services.SupportTicket.config",0);if(N.enabled!==false){N.enabled=(e.isEmbReportingActive===true);}N=jQuery.sap.getObject("sap-ushell-config.services.ClientSideTargetResolution.adapter.config.services",0);N.targetMappings=e.services&&e.services.targetMappings;N=jQuery.sap.getObject("sap-ushell-config.services.LaunchPage.adapter.config.services",0);N.targetMappings=e.services&&e.services.targetMappings;N.launchPage=e.services&&e.services.pbFioriHome;N=jQuery.sap.getObject("sap-ushell-config.services.VisualizationDataProvider.adapter",0);N.module="sap.ushell_abap.adapters.abap.LaunchPageAdapter";N=jQuery.sap.getObject("sap-ushell-config.services.VisualizationDataProvider.adapter.config.services",0);N.targetMappings=e.services&&e.services.targetMappings;N.launchPage=e.services&&e.services.pbFioriHome;N=jQuery.sap.getObject("sap-ushell-config.services.PageBuilding.adapter.config.services",0);N.pageBuilding=e.services&&e.services.pbFioriHome;N=jQuery.sap.getObject("sap-ushell-config.services.Personalization.adapter.config.services",0);N.personalization=e.services&&e.services.personalization;N=jQuery.sap.getObject("sap-ushell-config.services.Personalization.config",0);N.seed=e.seed;if(!R){U={language:e.languageBcp47||e.language,ABAPLanguage:e.language,legacyDateFormat:e.dateFormat,legacyDateCalendarCustomizing:e.tislcal,legacyNumberFormat:e.numberFormat===""?" ":e.numberFormat,legacyTimeFormat:e.timeFormat};}F(o,S);n(U,e.currencyFormats);}function H(e,N){var O=h(),P=g(),R=j(O),Q=[R],T={},U={},V;var W=jQuery.sap.getObject("sap-ushell-config.services.AppState.config",0);var Y=jQuery.sap.getObject("sap-ushell-config.services.ClientSideTargetResolution.adapter.config",0);function Z(_,P){var a1=P.match(_);var b1=[];if(!a1){return;}b1=(a1[2]).toString().split("=");U[b1[0]]=b1[1];}function $(_,a1,U,b1,c1){if(a1&&a1[c1]&&U&&U[b1]){_[U[b1]]=a1[c1];}}if(f(O)){Z(/(\?|&)(sap-xapp-state=[A-Z0-9]+)/,O);Z(/(\?|&)(sap-intent-param=[A-Z0-9]+)/,O);Z(/(\?|&)(sap-system=[A-Z0-9]+)/,O);Z(/(\?|&|[/])(sap-iapp-state=[A-Z0-9]+)/,P);if(jQuery.sap.getObject("sap-ushell-config.ushell.spaces.enabled")){c.requestAllCatalogs(e,N);}V=s.requestDirectStart(e,N,R,U);W.initialAppStatesPromise=V.then(function(_){$(T,_,U,"sap-intent-param","iparState");$(T,_,U,"sap-iapp-state","iappState");$(T,_,U,"sap-xapp-state","xappState");W.initialAppStates=T;return Promise.resolve(T);});Y.initialSegmentPromise=V.then(function(_){if(_.targetMappings){return Promise.resolve([Q,_.targetMappings,_.systemAliases,_.urlTemplates]);}return Promise.resolve(null);});}else{W.initialAppStatesPromise=Promise.resolve({});Y.initialSegmentPromise=Promise.resolve(null);}}function I(){var P=new Promise(function(e,N){var R,O;O=function(){L.info("Direct application start: resolving component waitFor promise after shell renderer created event fired.");e();sap.ushell.Container.detachRendererCreatedEvent(O);};E.once("ShellNavigationInitialized").do(function(){R=sap.ushell.Container.getRenderer();if(R){L.info("Direct application start: resolving component waitFor promise immediately (shell renderer already created).");e();}else{sap.ushell.Container.attachRendererCreatedEvent(O);}});});return P;}function J(e){var U=a.getUrlParameterValue("sap-ushell-reload"),N;if(U){if(U==="X"||U==="true"){N=true;}else{N=false;}}if(N!==undefined){jQuery.sap.getObject("services.ShellNavigation.config",0,e).reload=N;}}function K(e,N,O){var P=h();i();G(e);N.forEach(function(Q){a.mergeConfig(window["sap-ushell-config"],Q,true);});J(window["sap-ushell-config"]);sap.ushell.bootstrap("abap",{abap:"sap.ushell_abap.adapters.abap",hana:"sap.ushell_abap.adapters.hana"}).done(function(){var Q=x.FrameLogonManager.getInstance();sap.ushell.Container.oFrameLogonManager=Q;}).always(function(){if(f(P)){var R,Q;window["sap-ushell-async-libs-promise-directstart"]=new Promise(function(T,U){R=T;Q=U;});window["sap-ushell-async-libs-promise-directstart"].catch(function(T){});sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function(T){T.resolveHashFragment("#"+h()).done(function(U){var V=sap.ui.require("sap/ushell/services/AppConfiguration");V.setCurrentApplication(U);if(U&&U.ui5ComponentName){sap.ushell.Container.getServiceAsync("Ui5ComponentLoader").then(function(W){W.createComponent(U,j(P),I()).done(function(Y){R({resolvedHashFragment:Y,dependenciesLoaded:true});}).fail(function(Y){Q(Y);});});}else{R({resolvedHashFragment:U,dependenciesLoaded:false});}}).fail(function(U){Q(U);});});}O();});}function M(U){var N=false,e,R;if(window["sap-ushell_abap-bootstrap-abap-noOData"]){N=true;}X.initXhrLogon(window["sap-ushell-config"]);e=s.requestStartupConfig().then(function(O){var P=h();jQuery.sap.getObject("sap-ushell-config.services.Container.adapter",0).config=O;var Q=jQuery.sap.getObject("sap-ushell-config.services.LaunchPage.adapter.config",0);var T=jQuery.sap.getObject("sap-ushell-config.services.ClientSideTargetResolution.adapter.config",0);if(jQuery.sap.getObject("sap-ushell-config.ushell.spaces.enabled")){jQuery.sap.setObject("sap-ushell-config.services.VisualizationDataProvider.adapter.config",Q);jQuery.sap.setObject("sap-ushell-config.services.NavigationDataProvider.adapter.config",T);}H(O,N);S=v(O);o=z(O,S);if(!C()&&o){L.debug("theme: load theme from startup service via window",null,"sap.ushell_abap.bootstrap");}if(k(P)){if(jQuery.sap.getObject("sap-ushell-config.ushell.spaces.enabled")){c.requestAllCatalogs(O,N);}else{p.requestPageSet(O,N);}}var V=s.requestFullTM(O,N);T.navTargetDataPromise=V;Q.compactTMPromise=V;return Promise.resolve(O);},function(O){L.error("start_up request failed: "+O,null,"sap.ushell_abap.bootstrap");return Promise.resolve({});});R=r().then(function(O){return Promise.resolve(O);},function(O){L.error("Could not load server configuration: "+O,null,"sap.ushell_abap.bootstrap.abap");return Promise.resolve([]);});Promise.all([e,R,U]).then(function(P){if(P[1]&&P.length){L.error("The usage of server side configuration files is deprecated.");}K.apply(null,P);});}B.start=M;B.bootstrap=K;B._getShellHash=h;B._getFullShellHash=g;B._createWaitForRendererCreatedPromise=I;return B;});