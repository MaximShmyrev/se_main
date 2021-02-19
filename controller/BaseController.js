sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library",
	"sap/ui/core/routing/HashChanger"
], function (Controller, UIComponent, mobileLibrary, HashChanger) {
	"use strict";

	return Controller.extend("main.controller.BaseController", {

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
/*		getModel: function (sName) {
			return this.getView().getModel(sName);
		},*/

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
/*		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},*/

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
/*		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},*/

		buildUrl: function (sParamString) {
			var sNewParamString = "";
			var iOffset = window.location.href.search("\\?");
			if (iOffset >= 0) {
				var sBaseUrl = window.location.href.substr(0, iOffset + 1);
				var sCurrentParamString = window.location.href.substr(iOffset + 1);
				var aUrlParams = sCurrentParamString.split("&");
				var i = 0;
				aUrlParams.forEach(function (oParam) {
					iOffset = oParam.search("=");
					if (iOffset > 1) {
						i++;
						if (i === 1) {
							sNewParamString = oParam;
						} else {
							sNewParamString = sNewParamString + "&" + oParam;
						}
					}
				});
			} else {
				sBaseUrl = window.location.href + "?";
			}
			return sBaseUrl + sNewParamString + (sNewParamString.length > 0 ? "&" : "") + sParamString;
		},

		getCustomData: function (oControl, sKey) {
			var sValue = "";
			oControl.getCustomData().forEach(function (oCustomData) {
				if (oCustomData.getProperty("key") === sKey) {
					sValue = oCustomData.getProperty("value");
				}
			});
			return sValue;
		},

		removeDuplicates: function (originalArray, prop) {
			var newArray = [];
			var lookupObject = {};

			for (var i in originalArray) {
				lookupObject[originalArray[i][prop]] = originalArray[i];
			}

			for (i in lookupObject) {
				newArray.push(lookupObject[i]);
			}
			return newArray;
		}

	});

});