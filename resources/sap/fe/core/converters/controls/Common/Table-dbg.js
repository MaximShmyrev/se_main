sap.ui.define(["../../ManifestSettings", "../../templates/BaseConverter", "../../helpers/ID", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/annotations/DataField", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/BindingHelper", "sap/fe/core/converters/helpers/Key", "sap/fe/core/formatters/TableFormatter", "sap/fe/core/formatters/TableFormatterTypes", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/converters/helpers/IssueManager", "sap/fe/core/templating/PropertyHelper", "../../helpers/Aggregation"], function (ManifestSettings, BaseConverter, ID, Action, ConfigurableObject, DataField, BindingExpression, BindingHelper, Key, tableFormatters, TableFormatterTypes, DataModelPathHelper, StableIdHelper, IssueManager, PropertyHelper, Aggregation) {
  "use strict";

  var _exports = {};
  var AggregationHelper = Aggregation.AggregationHelper;
  var isProperty = PropertyHelper.isProperty;
  var IssueType = IssueManager.IssueType;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueCategory = IssueManager.IssueCategory;
  var replaceSpecialChars = StableIdHelper.replaceSpecialChars;
  var isPathInsertable = DataModelPathHelper.isPathInsertable;
  var isPathDeletable = DataModelPathHelper.isPathDeletable;
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var MessageType = TableFormatterTypes.MessageType;
  var KeyHelper = Key.KeyHelper;
  var UI = BindingHelper.UI;
  var Draft = BindingHelper.Draft;
  var not = BindingExpression.not;
  var and = BindingExpression.and;
  var isConstant = BindingExpression.isConstant;
  var equal = BindingExpression.equal;
  var or = BindingExpression.or;
  var ifElse = BindingExpression.ifElse;
  var formatResult = BindingExpression.formatResult;
  var constant = BindingExpression.constant;
  var compileBinding = BindingExpression.compileBinding;
  var bindingExpression = BindingExpression.bindingExpression;
  var annotationExpression = BindingExpression.annotationExpression;
  var getSemanticObjectPath = DataField.getSemanticObjectPath;
  var isDataFieldTypes = DataField.isDataFieldTypes;
  var isDataFieldForActionAbstract = DataField.isDataFieldForActionAbstract;
  var isDataFieldAlwaysHidden = DataField.isDataFieldAlwaysHidden;
  var collectRelatedProperties = DataField.collectRelatedProperties;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var removeDuplicateActions = Action.removeDuplicateActions;
  var isActionNavigable = Action.isActionNavigable;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var TableID = ID.TableID;
  var TemplateType = BaseConverter.TemplateType;
  var VisualizationType = ManifestSettings.VisualizationType;
  var VariantManagementType = ManifestSettings.VariantManagementType;
  var SelectionMode = ManifestSettings.SelectionMode;
  var HorizontalAlign = ManifestSettings.HorizontalAlign;
  var CreationMode = ManifestSettings.CreationMode;
  var AvailabilityType = ManifestSettings.AvailabilityType;
  var ActionType = ManifestSettings.ActionType;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var ColumnType;

  (function (ColumnType) {
    ColumnType["Default"] = "Default";
    ColumnType["Annotation"] = "Annotation";
  })(ColumnType || (ColumnType = {}));

  /**
   * Returns an array of all annotation based and manifest based table actions.
   *
   * @param {LineItem} lineItemAnnotation
   * @param {string} visualizationPath
   * @param {ConverterContext} converterContext
   * @param {NavigationSettingsConfiguration} navigationSettings
   * @returns {BaseAction} the complete table actions
   */
  function getTableActions(lineItemAnnotation, visualizationPath, converterContext, navigationSettings) {
    var aAnnotationActions = getTableAnnotationActions(lineItemAnnotation, visualizationPath, converterContext);
    return insertCustomElements(aAnnotationActions, getActionsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).actions, converterContext, aAnnotationActions, navigationSettings, true), {
      isNavigable: "overwrite",
      enableOnSelect: "overwrite",
      enableAutoScroll: "overwrite"
    });
  }
  /**
   * Returns an array off all columns, annotation based as well as manifest based.
   * They are sorted and some properties of can be overwritten through the manifest (check out the overwrite-able Keys).
   *
   * @param {LineItem} lineItemAnnotation Collection of data fields for representation in a table or list
   * @param {string} visualizationPath
   * @param {ConverterContext} converterContext
   * @param {NavigationSettingsConfiguration} navigationSettings
   * @returns {TableColumn[]} Returns all table columns that should be available, regardless of templating or personalization or their origin
   */


  _exports.getTableActions = getTableActions;

  function getTableColumns(lineItemAnnotation, visualizationPath, converterContext, navigationSettings) {
    var annotationColumns = getColumnsFromAnnotations(lineItemAnnotation, visualizationPath, converterContext);
    var manifestColumns = getColumnsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).columns, annotationColumns, converterContext, converterContext.getAnnotationEntityType(lineItemAnnotation), navigationSettings);
    return insertCustomElements(annotationColumns, manifestColumns, {
      width: "overwrite",
      isNavigable: "overwrite",
      availability: "overwrite",
      settings: "overwrite"
    });
  }

  _exports.getTableColumns = getTableColumns;

  function createTableVisualization(lineItemAnnotation, visualizationPath, converterContext, presentationVariantAnnotation, isCondensedTableLayoutCompliant) {
    var tableManifestConfig = getTableManifestConfiguration(lineItemAnnotation, visualizationPath, converterContext, isCondensedTableLayoutCompliant);

    var _splitPath = splitPath(visualizationPath),
        navigationPropertyPath = _splitPath.navigationPropertyPath;

    var dataModelPath = converterContext.getDataModelObjectPath();
    var entityName = dataModelPath.targetEntitySet ? dataModelPath.targetEntitySet.name : dataModelPath.startingEntitySet.name,
        isEntitySet = navigationPropertyPath.length === 0;
    var navigationOrCollectionName = isEntitySet ? entityName : navigationPropertyPath;
    var navigationSettings = converterContext.getManifestWrapper().getNavigationConfiguration(navigationOrCollectionName);
    var columns = getTableColumns(lineItemAnnotation, visualizationPath, converterContext, navigationSettings);
    return {
      type: VisualizationType.Table,
      annotation: getTableAnnotationConfiguration(lineItemAnnotation, visualizationPath, converterContext, tableManifestConfig, columns, presentationVariantAnnotation),
      control: tableManifestConfig,
      actions: removeDuplicateActions(getTableActions(lineItemAnnotation, visualizationPath, converterContext, navigationSettings)),
      columns: columns
    };
  }

  _exports.createTableVisualization = createTableVisualization;

  function createDefaultTableVisualization(converterContext) {
    var tableManifestConfig = getTableManifestConfiguration(undefined, "", converterContext, false);
    var columns = getColumnsFromEntityType(converterContext.getEntityType(), [], [], converterContext);
    return {
      type: VisualizationType.Table,
      annotation: getTableAnnotationConfiguration(undefined, "", converterContext, tableManifestConfig, columns),
      control: tableManifestConfig,
      actions: [],
      columns: columns
    };
  }
  /**
   * Loop through the data field of a line item to find the actions that will be put in the toolbar
   * And check if they require a context or not.
   *
   * @param lineItemAnnotation
   * @returns {boolean} if it's the case
   */


  _exports.createDefaultTableVisualization = createDefaultTableVisualization;

  function hasActionRequiringContext(lineItemAnnotation) {
    return lineItemAnnotation.some(function (dataField) {
      if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction") {
        return dataField.Inline !== true;
      } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
        return dataField.Inline !== true && dataField.RequiresContext;
      }
    });
  }

  function hasActionRequiringSelection(manifestActions) {
    var requiresSelectionKey = false;

    if (manifestActions) {
      requiresSelectionKey = Object.keys(manifestActions).some(function (actionKey) {
        var action = manifestActions[actionKey];
        return action.requiresSelection === true;
      });
    }

    return requiresSelectionKey;
  }
  /**
   * Evaluate if the visualization path is deletable or updatable
   * The algorithm is as follow
   * - Evaluate if there is a NavigationRestrictions.Deletable or NavigationRestrictions.Updatable on the full navigationPath
   * - Go down the entity set of the path evaluating the same element and for the last part evaluate the DeleteRestrictions.Deletable or UpdateRestrictions.Updatable there.
   *
   * @param visualizationPath
   * @param converterContext
   * @returns {TableCapabilityRestriction} the table capabilities
   */


  function getCapabilityRestriction(visualizationPath, converterContext) {
    var _splitPath2 = splitPath(visualizationPath),
        navigationPropertyPath = _splitPath2.navigationPropertyPath;

    var navigationPropertyPathParts = navigationPropertyPath.split("/");
    var oCapabilityRestriction = {
      isDeletable: true,
      isUpdatable: true
    };
    var currentEntitySet = converterContext.getEntitySet();

    var _loop = function () {
      var _currentEntitySet$ann5, _currentEntitySet$ann6;

      var pathsToCheck = [];
      navigationPropertyPathParts.reduce(function (paths, navigationPropertyPathPart) {
        if (paths.length > 0) {
          paths += "/";
        }

        paths += navigationPropertyPathPart;
        pathsToCheck.push(paths);
        return paths;
      }, "");
      var hasRestrictedPathOnDelete = false,
          hasRestrictedPathOnUpdate = false;
      (_currentEntitySet$ann5 = currentEntitySet.annotations.Capabilities) === null || _currentEntitySet$ann5 === void 0 ? void 0 : (_currentEntitySet$ann6 = _currentEntitySet$ann5.NavigationRestrictions) === null || _currentEntitySet$ann6 === void 0 ? void 0 : _currentEntitySet$ann6.RestrictedProperties.forEach(function (restrictedNavProp) {
        var _restrictedNavProp$Na;

        if ((restrictedNavProp === null || restrictedNavProp === void 0 ? void 0 : (_restrictedNavProp$Na = restrictedNavProp.NavigationProperty) === null || _restrictedNavProp$Na === void 0 ? void 0 : _restrictedNavProp$Na.type) === "NavigationPropertyPath") {
          var _restrictedNavProp$De, _restrictedNavProp$Up;

          if (((_restrictedNavProp$De = restrictedNavProp.DeleteRestrictions) === null || _restrictedNavProp$De === void 0 ? void 0 : _restrictedNavProp$De.Deletable) === false) {
            hasRestrictedPathOnDelete = hasRestrictedPathOnDelete || pathsToCheck.indexOf(restrictedNavProp.NavigationProperty.value) !== -1;
          } else if (((_restrictedNavProp$Up = restrictedNavProp.UpdateRestrictions) === null || _restrictedNavProp$Up === void 0 ? void 0 : _restrictedNavProp$Up.Updatable) === false) {
            hasRestrictedPathOnUpdate = hasRestrictedPathOnUpdate || pathsToCheck.indexOf(restrictedNavProp.NavigationProperty.value) !== -1;
          }
        }
      });
      oCapabilityRestriction.isDeletable = !hasRestrictedPathOnDelete;
      oCapabilityRestriction.isUpdatable = !hasRestrictedPathOnUpdate;
      var navPropName = navigationPropertyPathParts.shift();

      if (navPropName) {
        var navProp = currentEntitySet.entityType.navigationProperties.find(function (navProp) {
          return navProp.name == navPropName;
        });

        if (navProp && !navProp.containsTarget && currentEntitySet.navigationPropertyBinding.hasOwnProperty(navPropName)) {
          currentEntitySet = currentEntitySet.navigationPropertyBinding[navPropName];
        } else {
          // Contained navProp means no entitySet to report to
          currentEntitySet = undefined;
        }
      }
    };

    while ((oCapabilityRestriction.isDeletable || oCapabilityRestriction.isUpdatable) && currentEntitySet && navigationPropertyPathParts.length > 0) {
      _loop();
    }

    if (currentEntitySet !== undefined && currentEntitySet.annotations) {
      if (oCapabilityRestriction.isDeletable) {
        var _currentEntitySet$ann, _currentEntitySet$ann2;

        // If there is still an entity set, check the entity set deletable status
        oCapabilityRestriction.isDeletable = ((_currentEntitySet$ann = currentEntitySet.annotations.Capabilities) === null || _currentEntitySet$ann === void 0 ? void 0 : (_currentEntitySet$ann2 = _currentEntitySet$ann.DeleteRestrictions) === null || _currentEntitySet$ann2 === void 0 ? void 0 : _currentEntitySet$ann2.Deletable) !== false;
      }

      if (oCapabilityRestriction.isUpdatable) {
        var _currentEntitySet$ann3, _currentEntitySet$ann4;

        // If there is still an entity set, check the entity set updatable status
        oCapabilityRestriction.isUpdatable = ((_currentEntitySet$ann3 = currentEntitySet.annotations.Capabilities) === null || _currentEntitySet$ann3 === void 0 ? void 0 : (_currentEntitySet$ann4 = _currentEntitySet$ann3.UpdateRestrictions) === null || _currentEntitySet$ann4 === void 0 ? void 0 : _currentEntitySet$ann4.Updatable) !== false;
      }
    }

    return oCapabilityRestriction;
  }

  _exports.getCapabilityRestriction = getCapabilityRestriction;

  function getSelectionMode(lineItemAnnotation, visualizationPath, converterContext, isEntitySet, targetCapabilities) {
    var _tableManifestSetting;

    if (!lineItemAnnotation) {
      return SelectionMode.None;
    }

    var tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var selectionMode = (_tableManifestSetting = tableManifestSettings.tableSettings) === null || _tableManifestSetting === void 0 ? void 0 : _tableManifestSetting.selectionMode;
    var manifestActions = getActionsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).actions, converterContext, [], undefined, false);
    var isParentDeletable, parentEntitySetDeletable;

    if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
      isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), undefined);
      parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable, true) : isParentDeletable;
    }

    if (selectionMode && selectionMode === SelectionMode.None) {
      if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false") {
        return "{= ${ui>/editMode} === 'Editable' ? '" + SelectionMode.Multi + "' : 'None'}";
      } else {
        selectionMode = SelectionMode.None;
      }
    } else if (!selectionMode || selectionMode === SelectionMode.Auto) {
      selectionMode = SelectionMode.Multi;
    }

    if (hasActionRequiringContext(lineItemAnnotation) || hasActionRequiringSelection(manifestActions)) {
      return selectionMode;
    } else if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false") {
      if (!isEntitySet) {
        return "{= ${ui>/editMode} === 'Editable' ? '" + selectionMode + "' : 'None'}";
      } else {
        return selectionMode;
      }
    }

    return SelectionMode.None;
  }
  /**
   * Method to retrieve all table actions from annotations.
   *
   * @param lineItemAnnotation
   * @param visualizationPath
   * @param converterContext
   * @returns {Record<BaseAction, BaseAction>} the table annotation actions
   */


  function getTableAnnotationActions(lineItemAnnotation, visualizationPath, converterContext) {
    var tableActions = [];

    if (lineItemAnnotation) {
      lineItemAnnotation.forEach(function (dataField) {
        var _dataField$annotation, _dataField$annotation2;

        var tableAction;

        if (isDataFieldForActionAbstract(dataField) && !(((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : _dataField$annotation2.Hidden) === true) && !dataField.Inline && !dataField.Determining) {
          var key = KeyHelper.generateKeyFromDataField(dataField);

          switch (dataField.$Type) {
            case "com.sap.vocabularies.UI.v1.DataFieldForAction":
              tableAction = {
                type: ActionType.DataFieldForAction,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key,
                isNavigable: true
              };
              break;

            case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
              tableAction = {
                type: ActionType.DataFieldForIntentBasedNavigation,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key
              };
              break;

            default:
              break;
          }
        }

        if (tableAction) {
          tableActions.push(tableAction);
        }
      });
    }

    return tableActions;
  }

  function getCriticalityBindingByEnum(CriticalityEnum) {
    var criticalityProperty;

    switch (CriticalityEnum) {
      case "UI.CriticalityType/Negative":
        criticalityProperty = MessageType.Error;
        break;

      case "UI.CriticalityType/Critical":
        criticalityProperty = MessageType.Warning;
        break;

      case "UI.CriticalityType/Positive":
        criticalityProperty = MessageType.Success;
        break;

      case "UI.CriticalityType/Information":
        criticalityProperty = MessageType.Information;
        break;

      case "UI.CriticalityType/Neutral":
      default:
        criticalityProperty = MessageType.None;
    }

    return criticalityProperty;
  }

  function getHighlightRowBinding(criticalityAnnotation, isDraftRoot) {
    var defaultHighlightRowDefinition = MessageType.None;

    if (criticalityAnnotation) {
      if (typeof criticalityAnnotation === "object") {
        defaultHighlightRowDefinition = annotationExpression(criticalityAnnotation);
      } else {
        // Enum Value so we get the corresponding static part
        defaultHighlightRowDefinition = getCriticalityBindingByEnum(criticalityAnnotation);
      }
    }

    return ifElse(isDraftRoot && Draft.IsNewObject, MessageType.Information, formatResult([defaultHighlightRowDefinition], tableFormatters.rowHighlighting));
  }

  function _getCreationBehaviour(lineItemAnnotation, tableManifestConfiguration, converterContext, navigationSettings) {
    var navigation = (navigationSettings === null || navigationSettings === void 0 ? void 0 : navigationSettings.create) || (navigationSettings === null || navigationSettings === void 0 ? void 0 : navigationSettings.detail); // cross-app

    if ((navigation === null || navigation === void 0 ? void 0 : navigation.outbound) && navigation.outboundDetail && (navigationSettings === null || navigationSettings === void 0 ? void 0 : navigationSettings.create)) {
      return {
        mode: "External",
        outbound: navigation.outbound,
        outboundDetail: navigation.outboundDetail,
        navigationSettings: navigationSettings
      };
    }

    var newAction;

    if (lineItemAnnotation) {
      var _converterContext$get, _targetAnnotations$Co, _targetAnnotations$Co2, _targetAnnotations$Se, _targetAnnotations$Se2;

      // in-app
      var targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);
      var targetAnnotations = (_converterContext$get = converterContext.getEntitySetForEntityType(targetEntityType)) === null || _converterContext$get === void 0 ? void 0 : _converterContext$get.annotations;
      newAction = (targetAnnotations === null || targetAnnotations === void 0 ? void 0 : (_targetAnnotations$Co = targetAnnotations.Common) === null || _targetAnnotations$Co === void 0 ? void 0 : (_targetAnnotations$Co2 = _targetAnnotations$Co.DraftRoot) === null || _targetAnnotations$Co2 === void 0 ? void 0 : _targetAnnotations$Co2.NewAction) || (targetAnnotations === null || targetAnnotations === void 0 ? void 0 : (_targetAnnotations$Se = targetAnnotations.Session) === null || _targetAnnotations$Se === void 0 ? void 0 : (_targetAnnotations$Se2 = _targetAnnotations$Se.StickySessionSupported) === null || _targetAnnotations$Se2 === void 0 ? void 0 : _targetAnnotations$Se2.NewAction); // TODO: Is there really no 'NewAction' on DraftNode? targetAnnotations?.Common?.DraftNode?.NewAction

      if (tableManifestConfiguration.creationMode === CreationMode.CreationRow && newAction) {
        // A combination of 'CreationRow' and 'NewAction' does not make sense
        // TODO: Or does it?
        throw Error("Creation mode '".concat(CreationMode.CreationRow, "' can not be used with a custom 'new' action (").concat(newAction, ")"));
      }

      if (navigation === null || navigation === void 0 ? void 0 : navigation.route) {
        // route specified
        return {
          mode: tableManifestConfiguration.creationMode,
          append: tableManifestConfiguration.createAtEnd,
          newAction: newAction,
          navigateToTarget: tableManifestConfiguration.creationMode === CreationMode.NewPage ? navigation.route : undefined // navigate only in NewPage mode

        };
      }
    } // no navigation or no route specified - fallback to inline create if original creation mode was 'NewPage'


    if (tableManifestConfiguration.creationMode === CreationMode.NewPage) {
      tableManifestConfiguration.creationMode = CreationMode.Inline;
    }

    return {
      mode: tableManifestConfiguration.creationMode,
      append: tableManifestConfiguration.createAtEnd,
      newAction: newAction
    };
  }

  var _getRowConfigurationProperty = function (lineItemAnnotation, visualizationPath, converterContext, navigationSettings, targetPath) {
    var pressProperty, navigationTarget;
    var criticalityProperty = MessageType.None;
    var targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);

    if (navigationSettings && lineItemAnnotation) {
      var _navigationSettings$d, _navigationSettings$d2;

      navigationTarget = ((_navigationSettings$d = navigationSettings.display) === null || _navigationSettings$d === void 0 ? void 0 : _navigationSettings$d.target) || ((_navigationSettings$d2 = navigationSettings.detail) === null || _navigationSettings$d2 === void 0 ? void 0 : _navigationSettings$d2.outbound);

      if (navigationTarget) {
        pressProperty = ".handlers.onChevronPressNavigateOutBound( $controller ,'" + navigationTarget + "', ${$parameters>bindingContext})";
      } else if (targetEntityType) {
        var _navigationSettings$d3;

        var targetEntitySet = converterContext.getEntitySetForEntityType(targetEntityType);
        navigationTarget = (_navigationSettings$d3 = navigationSettings.detail) === null || _navigationSettings$d3 === void 0 ? void 0 : _navigationSettings$d3.route;

        if (navigationTarget) {
          var _lineItemAnnotation$a, _lineItemAnnotation$a2, _targetEntitySet$anno, _targetEntitySet$anno2, _targetEntitySet$anno3, _targetEntitySet$anno4, _targetEntitySet$anno5, _targetEntitySet$anno6, _targetEntitySet$anno7, _targetEntitySet$anno8;

          criticalityProperty = getHighlightRowBinding((_lineItemAnnotation$a = lineItemAnnotation.annotations) === null || _lineItemAnnotation$a === void 0 ? void 0 : (_lineItemAnnotation$a2 = _lineItemAnnotation$a.UI) === null || _lineItemAnnotation$a2 === void 0 ? void 0 : _lineItemAnnotation$a2.Criticality, !!(targetEntitySet === null || targetEntitySet === void 0 ? void 0 : (_targetEntitySet$anno = targetEntitySet.annotations) === null || _targetEntitySet$anno === void 0 ? void 0 : (_targetEntitySet$anno2 = _targetEntitySet$anno.Common) === null || _targetEntitySet$anno2 === void 0 ? void 0 : _targetEntitySet$anno2.DraftRoot) || !!(targetEntitySet === null || targetEntitySet === void 0 ? void 0 : (_targetEntitySet$anno3 = targetEntitySet.annotations) === null || _targetEntitySet$anno3 === void 0 ? void 0 : (_targetEntitySet$anno4 = _targetEntitySet$anno3.Common) === null || _targetEntitySet$anno4 === void 0 ? void 0 : _targetEntitySet$anno4.DraftNode));
          pressProperty = "._routing.navigateForwardToContext(${$parameters>bindingContext}, { callExtension: true, targetPath: '" + targetPath + "', editable : " + ((targetEntitySet === null || targetEntitySet === void 0 ? void 0 : (_targetEntitySet$anno5 = targetEntitySet.annotations) === null || _targetEntitySet$anno5 === void 0 ? void 0 : (_targetEntitySet$anno6 = _targetEntitySet$anno5.Common) === null || _targetEntitySet$anno6 === void 0 ? void 0 : _targetEntitySet$anno6.DraftRoot) || (targetEntitySet === null || targetEntitySet === void 0 ? void 0 : (_targetEntitySet$anno7 = targetEntitySet.annotations) === null || _targetEntitySet$anno7 === void 0 ? void 0 : (_targetEntitySet$anno8 = _targetEntitySet$anno7.Common) === null || _targetEntitySet$anno8 === void 0 ? void 0 : _targetEntitySet$anno8.DraftNode) ? "!${$parameters>bindingContext}.getProperty('IsActiveEntity')" : "undefined") + "})"; //Need to access to DraftRoot and DraftNode !!!!!!!
        } else {
          var _lineItemAnnotation$a3, _lineItemAnnotation$a4;

          criticalityProperty = getHighlightRowBinding((_lineItemAnnotation$a3 = lineItemAnnotation.annotations) === null || _lineItemAnnotation$a3 === void 0 ? void 0 : (_lineItemAnnotation$a4 = _lineItemAnnotation$a3.UI) === null || _lineItemAnnotation$a4 === void 0 ? void 0 : _lineItemAnnotation$a4.Criticality, false);
        }
      }
    }

    var rowNavigatedExpression = formatResult([bindingExpression("/deepestPath", "internal")], tableFormatters.navigatedRow, targetEntityType);
    return {
      press: pressProperty,
      action: pressProperty ? "Navigation" : undefined,
      rowHighlighting: compileBinding(criticalityProperty),
      rowNavigated: compileBinding(rowNavigatedExpression)
    };
  };
  /**
   * Retrieve the columns from the entityType.
   *
   * @param entityType The target entity type.
   * @param annotationColumns The array of columns created based on LineItem annotations.
   * @param nonSortableColumns The array of all non sortable column names.
   * @param converterContext The converter context.
   * @returns {AnnotationTableColumn[]} the column from the entityType
   */


  var getColumnsFromEntityType = function (entityType) {
    var annotationColumns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var nonSortableColumns = arguments.length > 2 ? arguments[2] : undefined;
    var converterContext = arguments.length > 3 ? arguments[3] : undefined;
    var tableColumns = [];
    var aggregationHelper = new AggregationHelper(entityType, converterContext);
    entityType.entityProperties.forEach(function (property) {
      // Catch already existing columns - which were added before by LineItem Annotations
      var exists = annotationColumns.some(function (column) {
        return column.name === property.name;
      }); // if target type exists, it is a complex property and should be ignored

      if (!property.targetType && !exists) {
        tableColumns.push(getColumnDefinitionFromProperty(property, converterContext.getEntitySetBasedAnnotationPath(property.fullyQualifiedName), property.name, true, true, nonSortableColumns, aggregationHelper, converterContext));
      }
    });
    return tableColumns;
  };
  /**
   * Create a column definition from a property.
   *
   * @param property {Property} Entity type property for which the column is created
   * @param fullPropertyPath {string} the full path to the target property
   * @param relativePath {string} the relative path to the target property based on the context
   * @param useDataFieldPrefix {boolean} should be prefixed with "DataField::", else it will be prefixed with "Property::"
   * @param availableForAdaptation {boolean} decides whether column should be available for adaptation
   * @param nonSortableColumns {string[]} the array of all non sortable column names
   * @param aggregationHelper {AggregationHelper} the aggregationHelper for the entity
   * @param converterContext {ConverterContext} the converter context
   * @param descriptionProperty {Property} Entity type property for the column containing the description
   * @returns {AnnotationTableColumn} the annotation column definition
   */


  _exports.getColumnsFromEntityType = getColumnsFromEntityType;

  var getColumnDefinitionFromProperty = function (property, fullPropertyPath, relativePath, useDataFieldPrefix, availableForAdaptation, nonSortableColumns, aggregationHelper, converterContext, descriptionProperty) {
    var _property$annotations, _property$annotations2;

    var name = useDataFieldPrefix ? relativePath : "Property::" + relativePath;
    var key = (useDataFieldPrefix ? "DataField::" : "Property::") + replaceSpecialChars(relativePath);
    var semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, property.fullyQualifiedName);
    var isHidden = ((_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.UI) === null || _property$annotations2 === void 0 ? void 0 : _property$annotations2.Hidden) === true;

    var groupPath = _sliceAtSlash(property.name, true, false);

    var isGroup = groupPath != property.name;
    var descriptionLabel = descriptionProperty ? _getLabel(descriptionProperty) : undefined;
    return {
      key: key,
      isKey: property.isKey,
      isGroupable: aggregationHelper.isPropertyGroupable(property),
      type: ColumnType.Annotation,
      label: _getLabel(property, isGroup),
      groupLabel: isGroup ? _getLabel(property) : null,
      group: isGroup ? groupPath : null,
      annotationPath: fullPropertyPath,
      semanticObjectPath: semanticObjectAnnotationPath,
      availability: !availableForAdaptation || isHidden ? AvailabilityType.Hidden : AvailabilityType.Adaptation,
      name: name,
      relativePath: relativePath,
      sortable: !isHidden && nonSortableColumns.indexOf(relativePath) === -1,
      exportSettings: {
        label: descriptionLabel ? descriptionLabel + " - " + _getLabel(property) : undefined
      }
    };
  };
  /**
   * Returns boolean true for valid columns, false for invalid columns.
   *
   * @param {DataFieldAbstractTypes} dataField Different DataField types defined in the annotations
   * @returns {boolean} True for valid columns, false for invalid columns
   * @private
   */


  var _isValidColumn = function (dataField) {
    switch (dataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        return !!dataField.Inline;

      case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
      case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
        return false;

      case "com.sap.vocabularies.UI.v1.DataField":
      case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        return true;

      default: // Todo: Replace with proper Log statement once available
      //  throw new Error("Unhandled DataField Abstract type: " + dataField.$Type);

    }
  };
  /**
   * Returns label for property and dataField.
   * @param {DataFieldAbstractTypes | Property} property Entity type property or DataField defined in the annotations
   * @param isGroup
   * @returns {string} Label of the property or DataField
   * @private
   */


  var _getLabel = function (property) {
    var isGroup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!property) {
      return undefined;
    }

    if (isProperty(property)) {
      var _property$annotations3, _property$annotations4, _property$annotations5;

      return ((_property$annotations3 = property.annotations) === null || _property$annotations3 === void 0 ? void 0 : (_property$annotations4 = _property$annotations3.Common) === null || _property$annotations4 === void 0 ? void 0 : (_property$annotations5 = _property$annotations4.Label) === null || _property$annotations5 === void 0 ? void 0 : _property$annotations5.toString()) || property.name;
    } else if (isDataFieldTypes(property)) {
      var _property$Value, _property$Value$$targ, _property$Value$$targ2, _property$Value$$targ3, _property$Value2, _property$Value2$$tar;

      if (!!isGroup && property.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath") {
        return compileBinding(annotationExpression(property.Label));
      }

      return ((_property$Value = property.Value) === null || _property$Value === void 0 ? void 0 : (_property$Value$$targ = _property$Value.$target) === null || _property$Value$$targ === void 0 ? void 0 : (_property$Value$$targ2 = _property$Value$$targ.annotations) === null || _property$Value$$targ2 === void 0 ? void 0 : (_property$Value$$targ3 = _property$Value$$targ2.Common) === null || _property$Value$$targ3 === void 0 ? void 0 : _property$Value$$targ3.Label) || property.Label || ((_property$Value2 = property.Value) === null || _property$Value2 === void 0 ? void 0 : (_property$Value2$$tar = _property$Value2.$target) === null || _property$Value2$$tar === void 0 ? void 0 : _property$Value2$$tar.name);
    } else {
      return compileBinding(annotationExpression(property.Label));
    }
  };
  /**
   * Create a PropertyInfo for each identified property consumed by a LineItem.
   * @param columnsToBeCreated {Record<string, Property>} Identified properties.
   * @param existingColumns The list of columns created for LineItems and Properties of entityType.
   * @param nonSortableColumns The array of column names which cannot be sorted.
   * @param converterContext The converter context.
   * @param entityType The entity type for the LineItem
   * @returns {AnnotationTableColumn[]} the array of columns created.
   */


  var _createRelatedColumns = function (columnsToBeCreated, existingColumns, nonSortableColumns, converterContext, entityType) {
    var relatedColumns = [];
    var relatedPropertyNameMap = {};
    var aggregationHelper = new AggregationHelper(entityType, converterContext);
    Object.keys(columnsToBeCreated).forEach(function (name) {
      var _columnsToBeCreated$n = columnsToBeCreated[name],
          value = _columnsToBeCreated$n.value,
          description = _columnsToBeCreated$n.description,
          annotationPath = converterContext.getAbsoluteAnnotationPath(name),
          relatedColumn = existingColumns.find(function (column) {
        return column.name === name;
      });

      if (relatedColumn === undefined) {
        // Case 1: Create a new property column and set it to hidden.
        // Key contains DataField prefix to ensure all property columns have the same key format.
        relatedColumns.push(getColumnDefinitionFromProperty(value, annotationPath, name, true, false, nonSortableColumns, aggregationHelper, converterContext, description));
      } else if (relatedColumn.annotationPath !== annotationPath) {
        // Case 2: The existing column points to a LineItem.
        var newName = "Property::" + name; // Checking whether the related property column has already been created in a previous iteration.

        if (!existingColumns.some(function (column) {
          return column.name === newName;
        })) {
          // Create a new property column with 'Property::' prefix,
          // Set it to hidden as it is only consumed by Complex property infos.
          relatedColumns.push(getColumnDefinitionFromProperty(value, annotationPath, name, false, false, nonSortableColumns, aggregationHelper, converterContext));
          relatedPropertyNameMap[name] = newName;
        }
      }
    }); // The property 'name' has been prefixed with 'Property::' for uniqueness.
    // Update the same in other propertyInfos[] references which point to this property.

    existingColumns.forEach(function (column) {
      var _column$propertyInfos;

      column.propertyInfos = (_column$propertyInfos = column.propertyInfos) === null || _column$propertyInfos === void 0 ? void 0 : _column$propertyInfos.map(function (propertyInfo) {
        var _relatedPropertyNameM;

        return (_relatedPropertyNameM = relatedPropertyNameMap[propertyInfo]) !== null && _relatedPropertyNameM !== void 0 ? _relatedPropertyNameM : propertyInfo;
      });
    });
    return relatedColumns;
  };
  /**
   * Getting the Column Name
   * If it points to a DataField with one property or DataPoint with one property it will use the property name
   * here to be consistent with the existing flex changes.
   *
   * @param {DataFieldAbstractTypes} dataField Different DataField types defined in the annotations
   * @returns {string} Returns name of annotation columns
   * @private
   */


  var _getAnnotationColumnName = function (dataField) {
    var _dataField$Target, _dataField$Target$$ta, _dataField$Target$$ta2;

    // This is needed as we have flexibility changes already that we have to check against
    if (isDataFieldTypes(dataField)) {
      var _dataField$Value;

      return (_dataField$Value = dataField.Value) === null || _dataField$Value === void 0 ? void 0 : _dataField$Value.path;
    } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && ((_dataField$Target = dataField.Target) === null || _dataField$Target === void 0 ? void 0 : (_dataField$Target$$ta = _dataField$Target.$target) === null || _dataField$Target$$ta === void 0 ? void 0 : (_dataField$Target$$ta2 = _dataField$Target$$ta.Value) === null || _dataField$Target$$ta2 === void 0 ? void 0 : _dataField$Target$$ta2.path)) {
      // This is for removing duplicate properties. For example, 'Progress' Property is removed if it is already defined as a DataPoint
      return dataField.Target.$target.Value.path;
    } else {
      return KeyHelper.generateKeyFromDataField(dataField);
    }
  };
  /**
   * Determine the property relative path with respect to the root entity.
   * @param dataField The Data field being processed.
   * @returns {string} The relative path
   */


  var _getRelativePath = function (dataField) {
    var _ref, _ref$Value, _ref2, _ref2$Target;

    var relativePath = "";

    switch (dataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataField":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        relativePath = (_ref = dataField) === null || _ref === void 0 ? void 0 : (_ref$Value = _ref.Value) === null || _ref$Value === void 0 ? void 0 : _ref$Value.path;
        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
        relativePath = (_ref2 = dataField) === null || _ref2 === void 0 ? void 0 : (_ref2$Target = _ref2.Target) === null || _ref2$Target === void 0 ? void 0 : _ref2$Target.value;
        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        relativePath = KeyHelper.generateKeyFromDataField(dataField);
        break;
    }

    return relativePath;
  };

  var _sliceAtSlash = function (path, isLastSlash, isLastPart) {
    var iSlashIndex = isLastSlash ? path.lastIndexOf("/") : path.indexOf("/");

    if (iSlashIndex === -1) {
      return path;
    }

    return isLastPart ? path.substring(iSlashIndex + 1, path.length) : path.substring(0, iSlashIndex);
  };
  /**
   * Returns line items from metadata annotations.
   *
   * @param lineItemAnnotation
   * @param visualizationPath
   * @param converterContext
   * @returns {TableColumn[]} the columns from the annotations
   */


  var getColumnsFromAnnotations = function (lineItemAnnotation, visualizationPath, converterContext) {
    var _map, _ref3, _converterContext$get2, _converterContext$get3, _converterContext$get4, _converterContext$get5;

    var entityType = converterContext.getAnnotationEntityType(lineItemAnnotation),
        annotationColumns = [],
        columnsToBeCreated = {},
        nonSortableColumns = (_map = (_ref3 = (_converterContext$get2 = converterContext.getEntitySet()) === null || _converterContext$get2 === void 0 ? void 0 : (_converterContext$get3 = _converterContext$get2.annotations) === null || _converterContext$get3 === void 0 ? void 0 : (_converterContext$get4 = _converterContext$get3.Capabilities) === null || _converterContext$get4 === void 0 ? void 0 : (_converterContext$get5 = _converterContext$get4.SortRestrictions) === null || _converterContext$get5 === void 0 ? void 0 : _converterContext$get5.NonSortableProperties) === null || _ref3 === void 0 ? void 0 : _ref3.map(function (property) {
      return property.value;
    })) !== null && _map !== void 0 ? _map : [];

    if (lineItemAnnotation) {
      // Get columns from the LineItem Annotation
      lineItemAnnotation.forEach(function (lineItem) {
        var _lineItem$Value, _lineItem$Value$$targ, _lineItem$annotations, _lineItem$annotations2, _lineItem$annotations3;

        if (!_isValidColumn(lineItem)) {
          return;
        }

        var semanticObjectAnnotationPath = isDataFieldTypes(lineItem) && ((_lineItem$Value = lineItem.Value) === null || _lineItem$Value === void 0 ? void 0 : (_lineItem$Value$$targ = _lineItem$Value.$target) === null || _lineItem$Value$$targ === void 0 ? void 0 : _lineItem$Value$$targ.fullyQualifiedName) ? getSemanticObjectPath(converterContext, lineItem) : undefined;

        var relativePath = _getRelativePath(lineItem); // Determine properties which are consumed by this LineItem.


        var relatedPropertiesInfo = collectRelatedProperties(lineItem, converterContext);
        var relatedPropertyNames = Object.keys(relatedPropertiesInfo.properties);

        var groupPath = _sliceAtSlash(relativePath, true, false);

        var isGroup = groupPath != relativePath;
        annotationColumns.push({
          annotationPath: converterContext.getEntitySetBasedAnnotationPath(lineItem.fullyQualifiedName),
          semanticObjectPath: semanticObjectAnnotationPath,
          type: ColumnType.Annotation,
          key: KeyHelper.generateKeyFromDataField(lineItem),
          width: ((_lineItem$annotations = lineItem.annotations) === null || _lineItem$annotations === void 0 ? void 0 : (_lineItem$annotations2 = _lineItem$annotations.HTML5) === null || _lineItem$annotations2 === void 0 ? void 0 : (_lineItem$annotations3 = _lineItem$annotations2.CssDefaults) === null || _lineItem$annotations3 === void 0 ? void 0 : _lineItem$annotations3.width) || undefined,
          availability: isDataFieldAlwaysHidden(lineItem) ? AvailabilityType.Hidden : AvailabilityType.Default,
          propertyInfos: relatedPropertyNames.length > 0 ? relatedPropertyNames : undefined,
          name: _getAnnotationColumnName(lineItem),
          groupLabel: isGroup ? _getLabel(lineItem) : null,
          group: isGroup ? groupPath : null,
          label: _getLabel(lineItem, isGroup),
          relativePath: relativePath,
          isNavigable: true,
          sortable: lineItem.$Type === "com.sap.vocabularies.UI.v1.DataField" && nonSortableColumns.indexOf(relativePath) === -1,
          exportSettings: {
            template: relatedPropertiesInfo.exportSettingsTemplate
          }
        }); // Collect information of related columns to be created.

        relatedPropertyNames.forEach(function (name) {
          columnsToBeCreated[name] = relatedPropertiesInfo.properties[name];
        });
      });
    } // Get columns from the Properties of EntityType


    var tableColumns = getColumnsFromEntityType(entityType, annotationColumns, nonSortableColumns, converterContext);
    tableColumns = tableColumns.concat(annotationColumns); // Create a propertyInfo for each related property.

    var relatedColumns = _createRelatedColumns(columnsToBeCreated, tableColumns, nonSortableColumns, converterContext, entityType);

    tableColumns = tableColumns.concat(relatedColumns);
    return tableColumns;
  };
  /**
   * Gets the property names from the manifest and checks against existing properties already added by annotations.
   * If a not yet stored property is found it adds it for sorting and filtering only to the annotationColumns.
   * @param properties {string[] | undefined}
   * @param annotationColumns {AnnotationTableColumn[]}
   * @param converterContext {ConverterContext}
   * @param entityType
   * @returns {string[]} the columns from the annotations
   */


  var _getPropertyNames = function (properties, annotationColumns, converterContext, entityType) {
    var matchedProperties;

    if (properties) {
      matchedProperties = properties.map(function (propertyPath) {
        var annotationColumn = annotationColumns.find(function (annotationColumn) {
          return annotationColumn.relativePath === propertyPath && annotationColumn.propertyInfos === undefined;
        });

        if (annotationColumn) {
          return annotationColumn.name;
        } else {
          var relatedColumns = _createRelatedColumns(_defineProperty({}, propertyPath, {
            value: entityType.resolvePath(propertyPath)
          }), annotationColumns, [], converterContext, entityType);

          annotationColumns.push(relatedColumns[0]);
          return relatedColumns[0].name;
        }
      });
    }

    return matchedProperties;
  };
  /**
   * Returns table column definitions from manifest.
   * @param columns
   * @param annotationColumns
   * @param converterContext
   * @param entityType
   * @param navigationSettings
   * @returns {Record<string, CustomColumn>} the columns from the manifest
   */


  var getColumnsFromManifest = function (columns, annotationColumns, converterContext, entityType, navigationSettings) {
    var internalColumns = {};

    for (var key in columns) {
      var _manifestColumn$posit;

      var manifestColumn = columns[key];
      KeyHelper.validateKey(key);
      internalColumns[key] = {
        key: key,
        id: "CustomColumn::" + key,
        name: "CustomColumn::" + key,
        header: manifestColumn.header,
        width: manifestColumn.width || undefined,
        horizontalAlign: manifestColumn.horizontalAlign === undefined ? HorizontalAlign.Begin : manifestColumn.horizontalAlign,
        type: ColumnType.Default,
        availability: manifestColumn.availability || AvailabilityType.Default,
        template: manifestColumn.template || "undefined",
        position: {
          anchor: (_manifestColumn$posit = manifestColumn.position) === null || _manifestColumn$posit === void 0 ? void 0 : _manifestColumn$posit.anchor,
          placement: manifestColumn.position === undefined ? Placement.After : manifestColumn.position.placement
        },
        isNavigable: isActionNavigable(manifestColumn, navigationSettings, true),
        settings: manifestColumn.settings,
        sortable: false,
        propertyInfos: _getPropertyNames(manifestColumn.properties, annotationColumns, converterContext, entityType)
      };
    }

    return internalColumns;
  };

  function getP13nMode(visualizationPath, converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();
    var tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var variantManagement = manifestWrapper.getVariantManagement();
    var hasVariantManagement = ["Page", "Control"].indexOf(variantManagement) > -1;
    var aPersonalization = [];

    if (hasVariantManagement) {
      var _tableManifestSetting2;

      if ((tableManifestSettings === null || tableManifestSettings === void 0 ? void 0 : (_tableManifestSetting2 = tableManifestSettings.tableSettings) === null || _tableManifestSetting2 === void 0 ? void 0 : _tableManifestSetting2.personalization) !== undefined) {
        // Personalization configured in manifest.
        var personalization = tableManifestSettings.tableSettings.personalization;

        if (personalization === true) {
          // Table personalization fully enabled.
          return "Sort,Column,Filter";
        } else if (typeof personalization === "object") {
          // Specific personalization options enabled in manifest. Use them as is.
          if (personalization.sort) {
            aPersonalization.push("Sort");
          }

          if (personalization.column) {
            aPersonalization.push("Column");
          }

          if (personalization.filter) {
            aPersonalization.push("Filter");
          }

          return aPersonalization.length > 0 ? aPersonalization.join(",") : undefined;
        }
      } else {
        // No personalization configured in manifest.
        aPersonalization.push("Sort");
        aPersonalization.push("Column");

        if (variantManagement === VariantManagementType.Control) {
          // Feature parity with V2.
          // Enable table filtering by default only in case of Control level variant management.
          aPersonalization.push("Filter");
        }

        return aPersonalization.join(",");
      }
    }

    return undefined;
  }

  _exports.getP13nMode = getP13nMode;

  function getDeleteHidden(currentEntitySet, navigationPath) {
    var isDeleteHidden = false;

    if (currentEntitySet && navigationPath) {
      var _currentEntitySet$nav, _currentEntitySet$nav2, _currentEntitySet$nav3;

      // Check if UI.DeleteHidden is pointing to parent path
      var deleteHiddenAnnotation = (_currentEntitySet$nav = currentEntitySet.navigationPropertyBinding[navigationPath]) === null || _currentEntitySet$nav === void 0 ? void 0 : (_currentEntitySet$nav2 = _currentEntitySet$nav.annotations) === null || _currentEntitySet$nav2 === void 0 ? void 0 : (_currentEntitySet$nav3 = _currentEntitySet$nav2.UI) === null || _currentEntitySet$nav3 === void 0 ? void 0 : _currentEntitySet$nav3.DeleteHidden;

      if (deleteHiddenAnnotation && deleteHiddenAnnotation.path) {
        if (deleteHiddenAnnotation.path.indexOf("/") > 0) {
          var aSplitHiddenPath = deleteHiddenAnnotation.path.split("/");
          var sNavigationPath = aSplitHiddenPath[0];
          var partnerName = currentEntitySet.entityType.navigationProperties.find(function (navProperty) {
            return navProperty.name === navigationPath;
          }).partner;

          if (partnerName === sNavigationPath) {
            isDeleteHidden = deleteHiddenAnnotation;
          }
        } else {
          isDeleteHidden = false;
        }
      } else {
        isDeleteHidden = deleteHiddenAnnotation;
      }
    } else {
      var _currentEntitySet$ann7, _currentEntitySet$ann8;

      isDeleteHidden = currentEntitySet && ((_currentEntitySet$ann7 = currentEntitySet.annotations) === null || _currentEntitySet$ann7 === void 0 ? void 0 : (_currentEntitySet$ann8 = _currentEntitySet$ann7.UI) === null || _currentEntitySet$ann8 === void 0 ? void 0 : _currentEntitySet$ann8.DeleteHidden);
    }

    return isDeleteHidden;
  }
  /**
   * Returns visibility for Delete button
   * @param converterContext
   * @param navigationPath
   * @param isTargetDeletable
   */


  function getDeleteVisible(converterContext, navigationPath, isTargetDeletable) {
    var currentEntitySet = converterContext.getEntitySet();
    var isDeleteHidden = getDeleteHidden(currentEntitySet, navigationPath);
    var isParentDeletable, parentEntitySetDeletable;

    if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
      isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), navigationPath);
      parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable) : isParentDeletable;
    } //do not show case the delete button if parentEntitySetDeletable is false


    if (parentEntitySetDeletable === "false") {
      return false;
    } else if (parentEntitySetDeletable && isDeleteHidden !== true) {
      //Delete Hidden in case of true and path based
      if (isDeleteHidden) {
        return "{= !${" + (navigationPath ? navigationPath + "/" : "") + isDeleteHidden.path + "} && ${ui>/editMode} === 'Editable'}";
      } else {
        return "{= ${ui>/editMode} === 'Editable'}";
      }
    } else if (isDeleteHidden === true || !isTargetDeletable || converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
      return false;
    } else if (converterContext.getTemplateType() !== TemplateType.ListReport) {
      if (isDeleteHidden) {
        return "{= !${" + (navigationPath ? navigationPath + "/" : "") + isDeleteHidden.path + "} && ${ui>/editMode} === 'Editable'}";
      } else {
        return "{= ${ui>/editMode} === 'Editable'}";
      }
    } else {
      return true;
    }
  }
  /**
   * Returns visibility for Create button
   *
   * @param converterContext
   * @param creationBehaviour
   * @returns {*} Expression or Boolean value of create hidden
   */


  _exports.getDeleteVisible = getDeleteVisible;

  function getCreateVisible(converterContext, creationMode, isInsertable) {
    var _currentEntitySet$ann9, _currentEntitySet$ann10, _currentEntitySet$ann11, _converterContext$get6, _converterContext$get7;

    var currentEntitySet = converterContext.getEntitySet();
    var dataModelObjectPath = converterContext.getDataModelObjectPath();
    var isCreateHidden = currentEntitySet ? annotationExpression((currentEntitySet === null || currentEntitySet === void 0 ? void 0 : (_currentEntitySet$ann9 = currentEntitySet.annotations.UI) === null || _currentEntitySet$ann9 === void 0 ? void 0 : _currentEntitySet$ann9.CreateHidden) || false, dataModelObjectPath.navigationProperties.map(function (navProp) {
      return navProp.name;
    })) : constant(false); // if there is a custom new action the create button will be bound against this new action (instead of a POST action).
    // The visibility of the create button then depends on the new action's OperationAvailable annotation (instead of the insertRestrictions):
    // OperationAvailable = true or undefined -> create is visible
    // OperationAvailable = false -> create is not visible

    var newActionName = currentEntitySet === null || currentEntitySet === void 0 ? void 0 : (_currentEntitySet$ann10 = currentEntitySet.annotations.Common) === null || _currentEntitySet$ann10 === void 0 ? void 0 : (_currentEntitySet$ann11 = _currentEntitySet$ann10.DraftRoot) === null || _currentEntitySet$ann11 === void 0 ? void 0 : _currentEntitySet$ann11.NewAction;
    var showCreateForNewAction = newActionName ? annotationExpression(converterContext === null || converterContext === void 0 ? void 0 : (_converterContext$get6 = converterContext.getEntityType().actions[newActionName].annotations) === null || _converterContext$get6 === void 0 ? void 0 : (_converterContext$get7 = _converterContext$get6.Core) === null || _converterContext$get7 === void 0 ? void 0 : _converterContext$get7.OperationAvailable, [], true) : undefined; // - If it's statically not insertable -> create is not visible
    // - If create is statically hidden -> create is not visible
    // - If it's an ALP template -> create is not visible
    // -
    // - Otherwise
    // 	 - If the create mode is external -> create is visible
    // 	 - If we're on the list report -> create is visible
    // 	 - Otherwise
    // 	   - This depends on the value of the the UI.IsEditable

    return ifElse(or(or(equal(showCreateForNewAction, false), and(isConstant(isInsertable), equal(isInsertable, false), equal(showCreateForNewAction, undefined))), isConstant(isCreateHidden) && equal(isCreateHidden, true), converterContext.getTemplateType() === TemplateType.AnalyticalListPage), false, ifElse(or(creationMode === "External", converterContext.getTemplateType() === TemplateType.ListReport), true, and(not(isCreateHidden), UI.IsEditable)));
  }
  /**
   * Returns visibility for Create button
   *
   * @param converterContext
   * @param creationBehaviour
   * @returns {*} Expression or Boolean value of createhidden
   */


  _exports.getCreateVisible = getCreateVisible;

  function getPasteEnabled(converterContext, creationBehaviour, isInsertable) {
    // If create is not visible -> it's not enabled
    // If create is visible ->
    // 	 If it's in the ListReport -> not enabled
    //	 If it's insertable -> enabled
    return ifElse(equal(getCreateVisible(converterContext, creationBehaviour.mode, isInsertable), true), converterContext.getTemplateType() === TemplateType.ObjectPage && isInsertable, false);
  }
  /**
   * Returns a JSON string containing Presentation Variant sort conditions.
   *
   * @param presentationVariantAnnotation {PresentationVariantTypeTypes | undefined} Presentation variant annotation
   * @param columns Converter processed table columns
   * @returns {string | undefined} Sort conditions for a Presentation variant.
   */


  _exports.getPasteEnabled = getPasteEnabled;

  function getSortConditions(presentationVariantAnnotation, columns) {
    var sortConditions;

    if (presentationVariantAnnotation === null || presentationVariantAnnotation === void 0 ? void 0 : presentationVariantAnnotation.SortOrder) {
      var sorters = [];
      var conditions = {
        sorters: sorters
      };
      presentationVariantAnnotation.SortOrder.forEach(function (condition) {
        var _ref4, _ref4$$target, _sortColumn$propertyI, _sortColumn$propertyI2;

        var propertyName = (_ref4 = condition.Property) === null || _ref4 === void 0 ? void 0 : (_ref4$$target = _ref4.$target) === null || _ref4$$target === void 0 ? void 0 : _ref4$$target.name;
        var sortColumn = columns.find(function (column) {
          return column.name === propertyName;
        });
        sortColumn === null || sortColumn === void 0 ? void 0 : (_sortColumn$propertyI = sortColumn.propertyInfos) === null || _sortColumn$propertyI === void 0 ? void 0 : _sortColumn$propertyI.forEach(function (relatedPropertyName) {
          // Complex PropertyInfo. Add each related property for sorting.
          conditions.sorters.push({
            name: relatedPropertyName,
            descending: !!condition.Descending
          });
        });

        if (!(sortColumn === null || sortColumn === void 0 ? void 0 : (_sortColumn$propertyI2 = sortColumn.propertyInfos) === null || _sortColumn$propertyI2 === void 0 ? void 0 : _sortColumn$propertyI2.length)) {
          // Not a complex PropertyInfo. Consider the property itself for sorting.
          conditions.sorters.push({
            name: propertyName,
            descending: !!condition.Descending
          });
        }
      });
      sortConditions = conditions.sorters.length ? JSON.stringify(conditions) : undefined;
    }

    return sortConditions;
  }

  function getTableAnnotationConfiguration(lineItemAnnotation, visualizationPath, converterContext, tableManifestConfiguration, columns, presentationVariantAnnotation) {
    var _converterContext$get8, _converterContext$get9, _converterContext$get10;

    // Need to get the target
    var _splitPath3 = splitPath(visualizationPath),
        navigationPropertyPath = _splitPath3.navigationPropertyPath;

    var title = (_converterContext$get8 = converterContext.getDataModelObjectPath().targetEntityType.annotations) === null || _converterContext$get8 === void 0 ? void 0 : (_converterContext$get9 = _converterContext$get8.UI) === null || _converterContext$get9 === void 0 ? void 0 : (_converterContext$get10 = _converterContext$get9.HeaderInfo) === null || _converterContext$get10 === void 0 ? void 0 : _converterContext$get10.TypeNamePlural;
    var entitySet = converterContext.getDataModelObjectPath().startingEntitySet;
    var pageManifestSettings = converterContext.getManifestWrapper();
    var isEntitySet = navigationPropertyPath.length === 0,
        p13nMode = getP13nMode(visualizationPath, converterContext),
        id = isEntitySet && entitySet ? TableID(entitySet.name, "LineItem") : TableID(visualizationPath);
    var targetCapabilities = getCapabilityRestriction(visualizationPath, converterContext.getConverterContextFor(entitySet));
    var selectionMode = getSelectionMode(lineItemAnnotation, visualizationPath, converterContext, isEntitySet, targetCapabilities);
    var threshold = isEntitySet ? 30 : 10;

    if (presentationVariantAnnotation === null || presentationVariantAnnotation === void 0 ? void 0 : presentationVariantAnnotation.MaxItems) {
      threshold = presentationVariantAnnotation.MaxItems;
    }

    var navigationOrCollectionName = isEntitySet && entitySet ? entitySet.name : navigationPropertyPath;
    var navigationSettings = pageManifestSettings.getNavigationConfiguration(navigationOrCollectionName);

    var creationBehaviour = _getCreationBehaviour(lineItemAnnotation, tableManifestConfiguration, converterContext, navigationSettings);

    var isParentDeletable, parentEntitySetDeletable;

    if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
      var _isParentDeletable;

      isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), undefined, true);

      if ((_isParentDeletable = isParentDeletable) === null || _isParentDeletable === void 0 ? void 0 : _isParentDeletable.currentEntityRestriction) {
        parentEntitySetDeletable = undefined;
      } else {
        parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable, true) : isParentDeletable;
      }
    }

    var dataModelObjectPath = converterContext.getDataModelObjectPath();
    var isInsertable = isPathInsertable(dataModelObjectPath);
    return {
      id: id,
      entityName: entitySet ? entitySet.name : "",
      collection: getTargetObjectPath(converterContext.getDataModelObjectPath()),
      navigationPath: navigationPropertyPath,
      isEntitySet: isEntitySet,
      row: _getRowConfigurationProperty(lineItemAnnotation, visualizationPath, converterContext, navigationSettings, navigationOrCollectionName),
      p13nMode: p13nMode,
      show: {
        "delete": getDeleteVisible(converterContext, navigationPropertyPath, targetCapabilities.isDeletable),
        create: compileBinding(getCreateVisible(converterContext, creationBehaviour === null || creationBehaviour === void 0 ? void 0 : creationBehaviour.mode, isInsertable)),
        paste: compileBinding(getPasteEnabled(converterContext, creationBehaviour, isInsertable))
      },
      displayMode: isInDisplayMode(converterContext),
      create: creationBehaviour,
      selectionMode: selectionMode,
      autoBindOnInit: converterContext.getTemplateType() === TemplateType.ObjectPage,
      enableControlVM: pageManifestSettings.getVariantManagement() === "Control" && !!p13nMode,
      threshold: threshold,
      sortConditions: getSortConditions(presentationVariantAnnotation, columns),
      parentEntityDeleteEnabled: parentEntitySetDeletable,
      title: title
    };
  }

  _exports.getTableAnnotationConfiguration = getTableAnnotationConfiguration;

  function isInDisplayMode(converterContext) {
    var templateType = converterContext.getTemplateType();

    if (templateType === TemplateType.AnalyticalListPage || templateType === TemplateType.ListReport) {
      return true;
    } // updatable will be handled at the property level


    return false;
  }
  /**
   * Split the visualization path into the navigation property path and annotation.
   *
   * @param visualizationPath
   * @returns {object}
   */


  function splitPath(visualizationPath) {
    var _visualizationPath$sp = visualizationPath.split("@"),
        _visualizationPath$sp2 = _slicedToArray(_visualizationPath$sp, 2),
        navigationPropertyPath = _visualizationPath$sp2[0],
        annotationPath = _visualizationPath$sp2[1];

    if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
      // Drop trailing slash
      navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
    }

    return {
      navigationPropertyPath: navigationPropertyPath,
      annotationPath: annotationPath
    };
  }

  function getSelectionVariantConfiguration(selectionVariantPath, converterContext) {
    var resolvedTarget = converterContext.getEntityTypeAnnotation(selectionVariantPath);
    var selection = resolvedTarget.annotation;

    if (selection) {
      var _selection$SelectOpti;

      var propertyNames = [];
      (_selection$SelectOpti = selection.SelectOptions) === null || _selection$SelectOpti === void 0 ? void 0 : _selection$SelectOpti.forEach(function (selectOption) {
        var propertyName = selectOption.PropertyName;
        var PropertyPath = propertyName.value;

        if (propertyNames.indexOf(PropertyPath) === -1) {
          propertyNames.push(PropertyPath);
        }
      });
      return {
        text: selection.Text,
        propertyNames: propertyNames
      };
    }

    return undefined;
  }

  _exports.getSelectionVariantConfiguration = getSelectionVariantConfiguration;

  function getTableManifestConfiguration(lineItemAnnotation, visualizationPath, converterContext) {
    var isCondensedTableLayoutCompliant = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var tableSettings = tableManifestSettings.tableSettings;
    var quickSelectionVariant;
    var quickFilterPaths = [];
    var enableExport = true;
    var creationMode = CreationMode.NewPage;
    var filters;
    var createAtEnd = true;
    var disableAddRowButtonForEmptyData = false;
    var condensedTableLayout = false;
    var hideTableTitle = false;
    var tableType = "ResponsiveTable";
    var enableFullScreen = false;
    var selectionLimit = 200;
    var enablePaste = converterContext.getTemplateType() === "ObjectPage";
    var shellServices = converterContext.getShellServices();
    var userContentDensity = shellServices === null || shellServices === void 0 ? void 0 : shellServices.getContentDensity();
    var appContentDensity = converterContext.getManifestWrapper().getContentDensities();

    if ((appContentDensity === null || appContentDensity === void 0 ? void 0 : appContentDensity.cozy) === true && (appContentDensity === null || appContentDensity === void 0 ? void 0 : appContentDensity.compact) !== true || userContentDensity === "cozy") {
      isCondensedTableLayoutCompliant = false;
    }

    if (tableSettings && lineItemAnnotation) {
      var _tableSettings$quickV, _tableSettings$quickV2, _tableSettings$creati, _tableSettings$creati2, _tableSettings$creati3, _tableSettings$creati4, _tableSettings$quickV4;

      var targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);
      tableSettings === null || tableSettings === void 0 ? void 0 : (_tableSettings$quickV = tableSettings.quickVariantSelection) === null || _tableSettings$quickV === void 0 ? void 0 : (_tableSettings$quickV2 = _tableSettings$quickV.paths) === null || _tableSettings$quickV2 === void 0 ? void 0 : _tableSettings$quickV2.forEach(function (path) {
        var _tableSettings$quickV3;

        quickSelectionVariant = targetEntityType.resolvePath("@" + path.annotationPath); // quickSelectionVariant = converterContext.getEntityTypeAnnotation(path.annotationPath);

        if (quickSelectionVariant) {
          quickFilterPaths.push({
            annotationPath: path.annotationPath
          });
        }

        filters = {
          quickFilters: {
            enabled: converterContext.getTemplateType() === TemplateType.ListReport ? "{= ${pageInternal>hasPendingFilters} !== true}" : true,
            showCounts: tableSettings === null || tableSettings === void 0 ? void 0 : (_tableSettings$quickV3 = tableSettings.quickVariantSelection) === null || _tableSettings$quickV3 === void 0 ? void 0 : _tableSettings$quickV3.showCounts,
            paths: quickFilterPaths
          }
        };
      });
      creationMode = ((_tableSettings$creati = tableSettings.creationMode) === null || _tableSettings$creati === void 0 ? void 0 : _tableSettings$creati.name) || creationMode;
      createAtEnd = ((_tableSettings$creati2 = tableSettings.creationMode) === null || _tableSettings$creati2 === void 0 ? void 0 : _tableSettings$creati2.createAtEnd) !== undefined ? (_tableSettings$creati3 = tableSettings.creationMode) === null || _tableSettings$creati3 === void 0 ? void 0 : _tableSettings$creati3.createAtEnd : true;
      disableAddRowButtonForEmptyData = !!((_tableSettings$creati4 = tableSettings.creationMode) === null || _tableSettings$creati4 === void 0 ? void 0 : _tableSettings$creati4.disableAddRowButtonForEmptyData);
      condensedTableLayout = tableSettings.condensedTableLayout !== undefined ? tableSettings.condensedTableLayout : false;
      hideTableTitle = !!((_tableSettings$quickV4 = tableSettings.quickVariantSelection) === null || _tableSettings$quickV4 === void 0 ? void 0 : _tableSettings$quickV4.hideTableTitle);
      tableType = (tableSettings === null || tableSettings === void 0 ? void 0 : tableSettings.type) || "ResponsiveTable";
      enableFullScreen = tableSettings.enableFullScreen || false;

      if (enableFullScreen === true && converterContext.getTemplateType() === TemplateType.ListReport) {
        enableFullScreen = false;
        converterContext.getDiagnostics().addIssue(IssueCategory.Manifest, IssueSeverity.Low, IssueType.FULLSCREENMODE_NOT_ON_LISTREPORT);
      }

      selectionLimit = tableSettings.selectAll === true || tableSettings.selectionLimit === 0 ? 0 : tableSettings.selectionLimit || 200;
      enablePaste = converterContext.getTemplateType() === "ObjectPage" && tableSettings.enablePaste !== false;
      enableExport = tableSettings.enableExport !== undefined ? tableSettings.enableExport : converterContext.getTemplateType() !== "ObjectPage" || enablePaste;
    }

    return {
      filters: filters,
      type: tableType,
      enableFullScreen: enableFullScreen,
      headerVisible: !(quickSelectionVariant && hideTableTitle),
      enableExport: enableExport,
      creationMode: creationMode,
      createAtEnd: createAtEnd,
      disableAddRowButtonForEmptyData: disableAddRowButtonForEmptyData,
      useCondensedTableLayout: condensedTableLayout && isCondensedTableLayoutCompliant,
      selectionLimit: selectionLimit,
      enablePaste: enablePaste
    };
  }

  _exports.getTableManifestConfiguration = getTableManifestConfiguration;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRhYmxlLnRzIl0sIm5hbWVzIjpbIkNvbHVtblR5cGUiLCJnZXRUYWJsZUFjdGlvbnMiLCJsaW5lSXRlbUFubm90YXRpb24iLCJ2aXN1YWxpemF0aW9uUGF0aCIsImNvbnZlcnRlckNvbnRleHQiLCJuYXZpZ2F0aW9uU2V0dGluZ3MiLCJhQW5ub3RhdGlvbkFjdGlvbnMiLCJnZXRUYWJsZUFubm90YXRpb25BY3Rpb25zIiwiaW5zZXJ0Q3VzdG9tRWxlbWVudHMiLCJnZXRBY3Rpb25zRnJvbU1hbmlmZXN0IiwiZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbiIsImFjdGlvbnMiLCJpc05hdmlnYWJsZSIsImVuYWJsZU9uU2VsZWN0IiwiZW5hYmxlQXV0b1Njcm9sbCIsImdldFRhYmxlQ29sdW1ucyIsImFubm90YXRpb25Db2x1bW5zIiwiZ2V0Q29sdW1uc0Zyb21Bbm5vdGF0aW9ucyIsIm1hbmlmZXN0Q29sdW1ucyIsImdldENvbHVtbnNGcm9tTWFuaWZlc3QiLCJjb2x1bW5zIiwiZ2V0QW5ub3RhdGlvbkVudGl0eVR5cGUiLCJ3aWR0aCIsImF2YWlsYWJpbGl0eSIsInNldHRpbmdzIiwiY3JlYXRlVGFibGVWaXN1YWxpemF0aW9uIiwicHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24iLCJpc0NvbmRlbnNlZFRhYmxlTGF5b3V0Q29tcGxpYW50IiwidGFibGVNYW5pZmVzdENvbmZpZyIsImdldFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uIiwic3BsaXRQYXRoIiwibmF2aWdhdGlvblByb3BlcnR5UGF0aCIsImRhdGFNb2RlbFBhdGgiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwiZW50aXR5TmFtZSIsInRhcmdldEVudGl0eVNldCIsIm5hbWUiLCJzdGFydGluZ0VudGl0eVNldCIsImlzRW50aXR5U2V0IiwibGVuZ3RoIiwibmF2aWdhdGlvbk9yQ29sbGVjdGlvbk5hbWUiLCJnZXRNYW5pZmVzdFdyYXBwZXIiLCJnZXROYXZpZ2F0aW9uQ29uZmlndXJhdGlvbiIsInR5cGUiLCJWaXN1YWxpemF0aW9uVHlwZSIsIlRhYmxlIiwiYW5ub3RhdGlvbiIsImdldFRhYmxlQW5ub3RhdGlvbkNvbmZpZ3VyYXRpb24iLCJjb250cm9sIiwicmVtb3ZlRHVwbGljYXRlQWN0aW9ucyIsImNyZWF0ZURlZmF1bHRUYWJsZVZpc3VhbGl6YXRpb24iLCJ1bmRlZmluZWQiLCJnZXRDb2x1bW5zRnJvbUVudGl0eVR5cGUiLCJnZXRFbnRpdHlUeXBlIiwiaGFzQWN0aW9uUmVxdWlyaW5nQ29udGV4dCIsInNvbWUiLCJkYXRhRmllbGQiLCIkVHlwZSIsIklubGluZSIsIlJlcXVpcmVzQ29udGV4dCIsImhhc0FjdGlvblJlcXVpcmluZ1NlbGVjdGlvbiIsIm1hbmlmZXN0QWN0aW9ucyIsInJlcXVpcmVzU2VsZWN0aW9uS2V5IiwiT2JqZWN0Iiwia2V5cyIsImFjdGlvbktleSIsImFjdGlvbiIsInJlcXVpcmVzU2VsZWN0aW9uIiwiZ2V0Q2FwYWJpbGl0eVJlc3RyaWN0aW9uIiwibmF2aWdhdGlvblByb3BlcnR5UGF0aFBhcnRzIiwic3BsaXQiLCJvQ2FwYWJpbGl0eVJlc3RyaWN0aW9uIiwiaXNEZWxldGFibGUiLCJpc1VwZGF0YWJsZSIsImN1cnJlbnRFbnRpdHlTZXQiLCJnZXRFbnRpdHlTZXQiLCJwYXRoc1RvQ2hlY2siLCJyZWR1Y2UiLCJwYXRocyIsIm5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhQYXJ0IiwicHVzaCIsImhhc1Jlc3RyaWN0ZWRQYXRoT25EZWxldGUiLCJoYXNSZXN0cmljdGVkUGF0aE9uVXBkYXRlIiwiYW5ub3RhdGlvbnMiLCJDYXBhYmlsaXRpZXMiLCJOYXZpZ2F0aW9uUmVzdHJpY3Rpb25zIiwiUmVzdHJpY3RlZFByb3BlcnRpZXMiLCJmb3JFYWNoIiwicmVzdHJpY3RlZE5hdlByb3AiLCJOYXZpZ2F0aW9uUHJvcGVydHkiLCJEZWxldGVSZXN0cmljdGlvbnMiLCJEZWxldGFibGUiLCJpbmRleE9mIiwidmFsdWUiLCJVcGRhdGVSZXN0cmljdGlvbnMiLCJVcGRhdGFibGUiLCJuYXZQcm9wTmFtZSIsInNoaWZ0IiwibmF2UHJvcCIsImVudGl0eVR5cGUiLCJuYXZpZ2F0aW9uUHJvcGVydGllcyIsImZpbmQiLCJjb250YWluc1RhcmdldCIsIm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmciLCJoYXNPd25Qcm9wZXJ0eSIsImdldFNlbGVjdGlvbk1vZGUiLCJ0YXJnZXRDYXBhYmlsaXRpZXMiLCJTZWxlY3Rpb25Nb2RlIiwiTm9uZSIsInRhYmxlTWFuaWZlc3RTZXR0aW5ncyIsInNlbGVjdGlvbk1vZGUiLCJ0YWJsZVNldHRpbmdzIiwiaXNQYXJlbnREZWxldGFibGUiLCJwYXJlbnRFbnRpdHlTZXREZWxldGFibGUiLCJnZXRUZW1wbGF0ZVR5cGUiLCJUZW1wbGF0ZVR5cGUiLCJPYmplY3RQYWdlIiwiaXNQYXRoRGVsZXRhYmxlIiwiY29tcGlsZUJpbmRpbmciLCJNdWx0aSIsIkF1dG8iLCJ0YWJsZUFjdGlvbnMiLCJ0YWJsZUFjdGlvbiIsImlzRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3QiLCJVSSIsIkhpZGRlbiIsIkRldGVybWluaW5nIiwia2V5IiwiS2V5SGVscGVyIiwiZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkIiwiQWN0aW9uVHlwZSIsIkRhdGFGaWVsZEZvckFjdGlvbiIsImFubm90YXRpb25QYXRoIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsIkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbiIsImdldENyaXRpY2FsaXR5QmluZGluZ0J5RW51bSIsIkNyaXRpY2FsaXR5RW51bSIsImNyaXRpY2FsaXR5UHJvcGVydHkiLCJNZXNzYWdlVHlwZSIsIkVycm9yIiwiV2FybmluZyIsIlN1Y2Nlc3MiLCJJbmZvcm1hdGlvbiIsImdldEhpZ2hsaWdodFJvd0JpbmRpbmciLCJjcml0aWNhbGl0eUFubm90YXRpb24iLCJpc0RyYWZ0Um9vdCIsImRlZmF1bHRIaWdobGlnaHRSb3dEZWZpbml0aW9uIiwiYW5ub3RhdGlvbkV4cHJlc3Npb24iLCJpZkVsc2UiLCJEcmFmdCIsIklzTmV3T2JqZWN0IiwiZm9ybWF0UmVzdWx0IiwidGFibGVGb3JtYXR0ZXJzIiwicm93SGlnaGxpZ2h0aW5nIiwiX2dldENyZWF0aW9uQmVoYXZpb3VyIiwidGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24iLCJuYXZpZ2F0aW9uIiwiY3JlYXRlIiwiZGV0YWlsIiwib3V0Ym91bmQiLCJvdXRib3VuZERldGFpbCIsIm1vZGUiLCJuZXdBY3Rpb24iLCJ0YXJnZXRFbnRpdHlUeXBlIiwidGFyZ2V0QW5ub3RhdGlvbnMiLCJnZXRFbnRpdHlTZXRGb3JFbnRpdHlUeXBlIiwiQ29tbW9uIiwiRHJhZnRSb290IiwiTmV3QWN0aW9uIiwiU2Vzc2lvbiIsIlN0aWNreVNlc3Npb25TdXBwb3J0ZWQiLCJjcmVhdGlvbk1vZGUiLCJDcmVhdGlvbk1vZGUiLCJDcmVhdGlvblJvdyIsInJvdXRlIiwiYXBwZW5kIiwiY3JlYXRlQXRFbmQiLCJuYXZpZ2F0ZVRvVGFyZ2V0IiwiTmV3UGFnZSIsIl9nZXRSb3dDb25maWd1cmF0aW9uUHJvcGVydHkiLCJ0YXJnZXRQYXRoIiwicHJlc3NQcm9wZXJ0eSIsIm5hdmlnYXRpb25UYXJnZXQiLCJkaXNwbGF5IiwidGFyZ2V0IiwiQ3JpdGljYWxpdHkiLCJEcmFmdE5vZGUiLCJyb3dOYXZpZ2F0ZWRFeHByZXNzaW9uIiwiYmluZGluZ0V4cHJlc3Npb24iLCJuYXZpZ2F0ZWRSb3ciLCJwcmVzcyIsInJvd05hdmlnYXRlZCIsIm5vblNvcnRhYmxlQ29sdW1ucyIsInRhYmxlQ29sdW1ucyIsImFnZ3JlZ2F0aW9uSGVscGVyIiwiQWdncmVnYXRpb25IZWxwZXIiLCJlbnRpdHlQcm9wZXJ0aWVzIiwicHJvcGVydHkiLCJleGlzdHMiLCJjb2x1bW4iLCJ0YXJnZXRUeXBlIiwiZ2V0Q29sdW1uRGVmaW5pdGlvbkZyb21Qcm9wZXJ0eSIsImZ1bGxQcm9wZXJ0eVBhdGgiLCJyZWxhdGl2ZVBhdGgiLCJ1c2VEYXRhRmllbGRQcmVmaXgiLCJhdmFpbGFibGVGb3JBZGFwdGF0aW9uIiwiZGVzY3JpcHRpb25Qcm9wZXJ0eSIsInJlcGxhY2VTcGVjaWFsQ2hhcnMiLCJzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoIiwiZ2V0U2VtYW50aWNPYmplY3RQYXRoIiwiaXNIaWRkZW4iLCJncm91cFBhdGgiLCJfc2xpY2VBdFNsYXNoIiwiaXNHcm91cCIsImRlc2NyaXB0aW9uTGFiZWwiLCJfZ2V0TGFiZWwiLCJpc0tleSIsImlzR3JvdXBhYmxlIiwiaXNQcm9wZXJ0eUdyb3VwYWJsZSIsIkFubm90YXRpb24iLCJsYWJlbCIsImdyb3VwTGFiZWwiLCJncm91cCIsInNlbWFudGljT2JqZWN0UGF0aCIsIkF2YWlsYWJpbGl0eVR5cGUiLCJBZGFwdGF0aW9uIiwic29ydGFibGUiLCJleHBvcnRTZXR0aW5ncyIsIl9pc1ZhbGlkQ29sdW1uIiwiaXNQcm9wZXJ0eSIsIkxhYmVsIiwidG9TdHJpbmciLCJpc0RhdGFGaWVsZFR5cGVzIiwiVmFsdWUiLCIkdGFyZ2V0IiwiX2NyZWF0ZVJlbGF0ZWRDb2x1bW5zIiwiY29sdW1uc1RvQmVDcmVhdGVkIiwiZXhpc3RpbmdDb2x1bW5zIiwicmVsYXRlZENvbHVtbnMiLCJyZWxhdGVkUHJvcGVydHlOYW1lTWFwIiwiZGVzY3JpcHRpb24iLCJnZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoIiwicmVsYXRlZENvbHVtbiIsIm5ld05hbWUiLCJwcm9wZXJ0eUluZm9zIiwibWFwIiwicHJvcGVydHlJbmZvIiwiX2dldEFubm90YXRpb25Db2x1bW5OYW1lIiwicGF0aCIsIlRhcmdldCIsIl9nZXRSZWxhdGl2ZVBhdGgiLCJpc0xhc3RTbGFzaCIsImlzTGFzdFBhcnQiLCJpU2xhc2hJbmRleCIsImxhc3RJbmRleE9mIiwic3Vic3RyaW5nIiwiU29ydFJlc3RyaWN0aW9ucyIsIk5vblNvcnRhYmxlUHJvcGVydGllcyIsImxpbmVJdGVtIiwicmVsYXRlZFByb3BlcnRpZXNJbmZvIiwiY29sbGVjdFJlbGF0ZWRQcm9wZXJ0aWVzIiwicmVsYXRlZFByb3BlcnR5TmFtZXMiLCJwcm9wZXJ0aWVzIiwiSFRNTDUiLCJDc3NEZWZhdWx0cyIsImlzRGF0YUZpZWxkQWx3YXlzSGlkZGVuIiwiRGVmYXVsdCIsInRlbXBsYXRlIiwiZXhwb3J0U2V0dGluZ3NUZW1wbGF0ZSIsImNvbmNhdCIsIl9nZXRQcm9wZXJ0eU5hbWVzIiwibWF0Y2hlZFByb3BlcnRpZXMiLCJwcm9wZXJ0eVBhdGgiLCJhbm5vdGF0aW9uQ29sdW1uIiwicmVzb2x2ZVBhdGgiLCJpbnRlcm5hbENvbHVtbnMiLCJtYW5pZmVzdENvbHVtbiIsInZhbGlkYXRlS2V5IiwiaWQiLCJoZWFkZXIiLCJob3Jpem9udGFsQWxpZ24iLCJIb3Jpem9udGFsQWxpZ24iLCJCZWdpbiIsInBvc2l0aW9uIiwiYW5jaG9yIiwicGxhY2VtZW50IiwiUGxhY2VtZW50IiwiQWZ0ZXIiLCJpc0FjdGlvbk5hdmlnYWJsZSIsImdldFAxM25Nb2RlIiwibWFuaWZlc3RXcmFwcGVyIiwidmFyaWFudE1hbmFnZW1lbnQiLCJnZXRWYXJpYW50TWFuYWdlbWVudCIsImhhc1ZhcmlhbnRNYW5hZ2VtZW50IiwiYVBlcnNvbmFsaXphdGlvbiIsInBlcnNvbmFsaXphdGlvbiIsInNvcnQiLCJmaWx0ZXIiLCJqb2luIiwiVmFyaWFudE1hbmFnZW1lbnRUeXBlIiwiQ29udHJvbCIsImdldERlbGV0ZUhpZGRlbiIsIm5hdmlnYXRpb25QYXRoIiwiaXNEZWxldGVIaWRkZW4iLCJkZWxldGVIaWRkZW5Bbm5vdGF0aW9uIiwiRGVsZXRlSGlkZGVuIiwiYVNwbGl0SGlkZGVuUGF0aCIsInNOYXZpZ2F0aW9uUGF0aCIsInBhcnRuZXJOYW1lIiwibmF2UHJvcGVydHkiLCJwYXJ0bmVyIiwiZ2V0RGVsZXRlVmlzaWJsZSIsImlzVGFyZ2V0RGVsZXRhYmxlIiwiQW5hbHl0aWNhbExpc3RQYWdlIiwiTGlzdFJlcG9ydCIsImdldENyZWF0ZVZpc2libGUiLCJpc0luc2VydGFibGUiLCJkYXRhTW9kZWxPYmplY3RQYXRoIiwiaXNDcmVhdGVIaWRkZW4iLCJDcmVhdGVIaWRkZW4iLCJjb25zdGFudCIsIm5ld0FjdGlvbk5hbWUiLCJzaG93Q3JlYXRlRm9yTmV3QWN0aW9uIiwiQ29yZSIsIk9wZXJhdGlvbkF2YWlsYWJsZSIsIm9yIiwiZXF1YWwiLCJhbmQiLCJpc0NvbnN0YW50Iiwibm90IiwiSXNFZGl0YWJsZSIsImdldFBhc3RlRW5hYmxlZCIsImNyZWF0aW9uQmVoYXZpb3VyIiwiZ2V0U29ydENvbmRpdGlvbnMiLCJzb3J0Q29uZGl0aW9ucyIsIlNvcnRPcmRlciIsInNvcnRlcnMiLCJjb25kaXRpb25zIiwiY29uZGl0aW9uIiwicHJvcGVydHlOYW1lIiwiUHJvcGVydHkiLCJzb3J0Q29sdW1uIiwicmVsYXRlZFByb3BlcnR5TmFtZSIsImRlc2NlbmRpbmciLCJEZXNjZW5kaW5nIiwiSlNPTiIsInN0cmluZ2lmeSIsInRpdGxlIiwiSGVhZGVySW5mbyIsIlR5cGVOYW1lUGx1cmFsIiwiZW50aXR5U2V0IiwicGFnZU1hbmlmZXN0U2V0dGluZ3MiLCJwMTNuTW9kZSIsIlRhYmxlSUQiLCJnZXRDb252ZXJ0ZXJDb250ZXh0Rm9yIiwidGhyZXNob2xkIiwiTWF4SXRlbXMiLCJjdXJyZW50RW50aXR5UmVzdHJpY3Rpb24iLCJpc1BhdGhJbnNlcnRhYmxlIiwiY29sbGVjdGlvbiIsImdldFRhcmdldE9iamVjdFBhdGgiLCJyb3ciLCJzaG93IiwicGFzdGUiLCJkaXNwbGF5TW9kZSIsImlzSW5EaXNwbGF5TW9kZSIsImF1dG9CaW5kT25Jbml0IiwiZW5hYmxlQ29udHJvbFZNIiwicGFyZW50RW50aXR5RGVsZXRlRW5hYmxlZCIsInRlbXBsYXRlVHlwZSIsInN1YnN0ciIsImdldFNlbGVjdGlvblZhcmlhbnRDb25maWd1cmF0aW9uIiwic2VsZWN0aW9uVmFyaWFudFBhdGgiLCJyZXNvbHZlZFRhcmdldCIsImdldEVudGl0eVR5cGVBbm5vdGF0aW9uIiwic2VsZWN0aW9uIiwicHJvcGVydHlOYW1lcyIsIlNlbGVjdE9wdGlvbnMiLCJzZWxlY3RPcHRpb24iLCJQcm9wZXJ0eU5hbWUiLCJQcm9wZXJ0eVBhdGgiLCJ0ZXh0IiwiVGV4dCIsInF1aWNrU2VsZWN0aW9uVmFyaWFudCIsInF1aWNrRmlsdGVyUGF0aHMiLCJlbmFibGVFeHBvcnQiLCJmaWx0ZXJzIiwiZGlzYWJsZUFkZFJvd0J1dHRvbkZvckVtcHR5RGF0YSIsImNvbmRlbnNlZFRhYmxlTGF5b3V0IiwiaGlkZVRhYmxlVGl0bGUiLCJ0YWJsZVR5cGUiLCJlbmFibGVGdWxsU2NyZWVuIiwic2VsZWN0aW9uTGltaXQiLCJlbmFibGVQYXN0ZSIsInNoZWxsU2VydmljZXMiLCJnZXRTaGVsbFNlcnZpY2VzIiwidXNlckNvbnRlbnREZW5zaXR5IiwiZ2V0Q29udGVudERlbnNpdHkiLCJhcHBDb250ZW50RGVuc2l0eSIsImdldENvbnRlbnREZW5zaXRpZXMiLCJjb3p5IiwiY29tcGFjdCIsInF1aWNrVmFyaWFudFNlbGVjdGlvbiIsInF1aWNrRmlsdGVycyIsImVuYWJsZWQiLCJzaG93Q291bnRzIiwiZ2V0RGlhZ25vc3RpY3MiLCJhZGRJc3N1ZSIsIklzc3VlQ2F0ZWdvcnkiLCJNYW5pZmVzdCIsIklzc3VlU2V2ZXJpdHkiLCJMb3ciLCJJc3N1ZVR5cGUiLCJGVUxMU0NSRUVOTU9ERV9OT1RfT05fTElTVFJFUE9SVCIsInNlbGVjdEFsbCIsImhlYWRlclZpc2libGUiLCJ1c2VDb25kZW5zZWRUYWJsZUxheW91dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF5S0tBLFU7O2FBQUFBLFU7QUFBQUEsSUFBQUEsVTtBQUFBQSxJQUFBQSxVO0tBQUFBLFUsS0FBQUEsVTs7QUF1REw7Ozs7Ozs7OztBQVNPLFdBQVNDLGVBQVQsQ0FDTkMsa0JBRE0sRUFFTkMsaUJBRk0sRUFHTkMsZ0JBSE0sRUFJTkMsa0JBSk0sRUFLUztBQUNmLFFBQU1DLGtCQUFnQyxHQUFHQyx5QkFBeUIsQ0FBQ0wsa0JBQUQsRUFBcUJDLGlCQUFyQixFQUF3Q0MsZ0JBQXhDLENBQWxFO0FBQ0EsV0FBT0ksb0JBQW9CLENBQzFCRixrQkFEMEIsRUFFMUJHLHNCQUFzQixDQUNyQkwsZ0JBQWdCLENBQUNNLCtCQUFqQixDQUFpRFAsaUJBQWpELEVBQW9FUSxPQUQvQyxFQUVyQlAsZ0JBRnFCLEVBR3JCRSxrQkFIcUIsRUFJckJELGtCQUpxQixFQUtyQixJQUxxQixDQUZJLEVBUzFCO0FBQUVPLE1BQUFBLFdBQVcsRUFBRSxXQUFmO0FBQTRCQyxNQUFBQSxjQUFjLEVBQUUsV0FBNUM7QUFBeURDLE1BQUFBLGdCQUFnQixFQUFFO0FBQTNFLEtBVDBCLENBQTNCO0FBV0E7QUFFRDs7Ozs7Ozs7Ozs7Ozs7QUFVTyxXQUFTQyxlQUFULENBQ05iLGtCQURNLEVBRU5DLGlCQUZNLEVBR05DLGdCQUhNLEVBSU5DLGtCQUpNLEVBS1U7QUFDaEIsUUFBTVcsaUJBQWlCLEdBQUdDLHlCQUF5QixDQUFDZixrQkFBRCxFQUFxQkMsaUJBQXJCLEVBQXdDQyxnQkFBeEMsQ0FBbkQ7QUFDQSxRQUFNYyxlQUFlLEdBQUdDLHNCQUFzQixDQUM3Q2YsZ0JBQWdCLENBQUNNLCtCQUFqQixDQUFpRFAsaUJBQWpELEVBQW9FaUIsT0FEdkIsRUFFN0NKLGlCQUY2QyxFQUc3Q1osZ0JBSDZDLEVBSTdDQSxnQkFBZ0IsQ0FBQ2lCLHVCQUFqQixDQUF5Q25CLGtCQUF6QyxDQUo2QyxFQUs3Q0csa0JBTDZDLENBQTlDO0FBUUEsV0FBT0csb0JBQW9CLENBQUNRLGlCQUFELEVBQW9CRSxlQUFwQixFQUFxQztBQUMvREksTUFBQUEsS0FBSyxFQUFFLFdBRHdEO0FBRS9EVixNQUFBQSxXQUFXLEVBQUUsV0FGa0Q7QUFHL0RXLE1BQUFBLFlBQVksRUFBRSxXQUhpRDtBQUkvREMsTUFBQUEsUUFBUSxFQUFFO0FBSnFELEtBQXJDLENBQTNCO0FBTUE7Ozs7QUFFTSxXQUFTQyx3QkFBVCxDQUNOdkIsa0JBRE0sRUFFTkMsaUJBRk0sRUFHTkMsZ0JBSE0sRUFJTnNCLDZCQUpNLEVBS05DLCtCQUxNLEVBTWU7QUFDckIsUUFBTUMsbUJBQW1CLEdBQUdDLDZCQUE2QixDQUN4RDNCLGtCQUR3RCxFQUV4REMsaUJBRndELEVBR3hEQyxnQkFId0QsRUFJeER1QiwrQkFKd0QsQ0FBekQ7O0FBRHFCLHFCQU9jRyxTQUFTLENBQUMzQixpQkFBRCxDQVB2QjtBQUFBLFFBT2I0QixzQkFQYSxjQU9iQSxzQkFQYTs7QUFRckIsUUFBTUMsYUFBYSxHQUFHNUIsZ0JBQWdCLENBQUM2QixzQkFBakIsRUFBdEI7QUFDQSxRQUFNQyxVQUFrQixHQUFHRixhQUFhLENBQUNHLGVBQWQsR0FBZ0NILGFBQWEsQ0FBQ0csZUFBZCxDQUE4QkMsSUFBOUQsR0FBcUVKLGFBQWEsQ0FBQ0ssaUJBQWQsQ0FBZ0NELElBQWhJO0FBQUEsUUFDQ0UsV0FBb0IsR0FBR1Asc0JBQXNCLENBQUNRLE1BQXZCLEtBQWtDLENBRDFEO0FBRUEsUUFBTUMsMEJBQTBCLEdBQUdGLFdBQVcsR0FBR0osVUFBSCxHQUFnQkgsc0JBQTlEO0FBQ0EsUUFBTTFCLGtCQUFrQixHQUFHRCxnQkFBZ0IsQ0FBQ3FDLGtCQUFqQixHQUFzQ0MsMEJBQXRDLENBQWlFRiwwQkFBakUsQ0FBM0I7QUFDQSxRQUFNcEIsT0FBTyxHQUFHTCxlQUFlLENBQUNiLGtCQUFELEVBQXFCQyxpQkFBckIsRUFBd0NDLGdCQUF4QyxFQUEwREMsa0JBQTFELENBQS9CO0FBQ0EsV0FBTztBQUNOc0MsTUFBQUEsSUFBSSxFQUFFQyxpQkFBaUIsQ0FBQ0MsS0FEbEI7QUFFTkMsTUFBQUEsVUFBVSxFQUFFQywrQkFBK0IsQ0FDMUM3QyxrQkFEMEMsRUFFMUNDLGlCQUYwQyxFQUcxQ0MsZ0JBSDBDLEVBSTFDd0IsbUJBSjBDLEVBSzFDUixPQUwwQyxFQU0xQ00sNkJBTjBDLENBRnJDO0FBVU5zQixNQUFBQSxPQUFPLEVBQUVwQixtQkFWSDtBQVdOakIsTUFBQUEsT0FBTyxFQUFFc0Msc0JBQXNCLENBQUNoRCxlQUFlLENBQUNDLGtCQUFELEVBQXFCQyxpQkFBckIsRUFBd0NDLGdCQUF4QyxFQUEwREMsa0JBQTFELENBQWhCLENBWHpCO0FBWU5lLE1BQUFBLE9BQU8sRUFBRUE7QUFaSCxLQUFQO0FBY0E7Ozs7QUFFTSxXQUFTOEIsK0JBQVQsQ0FBeUM5QyxnQkFBekMsRUFBaUc7QUFDdkcsUUFBTXdCLG1CQUFtQixHQUFHQyw2QkFBNkIsQ0FBQ3NCLFNBQUQsRUFBWSxFQUFaLEVBQWdCL0MsZ0JBQWhCLEVBQWtDLEtBQWxDLENBQXpEO0FBQ0EsUUFBTWdCLE9BQU8sR0FBR2dDLHdCQUF3QixDQUFDaEQsZ0JBQWdCLENBQUNpRCxhQUFqQixFQUFELEVBQW1DLEVBQW5DLEVBQXVDLEVBQXZDLEVBQTJDakQsZ0JBQTNDLENBQXhDO0FBQ0EsV0FBTztBQUNOdUMsTUFBQUEsSUFBSSxFQUFFQyxpQkFBaUIsQ0FBQ0MsS0FEbEI7QUFFTkMsTUFBQUEsVUFBVSxFQUFFQywrQkFBK0IsQ0FBQ0ksU0FBRCxFQUFZLEVBQVosRUFBZ0IvQyxnQkFBaEIsRUFBa0N3QixtQkFBbEMsRUFBdURSLE9BQXZELENBRnJDO0FBR040QixNQUFBQSxPQUFPLEVBQUVwQixtQkFISDtBQUlOakIsTUFBQUEsT0FBTyxFQUFFLEVBSkg7QUFLTlMsTUFBQUEsT0FBTyxFQUFFQTtBQUxILEtBQVA7QUFPQTtBQUVEOzs7Ozs7Ozs7OztBQU9BLFdBQVNrQyx5QkFBVCxDQUFtQ3BELGtCQUFuQyxFQUEwRTtBQUN6RSxXQUFPQSxrQkFBa0IsQ0FBQ3FELElBQW5CLENBQXdCLFVBQUFDLFNBQVMsRUFBSTtBQUMzQyxVQUFJQSxTQUFTLENBQUNDLEtBQVYsb0RBQUosRUFBOEQ7QUFDN0QsZUFBT0QsU0FBUyxDQUFDRSxNQUFWLEtBQXFCLElBQTVCO0FBQ0EsT0FGRCxNQUVPLElBQUlGLFNBQVMsQ0FBQ0MsS0FBVixtRUFBSixFQUE2RTtBQUNuRixlQUFPRCxTQUFTLENBQUNFLE1BQVYsS0FBcUIsSUFBckIsSUFBNkJGLFNBQVMsQ0FBQ0csZUFBOUM7QUFDQTtBQUNELEtBTk0sQ0FBUDtBQU9BOztBQUVELFdBQVNDLDJCQUFULENBQXFDQyxlQUFyQyxFQUE2RjtBQUM1RixRQUFJQyxvQkFBNkIsR0FBRyxLQUFwQzs7QUFDQSxRQUFJRCxlQUFKLEVBQXFCO0FBQ3BCQyxNQUFBQSxvQkFBb0IsR0FBR0MsTUFBTSxDQUFDQyxJQUFQLENBQVlILGVBQVosRUFBNkJOLElBQTdCLENBQWtDLFVBQUFVLFNBQVMsRUFBSTtBQUNyRSxZQUFNQyxNQUFNLEdBQUdMLGVBQWUsQ0FBQ0ksU0FBRCxDQUE5QjtBQUNBLGVBQU9DLE1BQU0sQ0FBQ0MsaUJBQVAsS0FBNkIsSUFBcEM7QUFDQSxPQUhzQixDQUF2QjtBQUlBOztBQUNELFdBQU9MLG9CQUFQO0FBQ0E7QUFFRDs7Ozs7Ozs7Ozs7O0FBVU8sV0FBU00sd0JBQVQsQ0FBa0NqRSxpQkFBbEMsRUFBNkRDLGdCQUE3RCxFQUE2SDtBQUFBLHNCQUNoRzBCLFNBQVMsQ0FBQzNCLGlCQUFELENBRHVGO0FBQUEsUUFDM0g0QixzQkFEMkgsZUFDM0hBLHNCQUQySDs7QUFFbkksUUFBTXNDLDJCQUEyQixHQUFHdEMsc0JBQXNCLENBQUN1QyxLQUF2QixDQUE2QixHQUE3QixDQUFwQztBQUNBLFFBQU1DLHNCQUFzQixHQUFHO0FBQUVDLE1BQUFBLFdBQVcsRUFBRSxJQUFmO0FBQXFCQyxNQUFBQSxXQUFXLEVBQUU7QUFBbEMsS0FBL0I7QUFDQSxRQUFJQyxnQkFBdUMsR0FBR3RFLGdCQUFnQixDQUFDdUUsWUFBakIsRUFBOUM7O0FBSm1JO0FBQUE7O0FBVWxJLFVBQU1DLFlBQXNCLEdBQUcsRUFBL0I7QUFDQVAsTUFBQUEsMkJBQTJCLENBQUNRLE1BQTVCLENBQW1DLFVBQUNDLEtBQUQsRUFBUUMsMEJBQVIsRUFBdUM7QUFDekUsWUFBSUQsS0FBSyxDQUFDdkMsTUFBTixHQUFlLENBQW5CLEVBQXNCO0FBQ3JCdUMsVUFBQUEsS0FBSyxJQUFJLEdBQVQ7QUFDQTs7QUFDREEsUUFBQUEsS0FBSyxJQUFJQywwQkFBVDtBQUNBSCxRQUFBQSxZQUFZLENBQUNJLElBQWIsQ0FBa0JGLEtBQWxCO0FBQ0EsZUFBT0EsS0FBUDtBQUNBLE9BUEQsRUFPRyxFQVBIO0FBUUEsVUFBSUcseUJBQXlCLEdBQUcsS0FBaEM7QUFBQSxVQUNDQyx5QkFBeUIsR0FBRyxLQUQ3QjtBQUVBLGdDQUFBUixnQkFBZ0IsQ0FBQ1MsV0FBakIsQ0FBNkJDLFlBQTdCLDRHQUEyQ0Msc0JBQTNDLGtGQUFtRUMsb0JBQW5FLENBQXdGQyxPQUF4RixDQUNDLFVBQUNDLGlCQUFELEVBQTJEO0FBQUE7O0FBQzFELFlBQUksQ0FBQUEsaUJBQWlCLFNBQWpCLElBQUFBLGlCQUFpQixXQUFqQixxQ0FBQUEsaUJBQWlCLENBQUVDLGtCQUFuQixnRkFBdUM5QyxJQUF2QyxNQUFnRCx3QkFBcEQsRUFBOEU7QUFBQTs7QUFDN0UsY0FBSSwwQkFBQTZDLGlCQUFpQixDQUFDRSxrQkFBbEIsZ0ZBQXNDQyxTQUF0QyxNQUFvRCxLQUF4RCxFQUErRDtBQUM5RFYsWUFBQUEseUJBQXlCLEdBQ3hCQSx5QkFBeUIsSUFBSUwsWUFBWSxDQUFDZ0IsT0FBYixDQUFxQkosaUJBQWlCLENBQUNDLGtCQUFsQixDQUFxQ0ksS0FBMUQsTUFBcUUsQ0FBQyxDQURwRztBQUVBLFdBSEQsTUFHTyxJQUFJLDBCQUFBTCxpQkFBaUIsQ0FBQ00sa0JBQWxCLGdGQUFzQ0MsU0FBdEMsTUFBb0QsS0FBeEQsRUFBK0Q7QUFDckViLFlBQUFBLHlCQUF5QixHQUN4QkEseUJBQXlCLElBQUlOLFlBQVksQ0FBQ2dCLE9BQWIsQ0FBcUJKLGlCQUFpQixDQUFDQyxrQkFBbEIsQ0FBcUNJLEtBQTFELE1BQXFFLENBQUMsQ0FEcEc7QUFFQTtBQUNEO0FBQ0QsT0FYRjtBQWFBdEIsTUFBQUEsc0JBQXNCLENBQUNDLFdBQXZCLEdBQXFDLENBQUNTLHlCQUF0QztBQUNBVixNQUFBQSxzQkFBc0IsQ0FBQ0UsV0FBdkIsR0FBcUMsQ0FBQ1MseUJBQXRDO0FBQ0EsVUFBTWMsV0FBVyxHQUFHM0IsMkJBQTJCLENBQUM0QixLQUE1QixFQUFwQjs7QUFDQSxVQUFJRCxXQUFKLEVBQWlCO0FBQ2hCLFlBQU1FLE9BQTJCLEdBQUd4QixnQkFBZ0IsQ0FBQ3lCLFVBQWpCLENBQTRCQyxvQkFBNUIsQ0FBaURDLElBQWpELENBQ25DLFVBQUFILE9BQU87QUFBQSxpQkFBSUEsT0FBTyxDQUFDOUQsSUFBUixJQUFnQjRELFdBQXBCO0FBQUEsU0FENEIsQ0FBcEM7O0FBR0EsWUFBSUUsT0FBTyxJQUFJLENBQUNBLE9BQU8sQ0FBQ0ksY0FBcEIsSUFBc0M1QixnQkFBZ0IsQ0FBQzZCLHlCQUFqQixDQUEyQ0MsY0FBM0MsQ0FBMERSLFdBQTFELENBQTFDLEVBQWtIO0FBQ2pIdEIsVUFBQUEsZ0JBQWdCLEdBQUdBLGdCQUFnQixDQUFDNkIseUJBQWpCLENBQTJDUCxXQUEzQyxDQUFuQjtBQUNBLFNBRkQsTUFFTztBQUNOO0FBQ0F0QixVQUFBQSxnQkFBZ0IsR0FBR3ZCLFNBQW5CO0FBQ0E7QUFDRDtBQS9DaUk7O0FBS25JLFdBQ0MsQ0FBQ29CLHNCQUFzQixDQUFDQyxXQUF2QixJQUFzQ0Qsc0JBQXNCLENBQUNFLFdBQTlELEtBQ0FDLGdCQURBLElBRUFMLDJCQUEyQixDQUFDOUIsTUFBNUIsR0FBcUMsQ0FIdEMsRUFJRTtBQUFBO0FBdUNEOztBQUNELFFBQUltQyxnQkFBZ0IsS0FBS3ZCLFNBQXJCLElBQWtDdUIsZ0JBQWdCLENBQUNTLFdBQXZELEVBQW9FO0FBQ25FLFVBQUlaLHNCQUFzQixDQUFDQyxXQUEzQixFQUF3QztBQUFBOztBQUN2QztBQUNBRCxRQUFBQSxzQkFBc0IsQ0FBQ0MsV0FBdkIsR0FBcUMsMEJBQUFFLGdCQUFnQixDQUFDUyxXQUFqQixDQUE2QkMsWUFBN0IsMEdBQTJDTSxrQkFBM0Msa0ZBQStEQyxTQUEvRCxNQUE2RSxLQUFsSDtBQUNBOztBQUNELFVBQUlwQixzQkFBc0IsQ0FBQ0UsV0FBM0IsRUFBd0M7QUFBQTs7QUFDdkM7QUFDQUYsUUFBQUEsc0JBQXNCLENBQUNFLFdBQXZCLEdBQXFDLDJCQUFBQyxnQkFBZ0IsQ0FBQ1MsV0FBakIsQ0FBNkJDLFlBQTdCLDRHQUEyQ1Usa0JBQTNDLGtGQUErREMsU0FBL0QsTUFBNkUsS0FBbEg7QUFDQTtBQUNEOztBQUNELFdBQU94QixzQkFBUDtBQUNBOzs7O0FBRUQsV0FBU2tDLGdCQUFULENBQ0N2RyxrQkFERCxFQUVDQyxpQkFGRCxFQUdDQyxnQkFIRCxFQUlDa0MsV0FKRCxFQUtDb0Usa0JBTEQsRUFNVTtBQUFBOztBQUNULFFBQUksQ0FBQ3hHLGtCQUFMLEVBQXlCO0FBQ3hCLGFBQU95RyxhQUFhLENBQUNDLElBQXJCO0FBQ0E7O0FBQ0QsUUFBTUMscUJBQXFCLEdBQUd6RyxnQkFBZ0IsQ0FBQ00sK0JBQWpCLENBQWlEUCxpQkFBakQsQ0FBOUI7QUFDQSxRQUFJMkcsYUFBYSw0QkFBR0QscUJBQXFCLENBQUNFLGFBQXpCLDBEQUFHLHNCQUFxQ0QsYUFBekQ7QUFDQSxRQUFNakQsZUFBZSxHQUFHcEQsc0JBQXNCLENBQzdDTCxnQkFBZ0IsQ0FBQ00sK0JBQWpCLENBQWlEUCxpQkFBakQsRUFBb0VRLE9BRHZCLEVBRTdDUCxnQkFGNkMsRUFHN0MsRUFINkMsRUFJN0MrQyxTQUo2QyxFQUs3QyxLQUw2QyxDQUE5QztBQU9BLFFBQUk2RCxpQkFBSixFQUF1QkMsd0JBQXZCOztBQUNBLFFBQUk3RyxnQkFBZ0IsQ0FBQzhHLGVBQWpCLE9BQXVDQyxZQUFZLENBQUNDLFVBQXhELEVBQW9FO0FBQ25FSixNQUFBQSxpQkFBaUIsR0FBR0ssZUFBZSxDQUFDakgsZ0JBQWdCLENBQUM2QixzQkFBakIsRUFBRCxFQUE0Q2tCLFNBQTVDLENBQW5DO0FBQ0E4RCxNQUFBQSx3QkFBd0IsR0FBR0QsaUJBQWlCLEdBQUdNLGNBQWMsQ0FBQ04saUJBQUQsRUFBb0IsSUFBcEIsQ0FBakIsR0FBNkNBLGlCQUF6RjtBQUNBOztBQUNELFFBQUlGLGFBQWEsSUFBSUEsYUFBYSxLQUFLSCxhQUFhLENBQUNDLElBQXJELEVBQTJEO0FBQzFELFVBQUlGLGtCQUFrQixDQUFDbEMsV0FBbkIsSUFBa0N5Qyx3QkFBd0IsS0FBSyxPQUFuRSxFQUE0RTtBQUMzRSxlQUFPLDBDQUEwQ04sYUFBYSxDQUFDWSxLQUF4RCxHQUFnRSxhQUF2RTtBQUNBLE9BRkQsTUFFTztBQUNOVCxRQUFBQSxhQUFhLEdBQUdILGFBQWEsQ0FBQ0MsSUFBOUI7QUFDQTtBQUNELEtBTkQsTUFNTyxJQUFJLENBQUNFLGFBQUQsSUFBa0JBLGFBQWEsS0FBS0gsYUFBYSxDQUFDYSxJQUF0RCxFQUE0RDtBQUNsRVYsTUFBQUEsYUFBYSxHQUFHSCxhQUFhLENBQUNZLEtBQTlCO0FBQ0E7O0FBQ0QsUUFBSWpFLHlCQUF5QixDQUFDcEQsa0JBQUQsQ0FBekIsSUFBaUQwRCwyQkFBMkIsQ0FBQ0MsZUFBRCxDQUFoRixFQUFtRztBQUNsRyxhQUFPaUQsYUFBUDtBQUNBLEtBRkQsTUFFTyxJQUFJSixrQkFBa0IsQ0FBQ2xDLFdBQW5CLElBQWtDeUMsd0JBQXdCLEtBQUssT0FBbkUsRUFBNEU7QUFDbEYsVUFBSSxDQUFDM0UsV0FBTCxFQUFrQjtBQUNqQixlQUFPLDBDQUEwQ3dFLGFBQTFDLEdBQTBELGFBQWpFO0FBQ0EsT0FGRCxNQUVPO0FBQ04sZUFBT0EsYUFBUDtBQUNBO0FBQ0Q7O0FBQ0QsV0FBT0gsYUFBYSxDQUFDQyxJQUFyQjtBQUNBO0FBRUQ7Ozs7Ozs7Ozs7QUFRQSxXQUFTckcseUJBQVQsQ0FDQ0wsa0JBREQsRUFFQ0MsaUJBRkQsRUFHQ0MsZ0JBSEQsRUFJZ0I7QUFDZixRQUFNcUgsWUFBMEIsR0FBRyxFQUFuQzs7QUFDQSxRQUFJdkgsa0JBQUosRUFBd0I7QUFDdkJBLE1BQUFBLGtCQUFrQixDQUFDcUYsT0FBbkIsQ0FBMkIsVUFBQy9CLFNBQUQsRUFBdUM7QUFBQTs7QUFDakUsWUFBSWtFLFdBQUo7O0FBQ0EsWUFDQ0MsNEJBQTRCLENBQUNuRSxTQUFELENBQTVCLElBQ0EsRUFBRSwwQkFBQUEsU0FBUyxDQUFDMkIsV0FBViwwR0FBdUJ5QyxFQUF2QixrRkFBMkJDLE1BQTNCLE1BQXNDLElBQXhDLENBREEsSUFFQSxDQUFDckUsU0FBUyxDQUFDRSxNQUZYLElBR0EsQ0FBQ0YsU0FBUyxDQUFDc0UsV0FKWixFQUtFO0FBQ0QsY0FBTUMsR0FBRyxHQUFHQyxTQUFTLENBQUNDLHdCQUFWLENBQW1DekUsU0FBbkMsQ0FBWjs7QUFDQSxrQkFBUUEsU0FBUyxDQUFDQyxLQUFsQjtBQUNDLGlCQUFLLCtDQUFMO0FBQ0NpRSxjQUFBQSxXQUFXLEdBQUc7QUFDYi9FLGdCQUFBQSxJQUFJLEVBQUV1RixVQUFVLENBQUNDLGtCQURKO0FBRWJDLGdCQUFBQSxjQUFjLEVBQUVoSSxnQkFBZ0IsQ0FBQ2lJLCtCQUFqQixDQUFpRDdFLFNBQVMsQ0FBQzhFLGtCQUEzRCxDQUZIO0FBR2JQLGdCQUFBQSxHQUFHLEVBQUVBLEdBSFE7QUFJYm5ILGdCQUFBQSxXQUFXLEVBQUU7QUFKQSxlQUFkO0FBTUE7O0FBRUQsaUJBQUssOERBQUw7QUFDQzhHLGNBQUFBLFdBQVcsR0FBRztBQUNiL0UsZ0JBQUFBLElBQUksRUFBRXVGLFVBQVUsQ0FBQ0ssaUNBREo7QUFFYkgsZ0JBQUFBLGNBQWMsRUFBRWhJLGdCQUFnQixDQUFDaUksK0JBQWpCLENBQWlEN0UsU0FBUyxDQUFDOEUsa0JBQTNELENBRkg7QUFHYlAsZ0JBQUFBLEdBQUcsRUFBRUE7QUFIUSxlQUFkO0FBS0E7O0FBQ0Q7QUFDQztBQWxCRjtBQW9CQTs7QUFDRCxZQUFJTCxXQUFKLEVBQWlCO0FBQ2hCRCxVQUFBQSxZQUFZLENBQUN6QyxJQUFiLENBQWtCMEMsV0FBbEI7QUFDQTtBQUNELE9BakNEO0FBa0NBOztBQUNELFdBQU9ELFlBQVA7QUFDQTs7QUFFRCxXQUFTZSwyQkFBVCxDQUFxQ0MsZUFBckMsRUFBa0Y7QUFDakYsUUFBSUMsbUJBQUo7O0FBQ0EsWUFBUUQsZUFBUjtBQUNDLFdBQUssNkJBQUw7QUFDQ0MsUUFBQUEsbUJBQW1CLEdBQUdDLFdBQVcsQ0FBQ0MsS0FBbEM7QUFDQTs7QUFDRCxXQUFLLDZCQUFMO0FBQ0NGLFFBQUFBLG1CQUFtQixHQUFHQyxXQUFXLENBQUNFLE9BQWxDO0FBQ0E7O0FBQ0QsV0FBSyw2QkFBTDtBQUNDSCxRQUFBQSxtQkFBbUIsR0FBR0MsV0FBVyxDQUFDRyxPQUFsQztBQUNBOztBQUNELFdBQUssZ0NBQUw7QUFDQ0osUUFBQUEsbUJBQW1CLEdBQUdDLFdBQVcsQ0FBQ0ksV0FBbEM7QUFDQTs7QUFDRCxXQUFLLDRCQUFMO0FBQ0E7QUFDQ0wsUUFBQUEsbUJBQW1CLEdBQUdDLFdBQVcsQ0FBQy9CLElBQWxDO0FBZkY7O0FBaUJBLFdBQU84QixtQkFBUDtBQUNBOztBQUVELFdBQVNNLHNCQUFULENBQ0NDLHFCQURELEVBRUNDLFdBRkQsRUFHMkI7QUFDMUIsUUFBSUMsNkJBQW9FLEdBQUdSLFdBQVcsQ0FBQy9CLElBQXZGOztBQUNBLFFBQUlxQyxxQkFBSixFQUEyQjtBQUMxQixVQUFJLE9BQU9BLHFCQUFQLEtBQWlDLFFBQXJDLEVBQStDO0FBQzlDRSxRQUFBQSw2QkFBNkIsR0FBR0Msb0JBQW9CLENBQUNILHFCQUFELENBQXBEO0FBQ0EsT0FGRCxNQUVPO0FBQ047QUFDQUUsUUFBQUEsNkJBQTZCLEdBQUdYLDJCQUEyQixDQUFDUyxxQkFBRCxDQUEzRDtBQUNBO0FBQ0Q7O0FBQ0QsV0FBT0ksTUFBTSxDQUNaSCxXQUFXLElBQUlJLEtBQUssQ0FBQ0MsV0FEVCxFQUVaWixXQUFXLENBQUNJLFdBRkEsRUFHWlMsWUFBWSxDQUFDLENBQUNMLDZCQUFELENBQUQsRUFBa0NNLGVBQWUsQ0FBQ0MsZUFBbEQsQ0FIQSxDQUFiO0FBS0E7O0FBRUQsV0FBU0MscUJBQVQsQ0FDQ3pKLGtCQURELEVBRUMwSiwwQkFGRCxFQUdDeEosZ0JBSEQsRUFJQ0Msa0JBSkQsRUFLMEM7QUFDekMsUUFBTXdKLFVBQVUsR0FBRyxDQUFBeEosa0JBQWtCLFNBQWxCLElBQUFBLGtCQUFrQixXQUFsQixZQUFBQSxrQkFBa0IsQ0FBRXlKLE1BQXBCLE1BQThCekosa0JBQTlCLGFBQThCQSxrQkFBOUIsdUJBQThCQSxrQkFBa0IsQ0FBRTBKLE1BQWxELENBQW5CLENBRHlDLENBR3pDOztBQUNBLFFBQUksQ0FBQUYsVUFBVSxTQUFWLElBQUFBLFVBQVUsV0FBVixZQUFBQSxVQUFVLENBQUVHLFFBQVosS0FBd0JILFVBQVUsQ0FBQ0ksY0FBbkMsS0FBcUQ1SixrQkFBckQsYUFBcURBLGtCQUFyRCx1QkFBcURBLGtCQUFrQixDQUFFeUosTUFBekUsQ0FBSixFQUFxRjtBQUNwRixhQUFPO0FBQ05JLFFBQUFBLElBQUksRUFBRSxVQURBO0FBRU5GLFFBQUFBLFFBQVEsRUFBRUgsVUFBVSxDQUFDRyxRQUZmO0FBR05DLFFBQUFBLGNBQWMsRUFBRUosVUFBVSxDQUFDSSxjQUhyQjtBQUlONUosUUFBQUEsa0JBQWtCLEVBQUVBO0FBSmQsT0FBUDtBQU1BOztBQUVELFFBQUk4SixTQUFKOztBQUNBLFFBQUlqSyxrQkFBSixFQUF3QjtBQUFBOztBQUN2QjtBQUNBLFVBQU1rSyxnQkFBZ0IsR0FBR2hLLGdCQUFnQixDQUFDaUIsdUJBQWpCLENBQXlDbkIsa0JBQXpDLENBQXpCO0FBQ0EsVUFBTW1LLGlCQUFpQiw0QkFBR2pLLGdCQUFnQixDQUFDa0sseUJBQWpCLENBQTJDRixnQkFBM0MsQ0FBSCwwREFBRyxzQkFBOERqRixXQUF4RjtBQUNBZ0YsTUFBQUEsU0FBUyxHQUFHLENBQUFFLGlCQUFpQixTQUFqQixJQUFBQSxpQkFBaUIsV0FBakIscUNBQUFBLGlCQUFpQixDQUFFRSxNQUFuQiwwR0FBMkJDLFNBQTNCLGtGQUFzQ0MsU0FBdEMsTUFBbURKLGlCQUFuRCxhQUFtREEsaUJBQW5ELGdEQUFtREEsaUJBQWlCLENBQUVLLE9BQXRFLG9GQUFtRCxzQkFBNEJDLHNCQUEvRSwyREFBbUQsdUJBQW9ERixTQUF2RyxDQUFaLENBSnVCLENBSXVHOztBQUU5SCxVQUFJYiwwQkFBMEIsQ0FBQ2dCLFlBQTNCLEtBQTRDQyxZQUFZLENBQUNDLFdBQXpELElBQXdFWCxTQUE1RSxFQUF1RjtBQUN0RjtBQUNBO0FBQ0EsY0FBTXZCLEtBQUssMEJBQW1CaUMsWUFBWSxDQUFDQyxXQUFoQywyREFBNEZYLFNBQTVGLE9BQVg7QUFDQTs7QUFDRCxVQUFJTixVQUFKLGFBQUlBLFVBQUosdUJBQUlBLFVBQVUsQ0FBRWtCLEtBQWhCLEVBQXVCO0FBQ3RCO0FBQ0EsZUFBTztBQUNOYixVQUFBQSxJQUFJLEVBQUVOLDBCQUEwQixDQUFDZ0IsWUFEM0I7QUFFTkksVUFBQUEsTUFBTSxFQUFFcEIsMEJBQTBCLENBQUNxQixXQUY3QjtBQUdOZCxVQUFBQSxTQUFTLEVBQUVBLFNBSEw7QUFJTmUsVUFBQUEsZ0JBQWdCLEVBQUV0QiwwQkFBMEIsQ0FBQ2dCLFlBQTNCLEtBQTRDQyxZQUFZLENBQUNNLE9BQXpELEdBQW1FdEIsVUFBVSxDQUFDa0IsS0FBOUUsR0FBc0Y1SCxTQUpsRyxDQUk0Rzs7QUFKNUcsU0FBUDtBQU1BO0FBQ0QsS0FsQ3dDLENBb0N6Qzs7O0FBQ0EsUUFBSXlHLDBCQUEwQixDQUFDZ0IsWUFBM0IsS0FBNENDLFlBQVksQ0FBQ00sT0FBN0QsRUFBc0U7QUFDckV2QixNQUFBQSwwQkFBMEIsQ0FBQ2dCLFlBQTNCLEdBQTBDQyxZQUFZLENBQUNuSCxNQUF2RDtBQUNBOztBQUVELFdBQU87QUFDTndHLE1BQUFBLElBQUksRUFBRU4sMEJBQTBCLENBQUNnQixZQUQzQjtBQUVOSSxNQUFBQSxNQUFNLEVBQUVwQiwwQkFBMEIsQ0FBQ3FCLFdBRjdCO0FBR05kLE1BQUFBLFNBQVMsRUFBRUE7QUFITCxLQUFQO0FBS0E7O0FBRUQsTUFBTWlCLDRCQUE0QixHQUFHLFVBQ3BDbEwsa0JBRG9DLEVBRXBDQyxpQkFGb0MsRUFHcENDLGdCQUhvQyxFQUlwQ0Msa0JBSm9DLEVBS3BDZ0wsVUFMb0MsRUFNbkM7QUFDRCxRQUFJQyxhQUFKLEVBQW1CQyxnQkFBbkI7QUFDQSxRQUFJN0MsbUJBQXVELEdBQUdDLFdBQVcsQ0FBQy9CLElBQTFFO0FBQ0EsUUFBTXdELGdCQUFnQixHQUFHaEssZ0JBQWdCLENBQUNpQix1QkFBakIsQ0FBeUNuQixrQkFBekMsQ0FBekI7O0FBQ0EsUUFBSUcsa0JBQWtCLElBQUlILGtCQUExQixFQUE4QztBQUFBOztBQUM3Q3FMLE1BQUFBLGdCQUFnQixHQUFHLDBCQUFBbEwsa0JBQWtCLENBQUNtTCxPQUFuQixnRkFBNEJDLE1BQTVCLGdDQUFzQ3BMLGtCQUFrQixDQUFDMEosTUFBekQsMkRBQXNDLHVCQUEyQkMsUUFBakUsQ0FBbkI7O0FBQ0EsVUFBSXVCLGdCQUFKLEVBQXNCO0FBQ3JCRCxRQUFBQSxhQUFhLEdBQ1osNkRBQTZEQyxnQkFBN0QsR0FBZ0YsbUNBRGpGO0FBRUEsT0FIRCxNQUdPLElBQUluQixnQkFBSixFQUFzQjtBQUFBOztBQUM1QixZQUFNakksZUFBZSxHQUFHL0IsZ0JBQWdCLENBQUNrSyx5QkFBakIsQ0FBMkNGLGdCQUEzQyxDQUF4QjtBQUNBbUIsUUFBQUEsZ0JBQWdCLDZCQUFHbEwsa0JBQWtCLENBQUMwSixNQUF0QiwyREFBRyx1QkFBMkJnQixLQUE5Qzs7QUFDQSxZQUFJUSxnQkFBSixFQUFzQjtBQUFBOztBQUNyQjdDLFVBQUFBLG1CQUFtQixHQUFHTSxzQkFBc0IsMEJBQzNDOUksa0JBQWtCLENBQUNpRixXQUR3QixvRkFDM0Msc0JBQWdDeUMsRUFEVywyREFDM0MsdUJBQW9DOEQsV0FETyxFQUUzQyxDQUFDLEVBQUN2SixlQUFELGFBQUNBLGVBQUQsZ0RBQUNBLGVBQWUsQ0FBRWdELFdBQWxCLG9GQUFDLHNCQUE4Qm9GLE1BQS9CLDJEQUFDLHVCQUFzQ0MsU0FBdkMsQ0FBRCxJQUFxRCxDQUFDLEVBQUNySSxlQUFELGFBQUNBLGVBQUQsaURBQUNBLGVBQWUsQ0FBRWdELFdBQWxCLHFGQUFDLHVCQUE4Qm9GLE1BQS9CLDJEQUFDLHVCQUFzQ29CLFNBQXZDLENBRlgsQ0FBNUM7QUFJQUwsVUFBQUEsYUFBYSxHQUNaLDJHQUNBRCxVQURBLEdBRUEsZ0JBRkEsSUFHQyxDQUFBbEosZUFBZSxTQUFmLElBQUFBLGVBQWUsV0FBZixzQ0FBQUEsZUFBZSxDQUFFZ0QsV0FBakIsNEdBQThCb0YsTUFBOUIsa0ZBQXNDQyxTQUF0QyxNQUFtRHJJLGVBQW5ELGFBQW1EQSxlQUFuRCxpREFBbURBLGVBQWUsQ0FBRWdELFdBQXBFLHFGQUFtRCx1QkFBOEJvRixNQUFqRiwyREFBbUQsdUJBQXNDb0IsU0FBekYsSUFDRSw4REFERixHQUVFLFdBTEgsSUFNQSxJQVBELENBTHFCLENBWWQ7QUFDUCxTQWJELE1BYU87QUFBQTs7QUFDTmpELFVBQUFBLG1CQUFtQixHQUFHTSxzQkFBc0IsMkJBQUM5SSxrQkFBa0IsQ0FBQ2lGLFdBQXBCLHFGQUFDLHVCQUFnQ3lDLEVBQWpDLDJEQUFDLHVCQUFvQzhELFdBQXJDLEVBQWtELEtBQWxELENBQTVDO0FBQ0E7QUFDRDtBQUNEOztBQUNELFFBQU1FLHNCQUEyQyxHQUFHcEMsWUFBWSxDQUMvRCxDQUFDcUMsaUJBQWlCLENBQUMsY0FBRCxFQUFpQixVQUFqQixDQUFsQixDQUQrRCxFQUUvRHBDLGVBQWUsQ0FBQ3FDLFlBRitDLEVBRy9EMUIsZ0JBSCtELENBQWhFO0FBS0EsV0FBTztBQUNOMkIsTUFBQUEsS0FBSyxFQUFFVCxhQUREO0FBRU5wSCxNQUFBQSxNQUFNLEVBQUVvSCxhQUFhLEdBQUcsWUFBSCxHQUFrQm5JLFNBRmpDO0FBR051RyxNQUFBQSxlQUFlLEVBQUVwQyxjQUFjLENBQUNvQixtQkFBRCxDQUh6QjtBQUlOc0QsTUFBQUEsWUFBWSxFQUFFMUUsY0FBYyxDQUFDc0Usc0JBQUQ7QUFKdEIsS0FBUDtBQU1BLEdBL0NEO0FBaURBOzs7Ozs7Ozs7OztBQVNPLE1BQU14SSx3QkFBd0IsR0FBRyxVQUN2QytDLFVBRHVDLEVBS2I7QUFBQSxRQUgxQm5GLGlCQUcwQix1RUFIbUIsRUFHbkI7QUFBQSxRQUYxQmlMLGtCQUUwQjtBQUFBLFFBRDFCN0wsZ0JBQzBCO0FBQzFCLFFBQU04TCxZQUFxQyxHQUFHLEVBQTlDO0FBQ0EsUUFBTUMsaUJBQWlCLEdBQUcsSUFBSUMsaUJBQUosQ0FBc0JqRyxVQUF0QixFQUFrQy9GLGdCQUFsQyxDQUExQjtBQUVBK0YsSUFBQUEsVUFBVSxDQUFDa0csZ0JBQVgsQ0FBNEI5RyxPQUE1QixDQUFvQyxVQUFDK0csUUFBRCxFQUF3QjtBQUMzRDtBQUNBLFVBQU1DLE1BQU0sR0FBR3ZMLGlCQUFpQixDQUFDdUMsSUFBbEIsQ0FBdUIsVUFBQWlKLE1BQU0sRUFBSTtBQUMvQyxlQUFPQSxNQUFNLENBQUNwSyxJQUFQLEtBQWdCa0ssUUFBUSxDQUFDbEssSUFBaEM7QUFDQSxPQUZjLENBQWYsQ0FGMkQsQ0FNM0Q7O0FBQ0EsVUFBSSxDQUFDa0ssUUFBUSxDQUFDRyxVQUFWLElBQXdCLENBQUNGLE1BQTdCLEVBQXFDO0FBQ3BDTCxRQUFBQSxZQUFZLENBQUNsSCxJQUFiLENBQ0MwSCwrQkFBK0IsQ0FDOUJKLFFBRDhCLEVBRTlCbE0sZ0JBQWdCLENBQUNpSSwrQkFBakIsQ0FBaURpRSxRQUFRLENBQUNoRSxrQkFBMUQsQ0FGOEIsRUFHOUJnRSxRQUFRLENBQUNsSyxJQUhxQixFQUk5QixJQUo4QixFQUs5QixJQUw4QixFQU05QjZKLGtCQU44QixFQU85QkUsaUJBUDhCLEVBUTlCL0wsZ0JBUjhCLENBRGhDO0FBWUE7QUFDRCxLQXJCRDtBQXNCQSxXQUFPOEwsWUFBUDtBQUNBLEdBaENNO0FBa0NQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjQSxNQUFNUSwrQkFBK0IsR0FBRyxVQUN2Q0osUUFEdUMsRUFFdkNLLGdCQUZ1QyxFQUd2Q0MsWUFIdUMsRUFJdkNDLGtCQUp1QyxFQUt2Q0Msc0JBTHVDLEVBTXZDYixrQkFOdUMsRUFPdkNFLGlCQVB1QyxFQVF2Qy9MLGdCQVJ1QyxFQVN2QzJNLG1CQVR1QyxFQVVmO0FBQUE7O0FBQ3hCLFFBQU0zSyxJQUFJLEdBQUd5SyxrQkFBa0IsR0FBR0QsWUFBSCxHQUFrQixlQUFlQSxZQUFoRTtBQUNBLFFBQU03RSxHQUFHLEdBQUcsQ0FBQzhFLGtCQUFrQixHQUFHLGFBQUgsR0FBbUIsWUFBdEMsSUFBc0RHLG1CQUFtQixDQUFDSixZQUFELENBQXJGO0FBQ0EsUUFBTUssNEJBQTRCLEdBQUdDLHFCQUFxQixDQUFDOU0sZ0JBQUQsRUFBbUJrTSxRQUFRLENBQUNoRSxrQkFBNUIsQ0FBMUQ7QUFDQSxRQUFNNkUsUUFBUSxHQUFHLDBCQUFBYixRQUFRLENBQUNuSCxXQUFULDBHQUFzQnlDLEVBQXRCLGtGQUEwQkMsTUFBMUIsTUFBcUMsSUFBdEQ7O0FBQ0EsUUFBTXVGLFNBQWlCLEdBQUdDLGFBQWEsQ0FBQ2YsUUFBUSxDQUFDbEssSUFBVixFQUFnQixJQUFoQixFQUFzQixLQUF0QixDQUF2Qzs7QUFDQSxRQUFNa0wsT0FBZ0IsR0FBR0YsU0FBUyxJQUFJZCxRQUFRLENBQUNsSyxJQUEvQztBQUNBLFFBQU1tTCxnQkFBb0MsR0FBR1IsbUJBQW1CLEdBQUdTLFNBQVMsQ0FBQ1QsbUJBQUQsQ0FBWixHQUFvQzVKLFNBQXBHO0FBQ0EsV0FBTztBQUNONEUsTUFBQUEsR0FBRyxFQUFFQSxHQURDO0FBRU4wRixNQUFBQSxLQUFLLEVBQUVuQixRQUFRLENBQUNtQixLQUZWO0FBR05DLE1BQUFBLFdBQVcsRUFBRXZCLGlCQUFpQixDQUFDd0IsbUJBQWxCLENBQXNDckIsUUFBdEMsQ0FIUDtBQUlOM0osTUFBQUEsSUFBSSxFQUFFM0MsVUFBVSxDQUFDNE4sVUFKWDtBQUtOQyxNQUFBQSxLQUFLLEVBQUVMLFNBQVMsQ0FBQ2xCLFFBQUQsRUFBV2dCLE9BQVgsQ0FMVjtBQU1OUSxNQUFBQSxVQUFVLEVBQUVSLE9BQU8sR0FBR0UsU0FBUyxDQUFDbEIsUUFBRCxDQUFaLEdBQXlCLElBTnRDO0FBT055QixNQUFBQSxLQUFLLEVBQUVULE9BQU8sR0FBR0YsU0FBSCxHQUFlLElBUHZCO0FBUU5oRixNQUFBQSxjQUFjLEVBQUV1RSxnQkFSVjtBQVNOcUIsTUFBQUEsa0JBQWtCLEVBQUVmLDRCQVRkO0FBVU4xTCxNQUFBQSxZQUFZLEVBQUUsQ0FBQ3VMLHNCQUFELElBQTJCSyxRQUEzQixHQUFzQ2MsZ0JBQWdCLENBQUNwRyxNQUF2RCxHQUFnRW9HLGdCQUFnQixDQUFDQyxVQVZ6RjtBQVdOOUwsTUFBQUEsSUFBSSxFQUFFQSxJQVhBO0FBWU53SyxNQUFBQSxZQUFZLEVBQUVBLFlBWlI7QUFhTnVCLE1BQUFBLFFBQVEsRUFBRSxDQUFDaEIsUUFBRCxJQUFhbEIsa0JBQWtCLENBQUNyRyxPQUFuQixDQUEyQmdILFlBQTNCLE1BQTZDLENBQUMsQ0FiL0Q7QUFjTndCLE1BQUFBLGNBQWMsRUFBRTtBQUNmUCxRQUFBQSxLQUFLLEVBQUVOLGdCQUFnQixHQUFHQSxnQkFBZ0IsR0FBRyxLQUFuQixHQUEyQkMsU0FBUyxDQUFDbEIsUUFBRCxDQUF2QyxHQUFvRG5KO0FBRDVEO0FBZFYsS0FBUDtBQWtCQSxHQXBDRDtBQXNDQTs7Ozs7Ozs7O0FBT0EsTUFBTWtMLGNBQWMsR0FBRyxVQUFTN0ssU0FBVCxFQUE0QztBQUNsRSxZQUFRQSxTQUFTLENBQUNDLEtBQWxCO0FBQ0M7QUFDQTtBQUNDLGVBQU8sQ0FBQyxDQUFDRCxTQUFTLENBQUNFLE1BQW5COztBQUNEO0FBQ0E7QUFDQyxlQUFPLEtBQVA7O0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQyxlQUFPLElBQVA7O0FBQ0QsY0FaRCxDQWFDO0FBQ0E7O0FBZEQ7QUFnQkEsR0FqQkQ7QUFtQkE7Ozs7Ozs7OztBQU9BLE1BQU04SixTQUFTLEdBQUcsVUFBU2xCLFFBQVQsRUFBb0c7QUFBQSxRQUE5Q2dCLE9BQThDLHVFQUEzQixLQUEyQjs7QUFDckgsUUFBSSxDQUFDaEIsUUFBTCxFQUFlO0FBQ2QsYUFBT25KLFNBQVA7QUFDQTs7QUFDRCxRQUFJbUwsVUFBVSxDQUFDaEMsUUFBRCxDQUFkLEVBQTBCO0FBQUE7O0FBQ3pCLGFBQU8sMkJBQUFBLFFBQVEsQ0FBQ25ILFdBQVQsNEdBQXNCb0YsTUFBdEIsNEdBQThCZ0UsS0FBOUIsa0ZBQXFDQyxRQUFyQyxPQUFtRGxDLFFBQVEsQ0FBQ2xLLElBQW5FO0FBQ0EsS0FGRCxNQUVPLElBQUlxTSxnQkFBZ0IsQ0FBQ25DLFFBQUQsQ0FBcEIsRUFBZ0M7QUFBQTs7QUFDdEMsVUFBSSxDQUFDLENBQUNnQixPQUFGLElBQWFoQixRQUFRLENBQUM3SSxLQUFULEtBQW1CLHdEQUFwQyxFQUE4RjtBQUM3RixlQUFPNkQsY0FBYyxDQUFDOEIsb0JBQW9CLENBQUNrRCxRQUFRLENBQUNpQyxLQUFWLENBQXJCLENBQXJCO0FBQ0E7O0FBQ0QsYUFBTyxvQkFBQWpDLFFBQVEsQ0FBQ29DLEtBQVQsNkZBQWdCQyxPQUFoQiwwR0FBeUJ4SixXQUF6Qiw0R0FBc0NvRixNQUF0QyxrRkFBOENnRSxLQUE5QyxLQUF1RGpDLFFBQVEsQ0FBQ2lDLEtBQWhFLHlCQUF5RWpDLFFBQVEsQ0FBQ29DLEtBQWxGLDhFQUF5RSxpQkFBZ0JDLE9BQXpGLDBEQUF5RSxzQkFBeUJ2TSxJQUFsRyxDQUFQO0FBQ0EsS0FMTSxNQUtBO0FBQ04sYUFBT2tGLGNBQWMsQ0FBQzhCLG9CQUFvQixDQUFDa0QsUUFBUSxDQUFDaUMsS0FBVixDQUFyQixDQUFyQjtBQUNBO0FBQ0QsR0FkRDtBQWdCQTs7Ozs7Ozs7Ozs7QUFTQSxNQUFNSyxxQkFBcUIsR0FBRyxVQUM3QkMsa0JBRDZCLEVBRTdCQyxlQUY2QixFQUc3QjdDLGtCQUg2QixFQUk3QjdMLGdCQUo2QixFQUs3QitGLFVBTDZCLEVBTUg7QUFDMUIsUUFBTTRJLGNBQXVDLEdBQUcsRUFBaEQ7QUFDQSxRQUFNQyxzQkFBOEMsR0FBRyxFQUF2RDtBQUNBLFFBQU03QyxpQkFBaUIsR0FBRyxJQUFJQyxpQkFBSixDQUFzQmpHLFVBQXRCLEVBQWtDL0YsZ0JBQWxDLENBQTFCO0FBRUEyRCxJQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWTZLLGtCQUFaLEVBQWdDdEosT0FBaEMsQ0FBd0MsVUFBQW5ELElBQUksRUFBSTtBQUFBLGtDQUNoQnlNLGtCQUFrQixDQUFDek0sSUFBRCxDQURGO0FBQUEsVUFDdkN5RCxLQUR1Qyx5QkFDdkNBLEtBRHVDO0FBQUEsVUFDaENvSixXQURnQyx5QkFDaENBLFdBRGdDO0FBQUEsVUFFOUM3RyxjQUY4QyxHQUU3QmhJLGdCQUFnQixDQUFDOE8seUJBQWpCLENBQTJDOU0sSUFBM0MsQ0FGNkI7QUFBQSxVQUk5QytNLGFBSjhDLEdBSTlCTCxlQUFlLENBQUN6SSxJQUFoQixDQUFxQixVQUFBbUcsTUFBTTtBQUFBLGVBQUlBLE1BQU0sQ0FBQ3BLLElBQVAsS0FBZ0JBLElBQXBCO0FBQUEsT0FBM0IsQ0FKOEI7O0FBSy9DLFVBQUkrTSxhQUFhLEtBQUtoTSxTQUF0QixFQUFpQztBQUNoQztBQUNBO0FBQ0E0TCxRQUFBQSxjQUFjLENBQUMvSixJQUFmLENBQ0MwSCwrQkFBK0IsQ0FDOUI3RyxLQUQ4QixFQUU5QnVDLGNBRjhCLEVBRzlCaEcsSUFIOEIsRUFJOUIsSUFKOEIsRUFLOUIsS0FMOEIsRUFNOUI2SixrQkFOOEIsRUFPOUJFLGlCQVA4QixFQVE5Qi9MLGdCQVI4QixFQVM5QjZPLFdBVDhCLENBRGhDO0FBYUEsT0FoQkQsTUFnQk8sSUFBSUUsYUFBYSxDQUFDL0csY0FBZCxLQUFpQ0EsY0FBckMsRUFBcUQ7QUFDM0Q7QUFDQSxZQUFNZ0gsT0FBTyxHQUFHLGVBQWVoTixJQUEvQixDQUYyRCxDQUczRDs7QUFDQSxZQUFJLENBQUMwTSxlQUFlLENBQUN2TCxJQUFoQixDQUFxQixVQUFBaUosTUFBTTtBQUFBLGlCQUFJQSxNQUFNLENBQUNwSyxJQUFQLEtBQWdCZ04sT0FBcEI7QUFBQSxTQUEzQixDQUFMLEVBQThEO0FBQzdEO0FBQ0E7QUFDQUwsVUFBQUEsY0FBYyxDQUFDL0osSUFBZixDQUNDMEgsK0JBQStCLENBQzlCN0csS0FEOEIsRUFFOUJ1QyxjQUY4QixFQUc5QmhHLElBSDhCLEVBSTlCLEtBSjhCLEVBSzlCLEtBTDhCLEVBTTlCNkosa0JBTjhCLEVBTzlCRSxpQkFQOEIsRUFROUIvTCxnQkFSOEIsQ0FEaEM7QUFZQTRPLFVBQUFBLHNCQUFzQixDQUFDNU0sSUFBRCxDQUF0QixHQUErQmdOLE9BQS9CO0FBQ0E7QUFDRDtBQUNELEtBM0NELEVBTDBCLENBa0QxQjtBQUNBOztBQUNBTixJQUFBQSxlQUFlLENBQUN2SixPQUFoQixDQUF3QixVQUFBaUgsTUFBTSxFQUFJO0FBQUE7O0FBQ2pDQSxNQUFBQSxNQUFNLENBQUM2QyxhQUFQLDRCQUF1QjdDLE1BQU0sQ0FBQzZDLGFBQTlCLDBEQUF1QixzQkFBc0JDLEdBQXRCLENBQTBCLFVBQUFDLFlBQVk7QUFBQTs7QUFBQSx3Q0FBSVAsc0JBQXNCLENBQUNPLFlBQUQsQ0FBMUIseUVBQTRDQSxZQUE1QztBQUFBLE9BQXRDLENBQXZCO0FBQ0EsS0FGRDtBQUdBLFdBQU9SLGNBQVA7QUFDQSxHQTlERDtBQWdFQTs7Ozs7Ozs7Ozs7QUFTQSxNQUFNUyx3QkFBd0IsR0FBRyxVQUFTaE0sU0FBVCxFQUE0QztBQUFBOztBQUM1RTtBQUNBLFFBQUlpTCxnQkFBZ0IsQ0FBQ2pMLFNBQUQsQ0FBcEIsRUFBaUM7QUFBQTs7QUFDaEMsaUNBQU9BLFNBQVMsQ0FBQ2tMLEtBQWpCLHFEQUFPLGlCQUFpQmUsSUFBeEI7QUFDQSxLQUZELE1BRU8sSUFBSWpNLFNBQVMsQ0FBQ0MsS0FBVixrRkFBZ0VELFNBQVMsQ0FBQ2tNLE1BQTFFLCtFQUFnRSxrQkFBa0JmLE9BQWxGLG9GQUFnRSxzQkFBMkJELEtBQTNGLDJEQUFnRSx1QkFBa0NlLElBQWxHLENBQUosRUFBNEc7QUFDbEg7QUFDQSxhQUFPak0sU0FBUyxDQUFDa00sTUFBVixDQUFpQmYsT0FBakIsQ0FBeUJELEtBQXpCLENBQStCZSxJQUF0QztBQUNBLEtBSE0sTUFHQTtBQUNOLGFBQU96SCxTQUFTLENBQUNDLHdCQUFWLENBQW1DekUsU0FBbkMsQ0FBUDtBQUNBO0FBQ0QsR0FWRDtBQVlBOzs7Ozs7O0FBS0EsTUFBTW1NLGdCQUFnQixHQUFHLFVBQVNuTSxTQUFULEVBQW9EO0FBQUE7O0FBQzVFLFFBQUlvSixZQUFvQixHQUFHLEVBQTNCOztBQUVBLFlBQVFwSixTQUFTLENBQUNDLEtBQWxCO0FBQ0M7QUFDQTtBQUNDbUosUUFBQUEsWUFBWSxXQUFJcEosU0FBSix1REFBRyxLQUEwQmtMLEtBQTdCLCtDQUFHLFdBQWlDZSxJQUFoRDtBQUNBOztBQUVEO0FBQ0M3QyxRQUFBQSxZQUFZLFlBQUlwSixTQUFKLDBEQUFHLE1BQXVDa00sTUFBMUMsaURBQUcsYUFBK0M3SixLQUE5RDtBQUNBOztBQUVEO0FBQ0E7QUFDQytHLFFBQUFBLFlBQVksR0FBRzVFLFNBQVMsQ0FBQ0Msd0JBQVYsQ0FBbUN6RSxTQUFuQyxDQUFmO0FBQ0E7QUFiRjs7QUFnQkEsV0FBT29KLFlBQVA7QUFDQSxHQXBCRDs7QUFzQkEsTUFBTVMsYUFBYSxHQUFHLFVBQVNvQyxJQUFULEVBQXVCRyxXQUF2QixFQUE2Q0MsVUFBN0MsRUFBa0U7QUFDdkYsUUFBTUMsV0FBVyxHQUFHRixXQUFXLEdBQUdILElBQUksQ0FBQ00sV0FBTCxDQUFpQixHQUFqQixDQUFILEdBQTJCTixJQUFJLENBQUM3SixPQUFMLENBQWEsR0FBYixDQUExRDs7QUFFQSxRQUFJa0ssV0FBVyxLQUFLLENBQUMsQ0FBckIsRUFBd0I7QUFDdkIsYUFBT0wsSUFBUDtBQUNBOztBQUNELFdBQU9JLFVBQVUsR0FBR0osSUFBSSxDQUFDTyxTQUFMLENBQWVGLFdBQVcsR0FBRyxDQUE3QixFQUFnQ0wsSUFBSSxDQUFDbE4sTUFBckMsQ0FBSCxHQUFrRGtOLElBQUksQ0FBQ08sU0FBTCxDQUFlLENBQWYsRUFBa0JGLFdBQWxCLENBQW5FO0FBQ0EsR0FQRDtBQVNBOzs7Ozs7Ozs7O0FBUUEsTUFBTTdPLHlCQUF5QixHQUFHLFVBQ2pDZixrQkFEaUMsRUFFakNDLGlCQUZpQyxFQUdqQ0MsZ0JBSGlDLEVBSWpCO0FBQUE7O0FBQ2hCLFFBQU0rRixVQUFVLEdBQUcvRixnQkFBZ0IsQ0FBQ2lCLHVCQUFqQixDQUF5Q25CLGtCQUF6QyxDQUFuQjtBQUFBLFFBQ0NjLGlCQUEwQyxHQUFHLEVBRDlDO0FBQUEsUUFFQzZOLGtCQUF1RCxHQUFHLEVBRjNEO0FBQUEsUUFHQzVDLGtCQUE0Qiw4Q0FDMUI3TCxnQkFBZ0IsQ0FBQ3VFLFlBQWpCLEVBRDBCLHFGQUMxQix1QkFBaUNRLFdBRFAscUZBQzFCLHVCQUE4Q0MsWUFEcEIscUZBQzFCLHVCQUE0RDZLLGdCQURsQywyREFDMUIsdUJBQ0VDLHFCQUZ3QiwwQ0FDM0IsTUFDaURaLEdBRGpELENBQ3FELFVBQUNoRCxRQUFEO0FBQUEsYUFBNEJBLFFBQVEsQ0FBQ3pHLEtBQXJDO0FBQUEsS0FEckQsQ0FEMkIsdUNBRXlFLEVBTHRHOztBQU9BLFFBQUkzRixrQkFBSixFQUF3QjtBQUN2QjtBQUNBQSxNQUFBQSxrQkFBa0IsQ0FBQ3FGLE9BQW5CLENBQTJCLFVBQUE0SyxRQUFRLEVBQUk7QUFBQTs7QUFDdEMsWUFBSSxDQUFDOUIsY0FBYyxDQUFDOEIsUUFBRCxDQUFuQixFQUErQjtBQUM5QjtBQUNBOztBQUNELFlBQU1sRCw0QkFBNEIsR0FDakN3QixnQkFBZ0IsQ0FBQzBCLFFBQUQsQ0FBaEIsd0JBQThCQSxRQUFRLENBQUN6QixLQUF2Qyw2RUFBOEIsZ0JBQWdCQyxPQUE5QywwREFBOEIsc0JBQXlCckcsa0JBQXZELElBQ0c0RSxxQkFBcUIsQ0FBQzlNLGdCQUFELEVBQW1CK1AsUUFBbkIsQ0FEeEIsR0FFR2hOLFNBSEo7O0FBSUEsWUFBTXlKLFlBQVksR0FBRytDLGdCQUFnQixDQUFDUSxRQUFELENBQXJDLENBUnNDLENBU3RDOzs7QUFDQSxZQUFNQyxxQkFBMEMsR0FBR0Msd0JBQXdCLENBQUNGLFFBQUQsRUFBVy9QLGdCQUFYLENBQTNFO0FBQ0EsWUFBTWtRLG9CQUE4QixHQUFHdk0sTUFBTSxDQUFDQyxJQUFQLENBQVlvTSxxQkFBcUIsQ0FBQ0csVUFBbEMsQ0FBdkM7O0FBQ0EsWUFBTW5ELFNBQWlCLEdBQUdDLGFBQWEsQ0FBQ1QsWUFBRCxFQUFlLElBQWYsRUFBcUIsS0FBckIsQ0FBdkM7O0FBQ0EsWUFBTVUsT0FBZ0IsR0FBR0YsU0FBUyxJQUFJUixZQUF0QztBQUNBNUwsUUFBQUEsaUJBQWlCLENBQUNnRSxJQUFsQixDQUF1QjtBQUN0Qm9ELFVBQUFBLGNBQWMsRUFBRWhJLGdCQUFnQixDQUFDaUksK0JBQWpCLENBQWlEOEgsUUFBUSxDQUFDN0gsa0JBQTFELENBRE07QUFFdEIwRixVQUFBQSxrQkFBa0IsRUFBRWYsNEJBRkU7QUFHdEJ0SyxVQUFBQSxJQUFJLEVBQUUzQyxVQUFVLENBQUM0TixVQUhLO0FBSXRCN0YsVUFBQUEsR0FBRyxFQUFFQyxTQUFTLENBQUNDLHdCQUFWLENBQW1Da0ksUUFBbkMsQ0FKaUI7QUFLdEI3TyxVQUFBQSxLQUFLLEVBQUUsMEJBQUE2TyxRQUFRLENBQUNoTCxXQUFULDBHQUFzQnFMLEtBQXRCLDRHQUE2QkMsV0FBN0Isa0ZBQTBDblAsS0FBMUMsS0FBbUQ2QixTQUxwQztBQU10QjVCLFVBQUFBLFlBQVksRUFBRW1QLHVCQUF1QixDQUFDUCxRQUFELENBQXZCLEdBQW9DbEMsZ0JBQWdCLENBQUNwRyxNQUFyRCxHQUE4RG9HLGdCQUFnQixDQUFDMEMsT0FOdkU7QUFPdEJ0QixVQUFBQSxhQUFhLEVBQUVpQixvQkFBb0IsQ0FBQy9OLE1BQXJCLEdBQThCLENBQTlCLEdBQWtDK04sb0JBQWxDLEdBQXlEbk4sU0FQbEQ7QUFRdEJmLFVBQUFBLElBQUksRUFBRW9OLHdCQUF3QixDQUFDVyxRQUFELENBUlI7QUFTdEJyQyxVQUFBQSxVQUFVLEVBQUVSLE9BQU8sR0FBR0UsU0FBUyxDQUFDMkMsUUFBRCxDQUFaLEdBQXlCLElBVHRCO0FBVXRCcEMsVUFBQUEsS0FBSyxFQUFFVCxPQUFPLEdBQUdGLFNBQUgsR0FBZSxJQVZQO0FBV3RCUyxVQUFBQSxLQUFLLEVBQUVMLFNBQVMsQ0FBQzJDLFFBQUQsRUFBVzdDLE9BQVgsQ0FYTTtBQVl0QlYsVUFBQUEsWUFBWSxFQUFFQSxZQVpRO0FBYXRCaE0sVUFBQUEsV0FBVyxFQUFFLElBYlM7QUFjdEJ1TixVQUFBQSxRQUFRLEVBQUVnQyxRQUFRLENBQUMxTSxLQUFULCtDQUFrRHdJLGtCQUFrQixDQUFDckcsT0FBbkIsQ0FBMkJnSCxZQUEzQixNQUE2QyxDQUFDLENBZHBGO0FBZXRCd0IsVUFBQUEsY0FBYyxFQUFFO0FBQ2Z3QyxZQUFBQSxRQUFRLEVBQUVSLHFCQUFxQixDQUFDUztBQURqQjtBQWZNLFNBQXZCLEVBZHNDLENBa0N0Qzs7QUFDQVAsUUFBQUEsb0JBQW9CLENBQUMvSyxPQUFyQixDQUE2QixVQUFBbkQsSUFBSSxFQUFJO0FBQ3BDeU0sVUFBQUEsa0JBQWtCLENBQUN6TSxJQUFELENBQWxCLEdBQTJCZ08scUJBQXFCLENBQUNHLFVBQXRCLENBQWlDbk8sSUFBakMsQ0FBM0I7QUFDQSxTQUZEO0FBR0EsT0F0Q0Q7QUF1Q0EsS0FqRGUsQ0FtRGhCOzs7QUFDQSxRQUFJOEosWUFBWSxHQUFHOUksd0JBQXdCLENBQUMrQyxVQUFELEVBQWFuRixpQkFBYixFQUFnQ2lMLGtCQUFoQyxFQUFvRDdMLGdCQUFwRCxDQUEzQztBQUNBOEwsSUFBQUEsWUFBWSxHQUFHQSxZQUFZLENBQUM0RSxNQUFiLENBQW9COVAsaUJBQXBCLENBQWYsQ0FyRGdCLENBdURoQjs7QUFDQSxRQUFNK04sY0FBYyxHQUFHSCxxQkFBcUIsQ0FBQ0Msa0JBQUQsRUFBcUIzQyxZQUFyQixFQUFtQ0Qsa0JBQW5DLEVBQXVEN0wsZ0JBQXZELEVBQXlFK0YsVUFBekUsQ0FBNUM7O0FBQ0ErRixJQUFBQSxZQUFZLEdBQUdBLFlBQVksQ0FBQzRFLE1BQWIsQ0FBb0IvQixjQUFwQixDQUFmO0FBRUEsV0FBTzdDLFlBQVA7QUFDQSxHQWhFRDtBQWtFQTs7Ozs7Ozs7Ozs7QUFTQSxNQUFNNkUsaUJBQWlCLEdBQUcsVUFDekJSLFVBRHlCLEVBRXpCdlAsaUJBRnlCLEVBR3pCWixnQkFIeUIsRUFJekIrRixVQUp5QixFQUtGO0FBQ3ZCLFFBQUk2SyxpQkFBSjs7QUFFQSxRQUFJVCxVQUFKLEVBQWdCO0FBQ2ZTLE1BQUFBLGlCQUFpQixHQUFHVCxVQUFVLENBQUNqQixHQUFYLENBQWUsVUFBUzJCLFlBQVQsRUFBdUI7QUFDekQsWUFBTUMsZ0JBQWdCLEdBQUdsUSxpQkFBaUIsQ0FBQ3FGLElBQWxCLENBQXVCLFVBQVM2SyxnQkFBVCxFQUEyQjtBQUMxRSxpQkFBT0EsZ0JBQWdCLENBQUN0RSxZQUFqQixLQUFrQ3FFLFlBQWxDLElBQWtEQyxnQkFBZ0IsQ0FBQzdCLGFBQWpCLEtBQW1DbE0sU0FBNUY7QUFDQSxTQUZ3QixDQUF6Qjs7QUFHQSxZQUFJK04sZ0JBQUosRUFBc0I7QUFDckIsaUJBQU9BLGdCQUFnQixDQUFDOU8sSUFBeEI7QUFDQSxTQUZELE1BRU87QUFDTixjQUFNMk0sY0FBYyxHQUFHSCxxQkFBcUIscUJBQ3hDcUMsWUFEd0MsRUFDekI7QUFBRXBMLFlBQUFBLEtBQUssRUFBRU0sVUFBVSxDQUFDZ0wsV0FBWCxDQUF1QkYsWUFBdkI7QUFBVCxXQUR5QixHQUUzQ2pRLGlCQUYyQyxFQUczQyxFQUgyQyxFQUkzQ1osZ0JBSjJDLEVBSzNDK0YsVUFMMkMsQ0FBNUM7O0FBT0FuRixVQUFBQSxpQkFBaUIsQ0FBQ2dFLElBQWxCLENBQXVCK0osY0FBYyxDQUFDLENBQUQsQ0FBckM7QUFDQSxpQkFBT0EsY0FBYyxDQUFDLENBQUQsQ0FBZCxDQUFrQjNNLElBQXpCO0FBQ0E7QUFDRCxPQWpCbUIsQ0FBcEI7QUFrQkE7O0FBRUQsV0FBTzRPLGlCQUFQO0FBQ0EsR0E5QkQ7QUFnQ0E7Ozs7Ozs7Ozs7O0FBU0EsTUFBTTdQLHNCQUFzQixHQUFHLFVBQzlCQyxPQUQ4QixFQUU5QkosaUJBRjhCLEVBRzlCWixnQkFIOEIsRUFJOUIrRixVQUo4QixFQUs5QjlGLGtCQUw4QixFQU1DO0FBQy9CLFFBQU0rUSxlQUE2QyxHQUFHLEVBQXREOztBQUVBLFNBQUssSUFBTXJKLEdBQVgsSUFBa0IzRyxPQUFsQixFQUEyQjtBQUFBOztBQUMxQixVQUFNaVEsY0FBYyxHQUFHalEsT0FBTyxDQUFDMkcsR0FBRCxDQUE5QjtBQUVBQyxNQUFBQSxTQUFTLENBQUNzSixXQUFWLENBQXNCdkosR0FBdEI7QUFFQXFKLE1BQUFBLGVBQWUsQ0FBQ3JKLEdBQUQsQ0FBZixHQUF1QjtBQUN0QkEsUUFBQUEsR0FBRyxFQUFFQSxHQURpQjtBQUV0QndKLFFBQUFBLEVBQUUsRUFBRSxtQkFBbUJ4SixHQUZEO0FBR3RCM0YsUUFBQUEsSUFBSSxFQUFFLG1CQUFtQjJGLEdBSEg7QUFJdEJ5SixRQUFBQSxNQUFNLEVBQUVILGNBQWMsQ0FBQ0csTUFKRDtBQUt0QmxRLFFBQUFBLEtBQUssRUFBRStQLGNBQWMsQ0FBQy9QLEtBQWYsSUFBd0I2QixTQUxUO0FBTXRCc08sUUFBQUEsZUFBZSxFQUFFSixjQUFjLENBQUNJLGVBQWYsS0FBbUN0TyxTQUFuQyxHQUErQ3VPLGVBQWUsQ0FBQ0MsS0FBL0QsR0FBdUVOLGNBQWMsQ0FBQ0ksZUFOakY7QUFPdEI5TyxRQUFBQSxJQUFJLEVBQUUzQyxVQUFVLENBQUMyUSxPQVBLO0FBUXRCcFAsUUFBQUEsWUFBWSxFQUFFOFAsY0FBYyxDQUFDOVAsWUFBZixJQUErQjBNLGdCQUFnQixDQUFDMEMsT0FSeEM7QUFTdEJDLFFBQUFBLFFBQVEsRUFBRVMsY0FBYyxDQUFDVCxRQUFmLElBQTJCLFdBVGY7QUFVdEJnQixRQUFBQSxRQUFRLEVBQUU7QUFDVEMsVUFBQUEsTUFBTSwyQkFBRVIsY0FBYyxDQUFDTyxRQUFqQiwwREFBRSxzQkFBeUJDLE1BRHhCO0FBRVRDLFVBQUFBLFNBQVMsRUFBRVQsY0FBYyxDQUFDTyxRQUFmLEtBQTRCek8sU0FBNUIsR0FBd0M0TyxTQUFTLENBQUNDLEtBQWxELEdBQTBEWCxjQUFjLENBQUNPLFFBQWYsQ0FBd0JFO0FBRnBGLFNBVlk7QUFjdEJsUixRQUFBQSxXQUFXLEVBQUVxUixpQkFBaUIsQ0FBQ1osY0FBRCxFQUFpQmhSLGtCQUFqQixFQUFxQyxJQUFyQyxDQWRSO0FBZXRCbUIsUUFBQUEsUUFBUSxFQUFFNlAsY0FBYyxDQUFDN1AsUUFmSDtBQWdCdEIyTSxRQUFBQSxRQUFRLEVBQUUsS0FoQlk7QUFpQnRCa0IsUUFBQUEsYUFBYSxFQUFFMEIsaUJBQWlCLENBQUNNLGNBQWMsQ0FBQ2QsVUFBaEIsRUFBNEJ2UCxpQkFBNUIsRUFBK0NaLGdCQUEvQyxFQUFpRStGLFVBQWpFO0FBakJWLE9BQXZCO0FBbUJBOztBQUNELFdBQU9pTCxlQUFQO0FBQ0EsR0FuQ0Q7O0FBcUNPLFdBQVNjLFdBQVQsQ0FBcUIvUixpQkFBckIsRUFBZ0RDLGdCQUFoRCxFQUF3RztBQUM5RyxRQUFNK1IsZUFBZ0MsR0FBRy9SLGdCQUFnQixDQUFDcUMsa0JBQWpCLEVBQXpDO0FBQ0EsUUFBTW9FLHFCQUFpRCxHQUFHekcsZ0JBQWdCLENBQUNNLCtCQUFqQixDQUFpRFAsaUJBQWpELENBQTFEO0FBQ0EsUUFBTWlTLGlCQUF3QyxHQUFHRCxlQUFlLENBQUNFLG9CQUFoQixFQUFqRDtBQUNBLFFBQU1DLG9CQUE2QixHQUFHLENBQUMsTUFBRCxFQUFTLFNBQVQsRUFBb0IxTSxPQUFwQixDQUE0QndNLGlCQUE1QixJQUFpRCxDQUFDLENBQXhGO0FBQ0EsUUFBTUcsZ0JBQTBCLEdBQUcsRUFBbkM7O0FBQ0EsUUFBSUQsb0JBQUosRUFBMEI7QUFBQTs7QUFDekIsVUFBSSxDQUFBekwscUJBQXFCLFNBQXJCLElBQUFBLHFCQUFxQixXQUFyQixzQ0FBQUEscUJBQXFCLENBQUVFLGFBQXZCLGtGQUFzQ3lMLGVBQXRDLE1BQTBEclAsU0FBOUQsRUFBeUU7QUFDeEU7QUFDQSxZQUFNcVAsZUFBb0IsR0FBRzNMLHFCQUFxQixDQUFDRSxhQUF0QixDQUFvQ3lMLGVBQWpFOztBQUNBLFlBQUlBLGVBQWUsS0FBSyxJQUF4QixFQUE4QjtBQUM3QjtBQUNBLGlCQUFPLG9CQUFQO0FBQ0EsU0FIRCxNQUdPLElBQUksT0FBT0EsZUFBUCxLQUEyQixRQUEvQixFQUF5QztBQUMvQztBQUNBLGNBQUlBLGVBQWUsQ0FBQ0MsSUFBcEIsRUFBMEI7QUFDekJGLFlBQUFBLGdCQUFnQixDQUFDdk4sSUFBakIsQ0FBc0IsTUFBdEI7QUFDQTs7QUFDRCxjQUFJd04sZUFBZSxDQUFDaEcsTUFBcEIsRUFBNEI7QUFDM0IrRixZQUFBQSxnQkFBZ0IsQ0FBQ3ZOLElBQWpCLENBQXNCLFFBQXRCO0FBQ0E7O0FBQ0QsY0FBSXdOLGVBQWUsQ0FBQ0UsTUFBcEIsRUFBNEI7QUFDM0JILFlBQUFBLGdCQUFnQixDQUFDdk4sSUFBakIsQ0FBc0IsUUFBdEI7QUFDQTs7QUFDRCxpQkFBT3VOLGdCQUFnQixDQUFDaFEsTUFBakIsR0FBMEIsQ0FBMUIsR0FBOEJnUSxnQkFBZ0IsQ0FBQ0ksSUFBakIsQ0FBc0IsR0FBdEIsQ0FBOUIsR0FBMkR4UCxTQUFsRTtBQUNBO0FBQ0QsT0FuQkQsTUFtQk87QUFDTjtBQUNBb1AsUUFBQUEsZ0JBQWdCLENBQUN2TixJQUFqQixDQUFzQixNQUF0QjtBQUNBdU4sUUFBQUEsZ0JBQWdCLENBQUN2TixJQUFqQixDQUFzQixRQUF0Qjs7QUFDQSxZQUFJb04saUJBQWlCLEtBQUtRLHFCQUFxQixDQUFDQyxPQUFoRCxFQUF5RDtBQUN4RDtBQUNBO0FBQ0FOLFVBQUFBLGdCQUFnQixDQUFDdk4sSUFBakIsQ0FBc0IsUUFBdEI7QUFDQTs7QUFDRCxlQUFPdU4sZ0JBQWdCLENBQUNJLElBQWpCLENBQXNCLEdBQXRCLENBQVA7QUFDQTtBQUNEOztBQUNELFdBQU94UCxTQUFQO0FBQ0E7Ozs7QUFFRCxXQUFTMlAsZUFBVCxDQUF5QnBPLGdCQUF6QixFQUFrRXFPLGNBQWxFLEVBQTBGO0FBQ3pGLFFBQUlDLGNBQW1CLEdBQUcsS0FBMUI7O0FBQ0EsUUFBSXRPLGdCQUFnQixJQUFJcU8sY0FBeEIsRUFBd0M7QUFBQTs7QUFDdkM7QUFDQSxVQUFNRSxzQkFBc0IsNEJBQUd2TyxnQkFBZ0IsQ0FBQzZCLHlCQUFqQixDQUEyQ3dNLGNBQTNDLENBQUgsb0ZBQUcsc0JBQTRENU4sV0FBL0QscUZBQUcsdUJBQXlFeUMsRUFBNUUsMkRBQUcsdUJBQTZFc0wsWUFBNUc7O0FBQ0EsVUFBSUQsc0JBQXNCLElBQUtBLHNCQUFELENBQWdDeEQsSUFBOUQsRUFBb0U7QUFDbkUsWUFBS3dELHNCQUFELENBQWdDeEQsSUFBaEMsQ0FBcUM3SixPQUFyQyxDQUE2QyxHQUE3QyxJQUFvRCxDQUF4RCxFQUEyRDtBQUMxRCxjQUFNdU4sZ0JBQWdCLEdBQUlGLHNCQUFELENBQWdDeEQsSUFBaEMsQ0FBcUNuTCxLQUFyQyxDQUEyQyxHQUEzQyxDQUF6QjtBQUNBLGNBQU04TyxlQUFlLEdBQUdELGdCQUFnQixDQUFDLENBQUQsQ0FBeEM7QUFDQSxjQUFNRSxXQUFXLEdBQUkzTyxnQkFBRCxDQUEwQnlCLFVBQTFCLENBQXFDQyxvQkFBckMsQ0FBMERDLElBQTFELENBQ25CLFVBQUNpTixXQUFEO0FBQUEsbUJBQXNCQSxXQUFXLENBQUNsUixJQUFaLEtBQXFCMlEsY0FBM0M7QUFBQSxXQURtQixFQUVsQlEsT0FGRjs7QUFHQSxjQUFJRixXQUFXLEtBQUtELGVBQXBCLEVBQXFDO0FBQ3BDSixZQUFBQSxjQUFjLEdBQUdDLHNCQUFqQjtBQUNBO0FBQ0QsU0FURCxNQVNPO0FBQ05ELFVBQUFBLGNBQWMsR0FBRyxLQUFqQjtBQUNBO0FBQ0QsT0FiRCxNQWFPO0FBQ05BLFFBQUFBLGNBQWMsR0FBR0Msc0JBQWpCO0FBQ0E7QUFDRCxLQW5CRCxNQW1CTztBQUFBOztBQUNORCxNQUFBQSxjQUFjLEdBQUd0TyxnQkFBZ0IsK0JBQUlBLGdCQUFnQixDQUFDUyxXQUFyQixxRkFBSSx1QkFBOEJ5QyxFQUFsQywyREFBSSx1QkFBa0NzTCxZQUF0QyxDQUFqQztBQUNBOztBQUNELFdBQU9GLGNBQVA7QUFDQTtBQUVEOzs7Ozs7OztBQU9PLFdBQVNRLGdCQUFULENBQ05wVCxnQkFETSxFQUVOMlMsY0FGTSxFQUdOVSxpQkFITSxFQUl1QjtBQUM3QixRQUFNL08sZ0JBQWdCLEdBQUd0RSxnQkFBZ0IsQ0FBQ3VFLFlBQWpCLEVBQXpCO0FBQ0EsUUFBTXFPLGNBQW1CLEdBQUdGLGVBQWUsQ0FBQ3BPLGdCQUFELEVBQW1CcU8sY0FBbkIsQ0FBM0M7QUFDQSxRQUFJL0wsaUJBQUosRUFBdUJDLHdCQUF2Qjs7QUFDQSxRQUFJN0csZ0JBQWdCLENBQUM4RyxlQUFqQixPQUF1Q0MsWUFBWSxDQUFDQyxVQUF4RCxFQUFvRTtBQUNuRUosTUFBQUEsaUJBQWlCLEdBQUdLLGVBQWUsQ0FBQ2pILGdCQUFnQixDQUFDNkIsc0JBQWpCLEVBQUQsRUFBNEM4USxjQUE1QyxDQUFuQztBQUNBOUwsTUFBQUEsd0JBQXdCLEdBQUdELGlCQUFpQixHQUFHTSxjQUFjLENBQUNOLGlCQUFELENBQWpCLEdBQXVDQSxpQkFBbkY7QUFDQSxLQVA0QixDQVE3Qjs7O0FBQ0EsUUFBSUMsd0JBQXdCLEtBQUssT0FBakMsRUFBMEM7QUFDekMsYUFBTyxLQUFQO0FBQ0EsS0FGRCxNQUVPLElBQUlBLHdCQUF3QixJQUFJK0wsY0FBYyxLQUFLLElBQW5ELEVBQXlEO0FBQy9EO0FBQ0EsVUFBSUEsY0FBSixFQUFvQjtBQUNuQixlQUFPLFlBQVlELGNBQWMsR0FBR0EsY0FBYyxHQUFHLEdBQXBCLEdBQTBCLEVBQXBELElBQTBEQyxjQUFjLENBQUN2RCxJQUF6RSxHQUFnRixzQ0FBdkY7QUFDQSxPQUZELE1BRU87QUFDTixlQUFPLG9DQUFQO0FBQ0E7QUFDRCxLQVBNLE1BT0EsSUFBSXVELGNBQWMsS0FBSyxJQUFuQixJQUEyQixDQUFDUyxpQkFBNUIsSUFBaURyVCxnQkFBZ0IsQ0FBQzhHLGVBQWpCLE9BQXVDQyxZQUFZLENBQUN1TSxrQkFBekcsRUFBNkg7QUFDbkksYUFBTyxLQUFQO0FBQ0EsS0FGTSxNQUVBLElBQUl0VCxnQkFBZ0IsQ0FBQzhHLGVBQWpCLE9BQXVDQyxZQUFZLENBQUN3TSxVQUF4RCxFQUFvRTtBQUMxRSxVQUFJWCxjQUFKLEVBQW9CO0FBQ25CLGVBQU8sWUFBWUQsY0FBYyxHQUFHQSxjQUFjLEdBQUcsR0FBcEIsR0FBMEIsRUFBcEQsSUFBMERDLGNBQWMsQ0FBQ3ZELElBQXpFLEdBQWdGLHNDQUF2RjtBQUNBLE9BRkQsTUFFTztBQUNOLGVBQU8sb0NBQVA7QUFDQTtBQUNELEtBTk0sTUFNQTtBQUNOLGFBQU8sSUFBUDtBQUNBO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7QUFRTyxXQUFTbUUsZ0JBQVQsQ0FDTnhULGdCQURNLEVBRU53SyxZQUZNLEVBR05pSixZQUhNLEVBSWdCO0FBQUE7O0FBQ3RCLFFBQU1uUCxnQkFBZ0IsR0FBR3RFLGdCQUFnQixDQUFDdUUsWUFBakIsRUFBekI7QUFDQSxRQUFNbVAsbUJBQW1CLEdBQUcxVCxnQkFBZ0IsQ0FBQzZCLHNCQUFqQixFQUE1QjtBQUNBLFFBQU04UixjQUFtQyxHQUFHclAsZ0JBQWdCLEdBQ3pEMEUsb0JBQW9CLENBQ3BCLENBQUMxRSxnQkFBRCxhQUFDQSxnQkFBRCxpREFBQ0EsZ0JBQWdCLENBQUVTLFdBQWxCLENBQThCeUMsRUFBL0IsMkRBQUMsdUJBQWtDb00sWUFBbkMsS0FBd0YsS0FEcEUsRUFFcEJGLG1CQUFtQixDQUFDMU4sb0JBQXBCLENBQXlDa0osR0FBekMsQ0FBNkMsVUFBQXBKLE9BQU87QUFBQSxhQUFJQSxPQUFPLENBQUM5RCxJQUFaO0FBQUEsS0FBcEQsQ0FGb0IsQ0FEcUMsR0FLekQ2UixRQUFRLENBQUMsS0FBRCxDQUxYLENBSHNCLENBU3RCO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFFBQU1DLGFBQXdDLEdBQUd4UCxnQkFBSCxhQUFHQSxnQkFBSCxrREFBR0EsZ0JBQWdCLENBQUVTLFdBQWxCLENBQThCb0YsTUFBakMsdUZBQUcsd0JBQXNDQyxTQUF6Qyw0REFBRyx3QkFBaURDLFNBQWxHO0FBQ0EsUUFBTTBKLHNCQUFzQixHQUFHRCxhQUFhLEdBQ3pDOUssb0JBQW9CLENBQUNoSixnQkFBRCxhQUFDQSxnQkFBRCxpREFBQ0EsZ0JBQWdCLENBQUVpRCxhQUFsQixHQUFrQzFDLE9BQWxDLENBQTBDdVQsYUFBMUMsRUFBeUQvTyxXQUExRCxxRkFBQyx1QkFBc0VpUCxJQUF2RSwyREFBQyx1QkFBNEVDLGtCQUE3RSxFQUFpRyxFQUFqRyxFQUFxRyxJQUFyRyxDQURxQixHQUV6Q2xSLFNBRkgsQ0Fkc0IsQ0FrQnRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxXQUFPa0csTUFBTSxDQUNaaUwsRUFBRSxDQUNEQSxFQUFFLENBQ0RDLEtBQUssQ0FBQ0osc0JBQUQsRUFBeUIsS0FBekIsQ0FESixFQUVESyxHQUFHLENBQUNDLFVBQVUsQ0FBQ1osWUFBRCxDQUFYLEVBQTJCVSxLQUFLLENBQUNWLFlBQUQsRUFBZSxLQUFmLENBQWhDLEVBQXVEVSxLQUFLLENBQUNKLHNCQUFELEVBQXlCaFIsU0FBekIsQ0FBNUQsQ0FGRixDQURELEVBS0RzUixVQUFVLENBQUNWLGNBQUQsQ0FBVixJQUE4QlEsS0FBSyxDQUFDUixjQUFELEVBQWlCLElBQWpCLENBTGxDLEVBTUQzVCxnQkFBZ0IsQ0FBQzhHLGVBQWpCLE9BQXVDQyxZQUFZLENBQUN1TSxrQkFObkQsQ0FEVSxFQVNaLEtBVFksRUFVWnJLLE1BQU0sQ0FDTGlMLEVBQUUsQ0FBQzFKLFlBQVksS0FBSyxVQUFsQixFQUE4QnhLLGdCQUFnQixDQUFDOEcsZUFBakIsT0FBdUNDLFlBQVksQ0FBQ3dNLFVBQWxGLENBREcsRUFFTCxJQUZLLEVBR0xhLEdBQUcsQ0FBQ0UsR0FBRyxDQUFDWCxjQUFELENBQUosRUFBc0JuTSxFQUFFLENBQUMrTSxVQUF6QixDQUhFLENBVk0sQ0FBYjtBQWdCQTtBQUVEOzs7Ozs7Ozs7OztBQVFPLFdBQVNDLGVBQVQsQ0FDTnhVLGdCQURNLEVBRU55VSxpQkFGTSxFQUdOaEIsWUFITSxFQUlnQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQU94SyxNQUFNLENBQ1prTCxLQUFLLENBQUNYLGdCQUFnQixDQUFDeFQsZ0JBQUQsRUFBbUJ5VSxpQkFBaUIsQ0FBQzNLLElBQXJDLEVBQTJDMkosWUFBM0MsQ0FBakIsRUFBMkUsSUFBM0UsQ0FETyxFQUVaelQsZ0JBQWdCLENBQUM4RyxlQUFqQixPQUF1Q0MsWUFBWSxDQUFDQyxVQUFwRCxJQUFrRXlNLFlBRnRELEVBR1osS0FIWSxDQUFiO0FBS0E7QUFFRDs7Ozs7Ozs7Ozs7QUFPQSxXQUFTaUIsaUJBQVQsQ0FDQ3BULDZCQURELEVBRUNOLE9BRkQsRUFHc0I7QUFDckIsUUFBSTJULGNBQUo7O0FBQ0EsUUFBSXJULDZCQUFKLGFBQUlBLDZCQUFKLHVCQUFJQSw2QkFBNkIsQ0FBRXNULFNBQW5DLEVBQThDO0FBQzdDLFVBQU1DLE9BQXFCLEdBQUcsRUFBOUI7QUFDQSxVQUFNQyxVQUFVLEdBQUc7QUFDbEJELFFBQUFBLE9BQU8sRUFBRUE7QUFEUyxPQUFuQjtBQUdBdlQsTUFBQUEsNkJBQTZCLENBQUNzVCxTQUE5QixDQUF3Q3pQLE9BQXhDLENBQWdELFVBQUE0UCxTQUFTLEVBQUk7QUFBQTs7QUFDNUQsWUFBTUMsWUFBWSxZQUFJRCxTQUFTLENBQUNFLFFBQWQsMkRBQUcsTUFBc0MxRyxPQUF6QyxrREFBRyxjQUErQ3ZNLElBQXBFO0FBQ0EsWUFBTWtULFVBQVUsR0FBR2xVLE9BQU8sQ0FBQ2lGLElBQVIsQ0FBYSxVQUFBbUcsTUFBTTtBQUFBLGlCQUFJQSxNQUFNLENBQUNwSyxJQUFQLEtBQWdCZ1QsWUFBcEI7QUFBQSxTQUFuQixDQUFuQjtBQUNBRSxRQUFBQSxVQUFVLFNBQVYsSUFBQUEsVUFBVSxXQUFWLHFDQUFBQSxVQUFVLENBQUVqRyxhQUFaLGdGQUEyQjlKLE9BQTNCLENBQW1DLFVBQUFnUSxtQkFBbUIsRUFBSTtBQUN6RDtBQUNBTCxVQUFBQSxVQUFVLENBQUNELE9BQVgsQ0FBbUJqUSxJQUFuQixDQUF3QjtBQUN2QjVDLFlBQUFBLElBQUksRUFBRW1ULG1CQURpQjtBQUV2QkMsWUFBQUEsVUFBVSxFQUFFLENBQUMsQ0FBQ0wsU0FBUyxDQUFDTTtBQUZELFdBQXhCO0FBSUEsU0FORDs7QUFRQSxZQUFJLEVBQUNILFVBQUQsYUFBQ0EsVUFBRCxpREFBQ0EsVUFBVSxDQUFFakcsYUFBYiwyREFBQyx1QkFBMkI5TSxNQUE1QixDQUFKLEVBQXdDO0FBQ3ZDO0FBQ0EyUyxVQUFBQSxVQUFVLENBQUNELE9BQVgsQ0FBbUJqUSxJQUFuQixDQUF3QjtBQUN2QjVDLFlBQUFBLElBQUksRUFBRWdULFlBRGlCO0FBRXZCSSxZQUFBQSxVQUFVLEVBQUUsQ0FBQyxDQUFDTCxTQUFTLENBQUNNO0FBRkQsV0FBeEI7QUFJQTtBQUNELE9BbEJEO0FBbUJBVixNQUFBQSxjQUFjLEdBQUdHLFVBQVUsQ0FBQ0QsT0FBWCxDQUFtQjFTLE1BQW5CLEdBQTRCbVQsSUFBSSxDQUFDQyxTQUFMLENBQWVULFVBQWYsQ0FBNUIsR0FBeUQvUixTQUExRTtBQUNBOztBQUNELFdBQU80UixjQUFQO0FBQ0E7O0FBRU0sV0FBU2hTLCtCQUFULENBQ043QyxrQkFETSxFQUVOQyxpQkFGTSxFQUdOQyxnQkFITSxFQUlOd0osMEJBSk0sRUFLTnhJLE9BTE0sRUFNTk0sNkJBTk0sRUFPeUI7QUFBQTs7QUFDL0I7QUFEK0Isc0JBRUlJLFNBQVMsQ0FBQzNCLGlCQUFELENBRmI7QUFBQSxRQUV2QjRCLHNCQUZ1QixlQUV2QkEsc0JBRnVCOztBQUcvQixRQUFNNlQsS0FBVSw2QkFBR3hWLGdCQUFnQixDQUFDNkIsc0JBQWpCLEdBQTBDbUksZ0JBQTFDLENBQTJEakYsV0FBOUQscUZBQUcsdUJBQXdFeUMsRUFBM0Usc0ZBQUcsdUJBQTRFaU8sVUFBL0UsNERBQUcsd0JBQXdGQyxjQUEzRztBQUNBLFFBQU1DLFNBQVMsR0FBRzNWLGdCQUFnQixDQUFDNkIsc0JBQWpCLEdBQTBDSSxpQkFBNUQ7QUFDQSxRQUFNMlQsb0JBQXFDLEdBQUc1VixnQkFBZ0IsQ0FBQ3FDLGtCQUFqQixFQUE5QztBQUNBLFFBQU1ILFdBQW9CLEdBQUdQLHNCQUFzQixDQUFDUSxNQUF2QixLQUFrQyxDQUEvRDtBQUFBLFFBQ0MwVCxRQUE0QixHQUFHL0QsV0FBVyxDQUFDL1IsaUJBQUQsRUFBb0JDLGdCQUFwQixDQUQzQztBQUFBLFFBRUNtUixFQUFFLEdBQUdqUCxXQUFXLElBQUl5VCxTQUFmLEdBQTJCRyxPQUFPLENBQUNILFNBQVMsQ0FBQzNULElBQVgsRUFBaUIsVUFBakIsQ0FBbEMsR0FBaUU4VCxPQUFPLENBQUMvVixpQkFBRCxDQUY5RTtBQUdBLFFBQU11RyxrQkFBa0IsR0FBR3RDLHdCQUF3QixDQUFDakUsaUJBQUQsRUFBb0JDLGdCQUFnQixDQUFDK1Ysc0JBQWpCLENBQXdDSixTQUF4QyxDQUFwQixDQUFuRDtBQUNBLFFBQU1qUCxhQUFhLEdBQUdMLGdCQUFnQixDQUFDdkcsa0JBQUQsRUFBcUJDLGlCQUFyQixFQUF3Q0MsZ0JBQXhDLEVBQTBEa0MsV0FBMUQsRUFBdUVvRSxrQkFBdkUsQ0FBdEM7QUFDQSxRQUFJMFAsU0FBUyxHQUFHOVQsV0FBVyxHQUFHLEVBQUgsR0FBUSxFQUFuQzs7QUFDQSxRQUFJWiw2QkFBSixhQUFJQSw2QkFBSix1QkFBSUEsNkJBQTZCLENBQUUyVSxRQUFuQyxFQUE2QztBQUM1Q0QsTUFBQUEsU0FBUyxHQUFHMVUsNkJBQTZCLENBQUMyVSxRQUExQztBQUNBOztBQUVELFFBQU03VCwwQkFBMEIsR0FBR0YsV0FBVyxJQUFJeVQsU0FBZixHQUEyQkEsU0FBUyxDQUFDM1QsSUFBckMsR0FBNENMLHNCQUEvRTtBQUNBLFFBQU0xQixrQkFBa0IsR0FBRzJWLG9CQUFvQixDQUFDdFQsMEJBQXJCLENBQWdERiwwQkFBaEQsQ0FBM0I7O0FBQ0EsUUFBTXFTLGlCQUFpQixHQUFHbEwscUJBQXFCLENBQUN6SixrQkFBRCxFQUFxQjBKLDBCQUFyQixFQUFpRHhKLGdCQUFqRCxFQUFtRUMsa0JBQW5FLENBQS9DOztBQUNBLFFBQUkyRyxpQkFBSixFQUE0QkMsd0JBQTVCOztBQUNBLFFBQUk3RyxnQkFBZ0IsQ0FBQzhHLGVBQWpCLE9BQXVDQyxZQUFZLENBQUNDLFVBQXhELEVBQW9FO0FBQUE7O0FBQ25FSixNQUFBQSxpQkFBaUIsR0FBR0ssZUFBZSxDQUFDakgsZ0JBQWdCLENBQUM2QixzQkFBakIsRUFBRCxFQUE0Q2tCLFNBQTVDLEVBQXVELElBQXZELENBQW5DOztBQUNBLGdDQUFJNkQsaUJBQUosdURBQUksbUJBQW1Cc1Asd0JBQXZCLEVBQWlEO0FBQ2hEclAsUUFBQUEsd0JBQXdCLEdBQUc5RCxTQUEzQjtBQUNBLE9BRkQsTUFFTztBQUNOOEQsUUFBQUEsd0JBQXdCLEdBQUdELGlCQUFpQixHQUFHTSxjQUFjLENBQUNOLGlCQUFELEVBQW9CLElBQXBCLENBQWpCLEdBQTZDQSxpQkFBekY7QUFDQTtBQUNEOztBQUNELFFBQU04TSxtQkFBbUIsR0FBRzFULGdCQUFnQixDQUFDNkIsc0JBQWpCLEVBQTVCO0FBQ0EsUUFBTTRSLFlBQWlDLEdBQUcwQyxnQkFBZ0IsQ0FBQ3pDLG1CQUFELENBQTFEO0FBRUEsV0FBTztBQUNOdkMsTUFBQUEsRUFBRSxFQUFFQSxFQURFO0FBRU5yUCxNQUFBQSxVQUFVLEVBQUU2VCxTQUFTLEdBQUdBLFNBQVMsQ0FBQzNULElBQWIsR0FBb0IsRUFGbkM7QUFHTm9VLE1BQUFBLFVBQVUsRUFBRUMsbUJBQW1CLENBQUNyVyxnQkFBZ0IsQ0FBQzZCLHNCQUFqQixFQUFELENBSHpCO0FBSU44USxNQUFBQSxjQUFjLEVBQUVoUixzQkFKVjtBQUtOTyxNQUFBQSxXQUFXLEVBQUVBLFdBTFA7QUFNTm9VLE1BQUFBLEdBQUcsRUFBRXRMLDRCQUE0QixDQUNoQ2xMLGtCQURnQyxFQUVoQ0MsaUJBRmdDLEVBR2hDQyxnQkFIZ0MsRUFJaENDLGtCQUpnQyxFQUtoQ21DLDBCQUxnQyxDQU4zQjtBQWFOeVQsTUFBQUEsUUFBUSxFQUFFQSxRQWJKO0FBY05VLE1BQUFBLElBQUksRUFBRTtBQUNMLGtCQUFVbkQsZ0JBQWdCLENBQUNwVCxnQkFBRCxFQUFtQjJCLHNCQUFuQixFQUEyQzJFLGtCQUFrQixDQUFDbEMsV0FBOUQsQ0FEckI7QUFFTHNGLFFBQUFBLE1BQU0sRUFBRXhDLGNBQWMsQ0FBQ3NNLGdCQUFnQixDQUFDeFQsZ0JBQUQsRUFBbUJ5VSxpQkFBbkIsYUFBbUJBLGlCQUFuQix1QkFBbUJBLGlCQUFpQixDQUFFM0ssSUFBdEMsRUFBNEMySixZQUE1QyxDQUFqQixDQUZqQjtBQUdMK0MsUUFBQUEsS0FBSyxFQUFFdFAsY0FBYyxDQUFDc04sZUFBZSxDQUFDeFUsZ0JBQUQsRUFBbUJ5VSxpQkFBbkIsRUFBc0NoQixZQUF0QyxDQUFoQjtBQUhoQixPQWRBO0FBbUJOZ0QsTUFBQUEsV0FBVyxFQUFFQyxlQUFlLENBQUMxVyxnQkFBRCxDQW5CdEI7QUFvQk4wSixNQUFBQSxNQUFNLEVBQUUrSyxpQkFwQkY7QUFxQk4vTixNQUFBQSxhQUFhLEVBQUVBLGFBckJUO0FBc0JOaVEsTUFBQUEsY0FBYyxFQUFFM1csZ0JBQWdCLENBQUM4RyxlQUFqQixPQUF1Q0MsWUFBWSxDQUFDQyxVQXRCOUQ7QUF1Qk40UCxNQUFBQSxlQUFlLEVBQUVoQixvQkFBb0IsQ0FBQzNELG9CQUFyQixPQUFnRCxTQUFoRCxJQUE2RCxDQUFDLENBQUM0RCxRQXZCMUU7QUF3Qk5HLE1BQUFBLFNBQVMsRUFBRUEsU0F4Qkw7QUF5Qk5yQixNQUFBQSxjQUFjLEVBQUVELGlCQUFpQixDQUFDcFQsNkJBQUQsRUFBZ0NOLE9BQWhDLENBekIzQjtBQTBCTjZWLE1BQUFBLHlCQUF5QixFQUFFaFEsd0JBMUJyQjtBQTJCTjJPLE1BQUFBLEtBQUssRUFBRUE7QUEzQkQsS0FBUDtBQTZCQTs7OztBQUVELFdBQVNrQixlQUFULENBQXlCMVcsZ0JBQXpCLEVBQXNFO0FBQ3JFLFFBQU04VyxZQUFZLEdBQUc5VyxnQkFBZ0IsQ0FBQzhHLGVBQWpCLEVBQXJCOztBQUNBLFFBQUlnUSxZQUFZLEtBQUsvUCxZQUFZLENBQUN1TSxrQkFBOUIsSUFBb0R3RCxZQUFZLEtBQUsvUCxZQUFZLENBQUN3TSxVQUF0RixFQUFrRztBQUNqRyxhQUFPLElBQVA7QUFDQSxLQUpvRSxDQUtyRTs7O0FBQ0EsV0FBTyxLQUFQO0FBQ0E7QUFFRDs7Ozs7Ozs7QUFNQSxXQUFTN1IsU0FBVCxDQUFtQjNCLGlCQUFuQixFQUE4QztBQUFBLGdDQUNFQSxpQkFBaUIsQ0FBQ21FLEtBQWxCLENBQXdCLEdBQXhCLENBREY7QUFBQTtBQUFBLFFBQ3hDdkMsc0JBRHdDO0FBQUEsUUFDaEJxRyxjQURnQjs7QUFHN0MsUUFBSXJHLHNCQUFzQixDQUFDZ08sV0FBdkIsQ0FBbUMsR0FBbkMsTUFBNENoTyxzQkFBc0IsQ0FBQ1EsTUFBdkIsR0FBZ0MsQ0FBaEYsRUFBbUY7QUFDbEY7QUFDQVIsTUFBQUEsc0JBQXNCLEdBQUdBLHNCQUFzQixDQUFDb1YsTUFBdkIsQ0FBOEIsQ0FBOUIsRUFBaUNwVixzQkFBc0IsQ0FBQ1EsTUFBdkIsR0FBZ0MsQ0FBakUsQ0FBekI7QUFDQTs7QUFDRCxXQUFPO0FBQUVSLE1BQUFBLHNCQUFzQixFQUF0QkEsc0JBQUY7QUFBMEJxRyxNQUFBQSxjQUFjLEVBQWRBO0FBQTFCLEtBQVA7QUFDQTs7QUFFTSxXQUFTZ1AsZ0NBQVQsQ0FDTkMsb0JBRE0sRUFFTmpYLGdCQUZNLEVBR3NDO0FBQzVDLFFBQU1rWCxjQUFjLEdBQUdsWCxnQkFBZ0IsQ0FBQ21YLHVCQUFqQixDQUF5Q0Ysb0JBQXpDLENBQXZCO0FBQ0EsUUFBTUcsU0FBK0IsR0FBR0YsY0FBYyxDQUFDeFUsVUFBdkQ7O0FBRUEsUUFBSTBVLFNBQUosRUFBZTtBQUFBOztBQUNkLFVBQU1DLGFBQXVCLEdBQUcsRUFBaEM7QUFDQSwrQkFBQUQsU0FBUyxDQUFDRSxhQUFWLGdGQUF5Qm5TLE9BQXpCLENBQWlDLFVBQUNvUyxZQUFELEVBQW9DO0FBQ3BFLFlBQU12QyxZQUFpQixHQUFHdUMsWUFBWSxDQUFDQyxZQUF2QztBQUNBLFlBQU1DLFlBQW9CLEdBQUd6QyxZQUFZLENBQUN2UCxLQUExQzs7QUFDQSxZQUFJNFIsYUFBYSxDQUFDN1IsT0FBZCxDQUFzQmlTLFlBQXRCLE1BQXdDLENBQUMsQ0FBN0MsRUFBZ0Q7QUFDL0NKLFVBQUFBLGFBQWEsQ0FBQ3pTLElBQWQsQ0FBbUI2UyxZQUFuQjtBQUNBO0FBQ0QsT0FORDtBQU9BLGFBQU87QUFDTkMsUUFBQUEsSUFBSSxFQUFFTixTQUFTLENBQUNPLElBRFY7QUFFTk4sUUFBQUEsYUFBYSxFQUFFQTtBQUZULE9BQVA7QUFJQTs7QUFDRCxXQUFPdFUsU0FBUDtBQUNBOzs7O0FBRU0sV0FBU3RCLDZCQUFULENBQ04zQixrQkFETSxFQUVOQyxpQkFGTSxFQUdOQyxnQkFITSxFQUtzQjtBQUFBLFFBRDVCdUIsK0JBQzRCLHVFQURlLEtBQ2Y7QUFDNUIsUUFBTWtGLHFCQUFpRCxHQUFHekcsZ0JBQWdCLENBQUNNLCtCQUFqQixDQUFpRFAsaUJBQWpELENBQTFEO0FBQ0EsUUFBTTRHLGFBQWEsR0FBR0YscUJBQXFCLENBQUNFLGFBQTVDO0FBQ0EsUUFBSWlSLHFCQUFKO0FBQ0EsUUFBTUMsZ0JBQThDLEdBQUcsRUFBdkQ7QUFDQSxRQUFJQyxZQUFZLEdBQUcsSUFBbkI7QUFDQSxRQUFJdE4sWUFBWSxHQUFHQyxZQUFZLENBQUNNLE9BQWhDO0FBQ0EsUUFBSWdOLE9BQUo7QUFDQSxRQUFJbE4sV0FBVyxHQUFHLElBQWxCO0FBQ0EsUUFBSW1OLCtCQUErQixHQUFHLEtBQXRDO0FBQ0EsUUFBSUMsb0JBQW9CLEdBQUcsS0FBM0I7QUFDQSxRQUFJQyxjQUFjLEdBQUcsS0FBckI7QUFDQSxRQUFJQyxTQUFvQixHQUFHLGlCQUEzQjtBQUNBLFFBQUlDLGdCQUFnQixHQUFHLEtBQXZCO0FBQ0EsUUFBSUMsY0FBYyxHQUFHLEdBQXJCO0FBQ0EsUUFBSUMsV0FBVyxHQUFHdFksZ0JBQWdCLENBQUM4RyxlQUFqQixPQUF1QyxZQUF6RDtBQUNBLFFBQU15UixhQUFhLEdBQUd2WSxnQkFBZ0IsQ0FBQ3dZLGdCQUFqQixFQUF0QjtBQUNBLFFBQU1DLGtCQUFrQixHQUFHRixhQUFILGFBQUdBLGFBQUgsdUJBQUdBLGFBQWEsQ0FBRUcsaUJBQWYsRUFBM0I7QUFDQSxRQUFNQyxpQkFBaUIsR0FBRzNZLGdCQUFnQixDQUFDcUMsa0JBQWpCLEdBQXNDdVcsbUJBQXRDLEVBQTFCOztBQUNBLFFBQUssQ0FBQUQsaUJBQWlCLFNBQWpCLElBQUFBLGlCQUFpQixXQUFqQixZQUFBQSxpQkFBaUIsQ0FBRUUsSUFBbkIsTUFBNEIsSUFBNUIsSUFBb0MsQ0FBQUYsaUJBQWlCLFNBQWpCLElBQUFBLGlCQUFpQixXQUFqQixZQUFBQSxpQkFBaUIsQ0FBRUcsT0FBbkIsTUFBK0IsSUFBcEUsSUFBNkVMLGtCQUFrQixLQUFLLE1BQXhHLEVBQWdIO0FBQy9HbFgsTUFBQUEsK0JBQStCLEdBQUcsS0FBbEM7QUFDQTs7QUFDRCxRQUFJb0YsYUFBYSxJQUFJN0csa0JBQXJCLEVBQXlDO0FBQUE7O0FBQ3hDLFVBQU1rSyxnQkFBZ0IsR0FBR2hLLGdCQUFnQixDQUFDaUIsdUJBQWpCLENBQXlDbkIsa0JBQXpDLENBQXpCO0FBQ0E2RyxNQUFBQSxhQUFhLFNBQWIsSUFBQUEsYUFBYSxXQUFiLHFDQUFBQSxhQUFhLENBQUVvUyxxQkFBZiwwR0FBc0NyVSxLQUF0QyxrRkFBNkNTLE9BQTdDLENBQXFELFVBQUNrSyxJQUFELEVBQXNDO0FBQUE7O0FBQzFGdUksUUFBQUEscUJBQXFCLEdBQUc1TixnQkFBZ0IsQ0FBQytHLFdBQWpCLENBQTZCLE1BQU0xQixJQUFJLENBQUNySCxjQUF4QyxDQUF4QixDQUQwRixDQUUxRjs7QUFDQSxZQUFJNFAscUJBQUosRUFBMkI7QUFDMUJDLFVBQUFBLGdCQUFnQixDQUFDalQsSUFBakIsQ0FBc0I7QUFBRW9ELFlBQUFBLGNBQWMsRUFBRXFILElBQUksQ0FBQ3JIO0FBQXZCLFdBQXRCO0FBQ0E7O0FBQ0QrUCxRQUFBQSxPQUFPLEdBQUc7QUFDVGlCLFVBQUFBLFlBQVksRUFBRTtBQUNiQyxZQUFBQSxPQUFPLEVBQ05qWixnQkFBZ0IsQ0FBQzhHLGVBQWpCLE9BQXVDQyxZQUFZLENBQUN3TSxVQUFwRCxHQUNHLGdEQURILEdBRUcsSUFKUztBQUtiMkYsWUFBQUEsVUFBVSxFQUFFdlMsYUFBRixhQUFFQSxhQUFGLGlEQUFFQSxhQUFhLENBQUVvUyxxQkFBakIsMkRBQUUsdUJBQXNDRyxVQUxyQztBQU1ieFUsWUFBQUEsS0FBSyxFQUFFbVQ7QUFOTTtBQURMLFNBQVY7QUFVQSxPQWhCRDtBQWlCQXJOLE1BQUFBLFlBQVksR0FBRywwQkFBQTdELGFBQWEsQ0FBQzZELFlBQWQsZ0ZBQTRCeEksSUFBNUIsS0FBb0N3SSxZQUFuRDtBQUNBSyxNQUFBQSxXQUFXLEdBQUcsMkJBQUFsRSxhQUFhLENBQUM2RCxZQUFkLGtGQUE0QkssV0FBNUIsTUFBNEM5SCxTQUE1Qyw2QkFBd0Q0RCxhQUFhLENBQUM2RCxZQUF0RSwyREFBd0QsdUJBQTRCSyxXQUFwRixHQUFrRyxJQUFoSDtBQUNBbU4sTUFBQUEsK0JBQStCLEdBQUcsQ0FBQyw0QkFBQ3JSLGFBQWEsQ0FBQzZELFlBQWYsMkRBQUMsdUJBQTRCd04sK0JBQTdCLENBQW5DO0FBQ0FDLE1BQUFBLG9CQUFvQixHQUFHdFIsYUFBYSxDQUFDc1Isb0JBQWQsS0FBdUNsVixTQUF2QyxHQUFtRDRELGFBQWEsQ0FBQ3NSLG9CQUFqRSxHQUF3RixLQUEvRztBQUNBQyxNQUFBQSxjQUFjLEdBQUcsQ0FBQyw0QkFBQ3ZSLGFBQWEsQ0FBQ29TLHFCQUFmLDJEQUFDLHVCQUFxQ2IsY0FBdEMsQ0FBbEI7QUFDQUMsTUFBQUEsU0FBUyxHQUFHLENBQUF4UixhQUFhLFNBQWIsSUFBQUEsYUFBYSxXQUFiLFlBQUFBLGFBQWEsQ0FBRXBFLElBQWYsS0FBdUIsaUJBQW5DO0FBQ0E2VixNQUFBQSxnQkFBZ0IsR0FBR3pSLGFBQWEsQ0FBQ3lSLGdCQUFkLElBQWtDLEtBQXJEOztBQUNBLFVBQUlBLGdCQUFnQixLQUFLLElBQXJCLElBQTZCcFksZ0JBQWdCLENBQUM4RyxlQUFqQixPQUF1Q0MsWUFBWSxDQUFDd00sVUFBckYsRUFBaUc7QUFDaEc2RSxRQUFBQSxnQkFBZ0IsR0FBRyxLQUFuQjtBQUNBcFksUUFBQUEsZ0JBQWdCLENBQ2RtWixjQURGLEdBRUVDLFFBRkYsQ0FFV0MsYUFBYSxDQUFDQyxRQUZ6QixFQUVtQ0MsYUFBYSxDQUFDQyxHQUZqRCxFQUVzREMsU0FBUyxDQUFDQyxnQ0FGaEU7QUFHQTs7QUFDRHJCLE1BQUFBLGNBQWMsR0FBRzFSLGFBQWEsQ0FBQ2dULFNBQWQsS0FBNEIsSUFBNUIsSUFBb0NoVCxhQUFhLENBQUMwUixjQUFkLEtBQWlDLENBQXJFLEdBQXlFLENBQXpFLEdBQTZFMVIsYUFBYSxDQUFDMFIsY0FBZCxJQUFnQyxHQUE5SDtBQUNBQyxNQUFBQSxXQUFXLEdBQUd0WSxnQkFBZ0IsQ0FBQzhHLGVBQWpCLE9BQXVDLFlBQXZDLElBQXVESCxhQUFhLENBQUMyUixXQUFkLEtBQThCLEtBQW5HO0FBQ0FSLE1BQUFBLFlBQVksR0FDWG5SLGFBQWEsQ0FBQ21SLFlBQWQsS0FBK0IvVSxTQUEvQixHQUNHNEQsYUFBYSxDQUFDbVIsWUFEakIsR0FFRzlYLGdCQUFnQixDQUFDOEcsZUFBakIsT0FBdUMsWUFBdkMsSUFBdUR3UixXQUgzRDtBQUlBOztBQUNELFdBQU87QUFDTlAsTUFBQUEsT0FBTyxFQUFFQSxPQURIO0FBRU54VixNQUFBQSxJQUFJLEVBQUU0VixTQUZBO0FBR05DLE1BQUFBLGdCQUFnQixFQUFFQSxnQkFIWjtBQUlOd0IsTUFBQUEsYUFBYSxFQUFFLEVBQUVoQyxxQkFBcUIsSUFBSU0sY0FBM0IsQ0FKVDtBQUtOSixNQUFBQSxZQUFZLEVBQUVBLFlBTFI7QUFNTnROLE1BQUFBLFlBQVksRUFBRUEsWUFOUjtBQU9OSyxNQUFBQSxXQUFXLEVBQUVBLFdBUFA7QUFRTm1OLE1BQUFBLCtCQUErQixFQUFFQSwrQkFSM0I7QUFTTjZCLE1BQUFBLHVCQUF1QixFQUFFNUIsb0JBQW9CLElBQUkxVywrQkFUM0M7QUFVTjhXLE1BQUFBLGNBQWMsRUFBRUEsY0FWVjtBQVdOQyxNQUFBQSxXQUFXLEVBQUVBO0FBWFAsS0FBUDtBQWFBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRDcml0aWNhbGl0eVR5cGUsXG5cdERhdGFGaWVsZCxcblx0RGF0YUZpZWxkQWJzdHJhY3RUeXBlcyxcblx0RGF0YUZpZWxkRm9yQW5ub3RhdGlvbixcblx0RW51bVZhbHVlLFxuXHRMaW5lSXRlbSxcblx0UGF0aEFubm90YXRpb25FeHByZXNzaW9uLFxuXHRQcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzLFxuXHRQcm9wZXJ0eUFubm90YXRpb25WYWx1ZSxcblx0UHJvcGVydHlQYXRoLFxuXHRTZWxlY3Rpb25WYXJpYW50VHlwZSxcblx0U2VsZWN0T3B0aW9uVHlwZSxcblx0VUlBbm5vdGF0aW9uVHlwZXNcbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQge1xuXHRBY3Rpb25UeXBlLFxuXHRBdmFpbGFiaWxpdHlUeXBlLFxuXHRDcmVhdGlvbk1vZGUsXG5cdEhvcml6b250YWxBbGlnbixcblx0TWFuaWZlc3RUYWJsZUNvbHVtbixcblx0TWFuaWZlc3RXcmFwcGVyLFxuXHROYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9uLFxuXHROYXZpZ2F0aW9uVGFyZ2V0Q29uZmlndXJhdGlvbixcblx0U2VsZWN0aW9uTW9kZSxcblx0VGFibGVDb2x1bW5TZXR0aW5ncyxcblx0VGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24sXG5cdFZhcmlhbnRNYW5hZ2VtZW50VHlwZSxcblx0VmlzdWFsaXphdGlvblR5cGVcbn0gZnJvbSBcIi4uLy4uL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7IEVudGl0eVNldCwgRW50aXR5VHlwZSwgTmF2aWdhdGlvblByb3BlcnR5LCBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQgeyBDb252ZXJ0ZXJDb250ZXh0LCBUZW1wbGF0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vdGVtcGxhdGVzL0Jhc2VDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IFRhYmxlSUQgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9JRFwiO1xuaW1wb3J0IHsgTmF2aWdhdGlvblByb3BlcnR5UmVzdHJpY3Rpb25UeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L2dlbmVyYXRlZC9DYXBhYmlsaXRpZXNcIjtcbmltcG9ydCB7XG5cdEFubm90YXRpb25BY3Rpb24sXG5cdEJhc2VBY3Rpb24sXG5cdEN1c3RvbUFjdGlvbixcblx0Z2V0QWN0aW9uc0Zyb21NYW5pZmVzdCxcblx0aXNBY3Rpb25OYXZpZ2FibGUsXG5cdHJlbW92ZUR1cGxpY2F0ZUFjdGlvbnNcbn0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL0FjdGlvblwiO1xuaW1wb3J0IHsgQ29uZmlndXJhYmxlT2JqZWN0LCBDdXN0b21FbGVtZW50LCBpbnNlcnRDdXN0b21FbGVtZW50cywgUGxhY2VtZW50IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7XG5cdGNvbGxlY3RSZWxhdGVkUHJvcGVydGllcyxcblx0Q29tcGxleFByb3BlcnR5SW5mbyxcblx0aXNEYXRhRmllbGRBbHdheXNIaWRkZW4sXG5cdGlzRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3QsXG5cdGlzRGF0YUZpZWxkVHlwZXMsXG5cdGdldFNlbWFudGljT2JqZWN0UGF0aCxcblx0Q29sbGVjdGVkUHJvcGVydGllc1xufSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9hbm5vdGF0aW9ucy9EYXRhRmllbGRcIjtcbmltcG9ydCB7XG5cdGFubm90YXRpb25FeHByZXNzaW9uLFxuXHRCaW5kaW5nRXhwcmVzc2lvbixcblx0YmluZGluZ0V4cHJlc3Npb24sXG5cdGNvbXBpbGVCaW5kaW5nLFxuXHRjb25zdGFudCxcblx0RXhwcmVzc2lvbixcblx0RXhwcmVzc2lvbk9yUHJpbWl0aXZlLFxuXHRmb3JtYXRSZXN1bHQsXG5cdGlmRWxzZSxcblx0b3IsXG5cdGVxdWFsLFxuXHRpc0NvbnN0YW50LFxuXHRhbmQsXG5cdG5vdFxufSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IHsgRHJhZnQsIFVJIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9CaW5kaW5nSGVscGVyXCI7XG5pbXBvcnQgeyBLZXlIZWxwZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0tleVwiO1xuaW1wb3J0IHRhYmxlRm9ybWF0dGVycyBmcm9tIFwic2FwL2ZlL2NvcmUvZm9ybWF0dGVycy9UYWJsZUZvcm1hdHRlclwiO1xuaW1wb3J0IHsgTWVzc2FnZVR5cGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvZm9ybWF0dGVycy9UYWJsZUZvcm1hdHRlclR5cGVzXCI7XG5pbXBvcnQgeyBnZXRUYXJnZXRPYmplY3RQYXRoLCBpc1BhdGhEZWxldGFibGUsIGlzUGF0aEluc2VydGFibGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EYXRhTW9kZWxQYXRoSGVscGVyXCI7XG5pbXBvcnQgeyByZXBsYWNlU3BlY2lhbENoYXJzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvU3RhYmxlSWRIZWxwZXJcIjtcbmltcG9ydCB7IElzc3VlQ2F0ZWdvcnksIElzc3VlU2V2ZXJpdHksIElzc3VlVHlwZSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSXNzdWVNYW5hZ2VyXCI7XG5pbXBvcnQgKiBhcyBFZG0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL2Rpc3QvRWRtXCI7XG5pbXBvcnQgeyBpc1Byb3BlcnR5IH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvUHJvcGVydHlIZWxwZXJcIjtcblxuaW1wb3J0IHsgQWdncmVnYXRpb25IZWxwZXIgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9BZ2dyZWdhdGlvblwiO1xuXG5leHBvcnQgdHlwZSBUYWJsZUFubm90YXRpb25Db25maWd1cmF0aW9uID0ge1xuXHRhdXRvQmluZE9uSW5pdDogYm9vbGVhbjtcblx0Y29sbGVjdGlvbjogc3RyaW5nO1xuXHRlbmFibGVDb250cm9sVk0/OiBib29sZWFuO1xuXHRmaWx0ZXJJZD86IHN0cmluZztcblx0aWQ6IHN0cmluZztcblx0aXNFbnRpdHlTZXQ6IGJvb2xlYW47XG5cdG5hdmlnYXRpb25QYXRoOiBzdHJpbmc7XG5cdHAxM25Nb2RlPzogc3RyaW5nO1xuXHRyb3c/OiB7XG5cdFx0YWN0aW9uPzogc3RyaW5nO1xuXHRcdHByZXNzPzogc3RyaW5nO1xuXHRcdHJvd0hpZ2hsaWdodGluZzogQmluZGluZ0V4cHJlc3Npb248TWVzc2FnZVR5cGU+O1xuXHRcdHJvd05hdmlnYXRlZDogQmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj47XG5cdH07XG5cdHNlbGVjdGlvbk1vZGU6IHN0cmluZztcblx0c2hvdz86IHtcblx0XHRjcmVhdGU/OiBzdHJpbmcgfCBib29sZWFuO1xuXHRcdGRlbGV0ZT86IHN0cmluZyB8IGJvb2xlYW47XG5cdFx0cGFzdGU/OiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPjtcblx0fTtcblx0ZGlzcGxheU1vZGU/OiBib29sZWFuO1xuXHR0aHJlc2hvbGQ6IG51bWJlcjtcblx0ZW50aXR5TmFtZTogc3RyaW5nO1xuXHRzb3J0Q29uZGl0aW9ucz86IHN0cmluZztcblxuXHQvKiogQ3JlYXRlIG5ldyBlbnRyaWVzICovXG5cdGNyZWF0ZTogQ3JlYXRlQmVoYXZpb3VyIHwgQ3JlYXRlQmVoYXZpb3VyRXh0ZXJuYWw7XG5cdHBhcmVudEVudGl0eURlbGV0ZUVuYWJsZWQ/OiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPjtcblx0dGl0bGU6IHN0cmluZztcbn07XG5cbi8qKlxuICogTmV3IGVudHJpZXMgYXJlIGNyZWF0ZWQgd2l0aGluIHRoZSBhcHAgKGRlZmF1bHQgY2FzZSlcbiAqL1xudHlwZSBDcmVhdGVCZWhhdmlvdXIgPSB7XG5cdG1vZGU6IENyZWF0aW9uTW9kZTtcblx0YXBwZW5kOiBCb29sZWFuO1xuXHRuZXdBY3Rpb24/OiBzdHJpbmc7XG5cdG5hdmlnYXRlVG9UYXJnZXQ/OiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIE5ldyBlbnRyaWVzIGFyZSBjcmVhdGVkIGJ5IG5hdmlnYXRpbmcgdG8gc29tZSB0YXJnZXRcbiAqL1xudHlwZSBDcmVhdGVCZWhhdmlvdXJFeHRlcm5hbCA9IHtcblx0bW9kZTogXCJFeHRlcm5hbFwiO1xuXHRvdXRib3VuZDogc3RyaW5nO1xuXHRvdXRib3VuZERldGFpbDogTmF2aWdhdGlvblRhcmdldENvbmZpZ3VyYXRpb25bXCJvdXRib3VuZERldGFpbFwiXTtcblx0bmF2aWdhdGlvblNldHRpbmdzOiBOYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9uO1xufTtcblxudHlwZSBUYWJsZUNhcGFiaWxpdHlSZXN0cmljdGlvbiA9IHtcblx0aXNEZWxldGFibGU6IGJvb2xlYW47XG5cdGlzVXBkYXRhYmxlOiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgVGFibGVGaWx0ZXJzQ29uZmlndXJhdGlvbiA9IHtcblx0ZW5hYmxlZD86IHN0cmluZyB8IGJvb2xlYW47XG5cdHBhdGhzOiBbXG5cdFx0e1xuXHRcdFx0YW5ub3RhdGlvblBhdGg6IHN0cmluZztcblx0XHR9XG5cdF07XG5cdHNob3dDb3VudHM/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgU2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb24gPSB7XG5cdHByb3BlcnR5TmFtZXM6IHN0cmluZ1tdO1xuXHR0ZXh0OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBUYWJsZUNvbnRyb2xDb25maWd1cmF0aW9uID0ge1xuXHRjcmVhdGVBdEVuZDogYm9vbGVhbjtcblx0Y3JlYXRpb25Nb2RlOiBDcmVhdGlvbk1vZGU7XG5cdGRpc2FibGVBZGRSb3dCdXR0b25Gb3JFbXB0eURhdGE6IGJvb2xlYW47XG5cdHVzZUNvbmRlbnNlZFRhYmxlTGF5b3V0OiBib29sZWFuO1xuXHRlbmFibGVFeHBvcnQ6IGJvb2xlYW47XG5cdGhlYWRlclZpc2libGU6IGJvb2xlYW47XG5cdGZpbHRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBUYWJsZUZpbHRlcnNDb25maWd1cmF0aW9uPjtcblx0dHlwZTogVGFibGVUeXBlO1xuXHRzZWxlY3RBbGw/OiBib29sZWFuO1xuXHRzZWxlY3Rpb25MaW1pdDogbnVtYmVyO1xuXHRlbmFibGVQYXN0ZTogYm9vbGVhbjtcblx0ZW5hYmxlRnVsbFNjcmVlbjogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCB0eXBlIFRhYmxlVHlwZSA9IFwiR3JpZFRhYmxlXCIgfCBcIlJlc3BvbnNpdmVUYWJsZVwiO1xuXG5lbnVtIENvbHVtblR5cGUge1xuXHREZWZhdWx0ID0gXCJEZWZhdWx0XCIsIC8vIERlZmF1bHQgVHlwZVxuXHRBbm5vdGF0aW9uID0gXCJBbm5vdGF0aW9uXCJcbn1cblxuZXhwb3J0IHR5cGUgQmFzZVRhYmxlQ29sdW1uID0gQ29uZmlndXJhYmxlT2JqZWN0ICYge1xuXHRpZDogc3RyaW5nO1xuXHR3aWR0aD86IHN0cmluZztcblx0bmFtZTogc3RyaW5nO1xuXHRhdmFpbGFiaWxpdHk6IEF2YWlsYWJpbGl0eVR5cGU7XG5cdHR5cGU6IENvbHVtblR5cGU7IC8vT3JpZ2luIG9mIHRoZSBzb3VyY2Ugd2hlcmUgd2UgYXJlIGdldHRpbmcgdGhlIHRlbXBsYXRlZCBpbmZvcm1hdGlvbiBmcm9tLFxuXHRpc05hdmlnYWJsZT86IGJvb2xlYW47XG5cdHNldHRpbmdzPzogVGFibGVDb2x1bW5TZXR0aW5ncztcblx0c2VtYW50aWNPYmplY3RQYXRoPzogc3RyaW5nO1xuXHRwcm9wZXJ0eUluZm9zPzogc3RyaW5nW107XG5cdHNvcnRhYmxlOiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgQ3VzdG9tVGFibGVDb2x1bW4gPSBCYXNlVGFibGVDb2x1bW4gJiB7XG5cdGhlYWRlcj86IHN0cmluZztcblx0aG9yaXpvbnRhbEFsaWduPzogSG9yaXpvbnRhbEFsaWduO1xuXHR0ZW1wbGF0ZTogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQW5ub3RhdGlvblRhYmxlQ29sdW1uID0gQmFzZVRhYmxlQ29sdW1uICYge1xuXHRhbm5vdGF0aW9uUGF0aDogc3RyaW5nO1xuXHRyZWxhdGl2ZVBhdGg6IHN0cmluZztcblx0bGFiZWw/OiBzdHJpbmc7XG5cdGdyb3VwTGFiZWw/OiBzdHJpbmc7XG5cdGdyb3VwPzogc3RyaW5nO1xuXHRpc0dyb3VwYWJsZT86IGJvb2xlYW47XG5cdGlzS2V5PzogYm9vbGVhbjtcblx0ZXhwb3J0U2V0dGluZ3M/OiB7XG5cdFx0dGVtcGxhdGU/OiBzdHJpbmc7XG5cdFx0bGFiZWw/OiBzdHJpbmc7XG5cdH07XG59O1xuXG50eXBlIFRhYmxlQ29sdW1uID0gQ3VzdG9tVGFibGVDb2x1bW4gfCBBbm5vdGF0aW9uVGFibGVDb2x1bW47XG5cbmV4cG9ydCB0eXBlIEN1c3RvbUNvbHVtbiA9IEN1c3RvbUVsZW1lbnQ8VGFibGVDb2x1bW4+O1xuXG5leHBvcnQgdHlwZSBUYWJsZVZpc3VhbGl6YXRpb24gPSB7XG5cdHR5cGU6IFZpc3VhbGl6YXRpb25UeXBlLlRhYmxlO1xuXHRhbm5vdGF0aW9uOiBUYWJsZUFubm90YXRpb25Db25maWd1cmF0aW9uO1xuXHRjb250cm9sOiBUYWJsZUNvbnRyb2xDb25maWd1cmF0aW9uO1xuXHRjb2x1bW5zOiBUYWJsZUNvbHVtbltdO1xuXHRhY3Rpb25zOiBCYXNlQWN0aW9uW107XG59O1xuXG50eXBlIFNvcnRlclR5cGUgPSB7XG5cdG5hbWU6IHN0cmluZztcblx0ZGVzY2VuZGluZzogYm9vbGVhbjtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgYW5ub3RhdGlvbiBiYXNlZCBhbmQgbWFuaWZlc3QgYmFzZWQgdGFibGUgYWN0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge0xpbmVJdGVtfSBsaW5lSXRlbUFubm90YXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB2aXN1YWxpemF0aW9uUGF0aFxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0ge05hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb259IG5hdmlnYXRpb25TZXR0aW5nc1xuICogQHJldHVybnMge0Jhc2VBY3Rpb259IHRoZSBjb21wbGV0ZSB0YWJsZSBhY3Rpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWJsZUFjdGlvbnMoXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0sXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdG5hdmlnYXRpb25TZXR0aW5ncz86IE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb25cbik6IEJhc2VBY3Rpb25bXSB7XG5cdGNvbnN0IGFBbm5vdGF0aW9uQWN0aW9uczogQmFzZUFjdGlvbltdID0gZ2V0VGFibGVBbm5vdGF0aW9uQWN0aW9ucyhsaW5lSXRlbUFubm90YXRpb24sIHZpc3VhbGl6YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0cmV0dXJuIGluc2VydEN1c3RvbUVsZW1lbnRzKFxuXHRcdGFBbm5vdGF0aW9uQWN0aW9ucyxcblx0XHRnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KFxuXHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKHZpc3VhbGl6YXRpb25QYXRoKS5hY3Rpb25zLFxuXHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdGFBbm5vdGF0aW9uQWN0aW9ucyxcblx0XHRcdG5hdmlnYXRpb25TZXR0aW5ncyxcblx0XHRcdHRydWVcblx0XHQpLFxuXHRcdHsgaXNOYXZpZ2FibGU6IFwib3ZlcndyaXRlXCIsIGVuYWJsZU9uU2VsZWN0OiBcIm92ZXJ3cml0ZVwiLCBlbmFibGVBdXRvU2Nyb2xsOiBcIm92ZXJ3cml0ZVwiIH1cblx0KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mZiBhbGwgY29sdW1ucywgYW5ub3RhdGlvbiBiYXNlZCBhcyB3ZWxsIGFzIG1hbmlmZXN0IGJhc2VkLlxuICogVGhleSBhcmUgc29ydGVkIGFuZCBzb21lIHByb3BlcnRpZXMgb2YgY2FuIGJlIG92ZXJ3cml0dGVuIHRocm91Z2ggdGhlIG1hbmlmZXN0IChjaGVjayBvdXQgdGhlIG92ZXJ3cml0ZS1hYmxlIEtleXMpLlxuICpcbiAqIEBwYXJhbSB7TGluZUl0ZW19IGxpbmVJdGVtQW5ub3RhdGlvbiBDb2xsZWN0aW9uIG9mIGRhdGEgZmllbGRzIGZvciByZXByZXNlbnRhdGlvbiBpbiBhIHRhYmxlIG9yIGxpc3RcbiAqIEBwYXJhbSB7c3RyaW5nfSB2aXN1YWxpemF0aW9uUGF0aFxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0ge05hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb259IG5hdmlnYXRpb25TZXR0aW5nc1xuICogQHJldHVybnMge1RhYmxlQ29sdW1uW119IFJldHVybnMgYWxsIHRhYmxlIGNvbHVtbnMgdGhhdCBzaG91bGQgYmUgYXZhaWxhYmxlLCByZWdhcmRsZXNzIG9mIHRlbXBsYXRpbmcgb3IgcGVyc29uYWxpemF0aW9uIG9yIHRoZWlyIG9yaWdpblxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFibGVDb2x1bW5zKFxuXHRsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRuYXZpZ2F0aW9uU2V0dGluZ3M/OiBOYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9uXG4pOiBUYWJsZUNvbHVtbltdIHtcblx0Y29uc3QgYW5ub3RhdGlvbkNvbHVtbnMgPSBnZXRDb2x1bW5zRnJvbUFubm90YXRpb25zKGxpbmVJdGVtQW5ub3RhdGlvbiwgdmlzdWFsaXphdGlvblBhdGgsIGNvbnZlcnRlckNvbnRleHQpO1xuXHRjb25zdCBtYW5pZmVzdENvbHVtbnMgPSBnZXRDb2x1bW5zRnJvbU1hbmlmZXN0KFxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbih2aXN1YWxpemF0aW9uUGF0aCkuY29sdW1ucyxcblx0XHRhbm5vdGF0aW9uQ29sdW1ucyBhcyBBbm5vdGF0aW9uVGFibGVDb2x1bW5bXSxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbkVudGl0eVR5cGUobGluZUl0ZW1Bbm5vdGF0aW9uKSxcblx0XHRuYXZpZ2F0aW9uU2V0dGluZ3Ncblx0KTtcblxuXHRyZXR1cm4gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoYW5ub3RhdGlvbkNvbHVtbnMsIG1hbmlmZXN0Q29sdW1ucywge1xuXHRcdHdpZHRoOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdGlzTmF2aWdhYmxlOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdGF2YWlsYWJpbGl0eTogXCJvdmVyd3JpdGVcIixcblx0XHRzZXR0aW5nczogXCJvdmVyd3JpdGVcIlxuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRhYmxlVmlzdWFsaXphdGlvbihcblx0bGluZUl0ZW1Bbm5vdGF0aW9uOiBMaW5lSXRlbSxcblx0dmlzdWFsaXphdGlvblBhdGg6IHN0cmluZyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24/OiBQcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzLFxuXHRpc0NvbmRlbnNlZFRhYmxlTGF5b3V0Q29tcGxpYW50PzogYm9vbGVhblxuKTogVGFibGVWaXN1YWxpemF0aW9uIHtcblx0Y29uc3QgdGFibGVNYW5pZmVzdENvbmZpZyA9IGdldFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uKFxuXHRcdGxpbmVJdGVtQW5ub3RhdGlvbixcblx0XHR2aXN1YWxpemF0aW9uUGF0aCxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdGlzQ29uZGVuc2VkVGFibGVMYXlvdXRDb21wbGlhbnRcblx0KTtcblx0Y29uc3QgeyBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoIH0gPSBzcGxpdFBhdGgodmlzdWFsaXphdGlvblBhdGgpO1xuXHRjb25zdCBkYXRhTW9kZWxQYXRoID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCk7XG5cdGNvbnN0IGVudGl0eU5hbWU6IHN0cmluZyA9IGRhdGFNb2RlbFBhdGgudGFyZ2V0RW50aXR5U2V0ID8gZGF0YU1vZGVsUGF0aC50YXJnZXRFbnRpdHlTZXQubmFtZSA6IGRhdGFNb2RlbFBhdGguc3RhcnRpbmdFbnRpdHlTZXQubmFtZSxcblx0XHRpc0VudGl0eVNldDogYm9vbGVhbiA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoID09PSAwO1xuXHRjb25zdCBuYXZpZ2F0aW9uT3JDb2xsZWN0aW9uTmFtZSA9IGlzRW50aXR5U2V0ID8gZW50aXR5TmFtZSA6IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg7XG5cdGNvbnN0IG5hdmlnYXRpb25TZXR0aW5ncyA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuZ2V0TmF2aWdhdGlvbkNvbmZpZ3VyYXRpb24obmF2aWdhdGlvbk9yQ29sbGVjdGlvbk5hbWUpO1xuXHRjb25zdCBjb2x1bW5zID0gZ2V0VGFibGVDb2x1bW5zKGxpbmVJdGVtQW5ub3RhdGlvbiwgdmlzdWFsaXphdGlvblBhdGgsIGNvbnZlcnRlckNvbnRleHQsIG5hdmlnYXRpb25TZXR0aW5ncyk7XG5cdHJldHVybiB7XG5cdFx0dHlwZTogVmlzdWFsaXphdGlvblR5cGUuVGFibGUsXG5cdFx0YW5ub3RhdGlvbjogZ2V0VGFibGVBbm5vdGF0aW9uQ29uZmlndXJhdGlvbihcblx0XHRcdGxpbmVJdGVtQW5ub3RhdGlvbixcblx0XHRcdHZpc3VhbGl6YXRpb25QYXRoLFxuXHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdHRhYmxlTWFuaWZlc3RDb25maWcsXG5cdFx0XHRjb2x1bW5zLFxuXHRcdFx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb25cblx0XHQpLFxuXHRcdGNvbnRyb2w6IHRhYmxlTWFuaWZlc3RDb25maWcsXG5cdFx0YWN0aW9uczogcmVtb3ZlRHVwbGljYXRlQWN0aW9ucyhnZXRUYWJsZUFjdGlvbnMobGluZUl0ZW1Bbm5vdGF0aW9uLCB2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCwgbmF2aWdhdGlvblNldHRpbmdzKSksXG5cdFx0Y29sdW1uczogY29sdW1uc1xuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGVmYXVsdFRhYmxlVmlzdWFsaXphdGlvbihjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogVGFibGVWaXN1YWxpemF0aW9uIHtcblx0Y29uc3QgdGFibGVNYW5pZmVzdENvbmZpZyA9IGdldFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uKHVuZGVmaW5lZCwgXCJcIiwgY29udmVydGVyQ29udGV4dCwgZmFsc2UpO1xuXHRjb25zdCBjb2x1bW5zID0gZ2V0Q29sdW1uc0Zyb21FbnRpdHlUeXBlKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLCBbXSwgW10sIGNvbnZlcnRlckNvbnRleHQpO1xuXHRyZXR1cm4ge1xuXHRcdHR5cGU6IFZpc3VhbGl6YXRpb25UeXBlLlRhYmxlLFxuXHRcdGFubm90YXRpb246IGdldFRhYmxlQW5ub3RhdGlvbkNvbmZpZ3VyYXRpb24odW5kZWZpbmVkLCBcIlwiLCBjb252ZXJ0ZXJDb250ZXh0LCB0YWJsZU1hbmlmZXN0Q29uZmlnLCBjb2x1bW5zKSxcblx0XHRjb250cm9sOiB0YWJsZU1hbmlmZXN0Q29uZmlnLFxuXHRcdGFjdGlvbnM6IFtdLFxuXHRcdGNvbHVtbnM6IGNvbHVtbnNcblx0fTtcbn1cblxuLyoqXG4gKiBMb29wIHRocm91Z2ggdGhlIGRhdGEgZmllbGQgb2YgYSBsaW5lIGl0ZW0gdG8gZmluZCB0aGUgYWN0aW9ucyB0aGF0IHdpbGwgYmUgcHV0IGluIHRoZSB0b29sYmFyXG4gKiBBbmQgY2hlY2sgaWYgdGhleSByZXF1aXJlIGEgY29udGV4dCBvciBub3QuXG4gKlxuICogQHBhcmFtIGxpbmVJdGVtQW5ub3RhdGlvblxuICogQHJldHVybnMge2Jvb2xlYW59IGlmIGl0J3MgdGhlIGNhc2VcbiAqL1xuZnVuY3Rpb24gaGFzQWN0aW9uUmVxdWlyaW5nQ29udGV4dChsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtKTogYm9vbGVhbiB7XG5cdHJldHVybiBsaW5lSXRlbUFubm90YXRpb24uc29tZShkYXRhRmllbGQgPT4ge1xuXHRcdGlmIChkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFjdGlvbikge1xuXHRcdFx0cmV0dXJuIGRhdGFGaWVsZC5JbmxpbmUgIT09IHRydWU7XG5cdFx0fSBlbHNlIGlmIChkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbikge1xuXHRcdFx0cmV0dXJuIGRhdGFGaWVsZC5JbmxpbmUgIT09IHRydWUgJiYgZGF0YUZpZWxkLlJlcXVpcmVzQ29udGV4dDtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBoYXNBY3Rpb25SZXF1aXJpbmdTZWxlY3Rpb24obWFuaWZlc3RBY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+KTogYm9vbGVhbiB7XG5cdGxldCByZXF1aXJlc1NlbGVjdGlvbktleTogYm9vbGVhbiA9IGZhbHNlO1xuXHRpZiAobWFuaWZlc3RBY3Rpb25zKSB7XG5cdFx0cmVxdWlyZXNTZWxlY3Rpb25LZXkgPSBPYmplY3Qua2V5cyhtYW5pZmVzdEFjdGlvbnMpLnNvbWUoYWN0aW9uS2V5ID0+IHtcblx0XHRcdGNvbnN0IGFjdGlvbiA9IG1hbmlmZXN0QWN0aW9uc1thY3Rpb25LZXldO1xuXHRcdFx0cmV0dXJuIGFjdGlvbi5yZXF1aXJlc1NlbGVjdGlvbiA9PT0gdHJ1ZTtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gcmVxdWlyZXNTZWxlY3Rpb25LZXk7XG59XG5cbi8qKlxuICogRXZhbHVhdGUgaWYgdGhlIHZpc3VhbGl6YXRpb24gcGF0aCBpcyBkZWxldGFibGUgb3IgdXBkYXRhYmxlXG4gKiBUaGUgYWxnb3JpdGhtIGlzIGFzIGZvbGxvd1xuICogLSBFdmFsdWF0ZSBpZiB0aGVyZSBpcyBhIE5hdmlnYXRpb25SZXN0cmljdGlvbnMuRGVsZXRhYmxlIG9yIE5hdmlnYXRpb25SZXN0cmljdGlvbnMuVXBkYXRhYmxlIG9uIHRoZSBmdWxsIG5hdmlnYXRpb25QYXRoXG4gKiAtIEdvIGRvd24gdGhlIGVudGl0eSBzZXQgb2YgdGhlIHBhdGggZXZhbHVhdGluZyB0aGUgc2FtZSBlbGVtZW50IGFuZCBmb3IgdGhlIGxhc3QgcGFydCBldmFsdWF0ZSB0aGUgRGVsZXRlUmVzdHJpY3Rpb25zLkRlbGV0YWJsZSBvciBVcGRhdGVSZXN0cmljdGlvbnMuVXBkYXRhYmxlIHRoZXJlLlxuICpcbiAqIEBwYXJhbSB2aXN1YWxpemF0aW9uUGF0aFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIHtUYWJsZUNhcGFiaWxpdHlSZXN0cmljdGlvbn0gdGhlIHRhYmxlIGNhcGFiaWxpdGllc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FwYWJpbGl0eVJlc3RyaWN0aW9uKHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBUYWJsZUNhcGFiaWxpdHlSZXN0cmljdGlvbiB7XG5cdGNvbnN0IHsgbmF2aWdhdGlvblByb3BlcnR5UGF0aCB9ID0gc3BsaXRQYXRoKHZpc3VhbGl6YXRpb25QYXRoKTtcblx0Y29uc3QgbmF2aWdhdGlvblByb3BlcnR5UGF0aFBhcnRzID0gbmF2aWdhdGlvblByb3BlcnR5UGF0aC5zcGxpdChcIi9cIik7XG5cdGNvbnN0IG9DYXBhYmlsaXR5UmVzdHJpY3Rpb24gPSB7IGlzRGVsZXRhYmxlOiB0cnVlLCBpc1VwZGF0YWJsZTogdHJ1ZSB9O1xuXHRsZXQgY3VycmVudEVudGl0eVNldDogRW50aXR5U2V0IHwgdW5kZWZpbmVkID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKTtcblx0d2hpbGUgKFxuXHRcdChvQ2FwYWJpbGl0eVJlc3RyaWN0aW9uLmlzRGVsZXRhYmxlIHx8IG9DYXBhYmlsaXR5UmVzdHJpY3Rpb24uaXNVcGRhdGFibGUpICYmXG5cdFx0Y3VycmVudEVudGl0eVNldCAmJlxuXHRcdG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhQYXJ0cy5sZW5ndGggPiAwXG5cdCkge1xuXHRcdGNvbnN0IHBhdGhzVG9DaGVjazogc3RyaW5nW10gPSBbXTtcblx0XHRuYXZpZ2F0aW9uUHJvcGVydHlQYXRoUGFydHMucmVkdWNlKChwYXRocywgbmF2aWdhdGlvblByb3BlcnR5UGF0aFBhcnQpID0+IHtcblx0XHRcdGlmIChwYXRocy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHBhdGhzICs9IFwiL1wiO1xuXHRcdFx0fVxuXHRcdFx0cGF0aHMgKz0gbmF2aWdhdGlvblByb3BlcnR5UGF0aFBhcnQ7XG5cdFx0XHRwYXRoc1RvQ2hlY2sucHVzaChwYXRocyk7XG5cdFx0XHRyZXR1cm4gcGF0aHM7XG5cdFx0fSwgXCJcIik7XG5cdFx0bGV0IGhhc1Jlc3RyaWN0ZWRQYXRoT25EZWxldGUgPSBmYWxzZSxcblx0XHRcdGhhc1Jlc3RyaWN0ZWRQYXRoT25VcGRhdGUgPSBmYWxzZTtcblx0XHRjdXJyZW50RW50aXR5U2V0LmFubm90YXRpb25zLkNhcGFiaWxpdGllcz8uTmF2aWdhdGlvblJlc3RyaWN0aW9ucz8uUmVzdHJpY3RlZFByb3BlcnRpZXMuZm9yRWFjaChcblx0XHRcdChyZXN0cmljdGVkTmF2UHJvcDogTmF2aWdhdGlvblByb3BlcnR5UmVzdHJpY3Rpb25UeXBlcykgPT4ge1xuXHRcdFx0XHRpZiAocmVzdHJpY3RlZE5hdlByb3A/Lk5hdmlnYXRpb25Qcm9wZXJ0eT8udHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIpIHtcblx0XHRcdFx0XHRpZiAocmVzdHJpY3RlZE5hdlByb3AuRGVsZXRlUmVzdHJpY3Rpb25zPy5EZWxldGFibGUgPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRoYXNSZXN0cmljdGVkUGF0aE9uRGVsZXRlID1cblx0XHRcdFx0XHRcdFx0aGFzUmVzdHJpY3RlZFBhdGhPbkRlbGV0ZSB8fCBwYXRoc1RvQ2hlY2suaW5kZXhPZihyZXN0cmljdGVkTmF2UHJvcC5OYXZpZ2F0aW9uUHJvcGVydHkudmFsdWUpICE9PSAtMTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHJlc3RyaWN0ZWROYXZQcm9wLlVwZGF0ZVJlc3RyaWN0aW9ucz8uVXBkYXRhYmxlID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0aGFzUmVzdHJpY3RlZFBhdGhPblVwZGF0ZSA9XG5cdFx0XHRcdFx0XHRcdGhhc1Jlc3RyaWN0ZWRQYXRoT25VcGRhdGUgfHwgcGF0aHNUb0NoZWNrLmluZGV4T2YocmVzdHJpY3RlZE5hdlByb3AuTmF2aWdhdGlvblByb3BlcnR5LnZhbHVlKSAhPT0gLTE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0XHRvQ2FwYWJpbGl0eVJlc3RyaWN0aW9uLmlzRGVsZXRhYmxlID0gIWhhc1Jlc3RyaWN0ZWRQYXRoT25EZWxldGU7XG5cdFx0b0NhcGFiaWxpdHlSZXN0cmljdGlvbi5pc1VwZGF0YWJsZSA9ICFoYXNSZXN0cmljdGVkUGF0aE9uVXBkYXRlO1xuXHRcdGNvbnN0IG5hdlByb3BOYW1lID0gbmF2aWdhdGlvblByb3BlcnR5UGF0aFBhcnRzLnNoaWZ0KCk7XG5cdFx0aWYgKG5hdlByb3BOYW1lKSB7XG5cdFx0XHRjb25zdCBuYXZQcm9wOiBOYXZpZ2F0aW9uUHJvcGVydHkgPSBjdXJyZW50RW50aXR5U2V0LmVudGl0eVR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMuZmluZChcblx0XHRcdFx0bmF2UHJvcCA9PiBuYXZQcm9wLm5hbWUgPT0gbmF2UHJvcE5hbWVcblx0XHRcdCkgYXMgTmF2aWdhdGlvblByb3BlcnR5O1xuXHRcdFx0aWYgKG5hdlByb3AgJiYgIW5hdlByb3AuY29udGFpbnNUYXJnZXQgJiYgY3VycmVudEVudGl0eVNldC5uYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nLmhhc093blByb3BlcnR5KG5hdlByb3BOYW1lKSkge1xuXHRcdFx0XHRjdXJyZW50RW50aXR5U2V0ID0gY3VycmVudEVudGl0eVNldC5uYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nW25hdlByb3BOYW1lXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIENvbnRhaW5lZCBuYXZQcm9wIG1lYW5zIG5vIGVudGl0eVNldCB0byByZXBvcnQgdG9cblx0XHRcdFx0Y3VycmVudEVudGl0eVNldCA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0aWYgKGN1cnJlbnRFbnRpdHlTZXQgIT09IHVuZGVmaW5lZCAmJiBjdXJyZW50RW50aXR5U2V0LmFubm90YXRpb25zKSB7XG5cdFx0aWYgKG9DYXBhYmlsaXR5UmVzdHJpY3Rpb24uaXNEZWxldGFibGUpIHtcblx0XHRcdC8vIElmIHRoZXJlIGlzIHN0aWxsIGFuIGVudGl0eSBzZXQsIGNoZWNrIHRoZSBlbnRpdHkgc2V0IGRlbGV0YWJsZSBzdGF0dXNcblx0XHRcdG9DYXBhYmlsaXR5UmVzdHJpY3Rpb24uaXNEZWxldGFibGUgPSBjdXJyZW50RW50aXR5U2V0LmFubm90YXRpb25zLkNhcGFiaWxpdGllcz8uRGVsZXRlUmVzdHJpY3Rpb25zPy5EZWxldGFibGUgIT09IGZhbHNlO1xuXHRcdH1cblx0XHRpZiAob0NhcGFiaWxpdHlSZXN0cmljdGlvbi5pc1VwZGF0YWJsZSkge1xuXHRcdFx0Ly8gSWYgdGhlcmUgaXMgc3RpbGwgYW4gZW50aXR5IHNldCwgY2hlY2sgdGhlIGVudGl0eSBzZXQgdXBkYXRhYmxlIHN0YXR1c1xuXHRcdFx0b0NhcGFiaWxpdHlSZXN0cmljdGlvbi5pc1VwZGF0YWJsZSA9IGN1cnJlbnRFbnRpdHlTZXQuYW5ub3RhdGlvbnMuQ2FwYWJpbGl0aWVzPy5VcGRhdGVSZXN0cmljdGlvbnM/LlVwZGF0YWJsZSAhPT0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBvQ2FwYWJpbGl0eVJlc3RyaWN0aW9uO1xufVxuXG5mdW5jdGlvbiBnZXRTZWxlY3Rpb25Nb2RlKFxuXHRsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtIHwgdW5kZWZpbmVkLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRpc0VudGl0eVNldDogYm9vbGVhbixcblx0dGFyZ2V0Q2FwYWJpbGl0aWVzOiBUYWJsZUNhcGFiaWxpdHlSZXN0cmljdGlvblxuKTogc3RyaW5nIHtcblx0aWYgKCFsaW5lSXRlbUFubm90YXRpb24pIHtcblx0XHRyZXR1cm4gU2VsZWN0aW9uTW9kZS5Ob25lO1xuXHR9XG5cdGNvbnN0IHRhYmxlTWFuaWZlc3RTZXR0aW5ncyA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbih2aXN1YWxpemF0aW9uUGF0aCk7XG5cdGxldCBzZWxlY3Rpb25Nb2RlID0gdGFibGVNYW5pZmVzdFNldHRpbmdzLnRhYmxlU2V0dGluZ3M/LnNlbGVjdGlvbk1vZGU7XG5cdGNvbnN0IG1hbmlmZXN0QWN0aW9ucyA9IGdldEFjdGlvbnNGcm9tTWFuaWZlc3QoXG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKHZpc3VhbGl6YXRpb25QYXRoKS5hY3Rpb25zLFxuXHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0W10sXG5cdFx0dW5kZWZpbmVkLFxuXHRcdGZhbHNlXG5cdCk7XG5cdGxldCBpc1BhcmVudERlbGV0YWJsZSwgcGFyZW50RW50aXR5U2V0RGVsZXRhYmxlO1xuXHRpZiAoY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLk9iamVjdFBhZ2UpIHtcblx0XHRpc1BhcmVudERlbGV0YWJsZSA9IGlzUGF0aERlbGV0YWJsZShjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKSwgdW5kZWZpbmVkKTtcblx0XHRwYXJlbnRFbnRpdHlTZXREZWxldGFibGUgPSBpc1BhcmVudERlbGV0YWJsZSA/IGNvbXBpbGVCaW5kaW5nKGlzUGFyZW50RGVsZXRhYmxlLCB0cnVlKSA6IGlzUGFyZW50RGVsZXRhYmxlO1xuXHR9XG5cdGlmIChzZWxlY3Rpb25Nb2RlICYmIHNlbGVjdGlvbk1vZGUgPT09IFNlbGVjdGlvbk1vZGUuTm9uZSkge1xuXHRcdGlmICh0YXJnZXRDYXBhYmlsaXRpZXMuaXNEZWxldGFibGUgfHwgcGFyZW50RW50aXR5U2V0RGVsZXRhYmxlICE9PSBcImZhbHNlXCIpIHtcblx0XHRcdHJldHVybiBcIns9ICR7dWk+L2VkaXRNb2RlfSA9PT0gJ0VkaXRhYmxlJyA/ICdcIiArIFNlbGVjdGlvbk1vZGUuTXVsdGkgKyBcIicgOiAnTm9uZSd9XCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNlbGVjdGlvbk1vZGUgPSBTZWxlY3Rpb25Nb2RlLk5vbmU7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKCFzZWxlY3Rpb25Nb2RlIHx8IHNlbGVjdGlvbk1vZGUgPT09IFNlbGVjdGlvbk1vZGUuQXV0bykge1xuXHRcdHNlbGVjdGlvbk1vZGUgPSBTZWxlY3Rpb25Nb2RlLk11bHRpO1xuXHR9XG5cdGlmIChoYXNBY3Rpb25SZXF1aXJpbmdDb250ZXh0KGxpbmVJdGVtQW5ub3RhdGlvbikgfHwgaGFzQWN0aW9uUmVxdWlyaW5nU2VsZWN0aW9uKG1hbmlmZXN0QWN0aW9ucykpIHtcblx0XHRyZXR1cm4gc2VsZWN0aW9uTW9kZTtcblx0fSBlbHNlIGlmICh0YXJnZXRDYXBhYmlsaXRpZXMuaXNEZWxldGFibGUgfHwgcGFyZW50RW50aXR5U2V0RGVsZXRhYmxlICE9PSBcImZhbHNlXCIpIHtcblx0XHRpZiAoIWlzRW50aXR5U2V0KSB7XG5cdFx0XHRyZXR1cm4gXCJ7PSAke3VpPi9lZGl0TW9kZX0gPT09ICdFZGl0YWJsZScgPyAnXCIgKyBzZWxlY3Rpb25Nb2RlICsgXCInIDogJ05vbmUnfVwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0aW9uTW9kZTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIFNlbGVjdGlvbk1vZGUuTm9uZTtcbn1cblxuLyoqXG4gKiBNZXRob2QgdG8gcmV0cmlldmUgYWxsIHRhYmxlIGFjdGlvbnMgZnJvbSBhbm5vdGF0aW9ucy5cbiAqXG4gKiBAcGFyYW0gbGluZUl0ZW1Bbm5vdGF0aW9uXG4gKiBAcGFyYW0gdmlzdWFsaXphdGlvblBhdGhcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcmV0dXJucyB7UmVjb3JkPEJhc2VBY3Rpb24sIEJhc2VBY3Rpb24+fSB0aGUgdGFibGUgYW5ub3RhdGlvbiBhY3Rpb25zXG4gKi9cbmZ1bmN0aW9uIGdldFRhYmxlQW5ub3RhdGlvbkFjdGlvbnMoXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0sXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IEJhc2VBY3Rpb25bXSB7XG5cdGNvbnN0IHRhYmxlQWN0aW9uczogQmFzZUFjdGlvbltdID0gW107XG5cdGlmIChsaW5lSXRlbUFubm90YXRpb24pIHtcblx0XHRsaW5lSXRlbUFubm90YXRpb24uZm9yRWFjaCgoZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKSA9PiB7XG5cdFx0XHRsZXQgdGFibGVBY3Rpb246IEFubm90YXRpb25BY3Rpb24gfCB1bmRlZmluZWQ7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdGlzRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3QoZGF0YUZpZWxkKSAmJlxuXHRcdFx0XHQhKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiA9PT0gdHJ1ZSkgJiZcblx0XHRcdFx0IWRhdGFGaWVsZC5JbmxpbmUgJiZcblx0XHRcdFx0IWRhdGFGaWVsZC5EZXRlcm1pbmluZ1xuXHRcdFx0KSB7XG5cdFx0XHRcdGNvbnN0IGtleSA9IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKTtcblx0XHRcdFx0c3dpdGNoIChkYXRhRmllbGQuJFR5cGUpIHtcblx0XHRcdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCI6XG5cdFx0XHRcdFx0XHR0YWJsZUFjdGlvbiA9IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JBY3Rpb24sXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoZGF0YUZpZWxkLmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHRcdFx0XHRcdGtleToga2V5LFxuXHRcdFx0XHRcdFx0XHRpc05hdmlnYWJsZTogdHJ1ZVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblwiOlxuXHRcdFx0XHRcdFx0dGFibGVBY3Rpb24gPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uLFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdFx0XHRcdFx0XHRrZXk6IGtleVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHRhYmxlQWN0aW9uKSB7XG5cdFx0XHRcdHRhYmxlQWN0aW9ucy5wdXNoKHRhYmxlQWN0aW9uKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gdGFibGVBY3Rpb25zO1xufVxuXG5mdW5jdGlvbiBnZXRDcml0aWNhbGl0eUJpbmRpbmdCeUVudW0oQ3JpdGljYWxpdHlFbnVtOiBFbnVtVmFsdWU8Q3JpdGljYWxpdHlUeXBlPikge1xuXHRsZXQgY3JpdGljYWxpdHlQcm9wZXJ0eTtcblx0c3dpdGNoIChDcml0aWNhbGl0eUVudW0pIHtcblx0XHRjYXNlIFwiVUkuQ3JpdGljYWxpdHlUeXBlL05lZ2F0aXZlXCI6XG5cdFx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gTWVzc2FnZVR5cGUuRXJyb3I7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiVUkuQ3JpdGljYWxpdHlUeXBlL0NyaXRpY2FsXCI6XG5cdFx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gTWVzc2FnZVR5cGUuV2FybmluZztcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJVSS5Dcml0aWNhbGl0eVR5cGUvUG9zaXRpdmVcIjpcblx0XHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5TdWNjZXNzO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9JbmZvcm1hdGlvblwiOlxuXHRcdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLkluZm9ybWF0aW9uO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9OZXV0cmFsXCI6XG5cdFx0ZGVmYXVsdDpcblx0XHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5Ob25lO1xuXHR9XG5cdHJldHVybiBjcml0aWNhbGl0eVByb3BlcnR5O1xufVxuXG5mdW5jdGlvbiBnZXRIaWdobGlnaHRSb3dCaW5kaW5nKFxuXHRjcml0aWNhbGl0eUFubm90YXRpb246IFBhdGhBbm5vdGF0aW9uRXhwcmVzc2lvbjxDcml0aWNhbGl0eVR5cGU+IHwgRW51bVZhbHVlPENyaXRpY2FsaXR5VHlwZT4gfCB1bmRlZmluZWQsXG5cdGlzRHJhZnRSb290OiBib29sZWFuXG4pOiBFeHByZXNzaW9uPE1lc3NhZ2VUeXBlPiB7XG5cdGxldCBkZWZhdWx0SGlnaGxpZ2h0Um93RGVmaW5pdGlvbjogTWVzc2FnZVR5cGUgfCBFeHByZXNzaW9uPE1lc3NhZ2VUeXBlPiA9IE1lc3NhZ2VUeXBlLk5vbmU7XG5cdGlmIChjcml0aWNhbGl0eUFubm90YXRpb24pIHtcblx0XHRpZiAodHlwZW9mIGNyaXRpY2FsaXR5QW5ub3RhdGlvbiA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0ZGVmYXVsdEhpZ2hsaWdodFJvd0RlZmluaXRpb24gPSBhbm5vdGF0aW9uRXhwcmVzc2lvbihjcml0aWNhbGl0eUFubm90YXRpb24pIGFzIEV4cHJlc3Npb248TWVzc2FnZVR5cGU+O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBFbnVtIFZhbHVlIHNvIHdlIGdldCB0aGUgY29ycmVzcG9uZGluZyBzdGF0aWMgcGFydFxuXHRcdFx0ZGVmYXVsdEhpZ2hsaWdodFJvd0RlZmluaXRpb24gPSBnZXRDcml0aWNhbGl0eUJpbmRpbmdCeUVudW0oY3JpdGljYWxpdHlBbm5vdGF0aW9uKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGlmRWxzZShcblx0XHRpc0RyYWZ0Um9vdCAmJiBEcmFmdC5Jc05ld09iamVjdCxcblx0XHRNZXNzYWdlVHlwZS5JbmZvcm1hdGlvbiBhcyBNZXNzYWdlVHlwZSxcblx0XHRmb3JtYXRSZXN1bHQoW2RlZmF1bHRIaWdobGlnaHRSb3dEZWZpbml0aW9uXSwgdGFibGVGb3JtYXR0ZXJzLnJvd0hpZ2hsaWdodGluZylcblx0KTtcbn1cblxuZnVuY3Rpb24gX2dldENyZWF0aW9uQmVoYXZpb3VyKFxuXHRsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtIHwgdW5kZWZpbmVkLFxuXHR0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbjogVGFibGVDb250cm9sQ29uZmlndXJhdGlvbixcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0bmF2aWdhdGlvblNldHRpbmdzOiBOYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9uXG4pOiBUYWJsZUFubm90YXRpb25Db25maWd1cmF0aW9uW1wiY3JlYXRlXCJdIHtcblx0Y29uc3QgbmF2aWdhdGlvbiA9IG5hdmlnYXRpb25TZXR0aW5ncz8uY3JlYXRlIHx8IG5hdmlnYXRpb25TZXR0aW5ncz8uZGV0YWlsO1xuXG5cdC8vIGNyb3NzLWFwcFxuXHRpZiAobmF2aWdhdGlvbj8ub3V0Ym91bmQgJiYgbmF2aWdhdGlvbi5vdXRib3VuZERldGFpbCAmJiBuYXZpZ2F0aW9uU2V0dGluZ3M/LmNyZWF0ZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRtb2RlOiBcIkV4dGVybmFsXCIsXG5cdFx0XHRvdXRib3VuZDogbmF2aWdhdGlvbi5vdXRib3VuZCxcblx0XHRcdG91dGJvdW5kRGV0YWlsOiBuYXZpZ2F0aW9uLm91dGJvdW5kRGV0YWlsLFxuXHRcdFx0bmF2aWdhdGlvblNldHRpbmdzOiBuYXZpZ2F0aW9uU2V0dGluZ3Ncblx0XHR9O1xuXHR9XG5cblx0bGV0IG5ld0FjdGlvbjtcblx0aWYgKGxpbmVJdGVtQW5ub3RhdGlvbikge1xuXHRcdC8vIGluLWFwcFxuXHRcdGNvbnN0IHRhcmdldEVudGl0eVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEFubm90YXRpb25FbnRpdHlUeXBlKGxpbmVJdGVtQW5ub3RhdGlvbik7XG5cdFx0Y29uc3QgdGFyZ2V0QW5ub3RhdGlvbnMgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEZvckVudGl0eVR5cGUodGFyZ2V0RW50aXR5VHlwZSk/LmFubm90YXRpb25zO1xuXHRcdG5ld0FjdGlvbiA9IHRhcmdldEFubm90YXRpb25zPy5Db21tb24/LkRyYWZ0Um9vdD8uTmV3QWN0aW9uIHx8IHRhcmdldEFubm90YXRpb25zPy5TZXNzaW9uPy5TdGlja3lTZXNzaW9uU3VwcG9ydGVkPy5OZXdBY3Rpb247IC8vIFRPRE86IElzIHRoZXJlIHJlYWxseSBubyAnTmV3QWN0aW9uJyBvbiBEcmFmdE5vZGU/IHRhcmdldEFubm90YXRpb25zPy5Db21tb24/LkRyYWZ0Tm9kZT8uTmV3QWN0aW9uXG5cblx0XHRpZiAodGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24uY3JlYXRpb25Nb2RlID09PSBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3cgJiYgbmV3QWN0aW9uKSB7XG5cdFx0XHQvLyBBIGNvbWJpbmF0aW9uIG9mICdDcmVhdGlvblJvdycgYW5kICdOZXdBY3Rpb24nIGRvZXMgbm90IG1ha2Ugc2Vuc2Vcblx0XHRcdC8vIFRPRE86IE9yIGRvZXMgaXQ/XG5cdFx0XHR0aHJvdyBFcnJvcihgQ3JlYXRpb24gbW9kZSAnJHtDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3d9JyBjYW4gbm90IGJlIHVzZWQgd2l0aCBhIGN1c3RvbSAnbmV3JyBhY3Rpb24gKCR7bmV3QWN0aW9ufSlgKTtcblx0XHR9XG5cdFx0aWYgKG5hdmlnYXRpb24/LnJvdXRlKSB7XG5cdFx0XHQvLyByb3V0ZSBzcGVjaWZpZWRcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG1vZGU6IHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLmNyZWF0aW9uTW9kZSxcblx0XHRcdFx0YXBwZW5kOiB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5jcmVhdGVBdEVuZCxcblx0XHRcdFx0bmV3QWN0aW9uOiBuZXdBY3Rpb24sXG5cdFx0XHRcdG5hdmlnYXRlVG9UYXJnZXQ6IHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLmNyZWF0aW9uTW9kZSA9PT0gQ3JlYXRpb25Nb2RlLk5ld1BhZ2UgPyBuYXZpZ2F0aW9uLnJvdXRlIDogdW5kZWZpbmVkIC8vIG5hdmlnYXRlIG9ubHkgaW4gTmV3UGFnZSBtb2RlXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdC8vIG5vIG5hdmlnYXRpb24gb3Igbm8gcm91dGUgc3BlY2lmaWVkIC0gZmFsbGJhY2sgdG8gaW5saW5lIGNyZWF0ZSBpZiBvcmlnaW5hbCBjcmVhdGlvbiBtb2RlIHdhcyAnTmV3UGFnZSdcblx0aWYgKHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLmNyZWF0aW9uTW9kZSA9PT0gQ3JlYXRpb25Nb2RlLk5ld1BhZ2UpIHtcblx0XHR0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5jcmVhdGlvbk1vZGUgPSBDcmVhdGlvbk1vZGUuSW5saW5lO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRtb2RlOiB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5jcmVhdGlvbk1vZGUsXG5cdFx0YXBwZW5kOiB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5jcmVhdGVBdEVuZCxcblx0XHRuZXdBY3Rpb246IG5ld0FjdGlvblxuXHR9O1xufVxuXG5jb25zdCBfZ2V0Um93Q29uZmlndXJhdGlvblByb3BlcnR5ID0gZnVuY3Rpb24oXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0gfCB1bmRlZmluZWQsXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdG5hdmlnYXRpb25TZXR0aW5nczogTmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvbixcblx0dGFyZ2V0UGF0aDogc3RyaW5nXG4pIHtcblx0bGV0IHByZXNzUHJvcGVydHksIG5hdmlnYXRpb25UYXJnZXQ7XG5cdGxldCBjcml0aWNhbGl0eVByb3BlcnR5OiBFeHByZXNzaW9uT3JQcmltaXRpdmU8TWVzc2FnZVR5cGU+ID0gTWVzc2FnZVR5cGUuTm9uZTtcblx0Y29uc3QgdGFyZ2V0RW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbkVudGl0eVR5cGUobGluZUl0ZW1Bbm5vdGF0aW9uKTtcblx0aWYgKG5hdmlnYXRpb25TZXR0aW5ncyAmJiBsaW5lSXRlbUFubm90YXRpb24pIHtcblx0XHRuYXZpZ2F0aW9uVGFyZ2V0ID0gbmF2aWdhdGlvblNldHRpbmdzLmRpc3BsYXk/LnRhcmdldCB8fCBuYXZpZ2F0aW9uU2V0dGluZ3MuZGV0YWlsPy5vdXRib3VuZDtcblx0XHRpZiAobmF2aWdhdGlvblRhcmdldCkge1xuXHRcdFx0cHJlc3NQcm9wZXJ0eSA9XG5cdFx0XHRcdFwiLmhhbmRsZXJzLm9uQ2hldnJvblByZXNzTmF2aWdhdGVPdXRCb3VuZCggJGNvbnRyb2xsZXIgLCdcIiArIG5hdmlnYXRpb25UYXJnZXQgKyBcIicsICR7JHBhcmFtZXRlcnM+YmluZGluZ0NvbnRleHR9KVwiO1xuXHRcdH0gZWxzZSBpZiAodGFyZ2V0RW50aXR5VHlwZSkge1xuXHRcdFx0Y29uc3QgdGFyZ2V0RW50aXR5U2V0ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRGb3JFbnRpdHlUeXBlKHRhcmdldEVudGl0eVR5cGUpO1xuXHRcdFx0bmF2aWdhdGlvblRhcmdldCA9IG5hdmlnYXRpb25TZXR0aW5ncy5kZXRhaWw/LnJvdXRlO1xuXHRcdFx0aWYgKG5hdmlnYXRpb25UYXJnZXQpIHtcblx0XHRcdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IGdldEhpZ2hsaWdodFJvd0JpbmRpbmcoXG5cdFx0XHRcdFx0bGluZUl0ZW1Bbm5vdGF0aW9uLmFubm90YXRpb25zPy5VST8uQ3JpdGljYWxpdHksXG5cdFx0XHRcdFx0ISF0YXJnZXRFbnRpdHlTZXQ/LmFubm90YXRpb25zPy5Db21tb24/LkRyYWZ0Um9vdCB8fCAhIXRhcmdldEVudGl0eVNldD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uRHJhZnROb2RlXG5cdFx0XHRcdCk7XG5cdFx0XHRcdHByZXNzUHJvcGVydHkgPVxuXHRcdFx0XHRcdFwiLl9yb3V0aW5nLm5hdmlnYXRlRm9yd2FyZFRvQ29udGV4dCgkeyRwYXJhbWV0ZXJzPmJpbmRpbmdDb250ZXh0fSwgeyBjYWxsRXh0ZW5zaW9uOiB0cnVlLCB0YXJnZXRQYXRoOiAnXCIgK1xuXHRcdFx0XHRcdHRhcmdldFBhdGggK1xuXHRcdFx0XHRcdFwiJywgZWRpdGFibGUgOiBcIiArXG5cdFx0XHRcdFx0KHRhcmdldEVudGl0eVNldD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uRHJhZnRSb290IHx8IHRhcmdldEVudGl0eVNldD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uRHJhZnROb2RlXG5cdFx0XHRcdFx0XHQ/IFwiISR7JHBhcmFtZXRlcnM+YmluZGluZ0NvbnRleHR9LmdldFByb3BlcnR5KCdJc0FjdGl2ZUVudGl0eScpXCJcblx0XHRcdFx0XHRcdDogXCJ1bmRlZmluZWRcIikgK1xuXHRcdFx0XHRcdFwifSlcIjsgLy9OZWVkIHRvIGFjY2VzcyB0byBEcmFmdFJvb3QgYW5kIERyYWZ0Tm9kZSAhISEhISEhXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gZ2V0SGlnaGxpZ2h0Um93QmluZGluZyhsaW5lSXRlbUFubm90YXRpb24uYW5ub3RhdGlvbnM/LlVJPy5Dcml0aWNhbGl0eSwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRjb25zdCByb3dOYXZpZ2F0ZWRFeHByZXNzaW9uOiBFeHByZXNzaW9uPGJvb2xlYW4+ID0gZm9ybWF0UmVzdWx0KFxuXHRcdFtiaW5kaW5nRXhwcmVzc2lvbihcIi9kZWVwZXN0UGF0aFwiLCBcImludGVybmFsXCIpXSxcblx0XHR0YWJsZUZvcm1hdHRlcnMubmF2aWdhdGVkUm93LFxuXHRcdHRhcmdldEVudGl0eVR5cGVcblx0KTtcblx0cmV0dXJuIHtcblx0XHRwcmVzczogcHJlc3NQcm9wZXJ0eSxcblx0XHRhY3Rpb246IHByZXNzUHJvcGVydHkgPyBcIk5hdmlnYXRpb25cIiA6IHVuZGVmaW5lZCxcblx0XHRyb3dIaWdobGlnaHRpbmc6IGNvbXBpbGVCaW5kaW5nKGNyaXRpY2FsaXR5UHJvcGVydHkpLFxuXHRcdHJvd05hdmlnYXRlZDogY29tcGlsZUJpbmRpbmcocm93TmF2aWdhdGVkRXhwcmVzc2lvbilcblx0fTtcbn07XG5cbi8qKlxuICogUmV0cmlldmUgdGhlIGNvbHVtbnMgZnJvbSB0aGUgZW50aXR5VHlwZS5cbiAqXG4gKiBAcGFyYW0gZW50aXR5VHlwZSBUaGUgdGFyZ2V0IGVudGl0eSB0eXBlLlxuICogQHBhcmFtIGFubm90YXRpb25Db2x1bW5zIFRoZSBhcnJheSBvZiBjb2x1bW5zIGNyZWF0ZWQgYmFzZWQgb24gTGluZUl0ZW0gYW5ub3RhdGlvbnMuXG4gKiBAcGFyYW0gbm9uU29ydGFibGVDb2x1bW5zIFRoZSBhcnJheSBvZiBhbGwgbm9uIHNvcnRhYmxlIGNvbHVtbiBuYW1lcy5cbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dC5cbiAqIEByZXR1cm5zIHtBbm5vdGF0aW9uVGFibGVDb2x1bW5bXX0gdGhlIGNvbHVtbiBmcm9tIHRoZSBlbnRpdHlUeXBlXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDb2x1bW5zRnJvbUVudGl0eVR5cGUgPSBmdW5jdGlvbihcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0YW5ub3RhdGlvbkNvbHVtbnM6IEFubm90YXRpb25UYWJsZUNvbHVtbltdID0gW10sXG5cdG5vblNvcnRhYmxlQ29sdW1uczogc3RyaW5nW10sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IEFubm90YXRpb25UYWJsZUNvbHVtbltdIHtcblx0Y29uc3QgdGFibGVDb2x1bW5zOiBBbm5vdGF0aW9uVGFibGVDb2x1bW5bXSA9IFtdO1xuXHRjb25zdCBhZ2dyZWdhdGlvbkhlbHBlciA9IG5ldyBBZ2dyZWdhdGlvbkhlbHBlcihlbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHRlbnRpdHlUeXBlLmVudGl0eVByb3BlcnRpZXMuZm9yRWFjaCgocHJvcGVydHk6IFByb3BlcnR5KSA9PiB7XG5cdFx0Ly8gQ2F0Y2ggYWxyZWFkeSBleGlzdGluZyBjb2x1bW5zIC0gd2hpY2ggd2VyZSBhZGRlZCBiZWZvcmUgYnkgTGluZUl0ZW0gQW5ub3RhdGlvbnNcblx0XHRjb25zdCBleGlzdHMgPSBhbm5vdGF0aW9uQ29sdW1ucy5zb21lKGNvbHVtbiA9PiB7XG5cdFx0XHRyZXR1cm4gY29sdW1uLm5hbWUgPT09IHByb3BlcnR5Lm5hbWU7XG5cdFx0fSk7XG5cblx0XHQvLyBpZiB0YXJnZXQgdHlwZSBleGlzdHMsIGl0IGlzIGEgY29tcGxleCBwcm9wZXJ0eSBhbmQgc2hvdWxkIGJlIGlnbm9yZWRcblx0XHRpZiAoIXByb3BlcnR5LnRhcmdldFR5cGUgJiYgIWV4aXN0cykge1xuXHRcdFx0dGFibGVDb2x1bW5zLnB1c2goXG5cdFx0XHRcdGdldENvbHVtbkRlZmluaXRpb25Gcm9tUHJvcGVydHkoXG5cdFx0XHRcdFx0cHJvcGVydHksXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKHByb3BlcnR5LmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHRcdFx0cHJvcGVydHkubmFtZSxcblx0XHRcdFx0XHR0cnVlLFxuXHRcdFx0XHRcdHRydWUsXG5cdFx0XHRcdFx0bm9uU29ydGFibGVDb2x1bW5zLFxuXHRcdFx0XHRcdGFnZ3JlZ2F0aW9uSGVscGVyLFxuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gdGFibGVDb2x1bW5zO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSBjb2x1bW4gZGVmaW5pdGlvbiBmcm9tIGEgcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHByb3BlcnR5IHtQcm9wZXJ0eX0gRW50aXR5IHR5cGUgcHJvcGVydHkgZm9yIHdoaWNoIHRoZSBjb2x1bW4gaXMgY3JlYXRlZFxuICogQHBhcmFtIGZ1bGxQcm9wZXJ0eVBhdGgge3N0cmluZ30gdGhlIGZ1bGwgcGF0aCB0byB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcGFyYW0gcmVsYXRpdmVQYXRoIHtzdHJpbmd9IHRoZSByZWxhdGl2ZSBwYXRoIHRvIHRoZSB0YXJnZXQgcHJvcGVydHkgYmFzZWQgb24gdGhlIGNvbnRleHRcbiAqIEBwYXJhbSB1c2VEYXRhRmllbGRQcmVmaXgge2Jvb2xlYW59IHNob3VsZCBiZSBwcmVmaXhlZCB3aXRoIFwiRGF0YUZpZWxkOjpcIiwgZWxzZSBpdCB3aWxsIGJlIHByZWZpeGVkIHdpdGggXCJQcm9wZXJ0eTo6XCJcbiAqIEBwYXJhbSBhdmFpbGFibGVGb3JBZGFwdGF0aW9uIHtib29sZWFufSBkZWNpZGVzIHdoZXRoZXIgY29sdW1uIHNob3VsZCBiZSBhdmFpbGFibGUgZm9yIGFkYXB0YXRpb25cbiAqIEBwYXJhbSBub25Tb3J0YWJsZUNvbHVtbnMge3N0cmluZ1tdfSB0aGUgYXJyYXkgb2YgYWxsIG5vbiBzb3J0YWJsZSBjb2x1bW4gbmFtZXNcbiAqIEBwYXJhbSBhZ2dyZWdhdGlvbkhlbHBlciB7QWdncmVnYXRpb25IZWxwZXJ9IHRoZSBhZ2dyZWdhdGlvbkhlbHBlciBmb3IgdGhlIGVudGl0eVxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQge0NvbnZlcnRlckNvbnRleHR9IHRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHBhcmFtIGRlc2NyaXB0aW9uUHJvcGVydHkge1Byb3BlcnR5fSBFbnRpdHkgdHlwZSBwcm9wZXJ0eSBmb3IgdGhlIGNvbHVtbiBjb250YWluaW5nIHRoZSBkZXNjcmlwdGlvblxuICogQHJldHVybnMge0Fubm90YXRpb25UYWJsZUNvbHVtbn0gdGhlIGFubm90YXRpb24gY29sdW1uIGRlZmluaXRpb25cbiAqL1xuY29uc3QgZ2V0Q29sdW1uRGVmaW5pdGlvbkZyb21Qcm9wZXJ0eSA9IGZ1bmN0aW9uKFxuXHRwcm9wZXJ0eTogUHJvcGVydHksXG5cdGZ1bGxQcm9wZXJ0eVBhdGg6IHN0cmluZyxcblx0cmVsYXRpdmVQYXRoOiBzdHJpbmcsXG5cdHVzZURhdGFGaWVsZFByZWZpeDogYm9vbGVhbixcblx0YXZhaWxhYmxlRm9yQWRhcHRhdGlvbjogYm9vbGVhbixcblx0bm9uU29ydGFibGVDb2x1bW5zOiBzdHJpbmdbXSxcblx0YWdncmVnYXRpb25IZWxwZXI6IEFnZ3JlZ2F0aW9uSGVscGVyLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRkZXNjcmlwdGlvblByb3BlcnR5PzogUHJvcGVydHlcbik6IEFubm90YXRpb25UYWJsZUNvbHVtbiB7XG5cdGNvbnN0IG5hbWUgPSB1c2VEYXRhRmllbGRQcmVmaXggPyByZWxhdGl2ZVBhdGggOiBcIlByb3BlcnR5OjpcIiArIHJlbGF0aXZlUGF0aDtcblx0Y29uc3Qga2V5ID0gKHVzZURhdGFGaWVsZFByZWZpeCA/IFwiRGF0YUZpZWxkOjpcIiA6IFwiUHJvcGVydHk6OlwiKSArIHJlcGxhY2VTcGVjaWFsQ2hhcnMocmVsYXRpdmVQYXRoKTtcblx0Y29uc3Qgc2VtYW50aWNPYmplY3RBbm5vdGF0aW9uUGF0aCA9IGdldFNlbWFudGljT2JqZWN0UGF0aChjb252ZXJ0ZXJDb250ZXh0LCBwcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWUpO1xuXHRjb25zdCBpc0hpZGRlbiA9IHByb3BlcnR5LmFubm90YXRpb25zPy5VST8uSGlkZGVuID09PSB0cnVlO1xuXHRjb25zdCBncm91cFBhdGg6IFN0cmluZyA9IF9zbGljZUF0U2xhc2gocHJvcGVydHkubmFtZSwgdHJ1ZSwgZmFsc2UpO1xuXHRjb25zdCBpc0dyb3VwOiBib29sZWFuID0gZ3JvdXBQYXRoICE9IHByb3BlcnR5Lm5hbWU7XG5cdGNvbnN0IGRlc2NyaXB0aW9uTGFiZWw6IHN0cmluZyB8IHVuZGVmaW5lZCA9IGRlc2NyaXB0aW9uUHJvcGVydHkgPyBfZ2V0TGFiZWwoZGVzY3JpcHRpb25Qcm9wZXJ0eSkgOiB1bmRlZmluZWQ7XG5cdHJldHVybiB7XG5cdFx0a2V5OiBrZXksXG5cdFx0aXNLZXk6IHByb3BlcnR5LmlzS2V5LFxuXHRcdGlzR3JvdXBhYmxlOiBhZ2dyZWdhdGlvbkhlbHBlci5pc1Byb3BlcnR5R3JvdXBhYmxlKHByb3BlcnR5KSxcblx0XHR0eXBlOiBDb2x1bW5UeXBlLkFubm90YXRpb24sXG5cdFx0bGFiZWw6IF9nZXRMYWJlbChwcm9wZXJ0eSwgaXNHcm91cCksXG5cdFx0Z3JvdXBMYWJlbDogaXNHcm91cCA/IF9nZXRMYWJlbChwcm9wZXJ0eSkgOiBudWxsLFxuXHRcdGdyb3VwOiBpc0dyb3VwID8gZ3JvdXBQYXRoIDogbnVsbCxcblx0XHRhbm5vdGF0aW9uUGF0aDogZnVsbFByb3BlcnR5UGF0aCxcblx0XHRzZW1hbnRpY09iamVjdFBhdGg6IHNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGgsXG5cdFx0YXZhaWxhYmlsaXR5OiAhYXZhaWxhYmxlRm9yQWRhcHRhdGlvbiB8fCBpc0hpZGRlbiA/IEF2YWlsYWJpbGl0eVR5cGUuSGlkZGVuIDogQXZhaWxhYmlsaXR5VHlwZS5BZGFwdGF0aW9uLFxuXHRcdG5hbWU6IG5hbWUsXG5cdFx0cmVsYXRpdmVQYXRoOiByZWxhdGl2ZVBhdGgsXG5cdFx0c29ydGFibGU6ICFpc0hpZGRlbiAmJiBub25Tb3J0YWJsZUNvbHVtbnMuaW5kZXhPZihyZWxhdGl2ZVBhdGgpID09PSAtMSxcblx0XHRleHBvcnRTZXR0aW5nczoge1xuXHRcdFx0bGFiZWw6IGRlc2NyaXB0aW9uTGFiZWwgPyBkZXNjcmlwdGlvbkxhYmVsICsgXCIgLSBcIiArIF9nZXRMYWJlbChwcm9wZXJ0eSkgOiB1bmRlZmluZWRcblx0XHR9XG5cdH0gYXMgQW5ub3RhdGlvblRhYmxlQ29sdW1uO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGJvb2xlYW4gdHJ1ZSBmb3IgdmFsaWQgY29sdW1ucywgZmFsc2UgZm9yIGludmFsaWQgY29sdW1ucy5cbiAqXG4gKiBAcGFyYW0ge0RhdGFGaWVsZEFic3RyYWN0VHlwZXN9IGRhdGFGaWVsZCBEaWZmZXJlbnQgRGF0YUZpZWxkIHR5cGVzIGRlZmluZWQgaW4gdGhlIGFubm90YXRpb25zXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBmb3IgdmFsaWQgY29sdW1ucywgZmFsc2UgZm9yIGludmFsaWQgY29sdW1uc1xuICogQHByaXZhdGVcbiAqL1xuY29uc3QgX2lzVmFsaWRDb2x1bW4gPSBmdW5jdGlvbihkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpIHtcblx0c3dpdGNoIChkYXRhRmllbGQuJFR5cGUpIHtcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFjdGlvbjpcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbjpcblx0XHRcdHJldHVybiAhIWRhdGFGaWVsZC5JbmxpbmU7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoQWN0aW9uOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aEludGVudEJhc2VkTmF2aWdhdGlvbjpcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZDpcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhVcmw6XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoOlxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0ZGVmYXVsdDpcblx0XHQvLyBUb2RvOiBSZXBsYWNlIHdpdGggcHJvcGVyIExvZyBzdGF0ZW1lbnQgb25jZSBhdmFpbGFibGVcblx0XHQvLyAgdGhyb3cgbmV3IEVycm9yKFwiVW5oYW5kbGVkIERhdGFGaWVsZCBBYnN0cmFjdCB0eXBlOiBcIiArIGRhdGFGaWVsZC4kVHlwZSk7XG5cdH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBsYWJlbCBmb3IgcHJvcGVydHkgYW5kIGRhdGFGaWVsZC5cbiAqIEBwYXJhbSB7RGF0YUZpZWxkQWJzdHJhY3RUeXBlcyB8IFByb3BlcnR5fSBwcm9wZXJ0eSBFbnRpdHkgdHlwZSBwcm9wZXJ0eSBvciBEYXRhRmllbGQgZGVmaW5lZCBpbiB0aGUgYW5ub3RhdGlvbnNcbiAqIEBwYXJhbSBpc0dyb3VwXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBMYWJlbCBvZiB0aGUgcHJvcGVydHkgb3IgRGF0YUZpZWxkXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBfZ2V0TGFiZWwgPSBmdW5jdGlvbihwcm9wZXJ0eTogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcyB8IFByb3BlcnR5LCBpc0dyb3VwOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRpZiAoIXByb3BlcnR5KSB7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXHRpZiAoaXNQcm9wZXJ0eShwcm9wZXJ0eSkpIHtcblx0XHRyZXR1cm4gcHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uTGFiZWw/LnRvU3RyaW5nKCkgfHwgcHJvcGVydHkubmFtZTtcblx0fSBlbHNlIGlmIChpc0RhdGFGaWVsZFR5cGVzKHByb3BlcnR5KSkge1xuXHRcdGlmICghIWlzR3JvdXAgJiYgcHJvcGVydHkuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoXCIpIHtcblx0XHRcdHJldHVybiBjb21waWxlQmluZGluZyhhbm5vdGF0aW9uRXhwcmVzc2lvbihwcm9wZXJ0eS5MYWJlbCkpO1xuXHRcdH1cblx0XHRyZXR1cm4gcHJvcGVydHkuVmFsdWU/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5Db21tb24/LkxhYmVsIHx8IHByb3BlcnR5LkxhYmVsIHx8IHByb3BlcnR5LlZhbHVlPy4kdGFyZ2V0Py5uYW1lO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBjb21waWxlQmluZGluZyhhbm5vdGF0aW9uRXhwcmVzc2lvbihwcm9wZXJ0eS5MYWJlbCkpO1xuXHR9XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIFByb3BlcnR5SW5mbyBmb3IgZWFjaCBpZGVudGlmaWVkIHByb3BlcnR5IGNvbnN1bWVkIGJ5IGEgTGluZUl0ZW0uXG4gKiBAcGFyYW0gY29sdW1uc1RvQmVDcmVhdGVkIHtSZWNvcmQ8c3RyaW5nLCBQcm9wZXJ0eT59IElkZW50aWZpZWQgcHJvcGVydGllcy5cbiAqIEBwYXJhbSBleGlzdGluZ0NvbHVtbnMgVGhlIGxpc3Qgb2YgY29sdW1ucyBjcmVhdGVkIGZvciBMaW5lSXRlbXMgYW5kIFByb3BlcnRpZXMgb2YgZW50aXR5VHlwZS5cbiAqIEBwYXJhbSBub25Tb3J0YWJsZUNvbHVtbnMgVGhlIGFycmF5IG9mIGNvbHVtbiBuYW1lcyB3aGljaCBjYW5ub3QgYmUgc29ydGVkLlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0LlxuICogQHBhcmFtIGVudGl0eVR5cGUgVGhlIGVudGl0eSB0eXBlIGZvciB0aGUgTGluZUl0ZW1cbiAqIEByZXR1cm5zIHtBbm5vdGF0aW9uVGFibGVDb2x1bW5bXX0gdGhlIGFycmF5IG9mIGNvbHVtbnMgY3JlYXRlZC5cbiAqL1xuY29uc3QgX2NyZWF0ZVJlbGF0ZWRDb2x1bW5zID0gZnVuY3Rpb24oXG5cdGNvbHVtbnNUb0JlQ3JlYXRlZDogUmVjb3JkPHN0cmluZywgQ29sbGVjdGVkUHJvcGVydGllcz4sXG5cdGV4aXN0aW5nQ29sdW1uczogQW5ub3RhdGlvblRhYmxlQ29sdW1uW10sXG5cdG5vblNvcnRhYmxlQ29sdW1uczogc3RyaW5nW10sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGVudGl0eVR5cGU6IEVudGl0eVR5cGVcbik6IEFubm90YXRpb25UYWJsZUNvbHVtbltdIHtcblx0Y29uc3QgcmVsYXRlZENvbHVtbnM6IEFubm90YXRpb25UYWJsZUNvbHVtbltdID0gW107XG5cdGNvbnN0IHJlbGF0ZWRQcm9wZXJ0eU5hbWVNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcblx0Y29uc3QgYWdncmVnYXRpb25IZWxwZXIgPSBuZXcgQWdncmVnYXRpb25IZWxwZXIoZW50aXR5VHlwZSwgY29udmVydGVyQ29udGV4dCk7XG5cblx0T2JqZWN0LmtleXMoY29sdW1uc1RvQmVDcmVhdGVkKS5mb3JFYWNoKG5hbWUgPT4ge1xuXHRcdGNvbnN0IHsgdmFsdWUsIGRlc2NyaXB0aW9uIH0gPSBjb2x1bW5zVG9CZUNyZWF0ZWRbbmFtZV0sXG5cdFx0XHRhbm5vdGF0aW9uUGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0QWJzb2x1dGVBbm5vdGF0aW9uUGF0aChuYW1lKSxcblx0XHRcdC8vIENoZWNrIHdoZXRoZXIgdGhlIHJlbGF0ZWQgY29sdW1uIGFscmVhZHkgZXhpc3RzLlxuXHRcdFx0cmVsYXRlZENvbHVtbiA9IGV4aXN0aW5nQ29sdW1ucy5maW5kKGNvbHVtbiA9PiBjb2x1bW4ubmFtZSA9PT0gbmFtZSk7XG5cdFx0aWYgKHJlbGF0ZWRDb2x1bW4gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gQ2FzZSAxOiBDcmVhdGUgYSBuZXcgcHJvcGVydHkgY29sdW1uIGFuZCBzZXQgaXQgdG8gaGlkZGVuLlxuXHRcdFx0Ly8gS2V5IGNvbnRhaW5zIERhdGFGaWVsZCBwcmVmaXggdG8gZW5zdXJlIGFsbCBwcm9wZXJ0eSBjb2x1bW5zIGhhdmUgdGhlIHNhbWUga2V5IGZvcm1hdC5cblx0XHRcdHJlbGF0ZWRDb2x1bW5zLnB1c2goXG5cdFx0XHRcdGdldENvbHVtbkRlZmluaXRpb25Gcm9tUHJvcGVydHkoXG5cdFx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblBhdGgsXG5cdFx0XHRcdFx0bmFtZSxcblx0XHRcdFx0XHR0cnVlLFxuXHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdG5vblNvcnRhYmxlQ29sdW1ucyxcblx0XHRcdFx0XHRhZ2dyZWdhdGlvbkhlbHBlcixcblx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0fSBlbHNlIGlmIChyZWxhdGVkQ29sdW1uLmFubm90YXRpb25QYXRoICE9PSBhbm5vdGF0aW9uUGF0aCkge1xuXHRcdFx0Ly8gQ2FzZSAyOiBUaGUgZXhpc3RpbmcgY29sdW1uIHBvaW50cyB0byBhIExpbmVJdGVtLlxuXHRcdFx0Y29uc3QgbmV3TmFtZSA9IFwiUHJvcGVydHk6OlwiICsgbmFtZTtcblx0XHRcdC8vIENoZWNraW5nIHdoZXRoZXIgdGhlIHJlbGF0ZWQgcHJvcGVydHkgY29sdW1uIGhhcyBhbHJlYWR5IGJlZW4gY3JlYXRlZCBpbiBhIHByZXZpb3VzIGl0ZXJhdGlvbi5cblx0XHRcdGlmICghZXhpc3RpbmdDb2x1bW5zLnNvbWUoY29sdW1uID0+IGNvbHVtbi5uYW1lID09PSBuZXdOYW1lKSkge1xuXHRcdFx0XHQvLyBDcmVhdGUgYSBuZXcgcHJvcGVydHkgY29sdW1uIHdpdGggJ1Byb3BlcnR5OjonIHByZWZpeCxcblx0XHRcdFx0Ly8gU2V0IGl0IHRvIGhpZGRlbiBhcyBpdCBpcyBvbmx5IGNvbnN1bWVkIGJ5IENvbXBsZXggcHJvcGVydHkgaW5mb3MuXG5cdFx0XHRcdHJlbGF0ZWRDb2x1bW5zLnB1c2goXG5cdFx0XHRcdFx0Z2V0Q29sdW1uRGVmaW5pdGlvbkZyb21Qcm9wZXJ0eShcblx0XHRcdFx0XHRcdHZhbHVlLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvblBhdGgsXG5cdFx0XHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRcdG5vblNvcnRhYmxlQ29sdW1ucyxcblx0XHRcdFx0XHRcdGFnZ3JlZ2F0aW9uSGVscGVyLFxuXHRcdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdFx0cmVsYXRlZFByb3BlcnR5TmFtZU1hcFtuYW1lXSA9IG5ld05hbWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBUaGUgcHJvcGVydHkgJ25hbWUnIGhhcyBiZWVuIHByZWZpeGVkIHdpdGggJ1Byb3BlcnR5OjonIGZvciB1bmlxdWVuZXNzLlxuXHQvLyBVcGRhdGUgdGhlIHNhbWUgaW4gb3RoZXIgcHJvcGVydHlJbmZvc1tdIHJlZmVyZW5jZXMgd2hpY2ggcG9pbnQgdG8gdGhpcyBwcm9wZXJ0eS5cblx0ZXhpc3RpbmdDb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcblx0XHRjb2x1bW4ucHJvcGVydHlJbmZvcyA9IGNvbHVtbi5wcm9wZXJ0eUluZm9zPy5tYXAocHJvcGVydHlJbmZvID0+IHJlbGF0ZWRQcm9wZXJ0eU5hbWVNYXBbcHJvcGVydHlJbmZvXSA/PyBwcm9wZXJ0eUluZm8pO1xuXHR9KTtcblx0cmV0dXJuIHJlbGF0ZWRDb2x1bW5zO1xufTtcblxuLyoqXG4gKiBHZXR0aW5nIHRoZSBDb2x1bW4gTmFtZVxuICogSWYgaXQgcG9pbnRzIHRvIGEgRGF0YUZpZWxkIHdpdGggb25lIHByb3BlcnR5IG9yIERhdGFQb2ludCB3aXRoIG9uZSBwcm9wZXJ0eSBpdCB3aWxsIHVzZSB0aGUgcHJvcGVydHkgbmFtZVxuICogaGVyZSB0byBiZSBjb25zaXN0ZW50IHdpdGggdGhlIGV4aXN0aW5nIGZsZXggY2hhbmdlcy5cbiAqXG4gKiBAcGFyYW0ge0RhdGFGaWVsZEFic3RyYWN0VHlwZXN9IGRhdGFGaWVsZCBEaWZmZXJlbnQgRGF0YUZpZWxkIHR5cGVzIGRlZmluZWQgaW4gdGhlIGFubm90YXRpb25zXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIG5hbWUgb2YgYW5ub3RhdGlvbiBjb2x1bW5zXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBfZ2V0QW5ub3RhdGlvbkNvbHVtbk5hbWUgPSBmdW5jdGlvbihkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpIHtcblx0Ly8gVGhpcyBpcyBuZWVkZWQgYXMgd2UgaGF2ZSBmbGV4aWJpbGl0eSBjaGFuZ2VzIGFscmVhZHkgdGhhdCB3ZSBoYXZlIHRvIGNoZWNrIGFnYWluc3Rcblx0aWYgKGlzRGF0YUZpZWxkVHlwZXMoZGF0YUZpZWxkKSkge1xuXHRcdHJldHVybiBkYXRhRmllbGQuVmFsdWU/LnBhdGg7XG5cdH0gZWxzZSBpZiAoZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uICYmIGRhdGFGaWVsZC5UYXJnZXQ/LiR0YXJnZXQ/LlZhbHVlPy5wYXRoKSB7XG5cdFx0Ly8gVGhpcyBpcyBmb3IgcmVtb3ZpbmcgZHVwbGljYXRlIHByb3BlcnRpZXMuIEZvciBleGFtcGxlLCAnUHJvZ3Jlc3MnIFByb3BlcnR5IGlzIHJlbW92ZWQgaWYgaXQgaXMgYWxyZWFkeSBkZWZpbmVkIGFzIGEgRGF0YVBvaW50XG5cdFx0cmV0dXJuIGRhdGFGaWVsZC5UYXJnZXQuJHRhcmdldC5WYWx1ZS5wYXRoO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCk7XG5cdH1cbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lIHRoZSBwcm9wZXJ0eSByZWxhdGl2ZSBwYXRoIHdpdGggcmVzcGVjdCB0byB0aGUgcm9vdCBlbnRpdHkuXG4gKiBAcGFyYW0gZGF0YUZpZWxkIFRoZSBEYXRhIGZpZWxkIGJlaW5nIHByb2Nlc3NlZC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSByZWxhdGl2ZSBwYXRoXG4gKi9cbmNvbnN0IF9nZXRSZWxhdGl2ZVBhdGggPSBmdW5jdGlvbihkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpOiBzdHJpbmcge1xuXHRsZXQgcmVsYXRpdmVQYXRoOiBzdHJpbmcgPSBcIlwiO1xuXG5cdHN3aXRjaCAoZGF0YUZpZWxkLiRUeXBlKSB7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGQ6XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoTmF2aWdhdGlvblBhdGg6XG5cdFx0XHRyZWxhdGl2ZVBhdGggPSAoZGF0YUZpZWxkIGFzIERhdGFGaWVsZCk/LlZhbHVlPy5wYXRoO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFubm90YXRpb246XG5cdFx0XHRyZWxhdGl2ZVBhdGggPSAoZGF0YUZpZWxkIGFzIERhdGFGaWVsZEZvckFubm90YXRpb24pPy5UYXJnZXQ/LnZhbHVlO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFjdGlvbjpcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbjpcblx0XHRcdHJlbGF0aXZlUGF0aCA9IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKTtcblx0XHRcdGJyZWFrO1xuXHR9XG5cblx0cmV0dXJuIHJlbGF0aXZlUGF0aDtcbn07XG5cbmNvbnN0IF9zbGljZUF0U2xhc2ggPSBmdW5jdGlvbihwYXRoOiBTdHJpbmcsIGlzTGFzdFNsYXNoOiBib29sZWFuLCBpc0xhc3RQYXJ0OiBib29sZWFuKSB7XG5cdGNvbnN0IGlTbGFzaEluZGV4ID0gaXNMYXN0U2xhc2ggPyBwYXRoLmxhc3RJbmRleE9mKFwiL1wiKSA6IHBhdGguaW5kZXhPZihcIi9cIik7XG5cblx0aWYgKGlTbGFzaEluZGV4ID09PSAtMSkge1xuXHRcdHJldHVybiBwYXRoO1xuXHR9XG5cdHJldHVybiBpc0xhc3RQYXJ0ID8gcGF0aC5zdWJzdHJpbmcoaVNsYXNoSW5kZXggKyAxLCBwYXRoLmxlbmd0aCkgOiBwYXRoLnN1YnN0cmluZygwLCBpU2xhc2hJbmRleCk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgbGluZSBpdGVtcyBmcm9tIG1ldGFkYXRhIGFubm90YXRpb25zLlxuICpcbiAqIEBwYXJhbSBsaW5lSXRlbUFubm90YXRpb25cbiAqIEBwYXJhbSB2aXN1YWxpemF0aW9uUGF0aFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIHtUYWJsZUNvbHVtbltdfSB0aGUgY29sdW1ucyBmcm9tIHRoZSBhbm5vdGF0aW9uc1xuICovXG5jb25zdCBnZXRDb2x1bW5zRnJvbUFubm90YXRpb25zID0gZnVuY3Rpb24oXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0sXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IFRhYmxlQ29sdW1uW10ge1xuXHRjb25zdCBlbnRpdHlUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uRW50aXR5VHlwZShsaW5lSXRlbUFubm90YXRpb24pLFxuXHRcdGFubm90YXRpb25Db2x1bW5zOiBBbm5vdGF0aW9uVGFibGVDb2x1bW5bXSA9IFtdLFxuXHRcdGNvbHVtbnNUb0JlQ3JlYXRlZDogUmVjb3JkPHN0cmluZywgQ29sbGVjdGVkUHJvcGVydGllcz4gPSB7fSxcblx0XHRub25Tb3J0YWJsZUNvbHVtbnM6IHN0cmluZ1tdID1cblx0XHRcdChjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpPy5hbm5vdGF0aW9ucz8uQ2FwYWJpbGl0aWVzPy5Tb3J0UmVzdHJpY3Rpb25zXG5cdFx0XHRcdD8uTm9uU29ydGFibGVQcm9wZXJ0aWVzIGFzIEVkbS5Qcm9wZXJ0eVBhdGhbXSk/Lm1hcCgocHJvcGVydHk6IFByb3BlcnR5UGF0aCkgPT4gcHJvcGVydHkudmFsdWUpID8/IFtdO1xuXG5cdGlmIChsaW5lSXRlbUFubm90YXRpb24pIHtcblx0XHQvLyBHZXQgY29sdW1ucyBmcm9tIHRoZSBMaW5lSXRlbSBBbm5vdGF0aW9uXG5cdFx0bGluZUl0ZW1Bbm5vdGF0aW9uLmZvckVhY2gobGluZUl0ZW0gPT4ge1xuXHRcdFx0aWYgKCFfaXNWYWxpZENvbHVtbihsaW5lSXRlbSkpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgc2VtYW50aWNPYmplY3RBbm5vdGF0aW9uUGF0aCA9XG5cdFx0XHRcdGlzRGF0YUZpZWxkVHlwZXMobGluZUl0ZW0pICYmIGxpbmVJdGVtLlZhbHVlPy4kdGFyZ2V0Py5mdWxseVF1YWxpZmllZE5hbWVcblx0XHRcdFx0XHQ/IGdldFNlbWFudGljT2JqZWN0UGF0aChjb252ZXJ0ZXJDb250ZXh0LCBsaW5lSXRlbSlcblx0XHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRcdGNvbnN0IHJlbGF0aXZlUGF0aCA9IF9nZXRSZWxhdGl2ZVBhdGgobGluZUl0ZW0pO1xuXHRcdFx0Ly8gRGV0ZXJtaW5lIHByb3BlcnRpZXMgd2hpY2ggYXJlIGNvbnN1bWVkIGJ5IHRoaXMgTGluZUl0ZW0uXG5cdFx0XHRjb25zdCByZWxhdGVkUHJvcGVydGllc0luZm86IENvbXBsZXhQcm9wZXJ0eUluZm8gPSBjb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMobGluZUl0ZW0sIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0Y29uc3QgcmVsYXRlZFByb3BlcnR5TmFtZXM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMocmVsYXRlZFByb3BlcnRpZXNJbmZvLnByb3BlcnRpZXMpO1xuXHRcdFx0Y29uc3QgZ3JvdXBQYXRoOiBTdHJpbmcgPSBfc2xpY2VBdFNsYXNoKHJlbGF0aXZlUGF0aCwgdHJ1ZSwgZmFsc2UpO1xuXHRcdFx0Y29uc3QgaXNHcm91cDogYm9vbGVhbiA9IGdyb3VwUGF0aCAhPSByZWxhdGl2ZVBhdGg7XG5cdFx0XHRhbm5vdGF0aW9uQ29sdW1ucy5wdXNoKHtcblx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChsaW5lSXRlbS5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdFx0XHRzZW1hbnRpY09iamVjdFBhdGg6IHNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGgsXG5cdFx0XHRcdHR5cGU6IENvbHVtblR5cGUuQW5ub3RhdGlvbixcblx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGxpbmVJdGVtKSxcblx0XHRcdFx0d2lkdGg6IGxpbmVJdGVtLmFubm90YXRpb25zPy5IVE1MNT8uQ3NzRGVmYXVsdHM/LndpZHRoIHx8IHVuZGVmaW5lZCxcblx0XHRcdFx0YXZhaWxhYmlsaXR5OiBpc0RhdGFGaWVsZEFsd2F5c0hpZGRlbihsaW5lSXRlbSkgPyBBdmFpbGFiaWxpdHlUeXBlLkhpZGRlbiA6IEF2YWlsYWJpbGl0eVR5cGUuRGVmYXVsdCxcblx0XHRcdFx0cHJvcGVydHlJbmZvczogcmVsYXRlZFByb3BlcnR5TmFtZXMubGVuZ3RoID4gMCA/IHJlbGF0ZWRQcm9wZXJ0eU5hbWVzIDogdW5kZWZpbmVkLFxuXHRcdFx0XHRuYW1lOiBfZ2V0QW5ub3RhdGlvbkNvbHVtbk5hbWUobGluZUl0ZW0pLFxuXHRcdFx0XHRncm91cExhYmVsOiBpc0dyb3VwID8gX2dldExhYmVsKGxpbmVJdGVtKSA6IG51bGwsXG5cdFx0XHRcdGdyb3VwOiBpc0dyb3VwID8gZ3JvdXBQYXRoIDogbnVsbCxcblx0XHRcdFx0bGFiZWw6IF9nZXRMYWJlbChsaW5lSXRlbSwgaXNHcm91cCksXG5cdFx0XHRcdHJlbGF0aXZlUGF0aDogcmVsYXRpdmVQYXRoLFxuXHRcdFx0XHRpc05hdmlnYWJsZTogdHJ1ZSxcblx0XHRcdFx0c29ydGFibGU6IGxpbmVJdGVtLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGQgJiYgbm9uU29ydGFibGVDb2x1bW5zLmluZGV4T2YocmVsYXRpdmVQYXRoKSA9PT0gLTEsXG5cdFx0XHRcdGV4cG9ydFNldHRpbmdzOiB7XG5cdFx0XHRcdFx0dGVtcGxhdGU6IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5leHBvcnRTZXR0aW5nc1RlbXBsYXRlXG5cdFx0XHRcdH1cblx0XHRcdH0gYXMgQW5ub3RhdGlvblRhYmxlQ29sdW1uKTtcblxuXHRcdFx0Ly8gQ29sbGVjdCBpbmZvcm1hdGlvbiBvZiByZWxhdGVkIGNvbHVtbnMgdG8gYmUgY3JlYXRlZC5cblx0XHRcdHJlbGF0ZWRQcm9wZXJ0eU5hbWVzLmZvckVhY2gobmFtZSA9PiB7XG5cdFx0XHRcdGNvbHVtbnNUb0JlQ3JlYXRlZFtuYW1lXSA9IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5wcm9wZXJ0aWVzW25hbWVdO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBHZXQgY29sdW1ucyBmcm9tIHRoZSBQcm9wZXJ0aWVzIG9mIEVudGl0eVR5cGVcblx0bGV0IHRhYmxlQ29sdW1ucyA9IGdldENvbHVtbnNGcm9tRW50aXR5VHlwZShlbnRpdHlUeXBlLCBhbm5vdGF0aW9uQ29sdW1ucywgbm9uU29ydGFibGVDb2x1bW5zLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0dGFibGVDb2x1bW5zID0gdGFibGVDb2x1bW5zLmNvbmNhdChhbm5vdGF0aW9uQ29sdW1ucyk7XG5cblx0Ly8gQ3JlYXRlIGEgcHJvcGVydHlJbmZvIGZvciBlYWNoIHJlbGF0ZWQgcHJvcGVydHkuXG5cdGNvbnN0IHJlbGF0ZWRDb2x1bW5zID0gX2NyZWF0ZVJlbGF0ZWRDb2x1bW5zKGNvbHVtbnNUb0JlQ3JlYXRlZCwgdGFibGVDb2x1bW5zLCBub25Tb3J0YWJsZUNvbHVtbnMsIGNvbnZlcnRlckNvbnRleHQsIGVudGl0eVR5cGUpO1xuXHR0YWJsZUNvbHVtbnMgPSB0YWJsZUNvbHVtbnMuY29uY2F0KHJlbGF0ZWRDb2x1bW5zKTtcblxuXHRyZXR1cm4gdGFibGVDb2x1bW5zO1xufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBwcm9wZXJ0eSBuYW1lcyBmcm9tIHRoZSBtYW5pZmVzdCBhbmQgY2hlY2tzIGFnYWluc3QgZXhpc3RpbmcgcHJvcGVydGllcyBhbHJlYWR5IGFkZGVkIGJ5IGFubm90YXRpb25zLlxuICogSWYgYSBub3QgeWV0IHN0b3JlZCBwcm9wZXJ0eSBpcyBmb3VuZCBpdCBhZGRzIGl0IGZvciBzb3J0aW5nIGFuZCBmaWx0ZXJpbmcgb25seSB0byB0aGUgYW5ub3RhdGlvbkNvbHVtbnMuXG4gKiBAcGFyYW0gcHJvcGVydGllcyB7c3RyaW5nW10gfCB1bmRlZmluZWR9XG4gKiBAcGFyYW0gYW5ub3RhdGlvbkNvbHVtbnMge0Fubm90YXRpb25UYWJsZUNvbHVtbltdfVxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQge0NvbnZlcnRlckNvbnRleHR9XG4gKiBAcGFyYW0gZW50aXR5VHlwZVxuICogQHJldHVybnMge3N0cmluZ1tdfSB0aGUgY29sdW1ucyBmcm9tIHRoZSBhbm5vdGF0aW9uc1xuICovXG5jb25zdCBfZ2V0UHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uKFxuXHRwcm9wZXJ0aWVzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCxcblx0YW5ub3RhdGlvbkNvbHVtbnM6IEFubm90YXRpb25UYWJsZUNvbHVtbltdLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRlbnRpdHlUeXBlOiBFbnRpdHlUeXBlXG4pOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCB7XG5cdGxldCBtYXRjaGVkUHJvcGVydGllczogc3RyaW5nW10gfCB1bmRlZmluZWQ7XG5cblx0aWYgKHByb3BlcnRpZXMpIHtcblx0XHRtYXRjaGVkUHJvcGVydGllcyA9IHByb3BlcnRpZXMubWFwKGZ1bmN0aW9uKHByb3BlcnR5UGF0aCkge1xuXHRcdFx0Y29uc3QgYW5ub3RhdGlvbkNvbHVtbiA9IGFubm90YXRpb25Db2x1bW5zLmZpbmQoZnVuY3Rpb24oYW5ub3RhdGlvbkNvbHVtbikge1xuXHRcdFx0XHRyZXR1cm4gYW5ub3RhdGlvbkNvbHVtbi5yZWxhdGl2ZVBhdGggPT09IHByb3BlcnR5UGF0aCAmJiBhbm5vdGF0aW9uQ29sdW1uLnByb3BlcnR5SW5mb3MgPT09IHVuZGVmaW5lZDtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKGFubm90YXRpb25Db2x1bW4pIHtcblx0XHRcdFx0cmV0dXJuIGFubm90YXRpb25Db2x1bW4ubmFtZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHJlbGF0ZWRDb2x1bW5zID0gX2NyZWF0ZVJlbGF0ZWRDb2x1bW5zKFxuXHRcdFx0XHRcdHsgW3Byb3BlcnR5UGF0aF06IHsgdmFsdWU6IGVudGl0eVR5cGUucmVzb2x2ZVBhdGgocHJvcGVydHlQYXRoKSB9IH0sXG5cdFx0XHRcdFx0YW5ub3RhdGlvbkNvbHVtbnMsXG5cdFx0XHRcdFx0W10sXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdFx0XHRlbnRpdHlUeXBlXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGFubm90YXRpb25Db2x1bW5zLnB1c2gocmVsYXRlZENvbHVtbnNbMF0pO1xuXHRcdFx0XHRyZXR1cm4gcmVsYXRlZENvbHVtbnNbMF0ubmFtZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiBtYXRjaGVkUHJvcGVydGllcztcbn07XG5cbi8qKlxuICogUmV0dXJucyB0YWJsZSBjb2x1bW4gZGVmaW5pdGlvbnMgZnJvbSBtYW5pZmVzdC5cbiAqIEBwYXJhbSBjb2x1bW5zXG4gKiBAcGFyYW0gYW5ub3RhdGlvbkNvbHVtbnNcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0gZW50aXR5VHlwZVxuICogQHBhcmFtIG5hdmlnYXRpb25TZXR0aW5nc1xuICogQHJldHVybnMge1JlY29yZDxzdHJpbmcsIEN1c3RvbUNvbHVtbj59IHRoZSBjb2x1bW5zIGZyb20gdGhlIG1hbmlmZXN0XG4gKi9cbmNvbnN0IGdldENvbHVtbnNGcm9tTWFuaWZlc3QgPSBmdW5jdGlvbihcblx0Y29sdW1uczogUmVjb3JkPHN0cmluZywgTWFuaWZlc3RUYWJsZUNvbHVtbj4sXG5cdGFubm90YXRpb25Db2x1bW5zOiBBbm5vdGF0aW9uVGFibGVDb2x1bW5bXSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0bmF2aWdhdGlvblNldHRpbmdzPzogTmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvblxuKTogUmVjb3JkPHN0cmluZywgQ3VzdG9tQ29sdW1uPiB7XG5cdGNvbnN0IGludGVybmFsQ29sdW1uczogUmVjb3JkPHN0cmluZywgQ3VzdG9tQ29sdW1uPiA9IHt9O1xuXG5cdGZvciAoY29uc3Qga2V5IGluIGNvbHVtbnMpIHtcblx0XHRjb25zdCBtYW5pZmVzdENvbHVtbiA9IGNvbHVtbnNba2V5XTtcblxuXHRcdEtleUhlbHBlci52YWxpZGF0ZUtleShrZXkpO1xuXG5cdFx0aW50ZXJuYWxDb2x1bW5zW2tleV0gPSB7XG5cdFx0XHRrZXk6IGtleSxcblx0XHRcdGlkOiBcIkN1c3RvbUNvbHVtbjo6XCIgKyBrZXksXG5cdFx0XHRuYW1lOiBcIkN1c3RvbUNvbHVtbjo6XCIgKyBrZXksXG5cdFx0XHRoZWFkZXI6IG1hbmlmZXN0Q29sdW1uLmhlYWRlcixcblx0XHRcdHdpZHRoOiBtYW5pZmVzdENvbHVtbi53aWR0aCB8fCB1bmRlZmluZWQsXG5cdFx0XHRob3Jpem9udGFsQWxpZ246IG1hbmlmZXN0Q29sdW1uLmhvcml6b250YWxBbGlnbiA9PT0gdW5kZWZpbmVkID8gSG9yaXpvbnRhbEFsaWduLkJlZ2luIDogbWFuaWZlc3RDb2x1bW4uaG9yaXpvbnRhbEFsaWduLFxuXHRcdFx0dHlwZTogQ29sdW1uVHlwZS5EZWZhdWx0LFxuXHRcdFx0YXZhaWxhYmlsaXR5OiBtYW5pZmVzdENvbHVtbi5hdmFpbGFiaWxpdHkgfHwgQXZhaWxhYmlsaXR5VHlwZS5EZWZhdWx0LFxuXHRcdFx0dGVtcGxhdGU6IG1hbmlmZXN0Q29sdW1uLnRlbXBsYXRlIHx8IFwidW5kZWZpbmVkXCIsXG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHRhbmNob3I6IG1hbmlmZXN0Q29sdW1uLnBvc2l0aW9uPy5hbmNob3IsXG5cdFx0XHRcdHBsYWNlbWVudDogbWFuaWZlc3RDb2x1bW4ucG9zaXRpb24gPT09IHVuZGVmaW5lZCA/IFBsYWNlbWVudC5BZnRlciA6IG1hbmlmZXN0Q29sdW1uLnBvc2l0aW9uLnBsYWNlbWVudFxuXHRcdFx0fSxcblx0XHRcdGlzTmF2aWdhYmxlOiBpc0FjdGlvbk5hdmlnYWJsZShtYW5pZmVzdENvbHVtbiwgbmF2aWdhdGlvblNldHRpbmdzLCB0cnVlKSxcblx0XHRcdHNldHRpbmdzOiBtYW5pZmVzdENvbHVtbi5zZXR0aW5ncyxcblx0XHRcdHNvcnRhYmxlOiBmYWxzZSxcblx0XHRcdHByb3BlcnR5SW5mb3M6IF9nZXRQcm9wZXJ0eU5hbWVzKG1hbmlmZXN0Q29sdW1uLnByb3BlcnRpZXMsIGFubm90YXRpb25Db2x1bW5zLCBjb252ZXJ0ZXJDb250ZXh0LCBlbnRpdHlUeXBlKVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIGludGVybmFsQ29sdW1ucztcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQMTNuTW9kZSh2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyOiBNYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRjb25zdCB0YWJsZU1hbmlmZXN0U2V0dGluZ3M6IFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKHZpc3VhbGl6YXRpb25QYXRoKTtcblx0Y29uc3QgdmFyaWFudE1hbmFnZW1lbnQ6IFZhcmlhbnRNYW5hZ2VtZW50VHlwZSA9IG1hbmlmZXN0V3JhcHBlci5nZXRWYXJpYW50TWFuYWdlbWVudCgpO1xuXHRjb25zdCBoYXNWYXJpYW50TWFuYWdlbWVudDogYm9vbGVhbiA9IFtcIlBhZ2VcIiwgXCJDb250cm9sXCJdLmluZGV4T2YodmFyaWFudE1hbmFnZW1lbnQpID4gLTE7XG5cdGNvbnN0IGFQZXJzb25hbGl6YXRpb246IHN0cmluZ1tdID0gW107XG5cdGlmIChoYXNWYXJpYW50TWFuYWdlbWVudCkge1xuXHRcdGlmICh0YWJsZU1hbmlmZXN0U2V0dGluZ3M/LnRhYmxlU2V0dGluZ3M/LnBlcnNvbmFsaXphdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyBQZXJzb25hbGl6YXRpb24gY29uZmlndXJlZCBpbiBtYW5pZmVzdC5cblx0XHRcdGNvbnN0IHBlcnNvbmFsaXphdGlvbjogYW55ID0gdGFibGVNYW5pZmVzdFNldHRpbmdzLnRhYmxlU2V0dGluZ3MucGVyc29uYWxpemF0aW9uO1xuXHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbiA9PT0gdHJ1ZSkge1xuXHRcdFx0XHQvLyBUYWJsZSBwZXJzb25hbGl6YXRpb24gZnVsbHkgZW5hYmxlZC5cblx0XHRcdFx0cmV0dXJuIFwiU29ydCxDb2x1bW4sRmlsdGVyXCI7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBwZXJzb25hbGl6YXRpb24gPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0Ly8gU3BlY2lmaWMgcGVyc29uYWxpemF0aW9uIG9wdGlvbnMgZW5hYmxlZCBpbiBtYW5pZmVzdC4gVXNlIHRoZW0gYXMgaXMuXG5cdFx0XHRcdGlmIChwZXJzb25hbGl6YXRpb24uc29ydCkge1xuXHRcdFx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIlNvcnRcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbi5jb2x1bW4pIHtcblx0XHRcdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJDb2x1bW5cIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbi5maWx0ZXIpIHtcblx0XHRcdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJGaWx0ZXJcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGFQZXJzb25hbGl6YXRpb24ubGVuZ3RoID4gMCA/IGFQZXJzb25hbGl6YXRpb24uam9pbihcIixcIikgOiB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIE5vIHBlcnNvbmFsaXphdGlvbiBjb25maWd1cmVkIGluIG1hbmlmZXN0LlxuXHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiU29ydFwiKTtcblx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIkNvbHVtblwiKTtcblx0XHRcdGlmICh2YXJpYW50TWFuYWdlbWVudCA9PT0gVmFyaWFudE1hbmFnZW1lbnRUeXBlLkNvbnRyb2wpIHtcblx0XHRcdFx0Ly8gRmVhdHVyZSBwYXJpdHkgd2l0aCBWMi5cblx0XHRcdFx0Ly8gRW5hYmxlIHRhYmxlIGZpbHRlcmluZyBieSBkZWZhdWx0IG9ubHkgaW4gY2FzZSBvZiBDb250cm9sIGxldmVsIHZhcmlhbnQgbWFuYWdlbWVudC5cblx0XHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiRmlsdGVyXCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGFQZXJzb25hbGl6YXRpb24uam9pbihcIixcIik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGdldERlbGV0ZUhpZGRlbihjdXJyZW50RW50aXR5U2V0OiBFbnRpdHlTZXQgfCB1bmRlZmluZWQsIG5hdmlnYXRpb25QYXRoOiBzdHJpbmcpIHtcblx0bGV0IGlzRGVsZXRlSGlkZGVuOiBhbnkgPSBmYWxzZTtcblx0aWYgKGN1cnJlbnRFbnRpdHlTZXQgJiYgbmF2aWdhdGlvblBhdGgpIHtcblx0XHQvLyBDaGVjayBpZiBVSS5EZWxldGVIaWRkZW4gaXMgcG9pbnRpbmcgdG8gcGFyZW50IHBhdGhcblx0XHRjb25zdCBkZWxldGVIaWRkZW5Bbm5vdGF0aW9uID0gY3VycmVudEVudGl0eVNldC5uYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nW25hdmlnYXRpb25QYXRoXT8uYW5ub3RhdGlvbnM/LlVJPy5EZWxldGVIaWRkZW47XG5cdFx0aWYgKGRlbGV0ZUhpZGRlbkFubm90YXRpb24gJiYgKGRlbGV0ZUhpZGRlbkFubm90YXRpb24gYXMgYW55KS5wYXRoKSB7XG5cdFx0XHRpZiAoKGRlbGV0ZUhpZGRlbkFubm90YXRpb24gYXMgYW55KS5wYXRoLmluZGV4T2YoXCIvXCIpID4gMCkge1xuXHRcdFx0XHRjb25zdCBhU3BsaXRIaWRkZW5QYXRoID0gKGRlbGV0ZUhpZGRlbkFubm90YXRpb24gYXMgYW55KS5wYXRoLnNwbGl0KFwiL1wiKTtcblx0XHRcdFx0Y29uc3Qgc05hdmlnYXRpb25QYXRoID0gYVNwbGl0SGlkZGVuUGF0aFswXTtcblx0XHRcdFx0Y29uc3QgcGFydG5lck5hbWUgPSAoY3VycmVudEVudGl0eVNldCBhcyBhbnkpLmVudGl0eVR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMuZmluZChcblx0XHRcdFx0XHQobmF2UHJvcGVydHk6IGFueSkgPT4gbmF2UHJvcGVydHkubmFtZSA9PT0gbmF2aWdhdGlvblBhdGhcblx0XHRcdFx0KS5wYXJ0bmVyO1xuXHRcdFx0XHRpZiAocGFydG5lck5hbWUgPT09IHNOYXZpZ2F0aW9uUGF0aCkge1xuXHRcdFx0XHRcdGlzRGVsZXRlSGlkZGVuID0gZGVsZXRlSGlkZGVuQW5ub3RhdGlvbjtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aXNEZWxldGVIaWRkZW4gPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aXNEZWxldGVIaWRkZW4gPSBkZWxldGVIaWRkZW5Bbm5vdGF0aW9uO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRpc0RlbGV0ZUhpZGRlbiA9IGN1cnJlbnRFbnRpdHlTZXQgJiYgY3VycmVudEVudGl0eVNldC5hbm5vdGF0aW9ucz8uVUk/LkRlbGV0ZUhpZGRlbjtcblx0fVxuXHRyZXR1cm4gaXNEZWxldGVIaWRkZW47XG59XG5cbi8qKlxuICogUmV0dXJucyB2aXNpYmlsaXR5IGZvciBEZWxldGUgYnV0dG9uXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIG5hdmlnYXRpb25QYXRoXG4gKiBAcGFyYW0gaXNUYXJnZXREZWxldGFibGVcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVsZXRlVmlzaWJsZShcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0bmF2aWdhdGlvblBhdGg6IHN0cmluZyxcblx0aXNUYXJnZXREZWxldGFibGU6IGJvb2xlYW5cbik6IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Y29uc3QgY3VycmVudEVudGl0eVNldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk7XG5cdGNvbnN0IGlzRGVsZXRlSGlkZGVuOiBhbnkgPSBnZXREZWxldGVIaWRkZW4oY3VycmVudEVudGl0eVNldCwgbmF2aWdhdGlvblBhdGgpO1xuXHRsZXQgaXNQYXJlbnREZWxldGFibGUsIHBhcmVudEVudGl0eVNldERlbGV0YWJsZTtcblx0aWYgKGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlKSB7XG5cdFx0aXNQYXJlbnREZWxldGFibGUgPSBpc1BhdGhEZWxldGFibGUoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksIG5hdmlnYXRpb25QYXRoKTtcblx0XHRwYXJlbnRFbnRpdHlTZXREZWxldGFibGUgPSBpc1BhcmVudERlbGV0YWJsZSA/IGNvbXBpbGVCaW5kaW5nKGlzUGFyZW50RGVsZXRhYmxlKSA6IGlzUGFyZW50RGVsZXRhYmxlO1xuXHR9XG5cdC8vZG8gbm90IHNob3cgY2FzZSB0aGUgZGVsZXRlIGJ1dHRvbiBpZiBwYXJlbnRFbnRpdHlTZXREZWxldGFibGUgaXMgZmFsc2Vcblx0aWYgKHBhcmVudEVudGl0eVNldERlbGV0YWJsZSA9PT0gXCJmYWxzZVwiKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9IGVsc2UgaWYgKHBhcmVudEVudGl0eVNldERlbGV0YWJsZSAmJiBpc0RlbGV0ZUhpZGRlbiAhPT0gdHJ1ZSkge1xuXHRcdC8vRGVsZXRlIEhpZGRlbiBpbiBjYXNlIG9mIHRydWUgYW5kIHBhdGggYmFzZWRcblx0XHRpZiAoaXNEZWxldGVIaWRkZW4pIHtcblx0XHRcdHJldHVybiBcIns9ICEke1wiICsgKG5hdmlnYXRpb25QYXRoID8gbmF2aWdhdGlvblBhdGggKyBcIi9cIiA6IFwiXCIpICsgaXNEZWxldGVIaWRkZW4ucGF0aCArIFwifSAmJiAke3VpPi9lZGl0TW9kZX0gPT09ICdFZGl0YWJsZSd9XCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBcIns9ICR7dWk+L2VkaXRNb2RlfSA9PT0gJ0VkaXRhYmxlJ31cIjtcblx0XHR9XG5cdH0gZWxzZSBpZiAoaXNEZWxldGVIaWRkZW4gPT09IHRydWUgfHwgIWlzVGFyZ2V0RGVsZXRhYmxlIHx8IGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5BbmFseXRpY2FsTGlzdFBhZ2UpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0gZWxzZSBpZiAoY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSAhPT0gVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnQpIHtcblx0XHRpZiAoaXNEZWxldGVIaWRkZW4pIHtcblx0XHRcdHJldHVybiBcIns9ICEke1wiICsgKG5hdmlnYXRpb25QYXRoID8gbmF2aWdhdGlvblBhdGggKyBcIi9cIiA6IFwiXCIpICsgaXNEZWxldGVIaWRkZW4ucGF0aCArIFwifSAmJiAke3VpPi9lZGl0TW9kZX0gPT09ICdFZGl0YWJsZSd9XCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBcIns9ICR7dWk+L2VkaXRNb2RlfSA9PT0gJ0VkaXRhYmxlJ31cIjtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHZpc2liaWxpdHkgZm9yIENyZWF0ZSBidXR0b25cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIGNyZWF0aW9uQmVoYXZpb3VyXG4gKiBAcmV0dXJucyB7Kn0gRXhwcmVzc2lvbiBvciBCb29sZWFuIHZhbHVlIG9mIGNyZWF0ZSBoaWRkZW5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3JlYXRlVmlzaWJsZShcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0Y3JlYXRpb25Nb2RlOiBDcmVhdGlvbk1vZGUgfCBcIkV4dGVybmFsXCIsXG5cdGlzSW5zZXJ0YWJsZTogRXhwcmVzc2lvbjxib29sZWFuPlxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IGN1cnJlbnRFbnRpdHlTZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpO1xuXHRjb25zdCBkYXRhTW9kZWxPYmplY3RQYXRoID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCk7XG5cdGNvbnN0IGlzQ3JlYXRlSGlkZGVuOiBFeHByZXNzaW9uPGJvb2xlYW4+ID0gY3VycmVudEVudGl0eVNldFxuXHRcdD8gYW5ub3RhdGlvbkV4cHJlc3Npb24oXG5cdFx0XHRcdChjdXJyZW50RW50aXR5U2V0Py5hbm5vdGF0aW9ucy5VST8uQ3JlYXRlSGlkZGVuIGFzIFByb3BlcnR5QW5ub3RhdGlvblZhbHVlPGJvb2xlYW4+KSB8fCBmYWxzZSxcblx0XHRcdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aC5uYXZpZ2F0aW9uUHJvcGVydGllcy5tYXAobmF2UHJvcCA9PiBuYXZQcm9wLm5hbWUpXG5cdFx0ICApXG5cdFx0OiBjb25zdGFudChmYWxzZSk7XG5cdC8vIGlmIHRoZXJlIGlzIGEgY3VzdG9tIG5ldyBhY3Rpb24gdGhlIGNyZWF0ZSBidXR0b24gd2lsbCBiZSBib3VuZCBhZ2FpbnN0IHRoaXMgbmV3IGFjdGlvbiAoaW5zdGVhZCBvZiBhIFBPU1QgYWN0aW9uKS5cblx0Ly8gVGhlIHZpc2liaWxpdHkgb2YgdGhlIGNyZWF0ZSBidXR0b24gdGhlbiBkZXBlbmRzIG9uIHRoZSBuZXcgYWN0aW9uJ3MgT3BlcmF0aW9uQXZhaWxhYmxlIGFubm90YXRpb24gKGluc3RlYWQgb2YgdGhlIGluc2VydFJlc3RyaWN0aW9ucyk6XG5cdC8vIE9wZXJhdGlvbkF2YWlsYWJsZSA9IHRydWUgb3IgdW5kZWZpbmVkIC0+IGNyZWF0ZSBpcyB2aXNpYmxlXG5cdC8vIE9wZXJhdGlvbkF2YWlsYWJsZSA9IGZhbHNlIC0+IGNyZWF0ZSBpcyBub3QgdmlzaWJsZVxuXHRjb25zdCBuZXdBY3Rpb25OYW1lOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+ID0gY3VycmVudEVudGl0eVNldD8uYW5ub3RhdGlvbnMuQ29tbW9uPy5EcmFmdFJvb3Q/Lk5ld0FjdGlvbjtcblx0Y29uc3Qgc2hvd0NyZWF0ZUZvck5ld0FjdGlvbiA9IG5ld0FjdGlvbk5hbWVcblx0XHQ/IGFubm90YXRpb25FeHByZXNzaW9uKGNvbnZlcnRlckNvbnRleHQ/LmdldEVudGl0eVR5cGUoKS5hY3Rpb25zW25ld0FjdGlvbk5hbWVdLmFubm90YXRpb25zPy5Db3JlPy5PcGVyYXRpb25BdmFpbGFibGUsIFtdLCB0cnVlKVxuXHRcdDogdW5kZWZpbmVkO1xuXG5cdC8vIC0gSWYgaXQncyBzdGF0aWNhbGx5IG5vdCBpbnNlcnRhYmxlIC0+IGNyZWF0ZSBpcyBub3QgdmlzaWJsZVxuXHQvLyAtIElmIGNyZWF0ZSBpcyBzdGF0aWNhbGx5IGhpZGRlbiAtPiBjcmVhdGUgaXMgbm90IHZpc2libGVcblx0Ly8gLSBJZiBpdCdzIGFuIEFMUCB0ZW1wbGF0ZSAtPiBjcmVhdGUgaXMgbm90IHZpc2libGVcblx0Ly8gLVxuXHQvLyAtIE90aGVyd2lzZVxuXHQvLyBcdCAtIElmIHRoZSBjcmVhdGUgbW9kZSBpcyBleHRlcm5hbCAtPiBjcmVhdGUgaXMgdmlzaWJsZVxuXHQvLyBcdCAtIElmIHdlJ3JlIG9uIHRoZSBsaXN0IHJlcG9ydCAtPiBjcmVhdGUgaXMgdmlzaWJsZVxuXHQvLyBcdCAtIE90aGVyd2lzZVxuXHQvLyBcdCAgIC0gVGhpcyBkZXBlbmRzIG9uIHRoZSB2YWx1ZSBvZiB0aGUgdGhlIFVJLklzRWRpdGFibGVcblx0cmV0dXJuIGlmRWxzZShcblx0XHRvcihcblx0XHRcdG9yKFxuXHRcdFx0XHRlcXVhbChzaG93Q3JlYXRlRm9yTmV3QWN0aW9uLCBmYWxzZSksXG5cdFx0XHRcdGFuZChpc0NvbnN0YW50KGlzSW5zZXJ0YWJsZSksIGVxdWFsKGlzSW5zZXJ0YWJsZSwgZmFsc2UpLCBlcXVhbChzaG93Q3JlYXRlRm9yTmV3QWN0aW9uLCB1bmRlZmluZWQpKVxuXHRcdFx0KSxcblx0XHRcdGlzQ29uc3RhbnQoaXNDcmVhdGVIaWRkZW4pICYmIGVxdWFsKGlzQ3JlYXRlSGlkZGVuLCB0cnVlKSxcblx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5BbmFseXRpY2FsTGlzdFBhZ2Vcblx0XHQpLFxuXHRcdGZhbHNlLFxuXHRcdGlmRWxzZShcblx0XHRcdG9yKGNyZWF0aW9uTW9kZSA9PT0gXCJFeHRlcm5hbFwiLCBjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydCksXG5cdFx0XHR0cnVlLFxuXHRcdFx0YW5kKG5vdChpc0NyZWF0ZUhpZGRlbiksIFVJLklzRWRpdGFibGUpXG5cdFx0KVxuXHQpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdmlzaWJpbGl0eSBmb3IgQ3JlYXRlIGJ1dHRvblxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0gY3JlYXRpb25CZWhhdmlvdXJcbiAqIEByZXR1cm5zIHsqfSBFeHByZXNzaW9uIG9yIEJvb2xlYW4gdmFsdWUgb2YgY3JlYXRlaGlkZGVuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhc3RlRW5hYmxlZChcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0Y3JlYXRpb25CZWhhdmlvdXI6IFRhYmxlQW5ub3RhdGlvbkNvbmZpZ3VyYXRpb25bXCJjcmVhdGVcIl0sXG5cdGlzSW5zZXJ0YWJsZTogRXhwcmVzc2lvbjxib29sZWFuPlxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdC8vIElmIGNyZWF0ZSBpcyBub3QgdmlzaWJsZSAtPiBpdCdzIG5vdCBlbmFibGVkXG5cdC8vIElmIGNyZWF0ZSBpcyB2aXNpYmxlIC0+XG5cdC8vIFx0IElmIGl0J3MgaW4gdGhlIExpc3RSZXBvcnQgLT4gbm90IGVuYWJsZWRcblx0Ly9cdCBJZiBpdCdzIGluc2VydGFibGUgLT4gZW5hYmxlZFxuXHRyZXR1cm4gaWZFbHNlKFxuXHRcdGVxdWFsKGdldENyZWF0ZVZpc2libGUoY29udmVydGVyQ29udGV4dCwgY3JlYXRpb25CZWhhdmlvdXIubW9kZSwgaXNJbnNlcnRhYmxlKSwgdHJ1ZSksXG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLk9iamVjdFBhZ2UgJiYgaXNJbnNlcnRhYmxlLFxuXHRcdGZhbHNlXG5cdCk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIEpTT04gc3RyaW5nIGNvbnRhaW5pbmcgUHJlc2VudGF0aW9uIFZhcmlhbnQgc29ydCBjb25kaXRpb25zLlxuICpcbiAqIEBwYXJhbSBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbiB7UHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcyB8IHVuZGVmaW5lZH0gUHJlc2VudGF0aW9uIHZhcmlhbnQgYW5ub3RhdGlvblxuICogQHBhcmFtIGNvbHVtbnMgQ29udmVydGVyIHByb2Nlc3NlZCB0YWJsZSBjb2x1bW5zXG4gKiBAcmV0dXJucyB7c3RyaW5nIHwgdW5kZWZpbmVkfSBTb3J0IGNvbmRpdGlvbnMgZm9yIGEgUHJlc2VudGF0aW9uIHZhcmlhbnQuXG4gKi9cbmZ1bmN0aW9uIGdldFNvcnRDb25kaXRpb25zKFxuXHRwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbjogUHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcyB8IHVuZGVmaW5lZCxcblx0Y29sdW1uczogVGFibGVDb2x1bW5bXVxuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0bGV0IHNvcnRDb25kaXRpb25zOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdGlmIChwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbj8uU29ydE9yZGVyKSB7XG5cdFx0Y29uc3Qgc29ydGVyczogU29ydGVyVHlwZVtdID0gW107XG5cdFx0Y29uc3QgY29uZGl0aW9ucyA9IHtcblx0XHRcdHNvcnRlcnM6IHNvcnRlcnNcblx0XHR9O1xuXHRcdHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uLlNvcnRPcmRlci5mb3JFYWNoKGNvbmRpdGlvbiA9PiB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0eU5hbWUgPSAoY29uZGl0aW9uLlByb3BlcnR5IGFzIFByb3BlcnR5UGF0aCk/LiR0YXJnZXQ/Lm5hbWU7XG5cdFx0XHRjb25zdCBzb3J0Q29sdW1uID0gY29sdW1ucy5maW5kKGNvbHVtbiA9PiBjb2x1bW4ubmFtZSA9PT0gcHJvcGVydHlOYW1lKSBhcyBBbm5vdGF0aW9uVGFibGVDb2x1bW47XG5cdFx0XHRzb3J0Q29sdW1uPy5wcm9wZXJ0eUluZm9zPy5mb3JFYWNoKHJlbGF0ZWRQcm9wZXJ0eU5hbWUgPT4ge1xuXHRcdFx0XHQvLyBDb21wbGV4IFByb3BlcnR5SW5mby4gQWRkIGVhY2ggcmVsYXRlZCBwcm9wZXJ0eSBmb3Igc29ydGluZy5cblx0XHRcdFx0Y29uZGl0aW9ucy5zb3J0ZXJzLnB1c2goe1xuXHRcdFx0XHRcdG5hbWU6IHJlbGF0ZWRQcm9wZXJ0eU5hbWUsXG5cdFx0XHRcdFx0ZGVzY2VuZGluZzogISFjb25kaXRpb24uRGVzY2VuZGluZ1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoIXNvcnRDb2x1bW4/LnByb3BlcnR5SW5mb3M/Lmxlbmd0aCkge1xuXHRcdFx0XHQvLyBOb3QgYSBjb21wbGV4IFByb3BlcnR5SW5mby4gQ29uc2lkZXIgdGhlIHByb3BlcnR5IGl0c2VsZiBmb3Igc29ydGluZy5cblx0XHRcdFx0Y29uZGl0aW9ucy5zb3J0ZXJzLnB1c2goe1xuXHRcdFx0XHRcdG5hbWU6IHByb3BlcnR5TmFtZSxcblx0XHRcdFx0XHRkZXNjZW5kaW5nOiAhIWNvbmRpdGlvbi5EZXNjZW5kaW5nXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHNvcnRDb25kaXRpb25zID0gY29uZGl0aW9ucy5zb3J0ZXJzLmxlbmd0aCA/IEpTT04uc3RyaW5naWZ5KGNvbmRpdGlvbnMpIDogdW5kZWZpbmVkO1xuXHR9XG5cdHJldHVybiBzb3J0Q29uZGl0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhYmxlQW5ub3RhdGlvbkNvbmZpZ3VyYXRpb24oXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0gfCB1bmRlZmluZWQsXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uOiBUYWJsZUNvbnRyb2xDb25maWd1cmF0aW9uLFxuXHRjb2x1bW5zOiBUYWJsZUNvbHVtbltdLFxuXHRwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbj86IFByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXNcbik6IFRhYmxlQW5ub3RhdGlvbkNvbmZpZ3VyYXRpb24ge1xuXHQvLyBOZWVkIHRvIGdldCB0aGUgdGFyZ2V0XG5cdGNvbnN0IHsgbmF2aWdhdGlvblByb3BlcnR5UGF0aCB9ID0gc3BsaXRQYXRoKHZpc3VhbGl6YXRpb25QYXRoKTtcblx0Y29uc3QgdGl0bGU6IGFueSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLnRhcmdldEVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5IZWFkZXJJbmZvPy5UeXBlTmFtZVBsdXJhbDtcblx0Y29uc3QgZW50aXR5U2V0ID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkuc3RhcnRpbmdFbnRpdHlTZXQ7XG5cdGNvbnN0IHBhZ2VNYW5pZmVzdFNldHRpbmdzOiBNYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRjb25zdCBpc0VudGl0eVNldDogYm9vbGVhbiA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoID09PSAwLFxuXHRcdHAxM25Nb2RlOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBnZXRQMTNuTW9kZSh2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCksXG5cdFx0aWQgPSBpc0VudGl0eVNldCAmJiBlbnRpdHlTZXQgPyBUYWJsZUlEKGVudGl0eVNldC5uYW1lLCBcIkxpbmVJdGVtXCIpIDogVGFibGVJRCh2aXN1YWxpemF0aW9uUGF0aCk7XG5cdGNvbnN0IHRhcmdldENhcGFiaWxpdGllcyA9IGdldENhcGFiaWxpdHlSZXN0cmljdGlvbih2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dC5nZXRDb252ZXJ0ZXJDb250ZXh0Rm9yKGVudGl0eVNldCkpO1xuXHRjb25zdCBzZWxlY3Rpb25Nb2RlID0gZ2V0U2VsZWN0aW9uTW9kZShsaW5lSXRlbUFubm90YXRpb24sIHZpc3VhbGl6YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0LCBpc0VudGl0eVNldCwgdGFyZ2V0Q2FwYWJpbGl0aWVzKTtcblx0bGV0IHRocmVzaG9sZCA9IGlzRW50aXR5U2V0ID8gMzAgOiAxMDtcblx0aWYgKHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uPy5NYXhJdGVtcykge1xuXHRcdHRocmVzaG9sZCA9IHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uLk1heEl0ZW1zIGFzIG51bWJlcjtcblx0fVxuXG5cdGNvbnN0IG5hdmlnYXRpb25PckNvbGxlY3Rpb25OYW1lID0gaXNFbnRpdHlTZXQgJiYgZW50aXR5U2V0ID8gZW50aXR5U2V0Lm5hbWUgOiBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoO1xuXHRjb25zdCBuYXZpZ2F0aW9uU2V0dGluZ3MgPSBwYWdlTWFuaWZlc3RTZXR0aW5ncy5nZXROYXZpZ2F0aW9uQ29uZmlndXJhdGlvbihuYXZpZ2F0aW9uT3JDb2xsZWN0aW9uTmFtZSk7XG5cdGNvbnN0IGNyZWF0aW9uQmVoYXZpb3VyID0gX2dldENyZWF0aW9uQmVoYXZpb3VyKGxpbmVJdGVtQW5ub3RhdGlvbiwgdGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24sIGNvbnZlcnRlckNvbnRleHQsIG5hdmlnYXRpb25TZXR0aW5ncyk7XG5cdGxldCBpc1BhcmVudERlbGV0YWJsZTogYW55LCBwYXJlbnRFbnRpdHlTZXREZWxldGFibGU7XG5cdGlmIChjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuT2JqZWN0UGFnZSkge1xuXHRcdGlzUGFyZW50RGVsZXRhYmxlID0gaXNQYXRoRGVsZXRhYmxlKGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLCB1bmRlZmluZWQsIHRydWUpO1xuXHRcdGlmIChpc1BhcmVudERlbGV0YWJsZT8uY3VycmVudEVudGl0eVJlc3RyaWN0aW9uKSB7XG5cdFx0XHRwYXJlbnRFbnRpdHlTZXREZWxldGFibGUgPSB1bmRlZmluZWQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhcmVudEVudGl0eVNldERlbGV0YWJsZSA9IGlzUGFyZW50RGVsZXRhYmxlID8gY29tcGlsZUJpbmRpbmcoaXNQYXJlbnREZWxldGFibGUsIHRydWUpIDogaXNQYXJlbnREZWxldGFibGU7XG5cdFx0fVxuXHR9XG5cdGNvbnN0IGRhdGFNb2RlbE9iamVjdFBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKTtcblx0Y29uc3QgaXNJbnNlcnRhYmxlOiBFeHByZXNzaW9uPGJvb2xlYW4+ID0gaXNQYXRoSW5zZXJ0YWJsZShkYXRhTW9kZWxPYmplY3RQYXRoKTtcblxuXHRyZXR1cm4ge1xuXHRcdGlkOiBpZCxcblx0XHRlbnRpdHlOYW1lOiBlbnRpdHlTZXQgPyBlbnRpdHlTZXQubmFtZSA6IFwiXCIsXG5cdFx0Y29sbGVjdGlvbjogZ2V0VGFyZ2V0T2JqZWN0UGF0aChjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKSksXG5cdFx0bmF2aWdhdGlvblBhdGg6IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsXG5cdFx0aXNFbnRpdHlTZXQ6IGlzRW50aXR5U2V0LFxuXHRcdHJvdzogX2dldFJvd0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eShcblx0XHRcdGxpbmVJdGVtQW5ub3RhdGlvbixcblx0XHRcdHZpc3VhbGl6YXRpb25QYXRoLFxuXHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdG5hdmlnYXRpb25TZXR0aW5ncyxcblx0XHRcdG5hdmlnYXRpb25PckNvbGxlY3Rpb25OYW1lXG5cdFx0KSxcblx0XHRwMTNuTW9kZTogcDEzbk1vZGUsXG5cdFx0c2hvdzoge1xuXHRcdFx0XCJkZWxldGVcIjogZ2V0RGVsZXRlVmlzaWJsZShjb252ZXJ0ZXJDb250ZXh0LCBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLCB0YXJnZXRDYXBhYmlsaXRpZXMuaXNEZWxldGFibGUpLFxuXHRcdFx0Y3JlYXRlOiBjb21waWxlQmluZGluZyhnZXRDcmVhdGVWaXNpYmxlKGNvbnZlcnRlckNvbnRleHQsIGNyZWF0aW9uQmVoYXZpb3VyPy5tb2RlLCBpc0luc2VydGFibGUpKSxcblx0XHRcdHBhc3RlOiBjb21waWxlQmluZGluZyhnZXRQYXN0ZUVuYWJsZWQoY29udmVydGVyQ29udGV4dCwgY3JlYXRpb25CZWhhdmlvdXIsIGlzSW5zZXJ0YWJsZSkpXG5cdFx0fSxcblx0XHRkaXNwbGF5TW9kZTogaXNJbkRpc3BsYXlNb2RlKGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdGNyZWF0ZTogY3JlYXRpb25CZWhhdmlvdXIsXG5cdFx0c2VsZWN0aW9uTW9kZTogc2VsZWN0aW9uTW9kZSxcblx0XHRhdXRvQmluZE9uSW5pdDogY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLk9iamVjdFBhZ2UsXG5cdFx0ZW5hYmxlQ29udHJvbFZNOiBwYWdlTWFuaWZlc3RTZXR0aW5ncy5nZXRWYXJpYW50TWFuYWdlbWVudCgpID09PSBcIkNvbnRyb2xcIiAmJiAhIXAxM25Nb2RlLFxuXHRcdHRocmVzaG9sZDogdGhyZXNob2xkLFxuXHRcdHNvcnRDb25kaXRpb25zOiBnZXRTb3J0Q29uZGl0aW9ucyhwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbiwgY29sdW1ucyksXG5cdFx0cGFyZW50RW50aXR5RGVsZXRlRW5hYmxlZDogcGFyZW50RW50aXR5U2V0RGVsZXRhYmxlLFxuXHRcdHRpdGxlOiB0aXRsZVxuXHR9O1xufVxuXG5mdW5jdGlvbiBpc0luRGlzcGxheU1vZGUoY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IGJvb2xlYW4ge1xuXHRjb25zdCB0ZW1wbGF0ZVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpO1xuXHRpZiAodGVtcGxhdGVUeXBlID09PSBUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlIHx8IHRlbXBsYXRlVHlwZSA9PT0gVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnQpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHQvLyB1cGRhdGFibGUgd2lsbCBiZSBoYW5kbGVkIGF0IHRoZSBwcm9wZXJ0eSBsZXZlbFxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogU3BsaXQgdGhlIHZpc3VhbGl6YXRpb24gcGF0aCBpbnRvIHRoZSBuYXZpZ2F0aW9uIHByb3BlcnR5IHBhdGggYW5kIGFubm90YXRpb24uXG4gKlxuICogQHBhcmFtIHZpc3VhbGl6YXRpb25QYXRoXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5mdW5jdGlvbiBzcGxpdFBhdGgodmlzdWFsaXphdGlvblBhdGg6IHN0cmluZykge1xuXHRsZXQgW25hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsIGFubm90YXRpb25QYXRoXSA9IHZpc3VhbGl6YXRpb25QYXRoLnNwbGl0KFwiQFwiKTtcblxuXHRpZiAobmF2aWdhdGlvblByb3BlcnR5UGF0aC5sYXN0SW5kZXhPZihcIi9cIikgPT09IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoIC0gMSkge1xuXHRcdC8vIERyb3AgdHJhaWxpbmcgc2xhc2hcblx0XHRuYXZpZ2F0aW9uUHJvcGVydHlQYXRoID0gbmF2aWdhdGlvblByb3BlcnR5UGF0aC5zdWJzdHIoMCwgbmF2aWdhdGlvblByb3BlcnR5UGF0aC5sZW5ndGggLSAxKTtcblx0fVxuXHRyZXR1cm4geyBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLCBhbm5vdGF0aW9uUGF0aCB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb24oXG5cdHNlbGVjdGlvblZhcmlhbnRQYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IFNlbGVjdGlvblZhcmlhbnRDb25maWd1cmF0aW9uIHwgdW5kZWZpbmVkIHtcblx0Y29uc3QgcmVzb2x2ZWRUYXJnZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGVBbm5vdGF0aW9uKHNlbGVjdGlvblZhcmlhbnRQYXRoKTtcblx0Y29uc3Qgc2VsZWN0aW9uOiBTZWxlY3Rpb25WYXJpYW50VHlwZSA9IHJlc29sdmVkVGFyZ2V0LmFubm90YXRpb24gYXMgU2VsZWN0aW9uVmFyaWFudFR5cGU7XG5cblx0aWYgKHNlbGVjdGlvbikge1xuXHRcdGNvbnN0IHByb3BlcnR5TmFtZXM6IHN0cmluZ1tdID0gW107XG5cdFx0c2VsZWN0aW9uLlNlbGVjdE9wdGlvbnM/LmZvckVhY2goKHNlbGVjdE9wdGlvbjogU2VsZWN0T3B0aW9uVHlwZSkgPT4ge1xuXHRcdFx0Y29uc3QgcHJvcGVydHlOYW1lOiBhbnkgPSBzZWxlY3RPcHRpb24uUHJvcGVydHlOYW1lO1xuXHRcdFx0Y29uc3QgUHJvcGVydHlQYXRoOiBzdHJpbmcgPSBwcm9wZXJ0eU5hbWUudmFsdWU7XG5cdFx0XHRpZiAocHJvcGVydHlOYW1lcy5pbmRleE9mKFByb3BlcnR5UGF0aCkgPT09IC0xKSB7XG5cdFx0XHRcdHByb3BlcnR5TmFtZXMucHVzaChQcm9wZXJ0eVBhdGgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiB7XG5cdFx0XHR0ZXh0OiBzZWxlY3Rpb24uVGV4dCBhcyBzdHJpbmcsXG5cdFx0XHRwcm9wZXJ0eU5hbWVzOiBwcm9wZXJ0eU5hbWVzXG5cdFx0fTtcblx0fVxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24oXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0gfCB1bmRlZmluZWQsXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGlzQ29uZGVuc2VkVGFibGVMYXlvdXRDb21wbGlhbnQ6IGJvb2xlYW4gPSBmYWxzZVxuKTogVGFibGVDb250cm9sQ29uZmlndXJhdGlvbiB7XG5cdGNvbnN0IHRhYmxlTWFuaWZlc3RTZXR0aW5nczogVGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24gPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24odmlzdWFsaXphdGlvblBhdGgpO1xuXHRjb25zdCB0YWJsZVNldHRpbmdzID0gdGFibGVNYW5pZmVzdFNldHRpbmdzLnRhYmxlU2V0dGluZ3M7XG5cdGxldCBxdWlja1NlbGVjdGlvblZhcmlhbnQ6IGFueTtcblx0Y29uc3QgcXVpY2tGaWx0ZXJQYXRoczogeyBhbm5vdGF0aW9uUGF0aDogc3RyaW5nIH1bXSA9IFtdO1xuXHRsZXQgZW5hYmxlRXhwb3J0ID0gdHJ1ZTtcblx0bGV0IGNyZWF0aW9uTW9kZSA9IENyZWF0aW9uTW9kZS5OZXdQYWdlO1xuXHRsZXQgZmlsdGVycztcblx0bGV0IGNyZWF0ZUF0RW5kID0gdHJ1ZTtcblx0bGV0IGRpc2FibGVBZGRSb3dCdXR0b25Gb3JFbXB0eURhdGEgPSBmYWxzZTtcblx0bGV0IGNvbmRlbnNlZFRhYmxlTGF5b3V0ID0gZmFsc2U7XG5cdGxldCBoaWRlVGFibGVUaXRsZSA9IGZhbHNlO1xuXHRsZXQgdGFibGVUeXBlOiBUYWJsZVR5cGUgPSBcIlJlc3BvbnNpdmVUYWJsZVwiO1xuXHRsZXQgZW5hYmxlRnVsbFNjcmVlbiA9IGZhbHNlO1xuXHRsZXQgc2VsZWN0aW9uTGltaXQgPSAyMDA7XG5cdGxldCBlbmFibGVQYXN0ZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFwiT2JqZWN0UGFnZVwiO1xuXHRjb25zdCBzaGVsbFNlcnZpY2VzID0gY29udmVydGVyQ29udGV4dC5nZXRTaGVsbFNlcnZpY2VzKCk7XG5cdGNvbnN0IHVzZXJDb250ZW50RGVuc2l0eSA9IHNoZWxsU2VydmljZXM/LmdldENvbnRlbnREZW5zaXR5KCk7XG5cdGNvbnN0IGFwcENvbnRlbnREZW5zaXR5ID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKS5nZXRDb250ZW50RGVuc2l0aWVzKCk7XG5cdGlmICgoYXBwQ29udGVudERlbnNpdHk/LmNvenkgPT09IHRydWUgJiYgYXBwQ29udGVudERlbnNpdHk/LmNvbXBhY3QgIT09IHRydWUpIHx8IHVzZXJDb250ZW50RGVuc2l0eSA9PT0gXCJjb3p5XCIpIHtcblx0XHRpc0NvbmRlbnNlZFRhYmxlTGF5b3V0Q29tcGxpYW50ID0gZmFsc2U7XG5cdH1cblx0aWYgKHRhYmxlU2V0dGluZ3MgJiYgbGluZUl0ZW1Bbm5vdGF0aW9uKSB7XG5cdFx0Y29uc3QgdGFyZ2V0RW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbkVudGl0eVR5cGUobGluZUl0ZW1Bbm5vdGF0aW9uKTtcblx0XHR0YWJsZVNldHRpbmdzPy5xdWlja1ZhcmlhbnRTZWxlY3Rpb24/LnBhdGhzPy5mb3JFYWNoKChwYXRoOiB7IGFubm90YXRpb25QYXRoOiBzdHJpbmcgfSkgPT4ge1xuXHRcdFx0cXVpY2tTZWxlY3Rpb25WYXJpYW50ID0gdGFyZ2V0RW50aXR5VHlwZS5yZXNvbHZlUGF0aChcIkBcIiArIHBhdGguYW5ub3RhdGlvblBhdGgpO1xuXHRcdFx0Ly8gcXVpY2tTZWxlY3Rpb25WYXJpYW50ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlQW5ub3RhdGlvbihwYXRoLmFubm90YXRpb25QYXRoKTtcblx0XHRcdGlmIChxdWlja1NlbGVjdGlvblZhcmlhbnQpIHtcblx0XHRcdFx0cXVpY2tGaWx0ZXJQYXRocy5wdXNoKHsgYW5ub3RhdGlvblBhdGg6IHBhdGguYW5ub3RhdGlvblBhdGggfSk7XG5cdFx0XHR9XG5cdFx0XHRmaWx0ZXJzID0ge1xuXHRcdFx0XHRxdWlja0ZpbHRlcnM6IHtcblx0XHRcdFx0XHRlbmFibGVkOlxuXHRcdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnRcblx0XHRcdFx0XHRcdFx0PyBcIns9ICR7cGFnZUludGVybmFsPmhhc1BlbmRpbmdGaWx0ZXJzfSAhPT0gdHJ1ZX1cIlxuXHRcdFx0XHRcdFx0XHQ6IHRydWUsXG5cdFx0XHRcdFx0c2hvd0NvdW50czogdGFibGVTZXR0aW5ncz8ucXVpY2tWYXJpYW50U2VsZWN0aW9uPy5zaG93Q291bnRzLFxuXHRcdFx0XHRcdHBhdGhzOiBxdWlja0ZpbHRlclBhdGhzXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fSk7XG5cdFx0Y3JlYXRpb25Nb2RlID0gdGFibGVTZXR0aW5ncy5jcmVhdGlvbk1vZGU/Lm5hbWUgfHwgY3JlYXRpb25Nb2RlO1xuXHRcdGNyZWF0ZUF0RW5kID0gdGFibGVTZXR0aW5ncy5jcmVhdGlvbk1vZGU/LmNyZWF0ZUF0RW5kICE9PSB1bmRlZmluZWQgPyB0YWJsZVNldHRpbmdzLmNyZWF0aW9uTW9kZT8uY3JlYXRlQXRFbmQgOiB0cnVlO1xuXHRcdGRpc2FibGVBZGRSb3dCdXR0b25Gb3JFbXB0eURhdGEgPSAhIXRhYmxlU2V0dGluZ3MuY3JlYXRpb25Nb2RlPy5kaXNhYmxlQWRkUm93QnV0dG9uRm9yRW1wdHlEYXRhO1xuXHRcdGNvbmRlbnNlZFRhYmxlTGF5b3V0ID0gdGFibGVTZXR0aW5ncy5jb25kZW5zZWRUYWJsZUxheW91dCAhPT0gdW5kZWZpbmVkID8gdGFibGVTZXR0aW5ncy5jb25kZW5zZWRUYWJsZUxheW91dCA6IGZhbHNlO1xuXHRcdGhpZGVUYWJsZVRpdGxlID0gISF0YWJsZVNldHRpbmdzLnF1aWNrVmFyaWFudFNlbGVjdGlvbj8uaGlkZVRhYmxlVGl0bGU7XG5cdFx0dGFibGVUeXBlID0gdGFibGVTZXR0aW5ncz8udHlwZSB8fCBcIlJlc3BvbnNpdmVUYWJsZVwiO1xuXHRcdGVuYWJsZUZ1bGxTY3JlZW4gPSB0YWJsZVNldHRpbmdzLmVuYWJsZUZ1bGxTY3JlZW4gfHwgZmFsc2U7XG5cdFx0aWYgKGVuYWJsZUZ1bGxTY3JlZW4gPT09IHRydWUgJiYgY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnQpIHtcblx0XHRcdGVuYWJsZUZ1bGxTY3JlZW4gPSBmYWxzZTtcblx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0LmdldERpYWdub3N0aWNzKClcblx0XHRcdFx0LmFkZElzc3VlKElzc3VlQ2F0ZWdvcnkuTWFuaWZlc3QsIElzc3VlU2V2ZXJpdHkuTG93LCBJc3N1ZVR5cGUuRlVMTFNDUkVFTk1PREVfTk9UX09OX0xJU1RSRVBPUlQpO1xuXHRcdH1cblx0XHRzZWxlY3Rpb25MaW1pdCA9IHRhYmxlU2V0dGluZ3Muc2VsZWN0QWxsID09PSB0cnVlIHx8IHRhYmxlU2V0dGluZ3Muc2VsZWN0aW9uTGltaXQgPT09IDAgPyAwIDogdGFibGVTZXR0aW5ncy5zZWxlY3Rpb25MaW1pdCB8fCAyMDA7XG5cdFx0ZW5hYmxlUGFzdGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBcIk9iamVjdFBhZ2VcIiAmJiB0YWJsZVNldHRpbmdzLmVuYWJsZVBhc3RlICE9PSBmYWxzZTtcblx0XHRlbmFibGVFeHBvcnQgPVxuXHRcdFx0dGFibGVTZXR0aW5ncy5lbmFibGVFeHBvcnQgIT09IHVuZGVmaW5lZFxuXHRcdFx0XHQ/IHRhYmxlU2V0dGluZ3MuZW5hYmxlRXhwb3J0XG5cdFx0XHRcdDogY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSAhPT0gXCJPYmplY3RQYWdlXCIgfHwgZW5hYmxlUGFzdGU7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRmaWx0ZXJzOiBmaWx0ZXJzLFxuXHRcdHR5cGU6IHRhYmxlVHlwZSxcblx0XHRlbmFibGVGdWxsU2NyZWVuOiBlbmFibGVGdWxsU2NyZWVuLFxuXHRcdGhlYWRlclZpc2libGU6ICEocXVpY2tTZWxlY3Rpb25WYXJpYW50ICYmIGhpZGVUYWJsZVRpdGxlKSxcblx0XHRlbmFibGVFeHBvcnQ6IGVuYWJsZUV4cG9ydCxcblx0XHRjcmVhdGlvbk1vZGU6IGNyZWF0aW9uTW9kZSxcblx0XHRjcmVhdGVBdEVuZDogY3JlYXRlQXRFbmQsXG5cdFx0ZGlzYWJsZUFkZFJvd0J1dHRvbkZvckVtcHR5RGF0YTogZGlzYWJsZUFkZFJvd0J1dHRvbkZvckVtcHR5RGF0YSxcblx0XHR1c2VDb25kZW5zZWRUYWJsZUxheW91dDogY29uZGVuc2VkVGFibGVMYXlvdXQgJiYgaXNDb25kZW5zZWRUYWJsZUxheW91dENvbXBsaWFudCxcblx0XHRzZWxlY3Rpb25MaW1pdDogc2VsZWN0aW9uTGltaXQsXG5cdFx0ZW5hYmxlUGFzdGU6IGVuYWJsZVBhc3RlXG5cdH07XG59XG4iXX0=