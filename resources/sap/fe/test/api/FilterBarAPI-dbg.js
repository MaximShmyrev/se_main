sap.ui.define(
	[
		"./BaseAPI",
		"sap/fe/test/Utils",
		"sap/ui/test/OpaBuilder",
		"sap/ui/test/actions/Action",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/MdcFilterBarBuilder",
		"sap/fe/test/builder/MdcFilterFieldBuilder",
		"sap/fe/macros/filter/DraftEditState"
	],
	function(BaseAPI, Utils, OpaBuilder, Action, FEBuilder, FilterBarBuilder, FilterFieldBuilder, EditState) {
		"use strict";

		/**
		 * A filter field identifier
		 *
		 * @typedef {object} FilterFieldIdentifier
		 * @property {string} property the name of the property
		 *
		 * @name sap.fe.test.api.FilterFieldIdentifier
		 * @private
		 */

		/**
		 * Constructor.
		 * @param {sap.fe.test.builder.FilterBarBuilder} oFilterBarBuilder the filter bar builder instance to operate on
		 * @param {string} [vFilterBarDescription] the filter bar description (optional), used to log message
		 * @returns {sap.fe.test.api.FilterBarAPI} the instance
		 * @class
		 * @public
		 * @sap-restricted
		 */
		var FilterBarAPI = function(oFilterBarBuilder, vFilterBarDescription) {
			if (!Utils.isOfType(oFilterBarBuilder, FilterBarBuilder)) {
				throw new Error("oFilterBarBuilder parameter must be a FilterBarBuilder instance");
			}
			return BaseAPI.call(this, oFilterBarBuilder, vFilterBarDescription);
		};
		FilterBarAPI.prototype = Object.create(BaseAPI.prototype);
		FilterBarAPI.prototype.constructor = FilterBarAPI;

		/**
		 * Available values for editing states.
		 *
		 * @enum {string}
		 * @public
		 * @sap-restricted
		 */
		FilterBarAPI.EditState = {
			/**
			 * All.
			 * @constant
			 * @type {string}
			 * @public
			 * @sap-restricted
			 */
			All: EditState.ALL.id,
			/**
			 * Unchanged.
			 * @constant
			 * @type {string}
			 * @public
			 * @sap-restricted
			 */
			Unchanged: EditState.UNCHANGED.id,
			/**
			 * Own Draft.
			 * @constant
			 * @type {string}
			 * @public
			 * @sap-restricted
			 */
			OwnDraft: EditState.OWN_DRAFT.id,
			/**
			 * Locked by Another User.
			 * @constant
			 * @type {string}
			 * @public
			 * @sap-restricted
			 */
			Locked: EditState.LOCKED.id,
			/**
			 * Unsaved Changes by Another User.
			 * @constant
			 * @type {string}
			 * @public
			 * @sap-restricted
			 */
			UnsavedChanges: EditState.UNSAVED_CHANGES.id
		};

		/**
		 * Retrieve a filter field by its identifier.
		 *
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier Identifier for field in the filter bar.
		 * If the identifier is a string, the label of the filter field is validated.
		 * Should not be used for testing against productive backend service.
		 * @returns {sap.fe.test.builder.FilterFieldBuilder} the FieldBuilder instance
		 *
		 * @public
		 * @sap-restricted
		 */
		FilterBarAPI.prototype.createFilterFieldBuilder = function(vFieldIdentifier) {
			var oFilterBarBuilder = this.getBuilder(),
				vFieldMatcher;

			if (Utils.isOfType(vFieldIdentifier, String)) {
				vFieldMatcher = OpaBuilder.Matchers.properties({ label: vFieldIdentifier });
			} else {
				vFieldMatcher = FEBuilder.Matchers.id(
					RegExp(Utils.formatMessage("::FilterField::{0}$", vFieldIdentifier.property.replace(/\/|\*\//g, "::")))
				);
			}
			oFilterBarBuilder.hasField(vFieldMatcher, true);

			return FilterFieldBuilder.create(this.getOpaInstance()).options(oFilterBarBuilder.build());
		};

		/**
		 * Opens the filter bar adaptation. It can be used in action as well as assertion chain.
		 *
		 * @returns {object}
		 * @public
		 * @sap-restricted
		 */
		FilterBarAPI.prototype.iOpenFilterAdaptation = function() {
			var oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder
					.doOpenSettings()
					.success(
						FEBuilder.create(this.getOpaInstance())
							.hasType("sap.m.Panel")
							.isDialogElement()
							// to ensure all filter fields are visible, expand all filter groups (panels) if not yet done
							.doConditional(function(oPanel) {
								return !oPanel.getExpanded();
							}, OpaBuilder.Actions.press("expandButton"))
					)
					.description(Utils.formatMessage("Opening the filter bar adaptation dialog for '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Confirm the filter bar adaptation. It can be used in action as well as assertion chain.
		 *
		 * @returns {object}
		 * @public
		 * @sap-restricted
		 */
		FilterBarAPI.prototype.iConfirmFilterAdaptation = function() {
			return this.prepareResult(
				FilterBarBuilder.createAdaptationDialogBuilder(this.getOpaInstance())
					.doPressFooterButton(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "p13nDialog.OK"))
					.description(Utils.formatMessage("Closing the filter bar adaptation dialog for '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Helper method to adapt filter fields. If no actions are given, this function can be used for checking only.
		 * During execution it checks for an already open adaptation popover. If it does not exist, it is opened before
		 * the check/interaction of the filter fields, and closed directly afterwards.
		 *
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier the field identifier
		 * @param {object} [mState] the state of the adaptation field. The following states are supported:
		 * <code><pre>
		 * 	{
		 * 		selected: true|false,
		 * 		isFiltered: true|false
		 * 	}
		 * </pre></code>
		 * @param {Function|Array|sap.ui.test.actions.Action} [vActions] actions to be executed on found adaptation field
		 * @param {string} sDescription the description of the check or adaptation
		 * @returns {*}
		 *
		 * @sap-restricted
		 */
		FilterBarAPI.prototype.filterFieldAdaptation = function(vFieldIdentifier, mState, vActions, sDescription) {
			var aArguments = Utils.parseArguments([[String, Object], Object, [Function, Array, Action], String], arguments),
				oBuilder = FEBuilder.create(this.getOpaInstance()),
				bPopoverOpen,
				oAdaptColumnBuilder = FEBuilder.create(this.getOpaInstance())
					// NOTE: when using List instead of Group layout, the type is sap.m.ColumnListItem (consider this when the switching layout option becomes available)
					.hasType("sap.m.CustomListItem")
					.isDialogElement(),
				oAdaptationDialogBuilder = FilterBarBuilder.createAdaptationDialogBuilder(this.getOpaInstance());

			vFieldIdentifier = aArguments[0];
			if (Utils.isOfType(vFieldIdentifier, String)) {
				oAdaptColumnBuilder.has(OpaBuilder.Matchers.bindingProperties(BaseAPI.MDC_P13N_MODEL, { label: vFieldIdentifier }));
			} else {
				oAdaptColumnBuilder.has(OpaBuilder.Matchers.bindingProperties(BaseAPI.MDC_P13N_MODEL, { name: vFieldIdentifier.property }));
			}

			mState = aArguments[1];
			var bCheckForNotVisible = mState && mState.visible === false;
			if (!bCheckForNotVisible && !Utils.isOfType(mState, [null, undefined])) {
				oAdaptColumnBuilder.has(OpaBuilder.Matchers.bindingProperties(BaseAPI.MDC_P13N_MODEL, mState));
			}

			vActions = aArguments[2];
			if (!Utils.isOfType(vActions, [null, undefined])) {
				oAdaptationDialogBuilder.do(vActions);
			}

			sDescription = aArguments[3];
			return this.prepareResult(
				oBuilder
					.success(
						function() {
							bPopoverOpen = FEBuilder.controlsExist(oAdaptationDialogBuilder);

							if (!bPopoverOpen) {
								this.iOpenFilterAdaptation();
							}

							if (!bPopoverOpen) {
								oAdaptationDialogBuilder.success(this.iConfirmFilterAdaptation.bind(this));
							}

							return oAdaptationDialogBuilder
								.has(OpaBuilder.Matchers.children(oAdaptColumnBuilder))
								.has(function(aFoundAdaptationColumns) {
									if (bCheckForNotVisible) {
										return aFoundAdaptationColumns.length === 0;
									}
									return FEBuilder.Matchers.atIndex(0)(aFoundAdaptationColumns);
								})
								.description(sDescription)
								.execute();
						}.bind(this)
					)
					.execute()
			);
		};

		return FilterBarAPI;
	}
);
