/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object","sap/base/util/extend","../utils/Constants","../data/AppContextData","../data/PushContextData"],function(O,e,C,A,P){"use strict";return O.extend("sap.feedback.ui.flpplugin.controller.ContextDataController",{_oConfig:{},_oShellUIService:null,_oAppContextData:null,_oPushContextData:null,_oSessionData:null,constructor:function(c,s){this._oConfig=c;this._oShellUIService=s;},init:function(){if(this._oConfig&&this._oShellUIService){this._oAppContextData=new A(this._oShellUIService);this._oPushContextData=new P();this._collectSessionContextData(this._oConfig.getTenantId(),this._oConfig.getTenantRole());}else{this._resetContextData(C.E_PLUGIN_STATE.init);}},updateContextData:function(t){return new Promise(function(r,R){this._resetContextData(C.E_PLUGIN_STATE.update);var d=this._oConfig.getDataFormat();this._setSessionContextData(d,t);this._collectAppContextData(d).then(function(){r();},function(a){R();});}.bind(this));},setPushContextData:function(p){if(!sap.qtx){sap.qtx={};}sap.qtx.push=p;},getContextDataAsUrlParameter:function(){var s="";if(this._oConfig.getDataFormat()===C.E_DATA_FORMAT.version1){s+="?Q_Language="+encodeURIComponent(sap.qtxAppContext.language);s+="&language="+encodeURIComponent(sap.qtxAppContext.language);s+="&ui5Version="+encodeURIComponent(sap.qtxAppContext.ui5Version);s+="&ui5Theme="+encodeURIComponent(sap.qtxAppContext.ui5Theme);s+="&fioriId="+encodeURIComponent(sap.qtxAppContext.fioriId);s+="&appVersion="+encodeURIComponent(sap.qtxAppContext.appVersion);s+="&componentId="+encodeURIComponent(sap.qtxAppContext.componentId);s+="&appTitle="+encodeURIComponent(sap.qtxAppContext.appTitle);s+="&ach="+encodeURIComponent(sap.qtxAppContext.ach);s+="&tenantId="+encodeURIComponent(sap.qtxAppContext.tenantId);s+="&tenantRole="+encodeURIComponent(sap.qtxAppContext.tenantRole);s+="&pluginState="+encodeURIComponent(sap.qtxAppContext.pluginState);}else if(this._oConfig.getDataFormat()===C.E_DATA_FORMAT.version2){s+="?Q_Language="+encodeURIComponent(sap.qtx.appcontext.languageTag);s+="&language="+encodeURIComponent(sap.qtx.appcontext.languageTag);s+="&appFrameworkId="+encodeURIComponent(sap.qtx.appcontext.appFrameworkId);s+="&appFrameworkVersion="+encodeURIComponent(sap.qtx.appcontext.appFrameworkVersion);s+="&theme="+encodeURIComponent(sap.qtx.appcontext.theme);s+="&appId="+encodeURIComponent(sap.qtx.appcontext.appId);s+="&appVersion="+encodeURIComponent(sap.qtx.appcontext.appVersion);s+="&technicalAppComponentId="+encodeURIComponent(sap.qtx.appcontext.technicalAppComponentId);s+="&appTitle="+encodeURIComponent(sap.qtx.appcontext.appTitle);s+="&appSupportInfo="+encodeURIComponent(sap.qtx.appcontext.appSupportInfo);if(sap.qtx.session){s+="&tenantId="+encodeURIComponent(sap.qtx.session.tenantId);s+="&tenantRole="+encodeURIComponent(sap.qtx.session.tenantRole);}if(sap.qtx.debug){s+="&pluginState="+encodeURIComponent(sap.qtx.debug.pluginState);}}if(sap.qtx&&sap.qtx.targetIntercept){s+="&targetIntercept="+encodeURIComponent(sap.qtx.targetIntercept);}return s;},_collectSessionContextData:function(t,r){this._oSessionData={tenantId:t,tenantRole:r};},_setSessionContextData:function(d,t){if(d===C.E_DATA_FORMAT.version1){if(!sap.qtxAppContext){sap.qtxAppContext={};}sap.qtxAppContext=e(sap.qtxAppContext,this._oSessionData);}else if(d===C.E_DATA_FORMAT.version2){if(!sap.qtx){sap.qtx={};}sap.qtx.session=this._oSessionData;}sap.qtx.targetIntercept=t;},_resetContextData:function(p){sap.qtxAppContext={};sap.qtxAppContext.pluginState=p;if(!sap.qtx){sap.qtx={};}sap.qtx.appcontext={};sap.qtx.push={};sap.qtx.debug={pluginState:p};},_collectAppContextData:function(d){return this._oAppContextData.getData(d).then(function(c){this._setAppContextData(c,d,C.E_PLUGIN_STATE.update);}.bind(this));},_setAppContextData:function(c,d,p){if(d===C.E_DATA_FORMAT.version1){sap.qtxAppContext=e(sap.qtxAppContext,c);sap.qtxAppContext.pluginState=p;}else if(d===C.E_DATA_FORMAT.version2){sap.qtx.appcontext=c;sap.qtx.debug={pluginState:p};}}});});
