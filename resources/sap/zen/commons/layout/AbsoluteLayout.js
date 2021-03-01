/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./PositionContainer','sap/zen/commons/library','sap/ui/core/Control'],function(q,P,l,C){"use strict";var A=C.extend("sap.zen.commons.layout.AbsoluteLayout",{metadata:{library:"sap.zen.commons",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},verticalScrolling:{type:"sap.ui.core.Scrolling",group:"Behavior",defaultValue:sap.ui.core.Scrolling.Hidden},horizontalScrolling:{type:"sap.ui.core.Scrolling",group:"Behavior",defaultValue:sap.ui.core.Scrolling.Hidden}},defaultAggregation:"positions",aggregations:{positions:{type:"sap.zen.commons.layout.PositionContainer",multiple:true,singularName:"position"}}}});(function(){A.prototype.setWidth=function(w){return s(this,"width",w,"LYT_SIZE");};A.prototype.setHeight=function(h){return s(this,"height",h,"LYT_SIZE");};A.prototype.setVerticalScrolling=function(v){return s(this,"verticalScrolling",v,"LYT_SCROLL");};A.prototype.setHorizontalScrolling=function(h){return s(this,"horizontalScrolling",h,"LYT_SCROLL");};A.prototype.insertPosition=function(p,i){var h=!!this.getDomRef();this.insertAggregation("positions",p,i,h);if(h&&p&&p.getControl()){this.contentChanged(p,"CTRL_ADD");}return this;};A.prototype.addPosition=function(p){var h=!!this.getDomRef();this.addAggregation("positions",p,h);if(h&&p&&p.getControl()){this.contentChanged(p,"CTRL_ADD");}return this;};A.prototype.removePosition=function(p){var h=!!this.getDomRef();var r=this.removeAggregation("positions",p,h);if(r){c([r]);this.contentChanged(r,"CTRL_REMOVE");}return r;};A.prototype.removeAllPositions=function(){c(this.getPositions());var h=!!this.getDomRef();var r=this.removeAllAggregation("positions",h);if(h){this.contentChanged(r,"CTRL_REMOVE_ALL");}return r;};A.prototype.destroyPositions=function(){c(this.getPositions());var h=!!this.getDomRef();this.destroyAggregation("positions",h);if(h){this.contentChanged(null,"CTRL_REMOVE_ALL");}return this;};A.prototype.getContent=function(){var d=[];var p=this.getPositions();for(var i=0;i<p.length;i++){d.push(p[i].getControl());}return d;};A.prototype.addContent=function(o,p){var d=P.createPosition(o,p);this.addPosition(d);return this;};A.prototype.insertContent=function(o,i,p){var d=P.createPosition(o,p);this.insertPosition(d,i);return this;};A.prototype.removeContent=function(v){var i=v;if(typeof(v)=="string"){v=sap.ui.getCore().byId(v);}if(typeof(v)=="object"){i=this.indexOfContent(v);}if(i>=0&&i<this.getContent().length){this.removePosition(i);return v;}return null;};A.prototype.removeAllContent=function(){var d=this.getContent();this.removeAllPositions();return d;};A.prototype.indexOfContent=function(o){var d=this.getContent();for(var i=0;i<d.length;i++){if(o===d[i]){return i;}}return-1;};A.prototype.destroyContent=function(){this.destroyPositions();return this;};A.prototype.setPositionOfChild=function(o,p){var i=this.indexOfContent(o);if(i>=0){var d=this.getPositions()[i];d.updatePosition(p);return true;}return false;};A.prototype.getPositionOfChild=function(o){var i=this.indexOfContent(o);if(i>=0){var p=this.getPositions()[i];return p.getComputedPosition();}return{};};A.prototype.exit=function(){c(this.getPositions());};A.prototype.doBeforeRendering=function(){var p=this.getPositions();if(!p||p.length==0){return;}for(var i=0;i<p.length;i++){var o=p[i];o.reinitializeEventHandlers(true);a(o,true);}};A.prototype.onAfterRendering=function(){var p=this.getPositions();if(!p||p.length==0){return;}for(var i=0;i<p.length;i++){p[i].reinitializeEventHandlers();}};A.cleanUpControl=function(o){if(o&&o[S]){o.removeDelegate(o[S]);o[S]=undefined;}};A.prototype.contentChanged=function(p,d){switch(d){case"CTRL_POS":sap.zen.commons.layout.AbsoluteLayoutRenderer.updatePositionStyles(p);a(p);p.reinitializeEventHandlers();break;case"CTRL_CHANGE":a(p,true);sap.zen.commons.layout.AbsoluteLayoutRenderer.updatePositionedControl(p);p.reinitializeEventHandlers();break;case"CTRL_REMOVE":sap.zen.commons.layout.AbsoluteLayoutRenderer.removePosition(p);p.reinitializeEventHandlers(true);break;case"CTRL_REMOVE_ALL":sap.zen.commons.layout.AbsoluteLayoutRenderer.removeAllPositions(this);var e=p;if(e){for(var i=0;i<e.length;i++){e[i].reinitializeEventHandlers(true);}}break;case"CTRL_ADD":a(p,true);sap.zen.commons.layout.AbsoluteLayoutRenderer.insertPosition(this,p);p.reinitializeEventHandlers();break;case"LYT_SCROLL":sap.zen.commons.layout.AbsoluteLayoutRenderer.updateLayoutScolling(this);break;case"LYT_SIZE":sap.zen.commons.layout.AbsoluteLayoutRenderer.updateLayoutSize(this);break;}};var S="__absolutelayout__delegator";var c=function(p){for(var i=0;i<p.length;i++){var o=p[i];var d=o.getControl();if(d){A.cleanUpControl(d);}}};var a=function(p,r){var o=p.getControl();if(o){A.cleanUpControl(o);if(!r){b(o);}var d=(function(e){return{onAfterRendering:function(){b(e);}};}(o));o[S]=d;o.addDelegate(d,true);}};var b=function(o){var d=false;if(o.getParent()&&o.getParent().getComputedPosition){var p=o.getParent().getComputedPosition();if(p.top&&p.bottom||p.height){q(o.getDomRef()).css("height","100%");d=true;}if(p.left&&p.right||p.width){q(o.getDomRef()).css("width","100%");d=true;}if(d){sap.zen.commons.layout.AbsoluteLayoutRenderer.updatePositionStyles(o.getParent());}}return d;};var s=function(t,p,v,d){var h=!!t.getDomRef();t.setProperty(p,v,h);if(h){t.contentChanged(null,d);}return t;};}());return A;},true);
