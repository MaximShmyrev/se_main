sap.ui.define(["../ManifestSettings", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/Key", "sap/fe/core/templating/DataModelPathHelper"], function (ManifestSettings, Action, ConfigurableObject, BindingExpression, Key, DataModelPathHelper) {
  "use strict";

  var _exports = {};
  var isPathDeletable = DataModelPathHelper.isPathDeletable;
  var KeyHelper = Key.KeyHelper;
  var fn = BindingExpression.fn;
  var equal = BindingExpression.equal;
  var not = BindingExpression.not;
  var compileBinding = BindingExpression.compileBinding;
  var annotationExpression = BindingExpression.annotationExpression;
  var Placement = ConfigurableObject.Placement;
  var getSemanticObjectMapping = Action.getSemanticObjectMapping;
  var ButtonType = Action.ButtonType;
  var ActionType = ManifestSettings.ActionType;

  /**
   * Retrieve all the data field for actions for the identification annotation
   * They must be
   * - Not statically hidden
   * - Either linked to an Unbound action or to an action which has an OperationAvailable not statically false.
   *
   * @param {EntityType} entityType the current entitytype
   * @param {boolean} bDetermining whether or not the action should be determining
   * @returns {DataFieldForActionTypes[]} an array of datafield for action respecting the bDetermining property
   */
  function getIdentificationDataFieldForActions(entityType, bDetermining) {
    var _entityType$annotatio, _entityType$annotatio2, _entityType$annotatio3;

    return ((_entityType$annotatio = entityType.annotations) === null || _entityType$annotatio === void 0 ? void 0 : (_entityType$annotatio2 = _entityType$annotatio.UI) === null || _entityType$annotatio2 === void 0 ? void 0 : (_entityType$annotatio3 = _entityType$annotatio2.Identification) === null || _entityType$annotatio3 === void 0 ? void 0 : _entityType$annotatio3.filter(function (identificationDataField) {
      var _identificationDataFi, _identificationDataFi2;

      if ((identificationDataField === null || identificationDataField === void 0 ? void 0 : (_identificationDataFi = identificationDataField.annotations) === null || _identificationDataFi === void 0 ? void 0 : (_identificationDataFi2 = _identificationDataFi.UI) === null || _identificationDataFi2 === void 0 ? void 0 : _identificationDataFi2.Hidden) !== true) {
        var _identificationDataFi3, _identificationDataFi4, _identificationDataFi5, _identificationDataFi6;

        if ((identificationDataField === null || identificationDataField === void 0 ? void 0 : identificationDataField.$Type) === "com.sap.vocabularies.UI.v1.DataFieldForAction" && !!identificationDataField.Determining === bDetermining && (!(identificationDataField === null || identificationDataField === void 0 ? void 0 : (_identificationDataFi3 = identificationDataField.ActionTarget) === null || _identificationDataFi3 === void 0 ? void 0 : _identificationDataFi3.isBound) || (identificationDataField === null || identificationDataField === void 0 ? void 0 : (_identificationDataFi4 = identificationDataField.ActionTarget) === null || _identificationDataFi4 === void 0 ? void 0 : (_identificationDataFi5 = _identificationDataFi4.annotations) === null || _identificationDataFi5 === void 0 ? void 0 : (_identificationDataFi6 = _identificationDataFi5.Core) === null || _identificationDataFi6 === void 0 ? void 0 : _identificationDataFi6.OperationAvailable) !== false)) {
          return true;
        }
      }

      return false;
    })) || [];
  }
  /**
   * Retrieve all the IBN actions for the identification annotation.
   * They must be
   * - Not statically hidden.
   * @param {EntityType} entityType the current entitytype
   * @param {boolean} bDetermining whether or not the action should be determining
   * @returns {DataFieldForIntentBasedNavigationTypes[]} an array of datafield for action respecting the bDetermining property.
   */


  _exports.getIdentificationDataFieldForActions = getIdentificationDataFieldForActions;

  function getIdentificationDataFieldForIBNActions(entityType, bDetermining) {
    var _entityType$annotatio4, _entityType$annotatio5, _entityType$annotatio6;

    return ((_entityType$annotatio4 = entityType.annotations) === null || _entityType$annotatio4 === void 0 ? void 0 : (_entityType$annotatio5 = _entityType$annotatio4.UI) === null || _entityType$annotatio5 === void 0 ? void 0 : (_entityType$annotatio6 = _entityType$annotatio5.Identification) === null || _entityType$annotatio6 === void 0 ? void 0 : _entityType$annotatio6.filter(function (identificationDataField) {
      var _identificationDataFi7, _identificationDataFi8;

      if ((identificationDataField === null || identificationDataField === void 0 ? void 0 : (_identificationDataFi7 = identificationDataField.annotations) === null || _identificationDataFi7 === void 0 ? void 0 : (_identificationDataFi8 = _identificationDataFi7.UI) === null || _identificationDataFi8 === void 0 ? void 0 : _identificationDataFi8.Hidden) !== true) {
        if ((identificationDataField === null || identificationDataField === void 0 ? void 0 : identificationDataField.$Type) === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && !!identificationDataField.Determining === bDetermining) {
          return true;
        }
      }

      return false;
    })) || [];
  }

  var IMPORTANT_CRITICALITIES = ["UI.CriticalityType/VeryPositive", "UI.CriticalityType/Positive", "UI.CriticalityType/Negative", "UI.CriticalityType/VeryNegative"];

  function getHeaderDefaultActions(converterContext) {
    var _entitySet$annotation, _entitySet$annotation2, _entitySet$annotation3, _entitySet$annotation4, _entitySet$annotation5, _entitySet$annotation6;

    var entitySet = converterContext.getEntitySet();
    var oStickySessionSupported = entitySet && ((_entitySet$annotation = entitySet.annotations) === null || _entitySet$annotation === void 0 ? void 0 : (_entitySet$annotation2 = _entitySet$annotation.Session) === null || _entitySet$annotation2 === void 0 ? void 0 : _entitySet$annotation2.StickySessionSupported),
        //for sticky app
    oDraftRoot = entitySet && ((_entitySet$annotation3 = entitySet.annotations.Common) === null || _entitySet$annotation3 === void 0 ? void 0 : _entitySet$annotation3.DraftRoot),
        oEntityDeleteRestrictions = entitySet && ((_entitySet$annotation4 = entitySet.annotations) === null || _entitySet$annotation4 === void 0 ? void 0 : (_entitySet$annotation5 = _entitySet$annotation4.Capabilities) === null || _entitySet$annotation5 === void 0 ? void 0 : _entitySet$annotation5.DeleteRestrictions),
        bUpdateHidden = entitySet && ((_entitySet$annotation6 = entitySet.annotations.UI) === null || _entitySet$annotation6 === void 0 ? void 0 : _entitySet$annotation6.UpdateHidden);
    var oDataModelObjectPath = converterContext.getDataModelObjectPath(),
        isParentDeletable = isPathDeletable(oDataModelObjectPath),
        bParentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable) : isParentDeletable;
    var headerDataFieldForActions = getIdentificationDataFieldForActions(converterContext.getEntityType(), false); // First add the "Critical" DataFieldForActions

    var headerActions = headerDataFieldForActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) > -1;
    }).map(function (dataField) {
      return {
        type: ActionType.DataFieldForAction,
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        key: KeyHelper.generateKeyFromDataField(dataField),
        isNavigable: true
      };
    }); // Then the edit action if it exists

    if (((oDraftRoot === null || oDraftRoot === void 0 ? void 0 : oDraftRoot.EditAction) || (oStickySessionSupported === null || oStickySessionSupported === void 0 ? void 0 : oStickySessionSupported.EditAction)) && bUpdateHidden !== true) {
      headerActions.push({
        type: ActionType.Primary,
        key: "EditAction"
      });
    } // Then the delete action if we're not statically not deletable


    if (bParentEntitySetDeletable && bParentEntitySetDeletable !== "false" || (oEntityDeleteRestrictions === null || oEntityDeleteRestrictions === void 0 ? void 0 : oEntityDeleteRestrictions.Deletable) !== false && bParentEntitySetDeletable !== "false") {
      headerActions.push({
        type: ActionType.Secondary,
        key: "DeleteAction",
        parentEntityDeleteEnabled: bParentEntitySetDeletable
      });
    }

    var headerDataFieldForIBNActions = getIdentificationDataFieldForIBNActions(converterContext.getEntityType(), false);
    headerDataFieldForIBNActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) === -1;
    }).map(function (dataField) {
      var _dataField$annotation, _dataField$annotation2;

      var oNavigationParams = {
        semanticObjectMapping: dataField.Mapping ? getSemanticObjectMapping(dataField.Mapping) : []
      };

      if (dataField.RequiresContext === true) {
        throw new Error("RequiresContext property should not be true for header IBN action : " + dataField.Label);
      } else if (dataField.Inline === true) {
        throw new Error("Inline property should not be true for header IBN action : " + dataField.Label);
      }

      headerActions.push({
        type: ActionType.DataFieldForIntentBasedNavigation,
        text: dataField.Label,
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        buttonType: ButtonType.Ghost,
        visible: compileBinding(not(equal(annotationExpression((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : _dataField$annotation2.Hidden), true))),
        key: KeyHelper.generateKeyFromDataField(dataField),
        isNavigable: true,
        press: compileBinding(fn("._intentBasedNavigation.navigate", [annotationExpression(dataField.SemanticObject), annotationExpression(dataField.Action), oNavigationParams])),
        customData: compileBinding({
          semanticObject: annotationExpression(dataField.SemanticObject),
          action: annotationExpression(dataField.Action)
        })
      });
    }); // Finally the non critical DataFieldForActions

    headerDataFieldForActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) === -1;
    }).map(function (dataField) {
      headerActions.push({
        type: ActionType.DataFieldForAction,
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        key: KeyHelper.generateKeyFromDataField(dataField),
        isNavigable: true
      });
    });
    return headerActions;
  }

  _exports.getHeaderDefaultActions = getHeaderDefaultActions;

  function getFooterDefaultActions(viewLevel, converterContext) {
    var _entitySet$annotation7, _entitySet$annotation8, _entitySet$annotation9, _entitySet$annotation10, _entitySet$annotation11, _entitySet$annotation12, _entitySet$annotation13;

    var entitySet = converterContext.getEntitySet();
    var oStickySessionSupported = entitySet && ((_entitySet$annotation7 = entitySet.annotations) === null || _entitySet$annotation7 === void 0 ? void 0 : (_entitySet$annotation8 = _entitySet$annotation7.Session) === null || _entitySet$annotation8 === void 0 ? void 0 : _entitySet$annotation8.StickySessionSupported),
        //for sticky app
    sEntitySetDraftRoot = entitySet && (((_entitySet$annotation9 = entitySet.annotations.Common) === null || _entitySet$annotation9 === void 0 ? void 0 : (_entitySet$annotation10 = _entitySet$annotation9.DraftRoot) === null || _entitySet$annotation10 === void 0 ? void 0 : _entitySet$annotation10.term) || ((_entitySet$annotation11 = entitySet.annotations) === null || _entitySet$annotation11 === void 0 ? void 0 : (_entitySet$annotation12 = _entitySet$annotation11.Session) === null || _entitySet$annotation12 === void 0 ? void 0 : (_entitySet$annotation13 = _entitySet$annotation12.StickySessionSupported) === null || _entitySet$annotation13 === void 0 ? void 0 : _entitySet$annotation13.term)),
        bConditionSave = sEntitySetDraftRoot === "com.sap.vocabularies.Common.v1.DraftRoot" || oStickySessionSupported && (oStickySessionSupported === null || oStickySessionSupported === void 0 ? void 0 : oStickySessionSupported.SaveAction),
        bConditionApply = viewLevel > 1,
        bConditionCancel = sEntitySetDraftRoot === "com.sap.vocabularies.Common.v1.DraftRoot" || oStickySessionSupported && (oStickySessionSupported === null || oStickySessionSupported === void 0 ? void 0 : oStickySessionSupported.DiscardAction); // Retrieve all determining actions

    var headerDataFieldForActions = getIdentificationDataFieldForActions(converterContext.getEntityType(), true); // First add the "Critical" DataFieldForActions

    var footerActions = headerDataFieldForActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) > -1;
    }).map(function (dataField) {
      return {
        type: ActionType.DataFieldForAction,
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        key: KeyHelper.generateKeyFromDataField(dataField),
        isNavigable: true
      };
    }); // Then the save action if it exists

    if (bConditionSave) {
      footerActions.push({
        type: ActionType.Primary,
        key: "SaveAction"
      });
    } // Then the apply action if it exists


    if (bConditionApply) {
      footerActions.push({
        type: ActionType.DefaultApply,
        key: "ApplyAction"
      });
    } // Then the non critical DataFieldForActions


    headerDataFieldForActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) === -1;
    }).map(function (dataField) {
      footerActions.push({
        type: ActionType.DataFieldForAction,
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        key: KeyHelper.generateKeyFromDataField(dataField),
        isNavigable: true
      });
    }); // Then the cancel action if it exists

    if (bConditionCancel) {
      footerActions.push({
        type: ActionType.Secondary,
        key: "CancelAction",
        position: {
          placement: Placement.End
        }
      });
    }

    return footerActions;
  }

  _exports.getFooterDefaultActions = getFooterDefaultActions;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhlYWRlckFuZEZvb3RlckFjdGlvbi50cyJdLCJuYW1lcyI6WyJnZXRJZGVudGlmaWNhdGlvbkRhdGFGaWVsZEZvckFjdGlvbnMiLCJlbnRpdHlUeXBlIiwiYkRldGVybWluaW5nIiwiYW5ub3RhdGlvbnMiLCJVSSIsIklkZW50aWZpY2F0aW9uIiwiZmlsdGVyIiwiaWRlbnRpZmljYXRpb25EYXRhRmllbGQiLCJIaWRkZW4iLCIkVHlwZSIsIkRldGVybWluaW5nIiwiQWN0aW9uVGFyZ2V0IiwiaXNCb3VuZCIsIkNvcmUiLCJPcGVyYXRpb25BdmFpbGFibGUiLCJnZXRJZGVudGlmaWNhdGlvbkRhdGFGaWVsZEZvcklCTkFjdGlvbnMiLCJJTVBPUlRBTlRfQ1JJVElDQUxJVElFUyIsImdldEhlYWRlckRlZmF1bHRBY3Rpb25zIiwiY29udmVydGVyQ29udGV4dCIsImVudGl0eVNldCIsImdldEVudGl0eVNldCIsIm9TdGlja3lTZXNzaW9uU3VwcG9ydGVkIiwiU2Vzc2lvbiIsIlN0aWNreVNlc3Npb25TdXBwb3J0ZWQiLCJvRHJhZnRSb290IiwiQ29tbW9uIiwiRHJhZnRSb290Iiwib0VudGl0eURlbGV0ZVJlc3RyaWN0aW9ucyIsIkNhcGFiaWxpdGllcyIsIkRlbGV0ZVJlc3RyaWN0aW9ucyIsImJVcGRhdGVIaWRkZW4iLCJVcGRhdGVIaWRkZW4iLCJvRGF0YU1vZGVsT2JqZWN0UGF0aCIsImdldERhdGFNb2RlbE9iamVjdFBhdGgiLCJpc1BhcmVudERlbGV0YWJsZSIsImlzUGF0aERlbGV0YWJsZSIsImJQYXJlbnRFbnRpdHlTZXREZWxldGFibGUiLCJjb21waWxlQmluZGluZyIsImhlYWRlckRhdGFGaWVsZEZvckFjdGlvbnMiLCJnZXRFbnRpdHlUeXBlIiwiaGVhZGVyQWN0aW9ucyIsImRhdGFGaWVsZCIsImluZGV4T2YiLCJDcml0aWNhbGl0eSIsIm1hcCIsInR5cGUiLCJBY3Rpb25UeXBlIiwiRGF0YUZpZWxkRm9yQWN0aW9uIiwiYW5ub3RhdGlvblBhdGgiLCJnZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwia2V5IiwiS2V5SGVscGVyIiwiZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkIiwiaXNOYXZpZ2FibGUiLCJFZGl0QWN0aW9uIiwicHVzaCIsIlByaW1hcnkiLCJEZWxldGFibGUiLCJTZWNvbmRhcnkiLCJwYXJlbnRFbnRpdHlEZWxldGVFbmFibGVkIiwiaGVhZGVyRGF0YUZpZWxkRm9ySUJOQWN0aW9ucyIsIm9OYXZpZ2F0aW9uUGFyYW1zIiwic2VtYW50aWNPYmplY3RNYXBwaW5nIiwiTWFwcGluZyIsImdldFNlbWFudGljT2JqZWN0TWFwcGluZyIsIlJlcXVpcmVzQ29udGV4dCIsIkVycm9yIiwiTGFiZWwiLCJJbmxpbmUiLCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24iLCJ0ZXh0IiwiYnV0dG9uVHlwZSIsIkJ1dHRvblR5cGUiLCJHaG9zdCIsInZpc2libGUiLCJub3QiLCJlcXVhbCIsImFubm90YXRpb25FeHByZXNzaW9uIiwicHJlc3MiLCJmbiIsIlNlbWFudGljT2JqZWN0IiwiQWN0aW9uIiwiY3VzdG9tRGF0YSIsInNlbWFudGljT2JqZWN0IiwiYWN0aW9uIiwiZ2V0Rm9vdGVyRGVmYXVsdEFjdGlvbnMiLCJ2aWV3TGV2ZWwiLCJzRW50aXR5U2V0RHJhZnRSb290IiwidGVybSIsImJDb25kaXRpb25TYXZlIiwiU2F2ZUFjdGlvbiIsImJDb25kaXRpb25BcHBseSIsImJDb25kaXRpb25DYW5jZWwiLCJEaXNjYXJkQWN0aW9uIiwiZm9vdGVyQWN0aW9ucyIsIkRlZmF1bHRBcHBseSIsInBvc2l0aW9uIiwicGxhY2VtZW50IiwiUGxhY2VtZW50IiwiRW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7QUFVTyxXQUFTQSxvQ0FBVCxDQUE4Q0MsVUFBOUMsRUFBc0VDLFlBQXRFLEVBQXdIO0FBQUE7O0FBQzlILFdBQVEsMEJBQUFELFVBQVUs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QUFBQSxRQUFRLEVBQUU7QUFBRUMsVUFBQUEsU0FBUyxFQUFFQyxTQUFTLENBQUNDO0FBQXZCO0FBSFEsT0FBbkI7QUFLQTs7QUFDRCxXQUFPTCxhQUFQO0FBQ0EiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvblR5cGUgfSBmcm9tIFwiLi4vTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHsgRW50aXR5VHlwZSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQgeyBBbm5vdGF0aW9uQWN0aW9uLCBCYXNlQWN0aW9uLCBCdXR0b25UeXBlLCBnZXRTZW1hbnRpY09iamVjdE1hcHBpbmcgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9Db21tb24vQWN0aW9uXCI7XG5pbXBvcnQgeyBEYXRhRmllbGRGb3JBY3Rpb25UeXBlcywgRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uVHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB7IFBsYWNlbWVudCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQ29uZmlndXJhYmxlT2JqZWN0XCI7XG5pbXBvcnQgeyBDb252ZXJ0ZXJDb250ZXh0IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvdGVtcGxhdGVzL0Jhc2VDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IGFubm90YXRpb25FeHByZXNzaW9uLCBjb21waWxlQmluZGluZywgbm90LCBlcXVhbCwgZm4gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IHsgS2V5SGVscGVyIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9LZXlcIjtcbmltcG9ydCB7IGlzUGF0aERlbGV0YWJsZSB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcblxuLyoqXG4gKiBSZXRyaWV2ZSBhbGwgdGhlIGRhdGEgZmllbGQgZm9yIGFjdGlvbnMgZm9yIHRoZSBpZGVudGlmaWNhdGlvbiBhbm5vdGF0aW9uXG4gKiBUaGV5IG11c3QgYmVcbiAqIC0gTm90IHN0YXRpY2FsbHkgaGlkZGVuXG4gKiAtIEVpdGhlciBsaW5rZWQgdG8gYW4gVW5ib3VuZCBhY3Rpb24gb3IgdG8gYW4gYWN0aW9uIHdoaWNoIGhhcyBhbiBPcGVyYXRpb25BdmFpbGFibGUgbm90IHN0YXRpY2FsbHkgZmFsc2UuXG4gKlxuICogQHBhcmFtIHtFbnRpdHlUeXBlfSBlbnRpdHlUeXBlIHRoZSBjdXJyZW50IGVudGl0eXR5cGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYkRldGVybWluaW5nIHdoZXRoZXIgb3Igbm90IHRoZSBhY3Rpb24gc2hvdWxkIGJlIGRldGVybWluaW5nXG4gKiBAcmV0dXJucyB7RGF0YUZpZWxkRm9yQWN0aW9uVHlwZXNbXX0gYW4gYXJyYXkgb2YgZGF0YWZpZWxkIGZvciBhY3Rpb24gcmVzcGVjdGluZyB0aGUgYkRldGVybWluaW5nIHByb3BlcnR5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJZGVudGlmaWNhdGlvbkRhdGFGaWVsZEZvckFjdGlvbnMoZW50aXR5VHlwZTogRW50aXR5VHlwZSwgYkRldGVybWluaW5nOiBib29sZWFuKTogRGF0YUZpZWxkRm9yQWN0aW9uVHlwZXNbXSB7XG5cdHJldHVybiAoZW50aXR5VHlwZS5hbm5vdGF0aW9ucz8uVUk/LklkZW50aWZpY2F0aW9uPy5maWx0ZXIoaWRlbnRpZmljYXRpb25EYXRhRmllbGQgPT4ge1xuXHRcdGlmIChpZGVudGlmaWNhdGlvbkRhdGFGaWVsZD8uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4gIT09IHRydWUpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0aWRlbnRpZmljYXRpb25EYXRhRmllbGQ/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiICYmXG5cdFx0XHRcdCEhaWRlbnRpZmljYXRpb25EYXRhRmllbGQuRGV0ZXJtaW5pbmcgPT09IGJEZXRlcm1pbmluZyAmJlxuXHRcdFx0XHQoIWlkZW50aWZpY2F0aW9uRGF0YUZpZWxkPy5BY3Rpb25UYXJnZXQ/LmlzQm91bmQgfHxcblx0XHRcdFx0XHRpZGVudGlmaWNhdGlvbkRhdGFGaWVsZD8uQWN0aW9uVGFyZ2V0Py5hbm5vdGF0aW9ucz8uQ29yZT8uT3BlcmF0aW9uQXZhaWxhYmxlICE9PSBmYWxzZSlcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KSB8fCBbXSkgYXMgRGF0YUZpZWxkRm9yQWN0aW9uVHlwZXNbXTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSBhbGwgdGhlIElCTiBhY3Rpb25zIGZvciB0aGUgaWRlbnRpZmljYXRpb24gYW5ub3RhdGlvbi5cbiAqIFRoZXkgbXVzdCBiZVxuICogLSBOb3Qgc3RhdGljYWxseSBoaWRkZW4uXG4gKiBAcGFyYW0ge0VudGl0eVR5cGV9IGVudGl0eVR5cGUgdGhlIGN1cnJlbnQgZW50aXR5dHlwZVxuICogQHBhcmFtIHtib29sZWFufSBiRGV0ZXJtaW5pbmcgd2hldGhlciBvciBub3QgdGhlIGFjdGlvbiBzaG91bGQgYmUgZGV0ZXJtaW5pbmdcbiAqIEByZXR1cm5zIHtEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25UeXBlc1tdfSBhbiBhcnJheSBvZiBkYXRhZmllbGQgZm9yIGFjdGlvbiByZXNwZWN0aW5nIHRoZSBiRGV0ZXJtaW5pbmcgcHJvcGVydHkuXG4gKi9cbmZ1bmN0aW9uIGdldElkZW50aWZpY2F0aW9uRGF0YUZpZWxkRm9ySUJOQWN0aW9ucyhlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLCBiRGV0ZXJtaW5pbmc6IGJvb2xlYW4pOiBEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25UeXBlc1tdIHtcblx0cmV0dXJuIChlbnRpdHlUeXBlLmFubm90YXRpb25zPy5VST8uSWRlbnRpZmljYXRpb24/LmZpbHRlcihpZGVudGlmaWNhdGlvbkRhdGFGaWVsZCA9PiB7XG5cdFx0aWYgKGlkZW50aWZpY2F0aW9uRGF0YUZpZWxkPy5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiAhPT0gdHJ1ZSkge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRpZGVudGlmaWNhdGlvbkRhdGFGaWVsZD8uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uXCIgJiZcblx0XHRcdFx0ISFpZGVudGlmaWNhdGlvbkRhdGFGaWVsZC5EZXRlcm1pbmluZyA9PT0gYkRldGVybWluaW5nXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KSB8fCBbXSkgYXMgRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uVHlwZXNbXTtcbn1cblxuY29uc3QgSU1QT1JUQU5UX0NSSVRJQ0FMSVRJRVMgPSBbXG5cdFwiVUkuQ3JpdGljYWxpdHlUeXBlL1ZlcnlQb3NpdGl2ZVwiLFxuXHRcIlVJLkNyaXRpY2FsaXR5VHlwZS9Qb3NpdGl2ZVwiLFxuXHRcIlVJLkNyaXRpY2FsaXR5VHlwZS9OZWdhdGl2ZVwiLFxuXHRcIlVJLkNyaXRpY2FsaXR5VHlwZS9WZXJ5TmVnYXRpdmVcIlxuXTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRIZWFkZXJEZWZhdWx0QWN0aW9ucyhjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQmFzZUFjdGlvbltdIHtcblx0Y29uc3QgZW50aXR5U2V0ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKTtcblx0Y29uc3Qgb1N0aWNreVNlc3Npb25TdXBwb3J0ZWQgPSBlbnRpdHlTZXQgJiYgZW50aXR5U2V0LmFubm90YXRpb25zPy5TZXNzaW9uPy5TdGlja3lTZXNzaW9uU3VwcG9ydGVkLCAvL2ZvciBzdGlja3kgYXBwXG5cdFx0b0RyYWZ0Um9vdCA9IGVudGl0eVNldCAmJiBlbnRpdHlTZXQuYW5ub3RhdGlvbnMuQ29tbW9uPy5EcmFmdFJvb3QsXG5cdFx0b0VudGl0eURlbGV0ZVJlc3RyaWN0aW9ucyA9IGVudGl0eVNldCAmJiBlbnRpdHlTZXQuYW5ub3RhdGlvbnM/LkNhcGFiaWxpdGllcz8uRGVsZXRlUmVzdHJpY3Rpb25zLFxuXHRcdGJVcGRhdGVIaWRkZW4gPSBlbnRpdHlTZXQgJiYgZW50aXR5U2V0LmFubm90YXRpb25zLlVJPy5VcGRhdGVIaWRkZW47XG5cdGNvbnN0IG9EYXRhTW9kZWxPYmplY3RQYXRoID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksXG5cdFx0aXNQYXJlbnREZWxldGFibGUgPSBpc1BhdGhEZWxldGFibGUob0RhdGFNb2RlbE9iamVjdFBhdGgpLFxuXHRcdGJQYXJlbnRFbnRpdHlTZXREZWxldGFibGUgPSBpc1BhcmVudERlbGV0YWJsZSA/IGNvbXBpbGVCaW5kaW5nKGlzUGFyZW50RGVsZXRhYmxlKSA6IGlzUGFyZW50RGVsZXRhYmxlO1xuXG5cdGNvbnN0IGhlYWRlckRhdGFGaWVsZEZvckFjdGlvbnMgPSBnZXRJZGVudGlmaWNhdGlvbkRhdGFGaWVsZEZvckFjdGlvbnMoY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCksIGZhbHNlKTtcblxuXHQvLyBGaXJzdCBhZGQgdGhlIFwiQ3JpdGljYWxcIiBEYXRhRmllbGRGb3JBY3Rpb25zXG5cdGNvbnN0IGhlYWRlckFjdGlvbnM6IEJhc2VBY3Rpb25bXSA9IGhlYWRlckRhdGFGaWVsZEZvckFjdGlvbnNcblx0XHQuZmlsdGVyKGRhdGFGaWVsZCA9PiB7XG5cdFx0XHRyZXR1cm4gSU1QT1JUQU5UX0NSSVRJQ0FMSVRJRVMuaW5kZXhPZihkYXRhRmllbGQ/LkNyaXRpY2FsaXR5IGFzIHN0cmluZykgPiAtMTtcblx0XHR9KVxuXHRcdC5tYXAoZGF0YUZpZWxkID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9yQWN0aW9uLFxuXHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKSxcblx0XHRcdFx0aXNOYXZpZ2FibGU6IHRydWVcblx0XHRcdH07XG5cdFx0fSk7XG5cblx0Ly8gVGhlbiB0aGUgZWRpdCBhY3Rpb24gaWYgaXQgZXhpc3RzXG5cdGlmICgob0RyYWZ0Um9vdD8uRWRpdEFjdGlvbiB8fCBvU3RpY2t5U2Vzc2lvblN1cHBvcnRlZD8uRWRpdEFjdGlvbikgJiYgYlVwZGF0ZUhpZGRlbiAhPT0gdHJ1ZSkge1xuXHRcdGhlYWRlckFjdGlvbnMucHVzaCh7IHR5cGU6IEFjdGlvblR5cGUuUHJpbWFyeSwga2V5OiBcIkVkaXRBY3Rpb25cIiB9KTtcblx0fVxuXHQvLyBUaGVuIHRoZSBkZWxldGUgYWN0aW9uIGlmIHdlJ3JlIG5vdCBzdGF0aWNhbGx5IG5vdCBkZWxldGFibGVcblx0aWYgKFxuXHRcdChiUGFyZW50RW50aXR5U2V0RGVsZXRhYmxlICYmIGJQYXJlbnRFbnRpdHlTZXREZWxldGFibGUgIT09IFwiZmFsc2VcIikgfHxcblx0XHQob0VudGl0eURlbGV0ZVJlc3RyaWN0aW9ucz8uRGVsZXRhYmxlICE9PSBmYWxzZSAmJiBiUGFyZW50RW50aXR5U2V0RGVsZXRhYmxlICE9PSBcImZhbHNlXCIpXG5cdCkge1xuXHRcdGhlYWRlckFjdGlvbnMucHVzaCh7IHR5cGU6IEFjdGlvblR5cGUuU2Vjb25kYXJ5LCBrZXk6IFwiRGVsZXRlQWN0aW9uXCIsIHBhcmVudEVudGl0eURlbGV0ZUVuYWJsZWQ6IGJQYXJlbnRFbnRpdHlTZXREZWxldGFibGUgfSk7XG5cdH1cblxuXHRjb25zdCBoZWFkZXJEYXRhRmllbGRGb3JJQk5BY3Rpb25zID0gZ2V0SWRlbnRpZmljYXRpb25EYXRhRmllbGRGb3JJQk5BY3Rpb25zKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLCBmYWxzZSk7XG5cblx0aGVhZGVyRGF0YUZpZWxkRm9ySUJOQWN0aW9uc1xuXHRcdC5maWx0ZXIoZGF0YUZpZWxkID0+IHtcblx0XHRcdHJldHVybiBJTVBPUlRBTlRfQ1JJVElDQUxJVElFUy5pbmRleE9mKGRhdGFGaWVsZD8uQ3JpdGljYWxpdHkgYXMgc3RyaW5nKSA9PT0gLTE7XG5cdFx0fSlcblx0XHQubWFwKGRhdGFGaWVsZCA9PiB7XG5cdFx0XHRjb25zdCBvTmF2aWdhdGlvblBhcmFtcyA9IHtcblx0XHRcdFx0c2VtYW50aWNPYmplY3RNYXBwaW5nOiBkYXRhRmllbGQuTWFwcGluZyA/IGdldFNlbWFudGljT2JqZWN0TWFwcGluZyhkYXRhRmllbGQuTWFwcGluZykgOiBbXVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKGRhdGFGaWVsZC5SZXF1aXJlc0NvbnRleHQgPT09IHRydWUpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUmVxdWlyZXNDb250ZXh0IHByb3BlcnR5IHNob3VsZCBub3QgYmUgdHJ1ZSBmb3IgaGVhZGVyIElCTiBhY3Rpb24gOiBcIiArIGRhdGFGaWVsZC5MYWJlbCk7XG5cdFx0XHR9IGVsc2UgaWYgKGRhdGFGaWVsZC5JbmxpbmUgPT09IHRydWUpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5saW5lIHByb3BlcnR5IHNob3VsZCBub3QgYmUgdHJ1ZSBmb3IgaGVhZGVyIElCTiBhY3Rpb24gOiBcIiArIGRhdGFGaWVsZC5MYWJlbCk7XG5cdFx0XHR9XG5cdFx0XHRoZWFkZXJBY3Rpb25zLnB1c2goe1xuXHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbixcblx0XHRcdFx0dGV4dDogZGF0YUZpZWxkLkxhYmVsIGFzIHN0cmluZyxcblx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChkYXRhRmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSxcblx0XHRcdFx0YnV0dG9uVHlwZTogQnV0dG9uVHlwZS5HaG9zdCxcblx0XHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcobm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiksIHRydWUpKSksXG5cdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpLFxuXHRcdFx0XHRpc05hdmlnYWJsZTogdHJ1ZSxcblx0XHRcdFx0cHJlc3M6IGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRcdGZuKFwiLl9pbnRlbnRCYXNlZE5hdmlnYXRpb24ubmF2aWdhdGVcIiwgW1xuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLlNlbWFudGljT2JqZWN0KSxcblx0XHRcdFx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5BY3Rpb24pLFxuXHRcdFx0XHRcdFx0b05hdmlnYXRpb25QYXJhbXNcblx0XHRcdFx0XHRdKVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRjdXN0b21EYXRhOiBjb21waWxlQmluZGluZyh7XG5cdFx0XHRcdFx0c2VtYW50aWNPYmplY3Q6IGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5TZW1hbnRpY09iamVjdCksXG5cdFx0XHRcdFx0YWN0aW9uOiBhbm5vdGF0aW9uRXhwcmVzc2lvbihkYXRhRmllbGQuQWN0aW9uKVxuXHRcdFx0XHR9KVxuXHRcdFx0fSBhcyBBbm5vdGF0aW9uQWN0aW9uKTtcblx0XHR9KTtcblx0Ly8gRmluYWxseSB0aGUgbm9uIGNyaXRpY2FsIERhdGFGaWVsZEZvckFjdGlvbnNcblx0aGVhZGVyRGF0YUZpZWxkRm9yQWN0aW9uc1xuXHRcdC5maWx0ZXIoZGF0YUZpZWxkID0+IHtcblx0XHRcdHJldHVybiBJTVBPUlRBTlRfQ1JJVElDQUxJVElFUy5pbmRleE9mKGRhdGFGaWVsZD8uQ3JpdGljYWxpdHkgYXMgc3RyaW5nKSA9PT0gLTE7XG5cdFx0fSlcblx0XHQubWFwKGRhdGFGaWVsZCA9PiB7XG5cdFx0XHRoZWFkZXJBY3Rpb25zLnB1c2goe1xuXHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRhdGFGaWVsZEZvckFjdGlvbixcblx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChkYXRhRmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSxcblx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCksXG5cdFx0XHRcdGlzTmF2aWdhYmxlOiB0cnVlXG5cdFx0XHR9IGFzIEFubm90YXRpb25BY3Rpb24pO1xuXHRcdH0pO1xuXG5cdHJldHVybiBoZWFkZXJBY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Rm9vdGVyRGVmYXVsdEFjdGlvbnModmlld0xldmVsOiBudW1iZXIsIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBCYXNlQWN0aW9uW10ge1xuXHRjb25zdCBlbnRpdHlTZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpO1xuXHRjb25zdCBvU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCA9IGVudGl0eVNldCAmJiBlbnRpdHlTZXQuYW5ub3RhdGlvbnM/LlNlc3Npb24/LlN0aWNreVNlc3Npb25TdXBwb3J0ZWQsIC8vZm9yIHN0aWNreSBhcHBcblx0XHRzRW50aXR5U2V0RHJhZnRSb290ID1cblx0XHRcdGVudGl0eVNldCAmJiAoZW50aXR5U2V0LmFubm90YXRpb25zLkNvbW1vbj8uRHJhZnRSb290Py50ZXJtIHx8IGVudGl0eVNldC5hbm5vdGF0aW9ucz8uU2Vzc2lvbj8uU3RpY2t5U2Vzc2lvblN1cHBvcnRlZD8udGVybSksXG5cdFx0YkNvbmRpdGlvblNhdmUgPVxuXHRcdFx0c0VudGl0eVNldERyYWZ0Um9vdCA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRHJhZnRSb290XCIgfHxcblx0XHRcdChvU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCAmJiBvU3RpY2t5U2Vzc2lvblN1cHBvcnRlZD8uU2F2ZUFjdGlvbiksXG5cdFx0YkNvbmRpdGlvbkFwcGx5ID0gdmlld0xldmVsID4gMSxcblx0XHRiQ29uZGl0aW9uQ2FuY2VsID1cblx0XHRcdHNFbnRpdHlTZXREcmFmdFJvb3QgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Um9vdFwiIHx8XG5cdFx0XHQob1N0aWNreVNlc3Npb25TdXBwb3J0ZWQgJiYgb1N0aWNreVNlc3Npb25TdXBwb3J0ZWQ/LkRpc2NhcmRBY3Rpb24pO1xuXG5cdC8vIFJldHJpZXZlIGFsbCBkZXRlcm1pbmluZyBhY3Rpb25zXG5cdGNvbnN0IGhlYWRlckRhdGFGaWVsZEZvckFjdGlvbnMgPSBnZXRJZGVudGlmaWNhdGlvbkRhdGFGaWVsZEZvckFjdGlvbnMoY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCksIHRydWUpO1xuXG5cdC8vIEZpcnN0IGFkZCB0aGUgXCJDcml0aWNhbFwiIERhdGFGaWVsZEZvckFjdGlvbnNcblx0Y29uc3QgZm9vdGVyQWN0aW9uczogQmFzZUFjdGlvbltdID0gaGVhZGVyRGF0YUZpZWxkRm9yQWN0aW9uc1xuXHRcdC5maWx0ZXIoZGF0YUZpZWxkID0+IHtcblx0XHRcdHJldHVybiBJTVBPUlRBTlRfQ1JJVElDQUxJVElFUy5pbmRleE9mKGRhdGFGaWVsZD8uQ3JpdGljYWxpdHkgYXMgc3RyaW5nKSA+IC0xO1xuXHRcdH0pXG5cdFx0Lm1hcChkYXRhRmllbGQgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JBY3Rpb24sXG5cdFx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoZGF0YUZpZWxkLmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpLFxuXHRcdFx0XHRpc05hdmlnYWJsZTogdHJ1ZVxuXHRcdFx0fTtcblx0XHR9KTtcblxuXHQvLyBUaGVuIHRoZSBzYXZlIGFjdGlvbiBpZiBpdCBleGlzdHNcblx0aWYgKGJDb25kaXRpb25TYXZlKSB7XG5cdFx0Zm9vdGVyQWN0aW9ucy5wdXNoKHsgdHlwZTogQWN0aW9uVHlwZS5QcmltYXJ5LCBrZXk6IFwiU2F2ZUFjdGlvblwiIH0pO1xuXHR9XG5cblx0Ly8gVGhlbiB0aGUgYXBwbHkgYWN0aW9uIGlmIGl0IGV4aXN0c1xuXHRpZiAoYkNvbmRpdGlvbkFwcGx5KSB7XG5cdFx0Zm9vdGVyQWN0aW9ucy5wdXNoKHsgdHlwZTogQWN0aW9uVHlwZS5EZWZhdWx0QXBwbHksIGtleTogXCJBcHBseUFjdGlvblwiIH0pO1xuXHR9XG5cblx0Ly8gVGhlbiB0aGUgbm9uIGNyaXRpY2FsIERhdGFGaWVsZEZvckFjdGlvbnNcblx0aGVhZGVyRGF0YUZpZWxkRm9yQWN0aW9uc1xuXHRcdC5maWx0ZXIoZGF0YUZpZWxkID0+IHtcblx0XHRcdHJldHVybiBJTVBPUlRBTlRfQ1JJVElDQUxJVElFUy5pbmRleE9mKGRhdGFGaWVsZD8uQ3JpdGljYWxpdHkgYXMgc3RyaW5nKSA9PT0gLTE7XG5cdFx0fSlcblx0XHQubWFwKGRhdGFGaWVsZCA9PiB7XG5cdFx0XHRmb290ZXJBY3Rpb25zLnB1c2goe1xuXHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRhdGFGaWVsZEZvckFjdGlvbixcblx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChkYXRhRmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSxcblx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCksXG5cdFx0XHRcdGlzTmF2aWdhYmxlOiB0cnVlXG5cdFx0XHR9IGFzIEFubm90YXRpb25BY3Rpb24pO1xuXHRcdH0pO1xuXG5cdC8vIFRoZW4gdGhlIGNhbmNlbCBhY3Rpb24gaWYgaXQgZXhpc3RzXG5cdGlmIChiQ29uZGl0aW9uQ2FuY2VsKSB7XG5cdFx0Zm9vdGVyQWN0aW9ucy5wdXNoKHtcblx0XHRcdHR5cGU6IEFjdGlvblR5cGUuU2Vjb25kYXJ5LFxuXHRcdFx0a2V5OiBcIkNhbmNlbEFjdGlvblwiLFxuXHRcdFx0cG9zaXRpb246IHsgcGxhY2VtZW50OiBQbGFjZW1lbnQuRW5kIH1cblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gZm9vdGVyQWN0aW9ucztcbn1cbiJdfQ==