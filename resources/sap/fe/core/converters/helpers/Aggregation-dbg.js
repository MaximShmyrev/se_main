sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * helper class for Aggregation annotations.
   */
  var AggregationHelper = /*#__PURE__*/function () {
    /**
     * Creates a helper for a specific entity type and a converter context.
     *
     * @param entityType the entity type
     * @param converterContext the context
     */
    function AggregationHelper(entityType, converterContext) {
      var _this$_entityType$ann, _this$_entityType$ann2, _this$_converterConte, _this$_converterConte2, _this$_entityType$ann3, _this$_entityType$ann4, _this$_entityType$ann5, _this$_converterConte3, _this$_converterConte4, _this$_converterConte5;

      _classCallCheck(this, AggregationHelper);

      this._entityType = entityType;
      this._converterContext = converterContext;
      this._bApplySupported = ((_this$_entityType$ann = this._entityType.annotations) === null || _this$_entityType$ann === void 0 ? void 0 : (_this$_entityType$ann2 = _this$_entityType$ann.Aggregation) === null || _this$_entityType$ann2 === void 0 ? void 0 : _this$_entityType$ann2.ApplySupported) || ((_this$_converterConte = this._converterContext.getEntityContainer().annotations) === null || _this$_converterConte === void 0 ? void 0 : (_this$_converterConte2 = _this$_converterConte.Aggregation) === null || _this$_converterConte2 === void 0 ? void 0 : _this$_converterConte2.ApplySupported) ? true : false;
      this._bHasPropertyRestrictions = ((_this$_entityType$ann3 = this._entityType.annotations) === null || _this$_entityType$ann3 === void 0 ? void 0 : (_this$_entityType$ann4 = _this$_entityType$ann3.Aggregation) === null || _this$_entityType$ann4 === void 0 ? void 0 : (_this$_entityType$ann5 = _this$_entityType$ann4.ApplySupported) === null || _this$_entityType$ann5 === void 0 ? void 0 : _this$_entityType$ann5.PropertyRestrictions) || ((_this$_converterConte3 = this._converterContext.getEntityContainer().annotations) === null || _this$_converterConte3 === void 0 ? void 0 : (_this$_converterConte4 = _this$_converterConte3.Aggregation) === null || _this$_converterConte4 === void 0 ? void 0 : (_this$_converterConte5 = _this$_converterConte4.ApplySupported) === null || _this$_converterConte5 === void 0 ? void 0 : _this$_converterConte5.PropertyRestrictions) ? true : false;
    }
    /**
     * Checks if a property is groupable.
     *
     * @param property the propoerty to check
     * @returns undefined if the entity doesn't support analytical queries, true or false otherwise
     */


    _exports.AggregationHelper = AggregationHelper;

    _createClass(AggregationHelper, [{
      key: "isPropertyGroupable",
      value: function isPropertyGroupable(property) {
        if (!this._bApplySupported) {
          return undefined;
        } else {
          var _property$annotations, _property$annotations2;

          return !this._bHasPropertyRestrictions || ((_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.Aggregation) === null || _property$annotations2 === void 0 ? void 0 : _property$annotations2.Groupable) === true;
        }
      }
    }]);

    return AggregationHelper;
  }();

  _exports.AggregationHelper = AggregationHelper;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFnZ3JlZ2F0aW9uLnRzIl0sIm5hbWVzIjpbIkFnZ3JlZ2F0aW9uSGVscGVyIiwiZW50aXR5VHlwZSIsImNvbnZlcnRlckNvbnRleHQiLCJfZW50aXR5VHlwZSIsIl9jb252ZXJ0ZXJDb250ZXh0IiwiX2JBcHBseVN1cHBvcnRlZCIsImFubm90YXRpb25zIiwiQWdncmVnYXRpb24iLCJBcHBseVN1cHBvcnRlZCIsImdldEVudGl0eUNvbnRhaW5lciIsIl9iSGFzUHJvcGVydHlSZXN0cmljdGlvbnMiLCJQcm9wZXJ0eVJlc3RyaWN0aW9ucyIsInByb3BlcnR5IiwidW5kZWZpbmVkIiwiR3JvdXBhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUdBOzs7TUFHYUEsaUI7QUFNWjs7Ozs7O0FBTUEsK0JBQVlDLFVBQVosRUFBb0NDLGdCQUFwQyxFQUF3RTtBQUFBOztBQUFBOztBQUN2RSxXQUFLQyxXQUFMLEdBQW1CRixVQUFuQjtBQUNBLFdBQUtHLGlCQUFMLEdBQXlCRixnQkFBekI7QUFFQSxXQUFLRyxnQkFBTCxHQUNDLCtCQUFLRixXQUFMLENBQWlCRyxXQUFqQiwwR0FBOEJDLFdBQTlCLGtGQUEyQ0MsY0FBM0MsK0JBQ0EsS0FBS0osaUJBQUwsQ0FBdUJLLGtCQUF2QixHQUE0Q0gsV0FENUMsb0ZBQ0Esc0JBQXlEQyxXQUR6RCwyREFDQSx1QkFBc0VDLGNBRHRFLElBRUcsSUFGSCxHQUdHLEtBSko7QUFNQSxXQUFLRSx5QkFBTCxHQUNDLGdDQUFLUCxXQUFMLENBQWlCRyxXQUFqQiw0R0FBOEJDLFdBQTlCLDRHQUEyQ0MsY0FBM0Msa0ZBQTJERyxvQkFBM0QsZ0NBQ0EsS0FBS1AsaUJBQUwsQ0FBdUJLLGtCQUF2QixHQUE0Q0gsV0FENUMscUZBQ0EsdUJBQXlEQyxXQUR6RCxxRkFDQSx1QkFBc0VDLGNBRHRFLDJEQUNBLHVCQUFzRkcsb0JBRHRGLElBRUcsSUFGSCxHQUdHLEtBSko7QUFLQTtBQUVEOzs7Ozs7Ozs7Ozs7MENBTTJCQyxRLEVBQXlDO0FBQ25FLFlBQUksQ0FBQyxLQUFLUCxnQkFBVixFQUE0QjtBQUMzQixpQkFBT1EsU0FBUDtBQUNBLFNBRkQsTUFFTztBQUFBOztBQUNOLGlCQUFPLENBQUMsS0FBS0gseUJBQU4sSUFBbUMsMEJBQUFFLFFBQVEsQ0FBQ04sV0FBVCwwR0FBc0JDLFdBQXRCLGtGQUFtQ08sU0FBbkMsTUFBaUQsSUFBM0Y7QUFDQTtBQUNEIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbnRpdHlUeXBlLCBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQgeyBDb252ZXJ0ZXJDb250ZXh0IH0gZnJvbSBcIi4uL3RlbXBsYXRlcy9CYXNlQ29udmVydGVyXCI7XG5cbi8qKlxuICogaGVscGVyIGNsYXNzIGZvciBBZ2dyZWdhdGlvbiBhbm5vdGF0aW9ucy5cbiAqL1xuZXhwb3J0IGNsYXNzIEFnZ3JlZ2F0aW9uSGVscGVyIHtcblx0X2VudGl0eVR5cGU6IEVudGl0eVR5cGU7XG5cdF9jb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0O1xuXHRfYkFwcGx5U3VwcG9ydGVkOiBib29sZWFuO1xuXHRfYkhhc1Byb3BlcnR5UmVzdHJpY3Rpb25zOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgaGVscGVyIGZvciBhIHNwZWNpZmljIGVudGl0eSB0eXBlIGFuZCBhIGNvbnZlcnRlciBjb250ZXh0LlxuXHQgKlxuXHQgKiBAcGFyYW0gZW50aXR5VHlwZSB0aGUgZW50aXR5IHR5cGVcblx0ICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgdGhlIGNvbnRleHRcblx0ICovXG5cdGNvbnN0cnVjdG9yKGVudGl0eVR5cGU6IEVudGl0eVR5cGUsIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpIHtcblx0XHR0aGlzLl9lbnRpdHlUeXBlID0gZW50aXR5VHlwZTtcblx0XHR0aGlzLl9jb252ZXJ0ZXJDb250ZXh0ID0gY29udmVydGVyQ29udGV4dDtcblxuXHRcdHRoaXMuX2JBcHBseVN1cHBvcnRlZCA9XG5cdFx0XHR0aGlzLl9lbnRpdHlUeXBlLmFubm90YXRpb25zPy5BZ2dyZWdhdGlvbj8uQXBwbHlTdXBwb3J0ZWQgfHxcblx0XHRcdHRoaXMuX2NvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5Q29udGFpbmVyKCkuYW5ub3RhdGlvbnM/LkFnZ3JlZ2F0aW9uPy5BcHBseVN1cHBvcnRlZFxuXHRcdFx0XHQ/IHRydWVcblx0XHRcdFx0OiBmYWxzZTtcblxuXHRcdHRoaXMuX2JIYXNQcm9wZXJ0eVJlc3RyaWN0aW9ucyA9XG5cdFx0XHR0aGlzLl9lbnRpdHlUeXBlLmFubm90YXRpb25zPy5BZ2dyZWdhdGlvbj8uQXBwbHlTdXBwb3J0ZWQ/LlByb3BlcnR5UmVzdHJpY3Rpb25zIHx8XG5cdFx0XHR0aGlzLl9jb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eUNvbnRhaW5lcigpLmFubm90YXRpb25zPy5BZ2dyZWdhdGlvbj8uQXBwbHlTdXBwb3J0ZWQ/LlByb3BlcnR5UmVzdHJpY3Rpb25zXG5cdFx0XHRcdD8gdHJ1ZVxuXHRcdFx0XHQ6IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiBhIHByb3BlcnR5IGlzIGdyb3VwYWJsZS5cblx0ICpcblx0ICogQHBhcmFtIHByb3BlcnR5IHRoZSBwcm9wb2VydHkgdG8gY2hlY2tcblx0ICogQHJldHVybnMgdW5kZWZpbmVkIGlmIHRoZSBlbnRpdHkgZG9lc24ndCBzdXBwb3J0IGFuYWx5dGljYWwgcXVlcmllcywgdHJ1ZSBvciBmYWxzZSBvdGhlcndpc2Vcblx0ICovXG5cdHB1YmxpYyBpc1Byb3BlcnR5R3JvdXBhYmxlKHByb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuXHRcdGlmICghdGhpcy5fYkFwcGx5U3VwcG9ydGVkKSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gIXRoaXMuX2JIYXNQcm9wZXJ0eVJlc3RyaWN0aW9ucyB8fCBwcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQWdncmVnYXRpb24/Lkdyb3VwYWJsZSA9PT0gdHJ1ZTtcblx0XHR9XG5cdH1cbn1cbiJdfQ==