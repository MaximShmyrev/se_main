sap.ui.define(["sap/ui/core/mvc/Controller", "sap/fe/core/CommonUtils"], function(Controller, CommonUtils) {
	"use strict";

	return Controller.extend("sap.fe.core.FEController", {
		onInit: function() {
			var oUIModel = this.getAppComponent().getModel("ui"),
				oInternalModel = this.getAppComponent().getModel("internal"),
				sPath = "/pages/" + this.getView().getId();

			oUIModel.setProperty(sPath, {
				controls: {}
			});
			oInternalModel.setProperty(sPath, {
				controls: {}
			});
			this.getView().bindElement({
				path: sPath,
				model: "ui"
			});
			this.getView().bindElement({
				path: sPath,
				model: "internal"
			});

			// for the time being provide it also pageInternal as some macros access it - to be removed
			this.getView().bindElement({
				path: sPath,
				model: "pageInternal"
			});
			this.getView().setModel(oInternalModel, "pageInternal");

			// as the model propagation happens after init but we actually want to access the binding context in the
			// init phase already setting the model here
			this.getView().setModel(oUIModel, "ui");
			this.getView().setModel(oInternalModel, "internal");
		},
		/**
		 * Returns the current app component.
		 *
		 * @returns {sap.fe.core.AppComponent} the app component or null if not found
		 */
		getAppComponent: function() {
			if (!this._oAppComponent) {
				this._oAppComponent = CommonUtils.getAppComponent(this.getView());
			}
			return this._oAppComponent;
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function(sI18nModelName) {
			if (!sI18nModelName) {
				sI18nModelName = "i18n";
			}
			return this.getAppComponent()
				.getModel(sI18nModelName)
				.getResourceBundle();
		}
	});
});
