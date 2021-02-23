sap.ui.define([
	"sap/ui/core/Core",
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Label",
	"sap/m/TextArea",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/MessageBox"
], function(Core, jQuery, Controller, JSONModel, Dialog, DialogType, Label, TextArea, Button, ButtonType, MessageBox) {
	"use strict";

	var quizes = [];

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_TestsService/ZCE_Tests', false);

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

	var controller = Controller.extend("main.controller.Editor", {

		onInit: function() {
			var oModel = new JSONModel(quizes);
			this.getView().setModel(oModel);
		},

		onNavButtonPressed: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("quizmain");
		},

		onCreate: function() {

			if (!this.oSubmitDialog) {
				this.oSubmitDialog = new Dialog({
					type: DialogType.Message,
					title: "Новая анкета",
					content: [
						new Label({
							text: "Введите название анкеты",
							labelFor: "quizName"
						}),
						new TextArea("quizName", {
							width: "100%",
							placeholder: "Название анкеты",
							liveChange: function(oEvent) {
								var sText = oEvent.getParameter("value");
								this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
							}.bind(this)
						})
					],
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "Сохранить",
						enabled: false,
						press: function() {
							//var description = Core.byId("quizName").getValue();
							// add send data to back-end	

							var description = "<Description>" + Core.byId("quizName").getValue() + "</Description>";
							var xmlhttp = new XMLHttpRequest();
							xmlhttp.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_TestsService/ZCE_Tests', false);

							// build SOAP request
							var sr = '<?xml version="1.0" encoding="utf-8"?>' +
								'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_tests/">' +
								'<soapenv:Header/>' +
								'<soapenv:Body>' +
								'<zce:createTest>' +
								description +
								'</zce:createTest>' +
								'</soapenv:Body>' +
								'</soapenv:Envelope>';

							xmlhttp.onreadystatechange = function() {
								if (xmlhttp.readyState == 4) {
									if (xmlhttp.status == 200) {
										//parse response and create array for quizes
										var response = xmlhttp.responseText;
										var splitResponse = response.split(/<return>|<\/return>/);
										var serverResponse = splitResponse[1];
										MessageBox.information("Анкета создана. Вы можете вернуться к списку анкет и обновить страницу", {
											title: "Системное сообщение",
											OnClose: function() {
												//oRouter.navTo("editor", {}, true);
											}
										});
									}
								}
							};

							// Send the POST request
							xmlhttp.setRequestHeader("Content-Type", "text/xml");
							xmlhttp.send(sr);

							this.oSubmitDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Отменить",
						press: function() {
							this.oSubmitDialog.close();
						}.bind(this)
					})
				});
			}

			this.oSubmitDialog.open();

		},

		handleQuizPressed: function(oEvent) {

			// get pressed value
			var quizID = oEvent.oSource.mAggregations.attributes[0].mProperties.text;
			var quizTitle = oEvent.oSource.mProperties.title;

			// clear session storate
			sessionStorage.clear();

			// store quiz number in session storage
			sessionStorage.setItem("QUIZ", quizID);
			sessionStorage.setItem("TITLE", quizTitle);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("quizEditor", {
				quizId: quizID
			});

		}

	});

	return controller;
});