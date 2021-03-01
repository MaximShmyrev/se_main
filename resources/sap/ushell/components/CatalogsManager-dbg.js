// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/base/Object",
    "sap/ushell/ui/launchpad/TileState",
    "sap/ushell/EventHub",
    "sap/ushell/utils",
    "sap/ushell/components/DestroyHelper",
    "sap/ushell/components/GroupsHelper",
    "sap/ushell/components/MessagingHelper",
    "sap/ushell/components/HomepageManager",
    "sap/ushell/resources",
    "sap/ui/thirdparty/jquery",
    "sap/ui/performance/Measurement",
    "sap/base/Log",
    "sap/ushell/Config"
], function (
    BaseObject,
    TileState,
    oEventHub,
    oUtils,
    oDestroyHelper,
    oGroupsHelper,
    oMessagingHelper,
    HomepageManager,
    resources,
    jQuery,
    Measurement,
    Log,
    Config
) {
    "use strict";

    var CatalogsManager = BaseObject.extend("sap.ushell.components.CatalogsManager", {
        metadata: {
            publicMethods: [
                "createGroup",
                "createGroupAndSaveTile",
                "createTile",
                "deleteCatalogTileFromGroup",
                "notifyOnActionFailure",
                "resetAssociationOnFailure"
            ]
        },
        analyticsConstants: {
            PERSONALIZATION: "FLP: Personalization",
            RENAME_GROUP: "FLP: Rename Group",
            MOVE_GROUP: "FLP: Move Group",
            DELETE_GROUP: "FLP: Delete Group",
            RESET_GROUP: "FLP: Reset Group",
            DELETE_TILE: "FLP: Delete Tile",
            ADD_TILE: "FLP: Add Tile",
            MOVE_TILE: "FLP: Move Tile"
        },

        _aDoableObjects: [],

        constructor: function (sId, mSettings) {
            this.oLaunchPageService = sap.ushell.Container.getService("LaunchPage");

            //TODO should be removed when AppFinder and Homapage use seperate model
            this.oTileCatalogToGroupsMap = {};
            this.skippedProcessCatalogs = 0;
            this.tagsPool = [];
            this.iInitialLoad = 100;
            this.oModel = mSettings.model;
            var oHomepageManagerData = {
                model: this.oModel
                //TODO
                //config : this.oConfig
                // Routing and view is not needed in the standalone AppFinder
            };

            if (typeof sap.ushell.components.getHomepageManager === "function") {
                this.oHomepageManager = sap.ushell.components.getHomepageManager();
            } else {
                this.oHomepageManager = new HomepageManager("dashboardMgr", oHomepageManagerData);
            }
            sap.ushell.components.getCatalogsManager = (function (value) {
                return function () {
                    return value;
                };
            }(this.getInterface()));
            this.registerEvents();
        },

        registerEvents: function () {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("renderCatalog", this.loadAllCatalogs, this);
            // Doable objects are kept in a global array to enable their off-ing later on.
            this._aDoableObjects = [
                oEventHub.on("showCatalog").do(this.updateTilesAssociation.bind(this)),
                oEventHub.on("updateGroups").do(this.updateTilesAssociation.bind(this))
            ];
        },

        unregisterEvents: function () {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.unsubscribe("renderCatalog", this.loadAllCatalogs, this);
            this._aDoableObjects.forEach(function (oDoable) {
                oDoable.off();
            });
        },

        // temporary - should not be exposed
        getModel: function () {
            return this.oModel;
        },

        loadAllCatalogs: function (/*sChannelId, sEventId, oData*/) {
            var oGroupsPromise = new jQuery.Deferred(),
                that = this,
                setDoneCBForGroups;

            // automatically resolving the group's promise for the scenario where the groups are
            // already loaded (so the group's promise Done callback will execute automatically is such a case)
            oGroupsPromise.resolve();

            // this is a local function (which could be invoked at 2 points in thie method).
            // this sets a Done callback on the promise object of the groups.
            setDoneCBForGroups = function () {
                oGroupsPromise.done(function () {
                    var aGroups = that.getModel().getProperty("/groups");
                    if (aGroups && aGroups.length !== 0) {
                        that.updateTilesAssociation();
                    }
                });
            };

            if (!this.oModel.getProperty("/catalogs")) {
                // catalog also needs groups
                if (!this.oModel.getProperty("/groups") || this.oModel.getProperty("/groups").length === 0) {
                    //Because of segmentation, some pins can be not selected
                    if (!Config.last("/core/spaces/enabled")) {
                        oGroupsPromise = this.oHomepageManager.loadPersonalizedGroups();
                    }
                }
                oDestroyHelper.destroyFLPAggregationModels(this.oModel.getProperty("/catalogs"));
                oDestroyHelper.destroyTileModels(this.oModel.getProperty("/catalogTiles"));
                // Clear existing Catalog items
                this.oModel.setProperty("/catalogs", []);
                this.oModel.setProperty("/catalogSearchEntity", {
                    appBoxes: [],
                    customTiles: []
                });

                // Array of promise objects that are generated inside addCatalogToModel (the "progress" function of getCatalogs)
                this.aPromises = [];

                Measurement.start("FLP:DashboardManager.GetCatalogsRequest", "GetCatalogsRequest", "FLP");
                Measurement.start("FLP:DashboardManager.getCatalogTiles", "getCatalogTiles", "FLP");
                Measurement.pause("FLP:DashboardManager.getCatalogTiles");
                Measurement.start("FLP:DashboardManager.BuildCatalogModelWithRendering", "BuildCatalogModelWithRendering", "FLP");
                Measurement.pause("FLP:DashboardManager.BuildCatalogModelWithRendering");

                // Trigger loading of catalogs
                this.oLaunchPageService.getCatalogs()
                    // There's a need to make sure that onDoneLoadingCatalogs is called only after all catalogs are loaded
                    // (i.e. all calls to addCatalogToModel are finished).
                    // For this, all the promise objects that are generated inside addCatalogToModel are generated into this.aPromises,
                    // and jQuery.when calls onDoneLoadingCatalogs only after all the promises are resolved
                    .done(function (catalogs) {
                        var aInitialCatalog = catalogs.slice(0, this.iInitialLoad);

                        Measurement.end("FLP:DashboardManager.GetCatalogsRequest");

                        this.aPromises = aInitialCatalog.map(this.addCatalogToModel.bind(this));
                        Promise.all(this.aPromises)
                            .then(this.processPendingCatalogs.bind(this))
                            .then(function () {
                                this.aPromises = catalogs.slice(this.iInitialLoad).map(this.addCatalogToModel.bind(this));
                                Promise.all(this.aPromises)
                                    .then(this.processPendingCatalogs.bind(this));
                            }.bind(this))
                            .then(this.onDoneLoadingCatalogs.bind(this, catalogs))
                            .then(setDoneCBForGroups);
                    }.bind(this))
                    //in case of a severe error, show an error message
                    .fail(oMessagingHelper.showLocalizedErrorHelper("fail_to_load_catalog_msg"));
            } else {
                // when groups are loaded we can map the catalog tiles <-> groups map
                setDoneCBForGroups();
            }
        },

        updateTilesAssociation: function () {
            this.mapCatalogTilesToGroups();
            // update the catalogTile model after mapCatalogTilesToGroups() was called
            this.updateCatalogTilesToGroupsMap();
        },

        mapCatalogTilesToGroups: function () {
            this.oTileCatalogToGroupsMap = {};

            //Calculate the relation between the CatalogTile and the instances.
            var aGroups = this.oModel.getProperty("/groups"),

                tileInd,
                aTiles,
                tileId,
                tileGroups,
                groupId,
                that = this;

            aGroups.forEach(function (oGroup) {
                ["tiles", "links"].forEach(function (sAttribute) {
                    aTiles = oGroup[sAttribute];
                    if (aTiles) {
                        for (tileInd = 0; tileInd < aTiles.length; ++tileInd) {
                            tileId = encodeURIComponent(that.oLaunchPageService.getCatalogTileId(aTiles[tileInd].object));
                            tileGroups = that.oTileCatalogToGroupsMap[tileId] || [];
                            groupId = that.oLaunchPageService.getGroupId(oGroup.object);
                            // We make sure the group is visible and not locked, otherwise we should not put it in the map it fills.
                            if (tileGroups.indexOf(groupId) === -1
                                && (typeof (oGroup.isGroupVisible) === "undefined" || oGroup.isGroupVisible)
                                && !oGroup.isGroupLocked) {
                                    tileGroups.push(groupId);
                                }
                            that.oTileCatalogToGroupsMap[tileId] = tileGroups;
                        }
                    }
                });
            });
        },

        updateCatalogTilesToGroupsMap: function () {
            var aCatalog = this.getModel().getProperty("/catalogs"),
                index,
                tileId,
                associatedGrps,
                aGroups,
                aCatalogCustom,
                aCatalogAppboxes,
                aCatalogCustomIndex,
                aCatalogAppboxesIndex,
                oAppBoxTile,
                oCustomTile;
            // if the catalogTile model doesn't exist, it will be updated in some time later
            if (aCatalog) {
                for (index = 0; index < aCatalog.length; index++) {
                    aCatalogAppboxes = aCatalog[index].appBoxes;

                    if (aCatalogAppboxes) {
                        //Iterate over all the appBoxes.
                        for (aCatalogAppboxesIndex = 0; aCatalogAppboxesIndex < aCatalogAppboxes.length; aCatalogAppboxesIndex++) {
                            oAppBoxTile = aCatalogAppboxes[aCatalogAppboxesIndex];
                            tileId = encodeURIComponent(this.oLaunchPageService.getCatalogTileId(oAppBoxTile.src));
                            //Get the mapping of the associated groups map.
                            aGroups = this.oTileCatalogToGroupsMap[tileId];
                            associatedGrps = (aGroups || []);
                            oAppBoxTile.associatedGroups = associatedGrps;
                        }
                    }

                    aCatalogCustom = aCatalog[index].customTiles;

                    if (aCatalogCustom) {
                        //Iterate over all the appBoxes.
                        for (aCatalogCustomIndex = 0; aCatalogCustomIndex < aCatalogCustom.length; aCatalogCustomIndex++) {
                            oCustomTile = aCatalogCustom[aCatalogCustomIndex];
                            tileId = encodeURIComponent(this.oLaunchPageService.getCatalogTileId(oCustomTile.src));
                            //Get the mapping of the associated groups map.
                            aGroups = this.oTileCatalogToGroupsMap[tileId];
                            associatedGrps = (aGroups || []);
                            oCustomTile.associatedGroups = associatedGrps;
                        }
                    }
                }
            }
            this.getModel().setProperty("/catalogs", aCatalog);
        },

        /**
         * Adds a catalog object to the model including the catalog tiles.
         * The catalog is added to the "/catalogs" array in the model, and the tiles are added to "/catalogTiles".
         * If a catalog with the same title already exists - no new entry is added to the model for the new catalog,
         * and the tiles are added to "/catalogTiles" with indexes that place them under the catalog
         * (with the same title) that already exists

        /**
         * TODOs: We want to remove the catalogTiles.
         *
         * Align to the Data structure according to the wiki.
         * I have updated it a bit.
         *
         * catalogs : [
         * catalog: {
         *          title: srvc.getCatalogTitle(oCatalog),
         *          id: srvc.getCatalogId(oCatalog),
         *          numIntentSupportedTiles: 0,
         *          "static": false,
         *          customTiles: [
         *              the notmal tile model.
         *          ],
         *          appBoxes: [
         *              {
         *                  title: ,
         *                  subtitle: ,
         *                  icon: ,
         *                  url: ,
         *                  catalogIndex:
         *              }
         *          ],
         *          numberOfCustomTiles: 0,
         *          numberOfAppBoxs: 0
         *      }
         *  ]
         *
         *  Also We can simplify TileContainer to support Flat List. with no headers.
         *  TileContainer to support one level indexing visible (true / false).
         *
         * @param {object} oCatalog
         *   The catalog that is added to the model
         * @returns {object} oPromise Promise that resolves to a pending Catalog
         *
         */
        addCatalogToModel: function (oCatalog) {
            var oCatalogModel = {
                title: this.oLaunchPageService.getCatalogTitle(oCatalog),
                id: this.oLaunchPageService.getCatalogId(oCatalog),
                numberTilesSupportedOnCurrectDevice: 0,
                static: false,
                customTiles: [],
                appBoxes: []
            };

            Measurement.resume("FLP:DashboardManager.getCatalogTiles");

            return this.oLaunchPageService.getCatalogTiles(oCatalog)
                .then(function (oCatalogEntry) {
                    Measurement.pause("FLP:DashboardManager.getCatalogTiles");
                    return {
                        oCatalogEntry: oCatalogEntry,
                        oCatalogModel: oCatalogModel
                    };
                }).fail(oMessagingHelper.showLocalizedErrorHelper("fail_to_load_catalog_tiles_msg"));
        },

        getTagList: function (maxTags) {
            var indexedTags = {},
                ind = 0,
                tempTagsLst = [],
                tag,
                oTag,
                sorted;

            if (this.oModel.getProperty("/tagList") && this.oModel.getProperty("/tagList").length > 0) {
                this.tagsPool.concat(this.oModel.getProperty("/tagList"));
            }

            for (ind = 0; ind < this.tagsPool.length; ind++) {
                oTag = this.tagsPool[ind];
                if (indexedTags[oTag]) {
                    indexedTags[oTag]++;
                } else {
                    indexedTags[oTag] = 1;
                }
            }

            //find the place in the sortedTopTiles.
            for (tag in indexedTags) {
                tempTagsLst.push({ tag: tag, occ: indexedTags[tag] });
            }

            sorted = tempTagsLst.sort(function (a, b) {
                return b.occ - a.occ;
            });

            if (maxTags) {
                this.oModel.setProperty("/tagList", sorted.slice(0, maxTags));
            } else {
                this.oModel.setProperty("/tagList", sorted);
            }
        },

        /**
         * Processes the catalogs retrieved from the service and updates the model
         * @param {array} aPendingCatalogQueue number of catalogs to be displayed
         */
        processPendingCatalogs: function (aPendingCatalogQueue) {
            var aCurrentCatalogs = this.oModel.getProperty("/catalogs"),
                oPendingCatalogEntry,
                oCatalogEntry,
                oCatalogModel,
                oExistingCatalogInModel,
                bIsNewCatalog,
                oCatalogObject,
                oEventBus = sap.ui.getCore().getEventBus(),
                aAllEntryInCatalogMaster = this.oModel.getProperty("/masterCatalogs") || [{
                    title: oMessagingHelper.getLocalizedText("all")
                }];
            Measurement.end("FLP:DashboardManager.getCatalogTiles");
            Measurement.resume("FLP:DashboardManager.BuildCatalogModelWithRendering");

            //reset skippedProcessCatalogs counter
            this.skippedProcessCatalogs = 0;
            // Check if a catalog with the given title already exists in the model.
            while (aPendingCatalogQueue.length > 0) {
                oPendingCatalogEntry = aPendingCatalogQueue.shift();
                oCatalogEntry = oPendingCatalogEntry.oCatalogEntry;
                oCatalogModel = oPendingCatalogEntry.oCatalogModel;
                oExistingCatalogInModel = this.searchModelCatalogByTitle(oCatalogModel.title);
                if (oExistingCatalogInModel.result) {
                    oCatalogObject = this.oModel.getProperty("/catalogs")[oExistingCatalogInModel.indexOfPreviousInstanceInModel];
                    bIsNewCatalog = false;
                } else {
                    bIsNewCatalog = true;
                    oCatalogObject = oCatalogModel;
                }
                var prepareCatalogObjectForModel = function (oCurrentCatalogObject, oCatalogTile) {
                    var oAppBoxNew;
                    //Do not add Item if no intent supported
                    if (this._getIsIntentSupported(oCatalogTile)) {
                        if (this._getIsAppBox(oCatalogTile)) {
                            oAppBoxNew = this.createCatalogAppBoxes(oCatalogTile, true);
                            oCurrentCatalogObject.appBoxes.push(oAppBoxNew);
                        } else {
                            var oCatalogTileNew = this.createCatalogTiles(oCatalogTile);
                            oCurrentCatalogObject.customTiles.push(oCatalogTileNew);
                            //add the getTileView to an array of functions that will be executed once the catalog finishs to load
                            //we need this array in order to call geTileView for all customTiles. see incident: ******
                            if (!this.aFnToGetTileView) {
                                this.aFnToGetTileView = [];
                            }
                        }
                    }
                }.bind(this, oCatalogObject);
                oCatalogEntry.forEach(prepareCatalogObjectForModel);

                //Update model just if catalog has tiles or appbox.
                if (oCatalogObject.appBoxes.length > 0 || oCatalogObject.customTiles.length > 0) {
                    if (bIsNewCatalog) {
                        aCurrentCatalogs.push(oCatalogModel);
                        aAllEntryInCatalogMaster.push({
                            title: oCatalogModel.title
                        });

                    }
                }
                if (this.oModel.getProperty("/enableCatalogTagFilter") === true) {
                    this.getTagList();
                }
            }

            this.oModel.setProperty("/masterCatalogs", aAllEntryInCatalogMaster);
            this.oModel.setProperty("/catalogs", aCurrentCatalogs);
            oEventBus.publish("launchpad", "afterCatalogSegment");
            setTimeout(function () {
                // the first segment has been loaded and rendered
                oUtils.setPerformanceMark("FLP-TTI-AppFinder", { bUseUniqueMark: true });
            }, 0); // Catalogs have not yet been rendered but after a setTimeout they have been

            Measurement.pause("FLP:DashboardManager.BuildCatalogModelWithRendering");
        },

        loadCustomTilesKeyWords: function () {
            var fn;
            if (this.aFnToGetTileView) {
                while (this.aFnToGetTileView.length > 0) {
                    fn = this.aFnToGetTileView.pop();
                    fn();
                }
            }
        },

        /**
         * check if a catalog with the given title already exists in the model.
         *
         *  @param {string} catalogTitle Title of a catalog.
         *
         *  @returns {object} - an object that includes:
         *  - result - a boolean value indicating whether the model already includes a catalog with the same title
         *  - indexOfPreviousInstanceInModel - the index in the model (in /catalogs) of the existing catalog with the given title
         *  - indexOfPreviousInstanceInPage - the index in the page of the existing  catalog with the given title,
         *     this value usually equals (indexOfPreviousInstanceInModel-1) since the model
         *     includes the dummy-catalog "All Cataslogs"
         *     that doesn't appear in the page
         *  - numOfTilesInCatalog - the number of tiles in the catalog with the given title
         */
        searchModelCatalogByTitle: function (catalogTitle) {
            var catalogs = this.oModel.getProperty("/catalogs"),
                catalogTitleExists = false,
                indexOfPreviousInstance,
                numOfTilesInCatalog = 0,
                bGeneralCatalogAppeared = false;

            jQuery.each(catalogs, function (index, tempCatalog) {
                // If this is the catalogsLoading catalog - remember that it was read since the found index should be reduced by 1
                if (tempCatalog.title === resources.i18n.getText("catalogsLoading")) {
                    bGeneralCatalogAppeared = true;
                } else if (catalogTitle === tempCatalog.title) {
                    indexOfPreviousInstance = index;
                    numOfTilesInCatalog = tempCatalog.numberOfTiles;
                    catalogTitleExists = true;
                    return false;
                }
                return undefined;
            });
            return {
                result: catalogTitleExists,
                indexOfPreviousInstanceInModel: indexOfPreviousInstance,
                indexOfPreviousInstanceInPage: bGeneralCatalogAppeared ? indexOfPreviousInstance - 1 : indexOfPreviousInstance,
                numOfTilesInCatalog: numOfTilesInCatalog
            };
        },

        createCatalogAppBoxes: function (oCatalogTile, bGetTileKeyWords) {
            var catalogTileId = encodeURIComponent(this.oLaunchPageService.getCatalogTileId(oCatalogTile)),
                associatedGrps = this.oTileCatalogToGroupsMap[catalogTileId] || [],
                tileTags = this.oLaunchPageService.getCatalogTileTags(oCatalogTile) || [];

            if (tileTags.length > 0) {
                this.tagsPool = this.tagsPool.concat(tileTags);
            }
            var sNavigationMode;
            if (oCatalogTile.tileResolutionResult) {
                sNavigationMode = oCatalogTile.tileResolutionResult.navigationMode;
            }

            return {
                id: catalogTileId,
                associatedGroups: associatedGrps,
                src: oCatalogTile,
                title: this.oLaunchPageService.getCatalogTilePreviewTitle(oCatalogTile),
                subtitle: this.oLaunchPageService.getCatalogTilePreviewSubtitle(oCatalogTile),
                icon: this.oLaunchPageService.getCatalogTilePreviewIcon(oCatalogTile),
                keywords: bGetTileKeyWords ? (this.oLaunchPageService.getCatalogTileKeywords(oCatalogTile) || []).join(",") : [],
                tags: tileTags,
                navigationMode: sNavigationMode,
                url: this.oLaunchPageService.getCatalogTileTargetURL(oCatalogTile)
            };
        },

        onDoneLoadingCatalogs: function (aCatalogs) {
            var i, aCatalogTilePromises = [],
                that = this;

            for (i = 0; i < aCatalogs.length; i++) {
                aCatalogTilePromises.push(this.oLaunchPageService.getCatalogTiles(aCatalogs[i]));
            }

            Promise.all(aCatalogTilePromises).then(function (aResCatalogTile) {
                var iIndexResCatalogTile,
                    noTiles = true;

                for (iIndexResCatalogTile = 0; iIndexResCatalogTile < aResCatalogTile.length; iIndexResCatalogTile++) {
                    if (aResCatalogTile[iIndexResCatalogTile].length !== 0) {
                        noTiles = false;
                        break;
                    }
                }

                if (noTiles || !aCatalogs.length) {
                    that.oModel.setProperty("/catalogsNoDataText", resources.i18n.getText("noCatalogs"));
                }
            });

            //Publish event catalog finished loading.
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("launchpad", "catalogContentLoaded");

            var aLoadedCatalogs = aCatalogs.filter(function (oCatalog) {
                var sCatalogError = that.oLaunchPageService.getCatalogError(oCatalog);
                if (sCatalogError) {
                    Log.error(
                        "A catalog could not be loaded",
                        sCatalogError,
                        "sap.ushell.components.CatalogsManager"
                    );
                }
                return !sCatalogError;
            });
            //check if some of the catalogs failed to load
            if (aLoadedCatalogs.length !== aCatalogs.length) {
                oMessagingHelper.showLocalizedError("partialCatalogFail");
            }

            oUtils.handleTilesVisibility();
        },

        createCatalogTiles: function (oCatalogTile/*, bGetTileKeyWords*/) {
            var tileView,
                tileTitle,
                catalogTileId = encodeURIComponent(this.oLaunchPageService.getCatalogTileId(oCatalogTile)),
                associatedGrps = this.oTileCatalogToGroupsMap[catalogTileId] || [],
                tileTags = this.oLaunchPageService.getCatalogTileTags(oCatalogTile) || [];

            if (tileTags.length > 0) {
                this.tagsPool = this.tagsPool.concat(tileTags);
            }

            tileView = new TileState({ state: "Loading" });
            // if it's not a dynamic or static tile, we need to call the getCatalogTileView already here to make the search work
            // the keywords for Smart Business tiles are only there if their view was rendered before
            var sChipId = oCatalogTile.getChip && oCatalogTile.getChip().getBaseChipId && oCatalogTile.getChip().getBaseChipId();
            if (sChipId && ["X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER", "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER"].indexOf(sChipId) === -1) {
                this.oLaunchPageService.getCatalogTileView(oCatalogTile);
            }
            tileTitle = this.oLaunchPageService.getCatalogTilePreviewTitle(oCatalogTile);
            if (!tileTitle) {
                tileTitle = this.oLaunchPageService.getCatalogTileTitle(oCatalogTile);
            }
            return {
                associatedGroups: associatedGrps,
                src: oCatalogTile,
                catalog: oCatalogTile.title,
                catalogId: oCatalogTile.id,
                title: tileTitle,
                tags: tileTags,
                keywords: (this.oLaunchPageService.getCatalogTileKeywords(oCatalogTile) || []).join(","),
                id: catalogTileId,
                size: this.oLaunchPageService.getCatalogTileSize(oCatalogTile),
                content: [tileView],
                isTileIntentSupported: this.oLaunchPageService.isTileIntentSupported(oCatalogTile),
                tileType: oCatalogTile.tileType
            };
        },

        createGroupAndSaveTile: function (oData) {
            var that = this,
                oCatalogTileContext = oData.catalogTileContext,
                sNewTitle = oData.newGroupName,
                deferred = new jQuery.Deferred(),
                oResponseData = {};

            if (oUtils.validHash(sNewTitle) && oCatalogTileContext) {
                this.createGroup(sNewTitle).then(function (oContext) {
                    var promise = that.createTile({
                        catalogTileContext: oCatalogTileContext,
                        groupContext: oContext
                    });

                    promise.done(function (data) {
                        oResponseData = { group: data.group, status: 1, action: "addTileToNewGroup" }; // 1 - success
                        deferred.resolve(oResponseData);
                    }).fail(function (data) {
                        oResponseData = { group: data.group, status: 0, action: "addTileToNewGroup" }; // 0 - failure
                        deferred.resolve(oResponseData);
                    });
                });
            }
            return deferred.promise();
        },

        createGroup: function (sTitle) {
            var that = this,
                oDeferred = new jQuery.Deferred();
            if (!oUtils.validHash(sTitle)) {
                return oDeferred.reject({ status: 0, action: "createNewGroup" }); // 0 - failure
            }

            var oResultPromise = this.oLaunchPageService.addGroup(sTitle);
            oResultPromise.done(function (oGroup/*, sGroupId*/) {
                var oGroupContext = that.oHomepageManager.addGroupToModel(oGroup);
                oDeferred.resolve(oGroupContext);
            });
            oResultPromise.fail(function () {
                oMessagingHelper.showLocalizedError("fail_to_create_group_msg");
                var oResponseData = { status: 0, action: "createNewGroup" }; // 0 - failure
                oDeferred.resolve(oResponseData); // 0 - failure
            });

            return oDeferred.promise();
        },

        createTile: function (oData) {
            var that = this,
                oCatalogTileContext = oData.catalogTileContext,
                oContext = oData.groupContext,
                oGroup = this.oModel.getProperty(oContext.getPath()),
                sGroupId = oGroup.groupId,
                oResultPromise,
                oDeferred = new jQuery.Deferred(),
                oResponseData = {},
                oEventBus;

            //publish event for UserActivityLog
            oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("launchpad", "addTile", {
                catalogTileContext: oCatalogTileContext,
                groupContext: oContext
            });

            if (!oCatalogTileContext) {
                Log.warning("CatalogsManager: Did not receive catalog tile object. Abort.", this);
                oResponseData = { group: oGroup, status: 0, action: "add" }; // 0 - failure
                return Promise.resolve(oResponseData);
            }

            oResultPromise = this.oLaunchPageService.addTile(oCatalogTileContext.getProperty("src"), oContext.getProperty("object"));
            oResultPromise.done(function (oTile) {
                var aGroups = that.oModel.getProperty("/groups"),
                    sGroupPath = oGroupsHelper.getModelPathOfGroup(aGroups, sGroupId),
                    sTileTitle = that.oLaunchPageService.getTileTitle(oTile);

                that.oHomepageManager.addTileToGroup(sGroupPath, oTile);
                oResponseData = { group: oGroup, status: 1, action: "add" }; // 1 - success
                sap.ushell.Container.getService("UsageAnalytics").logCustomEvent(
                    that.analyticsConstants.PERSONALIZATION,
                    that.analyticsConstants.ADD_TILE,
                    [oGroup.title, sTileTitle]
                );
                oDeferred.resolve(oResponseData);
            }).fail(function () {
                oMessagingHelper.showLocalizedError("fail_to_add_tile_msg");
                oResponseData = { group: oGroup, status: 0, action: "add" }; // 0 - failure
                oDeferred.resolve(oResponseData);
            });

            return oDeferred.promise();
        },

        /*
        * Delete all instances of a catalog Tile from a Group
        */
       deleteCatalogTileFromGroup: function (oData) {
        var that = this,
            sDeletedTileCatalogId = decodeURIComponent(oData.tileId),
            iGroupIndex = oData.groupIndex,
            oGroup = this.oModel.getProperty("/groups/" + iGroupIndex),
            deferred = new jQuery.Deferred(),
            aDeleteTilePromises = [],
            aRemovedTileIds = [],
            oPositiveDeferred,
            oDeletePromise;

        ["tiles", "links"].forEach(function (sAttribute) {
            oGroup[sAttribute].forEach(function (oTile) {
                var sTmpTileCatalogId = that.oLaunchPageService.getCatalogTileId(oTile.object);
                if (sTmpTileCatalogId === sDeletedTileCatalogId) {
                    // Initialize oPositiveDeferred object that will later be resolved with the status of the delete request
                    oPositiveDeferred = new jQuery.Deferred();
                    // Send the delete request to the server
                    oDeletePromise = that.oLaunchPageService.removeTile(oGroup.object, oTile.object);

                    oDeletePromise.done(
                        (function (oDeferred) {
                            return function () {
                                aRemovedTileIds.push(oTile.uuid);
                                oDeferred.resolve({ status: true });
                            };
                        })(oPositiveDeferred));

                    oDeletePromise.fail(
                        (function (oDeferred) {
                            return function () {
                            oDeferred.resolve({ status: false });
                            };
                        })(oPositiveDeferred));

                    aDeleteTilePromises.push(oPositiveDeferred);
                }
            });
        });

        // Wait for all of the delete requests before resolving the deferred
        jQuery.when.apply(jQuery, aDeleteTilePromises).done(function (result) {
            //If some promise was rejected, some tiles was not removed
            var bSuccess = aDeleteTilePromises.length === aRemovedTileIds.length;
            //Update groups for removed tiles
            that.oHomepageManager.deleteTilesFromGroup(oGroup.groupId, aRemovedTileIds);
            that.updateTilesAssociation();
            deferred.resolve({ group: oGroup, status: bSuccess, action: "remove" });
        });
        return deferred.promise();
    },

        /**
         * @param {i} catalogIndex the index of the catalog
         * @param {i} numberOfExistingTiles the number of catalog tiles that were already loaded for previous catalog/s with the same title
         * @param {i} iTile the index of the current catalog tile in the containing catalog
         * @returns {i} result the catalog tile index
         */
        calculateCatalogTileIndex: function (catalogIndex, numberOfExistingTiles, iTile) {
            var result = parseInt(catalogIndex * 100000, 10);
            result += (numberOfExistingTiles !== undefined ? numberOfExistingTiles : 0) + iTile;
            return result;
        },

        /**
         * Shows an appropriate message to the user when action (add or delete tile from group) fails
         *
         * @param {string} sMsgId
         *      The localization id of the message
         * @param {object} aParameters
         *      Additional parameters for the Message Toast showing the message. Can be undefined.
         */
        notifyOnActionFailure: function (sMsgId, aParameters) {
            oMessagingHelper.showLocalizedError(sMsgId, aParameters);
        },

        /**
         * Shows an message and update tiles association when action (add or delete tile from group) fails
         *
         * @param {string} sMsgId
         *      The localization id of the message
         * @param {object} aParameters
         *      Additional parameters for the Message Toast showing the message. Can be undefined.
         */
        resetAssociationOnFailure: function (sMsgId, aParameters) {
            this.notifyOnActionFailure(sMsgId, aParameters);
            this.updateTilesAssociation();
        },

        _getIsIntentSupported: function (oCatalogTile) {
            return !!(this.oLaunchPageService.isTileIntentSupported(oCatalogTile));
        },

        _getIsAppBox: function (oCatalogTile) {
            var sAppFinderDisplayMode,
                bIsAppBox;

            if (!sap.ushell.Container) {
                return false;
            }

            /*
            When appFinderDisplayMode is set to "tiles", non-custom tiles will have the same display as custom tiles
            (i.e. will not be displayed as AppBoxes).
            In other words - all tiles (custom and non-custom) will be displayed as tiles
            when appFinderDisplayMode is not set at all, or set to "appBoxes", non-custom tiles will be displayed as AppBoxes.
            */

            // get appFinder display mode from configuration
            sAppFinderDisplayMode = this.oModel.getProperty("/appFinderDisplayMode");

            // determine the catalog tile display mode:
            if (sAppFinderDisplayMode === "tiles") {
                bIsAppBox = false;
            } else {
                bIsAppBox = !!(
                    this.oLaunchPageService.getCatalogTileTargetURL(oCatalogTile)
                        && (
                            this.oLaunchPageService.getCatalogTilePreviewTitle(oCatalogTile)
                            || this.oLaunchPageService.getCatalogTilePreviewSubtitle(oCatalogTile)
                        )
                    );
            }
            return bIsAppBox;
        },

        destroy: function () {
            this.unregisterEvents();
        }
    });

    return CatalogsManager;
});