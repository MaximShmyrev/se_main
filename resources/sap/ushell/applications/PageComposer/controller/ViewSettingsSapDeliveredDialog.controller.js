// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/format/DateFormat","sap/ui/core/mvc/Controller","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/Sorter"],function(D,C,F,a,S){"use strict";var s={id:"sapDeliveredColumnPageId",description:"sapDeliveredColumnPageId",title:"sapDeliveredColumnPageTitle"};return C.extend("sap.ushell.applications.PageComposer.controller.ViewSettingsDialogSapDelivered",{constructor:function(P){this.PageOverviewController=P;},handleSapDeliveredDialogConfirm:function(e){var p=e.getParameters(),c=this.PageOverviewController.sCurrentTableId,t=this.PageOverviewController.byId(c),b=t.getBinding("items"),d=this.getSorters(p),f=this.getFilters(p);b.sort(d);this.PageOverviewController.updateSortIndicators(p.sortItem.getKey(),p.sortDescending,s,t.getColumns());this.PageOverviewController.mViewSettingsFilters[this.PageOverviewController.sCurrentTableId]=f;this.PageOverviewController._applyCombinedFilters(f,this.PageOverviewController.mSearchFilter[this.PageOverviewController.sCurrentTableId]);this.PageOverviewController.byId(this.PageOverviewController.sCurrentTableId.slice(0,-5)+"InfoFilterBar").setVisible(!!Object.keys(f).length);this.PageOverviewController.byId(this.PageOverviewController.sCurrentTableId.slice(0,-5)+"InfoFilterLabel").setText(p.filterString);},getSorters:function(p){var b=[],g=p.groupItem;if(g){var G=g.getKey(),f;switch(G){case"createdOnSapDelivered":case"modifiedOn":f=function(c){var o=D.getInstance({style:"medium"}),d=c.getProperty(G),e=o.format(d);return{key:e,text:e};};break;default:f=function(c){var n=c.getProperty(G);return{key:n,text:n};};}b.push(new S(G,p.groupDescending,f));}if(p.sortItem){b.push(new S(p.sortItem.getKey(),p.sortDescending));}else{b.push(new S("id",true));}return b;},getFilters:function(p){var f={};p.filterItems.forEach(function(i){var P,o,v,V;if(i.getKey()==="createdOn"||i.getKey()==="modifiedOn"){var d=i.getCustomControl();P=i.getKey();o=a.BT;v=d.getDateValue();V=d.getSecondDateValue();if(P==="createdOn"){this._createdOnFromFilter=v;this._createdOnToFilter=V;}else{this._changedOnFromFilter=v;this._changedOnToFilter=V;}}else{var b=i.getKey().split("___");P=b[0];o=b[1];v=b[2];V=b[3];}if(!f[P]){f[P]=[];}f[P].push(new F(P,o,v,V));}.bind(this));return f;},handleSapDeliveredDateRangeSelectionChanged:function(e){var p=e.getParameters(),v=p.id==="SapDeliveredCreatedOnDateRangeSelection"?sap.ui.getCore().byId("SapDeliveredCreatedOnFilter"):sap.ui.getCore().byId("SapDeliveredChangedOnFilter");if(p.from){v.setFilterCount(1);v.setSelected(true);}else{v.setFilterCount(0);v.setSelected(false);}}});});
