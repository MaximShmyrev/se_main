sap.ui.define(["./FooterActionsBase", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder"], function(FooterActionsBase, Utils, OpaBuilder) {
	"use strict";

	/**
	 * Constructor.
	 * @param {sap.fe.test.builder.OverflowToolbarBuilder} oOverflowToolbarBuilder the OverflowToolbarBuilder instance to operate on
	 * @param {string} [vFooterDescription] the footer description (optional), used to log message
	 * @returns {sap.fe.test.api.FooterActionsOP} the instance
	 * @class
	 * @private
	 */
	var FooterActionsOP = function(oOverflowToolbarBuilder, vFooterDescription) {
		return FooterActionsBase.call(this, oOverflowToolbarBuilder, vFooterDescription);
	};
	FooterActionsOP.prototype = Object.create(FooterActionsBase.prototype);
	FooterActionsOP.prototype.constructor = FooterActionsOP;
	FooterActionsOP.prototype.isAction = true;

	/**
	 * Execute the Save/Create action in the ObjectPage footer bar.
	 *
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @experimental
	 */
	FooterActionsOP.prototype.iExecuteSave = function() {
		return this.iExecuteAction({ service: "StandardAction", action: "Save", unbound: true });
	};

	/**
	 * Execute the Apply action in the Sub-ObjectPage footer bar.
	 *
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @experimental
	 */
	FooterActionsOP.prototype.iExecuteApply = function() {
		return this.iExecuteAction({ service: "StandardAction", action: "Apply", unbound: true });
	};

	/**
	 * Execute the Cancel action in the ObjectPage footer bar.
	 *
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @experimental
	 */
	FooterActionsOP.prototype.iExecuteCancel = function() {
		return this.iExecuteAction({ service: "StandardAction", action: "Cancel", unbound: true });
	};

	/**
	 * Confirm the Cancel action after pressing draft cancel.
	 *
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @experimental
	 */
	FooterActionsOP.prototype.iConfirmCancel = function() {
		return this.prepareResult(
			OpaBuilder.create(this)
				.hasType("sap.m.Popover")
				.isDialogElement()
				.doOnChildren(
					OpaBuilder.Matchers.resourceBundle("text", "sap.fe.core", "C_TRANSACTION_HELPER_DRAFT_DISCARD_BUTTON"),
					OpaBuilder.Actions.press()
				)
				.description("Confirming discard changes")
				.execute()
		);
	};

	return FooterActionsOP;
});
