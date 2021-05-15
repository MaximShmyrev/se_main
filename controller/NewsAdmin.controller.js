sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
], function (MessageToast, Controller, JSONModel, Fragment) {
	"use strict";

	var newsJson;

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

				var response = xmlhttp.responseText;

				var splitResponse = response.split(/<return>|<\/return>/);
				var arrayResponse = splitResponse[1];
				newsJson = JSON.parse(arrayResponse.toString());
			}
		}
	}


	// Send the POST request
	xmlhttp.setRequestHeader("Content-Type", "text/xml");
	xmlhttp.send(sr);

	return Controller.extend("main.controller.NewsAdmin", {

		onInit: function () {

			var oModel = new JSONModel(newsJson);
			this.getView().setModel(oModel);

		},

		onListItemPressed: function (oEvent) {

			// get pressed value
			var itemPressed = oEvent.oSource.mProperties.title;
			var oModel = this.getView().getModel();
			

			var selectedNew;

			for (var i = 0, len = newsJson.length; i < len; i++) {
				if (newsJson[i].HEADER == itemPressed) {
					selectedNew = i;
				}
			}
			
			oModel.setProperty("/itemHeader", itemPressed);
			oModel.setProperty("/itemDate", newsJson[selectedNew].UPDATED_DATE);
			oModel.setProperty("/itemAuthor", newsJson[selectedNew].UPDATED_BY);
			oModel.setProperty("/itemText", newsJson[selectedNew].TEXT);
			oModel.setProperty("/itemImage", newsJson[selectedNew].DATA_RAW);

		},

		onPressHome: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			document.title = "Главная страница";
			oRouter.navTo("home", {}, true);
		},

		onCreateDialog: function (oEvent) {
			var oView = this.getView();
			var oModel = this.getView().getModel();

			// create dialog lazily
			if (!this.pDialog) {
				this.pDialog = Fragment.load({
					id: oView.getId(),
					name: "main.view.CreateDialog",
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
		},		
		
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},		

		onOrientationChange: function (oEvent) {
			var bLandscapeOrientation = oEvent.getParameter("landscape"),
				sMsg = "Orientation now is: " + (bLandscapeOrientation ? "Landscape" : "Portrait");
			MessageToast.show(sMsg, { duration: 5000 });
		},

		onPressNavToDetail: function () {
			this.getSplitAppObj().to(this.createId("detailDetail"));
		},

		onPressDetailBack: function () {
			this.getSplitAppObj().backDetail();
		},

		onPressMasterBack: function () {
			this.getSplitAppObj().backMaster();
		},

		onPressGoToMaster: function () {
			this.getSplitAppObj().toMaster(this.createId("master2"));
		},

		onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		}

	});
});