sap.ui.define(["sap/fe/core/converters/ManifestSettings","sap/fe/core/converters/MetaModelConverter","sap/fe/core/templating/DataModelPathHelper"],function(M,a,D){"use strict";var _={};var g=D.getTargetObjectPath;var c=a.convertTypes;var b=M.createManifestWrapper;var d=function(A){return typeof A==="object";};var e=function(i){var j={startingEntitySet:i,targetEntityType:i.entityType,targetEntitySet:i,navigationProperties:[],contextLocation:undefined,targetObject:i};j.contextLocation=j;return j;};function f(C,m,t,s,j,k,l){var o=b(m,k);var B=g(l);var n=function(i){var O=C.entityTypes.find(function(P){if(i.startsWith(P.fullyQualifiedName)){var Q=i.replace(P.fullyQualifiedName,"");return Q.startsWith("/")||Q.startsWith("@");}return false;});return O;};var p=function(i){if(i){var O=i.fullyQualifiedName;var P=n(O);if(!P){throw new Error("Cannot find Entity Type for "+i.fullyQualifiedName);}return P;}else{return l.targetEntityType;}};var q=function(i){if(d(i)){return o.getControlConfiguration(F(i.fullyQualifiedName,l.targetEntityType));}return o.getControlConfiguration(i);};var r=function(i){if(!i){return i;}if(i[0]==="/"){return i;}return B+"/"+i;};var u=function(){return l.targetEntitySet;};var v=function(){return l;};var w=function(i){if(i===undefined){return l.targetEntitySet;}return C.entitySets.find(function(O){return O.name===i;});};var x=function(i){return C.entitySets.find(function(O){return O.entityType===i;});};var y=function(){return l.targetEntityType;};var z=function(i){if(i){var O;var P=n(i);return P===null||P===void 0?void 0:(O=P.entityProperties)===null||O===void 0?void 0:O.find(function(Q){return Q.name===i.split("/").pop();});}return undefined;};var A=function(O){if(O.indexOf("@")===-1){O="@"+O;}var P=l.targetEntityType.resolvePath(O,true);var Q=l.targetEntitySet;var R=l.targetEntityType;var S=l.navigationProperties.concat();var i=1;var T;var U=[];while(i<P.visitedObjects.length){T=P.visitedObjects[i++];if(T._type==="NavigationProperty"){U.push(T.name);S.push(T);R=T.targetType;if(Q&&Q.navigationPropertyBinding.hasOwnProperty(U.join("/"))){Q=Q.navigationPropertyBinding[T.name];U=[];}}if(T._type==="EntitySet"){Q=T;R=Q.entityType;}}var V={startingEntitySet:l.startingEntitySet,targetEntitySet:Q,targetEntityType:R,targetObject:S[S.length-1],navigationProperties:S,contextLocation:l.contextLocation};return{annotation:P.target,converterContext:f(C,m,t,s,j,k,V)};};var E=function(){return t;};var F=function(i,O){return i.replace(O.fullyQualifiedName,"");};var G=function(i){if(!i){return i;}var O=l.targetEntityType.fullyQualifiedName;if(l.targetEntitySet){var P=i.replace(O,"/");if(P.length>2&&P[0]==="/"&&P[1]==="/"){P=P.substr(1);}return B+P;}else{return"/"+i;}};var H=function(){return o;};var I=function(){return s;};var J=function(){return j;};var K=function(i){var O=e(i);return f(C,m,t,s,j,k,O);};var L=function(i,O){var P=arguments.length>2&&arguments[2]!==undefined?arguments[2]:y();var Q=(P===null||P===void 0?void 0:P.annotations[i])||{};var R=[];if(Q){R=Object.keys(Q).filter(function(S){return Q[S].term===O;}).reduce(function(S,T){S.push(Q[T]);return S;},[]);}return R;};var N=function(){return C.entityContainer;};return{getAnnotationEntityType:p,getManifestControlConfiguration:q,getAbsoluteAnnotationPath:r,getEntitySet:u,getDataModelObjectPath:v,findEntitySet:w,getEntitySetForEntityType:x,getEntityType:y,getEntityTypeAnnotation:A,getTemplateType:E,getRelativeAnnotationPath:F,getEntitySetBasedAnnotationPath:G,getManifestWrapper:H,getShellServices:I,getDiagnostics:J,getConverterContextFor:K,getEntityPropertyFromFullyQualifiedName:z,getAnnotationByType:L,getEntityContainer:N};}_.createConverterContext=f;function h(E,m,t,s,i,j,k){var l=arguments.length>7&&arguments[7]!==undefined?arguments[7]:{};var o=m.isA("sap.ui.model.odata.v4.ODataMetaModel")?m:m.getModel();var C=c(o);var n=C.entitySets.find(function(p){return p.name===E;});if(!k){k={startingEntitySet:n,navigationProperties:[],targetEntitySet:n,targetEntityType:n.entityType,targetObject:n};}return f(C,l,t,s,i,j,k);}_.createConverterContextForMacro=h;return _;},false);