sap.ui.define(["sap/ui/core/Core","sap/gantt/library","sap/ui/base/ManagedObjectObserver","sap/ui/core/Item","sap/ui/base/Object","sap/base/Log","sap/m/library","sap/m/OverflowToolbar","sap/m/OverflowToolbarLayoutData","sap/m/ToolbarSpacer","sap/m/FlexBox","sap/m/OverflowToolbarButton","sap/m/SegmentedButton","sap/m/SegmentedButtonItem","sap/m/Select","sap/m/ViewSettingsDialog","sap/m/ViewSettingsCustomTab","sap/m/CheckBox","sap/m/Slider","sap/m/Popover","../control/AssociateContainer","./ContainerToolbarRenderer"],function(C,l,M,a,B,L,m,O,b,T,F,c,S,d,e,V,f,g,h,P,A){"use strict";var G=l.simple.GanttChartWithTableDisplayType,j=l.simple.ContainerToolbarPlaceholderType,k=m.OverflowToolbarPriority,n=m.FlexDirection,p=m.ButtonType,q=m.PlacementType;var r=O.extend("sap.gantt.simple.ContainerToolbar",{metadata:{library:"sap.gantt",properties:{showBirdEyeButton:{type:"boolean",defaultValue:false},showDisplayTypeButton:{type:"boolean",defaultValue:false},showLegendButton:{type:"boolean",defaultValue:false},showSettingButton:{type:"boolean",defaultValue:true},showTimeZoomControl:{type:"boolean",defaultValue:true},zoomControlType:{type:"sap.gantt.config.ZoomControlType",defaultValue:l.config.ZoomControlType.SliderWithButtons},stepCountOfSlider:{type:"int",defaultValue:10},infoOfSelectItems:{type:"object[]",defaultValue:[]},zoomLevel:{type:"int",defaultValue:0},alignCustomContentToRight:{type:"boolean",defaultValue:false}},aggregations:{settingItems:{type:"sap.gantt.config.SettingItem",multiple:true},legendContainer:{type:"sap.ui.core.Control",multiple:false,visibility:"public"}},events:{zoomStopChange:{parameters:{index:{type:"int"},selectedItem:{type:"sap.ui.core.Item"}}},birdEyeButtonPress:{},displayTypeChange:{parameters:{displayType:{type:"sap.gantt.simple.GanttChartWithTableDisplayType"}}}}}});r.prototype.init=function(){O.prototype.init.apply(this,arguments);this.mSettingsConfig={};this._oRb=C.getLibraryResourceBundle("sap.gantt");this.oObserver=new M(this.observeChanges.bind(this));this.oObserver.observe(this,{properties:["showBirdEyeButton","showLegendButton","showTimeZoomControl","showSettingButton","zoomControlType","infoOfSelectItems","showDisplayTypeButton","alignCustomContentToRight"],aggregations:["content"]});this.bShallUpdateContent=true;this.bZoomControlTypeChanged=false;this.bContentAlignChanged=false;this._bSuppressZoomStopChange=false;this.oToolbarSpacer=new T(this.getId()+"-toolbarSpacer");};r.prototype.observeChanges=function(o){if(!this.bShallUpdateContent){this.bShallUpdateContent=true;this.bZoomControlTypeChanged=o.name==="zoomControlType";this.bContentAlignChanged=o.name==="alignCustomContentToRight";}};r.prototype.exit=function(){this.oObserver.disconnect();this._destroyIfExists([this._oDisplayTypeSegmentedButton,this._oBirdEyeButton,this._oSelect,this._oTimeZoomFlexBox,this._oSettingsDialog,this._oSettingsButton,this._oLegendPop,this._oLegendButton]);O.prototype.exit.apply(this,arguments);};r.prototype.applySettings=function(s,i){s=s||{};if(!s.settingItems){s.settingItems=l.config.DEFAULT_TOOLBAR_SETTING_ITEMS.map(function(o){return o.clone();});}O.prototype.applySettings.apply(this,arguments);this._createControlsOnly();return this;};r.prototype.onBeforeRendering=function(){if(this.bShallUpdateContent===true){this.updateToolbarContents();this.bShallUpdateContent=false;this.bZoomControlTypeChanged=false;this.bContentAlignChanged=false;}};r.prototype.updateToolbarContents=function(){var i=this.getContent(),o={},s=0;var N=function(u){return this.getContent().indexOf(u)===-1;}.bind(this);var t=function(u,v,w){if(!u._getControl()){u._setControl(w);}u.setProperty("_show",v);};var I=function(u,v,w){var x=o[u],y=N(w);if(x){t(x,v,w);}else if(v){s++;}if(!y&&(x||!v)){this.removeContent(w);}else if(!x&&v&&y){if(u===j.Spacer){this.insertContent(w,this.getAlignCustomContentToRight()?0:this.getContent().length-s+1);}else{this.addContent(w);}}}.bind(this);i.forEach(function(u){var v;if(B.isA(u,"sap.gantt.simple.ContainerToolbarPlaceholder")){v=u.getType();if(o[v]){L.warning("There are more than one sap.gantt.simple.ContainerToolbarPlaceholder of the "+v+" type.");}o[v]=u;}});if(this.bContentAlignChanged){this.removeContent(this.oToolbarSpacer);}I(j.BirdEyeButton,this.getShowBirdEyeButton(),this._genBirdEyeButton());I(j.TimeZoomControl,this.getShowTimeZoomControl(),this._genTimeZoomFlexBox());I(j.LegendButton,this.getShowLegendButton(),this._genLegend());I(j.SettingButton,this.getShowSettingButton(),this._genSettings());I(j.DisplayTypeButton,this.getShowDisplayTypeButton(),this._genDisplayTypeButton());I(j.Spacer,true,this.oToolbarSpacer);};r.prototype._createControlsOnly=function(){this._genBirdEyeButton();this._genTimeZoomGroupControls();this._genLegend();this._genSettings();this._genDisplayTypeButton();};r.prototype._destroyIfExists=function(i){i.forEach(function(o){if(o){o.destroy();}});};r.prototype._genDisplayTypeButton=function(){if(this._oDisplayTypeSegmentedButton){return this._oDisplayTypeSegmentedButton;}this._oDisplayTypeSegmentedButton=new S(this.getId()+"-displayTypeSegmentedButton",{selectedKey:G.Both,selectionChange:function(E){this.fireDisplayTypeChange({displayType:E.getParameter("item").getKey()});}.bind(this),items:[new d(this.getId()+"-"+G.Both+"SegmentedButtonItem",{tooltip:this._oRb.getText("TLTP_DISPLAY_TYPE_BUTTON_BOTH"),icon:"sap-icon://Chart-Tree-Map",key:G.Both}),new d(this.getId()+"-"+G.Chart+"SegmentedButtonItem",{tooltip:this._oRb.getText("TLTP_DISPLAY_TYPE_BUTTON_CHART"),icon:"sap-icon://along-stacked-chart",key:G.Chart}),new d(this.getId()+"-"+G.Table+"SegmentedButtonItem",{tooltip:this._oRb.getText("TLTP_DISPLAY_TYPE_BUTTON_TABLE"),icon:"sap-icon://table-view",key:G.Table})]});};r.prototype._genBirdEyeButton=function(){if(this._oBirdEyeButton==null){var i=function(R){var s=R.getText("TXT_BRIDEYE"),t=R.getText("TXT_BRIDEYE_RANGE_VISIBLE_ROWS"),o=R.getText("TLTP_BRIDEYE_ON_VISIBLE_ROWS");return s+" ("+t+"): "+o;};this._oBirdEyeButton=new c(this.getId()+"-birdEyeButton",{icon:"sap-icon://show",type:p.Transparent,text:this._oRb.getText("TXT_BIRDEYE_BUTTON"),tooltip:i(this._oRb),press:this.fireBirdEyeButtonPress.bind(this)});}return this._oBirdEyeButton;};r.prototype._getSelectItems=function(){var s=[],I=this.getInfoOfSelectItems();if(I.length>0){if(I[0]instanceof a){s=I;}else{for(var i=0;i<I.length;i++){s.push(new a({key:I[i].key,text:I[i].text}));}}}return s;};r.prototype._genTimeZoomGroupControls=function(){var Z=l.config.ZoomControlType;var z=this.getZoomControlType();var u=function(o){clearTimeout(this._iLiveChangeTimer);this._iLiveChangeTimer=-1;this.setZoomLevel(o,true);};this.fireEvent("_zoomControlTypeChange",{zoomControlType:z});if(z===Z.None){return[];}if(z===Z.Select){if(this._oSelect){return[this._oSelect];}var s=this._getSelectItems();this._oSelect=new e(this.getId()+"-zoomSelect",{items:s,selectedItem:s[this.getZoomLevel()],change:function(E){var o=E.getSource();var t=o.getSelectedItem();var v=o.indexOfItem(t);this._iLiveChangeTimer=setTimeout(u.bind(this),200,[v,t]);}.bind(this)});return[this._oSelect];}else{if(this._oZoomSlider){this._oZoomSlider.setMax(this.getStepCountOfSlider()-1);if(z===Z.SliderOnly){return[this._oZoomSlider];}else if(z===Z.ButtonsOnly){return[this._oZoomOutButton,this._oZoomInButton];}else{return[this._oZoomOutButton,this._oZoomSlider,this._oZoomInButton];}}this._oZoomSlider=new h(this.getId()+"-zoomSlider",{width:"200px",max:this.getStepCountOfSlider()-1,value:this.getZoomLevel(),min:0,step:1,liveChange:function(E){var o=parseInt(E.getParameter("value"),10);clearTimeout(this._iLiveChangeTimer);this._iLiveChangeTimer=setTimeout(u.bind(this),200,o);}.bind(this)});var i=function(o){return function(E){this._iLiveChangeTimer=setTimeout(function(){var t=parseInt(o?this._oZoomSlider.stepUp(1).getValue():this._oZoomSlider.stepDown(1).getValue(),10);u.call(this,t);}.bind(this),200);};};this._oZoomInButton=new c(this.getId()+"-zoomInButton",{icon:"sap-icon://zoom-in",type:p.Transparent,tooltip:this._oRb.getText("TLTP_SLIDER_ZOOM_IN"),press:i(true).bind(this)});this._oZoomOutButton=new c(this.getId()+"-zoomOutButton",{icon:"sap-icon://zoom-out",type:p.Transparent,tooltip:this._oRb.getText("TLTP_SLIDER_ZOOM_OUT"),press:i(false).bind(this)});return[this._oZoomOutButton,this._oZoomSlider,this._oZoomInButton];}};r.prototype._genTimeZoomFlexBox=function(){if(this._oTimeZoomFlexBox){if(this.bZoomControlTypeChanged){this._oTimeZoomFlexBox.removeAllItems();this._genTimeZoomGroupControls().forEach(function(i){this._oTimeZoomFlexBox.addItem(i);}.bind(this));}return this._oTimeZoomFlexBox;}this._oTimeZoomFlexBox=new F(this.getId()+"-timeZoomFlexBox",{items:this._genTimeZoomGroupControls(),layoutData:new b({priority:k.NeverOverflow})});return this._oTimeZoomFlexBox;};r.prototype._genSettingItems=function(){return this.getSettingItems().map(function(s){return new g(this.getId()+"-"+s.getKey()+"CheckBox",{name:s.getKey(),text:s.getDisplayText(),tooltip:s.getTooltip(),selected:s.getChecked()}).addStyleClass("sapUiSettingBoxItem");}.bind(this));};r.prototype._genSettings=function(){if(this._oSettingsButton){if(this._oSettingsBox&&(this._oSettingsBox.getItems().length===this.getSettingItems().length)){var o=this._oSettingsBox.getItems(),s=this.getSettingItems();for(var i=0;i<o.length;i++){var t=o[i],u=s[i];t.setName(u.getKey());t.setText(u.getDisplayText());t.setTooltip(u.getTooltip());t.setSelected(u.getChecked());}}else{this._oSettingsBox.destroyItems();this._genSettingItems().forEach(function(u){this._oSettingsBox.addItem(u);}.bind(this));}return this._oSettingsButton;}this._oSettingsBox=new F(this.getId()+"-settingsFlexBox",{direction:n.Column,items:this._genSettingItems()}).addStyleClass("sapUiSettingBox");this._oSettingsDialog=new V(this.getId()+"-settingsDialog",{title:this._oRb.getText("SETTINGS_DIALOG_TITLE"),customTabs:[new f({content:this._oSettingsBox})],confirm:function(){this._fireSettingItemChangedEvent();}.bind(this),cancel:function(){this.updateSettingItems(this.mSettingsConfig);}.bind(this),reset:function(){this._genSettings();}.bind(this)});this._oSettingsButton=new c(this.getId()+"-settingsButton",{icon:"sap-icon://action-settings",type:p.Transparent,text:this._oRb.getText("TXT_SETTING_BUTTON"),tooltip:this._oRb.getText("TXT_SETTING_BUTTON"),layoutData:new b({priority:k.High}),press:function(E){this._oSettingsDialog.open();}.bind(this)});return this._oSettingsButton;};r.prototype._genLegend=function(){if(this._oLegendButton){return this._oLegendButton;}if(!this._oLegendPop){this._oLegendPop=new P(this.getId()+"-legendPopover",{placement:q.Bottom,showArrow:false,showHeader:false});}this._oLegendButton=new c(this.getId()+"-legendButton",{icon:"sap-icon://legend",type:p.Transparent,text:this._oRb.getText("TXT_LEGEND_BUTTON"),tooltip:this._oRb.getText("TLTP_SHOW_LEGEND"),layoutData:new b({priority:k.High,closeOverflowOnInteraction:false}),press:function(E){var o=this._oLegendPop;if(o.isOpen()){o.close();}else{o.openBy(this._oLegendButton);}}.bind(this)});return this._oLegendButton;};r.prototype.updateZoomLevel=function(z){this._bSuppressZoomStopChange=true;this.setZoomLevel(z);};r.prototype.setZoomLevel=function(z,i){if(!isNaN(z)){var o=this.getZoomLevel();if(this._oZoomSlider&&this._oZoomOutButton&&this._oZoomInButton){var s=this._oZoomSlider.getMax(),t=this._oZoomSlider.getMin();if(z===s){this._oZoomInButton.setEnabled(false);this._oZoomOutButton.setEnabled(true);}else if(z===t){this._oZoomInButton.setEnabled(true);this._oZoomOutButton.setEnabled(false);}else{this._oZoomInButton.setEnabled(true);this._oZoomOutButton.setEnabled(true);}}if(o!==z){this.setProperty("zoomLevel",z,i);if(this._oZoomSlider){this._oZoomSlider.setValue(z);if(!this._bSuppressZoomStopChange){this.fireZoomStopChange({index:z});}}if(this._oSelect){this._oSelect.setSelectedItem(this._oSelect.getItems()[z]);if(!this._bSuppressZoomStopChange){this.fireZoomStopChange({index:z,selectedItem:this._oSelect.getSelectedItem()});}}}}this._bSuppressZoomStopChange=false;return this;};r.prototype.setLegendContainer=function(o){this.setAggregation("legendContainer",o);if(!this._oLegendPop){this._oLegendPop=new P(this.getId()+"-legendPopover",{placement:q.Bottom,showArrow:false,showHeader:false});}if(o){this._oLegendPop.removeAllContent();this._oLegendPop.addContent(new A({content:o}));}};r.prototype._fireSettingItemChangedEvent=function(){var s=this._oSettingsBox.getItems();var o=[];for(var i=0;i<s.length;i++){var t=s[i].getName(),u=t.substr(4),v=this.mSettingsConfig[u],N=s[i].getSelected();if(v!==N){o.push({name:t,value:N});}}if(o.length>0){this.fireEvent("_settingsChange",o);}if(document.getElementById(this.getId()+"-overflowButton")&&document.getElementById(this.getId()+"-settingsButton").parentElement.classList.contains("sapMPopoverScroll")){document.getElementById(this.getId()+"-overflowButton").focus();}};r.prototype.updateSettingsConfig=function(i){Object.keys(i).forEach(function(o){this.mSettingsConfig[o]=i[o];}.bind(this));this.updateSettingItems(i);};r.prototype.updateSettingItems=function(i){var s=this._oSettingsBox.getItems();Object.keys(i).forEach(function(o){var t=s.filter(function(I){return I.getName().endsWith(o);})[0];if(t){t.setSelected(i[o]);}});if(document.getElementById(this.getId()+"-overflowButton")&&document.getElementById(this.getId()+"-settingsButton").parentElement.classList.contains("sapMPopoverScroll")){document.getElementById(this.getId()+"-overflowButton").focus();}};r.prototype.getAllToolbarItems=function(){return this.getContent();};r.prototype.setInfoOfSelectItems=function(i,s){this.setProperty("infoOfSelectItems",i,s);var t=this;if(this._oSelect){var o=this._getSelectItems();this._oSelect.removeAllItems();o.forEach(function(u){t._oSelect.addItem(u);});}};return r;},true);
