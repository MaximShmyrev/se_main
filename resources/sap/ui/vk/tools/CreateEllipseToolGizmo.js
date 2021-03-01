/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./Gizmo","../svg/Ellipse"],function(G,E){"use strict";var C=G.extend("sap.ui.vk.tools.CreateEllipseToolGizmo",{metadata:{library:"sap.ui.vk"}});C.prototype.init=function(){if(G.prototype.init){G.prototype.init.apply(this);}this._activeElement=null;};C.prototype.hasDomElement=function(){return false;};C.prototype.show=function(v,t){this._viewport=v;this._tool=t;var r=v._scene.getRootElement();while(r.userData.skipIt&&r.children.length>0){r=r.children[0];}this._root=r;};C.prototype.hide=function(){this._viewport=null;this._tool=null;this._root=null;};C.prototype._startAdding=function(p){this._startPos=p;this._activeElement=new E({matrix:[1,0,0,1,p.x,p.y],material:this._tool._material,lineStyle:this._tool._lineStyle,fillStyle:this._tool._fillStyle});this._root.add(this._activeElement);this._root.rerender();};C.prototype._update=function(p){var a=this._startPos;var b=this._activeElement;if(b){var r=Math.abs(a.x-p.x);var c=Math.abs(a.y-p.y);if(this._tool.getUniformMode()){r=c=Math.max(r,c);}b.rx=r;b.ry=c;b.invalidate();}};C.prototype._stopAdding=function(p){var n=this._activeElement;this._tool.fireCompleted({node:n,parametric:{type:"ellipse",major:n.rx,minor:n.ry}});this._activeElement=null;this._tool.setActive(false);};return C;});
