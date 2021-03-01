/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/base/DataType","sap/base/util/merge","sap/base/util/isPlainObject","sap/base/Log"],function(B,D,m,a,L){"use strict";var A={name:{type:"string",mandatory:true,allowedForComplexProperty:true},label:{type:"string",mandatory:true,allowedForComplexProperty:true},path:{type:"string",defaultValue:"attribute:name"},key:{type:"boolean"},visible:{type:"boolean",defaultValue:true,allowedForComplexProperty:true},filterable:{type:"boolean",defaultValue:true},sortable:{type:"boolean",defaultValue:true},groupable:{type:"boolean"},propertyInfos:{type:"PropertyReference[]",allowedForComplexProperty:true},unit:{type:"PropertyReference"},groupLabel:{type:"string",allowedForComplexProperty:true},exportSettings:{type:"object",allowedForComplexProperty:true},typeConfig:{type:"object"},maxConditions:{type:"int",defaultValue:-1},fieldHelp:{type:"string"}};var M=Object.keys(A).filter(function(i){return A[i].mandatory;});var p=[];var _=new WeakMap();function s(O){return JSON.stringify(O,function(K,V){return V===undefined?null:V;})||"";}function r(i,u){var w=s(u);L.warning("Invalid property definition: "+i+(w?"\n"+w:""));}function t(i,u){var w=s(u);throw new Error("Invalid property definition: "+i+(w?"\n"+w:""));}function c(i){return i.map(function(u){return m({},u);});}function b(i,u){var w=u.map(function(x){var F={};p.forEach(function(y){Object.defineProperty(F,y,{value:function(){return i[y].call(i,x.name);}});});return F;});return Object.freeze(w);}function f(i,F){F.forEach(function(u){i.onCreatePropertyFacade(u);Object.freeze(u);});}function d(O){var K=Object.getOwnPropertyNames(O);for(var i=0;i<K.length;i++){var V=O[K[i]];var u=Array.isArray(V);if(a(V)||u){if(K[i].startsWith("_")){if(u){Object.freeze(V);}}else{d(V);}}}return Object.freeze(O);}function e(O,i){if(!i){return O;}return i.split(".").reduce(function(C,S){return C&&C[S]?C[S]:null;},O);}function g(i){var T;if(typeof i.type==="object"){T="object";}else{T=i.type.replace("PropertyReference","string");}return D.getType(T);}function h(i,u,w){u.forEach(function(x){var y=j(i,x,w);y.forEach(function(z){var C=e(x,z.targetPath);if(C){C[z.targetAttribute]=e(x,z.source);if(z.isPropertyReference){k(C,z.targetAttribute,w);}}});d(x);});}function j(i,u,w,x,y,z){var T=x==null;var C=[];var I=i.isPropertyComplex(u);if(T){z=_.get(i).mAttributeMetadata;y=u;}if(!y){return[];}for(var E in z){var F=z[E];var G=T?E:x+"."+E;var V=y[E];if(I&&!F.allowedForComplexProperty){continue;}if(V!=null&&typeof F.type==="string"&&F.type.startsWith("PropertyReference")||G==="propertyInfos"){if(I||G!=="propertyInfos"){k(y,E,w);}continue;}if(V==null){l(y,F,x,E,C);}if(typeof F.type==="object"){C=C.concat(j(i,u,w,G,y[E],F.type));}}return C;}function k(i,u,w){var x=i[u];var y;if(Array.isArray(x)){y=x.map(function(N){return w[N];});}else{y=w[x];}Object.defineProperty(i,"_"+u,{value:y});}function l(i,u,S,w,x){if("defaultValue"in u){if(typeof u.defaultValue==="string"&&u.defaultValue.startsWith("attribute:")){x.push({source:u.defaultValue.substring(u.defaultValue.indexOf(":")+1),targetPath:S,targetAttribute:w,isPropertyReference:typeof u.type==="string"&&u.type.startsWith("PropertyReference")});}else if(typeof u.defaultValue==="object"&&u.defaultValue!==null){i[w]=m({},u.defaultValue);}else{i[w]=u.defaultValue;}}else{var y=g(u);if(y.isArrayType()){i[w]=y.getBaseType().getDefaultValue();}else{i[w]=y.getDefaultValue();}}}function n(i,F){var u={};i.forEach(function(w,I){u[w.name]=F?F[I]:w;});return Object.freeze(u);}function o(i,u,F){var w=i.getProperty(u);if(!w){return[];}if(w.isComplex()){return w.getReferencedProperties().filter(function(w){return F.call(i,w.getName());});}else if(F.call(i,w.getName())){return[w];}return[];}var P=B.extend("sap.ui.mdc.util.PropertyHelper",{constructor:function(i,u,w){B.call(this);var x=B.isA(u,["sap.ui.base.ManagedObject"]);var y={};if(u&&!x){throw new Error("The type of the parent is invalid");}_.set(this,y);if(w){y.mAttributeMetadata=Object.assign({extension:{type:w,mandatory:true,allowedForComplexProperty:true}},A);y.aMandatoryAttributes=M.concat("extension");y.aMandatoryExtensionAttributes=Object.keys(w).filter(function(G){return w[G].mandatory;});}else{y.mAttributeMetadata=A;y.aMandatoryAttributes=M;y.aMandatoryExtensionAttributes=[];}this.validateProperties(i);var C=c(i);var z=b(this,C);var E=n(C);var F=n(C,z);y.oParent=u||null;y.aProperties=C;y.mProperties=E;y.aPropertyFacades=z;y.mPropertyFacades=F;h(this,C,F);f(this,z);}});P.prototype.validateProperties=function(u){if(!Array.isArray(u)){t("Property infos must be an array.");}var U=new Set();for(var i=0;i<u.length;i++){this.validateProperty(u[i],u);U.add(u[i].name);}if(U.size!==u.length){t("Properties do not have unique names.");}};P.prototype.validateProperty=function(i,u){if(!a(i)){t("Property info must be a plain object.",i);}v(this,i,u);if(this.isPropertyComplex(i)){if(i.propertyInfos.length===0){t("Complex property does not reference existing properties.",i);}}_.get(this).aMandatoryAttributes.forEach(function(w){if(!(w in i)){r("Property does not contain mandatory attribute '"+w+"'.",i);}else if(i[w]==null){t("Property does not contain mandatory attribute '"+w+"'.",i);}});_.get(this).aMandatoryExtensionAttributes.forEach(function(w){if(!(w in i.extension)){r("Property does not contain mandatory attribute 'extension."+w+"'.",i);}else if(i.extension[w]==null){t("Property does not contain mandatory attribute 'extension."+w+"'.",i);}});};function v(i,u,w,x,y,z){var T=x==null;if(T){z=_.get(i).mAttributeMetadata;y=u;}for(var C in y){var E=z[C];var F=T?C:x+"."+C;var V=y[C];if(!E){r("Property contains invalid attribute '"+F+"'.",u);}else if(i.isPropertyComplex(u)&&!E.allowedForComplexProperty){r("Complex property contains invalid attribute '"+F+"'.",u);}else if(typeof E.type==="object"&&V&&typeof V==="object"){v(i,u,w,F,V,E.type);}else if(V!=null&&!g(E).isValid(V)){t("The value of '"+F+"' is invalid.",u);}else if(V&&typeof E.type==="string"&&E.type.startsWith("PropertyReference")){q(i,u,w,F,V,E);}}}function q(u,w,x,y,z,C){var E=C.type.endsWith("[]")?z:[z];var U=new Set(E);if(E.indexOf(w.name)>-1){t("Property references itself in the '"+y+"' attribute",w);}if(U.size!==E.length){t("Property contains duplicate names in the '"+y+"' attribute.",w);}for(var i=0;i<x.length;i++){if(U.has(x[i].name)){if(u.isPropertyComplex(x[i])){t("Property references complex properties in the '"+y+"' attribute.",w);}U.delete(x[i].name);}}if(U.size>0){t("Property references non-existing properties in the '"+y+"' attribute.",w);}}P.prototype.getParent=function(){var i=_.get(this);return i?i.oParent:null;};P.prototype.getProperties=function(){var i=_.get(this);return i?i.aPropertyFacades:[];};P.prototype.getPropertyMap=function(){var i=_.get(this);return i?i.mPropertyFacades:{};};P.prototype.getProperty=function(N){return this.getPropertyMap()[N]||null;};P.prototype.getRawPropertyInfos=function(){var i=_.get(this);return i&&i.aProperties;};P.prototype.getRawProperty=function(N){var i=_.get(this);return i&&i.mProperties[N]?i.mProperties[N]:null;};P.prototype.hasProperty=function(N){return N in this.getPropertyMap();};P.prototype.isComplex=function(N){var R=this.getRawProperty(N);return R?this.isPropertyComplex(R):null;};p.push("isComplex");P.prototype.isPropertyComplex=function(i){return i!=null&&typeof i==="object"?"propertyInfos"in i:false;};P.prototype.getReferencedProperties=function(N){var R=this.getRawProperty(N);return(R&&R._propertyInfos)||[];};p.push("getReferencedProperties");P.prototype.getUnitProperty=function(N){var R=this.getRawProperty(N);return(R&&R._unit)||null;};p.push("getUnitProperty");P.prototype.isSortable=function(N){var i=this.getProperty(N);if(i){return i.isComplex()?false:this.getRawProperty(N).sortable;}return null;};p.push("isSortable");P.prototype.getSortableProperties=function(N){return o(this,N,this.isSortable);};p.push("getSortableProperties");P.prototype.getAllSortableProperties=function(){return this.getProperties().filter(function(i){return i.isSortable();});};P.prototype.isFilterable=function(N){var i=this.getProperty(N);if(i){return i.isComplex()?false:this.getRawProperty(N).filterable;}return null;};p.push("isFilterable");P.prototype.getFilterableProperties=function(N){return o(this,N,this.isFilterable);};p.push("getFilterableProperties");P.prototype.getAllFilterableProperties=function(){return this.getProperties().filter(function(i){return i.isFilterable();});};P.prototype.isGroupable=function(N){var i=this.getProperty(N);if(i){return i.isComplex()?false:this.getRawProperty(N).groupable;}return null;};p.push("isGroupable");P.prototype.getGroupableProperties=function(N){return o(this,N,this.isGroupable);};p.push("getGroupableProperties");P.prototype.getAllGroupableProperties=function(){return this.getProperties().filter(function(i){return i.isGroupable();});};P.prototype.getLabel=function(N){var R=this.getRawProperty(N);return R?R.label:null;};p.push("getLabel");P.prototype.getGroupLabel=function(N){var R=this.getRawProperty(N);return R?R.groupLabel:null;};p.push("getGroupLabel");P.prototype.getPath=function(N){var i=this.getProperty(N);if(i){return i.isComplex()?null:this.getRawProperty(N).path;}return null;};p.push("getPath");P.prototype.isKey=function(N){var i=this.getProperty(N);if(i){return i.isComplex()?false:this.getRawProperty(N).key;}return null;};p.push("isKey");P.prototype.getAllKeyProperties=function(){return this.getProperties().filter(function(i){return i.isKey();});};P.prototype.isVisible=function(N){var R=this.getRawProperty(N);return R?R.visible:null;};p.push("isVisible");P.prototype.getVisibleProperties=function(N){return o(this,N,this.isVisible);};p.push("getVisibleProperties");P.prototype.getAllVisibleProperties=function(){return this.getProperties().filter(function(i){return i.isVisible();});};P.prototype.getExportSettings=function(N){var R=this.getRawProperty(N);return R&&R.exportSettings?R.exportSettings:null;};p.push("getExportSettings");P.prototype.getName=function(N){var R=this.getRawProperty(N);return R?R.name:null;};p.push("getName");P.prototype.getMaxConditions=function(N){var i=this.getProperty(N);if(i){return i.isComplex()?null:this.getRawProperty(N).maxConditions;}return null;};p.push("getMaxConditions");P.prototype.getTypeConfig=function(N){var i=this.getProperty(N);if(i){return i.isComplex()?null:this.getRawProperty(N).typeConfig;}return null;};p.push("getTypeConfig");P.prototype.getFieldHelp=function(N){var i=this.getProperty(N);if(i){return i.isComplex()?null:this.getRawProperty(N).fieldHelp;}return null;};p.push("getFieldHelp");P.prototype.onCreatePropertyFacade=function(F){};P.prototype.destroy=function(){B.prototype.destroy.apply(this,arguments);_.delete(this);};return P;});