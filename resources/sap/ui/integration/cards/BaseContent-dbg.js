/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"./BaseContentRenderer",
	"sap/ui/core/Core",
	"sap/ui/core/Control",
	"sap/ui/integration/model/ObservableModel",
	"sap/ui/base/ManagedObjectObserver",
	"sap/ui/integration/util/LoadingProvider"
], function (
	BaseContentRenderer,
	Core,
	Control,
	ObservableModel,
	ManagedObjectObserver,
	LoadingProvider
) {
	"use strict";

	/**
	 * Constructor for a new <code>BaseContent</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * A base control for all card contents.
	 *
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.86.3
	 *
	 * @constructor
	 * @private
	 * @since 1.63
	 * @alias sap.ui.integration.cards.BaseContent
	 */
	var BaseContent = Control.extend("sap.ui.integration.cards.BaseContent", {
		metadata: {
			library: "sap.ui.integration",
			aggregations: {

				/**
				 * Defines the content of the control.
				 */
				_content: {
					multiple: false,
					visibility: "hidden"
				},

				/**
				 * Defines the internally used LoadingProvider.
				 */
				_loadingProvider: {
					type: "sap.ui.core.Element",
					multiple: false,
					visibility: "hidden"
				}
			},
			associations: {
				/**
				 * Associates a card to the content
				 */
				card: {
					type : "sap.ui.integration.widgets.Card",
					multiple: false
				}
			},
			events: {

				/**
				 * Fires when the user presses the control.
				 */
				press: {}
			}
		},
		renderer: BaseContentRenderer
	});

	/**
	 * Initialization hook.
	 * @private
	 */
	BaseContent.prototype.init = function () {
		this._iWaitingEventsCount = 0;
		this._bReady = false;
		this._mObservers = {};

		// So far the ready event will be fired when the data is ready. But this can change in the future.
		this._awaitEvent("_dataReady");
		this._awaitEvent("_actionContentReady");

		this.setAggregation("_loadingProvider", new LoadingProvider());
	};

	/**
	 * Handles tap event.
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	BaseContent.prototype.ontap = function (oEvent) {
		if (!oEvent.isMarked()) {
			this.firePress({
				/* no parameters */
			});
		}
	};

	BaseContent.prototype.exit = function () {
		this._iWaitingEventsCount = 0;

		if (this._mObservers) {
			Object.keys(this._mObservers).forEach(function (sKey) {
				this._mObservers[sKey].disconnect();
				delete this._mObservers[sKey];
			}, this);
		}

		this._oServiceManager = null;
		this._oDataProviderFactory = null;
		this._oIconFormatter = null;

		if (this._oDataProvider) {
			this._oDataProvider.destroy();
			this._oDataProvider = null;
		}

		if (this._oActions) {
			this._oActions.destroy();
			this._oActions = null;
		}

		if (this._oLoadingPlaceholder) {
			this._oLoadingPlaceholder.destroy();
			this._oLoadingPlaceholder = null;
		}

		this._sContentBindingPath = null;
	};

	/**
	 * Can be used in subclasses to load lazy dependencies.
	 * @param {sap.ui.integration.util.Manifest} oCardManifest The card manifest.
	 * @returns {Promise} A promise that would be resolved in case of successful loading or rejected with error message.
	 */
	BaseContent.prototype.loadDependencies = function (oCardManifest) {
		return Promise.resolve();
	};

	BaseContent.prototype.getActions = function () {
		return this._oActions;
	};

	BaseContent.prototype.setActions = function (oActions) {
		this._oActions = oActions;
	};

	/**
	 * Await for an event which controls the overall "ready" state of the content.
	 *
	 * @private
	 * @param {string} sEvent The name of the event
	 */
	BaseContent.prototype._awaitEvent = function (sEvent) {
		this._iWaitingEventsCount ++;
		this.attachEventOnce(sEvent, function () {
			this._iWaitingEventsCount --;

			if (this._iWaitingEventsCount === 0) {
				this._bReady = true;
				this.fireEvent("_ready");
			}
		});
	};


	BaseContent.prototype.setConfiguration = function (oConfiguration, sType) {

		this._oConfiguration = oConfiguration;

		if (!oConfiguration) {
			return this;
		}

		this._oLoadingPlaceholder = this.getAggregation("_loadingProvider").createContentPlaceholder(oConfiguration, sType);

		this._setDataConfiguration(oConfiguration.data);

		return this;
	};

	BaseContent.prototype.getConfiguration = function () {
		return this._oConfiguration;
	};

	/**
	 * Requests data and bind it to the item template.
	 *
	 * @private
	 * @param {Object} oDataSettings The data part of the configuration object
	 */
	BaseContent.prototype._setDataConfiguration = function (oDataSettings) {
		var oModel;

		if (!oDataSettings) {
			this._sContentBindingPath = null;
			this.fireEvent("_dataReady");
			return;
		}

		this._sContentBindingPath = oDataSettings.path || "/";
		this.bindObject(this._sContentBindingPath);

		if (this._oDataProvider) {
			this._oDataProvider.destroy();
		}
		if (this._oDataProviderFactory) {
			this._oDataProvider = this._oDataProviderFactory.create(oDataSettings, this._oServiceManager);
		}

		this.getAggregation("_loadingProvider").setDataProvider(this._oDataProvider);

		if (oDataSettings.name) {
			oModel = this.getModel(oDataSettings.name);
		} else if (this._oDataProvider) {
			oModel = new ObservableModel();
			this.setModel(oModel);
		}

		if (!oModel) {
			this.fireEvent("_dataReady");
			return;
		}

		oModel.attachEvent("change", function () {
			this.onDataChanged();

			this.onDataRequestComplete();
		}.bind(this));

		if (this._oDataProvider) {
			this._oDataProvider.attachDataRequested(function () {
				this.onDataRequested();
			}.bind(this));

			this._oDataProvider.attachDataChanged(function (oEvent) {
				oModel.setData(oEvent.getParameter("data"));
			});

			this._oDataProvider.attachError(function (oEvent) {
				this._handleError(oEvent.getParameter("message"));
				this.onDataRequestComplete();
			}.bind(this));

			this._oDataProvider.triggerDataUpdate();
		} else {
			this.fireEvent("_dataReady");
		}
	};

	/**
	 * @protected
	 */
	BaseContent.prototype.onDataRequested = function () {
		this.showLoadingPlaceholders();
	};

	/**
	 * @protected
	 */
	BaseContent.prototype.onDataRequestComplete = function () {
		this.fireEvent("_dataReady");
		this.hideLoadingPlaceholders();
	};

	/**
	 * @private
	 * @ui5-restricted
	 */
	BaseContent.prototype.showLoadingPlaceholders = function () {
		var oLoadingProvider = this.getAggregation("_loadingProvider");
		if (oLoadingProvider) {
			oLoadingProvider.setLoading(true);
		}

		this.hideContent();
	};

	/**
	 * @private
	 * @ui5-restricted
	 */
	BaseContent.prototype.hideLoadingPlaceholders = function () {
		var oLoadingProvider = this.getAggregation("_loadingProvider");
		if (oLoadingProvider) {
			oLoadingProvider.setLoading(false);
		}

		this.showContent();
	};

	/**
	 * @private
	 * @ui5-restricted
	 */
	BaseContent.prototype.hideContent = function () {
		var oContent = this.getAggregation("_content");

		if (oContent) {
			oContent.addStyleClass("sapFCardContentHidden");
		}
	};

	/**
	 * @private
	 * @ui5-restricted
	 */
	BaseContent.prototype.showContent = function () {
		var oContent = this.getAggregation("_content");

		if (oContent) {
			// restore tab chain
			oContent.removeStyleClass("sapFCardContentHidden");
		}
	};


	/**
	 * Called when the data for the content was changed either by the content or by the card.
	 * Override when special behaviour has to be implemented when data is changed.
	 * @virtual
	 */
	BaseContent.prototype.onDataChanged = function () { };

	/**
	 * Helper function to bind an aggregation.
	 *
	 * @param {string} sAggregation The name of the aggregation to bind.
	 * @param {sap.ui.core.Control} oControl The control which aggregation is going to be bound.
	 * @param {Object} oBindingInfo The binding info.
	 */
	function _bind(sAggregation, oControl, oBindingInfo) {
		var oBindingContext = this.getBindingContext(),
			oAggregation = oControl.getAggregation(sAggregation);

		if (oBindingContext) {
			oBindingInfo.path = oBindingInfo.path || this._sContentBindingPath || oBindingContext.getPath();

			oControl.bindAggregation(sAggregation, oBindingInfo);

			if (this.getModel("parameters") && oAggregation) {
				this.getModel("parameters").setProperty("/visibleItems", oAggregation.length);
			}

			if (!this._mObservers[sAggregation]) {
				this._mObservers[sAggregation] = new ManagedObjectObserver(function (oChanges) {
					if (oChanges.name === sAggregation && (oChanges.mutation === "insert" || oChanges.mutation === "remove")) {
						var oAggregation = oControl.getAggregation(sAggregation);
						var iLength = oAggregation ? oAggregation.length : 0;
						if (this.getModel("parameters")) {
							this.getModel("parameters").setProperty("/visibleItems", iLength);
						}
					}
				}.bind(this));
				this._mObservers[sAggregation].observe(oControl, {
					aggregations: [sAggregation]
				});
			}
		}
	}

	/**
	 * Binds an aggregation to the binding context path of the BaseContent.
	 *
	 * NOTE:
	 * For now items will always be bound to the content's binding context path.
	 * Later on this can be changed so that the content and items can have different binding context paths.
	 *
	 * Used for Card Content types which support aggregation binding (List, Table, Timeline).
	 *
	 * @protected
	 * @param {string} sAggregation The name of the aggregation to bind.
	 * @param {sap.ui.core.Control} oControl The control which aggregation is going to be bound.
	 * @param {Object} oBindingInfo The binding info.
	 */
	BaseContent.prototype._bindAggregationToControl = function (sAggregation, oControl, oBindingInfo) {
		var bAggregation = sAggregation && typeof sAggregation === "string";
		var bBindingInfo = oBindingInfo && typeof oBindingInfo === "object";
		if (!bAggregation || !oControl || !bBindingInfo) {
			return;
		}

		if (this.getBindingContext()) {
			_bind.apply(this, arguments);
		} else {
			oControl.attachModelContextChange(_bind.bind(this, sAggregation, oControl, oBindingInfo));
		}
	};

	/**
	 * @returns {boolean} If the content is ready or not.
	 */
	BaseContent.prototype.isReady = function () {
		return this._bReady;
	};

	BaseContent.prototype._handleError = function (sLogMessage) {
		this.fireEvent("_error", {
			logMessage: sLogMessage
		});
	};

	BaseContent.prototype.setServiceManager = function (oServiceManager) {
		this._oServiceManager = oServiceManager;
		return this;
	};

	BaseContent.prototype.setDataProviderFactory = function (oDataProviderFactory) {
		this._oDataProviderFactory = oDataProviderFactory;
		return this;
	};

	BaseContent.prototype.setIconFormatter = function (oIconFormatter) {
		this._oIconFormatter = oIconFormatter;
		return this;
	};

	BaseContent.prototype.isLoading = function () {
		var oLoadingProvider = this.getAggregation("_loadingProvider"),
			oCard = this.getCardInstance();

		return !oLoadingProvider.isDataProviderJson() && (oLoadingProvider.getLoading() || (oCard && oCard.isLoading()));
	};

	BaseContent.prototype.attachPress = function () {
		var aMyArgs = Array.prototype.slice.apply(arguments);
		aMyArgs.unshift("press");

		Control.prototype.attachEvent.apply(this, aMyArgs);

		this.invalidate();

		return this;
	};

	BaseContent.prototype.detachPress = function() {
		var aMyArgs = Array.prototype.slice.apply(arguments);
		aMyArgs.unshift("press");

		Control.prototype.detachEvent.apply(this, aMyArgs);

		this.invalidate();

		return this;
	};

	/**
	 * Callback prior the Submit Action
	 *
	 * It's called before the request is sent.
	 *
	 * @param {object} oFormData Parameters
	 */
	BaseContent.prototype.onActionSubmitStart = function (oFormData) {
	};

	/**
	 * Callback after Submit Action
	 *
	 * It's called when the request completes - either successfully or not.
	 *
	 * @param {object} oResponse The response from the server
	 * @param {object} oError The error object
	 */
	BaseContent.prototype.onActionSubmitEnd = function (oResponse, oError) {
	};

	BaseContent.prototype.getCardInstance = function () {
		return Core.byId(this.getCard());
	};

	return BaseContent;
});
