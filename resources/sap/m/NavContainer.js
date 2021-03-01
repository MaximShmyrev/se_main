/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Control','sap/ui/core/RenderManager','sap/ui/Device','./NavContainerRenderer',"sap/ui/thirdparty/jquery","sap/base/Log","sap/ui/dom/jquery/Focusable"],function(a,C,R,D,N,q,L){"use strict";var b=C.extend("sap.m.NavContainer",{metadata:{library:"sap.m",properties:{autoFocus:{type:"boolean",group:"Behavior",defaultValue:true},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},visible:{type:"boolean",group:"Appearance",defaultValue:true},defaultTransitionName:{type:"string",group:"Appearance",defaultValue:"slide"}},defaultAggregation:"pages",aggregations:{pages:{type:"sap.ui.core.Control",multiple:true,singularName:"page"}},associations:{initialPage:{type:"sap.ui.core.Control",multiple:false}},events:{navigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}}}}});var u=sap.ui.getCore().getConfiguration().getAnimation(),g=function(d){return u?d:0;},h=function(c){return!!(c&&c.getParent());},s=function(p,d){if(h(p)){p.$().css({'-webkit-animation-direction':d,'animation-direction':d});}};b.TransitionDirection={BACK:"back",TO:"to"};b.prototype.init=function(){this._pageStack=[];this._aQueue=[];this._mVisitedPages={};this._mFocusObject={};this._iTransitionsCompleted=0;this._bNeverRendered=true;this._bNavigating=false;this._bRenderingInProgress=false;};b.prototype.exit=function(){this._mFocusObject=null;};b.prototype.onBeforeRendering=function(){var p=this.getCurrentPage();if(this._bNeverRendered&&p){var c=p.getId();if(!this._mVisitedPages[c]){this._mVisitedPages[c]=true;var n={from:null,fromId:null,to:p,toId:c,firstTime:true,isTo:false,isBack:false,isBackToPage:false,isBackToTop:false,direction:"initial"};var e=q.Event("BeforeFirstShow",n);e.srcControl=this;e.data=this._oToDataBeforeRendering||{};e.backData={};p._handleEvent(e);e=q.Event("BeforeShow",n);e.srcControl=this;e.data=this._oToDataBeforeRendering||{};e.backData={};p._handleEvent(e);}}};b.prototype.onAfterRendering=function(){var p=this.getCurrentPage(),f,n,c,e;if(this._bNeverRendered&&p){this._bNeverRendered=false;delete this._bNeverRendered;c=p.getId();if(!this._isInsideAPopup()&&this.getAutoFocus()){f=b._applyAutoFocusTo(c);if(f){this._mFocusObject[c]=f;}}n={from:null,fromId:null,to:p,toId:c,firstTime:true,isTo:false,isBack:false,isBackToTop:false,isBackToPage:false,direction:"initial"};e=q.Event("AfterShow",n);e.srcControl=this;e.data=this._oToDataBeforeRendering||{};e.backData={};p._handleEvent(e);}};b.prototype._getActualInitialPage=function(){var p=this.getInitialPage();if(p){var c=sap.ui.getCore().byId(p);if(c){return c;}else{L.error("NavContainer: control with ID '"+p+"' was set as 'initialPage' but was not found as a DIRECT child of this NavContainer (number of current children: "+this.getPages().length+").");}}var d=this.getPages();return(d.length>0?d[0]:null);};b.prototype.getPage=function(p){var P=this.getPages();for(var i=0;i<P.length;i++){if(P[i]&&(P[i].getId()==p)){return P[i];}}return null;};b.prototype._ensurePageStackInitialized=function(d){if(this._pageStack.length===0){var p=this._getActualInitialPage();if(p){this._pageStack.push({id:p.getId(),isInitial:true,data:d||{}});}}return this._pageStack;};b.prototype.getCurrentPage=function(){var c=this._ensurePageStackInitialized();if(c.length>=1){return this.getPage(c[c.length-1].id);}else{L.warning(this+": page stack is empty but should have been initialized - application failed to provide a page to display");return undefined;}};b.prototype.getPreviousPage=function(){var c=this._ensurePageStackInitialized();if(c.length>1){return this.getPage(c[c.length-2].id);}else if(c.length==1){return undefined;}else{L.warning(this+": page stack is empty but should have been initialized - application failed to provide a page to display");}};b.prototype.currentPageIsTopPage=function(){var c=this._ensurePageStackInitialized();return(c.length===1);};b.prototype.insertPreviousPage=function(p,t,d){var c=this._ensurePageStackInitialized();if(this._pageStack.length>0){var i=c.length-1;var e={id:p,transition:t,data:d};if(i===0){e.isInitial=true;delete c[c.length-1].isInitial;}c.splice(i,0,e);}else{L.warning(this+": insertPreviousPage called with empty page stack; ignoring");}return this;};b._applyAutoFocusTo=function(i){var f=q(document.getElementById(i)).firstFocusableDomRef();if(f){f.focus();}return f;};b.prototype._applyAutoFocus=function(n){var p=n.toId,d,c=n.isBack||n.isBackToPage||n.isBackToTop;if(!n.bFocusInsideFromPage){return;}if(c){d=this._mFocusObject!=null?this._mFocusObject[p]:null;if(d){d.focus();}else{b._applyAutoFocusTo(p);}}else if(n.isTo){b._applyAutoFocusTo(p);}};b.prototype._afterTransitionCallback=function(n,d,B){var e=q.Event("AfterShow",n);e.data=d||{};e.backData=B||{};e.srcControl=this;n.to._handleEvent(e);e=q.Event("AfterHide",n);e.srcControl=this;n.from._handleEvent(e);this._iTransitionsCompleted++;this._bNavigating=false;if(this.getAutoFocus()){this._applyAutoFocus(n);}this.fireAfterNavigate(n);L.info(this+": _afterTransitionCallback called, to: "+n.toId);if(n.to.hasStyleClass("sapMNavItemHidden")){L.warning(this.toString()+": target page '"+n.toId+"' still has CSS class 'sapMNavItemHidden' after transition. This should not be the case, please check the preceding log statements.");n.to.removeStyleClass("sapMNavItemHidden");}this._dequeueNavigation();};b.prototype._dequeueNavigation=function(){var n=this._aQueue.shift();if(typeof n==="function"){n();}};b.prototype._isInPageStack=function(p){return this._pageStack.some(function(P){return P.id===p;});};b.prototype._safeBackToPage=function(p,t,d,T){var c;if(!this.getPage(p)){return this;}c=this.getCurrentPage();if(c&&c.getId()===p){return this;}if(this._isInPageStack(p)){return this.backToPage(p,d,T);}else{d=d||{};d.safeBackToPage=true;return this.to(p,t,d,T);}};b.prototype._isFocusInControl=function(c){return q(document.activeElement).closest(c.$()).length>0;};b.prototype.to=function(p,t,d,T,f){if(p instanceof C){p=p.getId();}if(typeof(t)!=="string"){T=d;d=t;}t=t||this.getDefaultTransitionName();T=T||{};d=d||{};var F={id:p,transition:t,data:d};this._ensurePageStackInitialized(d);if(this._bNavigating){L.info(this.toString()+": Cannot navigate to page "+p+" because another navigation is already in progress. - navigation will be executed after the previous one");this._aQueue.push(q.proxy(function(){this.to(p,t,d,T,true);},this));return this;}if(this._bNeverRendered){this._oToDataBeforeRendering=d;}var o=this.getCurrentPage();if(o&&(o.getId()===p)){L.warning(this.toString()+": Cannot navigate to page "+p+" because this is the current page.");if(f){this._dequeueNavigation();}if(this._pageStack.length===1){this._pageStack[0].transition=F.transition;}return this;}var c=this.getPage(p);if(c){if(!o){L.warning("Navigation triggered to page with ID '"+p+"', but the current page is not known/aggregated by "+this);return this;}var n={from:o,fromId:o.getId(),to:c,toId:p,firstTime:!this._mVisitedPages[p],isTo:true,isBack:false,isBackToTop:false,isBackToPage:false,direction:"to",bFocusInsideFromPage:this._isFocusInControl(o)};if(n.bFocusInsideFromPage){this._mFocusObject[o.getId()]=document.activeElement;}var e=this.fireNavigate(n);if(e){a.closeKeyboard();var E=q.Event("BeforeHide",n);E.srcControl=this;o._handleEvent(E);if(!this._mVisitedPages[p]){E=q.Event("BeforeFirstShow",n);E.srcControl=this;E.data=d||{};E.backData={};c._handleEvent(E);}E=q.Event("BeforeShow",n);E.srcControl=this;E.data=d||{};E.backData={};c._handleEvent(E);this._pageStack.push(F);L.info(this.toString()+": navigating to page '"+p+"': "+c.toString());this._mVisitedPages[p]=true;if(!this.getDomRef()){L.info("'Hidden' 'to' navigation in not-rendered NavContainer "+this.toString());if(this._bRenderingInProgress){setTimeout(this.invalidate.bind(this),0);}return this;}var i;if(!(i=c.getDomRef())||i.parentNode!=this.getDomRef()||R.isPreservedContent(i)){c.addStyleClass("sapMNavItemRendering");L.debug("Rendering 'to' page '"+c.toString()+"' for 'to' navigation");var r=sap.ui.getCore().createRenderManager();r.render(c,this.getDomRef());r.destroy();c.addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemRendering");}var j=b.transitions[t]||b.transitions["slide"];var k=this._iTransitionsCompleted;var l=this;window.setTimeout(function(){if(l&&(l._iTransitionsCompleted<k+1)){L.warning("Transition '"+t+"' 'to' was triggered five seconds ago, but has not yet invoked the end-of-transition callback.");}},g(5000));this._bNavigating=true;var m=(d.safeBackToPage||T.safeBackToPage)?"back":"to";this._cacheTransitionInfo(t,m);j[m].call(this,o,c,q.proxy(function(){this._afterTransitionCallback(n,d);},this),T);}else{L.info("Navigation to page with ID '"+p+"' has been aborted by the application");}}else{L.warning("Navigation triggered to page with ID '"+p+"', but this page is not known/aggregated by "+this);}return this;};b.prototype.back=function(c,t){this._backTo("back",c,t);return this;};b.prototype.backToPage=function(p,c,t){this._backTo("backToPage",c,t,p);return this;};b.prototype.backToTop=function(c,t){this._backTo("backToTop",c,t);return this;};b.prototype._backTo=function(t,c,T,r){if(this._bNavigating){L.warning(this.toString()+": Cannot navigate back because another navigation is already in progress. - navigation will be executed after the previous one");this._aQueue.push(q.proxy(function(){this._backTo(t,c,T,r);},this));return this;}if(this._pageStack.length<=1){if(this._pageStack.length===1&&!this._pageStack[0].isInitial){throw new Error("Initial page not found on the stack. How did this happen?");}this._aQueue=[];return this;}else{if(r instanceof C){r=r.getId();}var f=this._pageStack[this._pageStack.length-1];var d=f.transition;var F=this.getPage(f.id);var o;var e;if(t==="backToTop"){o=this._getActualInitialPage();e=null;}else if(t==="backToPage"){var i=this._findClosestPreviousPageInfo(r);if(!i){L.error(this.toString()+": Cannot navigate backToPage('"+r+"') because target page was not found among the previous pages.");return this;}o=sap.ui.getCore().byId(i.id);if(!o){L.error(this.toString()+": Cannot navigate backToPage('"+r+"') because target page does not exist anymore.");return this;}e=i.data;}else{o=this.getPreviousPage();e=this._pageStack[this._pageStack.length-2].data;}if(!o){L.error("NavContainer back navigation: target page is not defined or not aggregated by this NavContainer. Aborting navigation.");return;}var j=o.getId();c=c||{};T=T||{};var n={from:F,fromId:F.getId(),to:o,toId:j,firstTime:!this._mVisitedPages[j],isTo:false,isBack:(t==="back"),isBackToPage:(t==="backToPage"),isBackToTop:(t==="backToTop"),direction:t,bFocusInsideFromPage:this._isFocusInControl(F)};var k=this.fireNavigate(n);if(k){a.closeKeyboard();var E=q.Event("BeforeHide",n);E.srcControl=this;F._handleEvent(E);if(!this._mVisitedPages[j]){E=q.Event("BeforeFirstShow",n);E.srcControl=this;E.backData=c||{};E.data={};o._handleEvent(E);}E=q.Event("BeforeShow",n);E.srcControl=this;E.backData=c||{};E.data=e||{};o._handleEvent(E);this._pageStack.pop();L.info(this.toString()+": navigating back to page "+o.toString());this._mVisitedPages[j]=true;if(t==="backToTop"){this._pageStack=[];L.info(this.toString()+": navigating back to top");this.getCurrentPage();}else if(t==="backToPage"){var p=[],l;while(this._pageStack[this._pageStack.length-1].id!==r){l=this._pageStack.pop();p.push(l.id);}L.info(this.toString()+": navigating back to specific page "+o.toString()+" across the pages: "+p.join(", "));}if(!this.getDomRef()){L.info("'Hidden' back navigation in not-rendered NavContainer "+this.toString());return this;}var m=b.transitions[d]||b.transitions["slide"];var v=this._iTransitionsCompleted;var w=this;window.setTimeout(function(){if(w&&(w._iTransitionsCompleted<v+1)){L.warning("Transition '"+d+"' 'back' was triggered five seconds ago, but has not yet invoked the end-of-transition callback.");}},g(5000));this._bNavigating=true;var x;if(!(x=o.getDomRef())||x.parentNode!=this.getDomRef()||R.isPreservedContent(x)){o.addStyleClass("sapMNavItemRendering");L.debug("Rendering 'to' page '"+o.toString()+"' for back navigation");var y=sap.ui.getCore().createRenderManager();var z=this.$().children().index(F.getDomRef());y.renderControl(o);y.flush(this.getDomRef(),false,z);y.destroy();o.addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemRendering");}if(F.getId()===o.getId()){L.info("Transition is skipped when navigating back to the same page instance"+o.toString());this._afterTransitionCallback(n,e,c);return this;}this._cacheTransitionInfo(d,b.TransitionDirection.BACK);m.back.call(this,F,o,q.proxy(function(){this._afterTransitionCallback(n,e,c);},this),T);}}return this;};b.prototype._findClosestPreviousPageInfo=function(r){for(var i=this._pageStack.length-2;i>=0;i--){var c=this._pageStack[i];if(c.id===r){return c;}}return null;};b.prototype._cacheTransitionInfo=function(t,T){this._sTransitionName=t;this._sTransitionDirection=T;};b.prototype._fadeTransition=function(f,t,c){this.oFromPage=f;this.oToPage=t;this.fCallback=c;this._fadeOutAnimation();};b.prototype._fadeOutAnimation=function(){var t=this,f=this.oFromPage,T=this.oToPage;T.addStyleClass("sapMNavItemTransparent");if(this._sTransitionName==="slide"){if(this._sTransitionDirection===b.TransitionDirection.TO){T.addStyleClass("sapMNavItemSlideLeft");f.addStyleClass("sapMNavItemSlideRight");}else{T.addStyleClass("sapMNavItemSlideRight");f.addStyleClass("sapMNavItemSlideLeft");}}T.removeStyleClass("sapMNavItemHidden");f.addStyleClass("sapMNavItemOpaque");window.setTimeout(function(){f.$().on("webkitTransitionEnd transitionend",t._fadeOutAnimationEnd.bind(t));t.bTransition1EndPending=true;f.addStyleClass("sapMNavItemFading").removeStyleClass("sapMNavItemOpaque").addStyleClass("sapMNavItemTransparent");window.setTimeout(function(){if(t.bTransition1EndPending){t._fadeOutAnimationEnd();}},g(150));},g(10));};b.prototype._fadeOutAnimationEnd=function(e){var f=this.oFromPage;if(e&&e.originalEvent&&e.originalEvent.propertyName!=="opacity"){return;}this.bTransition1EndPending=false;q(f.$()).off("webkitTransitionEnd transitionend");f.removeStyleClass("sapMNavItemSlideLeft").removeStyleClass("sapMNavItemSlideRight");this._fadeInAnimation();};b.prototype._fadeInAnimation=function(){var t=this,T=this.oToPage;window.setTimeout(function(){T.$().on("webkitTransitionEnd transitionend",t._fadeInAnimationEnd.bind(t));t.bTransition2EndPending=true;T.addStyleClass("sapMNavItemFading").removeStyleClass("sapMNavItemTransparent").addStyleClass("sapMNavItemOpaque");window.setTimeout(function(){if(t.bTransition2EndPending){t._fadeInAnimationEnd();}},g(150));},g(10));};b.prototype._fadeInAnimationEnd=function(e){var t=this.oToPage,f=this.oFromPage;if(e&&e.originalEvent&&e.originalEvent.propertyName!=="opacity"){return;}this.bTransition2EndPending=false;if(h(f)){f.addStyleClass("sapMNavItemHidden");f.removeStyleClass("sapMNavItemFading").removeStyleClass("sapMNavItemTransparent");}q(t.$()).off("webkitTransitionEnd transitionend");if(h(t)){t.removeStyleClass("sapMNavItemFading").removeStyleClass("sapMNavItemOpaque").removeStyleClass("sapMNavItemSlideLeft").removeStyleClass("sapMNavItemSlideRight");}this.fCallback();};b.prototype._baseSlideAnimation=function(f,t,c){var F=false,T=true,i=this._sTransitionDirection===b.TransitionDirection.BACK,A=i?"reverse":"normal",d=i?"sapMNavItemSlideCenterToLeft":"sapMNavItemSlideRightToCenter",e=!i?"sapMNavItemSlideCenterToLeft":"sapMNavItemSlideRightToCenter",j=function(){q(this).off("webkitAnimationEnd animationend");if(!F){return(F=true);}T=false;s(t,"");s(f,"");if(h(t)){t.removeStyleClass(d);}if(h(f)){f.removeStyleClass(e).addStyleClass("sapMNavItemHidden");}c();};f.$().on("webkitAnimationEnd animationend",j);t.$().on("webkitAnimationEnd animationend",j);s(t,A);s(f,A);f.addStyleClass(e);t.addStyleClass(d).removeStyleClass("sapMNavItemHidden");window.setTimeout(function(){if(T){F=true;j.apply(f.$().add(t.$()));}},g(400));};b.transitions=b.transitions||{};b.transitions["show"]={to:function(f,t,c){t.removeStyleClass("sapMNavItemHidden");f&&f.addStyleClass("sapMNavItemHidden");c();},back:function(f,t,c){t.removeStyleClass("sapMNavItemHidden");f&&f.addStyleClass("sapMNavItemHidden");c();}};b.transitions["baseSlide"]={to:b.prototype._baseSlideAnimation,back:b.prototype._baseSlideAnimation};b.transitions["slide"]={to:b.prototype._fadeTransition,back:b.prototype._fadeTransition};b.transitions["fade"]={to:b.prototype._fadeTransition,back:b.prototype._fadeTransition};b.transitions["flip"]={to:function(f,t,c){var d=this;window.setTimeout(function(){d.$().addClass("sapMNavFlip");t.addStyleClass("sapMNavItemFlipNext");t.removeStyleClass("sapMNavItemHidden");window.setTimeout(function(){var o=false;var T=true;var A=null;A=function(){q(this).off("webkitTransitionEnd transitionend");if(!o){o=true;}else{T=false;if(h(t)){t.removeStyleClass("sapMNavItemFlipping");}if(h(f)){f.removeStyleClass("sapMNavItemFlipping").addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemFlipPrevious");}d.$().removeClass("sapMNavFlip");c();}};f.$().on("webkitTransitionEnd transitionend",A);t.$().on("webkitTransitionEnd transitionend",A);t.addStyleClass("sapMNavItemFlipping").removeStyleClass("sapMNavItemFlipNext");f.addStyleClass("sapMNavItemFlipping").addStyleClass("sapMNavItemFlipPrevious");window.setTimeout(function(){if(T){o=true;A.apply(f.$().add(t.$()));}},g(600));},g(60));},0);},back:function(f,t,c){var d=this;d.$().addClass("sapMNavFlip");t.addStyleClass("sapMNavItemFlipPrevious");t.removeStyleClass("sapMNavItemHidden");window.setTimeout(function(){var o=false;var T=true;var A=null;A=function(){q(this).off("webkitTransitionEnd transitionend");if(!o){o=true;}else{T=false;if(h(t)){t.removeStyleClass("sapMNavItemFlipping");}if(h(f)){f.removeStyleClass("sapMNavItemFlipping").addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemFlipNext");}d.$().removeClass("sapMNavFlip");c();}};f.$().on("webkitTransitionEnd transitionend",A);t.$().on("webkitTransitionEnd transitionend",A);t.addStyleClass("sapMNavItemFlipping").removeStyleClass("sapMNavItemFlipPrevious");f.addStyleClass("sapMNavItemFlipping").addStyleClass("sapMNavItemFlipNext");window.setTimeout(function(){if(T){o=true;A.apply(f.$().add(t.$()));}},g(600));},g(60));}};b.transitions["door"]={to:function(f,t,c){var d=this;window.setTimeout(function(){d.$().addClass("sapMNavDoor");t.addStyleClass("sapMNavItemDoorInNext");t.removeStyleClass("sapMNavItemHidden");window.setTimeout(function(){var o=false;var T=true;var A=null;A=function(){q(this).off("webkitAnimationEnd animationend");if(!o){o=true;}else{T=false;if(h(t)){t.removeStyleClass("sapMNavItemDooring").removeStyleClass("sapMNavItemDoorInNext");}if(h(f)){f.removeStyleClass("sapMNavItemDooring").addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemDoorInPrevious");}d.$().removeClass("sapMNavDoor");c();}};f.$().on("webkitAnimationEnd animationend",A);t.$().on("webkitAnimationEnd animationend",A);t.addStyleClass("sapMNavItemDooring");f.addStyleClass("sapMNavItemDooring").addStyleClass("sapMNavItemDoorInPrevious");window.setTimeout(function(){if(T){o=true;A.apply(f.$().add(t.$()));}},g(1000));},g(60));},0);},back:function(f,t,c){var d=this;d.$().addClass("sapMNavDoor");t.addStyleClass("sapMNavItemDoorOutNext");t.removeStyleClass("sapMNavItemHidden");window.setTimeout(function(){var o=false;var T=true;var A=null;A=function(){q(this).off("webkitAnimationEnd animationend");if(!o){o=true;}else{T=false;if(h(t)){t.removeStyleClass("sapMNavItemDooring").removeStyleClass("sapMNavItemDoorOutNext");}if(h(f)){f.removeStyleClass("sapMNavItemDooring").addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemDoorOutPrevious");}d.$().removeClass("sapMNavDoor");c();}};f.$().on("webkitAnimationEnd animationend",A);t.$().on("webkitAnimationEnd animationend",A);t.addStyleClass("sapMNavItemDooring");f.addStyleClass("sapMNavItemDooring").addStyleClass("sapMNavItemDoorOutPrevious");window.setTimeout(function(){if(T){o=true;A.apply(f.$().add(t.$()));}},g(1000));},g(60));}};b.prototype.addCustomTransition=function(n,t,B){if(b.transitions[n]){L.warning("Transition with name "+n+" already exists in "+this+". It is now being replaced by custom transition.");}b.transitions[n]={to:t,back:B};return this;};b.addCustomTransition=b.prototype.addCustomTransition;b.prototype.invalidate=function(S){if(S==this){}else if(S instanceof C){var I=false,p=this.getPages(),l=p.length;for(var i=0;i<l;i++){if(p[i]===S){I=true;break;}}if((!I||S===this.getCurrentPage())&&!this._isInsideAPopup()){C.prototype.invalidate.call(this,S);}}else{C.prototype.invalidate.call(this,S);}};b.prototype._isInsideAPopup=function(){var S;S=function(c){if(!c){return false;}if(c.getMetadata().isInstanceOf("sap.ui.core.PopupInterface")){return true;}return S(c.getParent());};return S(this);};b.prototype.removePage=function(p){var P;if(typeof(p)=="number"){P=this.getPages()[p];}else if(typeof(p)=="string"){P=sap.ui.getCore().byId(p);}else{P=p;}P=this.removeAggregation("pages",P,P!==this.getCurrentPage());this._onPageRemoved(P);return P;};b.prototype._onPageRemoved=function(p){if(!p){return;}p.$().remove();p.removeStyleClass("sapMNavItemHidden");p.removeStyleClass("sapMNavItem");var S=this._ensurePageStackInitialized();this._pageStack=S.filter(function(P){return p.getId()!==P.id;});};b.prototype.removeAllPages=function(){var p=this.removeAllAggregation("pages");for(var i=0;i<p.length;i++){this._onPageRemoved(p[i]);}return p;};b.prototype.addPage=function(p){var P=this.getPages();if(P.indexOf(p)>-1){return this;}this.addAggregation("pages",p,true);p.addStyleClass("sapMNavItem");var i=P.length;if(i===0&&this.getPages().length===1){this._fireAdaptableContentChange(p);if(this.getDomRef()){this._ensurePageStackInitialized();this.rerender();}}return this;};b.prototype.insertPage=function(p,i){var P=this.getPages().length;this.insertAggregation("pages",p,i,true);p.addStyleClass("sapMNavItem");if(P===0&&this.getPages().length===1){this._fireAdaptableContentChange(p);if(this.getDomRef()){this._ensurePageStackInitialized();this.rerender();}}return this;};b.prototype._getAdaptableContent=function(){return this.getCurrentPage();};b.prototype._fireAdaptableContentChange=function(p){if(p&&this.mEventRegistry["_adaptableContentChange"]){this.fireEvent("_adaptableContentChange",{"parent":this,"adaptableContent":p});}};return b;});
