sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(Controller, JSONModel, MessageBox) {
	"use strict";

	var testId;
	var description;
	var oRouter;
	var questions;
	var index;
	var currentQuestion;

	return Controller.extend("main.controller.QuizEditor", {

		onInit: function() {
			oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("quizEditor").attachMatched(this._onRouteMatched, this);
		},

		onNavBack: function() {
			oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("editor", {}, true);
		},

		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		onSave: function() {

			var description = "<Description>" + this.getView().byId("description").getValue() + "</Description>";
			var testIdRouted = sessionStorage.getItem("QUIZ");
			var testId = "<testId>" + testIdRouted + "</testId>";

			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('POST', 'http://portal.samaraenergo.ru:50000/ZCE_TestsService/ZCE_Tests', false);

			// build SOAP request
			var sr = '<?xml version="1.0" encoding="utf-8"?>' +
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_tests/">' +
				'<soapenv:Header/>' +
				'<soapenv:Body>' +
				'<zce:updateTest>' +
				testId +
				description +
				'<toBeDeleted>0</toBeDeleted>' +
				'</zce:updateTest>' +
				'</soapenv:Body>' +
				'</soapenv:Envelope>';

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) {
						//parse response and create array for quizes
						var response = xmlhttp.responseText;
						var splitResponse = response.split(/<return>|<\/return>/);
						var serverResponse = splitResponse[1];
						MessageBox.information("Название анкеты обновлено. Вы можете вернуться к списку анкет и обновить страницу", {
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

		},

		onDelete: function() {

			var description = "<Description>" + this.getView().byId("description").getValue() + "</Description>";
			var testIdRouted = sessionStorage.getItem("QUIZ");
			var testId = "<testId>" + testIdRouted + "</testId>";
			
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('POST', 'http://portal.samaraenergo.ru:50000/ZCE_TestsService/ZCE_Tests', false);

			// build SOAP request
			var sr = '<?xml version="1.0" encoding="utf-8"?>' +
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_tests/">' +
				'<soapenv:Header/>' +
				'<soapenv:Body>' +
				'<zce:updateTest>' +
				testId +
				description +
				'<toBeDeleted>1</toBeDeleted>' +
				'</zce:updateTest>' +
				'</soapenv:Body>' +
				'</soapenv:Envelope>';

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) {
						//parse response and create array for quizes
						var response = xmlhttp.responseText;
						var splitResponse = response.split(/<return>|<\/return>/);
						var serverResponse = splitResponse[1];
						MessageBox.information("Анкета удалена. Вы можете вернуться к списку анкет и обновить страницу", {
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

		},

		_onRouteMatched: function(oEvent) {

			var testIdRouted = sessionStorage.getItem("QUIZ");
			var testTitleRouted = sessionStorage.getItem("TITLE");

			var testId = "<testId>" + testIdRouted + "</testId>";

			var oData = {};

			//request data from backend
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('POST', 'http://portal.samaraenergo.ru:50000/ZCE_TestsService/ZCE_Tests', false);

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

						//add state property to oData
						for (var i = 0; i < questions.QUESTIONS.length; i++) {
							for (var j = 0; j < questions.QUESTIONS[i].ANSWERS.length; j++) {
								questions.QUESTIONS[i].ANSWERS[j].state = "None";
							}
						}

						index = 0;
						currentQuestion = 1;
						oData = {
							questionId: questions.QUESTIONS[index].QUESTIONID,
							questionText: questions.QUESTIONS[index].QUESTION_TEXT,
							questionAnswer: questions.QUESTIONS[index].ANSWERS,
							numberOfQuestions: questions.QUESTIONS.length,
							currentQuestion: currentQuestion,
							quizTitle: sessionStorage.getItem("QUIZTITLE"),
							testId: testIdRouted,
							testTitle: testTitleRouted
						};

					}
				}
			};

			// Send the POST request
			xmlhttp.setRequestHeader("Content-Type", "text/xml");
			xmlhttp.send(sr);

			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);

			//set selection for already answered questions
			var answers = oModel.getProperty("/questionAnswer");

			//select correct answer
			for (var i = 0; i < answers.length; i++) {
				if (answers[i].ISANSWER === "1") {
					var oList = this.getView().byId("answers");
					var oItem = oList.getItems()[i];
					oList.setSelectedItem(oItem);
				}
			}

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

		onNextQuestion: function() {

			//clear selection
			this.getView().byId("answers").removeSelections(true);

			var view = this.getView().byId("quizEditor");
			var oModel = view.getModel(oModel);
			index = index + 1;
			currentQuestion = currentQuestion + 1;

			oModel.setProperty("/questionId", questions.QUESTIONS[index].QUESTIONID);
			oModel.setProperty("/questionText", questions.QUESTIONS[index].QUESTION_TEXT);
			oModel.setProperty("/questionAnswer", questions.QUESTIONS[index].ANSWERS);
			oModel.setProperty("/currentQuestion", currentQuestion);

			//set selection for already answered questions
			var answers = oModel.getProperty("/questionAnswer");

			//select correct answer
			for (var i = 0; i < answers.length; i++) {
				if (answers[i].ISANSWER === "1") {
					var oList = this.getView().byId("answers");
					var oItem = oList.getItems()[i];
					oList.setSelectedItem(oItem);
				}
			}

		},

		onPreviousQuestion: function() {

			//clear selection
			this.getView().byId("answers").removeSelections(true);

			var view = this.getView().byId("quizEditor");
			var oModel = view.getModel(oModel);

			index = index - 1;
			currentQuestion = currentQuestion - 1;

			oModel.setProperty("/questionId", questions.QUESTIONS[index].QUESTIONID);
			oModel.setProperty("/questionText", questions.QUESTIONS[index].QUESTION_TEXT);
			oModel.setProperty("/questionAnswer", questions.QUESTIONS[index].ANSWERS);
			oModel.setProperty("/currentQuestion", currentQuestion);

			//set selection for already answered questions
			var answers = oModel.getProperty("/questionAnswer");

			//select correct answer
			for (var i = 0; i < answers.length; i++) {
				if (answers[i].ISANSWER === "1") {
					var oList = this.getView().byId("answers");
					var oItem = oList.getItems()[i];
					oList.setSelectedItem(oItem);
				}
			}

		},

		onAddQuestion: function() {
			this.getRouter().navTo("createQuestion");
		},

		onSaveQuestion: function() {

			var view = this.getView().byId("quizEditor");
			var oModel = view.getModel(oModel);

			var questionId = oModel.getProperty("/questionId", questions.QUESTIONS[index].QUESTIONID);
			var questionText = oModel.getProperty("/questionText", questions.QUESTIONS[index].QUESTION_TEXT);
			var questionAnswer = oModel.getProperty("/questionAnswer", questions.QUESTIONS[index].ANSWERS);

			questionId = "<questionId>" + questionId + "</questionId>";
			questionText = "<questionText>" + questionText + "</questionText>";

			//get selected item
			var oList = this.getView().byId("answers");
			var selectedItem = oList._oSelectedItem.mProperties.title;

			for (var i = 0; i < questionAnswer.length; i++) {
				if (questionAnswer[i].ANSWER == selectedItem) {
					questionAnswer[i].ISANSWER = "1";
				} else {
					questionAnswer[i].ISANSWER = "0";
				}
			}

			//create asnwers array
			var answersArray = '{"ANSWERS": [';

			for (var i = 0; i < questionAnswer.length; i++) {
				if (i > 0) {
					answersArray = answersArray + ',';
				}
				answersArray = answersArray + '{"ANSWERID":"' + questionAnswer[i].ANSWERID + '",' + '"ANSWER":"' + questionAnswer[i].ANSWER + '",' +
					'"ISANSWER":"' + questionAnswer[i].ISANSWER + '",' + '"TOBEDELETED":"0"}';
			}

			answersArray = answersArray + ']}';

			answersArray = "<answersArray>" + answersArray + "</answersArray>";

			//request data from backend
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('POST', 'http://portal.samaraenergo.ru:50000/ZCE_TestsService/ZCE_Tests', false);

			// build SOAP request
			var sr = '<?xml version="1.0" encoding="utf-8"?>' +
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_tests/">' +
				'<soapenv:Header/>' +
				'<soapenv:Body>' +
				'<zce:updateQuestion>' +
				questionId +
				'<questionType>1</questionType>' +
				questionId +
				questionText +
				answersArray +
				'<toBeDeleted>0</toBeDeleted>' +
				'</zce:updateQuestion>' +
				'</soapenv:Body>' +
				'</soapenv:Envelope>';

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) {
						//parse response and create array for quizes
						var response = xmlhttp.responseText;
						var splitResponse = response.split(/<return>|<\/return>/);
						var arrayResponse = splitResponse[1];
						MessageBox.information("Изменения в вопросе сохранены. Вы можете вернуться к списку анкет и обновить страницу", {
							title: "Системное сообщение",
							OnClose: function() {

							}
						});

					}
				}
			};

			// Send the POST request
			xmlhttp.setRequestHeader("Content-Type", "text/xml");
			xmlhttp.send(sr);

		},

		onDeleteQuestion: function() {

			var view = this.getView().byId("quizEditor");
			var oModel = view.getModel(oModel);

			var questionId = oModel.getProperty("/questionId", questions.QUESTIONS[index].QUESTIONID);
			var questionText = oModel.getProperty("/questionText", questions.QUESTIONS[index].QUESTION_TEXT);
			var questionAnswer = oModel.getProperty("/questionAnswer", questions.QUESTIONS[index].ANSWERS);

			questionId = "<questionId>" + questionId + "</questionId>";
			questionText = "<questionText>" + questionText + "</questionText>";

			//create asnwers array
			var answersArray = '{"ANSWERS": [';

			for (var i = 0; i < questionAnswer.length; i++) {
				if (i > 0) {
					answersArray = answersArray + ',';
				}
				answersArray = answersArray + '{"ANSWERID":"' + questionAnswer[i].ANSWERID + '",' + '"ANSWER":"' + questionAnswer[i].ANSWER + '",' +
					'"ISANSWER":"' + questionAnswer[i].ISANSWER + '",' + '"TOBEDELETED":"0"}';
			}

			answersArray = answersArray + ']}';
			answersArray = "</answersArray>" + answersArray + "</answersArray>";

			//request data from backend
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('POST', 'http://portal.samaraenergo.ru:50000/ZCE_TestsService/ZCE_Tests', false);

			// build SOAP request
			var sr = '<?xml version="1.0" encoding="utf-8"?>' +
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_tests/">' +
				'<soapenv:Header/>' +
				'<soapenv:Body>' +
				'<zce:updateQuestion>' +
				'<questionType>1</questionType>' +
				questionId +
				questionText +
				answersArray +
				'<toBeDeleted>1</toBeDeleted>' +
				'</zce:updateQuestion>' +
				'</soapenv:Body>' +
				'</soapenv:Envelope>';

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) {
						//parse response and create array for quizes
						var response = xmlhttp.responseText;
						var splitResponse = response.split(/<return>|<\/return>/);
						var arrayResponse = splitResponse[1];
						MessageBox.information("Вопрос удалён из анкеты. Вы можете вернуться к списку анкет и обновить страницу", {
							title: "Системное сообщение",
							OnClose: function() {

							}
						});

					}
				}
			};

			// Send the POST request
			xmlhttp.setRequestHeader("Content-Type", "text/xml");
			xmlhttp.send(sr);

		},

		_onBindingChange: function(oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		}

	});

});