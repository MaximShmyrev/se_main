sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], function(Controller, History, JSONModel) {
	"use strict";

	var questions;
	var oData;
	var index;
	var currentQuestion;

	return Controller.extend("main.controller.Quiz", {

		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("quiz").attachMatched(this._onRouteMatched, this);
		},

		onNavBack: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("learning", {}, true);
		},

		_onRouteMatched: function(oEvent) {

			oData = {};

			var testIdRouted = sessionStorage.getItem("QUIZ");
			var testId = "<testId>" + testIdRouted + "</testId>";

			//request data from backend
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_TestsService/ZCE_Tests', false);

			var testIdRouted = sessionStorage.getItem("QUIZ");
			var testId = "<testId>" + testIdRouted + "</testId>";

			// build SOAP request
			var sr = '<?xml version="1.0" encoding="utf-8"?>' +
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_tests/">' +
				'<soapenv:Header/>' +
				'<soapenv:Body>' +
				'<zce:getQuestions>' +
				testId +
				'</zce:getQuestions>' +
				'</soapenv:Body>' +
				'</soapenv:Envelope>';

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) {
						//parse response and create array for quizes
						var response = xmlhttp.responseText;
						var splitResponse = response.split(/<return>|<\/return>/);
						var arrayResponse = splitResponse[1];
						questions = JSON.parse(arrayResponse.toString());
						
						//random sort
						questions.QUESTIONS = questions.QUESTIONS.sort(function() {
							return Math.random() - 0.5;
						});

						//add state property to oData
						for (var i = 0; i < questions.QUESTIONS.length; i++) {
							for (var j = 0; j < questions.QUESTIONS[i].ANSWERS.length; j++) {
								questions.QUESTIONS[i].ANSWERS[j].state = "None";
							}
						}

						index = 0;
						currentQuestion = 1;
						oData = {
							questionText: questions.QUESTIONS[index].QUESTION_TEXT,
							questionAnswer: questions.QUESTIONS[index].ANSWERS,
							numberOfQuestions: questions.QUESTIONS.length,
							currentQuestion: currentQuestion,
							quizTitle: sessionStorage.getItem("QUIZTITLE")
						};

					}
				}
			};

			// Send the POST request
			xmlhttp.setRequestHeader("Content-Type", "text/xml");
			xmlhttp.send(sr);

			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);

			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			oView.bindElement({
				path: "/quiz(" + oArgs.quizId + ")",
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function(oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function(oEvent) {
						oView.setBusy(false);
					}
				}
			});
		},

		_onBindingChange: function(oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},

		onNextQuestion: function() {

			//clear selection
			this.getView().byId("answers").removeSelections(true);

			var view = this.getView().byId("quiz");
			var oModel = view.getModel(oModel);
			index = index + 1;
			currentQuestion = currentQuestion + 1;

			oModel.setProperty("/questionText", questions.QUESTIONS[index].QUESTION_TEXT);
			oModel.setProperty("/questionAnswer", questions.QUESTIONS[index].ANSWERS);
			oModel.setProperty("/currentQuestion", currentQuestion);

			//set selection for already answered questions
			var answers = oModel.getProperty("/questionAnswer");

			//for correct answer
			for (var i = 0; i < answers.length; i++) {
				if (answers[i].state == "Success") {
					var oList = this.getView().byId("answers");
					var oItem = oList.getItems()[i];
					oList.setSelectedItem(oItem);
				}
			}

			//for wrong answer
			for (var i = 0; i < answers.length; i++) {
				if (answers[i].state == "Error") {
					var oList = this.getView().byId("answers");
					var oItem = oList.getItems()[i];
					oList.setSelectedItem(oItem);
				}
			}

		},

		onPreviousQuestion: function() {

			//clear selection
			this.getView().byId("answers").removeSelections(true);

			var view = this.getView().byId("quiz");
			var oModel = view.getModel(oModel);

			index = index - 1;
			currentQuestion = currentQuestion - 1;

			oModel.setProperty("/questionText", questions.QUESTIONS[index].QUESTION_TEXT);
			oModel.setProperty("/questionAnswer", questions.QUESTIONS[index].ANSWERS);
			oModel.setProperty("/currentQuestion", currentQuestion);

			//set selection for already answered questions
			var answers = oModel.getProperty("/questionAnswer");

			//for correct answer
			for (var i = 0; i < answers.length; i++) {
				if (answers[i].state == "Success") {
					var oList = this.getView().byId("answers");
					var oItem = oList.getItems()[i];
					oList.setSelectedItem(oItem);
				}
			}

			//for wrong answer
			for (var i = 0; i < answers.length; i++) {
				if (answers[i].state == "Error") {
					var oList = this.getView().byId("answers");
					var oItem = oList.getItems()[i];
					oList.setSelectedItem(oItem);
				}
			}

		},

		onConfirm: function(oEvent) {

			var view = this.getView().byId("quiz");
			var oModel = view.getModel(oModel);

			//get selected item
			var oList = this.getView().byId("answers");
			var selectedItem = oList._oSelectedItem.mProperties.title;

			var answers = oModel.getProperty("/questionAnswer");

			//set green and red markers for correct and wrong answers
			for (var i = 0; i < answers.length; i++) {
				if (answers[i].ISANSWER == 0 && answers[i].ANSWER == selectedItem) {
					var answerIndex = "/questionAnswer/" + i + "/state";
					oModel.setProperty(answerIndex, "Error");
				} else if (answers[i].ISANSWER == 1) {
					var answerIndex = "/questionAnswer/" + i + "/state";
					oModel.setProperty(answerIndex, "Success");
				}
			}

		}

	});

});