/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Core","./UtilizationChart","sap/gantt/def/pattern/BackSlashPattern"],function(q,C,U,B){"use strict";var c=U.extend("sap.gantt.simple.UtilizationLineChart",{metadata:{library:"sap.gantt",properties:{showMiddleLine:{type:"boolean",defaultValue:true}},defaultAggregation:"dimensions",aggregations:{dimensions:{type:"sap.gantt.simple.UtilizationDimension",group:"Data"}},associations:{overConsumptionPattern:{type:"sap.gantt.def.DefBase",altTypes:["string"],multiple:false,group:"Appearance"}}},renderer:{apiVersion:2}});c.prototype.applySettings=function(s,S){s=s||{};U.prototype.applySettings.call(this,s,S);this._createDefaultDefs();};c.prototype.renderElement=function(r,e){if(this.getDimensions().length===0){this.renderEmptyDomRefs(r,true);return;}this.renderEmptyDomRefs(r,false);var x=this.getX(),h=this.getHeight(),y=this.getRowYCenter()-h/2,w=this.getWidth();var p={x:x,y:y,width:w,height:h};this.renderDimensionClipPaths(r,p);this.renderDefaultDefs(r);this.renderULCBackground(r,p);this.renderMiddleLine(r,p);this.renderOverConsumptionBackground(r,p);this.renderOverConsumptionClipPath(r,p);this.renderDimensionPaths(r,p);this.renderTooltips(r,p);r.close("g");};c.prototype.renderEmptyDomRefs=function(r,b){r.openStart("g",this);r.class("sapGanttUtilizationLine");r.openEnd();if(b){r.close("g");}};c.prototype.renderDimensionClipPaths=function(r,p){var d=this.getDimensions();r.openStart("defs").openEnd();for(var i=0;i<d.length;i++){r.openStart("clipPath",d[i].getId()+"-clipPath");r.openEnd();this.renderDimensionPath(r,d[i],p.y,p.height);r.close("clipPath");}r.close("defs");};c.prototype.renderULCBackground=function(r,p){var a=q.extend({id:this.getId()+"-ulcBg",fill:this.getFill()||"transparent",stroke:"none"},true,p);this.renderRectangleWithAttributes(r,a);};c.prototype.getClipPathIdOfDimension=function(d){return"url(#"+d.getId()+"-clipPath)";};c.prototype.renderOverConsumptionBackground=function(r,p){var m=q.extend({id:this.getId()+"-ulcOverConsumptionBg",fill:this._getOverageFillPattern()},true,p);m.height=this.getThresholdHeight(p.height);this.renderRectangleWithAttributes(r,m);};c.prototype.renderOverConsumptionClipPath=function(r,p){var m=q.extend({},true,p);m.height=this.getThresholdHeight(p.height);var d=this.getDimensions();for(var i=0;i<d.length;i++){var a=q.extend({"clip-path":this.getClipPathIdOfDimension(d[i]),fill:this.getOverConsumptionColor()},true,m);this.renderRectangleWithAttributes(r,a);}};c.prototype._getOverageFillPattern=function(){var p=this.getOverConsumptionPattern();if(p){p=C.byId(p).getRefString();}else{p="url(#"+this.getId()+"-defaultPattern"+")";}return p;};c.prototype.getThresholdHeight=function(h){return(this.getOverConsumptionMargin()*h)/(100+this.getOverConsumptionMargin());};c.prototype.renderMiddleLine=function(r,p){if(this.getShowMiddleLine()){var m=this.getMiddleLineY(p);r.openStart("path",this.getId()+"-middleLine");r.attr("d","M "+p.x+" "+m+" h "+p.width);r.class("sapGanttUtilizationMiddleLine");r.openEnd().close("path");}};c.prototype.getMiddleLineY=function(p){var t=this.getThresholdHeight(p.height);return(p.y+t)+(p.height-t)/2;};c.prototype.renderDimensionPaths=function(r,p){var x=p.x,o=this.getThresholdHeight(p.height),y=p.y,w=p.width,h=p.height;var d=this.getDimensions();for(var i=0;i<d.length;i++){r.openStart("g").openEnd();var D=d[i];this.renderDimensionPath(r,D,y,h,"ulcPath");var a={id:D.getId()+"-ulcRect",x:x,y:y+o,width:w,height:h-o,fill:this.getRemainCapacityColor(),"fill-opacity":0.5,"stroke-opacity":0.5,"clip-path":this.getClipPathIdOfDimension(D)};this.renderRectangleWithAttributes(r,a);r.close("g");}};c.prototype.renderTooltips=function(r,p){var y=p.y,h=p.height;r.openStart("g");r.class("ulc-tooltips").openEnd();var d=this.getAllDimensionPoints();d.forEach(function(P,i,a){var n=a[i+1]||P;var t=P.tooltip;var D=P.name!==n.name;if(D){t=P.tooltip+"\n"+n.tooltip;}var x=this.toX(P.from),l=a.length-1===i,X=this.toX(l?n.to:n.from),w=Math.abs(X-x);if(w>0){var m={opacity:0,fillOpacity:0,strokeOpacity:0};var A=q.extend({x:x,y:y,width:w,height:h},m);this.renderRectangleWithAttributes(r,A,t);}}.bind(this));r.close("g");};c.prototype.getAllDimensionPoints=function(){var A=[];this.getDimensions().forEach(function(d){var n=d.getName();d.getPeriods().forEach(function(p,i,P){var t=p.getTooltip();if(!t){t=n+":"+p.getValue();}A.push({name:n,from:p.getFrom(),to:p.getTo(),tooltip:t});});});A.sort(function(a,b){return a.from-b.from;});return A;};c.prototype.renderDimensionPath=function(r,D,R,a,I){var p=D.getPeriods();var d="";for(var i=0;i<p.length;i++){var f=(i===0),l=(i===p.length-1);var P=p[i];var x=this.toX(P.getFrom());var b=this.toX(P.getTo());var v=P.getValue();var m=this.getOverConsumptionMargin();if(v>(100+m)){v=100+m;}var y=R+a;var e=a*(v/(100+m));var g=y-e;d+=(f?" M "+x+" "+y:"")+" L "+x+" "+g+" L "+b+" "+g+(l?" L "+b+" "+y:"");}if(I){r.openStart("path",D.getId()+"-"+I);}else{r.openStart("path");}r.attr("d",d);r.attr("fill","none");r.attr("stroke-width",2);r.attr("stroke",D.getDimensionColor());r.class("sapGanttUlcDimensionPath");r.openEnd().close("path");};c.prototype._createDefaultDefs=function(){if(this.getOverConsumptionPattern()){return;}this.mDefaultDefs=new sap.gantt.def.SvgDefs({defs:[new B({id:this.getId()+"-defaultPattern",tileWidth:5,tileHeight:9,backgroundColor:"#fff",stroke:"#ececec",strokeWidth:1})]});};c.prototype.renderDefaultDefs=function(r){if(this.mDefaultDefs){r.unsafeHtml(this.mDefaultDefs.getDefString());}};c.prototype.destroy=function(){U.prototype.destroy.apply(this,arguments);if(this.mDefaultDefs){this.mDefaultDefs.destroy();}};return c;},true);
