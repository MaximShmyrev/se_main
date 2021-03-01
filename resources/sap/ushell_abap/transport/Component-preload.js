//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell_abap/transport/Component.js":function(){//Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/base/Log",
    "sap/ui/core/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/mvc/XMLView",
    "sap/m/IconTabFilter"
], function (
    UIComponent,
    JSONModel,
    Log,
    coreLibrary,
    Filter,
    FilterOperator,
    XMLView,
    IconTabFilter) {
    "use strict";

    var ValueState = coreLibrary.ValueState;

    var Modes = {
        off: "OFF",
        manual: "MANUAL",
        auto: "AUTOMATIC"
    };

    return UIComponent.extend("sap.ushell_abap.transport.Component", {
        metadata: {
            manifest: "json",
            associations: {
                /**
                 * The IconTabBar can be enhanced.
                 */
                iconTabBar: {
                    type: " sap.m.IconTabBar", multiple: false
                }
            },
            properties: {
                showAssignButton: {
                    name: "showAssignButton",
                    type: "Boolean",
                    defaultValue: false
                }
            },
            aggregations: {
                /**
                 * Dependents are not rendered, but their databinding context and lifecycle are bound to the aggregating Element.
                 */
                dependents: {name: "dependents", type :"sap.ui.core.Element", multiple: true}
            },
            events: {
                /**
                 *
                 */
                change: {
                    parameters: {
                        valid: { type: "Boolean" },
                        required: { type: "Boolean" }
                    }
                },
                /**
                 *
                 */
                assign: {
                    parameters: {
                        transportId: { type: "string" }
                    }
                }
            }
        },

        /**
         * Initializes the component.
         */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            var oTransportModel = this.getModel("Transport");

            this._initModels();

            //Override the attachChange method, because of PageComposer
            //Problem: The edit and delete dialogs of PageComposer are attached
            //to the change event after the event is fired and they need to call
            //showTransport (trigger new batch request) again in order to get
            //correct state after attachment. In order to avoid the second request
            //we fire the current state after attachment.
            this.fnOriginAttachChange = this.attachChange;
            this.attachChange = function () {
                this.fnOriginAttachChange.apply(this, arguments);
                this.fireChange({
                    valid: !this.getModel("TransportInformation").getProperty("/required"),
                    empty: true,
                    required: !!this.getModel("TransportInformation").getProperty("/required")
                });
            };

            this._oMetadataPromise = new Promise(function (resolve, reject) {
                if (oTransportModel.isMetadataLoadingFailed()) {
                    reject("Metadata failed to load.");
                }
                oTransportModel.attachMetadataFailed(reject);
                oTransportModel.metadataLoaded().then(resolve);
            });

            this._setMetaModelData();
        },

        /**
         * Initializes the 'Mode' and 'TransportInformation' models.
         *
         * @private
         */
        _initModels: function () {
            this.setModel(new JSONModel({
                showAssignButton: this.getShowAssignButton()
            }), "ViewSettings");
            this.setModel(new JSONModel({
                mode: null
            }), "Mode");
            this.setModel(new JSONModel({
                transportId: null,
                required: true,
                valueState: ValueState.None,
                value: "",
                transports: []
            }), "TransportInformation");
        },

        /**
         * Retrieves the mode and saves it. If retrieve fails, saves 'OFF'.
         *
         * @return {Promise<void>} Resolves when the mode is set.
         * @private
         */
        _saveMode: function () {
            var oPromise;
            if (this.getModel("Mode").getProperty("/mode") !== null) {
                oPromise = Promise.resolve(this.getModel("Mode").getProperty("/mode"));
            } else {
                oPromise = this._getMode().then(function (oResult) {
                    return oResult && oResult.mode ? oResult.mode.transportMode : Modes.off;
                }).catch(function () {
                    return Modes.off;
                });
            }
            return oPromise.then(this._setMode.bind(this));
        },

        /**
         * Sets the mode string to the Mode model.
         *
         * @param {string} sMode The mode string: OFF|AUTOMATIC|MANUAL.
         * @private
         */
        _setMode: function (sMode) {
            this.getModel("Mode").setProperty("/mode", sMode);
            if (sMode === Modes.auto) {
                this.getModel("TransportInformation").setProperty("/required", true);
            } else {
                this.getModel("TransportInformation").setProperty("/required", false);
            }
        },

        /**
         * Reads the mode from the server, resolves to the mode string.
         *
         * @return {Promise<string>} Resolves to the mode string.
         * @private
         */
        _getMode: function () {
            if (this.oModePromise) {
                return this.oModePromise;
            }
            this.oModePromise = new Promise(function (resolve, reject) {
                this.getModel("Transport").callFunction("/mode", {
                    method: "POST",
                    success: resolve,
                    error: reject
                });
            }.bind(this));
            return this.oModePromise;
        },

        /**
         * Reads the transports from the server filtered by objectId and sets the model entries for the Input field.
         * Rejects with ODataModel error.
         * @param {string} objectId The id of the space or page.
         * @return {Promise<{results: []}>} Resolves with the results object.
         * @private
         */
        _getTransports: function (objectId) {
            return new Promise(function (resolve, reject) {
                this.getModel("Transport").read("/transportSet", {
                    success: resolve,
                    error: reject,
                    filters: [
                        new Filter("objectId", FilterOperator.EQ, objectId.toUpperCase())
                    ]
                });
            }.bind(this));
        },

        /**
         * Called if the OData Requests is done to set the transport data and
         * the component state based on OData message container.
         *
         * @param {{results: []}} result OData Result object
         * @param {object} spaceOrPage The Page or Space object, depending on surrounding app
         * @private
         */
        _setTransportData: function (result, spaceOrPage) {
            var aMessages, bTransportAllowed, bRequired;
            var oTransportInformationModel = this.getModel("TransportInformation");
            oTransportInformationModel.setProperty("/transports", result.results);
            if (!spaceOrPage) { return; }

            aMessages = this.getModel("Transport").getMessages({sDeepPath: "/transportSet"});
            bTransportAllowed = !aMessages.some(function (message) { return message.getCode() === "/UI2/PAGE/072"; });
            bRequired = !aMessages.some(function (message) { return message.getCode() === "/UI2/PAGE/055"; });

            oTransportInformationModel.setProperty("/required", bRequired);
            oTransportInformationModel.setProperty("/transportAllowed", bTransportAllowed);

            this.getRootControl().loaded().then(function (view) {
                view.getController().validate();
            });
        },

        /**
         * Adds the transports table to the iconTabBar.
         *
         * @param {string} objectId The id of the space or page.
         * @param {string} objectType "Space" or "Page".
         * @private
         */
        _decorateTabBarWithTransportTable: function (objectId, objectType) {
            var sIconTabBarId = this.getAssociation("iconTabBar");
            var oIconTabBar = sap.ui.getCore().byId(sIconTabBarId);
            var oShowTransportPromise = this.showTransport({
                id: objectId
            }, objectType);

            for (var i = 0; i < oIconTabBar.getItems().length; i++) {
                if (oIconTabBar.getItems()[i].getKey() === "iconTabBarTransports") {
                    oIconTabBar.getItems()[i].getContent()[0].getController().bindItems(objectId, objectType, oIconTabBar.getItems()[i]);
                    return;
                }
            }

            Promise.all([
                XMLView.create({
                    id: this.createId("assignedTransport"),
                    viewName: "sap.ushell_abap.transport.view.TransportTable"
                }),
                oShowTransportPromise
            ])
            .then(function (results) {
                var oView = results[0];
                oView.getController().connect(this);
                this.addDependent(oView);
                oView.setModel(this.getModel("Transport"), "Transport");
                oView.setModel(this.getModel("TransportInformation"), "TransportInformation");
                oView.setModel(this.getModel("SupportedOperations"), "SupportedOperations");
                oView.setModel(this.getModel("i18n"), "i18n");
                oView.setModel(this.getModel("ViewSettings"), "ViewSettings");
                var oIconTabFilter = new IconTabFilter({
                    content: oView,
                    key: "iconTabBarTransports"
                });
                oView.byId("assignedTransportTable").addAriaLabelledBy(oIconTabFilter);
                oIconTabBar.addItem(oIconTabFilter);
                oView.getController().bindItems(objectId, objectType, oIconTabFilter);
            }.bind(this));
        },

        /**
         * @param {string | sap.ui.base.ManagedObject} sId the ID of the managed object that is set as an association,
         * or the managed object itself or null
         * @param {string} objectId the the page or space ID
         * @param {string} objectType is either a "Page" or a "Space"
         */

        setIconTabBar: function (sId, objectId, objectType) {
            this.setAssociation("iconTabBar", sId, true);
            this._saveMode().then(function () {
                if (this.getModel("Mode").getProperty("/mode") === Modes.off) {
                    return;
                }
                this._decorateTabBarWithTransportTable(objectId, objectType);
            }.bind(this));
        },

        /**
         * Reset the component to its initial state
         *
         * - Resets the models to initial values.
         * - Calls initialize to save the mode.
         *
         * @return {Promise<void>} Resolves when the component was reset and the mode was saved.
         */
        reset: function () {
            var oTransportInformationModel = this.getModel("TransportInformation");
            oTransportInformationModel.setProperty("/transportId", null);
            oTransportInformationModel.setProperty("/value", "");
            oTransportInformationModel.setProperty("/required", true);
            oTransportInformationModel.setProperty("/transportAllowed", true);
            oTransportInformationModel.setProperty("/assignedToTransport", false);
            oTransportInformationModel.setProperty("/valueState", ValueState.None);
            oTransportInformationModel.setProperty("/objectType", null);
            return Promise.resolve();
        },

        /**
         * Decorates the spaceOrPage object by adding transport-specific properties.
         *
         * @param {object} [spaceOrPage] The Page or Space object, depending on surrounding app
         * @returns {object} The enhanced object or a new object.
         */
        decorateResultWithTransportInformation: function (spaceOrPage) {
            var sTransportId = this.getModel("TransportInformation").getProperty("/transportId");

            if (!spaceOrPage) {
                spaceOrPage = {};
            }

            if (sTransportId) {
                spaceOrPage.transportId = sTransportId;
            }

            return spaceOrPage;
        },

        /**
         * Reads the transports from the server filted by objectId and sets the model entries for the Input field.
         * Rejects with ODataModel error.
         *
         * @return {Promise} Resolves with no value.
         * @private
         */
        _getAssignedTransports: function (objectId, objectType) {
            if (!objectId) {
                return new Promise(function (resolve, reject) {
                    resolve({
                        results: []
                    });
                });
            }
            var aFilter = [];
            aFilter.push(new Filter("objectId", FilterOperator.EQ, objectId.toUpperCase()));
            aFilter.push(new Filter("objectType", FilterOperator.EQ, objectType));
            return new Promise(function (resolve, reject) {
                this.getModel("Transport").read("/assignedTransportSet", {
                    success: resolve,
                    error: reject,
                    filters: aFilter
                });
            }.bind(this));
        },

        /**
         * Stores the given transportId in the TransportInformation model.
         *
         * @param {string} id The transport id.
         * @param {string} objectType The type of the object (Page|Space)
         * @private
         */
        _storeAssignedTransport: function (id, objectType) {
            var oTransportInformationModel = this.getModel("TransportInformation");
            oTransportInformationModel.setProperty("/transportId", id);
            oTransportInformationModel.setProperty("/transportAllowed", true);
            oTransportInformationModel.setProperty("/assignedToTransport", true);
            oTransportInformationModel.setProperty("/objectType", objectType);
            var aTransports = oTransportInformationModel.getProperty("/transports");
            var oSuggestion = aTransports.find(function (suggestion) { return suggestion.id === id; });

            if (oSuggestion) {
                var iSuggestionIndex = aTransports.indexOf(oSuggestion);
                var oSuggestionItem = this.getRootControl().byId("transportInput").getSuggestionRows()[iSuggestionIndex];
                this.getRootControl().byId("transportInput").setSelectionRow(oSuggestionItem);
            }
        },

        /**
         * Sets the /assignedToTransport property to false and empties the value of the transport input field.
         * @private
         */
        _unsetTransportAssignment: function () {
            var oTransportInformationModel = this.getModel("TransportInformation"),
                oInput = this.getRootControl().byId("transportInput");
            oTransportInformationModel.setProperty("/assignedToTransport", false);
            if (oInput) { oInput.setValue(""); }
        },


        /**
         * Checks the messages in the oData model for "/UI2/PAGE/072". If it exists, the transport is not allowed.
         * because a customer namespace is used in SAP internal systems.
         *
         * @returns {boolean} True if transport is allowed.
         * @private
         */
        _isTransportAllowed: function () {
            var bTransportAllowed = this.getModel("TransportInformation").getProperty("/transportAllowed");

            if (!bTransportAllowed) {
                this.getRootControl().byId("transportInput").setValue("");
            }

            return bTransportAllowed;
        },

        /**
         * Returns true if the mode is OFF.
         *
         * @returns {boolean} The result.
         * @private
         */
        _isModeOff: function () {
            return this.getModel("Mode").getProperty("/mode") === Modes.off;
        },

        /**
         * Returns true if the mode is MANUAL.
         *
         * @returns {boolean} The result.
         * @private
         */
        _isModeManual: function () {
            return this.getModel("Mode").getProperty("/mode") === Modes.manual;
        },

        /**
         * set the function import information from metadata to a global model
         *
         * @protected
         */
        _setMetaModelData: function () {
            var oMetaModel = this.getModel("Transport").getMetaModel();
            oMetaModel.loaded().then(function () {
                this.setModel(new JSONModel({
                    assignTransportSupported: !!oMetaModel.getODataFunctionImport("assignTransport")
                }), "SupportedOperations");
            }.bind(this));
        },

        /**
         * Fires change event with valid: true, empty: true, required: false.
         * Calls the given resolve function with false.
         * @param {function} resolve A resolve function.
         * @private
         */
        _resolveToFalse: function (resolve) {
            this.fireChange({
                valid: true,
                empty: true,
                required: false
            });
            resolve(false);
        },

        /**
         * Fires change event with the given values.
         * Calls the given resolve function with true.
         * @param {boolean} valid True if the transport is valid
         * @param {boolean} required True if the transport is required
         * @param {function} resolve A resolve function.
         * @private
         */
        _resolveToTrue: function (valid, required, resolve) {
            this.fireChange({
                valid: valid,
                empty: true,
                required: required
            });
            resolve(true);
        },


        /**
         * Checks if the transport information needs to be shown.
         * - Shown if the metadata is loaded and the mode is saved and not 'OFF'.
         * - Rejects if objectType is not provided
         * @param {object} spaceOrPage The space or page object
         * @param {string} objectType is either a "Page" or a "Space"
         * @param {boolean} [skipIfOptional] Whether it should resolve to false transport is optional. If not given, interpreted as "false"
         * @returns {Promise<boolean>} A promise resolving as boolean indicating if the transport component should
         * be visible within the used app.
         */
        showTransport: function (spaceOrPage, objectType, skipIfOptional) {
            if (typeof objectType !== "string") {
                return new Promise(function (resolve, reject) {
                    reject("No parameter 'objectType' provided");
                });
            }
            var sObjectId = spaceOrPage ? spaceOrPage.id : "";
            this.getRootControl().setBusy(true);
            this.fireChange({
                valid: false,
                empty: true,
                required: true
            });
            return new Promise(function (resolve) {
                Promise.all([
                    this._getAssignedTransports(sObjectId, objectType),
                    this._oMetadataPromise,
                    this._saveMode()
                ]).then(function (result) {
                    this._unsetTransportAssignment();
                    if (result[0].results.length) {
                        // There are transports assigned to this space/page already.
                        // Take the first one and store it in the model, so that it can be used on edit/delete.
                        this._storeAssignedTransport(result[0].results[0].id, objectType);
                        // Resolve to false because there is already a transport assigned.
                        return this._resolveToFalse(resolve);
                    }

                    if (this._isModeOff()) {
                        // Resolve to false because mode is OFF
                        return this._resolveToFalse(resolve);
                    }

                    return this._getTransports(sObjectId).then(function (transportsResult) {
                        this._setTransportData(transportsResult, spaceOrPage);
                    }.bind(this)).then(function () {
                        var bRequired, bValid, oModel;
                        if (!this._isTransportAllowed()) {
                            // Resolve to false because transport is not allowed (customer namespace in SAP-internal system)
                            return this._resolveToFalse(resolve);
                        }

                        if (skipIfOptional && this._isModeManual()) {
                            // Resolve to false because skipIfOptional is true and mode is MANUAL (edit case)
                            return this._resolveToFalse(resolve);
                        }

                        oModel = this.getModel("TransportInformation");
                        bValid = !oModel.getProperty("/required");
                        bRequired = !!oModel.getProperty("/required");

                        if (skipIfOptional && !bRequired) {
                            // Resolve to false because skipIfOptional is true and transport is optional (edit case)
                            return this._resolveToFalse(resolve);
                        }

                        return this._resolveToTrue(bValid, bRequired, resolve);
                    }.bind(this));
                }.bind(this)).catch(function (oError) {
                    if (oError instanceof Error) { // prevent logging "[object Object]"
                        Log.error(oError);
                    } else {
                        Log.error(((oError && oError.message) ? oError.message : "Unexpected error"), "ushell_abap/transport/Component.js");
                    }
                    resolve(false);
                }).finally(function () {
                    this.getRootControl().setBusy(false);
                }.bind(this));
            }.bind(this));
        },

        /**
         * Dummy API Method to be compatible
         *
         * @returns {Promise<boolean|object>} A promise with the transport information or false if the page is not locked
         */
        showLockedMessage: function () {
            return Promise.resolve(false);
        },

        /**
         * Override setShowAssignButton property setter
         * @param {boolean} setShowButton True if the button should be visible
         */
        setShowAssignButton: function (setShowButton) {
            this.getModel("ViewSettings").setProperty("/showAssignButton", !!setShowButton);
            this.setProperty("showAssignButton", setShowButton, true);
        }
    });
});
},
	"sap/ushell_abap/transport/controller/TransportInformation.controller.js":function(){// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/library",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Item"
], function (
    Controller,
    coreLibrary,
    JSONModel,
    Item
) {
    "use strict";

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    return Controller.extend("sap.ushell_abap.transport.controller.TransportInformation", {
        onInit: function () {
            this.byId("transportInput").setSuggestionRowValidator(this._suggestionRowValidator);
        },

        /**
         * Returns an item for each row.
         *
         * @param {sap.m.ColumnListItem} oColumnListItem The column list item.
         * @return {sap.ui.core.Item} The created item.
         * @private
         */
        _suggestionRowValidator: function (oColumnListItem) {
            var aCells = oColumnListItem.getCells();

            return new Item({
                key: aCells[0].getText(),
                text: aCells[1].getText()
            });
        },

        /**
         * Called if the transport value is changed.
         * - validates the input
         * - sets the Id to the TransportInformation model
         */
        onTransportChange: function () {
            var sSelectedItemKey = this.byId("transportInput").getSelectedKey(),
                sInputValue = this.byId("transportInput").getValue(),
                bIsValid = this.validate(sSelectedItemKey, sInputValue),
                sTransportId = bIsValid ? sSelectedItemKey : null;
            this.getOwnerComponent().getModel("TransportInformation").setProperty("/transportId", sTransportId);
            this.getOwnerComponent().fireChange({
                valid: bIsValid,
                empty: !sInputValue,
                required: this.getOwnerComponent().getModel("TransportInformation").getProperty("/required")
            });
        },

        /**
         * Event is fired if a logical field group defined by <code>fieldGroupIds</code> of the Form was left
         * or when the user explicitly pressed the key combination that triggers validation.
         * @param {sap.ui.base.Event} event provided by UI5
         */
        onValidation: function (event) {
            var aFieldGroup = event.getParameters().fieldGroupIds;
            if (aFieldGroup.indexOf("transportGroup") > -1) {
                this.onTransportChange();
                event.bCancelBubble = true; //stop bubbling to the parent control
            }
        },

        /**
         * Validate the input values and call the change handler.
         *
         * @param {string} selectedItemId The suggestion item id.
         * @param {string} value Input value to determine if the entered value is not valid or nothing was entered.
         * @return {boolean} True if valid, else false.
         * @private
         */
        validate: function (selectedItemId, value) {
            var oTransportInformationModel = this.getOwnerComponent().getModel("TransportInformation"),
                bIsRequired = oTransportInformationModel.getProperty("/required"),
                bIsAllowed = oTransportInformationModel.getProperty("/transportAllowed"),
                bIsValid = !bIsAllowed || !!selectedItemId;

            if (bIsRequired && !bIsValid) {
                oTransportInformationModel.setProperty("/valueState", ValueState.Error);
            } else if (!bIsRequired && !bIsValid) {
                bIsValid = !value;
                if (bIsValid) {
                    oTransportInformationModel.setProperty("/valueState", ValueState.Information);
                } else {
                    oTransportInformationModel.setProperty("/valueState", ValueState.Error);
                }
            } else {
                oTransportInformationModel.setProperty("/valueState", ValueState.None);
            }
            return bIsValid;
        }
    });
});
},
	"sap/ushell_abap/transport/controller/TransportTable.controller.js":function(){// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/core/SortOrder"
], function (
    Controller,
    Fragment,
    Filter,
    FilterOperator,
    Sorter,
    SortOrder
) {
    "use strict";
    var mAssignedTransportTable = {
            id: "columnAssignedTransportId",
            description: "columnAssignedTransportDescription",
            ownerFullname: "columnAssignedTransportOwner"
    };

    return Controller.extend("sap.ushell_abap.transport.controller.TransportTable.controller", {
        /**
         * Used to save the objectId in case a transport is assigned later
         */
        onInit: function () {
            // Storing as member to have access to the object ID and type later if assign button is pressed
            this.sObjectId = undefined;
            this.sObjectType = undefined;
        },

        /**
         * Used to connect the Controller to the root component
         * @param {sap.ushell_abap.transport.Component} component root component
         */
        connect: function (component) {
            this.oComponent = component;
        },

        /**
         * Reset all Sort Indicator to default  and set the new sort Indicator.
         * @param {string} sorterKey The key of the selected column.
         * @param {boolean} sortDescending The variable of whether it should be sorted in ascending or descending order.
         * @param {$ObjMap} columnIds The column ids of the view definition.
         * @param {sap.m.Column[]} columns The array of all table columns.
         */
        updateSortIndicators: function (sorterKey, sortDescending, columnIds, columns) {
            var oSorteredColumn = this.byId(columnIds[sorterKey]),
                sSorteredColumnId = oSorteredColumn.getId();
            for (var i = 0; i < columns.length; ++i) {
                if (columns[i].getId() === sSorteredColumnId) {
                    oSorteredColumn.setSortIndicator(sortDescending ? SortOrder.Descending : SortOrder.Ascending);
                } else {
                    columns[i].setSortIndicator(SortOrder.None);
                }
            }
        },

        /**
         * Called if the View Seetings Dialog is close and applies sorting on binding.
         * @param {sap.ui.core.Event} event event object passed via UI5 core.
         */
        handleSortDialogConfirm: function (event) {
            var mParams = event.getParameters(),
                sCurrentTableId = "assignedTransportTable",
                oTable = this.byId(sCurrentTableId),
                sPath = mParams.sortItem.getKey(),
                bDescending = mParams.sortDescending,
                oSorter;
            oSorter = new Sorter(sPath, bDescending);
            oTable.getBinding("items").sort(oSorter);
            this.updateSortIndicators(sPath, bDescending, mAssignedTransportTable, oTable.getColumns());
        },

        /**
         * On press of the sort button it load the dialog fragment
         */
        onSort: function () {
            if (this.oViewSettingsDialog) {
                this.oViewSettingsDialog.open();
                return;
            }

            Fragment.load({
                name: "sap.ushell_abap.transport.view.SortDialog",
                controller: this
            }).then(function (oDialog) {
                this.oViewSettingsDialog = oDialog;
                oDialog.setModel(this.oComponent.getModel("i18n"), "i18n");
                oDialog.open();
            }.bind(this));
        },

        /**
         * On press of the Assign button it opens a dialog to a assign a transport
         */
        onAssign: function () {
            if (!this.byId("transportAssignDialog--transportDialog")) {
                Fragment.load({
                    id: this.createId("transportAssignDialog"),
                    name: "sap.ushell_abap.transport.view.TransportDialog",
                    type: "XML",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    this._showTransportDialog(oDialog);
                }.bind(this));
            } else {
                this._showTransportDialog(this.byId("transportAssignDialog--transportDialog"));
            }
        },

        /**
         * Calls reset and showTransport on the transport component, then opens the dialog.
         *
         * @param {sap.ui.core.Control} dialog The dialog control
         * @returns {Promise<undefined>} A promise resolving when reset and showTransport has been called on the transport component.
         * @private
         */
        _showTransportDialog: function (dialog) {
            return this.oComponent.reset().then(function () {
                return this.oComponent.showTransport(null, this.sObjectType).then(function () {
                    this._filterAssignedTransports();
                    dialog.open();
                }.bind(this));
            }.bind(this));
        },

        /**
         * Remove the transports that are already assigned from the /transports property,
         * since they should not be shown in the "Assign" dialog.
         * @private
         */
        _filterAssignedTransports: function () {
            var oTransportInformationModel = this.getView().getModel("TransportInformation");
            var aAssignedTransportIds = this.byId("assignedTransportTable")
                .getBinding("items")
                .getContexts()
                .map(function (item) { return item.getProperty("id"); });

            var aTransports = oTransportInformationModel.getProperty("/transports");
            var aFilteredTransports = aTransports.filter(function (transport) {
                return aAssignedTransportIds.indexOf(transport.id) === -1;
            });
            oTransportInformationModel.setProperty("/transports", aFilteredTransports);
        },

        /**
         * This event will be fired before the Dialog is opened to set the initial state inside the Dialog.
         * @param {sap.ui.base.Event} event provided by UI5
         */
        onBeforeOpen: function (event) {
            var oDialog = event.getSource(),
                oTransportContainer = oDialog.getContent()[0];
            oTransportContainer.setComponent(this.oComponent);
        },

        /**
         * Called when the user hits cancel
         */
        onCancel: function () {
            this.byId("transportAssignDialog--transportDialog").close();
        },

        /**
         * Call the "assignTransport" function import to assign the object to a transport.
         * @param {string} transportId The transportId to assign.
         * @returns {Promise<undefined>} A promise resolving when the request has been completed.
         * @private
         */
        _saveTransportAssignment: function (transportId) {
            return new Promise(function (resolve, reject) {
                this.oComponent.getModel("Transport").callFunction("/assignTransport", {
                    method: "POST",
                    urlParameters: {
                        transportId: transportId,
                        objectId: this.sObjectId,
                        objectType: this.sObjectType
                    },
                    success: resolve,
                    error: reject
                });
            }.bind(this));
        },

        /**
         * Called if the save button on the transport assign dialog is clicked.
         * Validates all fields
         * Retrieves all values and trigger's backend request execution.
         *
         * @private
         */
        onSave: function () {
            var sTransportId = this.oComponent.getModel("TransportInformation").getProperty("/transportId");
            if (sTransportId) {
                this._saveTransportAssignment(sTransportId).then(function () {
                    this.byId("transportAssignDialog--transportDialog").close();
                    this.byId("assignedTransportTable").getBinding("items").refresh(true);
                }.bind(this)).catch(function (response) {
                    sap.ushell.Container.getServiceAsync("Message").then(function (Message) {
                        Message.show(1, response.message, { details: response.responseText });
                    });
                });
            }
        },

        /**
         * Sets the binding of the assigned transport table for a given object id and object type.
         * @param {string} objectId is the page or space ID
         * @param {string}objectType is either a "Page" or a "Space"
         * @param {sap.m.IconTabFilter} iconTabFilter the IconTabFilter the table is added to
         */
        bindItems: function (objectId, objectType, iconTabFilter) {
            var aFilter = [], sTabFilterText;
            aFilter.push(new Filter("objectId", FilterOperator.EQ, objectId));
            aFilter.push(new Filter("objectType", FilterOperator.EQ, objectType));
            this.sObjectId = objectId;
            this.sObjectType = objectType;
            this.byId("assignedTransportTable").bindItems({
                path: "Transport>/assignedTransportSet",
                filters: aFilter,
                sorter: new Sorter("id"),
                template: this.byId("assignedTransportTemplate").clone(),
                events: {
                    dataReceived: function (event) {
                        var aData = event.getParameter && event.getParameter("data"),
                            aResults = aData && aData.results || [];
                        sTabFilterText = this.getView().getModel("i18n").getResourceBundle().getText("IconTabFilterText", [aResults.length.toString()]);
                        iconTabFilter.setText(sTabFilterText);
                    }.bind(this)
                }
            });
            sTabFilterText = this.getView().getModel("i18n").getResourceBundle().getText("IconTabFilterText", ["0"]);
            iconTabFilter.setText(sTabFilterText);
            this.byId("columnAssignedTransportId").setSortIndicator("Ascending");
        }
    });
});
},
	"sap/ushell_abap/transport/i18n/i18n.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# __ldi.translation.uuid=f9ae8208-ced0-4d3f-9c14-4ab34171c284\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=Customizing transport information\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Component to display and validate the fields relevant for customizing transport\n#XFLD: Label for the transport input field\nLabel.Transport=Transport\n#XMSG: Validation message for the transport input field\nMessage.EmptyTransport=Please provide a valid transport. To create transport requests, please use SE09.\n#XCOL: The column heading for the description column\nColumn.Description=Description\n#XCOL: The column heading for the ID column\nColumn.ID=ID\n#XMSG: The Header of the Overflow Toolbar\nMessage.TransportTableOverflowToolbarHeader=Open Transports\n#XCOL: The column heading for the ID column\nAssignedTransportId=ID\n#XCOL: The column heading for the description column\nAssignedTransportDescription=Description\n#XCOL: The column heading for the transport request owner column\nAssignedTransportOwner=Owner\n#XTOL: The sort tooltip for the table\nTooltip.AssignedSortSettingsButton=Sort\n#XBUT: This button sort the list on press\nAssignedSortSettingsButton=Sort\n#XBUT: This button open a MessageBox to add a Transport\nAssignButton=Assign\n#XMSG: The message if the table is empty\nMessage.TransportTableNoData=No assigned transports\n#XTIT: Title for the "Transports" tab with the amount of transports in brakets\nIconTabFilterText=Transports ({0})\n#XTIT: The TransportDialog title\nTransportDialog.Title=Assign Transport Request\n#XBUT: This button close the dialog\nTransportDialog.Button.Cancel=Cancel\n#XBUT: This button add a selected transport\nTransportDialog.Button.Assign=Assign\n#XMSG: In the sort dialog a criterion name for id sorting\nMessage.SortDialogId=ID\n#XMSG: In the sort dialog a criterion name for owner fullname sorting\nMessage.SortDialogOwnerFullname=Owner Fullname\n#XMSG: Message displayed if no transport assignment is allowed\nMessage.TransportNotAllowed=Objects in customer namespaces are not transported within the SAP development landscapes.\n#XMSG: Message displayed if Space / Page ID is already assigned to at least one transport. {0} is the object type (Page/Space)\nMessage.AssignedToTransport={0} ID is already assigned to at least one transport.',
	"sap/ushell_abap/transport/i18n/i18n_ar.properties":'\nTransportInformation.Title=\\u0645\\u0639\\u0644\\u0648\\u0645\\u0627\\u062A \\u0646\\u0642\\u0644 \\u0627\\u0644\\u062A\\u062E\\u0635\\u064A\\u0635\nTransportInformation.Description=\\u0645\\u0643\\u0648\\u0646 \\u0644\\u0639\\u0631\\u0636 \\u0627\\u0644\\u062D\\u0642\\u0648\\u0644 \\u0630\\u0627\\u062A \\u0627\\u0644\\u0635\\u0644\\u0629 \\u0644\\u0646\\u0642\\u0644 \\u0627\\u0644\\u062A\\u062E\\u0635\\u064A\\u0635 \\u0648\\u0627\\u0644\\u062A\\u062D\\u0642\\u0642 \\u0645\\u0646 \\u0635\\u062D\\u062A\\u0647\\u0627\nLabel.Transport=\\u0646\\u0642\\u0644\nMessage.EmptyTransport=\\u064A\\u064F\\u0631\\u062C\\u0649 \\u062A\\u0648\\u0641\\u064A\\u0631 \\u0646\\u0642\\u0644 \\u0635\\u0627\\u0644\\u062D. \\u0644\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0646\\u0642\\u0644\\u060C \\u0627\\u0633\\u062A\\u062E\\u062F\\u0645 SE09.\nColumn.Description=\\u0627\\u0644\\u0648\\u0635\\u0641\nColumn.ID=\\u0627\\u0644\\u0645\\u0639\\u0631\\u0641\nMessage.TransportTableOverflowToolbarHeader=\\u0639\\u0645\\u0644\\u064A\\u0627\\u062A \\u0646\\u0642\\u0644 \\u0645\\u0641\\u062A\\u0648\\u062D\\u0629\nAssignedTransportId=\\u0627\\u0644\\u0645\\u0639\\u0631\\u0641\nAssignedTransportDescription=\\u0627\\u0644\\u0648\\u0635\\u0641\nAssignedTransportOwner=\\u0627\\u0644\\u0645\\u0627\\u0644\\u0643\nTooltip.AssignedSortSettingsButton=\\u062A\\u0631\\u062A\\u064A\\u0628\nAssignedSortSettingsButton=\\u062A\\u0631\\u062A\\u064A\\u0628\nAssignButton=\\u062A\\u0639\\u064A\\u064A\\u0646\nMessage.TransportTableNoData=\\u0644\\u0627 \\u062A\\u0648\\u062C\\u062F \\u0639\\u0645\\u0644\\u064A\\u0627\\u062A \\u0646\\u0642\\u0644 \\u0645\\u0639\\u064A\\u0651\\u064E\\u0646\\u0629\nIconTabFilterText=\\u0639\\u0645\\u0644\\u064A\\u0627\\u062A \\u0627\\u0644\\u0646\\u0642\\u0644 ({0})\nTransportDialog.Title=\\u062A\\u0639\\u064A\\u064A\\u0646 \\u0637\\u0644\\u0628 \\u0646\\u0642\\u0644\nTransportDialog.Button.Cancel=\\u0625\\u0644\\u063A\\u0627\\u0621\nTransportDialog.Button.Assign=\\u062A\\u0639\\u064A\\u064A\\u0646\nMessage.SortDialogId=\\u0627\\u0644\\u0645\\u0639\\u0631\\u0641\nMessage.SortDialogOwnerFullname=\\u0627\\u0644\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0643\\u0627\\u0645\\u0644 \\u0644\\u0644\\u0645\\u0627\\u0644\\u0643\nMessage.TransportNotAllowed=\\u0644\\u0627 \\u064A\\u062A\\u0645 \\u0646\\u0642\\u0644 \\u0627\\u0644\\u0643\\u0627\\u0626\\u0646\\u0627\\u062A \\u0627\\u0644\\u0645\\u0648\\u062C\\u0648\\u062F\\u0629 \\u0641\\u064A \\u0645\\u0633\\u0627\\u062D\\u0627\\u062A \\u0623\\u0633\\u0645\\u0627\\u0621 \\u0627\\u0644\\u0639\\u0645\\u0644\\u0627\\u0621 \\u062F\\u0627\\u062E\\u0644 \\u0627\\u0644\\u0628\\u064F\\u0646\\u0649 \\u0627\\u0644\\u0623\\u0633\\u0627\\u0633\\u064A\\u0629 \\u0644\\u062A\\u0637\\u0648\\u064A\\u0631 SAP.\nMessage.AssignedToTransport=\\u0645\\u0639\\u0631\\u0641 {0} \\u0645\\u0639\\u064A\\u0651\\u064E\\u0646 \\u0628\\u0627\\u0644\\u0641\\u0639\\u0644 \\u0644\\u0646\\u0642\\u0644 \\u0648\\u0627\\u062D\\u062F \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0623\\u0642\\u0644.\n',
	"sap/ushell_abap/transport/i18n/i18n_bg.properties":'\nTransportInformation.Title=\\u0418\\u0437\\u0432\\u044A\\u0440\\u0448\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B\\u0441\\u043A\\u0438 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0437\\u0430 \\u0438\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F \\u0437\\u0430 \\u043F\\u0440\\u0435\\u043D\\u043E\\u0441\nTransportInformation.Description=\\u041A\\u043E\\u043C\\u043F\\u043E\\u043D\\u0435\\u043D\\u0442 \\u0437\\u0430 \\u043F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u0438 \\u043F\\u0440\\u043E\\u0432\\u0435\\u0440\\u043A\\u0430 \\u043D\\u0430 \\u043F\\u043E\\u043B\\u0435\\u0442\\u0430, \\u0440\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u043D\\u0438 \\u0437\\u0430 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B\\u0441\\u043A\\u0438 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u043D\\u0430 \\u043F\\u0440\\u0435\\u043D\\u043E\\u0441\nLabel.Transport=\\u041F\\u0440\\u0435\\u043D\\u043E\\u0441\nMessage.EmptyTransport=\\u041C\\u043E\\u043B\\u044F, \\u043E\\u0441\\u0438\\u0433\\u0443\\u0440\\u0435\\u0442\\u0435 \\u0432\\u0430\\u043B\\u0438\\u0434\\u0435\\u043D \\u043F\\u0440\\u0435\\u043D\\u043E\\u0441. \\u0417\\u0430 \\u0434\\u0430 \\u0441\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u0442\\u0435 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438 \\u0437\\u0430 \\u043F\\u0440\\u0435\\u043D\\u043E\\u0441, \\u0438\\u0437\\u043F\\u043E\\u043B\\u0437\\u0432\\u0430\\u0439\\u0442\\u0435 SE09.\nColumn.Description=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\nColumn.ID=\\u0418\\u0414\nMessage.TransportTableOverflowToolbarHeader=\\u041E\\u0442\\u043A\\u0440\\u0438\\u0442\\u0438 \\u0442\\u0440\\u0430\\u043D\\u0441\\u043F\\u043E\\u0440\\u0442\\u0438\\u0440\\u0430\\u043D\\u0438\\u044F\nAssignedTransportId=\\u0418\\u0414\nAssignedTransportDescription=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\nAssignedTransportOwner=\\u0421\\u043E\\u0431\\u0441\\u0442\\u0432\\u0435\\u043D\\u0438\\u043A\nTooltip.AssignedSortSettingsButton=\\u0421\\u043E\\u0440\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435\nAssignedSortSettingsButton=\\u0421\\u043E\\u0440\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435\nAssignButton=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0435\nMessage.TransportTableNoData=\\u041D\\u044F\\u043C\\u0430 \\u043F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u0438 \\u0442\\u0440\\u0430\\u043D\\u0441\\u043F\\u043E\\u0440\\u0442\\u0438\\u0440\\u0430\\u043D\\u0438\\u044F\nIconTabFilterText=\\u0422\\u0440\\u0430\\u043D\\u0441\\u043F\\u043E\\u0440\\u0442\\u0438\\u0440\\u0430\\u043D\\u0438\\u044F ({0})\nTransportDialog.Title=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043F\\u0440\\u0435\\u043D\\u043E\\u0441\nTransportDialog.Button.Cancel=\\u041E\\u0442\\u043C\\u044F\\u043D\\u0430\nTransportDialog.Button.Assign=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0435\nMessage.SortDialogId=\\u0418\\u0414\nMessage.SortDialogOwnerFullname=\\u041F\\u044A\\u043B\\u043D\\u043E \\u0438\\u043C\\u0435 \\u043D\\u0430 \\u0441\\u043E\\u0431\\u0441\\u0442\\u0432\\u0435\\u043D\\u0438\\u043A\nMessage.TransportNotAllowed=\\u041E\\u0431\\u0435\\u043A\\u0442\\u0438 \\u0432 \\u043E\\u0431\\u043B\\u0430\\u0441\\u0442\\u0438 \\u0438\\u043C\\u0435\\u043D\\u0430 \\u043D\\u0430 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0438 \\u043D\\u0435 \\u0441\\u0435 \\u043F\\u0440\\u0435\\u043D\\u0430\\u0441\\u044F\\u0442 \\u0432 \\u0440\\u0430\\u043C\\u043A\\u0438\\u0442\\u0435 \\u043D\\u0430 \\u0438\\u043D\\u0444\\u0440\\u0430\\u0441\\u0442\\u0440\\u0443\\u043A\\u0442\\u0443\\u0440\\u0438 \\u043D\\u0430 \\u0440\\u0430\\u0437\\u0440\\u0430\\u0431\\u043E\\u0442\\u043A\\u0430 \\u043D\\u0430 SAP.\nMessage.AssignedToTransport={0} \\u0418\\u0414 \\u0432\\u0435\\u0447\\u0435 \\u0435 \\u043F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D \\u043A\\u044A\\u043C \\u043F\\u043E\\u043D\\u0435 \\u0435\\u0434\\u0438\\u043D \\u043F\\u0440\\u0435\\u043D\\u043E\\u0441.\n',
	"sap/ushell_abap/transport/i18n/i18n_ca.properties":'\nTransportInformation.Title=Informaci\\u00F3 de transport de Customizing\nTransportInformation.Description=Component per visualitzar i validar els camps rellevants per al transport de Customizing\nLabel.Transport=Transportar\nMessage.EmptyTransport=Indiqueu un transport v\\u00E0lid. Per crear sol\\u00B7licituds de transport, utilitzeu SE09.\nColumn.Description=Descripci\\u00F3\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Obrir transports\nAssignedTransportId=ID\nAssignedTransportDescription=Descripci\\u00F3\nAssignedTransportOwner=Propietari\nTooltip.AssignedSortSettingsButton=Classificar\nAssignedSortSettingsButton=Classificar\nAssignButton=Assignar\nMessage.TransportTableNoData=Cap transport assignat\nIconTabFilterText=Transports ({0})\nTransportDialog.Title=Assignar ordre de transport\nTransportDialog.Button.Cancel=Cancel\\u00B7lar\nTransportDialog.Button.Assign=Assignar\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Nom complet del propietari\nMessage.TransportNotAllowed=Els objectes a les \\u00E0rees de noms de client no es transporten a l\'infraestructura de desenvolupament de SAP.\nMessage.AssignedToTransport=L\'\'ID {0} ja est\\u00E0 assignat a com a m\\u00EDnim un transport.\n',
	"sap/ushell_abap/transport/i18n/i18n_cs.properties":'\nTransportInformation.Title=Informace o transportu customizingu\nTransportInformation.Description=Komponenta pro zobrazen\\u00ED a ov\\u011B\\u0159en\\u00ED pol\\u00ED relevantn\\u00EDch pro transport customizingu\nLabel.Transport=Transport\nMessage.EmptyTransport=Zadejte platn\\u00FD transport. Pro vytvo\\u0159en\\u00ED po\\u017Eadavk\\u016F na transport pou\\u017Eijte SE09.\nColumn.Description=Popis\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Otev\\u0159en\\u00E9 transporty\nAssignedTransportId=ID\nAssignedTransportDescription=Popis\nAssignedTransportOwner=Vlastn\\u00EDk\nTooltip.AssignedSortSettingsButton=T\\u0159\\u00EDdit\nAssignedSortSettingsButton=T\\u0159\\u00EDdit\nAssignButton=P\\u0159i\\u0159adit\nMessage.TransportTableNoData=\\u017D\\u00E1dn\\u00E9 p\\u0159i\\u0159azen\\u00E9 transporty\nIconTabFilterText=Transporty ({0})\nTransportDialog.Title=P\\u0159i\\u0159azen\\u00ED transportn\\u00EDho po\\u017Eadavku\nTransportDialog.Button.Cancel=Zru\\u0161it\nTransportDialog.Button.Assign=P\\u0159i\\u0159adit\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Cel\\u00E9 jm\\u00E9no vlastn\\u00EDka\nMessage.TransportNotAllowed=Objekty v rozsahu n\\u00E1zv\\u016F z\\u00E1kazn\\u00EDka nejsou transportov\\u00E1ny v r\\u00E1mci v\\u00FDvojov\\u00E9 infrastruktury SAP.\nMessage.AssignedToTransport=ID {0} je ji\\u017E p\\u0159i\\u0159azeno k alespo\\u0148 jednomu transportu.\n',
	"sap/ushell_abap/transport/i18n/i18n_da.properties":'\nTransportInformation.Title=Customizing-transportinformation\nTransportInformation.Description=Komponent til at vise og validere de felter, der er relevante for customizing-transport\nLabel.Transport=Transport\nMessage.EmptyTransport=Angiv en gyldig transport. Anvend SE09 til at oprette transportordrer.\nColumn.Description=Beskrivelse\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=\\u00C5bne transporter\nAssignedTransportId=ID\nAssignedTransportDescription=Beskrivelse\nAssignedTransportOwner=Ejer\nTooltip.AssignedSortSettingsButton=Sort\\u00E9r\nAssignedSortSettingsButton=Sort\\u00E9r\nAssignButton=Alloker\nMessage.TransportTableNoData=Ingen allokerede transporter\nIconTabFilterText=Transporter ({0})\nTransportDialog.Title=Alloker transportordre\nTransportDialog.Button.Cancel=Afbryd\nTransportDialog.Button.Assign=Alloker\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Fulde navn p\\u00E5 ejer\nMessage.TransportNotAllowed=Objekter i kundenavneomr\\u00E5der transporteres ikke inden for SAP-udviklingslandskaber.\nMessage.AssignedToTransport={0} ID er allerede allokeret til mindst \\u00E9n transport.\n',
	"sap/ushell_abap/transport/i18n/i18n_de.properties":'\nTransportInformation.Title=Customizing-Transportinformationen\nTransportInformation.Description=Komponente f\\u00FCr die Anzeige und Validierung der Felder, die f\\u00FCr den Customizing-Transport relevant sind\nLabel.Transport=Transport\nMessage.EmptyTransport=Bitte geben Sie einen g\\u00FCltigen Transport an. Verwenden Sie SE09 f\\u00FCr das Anlegen von Transportauftr\\u00E4gen.\nColumn.Description=Beschreibung\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Offene Transporte\nAssignedTransportId=ID\nAssignedTransportDescription=Beschreibung\nAssignedTransportOwner=Inhaber\nTooltip.AssignedSortSettingsButton=Sortieren\nAssignedSortSettingsButton=Sortieren\nAssignButton=Zuordnen\nMessage.TransportTableNoData=Keine zugeordneten Transporte\nIconTabFilterText=Transporte ({0})\nTransportDialog.Title=Transportauftrag zuordnen\nTransportDialog.Button.Cancel=Abbrechen\nTransportDialog.Button.Assign=Zuordnen\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Vollst\\u00E4ndiger Name des Inhabers\nMessage.TransportNotAllowed=Objekte in benutzerdefinierten Namenr\\u00E4umen werden nicht innerhalb der SAP-Entwicklungslandschaften transportiert.\nMessage.AssignedToTransport={0}-ID ist bereits mindestens einem Transport zugewiesen.\n',
	"sap/ushell_abap/transport/i18n/i18n_el.properties":'\nTransportInformation.Title=\\u03A0\\u03BB\\u03B7\\u03C1\\u03BF\\u03C6\\u03BF\\u03C1\\u03AF\\u03B5\\u03C2 \\u03B3\\u03B9\\u03B1 \\u039C\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC \\u03A0\\u03B1\\u03C1\\u03B1\\u03BC\\u03B5\\u03C4\\u03C1\\u03BF\\u03C0\\u03BF\\u03AF\\u03B7\\u03C3\\u03B7\\u03C2\nTransportInformation.Description=\\u03A3\\u03C5\\u03C3\\u03C4\\u03B1\\u03C4\\u03B9\\u03BA\\u03CC \\u03B3\\u03B9\\u03B1 \\u03B5\\u03BC\\u03C6\\u03AC\\u03BD\\u03B9\\u03C3\\u03B7 \\u03BA\\u03B1\\u03B9 \\u03B5\\u03C0\\u03B1\\u03BB\\u03AE\\u03B8\\u03B5\\u03C5\\u03C3\\u03B7 \\u03C0\\u03B5\\u03B4\\u03AF\\u03C9\\u03BD \\u03C3\\u03C7\\u03B5\\u03C4\\u03B9\\u03BA\\u03CE\\u03BD \\u03BC\\u03B5 \\u03BC\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC \\u03C0\\u03B1\\u03C1\\u03B1\\u03BC\\u03B5\\u03C4\\u03C1\\u03BF\\u03C0\\u03BF\\u03AF\\u03B7\\u03C3\\u03B7\\u03C2\nLabel.Transport=\\u039C\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC\nMessage.EmptyTransport=\\u039A\\u03B1\\u03B8\\u03BF\\u03C1\\u03AF\\u03C3\\u03C4\\u03B5 \\u03AD\\u03B3\\u03BA\\u03C5\\u03C1\\u03B7 \\u03BC\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC. \\u0393\\u03B9\\u03B1 \\u03BD\\u03B1 \\u03B4\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AE\\u03C3\\u03B5\\u03C4\\u03B5 \\u03B1\\u03B9\\u03C4\\u03AE\\u03C3\\u03B5\\u03B9\\u03C2 \\u03BC\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC\\u03C2, \\u03C7\\u03C1\\u03B7\\u03C3\\u03B9\\u03BC\\u03BF\\u03C0\\u03BF\\u03B9\\u03AE\\u03C3\\u03C4\\u03B5 \\u03C4\\u03B7\\u03BD SE09.\nColumn.Description=\\u03A0\\u03B5\\u03C1\\u03B9\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=\\u0391\\u03BD\\u03BF\\u03B9\\u03BA\\u03C4\\u03AD\\u03C2 \\u039C\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AD\\u03C2\nAssignedTransportId=ID\nAssignedTransportDescription=\\u03A0\\u03B5\\u03C1\\u03B9\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\nAssignedTransportOwner=\\u039A\\u03AC\\u03C4\\u03BF\\u03C7\\u03BF\\u03C2\nTooltip.AssignedSortSettingsButton=\\u03A4\\u03B1\\u03BE\\u03B9\\u03BD\\u03CC\\u03BC\\u03B7\\u03C3\\u03B7\nAssignedSortSettingsButton=\\u03A4\\u03B1\\u03BE\\u03B9\\u03BD\\u03CC\\u03BC\\u03B7\\u03C3\\u03B7\nAssignButton=\\u0391\\u03BD\\u03C4\\u03B9\\u03C3\\u03C4.\nMessage.TransportTableNoData=\\u039C\\u03B7 \\u03B1\\u03BD\\u03C4\\u03B9\\u03C3\\u03C4\\u03BF\\u03B9\\u03C7\\u03B9\\u03C3\\u03BC\\u03AD\\u03BD\\u03B5\\u03C2 \\u03BC\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AD\\u03C2\nIconTabFilterText=\\u039C\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AD\\u03C2 ({0})\nTransportDialog.Title=\\u0391\\u03BD\\u03C4\\u03B9\\u03C3\\u03C4\\u03BF\\u03AF\\u03C7\\u03B9\\u03C3\\u03B7 \\u0391\\u03AF\\u03C4\\u03B7\\u03C3\\u03B7\\u03C2 \\u039C\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC\\u03C2\nTransportDialog.Button.Cancel=\\u0391\\u03BA\\u03CD\\u03C1\\u03C9\\u03C3\\u03B7\nTransportDialog.Button.Assign=\\u0391\\u03BD\\u03C4\\u03B9\\u03C3\\u03C4.\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=\\u039F\\u03BD\\u03BF\\u03BC\\u03B1\\u03C4\\u03B5\\u03C0\\u03CE\\u03BD\\u03C5\\u03BC\\u03BF \\u03BA\\u03B1\\u03C4\\u03CC\\u03C7\\u03BF\\u03C5\nMessage.TransportNotAllowed=\\u0391\\u03BD\\u03C4\\u03B9\\u03BA\\u03B5\\u03AF\\u03BC\\u03B5\\u03BD\\u03B1 \\u03C3\\u03B5 \\u03C7\\u03CE\\u03C1\\u03BF\\u03C5\\u03C2 \\u03BF\\u03BD\\u03CC\\u03BC\\u03C4\\u03BF\\u03C2 \\u03C0\\u03B5\\u03BB\\u03AC\\u03C4\\u03B7 \\u03B4\\u03B5\\u03BD \\u03BC\\u03B5\\u03C4\\u03B1\\u03C6\\u03AD\\u03C1\\u03BF\\u03BD\\u03C4\\u03B1\\u03B9 \\u03B5\\u03BD\\u03C4\\u03CC\\u03C2 \\u03C4\\u03C9\\u03BD \\u03C4\\u03BF\\u03C0\\u03AF\\u03C9\\u03BD \\u03B1\\u03BD\\u03AC\\u03C0\\u03C4\\u03C5\\u03BE\\u03B7\\u03C2 SAP.\nMessage.AssignedToTransport={0} ID \\u03B1\\u03BD\\u03C4\\u03B9\\u03C3\\u03C4\\u03BF\\u03B9\\u03C7\\u03AF\\u03B6\\u03B5\\u03C4\\u03B1\\u03B9 \\u03AE\\u03B4\\u03B7 \\u03BC\\u03B5 \\u03C4\\u03BF\\u03C5\\u03BB\\u03AC\\u03C7\\u03B9\\u03C3\\u03C4\\u03BF\\u03BD \\u03BC\\u03AF\\u03B1 \\u03BC\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC.\n',
	"sap/ushell_abap/transport/i18n/i18n_en.properties":'\nTransportInformation.Title=Customizing Transport Information\nTransportInformation.Description=Component to display and validate the fields relevant for customizing transport\nLabel.Transport=Transport\nMessage.EmptyTransport=Please provide a valid transport. To create transport requests, use SE09.\nColumn.Description=Description\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Open Transports\nAssignedTransportId=ID\nAssignedTransportDescription=Description\nAssignedTransportOwner=Owner\nTooltip.AssignedSortSettingsButton=Sort\nAssignedSortSettingsButton=Sort\nAssignButton=Assign\nMessage.TransportTableNoData=No assigned transports\nIconTabFilterText=Transports ({0})\nTransportDialog.Title=Assign Transport Request\nTransportDialog.Button.Cancel=Cancel\nTransportDialog.Button.Assign=Assign\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Full name of owner\nMessage.TransportNotAllowed=Objects in customer namespaces are not transported within SAP development landscapes.\nMessage.AssignedToTransport={0} ID is already assigned to at least one transport.\n',
	"sap/ushell_abap/transport/i18n/i18n_en_GB.properties":'\nTransportInformation.Title=Customising Transport Information\nTransportInformation.Description=Component to display and validate the fields relevant for customising transport\nLabel.Transport=Transport\nMessage.EmptyTransport=Please provide a valid transport. To create transport requests, use SE09.\nColumn.Description=Description\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Open Transports\nAssignedTransportId=ID\nAssignedTransportDescription=Description\nAssignedTransportOwner=Owner\nTooltip.AssignedSortSettingsButton=Sort\nAssignedSortSettingsButton=Sort\nAssignButton=Assign\nMessage.TransportTableNoData=No assigned transports\nIconTabFilterText=Transports ({0})\nTransportDialog.Title=Assign Transport Request\nTransportDialog.Button.Cancel=Cancel\nTransportDialog.Button.Assign=Assign\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Full name of owner\nMessage.TransportNotAllowed=Objects in customer namespaces are not transported within SAP development landscapes.\nMessage.AssignedToTransport={0} ID is already assigned to at least one transport.\n',
	"sap/ushell_abap/transport/i18n/i18n_en_US_sappsd.properties":'\nTransportInformation.Title=[[[\\u0108\\u0171\\u015F\\u0163\\u014F\\u0271\\u012F\\u017E\\u012F\\u014B\\u011F \\u0163\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163 \\u012F\\u014B\\u0192\\u014F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nTransportInformation.Description=[[[\\u0108\\u014F\\u0271\\u03C1\\u014F\\u014B\\u0113\\u014B\\u0163 \\u0163\\u014F \\u018C\\u012F\\u015F\\u03C1\\u013A\\u0105\\u0177 \\u0105\\u014B\\u018C \\u028B\\u0105\\u013A\\u012F\\u018C\\u0105\\u0163\\u0113 \\u0163\\u0125\\u0113 \\u0192\\u012F\\u0113\\u013A\\u018C\\u015F \\u0157\\u0113\\u013A\\u0113\\u028B\\u0105\\u014B\\u0163 \\u0192\\u014F\\u0157 \\u010B\\u0171\\u015F\\u0163\\u014F\\u0271\\u012F\\u017E\\u012F\\u014B\\u011F \\u0163\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nLabel.Transport=[[[\\u0162\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nMessage.EmptyTransport=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u03C1\\u0157\\u014F\\u028B\\u012F\\u018C\\u0113 \\u0105 \\u028B\\u0105\\u013A\\u012F\\u018C \\u0163\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163. \\u0162\\u014F \\u010B\\u0157\\u0113\\u0105\\u0163\\u0113 \\u0163\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F, \\u03C1\\u013A\\u0113\\u0105\\u015F\\u0113 \\u0171\\u015F\\u0113 \\u015C\\u011409.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nColumn.Description=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nColumn.ID=[[[\\u012C\\u010E\\u2219\\u2219]]]\nMessage.TransportTableOverflowToolbarHeader=[[[\\u014E\\u03C1\\u0113\\u014B \\u0162\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219]]]\nAssignedTransportId=[[[\\u012C\\u010E\\u2219\\u2219]]]\nAssignedTransportDescription=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nAssignedTransportOwner=[[[\\u014E\\u0175\\u014B\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nTooltip.AssignedSortSettingsButton=[[[\\u015C\\u014F\\u0157\\u0163]]]\nAssignedSortSettingsButton=[[[\\u015C\\u014F\\u0157\\u0163]]]\nAssignButton=[[[\\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nMessage.TransportTableNoData=[[[\\u0143\\u014F \\u0105\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C \\u0163\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nIconTabFilterText=[[[\\u0162\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163\\u015F ({0})]]]\nTransportDialog.Title=[[[\\u0100\\u015F\\u015F\\u012F\\u011F\\u014B \\u0162\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nTransportDialog.Button.Cancel=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nTransportDialog.Button.Assign=[[[\\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nMessage.SortDialogId=[[[\\u012C\\u010E\\u2219\\u2219]]]\nMessage.SortDialogOwnerFullname=[[[\\u014E\\u0175\\u014B\\u0113\\u0157 \\u0191\\u0171\\u013A\\u013A\\u014B\\u0105\\u0271\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nMessage.TransportNotAllowed=[[[\\u014E\\u0183\\u0135\\u0113\\u010B\\u0163\\u015F \\u012F\\u014B \\u010B\\u0171\\u015F\\u0163\\u014F\\u0271\\u0113\\u0157 \\u014B\\u0105\\u0271\\u0113\\u015F\\u03C1\\u0105\\u010B\\u0113\\u015F \\u0105\\u0157\\u0113 \\u014B\\u014F\\u0163 \\u0163\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163\\u0113\\u018C \\u0175\\u012F\\u0163\\u0125\\u012F\\u014B \\u0163\\u0125\\u0113 \\u015C\\u0100\\u01A4 \\u018C\\u0113\\u028B\\u0113\\u013A\\u014F\\u03C1\\u0271\\u0113\\u014B\\u0163 \\u013A\\u0105\\u014B\\u018C\\u015F\\u010B\\u0105\\u03C1\\u0113\\u015F.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nMessage.AssignedToTransport=[[[{0} \\u012C\\u010E \\u012F\\u015F \\u0105\\u013A\\u0157\\u0113\\u0105\\u018C\\u0177 \\u0105\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C \\u0163\\u014F \\u0105\\u0163 \\u013A\\u0113\\u0105\\u015F\\u0163 \\u014F\\u014B\\u0113 \\u0163\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163.]]]\n',
	"sap/ushell_abap/transport/i18n/i18n_en_US_saptrc.properties":'\nTransportInformation.Title=Qzmbr5dyEM/FO0RtvxLU5g_Customizing transport information\nTransportInformation.Description=+C5UV6J5a5hnODw5vwby0g_Component to display and validate the fields relevant for customizing transport\nLabel.Transport=D7tGxs+N9JJTdOoOmocGAA_Transport\nMessage.EmptyTransport=sdfxMgBDWMTd7mDlfQ26Hw_Please provide a valid transport. To create transport requests, please use SE09.\nColumn.Description=ptD9MuakT6Un/DUG/RdPfQ_Description\nColumn.ID=DJUw1fpgclOOR88vUb+JaA_ID\nMessage.TransportTableOverflowToolbarHeader=RDMClH+mJPps8NvyyW0MxA_Open Transports\nAssignedTransportId=Y5F5nQpDuPrKgbJWFB20rQ_ID\nAssignedTransportDescription=7mnMo1/cWm5Ho9m5I6RVaw_Description\nAssignedTransportOwner=ToNtDuxLWuGUPkQQgP9Opw_Owner\nTooltip.AssignedSortSettingsButton=N79kmIjM4vE+j1kBSbyaDQ_Sort\nAssignedSortSettingsButton=OAXk0ANRq0xaGIp/qmTTDw_Sort\nAssignButton=RW07AWC8tRT3/FFTWvbLaA_Assign\nMessage.TransportTableNoData=2wM5TaVg+9kGz01+Ipg1lA_No assigned transports\nIconTabFilterText=yJtwysI+xXATl8f62EA5XA_Transports ({0})\nTransportDialog.Title=GuFdVj9ryG+Tex/mVhqNig_Assign Transport Request\nTransportDialog.Button.Cancel=/WjkGb1OYNEB9wfLjtoy8A_Cancel\nTransportDialog.Button.Assign=1doPVDDAJ1iTxoeOR8Wk5g_Assign\nMessage.SortDialogId=p3/s2nRQf+9BtVa5TWSacQ_ID\nMessage.SortDialogOwnerFullname=4NYQsrFhJl3FpgB6qxYiQg_Owner Fullname\nMessage.TransportNotAllowed=GjxcWIj29KMFHxfpGHb1LQ_Objects in customer namespaces are not transported within the SAP development landscapes.\nMessage.AssignedToTransport=aFuxGYL5R0OhkTqoC+m1tg_{0} ID is already assigned to at least one transport.\n',
	"sap/ushell_abap/transport/i18n/i18n_es.properties":'\nTransportInformation.Title=Informaci\\u00F3n de transporte de Customizing\nTransportInformation.Description=Componente para mostrar y validar los campos relevantes para el transporte de Customizing\nLabel.Transport=Transportar\nMessage.EmptyTransport=Indique un transporte v\\u00E1lido. Para crear solicitudes de transporte, utilice SE09.\nColumn.Description=Descripci\\u00F3n\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Abrir transportes\nAssignedTransportId=ID\nAssignedTransportDescription=Descripci\\u00F3n\nAssignedTransportOwner=Propietario\nTooltip.AssignedSortSettingsButton=Clasificar\nAssignedSortSettingsButton=Clasificar\nAssignButton=Asignar\nMessage.TransportTableNoData=Ning\\u00FAn transporte asignado\nIconTabFilterText=Transportes ({0})\nTransportDialog.Title=Asignar orden de transporte\nTransportDialog.Button.Cancel=Cancelar\nTransportDialog.Button.Assign=Asignar\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Nombre completo del propietario\nMessage.TransportNotAllowed=Los objetos en las \\u00E1reas de nombres de cliente no se transportan a la infraestructura de desarrollo de SAP.\nMessage.AssignedToTransport=ID {0} ya est\\u00E1 asignado a como m\\u00EDnimo un transporte.\n',
	"sap/ushell_abap/transport/i18n/i18n_es_MX.properties":'\nTransportInformation.Title=Personalizaci\\u00F3n de la informaci\\u00F3n de transporte\nTransportInformation.Description=Componente para visualizar y validar los campos relevantes para la personalizaci\\u00F3n del transporte\nLabel.Transport=Transporte\nMessage.EmptyTransport=Proporcione un transporte v\\u00E1lido. Para crear solicitudes de transporte, use SE09.\nColumn.Description=Descripci\\u00F3n\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Abrir transportes\nAssignedTransportId=ID\nAssignedTransportDescription=Descripci\\u00F3n\nAssignedTransportOwner=Propietario\nTooltip.AssignedSortSettingsButton=Clasificar\nAssignedSortSettingsButton=Clasificar\nAssignButton=Asignar\nMessage.TransportTableNoData=No hay transportes asignados\nIconTabFilterText=Transportes ({0})\nTransportDialog.Title=Agregar solicitud de transporte\nTransportDialog.Button.Cancel=Cancelar\nTransportDialog.Button.Assign=Asignar\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Nombre completo del propietario\nMessage.TransportNotAllowed=Los objetos en los espacios de nombre del cliente no se transportan dentro de entornos de desarrollo de SAP.\nMessage.AssignedToTransport=El ID {0} ya est\\u00E1 asignado a al menos un transporte.\n',
	"sap/ushell_abap/transport/i18n/i18n_et.properties":'\nTransportInformation.Title=Seadistuse transporditeave\nTransportInformation.Description=Komponent seadistuse transpordi jaoks n\\u00F5utavate v\\u00E4ljade kuvamiseks ja valideerimiseks\nLabel.Transport=Transpordi\nMessage.EmptyTransport=Pakkuge sobiv transport. Transporditaotluste loomiseks kasutage toimingut SE09.\nColumn.Description=Kirjeldus\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Avage transpordid\nAssignedTransportId=ID\nAssignedTransportDescription=Kirjeldus\nAssignedTransportOwner=Omanik\nTooltip.AssignedSortSettingsButton=Sordi\nAssignedSortSettingsButton=Sordi\nAssignButton=M\\u00E4\\u00E4ra\nMessage.TransportTableNoData=M\\u00E4\\u00E4ratud transporte pole\nIconTabFilterText=Transpordid ({0})\nTransportDialog.Title=M\\u00E4\\u00E4ra transporditaotlus\nTransportDialog.Button.Cancel=T\\u00FChista\nTransportDialog.Button.Assign=M\\u00E4\\u00E4ra\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Omaniku t\\u00E4isnimi\nMessage.TransportNotAllowed=Kliendi nimeruumides asuvaid objekte ei transpordita SAP-i arenduskeskkondades.\nMessage.AssignedToTransport={0} ID on juba m\\u00E4\\u00E4ratud v\\u00E4hemalt \\u00FChele transpordile.\n',
	"sap/ushell_abap/transport/i18n/i18n_fi.properties":'\nTransportInformation.Title=Mukautuksen siirtotiedot\nTransportInformation.Description=Komponentti mukautuksen siirrolle relevanttien kenttien n\\u00E4ytt\\u00E4mist\\u00E4 ja validointia varten\nLabel.Transport=Siirto\nMessage.EmptyTransport=Anna kelpaava siirto. K\\u00E4yt\\u00E4 SE09\\:\\u00E4\\u00E4 siirtotilausten luontiin.\nColumn.Description=Kuvaus\nColumn.ID=Tunnus\nMessage.TransportTableOverflowToolbarHeader=Avoimet siirrot\nAssignedTransportId=Tunnus\nAssignedTransportDescription=Kuvaus\nAssignedTransportOwner=Omistaja\nTooltip.AssignedSortSettingsButton=Lajittele\nAssignedSortSettingsButton=Lajittele\nAssignButton=Kohdista\nMessage.TransportTableNoData=Ei kohdistettuja siirtoja\nIconTabFilterText=Siirrot ({0})\nTransportDialog.Title=Kohdista siirtotilaus\nTransportDialog.Button.Cancel=Peruuta\nTransportDialog.Button.Assign=Kohdista\nMessage.SortDialogId=Tunnus\nMessage.SortDialogOwnerFullname=Omistajan t\\u00E4ydellinen nimi\nMessage.TransportNotAllowed=Objekteja asiakkaan nimialueilla ei siirret\\u00E4 SAP\\:n kehitysinfrastruktuurien sis\\u00E4ll\\u00E4.\nMessage.AssignedToTransport={0}-tunnus on jo kohdistettu v\\u00E4hint\\u00E4\\u00E4n yhteen siirtoon.\n',
	"sap/ushell_abap/transport/i18n/i18n_fr.properties":'\nTransportInformation.Title=Informations sur le transport de customizing\nTransportInformation.Description=Composante permettant d\'afficher et de valider les zones concernant le transport de customizing.\nLabel.Transport=Transport\nMessage.EmptyTransport=Indiquez un transport valide. Pour cr\\u00E9er des ordres de transports, utilisez la transaction SE09.\nColumn.Description=Description\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Transports en cours\nAssignedTransportId=ID\nAssignedTransportDescription=Description\nAssignedTransportOwner=Responsable\nTooltip.AssignedSortSettingsButton=Trier\nAssignedSortSettingsButton=Trier\nAssignButton=Affecter\nMessage.TransportTableNoData=Aucun transport affect\\u00E9\nIconTabFilterText=Transports ({0})\nTransportDialog.Title=Affecter ordre de transport\nTransportDialog.Button.Cancel=Interrompre\nTransportDialog.Button.Assign=Affecter\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Nom complet du titulaire\nMessage.TransportNotAllowed=Les objets des espaces noms client ne sont pas transport\\u00E9s dans les infrastructures de d\\u00E9veloppement SAP.\nMessage.AssignedToTransport={0} ID d\\u00E9j\\u00E0 affect\\u00E9 \\u00E0 au moins un transport\n',
	"sap/ushell_abap/transport/i18n/i18n_hi.properties":'\nTransportInformation.Title=\\u092A\\u0930\\u093F\\u0935\\u0939\\u0928 \\u091C\\u093E\\u0928\\u0915\\u093E\\u0930\\u0940 \\u0915\\u094B \\u0915\\u0938\\u094D\\u091F\\u092E\\u093E\\u0907\\u091C\\u093C \\u0915\\u0930\\u0928\\u093E\nTransportInformation.Description=\\u0915\\u0938\\u094D\\u091F\\u092E\\u093E\\u0907\\u091C\\u093C\\u093F\\u0902\\u0917 \\u091F\\u094D\\u0930\\u093E\\u0902\\u0938\\u092A\\u094B\\u0930\\u094D\\u091F \\u0915\\u0947 \\u0932\\u093F\\u090F \\u092A\\u094D\\u0930\\u093E\\u0938\\u0902\\u0917\\u093F\\u0915 \\u092B\\u093C\\u0940\\u0932\\u094D\\u0921 \\u092A\\u094D\\u0930\\u0926\\u0930\\u094D\\u0936\\u093F\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092E\\u093E\\u0928\\u094D\\u092F \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0918\\u091F\\u0915\nLabel.Transport=\\u092A\\u0930\\u093F\\u0935\\u0939\\u0928\nMessage.EmptyTransport=\\u0915\\u0943\\u092A\\u092F\\u093E \\u090F\\u0915 \\u0935\\u0948\\u0927 \\u092A\\u0930\\u093F\\u0935\\u0939\\u0928 \\u092A\\u094D\\u0930\\u0926\\u093E\\u0928 \\u0915\\u0930\\u0947\\u0902. \\u092A\\u0930\\u093F\\u0935\\u0939\\u0928 \\u0905\\u0928\\u0941\\u0930\\u094B\\u0927 \\u092C\\u0928\\u093E\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093F\\u090F, SE09 \\u0915\\u093E \\u0909\\u092A\\u092F\\u094B\\u0917 \\u0915\\u0930\\u0947\\u0902.\nColumn.Description=\\u0935\\u0930\\u094D\\u0923\\u0928\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=\\u0913\\u092A\\u0928 \\u091F\\u094D\\u0930\\u093E\\u0902\\u0938\\u092A\\u094B\\u0930\\u094D\\u091F\nAssignedTransportId=ID\nAssignedTransportDescription=\\u0935\\u0930\\u094D\\u0923\\u0928\nAssignedTransportOwner=\\u092E\\u093E\\u0932\\u093F\\u0915\nTooltip.AssignedSortSettingsButton=\\u0915\\u094D\\u0930\\u092E\\u093F\\u0924 \\u0915\\u0930\\u0947\\u0902\nAssignedSortSettingsButton=\\u0915\\u094D\\u0930\\u092E\\u093F\\u0924 \\u0915\\u0930\\u0947\\u0902\nAssignButton=\\u0905\\u0938\\u093E\\u0907\\u0928 \\u0915\\u0930\\u0947\\u0902\nMessage.TransportTableNoData=\\u0915\\u094B\\u0908 \\u0905\\u0938\\u093E\\u0907\\u0928 \\u0915\\u093F\\u092F\\u093E \\u0939\\u0941\\u0906 \\u091F\\u094D\\u0930\\u093E\\u0902\\u0938\\u092A\\u094B\\u0930\\u094D\\u091F \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948\nIconTabFilterText=\\u091F\\u094D\\u0930\\u093E\\u0902\\u0938\\u092A\\u094B\\u0930\\u094D\\u091F ({0})\nTransportDialog.Title=\\u092A\\u0930\\u093F\\u0935\\u0939\\u0928 \\u0905\\u0928\\u0941\\u0930\\u094B\\u0927 \\u0905\\u0938\\u093E\\u0907\\u0928 \\u0915\\u0930\\u0947\\u0902\nTransportDialog.Button.Cancel=\\u0930\\u0926\\u094D\\u0926 \\u0915\\u0930\\u0947\\u0902\nTransportDialog.Button.Assign=\\u0905\\u0938\\u093E\\u0907\\u0928 \\u0915\\u0930\\u0947\\u0902\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=\\u092E\\u093E\\u0932\\u093F\\u0915 \\u0915\\u093E \\u092A\\u0942\\u0930\\u093E \\u0928\\u093E\\u092E\nMessage.TransportNotAllowed=SAP \\u0935\\u093F\\u0915\\u093E\\u0938 \\u0932\\u0948\\u0902\\u0921\\u0938\\u094D\\u0915\\u0947\\u092A \\u0915\\u0947 \\u092D\\u0940\\u0924\\u0930 \\u0917\\u094D\\u0930\\u093E\\u0939\\u0915 \\u0928\\u093E\\u092E\\u0938\\u094D\\u0925\\u093E\\u0928 \\u092E\\u0947\\u0902 \\u0911\\u092C\\u094D\\u091C\\u0947\\u0915\\u094D\\u091F \\u0938\\u094D\\u0925\\u093E\\u0928\\u093E\\u0902\\u0924\\u0930\\u093F\\u0924 \\u0928\\u0939\\u0940\\u0902 \\u0915\\u093F\\u090F \\u091C\\u093E \\u0938\\u0915\\u0924\\u0947 \\u0939\\u0948\\u0902.\nMessage.AssignedToTransport={0} ID \\u092A\\u0939\\u0932\\u0947 \\u0938\\u0947 \\u0939\\u0940 \\u0915\\u092E \\u0938\\u0947 \\u0915\\u092E \\u091F\\u094D\\u0930\\u093E\\u0902\\u0938\\u092A\\u094B\\u0930\\u094D\\u091F \\u092E\\u0947\\u0902 \\u0905\\u0938\\u093E\\u0907\\u0928 \\u0915\\u0940 \\u0917\\u0908 \\u0939\\u0948.\n',
	"sap/ushell_abap/transport/i18n/i18n_hr.properties":'\nTransportInformation.Title=Informacije o prilagodbi transporta\nTransportInformation.Description=Komponenta za prikaz i validaciju polja relevantnih za prilagodbu transporta\nLabel.Transport=Transport\nMessage.EmptyTransport=Navedite va\\u017Ee\\u0107i transport. Za kreiranje zahtjeva za transport upotrijebite SE09.\nColumn.Description=Opis\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Otvoreni transporti\nAssignedTransportId=ID\nAssignedTransportDescription=Opis\nAssignedTransportOwner=Odgovorna osoba\nTooltip.AssignedSortSettingsButton=Sortiraj\nAssignedSortSettingsButton=Sortiraj\nAssignButton=Dodijeli\nMessage.TransportTableNoData=Nema dodijeljenih transporta\nIconTabFilterText=Transporti ({0})\nTransportDialog.Title=Dodijeli zahtjev za transport\nTransportDialog.Button.Cancel=Otka\\u017Ei\nTransportDialog.Button.Assign=Dodijeli\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Puno ime odgovorne osobe\nMessage.TransportNotAllowed=Objekti u prostorima za naziv kupca nisu preneseni unutar SAP razvojnog rasporeda.\nMessage.AssignedToTransport={0} ID ve\\u0107 je dodijeljen najmanje jednom transportu.\n',
	"sap/ushell_abap/transport/i18n/i18n_hu.properties":'\nTransportInformation.Title=Customizingtranszport adatai\nTransportInformation.Description=Komponens a customizingtranszporttal kapcsolatos mez\\u0151k megjelen\\u00EDt\\u00E9s\\u00E9hez \\u00E9s ellen\\u0151rz\\u00E9s\\u00E9hez\nLabel.Transport=Transzport\nMessage.EmptyTransport=Adjon meg \\u00E9rv\\u00E9nyes transzportot. Transzportk\\u00E9relmek l\\u00E9trehoz\\u00E1s\\u00E1hoz haszn\\u00E1lja az SE09 tranzakci\\u00F3t.\nColumn.Description=Le\\u00EDr\\u00E1s\nColumn.ID=Azonos\\u00EDt\\u00F3\nMessage.TransportTableOverflowToolbarHeader=Transzportok megnyit\\u00E1sa\nAssignedTransportId=Azonos\\u00EDt\\u00F3\nAssignedTransportDescription=Le\\u00EDr\\u00E1s\nAssignedTransportOwner=Tulajdonos\nTooltip.AssignedSortSettingsButton=Rendez\\u00E9s\nAssignedSortSettingsButton=Rendez\\u00E9s\nAssignButton=Hozz\\u00E1rendel\\u00E9s\nMessage.TransportTableNoData=Nincs hozz\\u00E1rendelt transzport\nIconTabFilterText=Transzportok ({0})\nTransportDialog.Title=Transzportk\\u00E9relem hozz\\u00E1rendel\\u00E9se\nTransportDialog.Button.Cancel=M\\u00E9gse\nTransportDialog.Button.Assign=Hozz\\u00E1rendel\\u00E9s\nMessage.SortDialogId=Azonos\\u00EDt\\u00F3\nMessage.SortDialogOwnerFullname=Tulajdonos teljes neve\nMessage.TransportNotAllowed=Az \\u00FCgyf\\u00E9ln\\u00E9vk\\u00E9szletben l\\u00E9v\\u0151 objektumok nem transzport\\u00E1l\\u00F3dnak az SAP fejleszt\\u0151i k\\u00F6rnyezetei k\\u00F6z\\u00F6tt.\nMessage.AssignedToTransport={0}\\: az azonos\\u00EDt\\u00F3 m\\u00E1r hozz\\u00E1 van rendelve legal\\u00E1bb egy transzporthoz.\n',
	"sap/ushell_abap/transport/i18n/i18n_it.properties":'\nTransportInformation.Title=Informazioni trasporto di customizing\nTransportInformation.Description=Componente per visualizzare e validare i campi rilevanti per il trasporto di customizing\nLabel.Transport=Trasporta\nMessage.EmptyTransport=Indica un trasporto valido. Per creare richieste di trasporto utilizza SE09.\nColumn.Description=Descrizione\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Trasporti aperti\nAssignedTransportId=ID\nAssignedTransportDescription=Descrizione\nAssignedTransportOwner=Proprietario\nTooltip.AssignedSortSettingsButton=Classifica\nAssignedSortSettingsButton=Classifica\nAssignButton=Attribuisci\nMessage.TransportTableNoData=Nessun trasporto attribuito\nIconTabFilterText=Trasporti ({0})\nTransportDialog.Title=Attribuisci richiesta di trasporto\nTransportDialog.Button.Cancel=Annulla\nTransportDialog.Button.Assign=Attribuisci\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Nome completo del proprietario\nMessage.TransportNotAllowed=Gli oggetti negli spazi nomi cliente non vengono trasportati nell\'ambito degli ambienti di sviluppo SAP.\nMessage.AssignedToTransport=ID {0} gi\\u00E0 attribuito ad almeno un trasporto.\n',
	"sap/ushell_abap/transport/i18n/i18n_iw.properties":'\nTransportInformation.Title=\\u05D4\\u05EA\\u05D0\\u05DE\\u05D4 \\u05D0\\u05D9\\u05E9\\u05D9\\u05EA \\u05E9\\u05DC \\u05E4\\u05E8\\u05D8\\u05D9 \\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8\nTransportInformation.Description=\\u05E8\\u05DB\\u05D9\\u05D1 \\u05DC\\u05EA\\u05E6\\u05D5\\u05D2\\u05D4 \\u05D5\\u05DC\\u05D1\\u05D3\\u05D9\\u05E7\\u05EA \\u05EA\\u05E7\\u05D9\\u05E0\\u05D5\\u05EA \\u05E9\\u05DC \\u05D4\\u05E9\\u05D3\\u05D5\\u05EA \\u05E9\\u05E8\\u05DC\\u05D5\\u05D5\\u05E0\\u05D8\\u05D9\\u05D9\\u05DD \\u05DC\\u05D4\\u05EA\\u05D0\\u05DE\\u05D4 \\u05D0\\u05D9\\u05E9\\u05D9\\u05EA \\u05E9\\u05DC \\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8\nLabel.Transport=\\u05D1\\u05E6\\u05E2 \\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8\nMessage.EmptyTransport=\\u05E1\\u05E4\\u05E8 \\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8 \\u05D7\\u05D5\\u05E7\\u05D9. \\u05DC\\u05D9\\u05E6\\u05D9\\u05E8\\u05EA \\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8, \\u05D4\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1-SE09.\nColumn.Description=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\nColumn.ID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9\nMessage.TransportTableOverflowToolbarHeader=\\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8\\u05D9\\u05DD \\u05E4\\u05EA\\u05D5\\u05D7\\u05D9\\u05DD\nAssignedTransportId=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9\nAssignedTransportDescription=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\nAssignedTransportOwner=\\u05D1\\u05E2\\u05DC\\u05D9\\u05DD\nTooltip.AssignedSortSettingsButton=\\u05DE\\u05D9\\u05D9\\u05DF\nAssignedSortSettingsButton=\\u05DE\\u05D9\\u05D9\\u05DF\nAssignButton=\\u05D4\\u05E7\\u05E6\\u05D4\nMessage.TransportTableNoData=\\u05D0\\u05D9\\u05DF \\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8\\u05D9\\u05DD \\u05DE\\u05D5\\u05E7\\u05E6\\u05D9\\u05DD\nIconTabFilterText=\\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8\\u05D9\\u05DD ({0})\nTransportDialog.Title=\\u05D4\\u05E7\\u05E6\\u05D4 \\u05D1\\u05E7\\u05E9\\u05EA \\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8\nTransportDialog.Button.Cancel=\\u05D1\\u05D8\\u05DC\nTransportDialog.Button.Assign=\\u05D4\\u05E7\\u05E6\\u05D4\nMessage.SortDialogId=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9\nMessage.SortDialogOwnerFullname=\\u05E9\\u05DD \\u05DE\\u05DC\\u05D0 \\u05E9\\u05DC \\u05D4\\u05D1\\u05E2\\u05DC\\u05D9\\u05DD\nMessage.TransportNotAllowed=\\u05D0\\u05D5\\u05D1\\u05D9\\u05D9\\u05E7\\u05D8\\u05D9\\u05DD \\u05D1\\u05DE\\u05E8\\u05D7\\u05D1 \\u05E9\\u05DE\\u05D5\\u05EA \\u05E9\\u05DC \\u05DC\\u05E7\\u05D5\\u05D7 \\u05DC\\u05D0 \\u05D4\\u05D5\\u05E2\\u05D1\\u05E8\\u05D5 \\u05DC\\u05E1\\u05D1\\u05D9\\u05D1\\u05D5\\u05EA \\u05DC\\u05D9\\u05D1\\u05D4 \\u05E9\\u05DC \\u05E4\\u05D9\\u05EA\\u05D5\\u05D7 \\u05E9\\u05DC SAP.\nMessage.AssignedToTransport=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 {0} \\u05DB\\u05D1\\u05E8 \\u05DE\\u05D5\\u05E7\\u05E6\\u05D4 \\u05DC\\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8 \\u05D0\\u05D7\\u05D3 \\u05DC\\u05E4\\u05D7\\u05D5\\u05EA.\n',
	"sap/ushell_abap/transport/i18n/i18n_ja.properties":'\nTransportInformation.Title=\\u30AB\\u30B9\\u30BF\\u30DE\\u30A4\\u30B8\\u30F3\\u30B0\\u79FB\\u9001\\u60C5\\u5831\nTransportInformation.Description=\\u30AB\\u30B9\\u30BF\\u30DE\\u30A4\\u30B8\\u30F3\\u30B0\\u79FB\\u9001\\u95A2\\u9023\\u9805\\u76EE\\u306E\\u8868\\u793A\\u304A\\u3088\\u3073\\u30C1\\u30A7\\u30C3\\u30AF\\u306E\\u305F\\u3081\\u306E\\u30B3\\u30F3\\u30DD\\u30FC\\u30CD\\u30F3\\u30C8\nLabel.Transport=\\u79FB\\u9001\nMessage.EmptyTransport=\\u6709\\u52B9\\u306A\\u79FB\\u9001\\u3092\\u6307\\u5B9A\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\\u79FB\\u9001\\u4F9D\\u983C\\u3092\\u767B\\u9332\\u3059\\u308B\\u306B\\u306F\\u3001SE09 \\u3092\\u4F7F\\u7528\\u3057\\u307E\\u3059\\u3002\nColumn.Description=\\u5185\\u5BB9\\u8AAC\\u660E\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=\\u672A\\u51E6\\u7406\\u306E\\u79FB\\u9001\nAssignedTransportId=ID\nAssignedTransportDescription=\\u5185\\u5BB9\\u8AAC\\u660E\nAssignedTransportOwner=\\u30AA\\u30FC\\u30CA\\u30FC\nTooltip.AssignedSortSettingsButton=\\u30BD\\u30FC\\u30C8\nAssignedSortSettingsButton=\\u30BD\\u30FC\\u30C8\nAssignButton=\\u5272\\u5F53\nMessage.TransportTableNoData=\\u5272\\u308A\\u5F53\\u3066\\u3089\\u308C\\u305F\\u79FB\\u9001\\u304C\\u3042\\u308A\\u307E\\u305B\\u3093\nIconTabFilterText=\\u79FB\\u9001 ({0})\nTransportDialog.Title=\\u79FB\\u9001\\u4F9D\\u983C\\u306E\\u5272\\u5F53\nTransportDialog.Button.Cancel=\\u4E2D\\u6B62\nTransportDialog.Button.Assign=\\u5272\\u5F53\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=\\u6240\\u6709\\u8005\\u306E\\u6C0F\\u540D\nMessage.TransportNotAllowed=\\u30AB\\u30B9\\u30BF\\u30DE\\u540D\\u79F0\\u9818\\u57DF\\u306E\\u30AA\\u30D6\\u30B8\\u30A7\\u30AF\\u30C8\\u306F\\u3001SAP \\u958B\\u767A\\u30E9\\u30F3\\u30C9\\u30B9\\u30B1\\u30FC\\u30D7\\u5185\\u90E8\\u3067\\u306F\\u79FB\\u9001\\u3055\\u308C\\u307E\\u305B\\u3093\\u3002\nMessage.AssignedToTransport={0} ID \\u306F 1 \\u4EF6\\u4EE5\\u4E0A\\u306E\\u79FB\\u9001\\u306B\\u3059\\u3067\\u306B\\u5272\\u308A\\u5F53\\u3066\\u3089\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\n',
	"sap/ushell_abap/transport/i18n/i18n_kk.properties":'\nTransportInformation.Title=\\u0422\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u0430\\u0443 \\u0442\\u0443\\u0440\\u0430\\u043B\\u044B \\u0430\\u049B\\u043F\\u0430\\u0440\\u0430\\u0442\\u0442\\u044B \\u0440\\u0435\\u0442\\u0442\\u0435\\u0443\nTransportInformation.Description=\\u0422\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u0430\\u0443\\u0434\\u044B \\u0440\\u0435\\u0442\\u0442\\u0435\\u0443 \\u04AF\\u0448\\u0456\\u043D \\u0440\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u0442\\u044B \\u04E9\\u0440\\u0456\\u0441\\u0442\\u0435\\u0440\\u0434\\u0456 \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0435\\u0442\\u0456\\u043D \\u0436\\u04D9\\u043D\\u0435 \\u0431\\u0430\\u0493\\u0430\\u043B\\u0430\\u0439\\u0442\\u044B\\u043D \\u049B\\u04B1\\u0440\\u0430\\u043C\\u0434\\u0430\\u0441\nLabel.Transport=\\u0422\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u0430\\u0443\nMessage.EmptyTransport=\\u0416\\u0430\\u0440\\u0430\\u043C\\u0434\\u044B \\u0442\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u044B \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0456\\u04A3\\u0456\\u0437. \\u0422\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B \\u0441\\u04B1\\u0440\\u0430\\u0443\\u043B\\u0430\\u0440\\u044B\\u043D \\u0436\\u0430\\u0441\\u0430\\u0443 \\u04AF\\u0448\\u0456\\u043D SE09 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u044F\\u0441\\u044B\\u043D \\u049B\\u043E\\u043B\\u0434\\u0430\\u043D\\u044B\\u04A3\\u044B\\u0437.\nColumn.Description=\\u0421\\u0438\\u043F\\u0430\\u0442\\u0442\\u0430\\u043C\\u0430\nColumn.ID=\\u0418\\u0434.\nMessage.TransportTableOverflowToolbarHeader=\\u0410\\u0448\\u044B\\u049B \\u0442\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u0430\\u0440\nAssignedTransportId=\\u0418\\u0434.\nAssignedTransportDescription=\\u0421\\u0438\\u043F\\u0430\\u0442\\u0442\\u0430\\u043C\\u0430\nAssignedTransportOwner=\\u0418\\u0435\\u043B\\u0435\\u043D\\u0443\\u0448\\u0456\nTooltip.AssignedSortSettingsButton=\\u0421\\u04B1\\u0440\\u044B\\u043F\\u0442\\u0430\\u0443\nAssignedSortSettingsButton=\\u0421\\u04B1\\u0440\\u044B\\u043F\\u0442\\u0430\\u0443\nAssignButton=\\u0422\\u0430\\u0493\\u0430\\u0439\\u044B\\u043D\\u0434\\u0430\\u0443\nMessage.TransportTableNoData=\\u0422\\u0430\\u0493\\u0430\\u0439\\u044B\\u043D\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u0442\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u0430\\u0440 \\u0436\\u043E\\u049B\nIconTabFilterText=\\u0422\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u0430\\u0440 ({0})\nTransportDialog.Title=\\u0422\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u0430\\u0443 \\u0441\\u04B1\\u0440\\u0430\\u0443\\u044B\\u043D \\u0442\\u0430\\u0493\\u0430\\u0439\\u044B\\u043D\\u0434\\u0430\\u0443\nTransportDialog.Button.Cancel=\\u0411\\u043E\\u043B\\u0434\\u044B\\u0440\\u043C\\u0430\\u0443\nTransportDialog.Button.Assign=\\u0422\\u0430\\u0493\\u0430\\u0439\\u044B\\u043D\\u0434\\u0430\\u0443\nMessage.SortDialogId=\\u0418\\u0434.\nMessage.SortDialogOwnerFullname=\\u0418\\u0435\\u043B\\u0435\\u043D\\u0443\\u0448\\u0456\\u043D\\u0456\\u04A3 \\u0430\\u0442\\u044B-\\u0436\\u04E9\\u043D\\u0456\nMessage.TransportNotAllowed=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0442\\u0456\\u04A3 \\u0430\\u0442\\u0430\\u0443 \\u043E\\u0440\\u044B\\u043D\\u0434\\u0430\\u0440\\u044B\\u043D\\u0434\\u0430\\u0493\\u044B \\u043D\\u044B\\u0441\\u0430\\u043D\\u0434\\u0430\\u0440 SAP \\u04D9\\u0437\\u0456\\u0440\\u043B\\u0435\\u0443 \\u043B\\u0430\\u043D\\u0434\\u0448\\u0430\\u0444\\u0442\\u0442\\u0430\\u0440\\u044B\\u043D\\u0434\\u0430 \\u0442\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430\\u0439\\u0434\\u044B.\nMessage.AssignedToTransport={0} \\u0438\\u0434. \\u043A\\u0435\\u043C\\u0456\\u043D\\u0434\\u0435 \\u0431\\u0456\\u0440 \\u0442\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0493\\u0430 \\u04D9\\u043B\\u0434\\u0435\\u049B\\u0430\\u0448\\u0430\\u043D \\u0442\\u0430\\u0493\\u0430\\u0439\\u044B\\u043D\\u0434\\u0430\\u043B\\u0434\\u044B.\n',
	"sap/ushell_abap/transport/i18n/i18n_ko.properties":'\nTransportInformation.Title=\\uCEE4\\uC2A4\\uD130\\uB9C8\\uC774\\uC9D5 \\uC804\\uC1A1 \\uC815\\uBCF4\nTransportInformation.Description=\\uCEE4\\uC2A4\\uD130\\uB9C8\\uC774\\uC9D5 \\uC804\\uC1A1\\uACFC \\uAD00\\uB828\\uB41C \\uD544\\uB4DC\\uB97C \\uD45C\\uC2DC\\uD558\\uACE0 \\uC720\\uD6A8\\uC131\\uC744 \\uD655\\uC778\\uD558\\uB294 \\uCEF4\\uD3EC\\uB10C\\uD2B8\nLabel.Transport=\\uC804\\uC1A1\nMessage.EmptyTransport=\\uC720\\uD6A8\\uD55C \\uC804\\uC1A1\\uC744 \\uC9C0\\uC815\\uD558\\uC2ED\\uC2DC\\uC624. \\uC804\\uC1A1 \\uC694\\uCCAD\\uC744 \\uC0DD\\uC131\\uD558\\uB824\\uBA74 SE09\\uB97C \\uC0AC\\uC6A9\\uD558\\uC2ED\\uC2DC\\uC624.\nColumn.Description=\\uB0B4\\uC5ED\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=\\uBBF8\\uACB0 \\uC804\\uC1A1\nAssignedTransportId=ID\nAssignedTransportDescription=\\uB0B4\\uC5ED\nAssignedTransportOwner=\\uC18C\\uC720\\uC790\nTooltip.AssignedSortSettingsButton=\\uC815\\uB82C\nAssignedSortSettingsButton=\\uC815\\uB82C\nAssignButton=\\uC9C0\\uC815\nMessage.TransportTableNoData=\\uC9C0\\uC815\\uB41C \\uC804\\uC1A1 \\uC5C6\\uC74C\nIconTabFilterText=\\uC804\\uC1A1({0})\nTransportDialog.Title=\\uC804\\uC1A1 \\uC694\\uCCAD \\uC9C0\\uC815\nTransportDialog.Button.Cancel=\\uCDE8\\uC18C\nTransportDialog.Button.Assign=\\uC9C0\\uC815\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=\\uC18C\\uC720\\uC790 \\uC131\\uBA85\nMessage.TransportNotAllowed=\\uACE0\\uAC1D \\uB124\\uC784\\uC2A4\\uD398\\uC774\\uC2A4\\uC5D0 \\uC18D\\uD55C \\uC624\\uBE0C\\uC81D\\uD2B8\\uB294 SAP \\uAC1C\\uBC1C \\uB79C\\uB4DC\\uC2A4\\uCF00\\uC774\\uD504\\uC5D0 \\uC804\\uC1A1\\uB418\\uC9C0 \\uC54A\\uC2B5\\uB2C8\\uB2E4.\nMessage.AssignedToTransport={0} ID\\uB294 \\uCD5C\\uC18C \\uD558\\uB098\\uC758 \\uC804\\uC1A1\\uC5D0 \\uC774\\uBBF8 \\uC9C0\\uC815\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4.\n',
	"sap/ushell_abap/transport/i18n/i18n_lt.properties":'\nTransportInformation.Title=Tinkinama transportavimo informacija\nTransportInformation.Description=Komponentas, skirtas rodyti ir tikrinti laukams, susijusiems su transportavimo tinkinimu\nLabel.Transport=Transportavimas\nMessage.EmptyTransport=Nurodykite tinkam\\u0105 transportavim\\u0105. Nor\\u0117dami sukurti transportavimo u\\u017Eklaus\\u0105, naudokite SE09.\nColumn.Description=Apra\\u0161as\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Atidaryti transportavimus\nAssignedTransportId=ID\nAssignedTransportDescription=Apra\\u0161as\nAssignedTransportOwner=Savininkas\nTooltip.AssignedSortSettingsButton=R\\u016B\\u0161iuoti\nAssignedSortSettingsButton=R\\u016B\\u0161iuoti\nAssignButton=Priskirti\nMessage.TransportTableNoData=Priskirt\\u0173 transportavim\\u0173 n\\u0117ra\nIconTabFilterText=Transportavimai ({0})\nTransportDialog.Title=Priskirti perk\\u0117limo u\\u017Eklaus\\u0105\nTransportDialog.Button.Cancel=At\\u0161aukti\nTransportDialog.Button.Assign=Priskirti\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Savininko vardas ir pavard\\u0117\nMessage.TransportNotAllowed=Kliento vard\\u0173 srityje esantys objektai netransportuojami SAP k\\u016Brimo infrastrukt\\u016Brose.\nMessage.AssignedToTransport={0} ID jau priskirtas ma\\u017Eiausiai vienam transportavimui.\n',
	"sap/ushell_abap/transport/i18n/i18n_lv.properties":'\nTransportInformation.Title=Piel\\u0101go\\u0161anas transport\\u0113\\u0161anas inform\\u0101cija\nTransportInformation.Description=Komponents, lai par\\u0101d\\u012Btu un p\\u0101rbaud\\u012Btu laukus, kas attiecas uz piel\\u0101go\\u0161anas transport\\u0113\\u0161anu\nLabel.Transport=Transport\\u0113t\nMessage.EmptyTransport=L\\u016Bdzu, nor\\u0101diet der\\u012Bgu transport\\u0113\\u0161anu. Lai izveidotu transport\\u0113\\u0161anas piepras\\u012Bjumus, izmantojiet SE09.\nColumn.Description=Apraksts\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Atv\\u0113rti transport\\u0113\\u0161anas gad\\u012Bjumi\nAssignedTransportId=ID\nAssignedTransportDescription=Apraksts\nAssignedTransportOwner=\\u012Apa\\u0161nieks\nTooltip.AssignedSortSettingsButton=K\\u0101rtot\nAssignedSortSettingsButton=K\\u0101rtot\nAssignButton=Pie\\u0161\\u0137irt\nMessage.TransportTableNoData=Nav pie\\u0161\\u0137irtu transport\\u0113\\u0161anas gad\\u012Bjumu\nIconTabFilterText=Transport\\u0113\\u0161anas gad\\u012Bjumi ({0})\nTransportDialog.Title=Pie\\u0161\\u0137irt transport\\u0113\\u0161anas piepras\\u012Bjumu\nTransportDialog.Button.Cancel=Atcelt\nTransportDialog.Button.Assign=Pie\\u0161\\u0137irt\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Pilns \\u012Bpa\\u0161nieka v\\u0101rds\nMessage.TransportNotAllowed=Objekti klienta nosaukumviet\\u0101s nav p\\u0101rnesti uz SAP izstr\\u0101des infrastrukt\\u016Br\\u0101m.\nMessage.AssignedToTransport={0} ID jau pie\\u0161\\u0137irts vismaz vienam transportam.\n',
	"sap/ushell_abap/transport/i18n/i18n_ms.properties":'\nTransportInformation.Title=Maklumat Pindahan Penyesuaian\nTransportInformation.Description=Komponen untuk memaparkan dan mengesahkan medan yang berkaitan dengan pindahan penyesuaian\nLabel.Transport=Pindahan\nMessage.EmptyTransport=Sila sediakan pindahan yang sah. Untuk mencipta permintaan pindahan, gunakan SE09.\nColumn.Description=Perihalan\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Buka Pindahan\nAssignedTransportId=ID\nAssignedTransportDescription=Perihalan\nAssignedTransportOwner=Pemilik\nTooltip.AssignedSortSettingsButton=Isih\nAssignedSortSettingsButton=Isih\nAssignButton=Umpukkan\nMessage.TransportTableNoData=Tiada pindahan diumpukkan\nIconTabFilterText=Pindahan ({0})\nTransportDialog.Title=Umpukkan Permintaan Pemindahan\nTransportDialog.Button.Cancel=Batalkan\nTransportDialog.Button.Assign=Umpukkan\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Nama penuh pemilik\nMessage.TransportNotAllowed=Objek dalam ruang nama pelanggan tidak dipindahkan dalam landskap pembangunan SAP.\nMessage.AssignedToTransport={0} ID telah diumpukkan ke sekurang-kurangnya satu pengangkutan.\n',
	"sap/ushell_abap/transport/i18n/i18n_nl.properties":'\nTransportInformation.Title=Informatie over customizingtransport\nTransportInformation.Description=Component voor weergave en validatie van de velden die relevant zijn voor customizingtransport\nLabel.Transport=Transport\nMessage.EmptyTransport=Geef een geldig transport op. Gebruik SE09 om transportopdrachten te cre\\u00EBren.\nColumn.Description=Omschrijving\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Open transporten\nAssignedTransportId=ID\nAssignedTransportDescription=Omschrijving\nAssignedTransportOwner=Eigenaar\nTooltip.AssignedSortSettingsButton=Sorteren\nAssignedSortSettingsButton=Sorteren\nAssignButton=Toewijzen\nMessage.TransportTableNoData=Geen toegewezen transporten\nIconTabFilterText=Transporten ({0})\nTransportDialog.Title=Transportopdracht toewijzen\nTransportDialog.Button.Cancel=Annuleren\nTransportDialog.Button.Assign=Toewijzen\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Volledige naam eigenaar\nMessage.TransportNotAllowed=Objecten in klantnamengebieden worden niet binnen SAP-ontwikkelomgevingen getransporteerd.\nMessage.AssignedToTransport=ID van {0} is al toegewezen aan ten minste \\u00E9\\u00E9n transport.\n',
	"sap/ushell_abap/transport/i18n/i18n_no.properties":'\nTransportInformation.Title=Overf\\u00F8ringsinformasjon systemtilpasning\nTransportInformation.Description=Komponent for visning og validering av feltene som er relevante for systemtilpasningsoverf\\u00F8ring\nLabel.Transport=Overf\\u00F8ring\nMessage.EmptyTransport=Oppgi gyldig overf\\u00F8ring. Bruk SE09 for \\u00E5 opprette overf\\u00F8ringsordrer.\nColumn.Description=Beskrivelse\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=\\u00C5pne overf\\u00F8ringer\nAssignedTransportId=ID\nAssignedTransportDescription=Beskrivelse\nAssignedTransportOwner=Eier\nTooltip.AssignedSortSettingsButton=Sorter\nAssignedSortSettingsButton=Sorter\nAssignButton=Tilordne\nMessage.TransportTableNoData=Ingen tilordnede overf\\u00F8ringer\nIconTabFilterText=Overf\\u00F8ringer ({0})\nTransportDialog.Title=Tilordne overf\\u00F8ringsordre\nTransportDialog.Button.Cancel=Avbryt\nTransportDialog.Button.Assign=Tilordne\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Eierens fulle navn\nMessage.TransportNotAllowed=Objekter i kundenavneomr\\u00E5der overf\\u00F8res ikke innenfor SAP-utviklingslandskaper.\nMessage.AssignedToTransport={0}-ID er allerede tilordnet til minst \\u00E9n overf\\u00F8ring.\n',
	"sap/ushell_abap/transport/i18n/i18n_pl.properties":'\nTransportInformation.Title=Konfiguracja informacji dot. transportu\nTransportInformation.Description=Sk\\u0142adnik do wy\\u015Bwietlania i walidacji p\\u00F3l istotnych dla konfiguracji transportu\nLabel.Transport=Transport\nMessage.EmptyTransport=Podaj prawid\\u0142owy transport. Aby utworzy\\u0107 zlecenia transportu, u\\u017Cyj transakcji SE09.\nColumn.Description=Opis\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Otwarte transporty\nAssignedTransportId=ID\nAssignedTransportDescription=Opis\nAssignedTransportOwner=Osoba odpowiedzialna\nTooltip.AssignedSortSettingsButton=Sortuj\nAssignedSortSettingsButton=Sortuj\nAssignButton=Przypisz\nMessage.TransportTableNoData=Brak przypisanych transport\\u00F3w\nIconTabFilterText=Transporty ({0})\nTransportDialog.Title=Przypisanie transportu\nTransportDialog.Button.Cancel=Anuluj\nTransportDialog.Button.Assign=Przypisz\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Imi\\u0119 i nazwisko w\\u0142a\\u015Bciciela\nMessage.TransportNotAllowed=Obiekty w przestrzeniach nazw klienta nie s\\u0105 transportowane w ramach struktur projektowych SAP.\nMessage.AssignedToTransport=ID {0} jest ju\\u017C przypisany do co najmniej jednego transportu.\n',
	"sap/ushell_abap/transport/i18n/i18n_pt.properties":'\nTransportInformation.Title=Informa\\u00E7\\u00E3o de transporte de customizing\nTransportInformation.Description=Componente para exibir e validar os campos relevantes para o transporte de customizing\nLabel.Transport=Transportar\nMessage.EmptyTransport=Forne\\u00E7a um transporte v\\u00E1lido. Para criar ordens de transporte, utilize SE09.\nColumn.Description=Descri\\u00E7\\u00E3o\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Transportes abertos\nAssignedTransportId=ID\nAssignedTransportDescription=Descri\\u00E7\\u00E3o\nAssignedTransportOwner=Propriet\\u00E1rio\nTooltip.AssignedSortSettingsButton=Ordenar\nAssignedSortSettingsButton=Ordenar\nAssignButton=Atribuir\nMessage.TransportTableNoData=Transportes n\\u00E3o atribu\\u00EDdos\nIconTabFilterText=Transportes ({0})\nTransportDialog.Title=Atribuir ordem de transporte\nTransportDialog.Button.Cancel=Cancelar\nTransportDialog.Button.Assign=Atribuir\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Nome completo do propriet\\u00E1rio\nMessage.TransportNotAllowed=Os objetos nos espa\\u00E7o de nomes de cliente n\\u00E3o s\\u00E3o transportados dentro da estrutura de desenvolvimento SAP.\nMessage.AssignedToTransport=O ID{0} j\\u00E1 est\\u00E1 atribu\\u00EDdo a um transporte.\n',
	"sap/ushell_abap/transport/i18n/i18n_ro.properties":'\nTransportInformation.Title=Customizare informa\\u021Bii de transport\nTransportInformation.Description=Componenta pentru afi\\u0219area \\u0219i validarea c\\u00E2mpurilor relevante pentru customizarea transportului\nLabel.Transport=Transport\nMessage.EmptyTransport=Furniza\\u021Bi un transport valabil. Pentru a crea cereri de transport, utiliza\\u021Bi SE09.\nColumn.Description=Descriere\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Transporturi deschise\nAssignedTransportId=ID\nAssignedTransportDescription=Descriere\nAssignedTransportOwner=Responsabil\nTooltip.AssignedSortSettingsButton=Sortare\nAssignedSortSettingsButton=Sortare\nAssignButton=Alocare\nMessage.TransportTableNoData=Niciun transport alocat\nIconTabFilterText=Transporturi ({0})\nTransportDialog.Title=Alocare cerere de transport\nTransportDialog.Button.Cancel=Anulare\nTransportDialog.Button.Assign=Alocare\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Nume complet proprietar\nMessage.TransportNotAllowed=Obiecte \\u00EEn spa\\u021Bii de nume client nu sunt transportate \\u00EEn infrastructuri de dezvoltare SAP.\nMessage.AssignedToTransport={0} ID este alocat deja cel pu\\u021Bin unui transport.\n',
	"sap/ushell_abap/transport/i18n/i18n_ru.properties":'\nTransportInformation.Title=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F \\u043E \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u0435 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\nTransportInformation.Description=\\u041A\\u043E\\u043C\\u043F\\u043E\\u043D\\u0435\\u043D\\u0442 \\u0434\\u043B\\u044F \\u043F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0430 \\u0438 \\u043F\\u0440\\u043E\\u0432\\u0435\\u0440\\u043A\\u0438 \\u043F\\u043E\\u043B\\u0435\\u0439, \\u0440\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u043D\\u044B\\u0445 \\u0434\\u043B\\u044F \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u0430 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\nLabel.Transport=\\u041F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\nMessage.EmptyTransport=\\u0423\\u043A\\u0430\\u0436\\u0438\\u0442\\u0435 \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u044B\\u0439 \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441. \\u0414\\u043B\\u044F \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0438\\u044F \\u0437\\u0430\\u043F\\u0440\\u043E\\u0441\\u043E\\u0432 \\u043D\\u0430 \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441 \\u0438\\u0441\\u043F\\u043E\\u043B\\u044C\\u0437\\u0443\\u0439\\u0442\\u0435 SE09.\nColumn.Description=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\nColumn.ID=\\u0418\\u0434.\nMessage.TransportTableOverflowToolbarHeader=\\u041E\\u0442\\u043A\\u0440\\u044B\\u0442\\u044B\\u0435 \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u044B\nAssignedTransportId=\\u0418\\u0434.\nAssignedTransportDescription=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\nAssignedTransportOwner=\\u0412\\u043B\\u0430\\u0434\\u0435\\u043B\\u0435\\u0446\nTooltip.AssignedSortSettingsButton=\\u0421\\u043E\\u0440\\u0442\\u0438\\u0440\\u043E\\u0432\\u043A\\u0430\nAssignedSortSettingsButton=\\u0421\\u043E\\u0440\\u0442\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C\nAssignButton=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0438\\u0442\\u044C\nMessage.TransportTableNoData=\\u041D\\u0435\\u0442 \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u043D\\u044B\\u0445 \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u043E\\u0432\nIconTabFilterText=\\u041F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u044B ({0})\nTransportDialog.Title=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0438\\u0442\\u044C \\u0437\\u0430\\u043F\\u0440\\u043E\\u0441 \\u043D\\u0430 \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\nTransportDialog.Button.Cancel=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\nTransportDialog.Button.Assign=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0438\\u0442\\u044C\nMessage.SortDialogId=\\u0418\\u0434.\nMessage.SortDialogOwnerFullname=\\u041F\\u043E\\u043B\\u043D\\u043E\\u0435 \\u0438\\u043C\\u044F \\u0432\\u043B\\u0430\\u0434\\u0435\\u043B\\u044C\\u0446\\u0430\nMessage.TransportNotAllowed=\\u041E\\u0431\\u044A\\u0435\\u043A\\u0442\\u044B \\u0432 \\u043E\\u0431\\u043B\\u0430\\u0441\\u0442\\u044F\\u0445 \\u0438\\u043C\\u0435\\u043D \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430 \\u043D\\u0435 \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u044F\\u0442\\u0441\\u044F \\u0432 \\u0440\\u0430\\u043C\\u043A\\u0430\\u0445 \\u0441\\u0440\\u0435\\u0434 \\u0440\\u0430\\u0437\\u0440\\u0430\\u0431\\u043E\\u0442\\u043E\\u043A SAP.\nMessage.AssignedToTransport={0} \\u0438\\u0434. \\u0443\\u0436\\u0435 \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D \\u043A\\u0430\\u043A \\u043C\\u0438\\u043D\\u0438\\u043C\\u0443\\u043C \\u043E\\u0434\\u043D\\u043E\\u043C\\u0443 \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u0443.\n',
	"sap/ushell_abap/transport/i18n/i18n_sh.properties":'\nTransportInformation.Title=Informacije o prenosu prilago\\u0111avanja\nTransportInformation.Description=Komponenta za prikaz i validaciju polja relevantnih za prenos prilago\\u0111avanja\nLabel.Transport=Prenos\nMessage.EmptyTransport=Obezbedite va\\u017Ee\\u0107i prenos. Da biste kreirali zahteve za prenos, koristite SE09.\nColumn.Description=Opis\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Otvoreni prenosi\nAssignedTransportId=ID\nAssignedTransportDescription=Opis\nAssignedTransportOwner=Vlasnik\nTooltip.AssignedSortSettingsButton=Pore\\u0111aj\nAssignedSortSettingsButton=Pore\\u0111aj\nAssignButton=Dodeli\nMessage.TransportTableNoData=Nema dodeljenih prenosa\nIconTabFilterText=Prenosi ({0})\nTransportDialog.Title=Dodeli zahtev za prenos\nTransportDialog.Button.Cancel=Odustani\nTransportDialog.Button.Assign=Dodeli\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Puno ime vlasnika\nMessage.TransportNotAllowed=Objekti u prostorima za ime kupca nisu preneti u okviru struktura razvoja SAP.\nMessage.AssignedToTransport=ID {0} je ve\\u0107 dodeljen najmanje jednom transportu.\n',
	"sap/ushell_abap/transport/i18n/i18n_sk.properties":'\nTransportInformation.Title=Inform\\u00E1cie o transporte customizingu\nTransportInformation.Description=Komponent na zobrazenie a overenie pol\\u00ED relevantn\\u00FDch pre transport customizingu\nLabel.Transport=Transport\nMessage.EmptyTransport=Zadajte platn\\u00FD transport. Na vytvorenie transportn\\u00FDch po\\u017Eiadaviek pou\\u017Eite SE09.\nColumn.Description=Popis\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Otvori\\u0165 transporty\nAssignedTransportId=ID\nAssignedTransportDescription=Popis\nAssignedTransportOwner=Vlastn\\u00EDk\nTooltip.AssignedSortSettingsButton=Triedi\\u0165\nAssignedSortSettingsButton=Triedi\\u0165\nAssignButton=Priradi\\u0165\nMessage.TransportTableNoData=Nepriraden\\u00E9 transporty\nIconTabFilterText=Transporty ({0})\nTransportDialog.Title=Priradi\\u0165 transportn\\u00FA po\\u017Eiadavku\nTransportDialog.Button.Cancel=Zru\\u0161i\\u0165\nTransportDialog.Button.Assign=Priradi\\u0165\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Cel\\u00E9 meno vlastn\\u00EDka\nMessage.TransportNotAllowed=Objekty v z\\u00E1kazn\\u00EDckych rozsahoch n\\u00E1zvov sa nepren\\u00E1\\u0161aj\\u00FA v r\\u00E1mci v\\u00FDvojov\\u00FDch prostred\\u00ED SAP.\nMessage.AssignedToTransport={0} ID je u\\u017E priraden\\u00E9 k aspo\\u0148 jedn\\u00E9mu transportu.\n',
	"sap/ushell_abap/transport/i18n/i18n_sl.properties":'\nTransportInformation.Title=Informacije o prenosu Customizinga\nTransportInformation.Description=Komponenta za prikaz in validiranje polj, relevantnih za prenos Customizinga\nLabel.Transport=Prenos\nMessage.EmptyTransport=Navedite veljaven prenos. Za kreiranje zahtev za prenos uporabite SE09.\nColumn.Description=Opis\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=Odpiranje prenosov\nAssignedTransportId=ID\nAssignedTransportDescription=Opis\nAssignedTransportOwner=Lastnik\nTooltip.AssignedSortSettingsButton=Razvrsti\nAssignedSortSettingsButton=Razvrsti\nAssignButton=Dodelitev\nMessage.TransportTableNoData=Ni dodeljenih prenosov\nIconTabFilterText=Prenosi ({0})\nTransportDialog.Title=Dodelitev transportnega naloga\nTransportDialog.Button.Cancel=Prekli\\u010Di\nTransportDialog.Button.Assign=Dodeli\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=Polno ime lastnika\nMessage.TransportNotAllowed=Objekti v imenskih prostorih stranke niso prenesene v SAP-jevih infrastrukturah razvoja.\nMessage.AssignedToTransport=ID {0} je \\u017Ee dodeljen vsaj enemu prenosu.\n',
	"sap/ushell_abap/transport/i18n/i18n_sv.properties":'\nTransportInformation.Title=Information om kundanpassningstransport\nTransportInformation.Description=Komponent f\\u00F6r visning och validering av f\\u00E4lt relevanta f\\u00F6r kundanpassningstransport\nLabel.Transport=Transport\nMessage.EmptyTransport=Ange en giltig transport. Anv\\u00E4nd SE09 f\\u00F6r att skapa transportanmodanden.\nColumn.Description=Beskrivning\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=\\u00D6ppna transporter\nAssignedTransportId=ID\nAssignedTransportDescription=Beskrivning\nAssignedTransportOwner=\\u00C4gare\nTooltip.AssignedSortSettingsButton=Sortering\nAssignedSortSettingsButton=Sortera\nAssignButton=Allokera\nMessage.TransportTableNoData=Inga allokerade transporter\nIconTabFilterText=Transporter ({0})\nTransportDialog.Title=Allokera transportorder\nTransportDialog.Button.Cancel=Avbryt\nTransportDialog.Button.Assign=Allokera\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=\\u00C4garens fullst\\u00E4ndiga namn\nMessage.TransportNotAllowed=Objekt i kundnamnomr\\u00E5den transporteras inte i SAP-utvecklingsmilj\\u00F6er.\nMessage.AssignedToTransport={0}-ID har redan allokerats till minst en transport.\n',
	"sap/ushell_abap/transport/i18n/i18n_th.properties":'\nTransportInformation.Title=\\u0E02\\u0E49\\u0E2D\\u0E21\\u0E39\\u0E25\\u0E01\\u0E32\\u0E23\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\\u0E01\\u0E32\\u0E23\\u0E1B\\u0E23\\u0E31\\u0E1A\\u0E41\\u0E15\\u0E48\\u0E07\nTransportInformation.Description=\\u0E2A\\u0E48\\u0E27\\u0E19\\u0E1B\\u0E23\\u0E30\\u0E01\\u0E2D\\u0E1A\\u0E17\\u0E35\\u0E48\\u0E08\\u0E30\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E41\\u0E25\\u0E30\\u0E15\\u0E23\\u0E27\\u0E08\\u0E2A\\u0E2D\\u0E1A\\u0E04\\u0E27\\u0E32\\u0E21\\u0E16\\u0E39\\u0E01\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E02\\u0E2D\\u0E07\\u0E1F\\u0E34\\u0E25\\u0E14\\u0E4C\\u0E17\\u0E35\\u0E48\\u0E40\\u0E01\\u0E35\\u0E48\\u0E22\\u0E27\\u0E02\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E31\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\\u0E01\\u0E32\\u0E23\\u0E1B\\u0E23\\u0E31\\u0E1A\\u0E41\\u0E15\\u0E48\\u0E07\nLabel.Transport=\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\nMessage.EmptyTransport=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E23\\u0E30\\u0E1A\\u0E38\\u0E01\\u0E32\\u0E23\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\\u0E17\\u0E35\\u0E48\\u0E16\\u0E39\\u0E01\\u0E15\\u0E49\\u0E2D\\u0E07 \\u0E40\\u0E21\\u0E37\\u0E48\\u0E2D\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E04\\u0E33\\u0E02\\u0E2D\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15 \\u0E43\\u0E2B\\u0E49\\u0E43\\u0E0A\\u0E49 SE09\nColumn.Description=\\u0E04\\u0E33\\u0E2D\\u0E18\\u0E34\\u0E1A\\u0E32\\u0E22\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=\\u0E01\\u0E32\\u0E23\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\\u0E17\\u0E35\\u0E48\\u0E04\\u0E49\\u0E32\\u0E07\\u0E2D\\u0E22\\u0E39\\u0E48\nAssignedTransportId=ID\nAssignedTransportDescription=\\u0E04\\u0E33\\u0E2D\\u0E18\\u0E34\\u0E1A\\u0E32\\u0E22\nAssignedTransportOwner=\\u0E40\\u0E08\\u0E49\\u0E32\\u0E02\\u0E2D\\u0E07\nTooltip.AssignedSortSettingsButton=\\u0E08\\u0E31\\u0E14\\u0E40\\u0E23\\u0E35\\u0E22\\u0E07\nAssignedSortSettingsButton=\\u0E08\\u0E31\\u0E14\\u0E40\\u0E23\\u0E35\\u0E22\\u0E07\nAssignButton=\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\nMessage.TransportTableNoData=\\u0E44\\u0E21\\u0E48\\u0E21\\u0E35\\u0E01\\u0E32\\u0E23\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\\u0E17\\u0E35\\u0E48\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\nIconTabFilterText=\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15 ({0})\nTransportDialog.Title=\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E04\\u0E33\\u0E02\\u0E2D\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\nTransportDialog.Button.Cancel=\\u0E22\\u0E01\\u0E40\\u0E25\\u0E34\\u0E01\nTransportDialog.Button.Assign=\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E40\\u0E15\\u0E47\\u0E21\\u0E02\\u0E2D\\u0E07\\u0E40\\u0E08\\u0E49\\u0E32\\u0E02\\u0E2D\\u0E07\nMessage.TransportNotAllowed=\\u0E2D\\u0E2D\\u0E1A\\u0E40\\u0E08\\u0E04\\u0E43\\u0E19 Namespace \\u0E25\\u0E39\\u0E01\\u0E04\\u0E49\\u0E32\\u0E44\\u0E21\\u0E48\\u0E16\\u0E39\\u0E01\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\\u0E20\\u0E32\\u0E22\\u0E43\\u0E19 Landscape \\u0E01\\u0E32\\u0E23\\u0E1E\\u0E31\\u0E12\\u0E19\\u0E32\\u0E02\\u0E2D\\u0E07 SAP\nMessage.AssignedToTransport=ID {0} \\u0E16\\u0E39\\u0E01\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E43\\u0E2B\\u0E49\\u0E01\\u0E31\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\\u0E41\\u0E25\\u0E49\\u0E27\\u0E2D\\u0E22\\u0E48\\u0E32\\u0E07\\u0E19\\u0E49\\u0E2D\\u0E22\\u0E2B\\u0E19\\u0E36\\u0E48\\u0E07\\u0E23\\u0E32\\u0E22\\u0E01\\u0E32\\u0E23\n',
	"sap/ushell_abap/transport/i18n/i18n_tr.properties":'\nTransportInformation.Title=Ta\\u015F\\u0131ma bilgilerini uyarlama\nTransportInformation.Description=Ta\\u015F\\u0131may\\u0131 uyarlama ile ili\\u015Fkili alanlar\\u0131 g\\u00F6r\\u00FCnt\\u00FClemek ve do\\u011Frulamak i\\u00E7in bile\\u015Fen\nLabel.Transport=Ta\\u015F\\u0131ma\nMessage.EmptyTransport=Ge\\u00E7erli ta\\u015F\\u0131ma sa\\u011Flay\\u0131n. Ta\\u015F\\u0131ma talepleri olu\\u015Fturmak i\\u00E7in SE09\'u kullan\\u0131n.\nColumn.Description=Tan\\u0131m\nColumn.ID=Tan\\u0131t\\u0131c\\u0131\nMessage.TransportTableOverflowToolbarHeader=Ta\\u015F\\u0131malar\\u0131 a\\u00E7\nAssignedTransportId=Tan\\u0131t\\u0131c\\u0131\nAssignedTransportDescription=Tan\\u0131m\nAssignedTransportOwner=Sahip\nTooltip.AssignedSortSettingsButton=S\\u0131rala\nAssignedSortSettingsButton=S\\u0131rala\nAssignButton=Tayin et\nMessage.TransportTableNoData=Tayin edilen ta\\u015F\\u0131ma yok\nIconTabFilterText=Ta\\u015F\\u0131malar ({0})\nTransportDialog.Title=Ta\\u015F\\u0131ma talebi tayin et\nTransportDialog.Button.Cancel=\\u0130ptal et\nTransportDialog.Button.Assign=Tayin et\nMessage.SortDialogId=Tan\\u0131t\\u0131c\\u0131\nMessage.SortDialogOwnerFullname=Sahibin tam ad\\u0131\nMessage.TransportNotAllowed=M\\u00FC\\u015Fteri ad alanlar\\u0131ndaki nesneler, SAP geli\\u015Ftirme altyap\\u0131lar\\u0131nda ta\\u015F\\u0131nmaz.\nMessage.AssignedToTransport={0} tan\\u0131t\\u0131c\\u0131s\\u0131 zaten en az bir ta\\u015F\\u0131mada tayinli.\n',
	"sap/ushell_abap/transport/i18n/i18n_uk.properties":'\nTransportInformation.Title=\\u0406\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0456\\u044F \\u043F\\u0440\\u043E \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F \\u043D\\u0430\\u043B\\u0430\\u0448\\u0442\\u0443\\u0432\\u0430\\u043D\\u043D\\u044F\nTransportInformation.Description=\\u041A\\u043E\\u043C\\u043F\\u043E\\u043D\\u0435\\u043D\\u0442 \\u0434\\u043B\\u044F \\u0432\\u0456\\u0434\\u043E\\u0431\\u0440\\u0430\\u0436\\u0435\\u043D\\u043D\\u044F \\u0456 \\u043F\\u0435\\u0440\\u0435\\u0432\\u0456\\u0440\\u043A\\u0438 \\u043F\\u043E\\u043B\\u0456\\u0432, \\u0440\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u043D\\u0438\\u0445 \\u0434\\u043B\\u044F \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F \\u043D\\u0430\\u043B\\u0430\\u0448\\u0442\\u0443\\u0432\\u0430\\u043D\\u043D\\u044F\nLabel.Transport=\\u041F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F\nMessage.EmptyTransport=\\u0412\\u043A\\u0430\\u0436\\u0456\\u0442\\u044C \\u0434\\u0456\\u0439\\u0441\\u043D\\u0435 \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F. \\u0414\\u043B\\u044F \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u043D\\u044F \\u0437\\u0430\\u043F\\u0438\\u0442\\u0456\\u0432 \\u043D\\u0430 \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F \\u0432\\u0438\\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0430\\u0439\\u0442\\u0435 SE09.\nColumn.Description=\\u041E\\u043F\\u0438\\u0441\nColumn.ID=\\u0406\\u0414\nMessage.TransportTableOverflowToolbarHeader=\\u0412\\u0456\\u0434\\u043A\\u0440\\u0438\\u0442\\u0438 \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F\nAssignedTransportId=\\u0406\\u0414\nAssignedTransportDescription=\\u041E\\u043F\\u0438\\u0441\nAssignedTransportOwner=\\u0412\\u043B\\u0430\\u0441\\u043D\\u0438\\u043A\nTooltip.AssignedSortSettingsButton=\\u0421\\u043E\\u0440\\u0442\\u0443\\u0432\\u0430\\u0442\\u0438\nAssignedSortSettingsButton=\\u0421\\u043E\\u0440\\u0442\\u0443\\u0432\\u0430\\u0442\\u0438\nAssignButton=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0457\\u0442\\u0438\nMessage.TransportTableNoData=\\u041D\\u0435\\u043C\\u0430\\u0454 \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0454\\u043D\\u0438\\u0445 \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u044C\nIconTabFilterText=\\u041F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F ({0})\nTransportDialog.Title=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0457\\u0442\\u0438 \\u0437\\u0430\\u043F\\u0438\\u0442 \\u043D\\u0430 \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F\nTransportDialog.Button.Cancel=\\u0421\\u043A\\u0430\\u0441\\u0443\\u0432\\u0430\\u0442\\u0438\nTransportDialog.Button.Assign=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0457\\u0442\\u0438\nMessage.SortDialogId=\\u0406\\u0414\nMessage.SortDialogOwnerFullname=\\u041F\\u043E\\u0432\\u043D\\u0435 \\u0456\\u043C\'\\u044F \\u0432\\u043B\\u0430\\u0441\\u043D\\u0438\\u043A\\u0430\nMessage.TransportNotAllowed=\\u041E\\u0431\\u2019\\u0454\\u043A\\u0442\\u0438 \\u0432 \\u043F\\u0440\\u043E\\u0441\\u0442\\u043E\\u0440\\u0430\\u0445 \\u0456\\u043C\\u0435\\u043D \\u043A\\u043B\\u0456\\u0454\\u043D\\u0442\\u0430 \\u043D\\u0435 \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u044F\\u0442\\u044C\\u0441\\u044F \\u0432 \\u043C\\u0435\\u0436\\u0430\\u0445 \\u043B\\u0430\\u043D\\u0434\\u0448\\u0430\\u0444\\u0442\\u0456\\u0432 \\u0440\\u043E\\u0437\\u0440\\u043E\\u0431\\u043A\\u0438 SAP.\nMessage.AssignedToTransport=\\u0406\\u0414 {0} \\u0432\\u0436\\u0435 \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0454\\u043D\\u043E \\u0434\\u043E \\u043F\\u0440\\u0438\\u043D\\u0430\\u0439\\u043C\\u043D\\u0456 \\u043E\\u0434\\u043D\\u043E\\u0433\\u043E \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F.\n',
	"sap/ushell_abap/transport/i18n/i18n_vi.properties":'\nTransportInformation.Title=Th\\u00F4ng tin chuy\\u00EA\\u0309n tu\\u0300y chi\\u0309nh\nTransportInformation.Description=Tha\\u0300nh ph\\u00E2\\u0300n \\u0111\\u00EA\\u0309 hi\\u00EA\\u0309n thi\\u0323 va\\u0300 xa\\u0301c th\\u01B0\\u0323c tr\\u01B0\\u01A1\\u0300ng li\\u00EAn quan \\u0111\\u00EA\\u0301n chuy\\u00EA\\u0309n tu\\u0300y chi\\u0309nh\nLabel.Transport=V\\u1EADn chuy\\u1EC3n\nMessage.EmptyTransport=Vui lo\\u0300ng cung c\\u00E2\\u0301p chuy\\u00EA\\u0309n h\\u01A1\\u0323p l\\u00EA\\u0323. \\u0110\\u00EA\\u0309 ta\\u0323o y\\u00EAu c\\u00E2\\u0300u chuy\\u00EA\\u0309n, ha\\u0303y s\\u01B0\\u0309 du\\u0323ng SE09.\nColumn.Description=M\\u00F4 ta\\u0309\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=M\\u1EDF chuy\\u00EA\\u0309n ta\\u0309i\nAssignedTransportId=ID\nAssignedTransportDescription=M\\u00F4 ta\\u0309\nAssignedTransportOwner=Ch\\u1EE7 s\\u1EDF h\\u1EEFu\nTooltip.AssignedSortSettingsButton=S\\u0103\\u0301p x\\u00EA\\u0301p\nAssignedSortSettingsButton=S\\u0103\\u0301p x\\u00EA\\u0301p\nAssignButton=Ga\\u0301n\nMessage.TransportTableNoData=Kh\\u00F4ng c\\u00F3 chuy\\u1EC3n t\\u1EA3i \\u0111\\u01B0\\u1EE3c g\\u00E1n\nIconTabFilterText=Chuy\\u1EC3n t\\u1EA3i ({0})\nTransportDialog.Title=Ga\\u0301n y\\u00EAu c\\u00E2\\u0300u chuy\\u00EA\\u0309n ta\\u0309i\nTransportDialog.Button.Cancel=Hu\\u0309y\nTransportDialog.Button.Assign=Ga\\u0301n\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=H\\u1ECD t\\u00EAn chu\\u0309 s\\u1EDF h\\u1EEFu\nMessage.TransportNotAllowed=\\u0110\\u00F4\\u0301i t\\u01B0\\u01A1\\u0323ng trong vu\\u0300ng t\\u00EAn kha\\u0301ch ha\\u0300ng kh\\u00F4ng \\u0111\\u01B0\\u01A1\\u0323c chuy\\u00EA\\u0309n trong h\\u00EA\\u0323 th\\u00F4\\u0301ng pha\\u0301t tri\\u00EA\\u0309n SAP.\nMessage.AssignedToTransport={0} ID \\u0111a\\u0303 \\u0111\\u01B0\\u01A1\\u0323c ga\\u0301n cho i\\u0301t nh\\u00E2\\u0301t m\\u00F4\\u0323t l\\u00E2\\u0300n chuy\\u00EA\\u0309n.\n',
	"sap/ushell_abap/transport/i18n/i18n_zh_CN.properties":'\nTransportInformation.Title=\\u5B9A\\u5236\\u4F20\\u8F93\\u4FE1\\u606F\nTransportInformation.Description=\\u7528\\u4E8E\\u663E\\u793A\\u548C\\u9A8C\\u8BC1\\u5B9A\\u5236\\u4F20\\u8F93\\u76F8\\u5173\\u5B57\\u6BB5\\u7684\\u7EC4\\u4EF6\nLabel.Transport=\\u4F20\\u8F93\nMessage.EmptyTransport=\\u8BF7\\u63D0\\u4F9B\\u6709\\u6548\\u7684\\u4F20\\u8F93\\u3002\\u8981\\u521B\\u5EFA\\u4F20\\u8F93\\u8BF7\\u6C42\\uFF0C\\u8BF7\\u4F7F\\u7528 SE09\\u3002\nColumn.Description=\\u63CF\\u8FF0\nColumn.ID=\\u6807\\u8BC6\nMessage.TransportTableOverflowToolbarHeader=\\u672A\\u5B8C\\u6210\\u7684\\u4F20\\u8F93\nAssignedTransportId=\\u6807\\u8BC6\nAssignedTransportDescription=\\u63CF\\u8FF0\nAssignedTransportOwner=\\u6240\\u6709\\u8005\nTooltip.AssignedSortSettingsButton=\\u6392\\u5E8F\nAssignedSortSettingsButton=\\u6392\\u5E8F\nAssignButton=\\u5206\\u914D\nMessage.TransportTableNoData=\\u672A\\u5206\\u914D\\u4F20\\u8F93\nIconTabFilterText=\\u4F20\\u8F93 ({0})\nTransportDialog.Title=\\u5206\\u914D\\u4F20\\u8F93\\u8BF7\\u6C42\nTransportDialog.Button.Cancel=\\u53D6\\u6D88\nTransportDialog.Button.Assign=\\u5206\\u914D\nMessage.SortDialogId=\\u6807\\u8BC6\nMessage.SortDialogOwnerFullname=\\u6240\\u6709\\u8005\\u7684\\u5168\\u540D\nMessage.TransportNotAllowed=\\u5728 SAP \\u5F00\\u53D1\\u67B6\\u6784\\u5185\\u672A\\u4F20\\u8F93\\u5BA2\\u6237\\u547D\\u540D\\u7A7A\\u95F4\\u4E2D\\u7684\\u5BF9\\u8C61\\u3002\nMessage.AssignedToTransport={0} \\u6807\\u8BC6\\u5DF2\\u81F3\\u5C11\\u5206\\u914D\\u5230\\u4E00\\u4E2A\\u4F20\\u8F93\\u3002\n',
	"sap/ushell_abap/transport/i18n/i18n_zh_TW.properties":'\nTransportInformation.Title=\\u81EA\\u8A02\\u50B3\\u8F38\\u8CC7\\u8A0A\nTransportInformation.Description=\\u5143\\u4EF6\\u53EF\\u986F\\u793A\\u548C\\u9A57\\u8B49\\u81EA\\u8A02\\u50B3\\u8F38\\u7684\\u76F8\\u95DC\\u6B04\\u4F4D\nLabel.Transport=\\u50B3\\u8F38\nMessage.EmptyTransport=\\u8ACB\\u63D0\\u4F9B\\u6709\\u6548\\u50B3\\u8F38\\u3002\\u82E5\\u8981\\u5EFA\\u7ACB\\u50B3\\u8F38\\u8ACB\\u6C42\\uFF0C\\u8ACB\\u4F7F\\u7528 SE09\\u3002\nColumn.Description=\\u8AAA\\u660E\nColumn.ID=ID\nMessage.TransportTableOverflowToolbarHeader=\\u958B\\u59CB\\u50B3\\u8F38\nAssignedTransportId=ID\nAssignedTransportDescription=\\u8AAA\\u660E\nAssignedTransportOwner=\\u6240\\u6709\\u4EBA\nTooltip.AssignedSortSettingsButton=\\u6392\\u5E8F\nAssignedSortSettingsButton=\\u6392\\u5E8F\nAssignButton=\\u6307\\u6D3E\nMessage.TransportTableNoData=\\u7121\\u6307\\u6D3E\\u7684\\u50B3\\u8F38\nIconTabFilterText=\\u50B3\\u8F38 ({0})\nTransportDialog.Title=\\u6307\\u6D3E\\u50B3\\u8F38\\u8ACB\\u6C42\nTransportDialog.Button.Cancel=\\u53D6\\u6D88\nTransportDialog.Button.Assign=\\u6307\\u6D3E\nMessage.SortDialogId=ID\nMessage.SortDialogOwnerFullname=\\u6240\\u6709\\u4EBA\\u5168\\u540D\nMessage.TransportNotAllowed=\\u5BA2\\u6236\\u540D\\u7A31\\u7A7A\\u9593\\u4E2D\\u7684\\u7269\\u4EF6\\u4E0D\\u6703\\u5728 SAP \\u958B\\u767C\\u67B6\\u69CB\\u4E2D\\u50B3\\u8F38\\u3002\nMessage.AssignedToTransport=\\u5DF2\\u5C07 {0} ID \\u6307\\u6D3E\\u7D66\\u81F3\\u5C11\\u4E00\\u500B\\u50B3\\u8F38\\u3002\n',
	"sap/ushell_abap/transport/manifest.json":'{\n  "_version": "1.21.0",\n  "sap.app": {\n    "_version": "1.1.0",\n    "i18n": {\n      "bundleUrl": "i18n/i18n.properties",\n      "supportedLocales": [\n        ""\n      ],\n      "fallbackLocale": ""\n    },\n    "id": "sap.ushell_abap.transport",\n    "type": "component",\n    "embeddedBy": "",\n    "title": "{{TransportInformation.Title}}",\n    "description": "{{TransportInformation.Description}}",\n    "ach": "CA-FLP-FE-UI",\n    "cdsViews": [],\n    "offline": false,\n    "dataSources": {\n      "TransportService": {\n        "uri": "/sap/opu/odata/UI2/FDM_TRANSPORT_SRV/",\n        "type": "OData",\n        "settings": {\n          "odataVersion": "2.0"\n        }\n      }\n    }\n  },\n  "sap.ui": {\n    "_version": "1.1.0",\n    "technology": "UI5",\n    "icons": {\n    },\n    "deviceTypes": {\n      "desktop": true,\n      "tablet": false,\n      "phone": false\n    },\n    "fullWidth": true\n  },\n  "sap.ui5": {\n    "_version": "1.1.0",\n    "resources": {\n      "js": [],\n      "css": []\n    },\n    "dependencies": {\n      "libs": {\n        "sap.m": {\n          "minVersion": "1.68"\n        },\n        "sap.ui.layout": {\n          "minVersion": "1.68"\n        }\n      }\n    },\n    "models": {\n      "i18n": {\n        "type": "sap.ui.model.resource.ResourceModel",\n        "uri": "i18n/i18n.properties",\n        "settings": {\n          "supportedLocales": [\n            ""\n          ],\n          "fallbackLocale": ""\n        }\n      },\n      "Transport": {\n        "dataSource": "TransportService",\n        "preload": true,\n        "settings": {\n          "defaultCountMode": "None",\n          "skipMetadataAnnotationParsing": true,\n          "useBatch": true,\n          "metadataUrlParams": {\n            "sap-value-list": "none"\n          }\n        }\n      }\n    },\n    "rootView": {\n      "viewName": "sap.ushell_abap.transport.view.TransportInformation",\n      "type": "XML",\n      "async": true,\n      "id": "app-transport"\n    },\n    "handleValidation": false,\n    "config": {\n      "fullWidth": true\n    },\n    "routing": {},\n    "contentDensities": {\n      "compact": true,\n      "cozy": true\n    }\n  }\n}\n',
	"sap/ushell_abap/transport/view/SortDialog.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core">\n    <ViewSettingsDialog\n            confirm="handleSortDialogConfirm">\n        <sortItems>\n            <ViewSettingsItem text="{i18n>Message.SortDialogId}" key="id" selected="true"/>\n            <ViewSettingsItem text="{i18n>Message.SortDialogOwnerFullname}" key="ownerFullname" />\n        </sortItems>\n    </ViewSettingsDialog>\n</core:FragmentDefinition>',
	"sap/ushell_abap/transport/view/TransportDialog.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core">\n    <Dialog id="transportDialog"\n            title="{i18n>TransportDialog.Title}"\n            contentWidth="470px"\n            beforeOpen=".onBeforeOpen">\n        <content>\n            <core:ComponentContainer id="transportContainer" lifecycle="Application"/>\n        </content>\n        <beginButton>\n            <Button id="transportDialogSaveButton"\n                    text="{i18n>TransportDialog.Button.Assign}"\n                    press=".onSave"\n                    type="Emphasized"/>\n        </beginButton>\n        <endButton>\n            <Button id="transportDialogCancelButton" text="{i18n>TransportDialog.Button.Cancel}" press=".onCancel"/>\n        </endButton>\n    </Dialog>\n</core:FragmentDefinition>',
	"sap/ushell_abap/transport/view/TransportInformation.view.xml":'<mvc:View\n        xmlns="sap.m"\n        xmlns:form="sap.ui.layout.form"\n        xmlns:mvc="sap.ui.core.mvc"\n        xmlns:core="sap.ui.core"\n        core:require="{\n            formatMessage: \'sap/base/strings/formatMessage\'\n        }"\n        controllerName="sap.ushell_abap.transport.controller.TransportInformation">\n\n    <MessageStrip\n            id="transportNotAllowedMessage"\n            visible="{= !${TransportInformation>/transportAllowed}}"\n            text="{i18n>Message.TransportNotAllowed}"\n            showIcon="true"\n            class="sapUiSmallMarginTop sapUiSmallMarginBegin sapUiSmallMarginEnd"\n            showCloseButton="false">\n    </MessageStrip>\n\n    <MessageStrip\n            id="assignedToTransportMessage"\n            visible="{= ${TransportInformation>/assignedToTransport}}"\n            text="{\n                parts: [\'i18n>Message.AssignedToTransport\', \'TransportInformation>/objectType\'],\n                formatter: \'formatMessage\'\n            }"\n            showIcon="true"\n            class="sapUiSmallMarginTop sapUiSmallMarginBegin sapUiSmallMarginEnd"\n            showCloseButton="false">\n    </MessageStrip>\n\n    <form:SimpleForm editable="true" validateFieldGroup=".onValidation">\n        <Label text="{i18n>Label.Transport}"/>\n        <Input id="transportInput"\n               class="sapUiSmallMarginBottom"\n               maxLength="60"\n               textFormatMode="ValueKey"\n               required="{TransportInformation>/required}"\n               visible="{TransportInformation>/transportAllowed}"\n               change=".onTransportChange"\n               valueStateText="{i18n>Message.EmptyTransport}"\n               valueState="{TransportInformation>/valueState}"\n               value="{TransportInformation>/value}"\n               startSuggestion="0"\n               filterSuggests="false"\n               showSuggestion="true"\n               showTableSuggestionValueHelp="false"\n               suggestionItemSelected=".onTransportChange"\n               suggestionRows="{TransportInformation>/transports}"\n               fieldGroupIds="transportGroup">\n            <suggestionColumns>\n                <Column width="40%">\n                    <Label text="{i18n>Column.ID}"/>\n                </Column>\n                <Column width="60%">\n                    <Label text="{i18n>Column.Description}"/>\n                </Column>\n            </suggestionColumns>\n            <suggestionRows>\n                <ColumnListItem>\n                    <cells>\n                        <Label text="{TransportInformation>id}"/>\n                        <Label text="{TransportInformation>description}"/>\n                    </cells>\n                </ColumnListItem>\n            </suggestionRows>\n        </Input>\n    </form:SimpleForm>\n</mvc:View>\n',
	"sap/ushell_abap/transport/view/TransportTable.view.xml":'<mvc:View\n        xmlns="sap.m"\n        xmlns:form="sap.ui.layout.form"\n        xmlns:mvc="sap.ui.core.mvc"\n        controllerName="sap.ushell_abap.transport.controller.TransportTable">\n    <Table id="assignedTransportTable" class="sapUiResponsiveContentPadding" noDataText="{i18n>Message.TransportTableNoData}">\n        <headerToolbar>\n            <OverflowToolbar id="assignedTransportOverflowToolbar">\n                <ToolbarSpacer/>\n                <Button\n                        id="assignedTransportOverflowToolbarAssignButton"\n                        text="{i18n>AssignButton}"\n\n                        visible="{=\n                            ${ViewSettings>/showAssignButton} &amp;&amp;\n                            ${TransportInformation>/transportAllowed} &amp;&amp;\n                            ${SupportedOperations>/assignTransportSupported}\n                        }"\n                        press=".onAssign"/>\n\n                <OverflowToolbarButton\n                        id="assignedTransportSortButton"\n                        icon="sap-icon://sort"\n                        type="Transparent"\n                        press=".onSort"\n                        text="{i18n>Tooltip.AssignedSortSettingsButton}"\n                        tooltip="{i18n>Tooltip.AssignedSortSettingsButton}"/>\n            </OverflowToolbar>\n        </headerToolbar>\n        <columns>\n            <Column id="columnAssignedTransportId">\n                <Text text="{i18n>AssignedTransportId}"/>\n            </Column>\n            <Column id="columnAssignedTransportDescription">\n                <Text text="{i18n>AssignedTransportDescription}"/>\n            </Column>\n            <Column id="columnAssignedTransportOwner">\n                <Text text="{i18n>AssignedTransportOwner}"/>\n            </Column>\n        </columns>\n        <dependents>\n            <ColumnListItem id="assignedTransportTemplate">\n                <cells>\n                    <Text text="{Transport>id}"/>\n                    <Text text="{Transport>description}"/>\n                    <Text text="{Transport>ownerFullname}"/>\n                </cells>\n            </ColumnListItem>\n        </dependents>\n    </Table>\n</mvc:View>'
},"Component-preload"
);
