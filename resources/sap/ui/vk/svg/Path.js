/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/Log","./Element"],function(L,E){"use strict";var P=function(a){a=a||{};E.call(this,a);this.type="Path";this.segments=a.segments||[];if(a.isTriangleMesh){this.isTriangleMesh=true;}this.setMaterial(a.material);};P.prototype=Object.assign(Object.create(E.prototype),{constructor:P});P.prototype.tagName=function(){return"path";};P.prototype.isFillable=function(){return this.isTriangleMesh;};function p(a,d,r,h,i){var x=a+r*Math.cos(i);var y=d+h*Math.sin(i);return{x:x,y:y};}P.prototype._expandBoundingBox=function(d,m){var s=this.strokeWidth*0.5;for(var h=0,j=this.segments.length;h<j;h++){var k=this.segments[h];var o=k.points;switch(k.type){case"arc":if(o){this._expandBoundingBoxCE(d,m,o[0],o[1],s,s);}else{for(var a=0,n=6;a<n;a++){var q=p(k.cx,k.cy,k.rx,k.ry,k.start+(k.end-k.start)*a/(n-1));this._expandBoundingBoxCE(d,m,q.x,q.y,s,s);}if(k.closed){this._expandBoundingBoxCE(d,m,k.cx,k.cy,s,s);}}break;case"line":case"move":this._expandBoundingBoxCE(d,m,o[0],o[1],s,s);break;case"bezier":case"polyline":case"mesh":for(var i=0,l=o.length-1;i<l;i+=2){this._expandBoundingBoxCE(d,m,o[i],o[i+1],s,s);}break;default:break;}}};function b(d,s){var i,l;var a=s.points;switch(s.degree||2){case 2:for(i=0,l=a.length-3;i<l;i+=4){d.push("Q",a[i],a[i+1],a[i+2],a[i+3]);}break;case 3:for(i=0,l=a.length-5;i<l;i+=6){d.push("C",a[i],a[i+1],a[i+2],a[i+3],a[i+4],a[i+5]);}break;default:L.warning("Unsupported bezier segment degree:",s.type);break;}}function c(d,s){var a=s.points;d.push("M",a[0],a[1]);var h=s.dimension||2;for(var i=h,l=a.length-1;i<l;i+=h){d.push("L",a[i],a[i+1]);}if(s.closed){d.push("Z");}}function e(d,s){var a=s.points;var h=s.dimension||2;for(var i=0,l=a.length-1;i<l;i+=h){d.push("L",a[i],a[i+1]);}}function f(d,s){var a=s.points;for(var i=0,l=a.length-5;i<l;i+=6){d.push("M",a[i],a[i+1],"L",a[i+2],a[i+3],"L",a[i+4],a[i+5],"Z");}}function g(d,s){var a=s.points;if(a){d.push("A",s.major,s.minor,"0",s.followLargeArc?"1":"0",s.clockwise?"1":"0",a[0],a[1]);}else{var h=p(s.cx,s.cy,s.rx,s.ry,s.start);var i=p(s.cx,s.cy,s.rx,s.ry,s.end);d.push("M",h.x,h.y,"A",s.rx,s.ry,"0",Math.abs(s.end-s.start)<Math.PI?"0":"1",s.end>s.start?"1":"0",i.x,i.y);if(s.closed){d.push("L",s.cx,s.cy,"Z");}}}P.prototype._setSpecificAttributes=function(s){var d=[];this.segments.forEach(function(a){switch(a.type){case"arc":g(d,a);break;case"line":e(d,a);break;case"close":d.push("Z");break;case"bezier":b(d,a);break;case"move":case"polyline":c(d,a);break;case"mesh":f(d,a);break;default:L.warning("Unsupported path segment type:",a.type,JSON.stringify(a));break;}});if(d.length>0){s("d",d.join(" "));}if(!this.isTriangleMesh){s("stroke-linejoin","round");}};return P;});
