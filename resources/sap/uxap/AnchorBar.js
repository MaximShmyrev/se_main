/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/m/Button","sap/m/MenuButton","sap/m/library","sap/m/Toolbar","sap/ui/core/IconPool","sap/ui/core/Item","sap/ui/core/ResizeHandler","sap/ui/core/delegate/ScrollEnablement","sap/ui/layout/HorizontalLayout","sap/ui/Device","sap/ui/core/CustomData","sap/ui/core/Control","./HierarchicalSelect","./library","sap/uxap/AnchorBarRenderer","sap/base/Log","sap/ui/events/KeyCodes","sap/ui/dom/jquery/scrollLeftRTL"],function(q,B,M,m,T,I,a,R,S,H,D,C,b,c,l,A,L,K){"use strict";var d=m.SelectType;var e=T.extend("sap.uxap.AnchorBar",{metadata:{library:"sap.uxap",properties:{showPopover:{type:"boolean",defaultValue:true},upperCase:{type:"boolean",defaultValue:false},backgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance"}},associations:{selectedButton:{type:"sap.m.Button",multiple:false}},aggregations:{_select:{type:"sap.uxap.HierarchicalSelect",multiple:false,visibility:"hidden"},_scrollArrowLeft:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_scrollArrowRight:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}}}});e.ButtonDelegate={onAfterRendering:function(){var o=this.isA("sap.m.MenuButton")?this._getButtonControl():this,s=this.hasStyleClass("sapUxAPAnchorBarButtonSelected");if(this.data("bHasSubMenu")){o.$().attr("aria-haspopup","menu");o.$().find(".sapMBtn").attr("role","none").removeAttr('aria-haspopup');}o.$().attr("aria-controls",this.data("sectionId")).attr("aria-selected",s);}};e.prototype.init=function(){if(T.prototype.init){T.prototype.init.call(this);}this.addStyleClass("sapUxAPAnchorBar");this._oPressHandlers={};this._oSectionInfo={};this._oScroller=null;this._sSelectedKey=null;this._bRtl=sap.ui.getCore().getConfiguration().getRTL();this._bRtlScenario=this._bRtl&&!D.browser.msie;this._bHasButtonsBar=D.system.tablet||D.system.desktop;this.oLibraryResourceBundleOP=sap.ui.getCore().getLibraryResourceBundle("sap.uxap");this._oSelect=this._getHierarchicalSelect();if(this._bHasButtonsBar){this._oScroller=new S(this,this.getId()+"-scroll",{horizontal:true,vertical:false,nonTouchScrolling:true});this._iREMSize=0;this._iTolerance=0;this._iOffset=0;this._sResizeListenerId=undefined;}this.setDesign("Transparent");};e.SCROLL_STEP=250;e.SCROLL_DURATION=500;e.DOM_CALC_DELAY=200;e.prototype.setSelectedButton=function(o){var p=this.getSelectedButton(),P,s=this._oSelect.getItems(),h=s.length>0;if(typeof o==="string"){o=sap.ui.getCore().byId(o);}if(o){if(o.getId()===p){return this;}var f=o.data("sectionId");this._sSelectedKey=f;if(f&&h){this._oSelect.setSelectedKey(f);}if(this._bHasButtonsBar&&o.data("secondLevel")!==true){P=sap.ui.getCore().byId(p);this._toggleSelectionStyleClass(P,false);this._toggleSelectionStyleClass(o,true);if(f){this.scrollToSection(f,e.SCROLL_DURATION);}this._setAnchorButtonsTabFocusValues(o);}this.setAssociation("selectedButton",o,true);}return this;};e.prototype.setShowPopover=function(v,s){if(this.getShowPopover()===v){return this;}return this.setProperty("showPopover",v,true);};e.prototype.getSelectedSection=function(){var s=this.getSelectedButton();if(s&&(typeof(s)==="string")){s=sap.ui.getCore().byId(s);}if(s&&(s instanceof B)&&s.data("sectionId")){return sap.ui.getCore().byId(s.data("sectionId"));}return null;};e.prototype.onBeforeRendering=function(){if(this._bHasButtonsBar){this._iREMSize=parseInt(q("body").css("font-size"));this._iTolerance=this._iREMSize*1;this._iOffset=this._iREMSize*3;}if(T.prototype.onBeforeRendering){T.prototype.onBeforeRendering.call(this);}var f=this.getContent()||[],u=this.getUpperCase();this._oSelect.setUpperCase(u);this.toggleStyleClass("sapUxAPAnchorBarUpperCase",u);if(f.length>0&&this._sSelectedKey){this._oSelect.setSelectedKey(this._sSelectedKey);}};e.prototype.addContent=function(o,i){var f=o.data("secondLevel")===true||o.data("secondLevel")==="true";o.addStyleClass("sapUxAPAnchorBarButton");o.removeAllAriaDescribedBy();this._createSelectItem(o,f);if(f){o.destroy();}else{o.addEventDelegate(e.ButtonDelegate,o);this.addAggregation("content",o,i);}return this;};e.prototype._removeButtonsDelegate=function(){var f=this.getContent();f.forEach(function(o){o.removeEventDelegate(e.ButtonDelegate);});};e.prototype._createSelectItem=function(o,i){var f=o.getBindingInfo("text"),g=o.getText().trim()!=""||f;if(g&&(!i||o.data("bTitleVisible")===true)){var p=new a({key:o.data("sectionId"),text:o.getText(),customData:[new C({key:"secondLevel",value:o.data("secondLevel")})]});if(f){p.bindProperty("text",Object.assign({},f));}this._oSelect.addItem(p);}};e.prototype._decorateSubMenuButtons=function(E){var f=E.getSource().getContent();f.forEach(function(o){o.$().attr("aria-controls",o.data("sectionId"));});};e.prototype._toggleSelectionStyleClass=function(o,f){if(o&&o.toggleStyleClass){o.toggleStyleClass("sapUxAPAnchorBarButtonSelected",f);if(o instanceof M){o._getButtonControl().$().attr("aria-selected",f);}else{o.$().attr("aria-selected",f);}}};e.prototype._handleDirectScroll=function(E){this._requestScrollToSection(E.getSource().data("sectionId"));};e.prototype._requestScrollToSection=function(r){var o=sap.ui.getCore().byId(r),f=o.getParent();if(this.getParent()instanceof l.ObjectPageLayout){var n=r;if(o instanceof l.ObjectPageSubSection&&f instanceof l.ObjectPageSection){n=f.getId();}this.getParent().setDirectScrollingToSection(n);this.getParent().scrollToSection(o.getId(),null,0,true);}if(o instanceof l.ObjectPageSubSection&&f instanceof l.ObjectPageSection){f.setAssociation("selectedSubSection",o,true);}};e.prototype._onSelectChange=function(E){var s=E.getParameter("selectedItem"),o;if(!s){L.warning("AnchorBar :: no selected hierarchicalSelect item");return;}o=sap.ui.getCore().byId(s.getKey());if(o){this._requestScrollToSection(o.getId());}else{L.error("AnchorBar :: cannot find corresponding section",s.getKey());}};e.prototype._getHierarchicalSelect=function(){if(!this.getAggregation('_select')){this.setAggregation('_select',new c({width:"100%",icon:"sap-icon://slim-arrow-down",tooltip:this.oLibraryResourceBundleOP.getText("ANCHOR_BAR_OVERFLOW"),change:q.proxy(this._onSelectChange,this)}));}return this.getAggregation('_select');};e.prototype._createScrollArrow=function(f){var s,i,g,h,o,t=this,j=this.oLibraryResourceBundleOP.getText("TOOLTIP_OP_SCROLL_LEFT_ARROW"),k=this.oLibraryResourceBundleOP.getText("TOOLTIP_OP_SCROLL_RIGHT_ARROW");if(f){s=this.getId()+"-arrowScrollLeft";i="slim-arrow-left";g="anchorBarArrowLeft";h=this._bRtl?k:j;}else{s=this.getId()+"-arrowScrollRight";i="slim-arrow-right";g="anchorBarArrowRight";h=this._bRtl?j:k;}o=new B(s,{icon:I.getIconURI(i),type:"Transparent",press:function(E){E.preventDefault();t._handleScrollButtonTap(f);},tooltip:h});o.addEventDelegate({onAfterRendering:function(){if(sap.ui.getCore().getConfiguration().getTheme()!="sap_hcb"){this.$().attr("tabindex",-1);}},onThemeChanged:function(){if(sap.ui.getCore().getConfiguration().getTheme()=="sap_hcb"){this.$().removeAttr("tabindex");}else{this.$().attr("tabindex",-1);}}},o);return new H({content:[o]}).addStyleClass("anchorBarArrow").addStyleClass(g);};e.prototype._getScrollArrowLeft=function(){var s=this.getAggregation("_scrollArrowLeft");if(s){return s;}else{s=this._createScrollArrow(true);this.setAggregation("_scrollArrowLeft",s);return s;}};e.prototype._getScrollArrowRight=function(){var s=this.getAggregation("_scrollArrowRight");if(s){return s;}else{s=this._createScrollArrow(false);this.setAggregation("_scrollArrowRight",s);return s;}};e.prototype._applyHierarchicalSelectMode=function(){if(this._sHierarchicalSelectMode===A._AnchorBarHierarchicalSelectMode.Icon){this._bHideScrollContainer=false;this._oSelect.setWidth("auto");this._oSelect.setAutoAdjustWidth(true);this._oSelect.setType(d.IconOnly);this._computeBarSectionsInfo();}else{this._bHideScrollContainer=true;this._oSelect.setWidth("100%");this._oSelect.setAutoAdjustWidth(false);this._oSelect.setType(d.Default);}this.$().toggleClass("sapUxAPAnchorBarOverflow",this._sHierarchicalSelectMode===A._AnchorBarHierarchicalSelectMode.Icon);this.invalidate();};e.prototype._adjustSize=function(E){var o=D.media.getCurrentRange(D.media.RANGESETS.SAP_STANDARD,this._getWidth(this)),w=E&&E.size&&(E.size.width!==E.oldSize.width),n=l.Utilities.isPhoneScenario(o)?A._AnchorBarHierarchicalSelectMode.Text:A._AnchorBarHierarchicalSelectMode.Icon;if(n!==this._sHierarchicalSelectMode){this._sHierarchicalSelectMode=n;this._applyHierarchicalSelectMode();}if(this._sHierarchicalSelectMode===A._AnchorBarHierarchicalSelectMode.Icon){if(this._iMaxPosition<0){return;}var $=this.$(),f=$.find(".sapUxAPAnchorBarScrollContainer"),N,g,i,s,h=function j(){var v=N;N=g;g=v;};if(w){this.scrollToSection(this._sSelectedKey);}i=f.width();s=this._bRtlScenario?f.scrollLeftRTL():f.scrollLeft();N=s>=this._iTolerance;g=s+i<(this._iMaxPosition-this._iTolerance);if(this._bRtlScenario){h();}L.debug("AnchorBar :: scrolled at "+s,"scrollBegin ["+(N?"true":"false")+"] scrollEnd ["+(g?"true":"false")+"]");$.toggleClass("sapUxAPAnchorBarScrollLeft",N);$.toggleClass("sapUxAPAnchorBarScrollRight",g);}};e.prototype._handleScrollButtonTap=function(s){var i=((!this._bRtlScenario&&s)||(this._bRtlScenario&&!s))?-1:1;this._oScroller.scrollTo(this._iMaxPosition*i,0,e.SCROLL_DURATION*3);};e.prototype.scrollToSection=function(i,f){if(this._bHasButtonsBar){var o=D.media.getCurrentRange(D.media.RANGESETS.SAP_STANDARD,this._getWidth(this)),f=f||e.SCROLL_DURATION,s;if(!l.Utilities.isPhoneScenario(o)&&this._oSectionInfo[i]){if(this._bRtlScenario&&D.browser.firefox){s=this._oSectionInfo[i].scrollLeft+this._iOffset;}else{s=this._oSectionInfo[i].scrollLeft-this._iOffset;if(s<0){s=0;}}L.debug("AnchorBar :: scrolling to section "+i+" of "+s);if(this._sCurrentScrollId!=i){this._sCurrentScrollId=i;if(this._iCurrentScrollTimeout){clearTimeout(this._iCurrentScrollTimeout);q(document.getElementById(this.getId()+"-scroll")).parent().stop(true,false);}this._iCurrentScrollTimeout=setTimeout(function(){this._sCurrentScrollId=undefined;this._iCurrentScrollTimeout=undefined;}.bind(this),f);this._oScroller.scrollTo(s,0,f);}}else{L.debug("AnchorBar :: no need to scroll to "+i);}}};e.prototype.getScrollDelegate=function(){return this._oScroller;};e.PAGEUP_AND_PAGEDOWN_JUMP_SIZE=5;e.prototype.onsapright=function(E){E.preventDefault();var n;var f=this.getContent();f.forEach(function(o,i){if(E.target.id.indexOf(o.getId())>-1){n=i+1;return;}});if(n&&f[n]){f[n].focus();}else if(f[f.length-1]){f[f.length-1].focus();}};e.prototype.onsapleft=function(E){E.preventDefault();var n;var f=this.getContent();f.forEach(function(o,i){if(E.target.id.indexOf(o.getId())>-1){n=i-1;return;}});if(n&&f[n]){f[n].focus();}else if(f[0]){f[0].focus();}};e.prototype.onsapdown=function(E){E.preventDefault();};e.prototype.onsapup=function(E){E.preventDefault();};e.prototype.onsaphome=function(E){E.preventDefault();var f=this.getContent();f[0].focus();};e.prototype.onsapend=function(E){E.preventDefault();var f=this.getContent();f[f.length-1].focus();};e.prototype.onsappageup=function(E){this._handlePageUp(E);};e.prototype.onsappagedown=function(E){this._handlePageDown(E);};e.prototype._handlePageUp=function(E){E.preventDefault();var n;var f=this.getContent();f.forEach(function(o,i){if(E.target.id.indexOf(o.getId())>-1){n=i-(e.PAGEUP_AND_PAGEDOWN_JUMP_SIZE+1);return;}});if(n&&f[n]){f[n].focus();}else if(f[0]){f[0].focus();}};e.prototype._handlePageDown=function(E){E.preventDefault();var n;var f=this.getContent();f.forEach(function(o,i){if(E.target.id.indexOf(o.getId())>-1){n=i+e.PAGEUP_AND_PAGEDOWN_JUMP_SIZE+1;return;}});if(n&&f[n]){f[n].focus();}else if(f[f.length-1]){f[f.length-1].focus();}};e.prototype._setAnchorButtonsTabFocusValues=function(s){var f=this.getContent()||[],$,F='0',n='-1',t="tabIndex";f.forEach(function(o){$=o.getAggregation("_button")?o.getAggregation("_button").$():o.$();if(o===s){$.attr(t,F);}else{$.attr(t,n);}});};e.prototype.onAfterRendering=function(){var s;if(T.prototype.onAfterRendering){T.prototype.onAfterRendering.call(this);}s=sap.ui.getCore().byId(this.getSelectedButton());this._setAnchorButtonsTabFocusValues(s);this._iMaxPosition=-1;this._sResizeListenerId=R.register(this,q.proxy(this._adjustSize,this));this.$().find(".sapUxAPAnchorBarScrollContainer").on("scroll",q.proxy(this._onScroll,this));if(s){this.setSelectedButton(s);}if(this._bHasButtonsBar){this._iComputeContentSizeTimeout=setTimeout(function(){if(this._sHierarchicalSelectMode===A._AnchorBarHierarchicalSelectMode.Icon){this._computeBarSectionsInfo();}this._adjustSize();this._iComputeContentSizeTimeout=null;}.bind(this),e.DOM_CALC_DELAY);}};e.prototype.onThemeChanged=function(){if(this._sHierarchicalSelectMode===A._AnchorBarHierarchicalSelectMode.Icon){this._computeBarSectionsInfo();}};e.prototype._onScroll=function(){if(!this._iCurrentSizeCheckTimeout){this._iCurrentSizeCheckTimeout=setTimeout(function(){this._iCurrentSizeCheckTimeout=undefined;this._adjustSize();}.bind(this),e.SCROLL_DURATION);}};e.prototype._computeBarSectionsInfo=function(){this._iMaxPosition=0;var f=this.getContent()||[];f.forEach(this._computeNextSectionInfo,this);if(this._bRtlScenario&&(D.browser.webkit||D.browser.firefox)){f.forEach(this._adjustNextSectionInfo,this);this._oScroller&&this._oScroller.scrollTo(this._iMaxPosition,0,0);}};e.prototype._computeNextSectionInfo=function(o){var w=o.$().outerWidth(true);this._oSectionInfo[o.data("sectionId")]={scrollLeft:this._iMaxPosition,width:w};this._iMaxPosition+=w;};e.prototype._adjustNextSectionInfo=function(o){var s=this._oSectionInfo[o.data("sectionId")];if(D.browser.firefox){s.scrollLeft=-s.scrollLeft;}else{s.scrollLeft=this._iMaxPosition-s.scrollLeft-s.width;}};e.prototype._resetControl=function(){this._removeButtonsDelegate();this.destroyAggregation('content');this._oSelect.destroyAggregation("items",true);return this;};e.prototype._getAccessibilityRole=function(){return'none';};e.prototype.enhanceAccessibilityState=function(E,f){var o=this.getContent(),i=o.indexOf(E);if(i!==-1){f.role="option";f.setsize=o.length;f.posinset=i+1;}};e.prototype.exit=function(){if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}if(this.oLibraryResourceBundleOP){this.oLibraryResourceBundleOP=null;}if(this._iComputeContentSizeTimeout){clearTimeout(this._iComputeContentSizeTimeout);this._iComputeContentSizeTimeout=null;}this._removeButtonsDelegate();};e.prototype._getWidth=function(o){var f=o.getDomRef();return!(o instanceof b)?0:(f&&f.offsetWidth)||0;};e.prototype.setVisible=function(v){this.getParent()&&this.getParent().toggleStyleClass("sapUxAPObjectPageLayoutNoAnchorBar",!v);return this.setProperty("visible",v);};return e;});