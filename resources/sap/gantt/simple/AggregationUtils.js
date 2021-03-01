/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";var i=function(o,t){if(!o||!t){return false;}return o.isA(t);};var A={isParentRowSetting:function(s){return s.getParent().isA("sap.gantt.simple.GanttRowSettings");},getParentControlOf:function(c,e){if(i(e,c)){return e;}var p=e.getParent(),C;while(p&&i(p,c)===false){p=p.getParent();}C=p;return C;},isDeltaLine:function(e){return e.getParent().isA('sap.gantt.simple.DeltaLine');},isLazyAggregation:function(e){var p=e.getParent();if(!p){return false;}var a=p.getMetadata().getAggregation(e.sParentAggregationName);return this._hasLazyConfiguration(a);},isAdhocLine:function(e){return e.getParent().isA('sap.gantt.simple.AdhocLine');},isLazy:function(e,n){return Object.keys(this.getLazyAggregations(e)).indexOf(n)!==-1;},getLazyAggregations:function(e){return this._filterAggregationBy(e,function(a){return A._hasLazyConfiguration(a);});},getLazyElementsByScheme:function(e,s){var a=this.getLazyAggregations(e);var c=[];Object.keys(a).forEach(function(n){var C=e.getAggregation(n);if(C&&!q.isArray(C)){C=[C];}if(C&&C.length>0&&C[0].getScheme()===s){c.push(C);}});return[].concat.apply([],c);},_hasLazyConfiguration:function(a){return a.appData&&a.appData.sapGanttLazy===true;},getNonLazyAggregations:function(e){return this._filterAggregationBy(e,function(a){return a.appData===null||!a.appData.sapGanttLazy;});},_filterAggregationBy:function(e,c){var m=e.getMetadata(),a=m.getAggregations();var r={};for(var n in a){if(a.hasOwnProperty(n)){var o=a[n];if(c(o)){r[n]=o;}}}return r;},eachNonLazyAggregation:function(e,c){var m=this.getNonLazyAggregations(e);var k=Object.keys(m).sort(function(a,b){var o=m[a].appData?(m[a].appData.sapGanttOrder||0):0;var d=m[b].appData?(m[b].appData.sapGanttOrder||0):0;return o-d;});k.forEach(function(n){var a=m[n];var C=e[a._sGetter]();if(q.isArray(C)){C.forEach(function(o){c(o);});}else if(C){c(C);}});}};return A;},true);
