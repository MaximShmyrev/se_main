/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

import { MacroMetadata } from "sap/fe/macros";
import { ifElse, equal, resolveBindingString, compileBinding } from "sap/fe/core/helpers/BindingExpression";

/**
 * @classdesc
 * Content of a Field
 *
 * @class sap.fe.macros.Field
 * @hideconstructor
 * @private
 * @sap-restricted
 * @experimental
 */
const Field = MacroMetadata.extend("sap.fe.macros.Field", {
	/**
	 * Name
	 */
	name: "Field",
	/**
	 * Namespace
	 */
	namespace: "sap.fe.macros",
	/**
	 * Fragment source
	 */
	fragment: "sap.fe.macros.Field",

	/**
	 * Metadata
	 */
	metadata: {
		/**
		 * Define macro stereotype for documentation purpose
		 */
		stereotype: "xmlmacro",
		/**
		 * Properties.
		 */
		properties: {
			/**
			 * Meta Path to the field
			 * Could be either an absolute path or relative to the context path
			 */
			metaPath: {
				type: "sap.ui.model.Context",
				required: true
			},
			/**
			 * Context path of the field
			 */
			contextPath: {
				type: "sap.ui.model.Context",
				required: true
			},
			/**
			 * Input Field ID
			 */
			id: {
				type: "string",
				required: true
			},
			/**
			 * Edit Mode
			 */
			editable: {
				type: "boolean",
				required: false
			}
		},
		events: {
			/**
			 * Event handler for change event TODO: we need to wrap this, just PoC version
			 */
			onChange: {
				type: "function"
			}
		}
	},
	create: function(oProps: any) {
		oProps.editModeExpression = compileBinding(
			ifElse(equal(resolveBindingString(oProps.editable, "boolean"), true), "Editable", "Display")
		);
		return oProps;
	}
});

export default Field;
