/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer','sap/ui/core/theming/Parameters','./FormLayoutRenderer',"sap/base/Log"],function(R,t,F,L){"use strict";var G=R.extend(F);G.apiVersion=2;G.renderForm=function(r,l,f){var s=l.getSingleColumn();var c=16;var S=false;var C=0;var a=f.getFormContainers();var b=a.length;var i=0;var o;var d;var T=f.getToolbar();var e=f.getTitle();if(s){c=c/2;C=c;}else{C=c/2;for(i=0;i<b;i++){d=this.getContainerData(l,a[i]);if(d&&d.getHalfGrid()){S=true;break;}}}r.openStart("table",l).attr("role","presentation").attr("cellpadding","0").attr("cellspacing","0").style("border-collapse","collapse").style("table-layout","fixed").style("width","100%").class("sapUiGrid");this.addBackgroundClass(r,l);if(T){r.class("sapUiFormToolbar");}r.openEnd();r.openStart("colgroup").openEnd();r.voidStart("col").attr("span",C).voidEnd();if(S){r.voidStart("col").class("sapUiGridSpace").attr("span","1").voidEnd();}if(!s){r.voidStart("col").attr("span",C).voidEnd();}r.close("colgroup");r.openStart("tbody").openEnd();if(T||e){var g=c;if(S){g++;}r.openStart("tr").class("sapUiGridTitle").openEnd();r.openStart("th").attr("colspan",g).openEnd();var h;if(!T){h=t.get('sap.ui.layout.FormLayout:_sap_ui_layout_FormLayout_FormTitleSize');}this.renderHeader(r,T,e,undefined,false,h,f.getId());r.close("th");r.close("tr");}i=0;var j;var k;while(i<b){o=a[i];o._checkProperties();if(o.isVisible()){d=this.getContainerData(l,o);if(d&&d.getHalfGrid()&&!s){j=a[i+1];k=undefined;if(j&&j.isVisible()){k=this.getContainerData(l,j);}if(k&&k.getHalfGrid()){j._checkProperties();this.renderContainerHalfSize(r,l,o,j,c);i++;}else{this.renderContainerHalfSize(r,l,o,undefined,c);}}else{this.renderContainerFullSize(r,l,o,c,S);}}i++;}r.close("tbody");r.close("table");};G.renderContainerFullSize=function(r,l,c,C,s){var e=c.getExpandable();var T=c.getTooltip_AsString();var o=c.getToolbar();var a=c.getTitle();if(o||a){var b=C;if(s){b++;}r.openStart("tr").class("sapUiGridConteinerFirstRow").class("sapUiGridConteinerHeaderRow").openEnd();r.openStart("td").attr("colspan",b);r.class("sapUiGridHeader");if(T){r.attr('title',T);}if(o){r.class("sapUiFormContainerToolbar");}else if(a){r.class("sapUiFormContainerTitle");}r.openEnd();this.renderHeader(r,o,c.getTitle(),c._oExpandButton,e,false,c.getId());r.close("td");r.close("tr");}if(!e||c.getExpanded()){var E=c.getFormElements();var d;var f=[];var g;var h=false;for(var j=0,k=E.length;j<k;j++){d=E[j];if(d.isVisible()){g=f[0]&&(f[0][0]==C);if(!this.checkFullSizeElement(l,d)&&f[0]!="full"&&!g){r.openStart("tr",d);r.class("sapUiFormElement");}else{r.openStart("tr");}if(!h){h=true;if(!o&&!a){r.class("sapUiGridConteinerFirstRow");}}r.openEnd();if(!g){f=this.renderElement(r,l,d,false,C,s,f);}else{f.splice(0,1);}r.close("tr");if(f[0]=="full"||g){j=j-1;}}}if(f.length>0){for(var i=0;i<f.length;i++){r.openStart("tr").openEnd().close("tr");}}}};G.renderContainerHalfSize=function(r,l,c,C,a){var b=a/2;var e=c.getExpandable();var T=c.getTooltip_AsString();var s;var o=c.getTitle();var d;var f=c.getToolbar();var g;var E=[];if(!e||c.getExpanded()){E=c.getFormElements();}var h=E.length;var j=[];var k=0;var m=false;if(C){m=C.getExpandable();s=C.getTooltip_AsString();d=C.getTitle();g=C.getToolbar();if(!m||C.getExpanded()){j=C.getFormElements();}k=j.length;}if(o||d||f||g){r.openStart("tr").class("sapUiGridConteinerFirstRow").class("sapUiGridConteinerHeaderRow").openEnd();r.openStart("td").attr("colspan",b);r.class("sapUiGridHeader");if(T){r.attr('title',T);}if(f){r.class("sapUiFormContainerToolbar");}else if(o){r.class("sapUiFormContainerTitle");}r.openEnd();if(c){this.renderHeader(r,f,o,c._oExpandButton,e,false,c.getId());}r.close("td");r.openStart("td").openEnd().close("td");r.openStart("td").attr("colspan",b);r.class("sapUiGridHeader");if(s){r.attr('title',s);}if(g){r.class("sapUiFormContainerToolbar");}else if(d){r.class("sapUiFormContainerTitle");}r.openEnd();if(C){this.renderHeader(r,g,d,C._oExpandButton,m,false,C.getId());}r.close("td");r.close("tr");}if((!e||c.getExpanded())||(!m||C.getExpanded())){var n=[],p=[];var q=0,u=0;var v;var w;var x;var y;var z=false;while(q<h||u<k){v=E[q];w=j[u];x=n[0]&&(n[0][0]==b);y=p[0]&&(p[0][0]==b);if((v&&v.isVisible())||(w&&w.isVisible())||x||y){r.openStart("tr");if(!z){z=true;if(!f&&!o&&!g&&!d){r.class("sapUiGridConteinerFirstRow");}}r.openEnd();if(!x){if(v&&v.isVisible()&&(!e||c.getExpanded())){n=this.renderElement(r,l,v,true,b,false,n);}else{r.openStart("td").attr("colspan",b).openEnd().close("td");}if(n[0]!="full"){q++;}}else{if(n[0][2]>0){r.openStart("td").attr("colspan",n[0][2]).openEnd().close("td");}n.splice(0,1);}r.openStart("td").openEnd().close("td");if(!y){if(w&&w.isVisible()&&(!m||C.getExpanded())){p=this.renderElement(r,l,w,true,b,false,p);}else{r.openStart("td").attr("colspan",b).openEnd().close("td");}if(p[0]!="full"){u++;}}else{if(p[0][2]>0){r.openStart("td").attr("colspan",p[0][2]).openEnd().close("td");}p.splice(0,1);}r.close("tr");}else{q++;u++;}}if(n.length>0||p.length>0){for(var i=0;i<n.length||i<p.length;i++){r.openStart("tr").openEnd().close("tr");}}}};G.renderElement=function(r,l,e,h,c,s,a){var o=e.getLabelControl();var b=0;var f=e.getFieldsForRendering();var C=0;var A=0;var m=false;var d=1;var g=1;var x=0;if(this.checkFullSizeElement(l,e)){if(a.length>0&&a[0]!="full"){L.error("Element \""+e.getId()+"\" - Too much fields for one row!","Renderer","GridLayout");return a;}if(s){c=c+1;}if(o&&a[0]!="full"){r.openStart("td").attr("colspan",c).class("sapUiFormElementLbl").class("sapUiGridLabelFull").openEnd();r.renderControl(o);r.close("td");return["full"];}else{a.splice(0,1);g=this.getElementData(l,f[0]).getVCells();r.openStart("td").attr("colspan",c);if(g>1&&h){r.attr("rowspan",g);for(x=0;x<g-1;x++){a.push([c,undefined,false]);}}r.openEnd();r.renderControl(f[0]);r.close("td");return a;}}if(a.length>0&&a[0][0]>0){c=c-a[0][0]+a[0][2];m=a[0][1];b=a[0][2];a.splice(0,1);}var j=b;var E;var k="";if(o||b>0){j=3;if(o&&b==0){E=this.getElementData(l,o);if(E){k=E.getHCells();if(k!="auto"&&k!="full"){j=parseInt(k);}}}r.openStart("td").attr("colspan",j).class("sapUiFormElementLbl").openEnd();if(o){r.renderControl(o);}c=c-j;r.close("td");}if(f&&f.length>0){var n=c;var p=f.length;var q;var i=0;var u=0;for(i=0,u=f.length;i<u;i++){q=f[i];E=this.getElementData(l,q);if(E&&E.getHCells()!="auto"){n=n-parseInt(E.getHCells());p=p-1;}}var v=0;for(i=0,v=0,u=f.length;i<u;i++){q=f[i];E=this.getElementData(l,q);k="auto";d=1;g=1;if(E){k=E.getHCells();g=E.getVCells();}if(k=="auto"){if(n>0){d=Math.floor(n/p);if(d<1){d=1;}v++;A=A+d;if((v==p)&&(n>A)){d=d+(n-A);}}else{d=1;}}else{d=parseInt(k);}C=C+d;if(C>c){L.error("Element \""+e.getId()+"\" - Too much fields for one row!","Renderer","GridLayout");C=C-d;break;}if(g>1){for(x=0;x<g-1;x++){if(o){b=j;}if(a.length>x){a[x][0]=a[x][0]+d;a[x][2]=b;}else{a.push([j+d,undefined,b]);}}}if(s&&C>=Math.floor(c/2)&&!m){d=d+1;m=true;if(g>1){for(x=0;x<g-1;x++){a[x][1]=true;}}}r.openStart("td");if(d>1){r.attr("colspan",d);}if(g>1){r.attr("rowspan",g);}r.openEnd();r.renderControl(q);r.close("td");}}if(C<c){var w=c-C;if(!h&&s&&!m){w++;}r.openStart("td").attr("colspan",w).openEnd().close("td");}return a;};G.checkFullSizeElement=function(l,e){var f=e.getFieldsForRendering();if(f.length==1&&this.getElementData(l,f[0])&&this.getElementData(l,f[0]).getHCells()=="full"){return true;}else{return false;}};G.getContainerData=function(l,c){return l.getLayoutDataForElement(c,"sap.ui.layout.form.GridContainerData");};G.getElementData=function(l,c){return l.getLayoutDataForElement(c,"sap.ui.layout.form.GridElementData");};return G;},true);
