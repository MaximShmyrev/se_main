/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/base/strings/capitalize","sap/ui/core/Core","sap/ui/Device"],function(l,c,C,D){"use strict";var a=l.CarouselArrowsPlacement;var P=l.PlacementType;var r=C.getLibraryResourceBundle("sap.m");var b={apiVersion:2};b._BULLETS_TO_NUMBERS_THRESHOLD=9;b.render=function(R,o){var p=o.getPages(),i=p.length,s=o.getPageIndicatorPlacement(),A=o.getArrowsPlacement(),I=o._getPageNumber(o.getActivePage());this._renderOpeningDiv(R,o);if(s===P.Top){this._renderPageIndicatorAndArrows(R,o,{iPageCount:i,iIndex:I,sArrowsPlacement:A,bBottom:false,bShowPageIndicator:o.getShowPageIndicator()});}this._renderInnerDiv(R,o,p,s);if(D.system.desktop&&i>o._getNumberOfItemsToShow()&&A===a.Content){this._renderHudArrows(R,o);}if(s===P.Bottom){this._renderPageIndicatorAndArrows(R,o,{iPageCount:i,iIndex:I,sArrowsPlacement:A,bBottom:true,bShowPageIndicator:o.getShowPageIndicator()});}R.close("div");};b._renderOpeningDiv=function(R,o){var t=o.getTooltip_AsString();R.openStart("div",o).class("sapMCrsl").class("sapMCrslFluid").style("width",o.getWidth()).style("height",o.getHeight()).attr("data-sap-ui-customfastnavgroup",true).attr("tabindex",0).accessibilityState(o,{role:"listbox"});if(t){R.attr("title",t);}R.openEnd();};b._renderInnerDiv=function(R,o,p,s){R.openStart("div").class("sapMCrslInner");if(p.length>1&&(o.getShowPageIndicator()||o.getArrowsPlacement()===a.PageIndicator)){if(s===P.Bottom){R.class("sapMCrslBottomOffset");if(o.getArrowsPlacement()===a.PageIndicator){R.class("sapMCrslBottomArrowsOffset");}}else{R.class("sapMCrslTopOffset");if(o.getArrowsPlacement()===a.PageIndicator){R.class("sapMCrslTopArrowsOffset");}}}R.openEnd();var f=function(d,i,A){R.openStart("div",o.getId()+"-"+d.getId()+"-slide").class("sapMCrslItem").accessibilityState(d,{role:"option",posinset:i+1,setsize:A.length}).openEnd();b._renderPageInScrollContainer(R,o,d);R.close("div");};if(p.length){p.forEach(f);}else{R.renderControl(o._getErrorPage());}R.close("div");};b._renderPageIndicatorAndArrows=function(R,o,s){var p=s.iPageCount,S=D.system.desktop&&s.sArrowsPlacement===a.PageIndicator,I=o.getId(),O=[],n=o._getNumberOfItemsToShow(),d=1;if(p<=o._getNumberOfItemsToShow()){return;}if(!s.bShowPageIndicator&&!S){return;}if(s.bBottom){O.push("sapMCrslControlsBottom");}else{O.push("sapMCrslControlsTop");}if(S){R.openStart("div").class("sapMCrslControls");O.forEach(function(e){R.class(e);});R.openEnd();R.openStart("div").class("sapMCrslControlsContainer");O.forEach(function(e){R.class(e);});R.openEnd();}else{R.openStart("div").class("sapMCrslControlsNoArrows");O.forEach(function(e){R.class(e);});R.openEnd();}if(S){this._renderArrow(R,o,"previous");}R.openStart("div",I+"-pageIndicator");if(!s.bShowPageIndicator){R.style("opacity","0");}if(p<b._BULLETS_TO_NUMBERS_THRESHOLD){R.class("sapMCrslBulleted").openEnd();for(var i=1;i<=p-n+1;i++){R.openStart("span").attr("data-slide",d).accessibilityState({role:"img",label:r.getText("CAROUSEL_POSITION",[i,p])}).openEnd().text(i).close("span");d++;}}else{R.class("sapMCrslNumeric").openEnd();var t=r.getText("CAROUSEL_PAGE_INDICATOR_TEXT",[s.iIndex+1,p-n+1]);R.openStart("span",I+"-"+"slide-number").openEnd().text(t).close("span");}R.close("div");if(S){this._renderArrow(R,o,"next");}if(!S){R.close("div");}if(S){R.close("div").close("div");}};b._renderHudArrows=function(R,o){var A;if(o.getShowPageIndicator()){if(o.getPageIndicatorPlacement()===P.Top){A="sapMCrslHudTop";}else if(o.getPageIndicatorPlacement()===P.Bottom){A="sapMCrslHudBottom";}}else{A="sapMCrslHudMiddle";}R.openStart("div",o.getId()+"-hud").class("sapMCrslHud").class(A).openEnd();this._renderArrow(R,o,"previous");this._renderArrow(R,o,"next");R.close("div");};b._renderArrow=function(R,o,d){var s=d.slice(0,4);R.openStart("a").class("sapMCrsl"+c(s)).attr("tabindex","-1").attr("data-slide",s).attr("title",r.getText("PAGINGBUTTON_"+d.toUpperCase())).openEnd();R.openStart("div").class("sapMCrslArrowInner").openEnd();R.renderControl(o._getNavigationArrow(d==="previous"?"Left":"Right"));R.close("div").close("a");};b._renderPageInScrollContainer=function(R,o,p){R.openStart("div").class("sapMScrollCont").class("sapMScrollContH").style("width","100%").style("height","100%").openEnd();R.openStart("div").class("sapMScrollContScroll").openEnd();R.openStart("div").class("sapMCrslItemTable").openEnd();R.openStart("div").class("sapMCrslItemTableCell");if(p.isA("sap.m.Image")){var i="sapMCrslImgNoArrows",s=D.system.desktop&&o.getArrowsPlacement()===a.PageIndicator;if(s){i="sapMCrslImg";}R.class(i);}R.openEnd();R.renderControl(p.addStyleClass("sapMCrsPage"));R.close("div");R.close("div");R.close("div");R.close("div");};return b;},true);
