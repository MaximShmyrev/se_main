// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/MessageToast","./BaseDialog.controller"],function(M,B){"use strict";return B.extend("sap.ushell.applications.PageComposer.controller.ConfirmChangesDialog.controller",{constructor:function(v,r){this._oView=v;this._oResourceBundle=r;this.sViewId="confirmChangesDialog";this.sId="sap.ushell.applications.PageComposer.view.ConfirmChangesDialog";},onAfterClose:function(e){e.getSource().destroy();},onCancel:function(e){e.getSource().getParent().close();},onDismissChanges:function(e){var c=this._oView.getController();e.getSource().getParent().close();c._setDirtyFlag(false);c.navigateBack();},onOverwriteChanges:function(e){return new Promise(function(r,a){var c=this._oView.getController(),R=c.getPageRepository(),p=this._oView.getModel().getProperty("/page"),s=this._oView.getModel().getProperty("/simpleError"),S=s.statusCode,t=this;e.getSource().getParent().close();if(S==="412"){R.getPage(p.id).then(function(n){p.modifiedOn=n.modifiedOn;c.savePageAndUpdateModel(p).then(function(){t._successfulSave(t._oResourceBundle);r();}).catch(function(){c.showMessageBoxError(t._oResourceBundle.getText("Message.UpdatePageError"),false);r();});}).catch(function(){c.showMessageBoxError(t._oResourceBundle.getText("Message.LoadPageError"),false);r();});}else if(S==="400"){R.createPage(p).then(function(){t._successfulSave(t._oResourceBundle);r();}).catch(function(){c.showMessageBoxError(t._oResourceBundle.getText("Message.CreatePageError"),false);r();});}else{a();}}.bind(this));},_successfulSave:function(r){var c=this._oView.getController();M.show(r.getText("Message.SavedChanges"),{closeOnBrowserNavigation:false});c._setDirtyFlag(false);}});});
