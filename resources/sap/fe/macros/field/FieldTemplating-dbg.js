sap.ui.define(["sap/fe/core/templating/UIFormatters", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/templating/PropertyHelper", "sap/fe/core/formatters/ValueFormatter"], function (UIFormatters, DataModelPathHelper, BindingExpression, PropertyHelper, valueFormatters) {
  "use strict";

  var _exports = {};
  var isPathExpression = PropertyHelper.isPathExpression;
  var bindingExpression = BindingExpression.bindingExpression;
  var compileBinding = BindingExpression.compileBinding;
  var transformRecursively = BindingExpression.transformRecursively;
  var formatResult = BindingExpression.formatResult;
  var annotationExpression = BindingExpression.annotationExpression;
  var getPathRelativeLocation = DataModelPathHelper.getPathRelativeLocation;
  var enhanceDataModelPath = DataModelPathHelper.enhanceDataModelPath;
  var getDisplayMode = UIFormatters.getDisplayMode;

  /**
   * Recursively add the text arrangement to a binding expression.
   *
   * @param bindingExpression the binding expression to enhance
   * @param fullContextPath the current context path we're on (to properly resolve the text arrangement properties)
   * @returns an updated expression.
   */
  var addTextArrangementToBindingExpression = function (bindingExpression, fullContextPath) {
    return transformRecursively(bindingExpression, "Binding", function (expression) {
      var outExpression = expression;

      if (expression.modelName === undefined) {
        // In case of default model we then need to resolve the text arrangement property
        var oPropertyDataModelPath = enhanceDataModelPath(fullContextPath, expression.path);
        outExpression = getBindingWithTextArrangement(oPropertyDataModelPath, expression);
      }

      return outExpression;
    });
  };

  _exports.addTextArrangementToBindingExpression = addTextArrangementToBindingExpression;

  var getBindingWithTextArrangement = function (oPropertyDataModelPath, propertyBindingExpression) {
    var _oPropertyDefinition$, _oPropertyDefinition$2;

    var outExpression = propertyBindingExpression;
    var oPropertyDefinition = oPropertyDataModelPath.targetObject;
    var targetDisplayMode = getDisplayMode(oPropertyDefinition, oPropertyDataModelPath);
    var commonText = (_oPropertyDefinition$ = oPropertyDefinition.annotations) === null || _oPropertyDefinition$ === void 0 ? void 0 : (_oPropertyDefinition$2 = _oPropertyDefinition$.Common) === null || _oPropertyDefinition$2 === void 0 ? void 0 : _oPropertyDefinition$2.Text;
    var relativeLocation = getPathRelativeLocation(oPropertyDataModelPath.contextLocation, oPropertyDataModelPath.navigationProperties);
    propertyBindingExpression = formatLabel(oPropertyDataModelPath, propertyBindingExpression);

    if (targetDisplayMode !== "Value" && commonText) {
      switch (targetDisplayMode) {
        case "Description":
          outExpression = annotationExpression(commonText, relativeLocation);
          break;

        case "DescriptionValue":
          outExpression = formatResult([annotationExpression(commonText, relativeLocation), propertyBindingExpression], valueFormatters.formatWithBrackets);
          break;

        case "ValueDescription":
          outExpression = formatResult([propertyBindingExpression, annotationExpression(commonText, relativeLocation)], valueFormatters.formatWithBrackets);
          break;
      }
    }

    return outExpression;
  };

  _exports.getBindingWithTextArrangement = getBindingWithTextArrangement;

  var formatValueRecursively = function (bindingExpression, fullContextPath) {
    return transformRecursively(bindingExpression, "Binding", function (expression) {
      var outExpression = expression;

      if (expression.modelName === undefined) {
        // In case of default model we then need to resolve the text arrangement property
        var oPropertyDataModelPath = enhanceDataModelPath(fullContextPath, expression.path);
        outExpression = formatLabel(oPropertyDataModelPath, expression);
      }

      return outExpression;
    });
  };

  _exports.formatValueRecursively = formatValueRecursively;
  var EDM_TYPE_MAPPING = {
    "Edm.Boolean": {
      type: "sap.ui.model.odata.type.Boolean"
    },
    "Edm.Byte": {
      type: "sap.ui.model.odata.type.Byte"
    },
    "Edm.Date": {
      type: "sap.ui.model.odata.type.Date"
    },
    "Edm.DateTimeOffset": {
      constraints: {
        "$Precision": "precision"
      },
      type: "sap.ui.model.odata.type.DateTimeOffset"
    },
    "Edm.Decimal": {
      constraints: {
        "@Org.OData.Validation.V1.Minimum/$Decimal": "minimum",
        "@Org.OData.Validation.V1.Minimum@Org.OData.Validation.V1.Exclusive": "minimumExclusive",
        "@Org.OData.Validation.V1.Maximum/$Decimal": "maximum",
        "@Org.OData.Validation.V1.Maximum@Org.OData.Validation.V1.Exclusive": "maximumExclusive",
        "$Precision": "precision",
        "$Scale": "scale"
      },
      type: "sap.ui.model.odata.type.Decimal"
    },
    "Edm.Double": {
      type: "sap.ui.model.odata.type.Double"
    },
    "Edm.Guid": {
      type: "sap.ui.model.odata.type.Guid"
    },
    "Edm.Int16": {
      type: "sap.ui.model.odata.type.Int16"
    },
    "Edm.Int32": {
      type: "sap.ui.model.odata.type.Int32"
    },
    "Edm.Int64": {
      type: "sap.ui.model.odata.type.Int64"
    },
    "Edm.SByte": {
      type: "sap.ui.model.odata.type.SByte"
    },
    "Edm.Single": {
      type: "sap.ui.model.odata.type.Single"
    },
    "Edm.Stream": {
      type: "sap.ui.model.odata.type.Stream"
    },
    "Edm.String": {
      constraints: {
        "@com.sap.vocabularies.Common.v1.IsDigitSequence": "isDigitSequence",
        "$MaxLength": "maxLength"
      },
      type: "sap.ui.model.odata.type.String"
    },
    "Edm.TimeOfDay": {
      constraints: {
        "$Precision": "precision"
      },
      type: "sap.ui.model.odata.type.TimeOfDay"
    }
  };

  var formatLabel = function (oPropertyDataModelPath, propertyBindingExpression) {
    var outExpression = propertyBindingExpression;
    var oProperty = oPropertyDataModelPath.targetObject;

    if (oProperty._type === "Property") {
      var oTargetMapping = EDM_TYPE_MAPPING[oProperty.type];

      if (oTargetMapping) {
        outExpression.type = oTargetMapping.type;

        if (oTargetMapping.constraints) {
          outExpression.constraints = {};

          if (oTargetMapping.constraints.$Scale && oProperty.scale !== undefined) {
            outExpression.constraints.scale = oProperty.scale;
          }

          if (oTargetMapping.constraints.$Precision && oProperty.precision !== undefined) {
            outExpression.constraints.precision = oProperty.precision;
          }

          if (oTargetMapping.constraints.$MaxLength && oProperty.maxLength !== undefined) {
            outExpression.constraints.maxLength = oProperty.maxLength;
          }
        }
      }
    }

    return outExpression;
  };

  _exports.formatLabel = formatLabel;

  var getValueBinding = function (oPropertyPath, entityTypePath) {
    var aPropertyPath = getPathRelativeLocation(entityTypePath, oPropertyPath.navigationProperties);
    aPropertyPath.push(oPropertyPath.targetObject.name);
    var oBindingExpression = bindingExpression(aPropertyPath.join("/"));
    return compileBinding(formatLabel(oPropertyPath, oBindingExpression));
  };

  _exports.getValueBinding = getValueBinding;

  var getFieldStyle = function (oPropertyPath, oDataField, oDataModelPath, formatOptions) {
    var _oProperty$annotation, _oProperty$annotation2, _oProperty$annotation3, _oProperty$annotation4, _oProperty$annotation5, _oProperty$annotation6, _oProperty$annotation7, _oProperty$annotation8, _oDataModelPath$targe, _oDataModelPath$targe2, _oDataModelPath$targe3, _oDataModelPath$targe4, _oProperty$annotation9, _oProperty$annotation10, _oDataModelPath$targe8, _oDataModelPath$targe9, _oProperty$annotation11, _oProperty$annotation12;

    // algorithm to determine the field fragment to use
    if (!oPropertyPath || typeof oPropertyPath === "string") {
      return "Text";
    }

    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath;

    if ((_oProperty$annotation = oProperty.annotations) === null || _oProperty$annotation === void 0 ? void 0 : (_oProperty$annotation2 = _oProperty$annotation.UI) === null || _oProperty$annotation2 === void 0 ? void 0 : _oProperty$annotation2.IsImageURL) {
      return "Avatar";
    }

    if (oProperty.type === "Edm.Stream") {
      return "Avatar";
    } // Datapoint


    if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataPointType" || oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && oDataField.Target.$target && oDataField.Target.$target.$Type === "com.sap.vocabularies.UI.v1.DataPointType") {
      return "Datapoint"; //TODO
    }

    if (oDataField.Criticality) {
      return "ObjectStatus";
    }

    if ((_oProperty$annotation3 = oProperty.annotations) === null || _oProperty$annotation3 === void 0 ? void 0 : (_oProperty$annotation4 = _oProperty$annotation3.Measures) === null || _oProperty$annotation4 === void 0 ? void 0 : _oProperty$annotation4.ISOCurrency) {
      return "AmountWithCurrency";
    }

    if (((_oProperty$annotation5 = oProperty.annotations) === null || _oProperty$annotation5 === void 0 ? void 0 : (_oProperty$annotation6 = _oProperty$annotation5.Communication) === null || _oProperty$annotation6 === void 0 ? void 0 : _oProperty$annotation6.IsEmailAddress) || ((_oProperty$annotation7 = oProperty.annotations) === null || _oProperty$annotation7 === void 0 ? void 0 : (_oProperty$annotation8 = _oProperty$annotation7.Communication) === null || _oProperty$annotation8 === void 0 ? void 0 : _oProperty$annotation8.IsPhoneNumber)) {
      return "Link";
    }

    if (oDataModelPath === null || oDataModelPath === void 0 ? void 0 : (_oDataModelPath$targe = oDataModelPath.targetEntitySet) === null || _oDataModelPath$targe === void 0 ? void 0 : (_oDataModelPath$targe2 = _oDataModelPath$targe.entityType) === null || _oDataModelPath$targe2 === void 0 ? void 0 : (_oDataModelPath$targe3 = _oDataModelPath$targe2.annotations) === null || _oDataModelPath$targe3 === void 0 ? void 0 : (_oDataModelPath$targe4 = _oDataModelPath$targe3.Common) === null || _oDataModelPath$targe4 === void 0 ? void 0 : _oDataModelPath$targe4.SemanticKey) {
      var aSemanticKeys = oDataModelPath.targetEntitySet.entityType.annotations.Common.SemanticKey;
      var bIsSemanticKey = !aSemanticKeys.every(function (oKey) {
        var _oKey$$target;

        return (oKey === null || oKey === void 0 ? void 0 : (_oKey$$target = oKey.$target) === null || _oKey$$target === void 0 ? void 0 : _oKey$$target.name) !== oProperty.name; // need to check if it works also for direct properties
      });

      if (bIsSemanticKey && formatOptions.semanticKeyStyle) {
        var _oDataModelPath$targe5, _oDataModelPath$targe6, _oDataModelPath$targe7;

        if ((_oDataModelPath$targe5 = oDataModelPath.targetEntitySet) === null || _oDataModelPath$targe5 === void 0 ? void 0 : (_oDataModelPath$targe6 = _oDataModelPath$targe5.annotations) === null || _oDataModelPath$targe6 === void 0 ? void 0 : (_oDataModelPath$targe7 = _oDataModelPath$targe6.Common) === null || _oDataModelPath$targe7 === void 0 ? void 0 : _oDataModelPath$targe7.DraftRoot) {
          // we then still check whether this is available at designtime on the entityset
          return "SemanticKeyWithDraftIndicator";
        }

        return formatOptions.semanticKeyStyle === "ObjectIdentifier" ? "ObjectIdentifier" : "LabelSemanticKey";
      }
    }

    if ((_oProperty$annotation9 = oProperty.annotations) === null || _oProperty$annotation9 === void 0 ? void 0 : (_oProperty$annotation10 = _oProperty$annotation9.UI) === null || _oProperty$annotation10 === void 0 ? void 0 : _oProperty$annotation10.MultiLineText) {
      return "Text";
    }

    var aNavigationProperties = (oDataModelPath === null || oDataModelPath === void 0 ? void 0 : (_oDataModelPath$targe8 = oDataModelPath.targetEntitySet) === null || _oDataModelPath$targe8 === void 0 ? void 0 : (_oDataModelPath$targe9 = _oDataModelPath$targe8.entityType) === null || _oDataModelPath$targe9 === void 0 ? void 0 : _oDataModelPath$targe9.navigationProperties) || [];
    var bIsUsedInNavigationWithQuickViewFacets = false;
    aNavigationProperties.forEach(function (oNavProp) {
      if (oNavProp.referentialConstraint && oNavProp.referentialConstraint.length) {
        oNavProp.referentialConstraint.forEach(function (oRefConstraint) {
          if ((oRefConstraint === null || oRefConstraint === void 0 ? void 0 : oRefConstraint.sourceProperty) === oProperty.name) {
            var _oNavProp$targetType, _oNavProp$targetType$, _oNavProp$targetType$2;

            if (oNavProp === null || oNavProp === void 0 ? void 0 : (_oNavProp$targetType = oNavProp.targetType) === null || _oNavProp$targetType === void 0 ? void 0 : (_oNavProp$targetType$ = _oNavProp$targetType.annotations) === null || _oNavProp$targetType$ === void 0 ? void 0 : (_oNavProp$targetType$2 = _oNavProp$targetType$.UI) === null || _oNavProp$targetType$2 === void 0 ? void 0 : _oNavProp$targetType$2.QuickViewFacets) {
              bIsUsedInNavigationWithQuickViewFacets = true;
            }
          }
        });
      }
    });

    if (bIsUsedInNavigationWithQuickViewFacets) {
      return "LinkWithQuickViewForm";
    }

    if ((_oProperty$annotation11 = oProperty.annotations) === null || _oProperty$annotation11 === void 0 ? void 0 : (_oProperty$annotation12 = _oProperty$annotation11.Common) === null || _oProperty$annotation12 === void 0 ? void 0 : _oProperty$annotation12.SemanticObject) {
      return "LinkWrapper";
    }

    if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
      return "Link";
    }

    return "Text";
  };

  _exports.getFieldStyle = getFieldStyle;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpZWxkVGVtcGxhdGluZy50cyJdLCJuYW1lcyI6WyJhZGRUZXh0QXJyYW5nZW1lbnRUb0JpbmRpbmdFeHByZXNzaW9uIiwiYmluZGluZ0V4cHJlc3Npb24iLCJmdWxsQ29udGV4dFBhdGgiLCJ0cmFuc2Zvcm1SZWN1cnNpdmVseSIsImV4cHJlc3Npb24iLCJvdXRFeHByZXNzaW9uIiwibW9kZWxOYW1lIiwidW5kZWZpbmVkIiwib1Byb3BlcnR5RGF0YU1vZGVsUGF0aCIsImVuaGFuY2VEYXRhTW9kZWxQYXRoIiwicGF0aCIsImdldEJpbmRpbmdXaXRoVGV4dEFycmFuZ2VtZW50IiwicHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbiIsIm9Qcm9wZXJ0eURlZmluaXRpb24iLCJ0YXJnZXRPYmplY3QiLCJ0YXJnZXREaXNwbGF5TW9kZSIsImdldERpc3BsYXlNb2RlIiwiY29tbW9uVGV4dCIsImFubm90YXRpb25zIiwiQ29tbW9uIiwiVGV4dCIsInJlbGF0aXZlTG9jYXRpb24iLCJnZXRQYXRoUmVsYXRpdmVMb2NhdGlvbiIsImNvbnRleHRMb2NhdGlvbiIsIm5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwiZm9ybWF0TGFiZWwiLCJhbm5vdGF0aW9uRXhwcmVzc2lvbiIsImZvcm1hdFJlc3VsdCIsInZhbHVlRm9ybWF0dGVycyIsImZvcm1hdFdpdGhCcmFja2V0cyIsImZvcm1hdFZhbHVlUmVjdXJzaXZlbHkiLCJFRE1fVFlQRV9NQVBQSU5HIiwidHlwZSIsImNvbnN0cmFpbnRzIiwib1Byb3BlcnR5IiwiX3R5cGUiLCJvVGFyZ2V0TWFwcGluZyIsIiRTY2FsZSIsInNjYWxlIiwiJFByZWNpc2lvbiIsInByZWNpc2lvbiIsIiRNYXhMZW5ndGgiLCJtYXhMZW5ndGgiLCJnZXRWYWx1ZUJpbmRpbmciLCJvUHJvcGVydHlQYXRoIiwiZW50aXR5VHlwZVBhdGgiLCJhUHJvcGVydHlQYXRoIiwicHVzaCIsIm5hbWUiLCJvQmluZGluZ0V4cHJlc3Npb24iLCJqb2luIiwiY29tcGlsZUJpbmRpbmciLCJnZXRGaWVsZFN0eWxlIiwib0RhdGFGaWVsZCIsIm9EYXRhTW9kZWxQYXRoIiwiZm9ybWF0T3B0aW9ucyIsImlzUGF0aEV4cHJlc3Npb24iLCIkdGFyZ2V0IiwiVUkiLCJJc0ltYWdlVVJMIiwiJFR5cGUiLCJUYXJnZXQiLCJDcml0aWNhbGl0eSIsIk1lYXN1cmVzIiwiSVNPQ3VycmVuY3kiLCJDb21tdW5pY2F0aW9uIiwiSXNFbWFpbEFkZHJlc3MiLCJJc1Bob25lTnVtYmVyIiwidGFyZ2V0RW50aXR5U2V0IiwiZW50aXR5VHlwZSIsIlNlbWFudGljS2V5IiwiYVNlbWFudGljS2V5cyIsImJJc1NlbWFudGljS2V5IiwiZXZlcnkiLCJvS2V5Iiwic2VtYW50aWNLZXlTdHlsZSIsIkRyYWZ0Um9vdCIsIk11bHRpTGluZVRleHQiLCJhTmF2aWdhdGlvblByb3BlcnRpZXMiLCJiSXNVc2VkSW5OYXZpZ2F0aW9uV2l0aFF1aWNrVmlld0ZhY2V0cyIsImZvckVhY2giLCJvTmF2UHJvcCIsInJlZmVyZW50aWFsQ29uc3RyYWludCIsImxlbmd0aCIsIm9SZWZDb25zdHJhaW50Iiwic291cmNlUHJvcGVydHkiLCJ0YXJnZXRUeXBlIiwiUXVpY2tWaWV3RmFjZXRzIiwiU2VtYW50aWNPYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOzs7Ozs7O0FBT08sTUFBTUEscUNBQXFDLEdBQUcsVUFDcERDLGlCQURvRCxFQUVwREMsZUFGb0QsRUFHbEM7QUFDbEIsV0FBT0Msb0JBQW9CLENBQUNGLGlCQUFELEVBQW9CLFNBQXBCLEVBQStCLFVBQUNHLFVBQUQsRUFBa0Q7QUFDM0csVUFBSUMsYUFBOEIsR0FBR0QsVUFBckM7O0FBQ0EsVUFBSUEsVUFBVSxDQUFDRSxTQUFYLEtBQXlCQyxTQUE3QixFQUF3QztBQUN2QztBQUNBLFlBQU1DLHNCQUFzQixHQUFHQyxvQkFBb0IsQ0FBQ1AsZUFBRCxFQUFrQkUsVUFBVSxDQUFDTSxJQUE3QixDQUFuRDtBQUNBTCxRQUFBQSxhQUFhLEdBQUdNLDZCQUE2QixDQUFDSCxzQkFBRCxFQUF5QkosVUFBekIsQ0FBN0M7QUFDQTs7QUFDRCxhQUFPQyxhQUFQO0FBQ0EsS0FSMEIsQ0FBM0I7QUFTQSxHQWJNOzs7O0FBY0EsTUFBTU0sNkJBQTZCLEdBQUcsVUFDNUNILHNCQUQ0QyxFQUU1Q0kseUJBRjRDLEVBR3ZCO0FBQUE7O0FBQ3JCLFFBQUlQLGFBQWEsR0FBR08seUJBQXBCO0FBQ0EsUUFBTUMsbUJBQW1CLEdBQUdMLHNCQUFzQixDQUFDTSxZQUFuRDtBQUNBLFFBQU1DLGlCQUFpQixHQUFHQyxjQUFjLENBQUNILG1CQUFELEVBQXNCTCxzQkFBdEIsQ0FBeEM7QUFDQSxRQUFNUyxVQUFVLDRCQUFHSixtQkFBbUIsQ0FBQ0ssV0FBdkIsb0ZBQUcsc0JBQWlDQyxNQUFwQywyREFBRyx1QkFBeUNDLElBQTVEO0FBQ0EsUUFBTUMsZ0JBQWdCLEdBQUdDLHVCQUF1QixDQUFDZCxzQkFBc0IsQ0FBQ2UsZUFBeEIsRUFBeUNmLHNCQUFzQixDQUFDZ0Isb0JBQWhFLENBQWhEO0FBQ0FaLElBQUFBLHlCQUF5QixHQUFHYSxXQUFXLENBQUNqQixzQkFBRCxFQUF5QkkseUJBQXpCLENBQXZDOztBQUNBLFFBQUlHLGlCQUFpQixLQUFLLE9BQXRCLElBQWlDRSxVQUFyQyxFQUFpRDtBQUNoRCxjQUFRRixpQkFBUjtBQUNDLGFBQUssYUFBTDtBQUNDVixVQUFBQSxhQUFhLEdBQUdxQixvQkFBb0IsQ0FBQ1QsVUFBRCxFQUFhSSxnQkFBYixDQUFwQztBQUNBOztBQUNELGFBQUssa0JBQUw7QUFDQ2hCLFVBQUFBLGFBQWEsR0FBR3NCLFlBQVksQ0FDM0IsQ0FBQ0Qsb0JBQW9CLENBQUNULFVBQUQsRUFBYUksZ0JBQWIsQ0FBckIsRUFBMkVULHlCQUEzRSxDQUQyQixFQUUzQmdCLGVBQWUsQ0FBQ0Msa0JBRlcsQ0FBNUI7QUFJQTs7QUFDRCxhQUFLLGtCQUFMO0FBQ0N4QixVQUFBQSxhQUFhLEdBQUdzQixZQUFZLENBQzNCLENBQUNmLHlCQUFELEVBQTRCYyxvQkFBb0IsQ0FBQ1QsVUFBRCxFQUFhSSxnQkFBYixDQUFoRCxDQUQyQixFQUUzQk8sZUFBZSxDQUFDQyxrQkFGVyxDQUE1QjtBQUlBO0FBZkY7QUFpQkE7O0FBQ0QsV0FBT3hCLGFBQVA7QUFDQSxHQTlCTTs7OztBQWdDQSxNQUFNeUIsc0JBQXNCLEdBQUcsVUFBUzdCLGlCQUFULEVBQTZDQyxlQUE3QyxFQUFvRztBQUN6SSxXQUFPQyxvQkFBb0IsQ0FBQ0YsaUJBQUQsRUFBb0IsU0FBcEIsRUFBK0IsVUFBQ0csVUFBRCxFQUFrRDtBQUMzRyxVQUFJQyxhQUE4QixHQUFHRCxVQUFyQzs7QUFDQSxVQUFJQSxVQUFVLENBQUNFLFNBQVgsS0FBeUJDLFNBQTdCLEVBQXdDO0FBQ3ZDO0FBQ0EsWUFBTUMsc0JBQXNCLEdBQUdDLG9CQUFvQixDQUFDUCxlQUFELEVBQWtCRSxVQUFVLENBQUNNLElBQTdCLENBQW5EO0FBQ0FMLFFBQUFBLGFBQWEsR0FBR29CLFdBQVcsQ0FBQ2pCLHNCQUFELEVBQXlCSixVQUF6QixDQUEzQjtBQUNBOztBQUNELGFBQU9DLGFBQVA7QUFDQSxLQVIwQixDQUEzQjtBQVNBLEdBVk07OztBQVlQLE1BQU0wQixnQkFBcUMsR0FBRztBQUM3QyxtQkFBZTtBQUFFQyxNQUFBQSxJQUFJLEVBQUU7QUFBUixLQUQ4QjtBQUU3QyxnQkFBWTtBQUFFQSxNQUFBQSxJQUFJLEVBQUU7QUFBUixLQUZpQztBQUc3QyxnQkFBWTtBQUFFQSxNQUFBQSxJQUFJLEVBQUU7QUFBUixLQUhpQztBQUk3QywwQkFBc0I7QUFDckJDLE1BQUFBLFdBQVcsRUFBRTtBQUNaLHNCQUFjO0FBREYsT0FEUTtBQUlyQkQsTUFBQUEsSUFBSSxFQUFFO0FBSmUsS0FKdUI7QUFVN0MsbUJBQWU7QUFDZEMsTUFBQUEsV0FBVyxFQUFFO0FBQ1oscURBQTZDLFNBRGpDO0FBRVosOEVBQXNFLGtCQUYxRDtBQUdaLHFEQUE2QyxTQUhqQztBQUlaLDhFQUFzRSxrQkFKMUQ7QUFLWixzQkFBYyxXQUxGO0FBTVosa0JBQVU7QUFORSxPQURDO0FBU2RELE1BQUFBLElBQUksRUFBRTtBQVRRLEtBVjhCO0FBcUI3QyxrQkFBYztBQUFFQSxNQUFBQSxJQUFJLEVBQUU7QUFBUixLQXJCK0I7QUFzQjdDLGdCQUFZO0FBQUVBLE1BQUFBLElBQUksRUFBRTtBQUFSLEtBdEJpQztBQXVCN0MsaUJBQWE7QUFBRUEsTUFBQUEsSUFBSSxFQUFFO0FBQVIsS0F2QmdDO0FBd0I3QyxpQkFBYTtBQUFFQSxNQUFBQSxJQUFJLEVBQUU7QUFBUixLQXhCZ0M7QUF5QjdDLGlCQUFhO0FBQUVBLE1BQUFBLElBQUksRUFBRTtBQUFSLEtBekJnQztBQTBCN0MsaUJBQWE7QUFBRUEsTUFBQUEsSUFBSSxFQUFFO0FBQVIsS0ExQmdDO0FBMkI3QyxrQkFBYztBQUFFQSxNQUFBQSxJQUFJLEVBQUU7QUFBUixLQTNCK0I7QUE0QjdDLGtCQUFjO0FBQUVBLE1BQUFBLElBQUksRUFBRTtBQUFSLEtBNUIrQjtBQTZCN0Msa0JBQWM7QUFDYkMsTUFBQUEsV0FBVyxFQUFFO0FBQ1osMkRBQW1ELGlCQUR2QztBQUVaLHNCQUFjO0FBRkYsT0FEQTtBQUtiRCxNQUFBQSxJQUFJLEVBQUU7QUFMTyxLQTdCK0I7QUFvQzdDLHFCQUFpQjtBQUNoQkMsTUFBQUEsV0FBVyxFQUFFO0FBQ1osc0JBQWM7QUFERixPQURHO0FBSWhCRCxNQUFBQSxJQUFJLEVBQUU7QUFKVTtBQXBDNEIsR0FBOUM7O0FBNENPLE1BQU1QLFdBQVcsR0FBRyxVQUMxQmpCLHNCQUQwQixFQUUxQkkseUJBRjBCLEVBR0w7QUFDckIsUUFBTVAsYUFBK0MsR0FBR08seUJBQXhEO0FBQ0EsUUFBTXNCLFNBQVMsR0FBRzFCLHNCQUFzQixDQUFDTSxZQUF6Qzs7QUFDQSxRQUFJb0IsU0FBUyxDQUFDQyxLQUFWLEtBQW9CLFVBQXhCLEVBQW9DO0FBQ25DLFVBQU1DLGNBQWMsR0FBR0wsZ0JBQWdCLENBQUVHLFNBQUQsQ0FBd0JGLElBQXpCLENBQXZDOztBQUNBLFVBQUlJLGNBQUosRUFBb0I7QUFDbkIvQixRQUFBQSxhQUFhLENBQUMyQixJQUFkLEdBQXFCSSxjQUFjLENBQUNKLElBQXBDOztBQUNBLFlBQUlJLGNBQWMsQ0FBQ0gsV0FBbkIsRUFBZ0M7QUFDL0I1QixVQUFBQSxhQUFhLENBQUM0QixXQUFkLEdBQTRCLEVBQTVCOztBQUNBLGNBQUlHLGNBQWMsQ0FBQ0gsV0FBZixDQUEyQkksTUFBM0IsSUFBcUNILFNBQVMsQ0FBQ0ksS0FBVixLQUFvQi9CLFNBQTdELEVBQXdFO0FBQ3ZFRixZQUFBQSxhQUFhLENBQUM0QixXQUFkLENBQTBCSyxLQUExQixHQUFrQ0osU0FBUyxDQUFDSSxLQUE1QztBQUNBOztBQUNELGNBQUlGLGNBQWMsQ0FBQ0gsV0FBZixDQUEyQk0sVUFBM0IsSUFBeUNMLFNBQVMsQ0FBQ00sU0FBVixLQUF3QmpDLFNBQXJFLEVBQWdGO0FBQy9FRixZQUFBQSxhQUFhLENBQUM0QixXQUFkLENBQTBCTyxTQUExQixHQUFzQ04sU0FBUyxDQUFDTSxTQUFoRDtBQUNBOztBQUNELGNBQUlKLGNBQWMsQ0FBQ0gsV0FBZixDQUEyQlEsVUFBM0IsSUFBeUNQLFNBQVMsQ0FBQ1EsU0FBVixLQUF3Qm5DLFNBQXJFLEVBQWdGO0FBQy9FRixZQUFBQSxhQUFhLENBQUM0QixXQUFkLENBQTBCUyxTQUExQixHQUFzQ1IsU0FBUyxDQUFDUSxTQUFoRDtBQUNBO0FBQ0Q7QUFDRDtBQUNEOztBQUNELFdBQU9yQyxhQUFQO0FBQ0EsR0F6Qk07Ozs7QUEyQkEsTUFBTXNDLGVBQWUsR0FBRyxVQUM5QkMsYUFEOEIsRUFFOUJDLGNBRjhCLEVBR0Y7QUFDNUIsUUFBTUMsYUFBYSxHQUFHeEIsdUJBQXVCLENBQUN1QixjQUFELEVBQWlCRCxhQUFhLENBQUNwQixvQkFBL0IsQ0FBN0M7QUFDQXNCLElBQUFBLGFBQWEsQ0FBQ0MsSUFBZCxDQUFtQkgsYUFBYSxDQUFDOUIsWUFBZCxDQUEyQmtDLElBQTlDO0FBQ0EsUUFBTUMsa0JBQWtCLEdBQUdoRCxpQkFBaUIsQ0FBQzZDLGFBQWEsQ0FBQ0ksSUFBZCxDQUFtQixHQUFuQixDQUFELENBQTVDO0FBQ0EsV0FBT0MsY0FBYyxDQUFDMUIsV0FBVyxDQUFDbUIsYUFBRCxFQUFnQkssa0JBQWhCLENBQVosQ0FBckI7QUFDQSxHQVJNOzs7O0FBVUEsTUFBTUcsYUFBYSxHQUFHLFVBQzVCUixhQUQ0QixFQUU1QlMsVUFGNEIsRUFHNUJDLGNBSDRCLEVBSTVCQyxhQUo0QixFQUtuQjtBQUFBOztBQUNUO0FBQ0EsUUFBSSxDQUFDWCxhQUFELElBQWtCLE9BQU9BLGFBQVAsS0FBeUIsUUFBL0MsRUFBeUQ7QUFDeEQsYUFBTyxNQUFQO0FBQ0E7O0FBQ0QsUUFBTVYsU0FBbUIsR0FBSXNCLGdCQUFnQixDQUFDWixhQUFELENBQWhCLElBQW1DQSxhQUFhLENBQUNhLE9BQWxELElBQStEYixhQUEzRjs7QUFDQSxpQ0FBSVYsU0FBUyxDQUFDaEIsV0FBZCxvRkFBSSxzQkFBdUJ3QyxFQUEzQiwyREFBSSx1QkFBMkJDLFVBQS9CLEVBQTJDO0FBQzFDLGFBQU8sUUFBUDtBQUNBOztBQUNELFFBQUl6QixTQUFTLENBQUNGLElBQVYsS0FBbUIsWUFBdkIsRUFBcUM7QUFDcEMsYUFBTyxRQUFQO0FBQ0EsS0FYUSxDQVlUOzs7QUFDQSxRQUNDcUIsVUFBVSxDQUFDTyxLQUFYLEtBQXFCLDBDQUFyQixJQUNDUCxVQUFVLENBQUNPLEtBQVgsS0FBcUIsbURBQXJCLElBQ0FQLFVBQVUsQ0FBQ1EsTUFBWCxDQUFrQkosT0FEbEIsSUFFQUosVUFBVSxDQUFDUSxNQUFYLENBQWtCSixPQUFsQixDQUEwQkcsS0FBMUIsS0FBb0MsMENBSnRDLEVBS0U7QUFDRCxhQUFPLFdBQVAsQ0FEQyxDQUVEO0FBQ0E7O0FBQ0QsUUFBSVAsVUFBVSxDQUFDUyxXQUFmLEVBQTRCO0FBQzNCLGFBQU8sY0FBUDtBQUNBOztBQUNELGtDQUFJNUIsU0FBUyxDQUFDaEIsV0FBZCxxRkFBSSx1QkFBdUI2QyxRQUEzQiwyREFBSSx1QkFBaUNDLFdBQXJDLEVBQWtEO0FBQ2pELGFBQU8sb0JBQVA7QUFDQTs7QUFDRCxRQUFJLDJCQUFBOUIsU0FBUyxDQUFDaEIsV0FBViw0R0FBdUIrQyxhQUF2QixrRkFBc0NDLGNBQXRDLGdDQUF3RGhDLFNBQVMsQ0FBQ2hCLFdBQWxFLHFGQUF3RCx1QkFBdUIrQyxhQUEvRSwyREFBd0QsdUJBQXNDRSxhQUE5RixDQUFKLEVBQWlIO0FBQ2hILGFBQU8sTUFBUDtBQUNBOztBQUNELFFBQUliLGNBQUosYUFBSUEsY0FBSixnREFBSUEsY0FBYyxDQUFFYyxlQUFwQixvRkFBSSxzQkFBaUNDLFVBQXJDLHFGQUFJLHVCQUE2Q25ELFdBQWpELHFGQUFJLHVCQUEwREMsTUFBOUQsMkRBQUksdUJBQWtFbUQsV0FBdEUsRUFBbUY7QUFDbEYsVUFBTUMsYUFBYSxHQUFHakIsY0FBYyxDQUFDYyxlQUFmLENBQStCQyxVQUEvQixDQUEwQ25ELFdBQTFDLENBQXNEQyxNQUF0RCxDQUE2RG1ELFdBQW5GO0FBQ0EsVUFBTUUsY0FBYyxHQUFHLENBQUNELGFBQWEsQ0FBQ0UsS0FBZCxDQUFvQixVQUFTQyxJQUFULEVBQWU7QUFBQTs7QUFDMUQsZUFBTyxDQUFBQSxJQUFJLFNBQUosSUFBQUEsSUFBSSxXQUFKLDZCQUFBQSxJQUFJLENBQUVqQixPQUFOLGdFQUFlVCxJQUFmLE1BQXdCZCxTQUFTLENBQUNjLElBQXpDLENBRDBELENBRTFEO0FBQ0EsT0FIdUIsQ0FBeEI7O0FBSUEsVUFBSXdCLGNBQWMsSUFBSWpCLGFBQWEsQ0FBQ29CLGdCQUFwQyxFQUFzRDtBQUFBOztBQUNyRCxzQ0FBSXJCLGNBQWMsQ0FBQ2MsZUFBbkIscUZBQUksdUJBQWdDbEQsV0FBcEMscUZBQUksdUJBQTZDQyxNQUFqRCwyREFBSSx1QkFBcUR5RCxTQUF6RCxFQUFvRTtBQUNuRTtBQUNBLGlCQUFPLCtCQUFQO0FBQ0E7O0FBQ0QsZUFBT3JCLGFBQWEsQ0FBQ29CLGdCQUFkLEtBQW1DLGtCQUFuQyxHQUF3RCxrQkFBeEQsR0FBNkUsa0JBQXBGO0FBQ0E7QUFDRDs7QUFDRCxrQ0FBSXpDLFNBQVMsQ0FBQ2hCLFdBQWQsc0ZBQUksdUJBQXVCd0MsRUFBM0IsNERBQUksd0JBQTJCbUIsYUFBL0IsRUFBOEM7QUFDN0MsYUFBTyxNQUFQO0FBQ0E7O0FBQ0QsUUFBTUMscUJBQXFCLEdBQUcsQ0FBQXhCLGNBQWMsU0FBZCxJQUFBQSxjQUFjLFdBQWQsc0NBQUFBLGNBQWMsQ0FBRWMsZUFBaEIsNEdBQWlDQyxVQUFqQyxrRkFBNkM3QyxvQkFBN0MsS0FBcUUsRUFBbkc7QUFDQSxRQUFJdUQsc0NBQXNDLEdBQUcsS0FBN0M7QUFDQUQsSUFBQUEscUJBQXFCLENBQUNFLE9BQXRCLENBQThCLFVBQUFDLFFBQVEsRUFBSTtBQUN6QyxVQUFJQSxRQUFRLENBQUNDLHFCQUFULElBQWtDRCxRQUFRLENBQUNDLHFCQUFULENBQStCQyxNQUFyRSxFQUE2RTtBQUM1RUYsUUFBQUEsUUFBUSxDQUFDQyxxQkFBVCxDQUErQkYsT0FBL0IsQ0FBdUMsVUFBQUksY0FBYyxFQUFJO0FBQ3hELGNBQUksQ0FBQUEsY0FBYyxTQUFkLElBQUFBLGNBQWMsV0FBZCxZQUFBQSxjQUFjLENBQUVDLGNBQWhCLE1BQW1DbkQsU0FBUyxDQUFDYyxJQUFqRCxFQUF1RDtBQUFBOztBQUN0RCxnQkFBSWlDLFFBQUosYUFBSUEsUUFBSiwrQ0FBSUEsUUFBUSxDQUFFSyxVQUFkLGtGQUFJLHFCQUFzQnBFLFdBQTFCLG9GQUFJLHNCQUFtQ3dDLEVBQXZDLDJEQUFJLHVCQUF1QzZCLGVBQTNDLEVBQTREO0FBQzNEUixjQUFBQSxzQ0FBc0MsR0FBRyxJQUF6QztBQUNBO0FBQ0Q7QUFDRCxTQU5EO0FBT0E7QUFDRCxLQVZEOztBQVdBLFFBQUlBLHNDQUFKLEVBQTRDO0FBQzNDLGFBQU8sdUJBQVA7QUFDQTs7QUFDRCxtQ0FBSTdDLFNBQVMsQ0FBQ2hCLFdBQWQsdUZBQUksd0JBQXVCQyxNQUEzQiw0REFBSSx3QkFBK0JxRSxjQUFuQyxFQUFtRDtBQUNsRCxhQUFPLGFBQVA7QUFDQTs7QUFDRCxRQUFJbkMsVUFBVSxDQUFDTyxLQUFYLEtBQXFCLDZDQUF6QixFQUF3RTtBQUN2RSxhQUFPLE1BQVA7QUFDQTs7QUFDRCxXQUFPLE1BQVA7QUFDQSxHQTVFTSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0RGlzcGxheU1vZGUsIFByb3BlcnR5T3JQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvVUlGb3JtYXR0ZXJzXCI7XG5pbXBvcnQgeyBEYXRhTW9kZWxPYmplY3RQYXRoLCBlbmhhbmNlRGF0YU1vZGVsUGF0aCwgZ2V0UGF0aFJlbGF0aXZlTG9jYXRpb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EYXRhTW9kZWxQYXRoSGVscGVyXCI7XG5pbXBvcnQgeyBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQge1xuXHRFeHByZXNzaW9uLFxuXHRhbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0Zm9ybWF0UmVzdWx0LFxuXHR0cmFuc2Zvcm1SZWN1cnNpdmVseSxcblx0QmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uLFxuXHRCaW5kaW5nRXhwcmVzc2lvbixcblx0Y29tcGlsZUJpbmRpbmcsXG5cdGJpbmRpbmdFeHByZXNzaW9uXG59IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdFeHByZXNzaW9uXCI7XG5pbXBvcnQgeyBpc1BhdGhFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvUHJvcGVydHlIZWxwZXJcIjtcbmltcG9ydCB2YWx1ZUZvcm1hdHRlcnMgZnJvbSBcInNhcC9mZS9jb3JlL2Zvcm1hdHRlcnMvVmFsdWVGb3JtYXR0ZXJcIjtcblxuZXhwb3J0IHR5cGUgRm9ybWF0T3B0aW9ucyA9IHtcblx0dmFsdWVGb3JtYXQ6IFN0cmluZztcblx0dGV4dEFsaWduTW9kZTogU3RyaW5nO1xuXHRkaXNwbGF5TW9kZTogU3RyaW5nO1xuXHR0ZXh0TGluZXNEaXNwbGF5OiBTdHJpbmc7XG5cdHRleHRMaW5lc0VkaXQ6IFN0cmluZztcblx0c2hvd0VtcHR5SW5kaWNhdG9yOiBib29sZWFuO1xuXHRzZW1hbnRpY0tleVN0eWxlOiBTdHJpbmc7XG5cdHNob3dJY29uVXJsOiBib29sZWFuO1xufTtcbi8qKlxuICogUmVjdXJzaXZlbHkgYWRkIHRoZSB0ZXh0IGFycmFuZ2VtZW50IHRvIGEgYmluZGluZyBleHByZXNzaW9uLlxuICpcbiAqIEBwYXJhbSBiaW5kaW5nRXhwcmVzc2lvbiB0aGUgYmluZGluZyBleHByZXNzaW9uIHRvIGVuaGFuY2VcbiAqIEBwYXJhbSBmdWxsQ29udGV4dFBhdGggdGhlIGN1cnJlbnQgY29udGV4dCBwYXRoIHdlJ3JlIG9uICh0byBwcm9wZXJseSByZXNvbHZlIHRoZSB0ZXh0IGFycmFuZ2VtZW50IHByb3BlcnRpZXMpXG4gKiBAcmV0dXJucyBhbiB1cGRhdGVkIGV4cHJlc3Npb24uXG4gKi9cbmV4cG9ydCBjb25zdCBhZGRUZXh0QXJyYW5nZW1lbnRUb0JpbmRpbmdFeHByZXNzaW9uID0gZnVuY3Rpb24oXG5cdGJpbmRpbmdFeHByZXNzaW9uOiBFeHByZXNzaW9uPGFueT4sXG5cdGZ1bGxDb250ZXh0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aFxuKTogRXhwcmVzc2lvbjxhbnk+IHtcblx0cmV0dXJuIHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGJpbmRpbmdFeHByZXNzaW9uLCBcIkJpbmRpbmdcIiwgKGV4cHJlc3Npb246IEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxhbnk+KSA9PiB7XG5cdFx0bGV0IG91dEV4cHJlc3Npb246IEV4cHJlc3Npb248YW55PiA9IGV4cHJlc3Npb247XG5cdFx0aWYgKGV4cHJlc3Npb24ubW9kZWxOYW1lID09PSB1bmRlZmluZWQpIHtcblx0XHRcdC8vIEluIGNhc2Ugb2YgZGVmYXVsdCBtb2RlbCB3ZSB0aGVuIG5lZWQgdG8gcmVzb2x2ZSB0aGUgdGV4dCBhcnJhbmdlbWVudCBwcm9wZXJ0eVxuXHRcdFx0Y29uc3Qgb1Byb3BlcnR5RGF0YU1vZGVsUGF0aCA9IGVuaGFuY2VEYXRhTW9kZWxQYXRoKGZ1bGxDb250ZXh0UGF0aCwgZXhwcmVzc2lvbi5wYXRoKTtcblx0XHRcdG91dEV4cHJlc3Npb24gPSBnZXRCaW5kaW5nV2l0aFRleHRBcnJhbmdlbWVudChvUHJvcGVydHlEYXRhTW9kZWxQYXRoLCBleHByZXNzaW9uKTtcblx0XHR9XG5cdFx0cmV0dXJuIG91dEV4cHJlc3Npb247XG5cdH0pO1xufTtcbmV4cG9ydCBjb25zdCBnZXRCaW5kaW5nV2l0aFRleHRBcnJhbmdlbWVudCA9IGZ1bmN0aW9uKFxuXHRvUHJvcGVydHlEYXRhTW9kZWxQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uOiBFeHByZXNzaW9uPHN0cmluZz5cbik6IEV4cHJlc3Npb248c3RyaW5nPiB7XG5cdGxldCBvdXRFeHByZXNzaW9uID0gcHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbjtcblx0Y29uc3Qgb1Byb3BlcnR5RGVmaW5pdGlvbiA9IG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGgudGFyZ2V0T2JqZWN0IGFzIFByb3BlcnR5O1xuXHRjb25zdCB0YXJnZXREaXNwbGF5TW9kZSA9IGdldERpc3BsYXlNb2RlKG9Qcm9wZXJ0eURlZmluaXRpb24sIG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGgpO1xuXHRjb25zdCBjb21tb25UZXh0ID0gb1Byb3BlcnR5RGVmaW5pdGlvbi5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UZXh0O1xuXHRjb25zdCByZWxhdGl2ZUxvY2F0aW9uID0gZ2V0UGF0aFJlbGF0aXZlTG9jYXRpb24ob1Byb3BlcnR5RGF0YU1vZGVsUGF0aC5jb250ZXh0TG9jYXRpb24sIG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMpO1xuXHRwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uID0gZm9ybWF0TGFiZWwob1Byb3BlcnR5RGF0YU1vZGVsUGF0aCwgcHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbik7XG5cdGlmICh0YXJnZXREaXNwbGF5TW9kZSAhPT0gXCJWYWx1ZVwiICYmIGNvbW1vblRleHQpIHtcblx0XHRzd2l0Y2ggKHRhcmdldERpc3BsYXlNb2RlKSB7XG5cdFx0XHRjYXNlIFwiRGVzY3JpcHRpb25cIjpcblx0XHRcdFx0b3V0RXhwcmVzc2lvbiA9IGFubm90YXRpb25FeHByZXNzaW9uKGNvbW1vblRleHQsIHJlbGF0aXZlTG9jYXRpb24pIGFzIEV4cHJlc3Npb248c3RyaW5nPjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiRGVzY3JpcHRpb25WYWx1ZVwiOlxuXHRcdFx0XHRvdXRFeHByZXNzaW9uID0gZm9ybWF0UmVzdWx0KFxuXHRcdFx0XHRcdFthbm5vdGF0aW9uRXhwcmVzc2lvbihjb21tb25UZXh0LCByZWxhdGl2ZUxvY2F0aW9uKSBhcyBFeHByZXNzaW9uPHN0cmluZz4sIHByb3BlcnR5QmluZGluZ0V4cHJlc3Npb25dLFxuXHRcdFx0XHRcdHZhbHVlRm9ybWF0dGVycy5mb3JtYXRXaXRoQnJhY2tldHNcblx0XHRcdFx0KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiVmFsdWVEZXNjcmlwdGlvblwiOlxuXHRcdFx0XHRvdXRFeHByZXNzaW9uID0gZm9ybWF0UmVzdWx0KFxuXHRcdFx0XHRcdFtwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uLCBhbm5vdGF0aW9uRXhwcmVzc2lvbihjb21tb25UZXh0LCByZWxhdGl2ZUxvY2F0aW9uKSBhcyBFeHByZXNzaW9uPHN0cmluZz5dLFxuXHRcdFx0XHRcdHZhbHVlRm9ybWF0dGVycy5mb3JtYXRXaXRoQnJhY2tldHNcblx0XHRcdFx0KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBvdXRFeHByZXNzaW9uO1xufTtcblxuZXhwb3J0IGNvbnN0IGZvcm1hdFZhbHVlUmVjdXJzaXZlbHkgPSBmdW5jdGlvbihiaW5kaW5nRXhwcmVzc2lvbjogRXhwcmVzc2lvbjxhbnk+LCBmdWxsQ29udGV4dFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpOiBFeHByZXNzaW9uPGFueT4ge1xuXHRyZXR1cm4gdHJhbnNmb3JtUmVjdXJzaXZlbHkoYmluZGluZ0V4cHJlc3Npb24sIFwiQmluZGluZ1wiLCAoZXhwcmVzc2lvbjogQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPGFueT4pID0+IHtcblx0XHRsZXQgb3V0RXhwcmVzc2lvbjogRXhwcmVzc2lvbjxhbnk+ID0gZXhwcmVzc2lvbjtcblx0XHRpZiAoZXhwcmVzc2lvbi5tb2RlbE5hbWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gSW4gY2FzZSBvZiBkZWZhdWx0IG1vZGVsIHdlIHRoZW4gbmVlZCB0byByZXNvbHZlIHRoZSB0ZXh0IGFycmFuZ2VtZW50IHByb3BlcnR5XG5cdFx0XHRjb25zdCBvUHJvcGVydHlEYXRhTW9kZWxQYXRoID0gZW5oYW5jZURhdGFNb2RlbFBhdGgoZnVsbENvbnRleHRQYXRoLCBleHByZXNzaW9uLnBhdGgpO1xuXHRcdFx0b3V0RXhwcmVzc2lvbiA9IGZvcm1hdExhYmVsKG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGgsIGV4cHJlc3Npb24pO1xuXHRcdH1cblx0XHRyZXR1cm4gb3V0RXhwcmVzc2lvbjtcblx0fSk7XG59O1xuXG5jb25zdCBFRE1fVFlQRV9NQVBQSU5HOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuXHRcIkVkbS5Cb29sZWFuXCI6IHsgdHlwZTogXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5Cb29sZWFuXCIgfSxcblx0XCJFZG0uQnl0ZVwiOiB7IHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuQnl0ZVwiIH0sXG5cdFwiRWRtLkRhdGVcIjogeyB0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkRhdGVcIiB9LFxuXHRcIkVkbS5EYXRlVGltZU9mZnNldFwiOiB7XG5cdFx0Y29uc3RyYWludHM6IHtcblx0XHRcdFwiJFByZWNpc2lvblwiOiBcInByZWNpc2lvblwiXG5cdFx0fSxcblx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkRhdGVUaW1lT2Zmc2V0XCJcblx0fSxcblx0XCJFZG0uRGVjaW1hbFwiOiB7XG5cdFx0Y29uc3RyYWludHM6IHtcblx0XHRcdFwiQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1pbmltdW0vJERlY2ltYWxcIjogXCJtaW5pbXVtXCIsXG5cdFx0XHRcIkBPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5NaW5pbXVtQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkV4Y2x1c2l2ZVwiOiBcIm1pbmltdW1FeGNsdXNpdmVcIixcblx0XHRcdFwiQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1heGltdW0vJERlY2ltYWxcIjogXCJtYXhpbXVtXCIsXG5cdFx0XHRcIkBPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5NYXhpbXVtQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkV4Y2x1c2l2ZVwiOiBcIm1heGltdW1FeGNsdXNpdmVcIixcblx0XHRcdFwiJFByZWNpc2lvblwiOiBcInByZWNpc2lvblwiLFxuXHRcdFx0XCIkU2NhbGVcIjogXCJzY2FsZVwiXG5cdFx0fSxcblx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkRlY2ltYWxcIlxuXHR9LFxuXHRcIkVkbS5Eb3VibGVcIjogeyB0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkRvdWJsZVwiIH0sXG5cdFwiRWRtLkd1aWRcIjogeyB0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkd1aWRcIiB9LFxuXHRcIkVkbS5JbnQxNlwiOiB7IHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuSW50MTZcIiB9LFxuXHRcIkVkbS5JbnQzMlwiOiB7IHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuSW50MzJcIiB9LFxuXHRcIkVkbS5JbnQ2NFwiOiB7IHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuSW50NjRcIiB9LFxuXHRcIkVkbS5TQnl0ZVwiOiB7IHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuU0J5dGVcIiB9LFxuXHRcIkVkbS5TaW5nbGVcIjogeyB0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLlNpbmdsZVwiIH0sXG5cdFwiRWRtLlN0cmVhbVwiOiB7IHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuU3RyZWFtXCIgfSxcblx0XCJFZG0uU3RyaW5nXCI6IHtcblx0XHRjb25zdHJhaW50czoge1xuXHRcdFx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRGlnaXRTZXF1ZW5jZVwiOiBcImlzRGlnaXRTZXF1ZW5jZVwiLFxuXHRcdFx0XCIkTWF4TGVuZ3RoXCI6IFwibWF4TGVuZ3RoXCJcblx0XHR9LFxuXHRcdHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuU3RyaW5nXCJcblx0fSxcblx0XCJFZG0uVGltZU9mRGF5XCI6IHtcblx0XHRjb25zdHJhaW50czoge1xuXHRcdFx0XCIkUHJlY2lzaW9uXCI6IFwicHJlY2lzaW9uXCJcblx0XHR9LFxuXHRcdHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuVGltZU9mRGF5XCJcblx0fVxufTtcblxuZXhwb3J0IGNvbnN0IGZvcm1hdExhYmVsID0gZnVuY3Rpb24oXG5cdG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdHByb3BlcnR5QmluZGluZ0V4cHJlc3Npb246IEV4cHJlc3Npb248c3RyaW5nPlxuKTogRXhwcmVzc2lvbjxzdHJpbmc+IHtcblx0Y29uc3Qgb3V0RXhwcmVzc2lvbjogQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPGFueT4gPSBwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uIGFzIEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxhbnk+O1xuXHRjb25zdCBvUHJvcGVydHkgPSBvUHJvcGVydHlEYXRhTW9kZWxQYXRoLnRhcmdldE9iamVjdDtcblx0aWYgKG9Qcm9wZXJ0eS5fdHlwZSA9PT0gXCJQcm9wZXJ0eVwiKSB7XG5cdFx0Y29uc3Qgb1RhcmdldE1hcHBpbmcgPSBFRE1fVFlQRV9NQVBQSU5HWyhvUHJvcGVydHkgYXMgUHJvcGVydHkpLnR5cGVdO1xuXHRcdGlmIChvVGFyZ2V0TWFwcGluZykge1xuXHRcdFx0b3V0RXhwcmVzc2lvbi50eXBlID0gb1RhcmdldE1hcHBpbmcudHlwZTtcblx0XHRcdGlmIChvVGFyZ2V0TWFwcGluZy5jb25zdHJhaW50cykge1xuXHRcdFx0XHRvdXRFeHByZXNzaW9uLmNvbnN0cmFpbnRzID0ge307XG5cdFx0XHRcdGlmIChvVGFyZ2V0TWFwcGluZy5jb25zdHJhaW50cy4kU2NhbGUgJiYgb1Byb3BlcnR5LnNjYWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRvdXRFeHByZXNzaW9uLmNvbnN0cmFpbnRzLnNjYWxlID0gb1Byb3BlcnR5LnNjYWxlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvVGFyZ2V0TWFwcGluZy5jb25zdHJhaW50cy4kUHJlY2lzaW9uICYmIG9Qcm9wZXJ0eS5wcmVjaXNpb24gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdG91dEV4cHJlc3Npb24uY29uc3RyYWludHMucHJlY2lzaW9uID0gb1Byb3BlcnR5LnByZWNpc2lvbjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob1RhcmdldE1hcHBpbmcuY29uc3RyYWludHMuJE1heExlbmd0aCAmJiBvUHJvcGVydHkubWF4TGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRvdXRFeHByZXNzaW9uLmNvbnN0cmFpbnRzLm1heExlbmd0aCA9IG9Qcm9wZXJ0eS5tYXhMZW5ndGg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIG91dEV4cHJlc3Npb247XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VmFsdWVCaW5kaW5nID0gZnVuY3Rpb24oXG5cdG9Qcm9wZXJ0eVBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGVudGl0eVR5cGVQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoXG4pOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+IHtcblx0Y29uc3QgYVByb3BlcnR5UGF0aCA9IGdldFBhdGhSZWxhdGl2ZUxvY2F0aW9uKGVudGl0eVR5cGVQYXRoLCBvUHJvcGVydHlQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzKTtcblx0YVByb3BlcnR5UGF0aC5wdXNoKG9Qcm9wZXJ0eVBhdGgudGFyZ2V0T2JqZWN0Lm5hbWUpO1xuXHRjb25zdCBvQmluZGluZ0V4cHJlc3Npb24gPSBiaW5kaW5nRXhwcmVzc2lvbihhUHJvcGVydHlQYXRoLmpvaW4oXCIvXCIpKTtcblx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKGZvcm1hdExhYmVsKG9Qcm9wZXJ0eVBhdGgsIG9CaW5kaW5nRXhwcmVzc2lvbikpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEZpZWxkU3R5bGUgPSBmdW5jdGlvbihcblx0b1Byb3BlcnR5UGF0aDogUHJvcGVydHlPclBhdGg8UHJvcGVydHk+LFxuXHRvRGF0YUZpZWxkOiBhbnksXG5cdG9EYXRhTW9kZWxQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRmb3JtYXRPcHRpb25zOiBGb3JtYXRPcHRpb25zXG4pOiBzdHJpbmcge1xuXHQvLyBhbGdvcml0aG0gdG8gZGV0ZXJtaW5lIHRoZSBmaWVsZCBmcmFnbWVudCB0byB1c2Vcblx0aWYgKCFvUHJvcGVydHlQYXRoIHx8IHR5cGVvZiBvUHJvcGVydHlQYXRoID09PSBcInN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIFwiVGV4dFwiO1xuXHR9XG5cdGNvbnN0IG9Qcm9wZXJ0eTogUHJvcGVydHkgPSAoaXNQYXRoRXhwcmVzc2lvbihvUHJvcGVydHlQYXRoKSAmJiBvUHJvcGVydHlQYXRoLiR0YXJnZXQpIHx8IChvUHJvcGVydHlQYXRoIGFzIFByb3BlcnR5KTtcblx0aWYgKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVUk/LklzSW1hZ2VVUkwpIHtcblx0XHRyZXR1cm4gXCJBdmF0YXJcIjtcblx0fVxuXHRpZiAob1Byb3BlcnR5LnR5cGUgPT09IFwiRWRtLlN0cmVhbVwiKSB7XG5cdFx0cmV0dXJuIFwiQXZhdGFyXCI7XG5cdH1cblx0Ly8gRGF0YXBvaW50XG5cdGlmIChcblx0XHRvRGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFQb2ludFR5cGVcIiB8fFxuXHRcdChvRGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFubm90YXRpb25cIiAmJlxuXHRcdFx0b0RhdGFGaWVsZC5UYXJnZXQuJHRhcmdldCAmJlxuXHRcdFx0b0RhdGFGaWVsZC5UYXJnZXQuJHRhcmdldC4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnRUeXBlXCIpXG5cdCkge1xuXHRcdHJldHVybiBcIkRhdGFwb2ludFwiO1xuXHRcdC8vVE9ET1xuXHR9XG5cdGlmIChvRGF0YUZpZWxkLkNyaXRpY2FsaXR5KSB7XG5cdFx0cmV0dXJuIFwiT2JqZWN0U3RhdHVzXCI7XG5cdH1cblx0aWYgKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uTWVhc3VyZXM/LklTT0N1cnJlbmN5KSB7XG5cdFx0cmV0dXJuIFwiQW1vdW50V2l0aEN1cnJlbmN5XCI7XG5cdH1cblx0aWYgKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbXVuaWNhdGlvbj8uSXNFbWFpbEFkZHJlc3MgfHwgb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tdW5pY2F0aW9uPy5Jc1Bob25lTnVtYmVyKSB7XG5cdFx0cmV0dXJuIFwiTGlua1wiO1xuXHR9XG5cdGlmIChvRGF0YU1vZGVsUGF0aD8udGFyZ2V0RW50aXR5U2V0Py5lbnRpdHlUeXBlPy5hbm5vdGF0aW9ucz8uQ29tbW9uPy5TZW1hbnRpY0tleSkge1xuXHRcdGNvbnN0IGFTZW1hbnRpY0tleXMgPSBvRGF0YU1vZGVsUGF0aC50YXJnZXRFbnRpdHlTZXQuZW50aXR5VHlwZS5hbm5vdGF0aW9ucy5Db21tb24uU2VtYW50aWNLZXk7XG5cdFx0Y29uc3QgYklzU2VtYW50aWNLZXkgPSAhYVNlbWFudGljS2V5cy5ldmVyeShmdW5jdGlvbihvS2V5KSB7XG5cdFx0XHRyZXR1cm4gb0tleT8uJHRhcmdldD8ubmFtZSAhPT0gb1Byb3BlcnR5Lm5hbWU7XG5cdFx0XHQvLyBuZWVkIHRvIGNoZWNrIGlmIGl0IHdvcmtzIGFsc28gZm9yIGRpcmVjdCBwcm9wZXJ0aWVzXG5cdFx0fSk7XG5cdFx0aWYgKGJJc1NlbWFudGljS2V5ICYmIGZvcm1hdE9wdGlvbnMuc2VtYW50aWNLZXlTdHlsZSkge1xuXHRcdFx0aWYgKG9EYXRhTW9kZWxQYXRoLnRhcmdldEVudGl0eVNldD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uRHJhZnRSb290KSB7XG5cdFx0XHRcdC8vIHdlIHRoZW4gc3RpbGwgY2hlY2sgd2hldGhlciB0aGlzIGlzIGF2YWlsYWJsZSBhdCBkZXNpZ250aW1lIG9uIHRoZSBlbnRpdHlzZXRcblx0XHRcdFx0cmV0dXJuIFwiU2VtYW50aWNLZXlXaXRoRHJhZnRJbmRpY2F0b3JcIjtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmb3JtYXRPcHRpb25zLnNlbWFudGljS2V5U3R5bGUgPT09IFwiT2JqZWN0SWRlbnRpZmllclwiID8gXCJPYmplY3RJZGVudGlmaWVyXCIgOiBcIkxhYmVsU2VtYW50aWNLZXlcIjtcblx0XHR9XG5cdH1cblx0aWYgKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVUk/Lk11bHRpTGluZVRleHQpIHtcblx0XHRyZXR1cm4gXCJUZXh0XCI7XG5cdH1cblx0Y29uc3QgYU5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gb0RhdGFNb2RlbFBhdGg/LnRhcmdldEVudGl0eVNldD8uZW50aXR5VHlwZT8ubmF2aWdhdGlvblByb3BlcnRpZXMgfHwgW107XG5cdGxldCBiSXNVc2VkSW5OYXZpZ2F0aW9uV2l0aFF1aWNrVmlld0ZhY2V0cyA9IGZhbHNlO1xuXHRhTmF2aWdhdGlvblByb3BlcnRpZXMuZm9yRWFjaChvTmF2UHJvcCA9PiB7XG5cdFx0aWYgKG9OYXZQcm9wLnJlZmVyZW50aWFsQ29uc3RyYWludCAmJiBvTmF2UHJvcC5yZWZlcmVudGlhbENvbnN0cmFpbnQubGVuZ3RoKSB7XG5cdFx0XHRvTmF2UHJvcC5yZWZlcmVudGlhbENvbnN0cmFpbnQuZm9yRWFjaChvUmVmQ29uc3RyYWludCA9PiB7XG5cdFx0XHRcdGlmIChvUmVmQ29uc3RyYWludD8uc291cmNlUHJvcGVydHkgPT09IG9Qcm9wZXJ0eS5uYW1lKSB7XG5cdFx0XHRcdFx0aWYgKG9OYXZQcm9wPy50YXJnZXRUeXBlPy5hbm5vdGF0aW9ucz8uVUk/LlF1aWNrVmlld0ZhY2V0cykge1xuXHRcdFx0XHRcdFx0YklzVXNlZEluTmF2aWdhdGlvbldpdGhRdWlja1ZpZXdGYWNldHMgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcblx0aWYgKGJJc1VzZWRJbk5hdmlnYXRpb25XaXRoUXVpY2tWaWV3RmFjZXRzKSB7XG5cdFx0cmV0dXJuIFwiTGlua1dpdGhRdWlja1ZpZXdGb3JtXCI7XG5cdH1cblx0aWYgKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5TZW1hbnRpY09iamVjdCkge1xuXHRcdHJldHVybiBcIkxpbmtXcmFwcGVyXCI7XG5cdH1cblx0aWYgKG9EYXRhRmllbGQuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkV2l0aFVybFwiKSB7XG5cdFx0cmV0dXJuIFwiTGlua1wiO1xuXHR9XG5cdHJldHVybiBcIlRleHRcIjtcbn07XG4iXX0=