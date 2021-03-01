sap.ui.define(["sap/fe/macros/MacroMetadata", "sap/fe/core/helpers/BindingExpression"], function (MacroMetadata, BindingExpression) {
  "use strict";

  var compileBinding = BindingExpression.compileBinding;
  var resolveBindingString = BindingExpression.resolveBindingString;
  var equal = BindingExpression.equal;
  var ifElse = BindingExpression.ifElse;

  /*!
   * ${copyright}
   */

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
  var Field = MacroMetadata.extend("sap.fe.macros.Field", {
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
    create: function (oProps) {
      oProps.editModeExpression = compileBinding(ifElse(equal(resolveBindingString(oProps.editable, "boolean"), true), "Editable", "Display"));
      return oProps;
    }
  });
  return Field;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpZWxkLm1ldGFkYXRhLnRzIl0sIm5hbWVzIjpbIkZpZWxkIiwiTWFjcm9NZXRhZGF0YSIsImV4dGVuZCIsIm5hbWUiLCJuYW1lc3BhY2UiLCJmcmFnbWVudCIsIm1ldGFkYXRhIiwic3RlcmVvdHlwZSIsInByb3BlcnRpZXMiLCJtZXRhUGF0aCIsInR5cGUiLCJyZXF1aXJlZCIsImNvbnRleHRQYXRoIiwiaWQiLCJlZGl0YWJsZSIsImV2ZW50cyIsIm9uQ2hhbmdlIiwiY3JlYXRlIiwib1Byb3BzIiwiZWRpdE1vZGVFeHByZXNzaW9uIiwiY29tcGlsZUJpbmRpbmciLCJpZkVsc2UiLCJlcXVhbCIsInJlc29sdmVCaW5kaW5nU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBT0E7Ozs7Ozs7Ozs7QUFVQSxNQUFNQSxLQUFLLEdBQUdDLGFBQWEsQ0FBQ0MsTUFBZCxDQUFxQixxQkFBckIsRUFBNEM7QUFDekQ7OztBQUdBQyxJQUFBQSxJQUFJLEVBQUUsT0FKbUQ7O0FBS3pEOzs7QUFHQUMsSUFBQUEsU0FBUyxFQUFFLGVBUjhDOztBQVN6RDs7O0FBR0FDLElBQUFBLFFBQVEsRUFBRSxxQkFaK0M7O0FBY3pEOzs7QUFHQUMsSUFBQUEsUUFBUSxFQUFFO0FBQ1Q7OztBQUdBQyxNQUFBQSxVQUFVLEVBQUUsVUFKSDs7QUFLVDs7O0FBR0FDLE1BQUFBLFVBQVUsRUFBRTtBQUNYOzs7O0FBSUFDLFFBQUFBLFFBQVEsRUFBRTtBQUNUQyxVQUFBQSxJQUFJLEVBQUUsc0JBREc7QUFFVEMsVUFBQUEsUUFBUSxFQUFFO0FBRkQsU0FMQzs7QUFTWDs7O0FBR0FDLFFBQUFBLFdBQVcsRUFBRTtBQUNaRixVQUFBQSxJQUFJLEVBQUUsc0JBRE07QUFFWkMsVUFBQUEsUUFBUSxFQUFFO0FBRkUsU0FaRjs7QUFnQlg7OztBQUdBRSxRQUFBQSxFQUFFLEVBQUU7QUFDSEgsVUFBQUEsSUFBSSxFQUFFLFFBREg7QUFFSEMsVUFBQUEsUUFBUSxFQUFFO0FBRlAsU0FuQk87O0FBdUJYOzs7QUFHQUcsUUFBQUEsUUFBUSxFQUFFO0FBQ1RKLFVBQUFBLElBQUksRUFBRSxTQURHO0FBRVRDLFVBQUFBLFFBQVEsRUFBRTtBQUZEO0FBMUJDLE9BUkg7QUF1Q1RJLE1BQUFBLE1BQU0sRUFBRTtBQUNQOzs7QUFHQUMsUUFBQUEsUUFBUSxFQUFFO0FBQ1ROLFVBQUFBLElBQUksRUFBRTtBQURHO0FBSkg7QUF2Q0MsS0FqQitDO0FBaUV6RE8sSUFBQUEsTUFBTSxFQUFFLFVBQVNDLE1BQVQsRUFBc0I7QUFDN0JBLE1BQUFBLE1BQU0sQ0FBQ0Msa0JBQVAsR0FBNEJDLGNBQWMsQ0FDekNDLE1BQU0sQ0FBQ0MsS0FBSyxDQUFDQyxvQkFBb0IsQ0FBQ0wsTUFBTSxDQUFDSixRQUFSLEVBQWtCLFNBQWxCLENBQXJCLEVBQW1ELElBQW5ELENBQU4sRUFBZ0UsVUFBaEUsRUFBNEUsU0FBNUUsQ0FEbUMsQ0FBMUM7QUFHQSxhQUFPSSxNQUFQO0FBQ0E7QUF0RXdELEdBQTVDLENBQWQ7U0F5RWVsQixLIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqICR7Y29weXJpZ2h0fVxuICovXG5cbmltcG9ydCB7IE1hY3JvTWV0YWRhdGEgfSBmcm9tIFwic2FwL2ZlL21hY3Jvc1wiO1xuaW1wb3J0IHsgaWZFbHNlLCBlcXVhbCwgcmVzb2x2ZUJpbmRpbmdTdHJpbmcsIGNvbXBpbGVCaW5kaW5nIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ0V4cHJlc3Npb25cIjtcblxuLyoqXG4gKiBAY2xhc3NkZXNjXG4gKiBDb250ZW50IG9mIGEgRmllbGRcbiAqXG4gKiBAY2xhc3Mgc2FwLmZlLm1hY3Jvcy5GaWVsZFxuICogQGhpZGVjb25zdHJ1Y3RvclxuICogQHByaXZhdGVcbiAqIEBzYXAtcmVzdHJpY3RlZFxuICogQGV4cGVyaW1lbnRhbFxuICovXG5jb25zdCBGaWVsZCA9IE1hY3JvTWV0YWRhdGEuZXh0ZW5kKFwic2FwLmZlLm1hY3Jvcy5GaWVsZFwiLCB7XG5cdC8qKlxuXHQgKiBOYW1lXG5cdCAqL1xuXHRuYW1lOiBcIkZpZWxkXCIsXG5cdC8qKlxuXHQgKiBOYW1lc3BhY2Vcblx0ICovXG5cdG5hbWVzcGFjZTogXCJzYXAuZmUubWFjcm9zXCIsXG5cdC8qKlxuXHQgKiBGcmFnbWVudCBzb3VyY2Vcblx0ICovXG5cdGZyYWdtZW50OiBcInNhcC5mZS5tYWNyb3MuRmllbGRcIixcblxuXHQvKipcblx0ICogTWV0YWRhdGFcblx0ICovXG5cdG1ldGFkYXRhOiB7XG5cdFx0LyoqXG5cdFx0ICogRGVmaW5lIG1hY3JvIHN0ZXJlb3R5cGUgZm9yIGRvY3VtZW50YXRpb24gcHVycG9zZVxuXHRcdCAqL1xuXHRcdHN0ZXJlb3R5cGU6IFwieG1sbWFjcm9cIixcblx0XHQvKipcblx0XHQgKiBQcm9wZXJ0aWVzLlxuXHRcdCAqL1xuXHRcdHByb3BlcnRpZXM6IHtcblx0XHRcdC8qKlxuXHRcdFx0ICogTWV0YSBQYXRoIHRvIHRoZSBmaWVsZFxuXHRcdFx0ICogQ291bGQgYmUgZWl0aGVyIGFuIGFic29sdXRlIHBhdGggb3IgcmVsYXRpdmUgdG8gdGhlIGNvbnRleHQgcGF0aFxuXHRcdFx0ICovXG5cdFx0XHRtZXRhUGF0aDoge1xuXHRcdFx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5Db250ZXh0XCIsXG5cdFx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBDb250ZXh0IHBhdGggb2YgdGhlIGZpZWxkXG5cdFx0XHQgKi9cblx0XHRcdGNvbnRleHRQYXRoOiB7XG5cdFx0XHRcdHR5cGU6IFwic2FwLnVpLm1vZGVsLkNvbnRleHRcIixcblx0XHRcdFx0cmVxdWlyZWQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHQvKipcblx0XHRcdCAqIElucHV0IEZpZWxkIElEXG5cdFx0XHQgKi9cblx0XHRcdGlkOiB7XG5cdFx0XHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBFZGl0IE1vZGVcblx0XHRcdCAqL1xuXHRcdFx0ZWRpdGFibGU6IHtcblx0XHRcdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0XHRcdHJlcXVpcmVkOiBmYWxzZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZXZlbnRzOiB7XG5cdFx0XHQvKipcblx0XHRcdCAqIEV2ZW50IGhhbmRsZXIgZm9yIGNoYW5nZSBldmVudCBUT0RPOiB3ZSBuZWVkIHRvIHdyYXAgdGhpcywganVzdCBQb0MgdmVyc2lvblxuXHRcdFx0ICovXG5cdFx0XHRvbkNoYW5nZToge1xuXHRcdFx0XHR0eXBlOiBcImZ1bmN0aW9uXCJcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGNyZWF0ZTogZnVuY3Rpb24ob1Byb3BzOiBhbnkpIHtcblx0XHRvUHJvcHMuZWRpdE1vZGVFeHByZXNzaW9uID0gY29tcGlsZUJpbmRpbmcoXG5cdFx0XHRpZkVsc2UoZXF1YWwocmVzb2x2ZUJpbmRpbmdTdHJpbmcob1Byb3BzLmVkaXRhYmxlLCBcImJvb2xlYW5cIiksIHRydWUpLCBcIkVkaXRhYmxlXCIsIFwiRGlzcGxheVwiKVxuXHRcdCk7XG5cdFx0cmV0dXJuIG9Qcm9wcztcblx0fVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEZpZWxkO1xuIl19