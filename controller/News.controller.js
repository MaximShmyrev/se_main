sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/core/Fragment"
], function (BaseController, JSONModel, Filter, FilterOperator, Dialog, DialogType, Button, Text, Fragment) {
	"use strict";
	var oData;

	return BaseController.extend("main.controller.News", {

		onInit: function () {

			// update analytics: main page
			var analyticsHTTP = new XMLHttpRequest();
			analyticsHTTP.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_AnalyticsService/ZCE_Analytics', false);

			var analyticsRequest = '<?xml version="1.0" encoding="utf-8"?>' +
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_analytics/">' +
				'<soapenv:Header/>' +
				'<soapenv:Body>' +
				'<zce:updateAnalytics>' +
				'<moduleName>News</moduleName>' +
				'</zce:updateAnalytics>' +
				'</soapenv:Body>' +
				'</soapenv:Envelope>';

			analyticsHTTP.onreadystatechange = function () {
				if (analyticsHTTP.readyState == 4) {
					if (analyticsHTTP.status == 200) {
						var analyticsResponse = analyticsHTTP.responseText;
						var analyticsSplit = analyticsResponse.split(/<return>|<\/return>/);
						var analyticsArray = analyticsSplit[1];
					}
				}
			};

			analyticsHTTP.setRequestHeader("Content-Type", "text/xml");
			analyticsHTTP.send(analyticsRequest);


			this.byId("SplitApp").toDetail(this.createId("detail"));

			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_NewsService/ZCE_News', false);

			// build SOAP request
			var sr = '<?xml version="1.0" encoding="utf-8"?>' +
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_news/">' +
				'<soapenv:Header/>' +
				'<soapenv:Body>' +
				'<zce:getNews/>' +
				'</soapenv:Body>' +
				'</soapenv:Envelope>';

			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) {
						//console.log(xmlhttp.responseText);
						var response = xmlhttp.responseText;

						var splitResponse = response.split(/<return>|<\/return>/);
						var arrayResponse = splitResponse[1];
						var jsonObj = JSON.parse(arrayResponse.toString());
						oData = {
							news: jsonObj,
							categories: [{
								name: "Новости"
							}, {
								name: "Приказы"
							}, {
								name: "Объявления"
							}],
							weeks: 52,
							fragment_image: "",
							fragment_text: ""
						};

					}
				}
			};

			// Send the POST request
			xmlhttp.setRequestHeader("Content-Type", "text/xml");
			xmlhttp.send(sr);

			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);

		},

		onAfterRendering: function () {
			var oSplitApp = this.getView().byId("SplitApp");
			oSplitApp.getAggregation("_navMaster").addStyleClass("masterStyle");
		},

		onPressHome: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			document.title = "Главная страница";
			oRouter.navTo("home", {}, true);
			//window.open("http://prt.samaraenergo.ru:50000/irj/go/km/docs/documents/main/index.html", "_self");

		},

		onSearch: function () {

			//get selected item
			var oList = this.getView().byId("categoriesList");
			var filters = oList.getItems();

			//write selected items to filter array
			var filterNews = [];
			var aFilter = [];

			//read input from key words field
			var keyWord = this.byId("keyWords").getValue();

			if (keyWord !== "") {
				var sQuery = keyWord;
				aFilter.push(new Filter("HEADER", FilterOperator.Contains, sQuery));
			} else {
				for (var i = 0; i < filters.length; i++) {
					var name = filters[i].getContent()[0].mProperties.text;
					var isSelected = filters[i].getContent()[0].mProperties.selected;

					if (isSelected === true) {
						filterNews.push(name);
					}
				}
			}

			//push filter to newsList
			var newsList = this.getView().byId("newsList");

			for (var j = 0; j < filterNews.length; j++) {
				sQuery = filterNews[j];
				aFilter.push(new Filter("TYPE", FilterOperator.EQ, sQuery));
			}

			if (aFilter !== null) {
				var oBinding = newsList.getBinding("items");
				oBinding.filter(new Filter({
					filters: aFilter,
					and: false
				}));
			}

		},

		onToMaster: function () {
			this.byId("SplitApp").toMaster(this.createId("master"));
		},

		onShowChains: function () {
			var oViewModel = this.getModel("view");
			var oViewData = oViewModel.getData();
			if (oViewData.showChains) {
				oViewData.showChains = false;
			} else {
				oViewData.showChains = true;
			}
			oViewModel.refresh(true);
		},

		onScrollToTop: function () {
			this.byId("detail").scrollTo(0, 1000);
		},

		onDialogWithSizePress: function (oEvent) {
			// if (!this.oFixedSizeDialog) {
			var sPath = oEvent.getSource().getBindingContext().getPath();
			var oModel = this.getView().getModel();
			var oContext = oModel.getProperty(sPath);
			this.oFixedSizeDialog = new Dialog({
				title: oContext.title,
				contentWidth: "850px",
				contentHeight: "900px",
				content: [new Text({
					text: oContext.text
				}),
				new Text({
					text: oContext.image
				})
				],
				type: DialogType.Message,
				endButton: new Button({
					text: "Close",
					press: function () {
						this.oFixedSizeDialog.close();
					}.bind(this)
				})
			});

			//to get access to the controller's model
			this.getView().addDependent(this.oFixedSizeDialog);
			// }

			this.oFixedSizeDialog.open();
		},
		onOpenDialog: function (oEvent) {
			var oView = this.getView();
			var sPath = oEvent.getSource().getBindingContext().getPath();
			var oModel = this.getView().getModel();
			var oContext = oModel.getProperty(sPath);
			oModel.setProperty("/fragment_header", oContext.HEADER);
			oModel.setProperty("/fragment_text", oContext.TEXT);
			oModel.setProperty("/fragment_image", oContext.DATA_RAW);
			oModel.setProperty("/updated_date", oContext.UPDATED_DATE);
			oModel.setProperty("/image", 'true');
			// hide picture list item if it's empty
			if (oContext.DATA_RAW == "null") {
				oModel.setProperty("/image", 'false');
			}
			
			// pdf section
			if (oContext.DATA_RAW.substring(0, 20) == 'data:application/pdf') {
				oModel.setProperty("/image", 'false');
				// Internet Explorer 11 and Edge workaround
				if (window.navigator && window.navigator.msSaveOrOpenBlob) {

					var data = oContext.DATA_RAW.substring(28);
					var fileName = 'file.pdf';
					var byteCharacters = atob(data);

					var byteNumbers = new Array(byteCharacters.length);

					for (var i = 0; i < byteCharacters.length; i++) {
						byteNumbers[i] = byteCharacters.charCodeAt(i);
					}

					var byteArray = new Uint8Array(byteNumbers);
					var blob = new Blob([byteArray], { type: 'application/pdf' });

					window.navigator.msSaveOrOpenBlob(blob, fileName);

				} else {
					// other browsers		
					var file = "<object data='" + oContext.DATA_RAW + "' type='application/pdf' width='100%' height='700'><embed src='" + oContext.DATA_RAW + "' type='application/pdf'/></object>";
					var oHtml = this.getView().byId("attachmentFrame");
					oHtml.setContent(file);
				}
			} else {
				file = "";
				oHtml = this.getView().byId("attachmentFrame");
				oHtml.setContent(file);
			}
			

			// create dialog lazily
			if (!this.pDialog) {
				this.pDialog = Fragment.load({
					id: oView.getId(),
					name: "main.view.Dialog",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					return oDialog;
				});
			}

			this.pDialog.then(function (oDialog) {
				oDialog.open();
			});
		},
		onCloseDialog: function () {
			// note: We don't need to chain to the pDialog promise, since this event-handler
			// is only called from within the loaded dialog itself.
			this.byId("Dialog").close();
		}

	});

});