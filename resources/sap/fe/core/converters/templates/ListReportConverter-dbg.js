sap.ui.define(["../ManifestSettings", "./BaseConverter", "../controls/Common/DataVisualization", "../helpers/ID", "sap/fe/core/converters/controls/Common/Table", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/Key", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/controls/Common/Filter", "sap/fe/core/converters/helpers/IssueManager"], function (ManifestSettings, BaseConverter, DataVisualization, ID, Table, Action, ConfigurableObject, Key, BindingExpression, Filter, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueCategory = IssueManager.IssueCategory;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueType = IssueManager.IssueType;
  var getFilterConditions = Filter.getFilterConditions;
  var compileBinding = BindingExpression.compileBinding;
  var annotationExpression = BindingExpression.annotationExpression;
  var KeyHelper = Key.KeyHelper;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var getSelectionVariantConfiguration = Table.getSelectionVariantConfiguration;
  var TableID = ID.TableID;
  var FilterVariantManagementID = ID.FilterVariantManagementID;
  var FilterBarID = ID.FilterBarID;
  var isSelectionPresentationCompliant = DataVisualization.isSelectionPresentationCompliant;
  var getSelectionVariant = DataVisualization.getSelectionVariant;
  var isPresentationCompliant = DataVisualization.isPresentationCompliant;
  var getSelectionPresentationVariant = DataVisualization.getSelectionPresentationVariant;
  var getDefaultPresentationVariant = DataVisualization.getDefaultPresentationVariant;
  var getDefaultLineItem = DataVisualization.getDefaultLineItem;
  var getDefaultChart = DataVisualization.getDefaultChart;
  var getDataVisualizationConfiguration = DataVisualization.getDataVisualizationConfiguration;
  var TemplateType = BaseConverter.TemplateType;
  var VisualizationType = ManifestSettings.VisualizationType;
  var AvailabilityType = ManifestSettings.AvailabilityType;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  /**
   * Returns the condition path required for the condition model. It looks like follow:
   * <1:N-PropertyName>*\/<1:1-PropertyName>/<PropertyName>.
   *
   * @param entityType the root entity type
   * @param propertyPath the full path to the target property
   * @returns {string} the formatted condition path
   */
  var _getConditionPath = function (entityType, propertyPath) {
    var parts = propertyPath.split("/");
    var partialPath;
    var key = "";

    while (parts.length) {
      var part = parts.shift();
      partialPath = partialPath ? partialPath + "/" + part : part;
      var property = entityType.resolvePath(partialPath);

      if (property._type === "NavigationProperty" && property.isCollection) {
        part += "*";
      }

      key = key ? key + "/" + part : part;
    }

    return key;
  };

  var _createFilterSelectionField = function (entitySet, property, fullPropertyPath, includeHidden, converterContext) {
    var _property$annotations, _property$annotations2;

    // ignore complex property types and hidden annotated ones
    if (property !== undefined && property.targetType === undefined && (includeHidden || ((_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.UI) === null || _property$annotations2 === void 0 ? void 0 : _property$annotations2.Hidden) !== true)) {
      var _property$annotations3, _property$annotations4, _property$annotations5, _entityType$annotatio, _entityType$annotatio2;

      var entityType = converterContext.getAnnotationEntityType(property);
      return {
        key: KeyHelper.getSelectionFieldKeyFromPath(fullPropertyPath),
        annotationPath: "/" + entitySet.name + "/" + fullPropertyPath,
        conditionPath: _getConditionPath(entitySet.entityType, fullPropertyPath),
        availability: ((_property$annotations3 = property.annotations) === null || _property$annotations3 === void 0 ? void 0 : (_property$annotations4 = _property$annotations3.UI) === null || _property$annotations4 === void 0 ? void 0 : _property$annotations4.HiddenFilter) === true ? AvailabilityType.Hidden : AvailabilityType.Adaptation,
        label: compileBinding(annotationExpression(((_property$annotations5 = property.annotations.Common) === null || _property$annotations5 === void 0 ? void 0 : _property$annotations5.Label) || property.name)),
        group: entityType.name,
        groupLabel: compileBinding(annotationExpression((entityType === null || entityType === void 0 ? void 0 : (_entityType$annotatio = entityType.annotations) === null || _entityType$annotatio === void 0 ? void 0 : (_entityType$annotatio2 = _entityType$annotatio.Common) === null || _entityType$annotatio2 === void 0 ? void 0 : _entityType$annotatio2.Label) || entityType.name))
      };
    }

    return undefined;
  };

  var _getSelectionFields = function (entitySet, navigationPath, properties, includeHidden, converterContext) {
    var selectionFieldMap = {};

    if (properties) {
      properties.forEach(function (property) {
        var propertyPath = property.name;
        var fullPath = (navigationPath ? navigationPath + "/" : "") + propertyPath;

        var selectionField = _createFilterSelectionField(entitySet, property, fullPath, includeHidden, converterContext);

        if (selectionField) {
          selectionFieldMap[fullPath] = selectionField;
        }
      });
    }

    return selectionFieldMap;
  };

  var _getSelectionFieldsByPath = function (entitySet, propertyPaths, includeHidden, converterContext) {
    var selectionFields = {};

    if (propertyPaths) {
      propertyPaths.forEach(function (propertyPath) {
        var localSelectionFields;
        var property = entitySet.entityType.resolvePath(propertyPath);

        if (property === undefined) {
          return;
        }

        if (property._type === "NavigationProperty") {
          // handle navigation properties
          localSelectionFields = _getSelectionFields(entitySet, propertyPath, property.targetType.entityProperties, includeHidden, converterContext);
        } else if (property.targetType !== undefined) {
          // handle ComplexType properties
          localSelectionFields = _getSelectionFields(entitySet, propertyPath, property.targetType.properties, includeHidden, converterContext);
        } else {
          var navigationPath = propertyPath.includes("/") ? propertyPath.split("/").splice(0, 1).join("/") : "";
          localSelectionFields = _getSelectionFields(entitySet, navigationPath, [property], includeHidden, converterContext);
        }

        selectionFields = _objectSpread({}, selectionFields, {}, localSelectionFields);
      });
    }

    return selectionFields;
  };
  /**
   * Enter all DataFields of a given FieldGroup into the filterFacetMap.
   *
   * @param {AnnotationTerm<FieldGroupType>} fieldGroup
   * @returns {Record<string, FilterGroup>} filterFacetMap for the given fieldGroup
   */


  function getFieldGroupFilterGroups(fieldGroup) {
    var filterFacetMap = {};
    fieldGroup.Data.forEach(function (dataField) {
      if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataField") {
        var _fieldGroup$annotatio, _fieldGroup$annotatio2;

        filterFacetMap[dataField.Value.path] = {
          group: fieldGroup.fullyQualifiedName,
          groupLabel: compileBinding(annotationExpression(fieldGroup.Label || ((_fieldGroup$annotatio = fieldGroup.annotations) === null || _fieldGroup$annotatio === void 0 ? void 0 : (_fieldGroup$annotatio2 = _fieldGroup$annotatio.Common) === null || _fieldGroup$annotatio2 === void 0 ? void 0 : _fieldGroup$annotatio2.Label) || fieldGroup.qualifier)) || fieldGroup.qualifier
        };
      }
    });
    return filterFacetMap;
  }
  /**
   * Retrieve the configuration for the selection fields that will be used within the filter bar
   * This configuration takes into account annotation and the selection variants.
   *
   * @param {EntitySet} entitySet
   * @param {SelectionVariantConfiguration[]} selectionVariants
   * @param {ConverterContext} converterContext
   * @returns {FilterSelectionField[]} an array of selection fields
   */


  var getSelectionFields = function (entitySet, selectionVariants, converterContext) {
    var _converterContext$get, _entitySet$entityType, _entitySet$entityType2, _entitySet$entityType3;

    // create a map of properties to be used in selection variants
    var excludedFilterProperties = selectionVariants.reduce(function (previousValue, selectionVariant) {
      selectionVariant.propertyNames.forEach(function (propertyName) {
        previousValue[propertyName] = true;
      });
      return previousValue;
    }, {});
    var filterFacets = (_converterContext$get = converterContext.getAnnotationEntityType().annotations.UI) === null || _converterContext$get === void 0 ? void 0 : _converterContext$get.FilterFacets;
    var filterFacetMap = {};
    var aFieldGroups = converterContext.getAnnotationByType("UI", "com.sap.vocabularies.UI.v1.FieldGroup") || [];

    if (filterFacets === undefined || filterFacets.length < 0) {
      for (var i in aFieldGroups) {
        filterFacetMap = _objectSpread({}, filterFacetMap, {}, getFieldGroupFilterGroups(aFieldGroups[i]));
      }
    } else {
      filterFacetMap = filterFacets.reduce(function (previousValue, filterFacet) {
        for (var _i = 0; _i < filterFacet.Target.$target.Data.length; _i++) {
          previousValue[filterFacet.Target.$target.Data[_i].Value.path] = {
            group: filterFacet.ID,
            groupLabel: filterFacet.Label
          };
        }

        return previousValue;
      }, {});
    }

    var aSelectOptions = [];
    var selectionVariant = getSelectionVariant(entitySet.entityType, converterContext);

    if (selectionVariant) {
      aSelectOptions = selectionVariant.SelectOptions;
    } // create a map of all potential filter fields based on...


    var filterFields = _objectSpread({}, _getSelectionFields(entitySet, "", entitySet.entityType.entityProperties, false, converterContext), {}, _getSelectionFieldsByPath(entitySet, converterContext.getManifestWrapper().getFilterConfiguration().navigationProperties, false, converterContext)); //Filters which has to be added which is part of SV/Default annotations but not present in the SelectionFields


    var defaultFilters = _getDeafultFilterFields(filterFields, aSelectOptions, entitySet, converterContext, excludedFilterProperties); // finally create final list of filter fields by adding the SelectionFields first (order matters)...


    return (((_entitySet$entityType = entitySet.entityType.annotations) === null || _entitySet$entityType === void 0 ? void 0 : (_entitySet$entityType2 = _entitySet$entityType.UI) === null || _entitySet$entityType2 === void 0 ? void 0 : (_entitySet$entityType3 = _entitySet$entityType2.SelectionFields) === null || _entitySet$entityType3 === void 0 ? void 0 : _entitySet$entityType3.reduce(function (selectionFields, selectionField) {
      var propertyPath = selectionField.value;

      if (!(propertyPath in excludedFilterProperties)) {
        var filterField = _getFilterField(filterFields, propertyPath, converterContext, entitySet);

        if (filterField) {
          filterField.group = "";
          filterField.groupLabel = "";
          selectionFields.push(filterField);
        }
      }

      return selectionFields;
    }, [])) || []). // To add the FilterField which is not part of the Selection Fields but the property is mentioned in the Selection Variant
    concat(defaultFilters || []) // ...and adding remaining filter fields, that are not used in a SelectionVariant (order doesn't matter)
    .concat(Object.keys(filterFields).filter(function (propertyPath) {
      return !(propertyPath in excludedFilterProperties);
    }).map(function (propertyPath) {
      return Object.assign(filterFields[propertyPath], filterFacetMap[propertyPath]);
    }));
  };

  _exports.getSelectionFields = getSelectionFields;

  var _getDeafultFilterFields = function (filterFields, aSelectOptions, entitySet, converterContext, excludedFilterProperties) {
    var _entitySet$entityType4, _entitySet$entityType5, _entitySet$entityType6;

    var selectionFields = [];
    var UISelectionFields = {};
    var properties = entitySet.entityType.entityProperties;
    (_entitySet$entityType4 = entitySet.entityType.annotations) === null || _entitySet$entityType4 === void 0 ? void 0 : (_entitySet$entityType5 = _entitySet$entityType4.UI) === null || _entitySet$entityType5 === void 0 ? void 0 : (_entitySet$entityType6 = _entitySet$entityType5.SelectionFields) === null || _entitySet$entityType6 === void 0 ? void 0 : _entitySet$entityType6.forEach(function (SelectionField) {
      UISelectionFields[SelectionField.value] = true;
    });

    if (aSelectOptions && aSelectOptions.length > 0) {
      aSelectOptions === null || aSelectOptions === void 0 ? void 0 : aSelectOptions.forEach(function (selectOption) {
        var _entitySet$entityType7, _entitySet$entityType8, _entitySet$entityType9;

        var propertyName = selectOption.PropertyName;
        var sPropertyPath = propertyName.value;
        var UISelectionFields = {};
        (_entitySet$entityType7 = entitySet.entityType.annotations) === null || _entitySet$entityType7 === void 0 ? void 0 : (_entitySet$entityType8 = _entitySet$entityType7.UI) === null || _entitySet$entityType8 === void 0 ? void 0 : (_entitySet$entityType9 = _entitySet$entityType8.SelectionFields) === null || _entitySet$entityType9 === void 0 ? void 0 : _entitySet$entityType9.forEach(function (SelectionField) {
          UISelectionFields[SelectionField.value] = true;
        });

        if (!(sPropertyPath in excludedFilterProperties)) {
          if (!(sPropertyPath in UISelectionFields)) {
            var _FilterField = _getFilterField(filterFields, sPropertyPath, converterContext, entitySet);

            if (_FilterField) {
              selectionFields.push(_FilterField);
            }
          }
        }
      });
    } else if (properties) {
      properties.forEach(function (property) {
        var _property$annotations6, _property$annotations7;

        var defaultFilterValue = (_property$annotations6 = property.annotations) === null || _property$annotations6 === void 0 ? void 0 : (_property$annotations7 = _property$annotations6.Common) === null || _property$annotations7 === void 0 ? void 0 : _property$annotations7.FilterDefaultValue;
        var PropertyPath = property.name;

        if (!(PropertyPath in excludedFilterProperties)) {
          if (defaultFilterValue && !(PropertyPath in UISelectionFields)) {
            var _FilterField2 = _getFilterField(filterFields, PropertyPath, converterContext, entitySet);

            if (_FilterField2) {
              selectionFields.push(_FilterField2);
            }
          }
        }
      });
    }

    return selectionFields;
  };

  var _getFilterField = function (filterFields, propertyPath, converterContext, entitySet) {
    var filterField = filterFields[propertyPath];

    if (filterField) {
      delete filterFields[propertyPath];
    } else {
      filterField = _createFilterSelectionField(entitySet, entitySet.entityType.resolvePath(propertyPath), propertyPath, true, converterContext);
    }

    if (!filterField) {
      converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MISSING_SELECTIONFIELD);
    } // defined SelectionFields are available by default


    if (filterField) {
      filterField.availability = AvailabilityType.Default;
    }

    return filterField;
  };
  /**
   * Retrieves filterfields form the manifest.
   *
   * @param entitySet the current entitySet
   * @param converterContext the converter context
   * @returns {Record<string, CustomElementFilterField>} the manifest defined filter fields
   */


  var getManifestFilterFields = function (entitySet, converterContext) {
    var fbConfig = converterContext.getManifestWrapper().getFilterConfiguration();
    var definedFilterFields = (fbConfig === null || fbConfig === void 0 ? void 0 : fbConfig.filterFields) || {};

    var selectionFields = _getSelectionFieldsByPath(entitySet, Object.keys(definedFilterFields).map(function (key) {
      return definedFilterFields[key].property || KeyHelper.getPathFromSelectionFieldKey(key);
    }), true, converterContext);

    var filterFields = {};

    for (var sKey in definedFilterFields) {
      var filterField = definedFilterFields[sKey];
      var propertyName = filterField.property || KeyHelper.getPathFromSelectionFieldKey(sKey);
      var selectionField = selectionFields[propertyName];
      filterFields[sKey] = {
        key: sKey,
        annotationPath: selectionField.annotationPath,
        conditionPath: selectionField.conditionPath,
        template: filterField.template,
        label: filterField.label,
        position: filterField.position || {
          placement: Placement.After
        },
        availability: filterField.availability || AvailabilityType.Default,
        settings: filterField.settings
      };
    }

    return filterFields;
  };
  /**
   * Find a visualization annotation that can be used for rendering the list report.
   * @param {EntityType} entityType the current entityType
   * @param converterContext
   * @param bIsALP
   * @returns {LineItem | PresentationVariantTypeTypes | undefined} one compliant annotation for rendering the list report
   */


  function getCompliantVisualizationAnnotation(entityType, converterContext, bIsALP) {
    var annotationPath = converterContext.getManifestWrapper().getDefaultTemplateAnnotationPath();
    var selectionPresentationVariant = getSelectionPresentationVariant(entityType, annotationPath, converterContext);

    if (annotationPath && selectionPresentationVariant) {
      var _presentationVariant = selectionPresentationVariant.PresentationVariant;

      if (!_presentationVariant) {
        throw new Error("Presentation Variant is not configured in the SPV mentioned in the manifest");
      }

      var bPVComplaint = isPresentationCompliant(selectionPresentationVariant.PresentationVariant);

      if (!bPVComplaint) {
        return undefined;
      }

      if (isSelectionPresentationCompliant(selectionPresentationVariant, bIsALP)) {
        return selectionPresentationVariant;
      }
    }

    if (selectionPresentationVariant) {
      if (isSelectionPresentationCompliant(selectionPresentationVariant, bIsALP)) {
        return selectionPresentationVariant;
      }
    }

    var presentationVariant = getDefaultPresentationVariant(entityType);

    if (presentationVariant) {
      if (isPresentationCompliant(presentationVariant, bIsALP)) {
        return presentationVariant;
      }
    }

    if (!bIsALP) {
      var defaultLineItem = getDefaultLineItem(entityType);

      if (defaultLineItem) {
        return defaultLineItem;
      }
    }

    return undefined;
  }

  var getView = function (viewConverterConfiguration) {
    var config = viewConverterConfiguration;
    var converterContext = config.converterContext;
    var presentation = getDataVisualizationConfiguration(config.annotation ? converterContext.getRelativeAnnotationPath(config.annotation.fullyQualifiedName, converterContext.getEntityType()) : "", true, converterContext);
    var tableControlId = "";
    var chartControlId = "";
    var title = "";
    var selectionVariantPath = "";

    var isMultipleViewConfiguration = function (config) {
      return config.key !== undefined;
    };

    if (isMultipleViewConfiguration(config)) {
      // key exists only on multi tables mode
      var resolvedTarget = converterContext.getEntityTypeAnnotation(config.annotationPath);
      var viewAnnotation = resolvedTarget.annotation;
      converterContext = resolvedTarget.converterContext;
      title = compileBinding(annotationExpression(viewAnnotation.Text));
      /**
       * Need to loop on views and more precisely to table into views since
       * multi table mode get specific configuation (hidden filters or Table Id)
       */

      presentation.visualizations.forEach(function (visualizationDefinition, index) {
        switch (visualizationDefinition.type) {
          case VisualizationType.Table:
            var tableVisualization = presentation.visualizations[index];
            var filters = tableVisualization.control.filters || {};
            filters.hiddenFilters = filters.hiddenFilters || {
              paths: []
            };

            if (!config.keepPreviousPresonalization) {
              // Need to override Table Id to match with Tab Key (currently only table is managed in multiple view mode)
              tableVisualization.annotation.id = TableID(config.key, "LineItem");
            }

            if (config && config.annotation && config.annotation.term === "com.sap.vocabularies.UI.v1.SelectionPresentationVariant") {
              selectionVariantPath = config.annotation.SelectionVariant.fullyQualifiedName.split("@")[1];
            } else {
              selectionVariantPath = config.annotationPath;
            }
            /**
             * Provide Selection Variant to hiddenFilters in order to set the SV filters to the table
             * MDC Table override Obinding Fitler and from SAP FE the only method where we are able to add
             * additionnal filter is 'rebindTable' into Table delegate
             * In order to avoid implementing specific LR feature to SAP FE Macro Table, the filter(s) related
             * to the Tab (multi table mode) can be passed to macro table via parameter/context named fitlers
             * and key hiddenFilters
             */


            filters.hiddenFilters.paths.push({
              annotationPath: selectionVariantPath
            });
            tableVisualization.control.filters = filters;
            break;

          case VisualizationType.Chart:
            // Not currently managed
            break;

          default:
            break;
        }
      });
    }

    presentation.visualizations.forEach(function (visualizationDefinition) {
      if (visualizationDefinition.type === VisualizationType.Table) {
        tableControlId = visualizationDefinition.annotation.id;
      } else if (visualizationDefinition.type === VisualizationType.Chart) {
        chartControlId = visualizationDefinition.id;
      }
    });
    return {
      presentation: presentation,
      tableControlId: tableControlId,
      chartControlId: chartControlId,
      entitySet: "/" + viewConverterConfiguration.entitySet.name,
      title: title,
      selectionVariantPath: selectionVariantPath
    };
  };

  var getViews = function (entitySet, converterContext, settingsViews) {
    var viewConverterConfigs = [];

    if (settingsViews) {
      settingsViews.paths.forEach(function (path) {
        var viewEntitySet = converterContext.findEntitySet(path.entitySet);
        var annotationPath = converterContext.getManifestWrapper().getDefaultTemplateAnnotationPath();
        var annotation;

        if (viewEntitySet) {
          var viewConverterContext = converterContext.getConverterContextFor(viewEntitySet);
          var resolvedTarget = viewConverterContext.getEntityTypeAnnotation(path.annotationPath);
          var targetAnnotation = resolvedTarget.annotation;
          converterContext = resolvedTarget.converterContext;

          if (targetAnnotation) {
            if (targetAnnotation.term === "com.sap.vocabularies.UI.v1.SelectionVariant") {
              if (annotationPath) {
                annotation = getSelectionPresentationVariant(viewEntitySet.entityType, annotationPath, converterContext);
              } else {
                annotation = getDefaultLineItem(viewEntitySet.entityType);
              }
            } else {
              annotation = targetAnnotation;
            }

            viewConverterConfigs.push({
              converterContext: viewConverterContext,
              entitySet: viewEntitySet,
              annotation: annotation,
              annotationPath: path.annotationPath,
              keepPreviousPresonalization: path.keepPreviousPresonalization,
              key: path.key
            });
          }
        } else {// TODO Diagnostics message
        }
      });
    } else {
      var entityType = converterContext.getEntityType();

      if (converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
        viewConverterConfigs = getAlpViewConfig(entitySet, converterContext, viewConverterConfigs);
      } else {
        viewConverterConfigs.push({
          annotation: getCompliantVisualizationAnnotation(entityType, converterContext, false),
          entitySet: entitySet,
          converterContext: converterContext
        });
      }
    }

    return viewConverterConfigs.map(function (viewConverterConfig) {
      return getView(viewConverterConfig);
    });
  };

  function getAlpViewConfig(entitySet, converterContext, viewConfigs) {
    var annotation = getCompliantVisualizationAnnotation(entitySet.entityType, converterContext, true);
    var chart, table;

    if (annotation) {
      viewConfigs.push({
        entitySet: entitySet,
        annotation: annotation,
        converterContext: converterContext
      });
    } else {
      chart = getDefaultChart(entitySet.entityType);
      table = getDefaultLineItem(entitySet.entityType);

      if (chart) {
        viewConfigs.push({
          entitySet: entitySet,
          annotation: chart,
          converterContext: converterContext
        });
      }

      if (table) {
        viewConfigs.push({
          entitySet: entitySet,
          annotation: table,
          converterContext: converterContext
        });
      }
    }

    return viewConfigs;
  }
  /**
   * Create the ListReportDefinition for the multi entitySets (multi table instances).
   *
   * @param converterContext
   * @returns {ListReportDefinition} the list report definition based on annotation + manifest
   */


  var convertPage = function (converterContext) {
    var templateType = converterContext.getTemplateType();
    var entitySet = converterContext.getEntitySet();

    if (!entitySet) {
      // If we don't have an entitySet at this point we have an issue I'd say
      throw new Error("An Entityset is required to be able to display a ListReport, please adjust your `entitySet` property to point to one.");
    }

    var manifestWrapper = converterContext.getManifestWrapper();
    var viewsDefinition = manifestWrapper.getViewConfiguration();
    var hasMultipleEntitySets = manifestWrapper.hasMultipleEntitySets();
    var views = getViews(entitySet, converterContext, viewsDefinition);
    var showTabCounts = viewsDefinition ? (viewsDefinition === null || viewsDefinition === void 0 ? void 0 : viewsDefinition.showCounts) || hasMultipleEntitySets : undefined; // with multi EntitySets, tab counts are displayed by default

    var singleTableId = "";
    var singleChartId = "";
    var bFitContent = false; // Fetch all selectionVariants defined in the different visualizations and different views (multi table mode)

    var selectionVariantConfigs = [];
    var selectionVariantPaths = [];
    var filterBarId = FilterBarID(entitySet.name);
    var filterVariantManagementID = FilterVariantManagementID(filterBarId);
    var targetControlIds = [filterBarId];
    var fbConfig = manifestWrapper.getFilterConfiguration();
    var useSemanticDateRange = fbConfig.useSemanticDateRange !== undefined ? fbConfig.useSemanticDateRange : true;
    views.forEach(function (view) {
      view.presentation.visualizations.forEach(function (visualizationDefinition) {
        if (visualizationDefinition.type === VisualizationType.Table) {
          var tableFilters = visualizationDefinition.control.filters;

          for (var key in tableFilters) {
            if (Array.isArray(tableFilters[key].paths)) {
              var paths = tableFilters[key].paths;
              paths.forEach(function (path) {
                if (path && path.annotationPath && selectionVariantPaths.indexOf(path.annotationPath) === -1) {
                  selectionVariantPaths.push(path.annotationPath);
                  var selectionVariantConfig = getSelectionVariantConfiguration(path.annotationPath, converterContext);

                  if (selectionVariantConfig) {
                    selectionVariantConfigs.push(selectionVariantConfig);
                  }
                }
              });
            }
          }

          targetControlIds.push(visualizationDefinition.annotation.id);

          if (visualizationDefinition.control.type === "GridTable") {
            bFitContent = true;
          }
        }
      });
    });
    var oConfig = getContentAreaId(templateType, views);

    if (oConfig) {
      singleChartId = oConfig.chartId;
      singleTableId = oConfig.tableId;
    }

    var annotationSelectionFields = getSelectionFields(entitySet, selectionVariantConfigs, converterContext);
    var selectionFields = insertCustomElements(annotationSelectionFields, getManifestFilterFields(entitySet, converterContext), {
      "availability": "overwrite",
      label: "overwrite",
      position: "overwrite",
      template: "overwrite",
      settings: "overwrite"
    });
    var filterConditions = JSON.stringify(getFilterConditions(entitySet.entityType, converterContext)); // Sort header actions according to position attributes in manifest

    var headerActions = insertCustomElements([], getActionsFromManifest(manifestWrapper.getHeaderActions(), converterContext));
    return {
      mainEntitySet: "/" + entitySet.name,
      singleTableId: singleTableId,
      singleChartId: singleChartId,
      showTabCounts: showTabCounts,
      headerActions: headerActions,
      selectionFields: selectionFields,
      views: views,
      filterBarId: filterBarId,
      filterConditions: filterConditions,
      variantManagement: {
        id: filterVariantManagementID,
        targetControlIds: targetControlIds.join(",")
      },
      fitContent: bFitContent,
      isMultiEntitySets: hasMultipleEntitySets,
      isAlp: converterContext.getTemplateType() === TemplateType.AnalyticalListPage,
      useSemanticDateRange: useSemanticDateRange
    };
  };

  _exports.convertPage = convertPage;

  function getContentAreaId(templateType, views) {
    var singleTableId = "",
        singleChartId = "";

    if (views.length === 1) {
      singleTableId = views[0].tableControlId;
      singleChartId = views[0].chartControlId;
    } else if (templateType === TemplateType.AnalyticalListPage && views.length === 2) {
      views.map(function (oView) {
        if (oView.chartControlId) {
          singleChartId = oView.chartControlId;
        } else if (oView.tableControlId) {
          singleTableId = oView.tableControlId;
        }
      });
    }

    if (singleTableId || singleChartId) {
      return {
        chartId: singleChartId,
        tableId: singleTableId
      };
    }

    return undefined;
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxpc3RSZXBvcnRDb252ZXJ0ZXIudHMiXSwibmFtZXMiOlsiX2dldENvbmRpdGlvblBhdGgiLCJlbnRpdHlUeXBlIiwicHJvcGVydHlQYXRoIiwicGFydHMiLCJzcGxpdCIsInBhcnRpYWxQYXRoIiwia2V5IiwibGVuZ3RoIiwicGFydCIsInNoaWZ0IiwicHJvcGVydHkiLCJyZXNvbHZlUGF0aCIsIl90eXBlIiwiaXNDb2xsZWN0aW9uIiwiX2NyZWF0ZUZpbHRlclNlbGVjdGlvbkZpZWxkIiwiZW50aXR5U2V0IiwiZnVsbFByb3BlcnR5UGF0aCIsImluY2x1ZGVIaWRkZW4iLCJjb252ZXJ0ZXJDb250ZXh0IiwidW5kZWZpbmVkIiwidGFyZ2V0VHlwZSIsImFubm90YXRpb25zIiwiVUkiLCJIaWRkZW4iLCJnZXRBbm5vdGF0aW9uRW50aXR5VHlwZSIsIktleUhlbHBlciIsImdldFNlbGVjdGlvbkZpZWxkS2V5RnJvbVBhdGgiLCJhbm5vdGF0aW9uUGF0aCIsIm5hbWUiLCJjb25kaXRpb25QYXRoIiwiYXZhaWxhYmlsaXR5IiwiSGlkZGVuRmlsdGVyIiwiQXZhaWxhYmlsaXR5VHlwZSIsIkFkYXB0YXRpb24iLCJsYWJlbCIsImNvbXBpbGVCaW5kaW5nIiwiYW5ub3RhdGlvbkV4cHJlc3Npb24iLCJDb21tb24iLCJMYWJlbCIsImdyb3VwIiwiZ3JvdXBMYWJlbCIsIl9nZXRTZWxlY3Rpb25GaWVsZHMiLCJuYXZpZ2F0aW9uUGF0aCIsInByb3BlcnRpZXMiLCJzZWxlY3Rpb25GaWVsZE1hcCIsImZvckVhY2giLCJmdWxsUGF0aCIsInNlbGVjdGlvbkZpZWxkIiwiX2dldFNlbGVjdGlvbkZpZWxkc0J5UGF0aCIsInByb3BlcnR5UGF0aHMiLCJzZWxlY3Rpb25GaWVsZHMiLCJsb2NhbFNlbGVjdGlvbkZpZWxkcyIsImVudGl0eVByb3BlcnRpZXMiLCJpbmNsdWRlcyIsInNwbGljZSIsImpvaW4iLCJnZXRGaWVsZEdyb3VwRmlsdGVyR3JvdXBzIiwiZmllbGRHcm91cCIsImZpbHRlckZhY2V0TWFwIiwiRGF0YSIsImRhdGFGaWVsZCIsIiRUeXBlIiwiVmFsdWUiLCJwYXRoIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwicXVhbGlmaWVyIiwiZ2V0U2VsZWN0aW9uRmllbGRzIiwic2VsZWN0aW9uVmFyaWFudHMiLCJleGNsdWRlZEZpbHRlclByb3BlcnRpZXMiLCJyZWR1Y2UiLCJwcmV2aW91c1ZhbHVlIiwic2VsZWN0aW9uVmFyaWFudCIsInByb3BlcnR5TmFtZXMiLCJwcm9wZXJ0eU5hbWUiLCJmaWx0ZXJGYWNldHMiLCJGaWx0ZXJGYWNldHMiLCJhRmllbGRHcm91cHMiLCJnZXRBbm5vdGF0aW9uQnlUeXBlIiwiaSIsImZpbHRlckZhY2V0IiwiVGFyZ2V0IiwiJHRhcmdldCIsIklEIiwiYVNlbGVjdE9wdGlvbnMiLCJnZXRTZWxlY3Rpb25WYXJpYW50IiwiU2VsZWN0T3B0aW9ucyIsImZpbHRlckZpZWxkcyIsImdldE1hbmlmZXN0V3JhcHBlciIsImdldEZpbHRlckNvbmZpZ3VyYXRpb24iLCJuYXZpZ2F0aW9uUHJvcGVydGllcyIsImRlZmF1bHRGaWx0ZXJzIiwiX2dldERlYWZ1bHRGaWx0ZXJGaWVsZHMiLCJTZWxlY3Rpb25GaWVsZHMiLCJ2YWx1ZSIsImZpbHRlckZpZWxkIiwiX2dldEZpbHRlckZpZWxkIiwicHVzaCIsImNvbmNhdCIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJtYXAiLCJhc3NpZ24iLCJVSVNlbGVjdGlvbkZpZWxkcyIsIlNlbGVjdGlvbkZpZWxkIiwic2VsZWN0T3B0aW9uIiwiUHJvcGVydHlOYW1lIiwic1Byb3BlcnR5UGF0aCIsIkZpbHRlckZpZWxkIiwiZGVmYXVsdEZpbHRlclZhbHVlIiwiRmlsdGVyRGVmYXVsdFZhbHVlIiwiUHJvcGVydHlQYXRoIiwiZ2V0RGlhZ25vc3RpY3MiLCJhZGRJc3N1ZSIsIklzc3VlQ2F0ZWdvcnkiLCJBbm5vdGF0aW9uIiwiSXNzdWVTZXZlcml0eSIsIkhpZ2giLCJJc3N1ZVR5cGUiLCJNSVNTSU5HX1NFTEVDVElPTkZJRUxEIiwiRGVmYXVsdCIsImdldE1hbmlmZXN0RmlsdGVyRmllbGRzIiwiZmJDb25maWciLCJkZWZpbmVkRmlsdGVyRmllbGRzIiwiZ2V0UGF0aEZyb21TZWxlY3Rpb25GaWVsZEtleSIsInNLZXkiLCJ0ZW1wbGF0ZSIsInBvc2l0aW9uIiwicGxhY2VtZW50IiwiUGxhY2VtZW50IiwiQWZ0ZXIiLCJzZXR0aW5ncyIsImdldENvbXBsaWFudFZpc3VhbGl6YXRpb25Bbm5vdGF0aW9uIiwiYklzQUxQIiwiZ2V0RGVmYXVsdFRlbXBsYXRlQW5ub3RhdGlvblBhdGgiLCJzZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50IiwiZ2V0U2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudCIsInByZXNlbnRhdGlvblZhcmlhbnQiLCJQcmVzZW50YXRpb25WYXJpYW50IiwiRXJyb3IiLCJiUFZDb21wbGFpbnQiLCJpc1ByZXNlbnRhdGlvbkNvbXBsaWFudCIsImlzU2VsZWN0aW9uUHJlc2VudGF0aW9uQ29tcGxpYW50IiwiZ2V0RGVmYXVsdFByZXNlbnRhdGlvblZhcmlhbnQiLCJkZWZhdWx0TGluZUl0ZW0iLCJnZXREZWZhdWx0TGluZUl0ZW0iLCJnZXRWaWV3Iiwidmlld0NvbnZlcnRlckNvbmZpZ3VyYXRpb24iLCJjb25maWciLCJwcmVzZW50YXRpb24iLCJnZXREYXRhVmlzdWFsaXphdGlvbkNvbmZpZ3VyYXRpb24iLCJhbm5vdGF0aW9uIiwiZ2V0UmVsYXRpdmVBbm5vdGF0aW9uUGF0aCIsImdldEVudGl0eVR5cGUiLCJ0YWJsZUNvbnRyb2xJZCIsImNoYXJ0Q29udHJvbElkIiwidGl0bGUiLCJzZWxlY3Rpb25WYXJpYW50UGF0aCIsImlzTXVsdGlwbGVWaWV3Q29uZmlndXJhdGlvbiIsInJlc29sdmVkVGFyZ2V0IiwiZ2V0RW50aXR5VHlwZUFubm90YXRpb24iLCJ2aWV3QW5ub3RhdGlvbiIsIlRleHQiLCJ2aXN1YWxpemF0aW9ucyIsInZpc3VhbGl6YXRpb25EZWZpbml0aW9uIiwiaW5kZXgiLCJ0eXBlIiwiVmlzdWFsaXphdGlvblR5cGUiLCJUYWJsZSIsInRhYmxlVmlzdWFsaXphdGlvbiIsImZpbHRlcnMiLCJjb250cm9sIiwiaGlkZGVuRmlsdGVycyIsInBhdGhzIiwia2VlcFByZXZpb3VzUHJlc29uYWxpemF0aW9uIiwiaWQiLCJUYWJsZUlEIiwidGVybSIsIlNlbGVjdGlvblZhcmlhbnQiLCJDaGFydCIsImdldFZpZXdzIiwic2V0dGluZ3NWaWV3cyIsInZpZXdDb252ZXJ0ZXJDb25maWdzIiwidmlld0VudGl0eVNldCIsImZpbmRFbnRpdHlTZXQiLCJ2aWV3Q29udmVydGVyQ29udGV4dCIsImdldENvbnZlcnRlckNvbnRleHRGb3IiLCJ0YXJnZXRBbm5vdGF0aW9uIiwiZ2V0VGVtcGxhdGVUeXBlIiwiVGVtcGxhdGVUeXBlIiwiQW5hbHl0aWNhbExpc3RQYWdlIiwiZ2V0QWxwVmlld0NvbmZpZyIsInZpZXdDb252ZXJ0ZXJDb25maWciLCJ2aWV3Q29uZmlncyIsImNoYXJ0IiwidGFibGUiLCJnZXREZWZhdWx0Q2hhcnQiLCJjb252ZXJ0UGFnZSIsInRlbXBsYXRlVHlwZSIsImdldEVudGl0eVNldCIsIm1hbmlmZXN0V3JhcHBlciIsInZpZXdzRGVmaW5pdGlvbiIsImdldFZpZXdDb25maWd1cmF0aW9uIiwiaGFzTXVsdGlwbGVFbnRpdHlTZXRzIiwidmlld3MiLCJzaG93VGFiQ291bnRzIiwic2hvd0NvdW50cyIsInNpbmdsZVRhYmxlSWQiLCJzaW5nbGVDaGFydElkIiwiYkZpdENvbnRlbnQiLCJzZWxlY3Rpb25WYXJpYW50Q29uZmlncyIsInNlbGVjdGlvblZhcmlhbnRQYXRocyIsImZpbHRlckJhcklkIiwiRmlsdGVyQmFySUQiLCJmaWx0ZXJWYXJpYW50TWFuYWdlbWVudElEIiwiRmlsdGVyVmFyaWFudE1hbmFnZW1lbnRJRCIsInRhcmdldENvbnRyb2xJZHMiLCJ1c2VTZW1hbnRpY0RhdGVSYW5nZSIsInZpZXciLCJ0YWJsZUZpbHRlcnMiLCJBcnJheSIsImlzQXJyYXkiLCJpbmRleE9mIiwic2VsZWN0aW9uVmFyaWFudENvbmZpZyIsImdldFNlbGVjdGlvblZhcmlhbnRDb25maWd1cmF0aW9uIiwib0NvbmZpZyIsImdldENvbnRlbnRBcmVhSWQiLCJjaGFydElkIiwidGFibGVJZCIsImFubm90YXRpb25TZWxlY3Rpb25GaWVsZHMiLCJpbnNlcnRDdXN0b21FbGVtZW50cyIsImZpbHRlckNvbmRpdGlvbnMiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2V0RmlsdGVyQ29uZGl0aW9ucyIsImhlYWRlckFjdGlvbnMiLCJnZXRBY3Rpb25zRnJvbU1hbmlmZXN0IiwiZ2V0SGVhZGVyQWN0aW9ucyIsIm1haW5FbnRpdHlTZXQiLCJ2YXJpYW50TWFuYWdlbWVudCIsImZpdENvbnRlbnQiLCJpc011bHRpRW50aXR5U2V0cyIsImlzQWxwIiwib1ZpZXciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtIQTs7Ozs7Ozs7QUFRQSxNQUFNQSxpQkFBaUIsR0FBRyxVQUFTQyxVQUFULEVBQWlDQyxZQUFqQyxFQUErRDtBQUN4RixRQUFNQyxLQUFLLEdBQUdELFlBQVksQ0FBQ0UsS0FBYixDQUFtQixHQUFuQixDQUFkO0FBQ0EsUUFBSUMsV0FBSjtBQUNBLFFBQUlDLEdBQUcsR0FBRyxFQUFWOztBQUNBLFdBQU9ILEtBQUssQ0FBQ0ksTUFBYixFQUFxQjtBQUNwQixVQUFJQyxJQUFJLEdBQUdMLEtBQUssQ0FBQ00sS0FBTixFQUFYO0FBQ0FKLE1BQUFBLFdBQVcsR0FBR0EsV0FBVyxHQUFHQSxXQUFXLEdBQUcsR0FBZCxHQUFvQkcsSUFBdkIsR0FBOEJBLElBQXZEO0FBQ0EsVUFBTUUsUUFBdUMsR0FBR1QsVUFBVSxDQUFDVSxXQUFYLENBQXVCTixXQUF2QixDQUFoRDs7QUFDQSxVQUFJSyxRQUFRLENBQUNFLEtBQVQsS0FBbUIsb0JBQW5CLElBQTJDRixRQUFRLENBQUNHLFlBQXhELEVBQXNFO0FBQ3JFTCxRQUFBQSxJQUFJLElBQUksR0FBUjtBQUNB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QUF1Q0MsWUFBWSxDQUFDQyxrQkFoQnJEO0FBaUJOMkIsTUFBQUEsb0JBQW9CLEVBQXBCQTtBQWpCTSxLQUFQO0FBbUJBLEdBekZNOzs7O0FBMkZQLFdBQVNTLGdCQUFULENBQTBCNUIsWUFBMUIsRUFBc0RNLEtBQXRELEVBQW9IO0FBQ25ILFFBQUlHLGFBQWEsR0FBRyxFQUFwQjtBQUFBLFFBQ0NDLGFBQWEsR0FBRyxFQURqQjs7QUFFQSxRQUFJSixLQUFLLENBQUNyTSxNQUFOLEtBQWlCLENBQXJCLEVBQXdCO0FBQ3ZCd00sTUFBQUEsYUFBYSxHQUFHSCxLQUFLLENBQUMsQ0FBRCxDQUFMLENBQVNsRCxjQUF6QjtBQUNBc0QsTUFBQUEsYUFBYSxHQUFHSixLQUFLLENBQUMsQ0FBRCxDQUFMLENBQVNqRCxjQUF6QjtBQUNBLEtBSEQsTUFHTyxJQUFJMkMsWUFBWSxLQUFLVCxZQUFZLENBQUNDLGtCQUE5QixJQUFvRGMsS0FBSyxDQUFDck0sTUFBTixLQUFpQixDQUF6RSxFQUE0RTtBQUNsRnFNLE1BQUFBLEtBQUssQ0FBQ3ZHLEdBQU4sQ0FBVSxVQUFBOEksS0FBSyxFQUFJO0FBQ2xCLFlBQUlBLEtBQUssQ0FBQ3hGLGNBQVYsRUFBMEI7QUFDekJxRCxVQUFBQSxhQUFhLEdBQUdtQyxLQUFLLENBQUN4RixjQUF0QjtBQUNBLFNBRkQsTUFFTyxJQUFJd0YsS0FBSyxDQUFDekYsY0FBVixFQUEwQjtBQUNoQ3FELFVBQUFBLGFBQWEsR0FBR29DLEtBQUssQ0FBQ3pGLGNBQXRCO0FBQ0E7QUFDRCxPQU5EO0FBT0E7O0FBQ0QsUUFBSXFELGFBQWEsSUFBSUMsYUFBckIsRUFBb0M7QUFDbkMsYUFBTztBQUNObUIsUUFBQUEsT0FBTyxFQUFFbkIsYUFESDtBQUVOb0IsUUFBQUEsT0FBTyxFQUFFckI7QUFGSCxPQUFQO0FBSUE7O0FBQ0QsV0FBTzVMLFNBQVA7QUFDQSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QXZhaWxhYmlsaXR5VHlwZSxcblx0RmlsdGVyRmllbGRNYW5pZmVzdENvbmZpZ3VyYXRpb24sXG5cdEZpbHRlck1hbmlmZXN0Q29uZmlndXJhdGlvbixcblx0TXVsdGlwbGVWaWV3c0NvbmZpZ3VyYXRpb24sXG5cdFZpZXdQYXRoQ29uZmlndXJhdGlvbixcblx0VmlzdWFsaXphdGlvblR5cGUsXG5cdEZpbHRlclNldHRpbmdzXG59IGZyb20gXCIuLi9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQgeyBFbnRpdHlTZXQsIEVudGl0eVR5cGUsIE5hdmlnYXRpb25Qcm9wZXJ0eSwgUHJvcGVydHkgfSBmcm9tIFwiQHNhcC11eC9hbm5vdGF0aW9uLWNvbnZlcnRlclwiO1xuaW1wb3J0IHsgQ29udmVydGVyQ29udGV4dCwgVGVtcGxhdGVUeXBlIH0gZnJvbSBcIi4vQmFzZUNvbnZlcnRlclwiO1xuaW1wb3J0IHtcblx0RGF0YVZpc3VhbGl6YXRpb25Bbm5vdGF0aW9ucyxcblx0RGF0YVZpc3VhbGl6YXRpb25EZWZpbml0aW9uLFxuXHRnZXREYXRhVmlzdWFsaXphdGlvbkNvbmZpZ3VyYXRpb24sXG5cdGdldERlZmF1bHRDaGFydCxcblx0Z2V0RGVmYXVsdExpbmVJdGVtLFxuXHRnZXREZWZhdWx0UHJlc2VudGF0aW9uVmFyaWFudCxcblx0Z2V0U2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudCxcblx0aXNQcmVzZW50YXRpb25Db21wbGlhbnQsXG5cdGdldFNlbGVjdGlvblZhcmlhbnQsXG5cdGlzU2VsZWN0aW9uUHJlc2VudGF0aW9uQ29tcGxpYW50XG59IGZyb20gXCIuLi9jb250cm9scy9Db21tb24vRGF0YVZpc3VhbGl6YXRpb25cIjtcbmltcG9ydCB7XG5cdExpbmVJdGVtLFxuXHRQcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzLFxuXHRTZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzLFxuXHRTZWxlY3RPcHRpb25UeXBlLFxuXHRTZWxlY3Rpb25WYXJpYW50VHlwZVR5cGVzLFxuXHRGaWVsZEdyb3VwVHlwZVxufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvZGlzdC9nZW5lcmF0ZWQvVUlcIjtcbmltcG9ydCB7IEFubm90YXRpb25UZXJtLCBEYXRhRmllbGRBYnN0cmFjdFR5cGVzLCBSZWZlcmVuY2VGYWNldFR5cGVzLCBVSUFubm90YXRpb25UZXJtcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgRmlsdGVyQmFySUQsIEZpbHRlclZhcmlhbnRNYW5hZ2VtZW50SUQsIFRhYmxlSUQgfSBmcm9tIFwiLi4vaGVscGVycy9JRFwiO1xuaW1wb3J0IHtcblx0Z2V0U2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb24sXG5cdFNlbGVjdGlvblZhcmlhbnRDb25maWd1cmF0aW9uLFxuXHRUYWJsZVZpc3VhbGl6YXRpb25cbn0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL1RhYmxlXCI7XG5pbXBvcnQgeyBCYXNlQWN0aW9uLCBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL0FjdGlvblwiO1xuaW1wb3J0IHsgQ29uZmlndXJhYmxlT2JqZWN0LCBDdXN0b21FbGVtZW50LCBpbnNlcnRDdXN0b21FbGVtZW50cywgUGxhY2VtZW50IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7IEtleUhlbHBlciB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvS2V5XCI7XG5pbXBvcnQgeyBhbm5vdGF0aW9uRXhwcmVzc2lvbiwgY29tcGlsZUJpbmRpbmcgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IHsgZ2V0RmlsdGVyQ29uZGl0aW9ucyB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9GaWx0ZXJcIjtcbmltcG9ydCB7IElzc3VlVHlwZSwgSXNzdWVTZXZlcml0eSwgSXNzdWVDYXRlZ29yeSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSXNzdWVNYW5hZ2VyXCI7XG50eXBlIFZpZXdBbm5vdGF0aW9uc1R5cGVUeXBlcyA9IFNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXMgfCBTZWxlY3Rpb25WYXJpYW50VHlwZVR5cGVzO1xudHlwZSBWYXJpYW50TWFuYWdlbWVudERlZmluaXRpb24gPSB7XG5cdGlkOiBzdHJpbmc7XG5cdHRhcmdldENvbnRyb2xJZHM6IHN0cmluZztcbn07XG5cbnR5cGUgTXVsdGlwbGVWaWV3Q29uZmlndXJhdGlvbiA9IFZpZXdQYXRoQ29uZmlndXJhdGlvbiAmIHtcblx0YW5ub3RhdGlvbj86IERhdGFWaXN1YWxpemF0aW9uQW5ub3RhdGlvbnM7XG59O1xuXG50eXBlIFNpbmdsZVZpZXdDb25maWd1cmF0aW9uID0ge1xuXHRhbm5vdGF0aW9uPzogRGF0YVZpc3VhbGl6YXRpb25Bbm5vdGF0aW9ucztcbn07XG5cbnR5cGUgVmlld0NvbmZpZ3VyYXRpb24gPSBNdWx0aXBsZVZpZXdDb25maWd1cmF0aW9uIHwgU2luZ2xlVmlld0NvbmZpZ3VyYXRpb247XG5cbnR5cGUgRmlsdGVyRmllbGQgPSBDb25maWd1cmFibGVPYmplY3QgJiB7XG5cdGNvbmRpdGlvblBhdGg6IHN0cmluZztcblx0YXZhaWxhYmlsaXR5OiBBdmFpbGFiaWxpdHlUeXBlO1xuXHRhbm5vdGF0aW9uUGF0aDogc3RyaW5nO1xuXHRsYWJlbD86IHN0cmluZztcblx0dGVtcGxhdGU/OiBzdHJpbmc7XG5cdGdyb3VwPzogc3RyaW5nO1xuXHRncm91cExhYmVsPzogc3RyaW5nO1xuXHRzZXR0aW5ncz86IEZpbHRlclNldHRpbmdzO1xufTtcblxudHlwZSBGaWx0ZXJHcm91cCA9IHtcblx0Z3JvdXA6IHN0cmluZztcblx0Z3JvdXBMYWJlbDogc3RyaW5nO1xufTtcblxudHlwZSBWaWV3Q29udmVydGVyU2V0dGluZ3MgPSBWaWV3Q29uZmlndXJhdGlvbiAmIHtcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dDtcblx0ZW50aXR5U2V0OiBFbnRpdHlTZXQ7XG59O1xuXG50eXBlIEN1c3RvbUVsZW1lbnRGaWx0ZXJGaWVsZCA9IEN1c3RvbUVsZW1lbnQ8RmlsdGVyRmllbGQ+O1xuXG5leHBvcnQgdHlwZSBMaXN0UmVwb3J0RGVmaW5pdGlvbiA9IHtcblx0bWFpbkVudGl0eVNldDogc3RyaW5nO1xuXHRzaW5nbGVUYWJsZUlkPzogc3RyaW5nOyAvLyBvbmx5IHdpdGggc2luZ2xlIFRhYmxlIG1vZGVcblx0c2luZ2xlQ2hhcnRJZD86IHN0cmluZzsgLy8gb25seSB3aXRoIHNpbmdsZSBUYWJsZSBtb2RlXG5cdHNob3dUYWJDb3VudHM/OiBib29sZWFuOyAvLyBvbmx5IHdpdGggbXVsdGkgVGFibGUgbW9kZVxuXHRoZWFkZXJBY3Rpb25zOiBCYXNlQWN0aW9uW107XG5cdHNlbGVjdGlvbkZpZWxkczogRmlsdGVyRmllbGRbXTtcblx0dmlld3M6IExpc3RSZXBvcnRWaWV3RGVmaW5pdGlvbltdO1xuXHRmaWx0ZXJDb25kaXRpb25zOiBzdHJpbmc7XG5cdGlzTXVsdGlFbnRpdHlTZXRzOiBib29sZWFuO1xuXHRmaWx0ZXJCYXJJZDogc3RyaW5nO1xuXHR2YXJpYW50TWFuYWdlbWVudDogVmFyaWFudE1hbmFnZW1lbnREZWZpbml0aW9uO1xuXHRmaXRDb250ZW50OiBib29sZWFuO1xuXHRpc0FscDogYm9vbGVhbjtcblx0dXNlU2VtYW50aWNEYXRlUmFuZ2U/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgTGlzdFJlcG9ydFZpZXdEZWZpbml0aW9uID0ge1xuXHRzZWxlY3Rpb25WYXJpYW50UGF0aD86IHN0cmluZzsgLy8gb25seSB3aXRoIG9uIG11bHRpIFRhYmxlIG1vZGVcblx0dGl0bGU/OiBzdHJpbmc7IC8vIG9ubHkgd2l0aCBtdWx0aSBUYWJsZSBtb2RlXG5cdGVudGl0eVNldDogc3RyaW5nO1xuXHRwcmVzZW50YXRpb246IERhdGFWaXN1YWxpemF0aW9uRGVmaW5pdGlvbjtcblx0dGFibGVDb250cm9sSWQ6IHN0cmluZztcblx0Y2hhcnRDb250cm9sSWQ6IHN0cmluZztcbn07XG5cbnR5cGUgQ29udGVudEFyZWFJRCA9IHtcblx0Y2hhcnRJZDogc3RyaW5nO1xuXHR0YWJsZUlkOiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGNvbmRpdGlvbiBwYXRoIHJlcXVpcmVkIGZvciB0aGUgY29uZGl0aW9uIG1vZGVsLiBJdCBsb29rcyBsaWtlIGZvbGxvdzpcbiAqIDwxOk4tUHJvcGVydHlOYW1lPipcXC88MToxLVByb3BlcnR5TmFtZT4vPFByb3BlcnR5TmFtZT4uXG4gKlxuICogQHBhcmFtIGVudGl0eVR5cGUgdGhlIHJvb3QgZW50aXR5IHR5cGVcbiAqIEBwYXJhbSBwcm9wZXJ0eVBhdGggdGhlIGZ1bGwgcGF0aCB0byB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZm9ybWF0dGVkIGNvbmRpdGlvbiBwYXRoXG4gKi9cbmNvbnN0IF9nZXRDb25kaXRpb25QYXRoID0gZnVuY3Rpb24oZW50aXR5VHlwZTogRW50aXR5VHlwZSwgcHJvcGVydHlQYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRjb25zdCBwYXJ0cyA9IHByb3BlcnR5UGF0aC5zcGxpdChcIi9cIik7XG5cdGxldCBwYXJ0aWFsUGF0aDtcblx0bGV0IGtleSA9IFwiXCI7XG5cdHdoaWxlIChwYXJ0cy5sZW5ndGgpIHtcblx0XHRsZXQgcGFydCA9IHBhcnRzLnNoaWZ0KCkgYXMgc3RyaW5nO1xuXHRcdHBhcnRpYWxQYXRoID0gcGFydGlhbFBhdGggPyBwYXJ0aWFsUGF0aCArIFwiL1wiICsgcGFydCA6IHBhcnQ7XG5cdFx0Y29uc3QgcHJvcGVydHk6IFByb3BlcnR5IHwgTmF2aWdhdGlvblByb3BlcnR5ID0gZW50aXR5VHlwZS5yZXNvbHZlUGF0aChwYXJ0aWFsUGF0aCk7XG5cdFx0aWYgKHByb3BlcnR5Ll90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiICYmIHByb3BlcnR5LmlzQ29sbGVjdGlvbikge1xuXHRcdFx0cGFydCArPSBcIipcIjtcblx0XHR9XG5cdFx0a2V5ID0ga2V5ID8ga2V5ICsgXCIvXCIgKyBwYXJ0IDogcGFydDtcblx0fVxuXHRyZXR1cm4ga2V5O1xufTtcblxuY29uc3QgX2NyZWF0ZUZpbHRlclNlbGVjdGlvbkZpZWxkID0gZnVuY3Rpb24oXG5cdGVudGl0eVNldDogRW50aXR5U2V0LFxuXHRwcm9wZXJ0eTogUHJvcGVydHksXG5cdGZ1bGxQcm9wZXJ0eVBhdGg6IHN0cmluZyxcblx0aW5jbHVkZUhpZGRlbjogYm9vbGVhbixcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogRmlsdGVyRmllbGQgfCB1bmRlZmluZWQge1xuXHQvLyBpZ25vcmUgY29tcGxleCBwcm9wZXJ0eSB0eXBlcyBhbmQgaGlkZGVuIGFubm90YXRlZCBvbmVzXG5cdGlmIChwcm9wZXJ0eSAhPT0gdW5kZWZpbmVkICYmIHByb3BlcnR5LnRhcmdldFR5cGUgPT09IHVuZGVmaW5lZCAmJiAoaW5jbHVkZUhpZGRlbiB8fCBwcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiAhPT0gdHJ1ZSkpIHtcblx0XHRjb25zdCBlbnRpdHlUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uRW50aXR5VHlwZShwcm9wZXJ0eSk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGtleTogS2V5SGVscGVyLmdldFNlbGVjdGlvbkZpZWxkS2V5RnJvbVBhdGgoZnVsbFByb3BlcnR5UGF0aCksXG5cdFx0XHRhbm5vdGF0aW9uUGF0aDogXCIvXCIgKyBlbnRpdHlTZXQubmFtZSArIFwiL1wiICsgZnVsbFByb3BlcnR5UGF0aCxcblx0XHRcdGNvbmRpdGlvblBhdGg6IF9nZXRDb25kaXRpb25QYXRoKGVudGl0eVNldC5lbnRpdHlUeXBlLCBmdWxsUHJvcGVydHlQYXRoKSxcblx0XHRcdGF2YWlsYWJpbGl0eTogcHJvcGVydHkuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW5GaWx0ZXIgPT09IHRydWUgPyBBdmFpbGFiaWxpdHlUeXBlLkhpZGRlbiA6IEF2YWlsYWJpbGl0eVR5cGUuQWRhcHRhdGlvbixcblx0XHRcdGxhYmVsOiBjb21waWxlQmluZGluZyhhbm5vdGF0aW9uRXhwcmVzc2lvbihwcm9wZXJ0eS5hbm5vdGF0aW9ucy5Db21tb24/LkxhYmVsIHx8IHByb3BlcnR5Lm5hbWUpKSxcblx0XHRcdGdyb3VwOiBlbnRpdHlUeXBlLm5hbWUsXG5cdFx0XHRncm91cExhYmVsOiBjb21waWxlQmluZGluZyhhbm5vdGF0aW9uRXhwcmVzc2lvbihlbnRpdHlUeXBlPy5hbm5vdGF0aW9ucz8uQ29tbW9uPy5MYWJlbCB8fCBlbnRpdHlUeXBlLm5hbWUpKVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbmNvbnN0IF9nZXRTZWxlY3Rpb25GaWVsZHMgPSBmdW5jdGlvbihcblx0ZW50aXR5U2V0OiBFbnRpdHlTZXQsXG5cdG5hdmlnYXRpb25QYXRoOiBzdHJpbmcsXG5cdHByb3BlcnRpZXM6IEFycmF5PFByb3BlcnR5PiB8IHVuZGVmaW5lZCxcblx0aW5jbHVkZUhpZGRlbjogYm9vbGVhbixcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGQ+IHtcblx0Y29uc3Qgc2VsZWN0aW9uRmllbGRNYXA6IFJlY29yZDxzdHJpbmcsIEZpbHRlckZpZWxkPiA9IHt9O1xuXHRpZiAocHJvcGVydGllcykge1xuXHRcdHByb3BlcnRpZXMuZm9yRWFjaCgocHJvcGVydHk6IFByb3BlcnR5KSA9PiB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0eVBhdGg6IHN0cmluZyA9IHByb3BlcnR5Lm5hbWU7XG5cdFx0XHRjb25zdCBmdWxsUGF0aDogc3RyaW5nID0gKG5hdmlnYXRpb25QYXRoID8gbmF2aWdhdGlvblBhdGggKyBcIi9cIiA6IFwiXCIpICsgcHJvcGVydHlQYXRoO1xuXHRcdFx0Y29uc3Qgc2VsZWN0aW9uRmllbGQgPSBfY3JlYXRlRmlsdGVyU2VsZWN0aW9uRmllbGQoZW50aXR5U2V0LCBwcm9wZXJ0eSwgZnVsbFBhdGgsIGluY2x1ZGVIaWRkZW4sIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0aWYgKHNlbGVjdGlvbkZpZWxkKSB7XG5cdFx0XHRcdHNlbGVjdGlvbkZpZWxkTWFwW2Z1bGxQYXRoXSA9IHNlbGVjdGlvbkZpZWxkO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBzZWxlY3Rpb25GaWVsZE1hcDtcbn07XG5cbmNvbnN0IF9nZXRTZWxlY3Rpb25GaWVsZHNCeVBhdGggPSBmdW5jdGlvbihcblx0ZW50aXR5U2V0OiBFbnRpdHlTZXQsXG5cdHByb3BlcnR5UGF0aHM6IEFycmF5PHN0cmluZz4gfCB1bmRlZmluZWQsXG5cdGluY2x1ZGVIaWRkZW46IGJvb2xlYW4sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IFJlY29yZDxzdHJpbmcsIEZpbHRlckZpZWxkPiB7XG5cdGxldCBzZWxlY3Rpb25GaWVsZHM6IFJlY29yZDxzdHJpbmcsIEZpbHRlckZpZWxkPiA9IHt9O1xuXHRpZiAocHJvcGVydHlQYXRocykge1xuXHRcdHByb3BlcnR5UGF0aHMuZm9yRWFjaCgocHJvcGVydHlQYXRoOiBzdHJpbmcpID0+IHtcblx0XHRcdGxldCBsb2NhbFNlbGVjdGlvbkZpZWxkczogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGQ+O1xuXG5cdFx0XHRjb25zdCBwcm9wZXJ0eTogUHJvcGVydHkgfCBOYXZpZ2F0aW9uUHJvcGVydHkgPSBlbnRpdHlTZXQuZW50aXR5VHlwZS5yZXNvbHZlUGF0aChwcm9wZXJ0eVBhdGgpO1xuXHRcdFx0aWYgKHByb3BlcnR5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHByb3BlcnR5Ll90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiKSB7XG5cdFx0XHRcdC8vIGhhbmRsZSBuYXZpZ2F0aW9uIHByb3BlcnRpZXNcblx0XHRcdFx0bG9jYWxTZWxlY3Rpb25GaWVsZHMgPSBfZ2V0U2VsZWN0aW9uRmllbGRzKFxuXHRcdFx0XHRcdGVudGl0eVNldCxcblx0XHRcdFx0XHRwcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0cHJvcGVydHkudGFyZ2V0VHlwZS5lbnRpdHlQcm9wZXJ0aWVzLFxuXHRcdFx0XHRcdGluY2x1ZGVIaWRkZW4sXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIGlmIChwcm9wZXJ0eS50YXJnZXRUeXBlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Ly8gaGFuZGxlIENvbXBsZXhUeXBlIHByb3BlcnRpZXNcblx0XHRcdFx0bG9jYWxTZWxlY3Rpb25GaWVsZHMgPSBfZ2V0U2VsZWN0aW9uRmllbGRzKFxuXHRcdFx0XHRcdGVudGl0eVNldCxcblx0XHRcdFx0XHRwcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0cHJvcGVydHkudGFyZ2V0VHlwZS5wcm9wZXJ0aWVzLFxuXHRcdFx0XHRcdGluY2x1ZGVIaWRkZW4sXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgbmF2aWdhdGlvblBhdGggPSBwcm9wZXJ0eVBhdGguaW5jbHVkZXMoXCIvXCIpXG5cdFx0XHRcdFx0PyBwcm9wZXJ0eVBhdGhcblx0XHRcdFx0XHRcdFx0LnNwbGl0KFwiL1wiKVxuXHRcdFx0XHRcdFx0XHQuc3BsaWNlKDAsIDEpXG5cdFx0XHRcdFx0XHRcdC5qb2luKFwiL1wiKVxuXHRcdFx0XHRcdDogXCJcIjtcblx0XHRcdFx0bG9jYWxTZWxlY3Rpb25GaWVsZHMgPSBfZ2V0U2VsZWN0aW9uRmllbGRzKGVudGl0eVNldCwgbmF2aWdhdGlvblBhdGgsIFtwcm9wZXJ0eV0sIGluY2x1ZGVIaWRkZW4sIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxlY3Rpb25GaWVsZHMgPSB7XG5cdFx0XHRcdC4uLnNlbGVjdGlvbkZpZWxkcyxcblx0XHRcdFx0Li4ubG9jYWxTZWxlY3Rpb25GaWVsZHNcblx0XHRcdH07XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIHNlbGVjdGlvbkZpZWxkcztcbn07XG5cbi8qKlxuICogRW50ZXIgYWxsIERhdGFGaWVsZHMgb2YgYSBnaXZlbiBGaWVsZEdyb3VwIGludG8gdGhlIGZpbHRlckZhY2V0TWFwLlxuICpcbiAqIEBwYXJhbSB7QW5ub3RhdGlvblRlcm08RmllbGRHcm91cFR5cGU+fSBmaWVsZEdyb3VwXG4gKiBAcmV0dXJucyB7UmVjb3JkPHN0cmluZywgRmlsdGVyR3JvdXA+fSBmaWx0ZXJGYWNldE1hcCBmb3IgdGhlIGdpdmVuIGZpZWxkR3JvdXBcbiAqL1xuZnVuY3Rpb24gZ2V0RmllbGRHcm91cEZpbHRlckdyb3VwcyhmaWVsZEdyb3VwOiBBbm5vdGF0aW9uVGVybTxGaWVsZEdyb3VwVHlwZT4pOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJHcm91cD4ge1xuXHRjb25zdCBmaWx0ZXJGYWNldE1hcDogUmVjb3JkPHN0cmluZywgRmlsdGVyR3JvdXA+ID0ge307XG5cdGZpZWxkR3JvdXAuRGF0YS5mb3JFYWNoKChkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpID0+IHtcblx0XHRpZiAoZGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFwiKSB7XG5cdFx0XHRmaWx0ZXJGYWNldE1hcFtkYXRhRmllbGQuVmFsdWUucGF0aF0gPSB7XG5cdFx0XHRcdGdyb3VwOiBmaWVsZEdyb3VwLmZ1bGx5UXVhbGlmaWVkTmFtZSxcblx0XHRcdFx0Z3JvdXBMYWJlbDpcblx0XHRcdFx0XHRjb21waWxlQmluZGluZyhcblx0XHRcdFx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uKGZpZWxkR3JvdXAuTGFiZWwgfHwgZmllbGRHcm91cC5hbm5vdGF0aW9ucz8uQ29tbW9uPy5MYWJlbCB8fCBmaWVsZEdyb3VwLnF1YWxpZmllcilcblx0XHRcdFx0XHQpIHx8IGZpZWxkR3JvdXAucXVhbGlmaWVyXG5cdFx0XHR9O1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBmaWx0ZXJGYWNldE1hcDtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNlbGVjdGlvbiBmaWVsZHMgdGhhdCB3aWxsIGJlIHVzZWQgd2l0aGluIHRoZSBmaWx0ZXIgYmFyXG4gKiBUaGlzIGNvbmZpZ3VyYXRpb24gdGFrZXMgaW50byBhY2NvdW50IGFubm90YXRpb24gYW5kIHRoZSBzZWxlY3Rpb24gdmFyaWFudHMuXG4gKlxuICogQHBhcmFtIHtFbnRpdHlTZXR9IGVudGl0eVNldFxuICogQHBhcmFtIHtTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbltdfSBzZWxlY3Rpb25WYXJpYW50c1xuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcmV0dXJucyB7RmlsdGVyU2VsZWN0aW9uRmllbGRbXX0gYW4gYXJyYXkgb2Ygc2VsZWN0aW9uIGZpZWxkc1xuICovXG5leHBvcnQgY29uc3QgZ2V0U2VsZWN0aW9uRmllbGRzID0gZnVuY3Rpb24oXG5cdGVudGl0eVNldDogRW50aXR5U2V0LFxuXHRzZWxlY3Rpb25WYXJpYW50czogU2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb25bXSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogRmlsdGVyRmllbGRbXSB7XG5cdC8vIGNyZWF0ZSBhIG1hcCBvZiBwcm9wZXJ0aWVzIHRvIGJlIHVzZWQgaW4gc2VsZWN0aW9uIHZhcmlhbnRzXG5cdGNvbnN0IGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllczogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSBzZWxlY3Rpb25WYXJpYW50cy5yZWR1Y2UoXG5cdFx0KHByZXZpb3VzVmFsdWU6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+LCBzZWxlY3Rpb25WYXJpYW50KSA9PiB7XG5cdFx0XHRzZWxlY3Rpb25WYXJpYW50LnByb3BlcnR5TmFtZXMuZm9yRWFjaChwcm9wZXJ0eU5hbWUgPT4ge1xuXHRcdFx0XHRwcmV2aW91c1ZhbHVlW3Byb3BlcnR5TmFtZV0gPSB0cnVlO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcHJldmlvdXNWYWx1ZTtcblx0XHR9LFxuXHRcdHt9XG5cdCk7XG5cblx0Y29uc3QgZmlsdGVyRmFjZXRzID0gY29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uRW50aXR5VHlwZSgpLmFubm90YXRpb25zLlVJPy5GaWx0ZXJGYWNldHM7XG5cdGxldCBmaWx0ZXJGYWNldE1hcDogUmVjb3JkPHN0cmluZywgRmlsdGVyR3JvdXA+ID0ge307XG5cblx0Y29uc3QgYUZpZWxkR3JvdXBzID0gY29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uQnlUeXBlKFwiVUlcIiwgVUlBbm5vdGF0aW9uVGVybXMuRmllbGRHcm91cCkgfHwgW107XG5cblx0aWYgKGZpbHRlckZhY2V0cyA9PT0gdW5kZWZpbmVkIHx8IGZpbHRlckZhY2V0cy5sZW5ndGggPCAwKSB7XG5cdFx0Zm9yIChjb25zdCBpIGluIGFGaWVsZEdyb3Vwcykge1xuXHRcdFx0ZmlsdGVyRmFjZXRNYXAgPSB7XG5cdFx0XHRcdC4uLmZpbHRlckZhY2V0TWFwLFxuXHRcdFx0XHQuLi5nZXRGaWVsZEdyb3VwRmlsdGVyR3JvdXBzKGFGaWVsZEdyb3Vwc1tpXSBhcyBBbm5vdGF0aW9uVGVybTxGaWVsZEdyb3VwVHlwZT4pXG5cdFx0XHR9O1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRmaWx0ZXJGYWNldE1hcCA9IGZpbHRlckZhY2V0cy5yZWR1Y2UoKHByZXZpb3VzVmFsdWU6IFJlY29yZDxzdHJpbmcsIEZpbHRlckdyb3VwPiwgZmlsdGVyRmFjZXQ6IFJlZmVyZW5jZUZhY2V0VHlwZXMpID0+IHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZmlsdGVyRmFjZXQuVGFyZ2V0LiR0YXJnZXQuRGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRwcmV2aW91c1ZhbHVlW2ZpbHRlckZhY2V0LlRhcmdldC4kdGFyZ2V0LkRhdGFbaV0uVmFsdWUucGF0aF0gPSB7XG5cdFx0XHRcdFx0Z3JvdXA6IGZpbHRlckZhY2V0LklEIGFzIHN0cmluZyxcblx0XHRcdFx0XHRncm91cExhYmVsOiBmaWx0ZXJGYWNldC5MYWJlbCBhcyBzdHJpbmdcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcmV2aW91c1ZhbHVlO1xuXHRcdH0sIHt9KTtcblx0fVxuXG5cdGxldCBhU2VsZWN0T3B0aW9uczogYW55W10gPSBbXTtcblx0Y29uc3Qgc2VsZWN0aW9uVmFyaWFudCA9IGdldFNlbGVjdGlvblZhcmlhbnQoZW50aXR5U2V0LmVudGl0eVR5cGUsIGNvbnZlcnRlckNvbnRleHQpO1xuXHRpZiAoc2VsZWN0aW9uVmFyaWFudCkge1xuXHRcdGFTZWxlY3RPcHRpb25zID0gc2VsZWN0aW9uVmFyaWFudC5TZWxlY3RPcHRpb25zO1xuXHR9XG5cblx0Ly8gY3JlYXRlIGEgbWFwIG9mIGFsbCBwb3RlbnRpYWwgZmlsdGVyIGZpZWxkcyBiYXNlZCBvbi4uLlxuXHRjb25zdCBmaWx0ZXJGaWVsZHM6IFJlY29yZDxzdHJpbmcsIEZpbHRlckZpZWxkPiA9IHtcblx0XHQvLyAuLi5ub24gaGlkZGVuIHByb3BlcnRpZXMgb2YgdGhlIGVudGl0eVxuXHRcdC4uLl9nZXRTZWxlY3Rpb25GaWVsZHMoZW50aXR5U2V0LCBcIlwiLCBlbnRpdHlTZXQuZW50aXR5VHlwZS5lbnRpdHlQcm9wZXJ0aWVzLCBmYWxzZSwgY29udmVydGVyQ29udGV4dCksXG5cdFx0Ly8gLi4uYWRkaXRpb25hbCBtYW5pZmVzdCBkZWZpbmVkIG5hdmlnYXRpb24gcHJvcGVydGllc1xuXHRcdC4uLl9nZXRTZWxlY3Rpb25GaWVsZHNCeVBhdGgoXG5cdFx0XHRlbnRpdHlTZXQsXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmdldEZpbHRlckNvbmZpZ3VyYXRpb24oKS5uYXZpZ2F0aW9uUHJvcGVydGllcyxcblx0XHRcdGZhbHNlLFxuXHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdClcblx0fTtcblxuXHQvL0ZpbHRlcnMgd2hpY2ggaGFzIHRvIGJlIGFkZGVkIHdoaWNoIGlzIHBhcnQgb2YgU1YvRGVmYXVsdCBhbm5vdGF0aW9ucyBidXQgbm90IHByZXNlbnQgaW4gdGhlIFNlbGVjdGlvbkZpZWxkc1xuXHRjb25zdCBkZWZhdWx0RmlsdGVycyA9IF9nZXREZWFmdWx0RmlsdGVyRmllbGRzKGZpbHRlckZpZWxkcywgYVNlbGVjdE9wdGlvbnMsIGVudGl0eVNldCwgY29udmVydGVyQ29udGV4dCwgZXhjbHVkZWRGaWx0ZXJQcm9wZXJ0aWVzKTtcblxuXHQvLyBmaW5hbGx5IGNyZWF0ZSBmaW5hbCBsaXN0IG9mIGZpbHRlciBmaWVsZHMgYnkgYWRkaW5nIHRoZSBTZWxlY3Rpb25GaWVsZHMgZmlyc3QgKG9yZGVyIG1hdHRlcnMpLi4uXG5cdHJldHVybiAoXG5cdFx0KFxuXHRcdFx0ZW50aXR5U2V0LmVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5TZWxlY3Rpb25GaWVsZHM/LnJlZHVjZSgoc2VsZWN0aW9uRmllbGRzOiBGaWx0ZXJGaWVsZFtdLCBzZWxlY3Rpb25GaWVsZCkgPT4ge1xuXHRcdFx0XHRjb25zdCBwcm9wZXJ0eVBhdGggPSBzZWxlY3Rpb25GaWVsZC52YWx1ZTtcblx0XHRcdFx0aWYgKCEocHJvcGVydHlQYXRoIGluIGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllcykpIHtcblx0XHRcdFx0XHRjb25zdCBmaWx0ZXJGaWVsZDogRmlsdGVyRmllbGQgfCB1bmRlZmluZWQgPSBfZ2V0RmlsdGVyRmllbGQoZmlsdGVyRmllbGRzLCBwcm9wZXJ0eVBhdGgsIGNvbnZlcnRlckNvbnRleHQsIGVudGl0eVNldCk7XG5cdFx0XHRcdFx0aWYgKGZpbHRlckZpZWxkKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJGaWVsZC5ncm91cCA9IFwiXCI7XG5cdFx0XHRcdFx0XHRmaWx0ZXJGaWVsZC5ncm91cExhYmVsID0gXCJcIjtcblx0XHRcdFx0XHRcdHNlbGVjdGlvbkZpZWxkcy5wdXNoKGZpbHRlckZpZWxkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHNlbGVjdGlvbkZpZWxkcztcblx0XHRcdH0sIFtdKSB8fCBbXVxuXHRcdClcblx0XHRcdC8vIFRvIGFkZCB0aGUgRmlsdGVyRmllbGQgd2hpY2ggaXMgbm90IHBhcnQgb2YgdGhlIFNlbGVjdGlvbiBGaWVsZHMgYnV0IHRoZSBwcm9wZXJ0eSBpcyBtZW50aW9uZWQgaW4gdGhlIFNlbGVjdGlvbiBWYXJpYW50XG5cdFx0XHQuY29uY2F0KGRlZmF1bHRGaWx0ZXJzIHx8IFtdKVxuXHRcdFx0Ly8gLi4uYW5kIGFkZGluZyByZW1haW5pbmcgZmlsdGVyIGZpZWxkcywgdGhhdCBhcmUgbm90IHVzZWQgaW4gYSBTZWxlY3Rpb25WYXJpYW50IChvcmRlciBkb2Vzbid0IG1hdHRlcilcblx0XHRcdC5jb25jYXQoXG5cdFx0XHRcdE9iamVjdC5rZXlzKGZpbHRlckZpZWxkcylcblx0XHRcdFx0XHQuZmlsdGVyKHByb3BlcnR5UGF0aCA9PiAhKHByb3BlcnR5UGF0aCBpbiBleGNsdWRlZEZpbHRlclByb3BlcnRpZXMpKVxuXHRcdFx0XHRcdC5tYXAocHJvcGVydHlQYXRoID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiBPYmplY3QuYXNzaWduKGZpbHRlckZpZWxkc1twcm9wZXJ0eVBhdGhdLCBmaWx0ZXJGYWNldE1hcFtwcm9wZXJ0eVBhdGhdKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0KVxuXHQpO1xufTtcblxuY29uc3QgX2dldERlYWZ1bHRGaWx0ZXJGaWVsZHMgPSBmdW5jdGlvbihcblx0ZmlsdGVyRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD4sXG5cdGFTZWxlY3RPcHRpb25zOiBhbnlbXSxcblx0ZW50aXR5U2V0OiBFbnRpdHlTZXQsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllczogUmVjb3JkPHN0cmluZywgYm9vbGVhbj5cbik6IEZpbHRlckZpZWxkW10ge1xuXHRjb25zdCBzZWxlY3Rpb25GaWVsZHM6IEZpbHRlckZpZWxkW10gPSBbXTtcblx0Y29uc3QgVUlTZWxlY3Rpb25GaWVsZHM6IGFueSA9IHt9O1xuXHRjb25zdCBwcm9wZXJ0aWVzID0gZW50aXR5U2V0LmVudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcztcblx0ZW50aXR5U2V0LmVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5TZWxlY3Rpb25GaWVsZHM/LmZvckVhY2goU2VsZWN0aW9uRmllbGQgPT4ge1xuXHRcdFVJU2VsZWN0aW9uRmllbGRzW1NlbGVjdGlvbkZpZWxkLnZhbHVlXSA9IHRydWU7XG5cdH0pO1xuXHRpZiAoYVNlbGVjdE9wdGlvbnMgJiYgYVNlbGVjdE9wdGlvbnMubGVuZ3RoID4gMCkge1xuXHRcdGFTZWxlY3RPcHRpb25zPy5mb3JFYWNoKChzZWxlY3RPcHRpb246IFNlbGVjdE9wdGlvblR5cGUpID0+IHtcblx0XHRcdGNvbnN0IHByb3BlcnR5TmFtZTogYW55ID0gc2VsZWN0T3B0aW9uLlByb3BlcnR5TmFtZTtcblx0XHRcdGNvbnN0IHNQcm9wZXJ0eVBhdGg6IHN0cmluZyA9IHByb3BlcnR5TmFtZS52YWx1ZTtcblx0XHRcdGNvbnN0IFVJU2VsZWN0aW9uRmllbGRzOiBhbnkgPSB7fTtcblx0XHRcdGVudGl0eVNldC5lbnRpdHlUeXBlLmFubm90YXRpb25zPy5VST8uU2VsZWN0aW9uRmllbGRzPy5mb3JFYWNoKFNlbGVjdGlvbkZpZWxkID0+IHtcblx0XHRcdFx0VUlTZWxlY3Rpb25GaWVsZHNbU2VsZWN0aW9uRmllbGQudmFsdWVdID0gdHJ1ZTtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKCEoc1Byb3BlcnR5UGF0aCBpbiBleGNsdWRlZEZpbHRlclByb3BlcnRpZXMpKSB7XG5cdFx0XHRcdGlmICghKHNQcm9wZXJ0eVBhdGggaW4gVUlTZWxlY3Rpb25GaWVsZHMpKSB7XG5cdFx0XHRcdFx0Y29uc3QgRmlsdGVyRmllbGQ6IEZpbHRlckZpZWxkIHwgdW5kZWZpbmVkID0gX2dldEZpbHRlckZpZWxkKGZpbHRlckZpZWxkcywgc1Byb3BlcnR5UGF0aCwgY29udmVydGVyQ29udGV4dCwgZW50aXR5U2V0KTtcblx0XHRcdFx0XHRpZiAoRmlsdGVyRmllbGQpIHtcblx0XHRcdFx0XHRcdHNlbGVjdGlvbkZpZWxkcy5wdXNoKEZpbHRlckZpZWxkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSBlbHNlIGlmIChwcm9wZXJ0aWVzKSB7XG5cdFx0cHJvcGVydGllcy5mb3JFYWNoKChwcm9wZXJ0eTogUHJvcGVydHkpID0+IHtcblx0XHRcdGNvbnN0IGRlZmF1bHRGaWx0ZXJWYWx1ZSA9IHByb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LkZpbHRlckRlZmF1bHRWYWx1ZTtcblx0XHRcdGNvbnN0IFByb3BlcnR5UGF0aCA9IHByb3BlcnR5Lm5hbWU7XG5cdFx0XHRpZiAoIShQcm9wZXJ0eVBhdGggaW4gZXhjbHVkZWRGaWx0ZXJQcm9wZXJ0aWVzKSkge1xuXHRcdFx0XHRpZiAoZGVmYXVsdEZpbHRlclZhbHVlICYmICEoUHJvcGVydHlQYXRoIGluIFVJU2VsZWN0aW9uRmllbGRzKSkge1xuXHRcdFx0XHRcdGNvbnN0IEZpbHRlckZpZWxkOiBGaWx0ZXJGaWVsZCB8IHVuZGVmaW5lZCA9IF9nZXRGaWx0ZXJGaWVsZChmaWx0ZXJGaWVsZHMsIFByb3BlcnR5UGF0aCwgY29udmVydGVyQ29udGV4dCwgZW50aXR5U2V0KTtcblx0XHRcdFx0XHRpZiAoRmlsdGVyRmllbGQpIHtcblx0XHRcdFx0XHRcdHNlbGVjdGlvbkZpZWxkcy5wdXNoKEZpbHRlckZpZWxkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gc2VsZWN0aW9uRmllbGRzO1xufTtcblxuY29uc3QgX2dldEZpbHRlckZpZWxkID0gZnVuY3Rpb24oXG5cdGZpbHRlckZpZWxkczogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGQ+LFxuXHRwcm9wZXJ0eVBhdGg6IHN0cmluZyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0ZW50aXR5U2V0OiBFbnRpdHlTZXRcbik6IEZpbHRlckZpZWxkIHwgdW5kZWZpbmVkIHtcblx0bGV0IGZpbHRlckZpZWxkOiBGaWx0ZXJGaWVsZCB8IHVuZGVmaW5lZCA9IGZpbHRlckZpZWxkc1twcm9wZXJ0eVBhdGhdO1xuXHRpZiAoZmlsdGVyRmllbGQpIHtcblx0XHRkZWxldGUgZmlsdGVyRmllbGRzW3Byb3BlcnR5UGF0aF07XG5cdH0gZWxzZSB7XG5cdFx0ZmlsdGVyRmllbGQgPSBfY3JlYXRlRmlsdGVyU2VsZWN0aW9uRmllbGQoXG5cdFx0XHRlbnRpdHlTZXQsXG5cdFx0XHRlbnRpdHlTZXQuZW50aXR5VHlwZS5yZXNvbHZlUGF0aChwcm9wZXJ0eVBhdGgpLFxuXHRcdFx0cHJvcGVydHlQYXRoLFxuXHRcdFx0dHJ1ZSxcblx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHQpO1xuXHR9XG5cdGlmICghZmlsdGVyRmllbGQpIHtcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldERpYWdub3N0aWNzKCkuYWRkSXNzdWUoSXNzdWVDYXRlZ29yeS5Bbm5vdGF0aW9uLCBJc3N1ZVNldmVyaXR5LkhpZ2gsIElzc3VlVHlwZS5NSVNTSU5HX1NFTEVDVElPTkZJRUxEKTtcblx0fVxuXHQvLyBkZWZpbmVkIFNlbGVjdGlvbkZpZWxkcyBhcmUgYXZhaWxhYmxlIGJ5IGRlZmF1bHRcblx0aWYgKGZpbHRlckZpZWxkKSB7XG5cdFx0ZmlsdGVyRmllbGQuYXZhaWxhYmlsaXR5ID0gQXZhaWxhYmlsaXR5VHlwZS5EZWZhdWx0O1xuXHR9XG5cdHJldHVybiBmaWx0ZXJGaWVsZDtcbn07XG5cbi8qKlxuICogUmV0cmlldmVzIGZpbHRlcmZpZWxkcyBmb3JtIHRoZSBtYW5pZmVzdC5cbiAqXG4gKiBAcGFyYW0gZW50aXR5U2V0IHRoZSBjdXJyZW50IGVudGl0eVNldFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgdGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcmV0dXJucyB7UmVjb3JkPHN0cmluZywgQ3VzdG9tRWxlbWVudEZpbHRlckZpZWxkPn0gdGhlIG1hbmlmZXN0IGRlZmluZWQgZmlsdGVyIGZpZWxkc1xuICovXG5jb25zdCBnZXRNYW5pZmVzdEZpbHRlckZpZWxkcyA9IGZ1bmN0aW9uKFxuXHRlbnRpdHlTZXQ6IEVudGl0eVNldCxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogUmVjb3JkPHN0cmluZywgQ3VzdG9tRWxlbWVudEZpbHRlckZpZWxkPiB7XG5cdGNvbnN0IGZiQ29uZmlnOiBGaWx0ZXJNYW5pZmVzdENvbmZpZ3VyYXRpb24gPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmdldEZpbHRlckNvbmZpZ3VyYXRpb24oKTtcblx0Y29uc3QgZGVmaW5lZEZpbHRlckZpZWxkczogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGRNYW5pZmVzdENvbmZpZ3VyYXRpb24+ID0gZmJDb25maWc/LmZpbHRlckZpZWxkcyB8fCB7fTtcblx0Y29uc3Qgc2VsZWN0aW9uRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD4gPSBfZ2V0U2VsZWN0aW9uRmllbGRzQnlQYXRoKFxuXHRcdGVudGl0eVNldCxcblx0XHRPYmplY3Qua2V5cyhkZWZpbmVkRmlsdGVyRmllbGRzKS5tYXAoa2V5ID0+IGRlZmluZWRGaWx0ZXJGaWVsZHNba2V5XS5wcm9wZXJ0eSB8fCBLZXlIZWxwZXIuZ2V0UGF0aEZyb21TZWxlY3Rpb25GaWVsZEtleShrZXkpKSxcblx0XHR0cnVlLFxuXHRcdGNvbnZlcnRlckNvbnRleHRcblx0KTtcblx0Y29uc3QgZmlsdGVyRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21FbGVtZW50RmlsdGVyRmllbGQ+ID0ge307XG5cblx0Zm9yIChjb25zdCBzS2V5IGluIGRlZmluZWRGaWx0ZXJGaWVsZHMpIHtcblx0XHRjb25zdCBmaWx0ZXJGaWVsZCA9IGRlZmluZWRGaWx0ZXJGaWVsZHNbc0tleV07XG5cdFx0Y29uc3QgcHJvcGVydHlOYW1lID0gZmlsdGVyRmllbGQucHJvcGVydHkgfHwgS2V5SGVscGVyLmdldFBhdGhGcm9tU2VsZWN0aW9uRmllbGRLZXkoc0tleSk7XG5cdFx0Y29uc3Qgc2VsZWN0aW9uRmllbGQgPSBzZWxlY3Rpb25GaWVsZHNbcHJvcGVydHlOYW1lXTtcblx0XHRmaWx0ZXJGaWVsZHNbc0tleV0gPSB7XG5cdFx0XHRrZXk6IHNLZXksXG5cdFx0XHRhbm5vdGF0aW9uUGF0aDogc2VsZWN0aW9uRmllbGQuYW5ub3RhdGlvblBhdGgsXG5cdFx0XHRjb25kaXRpb25QYXRoOiBzZWxlY3Rpb25GaWVsZC5jb25kaXRpb25QYXRoLFxuXHRcdFx0dGVtcGxhdGU6IGZpbHRlckZpZWxkLnRlbXBsYXRlLFxuXHRcdFx0bGFiZWw6IGZpbHRlckZpZWxkLmxhYmVsLFxuXHRcdFx0cG9zaXRpb246IGZpbHRlckZpZWxkLnBvc2l0aW9uIHx8IHsgcGxhY2VtZW50OiBQbGFjZW1lbnQuQWZ0ZXIgfSxcblx0XHRcdGF2YWlsYWJpbGl0eTogZmlsdGVyRmllbGQuYXZhaWxhYmlsaXR5IHx8IEF2YWlsYWJpbGl0eVR5cGUuRGVmYXVsdCxcblx0XHRcdHNldHRpbmdzOiBmaWx0ZXJGaWVsZC5zZXR0aW5nc1xuXHRcdH07XG5cdH1cblx0cmV0dXJuIGZpbHRlckZpZWxkcztcbn07XG5cbi8qKlxuICogRmluZCBhIHZpc3VhbGl6YXRpb24gYW5ub3RhdGlvbiB0aGF0IGNhbiBiZSB1c2VkIGZvciByZW5kZXJpbmcgdGhlIGxpc3QgcmVwb3J0LlxuICogQHBhcmFtIHtFbnRpdHlUeXBlfSBlbnRpdHlUeXBlIHRoZSBjdXJyZW50IGVudGl0eVR5cGVcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0gYklzQUxQXG4gKiBAcmV0dXJucyB7TGluZUl0ZW0gfCBQcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzIHwgdW5kZWZpbmVkfSBvbmUgY29tcGxpYW50IGFubm90YXRpb24gZm9yIHJlbmRlcmluZyB0aGUgbGlzdCByZXBvcnRcbiAqL1xuZnVuY3Rpb24gZ2V0Q29tcGxpYW50VmlzdWFsaXphdGlvbkFubm90YXRpb24oXG5cdGVudGl0eVR5cGU6IEVudGl0eVR5cGUsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGJJc0FMUDogQm9vbGVhblxuKTogTGluZUl0ZW0gfCBQcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzIHwgU2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcyB8IHVuZGVmaW5lZCB7XG5cdGNvbnN0IGFubm90YXRpb25QYXRoID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKS5nZXREZWZhdWx0VGVtcGxhdGVBbm5vdGF0aW9uUGF0aCgpO1xuXHRjb25zdCBzZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50ID0gZ2V0U2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudChlbnRpdHlUeXBlLCBhbm5vdGF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCk7XG5cdGlmIChhbm5vdGF0aW9uUGF0aCAmJiBzZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50KSB7XG5cdFx0Y29uc3QgcHJlc2VudGF0aW9uVmFyaWFudCA9IHNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQuUHJlc2VudGF0aW9uVmFyaWFudDtcblx0XHRpZiAoIXByZXNlbnRhdGlvblZhcmlhbnQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlByZXNlbnRhdGlvbiBWYXJpYW50IGlzIG5vdCBjb25maWd1cmVkIGluIHRoZSBTUFYgbWVudGlvbmVkIGluIHRoZSBtYW5pZmVzdFwiKTtcblx0XHR9XG5cdFx0Y29uc3QgYlBWQ29tcGxhaW50ID0gaXNQcmVzZW50YXRpb25Db21wbGlhbnQoc2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudC5QcmVzZW50YXRpb25WYXJpYW50KTtcblx0XHRpZiAoIWJQVkNvbXBsYWludCkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0aWYgKGlzU2VsZWN0aW9uUHJlc2VudGF0aW9uQ29tcGxpYW50KHNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQsIGJJc0FMUCkpIHtcblx0XHRcdHJldHVybiBzZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50O1xuXHRcdH1cblx0fVxuXHRpZiAoc2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudCkge1xuXHRcdGlmIChpc1NlbGVjdGlvblByZXNlbnRhdGlvbkNvbXBsaWFudChzZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50LCBiSXNBTFApKSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudDtcblx0XHR9XG5cdH1cblx0Y29uc3QgcHJlc2VudGF0aW9uVmFyaWFudCA9IGdldERlZmF1bHRQcmVzZW50YXRpb25WYXJpYW50KGVudGl0eVR5cGUpO1xuXHRpZiAocHJlc2VudGF0aW9uVmFyaWFudCkge1xuXHRcdGlmIChpc1ByZXNlbnRhdGlvbkNvbXBsaWFudChwcmVzZW50YXRpb25WYXJpYW50LCBiSXNBTFApKSB7XG5cdFx0XHRyZXR1cm4gcHJlc2VudGF0aW9uVmFyaWFudDtcblx0XHR9XG5cdH1cblx0aWYgKCFiSXNBTFApIHtcblx0XHRjb25zdCBkZWZhdWx0TGluZUl0ZW0gPSBnZXREZWZhdWx0TGluZUl0ZW0oZW50aXR5VHlwZSk7XG5cdFx0aWYgKGRlZmF1bHRMaW5lSXRlbSkge1xuXHRcdFx0cmV0dXJuIGRlZmF1bHRMaW5lSXRlbTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuY29uc3QgZ2V0VmlldyA9IGZ1bmN0aW9uKHZpZXdDb252ZXJ0ZXJDb25maWd1cmF0aW9uOiBWaWV3Q29udmVydGVyU2V0dGluZ3MpOiBMaXN0UmVwb3J0Vmlld0RlZmluaXRpb24ge1xuXHRjb25zdCBjb25maWcgPSB2aWV3Q29udmVydGVyQ29uZmlndXJhdGlvbjtcblx0bGV0IGNvbnZlcnRlckNvbnRleHQgPSBjb25maWcuY29udmVydGVyQ29udGV4dDtcblx0Y29uc3QgcHJlc2VudGF0aW9uOiBEYXRhVmlzdWFsaXphdGlvbkRlZmluaXRpb24gPSBnZXREYXRhVmlzdWFsaXphdGlvbkNvbmZpZ3VyYXRpb24oXG5cdFx0Y29uZmlnLmFubm90YXRpb25cblx0XHRcdD8gY29udmVydGVyQ29udGV4dC5nZXRSZWxhdGl2ZUFubm90YXRpb25QYXRoKGNvbmZpZy5hbm5vdGF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSwgY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCkpXG5cdFx0XHQ6IFwiXCIsXG5cdFx0dHJ1ZSxcblx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdCk7XG5cdGxldCB0YWJsZUNvbnRyb2xJZCA9IFwiXCI7XG5cdGxldCBjaGFydENvbnRyb2xJZCA9IFwiXCI7XG5cdGxldCB0aXRsZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gXCJcIjtcblx0bGV0IHNlbGVjdGlvblZhcmlhbnRQYXRoID0gXCJcIjtcblx0Y29uc3QgaXNNdWx0aXBsZVZpZXdDb25maWd1cmF0aW9uID0gZnVuY3Rpb24oY29uZmlnOiBWaWV3Q29uZmlndXJhdGlvbik6IGNvbmZpZyBpcyBNdWx0aXBsZVZpZXdDb25maWd1cmF0aW9uIHtcblx0XHRyZXR1cm4gKGNvbmZpZyBhcyBNdWx0aXBsZVZpZXdDb25maWd1cmF0aW9uKS5rZXkgIT09IHVuZGVmaW5lZDtcblx0fTtcblxuXHRpZiAoaXNNdWx0aXBsZVZpZXdDb25maWd1cmF0aW9uKGNvbmZpZykpIHtcblx0XHQvLyBrZXkgZXhpc3RzIG9ubHkgb24gbXVsdGkgdGFibGVzIG1vZGVcblx0XHRjb25zdCByZXNvbHZlZFRhcmdldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZUFubm90YXRpb24oY29uZmlnLmFubm90YXRpb25QYXRoKTtcblx0XHRjb25zdCB2aWV3QW5ub3RhdGlvbjogVmlld0Fubm90YXRpb25zVHlwZVR5cGVzID0gcmVzb2x2ZWRUYXJnZXQuYW5ub3RhdGlvbiBhcyBWaWV3QW5ub3RhdGlvbnNUeXBlVHlwZXM7XG5cdFx0Y29udmVydGVyQ29udGV4dCA9IHJlc29sdmVkVGFyZ2V0LmNvbnZlcnRlckNvbnRleHQ7XG5cdFx0dGl0bGUgPSBjb21waWxlQmluZGluZyhhbm5vdGF0aW9uRXhwcmVzc2lvbih2aWV3QW5ub3RhdGlvbi5UZXh0KSk7XG5cdFx0LyoqXG5cdFx0ICogTmVlZCB0byBsb29wIG9uIHZpZXdzIGFuZCBtb3JlIHByZWNpc2VseSB0byB0YWJsZSBpbnRvIHZpZXdzIHNpbmNlXG5cdFx0ICogbXVsdGkgdGFibGUgbW9kZSBnZXQgc3BlY2lmaWMgY29uZmlndWF0aW9uIChoaWRkZW4gZmlsdGVycyBvciBUYWJsZSBJZClcblx0XHQgKi9cblx0XHRwcmVzZW50YXRpb24udmlzdWFsaXphdGlvbnMuZm9yRWFjaCgodmlzdWFsaXphdGlvbkRlZmluaXRpb24sIGluZGV4KSA9PiB7XG5cdFx0XHRzd2l0Y2ggKHZpc3VhbGl6YXRpb25EZWZpbml0aW9uLnR5cGUpIHtcblx0XHRcdFx0Y2FzZSBWaXN1YWxpemF0aW9uVHlwZS5UYWJsZTpcblx0XHRcdFx0XHRjb25zdCB0YWJsZVZpc3VhbGl6YXRpb24gPSBwcmVzZW50YXRpb24udmlzdWFsaXphdGlvbnNbaW5kZXhdIGFzIFRhYmxlVmlzdWFsaXphdGlvbjtcblx0XHRcdFx0XHRjb25zdCBmaWx0ZXJzID0gdGFibGVWaXN1YWxpemF0aW9uLmNvbnRyb2wuZmlsdGVycyB8fCB7fTtcblx0XHRcdFx0XHRmaWx0ZXJzLmhpZGRlbkZpbHRlcnMgPSBmaWx0ZXJzLmhpZGRlbkZpbHRlcnMgfHwgeyBwYXRoczogW10gfTtcblx0XHRcdFx0XHRpZiAoIWNvbmZpZy5rZWVwUHJldmlvdXNQcmVzb25hbGl6YXRpb24pIHtcblx0XHRcdFx0XHRcdC8vIE5lZWQgdG8gb3ZlcnJpZGUgVGFibGUgSWQgdG8gbWF0Y2ggd2l0aCBUYWIgS2V5IChjdXJyZW50bHkgb25seSB0YWJsZSBpcyBtYW5hZ2VkIGluIG11bHRpcGxlIHZpZXcgbW9kZSlcblx0XHRcdFx0XHRcdHRhYmxlVmlzdWFsaXphdGlvbi5hbm5vdGF0aW9uLmlkID0gVGFibGVJRChjb25maWcua2V5LCBcIkxpbmVJdGVtXCIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChjb25maWcgJiYgY29uZmlnLmFubm90YXRpb24gJiYgY29uZmlnLmFubm90YXRpb24udGVybSA9PT0gVUlBbm5vdGF0aW9uVGVybXMuU2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudCkge1xuXHRcdFx0XHRcdFx0c2VsZWN0aW9uVmFyaWFudFBhdGggPSAoY29uZmlnLmFubm90YXRpb24gYXMgU2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcykuU2VsZWN0aW9uVmFyaWFudC5mdWxseVF1YWxpZmllZE5hbWUuc3BsaXQoXG5cdFx0XHRcdFx0XHRcdFwiQFwiXG5cdFx0XHRcdFx0XHQpWzFdO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzZWxlY3Rpb25WYXJpYW50UGF0aCA9IGNvbmZpZy5hbm5vdGF0aW9uUGF0aDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogUHJvdmlkZSBTZWxlY3Rpb24gVmFyaWFudCB0byBoaWRkZW5GaWx0ZXJzIGluIG9yZGVyIHRvIHNldCB0aGUgU1YgZmlsdGVycyB0byB0aGUgdGFibGVcblx0XHRcdFx0XHQgKiBNREMgVGFibGUgb3ZlcnJpZGUgT2JpbmRpbmcgRml0bGVyIGFuZCBmcm9tIFNBUCBGRSB0aGUgb25seSBtZXRob2Qgd2hlcmUgd2UgYXJlIGFibGUgdG8gYWRkXG5cdFx0XHRcdFx0ICogYWRkaXRpb25uYWwgZmlsdGVyIGlzICdyZWJpbmRUYWJsZScgaW50byBUYWJsZSBkZWxlZ2F0ZVxuXHRcdFx0XHRcdCAqIEluIG9yZGVyIHRvIGF2b2lkIGltcGxlbWVudGluZyBzcGVjaWZpYyBMUiBmZWF0dXJlIHRvIFNBUCBGRSBNYWNybyBUYWJsZSwgdGhlIGZpbHRlcihzKSByZWxhdGVkXG5cdFx0XHRcdFx0ICogdG8gdGhlIFRhYiAobXVsdGkgdGFibGUgbW9kZSkgY2FuIGJlIHBhc3NlZCB0byBtYWNybyB0YWJsZSB2aWEgcGFyYW1ldGVyL2NvbnRleHQgbmFtZWQgZml0bGVyc1xuXHRcdFx0XHRcdCAqIGFuZCBrZXkgaGlkZGVuRmlsdGVyc1xuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGZpbHRlcnMuaGlkZGVuRmlsdGVycy5wYXRocy5wdXNoKHsgYW5ub3RhdGlvblBhdGg6IHNlbGVjdGlvblZhcmlhbnRQYXRoIH0pO1xuXHRcdFx0XHRcdHRhYmxlVmlzdWFsaXphdGlvbi5jb250cm9sLmZpbHRlcnMgPSBmaWx0ZXJzO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFZpc3VhbGl6YXRpb25UeXBlLkNoYXJ0OlxuXHRcdFx0XHRcdC8vIE5vdCBjdXJyZW50bHkgbWFuYWdlZFxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cHJlc2VudGF0aW9uLnZpc3VhbGl6YXRpb25zLmZvckVhY2godmlzdWFsaXphdGlvbkRlZmluaXRpb24gPT4ge1xuXHRcdGlmICh2aXN1YWxpemF0aW9uRGVmaW5pdGlvbi50eXBlID09PSBWaXN1YWxpemF0aW9uVHlwZS5UYWJsZSkge1xuXHRcdFx0dGFibGVDb250cm9sSWQgPSB2aXN1YWxpemF0aW9uRGVmaW5pdGlvbi5hbm5vdGF0aW9uLmlkO1xuXHRcdH0gZWxzZSBpZiAodmlzdWFsaXphdGlvbkRlZmluaXRpb24udHlwZSA9PT0gVmlzdWFsaXphdGlvblR5cGUuQ2hhcnQpIHtcblx0XHRcdGNoYXJ0Q29udHJvbElkID0gdmlzdWFsaXphdGlvbkRlZmluaXRpb24uaWQ7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIHtcblx0XHRwcmVzZW50YXRpb24sXG5cdFx0dGFibGVDb250cm9sSWQsXG5cdFx0Y2hhcnRDb250cm9sSWQsXG5cdFx0ZW50aXR5U2V0OiBcIi9cIiArIHZpZXdDb252ZXJ0ZXJDb25maWd1cmF0aW9uLmVudGl0eVNldC5uYW1lLFxuXHRcdHRpdGxlLFxuXHRcdHNlbGVjdGlvblZhcmlhbnRQYXRoXG5cdH07XG59O1xuXG5jb25zdCBnZXRWaWV3cyA9IGZ1bmN0aW9uKFxuXHRlbnRpdHlTZXQ6IEVudGl0eVNldCxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0c2V0dGluZ3NWaWV3czogTXVsdGlwbGVWaWV3c0NvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWRcbik6IExpc3RSZXBvcnRWaWV3RGVmaW5pdGlvbltdIHtcblx0bGV0IHZpZXdDb252ZXJ0ZXJDb25maWdzOiBWaWV3Q29udmVydGVyU2V0dGluZ3NbXSA9IFtdO1xuXHRpZiAoc2V0dGluZ3NWaWV3cykge1xuXHRcdHNldHRpbmdzVmlld3MucGF0aHMuZm9yRWFjaChwYXRoID0+IHtcblx0XHRcdGNvbnN0IHZpZXdFbnRpdHlTZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmZpbmRFbnRpdHlTZXQocGF0aC5lbnRpdHlTZXQpO1xuXHRcdFx0Y29uc3QgYW5ub3RhdGlvblBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmdldERlZmF1bHRUZW1wbGF0ZUFubm90YXRpb25QYXRoKCk7XG5cdFx0XHRsZXQgYW5ub3RhdGlvbjtcblx0XHRcdGlmICh2aWV3RW50aXR5U2V0KSB7XG5cdFx0XHRcdGNvbnN0IHZpZXdDb252ZXJ0ZXJDb250ZXh0ID0gY29udmVydGVyQ29udGV4dC5nZXRDb252ZXJ0ZXJDb250ZXh0Rm9yKHZpZXdFbnRpdHlTZXQpO1xuXHRcdFx0XHRjb25zdCByZXNvbHZlZFRhcmdldCA9IHZpZXdDb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGVBbm5vdGF0aW9uKHBhdGguYW5ub3RhdGlvblBhdGgpO1xuXHRcdFx0XHRjb25zdCB0YXJnZXRBbm5vdGF0aW9uID0gcmVzb2x2ZWRUYXJnZXQuYW5ub3RhdGlvbiBhcyBEYXRhVmlzdWFsaXphdGlvbkFubm90YXRpb25zO1xuXHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0ID0gcmVzb2x2ZWRUYXJnZXQuY29udmVydGVyQ29udGV4dDtcblx0XHRcdFx0aWYgKHRhcmdldEFubm90YXRpb24pIHtcblx0XHRcdFx0XHRpZiAodGFyZ2V0QW5ub3RhdGlvbi50ZXJtID09PSBVSUFubm90YXRpb25UZXJtcy5TZWxlY3Rpb25WYXJpYW50KSB7XG5cdFx0XHRcdFx0XHRpZiAoYW5ub3RhdGlvblBhdGgpIHtcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbiA9IGdldFNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQodmlld0VudGl0eVNldC5lbnRpdHlUeXBlLCBhbm5vdGF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uID0gZ2V0RGVmYXVsdExpbmVJdGVtKHZpZXdFbnRpdHlTZXQuZW50aXR5VHlwZSkgYXMgTGluZUl0ZW07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFubm90YXRpb24gPSB0YXJnZXRBbm5vdGF0aW9uO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2aWV3Q29udmVydGVyQ29uZmlncy5wdXNoKHtcblx0XHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQ6IHZpZXdDb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0XHRcdFx0ZW50aXR5U2V0OiB2aWV3RW50aXR5U2V0LFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbixcblx0XHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBwYXRoLmFubm90YXRpb25QYXRoLFxuXHRcdFx0XHRcdFx0a2VlcFByZXZpb3VzUHJlc29uYWxpemF0aW9uOiBwYXRoLmtlZXBQcmV2aW91c1ByZXNvbmFsaXphdGlvbixcblx0XHRcdFx0XHRcdGtleTogcGF0aC5rZXlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gVE9ETyBEaWFnbm9zdGljcyBtZXNzYWdlXG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgZW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXHRcdGlmIChjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlKSB7XG5cdFx0XHR2aWV3Q29udmVydGVyQ29uZmlncyA9IGdldEFscFZpZXdDb25maWcoZW50aXR5U2V0LCBjb252ZXJ0ZXJDb250ZXh0LCB2aWV3Q29udmVydGVyQ29uZmlncyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZpZXdDb252ZXJ0ZXJDb25maWdzLnB1c2goe1xuXHRcdFx0XHRhbm5vdGF0aW9uOiBnZXRDb21wbGlhbnRWaXN1YWxpemF0aW9uQW5ub3RhdGlvbihlbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0LCBmYWxzZSksXG5cdFx0XHRcdGVudGl0eVNldCxcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dDogY29udmVydGVyQ29udGV4dFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB2aWV3Q29udmVydGVyQ29uZmlncy5tYXAodmlld0NvbnZlcnRlckNvbmZpZyA9PiB7XG5cdFx0cmV0dXJuIGdldFZpZXcodmlld0NvbnZlcnRlckNvbmZpZyk7XG5cdH0pO1xufTtcbmZ1bmN0aW9uIGdldEFscFZpZXdDb25maWcoXG5cdGVudGl0eVNldDogRW50aXR5U2V0LFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHR2aWV3Q29uZmlnczogVmlld0NvbnZlcnRlclNldHRpbmdzW11cbik6IFZpZXdDb252ZXJ0ZXJTZXR0aW5nc1tdIHtcblx0Y29uc3QgYW5ub3RhdGlvbiA9IGdldENvbXBsaWFudFZpc3VhbGl6YXRpb25Bbm5vdGF0aW9uKGVudGl0eVNldC5lbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0LCB0cnVlKTtcblx0bGV0IGNoYXJ0LCB0YWJsZTtcblx0aWYgKGFubm90YXRpb24pIHtcblx0XHR2aWV3Q29uZmlncy5wdXNoKHtcblx0XHRcdGVudGl0eVNldCxcblx0XHRcdGFubm90YXRpb246IGFubm90YXRpb24sXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0Y2hhcnQgPSBnZXREZWZhdWx0Q2hhcnQoZW50aXR5U2V0LmVudGl0eVR5cGUpO1xuXHRcdHRhYmxlID0gZ2V0RGVmYXVsdExpbmVJdGVtKGVudGl0eVNldC5lbnRpdHlUeXBlKTtcblx0XHRpZiAoY2hhcnQpIHtcblx0XHRcdHZpZXdDb25maWdzLnB1c2goe1xuXHRcdFx0XHRlbnRpdHlTZXQsXG5cdFx0XHRcdGFubm90YXRpb246IGNoYXJ0LFxuXHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0aWYgKHRhYmxlKSB7XG5cdFx0XHR2aWV3Q29uZmlncy5wdXNoKHtcblx0XHRcdFx0ZW50aXR5U2V0LFxuXHRcdFx0XHRhbm5vdGF0aW9uOiB0YWJsZSxcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB2aWV3Q29uZmlncztcbn1cblxuLyoqXG4gKiBDcmVhdGUgdGhlIExpc3RSZXBvcnREZWZpbml0aW9uIGZvciB0aGUgbXVsdGkgZW50aXR5U2V0cyAobXVsdGkgdGFibGUgaW5zdGFuY2VzKS5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHJldHVybnMge0xpc3RSZXBvcnREZWZpbml0aW9ufSB0aGUgbGlzdCByZXBvcnQgZGVmaW5pdGlvbiBiYXNlZCBvbiBhbm5vdGF0aW9uICsgbWFuaWZlc3RcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbnZlcnRQYWdlID0gZnVuY3Rpb24oY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IExpc3RSZXBvcnREZWZpbml0aW9uIHtcblx0Y29uc3QgdGVtcGxhdGVUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKTtcblx0Y29uc3QgZW50aXR5U2V0ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKTtcblx0aWYgKCFlbnRpdHlTZXQpIHtcblx0XHQvLyBJZiB3ZSBkb24ndCBoYXZlIGFuIGVudGl0eVNldCBhdCB0aGlzIHBvaW50IHdlIGhhdmUgYW4gaXNzdWUgSSdkIHNheVxuXHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFwiQW4gRW50aXR5c2V0IGlzIHJlcXVpcmVkIHRvIGJlIGFibGUgdG8gZGlzcGxheSBhIExpc3RSZXBvcnQsIHBsZWFzZSBhZGp1c3QgeW91ciBgZW50aXR5U2V0YCBwcm9wZXJ0eSB0byBwb2ludCB0byBvbmUuXCJcblx0XHQpO1xuXHR9XG5cdGNvbnN0IG1hbmlmZXN0V3JhcHBlciA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCk7XG5cdGNvbnN0IHZpZXdzRGVmaW5pdGlvbjogTXVsdGlwbGVWaWV3c0NvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWQgPSBtYW5pZmVzdFdyYXBwZXIuZ2V0Vmlld0NvbmZpZ3VyYXRpb24oKTtcblx0Y29uc3QgaGFzTXVsdGlwbGVFbnRpdHlTZXRzID0gbWFuaWZlc3RXcmFwcGVyLmhhc011bHRpcGxlRW50aXR5U2V0cygpO1xuXHRjb25zdCB2aWV3czogTGlzdFJlcG9ydFZpZXdEZWZpbml0aW9uW10gPSBnZXRWaWV3cyhlbnRpdHlTZXQsIGNvbnZlcnRlckNvbnRleHQsIHZpZXdzRGVmaW5pdGlvbik7XG5cdGNvbnN0IHNob3dUYWJDb3VudHMgPSB2aWV3c0RlZmluaXRpb24gPyB2aWV3c0RlZmluaXRpb24/LnNob3dDb3VudHMgfHwgaGFzTXVsdGlwbGVFbnRpdHlTZXRzIDogdW5kZWZpbmVkOyAvLyB3aXRoIG11bHRpIEVudGl0eVNldHMsIHRhYiBjb3VudHMgYXJlIGRpc3BsYXllZCBieSBkZWZhdWx0XG5cblx0bGV0IHNpbmdsZVRhYmxlSWQgPSBcIlwiO1xuXHRsZXQgc2luZ2xlQ2hhcnRJZCA9IFwiXCI7XG5cdGxldCBiRml0Q29udGVudCA9IGZhbHNlO1xuXHQvLyBGZXRjaCBhbGwgc2VsZWN0aW9uVmFyaWFudHMgZGVmaW5lZCBpbiB0aGUgZGlmZmVyZW50IHZpc3VhbGl6YXRpb25zIGFuZCBkaWZmZXJlbnQgdmlld3MgKG11bHRpIHRhYmxlIG1vZGUpXG5cdGNvbnN0IHNlbGVjdGlvblZhcmlhbnRDb25maWdzOiBTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbltdID0gW107XG5cdGNvbnN0IHNlbGVjdGlvblZhcmlhbnRQYXRoczogc3RyaW5nW10gPSBbXTtcblx0Y29uc3QgZmlsdGVyQmFySWQgPSBGaWx0ZXJCYXJJRChlbnRpdHlTZXQubmFtZSk7XG5cdGNvbnN0IGZpbHRlclZhcmlhbnRNYW5hZ2VtZW50SUQgPSBGaWx0ZXJWYXJpYW50TWFuYWdlbWVudElEKGZpbHRlckJhcklkKTtcblx0Y29uc3QgdGFyZ2V0Q29udHJvbElkcyA9IFtmaWx0ZXJCYXJJZF07XG5cdGNvbnN0IGZiQ29uZmlnID0gbWFuaWZlc3RXcmFwcGVyLmdldEZpbHRlckNvbmZpZ3VyYXRpb24oKTtcblx0Y29uc3QgdXNlU2VtYW50aWNEYXRlUmFuZ2UgPSBmYkNvbmZpZy51c2VTZW1hbnRpY0RhdGVSYW5nZSAhPT0gdW5kZWZpbmVkID8gZmJDb25maWcudXNlU2VtYW50aWNEYXRlUmFuZ2UgOiB0cnVlO1xuXG5cdHZpZXdzLmZvckVhY2godmlldyA9PiB7XG5cdFx0dmlldy5wcmVzZW50YXRpb24udmlzdWFsaXphdGlvbnMuZm9yRWFjaCh2aXN1YWxpemF0aW9uRGVmaW5pdGlvbiA9PiB7XG5cdFx0XHRpZiAodmlzdWFsaXphdGlvbkRlZmluaXRpb24udHlwZSA9PT0gVmlzdWFsaXphdGlvblR5cGUuVGFibGUpIHtcblx0XHRcdFx0Y29uc3QgdGFibGVGaWx0ZXJzID0gdmlzdWFsaXphdGlvbkRlZmluaXRpb24uY29udHJvbC5maWx0ZXJzO1xuXHRcdFx0XHRmb3IgKGNvbnN0IGtleSBpbiB0YWJsZUZpbHRlcnMpIHtcblx0XHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheSh0YWJsZUZpbHRlcnNba2V5XS5wYXRocykpIHtcblx0XHRcdFx0XHRcdGNvbnN0IHBhdGhzID0gdGFibGVGaWx0ZXJzW2tleV0ucGF0aHM7XG5cdFx0XHRcdFx0XHRwYXRocy5mb3JFYWNoKHBhdGggPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAocGF0aCAmJiBwYXRoLmFubm90YXRpb25QYXRoICYmIHNlbGVjdGlvblZhcmlhbnRQYXRocy5pbmRleE9mKHBhdGguYW5ub3RhdGlvblBhdGgpID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdHNlbGVjdGlvblZhcmlhbnRQYXRocy5wdXNoKHBhdGguYW5ub3RhdGlvblBhdGgpO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHNlbGVjdGlvblZhcmlhbnRDb25maWcgPSBnZXRTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbihwYXRoLmFubm90YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2VsZWN0aW9uVmFyaWFudENvbmZpZykge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VsZWN0aW9uVmFyaWFudENvbmZpZ3MucHVzaChzZWxlY3Rpb25WYXJpYW50Q29uZmlnKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0YXJnZXRDb250cm9sSWRzLnB1c2godmlzdWFsaXphdGlvbkRlZmluaXRpb24uYW5ub3RhdGlvbi5pZCk7XG5cdFx0XHRcdGlmICh2aXN1YWxpemF0aW9uRGVmaW5pdGlvbi5jb250cm9sLnR5cGUgPT09IFwiR3JpZFRhYmxlXCIpIHtcblx0XHRcdFx0XHRiRml0Q29udGVudCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cdGNvbnN0IG9Db25maWcgPSBnZXRDb250ZW50QXJlYUlkKHRlbXBsYXRlVHlwZSwgdmlld3MpO1xuXHRpZiAob0NvbmZpZykge1xuXHRcdHNpbmdsZUNoYXJ0SWQgPSBvQ29uZmlnLmNoYXJ0SWQ7XG5cdFx0c2luZ2xlVGFibGVJZCA9IG9Db25maWcudGFibGVJZDtcblx0fVxuXHRjb25zdCBhbm5vdGF0aW9uU2VsZWN0aW9uRmllbGRzID0gZ2V0U2VsZWN0aW9uRmllbGRzKGVudGl0eVNldCwgc2VsZWN0aW9uVmFyaWFudENvbmZpZ3MsIGNvbnZlcnRlckNvbnRleHQpO1xuXHRjb25zdCBzZWxlY3Rpb25GaWVsZHMgPSBpbnNlcnRDdXN0b21FbGVtZW50cyhhbm5vdGF0aW9uU2VsZWN0aW9uRmllbGRzLCBnZXRNYW5pZmVzdEZpbHRlckZpZWxkcyhlbnRpdHlTZXQsIGNvbnZlcnRlckNvbnRleHQpLCB7XG5cdFx0XCJhdmFpbGFiaWxpdHlcIjogXCJvdmVyd3JpdGVcIixcblx0XHRsYWJlbDogXCJvdmVyd3JpdGVcIixcblx0XHRwb3NpdGlvbjogXCJvdmVyd3JpdGVcIixcblx0XHR0ZW1wbGF0ZTogXCJvdmVyd3JpdGVcIixcblx0XHRzZXR0aW5nczogXCJvdmVyd3JpdGVcIlxuXHR9KTtcblx0Y29uc3QgZmlsdGVyQ29uZGl0aW9ucyA9IEpTT04uc3RyaW5naWZ5KGdldEZpbHRlckNvbmRpdGlvbnMoZW50aXR5U2V0LmVudGl0eVR5cGUsIGNvbnZlcnRlckNvbnRleHQpKTtcblxuXHQvLyBTb3J0IGhlYWRlciBhY3Rpb25zIGFjY29yZGluZyB0byBwb3NpdGlvbiBhdHRyaWJ1dGVzIGluIG1hbmlmZXN0XG5cdGNvbnN0IGhlYWRlckFjdGlvbnMgPSBpbnNlcnRDdXN0b21FbGVtZW50cyhbXSwgZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdChtYW5pZmVzdFdyYXBwZXIuZ2V0SGVhZGVyQWN0aW9ucygpLCBjb252ZXJ0ZXJDb250ZXh0KSk7XG5cblx0cmV0dXJuIHtcblx0XHRtYWluRW50aXR5U2V0OiBcIi9cIiArIGVudGl0eVNldC5uYW1lLFxuXHRcdHNpbmdsZVRhYmxlSWQsXG5cdFx0c2luZ2xlQ2hhcnRJZCxcblx0XHRzaG93VGFiQ291bnRzLFxuXHRcdGhlYWRlckFjdGlvbnMsXG5cdFx0c2VsZWN0aW9uRmllbGRzLFxuXHRcdHZpZXdzOiB2aWV3cyxcblx0XHRmaWx0ZXJCYXJJZCxcblx0XHRmaWx0ZXJDb25kaXRpb25zLFxuXHRcdHZhcmlhbnRNYW5hZ2VtZW50OiB7XG5cdFx0XHRpZDogZmlsdGVyVmFyaWFudE1hbmFnZW1lbnRJRCxcblx0XHRcdHRhcmdldENvbnRyb2xJZHM6IHRhcmdldENvbnRyb2xJZHMuam9pbihcIixcIilcblx0XHR9LFxuXHRcdGZpdENvbnRlbnQ6IGJGaXRDb250ZW50LFxuXHRcdGlzTXVsdGlFbnRpdHlTZXRzOiBoYXNNdWx0aXBsZUVudGl0eVNldHMsXG5cdFx0aXNBbHA6IGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5BbmFseXRpY2FsTGlzdFBhZ2UsXG5cdFx0dXNlU2VtYW50aWNEYXRlUmFuZ2Vcblx0fTtcbn07XG5cbmZ1bmN0aW9uIGdldENvbnRlbnRBcmVhSWQodGVtcGxhdGVUeXBlOiBUZW1wbGF0ZVR5cGUsIHZpZXdzOiBMaXN0UmVwb3J0Vmlld0RlZmluaXRpb25bXSk6IENvbnRlbnRBcmVhSUQgfCB1bmRlZmluZWQge1xuXHRsZXQgc2luZ2xlVGFibGVJZCA9IFwiXCIsXG5cdFx0c2luZ2xlQ2hhcnRJZCA9IFwiXCI7XG5cdGlmICh2aWV3cy5sZW5ndGggPT09IDEpIHtcblx0XHRzaW5nbGVUYWJsZUlkID0gdmlld3NbMF0udGFibGVDb250cm9sSWQ7XG5cdFx0c2luZ2xlQ2hhcnRJZCA9IHZpZXdzWzBdLmNoYXJ0Q29udHJvbElkO1xuXHR9IGVsc2UgaWYgKHRlbXBsYXRlVHlwZSA9PT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZSAmJiB2aWV3cy5sZW5ndGggPT09IDIpIHtcblx0XHR2aWV3cy5tYXAob1ZpZXcgPT4ge1xuXHRcdFx0aWYgKG9WaWV3LmNoYXJ0Q29udHJvbElkKSB7XG5cdFx0XHRcdHNpbmdsZUNoYXJ0SWQgPSBvVmlldy5jaGFydENvbnRyb2xJZDtcblx0XHRcdH0gZWxzZSBpZiAob1ZpZXcudGFibGVDb250cm9sSWQpIHtcblx0XHRcdFx0c2luZ2xlVGFibGVJZCA9IG9WaWV3LnRhYmxlQ29udHJvbElkO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdGlmIChzaW5nbGVUYWJsZUlkIHx8IHNpbmdsZUNoYXJ0SWQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2hhcnRJZDogc2luZ2xlQ2hhcnRJZCxcblx0XHRcdHRhYmxlSWQ6IHNpbmdsZVRhYmxlSWRcblx0XHR9O1xuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG4iXX0=