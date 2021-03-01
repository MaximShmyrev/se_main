/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "sap/base/Log", "sap/ui/core/ws/WebSocket", "sap/ui/core/ws/ReadyState", "../utils/Constants"],
	function (Object, Log, WebSocket, ReadyState, Constants) {
        "use strict";
        /* global sap, window */

		return Object.extend("sap.feedback.ui.flpplugin.controller.PushClient", {
			_oConfig: null,
			_fnPushCallback: null,
			_connection: null,

			constructor: function (oConfig) {
				this._oConfig = oConfig;
			},
			init: function (fnPushCallback) {
				this._fnPushCallback = fnPushCallback;
				this._initClient();
			},
			_initClient: function () {
				var sWebSocketUri = this._constructUri();
				if (sWebSocketUri && sWebSocketUri.length > 0) {
					try {
						this._connection = new WebSocket(sWebSocketUri);
						this._connection.attachOpen(this._onOpen, this);
						this._connection.attachMessage(this._onMessage, this);
						this._connection.attachError(this._onError, this);
						this._connection.attachClose(this._onClose, this);
					} catch (e) {
						Log.error("Push survey connection could not be initalized.", e, Constants.S_PLUGIN_PUSHCLNT_NAME);
					}
				}
			},
			_constructUri: function () {
				var sCurrentLocation = window.location;
				var sConstructedUri = "";
				if (sCurrentLocation.protocol === "https:") {
					sConstructedUri = "wss:";
				} else {
					sConstructedUri = "ws:";
				}
				sConstructedUri += "//" + sCurrentLocation.host;
				sConstructedUri += this._oConfig.getPushChannelPath();
				return sConstructedUri;
			},
			_close: function () {
				this._connection.close();
			},
			send: function () {
				if (this._connection.getReadyState() === ReadyState.OPEN) {
                    //Send client context to the backend for e.g. persist it there when a notification (asynchronous execution) is used for push, 
                    // otherwise client context does not match point in time when it happend.
				}
			},
			_onOpen: function (oEvent) {
				Log.info("Opened push survey channel:", oEvent, Constants.S_PLUGIN_PUSHCLNT_NAME);
			},
			_onMessage: function (oEvent) {
				var data = oEvent.getParameter("data");
				if (data) {
					try {
						var jsonData = JSON.parse(data);
						this.showSurvey(jsonData);
					} catch (e) {
						Log.error("Push survey data could not be parsed.", e, Constants.S_PLUGIN_PUSHCLNT_NAME);
					}
				}
			},
			_onError: function (oEvent) {
				Log.info("Error on push survey channel:", oEvent, Constants.S_PLUGIN_PUSHCLNT_NAME);
			},
			_onClose: function (oEvent) {
				Log.info("Closing push survey channel:", oEvent, Constants.S_PLUGIN_PUSHCLNT_NAME);
			},
			showSurvey: function (oData) {
				if (oData && oData.showSurvey) {
					if (oData.showSurvey === true) {
						if (oData.appTitle) {
							sap.qtxAppContext.appTitle = oData.appTitle;
						}
						if (this._fnPushCallback) {
							this._fnPushCallback(oData);
						}
					}
				}
			}
		});
	});