sap.ui.define(["./DialogActions", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder"], function(DialogActions, Utils, OpaBuilder) {
	"use strict";

	/**
	 * Constructor.
	 *
	 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder the DialogBuilder instance to operate on
	 * @param {string} [vDialogDescription] the dialog description (optional), used to log message
	 * @returns {sap.fe.test.api.DialogActions} the instance
	 * @class
	 * @private
	 */
	var DialogMessageActions = function(oDialogBuilder, vDialogDescription) {
		return DialogActions.call(this, oDialogBuilder, vDialogDescription, true);
	};
	DialogMessageActions.prototype = Object.create(DialogActions.prototype);
	DialogMessageActions.prototype.constructor = DialogMessageActions;
	DialogMessageActions.prototype.isAction = true;

	/**
	 * Executing the back action on the dialog.
	 *
	 * @returns {object} an object extending a jQuery promise.
	 * @private
	 */
	DialogMessageActions.prototype.iExecuteBack = function() {
		return this.prepareResult(
			this.getBuilder()
				.doPressHeaderButton(OpaBuilder.Matchers.properties({ icon: "sap-icon://nav-back" }))
				.description(Utils.formatMessage("Pressing back button on dialog '{0}'", this.getIdentifier()))
				.execute()
		);
	};

	return DialogMessageActions;
});
