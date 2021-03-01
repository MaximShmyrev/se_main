// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/base/ManagedObject","sap/ui/core/Control","sap/m/library","sap/ui/core/Icon","sap/m/Text","sap/ushell/override","sap/ushell/resources","sap/ushell/ui/launchpad/PlusTile","sap/base/Log","sap/ushell/utils","sap/ui/Device","sap/ushell/ui/launchpad/TileContainerRenderer"],function(q,M,C,a,I,T,o,r,P,L,u,D){"use strict";var H=a.HeaderLevel;var b=C.extend("sap.ushell.ui.launchpad.TileContainer",{metadata:{library:"sap.ushell",properties:{scrollType:{type:"string",group:"Misc",defaultValue:"item"},animationSpeed:{type:"int",group:"Misc",defaultValue:500},groupId:{type:"string",group:"Misc",defaultValue:null},showHeader:{type:"boolean",group:"Misc",defaultValue:true},showPlaceholder:{type:"boolean",group:"Misc",defaultValue:true},defaultGroup:{type:"boolean",group:"Misc",defaultValue:false},isLastGroup:{type:"boolean",group:"Misc",defaultValue:false},headerText:{type:"string",group:"Misc",defaultValue:null},headerLevel:{type:"sap.m.HeaderLevel",group:"Misc",defaultValue:H.H2},groupHeaderLevel:{type:"sap.m.HeaderLevel",group:"Misc",defaultValue:H.H4},showGroupHeader:{type:"boolean",group:"Misc",defaultValue:true},homePageGroupDisplay:{type:"string",defaultValue:null},visible:{type:"boolean",group:"Misc",defaultValue:true},sortable:{type:"boolean",group:"Misc",defaultValue:true},showNoData:{type:"boolean",group:"Misc",defaultValue:false},noDataText:{type:"string",group:"Misc",defaultValue:null},isGroupLocked:{type:"boolean",group:"Misc",defaultValue:null},isGroupSelected:{type:"boolean",group:"Misc",defaultValue:false},editMode:{type:"boolean",group:"Misc",defaultValue:false},showBackground:{type:"boolean",group:"Misc",defaultValue:false},icon:{type:"string",group:"Misc",defaultValue:"sap-icon://locked"},showIcon:{type:"boolean",group:"Misc",defaultValue:false},deluminate:{type:"boolean",group:"Misc",defaultValue:false},showMobileActions:{type:"boolean",group:"Misc",defaultValue:false},enableHelp:{type:"boolean",group:"Misc",defaultValue:false},tileActionModeActive:{type:"boolean",group:"Misc",defaultValue:false},ieHtml5DnD:{type:"boolean",group:"Misc",defaultValue:false},showEmptyLinksArea:{type:"boolean",group:"Misc",defaultValue:false},showEmptyLinksAreaPlaceHolder:{type:"boolean",group:"Misc",defaultValue:false},hidden:{type:"boolean",group:"Misc",defaultValue:false},transformationError:{type:"boolean",group:"Misc",defaultValue:false},supportLinkPersonalization:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{tiles:{type:"sap.ui.core.Control",multiple:true,singularName:"tile"},links:{type:"sap.ui.core.Control",multiple:true,singularName:"link"},beforeContent:{type:"sap.ui.core.Control",multiple:true,singularName:"beforeContent"},afterContent:{type:"sap.ui.core.Control",multiple:true,singularName:"afterContent"},footerContent:{type:"sap.ui.core.Control",multiple:true,singularName:"footerContent"},headerActions:{type:"sap.ui.core.Control",multiple:true,singularName:"headerAction"}},events:{afterRendering:{},add:{},titleChange:{}}}});b.prototype.init=function(){this.bIsFirstTitleChange=true;this._sDefaultValue=r.i18n.getText("new_group_name");this._sOldTitle="";this.oNoLinksText=new T({text:r.i18n.getText("emptyLinkContainerInEditMode")}).addStyleClass("sapUshellNoLinksAreaPresentTextInner");this.oTransformationErrorText=new T({text:r.i18n.getText("transformationErrorText")}).addStyleClass("sapUshellTransformationErrorText");this.oTransformationErrorIcon=new I({src:"sap-icon://message-error"}).addStyleClass("sapUshellTransformationErrorIcon");this.oIcon=new I({src:this.getIcon()});this.oIcon.addStyleClass("sapUshellContainerIcon");this.oPlusTile=new P({groupId:this.getGroupId(),enableHelp:this.getEnableHelp(),press:[this.fireAdd,this]});this.oPlusTile.setParent(this);if(sap.ushell.Container!==undefined){if(sap.ushell.Container.getService("LaunchPage").isLinkPersonalizationSupported()){b.prototype.isLinkPersonalizationOveride();}}};b.prototype.onAfterRendering=function(){var t=window.document.getElementById(this.getId()+"-titleText");if(t){t.addEventListener("click",function(){var E=this.getModel()&&this.getModel().getProperty("/enableRenameLockedGroup"),d=(E||!this.getIsGroupLocked())&&!this.getDefaultGroup()&&this.getTileActionModeActive();this.setEditMode(d);}.bind(this));}var c=this.getTiles().filter(function(d){return d.isA("sap.ui.integration.widgets.Card");});this._resizeCards(c);var e=sap.ui.getCore().getEventBus();e.publish("launchpad","GroupHeaderVisibility");this.fireAfterRendering();};b.prototype.getTransformationErrorText=function(){return this.oTransformationErrorText;};b.prototype.getTransformationErrorIcon=function(){return this.oTransformationErrorIcon;};b.prototype.getNoLinksText=function(){return this.oNoLinksText;};b.prototype.setTransformationError=function(t){this.setProperty("transformationError",t,true);if(t){this.$().find(".sapUshellTransformationError").show();}else{this.$().find(".sapUshellTransformationError").hide();}this.$().find(".sapUshellNoLinksAreaPresent").toggleClass("sapUshellNoLinksAreaPresentError",t);return this;};b.prototype.updateAggregation=o.updateAggregation;b.prototype.setNoDataText=function(n){this.setProperty("noDataText",n,true);if(this.getShowNoData()){this.$().find(".sapUshellNoFilteredItems").text(n);}return this;};b.prototype.setGroupId=function(v){this.setProperty("groupId",v,true);if(this.oPlusTile){this.oPlusTile.setGroupId(v);}return this;};b.prototype.setHeaderText=function(h){this.setProperty("headerText",h,true);this.$().find(".sapUshellContainerTitle").text(h);return this;};b.prototype.setVisible=function(v){this.setProperty("visible",v,true);this.toggleStyleClass("sapUshellHidden",!v);return this;};b.prototype.setShowMobileActions=function(s){var S=true;if(this.oHeaderButton){this.oHeaderButton.setVisible(s);}else if(s){S=false;}this.setProperty("showMobileActions",s,S);};b.prototype.setShowIcon=function(s){this.setProperty("showIcon",s,true);this.$().find(".sapUshellContainerIcon").toggleClass("sapUshellContainerIconHidden",!s);};b.prototype.setDeluminate=function(d){this.setProperty("deluminate",d,true);this.toggleStyleClass("sapUshellDisableLockedGroupDuringDrag",d);return this;};b.prototype.setHidden=function(h){this.setProperty("hidden",!!h,true);this.toggleStyleClass("sapUshellTileContainerEditModeHidden",!!h);return this;};b.prototype.groupHasTiles=function(){var p="",t=this.getTiles(),l=[];if(this.getBindingContext()){p=this.getBindingContext().sPath;t=this.getModel().getProperty(p).tiles;}return u.groupHasVisibleTiles(t,l);};b.prototype.getInnerContainerDomRef=function(){return this.$().find(".sapUshellTilesContainer-sortable")[0];};b.prototype.getInnerContainersDomRefs=function(){var d=this.getDomRef();if(!d){return null;}return[d.querySelector(".sapUshellTilesContainer-sortable"),d.querySelector(".sapUshellLineModeContainer")];};b.prototype.setEditMode=function(v){if(v){this.addStyleClass("sapUshellEditing");this._startEdit();}else{this.setProperty("editMode",v,false);this.removeStyleClass("sapUshellEditing");}};b.prototype.isLinkPersonalizationOveride=function(){b.prototype.updateLinks=function(R){var g=this.getParent(),t=g&&g.getDisplayMode&&g.getDisplayMode()==="tabs";if(t&&!this.getTileActionModeActive()){g.removeLinksFromUnselectedGroups();}if(this.getLinks().length>0){this.removeAllLinks();}M.prototype.updateAggregation.call(this,"links");};b.prototype.destroyLinks=function(R){L.debug("link is destroyed because: "+R,null,"sap.ushell.ui.launchpad.TileContainer");};};b.prototype.setShowEmptyLinksArea=function(v){this.setProperty("showEmptyLinksArea",v,true);this.toggleStyleClass("sapUshellLinksAreaHidden",!v);};b.prototype.setShowEmptyLinksAreaPlaceHolder=function(v){this.setProperty("showEmptyLinksArea",v,true);this.toggleStyleClass("sapUshellTileContainerEditMode",v);this.toggleStyleClass("sapUshellTileContainerTabsModeEmptyLinksArea",v);this.toggleStyleClass("sapUshellEmptyLinksAreaPlaceHolder",!v);};b.prototype._resizeCards=function(c){var d,m,s=5.5,t=0.4375,e,f,g,h;for(var i=0;i<c.length;i++){d=c[i];m=d.getManifest();e=m["sap.flp"].rows;f=m["sap.flp"].columns;g=f*s+(f-3)*t+"rem";h=e*s+(e-1)*t+"rem";d.setHeight(h);d.setWidth(g);}};b.prototype._startEdit=function(){var t=this;if(this.getModel()&&!this.getModel().getProperty("/editTitle")){this.getModel().setProperty("/editTitle",true,false);}if(!this.oEditInputField){sap.ui.require(["sap/m/Input"],function(c){t.setProperty("editMode",true,false);t.oEditInputField=new c({placeholder:t._sDefaultValue,value:t.getHeaderText()}).addStyleClass("sapUshellTileContainerTitleInput");t.oEditInputField.addEventDelegate({onAfterRendering:function(){setTimeout(function(){if(t.oEditInputField.$().is(":visible")){setTimeout(function(){t.oEditInputField.$().find("input").focus();},100);var w=q(window).height(),j=t.getDomRef(),g=j.offsetHeight,d=j.getBoundingClientRect().top,e=j.offsetTop;if(g+d>w){q(".sapUshellDashboardView section").stop().animate({scrollTop:e},0);}}},100);},onfocusout:function(){t._stopEdit();q.proxy(t.setEditMode,t,false)();},onsapenter:function(e){t._stopEdit();q.proxy(t.setEditMode,t,false)();setTimeout(function(){var d=e.srcControl,j=d.$().prev();j.focus();},0);}});t.oEditInputField.setValue(t.getHeaderText());});}else{this.oEditInputField.setValue(this.getHeaderText());t.setProperty("editMode",true,false);}this._sOldTitle=this._sDefaultValue;if(D.system.phone){setTimeout(function(){var e=sap.ui.getCore().getEventBus();e.publish("launchpad","scrollToGroup",{group:t,groupChanged:false,focus:false});},100);}};b.prototype._stopEdit=function(){var c=this.getHeaderText();var n=this.oEditInputField.getValue(),h;n=n.substring(0,256).trim()||this._sDefaultValue;h=n!==c;if(this.bIsFirstTitleChange&&n===this.oEditInputField.getPlaceholder()){h=true;}this.bIsFirstTitleChange=false;if(this.getModel()&&this.getModel().getProperty("/editTitle")){this.getModel().setProperty("/editTitle",false,false);}if(!this._sOldTitle){this._sOldTitle=c;this.setHeaderText(c);}else if(h){this.fireTitleChange({newTitle:n});this.setHeaderText(n);}};b.prototype.exit=function(){if(this.oPlusTile){this.oPlusTile.destroy();}if(this.oHeaderButton){this.oHeaderButton.destroy();}if(this.oActionSheet){this.oActionSheet.destroy();}if(C.prototype.exit){C.prototype.exit.apply(this,arguments);}};return b;});
