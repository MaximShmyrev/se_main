sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(Controller, JSONModel, MessageBox) {
	"use strict";
	var oRouter;

	return Controller.extend("main.controller.CreateQuestion", {

		onInit: function() {
			oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("createQuestion").attachMatched(this._onRouteMatched, this);

		},

		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		_onRouteMatched: function(oEvent) {

		},

		onNavBack: function() {
			var quizID = sessionStorage.getItem("QUIZ");

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("quizEditor", {
				quizId: quizID
			});
		},

		onSave: function() {
			var question = this.getView().byId("questionText").getValue();
			var answer1 = this.getView().byId("answer1").getValue();
			var answer2 = this.getView().byId("answer2").getValue();
			var answer3 = this.getView().byId("answer3").getValue();
			var answer4 = this.getView().byId("answer4").getValue();
			var correctAnswer = this.getView().byId("correctAnswer").getSelectedKey();

			var quizID = sessionStorage.getItem("QUIZ");
			var testId = "<testId>" + quizID + "</testId>";

			var questionText = "<questionText>" + question + "</questionText>";

			//create asnwers array
			var answersArray = '<answersArray>{"ANSWERS": [';

			if (answer1 !== "") {
				if (correctAnswer === "0") {
					answer1 = '{"ANSWER":"' + answer1 + '","ISANSWER":1}';
					answersArray = answersArray + answer1;
				} else {
					answer1 = '{"ANSWER":"' + answer1 + '","ISANSWER":0}';
					answersArray = answersArray + answer1;
				}
			}

			if (answer2 !== "") {
				if (correctAnswer === "1") {
					answer2 = '{"ANSWER":"' + answer2 + '","ISANSWER":1}';
					answersArray = answersArray + ',' + answer2;
				} else {
					answer2 = '{"ANSWER":"' + answer2 + '","ISANSWER":0}';
					answersArray = answersArray + ',' + answer2;
				}
			}

			if (answer3 !== "") {
				if (correctAnswer === "2") {
					answer3 = '{"ANSWER":"' + answer3 + '","ISANSWER":1}';
					answersArray = answersArray + ',' + answer3;
				} else {
					answer3 = '{"ANSWER":"' + answer3 + '","ISANSWER":0}';
					answersArray = answersArray + ',' + answer3;
				}
			}

			if (answer4 !== "") {
				if (correctAnswer === "3") {
					answer4 = '{"ANSWER":"' + answer4 + '","ISANSWER":1}';
					answersArray = answersArray + ',' + answer4;
				} else {
					answer4 = '{"ANSWER":"' + answer4 + '","ISANSWER":0}';
					answersArray = answersArray + ',' + answer4;
				}
			}

			answersArray = answersArray + ']}</answersArray>';

			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('POST', 'http://portal.samaraenergo.ru:50000/ZCE_TestsService/ZCE_Tests', false);

			// build SOAP request
			var sr = '<?xml version="1.0" encoding="utf-8"?>' +
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_tests/">' +
				'<soapenv:Header/>' +
				'<soapenv:Body>' +
				'<zce:createQuestion>' +
				testId +
				'<questionType>1</questionType>' +
				questionText +
				answersArray +
				'</zce:createQuestion>' +
				'</soapenv:Body>' +
				'</soapenv:Envelope>';

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) {
						//parse response and create array for quizes
						var response = xmlhttp.responseText;
						var splitResponse = response.split(/<return>|<\/return>/);
						var serverResponse = splitResponse[1];
						MessageBox.information("Вопрос добавлен. Вы можете вернуться к редактированию анкеты и обновить страницу", {
							title: "Системное сообщение",
							OnClose: function() {
								oRouter.navTo("editor", {}, true);
							}
						});
					}
				}
			};

			// Send the POST request
			xmlhttp.setRequestHeader("Content-Type", "text/xml");
			xmlhttp.send(sr);

		}

	});

});