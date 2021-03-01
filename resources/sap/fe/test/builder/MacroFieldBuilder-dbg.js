sap.ui.define(["./FEBuilder", "./MdcFieldBuilder", "sap/ui/test/OpaBuilder", "sap/fe/test/Utils"], function(
	FEBuilder,
	FieldBuilder,
	OpaBuilder,
	Utils
) {
	"use strict";

	function _getValueMatcher(oControl, vExpectedValue) {
		if (oControl.isA("sap.ui.mdc.Field")) {
			return FieldBuilder.Matchers.value(vExpectedValue);
		}
		if (oControl.isA("sap.ui.unified.Currency")) {
			return OpaBuilder.Matchers.properties({ value: vExpectedValue.value, currency: vExpectedValue.description });
		}
		var sExpectedValue = vExpectedValue;
		// we should avoid using the value description syntax when using non MDC controls but this is a workaround to have it working
		if (vExpectedValue.value) {
			sExpectedValue = vExpectedValue.description
				? vExpectedValue.description + " (" + vExpectedValue.value + ")"
				: vExpectedValue.value;
		}
		if (oControl.isA("sap.m.InputBase")) {
			return OpaBuilder.Matchers.properties({ value: sExpectedValue });
		}
		if (oControl.isA("sap.m.ObjectIdentifier")) {
			return OpaBuilder.Matchers.properties({ title: sExpectedValue });
		}
		return OpaBuilder.Matchers.properties({ text: sExpectedValue });
	}

	function _getStateMatcher(oControl, sName, vValue) {
		if (oControl.isA("sap.ui.mdc.Field")) {
			return FieldBuilder.Matchers.state(sName, vValue);
		}
		return FEBuilder.Matchers.state(sName, vValue);
	}

	function _getMainControls(oContent) {
		if (oContent.isA("sap.fe.core.controls.FormElementWrapper")) {
			// we need to do this to be able to retrieve the child of the FormElementWrapper when its child is not visible
			return _getMainControls(oContent.getContent());
		}
		if (oContent.isA("sap.fe.core.controls.FieldWrapper")) {
			if (oContent.getEditMode() === "Display") {
				return _getMainControls(oContent.getContentDisplay());
			} else {
				return _getMainControls(oContent.getContentEdit()[0]);
			}
		}
		if (oContent.isA("sap.fe.core.controls.LinkWrapper")) {
			var oLink = oContent.getHasTargetsAvailable() ? oContent.getContentTargets() : oContent.getContentNoTargets();
			return _getMainControls(oLink);
		}
		return oContent.isA("sap.ui.mdc.Field") ||
			oContent.isA("sap.m.Text") ||
			oContent.isA("sap.m.Label") ||
			oContent.isA("sap.m.CheckBox") ||
			oContent.isA("sap.m.Link") ||
			oContent.isA("sap.m.ObjectStatus") ||
			oContent.isA("sap.m.InputBase") ||
			oContent.isA("sap.m.Avatar") ||
			oContent.isA("sap.ui.unified.Currency") ||
			oContent.isA("sap.m.ObjectIdentifier") ||
			oContent.isA("sap.m.RatingIndicator") ||
			oContent.isA("sap.m.ProgressIndicator")
			? [oContent]
			: OpaBuilder.Matchers.children(
					OpaBuilder.create().hasSome(
						FEBuilder.Matchers.state("controlType", "sap.ui.mdc.Field"),
						FEBuilder.Matchers.state("controlType", "sap.m.Text"),
						FEBuilder.Matchers.state("controlType", "sap.m.Label"),
						FEBuilder.Matchers.state("controlType", "sap.m.Link"),
						FEBuilder.Matchers.state("controlType", "sap.m.ObjectStatus"),
						FEBuilder.Matchers.state("controlType", "sap.m.InputBase"),
						FEBuilder.Matchers.state("controlType", "sap.m.Avatar"),
						FEBuilder.Matchers.state("controlType", "sap.ui.unified.Currency"),
						FEBuilder.Matchers.state("controlType", "sap.m.ObjectIdentifier"),
						FEBuilder.Matchers.state("controlType", "sap.m.RatingIndicator"),
						FEBuilder.Matchers.state("controlType", "sap.m.ProgressIndicator")
					)
			  )(oContent);
	}

	var MacroFieldBuilder = function() {
		return FEBuilder.apply(this, arguments);
	};

	MacroFieldBuilder.create = function(oOpaInstance) {
		return new MacroFieldBuilder(oOpaInstance);
	};

	MacroFieldBuilder.prototype = Object.create(FEBuilder.prototype);
	MacroFieldBuilder.prototype.constructor = MacroFieldBuilder;

	/**
	 * Returns the state matcher for the MdcField control.
	 * @param mState
	 * @returns {*}
	 * @protected
	 */
	MacroFieldBuilder.prototype.getStatesMatcher = function(mState) {
		return MacroFieldBuilder.Matchers.states(mState);
	};

	MacroFieldBuilder.prototype.hasValue = function(vValue) {
		// silently ignore undefined argument for convenience
		if (vValue === undefined) {
			return this;
		}
		return this.has(MacroFieldBuilder.Matchers.value(vValue));
	};

	MacroFieldBuilder.prototype.hasState = function(mState) {
		// silently ignore undefined argument for convenience
		if (!mState) {
			return this;
		}
		return this.has(MacroFieldBuilder.Matchers.states(mState));
	};

	MacroFieldBuilder.Matchers = {
		value: function(vExpectedValue) {
			return function(oControl) {
				var aMainControls = _getMainControls(oControl);
				return aMainControls.some(function(oMainControl) {
					return OpaBuilder.Matchers.match(_getValueMatcher(oMainControl, vExpectedValue))(oMainControl);
				});
			};
		},
		state: function(sName, vValue) {
			return function(oControl) {
				var aMainControls = _getMainControls(oControl);
				return aMainControls.some(function(oMainControl) {
					return OpaBuilder.Matchers.match(_getStateMatcher(oMainControl, sName, vValue))(oMainControl);
				});
			};
		},
		states: function(mStateMap) {
			return FEBuilder.Matchers.states(mStateMap, MacroFieldBuilder.Matchers.state);
		}
	};

	MacroFieldBuilder.prototype.do = function(vAction) {
		// whenever an action is performed on a MacroField we want it to be perform on its main control
		this.has(function(vControls) {
			if (!vControls) {
				return null;
			}
			if (!Array.isArray(vControls)) {
				vControls = [vControls];
			}
			return vControls.reduce(function(aMainControls, vControl) {
				return aMainControls.concat(_getMainControls(vControl));
			}, []);
		});
		return FEBuilder.prototype.do.call(this, vAction);
	};

	return MacroFieldBuilder;
});
