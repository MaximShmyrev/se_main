/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/UIComponent","sap/fe/core/RouterProxy","sap/fe/core/AppStateHandler","sap/base/Log","sap/fe/core/controllerextensions/EditFlow","sap/fe/core/support/Diagnostics","sap/ui/model/json/JSONModel","sap/fe/core/library","sap/fe/core/helpers/SemanticDateOperators","sap/ui/core/CustomizingConfiguration","sap/ui/core/Component","sap/fe/core/TemplateComponent","sap/fe/core/helpers/ModelHelper"],function(U,R,A,L,E,D,J,l,S,C,a,T,M){"use strict";var g=C.getControllerExtension;C.getControllerExtension=function(s,o){var d=b(o),e=d&&d.getId(),r=g.call(C,s,e);return r;};function b(o){var s=o&&typeof o==="string"?o:o&&a.getOwnerIdFor(o);var d=s&&a.get(s);if(d instanceof T){d=d.oAppComponent;}return d;}var N={FCL:{VIEWNAME:"sap.fe.templates.RootContainer.view.Fcl",ROUTERCLASS:"sap.f.routing.Router"},NAVCONTAINER:{VIEWNAME:"sap.fe.templates.RootContainer.view.NavContainer",ROUTERCLASS:"sap.m.routing.Router"}};var c=U.extend("sap.fe.core.AppComponent",{metadata:{config:{fullWidth:true},manifest:{"sap.ui5":{services:{resourceModel:{factoryName:"sap.fe.core.services.ResourceModelService","startup":"waitFor","settings":{"bundles":["sap.fe.core.messagebundle"],"modelName":"sap.fe.i18n"}},routingService:{factoryName:"sap.fe.core.services.RoutingService",startup:"waitFor"},shellServices:{factoryName:"sap.fe.core.services.ShellServices",startup:"waitFor"},ShellUIService:{factoryName:"sap.ushell.ui5service.ShellUIService"},navigationService:{factoryName:"sap.fe.core.services.NavigationService",startup:"waitFor"},environmentCapabilities:{factoryName:"sap.fe.core.services.EnvironmentService",startup:"waitFor"},asyncComponentService:{factoryName:"sap.fe.core.services.AsyncComponentService",startup:"waitFor"}},rootView:{viewName:N.NAVCONTAINER.VIEWNAME,type:"XML",async:true,id:"appRootView"},routing:{config:{controlId:"appContent",routerClass:N.NAVCONTAINER.ROUTERCLASS,viewType:"XML",controlAggregation:"pages",async:true,containerOptions:{propagateModel:true}}}}},designtime:"sap/fe/core/designtime/AppComponent.designtime",library:"sap.fe.core"},_isFclEnabled:function(){var m=this.getMetadata().getManifestEntry("/sap.ui5",true);return N.FCL.VIEWNAME===m.rootView.viewName;},getRouterProxy:function(){return this._oRouterProxy;},getAppStateHandler:function(){return this._oAppStateHandler;},getRootViewController:function(){return this.getRootControl().getController();},getRootContainer:function(){return this.getRootControl().getContent()[0];},init:function(){this.setModel(new J({editMode:l.EditMode.Display,isEditable:false,draftStatus:l.DraftStatus.Clear,busy:false,busyLocal:{},pages:{}}),"ui");var i=new J({pages:{}});M.enhanceInternalJSONModel(i);this.setModel(i,"internal");this.bInitializeRouting=this.bInitializeRouting!==undefined?this.bInitializeRouting:true;this._oRouterProxy=new R();this._oAppStateHandler=new A(this);this._oDiagnostics=new D();var t=this;var m=this.getModel();this.initErrorMessage=null;if(m){m.getMetaModel().requestObject("/$EntityContainer/").catch(function(e){t.initErrorMessage=e.message;});}var o=this.getMetadata().getManifestEntry("/sap.ui5",true);if(o.rootView.viewName===N.FCL.VIEWNAME&&o.routing.config.routerClass===N.FCL.ROUTERCLASS){L.info('Rootcontainer: "'+N.FCL.VIEWNAME+'" - Routerclass: "'+N.FCL.ROUTERCLASS+'"');}else if(o.rootView.viewName===N.NAVCONTAINER.VIEWNAME&&o.routing.config.routerClass===N.NAVCONTAINER.ROUTERCLASS){L.info('Rootcontainer: "'+N.NAVCONTAINER.VIEWNAME+'" - Routerclass: "'+N.NAVCONTAINER.ROUTERCLASS+'"');}else if(o.rootView.viewName.indexOf("sap.fe")!==-1){throw Error("\nWrong configuration for the couple (rootView/routerClass) in manifest file.\n"+"Current values are :("+o.rootView.viewName+"/"+o.routing.config.routerClass+")\n"+"Expected values are \n"+"\t - ("+N.NAVCONTAINER.VIEWNAME+"/"+N.NAVCONTAINER.ROUTERCLASS+")\n"+"\t - ("+N.FCL.VIEWNAME+"/"+N.FCL.ROUTERCLASS+")");}else{L.info('Rootcontainer: "'+o.rootView.viewName+'" - Routerclass: "'+N.NAVCONTAINER.ROUTERCLASS+'"');}S.addSemanticDateOperators();U.prototype.init.apply(t,arguments);},onServicesStarted:function(){var t=this;function f(){if(t.initErrorMessage){var r=sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");t.getRootViewController().displayMessagePage(r.getText("C_APP_COMPONENT_SAPFE_APPSTART_TECHNICAL_ISSUES"),{title:r.getText("C_COMMON_SAPFE_ERROR"),description:t.initErrorMessage,FCLLevel:0});}else{if(t.getRootViewController().attachRouteMatchers){t.getRootViewController().attachRouteMatchers();}t.getRouter().initialize();t.getRouterProxy().init(t,t._isFclEnabled());}}if(this.bInitializeRouting){this.getRoutingService().initializeRouting(this).then(function(){if(t.getRootViewController()){f();}else{t.getRootControl().attachAfterInit(function(){f();});}}).catch(function(e){L.error("cannot cannot initialize routing: "+e);});}},exit:function(){this._oRouterProxy.exit();this.getModel("ui").destroy();},getMetaModel:function(){return this.getModel().getMetaModel();},getDiagnostics:function(){return this._oDiagnostics;},destroy:function(){var m=this.oModels[undefined];var h=jQuery.extend({},m.oRequestor.mHeaders);U.prototype.destroy.apply(this,arguments);m.oRequestor.mHeaders=h;}});return c;});
