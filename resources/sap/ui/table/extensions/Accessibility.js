/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ExtensionBase","./AccessibilityRender","../utils/TableUtils","../library","sap/ui/core/Control","sap/ui/Device","sap/ui/thirdparty/jquery"],function(E,A,T,l,C,D,q){"use strict";var S=l.SelectionMode;var a=T.CELLTYPE;var b={getAccInfoOfControl:function(o){if(o&&typeof o.getAccessibilityInfo==="function"){if(typeof o.getVisible==="function"&&!o.getVisible()){return b._normalize({});}var s=o.getAccessibilityInfo();if(s){var t={};b._flatten(s,t);return t;}}return null;},_normalize:function(i){if(!i){return null;}if(i._normalized){return i;}i.role=i.role||"";i.type=i.type||"";i.description=i.description||"";i.enabled=(i.enabled===true||i.enabled===false)?i.enabled:null;i.editable=(i.editable===true||i.editable===false)?i.editable:null;i.children=i.children||[];i._normalized=true;return i;},_flatten:function(s,t,L){L=L?L:0;b._normalize(s);if(L==0){b._normalize(t);t._descriptions=[];}t._descriptions.push(b._getFullDescription(s));s.children.forEach(function(o){if(!o.getAccessibilityInfo||(o.getVisible&&!o.getVisible())){return;}var e=o.getAccessibilityInfo();if(e){b._flatten(e,t,L+1);}});if(L==0){t.description=t._descriptions.join(" ").trim();t._descriptions=undefined;}},_getFullDescription:function(i){var s=i.type+" "+i.description;if(i.enabled===false){s=s+" "+T.getResourceText("TBL_CTRL_STATE_DISABLED");}else if(i.editable===false){s=s+" "+T.getResourceText("TBL_CTRL_STATE_READONLY");}return s.trim();}};var c={getColumnIndexOfFocusedCell:function(e){var t=e.getTable();var i=T.getFocusedItemInfo(t);return i.cellInRow-(T.hasRowHeader(t)?1:0);},getInfoOfFocusedCell:function(e){var t=e.getTable();var i=t._getItemNavigation();var o=t.getDomRef();if(!e.getAccMode()||!o||!i){return null;}var f=i.getFocusedDomRef();if(!f||f!==document.activeElement){return null;}return T.getCellInfo(f);},getRelevantColumnHeaders:function(t,o){if(!t||!o){return[];}var h=T.getHeaderRowCount(t),s=o.getId(),L=[s];if(h>1){for(var i=1;i<h;i++){L.push(s+"_"+i);}var e=T.Column.getParentSpannedColumns(t,s);if(e&&e.length){for(var i=0;i<e.length;i++){var f=e[i].level;var p=e[i].column.getId();L[f]=f===0?p:(p+"_"+f);}}}return L;},isHiddenCell:function($,o){var g=T.Grouping.isInGroupHeaderRow($);var s=T.Grouping.isInSummaryRow($);var e=!!o&&!!o.hasStyleClass;var i=$.parent().hasClass("sapUiTableRowHidden");var I=$.hasClass("sapUiTableCellHidden");var G=g&&e&&o.hasStyleClass("sapUiAnalyticalTableGroupCellHidden");var f=s&&e&&o.hasStyleClass("sapUiAnalyticalTableSumCellHidden");return i||I||G||f;},isTreeColumnCell:function(e,$){return T.Grouping.isTreeMode(e.getTable())&&$.hasClass("sapUiTableCellFirst");},getColumnTooltip:function(o){if(!o){return null;}var t=o.getTooltip_AsString();if(t){return t;}var L=o.getLabel();if(L instanceof C){t=L.getTooltip_AsString();}if(t){return t;}return null;},updateRowColCount:function(e){var t=e.getTable(),i=t._getItemNavigation(),I=false,f=false,g=false;if(i){var h=c.getColumnIndexOfFocusedCell(e)+1;var r=T.getRowIndexOfFocusedCell(t)+t._getFirstRenderedRowIndex()+1;var j=T.getVisibleColumnCount(t)+(T.hasRowActions(t)?1:0);var R=T.isNoDataVisible(t)?0:Math.max(t._getTotalRowCount(),t._getRowCounts().count);I=e._iLastRowNumber!=r||(e._iLastRowNumber==r&&e._iLastColumnNumber==h);f=e._iLastColumnNumber!=h;g=e._iLastRowNumber==null&&e._iLastColumnNumber==null;t.$("rownumberofrows").text(I?T.getResourceText("TBL_ROW_ROWCOUNT",[r,R]):" ");t.$("colnumberofcols").text(f?T.getResourceText("TBL_COL_COLCOUNT",[h,j]):" ");t.$("ariacount").text(g?T.getResourceText("TBL_DATA_ROWS_COLS",[R,j]):" ");e._iLastRowNumber=r;e._iLastColumnNumber=h;}return{rowChange:I,colChange:f,initial:g};},cleanupCellModifications:function(e){if(e._cleanupInfo){e._cleanupInfo.cell.attr(e._cleanupInfo.attr);e._cleanupInfo=null;}},storeDefaultsBeforeCellModifications:function(e,$,f,g){e._cleanupInfo={cell:$,attr:{"aria-labelledby":f&&f.length?f.join(" "):null,"aria-describedby":g&&g.length?g.join(" "):null}};},performCellModifications:function(e,$,f,g,L,h,t,i){c.storeDefaultsBeforeCellModifications(e,$,f,g);var o=c.updateRowColCount(e);var j=e.getTable();j.$("cellacc").text(t||" ");if(i){i(L,h,o.rowChange,o.colChange,o.initial);}var s="";if(o.initial){s=j.getId()+"-ariacount";if(j.getSelectionMode()!==S.None){s=s+" "+j.getId()+"-ariaselection";}}if(L&&L.length){s=s+" "+L.join(" ");}if(o.initial||o.rowChange){if(T.hasRowNavigationIndicators(j)){var k=T.getCellInfo($);if(k.type!==T.CELLTYPE.COLUMNHEADER&&k.type!==T.CELLTYPE.COLUMNROWHEADER){var r=j.getRows()[k.rowIndex].getAggregation("_settings");if(r.getNavigated()){s=s+" "+j.getId()+"-rownavigatedtext";}}}}$.attr({"aria-labelledby":s?s:null,"aria-describedby":h&&h.length?h.join(" "):null});},modifyAccOfDATACELL:function(o){var t=this.getTable();var s=t.getId();var i=t._getItemNavigation();var $=o.cell;if(!i){return;}var r=T.getRowIndexOfFocusedCell(t),e=c.getColumnIndexOfFocusedCell(this),f=T.getRowColCell(t,r,e,false),I=null,R=f.row,h=c.isHiddenCell($,f.cell),g=c.isTreeColumnCell(this,$),j=c.getAriaAttributesFor(this,d.ELEMENTTYPES.DATACELL,{index:e,column:f.column,fixed:T.isFixedColumn(t,e)})["aria-labelledby"]||[],k=[],L=[s+"-rownumberofrows",s+"-colnumberofcols"],m=R.isGroupHeader(),n=R.isSummary();if(m){L.push(s+"-ariarowgrouplabel");L.push(s+"-rows-row"+r+"-groupHeader");}else if(R.isTotalSummary()){L.push(s+"-ariagrandtotallabel");}else if(R.isGroupSummary()){L.push(s+"-ariagrouptotallabel");L.push(s+"-rows-row"+r+"-groupHeader");}if(T.hasRowHighlights(t)&&!m&&!n){L.push(R.getId()+"-highlighttext");}L=L.concat(j);if(!h){I=b.getAccInfoOfControl(f.cell);L.push(I?(s+"-cellacc"):f.cell.getId());if(T.getInteractiveElements($)!==null){L.push(s+"-toggleedit");}if(T.Grouping.isTreeMode(t)&&$.parent().attr("aria-selected")==="true"){L.push(s+"-ariarowselected");}}var p=I?I.description:" ";if(g&&!h){var u=c.getAriaAttributesFor(this,d.ELEMENTTYPES.TREEICON,{row:f.row});if(u&&u["aria-label"]){p=u["aria-label"]+" "+p;}}c.performCellModifications(this,$,j,null,L,k,p,function(L,k,v,w,x){var y=$.find(".sapUiTableTreeIcon").not(".sapUiTableTreeIconLeaf").length==1;if((y||m)&&(v||w)){k.push(t.getId()+(!R.isExpanded()?"-rowexpandtext":"-rowcollapsetext"));}else if(!h&&!m&&!n&&T.isRowSelectionAllowed(t)&&v){L.push(R.getId()+"-rowselecttext");}});},modifyAccOfROWHEADER:function(o){var t=this.getTable();var s=t.getId();var $=o.cell;var r=t.getRows()[o.rowIndex];var e=c.getAriaAttributesFor(this,d.ELEMENTTYPES.ROWHEADER)["aria-labelledby"]||[];var L=e.concat([s+"-rownumberofrows"]);if(!r.isSummary()&&!r.isGroupHeader()){if(!r.isContentHidden()){L.push(r.getId()+"-rowselecttext");if(T.hasRowHighlights(t)){L.push(r.getId()+"-highlighttext");}}}if(r.isGroupHeader()){L.push(s+"-ariarowgrouplabel");L.push(s+(r.isExpanded()?"-rowcollapsetext":"-rowexpandtext"));}if(r.isTotalSummary()){L.push(s+"-ariagrandtotallabel");}else if(r.isGroupSummary()){L.push(s+"-ariagrouptotallabel");}c.performCellModifications(this,$,e,null,L,null,null);},modifyAccOfCOLUMNHEADER:function(o){var t=this.getTable();var $=o.cell;var e=sap.ui.getCore().byId($.attr("data-sap-ui-colid"));var m=c.getAriaAttributesFor(this,d.ELEMENTTYPES.COLUMNHEADER,{headerId:$.attr("id"),column:e,index:$.attr("data-sap-ui-colindex")});var s=c.getColumnTooltip(e);var L=[t.getId()+"-colnumberofcols"].concat(m["aria-labelledby"]);var i=o.columnSpan;if(i>1){L.push(t.getId()+"-ariacolspan");t.$("ariacolspan").text(T.getResourceText("TBL_COL_DESC_SPAN",[""+i]));}if(s){L.push(t.getId()+"-cellacc");}if(D.browser.msie){if(i<=1&&e&&e.getSorted()){L.push(t.getId()+(e.getSortOrder()==="Ascending"?"-ariacolsortedasc":"-ariacolsorteddes"));}}if(i<=1&&e&&e.getFiltered()){L.push(t.getId()+"-ariacolfiltered");}if(D.browser.msie){if(i<=1&&$.attr("aria-haspopup")==="menu"){L.push(t.getId()+"-ariacolmenu");}}c.performCellModifications(this,$,m["aria-labelledby"],m["aria-describedby"],L,m["aria-describedby"],s);},modifyAccOfCOLUMNROWHEADER:function(o){var t=this.getTable();var $=o.cell;var e=$.hasClass("sapUiTableSelAllVisible");var m=c.getAriaAttributesFor(this,d.ELEMENTTYPES.COLUMNROWHEADER,{enabled:e,checked:e&&!t.$().hasClass("sapUiTableSelAll")});c.performCellModifications(this,$,m["aria-labelledby"],m["aria-describedby"],m["aria-labelledby"],m["aria-describedby"],null);},modifyAccOfROWACTION:function(o){var t=this.getTable();var s=t.getId();var $=o.cell;var r=o.rowIndex;var R=t.getRows()[o.rowIndex];var h=c.isHiddenCell($);var e=c.getAriaAttributesFor(this,d.ELEMENTTYPES.ROWACTION)["aria-labelledby"]||[];var L=[s+"-rownumberofrows",s+"-colnumberofcols"].concat(e);var f=[];if(R.isGroupHeader()){L.push(s+"-ariarowgrouplabel");L.push(s+"-rows-row"+r+"-groupHeader");L.push(s+(R.isExpanded()?"-rowcollapsetext":"-rowexpandtext"));}if(R.isTotalSummary()){L.push(s+"-ariagrandtotallabel");}else if(R.isGroupSummary()){L.push(s+"-ariagrouptotallabel");L.push(s+"-rows-row"+r+"-groupHeader");}if(!R.isSummary()&&!R.isGroupHeader()&&$.attr("aria-selected")==="true"){L.push(s+"-ariarowselected");}if(T.hasRowHighlights(t)&&!R.isGroupHeader()&&!R.isSummary()){L.push(R.getId()+"-highlighttext");}var g="";if(!h){var i=R.getRowAction();if(i){var I=i.getAccessibilityInfo();if(I){L.push(s+"-cellacc");g=I.description;if(T.getInteractiveElements($)!==null){f.push(s+"-toggleedit");}}}}c.performCellModifications(this,$,e,[],L,f,g);},getAriaAttributesFor:function(e,t,p){var m={},o=e.getTable(),s=o.getId();function f(o,x,O,y){var M="";if(O&&y){M="overlay,nodata";}else if(O&&!y){M="overlay";}else if(!O&&y){M="nodata";}var z=false;if(O&&o.getShowOverlay()||y&&T.isNoDataVisible(o)){z=true;}if(z){m["aria-hidden"]="true";}if(M){m["data-sap-ui-table-acc-covered"]=M;}}switch(t){case d.ELEMENTTYPES.COLUMNROWHEADER:m["aria-labelledby"]=[s+"-ariacolrowheaderlabel"];var r=o._getSelectionPlugin().getRenderConfig();if(r.headerSelector.visible){if(r.headerSelector.type==="toggle"){m["role"]=["checkbox"];if(p&&p.enabled){m["aria-checked"]=p.checked?"true":"false";}}else if(r.headerSelector.type==="clear"){m["role"]=["button"];if(!p||!p.enabled){m["aria-disabled"]="true";}}}if(!o._getShowStandardTooltips()&&r.headerSelector.type==="toggle"){m["aria-labelledby"].push(s+"-ariaselectall");}break;case d.ELEMENTTYPES.ROWHEADER:m["role"]="rowheader";if(D.browser.msie){m["aria-labelledby"]=[s+"-ariarowheaderlabel"];}break;case d.ELEMENTTYPES.ROWACTION:m["role"]="gridcell";m["aria-colindex"]=o._getVisibleColumns().length+1;m["aria-labelledby"]=[s+"-rowacthdr"];break;case d.ELEMENTTYPES.COLUMNHEADER:var g=p&&p.column;var h=p&&p.colspan;m["role"]="columnheader";m["aria-colindex"]=p.index+1;var L=[];if(p&&p.headerId){var H=c.getRelevantColumnHeaders(o,g);var I=H.indexOf(p.headerId);L=I>0?H.slice(0,I+1):[p.headerId];}for(var i=0;i<L.length;i++){L[i]=L[i]+"-inner";}m["aria-labelledby"]=L;if(p&&(p.index<o.getComputedFixedColumnCount())){m["aria-labelledby"].push(s+"-ariafixedcolumn");}if(!h&&g&&g.getSorted()){m["aria-sort"]=g.getSortOrder()==="Ascending"?"ascending":"descending";}if(!h&&g&&g._menuHasItems()){m["aria-haspopup"]="menu";}break;case d.ELEMENTTYPES.DATACELL:m["role"]="gridcell";m["aria-colindex"]=p.index+1;var L=[],g=p&&p.column?p.column:null;if(g){L=c.getRelevantColumnHeaders(o,g);m["headers"]=L.join(" ");for(var i=0;i<L.length;i++){L[i]=L[i]+"-inner";}if(p&&p.fixed){L.push(s+"-ariafixedcolumn");}}m["aria-labelledby"]=L;break;case d.ELEMENTTYPES.ROOT:break;case d.ELEMENTTYPES.TABLE:m["role"]="presentation";f(o,m,true,true);break;case d.ELEMENTTYPES.CONTAINER:m["role"]="application";break;case d.ELEMENTTYPES.CONTENT:m["role"]=T.Grouping.isGroupMode(o)||T.Grouping.isTreeMode(o)?"treegrid":"grid";m["aria-labelledby"]=[].concat(o.getAriaLabelledBy());if(o.getTitle()){m["aria-labelledby"].push(o.getTitle().getId());}if(o.getSelectionMode()===S.MultiToggle){m["aria-multiselectable"]="true";}var R=o._getRowCounts();var j=T.hasFixedColumns(o);var k=R.fixedTop>0;var n=R.fixedBottom>0;var u=T.hasRowHeader(o);var v=T.hasRowActions(o);m["aria-owns"]=[s+"-table"];if(j){m["aria-owns"].push(s+"-table-fixed");}if(k){m["aria-owns"].push(s+"-table-fixrow");if(j){m["aria-owns"].push(s+"-table-fixed-fixrow");}}if(n){m["aria-owns"].push(s+"-table-fixrow-bottom");if(j){m["aria-owns"].push(s+"-table-fixed-fixrow-bottom");}}if(u){m["aria-owns"].push(s+"-sapUiTableRowHdrScr");}if(v){m["aria-owns"].push(s+"-sapUiTableRowActionScr");}m["aria-rowcount"]=o._getTotalRowCount();m["aria-colcount"]=o._getVisibleColumns().length+(v?1:0);if(o.isA("sap.ui.table.AnalyticalTable")){m["aria-roledescription"]=T.getResourceText("TBL_ANALYTICAL_TABLE_ROLE_DESCRIPTION");}break;case d.ELEMENTTYPES.TABLEHEADER:m["role"]="heading";m["aria-level"]="2";f(o,m,true,false);break;case d.ELEMENTTYPES.COLUMNHEADER_TBL:m["role"]="presentation";break;case d.ELEMENTTYPES.COLUMNHEADER_ROW:m["role"]="row";f(o,m,true,false);break;case d.ELEMENTTYPES.CREATIONROW_TBL:m["role"]="presentation";break;case d.ELEMENTTYPES.CREATIONROW:m["role"]="form";m["aria-labelledby"]=p.creationRow.getId()+"-label";f(o,m,true,false);break;case d.ELEMENTTYPES.ROWHEADER_COL:f(o,m,true,true);break;case d.ELEMENTTYPES.TH:m["role"]="presentation";m["scope"]="col";m["aria-hidden"]="true";break;case d.ELEMENTTYPES.TR:m["role"]="row";if(p.rowNavigated){m["aria-current"]=true;}break;case d.ELEMENTTYPES.TREEICON:if(T.Grouping.isTreeMode(o)){m={"aria-label":"","title":"","role":""};if(o.getBinding()){if(p&&p.row){if(p.row.isExpandable()){var w=T.getResourceText(p.row.isExpanded()?"TBL_COLLAPSE":"TBL_EXPAND");if(o._getShowStandardTooltips()){m["title"]=w;}else{m["aria-label"]=w;}m["aria-expanded"]=""+(!!p.row.isExpanded());m["aria-hidden"]="false";m["role"]="button";}else{m["aria-label"]=T.getResourceText("TBL_LEAF");m["aria-hidden"]="true";}}}}break;case d.ELEMENTTYPES.NODATA:m["role"]="gridcell";var N=o.getNoData();m["aria-labelledby"]=[N instanceof C?N.getId():(s+"-noDataMsg")];f(o,m,true,false);break;case d.ELEMENTTYPES.OVERLAY:m["role"]="region";m["aria-labelledby"]=[].concat(o.getAriaLabelledBy());if(o.getTitle()){m["aria-labelledby"].push(o.getTitle().getId());}m["aria-labelledby"].push(s+"-ariainvalid");break;case d.ELEMENTTYPES.TABLEFOOTER:case d.ELEMENTTYPES.TABLESUBHEADER:f(o,m,true,false);break;case d.ELEMENTTYPES.ROWACTIONHEADER:m["aria-hidden"]="true";break;case"PRESENTATION":m["role"]="presentation";break;}return m;}};var d=E.extend("sap.ui.table.extensions.Accessibility",{_init:function(t,s,m){this._accMode=sap.ui.getCore().getConfiguration().getAccessibility();this._busyCells=[];T.addDelegate(t,this);E.enrich(t,A);return"AccExtension";},_debug:function(){this._ExtensionHelper=c;this._ACCInfoHelper=b;},destroy:function(){this.getTable().removeEventDelegate(this);this._busyCells=[];E.prototype.destroy.apply(this,arguments);},getAriaAttributesFor:function(t,p){return c.getAriaAttributesFor(this,t,p);},onfocusin:function(e){var t=this.getTable();if(!t||T.getCellInfo(e.target).cell==null){return;}if(t._mTimeouts._cleanupACCExtension){clearTimeout(t._mTimeouts._cleanupACCExtension);t._mTimeouts._cleanupACCExtension=null;}this.updateAccForCurrentCell("Focus");},onfocusout:function(e){var t=this.getTable();if(!t){return;}t._mTimeouts._cleanupACCExtension=setTimeout(function(){var t=this.getTable();if(!t){return;}this._iLastRowNumber=null;this._iLastColumnNumber=null;c.cleanupCellModifications(this);t._mTimeouts._cleanupACCExtension=null;}.bind(this),100);}});d.ELEMENTTYPES={DATACELL:"DATACELL",COLUMNHEADER:"COLUMNHEADER",ROWHEADER:"ROWHEADER",ROWACTION:"ROWACTION",COLUMNROWHEADER:"COLUMNROWHEADER",ROOT:"ROOT",CONTAINER:"CONTAINER",CONTENT:"CONTENT",TABLE:"TABLE",TABLEHEADER:"TABLEHEADER",TABLEFOOTER:"TABLEFOOTER",TABLESUBHEADER:"TABLESUBHEADER",COLUMNHEADER_TBL:"COLUMNHEADER_TABLE",COLUMNHEADER_ROW:"COLUMNHEADER_ROW",CREATIONROW_TBL:"CREATIONROW_TABLE",CREATIONROW:"CREATIONROW",ROWHEADER_COL:"ROWHEADER_COL",TH:"TH",TR:"TR",TREEICON:"TREEICON",ROWACTIONHEADER:"ROWACTIONHEADER",NODATA:"NODATA",OVERLAY:"OVERLAY"};d.prototype.getAccMode=function(){return this._accMode;};d.prototype._updateAriaRowIndices=function(){if(!this._accMode){return;}var t=this.getTable();var r=t.getRows();var R,i;for(i=0;i<r.length;i++){R=r[i];R.getDomRefs(true).row.attr("aria-rowindex",R.getIndex()+1);}};d.prototype._updateAriaRowCount=function(){var t=this.getTable();var $=t.$("sapUiTableGridCnt");if($){$.attr("aria-rowcount",t._getTotalRowCount());}};d.prototype.updateAccForCurrentCell=function(r){if(!this._accMode||!this.getTable()._getItemNavigation()){return;}if(r==="Focus"||r===T.RowsUpdateReason.Expand||r===T.RowsUpdateReason.Collapse){c.cleanupCellModifications(this);}var t=this.getTable();var I=c.getInfoOfFocusedCell(this);var s;if(!I||!I.isOfType(a.ANY)){return;}if(I.isOfType(a.DATACELL)){s=d.ELEMENTTYPES.DATACELL;}else if(I.isOfType(a.COLUMNHEADER)){s=d.ELEMENTTYPES.COLUMNHEADER;}else if(I.isOfType(a.ROWHEADER)){s=d.ELEMENTTYPES.ROWHEADER;}else if(I.isOfType(a.ROWACTION)){s=d.ELEMENTTYPES.ROWACTION;}else if(I.isOfType(a.COLUMNROWHEADER)){s=d.ELEMENTTYPES.COLUMNROWHEADER;}if(!c["modifyAccOf"+s]){return;}if(r!=="Focus"&&r!==T.RowsUpdateReason.Expand&&r!==T.RowsUpdateReason.Collapse){if(I.isOfType(a.DATACELL|a.ROWHEADER|a.ROWACTION)){if(D.browser.msie){if(t._mTimeouts._cleanupACCCellBusy){clearTimeout(t._mTimeouts._cleanupACCCellBusy);t._mTimeouts._cleanupACCCellBusy=null;}t._mTimeouts._cleanupACCCellBusy=setTimeout(function(){for(var i=0;i<this._busyCells.length;i++){this._busyCells[i].removeAttr("aria-hidden");this._busyCells[i].removeAttr("aria-busy");}t._mTimeouts._cleanupACCCellBusy=null;this._busyCells=[];}.bind(this),100);I.cell.attr("aria-busy","true");this._busyCells.push(I.cell);}else{I.cell.attr("role","status");I.cell.attr("role","gridcell");}}else{return;}}c["modifyAccOf"+s].apply(this,[I]);};d.prototype.updateAriaStateOfColumn=function(o){if(!this._accMode){return;}var m=c.getAriaAttributesFor(this,d.ELEMENTTYPES.COLUMNHEADER,{headerId:o.getId(),column:o,index:this.getTable().indexOfColumn(o)});var h=c.getRelevantColumnHeaders(this.getTable(),o);for(var i=0;i<h.length;i++){var H=q(document.getElementById(h[i]));if(!H.attr("colspan")){H.attr({"aria-sort":m["aria-sort"]||null});}}};d.prototype.updateRowTooltips=function(r,R,t){if(!this._accMode){return;}var o=this.getTable();var s=!r.isEmpty()&&!r.isGroupHeader()&&!r.isSummary()&&o._getShowStandardTooltips();if(R.row){if(s&&T.isRowSelectionAllowed(o)&&!R.row.hasClass("sapUiTableRowHidden")){R.row.attr("title",t);}else{R.row.removeAttr("title");}}if(R.rowSelector){if(s&&T.isRowSelectorSelectionAllowed(o)){R.rowSelector.attr("title",t);}else{R.rowSelector.removeAttr("title");}}if(R.rowScrollPart){var $=R.rowScrollPart.add(R.rowFixedPart).add(R.rowActionPart);if(s&&T.isRowSelectionAllowed(o)){$.attr("title",t);}else{$.removeAttr("title");}}};d.prototype.updateSelectionStateOfRow=function(r){if(!this._accMode){return;}var R=r.getDomRefs(true);var t="";var s="";if(!r.isEmpty()&&!r.isGroupHeader()&&!r.isSummary()){var m=this.getAriaTextsForSelectionMode(true);var o=this.getTable();var i=o._getSelectionPlugin().isIndexSelected(r.getIndex());if(R.row){R.row.add(R.row.children(".sapUiTableCell")).attr("aria-selected",i?"true":"false");}if(!i){t=m.keyboard["rowSelect"];s=m.mouse["rowSelect"];}else{t=T.getResourceText("TBL_ROW_DESC_SELECTED")+" "+m.keyboard["rowDeselect"];s=m.mouse["rowDeselect"];}}if(R.rowSelectorText){R.rowSelectorText.text(t);}this.updateRowTooltips(r,R,s);};d.prototype.updateAriaExpandAndLevelState=function(r){if(!this._accMode){return;}var o=r.getDomRefs(true);var t=o.row.find(".sapUiTableTreeIcon");if(o.rowHeaderPart){o.rowHeaderPart.attr({"aria-haspopup":r.isGroupHeader()?"menu":null});}o.row.attr({"aria-expanded":r.isExpandable()?r.isExpanded()+"":null,"aria-level":r.getLevel()});if(t){t.attr(c.getAriaAttributesFor(this,d.ELEMENTTYPES.TREEICON,{row:r}));}};d.prototype.updateAriaStateOfRowHighlight=function(r){if(!this._accMode||!r){return;}var R=r._getRow();var h=R?R.getDomRef("highlighttext"):null;if(h){h.innerText=r._getHighlightText();}};d.prototype._updateAriaStateOfNavigatedRow=function(r){if(!this._accMode||!r){return;}var R=r._getRow();var n=r.getNavigated();R.getDomRefs(true).row.attr("aria-current",n?true:null);};d.prototype.updateAriaStateForOverlayAndNoData=function(){var t=this.getTable();if(!t||!t.getDomRef()||!this._accMode){return;}if(t.getShowOverlay()){t.$().find("[data-sap-ui-table-acc-covered*='overlay']").attr("aria-hidden","true");}else{t.$().find("[data-sap-ui-table-acc-covered*='overlay']").removeAttr("aria-hidden");if(T.isNoDataVisible(t)){t.$().find("[data-sap-ui-table-acc-covered*='nodata']").attr("aria-hidden","true");}else{t.$().find("[data-sap-ui-table-acc-covered*='nodata']").removeAttr("aria-hidden");}}};d.prototype.getAriaTextsForSelectionMode=function(e,s){var t=this.getTable();if(!s){s=t.getSelectionMode();}var f=t._getShowStandardTooltips();var m={mouse:{rowSelect:"",rowDeselect:""},keyboard:{rowSelect:"",rowDeselect:""}};var i=t._getSelectionPlugin().getSelectedCount();if(s===S.Single){m.mouse.rowSelect=f?T.getResourceText("TBL_ROW_SELECT"):"";m.mouse.rowDeselect=f?T.getResourceText("TBL_ROW_DESELECT"):"";m.keyboard.rowSelect=T.getResourceText("TBL_ROW_SELECT_KEY");m.keyboard.rowDeselect=T.getResourceText("TBL_ROW_DESELECT_KEY");}else if(s===S.MultiToggle){m.mouse.rowSelect=f?T.getResourceText("TBL_ROW_SELECT_MULTI_TOGGLE"):"";m.mouse.rowDeselect=f?T.getResourceText("TBL_ROW_DESELECT"):"";m.keyboard.rowSelect=T.getResourceText("TBL_ROW_SELECT_KEY");m.keyboard.rowDeselect=T.getResourceText("TBL_ROW_DESELECT_KEY");if(e===true&&i===0){m.mouse.rowSelect=f?T.getResourceText("TBL_ROW_SELECT"):"";}}return m;};d.prototype.setSelectAllState=function(s){var t=this.getTable();if(this._accMode&&t){t.$("selall").attr("aria-checked",s?"true":"false");}};d.prototype.addColumnHeaderLabel=function(o,e){var t=this.getTable();if(!this._accMode||!e.getAriaLabelledBy||!t){return;}var L=t.getColumnHeaderVisible()?o.getId():null;if(!L){var f=o.getAggregation("label");if(f){L=f.getId();}}var g=e.getAriaLabelledBy();if(L&&g.indexOf(L)<0){e.addAriaLabelledBy(L);}};return d;});
