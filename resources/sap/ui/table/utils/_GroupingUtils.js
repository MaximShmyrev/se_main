/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/Sorter","sap/ui/Device","sap/ui/thirdparty/jquery"],function(S,D,q){"use strict";var G={TableUtils:null,clearMode:function(t){t._mode=null;},setGroupMode:function(t){t._mode="Group";},isGroupMode:function(t){return t?t._mode==="Group":false;},setTreeMode:function(t){t._mode="Tree";},isTreeMode:function(t){return t?t._mode==="Tree":false;},getModeCssClass:function(t){switch(t._mode){case"Group":return"sapUiTableGroupMode";case"Tree":return"sapUiTableTreeMode";default:return null;}},showGroupMenuButton:function(t){return!D.system.desktop&&G.TableUtils.isA(t,"sap.ui.table.AnalyticalTable");},isInGroupHeaderRow:function(c){var i=G.TableUtils.getCellInfo(c);if(i.isOfType(G.TableUtils.CELLTYPE.ANYCONTENTCELL)){return i.cell.parent().hasClass("sapUiTableGroupHeaderRow");}return false;},isInSummaryRow:function(c){var i=G.TableUtils.getCellInfo(c);if(i.isOfType(G.TableUtils.CELLTYPE.ANYCONTENTCELL)){return i.cell.parent().hasClass("sapUiTableSummaryRow");}return false;},calcGroupIndent:function(r){var l=r.getLevel();var I=0;for(var i=1;i<l;i++){I+=i<=2?12:8;}return I;},calcTreeIndent:function(r){return(r.getLevel()-1)*17;},setGroupIndent:function(r,i){var d=r.getDomRefs(true);var R=d.row;var $=d.rowHeaderPart;var b=r.getTable()._bRtlMode;var f=R.find("td.sapUiTableCellFirst > .sapUiTableCellInner");var s=$.find(".sapUiTableGroupShield");if(i<=0){$.css(b?"right":"left","");s.css("width","").css(b?"margin-right":"margin-left","");f.css(b?"padding-right":"padding-left","");}else{$.css(b?"right":"left",i+"px");s.css("width",i+"px").css(b?"margin-right":"margin-left",((-1)*i)+"px");f.css(b?"padding-right":"padding-left",(i+8)+"px");}},setTreeIndent:function(r,i){var d=r.getDomRefs(true);var R=d.row;var b=r.getTable()._bRtlMode;var t=R.find(".sapUiTableTreeIcon");t.css(b?"margin-right":"margin-left",i>0?i+"px":"");},updateTableRowForGrouping:function(r){var t=r.getTable();var d=r.getDomRefs(true);var R=d.row;var l=r.getLevel();var i=r.isExpanded();var I=r.isExpandable();R.attr({"data-sap-ui-level":l}).data("sap-ui-level",l).toggleClass("sapUiTableSummaryRow",r.isSummary()).toggleClass("sapUiTableGroupHeaderRow",r.isGroupHeader());if(G.isGroupMode(t)){var T=r.getTitle();var a=G.calcGroupIndent(r);r.$("groupHeader").toggleClass("sapUiTableGroupIconOpen",I&&i).toggleClass("sapUiTableGroupIconClosed",I&&!i).attr("title",t._getShowStandardTooltips()&&T?T:null).text(T);G.setGroupIndent(r,a);R.toggleClass("sapUiTableRowIndented",a>0);}if(G.isTreeMode(t)){var $=R.find(".sapUiTableTreeIcon");$.toggleClass("sapUiTableTreeIconLeaf",!I).toggleClass("sapUiTableTreeIconNodeOpen",I&&i).toggleClass("sapUiTableTreeIconNodeClosed",I&&!i);G.setTreeIndent(r,G.calcTreeIndent(r));}if(G.showGroupMenuButton(t)){var b=d.rowHeaderPart;var s=0;var c=t.$();if(c.hasClass("sapUiTableVScr")){s+=c.find(".sapUiTableVSb").width();}var g=b.find(".sapUiTableGroupMenuButton");if(t._bRtlMode){g.css("right",(c.width()-g.width()+b.position().left-s-5)+"px");}else{g.css("left",(c.width()-g.width()-b.position().left-s-5)+"px");}}t._getAccExtension().updateAriaExpandAndLevelState(r);},cleanupTableRowForGrouping:function(r){var t=r.getTable();var d=r.getDomRefs(true);d.row.removeAttr("data-sap-ui-level");d.row.removeData("sap-ui-level");if(G.isGroupMode(t)){d.row.removeClass("sapUiTableGroupHeaderRow sapUiTableSummaryRow sapUiTableRowIndented");r.$("groupHeader").removeClass("sapUiTableGroupIconOpen","sapUiTableGroupIconClosed").attr("title","").text("");G.setGroupIndent(r,0);}if(G.isTreeMode(t)){d.row.find(".sapUiTableTreeIcon").removeClass("sapUiTableTreeIconLeaf").removeClass("sapUiTableTreeIconNodeOpen").removeClass("sapUiTableTreeIconNodeClosed");G.setTreeIndent(r,0);}t._getAccExtension().updateAriaExpandAndLevelState(r);},updateGroups:function(t){if(G.isGroupMode(t)||G.isTreeMode(t)){var b=t.getBinding();if(b){t.getRows().forEach(function(r){G.updateTableRowForGrouping(r);});}else{t.getRows().forEach(function(r){G.cleanupTableRowForGrouping(r);});}}},setupExperimentalGrouping:function(t){if(!t.getEnableGrouping()){return;}var b=t.getBinding();var g=sap.ui.getCore().byId(t.getGroupBy());var I=g&&g.getGrouped()&&G.TableUtils.isA(b,"sap.ui.model.ClientListBinding");if(!I||b._modified){return;}b._modified=true;G.setGroupMode(t);var p=g.getSortProperty();b.sort(new S(p));var l=t._getTotalRowCount(),c=b.getContexts(0,l);var k;var C=0;for(var i=l-1;i>=0;i--){var n=c[i].getProperty(p);if(!k){k=n;}if(k!==n){var o=c[i+1].getModel().getContext("/sap.ui.table.GroupInfo"+i);o.__groupInfo={oContext:c[i+1],name:k,count:C,groupHeader:true,expanded:true};c.splice(i+1,0,o);k=n;C=0;}C++;}var o=c[0].getModel().getContext("/sap.ui.table.GroupInfo");o.__groupInfo={oContext:c[0],name:k,count:C,groupHeader:true,expanded:true};c.splice(0,0,o);q.extend(b,{getLength:function(){return c.length;},getContexts:function(s,l){return c.slice(s,s+l);}});function a(d){var e=c[d];return(e&&e.__groupInfo&&e.__groupInfo.groupHeader)===true;}t._experimentalGroupingRowState=function(s){var d=s.context;if((d&&d.__groupInfo&&d.__groupInfo.groupHeader)===true){s.type=s.Type.GroupHeader;}s.title=d&&d.__groupInfo&&d.__groupInfo.name+" - "+d.__groupInfo.count;s.expandable=s.type===s.Type.GroupHeader;s.expanded=s.expandable&&d.__groupInfo&&d.__groupInfo.expanded;s.level=s.expandable?1:2;s.contentHidden=s.expandable;};t._experimentalGroupingExpand=function(r){var R=r.getIndex();if(a(R)&&!c[R].__groupInfo.expanded){for(var i=0;i<c[R].__childs.length;i++){c.splice(R+1+i,0,c[R].__childs[i]);}delete c[R].__childs;c[R].__groupInfo.expanded=true;b._fireChange();}};t._experimentalGroupingCollapse=function(r){var R=r.getIndex();if(a(R)&&c[R].__groupInfo.expanded){c[R].__childs=c.splice(R+1,c[R].__groupInfo.count);c[R].__groupInfo.expanded=false;b._fireChange();}};var H=G.TableUtils.Hook;H.register(t,H.Keys.Row.UpdateState,t._experimentalGroupingRowState);H.register(t,H.Keys.Row.Expand,t._experimentalGroupingExpand);H.register(t,H.Keys.Row.Collapse,t._experimentalGroupingCollapse);t._mTimeouts.groupingFireBindingChange=t._mTimeouts.groupingFireBindingChange||window.setTimeout(function(){b._fireChange();},0);},resetExperimentalGrouping:function(t){var b=t.getBinding();var H=G.TableUtils.Hook;if(b&&b._modified){G.clearMode(t);t.bindRows(t.getBindingInfo("rows"));}H.deregister(t,H.Keys.Row.UpdateState,t._experimentalGroupingRowState);H.deregister(t,H.Keys.Row.Expand,t._experimentalGroupingExpand);H.deregister(t,H.Keys.Row.Collapse,t._experimentalGroupingCollapse);delete t._experimentalGroupingRowState;delete t._experimentalGroupingExpand;delete t._experimentalGroupingCollapse;}};return G;},true);
