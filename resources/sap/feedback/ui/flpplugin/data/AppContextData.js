/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object","sap/base/Log","sap/ui/VersionInfo","../utils/Constants","../utils/Utils"],function(O,L,V,C,U){"use strict";return O.extend("sap.feedback.ui.flpplugin.data.AppContextData",{_dataV1:null,_dataV2:null,_oShellUIService:null,constructor:function(s){this._oShellUIService=s;},getData:function(f){return this._updateData().then(function(){if(f===C.E_DATA_FORMAT.version1){return this._dataV1;}else if(f===C.E_DATA_FORMAT.version2){return this._dataV2;}return null;}.bind(this));},_updateData:function(){return new Promise(function(r,R){this._resetData();this._collectData().then(function(c){this._setData(c);r();}.bind(this));}.bind(this));},_resetData:function(){this._dataV1={ui5Version:C.S_DEFAULT_VALUE,ui5Theme:C.S_DEFAULT_VALUE,fioriId:C.S_DEFAULT_VALUE,appTitle:C.S_DEFAULT_VALUE,language:C.S_DEFAULT_VALUE,componentId:C.S_DEFAULT_VALUE,appVersion:C.S_DEFAULT_VALUE,ach:C.S_DEFAULT_VALUE};this._dataV2={appFrameworkId:C.S_DEFAULT_VALUE,appFrameworkVersion:C.S_DEFAULT_VALUE,theme:C.S_DEFAULT_VALUE,appId:C.S_DEFAULT_VALUE,appTitle:C.S_DEFAULT_VALUE,languageTag:C.S_DEFAULT_VALUE,technicalAppComponentId:C.S_DEFAULT_VALUE,appVersion:C.S_DEFAULT_VALUE,appSupportInfo:C.S_DEFAULT_VALUE};},_setData:function(c){this._dataV1={ui5Version:c.appFrameworkVersion,ui5Theme:c.theme,fioriId:c.appId,appTitle:c.appTitle,language:c.languageTag,componentId:c.technicalAppComponentId,appVersion:c.appVersion,ach:c.appSupportInfo};this._dataV2=c;},_getFioriAppId:function(c){if(this._getIsLaunchpad(c)){return Promise.resolve(C.S_LAUNCHPAD_VALUE);}else{return c.getTechnicalParameter("sap-fiori-id").then(function(f){var a=f&&f.length>0?f[0]:C.S_DEFAULT_VALUE;if(!a||a.length===0){return C.S_DEFAULT_VALUE;}return a;});}},_getUserInfo:function(){return sap.ushell.Container.getService("UserInfo");},_getIsLaunchpad:function(c){return c.homePage;},_getAppTitle:function(c){var t=this._oShellUIService.getTitle();if(!t){t=c.getManifestEntry("sap.app").title;}return t||C.S_DEFAULT_VALUE;},_collectData:function(){return new Promise(function(r,R){var c=U.getCurrentApp();var o=null;if(U.isUI5Application(c)){var a=c.componentInstance;Promise.all([this._getFioriAppId(c),V.load()]).then(function(p){var f=p[0];var u=p[1];var A=this._getAppTitle(a);var b=this._getUserInfo();var d=b.getUser();if(a.getManifestEntry){o={};o.appFrameworkId=C.E_APP_FRAMEWORK.ui5;o.appFrameworkVersion=u.version;o.theme=d.getTheme();o.appId=f;o.appTitle=A;o.languageTag=d.getLanguage();o.technicalAppComponentId=a.getId();var e=a.getManifestEntry("sap.app");if(e){o.appVersion=e.applicationVersion.version||C.S_DEFAULT_VALUE;o.appSupportInfo=e.ach||C.S_DEFAULT_VALUE;}else{o.appVersion=C.S_DEFAULT_VALUE;o.appSupportInfo=C.S_DEFAULT_VALUE;}}else{L.warning("Cannot access manifest to collect context data for survey",null,C.S_PLUGIN_CTXTDATACTRL_NAME);}r(o);}.bind(this));}else{L.warning("App not an UI5 app.",null,C.S_PLUGIN_CTXTDATACTRL_NAME);}}.bind(this));}});});
