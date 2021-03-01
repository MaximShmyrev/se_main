sap.ui.define(
	[
		"sap/fe/macros/TableDelegate",
		"sap/fe/macros/table/Utils",
		"sap/fe/macros/chart/ChartUtils",
		"sap/ui/model/Filter",
		"sap/ui/fl/Utils"
	],
	function(MacroTableDelegate, TableUtils, ChartUtils, Filter, flUtils) {
		"use strict";

		var FETableDelegate = Object.assign({}, MacroTableDelegate);

		function _getChartControl(oTable) {
			var oView = sap.ui.fl.Utils.getViewForControl(oTable);
			var sChartId = oView.getContent()[0].data("singleChartId");
			return oView.byId(sChartId);
		}
		/**
		 * @param oTable mdc table control
		 * @param oMetadataInfo metadata info of table
		 * @param oBindingInfo binding info of table
		 * in alp, when the table's binding info is being updated, the table
		 * must consider the chart selections, if they are present.
		 * otherwise, the filterbar filters must be considered.
		 */
		FETableDelegate.updateBindingInfo = function(oTable, oMetadataInfo, oBindingInfo) {
			var oFilterInfo, oFilter;
			var oChartFilterInfo = {},
				oTableFilterInfo = {};
			var aTableFilters, aChartFilters;
			if (oTable.getRowBinding()) {
				oBindingInfo.suspended = false;
			}
			var oMdcChart = _getChartControl(oTable);
			var bChartSelectionsExist = ChartUtils.getChartSelectionsExist(oMdcChart, oTable);
			oTableFilterInfo = TableUtils.getAllFilterInfo(oTable);
			aTableFilters = oTableFilterInfo && oTableFilterInfo.filters;
			oFilterInfo = oTableFilterInfo;
			if (bChartSelectionsExist) {
				oChartFilterInfo = ChartUtils.getAllFilterInfo(oMdcChart);
				aChartFilters = oChartFilterInfo && oChartFilterInfo.filters;
				oFilterInfo = oChartFilterInfo;
			}
			var aFinalFilters = aTableFilters && aChartFilters ? aTableFilters.concat(aChartFilters) : aChartFilters || aTableFilters;
			oFilter = new Filter({
				filters: aFinalFilters,
				and: true
			});
			// Prepare binding info with filter/search parameters
			TableUtils.updateBindingInfo(oBindingInfo, oFilterInfo, oFilter);
		};
		FETableDelegate.rebindTable = function(oTable, oBindingInfo) {
			var oInternalModelContext = oTable.getBindingContext("pageInternal");
			var sTemplateContentView = oInternalModelContext.getProperty(oInternalModelContext.getPath() + "/alpContentView");
			if (sTemplateContentView !== "Chart") {
				MacroTableDelegate.rebindTable(oTable, oBindingInfo);
			}
		};

		return FETableDelegate;
	},
	/* bExport= */ false
);
