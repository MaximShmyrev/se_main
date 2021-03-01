/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['sap/collaboration/components/utils/CommonUtil','sap/collaboration/library','sap/ui/core/UIComponent','sap/ui/model/odata/ODataModel','jquery.sap.global','sap/ui/core/mvc/View','sap/ui/core/library'],function(C,l,U,O,q,V,c){"use strict";var F=l.FeedType;var a=c.mvc.ViewType;var A=l.AppType;var b=U.extend("sap.collaboration.components.fiori.feed.Component",{metadata:{properties:{width:{type:"sap.ui.core.CSSSize",defaultValue:""},height:{type:"sap.ui.core.CSSSize",defaultValue:""},oDataServiceUrl:{type:"sap.ui.core.URI",defaultValue:"/sap/opu/odata/sap/SM_INTEGRATION_SRV"},feedType:{type:"string"},groupIds:{type:"string"},object:{type:"object"}},aggregations:{},events:{}},init:function(){this.CollaborationFeedConstants={defaultWidth:'100%',defaultHeight:'100%'};this.setWidth(this.CollaborationFeedConstants.defaultWidth);this.setHeight(this.CollaborationFeedConstants.defaultHeight);this.mode=A.widget;this.oCommonUtil=new C();this.oLangBundle=this.oCommonUtil.getLanguageBundle();U.prototype.init.apply(this);},setSettings:function(s){this.setODataServiceUrl(s.oDataServiceUrl);this.setFeedType(s.feedType);this.setGroupIds(s.groupIds);this.setObject(s.object);},onBeforeRendering:function(){var d=true;try{this.bStopRendering=false;this.validateInputParameters();this.sODataServiceUrl=this.getODataServiceUrl();if(!this.oOdataModel){this.oOdataModel=new O(this.sODataServiceUrl,d);}}catch(e){q.sap.log.error(e,"","sap.collaboration.components.fiori.feed.Component.onBeforeRendering()");this.bStopRendering=true;this.oCommonUtil.displayError(e);}if(sap.ui.getCore().byId(this.getId()+"_oAppView")){sap.ui.getCore().byId(this.getId()+"_oAppView").destroy();}if(sap.ui.getCore().byId(this.getId()+"_oSplitAppView")){sap.ui.getCore().byId(this.getId()+"_oSplitAppView").destroy();}},onAfterRendering:function(){if(!this.bStopRendering){q.sap.log.debug("Feed Component properties:","","sap.collaboration.components.fiori.feed.Component.onAfterRendering()");q.sap.log.debug("width: "+this.getWidth());q.sap.log.debug("height: "+this.getHeight());q.sap.log.debug("oDataServiceUrl: "+this.getODataServiceUrl());q.sap.log.debug("feedType: "+this.getFeedType());q.sap.log.debug("groupIds: "+this.getGroupIds());q.sap.log.debug("object: "+JSON.stringify(this.getObject()));try{if(this.getMode()===A.widget){var o=sap.ui.view({id:this.getId()+"_oAppView",viewData:{controlId:this.getId(),odataModel:this.oOdataModel,appType:this.getMode(),feedType:this.getFeedType(),groupIds:this.getGroupIds(),object:this.getObject(),langBundle:this.oLangBundle},type:a.JS,viewName:"sap.collaboration.components.fiori.feed.app.App"});o.placeAt(this.getId());}else if(this.getMode()===A.split){var s=sap.ui.view({id:this.getId()+"_oSplitAppView",viewData:{controlId:this.getId(),odataModel:this.oOdataModel,appType:this.getMode(),object:this.getObject(),langBundle:this.oLangBundle},type:a.JS,viewName:"sap.collaboration.components.fiori.feed.splitApp.SplitApp"});s.placeAt(this.getId());}}catch(e){q.sap.log.error(e,"","sap.collaboration.components.fiori.feed.Component.onAfterRendering()");this.oCommonUtil.displayError(e);}}},render:function(r){r.write("<div id='"+this.getId()+"' style='width:"+this.getWidth()+";height:"+this.getHeight()+"'");r.write(">");r.write("</div>");},getMode:function(){return this.mode;},validateInputParameters:function(){var e;if(this.getFeedType()==F.object||this.getFeedType()==F.objectGroup){if(!this.getObject()){e=new Error("Object is undefined or null");q.sap.log.error(e,"","sap.collaboration.components.fiori.feed.Component.validateInputParameters()");throw e;}else if(!this.getObject().id){e=new Error("Missing Object ID");q.sap.log.error(e,"","sap.collaboration.components.fiori.feed.Component.validateInputParameters()");throw e;}}if(this.getFeedType()==F.object){if(!this.getObject().type){e=new Error("Missing Object Type");q.sap.log.error(e,"","sap.collaboration.components.fiori.feed.Component.validateInputParameters()");throw e;}}}});return b;});
