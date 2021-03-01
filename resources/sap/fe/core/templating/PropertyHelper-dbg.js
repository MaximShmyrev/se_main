sap.ui.define(["sap/fe/core/helpers/BindingExpression"], function (BindingExpression) {
  "use strict";

  var _exports = {};
  var or = BindingExpression.or;
  var equal = BindingExpression.equal;
  var annotationExpression = BindingExpression.annotationExpression;

  /**
   * Identify if the given property passed is a "Property" (has a _type).
   *
   * @param {Property} property a target property to evaluate
   * @returns {boolean} validate that property is a Property
   */
  function isProperty(property) {
    return property && property.hasOwnProperty("_type") && property._type === "Property";
  }
  /**
   * Check whether the property has the Core.Computed annotation or not.
   *
   * @param {Property} oProperty the target property
   * @returns {boolean} true if it's computed
   */


  _exports.isProperty = isProperty;

  var isComputed = function (oProperty) {
    var _oProperty$annotation, _oProperty$annotation2;

    return !!((_oProperty$annotation = oProperty.annotations) === null || _oProperty$annotation === void 0 ? void 0 : (_oProperty$annotation2 = _oProperty$annotation.Core) === null || _oProperty$annotation2 === void 0 ? void 0 : _oProperty$annotation2.Computed);
  };
  /**
   * Check whether the property has the Core.Immutable annotation or not.
   *
   * @param {Property} oProperty the target property
   * @returns {boolean} true if it's immutable
   */


  _exports.isComputed = isComputed;

  var isImmutable = function (oProperty) {
    var _oProperty$annotation3, _oProperty$annotation4;

    return !!((_oProperty$annotation3 = oProperty.annotations) === null || _oProperty$annotation3 === void 0 ? void 0 : (_oProperty$annotation4 = _oProperty$annotation3.Core) === null || _oProperty$annotation4 === void 0 ? void 0 : _oProperty$annotation4.Immutable);
  };
  /**
   * Check whether the property is a key or not.
   *
   * @param {Property} oProperty the target property
   * @returns {boolean} true if it's a key
   */


  _exports.isImmutable = isImmutable;

  var isKey = function (oProperty) {
    return !!oProperty.isKey;
  };
  /**
   * Checks whether the property has a date time or not.
   *
   * @param oProperty
   * @returns true if it is of type date / datetime / datetimeoffset
   */


  _exports.isKey = isKey;

  var hasDateType = function (oProperty) {
    return ["Edm.Date", "Edm.DateTime", "Edm.DateTimeOffset"].indexOf(oProperty.type) !== -1;
  };
  /**
   * Retrieve the label annotation.
   *
   * @param oProperty the target property
   * @returns the label string
   */


  _exports.hasDateType = hasDateType;

  var getLabel = function (oProperty) {
    var _oProperty$annotation5, _oProperty$annotation6, _oProperty$annotation7;

    return ((_oProperty$annotation5 = oProperty.annotations) === null || _oProperty$annotation5 === void 0 ? void 0 : (_oProperty$annotation6 = _oProperty$annotation5.Common) === null || _oProperty$annotation6 === void 0 ? void 0 : (_oProperty$annotation7 = _oProperty$annotation6.Label) === null || _oProperty$annotation7 === void 0 ? void 0 : _oProperty$annotation7.toString()) || "";
  };
  /**
   * Check whether the property has a semantic object defined or not.
   *
   * @param {Property} oProperty the target property
   * @returns {boolean} true if it has a semantic object
   */


  _exports.getLabel = getLabel;

  var hasSemanticObject = function (oProperty) {
    var _oProperty$annotation8, _oProperty$annotation9;

    return !!((_oProperty$annotation8 = oProperty.annotations) === null || _oProperty$annotation8 === void 0 ? void 0 : (_oProperty$annotation9 = _oProperty$annotation8.Common) === null || _oProperty$annotation9 === void 0 ? void 0 : _oProperty$annotation9.SemanticObject);
  };
  /**
   * Create the binding expression to check if the property is non editable or not.
   *
   * @param {Property} oProperty the target property
   * @returns {ExpressionOrPrimitive<boolean>} the binding expression resolving to a boolean being true if it's non editable
   */


  _exports.hasSemanticObject = hasSemanticObject;

  var isNonEditableExpression = function (oProperty) {
    return or(isReadOnlyExpression(oProperty), isDisabledExpression(oProperty));
  };
  /**
   * Create the binding expression to check if the property is read only or not.
   *
   * @param {Property} oProperty the target property
   * @returns {ExpressionOrPrimitive<boolean>} the binding expression resolving to a boolean being true if it's read only
   */


  _exports.isNonEditableExpression = isNonEditableExpression;

  var isReadOnlyExpression = function (oProperty) {
    var _oProperty$annotation10, _oProperty$annotation11;

    var oFieldControlValue = (_oProperty$annotation10 = oProperty.annotations) === null || _oProperty$annotation10 === void 0 ? void 0 : (_oProperty$annotation11 = _oProperty$annotation10.Common) === null || _oProperty$annotation11 === void 0 ? void 0 : _oProperty$annotation11.FieldControl;

    if (typeof oFieldControlValue === "object") {
      return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue), 1);
    }

    return oFieldControlValue === "Common.FieldControlType/ReadOnly";
  };
  /**
   * Create the binding expression to check if the property is read only or not.
   *
   * @param {Property} oProperty the target property
   * @returns {ExpressionOrPrimitive<boolean>} the binding expression resolving to a boolean being true if it's read only
   */


  _exports.isReadOnlyExpression = isReadOnlyExpression;

  var isRequiredExpression = function (oProperty) {
    var _oProperty$annotation12, _oProperty$annotation13;

    var oFieldControlValue = (_oProperty$annotation12 = oProperty.annotations) === null || _oProperty$annotation12 === void 0 ? void 0 : (_oProperty$annotation13 = _oProperty$annotation12.Common) === null || _oProperty$annotation13 === void 0 ? void 0 : _oProperty$annotation13.FieldControl;

    if (typeof oFieldControlValue === "object") {
      return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue), 7);
    }

    return oFieldControlValue === "Common.FieldControlType/Mandatory";
  };
  /**
   * Create the binding expression to check if the property is disabled or not.
   *
   * @param {Property} oProperty the target property
   * @returns {ExpressionOrPrimitive<boolean>} the binding expression resolving to a boolean being true if it's disabled
   */


  _exports.isRequiredExpression = isRequiredExpression;

  var isDisabledExpression = function (oProperty) {
    var _oProperty$annotation14, _oProperty$annotation15;

    var oFieldControlValue = (_oProperty$annotation14 = oProperty.annotations) === null || _oProperty$annotation14 === void 0 ? void 0 : (_oProperty$annotation15 = _oProperty$annotation14.Common) === null || _oProperty$annotation15 === void 0 ? void 0 : _oProperty$annotation15.FieldControl;

    if (typeof oFieldControlValue === "object") {
      return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue), 0);
    }

    return oFieldControlValue === "Common.FieldControlType/Inapplicable";
  };

  _exports.isDisabledExpression = isDisabledExpression;

  var isPathExpression = function (expression) {
    return !!expression && expression.type !== undefined && expression.type === "Path";
  };
  /**
   * Retrieves the associated unit property for that property if it exists.
   *
   * @param {Property} oProperty the target property
   * @returns {Property | undefined} the unit property if it exists
   */


  _exports.isPathExpression = isPathExpression;

  var getAssociatedUnitProperty = function (oProperty) {
    var _oProperty$annotation16, _oProperty$annotation17, _oProperty$annotation18, _oProperty$annotation19;

    return isPathExpression((_oProperty$annotation16 = oProperty.annotations) === null || _oProperty$annotation16 === void 0 ? void 0 : (_oProperty$annotation17 = _oProperty$annotation16.Measures) === null || _oProperty$annotation17 === void 0 ? void 0 : _oProperty$annotation17.Unit) ? (_oProperty$annotation18 = oProperty.annotations) === null || _oProperty$annotation18 === void 0 ? void 0 : (_oProperty$annotation19 = _oProperty$annotation18.Measures) === null || _oProperty$annotation19 === void 0 ? void 0 : _oProperty$annotation19.Unit.$target : undefined;
  };
  /**
   * Retrieves the associated currency property for that property if it exists.
   *
   * @param {Property} oProperty the target property
   * @returns {Property | undefined} the unit property if it exists
   */


  _exports.getAssociatedUnitProperty = getAssociatedUnitProperty;

  var getAssociatedCurrencyProperty = function (oProperty) {
    var _oProperty$annotation20, _oProperty$annotation21, _oProperty$annotation22, _oProperty$annotation23;

    return isPathExpression((_oProperty$annotation20 = oProperty.annotations) === null || _oProperty$annotation20 === void 0 ? void 0 : (_oProperty$annotation21 = _oProperty$annotation20.Measures) === null || _oProperty$annotation21 === void 0 ? void 0 : _oProperty$annotation21.ISOCurrency) ? (_oProperty$annotation22 = oProperty.annotations) === null || _oProperty$annotation22 === void 0 ? void 0 : (_oProperty$annotation23 = _oProperty$annotation22.Measures) === null || _oProperty$annotation23 === void 0 ? void 0 : _oProperty$annotation23.ISOCurrency.$target : undefined;
  };
  /**
   * Check whether the property has a value help annotation defined or not.
   *
   * @param {Property} oProperty the target property
   * @returns {boolean} true if it has a value help
   */


  _exports.getAssociatedCurrencyProperty = getAssociatedCurrencyProperty;

  var hasValueHelp = function (oProperty) {
    var _oProperty$annotation24, _oProperty$annotation25, _oProperty$annotation26, _oProperty$annotation27, _oProperty$annotation28, _oProperty$annotation29, _oProperty$annotation30, _oProperty$annotation31;

    return !!((_oProperty$annotation24 = oProperty.annotations) === null || _oProperty$annotation24 === void 0 ? void 0 : (_oProperty$annotation25 = _oProperty$annotation24.Common) === null || _oProperty$annotation25 === void 0 ? void 0 : _oProperty$annotation25.ValueList) || !!((_oProperty$annotation26 = oProperty.annotations) === null || _oProperty$annotation26 === void 0 ? void 0 : (_oProperty$annotation27 = _oProperty$annotation26.Common) === null || _oProperty$annotation27 === void 0 ? void 0 : _oProperty$annotation27.ValueListReferences) || !!((_oProperty$annotation28 = oProperty.annotations) === null || _oProperty$annotation28 === void 0 ? void 0 : (_oProperty$annotation29 = _oProperty$annotation28.Common) === null || _oProperty$annotation29 === void 0 ? void 0 : _oProperty$annotation29.ValueListWithFixedValues) || !!((_oProperty$annotation30 = oProperty.annotations) === null || _oProperty$annotation30 === void 0 ? void 0 : (_oProperty$annotation31 = _oProperty$annotation30.Common) === null || _oProperty$annotation31 === void 0 ? void 0 : _oProperty$annotation31.ValueListMapping);
  };
  /**
   * Check whether the property has a value help with fixed value annotation defined or not.
   *
   * @param {Property} oProperty the target property
   * @returns {boolean} true if it has a value help
   */


  _exports.hasValueHelp = hasValueHelp;

  var hasValueHelpWithFixedValues = function (oProperty) {
    var _oProperty$annotation32, _oProperty$annotation33;

    return !!((_oProperty$annotation32 = oProperty.annotations) === null || _oProperty$annotation32 === void 0 ? void 0 : (_oProperty$annotation33 = _oProperty$annotation32.Common) === null || _oProperty$annotation33 === void 0 ? void 0 : _oProperty$annotation33.ValueListWithFixedValues);
  };
  /**
   * Check whether the property has a value help for validation annotation defined or not.
   *
   * @param {Property} oProperty the target property
   * @returns {boolean} true if it has a value help
   */


  _exports.hasValueHelpWithFixedValues = hasValueHelpWithFixedValues;

  var hasValueListForValidation = function (oProperty) {
    var _oProperty$annotation34, _oProperty$annotation35;

    return ((_oProperty$annotation34 = oProperty.annotations) === null || _oProperty$annotation34 === void 0 ? void 0 : (_oProperty$annotation35 = _oProperty$annotation34.Common) === null || _oProperty$annotation35 === void 0 ? void 0 : _oProperty$annotation35.ValueListForValidation) !== undefined;
  };
  /**
   * Checks whether the property is a unit property.
   *
   * @param oProperty the property to check
   * @returns true if it is a unit
   */


  _exports.hasValueListForValidation = hasValueListForValidation;

  var isUnit = function (oProperty) {
    var _oProperty$annotation36, _oProperty$annotation37;

    return !!((_oProperty$annotation36 = oProperty.annotations) === null || _oProperty$annotation36 === void 0 ? void 0 : (_oProperty$annotation37 = _oProperty$annotation36.Common) === null || _oProperty$annotation37 === void 0 ? void 0 : _oProperty$annotation37.IsUnit);
  };
  /**
   * Checks whether the property is a currency property.
   *
   * @param oProperty the property to check
   * @returns true if it is a currency
   */


  _exports.isUnit = isUnit;

  var isCurrency = function (oProperty) {
    var _oProperty$annotation38, _oProperty$annotation39;

    return !!((_oProperty$annotation38 = oProperty.annotations) === null || _oProperty$annotation38 === void 0 ? void 0 : (_oProperty$annotation39 = _oProperty$annotation38.Common) === null || _oProperty$annotation39 === void 0 ? void 0 : _oProperty$annotation39.IsCurrency);
  };

  _exports.isCurrency = isCurrency;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb3BlcnR5SGVscGVyLnRzIl0sIm5hbWVzIjpbImlzUHJvcGVydHkiLCJwcm9wZXJ0eSIsImhhc093blByb3BlcnR5IiwiX3R5cGUiLCJpc0NvbXB1dGVkIiwib1Byb3BlcnR5IiwiYW5ub3RhdGlvbnMiLCJDb3JlIiwiQ29tcHV0ZWQiLCJpc0ltbXV0YWJsZSIsIkltbXV0YWJsZSIsImlzS2V5IiwiaGFzRGF0ZVR5cGUiLCJpbmRleE9mIiwidHlwZSIsImdldExhYmVsIiwiQ29tbW9uIiwiTGFiZWwiLCJ0b1N0cmluZyIsImhhc1NlbWFudGljT2JqZWN0IiwiU2VtYW50aWNPYmplY3QiLCJpc05vbkVkaXRhYmxlRXhwcmVzc2lvbiIsIm9yIiwiaXNSZWFkT25seUV4cHJlc3Npb24iLCJpc0Rpc2FibGVkRXhwcmVzc2lvbiIsIm9GaWVsZENvbnRyb2xWYWx1ZSIsIkZpZWxkQ29udHJvbCIsImVxdWFsIiwiYW5ub3RhdGlvbkV4cHJlc3Npb24iLCJpc1JlcXVpcmVkRXhwcmVzc2lvbiIsImlzUGF0aEV4cHJlc3Npb24iLCJleHByZXNzaW9uIiwidW5kZWZpbmVkIiwiZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eSIsIk1lYXN1cmVzIiwiVW5pdCIsIiR0YXJnZXQiLCJnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSIsIklTT0N1cnJlbmN5IiwiaGFzVmFsdWVIZWxwIiwiVmFsdWVMaXN0IiwiVmFsdWVMaXN0UmVmZXJlbmNlcyIsIlZhbHVlTGlzdFdpdGhGaXhlZFZhbHVlcyIsIlZhbHVlTGlzdE1hcHBpbmciLCJoYXNWYWx1ZUhlbHBXaXRoRml4ZWRWYWx1ZXMiLCJoYXNWYWx1ZUxpc3RGb3JWYWxpZGF0aW9uIiwiVmFsdWVMaXN0Rm9yVmFsaWRhdGlvbiIsImlzVW5pdCIsIklzVW5pdCIsImlzQ3VycmVuY3kiLCJJc0N1cnJlbmN5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUlBOzs7Ozs7QUFNTyxXQUFTQSxVQUFULENBQW9CQyxRQUFwQixFQUF5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LEdBRk07QUFJUDs7Ozs7Ozs7OztBQU1PLE1BQU1DLFVBQVUsR0FBRyxVQUFTNUMsU0FBVCxFQUF1QztBQUFBOztBQUNoRSxXQUFPLENBQUMsNkJBQUNBLFNBQVMsQ0FBQ0MsV0FBWCx1RkFBQyx3QkFBdUJVLE1BQXhCLDREQUFDLHdCQUErQmtDLFVBQWhDLENBQVI7QUFDQSxHQUZNIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQgeyBhbm5vdGF0aW9uRXhwcmVzc2lvbiwgRXhwcmVzc2lvbk9yUHJpbWl0aXZlLCBlcXVhbCwgb3IsIEV4cHJlc3Npb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IHsgUGF0aEFubm90YXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5cbi8qKlxuICogSWRlbnRpZnkgaWYgdGhlIGdpdmVuIHByb3BlcnR5IHBhc3NlZCBpcyBhIFwiUHJvcGVydHlcIiAoaGFzIGEgX3R5cGUpLlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IHByb3BlcnR5IGEgdGFyZ2V0IHByb3BlcnR5IHRvIGV2YWx1YXRlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdmFsaWRhdGUgdGhhdCBwcm9wZXJ0eSBpcyBhIFByb3BlcnR5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb3BlcnR5KHByb3BlcnR5OiBhbnkpOiBwcm9wZXJ0eSBpcyBQcm9wZXJ0eSB7XG5cdHJldHVybiBwcm9wZXJ0eSAmJiAocHJvcGVydHkgYXMgUHJvcGVydHkpLmhhc093blByb3BlcnR5KFwiX3R5cGVcIikgJiYgKHByb3BlcnR5IGFzIFByb3BlcnR5KS5fdHlwZSA9PT0gXCJQcm9wZXJ0eVwiO1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIHByb3BlcnR5IGhhcyB0aGUgQ29yZS5Db21wdXRlZCBhbm5vdGF0aW9uIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBvUHJvcGVydHkgdGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaXQncyBjb21wdXRlZFxuICovXG5leHBvcnQgY29uc3QgaXNDb21wdXRlZCA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuICEhb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db3JlPy5Db21wdXRlZDtcbn07XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgcHJvcGVydHkgaGFzIHRoZSBDb3JlLkltbXV0YWJsZSBhbm5vdGF0aW9uIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBvUHJvcGVydHkgdGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaXQncyBpbW11dGFibGVcbiAqL1xuZXhwb3J0IGNvbnN0IGlzSW1tdXRhYmxlID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gISFvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvcmU/LkltbXV0YWJsZTtcbn07XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgcHJvcGVydHkgaXMgYSBrZXkgb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpdCdzIGEga2V5XG4gKi9cbmV4cG9ydCBjb25zdCBpc0tleSA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuICEhb1Byb3BlcnR5LmlzS2V5O1xufTtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgcHJvcGVydHkgaGFzIGEgZGF0ZSB0aW1lIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5XG4gKiBAcmV0dXJucyB0cnVlIGlmIGl0IGlzIG9mIHR5cGUgZGF0ZSAvIGRhdGV0aW1lIC8gZGF0ZXRpbWVvZmZzZXRcbiAqL1xuZXhwb3J0IGNvbnN0IGhhc0RhdGVUeXBlID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gW1wiRWRtLkRhdGVcIiwgXCJFZG0uRGF0ZVRpbWVcIiwgXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIl0uaW5kZXhPZihvUHJvcGVydHkudHlwZSkgIT09IC0xO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgbGFiZWwgYW5ub3RhdGlvbi5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5IHRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIHRoZSBsYWJlbCBzdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IGdldExhYmVsID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IHN0cmluZyB7XG5cdHJldHVybiBvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uTGFiZWw/LnRvU3RyaW5nKCkgfHwgXCJcIjtcbn07XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgcHJvcGVydHkgaGFzIGEgc2VtYW50aWMgb2JqZWN0IGRlZmluZWQgb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpdCBoYXMgYSBzZW1hbnRpYyBvYmplY3RcbiAqL1xuZXhwb3J0IGNvbnN0IGhhc1NlbWFudGljT2JqZWN0ID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gISFvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uU2VtYW50aWNPYmplY3Q7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgYmluZGluZyBleHByZXNzaW9uIHRvIGNoZWNrIGlmIHRoZSBwcm9wZXJ0eSBpcyBub24gZWRpdGFibGUgb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+fSB0aGUgYmluZGluZyBleHByZXNzaW9uIHJlc29sdmluZyB0byBhIGJvb2xlYW4gYmVpbmcgdHJ1ZSBpZiBpdCdzIG5vbiBlZGl0YWJsZVxuICovXG5leHBvcnQgY29uc3QgaXNOb25FZGl0YWJsZUV4cHJlc3Npb24gPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBvcihpc1JlYWRPbmx5RXhwcmVzc2lvbihvUHJvcGVydHkpLCBpc0Rpc2FibGVkRXhwcmVzc2lvbihvUHJvcGVydHkpKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBiaW5kaW5nIGV4cHJlc3Npb24gdG8gY2hlY2sgaWYgdGhlIHByb3BlcnR5IGlzIHJlYWQgb25seSBvciBub3QuXG4gKlxuICogQHBhcmFtIHtQcm9wZXJ0eX0gb1Byb3BlcnR5IHRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uT3JQcmltaXRpdmU8Ym9vbGVhbj59IHRoZSBiaW5kaW5nIGV4cHJlc3Npb24gcmVzb2x2aW5nIHRvIGEgYm9vbGVhbiBiZWluZyB0cnVlIGlmIGl0J3MgcmVhZCBvbmx5XG4gKi9cbmV4cG9ydCBjb25zdCBpc1JlYWRPbmx5RXhwcmVzc2lvbiA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8Ym9vbGVhbj4ge1xuXHRjb25zdCBvRmllbGRDb250cm9sVmFsdWUgPSBvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uRmllbGRDb250cm9sO1xuXHRpZiAodHlwZW9mIG9GaWVsZENvbnRyb2xWYWx1ZSA9PT0gXCJvYmplY3RcIikge1xuXHRcdHJldHVybiAhIW9GaWVsZENvbnRyb2xWYWx1ZSAmJiBlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbihvRmllbGRDb250cm9sVmFsdWUpIGFzIEV4cHJlc3Npb25PclByaW1pdGl2ZTxudW1iZXI+LCAxKTtcblx0fVxuXHRyZXR1cm4gb0ZpZWxkQ29udHJvbFZhbHVlID09PSBcIkNvbW1vbi5GaWVsZENvbnRyb2xUeXBlL1JlYWRPbmx5XCI7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgYmluZGluZyBleHByZXNzaW9uIHRvIGNoZWNrIGlmIHRoZSBwcm9wZXJ0eSBpcyByZWFkIG9ubHkgb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+fSB0aGUgYmluZGluZyBleHByZXNzaW9uIHJlc29sdmluZyB0byBhIGJvb2xlYW4gYmVpbmcgdHJ1ZSBpZiBpdCdzIHJlYWQgb25seVxuICovXG5leHBvcnQgY29uc3QgaXNSZXF1aXJlZEV4cHJlc3Npb24gPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+IHtcblx0Y29uc3Qgb0ZpZWxkQ29udHJvbFZhbHVlID0gb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LkZpZWxkQ29udHJvbDtcblx0aWYgKHR5cGVvZiBvRmllbGRDb250cm9sVmFsdWUgPT09IFwib2JqZWN0XCIpIHtcblx0XHRyZXR1cm4gISFvRmllbGRDb250cm9sVmFsdWUgJiYgZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24ob0ZpZWxkQ29udHJvbFZhbHVlKSBhcyBFeHByZXNzaW9uT3JQcmltaXRpdmU8bnVtYmVyPiwgNyk7XG5cdH1cblx0cmV0dXJuIG9GaWVsZENvbnRyb2xWYWx1ZSA9PT0gXCJDb21tb24uRmllbGRDb250cm9sVHlwZS9NYW5kYXRvcnlcIjtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBiaW5kaW5nIGV4cHJlc3Npb24gdG8gY2hlY2sgaWYgdGhlIHByb3BlcnR5IGlzIGRpc2FibGVkIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBvUHJvcGVydHkgdGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMge0V4cHJlc3Npb25PclByaW1pdGl2ZTxib29sZWFuPn0gdGhlIGJpbmRpbmcgZXhwcmVzc2lvbiByZXNvbHZpbmcgdG8gYSBib29sZWFuIGJlaW5nIHRydWUgaWYgaXQncyBkaXNhYmxlZFxuICovXG5leHBvcnQgY29uc3QgaXNEaXNhYmxlZEV4cHJlc3Npb24gPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+IHtcblx0Y29uc3Qgb0ZpZWxkQ29udHJvbFZhbHVlID0gb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LkZpZWxkQ29udHJvbDtcblx0aWYgKHR5cGVvZiBvRmllbGRDb250cm9sVmFsdWUgPT09IFwib2JqZWN0XCIpIHtcblx0XHRyZXR1cm4gISFvRmllbGRDb250cm9sVmFsdWUgJiYgZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24ob0ZpZWxkQ29udHJvbFZhbHVlKSBhcyBFeHByZXNzaW9uT3JQcmltaXRpdmU8bnVtYmVyPiwgMCk7XG5cdH1cblx0cmV0dXJuIG9GaWVsZENvbnRyb2xWYWx1ZSA9PT0gXCJDb21tb24uRmllbGRDb250cm9sVHlwZS9JbmFwcGxpY2FibGVcIjtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1BhdGhFeHByZXNzaW9uID0gZnVuY3Rpb248VD4oZXhwcmVzc2lvbjogYW55KTogZXhwcmVzc2lvbiBpcyBQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gISFleHByZXNzaW9uICYmIGV4cHJlc3Npb24udHlwZSAhPT0gdW5kZWZpbmVkICYmIGV4cHJlc3Npb24udHlwZSA9PT0gXCJQYXRoXCI7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgYXNzb2NpYXRlZCB1bml0IHByb3BlcnR5IGZvciB0aGF0IHByb3BlcnR5IGlmIGl0IGV4aXN0cy5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBvUHJvcGVydHkgdGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMge1Byb3BlcnR5IHwgdW5kZWZpbmVkfSB0aGUgdW5pdCBwcm9wZXJ0eSBpZiBpdCBleGlzdHNcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkgPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogUHJvcGVydHkgfCB1bmRlZmluZWQge1xuXHRyZXR1cm4gaXNQYXRoRXhwcmVzc2lvbihvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5Vbml0KVxuXHRcdD8gKChvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5Vbml0LiR0YXJnZXQgYXMgdW5rbm93bikgYXMgUHJvcGVydHkpXG5cdFx0OiB1bmRlZmluZWQ7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgYXNzb2NpYXRlZCBjdXJyZW5jeSBwcm9wZXJ0eSBmb3IgdGhhdCBwcm9wZXJ0eSBpZiBpdCBleGlzdHMuXG4gKlxuICogQHBhcmFtIHtQcm9wZXJ0eX0gb1Byb3BlcnR5IHRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIHtQcm9wZXJ0eSB8IHVuZGVmaW5lZH0gdGhlIHVuaXQgcHJvcGVydHkgaWYgaXQgZXhpc3RzXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBQcm9wZXJ0eSB8IHVuZGVmaW5lZCB7XG5cdHJldHVybiBpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uTWVhc3VyZXM/LklTT0N1cnJlbmN5KVxuXHRcdD8gKChvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5JU09DdXJyZW5jeS4kdGFyZ2V0IGFzIHVua25vd24pIGFzIFByb3BlcnR5KVxuXHRcdDogdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBwcm9wZXJ0eSBoYXMgYSB2YWx1ZSBoZWxwIGFubm90YXRpb24gZGVmaW5lZCBvciBub3QuXG4gKlxuICogQHBhcmFtIHtQcm9wZXJ0eX0gb1Byb3BlcnR5IHRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGl0IGhhcyBhIHZhbHVlIGhlbHBcbiAqL1xuZXhwb3J0IGNvbnN0IGhhc1ZhbHVlSGVscCA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuIChcblx0XHQhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5WYWx1ZUxpc3QgfHxcblx0XHQhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5WYWx1ZUxpc3RSZWZlcmVuY2VzIHx8XG5cdFx0ISFvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uVmFsdWVMaXN0V2l0aEZpeGVkVmFsdWVzIHx8XG5cdFx0ISFvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uVmFsdWVMaXN0TWFwcGluZ1xuXHQpO1xufTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBwcm9wZXJ0eSBoYXMgYSB2YWx1ZSBoZWxwIHdpdGggZml4ZWQgdmFsdWUgYW5ub3RhdGlvbiBkZWZpbmVkIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBvUHJvcGVydHkgdGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaXQgaGFzIGEgdmFsdWUgaGVscFxuICovXG5leHBvcnQgY29uc3QgaGFzVmFsdWVIZWxwV2l0aEZpeGVkVmFsdWVzID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gISFvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uVmFsdWVMaXN0V2l0aEZpeGVkVmFsdWVzO1xufTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBwcm9wZXJ0eSBoYXMgYSB2YWx1ZSBoZWxwIGZvciB2YWxpZGF0aW9uIGFubm90YXRpb24gZGVmaW5lZCBvciBub3QuXG4gKlxuICogQHBhcmFtIHtQcm9wZXJ0eX0gb1Byb3BlcnR5IHRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGl0IGhhcyBhIHZhbHVlIGhlbHBcbiAqL1xuZXhwb3J0IGNvbnN0IGhhc1ZhbHVlTGlzdEZvclZhbGlkYXRpb24gPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiBvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uVmFsdWVMaXN0Rm9yVmFsaWRhdGlvbiAhPT0gdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgcHJvcGVydHkgaXMgYSB1bml0IHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSBvUHJvcGVydHkgdGhlIHByb3BlcnR5IHRvIGNoZWNrXG4gKiBAcmV0dXJucyB0cnVlIGlmIGl0IGlzIGEgdW5pdFxuICovXG5leHBvcnQgY29uc3QgaXNVbml0ID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gISFvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uSXNVbml0O1xufTtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgcHJvcGVydHkgaXMgYSBjdXJyZW5jeSBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5IHRoZSBwcm9wZXJ0eSB0byBjaGVja1xuICogQHJldHVybnMgdHJ1ZSBpZiBpdCBpcyBhIGN1cnJlbmN5XG4gKi9cbmV4cG9ydCBjb25zdCBpc0N1cnJlbmN5ID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gISFvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uSXNDdXJyZW5jeTtcbn07XG4iXX0=