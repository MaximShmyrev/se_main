sap.ui.define(["../../templates/BaseConverter", "../../ManifestSettings", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/annotations/DataField", "../../helpers/ID", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/Key", "sap/fe/core/templating/DataModelPathHelper"], function (BaseConverter, ManifestSettings, Action, DataField, ID, ConfigurableObject, Key, DataModelPathHelper) {
  "use strict";

  var _exports = {};
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var KeyHelper = Key.KeyHelper;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var FilterBarID = ID.FilterBarID;
  var ChartID = ID.ChartID;
  var isDataFieldForActionAbstract = DataField.isDataFieldForActionAbstract;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var ActionType = ManifestSettings.ActionType;
  var VisualizationType = ManifestSettings.VisualizationType;
  var TemplateType = BaseConverter.TemplateType;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  /**
   * Method to retrieve all chart actions from annotations.
   *
   * @param chartAnnotation
   * @param visualizationPath
   * @param converterContext
   * @returns {BaseAction[]} the table annotation actions
   */
  function getChartActionsFromAnnotations(chartAnnotation, visualizationPath, converterContext) {
    var chartActions = [];

    if (chartAnnotation) {
      var aActions = chartAnnotation.Actions || [];
      aActions.forEach(function (dataField) {
        var _dataField$annotation, _dataField$annotation2;

        var chartAction;

        if (isDataFieldForActionAbstract(dataField) && !(((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : _dataField$annotation2.Hidden) === true) && !dataField.Inline && !dataField.Determining) {
          var key = KeyHelper.generateKeyFromDataField(dataField);

          switch (dataField.$Type) {
            case "com.sap.vocabularies.UI.v1.DataFieldForAction":
              chartAction = {
                type: ActionType.DataFieldForAction,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key
              };
              break;

            case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
              chartAction = {
                type: ActionType.DataFieldForIntentBasedNavigation,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key
              };
              break;
          }
        }

        if (chartAction) {
          chartActions.push(chartAction);
        }
      });
    }

    return chartActions;
  }

  function getChartActions(chartAnnotation, visualizationPath, converterContext) {
    return insertCustomElements(getChartActionsFromAnnotations(chartAnnotation, visualizationPath, converterContext), getActionsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).actions, converterContext), {
      enableOnSelect: "overwrite"
    });
  }

  _exports.getChartActions = getChartActions;

  function getP13nMode(visualizationPath, converterContext) {
    var _chartManifestSetting;

    var manifestWrapper = converterContext.getManifestWrapper();
    var chartManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var hasVariantManagement = ["Page", "Control"].indexOf(manifestWrapper.getVariantManagement()) > -1;
    var personalization = true;
    var aPersonalization = [];

    if ((chartManifestSettings === null || chartManifestSettings === void 0 ? void 0 : (_chartManifestSetting = chartManifestSettings.chartSettings) === null || _chartManifestSetting === void 0 ? void 0 : _chartManifestSetting.personalization) !== undefined) {
      personalization = chartManifestSettings.chartSettings.personalization;
    }

    if (hasVariantManagement && personalization) {
      if (personalization === true) {
        return "Sort,Type,Item";
      } else if (typeof personalization === "object") {
        if (personalization.type) {
          aPersonalization.push("Type");
        }

        if (personalization.item) {
          aPersonalization.push("Item");
        }

        if (personalization.sort) {
          aPersonalization.push("Sort");
        }

        return aPersonalization.join(",");
      }
    }

    return undefined;
  }
  /**
   * Create the ChartVisualization configuration that will be used to display a chart via Chart Macro.
   *
   * @param {ChartDefinitionTypeTypes} chartAnnotation the target chart annotation
   * @param {string} visualizationPath the current visualization annotation path
   * @param {ConverterContext} converterContext the converter context
   * @returns {ChartVisualization} the chart visualization based on the annotation
   */


  _exports.getP13nMode = getP13nMode;

  function createChartVisualization(chartAnnotation, visualizationPath, converterContext) {
    var _converterContext$get, _converterContext$get2, _converterContext$get3;

    var chartActions = getChartActions(chartAnnotation, visualizationPath, converterContext);

    var _visualizationPath$sp = visualizationPath.split("@"),
        _visualizationPath$sp2 = _slicedToArray(_visualizationPath$sp, 1),
        navigationPropertyPath
    /*, annotationPath*/
    = _visualizationPath$sp2[0];

    if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
      // Drop trailing slash
      navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
    }

    var title = (_converterContext$get = converterContext.getDataModelObjectPath().targetEntityType.annotations) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.UI) === null || _converterContext$get2 === void 0 ? void 0 : (_converterContext$get3 = _converterContext$get2.HeaderInfo) === null || _converterContext$get3 === void 0 ? void 0 : _converterContext$get3.TypeNamePlural;
    var dataModelPath = converterContext.getDataModelObjectPath();
    var isEntitySet = navigationPropertyPath.length === 0;
    var entityName = dataModelPath.targetEntitySet ? dataModelPath.targetEntitySet.name : dataModelPath.startingEntitySet.name;
    var sFilterbarId = isEntitySet ? FilterBarID(entityName) : undefined;
    var oVizProperties = {
      "legendGroup": {
        "layout": {
          "position": "bottom"
        }
      }
    };
    return {
      type: VisualizationType.Chart,
      id: ChartID(isEntitySet ? entityName : navigationPropertyPath, VisualizationType.Chart),
      collection: getTargetObjectPath(converterContext.getDataModelObjectPath()),
      entityName: entityName,
      p13nMode: getP13nMode(visualizationPath, converterContext),
      navigationPath: navigationPropertyPath,
      annotationPath: converterContext.getAbsoluteAnnotationPath(visualizationPath),
      filterId: sFilterbarId,
      vizProperties: JSON.stringify(oVizProperties),
      actions: chartActions,
      title: title,
      autoBindOnInit: converterContext.getTemplateType() === TemplateType.ObjectPage
    };
  }

  _exports.createChartVisualization = createChartVisualization;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNoYXJ0LnRzIl0sIm5hbWVzIjpbImdldENoYXJ0QWN0aW9uc0Zyb21Bbm5vdGF0aW9ucyIsImNoYXJ0QW5ub3RhdGlvbiIsInZpc3VhbGl6YXRpb25QYXRoIiwiY29udmVydGVyQ29udGV4dCIsImNoYXJ0QWN0aW9ucyIsImFBY3Rpb25zIiwiQWN0aW9ucyIsImZvckVhY2giLCJkYXRhRmllbGQiLCJjaGFydEFjdGlvbiIsImlzRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3QiLCJhbm5vdGF0aW9ucyIsIlVJIiwiSGlkZGVuIiwiSW5saW5lIiwiRGV0ZXJtaW5pbmciLCJrZXkiLCJLZXlIZWxwZXIiLCJnZW5lcmF0ZUtleUZyb21EYXRhRmllbGQiLCIkVHlwZSIsInR5cGUiLCJBY3Rpb25UeXBlIiwiRGF0YUZpZWxkRm9yQWN0aW9uIiwiYW5ub3RhdGlvblBhdGgiLCJnZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwiRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uIiwicHVzaCIsImdldENoYXJ0QWN0aW9ucyIsImluc2VydEN1c3RvbUVsZW1lbnRzIiwiZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdCIsImdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24iLCJhY3Rpb25zIiwiZW5hYmxlT25TZWxlY3QiLCJnZXRQMTNuTW9kZSIsIm1hbmlmZXN0V3JhcHBlciIsImdldE1hbmlmZXN0V3JhcHBlciIsImNoYXJ0TWFuaWZlc3RTZXR0aW5ncyIsImhhc1ZhcmlhbnRNYW5hZ2VtZW50IiwiaW5kZXhPZiIsImdldFZhcmlhbnRNYW5hZ2VtZW50IiwicGVyc29uYWxpemF0aW9uIiwiYVBlcnNvbmFsaXphdGlvbiIsImNoYXJ0U2V0dGluZ3MiLCJ1bmRlZmluZWQiLCJpdGVtIiwic29ydCIsImpvaW4iLCJjcmVhdGVDaGFydFZpc3VhbGl6YXRpb24iLCJzcGxpdCIsIm5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCJsYXN0SW5kZXhPZiIsImxlbmd0aCIsInN1YnN0ciIsInRpdGxlIiwiZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCIsInRhcmdldEVudGl0eVR5cGUiLCJIZWFkZXJJbmZvIiwiVHlwZU5hbWVQbHVyYWwiLCJkYXRhTW9kZWxQYXRoIiwiaXNFbnRpdHlTZXQiLCJlbnRpdHlOYW1lIiwidGFyZ2V0RW50aXR5U2V0IiwibmFtZSIsInN0YXJ0aW5nRW50aXR5U2V0Iiwic0ZpbHRlcmJhcklkIiwiRmlsdGVyQmFySUQiLCJvVml6UHJvcGVydGllcyIsIlZpc3VhbGl6YXRpb25UeXBlIiwiQ2hhcnQiLCJpZCIsIkNoYXJ0SUQiLCJjb2xsZWN0aW9uIiwiZ2V0VGFyZ2V0T2JqZWN0UGF0aCIsInAxM25Nb2RlIiwibmF2aWdhdGlvblBhdGgiLCJnZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoIiwiZmlsdGVySWQiLCJ2aXpQcm9wZXJ0aWVzIiwiSlNPTiIsInN0cmluZ2lmeSIsImF1dG9CaW5kT25Jbml0IiwiZ2V0VGVtcGxhdGVUeXBlIiwiVGVtcGxhdGVUeXBlIiwiT2JqZWN0UGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0NBOzs7Ozs7OztBQVFBLFdBQVNBLDhCQUFULENBQ0NDLGVBREQsRUFFQ0MsaUJBRkQsRUFHQ0MsZ0JBSEQsRUFJZ0I7QUFDZixRQUFNQyxZQUEwQixHQUFHLEVBQW5DOztBQUNBLFFBQUlILGVBQUosRUFBcUI7QUFDcEIsVUFBTUksUUFBUSxHQUFHSixlQUFlLENBQUNLLE9BQWhCLElBQTJCLEVBQTVDO0FBQ0FELE1BQUFBLFFBQVEsQ0FBQ0UsT0FBVCxDQUFpQixVQUFDQyxTQUFELEVBQXVDO0FBQUE7O0FBQ3ZELFlBQUlDLFdBQUo7O0FBQ0EsWUFDQ0MsNEJBQTRCLENBQUNGLFNBQUQsQ0FBNUIsSUFDQSxFQUFFLDBCQUFBQSxTQUFTLENBQUNHLFdBQVYsMEdBQXVCQyxFQUF2QixrRkFBMkJDLE1BQTNCLE1BQXNDLElBQXhDLENBREEsSUFF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Q0QsSUFBaEk7QUFDQSxRQUFNRSxZQUFZLEdBQUdMLFdBQVcsR0FBR00sV0FBVyxDQUFDTCxVQUFELENBQWQsR0FBNkJqQixTQUE3RDtBQUNBLFFBQU11QixjQUFjLEdBQUc7QUFDdEIscUJBQWU7QUFDZCxrQkFBVTtBQUNULHNCQUFZO0FBREg7QUFESTtBQURPLEtBQXZCO0FBT0EsV0FBTztBQUNOL0MsTUFBQUEsSUFBSSxFQUFFZ0QsaUJBQWlCLENBQUNDLEtBRGxCO0FBRU5DLE1BQUFBLEVBQUUsRUFBRUMsT0FBTyxDQUFDWCxXQUFXLEdBQUdDLFVBQUgsR0FBZ0JYLHNCQUE1QixFQUFvRGtCLGlCQUFpQixDQUFDQyxLQUF0RSxDQUZMO0FBR05HLE1BQUFBLFVBQVUsRUFBRUMsbUJBQW1CLENBQUN0RSxnQkFBZ0IsQ0FBQ29ELHNCQUFqQixFQUFELENBSHpCO0FBSU5NLE1BQUFBLFVBQVUsRUFBRUEsVUFKTjtBQUtOYSxNQUFBQSxRQUFRLEVBQUV4QyxXQUFXLENBQUNoQyxpQkFBRCxFQUFvQkMsZ0JBQXBCLENBTGY7QUFNTndFLE1BQUFBLGNBQWMsRUFBRXpCLHNCQU5WO0FBT04zQixNQUFBQSxjQUFjLEVBQUVwQixnQkFBZ0IsQ0FBQ3lFLHlCQUFqQixDQUEyQzFFLGlCQUEzQyxDQVBWO0FBUU4yRSxNQUFBQSxRQUFRLEVBQUVaLFlBUko7QUFTTmEsTUFBQUEsYUFBYSxFQUFFQyxJQUFJLENBQUNDLFNBQUwsQ0FBZWIsY0FBZixDQVRUO0FBVU5uQyxNQUFBQSxPQUFPLEVBQUU1QixZQVZIO0FBV05rRCxNQUFBQSxLQUFLLEVBQUVBLEtBWEQ7QUFZTjJCLE1BQUFBLGNBQWMsRUFBRTlFLGdCQUFnQixDQUFDK0UsZUFBakIsT0FBdUNDLFlBQVksQ0FBQ0M7QUFaOUQsS0FBUDtBQWNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb252ZXJ0ZXJDb250ZXh0LCBUZW1wbGF0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vdGVtcGxhdGVzL0Jhc2VDb252ZXJ0ZXJcIjtcbmltcG9ydCB7XG5cdENoYXJ0TWFuaWZlc3RDb25maWd1cmF0aW9uLFxuXHRDaGFydFBlcnNvbmFsaXphdGlvbk1hbmlmZXN0U2V0dGluZ3MsXG5cdE1hbmlmZXN0V3JhcHBlcixcblx0VmlzdWFsaXphdGlvblR5cGUsXG5cdEFjdGlvblR5cGVcbn0gZnJvbSBcIi4uLy4uL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7IENoYXJ0RGVmaW5pdGlvblR5cGVUeXBlcywgRGF0YUZpZWxkQWJzdHJhY3RUeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgQW5ub3RhdGlvbkFjdGlvbiwgQmFzZUFjdGlvbiwgZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9BY3Rpb25cIjtcbmltcG9ydCB7IGlzRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3QgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9hbm5vdGF0aW9ucy9EYXRhRmllbGRcIjtcbmltcG9ydCB7IENoYXJ0SUQsIEZpbHRlckJhcklEIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvSURcIjtcbmltcG9ydCB7IGluc2VydEN1c3RvbUVsZW1lbnRzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7IEtleUhlbHBlciB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvS2V5XCI7XG5pbXBvcnQgeyBnZXRUYXJnZXRPYmplY3RQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuXG4vKipcbiAqIEB0eXBlZGVmIENoYXJ0VmlzdWFsaXphdGlvblxuICovXG5leHBvcnQgdHlwZSBDaGFydFZpc3VhbGl6YXRpb24gPSB7XG5cdHR5cGU6IFZpc3VhbGl6YXRpb25UeXBlLkNoYXJ0O1xuXHRpZDogc3RyaW5nO1xuXHRjb2xsZWN0aW9uOiBzdHJpbmc7XG5cdGVudGl0eU5hbWU6IHN0cmluZztcblx0cDEzbk1vZGU/OiBzdHJpbmc7XG5cdG5hdmlnYXRpb25QYXRoOiBzdHJpbmc7XG5cdGFubm90YXRpb25QYXRoOiBzdHJpbmc7XG5cdGZpbHRlcklkPzogc3RyaW5nO1xuXHR2aXpQcm9wZXJ0aWVzOiBzdHJpbmc7XG5cdGFjdGlvbnM6IEJhc2VBY3Rpb25bXTtcblx0dGl0bGU6IHN0cmluZztcblx0YXV0b0JpbmRPbkluaXQ6IGJvb2xlYW47XG59O1xuXG4vKipcbiAqIE1ldGhvZCB0byByZXRyaWV2ZSBhbGwgY2hhcnQgYWN0aW9ucyBmcm9tIGFubm90YXRpb25zLlxuICpcbiAqIEBwYXJhbSBjaGFydEFubm90YXRpb25cbiAqIEBwYXJhbSB2aXN1YWxpemF0aW9uUGF0aFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIHtCYXNlQWN0aW9uW119IHRoZSB0YWJsZSBhbm5vdGF0aW9uIGFjdGlvbnNcbiAqL1xuZnVuY3Rpb24gZ2V0Q2hhcnRBY3Rpb25zRnJvbUFubm90YXRpb25zKFxuXHRjaGFydEFubm90YXRpb246IENoYXJ0RGVmaW5pdGlvblR5cGVUeXBlcyxcblx0dmlzdWFsaXphdGlvblBhdGg6IHN0cmluZyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogQmFzZUFjdGlvbltdIHtcblx0Y29uc3QgY2hhcnRBY3Rpb25zOiBCYXNlQWN0aW9uW10gPSBbXTtcblx0aWYgKGNoYXJ0QW5ub3RhdGlvbikge1xuXHRcdGNvbnN0IGFBY3Rpb25zID0gY2hhcnRBbm5vdGF0aW9uLkFjdGlvbnMgfHwgW107XG5cdFx0YUFjdGlvbnMuZm9yRWFjaCgoZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKSA9PiB7XG5cdFx0XHRsZXQgY2hhcnRBY3Rpb246IEFubm90YXRpb25BY3Rpb24gfCB1bmRlZmluZWQ7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdGlzRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3QoZGF0YUZpZWxkKSAmJlxuXHRcdFx0XHQhKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiA9PT0gdHJ1ZSkgJiZcblx0XHRcdFx0IWRhdGFGaWVsZC5JbmxpbmUgJiZcblx0XHRcdFx0IWRhdGFGaWVsZC5EZXRlcm1pbmluZ1xuXHRcdFx0KSB7XG5cdFx0XHRcdGNvbnN0IGtleSA9IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKTtcblx0XHRcdFx0c3dpdGNoIChkYXRhRmllbGQuJFR5cGUpIHtcblx0XHRcdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCI6XG5cdFx0XHRcdFx0XHRjaGFydEFjdGlvbiA9IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JBY3Rpb24sXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoZGF0YUZpZWxkLmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHRcdFx0XHRcdGtleToga2V5XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uXCI6XG5cdFx0XHRcdFx0XHRjaGFydEFjdGlvbiA9IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24sXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoZGF0YUZpZWxkLmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHRcdFx0XHRcdGtleToga2V5XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChjaGFydEFjdGlvbikge1xuXHRcdFx0XHRjaGFydEFjdGlvbnMucHVzaChjaGFydEFjdGlvbik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIGNoYXJ0QWN0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYXJ0QWN0aW9ucyhcblx0Y2hhcnRBbm5vdGF0aW9uOiBDaGFydERlZmluaXRpb25UeXBlVHlwZXMsXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IEJhc2VBY3Rpb25bXSB7XG5cdHJldHVybiBpbnNlcnRDdXN0b21FbGVtZW50cyhcblx0XHRnZXRDaGFydEFjdGlvbnNGcm9tQW5ub3RhdGlvbnMoY2hhcnRBbm5vdGF0aW9uLCB2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCksXG5cdFx0Z2V0QWN0aW9uc0Zyb21NYW5pZmVzdChjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24odmlzdWFsaXphdGlvblBhdGgpLmFjdGlvbnMsIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdHsgZW5hYmxlT25TZWxlY3Q6IFwib3ZlcndyaXRlXCIgfVxuXHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UDEzbk1vZGUodmlzdWFsaXphdGlvblBhdGg6IHN0cmluZywgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdGNvbnN0IG1hbmlmZXN0V3JhcHBlcjogTWFuaWZlc3RXcmFwcGVyID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKTtcblx0Y29uc3QgY2hhcnRNYW5pZmVzdFNldHRpbmdzOiBDaGFydE1hbmlmZXN0Q29uZmlndXJhdGlvbiA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbih2aXN1YWxpemF0aW9uUGF0aCk7XG5cdGNvbnN0IGhhc1ZhcmlhbnRNYW5hZ2VtZW50OiBib29sZWFuID0gW1wiUGFnZVwiLCBcIkNvbnRyb2xcIl0uaW5kZXhPZihtYW5pZmVzdFdyYXBwZXIuZ2V0VmFyaWFudE1hbmFnZW1lbnQoKSkgPiAtMTtcblx0bGV0IHBlcnNvbmFsaXphdGlvbjogQ2hhcnRQZXJzb25hbGl6YXRpb25NYW5pZmVzdFNldHRpbmdzID0gdHJ1ZTtcblx0Y29uc3QgYVBlcnNvbmFsaXphdGlvbjogc3RyaW5nW10gPSBbXTtcblx0aWYgKGNoYXJ0TWFuaWZlc3RTZXR0aW5ncz8uY2hhcnRTZXR0aW5ncz8ucGVyc29uYWxpemF0aW9uICE9PSB1bmRlZmluZWQpIHtcblx0XHRwZXJzb25hbGl6YXRpb24gPSBjaGFydE1hbmlmZXN0U2V0dGluZ3MuY2hhcnRTZXR0aW5ncy5wZXJzb25hbGl6YXRpb247XG5cdH1cblx0aWYgKGhhc1ZhcmlhbnRNYW5hZ2VtZW50ICYmIHBlcnNvbmFsaXphdGlvbikge1xuXHRcdGlmIChwZXJzb25hbGl6YXRpb24gPT09IHRydWUpIHtcblx0XHRcdHJldHVybiBcIlNvcnQsVHlwZSxJdGVtXCI7XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgcGVyc29uYWxpemF0aW9uID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRpZiAocGVyc29uYWxpemF0aW9uLnR5cGUpIHtcblx0XHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiVHlwZVwiKTtcblx0XHRcdH1cblx0XHRcdGlmIChwZXJzb25hbGl6YXRpb24uaXRlbSkge1xuXHRcdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJJdGVtXCIpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbi5zb3J0KSB7XG5cdFx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIlNvcnRcIik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYVBlcnNvbmFsaXphdGlvbi5qb2luKFwiLFwiKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDcmVhdGUgdGhlIENoYXJ0VmlzdWFsaXphdGlvbiBjb25maWd1cmF0aW9uIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGRpc3BsYXkgYSBjaGFydCB2aWEgQ2hhcnQgTWFjcm8uXG4gKlxuICogQHBhcmFtIHtDaGFydERlZmluaXRpb25UeXBlVHlwZXN9IGNoYXJ0QW5ub3RhdGlvbiB0aGUgdGFyZ2V0IGNoYXJ0IGFubm90YXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB2aXN1YWxpemF0aW9uUGF0aCB0aGUgY3VycmVudCB2aXN1YWxpemF0aW9uIGFubm90YXRpb24gcGF0aFxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0IHRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMge0NoYXJ0VmlzdWFsaXphdGlvbn0gdGhlIGNoYXJ0IHZpc3VhbGl6YXRpb24gYmFzZWQgb24gdGhlIGFubm90YXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNoYXJ0VmlzdWFsaXphdGlvbihcblx0Y2hhcnRBbm5vdGF0aW9uOiBDaGFydERlZmluaXRpb25UeXBlVHlwZXMsXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IENoYXJ0VmlzdWFsaXphdGlvbiB7XG5cdGNvbnN0IGNoYXJ0QWN0aW9ucyA9IGdldENoYXJ0QWN0aW9ucyhjaGFydEFubm90YXRpb24sIHZpc3VhbGl6YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0bGV0IFtuYXZpZ2F0aW9uUHJvcGVydHlQYXRoIC8qLCBhbm5vdGF0aW9uUGF0aCovXSA9IHZpc3VhbGl6YXRpb25QYXRoLnNwbGl0KFwiQFwiKTtcblx0aWYgKG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGFzdEluZGV4T2YoXCIvXCIpID09PSBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCAtIDEpIHtcblx0XHQvLyBEcm9wIHRyYWlsaW5nIHNsYXNoXG5cdFx0bmF2aWdhdGlvblByb3BlcnR5UGF0aCA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGguc3Vic3RyKDAsIG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoIC0gMSk7XG5cdH1cblx0Y29uc3QgdGl0bGU6IGFueSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLnRhcmdldEVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5IZWFkZXJJbmZvPy5UeXBlTmFtZVBsdXJhbDtcblx0Y29uc3QgZGF0YU1vZGVsUGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpO1xuXHRjb25zdCBpc0VudGl0eVNldDogYm9vbGVhbiA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoID09PSAwO1xuXHRjb25zdCBlbnRpdHlOYW1lOiBzdHJpbmcgPSBkYXRhTW9kZWxQYXRoLnRhcmdldEVudGl0eVNldCA/IGRhdGFNb2RlbFBhdGgudGFyZ2V0RW50aXR5U2V0Lm5hbWUgOiBkYXRhTW9kZWxQYXRoLnN0YXJ0aW5nRW50aXR5U2V0Lm5hbWU7XG5cdGNvbnN0IHNGaWx0ZXJiYXJJZCA9IGlzRW50aXR5U2V0ID8gRmlsdGVyQmFySUQoZW50aXR5TmFtZSkgOiB1bmRlZmluZWQ7XG5cdGNvbnN0IG9WaXpQcm9wZXJ0aWVzID0ge1xuXHRcdFwibGVnZW5kR3JvdXBcIjoge1xuXHRcdFx0XCJsYXlvdXRcIjoge1xuXHRcdFx0XHRcInBvc2l0aW9uXCI6IFwiYm90dG9tXCJcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiB7XG5cdFx0dHlwZTogVmlzdWFsaXphdGlvblR5cGUuQ2hhcnQsXG5cdFx0aWQ6IENoYXJ0SUQoaXNFbnRpdHlTZXQgPyBlbnRpdHlOYW1lIDogbmF2aWdhdGlvblByb3BlcnR5UGF0aCwgVmlzdWFsaXphdGlvblR5cGUuQ2hhcnQpLFxuXHRcdGNvbGxlY3Rpb246IGdldFRhcmdldE9iamVjdFBhdGgoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkpLFxuXHRcdGVudGl0eU5hbWU6IGVudGl0eU5hbWUsXG5cdFx0cDEzbk1vZGU6IGdldFAxM25Nb2RlKHZpc3VhbGl6YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRuYXZpZ2F0aW9uUGF0aDogbmF2aWdhdGlvblByb3BlcnR5UGF0aCxcblx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoKHZpc3VhbGl6YXRpb25QYXRoKSxcblx0XHRmaWx0ZXJJZDogc0ZpbHRlcmJhcklkLFxuXHRcdHZpelByb3BlcnRpZXM6IEpTT04uc3RyaW5naWZ5KG9WaXpQcm9wZXJ0aWVzKSxcblx0XHRhY3Rpb25zOiBjaGFydEFjdGlvbnMsXG5cdFx0dGl0bGU6IHRpdGxlLFxuXHRcdGF1dG9CaW5kT25Jbml0OiBjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuT2JqZWN0UGFnZVxuXHR9O1xufVxuIl19