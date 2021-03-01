/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object"],
	function (Object) {
		"use strict";

		return Object.extend("sap.feedback.ui.flpplugin.data.PushContextData", {
			_sSourceId: null,
			_sSystemEventTimestamp: null,
			_sTargetId: null,

			constructor: function (sSourceId, sSystemEventTimestamp, sTargetId) {
				this._sSourceId = sSourceId;
				this._sSystemEventTimestamp = sSystemEventTimestamp;
				this._sTargetId = sTargetId;
			},
			getSourceId: function () {
				return this._sSourceId;
			},
			getSystemEventTimestamp: function () {
				return this._sSystemEventTimestamp;
			},
			getTargetId: function () {
				return this._sTargetId;
			}
		});
	});