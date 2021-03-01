sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2","sap/base/util/deepExtend"],function(U,A,d){"use strict";var F="com.sap.vocabularies.UI.v1.FieldGroup";var r={};var R={};var h=function(c,s,p){var a="";var m={};var e={};var o={};var b={};var f="";var D=[];var i=-1;var C={};var g={};var t={};m=U.getMetaModel(s,p);a=s.removedElement.id;r=p.modifier.bySelector(a,p.appComponent);t=U.getTemplatingInfo(r);if(t){e=m.getODataEntityType(t.target);f=t.annotation;}o=e[f];b=JSON.parse(JSON.stringify(o));D=(f.indexOf(F)>=0)?o.Data:o;i=s.custom.fnGetAnnotationIndex(r);D.splice(i,1);C=A.createCustomAnnotationTermChange(t.target,o,b,f);g=A.createCustomChanges(C);d(c.getContent(),g);};R.applyChange=function(c,C,p){r.destroy();};R.revertChange=function(c,C,p){};R.completeChangeContent=function(c,s,p){s.custom={};s.custom.fnGetAnnotationIndex=U.getIndexFromInstanceMetadataPath;h(c,s,p);};return R;},true);