/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ExtensionBase","../utils/TableUtils","../library","sap/ui/Device","sap/ui/performance/trace/Interaction","sap/base/Log","sap/ui/thirdparty/jquery"],function(E,T,l,D,I,L,q){"use strict";var S=l.SharedDomRef;var H=T.Hook.Keys;var c=T.createWeakMapFacade();var M=1000000;var V=2;var d={HORIZONAL:"HORIZONTAL",VERTICAL:"VERTICAL",BOTH:"BOTH"};function e(s,t){L.debug("sap.ui.table.extensions.Scrolling",s,t);}function f(a){return typeof a.isConnected==="boolean"&&a.isConnected||document.body.contains(a);}function P(a,p){var r=true;var C=false;var b=[];var s={cancel:function(){if(this.isCancelled()||!this.isRunning()){return;}C=true;for(var i=0;i<b.length;i++){b[i]();}e("Process cancelled: "+p.id);},isCancelled:function(){return C;},addCancelListener:function(i){b.push(i);},isRunning:function(){return r;},getInfo:function(){return p;},onPromiseCreated:function(i){}};var t;e("Process started: "+p.id);if(typeof a==="function"){t=new Promise(function(){a.apply(this,Array.prototype.slice.call(arguments).concat(s));});}else{t=Promise.resolve();}Object.assign(t,s);t.then(function(){if(s.isCancelled()){e("Process finished due to cancellation: "+p.id);}else{e("Process finished: "+p.id);}r=false;});s.onPromiseCreated(t);return t;}function g(){this.iIndex=0;this.nOffset=0;this.sOffsetType=g.OffsetType.Pixel;this.bIsInitial=true;}g.OffsetType={Pixel:"Pixel",Percentage:"Percentage",PercentageOfViewport:"PercentageOfViewport"};g.prototype.getIndex=function(){return this.iIndex;};g.prototype.getOffset=function(){return this.nOffset;};g.prototype.getOffsetType=function(){return this.sOffsetType;};g.prototype.isOffsetInPixel=function(){return this.sOffsetType===g.OffsetType.Pixel;};g.prototype.isInitial=function(){return this.bIsInitial;};g.prototype.setPosition=function(i,a,O){e("ScrollPosition#setPosition(index: "+i+", offset: "+a+", offsetType: "+O+")");if(!g._isPositiveNumber(i)){return;}if(!g._isPositiveNumber(a)){this.nOffset=0;}this.setIndex(i);this.setOffset(a,O);};g.prototype.setIndex=function(i){e("ScrollPosition#setIndex(index: "+i+")");if(!g._isPositiveNumber(i)){return;}this.bIsInitial=false;this.iIndex=i;};g.prototype.setOffset=function(a,O){e("ScrollPosition#setOffset(offset: "+a+", offsetType: "+O+")");if(!g._isPositiveNumber(a)){return;}this.bIsInitial=false;this.sOffsetType=O in g.OffsetType?O:g.OffsetType.Pixel;if(this.isOffsetInPixel()){this.nOffset=Math.round(a);}else{this.nOffset=Math.min(a,1);}};g.prototype.scrollRows=function(r){var N=this.getIndex()+r;var i=this.getOffset();if(!this.isOffsetInPixel()||N<0){i=0;}this.setPosition(Math.max(0,N),i);};g._isPositiveNumber=function(a){return typeof a==="number"&&!isNaN(a)&&a>=0;};var h={UpdateFromFirstVisibleRow:{id:"UpdateFromFirstVisibleRow",rank:6},UpdateFromScrollPosition:{id:"UpdateFromScrollPosition",rank:5},RestoreScrollPosition:{id:"RestoreScrollPosition",rank:4},AdjustToTotalRowCount:{id:"AdjustToTotalRowCount",rank:3},OnRowsUpdated:{id:"OnRowsUpdated",rank:3},UpdateFromScrollbar:{id:"UpdateFromScrollbar",rank:2},UpdateFromViewport:{id:"UpdateFromViewport",rank:1},canStart:function(t,p){var a=c(t).pVerticalScrollUpdateProcess;var C=a?a.getInfo():null;if(a&&a.isRunning()&&C.rank>p.rank){e("Cannot start update process "+p.id+" - A higher-ranked update process is currently running ("+C.id+")",t);return false;}return true;},start:function(t,p,a){if(!h.canStart(t,p)){return;}if(c(t).pVerticalScrollUpdateProcess){c(t).pVerticalScrollUpdateProcess.cancel();}c(t).pVerticalScrollUpdateProcess=new P(a,p);}};var j={onScrollbarScroll:function(a){var N=a.target.scrollLeft;var O=a.target._scrollLeft;I.notifyScrollEvent&&I.notifyScrollEvent(a);if(N!==O){var s=j.getScrollAreas(this);a.target._scrollLeft=N;for(var i=0;i<s.length;i++){var b=s[i];if(b!==a.target&&b.scrollLeft!==N){b.scrollLeft=N;b._scrollLeft=N;}}c(this).iHorizontalScrollPosition=N;}},restoreScrollPosition:function(t){var s=t._getScrollExtension();var a=s.getHorizontalScrollbar();if(a&&c(t).iHorizontalScrollPosition!==null){var b=j.getScrollAreas(t);for(var i=0;i<b.length;i++){var p=b[i];delete p._scrollLeft;}if(a.scrollLeft!==c(t).iHorizontalScrollPosition){a.scrollLeft=c(t).iHorizontalScrollPosition;}else{var r=q.Event("scroll");r.target=a;j.onScrollbarScroll.call(t,r);}}},onScrollbarMouseDown:function(a){this._getKeyboardExtension().setActionMode(false);},addEventListeners:function(t){var s=t._getScrollExtension();var a=s.getHorizontalScrollbar();var b=j.getScrollAreas(t);if(!s._onHorizontalScrollEventHandler){s._onHorizontalScrollEventHandler=j.onScrollbarScroll.bind(t);}for(var i=0;i<b.length;i++){b[i].addEventListener("scroll",s._onHorizontalScrollEventHandler);}if(a){if(!s._onHorizontalScrollbarMouseDownEventHandler){s._onHorizontalScrollbarMouseDownEventHandler=j.onScrollbarMouseDown.bind(t);}a.addEventListener("mousedown",s._onHorizontalScrollbarMouseDownEventHandler);}},removeEventListeners:function(t){var s=t._getScrollExtension();var a=s.getHorizontalScrollbar();var b=j.getScrollAreas(t);if(s._onHorizontalScrollEventHandler){for(var i=0;i<b.length;i++){b[i].removeEventListener("scroll",s._onHorizontalScrollEventHandler);delete b[i]._scrollLeft;}delete s._onHorizontalScrollEventHandler;}if(a&&s._onHorizontalScrollbarMouseDownEventHandler){a.removeEventListener("mousedown",s._onHorizontalScrollbarMouseDownEventHandler);delete s._onHorizontalScrollbarMouseDownEventHandler;}},getScrollAreas:function(t){var a=t.getDomRef();var s;if(a){s=Array.prototype.slice.call(t.getDomRef().querySelectorAll(".sapUiTableCtrlScr"));}var b=[t._getScrollExtension().getHorizontalScrollbar()].concat(s);return b.filter(function(i){return i!=null;});}};var k={performUpdateFromFirstVisibleRow:function(t,b){e("VerticalScrollingHelper.performUpdateFromFirstVisibleRow",t);h.start(t,h.UpdateFromFirstVisibleRow,function(r,a,p){T.Hook.call(t,H.Signal,"StartTableUpdate");p.onPromiseCreated=function(i){i.finally(function(){T.Hook.call(t,H.Signal,"EndTableUpdate");});};if(b===true){var O=function(){e("VerticalScrollingHelper.performUpdateFromFirstVisibleRow (async: rows update)",t);k._performUpdateFromFirstVisibleRow(t,p).then(r);return false;};k.addOnRowsUpdatedPreprocessor(t,O);p.addCancelListener(function(){var R=k.removeOnRowsUpdatedPreprocessor(t,O);if(R){r();}});}else{k._performUpdateFromFirstVisibleRow(t,p).then(r);}});},_performUpdateFromFirstVisibleRow:function(t,p){return k.adjustScrollPositionToFirstVisibleRow(t,p).then(function(){return k.fixTemporaryFirstVisibleRow(t,null,p);}).then(function(){return k.fixScrollPosition(t,p);}).then(function(){return Promise.all([k.scrollViewport(t,p),k.scrollScrollbar(t,p)]);});},performUpdateFromScrollPosition:function(t){e("VerticalScrollingHelper.performUpdateFromScrollPosition",t);h.start(t,h.UpdateFromScrollPosition,function(r,a,p){T.Hook.call(t,H.Signal,"StartTableUpdate");p.onPromiseCreated=function(b){b.finally(function(){T.Hook.call(t,H.Signal,"EndTableUpdate");});};k.adjustFirstVisibleRowToScrollPosition(t,null,p).then(function(){if(p.isCancelled()){return;}var s=c(t).oVerticalScrollPosition;e("VerticalScrollingHelper.performUpdateFromScrollPosition (async: firstVisibleRow update)",t);if(s.getIndex()>t.getFirstVisibleRow()){s.setIndex(t.getFirstVisibleRow());if(T.isVariableRowHeightEnabled(t)){s.setOffset(1,g.OffsetType.Percentage);}else{s.setOffset(0);}}}).then(function(){return k.fixScrollPosition(t,p);}).then(function(){return Promise.all([k.scrollViewport(t,p),k.scrollScrollbar(t,p)]);}).then(r);});},performUpdateFromScrollbar:function(t){e("VerticalScrollingHelper.performUpdateFromScrollbar",t);clearTimeout(c(t).mTimeouts.largeDataScrolling);delete c(t).mTimeouts.largeDataScrolling;h.start(t,h.UpdateFromScrollbar,function(r,a,p){T.Hook.call(t,H.Signal,"StartTableUpdate");p.onPromiseCreated=function(b){b.finally(function(){T.Hook.call(t,H.Signal,"EndTableUpdate");});};t._getKeyboardExtension().setActionMode(false);if(t._bLargeDataScrolling){c(t).mTimeouts.largeDataScrolling=setTimeout(function(){delete c(t).mTimeouts.largeDataScrolling;if(t._getScrollExtension().getVerticalScrollbar()!=null){e("VerticalScrollingHelper.performUpdateFromScrollbar (async: large data scrolling)",t);k._performUpdateFromScrollbar(t,p).then(r);}else{e("VerticalScrollingHelper.performUpdateFromScrollbar (async: large data scrolling): No scrollbar",t);}},300);p.addCancelListener(function(){if(c(t).mTimeouts.largeDataScrolling!=null){clearTimeout(c(t).mTimeouts.largeDataScrolling);delete c(t).mTimeouts.largeDataScrolling;r();}});}else{k._performUpdateFromScrollbar(t,p).then(r);}});},_performUpdateFromScrollbar:function(t,p){return k.adjustScrollPositionToScrollbar(t,p).then(function(){return k.adjustFirstVisibleRowToScrollPosition(t,null,p);}).then(function(){return k.fixScrollPosition(t,p);}).then(function(){return k.scrollViewport(t,p);});},performUpdateFromViewport:function(t){e("VerticalScrollingHelper.performUpdateFromViewport",t);h.start(t,h.UpdateFromViewport,function(r,a,p){T.Hook.call(t,H.Signal,"StartTableUpdate");p.onPromiseCreated=function(b){b.finally(function(){T.Hook.call(t,H.Signal,"EndTableUpdate");});};k.adjustScrollPositionToViewport(t,p).then(function(){return k.adjustFirstVisibleRowToScrollPosition(t,true,p);}).then(function(){return k.scrollScrollbar(t,p);}).then(r);});},onScrollbarScroll:function(a){I.notifyScrollEvent&&I.notifyScrollEvent(a);var b=a.target.scrollTop;var i=a.target._scrollTop;var s=b!==i;delete a.target._scrollTop;if(b===0&&!f(a.target)){e("VerticalScrollingHelper.onScrollbarScroll: Scrollbar is not connected with the DOM",this);}else if(s){e("VerticalScrollingHelper.onScrollbarScroll: Scroll position changed to "+b+" by interaction",this);k.performUpdateFromScrollbar(this);}else{e("VerticalScrollingHelper.onScrollbarScroll: Scroll position changed to "+b+" by API",this);}},onViewportScroll:function(a){if(!h.canStart(this,h.UpdateFromViewport)){return;}var b=a.target.scrollTop;var i=a.target._scrollTop;delete a.target._scrollTop;if(b!==i){e("VerticalScrollingHelper.onViewportScroll: Scroll position changed to "+b+" by interaction",this);k.performUpdateFromViewport(this);}else{e("VerticalScrollingHelper.onViewportScroll: Scroll position changed to "+b+" by API",this);}},adjustFirstVisibleRowToScrollPosition:function(t,s,p){if(p&&p.isCancelled()){return Promise.resolve();}s=s===true;var a=c(t).oVerticalScrollPosition;var O=a.getOffsetType()===g.OffsetType.PercentageOfViewport;var N=a.getIndex();var i=t.getFirstVisibleRow();var b=k.isIndexInBuffer(t,N);var r=b||O;e("VerticalScrollingHelper.adjustFirstVisibleRowToScrollPosition:"+" Set \"firstVisibleRow\" from "+i+" to "+N,t);var u=t._setFirstVisibleRowIndex(N,{onScroll:true,suppressEvent:r,suppressRendering:s});if(!u){if(r){return k.fixTemporaryFirstVisibleRow(t,true,p);}return Promise.resolve();}return new Promise(function(v){var w=function(x){e("VerticalScrollingHelper.adjustFirstVisibleRowToScrollPosition (async: rows updated):"+" Reason "+x.getParameters().reason,this);if(r){k.fixTemporaryFirstVisibleRow(t,true,p).then(v);}else{v();}return false;};k.addOnRowsUpdatedPreprocessor(t,w);if(p){p.addCancelListener(function(){var R=k.removeOnRowsUpdatedPreprocessor(t,w);if(R){v();}});}});},fixTemporaryFirstVisibleRow:function(t,F,p){if(p&&p.isCancelled()){return Promise.resolve();}F=F===true;var s=c(t).oVerticalScrollPosition;var O=s.getOffsetType()===g.OffsetType.PercentageOfViewport;var i=s.getIndex();var b=k.isIndexInBuffer(t,i);var a=b||O;if(!a){e("VerticalScrollingHelper.fixTemporaryFirstVisibleRow: Aborted - The index is already final",t);return Promise.resolve();}var N=i;var v=k.getScrollRangeOfViewport(t);var r=t._getMaxFirstRenderedRowIndex();var R=t._aRowHeights;var u;e("VerticalScrollingHelper.fixTemporaryFirstVisibleRow",t);if(O){var w=v*s.getOffset();if(b){N=r;}for(u=0;u<R.length;u++){var x=w-R[u];if(x>=0){w=x;N++;}else{break;}}}else if(b){var y=Math.max(0,Math.min(R.length-1,i-r));var z=0;for(u=0;u<y;u++){z+=R[u];if(z>v){N=r+u;break;}}}if(i!==N||F){e("VerticalScrollingHelper.fixTemporaryFirstVisibleRow: Set \"firstVisibleRow\" to "+N,t);t._setFirstVisibleRowIndex(N,{onScroll:true,forceEvent:F,suppressRendering:true});}return Promise.resolve();},adjustScrollPositionToFirstVisibleRow:function(t,p){if(p&&p.isCancelled()){return Promise.resolve();}e("VerticalScrollingHelper.adjustScrollPositionToFirstVisibleRow",t);c(t).oVerticalScrollPosition.setPosition(t.getFirstVisibleRow());return Promise.resolve();},adjustScrollPositionToScrollbar:function(t,p){if(p&&p.isCancelled()){return Promise.resolve();}var s=c(t).oVerticalScrollPosition;var a=k.getScrollPositionOfScrollbar(t);var i=k.getScrollRange(t);var b=k.getScrollRangeRowFraction(t);var N=0;var r=0;var u=g.OffsetType.Percentage;var v;e("VerticalScrollingHelper.adjustScrollPositionToScrollbar",t);if(T.isVariableRowHeightEnabled(t)){if(k.isScrollPositionOfScrollbarInBuffer(t)){var B=k.getScrollRangeBuffer(t);var w=i-B;var x=a-w;var y=x/B;N=t._getMaxFirstRenderedRowIndex();if(k.isIndexInBuffer(t,s.getIndex())){var z=k.getScrollRangeOfViewport(t);var A=z*y;var R=t._aRowHeights;for(var C=0;C<R.length;C++){var F=A-R[C];if(F>=0){A=F;N++;}else{r=Math.round(A);u=g.OffsetType.Pixel;break;}}}else{r=y;u=g.OffsetType.PercentageOfViewport;}}else{v=a/b;N=Math.floor(v);r=v-N;}}else{var G=i-a;var J=G<1;if(J){N=t._getMaxFirstVisibleRowIndex();r=0;u=g.OffsetType.Pixel;}else{v=a/b;N=Math.floor(v);r=v-N;}}s.setPosition(N,r,u);return Promise.resolve();},adjustScrollPositionToViewport:function(t,p){if(p&&p.isCancelled()){return Promise.resolve();}var s=c(t).oVerticalScrollPosition;var r=t._aRowHeights;var N=t._getFirstRenderedRowIndex();var i=0;var a=k.getScrollPositionOfViewport(t);e("VerticalScrollingHelper.adjustScrollPositionToViewport",t);for(var R=0;R<r.length;R++){var b=a-r[R];if(b>=0){a=b;N++;}else{i=Math.round(a);break;}}s.setPosition(N,i);return Promise.resolve();},fixScrollPosition:function(t,p){if(p&&p.isCancelled()){return Promise.resolve();}var s=c(t).oVerticalScrollPosition;var v=t.getDomRef("tableCCnt");var i=k.getScrollRangeOfViewport(t);var r=t._aRowHeights;if(!v||!t.getBinding()){e("VerticalScrollingHelper.fixScrollPosition: Aborted - Viewport or binding not available",t);return Promise.resolve();}e("VerticalScrollingHelper.fixScrollPosition",t);var N=s.getIndex();var a=s.getOffset();var b=0;var R;var F=t._getFirstRenderedRowIndex();switch(s.getOffsetType()){case g.OffsetType.Pixel:case g.OffsetType.Percentage:var u=s.getIndex();var w=0;var C=s.getOffsetType();if(k.isIndexInBuffer(t,u)){var x=0;b=Math.max(0,Math.min(r.length-1,u-F));for(R=0;R<b;R++){x+=r[R];if(x>i){N=F+R;a=i-w;C=g.OffsetType.Pixel;b=R;break;}else{w=x;}}}if(C===g.OffsetType.Pixel){a=Math.min(a,r[b]);}else{a=r[b]*a;}w+=a;if(w>i&&T.isVariableRowHeightEnabled(t)){a-=w-i;}break;case g.OffsetType.PercentageOfViewport:var y=i*s.getOffset();for(R=0;R<r.length;R++){var z=y-r[R];if(z>=0){y=z;b++;}else{N=F+b;a=Math.round(y);break;}}break;default:}s.setPosition(N,a);return Promise.resolve();},scrollViewport:function(t,p){if(p&&p.isCancelled()){return Promise.resolve();}if(!T.isVariableRowHeightEnabled(t)){e("VerticalScrollingHelper.scrollViewport: Aborted - Variable row height not enabled",t);return Promise.resolve();}var s=c(t).oVerticalScrollPosition;var v=t.getDomRef("tableCCnt");var i=k.getScrollRangeOfViewport(t);var r=t._aRowHeights;var a=0;if(i===0){e("VerticalScrollingHelper.scrollViewport: Aborted - No overflow in viewport",t);v.scrollTop=a;v._scrollTop=v.scrollTop;return Promise.resolve();}e("VerticalScrollingHelper.scrollViewport",t);switch(s.getOffsetType()){case g.OffsetType.Pixel:var b=s.getIndex();var u=Math.max(0,Math.min(r.length-1,b-t._getFirstRenderedRowIndex()));for(var R=0;R<u;R++){a+=r[R];}a+=s.getOffset();break;default:e("VerticalScrollingHelper.scrollViewport: The viewport can only be scrolled if the offset is in pixel",t);return Promise.resolve();}e("VerticalScrollingHelper.scrollViewport: Scroll from "+v.scrollTop+" to "+a,t);v.scrollTop=a;v._scrollTop=v.scrollTop;return Promise.resolve();},scrollScrollbar:function(t,p){if(p&&p.isCancelled()){return Promise.resolve();}var s=c(t).oVerticalScrollPosition;var i=s.getIndex();var b=k.getScrollRangeBuffer(t);var a=k.getScrollRange(t);var r=a-b;var u=0;var v=0;var w=k.getScrollRangeOfViewport(t);var R=t._aRowHeights;var x;e("VerticalScrollingHelper.scrollScrollbar",t);if(a===0||R.length===0){e("VerticalScrollingHelper.scrollScrollbar: No scrollable content",t);return Promise.resolve();}switch(s.getOffsetType()){case g.OffsetType.Pixel:if(k.isIndexInBuffer(t,i)){var y=0;x=Math.max(0,Math.min(R.length-1,i-t._getMaxFirstRenderedRowIndex()));for(var z=0;z<x;z++){y+=R[z];}y+=Math.min(R[x],s.getOffset());var A=Math.min(y/w,1);var B=b*A;u=r+B;}else{var C=k.getScrollRangeRowFraction(t);u=i*C;x=Math.max(0,Math.min(R.length-1,i-t._getFirstRenderedRowIndex()));u+=C*Math.min(s.getOffset()/R[x],1);}break;default:e("VerticalScrollingHelper.scrollViewport: The scrollbar can only be scrolled if the offset is in pixel",t);return Promise.resolve();}if(u>0&&u<0.5){v=1;}else if(u>=a-0.5&&u<a){v=a-1;}else{v=Math.round(u);}var F=t._getScrollExtension().getVerticalScrollbar();if(F){e("VerticalScrollingHelper.scrollScrollbar: Scroll from "+F.scrollTop+" to "+v,t);F.scrollTop=v;F._scrollTop=F.scrollTop;}else{e("VerticalScrollingHelper.scrollScrollbar: Not scrolled - No scrollbar available",t);}return Promise.resolve();},getScrollRange:function(t){var s=t._getScrollExtension();var v=s.getVerticalScrollHeight()-s.getVerticalScrollbarHeight();return Math.max(0,v);},getScrollRangeBuffer:function(t){if(!T.isVariableRowHeightEnabled(t)){return 0;}return V*t._getBaseRowHeight();},getScrollPositionOfScrollbar:function(t){var s=t._getScrollExtension();if(s.isVerticalScrollbarVisible()){return s.getVerticalScrollbar().scrollTop;}else{return 0;}},getScrollPositionOfViewport:function(t){var v=t?t.getDomRef("tableCCnt"):null;return v?v.scrollTop:0;},getScrollRangeRowFraction:function(t){var s=t._getScrollExtension();var v=t._getTotalRowCount()-t._getRowCounts()._fullsize;var i;if(T.isVariableRowHeightEnabled(t)){i=k.getScrollRange(t)-k.getScrollRangeBuffer(t);var b=s.getVerticalScrollHeight()===M;if(!b){i+=t._getBaseRowHeight();}}else{i=k.getScrollRange(t);}return i/Math.max(1,v);},isScrollPositionOfScrollbarInBuffer:function(t){if(!T.isVariableRowHeightEnabled(t)){return false;}var s=k.getScrollRange(t);var a=k.getScrollPositionOfScrollbar(t);var i=k.getScrollRangeBuffer(t);return s-a<=i;},isIndexInBuffer:function(t,i){if(!T.isVariableRowHeightEnabled(t)){return false;}return i>=t._getMaxFirstRenderedRowIndex();},getScrollRangeOfViewport:function(t){if(!t||!t._aRowHeights){return 0;}var r=t._aRowHeights;var v=t._getBaseRowHeight()*t._getRowCounts()._fullsize;if(t._getRowCounts()._fullsize>=t._getTotalRowCount()){r=r.slice(0,t._getTotalRowCount());}var i=r.reduce(function(a,b){return a+b;},0)-v;if(i>0){i=Math.ceil(i);}return Math.max(0,i);},addOnRowsUpdatedPreprocessor:function(t,p){c(t).aOnRowsUpdatedPreprocessors.push(p);},removeOnRowsUpdatedPreprocessor:function(t,p){if(!p){c(t).aOnRowsUpdatedPreprocessors=[];return false;}var i=c(t).aOnRowsUpdatedPreprocessors.indexOf(p);if(i>-1){c(t).aOnRowsUpdatedPreprocessors.splice(i,1);return true;}return false;},onRowsUpdated:function(a){e("VerticalScrollingHelper.onRowsUpdated: Reason "+a.getParameters().reason,this);this._getScrollExtension().updateVerticalScrollbarVisibility();if(c(this).aOnRowsUpdatedPreprocessors.length>0){e("VerticalScrollingHelper.onRowsUpdated (preprocessors)",this);var b=c(this).aOnRowsUpdatedPreprocessors.reduce(function(b,p){var _=p.call(this,a);return!(b&&!_);},true);k.removeOnRowsUpdatedPreprocessor(this);if(!b){e("VerticalScrollingHelper.onRowsUpdated (preprocessors): Default prevented",this);return;}}if(!T.isVariableRowHeightEnabled(this)){e("VerticalScrollingHelper.onRowsUpdated: Aborted - Variable row heights not enabled",this);return;}var t=this;h.start(this,h.OnRowsUpdated,function(r,i,p){T.Hook.call(t,H.Signal,"StartTableUpdate");p.onPromiseCreated=function(s){s.finally(function(){T.Hook.call(t,H.Signal,"EndTableUpdate");});};k.fixScrollPosition(t,p).then(function(){return Promise.all([k.adjustFirstVisibleRowToScrollPosition(t,true,p),k.scrollViewport(t,p),k.scrollScrollbar(t,p)]);}).then(r);});},restoreScrollPosition:function(t,b){e("VerticalScrollingHelper.restoreScrollPosition",t);h.start(t,h.RestoreScrollPosition,function(r,a,p){T.Hook.call(t,H.Signal,"StartTableUpdate");p.onPromiseCreated=function(i){i.then(function(){if(!p.isCancelled()){k._restoreScrollPosition(t);}}).finally(function(){T.Hook.call(t,H.Signal,"EndTableUpdate");});};if(b!==true){r();return;}var O=function(){e("VerticalScrollingHelper.restoreScrollPosition (async: rows updated)",t);r();return false;};k.addOnRowsUpdatedPreprocessor(t,O);p.addCancelListener(function(){var R=k.removeOnRowsUpdatedPreprocessor(t,O);if(R){r();}});});},_restoreScrollPosition:function(t){var s=c(t).oVerticalScrollPosition;var b=s.isInitial();e("VerticalScrollingHelper.restoreScrollPosition: "+"Scroll position is"+(b?" ":" not ")+"initial",t);if(b){k.performUpdateFromFirstVisibleRow(t);}else{k.performUpdateFromScrollPosition(t);}},adjustToTotalRowCount:function(t){var s=t._getScrollExtension();e("VerticalScrollingHelper.adjustToTotalRowCount",t);s.updateVerticalScrollbarVisibility();s.updateVerticalScrollHeight();h.start(t,h.AdjustToTotalRowCount,function(r,a,p){T.Hook.call(t,H.Signal,"StartTableUpdate");p.onPromiseCreated=function(b){b.then(function(){if(p.isCancelled()||c(t).oVerticalScrollPosition.isInitial()){return;}k.performUpdateFromScrollPosition(t);}).finally(function(){T.Hook.call(t,H.Signal,"EndTableUpdate");});};if(c(t).oVerticalScrollPosition.isInitial()){r();}else{var O=function(){e("VerticalScrollingHelper.adjustToTotalRowCount (async: rows updated)",t);r();return false;};k.addOnRowsUpdatedPreprocessor(t,O);p.addCancelListener(function(){var R=k.removeOnRowsUpdatedPreprocessor(t,O);if(R){r();}});}});},addEventListeners:function(t){var s=t._getScrollExtension();var a=k.getScrollAreas(t);var v=t.getDomRef("tableCCnt");if(!s._onVerticalScrollEventHandler){s._onVerticalScrollEventHandler=k.onScrollbarScroll.bind(t);}for(var i=0;i<a.length;i++){a[i].addEventListener("scroll",s._onVerticalScrollEventHandler);}if(v){if(!s._onViewportScrollEventHandler){s._onViewportScrollEventHandler=k.onViewportScroll.bind(t);}v.addEventListener("scroll",s._onViewportScrollEventHandler);}t.attachRowsUpdated(k.onRowsUpdated);},removeEventListeners:function(t){var s=t._getScrollExtension();var a=k.getScrollAreas(t);var v=t.getDomRef("tableCCnt");if(s._onVerticalScrollEventHandler){for(var i=0;i<a.length;i++){a[i].removeEventListener("scroll",s._onVerticalScrollEventHandler);}delete s._onVerticalScrollEventHandler;}if(v&&s._onViewportScrollEventHandler){v.removeEventListener("scroll",s._onViewportScrollEventHandler);delete s._onViewportScrollEventHandler;}t.detachRowsUpdated(k.onRowsUpdated);},getScrollAreas:function(t){var s=[t._getScrollExtension().getVerticalScrollbar()];return s.filter(function(a){return a!=null;});}};var m={onMouseWheelScrolling:function(O,a){var s=this._getScrollExtension();var v=Math.abs(a.deltaY)>Math.abs(a.deltaX);var i=v?a.deltaY:a.deltaX;var b=v&&a.shiftKey||!v;var p=i>0;var r=false;if(i===0){return;}if(b&&(O.scrollDirection===d.HORIZONAL||O.scrollDirection===d.BOTH)){var t=s.getHorizontalScrollbar();if(a.deltaMode!==window.WheelEvent.DOM_DELTA_PIXEL){var u=T.Column.getMinColumnWidth();i=p?u:-u;}if(p){r=t.scrollLeft===t.scrollWidth-t.offsetWidth;}else{r=t.scrollLeft===0;}if(s.isHorizontalScrollbarVisible()&&!r){a.preventDefault();a.stopPropagation();this._getKeyboardExtension().setActionMode(false);t.scrollLeft=t.scrollLeft+i;}}else if(!b&&(O.scrollDirection===d.VERTICAL||O.scrollDirection===d.BOTH)){var w=s.getVerticalScrollbar();var x=c(this).oVerticalScrollPosition;if(p){r=w.scrollTop===w.scrollHeight-w.offsetHeight;}else{r=w.scrollTop===0;}if(!s.isVerticalScrollbarVisible()||r){return;}a.preventDefault();a.stopPropagation();if(a.deltaMode===window.WheelEvent.DOM_DELTA_PIXEL){var y=i/this._getDefaultRowHeight();if(y>=0){x.scrollRows(Math.max(1,Math.floor(y)));}else{x.scrollRows(Math.min(-1,Math.ceil(y)));}}else if(a.deltaMode===window.WheelEvent.DOM_DELTA_LINE){x.scrollRows(i);}else if(a.deltaMode===window.WheelEvent.DOM_DELTA_PAGE){x.scrollRows(i*this._getRowCounts()._scrollSize);}this._getKeyboardExtension().setActionMode(false);k.performUpdateFromScrollPosition(this);}},onTouchStart:function(O,a){if(a.type==="touchstart"||a.pointerType==="touch"){var s=this._getScrollExtension();var b=s.getHorizontalScrollbar();var v=s.getVerticalScrollbar();var t=a.touches?a.touches[0]:a;c(this).mTouchSessionData={initialPageX:t.pageX,initialPageY:t.pageY,initialScrollTop:v?v.scrollTop:0,initialScrollLeft:b?b.scrollLeft:0,initialScrolledToEnd:null,touchMoveDirection:null};}},onTouchMoveScrolling:function(O,a){if(a.type!=="touchmove"&&a.pointerType!=="touch"){return;}var s=this._getScrollExtension();var t=c(this).mTouchSessionData;if(!t){return;}var b=a.touches?a.touches[0]:a;var i=(b.pageX-t.initialPageX);var p=(b.pageY-t.initialPageY);var r=false;if(!t.touchMoveDirection){if(i===0&&p===0){return;}t.touchMoveDirection=Math.abs(i)>Math.abs(p)?"horizontal":"vertical";}switch(t.touchMoveDirection){case"horizontal":var u=s.getHorizontalScrollbar();if(u&&(O.scrollDirection===d.HORIZONAL||O.scrollDirection===d.BOTH)){this._getKeyboardExtension().setActionMode(false);if(t.initialScrolledToEnd==null){if(i<0){t.initialScrolledToEnd=u.scrollLeft===u.scrollWidth-u.offsetWidth;}else{t.initialScrolledToEnd=u.scrollLeft===0;}}if(!t.initialScrolledToEnd){u.scrollLeft=t.initialScrollLeft-i;r=true;}}break;case"vertical":var v=s.getVerticalScrollbar();if(v&&(O.scrollDirection===d.VERTICAL||O.scrollDirection===d.BOTH)){this._getKeyboardExtension().setActionMode(false);if(t.initialScrolledToEnd==null){if(p<0){t.initialScrolledToEnd=v.scrollTop===v.scrollHeight-v.offsetHeight;}else{t.initialScrolledToEnd=v.scrollTop===0;}}if(!t.initialScrolledToEnd){v.scrollTop=t.initialScrollTop-p;r=true;}}break;default:}if(r){a.preventDefault();}},addEventListeners:function(t){var s=t._getScrollExtension();var a=m.getEventListenerTargets(t);s._mMouseWheelEventListener=this.addMouseWheelEventListener(a,t,{scrollDirection:d.BOTH});s._mTouchEventListener=this.addTouchEventListener(a,t,{scrollDirection:d.BOTH});},addMouseWheelEventListener:function(a,t,O){var b=m.onMouseWheelScrolling.bind(t,O);for(var i=0;i<a.length;i++){a[i].addEventListener("wheel",b);}return{wheel:b};},addTouchEventListener:function(a,t,O){var b=m.onTouchStart.bind(t,O);var p=m.onTouchMoveScrolling.bind(t,O);var r={};for(var i=0;i<a.length;i++){if(D.support.pointer&&D.system.desktop){a[i].addEventListener("pointerdown",b);a[i].addEventListener("pointermove",p,D.browser.chrome?{passive:true}:false);}else if(D.support.touch){a[i].addEventListener("touchstart",b);a[i].addEventListener("touchmove",p);}}if(D.support.pointer&&D.system.desktop){r={pointerdown:b,pointermove:p};}else if(D.support.touch){r={touchstart:b,touchmove:p};}return r;},removeEventListeners:function(t){var s=t._getScrollExtension();var a=m.getEventListenerTargets(t);function r(b,p){for(var u in p){var v=p[u];if(v){b.removeEventListener(u,v);}}}for(var i=0;i<a.length;i++){r(a[i],s._mMouseWheelEventListener);r(a[i],s._mTouchEventListener);}delete s._mMouseWheelEventListener;delete s._mTouchEventListener;},getEventListenerTargets:function(t){var a=[t.getDomRef("tableCCnt")];return a.filter(function(b){return b!=null;});}};var n={onBeforeRendering:function(a){this._getScrollExtension()._clearCache();},onAfterRendering:function(a){var s=this._getScrollExtension();var r=a!=null&&a.isMarked("renderRows");if(r){s.updateVerticalScrollbarHeight();s.updateVerticalScrollHeight();}else{k.restoreScrollPosition(this,this.getBinding()!=null);}j.restoreScrollPosition(this);},onfocusin:function(a){var r;var C=T.getCellInfo(a.target);var b=this._getScrollExtension().getHorizontalScrollbar();if(C.isOfType(T.CELLTYPE.DATACELL)){r=this.getDomRef("sapUiTableCtrlScr");}else if(C.isOfType(T.CELLTYPE.COLUMNHEADER)){r=this.getDomRef("sapUiTableColHdrScr");}if(r&&b&&C.columnIndex>=this.getComputedFixedColumnCount()){var $=q(b);var i=C.cell[0];var p=this._bRtlMode?$.scrollLeftRTL():b.scrollLeft;var R=r.clientWidth;var s=i.offsetLeft;var t=s+i.offsetWidth;var O=s-p;var u=t-R-p;var N;if(O<0&&u<0){N=p+O;}else if(u>0&&O>0){N=p+u;}if(N!=null){if(this._bRtlMode){$.scrollLeftRTL(N);}else{b.scrollLeft=N;}}}var v=T.getParentCell(this,a.target);if(v){var w=this;var x=function(){var y=v.find(".sapUiTableCellInner");if(y.length>0){if(w._bRtlMode){y.scrollLeftRTL(y[0].scrollWidth-y[0].clientWidth);}else{y[0].scrollLeft=0;}y[0].scrollTop=0;}T.Hook.call(w,H.Signal,"EndFocusHandling");T.Hook.call(w,H.Signal,"EndTableUpdate");};T.Hook.call(this,H.Signal,"StartTableUpdate");T.Hook.call(this,H.Signal,"StartFocusHandling");Promise.resolve().then(function(){if(D.browser.safari){window.setTimeout(x,0);}else{x();}});}}};var o=E.extend("sap.ui.table.extensions.Scrolling",{_init:function(t,s,a){var _=c(t);_.oHorizontalScrollbar=null;_.iHorizontalScrollPosition=null;_.oVerticalScrollbar=null;_.oVerticalScrollPosition=new g(t);_.pVerticalScrollUpdateProcess=null;_.oExternalVerticalScrollbar=null;_.bIsVerticalScrollbarExternal=false;_.mTimeouts={};_.mAnimationFrames={};_.mTouchSessionData=null;_.aOnRowsUpdatedPreprocessors=[];T.addDelegate(t,n,t);return"ScrollExtension";},_attachEvents:function(){var t=this.getTable();j.addEventListeners(t);k.addEventListeners(t);m.addEventListeners(t);},_detachEvents:function(){var t=this.getTable();j.removeEventListeners(t);k.removeEventListeners(t);m.removeEventListeners(t);},destroy:function(){var t=this.getTable();this._clearCache();if(t){T.removeDelegate(t,n);if(c(t).pVerticalScrollUpdateProcess){c(t).pVerticalScrollUpdateProcess.cancel();c(t).pVerticalScrollUpdateProcess=null;}}E.prototype.destroy.apply(this,arguments);}});o.prototype.scrollVertically=function(b,p){var t=this.getTable();if(!t){return;}var r=t._getRowCounts();var F=t._getFirstRenderedRowIndex();var s=p===true?r.scrollable:1;if(b===true){c(t).oVerticalScrollPosition.setPosition(F+s,1,g.OffsetType.PercentageOfViewport);}else{c(t).oVerticalScrollPosition.setPosition(Math.max(0,F-s));}k.performUpdateFromScrollPosition(t);};o.prototype.scrollVerticallyMax=function(b){var t=this.getTable();if(!t){return;}if(b===true){c(t).oVerticalScrollPosition.setPosition(t._getMaxFirstRenderedRowIndex(),1,g.OffsetType.PercentageOfViewport);}else{c(t).oVerticalScrollPosition.setPosition(0);}k.performUpdateFromScrollPosition(t);};o.prototype.getHorizontalScrollbar=function(){var t=this.getTable();if(!t){return null;}if(!t._bInvalid&&!c(t).oHorizontalScrollbar){c(t).oHorizontalScrollbar=t.getDomRef(S.HorizontalScrollBar);}return c(t).oHorizontalScrollbar;};o.prototype.getVerticalScrollbar=function(i){var t=this.getTable();var b=this.isVerticalScrollbarExternal();if(!t){return null;}if(!t._bInvalid&&!c(t).oVerticalScrollbar){c(t).oVerticalScrollbar=t.getDomRef(S.VerticalScrollBar);if(!c(t).oVerticalScrollbar&&b){c(t).oVerticalScrollbar=c(t).oExternalVerticalScrollbar;}}var s=c(t).oVerticalScrollbar;if(s&&!b&&!i&&!f(s)){return null;}return s;};o.prototype.isHorizontalScrollbarVisible=function(){var a=this.getHorizontalScrollbar();return a!=null&&!a.classList.contains("sapUiTableHidden");};o.prototype.isVerticalScrollbarVisible=function(){var v=this.getVerticalScrollbar();return v!=null&&!v.classList.contains("sapUiTableHidden");};o.prototype.isVerticalScrollbarExternal=function(){var t=this.getTable();return t?c(t).bIsVerticalScrollbarExternal:false;};o.prototype.markVerticalScrollbarAsExternal=function(s){var t=this.getTable();if(t&&s){c(t).bIsVerticalScrollbarExternal=true;c(t).oExternalVerticalScrollbar=s;}};o.prototype.updateHorizontalScrollbar=function(t){var a=this.getTable();var b=this.getHorizontalScrollbar();if(!a||!b||!t){return;}var $=a.$();var C=t.tableCtrlScrollWidth;if(D.browser.safari){C=Math.max(C,a._getColumnsWidth(a.getComputedFixedColumnCount()));}var i=C>t.tableCtrlScrWidth;if(i){if(!this.isHorizontalScrollbarVisible()){$.addClass("sapUiTableHScr");b.classList.remove("sapUiTableHidden");if(D.browser.safari){var p=$.find(".sapUiTableCtrlScroll, .sapUiTableColHdrScr > .sapUiTableColHdr");p.outerWidth(C);}}var s=t.tableCtrlFixedWidth;if($.find(".sapUiTableRowHdrScr").length>0){s+=t.tableRowHdrScrWidth;}if(a._bRtlMode){b.style.marginRight=s+"px";b.style.marginLeft="";}else{b.style.marginLeft=s+"px";b.style.marginRight="";}var r=a.getDomRef("hsb-content");if(r){r.style.width=C+"px";}}if(!i&&this.isHorizontalScrollbarVisible()){$.removeClass("sapUiTableHScr");b.classList.add("sapUiTableHidden");if(D.browser.safari){$.find(".sapUiTableCtrlScroll, .sapUiTableColHdr").css("width","");}}};o.prototype.updateVerticalScrollbarHeight=function(){var t=this.getTable();var v=this.getVerticalScrollbar();if(!t||!v){return;}v.style.maxHeight=this.getVerticalScrollbarHeight()+"px";v._scrollTop=v.scrollTop;};o.prototype.getVerticalScrollbarHeight=function(){var t=this.getTable();if(!t){return 0;}return t._getRowCounts()._scrollSize*t._getBaseRowHeight();};o.prototype.updateVerticalScrollbarPosition=function(){var t=this.getTable();var v=this.getVerticalScrollbar();if(!t||!v){return;}var a=t.getDomRef("tableCCnt");if(a){var i=a.offsetTop;var b=t.getDomRef("vsb-bg");if(b){b.style.top=i+"px";}if(t._getRowCounts().fixedTop>0){i+=t._iVsbTop;}v.style.top=i+"px";}};o.prototype.updateVerticalScrollPosition=function(b){var t=this.getTable();if(!t){return;}b=b===true;if(b||t.getBinding()){k.performUpdateFromFirstVisibleRow(t,b);}else{k.adjustScrollPositionToFirstVisibleRow(t);}};o.prototype.adjustToTotalRowCount=function(){k.adjustToTotalRowCount(this.getTable());};o.prototype.restoreVerticalScrollPosition=function(){k.restoreScrollPosition(this.getTable());};o.prototype.updateVerticalScrollHeight=function(){var v=this.getVerticalScrollbar();var a=v?v.firstChild:null;if(!a){return;}a.style.height=this.getVerticalScrollHeight()+"px";v._scrollTop=v.scrollTop;};o.prototype.getVerticalScrollHeight=function(b){var t=this.getTable();if(!t){return 0;}var i=t._getTotalRowCount();var r=t._getRowCounts();var R=Math.max(i,r.count);var B=t._getBaseRowHeight();var s;if(T.isVariableRowHeightEnabled(t)){s=B*(R-1)+k.getScrollRangeBuffer(t);}else{s=B*R;}if(b===true){return s;}else{return Math.min(M,s);}};o.prototype.updateVerticalScrollbarVisibility=function(){var t=this.getTable();var a=t?t.getDomRef():null;var v=this.getVerticalScrollbar();if(!a||!v){return;}var b=this.isVerticalScrollbarRequired();if(b&&!this.isVerticalScrollbarVisible()){if(!this.isVerticalScrollbarExternal()){a.classList.add("sapUiTableVScr");}v.classList.remove("sapUiTableHidden");}if(!b&&this.isVerticalScrollbarVisible()){a.classList.remove("sapUiTableVScr");v.classList.add("sapUiTableHidden");}};o.prototype.isVerticalScrollbarRequired=function(){var t=this.getTable();if(!t){return false;}return T.isVariableRowHeightEnabled(t)&&k.getScrollRangeOfViewport(t)>0||t._getTotalRowCount()>t._getRowCounts()._fullsize;};o.prototype.registerForMouseWheel=function(a,O){var t=this.getTable();if(E.isEnrichedWith(t,"sap.ui.table.extensions.Synchronization")){return m.addMouseWheelEventListener(a,t,O);}else{L.error("This method can only be used with synchronization enabled.",t,"sap.ui.table.extensions.Scrolling#registerForMouseWheel");return null;}};o.prototype.registerForTouch=function(a,O){var t=this.getTable();if(E.isEnrichedWith(t,"sap.ui.table.extensions.Synchronization")){return m.addTouchEventListener(a,t,O);}else{L.error("This method can only be used with synchronization enabled.",t,"sap.ui.table.extensions.Scrolling#registerForTouch");return null;}};o.prototype._clearCache=function(){var t=this.getTable();if(!t){return;}c(t).oVerticalScrollbar=null;c(t).oHorizontalScrollbar=null;};o.ScrollDirection=d;return o;});
