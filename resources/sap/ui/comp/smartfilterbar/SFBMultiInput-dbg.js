/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */

// Provides sap.ui.comp.smartfilterbar.SFBMultiInput
sap.ui.define([
	"sap/m/MultiInput",
	"sap/m/MultiInputRenderer"
	],
function (
	MultiInput,
	MultiInputRenderer
) {
	"use strict";

	/**
	 * Constructor for a new <code>SFBMultiInput</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Private control used by the <code>SmartFilterBar</code> control.
	 *
	 * @extends sap.m.MultiInput
	 *
	 * @author SAP SE
	 * @version 1.86.3
	 *
	 * @constructor
	 * @private
	 * @since 1.73
	 * @alias sap.ui.comp.smartfilterbar.SFBMultiInput
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SFBMultiInput = MultiInput.extend("sap.ui.comp.smartfilterbar.SFBMultiInput", {
		metadata: {
			library: "sap.ui.comp"
		},
		renderer: MultiInputRenderer
	});

	SFBMultiInput.prototype.setTokens = function (aTokens) {
		MultiInput.prototype.setTokens.apply(this, arguments);
		this._pendingAutoTokenGeneration = true;
		this._getFilterProvider()._tokenUpdate({
			control: this,
			fieldViewMetadata: this._getFieldViewMetadata()
		});
		this._pendingAutoTokenGeneration = false;
	};

	SFBMultiInput.prototype._setFilterProvider = function (oFilterProvider) {
		this.oFilterProvider = oFilterProvider;
	};

	SFBMultiInput.prototype._getFilterProvider = function () {
		return this.oFilterProvider;
	};

	SFBMultiInput.prototype._setFieldViewMetadata = function (oFieldViewMetadata) {
		this.oFieldViewMetadata = oFieldViewMetadata;
	};

	SFBMultiInput.prototype._getFieldViewMetadata = function () {
		return this.oFieldViewMetadata;
	};

	SFBMultiInput.prototype.onBeforeRendering = function () {
		MultiInput.prototype.onBeforeRendering.apply(this, arguments);

		// Try to create a token from a possible (IN) parameter coming from the binding
		// In this phase the value is coming from the binding of the control.
		if (this.getValue()) {
			this._pendingAutoTokenGeneration = true;
			this._validateCurrentText(true);
			this._pendingAutoTokenGeneration = false;
		}
	};

	return SFBMultiInput;

});
