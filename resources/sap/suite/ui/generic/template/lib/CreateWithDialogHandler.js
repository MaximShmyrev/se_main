sap.ui.define(["sap/ui/base/Object","sap/suite/ui/generic/template/js/StableIdHelper","sap/suite/ui/generic/template/lib/MessageUtils","sap/base/util/extend","sap/suite/ui/generic/template/genericUtilities/controlHelper","sap/suite/ui/generic/template/genericUtilities/testableHelper","sap/suite/ui/generic/template/lib/CRUDHelper"],function(B,S,M,e,c,t,C){"use strict";function g(s,o,T){var d,a;function G(){return{"aFilters":[{sPath:"fullTarget",sOperator:"StartsWith",oValue1:d.getBindingContext().getPath()},{sPath:"target",sOperator:"EQ",oValue1:"/"+o.getOwnerComponent().getEntitySet()}]};}function r(){var i=G(d);var m=sap.ui.getCore().getMessageManager().getMessageModel();if(i){var j=m.bindList("/",null,null,[i]);var k=j.getContexts();if(k.length){var E=[];for(var l in k){E.push(k[l].getObject());}sap.ui.getCore().getMessageManager().removeMessages(E);}}}function f(){d.close();if(T.oComponentUtils.isDraftEnabled()){T.oServices.oCRUDManager.discardDraft(d.getBindingContext());}else{r(d);o.getView().getModel().deleteCreatedEntry(d.getBindingContext());}d.setBindingContext(null);}function b(E){var m=false;var F;var i=sap.ui.getCore().getMessageManager().getMessageModel().getData();m=i.some(function(n){return n.type==="Error"&&n.validation;});if(!m&&T.oComponentUtils.isDraftEnabled()){var j=T.oComponentUtils.getCRUDActionHandler();F=G(d);j.handleCRUDScenario(1,A.bind(null,F));}else if(!m){T.oCommonEventHandlers.submitChangesForSmartMultiInput();F=G(d);var k=T.oServices.oCRUDManager.saveEntity(F);k.then(function(){d.close();if(s&&s.oSmartTable){T.oCommonUtils.refreshModel(s.oSmartTable);T.oCommonUtils.refreshSmartTable(s.oSmartTable);M.showSuccessMessageIfRequired(T.oCommonUtils.getText("OBJECT_CREATED"),T.oServices);}else{T.oCommonUtils.refreshModel(a);T.oCommonUtils.refreshSmartTable(a);M.showSuccessMessageIfRequired(T.oCommonUtils.getContextText("ITEM_CREATED",a.getId()),T.oServices);}r(d);d.setBindingContext(null);});var l={saveEntityPromise:k};T.oComponentUtils.fire(o,"AfterSave",l);}}function A(i){var j=T.oServices.oCRUDManager.activateDraftEntity(d.getBindingContext(),i);j.then(function(R){if(R&&R.response&&R.response.statusCode==="200"){d.close();d.setBindingContext(null);M.showSuccessMessageIfRequired(T.oCommonUtils.getText("OBJECT_CREATED"),T.oServices);T.oCommonUtils.refreshSmartTable(s.oSmartTable);}},Function.prototype);var E={activationPromise:j};T.oComponentUtils.fire(o,"AfterActivate",E);}function h(i,E){d=i;var j=s.oSmartFilterbar;a=T.oCommonUtils.getOwnerControl(E);a=c.isSmartTable(a)?a:a.getParent();var m=new sap.ui.model.json.JSONModel();m.setProperty("/title",T.oCommonUtils.getContextText("CREATE_DIALOG_TITLE",a.getId()));d.setModel(m,"localModel");d.setEscapeHandler(f);if(T.oComponentUtils.isDraftEnabled()){T.oCommonEventHandlers.addEntry(E,false,j,false,false,true).then(function(k){T.oServices.oApplication.registerContext(k);d.setBindingContext(k);d.open();});}else{var p=a.getParent().getBindingContext();var P=p?a.getTableBindingPath():'/'+a.getEntitySet();var n=C.createNonDraft(p,P,d.getModel());d.setBindingContext(n);d.open();}}var A=t.testable(A,"fnActivateImpl");var r=t.testable(r,"fnRemoveOldMessageFromModel");var G=t.testable(G,"fnGetFilterForCurrentState");return{onCancelPopUpDialog:f,onSavePopUpDialog:b,createWithDialog:h};}return B.extend("sap.suite.ui.generic.template.lib.CreateWithDialogHandler",{constructor:function(s,o,T){e(this,g(s,o,T));}});});
