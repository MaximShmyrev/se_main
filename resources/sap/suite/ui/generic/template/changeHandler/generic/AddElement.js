/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
*/
sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2","sap/suite/ui/generic/template/genericUtilities/testableHelper","sap/base/util/deepExtend"],function(U,A,t,d){"use strict";var a={};var e={SmartField:sap.ui.comp.smartfield.SmartField,GroupElement:sap.ui.comp.smartform.GroupElement,Group:sap.ui.comp.smartform.Group};var c=function(C){var E;if(C.hasOwnProperty("mSettings")){E=new e[C.type](C.sId,C.mSettings);}else{E=new e[C.type](C.sId);}if(C.hasOwnProperty("fnTemplatingInfo")){C.fnTemplatingInfo(E);}return E;};var f=function(C,r){var E;if(!C.oControl.oChild){E=c(C.oControl);return E;}E=f(C.oControl.oChild);var p=c(C.oControl);var i=C.oControl.oChild.oControl.insertFunction;var T=C.oControl.oChild.oControl.iTargetIndex||0;p[i](E,T);if(r){i=C.oControl.insertFunction;T=C.oControl.iTargetIndex||0;r[i](p,T);return r;}return p;};a.applyChange=function(C,o,p,b){var D=C.getDefinition();if(!D.transferred&&b){var r=C.getContent().customChanges[0].oParentSelector;var R=p.modifier.bySelector(r);f(b,R);}};a.completeChangeContent=function(C,s,p){var o=s.parentId||s.selector.id;var O=p.modifier.bySelector(o,p.appComponent);var P=p.modifier.getSelector(o,p.appComponent);var m=U.getMetaModel(s,p);var r=s.custom.fnGetRelevantElement?s.custom.fnGetRelevantElement(O):O;var E="";var b={};var g=[];var h=[];var i="";var T=U.getTemplatingInfo(r);if(T&&T.target&&T.annotation){E=T.target;b=m.getODataEntityType(E);i=T.annotation;g=b[i];}else{E=U.getEntityType(r);b=m.getODataEntityType(E);i=s.custom.annotation;g=b[i];}h=JSON.parse(JSON.stringify(g));if(s.custom.fnPerformSpecificAddAction){s.custom.fnPerformSpecificAddAction(O,g);}else if(s.custom.fnGetAnnotationIndex){var j=s.custom.fnGetAnnotationIndex(O,g);g.splice(j,0,s.custom.oAnnotationTermToBeAdded);}else{g.splice(s.index,0,s.custom.oAnnotationTermToBeAdded);}if(s.custom.AddConcreteElement){s.custom.AddConcreteElement.completeChangeContent(C,s,p);}if(!s.custom.fnPerformSpecificAddAction){var k=A.createCustomAnnotationTermChange(E,g,h,i);k.parentId=O.getId();k.oParentSelector=P;var l=A.createCustomChanges(k);d(C.getContent(),l);}};f=t.testableStatic(f,"fnAddElement");c=t.testableStatic(c,"fnCreateElement");return a;},true);
