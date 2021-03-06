sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/NumberFormat",
	"sap/m/MessageToast",
	"sap/m/library"
], function(jQuery, Controller, JSONModel, NumberFormat, MessageToast, MobileLibrary) {
	"use strict";

	return Controller.extend("main.controller.QuizMain", {
		onInit: function() {
			
		},
		
		onPressHome: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			document.title = "Главная страница";
			oRouter.navTo("home", {}, true);
			//window.open("http://prt.samaraenergo.ru:50000/irj/go/km/docs/documents/main/index.html", "_self");

		},		

		onNavToUpload: function() {
			this.getRouter().navTo("upload");
		},

		onNavToEditor: function() {
			this.getRouter().navTo("editor");
		},

		onNavToLearning: function() {
			this.getRouter().navTo("learning");
		},

		onNavToExamen: function() {
			this.getRouter().navTo("examen");
		},
		
		onNavToAnalytics: function() {
			this.getRouter().navTo("analytics");
		},		

		/**
		 * Handles the press event on a tile.
		 *
		 * @param {sap.ui.base.Event} event The SAPUI5 event object
		 */
		onNavToReviews: function(event) {
			if (event.getSource().getState() === MobileLibrary.LoadState.Loaded) {
				this.getRouter().navTo("reviews");
			}
		},

		/**
		 * Handles the press event on a tile.
		 *
		 * @param {sap.ui.base.Event} event The SAPUI5 event object
		 */
		onTilePressed: function(event) {
			var sItemTitle, sMessage;
			sItemTitle = event.getSource().getHeader() || event.getSource().getSubheader();
			sMessage = sItemTitle && sItemTitle.length && sItemTitle.length > 0 ?
				this.getResourceBundle().getText("startpageTileClickedMessageTemplate", [sItemTitle]) :
				this.getResourceBundle().getText("startpageTileClickedMessage");
			MessageToast.show(sMessage);
		},

		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} The ResourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		formatJSONDate: function(date) {
			var oDate = new Date(Date.parse(date));
			return oDate.toLocaleDateString();
		},

		getEntityCount: function(entities) {
			return entities && entities.length || 0;
		},

		/**
		 * Calculated the current progress state of the process.
		 *
		 * @param {object[]} aNodes Process workflow nodes
		 * @returns {float} Progress in percent.
		 * @public
		 */
		getProgress: function(aNodes) {
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

		formatNumber: function(value) {
			var oFloatFormatter = NumberFormat.getFloatInstance({
				style: "short",
				decimals: 1
			});
			return oFloatFormatter.format(value);
		}
	});
});