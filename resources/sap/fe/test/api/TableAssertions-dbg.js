sap.ui.define(
	[
		"./TableAPI",
		"sap/fe/test/Utils",
		"sap/ui/test/OpaBuilder",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/MdcTableBuilder",
		"sap/ui/core/SortOrder",
		"./APIHelper"
	],
	function(TableAPI, Utils, OpaBuilder, FEBuilder, TableBuilder, SortOrder, APIHelper) {
		"use strict";

		/**
		 * Constructor.
		 * @param {sap.fe.test.builder.TableBuilder} oBuilderInstance the table builder instance to operate on
		 * @param {string} [vTableDescription] the table description (optional), used to log message
		 * @returns {sap.fe.test.api.TableAssertions} the instance
		 * @class
		 * @private
		 */
		var TableAssertions = function(oBuilderInstance, vTableDescription) {
			return TableAPI.call(this, oBuilderInstance, vTableDescription);
		};
		TableAssertions.prototype = Object.create(TableAPI.prototype);
		TableAssertions.prototype.constructor = TableAssertions;
		TableAssertions.prototype.isAction = false;

		/**
		 * Checks the table.
		 *
		 * @param {object} [mTableState] the state of the table. Available states are:
		 * <code><pre>
		 * 	{
		 * 		focused: true|false // check includes all elements inside the table
		 * 	}
		 * </pre></code>
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @private
		 * @experimental
		 */
		TableAssertions.prototype.iCheckState = function(mTableState) {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.hasState(mTableState)
					.description(Utils.formatMessage("Checking table '{0}' having state='{1}'", this.getIdentifier(), mTableState))
					.execute()
			);
		};

		/**
		 * Checks the rows of a table.
		 * If <code>mRowValues</code> is provided, only rows with the corresponding values are considered.
		 * If <code>iNumberOfRows</code> is provided, the number of rows are checked with respect to the provided <code>mRowValues</code> (if set) or in total.
		 * If <code>iNumberOfRows</code> is omitted, it checks for at least one matching row.
		 * If <code>mRowState</code> is provided, the row must be in the given state.
		 *
		 * @param {object} [mRowValues] defines the expected row values. The pattern is:
		 * <code><pre>
		 * 	{
		 * 		<column-name-or-index>: <expected-value>
		 *  }
		 * </pre></code>
		 * @param {int} [iExpectedNumberOfRows] the expected number of rows considering <code>mRowValues</code> and <code>mRowState</code>
		 * @param {object} [mRowState] the states to check. Available row states are:
		 * <code><pre>
		 * 	{
		 * 		selected: true|false,
		 * 		focused: true|false
		 * 	}
		 * </pre></code>
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @private
		 * @experimental
		 */
		TableAssertions.prototype.iCheckRows = function(mRowValues, iExpectedNumberOfRows, mRowState) {
			var aArguments = Utils.parseArguments([Object, Number, Object], arguments),
				iNumberOfRows = aArguments[1],
				aRowMatcher = this.createRowMatchers(aArguments[0], aArguments[2]),
				oTableBuilder = this.getBuilder();

			// the order of the matchers matters here
			if (aRowMatcher.length) {
				// if matchers are defined, first match rows then check number of results
				oTableBuilder.hasRows(aRowMatcher, true).has(function(aRows) {
					return Utils.isOfType(iNumberOfRows, Number) ? aRows.length === iNumberOfRows : aRows.length > 0;
				});
			} else {
				// if no row matchers are defined, check the numbers of row based on table (binding)
				oTableBuilder
					.hasNumberOfRows(iNumberOfRows)
					// but still ensure that matcher returns the row aggregation
					.hasRows(null, true);
			}

			return this.prepareResult(
				oTableBuilder
					.description(
						Utils.formatMessage(
							"Checking table '{0}' having {1} rows with values='{2}' and state='{3}'",
							this.getIdentifier(),
							iNumberOfRows === undefined ? "> 0" : iNumberOfRows,
							aArguments[0],
							aArguments[2]
						)
					)
					.execute()
			);
		};

		/**
		 * Checks the state of the table CreationRow button.
		 *
		 * @param {object} [mRowValues] defines the expected row values. The pattern is:
		 * <code><pre>
		 * 	{
		 * 		<column-name-or-index>: <expected-value>
		 *  }
		 * </pre></code>
		 * @param {object} [mState] the state of the CreationRow to check. Available states are:
		 * <code><pre>
		 * 	{
		 *  	applyEnabled: true|false
		 * 	}
		 * </pre></code>
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @private
		 * @experimental
		 */
		TableAssertions.prototype.iCheckCreationRow = function(mRowValues, mState) {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.has(
						OpaBuilder.Matchers.childrenMatcher(
							FEBuilder.create(this)
								.hasType("sap.ui.table.CreationRow")
								.has(TableBuilder.Row.Matchers.cellValues(mRowValues))
								.hasState(mState)
						)
					)
					.description(
						Utils.formatMessage(
							"Checking table '{0}' having a CreationRow with values='{1}' and state='{2}'",
							this.getIdentifier(),
							mRowValues,
							mState
						)
					)
					.execute()
			);
		};

		/**
		 * Checks the number of items into the quickFilter.
		 *
		 * @param {int} iExpectedNumberOfItems the expected number of quickFilter items
		 * @returns {object} an object extending a jQuery promise.
		 * @private
		 * @experimental
		 */
		TableAssertions.prototype.iCheckQuickFilterItems = function(iExpectedNumberOfItems) {
			return this.prepareResult(
				this.getBuilder()
					.hasQuickFilterItems(iExpectedNumberOfItems)
					.description(
						Utils.formatMessage("checking table '{0}' having  '{1}' item(s)", this.getIdentifier(), iExpectedNumberOfItems)
					)
					.execute()
			);
		};

		/**
		 * Checks the state of the columns of a table.
		 *
		 * @param {int} [iExpectedNumberOfColumns] the expected number of columns
		 * @param {object} [mColumnStateMap] a map of columns to their state. The map looks like
		 * <code><pre>
		 * 	{
		 * 		<columnName | columnIndex>: {
		 *			header: "My header"
		 * 		}
		 * 	}
		 * </pre></code>
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @public
		 * @sap-restricted
		 */
		TableAssertions.prototype.iCheckColumns = function(iExpectedNumberOfColumns, mColumnStateMap) {
			var aArguments = Utils.parseArguments([Number, Object], arguments),
				mColumns = aArguments[1],
				iNumberOfColumns = aArguments[0],
				oTableBuilder = this.getBuilder();

			if (iNumberOfColumns !== undefined) {
				oTableBuilder.hasAggregationLength("columns", iNumberOfColumns);
			} else {
				oTableBuilder.hasAggregation("columns");
			}
			oTableBuilder.hasColumns(mColumns);

			return this.prepareResult(
				oTableBuilder
					.description(
						Utils.formatMessage(
							"Checking table '{0}' having {1} columns and column states='{2}'",
							this.getIdentifier(),
							iNumberOfColumns === undefined ? "> 0" : iNumberOfColumns,
							mColumns
						)
					)
					.execute()
			);
		};

		/**
		 * Checks the state of the cells of a table.
		 *
		 * @param {int} [mRowValues] a map of column names to their value. Example:
		 * <code><pre>
		 * 	{
		 * 		<column-name-or-index>: <expected-value>
		 *  }
		 * </pre></code>
		 * @param {object} mColumnStateMap a map of columns to their state. The map looks like
		 * <code><pre>
		 * 	{
		 * 		<column-name-or-index>: {
		 *			header: "My header"
		 * 		}
		 * 	}
		 * </pre></code>
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @public
		 * @sap-restricted
		 */
		TableAssertions.prototype.iCheckCells = function(mRowValues, mColumnStateMap) {
			var mRows = arguments.length > 1 ? arguments[0] : undefined,
				mColumns = arguments.length > 1 ? arguments[1] : arguments[0],
				aRowMatcher = this.createRowMatchers(mRows, TableBuilder.Row.Matchers.cellProperties(mColumns)),
				oTableBuilder = this.getBuilder();

			return this.prepareResult(
				oTableBuilder
					.hasRows(aRowMatcher)
					.description(
						Utils.formatMessage(
							"Checking table '{0}' having cells properties '{2}' of rows with values '{1}'",
							this.getIdentifier(),
							mRows,
							mColumns
						)
					)
					.execute()
			);
		};

		/**
		 * Checks the state of table actions. The action is identified either by id or by a string representing
		 * the label of the action.
		 *
		 * @param {string | sap.fe.test.api.ActionIdentifier} vActionIdentifier an action identifier
		 * @param {object} [mState] the states to check. Available action states are:
		 * <code><pre>
		 * 	{
		 * 		visible: true|false,
		 * 		enabled: true|false
		 * 	}
		 * </pre></code>
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @private
		 * @experimental
		 */
		TableAssertions.prototype.iCheckAction = function(vActionIdentifier, mState) {
			var oTableBuilder = this.getBuilder(),
				vActionMatcher = this.createActionMatcher(vActionIdentifier),
				vAggregationMatcher = OpaBuilder.Matchers.aggregationMatcher("actions", [
					vActionMatcher,
					FEBuilder.Matchers.states(mState)
				]);

			if (mState && mState.visible === false) {
				// two possibilities for non-visible action: either visible property is false, or the control wasn't rendered at all
				vAggregationMatcher = OpaBuilder.Matchers.some(
					vAggregationMatcher,
					OpaBuilder.Matchers.not(OpaBuilder.Matchers.aggregationMatcher("actions", vActionMatcher))
				);
			}

			return this.prepareResult(
				oTableBuilder
					.has(vAggregationMatcher)
					.description(
						Utils.formatMessage(
							"Checking table '{0}' having action '{1}' with state='{2}'",
							this.getIdentifier(),
							vActionIdentifier.service === "StandardAction" ? vActionIdentifier.action : vActionIdentifier,
							mState
						)
					)
					.execute()
			);
		};

		/**
		 * Checks for an action in the currently opened action menu with the given state or label.
		 *
		 * @param {object | string} vAction a state map or label of the action
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @private
		 * @experimental
		 */
		TableAssertions.prototype.iCheckMenuAction = function(vAction) {
			return this.prepareResult(APIHelper.createMenuActionCheckBuilder(vAction).execute());
		};

		/**
		 * Checks the state of the table delete action.
		 *
		 * @param {object} [mState] the states to check. Available states are:
		 * <code><pre>
		 * 	{
		 * 		visible: true|false,
		 * 		enabled: true|false
		 * 	}
		 * </pre></code>
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @private
		 * @experimental
		 */
		TableAssertions.prototype.iCheckDelete = function(mState) {
			return this.iCheckAction({ service: "StandardAction", action: "Delete", unbound: true }, mState);
		};

		/**
		 * Checks the state of the table create action.
		 *
		 * @param {object} [mState] available states are e.g.:
		 * <code><pre>
		 * 	{
		 * 		visible: true|false,
		 * 		enabled: true|false
		 * 	}
		 * </pre></code>
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @private
		 * @experimental
		 */
		TableAssertions.prototype.iCheckCreate = function(mState) {
			return this.iCheckAction({ service: "StandardAction", action: "Create", unbound: true }, mState);
		};

		/**
		 * Checks the state of the table paste action.
		 *
		 * @param {object} [mState] available states are e.g.:
		 * <code><pre>
		 * 	{
		 * 		visible: true|false,
		 * 		enabled: true|false
		 * 	}
		 * </pre></code>
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @private
		 * @experimental
		 */
		TableAssertions.prototype.iCheckPaste = function(mState) {
			return this.iCheckAction({ service: "StandardAction", action: "Paste", unbound: true }, mState);
		};

		/**
		 * Checks the state of the table fullscreen action.
		 *
		 * @param {object} [mState] available states are e.g.:
		 * <code><pre>
		 * 	{
		 * 		visible: true|false,
		 * 		enabled: true|false
		 * 	}
		 * </pre></code>
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @private
		 * @experimental
		 */
		TableAssertions.prototype.iCheckFullScreen = function(mState) {
			return this.iCheckAction({ service: "StandardAction", action: "FullScreen", unbound: true }, mState);
		};

		/**
		 * Checks the state of the table QuickFilter Control.
		 *
		 * @param {object} [mState] the state of the QuickFilter Control to check. Available states are:
		 * <code><pre>
		 * 	{
		 *  	enabled: true|false
		 * 	}
		 * </pre></code>
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @private
		 * @experimental
		 */
		TableAssertions.prototype.iCheckQuickFilter = function(mState) {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.hasAggregation("quickFilter", FEBuilder.Matchers.states(mState))
					.description(
						Utils.formatMessage(
							"Checking table '{0}' having a QuickFilter Control with state='{1}'",
							this.getIdentifier(),
							mState
						)
					)
					.execute()
			);
		};

		/**
		 * Checks whether column adaptation dialog is available/opened.
		 *
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @public
		 * @sap-restricted
		 */
		TableAssertions.prototype.iCheckColumnAdaptation = function() {
			var oAdaptationDialogBuilder = TableBuilder.createAdaptationDialogBuilder(this.getOpaInstance());
			return this.prepareResult(
				oAdaptationDialogBuilder
					.description(Utils.formatMessage("Checking column adaptation dialog for table '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Checks a field in the adaptation dialog.
		 *
		 * @param {string | sap.fe.test.api.ColumnIdentifier} vColumnIdentifier the column identifier
		 * @param {object} [mAdaptationState] the state of the adaptation field. The following states are supported:
		 * <code><pre>
		 * 	{
		 * 		selected: true|false
		 * 	}
		 * </pre></code>
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @public
		 * @sap-restricted
		 */
		TableAssertions.prototype.iCheckAdaptationColumn = function(vColumnIdentifier, mAdaptationState) {
			return this.columnAdaptation(
				vColumnIdentifier,
				mAdaptationState,
				undefined,
				Utils.formatMessage(
					"Checking adaptation column '{1}' on table '{0}' for state='{2}'",
					this.getIdentifier(),
					vColumnIdentifier,
					mAdaptationState
				)
			);
		};

		/**
		 * Checks a field in the sorting dialog.
		 *
		 * @param {string | sap.fe.test.api.ColumnIdentifier} vColumnIdentifier the column identifier
		 * @param {sap.ui.core.SortOrder} [sSortOrder] the sort order of the column, default is {@link sap.ui.core.SortOrder.Ascending}
		 * @param {boolean} [bCheckPersonalization] check the order via sorting dialog, default is false
		 * @returns {object} an object extending a jQuery promise.
		 *
		 * @public
		 * @sap-restricted
		 */
		TableAssertions.prototype.iCheckSortOrder = function(vColumnIdentifier, sSortOrder, bCheckPersonalization) {
			var aArguments = Utils.parseArguments([String, String, Boolean], arguments);
			sSortOrder = aArguments[1] || SortOrder.Ascending;
			bCheckPersonalization = aArguments[2];

			var sDescription = Utils.formatMessage(
				"Checking column '{1}' on table '{0}' to be sorted '{2}'",
				this.getIdentifier(),
				vColumnIdentifier,
				sSortOrder
			);

			// either check via sorting dialog...
			if (bCheckPersonalization) {
				var mState = {};
				if (sSortOrder === SortOrder.None) {
					mState.selected = false;
				} else {
					mState.selected = true;
					mState.content = { selectedKey: sSortOrder === SortOrder.Descending ? "true" : "false" };
				}
				return this.columnSorting(vColumnIdentifier, mState, undefined, sDescription);
			}

			// ... or check the columns itself (default)
			var mColumnDefinition = {};
			mColumnDefinition[vColumnIdentifier] = {
				sortOrder: sSortOrder
			};
			return this.prepareResult(
				this.getBuilder()
					.hasColumns(mColumnDefinition)
					.description(sDescription)
					.execute()
			);
		};
		return TableAssertions;
	}
);