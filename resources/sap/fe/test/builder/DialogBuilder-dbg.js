sap.ui.define(["./FEBuilder", "./OverflowToolbarBuilder", "sap/ui/test/OpaBuilder", "sap/fe/test/Utils"], function(
	FEBuilder,
	OverflowToolbarBuilder,
	OpaBuilder,
	Utils
) {
	"use strict";

	var DialogBuilder = function() {
		return FEBuilder.apply(this, arguments)
			.isDialogElement()
			.hasType("sap.m.Dialog");
	};

	DialogBuilder.create = function(oOpaInstance, oOptions) {
		return new DialogBuilder(oOpaInstance, oOptions);
	};

	DialogBuilder.prototype = Object.create(FEBuilder.prototype);
	DialogBuilder.prototype.constructor = DialogBuilder;

	DialogBuilder.prototype.hasHeaderButton = function(vButtonMatcher, mState) {
		return this.has(OpaBuilder.Matchers.aggregation("customHeader"))
			.has(FEBuilder.Matchers.atIndex(0))
			.hasSome(
				OpaBuilder.Matchers.aggregation("contentLeft", vButtonMatcher),
				OpaBuilder.Matchers.aggregation("contentMiddle", vButtonMatcher),
				OpaBuilder.Matchers.aggregation("contentRight", vButtonMatcher)
			)
			.has(FEBuilder.Matchers.atIndex(0))
			.hasState(mState);
	};

	DialogBuilder.prototype.hasFooterButton = function(vButtonMatcher, mState) {
		return this.doOpenFooterOverflow().success(function(vDialog) {
			if (Array.isArray(vDialog)) {
				vDialog = vDialog.pop();
			}
			return FEBuilder.create()
				.hasId(vDialog.getId())
				.has(OpaBuilder.Matchers.aggregation("buttons", vButtonMatcher))
				.has(FEBuilder.Matchers.atIndex(0))
				.hasState(mState)
				.execute();
		});
	};

	DialogBuilder.prototype.doPressHeaderButton = function(vButtonMatcher) {
		return this.has(OpaBuilder.Matchers.aggregation("customHeader"))
			.has(FEBuilder.Matchers.atIndex(0))
			.hasSome(
				OpaBuilder.Matchers.aggregation("contentLeft", vButtonMatcher),
				OpaBuilder.Matchers.aggregation("contentMiddle", vButtonMatcher),
				OpaBuilder.Matchers.aggregation("contentRight", vButtonMatcher)
			)
			.has(FEBuilder.Matchers.atIndex(0))
			.doPress();
	};

	DialogBuilder.prototype.doOpenFooterOverflow = function() {
		return OverflowToolbarBuilder.openOverflow(this, "footer");
	};

	DialogBuilder.prototype.doPressFooterButton = function(vButtonMatcher) {
		return this.doOpenFooterOverflow().success(function(vDialog) {
			if (Array.isArray(vDialog)) {
				vDialog = vDialog.pop();
			}
			return OpaBuilder.create()
				.hasId(vDialog.getId())
				.has(OpaBuilder.Matchers.aggregation("buttons", vButtonMatcher))
				.doPress()
				.execute();
		});
	};

	return DialogBuilder;
});
