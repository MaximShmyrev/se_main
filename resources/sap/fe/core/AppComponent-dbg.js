/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */

// ----------------------------------------------------------------------------------
// Provides base class sap.fe.core.AppComponent for all generic app components
// ----------------------------------------------------------------------------------
sap.ui.define(
	[
		"sap/ui/core/UIComponent",
		"sap/fe/core/RouterProxy",
		"sap/fe/core/AppStateHandler",
		"sap/base/Log",
		"sap/fe/core/controllerextensions/EditFlow",
		"sap/fe/core/support/Diagnostics",
		"sap/ui/model/json/JSONModel",
		"sap/fe/core/library",
		"sap/fe/core/helpers/SemanticDateOperators",
		"sap/ui/core/CustomizingConfiguration",
		"sap/ui/core/Component",
		"sap/fe/core/TemplateComponent",
		"sap/fe/core/helpers/ModelHelper"
	],
	function(
		UIComponent,
		RouterProxy,
		AppStateHandler,
		Log,
		EditFlow,
		Diagnostics,
		JSONModel,
		library,
		SemanticDateOperators,
		CustomizingConfiguration,
		Component,
		TemplateComponent,
		ModelHelper
	) {
		"use strict";

		// monkey patch the sap.ui.core.CustomizingConfiguration#getControllerExtension:
		var fGetControllerExtension = CustomizingConfiguration.getControllerExtension;
		CustomizingConfiguration.getControllerExtension = function(sControllerName, vObject) {
			var oComponent = getAppComponent(vObject),
				sComponentId = oComponent && oComponent.getId(),
				oResultConfig = fGetControllerExtension.call(CustomizingConfiguration, sControllerName, sComponentId);
			return oResultConfig;
		};

		function getAppComponent(vObject) {
			// check whether a context is given and determine a componentId from it
			// - either it is a string, then this is the pre-processor use case and the string is a component id
			// - or it is a view or fragment and the Id of the owner component should be used
			var sComponentId = vObject && typeof vObject === "string" ? vObject : vObject && Component.getOwnerIdFor(vObject);
			// retrieve the component (if an Id is known)
			var oComponent = sComponentId && Component.get(sComponentId);
			// only when it inherits from TemplateComponent, ask for the AppComponent instead
			if (oComponent instanceof TemplateComponent) {
				oComponent = oComponent.oAppComponent;
			}
			// return the AppComponent
			return oComponent;
		}

		var NAVCONF = {
			FCL: {
				VIEWNAME: "sap.fe.templates.RootContainer.view.Fcl",
				ROUTERCLASS: "sap.f.routing.Router"
			},
			NAVCONTAINER: {
				VIEWNAME: "sap.fe.templates.RootContainer.view.NavContainer",
				ROUTERCLASS: "sap.m.routing.Router"
			}
		};

		var AppComponent = UIComponent.extend("sap.fe.core.AppComponent", {
			metadata: {
				config: {
					fullWidth: true
				},
				manifest: {
					"sap.ui5": {
						services: {
							resourceModel: {
								factoryName: "sap.fe.core.services.ResourceModelService",
								"startup": "waitFor",
								"settings": {
									"bundles": ["sap.fe.core.messagebundle"],
									"modelName": "sap.fe.i18n"
								}
							},
							routingService: {
								factoryName: "sap.fe.core.services.RoutingService",
								startup: "waitFor"
							},
							shellServices: {
								factoryName: "sap.fe.core.services.ShellServices",
								startup: "waitFor"
							},
							ShellUIService: {
								factoryName: "sap.ushell.ui5service.ShellUIService"
							},
							navigationService: {
								factoryName: "sap.fe.core.services.NavigationService",
								startup: "waitFor"
							},
							environmentCapabilities: {
								factoryName: "sap.fe.core.services.EnvironmentService",
								startup: "waitFor"
							},
							asyncComponentService: {
								factoryName: "sap.fe.core.services.AsyncComponentService",
								startup: "waitFor"
							}
						},
						rootView: {
							viewName: NAVCONF.NAVCONTAINER.VIEWNAME,
							type: "XML",
							async: true,
							id: "appRootView"
						},
						routing: {
							config: {
								controlId: "appContent",
								routerClass: NAVCONF.NAVCONTAINER.ROUTERCLASS,
								viewType: "XML",
								controlAggregation: "pages",
								async: true,
								containerOptions: {
									propagateModel: true
								}
							}
						}
					}
				},
				designtime: "sap/fe/core/designtime/AppComponent.designtime",

				library: "sap.fe.core"
			},

			_isFclEnabled: function() {
				var oManifestUI5 = this.getMetadata().getManifestEntry("/sap.ui5", true);
				return NAVCONF.FCL.VIEWNAME === oManifestUI5.rootView.viewName;
			},

			/**
			 * Get a reference to the RouterProxy.
			 *
			 * @function
			 * @name sap.fe.core.AppComponent#getRouterProxy
			 * @memberof sap.fe.core.AppComponent
			 * @returns {oObject} reference to the outerProxy
			 *
			 * @sap-restricted
			 * @final
			 */
			getRouterProxy: function() {
				return this._oRouterProxy;
			},

			/**
			 * Get a reference to the AppStateHandler.
			 *
			 * @function
			 * @name sap.fe.core.AppComponent#getAppStateHandler
			 * @memberof sap.fe.core.AppComponent
			 * @returns {oObject} reference to the AppStateHandler
			 *
			 * @sap-restricted
			 * @final
			 */
			getAppStateHandler: function() {
				return this._oAppStateHandler;
			},

			/**
			 * Get a reference to the nav/FCL Controller.
			 *
			 * @function
			 * @name sap.fe.core.AppComponent#getRootViewController
			 * @memberof sap.fe.core.AppComponent
			 * @returns {oObject} reference to the FCL Controller
			 *
			 * @sap-restricted
			 * @final
			 */
			getRootViewController: function() {
				return this.getRootControl().getController();
			},

			/**
			 * Get the NavContainer control or the FCL control.
			 *
			 * @function
			 * @name sap.fe.core.AppComponent#getRootContainer
			 * @memberof sap.fe.core.AppComponent
			 * @returns {oObject} reference to  NavContainer control or the FCL control
			 *
			 * @sap-restricted
			 * @final
			 */
			getRootContainer: function() {
				return this.getRootControl().getContent()[0];
			},

			init: function() {
				this.setModel(
					new JSONModel({
						editMode: library.EditMode.Display,
						isEditable: false,
						draftStatus: library.DraftStatus.Clear,
						busy: false,
						busyLocal: {},
						pages: {}
					}),
					"ui"
				);

				var oInternalModel = new JSONModel({
					pages: {}
				});

				ModelHelper.enhanceInternalJSONModel(oInternalModel);

				this.setModel(oInternalModel, "internal");

				this.bInitializeRouting = this.bInitializeRouting !== undefined ? this.bInitializeRouting : true;
				this._oRouterProxy = new RouterProxy();
				this._oAppStateHandler = new AppStateHandler(this);
				this._oDiagnostics = new Diagnostics();
				var that = this;
				var oModel = this.getModel();
				this.initErrorMessage = null;
				if (oModel) {
					oModel
						.getMetaModel()
						.requestObject("/$EntityContainer/")
						.catch(function(oError) {
							// Error handling for erroneous metadata request
							that.initErrorMessage = oError.message;
						});
				}

				var oManifestUI5 = this.getMetadata().getManifestEntry("/sap.ui5", true);
				if (
					oManifestUI5.rootView.viewName === NAVCONF.FCL.VIEWNAME &&
					oManifestUI5.routing.config.routerClass === NAVCONF.FCL.ROUTERCLASS
				) {
					Log.info('Rootcontainer: "' + NAVCONF.FCL.VIEWNAME + '" - Routerclass: "' + NAVCONF.FCL.ROUTERCLASS + '"');
				} else if (
					oManifestUI5.rootView.viewName === NAVCONF.NAVCONTAINER.VIEWNAME &&
					oManifestUI5.routing.config.routerClass === NAVCONF.NAVCONTAINER.ROUTERCLASS
				) {
					Log.info(
						'Rootcontainer: "' + NAVCONF.NAVCONTAINER.VIEWNAME + '" - Routerclass: "' + NAVCONF.NAVCONTAINER.ROUTERCLASS + '"'
					);
				} else if (oManifestUI5.rootView.viewName.indexOf("sap.fe") !== -1) {
					throw Error(
						"\nWrong configuration for the couple (rootView/routerClass) in manifest file.\n" +
							"Current values are :(" +
							oManifestUI5.rootView.viewName +
							"/" +
							oManifestUI5.routing.config.routerClass +
							")\n" +
							"Expected values are \n" +
							"\t - (" +
							NAVCONF.NAVCONTAINER.VIEWNAME +
							"/" +
							NAVCONF.NAVCONTAINER.ROUTERCLASS +
							")\n" +
							"\t - (" +
							NAVCONF.FCL.VIEWNAME +
							"/" +
							NAVCONF.FCL.ROUTERCLASS +
							")"
					);
				} else {
					Log.info(
						'Rootcontainer: "' + oManifestUI5.rootView.viewName + '" - Routerclass: "' + NAVCONF.NAVCONTAINER.ROUTERCLASS + '"'
					);
				}

				// Adding Semantic Date Operators
				SemanticDateOperators.addSemanticDateOperators();

				// the init function configures the routing according to the settings above
				// it will call the createContent function to instantiate the RootView and add it to the UIComponent aggregations
				UIComponent.prototype.init.apply(that, arguments);
			},
			onServicesStarted: function() {
				//router must be started once the rootcontainer is initialized
				//starting of the router
				var that = this;

				function finalizedRoutingInitialization() {
					if (that.initErrorMessage) {
						var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");

						that.getRootViewController().displayMessagePage(
							oResourceBundle.getText("C_APP_COMPONENT_SAPFE_APPSTART_TECHNICAL_ISSUES"),
							{
								title: oResourceBundle.getText("C_COMMON_SAPFE_ERROR"),
								description: that.initErrorMessage,
								FCLLevel: 0
							}
						);
					} else {
						if (that.getRootViewController().attachRouteMatchers) {
							that.getRootViewController().attachRouteMatchers();
						}
						that.getRouter().initialize();
						that.getRouterProxy().init(that, that._isFclEnabled());
					}
				}

				if (this.bInitializeRouting) {
					this.getRoutingService()
						.initializeRouting(this)
						.then(function() {
							if (that.getRootViewController()) {
								finalizedRoutingInitialization();
							} else {
								that.getRootControl().attachAfterInit(function() {
									finalizedRoutingInitialization();
								});
							}
						})
						.catch(function(err) {
							Log.error("cannot cannot initialize routing: " + err);
						});
				}
			},
			exit: function() {
				this._oRouterProxy.exit();
				this.getModel("ui").destroy();
			},
			getMetaModel: function() {
				return this.getModel().getMetaModel();
			},
			getDiagnostics: function() {
				return this._oDiagnostics;
			},
			destroy: function() {
				//WORKAROUND for sticky discard request : due to async callback, request triggered by the exitApplication will be send after the UIComponent.prototype.destroy
				//so we need to copy the Requestor headers as it will be destroy
				var oMainModel = this.oModels[undefined];
				var oHeaders = jQuery.extend({}, oMainModel.oRequestor.mHeaders);
				// As we need to cleanup the application / handle the dirty object we need to call our cleanup before the models are destroyed
				UIComponent.prototype.destroy.apply(this, arguments);
				oMainModel.oRequestor.mHeaders = oHeaders;
			}
		});

		return AppComponent;
	}
);
