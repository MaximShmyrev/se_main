/*
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../library","./RowMode","../utils/TableUtils","sap/base/Log","sap/ui/thirdparty/jquery"],function(l,R,T,L,q){"use strict";var I=R.extend("sap.ui.table.rowmodes.InteractiveRowMode",{metadata:{library:"sap.ui.table","final":true,properties:{rowContentHeight:{type:"int",defaultValue:0,group:"Appearance"},minRowCount:{type:"int",defaultValue:5,group:"Appearance"}}},constructor:function(i){Object.defineProperty(this,"bLegacy",{value:typeof i==="boolean"?i:false});R.apply(this,arguments);}});var a={};var b={};I.prototype.attachEvents=function(){R.prototype.attachEvents.apply(this,arguments);T.addDelegate(this.getTable(),a,this);};I.prototype.detachEvents=function(){R.prototype.detachEvents.apply(this,arguments);T.removeDelegate(this.getTable(),a);};I.prototype.registerHooks=function(){R.prototype.registerHooks.apply(this,arguments);T.Hook.register(this.getTable(),T.Hook.Keys.Table.RefreshRows,this._onTableRefreshRows,this);};I.prototype.deregisterHooks=function(){R.prototype.deregisterHooks.apply(this,arguments);T.Hook.deregister(this.getTable(),T.Hook.Keys.Table.RefreshRows,this._onTableRefreshRows,this);};I.prototype.getRowCount=function(){if(this.bLegacy){var t=this.getTable();return t?t.getVisibleRowCount():0;}return this.getProperty("rowCount");};I.prototype.getFixedTopRowCount=function(){if(this.bLegacy){var t=this.getTable();return t?t.getFixedRowCount():0;}return this.getProperty("fixedTopRowCount");};I.prototype.getFixedBottomRowCount=function(){if(this.bLegacy){var t=this.getTable();return t?t.getFixedBottomRowCount():0;}return this.getProperty("fixedBottomRowCount");};I.prototype.getMinRowCount=function(){if(this.bLegacy){var t=this.getTable();return t?t.getMinAutoRowCount():0;}return this.getProperty("minRowCount");};I.prototype.getRowContentHeight=function(){if(this.bLegacy){var t=this.getTable();return t?t.getRowHeight():0;}return this.getProperty("rowContentHeight");};I.prototype.getMinRequestLength=function(){return this.getConfiguredRowCount();};I.prototype.getComputedRowCounts=function(){return this.sanitizeRowCounts(this.getConfiguredRowCount(),this.getFixedTopRowCount(),this.getFixedBottomRowCount());};I.prototype.getTableStyles=function(){return{height:"auto"};};I.prototype.getTableBottomPlaceholderStyles=function(){return undefined;};I.prototype.getRowContainerStyles=function(){var h=this.getComputedRowCounts().count*this.getBaseRowHeightOfTable()+"px";if(this.bLegacy&&!T.isVariableRowHeightEnabled(this.getTable())){return{minHeight:h};}else{return{height:h};}};I.prototype.renderRowStyles=function(r){var i=this.getRowContentHeight();if(i>0){r.style("height",this.getBaseRowHeightOfTable()+"px");}};I.prototype.renderCellContentStyles=function(r){var i=this.getRowContentHeight();if(this.bLegacy){return;}if(i<=0){i=this.getDefaultRowContentHeightOfTable();}if(i>0){r.style("max-height",i+"px");}};I.prototype.getBaseRowContentHeight=function(){return Math.max(0,this.getRowContentHeight());};I.prototype._onTableRefreshRows=function(){var r=this.getConfiguredRowCount();if(r>0){this.initTableRowsAfterDataRequested(r);this.getRowContexts(r,true);}};I.prototype.getConfiguredRowCount=function(){return Math.max(0,this.getMinRowCount(),this.getRowCount());};a.onBeforeRendering=function(e){var r=e&&e.isMarked("renderRows");if(this.bLegacy){this.getTable().setVisibleRowCount(this.getComputedRowCounts().count);}if(!r){this.updateTable(T.RowsUpdateReason.Render);}};a.onAfterRendering=function(e){var t=this.getTable();var r=e&&e.isMarked("renderRows");if(!r&&t.getRows().length>0){this.fireRowsUpdated(T.RowsUpdateReason.Render);}};a.onmousedown=function(e){var t=this.getTable();if(e.button===0&&e.target===t.getDomRef("sb")){b.initInteractiveResizing(t,this,e);}};b.initInteractiveResizing=function(t,m,e){var B=q(document.body);var s=t.$("sb");var d=q(document);var o=s.offset();var h=s.height();var w=s.width();var c=t._isTouchEvent(e);B.on("selectstart",b.onSelectStartWhileInteractiveResizing);B.append("<div id=\""+t.getId()+"-ghost\" class=\"sapUiTableInteractiveResizerGhost\" style =\" height:"+h+"px; width:"+w+"px; left:"+o.left+"px; top:"+o.top+"px\" ></div>");s.append("<div id=\""+t.getId()+"-rzoverlay\" style =\"left: 0px; right: 0px; bottom: 0px; top: 0px; position:absolute\" ></div>");d.on((c?"touchend":"mouseup")+".sapUiTableInteractiveResize",b.exitInteractiveResizing.bind(t,m));d.on((c?"touchmove":"mousemove")+".sapUiTableInteractiveResize",b.onMouseMoveWhileInteractiveResizing.bind(t));t._disableTextSelection();};b.exitInteractiveResizing=function(m,e){var B=q(document.body);var d=q(document);var t=this.$();var g=this.$("ghost");var i=b.getEventPosition(this,e).y;var n=i-t.find(".sapUiTableCCnt").offset().top-g.height()-t.find(".sapUiTableFtr").height();var u=Math.floor(n/m.getBaseRowHeightOfTable());var N=Math.max(1,u,m.getMinRowCount());if(m.bLegacy){N=Math.max(N,m.getFixedTopRowCount()+m.getFixedBottomRowCount()+1);this.setVisibleRowCount(N);}m.setRowCount(N);g.remove();this.$("rzoverlay").remove();B.off("selectstart",b.onSelectStartWhileInteractiveResizing);d.off("touchend.sapUiTableInteractiveResize");d.off("touchmove.sapUiTableInteractiveResize");d.off("mouseup.sapUiTableInteractiveResize");d.off("mousemove.sapUiTableInteractiveResize");this._enableTextSelection();};b.onSelectStartWhileInteractiveResizing=function(e){e.preventDefault();e.stopPropagation();return false;};b.onMouseMoveWhileInteractiveResizing=function(e){var i=b.getEventPosition(this,e).y;var m=this.$().offset().top;if(i>m){this.$("ghost").css("top",i+"px");}};b.getEventPosition=function(t,e){var p;function g(o){if(!t._isTouchEvent(o)){return null;}var c=["touches","targetTouches","changedTouches"];for(var i=0;i<c.length;i++){var s=c[i];if(e[s]&&e[s][0]){return e[s][0];}if(e.originalEvent[s]&&e.originalEvent[s][0]){return e.originalEvent[s][0];}}return null;}p=g(e)||e;return{x:p.pageX,y:p.pageY};};return I;});
