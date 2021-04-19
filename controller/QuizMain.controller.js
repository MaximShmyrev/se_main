sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Core",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/NumberFormat",
	"sap/m/MessageToast",
	"sap/m/library",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/TextArea",
	"sap/m/Button",
	"sap/m/ButtonType"	
], function (jQuery, Controller, Core, JSONModel, NumberFormat, MessageToast, MobileLibrary, Dialog, DialogType, TextArea, Button, ButtonType) {
	"use strict";

	return Controller.extend("main.controller.QuizMain", {
		onInit: function () {

			var oData = {
				"Admin": sessionStorage.getItem("ADMIN")
			}

			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);

		},

		onPressHome: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			document.title = "Главная страница";
			oRouter.navTo("home", {}, true);
		},

		onNavToUpload: function () {
			this.getRouter().navTo("upload");
		},

		onNavToEditor: function () {
			this.getRouter().navTo("editor");
		},

		onNavToLearning: function () {
			this.getRouter().navTo("learning");
		},

		onNavToExamen: function () {
			this.getRouter().navTo("examen");
		},

		onNavToAnalytics: function () {
			this.getRouter().navTo("analytics");
		},

		onNavToFeedback: function () {
			if (!this.oSubmitDialog) {
				this.oSubmitDialog = new Dialog({
					type: DialogType.Message,
					title: "Форма обратной связи",
					content: [
						new TextArea("submissionNote", {
							width: "100%",
							placeholder: "Обязательно для заполнения",
							liveChange: function (oEvent) {
								var sText = oEvent.getParameter("value");
								this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
							}.bind(this)
						})
					],
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "Отправить",
						enabled: false,
						press: function () {
							var sText = Core.byId("submissionNote").getValue();
							MessageToast.show("Ваше предложение отправлено");
							this.oSubmitDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Отменить",
						press: function () {
							this.oSubmitDialog.close();
						}.bind(this)
					})
				});
			}

			this.oSubmitDialog.open();
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