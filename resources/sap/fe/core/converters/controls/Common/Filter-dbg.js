sap.ui.define(["sap/fe/core/converters/controls/Common/DataVisualization"], function (DataVisualization) {
  "use strict";

  var _exports = {};
  var getSelectionVariant = DataVisualization.getSelectionVariant;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var aValidTypes = ["Edm.Boolean", "Edm.Byte", "Edm.Date", "Edm.DateTime", "Edm.DateTimeOffset", "Edm.Decimal", "Edm.Double", "Edm.Float", "Edm.Guid", "Edm.Int16", "Edm.Int32", "Edm.Int64", "Edm.SByte", "Edm.Single", "Edm.String", "Edm.Time", "Edm.TimeOfDay"];
  var oExcludeMap = {
    "Contains": "NotContains",
    "StartsWith": "NotStartsWith",
    "EndsWith": "NotEndsWith",
    "Empty": "NotEmpty",
    "NotEmpty": "Empty",
    "LE": "NOTLE",
    "GE": "NOTGE",
    "LT": "NOTLT",
    "GT": "NOTGT",
    "BT": "NOTBT",
    "NE": "EQ",
    "EQ": "NE"
  };
  /**
   * Method to get the compliant value type based on data type.
   *
   * @param  sValue - Raw value
   * @param  sType - Property Metadata type for type conversion
   * @returns - value to be propagated to the condition.
   */

  function getTypeCompliantValue(sValue, sType) {
    var oValue;

    if (aValidTypes.indexOf(sType) > -1) {
      oValue = sValue;

      if (sType === "Edm.Boolean") {
        oValue = sValue === "true" || (sValue === "false" ? false : undefined);
      } else if (sType === "Edm.Double" || sType === "Edm.Single") {
        oValue = isNaN(sValue) ? undefined : parseFloat(sValue);
      } else if (sType === "Edm.Byte" || sType === "Edm.Int16" || sType === "Edm.Int32" || sType === "Edm.SByte") {
        oValue = isNaN(sValue) ? undefined : parseInt(sValue, 10);
      } else if (sType === "Edm.Date") {
        oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/) ? sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)[0] : sValue.match(/^(\d{8})/) && sValue.match(/^(\d{8})/)[0];
      } else if (sType === "Edm.DateTimeOffset") {
        if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\+(\d{1,4})/)) {
          oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\+(\d{1,4})/)[0];
        } else if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})/)) {
          oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})/)[0] + "+0000";
        } else if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)) {
          oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)[0] + "T00:00:00+0000";
        } else if (sValue.indexOf("Z") === sValue.length - 1) {
          oValue = sValue.split("Z")[0] + "+0100";
        } else {
          oValue = undefined;
        }
      } else if (sType === "Edm.TimeOfDay") {
        oValue = sValue.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/) ? sValue.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/)[0] : undefined;
      }
    }

    return oValue;
  }
  /**
   * Method to create a condition.
   * @param  sOption - Operator to be used.
   * @param  oV1 - Lower Value
   * @param  oV2 - Higher Value
   * @param sSign
   * @returns - condition.
   */


  _exports.getTypeCompliantValue = getTypeCompliantValue;

  function createConditions(sOption, oV1, oV2, sSign) {
    var oValue = oV1,
        oValue2,
        sInternalOperation;
    var oCondition = {};
    oCondition.values = [];
    oCondition.isEmpty = null;

    if (oV1 === undefined || oV1 === null) {
      return;
    }

    switch (sOption) {
      case "CP":
        sInternalOperation = "Contains";

        if (oValue) {
          var nIndexOf = oValue.indexOf("*");
          var nLastIndex = oValue.lastIndexOf("*"); // only when there are '*' at all

          if (nIndexOf > -1) {
            if (nIndexOf === 0 && nLastIndex !== oValue.length - 1) {
              sInternalOperation = "EndsWith";
              oValue = oValue.substring(1, oValue.length);
            } else if (nIndexOf !== 0 && nLastIndex === oValue.length - 1) {
              sInternalOperation = "StartsWith";
              oValue = oValue.substring(0, oValue.length - 1);
            } else {
              oValue = oValue.substring(1, oValue.length - 1);
            }
          } else {
            /* TODO Add diagonostics Log.warning("Contains Option cannot be used without '*'.") */
            return;
          }
        }

        break;

      case "EQ":
        sInternalOperation = oV1 === "" ? "Empty" : sOption;
        break;

      case "NE":
        sInternalOperation = oV1 === "" ? "NotEmpty" : sOption;
        break;

      case "BT":
        if (oV2 === undefined || oV2 === null) {
          return;
        }

        oValue2 = oV2;
        sInternalOperation = sOption;
        break;

      case "LE":
      case "GE":
      case "GT":
      case "LT":
        sInternalOperation = sOption;
        break;

      default:
        /* TODO Add diagonostics Log.warning("Selection Option is not supported : '" + sOption + "'"); */
        return;
    }

    if (sSign === "E") {
      sInternalOperation = oExcludeMap[sInternalOperation];
    }

    oCondition.operator = sInternalOperation;

    if (sInternalOperation !== "Empty") {
      oCondition.values.push(oValue);

      if (oValue2) {
        oCondition.values.push(oValue2);
      }
    }

    return oCondition;
  }
  /* Method to get the operator from the Selection Option */


  _exports.createConditions = createConditions;

  function getOperator(sOperator) {
    return sOperator.split("/")[1];
  }
  /*  Method to get the filterConditions from the Selection Variant */


  _exports.getOperator = getOperator;

  function getFiltersConditionsFromSelectionVariant(entityType, selectionVariant) {
    var ofilterConditions = {};

    if (selectionVariant) {
      var aSelectOptions = selectionVariant.SelectOptions;
      var aValidProperties = entityType.entityProperties;
      aSelectOptions === null || aSelectOptions === void 0 ? void 0 : aSelectOptions.forEach(function (selectOption) {
        var propertyName = selectOption.PropertyName;
        var sPropertyName = propertyName.value;
        var Ranges = selectOption.Ranges;

        for (var i = 0; i < aValidProperties.length; i++) {
          if (sPropertyName === aValidProperties[i].name) {
            (function () {
              var oValidProperty = aValidProperties[i];
              var aConditions = [];
              Ranges === null || Ranges === void 0 ? void 0 : Ranges.forEach(function (Range) {
                var sign = Range.Sign;
                var sOption = Range.Option ? getOperator(Range.Option) : undefined;
                var oValue1 = getTypeCompliantValue(Range.Low, oValidProperty.type);
                var oValue2 = Range.High ? getTypeCompliantValue(Range.High, oValidProperty.type) : undefined;

                if ((oValue1 !== undefined || oValue1 !== null) && sOption) {
                  var oCondition = createConditions(sOption, oValue1, oValue2, sign);
                  aConditions.push(oCondition);

                  if (aConditions.length) {
                    ofilterConditions[sPropertyName] = aConditions;
                  }
                }
              });
            })();
          }
        }
      });
    }

    return ofilterConditions;
  }

  var getDefaultValueFilters = function (entityType) {
    var properties = entityType.entityProperties;
    var filterConditions = {};

    if (properties) {
      properties.forEach(function (property) {
        var _property$annotations, _property$annotations2;

        var defaultFilterValue = (_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.Common) === null || _property$annotations2 === void 0 ? void 0 : _property$annotations2.FilterDefaultValue;

        if (defaultFilterValue) {
          var PropertyName = property.name;
          filterConditions[PropertyName] = [{
            operator: "EQ",
            values: [defaultFilterValue]
          }];
        }
      });
    }

    return filterConditions;
  };

  function getEditStatusFilter(entityType, converterContext) {
    var _converterContext$get, _targetAnnotations$Co, _targetAnnotations$Co2;

    var ofilterConditions = {};
    var targetAnnotations = (_converterContext$get = converterContext.getEntitySetForEntityType(entityType)) === null || _converterContext$get === void 0 ? void 0 : _converterContext$get.annotations;

    if ((targetAnnotations === null || targetAnnotations === void 0 ? void 0 : (_targetAnnotations$Co = targetAnnotations.Common) === null || _targetAnnotations$Co === void 0 ? void 0 : _targetAnnotations$Co.DraftRoot) || (targetAnnotations === null || targetAnnotations === void 0 ? void 0 : (_targetAnnotations$Co2 = targetAnnotations.Common) === null || _targetAnnotations$Co2 === void 0 ? void 0 : _targetAnnotations$Co2.DraftNode)) {
      ofilterConditions["$editState"] = [{
        operator: "DRAFT_EDIT_STATE",
        values: ["ALL"]
      }];
    }

    return ofilterConditions;
  }

  function getFilterConditions(entityType, converterContext) {
    var filterConditions = {};
    var selectionVariant = getSelectionVariant(entityType, converterContext);
    var editStateFilter = getEditStatusFilter(entityType, converterContext);
    var defaultFilters = getDefaultValueFilters(entityType);

    if (selectionVariant || selectionVariant && defaultFilters) {
      filterConditions = getFiltersConditionsFromSelectionVariant(entityType, selectionVariant);
    } else if (defaultFilters) {
      filterConditions = defaultFilters;
    }

    if (editStateFilter) {
      filterConditions = _objectSpread({}, filterConditions, {}, editStateFilter);
    }

    return filterConditions;
  }

  _exports.getFilterConditions = getFilterConditions;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpbHRlci50cyJdLCJuYW1lcyI6WyJhVmFsaWRUeXBlcyIsIm9FeGNsdWRlTWFwIiwiZ2V0VHlwZUNvbXBsaWFudFZhbHVlIiwic1ZhbHVlIiwic1R5cGUiLCJvVmFsdWUiLCJpbmRleE9mIiwidW5kZWZpbmVkIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwicGFyc2VJbnQiLCJtYXRjaCIsImxlbmd0aCIsInNwbGl0IiwiY3JlYXRlQ29uZGl0aW9ucyIsInNPcHRpb24iLCJvVjEiLCJvVjIiLCJzU2lnbiIsIm9WYWx1ZTIiLCJzSW50ZXJuYWxPcGVyYXRpb24iLCJvQ29uZGl0aW9uIiwidmFsdWVzIiwiaXNFbXB0eSIsIm5JbmRleE9mIiwibkxhc3RJbmRleCIsImxhc3RJbmRleE9mIiwic3Vic3RyaW5nIiwib3BlcmF0b3IiLCJwdXNoIiwiZ2V0T3BlcmF0b3IiLCJzT3BlcmF0b3IiLCJnZXRGaWx0ZXJzQ29uZGl0aW9uc0Zyb21TZWxlY3Rpb25WYXJpYW50IiwiZW50aXR5VHlwZSIsInNlbGVjdGlvblZhcmlhbnQiLCJvZmlsdGVyQ29uZGl0aW9ucyIsImFTZWxlY3RPcHRpb25zIiwiU2VsZWN0T3B0aW9ucyIsImFWYWxpZFByb3BlcnRpZXMiLCJlbnRpdHlQcm9wZXJ0aWVzIiwiZm9yRWFjaCIsInNlbGVjdE9wdGlvbiIsInByb3BlcnR5TmFtZSIsIlByb3BlcnR5TmFtZSIsInNQcm9wZXJ0eU5hbWUiLCJ2YWx1ZSIsIlJhbmdlcyIsImkiLCJuYW1lIiwib1ZhbGlkUHJvcGVydHkiLCJhQ29uZGl0aW9ucyIsIlJhbmdlIiwic2lnbiIsIlNpZ24iLCJPcHRpb24iLCJvVmFsdWUxIiwiTG93IiwidHlwZSIsIkhpZ2giLCJnZXREZWZhdWx0VmFsdWVGaWx0ZXJzIiwicHJvcGVydGllcyIsImZpbHRlckNvbmRpdGlvbnMiLCJwcm9wZXJ0eSIsImRlZmF1bHRGaWx0ZXJWYWx1ZSIsImFubm90YXRpb25zIiwiQ29tbW9uIiwiRmlsdGVyRGVmYXVsdFZhbHVlIiwiZ2V0RWRpdFN0YXR1c0ZpbHRlciIsImNvbnZlcnRlckNvbnRleHQiLCJ0YXJnZXRBbm5vdGF0aW9ucyIsImdldEVudGl0eVNldEZvckVudGl0eVR5cGUiLCJEcmFmdFJvb3QiLCJEcmFmdE5vZGUiLCJnZXRGaWx0ZXJDb25kaXRpb25zIiwiZ2V0U2VsZWN0aW9uVmFyaWFudCIsImVkaXRTdGF0ZUZpbHRlciIsImRlZmF1bHRGaWx0ZXJzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQSxNQUFNQSxXQUFXLEdBQUcsQ0FDbkIsYUFEbUIsRUFFbkIsVUFGbUIsRUFHbkIsVUFIbUIsRUFJbkIsY0FKbUIsRUFLbkIsb0JBTG1CLEVBTW5CLGFBTm1CLEVBT25CLFlBUG1CLEVBUW5CLFdBUm1CLEVBU25CLFVBVG1CLEVBVW5CLFdBVm1CLEVBV25CLFdBWG1CLEVBWW5CLFdBWm1CLEVBYW5CLFdBYm1CLEVBY25CLFlBZG1CLEVBZW5CLFlBZm1CLEVBZ0JuQixVQWhCbUIsRUFpQm5CLGVBakJtQixDQUFwQjtBQW9CQSxNQUFNQyxXQUFnQyxHQUFHO0FBQ3hDLGdCQUFZLGFBRDRCO0FBRXhDLGtCQUFjLGVBRjBCO0FBR3hDLGdCQUFZLGFBSDRCO0FBSXhDLGFBQVMsVUFKK0I7QUFLeEMsZ0JBQVksT0FMNEI7QUFNeEMsVUFBTSxPQU5rQztBQU94QyxVQUFNLE9BUGtDO0FBUXhDLFVBQU0sT0FSa0M7QUFTeEMsVUFBTSxPQVRrQztBQVV4QyxVQUFNLE9BVmtDO0FBV3hDLFVBQU0sSUFYa0M7QUFZeEMsVUFBTTtBQVprQyxHQUF6QztBQWVBOzs7Ozs7OztBQVFPLFdBQVNDLHFCQUFULENBQStCQyxNQUEvQixFQUE0Q0MsS0FBNUMsRUFBMkQ7QUFDakUsUUFBSUMsTUFBSjs7QUFDQSxRQUFJTCxXQUFXLENBQUNNLE9BQVosQ0FBb0JGLEtBQXBCLElBQTZCLENBQUMsQ0FBbEMsRUFBcUM7QUFDcENDLE1BQUFBLE1BQU0sR0FBR0YsTUFBVDs7QUFDQSxVQUFJQyxLQUFLLEtBQUssYUFBZCxFQUE2QjtBQUM1QkMs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N0RmLE1BQUFBLGdCQUFnQixHQUFHN0Isd0NBQXdDLENBQUNDLFVBQUQsRUFBYUMsZ0JBQWIsQ0FBM0Q7QUFDQSxLQUZELE1BRU8sSUFBSTBDLGNBQUosRUFBb0I7QUFDMUJmLE1BQUFBLGdCQUFnQixHQUFHZSxjQUFuQjtBQUNBOztBQUNELFFBQUlELGVBQUosRUFBcUI7QUFDcEJkLE1BQUFBLGdCQUFnQixxQkFBUUEsZ0JBQVIsTUFBNkJjLGVBQTdCLENBQWhCO0FBQ0E7O0FBQ0QsV0FBT2QsZ0JBQVA7QUFDQSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0U2VsZWN0aW9uVmFyaWFudCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9EYXRhVmlzdWFsaXphdGlvblwiO1xuaW1wb3J0IHsgQ29udmVydGVyQ29udGV4dCB9IGZyb20gXCIuLi8uLi90ZW1wbGF0ZXMvQmFzZUNvbnZlcnRlclwiO1xuaW1wb3J0IHsgUHJvcGVydHkgfSBmcm9tIFwiQHNhcC11eC9hbm5vdGF0aW9uLWNvbnZlcnRlclwiO1xuaW1wb3J0IHsgRW50aXR5VHlwZSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgU2VsZWN0T3B0aW9uVHlwZSwgU2VsZWN0aW9uVmFyaWFudFR5cGVUeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L2dlbmVyYXRlZC9VSVwiO1xuXG5leHBvcnQgdHlwZSBGaWx0ZXJDb25kaXRpb25zID0ge1xuXHRvcGVyYXRvcjogc3RyaW5nO1xuXHR2YWx1ZXM6IEFycmF5PHN0cmluZz47XG5cdGlzRW1wdHk/OiBib29sZWFuIHwgbnVsbDtcbn07XG5cbmNvbnN0IGFWYWxpZFR5cGVzID0gW1xuXHRcIkVkbS5Cb29sZWFuXCIsXG5cdFwiRWRtLkJ5dGVcIixcblx0XCJFZG0uRGF0ZVwiLFxuXHRcIkVkbS5EYXRlVGltZVwiLFxuXHRcIkVkbS5EYXRlVGltZU9mZnNldFwiLFxuXHRcIkVkbS5EZWNpbWFsXCIsXG5cdFwiRWRtLkRvdWJsZVwiLFxuXHRcIkVkbS5GbG9hdFwiLFxuXHRcIkVkbS5HdWlkXCIsXG5cdFwiRWRtLkludDE2XCIsXG5cdFwiRWRtLkludDMyXCIsXG5cdFwiRWRtLkludDY0XCIsXG5cdFwiRWRtLlNCeXRlXCIsXG5cdFwiRWRtLlNpbmdsZVwiLFxuXHRcIkVkbS5TdHJpbmdcIixcblx0XCJFZG0uVGltZVwiLFxuXHRcIkVkbS5UaW1lT2ZEYXlcIlxuXTtcblxuY29uc3Qgb0V4Y2x1ZGVNYXA6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG5cdFwiQ29udGFpbnNcIjogXCJOb3RDb250YWluc1wiLFxuXHRcIlN0YXJ0c1dpdGhcIjogXCJOb3RTdGFydHNXaXRoXCIsXG5cdFwiRW5kc1dpdGhcIjogXCJOb3RFbmRzV2l0aFwiLFxuXHRcIkVtcHR5XCI6IFwiTm90RW1wdHlcIixcblx0XCJOb3RFbXB0eVwiOiBcIkVtcHR5XCIsXG5cdFwiTEVcIjogXCJOT1RMRVwiLFxuXHRcIkdFXCI6IFwiTk9UR0VcIixcblx0XCJMVFwiOiBcIk5PVExUXCIsXG5cdFwiR1RcIjogXCJOT1RHVFwiLFxuXHRcIkJUXCI6IFwiTk9UQlRcIixcblx0XCJORVwiOiBcIkVRXCIsXG5cdFwiRVFcIjogXCJORVwiXG59O1xuXG4vKipcbiAqIE1ldGhvZCB0byBnZXQgdGhlIGNvbXBsaWFudCB2YWx1ZSB0eXBlIGJhc2VkIG9uIGRhdGEgdHlwZS5cbiAqXG4gKiBAcGFyYW0gIHNWYWx1ZSAtIFJhdyB2YWx1ZVxuICogQHBhcmFtICBzVHlwZSAtIFByb3BlcnR5IE1ldGFkYXRhIHR5cGUgZm9yIHR5cGUgY29udmVyc2lvblxuICogQHJldHVybnMgLSB2YWx1ZSB0byBiZSBwcm9wYWdhdGVkIHRvIHRoZSBjb25kaXRpb24uXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGVDb21wbGlhbnRWYWx1ZShzVmFsdWU6IGFueSwgc1R5cGU6IHN0cmluZykge1xuXHRsZXQgb1ZhbHVlO1xuXHRpZiAoYVZhbGlkVHlwZXMuaW5kZXhPZihzVHlwZSkgPiAtMSkge1xuXHRcdG9WYWx1ZSA9IHNWYWx1ZTtcblx0XHRpZiAoc1R5cGUgPT09IFwiRWRtLkJvb2xlYW5cIikge1xuXHRcdFx0b1ZhbHVlID0gc1ZhbHVlID09PSBcInRydWVcIiB8fCAoc1ZhbHVlID09PSBcImZhbHNlXCIgPyBmYWxzZSA6IHVuZGVmaW5lZCk7XG5cdFx0fSBlbHNlIGlmIChzVHlwZSA9PT0gXCJFZG0uRG91YmxlXCIgfHwgc1R5cGUgPT09IFwiRWRtLlNpbmdsZVwiKSB7XG5cdFx0XHRvVmFsdWUgPSBpc05hTihzVmFsdWUpID8gdW5kZWZpbmVkIDogcGFyc2VGbG9hdChzVmFsdWUpO1xuXHRcdH0gZWxzZSBpZiAoc1R5cGUgPT09IFwiRWRtLkJ5dGVcIiB8fCBzVHlwZSA9PT0gXCJFZG0uSW50MTZcIiB8fCBzVHlwZSA9PT0gXCJFZG0uSW50MzJcIiB8fCBzVHlwZSA9PT0gXCJFZG0uU0J5dGVcIikge1xuXHRcdFx0b1ZhbHVlID0gaXNOYU4oc1ZhbHVlKSA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KHNWYWx1ZSwgMTApO1xuXHRcdH0gZWxzZSBpZiAoc1R5cGUgPT09IFwiRWRtLkRhdGVcIikge1xuXHRcdFx0b1ZhbHVlID0gc1ZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pLylcblx0XHRcdFx0PyBzVmFsdWUubWF0Y2goL14oXFxkezR9KS0oXFxkezEsMn0pLShcXGR7MSwyfSkvKVswXVxuXHRcdFx0XHQ6IHNWYWx1ZS5tYXRjaCgvXihcXGR7OH0pLykgJiYgc1ZhbHVlLm1hdGNoKC9eKFxcZHs4fSkvKVswXTtcblx0XHR9IGVsc2UgaWYgKHNUeXBlID09PSBcIkVkbS5EYXRlVGltZU9mZnNldFwiKSB7XG5cdFx0XHRpZiAoc1ZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pVChcXGR7MSwyfSk6KFxcZHsxLDJ9KTooXFxkezEsMn0pXFwrKFxcZHsxLDR9KS8pKSB7XG5cdFx0XHRcdG9WYWx1ZSA9IHNWYWx1ZS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KVQoXFxkezEsMn0pOihcXGR7MSwyfSk6KFxcZHsxLDJ9KVxcKyhcXGR7MSw0fSkvKVswXTtcblx0XHRcdH0gZWxzZSBpZiAoc1ZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pVChcXGR7MSwyfSk6KFxcZHsxLDJ9KTooXFxkezEsMn0pLykpIHtcblx0XHRcdFx0b1ZhbHVlID0gc1ZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pVChcXGR7MSwyfSk6KFxcZHsxLDJ9KTooXFxkezEsMn0pLylbMF0gKyBcIiswMDAwXCI7XG5cdFx0XHR9IGVsc2UgaWYgKHNWYWx1ZS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KS8pKSB7XG5cdFx0XHRcdG9WYWx1ZSA9IHNWYWx1ZS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KS8pWzBdICsgXCJUMDA6MDA6MDArMDAwMFwiO1xuXHRcdFx0fSBlbHNlIGlmIChzVmFsdWUuaW5kZXhPZihcIlpcIikgPT09IHNWYWx1ZS5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdG9WYWx1ZSA9IHNWYWx1ZS5zcGxpdChcIlpcIilbMF0gKyBcIiswMTAwXCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvVmFsdWUgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChzVHlwZSA9PT0gXCJFZG0uVGltZU9mRGF5XCIpIHtcblx0XHRcdG9WYWx1ZSA9IHNWYWx1ZS5tYXRjaCgvKFxcZHsxLDJ9KTooXFxkezEsMn0pOihcXGR7MSwyfSkvKSA/IHNWYWx1ZS5tYXRjaCgvKFxcZHsxLDJ9KTooXFxkezEsMn0pOihcXGR7MSwyfSkvKVswXSA6IHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG9WYWx1ZTtcbn1cblxuLyoqXG4gKiBNZXRob2QgdG8gY3JlYXRlIGEgY29uZGl0aW9uLlxuICogQHBhcmFtICBzT3B0aW9uIC0gT3BlcmF0b3IgdG8gYmUgdXNlZC5cbiAqIEBwYXJhbSAgb1YxIC0gTG93ZXIgVmFsdWVcbiAqIEBwYXJhbSAgb1YyIC0gSGlnaGVyIFZhbHVlXG4gKiBAcGFyYW0gc1NpZ25cbiAqIEByZXR1cm5zIC0gY29uZGl0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29uZGl0aW9ucyhzT3B0aW9uOiBzdHJpbmcsIG9WMTogYW55LCBvVjI6IGFueSwgc1NpZ246IHN0cmluZyB8IHVuZGVmaW5lZCkge1xuXHRsZXQgb1ZhbHVlID0gb1YxLFxuXHRcdG9WYWx1ZTIsXG5cdFx0c0ludGVybmFsT3BlcmF0aW9uOiBhbnk7XG5cdGNvbnN0IG9Db25kaXRpb246IFJlY29yZDxzdHJpbmcsIEZpbHRlckNvbmRpdGlvbnNbXT4gPSB7fTtcblx0b0NvbmRpdGlvbi52YWx1ZXMgPSBbXTtcblx0b0NvbmRpdGlvbi5pc0VtcHR5ID0gbnVsbCBhcyBhbnk7XG5cdGlmIChvVjEgPT09IHVuZGVmaW5lZCB8fCBvVjEgPT09IG51bGwpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRzd2l0Y2ggKHNPcHRpb24pIHtcblx0XHRjYXNlIFwiQ1BcIjpcblx0XHRcdHNJbnRlcm5hbE9wZXJhdGlvbiA9IFwiQ29udGFpbnNcIjtcblx0XHRcdGlmIChvVmFsdWUpIHtcblx0XHRcdFx0Y29uc3QgbkluZGV4T2YgPSBvVmFsdWUuaW5kZXhPZihcIipcIik7XG5cdFx0XHRcdGNvbnN0IG5MYXN0SW5kZXggPSBvVmFsdWUubGFzdEluZGV4T2YoXCIqXCIpO1xuXG5cdFx0XHRcdC8vIG9ubHkgd2hlbiB0aGVyZSBhcmUgJyonIGF0IGFsbFxuXHRcdFx0XHRpZiAobkluZGV4T2YgPiAtMSkge1xuXHRcdFx0XHRcdGlmIChuSW5kZXhPZiA9PT0gMCAmJiBuTGFzdEluZGV4ICE9PSBvVmFsdWUubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdFx0c0ludGVybmFsT3BlcmF0aW9uID0gXCJFbmRzV2l0aFwiO1xuXHRcdFx0XHRcdFx0b1ZhbHVlID0gb1ZhbHVlLnN1YnN0cmluZygxLCBvVmFsdWUubGVuZ3RoKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG5JbmRleE9mICE9PSAwICYmIG5MYXN0SW5kZXggPT09IG9WYWx1ZS5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0XHRzSW50ZXJuYWxPcGVyYXRpb24gPSBcIlN0YXJ0c1dpdGhcIjtcblx0XHRcdFx0XHRcdG9WYWx1ZSA9IG9WYWx1ZS5zdWJzdHJpbmcoMCwgb1ZhbHVlLmxlbmd0aCAtIDEpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRvVmFsdWUgPSBvVmFsdWUuc3Vic3RyaW5nKDEsIG9WYWx1ZS5sZW5ndGggLSAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0LyogVE9ETyBBZGQgZGlhZ29ub3N0aWNzIExvZy53YXJuaW5nKFwiQ29udGFpbnMgT3B0aW9uIGNhbm5vdCBiZSB1c2VkIHdpdGhvdXQgJyonLlwiKSAqL1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIkVRXCI6XG5cdFx0XHRzSW50ZXJuYWxPcGVyYXRpb24gPSBvVjEgPT09IFwiXCIgPyBcIkVtcHR5XCIgOiBzT3B0aW9uO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIk5FXCI6XG5cdFx0XHRzSW50ZXJuYWxPcGVyYXRpb24gPSBvVjEgPT09IFwiXCIgPyBcIk5vdEVtcHR5XCIgOiBzT3B0aW9uO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIkJUXCI6XG5cdFx0XHRpZiAob1YyID09PSB1bmRlZmluZWQgfHwgb1YyID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdG9WYWx1ZTIgPSBvVjI7XG5cdFx0XHRzSW50ZXJuYWxPcGVyYXRpb24gPSBzT3B0aW9uO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIkxFXCI6XG5cdFx0Y2FzZSBcIkdFXCI6XG5cdFx0Y2FzZSBcIkdUXCI6XG5cdFx0Y2FzZSBcIkxUXCI6XG5cdFx0XHRzSW50ZXJuYWxPcGVyYXRpb24gPSBzT3B0aW9uO1xuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdC8qIFRPRE8gQWRkIGRpYWdvbm9zdGljcyBMb2cud2FybmluZyhcIlNlbGVjdGlvbiBPcHRpb24gaXMgbm90IHN1cHBvcnRlZCA6ICdcIiArIHNPcHRpb24gKyBcIidcIik7ICovXG5cdFx0XHRyZXR1cm47XG5cdH1cblx0aWYgKHNTaWduID09PSBcIkVcIikge1xuXHRcdHNJbnRlcm5hbE9wZXJhdGlvbiA9IG9FeGNsdWRlTWFwW3NJbnRlcm5hbE9wZXJhdGlvbl07XG5cdH1cblx0b0NvbmRpdGlvbi5vcGVyYXRvciA9IHNJbnRlcm5hbE9wZXJhdGlvbjtcblx0aWYgKHNJbnRlcm5hbE9wZXJhdGlvbiAhPT0gXCJFbXB0eVwiKSB7XG5cdFx0b0NvbmRpdGlvbi52YWx1ZXMucHVzaChvVmFsdWUpO1xuXHRcdGlmIChvVmFsdWUyKSB7XG5cdFx0XHRvQ29uZGl0aW9uLnZhbHVlcy5wdXNoKG9WYWx1ZTIpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gb0NvbmRpdGlvbjtcbn1cblxuLyogTWV0aG9kIHRvIGdldCB0aGUgb3BlcmF0b3IgZnJvbSB0aGUgU2VsZWN0aW9uIE9wdGlvbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE9wZXJhdG9yKHNPcGVyYXRvcjogc3RyaW5nKTogc3RyaW5nIHtcblx0cmV0dXJuIHNPcGVyYXRvci5zcGxpdChcIi9cIilbMV07XG59XG5cbi8qICBNZXRob2QgdG8gZ2V0IHRoZSBmaWx0ZXJDb25kaXRpb25zIGZyb20gdGhlIFNlbGVjdGlvbiBWYXJpYW50ICovXG5mdW5jdGlvbiBnZXRGaWx0ZXJzQ29uZGl0aW9uc0Zyb21TZWxlY3Rpb25WYXJpYW50KFxuXHRlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLFxuXHRzZWxlY3Rpb25WYXJpYW50OiBTZWxlY3Rpb25WYXJpYW50VHlwZVR5cGVzXG4pOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJDb25kaXRpb25zW10+IHtcblx0Y29uc3Qgb2ZpbHRlckNvbmRpdGlvbnM6IFJlY29yZDxzdHJpbmcsIEZpbHRlckNvbmRpdGlvbnNbXT4gPSB7fTtcblx0aWYgKHNlbGVjdGlvblZhcmlhbnQpIHtcblx0XHRjb25zdCBhU2VsZWN0T3B0aW9ucyA9IHNlbGVjdGlvblZhcmlhbnQuU2VsZWN0T3B0aW9ucztcblx0XHRjb25zdCBhVmFsaWRQcm9wZXJ0aWVzID0gZW50aXR5VHlwZS5lbnRpdHlQcm9wZXJ0aWVzO1xuXHRcdGFTZWxlY3RPcHRpb25zPy5mb3JFYWNoKChzZWxlY3RPcHRpb246IFNlbGVjdE9wdGlvblR5cGUpID0+IHtcblx0XHRcdGNvbnN0IHByb3BlcnR5TmFtZTogYW55ID0gc2VsZWN0T3B0aW9uLlByb3BlcnR5TmFtZTtcblx0XHRcdGNvbnN0IHNQcm9wZXJ0eU5hbWU6IHN0cmluZyA9IHByb3BlcnR5TmFtZS52YWx1ZTtcblx0XHRcdGNvbnN0IFJhbmdlczogYW55ID0gc2VsZWN0T3B0aW9uLlJhbmdlcztcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYVZhbGlkUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAoc1Byb3BlcnR5TmFtZSA9PT0gYVZhbGlkUHJvcGVydGllc1tpXS5uYW1lKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb1ZhbGlkUHJvcGVydHkgPSBhVmFsaWRQcm9wZXJ0aWVzW2ldO1xuXHRcdFx0XHRcdGNvbnN0IGFDb25kaXRpb25zOiBhbnlbXSA9IFtdO1xuXHRcdFx0XHRcdFJhbmdlcz8uZm9yRWFjaCgoUmFuZ2U6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3Qgc2lnbjogc3RyaW5nIHwgdW5kZWZpbmVkID0gUmFuZ2UuU2lnbjtcblx0XHRcdFx0XHRcdGNvbnN0IHNPcHRpb246IHN0cmluZyB8IHVuZGVmaW5lZCA9IFJhbmdlLk9wdGlvbiA/IGdldE9wZXJhdG9yKFJhbmdlLk9wdGlvbikgOiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHRjb25zdCBvVmFsdWUxOiBhbnkgPSBnZXRUeXBlQ29tcGxpYW50VmFsdWUoUmFuZ2UuTG93LCBvVmFsaWRQcm9wZXJ0eS50eXBlKTtcblx0XHRcdFx0XHRcdGNvbnN0IG9WYWx1ZTI6IGFueSA9IFJhbmdlLkhpZ2ggPyBnZXRUeXBlQ29tcGxpYW50VmFsdWUoUmFuZ2UuSGlnaCwgb1ZhbGlkUHJvcGVydHkudHlwZSkgOiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHRpZiAoKG9WYWx1ZTEgIT09IHVuZGVmaW5lZCB8fCBvVmFsdWUxICE9PSBudWxsKSAmJiBzT3B0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IG9Db25kaXRpb24gPSBjcmVhdGVDb25kaXRpb25zKHNPcHRpb24sIG9WYWx1ZTEsIG9WYWx1ZTIsIHNpZ24pO1xuXHRcdFx0XHRcdFx0XHRhQ29uZGl0aW9ucy5wdXNoKG9Db25kaXRpb24pO1xuXHRcdFx0XHRcdFx0XHRpZiAoYUNvbmRpdGlvbnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0b2ZpbHRlckNvbmRpdGlvbnNbc1Byb3BlcnR5TmFtZV0gPSBhQ29uZGl0aW9ucztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIG9maWx0ZXJDb25kaXRpb25zO1xufVxuXG5jb25zdCBnZXREZWZhdWx0VmFsdWVGaWx0ZXJzID0gZnVuY3Rpb24oZW50aXR5VHlwZTogRW50aXR5VHlwZSk6IFJlY29yZDxzdHJpbmcsIEZpbHRlckNvbmRpdGlvbnNbXT4ge1xuXHRjb25zdCBwcm9wZXJ0aWVzID0gZW50aXR5VHlwZS5lbnRpdHlQcm9wZXJ0aWVzO1xuXHRjb25zdCBmaWx0ZXJDb25kaXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJDb25kaXRpb25zW10+ID0ge307XG5cdGlmIChwcm9wZXJ0aWVzKSB7XG5cdFx0cHJvcGVydGllcy5mb3JFYWNoKChwcm9wZXJ0eTogUHJvcGVydHkpID0+IHtcblx0XHRcdGNvbnN0IGRlZmF1bHRGaWx0ZXJWYWx1ZSA9IHByb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LkZpbHRlckRlZmF1bHRWYWx1ZTtcblx0XHRcdGlmIChkZWZhdWx0RmlsdGVyVmFsdWUpIHtcblx0XHRcdFx0Y29uc3QgUHJvcGVydHlOYW1lID0gcHJvcGVydHkubmFtZTtcblx0XHRcdFx0ZmlsdGVyQ29uZGl0aW9uc1tQcm9wZXJ0eU5hbWVdID0gW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdG9wZXJhdG9yOiBcIkVRXCIsXG5cdFx0XHRcdFx0XHR2YWx1ZXM6IFtkZWZhdWx0RmlsdGVyVmFsdWVdXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBmaWx0ZXJDb25kaXRpb25zO1xufTtcblxuZnVuY3Rpb24gZ2V0RWRpdFN0YXR1c0ZpbHRlcihlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogUmVjb3JkPHN0cmluZywgRmlsdGVyQ29uZGl0aW9uc1tdPiB7XG5cdGNvbnN0IG9maWx0ZXJDb25kaXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJDb25kaXRpb25zW10+ID0ge307XG5cdGNvbnN0IHRhcmdldEFubm90YXRpb25zID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRGb3JFbnRpdHlUeXBlKGVudGl0eVR5cGUpPy5hbm5vdGF0aW9ucztcblx0aWYgKHRhcmdldEFubm90YXRpb25zPy5Db21tb24/LkRyYWZ0Um9vdCB8fCB0YXJnZXRBbm5vdGF0aW9ucz8uQ29tbW9uPy5EcmFmdE5vZGUpIHtcblx0XHRvZmlsdGVyQ29uZGl0aW9uc1tcIiRlZGl0U3RhdGVcIl0gPSBbXG5cdFx0XHR7XG5cdFx0XHRcdG9wZXJhdG9yOiBcIkRSQUZUX0VESVRfU1RBVEVcIixcblx0XHRcdFx0dmFsdWVzOiBbXCJBTExcIl1cblx0XHRcdH1cblx0XHRdO1xuXHR9XG5cdHJldHVybiBvZmlsdGVyQ29uZGl0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlckNvbmRpdGlvbnMoZW50aXR5VHlwZTogRW50aXR5VHlwZSwgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IFJlY29yZDxzdHJpbmcsIEZpbHRlckNvbmRpdGlvbnNbXT4ge1xuXHRsZXQgZmlsdGVyQ29uZGl0aW9ucyA9IHt9O1xuXHRjb25zdCBzZWxlY3Rpb25WYXJpYW50ID0gZ2V0U2VsZWN0aW9uVmFyaWFudChlbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0Y29uc3QgZWRpdFN0YXRlRmlsdGVyID0gZ2V0RWRpdFN0YXR1c0ZpbHRlcihlbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0Y29uc3QgZGVmYXVsdEZpbHRlcnMgPSBnZXREZWZhdWx0VmFsdWVGaWx0ZXJzKGVudGl0eVR5cGUpO1xuXHRpZiAoc2VsZWN0aW9uVmFyaWFudCB8fCAoc2VsZWN0aW9uVmFyaWFudCAmJiBkZWZhdWx0RmlsdGVycykpIHtcblx0XHRmaWx0ZXJDb25kaXRpb25zID0gZ2V0RmlsdGVyc0NvbmRpdGlvbnNGcm9tU2VsZWN0aW9uVmFyaWFudChlbnRpdHlUeXBlLCBzZWxlY3Rpb25WYXJpYW50KTtcblx0fSBlbHNlIGlmIChkZWZhdWx0RmlsdGVycykge1xuXHRcdGZpbHRlckNvbmRpdGlvbnMgPSBkZWZhdWx0RmlsdGVycztcblx0fVxuXHRpZiAoZWRpdFN0YXRlRmlsdGVyKSB7XG5cdFx0ZmlsdGVyQ29uZGl0aW9ucyA9IHsgLi4uZmlsdGVyQ29uZGl0aW9ucywgLi4uZWRpdFN0YXRlRmlsdGVyIH07XG5cdH1cblx0cmV0dXJuIGZpbHRlckNvbmRpdGlvbnM7XG59XG4iXX0=