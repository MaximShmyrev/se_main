/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","../thirdparty/three","./Gizmo","./ScaleToolGizmoRenderer","./CoordinateSystem","./AxisColours","../AnimationTrackType"],function(q,t,G,S,C,A,c){"use strict";var d=G.extend("sap.ui.vk.tools.ScaleToolGizmo",{metadata:{library:"sap.ui.vk"}});d.prototype.init=function(){if(G.prototype.init){G.prototype.init.apply(this);}this._createEditingForm(null,64);this._gizmoIndex=-1;this._handleIndex=-1;this._value=new THREE.Vector3().setScalar(1);this._scaleDelta=new THREE.Vector3().setScalar(1);this._viewport=null;this._tool=null;this._nonUniformScaleEnabled=false;this._sceneGizmo=new THREE.Scene();var l=new THREE.DirectionalLight(0xFFFFFF,0.5);l.position.set(1,3,2);this._sceneGizmo.add(l);this._sceneGizmo.add(new THREE.AmbientLight(0xFFFFFF,0.5));this._gizmo=new THREE.Group();this._touchAreas=new THREE.Group();this._sceneGizmo.add(this._gizmo);this._coordinateSystem=C.World;this._nodes=[];this._matViewProj=new THREE.Matrix4();this._gizmoSize=96;var f=96,g=16/f,h=48/f;function i(a,b,n){var m=new THREE.Matrix4().makeBasis(new THREE.Vector3(a.y,a.z,a.x),a,new THREE.Vector3(a.z,a.x,a.y));var o=new THREE.BoxBufferGeometry(g,g,g);o.applyMatrix4(m);var p=new THREE.MeshLambertMaterial({color:b,transparent:true});var r=new THREE.Mesh(o,p);r.userData.color=b;if(a){r.position.copy(a);var s=1/f;var u=new THREE.CylinderBufferGeometry(s,s,1,4);m.setPosition(a.clone().multiplyScalar(-0.5));u.applyMatrix4(m);var v=new THREE.Mesh(u,p);v.renderOrder=1;r.add(v);m.setPosition(a);}var w=new THREE.BoxBufferGeometry(h,h,h);w.applyMatrix4(m);n.add(new THREE.Mesh(w,p));return r;}function j(a,b,m){var n=new THREE.BufferGeometry();var v=new Float32Array(6);v[a]=v[b+3]=0.7;n.setAttribute("position",new THREE.Float32BufferAttribute(v,3));var o=new Float32Array(6);o[a]=o[b+3]=1;n.setAttribute("color",new THREE.Float32BufferAttribute(o,3));var p=new THREE.Line(n,new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors,transparent:true,linewidth:window.devicePixelRatio}));p.userData.colors=o;var r=new THREE.Geometry();var s=new THREE.Vector3().setComponent(a,0.7);var u=new THREE.Vector3().setComponent(b,0.7);r.vertices.push(new THREE.Vector3(),s,u);r.faces.push(new THREE.Face3(0,1,2));var w=new THREE.Mesh(r,new THREE.MeshBasicMaterial({color:0xFFFF00,opacity:0.5,transparent:true,side:THREE.DoubleSide,visible:false}));w.renderOrder=1;p.add(w);m.add(w.clone());return p;}this._gizmo.add(i(new THREE.Vector3(1,0,0),A.x,this._touchAreas));this._gizmo.add(i(new THREE.Vector3(0,1,0),A.y,this._touchAreas));this._gizmo.add(i(new THREE.Vector3(0,0,1),A.z,this._touchAreas));this._gizmo.add(j(1,2,this._touchAreas));this._gizmo.add(j(2,0,this._touchAreas));this._gizmo.add(j(0,1,this._touchAreas));g-=0.1/f;var k=new THREE.MeshLambertMaterial({color:0xC0C0C0,transparent:true});this._gizmo.add(new THREE.Mesh(new THREE.BoxBufferGeometry(g,g,g),k));this._touchAreas.add(new THREE.Mesh(new THREE.BoxBufferGeometry(h,h,h),new THREE.MeshBasicMaterial()));this._axisTitles=this._createAxisTitles();this._sceneGizmo.add(this._axisTitles);this._updateGizmoPartVisibility();};d.prototype.hasDomElement=function(){return true;};d.prototype._updateGizmoPartVisibility=function(){var s=this._coordinateSystem===C.Screen;var g=this._gizmo.children,a=this._touchAreas.children;g[2].visible=a[2].visible=!s;g[3].visible=g[4].visible=a[3].visible=a[4].visible=!s&&this._nonUniformScaleEnabled;g[5].visible=a[5].visible=this._nonUniformScaleEnabled;this._axisTitles.children[2].visible=!s;};d.prototype.resetValues=function(){this._value.setScalar(1);};d.prototype.setCoordinateSystem=function(a){this._coordinateSystem=a;this._gizmoIndex=this._handleIndex=-1;this._updateGizmoPartVisibility();};d.prototype.setNonUniformScaleEnabled=function(v){this._nonUniformScaleEnabled=!!v;this._updateGizmoPartVisibility();};d.prototype.show=function(v,a){this._viewport=v;this._tool=a;this._nodes.length=0;this._sequence=null;this._updateSelection(v._viewStateManager);var n=this._getNodesProperties();this._tool.fireEvent("scaling",{x:0,y:0,z:0,nodesProperties:n},true);};d.prototype.hide=function(){this._cleanTempData();this._viewport=null;this._tool=null;this._gizmoIndex=this._handleIndex=-1;this._sequence=null;this._updateEditingForm(false);};d.prototype.getGizmoCount=function(){if(this._coordinateSystem===C.Local||this._coordinateSystem===C.Parent){return this._nodes.length;}else{return this._nodes.length>0?1:0;}};d.prototype.getTouchObject=function(i){if(this._nodes.length===0){return null;}this._updateGizmoObjectTransformation(this._touchAreas,i);return this._touchAreas;};var e=[1,2,4,6,5,3];d.prototype.highlightHandle=function(a,h){var b=(a===6)||(a>=0&&!this._nonUniformScaleEnabled);var i,o;for(i=0;i<3;i++){o=this._gizmo.children[i];var f=b||(e[a]&(1<<i));var g=f?0xFFFF00:o.userData.color;o.material.color.setHex(g);o.children[0].material.color.setHex(g);o.children[0].material.opacity=o.material.opacity=f||h?1:0.35;var j=this._axisTitles.children[i];j.material.color.setHex(g);j.material.opacity=f||h?1:0.35;}for(i=3;i<6;i++){o=this._gizmo.children[i];var k=o.geometry.attributes.color;k.copyArray(b||i===a?[1,1,0,1,1,0]:o.userData.colors);k.needsUpdate=true;o.material.opacity=h||i===a?1:0.35;o.children[0].material.visible=i===a;}o=this._gizmo.children[6];o.material.color.setHex(b?0xFFFF00:0xC0C0C0);o.material.opacity=b||h?1:0.35;};d.prototype.selectHandle=function(i,g){this._gizmoIndex=g;this._handleIndex=i;if(this._tool.getAutoResetValues()){this.resetValues();}this._viewport.setShouldRenderFrame();};d.prototype.beginGesture=function(){this._beginValue=this._value.clone();this._scaleDelta.setScalar(1);this._matOrigin=this._gizmo.matrixWorld.clone();this._nodes.forEach(function(n){n.scaleOrigin=n.node.scale.clone();n.matOrigin=n.node.matrixWorld.clone();if(n.node.parent){n.matParentInv=new THREE.Matrix4().getInverse(n.node.parent.matrixWorld);}else{n.matParentInv=new THREE.Matrix4();}});};d.prototype._prepareForCreatingScaleKey=function(s){this._sequence=s;};d.prototype._printEventInfo=function(a,x,y,z,n){q.sap.log.debug(a+" is fired:"+" x = "+x+"; y = "+y+"; z = "+z);n.forEach(function(p){q.sap.log.debug("Node: "+p.node.name);if(p.offsetToRest){q.sap.log.debug("offsetToRest: [ "+p.offsetToRest[0]+", "+p.offsetToRest[1]+", "+p.offsetToRest[2]+" ] ");}else{q.sap.log.debug("offsetToRest: null");}if(p.offsetToPrevious){q.sap.log.debug("offsetToPrevious: [ "+p.offsetToPrevious[0]+", "+p.offsetToPrevious[1]+", "+p.offsetToPrevious[2]+" ] ");}else{q.sap.log.debug("offsetToPrevious: null");}if(p.absolute){q.sap.log.debug("absolute: [ "+p.absolute[0]+", "+p.absolute[1]+", "+p.absolute[2]+" ] ");}else{q.sap.log.debug("absolute: null");}if(p.world){q.sap.log.debug("world: [ "+p.world[0]+", "+p.world[1]+", "+p.world[2]+" ] ");}else{q.sap.log.debug("world: null");}if(p.restDifference){q.sap.log.debug("restDifference: [ "+p.restDifference[0]+", "+p.restDifference[1]+", "+p.restDifference[2]+" ] ");}else{q.sap.log.debug("restDifference: null");}if(p.restDifferenceInCoordinates){q.sap.log.debug("restDifferenceInCoordinates: [ "+p.restDifferenceInCoordinates[0]+", "+p.restDifferenceInCoordinates[1]+", "+p.restDifferenceInCoordinates[2]+" ] ");}else{q.sap.log.debug("restDifferenceInCoordinates: null");}});};d.prototype._getNodesProperties=function(){var n=[];this._nodes.forEach(function(a){var b=a.node;var p={};p.node=b;var r=this._viewport._viewStateManager.getRelativeTransformation(b);p.offsetToRest=[r.scale[0],r.scale[1],r.scale[2]];p.offsetToPrevious=p.offsetToRest.slice();var f=this._getEffectiveParent(b);if(f!==b.parent){if(b.userData.skipUpdateJointNode){this._viewport._viewStateManager._setJointNodeOffsets(b,c.Scale);}if(b.userData&&b.userData.offsetScale){p.offsetToRest=b.userData.offsetScale.slice();}else{p.offsetToRest=[1,1,1];}p.offsetToPrevious=p.offsetToRest.slice();if(b.userData.skipUpdateJointNode){b.userData.skipUpdateJointNode=false;this._viewport._viewStateManager._setJointNodeMatrix();b.userData.skipUpdateJointNode=true;}}if(this._playback){var s=this._viewport._viewStateManager._getEndPropertyInPreviousPlayback(b,c.Scale,this._playback);if(s){p.offsetToPrevious[0]/=s[0];p.offsetToPrevious[1]/=s[1];p.offsetToPrevious[2]/=s[2];}}var g=this._viewport._viewStateManager.getTransformation(b);p.absolute=[g.scale[0],g.scale[1],g.scale[2]];var w=this._viewport._viewStateManager.getTransformationWorld(b);p.world=w.scale;var u;if(this._nodeUserDataMap){u=this._nodeUserDataMap.get(b);}if(!a.matParentInv){a.matParentInv=new THREE.Matrix4().getInverse(b.parent.matrixWorld);}var h=new THREE.Matrix4();if(this._gizmo){h=this._gizmo.matrixWorld.clone();}var j=new THREE.Vector3();var k,m,l;if(u&&u.initialScale){p.restDifference=[g.scale[0]/u.initialScale[0],g.scale[1]/u.initialScale[1],g.scale[2]/u.initialScale[2]];l=new THREE.Vector3(p.restDifference[0],p.restDifference[1],p.restDifference[2]);var o=new THREE.Quaternion(g.quaternion[0],g.quaternion[1],g.quaternion[2],g.quaternion[3]);var v=new THREE.Matrix4().makeRotationFromQuaternion(o);var x=new THREE.Matrix4().makeRotationFromQuaternion(u.initialQuaternion);var y=new THREE.Vector3();var z=new THREE.Vector3();var B=new THREE.Vector3();v.extractBasis(y,z,B);var D=new THREE.Vector3();var E=new THREE.Vector3();var F=new THREE.Vector3();x.extractBasis(D,E,F);if(y.dot(D)<0){p.restDifference[0]=-p.restDifference[0];}if(z.dot(E)<0){p.restDifference[1]=-p.restDifference[1];}if(B.dot(F)<0){p.restDifference[2]=-p.restDifference[2];}k=b.parent.matrixWorld.clone().scale(l).multiply(a.matParentInv);k.decompose(new THREE.Vector3(),new THREE.Quaternion(),j);if(this._coordinateSystem===C.World){p.restDifferenceInCoordinates=[j.x,j.y,j.z];}else{m=new THREE.Matrix4().getInverse(h).multiply(k).multiply(h);m.decompose(new THREE.Vector3(),new THREE.Quaternion(),j);p.restDifferenceInCoordinates=[j.x,j.y,j.z];}var H=this._alignAxesBetweenGizmoAndNodeCoordinates(b);for(var i=0;i<3;i++){if(p.restDifference[i]>0){p.restDifferenceInCoordinates[H[i]]=Math.abs(p.restDifferenceInCoordinates[H[i]]);}else{p.restDifferenceInCoordinates[H[i]]=-Math.abs(p.restDifferenceInCoordinates[H[i]]);}}}n.push(p);}.bind(this));return n;};d.prototype.endGesture=function(){var n=this._getNodesProperties();delete this._beginValue;this._nodes.forEach(function(a){var b=a.node;if(b.userData){delete b.userData.skipUpdateJointNode;}this._viewport._viewStateManager._setJointNodeOffsets(b,c.Scale);}.bind(this));this._tool.fireScaled({x:this._scaleDelta.x,y:this._scaleDelta.y,z:this._scaleDelta.z,nodesProperties:n});this._printEventInfo("Event 'scaled'",this._scaleDelta.x,this._scaleDelta.y,this._scaleDelta.z,n);};d.prototype._alignAxesBetweenGizmoAndNodeCoordinates=function(n,w){function g(v,p,r,s){var u=Math.abs(v.dot(p));var x=Math.abs(v.dot(r));var y=Math.abs(v.dot(s));if(u>=x&&u>=y){return 0;}else if(x>=u&&x>=y){return 1;}else{return 2;}}var a=n.parent.matrixWorld.clone().multiply(new THREE.Matrix4().makeRotationFromQuaternion(n.quaternion.clone()));var b=new THREE.Vector3();var f=new THREE.Vector3();var h=new THREE.Vector3();a.extractBasis(b,f,h);b.normalize();f.normalize();h.normalize();var i=new THREE.Matrix4();if(this._gizmo){i=this._gizmo.matrixWorld.clone();}var j=new THREE.Vector3();var k=new THREE.Vector3();var l=new THREE.Vector3();i.extractBasis(j,k,l);j.normalize();k.normalize();l.normalize();var m=[];var o;if(w){o=g(j,b,f,h);m.push(o);o=g(k,b,f,h);m.push(o);o=g(l,b,f,h);m.push(o);}else{o=g(b,j,k,l);m.push(o);o=g(f,j,k,l);m.push(o);o=g(h,j,k,l);m.push(o);}return m;};d.prototype._scale=function(s){function a(b,i,f,g){if(i===0){if((g&&f.x>0)||(!g&&f.x<0)){b.x=Math.abs(b.x);}else{b.x=-Math.abs(b.x);}}else if(i===1){if((g&&f.y>0)||(!g&&f.y<0)){b.y=Math.abs(b.y);}else{b.y=-Math.abs(b.y);}}else if(i===2){if((g&&f.z>0)||(!g&&f.z<0)){b.z=Math.abs(b.z);}else{b.z=-Math.abs(b.z);}}}if(!this._beginValue){this._beginValue=this._value.clone();}this._value.multiplyVectors(this._beginValue,s);this._scaleDelta.copy(s);this._nodes.forEach(function(n){var b=n.node;if(!b.userData){b.userData={};}b.userData.skipUpdateJointNode=true;});if(this._coordinateSystem===C.Local){this._nodes.forEach(function(n){n.node.scale.copy(n.scaleOrigin).multiply(s);n.node.updateMatrix();});}else{var m=this._matOrigin.clone().scale(s).multiply(new THREE.Matrix4().getInverse(this._matOrigin));this._nodes.forEach(function(n){if(!n.ignore){var b=n.node;b.matrixWorld.multiplyMatrices(m,n.matOrigin);b.matrix.multiplyMatrices(n.matParentInv,b.matrixWorld);if(this._coordinateSystem===C.Parent){var f=b.matrix.clone();f.elements[12]=0;f.elements[13]=0;f.elements[14]=0;var g=new THREE.Matrix4().makeRotationFromQuaternion(b.quaternion.clone().inverse()).multiply(b.matrix);var h=g.elements;b.scale.x=h[0];b.scale.y=h[5];b.scale.z=h[10];b.updateMatrix();}else{b.matrix.decompose(b.position,new THREE.Quaternion(),b.scale);var i=this._alignAxesBetweenGizmoAndNodeCoordinates(b,true);a(b.scale,i[0],n.scaleOrigin,s.x>0);a(b.scale,i[1],n.scaleOrigin,s.y>0);a(b.scale,i[2],n.scaleOrigin,s.z>0);b.updateMatrix();}}}.bind(this));}this._viewport.setShouldRenderFrame();};d.prototype.scale=function(x,y,z){this.beginGesture();this._scale(new THREE.Vector3(x,y,z));};d.prototype._setScale=function(s){var n=this._getNodesProperties();if(this._tool.fireEvent("scaling",{x:s.x,y:s.y,z:s.z,nodesProperties:n},true)){this._printEventInfo("Event 'scaling'",s.x,s.y,s.z,n);this._scale(s);}};d.prototype.getValue=function(){return(this._gizmoIndex>=0&&this._handleIndex>=0&&this._handleIndex<3)?this._value.getComponent(this._handleIndex):1;};d.prototype.setValue=function(v){if(this._gizmoIndex>=0&&this._handleIndex>=0&&this._handleIndex<3){var a=v/this._value.getComponent(this._handleIndex);var s=new THREE.Vector3(1,1,1);if(this._nonUniformScaleEnabled){s.setComponent(this._handleIndex,a);}else{s.setScalar(a);}this.beginGesture();this._scale(s);this.endGesture();}};d.prototype.expandBoundingBox=function(b){if(this._viewport){this._expandBoundingBox(b,this._viewport.getCamera().getCameraRef(),true);}};d.prototype.handleSelectionChanged=function(a){this._sequence=null;if(this._viewport){if(this._tool.getEnableSnapping()){this._tool.getDetector().setSource(this._viewport._viewStateManager);}this._updateSelection(this._viewport._viewStateManager);this._gizmoIndex=this._handleIndex=-1;var n=this._getNodesProperties();this._tool.fireEvent("scaling",{x:0,y:0,z:0,nodesProperties:n},true);}};d.prototype._getObjectScale=function(o){if(this._nodes.length===1){return this._nodes[0].node.scale;}else if(this._coordinateSystem===C.Local){return this._nodes[o].node.scale;}return new THREE.Vector3(1,1,1);};d.prototype._getObjectSize=function(o){var b=new THREE.Box3();if(this._nodes.length===1){this._nodes[0].node._expandBoundingBox(b,true,false);}else if(this._coordinateSystem===C.Local){this._nodes[0].node._expandBoundingBox(b,true,false);}if(b.isEmpty()){return 0;}var s=new THREE.Vector3();b.getSize(s);return s.length();};d.prototype._updateGizmoTransformation=function(g,a){var s=this._updateGizmoObjectTransformation(this._gizmo,g);this._updateAxisTitles(this._axisTitles,this._gizmo,a,this._gizmoSize+30,s);};d.prototype._getEditingFormPosition=function(){var s=this._updateGizmoObjectTransformation(this._gizmo,this._gizmoIndex);var a=new THREE.Vector3().setFromMatrixColumn(this._gizmo.matrixWorld,this._handleIndex).normalize();return a.clone().multiplyScalar((this._gizmoSize+18)*s).add(this._gizmo.position).applyMatrix4(this._matViewProj);};d.prototype.render=function(){if(this._nodes.length>0){var r=this._viewport.getRenderer(),a=this._viewport.getCamera().getCameraRef();this._matViewProj.multiplyMatrices(a.projectionMatrix,a.matrixWorldInverse);r.clearDepth();for(var i=0,l=this.getGizmoCount();i<l;i++){this._updateGizmoTransformation(i,a);r.render(this._sceneGizmo,a);}}this._updateEditingForm(this._nodes.length>0&&this._gizmoIndex>=0&&this._handleIndex>=0&&this._handleIndex<3,this._handleIndex);};return d;});
