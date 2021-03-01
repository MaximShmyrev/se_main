/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Element','sap/ui/core/Renderer','sap/ui/core/library','sap/ui/Device',"sap/ui/thirdparty/jquery"],function(l,E,R,c,D,q){"use strict";var P=l.PopinDisplay;var V=c.VerticalAlign;var T=c.TextAlign;var S=c.SortOrder;var C=E.extend("sap.m.Column",{metadata:{library:"sap.m",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},hAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:T.Begin},vAlign:{type:"sap.ui.core.VerticalAlign",group:"Appearance",defaultValue:V.Inherit},styleClass:{type:"string",group:"Appearance",defaultValue:null},visible:{type:"boolean",group:"Appearance",defaultValue:true},minScreenWidth:{type:"string",group:"Behavior",defaultValue:null},demandPopin:{type:"boolean",group:"Behavior",defaultValue:false},popinHAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:T.Begin,deprecated:true},popinDisplay:{type:"sap.m.PopinDisplay",group:"Appearance",defaultValue:P.Block},mergeDuplicates:{type:"boolean",group:"Behavior",defaultValue:false},mergeFunctionName:{type:"string",group:"Misc",defaultValue:'getText'},sortIndicator:{type:"sap.ui.core.SortOrder",group:"Appearance",defaultValue:S.None},importance:{type:"sap.ui.core.Priority",group:"Behavior",defaultValue:"None"},autoPopinWidth:{type:"float",group:"Behavior",defaultValue:8}},defaultAggregation:"header",aggregations:{header:{type:"sap.ui.core.Control",multiple:false},footer:{type:"sap.ui.core.Control",multiple:false}},designtime:"sap/m/designtime/Column.designtime"}});C.prototype._index=-1;C.prototype._screen="";C.prototype._media=null;C.prototype._bForcedColumn=false;C.prototype.exit=function(){this._clearMedia();};C.prototype.getTable=function(){var p=this.getParent();if(p&&p.isA("sap.m.Table")){return p;}};C.prototype.informTable=function(e,p,v){var t=this.getTable();if(t){var m="onColumn"+e;if(t[m]){t[m](this,p,v);}}};C.prototype.ontouchstart=function(e){this._bTouchStartMarked=e.isMarked();};C.prototype.ontap=function(e){if(!this._bTouchStartMarked&&!e.isMarked()){this.informTable("Press");}};C.prototype.onsapspace=function(e){if(e.srcControl===this){this.informTable("Press");e.preventDefault();}};C.prototype.onsapenter=C.prototype.onsapspace;C.prototype.invalidate=function(){var p=this.getParent();if(!p||!p.bOutput){return;}E.prototype.invalidate.apply(this,arguments);};C.prototype._clearMedia=function(){if(this._media&&this._minWidth){this._detachMediaContainerWidthChange(this._notifyResize,this,this.getId());D.media.removeRangeSet(this.getId());this._media=null;}};C.prototype._addMedia=function(){delete this._bShouldAddMedia;if(this._minWidth){D.media.initRangeSet(this.getId(),[parseFloat(this._minWidth)]);this._attachMediaContainerWidthChange(this._notifyResize,this,this.getId());this._media=this._getCurrentMediaContainerRange(this.getId());if(this._media){this._media.matches=!!this._media.from;}}};C.prototype._notifyResize=function(m){if(this._media.from===m.from){return;}this._media=m;this._media.matches=!!m.from;setTimeout(function(){this.fireEvent("media",this);this.informTable("Resize");}.bind(this),0);};C.prototype._validateMinWidth=function(w){if(!w){return;}if(Object.prototype.toString.call(w)!="[object String]"){throw new Error('expected string for property "minScreenWidth" of '+this);}if(Object.keys(l.ScreenSizes).indexOf(w.toLowerCase())!=-1){return;}if(!/^\d+(\.\d+)?(px|em|rem)$/i.test(w)){throw new Error('invalid CSS size("px", "em", "rem" required) or sap.m.ScreenSize enumeration for property "minScreenWidth" of '+this);}};C.prototype._isWidthPredefined=function(w){var t=this,u=w.replace(/[^a-z]/ig,""),b=parseFloat(l.BaseFontSize)||16;q.each(l.ScreenSizes,function(s,a){if(u!="px"){a/=b;}if(a+u==w){t._minWidth=this+"px";t._screen=s;return false;}});if(this._minWidth){return true;}if(u=="px"){this._minWidth=w;}else{this._minWidth=parseFloat(w)*b+"px";}};C.prototype.getCssAlign=function(a){a=a||this.getHAlign();if(a===T.Begin||a===T.End||a===T.Initial){a=R.getTextAlign(a);}return a.toLowerCase();};C.prototype.getStyleClass=function(r){var a=this.getProperty("styleClass");if(!r){return a;}if(this._screen&&(!this.getDemandPopin()||!window.matchMedia)){a+=" sapMSize-"+this._screen;}else if(this._media&&!this._media.matches){a+=" sapMListTblNone";}return a.trim();};C.prototype.setIndex=function(n){this._index=+n;};C.prototype.setOrder=function(n){this._order=+n;};C.prototype.getOrder=function(){return this.hasOwnProperty("_order")?this._order:this.getInitialOrder();};C.prototype.setInitialOrder=function(n){this._initialOrder=+n;};C.prototype.getInitialOrder=function(){if(this.hasOwnProperty("_initialOrder")){return this._initialOrder;}var t=this.getTable();if(!t){return-1;}return t.indexOfColumn(this);};C.prototype.setDisplay=function(t,d){if(!t||this._index<0){return;}var i=this._index+1,p=this.getParent(),a=d&&!this.isHidden()?"table-cell":"none",h=t.querySelector("tr > th:nth-child("+i+")"),b=t.querySelectorAll("tr > td:nth-child("+i+")"),e=b.length;h.style.display=a;h.setAttribute("aria-hidden",!d);for(i=0;i<e;i++){b[i].style.display=a;b[i].setAttribute("aria-hidden",!d);}if(p&&p.setTableHeaderVisibility){setTimeout(function(){p.setTableHeaderVisibility(d);},0);}};C.prototype.setWidth=function(w){var t=this.getTable();if(!t){return this.setProperty("width",w);}if(this.getWidth()===w){return this;}var o=t.shouldRenderDummyColumn();this.informTable("WidthChanged",w);if(o!==t.shouldRenderDummyColumn()){return this.setProperty("width",w);}var a=t.getAutoPopinMode();this.setProperty("width",w,a);if(a){var $=this.$();$.css("width",w);$.attr("data-sap-width",w);}this.informTable("RecalculateAutoPopin",true);return this;};C.prototype.setImportance=function(i){if(this.getImportance()===i){return this;}this.setProperty("importance",i,true);this.informTable("RecalculateAutoPopin",true);return this;};C.prototype.setAutoPopinWidth=function(w){if(this.getAutoPopinWidth()===w){return this;}this.setProperty("autoPopinWidth",w,true);this.informTable("RecalculateAutoPopin",true);return this;};C.prototype.setVisible=function(v){if(v==this.getVisible()){return this;}var p=this.getParent(),t=p&&p.getTableDomRef&&p.getTableDomRef(),s=t&&this._index>=0;this.setProperty("visible",v,s);if(s){this.informTable("RecalculateAutoPopin",true);this.setDisplay(t,v);}return this;};C.prototype._setMinScreenWidth=function(w){this._clearMedia();this._minWidth=0;this._screen="";if(w){w=w.toLowerCase();var a=l.ScreenSizes[w];if(a){this._screen=w;this._minWidth=a+"px";}else{this._isWidthPredefined(w);}var p=this.getTable();if(p&&p.isActive()){this._addMedia();}else{this._bShouldAddMedia=true;}}};C.prototype.setMinScreenWidth=function(w){if(w==this.getMinScreenWidth()){return this;}this._validateMinWidth(w);this._setMinScreenWidth(w);var t=this.getTable();if(!t){return this.setProperty("minScreenWidth",w);}return this.setProperty("minScreenWidth",w,t.getAutoPopinMode());};C.prototype.setDemandPopin=function(v){if(v==this.getDemandPopin()){return this;}if(!this.getMinScreenWidth()){return this.setProperty("demandPopin",v,true);}return this.setProperty("demandPopin",v);};C.prototype.setSortIndicator=function(s){this.setProperty("sortIndicator",s,true);this.$().attr("aria-sort",this.getSortIndicator().toLowerCase());return this;};C.prototype.isPopin=function(){if(!this.getDemandPopin()){return false;}var t=this.getTable();if(t){var h=t.getHiddenInPopin()||[];var H=h.some(function(i){return this.getImportance()===i;},this);if(H){return false;}}if(this._media){return!this._media.matches;}return false;};C.prototype.isHidden=function(){if(this._media){return!this._media.matches;}if(this._screen&&this._minWidth){return parseFloat(this._minWidth)>window.innerWidth;}return false;};C.prototype.setLastValue=function(v){if(this.getMergeDuplicates()){this._lastValue=v;}return this;};C.prototype.clearLastValue=function(){return this.setLastValue(NaN);};C.prototype.getLastValue=function(){return this._lastValue;};C.prototype.onItemsRemoved=function(){this.clearLastValue();};C.prototype.getFocusDomRef=function(){var p=this.getParent();if(p&&p.bActiveHeaders){var o=this.getDomRef();if(o){return o.firstChild;}}return E.prototype.getFocusDomRef.apply(this,arguments);};C.prototype.getCalculatedMinScreenWidth=function(){return parseInt(this._minWidth)||0;};C.prototype.setForcedColumn=function(f){if(this._bForcedColumn==f){return;}this._bForcedColumn=f;this._setMinScreenWidth(f?"":this.getMinScreenWidth());};return C;});
