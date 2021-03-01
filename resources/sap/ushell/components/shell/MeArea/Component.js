// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/UIComponent","sap/ushell/components/applicationIntegration/AppLifeCycle","sap/ushell/Config","sap/ushell/components/shell/MeArea/MeArea.controller"],function(U,A,C,M){"use strict";var _;function a(){if(!_){_=sap.ushell.Container.getRenderer("fiori2");}return _;}return U.extend("sap.ushell.components.shell.MeArea.Component",{metadata:{version:"1.86.3",library:"sap.ushell",dependencies:{libs:["sap.m"]}},createContent:function(){this._bIsMeAreaCreated=false;this.oMeAreaController=new M();this.oMeAreaController.onInit();var t=this;A.getElementsModel().createTriggers([{fnRegister:function(){if(!t.oActionsDoable){t.oActionsDoable=C.on("/core/shell/model/currentState/actions").do(function(b){if(b&&b.length>0){a().showHeaderEndItem(["meAreaHeaderButton"],true);}else{a().hideHeaderEndItem(["meAreaHeaderButton"],true);}});}},fnUnRegister:function(){if(!t.oActionsDoable){t.oActionsDoable.off();t.oActionsDoable=null;}}}],false,["blank-home","blank"]);sap.ui.getCore().getEventBus().publish("shell","meAreaCompLoaded",{delay:0});},exit:function(){if(this.oActionsDoable){this.oActionsDoable.off();}this.oEventListener.off();this.oMeAreaController.onExit();}});});
