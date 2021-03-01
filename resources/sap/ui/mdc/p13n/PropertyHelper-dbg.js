/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"../util/PropertyHelper",
	"sap/base/util/merge"
], function(
	PropertyHelperBase,
	merge
) {
	"use strict";

	/**
	 * Constructor for a new p13n property helper.
	 *
	 * @param {object[]} aProperties The properties to process in this helper
	 * @param {sap.ui.base.ManagedObject} [oParent] A reference to an instance that will act as the parent of this helper
	 *
	 * @class
	 * @extends sap.ui.mdc.util.PropertyHelper
	 *
	 * @author SAP SE
	 * @version 1.86.3
	 *
	 * @private
	 * @experimental
	 * @since 1.85
	 * @alias sap.ui.mdc.p13n.PropertyHelper
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var PropertyHelper = PropertyHelperBase.extend("sap.ui.mdc.p13n.PropertyHelper");

	/**
	 * This helper does not validate properties.
	 *
	 * @override
	 */
	PropertyHelper.prototype.validateProperties = function() {};

	return PropertyHelper;
});