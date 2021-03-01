sap.ui.define(
	[],
	function() {
		"use strict";

		/**
		 * Available values for dialog types.
		 *
		 * @enum {string}
		 * @private
		 */
		return {
			/**
			 * A simple dialog supporting base checks and actions as Confirm and Cancel.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Confirmation: "Confirmation",
			/**
			 * A ValueHelp dialog.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			ValueHelp: "ValueHelp",
			/**
			 * A message dialog.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Message: "Message",
			/**
			 * A dialog showing an error message.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Error: "Error",
			/**
			 * A default action parameter dialog.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Action: "Action"
		};
	},
	true
);
