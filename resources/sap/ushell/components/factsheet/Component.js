// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/UIComponent","sap/ui/core/library"],function(U,c){"use strict";var V=c.mvc.ViewType;var C=U.extend("sap.ushell.components.factsheet.Component",{oMainView:null,metadata:{version:"1.86.3",library:"sap.ushell",dependencies:{libs:["sap.m","sap.ui.vbm","sap.suite.ui.commons","sap.ui.layout","sap.viz"],components:[]}},createContent:function(){var o=this.getComponentData();var s=(o&&o.startupParameters)||{};this.oMainView=sap.ui.view({type:V.JS,viewName:"sap.ushell.components.factsheet.views.ThingViewer",viewData:s,height:"100%"}).addStyleClass("ThingViewer");return this.oMainView;},exit:function(){window.console.log("On Exit of factsheet Component.js called : this.getView().getId()"+this.getId());},onExit:function(){window.console.log("On Exit of factsheet Component.js called : this.getView().getId()"+this.getId());}});jQuery.sap.setObject("factsheet.Component",C);return C;});
