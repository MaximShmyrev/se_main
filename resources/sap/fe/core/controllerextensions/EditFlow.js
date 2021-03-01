/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/ControllerExtension","sap/ui/core/mvc/OverrideExecution","sap/fe/core/actions/messageHandling","sap/fe/core/actions/sticky","sap/fe/core/TransactionHelper","sap/base/Log","sap/m/Text","sap/m/Button","sap/m/Dialog","sap/fe/core/CommonUtils","sap/fe/core/BusyLocker","sap/base/util/merge","sap/fe/core/helpers/SideEffectsUtil","sap/fe/core/library","sap/ui/model/odata/v4/ODataListBinding","sap/fe/core/helpers/SemanticKeyHelper","sap/fe/core/helpers/EditState"],function(C,O,m,s,T,L,a,B,D,b,c,d,S,F,f,g,E){"use strict";var h=F.CreationMode,P=F.ProgrammingModel,j=F.Constants,k=F.DraftStatus,l=F.EditMode;var n=C.extend("sap.fe.core.controllerextensions.EditFlow",{metadata:{methods:{editDocument:{"public":true,"final":true},updateDocument:{"public":true,"final":true},createDocument:{"public":true,"final":true},saveDocument:{"public":true,"final":true},cancelDocument:{"public":true,"final":true},deleteDocument:{"public":true,"final":true},applyDocument:{"public":true,"final":true},invokeAction:{"public":true,"final":true},securedExecution:{"public":true,"final":true},setCreateMode:{"public":false,"final":false,overrideExecution:O.After},setEditMode:{"public":false,"final":true},setDraftStatus:{"public":false,"final":true},getGlobalUIModel:{"public":false,"final":true},getInternalModel:{"public":false,"final":true},getProgrammingModel:{"public":false,"final":true},getTransactionHelper:{"public":false,"final":true},getRoutingListener:{"public":false,"final":true}}},setEditMode:function(e,i){var G=this.getGlobalUIModel();if(e){G.setProperty("/editMode",e);G.setProperty("/isEditable",e==="Editable");}if(i!==undefined){this.setCreationMode(i);}},setCreationMode:function(e){},setDraftStatus:function(e){this.base.getView().getModel("ui").setProperty("/draftStatus",e);},getRoutingListener:function(){if(this.base._routing){return this.base._routing;}else{throw new Error("Edit Flow works only with a given routing listener");}},getGlobalUIModel:function(){return this.base.getView().getModel("ui");},getInternalModel:function(){return this.base.getView().getModel("internal");},syncTask:function(t){var N;if(t instanceof Promise){N=function(){return t;};}else if(typeof t==="function"){N=t;}this._pTasks=this._pTasks||Promise.resolve();if(!!N){this._pTasks=this._pTasks.then(N).catch(function(){return Promise.resolve();});}return this._pTasks;},securedExecution:function(e,p){var i=p&&p.busy&&p.busy.set!==undefined?p.busy.set:true,o=p&&p.busy&&p.busy.check!==undefined?p.busy.check:true,u=(p&&p.updatesDocument)||false,q=this.getGlobalUIModel(),r=this.base.getView().getBindingContext(),I=r&&this.getProgrammingModel(r)===P.Draft,t=this;if(o&&c.isLocked(q)){return Promise.reject("Application already busy therefore execution rejected");}if(i){c.lock(q);}if(u&&I){this.setDraftStatus(k.Saving);}return this.syncTask(e).then(function(){if(u){t.getTransactionHelper().handleDocumentModifications();E.setEditStateDirty();if(I){t.setDraftStatus(k.Saved);}}}).catch(function(v){if(u&&I){t.setDraftStatus(k.Clear);}return Promise.reject(v);}).finally(function(){if(i){c.unlock(q);}return m.showUnboundMessages();});},getProgrammingModel:function(o){return this.getTransactionHelper().getProgrammingModel(o);},createDocument:function(v,p){var t=this,e=this.getTransactionHelper(),o=this.getGlobalUIModel(),i,q,r=t.getView().getController().oResourceBundle,u=!p||(p.creationMode!==h.Inline&&p.creationMode!==h.CreationRow&&p.creationMode!==h.External);if(p.creationMode===h.External){return this.syncTask().then(function(){var x=t.getView().getController();x.handlers.onChevronPressNavigateOutBound(x,p.outbound,undefined);});}if(p.creationMode===h.CreationRow&&p.creationRow){i=p.creationRow.getParent();if(i.getCreationRow().data("disableAddRowButtonForEmptyData")==="true"){var I=i.getBindingContext("internal");I.setProperty("creationRowFieldValidity",{});}}if(p.creationMode===h.Inline&&p.tableId){i=this.getView().byId(p.tableId);}function w(x,y){y.then(function(N){var z=t.getView().getBindingContext();if(!b.hasTransientContext(x)){S.requestSideEffects(x.getPath(),z);}}).catch(function(z){L.error("Error while creating the document",z);});}u&&c.lock(o);return this.syncTask().then(function(){var x,y,M;p=p||{};if(v&&typeof v==="object"){y=v;}else if(typeof v==="string"){y=new f(t.getView().getModel(),v);p.creationMode=h.Sync;delete p.createAtEnd;}else{throw new Error("Binding object or path expected");}M=y.getModel();q=y.iMaxLength||0;var z=p.creationMode;return Promise.resolve(t.getProgrammingModel(y)).then(function(A){x=A;if(z&&z!==h.NewPage){return z;}else{var G=M.getMetaModel();if(!y.isRelative()){var H=y.getPath(),N=x===P.Draft?G.getObject(H+"@com.sap.vocabularies.Common.v1.DraftRoot/NewAction"):G.getObject(H+"@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction");if(N){var J=G.getObject("/"+N+"/@$ui5.overload/0/$Parameter")||[];if(J.length>1){return h.Deferred;}}}var K=G.getMetaPath(y.getHeaderContext().getPath());var Q=b.getNonComputedVisibleFields(G,K);if(Q.length>0){return h.Deferred;}return h.Async;}}).then(function(z){var A,G,H=p.creationRow,J,V=Promise.resolve(),K,N,Q=M.getMetaModel(),R=t.getRoutingListener();if(z!==h.Deferred){if(z===h.CreationRow){J=H.getBindingContext();N=Q.getMetaPath(J.getPath());K=J.getObject();p.data={};Object.keys(K).forEach(function(W){var X=Q.getObject(N+"/"+W);if(X&&X.$kind==="NavigationProperty"){return;}p.data[W]=K[W];});V=t._checkForValidationErrors(J);}if(z===h.CreationRow||z===h.Inline){p.keepTransientContextOnFailed=true;p.busyMode="Local";if(z===h.Inline){p.keepTransientContextOnFailed=false;}t._handleCreateEvents(y);}A=V.then(function(){if(!p.parentControl){p.parentControl=t.getView();}return e.createDocument(y,p,r);});}var U;switch(z){case h.Deferred:U=R.navigateForwardToContext(y,{bDeferredContext:true,editable:true});break;case h.Async:U=R.navigateForwardToContext(y,{asyncContext:A,editable:true});break;case h.Sync:G={editable:true};if(x==P.Sticky){G.transient=true;}U=A.then(function(W){if(!W){var r=sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");return R.navigateToMessagePage(r.getText("C_COMMON_SAPFE_DATA_RECEIVED_ERROR"),{title:r.getText("C_COMMON_SAPFE_ERROR"),description:r.getText("C_EDITFLOW_SAPFE_CREATION_FAILED_DESCRIPTION")});}else{return R.navigateForwardToContext(W,G);}});break;case h.Inline:U=w(y,A);t.syncTask(A);break;case h.CreationRow:U=V.then(function(){var W=J.getBinding(),X;if(!p.bSkipSideEffects){w(y,A);}X=W.create();H.setBindingContext(X);X.created().catch(function(){L.trace("transient fast creation context deleted");});return J.delete("$direct");}).catch(function(W){L.error("CreationRow navigation error: ",W);});break;default:U=Promise.reject("Unhandled creationMode "+z);break;}if(x===P.Sticky){t.getInternalModel().setProperty("/sessionOn",true);}if(A){return Promise.all([A,U]).then(function(W){t.setEditMode(l.Editable,true);var X=W[0];if(X){E.setEditStateDirty();if(x===P.Sticky){t._handleStickyOn(X);}}}).catch(function(W){if(W&&W.navigateBackFromTransientState){R.navigateBackFromTransientState();}return Promise.reject(W);});}});}).finally(function(){if(i&&i.isA("sap.ui.mdc.Table")){switch(p.createAtEnd){case true:if(i.data("tableType")==="ResponsiveTable"&&i.getThreshold()){i.scrollToIndex(i.getThreshold());}else{i.scrollToIndex(q+1);}break;case false:i.scrollToIndex(0);break;}}u&&c.unlock(o);});},createMultipleDocuments:function(o,e,i){var t=this,p=this.getTransactionHelper(),q=this.getGlobalUIModel(),r=t.getView().getController().oResourceBundle;c.lock(q);return this.syncTask().then(function(){var M=o.getModel(),u=M.getMetaModel(),v;if(o.getContext()){v=u.getMetaPath(o.getContext().getPath()+"/"+o.getPath());}else{v=u.getMetaPath(o.getPath());}t._handleCreateEvents(o);var w=e.map(function(x){var y={data:{}};y.keepTransientContextOnFailed=true;y.busyMode="None";y.creationMode="CreationRow";y.parentControl=t.getView();y.createAtEnd=i;for(var z in x){var A=u.getObject(v+"/"+z);if(A&&A.$kind!=="NavigationProperty"){y.data[z]=x[z];}}return p.createDocument(o,y,r);});return Promise.all(w);}).then(function(){var u=t.getView().getBindingContext();if(!b.hasTransientContext(o)){S.requestSideEffects(o.getPath(),u);}}).catch(function(u){L.error("Error while creating multiple documents.");return Promise.reject(u);}).finally(function(){c.unlock(q);});},editDocument:function(o,p){var t=this,e=this.getTransactionHelper();return e.editDocument(o,p,t.getView()).then(function(N){var i=t.getProgrammingModel(o);if(i===P.Sticky){t.getInternalModel().setProperty("/sessionOn",true);}t.setEditMode(l.Editable,false);if(N!==o){return t._handleNewContext(N,true).then(function(){if(i===P.Sticky){t._handleStickyOn(N);}});}});},updateDocument:function(p,o){var t=this,e=t.getTransactionHelper(),i=t.getProgrammingModel(o)===P.Draft;return this.syncTask(function(){e.handleDocumentModifications();E.setEditStateDirty();m.removeBoundTransitionMessages();if(i){t.setDraftStatus(k.Saving);}return p.then(function(){if(i){t.setDraftStatus(k.Saved);}},function(){if(i){t.setDraftStatus(k.Clear);}}).finally(function(){m.showUnboundMessages(undefined,o);});});},saveDocument:function(o,e,i){var t=this,p=this.getTransactionHelper(),r=t.getView().getController().oResourceBundle;return(this.syncTask().then(this._submitOpenChanges.bind(this,o)).then(this._checkForValidationErrors.bind(this,o)).then(p.saveDocument.bind(p,o,r,e,i)).then(function(A){var q=t.getProgrammingModel(o);t._removeContextsFromPages();if(q===P.Sticky){t.getInternalModel().setProperty("/sessionOn",false);t._handleStickyOff(o);}t.setEditMode(l.Display,false);if(A!==o){t._handleNewContext(A,false);}}));},cancelDocument:function(o,p){var t=this,e=this.getTransactionHelper(),r=t.getView().getController().oResourceBundle;return this.syncTask().then(e.cancelDocument.bind(e,o,p,r)).then(function(A){var i=t.getProgrammingModel(o);t._removeContextsFromPages();if(i===P.Sticky){t.getInternalModel().setProperty("/sessionOn",false);t._handleStickyOff(o);}t.setEditMode(l.Display,false);t.setDraftStatus(k.Clear);if(!A){E.setEditStateDirty();t.getRoutingListener().navigateBackFromContext(o);}else if(i===P.Draft){return t._fetchSemanticKeyValues(A).then(function(){return t._handleNewContext(A,false,true);});}else{return t._handleNewContext(A,false);}});},deleteDocument:function(o,p){var t=this;if(!p){p={bFindActiveContexts:false};}else{p.bFindActiveContexts=false;}return this._deleteDocumentTransaction(o,p).then(function(){E.setEditStateDirty();t.getRoutingListener().navigateBackFromContext(o);});},deleteMultipleDocuments:function(e,p){var t=this,r=this.getRoutingListener(),o=this.getGlobalUIModel();var i=t.getView().byId(p.controlId);if(!i||!i.isA("sap.ui.mdc.Table")){throw new Error("parameter controlId missing or incorrect");}var q=i.getRowBinding();p.bFindActiveContexts=true;c.lock(o);return this._deleteDocumentTransaction(e,p).then(function(){var R;i.clearSelection();var u=t.getView().getBindingContext();if(q.isRoot()){R=new Promise(function(w){q.attachEventOnce("dataReceived",function(){w();});});q.refresh();}else if(u){if(!b.hasTransientContext(q)){S.requestSideEffects(q.getPath(),u);}}E.setEditStateDirty();for(var v=0;v<e.length;v++){if(r.isCurrentStateImpactedBy(e[v])){r.navigateBackFromContext(e[v]);break;}}return R;}).finally(function(){c.unlock(o);});},_deleteDocumentTransaction:function(o,p){var t=this,r=this.getView().getController().oResourceBundle,e=this.getTransactionHelper();p=p||{};p.internalModelContext=p.id?this.getView().byId(p.id).getBindingContext("internal"):null;return this.syncTask().then(e.deleteDocument.bind(e,o,p,r)).then(function(){t.getInternalModel().setProperty("/sessionOn",false);});},applyDocument:function(o){var t=this,e=this.getGlobalUIModel();c.lock(e);return(this._submitOpenChanges(o).then(this._checkForValidationErrors.bind(this,o)).then(function(){m.showUnboundMessages();t.getRoutingListener().navigateBackFromContext(o);return true;}).finally(function(){c.unlock(e);}));},_submitOpenChanges:function(o){var M=o.getModel();return M.submitBatch("$auto").then(function(){if(M.hasPendingChanges("$auto")){return Promise.reject("submit of open changes failed");}});},_handleStickyOn:function(o){var t=this,A=b.getAppComponent(this.getView());if(!A.getRouterProxy().hasNavigationGuard()){var H=A.getRouterProxy().getHash(),i=this.getInternalModel();setTimeout(function(){A.getRouterProxy().setNavigationGuard();},0);A.getShellServices().setBackNavigation(t._onBackNavigationInSession.bind(t));this.fnDirtyStateProvider=function(N){var p=N.innerAppRoute,r=A.getRouterProxy(),q,u=i.getProperty("/sessionOn");if(i.getProperty("/IBN_OpenInNewTable")){i.setProperty("/IBN_OpenInNewTable",false);return;}if(!u){return;}if(!r.isNavigationFinalized()){q=false;H=p;}else if(H===p){q=true;}else if(r.checkHashWithGuard(p)||r.isGuardCrossAllowedByUser()){H=p;q=false;}else{q=true;}if(q){setTimeout(function(){A.getShellServices().setDirtyFlag(false);},0);}return q;};A.getShellServices().registerDirtyStateProvider(this.fnDirtyStateProvider);var e=this.getView().getModel("sap.fe.i18n");this.fnHandleSessionTimeout=function(){m.removeBoundTransitionMessages();m.removeUnboundTransitionMessages();var p=new D({title:"{sap.fe.i18n>C_EDITFLOW_OBJECT_PAGE_SESSION_EXPIRED_DIALOG_TITLE}",state:"Warning",content:new a({text:"{sap.fe.i18n>C_EDITFLOW_OBJECT_PAGE_SESSION_EXPIRED_DIALOG_MESSAGE}"}),beginButton:new B({text:"{sap.fe.i18n>C_COMMON_DIALOG_OK}",type:"Emphasized",press:function(){t._handleStickyOff();t.getRoutingListener().navigateBackFromContext(o);}}),afterClose:function(){p.destroy();}});p.addStyleClass("sapUiContentPadding");p.setModel(e,"sap.fe.i18n");t.getView().addDependent(p);p.open();};this.getView().getModel().attachSessionTimeout(this.fnHandleSessionTimeout);this._fnStickyDiscardAfterNavigation=function(){var p=A.getRouterProxy().getHash();if(!p||!A.getRouterProxy().checkHashWithGuard(p)){t._discardStickySession(o);}};A.getRoutingService().attachRouteMatched(this._fnStickyDiscardAfterNavigation);}},_handleStickyOff:function(){var A=b.getAppComponent(this.getView());if(A.getRouterProxy){A.getRouterProxy().discardNavigationGuard();}if(this.fnDirtyStateProvider){A.getShellServices().deregisterDirtyStateProvider(this.fnDirtyStateProvider);this.fnDirtyStateProvider=null;}if(this.getView().getModel()&&this.fnHandleSessionTimeout){this.getView().getModel().detachSessionTimeout(this.fnHandleSessionTimeout);}A.getRoutingService().detachRouteMatched(this._fnStickyDiscardAfterNavigation);this._fnStickyDiscardAfterNavigation=null;this.setEditMode(l.Display,false);if(A){A.getShellServices().setBackNavigation();}},_handleNewContext:function(o,e,r){E.setEditStateDirty();return this.getRoutingListener().navigateToContext(o,{checkNoHashChange:true,editable:e,bPersistOPScroll:true,bRecreateContext:r});},createActionPromise:function(A,e){var t=this,r,R;this.oActionPromise=new Promise(function(i,o){r=i;R=o;}).then(function(o){return Object.assign({controlId:e},t._getActionResponseDataAndKeys(A,o));});return{fResolver:r,fRejector:R};},getCurrentActionPromise:function(){return this.oActionPromise;},deleteCurrentActionPromise:function(){this.oActionPromise=null;},invokeAction:function(A,p){var t=this,o,e=this.getTransactionHelper(),i,q,r,u,v;var V=this.getView();var H=false;if(!p.parentControl){p.parentControl=this.getView();}if(p.prefix){o=this.getView().byId(p.prefix);if(o){p.internalModelContext=o.getBindingContext("internal");}}if(A&&A.indexOf("(")>-1){r=A.split("(");A=r[0];u=r[1].slice(0,-1);H=true;if(u.indexOf("Collection(")>-1){return Promise.reject(A+" bound to a collection "+u+" is not supported");}}if(p.bStaticAction){if(H){i=o;while(i){q=i.getBindingContext();if(q&&q.getModel().getMetaModel().getMetaContext(q.getPath()).getObject("$Type")===u){p.contexts=q;break;}else{i=i.getParent();}}if(!p.contexts){return Promise.reject("Context not found for entity type "+u);}}else{if(o.isTableBound()){p.contexts=o.getRowBinding().getHeaderContext();}else{var w=o.getRowsBindingInfo().path,x=new f(t.getView().getModel(),w);p.contexts=x.getHeaderContext();}}if(p.enableAutoScroll){v=this.createActionPromise(A,o.sId);}}if(p.isNavigable){p.bGetBoundContext=false;}else{p.bGetBoundContext=true;}return this.syncTask().then(e.callAction.bind(e,A,p)).then(function(R){return t._refreshListIfRequired(t._getActionResponseDataAndKeys(A,R),p.contexts[0]).then(function(){return R;});}).then(function(R){if(v){v.fResolver(R);}if(p.contexts){E.setEditStateDirty();}if(p.isNavigable){var y=R;if(Array.isArray(y)&&y.length===1){y=y[0];}if(y&&!Array.isArray(y)){var M=V.getModel().getMetaModel();var z=M.getMetaPath(y.getPath());var G=Array.isArray(p.contexts)?p.contexts[0]:p.contexts;var I=G&&M.getMetaPath(G.getPath());if(z!=undefined&&z===I){if(G.getPath()!==y.getPath()){t.getRoutingListener().navigateForwardToContext(y,{noHistoryEntry:false});}else{L.info("Navigation to the same context is not allowed");}}}}}).catch(function(y){if(v){v.fRejector();}if(y==j.CancelActionDialog){return Promise.reject("Dialog cancelled.");}else{return Promise.reject("Error in EditFlow.invokeAction:"+y);}});},_handleCreateEvents:function(o){var t=this,p;if(t.editFlow){t=t.editFlow;}var e=t.getTransactionHelper();t.setDraftStatus(k.Clear);o=(o.getBinding&&o.getBinding())||o;p=t.getProgrammingModel(o);o.attachEvent("createSent",function(){e.handleDocumentModifications();if(p===P.Draft){t.setDraftStatus(k.Saving);}});o.attachEvent("createCompleted",function(i){var q=i.getParameter("success");if(p===P.Draft){t.setDraftStatus(q?k.Saved:k.Clear);}m.showUnboundMessages();});},computeEditMode:function(o){var t=this;return Promise.resolve((function(){var p=t.getProgrammingModel(o);if(p===P.Draft){t.setDraftStatus(k.Clear);return o.requestObject("IsActiveEntity").then(function(i){if(i===false){t.setEditMode(l.Editable);return o.requestObject("HasActiveEntity").then(function(H){t.setEditMode(undefined,!H);});}else{t.setEditMode(l.Display,false);}}).catch(function(e){L.error("Error while determining the editMode for draft",e);throw e;});}})());},_checkForValidationErrors:function(o){return this.syncTask().then(function(){var p=o.getPath(),M=sap.ui.getCore().getMessageManager().getMessageModel().getData(),e,q;for(var i=0;i<M.length;i++){q=M[i];if(q.validation){e=sap.ui.getCore().byId(q.getControlId());if(e&&e.getBindingContext()&&e.getBindingContext().getPath().indexOf(p)===0){return Promise.reject("validation errors exist");}}}});},getTransactionHelper:function(){if(!this._oTransactionHelper){var A=b.getAppComponent(this.getView());this._oTransactionHelper=new T(A,this.getGlobalUIModel());}return this._oTransactionHelper;},_onBackNavigationInSession:function(){var t=this,v=t.getView(),A=b.getAppComponent(v),r=A.getRouterProxy();if(r.checkIfBackIsOutOfGuard()){var o=v&&v.getBindingContext();b.processDataLossConfirmation(function(){t._discardStickySession(o);history.back();},v,t.getProgrammingModel(o));return;}history.back();},_discardStickySession:function(o){s.discardDocument(o);this._handleStickyOff();},_getActionResponseDataAndKeys:function(A,r){if(Array.isArray(r)){if(r.length===1){r=r[0];}else{return null;}}if(!r){return null;}var v=this.getView(),M=v.getModel().getMetaModel().getData(),e=M&&M[A]&&M[A][0]&&M[A][0].$ReturnType?M[A][0].$ReturnType.$Type:null,K=e&&M[e]?M[e].$Key:null;return{oData:r.getObject(),keys:K};},_refreshListIfRequired:function(r,o){if(!o||!r||!r.oData){return Promise.resolve();}var i=o.getBinding();if(i&&i.isA("sap.ui.model.odata.v4.ODataListBinding")){var p=r.oData,K=r.keys,q=o.getObject(),R=true;if(Object.keys(p).length){R=K.every(function(e){return q[e]===p[e];});if(!R){return new Promise(function(t,u){if(i.isRoot()){i.attachEventOnce("dataReceived",function(){t();});i.refresh();}else{i.getContext().requestSideEffects([{$NavigationPropertyPath:i.getPath()}]).then(function(){t();},function(){L.error("Error while refreshing the table");t();}).catch(function(e){L.error("Error while refreshing the table",e);});}});}}}return Promise.resolve();},_fetchSemanticKeyValues:function(o){var M=o.getModel().getMetaModel(),e=M.getMetaContext(o.getPath()).getObject("@sapui.name"),i=g.getSemanticKeys(M,e);if(i&&i.length){var r=i.map(function(K){return o.requestObject(K.$PropertyPath);});return Promise.all(r);}else{return Promise.resolve();}},_removeContextsFromPages:function(){var p=[];var A=b.getAppComponent(this.getView());if(A._isFclEnabled()){p=p.concat(A.getRootContainer().getMidColumnPages()||[]);p=p.concat(A.getRootContainer().getEndColumnPages()||[]);}else{p=A.getRootContainer().getPages()||[];}p.forEach(function(o){if(o.isA("sap.ui.core.ComponentContainer")){o=o.getComponentInstance();}if(o.getBindingContext()){o.setBindingContext(null);}});}});return n;});