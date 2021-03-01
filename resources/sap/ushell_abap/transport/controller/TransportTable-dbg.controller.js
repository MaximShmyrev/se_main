// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

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