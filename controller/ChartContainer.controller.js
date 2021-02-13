sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller"
], function(jQuery, Controller) {
	"use strict";

	return Controller.extend("main.controller.ChartContainer", {
		onNavButtonPressed: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("home");
		}
	});
});