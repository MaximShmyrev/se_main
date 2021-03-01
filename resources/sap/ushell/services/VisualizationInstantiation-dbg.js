// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview This module deals with the instantiation of visualizations in a platform independent way.
 * @version 1.86.3
 */
sap.ui.define([
    "sap/ushell/services/_VisualizationInstantiation/VizInstance",
    "sap/ushell/services/_VisualizationInstantiation/VizInstanceAbap",
    "sap/ushell/services/_VisualizationInstantiation/VizInstanceCdm",
    "sap/ushell/services/_VisualizationInstantiation/VizInstanceLaunchPage",
    "sap/ushell/services/_VisualizationInstantiation/VizInstanceLink",
    "sap/m/library",
    "sap/ushell/library",
    "sap/base/util/ObjectPath",
    "sap/ushell/EventHub",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations"
], function (
    VizInstance,
    VizInstanceAbap,
    VizInstanceCdm,
    VizInstanceLaunchPage,
    VizInstanceLink,
    MobileLibrary,
    ushellLibrary,
    ObjectPath,
    EventHub,
    readVisualizations
) {
    "use strict";

    var LoadState = MobileLibrary.LoadState;
    var DisplayFormat = ushellLibrary.DisplayFormat;

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("VisualizationInstantiation")</code>.
     * Constructs a new instance of the VisualizationInstantiation service.
     *
     * @namespace sap.ushell.services.VisualizationInstantiation
     *
     * @constructor
     * @class
     * @see {@link sap.ushell.services.Container#getService}
     * @since 1.77.0
     *
     * @private
     */
    function VisualizationInstantiation () {}

    /**
     * A factory function to create a VizInstance of type corresponding to source platform {ABAP|CDM|LINK|LAUNCHPAGE}
     *
     * @param {object} vizData VisualizationData for one single visualization
     * @param {object} vizType The CDM vizType which is used to determine the supported display formats
     * e.g. StaticAppLauncher, DynamicAppLauncher or custom
     *
     * @returns {sap.ushell.ui.launchpad.VizInstance} A VizInstance based on the source platform
     * @since 1.77
     */
    VisualizationInstantiation.prototype.instantiateVisualization = function (vizData, vizType) {
        var oVizInstance;
        var sPlatform = ObjectPath.get("_instantiationData.platform", vizData);
        var aSupportedDisplayFormats = ObjectPath.get(["sap.flp", "vizOptions", "displayFormats", "supported"], vizType);

        var aMappedDisplayFormats = aSupportedDisplayFormats || [DisplayFormat.Standard, DisplayFormat.Compact];

        var oVizInstanceData = {
            title: vizData.title,
            subtitle: vizData.subtitle,
            info: vizData.info,
            icon: vizData.icon,
            keywords: vizData.keywords,
            instantiationData: vizData._instantiationData,
            indicatorDataSource: vizData.indicatorDataSource,
            dataSource: vizData.dataSource,
            contentProviderId: vizData.contentProviderId,
            vizConfig: vizData.vizConfig,
            supportedDisplayFormats: aMappedDisplayFormats,
            displayFormat: this._getDisplayFormat(vizData.displayFormatHint, aMappedDisplayFormats),
            numberUnit: vizData.numberUnit,
            dataHelpId: vizData.vizId
        };

        // This prevents the path to be used as a binding path... yes its ugly... deal with it!
        if (oVizInstanceData.indicatorDataSource) {
            oVizInstanceData.indicatorDataSource.ui5object = true;
        }

        // Use VizInstanceLink instead of platform VizInstance in case the displayFormat is "compact"
        if ((sPlatform === "ABAP" || sPlatform === "CDM") && oVizInstanceData.displayFormat === DisplayFormat.Compact) {
            this._cleanInstantiationDataForLink(oVizInstanceData);
            sPlatform = "LINK";
        }

        switch (sPlatform) {
            case "ABAP":
                oVizInstance = new VizInstanceAbap(oVizInstanceData);
                break;
            case "CDM":
                oVizInstance = new VizInstanceCdm(oVizInstanceData);
                break;
            case "LINK":
                oVizInstance = new VizInstanceLink(oVizInstanceData);
                break;
            case "LAUNCHPAGE":
                // own visualization type for search application through SearchableContent service
                oVizInstance = new VizInstanceLaunchPage(oVizInstanceData);
                break;
            default:
                oVizInstance = new VizInstance({
                    state: LoadState.Failed
                });
        }

        // we need to set this property separately because it is likely that it contains stringified objects
        // which might be interpreted as complex binding
        // e.g. appSpecificRoute of search
        // BCP: 2070390842
        // BCP: 002075129400006346412020
        oVizInstance.setTargetURL(vizData.targetURL);

        if (readVisualizations.isStandardVizType(vizData.vizType)) {
            try {
                oVizInstance.load().then(function () {
                    // this event is currenly only used to measure the TTI for which only standard VizTypes are relevant
                    EventHub.emit("VizInstanceLoaded", vizData.id);
                });
            } catch (error) {
                oVizInstance.setState(LoadState.Failed);
                // this event is currenly only used to measure the TTI for which only standard VizTypes are relevant
                EventHub.emit("VizInstanceLoaded", vizData.id);
            }
        } else {
            // load custom visualizations only after the core-ext modules have been loaded
            // to prevent that the custom visualizations trigger single requests
            EventHub.once("CoreResourcesComplementLoaded").do(function () {
                try {
                    oVizInstance.load();
                } catch (error) {
                    oVizInstance.setState(LoadState.Failed);
                }
            });
        }

        return oVizInstance;
    };

    /**
     * Removes unnecessary properties for VizInstanceLink
     *
     * @param {object} oVizInstanceData The vizInstance data which should be modified
     *
     * @private
     * @since 1.84.0
     */
    VisualizationInstantiation.prototype._cleanInstantiationDataForLink = function (oVizInstanceData) {
        delete oVizInstanceData.info;
        delete oVizInstanceData.icon;
        delete oVizInstanceData.keywords;
        delete oVizInstanceData.instantiationData;
        delete oVizInstanceData.dataSource;
        delete oVizInstanceData.contentProviderId;
        delete oVizInstanceData.vizConfig;
        delete oVizInstanceData.numberUnit;
        delete oVizInstanceData.indicatorDataSource;
    };

    /**
     * Checks if displayFormatHint is supported and returns fallback if not
     *
     * @param {string} sDisplayFormatHint
     * @param {string[]} aSupportedDisplayFormats
     *
     * @returns {string} either the current displayFormatHint or the default fallback format
     * @private
     */
    VisualizationInstantiation.prototype._getDisplayFormat = function (sDisplayFormatHint, aSupportedDisplayFormats) {
        return aSupportedDisplayFormats.indexOf(sDisplayFormatHint) > -1 ? sDisplayFormatHint : DisplayFormat.Standard;
    };

    VisualizationInstantiation.hasNoAdapter = true;

    return VisualizationInstantiation;
});
