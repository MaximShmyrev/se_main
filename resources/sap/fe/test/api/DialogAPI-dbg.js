sap.ui.define(["./BaseAPI", "sap/fe/test/Utils", "sap/fe/test/builder/DialogBuilder"], function(BaseAPI, Utils, DialogBuilder) {
	"use strict";

	/**
	 * A dialog identifier.
	 *
	 * @typedef {object} DialogIdentifier
	 * @property {sap.fe.test.api.DialogType} type the type of the dialog
	 *
	 * @name sap.fe.test.api.DialogIdentifier
	 * @private
	 */

	/**
	 * Constructor.
	 *
	 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder the DialogBuilder instance to operate on
	 * @param {string} [vDialogDescription] the dialog description (optional), used to log message
	 * @param {boolean} [bCloseOnly] set to true if dialog only has one button to close it
	 * @returns {sap.fe.test.api.DialogAPI} the instance
	 * @class
	 * @private
	 */
	var DialogAPI = function(oDialogBuilder, vDialogDescription, bCloseOnly) {
		if (!Utils.isOfType(oDialogBuilder, DialogBuilder)) {
			throw new Error("oDialogBuilder parameter must be a DialogBuilder instance");
		}
		var aArguments = Utils.parseArguments([DialogBuilder, [Object, String], Boolean], arguments);
		this._bCloseOnly = aArguments[2];
		return BaseAPI.call(this, aArguments[0], aArguments[1]);
	};
	DialogAPI.prototype = Object.create(BaseAPI.prototype);
	DialogAPI.prototype.constructor = DialogAPI;

	DialogAPI.prototype._getConfirmButtonMatcher = function() {
		var bCloseOnly = this._bCloseOnly;
		return function(oButton) {
			var aButtons = oButton.getParent().getButtons();
			// Confirm is the second-last button (if not confirm only)
			return aButtons.indexOf(oButton) === aButtons.length - (bCloseOnly ? 1 : 2);
		};
	};

	DialogAPI.prototype._getCancelButtonMatcher = function() {
		return function(oButton) {
			var aButtons = oButton.getParent().getButtons();
			// Cancel is the last button
			return aButtons.indexOf(oButton) === aButtons.length - 1;
		};
	};

	return DialogAPI;
});
