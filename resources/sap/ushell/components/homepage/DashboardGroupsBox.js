// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Layout","sap/ui/base/Object","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ushell/ui/launchpad/Tile","sap/ushell/ui/launchpad/DashboardGroupsContainer","sap/ushell/Config","sap/ushell/EventHub","sap/ui/core/Component","sap/m/GenericTile","sap/ui/Device","sap/ushell/ui/launchpad/PlusTile","sap/ushell/resources","sap/ushell/ui/launchpad/TileContainer","sap/ushell/ui/launchpad/LinkTileWrapper","sap/m/Button","sap/ushell/ui/launchpad/AccessibilityCustomData","sap/ushell/ui/launchpad/GroupHeaderActions","sap/base/util/isEmptyObject","sap/ui/thirdparty/jquery","sap/ui/performance/Measurement","sap/ushell/renderers/fiori2/AccessKeysHandler"],function(L,b,F,a,c,D,C,E,d,G,e,P,r,T,f,B,A,g,h,q,M,j){"use strict";var k=b.extend("sap.ushell.components.homepage.DashboardGroupsBox",{metadata:{publicMethods:["createGroupsBox"]},constructor:function(){if(sap.ushell.components.homepage.getDashboardGroupsBox&&sap.ushell.components.homepage.getDashboardGroupsBox()){return sap.ushell.components.homepage.getDashboardGroupsBox();}sap.ushell.components.homepage.getDashboardGroupsBox=(function(v){return function(){return v;};}(this.getInterface()));this.oController=undefined;this.oGroupsContainer=undefined;this.isLinkPersonalizationSupported=sap.ushell.Container.getService("LaunchPage").isLinkPersonalizationSupported();sap.ui.getCore().getEventBus().subscribe("launchpad","actionModeActive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().subscribe("launchpad","actionModeInactive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().subscribe("launchpad","GroupHeaderVisibility",this._updateGroupHeaderVisibility,this);},destroy:function(){sap.ui.getCore().getEventBus().unsubscribe("launchpad","actionModeActive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad","actionModeInactive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad","GroupHeaderVisibility",this._updateGroupHeaderVisibility,this);if(this.oGroupsContainer){this.oGroupsContainer.destroy();}sap.ushell.components.homepage.getDashboardGroupsBox=undefined;},calculateFilter:function(){var i=[];var o;var s=this.oModel.getProperty("/homePageGroupDisplay"),l=this.oModel.getProperty("/tileActionModeActive");if(!l){if(s&&s==="tabs"){o=new F("isGroupSelected",a.EQ,true);}else{o=new F("isGroupVisible",a.EQ,true);}i.push(o);}return i;},createGroupsBox:function(o,m){this.oController=o;var t=this,i,l,n=function(v){var w,x;if(v&&(w=v.getDomRef())){x=w.querySelector(".sapUshellPlusTile");if(x){return x;}}return null;},p=function(v){var w=n(v.currentGroup),x=n(v.endGroup),y=(v.tiles[v.tiles.length-2]===v.item)||(v.endGroup.getTiles().length===0);if(y){t._hidePlusTile(x);}else{t._showPlusTile(x);}if(v.currentGroup!==v.endGroup){t._showPlusTile(w);}};i=function(){L.getLayoutEngine().setExcludedControl(P);L.getLayoutEngine().setReorderTilesCallback.call(L.layoutEngine,p);};l=function(){if(!L.isInited){L.init({getGroups:this.getGroups.bind(this),getAllGroups:t.getAllGroupsFromModel.bind(t),isTabBarActive:t.isTabBarActive.bind(t)}).done(i);e.media.attachHandler(function(){if(!this.bIsDestroyed){L.reRenderGroupsLayout(null);}},this,e.media.RANGESETS.SAP_STANDARD);var v=this.getDomRef();o.getView().sDashboardGroupsWrapperId=!h(v)&&v.parentNode?v.parentNode.id:"";}E.emit("CenterViewPointContentRendered");sap.ui.getCore().getEventBus().publish("launchpad","contentRendered");sap.ui.getCore().getEventBus().publish("launchpad","contentRefresh");this.getBinding("groups").filter(t.calculateFilter());};this.isTabBarActive=function(){return this.oModel.getProperty("/homePageGroupDisplay")==="tabs";};this.oModel=m;var s=this.calculateFilter(),u=C.last("/core/home/gridContainer");this.oGroupsContainer=new D("dashboardGroups",{displayMode:"{/homePageGroupDisplay}",afterRendering:l});if(u){sap.ui.require(["sap/ushell/ui/launchpad/GridContainer"],function(){t.oGroupsContainer.bindAggregation("groups",{filters:s,path:"/groups",factory:function(){var S=C.last("/core/home/sizeBehavior");var v=t._createGridContainer(o,m);v.setTileSizeBehavior(S);return v;}});});C.on("/core/home/sizeBehavior").do(function(v){t.oGroupsContainer.getAggregation("groups").forEach(function(w){w.setTileSizeBehavior(v);});});}else{this.oGroupsContainer.bindAggregation("groups",{filters:s,path:"/groups",factory:function(){return t._createTileContainer(o,m);}});}if(e.system.desktop){this.oGroupsContainer.addEventDelegate({onBeforeFastNavigationFocus:this._handleBeforeFastNavigationFocus,onsapskipback:this._handleSkip.bind(this,false),onsapskipforward:this._handleSkip.bind(this,true),onsaptabnext:function(v){if(t.oModel.getProperty("/tileActionModeActive")){if(q(document.activeElement).closest(".sapUshellTileContainerHeader").length){var w=q(document.activeElement).closest(".sapUshellTileContainer");var x=q(document.activeElement).hasClass("sapUshellContainerTitle");var y=w.find(".sapUshellHeaderActionButton");if(x&&!y.length||document.activeElement.id===y.last()[0].id){if(w.find(".sapUshellTile, .sapUshellLink, .sapFCard").is(":visible")){v.preventDefault();sap.ushell.components.ComponentKeysHandler.goToLastVisitedTile(w,true);return;}}if(y.length&&document.activeElement.id!==y.last()[0].id){return;}}var z=window.document.getElementById("sapUshellDashboardFooterDoneBtn");if(z){v.preventDefault();z.focus();return;}}v.preventDefault();if(q("#sapUshellFloatingContainerWrapper").is(":visible")&&(v.originalEvent.srcElement.id)!==""){sap.ui.getCore().getEventBus().publish("launchpad","shellFloatingContainerIsAccessible");}else{j.setIsFocusHandledByAnotherHandler(true);j.sendFocusBackToShell(v);}},onsaptabprevious:function(v){j.setIsFocusHandledByAnotherHandler(true);var w=q(":focus");if(t.oModel.getProperty("/tileActionModeActive")&&!w.hasClass("sapUshellTileContainerHeader")){var x=q(document.activeElement);if(x.hasClass("sapUshellTile")||x.hasClass("sapFCard")){v.preventDefault();var y=x.closest(".sapUshellTileContainer");var z=y.find(".sapUshellHeaderActionButton").filter(":visible").last();if(z.length>0){z.focus();}else{y.find(".sapUshellContainerTitle").focus();}}}}});}return this.oGroupsContainer;},_handleSkip:function(i,o){var l=window.document.getElementById("sapUshellDashboardFooterDoneBtn");if(l){if(l===document.activeElement&&!i){o.preventDefault();sap.ushell.components.ComponentKeysHandler.goToTileContainer();}else if(l!==document.activeElement&&i){o.preventDefault();l.focus();}}},_handleBeforeFastNavigationFocus:function(o){o.preventDefault();var i=window.document.getElementById("sapUshellDashboardFooterDoneBtn");if(i&&!o.forward){i.focus();}else{sap.ushell.components.ComponentKeysHandler.goToTileContainer();}},getAllGroupsFromModel:function(){return this.oModel.getProperty("/groups");},_createTileContainer:function(o){var t=this,i=new F("isTileIntentSupported",a.EQ,true),l=new T({headerText:"{title}",showEmptyLinksArea:{parts:["/tileActionModeActive","links/length","isGroupLocked","/isInDrag","/homePageGroupDisplay"],formatter:function(m,n,p,I,s){if(n){return true;}else if(p){return false;}return m||I&&s==="tabs";}},showMobileActions:{parts:["/tileActionModeActive"],formatter:function(I){return I&&!this.getDefaultGroup();}},showIcon:{parts:["/isInDrag","/tileActionModeActive"],formatter:function(I,m){return(this.getIsGroupLocked()&&(I||m));}},deluminate:{parts:["/isInDrag"],formatter:function(I){return this.getIsGroupLocked()&&I;}},transformationError:{parts:["/isInDrag","/draggedTileLinkPersonalizationSupported"],formatter:function(I,m){return I&&!m;}},showBackground:"{/tileActionModeActive}",tooltip:"{title}",tileActionModeActive:"{/tileActionModeActive}",ieHtml5DnD:o.getView().ieHtml5DnD,enableHelp:C.last("/core/extension/enableHelp"),groupId:"{groupId}",defaultGroup:"{isDefaultGroup}",isLastGroup:"{isLastGroup}",isGroupLocked:"{isGroupLocked}",isGroupSelected:"{isGroupSelected}",showHeader:true,showGroupHeader:"{showGroupHeader}",homePageGroupDisplay:"{/homePageGroupDisplay}",editMode:"{editMode}",supportLinkPersonalization:this.isLinkPersonalizationSupported,titleChange:function(m){sap.ui.getCore().getEventBus().publish("launchpad","changeGroupTitle",{groupId:m.getSource().getGroupId(),newTitle:m.getParameter("newTitle")});},showEmptyLinksAreaPlaceHolder:{parts:["links/length","/isInDrag","/homePageGroupDisplay"],formatter:function(n,I,s){return I&&s==="tabs"&&!n;}},showPlaceholder:{parts:["/tileActionModeActive","tiles/length"],formatter:function(m){return m&&!this.getIsGroupLocked();}},visible:{parts:["/tileActionModeActive","isGroupVisible","visibilityModes"],formatter:function(m,n,v){if(!v[m?1:0]){return false;}return n||m;}},hidden:{parts:["/tileActionModeActive","isGroupVisible"],formatter:function(I,m){return I&&!m;}},links:this._getLinkTemplate(),tiles:{path:"tiles",factory:this._itemFactory.bind(this),filters:[i]},add:function(m){t._handleAddTileToGroup(m);}});return l;},_createGridContainer:function(o){var i=sap.ui.require("sap/ushell/ui/launchpad/GridContainer"),l=new F("isTileIntentSupported",a.EQ,true);return new i({groupId:"{groupId}",showHeader:true,defaultGroup:"{isDefaultGroup}",isLastGroup:"{isLastGroup}",headerText:"{title}",showGroupHeader:"{showGroupHeader}",homePageGroupDisplay:"{/homePageGroupDisplay}",visible:{parts:["/tileActionModeActive","isGroupVisible","visibilityModes"],formatter:function(t,m,v){if(!v[t?1:0]){return false;}return m||t;}},isGroupLocked:"{isGroupLocked}",isGroupSelected:"{isGroupSelected}",editMode:"{editMode}",showBackground:"{/tileActionModeActive}",showIcon:{parts:["/isInDrag","/tileActionModeActive"],formatter:function(I,m){return(this.getIsGroupLocked()&&(I||m));}},tileActionModeActive:"{/tileActionModeActive}",supportLinkPersonalization:this.isLinkPersonalizationSupported,ieHtml5DnD:o.getView().ieHtml5DnD,enableHelp:C.last("/core/extension/enableHelp"),showEmptyLinksAreaPlaceHolder:{parts:["links/length","/isInDrag","/homePageGroupDisplay"],formatter:function(n,I,s){return I&&s==="tabs"&&!n;}},showEmptyLinksArea:{parts:["/tileActionModeActive","links/length","isGroupLocked","/isInDrag","/homePageGroupDisplay"],formatter:function(t,n,m,I,s){if(n){return true;}else if(m){return false;}return t||I&&s==="tabs";}},titleChange:function(m){sap.ui.getCore().getEventBus().publish("launchpad","changeGroupTitle",{groupId:m.getSource().getGroupId(),newTitle:m.getParameter("newTitle")});},tooltip:"{title}",links:this._getLinkTemplate(),tiles:{path:"tiles",factory:this._itemFactory.bind(this),filters:[l]}});},_getLinkTemplate:function(){var o=new F("isTileIntentSupported",a.EQ,true);if(!this.isLinkPersonalizationSupported){return{path:"links",templateShareable:true,template:new f({uuid:"{uuid}",tileCatalogId:"{tileCatalogId}",target:"{target}",isLocked:"{isLocked}",tileActionModeActive:"{/tileActionModeActive}",debugInfo:"{debugInfo}",ieHtml5DnD:this.oController.getView().ieHtml5DnD,tileViews:{path:"content",factory:function(i,l){return l.getObject();}},afterRendering:function(i){var l=q(this.getDomRef().getElementsByTagName("a"));l.attr("tabindex",-1);}}),filters:[o]};}return{path:"links",factory:function(i,l){var m=l.getObject().content[0];if(m&&m.bIsDestroyed){m=m.clone();l.getModel().setProperty(l.getPath()+"/content/0",m);}return m;},filters:[o]};},_itemFactory:function(i,o){var t=o.getProperty(o.sPath),l,m,n,p;if(t){if(t.isCard){l=t&&t.content;m=l&&l.length&&l[0];if(m&&m["sap.card"]){p=m;}else if(t.manifest){p={"sap.flp":t.manifest&&t.manifest["sap.flp"],"sap.card":{"type":"List"}};}else{return this._createErrorTile();}sap.ui.getCore().loadLibrary("sap.ui.integration");var s=sap.ui.requireSync("sap/ui/integration/widgets/Card");n=new s({manifest:p});}else{n=this._createTile();}t.controlId=n&&n.getId&&n.getId();}return n;},_createErrorTile:function(){return new c({tileViews:{path:"content",factory:function(){return new G({state:"Failed"});}}});},_createTile:function(){var t=new c({"long":"{long}",isDraggedInTabBarToSourceGroup:"{draggedInTabBarToSourceGroup}",uuid:"{uuid}",tileCatalogId:"{tileCatalogId}",isCustomTile:"{isCustomTile}",target:"{target}",isLocked:"{isLocked}",navigationMode:"{navigationMode}",tileActionModeActive:"{/tileActionModeActive}",showActionsIcon:"{showActionsIcon}",rgba:"{rgba}",debugInfo:"{debugInfo}",ieHtml5DnD:this.oController.getView().ieHtml5DnD,tileViews:{path:"content",factory:function(i,o){return o.getObject();}},coverDivPress:function(o){if(!o.oSource.getBindingContext().getObject().tileIsBeingMoved&&sap.ushell.components.homepage.ActionMode){sap.ushell.components.homepage.ActionMode._openActionsMenu(o);}},showActions:function(o){if(sap.ushell.components.homepage.ActionMode){sap.ushell.components.homepage.ActionMode._openActionsMenu(o);}},deletePress:[this.oController._dashboardDeleteTileHandler,this.oController],press:[this.oController.dashboardTilePress,this.oController]});var v=sap.ui.getCore().byId("viewPortContainer");t.addEventDelegate({onclick:function(){M.start("FLP:DashboardGroupsBox.onclick","Click on tile","FLP");M.start("FLP:OpenApplicationonClick","Open Application","FLP");function i(){M.end("FLP:DashboardGroupsBox.onclick");v.detachAfterNavigate(i);}v.attachAfterNavigate(i);}});return t;},_updateGroupHeaderVisibility:function(){var l=this.oGroupsContainer.getGroups(),m=this.oModel.getProperty("/tileActionModeActive"),n=this.oController.getView().oPage.getShowHeader(),o,v=0;for(var i=0;i<l.length;i++){if(l[i].getProperty("visible")){v++;if(o===undefined){o=i;}else{l[i].setShowGroupHeader(true);}}}if(o!==undefined){var V=m||(v===1&&!n);l[o].setShowGroupHeader(V);}},_handleActionModeChange:function(){var i=this.oModel.getProperty("/tileActionModeActive");if(i){this._addTileContainersContent();}else{L.reRenderGroupsLayout(null);}},_addTileContainersContent:function(){var l=this.oGroupsContainer.getGroups();for(var i=0;i<l.length;i++){var o=l[i];if(!o.getBeforeContent().length){o.addBeforeContent(this._getBeforeContent());}if(!o.getAfterContent().length){o.addAfterContent(this._getAfterContent());}if(!o.getHeaderActions().length){o.addHeaderAction(this._getGroupHeaderAction());}}},_handleAddGroupButtonPress:function(o){this.oController._addGroupHandler(o);this._addTileContainersContent();},_getBeforeContent:function(){var o=new B({icon:"sap-icon://add",text:r.i18n.getText("add_group_at"),visible:"{= !${isGroupLocked} && !${isDefaultGroup} && ${/tileActionModeActive}}",enabled:"{= !${/editTitle}}",press:[this._handleAddGroupButtonPress.bind(this)]});o.addStyleClass("sapUshellAddGroupButton");o.addCustomData(new A({key:"tabindex",value:"-1",writeToDom:true}));return o;},_getAfterContent:function(){var o=new B({icon:"sap-icon://add",text:r.i18n.getText("add_group_at"),visible:"{= ${isLastGroup} && ${/tileActionModeActive}}",enabled:"{= !${/editTitle}}",press:[this._handleAddGroupButtonPress.bind(this)]}).addStyleClass("sapUshellAddGroupButton");o.addStyleClass("sapUshellAddGroupButton");o.addCustomData(new A({key:"tabindex",value:"-1",writeToDom:true}));return o;},_getGroupHeaderAction:function(){return new g({content:this._getHeaderActions(),tileActionModeActive:"{/tileActionModeActive}",isOverflow:"{/isPhoneWidth}"}).addStyleClass("sapUshellOverlayGroupActionPanel");},_getHeaderActions:function(){var H=[];if(C.last("/core/home/gridContainer")){var o=new B({text:r.i18n.getText("AddTileBtn"),visible:"{= !${isGroupLocked}}",enabled:"{= !${/editTitle}}",press:this._handleAddTileToGroup.bind(this)}).addStyleClass("sapUshellHeaderActionButton");if(e.system.phone){o.setIcon("sap-icon://add");}H.push(o);}H.push(new B({text:{path:"isGroupVisible",formatter:function(i){return r.i18n.getText(i?"HideGroupBtn":"ShowGroupBtn");}},icon:{path:"isGroupVisible",formatter:function(i){if(e.system.phone){return i?"sap-icon://hide":"sap-icon://show";}return"";}},visible:"{= ${/enableHideGroups} && !${isGroupLocked} && !${isDefaultGroup}}",enabled:"{= !${/editTitle}}",press:function(i){var s=i.getSource(),l=s.getBindingContext();this.oController._changeGroupVisibility(l);}.bind(this)}).addStyleClass("sapUshellHeaderActionButton"));H.push(new B({text:{path:"removable",formatter:function(i){return r.i18n.getText(i?"DeleteGroupBtn":"ResetGroupBtn");}},icon:{path:"removable",formatter:function(i){if(e.system.phone){return i?"sap-icon://delete":"sap-icon://refresh";}return"";}},visible:"{= !${isDefaultGroup}}",enabled:"{= !${/editTitle}}",press:function(i){var s=i.getSource(),l=s.getBindingContext();this.oController._handleGroupDeletion(l);}.bind(this)}).addStyleClass("sapUshellHeaderActionButton"));return H;},_handleAddTileToGroup:function(o){if(document.toDetail){document.toDetail();}d.getOwnerComponentFor(this.oController.getView().parentComponent).getRouter().navTo("appfinder",{"innerHash*":"catalog/"+JSON.stringify({targetGroup:encodeURIComponent(o.getSource().getBindingContext().sPath)})});},_hidePlusTile:function(p){if(p){p.classList.add("sapUshellHidePlusTile");}},_showPlusTile:function(p){if(p){p.classList.remove("sapUshellHidePlusTile");}}});return k;});
