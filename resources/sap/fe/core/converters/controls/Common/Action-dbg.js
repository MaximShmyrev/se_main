sap.ui.define(["sap/fe/core/converters/ManifestSettings", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/ID", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/formatters/FPMFormatter"], function (ManifestSettings, ConfigurableObject, ID, StableIdHelper, BindingExpression, fpmFormatter) {
  "use strict";

  var _exports = {};
  var resolveBindingString = BindingExpression.resolveBindingString;
  var isConstant = BindingExpression.isConstant;
  var formatResult = BindingExpression.formatResult;
  var compileBinding = BindingExpression.compileBinding;
  var bindingExpression = BindingExpression.bindingExpression;
  var annotationExpression = BindingExpression.annotationExpression;
  var replaceSpecialChars = StableIdHelper.replaceSpecialChars;
  var CustomActionID = ID.CustomActionID;
  var Placement = ConfigurableObject.Placement;
  var ActionType = ManifestSettings.ActionType;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var ButtonType;

  (function (ButtonType) {
    ButtonType["Accept"] = "Accept";
    ButtonType["Attention"] = "Attention";
    ButtonType["Back"] = "Back";
    ButtonType["Critical"] = "Critical";
    ButtonType["Default"] = "Default";
    ButtonType["Emphasized"] = "Emphasized";
    ButtonType["Ghost"] = "Ghost";
    ButtonType["Negative"] = "Negative";
    ButtonType["Neutral"] = "Neutral";
    ButtonType["Reject"] = "Reject";
    ButtonType["Success"] = "Success";
    ButtonType["Transparent"] = "Transparent";
    ButtonType["Unstyled"] = "Unstyled";
    ButtonType["Up"] = "Up";
  })(ButtonType || (ButtonType = {}));

  _exports.ButtonType = ButtonType;

  /**
   * Prepare menu action from manifest actions.
   * @param {Record<string, CustomAction>} actions the manifest definition
   * @param {BaseAction[]} aAnnotationActions the annotation actions definition
   * @returns {Record<string, CustomAction>} the actions from the manifest and menu option added
   */
  function prepareMenuAction(actions, aAnnotationActions) {
    var _menuItemKeys2;

    var allActions = {};
    var menuItemKeys = [];

    for (var actionKey in actions) {
      var manifestAction = actions[actionKey];

      if (manifestAction.type === ActionType.Menu) {
        (function () {
          var _manifestAction$menu$, _manifestAction$menu;

          var menuItems = [];

          var _menuItemKeys = (_manifestAction$menu$ = (_manifestAction$menu = manifestAction.menu) === null || _manifestAction$menu === void 0 ? void 0 : _manifestAction$menu.map(function (menuKey) {
            var _action, _action2, _action3;

            var action = actions[menuKey];

            if (!action) {
              action = aAnnotationActions.find(function (action) {
                return action.key === menuKey;
              });
            }

            if (((_action = action) === null || _action === void 0 ? void 0 : _action.visible) || ((_action2 = action) === null || _action2 === void 0 ? void 0 : _action2.type) === ActionType.DataFieldForAction || ((_action3 = action) === null || _action3 === void 0 ? void 0 : _action3.type) === ActionType.DataFieldForIntentBasedNavigation) {
              menuItems.push(action);
            }

            return menuKey;
          })) !== null && _manifestAction$menu$ !== void 0 ? _manifestAction$menu$ : []; // Show menu button if it has more then 1 item visible


          if (menuItems.length > 1) {
            manifestAction.menu = menuItems;
          } else {
            _menuItemKeys = [actionKey];
          }

          menuItemKeys = [].concat(_toConsumableArray(menuItemKeys), _toConsumableArray(_menuItemKeys));
        })();
      }

      allActions[actionKey] = manifestAction;
    } // eslint-disable-next-line no-unused-expressions


    (_menuItemKeys2 = menuItemKeys) === null || _menuItemKeys2 === void 0 ? void 0 : _menuItemKeys2.forEach(function (actionKey) {
      return delete allActions[actionKey];
    });
    return allActions;
  }

  var removeDuplicateActions = function (actions) {
    var oMenuItemKeys = {};
    actions.forEach(function (action) {
      var _action$menu;

      if (action === null || action === void 0 ? void 0 : (_action$menu = action.menu) === null || _action$menu === void 0 ? void 0 : _action$menu.length) {
        action.menu.reduce(function (item, _ref) {
          var key = _ref.key;

          if (key && !item[key]) {
            item[key] = true;
          }

          return item;
        }, oMenuItemKeys);
      }
    });
    return actions.filter(function (action) {
      return !oMenuItemKeys[action.key];
    });
  };
  /**
   * Create the action configuration based on the manifest settings.
   * @param {Record<string, ManifestAction> | undefined} manifestActions the manifest
   * @param converterContext
   * @param {BaseAction[]} aAnnotationActions the annotation actions definition
   * @param {NavigationSettingsConfiguration} navigationSettings
   * @param {boolean} considerNavigationSettings
   * @returns {Record<string, CustomAction>} the actions from the manifest
   */


  _exports.removeDuplicateActions = removeDuplicateActions;

  function getActionsFromManifest(manifestActions, converterContext, aAnnotationActions, navigationSettings, considerNavigationSettings) {
    var actions = {};

    for (var actionKey in manifestActions) {
      var _manifestAction$press, _manifestAction$posit, _manifestAction$menu2;

      var manifestAction = manifestActions[actionKey];
      var lastDotIndex = (_manifestAction$press = manifestAction.press) === null || _manifestAction$press === void 0 ? void 0 : _manifestAction$press.lastIndexOf(".");
      actions[actionKey] = {
        id: CustomActionID(actionKey),
        visible: manifestAction.visible === undefined ? "true" : manifestAction.visible,
        enabled: manifestAction.enabled === undefined ? "true" : getManifestActionEnablement(manifestAction.enabled, converterContext),
        handlerModule: manifestAction.press && manifestAction.press.substring(0, lastDotIndex).replace(/\./gi, "/"),
        handlerMethod: manifestAction.press && manifestAction.press.substring(lastDotIndex + 1),
        press: manifestAction.press,
        type: manifestAction.menu ? ActionType.Menu : ActionType.Default,
        text: manifestAction.text,
        key: replaceSpecialChars(actionKey),
        enableOnSelect: manifestAction.enableOnSelect,
        position: {
          anchor: (_manifestAction$posit = manifestAction.position) === null || _manifestAction$posit === void 0 ? void 0 : _manifestAction$posit.anchor,
          placement: manifestAction.position === undefined ? Placement.After : manifestAction.position.placement
        },
        isNavigable: isActionNavigable(manifestAction, navigationSettings, considerNavigationSettings),
        requiresSelection: manifestAction.requiresSelection === undefined ? false : manifestAction.requiresSelection,
        enableAutoScroll: enableAutoScroll(manifestAction),
        menu: (_manifestAction$menu2 = manifestAction.menu) !== null && _manifestAction$menu2 !== void 0 ? _manifestAction$menu2 : []
      };
    }

    return prepareMenuAction(actions, aAnnotationActions !== null && aAnnotationActions !== void 0 ? aAnnotationActions : []);
  }

  _exports.getActionsFromManifest = getActionsFromManifest;

  function getManifestActionEnablement(enabledString, converterContext) {
    var resolvedBinding = resolveBindingString(enabledString, "boolean");

    if (isConstant(resolvedBinding) && typeof resolvedBinding.value === "boolean") {
      // true / false
      return resolvedBinding.value;
    } else if (resolvedBinding._type !== "EmbeddedBinding") {
      // Then it's a module-method reference "sap.xxx.yyy.doSomething"
      var methodPath = resolvedBinding.value;
      return compileBinding(formatResult([bindingExpression("/", "$view"), methodPath, bindingExpression("selectedContexts", "internal")], fpmFormatter.customIsEnabledCheck, converterContext.getAnnotationEntityType()));
    } else {
      // then it's a binding
      return compileBinding(resolvedBinding);
    }
  }

  function getEnabledBinding(actionDefinition) {
    var _actionDefinition$ann, _actionDefinition$ann2;

    if (!actionDefinition) {
      return "true";
    }

    if (!actionDefinition.isBound) {
      return "true";
    }

    var operationAvailable = (_actionDefinition$ann = actionDefinition.annotations) === null || _actionDefinition$ann === void 0 ? void 0 : (_actionDefinition$ann2 = _actionDefinition$ann.Core) === null || _actionDefinition$ann2 === void 0 ? void 0 : _actionDefinition$ann2.OperationAvailable;

    if (operationAvailable) {
      var _bindingExpression = compileBinding(annotationExpression(operationAvailable));

      if (_bindingExpression) {
        var _actionDefinition$par, _actionDefinition$par2;

        /**
         * Action Parameter is ignored by the formatter when trigger by templating
         * here it's done manually
         **/
        var paramSuffix = (_actionDefinition$par = actionDefinition.parameters) === null || _actionDefinition$par === void 0 ? void 0 : (_actionDefinition$par2 = _actionDefinition$par[0]) === null || _actionDefinition$par2 === void 0 ? void 0 : _actionDefinition$par2.fullyQualifiedName;

        if (paramSuffix) {
          paramSuffix = paramSuffix.replace(actionDefinition.fullyQualifiedName + "/", "");
          _bindingExpression = _bindingExpression.replace(paramSuffix + "/", "");
        }

        return _bindingExpression;
      }

      return "true";
    }

    return "true";
    /*
       FIXME Disable failing music tests
    	Due to limitation on CAP the following binding (which is the good one) generates error:
    			   return "{= !${#" + field.Action + "} ? false : true }";
    	CAP tries to read the action as property and doesn't find it
    */
  }

  _exports.getEnabledBinding = getEnabledBinding;

  function getSemanticObjectMapping(aMappings) {
    var aSemanticObjectMappings = [];
    aMappings.forEach(function (oMapping) {
      var oSOMapping = {
        "LocalProperty": {
          "$PropertyPath": oMapping.LocalProperty.value
        },
        "SemanticObjectProperty": oMapping.SemanticObjectProperty
      };
      aSemanticObjectMappings.push(oSOMapping);
    });
    return aSemanticObjectMappings;
  }

  _exports.getSemanticObjectMapping = getSemanticObjectMapping;

  function isActionNavigable(action, navigationSettings, considerNavigationSettings) {
    var _action$afterExecutio, _action$afterExecutio2;

    var bIsNavigationConfigured = true;

    if (considerNavigationSettings) {
      var detailOrDisplay = navigationSettings && (navigationSettings.detail || navigationSettings.display);
      bIsNavigationConfigured = (detailOrDisplay === null || detailOrDisplay === void 0 ? void 0 : detailOrDisplay.route) ? true : false;
    } // when enableAutoScroll is true the navigateToInstance feature is disabled


    if (action && action.afterExecution && (((_action$afterExecutio = action.afterExecution) === null || _action$afterExecutio === void 0 ? void 0 : _action$afterExecutio.navigateToInstance) === false || ((_action$afterExecutio2 = action.afterExecution) === null || _action$afterExecutio2 === void 0 ? void 0 : _action$afterExecutio2.enableAutoScroll) === true) || !bIsNavigationConfigured) {
      return false;
    }

    return true;
  }

  _exports.isActionNavigable = isActionNavigable;

  function enableAutoScroll(action) {
    var _action$afterExecutio3;

    return (action === null || action === void 0 ? void 0 : (_action$afterExecutio3 = action.afterExecution) === null || _action$afterExecutio3 === void 0 ? void 0 : _action$afterExecutio3.enableAutoScroll) === true;
  }

  _exports.enableAutoScroll = enableAutoScroll;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGlvbi50cyJdLCJuYW1lcyI6WyJCdXR0b25UeXBlIiwicHJlcGFyZU1lbnVBY3Rpb24iLCJhY3Rpb25zIiwiYUFubm90YXRpb25BY3Rpb25zIiwiYWxsQWN0aW9ucyIsIm1lbnVJdGVtS2V5cyIsImFjdGlvbktleSIsIm1hbmlmZXN0QWN0aW9uIiwidHlwZSIsIkFjdGlvblR5cGUiLCJNZW51IiwibWVudUl0ZW1zIiwiX21lbnVJdGVtS2V5cyIsIm1lbnUiLCJtYXAiLCJtZW51S2V5IiwiYWN0aW9uIiwiZmluZCIsImtleSIsInZpc2libGUiLCJEYXRhRmllbGRGb3JBY3Rpb24iLCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24iLCJwdXNoIiwibGVuZ3RoIiwiZm9yRWFjaCIsInJlbW92ZUR1cGxpY2F0ZUFjdGlvbnMiLCJvTWVudUl0ZW1LZXlzIiwicmVkdWNlIiwiaXRlbSIsImZpbHRlciIsImdldEFjdGlvbnNGcm9tTWFuaWZlc3QiLCJtYW5pZmVzdEFjdGlvbnMiLCJjb252ZXJ0ZXJDb250ZXh0IiwibmF2aWdhdGlvblNldHRpbmdzIiwiY29uc2lkZXJOYXZpZ2F0aW9uU2V0dGluZ3MiLCJsYXN0RG90SW5kZXgiLCJwcmVzcyIsImxhc3RJbmRleE9mIiwiaWQiLCJDdXN0b21BY3Rpb25JRCIsInVuZGVmaW5lZCIsImVuYWJsZWQiLCJnZXRNYW5pZmVzdEFjdGlvbkVuYWJsZW1lbnQiLCJoYW5kbGVyTW9kdWxlIiwic3Vic3RyaW5nIiwicmVwbGFjZSIsImhhbmRsZXJNZXRob2QiLCJEZWZhdWx0IiwidGV4dCIsInJlcGxhY2VTcGVjaWFsQ2hhcnMiLCJlbmFibGVPblNlbGVjdCIsInBvc2l0aW9uIiwiYW5jaG9yIiwicGxhY2VtZW50IiwiUGxhY2VtZW50IiwiQWZ0ZXIiLCJpc05hdmlnYWJsZSIsImlzQWN0aW9uTmF2aWdhYmxlIiwicmVxdWlyZXNTZWxlY3Rpb24iLCJlbmFibGVBdXRvU2Nyb2xsIiwiZW5hYmxlZFN0cmluZyIsInJlc29sdmVkQmluZGluZyIsInJlc29sdmVCaW5kaW5nU3RyaW5nIiwiaXNDb25zdGFudCIsInZhbHVlIiwiX3R5cGUiLCJtZXRob2RQYXRoIiwiY29tcGlsZUJpbmRpbmciLCJmb3JtYXRSZXN1bHQiLCJiaW5kaW5nRXhwcmVzc2lvbiIsImZwbUZvcm1hdHRlciIsImN1c3RvbUlzRW5hYmxlZENoZWNrIiwiZ2V0QW5ub3RhdGlvbkVudGl0eVR5cGUiLCJnZXRFbmFibGVkQmluZGluZyIsImFjdGlvbkRlZmluaXRpb24iLCJpc0JvdW5kIiwib3BlcmF0aW9uQXZhaWxhYmxlIiwiYW5ub3RhdGlvbnMiLCJDb3JlIiwiT3BlcmF0aW9uQXZhaWxhYmxlIiwiYW5ub3RhdGlvbkV4cHJlc3Npb24iLCJwYXJhbVN1ZmZpeCIsInBhcmFtZXRlcnMiLCJmdWxseVF1YWxpZmllZE5hbWUiLCJnZXRTZW1hbnRpY09iamVjdE1hcHBpbmciLCJhTWFwcGluZ3MiLCJhU2VtYW50aWNPYmplY3RNYXBwaW5ncyIsIm9NYXBwaW5nIiwib1NPTWFwcGluZyIsIkxvY2FsUHJvcGVydHkiLCJTZW1hbnRpY09iamVjdFByb3BlcnR5IiwiYklzTmF2aWdhdGlvbkNvbmZpZ3VyZWQiLCJkZXRhaWxPckRpc3BsYXkiLCJkZXRhaWwiLCJkaXNwbGF5Iiwicm91dGUiLCJhZnRlckV4ZWN1dGlvbiIsIm5hdmlnYXRlVG9JbnN0YW5jZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BaUJZQSxVOzthQUFBQSxVO0FBQUFBLElBQUFBLFU7QUFBQUEsSUFBQUEsVTtBQUFBQSxJQUFBQSxVO0FBQUFBLElBQUFBLFU7QUFBQUEsSUFBQUEsVTtBQUFBQSxJQUFBQSxVO0FBQUFBLElBQUFBLFU7QUFBQUEsSUFBQUEsVTtBQUFBQSxJQUFBQSxVO0FBQUFBLElBQUFBLFU7QUFBQUEsSUFBQUEsVTtBQUFBQSxJQUFBQSxVO0FBQUFBLElBQUFBLFU7QUFBQUEsSUFBQUEsVTtLQUFBQSxVLEtBQUFBLFU7Ozs7QUEyRFo7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LENBQUM0RCxNQUFuQixJQUE2QjVELGtCQUFrQixDQUFDNkQsT0FBckQsQ0FBMUM7QUFDQUgsTUFBQUEsdUJBQXVCLEdBQUcsQ0FBQUMsZUFBZSxTQUFmLElBQUFBLGVBQWUsV0FBZixZQUFBQSxlQUFlLENBQUVHLEtBQWpCLElBQXlCLElBQXpCLEdBQWdDLEtBQTFEO0FBQ0EsS0FMUyxDQU1WOzs7QUFDQSxRQUNFL0UsTUFBTSxJQUNOQSxNQUFNLENBQUNnRixjQURQLEtBRUMsMEJBQUFoRixNQUFNLENBQUNnRixjQUFQLGdGQUF1QkMsa0JBQXZCLE1BQThDLEtBQTlDLElBQXVELDJCQUFBakYsTUFBTSxDQUFDZ0YsY0FBUCxrRkFBdUJyQyxnQkFBdkIsTUFBNEMsSUFGcEcsQ0FBRCxJQUdBLENBQUNnQyx1QkFKRixFQUtFO0FBQ0QsYUFBTyxLQUFQO0FBQ0E7O0FBQ0QsV0FBTyxJQUFQO0FBQ0E7Ozs7QUFFTSxXQUFTaEMsZ0JBQVQsQ0FBMEIzQyxNQUExQixFQUEyRDtBQUFBOztBQUNqRSxXQUFPLENBQUFBLE1BQU0sU0FBTixJQUFBQSxNQUFNLFdBQU4sc0NBQUFBLE1BQU0sQ0FBRWdGLGNBQVIsa0ZBQXdCckMsZ0JBQXhCLE1BQTZDLElBQXBEO0FBQ0EiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgQWN0aW9uVHlwZSwgTWFuaWZlc3RBY3Rpb24sIE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb24sIE1hbmlmZXN0VGFibGVDb2x1bW4gfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQgeyBDb25maWd1cmFibGVPYmplY3QsIEN1c3RvbUVsZW1lbnQsIFBsYWNlbWVudCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQ29uZmlndXJhYmxlT2JqZWN0XCI7XG5pbXBvcnQgeyBDdXN0b21BY3Rpb25JRCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSURcIjtcbmltcG9ydCB7IHJlcGxhY2VTcGVjaWFsQ2hhcnMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9TdGFibGVJZEhlbHBlclwiO1xuaW1wb3J0IHtcblx0YW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdGJpbmRpbmdFeHByZXNzaW9uLFxuXHRCaW5kaW5nRXhwcmVzc2lvbixcblx0Y29tcGlsZUJpbmRpbmcsXG5cdGZvcm1hdFJlc3VsdCxcblx0aXNDb25zdGFudCxcblx0cmVzb2x2ZUJpbmRpbmdTdHJpbmdcbn0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ0V4cHJlc3Npb25cIjtcbmltcG9ydCBmcG1Gb3JtYXR0ZXIgZnJvbSBcInNhcC9mZS9jb3JlL2Zvcm1hdHRlcnMvRlBNRm9ybWF0dGVyXCI7XG5pbXBvcnQgeyBDb252ZXJ0ZXJDb250ZXh0IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvdGVtcGxhdGVzL0Jhc2VDb252ZXJ0ZXJcIjtcblxuZXhwb3J0IGVudW0gQnV0dG9uVHlwZSB7XG5cdEFjY2VwdCA9IFwiQWNjZXB0XCIsXG5cdEF0dGVudGlvbiA9IFwiQXR0ZW50aW9uXCIsXG5cdEJhY2sgPSBcIkJhY2tcIixcblx0Q3JpdGljYWwgPSBcIkNyaXRpY2FsXCIsXG5cdERlZmF1bHQgPSBcIkRlZmF1bHRcIixcblx0RW1waGFzaXplZCA9IFwiRW1waGFzaXplZFwiLFxuXHRHaG9zdCA9IFwiR2hvc3RcIixcblx0TmVnYXRpdmUgPSBcIk5lZ2F0aXZlXCIsXG5cdE5ldXRyYWwgPSBcIk5ldXRyYWxcIixcblx0UmVqZWN0ID0gXCJSZWplY3RcIixcblx0U3VjY2VzcyA9IFwiU3VjY2Vzc1wiLFxuXHRUcmFuc3BhcmVudCA9IFwiVHJhbnNwYXJlbnRcIixcblx0VW5zdHlsZWQgPSBcIlVuc3R5bGVkXCIsXG5cdFVwID0gXCJVcFwiXG59XG5cbmV4cG9ydCB0eXBlIEJhc2VBY3Rpb24gPSBDb25maWd1cmFibGVPYmplY3QgJiB7XG5cdGlkPzogc3RyaW5nO1xuXHR0ZXh0Pzogc3RyaW5nO1xuXHR0eXBlOiBBY3Rpb25UeXBlO1xuXHRwcmVzcz86IHN0cmluZztcblx0ZW5hYmxlZD86IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHR2aXNpYmxlPzogQmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj47XG5cdGVuYWJsZU9uU2VsZWN0Pzogc3RyaW5nO1xuXHRpc05hdmlnYWJsZT86IGJvb2xlYW47XG5cdGVuYWJsZUF1dG9TY3JvbGw/OiBib29sZWFuO1xuXHRyZXF1aXJlc0RpYWxvZz86IHN0cmluZztcblx0YmluZGluZz86IHN0cmluZztcblx0YnV0dG9uVHlwZT86IEJ1dHRvblR5cGUuR2hvc3QgfCBCdXR0b25UeXBlLlRyYW5zcGFyZW50IHwgc3RyaW5nO1xuXHRwYXJlbnRFbnRpdHlEZWxldGVFbmFibGVkPzogQmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj47XG5cdG1lbnU/OiAoc3RyaW5nIHwgQ3VzdG9tQWN0aW9uIHwgQmFzZUFjdGlvbilbXTtcbn07XG5cbmV4cG9ydCB0eXBlIEFubm90YXRpb25BY3Rpb24gPSBCYXNlQWN0aW9uICYge1xuXHR0eXBlOiBBY3Rpb25UeXBlLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbiB8IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9yQWN0aW9uO1xuXHRhbm5vdGF0aW9uUGF0aDogc3RyaW5nO1xuXHRpZD86IHN0cmluZztcblx0Y3VzdG9tRGF0YT86IHN0cmluZztcbn07XG5cbi8qKlxuICogQ3VzdG9tIEFjdGlvbiBEZWZpbml0aW9uXG4gKlxuICogQHR5cGVkZWYgQ3VzdG9tQWN0aW9uXG4gKi9cbmV4cG9ydCB0eXBlIEN1c3RvbUFjdGlvbiA9IEN1c3RvbUVsZW1lbnQ8XG5cdEJhc2VBY3Rpb24gJiB7XG5cdFx0dHlwZTogQWN0aW9uVHlwZS5EZWZhdWx0IHwgQWN0aW9uVHlwZS5NZW51O1xuXHRcdGhhbmRsZXJNZXRob2Q6IHN0cmluZztcblx0XHRoYW5kbGVyTW9kdWxlOiBzdHJpbmc7XG5cdFx0bWVudT86IChzdHJpbmcgfCBDdXN0b21BY3Rpb24gfCBCYXNlQWN0aW9uKVtdO1xuXHRcdHJlcXVpcmVzU2VsZWN0aW9uPzogYm9vbGVhbjtcblx0fVxuPjtcblxuLy8gUmV1c2Ugb2YgQ29uZmlndXJhYmxlT2JqZWN0IGFuZCBDdXN0b21FbGVtZW50IGlzIGRvbmUgZm9yIG9yZGVyaW5nXG5leHBvcnQgdHlwZSBDb252ZXJ0ZXJBY3Rpb24gPSBBbm5vdGF0aW9uQWN0aW9uIHwgQ3VzdG9tQWN0aW9uO1xuXG4vKipcbiAqIFByZXBhcmUgbWVudSBhY3Rpb24gZnJvbSBtYW5pZmVzdCBhY3Rpb25zLlxuICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+fSBhY3Rpb25zIHRoZSBtYW5pZmVzdCBkZWZpbml0aW9uXG4gKiBAcGFyYW0ge0Jhc2VBY3Rpb25bXX0gYUFubm90YXRpb25BY3Rpb25zIHRoZSBhbm5vdGF0aW9uIGFjdGlvbnMgZGVmaW5pdGlvblxuICogQHJldHVybnMge1JlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj59IHRoZSBhY3Rpb25zIGZyb20gdGhlIG1hbmlmZXN0IGFuZCBtZW51IG9wdGlvbiBhZGRlZFxuICovXG5mdW5jdGlvbiBwcmVwYXJlTWVudUFjdGlvbihhY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+LCBhQW5ub3RhdGlvbkFjdGlvbnM6IEJhc2VBY3Rpb25bXSk6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4ge1xuXHRjb25zdCBhbGxBY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+ID0ge307XG5cdGxldCBtZW51SXRlbUtleXM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkID0gW107XG5cblx0Zm9yIChjb25zdCBhY3Rpb25LZXkgaW4gYWN0aW9ucykge1xuXHRcdGNvbnN0IG1hbmlmZXN0QWN0aW9uOiBDdXN0b21BY3Rpb24gPSBhY3Rpb25zW2FjdGlvbktleV07XG5cdFx0aWYgKG1hbmlmZXN0QWN0aW9uLnR5cGUgPT09IEFjdGlvblR5cGUuTWVudSkge1xuXHRcdFx0Y29uc3QgbWVudUl0ZW1zOiAoQ3VzdG9tQWN0aW9uIHwgQmFzZUFjdGlvbilbXSA9IFtdO1xuXHRcdFx0bGV0IF9tZW51SXRlbUtleXMgPVxuXHRcdFx0XHRtYW5pZmVzdEFjdGlvbi5tZW51Py5tYXAoKG1lbnVLZXk6IHN0cmluZyB8IEN1c3RvbUFjdGlvbikgPT4ge1xuXHRcdFx0XHRcdGxldCBhY3Rpb246IEJhc2VBY3Rpb24gfCBDdXN0b21BY3Rpb24gfCB1bmRlZmluZWQgPSBhY3Rpb25zW21lbnVLZXkgYXMgc3RyaW5nXTtcblxuXHRcdFx0XHRcdGlmICghYWN0aW9uKSB7XG5cdFx0XHRcdFx0XHRhY3Rpb24gPSBhQW5ub3RhdGlvbkFjdGlvbnMuZmluZCgoYWN0aW9uOiBCYXNlQWN0aW9uKSA9PiBhY3Rpb24ua2V5ID09PSBtZW51S2V5KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRhY3Rpb24/LnZpc2libGUgfHxcblx0XHRcdFx0XHRcdGFjdGlvbj8udHlwZSA9PT0gQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JBY3Rpb24gfHxcblx0XHRcdFx0XHRcdGFjdGlvbj8udHlwZSA9PT0gQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdG1lbnVJdGVtcy5wdXNoKGFjdGlvbik7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIG1lbnVLZXkgYXMgc3RyaW5nO1xuXHRcdFx0XHR9KSA/PyBbXTtcblxuXHRcdFx0Ly8gU2hvdyBtZW51IGJ1dHRvbiBpZiBpdCBoYXMgbW9yZSB0aGVuIDEgaXRlbSB2aXNpYmxlXG5cdFx0XHRpZiAobWVudUl0ZW1zLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0bWFuaWZlc3RBY3Rpb24ubWVudSA9IG1lbnVJdGVtcztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdF9tZW51SXRlbUtleXMgPSBbYWN0aW9uS2V5XTtcblx0XHRcdH1cblxuXHRcdFx0bWVudUl0ZW1LZXlzID0gWy4uLm1lbnVJdGVtS2V5cywgLi4uX21lbnVJdGVtS2V5c107XG5cdFx0fVxuXG5cdFx0YWxsQWN0aW9uc1thY3Rpb25LZXldID0gbWFuaWZlc3RBY3Rpb247XG5cdH1cblxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG5cdG1lbnVJdGVtS2V5cz8uZm9yRWFjaCgoYWN0aW9uS2V5OiBzdHJpbmcpID0+IGRlbGV0ZSBhbGxBY3Rpb25zW2FjdGlvbktleV0pO1xuXHRyZXR1cm4gYWxsQWN0aW9ucztcbn1cblxuZXhwb3J0IGNvbnN0IHJlbW92ZUR1cGxpY2F0ZUFjdGlvbnMgPSAoYWN0aW9uczogQmFzZUFjdGlvbltdKTogQmFzZUFjdGlvbltdID0+IHtcblx0Y29uc3Qgb01lbnVJdGVtS2V5czogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuXHRhY3Rpb25zLmZvckVhY2goYWN0aW9uID0+IHtcblx0XHRpZiAoYWN0aW9uPy5tZW51Py5sZW5ndGgpIHtcblx0XHRcdGFjdGlvbi5tZW51LnJlZHVjZSgoaXRlbSwgeyBrZXkgfTogYW55KSA9PiB7XG5cdFx0XHRcdGlmIChrZXkgJiYgIWl0ZW1ba2V5XSkge1xuXHRcdFx0XHRcdGl0ZW1ba2V5XSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0XHR9LCBvTWVudUl0ZW1LZXlzKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gYWN0aW9ucy5maWx0ZXIoYWN0aW9uID0+ICFvTWVudUl0ZW1LZXlzW2FjdGlvbi5rZXldKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBhY3Rpb24gY29uZmlndXJhdGlvbiBiYXNlZCBvbiB0aGUgbWFuaWZlc3Qgc2V0dGluZ3MuXG4gKiBAcGFyYW0ge1JlY29yZDxzdHJpbmcsIE1hbmlmZXN0QWN0aW9uPiB8IHVuZGVmaW5lZH0gbWFuaWZlc3RBY3Rpb25zIHRoZSBtYW5pZmVzdFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSB7QmFzZUFjdGlvbltdfSBhQW5ub3RhdGlvbkFjdGlvbnMgdGhlIGFubm90YXRpb24gYWN0aW9ucyBkZWZpbml0aW9uXG4gKiBAcGFyYW0ge05hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb259IG5hdmlnYXRpb25TZXR0aW5nc1xuICogQHBhcmFtIHtib29sZWFufSBjb25zaWRlck5hdmlnYXRpb25TZXR0aW5nc1xuICogQHJldHVybnMge1JlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj59IHRoZSBhY3Rpb25zIGZyb20gdGhlIG1hbmlmZXN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KFxuXHRtYW5pZmVzdEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIE1hbmlmZXN0QWN0aW9uPiB8IHVuZGVmaW5lZCxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0YUFubm90YXRpb25BY3Rpb25zPzogQmFzZUFjdGlvbltdLFxuXHRuYXZpZ2F0aW9uU2V0dGluZ3M/OiBOYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9uLFxuXHRjb25zaWRlck5hdmlnYXRpb25TZXR0aW5ncz86IGJvb2xlYW5cbik6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4ge1xuXHRjb25zdCBhY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+ID0ge307XG5cdGZvciAoY29uc3QgYWN0aW9uS2V5IGluIG1hbmlmZXN0QWN0aW9ucykge1xuXHRcdGNvbnN0IG1hbmlmZXN0QWN0aW9uOiBNYW5pZmVzdEFjdGlvbiA9IG1hbmlmZXN0QWN0aW9uc1thY3Rpb25LZXldO1xuXHRcdGNvbnN0IGxhc3REb3RJbmRleCA9IG1hbmlmZXN0QWN0aW9uLnByZXNzPy5sYXN0SW5kZXhPZihcIi5cIik7XG5cblx0XHRhY3Rpb25zW2FjdGlvbktleV0gPSB7XG5cdFx0XHRpZDogQ3VzdG9tQWN0aW9uSUQoYWN0aW9uS2V5KSxcblx0XHRcdHZpc2libGU6IG1hbmlmZXN0QWN0aW9uLnZpc2libGUgPT09IHVuZGVmaW5lZCA/IFwidHJ1ZVwiIDogbWFuaWZlc3RBY3Rpb24udmlzaWJsZSxcblx0XHRcdGVuYWJsZWQ6IG1hbmlmZXN0QWN0aW9uLmVuYWJsZWQgPT09IHVuZGVmaW5lZCA/IFwidHJ1ZVwiIDogZ2V0TWFuaWZlc3RBY3Rpb25FbmFibGVtZW50KG1hbmlmZXN0QWN0aW9uLmVuYWJsZWQsIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdFx0aGFuZGxlck1vZHVsZTogbWFuaWZlc3RBY3Rpb24ucHJlc3MgJiYgbWFuaWZlc3RBY3Rpb24ucHJlc3Muc3Vic3RyaW5nKDAsIGxhc3REb3RJbmRleCkucmVwbGFjZSgvXFwuL2dpLCBcIi9cIiksXG5cdFx0XHRoYW5kbGVyTWV0aG9kOiBtYW5pZmVzdEFjdGlvbi5wcmVzcyAmJiBtYW5pZmVzdEFjdGlvbi5wcmVzcy5zdWJzdHJpbmcobGFzdERvdEluZGV4ICsgMSksXG5cdFx0XHRwcmVzczogbWFuaWZlc3RBY3Rpb24ucHJlc3MsXG5cdFx0XHR0eXBlOiBtYW5pZmVzdEFjdGlvbi5tZW51ID8gQWN0aW9uVHlwZS5NZW51IDogQWN0aW9uVHlwZS5EZWZhdWx0LFxuXHRcdFx0dGV4dDogbWFuaWZlc3RBY3Rpb24udGV4dCxcblx0XHRcdGtleTogcmVwbGFjZVNwZWNpYWxDaGFycyhhY3Rpb25LZXkpLFxuXHRcdFx0ZW5hYmxlT25TZWxlY3Q6IG1hbmlmZXN0QWN0aW9uLmVuYWJsZU9uU2VsZWN0LFxuXHRcdFx0cG9zaXRpb246IHtcblx0XHRcdFx0YW5jaG9yOiBtYW5pZmVzdEFjdGlvbi5wb3NpdGlvbj8uYW5jaG9yLFxuXHRcdFx0XHRwbGFjZW1lbnQ6IG1hbmlmZXN0QWN0aW9uLnBvc2l0aW9uID09PSB1bmRlZmluZWQgPyBQbGFjZW1lbnQuQWZ0ZXIgOiBtYW5pZmVzdEFjdGlvbi5wb3NpdGlvbi5wbGFjZW1lbnRcblx0XHRcdH0sXG5cdFx0XHRpc05hdmlnYWJsZTogaXNBY3Rpb25OYXZpZ2FibGUobWFuaWZlc3RBY3Rpb24sIG5hdmlnYXRpb25TZXR0aW5ncywgY29uc2lkZXJOYXZpZ2F0aW9uU2V0dGluZ3MpLFxuXHRcdFx0cmVxdWlyZXNTZWxlY3Rpb246IG1hbmlmZXN0QWN0aW9uLnJlcXVpcmVzU2VsZWN0aW9uID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IG1hbmlmZXN0QWN0aW9uLnJlcXVpcmVzU2VsZWN0aW9uLFxuXHRcdFx0ZW5hYmxlQXV0b1Njcm9sbDogZW5hYmxlQXV0b1Njcm9sbChtYW5pZmVzdEFjdGlvbiksXG5cdFx0XHRtZW51OiBtYW5pZmVzdEFjdGlvbi5tZW51ID8/IFtdXG5cdFx0fTtcblx0fVxuXHRyZXR1cm4gcHJlcGFyZU1lbnVBY3Rpb24oYWN0aW9ucywgYUFubm90YXRpb25BY3Rpb25zID8/IFtdKTtcbn1cblxuZnVuY3Rpb24gZ2V0TWFuaWZlc3RBY3Rpb25FbmFibGVtZW50KGVuYWJsZWRTdHJpbmc6IHN0cmluZywgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCkge1xuXHRjb25zdCByZXNvbHZlZEJpbmRpbmcgPSByZXNvbHZlQmluZGluZ1N0cmluZyhlbmFibGVkU3RyaW5nLCBcImJvb2xlYW5cIik7XG5cdGlmIChpc0NvbnN0YW50KHJlc29sdmVkQmluZGluZykgJiYgdHlwZW9mIHJlc29sdmVkQmluZGluZy52YWx1ZSA9PT0gXCJib29sZWFuXCIpIHtcblx0XHQvLyB0cnVlIC8gZmFsc2Vcblx0XHRyZXR1cm4gcmVzb2x2ZWRCaW5kaW5nLnZhbHVlO1xuXHR9IGVsc2UgaWYgKHJlc29sdmVkQmluZGluZy5fdHlwZSAhPT0gXCJFbWJlZGRlZEJpbmRpbmdcIikge1xuXHRcdC8vIFRoZW4gaXQncyBhIG1vZHVsZS1tZXRob2QgcmVmZXJlbmNlIFwic2FwLnh4eC55eXkuZG9Tb21ldGhpbmdcIlxuXHRcdGNvbnN0IG1ldGhvZFBhdGggPSByZXNvbHZlZEJpbmRpbmcudmFsdWUgYXMgc3RyaW5nO1xuXHRcdHJldHVybiBjb21waWxlQmluZGluZyhcblx0XHRcdGZvcm1hdFJlc3VsdChcblx0XHRcdFx0W2JpbmRpbmdFeHByZXNzaW9uKFwiL1wiLCBcIiR2aWV3XCIpLCBtZXRob2RQYXRoLCBiaW5kaW5nRXhwcmVzc2lvbihcInNlbGVjdGVkQ29udGV4dHNcIiwgXCJpbnRlcm5hbFwiKV0sXG5cdFx0XHRcdGZwbUZvcm1hdHRlci5jdXN0b21Jc0VuYWJsZWRDaGVjayxcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uRW50aXR5VHlwZSgpXG5cdFx0XHQpXG5cdFx0KTtcblx0fSBlbHNlIHtcblx0XHQvLyB0aGVuIGl0J3MgYSBiaW5kaW5nXG5cdFx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKHJlc29sdmVkQmluZGluZyk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVuYWJsZWRCaW5kaW5nKGFjdGlvbkRlZmluaXRpb246IEFjdGlvbiB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG5cdGlmICghYWN0aW9uRGVmaW5pdGlvbikge1xuXHRcdHJldHVybiBcInRydWVcIjtcblx0fVxuXHRpZiAoIWFjdGlvbkRlZmluaXRpb24uaXNCb3VuZCkge1xuXHRcdHJldHVybiBcInRydWVcIjtcblx0fVxuXHRjb25zdCBvcGVyYXRpb25BdmFpbGFibGUgPSBhY3Rpb25EZWZpbml0aW9uLmFubm90YXRpb25zPy5Db3JlPy5PcGVyYXRpb25BdmFpbGFibGU7XG5cdGlmIChvcGVyYXRpb25BdmFpbGFibGUpIHtcblx0XHRsZXQgYmluZGluZ0V4cHJlc3Npb24gPSBjb21waWxlQmluZGluZyhhbm5vdGF0aW9uRXhwcmVzc2lvbihvcGVyYXRpb25BdmFpbGFibGUpKTtcblx0XHRpZiAoYmluZGluZ0V4cHJlc3Npb24pIHtcblx0XHRcdC8qKlxuXHRcdFx0ICogQWN0aW9uIFBhcmFtZXRlciBpcyBpZ25vcmVkIGJ5IHRoZSBmb3JtYXR0ZXIgd2hlbiB0cmlnZ2VyIGJ5IHRlbXBsYXRpbmdcblx0XHRcdCAqIGhlcmUgaXQncyBkb25lIG1hbnVhbGx5XG5cdFx0XHQgKiovXG5cdFx0XHRsZXQgcGFyYW1TdWZmaXggPSBhY3Rpb25EZWZpbml0aW9uLnBhcmFtZXRlcnM/LlswXT8uZnVsbHlRdWFsaWZpZWROYW1lO1xuXHRcdFx0aWYgKHBhcmFtU3VmZml4KSB7XG5cdFx0XHRcdHBhcmFtU3VmZml4ID0gcGFyYW1TdWZmaXgucmVwbGFjZShhY3Rpb25EZWZpbml0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSArIFwiL1wiLCBcIlwiKTtcblx0XHRcdFx0YmluZGluZ0V4cHJlc3Npb24gPSBiaW5kaW5nRXhwcmVzc2lvbi5yZXBsYWNlKHBhcmFtU3VmZml4ICsgXCIvXCIsIFwiXCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGJpbmRpbmdFeHByZXNzaW9uO1xuXHRcdH1cblx0XHRyZXR1cm4gXCJ0cnVlXCI7XG5cdH1cblx0cmV0dXJuIFwidHJ1ZVwiO1xuXHQvKlxuXHQgICBGSVhNRSBEaXNhYmxlIGZhaWxpbmcgbXVzaWMgdGVzdHNcblx0XHREdWUgdG8gbGltaXRhdGlvbiBvbiBDQVAgdGhlIGZvbGxvd2luZyBiaW5kaW5nICh3aGljaCBpcyB0aGUgZ29vZCBvbmUpIGdlbmVyYXRlcyBlcnJvcjpcblx0XHRcdFx0ICAgcmV0dXJuIFwiez0gISR7I1wiICsgZmllbGQuQWN0aW9uICsgXCJ9ID8gZmFsc2UgOiB0cnVlIH1cIjtcblx0XHRDQVAgdHJpZXMgdG8gcmVhZCB0aGUgYWN0aW9uIGFzIHByb3BlcnR5IGFuZCBkb2Vzbid0IGZpbmQgaXRcblx0Ki9cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbWFudGljT2JqZWN0TWFwcGluZyhhTWFwcGluZ3M6IGFueVtdKTogYW55W10ge1xuXHRjb25zdCBhU2VtYW50aWNPYmplY3RNYXBwaW5nczogYW55W10gPSBbXTtcblx0YU1hcHBpbmdzLmZvckVhY2gob01hcHBpbmcgPT4ge1xuXHRcdGNvbnN0IG9TT01hcHBpbmcgPSB7XG5cdFx0XHRcIkxvY2FsUHJvcGVydHlcIjoge1xuXHRcdFx0XHRcIiRQcm9wZXJ0eVBhdGhcIjogb01hcHBpbmcuTG9jYWxQcm9wZXJ0eS52YWx1ZVxuXHRcdFx0fSxcblx0XHRcdFwiU2VtYW50aWNPYmplY3RQcm9wZXJ0eVwiOiBvTWFwcGluZy5TZW1hbnRpY09iamVjdFByb3BlcnR5XG5cdFx0fTtcblx0XHRhU2VtYW50aWNPYmplY3RNYXBwaW5ncy5wdXNoKG9TT01hcHBpbmcpO1xuXHR9KTtcblx0cmV0dXJuIGFTZW1hbnRpY09iamVjdE1hcHBpbmdzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBY3Rpb25OYXZpZ2FibGUoXG5cdGFjdGlvbjogTWFuaWZlc3RBY3Rpb24gfCBNYW5pZmVzdFRhYmxlQ29sdW1uLFxuXHRuYXZpZ2F0aW9uU2V0dGluZ3M/OiBOYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9uLFxuXHRjb25zaWRlck5hdmlnYXRpb25TZXR0aW5ncz86IGJvb2xlYW5cbik6IGJvb2xlYW4ge1xuXHRsZXQgYklzTmF2aWdhdGlvbkNvbmZpZ3VyZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXHRpZiAoY29uc2lkZXJOYXZpZ2F0aW9uU2V0dGluZ3MpIHtcblx0XHRjb25zdCBkZXRhaWxPckRpc3BsYXkgPSBuYXZpZ2F0aW9uU2V0dGluZ3MgJiYgKG5hdmlnYXRpb25TZXR0aW5ncy5kZXRhaWwgfHwgbmF2aWdhdGlvblNldHRpbmdzLmRpc3BsYXkpO1xuXHRcdGJJc05hdmlnYXRpb25Db25maWd1cmVkID0gZGV0YWlsT3JEaXNwbGF5Py5yb3V0ZSA/IHRydWUgOiBmYWxzZTtcblx0fVxuXHQvLyB3aGVuIGVuYWJsZUF1dG9TY3JvbGwgaXMgdHJ1ZSB0aGUgbmF2aWdhdGVUb0luc3RhbmNlIGZlYXR1cmUgaXMgZGlzYWJsZWRcblx0aWYgKFxuXHRcdChhY3Rpb24gJiZcblx0XHRcdGFjdGlvbi5hZnRlckV4ZWN1dGlvbiAmJlxuXHRcdFx0KGFjdGlvbi5hZnRlckV4ZWN1dGlvbj8ubmF2aWdhdGVUb0luc3RhbmNlID09PSBmYWxzZSB8fCBhY3Rpb24uYWZ0ZXJFeGVjdXRpb24/LmVuYWJsZUF1dG9TY3JvbGwgPT09IHRydWUpKSB8fFxuXHRcdCFiSXNOYXZpZ2F0aW9uQ29uZmlndXJlZFxuXHQpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0cmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVBdXRvU2Nyb2xsKGFjdGlvbjogTWFuaWZlc3RBY3Rpb24pOiBib29sZWFuIHtcblx0cmV0dXJuIGFjdGlvbj8uYWZ0ZXJFeGVjdXRpb24/LmVuYWJsZUF1dG9TY3JvbGwgPT09IHRydWU7XG59XG4iXX0=