// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "../util/Transport",
    "sap/base/Log",
    "sap/m/library",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/library",
    "sap/ui/core/SortOrder"
], function (
    TransportHelper,
    Log,
    mobileLibrary,
    MessageBox,
    Fragment,
    Controller,
    History,
    UIComponent,
    JSONModel,
    ushellLibrary,
    SortOrder
) {
    "use strict";

    // shortcut for sap.ushell.DisplayFormat
    var DisplayFormat = ushellLibrary.DisplayFormat;

    // shortcut for sap.m.LoadState
    var LoadState = mobileLibrary.LoadState;

    // shortcut for sap.ushell.VisualizationLoadState
    var VisualizationLoadState = ushellLibrary.VisualizationLoadState;

    return Controller.extend("sap.ushell.applications.PageComposer.controller.BaseController", {
        /**
         * Instantiates the page persistence utility and returns the created instance.
         *
         * @returns {sap.ushell.applications.PageComposer.util.PagePersistence} An instance of the page persistence utility.
         * @protected
         */
        getPageRepository: function () {
            return this.getOwnerComponent().getPageRepository();
        },

        /**
         * Convenience method for accessing the router.
         *
         * @returns {sap.ui.core.routing.Router} The router for this component.
         * @protected
         */
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        /**
         * Convenience method for getting the view model by name.
         *
         * @param {string} [sName] The model name.
         * @returns {sap.ui.model.Model} The model instance.
         * @protected
         */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         *
         * @param {sap.ui.model.Model} oModel The model instance.
         * @param {string} [sName] The model name.
         * @returns {sap.ui.mvc.View} The view instance.
         * @protected
         */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Convenience method for getting the root view. Useful, for example, for dialogs.
         *
         * @returns {sap.ui.core.Control|sap.ui.core.mvc.View} The view control.
         * @protected
         */
        getRootView: function () {
            return this.getOwnerComponent().getRootControl();
        },

        /**
         * Getter for the resource bundle.
         *
         * @returns {sap.ui.model.resource.ResourceModel} The resource model of the component.
         * @protected
         */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /**
         * Returns the transportHelper utility class
         *
         * @returns {object} The transportHelper instance
         */
        getTransportHelper: function () {
            if (!this.oTransportHelper) {
                this.oTransportHelper = new TransportHelper();
            }
            return this.oTransportHelper;
        },

        /**
         * Creates an edit dialog.
         *
         * @param {function} onConfirm The confirm function.
         * @param {function} onCancel Function to call when delete is cancelled.
         * @returns {Promise<sap.ushell.applications.PageComposer.controller.EditDialog>} A promise resolving to the EditDialog controller.
         * @private
         */
        _createEditDialog: function (onConfirm, onCancel) {
            return new Promise(function (resolve) {
                sap.ui.require([
                    "sap/ushell/applications/PageComposer/controller/EditDialog.controller"
                ], function (EditPageDialogController) {
                    if (!this.oEditPageDialogController) {
                        this.oEditPageDialogController = new EditPageDialogController(this.getRootView(), this.getResourceBundle());
                    } else {
                        this.oEditPageDialogController._resetModel();
                    }
                    this.oEditPageDialogController.attachCancel(onCancel);
                    this.oEditPageDialogController.attachConfirm(onConfirm);
                    this.oEditPageDialogController.load().then(function () {
                        resolve(this.oEditPageDialogController);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Shows the create page dialog and enhances it with transport fields if required.
         *
         * @param {function} onConfirm Function to call when create is confirmed.
         * @param {function} onCancel Function to call when create is cancelled.
         * @returns {Promise<sap.ushell.applications.PageComposer.controller.CreatePageDialog>}
         *   A promise resolving to the CreatePageDialog controller.
         * @protected
         */
        showCreateDialog: function (onConfirm, onCancel) {
            return new Promise(function (resolve, reject) {
                sap.ui.require([
                    "sap/ushell/applications/PageComposer/controller/CreatePageDialog.controller"
                ], function (CreatePageDialogController) {
                    if (!this.oCreatePageDialogController) {
                        this.oCreatePageDialogController = new CreatePageDialogController(this.getRootView(), this.getResourceBundle());
                    } else {
                        this.oCreatePageDialogController._resetModel();
                    }
                    this.oCreatePageDialogController.attachConfirm(onConfirm);
                    this.oCreatePageDialogController.attachCancel(onCancel);
                    this.oCreatePageDialogController.load().then(function () {
                        if (this.getOwnerComponent().isTransportSupported()) {
                            return this.getOwnerComponent().createTransportComponent().then(function (oTransportComponent) {
                                return this.getTransportHelper().enhanceDialogWithTransport(
                                    this.oCreatePageDialogController,
                                    oTransportComponent,
                                    onConfirm
                                );
                            }.bind(this));
                        }
                        return this.oCreatePageDialogController;
                    }.bind(this)).then(function (oEnhancedDialog) {
                        if (oEnhancedDialog) {
                            oEnhancedDialog.open();
                        }
                        resolve();
                    }).catch(function (oError) {
                        this.oCreatePageDialogController.destroy();
                        this.handleBackendError(oError);
                        reject();
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Shows the delete page dialog.
         *
         * @param {function} onConfirm Function to call when delete is confirmed.
         * @param {function} onCancel Function to call when delete is cancelled.
         * @returns {Promise<sap.ushell.applications.PageComposer.controller.DeleteDialog>}
         *   A promise resolving to the DeleteDialog controller.
         * @private
         */
        _createDeleteDialog: function (onConfirm, onCancel) {
            return new Promise(function (resolve) {
                sap.ui.require([
                    "sap/ushell/applications/PageComposer/controller/DeleteDialog.controller"
                ], function (DeleteDialogController) {
                    if (!this.oDeletePageDialogController) {
                        this.oDeletePageDialogController = new DeleteDialogController(this.getRootView(), this.getResourceBundle());
                    } else {
                        this.oDeletePageDialogController._resetModel();
                    }
                    this.oDeletePageDialogController.attachCancel(onCancel);
                    this.oDeletePageDialogController.attachConfirm(onConfirm);
                    this.oDeletePageDialogController.load().then(function () {
                        resolve(this.oDeletePageDialogController);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Checks if the edit dialog should be shown and creates the dialog if required.
         *
         * @param {object} page The page to edit.
         * @param {function} onConfirm The confirm function.
         * @param {function} onCancel Function to call when delete is cancelled.
         * @return {Promise<undefined>} A promise resolving when the dialog is shown
         * @protected
         */
        checkShowEditDialog: function (page, onConfirm, onCancel) {
            var fnError = this.handleBackendError.bind(this);

            if (!this.getOwnerComponent().isTransportSupported()) {
                return Promise.resolve();
            }
            return this.getOwnerComponent().createTransportComponent(page.devclass)
                .then(function (oTransportComponent) {
                    return Promise.all([
                        oTransportComponent.showTransport(page, "Page", true),
                        oTransportComponent.showLockedMessage(page)
                    ]).then(function (aResults) {
                        var bShowTransport = aResults[0],
                            oLockedInformation = aResults[1];
                        if (oLockedInformation) {
                            this.showMessageBoxError(this.getResourceBundle().getText(
                                "Dialog.LockedText",
                                [page.transportId, oLockedInformation.foreignOwner]
                            ), true);
                        } else if (bShowTransport) {
                            this._createEditDialog(onConfirm, onCancel).then(function (oDialog) {
                                oDialog.getModel().setProperty(
                                    "/message",
                                    this.getResourceBundle().getText("EditDialog.TransportRequired")
                                );
                                var oEnhancedDialog = this.getTransportHelper().enhanceDialogWithTransport(
                                    oDialog,
                                    oTransportComponent,
                                    onConfirm,
                                    page
                                );
                                oEnhancedDialog.open();
                            }.bind(this)).catch(fnError);
                        } else {
                            onConfirm(oTransportComponent.decorateResultWithTransportInformation());
                        }
                    }.bind(this)).catch(fnError);
                }.bind(this)).catch(fnError);
        },

        /**
         * Shows the delete dialog and enhances the dialog with transport fields if required
         *
         * @param {object} page The page object.
         * @param {function} [onConfirm] The confirm function handler.
         * @param {function} [onCancel] The cancel function handler.
         * @return {Promise<undefined>} A promise resolving when the dialog is shown
         * @protected
         */
        checkShowDeleteDialog: function (page, onConfirm, onCancel) {
            var oResourceBundle = this.getResourceBundle(),
                fnError = this.handleBackendError.bind(this);

            if (!this.getOwnerComponent().isTransportSupported()) {
                return this._createDeleteDialog(onConfirm, onCancel).then(function (oDialog) {
                    oDialog.getModel().setProperty("/message", oResourceBundle.getText("DeleteDialog.Text"));
                    oDialog.open();
                });
            }
            return this.getOwnerComponent().createTransportComponent(page.devclass)
                .then(function (oTransportComponent) {
                    return Promise.all([
                        oTransportComponent.showTransport(page, "Page"),
                        oTransportComponent.showLockedMessage(page)
                    ]).then(function (aResults) {
                        var bShowTransport = aResults[0],
                            oLockedInformation = aResults[1];
                        if (oLockedInformation) {
                            this.showMessageBoxError(oResourceBundle.getText(
                                "Dialog.LockedText",
                                [page.transportId, oLockedInformation.foreignOwner]
                            ), true);
                        } else {
                            this._createDeleteDialog(onConfirm, onCancel)
                                .then(function (oDialog) {
                                    oDialog.getModel().setProperty("/message", oResourceBundle.getText("DeleteDialog.Text"));
                                    if (bShowTransport) {
                                        oDialog.getModel().setProperty(
                                            "/message",
                                            oResourceBundle.getText("DeleteDialog.TransportRequired")
                                        );
                                        oDialog = this.getTransportHelper().enhanceDialogWithTransport(
                                            oDialog,
                                            oTransportComponent,
                                            onConfirm,
                                            page
                                        );
                                    } else {
                                        oDialog.getModel().setProperty("/validation/transportValid", true);
                                        this.getTransportHelper().attachConfirmHandler(oDialog, oTransportComponent, onConfirm);
                                    }
                                    oDialog.open();
                                }.bind(this)).catch(fnError);
                        }
                    }.bind(this)).catch(fnError);
                }.bind(this)).catch(fnError);
        },

        /**
         * Shows the copy page dialog and enhances it with transport fields if required.
         *
         * @param {function} oPage Page to copy.
         * @param {function} onConfirm Function to call when copy is confirmed.
         * @param {function} onCancel Function to call when copy is cancelled.
         * @return {Promise<undefined>} A promise resolving when the dialog is shown
         * @protected
         */
        showCopyDialog: function (oPage, onConfirm, onCancel) {
            return new Promise(function (resolve, reject) {
                sap.ui.require([
                    "sap/ushell/applications/PageComposer/controller/CopyPageDialog.controller"
                ], function (CopyPageDialogController) {
                    if (!this.oCopyPageDialogController) {
                        this.oCopyPageDialogController = new CopyPageDialogController(this.getRootView(), this.getResourceBundle());
                    } else {
                        this.oCopyPageDialogController._resetModel();
                    }
                    this.oCopyPageDialogController.attachConfirm(onConfirm);
                    this.oCopyPageDialogController.attachCancel(onCancel);
                    return this.oCopyPageDialogController.load().then(function () {
                        if (this.getOwnerComponent().isTransportSupported()) {
                            return this.getOwnerComponent().createTransportComponent().then(function (transportComponent) {
                                return this.getTransportHelper().enhanceDialogWithTransport(
                                    this.oCopyPageDialogController,
                                    transportComponent,
                                    onConfirm
                                );
                            }.bind(this));
                        }
                        return this.oCopyPageDialogController;
                    }.bind(this)).then(function (enhancedDialog) {
                        if (enhancedDialog) {
                            enhancedDialog.getModel().setProperty("/sourceId", oPage.id);
                            enhancedDialog.getModel().setProperty("/sourceTitle", oPage.title);
                            enhancedDialog.getModel().setProperty("/sourceDescription", oPage.description);
                            enhancedDialog.getModel().setProperty("/title", oPage.title);
                            enhancedDialog.getModel().setProperty("/description", oPage.description);
                            enhancedDialog.open();
                        }
                        resolve();
                    }).catch(function (error) {
                        this.oCopyPageDialogController.destroy();
                        this.handleBackendError(error);
                        reject(error);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Given a Tile type, returns an array of its supported {@link sap.ushell.DisplayFormat}s values
         * along with their i18n "label" and "preferred" flag.
         * This method assumes that the "tileTypeSet" was already read and stored in the "PageRepository" model
         * (done in {@link sap.ushell.applications.PageComposer.controller.BaseController#_loadPage}).
         *
         * @param {string} sTileType The Tile type.
         * @returns {{value:sap.ushell.DisplayFormat, label:string, preferred:boolean}[]} The supported {@link sap.ushell.DisplayFormat}s
         *   "value" for the given Tile type along with their i18n "label" and "preferred" flag.
         * @private
         */
        getSupportedDisplayFormats: function (sTileType) {
            var i18n = this.getResourceBundle();
            var oPageRepositoryModel = this.getModel("PageRepository");
            var oDisplayFormats = oPageRepositoryModel.getObject(
                "/tileTypeSet('" + encodeURIComponent(sTileType) + "')/vizOptions/displayFormats",
                { expand: "supported" }
            );
            var aSupportedDisplayFormats = (oDisplayFormats && oDisplayFormats.supported) || [];
            aSupportedDisplayFormats = aSupportedDisplayFormats.map(function (oSupportedDisplayFormat) {
                if (oSupportedDisplayFormat.id === DisplayFormat.Default) {
                    // TODO: remove this conditional on FLPCOREANDUX-4421
                    oSupportedDisplayFormat.id = DisplayFormat.Standard;
                }
                var sLabel = i18n.getText("DisplayFormat." + oSupportedDisplayFormat.id);
                var bPreferred = (oDisplayFormats.preferred === oSupportedDisplayFormat.id);
                return {
                    value: oSupportedDisplayFormat.id,
                    label: (bPreferred ? i18n.getText("PreferredFormatter", [sLabel]) : sLabel),
                    preferred: bPreferred
                };
            });
            return aSupportedDisplayFormats;
        },

        /**
         * Opens the TileInfoPopover by the "oOpenByControl" argument using the "oBindingContext" argument as the binding context.
         *
         * @param {sap.ui.core.Control} oOpenByControl The control to anchor the popover to.
         * @param {sap.ui.model.Context} oBindingContext The binding context to be used for displaying the popover bound content.
         * @private
         */
        _openTileInfoPopover: function (oOpenByControl, oBindingContext) {
            var oRootView = this.getRootView();
            if (!oRootView.oTileInfoPopover) {
                var sFragmentID = oRootView.createId("tileInfoPopover");
                Fragment.load({
                    id: sFragmentID,
                    name: "sap.ushell.applications.PageComposer.view.TileInfoPopover",
                    controller: this
                }).then(function (oTileInfoPopover) {
                    oRootView.oTileInfoPopover = oTileInfoPopover;
                    oRootView.oTileInfoPopover.displayFormatHint = Fragment.byId(sFragmentID, "displayFormatHint");
                    oRootView.addDependent(oRootView.oTileInfoPopover);
                    this._openTileInfoPopover(oOpenByControl, oBindingContext);
                }.bind(this));
            } else {
                var oTileData = oBindingContext.getProperty("");
                var aSupportedDisplayFormats = this.getSupportedDisplayFormats(oTileData.tileType);
                var oExtraDataModel = new JSONModel({
                    displayFormats: aSupportedDisplayFormats,
                    supportedDisplayFormats: aSupportedDisplayFormats.map(function (oSupportedDisplayFormat) {
                        return oSupportedDisplayFormat.label;
                    }).join(", ")
                });
                if (oOpenByControl.isA("sap.m.GenericTile")) {
                    oExtraDataModel.setProperty("/scope", oOpenByControl.getScope());
                    if (oOpenByControl.getState() === LoadState.Failed) {
                        var aAllVisualizations = this.getModel("roles").getProperty("/allVisualizations");
                        var aAvailableVisualizations = this.getModel("roles").getProperty("/availableVisualizations");
                        if (aAllVisualizations && aAllVisualizations.indexOf(oTileData.catalogTileId) === -1) {
                            oExtraDataModel.setProperty("/state", VisualizationLoadState.InsufficientRoles);
                        } else if (aAvailableVisualizations && aAvailableVisualizations.indexOf(oTileData.catalogTileId) === -1) {
                            oExtraDataModel.setProperty("/state", VisualizationLoadState.OutOfRoleContext);
                        }
                    }
                }
                oRootView.oTileInfoPopover.setModel(oExtraDataModel, "extraData");
                oRootView.oTileInfoPopover.setModel(oBindingContext.getModel());
                oRootView.oTileInfoPopover.bindObject({ path: oBindingContext.getPath() });
                oRootView.oTileInfoPopover.openBy(oOpenByControl);
            }
        },

        /**
         * Displays a MessageBox with an error message.
         *
         * @param {string} sErrorMsg The error message.
         * @param {boolean} [bNavToPageOverview] Indicates whether to navigate to the page overview on close. Defaults to "false".
         * @protected
         */
        showMessageBoxError: function (sErrorMsg, bNavToPageOverview) {
            if (bNavToPageOverview) {
                MessageBox.error(sErrorMsg, { onClose: this.navigateBack.bind(this) });
            } else {
                MessageBox.error(sErrorMsg);
            }
        },

        /**
         * Displays a MessageBox with an Warning message.
         *
         * @param {string} sWarningMsg The warning message.
         * @param {string} [sWarningMsgDetails] The detailed warning message.
         * @param {boolean} [bNavToPageOverview] Indicates whether to navigate to the page overview after close.
         * @protected
         */
        showMessageBoxWarning: function (sWarningMsg, sWarningMsgDetails, bNavToPageOverview) {
            if (bNavToPageOverview) {
                MessageBox.warning(sWarningMsg, {
                    onClose: this.navigateBack.bind(this),
                    details: sWarningMsgDetails
                });
            } else {
                MessageBox.warning(sWarningMsg, { details: sWarningMsgDetails });
            }
        },

        /**
         * Navigates to the pageOverview page.
         *
         * @protected
         */
        navigateBack: function () {
            var oHistory = History.getInstance();
            this.getPageRepository().abortPendingBackendRequests();
            if (oHistory.getPreviousHash() !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("overview", {}, true);
            }
        },

        /**
         * Navigates to the error page.
         *
         * @param {string} sPageId The error message.
         * @protected
         */
        navigateToErrorPage: function (sPageId) {
            this.getRouter().navTo("error", {
                pageId: encodeURIComponent(sPageId)
            }, null, true);
        },

        /**
         * Navigates to the unsupported page.
         *
         * @param {string} sPageId The unsupported pageId.
         * @protected
         */
        navigateToUnsupportedPage: function (sPageId) {
            this.getRouter().navTo("unsupported", {
                pageId: encodeURIComponent(sPageId)
            }, null, true);
        },

        /**
         * Navigates to the detail page in edit mode.
         *
         * @param {string} pageId The pageId to navigate to
         *
         * @private
         */
        navigateToEdit: function (pageId) {
            var oSettingsModel = this.getOwnerComponent().getModel("settings");
            oSettingsModel.setProperty("/editMode", true);
            oSettingsModel.setProperty("/deepLink", false);
            this.getRouter().navTo("view", {
                pageId: encodeURIComponent(pageId)
            });
        },

        /**
         * Shows the preview of the page. It is a design-time preview without live data.
         *
         * @protected
         */
        preview: function () {
            var oParentView = this.getView();
            if (this.oPagePreviewDialogController) {
                this.oPagePreviewDialogController.open(oParentView);
                return;
            }
            sap.ui.require([
                "sap/ushell/applications/PageComposer/controller/PagePreviewDialog.controller"
            ], function (oPagePreviewDialogController) {
                this.oPagePreviewDialogController = oPagePreviewDialogController;
                this.oPagePreviewDialogController.open(oParentView);
            }.bind(this));
        },

        /**
         * Called when the view of the controller is left or the app is closed.
         */
        onExit: function () {
            if (this.oPagePreviewDialogController) {
                this.oPagePreviewDialogController.close();
                // onAfterClose needs to be called explicitly here due to timing issues when closing the app.
                this.oPagePreviewDialogController.onAfterClose();
                delete this.oPagePreviewDialogController;
            }
        },

        /**
         * Checks if the page's masterLanguage is the same as the logon language.
         * Shows error message box if "false".
         *
         * @param {object} page The page to check.
         * @return {boolean} Returns "true" if there is a language mismatch or "false" otherwise.
         */
        checkMasterLanguageMismatch: function (page) {
            var bCheckLanguageMismatch = this.getOwnerComponent().getMetadata().getConfig().checkLanguageMismatch,
                sUserLanguage = sap.ui.getCore().getConfiguration().getSAPLogonLanguage().toUpperCase(),
                sPageMasterLanguage = page.masterLanguage.toUpperCase();
            if (bCheckLanguageMismatch && sUserLanguage !== sPageMasterLanguage) {
                this.showMessageBoxError(this.getResourceBundle().getText(
                    "EditDialog.LanguageMismatch",
                    [sPageMasterLanguage, sUserLanguage]
                ), true);
                return true;
            }
            return false;
        },

        /**
         * Called if a backend error needs to be handled.
         *
         * @param {object} oError The error object.
         * @protected
         */
        handleBackendError: function (oError) {
            if (oError.responseText) {
                this.getOwnerComponent().showErrorDialog(oError);
            } else if (oError instanceof Error) { // prevent logging "[object Object]"
                Log.error(oError);
            } else {
                Log.error(((oError && oError.message) ? oError.message : "Unexpected error"), "PageComposer/controller/BaseController.js");
            }
        },

        /**
         * @typedef {object} RolesInfo Object with information about Roles.
         * @property {string[]} [available] An array of every available Role. Used for initializing the model after Page load.
         * @property {string[]} [selected] An array of the IDs of the Roles that are currently selected in the ContextSelector.
         */
        /**
         * (Re)sets the model used to persist the selection of the Role context.
         *
         * @param {RolesInfo} [oRolesInfo] Object with information about Roles.
         *   If undefined, the model is initialized and set; this should happen before loading a Page.
         * @private
         */
        _resetRolesModel: function (oRolesInfo) {
            var aAvailable;
            var aSelected;
            var oRolesModel = this.getModel("roles");
            if (!oRolesModel) {
                oRolesModel = new JSONModel();
                this.setModel(oRolesModel, "roles");
            }
            if ((typeof oRolesInfo === "undefined") || (!oRolesInfo.available && !oRolesInfo.selected)) {
                // (re)initialization (before initial Page load)
                aAvailable = [];
                aSelected = [];
                oRolesModel.setProperty("/allVisualizations", []);
            } else {
                // (re)initialization (after initial Page load)
                aAvailable = (oRolesInfo.available || oRolesModel.getProperty("/available") || []);
                aSelected = (oRolesInfo.selected || aAvailable);
                if (oRolesInfo.available) {
                    oRolesModel.setProperty("/allVisualizations", this.getPageRepository().getVizIds(oRolesInfo.available));
                }
            }
            var sCount = aSelected.length.toString();
            if (!aSelected.length) {
                sCount = this.getResourceBundle().getText("Message.NoRolesSelected");
            } else if (aSelected.length === aAvailable.length) {
                sCount = this.getResourceBundle().getText("Message.AllRolesSelected");
            }
            oRolesModel.setProperty("/available", aAvailable);
            oRolesModel.setProperty("/selected", aSelected);
            oRolesModel.setProperty("/selectedCountText", sCount);
            oRolesModel.setProperty("/availableVisualizations", this.getPageRepository().getVizIds(aSelected));
        },

        /**
         * Formatter to get Assignment Status Detailed Message based on the message code.
         *
         * @param {string} sCode The error message code.
         * @returns {string} The detailed error message description.
         * @protected
         */
        formatAssignmentDetailsMessage: function (sCode) {
            var sMissingAssignment = this.getPageRepository().getMissingAssignment(sCode);

            if (sMissingAssignment === "space") {
                return this.getResourceBundle().getText("Message.NotAssignedToSpaceInformationDetails");
            } else if (sMissingAssignment === "role") {
                return this.getResourceBundle().getText("Message.NotAssignedToRoleInformationDetails");
            }
            return "";
        },

        /**
         * Format the type of a visualization for displaying.
         *
         * @param {string} vizType The type of a visualization.
         * @returns {string} The translated type/category of a visualization.
         * @private
         */
        _formatTileType: function (vizType) {
            var i18n = this.getResourceBundle();
            switch (vizType) {
                case "STATIC": return i18n.getText("Title.StaticTile");
                case "DYNAMIC": return i18n.getText("Title.DynamicTile");
                case "CUSTOM":
                default: return i18n.getText("Title.CustomTile");
            }
        },

        /**
         * Set the Title to the page
         *
         * @param {string} title title text to be set
         * @private
         */
        setTitle: function (title) {
            this.getOwnerComponent().getService("ShellUIService").then( // promise is returned
                function (oService) {
                    oService.setTitle(title);
                },
                function (oError) {
                    Log.error("Cannot get ShellUIService", oError, "sap.ushell.applications.PageComposer");
                }
            );
        },

        /**
         * Reset all Sort Indicator to default  and set the new sort Indicator.
         * @param {string} sorterKey The key of the selected column.
         * @param {boolean} sortDescending The variable of whether it should be sorted in ascending or descending order.
         * @param {$ObjMap} columnIds The column ids of the view definition.
         * @param {sap.m.Column[]} columns The array of all table columns.
         */
        updateSortIndicators: function (sorterKey, sortDescending, columnIds, columns) {
            var oSorteredColumn = this.getView().byId(columnIds[sorterKey]),
                sSorteredColumnId = oSorteredColumn.getId();
            for (var i = 0; i < columns.length; ++i) {
                if (columns[i].getId() === sSorteredColumnId) {
                    oSorteredColumn.setSortIndicator(sortDescending ? SortOrder.Descending : SortOrder.Ascending);
                } else {
                    columns[i].setSortIndicator(SortOrder.None);
                }
            }
        }
    });
});
