// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/GenericTile",
    "sap/m/ImageContent",
    "sap/m/library",
    "sap/m/NumericContent",
    "sap/m/TileContent",
    "sap/f/GridContainerItemLayoutData",
    "sap/ui/core/message/Message",
    "sap/ui/core/MessageType",
    "sap/ui/events/KeyCodes",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/library"
], function (
    GenericTile,
    ImageContent,
    mobileLibrary,
    NumericContent,
    TileContent,
    GridContainerItemLayoutData,
    Message,
    MessageType,
    KeyCodes,
    JSONModel,
    Config,
    ushellLibrary
) {
    "use strict";

    // shortcut for sap.m.GenericTileMode
    var GenericTileMode = mobileLibrary.GenericTileMode;

    // shortcut for sap.m.GenericTileScope
    var GenericTileScope = mobileLibrary.GenericTileScope;

    // shortcut for sap.m.FrameType
    var FrameType = mobileLibrary.FrameType;

    // shortcut for sap.m.LoadState
    var LoadState = mobileLibrary.LoadState;

    // shortcut for sap.ushell.DisplayFormat
    var DisplayFormat = ushellLibrary.DisplayFormat;

    /**
     * @typedef {object} PageMessage An error or warning that occurred on a page
     * @property {string} type The type of the message (i.e. error or warning)
     * @property {string} title The title of the message
     * @property {string} description The description of the message
     */

    /**
     * @typedef {object} PageMessageCollection A collection of errors or warnings that occurred on a page
     * @property {PageMessage[]} errors  Only the errors that occurred on a page
     * @property {PageMessage[]} warnings Only the warnings that occurred on a page
     */

    var oPageDetailController,
        oPage,
        resources = {},
        oViewSettingsModel = new JSONModel({
            sizeBehavior: Config.last("/core/home/sizeBehavior")
        }),
        _aDoableObject = Config.on("/core/home/sizeBehavior").do(function (sSizeBehavior) {
            oViewSettingsModel.setProperty("/sizeBehavior", sSizeBehavior);
        });

    /**
     * Finds the ancestor control with a certain control type.
     *
     * @param {sap.ui.core.Control} control The control to start the search from.
     * @param {string} controlType The control type that matches the control that should be found and returned.
     * @returns {sap.ui.core.Control} A parent control that matches the given control type or null.
     * @private
     * @since 1.84.0
     */
    function _getAncestorControl (control, controlType) {
        if (control && control.isA && control.isA(controlType)) {
            return control;
        } else if (control && control.getParent) {
            return _getAncestorControl(control.getParent(), controlType);
        }
        return null;
    }

    /**
     * Formatter for the "state" property of Visualizations.
     *
     * @param {object} catalogTileId The catalogTileId of the visualization.
     * @param {string[]} selectedRoles selected roles
     * @param {string[]} allVisualizations all visualization in respect of the role assignment
     * @param {string[]} availableVisualizations all visualization in respect of the selected role context
     * @return {string} The value for the "state" property (a member value of the {@link sap.m.LoadState} enum).
     * @private
     */
    function _getState (catalogTileId, selectedRoles, allVisualizations, availableVisualizations) {
        var bContextEnabled = !!selectedRoles.length;
        if (bContextEnabled && (allVisualizations.indexOf(catalogTileId) === -1)) {
            // visualization is not available in any of the assigned roles
            return LoadState.Failed;
        } else if (bContextEnabled && (availableVisualizations.indexOf(catalogTileId) === -1)) {
            return LoadState.Failed;
        }
        return LoadState.Loaded;
    }

    /**
     * Formatter for the "mode" property of Visualizations.
     *
     * @param {sap.ushell.DisplayFormatHint} displayFormatHint The displayFormatHint of the control.
     * @param {string} iconUrl The url to the icon of the visualization.
     * @param {string} tileType The type of the visualization.
     * @returns {sap.m.GenericTileMode} The corresponding genericTileMode to the given parameters.
     * @private
     */
    function _getMode (displayFormatHint, iconUrl, tileType) {
        if (displayFormatHint === DisplayFormat.Compact) {
            return GenericTileMode.LineMode;
        }
        if (tileType !== "DYNAMIC" && !iconUrl) {
            return GenericTileMode.HeaderMode;
        }
        return GenericTileMode.ContentMode;
    }

    /**
     * Formatter for the "frameType" property of Visualizations and TileContents.
     *
     * @param {sap.ushell.DisplayFormatHint} displayFormatHint The displayFormatHint of the control.
     * @returns {sap.m.FrameType} The frameType that corresponds to the given displayFormatHint.
     * @private
     */
    function _getFrameType (displayFormatHint) {
        switch (displayFormatHint) {
            case DisplayFormat.Standard:
            case DisplayFormat.Default:
                return FrameType.OneByOne;
            case DisplayFormat.Flat:
                return FrameType.OneByHalf;
            case DisplayFormat.FlatWide:
                return FrameType.TwoByHalf;
            case DisplayFormat.StandardWide:
                return FrameType.TwoByOne;
            default:
                return FrameType.Auto;
        }
    }

    function _getTileContent (oTileData) {
        return new TileContent({
            footer: oTileData.tileType !== "STATIC"
                && oTileData.tileType !== "DYNAMIC"
                && !oTileData.info
                ? "[" + resources.i18n.getText("Title.CustomTile") + "]"
                : oTileData.info,
            content: oTileData.tileType === "DYNAMIC"
                ? new NumericContent({
                    truncateValueTo: 5,
                    icon: oTileData.iconUrl,
                    width: "100%",
                    withMargin: false
                })
                : new ImageContent({
                    src: oTileData.iconUrl
                }).addStyleClass("sapUshellFullWidth")
        });
    }

    function _getLayoutData (displayFormatHint) {
        return new GridContainerItemLayoutData({
            rows: (displayFormatHint === DisplayFormat.Flat || displayFormatHint === DisplayFormat.FlatWide) ? 1 : 2,
            columns: displayFormatHint === DisplayFormat.FlatWide ? 4 : 2
        });
    }

    return {
        /**
         * Initializes the Page fragment logic
         *
         * @param {sap.ui.core.mvc.Controller} oController The controller that uses the Page fragment
         * @protected
         */
        init: function (oController) {
            oPageDetailController = oController;
            resources.i18n = oPageDetailController.getResourceBundle();
            oPage = oPageDetailController.getView().byId("page");
            oPage.setModel(oPageDetailController.getModel());
            oPage.setModel(oViewSettingsModel, "viewSettings");
        },

        exit: function () {
            _aDoableObject.off();
        },

        /**
         * Creates the visualizations inside of the sections.
         *
         * @param {string} sId The ID of the visualization.
         * @param {sap.ui.model.Context} oBindingContext The visualization binding context.
         * @param {boolean} [bForPreview] Whether tiles should be forced to "Display" scope ("true") or not ("false"). Defaults to "false".
         * @returns {sap.m.GenericTile} A GenericTile of a section.
         * @private
         */
        visualizationFactory: function (sId, oBindingContext, bForPreview) {
            var oVizData = oBindingContext.getProperty();

            function fnPropertyChange (oEvent) {
                if (oEvent.getParameter("context") === oBindingContext) {
                    oVizData = oBindingContext.getProperty();

                    var aBindingContextPathParts = oBindingContext.getPath().split("/"),
                        iSectionIndex = aBindingContextPathParts[3],
                        iVizIndex = aBindingContextPathParts[5],
                        oSection = oPage.getSections()[iSectionIndex],
                        oViz = oSection.getVisualizations()[iVizIndex];

                    switch (oEvent.getParameter("path")) {
                        case "title":
                            oViz.setHeader(oVizData.title);
                            break;
                        case "subTitle":
                            oViz.setSubHeader(oVizData.subheader);
                            break;
                        case "catalogTileId":
                            var oRolesModel = oPage.getModel("roles"),
                                aSelected = oRolesModel.getProperty("/selected"),
                                aAllVisualizations = oRolesModel.getProperty("/allVisualizations"),
                                aAvailableVisualizations = oRolesModel.getProperty("/availableVisualizations");

                            oViz.setState(_getState(oVizData.catalogTileId, aSelected, aAllVisualizations, aAvailableVisualizations));
                            break;
                        case "displayFormatHint":
                            oViz.setFrameType(_getFrameType(oVizData.displayFormatHint));
                            oViz.setLayoutData(_getLayoutData(oVizData.displayFormatHint));
                            oViz.setMode(_getMode(oVizData.displayFormatHint, oVizData.iconUrl, oVizData.tileType));
                            oViz.setTileContent(_getTileContent(oVizData));
                            break;
                        case "iconUrl":
                        case "tileType":
                            oViz.setMode(_getMode(oVizData.displayFormatHint, oVizData.iconUrl, oVizData.tileType));
                            oViz.setTileContent(_getTileContent(oVizData));
                            break;
                        case "info":
                            oViz.setTileContent(_getTileContent(oVizData));
                            break;
                        default:
                            return;
                    }
                }
            }

            // As UI5 doesn't support single aggregationBinding out of the box, we have to make this workaround.
            oBindingContext.getModel().attachPropertyChange(fnPropertyChange);

            return new GenericTile({
                header: "{title}",
                subheader: "{subTitle}",
                failedText: resources.i18n.getText("Message.OutOfRoleContext"),
                frameType: {
                    path: "displayFormatHint",
                    formatter: _getFrameType
                },
                mode: {
                    parts: [
                        "displayFormatHint",
                        "iconUrl",
                        "tileType"
                    ],
                    formatter: _getMode
                },
                scope: "{= (${/editMode} && !" + bForPreview + ") ? '" + GenericTileScope.Actions + "' : '" + GenericTileScope.Display + "'}",
                sizeBehavior: "{viewSettings>/sizeBehavior}", // "sizeBehavior" for tiles: Small/Responsive
                state: {
                    parts: [
                        "catalogTileId",
                        "roles>/selected",
                        "roles>/allVisualizations",
                        "roles>/availableVisualizations"
                    ],
                    formatter: _getState
                },
                layoutData: _getLayoutData(oVizData.displayFormatHint),
                tileContent: _getTileContent(oVizData),
                press: function (oEvent) {
                    var oEventSource = oEvent.getSource();
                    switch (oEvent.getParameter("action")) {
                        case "Remove":
                            var oSection = _getAncestorControl(oEventSource, "sap.ushell.ui.launchpad.Section"),
                                iSectionIndex = oPage.indexOfSection(oSection),
                                iVizIndex = oSection.indexOfVisualization(oEventSource);
                            oPageDetailController.removeVisualizationInSection(iVizIndex, iSectionIndex);
                            oBindingContext.getModel().detachPropertyChange(fnPropertyChange);
                            break;
                        case "Press":
                        default:
                            oPageDetailController._openTileInfoPopover(oEventSource, oEventSource.getBindingContext());
                            break;
                    }
                }
            });
        },

        /**
         * Variation of {@link visualizationFactory}.
         * Used for the PagePreviewDialog, forcing tiles to be displayed in the "Display" scope.
         *
         * @param {string} sID See {@link visualizationFactory}.
         * @param {sap.ui.model.Context} oBindingContext See {@link visualizationFactory}.
         * @returns {sap.ushell.ui.launchpad.VizInstance} See {@link visualizationFactory}.
         * @private
         */
        previewVisualizationFactory: function (sID, oBindingContext) {
            return this.visualizationFactory(sID, oBindingContext, true);
        },

        /**
         * Collects errors and warnings on the Page.
         *
         * @returns {PageMessageCollection} A collection of errors and warnings on the Page.
         * @protected
         */
        collectMessages: function () {
            var aErrors = [],
                aWarnings = [],
                aInfos = [],
                oRolesModel = oPageDetailController.getModel("roles"),
                aSelectedRoles = oRolesModel.getProperty("/selected") || [],
                aAllVisualizations = oRolesModel.getProperty("/allVisualizations"),
                aAvailableVisualizations = oRolesModel.getProperty("/availableVisualizations"),
                bContextEnabled = !!aSelectedRoles.length,
                oMessageManager = sap.ui.getCore().getMessageManager(),
                aMessageManagerData = oMessageManager.getMessageModel().getProperty("/") || [];

            aMessageManagerData.forEach(function (oMessage) {
                // both entries are defined in "nw.core.flp.pagecomposer/webapp/i18n/i18n.properties"
                if ((oMessage.code !== "LanguageTranslationTool.UploadSuccess") &&
                    (oMessage.code !== "LanguageTranslationTool.UploadFileError")) {
                    return; // skip non-translation related messages
                }
                switch (oMessage.type) {
                    case MessageType.Error: oMessage.type = MessageType.Warning; // classify "Error" as "Warning" to allow saving the Page
                    case MessageType.Warning: aWarnings.push(oMessage); break;
                    default: aInfos.push(oMessage); break;
                }
            });

            oPage.getSections().forEach(function (oSection, iSectionIndex) {
                var oSectionTitle = oSection.byId("title-edit");
                if (oSection.getTitle() === "") {
                    oSectionTitle.setValueState("Warning");
                    oSectionTitle.setValueStateText(resources.i18n.getText("Message.InvalidSectionTitle"));
                    aWarnings.push(new Message({
                        type: MessageType.Warning,
                        message: resources.i18n.getText("Title.NoSectionTitle", iSectionIndex + 1),
                        description: resources.i18n.getText("Message.NoSectionTitle", iSectionIndex + 1)
                    }));
                } else {
                    oSectionTitle.setValueState("None");
                }

                var aVisualizations = oSection.getBindingContext().getProperty("viz") || [];

                aVisualizations.forEach(function (oTileData, iVisualizationIndex) {
                    var bNoFormFactor = oTileData.tileType && !oTileData.deviceDesktop
                        && !oTileData.devicePhone && !oTileData.deviceTablet;
                    if (bNoFormFactor) {
                        aWarnings.push(new Message({
                            type: MessageType.Warning,
                            message: resources.i18n.getText("Title.NoFormFactor"),
                            description: resources.i18n.getText("Message.NoFormFactor", [
                                oTileData.title,
                                (iVisualizationIndex + 1),
                                oSection.getTitle()
                            ])
                        }));
                    }
                    if (bContextEnabled && (aAllVisualizations.indexOf(oTileData.catalogTileId) === -1)) {
                        // visualization is not available in any of the assigned roles
                        aInfos.push(new Message({
                            type: MessageType.Information,
                            message: resources.i18n.getText("Title.InsufficientRoles"),
                            description: resources.i18n.getText("Message.InsufficientRoles", [
                                (iVisualizationIndex + 1),
                                oSection.getTitle(),
                                oTileData.catalogDisplayId
                            ])
                        }));
                    } else if (bContextEnabled && (aAvailableVisualizations.indexOf(oTileData.catalogTileId) === -1)) {
                        // visualization is not available in the selected role context
                        aInfos.push(new Message({
                            type: MessageType.Information,
                            message: resources.i18n.getText("Title.NotAvailableInRoleContext"),
                            description: resources.i18n.getText("Message.NotAvailableInRoleContext", [
                                oTileData.title,
                                (iVisualizationIndex + 1),
                                oSection.getTitle()
                            ])
                        }));
                    }
                });
            });

            return {
                errors: aErrors,
                warnings: aWarnings,
                infos: aInfos
            };
        },

        /**
         * Method to be called externally to notify the Page that the role context selection has changed and must be refreshed.
         *
         * @protected
         */
        refreshRoleContext: function () {
            oPageDetailController.getModel().getBindings().forEach(function (oBinding) {
                // this is faster than blindly refreshing the entire model with "this.getModel().updateBindings(true);"
                if (oBinding.sInternalType === "sap.ushell.VisualizationLoadState") {
                    oBinding.refresh(true); // refresh Tile "state" to reflect the selected role context
                }
            });
        },

        /**
         * Handler for visualization drag and drop, when a dragged item enters an area inside a section.
         * Checks if the vizInstance supports the display format of the target area.
         * This method is adapted from the same one in: "sap/ushell/components/pages/controller/PageRuntime.controller.js"
         *
         * @param {sap.ui.base.Event} oEvent Event object
         * @private
         */
        onAreaDragEnter: function (oEvent) {
            var sSourceArea = oEvent.getParameter("sourceArea");
            var sTargetArea = oEvent.getParameter("targetArea");

            // same area means no change of the display format
            if (sSourceArea === sTargetArea) {
                return;
            }

            var oDragControl = oEvent.getParameter("dragControl");
            var oDragControlData = oDragControl.getBindingContext().getProperty("");
            var aSupportedDisplayFormats = this.getSupportedDisplayFormats(oDragControlData.tileType);
            var bSupported = aSupportedDisplayFormats.some(function (oSupportedDisplayFormat) {
                return (oSupportedDisplayFormat.value === sTargetArea);
            });

            if (!bSupported) {
                oEvent.getParameter("originalEvent").preventDefault();
            }
        },

        /**
         * Adds a new Section to the Page.
         *
         * @param {sap.ui.base.Event} [oEvent] The event data. If not given, section is added at the first position.
         * @protected
         */
        addSection: function (oEvent) {
            var iSectionIndex = oEvent ? oEvent.getParameter("index") : 0;
            oPageDetailController.addSectionAt(iSectionIndex);
        },

        /**
         * Deletes a Section from the Page
         *
         * @param {sap.ui.base.Event} oEvent contains event data
         * @private
         */
        deleteSection: function (oEvent) {
            var oSection = oEvent.getSource(),
                sTitle = oSection.getTitle(),
                sMsg = sTitle
                    ? resources.i18n.getText("Message.Section.Delete", sTitle)
                    : resources.i18n.getText("Message.Section.DeleteNoTitle");

            sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
                MessageBox.confirm(sMsg, {
                    icon: MessageBox.Icon.WARNING,
                    title: resources.i18n.getText("Button.Delete"),
                    actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.DELETE,
                    initialFocus: MessageBox.Action.CANCEL,
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.DELETE) {
                            oPageDetailController.deleteSection(oPage.indexOfSection(oSection));
                        }
                    }
                });
            });
        },

        /**
         * Moves a section inside of the Page
         *
         * @param {object} oInfo Drag and drop event data
         * @private
         */
        moveSection: function (oInfo) {
            var oDragged = oInfo.getParameter("draggedControl"),
                oDropped = oInfo.getParameter("droppedControl"),
                sInsertPosition = oInfo.getParameter("dropPosition"),
                iDragPosition = oPage.indexOfSection(oDragged),
                iDropPosition = oPage.indexOfSection(oDropped);

            if (sInsertPosition === "After") {
                if (iDropPosition < iDragPosition) {
                    iDropPosition++;
                }
            } else if (iDropPosition > iDragPosition) {
                iDropPosition--;
            }

            oPageDetailController.moveSection(iDragPosition, iDropPosition);
        },

        /**
         * Moves a visualization inside a section or between different sections.
         *
         * @param {object} oDropInfo Drag and drop event data
         * @private
         */
        // eslint-disable-next-line complexity
        moveVisualization: function (oDropInfo) {
            var oDragged = oDropInfo.getParameter("draggedControl"),
                oDropped = oDropInfo.getParameter("droppedControl"),
                sDropPosition = oDropInfo.getParameter("dropPosition"),
                oBrowserEvent = oDropInfo.getParameter("browserEvent"),
                sKeyCode = oBrowserEvent && oBrowserEvent.keyCode,
                oCurrentSection = _getAncestorControl(oDragged, "sap.ushell.ui.launchpad.Section"),
                iCurrentSectionIndex = oPage.indexOfSection(oCurrentSection),
                iCurrentVizIndex = oCurrentSection && oCurrentSection.indexOfVisualization(oDragged),
                oCurrentViz = oCurrentSection && oCurrentSection.getVisualizations()[iCurrentVizIndex],
                oCurrentPos = oCurrentSection ? oCurrentSection.getItemPosition(oCurrentViz) : {},
                oTargetSection,
                iTargetSectionIndex,
                iTargetVizIndex,
                oTargetViz,
                oTargetPos;

            if (!oDropped) { // Target is an empty area of the section or an inner compactArea dnd (only happens during keyboard dnd)
                var bUp = sKeyCode === KeyCodes.ARROW_UP;
                iTargetSectionIndex = bUp ? iCurrentSectionIndex - 1 : iCurrentSectionIndex + 1;
                oTargetSection = oPage.getSections()[iTargetSectionIndex];

                if (oTargetSection) {
                    iTargetVizIndex = oTargetSection.getClosestCompactItemIndex(oDragged.getDomRef(), bUp);
                    oTargetViz = oTargetSection.getVisualizations()[iTargetVizIndex];
                    oTargetPos = oTargetSection.getItemPosition(oTargetViz);
                    if (oTargetPos.area !== oCurrentPos.area) {
                        oTargetPos = oCurrentPos;
                    }
                } else {
                    oCurrentViz.invalidate();
                    return;
                }
            } else {
                oTargetSection = _getAncestorControl(oDropped, "sap.ushell.ui.launchpad.Section");
                iTargetSectionIndex = oPage.indexOfSection(oTargetSection);
                iTargetVizIndex = oTargetSection.indexOfVisualization(oDropped);
                oTargetViz = oTargetSection.getVisualizations()[iTargetVizIndex];
                oTargetPos = oTargetSection.getItemPosition(oTargetViz);

                if (iCurrentSectionIndex === iTargetSectionIndex) {
                    if (sDropPosition === "Before" && iCurrentVizIndex < iTargetVizIndex) {
                        iTargetVizIndex--;
                    } else if (sDropPosition === "After" && iCurrentVizIndex > iTargetVizIndex) {
                        iTargetVizIndex++;
                    }

                    if (iCurrentVizIndex === iTargetVizIndex && oTargetPos.area === oCurrentPos.area) {
                        oCurrentViz.invalidate();
                        return;
                    }
                } else if (sDropPosition === "After") {
                    iTargetVizIndex++;
                }
            }

            if ((iCurrentSectionIndex !== iTargetSectionIndex)
                && (sKeyCode === KeyCodes.ARROW_UP || sKeyCode === KeyCodes.ARROW_DOWN) // only adjust if keyboard dnd
                && (oCurrentPos.index > oTargetPos.index)) {
                iTargetVizIndex++;
            }

            if (oDragged.isA("sap.m.ListItemBase")) { // only happens during mouse dnd from the tileSelector
                var fnDragSessionCallback = oDropInfo.getParameter("dragSession").getComplexData("callback");
                if (sDropPosition === "After") {
                    iTargetVizIndex++;
                }
                fnDragSessionCallback(iTargetVizIndex, iTargetSectionIndex, oTargetPos.area);
            } else if (oPageDetailController.moveVisualizationInSection(
                iCurrentVizIndex,
                iTargetVizIndex,
                iCurrentSectionIndex,
                iTargetSectionIndex,
                oTargetPos.area
            )) {
                var oViz = oTargetSection.getVisualizations()[iTargetVizIndex];
                if (oViz) {
                    oTargetSection.focusVisualization(oViz);
                    oViz.invalidate();
                }
            }
        },

        /**
         * Adds a visualization to a section in the Page.
         *
         * @param {object} oDropInfo Drag and drop event data
         * @private
         */
        addVisualization: function (oDropInfo) {
            var oDragged = oDropInfo.getParameter("draggedControl"),
                oDropped = oDropInfo.getParameter("droppedControl"),
                iDropVizIndex = oDropped.getVisualizations().length,
                iDropSectionIndex = oPage.indexOfSection(oDropped);

            if (oDragged.isA("sap.m.ListItemBase")) {
                oDropInfo.getParameter("dragSession").getComplexData("callback")(iDropVizIndex, iDropSectionIndex);
                return;
            }

            var oDragSection = _getAncestorControl(oDragged, "sap.ushell.ui.launchpad.Section"),
                iDragVizIndex = oDragSection.indexOfVisualization(oDragged),
                iDragSectionIndex = oPage.indexOfSection(oDragSection);

            if (iDragSectionIndex === iDropSectionIndex) {
                return;
            }

            oPageDetailController.moveVisualizationInSection(iDragVizIndex, iDropVizIndex, iDragSectionIndex, iDropSectionIndex);
        }
    };
});
