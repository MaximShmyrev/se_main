sap.ui.define([
	'jquery.sap.global',
	'sap/m/MessageToast',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (jQuery, MessageToast, Fragment, Controller, JSONModel, Filter, FilterOperator) {
	"use strict";

	document.title = "Справочник сотрудников";

	var treedata;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_ADService/ZCE_AD', false);

	// build SOAP request
	var sr = '<?xml version="1.0" encoding="utf-8"?>' +
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_ad/">' +
		'<soapenv:Header/>' +
		'<soapenv:Body>' +
		'<zce:getADRecords/>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>';

	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				//console.log(xmlhttp.responseText);
				var response = xmlhttp.responseText;

				var splitResponse = response.split(/<return>|<\/return>/);
				var arrayResponse = splitResponse[1];
				var jsonObj = JSON.parse(arrayResponse.toString());
				treedata = {
					employees: jsonObj,
					nodes: [{
						"text": "ПАО Самараэнерго",
						"code": "0000000",
						"ref": "sap-icon://building",
						"path": "0",
						"nodes": [{
							"text": "Дирекция",
							"ref": "sap-icon://org-chart",
							"path": "0.1",
							"nodes": [{
								"text": "Бухгалтерия",
								"code": "0008100",
								"ref": "sap-icon://group",
								"path": "0.1.1",
								"nodes": [{
									"text": "Отдел налогового учета и отчетности",
									"code": "0008140",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.1.1"
								}, {
									"text": "Отдел расчетов с персоналом",
									"code": "0008130",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.1.2"
								}, {
									"text": "Отдел учета основных и прочих доходов",
									"code": "0008110",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.1.3",
									"nodes": [{
										"text": "Cектор по учету основной реализации",
										"code": "0008111",
										"ref": "sap-icon://appointment",
										"path": "0.1.1.3.1"
									}]
								}, {
									"text": "Отдел учета основных и прочих расходов",
									"code": "0008120",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.1.4",
									"nodes": [{
										"text": "Сектор по учету банковских операций",
										"code": "0008121",
										"ref": "sap-icon://appointment",
										"path": "0.1.1.4.1"
									}]
								}]
							}, {
								"text": "Коммерческий центр",
								"code": "0006100",
								"ref": "sap-icon://group",
								"path": "0.1.2",
								"nodes": [{
									"text": "Отдел коммерческого учета на ОРЭМ",
									"code": "0006110",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.2.1"
								}, {
									"text": "Сектор автоматизации коммерческого учета",
									"code": "0006101",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.2.2"
								}]
							}, {
								"text": "Общий отдел",
								"code": "0002050",
								"ref": "sap-icon://group",
								"path": "0.1.3"
							}, {
								"text": "Отдел кадров",
								"code": "0002030",
								"ref": "sap-icon://group",
								"path": "0.1.4"
							}, {
								"text": "Отдел качества и контроля",
								"code": "0006020",
								"ref": "sap-icon://group",
								"path": "0.1.5"
							}, {
								"text": "Отдел организации закупок",
								"code": "0002040",
								"ref": "sap-icon://group",
								"path": "0.1.6"
							}, {
								"text": "Отдел по связям с общественностью",
								"ref": "sap-icon://group",
								"path": "0.1.7"
							}, {
								"text": "Правовое управление",
								"code": "0007100",
								"ref": "sap-icon://group",
								"path": "0.1.8",
								"nodes": [{
									"text": "Отдел по правовому обеспечению",
									"code": "0007120",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.8.1",
									"nodes": [{
										"text": "Сектор антимонопольного комплаенса",
										"code": "0007121",
										"ref": "sap-icon://appointment",
										"path": "0.1.8.1"
									}]
								}, {
									"text": "Отдел по делам о банкротстве",
									"code": "0007103",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.8.2"
								}, {
									"text": "Сектор по обеспечению контроля за исполнением решений судов",
									"code": "0007102",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.8.3"
								}, {
									"text": "Юридический отдел",
									"code": "0007110",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.8.4"
								}]
							}, {
								"text": "Руководство",
								"code": "0000100",
								"ref": "sap-icon://group",
								"path": "0.1.9"
							}, {
								"text": "Секретариат",
								"code": "0002060",
								"ref": "sap-icon://group",
								"path": "0.1.10"
							}, {
								"text": "Сектор по ГО, ЧС и мобилизационной работе",
								"code": "0000001",
								"ref": "sap-icon://group",
								"path": "0.1.11"
							}, {
								"text": "Служба безопасности",
								"ref": "sap-icon://group",
								"path": "0.1.12"
							}, {
								"text": "Служба охраны труда и производственного контроля",
								"code": "0004030",
								"ref": "sap-icon://group",
								"path": "0.1.13"
							}, {
								"text": "Управление по безопасности",
								"code": "0005300",
								"ref": "sap-icon://group",
								"path": "0.1.14",
								"nodes": [{
									"text": "Отдел внутренней безопасности и режима",
									"code": "0005310",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.14.1"
								}, {
									"text": "Отдел экономической безопасности",
									"code": "0005320",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.14.2"
								}]
							}, {
								"text": "Управление по информационным технологиям",
								"code": "0004400",
								"ref": "sap-icon://group",
								"path": "0.1.15",
								"nodes": [{
									"text": "Отдел биллинга",
									"code": "0004410",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.15.1"
								}, {
									"text": "Отдел инфраструктуры информационных технологий",
									"code": "0004430",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.15.2"
								}, {
									"text": "Отдел корпоративных информационных систем",
									"code": "0004420",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.15.3"
								}]
							}, {
								"text": "Управление по работе с сетевыми организациями",
								"code": "0001200",
								"ref": "sap-icon://group",
								"path": "0.1.16",
								"nodes": [{
									"text": "Отдел по расчетам с сетевыми организациями и агентами",
									"code": "0001210",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.16.1"
								}]
							}, {
								"text": "Управление по технической политике",
								"code": "0004200",
								"ref": "sap-icon://group",
								"path": "0.1.17",
								"nodes": [{
									"text": "Производственно-техническая служба",
									"code": "0004210",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.17.1"
								}, {
									"text": "Служба энергосервиса и систем учета",
									"code": "0004220",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.17.2"
								}]
							}, {
								"text": "Управление сбыта электроэнергии",
								"code": "0001100",
								"ref": "sap-icon://group",
								"path": "0.1.18",
								"nodes": [{
									"text": "Договорный отдел",
									"code": "0001110",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.18.1"
								}, {
									"text": "Отдел расчетов и контроля",
									"code": "0001120",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.18.2"
								}]
							}, {
								"text": "Финансовое управление",
								"code": "0003200",
								"ref": "sap-icon://group",
								"path": "0.1.19",
								"nodes": [{
									"text": "Казначейство",
									"code": "0003220",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.19.1"
								}, {
									"text": "Финансовый отдел",
									"code": "0003210",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.19.2"
								}]
							}, {
								"text": "Хозяйственно-транспортное управление",
								"code": "0002100",
								"ref": "sap-icon://group",
								"path": "0.1.20",
								"nodes": [{
									"text": "Автотранспортная служба",
									"code": "0002110",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.20.1"
								}, {
									"text": "Сектор по организации ремонтных работ",
									"code": "0002101",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.20.2"
								}, {
									"text": "Служба эксплуатации и хозяйственного содержания зданий и сооружений",
									"code": "000212",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.20.3"
								}]
							}, {
								"text": "Центр взаимодействия с инфраструктурными организациями и участниками ОРЭМ",
								"code": "0004100",
								"ref": "sap-icon://group",
								"path": "0.1.21"
							}, {
								"text": "Экономическое управление",
								"code": "0003100",
								"ref": "sap-icon://group",
								"path": "0.1.22",
								"nodes": [{
									"text": "Отдел балансов и ценообразования на розничном рынке",
									"code": "0003130",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.20.1"
								}, {
									"text": "Отдел экономического анализа",
									"code": "0003110",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.20.2"
								}, {
									"text": "Планово-экономический отдел",
									"code": "0003120",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.1.20.3"
								}]
							}]
						}, {
							"text": "Отделения",
							"ref": "sap-icon://org-chart",
							"path": "0.2",
							"nodes": [{
								"text": "Безенчукское отделение",
								"code": "1800000",
								"ref": "sap-icon://group",
								"path": "0.2.1",
								"nodes": [{
									"text": "Центр обслуживания клиентов в поселке городского типа Безенчук",
									"code": "1800100",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.1.1"
								}]
							}, {
								"text": "Большеглушицкое отделение",
								"code": "0800000",
								"ref": "sap-icon://group",
								"path": "0.2.2",
								"nodes": [{
									"text": "Большечерниговский производственный участок",
									"code": "0800100",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.2.1"
								}, {
									"text": "Центр обслуживания клиентов в селе Большая Черниговка",
									"code": "0800200",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.2.2"
								}]
							}, {
								"text": "Борское отделение",
								"code": "0400000",
								"ref": "sap-icon://group",
								"path": "0.2.3",
								"nodes": [{
									"text": "Центр обслуживания клиентов в селе Богатое",
									"code": "0400100",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.3.1"
								}]
							}, {
								"text": "Жигулевское отделение",
								"code": "0600000",
								"ref": "sap-icon://group",
								"path": "0.2.4",
								"nodes": [{
									"text": "Центр обслуживания клиентов в городе Тольятти",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.4.1"
								}]
							}, {
								"text": "Кинельское отделение",
								"code": "1000000",
								"ref": "sap-icon://group",
								"path": "0.2.5",
								"nodes": [{
									"text": "Центр обслуживания клиентов в городе Кинель",
									"code": "1000100",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.5.1"
								}]
							}, {
								"text": "Клявлинское отделение",
								"code": "1500000",
								"ref": "sap-icon://group",
								"path": "0.2.6"
							}, {
								"text": "Кошкинское отделение",
								"code": "4200000",
								"ref": "sap-icon://group",
								"path": "0.2.7",
								"nodes": [{
									"text": "Центр обслуживания клиентов в селе Кошки",
									"code": "4200100",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.7.1"
								}]

							}, {
								"text": "Красноармейское отделение",
								"code": "1700000",
								"ref": "sap-icon://group",
								"path": "0.2.8",
								"nodes": [{
									"text": "Центр обслуживания клиентов в селе Красноармейское",
									"code": "1700200",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.8.1"
								}, {
									"text": "Центр обслуживания клиентов в селе Пестравка",
									"code": "1700100",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.8.2"
								}]

							}, {
								"text": "Красноярское отделение",
								"code": "1200000",
								"ref": "sap-icon://group",
								"path": "0.2.9",
								"nodes": [{
									"text": "Центр обслуживания клиентов в селе Красный Яр",
									"code": "1200100",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.9.1"
								}]
							}, {
								"text": "Нефтегорское отделение",
								"code": "1400000",
								"ref": "sap-icon://group",
								"path": "0.2.10"
							}, {
								"text": "Новокуйбышевское отделение",
								"code": "0300000",
								"ref": "sap-icon://group",
								"path": "0.2.11"
							}, {
								"text": "Отрадненское отделение",
								"code": "0700000",
								"ref": "sap-icon://group",
								"path": "0.2.12",
								"nodes": [{
									"text": "Исаклинский производственный участок",
									"code": "0700300",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.12.1"
								}, {
									"text": "Кротовский производственный участок",
									"code": "0700200",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.12.1"
								}, {
									"text": "Центр обслуживания клиентов в селе Кинель-Черкассы",
									"code": "0700100",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.12.2"
								}]
							}, {
								"text": "Похвистневское отделение",
								"code": "1100000",
								"ref": "sap-icon://group",
								"path": "0.2.13",
								"nodes": [{
									"text": "Центр обслуживания клиентов в селе Подбельск",
									"code": "1100100",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.13.1"
								}]
							}, {
								"text": "Приволжское отделение",
								"code": "0900000",
								"ref": "sap-icon://group",
								"path": "0.2.14",
								"nodes": [{
									"text": "Центр обслуживания клиентов в селе Хворостянка",
									"code": "0900100",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.14.1"
								}]
							}, {
								"text": "Самарское отделение",
								"code": "2000000",
								"ref": "sap-icon://group",
								"path": "0.2.15",
								"nodes": [{
									"text": "Центр обслуживания клиентов № 1 Самарского отделения",
									"code": "2000100",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.15.1"
								}, {
									"text": "Центр обслуживания клиентов № 2 Самарского отделения",
									"code": "2000200",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.15.2"
								}]
							}, {
								"text": "Сергиевское отделение",
								"code": "3700000",
								"ref": "sap-icon://group",
								"path": "0.2.16"
							}, {
								"text": "Сызранское отделение",
								"code": "0100000",
								"ref": "sap-icon://group",
								"path": "0.2.17",
								"nodes": [{
									"text": "Центр обслуживания клиентов в городе Октябрьск",
									"code": "0100100",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.17.1"
								}, {
									"text": "Центр обслуживания клиентов в городе Сызрань",
									"code": "0100200",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.17.2"
								}]

							}, {
								"text": "Тольяттинское отделение",
								"code": "0500000",
								"ref": "sap-icon://group",
								"path": "0.2.18",
								"nodes": [{
									"text": "Центр обслуживания клиентов в Центральном районе города Тольятти",
									"code": "0500200",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.18.1"
								}, {
									"text": "Центр обслуживания клиентов в городе Тольятти",
									"code": "0500100",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.18.2"
								}]
							}, {
								"text": "Чапаевское отделение",
								"code": "0200000",
								"ref": "sap-icon://group",
								"path": "0.2.19"
							}, {
								"text": "Челно-Вершинское отделение",
								"code": "1300000",
								"ref": "sap-icon://group",
								"path": "0.2.20",
								"nodes": [{
									"text": "Шенталинский производственный участок",
									"code": "1300100",
									"ref": "sap-icon://customer-order-entry",
									"path": "0.2.20.1"
								}]
							}]
						}]
					}]
				};

			}
		}
	};

	// Send the POST request
	xmlhttp.setRequestHeader("Content-Type", "text/xml");
	xmlhttp.send(sr);

	var ControllerController = Controller.extend("main.controller.Employees", {
		onInit: function () {

			// sort employees in alphabetical order
			treedata.employees.sort(function (a, b) {
				if (a.DISPLAYNAME > b.DISPLAYNAME) {
					return 1;
				}
				if (a.DISPLAYNAME < b.DISPLAYNAME) {
					return -1;
				}
			});

			// set explored app's demo model on this sample
			var oModel = new JSONModel(treedata);
			this.getView().setModel(oModel);
		},

		_onRouteMatched: function (oEvent) {

			var searchQuery = sessionStorage.getItem("SEARCH_QUERY");

			if (searchQuery != '') {
				this.handleSearchPressed();
			} else {
				this.defaultSearch();
				// default expand of 1st level
				var oTree = this.getView().byId("Tree");
				oTree.expandToLevel(1);
			}

		},

		onAfterRendering: function () {

			var searchQuery = sessionStorage.getItem("SEARCH_QUERY");

			if (searchQuery != '') {
				this.handleSearchPressed();
			} else {
				this.defaultSearch();
				// default expand of 1st level
				var oTree = this.getView().byId("Tree");
				oTree.expandToLevel(1);
			}
		},

		handleSearchItemSelect: function (oEvent) {
			MessageToast.show("Search Entry Selected: " + oEvent.getSource().getTitle());
		},

		onPressHome: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			document.title = "Главная страница";
			//oRouter.navTo("home", {}, true);
			window.open("http://prt.samaraenergo.ru:50000/com.sap.portal.resourcerepository/repo/fioriApplications/main/index.html", "_self");

		},

		handleListItemPressed: function (oEvent) {

			// clear session storate
			sessionStorage.clear();

			// get pressed value
			var itemPressed = oEvent.oSource.mProperties.title;

			// search in employees  and put to session storage
			var array = treedata.employees;
			for (var i = 0, len = array.length; i < len; i++) {
				if (array[i].DISPLAYNAME === itemPressed) {
					sessionStorage.setItem("DISPLAYNAME", array[i].DISPLAYNAME);
					sessionStorage.setItem("PERSNUMBER", array[i].PERSNUMBER);
					sessionStorage.setItem("TITLE", array[i].TITLE);
					sessionStorage.setItem("DEPARTMENT", array[i].DEPARTMENT);
					sessionStorage.setItem("OFFICE", array[i].OFFICE);
					sessionStorage.setItem("TELEPHONENUMBER", array[i].TELEPHONENUMBER);
					sessionStorage.setItem("FAX", array[i].FAX);
					sessionStorage.setItem("MOBILE", array[i].MOBILE);
					sessionStorage.setItem("EMAIL", array[i].EMAIL);
				}
			}

			var oItem, oCtx;
			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("employee", {
				employeeId: oCtx.getProperty("PERSNUMBER")
			});

		},

		handleTreeItemPressed: function (oEvent) {
			var source = oEvent.getSource();
			var sQuery = source._oSelectedItem.mProperties.title,
				//var sQuery = source.mProperties.title,

				oList = this.getView().byId("employeesList"),
				oBinding = oList.getBinding("items");
			if (sQuery) {
				var aFilter = [];
				// controller
				aFilter.push(new Filter("DEPARTMENT", FilterOperator.Contains, sQuery));
				//aFilter.push(new Filter("publ", fnTestPubl, FilterOperator.Contains, sQuery));
				// Create a filter which contains our name and 'publ' filter
				oBinding.filter(new Filter({
					filters: aFilter,
					and: false
				}));
			} else {
				// Use empty filter to show all list items
				// oBinding.filter(new Filter([])); does not work
				oBinding.filter([]);
			}

		},

		defaultSearch: function () {

			var defaultQuery = "ПАО \"Самараэнерго\"",
				oList = this.getView().byId("employeesList"),
				oBinding = oList.getBinding("items");

			var aFilter = [];
			// controller
			aFilter.push(new Filter("COMPANY", FilterOperator.Contains, defaultQuery));

			// Create a filter which contains value "default" in DC
			oBinding.filter(new Filter({
				filters: aFilter,
				and: false
			}));
		},

		handleOfficePressed: function (oEvent) {
			var source = oEvent.getSource();
			var sQuery = source.mProperties.text,
				oList = this.getView().byId("employeesList"),
				oBinding = oList.getBinding("items");

			var aFilter = [];
			// controller
			aFilter.push(new Filter("OFFICE", FilterOperator.EQ, sQuery));

			// Create a filter which contains value "default" in DC
			oBinding.filter(new Filter({
				filters: aFilter,
				and: false
			}));
		},

		handlePositionPressed: function (oEvent) {
			var source = oEvent.getSource();
			var sQuery = source.mProperties.text,
				oList = this.getView().byId("employeesList"),
				oBinding = oList.getBinding("items");

			var aFilter = [];
			// controller
			aFilter.push(new Filter("TITLE", FilterOperator.EQ, sQuery));

			// Create a filter which contains value "default" in DC
			oBinding.filter(new Filter({
				filters: aFilter,
				and: false
			}));
		},

		handleDepartmentPressed: function (oEvent) {
			var source = oEvent.getSource();
			var sQuery = source.mProperties.text,
				oList = this.getView().byId("employeesList"),
				oBinding = oList.getBinding("items");

			// get department tree path
			var oTree = this.getView().byId("Tree");
			oTree.expandToLevel(4);

			var array = oTree.getItems();
			for (var i = 0, len = array.length; i < len; i++) {
				if (array[i].mProperties.title == sQuery) {
					var path = array[i].oBindingContexts.undefined.getPath();
					//var selection = i;
				}
			}

			var pathArray = path.split('/');
			oTree.collapseAll();

			var level = pathArray.length;

			var index = parseInt(pathArray[2], 10);
			oTree.expand(index); //expand root item

			index = parseInt(pathArray[4], 10) + 1;
			oTree.expand(index); //expand second level

			if (index === 1) { // case for department 'Дирекция'
				// select object on second level
				if (level === 7) {
					array = oTree.getItems();
					for (i = 0, len = array.length; i < len; i++) {
						if (array[i].mProperties.title == sQuery) {
							index = i;
						}
					}
					oTree.setSelectedItem(array[index]);
				} else if (level === 9) {
					index = parseInt(pathArray[6], 10) + 2;
					oTree.expand(index); // third level

					//select object on third level
					array = oTree.getItems();
					for (i = 0, len = array.length; i < len; i++) {
						if (array[i].mProperties.title == sQuery) {
							index = i;
						}
					}
					oTree.setSelectedItem(array[index]);
				} else if (level === 11) {
					index = parseInt(pathArray[6], 10) + 2;
					oTree.expand(index); // third level

					index = parseInt(pathArray[8], 10) + index + 1;
					oTree.expand(index); // fourth level

					//select object on fourth level
					array = oTree.getItems();
					for (i = 0, len = array.length; i < len; i++) {
						if (array[i].mProperties.title == sQuery) {
							index = i;
						}
					}
					oTree.setSelectedItem(array[index]);
				}

			} else { // case for department 'Отделения'
				// select object on second level
				if (level === 7) {
					array = oTree.getItems();
					for (i = 0, len = array.length; i < len; i++) {
						if (array[i].mProperties.title == sQuery) {
							index = i;
						}
					}
					oTree.setSelectedItem(array[index]);
				} else if (level === 9) {
					index = parseInt(pathArray[6], 10) + 3;
					oTree.expand(index); // third level

					//select object on third level
					array = oTree.getItems();
					for (i = 0, len = array.length; i < len; i++) {
						if (array[i].mProperties.title == sQuery) {
							index = i;
						}
					}
					oTree.setSelectedItem(array[index]);
				} else {
					// commented
				}
			}

			/*			//scrool to selected item
						var ul = oTree.$().find('ul');
						var ul_id = ul.attr('id');
						ul.find('li:nth-child(' + 50 + ')').focus();
						ul.find('li:nth-child(' + 50 + ')').blur(); // remove this line if you want to -:)*/

			var aFilter = [];
			// controller
			aFilter.push(new Filter("DEPARTMENT", FilterOperator.EQ, sQuery));

			// Create a filter which contains value "default" in DC
			oBinding.filter(new Filter({
				filters: aFilter,
				and: false
			}));
		},

		departmentAutoExpand: function (dept) {

			var sQuery = dept,
				oList = this.getView().byId("employeesList"),
				oBinding = oList.getBinding("items");

			// get department tree path
			var oTree = this.getView().byId("Tree");
			oTree.expandToLevel(4);

			var array = oTree.getItems();
			for (var i = 0, len = array.length; i < len; i++) {
				if (array[i].mProperties.title == sQuery) {
					var path = array[i].oBindingContexts.undefined.getPath();
					//var selection = i;
				}
			}

			var pathArray = path.split('/');
			oTree.collapseAll();

			var level = pathArray.length;

			var index = parseInt(pathArray[2], 10);
			oTree.expand(index); //expand root item

			index = parseInt(pathArray[4], 10) + 1;
			oTree.expand(index); //expand second level

			if (index === 1) { // case for department 'Дирекция'
				// select object on second level
				if (level === 7) {
					array = oTree.getItems();
					for (i = 0, len = array.length; i < len; i++) {
						if (array[i].mProperties.title == sQuery) {
							index = i;
						}
					}
					oTree.setSelectedItem(array[index]);
				} else if (level === 9) {
					index = parseInt(pathArray[6], 10) + 2;
					oTree.expand(index); // third level

					//select object on third level
					array = oTree.getItems();
					for (i = 0, len = array.length; i < len; i++) {
						if (array[i].mProperties.title == sQuery) {
							index = i;
						}
					}
					oTree.setSelectedItem(array[index]);
				} else if (level === 11) {
					index = parseInt(pathArray[6], 10) + 2;
					oTree.expand(index); // third level

					index = parseInt(pathArray[8], 10) + index + 1;
					oTree.expand(index); // fourth level

					//select object on fourth level
					array = oTree.getItems();
					for (i = 0, len = array.length; i < len; i++) {
						if (array[i].mProperties.title == sQuery) {
							index = i;
						}
					}
					oTree.setSelectedItem(array[index]);
				}

			} else { // case for department 'Отделения'
				// select object on second level
				if (level === 7) {
					array = oTree.getItems();
					for (i = 0, len = array.length; i < len; i++) {
						if (array[i].mProperties.title == sQuery) {
							index = i;
						}
					}
					oTree.setSelectedItem(array[index]);
				} else if (level === 9) {
					index = parseInt(pathArray[6], 10) + 3;
					oTree.expand(index); // third level

					//select object on third level
					array = oTree.getItems();
					for (i = 0, len = array.length; i < len; i++) {
						if (array[i].mProperties.title == sQuery) {
							index = i;
						}
					}
					oTree.setSelectedItem(array[index]);
				} else {
					// commented
				}
			}

			/*			//scrool to selected item
						var ul = oTree.$().find('ul');
						var ul_id = ul.attr('id');
						ul.find('li:nth-child(' + 50 + ')').focus();
						ul.find('li:nth-child(' + 50 + ')').blur(); // remove this line if you want to -:)*/


		},

		handleSearchPressed: function (oEvent) {

			var searchQuery = sessionStorage.getItem("SEARCH_QUERY");

			var sQuery;
			if (searchQuery != '') {
				sQuery = searchQuery;
			} else {
				sQuery = oEvent.getParameter('query');
			}
			sessionStorage.setItem("SEARCH_QUERY", "");

			var oList = this.getView().byId("employeesList"),
				oBinding = oList.getBinding("items");
			if (sQuery) {
				var aFilter = [];
				// controller
				aFilter.push(new Filter("DISPLAYNAME", FilterOperator.Contains, sQuery));
				aFilter.push(new Filter("TITLE", FilterOperator.Contains, sQuery));
				aFilter.push(new Filter("DEPARTMENT", FilterOperator.Contains, sQuery));
				aFilter.push(new Filter("OFFICE", FilterOperator.EQ, sQuery));
				aFilter.push(new Filter("TELEPHONENUMBER", FilterOperator.EQ, sQuery));

				// Create a filter which contains our full name, position, dept, room number, phone or mobile phone filter
				oBinding.filter(new Filter({
					filters: aFilter,
					and: false
				}));
			} else {
				// Use empty filter to show all list items
				// oBinding.filter(new Filter([])); does not work
				oBinding.filter([]);
			}

			var count = oBinding.aIndices.length;

			var newList = oList.getItems()
			var dept = newList[0].mAggregations.attributes[1].mProperties.text;
			if (count === 1) {
				this.departmentAutoExpand(dept);
			}

			// based on count specify output message
			// var one = [1, 21, 31, 41, 51, 61, 71, 81, 91, 101, 121, 131, 141, 151, 161, 171, 181, 191, 201, 221, 231, 241, 251, 261, 271, 281,
			// 	291, 301, 321, 331, 341, 351, 361, 371, 381, 391, 401, 421, 431, 441, 451, 461, 471, 481, 491, 501, 521, 531, 541, 551, 561,
			// 	571,
			// 	581, 591, 601, 621, 631, 641, 651, 661, 671, 681, 691, 701, 721, 731, 741, 751, 761, 771, 781, 791, 801, 821, 831, 841, 851,
			// 	861,
			// 	871, 881, 891, 901, 921, 931, 941, 951, 961, 971, 981, 991
			// ];
			// var output = one.includes(count);

			// if (output == true) {
			// 	var msg = "Найдена " + count + " запись";
			// } else {
			// 	var two = [2, 3, 4, 22, 23, 24, 32, 33, 34, 42, 43, 44, 53, 53, 54, 62, 63, 64, 72, 73, 74, 82, 83, 84, 92, 93, 94, 102, 103,
			// 		104,
			// 		122, 123, 124, 132, 133, 134, 142, 143, 144, 153, 153, 154, 162, 163, 164, 172, 173, 174, 182, 183, 184, 192, 193, 194, 202,
			// 		203,
			// 		204, 222, 223, 224, 232, 233, 234, 242, 243, 244, 253, 253, 254, 262, 263, 264, 272, 273, 274, 282, 283, 284, 292, 293, 294,
			// 		302,
			// 		303, 304, 322, 323, 324, 332, 333, 334, 342, 343, 344, 353, 353, 354, 362, 363, 364, 372, 373, 374, 382, 383, 384, 392, 393,
			// 		394
			// 	];
			// 	output = two.includes(count);
			// 	if (output == true) {
			// 		msg = "Найдено " + count + " записи";
			// 	} else {
			// 		msg = "Найдено " + count + " записей";
			// 	}
			// }
			var msg = "Количество найденных записей " + count;
			MessageToast.show(msg);
		}

	});

	return ControllerController;

});