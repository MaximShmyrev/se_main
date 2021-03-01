/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/Object","./Utilities","./thirdparty/three"],function(q,B,U,T){"use strict";var t="sap.ui.vbm.PolygonHandler";var l=q.sap.log;var V=T.Vector3;var M=T.Matrix4;var p=U.propertyAdded;var a=U.propertyRemoved;var b=U.propertyChanged;var u=U.updateProperty;var g=U.getColor;var r=U.rgbaToString;var e=U.equalsRGBA;var c=U.createMaterial;var d=U.createLineMaterial;var P=B.extend("sap.ui.vbm.adapter3d.PolygonHandler",{constructor:function(i){B.call(this);this._root=i;this._hotInstance=null;this._instances=new Map();this._meshes=new Map();this._borders=new Map();}});var f=2000;var h=2000;P.prototype.destroy=function(){this._root=null;this._instances.clear();this._meshes.forEach(function(k,i){i.forEach(function(m){this._deleteObject3D(m.object3D);},this);},this);this._borders.forEach(function(k,i){i.forEach(function(j){this._deleteObject3D(j.object3D);},this);},this);this._meshes.clear();this._borders.clear();B.prototype.destroy.call(this);};P.prototype.update=function(){var i=this._updateMeshes()||false;i=this._updateBorders()||i;if(this._hotInstance&&i){this._updateHot(this._hotInstance,true);}};P.prototype.addInstance=function(i){this._instances.set(i,{instance:i,indices:[],vertices:[],normal:null,lines:null,matrix:new M(),color:null,colorHot:null,colorBorder:null,colorBorderHot:null,mesh:null,border:null});this.updateInstance(i);};P.prototype.updateInstance=function(i){var j=this._instances.get(i),k=false,m=false;if(j){if(b(i,["pos","rot","scale"])){U.getInstanceMatrix(i,j.matrix);k=m=true;}if(b(i,"OuterNormal")){j.normal=U.toVector3(i.OuterNormal||"0;0;1").normalize();k=true;}if(b(i,"posarray")){this._getGeometry(i,j.indices,j.vertices);k=m=true;}if(b(i,["color","selectColor","VB:s"])){var n=g(i,i.color,false);if(!j.color||!e(n,j.color)){this._removeInstanceFromMesh(j);j.color=n;j.colorHot=g(i,i.color,true);k=true;}}if(a(i,"colorBorder")){this._removeInstanceFromBorder(j);j.lines=j.colorBorder=j.colorBorderHot=null;}else if(i.colorBorder){if(p(i,"colorBorder")||b(i,"posarray")){j.lines=this._getBorderGeometry(j.indices,j.vertices);m=true;}if(b(i,["colorBorder","selectColor,","VB:s"])){var o=g(i,i.colorBorder,false);if(!j.colorBorder||!e(o,j.colorBorder)){this._removeInstanceFromBorder(j);j.colorBorder=o;j.colorBorderHot=g(i,i.colorBorder,true);m=true;}}}if(b(i,"hotDeltaColor")){j.colorHot=g(i,i.color,true);if(j.colorBorder){j.colorBorderHot=g(i,i.colorBorder,true);}}u(i,["pos","rot","scale","OuterNormal","posarray","color","colorBorder","selectColor","hotDeltaColor","VB:s"]);if(k){this._requestMeshUpdate(j);}if(i.colorBorder){if(m){this._requestBorderUpdate(j);}}}else{l.error("Unable to find polygon instance data","",t);}};P.prototype.removeInstance=function(i){var j=this._instances.get(i);if(j){if(this._hotInstance===i){this._hotInstance=null;}this._instances.delete(i);this._removeInstanceFromMesh(j);this._removeInstanceFromBorder(j);i._last={};}else{l.error("Unable to find polygon instance data","",t);}};P.prototype.updateHotInstance=function(i){if(this._hotInstance){this._updateHot(this._hotInstance,false);}if(i&&i.isPolygon){this._updateHot(i,true);}this._hotInstance=(i&&i.isPolygon)?i:null;};P.prototype._updateHot=function(i,j){var k=this._instances.get(i),m,o,n,s;if(k){if(k.mesh){m=k.mesh.material;o=k.mesh.object3D;n=o.geometry;if(n.groups.length){n.groups=[];o.material=o.material[0];}if(j){s=k.mesh.instances.get(k);m.color.copy(k.colorHot.rgb);m.opacity=k.colorHot.opacity;m.transparent=m.opacity<1;m.needsUpdate=true;o.material=[o.material,m];n.addGroup(s.start,k.indices.length,1);if(s.start!==0){n.addGroup(0,s.start,0);}if(s.start+k.indices.length<n.index.count){n.addGroup(s.start+k.indices.length,n.index.count-s.start-k.indices.length,0);}}}if(k.border){m=k.border.material;o=k.border.object3D;n=o.geometry;var v=n.getAttribute("position");if(n.groups.length){n.groups=[];o.material=o.material[0];}if(j){s=k.border.instances.get(k);m.color.copy(k.colorBorderHot.rgb);m.opacity=k.colorBorderHot.opacity;m.transparent=m.opacity<1;m.needsUpdate=true;o.material=[o.material,m];var w=k.lines.length/3;n.addGroup(s.start,w,1);if(s.start!==0){n.addGroup(0,s.start,0);}if(s.start+w<v.count){n.addGroup(s.start+w,v.count-s.start-w,0);}}}}else{l.error("Unable to find polygon instance data","",t);}};P.prototype._getGeometry=function(j,k,v){var i,m=[],n=j.posarray.split(";");v.length=k.length=0;for(i=0;i<n.length/3;++i){var x=parseFloat(n[i*3+0]);var y=parseFloat(n[i*3+1]);var z=parseFloat(n[i*3+2]);m.push(new T.Vector2(x,y));v.push(x,y,z);}var o=T.ShapeUtils.triangulateShape(m,[]);for(i=0;i<o.length;++i){k.push(o[i][0],o[i][1],o[i][2]);}};P.prototype._getBorderGeometry=function(i,v){var j=new T.BufferGeometry();j.setIndex(i);j.setAttribute("position",new T.Float32BufferAttribute(v,3));var k=new T.EdgesGeometry(j);var m=k.getAttribute("position").array;k.dispose();j.dispose();return m;};P.prototype._updateMeshes=function(){var k=[],m=false,n=this._hotInstance?this._instances.get(this._hotInstance):null;this._meshes.forEach(function(o,s){for(var i=0;i<o.length;){if(o[i].dirty){var j,v,w,x=[],y=[],z=[],A=o[i];this._deleteObject3D(A.object3D);A.object3D=null;A.hitInfo.length=0;A.instances.forEach(function(E,F){v=F;E.start=x.length;for(j=0,w=y.length/3;j<v.indices.length;++j){x.push(w+v.indices[j]);}var G=v.indices.length/3;A.hitInfo.length+=G;A.hitInfo.fill(v.instance,A.hitInfo.length-G,A.hitInfo.length);if(v.matrix._identity){for(j=0;j<v.vertices.length/3;++j){y.push(v.vertices[j*3],v.vertices[j*3+1],v.vertices[j*3+2]);z.push(v.normal.x,v.normal.y,v.normal.z);}}else{var H=new V();for(j=0;j<v.vertices.length/3;++j){H.set(v.vertices[j*3],v.vertices[j*3+1],v.vertices[j*3+2]);H.applyMatrix4(v.matrix);y.push(H.x,H.y,H.z);z.push(v.normal.x,v.normal.y,v.normal.z);}}});if(x.length){var C=new T.BufferGeometry();C.setIndex(x);C.setAttribute("position",new T.Float32BufferAttribute(y,3));C.setAttribute("normal",new T.Float32BufferAttribute(z,3));C.computeBoundingBox();C.computeBoundingSphere();var D=c(true);D.color.copy(v.color.rgb);D.opacity=v.color.opacity;D.transparent=D.opacity<1;D.needsUpdate=true;A.object3D=new T.Mesh(C,D);A.object3D.matrixAutoUpdate=false;A.object3D.layers.set(0);this._root.add(A.object3D);A.object3D._instanceHitTest=this._instanceHitTest.bind(A);A.triangleCount=x.length/3;}if(n&&A.instances.has(n)){m=true;}A.dirty=false;}if(o[i].object3D){i++;}else{o.splice(i,1);}}if(!o.length){k.push(s);}},this);k.forEach(function(i){this._meshes.delete(i);},this);return m;};P.prototype._updateBorders=function(){var k=[],m=false,n=this._hotInstance?this._instances.get(this._hotInstance):null;this._borders.forEach(function(o,s){for(var i=0;i<o.length;){if(o[i].dirty){var j,v,w=[],x=o[i];this._deleteObject3D(x.object3D);x.object3D=null;x.instances.forEach(function(A,C){v=C;A.start=w.length/3;if(v.matrix._identity){for(j=0;j<v.lines.length;++j){w.push(v.lines[j]);}}else{var D=new V();for(j=0;j<v.lines.length/3;++j){D.set(v.lines[j*3],v.lines[j*3+1],v.lines[j*3+2]);D.applyMatrix4(v.matrix);w.push(D.x,D.y,D.z);}}});if(w.length){var y=new T.BufferGeometry();y.setAttribute("position",new T.Float32BufferAttribute(w,3));y.computeBoundingBox();var z=d();z.color.copy(v.colorBorder.rgb);z.opacity=v.colorBorder.opacity;z.transparent=z.opacity<1;z.needsUpdate=true;x.object3D=new T.LineSegments(y,z);x.object3D.matrixAutoUpdate=false;x.object3D.layers.set(1);this._root.add(x.object3D);x.lineCount=w.length/6;}if(n&&x.instances.has(n)){m=true;}x.dirty=false;}if(o[i].object3D){i++;}else{o.splice(i,1);}}if(!o.length){k.push(s);}},this);k.forEach(function(i){this._borders.delete(i);},this);return m;};P.prototype._requestMeshUpdate=function(j){if(j.mesh){j.mesh.dirty=true;}else{var k=r(j.color);var m=this._meshes.get(k);if(!m){m=[];this._meshes.set(k,m);}for(var i=0;i<m.length;++i){if(m[i].triangleCount+j.indices.length/3<=f){j.mesh=m[i];break;}}if(!j.mesh){j.mesh={dirty:true,object3D:null,material:c(true),triangleCount:0,hitInfo:[],instances:new Map()};m.push(j.mesh);}j.mesh.instances.set(j,{start:0});j.mesh.dirty=true;j.mesh.triangleCount+=j.indices.length/3;}};P.prototype._requestBorderUpdate=function(j){if(j.border){j.border.dirty=true;}else{var k=r(j.colorBorder);var m=this._borders.get(k);if(!m){m=[];this._borders.set(k,m);}for(var i=0;i<m.length;++i){if(m[i].lineCount+j.lines.length/6<=h){j.border=m[i];break;}}if(!j.border){j.border={dirty:true,object3D:null,material:d(),lineCount:0,instances:new Map()};m.push(j.border);}j.border.instances.set(j,{start:0});j.border.dirty=true;j.border.lineCount+=j.lines.length/6;}};P.prototype._removeInstanceFromMesh=function(i){if(i.mesh){if(i.mesh.instances.delete(i)){i.mesh.triangleCount-=i.indices.length/3;i.mesh.dirty=true;i.mesh=null;}else{l.error("Unable to find instance data in polygon mesh data","",t);}}};P.prototype._removeInstanceFromBorder=function(i){if(i.border){if(i.border.instances.delete(i)){i.border.lineCount-=i.lines.length/6;i.border.dirty=true;i.border=null;}else{l.error("Unable to find instance data in polygon border data","",t);}}};P.prototype._deleteObject3D=function(o){if(o){if(o.parent){o.parent.remove(o);}if(o.geometry){o.geometry.dispose();}U.toArray(o.material).forEach(function(m){m.dispose();});}};P.prototype._instanceHitTest=function(i){return i.faceIndex>=0?this.hitInfo[i.faceIndex]:null;};return P;});
