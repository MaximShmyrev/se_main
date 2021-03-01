/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Core","sap/ui/core/Control","sap/ui/Device","sap/ui/core/ResizeHandler","sap/ui/core/library","sap/m/MessagePage","sap/ui/core/theming/Parameters","sap/ui/dom/units/Rem","./CarouselRenderer","./CarouselLayout","sap/ui/events/KeyCodes","sap/base/Log","sap/ui/events/F6Navigation","sap/ui/thirdparty/jquery","sap/ui/thirdparty/mobify-carousel","sap/ui/core/IconPool"],function(l,C,a,D,R,c,M,P,b,d,f,K,L,F,q){"use strict";var B=c.BusyIndicatorSize;var I=l.ImageHelper;var g=l.CarouselArrowsPlacement;var h=l.PlacementType;var j=a.extend("sap.m.Carousel",{metadata:{library:"sap.m",designtime:"sap/m/designtime/Carousel.designtime",properties:{height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},loop:{type:"boolean",group:"Misc",defaultValue:false},showPageIndicator:{type:"boolean",group:"Appearance",defaultValue:true},pageIndicatorPlacement:{type:"sap.m.PlacementType",group:"Appearance",defaultValue:h.Bottom},showBusyIndicator:{type:"boolean",group:"Appearance",defaultValue:true,deprecated:true},arrowsPlacement:{type:"sap.m.CarouselArrowsPlacement",group:"Appearance",defaultValue:g.Content}},defaultAggregation:"pages",aggregations:{pages:{type:"sap.ui.core.Control",multiple:true,singularName:"page"},customLayout:{type:"sap.m.CarouselLayout",multiple:false}},associations:{activePage:{type:"sap.ui.core.Control",multiple:false}},events:{loadPage:{deprecated:true,parameters:{pageId:{type:"string"}}},unloadPage:{deprecated:true,parameters:{pageId:{type:"string"}}},pageChanged:{parameters:{oldActivePageId:{type:"string"},newActivePageId:{type:"string"},activePages:{type:"array"}}},beforePageChanged:{parameters:{activePages:{type:"array"}}}}}});j._INNER_SELECTOR=".sapMCrslInner";j._PAGE_INDICATOR_SELECTOR=".sapMCrslBulleted";j._PAGE_INDICATOR_ARROWS_SELECTOR=".sapMCrslIndicatorArrow";j._CONTROLS=".sapMCrslControls";j._ITEM_SELECTOR=".sapMCrslItem";j._LEFTMOST_CLASS="sapMCrslLeftmost";j._RIGHTMOST_CLASS="sapMCrslRightmost";j._LATERAL_CLASSES="sapMCrslLeftmost sapMCrslRightmost";j._MODIFIERNUMBERFORKEYBOARDHANDLING=10;j._BULLETS_TO_NUMBERS_THRESHOLD=9;j._PREVIOUS_CLASS_ARROW="sapMCrslPrev";j._NEXT_CLASS_ARROW="sapMCrslNext";j.prototype.init=function(){this._fnAdjustAfterResize=function(){var $=this.$().find(j._INNER_SELECTOR);this._oMobifyCarousel.resize($);this._setWidthOfPages(this._getNumberOfItemsToShow());}.bind(this);this._aOrderOfFocusedElements=[];this._aAllActivePages=[];this._aAllActivePagesIndexes=[];this._onBeforePageChangedRef=this._onBeforePageChanged.bind(this);this._onAfterPageChangedRef=this._onAfterPageChanged.bind(this);this.data("sap-ui-fastnavgroup","true",true);this._oRb=C.getLibraryResourceBundle("sap.m");};j.prototype.exit=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.destroy();delete this._oMobifyCarousel;}if(this._oArrowLeft){this._oArrowLeft.destroy();delete this._oArrowLeft;}if(this._oArrowRight){this._oArrowRight.destroy();delete this._oArrowRight;}if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}if(this.oMessagePage){this.oMessagePage.destroy();this.oMessagePage=null;}this.$().off('afterSlide');this._fnAdjustAfterResize=null;this._$InnerDiv=null;this._aOrderOfFocusedElements=null;this._aAllActivePages=null;this._aAllActivePagesIndexes=null;};j.prototype.ontouchstart=function(e){if(this._oMobifyCarousel){if(e.target instanceof HTMLImageElement){e.preventDefault();}this._oMobifyCarousel.touchstart(e);}};j.prototype.ontouchmove=function(e){if(this._oMobifyCarousel){this._oMobifyCarousel.touchmove(e);}};j.prototype.ontouchend=function(e){if(this._oMobifyCarousel){if(this._oMobifyCarousel.hasActiveTransition()){this._oMobifyCarousel.onTransitionComplete();}this._oMobifyCarousel.touchend(e);}};j.prototype.onBeforeRendering=function(){var A=this.getActivePage();if(!A&&this.getPages().length>0){this.setAssociation("activePage",this.getPages()[0].getId(),true);}if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}this.$().off('beforeSlide',this._onBeforePageChangedRef);this.$().off('afterSlide',this._onAfterPageChangedRef);this.$().find(".sapMCrslItemTableCell").off("focus");return this;};j.prototype._getNumberOfItemsToShow=function(){var p=this.getPages().length,o=this.getCustomLayout(),n=1;if(o&&o.isA("sap.m.CarouselLayout")){n=Math.max(o.getVisiblePagesCount(),1);}if(n>1&&p<n){return p;}return n;};j.prototype.onAfterRendering=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.unbind();setTimeout(function(){if(this._oMobifyCarousel){this._oMobifyCarousel.onTransitionComplete();}}.bind(this),0);}var n=this._getNumberOfItemsToShow();this.$().carousel(undefined,{numberOfItemsToShow:n});this._oMobifyCarousel=this.getDomRef()._carousel;this._oMobifyCarousel.setLoop(this.getLoop());this._oMobifyCarousel.setRTL(C.getConfiguration().getRTL());if(n>1){this._setWidthOfPages(n);}var A=this.getActivePage();if(A){this._updateActivePages(A);var i=this._getPageNumber(A);if(isNaN(i)||i==0){if(this.getPages().length>0){this.setAssociation("activePage",this.getPages()[0].getId(),true);this._adjustHUDVisibility(1);}}else{if(C.isThemeApplied()){this._moveToPage(i+1);}else{C.attachThemeChanged(this._handleThemeLoad,this);}if(this.getParent()&&this.getParent().isA("sap.zen.commons.layout.PositionContainer")){if(this._isCarouselUsedWithCommonsLayout===undefined){setTimeout(this["invalidate"].bind(this),0);this._isCarouselUsedWithCommonsLayout=true;}}}}this.$().on('beforeSlide',this._onBeforePageChangedRef);this.$().on('afterSlide',this._onAfterPageChangedRef);this._$InnerDiv=this.$().find(j._INNER_SELECTOR)[0];this._sResizeListenerId=R.register(this._$InnerDiv,this._fnAdjustAfterResize);this.$().find(".sapMCrslItemTableCell").on("focus",function(e){e.preventDefault();q(e.target).parents('.sapMCrsl').trigger("focus");return false;});var p=this.getParent();while(p){if(p.isA("sap.m.IconTabBar")){var t=this;p.attachExpand(function(e){var E=e.getParameter('expand');if(E&&i>0){t._moveToPage(i+1);}});break;}p=p.getParent();}};j.prototype._onBeforePageChanged=function(e,p,n){if(e.target!==this.getDomRef()){return;}var N=this.getPages()[n-1].getId();this._updateActivePages(N);this.fireBeforePageChanged({activePages:this._aAllActivePagesIndexes});};j.prototype._onAfterPageChanged=function(e,p,n){var H=this.getPages().length>0;if(e.target!==this.getDomRef()){return;}if(H&&n>0){this._changePage(p,n);}};j.prototype._setWidthOfPages=function(n){var i=this._calculatePagesWidth(n);this.$().find(".sapMCrslItem").each(function(e,p){p.style.width=i+"%";});};j.prototype._calculatePagesWidth=function(n){var w=this.$().width(),m=b.toPx(P.get("_sap_m_Carousel_PagesMarginRight")),i=(w-(m*(n-1)))/n,e=(i/w)*100;return e;};j.prototype._handleThemeLoad=function(){var A=this.getActivePage();if(A){var i=this._getPageNumber(A);if(i>0){this._moveToPage(i+1);}}C.detachThemeChanged(this._handleThemeLoad,this);};j.prototype._moveToPage=function(i){this._oMobifyCarousel.changeAnimation('sapMCrslNoTransition');this._oMobifyCarousel.move(i);this._changePage(undefined,i);};j.prototype._changePage=function(o,n){this._adjustHUDVisibility(n);var O=this.getActivePage();if(o){O=this.getPages()[o-1].getId();}var N=this.getPages()[n-1].getId();this.setAssociation("activePage",N,true);var t=this._getPageIndicatorText(n);L.debug("sap.m.Carousel: firing pageChanged event: old page: "+O+", new page: "+N);if(!D.system.desktop){q(document.activeElement).trigger("blur");}if(this._oMobifyCarousel&&this._oMobifyCarousel.getShouldFireEvent()){this.firePageChanged({oldActivePageId:O,newActivePageId:N,activePages:this._aAllActivePagesIndexes});}this.$('slide-number').text(t);};j.prototype._getPageIndicatorText=function(n){return this._oRb.getText("CAROUSEL_PAGE_INDICATOR_TEXT",[n,this.getPages().length-this._getNumberOfItemsToShow()+1]);};j.prototype._adjustHUDVisibility=function(n){var N=this._getNumberOfItemsToShow();if(D.system.desktop&&!this.getLoop()&&this.getPages().length>1){var H=this.$('hud');H.removeClass(j._LATERAL_CLASSES);if(n===1){H.addClass(j._LEFTMOST_CLASS);this._focusCarouselContainer(H,j._PREVIOUS_CLASS_ARROW);}if((n+N-1)===this.getPages().length){H.addClass(j._RIGHTMOST_CLASS);this._focusCarouselContainer(H,j._NEXT_CLASS_ARROW);}}};j.prototype._focusCarouselContainer=function(H,A){if(H.find('.'+A)[0]===document.activeElement){this.focus();}};j.prototype.setActivePage=function(p){var s=null;if(typeof(p)=='string'){s=p;}else if(p instanceof a){s=p.getId();}if(s){if(s===this.getActivePage()){return this;}var i=this._getPageNumber(s);if(!isNaN(i)){if(this._oMobifyCarousel){this._oMobifyCarousel.setShouldFireEvent(true);this._oMobifyCarousel.move(i+1);}}}this.setAssociation("activePage",s,true);return this;};j.prototype._getNavigationArrow=function(s){if(!this["_oArrow"+s]){this["_oArrow"+s]=I.getImageControl(this.getId()+"-arrowScroll"+s,this["_oArrow"+s],this,{src:"sap-icon://slim-arrow-"+s.toLowerCase(),useIconTooltip:false});}return this["_oArrow"+s];};j.prototype._getErrorPage=function(){if(!this.oMessagePage){this.oMessagePage=new M({text:this._oRb.getText("CAROUSEL_ERROR_MESSAGE"),description:"",icon:"sap-icon://document",showHeader:false});}return this.oMessagePage;};j.prototype.previous=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.setShouldFireEvent(true);this._oMobifyCarousel.prev();}else{L.warning("Unable to execute sap.m.Carousel.previous: carousel must be rendered first.");}return this;};j.prototype.next=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.setShouldFireEvent(true);this._oMobifyCarousel.next();}else{L.warning("Unable to execute sap.m.Carousel.next: carousel must be rendered first.");}return this;};j.prototype._getPageNumber=function(p){var i,r;for(i=0;i<this.getPages().length;i++){if(this.getPages()[i].getId()==p){r=i;break;}}return r;};j.prototype.onsaptabprevious=function(e){this._bDirection=false;this._fnOnTabPress(e);};j.prototype.onsaptabnext=function(e){this._bDirection=true;this._fnOnTabPress(e);};j.prototype.onfocusin=function(e){this.saveLastFocusReference(e);this._bDirection=undefined;};j.prototype.onsapskipforward=function(e){e.preventDefault();this._handleGroupNavigation(e,false);};j.prototype.onsapskipback=function(e){e.preventDefault();this._handleGroupNavigation(e,true);};j.prototype.onkeydown=function(e){if(e.keyCode==K.F7){this._handleF7Key(e);return;}if(e.target!=this.getDomRef()){return;}switch(e.keyCode){case 189:case K.NUMPAD_MINUS:this._fnSkipToIndex(e,-1);break;case K.PLUS:case K.NUMPAD_PLUS:this._fnSkipToIndex(e,1);break;}};j.prototype.onsapescape=function(e){var i;if(e.target===this.$()[0]&&this._lastActivePageNumber){i=this._lastActivePageNumber+1;this._oMobifyCarousel.move(i);this._changePage(undefined,i);}};j.prototype.onsapright=function(e){this._fnSkipToIndex(e,1);};j.prototype.onsapup=function(e){this._fnSkipToIndex(e,-1);};j.prototype.onsapleft=function(e){this._fnSkipToIndex(e,-1);};j.prototype.onsapdown=function(e){this._fnSkipToIndex(e,1);};j.prototype.onsaphome=function(e){this._fnSkipToIndex(e,0);};j.prototype.onsapend=function(e){this._fnSkipToIndex(e,this.getPages().length);};j.prototype.onsaprightmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,j._MODIFIERNUMBERFORKEYBOARDHANDLING);}};j.prototype.onsapupmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,j._MODIFIERNUMBERFORKEYBOARDHANDLING);}};j.prototype.onsappageup=function(e){this._fnSkipToIndex(e,j._MODIFIERNUMBERFORKEYBOARDHANDLING);};j.prototype.onsapleftmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,-j._MODIFIERNUMBERFORKEYBOARDHANDLING);}};j.prototype.onsapdownmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,-j._MODIFIERNUMBERFORKEYBOARDHANDLING);}};j.prototype.onsappagedown=function(e){this._fnSkipToIndex(e,-j._MODIFIERNUMBERFORKEYBOARDHANDLING);};j.prototype._fnOnTabPress=function(e){if(e.target===this.$()[0]){this._lastActivePageNumber=this._getPageNumber(this.getActivePage());}};j.prototype._handleGroupNavigation=function(e,s){var E=q.Event("keydown");e.preventDefault();this.$().trigger("focus");E.target=e.target;E.key='F6';E.shiftKey=s;F.handleF6GroupNavigation(E);};j.prototype.saveLastFocusReference=function(e){var o=q(e.target).closest(".sapMCrsPage").control(0),s;if(this._bDirection===undefined){return;}if(this._lastFocusablePageElement===undefined){this._lastFocusablePageElement={};}if(o){s=o.getId();this._lastFocusablePageElement[s]=e.target;this._updateFocusedPagesOrder(s);}};j.prototype._getActivePageLastFocusedElement=function(){if(this._lastFocusablePageElement){return this._lastFocusablePageElement[this._getLastFocusedActivePage()];}};j.prototype._updateFocusedPagesOrder=function(s){var i=this._aOrderOfFocusedElements.indexOf(s);if(i>-1){this._aOrderOfFocusedElements.splice(0,0,this._aOrderOfFocusedElements.splice(i,1)[0]);}else{this._aOrderOfFocusedElements.unshift(s);}};j.prototype._updateActivePages=function(n){var N=this._getPageNumber(n),e=this._getNumberOfItemsToShow(),k=N+e,A=this.getPages();if(k>A.length){k=A.length-e;}this._aAllActivePages=[];this._aAllActivePagesIndexes=[];for(var i=N;i<k;i++){this._aAllActivePages.push(A[i].getId());this._aAllActivePagesIndexes.push(i);}};j.prototype._getLastFocusedActivePage=function(){for(var i=0;i<this._aOrderOfFocusedElements.length;i++){var p=this._aOrderOfFocusedElements[i];if(this._aAllActivePages.indexOf(p)>-1){return p;}}return this.getActivePage();};j.prototype._fnSkipToIndex=function(e,n){var i=n;if(e.target!==this.getDomRef()){return;}e.preventDefault();if(this._oMobifyCarousel.hasActiveTransition()){this._oMobifyCarousel.onTransitionComplete();}this._oMobifyCarousel.setShouldFireEvent(true);if(n!==0){i=this._getPageNumber(this.getActivePage())+1+n;}this._oMobifyCarousel.move(i);};j.prototype._handleF7Key=function(e){var A;e.preventDefault();A=this._getActivePageLastFocusedElement();if(e.target===this.$()[0]&&A){A.focus();}else{this.$().trigger("focus");}};j.prototype.setShowBusyIndicator=function(){L.warning("sap.m.Carousel: Deprecated function 'setShowBusyIndicator' called. Does nothing.");return this;};j.prototype.getShowBusyIndicator=function(){L.warning("sap.m.Carousel: Deprecated function 'getShowBusyIndicator' called. Does nothing.");return false;};j.prototype.setBusyIndicatorSize=function(s){if(!(s in B)){s=B.Medium;}return a.prototype.setBusyIndicatorSize.call(this,s);};return j;});
