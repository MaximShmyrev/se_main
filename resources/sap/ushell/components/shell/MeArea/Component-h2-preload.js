//@ui5-bundle sap/ushell/components/shell/MeArea/Component-h2-preload.js
// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.predefine('sap/ushell/components/shell/MeArea/Component',["sap/ui/core/UIComponent","sap/ushell/components/applicationIntegration/AppLifeCycle","sap/ushell/Config","sap/ushell/components/shell/MeArea/MeArea.controller"],function(U,A,C,M){"use strict";var _;function a(){if(!_){_=sap.ushell.Container.getRenderer("fiori2");}return _;}return U.extend("sap.ushell.components.shell.MeArea.Component",{metadata:{version:"1.86.3",library:"sap.ushell",dependencies:{libs:["sap.m"]}},createContent:function(){this._bIsMeAreaCreated=false;this.oMeAreaController=new M();this.oMeAreaController.onInit();var t=this;A.getElementsModel().createTriggers([{fnRegister:function(){if(!t.oActionsDoable){t.oActionsDoable=C.on("/core/shell/model/currentState/actions").do(function(b){if(b&&b.length>0){a().showHeaderEndItem(["meAreaHeaderButton"],true);}else{a().hideHeaderEndItem(["meAreaHeaderButton"],true);}});}},fnUnRegister:function(){if(!t.oActionsDoable){t.oActionsDoable.off();t.oActionsDoable=null;}}}],false,["blank-home","blank"]);sap.ui.getCore().getEventBus().publish("shell","meAreaCompLoaded",{delay:0});},exit:function(){if(this.oActionsDoable){this.oActionsDoable.off();}this.oEventListener.off();this.oMeAreaController.onExit();}});});
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/components/shell/MeArea/Component.js":["sap/ui/core/UIComponent.js","sap/ushell/Config.js","sap/ushell/components/applicationIntegration/AppLifeCycle.js","sap/ushell/components/shell/MeArea/MeArea.controller.js"],
"sap/ushell/components/shell/MeArea/MeArea.controller.js":["sap/base/Log.js","sap/m/StandardListItem.js","sap/m/library.js","sap/ui/Device.js","sap/ui/core/ElementMetadata.js","sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ui/performance/Measurement.js","sap/ushell/Config.js","sap/ushell/EventHub.js","sap/ushell/components/applicationIntegration/AppLifeCycle.js","sap/ushell/resources.js","sap/ushell/ui/QuickAccess.js","sap/ushell/ui/footerbar/AboutButton.js","sap/ushell/ui/footerbar/ContactSupportButton.js","sap/ushell/ui/footerbar/EndUserFeedback.js","sap/ushell/ui/launchpad/ActionItem.js"],
"sap/ushell/components/shell/MeArea/MeAreaPopover.fragment.xml":["sap/m/List.js","sap/m/Popover.js","sap/m/Title.js","sap/m/Toolbar.js","sap/ui/core/Fragment.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map