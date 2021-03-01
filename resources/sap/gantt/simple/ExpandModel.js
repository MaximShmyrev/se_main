/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/ManagedObject","./AggregationUtils","./GanttUtils"],function(q,M,A,G){"use strict";var E=M.extend("sap.gantt.simple.ExpandModel",{metadata:{properties:{baseRowHeight:{type:"int",group:"Appearance",defaultValue:null}}},constructor:function(){M.apply(this,arguments);this.mExpanded={};}});E.prototype.isTableRowHeightNeedChange=function(e,t,s,p,o){var b=false;var f=t.getFirstVisibleRow();var S=o.getKey();for(var i=0;i<s.length;i++){var a=s[i];var c=f>a;if(c){break;}var r=G.getSelectedTableRowSettings(t,a);if(r==null){break;}var d=r.getAllExpandableShapes();var l=[];d.forEach(function(g){var C=A.getLazyElementsByScheme(g,S);var h=G.calculateLevelForShapes(C,"time","endTime");l.push(h.maxLevel);});var m=Math.max.apply(null,l);if(m>0){this.toggle(e,r,p,o,m);b=true;}}return b;};E.prototype.refreshRowYAxis=function(t){if(this.hasExpandedRows()===false){return;}var g=t.getParent();var r=t.getRows();var R=t.getParent().getTableRowHeights();var a=0;for(var i=0;i<r.length;i++){var o=r[i],b=o.getAggregation("_settings"),s=b.getRowUid();a+=(R[i-1]||0);if(!this.isRowExpanded(s)){continue;}var c=this.getBaseRowHeight();if(g.getExpandedRowHeight()){c=g.getExpandedRowHeight();}this.calcExpandRowYAxis({uid:b.getRowUid(),rowIndex:i,rowY:a,baseRowHeight:c,allRowHeights:R});}return this.getBaseRowHeight();};E.prototype.toggle=function(e,r,m,o,i){if(e){this.expand(r,m,o,i);}else{this.collapse(r,o);}};E.prototype.expand=function(r,m,e,i){var u=r.getRowUid(),s=m.getKey(),a=m.getRowSpan();var b=e.getKey(),c=e.getRowSpan();var I=this.mExpanded[u];if(!I||I.length===0){this.mExpanded[u]=[{scheme:s,metadata:{rowSpan:a,main:true}}];}if(!this.hasExpandScheme(u,b)){this.mExpanded[u].push({scheme:b,metadata:{numberOfRows:i,rowSpan:c}});}this.updateVisibleRowSpan(u);};E.prototype.collapse=function(r,e){var u=r.getRowUid();if(u&&this.mExpanded[u]==null){return;}var s=e.getKey();var i=this.mExpanded[u];for(var I=0;I<i.length;I++){var o=i[I];if(o.scheme===s){i.splice(I,1);}if(this.hasNoExpandRows(u)){delete this.mExpanded[u];break;}else{this.updateVisibleRowSpan(u);}}};E.prototype.hasExpandScheme=function(u,s){return this.mExpanded[u].filter(function(i){return i.scheme===s;}).length>0;};E.prototype.hasExpandedRows=function(){return!q.isEmptyObject(this.mExpanded);};E.prototype.isRowExpanded=function(u){return!this.hasNoExpandRows(u);};E.prototype.hasNoExpandRows=function(u){var i=this.mExpanded[u]||[];return i.every(function(I){return I.metadata.main;});};E.prototype.updateVisibleRowSpan=function(u){var i=this.mExpanded[u]||[];var m,o,n=0;for(var I=0;I<i.length;I++){var a=i[I];var k=a.scheme;var v=a.metadata;if(v.main){m=k;o=v;}else{n=v.rowSpan*(v.numberOfRows||1);}}o.numberOfSubRows=n;this.mExpanded[u][0]={scheme:m,metadata:o};};E.prototype.getMainRowScheme=function(u){var i=this.mExpanded[u]||[];return i.filter(function(I){return I.metadata.main;}).map(function(m){return{key:m.scheme,value:m.metadata};})[0];};E.prototype.getExpandSchemeKeys=function(u){var i=this.mExpanded[u]||[];return i.filter(function(I){return!I.metadata.main;}).map(function(I){return I.scheme;});};E.prototype.getCalculatedRowHeight=function(r,b,t){var R=b;var g=t.getParent();if(this.hasExpandedRows()){var u=r.getRowUid();if(!u){return R;}var i=this.mExpanded[u];if(i){var m=this.getMainRowScheme(u);if(g.getExpandedRowHeight()===undefined||isNaN(g.getExpandedRowHeight())){R=b*(m.value.rowSpan+m.value.numberOfSubRows);}else{R=g.getShowParentRowOnExpand()?(b*m.value.rowSpan)+(m.value.numberOfSubRows*g.getExpandedRowHeight()):(m.value.numberOfSubRows*g.getExpandedRowHeight());}}}return R;};E.prototype.getRowHeightByIndex=function(t,i,T){if(t==null){return T;}var r=t.getRows(),R=r[i].getAggregation("_settings");return this.getCalculatedRowHeight(R,T,t);};E.prototype.calcExpandRowYAxis=function(p){var u=p.uid,b=p.baseRowHeight;var f=p.rowY;var o,s,e=[];var a=[];var I=this.mExpanded[u];if(q.isEmptyObject(I)){return;}for(var c=0;c<I.length;c++){var d=I[c],k=d.scheme,v=d.metadata;if(v.main){o=v;s=k;}else{a.push(v);e.push(k);}}var g=o?o.rowSpan:1;var h={};h[s]=[g];var r=[h];for(var i=0;i<a.length;i++){var l=a[i],R=l.rowSpan,t=l.numberOfRows;var S=[];for(var j=0;j<t;j++){S.push(R);}h={};h[e[i]]=S;r.push(h);}var w=f;for(var m=0;m<r.length;m++){var x=r[m],y=Object.keys(x)[0],z=x[y];if(m===0){this._updateRowYAxis(u,y,{rowYAxis:[w].slice()});}else{var B=[];if(z.length===1){B.push(w+b);w+=(z[0]*b);}else{for(var n=0;n<z.length;n++){if(n===0){if(this.getBaseRowHeight()!==b){w=w+(z[n]*this.getBaseRowHeight());}else{w=w+(z[n]*b);}}else{w=w+(z[n]*b);}B.push(w);}}this._updateRowYAxis(u,y,{rowYAxis:B.slice()});}}};E.prototype._updateRowYAxis=function(u,s,v){var r=v.rowYAxis;var i=this.mExpanded[u]||[];for(var I=0;I<i.length;I++){var o=i[I];if(o.scheme===s){o.metadata.yAxis=r;break;}}};E.prototype.getRowYCenterByUid=function(u,m,s,e){var r=this.isRowExpanded(u);if(r===false){return m;}var I=this.mExpanded[u],S=s||this.getMainRowScheme(u).key;for(var a=0;a<I.length;a++){var o=I[a];if(o.scheme===S){var y=o.metadata.yAxis;var b;if(y.length===1&&o.metadata.main){b=this.getBaseRowHeight();}else if(y.length===1&&!o.metadata.main){y[0]=y[0]-(this.getBaseRowHeight()*a);b=y[0]-this.getBaseRowHeight();}else{b=y[1]-y[0];}var R=0,t=this;var c=b*o.metadata.rowSpan;var d=y.map(function(v){if(y.length===1&&!o.metadata.main){if(y[0]>50){R=v+(c/2)+t.getBaseRowHeight()-(y[0]-50);}else{R=v+(c/2)+t.getBaseRowHeight()+(50-y[0]);}y[0]=y[0]+(t.getBaseRowHeight()*a);}else{R=v+(c/2);}return R;});var i=e===undefined?0:e;return d[i];}}};E.prototype.getExpandShapeHeightByUid=function(u,s,f){var i=this.mExpanded[u];var F=i.filter(function(I){return I.scheme===s;})[0];return F?F.metadata.rowSpan*this.getBaseRowHeight():f;};E.prototype.intersectRows=function(l,r){return q.grep(l,function(L){return q.inArray(L,r)>-1;});};E.prototype.collectExpandedBgData=function(r,e){var I=this.intersectRows(r,Object.keys(this.mExpanded));if(q.isEmptyObject(this.mExpanded)||q.isEmptyObject(r)||q.isEmptyObject(I)){return[];}var R=this.getBaseRowHeight();var a=[];for(var b=0;b<I.length;b++){var u=I[b],c=this.mExpanded[u]||[];for(var i=0;i<c.length;i++){var o=c[i],y=o.metadata.yAxis||[],m=o.metadata.main;if(!m){var s=[];if(e){R=e;}y.forEach(function(Y){s.push({x:0,y:Y,rowUid:u,rowHeight:R*o.metadata.rowSpan});});a.push(s);}}}return a;};return E;},true);
