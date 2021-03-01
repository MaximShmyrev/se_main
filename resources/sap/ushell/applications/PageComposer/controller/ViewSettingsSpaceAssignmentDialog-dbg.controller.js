// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Sorter"
], function (
    Controller,
    Sorter
) {
    "use strict";
    var mSpaceAssignmentTable = {
            id: "spaceAssignmentColumnSpaceId",
            description: "spaceAssignmentColumnSpaceDescription",
            title: "spaceAssignmentColumnSpaceTitle"

    };

    return Controller.extend("sap.ushell.applications.PageComposer.controller.ViewSettingsSpaceAssignmentCreated", {
        constructor: function (PageDetailController) {
            this.PageDetailController = PageDetailController;
        },

        /**
         * Applies the applicable sorters and filters for the given viewSettingsDialog confirm event.
         *
         * @param {sap.ui.base.Event} oEvent The confirm event of the viewSettingsDialog.
         *
         * @private
         */
        handleSpaceAssignmentDialogConfirm: function (oEvent) {
            var mParams = oEvent.getParameters(),
                sCurrentTableId = "spaceAssignmentTable",
                oTable = this.PageDetailController.byId(sCurrentTableId),
                oBinding = oTable.getBinding("items");

            if (mParams.sortItem) {
                oBinding.sort(new Sorter(mParams.sortItem.getKey(), mParams.sortDescending));
                this.PageDetailController.updateSortIndicators(mParams.sortItem.getKey(), mParams.sortDescending, mSpaceAssignmentTable, oTable.getColumns());

            } else {
                oBinding.sort(new Sorter("id", true));
                this.PageDetailController.updateSortIndicators("id", true, mSpaceAssignmentTable, oTable.getColumns());
            }
        }
    });
});