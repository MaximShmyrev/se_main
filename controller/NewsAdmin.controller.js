sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function (MessageToast, Controller, JSONModel, Log) {
	"use strict";

	var news;
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
		},

		onPressModeBtn: function (oEvent) {
			var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();

			this.getSplitAppObj().setMode(sSplitAppMode);
			MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, { duration: 5000 });
		},

		getSplitAppObj: function () {
			var result = this.byId("SplitAppDemo");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		}

	});
});