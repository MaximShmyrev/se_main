/*
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/comp/odata/SideEffects"],function(S){"use strict";var a=function(p){this._oParent=p;this._oSideEffects=new S();};a.prototype.getFieldGroupIDs=function(m,v){var M,c,t,s;if(m.property&&m.property.complex){c=m.property.parents[0];t=this._toTypePath(m.path,c);}M={entitySet:m.entitySet,entityType:m.entityType,complexType:c};s=this._oSideEffects.getSideEffects(m.path,t,M);return this._calcFieldGroups(s,m,v);};a.prototype._calcFieldGroups=function(s,m,v){var c,b,i,l,g=[],C;b=this._getSideEffects(s,m,v);l=b.length;C=this._oParent.getBindingContext();c=C.getPath();for(i=0;i<l;i++){this._calcFieldGroups2(b[i],g,v,c,C);}return g.length>0?g:null;};a.prototype._calcFieldGroups2=function(s,g,v,c,C){var u,i,I,t=this;s.sideEffects.forEach(function(o){I={name:o.name,originType:o.originType,originName:s.origin.name,originNamespace:s.origin.namespace,context:c};i=JSON.stringify(I);i=i.substring(1,i.length-2);u=v.data(i);if(!u){u=t.createUUID();I.contextObject=C;v.data(u,I);v.data(i,u);}g.push(u);});};a.prototype._getSideEffects=function(s,m){var r=[];var R={};R.sideEffects=this._getSideEffectsFromEntity("entitySet",s);if(R.sideEffects&&R.sideEffects.length){R.origin=m.entitySet;r.push(R);}R={};R.sideEffects=this._getSideEffectsFromEntity("entityType",s);if(R.sideEffects&&R.sideEffects.length){R.origin=m.entityType;r.push(R);}R={};R.sideEffects=this._getSideEffectsFromEntity("complexType",s);if(R.sideEffects&&R.sideEffects.length){R.origin=m.property.parents[0];r.push(R);}return r;};a.prototype._getSideEffectsFromEntity=function(N,s){var n,b=[];if(s[N]){for(n in s[N]){b.push({name:n,originType:N,sideEffect:s[N][n]});}}return b;};a.prototype._toTypePath=function(p,c){var P=p.split("/");return p.replace(P[0],c.name);};a.prototype.createUUID=function(){var d=new Date().getTime();var u="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/[x]/g,function(c){var r=(d+Math.random()*16)%16|0;d=Math.floor(d/16);return(c==="x"?r:(r&0x7|0x8)).toString(16);});return u;};a.prototype.destroy=function(){if(this._oSideEffects){this._oSideEffects.destroy();}this._oSideEffects=null;};return a;},true);
