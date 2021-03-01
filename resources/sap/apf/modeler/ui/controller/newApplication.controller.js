/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP AG. All rights reserved
 */
sap.ui.define(['sap/apf/modeler/ui/utils/nullObjectChecker'],function(n){"use strict";function _(c){var t=c.coreApi.getText;c.byId("idNewAppDialog").setTitle(t("newApplication"));c.byId("idDescriptionLabel").setText(t("description"));if(c.coreApi.showSemanticObject()){c.byId("idSemanticObjectLabel").setText(t("semanticObject"));}c.byId("idSaveButton").setText(t("save"));c.byId("idCancelButton").setText(t("cancel"));}return sap.ui.controller("sap.apf.modeler.ui.controller.newApplication",{onInit:function(){var c=this;this.parentControl=c.getView().getViewData().oParentControl;this.coreApi=c.getView().getViewData().oCoreApi;c.byId("idDescriptionInput").setValue("");if(this.coreApi.showSemanticObject()){c.byId("idSemanticObjectInput").setValue("FioriApplication");}else{c.byId("idSemanticObjectInput").setValue("");c.byId("idSemanticObjectBox").setVisible(false);}_(c);c.byId("idNewAppDialog").open();},handleAppDescriptionLiveChange:function(e){var c=this;var i=e.getParameters().value.trim().length!==0?true:false;c.byId("idSaveButton").setEnabled(i);},handleSavePress:function(){var c=this;var a={};a.ApplicationName=n.checkIsNotNullOrUndefinedOrBlank(c.byId("idDescriptionInput").getValue().trim())?c.byId("idDescriptionInput").getValue().trim():undefined;a.SemanticObject=n.checkIsNotNullOrUndefinedOrBlank(c.byId("idSemanticObjectInput").getValue().trim())?c.byId("idSemanticObjectInput").getValue().trim():undefined;this.coreApi.getApplicationHandler(function(A,m){if(A&&!n.checkIsNotUndefined(m)){A.setAndSave(a,function(r,o,b){if(!n.checkIsNotUndefined(b)&&(typeof r==="string")){c.parentControl.fireEvent("addNewAppEvent",{"appId":r});}else{var M=c.coreApi.createMessageObject({code:"11500"});M.setPrevious(b);c.coreApi.putMessage(M);}});}else{var M=c.coreApi.createMessageObject({code:"11509"});M.setPrevious(m);c.coreApi.putMessage(M);}});c.byId("idNewAppDialog").close();},handleCancelPress:function(){var c=this;c.byId("idNewAppDialog").close();}});});
