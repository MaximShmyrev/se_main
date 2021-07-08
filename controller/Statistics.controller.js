sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/viz/ui5/data/FlattenedDataset',
	'sap/viz/ui5/controls/common/feeds/FeedItem', 'sap/m/Label',
	'sap/m/ColumnListItem', 'sap/m/library', 'sap/m/Column', 'sap/viz/ui5/controls/common/feeds/AnalysisObject',
	'sap/viz/ui5/controls/VizFrame', 'sap/m/Table', 'sap/suite/ui/commons/ChartContainerContent'
],
	function (Controller, JSONModel, FlattenedDataset, FeedItem, Label, ColumnListItem, MobileLibrary, Column,
		AnalysisObject, VizFrame, Table, ChartContainerContent) {
		"use strict";

		var analyticsData;
		var resultsKB;
		var resultsMain;
		var resultsQuiz;
		var resultsMenu;
		var resultsEmployees;
		var resultsNews;

		// get analytics
		var analyticsHTTP = new XMLHttpRequest();
		analyticsHTTP.open('POST', 'http://portal.samaraenergo.ru:50000/ZCE_AnalyticsService/ZCE_Analytics', false);

		var analyticsRequest = '<?xml version="1.0" encoding="utf-8"?>' +
			'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_analytics/">' +
			'<soapenv:Header/>' +
			'<soapenv:Body>' +
			'<zce:getAnalytics/>' +
			'</soapenv:Body>' +
			'</soapenv:Envelope>';

		analyticsHTTP.onreadystatechange = function () {
			if (analyticsHTTP.readyState == 4) {
				if (analyticsHTTP.status == 200) {
					var analyticsResponse = analyticsHTTP.responseText;
					var analyticsSplit = analyticsResponse.split(/<return>|<\/return>/);
					var analyticsArray = analyticsSplit[1];
					analyticsData = JSON.parse(analyticsArray.toString());

					for (var i = 0; i < analyticsData.length; i++) {

						if ( analyticsData[i].MODULE_NAME == 'KB' ) {
							resultsKB = analyticsData[i].N_VISITS;
						}

						if ( analyticsData[i].MODULE_NAME == 'Employees' ) {
							resultsEmployees = analyticsData[i].N_VISITS;
						}
						
						if ( analyticsData[i].MODULE_NAME == 'News' ) {
							resultsNews = analyticsData[i].N_VISITS;
						}
						
						if ( analyticsData[i].MODULE_NAME == 'Menu' ) {
							resultsMenu = analyticsData[i].N_VISITS;
						}
						
						if ( analyticsData[i].MODULE_NAME == 'Quiz' ) {
							resultsQuiz = analyticsData[i].N_VISITS;
						}
						
						if ( analyticsData[i].MODULE_NAME == 'Main' ) {
							resultsMain = analyticsData[i].N_VISITS;
						}							

					}					
					
				}
			}
		};

		analyticsHTTP.setRequestHeader("Content-Type", "text/xml");
		analyticsHTTP.send(analyticsRequest);

		var oData = [{
			"Country": "Главная страница",
			"Profit": resultsMain
		}, {
			"Country": "Анкетирование",
			"Profit": resultsQuiz
		}, {
			"Country": "Меню",
			"Profit": resultsMenu
		}, {
			"Country": "Справочник сотрудников",
			"Profit": resultsEmployees
		}, {
			"Country": "Инфоблок",
			"Profit": resultsNews
		}];

		var oPageController = Controller.extend("main.controller.Statistics", {
			/* ============================================================ */
			/* Constants                                                    */
			/* ============================================================ */
			/**
			 * Constants used in the example.
			 *
			 * @private
			 * @property {string} sampleName Name of the chart container sample
			 * @property {string} chartContainerId Id of the chart container
			 * @property {Object} table Configuration for the table used in the view
			 * @property {string} table.icon Icon used for the table
			 * @property {string} table.title Title used for the table
			 * @property {string} table.itemBindingPath Table item binding path
			 * @property {string[]} table.columnLabelTexts Label texts used for the table columns
			 * @property {string[]} table.templateCellLabelTexts Label texts used for the table template cells
			 * @property {Object} vizFrames Data for Viz Frames by products, country 1, and country 2
			 * @property {Object} vizFrames.config Common configuration applicable to all Viz Frames
			 * @property {Object} vizFrames.config.height Height of the Viz Frame in pixels
			 * @property {Object} vizFrames.config.width Relative (%) width of the Viz Frame
			 * @property {Object} vizFrames.config.uiConfig UI specific config
			 * @property {Object} vizFrames.config.uiConfig.applicationSet Application set
			 * @property {Object} vizFrames.product Config
			 * @property {string} vizFrames.product1.icon Icon used for the viz frame
			 * @property {string} vizFrames.product.title Title used for the viz frame
			 * @property {string} vizFrames.product.dataPath Data path
			 * @property {Object} vizFrames.product.dataSet Data holder for information used by flattened data control
			 * @property {Object[]} vizFrames.product.dataSet.dimensions Data dimensions
			 * @property {Object[]} vizFrames.product.dataSet.measures Data measures
			 * @property {Object} vizFrames.product.dataSet.data Other data
			 * @property {string} vizFrames.product.dataSet.data.path Path to flattened data
			 * @property {Object[]} vizFrames.product.feedItems Feed items
			 * @property {Object[]} vizFrames.product.vizType Viz Frame type
			 * @property {Object} vizFrames.country1 Config
			 * @property {string} vizFrames.country1.icon Icon used for the viz frame
			 * @property {string} vizFrames.country1.title Title used for the viz frame
			 * @property {string} vizFrames.country1.dataPath Data path
			 * @property {Object} vizFrames.country1.dataSet Data holder for information used by flattened data control
			 * @property {Object[]} vizFrames.country1.dataSet.dimensions Data dimensions
			 * @property {Object[]} vizFrames.country1.dataSet.measures Data measures
			 * @property {Object} vizFrames.country1.dataSet.data Other data
			 * @property {string} vizFrames.country1.dataSet.data.path Path to flattened data
			 * @property {Object[]} vizFrames.country1.feedItems Feed items
			 * @property {Object[]} vizFrames.country1.vizType Viz Frame type
			 * @property {Object} vizFrames.country2 Config
			 * @property {string} vizFrames.country2.icon Icon used for the viz frame
			 * @property {string} vizFrames.country2.title Title used for the viz frame
			 * @property {string} vizFrames.country2.dataPath Data path
			 * @property {Object} vizFrames.country2.dataSet Data holder for information used by flattened data control
			 * @property {Object[]} vizFrames.country2.dataSet.dimensions Data dimensions
			 * @property {Object[]} vizFrames.country2.dataSet.measures Data measures
			 * @property {Object} vizFrames.country2.dataSet.data Other data
			 * @property {string} vizFrames.country2.dataSet.data.path Path to flattened data
			 * @property {Object[]} vizFrames.country2.feedItems Feed items
			 * @property {Object} vizFrames.country2.analysisObjectProps Properties for the analysis object
			 * @property {string} vizFrames.country2.analysisObjectProps.uid Analysis object uid
			 * @property {string} vizFrames.country2.analysisObjectProps.type Analysis object type
			 * @property {string[]} vizFrames.country2.analysisObjectProps.values Analysis object value array
			 * @property {Object[]} vizFrames.country2.vizType Viz Frame type
			 */
			_constants: {
				sampleName: "sap.suite.ui.commons.sample.ChartContainerDimensionsMultiCharts",
				chartContainerId: "chartContainer",
				table: {
					icon: "sap-icon://table-view",
					title: "Table",
					itemBindingPath: "/businessData",
					columnLabelTexts: ["Sales Month", "Marital Status", "Customer Gender", "Sales Quarter", "Cost", "Unit Price", "Gross Profit",
						"Sales Revenue"
					],
					templateCellLabelTexts: ["{Sales_Month}", "{Marital Status}", "{Customer Gender}", "{Sales_Quarter}", "{Cost}", "{Unit Price}",
						"{Gross Profit}", "{Sales Revenue}"
					]
				},
				vizFrames: {
					config: {
						height: "700px",
						width: "100%",
						uiConfig: {
							applicationSet: "fiori"
						}
					},
					country1: {
						icon: "sap-icon://horizontal-stacked-chart",
						title: "Stacked Bar Chart",
						dataset: {
							dimensions: [{
								name: "Модуль",
								value: "{Country}"
							}],
							measures: [{
								name: "Посещения",
								value: "{Profit}"
							}],
							data: {
								path: "/"
							}
						},
						feedItems: [{
							uid: "primaryValues",
							type: "Measure",
							values: ["Посещения"]
						}, {
							uid: "axisLabels",
							type: "Dimension",
							values: ["Модуль"]
						}],
						vizType: "stacked_bar"
					},
					country2: {
						icon: "sap-icon://vertical-bar-chart",
						title: "Bar Chart",
						dataPath: "/ChartContainerData3.json",
						dataset: {
							dimensions: [{
								name: "Country",
								value: "{Country}"
							}],
							measures: [{
								name: "Profit",
								value: "{profit}"
							}],
							data: {
								path: "/businessData"
							}
						},
						feedItems: [{
							uid: "primaryValues",
							type: "Measure",
							values: ["Profit"]
						}, {
							uid: "axisLabels",
							type: "Dimension",
							values: []
						}],
						analysisObjectProps: {
							uid: "Country",
							type: "Dimension",
							name: "Country"
						},
						vizType: "column"
					}
				}
			},
			/**
			 * Changeable properties depending on the app's state.
			 *
			 * @private
			 * @property {sap.viz.ui5.controls.VizFrame} vizFrameProduct Product Viz Frame
			 * @property {sap.viz.ui5.controls.VizFrame} vizFrameCountry1 Country 1 Viz Frame
			 * @property {sap.viz.ui5.controls.VizFrame} vizFrameCountry2 Country 2 Viz Frame
			 * @property {sap.m.Table} table App data table
			 */
			_state: {
				vizFrames: {
					product: null,
					country1: null,
					country2: null
				},
				table: null
			},
			/* ============================================================ */
			/* Life-cycle Handling                                          */
			/* ============================================================ */
			/**
			 * Method called when the application is initalized.
			 *
			 * @public
			 */
			onInit: function () {
				var oCountry2VizFrame = this._constants.vizFrames.country2;
				var oAnalysisObject = new AnalysisObject(oCountry2VizFrame.analysisObjectProps);
				var aValues = oCountry2VizFrame.feedItems[1].values;
				if (aValues.length === 0) {
					aValues.push(oAnalysisObject);
				}

				this._initializeSalesByCountry();
				// Initially show the content for sales by product
				this._showSalesByCountry();
			},

			onPressHome: function () {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				document.title = "Главная страница";
				oRouter.navTo("home", {}, true);
			},		

			/* ============================================================ */
			/* Event Handling                                               */
			/* ============================================================ */
			/**
			 * Switches the views "sales by product" and "sales by country".
			 *
			 * The ChartContainerContent is replaced here.
			 *
			 * @param {sap.ui.base.Event} oEvent The fired event
			 */
			/* ============================================================ */
			/* Helper Methods                                               */
			/* ============================================================ */
			/**
			 * Initializes sales by country Viz Frames.
			 *
			 * @private
			 */
			_initializeSalesByCountry: function () {
				this._state.vizFrames.country1 = this._createVizFrame(this._constants.vizFrames.country1, false);
				this._state.vizFrames.country2 = this._createVizFrame(this._constants.vizFrames.country2, false);
			},
			/**
			 * Creates a Viz Frame based on the passed config and flag for whether a table should be created too.
			 *
			 * @param {Object} vizFrameConfig Viz Frame config
			 * @param {Boolean} createTable Flag for whether a table should be created
			 * @returns {sap.viz.ui5.controls.VizFrame} Created Viz Frame
			 */
			_createVizFrame: function (vizFrameConfig, createTable) {
				var oVizFrame = new VizFrame(this._constants.vizFrames.config);
				var oDataPath = jQuery.sap.getModulePath(this._constants.sampleName, vizFrameConfig.dataPath);
				//var oModel = new JSONModel(oDataPath);
				var oModel = new JSONModel(oData);
				var oDataSet = new FlattenedDataset(vizFrameConfig.dataset);

				oVizFrame.setDataset(oDataSet);
				oVizFrame.setModel(oModel);
				this._addFeedItems(oVizFrame, vizFrameConfig.feedItems);
				oVizFrame.setVizType(vizFrameConfig.vizType);

				if (createTable) {
					this._createTable(oModel);
				}

				return oVizFrame;
			},
			/**
			 * Creates the table used by "sales by product view".
			 *
			 * @private
			 * @param {sap.ui.model.json.JSONModel} vizFrameModel Model used by the Viz Frame
			 */
			_createTable: function (vizFrameModel) {
				var oTableConfig = this._constants.table;
				var oTable = new Table({
					columns: this._createTableColumns(oTableConfig.columnLabelTexts)
				});
				var oTableTemplate = new ColumnListItem({
					type: MobileLibrary.ListType.Active,
					cells: this._createLabels(oTableConfig.templateCellLabelTexts)
				});

				oTable.bindItems(oTableConfig.itemBindingPath, oTableTemplate, null, null);
				oTable.setModel(vizFrameModel);

				this._state.table = oTable;
			},
			/**
			 * Adds the charts or table belonging to the "sales by product" view to the ChartContainer.
			 *
			 * @private
			 */
			_showSalesByProduct: function () {
				var oProductVizFrame = this._constants.vizFrames.product;
				var oTable = this._constants.table;

				var oContent1 = this._createChartContainerContent(oProductVizFrame.icon, oProductVizFrame.title, this._state.vizFrames.product);
				var oContent2 = this._createChartContainerContent(oTable.icon, oTable.title, this._state.table);

				this._updateChartContainerContent(oContent1, oContent2);
			},
			/**
			 * Adds the charts or table belonging to the "sales by country" view to the ChartContainer.
			 *
			 * @private
			 */
			_showSalesByCountry: function () {
				var oCountry1VizFrame = this._constants.vizFrames.country1;
				var oCountry2VizFrame = this._constants.vizFrames.country2;

				var oContent1 = this._createChartContainerContent(oCountry1VizFrame.icon, oCountry1VizFrame.title, this._state.vizFrames.country1);
				var oContent2 = this._createChartContainerContent(oCountry2VizFrame.icon, oCountry2VizFrame.title, this._state.vizFrames.country2);

				this._updateChartContainerContent(oContent1, oContent2);
			},
			/**
			 * Creates chart container content with the given icon, title, and Viz Frame.
			 *
			 * @private
			 * @param {string} icon Icon path
			 * @param {string} title Icon title
			 * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame
			 * @returns {sap.suite.ui.commons.ChartContainerContent} Chart container content
			 */
			_createChartContainerContent: function (icon, title, vizFrame) {
				var oContent = new ChartContainerContent({
					icon: icon,
					title: title
				});

				oContent.setContent(vizFrame);

				return oContent;
			},
			/**
			 * Calls the methods to clear and re-set chart container's content.
			 *
			 * @private
			 * @param {sap.viz.ui5.controls.VizFrame} content1 First Viz Frame
			 * @param {sap.viz.ui5.controls.VizFrame} content2 Second Viz Frame
			 */
			_updateChartContainerContent: function (content1, content2) {
				var oChartContainer = this.getView().byId(this._constants.chartContainerId);
				oChartContainer.removeAllContent();
				oChartContainer.addContent(content1);
				oChartContainer.addContent(content2);
				oChartContainer.updateChartContainer();
			},
			/**
			 * Adds the passed feed items to the passed Viz Frame.
			 *
			 * @private
			 * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame to add feed items to
			 * @param {Object[]} feedItems Feed items to add
			 */
			_addFeedItems: function (vizFrame, feedItems) {
				for (var i = 0; i < feedItems.length; i++) {
					vizFrame.addFeed(new FeedItem(feedItems[i]));
				}
			},
			/**
			 * Creates table columns with labels as headers.
			 *
			 * @private
			 * @param {string[]} labels Column labels
			 * @returns {sap.m.Column[]} Array of columns
			 */
			_createTableColumns: function (labels) {
				var aLabels = this._createLabels(labels);

				return this._createControls(Column, "header", aLabels);
			},
			/**
			 * Creates label control array with the specified texts.
			 *
			 * @private
			 * @param {string[]} labelTexts text array
			 * @returns {sap.m.Column[]} Array of columns
			 */
			_createLabels: function (labelTexts) {
				return this._createControls(Label, "text", labelTexts);
			},
			/**
			 * Creates an array of controls with the specified control type, property name and value.
			 *
			 * @private
			 * @param {sap.ui.core.Control} Control Control type to create
			 * @param {string} prop Property name
			 * @param {Array} propValues Value of the control's property
			 * @returns {sap.ui.core.Control[]} array of the new controls
			 */
			_createControls: function (Control, prop, propValues) {
				var aControls = [];
				var oProps = {};

				for (var i = 0; i < propValues.length; i++) {
					oProps[prop] = propValues[i];
					aControls.push(new Control(oProps));
				}

				return aControls;
			}
		});
		return oPageController;
	});