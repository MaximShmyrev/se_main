/*
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./PluginBase","../utils/TableUtils","sap/ui/unified/MenuItem"],function(P,T,M){"use strict";function d(c,p){var v=c.getProperty(p),m=c.getModel().getMetaModel(),s=m.getMetaPath(c.getPath()+"/"+p),o=m.getUI5Type(s);return o.formatValue(v,"string");}var V=P.extend("sap.ui.table.plugins.V4Aggregation",{metadata:{library:"sap.ui.table",properties:{},events:{}}});V.prototype.init=function(){};V.prototype.isApplicable=function(t){return t.getMetadata().getName()==="sap.ui.table.Table";};V.prototype.onActivate=function(t){var b=t.getBinding();if(b&&!b.getModel().isA("sap.ui.model.odata.v4.ODataModel")){return;}P.prototype.onActivate.apply(this,arguments);T.Grouping.setGroupMode(t);T.Hook.register(t,T.Hook.Keys.Row.UpdateState,this.updateRowState,this);T.Hook.register(t,T.Hook.Keys.Row.Expand,this.expandRow,this);T.Hook.register(t,T.Hook.Keys.Row.Collapse,this.collapseRow,this);};V.prototype.onDeactivate=function(t){P.prototype.onDeactivate.apply(this,arguments);T.Grouping.clearMode(t);T.Hook.deregister(t,T.Hook.Keys.Row.UpdateState,this.updateRowState,this);T.Hook.deregister(this,T.Hook.Keys.Row.Expand,this.expandRow,this);T.Hook.deregister(this,T.Hook.Keys.Row.Collapse,this.collapseRow,this);var b=t.getBinding();if(b){b.setAggregation();}};V.prototype.onTableRowsBound=function(b){if(b.getModel().isA("sap.ui.model.odata.v4.ODataModel")){this.updateAggregation();}else{this.onDeactivate(this.getTable());}};V.prototype.updateRowState=function(s){var l=s.context.getValue("@$ui5.node.level");if(typeof s.context.getValue("@$ui5.node.isExpanded")==="boolean"){s.type=(l===0)?s.Type.Summary:s.Type.GroupHeader;}s.expandable=s.type===s.Type.GroupHeader;s.expanded=s.context.getValue("@$ui5.node.isExpanded")===true;s.level=l;if(s.type===s.Type.GroupHeader){s.title=this._aGroupLevelFormatters[l-1](s.context,this._aGroupLevels[l-1]);}};V.prototype.setPropertyInfos=function(p){this._aPropertyInfos=p;};V.prototype.getPropertyInfos=function(){return this._aPropertyInfos||[];};V.prototype.findPropertyInfo=function(p){return this.getPropertyInfos().find(function(o){return o.name===p;});};V.prototype.isPropertyAggregatable=function(p){return(p.extension&&p.extension.defaultAggregate)?true:false;};V.prototype.setAggregationInfo=function(a){if(!a||!a.visible){this._mGroup=undefined;this._mAggregate=undefined;this._aGroupLevels=undefined;}else{this._mGroup=this.getPropertyInfos().reduce(function(g,p){if(p.key){g[p.path]={};}return g;},{});this._mAggregate={};a.visible.forEach(function(v){var p=this.findPropertyInfo(v);if(p&&p.groupable){this._mGroup[p.path]={};}if(p&&this.isPropertyAggregatable(p)){this._mAggregate[p.path]={grandTotal:a.grandTotal&&(a.grandTotal.indexOf(v)>=0),subtotals:a.subtotals&&(a.subtotals.indexOf(v)>=0)};if(p.unit){var u=this.findPropertyInfo(p.unit);if(u){this._mAggregate[p.path].unit=u.path;}}if(p.extension.defaultAggregate.contextDefiningProperties){p.extension.defaultAggregate.contextDefiningProperties.forEach(function(c){var D=this.findPropertyInfo(c);if(D&&(D.groupable||D.key)){this._mGroup[D.path]={};}}.bind(this));}}}.bind(this));this._aGroupLevels=[];this._aGroupLevelFormatters=[];if(a.groupLevels){a.groupLevels.forEach(function(g){var p=this.findPropertyInfo(g);if(p&&p.groupable){this._aGroupLevels.push(p.path);var f=(p.groupingDetails&&p.groupingDetails.formatter)||d;this._aGroupLevelFormatters.push(f);}}.bind(this));}}this.updateAggregation();};V.prototype.expandRow=function(r){if(T.isA(r,"sap.ui.table.Row")){var R=r.getRowBindingContext();if(R){R.expand();}}};V.prototype.collapseRow=function(r){if(T.isA(r,"sap.ui.table.Row")){var R=r.getRowBindingContext();if(R){R.collapse();}}};V.prototype.updateAggregation=function(){var b=this.getTableBinding();if(this._mGroup&&this._mAggregate){var s=this;Object.keys(this._mGroup).forEach(function(i){if(s._mAggregate.hasOwnProperty(i)){if((s._mAggregate[i].grandTotal||s._mAggregate[i].subtotals)==true){delete s._mGroup[i];}else{delete s._mAggregate[i];}}});}var a={aggregate:this._mAggregate,group:this._mGroup,groupLevels:this._aGroupLevels};if(b){b.setAggregation(a);}};return V;});
