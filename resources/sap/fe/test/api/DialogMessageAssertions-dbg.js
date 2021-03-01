sap.ui.define(["./DialogAssertions", "sap/ui/test/OpaBuilder", "sap/fe/test/Utils"], function(DialogAssertions, OpaBuilder, Utils) {
	"use strict";

	/**
	 * Constructor.
	 *
	 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder the DialogBuilder instance to operate on
	 * @param {string} [vDialogDescription] the dialog description (optional), used to log message
	 * @returns {sap.fe.test.api.DialogMessageAssertions} the instance
	 * @class
	 * @private
	 */
	var DialogMessageAssertions = function(oDialogBuilder, vDialogDescription) {
		return DialogAssertions.call(this, oDialogBuilder, vDialogDescription, true);
	};
	DialogMessageAssertions.prototype = Object.create(DialogAssertions.prototype);
	DialogMessageAssertions.prototype.constructor = DialogMessageAssertions;
	DialogMessageAssertions.prototype.isAction = false;

	/**
	 * Checking the back action on the dialog.
	 *
	 * @param {object} [mButtonState] the state of the back button. Available states are:
	 * <code><pre>
	 * 	{
	 * 		enabled: true|false
	 * 	}
	 * </pre></code>
	 * @returns {object} an object extending a jQuery promise.
	 * @private
	 */
	DialogMessageAssertions.prototype.iCheckBack = function(mButtonState) {
		return this.prepareResult(
			this.getBuilder()
				.hasHeaderButton(OpaBuilder.Matchers.properties({ icon: "sap-icon://nav-back" }), mButtonState)
				.description(
					Utils.formatMessage("Checking back button on dialog '{0}' having state '{1}'", this.getIdentifier(), mButtonState)
				)
				.execute()
		);
	};

	return DialogMessageAssertions;
});
