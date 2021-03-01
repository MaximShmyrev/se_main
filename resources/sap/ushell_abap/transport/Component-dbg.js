//Copyright (c) 2009-2020 SAP SE, All Rights Reserved

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
