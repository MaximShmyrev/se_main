/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../OrthographicCamera"],function(O){"use strict";var S=O.extend("sap.ui.vk.svg.OrthographicCamera",{metadata:{}});var b=O.getMetadata().getParent().getClass().prototype;S.prototype.init=function(){if(b.init){b.init.call(this);}this.zoom=1;this.offsetX=0;this.offsetY=0;this.zoomedObject=null;};S.prototype.update=function(w,h,o,a){var c=this.zoom;this.zoom*=Math.min(w,h)/Math.min(o,a);this.offsetX=(this.offsetX-o*0.5)*(this.zoom/c)+w*0.5;this.offsetY=(this.offsetY-a*0.5)*(this.zoom/c)+h*0.5;};S.prototype.reset=function(c,w,h){if(c&&c.viewBox){this._setViewBox(c.viewBox,w,h);}};S.prototype._setViewBox=function(v,w,h){this.zoom=w/v[2];this.offsetX=-v[0]*this.zoom;this.offsetY=-v[1]*this.zoom;this.update(w,h,w,w*v[3]/v[2]);};S.prototype._zoomTo=function(a,w,h,m){var z=Math.min(w/(a.max.x-a.min.x),h/(a.max.y-a.min.y))/(1+(m||0));this.zoom=z;this.offsetX=(w-(a.min.x+a.max.x)*z)*0.5;this.offsetY=(h-(a.min.y+a.max.y)*z)*0.5;};S.prototype._screenToWorld=function(x,y){return{x:(x-this.offsetX)/this.zoom,y:(y-this.offsetY)/this.zoom};};S.prototype._worldToScreen=function(x,y){return{x:x*this.zoom+this.offsetX,y:y*this.zoom+this.offsetY};};S.prototype._transformRect=function(r){var p=this._screenToWorld(r.x1,r.y1);var a=this._screenToWorld(r.x2,r.y2);return{x1:Math.min(p.x,a.x),y1:Math.min(p.y,a.y),x2:Math.max(p.x,a.x),y2:Math.max(p.y,a.y)};};return S;});
