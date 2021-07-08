sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(jQuery, Controller, JSONModel) {
	"use strict";

	var quizes = [];

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST', 'http://portal.samaraenergo.ru:50000/ZCE_TestsService/ZCE_Tests', false);

	// build SOAP request
	var sr = '<?xml version="1.0" encoding="utf-8"?>' +
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_tests/">' +
		'<soapenv:Header/>' +
		'<soapenv:Body>' +
		'<zce:getTests/>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>';

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				//parse response and create array for quizes
				var response = xmlhttp.responseText;
				var splitResponse = response.split(/<return>|<\/return>/);
				var quizesText_temp2 = splitResponse[1];
				var quizesText_temp1 = quizesText_temp2.split("[");
				var quizesText_temp0 = quizesText_temp1[1];
				var quizesText_temp3 = quizesText_temp0.split("]");
				var quizesText_temp4 = quizesText_temp3[0];
				var quizesText = quizesText_temp4.split(/{|}/);

				var i = 0;
				quizesText.forEach(function(item) {
					if (item.slice(1, 7) === 'TESTID') {
						var itemArray = item.split(",");

						var quizesArray = {
							"quizId": itemArray[0].split(":")[1].slice(1, -1),
							"quizDescription": itemArray[1].split(":")[1].slice(1, -1)
						};

						quizes[i] = quizesArray;
						i = i + 1;
					}

				});

			}
		}
	};

	// Send the POST request
	xmlhttp.setRequestHeader("Content-Type", "text/xml");
	xmlhttp.send(sr);

	var controller = Controller.extend("main.controller.Learning", {

		onInit: function() {
			var oModel = new JSONModel(quizes);
			this.getView().setModel(oModel);
		},

		onNavButtonPressed: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("quizmain");
		},

		handleQuizPressed: function(oEvent) {

			// get pressed value
			var quizID = oEvent.oSource.mAggregations.attributes[0].mProperties.text;
			var quizTitle = oEvent.oSource.mProperties.title;

			// clear session storate
			sessionStorage.clear();
			
			// store quiz number in session storage
			sessionStorage.setItem("QUIZ", quizID);
			sessionStorage.setItem("QUIZTITLE", quizTitle);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("quiz", {
				quizId: quizID
			});

		}

	});

	return controller;
});