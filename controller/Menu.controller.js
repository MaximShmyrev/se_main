sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	/*	//Monday
		var dayToday = new Date(); // get current date
		var dayMondayNumber = dayToday.getDate() - dayToday.getDay() + 1; // First day is the day of the month - the day of the week
		var dayMonday = new Date(dayToday.setDate(dayMondayNumber));
		var dayMondayDate = dayMonday.getDay() + dayMonday.getMonth() + dayMonday.getYear();*/

	//get current date
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	//Monday
	var curr = new Date(); // get current date
	var mondayNumber = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
	var Monday = new Date(curr.setDate(mondayNumber));

	dd = String(Monday.getDate()).padStart(2, '0');
	mm = String(Monday.getMonth() + 1).padStart(2, '0');
	yyyy = Monday.getFullYear();

	var formattedMonday = yyyy + mm + dd;

	//Tuesday
	curr = new Date(); // get current date
	var tuesdayNumber = curr.getDate() - curr.getDay() + 2; // First day is the day of the month - the day of the week
	var Tuesday = new Date(curr.setDate(tuesdayNumber));

	dd = String(Tuesday.getDate()).padStart(2, '0');
	mm = String(Tuesday.getMonth() + 1).padStart(2, '0');
	yyyy = Tuesday.getFullYear();

	var formattedTuesday = yyyy + mm + dd;

	//Wednesday
	curr = new Date(); // get current date
	var wednesdayNumber = curr.getDate() - curr.getDay() + 3; // First day is the day of the month - the day of the week
	var Wednesday = new Date(curr.setDate(wednesdayNumber));

	dd = String(Wednesday.getDate()).padStart(2, '0');
	mm = String(Wednesday.getMonth() + 1).padStart(2, '0');

	var formattedWednesday = yyyy + mm + dd;

	//Thursday
	curr = new Date(); // get current date
	var thursdayNumber = curr.getDate() - curr.getDay() + 4; // First day is the day of the month - the day of the week
	var Thursday = new Date(curr.setDate(thursdayNumber));

	dd = String(Thursday.getDate()).padStart(2, "0");
	mm = String(Thursday.getMonth() + 1).padStart(2, "0");

	var formattedThursday = yyyy + mm + dd;

	//Friday
	curr = new Date(); // get current date
	var fridayNumber = curr.getDate() - curr.getDay() + 5; // First day is the day of the month - the day of the week
	var Friday = new Date(curr.setDate(fridayNumber));

	dd = String(Friday.getDate()).padStart(2, "0");
	mm = String(Friday.getMonth() + 1).padStart(2, "0");

	var formattedFriday = yyyy + mm + dd;

	//global variables
	var category;
	var mondayCold;
	var mondayFirst;
	var mondaySecond;
	var mondayGarnish;
	var tuesdayCold;
	var tuesdayFirst;
	var tuesdaySecond;
	var tuesdayGarnish;
	var wednesdayCold;
	var wednesdayFirst;
	var wednesdaySecond;
	var wednesdayGarnish;
	var thursdayCold;
	var thursdayFirst;
	var thursdaySecond;
	var thursdayGarnish;
	var fridayCold;
	var fridayFirst;
	var fridaySecond;
	var fridayGarnish;

	//create arrays for products
	var coldMonday = [];
	var firstMonday = [];
	var secondMonday = [];
	var garnishMonday = [];

	var coldTuesday = [];
	var firstTuesday = [];
	var secondTuesday = [];
	var garnishTuesday = [];

	var coldWednesday = [];
	var firstWednesday = [];
	var secondWednesday = [];
	var garnishWednesday = [];

	var coldThursday = [];
	var firstThursday = [];
	var secondThursday = [];
	var garnishThursday = [];

	var coldFriday = [];
	var firstFriday = [];
	var secondFriday = [];
	var garnishFriday = [];

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_MenuService/ZCE_Menu', false);

	// build SOAP request
	var sr = '<?xml version="1.0" encoding="utf-8"?>' +
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_menu/">' +
		'<soapenv:Header/>' +
		'<soapenv:Body>' +
		'<zce:getMenu>' +
		'<week>04</week>' +
		'<year>2021</year>' +
		'</zce:getMenu>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>';

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				//console.log(xmlhttp.responseText);
				var response = xmlhttp.responseText;

				var splitResponse = response.split(/<return>|<\/return>/);
				var arrayResponse = splitResponse[1];
				var jsonObj = JSON.parse(arrayResponse.toString());

				var i;

				jsonObj.MenuSet.forEach(function(entry) {

					switch (entry.date) {
						case formattedMonday: // fulfill data for Monday

							entry.LineItems.forEach(function(item) {
								if (item.FOODPRICE === "null") { //set category for products
									category = item.FOODITEM;
									i = 0;
								}

								switch (category) {
									case "Холодные закуски":
										if (item.FOODOUT !== "null") {
											coldMonday[i] = item;
											i = i + 1;
										}
										break;

									case "Первые блюда":
										if (item.FOODOUT !== "null") {
											firstMonday[i] = item;
											i = i + 1;
										}
										break;

									case "Вторые блюда":
										if (item.FOODOUT !== "null") {
											secondMonday[i] = item;
											i = i + 1;
										}
										break;

									case "Гарниры":
										if (item.FOODOUT !== "null") {
											garnishMonday[i] = item;
											i = i + 1;
										}
										break;
								}

							});

							mondayCold = coldMonday;
							mondayFirst = firstMonday;
							mondaySecond = secondMonday;
							mondayGarnish = garnishMonday;
							break;

						case formattedTuesday: //fulfill data for Tuesday

							entry.LineItems.forEach(function(item) {
								if (item.FOODPRICE === "null") { //set category for products
									category = item.FOODITEM;
									i = 0;
								}

								switch (category) {
									case "Холодные закуски":
										if (item.FOODOUT !== "null") {
											coldTuesday[i] = item;
											i = i + 1;
										}
										break;

									case "Первые блюда":
										if (item.FOODOUT !== "null") {
											firstTuesday[i] = item;
											i = i + 1;
										}
										break;

									case "Вторые блюда":
										if (item.FOODOUT !== "null") {
											secondTuesday[i] = item;
											i = i + 1;
										}
										break;

									case "Гарниры":
										if (item.FOODOUT !== "null") {
											garnishTuesday[i] = item;
											i = i + 1;
										}
										break;
								}

							});

							tuesdayCold = coldTuesday;
							tuesdayFirst = firstTuesday;
							tuesdaySecond = secondTuesday;
							tuesdayGarnish = garnishTuesday;
							break;

						case formattedWednesday:

							entry.LineItems.forEach(function(item) {
								if (item.FOODPRICE === "null") { //set category for products
									category = item.FOODITEM;
									i = 0;
								}

								switch (category) {
									case "Холодные закуски":
										if (item.FOODOUT !== "null") {
											coldWednesday[i] = item;
											i = i + 1;
										}
										break;

									case "Первые блюда":
										if (item.FOODOUT !== "null") {
											firstWednesday[i] = item;
											i = i + 1;
										}
										break;

									case "Вторые блюда":
										if (item.FOODOUT !== "null") {
											secondWednesday[i] = item;
											i = i + 1;
										}
										break;

									case "Гарниры":
										if (item.FOODOUT !== "null") {
											garnishWednesday[i] = item;
											i = i + 1;
										}
										break;
								}

							});

							wednesdayCold = coldWednesday;
							wednesdayFirst = firstWednesday;
							wednesdaySecond = secondWednesday;
							wednesdayGarnish = garnishWednesday;
							break;

						case formattedThursday:

							entry.LineItems.forEach(function(item) {
								if (item.FOODPRICE === "null") { //set category for products
									category = item.FOODITEM;
									i = 0;
								}

								switch (category) {
									case "Холодные закуски":
										if (item.FOODOUT !== "null") {
											coldThursday[i] = item;
											i = i + 1;
										}
										break;

									case "Первые блюда":
										if (item.FOODOUT !== "null") {
											firstThursday[i] = item;
											i = i + 1;
										}
										break;

									case "Вторые блюда":
										if (item.FOODOUT !== "null") {
											secondThursday[i] = item;
											i = i + 1;
										}
										break;

									case "Гарниры":
										if (item.FOODOUT !== "null") {
											garnishThursday[i] = item;
											i = i + 1;
										}
										break;
								}

							});

							thursdayCold = coldThursday;
							thursdayFirst = firstThursday;
							thursdaySecond = secondThursday;
							thursdayGarnish = garnishThursday;
							break;

						case formattedFriday:

							entry.LineItems.forEach(function(item) {
								if (item.FOODPRICE === "null") { //set category for products
									category = item.FOODITEM;
									i = 0;
								}

								switch (category) {
									case "Холодные закуски":
										if (item.FOODOUT !== "null") {
											coldFriday[i] = item;
											i = i + 1;
										}
										break;

									case "Первые блюда":
										if (item.FOODOUT !== "null") {
											firstFriday[i] = item;
											i = i + 1;
										}
										break;

									case "Вторые блюда":
										if (item.FOODOUT !== "null") {
											secondFriday[i] = item;
											i = i + 1;
										}
										break;

									case "Гарниры":
										if (item.FOODOUT !== "null") {
											garnishFriday[i] = item;
											i = i + 1;
										}
										break;
								}

							});

							fridayCold = coldFriday;
							fridayFirst = firstFriday;
							fridaySecond = secondFriday;
							fridayGarnish = garnishFriday;
							break;
					}

				});

			}
		}
	};

	// Send the POST request
	xmlhttp.setRequestHeader("Content-Type", "text/xml");
	xmlhttp.send(sr);

	return Controller.extend("main.controller.Menu", {

		onInit: function() {
			//get current date
			var today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = today.getFullYear();
			var formattedToday = dd + '.' + mm + '.' + yyyy;

			//Monday
			var curr = new Date(); // get current date
			var mondayNumber = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
			var Monday = new Date(curr.setDate(mondayNumber));

			dd = String(Monday.getDate()).padStart(2, '0');
			mm = String(Monday.getMonth() + 1).padStart(2, '0');
			mm = this.monthName(mm);

			var formattedMonday = dd + ' ' + mm;

			//Tuesday
			curr = new Date(); // get current date
			var tuesdayNumber = curr.getDate() - curr.getDay() + 2; // First day is the day of the month - the day of the week
			var Tuesday = new Date(curr.setDate(tuesdayNumber));

			dd = String(Tuesday.getDate()).padStart(2, '0');
			mm = String(Tuesday.getMonth() + 1).padStart(2, '0');
			mm = this.monthName(mm);

			var formattedTuesday = dd + ' ' + mm;

			//Wednesday
			curr = new Date(); // get current date
			var wednesdayNumber = curr.getDate() - curr.getDay() + 3; // First day is the day of the month - the day of the week
			var Wednesday = new Date(curr.setDate(wednesdayNumber));

			dd = String(Wednesday.getDate()).padStart(2, '0');
			mm = String(Wednesday.getMonth() + 1).padStart(2, '0');
			mm = this.monthName(mm);

			var formattedWednesday = dd + ' ' + mm;

			//Thursday
			curr = new Date(); // get current date
			var thursdayNumber = curr.getDate() - curr.getDay() + 4; // First day is the day of the month - the day of the week
			var Thursday = new Date(curr.setDate(thursdayNumber));

			dd = String(Thursday.getDate()).padStart(2, "0");
			mm = String(Thursday.getMonth() + 1).padStart(2, "0");
			mm = this.monthName(mm);

			var formattedThursday = dd + " " + mm;

			//Friday
			curr = new Date(); // get current date
			var fridayNumber = curr.getDate() - curr.getDay() + 5; // First day is the day of the month - the day of the week
			var Friday = new Date(curr.setDate(fridayNumber));

			dd = String(Friday.getDate()).padStart(2, "0");
			mm = String(Friday.getMonth() + 1).padStart(2, "0");
			mm = this.monthName(mm);

			var formattedFriday = dd + " " + mm;

			var products = {
				monday: {
					cold: mondayCold,
					first: mondayFirst,
					second: mondaySecond,
					garnish: mondayGarnish
				},
				tuesday: {
					cold: tuesdayCold,
					first: tuesdayFirst,
					second: tuesdaySecond,
					garnish: tuesdayGarnish
				},
				wednesday: {
					cold: wednesdayCold,
					first: wednesdayFirst,
					second: wednesdaySecond,
					garnish: wednesdayGarnish
				},
				thursday: {
					cold: thursdayCold,
					first: thursdayFirst,
					second: thursdaySecond,
					garnish: thursdayGarnish
				},
				friday: {
					cold: fridayCold,
					first: fridayFirst,
					second: fridaySecond,
					garnish: fridayGarnish
				},
/*				cold: cold,
				first: first,
				second: second,
				garnish: garnish,*/
				date: {
					date: formattedToday,
					monday: formattedMonday,
					tuesday: formattedTuesday,
					wednesday: formattedWednesday,
					thursday: formattedThursday,
					friday: formattedFriday
				}
			};

			var oModel = new JSONModel(products);
			this.getView().setModel(oModel);

		},

		onAfterRendering: function() {
			//set selected section based on day of week

			//get day of week
			var today = new Date();
			var dayOfWeekNumber = today.getDay();
			var dayOfWeek;

			switch (dayOfWeekNumber) {
				case 0:
					dayOfWeek = '__xmlview0--Monday';
					break;
				case 1:
					dayOfWeek = '__xmlview0--Monday';
					break;
				case 2:
					dayOfWeek = '__xmlview0--Tuesday';
					break;
				case 3:
					dayOfWeek = '__xmlview0--Wednesday';
					break;
				case 4:
					dayOfWeek = '__xmlview0--Thursday';
					break;
				case 5:
					dayOfWeek = '__xmlview0--Friday';
					break;
				case 6:
					dayOfWeek = '__xmlview0--Monday';
					break;
			}

			this.getView().byId("ObjectPageLayout").setSelectedSection(dayOfWeek);
			//this.getView().byId("ObjectPageLayout").getSelectedSection();

		},
		
		onPressHome: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			document.title = "Главная страница";
			oRouter.navTo("home", {}, true);
			//window.open("http://prt.samaraenergo.ru:50000/irj/go/km/docs/documents/main/index.html","_self");

		},		

		handleMainPage: function() {
			window.location.href = 'http://prt.samaraenergo.ru:50000/irj/portal/fiori';
		},

		monthName: function(mm) {
			switch (mm) {
				case '01':
					mm = "января";
					break;
				case '02':
					mm = "февраля";
					break;
				case '03':
					mm = "марта";
					break;
				case '04':
					mm = "апреля";
					break;
				case '05':
					mm = "мая";
					break;
				case '06':
					mm = "июня";
					break;
				case '07':
					mm = "июля";
					break;
				case '08':
					mm = "августа";
					break;
				case '09':
					mm = "сентября";
					break;
				case '10':
					mm = "октября";
					break;
				case '11':
					mm = "ноября";
					break;
				case '12':
					mm = "декабря";
					break;
			}
			return mm;
		}

	});
});