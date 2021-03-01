/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/simple/BaseLine","sap/gantt/simple/BaseTriangle","sap/gantt/simple/BaseDeltaRectangle","sap/gantt/misc/Format","sap/ui/core/theming/Parameters"],function(B,a,b,F,P){"use strict";var D={apiVersion:2};D.renderDeltaLineHeader=function(r,d,g,h,m){var A=g.getAxisTime();var x=A.timeToView(F.abapTimestampToDate(d.getTimeStamp()));var X=A.timeToView(F.abapTimestampToDate(d.getEndTimeStamp()));if(g.getEnableDeltaLine()===false||isNaN(x)||isNaN(X)){return;}else{var M=10;var i=4;var c=6;d._setEnableChartDeltaAreaHighlight(g.getEnableChartDeltaAreaHighlight());var f;var e;var j;var k;var l;var H=d.getStrokeDasharray();var n=d._getStrokeWidth();var o=Math.abs(X-x);o=o<=0?1:o;if(o<c){j=(X+x)/2;f=j-c;e=j+c;k=1;l=P.get("sapUiChartDataPointBorderColor");d._setVisibleMarker(true);}else{f=x;e=X;k=0;d._setVisibleMarker(false);l=null;}if(d._getIsSelected()===true){k=1;l=P.get("sapUiChartDataPointBorderColor");H="solid";n=n+1;}var p;var t=h-m;p=t+2+(d._getLevel()-1)*6;var q=d._getHeaderDeltaArea();if(!q){q=new b({x:x,y:p,height:i,width:X-x,fill:d.getStroke(),hoverable:true,press:function(E){d.press(E);d.firePress(E);},mouseEnter:function(E){d.mouseEnter(E);d.fireMouseEnter(E);},mouseLeave:function(E){d.mouseLeave(E);d.fireMouseLeave(E);}}).addStyleClass("sapGanntChartMarkerCursorPointer");d._setHeaderDeltaArea(q);}else{q.setProperty("x",x,true);q.setProperty("width",X-x,true);q.setProperty("y",p,true);}q.renderElement(r,q);var s=d._getHeaderStartLine();if(!s){s=new B({x1:x,y1:p,x2:x,y2:p+m,stroke:d.getStroke(),strokeWidth:n,strokeDasharray:H,strokeOpacity:d.getStrokeOpacity(),tooltip:d.getDescription()});d._setHeaderStartLine(s);}else{s.setProperty("x1",x,true);s.setProperty("x2",x,true);s.setProperty("y1",p,true);s.setProperty("y2",p+m,true);s.setProperty("strokeDasharray",H,true);s.setProperty("strokeWidth",n,true);}s.renderElement(r,s);var u=d._getHeaderEndLine();if(!u){u=new B({x1:X,y1:p,x2:X,y2:p+m,stroke:d.getStroke(),strokeWidth:n,strokeDasharray:H,strokeOpacity:d.getStrokeOpacity(),tooltip:d.getDescription()});d._setHeaderEndLine(u);}else{u.setProperty("x1",X,true);u.setProperty("x2",X,true);u.setProperty("y1",p,true);u.setProperty("y2",p+m,true);u.setProperty("strokeDasharray",H,true);u.setProperty("strokeWidth",n,true);}u.renderElement(r,u);var v=d._getForwardMarker();if(!v){v=new a({x:f,y:0,height:M,width:c,stroke:l,rowYCenter:p-3,fill:d.getStroke(),fillOpacity:k,orientation:"right",hoverable:true,press:function(E){d.press(E);d.firePress(E);},mouseEnter:function(E){d.mouseEnter(E);d.fireMouseEnter(E);},mouseLeave:function(E){d.mouseLeave(E);d.fireMouseLeave(E);}}).addStyleClass("sapGanntChartMarkerCursorPointer");d._setForwardMarker(v);}else{v.setProperty("x",f,true);v.setProperty("fillOpacity",k,true);v.setProperty("rowYCenter",p-3,true);v.setProperty("stroke",l,true);}v.renderElement(r,v);var w=d._getBackwardMarker();if(!w){w=new a({x:e,y:0,height:M,width:c,stroke:l,rowYCenter:p-3,fill:d.getStroke(),fillOpacity:k,orientation:"left",hoverable:true,press:function(E){d.press(E);d.firePress(E);},mouseEnter:function(E){d.mouseEnter(E);d.fireMouseEnter(E);},mouseLeave:function(E){d.mouseLeave(E);d.fireMouseLeave(E);}}).addStyleClass("sapGanntChartMarkerCursorPointer");d._setBackwardMarker(w);}else{w.setProperty("x",e,true);w.setProperty("fillOpacity",k,true);w.setProperty("rowYCenter",p-3,true);w.setProperty("stroke",l,true);}w.renderElement(r,w);}};D.renderDeltaLines=function(r,d,g){var A=g.getAxisTime();var x=A.timeToView(F.abapTimestampToDate(d.getTimeStamp()));var X=A.timeToView(F.abapTimestampToDate(d.getEndTimeStamp()));var s=d.getStrokeDasharray();var S=d._getStrokeWidth();if(d._getIsSelected()===true){s="solid";S=S+1;}var o=d._getStartLine();if(!o){o=new B({x1:x,y1:0,x2:x,y2:"100%",stroke:d.getStroke(),strokeWidth:S,strokeDasharray:s,strokeOpacity:d.getStrokeOpacity(),tooltip:d.getDescription()});d._setStartLine(o);}else{o.setProperty("x1",x,true);o.setProperty("x2",x,true);o.setProperty("strokeDasharray",s,true);o.setProperty("strokeWidth",S,true);}o.renderElement(r,o);var e=d._getEndLine();if(!e){e=new B({x1:X,y1:0,x2:X,y2:"100%",stroke:d.getStroke(),strokeWidth:S,strokeDasharray:s,strokeOpacity:d.getStrokeOpacity(),tooltip:d.getDescription()});d._setEndLine(e);}else{e.setProperty("x1",X,true);e.setProperty("x2",X,true);e.setProperty("strokeDasharray",s,true);e.setProperty("strokeWidth",S,true);}e.renderElement(r,e);};D.renderChartAreaOfDeltaLines=function(r,d,g){var A=g.getAxisTime();var x=A.timeToView(F.abapTimestampToDate(d.getTimeStamp()));var X=A.timeToView(F.abapTimestampToDate(d.getEndTimeStamp()));var o=0.0;if(d._getIsSelected()===true){o=1.0;}var c=d._getChartDeltaArea();if(g.getDeltaAreaHighlightColor()===""){g.setDeltaAreaHighlightColor("@sapUiListSelectionBackgroundColor");}if(!c){c=new b({x:x+1,y:0,height:"100%",width:X-x-2,fill:g.getDeltaAreaHighlightColor(),opacity:o});d._setChartDeltaArea(c);}else{c.setProperty("x",x+1,true);c.setProperty("width",X-x-2,true);c.setProperty("opacity",o,true);}c.renderElement(r,c);};return D;},true);