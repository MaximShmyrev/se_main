sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/viz/ui5/data/FlattenedDataset', 'sap/viz/ui5/controls/common/feeds/FeedItem', 'sap/m/Label',
	'sap/m/ColumnListItem', 'sap/m/library', 'sap/m/MessageToast', 'sap/m/Column', 'sap/ui/core/util/Export',
	'sap/ui/core/util/ExportTypeCSV'
],
	function (Controller, JSONModel, FlattenedDataset, FeedItem, Label, ColumnListItem, MobileLibrary, MessageToast, Column, Export, ExportTypeCSV) {
		"use strict";

		var oData = [];
		var results;
		var oTableModel;
		var oRouter;

		//request data from backend
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_TestsService/ZCE_Tests', false);

		// build SOAP request
		var sr = '<?xml version="1.0" encoding="utf-8"?>' +
			'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_tests/">' +
			'<soapenv:Header/>' +
			'<soapenv:Body>' +
			'<zce:getAnalytic/>' +
			'</soapenv:Body>' +
			'</soapenv:Envelope>';


		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					//parse response and create array for quizes
					var response = xmlhttp.responseText;
					var splitResponse = response.split(/<return>|<\/return>/);
					var arrayResponse = splitResponse[1];
					results = JSON.parse(arrayResponse.toString());

					//add state property to oData
					var index = 0;
					for (var i = 0; i < results.ANALYTICS.length; i++) {
						for (var j = 0; j < results.ANALYTICS[i].RESULTS.length; j++) {

							var isAnswer;

							if (results.ANALYTICS[i].RESULTS[j].ISANSWER == "1") {
								isAnswer = "верно"
							} else {
								isAnswer = "неверно"
							};

							if (results.ANALYTICS[i].USERID !== "null") {

								oData[index] = {
									user: results.ANALYTICS[i].USERID,
									date: results.ANALYTICS[i].DATETIME,
									test: results.ANALYTICS[i].RESULTS[j].DESCRIPTION,
									question: results.ANALYTICS[i].RESULTS[j].QUESTIONTEXT,
									answer: results.ANALYTICS[i].RESULTS[j].ANSWERTEXT,
									result: isAnswer,
								};
								index = index + 1;

							}
						}
					}
				}
			}
		};

		// Send the POST request
		xmlhttp.setRequestHeader("Content-Type", "text/xml");
		xmlhttp.send(sr);

		var oPageController = Controller.extend("main.controller.Analytics", {

			/* ============================================================ */
			/* Constants                                                    */
			/* ============================================================ */

			_constants: {
				sampleName: "main",
				chartContainerId: "idChartContainer",
				vizFrame: {
					id: "idoVizFrame",
					modulePath: "./ChartContainerData1.json",
					dataset: {
						dimensions: [{
							name: 'Country',
							value: "{Country}"
						}],
						measures: [{
							group: 1,
							name: "Profit",
							value: "{Profit}"
						}, {
							group: 1,
							name: "Target",
							value: "{Target}"
						}, {
							group: 1,
							name: "Forecast",
							value: "{Forecast}"
						}, {
							group: 1,
							name: "Revenue",
							value: "{Revenue}"
						}, {
							group: 1,
							name: "Revenue2",
							value: "{Revenue2}"
						}, {
							group: 1,
							name: "Revenue3",
							value: "{Revenue3}"
						}],
						data: {
							path: "/Products"
						}
					},
					type: "line",
					feedItems: [{
						"uid": "primaryValues",
						"type": "Measure",
						"values": ["Revenue"]
					}, {
						"uid": "axisLabels",
						"type": "Dimension",
						"values": ["Country"]
					}, {
						"uid": "targetValues",
						"type": "Measure",
						"values": ["Target"]
					}]
				},
				table: {
					itemBindingPath: "/",
					columnLabelTexts: ["Пользователь", "Дата", "Анкета", "Вопрос", "Ответ", "Результат"],
					templateCellLabelTexts: ["{user}", "{date}", "{test}", "{question}", "{answer}", "{result}"]
				}
			},

			/* ============================================================ */
			/* Life-cycle Handling                                          */
			/* ============================================================ */

			onInit: function () {

				oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.getRoute("analytics").attachMatched(this._onRouteMatched, this);

				// create table content
				var oTable = this.getView().byId("idTable");
				this._createTableContent(oTable);

				//create chart content
				//var oVizFrame = this.getView().byId(this._constants.vizFrame.id);
				//this._updateVizFrame(oVizFrame);
			},

			/* ============================================================ */
			/* Helper Methods                                               */
			/* ============================================================ */
			/**
			 * Creates table content for the chart container
			 * @param {sap.m.Table} oTable view table
			 * @private
			 */
			_createTableContent: function (oTable) {
				//var oTablePath = jQuery.sap.getModulePath(this._constants.sampleName, this._constants.table.modulePath);
				oTableModel = new JSONModel(oData);
				var oTableConfig = this._constants.table;
				var aColumns = this._createTableColumns(oTableConfig.columnLabelTexts);

				for (var i = 0; i < aColumns.length; i++) {
					oTable.addColumn(aColumns[i]);
				}

				var oTableItemTemplate = new ColumnListItem({
					type: MobileLibrary.ListType.Active,
					cells: this._createLabels(oTableConfig.templateCellLabelTexts)
				});

				oTable.bindItems(oTableConfig.itemBindingPath, oTableItemTemplate, null, null);
				oTable.setModel(oTableModel);
			},
			/**
			 * Calls the message toast show method with the given message.
			 *
			 * @private
			 * @param {String} message Message for message toast
			 */
			_showMessageToast: function (message) {
				MessageToast.show(message);
			},
			/**
			 * Updates the Viz Frame with the necessary data and properties.
			 *
			 * @private
			 * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame to update
			 */
			_updateVizFrame: function (vizFrame) {
				var oVizFrame = this._constants.vizFrame;
				var oDataset = new FlattenedDataset(this._constants.vizFrame.dataset);
				var oVizFramePath = jQuery.sap.getModulePath(this._constants.sampleName, oVizFrame.modulePath);
				var oModel = new JSONModel(oVizFramePath);

				vizFrame.setDataset(oDataset);
				vizFrame.setModel(oModel);
				this._addFeedItems(vizFrame, oVizFrame.feedItems);
				vizFrame.setVizType(oVizFrame.type);
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
			 * @param {String[]} labels Column labels
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
			 * @param {String[]} labelTexts text array
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
			 * @param {String} prop Property name
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
			},
			/**
			 * Creates message for a press event on custom button.
			 * @param {sap.ui.base.Event} event the press event object
			 * @private
			 */
			onCustomActionPress: function (event) {
				this._showMessageToast("Custom action press event - " + event.getSource().getId());
			},

			onNavBack: function() {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("quizmain");
			},

			onExportXls: function(oEvent) {
				
				this.getView().setModel(oTableModel);

				var oExport = new Export({
	
					// Type that will be used to generate the content. Own ExportType's can be created to support other formats
					exportType: new ExportTypeCSV({
					 	separatorChar: ";"
					}),

					// exportType: new ExportTypeCSV({
					// 	separatorChar: "\t",
					// 	mimeType: "application/vnd.ms-excel",
					// 	charset: "windows-1251",
					// 	fileExtension: "xls"
					// }),

					
					// Pass in the model created above
					models: this.getView().getModel(),
	
					// binding information for the rows aggregation
					rows: {
						path: "/"
					},
	
					// column definitions with column name and binding info for the content
					columns: [
						{
							name: "Пользователь",
							template: {
								content: "{user}"
							}
						}, {
							name: "Дата",
							template: {
								content: "{date}"
							}
						}, {
							name: "Анкета",
							template: {
								content: "{test}"
							}
						}, {
							name: "Вопрос",
							template: {
								content: "{question}"
							}
						}, {
							name: "Ответ",
							template: {
								content: "{answer}"
							}
						}, {
							name: "Результат",
							template: {
								content: "{result}"
							}
						}
					]
				});
	
				// download exported file
				oExport.saveFile().catch(function(oError) {
					// MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
				}).then(function() {
					oExport.destroy();
				});
			},

		})

		return oPageController;
	});