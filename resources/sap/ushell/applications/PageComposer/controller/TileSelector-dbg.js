// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @file Provides functionality for "sap/ushell/applications/PageComposer/view/TileSelector.fragment.xml"
 */
sap.ui.define([
    "sap/m/Button",
    "sap/m/library",
    "sap/m/List",
    "sap/base/strings/formatMessage",
    "sap/m/OverflowToolbar",
    "sap/m/ResponsivePopover",
    "sap/m/StandardListItem",
    "sap/m/Text",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "sap/ushell/library",
    "sap/ushell/utils/clone",
    "sap/ushell/services/Container" // required for "sap.ushell.Container.getServiceAsync()"
], function (
    Button,
    mobileLibrary,
    List,
    formatMessage,
    OverflowToolbar,
    ResponsivePopover,
    StandardListItem,
    Text,
    Fragment,
    Filter,
    FilterOperator,
    JSONModel,
    Sorter,
    ushellLibrary,
    fnClone
    // Container
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.PlacementType
    var PlacementType = mobileLibrary.PlacementType;

    // shortcut for sap.m.ListMode
    var ListMode = mobileLibrary.ListMode;

    // shortcut for sap.m.ListSeparators
    var ListSeparators = mobileLibrary.ListSeparators;

    // shortcut for sap.ushell.DisplayFormat
    var DisplayFormat = ushellLibrary.DisplayFormat;

    /**
     * @alias sap.ushell.applications.PageComposer.controller.TileSelector
     * @class
     * @private
     */
    return function () {
        var oController,
            oView,
            oFragment,
            sFragmentID,
            oIconTabBar,
            oRolesTilesList,
            oCatalogsTilesList,
            oAddSelectedTilesButton,
            oModel,
            oRolesModel,
            resources = {},
            oInfoToolbar,
            oSectionList,
            oSectionSelectionPopover,
            fnAddTileHandler,
            sLastDisplayFormatHint,
            sLastTileSearch,
            oViewSettingsDialog,
            fnOnOpenContextSelector;

        /**
         * Helper function to get the currently active tile list.
         *
         * @returns {sap.m.List} The currently active tile list.
         * @private
         */
        function _getActiveList () {
            return (oIconTabBar.getSelectedKey() === "roles") ? oRolesTilesList : oCatalogsTilesList;
        }

        /**
         * Refresh current search and sort on the currently selected tab.
         *
         * @private
         */
        function _onTabSelect () {
            // removes selections from the inactive list otherwise pressing on the current tab removes current selections
            var oInactiveList = ((oIconTabBar.getSelectedKey() === "roles") ? oCatalogsTilesList : oRolesTilesList);
            oInactiveList.removeSelections(true);
            _onTileSelectionChange(); // toggle the header "Add" button when necessary (change event is not fired when changing from code)
            _refreshCurrentTab();
        }

        /**
         * Refresh current search and sort on the currently selected tab.
         *
         * @private
         */
        function _refreshCurrentTab () {
            _searchTiles();
            _sortCatalogs(
                oModel.getProperty("/catalogsDescending"),
                oModel.getProperty("/vizDescending")
            );
        }

        /**
         * Intended to be called by the view (e.g. a List) for handling selection change events.
         *
         * @param {sap.ui.base.Event} [oEvent] The event object.
         * @private
         */
        function _onTileSelectionChange (/*oEvent*/) {
            var aSelectedItemsData = _getSelectedListItemsData();
            oAddSelectedTilesButton.setEnabled(!!aSelectedItemsData.length);
            if (aSelectedItemsData.length) {
                var aSupportedDisplayFormatsIntersection = aSelectedItemsData.map(function (oSelectedItemData) {
                    return oController.getSupportedDisplayFormats(oSelectedItemData.tileType).map(function (oSupportedDisplayFormat) {
                        return oSupportedDisplayFormat.value;
                    });
                }).reduce(function (aAccumulator, aSupportedDisplayFormats) {
                    return aAccumulator.filter(function (sSupportedDisplayFormat) {
                        return (aSupportedDisplayFormats.indexOf(sSupportedDisplayFormat) !== -1);
                    });
                });
                oModel.setProperty("/enabledAddButtonMenuItems", aSupportedDisplayFormatsIntersection);
            } else {
                oModel.setProperty("/enabledAddButtonMenuItems", []);
            }
            _updateInfoToolbar();
        }

        /**
         * Checks whether an "infoToolbar" should be displayed based on the current state of the application.
         * If a message is selected to be displayed, then the "infoToolbar" is updated and added to the currently active List.
         * If multiple messages would be valid to be displayed, only the highest priority one will be displayed instead.
         * If no message should be displayed, then the "infoToolbar" visibility is set to "false".
         *
         * @private
         */
        function _updateInfoToolbar () {
            var oActiveList = _getActiveList();
            var aEnabledAddButtonMenuItems = oModel.getProperty("/enabledAddButtonMenuItems");
            var aAvailableAddButtonMenuItems = oAddSelectedTilesButton.getMenu().getItems();
            if (oAddSelectedTilesButton.getEnabled() && (aEnabledAddButtonMenuItems.length < aAvailableAddButtonMenuItems.length)) {
                // 1st priority: Tile selection
                oInfoToolbar.getContent()[0].setText(resources.i18n.getText("SelectedTiles.LimitedVisualizationOptions"));
                oInfoToolbar.setActive(false);
                oInfoToolbar.setVisible(true);
                oInfoToolbar.detachPress(fnOnOpenContextSelector);
                oActiveList.setInfoToolbar(oInfoToolbar);
            } else if ((oIconTabBar.getSelectedKey() === "roles")
                && (oRolesModel.getProperty("/selected").length !== oRolesModel.getProperty("/available").length)) {
                // 2nd priority: Role context selection (ContextSelector)
                oInfoToolbar.getContent()[0].setText(resources.i18n.getText("SelectedRoles.RestrictedRoleContext"));
                oInfoToolbar.setActive(true);
                oInfoToolbar.setVisible(true);
                oInfoToolbar.detachPress(fnOnOpenContextSelector); // prevents attaching the same handler multiple times
                oInfoToolbar.attachPress(fnOnOpenContextSelector);
                oActiveList.setInfoToolbar(oInfoToolbar);
            } else if (oInfoToolbar.getParent() === oActiveList) { // no need to hide the "infoToolbar" if it is in another List
                // no message to be displayed, hide the "infoToolbar"
                oInfoToolbar.setVisible(false);
            }
        }

        /**
         * Initializes the TileSelector. Must be called before calling any other method.
         * The default (unnamed) and "roles" models of the controller's view must already be set.
         * If called multiple times, internal control instances are always reused.
         *
         * @param {sap.ui.core.mvc.Controller} controller The controller of the parent view.
         * @private
         */
        this.init = function (controller) {
            // if "init" is called again, first detach previous event handlers
            if (oIconTabBar) { oIconTabBar.detachSelect(_onTabSelect); }
            if (oInfoToolbar) { oInfoToolbar.detachPress(fnOnOpenContextSelector); }
            if (oRolesTilesList) { oRolesTilesList.detachSelectionChange(_onTileSelectionChange); }
            if (oCatalogsTilesList) { oCatalogsTilesList.detachSelectionChange(_onTileSelectionChange); }

            oController = controller;
            oView = oController.getView();
            oFragment = oView.byId("tileSelector");
            sFragmentID = oView.getId(); // TODO: change the fragment declaration to create a proper ID (using the View ID is incorrect)
            oIconTabBar = oView.byId("contextSwitch");
            oRolesTilesList = oView.byId("rolesTilesList");
            oCatalogsTilesList = oView.byId("catalogsTilesList");
            oAddSelectedTilesButton = oView.byId("tileSelectorAddButton");
            oRolesModel = oView.getModel("roles");
            resources.i18n = oController.getResourceBundle();
            fnOnOpenContextSelector = oController.onOpenContextSelector.bind(oController);

            if (!oModel) {
                oModel = new JSONModel({
                    catalogsDescending: false,
                    enabledAddButtonMenuItems: [],
                    showSwitchViewButton: false,
                    vizDescending: false
                });
                oModel.setSizeLimit(Infinity); // allows more list bindings than the model default limit of 100 entries
            }
            oFragment.setModel(oModel);

            if (!oInfoToolbar || oInfoToolbar.bIsDestroyed) {
                oInfoToolbar = new OverflowToolbar({
                    id: Fragment.createId(sFragmentID, "infoToolbar"),
                    visible: false,
                    content: new Text({ id: Fragment.createId(sFragmentID, "infoToolbarText") })
                });
                oRolesTilesList.setInfoToolbar(oInfoToolbar); // sets the "infoToolbar" upfront to prevent a delay when first showing it
            }

            if (!oSectionList || oSectionList.bIsDestroyed) {
                oSectionList = new List({
                    id: Fragment.createId(sFragmentID, "sectionList"),
                    mode: ListMode.MultiSelect,
                    showSeparators: ListSeparators.None,
                    includeItemInSelection: true,
                    selectionChange: function () {
                        oSectionSelectionPopover.getBeginButton().setEnabled(!!oSectionList.getSelectedItem());
                    },
                    items: {
                        path: "/page/sections",
                        template: new StandardListItem({ title: "{title}" })
                    },
                    noDataText: resources.i18n.getText("Message.NoSections")
                });
                // already add as a dependant otherwise it will not be destroyed if not yet added in the "oSectionSelectionPopover" content
                oFragment.addDependent(oSectionList);
            }
            oSectionList.setModel(oView.getModel());

            if (oViewSettingsDialog) { oViewSettingsDialog.fireReset(); }
            _onTabSelect();

            oIconTabBar.attachSelect(_onTabSelect);
            // update the header "Add" button "enabled" state and its MenuItems based on current Tile selection
            oRolesTilesList.attachSelectionChange(_onTileSelectionChange);
            oCatalogsTilesList.attachSelectionChange(_onTileSelectionChange);
        };

        /**
         * Helper function to get the BindingInfo for both lists.
         *
         * @returns {object} The BindingInfo object.
         * @private
         */
        function _createBindingInfo () {
            var oBindingInfo = {};
            oBindingInfo.parameters = { expand: "vizReferences" };
            oBindingInfo.path = "/vizReferenceHierarchySet";
            oBindingInfo.factory = function (sID, oBindingContext) {
                switch (oBindingContext.getProperty("type")) {
                    case "catalog":
                        return oView.byId("tileSelectorGroupHeader").clone();
                    case "visualization":
                        var sTileType = oBindingContext.getProperty("vizReferences/tileType");
                        var oCustomListItem = oView.byId("tileSelectorCustomListItem").clone()
                            .bindObject({ path: oBindingContext.getPath() + "/vizReferences" });
                        oCustomListItem.getContent()[0].getItems()[2].getMenu().bindItems({
                            path:
                                "PageRepository>/tileTypeSet('" + encodeURIComponent(sTileType) + "')/vizOptions/displayFormats/supported",
                            template: oView.byId("tileSelectorAddMenuItem").clone(),
                            templateShareable: false
                        });
                        return oCustomListItem;
                    default:
                        return null;
                }
            };
            return oBindingInfo;
        }

        /**
         * Update the catalog tiles list after the manual selection of catalogs is changed.
         * Used as the callback function for the CatalogSelector.
         *
         * @param {string[]} [aCatalogIDs] Selected catalog IDs.
         * @private
         */
        function _onCatalogsSelected (aCatalogIDs) {
            if (aCatalogIDs && aCatalogIDs.length) {
                var oBindingInfo = _createBindingInfo();
                var aFilters = aCatalogIDs.map(function (sCatalogId) {
                    return new Filter("catalogId", FilterOperator.EQ, sCatalogId);
                });
                oBindingInfo.filters = aFilters; // filters applied during the binding cannot be removed and are always in effect
                oCatalogsTilesList.setModel(oView.getModel("PageRepository"));
                oCatalogsTilesList.bindItems(oBindingInfo);
            } else {
                oCatalogsTilesList.unbindItems();
            }
            oIconTabBar.setSelectedKey("catalogs"); // switches to the "Manually Selected" tab
            _onTabSelect(); // (change event is not fired when changing from code)
        }

        /**
         * Sets the model of the TileSelector "rolesTilesList" with the "vizReferenceHierarchySet" from the "PageRepository" OData model.
         * The "PageRepository" model should be defined in the application manifest.
         * This method can be called an arbitrary number of times.
         *
         * @returns {Promise<undefined>} Resolves when the Tile list update finishes.
         * @private
         */
        this.initTiles = function () {
            oIconTabBar.setSelectedKey("roles"); // switches to the "Derived from Roles" tab
            oAddSelectedTilesButton.setEnabled(false);
            oRolesTilesList.setModel(oView.getModel("PageRepository"));

            // OData requests are rejected if there are no roles available
            if (oRolesModel.getProperty("/available").length) {
                var oUpdateFinishedPromise = new Promise(function (resolve) {
                    var fnUpdateFinished = function () {
                        oRolesTilesList.detachUpdateFinished(fnUpdateFinished); // detaches itself after being called
                        resolve();
                    };
                    oRolesTilesList.attachUpdateFinished(fnUpdateFinished);
                });
                oRolesTilesList.bindItems(_createBindingInfo());
                _onTabSelect();
                return oUpdateFinishedPromise;
            }
            oRolesTilesList.unbindItems();
            return Promise.resolve();
        };

        /**
         * Method to be called externally to notify the TileSelector that the role context selection has changed and must be refreshed.
         *
         * @private
         */
        this.refreshRoleContext = function () {
            _updateInfoToolbar();
            _searchTiles();
        };

        /**
         * Intended to be called by the view (e.g. a SearchField) for handling tile search events.
         *
         * @param {sap.ui.base.Event} [oEvent] The event object.
         * @private
         */
        this.onSearchTiles = function (oEvent) {
            sLastTileSearch = oEvent.getParameter("query");
            _searchTiles();
        };

        /**
         * Filters the items of the currently active tile list using the last text used to search for tiles.
         *
         * @private
         */
        function _searchTiles () {
            var oActiveListBinding = _getActiveList().getBinding("items");
            var aFiltersArray = _getFiltersArray();
            if (oActiveListBinding && (JSON.stringify(oActiveListBinding.aLastFiltersArray) !== JSON.stringify(aFiltersArray))) {
                oActiveListBinding.aLastFiltersArray = aFiltersArray;
                oActiveListBinding.filter(aFiltersArray);
            }
        }

        /**
         * Intended to be called by the view (e.g. a Button) for handling add tile events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         * @private
         */
        this.onAddTiles = function (oEvent) {
            var aSectionListItems = oSectionList.getItems();
            var oEventItem = oEvent.getParameter("item");
            // "sLastDisplayFormatHint" has the key of the last selected MenuItem or "undefined" if default "Add" is used
            sLastDisplayFormatHint = (oEventItem && oEventItem.getKey());
            var oBindingContext = oEvent.getSource().getBindingContext();
            if (oBindingContext) {
                // when adding Tiles through their "Add" buttons, then enhance the event with a reference to its list item
                var sBindingContextPath = oBindingContext.getPath();
                oEvent.oAddSingleTileItem = _getActiveList().getItems().filter(function (item) {
                    return (item.getBindingContextPath() === sBindingContextPath);
                })[0];
            } else {
                // when adding a tile through the header "Add" button, then there is no "oAddSingleTileItem" (event objects are reused)
                delete oEvent.oAddSingleTileItem;
            }
            if (aSectionListItems.length === 1) { // skip asking to which section(s) if there is only one section
                aSectionListItems[0].setSelected(true);
                _addTiles(oEvent.oAddSingleTileItem);
            } else {
                _openSectionSelectionPopover(oEvent);
            }
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling manual selection of catalogs events.
         *
         * @private
         */
        this.onAddCatalogs = function () {
            sap.ui.require(["sap/ushell/applications/PageComposer/controller/CatalogSelector.controller"], function (controller) {
                controller.selectCatalogs(oView, _onCatalogsSelected);
            });
        };

        /**
         * Intended to be called by the view (e.g. a Button) for showing a dialog with available view settings.
         *
         * @param {sap.ui.base.Event} [oEvent] The event object.
         * @private
         */
        this.showViewSettingsDialog = function (/*oEvent*/) {
            if (oViewSettingsDialog) {
                oViewSettingsDialog.getModel().setProperty("/catalogsDescending", oModel.getProperty("/catalogsDescending"));
                oViewSettingsDialog.getModel().setProperty("/vizDescending", oModel.getProperty("/vizDescending"));
                oViewSettingsDialog.open();
                return;
            }

            sap.ui.require([
                "sap/ushell/applications/PageComposer/controller/ViewSettingsTileSelector.controller"
            ], function (ViewSettingsTileSelector) {
                Fragment.load({
                    id: Fragment.createId(sFragmentID, "tileSelectorViewSettings"),
                    name: "sap.ushell.applications.PageComposer.view.ViewSettingsTileSelector",
                    type: "XML",
                    controller: new ViewSettingsTileSelector(oView)
                }).then(function (oViewSettingsFragment) {
                    oViewSettingsDialog = oViewSettingsFragment;
                    oViewSettingsFragment.setModel(new JSONModel({
                        catalogsDescending: false,
                        vizDescending: false
                    }));
                    oViewSettingsFragment.setModel(oView.getModel("i18n"), "i18n");
                    oViewSettingsFragment.open();
                    oViewSettingsFragment.attachConfirm(function (oEvent) {
                        var oDialogModel = oEvent.getSource().getModel();
                        _sortCatalogs(
                            oDialogModel.getProperty("/catalogsDescending"),
                            oDialogModel.getProperty("/vizDescending")
                        );
                    });
                    oFragment.addDependent(oViewSettingsFragment);
                });
            });
        };

        /**
         * Sets a callback function for the add tiles event.
         * Usually set to call {@link sap.ushell.applications.PageComposer.controller.PageDetailEdit#addVisualizationInSection}.
         *
         * @param {function} newAddTileHandler The callback function to be called when adding tiles.
         *   This function is called with the following arguments, in the following order:
         *     1. {object} The visualization data of the visualization being added.
         *     2. {int[]} The indices of sections where the content should be added to.
         *     3. {int} Optional. The index within the section where the visualization should be added at.
         *              If not provided, the visualization will be added at the end of the section.
         * @private
         */
        this.setAddTileHandler = function (newAddTileHandler) {
            // "itemData" must not be a reference to the real data object, it should be cloned before calling "fnAddTileHandler"
            fnAddTileHandler = function (itemData, selectedSectionsIndexes, tileIndex) {
                delete itemData.id; // "id" should only exist for already saved Tiles on a Page (it is generated in the backend)
                newAddTileHandler(itemData, selectedSectionsIndexes, tileIndex);
            };
        };

        /**
         * Called when starting to drag a tile.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         * @private
         */
        this.onDragStart = function (oEvent) {
            if (typeof fnAddTileHandler !== "function") {
                throw new Error("Impossible to add Tile as no \"fnAddTileHandler\" was set via \"setAddTileHandler\"");
            }
            var oItemData = oEvent.getParameter("target").getBindingContext().getProperty("");
            if (oItemData.type === "catalog") {
                oEvent.preventDefault(); // prevents dragging catalog items
                return;
            }
            oEvent.getParameter("dragSession").setComplexData("callback", function (tileIndex, sectionIndex, displayFormatHint) {
                var oClonedItemData = fnClone(oItemData);
                oClonedItemData.displayFormatHint = displayFormatHint || DisplayFormat.Standard;
                fnAddTileHandler(oClonedItemData, [sectionIndex], tileIndex);
                sap.ushell.Container.getServiceAsync("Message").then(function (oMsgService) {
                    if (oClonedItemData.displayFormatHint === DisplayFormat.Compact) {
                        oMsgService.info(resources.i18n.getText("Message.LinkAdded"));
                    } else {
                        oMsgService.info(resources.i18n.getText("Message.TileAdded"));
                    }
                });
            });
        };

        /**
         * Enables or disables drag-and-drop for the TileSelector.
         *
         * @param {boolean} bEnabled If "true", drag-and-drop is enabled.
         * @private
         */
        this.setEnableDnD = function (bEnabled) {
            if (oRolesTilesList && oRolesTilesList.getDragDropConfig().length === 1) {
                oRolesTilesList.getDragDropConfig()[0].setEnabled(bEnabled);
            }
            if (oCatalogsTilesList && oCatalogsTilesList.getDragDropConfig().length === 1) {
                oCatalogsTilesList.getDragDropConfig()[0].setEnabled(bEnabled);
            }
        };

        /**
         * Show or hide the "Show Page" button to switch from the TileSelector to the Page content.
         *
         * @param {boolean} bShow Whether to show (true) or hide (false) the "Show Page" button.
         * @private
         */
        this.showSwitchViewButton = function (bShow) {
            if (oModel) {
                oModel.setProperty("/showSwitchViewButton", bShow);
            }
        };

        /**
         * Formatter for the visualization option ID. Used in the MenuItems of the "Add" MenuButtons.
         *
         * @param {string} sAddAs The prefix text (e.g. "i18n>TileSelector.AddAs") for the visualization option.
         * @param {string} sVisualizationOptionID The ID of the visualization option.
         * @param {string} [sTileType] The Tile type. When provided, the text will reflect whether the visualization option is preferred.
         * @returns {string} The i18n display name of the given visualization option ID.
         * @private
         */
        this.visualizationOptionFormatter = function (sAddAs, sVisualizationOptionID, sTileType) {
            if (!sAddAs || !sVisualizationOptionID) { return ""; } // the bindings are not done yet
            if (sVisualizationOptionID === DisplayFormat.Default) {
                // TODO: remove this conditional on FLPCOREANDUX-4421
                sVisualizationOptionID = DisplayFormat.Standard;
            }
            if (sTileType) {
                var aSupportedDisplayFormats = oController.getSupportedDisplayFormats(sTileType);
                var oDisplayFormat = aSupportedDisplayFormats.filter(function (oSupportedDisplayFormat) {
                    return (oSupportedDisplayFormat.value === sVisualizationOptionID);
                })[0];
                return formatMessage(sAddAs, [oDisplayFormat.label]);
            }
            var oI18nModel = this.getView().getModel("i18n");
            var sDisplayFormatName = oI18nModel.getProperty("DisplayFormat." + sVisualizationOptionID);
            return formatMessage(sAddAs, [sDisplayFormatName]);
        };

        /**
         * Helper function to get the Filters array for {@link sap.ui.model.ListBinding.prototype.filter}.
         * Takes into account the current context selected and the last text used to search for tiles.
         *
         * @returns {sap.ui.model.Filter[]} The resulting Filters.
         * @private
         */
        function _getFiltersArray () {
            var aFilters = [];
            if (_getActiveList() === oRolesTilesList) {
                var aSelectedRoles = oRolesModel.getProperty("/selected");
                // if no roles are selected, then use all available ones (as if all roles were selected)
                if (!aSelectedRoles.length) { aSelectedRoles = oRolesModel.getProperty("/available"); }
                aSelectedRoles.forEach(function (sRole) {
                    aFilters.push(new Filter("roleId", FilterOperator.EQ, sRole));
                });
            }
            if (sLastTileSearch) {
                aFilters.push(new Filter([
                    new Filter("vizReferences/id", FilterOperator.Contains, sLastTileSearch),
                    new Filter("vizReferences/catalogTileId", FilterOperator.Contains, sLastTileSearch),
                    new Filter("vizReferences/targetMappingId", FilterOperator.Contains, sLastTileSearch),
                    new Filter("vizReferences/fioriId", FilterOperator.Contains, sLastTileSearch),
                    new Filter("vizReferences/title", FilterOperator.Contains, sLastTileSearch),
                    new Filter("vizReferences/subTitle", FilterOperator.Contains, sLastTileSearch)
                ], false)); // filter combining: "AND" (true) or "OR" (false)
            }
            return aFilters;
        }

        /**
         * Helper function to get the Sorters array for {@link sap.ui.model.ListBinding.prototype.sort}.
         *
         * @param {boolean} sortCatalogsDescending Whether to sort catalogs "descending" (true) or "ascending" (false).
         * @param {boolean} sortVizDescending Whether to sort visualizations "descending" (true) or "ascending" (false).
         * @returns {sap.ui.model.Sorter[]} The resulting array of Sorters.
         * @private
         */
        function _getSortersArray (sortCatalogsDescending, sortVizDescending) {
            return [
                new Sorter("title", sortCatalogsDescending),
                new Sorter("vizReferences/title", sortVizDescending)
            ];
        }

        /**
         * Toggles the lexicographical sort order of the items of the currently active tile list between "ascending" and "descending".
         * Sorting is done based on the "title" property of the items.
         *
         * @param {boolean} sortCatalogsDescending Catalog sort order
         * @param {boolean} sortVizDescending Viz sort order
         * @private
         */
        function _sortCatalogs (sortCatalogsDescending, sortVizDescending) {
            var aSorterArray = _getSortersArray(sortCatalogsDescending, sortVizDescending);
            var oActiveListBinding = _getActiveList().getBinding("items");
            if (oActiveListBinding && (JSON.stringify(oActiveListBinding.aLastSorterArray) !== JSON.stringify(aSorterArray))) {
                oActiveListBinding.aLastSorterArray = aSorterArray;
                oActiveListBinding.sort(aSorterArray);
            }
            oModel.setProperty("/catalogsDescending", sortCatalogsDescending);
            oModel.setProperty("/vizDescending", sortVizDescending);
        }

        /**
         * Get the item data of every selected List item.
         * "getSelectedContextPaths()" seems to be the only method that always return all selected items (even within collapsed parents).
         *
         * @returns {object[]} An array of selected List items data.
         * @private
         */
        function _getSelectedListItemsData () {
            var oActiveList = _getActiveList();
            var oListModel = oActiveList.getModel();
            return oActiveList.getSelectedContextPaths().map(function (sSelectedItemContextPath) {
                return oListModel.getContext(sSelectedItemContextPath).getProperty("");
            });
        }

        /**
         * Opens the sectionSelectionPopover, containing the Section list for selecting to which Sections the Tile(s) should be added to.
         *
         * @param {sap.ui.base.Event} oEvent The event that raised the operation (e.g. a click on the "Add" button).
         * @private
         */
        function _openSectionSelectionPopover (oEvent) {
            if (!oSectionSelectionPopover || oSectionSelectionPopover.bIsDestroyed) {
                _createSectionSelectionPopover();
            }
            oSectionList.removeSelections(true);
            oSectionSelectionPopover.getBeginButton().setEnabled(false).oEvent = oEvent;
            oSectionSelectionPopover.getEndButton().setEnabled(true);
            var oOpenByControl = oEvent.getSource();
            if (oOpenByControl.isA("sap.m.Menu")) { // if a MenuItem of the MenuButton was selected instead of the default "Add" button
                oOpenByControl = oOpenByControl.getParent();
            }
            if (_isOverflownInOverflowToolbar(oOpenByControl)) {
                oOpenByControl = oOpenByControl.getParent()._getOverflowButton();
            }
            oSectionSelectionPopover.openBy(oOpenByControl);
        }

        /**
         * Checks if a control is currently overflown inside of an OverflowToolbar.
         *
         * @param {sap.ui.core.Control} oControl The control to check.
         * @returns {boolean} Whether the control is or is not overflown inside of an OverflowToolbar.
         * @private
         */
        function _isOverflownInOverflowToolbar (oControl) {
            var oParent = oControl.getParent();
            return !!(oParent && oParent.isA("sap.m.OverflowToolbar") && (oParent._getVisibleContent().indexOf(oControl) === -1));
        }

        /**
         * Creates the section selection popover, used to select to which section(s) the tile(s) should go to.
         *
         * @private
         */
        function _createSectionSelectionPopover () {
            oSectionSelectionPopover = new ResponsivePopover({
                id: Fragment.createId(sFragmentID, "sectionSelectionPopover"),
                placement: PlacementType.Auto,
                title: resources.i18n.getText("Tooltip.AddToSections"),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: resources.i18n.getText("Button.Add"),
                    press: function () {
                        this.setEnabled(false);
                        oSectionSelectionPopover.close();
                        _addTiles(this.oEvent.oAddSingleTileItem);
                    }
                }),
                endButton: new Button({
                    text: resources.i18n.getText("Button.Cancel"),
                    press: function () {
                        this.setEnabled(false);
                        oSectionSelectionPopover.close();
                    }
                }),
                content: oSectionList,
                initialFocus: oSectionList
            });
            oFragment.addDependent(oSectionSelectionPopover);
        }

        /**
         * Calls the handler for adding tiles. Does nothing if no function is set for the add tiles handler.
         *
         * @see setAddTileHandler
         * @param {sap.m.ListItemBase} [oAddSingleTileItem] A single Tile list item, received only when the Tile's "Add" button is used.
         * @private
         */
        function _addTiles (oAddSingleTileItem) {
            if (typeof fnAddTileHandler !== "function") {
                throw new Error("Impossible to add Tile as no \"fnAddTileHandler\" was set via \"setAddTileHandler\"");
            }
            var aSelectedSectionsIndexes = oSectionList.getSelectedItems().map(function (oSelectedSection) {
                return oSectionList.indexOfItem(oSelectedSection);
            });

            var aSelectedTilesData;
            if (oAddSingleTileItem) {
                aSelectedTilesData = [oAddSingleTileItem.getBindingContext().getProperty("")];
                oAddSingleTileItem.setSelected(false);
            } else {
                aSelectedTilesData = _getSelectedListItemsData();
                _getActiveList().removeSelections(true); // unselect all tile items when adding through the header "Add" button
            }
            _onTileSelectionChange(); // toggle the header "Add" button when necessary (change event is not fired when changing from code)

            aSelectedTilesData.forEach(function (oSelectedTileData) {
                var oClonedTileData = fnClone(oSelectedTileData);
                if (sLastDisplayFormatHint) {
                    oClonedTileData.displayFormatHint = sLastDisplayFormatHint;
                } else {
                    var aSupportedDisplayFormats = oController.getSupportedDisplayFormats(oClonedTileData.tileType);
                    var sPreferredDisplayFormat = aSupportedDisplayFormats.filter(function (oSupportedDisplayFormat) {
                        return oSupportedDisplayFormat.preferred;
                    })[0].value;
                    oClonedTileData.displayFormatHint = sPreferredDisplayFormat;
                }
                fnAddTileHandler(oClonedTileData, aSelectedSectionsIndexes);
            });

            if (aSelectedTilesData.length) {
                sap.ushell.Container.getServiceAsync("Message").then(function (oMsgService) {
                    var sMsg;
                    if (sLastDisplayFormatHint === DisplayFormat.Compact) {
                        sMsg = resources.i18n.getText(aSelectedTilesData.length > 1 ? "Message.LinksAdded" : "Message.LinkAdded");
                    } else {
                        sMsg = resources.i18n.getText(aSelectedTilesData.length > 1 ? "Message.TilesAdded" : "Message.TileAdded");
                    }
                    oMsgService.info(sMsg);
                });
            }

            if (oModel && oModel.getProperty("/showSwitchViewButton")) {
                oController.switchDynamicSideContentView();
            }
        }
    };
});
