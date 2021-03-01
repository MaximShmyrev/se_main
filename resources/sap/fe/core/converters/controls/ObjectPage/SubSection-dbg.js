sap.ui.define(["../../ManifestSettings", "../../helpers/ID", "../Common/Form", "../Common/DataVisualization", "../../helpers/ConfigurableObject", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/helpers/Key", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/IssueManager"], function (ManifestSettings, ID, Form, DataVisualization, ConfigurableObject, Action, Key, BindingExpression, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueCategory = IssueManager.IssueCategory;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueType = IssueManager.IssueType;
  var ref = BindingExpression.ref;
  var not = BindingExpression.not;
  var fn = BindingExpression.fn;
  var equal = BindingExpression.equal;
  var compileBinding = BindingExpression.compileBinding;
  var bindingExpression = BindingExpression.bindingExpression;
  var annotationExpression = BindingExpression.annotationExpression;
  var KeyHelper = Key.KeyHelper;
  var getSemanticObjectMapping = Action.getSemanticObjectMapping;
  var ButtonType = Action.ButtonType;
  var isActionNavigable = Action.isActionNavigable;
  var getEnabledBinding = Action.getEnabledBinding;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var getDataVisualizationConfiguration = DataVisualization.getDataVisualizationConfiguration;
  var isReferenceFacet = Form.isReferenceFacet;
  var createFormDefinition = Form.createFormDefinition;
  var SubSectionID = ID.SubSectionID;
  var FormID = ID.FormID;
  var CustomSubSectionID = ID.CustomSubSectionID;
  var ActionType = ManifestSettings.ActionType;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var SubSectionType;

  (function (SubSectionType) {
    SubSectionType["Unknown"] = "Unknown";
    SubSectionType["Form"] = "Form";
    SubSectionType["DataVisualization"] = "DataVisualization";
    SubSectionType["XMLFragment"] = "XMLFragment";
    SubSectionType["Placeholder"] = "Placeholder";
    SubSectionType["Mixed"] = "Mixed";
  })(SubSectionType || (SubSectionType = {}));

  _exports.SubSectionType = SubSectionType;
  var targetTerms = ["com.sap.vocabularies.UI.v1.LineItem", "com.sap.vocabularies.UI.v1.PresentationVariant", "com.sap.vocabularies.UI.v1.SelectionPresentationVariant"]; // TODO: Need to handle Table case inside createSubSection function if CollectionFacet has Table ReferenceFacet

  var hasTable = function () {
    var facets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return facets.some(function (facetType) {
      var _facetType$Target, _facetType$Target$$ta;

      return targetTerms.indexOf(facetType === null || facetType === void 0 ? void 0 : (_facetType$Target = facetType.Target) === null || _facetType$Target === void 0 ? void 0 : (_facetType$Target$$ta = _facetType$Target.$target) === null || _facetType$Target$$ta === void 0 ? void 0 : _facetType$Target$$ta.term) > -1;
    });
  };
  /**
   * Create subsections based on facet definition.
   *
   * @param facetCollection
   * @param converterContext
   * @returns {ObjectPageSubSection[]} the current subections
   */


  function createSubSections(facetCollection, converterContext) {
    // First we determine which sub section we need to create
    var facetsToCreate = facetCollection.reduce(function (facetsToCreate, facetDefinition) {
      switch (facetDefinition.$Type) {
        case "com.sap.vocabularies.UI.v1.ReferenceFacet":
          facetsToCreate.push(facetDefinition);
          break;

        case "com.sap.vocabularies.UI.v1.CollectionFacet":
          // TODO If the Collection Facet has a child of type Collection Facet we bring them up one level (Form + Table use case) ?
          // first case facet Collection is combination of collection and reference facet or not all facets are reference facets.
          if (facetDefinition.Facets.find(function (facetType) {
            return facetType.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet";
          })) {
            facetsToCreate.splice.apply(facetsToCreate, [facetsToCreate.length, 0].concat(_toConsumableArray(facetDefinition.Facets)));
          } else {
            facetsToCreate.push(facetDefinition);
          }

          break;

        case "com.sap.vocabularies.UI.v1.ReferenceURLFacet":
          // Not supported
          break;
      }

      return facetsToCreate;
    }, []); // Then we create the actual subsections

    return facetsToCreate.map(function (facet) {
      var _ref, _ref$Facets;

      return createSubSection(facet, facetsToCreate, converterContext, 0, !((_ref = facet) === null || _ref === void 0 ? void 0 : (_ref$Facets = _ref.Facets) === null || _ref$Facets === void 0 ? void 0 : _ref$Facets.length));
    });
  } // function isTargetForCompliant(annotationPath: AnnotationPath) {
  // 	return /.*com\.sap\.vocabularies\.UI\.v1\.(FieldGroup|Identification|DataPoint|StatusInfo).*/.test(annotationPath.value);
  // }


  _exports.createSubSections = createSubSections;

  var getSubSectionKey = function (facetDefinition, fallback) {
    var _facetDefinition$ID, _facetDefinition$Labe;

    return ((_facetDefinition$ID = facetDefinition.ID) === null || _facetDefinition$ID === void 0 ? void 0 : _facetDefinition$ID.toString()) || ((_facetDefinition$Labe = facetDefinition.Label) === null || _facetDefinition$Labe === void 0 ? void 0 : _facetDefinition$Labe.toString()) || fallback;
  };
  /**
   * Retrieves the action form a facet.
   *
   * @param facetDefinition
   * @param converterContext
   * @returns {ConverterAction[]} the current facet actions
   */


  function getFacetActions(facetDefinition, converterContext) {
    var actions = new Array();

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        actions = facetDefinition.Facets.filter(function (facetDefinition) {
          return isReferenceFacet(facetDefinition);
        }).reduce(function (actions, facetDefinition) {
          return createFormActionReducer(actions, facetDefinition, converterContext);
        }, []);
        break;

      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        actions = createFormActionReducer([], facetDefinition, converterContext);
        break;
    }

    return actions;
  }
  /**
   * Retruns the button type based on @UI.Emphasized annotation.
   * @param Emphasized Emphasized annotation value.
   * @returns {ButtonType | string} returns button type or path based expression.
   */


  function getButtonType(Emphasized) {
    var PathForButtonType = Emphasized === null || Emphasized === void 0 ? void 0 : Emphasized.path;

    if (PathForButtonType) {
      return "{= " + "!${" + PathForButtonType + "} ? '" + ButtonType.Transparent + "' : ${" + PathForButtonType + "}" + "}";
    } else if (Emphasized) {
      return ButtonType.Ghost;
    }

    return ButtonType.Transparent;
  }
  /**
   * Create a subsection based on a FacetTypes.
   * @param facetDefinition
   * @param facetsToCreate
   * @param converterContext
   * @param level
   * @param hasSingleContent
   * @returns {ObjectPageSubSection} one sub section definition
   */


  function createSubSection(facetDefinition, facetsToCreate, converterContext, level, hasSingleContent) {
    var _facetDefinition$anno, _facetDefinition$anno2, _ref2, _ref2$annotation, _ref3;

    var subSectionID = SubSectionID({
      Facet: facetDefinition
    });
    var subSection = {
      id: subSectionID,
      key: getSubSectionKey(facetDefinition, subSectionID),
      title: compileBinding(annotationExpression(facetDefinition.Label)),
      type: SubSectionType.Unknown,
      annotationPath: converterContext.getEntitySetBasedAnnotationPath(facetDefinition.fullyQualifiedName),
      visible: compileBinding(not(equal(annotationExpression((_facetDefinition$anno = facetDefinition.annotations) === null || _facetDefinition$anno === void 0 ? void 0 : (_facetDefinition$anno2 = _facetDefinition$anno.UI) === null || _facetDefinition$anno2 === void 0 ? void 0 : _facetDefinition$anno2.Hidden), true))),
      level: level
    };
    var content = [];
    var tableContent = [];
    var index = [];
    var unsupportedText = "";
    level++;

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        var facets = facetDefinition.Facets;

        if (hasTable(facets)) {
          // if we have tables in a collection facet then we create separate subsection for them
          for (var i = 0; i < facets.length; i++) {
            var _Target, _Target$$target;

            if (targetTerms.indexOf((_Target = facets[i].Target) === null || _Target === void 0 ? void 0 : (_Target$$target = _Target.$target) === null || _Target$$target === void 0 ? void 0 : _Target$$target.term) > -1) {
              //creating separate array for tables
              tableContent.push(createSubSection(facets[i], [], converterContext, level, facets.length === 1));
              index.push(i);
            }
          }

          for (var _i = index.length - 1; _i >= 0; _i--) {
            //remove table facets from facet definition
            facets.splice(index[_i], 1);
          }

          if (facets.length) {
            facetDefinition.Facets = facets; //create a form subsection from the remaining facets

            content.push(createSubSection(facetDefinition, [], converterContext, level, hasSingleContent));
          }

          content = content.concat(tableContent);

          var mixedSubSection = _objectSpread({}, subSection, {
            type: SubSectionType.Mixed,
            level: level,
            content: content
          });

          return mixedSubSection;
        } else {
          var formCollectionSubSection = _objectSpread({}, subSection, {
            type: SubSectionType.Form,
            formDefinition: createFormDefinition(facetDefinition, converterContext),
            level: level,
            actions: getFacetActions(facetDefinition, converterContext)
          });

          return formCollectionSubSection;
        }

      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        if (!facetDefinition.Target.$target) {
          unsupportedText = "Unable to find annotationPath ".concat(facetDefinition.Target.value);
        } else {
          switch (facetDefinition.Target.$target.term) {
            case "com.sap.vocabularies.UI.v1.LineItem":
            case "com.sap.vocabularies.UI.v1.Chart":
            case "com.sap.vocabularies.UI.v1.PresentationVariant":
            case "com.sap.vocabularies.UI.v1.SelectionPresentationVariant":
              var presentation = getDataVisualizationConfiguration(facetDefinition.Target.value, getCondensedTableLayoutCompliance(facetDefinition, facetsToCreate, converterContext), converterContext);
              var controlTitle = (_ref2 = presentation.visualizations[0]) === null || _ref2 === void 0 ? void 0 : (_ref2$annotation = _ref2.annotation) === null || _ref2$annotation === void 0 ? void 0 : _ref2$annotation.title;
              controlTitle ? controlTitle : controlTitle = (_ref3 = presentation.visualizations[0]) === null || _ref3 === void 0 ? void 0 : _ref3.title;

              var dataVisualizationSubSection = _objectSpread({}, subSection, {
                type: SubSectionType.DataVisualization,
                level: level,
                presentation: presentation,
                showTitle: isSubsectionTitleShown(hasSingleContent, subSection.title, controlTitle)
              });

              return dataVisualizationSubSection;

            case "com.sap.vocabularies.UI.v1.FieldGroup":
            case "com.sap.vocabularies.UI.v1.Identification":
            case "com.sap.vocabularies.UI.v1.DataPoint":
            case "com.sap.vocabularies.UI.v1.StatusInfo":
            case "com.sap.vocabularies.Communication.v1.Contact":
              // All those element belong to a form facet
              var formElementSubSection = _objectSpread({}, subSection, {
                type: SubSectionType.Form,
                level: level,
                formDefinition: createFormDefinition(facetDefinition, converterContext),
                actions: getFacetActions(facetDefinition, converterContext)
              });

              return formElementSubSection;

            default:
              unsupportedText = "For ".concat(facetDefinition.Target.$target.term, " Fragment");
              break;
          }
        }

        break;

      case "com.sap.vocabularies.UI.v1.ReferenceURLFacet":
        unsupportedText = "For Reference URL Facet";
        break;

      default:
        break;
    } // If we reach here we ended up with an unsupported SubSection type


    var unsupportedSubSection = _objectSpread({}, subSection, {
      text: unsupportedText
    });

    return unsupportedSubSection;
  }

  _exports.createSubSection = createSubSection;

  function isSubsectionTitleShown(hasSingleContent, subSectionTitle, controlTitle) {
    if (hasSingleContent && controlTitle === subSectionTitle) {
      return false;
    }

    return true;
  }

  function createFormActionReducer(actions, facetDefinition, converterContext) {
    var referenceTarget = facetDefinition.Target.$target;
    var targetValue = facetDefinition.Target.value;
    var manifestActions = {};
    var dataFieldCollection = [];

    var _targetValue$split = targetValue.split("@"),
        _targetValue$split2 = _slicedToArray(_targetValue$split, 1),
        navigationPropertyPath = _targetValue$split2[0];

    if (navigationPropertyPath.length > 0) {
      if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
        navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
      }
    } else {
      navigationPropertyPath = undefined;
    }

    if (referenceTarget) {
      switch (referenceTarget.term) {
        case "com.sap.vocabularies.UI.v1.FieldGroup":
          dataFieldCollection = referenceTarget.Data;
          manifestActions = getActionsFromManifest(converterContext.getManifestControlConfiguration(referenceTarget).actions, converterContext);
          break;

        case "com.sap.vocabularies.UI.v1.Identification":
        case "com.sap.vocabularies.UI.v1.StatusInfo":
          if (referenceTarget.qualifier) {
            dataFieldCollection = referenceTarget;
          }

          break;
      }
    }

    return dataFieldCollection.reduce(function (actions, dataField) {
      var _dataField$annotation, _dataField$annotation2, _dataField$annotation3, _dataField$annotation4, _dataField$annotation5;

      var UIAnnotation = dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : _dataField$annotation.UI;

      switch (dataField.$Type) {
        case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
          if (dataField.RequiresContext === true) {
            converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Low, IssueType.MALFORMED_DATAFIELD_FOR_IBN.REQUIRESCONTEXT);
          }

          if (dataField.Inline === true) {
            converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Low, IssueType.MALFORMED_DATAFIELD_FOR_IBN.INLINE);
          }

          var mNavigationParameters = {};

          if (dataField.Mapping) {
            mNavigationParameters.semanticObjectMapping = getSemanticObjectMapping(dataField.Mapping);
          }

          actions.push({
            type: ActionType.DataFieldForIntentBasedNavigation,
            id: FormID({
              Facet: facetDefinition
            }, dataField),
            key: KeyHelper.generateKeyFromDataField(dataField),
            text: dataField.Label,
            annotationPath: "",
            visible: compileBinding(not(equal(annotationExpression((_dataField$annotation2 = dataField.annotations) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.UI) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.Hidden), true))),
            buttonType: getButtonType(UIAnnotation === null || UIAnnotation === void 0 ? void 0 : UIAnnotation.Emphasized),
            press: compileBinding(fn("._intentBasedNavigation.navigate", [annotationExpression(dataField.SemanticObject), annotationExpression(dataField.Action), mNavigationParameters])),
            customData: compileBinding({
              semanticObject: annotationExpression(dataField.SemanticObject),
              action: annotationExpression(dataField.Action)
            })
          });
          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForAction":
          var formManifestActionsConfiguration = converterContext.getManifestControlConfiguration(referenceTarget).actions;
          var key = KeyHelper.generateKeyFromDataField(dataField);
          actions.push({
            type: ActionType.DataFieldForAction,
            id: FormID({
              Facet: facetDefinition
            }, dataField),
            key: key,
            text: dataField.Label,
            annotationPath: "",
            enabled: getEnabledBinding(dataField.ActionTarget),
            binding: navigationPropertyPath ? "{ 'path' : '" + navigationPropertyPath + "'}" : undefined,
            visible: compileBinding(not(equal(annotationExpression((_dataField$annotation4 = dataField.annotations) === null || _dataField$annotation4 === void 0 ? void 0 : (_dataField$annotation5 = _dataField$annotation4.UI) === null || _dataField$annotation5 === void 0 ? void 0 : _dataField$annotation5.Hidden), true))),
            requiresDialog: isDialog(dataField.ActionTarget),
            buttonType: getButtonType(UIAnnotation === null || UIAnnotation === void 0 ? void 0 : UIAnnotation.Emphasized),
            press: compileBinding(fn("invokeAction", [dataField.Action, {
              contexts: fn("getBindingContext", [], bindingExpression("", "$source")),
              invocationGrouping: dataField.InvocationGrouping === "UI.OperationGroupingType/ChangeSet" ? "ChangeSet" : "Isolated",
              label: annotationExpression(dataField.Label),
              model: fn("getModel", [], bindingExpression("/", "$source")),
              isNavigable: isActionNavigable(formManifestActionsConfiguration && formManifestActionsConfiguration[key])
            }], ref(".editFlow")))
          });
          break;
      }

      actions = insertCustomElements(actions, manifestActions);
      return actions;
    }, actions);
  }

  function isDialog(actionDefinition) {
    if (actionDefinition) {
      var _actionDefinition$ann, _actionDefinition$ann2;

      var bCritical = (_actionDefinition$ann = actionDefinition.annotations) === null || _actionDefinition$ann === void 0 ? void 0 : (_actionDefinition$ann2 = _actionDefinition$ann.Common) === null || _actionDefinition$ann2 === void 0 ? void 0 : _actionDefinition$ann2.IsActionCritical;

      if (actionDefinition.parameters.length > 1 || bCritical) {
        return "Dialog";
      } else {
        return "None";
      }
    } else {
      return "None";
    }
  }

  _exports.isDialog = isDialog;

  function createCustomSubSections(manifestSubSections, converterContext) {
    var subSections = {};
    Object.keys(manifestSubSections).forEach(function (subSectionKey) {
      return subSections[subSectionKey] = createCustomSubSection(manifestSubSections[subSectionKey], subSectionKey, converterContext);
    });
    return subSections;
  }

  _exports.createCustomSubSections = createCustomSubSections;

  function createCustomSubSection(manifestSubSection, subSectionKey, converterContext) {
    var position = manifestSubSection.position;

    if (!position) {
      position = {
        placement: Placement.After
      };
    }

    var subSectionDefinition = {
      type: SubSectionType.Unknown,
      id: manifestSubSection.id || CustomSubSectionID(subSectionKey),
      actions: getActionsFromManifest(manifestSubSection.actions, converterContext),
      key: subSectionKey,
      title: manifestSubSection.title,
      level: 1,
      position: position,
      visible: manifestSubSection.visible
    };

    if (manifestSubSection.template || manifestSubSection.name) {
      subSectionDefinition.type = SubSectionType.XMLFragment;
      subSectionDefinition.template = manifestSubSection.template || manifestSubSection.name || "";
    } else {
      subSectionDefinition.type = SubSectionType.Placeholder;
    }

    return subSectionDefinition;
  }
  /**
   * Evaluate if the condensed mode can be appli3ed on the table.
   *
   * @param currentFacet
   * @param facetsToCreateInSection
   * @param converterContext
   *
   * @returns {boolean}  true for compliant, false otherwise
   */


  _exports.createCustomSubSection = createCustomSubSection;

  function getCondensedTableLayoutCompliance(currentFacet, facetsToCreateInSection, converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();

    if (manifestWrapper.useIconTabBar()) {
      // If the OP use the tab based we check if the facets that will be created for this section are all non visible
      return hasNoOtherVisibleTableInTargets(currentFacet, facetsToCreateInSection);
    } else {
      var _entityType$annotatio, _entityType$annotatio2, _entityType$annotatio3, _entityType$annotatio4, _entityType$annotatio5, _entityType$annotatio6;

      var entityType = converterContext.getEntityType();

      if (((_entityType$annotatio = entityType.annotations) === null || _entityType$annotatio === void 0 ? void 0 : (_entityType$annotatio2 = _entityType$annotatio.UI) === null || _entityType$annotatio2 === void 0 ? void 0 : (_entityType$annotatio3 = _entityType$annotatio2.Facets) === null || _entityType$annotatio3 === void 0 ? void 0 : _entityType$annotatio3.length) && ((_entityType$annotatio4 = entityType.annotations) === null || _entityType$annotatio4 === void 0 ? void 0 : (_entityType$annotatio5 = _entityType$annotatio4.UI) === null || _entityType$annotatio5 === void 0 ? void 0 : (_entityType$annotatio6 = _entityType$annotatio5.Facets) === null || _entityType$annotatio6 === void 0 ? void 0 : _entityType$annotatio6.length) > 1) {
        return hasNoOtherVisibleTableInTargets(currentFacet, facetsToCreateInSection);
      } else {
        return true;
      }
    }
  }

  function hasNoOtherVisibleTableInTargets(currentFacet, facetsToCreateInSection) {
    return facetsToCreateInSection.every(function (subFacet) {
      if (subFacet !== currentFacet) {
        if (subFacet.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
          var _refFacet$Target, _refFacet$Target$$tar, _refFacet$Target2, _refFacet$Target2$$ta, _refFacet$Target$$tar2;

          var refFacet = subFacet;

          if (((_refFacet$Target = refFacet.Target) === null || _refFacet$Target === void 0 ? void 0 : (_refFacet$Target$$tar = _refFacet$Target.$target) === null || _refFacet$Target$$tar === void 0 ? void 0 : _refFacet$Target$$tar.term) === "com.sap.vocabularies.UI.v1.LineItem" || ((_refFacet$Target2 = refFacet.Target) === null || _refFacet$Target2 === void 0 ? void 0 : (_refFacet$Target2$$ta = _refFacet$Target2.$target) === null || _refFacet$Target2$$ta === void 0 ? void 0 : _refFacet$Target2$$ta.term) === "com.sap.vocabularies.UI.v1.PresentationVariant" || ((_refFacet$Target$$tar2 = refFacet.Target.$target) === null || _refFacet$Target$$tar2 === void 0 ? void 0 : _refFacet$Target$$tar2.term) === "com.sap.vocabularies.UI.v1.SelectionPresentationVariant") {
            var _refFacet$annotations, _refFacet$annotations2, _refFacet$annotations3, _refFacet$annotations4;

            return ((_refFacet$annotations = refFacet.annotations) === null || _refFacet$annotations === void 0 ? void 0 : (_refFacet$annotations2 = _refFacet$annotations.UI) === null || _refFacet$annotations2 === void 0 ? void 0 : _refFacet$annotations2.Hidden) !== undefined ? (_refFacet$annotations3 = refFacet.annotations) === null || _refFacet$annotations3 === void 0 ? void 0 : (_refFacet$annotations4 = _refFacet$annotations3.UI) === null || _refFacet$annotations4 === void 0 ? void 0 : _refFacet$annotations4.Hidden : false;
          }

          return true;
        } else {
          var subCollectionFacet = subFacet;
          return subCollectionFacet.Facets.every(function (facet) {
            var _subRefFacet$Target, _subRefFacet$Target$$, _subRefFacet$Target2, _subRefFacet$Target2$, _subRefFacet$Target3, _subRefFacet$Target3$;

            var subRefFacet = facet;

            if (((_subRefFacet$Target = subRefFacet.Target) === null || _subRefFacet$Target === void 0 ? void 0 : (_subRefFacet$Target$$ = _subRefFacet$Target.$target) === null || _subRefFacet$Target$$ === void 0 ? void 0 : _subRefFacet$Target$$.term) === "com.sap.vocabularies.UI.v1.LineItem" || ((_subRefFacet$Target2 = subRefFacet.Target) === null || _subRefFacet$Target2 === void 0 ? void 0 : (_subRefFacet$Target2$ = _subRefFacet$Target2.$target) === null || _subRefFacet$Target2$ === void 0 ? void 0 : _subRefFacet$Target2$.term) === "com.sap.vocabularies.UI.v1.PresentationVariant" || ((_subRefFacet$Target3 = subRefFacet.Target) === null || _subRefFacet$Target3 === void 0 ? void 0 : (_subRefFacet$Target3$ = _subRefFacet$Target3.$target) === null || _subRefFacet$Target3$ === void 0 ? void 0 : _subRefFacet$Target3$.term) === "com.sap.vocabularies.UI.v1.SelectionPresentationVariant") {
              var _subRefFacet$annotati, _subRefFacet$annotati2, _subRefFacet$annotati3, _subRefFacet$annotati4;

              return ((_subRefFacet$annotati = subRefFacet.annotations) === null || _subRefFacet$annotati === void 0 ? void 0 : (_subRefFacet$annotati2 = _subRefFacet$annotati.UI) === null || _subRefFacet$annotati2 === void 0 ? void 0 : _subRefFacet$annotati2.Hidden) !== undefined ? (_subRefFacet$annotati3 = subRefFacet.annotations) === null || _subRefFacet$annotati3 === void 0 ? void 0 : (_subRefFacet$annotati4 = _subRefFacet$annotati3.UI) === null || _subRefFacet$annotati4 === void 0 ? void 0 : _subRefFacet$annotati4.Hidden : false;
            }

            return true;
          });
        }
      }

      return true;
    });
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN1YlNlY3Rpb24udHMiXSwibmFtZXMiOlsiU3ViU2VjdGlvblR5cGUiLCJ0YXJnZXRUZXJtcyIsImhhc1RhYmxlIiwiZmFjZXRzIiwic29tZSIsImZhY2V0VHlwZSIsImluZGV4T2YiLCJUYXJnZXQiLCIkdGFyZ2V0IiwidGVybSIsImNyZWF0ZVN1YlNlY3Rpb25zIiwiZmFjZXRDb2xsZWN0aW9uIiwiY29udmVydGVyQ29udGV4dCIsImZhY2V0c1RvQ3JlYXRlIiwicmVkdWNlIiwiZmFjZXREZWZpbml0aW9uIiwiJFR5cGUiLCJwdXNoIiwiRmFjZXRzIiwiZmluZCIsInNwbGljZSIsImxlbmd0aCIsIm1hcCIsImZhY2V0IiwiY3JlYXRlU3ViU2VjdGlvbiIsImdldFN1YlNlY3Rpb25LZXkiLCJmYWxsYmFjayIsIklEIiwidG9TdHJpbmciLCJMYWJlbCIsImdldEZhY2V0QWN0aW9ucyIsImFjdGlvbnMiLCJBcnJheSIsImZpbHRlciIsImlzUmVmZXJlbmNlRmFjZXQiLCJjcmVhdGVGb3JtQWN0aW9uUmVkdWNlciIsImdldEJ1dHRvblR5cGUiLCJFbXBoYXNpemVkIiwiUGF0aEZvckJ1dHRvblR5cGUiLCJwYXRoIiwiQnV0dG9uVHlwZSIsIlRyYW5zcGFyZW50IiwiR2hvc3QiLCJsZXZlbCIsImhhc1NpbmdsZUNvbnRlbnQiLCJzdWJTZWN0aW9uSUQiLCJTdWJTZWN0aW9uSUQiLCJGYWNldCIsInN1YlNlY3Rpb24iLCJpZCIsImtleSIsInRpdGxlIiwiY29tcGlsZUJpbmRpbmciLCJhbm5vdGF0aW9uRXhwcmVzc2lvbiIsInR5cGUiLCJVbmtub3duIiwiYW5ub3RhdGlvblBhdGgiLCJnZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwidmlzaWJsZSIsIm5vdCIsImVxdWFsIiwiYW5ub3RhdGlvbnMiLCJVSSIsIkhpZGRlbiIsImNvbnRlbnQiLCJ0YWJsZUNvbnRlbnQiLCJpbmRleCIsInVuc3VwcG9ydGVkVGV4dCIsImkiLCJjb25jYXQiLCJtaXhlZFN1YlNlY3Rpb24iLCJNaXhlZCIsImZvcm1Db2xsZWN0aW9uU3ViU2VjdGlvbiIsIkZvcm0iLCJmb3JtRGVmaW5pdGlvbiIsImNyZWF0ZUZvcm1EZWZpbml0aW9uIiwidmFsdWUiLCJwcmVzZW50YXRpb24iLCJnZXREYXRhVmlzdWFsaXphdGlvbkNvbmZpZ3VyYXRpb24iLCJnZXRDb25kZW5zZWRUYWJsZUxheW91dENvbXBsaWFuY2UiLCJjb250cm9sVGl0bGUiLCJ2aXN1YWxpemF0aW9ucyIsImFubm90YXRpb24iLCJkYXRhVmlzdWFsaXphdGlvblN1YlNlY3Rpb24iLCJEYXRhVmlzdWFsaXphdGlvbiIsInNob3dUaXRsZSIsImlzU3Vic2VjdGlvblRpdGxlU2hvd24iLCJmb3JtRWxlbWVudFN1YlNlY3Rpb24iLCJ1bnN1cHBvcnRlZFN1YlNlY3Rpb24iLCJ0ZXh0Iiwic3ViU2VjdGlvblRpdGxlIiwicmVmZXJlbmNlVGFyZ2V0IiwidGFyZ2V0VmFsdWUiLCJtYW5pZmVzdEFjdGlvbnMiLCJkYXRhRmllbGRDb2xsZWN0aW9uIiwic3BsaXQiLCJuYXZpZ2F0aW9uUHJvcGVydHlQYXRoIiwibGFzdEluZGV4T2YiLCJzdWJzdHIiLCJ1bmRlZmluZWQiLCJEYXRhIiwiZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdCIsImdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24iLCJxdWFsaWZpZXIiLCJkYXRhRmllbGQiLCJVSUFubm90YXRpb24iLCJSZXF1aXJlc0NvbnRleHQiLCJnZXREaWFnbm9zdGljcyIsImFkZElzc3VlIiwiSXNzdWVDYXRlZ29yeSIsIkFubm90YXRpb24iLCJJc3N1ZVNldmVyaXR5IiwiTG93IiwiSXNzdWVUeXBlIiwiTUFMRk9STUVEX0RBVEFGSUVMRF9GT1JfSUJOIiwiUkVRVUlSRVNDT05URVhUIiwiSW5saW5lIiwiSU5MSU5FIiwibU5hdmlnYXRpb25QYXJhbWV0ZXJzIiwiTWFwcGluZyIsInNlbWFudGljT2JqZWN0TWFwcGluZyIsImdldFNlbWFudGljT2JqZWN0TWFwcGluZyIsIkFjdGlvblR5cGUiLCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24iLCJGb3JtSUQiLCJLZXlIZWxwZXIiLCJnZW5lcmF0ZUtleUZyb21EYXRhRmllbGQiLCJidXR0b25UeXBlIiwicHJlc3MiLCJmbiIsIlNlbWFudGljT2JqZWN0IiwiQWN0aW9uIiwiY3VzdG9tRGF0YSIsInNlbWFudGljT2JqZWN0IiwiYWN0aW9uIiwiZm9ybU1hbmlmZXN0QWN0aW9uc0NvbmZpZ3VyYXRpb24iLCJEYXRhRmllbGRGb3JBY3Rpb24iLCJlbmFibGVkIiwiZ2V0RW5hYmxlZEJpbmRpbmciLCJBY3Rpb25UYXJnZXQiLCJiaW5kaW5nIiwicmVxdWlyZXNEaWFsb2ciLCJpc0RpYWxvZyIsImNvbnRleHRzIiwiYmluZGluZ0V4cHJlc3Npb24iLCJpbnZvY2F0aW9uR3JvdXBpbmciLCJJbnZvY2F0aW9uR3JvdXBpbmciLCJsYWJlbCIsIm1vZGVsIiwiaXNOYXZpZ2FibGUiLCJpc0FjdGlvbk5hdmlnYWJsZSIsInJlZiIsImluc2VydEN1c3RvbUVsZW1lbnRzIiwiYWN0aW9uRGVmaW5pdGlvbiIsImJDcml0aWNhbCIsIkNvbW1vbiIsIklzQWN0aW9uQ3JpdGljYWwiLCJwYXJhbWV0ZXJzIiwiY3JlYXRlQ3VzdG9tU3ViU2VjdGlvbnMiLCJtYW5pZmVzdFN1YlNlY3Rpb25zIiwic3ViU2VjdGlvbnMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsInN1YlNlY3Rpb25LZXkiLCJjcmVhdGVDdXN0b21TdWJTZWN0aW9uIiwibWFuaWZlc3RTdWJTZWN0aW9uIiwicG9zaXRpb24iLCJwbGFjZW1lbnQiLCJQbGFjZW1lbnQiLCJBZnRlciIsInN1YlNlY3Rpb25EZWZpbml0aW9uIiwiQ3VzdG9tU3ViU2VjdGlvbklEIiwidGVtcGxhdGUiLCJuYW1lIiwiWE1MRnJhZ21lbnQiLCJQbGFjZWhvbGRlciIsImN1cnJlbnRGYWNldCIsImZhY2V0c1RvQ3JlYXRlSW5TZWN0aW9uIiwibWFuaWZlc3RXcmFwcGVyIiwiZ2V0TWFuaWZlc3RXcmFwcGVyIiwidXNlSWNvblRhYkJhciIsImhhc05vT3RoZXJWaXNpYmxlVGFibGVJblRhcmdldHMiLCJlbnRpdHlUeXBlIiwiZ2V0RW50aXR5VHlwZSIsImV2ZXJ5Iiwic3ViRmFjZXQiLCJyZWZGYWNldCIsInN1YkNvbGxlY3Rpb25GYWNldCIsInN1YlJlZkZhY2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQTBDWUEsYzs7YUFBQUEsYztBQUFBQSxJQUFBQSxjO0FBQUFBLElBQUFBLGM7QUFBQUEsSUFBQUEsYztBQUFBQSxJQUFBQSxjO0FBQUFBLElBQUFBLGM7QUFBQUEsSUFBQUEsYztLQUFBQSxjLEtBQUFBLGM7OztBQTZFWixNQUFNQyxXQUFxQixHQUFHLG9KQUE5QixDLENBTUE7O0FBQ0EsTUFBTUMsUUFBUSxHQUFHLFlBQXdCO0FBQUEsUUFBdkJDLE1BQXVCLHVFQUFQLEVBQU87QUFDeEMsV0FBT0EsTUFBTSxDQUFDQyxJQUFQLENBQVksVUFBQUMsU0FBUztBQUFBOztBQUFBLGFBQUlKLFdBQVcsQ0FBQ0ssT0FBWixDQUFvQkQsU0FBcEIsYUFBb0JBLFNBQXBCLDRDQUFvQkEsU0FBUyxDQUFFRSxNQUEvQiwrRUFBb0Isa0JBQW1CQyxPQUF2QywwREFBb0Isc0JBQTRCQyxJQUFoRCxJQUF3RCxDQUFDLENBQTdEO0FBQUEsS0FBckIsQ0FBUDtBQUNBLEdBRkQ7QUFJQTs7Ozs7Ozs7O0FBT08sV0FBU0MsaUJBQVQsQ0FBMkJDLGVBQTNCLEVBQTBEQyxnQkFBMUQsRUFBc0g7QUFDNUg7QUFDQSxRQUFNQyxjQUFjLEdBQUdGLGVBQWUsQ0FBQ0csTUFBaEIsQ0FBdUIsVUFBQ0QsY0FBRCxFQUErQkUsZUFBL0IsRUFBbUQ7QUFDaEcsY0FBUUEsZUFBZSxDQUFDQyxLQUF4QjtBQUNDO0FBQ0NILFVBQUFBLGNBQWMsQ0FBQ0ksSUFBZixDQUFvQkYsZUFBcEI7QUFDQTs7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TCxXQUFXLENBQUNoSSxXQUFaLDBHQUF5QkMsRUFBekIsa0ZBQTZCQyxNQUE3QixNQUF3Q29DLFNBQXhDLDZCQUFvRDBGLFdBQVcsQ0FBQ2hJLFdBQWhFLHFGQUFvRCx1QkFBeUJDLEVBQTdFLDJEQUFvRCx1QkFBNkJDLE1BQWpGLEdBQTBGLEtBQWpHO0FBQ0E7O0FBQ0QsbUJBQU8sSUFBUDtBQUNBLFdBVk0sQ0FBUDtBQVdBO0FBQ0Q7O0FBQ0QsYUFBTyxJQUFQO0FBQ0EsS0E1Qk0sQ0FBUDtBQTZCQSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uVHlwZSwgTWFuaWZlc3RTdWJTZWN0aW9uIH0gZnJvbSBcIi4uLy4uL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7XG5cdEFubm90YXRpb25UZXJtLFxuXHRDb2xsZWN0aW9uRmFjZXRUeXBlcyxcblx0RGF0YUZpZWxkQWJzdHJhY3RUeXBlcyxcblx0RmFjZXRUeXBlcyxcblx0RmllbGRHcm91cCxcblx0SWRlbnRpZmljYXRpb24sXG5cdE9wZXJhdGlvbkdyb3VwaW5nVHlwZSxcblx0UmVmZXJlbmNlRmFjZXRUeXBlcyxcblx0U3RhdHVzSW5mbyxcblx0VUlBbm5vdGF0aW9uVGVybXMsXG5cdFVJQW5ub3RhdGlvblR5cGVzXG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgQ29tbXVuaWNhdGlvbkFubm90YXRpb25UZXJtcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L2dlbmVyYXRlZC9Db21tdW5pY2F0aW9uXCI7XG5pbXBvcnQgeyBDdXN0b21TdWJTZWN0aW9uSUQsIEZvcm1JRCwgU3ViU2VjdGlvbklEIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvSURcIjtcbmltcG9ydCB7IENvbnZlcnRlckNvbnRleHQgfSBmcm9tIFwiLi4vLi4vdGVtcGxhdGVzL0Jhc2VDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IGNyZWF0ZUZvcm1EZWZpbml0aW9uLCBGb3JtRGVmaW5pdGlvbiwgaXNSZWZlcmVuY2VGYWNldCB9IGZyb20gXCIuLi9Db21tb24vRm9ybVwiO1xuaW1wb3J0IHsgRGF0YVZpc3VhbGl6YXRpb25EZWZpbml0aW9uLCBnZXREYXRhVmlzdWFsaXphdGlvbkNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vQ29tbW9uL0RhdGFWaXN1YWxpemF0aW9uXCI7XG5pbXBvcnQgeyBDb25maWd1cmFibGVPYmplY3QsIEN1c3RvbUVsZW1lbnQsIGluc2VydEN1c3RvbUVsZW1lbnRzLCBQbGFjZW1lbnQgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7XG5cdENvbnZlcnRlckFjdGlvbixcblx0Q3VzdG9tQWN0aW9uLFxuXHRnZXRBY3Rpb25zRnJvbU1hbmlmZXN0LFxuXHRnZXRFbmFibGVkQmluZGluZyxcblx0aXNBY3Rpb25OYXZpZ2FibGUsXG5cdEJ1dHRvblR5cGUsXG5cdGdldFNlbWFudGljT2JqZWN0TWFwcGluZ1xufSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9Db21tb24vQWN0aW9uXCI7XG5pbXBvcnQgeyBLZXlIZWxwZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0tleVwiO1xuaW1wb3J0IHtcblx0YW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdGJpbmRpbmdFeHByZXNzaW9uLFxuXHRCaW5kaW5nRXhwcmVzc2lvbixcblx0Y29tcGlsZUJpbmRpbmcsXG5cdGVxdWFsLFxuXHRmbixcblx0bm90LFxuXHRyZWZcbn0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ0V4cHJlc3Npb25cIjtcbmltcG9ydCB7IElzc3VlVHlwZSwgSXNzdWVTZXZlcml0eSwgSXNzdWVDYXRlZ29yeSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSXNzdWVNYW5hZ2VyXCI7XG5cbmV4cG9ydCBlbnVtIFN1YlNlY3Rpb25UeXBlIHtcblx0VW5rbm93biA9IFwiVW5rbm93blwiLCAvLyBEZWZhdWx0IFR5cGVcblx0Rm9ybSA9IFwiRm9ybVwiLFxuXHREYXRhVmlzdWFsaXphdGlvbiA9IFwiRGF0YVZpc3VhbGl6YXRpb25cIixcblx0WE1MRnJhZ21lbnQgPSBcIlhNTEZyYWdtZW50XCIsXG5cdFBsYWNlaG9sZGVyID0gXCJQbGFjZWhvbGRlclwiLFxuXHRNaXhlZCA9IFwiTWl4ZWRcIlxufVxuXG50eXBlIE9iamVjdFBhZ2VTdWJTZWN0aW9uID1cblx0fCBVbnN1cHBvcnRlZFN1YlNlY3Rpb25cblx0fCBGb3JtU3ViU2VjdGlvblxuXHR8IERhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvblxuXHR8IENvbnRhY3RTdWJTZWN0aW9uXG5cdHwgWE1MRnJhZ21lbnRTdWJTZWN0aW9uXG5cdHwgUGxhY2Vob2xkZXJGcmFnbWVudFN1YlNlY3Rpb25cblx0fCBNaXhlZFN1YlNlY3Rpb247XG5cbnR5cGUgQmFzZVN1YlNlY3Rpb24gPSB7XG5cdGlkOiBzdHJpbmc7XG5cdGtleTogc3RyaW5nO1xuXHR0aXRsZTogQmluZGluZ0V4cHJlc3Npb248c3RyaW5nPjtcblx0YW5ub3RhdGlvblBhdGg6IHN0cmluZztcblx0dHlwZTogU3ViU2VjdGlvblR5cGU7XG5cdHZpc2libGU6IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHRsZXZlbDogbnVtYmVyO1xufTtcblxudHlwZSBVbnN1cHBvcnRlZFN1YlNlY3Rpb24gPSBCYXNlU3ViU2VjdGlvbiAmIHtcblx0dGV4dDogc3RyaW5nO1xufTtcblxudHlwZSBEYXRhVmlzdWFsaXphdGlvblN1YlNlY3Rpb24gPSBCYXNlU3ViU2VjdGlvbiAmIHtcblx0dHlwZTogU3ViU2VjdGlvblR5cGUuRGF0YVZpc3VhbGl6YXRpb247XG5cdHByZXNlbnRhdGlvbjogRGF0YVZpc3VhbGl6YXRpb25EZWZpbml0aW9uO1xuXHRzaG93VGl0bGU6IGJvb2xlYW47XG59O1xuXG50eXBlIENvbnRhY3RTdWJTZWN0aW9uID0gVW5zdXBwb3J0ZWRTdWJTZWN0aW9uICYge307XG5cbnR5cGUgWE1MRnJhZ21lbnRTdWJTZWN0aW9uID0gT21pdDxCYXNlU3ViU2VjdGlvbiwgXCJhbm5vdGF0aW9uUGF0aFwiPiAmIHtcblx0dHlwZTogU3ViU2VjdGlvblR5cGUuWE1MRnJhZ21lbnQ7XG5cdHRlbXBsYXRlOiBzdHJpbmc7XG5cdGFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj47XG59O1xuXG50eXBlIEVtcGhhc2l6ZWQgPSB7XG5cdHBhdGg6IHN0cmluZztcbn07XG5cbnR5cGUgUGxhY2Vob2xkZXJGcmFnbWVudFN1YlNlY3Rpb24gPSBPbWl0PEJhc2VTdWJTZWN0aW9uLCBcImFubm90YXRpb25QYXRoXCI+ICYge1xuXHR0eXBlOiBTdWJTZWN0aW9uVHlwZS5QbGFjZWhvbGRlcjtcblx0YWN0aW9uczogUmVjb3JkPHN0cmluZywgQ3VzdG9tQWN0aW9uPjtcbn07XG5cbnR5cGUgTWl4ZWRTdWJTZWN0aW9uID0gQmFzZVN1YlNlY3Rpb24gJiB7XG5cdGNvbnRlbnQ6IEFycmF5PE9iamVjdFBhZ2VTdWJTZWN0aW9uPjtcbn07XG5cbmV4cG9ydCB0eXBlIEZvcm1TdWJTZWN0aW9uID0gQmFzZVN1YlNlY3Rpb24gJiB7XG5cdHR5cGU6IFN1YlNlY3Rpb25UeXBlLkZvcm07XG5cdGZvcm1EZWZpbml0aW9uOiBGb3JtRGVmaW5pdGlvbjtcblx0YWN0aW9uczogQ29udmVydGVyQWN0aW9uW107XG59O1xuXG5leHBvcnQgdHlwZSBPYmplY3RQYWdlU2VjdGlvbiA9IENvbmZpZ3VyYWJsZU9iamVjdCAmIHtcblx0aWQ6IHN0cmluZztcblx0dGl0bGU6IEJpbmRpbmdFeHByZXNzaW9uPHN0cmluZz47XG5cdHNob3dUaXRsZT86IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHR2aXNpYmxlOiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPjtcblx0c3ViU2VjdGlvbnM6IE9iamVjdFBhZ2VTdWJTZWN0aW9uW107XG59O1xuXG5leHBvcnQgdHlwZSBDdXN0b21PYmplY3RQYWdlU2VjdGlvbiA9IEN1c3RvbUVsZW1lbnQ8T2JqZWN0UGFnZVNlY3Rpb24+O1xuXG5leHBvcnQgdHlwZSBDdXN0b21PYmplY3RQYWdlU3ViU2VjdGlvbiA9IEN1c3RvbUVsZW1lbnQ8T2JqZWN0UGFnZVN1YlNlY3Rpb24+O1xuXG5jb25zdCB0YXJnZXRUZXJtczogc3RyaW5nW10gPSBbXG5cdFVJQW5ub3RhdGlvblRlcm1zLkxpbmVJdGVtLFxuXHRVSUFubm90YXRpb25UZXJtcy5QcmVzZW50YXRpb25WYXJpYW50LFxuXHRVSUFubm90YXRpb25UZXJtcy5TZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50XG5dO1xuXG4vLyBUT0RPOiBOZWVkIHRvIGhhbmRsZSBUYWJsZSBjYXNlIGluc2lkZSBjcmVhdGVTdWJTZWN0aW9uIGZ1bmN0aW9uIGlmIENvbGxlY3Rpb25GYWNldCBoYXMgVGFibGUgUmVmZXJlbmNlRmFjZXRcbmNvbnN0IGhhc1RhYmxlID0gKGZhY2V0czogYW55W10gPSBbXSkgPT4ge1xuXHRyZXR1cm4gZmFjZXRzLnNvbWUoZmFjZXRUeXBlID0+IHRhcmdldFRlcm1zLmluZGV4T2YoZmFjZXRUeXBlPy5UYXJnZXQ/LiR0YXJnZXQ/LnRlcm0pID4gLTEpO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgc3Vic2VjdGlvbnMgYmFzZWQgb24gZmFjZXQgZGVmaW5pdGlvbi5cbiAqXG4gKiBAcGFyYW0gZmFjZXRDb2xsZWN0aW9uXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHJldHVybnMge09iamVjdFBhZ2VTdWJTZWN0aW9uW119IHRoZSBjdXJyZW50IHN1YmVjdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN1YlNlY3Rpb25zKGZhY2V0Q29sbGVjdGlvbjogRmFjZXRUeXBlc1tdLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogT2JqZWN0UGFnZVN1YlNlY3Rpb25bXSB7XG5cdC8vIEZpcnN0IHdlIGRldGVybWluZSB3aGljaCBzdWIgc2VjdGlvbiB3ZSBuZWVkIHRvIGNyZWF0ZVxuXHRjb25zdCBmYWNldHNUb0NyZWF0ZSA9IGZhY2V0Q29sbGVjdGlvbi5yZWR1Y2UoKGZhY2V0c1RvQ3JlYXRlOiBGYWNldFR5cGVzW10sIGZhY2V0RGVmaW5pdGlvbikgPT4ge1xuXHRcdHN3aXRjaCAoZmFjZXREZWZpbml0aW9uLiRUeXBlKSB7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0OlxuXHRcdFx0XHRmYWNldHNUb0NyZWF0ZS5wdXNoKGZhY2V0RGVmaW5pdGlvbik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5Db2xsZWN0aW9uRmFjZXQ6XG5cdFx0XHRcdC8vIFRPRE8gSWYgdGhlIENvbGxlY3Rpb24gRmFjZXQgaGFzIGEgY2hpbGQgb2YgdHlwZSBDb2xsZWN0aW9uIEZhY2V0IHdlIGJyaW5nIHRoZW0gdXAgb25lIGxldmVsIChGb3JtICsgVGFibGUgdXNlIGNhc2UpID9cblx0XHRcdFx0Ly8gZmlyc3QgY2FzZSBmYWNldCBDb2xsZWN0aW9uIGlzIGNvbWJpbmF0aW9uIG9mIGNvbGxlY3Rpb24gYW5kIHJlZmVyZW5jZSBmYWNldCBvciBub3QgYWxsIGZhY2V0cyBhcmUgcmVmZXJlbmNlIGZhY2V0cy5cblx0XHRcdFx0aWYgKGZhY2V0RGVmaW5pdGlvbi5GYWNldHMuZmluZChmYWNldFR5cGUgPT4gZmFjZXRUeXBlLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5Db2xsZWN0aW9uRmFjZXQpKSB7XG5cdFx0XHRcdFx0ZmFjZXRzVG9DcmVhdGUuc3BsaWNlKGZhY2V0c1RvQ3JlYXRlLmxlbmd0aCwgMCwgLi4uZmFjZXREZWZpbml0aW9uLkZhY2V0cyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZmFjZXRzVG9DcmVhdGUucHVzaChmYWNldERlZmluaXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5SZWZlcmVuY2VVUkxGYWNldDpcblx0XHRcdFx0Ly8gTm90IHN1cHBvcnRlZFxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdFx0cmV0dXJuIGZhY2V0c1RvQ3JlYXRlO1xuXHR9LCBbXSk7XG5cblx0Ly8gVGhlbiB3ZSBjcmVhdGUgdGhlIGFjdHVhbCBzdWJzZWN0aW9uc1xuXHRyZXR1cm4gZmFjZXRzVG9DcmVhdGUubWFwKGZhY2V0ID0+IGNyZWF0ZVN1YlNlY3Rpb24oZmFjZXQsIGZhY2V0c1RvQ3JlYXRlLCBjb252ZXJ0ZXJDb250ZXh0LCAwLCAhKGZhY2V0IGFzIGFueSk/LkZhY2V0cz8ubGVuZ3RoKSk7XG59XG5cbi8vIGZ1bmN0aW9uIGlzVGFyZ2V0Rm9yQ29tcGxpYW50KGFubm90YXRpb25QYXRoOiBBbm5vdGF0aW9uUGF0aCkge1xuLy8gXHRyZXR1cm4gLy4qY29tXFwuc2FwXFwudm9jYWJ1bGFyaWVzXFwuVUlcXC52MVxcLihGaWVsZEdyb3VwfElkZW50aWZpY2F0aW9ufERhdGFQb2ludHxTdGF0dXNJbmZvKS4qLy50ZXN0KGFubm90YXRpb25QYXRoLnZhbHVlKTtcbi8vIH1cbmNvbnN0IGdldFN1YlNlY3Rpb25LZXkgPSAoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBmYWxsYmFjazogc3RyaW5nKTogc3RyaW5nID0+IHtcblx0cmV0dXJuIGZhY2V0RGVmaW5pdGlvbi5JRD8udG9TdHJpbmcoKSB8fCBmYWNldERlZmluaXRpb24uTGFiZWw/LnRvU3RyaW5nKCkgfHwgZmFsbGJhY2s7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgYWN0aW9uIGZvcm0gYSBmYWNldC5cbiAqXG4gKiBAcGFyYW0gZmFjZXREZWZpbml0aW9uXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHJldHVybnMge0NvbnZlcnRlckFjdGlvbltdfSB0aGUgY3VycmVudCBmYWNldCBhY3Rpb25zXG4gKi9cbmZ1bmN0aW9uIGdldEZhY2V0QWN0aW9ucyhmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBDb252ZXJ0ZXJBY3Rpb25bXSB7XG5cdGxldCBhY3Rpb25zID0gbmV3IEFycmF5PENvbnZlcnRlckFjdGlvbj4oKTtcblx0c3dpdGNoIChmYWNldERlZmluaXRpb24uJFR5cGUpIHtcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkNvbGxlY3Rpb25GYWNldDpcblx0XHRcdGFjdGlvbnMgPSAoZmFjZXREZWZpbml0aW9uLkZhY2V0cy5maWx0ZXIoZmFjZXREZWZpbml0aW9uID0+IGlzUmVmZXJlbmNlRmFjZXQoZmFjZXREZWZpbml0aW9uKSkgYXMgUmVmZXJlbmNlRmFjZXRUeXBlc1tdKS5yZWR1Y2UoXG5cdFx0XHRcdChhY3Rpb25zOiBDb252ZXJ0ZXJBY3Rpb25bXSwgZmFjZXREZWZpbml0aW9uKSA9PiBjcmVhdGVGb3JtQWN0aW9uUmVkdWNlcihhY3Rpb25zLCBmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdFx0XHRbXVxuXHRcdFx0KTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuUmVmZXJlbmNlRmFjZXQ6XG5cdFx0XHRhY3Rpb25zID0gY3JlYXRlRm9ybUFjdGlvblJlZHVjZXIoW10sIGZhY2V0RGVmaW5pdGlvbiBhcyBSZWZlcmVuY2VGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0XHRcdGJyZWFrO1xuXHR9XG5cdHJldHVybiBhY3Rpb25zO1xufVxuLyoqXG4gKiBSZXRydW5zIHRoZSBidXR0b24gdHlwZSBiYXNlZCBvbiBAVUkuRW1waGFzaXplZCBhbm5vdGF0aW9uLlxuICogQHBhcmFtIEVtcGhhc2l6ZWQgRW1waGFzaXplZCBhbm5vdGF0aW9uIHZhbHVlLlxuICogQHJldHVybnMge0J1dHRvblR5cGUgfCBzdHJpbmd9IHJldHVybnMgYnV0dG9uIHR5cGUgb3IgcGF0aCBiYXNlZCBleHByZXNzaW9uLlxuICovXG5mdW5jdGlvbiBnZXRCdXR0b25UeXBlKEVtcGhhc2l6ZWQ6IEVtcGhhc2l6ZWQpOiBCdXR0b25UeXBlIHwgc3RyaW5nIHtcblx0Y29uc3QgUGF0aEZvckJ1dHRvblR5cGU6IHN0cmluZyA9IEVtcGhhc2l6ZWQ/LnBhdGg7XG5cdGlmIChQYXRoRm9yQnV0dG9uVHlwZSkge1xuXHRcdHJldHVybiBcIns9IFwiICsgXCIhJHtcIiArIFBhdGhGb3JCdXR0b25UeXBlICsgXCJ9ID8gJ1wiICsgQnV0dG9uVHlwZS5UcmFuc3BhcmVudCArIFwiJyA6ICR7XCIgKyBQYXRoRm9yQnV0dG9uVHlwZSArIFwifVwiICsgXCJ9XCI7XG5cdH0gZWxzZSBpZiAoRW1waGFzaXplZCkge1xuXHRcdHJldHVybiBCdXR0b25UeXBlLkdob3N0O1xuXHR9XG5cdHJldHVybiBCdXR0b25UeXBlLlRyYW5zcGFyZW50O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHN1YnNlY3Rpb24gYmFzZWQgb24gYSBGYWNldFR5cGVzLlxuICogQHBhcmFtIGZhY2V0RGVmaW5pdGlvblxuICogQHBhcmFtIGZhY2V0c1RvQ3JlYXRlXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIGxldmVsXG4gKiBAcGFyYW0gaGFzU2luZ2xlQ29udGVudFxuICogQHJldHVybnMge09iamVjdFBhZ2VTdWJTZWN0aW9ufSBvbmUgc3ViIHNlY3Rpb24gZGVmaW5pdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3ViU2VjdGlvbihcblx0ZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLFxuXHRmYWNldHNUb0NyZWF0ZTogRmFjZXRUeXBlc1tdLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRsZXZlbDogbnVtYmVyLFxuXHRoYXNTaW5nbGVDb250ZW50OiBib29sZWFuXG4pOiBPYmplY3RQYWdlU3ViU2VjdGlvbiB7XG5cdGNvbnN0IHN1YlNlY3Rpb25JRCA9IFN1YlNlY3Rpb25JRCh7IEZhY2V0OiBmYWNldERlZmluaXRpb24gfSk7XG5cdGNvbnN0IHN1YlNlY3Rpb246IEJhc2VTdWJTZWN0aW9uID0ge1xuXHRcdGlkOiBzdWJTZWN0aW9uSUQsXG5cdFx0a2V5OiBnZXRTdWJTZWN0aW9uS2V5KGZhY2V0RGVmaW5pdGlvbiwgc3ViU2VjdGlvbklEKSxcblx0XHR0aXRsZTogY29tcGlsZUJpbmRpbmcoYW5ub3RhdGlvbkV4cHJlc3Npb24oZmFjZXREZWZpbml0aW9uLkxhYmVsKSksXG5cdFx0dHlwZTogU3ViU2VjdGlvblR5cGUuVW5rbm93bixcblx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGZhY2V0RGVmaW5pdGlvbi5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdHZpc2libGU6IGNvbXBpbGVCaW5kaW5nKG5vdChlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbihmYWNldERlZmluaXRpb24uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4pLCB0cnVlKSkpLFxuXHRcdGxldmVsOiBsZXZlbFxuXHR9O1xuXHRsZXQgY29udGVudDogQXJyYXk8T2JqZWN0UGFnZVN1YlNlY3Rpb24+ID0gW107XG5cdGNvbnN0IHRhYmxlQ29udGVudDogQXJyYXk8T2JqZWN0UGFnZVN1YlNlY3Rpb24+ID0gW107XG5cdGNvbnN0IGluZGV4OiBBcnJheTxudW1iZXI+ID0gW107XG5cdGxldCB1bnN1cHBvcnRlZFRleHQgPSBcIlwiO1xuXHRsZXZlbCsrO1xuXHRzd2l0Y2ggKGZhY2V0RGVmaW5pdGlvbi4kVHlwZSkge1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0OlxuXHRcdFx0Y29uc3QgZmFjZXRzID0gZmFjZXREZWZpbml0aW9uLkZhY2V0cztcblx0XHRcdGlmIChoYXNUYWJsZShmYWNldHMpKSB7XG5cdFx0XHRcdC8vIGlmIHdlIGhhdmUgdGFibGVzIGluIGEgY29sbGVjdGlvbiBmYWNldCB0aGVuIHdlIGNyZWF0ZSBzZXBhcmF0ZSBzdWJzZWN0aW9uIGZvciB0aGVtXG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZmFjZXRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKHRhcmdldFRlcm1zLmluZGV4T2YoKGZhY2V0c1tpXSBhcyBhbnkpLlRhcmdldD8uJHRhcmdldD8udGVybSkgPiAtMSkge1xuXHRcdFx0XHRcdFx0Ly9jcmVhdGluZyBzZXBhcmF0ZSBhcnJheSBmb3IgdGFibGVzXG5cdFx0XHRcdFx0XHR0YWJsZUNvbnRlbnQucHVzaChjcmVhdGVTdWJTZWN0aW9uKGZhY2V0c1tpXSwgW10sIGNvbnZlcnRlckNvbnRleHQsIGxldmVsLCBmYWNldHMubGVuZ3RoID09PSAxKSk7XG5cdFx0XHRcdFx0XHRpbmRleC5wdXNoKGkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKGxldCBpID0gaW5kZXgubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHQvL3JlbW92ZSB0YWJsZSBmYWNldHMgZnJvbSBmYWNldCBkZWZpbml0aW9uXG5cdFx0XHRcdFx0ZmFjZXRzLnNwbGljZShpbmRleFtpXSwgMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGZhY2V0cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRmYWNldERlZmluaXRpb24uRmFjZXRzID0gZmFjZXRzO1xuXHRcdFx0XHRcdC8vY3JlYXRlIGEgZm9ybSBzdWJzZWN0aW9uIGZyb20gdGhlIHJlbWFpbmluZyBmYWNldHNcblx0XHRcdFx0XHRjb250ZW50LnB1c2goY3JlYXRlU3ViU2VjdGlvbihmYWNldERlZmluaXRpb24sIFtdLCBjb252ZXJ0ZXJDb250ZXh0LCBsZXZlbCwgaGFzU2luZ2xlQ29udGVudCkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRlbnQgPSBjb250ZW50LmNvbmNhdCh0YWJsZUNvbnRlbnQpO1xuXHRcdFx0XHRjb25zdCBtaXhlZFN1YlNlY3Rpb246IE1peGVkU3ViU2VjdGlvbiA9IHtcblx0XHRcdFx0XHQuLi5zdWJTZWN0aW9uLFxuXHRcdFx0XHRcdHR5cGU6IFN1YlNlY3Rpb25UeXBlLk1peGVkLFxuXHRcdFx0XHRcdGxldmVsOiBsZXZlbCxcblx0XHRcdFx0XHRjb250ZW50OiBjb250ZW50XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJldHVybiBtaXhlZFN1YlNlY3Rpb247XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBmb3JtQ29sbGVjdGlvblN1YlNlY3Rpb246IEZvcm1TdWJTZWN0aW9uID0ge1xuXHRcdFx0XHRcdC4uLnN1YlNlY3Rpb24sXG5cdFx0XHRcdFx0dHlwZTogU3ViU2VjdGlvblR5cGUuRm9ybSxcblx0XHRcdFx0XHRmb3JtRGVmaW5pdGlvbjogY3JlYXRlRm9ybURlZmluaXRpb24oZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdFx0XHRsZXZlbDogbGV2ZWwsXG5cdFx0XHRcdFx0YWN0aW9uczogZ2V0RmFjZXRBY3Rpb25zKGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dClcblx0XHRcdFx0fTtcblx0XHRcdFx0cmV0dXJuIGZvcm1Db2xsZWN0aW9uU3ViU2VjdGlvbjtcblx0XHRcdH1cblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0OlxuXHRcdFx0aWYgKCFmYWNldERlZmluaXRpb24uVGFyZ2V0LiR0YXJnZXQpIHtcblx0XHRcdFx0dW5zdXBwb3J0ZWRUZXh0ID0gYFVuYWJsZSB0byBmaW5kIGFubm90YXRpb25QYXRoICR7ZmFjZXREZWZpbml0aW9uLlRhcmdldC52YWx1ZX1gO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c3dpdGNoIChmYWNldERlZmluaXRpb24uVGFyZ2V0LiR0YXJnZXQudGVybSkge1xuXHRcdFx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuTGluZUl0ZW06XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5DaGFydDpcblx0XHRcdFx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLlByZXNlbnRhdGlvblZhcmlhbnQ6XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5TZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50OlxuXHRcdFx0XHRcdFx0Y29uc3QgcHJlc2VudGF0aW9uID0gZ2V0RGF0YVZpc3VhbGl6YXRpb25Db25maWd1cmF0aW9uKFxuXHRcdFx0XHRcdFx0XHRmYWNldERlZmluaXRpb24uVGFyZ2V0LnZhbHVlLFxuXHRcdFx0XHRcdFx0XHRnZXRDb25kZW5zZWRUYWJsZUxheW91dENvbXBsaWFuY2UoZmFjZXREZWZpbml0aW9uLCBmYWNldHNUb0NyZWF0ZSwgY29udmVydGVyQ29udGV4dCksXG5cdFx0XHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRsZXQgY29udHJvbFRpdGxlID0gKHByZXNlbnRhdGlvbi52aXN1YWxpemF0aW9uc1swXSBhcyBhbnkpPy5hbm5vdGF0aW9uPy50aXRsZTtcblx0XHRcdFx0XHRcdGNvbnRyb2xUaXRsZSA/IGNvbnRyb2xUaXRsZSA6IChjb250cm9sVGl0bGUgPSAocHJlc2VudGF0aW9uLnZpc3VhbGl6YXRpb25zWzBdIGFzIGFueSk/LnRpdGxlKTtcblx0XHRcdFx0XHRcdGNvbnN0IGRhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvbjogRGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uID0ge1xuXHRcdFx0XHRcdFx0XHQuLi5zdWJTZWN0aW9uLFxuXHRcdFx0XHRcdFx0XHR0eXBlOiBTdWJTZWN0aW9uVHlwZS5EYXRhVmlzdWFsaXphdGlvbixcblx0XHRcdFx0XHRcdFx0bGV2ZWw6IGxldmVsLFxuXHRcdFx0XHRcdFx0XHRwcmVzZW50YXRpb246IHByZXNlbnRhdGlvbixcblx0XHRcdFx0XHRcdFx0c2hvd1RpdGxlOiBpc1N1YnNlY3Rpb25UaXRsZVNob3duKGhhc1NpbmdsZUNvbnRlbnQsIHN1YlNlY3Rpb24udGl0bGUsIGNvbnRyb2xUaXRsZSlcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uO1xuXG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5GaWVsZEdyb3VwOlxuXHRcdFx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuSWRlbnRpZmljYXRpb246XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5EYXRhUG9pbnQ6XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5TdGF0dXNJbmZvOlxuXHRcdFx0XHRcdGNhc2UgQ29tbXVuaWNhdGlvbkFubm90YXRpb25UZXJtcy5Db250YWN0OlxuXHRcdFx0XHRcdFx0Ly8gQWxsIHRob3NlIGVsZW1lbnQgYmVsb25nIHRvIGEgZm9ybSBmYWNldFxuXHRcdFx0XHRcdFx0Y29uc3QgZm9ybUVsZW1lbnRTdWJTZWN0aW9uOiBGb3JtU3ViU2VjdGlvbiA9IHtcblx0XHRcdFx0XHRcdFx0Li4uc3ViU2VjdGlvbixcblx0XHRcdFx0XHRcdFx0dHlwZTogU3ViU2VjdGlvblR5cGUuRm9ybSxcblx0XHRcdFx0XHRcdFx0bGV2ZWw6IGxldmVsLFxuXHRcdFx0XHRcdFx0XHRmb3JtRGVmaW5pdGlvbjogY3JlYXRlRm9ybURlZmluaXRpb24oZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdFx0XHRcdFx0YWN0aW9uczogZ2V0RmFjZXRBY3Rpb25zKGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dClcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRyZXR1cm4gZm9ybUVsZW1lbnRTdWJTZWN0aW9uO1xuXG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHVuc3VwcG9ydGVkVGV4dCA9IGBGb3IgJHtmYWNldERlZmluaXRpb24uVGFyZ2V0LiR0YXJnZXQudGVybX0gRnJhZ21lbnRgO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuUmVmZXJlbmNlVVJMRmFjZXQ6XG5cdFx0XHR1bnN1cHBvcnRlZFRleHQgPSBcIkZvciBSZWZlcmVuY2UgVVJMIEZhY2V0XCI7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0YnJlYWs7XG5cdH1cblx0Ly8gSWYgd2UgcmVhY2ggaGVyZSB3ZSBlbmRlZCB1cCB3aXRoIGFuIHVuc3VwcG9ydGVkIFN1YlNlY3Rpb24gdHlwZVxuXHRjb25zdCB1bnN1cHBvcnRlZFN1YlNlY3Rpb246IFVuc3VwcG9ydGVkU3ViU2VjdGlvbiA9IHtcblx0XHQuLi5zdWJTZWN0aW9uLFxuXHRcdHRleHQ6IHVuc3VwcG9ydGVkVGV4dFxuXHR9O1xuXHRyZXR1cm4gdW5zdXBwb3J0ZWRTdWJTZWN0aW9uO1xufVxuZnVuY3Rpb24gaXNTdWJzZWN0aW9uVGl0bGVTaG93bihoYXNTaW5nbGVDb250ZW50OiBib29sZWFuLCBzdWJTZWN0aW9uVGl0bGU6IEJpbmRpbmdFeHByZXNzaW9uPHN0cmluZz4sIGNvbnRyb2xUaXRsZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdGlmIChoYXNTaW5nbGVDb250ZW50ICYmIGNvbnRyb2xUaXRsZSA9PT0gc3ViU2VjdGlvblRpdGxlKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gY3JlYXRlRm9ybUFjdGlvblJlZHVjZXIoXG5cdGFjdGlvbnM6IENvbnZlcnRlckFjdGlvbltdLFxuXHRmYWNldERlZmluaXRpb246IFJlZmVyZW5jZUZhY2V0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IENvbnZlcnRlckFjdGlvbltdIHtcblx0Y29uc3QgcmVmZXJlbmNlVGFyZ2V0OiBBbm5vdGF0aW9uVGVybTxhbnk+ID0gZmFjZXREZWZpbml0aW9uLlRhcmdldC4kdGFyZ2V0O1xuXHRjb25zdCB0YXJnZXRWYWx1ZSA9IGZhY2V0RGVmaW5pdGlvbi5UYXJnZXQudmFsdWU7XG5cdGxldCBtYW5pZmVzdEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4gPSB7fTtcblx0bGV0IGRhdGFGaWVsZENvbGxlY3Rpb246IERhdGFGaWVsZEFic3RyYWN0VHlwZXNbXSA9IFtdO1xuXHRsZXQgW25hdmlnYXRpb25Qcm9wZXJ0eVBhdGhdOiBhbnkgPSB0YXJnZXRWYWx1ZS5zcGxpdChcIkBcIik7XG5cdGlmIChuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCA+IDApIHtcblx0XHRpZiAobmF2aWdhdGlvblByb3BlcnR5UGF0aC5sYXN0SW5kZXhPZihcIi9cIikgPT09IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoIC0gMSkge1xuXHRcdFx0bmF2aWdhdGlvblByb3BlcnR5UGF0aCA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGguc3Vic3RyKDAsIG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoIC0gMSk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRpZiAocmVmZXJlbmNlVGFyZ2V0KSB7XG5cdFx0c3dpdGNoIChyZWZlcmVuY2VUYXJnZXQudGVybSkge1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5GaWVsZEdyb3VwOlxuXHRcdFx0XHRkYXRhRmllbGRDb2xsZWN0aW9uID0gKHJlZmVyZW5jZVRhcmdldCBhcyBGaWVsZEdyb3VwKS5EYXRhO1xuXHRcdFx0XHRtYW5pZmVzdEFjdGlvbnMgPSBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KFxuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbihyZWZlcmVuY2VUYXJnZXQpLmFjdGlvbnMsXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuSWRlbnRpZmljYXRpb246XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLlN0YXR1c0luZm86XG5cdFx0XHRcdGlmIChyZWZlcmVuY2VUYXJnZXQucXVhbGlmaWVyKSB7XG5cdFx0XHRcdFx0ZGF0YUZpZWxkQ29sbGVjdGlvbiA9IHJlZmVyZW5jZVRhcmdldCBhcyBJZGVudGlmaWNhdGlvbiB8IFN0YXR1c0luZm87XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGRhdGFGaWVsZENvbGxlY3Rpb24ucmVkdWNlKChhY3Rpb25zLCBkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpID0+IHtcblx0XHRjb25zdCBVSUFubm90YXRpb246IGFueSA9IGRhdGFGaWVsZD8uYW5ub3RhdGlvbnM/LlVJO1xuXHRcdHN3aXRjaCAoZGF0YUZpZWxkLiRUeXBlKSB7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbjpcblx0XHRcdFx0aWYgKGRhdGFGaWVsZC5SZXF1aXJlc0NvbnRleHQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdFx0XHQuZ2V0RGlhZ25vc3RpY3MoKVxuXHRcdFx0XHRcdFx0LmFkZElzc3VlKElzc3VlQ2F0ZWdvcnkuQW5ub3RhdGlvbiwgSXNzdWVTZXZlcml0eS5Mb3csIElzc3VlVHlwZS5NQUxGT1JNRURfREFUQUZJRUxEX0ZPUl9JQk4uUkVRVUlSRVNDT05URVhUKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZGF0YUZpZWxkLklubGluZSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0XHRcdC5nZXREaWFnbm9zdGljcygpXG5cdFx0XHRcdFx0XHQuYWRkSXNzdWUoSXNzdWVDYXRlZ29yeS5Bbm5vdGF0aW9uLCBJc3N1ZVNldmVyaXR5LkxvdywgSXNzdWVUeXBlLk1BTEZPUk1FRF9EQVRBRklFTERfRk9SX0lCTi5JTkxJTkUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IG1OYXZpZ2F0aW9uUGFyYW1ldGVyczogYW55ID0ge307XG5cdFx0XHRcdGlmIChkYXRhRmllbGQuTWFwcGluZykge1xuXHRcdFx0XHRcdG1OYXZpZ2F0aW9uUGFyYW1ldGVycy5zZW1hbnRpY09iamVjdE1hcHBpbmcgPSBnZXRTZW1hbnRpY09iamVjdE1hcHBpbmcoZGF0YUZpZWxkLk1hcHBpbmcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFjdGlvbnMucHVzaCh7XG5cdFx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24sXG5cdFx0XHRcdFx0aWQ6IEZvcm1JRCh7IEZhY2V0OiBmYWNldERlZmluaXRpb24gfSwgZGF0YUZpZWxkKSxcblx0XHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKSxcblx0XHRcdFx0XHR0ZXh0OiBkYXRhRmllbGQuTGFiZWwgYXMgc3RyaW5nLFxuXHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBcIlwiLFxuXHRcdFx0XHRcdHZpc2libGU6IGNvbXBpbGVCaW5kaW5nKG5vdChlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbihkYXRhRmllbGQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4pLCB0cnVlKSkpLFxuXHRcdFx0XHRcdGJ1dHRvblR5cGU6IGdldEJ1dHRvblR5cGUoVUlBbm5vdGF0aW9uPy5FbXBoYXNpemVkKSxcblx0XHRcdFx0XHRwcmVzczogY29tcGlsZUJpbmRpbmcoXG5cdFx0XHRcdFx0XHRmbihcIi5faW50ZW50QmFzZWROYXZpZ2F0aW9uLm5hdmlnYXRlXCIsIFtcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLlNlbWFudGljT2JqZWN0KSxcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLkFjdGlvbiksXG5cdFx0XHRcdFx0XHRcdG1OYXZpZ2F0aW9uUGFyYW1ldGVyc1xuXHRcdFx0XHRcdFx0XSlcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdGN1c3RvbURhdGE6IGNvbXBpbGVCaW5kaW5nKHtcblx0XHRcdFx0XHRcdHNlbWFudGljT2JqZWN0OiBhbm5vdGF0aW9uRXhwcmVzc2lvbihkYXRhRmllbGQuU2VtYW50aWNPYmplY3QpLFxuXHRcdFx0XHRcdFx0YWN0aW9uOiBhbm5vdGF0aW9uRXhwcmVzc2lvbihkYXRhRmllbGQuQWN0aW9uKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uOlxuXHRcdFx0XHRjb25zdCBmb3JtTWFuaWZlc3RBY3Rpb25zQ29uZmlndXJhdGlvbjogYW55ID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKHJlZmVyZW5jZVRhcmdldCkuYWN0aW9ucztcblx0XHRcdFx0Y29uc3Qga2V5OiBzdHJpbmcgPSBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCk7XG5cdFx0XHRcdGFjdGlvbnMucHVzaCh7XG5cdFx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JBY3Rpb24sXG5cdFx0XHRcdFx0aWQ6IEZvcm1JRCh7IEZhY2V0OiBmYWNldERlZmluaXRpb24gfSwgZGF0YUZpZWxkKSxcblx0XHRcdFx0XHRrZXk6IGtleSxcblx0XHRcdFx0XHR0ZXh0OiBkYXRhRmllbGQuTGFiZWwgYXMgc3RyaW5nLFxuXHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBcIlwiLFxuXHRcdFx0XHRcdGVuYWJsZWQ6IGdldEVuYWJsZWRCaW5kaW5nKGRhdGFGaWVsZC5BY3Rpb25UYXJnZXQpLFxuXHRcdFx0XHRcdGJpbmRpbmc6IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggPyBcInsgJ3BhdGgnIDogJ1wiICsgbmF2aWdhdGlvblByb3BlcnR5UGF0aCArIFwiJ31cIiA6IHVuZGVmaW5lZCxcblx0XHRcdFx0XHR2aXNpYmxlOiBjb21waWxlQmluZGluZyhub3QoZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuKSwgdHJ1ZSkpKSxcblx0XHRcdFx0XHRyZXF1aXJlc0RpYWxvZzogaXNEaWFsb2coZGF0YUZpZWxkLkFjdGlvblRhcmdldCksXG5cdFx0XHRcdFx0YnV0dG9uVHlwZTogZ2V0QnV0dG9uVHlwZShVSUFubm90YXRpb24/LkVtcGhhc2l6ZWQpLFxuXHRcdFx0XHRcdHByZXNzOiBjb21waWxlQmluZGluZyhcblx0XHRcdFx0XHRcdGZuKFxuXHRcdFx0XHRcdFx0XHRcImludm9rZUFjdGlvblwiLFxuXHRcdFx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUZpZWxkLkFjdGlvbixcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb250ZXh0czogZm4oXCJnZXRCaW5kaW5nQ29udGV4dFwiLCBbXSwgYmluZGluZ0V4cHJlc3Npb24oXCJcIiwgXCIkc291cmNlXCIpKSxcblx0XHRcdFx0XHRcdFx0XHRcdGludm9jYXRpb25Hcm91cGluZzogKGRhdGFGaWVsZC5JbnZvY2F0aW9uR3JvdXBpbmcgPT09IFwiVUkuT3BlcmF0aW9uR3JvdXBpbmdUeXBlL0NoYW5nZVNldFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdD8gXCJDaGFuZ2VTZXRcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ6IFwiSXNvbGF0ZWRcIikgYXMgT3BlcmF0aW9uR3JvdXBpbmdUeXBlLFxuXHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6IGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5MYWJlbCksXG5cdFx0XHRcdFx0XHRcdFx0XHRtb2RlbDogZm4oXCJnZXRNb2RlbFwiLCBbXSwgYmluZGluZ0V4cHJlc3Npb24oXCIvXCIsIFwiJHNvdXJjZVwiKSksXG5cdFx0XHRcdFx0XHRcdFx0XHRpc05hdmlnYWJsZTogaXNBY3Rpb25OYXZpZ2FibGUoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvcm1NYW5pZmVzdEFjdGlvbnNDb25maWd1cmF0aW9uICYmIGZvcm1NYW5pZmVzdEFjdGlvbnNDb25maWd1cmF0aW9uW2tleV1cblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0XHRcdHJlZihcIi5lZGl0Rmxvd1wiKVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdClcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0XHRhY3Rpb25zID0gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoYWN0aW9ucywgbWFuaWZlc3RBY3Rpb25zKTtcblx0XHRyZXR1cm4gYWN0aW9ucztcblx0fSwgYWN0aW9ucyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RpYWxvZyhhY3Rpb25EZWZpbml0aW9uOiBhbnkgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuXHRpZiAoYWN0aW9uRGVmaW5pdGlvbikge1xuXHRcdGNvbnN0IGJDcml0aWNhbCA9IGFjdGlvbkRlZmluaXRpb24uYW5ub3RhdGlvbnM/LkNvbW1vbj8uSXNBY3Rpb25Dcml0aWNhbDtcblx0XHRpZiAoYWN0aW9uRGVmaW5pdGlvbi5wYXJhbWV0ZXJzLmxlbmd0aCA+IDEgfHwgYkNyaXRpY2FsKSB7XG5cdFx0XHRyZXR1cm4gXCJEaWFsb2dcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIFwiTm9uZVwiO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gXCJOb25lXCI7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUN1c3RvbVN1YlNlY3Rpb25zKFxuXHRtYW5pZmVzdFN1YlNlY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBNYW5pZmVzdFN1YlNlY3Rpb24+LFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21PYmplY3RQYWdlU3ViU2VjdGlvbj4ge1xuXHRjb25zdCBzdWJTZWN0aW9uczogUmVjb3JkPHN0cmluZywgQ3VzdG9tT2JqZWN0UGFnZVN1YlNlY3Rpb24+ID0ge307XG5cdE9iamVjdC5rZXlzKG1hbmlmZXN0U3ViU2VjdGlvbnMpLmZvckVhY2goXG5cdFx0c3ViU2VjdGlvbktleSA9PlxuXHRcdFx0KHN1YlNlY3Rpb25zW3N1YlNlY3Rpb25LZXldID0gY3JlYXRlQ3VzdG9tU3ViU2VjdGlvbihtYW5pZmVzdFN1YlNlY3Rpb25zW3N1YlNlY3Rpb25LZXldLCBzdWJTZWN0aW9uS2V5LCBjb252ZXJ0ZXJDb250ZXh0KSlcblx0KTtcblx0cmV0dXJuIHN1YlNlY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ3VzdG9tU3ViU2VjdGlvbihcblx0bWFuaWZlc3RTdWJTZWN0aW9uOiBNYW5pZmVzdFN1YlNlY3Rpb24sXG5cdHN1YlNlY3Rpb25LZXk6IHN0cmluZyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogQ3VzdG9tT2JqZWN0UGFnZVN1YlNlY3Rpb24ge1xuXHRsZXQgcG9zaXRpb24gPSBtYW5pZmVzdFN1YlNlY3Rpb24ucG9zaXRpb247XG5cdGlmICghcG9zaXRpb24pIHtcblx0XHRwb3NpdGlvbiA9IHtcblx0XHRcdHBsYWNlbWVudDogUGxhY2VtZW50LkFmdGVyXG5cdFx0fTtcblx0fVxuXHRjb25zdCBzdWJTZWN0aW9uRGVmaW5pdGlvbiA9IHtcblx0XHR0eXBlOiBTdWJTZWN0aW9uVHlwZS5Vbmtub3duLFxuXHRcdGlkOiBtYW5pZmVzdFN1YlNlY3Rpb24uaWQgfHwgQ3VzdG9tU3ViU2VjdGlvbklEKHN1YlNlY3Rpb25LZXkpLFxuXHRcdGFjdGlvbnM6IGdldEFjdGlvbnNGcm9tTWFuaWZlc3QobWFuaWZlc3RTdWJTZWN0aW9uLmFjdGlvbnMsIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdGtleTogc3ViU2VjdGlvbktleSxcblx0XHR0aXRsZTogbWFuaWZlc3RTdWJTZWN0aW9uLnRpdGxlLFxuXHRcdGxldmVsOiAxLFxuXHRcdHBvc2l0aW9uOiBwb3NpdGlvbixcblx0XHR2aXNpYmxlOiBtYW5pZmVzdFN1YlNlY3Rpb24udmlzaWJsZVxuXHR9O1xuXHRpZiAobWFuaWZlc3RTdWJTZWN0aW9uLnRlbXBsYXRlIHx8IG1hbmlmZXN0U3ViU2VjdGlvbi5uYW1lKSB7XG5cdFx0c3ViU2VjdGlvbkRlZmluaXRpb24udHlwZSA9IFN1YlNlY3Rpb25UeXBlLlhNTEZyYWdtZW50O1xuXHRcdCgoc3ViU2VjdGlvbkRlZmluaXRpb24gYXMgdW5rbm93bikgYXMgWE1MRnJhZ21lbnRTdWJTZWN0aW9uKS50ZW1wbGF0ZSA9XG5cdFx0XHRtYW5pZmVzdFN1YlNlY3Rpb24udGVtcGxhdGUgfHwgbWFuaWZlc3RTdWJTZWN0aW9uLm5hbWUgfHwgXCJcIjtcblx0fSBlbHNlIHtcblx0XHRzdWJTZWN0aW9uRGVmaW5pdGlvbi50eXBlID0gU3ViU2VjdGlvblR5cGUuUGxhY2Vob2xkZXI7XG5cdH1cblx0cmV0dXJuIHN1YlNlY3Rpb25EZWZpbml0aW9uIGFzIEN1c3RvbU9iamVjdFBhZ2VTdWJTZWN0aW9uO1xufVxuXG4vKipcbiAqIEV2YWx1YXRlIGlmIHRoZSBjb25kZW5zZWQgbW9kZSBjYW4gYmUgYXBwbGkzZWQgb24gdGhlIHRhYmxlLlxuICpcbiAqIEBwYXJhbSBjdXJyZW50RmFjZXRcbiAqIEBwYXJhbSBmYWNldHNUb0NyZWF0ZUluU2VjdGlvblxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gIHRydWUgZm9yIGNvbXBsaWFudCwgZmFsc2Ugb3RoZXJ3aXNlXG4gKi9cbmZ1bmN0aW9uIGdldENvbmRlbnNlZFRhYmxlTGF5b3V0Q29tcGxpYW5jZShcblx0Y3VycmVudEZhY2V0OiBGYWNldFR5cGVzLFxuXHRmYWNldHNUb0NyZWF0ZUluU2VjdGlvbjogRmFjZXRUeXBlc1tdLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBib29sZWFuIHtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKTtcblx0aWYgKG1hbmlmZXN0V3JhcHBlci51c2VJY29uVGFiQmFyKCkpIHtcblx0XHQvLyBJZiB0aGUgT1AgdXNlIHRoZSB0YWIgYmFzZWQgd2UgY2hlY2sgaWYgdGhlIGZhY2V0cyB0aGF0IHdpbGwgYmUgY3JlYXRlZCBmb3IgdGhpcyBzZWN0aW9uIGFyZSBhbGwgbm9uIHZpc2libGVcblx0XHRyZXR1cm4gaGFzTm9PdGhlclZpc2libGVUYWJsZUluVGFyZ2V0cyhjdXJyZW50RmFjZXQsIGZhY2V0c1RvQ3JlYXRlSW5TZWN0aW9uKTtcblx0fSBlbHNlIHtcblx0XHRjb25zdCBlbnRpdHlUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCk7XG5cdFx0aWYgKGVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5GYWNldHM/Lmxlbmd0aCAmJiBlbnRpdHlUeXBlLmFubm90YXRpb25zPy5VST8uRmFjZXRzPy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZXR1cm4gaGFzTm9PdGhlclZpc2libGVUYWJsZUluVGFyZ2V0cyhjdXJyZW50RmFjZXQsIGZhY2V0c1RvQ3JlYXRlSW5TZWN0aW9uKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGhhc05vT3RoZXJWaXNpYmxlVGFibGVJblRhcmdldHMoY3VycmVudEZhY2V0OiBGYWNldFR5cGVzLCBmYWNldHNUb0NyZWF0ZUluU2VjdGlvbjogRmFjZXRUeXBlc1tdKTogYm9vbGVhbiB7XG5cdHJldHVybiBmYWNldHNUb0NyZWF0ZUluU2VjdGlvbi5ldmVyeShmdW5jdGlvbihzdWJGYWNldCkge1xuXHRcdGlmIChzdWJGYWNldCAhPT0gY3VycmVudEZhY2V0KSB7XG5cdFx0XHRpZiAoc3ViRmFjZXQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0KSB7XG5cdFx0XHRcdGNvbnN0IHJlZkZhY2V0ID0gc3ViRmFjZXQgYXMgUmVmZXJlbmNlRmFjZXRUeXBlcztcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHJlZkZhY2V0LlRhcmdldD8uJHRhcmdldD8udGVybSA9PT0gVUlBbm5vdGF0aW9uVGVybXMuTGluZUl0ZW0gfHxcblx0XHRcdFx0XHRyZWZGYWNldC5UYXJnZXQ/LiR0YXJnZXQ/LnRlcm0gPT09IFVJQW5ub3RhdGlvblRlcm1zLlByZXNlbnRhdGlvblZhcmlhbnQgfHxcblx0XHRcdFx0XHRyZWZGYWNldC5UYXJnZXQuJHRhcmdldD8udGVybSA9PT0gVUlBbm5vdGF0aW9uVGVybXMuU2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudFxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVmRmFjZXQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4gIT09IHVuZGVmaW5lZCA/IHJlZkZhY2V0LmFubm90YXRpb25zPy5VST8uSGlkZGVuIDogZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBzdWJDb2xsZWN0aW9uRmFjZXQgPSBzdWJGYWNldCBhcyBDb2xsZWN0aW9uRmFjZXRUeXBlcztcblx0XHRcdFx0cmV0dXJuIHN1YkNvbGxlY3Rpb25GYWNldC5GYWNldHMuZXZlcnkoZnVuY3Rpb24oZmFjZXQpIHtcblx0XHRcdFx0XHRjb25zdCBzdWJSZWZGYWNldCA9IGZhY2V0IGFzIFJlZmVyZW5jZUZhY2V0VHlwZXM7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0c3ViUmVmRmFjZXQuVGFyZ2V0Py4kdGFyZ2V0Py50ZXJtID09PSBVSUFubm90YXRpb25UZXJtcy5MaW5lSXRlbSB8fFxuXHRcdFx0XHRcdFx0c3ViUmVmRmFjZXQuVGFyZ2V0Py4kdGFyZ2V0Py50ZXJtID09PSBVSUFubm90YXRpb25UZXJtcy5QcmVzZW50YXRpb25WYXJpYW50IHx8XG5cdFx0XHRcdFx0XHRzdWJSZWZGYWNldC5UYXJnZXQ/LiR0YXJnZXQ/LnRlcm0gPT09IFVJQW5ub3RhdGlvblRlcm1zLlNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnRcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBzdWJSZWZGYWNldC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiAhPT0gdW5kZWZpbmVkID8gc3ViUmVmRmFjZXQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4gOiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSk7XG59XG4iXX0=