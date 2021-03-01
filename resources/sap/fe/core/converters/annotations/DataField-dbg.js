sap.ui.define(["sap/fe/core/templating/UIFormatters", "sap/fe/core/templating/PropertyHelper"], function (UIFormatters, PropertyHelper) {
  "use strict";

  var _exports = {};
  var getAssociatedUnitProperty = PropertyHelper.getAssociatedUnitProperty;
  var getAssociatedCurrencyProperty = PropertyHelper.getAssociatedCurrencyProperty;
  var getDisplayMode = UIFormatters.getDisplayMode;

  /**
   * Identify if the given dataFieldAbstract passed is a "DataFieldForActionAbstract" (has Inline defined).
   *
   * @param {DataFieldAbstractTypes} dataField a datafield to evalute
   * @returns {boolean} validate that dataField is a DataFieldForActionAbstractTypes
   */
  function isDataFieldForActionAbstract(dataField) {
    return dataField.hasOwnProperty("Action");
  }
  /**
   * Identify if the given dataFieldAbstract passed is a "DataField" (has a Value).
   *
   * @param {DataFieldAbstractTypes} dataField a dataField to evaluate
   * @returns {boolean} validate that dataField is a DataFieldTypes
   */


  _exports.isDataFieldForActionAbstract = isDataFieldForActionAbstract;

  function isDataFieldTypes(dataField) {
    return dataField.hasOwnProperty("Value");
  }
  /**
   * Returns whether given data field has a static hidden annotation.
   *
   * @param {DataFieldAbstractTypes} dataField the datafield to check
   * @returns {boolean} true if datafield or referenced property has a static Hidden annotation, false else
   * @private
   */


  _exports.isDataFieldTypes = isDataFieldTypes;

  function isDataFieldAlwaysHidden(dataField) {
    var _dataField$annotation, _dataField$annotation2, _dataField$Value, _dataField$Value$$tar, _dataField$Value$$tar2, _dataField$Value$$tar3;

    return ((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : _dataField$annotation2.Hidden) === true || isDataFieldTypes(dataField) && ((_dataField$Value = dataField.Value) === null || _dataField$Value === void 0 ? void 0 : (_dataField$Value$$tar = _dataField$Value.$target) === null || _dataField$Value$$tar === void 0 ? void 0 : (_dataField$Value$$tar2 = _dataField$Value$$tar.annotations) === null || _dataField$Value$$tar2 === void 0 ? void 0 : (_dataField$Value$$tar3 = _dataField$Value$$tar2.UI) === null || _dataField$Value$$tar3 === void 0 ? void 0 : _dataField$Value$$tar3.Hidden) === true;
  }

  _exports.isDataFieldAlwaysHidden = isDataFieldAlwaysHidden;

  function getSemanticObjectPath(converterContext, object) {
    if (typeof object === "object") {
      var _object$Value, _object$Value$$target;

      if (isDataFieldTypes(object) && ((_object$Value = object.Value) === null || _object$Value === void 0 ? void 0 : (_object$Value$$target = _object$Value.$target) === null || _object$Value$$target === void 0 ? void 0 : _object$Value$$target.fullyQualifiedName)) {
        var _object$Value2, _object$Value2$$targe, _property$annotations, _property$annotations2;

        var property = converterContext.getEntityPropertyFromFullyQualifiedName((_object$Value2 = object.Value) === null || _object$Value2 === void 0 ? void 0 : (_object$Value2$$targe = _object$Value2.$target) === null || _object$Value2$$targe === void 0 ? void 0 : _object$Value2$$targe.fullyQualifiedName);

        if ((property === null || property === void 0 ? void 0 : (_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.Common) === null || _property$annotations2 === void 0 ? void 0 : _property$annotations2.SemanticObject) !== undefined) {
          return converterContext.getEntitySetBasedAnnotationPath(property === null || property === void 0 ? void 0 : property.fullyQualifiedName);
        }
      }
    } else {
      var _property$annotations3, _property$annotations4;

      var _property = converterContext.getEntityPropertyFromFullyQualifiedName(object);

      if ((_property === null || _property === void 0 ? void 0 : (_property$annotations3 = _property.annotations) === null || _property$annotations3 === void 0 ? void 0 : (_property$annotations4 = _property$annotations3.Common) === null || _property$annotations4 === void 0 ? void 0 : _property$annotations4.SemanticObject) !== undefined) {
        return converterContext.getEntitySetBasedAnnotationPath(_property === null || _property === void 0 ? void 0 : _property.fullyQualifiedName);
      }
    }

    return undefined;
  }
  /**
   * Collect referred properties within annotations of a property.
   *
   * @param property The property to be considered
   * @param converterContext The converter context
   * @param relatedProperties The related properties identified so far.
   * @returns The related properties identified.
   */


  _exports.getSemanticObjectPath = getSemanticObjectPath;

  function _collectPropertiesFromAnnotations(property, converterContext, relatedProperties) {
    /**
     * Helper to push unique related properties.
     *
     * @param key The property path
     * @param properties The properties object containing value property, description property...
     * @returns Index at which the property is available
     */
    function _pushUnique(key, properties) {
      if (!relatedProperties.properties.hasOwnProperty(key)) {
        relatedProperties.properties[key] = properties;
      }

      return Object.keys(relatedProperties.properties).indexOf(key);
    }
    /**
     * Helper to append the export settings template with a formatted text.
     * @param value Formatted text
     */


    function _appendTemplate(value) {
      relatedProperties.exportSettingsTemplate = relatedProperties.exportSettingsTemplate ? "".concat(relatedProperties.exportSettingsTemplate).concat(value) : "".concat(value);
    }

    if (property === null || property === void 0 ? void 0 : property.path) {
      var _property$$target, _property$$target$ann, _property$$target$ann2;

      var navigationPathPrefix = property.path.indexOf("/") > -1 ? property.path.substring(0, property.path.lastIndexOf("/") + 1) : ""; // Check for Text annotation.

      var textAnnotation = property === null || property === void 0 ? void 0 : (_property$$target = property.$target) === null || _property$$target === void 0 ? void 0 : (_property$$target$ann = _property$$target.annotations) === null || _property$$target$ann === void 0 ? void 0 : (_property$$target$ann2 = _property$$target$ann.Common) === null || _property$$target$ann2 === void 0 ? void 0 : _property$$target$ann2.Text;
      var valueIndex;
      var currencyOrUoMIndex;

      if (relatedProperties.exportSettingsTemplate) {
        // FieldGroup use-case. Need to add each Field in new line.
        _appendTemplate("\n");
      }

      if (textAnnotation === null || textAnnotation === void 0 ? void 0 : textAnnotation.path) {
        // Check for Text Arrangement.
        var dataModelObjectPath = converterContext.getDataModelObjectPath();
        var textAnnotationPropertyPath = navigationPathPrefix + textAnnotation.path;
        var displayMode = getDisplayMode(property, dataModelObjectPath);
        var descriptionIndex;

        switch (displayMode) {
          case "Value":
            valueIndex = _pushUnique(property.path, {
              value: property.$target
            });

            _appendTemplate("{".concat(valueIndex, "}"));

            break;

          case "Description":
            descriptionIndex = _pushUnique(textAnnotationPropertyPath, {
              value: textAnnotation.$target,
              description: property.$target
            }); // Keep value when exporting (split mode) on text Arrangement defined as #TextOnly (Only values are expected on paste from Excel functionality)

            _pushUnique(property.path, {
              value: property.$target
            });

            _appendTemplate("{".concat(descriptionIndex, "}"));

            break;

          case "ValueDescription":
            valueIndex = _pushUnique(property.path, {
              value: property.$target
            });
            descriptionIndex = _pushUnique(textAnnotationPropertyPath, {
              value: textAnnotation.$target,
              description: property.$target
            });

            _appendTemplate("{".concat(valueIndex, "} ({").concat(descriptionIndex, "})"));

            break;

          case "DescriptionValue":
            descriptionIndex = _pushUnique(textAnnotationPropertyPath, {
              value: textAnnotation.$target,
              description: property.$target
            });
            valueIndex = _pushUnique(property.path, {
              value: property.$target
            });

            _appendTemplate("{".concat(descriptionIndex, "} ({").concat(valueIndex, "})"));

            break;
        }
      } else {
        var _property$$target2, _property$$target2$an, _property$$target2$an2, _property$$target3, _property$$target3$an, _property$$target3$an2;

        // Check for field containing Currency Or Unit Properties.
        var currencyOrUoMProperty = getAssociatedCurrencyProperty(property.$target) || getAssociatedUnitProperty(property.$target);
        var currencyOrUnitAnnotation = (property === null || property === void 0 ? void 0 : (_property$$target2 = property.$target) === null || _property$$target2 === void 0 ? void 0 : (_property$$target2$an = _property$$target2.annotations) === null || _property$$target2$an === void 0 ? void 0 : (_property$$target2$an2 = _property$$target2$an.Measures) === null || _property$$target2$an2 === void 0 ? void 0 : _property$$target2$an2.ISOCurrency) || (property === null || property === void 0 ? void 0 : (_property$$target3 = property.$target) === null || _property$$target3 === void 0 ? void 0 : (_property$$target3$an = _property$$target3.annotations) === null || _property$$target3$an === void 0 ? void 0 : (_property$$target3$an2 = _property$$target3$an.Measures) === null || _property$$target3$an2 === void 0 ? void 0 : _property$$target3$an2.Unit);

        if (currencyOrUoMProperty) {
          valueIndex = _pushUnique(property.path, {
            value: property.$target
          });
          currencyOrUoMIndex = _pushUnique(currencyOrUoMProperty.name, {
            value: currencyOrUnitAnnotation.$target
          });

          _appendTemplate("{".concat(valueIndex, "}  {").concat(currencyOrUoMIndex, "}"));
        } else {
          // Collect underlying property
          valueIndex = _pushUnique(property.path, {
            value: property.$target
          });

          _appendTemplate("{".concat(valueIndex, "}"));
        }
      }
    }

    return relatedProperties;
  }
  /**
   * Collect properties consumed by a Data Field.
   * This is for populating the ComplexPropertyInfos of the table delegate.
   *
   * @param dataField {DataFieldAbstractTypes} The Data Field for which the properties need to be identified.
   * @param converterContext The converter context
   * @param relatedProperties {ComplexPropertyInfo} The properties identified so far.
   * @returns {ComplexPropertyInfo} The properties related to the Data Field.
   */


  function collectRelatedProperties(dataField, converterContext) {
    var _dataField$Target, _dataField$Target$$ta, _dataField$Target$$ta2;

    var relatedProperties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      properties: {}
    };

    if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataField" && dataField.Value) {
      var property = dataField.Value;
      relatedProperties = _collectPropertiesFromAnnotations(property, converterContext, relatedProperties);
    } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
      switch ((_dataField$Target = dataField.Target) === null || _dataField$Target === void 0 ? void 0 : (_dataField$Target$$ta = _dataField$Target.$target) === null || _dataField$Target$$ta === void 0 ? void 0 : _dataField$Target$$ta.$Type) {
        case "com.sap.vocabularies.UI.v1.FieldGroupType":
          (_dataField$Target$$ta2 = dataField.Target.$target.Data) === null || _dataField$Target$$ta2 === void 0 ? void 0 : _dataField$Target$$ta2.forEach(function (innerDataField) {
            relatedProperties = collectRelatedProperties(innerDataField, converterContext, relatedProperties);
          });
          break;

        case "com.sap.vocabularies.UI.v1.DataPointType":
          relatedProperties = _collectPropertiesFromAnnotations(dataField.Target.$target.Value, converterContext, relatedProperties);
          break;
      }
    }

    return relatedProperties;
  }

  _exports.collectRelatedProperties = collectRelatedProperties;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhdGFGaWVsZC50cyJdLCJuYW1lcyI6WyJpc0RhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0IiwiZGF0YUZpZWxkIiwiaGFzT3duUHJvcGVydHkiLCJpc0RhdGFGaWVsZFR5cGVzIiwiaXNEYXRhRmllbGRBbHdheXNIaWRkZW4iLCJhbm5vdGF0aW9ucyIsIlVJIiwiSGlkZGVuIiwiVmFsdWUiLCIkdGFyZ2V0IiwiZ2V0U2VtYW50aWNPYmplY3RQYXRoIiwiY29udmVydGVyQ29udGV4dCIsIm9iamVjdCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsInByb3BlcnR5IiwiZ2V0RW50aXR5UHJvcGVydHlGcm9tRnVsbHlRdWFsaWZpZWROYW1lIiwiQ29tbW9uIiwiU2VtYW50aWNPYmplY3QiLCJ1bmRlZmluZWQiLCJnZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoIiwiX2NvbGxlY3RQcm9wZXJ0aWVzRnJvbUFubm90YXRpb25zIiwicmVsYXRlZFByb3BlcnRpZXMiLCJfcHVzaFVuaXF1ZSIsImtleSIsInByb3BlcnRpZXMiLCJPYmplY3QiLCJrZXlzIiwiaW5kZXhPZiIsIl9hcHBlbmRUZW1wbGF0ZSIsInZhbHVlIiwiZXhwb3J0U2V0dGluZ3NUZW1wbGF0ZSIsInBhdGgiLCJuYXZpZ2F0aW9uUGF0aFByZWZpeCIsInN1YnN0cmluZyIsImxhc3RJbmRleE9mIiwidGV4dEFubm90YXRpb24iLCJUZXh0IiwidmFsdWVJbmRleCIsImN1cnJlbmN5T3JVb01JbmRleCIsImRhdGFNb2RlbE9iamVjdFBhdGgiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwidGV4dEFubm90YXRpb25Qcm9wZXJ0eVBhdGgiLCJkaXNwbGF5TW9kZSIsImdldERpc3BsYXlNb2RlIiwiZGVzY3JpcHRpb25JbmRleCIsImRlc2NyaXB0aW9uIiwiY3VycmVuY3lPclVvTVByb3BlcnR5IiwiZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkiLCJnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5IiwiY3VycmVuY3lPclVuaXRBbm5vdGF0aW9uIiwiTWVhc3VyZXMiLCJJU09DdXJyZW5jeSIsIlVuaXQiLCJuYW1lIiwiY29sbGVjdFJlbGF0ZWRQcm9wZXJ0aWVzIiwiJFR5cGUiLCJUYXJnZXQiLCJEYXRhIiwiZm9yRWFjaCIsImlubmVyRGF0YUZpZWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQXVCQTs7Ozs7O0FBTU8sV0FBU0EsNEJBQVQsQ0FBc0NDLFNBQXRDLEVBQXVIO0FBQzdILFdBQVFBLFNBQUQsQ0FBK0NDLGNBQS9DLENBQThELFFBQTlELENBQVA7QUFDQTtBQUVEOzs7Ozs7Ozs7O0FBTU8sV0FBU0MsZ0JBQVQsQ0FBMEJGLFNBQTFCLEVBQTBGO0FBQ2hHLFdBQVFBLFNBQUQsQ0FBOEJDLGNBQTlCLENBQTZDLE9BQTdDLENBQVA7QUFDQTtBQUVEOzs7Ozs7Ozs7OztBQU9PLFdBQVNFLHVCQUFULENBQWlDSCxTQUFqQyxFQUE2RTtBQUFBOztBQUNuRixXQUNDLDBCQUFBQSxTQUFTLENBQUNJLFdBQVYsMEdBQXVCQyxFQUF2QixrRkFBMkJDLE1BQTNCLE1BQXNDLElBQXRDLElBQ0NKLGdCQUFnQixDQUFDRixTQUFELENBQWhCLElBQStCLHFCQUFBQSxTQUFTLENBQUNPLEtBQVYsK0ZBQWlCQyxPQUFqQiwwR0FBMEJKLFdBQTFCLDRHQUF1Q0MsRUFBdkMsa0ZBQTJDQyxNQUEzQyxNQUFzRCxJQUZ2RjtBQUlBOzs7O0FBRU0sV0FBU0cscUJBQVQsQ0FBK0JDLGdCQUEvQixFQUFtRUMsTUFBbkUsRUFBb0c7QUFDMUcsUUFBSSxPQUFPQSxNQUFQLEtBQWtCLFFBQXRCLEVBQWdDO0FBQUE7O0FBQy9CLFVBQUlULGdCQUFnQixDQUFDUyxNQUFELENBQWhCLHNCQUE0QkEsTUFBTSxDQUFDSixLQUFuQywyRUFBNEIsY0FBY0MsT0FBMUMsMERBQTRCLHNCQUF1Qkksa0JBQW5ELENBQUosRUFBMkU7QUFBQTs7QUFDMUUsWUFBTUMsUUFBUSxHQUFHSCxnQkFBZ0IsQ0FBQ0ksdUNBQWpCLG1CQUF5REgs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d0JBQXdCLENBQUNLLGNBQUQsRUFBaUJoRCxnQkFBakIsRUFBbUNVLGlCQUFuQyxDQUE1QztBQUNBLFdBRkQ7QUFHQTs7QUFFRDtBQUNDQSxVQUFBQSxpQkFBaUIsR0FBR0QsaUNBQWlDLENBQUNuQixTQUFTLENBQUN1RCxNQUFWLENBQWlCL0MsT0FBakIsQ0FBeUJELEtBQTFCLEVBQWlDRyxnQkFBakMsRUFBbURVLGlCQUFuRCxDQUFyRDtBQUNBO0FBVEY7QUFXQTs7QUFFRCxXQUFPQSxpQkFBUDtBQUNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHREYXRhRmllbGRBYnN0cmFjdFR5cGVzLFxuXHREYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdFR5cGVzLFxuXHREYXRhRmllbGRUeXBlcyxcblx0UHJvcGVydHlBbm5vdGF0aW9uVmFsdWUsXG5cdFVJQW5ub3RhdGlvblR5cGVzXG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0ICogYXMgRWRtIGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L0VkbVwiO1xuaW1wb3J0IHsgQ29udmVydGVyQ29udGV4dCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL3RlbXBsYXRlcy9CYXNlQ29udmVydGVyXCI7XG5pbXBvcnQgeyBnZXREaXNwbGF5TW9kZSwgUHJvcGVydHlPclBhdGggfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9VSUZvcm1hdHRlcnNcIjtcbmltcG9ydCB7IFByb3BlcnR5IH0gZnJvbSBcIkBzYXAtdXgvYW5ub3RhdGlvbi1jb252ZXJ0ZXJcIjtcbmltcG9ydCB7IGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5LCBnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5IH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvUHJvcGVydHlIZWxwZXJcIjtcblxuZXhwb3J0IHR5cGUgQ29sbGVjdGVkUHJvcGVydGllcyA9IHtcblx0dmFsdWU6IFByb3BlcnR5O1xuXHRkZXNjcmlwdGlvbj86IFByb3BlcnR5O1xufTtcblxuZXhwb3J0IHR5cGUgQ29tcGxleFByb3BlcnR5SW5mbyA9IHtcblx0cHJvcGVydGllczogUmVjb3JkPHN0cmluZywgQ29sbGVjdGVkUHJvcGVydGllcz47XG5cdGV4cG9ydFNldHRpbmdzVGVtcGxhdGU/OiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIElkZW50aWZ5IGlmIHRoZSBnaXZlbiBkYXRhRmllbGRBYnN0cmFjdCBwYXNzZWQgaXMgYSBcIkRhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0XCIgKGhhcyBJbmxpbmUgZGVmaW5lZCkuXG4gKlxuICogQHBhcmFtIHtEYXRhRmllbGRBYnN0cmFjdFR5cGVzfSBkYXRhRmllbGQgYSBkYXRhZmllbGQgdG8gZXZhbHV0ZVxuICogQHJldHVybnMge2Jvb2xlYW59IHZhbGlkYXRlIHRoYXQgZGF0YUZpZWxkIGlzIGEgRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3RUeXBlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdChkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpOiBkYXRhRmllbGQgaXMgRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3RUeXBlcyB7XG5cdHJldHVybiAoZGF0YUZpZWxkIGFzIERhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0VHlwZXMpLmhhc093blByb3BlcnR5KFwiQWN0aW9uXCIpO1xufVxuXG4vKipcbiAqIElkZW50aWZ5IGlmIHRoZSBnaXZlbiBkYXRhRmllbGRBYnN0cmFjdCBwYXNzZWQgaXMgYSBcIkRhdGFGaWVsZFwiIChoYXMgYSBWYWx1ZSkuXG4gKlxuICogQHBhcmFtIHtEYXRhRmllbGRBYnN0cmFjdFR5cGVzfSBkYXRhRmllbGQgYSBkYXRhRmllbGQgdG8gZXZhbHVhdGVcbiAqIEByZXR1cm5zIHtib29sZWFufSB2YWxpZGF0ZSB0aGF0IGRhdGFGaWVsZCBpcyBhIERhdGFGaWVsZFR5cGVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFGaWVsZFR5cGVzKGRhdGFGaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcyk6IGRhdGFGaWVsZCBpcyBEYXRhRmllbGRUeXBlcyB7XG5cdHJldHVybiAoZGF0YUZpZWxkIGFzIERhdGFGaWVsZFR5cGVzKS5oYXNPd25Qcm9wZXJ0eShcIlZhbHVlXCIpO1xufVxuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBnaXZlbiBkYXRhIGZpZWxkIGhhcyBhIHN0YXRpYyBoaWRkZW4gYW5ub3RhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0RhdGFGaWVsZEFic3RyYWN0VHlwZXN9IGRhdGFGaWVsZCB0aGUgZGF0YWZpZWxkIHRvIGNoZWNrXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBkYXRhZmllbGQgb3IgcmVmZXJlbmNlZCBwcm9wZXJ0eSBoYXMgYSBzdGF0aWMgSGlkZGVuIGFubm90YXRpb24sIGZhbHNlIGVsc2VcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFGaWVsZEFsd2F5c0hpZGRlbihkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpOiBib29sZWFuIHtcblx0cmV0dXJuIChcblx0XHRkYXRhRmllbGQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4gPT09IHRydWUgfHxcblx0XHQoaXNEYXRhRmllbGRUeXBlcyhkYXRhRmllbGQpICYmIGRhdGFGaWVsZC5WYWx1ZT8uJHRhcmdldD8uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4gPT09IHRydWUpXG5cdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZW1hbnRpY09iamVjdFBhdGgoY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCwgb2JqZWN0OiBhbnkpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRpZiAodHlwZW9mIG9iamVjdCA9PT0gXCJvYmplY3RcIikge1xuXHRcdGlmIChpc0RhdGFGaWVsZFR5cGVzKG9iamVjdCkgJiYgb2JqZWN0LlZhbHVlPy4kdGFyZ2V0Py5mdWxseVF1YWxpZmllZE5hbWUpIHtcblx0XHRcdGNvbnN0IHByb3BlcnR5ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlQcm9wZXJ0eUZyb21GdWxseVF1YWxpZmllZE5hbWUob2JqZWN0LlZhbHVlPy4kdGFyZ2V0Py5mdWxseVF1YWxpZmllZE5hbWUpO1xuXHRcdFx0aWYgKHByb3BlcnR5Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5TZW1hbnRpY09iamVjdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgocHJvcGVydHk/LmZ1bGx5UXVhbGlmaWVkTmFtZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IHByb3BlcnR5ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlQcm9wZXJ0eUZyb21GdWxseVF1YWxpZmllZE5hbWUob2JqZWN0KTtcblx0XHRpZiAocHJvcGVydHk/LmFubm90YXRpb25zPy5Db21tb24/LlNlbWFudGljT2JqZWN0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgocHJvcGVydHk/LmZ1bGx5UXVhbGlmaWVkTmFtZSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ29sbGVjdCByZWZlcnJlZCBwcm9wZXJ0aWVzIHdpdGhpbiBhbm5vdGF0aW9ucyBvZiBhIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0eSBUaGUgcHJvcGVydHkgdG8gYmUgY29uc2lkZXJlZFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcGFyYW0gcmVsYXRlZFByb3BlcnRpZXMgVGhlIHJlbGF0ZWQgcHJvcGVydGllcyBpZGVudGlmaWVkIHNvIGZhci5cbiAqIEByZXR1cm5zIFRoZSByZWxhdGVkIHByb3BlcnRpZXMgaWRlbnRpZmllZC5cbiAqL1xuZnVuY3Rpb24gX2NvbGxlY3RQcm9wZXJ0aWVzRnJvbUFubm90YXRpb25zKFxuXHRwcm9wZXJ0eTogUHJvcGVydHlBbm5vdGF0aW9uVmFsdWU8RWRtLlByaW1pdGl2ZVR5cGU+LFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRyZWxhdGVkUHJvcGVydGllczogQ29tcGxleFByb3BlcnR5SW5mb1xuKTogQ29tcGxleFByb3BlcnR5SW5mbyB7XG5cdC8qKlxuXHQgKiBIZWxwZXIgdG8gcHVzaCB1bmlxdWUgcmVsYXRlZCBwcm9wZXJ0aWVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBwcm9wZXJ0eSBwYXRoXG5cdCAqIEBwYXJhbSBwcm9wZXJ0aWVzIFRoZSBwcm9wZXJ0aWVzIG9iamVjdCBjb250YWluaW5nIHZhbHVlIHByb3BlcnR5LCBkZXNjcmlwdGlvbiBwcm9wZXJ0eS4uLlxuXHQgKiBAcmV0dXJucyBJbmRleCBhdCB3aGljaCB0aGUgcHJvcGVydHkgaXMgYXZhaWxhYmxlXG5cdCAqL1xuXHRmdW5jdGlvbiBfcHVzaFVuaXF1ZShrZXk6IHN0cmluZywgcHJvcGVydGllczogQ29sbGVjdGVkUHJvcGVydGllcyk6IG51bWJlciB7XG5cdFx0aWYgKCFyZWxhdGVkUHJvcGVydGllcy5wcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLnByb3BlcnRpZXNba2V5XSA9IHByb3BlcnRpZXM7XG5cdFx0fVxuXHRcdHJldHVybiBPYmplY3Qua2V5cyhyZWxhdGVkUHJvcGVydGllcy5wcm9wZXJ0aWVzKS5pbmRleE9mKGtleSk7XG5cdH1cblxuXHQvKipcblx0ICogSGVscGVyIHRvIGFwcGVuZCB0aGUgZXhwb3J0IHNldHRpbmdzIHRlbXBsYXRlIHdpdGggYSBmb3JtYXR0ZWQgdGV4dC5cblx0ICogQHBhcmFtIHZhbHVlIEZvcm1hdHRlZCB0ZXh0XG5cdCAqL1xuXHRmdW5jdGlvbiBfYXBwZW5kVGVtcGxhdGUodmFsdWU6IHN0cmluZykge1xuXHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLmV4cG9ydFNldHRpbmdzVGVtcGxhdGUgPSByZWxhdGVkUHJvcGVydGllcy5leHBvcnRTZXR0aW5nc1RlbXBsYXRlXG5cdFx0XHQ/IGAke3JlbGF0ZWRQcm9wZXJ0aWVzLmV4cG9ydFNldHRpbmdzVGVtcGxhdGV9JHt2YWx1ZX1gXG5cdFx0XHQ6IGAke3ZhbHVlfWA7XG5cdH1cblxuXHRpZiAocHJvcGVydHk/LnBhdGgpIHtcblx0XHRjb25zdCBuYXZpZ2F0aW9uUGF0aFByZWZpeCA9IHByb3BlcnR5LnBhdGguaW5kZXhPZihcIi9cIikgPiAtMSA/IHByb3BlcnR5LnBhdGguc3Vic3RyaW5nKDAsIHByb3BlcnR5LnBhdGgubGFzdEluZGV4T2YoXCIvXCIpICsgMSkgOiBcIlwiO1xuXG5cdFx0Ly8gQ2hlY2sgZm9yIFRleHQgYW5ub3RhdGlvbi5cblx0XHRjb25zdCB0ZXh0QW5ub3RhdGlvbiA9IHByb3BlcnR5Py4kdGFyZ2V0Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UZXh0O1xuXHRcdGxldCB2YWx1ZUluZGV4OiBudW1iZXI7XG5cdFx0bGV0IGN1cnJlbmN5T3JVb01JbmRleDogbnVtYmVyO1xuXG5cdFx0aWYgKHJlbGF0ZWRQcm9wZXJ0aWVzLmV4cG9ydFNldHRpbmdzVGVtcGxhdGUpIHtcblx0XHRcdC8vIEZpZWxkR3JvdXAgdXNlLWNhc2UuIE5lZWQgdG8gYWRkIGVhY2ggRmllbGQgaW4gbmV3IGxpbmUuXG5cdFx0XHRfYXBwZW5kVGVtcGxhdGUoXCJcXG5cIik7XG5cdFx0fVxuXG5cdFx0aWYgKHRleHRBbm5vdGF0aW9uPy5wYXRoKSB7XG5cdFx0XHQvLyBDaGVjayBmb3IgVGV4dCBBcnJhbmdlbWVudC5cblx0XHRcdGNvbnN0IGRhdGFNb2RlbE9iamVjdFBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKTtcblx0XHRcdGNvbnN0IHRleHRBbm5vdGF0aW9uUHJvcGVydHlQYXRoID0gbmF2aWdhdGlvblBhdGhQcmVmaXggKyB0ZXh0QW5ub3RhdGlvbi5wYXRoO1xuXHRcdFx0Y29uc3QgZGlzcGxheU1vZGUgPSBnZXREaXNwbGF5TW9kZShwcm9wZXJ0eSBhcyBQcm9wZXJ0eU9yUGF0aDxQcm9wZXJ0eT4sIGRhdGFNb2RlbE9iamVjdFBhdGgpO1xuXHRcdFx0bGV0IGRlc2NyaXB0aW9uSW5kZXg6IG51bWJlcjtcblx0XHRcdHN3aXRjaCAoZGlzcGxheU1vZGUpIHtcblx0XHRcdFx0Y2FzZSBcIlZhbHVlXCI6XG5cdFx0XHRcdFx0dmFsdWVJbmRleCA9IF9wdXNoVW5pcXVlKHByb3BlcnR5LnBhdGgsIHsgdmFsdWU6IHByb3BlcnR5LiR0YXJnZXQgfSk7XG5cdFx0XHRcdFx0X2FwcGVuZFRlbXBsYXRlKGB7JHt2YWx1ZUluZGV4fX1gKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFwiRGVzY3JpcHRpb25cIjpcblx0XHRcdFx0XHRkZXNjcmlwdGlvbkluZGV4ID0gX3B1c2hVbmlxdWUodGV4dEFubm90YXRpb25Qcm9wZXJ0eVBhdGgsIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB0ZXh0QW5ub3RhdGlvbi4kdGFyZ2V0LFxuXHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IHByb3BlcnR5LiR0YXJnZXRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvLyBLZWVwIHZhbHVlIHdoZW4gZXhwb3J0aW5nIChzcGxpdCBtb2RlKSBvbiB0ZXh0IEFycmFuZ2VtZW50IGRlZmluZWQgYXMgI1RleHRPbmx5IChPbmx5IHZhbHVlcyBhcmUgZXhwZWN0ZWQgb24gcGFzdGUgZnJvbSBFeGNlbCBmdW5jdGlvbmFsaXR5KVxuXHRcdFx0XHRcdF9wdXNoVW5pcXVlKHByb3BlcnR5LnBhdGgsIHsgdmFsdWU6IHByb3BlcnR5LiR0YXJnZXQgfSk7XG5cdFx0XHRcdFx0X2FwcGVuZFRlbXBsYXRlKGB7JHtkZXNjcmlwdGlvbkluZGV4fX1gKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFwiVmFsdWVEZXNjcmlwdGlvblwiOlxuXHRcdFx0XHRcdHZhbHVlSW5kZXggPSBfcHVzaFVuaXF1ZShwcm9wZXJ0eS5wYXRoLCB7IHZhbHVlOiBwcm9wZXJ0eS4kdGFyZ2V0IH0pO1xuXHRcdFx0XHRcdGRlc2NyaXB0aW9uSW5kZXggPSBfcHVzaFVuaXF1ZSh0ZXh0QW5ub3RhdGlvblByb3BlcnR5UGF0aCwge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHRleHRBbm5vdGF0aW9uLiR0YXJnZXQsXG5cdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogcHJvcGVydHkuJHRhcmdldFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdF9hcHBlbmRUZW1wbGF0ZShgeyR7dmFsdWVJbmRleH19ICh7JHtkZXNjcmlwdGlvbkluZGV4fX0pYCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBcIkRlc2NyaXB0aW9uVmFsdWVcIjpcblx0XHRcdFx0XHRkZXNjcmlwdGlvbkluZGV4ID0gX3B1c2hVbmlxdWUodGV4dEFubm90YXRpb25Qcm9wZXJ0eVBhdGgsIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB0ZXh0QW5ub3RhdGlvbi4kdGFyZ2V0LFxuXHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IHByb3BlcnR5LiR0YXJnZXRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR2YWx1ZUluZGV4ID0gX3B1c2hVbmlxdWUocHJvcGVydHkucGF0aCwgeyB2YWx1ZTogcHJvcGVydHkuJHRhcmdldCB9KTtcblx0XHRcdFx0XHRfYXBwZW5kVGVtcGxhdGUoYHske2Rlc2NyaXB0aW9uSW5kZXh9fSAoeyR7dmFsdWVJbmRleH19KWApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBDaGVjayBmb3IgZmllbGQgY29udGFpbmluZyBDdXJyZW5jeSBPciBVbml0IFByb3BlcnRpZXMuXG5cdFx0XHRjb25zdCBjdXJyZW5jeU9yVW9NUHJvcGVydHkgPSBnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eShwcm9wZXJ0eS4kdGFyZ2V0KSB8fCBnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5KHByb3BlcnR5LiR0YXJnZXQpO1xuXHRcdFx0Y29uc3QgY3VycmVuY3lPclVuaXRBbm5vdGF0aW9uID1cblx0XHRcdFx0cHJvcGVydHk/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3kgfHwgcHJvcGVydHk/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdDtcblx0XHRcdGlmIChjdXJyZW5jeU9yVW9NUHJvcGVydHkpIHtcblx0XHRcdFx0dmFsdWVJbmRleCA9IF9wdXNoVW5pcXVlKHByb3BlcnR5LnBhdGgsIHsgdmFsdWU6IHByb3BlcnR5LiR0YXJnZXQgfSk7XG5cdFx0XHRcdGN1cnJlbmN5T3JVb01JbmRleCA9IF9wdXNoVW5pcXVlKGN1cnJlbmN5T3JVb01Qcm9wZXJ0eS5uYW1lLCB7IHZhbHVlOiBjdXJyZW5jeU9yVW5pdEFubm90YXRpb24uJHRhcmdldCB9KTtcblx0XHRcdFx0X2FwcGVuZFRlbXBsYXRlKGB7JHt2YWx1ZUluZGV4fX0gIHske2N1cnJlbmN5T3JVb01JbmRleH19YCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBDb2xsZWN0IHVuZGVybHlpbmcgcHJvcGVydHlcblx0XHRcdFx0dmFsdWVJbmRleCA9IF9wdXNoVW5pcXVlKHByb3BlcnR5LnBhdGgsIHsgdmFsdWU6IHByb3BlcnR5LiR0YXJnZXQgfSk7XG5cdFx0XHRcdF9hcHBlbmRUZW1wbGF0ZShgeyR7dmFsdWVJbmRleH19YCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZWxhdGVkUHJvcGVydGllcztcbn1cblxuLyoqXG4gKiBDb2xsZWN0IHByb3BlcnRpZXMgY29uc3VtZWQgYnkgYSBEYXRhIEZpZWxkLlxuICogVGhpcyBpcyBmb3IgcG9wdWxhdGluZyB0aGUgQ29tcGxleFByb3BlcnR5SW5mb3Mgb2YgdGhlIHRhYmxlIGRlbGVnYXRlLlxuICpcbiAqIEBwYXJhbSBkYXRhRmllbGQge0RhdGFGaWVsZEFic3RyYWN0VHlwZXN9IFRoZSBEYXRhIEZpZWxkIGZvciB3aGljaCB0aGUgcHJvcGVydGllcyBuZWVkIHRvIGJlIGlkZW50aWZpZWQuXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHRcbiAqIEBwYXJhbSByZWxhdGVkUHJvcGVydGllcyB7Q29tcGxleFByb3BlcnR5SW5mb30gVGhlIHByb3BlcnRpZXMgaWRlbnRpZmllZCBzbyBmYXIuXG4gKiBAcmV0dXJucyB7Q29tcGxleFByb3BlcnR5SW5mb30gVGhlIHByb3BlcnRpZXMgcmVsYXRlZCB0byB0aGUgRGF0YSBGaWVsZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbGxlY3RSZWxhdGVkUHJvcGVydGllcyhcblx0ZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRyZWxhdGVkUHJvcGVydGllczogQ29tcGxleFByb3BlcnR5SW5mbyA9IHsgcHJvcGVydGllczoge30gfVxuKTogQ29tcGxleFByb3BlcnR5SW5mbyB7XG5cdGlmIChkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZCAmJiBkYXRhRmllbGQuVmFsdWUpIHtcblx0XHRjb25zdCBwcm9wZXJ0eSA9IGRhdGFGaWVsZC5WYWx1ZTtcblx0XHRyZWxhdGVkUHJvcGVydGllcyA9IF9jb2xsZWN0UHJvcGVydGllc0Zyb21Bbm5vdGF0aW9ucyhwcm9wZXJ0eSwgY29udmVydGVyQ29udGV4dCwgcmVsYXRlZFByb3BlcnRpZXMpO1xuXHR9IGVsc2UgaWYgKGRhdGFGaWVsZC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQW5ub3RhdGlvbikge1xuXHRcdHN3aXRjaCAoZGF0YUZpZWxkLlRhcmdldD8uJHRhcmdldD8uJFR5cGUpIHtcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRmllbGRHcm91cFR5cGU6XG5cdFx0XHRcdGRhdGFGaWVsZC5UYXJnZXQuJHRhcmdldC5EYXRhPy5mb3JFYWNoKChpbm5lckRhdGFGaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcykgPT4ge1xuXHRcdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzID0gY29sbGVjdFJlbGF0ZWRQcm9wZXJ0aWVzKGlubmVyRGF0YUZpZWxkLCBjb252ZXJ0ZXJDb250ZXh0LCByZWxhdGVkUHJvcGVydGllcyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhUG9pbnRUeXBlOlxuXHRcdFx0XHRyZWxhdGVkUHJvcGVydGllcyA9IF9jb2xsZWN0UHJvcGVydGllc0Zyb21Bbm5vdGF0aW9ucyhkYXRhRmllbGQuVGFyZ2V0LiR0YXJnZXQuVmFsdWUsIGNvbnZlcnRlckNvbnRleHQsIHJlbGF0ZWRQcm9wZXJ0aWVzKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlbGF0ZWRQcm9wZXJ0aWVzO1xufVxuIl19