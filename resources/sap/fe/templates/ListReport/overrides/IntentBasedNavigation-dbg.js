sap.ui.define(["sap/fe/core/CommonUtils"], function(CommonUtils) {
	"use strict";
	return {
		adaptNavigationContext: function(oSelectionVariant) {
			// Adding filter bar values to the navigation does not make sense if no context has been selected.
			// Hence only consider filter bar values when SelectionVaraint is not empty
			if (!oSelectionVariant.isEmpty()) {
				var oView = this.getView();
				var oFilterBarConditions = Object.assign({}, this.base.getView().getController().filterBarConditions);
				var sEntitySet = this.base.getCurrentEntitySet();
				var oInternalModelContext = oView.getBindingContext("internal");
				// Do we need to exclude Fields (displayed entitySet is not the entitySet used by FilterBar)?
				if (sEntitySet !== oView.getViewData().entitySet) {
					var mTabs = oInternalModelContext.getProperty("tabs");
					var aIgnoredFieldsForEntitySet = mTabs.ignoredFields[sEntitySet];
					if (Array.isArray(aIgnoredFieldsForEntitySet) && aIgnoredFieldsForEntitySet.length > 0) {
						aIgnoredFieldsForEntitySet.forEach(function(sProperty) {
							delete oFilterBarConditions[sProperty];
						});
					}
				}
				// TODO: move this also into the intent based navigation controller extension
				CommonUtils.addExternalStateFiltersToSelectionVariant(oSelectionVariant, oFilterBarConditions);
			}
		},
		getEntitySet: function() {
			return this.base.getCurrentEntitySet();
		}
	};
});
