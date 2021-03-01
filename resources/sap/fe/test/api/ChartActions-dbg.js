sap.ui.define(
	[
		"./BaseAPI",
		"sap/fe/test/Utils",
		"sap/ui/test/OpaBuilder",
		"sap/fe/test/builder/FEBuilder",
		"sap/ui/test/matchers/Interactable",
		"sap/fe/test/builder/VMBuilder",
		"sap/ui/core/SortOrder",
		"sap/ui/core/Core",
		"sap/fe/test/builder/MdcFilterFieldBuilder"
	],
	function(BaseAPI, Utils, OpaBuilder, FEBuilder, Interactable, VMBuilder, SortOrder, Core, FilterFieldBuilder) {
		"use strict";

		/**
		 * Constructor.
		 * @param {sap.fe.test.builder.FEBuilder} oBuilderInstance the table builder instance to operate on
		 * @param {string} [vChartDescription] the table description (optional), used to log message
		 * @returns {sap.fe.test.api.ChartActions} the instance
		 * @class
		 * @private
		 */
		var Actions = function(oBuilderInstance, vChartDescription) {
			return BaseAPI.call(this, oBuilderInstance, vChartDescription);
		};
		Actions.prototype = Object.create(BaseAPI.prototype);
		Actions.prototype.constructor = Actions;
		Actions.prototype.isAction = true;

		/**
		 * Selects the specified rows.
		 *
		 * @param {object} [mRowValues] a map of columns (either name or index) to its value, e.g. <code>{ 0: "Max", "Last Name": "Mustermann" }</code>
		 * @param {object} [mRowState] a map of states. Supported row states are
		 * <code><pre>
		 * 	{
		 * 		selected: true|false,
		 * 		focused: true|false
		 * 	}
		 * </pre></code>
		 *
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @private
		 * @experimental
		 */

		Actions.prototype.iSelectItems = function(innerData, bClearSelection) {
			if (typeof bClearSelection === "boolean") {
				bClearSelection = bClearSelection;
			} else {
				bClearSelection = true;
			}
			return OpaBuilder.create(this)
				.hasType("sap.chart.Chart")
				.check(function(oChart) {
					var bResult;
					var vizFrame = oChart[0]._getVizFrame();
					if (vizFrame) {
						var data = innerData
							? [
									{
										data: innerData
									}
							  ]
							: [];
						bResult = vizFrame.vizSelection(data, {
							clearSelection: bClearSelection
						});
					}
					return bResult;
				}, true)
				.description("Do not see the First Column Expand Button")
				.execute();
		};

		Actions.prototype.iChangeChartType = function(sType) {
			return OpaBuilder.create(this)
				.hasType("sap.ui.core.Icon")
				.hasProperties({
					src: "sap-icon://vertical-bar-chart"
				})
				.doPress()
				.success(function() {
					return OpaBuilder.create(this)
						.hasType("sap.m.StandardListItem")
						.hasProperties({
							icon: "sap-icon://horizontal-bar-chart"
						})
						.doPress()
						.description("blablabla")
						.execute();
				})
				.description("Opened the Dialog")
				.execute();
		};

		Actions.prototype.iDrillDown = function(sDimension) {
			return OpaBuilder.create(this)
				.hasType("sap.m.Button")
				.hasProperties({
					tooltip: "View By"
				})
				.doPress()
				.success(function() {
					return OpaBuilder.create(this)
						.hasType("sap.m.StandardListItem")
						.hasProperties({
							title: sDimension
						})
						.doPress()
						.description("blablabla")
						.execute();
				})
				.description("Opened the Dialog")
				.execute();
		};

		return Actions;
	}
);
