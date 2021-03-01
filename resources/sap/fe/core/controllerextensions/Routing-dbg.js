sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution"], function(
	ControllerExtension,
	OverrideExecution
) {
	"use strict";

	/**
	 * @class A generic Routing controller extension to be consumed by controllers
	 *
	 * @name sap.fe.core.controllerextensions.Routing
	 * @public
	 * @since 1.86.0
	 */
	return ControllerExtension.extend("sap.fe.core.controllerextensions.Routing", {
		metadata: {
			methods: {
				"onBeforeNavigation": { "public": true, "final": false, overrideExecution: OverrideExecution.After }
			}
		},
		/**
		 * @function
		 * @param {object} oContextInfo Object containing row context and page context
		 * @alias sap.fe.core.controllerextensions.Routing#onBeforeNavigation
		 * @public
		 * @since 1.86.0
		 */
		onBeforeNavigation: function(oContextInfo) {
			// to be overriden by the application
		}
	});
});
