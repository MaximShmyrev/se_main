sap.ui.define(["./DialogAPI", "sap/fe/test/Utils"], function(DialogAPI, Utils) {
	"use strict";

	/**
	 * Constructor.
	 *
	 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder the DialogBuilder instance to operate on
	 * @param {string} [vDialogDescription] the dialog description (optional), used to log message
	 * @param {boolean} [bCloseOnly] set to true if dialog only has one button to close it
	 * @returns {sap.fe.test.api.DialogAssertions} the instance
	 * @class
	 * @private
	 */
	var DialogAssertions = function(oDialogBuilder, vDialogDescription, bCloseOnly) {
		return DialogAPI.call(this, oDialogBuilder, vDialogDescription, bCloseOnly);
	};
	DialogAssertions.prototype = Object.create(DialogAPI.prototype);
	DialogAssertions.prototype.constructor = DialogAssertions;
	DialogAssertions.prototype.isAction = false;

	/**
	 * Checks the dialog.
	 *
	 * @param {object} [mDialogState] the state of the dialog. Available states are:
	 * <code><pre>
	 * 	{
	 * 		focused: true|false // check includes all elements inside the dialog
	 * 	}
	 * </pre></code>
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 */
	DialogAssertions.prototype.iCheckState = function(mDialogState) {
		return this.prepareResult(
			this.getBuilder()
				.hasState(mDialogState)
				.description(Utils.formatMessage("Checking dialog '{0}' having state '{1}'", this.getIdentifier(), mDialogState))
				.execute()
		);
	};

	/**
	 * Checking the confirmation action of the dialog.
	 *
	 * @param {object} [mButtonState] the state of the action button. Available states are:
	 * <code><pre>
	 * 	{
	 * 		enabled: true|false
	 * 	}
	 * </pre></code>
	 * @returns {object} an object extending a jQuery promise.
	 * @private
	 */
	DialogAssertions.prototype.iCheckConfirm = function(mButtonState) {
		return this.prepareResult(
			this.getBuilder()
				.hasFooterButton(this._getConfirmButtonMatcher(), mButtonState)
				.description(
					Utils.formatMessage(
						"Checking confirmation button on dialog '{0}' having state '{1}'",
						this.getIdentifier(),
						mButtonState
					)
				)
				.execute()
		);
	};

	/**
	 * Checking the cancellation action of the dialog.
	 *
	 * @param {object} [mButtonState] the state of the action button. Available states are:
	 * <code><pre>
	 * 	{
	 * 		enabled: true|false
	 * 	}
	 * </pre></code>
	 * @returns {object} an object extending a jQuery promise.
	 * @private
	 */
	DialogAssertions.prototype.iCheckCancel = function(mButtonState) {
		return this.prepareResult(
			this.getBuilder()
				.hasFooterButton(this._getCancelButtonMatcher(), mButtonState)
				.description(
					Utils.formatMessage(
						"Checking cancellation button on dialog '{0}' having state '{1}'",
						this.getIdentifier(),
						mButtonState
					)
				)
				.execute()
		);
	};

	return DialogAssertions;
});
