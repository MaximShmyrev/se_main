/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");jQuery.sap.require("sap.apf.modeler.ui.utils.optionsValueModelBuilder");sap.ui.define(["sap/apf/modeler/ui/controller/overwriteExistingConfiguration"],function(B){"use strict";var c,p,o;var n=sap.apf.modeler.ui.utils.nullObjectChecker;var a=sap.apf.modeler.ui.utils.optionsValueModelBuilder;function _(C){var t=c.getText;C.byId("idImportDeliveredContentDialog").setTitle(t("importDeliveredContent"));C.byId("idConfigLabel").setText(t("configuration"));C.byId("idAppConfigCombobox").setPlaceholder(t("configFileInputPlaceHolder"));C.byId("idImportOfConfig").setText(t("import"));C.byId("idCancelImportOfConfig").setText(t("cancel"));}function b(C){var m,g,h;g=c.readAllConfigurationsFromVendorLayer();g.then(function(i){h={applicationText:c.getText("application"),configurationText:c.getText("configuration")};i=[h].concat(i);m=a.prepareModel(i);var A=C.byId("idAppConfigCombobox");A.setModel(m);A.getItems()[0].setEnabled(false);C.byId("idImportDeliveredContentDialog").open();});}function d(C,g,h,i){var j=new sap.ui.core.CustomData({value:{callbackOverwrite:g,callbackCreateNew:h}});o=sap.ui.xmlfragment("idOverwriteConfirmationFragment","sap.apf.modeler.ui.fragment.overwriteConfirmation",C);C.getView().addDependent(o);C.setOverwriteConfirmationDialogText(c.getText);o.removeAllCustomData();o.addCustomData(j);sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idNewConfigTitleInput").setValue(i);o.open();}function e(C){var i=C.byId("idImportDeliveredContentDialog");if(o&&o.isOpen()){C.handleCancelOfOverwriteDialog();}if(i&&i.isOpen()){C.handleCancelOfImportDialog();}}function f(g,m,h){var C=this;if(!n.checkIsNotUndefined(h)){p.fireEvent("updateAppListEvent");var M=c.createMessageObject({code:"11515"});c.putMessage(M);}else{var M=c.createMessageObject({code:"11502"});M.setPrevious(h);c.putMessage(M);}e(C);}return B.extend("sap.apf.modeler.ui.controller.importDeliveredContent",{onInit:function(){var C=this;c=C.getView().getViewData().oCoreApi;p=C.getView().getViewData().oParentControl;_(C);b(C);},handleChangeOfAppConfigTextField:function(){var C=this,m,A;A=C.byId("idAppConfigCombobox");m=A.getItems().filter(function(i){return i.getText()===A.getValue();});if(!m.length){jQuery(A).focus();jQuery(".appCofigCombo").find('input').focus();A.setValueState(sap.ui.core.ValueState.Error);}},handleSelectionChangeOfAppConfigTextField:function(){var C=this;C.byId("idAppConfigCombobox").setValueState(sap.ui.core.ValueState.None);},handleImportPress:function(){var C=this;var A=C.byId("idAppConfigCombobox");C.handleChangeOfAppConfigTextField();if(n.checkIsNotNullOrUndefinedOrBlank(A.getSelectedItem())){var v=A.getSelectedItem().data("value").split(".");var g=v[0];var h=v[1];c.importConfigurationFromVendorLayer(g,h,function(i,j,k){d(C,i,j,k);},f.bind(C));}},handleCancelOfImportDialog:function(){var C=this;C.getView().destroy();}});});
