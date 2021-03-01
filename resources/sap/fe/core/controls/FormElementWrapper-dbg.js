sap.ui.define(["sap/ui/core/Control", "sap/ui/Device"], function(Control, Device) {
	"use strict";
	return Control.extend("sap.fe.core.controls.FormElementWrapper", {
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
				}
			},
			defaultAggregation: "content",
			aggregations: {
				content: { type: "sap.ui.core.Control", multiple: false }
			}
		},
		renderer: function(oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.writeClasses();
			oRm.addStyle("min-height", "1rem");
			oRm.addStyle("width", oControl.getWidth());
			if (Device.browser.msie) {
				oRm.addStyle("display", "block");
			} else {
				oRm.addStyle("display", "inline-block");
			}
			oRm.writeStyles();
			oRm.write(">");
			oRm.renderControl(oControl.getContent()); // render the child Control
			oRm.write("</div>"); // end of the complete Control
		}
	});
});
