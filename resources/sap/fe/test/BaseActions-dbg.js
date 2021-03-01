sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder", "sap/fe/test/Utils"], function(
	Opa5,
	OpaBuilder,
	FEBuilder,
	Utils
) {
	"use strict";
	// All common actions for all Opa tests are defined here
	return Opa5.extend("sap.fe.test.BaseActions", {
		iClosePopover: function() {
			return FEBuilder.createClosePopoverBuilder(this)
				.description("Closing open popover")
				.execute();
		},
		iPressEscape: function() {
			return FEBuilder.create(this)
				.has(FEBuilder.Matchers.FOCUSED_ELEMENT)
				.do(FEBuilder.Actions.keyboardShortcut("Escape"))
				.description("Pressing escape button")
				.execute();
		},
		iWait: function(iMilliseconds) {
			var bWaitingPeriodOver = false;
			setTimeout(function() {
				bWaitingPeriodOver = true;
			}, iMilliseconds);
			return FEBuilder.create(this)
				.check(function() {
					return bWaitingPeriodOver;
				})
				.description(Utils.formatMessage("Waiting for '{0}' milliseconds ", iMilliseconds))
				.execute();
		},
		iNavigateBack: function() {
			return OpaBuilder.create(this)
				.viewId(null)
				.hasId("backBtn")
				.doPress()
				.description("Navigating back via shell")
				.execute();
		},
		iPressShellHome: function() {
			return OpaBuilder.create(this)
				.do(function() {
					var oTestWindow = Opa5.getWindow();
					oTestWindow.document.getElementById("shell-header-logo").click();
				})
				.description("Navigate back using Home icon")
				.execute();
		},
		iExpandShellNavMenu: function() {
			return OpaBuilder.create(this)
				.viewId(null)
				.hasId("shellAppTitle")
				.doPress()
				.description("Expanding Navigation Menu")
				.execute();
		},
		iNavigateViaShellNavMenu: function(sItem) {
			return OpaBuilder.create(this)
				.viewId(null)
				.hasId("sapUshellNavHierarchyItems")
				.doOnAggregation("items", OpaBuilder.Matchers.properties({ title: sItem }), OpaBuilder.Actions.press())
				.description("Navigating to " + sItem)
				.execute();
		}
	});
});
