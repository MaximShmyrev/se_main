sap.ui.define(
	["sap/ui/core/Control", "sap/ui/base/ManagedObjectObserver", "sap/ui/model/json/JSONModel", "sap/ui/model/BindingMode"],
	function(Control, ManagedObjectObserver, JSONModel, BindingMode) {
		"use strict";

		return Control.extend("sap.fe.core.controls.LinkWrapper", {
			metadata: {
				interfaces: ["sap.ui.core.IFormContent"],
				properties: {
					width: {
						type: "sap.ui.core.CSSSize",
						defaultValue: null
					},
					formDoNotAdjustWidth: {
						type: "boolean",
						defaultValue: false
					},
					linksFetched: {
						type: "boolean",
						defaultValue: false
					},
					hasTargetsAvailable: {
						type: "boolean",
						defaultValue: false
					}
				},
				associations: {
					/**
					 * Association to controls / IDs that label this control (see WAI-ARIA attribute aria-labelledby).
					 */
					ariaLabelledBy: { type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" }
				},
				defaultAggregation: "contentTargets",
				aggregations: {
					contentTargets: { type: "sap.ui.core.Control", multiple: false },
					contentNoTargets: { type: "sap.ui.core.Control", multiple: false }
				}
			},
			enhanceAccessibilityState: function(oElement, mAriaProps) {
				var oParent = this.getParent();

				if (oParent && oParent.enhanceAccessibilityState) {
					oParent.enhanceAccessibilityState(this, mAriaProps);
				}

				return mAriaProps;
			},
			_setAriaLabelledBy: function(oContent) {
				if (oContent && oContent.addAriaLabelledBy) {
					var aAriaLabelledBy = this.getAriaLabelledBy();

					for (var i = 0; i < aAriaLabelledBy.length; i++) {
						var sId = aAriaLabelledBy[i];
						var aAriaLabelledBys = oContent.getAriaLabelledBy() || [];
						if (aAriaLabelledBys.indexOf(sId) === -1) {
							oContent.addAriaLabelledBy(sId);
						}
					}
				}
			},
			onBeforeRendering: function() {
				// before calling the renderer of the LinkWrapper parent control may have set ariaLabelledBy
				// we ensure it is passed to its inner controls
				this._setAriaLabelledBy(this.getContentTargets());
				this._setAriaLabelledBy(this.getContentNoTargets());
			},
			renderer: {
				apiVersion: 2,
				render: function(oRm, oControl) {
					oRm.openStart("div", oControl);
					oRm.style("width", oControl.getWidth());
					oRm.style("display", "inline-block");
					oRm.openEnd();
					if (oControl.getHasTargetsAvailable()) {
						oRm.renderControl(oControl.getContentTargets());
					} else {
						oRm.renderControl(oControl.getContentNoTargets());
					}
					oRm.close("div"); // end of the complete Control
				}
			}
		});
	}
);
