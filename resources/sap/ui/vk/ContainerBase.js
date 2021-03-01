/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control","sap/ui/core/IconPool","sap/ui/core/Popup","sap/ui/core/ResizeHandler","sap/ui/core/delegate/ScrollEnablement","sap/ui/Device","sap/m/library","./ContainerBaseRenderer","./MapContainerButtonType","./getResourceBundle"],function(q,v,C,I,P,R,S,D,m,a,M,g){"use strict";var b=C.extend("sap.ui.vk.ContainerBase",{metadata:{library:"sap.ui.vk",properties:{"showFullScreen":{type:"boolean",group:"Misc",defaultValue:true},"showSettings":{type:"boolean",group:"Misc",defaultValue:true},"showSelection":{type:"boolean",group:"Misc",defaultValue:true},"fullScreen":{type:"boolean",group:"Misc",defaultValue:false},"title":{type:"string",group:"Misc",defaultValue:""},"autoAdjustHeight":{type:"boolean",group:"Misc",defaultValue:false}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.vk.ContainerContent",multiple:true,singularName:"content"},"toolbar":{type:"sap.m.Toolbar",multiple:false,visibility:"hidden"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{"contentChange":{parameters:{selectedItemId:"string"}},"settingsPressed":{}}}});b.prototype.switchContent=function(c){this.setSelectedContent(c);this.rerender();};b.prototype.updateContainer=function(){this._contentChanged=true;this.rerender();};b.prototype.setSelectedContent=function(c){this._oSelectedContent=c;};b.prototype.getSelectedContent=function(){return this._oSelectedContent;};b.prototype.init=function(){this._selectionState="SINGLE";this._firstTime=true;this._aContentIcons=[];this._selectedContent=null;this._oSelectedContent=null;this._bSegmentedButtonSaveSelectState=false;this._oMenu=null;this._customButtons=[];var l=new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.High});var c=sap.m.ButtonType.Transparent;this._oFullScreenButton=new sap.m.OverflowToolbarButton({layoutData:l,type:c,icon:"sap-icon://full-screen",text:g().getText("CONTAINERBASE_FULLSCREEN"),tooltip:g().getText("CONTAINERBASE_FULLSCREEN"),press:function(){this._bSegmentedButtonSaveSelectState=true;this._toggleFullScreen();}.bind(this)});this._oSettingsButton=new sap.m.OverflowToolbarButton({layoutData:l.clone(),type:c,icon:"sap-icon://action-settings",text:g().getText("CONTAINERBASE_SETTINGS"),tooltip:g().getText("CONTAINERBASE_SETTINGS"),press:function(){this._bSegmentedButtonSaveSelectState=true;this.fireSettingsPressed();}.bind(this)});this._oSelectionButtonSingle=new sap.m.SegmentedButtonItem({icon:"sap-icon://map-container/selection-single",tooltip:g().getText("CONTAINERBASE_MENU_SINGLE"),press:this._handleSelection.bind(this,"SINGLE")});this._oSelectionButtonRectangle=new sap.m.SegmentedButtonItem({icon:"sap-icon://map-container/selection-rectangle",tooltip:g().getText("CONTAINERBASE_MENU_RECT"),press:this._handleSelection.bind(this,"RECT")});this._oSelectionButtonLasso=new sap.m.SegmentedButtonItem({icon:"sap-icon://map-container/selection-lasso",tooltip:g().getText("CONTAINERBASE_MENU_LASSO"),press:this._handleSelection.bind(this,"LASSO")});this._selectionMenu=new sap.m.SegmentedButton({items:[this._oSelectionButtonSingle,this._oSelectionButtonRectangle,this._oSelectionButtonLasso]});this._oPopup=new P({modal:true,shadow:false,autoClose:false});this._oContentSegmentedButton=new sap.m.SegmentedButton({layoutData:l.clone(),select:this._onContentButtonSelect.bind(this)});this._oContTitle=new sap.m.Label();this._oToolbar=new sap.m.OverflowToolbar({width:"auto"}).addStyleClass("sapUiVkContainerBaseToolbar");this.setAggregation("toolbar",this._oToolbar);this.sResizeListenerId=null;if(D.system.desktop){this.sResizeListenerId=R.register(this,q.proxy(this._performHeightChanges,this));}else{D.orientation.attachHandler(this._performHeightChanges,this);D.resize.attachHandler(this._performHeightChanges,this);}var d=[{name:"selection-lasso",unicode:"E000"},{name:"selection-rectangle",unicode:"E001"},{name:"selection-single",unicode:"E002"}],e="map-container",f="map-container";d.forEach(function(i){I.addIcon(i.name,e,f,i.unicode);});};b.prototype.exit=function(){if(this._oFullScreenButton){this._oFullScreenButton.destroy();this._oFullScreenButton=undefined;}if(this._oPopup){this._oPopup.destroy();this._oPopup=undefined;}if(this._oContentSegmentedButton){this._oContentSegmentedButton.destroy();this._oContentSegmentedButton=undefined;}if(this._oSelectedContent){this._oSelectedContent.destroy();this._oSelectedContent=undefined;}if(this._oToolbar){this._oToolbar.destroy();this._oToolbar=undefined;}if(D.system.desktop&&this.sResizeListenerId){R.deregister(this.sResizeListenerId);this.sResizeListenerId=null;}else{D.orientation.detachHandler(this._performHeightChanges,this);D.resize.detachHandler(this._performHeightChanges,this);}};b.prototype.setFullScreen=function(f){if(this._firstTime){return;}if(this.getFullScreen()==f){return;}var c=this.getProperty("fullScreen");if(c!==f){this._toggleFullScreen();}};b.prototype.onAfterRendering=function(){var t=this;if((this.sResizeListenerId===null)&&(D.system.desktop)){this.sResizeListenerId=R.register(this,q.proxy(this._performHeightChanges,this));}if(this.getAutoAdjustHeight()||this.getFullScreen()){q.sap.delayedCall(500,this,function(){t._performHeightChanges();});}this._firstTime=false;if(this.getSelectedContent()!==null){var c=this.getSelectedContent().getContent();if(c instanceof sap.ui.vbm.GeoMap||c instanceof sap.ui.vbm.AnalyticMap){if(this.getShowSelection()){if(this._selectionState==="LASSO"){c.setLassoSelection(true);}else if(this._selectionState==="RECT"){c.setRectangularSelection(true);}else if(this._selectionState==="SINGLE"){c.setRectangularSelection(false);c.setLassoSelection(false);}}}}};b.prototype.onBeforeRendering=function(){var t=this;if(t._contentChanged){t._contentChange();}t._oToolbar.getContent().forEach(function(e){var c=e.getId();var d=e["getPressed"]?e.getPressed():null;for(var i in t._customButtons){if(t._customButtons[i].button&&t._customButtons[i].button.getId()==c){t._customButtons[i].toggled=d;}}});t._oToolbar.removeAllContent();t._addToolbarContent();};b.prototype.setTitle=function(V){this._oContTitle.setText(V);this.setProperty("title",V,true);};b.prototype.addContent=function(o){this.addAggregation("content",o);this._contentChanged=true;};b.prototype.insertContent=function(o,i){this.insertAggregation("content",o,i);this._contentChanged=true;};b.prototype.updateContent=function(){this.updateAggregation("content");this._contentChanged=true;};b.prototype._toggleFullScreen=function(){var f=this.getProperty("fullScreen");var s;var h;var c;if(f){this._closeFullScreen();this.setProperty("fullScreen",false,true);c=this.getSelectedContent().getContent();s=c.getId();c.setWidth("100%");h=this._contentHeight[s];if(h){c.setHeight(h);}this.invalidate();}else{var o=this.getAggregation("content");this._contentHeight={};if(o){for(var i=0;i<o.length;i++){c=o[i].getContent();s=c.getId();if(q.isFunction(c.getHeight)){h=c.getHeight();}else{h=0;}this._contentHeight[s]=h;}}this._openFullScreen(true);this.setProperty("fullScreen",true,true);}var d=(f?"sap-icon://full-screen":"sap-icon://exit-full-screen");this._oFullScreenButton.setIcon(d);this._oFullScreenButton.focus();};b.prototype._openFullScreen=function(n){if((n!==null)&&(n===true)){this._oScrollEnablement=new S(this,this.getId()+"-wrapper",{horizontal:true,vertical:true});}this.$content=this.$();if(this.$content){this.$tempNode=q("<div></div>");this.$content.before(this.$tempNode);this._$overlay=q("<div id='"+q.sap.uid()+"'></div>");this._$overlay.addClass("sapUiVkContainerBaseOverlay");this._$overlay.append(this.$content);this._oPopup.setContent(this._$overlay);}else{q.sap.log.warn("Overlay: content does not exist or contains more than one child");}this._oPopup.open(200,undefined,undefined,q("body"));};b.prototype._closeFullScreen=function(){if(this._oScrollEnablement!==null){this._oScrollEnablement.destroy();this._oScrollEnablement=null;}this.$tempNode.replaceWith(this.$content);this._oToolbar.setDesign(sap.m.ToolbarDesign.Auto);this._oPopup.close();this._$overlay.remove();};b.prototype._performHeightChanges=function(){if(this.getAutoAdjustHeight()||this.getFullScreen()){var $=this.$();if(($.find(".sapUiVkContainerBaseToolbarArea").children()[0])&&($.find(".sapUiVkContainerBaseContentArea").children()[0])){var o=this.getSelectedContent().getContent();if(o.getDomRef().offsetWidth!==this.getDomRef().clientWidth){this.rerender();}}}};b.prototype._switchContent=function(c){var o=this._findContentById(c);this.setSelectedContent(o);this.fireContentChange({selectedItemId:c});this.rerender();};b.prototype._contentChange=function(){var c=this.getContent();this._oContentSegmentedButton.removeAllButtons();this._destroyButtons(this._aContentIcons);this._aContentIcons=[];if(c.length===0){this._oContentSegmentedButton.removeAllButtons();this._setDefaultOnSegmentedButton();this.switchContent(null);}if(c){for(var i=0;i<c.length;i++){var d=c[i].getContent();if(d.setWidth){d.setWidth("100%");}var B=new sap.m.SegmentedButtonItem({icon:c[i].getIcon(),tooltip:c[i].getTitle(),key:d.getId()});this._aContentIcons.push(B);this._oContentSegmentedButton.addItem(B);if(i===0){this.setSelectedContent(c[i]);}}}this._contentChanged=false;};b.prototype._onContentButtonSelect=function(e){var c=e.getParameter("key");this._switchContent(c);};b.prototype._findContentById=function(s){var c=null;var o=this.getAggregation("content");if(o){for(var i=0;!c&&i<o.length;i++){if(o[i].getContent().getId()===s){c=o[i];}}}return c;};b.prototype._addToolbarContent=function(){this._oToolbar.addContent(new sap.m.ToolbarSpacer());if(this._aContentIcons.length>1){this._oToolbar.addContent(this._oContentSegmentedButton);}if(this.getSelectedContent()!==null){var c=this.getSelectedContent().getContent();if(c instanceof sap.ui.vbm.GeoMap||c instanceof sap.ui.vbm.AnalyticMap){if(this.getShowSelection()){this._oToolbar.addContent(this._selectionMenu);}}}this._customButtons.forEach(function(i){if(i.visible){var s={type:sap.m.ButtonType.Transparent,layoutData:new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.High})};if("active"in i){s.enabled=i.active;}if("icon"in i){s.icon=i.icon;}if("activeIcon"in i){s.activeIcon=i.activeIcon;}if("text"in i){s.text=i.text;}if("tooltip"in i){s.tooltip=i.tooltip;}if("press"in i){s.press=i.press;}if("toggled"in i){s.pressed=i.toggled;}if("overflow"in i){s.overflow=i.overflow;}switch(i.type){case M.Click:i.button=s.overflow?new sap.m.OverflowToolbarButton(s):new sap.m.Button(s);break;default:i.button=s.overflow?new sap.m.OverflowToolbarToggleButton(s):new sap.m.ToggleButton(s);break;}this._oToolbar.addContent(i.button);}},this);if(this.getShowSettings()){this._oToolbar.addContent(this._oSettingsButton);}if(!D.system.phone&&this.getShowFullScreen()){this._oToolbar.addContent(this._oFullScreenButton);}};b.prototype._setDefaultOnSegmentedButton=function(){if(!this._bSegmentedButtonSaveSelectState){this._oContentSegmentedButton.setSelectedButton(null);}this._bSegmentedButtonSaveSelectState=false;};b.prototype._destroyButtons=function(c){c.forEach(function(B){B.destroy();});};b.prototype._handleSelection=function(c){var d=this.getSelectedContent().getContent();if(d instanceof sap.ui.vbm.GeoMap||d instanceof sap.ui.vbm.AnalyticMap){if(c==="LASSO"){d.setLassoSelection(true);this._selectionState=c;}else if(c==="RECT"){d.setRectangularSelection(true);this._selectionState=c;}else if(c==="SINGLE"){d.setRectangularSelection(false);d.setLassoSelection(false);this._selectionState=c;}}};return b;});
