sap.ui.define(
	["./BaseAPI", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder", "sap/ui/core/SortOrder"],
	function(BaseAPI, Utils, OpaBuilder, FEBuilder, SortOrder) {
		"use strict";

		/**
		 * Constructor.
		 * @param {sap.fe.test.builder.FEBuilder} oBuilderInstance the table builder instance to operate on
		 * @param {string} [vChartDescription] the table description (optional), used to log message
		 * @returns {sap.fe.test.api.ChartAssertions} the instance
		 * @class
		 * @private
		 */
		var ChartAssertions = function(oBuilderInstance, vChartDescription) {
			return BaseAPI.call(this, oBuilderInstance, vChartDescription);
		};
		ChartAssertions.prototype = Object.create(BaseAPI.prototype);
		ChartAssertions.prototype.constructor = ChartAssertions;
		ChartAssertions.prototype.isAction = false;

		ChartAssertions.prototype.iCheckItems = function(iNumberOfItems) {
			return OpaBuilder.create(this)
				.hasType("sap.ui.mdc.Chart")
				.check(function(oChart) {
					var aContexts = oChart[0].getBinding("data").getContexts();
					return (
						(aContexts && (iNumberOfItems === undefined ? aContexts.length !== 0 : aContexts.length === iNumberOfItems)) ||
						(!aContexts && iNumberOfItems === 0)
					);
				}, true)
				.description("Seeing " + iNumberOfItems + "of items")
				.execute();
		};

		ChartAssertions.prototype.iSeeChartType = function(sChartType) {
			return OpaBuilder.create(this)
				.hasType("sap.ui.mdc.Chart")
				.check(function(oChart) {
					return sChartType === oChart[0].getChartType();
				}, true)
				.description("Chart type is " + sChartType)
				.execute();
		};

		ChartAssertions.prototype.iCheckBreadCrumb = function(sLink) {
			return OpaBuilder.create(this)
				.hasType("sap.m.Breadcrumbs")
				.hasProperties({ currentLocationText: sLink })
				.description("BreadCrumb is " + sLink)
				.execute();
		};

		ChartAssertions.prototype.iCheckVisibleDimensions = function(aDimensions) {
			return OpaBuilder.create(this)
				.hasType("sap.chart.Chart")
				.check(function(oChart) {
					return oChart[0].getVisibleDimensions().toString() === aDimensions.toString();
				})
				.description("Visible Dimensions are checked correctly")
				.execute();
		};

		ChartAssertions.prototype.iCheckChartNoDataText = function(sNoDataText) {
			return OpaBuilder.create(this)
				.hasType("sap.ui.mdc.Chart")
				.check(function(oChart) {
					return sNoDataText === oChart[0].getNoDataText();
				})
				.description("No Data text is " + sNoDataText)
				.execute();
		};
		return ChartAssertions;
	}
);
