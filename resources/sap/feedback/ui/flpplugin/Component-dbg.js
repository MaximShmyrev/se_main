/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/thirdparty/jquery",
	"sap/base/Log",
	"./utils/Constants",
	"./data/Config",
	"./controller/PluginController"
], function (
    Component,
    $,
	Log,
	Constants,
	Config,
	PluginController
) {
    "use strict";
    /* global sap */

	return Component.extend("sap.feedback.ui.flpplugin.Component", {
		metadata: {
			manifest: "json"
		},
		_oPluginController: null,

		init: function () {
			this._getShellUIService().then(function (oShellUIService) {
				return this._setup(oShellUIService);
			}.bind(this));
		},

		_setup: function (oShellUIService) {
			return new Promise(function (resolve, reject) {
				var oConfig = this._loadPluginConfig();
				if (oConfig) {
					//Validate that the uri is provided
					var sQualtricsUri = oConfig.getQualtricsUri();
					if (sQualtricsUri && sQualtricsUri.length > 0) {
						var sTenantId = oConfig.getTenantId();
						if (sTenantId && sTenantId.length > 0) {
							if (this._isDeviceDisplayFormatCombinationValid(oConfig.getDisplayFormat())) {
								var oResourceBundle = this.getModel("i18n").getResourceBundle();
								this._oPluginController = new PluginController(oConfig, this._getRenderer(), oResourceBundle, oShellUIService);
								this._oPluginController.init().then(function () {
									resolve();
								});
							}
						} else {
							Log.error("Feedback config insufficient - tenant id missing.", oConfig, Constants.S_PLUGIN_COMPONENT_NAME);
							reject();
						}
					} else {
						Log.error("Feedback config insufficient - url missing.", oConfig, Constants.S_PLUGIN_COMPONENT_NAME);
						reject();
					}
				} else {
					Log.error("Feedback config could not be read.", oConfig, Constants.S_PLUGIN_COMPONENT_NAME);
					reject();
				}
			}.bind(this));
		},

		_loadPluginConfig: function () {
			if (this.getComponentData()) {
				var oPluginConfig = this.getComponentData().config;
				var oConfig = new Config(oPluginConfig.qualtricsInternalUri, oPluginConfig.tenantId, Constants.E_DATA_FORMAT.version1);
                oConfig.setTenantRole(oPluginConfig.tenantRole);
                
                if (oPluginConfig.isPushEnabled) {
					oConfig.setIsPushEnabled(oPluginConfig.isPushEnabled);
					if (oConfig.getIsPushEnabled() && oPluginConfig.pushChannelPath && oPluginConfig.pushChannelPath.length > 0) {
						oConfig.setPushChannelPath(oPluginConfig.pushChannelPath);
					}
				}
				if (oPluginConfig.productName) {
					oConfig.setProductName(oPluginConfig.productName);
				}
				if (oPluginConfig.platformType) {
					oConfig.setPlatformType(oPluginConfig.platformType);
				}
				return oConfig;
			}
			return null;
		},

		_isDeviceDisplayFormatCombinationValid: function (iDisplayFormat) {
			if (sap.ui.Device.system.phone && iDisplayFormat === Constants.E_DISPLAY_FORMAT.popover) {
				return false;
			}
			return true;
		},

		_getShellUIService: function () {
			return this.getService("ShellUIService").then(function (oService) {
				return oService;
			}, function (oError) {
				Log.error("Cannot get ShellUIService", oError, Constants.S_PLUGIN_COMPONENT_NAME);
			});
		},

		_getRenderer: function () {
			var oDeferred = new $.Deferred(),
				oRenderer;

			this._oShellContainer = $.sap.getObject("sap.ushell.Container");
			if (!this._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context."
				);
			} else {
				oRenderer = this._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					this._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject(
								"Illegal state: shell renderer not available after recieving 'rendererLoaded' event."
							);
						}
					};
					this._oShellContainer.attachRendererCreatedEvent(
						this._onRendererCreated
					);
				}
			}
			return oDeferred.promise();
		}
	});
});