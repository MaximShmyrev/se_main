sap.ui.define(["./DialogAPI", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder"], function(DialogAPI, Utils, OpaBuilder) {
	"use strict";

	/**
	 * Constructor.
	 *
	 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder the DialogBuilder instance to operate on
	 * @param {string} [vDialogDescription] the dialog description (optional), used to log message
	 * @param {boolean} [bCloseOnly] set to true if dialog only has one button to close it
	 * @returns {sap.fe.test.api.DialogActions} the instance
	 * @class
	 * @private
	 */
	var DialogActions = function(oDialogBuilder, vDialogDescription, bCloseOnly) {
		return DialogAPI.call(this, oDialogBuilder, vDialogDescription, bCloseOnly);
	};
	DialogActions.prototype = Object.create(DialogAPI.prototype);
	DialogActions.prototype.constructor = DialogActions;
	DialogActions.prototype.isAction = true;

	/**
	 * Confirming the dialog by pressing the corresponding button (e.g. OK).
	 *
	 * @returns {object} an object extending a jQuery promise.
	 * @private
	 */
	DialogActions.prototype.iConfirm = function() {
		return this.prepareResult(
			this.getBuilder()
				.doPressFooterButton(this._getConfirmButtonMatcher())
				.description(Utils.formatMessage("Confirming dialog '{0}'", this.getIdentifier()))
				.execute()
		);
	};

	/**
	 * Cancelling the dialog by pressing the corresponding button (e.g. Cancel).
	 *
	 * @returns {object} an object extending a jQuery promise.
	 * @private
	 */
	DialogActions.prototype.iCancel = function() {
		return this.prepareResult(
			this.getBuilder()
				.doPressFooterButton(this._getCancelButtonMatcher())
				.description(Utils.formatMessage("Cancelling dialog '{0}'", this.getIdentifier()))
				.execute()
		);
	};

	// /**
	//  * Closing the dialog by pressing Escape key.
	//  *
	//  * @returns {object} an object extending a jQuery promise.
	//  * @private
	//  */
	// DialogActions.prototype.iClose = function() {
	// 	return this.prepareResult(
	// 		this.getBuilder()
	// 		.doPressKeyboardShortcut("Escape")
	// 		.description(Utils.formatMessage("Closing dialog '{0}'", this.getIdentifier()))
	// 		.execute()
	// 	);
	// };

	return DialogActions;
});
