/*
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./BaseController","./DraftContext","sap/base/Log","sap/ui/model/Context","sap/ui/generic/app/util/ActionUtil"],function(q,B,D,L,C,A){"use strict";var a=B.extend("sap.ui.generic.app.transaction.DraftController",{metadata:{publicMethods:["getDraftContext","getDraftForActiveEntity","createNewDraftEntity","createEditDraftEntity","validateDraftEntity","validateDraft","prepareDraft","prepareDraftEntity","saveAndPrepareDraftEntity","activateDraftEntity","isActiveEntity","hasActiveEntity","destroy","fetchHeader","discardDraft"]},constructor:function(m,Q){B.apply(this,[m,Q]);this.sName="sap.ui.generic.app.transaction.DraftController";this._oContext=null;}});a.prototype.getDraftContext=function(){if(!this._oContext){this._oContext=new D(this._oModel);}return this._oContext;};a.prototype.createDraft=function(e,p,P){var t=this;if(!e){throw new Error("No entity set");}P=P||{};return new Promise(function(r,b){var s=function(d,R){r({responseData:d,httpResponse:R});};var c;var E=function(o){t._oModel.deleteCreatedEntry(c);b(o);};c=t._oModel.createEntry(p,{properties:P.predefinedValues,success:s,error:E,batchGroupId:P.batchGroupId,changeSetId:P.changeSetId,canonicalRequest:!!P.canonicalRequest,expand:P.expand});});};a.prototype.validateDraft=function(c,p){if(!c.getModel().getObject(c.getPath()).IsActiveEntity){var i=this.getDraftContext().getODataDraftFunctionImportName(c,"ValidationFunction");return this._callAction(i,c,p);}else{return Promise.resolve();}};a.prototype.prepareDraft=function(c,p){if(!c.getModel().getObject(c.getPath()).IsActiveEntity){var i;p=p||{};p.urlParameters=p.urlParameters||{};i=this.getDraftContext().getODataDraftFunctionImportName(c,"PreparationAction");return this._callAction(i,c,p);}else{return Promise.resolve();}};a.prototype.activateDraft=function(c,p,o){var b=this.prepareDraft(c,p);var i=this.getDraftContext().getODataDraftFunctionImportName(c,"ActivationAction");var d=this._callAction(i,c,o);return Promise.all([b,d]);};a.prototype.editDraft=function(c,p){var i=this.getDraftContext().getODataDraftFunctionImportName(c,"EditAction");if(i){return this._callAction(i,c,p);}throw new Error(c?"No Edit action defined for the given context":"No context provided for the Edit action");};a.prototype.discardDraft=function(c,p){if(!c){throw new Error("No context");}var P={};q.extend(true,P,p);var f=this.getDraftContext().getODataDraftFunctionImportName(c,"DiscardAction");if(f){return this._callAction(f,c,P);}return this._remove(c.getPath(),P);};a.prototype.getDraftForActive=function(c,p){var t=this;if(!c){throw new Error("No context");}p=p||{};p.urlParameters={"$expand":"SiblingEntity"};return this._read(c.getPath(),p).then(function(r){if(r.responseData&&r.responseData.hasOwnProperty("SiblingEntity")){r.context=t._oModel.getContext("/"+t._oModel.getKey(r.responseData.SiblingEntity));return r;}throw new Error("No draft entity could be found");});};a.prototype.getDraftForActiveEntity=function(c){var p,P,t=this,m={batchGroupId:"Changes",changeSetId:"Changes",noShowSuccessToast:true,forceSubmit:true};p=this.getDraftForActive(c,m).then(function(r){return r;},function(r){throw t._normalizeError(r);});P=this.triggerSubmitChanges(m);return this._returnPromiseAll([p,P]);};a.prototype.createNewDraftEntity=function(e,p,P,c,o){var t=this;o=o||{};o.fnSetBusy=o.fnSetBusy||Function.prototype;var i="Changes";var m={predefinedValues:P,batchGroupId:i,changeSetId:i,canonicalRequest:c,expand:o.sRootExpand};var b=new C(t._oModel,p);var f=t.getDraftContext().getODataDraftFunctionImportName(b,"NewAction");var F=f&&t._oMeta.getODataFunctionImport(f);var d;if(o.bUseNewActionForCreate&&F){var s=f.split('/')[1];var S={ResultIsActiveEntity:true};var I=t.getDraftContext().isDraftEnabled(e);var g=new A({controller:o.oController,contexts:[b],applicationController:o.oApplicationController,operationGrouping:undefined});d=g.call(f,s,I,S).then(function(r){o.fnSetBusy(r.executionPromise);return r.executionPromise;});}else{d=this.createDraft(e,p,m);o.fnSetBusy(d);}var h=d.then(function(r){return t._normalizeResponse(Array.isArray(r)?r[0]:r,true);},function(r){var R=r?t._normalizeError(r):null;throw R;});function j(r){var n,H,R,u=t._normalizeResponse(r,true);if(u.context){R=u.context.getObject();}if(!R){L.error("Activate function returned no entity");return Promise.reject(new Error("Activate function returned no entity"));}n=t._oDraftUtil.isActiveEntity(R);if(n){L.error("New draft entity is not marked as draft - isActiveEntity = "+n);return Promise.reject("New draft entity is not marked as draft - isActiveEntity = "+n);}H=t._oDraftUtil.hasDraftEntity(R);if(H){L.error("Wrong value for HasTwin of new draft entity - HasDraftEntity = "+H);return Promise.reject(new Error("Wrong value for HasTwin of new draft entity - HasDraftEntity = "+H));}return u;}var k;if(o.bUseNewActionForCreate&&F){k=h.then(j);}else{var l={batchGroupId:i,changeSetId:i,noShowSuccessToast:true,forceSubmit:true,failedMsg:"New draft document could not be created"};k=this.triggerSubmitChanges(l).then(function(){return h.then(j);});}return this._returnPromiseAll([h,k]);};a.prototype.createEditDraftEntity=function(c,p,r){var P,o,t=this,m={batchGroupId:"Changes",changeSetId:"Changes",successMsg:"Draft for document was created",failedMsg:"Could not create draft for document",forceSubmit:true,context:c,expand:r};if(p){m.urlParameters={PreserveChanges:true};}P=this.editDraft(c,m).then(function(R){var i,b,d;d=t._normalizeResponse(R,true);if(d.context){b=d.context.getObject();}if(!b){L.error("Activate function returned no entity");return Promise.reject(new Error("Activate function returned no entity"));}i=t._oDraftUtil.isActiveEntity(b);if(i){L.error("Edit function returned an entity which is not a draft instance - IsActiveEntity = "+i);return Promise.reject(new Error("Returned entity ist not a draft instance - IsActiveEntity = "+i));}return d;},function(R){var b=t._normalizeError(R);throw b;});o=this.triggerSubmitChanges(m);return this._returnPromiseAll([P,o]);};a.prototype.validateDraftEntity=function(c){var p,P,t=this,m={batchGroupId:"Changes",changeSetId:"Changes",context:c,forceSubmit:true};p=this.validateDraft(c,m).then(function(r){return t._normalizeResponse(r,true);},function(r){var R=t._normalizeError(r);throw R;});P=this.triggerSubmitChanges(m);return this._returnPromiseAll([p,P]);};a.prototype.saveAndPrepareDraftEntity=function(c,p){var P,o,t=this;p=p||{};p.batchGroupId="Changes";p.changeSetId="Changes";p.successMsg="Saved";p.failedMsg="Save failed";p.context=c;p.forceSubmit=true;P=this.prepareDraft(c,p).then(function(r){var i,R,b;b=t._normalizeResponse(r,true);if(b.context){R=b.context.getObject();}if(!R){L.error("Activate function returned no entity");return Promise.reject(new Error("Activate function returned no entity"));}i=t._oDraftUtil.isActiveEntity(R);if(i){L.error("Prepare function returned an entity which is not a draft instance - IsActiveEntity = "+i);return Promise.reject(new Error("Returned entity ist not a draft instance - IsActiveEntity = "+i));}return b;},function(r){var R=t._normalizeError(r);throw R;});if(p.binding){p.binding.refresh(true,"Changes");}o=this.triggerSubmitChanges(p);return this._returnPromiseAll([P,o]);};a.prototype.prepareDraftEntity=function(c){var t=this;return this.prepareDraft(c).then(function(r){var R,o;R=t._normalizeResponse(r,true);o=R.context.getObject();if(t._oDraftUtil.isActiveEntity(o)){L.error("Prepare function returned an entity which is not a draft instance - IsActiveEntity = "+true);return Promise.reject(new Error("Returned entity ist not a draft instance - IsActiveEntity = "+true));}return R;},function(r){var R=t._normalizeError(r);throw R;});};a.prototype.activateDraftEntity=function(c,i){var p,P,t=this,o={batchGroupId:"Changes",successMsg:"Document activated",failedMsg:"Activation of document failed",forceSubmit:true,context:c};var b=q.extend({},o);o.changeSetId="Changes";b.changeSetId="Activation";var h=i?"lenient":"strict";b.headers={Prefer:"handling="+h};p=this.activateDraft(c,o,b).then(function(r){var I,R,d;var e=r[1];d=t._normalizeResponse(e,true);if(d.context){R=d.context.getObject();}if(!R){L.error("Activate function returned no entity");return Promise.reject(new Error("Activate function returned no entity"));}I=t._oDraftUtil.isActiveEntity(R);if(!I){L.error("Activate function returned an entity which is still a draft instance - IsActiveEntity = "+I);return Promise.reject(new Error("Returned entity is still a draft instance - IsActiveEntity = "+I));}return d;},function(r){var R=t._normalizeError(r);throw R;});P=this.triggerSubmitChanges(o);return this._returnPromiseAll([p,P]);};a.prototype.fetchHeader=function(c,p){p=p||{};p.batchGroupId="Changes";p.successMsg="Header section is fetched successfully";p.failedMsg="Fetching header data failed";p.context=c;p.forceSubmit=true;return this._read(c.getPath(),p);};a.prototype.isActiveEntity=function(c){if(this.getDraftContext().hasDraft(c)){return this._oDraftUtil.isActiveEntity(c.getObject());}return true;};a.prototype.hasActiveEntity=function(c){return this._oDraftUtil.hasActiveEntity(c.getObject());};a.prototype.destroy=function(){if(this._oContext){this._oContext.destroy();}this._oContext=null;this._oModel=null;B.prototype.destroy.apply(this,[]);};return a;},true);
