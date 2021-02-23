sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function(Controller, MessageBox, JSONModel) {
	"use strict";

	var questions;
	var oData;
	var index;
	var currentQuestion;

	return Controller.extend("main.controller.Test", {

		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("test").attachMatched(this._onRouteMatched, this);
		},

		onAfterRendering: function() {
			var test = "test";
		},

		onNavBack: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("examen", {}, true);
		},

		_onRouteMatched: function(oEvent) {

			oData = {};

			var testIdRouted = sessionStorage.getItem("TEST");
			var testId = "<testId>" + testIdRouted + "</testId>";

			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_TestsService/ZCE_Tests', false);

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

						//add 'proposal' property to oData for storing answers of student
						for (var i = 0; i < questions.QUESTIONS.length; i++) {
							for (var j = 0; j < questions.QUESTIONS[i].ANSWERS.length; j++) {
								questions.QUESTIONS[i].ANSWERS[j].proposal = 0;
							}
						}

						index = 0;
						currentQuestion = 1;
						oData = {
							questionText: questions.QUESTIONS[index].QUESTION_TEXT,
							questionAnswer: questions.QUESTIONS[index].ANSWERS,
							numberOfQuestions: questions.QUESTIONS.length,
							currentQuestion: currentQuestion,
							quizTitle: sessionStorage.getItem("QUIZTITLE"),
							confirmAllowed: "false" //used for 'finish test button' visible property
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

			//get current answer and store it to 'proposal' property
			var view = this.getView().byId("quiz");
			var oModel = view.getModel(oModel);

			//get selected item
			var oList = this.getView().byId("answers");
			var selectedItem = oList._oSelectedItem.mProperties.title;

			var answers = oModel.getProperty("/questionAnswer");

			for (var i = 0; i < answers.length; i++) {
				if (answers[i].ANSWER == selectedItem) {
					var answerIndex = "/questionAnswer/" + i + "/proposal";
					oModel.setProperty(answerIndex, 1);
				}
			}

			//clear selection
			this.getView().byId("answers").removeSelections(true);

			index = index + 1;
			currentQuestion = currentQuestion + 1;

			oModel.setProperty("/questionText", questions.QUESTIONS[index].QUESTION_TEXT);
			oModel.setProperty("/questionAnswer", questions.QUESTIONS[index].ANSWERS);
			oModel.setProperty("/currentQuestion", currentQuestion);

			if (currentQuestion === questions.QUESTIONS.length) {
				oModel.setProperty("/confirmAllowed", 1);
			}

		},

		onPreviousQuestion: function() {

			//clear selection
			//this.getView().byId("answers").removeSelections(true);

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
				if (answers[i].proposal == "1") {
					var oList = this.getView().byId("answers");
					var oItem = oList.getItems()[i];
					oList.setSelectedItem(oItem);
				}
			}

		},

		onConfirm: function(oEvent) {

			//get current answer and store it to 'proposal' property
			var view = this.getView().byId("quiz");
			var oModel = view.getModel(oModel);

			//get selected item
			var oList = this.getView().byId("answers");
			var selectedItem = oList._oSelectedItem.mProperties.title;

			var answers = oModel.getProperty("/questionAnswer");

			for (var i = 0; i < answers.length; i++) {
				if (answers[i].ANSWER == selectedItem) {
					var answerIndex = "/questionAnswer/" + i + "/proposal";
					oModel.setProperty(answerIndex, 1);
				}
			}

			var correctAnswers = 0;

			//calculate percentage of correct answers
			for (var i = 0; i < questions.QUESTIONS.length; i++) {
				for (var j = 0; j < questions.QUESTIONS[i].ANSWERS.length; j++) {
					if (questions.QUESTIONS[i].ANSWERS[j].ISANSWER == "1" && questions.QUESTIONS[i].ANSWERS[j].proposal == "1") {
						correctAnswers = correctAnswers + 1;
					}
				}
			}
			var result = correctAnswers / questions.QUESTIONS.length * 100;
			result = Math.round(result);

			//send data to backend
			var testIdRouted = sessionStorage.getItem("TEST");
			var testId = "<testId>" + testIdRouted + "</testId>";
			var sessionId = "<sessionId>" + Math.random().toString(36).substr(2, 9) + "</sessionId>";
			var user = sessionStorage.getItem("USERID");
			var userId = "<userId>" + user + "</userId>";

			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_TestsService/ZCE_Tests', false);

			answers = '{"ANSWERS":[';

			for (var i = 0; i < questions.QUESTIONS.length; i++) {

				if (i > 0) {
					answers = answers + ',';
				}

				answers = answers + '{"QUESTIONID":"' + questions.QUESTIONS[i].QUESTIONID + '", "ANSWERID":"';

				for (var j = 0; j < questions.QUESTIONS[i].ANSWERS.length; j++) {
					if (questions.QUESTIONS[i].ANSWERS[j].proposal == "1") {
						answers = answers + questions.QUESTIONS[i].ANSWERS[j].ANSWERID + '", "ISANSWER":"' + questions.QUESTIONS[i].ANSWERS[j].ISANSWER +
							'"}';
					}
				}
			}

			answers = answers + ']}';
			answers = "<answers>" + answers + "</answers>";

			/*         <answers>{"ANSWERS":[{"QUESTIONID":"672413373", "ANSWERID":"672413366","ISANSWER":"1"}, {"QUESTIONID":"677745911","ANSWERID":"677745909","ISANSWER":"0"}]}</answers>
			         <!--Optional:-->
			         <dateTime>?</dateTime>*/

			// build SOAP request
			var sr = '<?xml version="1.0" encoding="utf-8"?>' +
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_tests/">' +
				'<soapenv:Header/>' +
				'<soapenv:Body>' +
				'<zce:writeResults>' +
				sessionId +
				userId +
				testId +
				answers +
				'</zce:writeResults>' +
				'</soapenv:Body>' +
				'</soapenv:Envelope>';

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) {
						//parse response and create array for quizes
						var response = xmlhttp.responseText;
						var splitResponse = response.split(/<return>|<\/return>/);
						var arrayResponse = splitResponse[1];

					}
				}
			};

			// Send the POST request
			xmlhttp.setRequestHeader("Content-Type", "text/xml");
			xmlhttp.send(sr);

			var message = "Ваш результат: " + result + "%. " + "Количество правильных ответов: " + correctAnswers;
			MessageBox.information(message, {
				title: "Результаты экзамена",
				onClose: function() {
						var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
						oRouter.navTo('examen');
				}.bind(this)
			});
		}

	});

});