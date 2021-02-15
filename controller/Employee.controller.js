sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], function(Controller, History, JSONModel) {
	"use strict";

	return Controller.extend("main.controller.Employee", {

		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("employee").attachMatched(this._onRouteMatched, this);
		},

		onNavBack: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("employees", {}, true);
		},

		_onRouteMatched: function(oEvent) {
			var employeedata = {
				"DISPLAYNAME": sessionStorage.getItem("DISPLAYNAME"),
				"PERSNUMBER": sessionStorage.getItem("PERSNUMBER"),
				"TITLE": sessionStorage.getItem("TITLE"),
				"DEPARTMENT": sessionStorage.getItem("DEPARTMENT"),
				"OFFICE": sessionStorage.getItem("OFFICE"),
				"TELEPHONENUMBER": sessionStorage.getItem("TELEPHONENUMBER"),					
				"FAX": sessionStorage.getItem("FAX"),
				"MOBILE": sessionStorage.getItem("MOBILE"),
				"EMAIL": sessionStorage.getItem("EMAIL")
			};
			
			var oModel = new JSONModel(employeedata);
			this.getView().setModel(oModel);			

			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			oView.bindElement({
				path: "/Employees(" + oArgs.employeeId + ")",
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
		}

	});

});