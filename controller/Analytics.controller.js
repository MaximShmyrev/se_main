sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/viz/ui5/data/FlattenedDataset',
		'sap/viz/ui5/controls/common/feeds/FeedItem', 'sap/m/Label',
		'sap/m/ColumnListItem', 'sap/m/library', 'sap/m/Column', 'sap/viz/ui5/controls/common/feeds/AnalysisObject',
		'sap/viz/ui5/controls/VizFrame', 'sap/m/Table'
	],
	function(Controller, JSONModel, FlattenedDataset, FeedItem, Label, ColumnListItem, MobileLibrary, Column,
		AnalysisObject, VizFrame, Table) {
		"use strict";

		var oData = {
			"items": [{
				"Date": "08/01/2021",
				"Result": "20"
			}, {
				"Date": "09/01/2021",
				"Result": "50"
			}]
		};

		var oPageController = Controller.extend("main.controller.Analytics", {

			onInit: function() {

				var sampleDatajson = new sap.ui.model.json.JSONModel(oData);
				var oVizFrame = this.getView().byId("idStackedChart");
				oVizFrame.setVizProperties({
					plotArea: {
						colorPalette: d3.scale.category20().range(),
						dataLabel: {
							showTotal: true
						}
					},
					tooltip: {
						visible: true
					},
					title: {
						text: "Cводный график"
					}
				});
				var oDataset = new sap.viz.ui5.data.FlattenedDataset({
					dimensions: [{
						name: "Дата",
						value: "{Date}"
					}],
					measures: [{
						name: "Результат",
						value: "{Result}"
					}],

					data: {
						path: "/items"
					}
				});
				oVizFrame.setDataset(oDataset);

				oVizFrame.setModel(sampleDatajson);

				var oFeedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
						"uid": "valueAxis",
						"type": "Measure",
						"values": ["Результат"]
					}),

					oFeedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
						"uid": "categoryAxis",
						"type": "Dimension",
						"values": ["Дата"]
					});

				oVizFrame.addFeed(oFeedValueAxis);
				oVizFrame.addFeed(oFeedCategoryAxis);

			},

			onNavBack: function() {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("quizmain");
			}

		});
		return oPageController;
	});