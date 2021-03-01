sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution", "sap/base/Log"], function(
	ControllerExtension,
	OverrideExecution,
	Log
) {
	"use strict";

	/**
	 * @class A generic IntentbasedNavigation controller extension to be consumed by controllers for Navigating to the external Application
	 *
	 * @name sap.fe.core.controllerextensions.IntentBasedNavigation
	 * @public
	 * @since 1.86.0
	 */
	return ControllerExtension.extend("sap.fe.core.controllerextensions.IntentBasedNavigation", {
		metadata: {
			methods: {
				navigateOutbound: {
					"final": true,
					"public": true
				},
				adaptNavigationContext: {
					"final": false,
					"public": true,
					overrideExecution: OverrideExecution.After
				}
			}
		},
		/**
		 * Navigates to an Outbound provided in the manifest.
		 * @function
		 * @param {string} sOutbound Identifier to location the outbound in the manifest
		 * @param {object} mNavigationParameters Optional map containing key/value pairs to be passed to the intent
		 * @alias sap.fe.core.controllerextensions.IntentBasedNavigation#navigateOutbound
		 * @public
		 * @since 1.86.0
		 **/
		navigateOutbound: function(sOutbound, mNavigationParameters) {
			var oManifestEntry = this.base.getAppComponent().getManifestEntry("sap.app"),
				oOutbound = oManifestEntry.crossNavigation && oManifestEntry.crossNavigation.outbounds[sOutbound];
			if (!oOutbound) {
				Log.error("Outbound is not defined in manifest!!");
				return;
			}
			var sSemanticObject = oOutbound.semanticObject,
				sAction = oOutbound.action,
				outboundParams = oOutbound.parameters && this._getOutboundParams(oOutbound.parameters);

			if (mNavigationParameters || outboundParams) {
				mNavigationParameters = {
					navigationContexts: {
						data: mNavigationParameters || outboundParams
					}
				};
			}
			this.base._intentBasedNavigation.navigate(sSemanticObject, sAction, mNavigationParameters);
		},

		/**
		 * Gets parameters in app descriptor outbounds.
		 *
		 * @function
		 * @param {object} [oOutboundParams] parameters defined in the outbounds. Only "plain" is supported
		 * @returns {Array} [aParamsMapping] parameters with the key-Value pair
		 * @private
		 **/
		_getOutboundParams: function(oOutboundParams) {
			var oParamsMapping = {};
			if (oOutboundParams) {
				var aParameters = Object.keys(oOutboundParams) || [];
				if (aParameters.length > 0) {
					aParameters.forEach(function(key) {
						var oMapping = oOutboundParams[key];
						if (oMapping.value && oMapping.value.value && oMapping.value.format === "plain") {
							if (!oParamsMapping[key]) {
								oParamsMapping[key] = oMapping.value.value;
							}
						}
					});
				}
			}
			return oParamsMapping;
		},

		/**
		 * Customize the {@link sap.fe.navigation.SelectionVariant} being passed to this navigation.
		 *
		 * @function
		 * @param {sap.fe.navigation.SelectionVariant} oSelectionVariant SelectionVariant that the template has prepared
		 * @param {object} oTargetInfo SemanticObject and action of the target app
		 * @alias sap.fe.core.controllerextensions.IntentBasedNavigation#adaptNavigationContext
		 * @public
		 * @since 1.86.0
		 */
		adaptNavigationContext: function(oSelectionVariant, oTargetInfo) {
			// to be overriden by the application
		}
	});
});
