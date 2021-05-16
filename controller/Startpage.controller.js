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
	var indConsNumber;
	var legalConsNumber;
	var uzedoDocNumber;	

	return Controller.extend("main.controller.Startpage", {
		onInit: function () {

			// get user roles
			var roleshttp = new XMLHttpRequest();
			roleshttp.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_UMEService/ZCE_UME', false);

			var user = sessionStorage.getItem("USERNAME");
			if (user == null) {
				user = 'SHMYREV';
			}
			var userId = '<userId>' + user + '</userId>';

			var rolesRequest = '<?xml version="1.0" encoding="utf-8"?>' +
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_ume/">' +
				'<soapenv:Header/>' +
				'<soapenv:Body>' +
				'<zce:getRoles>' +
				userId +
				'</zce:getRoles>' +
				'</soapenv:Body>' +
				'</soapenv:Envelope>';

			roleshttp.onreadystatechange = function () {
				if (roleshttp.readyState == 4) {
					if (roleshttp.status == 200) {
						var rolesResponse = roleshttp.responseText;
						var rolesSplit = rolesResponse.split(/<return>|<\/return>/);
						var rolesArray = rolesSplit[1];
						if (rolesArray.includes("fiori_admin") === true) {
							sessionStorage.setItem("ADMIN", "admin");
						} else {
							sessionStorage.setItem("ADMIN", "user");
						}
					}
				}
			};

			roleshttp.setRequestHeader("Content-Type", "text/xml");
			roleshttp.send(rolesRequest);


			// get news
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_NewsService/ZCE_News', false);

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
						jsonObj.splice(5);
					}
				}
			};

			xmlhttp.setRequestHeader("Content-Type", "text/xml");
			xmlhttp.send(sr);


			// get articles from knowledge library
			var kbHTTP = new XMLHttpRequest();
			kbHTTP.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_NewsService/ZCE_News', false);

			var kbRequest = '<?xml version="1.0" encoding="utf-8"?>' +
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_news/">' +
				'<soapenv:Header/>' +
				'<soapenv:Body>' +
				'<zce:getNews/>' +
				'</soapenv:Body>' +
				'</soapenv:Envelope>';

			// kbHTTP.onreadystatechange = function () {
			// 	if (kbHTTP.readyState == 4) {
			// 		if (kbHTTP.status == 200) {

			// 			var response = kbHTTP.responseText;
			// 			var splitResponse = response.split(/<return>|<\/return>/);
			// 			var arrayResponse = splitResponse[1];
			// 			jsonObj = JSON.parse(arrayResponse.toString());

			// 		}
			// 	}
			// };

			//kbHTTP.setRequestHeader("Content-Type", "text/xml");
			//kbHTTP.send(kbRequest);


			// get data from IAS
			var iasHTTP = new XMLHttpRequest();

			//iasHTTP.open('GET', 'http://cibdv.samaraenergo.ru:8006/sap/opu/odata/sap/ZGP_IAS_INTEGRATION_SRV/IASINTEGRSet?$format=json', false);
			iasHTTP.open('GET', 'http://192.168.203.19:8006/sap/opu/odata/sap/ZGP_IAS_INTEGRATION_SRV/IASINTEGRSet?$format=json', false);

			iasHTTP.onreadystatechange = function () {
				if (iasHTTP.readyState == 4) {
					if (iasHTTP.status == 200) {
						var iasResponse = iasHTTP.responseText;
						var iasObj = JSON.parse(iasResponse.toString());

						var indConsNumberText = iasObj.d.results[0].indconsumernumber
						var legalConsNumberText = iasObj.d.results[0].legalconsumernumber;
						var uzedoDocNumberText = iasObj.d.results[0].uzedovaluabledocnumber;

						indConsNumber = parseInt(indConsNumberText, 10);
						legalConsNumber = parseInt(legalConsNumberText, 10);
						uzedoDocNumber = parseInt(uzedoDocNumberText, 10);

					}
				}
			}

			iasHTTP.send();

			// get data from AccuWeather API
			var weatherHTTP = new XMLHttpRequest();
			weatherHTTP.open('GET', 'http://dataservice.accuweather.com/currentconditions/v1/290396?apikey=4r47GAJnofVwdAYanGTXPQNVnBlVDTFG', false);

			weatherHTTP.onreadystatechange = function () {
				if (weatherHTTP.readyState == 4) {
					if (weatherHTTP.status == 200) {

						var weatherResponse = weatherHTTP.responseText;
						var weatherObj = JSON.parse(weatherResponse.toString());
						temperature = weatherObj[0].Temperature.Metric.Value;
						weatherText = weatherObj[0].WeatherText;

						//use if instead of case for type adjustment
						if (weatherText == "Mostly cloudy") {
							weatherText = "В основном облачно"
						}

						if (weatherText == "Partly cloudy") {
							weatherText = "Местами облачно"
						}

						if (weatherText == "Cloudy") {
							weatherText = "Облачно"
						}

						if (weatherText == "Clear") {
							weatherText = "Ясно"
						}						

						if (weatherText == "Some clouds") {
							weatherText = "Облачно"
						}

						if (weatherText == "Rain") {
							weatherText = "Дождь"
						}

						if (weatherText == "Clouds and sun") {
							weatherText = "Облачно и солнечно"
						}

						if (weatherText == "Partly sunny") {
							weatherText = "Местами солнечно"
						}

						if (weatherText == "Mostly sunny") {
							weatherText = "В основном солнечно"
						}

						if (weatherText == "Mostly clear") {
							weatherText = "В основном ясно"
						}

						if (weatherText == "Sunny") {
							weatherText = "Cолнечно"
						}

					}
				}
			};

			weatherHTTP.send();

			var oData = {
				"News": jsonObj,
				"Temperature": temperature,
				"weatherText": weatherText,
				"indConsNumber": indConsNumber,
				"legalConsNumber": legalConsNumber,
				"uzedoDocNumber": uzedoDocNumber
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
			
			// focus on employees tile to see search placeholder
			jQuery.sap.delayedCall(10, this, function() {
				this.getView().byId("tileEmployees").focus();
			 });
		},

		onPressEmployees: function () {
			this.getRouter().navTo("employees");
		},

		onPressNews: function () {
			this.getRouter().navTo("news");
		},

		onPressNewsAdmin: function () {
			this.getRouter().navTo("newsadmin");
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
		// onTilePressed: function (event) {
		// 	var sItemTitle, sMessage;
		// 	sItemTitle = event.getSource().getHeader() || event.getSource().getSubheader();
		// 	sMessage = sItemTitle && sItemTitle.length && sItemTitle.length > 0 ?
		// 		this.getResourceBundle().getText("startpageTileClickedMessageTemplate", [sItemTitle]) :
		// 		this.getResourceBundle().getText("startpageTileClickedMessage");
		// 	MessageToast.show(sMessage);
		// },

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
		}

		// formatJSONDate: function (date) {
		// 	var oDate = new Date(Date.parse(date));
		// 	return oDate.toLocaleDateString();
		// },

		// getEntityCount: function (entities) {
		// 	return entities && entities.length || 0;
		// },

		/**
		 * Calculated the current progress state of the process.
		 *
		 * @param {object[]} aNodes Process workflow nodes
		 * @returns {float} Progress in percent.
		 * @public
		 */
		// getProgress: function (aNodes) {
		// 	if (!aNodes || aNodes.length === 0) {
		// 		return 0;
		// 	}

		// 	var iSum = 0;
		// 	for (var i = 0; i < aNodes.length; i++) {
		// 		iSum += aNodes[i].state === "Positive";
		// 	}
		// 	var fPercent = (iSum / aNodes.length) * 100;
		// 	return fPercent.toFixed(0);
		// },

		// formatNumber: function (value) {
		// 	var oFloatFormatter = NumberFormat.getFloatInstance({
		// 		style: "short",
		// 		decimals: 1
		// 	});
		// 	return oFloatFormatter.format(value);
		// }
	});
});