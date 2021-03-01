// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview The file provides helper functions for PagesCommonDataModelAdater.
 *
 * @version 1.86.3
 * @private
 */
sap.ui.define([
    "sap/ushell/adapters/cdm/util/AppForInbound",
    "sap/base/Log",
    "sap/ushell/adapters/cdm/v3/utilsCdm"
], function (AppForInbound, Log, utilsCdm) {
    "use strict";

    var cdmSiteUtils = {
        _VISUALIZATION_TYPES: {
            STATIC_TILE: "sap.ushell.StaticAppLauncher",
            DYNAMIC_TILE: "sap.ushell.DynamicAppLauncher"
        }
    };

    /**
     * Returns all available visualizations from the given visualization data.
     *
     * @param {object} visualizationData Visualization data as a hash map (@see sap.ushell.services.VisualizationDataProvider#getVisualizationData).
     * @param {object} urlParsing The UrlParsing Service
     * @returns {object} An object with all visualizations.
     *
     * @since 1.75.0
     * @private
     */
    cdmSiteUtils.getVisualizations = function (visualizationData, urlParsing) {
        var oVisualizations = {};

        Object.keys(visualizationData).forEach(function (vizKey) {
            var oVisualizationData = visualizationData[vizKey];
            var sVizType;

            if (oVisualizationData.isCustomTile) {
                sVizType = oVisualizationData._instantiationData.catalogTile.baseChipId;
            } else if (oVisualizationData.indicatorDataSource) {
                sVizType = this._VISUALIZATION_TYPES.DYNAMIC_TILE;
            } else {
                sVizType = this._VISUALIZATION_TYPES.STATIC_TILE;
            }

            var oVisualization = {
                vizType: sVizType,
                vizConfig: {
                    "sap.app": {
                        title: oVisualizationData.title,
                        subTitle: oVisualizationData.subTitle,
                        info: oVisualizationData.info
                    },
                    "sap.ui": {
                        icons: {
                            icon: oVisualizationData.icon
                        }
                    },
                    "sap.flp": {
                        tileSize: oVisualizationData.size,
                        indicatorDataSource: oVisualizationData.indicatorDataSource,
                        numberUnit: oVisualizationData.numberUnit
                    }
                }
            };

            // For non custom tiles the instantiationData is not set, so cdm tiles are used in the abap scenario.
            if (oVisualizationData.isCustomTile) {
                oVisualization.vizConfig["sap.flp"]._instantiationData = oVisualizationData._instantiationData;
            }

            oVisualization.vizConfig["sap.flp"].target = utilsCdm.toTargetFromHash(oVisualizationData.url, urlParsing);

            oVisualizations[vizKey] = oVisualization;
        }.bind(this));

        return oVisualizations;
    };

    /**
     * Returns applications with the given navigation data.
     *
     * An empty object is returned for an app which cannot be created.
     *
     * @param {object} navigationData Navigation data as hash map.
     * @returns {objects} Dereferenced applications object.
     *
     * @since 1.75.0
     * @private
     */
    cdmSiteUtils.getApplications = function (navigationData) {

        return Object.keys(navigationData).reduce(function (oApplications, navigationDataId) {
            var oInbound = navigationData[navigationDataId],
                sInboundPermanentKey = oInbound.permanentKey || oInbound.id;

            // the navigation data ID becomes the application ID
            try {
                oApplications[sInboundPermanentKey] = AppForInbound.get(navigationDataId, oInbound);
            } catch (error) {
                Log.error("Unable to dereference app '" + navigationDataId + "' of CDM page.");
                oApplications[navigationDataId] = {};
            }

            return oApplications;
        }, {});
    };

    /**
     * Returns built-in visualization types.
     *
     * Currently there is only the generic platform visualization type that indicates
     * that the visualization has to be created in a platform-dependent way.
     *
     * @param {object} visualizationData Visualization data as a hash map (@see sap.ushell.services.VisualizationDataProvider#getVisualizationData).
     *
     * @returns {object} Visualization types
     *
     * @since 1.75.0
     * @private
     */
    cdmSiteUtils.getVizTypes = function (visualizationData) {
        return Object.keys(visualizationData)
            .filter(function (sVizKey) {
                var oVisualizationData = visualizationData[sVizKey];
                return oVisualizationData.isCustomTile;
            })
            .reduce(function (oVizTypes, sVizKey) {
                var oVisualizationData = visualizationData[sVizKey];
                var oCatalogTile = oVisualizationData._instantiationData.catalogTile;

                var sVizTypeId = oCatalogTile.baseChipId;
                if (!oVizTypes[sVizTypeId]) {
                    oVizTypes[sVizTypeId] = {
                        "sap.app": {
                            id: sVizTypeId,
                            type: "platformVisualization"
                        },
                        "sap.flp": {
                            vizOptions: {
                                displayFormats: this._getDisplayFormats(oCatalogTile)
                            }
                        }
                    };
                }

                return oVizTypes;
            }.bind(this), {});
    };

    /**
     * Returns the supported & default display format options for a particular catalog tile.
     * It uses the "types" contract and implements special handling for news tiles.
     *
     * @param {object} catalogTile A catalog tile (CHIP Instance)
     *
     * @returns {object} Display formats
     *
     * @since 1.86
     * @private
     */
    cdmSiteUtils._getDisplayFormats = function (catalogTile) {
        // Default displayFormat configuration if the types contract is not available.
        var aAvailableTypes = ["standard"];
        var sDefaultType = "standard";

        if (catalogTile.contracts.types) {
            // Get available types & default type from chip contract.
            aAvailableTypes = catalogTile.contracts.types.availableTypes;
            sDefaultType = catalogTile.contracts.types.defaultType;
        } else if (catalogTile.configuration.row === "1" && catalogTile.configuration.col === "2") {
            // Special case for news tile which don't have a types contract but instead set row & col configuration parameter.
            aAvailableTypes = ["standardWide"];
            sDefaultType = "standardWide";
        }

        return {
            supported: aAvailableTypes,
            default: sDefaultType
        };
    };

    return cdmSiteUtils;

});
