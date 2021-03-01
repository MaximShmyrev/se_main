/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseText","./AggregationUtils","./GanttUtils","sap/ui/core/Core"],function(B,A,G,C){"use strict";var d=12;var R={apiVersion:2,RENDER_EXTEND_FACTOR:0.382,getGanttRenderWidth:function(g){var v=jQuery.sap.byId(g.getId()+"-gantt").width();return v*(1+2*R.RENDER_EXTEND_FACTOR);},renderAttributes:function(r,e,a){var p=a.map(function(b){var P=b.split("-").reduce(function(c,n){return c+n.charAt(0).toUpperCase()+n.slice(1);},"get");return{name:b,value:e[P]()};});p.forEach(function(o){if(o.value||o.value===0){if(o.name==="style"){var s=o.value.split(";");s.forEach(function(S){S=S.trim();if(S!=""){var b=S.split(/:(.*)/);if(b[0]==="fill"&&(b[1].indexOf(" ")!=-1)){b[1]=encodeURI(b[1]);}r.style(b[0],b[1]);}});}else{r.attr(o.name,o.value);}}});},renderTooltip:function(r,e){if(e.getTooltip()){r.openStart("title").openEnd();r.text(e.getTooltip());r.close("title");}},updateShapeSelections:function(g,s,D){if(g._getResizeExtension==null){return;}var r=g._getResizeExtension();var a=g.getId();G.getShapesWithUid(a,D).forEach(function(e){if(e){if(e.isA("sap.gantt.simple.shapes.Shape")){e.setSelected(false);}else{e.setProperty("selected",false,true);}}});r.clearAllOutline(a);G.getShapesWithUid(a,s).forEach(function(e){if(e){if(e.isA("sap.gantt.simple.shapes.Shape")){e.setSelected(true);}else{e.setProperty("selected",true,true);r.toggleOutline(e);}g.getSelection().updateProperties(e.getShapeUid(),{draggable:e.getDraggable(),time:e.getTime(),endTime:e.getEndTime()});}});},getShapeElementByTarget:function(t){return jQuery(this.getDraggableDOMElement(t)).control(0,true);},getDraggableDOMElement:function(t){return jQuery(t).closest("["+G.SHAPE_ID_DATASET_KEY+"]").get(0);},renderElementTitle:function(r,e){if(e.getShowTitle==null||!e.getShowTitle()){return;}var t=e.getTitle();if(t){var h=0,E=0,s=0;if(e.getWidth){E=e.getWidth();s=e.getWidth();}if(e.getHeadWidth){h=e.getHeadWidth();E-=h;}if(e.getTailWidth){E-=e.getTailWidth();}var c=2+h;var T={text:t,fill:"#000",showEllipsis:true,truncateWidth:E,textAnchor:e.getHorizontalTextAlignment(),verticalTextAlignment:e.getVerticalTextAlignment()};if(T.textAnchor==="Start"){T.x=C.getConfiguration().getRTL()?e.getX()+e.getWidth():e.getX()+c;this.setVerticalAlignment(e,T);}else if(T.textAnchor==="End"){T.x=C.getConfiguration().getRTL()?e.getX()+c:e.getX()+e.getWidth();this.setVerticalAlignment(e,T);}else if(T.textAnchor==="Middle"){T.x=e.getX()+e.getWidth()/2;this.setVerticalAlignment(e,T);}else if(T.textAnchor==="Ribbon"){C.getConfiguration().getRTL()?this.renderRepetitiveTextRTL(e,T):this.renderRepetitiveTextLTR(e,T);this.setVerticalAlignment(e,T);}var o=new B(T).addStyleClass("sapGanttTextNoPointerEvents");o.setProperty("childElement",true,true);o.renderElement(r,o);}},setVerticalAlignment:function(e,t){if(t.verticalTextAlignment==="Top"){t.y=e.getY()+parseInt(e.getHeight(),10)-d/1.5;}else if(t.verticalTextAlignment==="Bottom"){t.y=e.getRowYCenter()+d/1.5;}else{t.y=e.getRowYCenter()+d/2.5;}},renderRepetitiveTextLTR:function(e,t){t.textAnchor="Start";t.x=e.getX();var a=t.x;while(a<e.getX()+e.getWidth()){t.text=t.text+Array(10).fill('\xa0').join('')+t.text;a=e.getX()+t.text.length;}},renderRepetitiveTextRTL:function(e,t){t.textAnchor="Start";t.x=e.getX()+e.getWidth();var a=t.x;while(a>e.getX()){t.text=t.text+Array(10).fill('\xa0').join('')+t.text;a=a-t.text.length;}},renderInlineShapes:function(r,o,g){var t=o.getId()+"-top";var s=o.getId()+"-row";r.openStart("g",o);r.class(t);r.openEnd();r.openStart("g");r.attr(G.ROW_ID_DATASET_KEY,o.getRowId()||"");r.class(s);r.openEnd();this.renderMainRowAllShapes(r,o,g);r.close("g");r.close("g");},renderMainRowAllShapes:function(r,o,g){var a=g.getSyncedControl().getRowStates();var p=this.calcRowDomPosition(o,a),m=p.rowYCenter,i=p.rowHeight;var b=A.getNonLazyAggregations(o);var s=Object.keys(b).filter(function(n){return n!=="calendars"&&n!=="relationships";}).map(function(n){return o.getAggregation(n)||[];}.bind(o));var c=o.getRowUid(),S=g.oSelection,e=g._oExpandModel,f=g.getAxisTime(),h=e.isRowExpanded(c);s.forEach(function(j,I){j.forEach(function(k){if(g.isShapeVisible(k)){R.renderMainRowShape(r,k,{expandModel:e,selectionModel:S,axisTime:f,rowSetting:o,rowUid:c,rowExpanded:h,mainRowYCenter:m,rowHeight:i},g.getShowParentRowOnExpand());}});});},renderMainRowShape:function(r,s,o,S){this.setSpecialProperties(s,o);if((!Object.keys(o.expandModel.mExpanded).includes(o.rowUid)&&!o.rowExpanded)||S){s.renderElement(r,s,null);}if(o.rowExpanded){this.renderExpandShapesIfNecessary(r,s,o,S);}},setSpecialProperties:function(s,o){var e=o.expandModel,r=o.rowUid,S=o.rowSetting.getShapeUid(s);if(!s._iBaseRowHeight){s._iBaseRowHeight=o.rowHeight;var a=A.getNonLazyAggregations(s);Object.keys(a).filter(function(n){var b=a[n];if(b.appData!==null){return b.appData.sapGanttOrder===1;}}).map(function(n){if(n==="utilizationBar"||n==="utilizationLine"){s._iBaseRowHeight=s._iBaseRowHeight-1;}});}s.mAxisTime=o.axisTime;s.setProperty("shapeUid",S,true);s.setProperty("selected",o.selectionModel.existed(S),true);s.setProperty("rowYCenter",e.getRowYCenterByUid(r,o.mainRowYCenter,s.getScheme(),0),true);},isValidD:function(D){return!!D&&D.indexOf("NaN")===-1&&D.indexOf("undefined")===-1&&D.indexOf("null")===-1;},renderExpandShapesIfNecessary:function(r,m,o,s){var f=function(S){if(!S||S.length===0){return;}var e=S;if(jQuery.isArray(S)===false){e=[S];}G.calculateLevelForShapes(e,"time","endTime");e.forEach(function(b,i){if(b._level){i=b._level-1;}var c=s?o.expandModel.getRowYCenterByUid(o.rowUid,null,b.getScheme(),i):o.expandModel.getRowYCenterByUid(o.rowUid,null,b.getScheme(),i)-m._iBaseRowHeight;b.setProperty("rowYCenter",c,true);b._iBaseRowHeight=o.expandModel.getExpandShapeHeightByUid(o.rowUid,b.getScheme(),o.iRowHeight);b.setProperty("shapeUid",o.rowSetting.getShapeUid(b),true);b.renderElement(r,b);});};var a=A.getLazyAggregations(m);Object.keys(a).forEach(function(n){var S=m.getAggregation(n);f(S);});},calcRowDomPosition:function(r,a){var o=r._getRow(),t=o.getParent(),i=t.indexOfRow(o);var b=a[i].height;var c=0;for(var I=0;I<=i;I++){c+=a[I].height;}c-=b/2;return{rowYCenter:c,rowHeight:b};},pushOrUnshift:function(a,i,u){if(u===true){a.splice(0,0,i);}else{a.push(i);}},createOrderedListOfRenderFunctionsFromTemplate:function(t){var o=[];for(var i=0;i<t.length;i++){this.pushOrUnshift(o,t[i].fnCallback,t[i].bUnshift);}return o;}};return R;},true);