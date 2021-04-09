sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/NumberFormat",
	"sap/m/MessageToast",
	"sap/m/library"
], function (jQuery, Controller, JSONModel, NumberFormat, MessageToast, MobileLibrary) {
	"use strict";

	document.title = "Главная страница";
	var temperature;
	var weatherText;
	var jsonObj;

	return Controller.extend("main.controller.Startpage", {
		onInit: function () {

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
						jsonObj = JSON.parse(arrayResponse.toString());

					}
				}
			};


			// Send the POST request
			xmlhttp.setRequestHeader("Content-Type", "text/xml");
			xmlhttp.send(sr);


			// get data from AccuWeather API
			var weatherHTTP = new XMLHttpRequest();
			weatherHTTP.open('GET', 'http://dataservice.accuweather.com/currentconditions/v1/290396?apikey=4r47GAJnofVwdAYanGTXPQNVnBlVDTFG', false);

			weatherHTTP.onreadystatechange = function () {
				if (weatherHTTP.readyState == 4) {
					if (weatherHTTP.status == 200) {
						//console.log(xmlhttp.responseText);
						var weatherResponse = weatherHTTP.responseText;
						var weatherObj = JSON.parse(weatherResponse.toString());
						temperature = weatherObj[0].Temperature.Metric.Value;
						weatherText = weatherObj[0].WeatherText;

						//use if instead of case for type adjustment
						if (weatherText == "Mostly cloudy") {
							weatherText = "В основном облачно"
						}

						if (weatherText == "Cloudy") {
							weatherText = "Облачно"
						}

						if (weatherText == "Rain") {
							weatherText = "Дождь"
						}						

					}
				}
			};

			weatherHTTP.send();

			var oData = {
				"News": jsonObj,
				"Temperature": temperature,
				"weatherText": weatherText
			}

			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);

			sessionStorage.setItem("SEARCH_QUERY", "");



		},

		onSearchPressed: function (oEvent) {
			var sQuery = oEvent.getParameter('query');
			sessionStorage.setItem("SEARCH_QUERY", sQuery);
			this.getRouter().navTo("employees");
		},

		onAfterRendering: function () {
			document.title = "Главная страница";
		},

		onPressEmployees: function () {
			this.getRouter().navTo("employees");
		},

		onPressNews: function () {
			this.getRouter().navTo("news");
		},

		onPressKB: function () {
			window.open("http://prt.samaraenergo.ru:50000/com.sap.portal.resourcerepository/repo/fioriApplications/kb/index.html", '_self');
		},

		onPressMenu: function () {
			this.getRouter().navTo("menu");
		},

		onPressQuiz: function () {
			this.getRouter().navTo("quizmain");
		},

		onPressZKH: function () {
			window.open("https://dom.gosuslugi.ru/", '_blank');
		},

		onPressASUSERP: function () {
			window.open("http://ciepr.samaraenergo.ru:8002/sap/bc/gui/sap/its/webgui", '_blank');
		},

		onPressIAS: function () {
			window.open("http://sap-srv-03:8080/BOE/BI", '_blank');
		},

		onPress3S: function () {
			window.open("http://192.168.127.9:8080/", '_blank');
		},

		onPressSabiz: function () {
			window.open("http://openicar-prod.samaraenergo.ru:8080/docflowm/sf/emb/newMainWindow", '_blank');
		},

		onPressSD: function () {
			window.open(
				"https://paism7.samaraenergo.ru:8436/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=001&sap-language=RU&sap-sec_session_created=X&sap-ushell-config=headerless#ZCREATE_INC-display&/YMIN",
				'_blank');
		},

		onPressSED: function () {
			window.open("http://eos-wsp-nlb/_layouts/15/eos/myworkspaceredirect.aspx", '_blank');
		},

		onPressSiteSE: function () {
			window.open("http://www.samaraenergo.ru/", '_blank');
		},

		onPressNWA: function () {
			window.open("http://prt.samaraenergo.ru:50000/nwa", '_blank');
		},

		onNavToProcessFlow: function () {
			this.getRouter().navTo("processFlow");
		},

		onNavToChartContainer: function () {
			this.getRouter().navTo("chartContainer");
		},

		/**
		 * Handles the press event on a tile.
		 *
		 * @param {sap.ui.base.Event} event The SAPUI5 event object
		 */
		onNavToReviews: function (event) {
			if (event.getSource().getState() === MobileLibrary.LoadState.Loaded) {
				this.getRouter().navTo("reviews");
			}
		},

		/**
		 * Handles the press event on a tile.
		 *
		 * @param {sap.ui.base.Event} event The SAPUI5 event object
		 */
		onTilePressed: function (event) {
			var sItemTitle, sMessage;
			sItemTitle = event.getSource().getHeader() || event.getSource().getSubheader();
			sMessage = sItemTitle && sItemTitle.length && sItemTitle.length > 0 ?
				this.getResourceBundle().getText("startpageTileClickedMessageTemplate", [sItemTitle]) :
				this.getResourceBundle().getText("startpageTileClickedMessage");
			MessageToast.show(sMessage);
		},

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} The ResourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		formatJSONDate: function (date) {
			var oDate = new Date(Date.parse(date));
			return oDate.toLocaleDateString();
		},

		getEntityCount: function (entities) {
			return entities && entities.length || 0;
		},

		/**
		 * Calculated the current progress state of the process.
		 *
		 * @param {object[]} aNodes Process workflow nodes
		 * @returns {float} Progress in percent.
		 * @public
		 */
		getProgress: function (aNodes) {
			if (!aNodes || aNodes.length === 0) {
				return 0;
			}

			var iSum = 0;
			for (var i = 0; i < aNodes.length; i++) {
				iSum += aNodes[i].state === "Positive";
			}
			var fPercent = (iSum / aNodes.length) * 100;
			return fPercent.toFixed(0);
		},

		formatNumber: function (value) {
			var oFloatFormatter = NumberFormat.getFloatInstance({
				style: "short",
				decimals: 1
			});
			return oFloatFormatter.format(value);
		}
	});
});