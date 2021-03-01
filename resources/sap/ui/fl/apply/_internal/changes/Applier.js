/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/core/Element","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/fl/apply/_internal/changes/FlexCustomData","sap/ui/fl/apply/_internal/changes/Utils","sap/ui/fl/apply/_internal/flexState/changes/DependencyHandler","sap/ui/fl/Utils"],function(L,E,J,F,U,D,a){"use strict";var l=new a.FakePromise();function _(C,p){var s=C.getSelector&&C.getSelector();if(!s||(!s.id&&!s.name)){throw Error("No selector in change found or no selector ID.");}var o=p.modifier.bySelector(s,p.appComponent,p.view);if(!o){throw Error("A flexibility change tries to change a nonexistent control.");}var h=C.getDependentControlSelectorList();h.forEach(function(i){var j=p.modifier.bySelector(i,p.appComponent,p.view);if(!j){throw Error("A dependent selector control of the flexibility change is not available.");}});return o;}function b(C,o,m,h,p){var x=f(p);var i=U.getControlIfTemplateAffected(o,C,p);var I=F.hasChangeApplyFinishedCustomData(i.control,o,p.modifier);var j=o.isApplyProcessFinished();if(j&&!I){if(!x){var k=U.checkIfDependencyIsStillValid.bind(null,p.appComponent,p.modifier,m);m=h._oChangePersistence.copyDependenciesFromInitialChangesMap(o,k,p.appComponent);}o.setInitialApplyState();}else if(!j&&I){o.markFinished();}return m;}function c(C,p){var s;if(f(p)&&C.getDefinition().jsOnly){s="Change cannot be applied in XML. Retrying in JS.";}if(s){C.setInitialApplyState();throw Error(s);}}function d(C,m,i,p){if(i instanceof E){m.control=i;}if(m.control){p.modifier.updateAggregation(m.originalControl,C.getContent().boundAggregation);}F.addAppliedCustomData(m.control,C,p,f(p));var r={success:true};C.markFinished(r);return r;}function e(o,C,m,p){var x=f(p);var r={success:false,error:o};var s=C.getId();var h="Change ''{0}'' could not be applied.";var i=o instanceof Error;var j=F.getCustomDataIdentifier(false,i,x);switch(j){case F.notApplicableChangesCustomDataKey:a.formatAndLogMessage("info",[h,o.message],[s]);break;case F.failedChangesCustomDataKeyXml:a.formatAndLogMessage("warning",[h,"Merge error detected while processing the XML tree."],[s],o.stack);break;case F.failedChangesCustomDataKeyJs:a.formatAndLogMessage("error",[h,"Merge error detected while processing the JS control tree."],[s],o.stack);break;}F.addFailedCustomData(m.control,C,p,j);if(x){C.setInitialApplyState();}else{C.markFinished(r);}return r;}function f(p){return p.modifier.targets==="xmlTree";}function g(o,C){var h=C.getDefinition();var s=h.changeType;var t=h.selector.id;var i=h.namespace+h.fileName+"."+h.fileType;var w="A flexibility change could not be applied.";w+="\nThe displayed UI might not be displayed as intedend.";if(o.message){w+="\n   occurred error message: '"+o.message+"'";}w+="\n   type of change: '"+s+"'";w+="\n   LRep location of the change: "+i;w+="\n   id of targeted control: '"+t+"'.";L.warning(w,undefined,"sap.ui.fl.apply._internal.changes.Applier");}var A={addPreConditionForInitialChangeApplying:function(p){l=l.then(function(){return p;});},applyChangeOnControl:function(C,o,p){var m=U.getControlIfTemplateAffected(C,o,p);return U.getChangeHandler(C,m,p).then(function(h){c(C,p);return h;}).then(function(h){if(C.hasApplyProcessStarted()){return C.addPromiseForApplyProcessing().then(function(r){C.markFinished();return r;});}else if(!C.isApplyProcessFinished()){return new a.FakePromise().then(function(){C.startApplying();return h.applyChange(C,m.control,p);}).then(function(i){return d(C,m,i,p);}).catch(function(i){return e(i,C,m,p);});}var r={success:true};C.markFinished(r);return r;}).catch(function(h){return{success:false,error:h};});},applyAllChangesForControl:function(G,o,h,C){var m=G();var s=C.getId();var i=m.mChanges[s]||[];i.forEach(function(j){if(!j.isApplyProcessFinished()&&!j._ignoreOnce){j.setQueuedForApply();}});l=l.then(function(C){var p=[];var s=C.getId();var i=m.mChanges[s]||[];var P={modifier:J,appComponent:o,view:a.getViewForControl(C)};var j;if(m.mControlsWithDependencies[s]){D.removeControlsDependencies(m,s);j=true;}i.forEach(function(k){m=b(C,k,m,h,P);if(k._ignoreOnce){delete k._ignoreOnce;}else if(k.isApplyProcessFinished()){D.resolveDependenciesForChange(m,k.getId(),s);}else if(!m.mDependencies[k.getId()]){p.push(function(){return A.applyChangeOnControl(k,C,P).then(function(){D.resolveDependenciesForChange(m,k.getId(),s);});});}else{var n=A.applyChangeOnControl.bind(A,k,C,P);D.addChangeApplyCallbackToDependency(m,k.getId(),n);}});if(i.length||j){return a.execPromiseQueueSequentially(p).then(function(){return D.processDependentQueue(m,o,s);});}}.bind(null,C));return l;},applyAllChangesForXMLView:function(p,C){if(!Array.isArray(C)){var s="No list of changes was passed for processing the flexibility on view: "+p.view+".";L.error(s,undefined,"sap.ui.fl.apply._internal.changes.Applier");C=[];}return C.reduce(function(P,o){return P.then(function(){var h=_(o,p);o.setQueuedForApply();b(h,o,undefined,undefined,p);if(!o.isApplyProcessFinished()){return A.applyChangeOnControl(o,h,p);}return{success:true};}).then(function(r){if(!r.success){throw Error(r.error);}}).catch(function(h){g(h,o);});},new a.FakePromise()).then(function(){return p.view;});}};return A;},true);
