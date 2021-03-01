sap.ui.define(["sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/ID", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/Key", "../Common/Form", "sap/fe/core/converters/annotations/DataField"], function (ConfigurableObject, ID, BindingExpression, Key, Form, DataField) {
  "use strict";

  var _exports = {};
  var getSemanticObjectPath = DataField.getSemanticObjectPath;
  var getFormElementsFromManifest = Form.getFormElementsFromManifest;
  var FormElementType = Form.FormElementType;
  var KeyHelper = Key.KeyHelper;
  var not = BindingExpression.not;
  var equal = BindingExpression.equal;
  var compileBinding = BindingExpression.compileBinding;
  var annotationExpression = BindingExpression.annotationExpression;
  var HeaderFacetID = ID.HeaderFacetID;
  var HeaderFacetFormID = ID.HeaderFacetFormID;
  var HeaderFacetContainerID = ID.HeaderFacetContainerID;
  var CustomHeaderFacetID = ID.CustomHeaderFacetID;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Definitions: Header Facet Types, Generic OP Header Facet, Manifest Properties for Custom Header Facet
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var HeaderFacetType;

  (function (HeaderFacetType) {
    HeaderFacetType["Annotation"] = "Annotation";
    HeaderFacetType["XMLFragment"] = "XMLFragment";
  })(HeaderFacetType || (HeaderFacetType = {}));

  _exports.HeaderFacetType = HeaderFacetType;
  var FacetType;

  (function (FacetType) {
    FacetType["Reference"] = "Reference";
    FacetType["Collection"] = "Collection";
  })(FacetType || (FacetType = {}));

  _exports.FacetType = FacetType;
  var FlexDesignTimeType;

  (function (FlexDesignTimeType) {
    FlexDesignTimeType["Default"] = "Default";
    FlexDesignTimeType["NotAdaptable"] = "not-adaptable";
    FlexDesignTimeType["NotAdaptableTree"] = "not-adaptable-tree";
    FlexDesignTimeType["NotAdaptableVisibility"] = "not-adaptable-visibility";
  })(FlexDesignTimeType || (FlexDesignTimeType = {}));

  _exports.FlexDesignTimeType = FlexDesignTimeType;
  var HeaderDataPointType;

  (function (HeaderDataPointType) {
    HeaderDataPointType["ProgressIndicator"] = "ProgressIndicator";
    HeaderDataPointType["RatingIndicator"] = "RatingIndicator";
    HeaderDataPointType["Content"] = "Content";
  })(HeaderDataPointType || (HeaderDataPointType = {}));

  var TargetAnnotationType;

  (function (TargetAnnotationType) {
    TargetAnnotationType["None"] = "None";
    TargetAnnotationType["DataPoint"] = "DataPoint";
    TargetAnnotationType["Chart"] = "Chart";
    TargetAnnotationType["Identification"] = "Identification";
    TargetAnnotationType["Contact"] = "Contact";
    TargetAnnotationType["Address"] = "Address";
    TargetAnnotationType["FieldGroup"] = "FieldGroup";
  })(TargetAnnotationType || (TargetAnnotationType = {}));

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Collect All Header Facets: Custom (via Manifest) and Annotation Based (via Metamodel)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Retrieve header facets from annotations.
   *
   * @param {ConverterContext} converterContext for this object
   *
   * @returns {ObjectPageHeaderFacet} header facets from annotations
   */
  function getHeaderFacetsFromAnnotations(converterContext) {
    var _converterContext$get, _converterContext$get2, _converterContext$get3;

    var headerFacets = [];
    (_converterContext$get = converterContext.getEntityType().annotations) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.UI) === null || _converterContext$get2 === void 0 ? void 0 : (_converterContext$get3 = _converterContext$get2.HeaderFacets) === null || _converterContext$get3 === void 0 ? void 0 : _converterContext$get3.forEach(function (facet) {
      var headerFacet = createHeaderFacet(facet, converterContext);

      if (headerFacet) {
        headerFacets.push(headerFacet);
      }
    });
    return headerFacets;
  }
  /**
   * Retrieve custom header facets from manifest.
   *
   * @param {ConfigurableRecord<ManifestHeaderFacet>} manifestCustomHeaderFacets settings for this object
   *
   * @returns {Record<string, CustomObjectPageHeaderFacet>} header facets from manifest
   */


  _exports.getHeaderFacetsFromAnnotations = getHeaderFacetsFromAnnotations;

  function getHeaderFacetsFromManifest(manifestCustomHeaderFacets) {
    var customHeaderFacets = {};
    Object.keys(manifestCustomHeaderFacets).forEach(function (manifestHeaderFacetKey) {
      var customHeaderFacet = manifestCustomHeaderFacets[manifestHeaderFacetKey];
      customHeaderFacets[manifestHeaderFacetKey] = createCustomHeaderFacet(customHeaderFacet, manifestHeaderFacetKey);
    });
    return customHeaderFacets;
  }

  _exports.getHeaderFacetsFromManifest = getHeaderFacetsFromManifest;

  function getDesignTimeMetadata(facetDefinition, collectionFacetDefinition, converterContext) {
    var designTimeMetadata = FlexDesignTimeType.Default;
    var headerFacetID = facetDefinition.ID; // For HeaderFacets nested inside CollectionFacet RTA should be disabled, therefore set to "not-adaptable-tree"

    if (facetDefinition.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet" && collectionFacetDefinition.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet") {
      designTimeMetadata = FlexDesignTimeType.NotAdaptableTree;
    } else {
      var headerFacetsControlConfig = converterContext.getManifestControlConfiguration("@com.sap.vocabularies.UI.v1.HeaderFacets");

      if (headerFacetID) {
        var _headerFacetsControlC, _headerFacetsControlC2, _headerFacetsControlC3;

        var designTime = headerFacetsControlConfig === null || headerFacetsControlConfig === void 0 ? void 0 : (_headerFacetsControlC = headerFacetsControlConfig.facets) === null || _headerFacetsControlC === void 0 ? void 0 : (_headerFacetsControlC2 = _headerFacetsControlC[headerFacetID]) === null || _headerFacetsControlC2 === void 0 ? void 0 : (_headerFacetsControlC3 = _headerFacetsControlC2.flexSettings) === null || _headerFacetsControlC3 === void 0 ? void 0 : _headerFacetsControlC3.designtime;

        switch (designTime) {
          case FlexDesignTimeType.NotAdaptable:
          case FlexDesignTimeType.NotAdaptableTree:
          case FlexDesignTimeType.NotAdaptableVisibility:
            designTimeMetadata = designTime;
        }
      }
    }

    return designTimeMetadata;
  } ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Convert & Build Annotation Based Header Facets
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  function createReferenceHeaderFacet(facetDefinition, collectionFacetDefinition, converterContext) {
    var _facetDefinition$anno, _facetDefinition$anno2;

    if (facetDefinition.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet" && !(((_facetDefinition$anno = facetDefinition.annotations) === null || _facetDefinition$anno === void 0 ? void 0 : (_facetDefinition$anno2 = _facetDefinition$anno.UI) === null || _facetDefinition$anno2 === void 0 ? void 0 : _facetDefinition$anno2.Hidden) === true)) {
      var _annotations$UI;

      var headerFacetID = HeaderFacetID({
        Facet: facetDefinition
      }),
          getHeaderFacetKey = function (facetDefinition, fallback) {
        var _facetDefinition$ID, _facetDefinition$Labe;

        return ((_facetDefinition$ID = facetDefinition.ID) === null || _facetDefinition$ID === void 0 ? void 0 : _facetDefinition$ID.toString()) || ((_facetDefinition$Labe = facetDefinition.Label) === null || _facetDefinition$Labe === void 0 ? void 0 : _facetDefinition$Labe.toString()) || fallback;
      },
          targetAnnotationValue = facetDefinition.Target.value,
          targetAnnotationType = getTargetAnnotationType(facetDefinition);

      var headerFormData;
      var headerDataPointData;

      switch (targetAnnotationType) {
        case TargetAnnotationType.FieldGroup:
          headerFormData = getFieldGroupFormData(facetDefinition, converterContext);
          break;

        case TargetAnnotationType.DataPoint:
          headerDataPointData = getDataPointData(facetDefinition);
          break;
        // ToDo: Handle other cases
      }

      var annotations = facetDefinition.annotations;
      return {
        type: HeaderFacetType.Annotation,
        facetType: FacetType.Reference,
        id: headerFacetID,
        containerId: HeaderFacetContainerID({
          Facet: facetDefinition
        }),
        key: getHeaderFacetKey(facetDefinition, headerFacetID),
        flexSettings: {
          designtime: getDesignTimeMetadata(facetDefinition, collectionFacetDefinition, converterContext)
        },
        visible: compileBinding(not(equal(annotationExpression(annotations === null || annotations === void 0 ? void 0 : (_annotations$UI = annotations.UI) === null || _annotations$UI === void 0 ? void 0 : _annotations$UI.Hidden), true))),
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(facetDefinition.fullyQualifiedName) + "/",
        targetAnnotationValue: targetAnnotationValue,
        targetAnnotationType: targetAnnotationType,
        headerFormData: headerFormData,
        headerDataPointData: headerDataPointData
      };
    }

    return undefined;
  }

  function createCollectionHeaderFacet(collectionFacetDefinition, converterContext) {
    if (collectionFacetDefinition.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet") {
      var _collectionFacetDefin, _collectionFacetDefin2;

      var facets = [],
          headerFacetID = HeaderFacetID({
        Facet: collectionFacetDefinition
      }),
          getHeaderFacetKey = function (facetDefinition, fallback) {
        var _facetDefinition$ID2, _facetDefinition$Labe2;

        return ((_facetDefinition$ID2 = facetDefinition.ID) === null || _facetDefinition$ID2 === void 0 ? void 0 : _facetDefinition$ID2.toString()) || ((_facetDefinition$Labe2 = facetDefinition.Label) === null || _facetDefinition$Labe2 === void 0 ? void 0 : _facetDefinition$Labe2.toString()) || fallback;
      };

      collectionFacetDefinition.Facets.forEach(function (facetDefinition) {
        var facet = createReferenceHeaderFacet(facetDefinition, collectionFacetDefinition, converterContext);

        if (facet) {
          facets.push(facet);
        }
      });
      return {
        type: HeaderFacetType.Annotation,
        facetType: FacetType.Collection,
        id: headerFacetID,
        containerId: HeaderFacetContainerID({
          Facet: collectionFacetDefinition
        }),
        key: getHeaderFacetKey(collectionFacetDefinition, headerFacetID),
        flexSettings: {
          designtime: getDesignTimeMetadata(collectionFacetDefinition, collectionFacetDefinition, converterContext)
        },
        visible: compileBinding(not(equal(annotationExpression((_collectionFacetDefin = collectionFacetDefinition.annotations) === null || _collectionFacetDefin === void 0 ? void 0 : (_collectionFacetDefin2 = _collectionFacetDefin.UI) === null || _collectionFacetDefin2 === void 0 ? void 0 : _collectionFacetDefin2.Hidden), true))),
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(collectionFacetDefinition.fullyQualifiedName) + "/",
        facets: facets
      };
    }

    return undefined;
  }

  function getTargetAnnotationType(facetDefinition) {
    var annotationType = TargetAnnotationType.None;
    var annotationTypeMap = {
      "com.sap.vocabularies.UI.v1.DataPoint": TargetAnnotationType.DataPoint,
      "com.sap.vocabularies.UI.v1.Chart": TargetAnnotationType.Chart,
      "com.sap.vocabularies.UI.v1.Identification": TargetAnnotationType.Identification,
      "com.sap.vocabularies.Communication.v1.Contact": TargetAnnotationType.Contact,
      "com.sap.vocabularies.Communication.v1.Address": TargetAnnotationType.Address,
      "com.sap.vocabularies.UI.v1.FieldGroup": TargetAnnotationType.FieldGroup
    }; // ReferenceURLFacet and CollectionFacet do not have Target property.

    if (facetDefinition.$Type !== "com.sap.vocabularies.UI.v1.ReferenceURLFacet" && facetDefinition.$Type !== "com.sap.vocabularies.UI.v1.CollectionFacet") {
      var _facetDefinition$Targ, _facetDefinition$Targ2;

      annotationType = annotationTypeMap[(_facetDefinition$Targ = facetDefinition.Target) === null || _facetDefinition$Targ === void 0 ? void 0 : (_facetDefinition$Targ2 = _facetDefinition$Targ.$target) === null || _facetDefinition$Targ2 === void 0 ? void 0 : _facetDefinition$Targ2.term] || TargetAnnotationType.None;
    }

    return annotationType;
  }

  function getFieldGroupFormData(facetDefinition, converterContext) {
    // split in this from annotation + getFieldGroupFromDefault
    if (!facetDefinition) {
      throw new Error("Cannot get FieldGroup form data without facet definition");
    }

    var formElements = insertCustomElements(getFormElementsFromAnnotations(facetDefinition, converterContext), getFormElementsFromManifest(facetDefinition, converterContext));
    return {
      id: HeaderFacetFormID({
        Facet: facetDefinition
      }),
      label: facetDefinition.Label,
      formElements: formElements
    };
  }
  /**
   * Create an array of manifest based formElements.
   *
   * @param {FacetType} facetDefinition for this object
   * @param {ConverterContext} converterContext for this object
   *
   * @returns {Array} Annotation based FormElements
   */


  function getFormElementsFromAnnotations(facetDefinition, converterContext) {
    var annotationBasedFormElements = []; // ReferenceURLFacet and CollectionFacet do not have Target property.

    if (facetDefinition.$Type !== "com.sap.vocabularies.UI.v1.ReferenceURLFacet" && facetDefinition.$Type !== "com.sap.vocabularies.UI.v1.CollectionFacet") {
      var _facetDefinition$Targ3, _facetDefinition$Targ4;

      (_facetDefinition$Targ3 = facetDefinition.Target) === null || _facetDefinition$Targ3 === void 0 ? void 0 : (_facetDefinition$Targ4 = _facetDefinition$Targ3.$target) === null || _facetDefinition$Targ4 === void 0 ? void 0 : _facetDefinition$Targ4.Data.forEach(function (dataField) {
        var _dataField$annotation, _dataField$annotation2;

        if (!(((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : _dataField$annotation2.Hidden) === true)) {
          var semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, dataField);

          if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataField") {
            var _dataField$Value, _dataField$Value$$tar, _dataField$Value$$tar2, _dataField$Value$$tar3, _annotations$UI2, _dataField$Value2, _dataField$Value2$$ta, _dataField$Value2$$ta2, _dataField$Value2$$ta3, _dataField$Value3, _dataField$Value3$$ta;

            var annotations = dataField.annotations;
            annotationBasedFormElements.push({
              isValueMultilineText: ((_dataField$Value = dataField.Value) === null || _dataField$Value === void 0 ? void 0 : (_dataField$Value$$tar = _dataField$Value.$target) === null || _dataField$Value$$tar === void 0 ? void 0 : (_dataField$Value$$tar2 = _dataField$Value$$tar.annotations) === null || _dataField$Value$$tar2 === void 0 ? void 0 : (_dataField$Value$$tar3 = _dataField$Value$$tar2.UI) === null || _dataField$Value$$tar3 === void 0 ? void 0 : _dataField$Value$$tar3.MultiLineText) === true,
              type: FormElementType.Annotation,
              key: KeyHelper.generateKeyFromDataField(dataField),
              visible: compileBinding(not(equal(annotationExpression(annotations === null || annotations === void 0 ? void 0 : (_annotations$UI2 = annotations.UI) === null || _annotations$UI2 === void 0 ? void 0 : _annotations$UI2.Hidden), true))),
              label: ((_dataField$Value2 = dataField.Value) === null || _dataField$Value2 === void 0 ? void 0 : (_dataField$Value2$$ta = _dataField$Value2.$target) === null || _dataField$Value2$$ta === void 0 ? void 0 : (_dataField$Value2$$ta2 = _dataField$Value2$$ta.annotations) === null || _dataField$Value2$$ta2 === void 0 ? void 0 : (_dataField$Value2$$ta3 = _dataField$Value2$$ta2.Common) === null || _dataField$Value2$$ta3 === void 0 ? void 0 : _dataField$Value2$$ta3.Label) || dataField.Label,
              idPrefix: HeaderFacetFormID({
                Facet: facetDefinition
              }, dataField),
              valueFormat: ((_dataField$Value3 = dataField.Value) === null || _dataField$Value3 === void 0 ? void 0 : (_dataField$Value3$$ta = _dataField$Value3.$target) === null || _dataField$Value3$$ta === void 0 ? void 0 : _dataField$Value3$$ta.type) === "Edm.Date" ? "long" : undefined,
              annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName) + "/",
              semanticObjectPath: semanticObjectAnnotationPath
            });
          } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
            var _dataField$Target, _dataField$Target$$ta, _dataField$Target$$ta2, _dataField$Target$$ta3, _annotations$UI3, _dataField$Target2, _dataField$Target2$$t, _dataField$Target2$$t2, _dataField$Target2$$t3, _dataField$Target3, _dataField$Target3$$t;

            var _annotations = dataField.annotations;
            annotationBasedFormElements.push({
              isValueMultilineText: ((_dataField$Target = dataField.Target) === null || _dataField$Target === void 0 ? void 0 : (_dataField$Target$$ta = _dataField$Target.$target) === null || _dataField$Target$$ta === void 0 ? void 0 : (_dataField$Target$$ta2 = _dataField$Target$$ta.annotations) === null || _dataField$Target$$ta2 === void 0 ? void 0 : (_dataField$Target$$ta3 = _dataField$Target$$ta2.UI) === null || _dataField$Target$$ta3 === void 0 ? void 0 : _dataField$Target$$ta3.MultiLineText) === true,
              type: FormElementType.Annotation,
              key: KeyHelper.generateKeyFromDataField(dataField),
              visible: compileBinding(not(equal(annotationExpression(_annotations === null || _annotations === void 0 ? void 0 : (_annotations$UI3 = _annotations.UI) === null || _annotations$UI3 === void 0 ? void 0 : _annotations$UI3.Hidden), true))),
              label: ((_dataField$Target2 = dataField.Target) === null || _dataField$Target2 === void 0 ? void 0 : (_dataField$Target2$$t = _dataField$Target2.$target) === null || _dataField$Target2$$t === void 0 ? void 0 : (_dataField$Target2$$t2 = _dataField$Target2$$t.annotations) === null || _dataField$Target2$$t2 === void 0 ? void 0 : (_dataField$Target2$$t3 = _dataField$Target2$$t2.Common) === null || _dataField$Target2$$t3 === void 0 ? void 0 : _dataField$Target2$$t3.Label) || dataField.Label,
              idPrefix: HeaderFacetFormID({
                Facet: facetDefinition
              }, dataField),
              valueFormat: ((_dataField$Target3 = dataField.Target) === null || _dataField$Target3 === void 0 ? void 0 : (_dataField$Target3$$t = _dataField$Target3.$target) === null || _dataField$Target3$$t === void 0 ? void 0 : _dataField$Target3$$t.type) === "Edm.Date" ? "long" : undefined,
              annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName) + "/",
              semanticObjectPath: semanticObjectAnnotationPath
            });
          }
        }
      });
    }

    return annotationBasedFormElements;
  }

  function getDataPointData(facetDefinition) {
    var type = HeaderDataPointType.Content;

    if (facetDefinition.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
      var _facetDefinition$Targ5, _facetDefinition$Targ6, _facetDefinition$Targ7, _facetDefinition$Targ8;

      if (((_facetDefinition$Targ5 = facetDefinition.Target) === null || _facetDefinition$Targ5 === void 0 ? void 0 : (_facetDefinition$Targ6 = _facetDefinition$Targ5.$target) === null || _facetDefinition$Targ6 === void 0 ? void 0 : _facetDefinition$Targ6.Visualization) === "UI.VisualizationType/Progress") {
        type = HeaderDataPointType.ProgressIndicator;
      } else if (((_facetDefinition$Targ7 = facetDefinition.Target) === null || _facetDefinition$Targ7 === void 0 ? void 0 : (_facetDefinition$Targ8 = _facetDefinition$Targ7.$target) === null || _facetDefinition$Targ8 === void 0 ? void 0 : _facetDefinition$Targ8.Visualization) === "UI.VisualizationType/Rating") {
        type = HeaderDataPointType.RatingIndicator;
      }
    }

    return {
      type: type
    };
  }
  /**
   * Create an annotation based header facet.
   *
   * @param {FacetTypes} facetDefinition of this object
   * @param {ConverterContext} converterContext for this object
   *
   * @returns {ObjectPageHeaderFacet} Annotation based header facet created
   */


  function createHeaderFacet(facetDefinition, converterContext) {
    var headerFacet;

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        headerFacet = createReferenceHeaderFacet(facetDefinition, facetDefinition, converterContext);
        break;

      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        headerFacet = createCollectionHeaderFacet(facetDefinition, converterContext);
        break;
    }

    return headerFacet;
  } ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Convert & Build Manifest Based Header Facets
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  function generateBinding(requestGroupId) {
    if (!requestGroupId) {
      return undefined;
    }

    var groupId = ["Heroes", "Decoration", "Workers", "LongRunners"].indexOf(requestGroupId) !== -1 ? "$auto." + requestGroupId : requestGroupId;
    return "{ path : '', parameters : { $$groupId : '" + groupId + "' } }";
  }
  /**
   * Create a manifest based custom header facet.
   *
   * @param {ManifestHeaderFacet} customHeaderFacetDefinition for this object
   * @param {string} headerFacetKey of this object
   *
   * @returns {CustomObjectPageHeaderFacet} manifest based custom header facet created
   */


  function createCustomHeaderFacet(customHeaderFacetDefinition, headerFacetKey) {
    var customHeaderFacetID = CustomHeaderFacetID(headerFacetKey);
    var position = customHeaderFacetDefinition.position;

    if (!position) {
      position = {
        placement: Placement.After
      };
    }

    return {
      facetType: FacetType.Reference,
      facets: [],
      type: customHeaderFacetDefinition.type,
      id: customHeaderFacetID,
      containerId: customHeaderFacetID,
      key: headerFacetKey,
      position: position,
      visible: customHeaderFacetDefinition.visible,
      fragmentName: customHeaderFacetDefinition.name,
      title: customHeaderFacetDefinition.title,
      subTitle: customHeaderFacetDefinition.subTitle,
      stashed: customHeaderFacetDefinition.stashed || false,
      flexSettings: _objectSpread({}, {
        designtime: FlexDesignTimeType.Default
      }, {}, customHeaderFacetDefinition.flexSettings),
      binding: generateBinding(customHeaderFacetDefinition.requestGroupId)
    };
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhlYWRlckZhY2V0LnRzIl0sIm5hbWVzIjpbIkhlYWRlckZhY2V0VHlwZSIsIkZhY2V0VHlwZSIsIkZsZXhEZXNpZ25UaW1lVHlwZSIsIkhlYWRlckRhdGFQb2ludFR5cGUiLCJUYXJnZXRBbm5vdGF0aW9uVHlwZSIsImdldEhlYWRlckZhY2V0c0Zyb21Bbm5vdGF0aW9ucyIsImNvbnZlcnRlckNvbnRleHQiLCJoZWFkZXJGYWNldHMiLCJnZXRFbnRpdHlUeXBlIiwiYW5ub3RhdGlvbnMiLCJVSSIsIkhlYWRlckZhY2V0cyIsImZvckVhY2giLCJmYWNldCIsImhlYWRlckZhY2V0IiwiY3JlYXRlSGVhZGVyRmFjZXQiLCJwdXNoIiwiZ2V0SGVhZGVyRmFjZXRzRnJvbU1hbmlmZXN0IiwibWFuaWZlc3RDdXN0b21IZWFkZXJGYWNldHMiLCJjdXN0b21IZWFkZXJGYWNldHMiLCJPYmplY3QiLCJrZXlzIiwibWFuaWZlc3RIZWFkZXJGYWNldEtleSIsImN1c3RvbUhlYWRlckZhY2V0IiwiY3JlYXRlQ3VzdG9tSGVhZGVyRmFjZXQiLCJnZXREZXNpZ25UaW1lTWV0YWRhdGEiLCJmYWNldERlZmluaXRpb24iLCJjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uIiwiZGVzaWduVGltZU1ldGFkYXRhIiwiRGVmYXVsdCIsImhlYWRlckZhY2V0SUQiLCJJRCIsIiRUeXBlIiwiTm90QWRhcHRhYmxlVHJlZSIsImhlYWRlckZhY2V0c0NvbnRyb2xDb25maWciLCJnZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uIiwiZGVzaWduVGltZSIsImZhY2V0cyIsImZsZXhTZXR0aW5ncyIsImRlc2lnbnRpbWUiLCJOb3RBZGFwdGFibGUiLCJOb3RBZGFwdGFibGVWaXNpYmlsaXR5IiwiY3JlYXRlUmVmZXJlbmNlSGVhZGVyRmFjZXQiLCJIaWRkZW4iLCJIZWFkZXJGYWNldElEIiwiRmFjZXQiLCJnZXRIZWFkZXJGYWNldEtleSIsImZhbGxiYWNrIiwidG9TdHJpbmciLCJMYWJlbCIsInRhcmdldEFubm90YXRpb25WYWx1ZSIsIlRhcmdldCIsInZhbHVlIiwidGFyZ2V0QW5ub3RhdGlvblR5cGUiLCJnZXRUYXJnZXRBbm5vdGF0aW9uVHlwZSIsImhlYWRlckZvcm1EYXRhIiwiaGVhZGVyRGF0YVBvaW50RGF0YSIsIkZpZWxkR3JvdXAiLCJnZXRGaWVsZEdyb3VwRm9ybURhdGEiLCJEYXRhUG9pbnQiLCJnZXREYXRhUG9pbnREYXRhIiwidHlwZSIsIkFubm90YXRpb24iLCJmYWNldFR5cGUiLCJSZWZlcmVuY2UiLCJpZCIsImNvbnRhaW5lcklkIiwiSGVhZGVyRmFjZXRDb250YWluZXJJRCIsImtleSIsInZpc2libGUiLCJjb21waWxlQmluZGluZyIsIm5vdCIsImVxdWFsIiwiYW5ub3RhdGlvbkV4cHJlc3Npb24iLCJhbm5vdGF0aW9uUGF0aCIsImdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgiLCJmdWxseVF1YWxpZmllZE5hbWUiLCJ1bmRlZmluZWQiLCJjcmVhdGVDb2xsZWN0aW9uSGVhZGVyRmFjZXQiLCJGYWNldHMiLCJDb2xsZWN0aW9uIiwiYW5ub3RhdGlvblR5cGUiLCJOb25lIiwiYW5ub3RhdGlvblR5cGVNYXAiLCJDaGFydCIsIklkZW50aWZpY2F0aW9uIiwiQ29udGFjdCIsIkFkZHJlc3MiLCIkdGFyZ2V0IiwidGVybSIsIkVycm9yIiwiZm9ybUVsZW1lbnRzIiwiaW5zZXJ0Q3VzdG9tRWxlbWVudHMiLCJnZXRGb3JtRWxlbWVudHNGcm9tQW5ub3RhdGlvbnMiLCJnZXRGb3JtRWxlbWVudHNGcm9tTWFuaWZlc3QiLCJIZWFkZXJGYWNldEZvcm1JRCIsImxhYmVsIiwiYW5ub3RhdGlvbkJhc2VkRm9ybUVsZW1lbnRzIiwiRGF0YSIsImRhdGFGaWVsZCIsInNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGgiLCJnZXRTZW1hbnRpY09iamVjdFBhdGgiLCJpc1ZhbHVlTXVsdGlsaW5lVGV4dCIsIlZhbHVlIiwiTXVsdGlMaW5lVGV4dCIsIkZvcm1FbGVtZW50VHlwZSIsIktleUhlbHBlciIsImdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZCIsIkNvbW1vbiIsImlkUHJlZml4IiwidmFsdWVGb3JtYXQiLCJzZW1hbnRpY09iamVjdFBhdGgiLCJDb250ZW50IiwiVmlzdWFsaXphdGlvbiIsIlByb2dyZXNzSW5kaWNhdG9yIiwiUmF0aW5nSW5kaWNhdG9yIiwiZ2VuZXJhdGVCaW5kaW5nIiwicmVxdWVzdEdyb3VwSWQiLCJncm91cElkIiwiaW5kZXhPZiIsImN1c3RvbUhlYWRlckZhY2V0RGVmaW5pdGlvbiIsImhlYWRlckZhY2V0S2V5IiwiY3VzdG9tSGVhZGVyRmFjZXRJRCIsIkN1c3RvbUhlYWRlckZhY2V0SUQiLCJwb3NpdGlvbiIsInBsYWNlbWVudCIsIlBsYWNlbWVudCIsIkFmdGVyIiwiZnJhZ21lbnROYW1lIiwibmFtZSIsInRpdGxlIiwic3ViVGl0bGUiLCJzdGFzaGVkIiwiYmluZGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQTtBQUNBO0FBQ0E7TUFFWUEsZTs7YUFBQUEsZTtBQUFBQSxJQUFBQSxlO0FBQUFBLElBQUFBLGU7S0FBQUEsZSxLQUFBQSxlOzs7TUFLQUMsUzs7YUFBQUEsUztBQUFBQSxJQUFBQSxTO0FBQUFBLElBQUFBLFM7S0FBQUEsUyxLQUFBQSxTOzs7TUFLQUMsa0I7O2FBQUFBLGtCO0FBQUFBLElBQUFBLGtCO0FBQUFBLElBQUFBLGtCO0FBQUFBLElBQUFBLGtCO0FBQUFBLElBQUFBLGtCO0tBQUFBLGtCLEtBQUFBLGtCOzs7TUFpQlBDLG1COzthQUFBQSxtQjtBQUFBQSxJQUFBQSxtQjtBQUFBQSxJQUFBQSxtQjtBQUFBQSxJQUFBQSxtQjtLQUFBQSxtQixLQUFBQSxtQjs7TUFVQUMsb0I7O2FBQUFBLG9CO0FBQUFBLElBQUFBLG9CO0FBQUFBLElBQUFBLG9CO0FBQUFBLElBQUFBLG9CO0FBQUFBLElBQUFBLG9CO0FBQUFBLElBQUFBLG9CO0FBQUFBLElBQUFBLG9CO0FBQUFBLElBQUFBLG9C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LGNBQUQsQ0FBL0M7QUFFQSxRQUFJRyxRQUE4QixHQUFHSiwyQkFBMkIsQ0FBQ0ksUUFBakU7O0FBQ0EsUUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDZEEsTUFBQUEsUUFBUSxHQUFHO0FBQ1ZDLFFBQUFBLFNBQVMsRUFBRUMsU0FBUyxDQUFDQztBQURYLE9BQVg7QUFHQTs7QUFDRCxXQUFPO0FBQ05oRSxNQUFBQSxTQUFTLEVBQUU5RCxTQUFTLENBQUMrRCxTQURmO0FBRU4zQixNQUFBQSxNQUFNLEVBQUUsRUFGRjtBQUdOd0IsTUFBQUEsSUFBSSxFQUFFMkQsMkJBQTJCLENBQUMzRCxJQUg1QjtBQUlOSSxNQUFBQSxFQUFFLEVBQUV5RCxtQkFKRTtBQUtOeEQsTUFBQUEsV0FBVyxFQUFFd0QsbUJBTFA7QUFNTnRELE1BQUFBLEdBQUcsRUFBRXFELGNBTkM7QUFPTkcsTUFBQUEsUUFBUSxFQUFFQSxRQVBKO0FBUU52RCxNQUFBQSxPQUFPLEVBQUVtRCwyQkFBMkIsQ0FBQ25ELE9BUi9CO0FBU04yRCxNQUFBQSxZQUFZLEVBQUVSLDJCQUEyQixDQUFDUyxJQVRwQztBQVVOQyxNQUFBQSxLQUFLLEVBQUVWLDJCQUEyQixDQUFDVSxLQVY3QjtBQVdOQyxNQUFBQSxRQUFRLEVBQUVYLDJCQUEyQixDQUFDVyxRQVhoQztBQVlOQyxNQUFBQSxPQUFPLEVBQUVaLDJCQUEyQixDQUFDWSxPQUE1QixJQUF1QyxLQVoxQztBQWFOOUYsTUFBQUEsWUFBWSxvQkFBTztBQUFFQyxRQUFBQSxVQUFVLEVBQUVyQyxrQkFBa0IsQ0FBQzJCO0FBQWpDLE9BQVAsTUFBc0QyRiwyQkFBMkIsQ0FBQ2xGLFlBQWxGLENBYk47QUFjTitGLE1BQUFBLE9BQU8sRUFBRWpCLGVBQWUsQ0FBQ0ksMkJBQTJCLENBQUNILGNBQTdCO0FBZGxCLEtBQVA7QUFnQkEiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hbmlmZXN0SGVhZGVyRmFjZXQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQge1xuXHRDb25maWd1cmFibGVPYmplY3QsXG5cdENvbmZpZ3VyYWJsZVJlY29yZCxcblx0Q3VzdG9tRWxlbWVudCxcblx0aW5zZXJ0Q3VzdG9tRWxlbWVudHMsXG5cdFBsYWNlbWVudCxcblx0UG9zaXRpb25cbn0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7IERhdGFGaWVsZEFic3RyYWN0VHlwZXMsIEZhY2V0VHlwZXMsIFJlZmVyZW5jZUZhY2V0VHlwZXMsIFVJQW5ub3RhdGlvblR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyBDb252ZXJ0ZXJDb250ZXh0IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvdGVtcGxhdGVzL0Jhc2VDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IEN1c3RvbUhlYWRlckZhY2V0SUQsIEhlYWRlckZhY2V0Q29udGFpbmVySUQsIEhlYWRlckZhY2V0Rm9ybUlELCBIZWFkZXJGYWNldElEIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9JRFwiO1xuaW1wb3J0IHsgYW5ub3RhdGlvbkV4cHJlc3Npb24sIEJpbmRpbmdFeHByZXNzaW9uLCBjb21waWxlQmluZGluZywgZXF1YWwsIG5vdCB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdFeHByZXNzaW9uXCI7XG5pbXBvcnQgeyBLZXlIZWxwZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0tleVwiO1xuaW1wb3J0IHsgQW5ub3RhdGlvbkZvcm1FbGVtZW50LCBGb3JtRWxlbWVudCwgRm9ybUVsZW1lbnRUeXBlLCBnZXRGb3JtRWxlbWVudHNGcm9tTWFuaWZlc3QgfSBmcm9tIFwiLi4vQ29tbW9uL0Zvcm1cIjtcbmltcG9ydCB7IGdldFNlbWFudGljT2JqZWN0UGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2Fubm90YXRpb25zL0RhdGFGaWVsZFwiO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIERlZmluaXRpb25zOiBIZWFkZXIgRmFjZXQgVHlwZXMsIEdlbmVyaWMgT1AgSGVhZGVyIEZhY2V0LCBNYW5pZmVzdCBQcm9wZXJ0aWVzIGZvciBDdXN0b20gSGVhZGVyIEZhY2V0XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0IGVudW0gSGVhZGVyRmFjZXRUeXBlIHtcblx0QW5ub3RhdGlvbiA9IFwiQW5ub3RhdGlvblwiLFxuXHRYTUxGcmFnbWVudCA9IFwiWE1MRnJhZ21lbnRcIlxufVxuXG5leHBvcnQgZW51bSBGYWNldFR5cGUge1xuXHRSZWZlcmVuY2UgPSBcIlJlZmVyZW5jZVwiLFxuXHRDb2xsZWN0aW9uID0gXCJDb2xsZWN0aW9uXCJcbn1cblxuZXhwb3J0IGVudW0gRmxleERlc2lnblRpbWVUeXBlIHtcblx0RGVmYXVsdCA9IFwiRGVmYXVsdFwiLFxuXHROb3RBZGFwdGFibGUgPSBcIm5vdC1hZGFwdGFibGVcIiwgLy8gZGlzYWJsZSBhbGwgYWN0aW9ucyBvbiB0aGF0IGluc3RhbmNlXG5cdE5vdEFkYXB0YWJsZVRyZWUgPSBcIm5vdC1hZGFwdGFibGUtdHJlZVwiLCAvLyBkaXNhYmxlIGFsbCBhY3Rpb25zIG9uIHRoYXQgaW5zdGFuY2UgYW5kIG9uIGFsbCBjaGlsZHJlbiBvZiB0aGF0IGluc3RhbmNlXG5cdE5vdEFkYXB0YWJsZVZpc2liaWxpdHkgPSBcIm5vdC1hZGFwdGFibGUtdmlzaWJpbGl0eVwiIC8vIGRpc2FibGUgYWxsIGFjdGlvbnMgdGhhdCBpbmZsdWVuY2UgdGhlIHZpc2liaWxpdHksIG5hbWVseSByZXZlYWwgYW5kIHJlbW92ZVxufVxuXG5leHBvcnQgdHlwZSBGbGV4U2V0dGluZ3MgPSB7XG5cdGRlc2lnbnRpbWU/OiBGbGV4RGVzaWduVGltZVR5cGU7XG59O1xuXG50eXBlIEhlYWRlckZvcm1EYXRhID0ge1xuXHRpZDogc3RyaW5nO1xuXHRsYWJlbDogc3RyaW5nO1xuXHRmb3JtRWxlbWVudHM6IEZvcm1FbGVtZW50W107XG59O1xuXG5lbnVtIEhlYWRlckRhdGFQb2ludFR5cGUge1xuXHRQcm9ncmVzc0luZGljYXRvciA9IFwiUHJvZ3Jlc3NJbmRpY2F0b3JcIixcblx0UmF0aW5nSW5kaWNhdG9yID0gXCJSYXRpbmdJbmRpY2F0b3JcIixcblx0Q29udGVudCA9IFwiQ29udGVudFwiXG59XG5cbnR5cGUgSGVhZGVyRGF0YVBvaW50RGF0YSA9IHtcblx0dHlwZTogSGVhZGVyRGF0YVBvaW50VHlwZTtcbn07XG5cbmVudW0gVGFyZ2V0QW5ub3RhdGlvblR5cGUge1xuXHROb25lID0gXCJOb25lXCIsXG5cdERhdGFQb2ludCA9IFwiRGF0YVBvaW50XCIsXG5cdENoYXJ0ID0gXCJDaGFydFwiLFxuXHRJZGVudGlmaWNhdGlvbiA9IFwiSWRlbnRpZmljYXRpb25cIixcblx0Q29udGFjdCA9IFwiQ29udGFjdFwiLFxuXHRBZGRyZXNzID0gXCJBZGRyZXNzXCIsXG5cdEZpZWxkR3JvdXAgPSBcIkZpZWxkR3JvdXBcIlxufVxuXG50eXBlIEJhc2VIZWFkZXJGYWNldCA9IENvbmZpZ3VyYWJsZU9iamVjdCAmIHtcblx0dHlwZTogSGVhZGVyRmFjZXRUeXBlOyAvLyBNYW5pZmVzdCBvciBNZXRhZGF0YVxuXHRpZDogc3RyaW5nO1xuXHRjb250YWluZXJJZDogc3RyaW5nO1xuXHRhbm5vdGF0aW9uUGF0aD86IHN0cmluZztcblx0ZmxleFNldHRpbmdzPzogRmxleFNldHRpbmdzO1xuXHR2aXNpYmxlOiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPjtcblx0dGFyZ2V0QW5ub3RhdGlvblZhbHVlPzogc3RyaW5nO1xuXHR0YXJnZXRBbm5vdGF0aW9uVHlwZT86IFRhcmdldEFubm90YXRpb25UeXBlO1xufTtcblxudHlwZSBCYXNlUmVmZXJlbmNlRmFjZXQgPSBCYXNlSGVhZGVyRmFjZXQgJiB7XG5cdGZhY2V0VHlwZTogRmFjZXRUeXBlLlJlZmVyZW5jZTtcbn07XG5cbnR5cGUgRmllbGRHcm91cEZhY2V0ID0gQmFzZVJlZmVyZW5jZUZhY2V0ICYge1xuXHRoZWFkZXJGb3JtRGF0YT86IEhlYWRlckZvcm1EYXRhO1xufTtcblxudHlwZSBEYXRhUG9pbnRGYWNldCA9IEJhc2VSZWZlcmVuY2VGYWNldCAmIHtcblx0aGVhZGVyRGF0YVBvaW50RGF0YT86IEhlYWRlckRhdGFQb2ludERhdGE7XG59O1xuXG50eXBlIFJlZmVyZW5jZUZhY2V0ID0gRmllbGRHcm91cEZhY2V0IHwgRGF0YVBvaW50RmFjZXQ7XG5cbnR5cGUgQ29sbGVjdGlvbkZhY2V0ID0gQmFzZUhlYWRlckZhY2V0ICYge1xuXHRmYWNldFR5cGU6IEZhY2V0VHlwZS5Db2xsZWN0aW9uO1xuXHRmYWNldHM6IFJlZmVyZW5jZUZhY2V0W107XG59O1xuXG5leHBvcnQgdHlwZSBPYmplY3RQYWdlSGVhZGVyRmFjZXQgPSBSZWZlcmVuY2VGYWNldCB8IENvbGxlY3Rpb25GYWNldDtcblxuZXhwb3J0IHR5cGUgQ3VzdG9tT2JqZWN0UGFnZUhlYWRlckZhY2V0ID0gQ3VzdG9tRWxlbWVudDxPYmplY3RQYWdlSGVhZGVyRmFjZXQ+ICYge1xuXHRmcmFnbWVudE5hbWU6IHN0cmluZztcblx0dGl0bGU/OiBzdHJpbmc7XG5cdHN1YlRpdGxlPzogc3RyaW5nO1xuXHRzdGFzaGVkPzogYm9vbGVhbjtcblx0YmluZGluZz86IHN0cmluZztcbn07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQ29sbGVjdCBBbGwgSGVhZGVyIEZhY2V0czogQ3VzdG9tICh2aWEgTWFuaWZlc3QpIGFuZCBBbm5vdGF0aW9uIEJhc2VkICh2aWEgTWV0YW1vZGVsKVxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8qKlxuICogUmV0cmlldmUgaGVhZGVyIGZhY2V0cyBmcm9tIGFubm90YXRpb25zLlxuICpcbiAqIEBwYXJhbSB7Q29udmVydGVyQ29udGV4dH0gY29udmVydGVyQ29udGV4dCBmb3IgdGhpcyBvYmplY3RcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0UGFnZUhlYWRlckZhY2V0fSBoZWFkZXIgZmFjZXRzIGZyb20gYW5ub3RhdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEhlYWRlckZhY2V0c0Zyb21Bbm5vdGF0aW9ucyhjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogT2JqZWN0UGFnZUhlYWRlckZhY2V0W10ge1xuXHRjb25zdCBoZWFkZXJGYWNldHM6IE9iamVjdFBhZ2VIZWFkZXJGYWNldFtdID0gW107XG5cdGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLmFubm90YXRpb25zPy5VST8uSGVhZGVyRmFjZXRzPy5mb3JFYWNoKGZhY2V0ID0+IHtcblx0XHRjb25zdCBoZWFkZXJGYWNldDogT2JqZWN0UGFnZUhlYWRlckZhY2V0IHwgdW5kZWZpbmVkID0gY3JlYXRlSGVhZGVyRmFjZXQoZmFjZXQsIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdGlmIChoZWFkZXJGYWNldCkge1xuXHRcdFx0aGVhZGVyRmFjZXRzLnB1c2goaGVhZGVyRmFjZXQpO1xuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIGhlYWRlckZhY2V0cztcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSBjdXN0b20gaGVhZGVyIGZhY2V0cyBmcm9tIG1hbmlmZXN0LlxuICpcbiAqIEBwYXJhbSB7Q29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0SGVhZGVyRmFjZXQ+fSBtYW5pZmVzdEN1c3RvbUhlYWRlckZhY2V0cyBzZXR0aW5ncyBmb3IgdGhpcyBvYmplY3RcbiAqXG4gKiBAcmV0dXJucyB7UmVjb3JkPHN0cmluZywgQ3VzdG9tT2JqZWN0UGFnZUhlYWRlckZhY2V0Pn0gaGVhZGVyIGZhY2V0cyBmcm9tIG1hbmlmZXN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRIZWFkZXJGYWNldHNGcm9tTWFuaWZlc3QoXG5cdG1hbmlmZXN0Q3VzdG9tSGVhZGVyRmFjZXRzOiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RIZWFkZXJGYWNldD5cbik6IFJlY29yZDxzdHJpbmcsIEN1c3RvbU9iamVjdFBhZ2VIZWFkZXJGYWNldD4ge1xuXHRjb25zdCBjdXN0b21IZWFkZXJGYWNldHM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbU9iamVjdFBhZ2VIZWFkZXJGYWNldD4gPSB7fTtcblxuXHRPYmplY3Qua2V5cyhtYW5pZmVzdEN1c3RvbUhlYWRlckZhY2V0cykuZm9yRWFjaChtYW5pZmVzdEhlYWRlckZhY2V0S2V5ID0+IHtcblx0XHRjb25zdCBjdXN0b21IZWFkZXJGYWNldDogTWFuaWZlc3RIZWFkZXJGYWNldCA9IG1hbmlmZXN0Q3VzdG9tSGVhZGVyRmFjZXRzW21hbmlmZXN0SGVhZGVyRmFjZXRLZXldO1xuXHRcdGN1c3RvbUhlYWRlckZhY2V0c1ttYW5pZmVzdEhlYWRlckZhY2V0S2V5XSA9IGNyZWF0ZUN1c3RvbUhlYWRlckZhY2V0KGN1c3RvbUhlYWRlckZhY2V0LCBtYW5pZmVzdEhlYWRlckZhY2V0S2V5KTtcblx0fSk7XG5cblx0cmV0dXJuIGN1c3RvbUhlYWRlckZhY2V0cztcbn1cblxuZnVuY3Rpb24gZ2V0RGVzaWduVGltZU1ldGFkYXRhKFxuXHRmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsXG5cdGNvbGxlY3Rpb25GYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IEZsZXhEZXNpZ25UaW1lVHlwZSB7XG5cdGxldCBkZXNpZ25UaW1lTWV0YWRhdGE6IEZsZXhEZXNpZ25UaW1lVHlwZSA9IEZsZXhEZXNpZ25UaW1lVHlwZS5EZWZhdWx0O1xuXHRjb25zdCBoZWFkZXJGYWNldElEID0gZmFjZXREZWZpbml0aW9uLklEIGFzIHN0cmluZztcblxuXHQvLyBGb3IgSGVhZGVyRmFjZXRzIG5lc3RlZCBpbnNpZGUgQ29sbGVjdGlvbkZhY2V0IFJUQSBzaG91bGQgYmUgZGlzYWJsZWQsIHRoZXJlZm9yZSBzZXQgdG8gXCJub3QtYWRhcHRhYmxlLXRyZWVcIlxuXHRpZiAoXG5cdFx0ZmFjZXREZWZpbml0aW9uLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5SZWZlcmVuY2VGYWNldCAmJlxuXHRcdGNvbGxlY3Rpb25GYWNldERlZmluaXRpb24uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkNvbGxlY3Rpb25GYWNldFxuXHQpIHtcblx0XHRkZXNpZ25UaW1lTWV0YWRhdGEgPSBGbGV4RGVzaWduVGltZVR5cGUuTm90QWRhcHRhYmxlVHJlZTtcblx0fSBlbHNlIHtcblx0XHRjb25zdCBoZWFkZXJGYWNldHNDb250cm9sQ29uZmlnID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkhlYWRlckZhY2V0c1wiKTtcblx0XHRpZiAoaGVhZGVyRmFjZXRJRCkge1xuXHRcdFx0Y29uc3QgZGVzaWduVGltZSA9IGhlYWRlckZhY2V0c0NvbnRyb2xDb25maWc/LmZhY2V0cz8uW2hlYWRlckZhY2V0SURdPy5mbGV4U2V0dGluZ3M/LmRlc2lnbnRpbWU7XG5cdFx0XHRzd2l0Y2ggKGRlc2lnblRpbWUpIHtcblx0XHRcdFx0Y2FzZSBGbGV4RGVzaWduVGltZVR5cGUuTm90QWRhcHRhYmxlOlxuXHRcdFx0XHRjYXNlIEZsZXhEZXNpZ25UaW1lVHlwZS5Ob3RBZGFwdGFibGVUcmVlOlxuXHRcdFx0XHRjYXNlIEZsZXhEZXNpZ25UaW1lVHlwZS5Ob3RBZGFwdGFibGVWaXNpYmlsaXR5OlxuXHRcdFx0XHRcdGRlc2lnblRpbWVNZXRhZGF0YSA9IGRlc2lnblRpbWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBkZXNpZ25UaW1lTWV0YWRhdGE7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQ29udmVydCAmIEJ1aWxkIEFubm90YXRpb24gQmFzZWQgSGVhZGVyIEZhY2V0c1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5mdW5jdGlvbiBjcmVhdGVSZWZlcmVuY2VIZWFkZXJGYWNldChcblx0ZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLFxuXHRjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBSZWZlcmVuY2VGYWNldCB8IHVuZGVmaW5lZCB7XG5cdGlmIChmYWNldERlZmluaXRpb24uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0ICYmICEoZmFjZXREZWZpbml0aW9uLmFubm90YXRpb25zPy5VST8uSGlkZGVuID09PSB0cnVlKSkge1xuXHRcdGNvbnN0IGhlYWRlckZhY2V0SUQgPSBIZWFkZXJGYWNldElEKHsgRmFjZXQ6IGZhY2V0RGVmaW5pdGlvbiB9KSxcblx0XHRcdGdldEhlYWRlckZhY2V0S2V5ID0gKGZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcywgZmFsbGJhY2s6IHN0cmluZyk6IHN0cmluZyA9PiB7XG5cdFx0XHRcdHJldHVybiBmYWNldERlZmluaXRpb24uSUQ/LnRvU3RyaW5nKCkgfHwgZmFjZXREZWZpbml0aW9uLkxhYmVsPy50b1N0cmluZygpIHx8IGZhbGxiYWNrO1xuXHRcdFx0fSxcblx0XHRcdHRhcmdldEFubm90YXRpb25WYWx1ZSA9IGZhY2V0RGVmaW5pdGlvbi5UYXJnZXQudmFsdWUsXG5cdFx0XHR0YXJnZXRBbm5vdGF0aW9uVHlwZSA9IGdldFRhcmdldEFubm90YXRpb25UeXBlKGZhY2V0RGVmaW5pdGlvbik7XG5cblx0XHRsZXQgaGVhZGVyRm9ybURhdGE6IEhlYWRlckZvcm1EYXRhIHwgdW5kZWZpbmVkO1xuXHRcdGxldCBoZWFkZXJEYXRhUG9pbnREYXRhOiBIZWFkZXJEYXRhUG9pbnREYXRhIHwgdW5kZWZpbmVkO1xuXG5cdFx0c3dpdGNoICh0YXJnZXRBbm5vdGF0aW9uVHlwZSkge1xuXHRcdFx0Y2FzZSBUYXJnZXRBbm5vdGF0aW9uVHlwZS5GaWVsZEdyb3VwOlxuXHRcdFx0XHRoZWFkZXJGb3JtRGF0YSA9IGdldEZpZWxkR3JvdXBGb3JtRGF0YShmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBUYXJnZXRBbm5vdGF0aW9uVHlwZS5EYXRhUG9pbnQ6XG5cdFx0XHRcdGhlYWRlckRhdGFQb2ludERhdGEgPSBnZXREYXRhUG9pbnREYXRhKGZhY2V0RGVmaW5pdGlvbik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Ly8gVG9EbzogSGFuZGxlIG90aGVyIGNhc2VzXG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBhbm5vdGF0aW9ucyB9ID0gZmFjZXREZWZpbml0aW9uO1xuXHRcdHJldHVybiB7XG5cdFx0XHR0eXBlOiBIZWFkZXJGYWNldFR5cGUuQW5ub3RhdGlvbixcblx0XHRcdGZhY2V0VHlwZTogRmFjZXRUeXBlLlJlZmVyZW5jZSxcblx0XHRcdGlkOiBoZWFkZXJGYWNldElELFxuXHRcdFx0Y29udGFpbmVySWQ6IEhlYWRlckZhY2V0Q29udGFpbmVySUQoeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH0pLFxuXHRcdFx0a2V5OiBnZXRIZWFkZXJGYWNldEtleShmYWNldERlZmluaXRpb24sIGhlYWRlckZhY2V0SUQpLFxuXHRcdFx0ZmxleFNldHRpbmdzOiB7IGRlc2lnbnRpbWU6IGdldERlc2lnblRpbWVNZXRhZGF0YShmYWNldERlZmluaXRpb24sIGNvbGxlY3Rpb25GYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpIH0sXG5cdFx0XHR2aXNpYmxlOiBjb21waWxlQmluZGluZyhub3QoZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24oYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4pLCB0cnVlKSkpLFxuXHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChmYWNldERlZmluaXRpb24uZnVsbHlRdWFsaWZpZWROYW1lKSArIFwiL1wiLFxuXHRcdFx0dGFyZ2V0QW5ub3RhdGlvblZhbHVlLFxuXHRcdFx0dGFyZ2V0QW5ub3RhdGlvblR5cGUsXG5cdFx0XHRoZWFkZXJGb3JtRGF0YSxcblx0XHRcdGhlYWRlckRhdGFQb2ludERhdGFcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29sbGVjdGlvbkhlYWRlckZhY2V0KFxuXHRjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBDb2xsZWN0aW9uRmFjZXQgfCB1bmRlZmluZWQge1xuXHRpZiAoY29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbi4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0KSB7XG5cdFx0Y29uc3QgZmFjZXRzOiBSZWZlcmVuY2VGYWNldFtdID0gW10sXG5cdFx0XHRoZWFkZXJGYWNldElEID0gSGVhZGVyRmFjZXRJRCh7IEZhY2V0OiBjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uIH0pLFxuXHRcdFx0Z2V0SGVhZGVyRmFjZXRLZXkgPSAoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBmYWxsYmFjazogc3RyaW5nKTogc3RyaW5nID0+IHtcblx0XHRcdFx0cmV0dXJuIGZhY2V0RGVmaW5pdGlvbi5JRD8udG9TdHJpbmcoKSB8fCBmYWNldERlZmluaXRpb24uTGFiZWw/LnRvU3RyaW5nKCkgfHwgZmFsbGJhY2s7XG5cdFx0XHR9O1xuXG5cdFx0Y29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbi5GYWNldHMuZm9yRWFjaChmYWNldERlZmluaXRpb24gPT4ge1xuXHRcdFx0Y29uc3QgZmFjZXQ6IFJlZmVyZW5jZUZhY2V0IHwgdW5kZWZpbmVkID0gY3JlYXRlUmVmZXJlbmNlSGVhZGVyRmFjZXQoXG5cdFx0XHRcdGZhY2V0RGVmaW5pdGlvbixcblx0XHRcdFx0Y29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbixcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0KTtcblx0XHRcdGlmIChmYWNldCkge1xuXHRcdFx0XHRmYWNldHMucHVzaChmYWNldCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogSGVhZGVyRmFjZXRUeXBlLkFubm90YXRpb24sXG5cdFx0XHRmYWNldFR5cGU6IEZhY2V0VHlwZS5Db2xsZWN0aW9uLFxuXHRcdFx0aWQ6IGhlYWRlckZhY2V0SUQsXG5cdFx0XHRjb250YWluZXJJZDogSGVhZGVyRmFjZXRDb250YWluZXJJRCh7IEZhY2V0OiBjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uIH0pLFxuXHRcdFx0a2V5OiBnZXRIZWFkZXJGYWNldEtleShjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uLCBoZWFkZXJGYWNldElEKSxcblx0XHRcdGZsZXhTZXR0aW5nczogeyBkZXNpZ250aW1lOiBnZXREZXNpZ25UaW1lTWV0YWRhdGEoY29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbiwgY29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCkgfSxcblx0XHRcdHZpc2libGU6IGNvbXBpbGVCaW5kaW5nKG5vdChlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbihjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uLmFubm90YXRpb25zPy5VST8uSGlkZGVuKSwgdHJ1ZSkpKSxcblx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoY29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbi5mdWxseVF1YWxpZmllZE5hbWUpICsgXCIvXCIsXG5cdFx0XHRmYWNldHNcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZ2V0VGFyZ2V0QW5ub3RhdGlvblR5cGUoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzKTogVGFyZ2V0QW5ub3RhdGlvblR5cGUge1xuXHRsZXQgYW5ub3RhdGlvblR5cGUgPSBUYXJnZXRBbm5vdGF0aW9uVHlwZS5Ob25lO1xuXHRjb25zdCBhbm5vdGF0aW9uVHlwZU1hcDogUmVjb3JkPHN0cmluZywgVGFyZ2V0QW5ub3RhdGlvblR5cGU+ID0ge1xuXHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50XCI6IFRhcmdldEFubm90YXRpb25UeXBlLkRhdGFQb2ludCxcblx0XHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0XCI6IFRhcmdldEFubm90YXRpb25UeXBlLkNoYXJ0LFxuXHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSWRlbnRpZmljYXRpb25cIjogVGFyZ2V0QW5ub3RhdGlvblR5cGUuSWRlbnRpZmljYXRpb24sXG5cdFx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLkNvbnRhY3RcIjogVGFyZ2V0QW5ub3RhdGlvblR5cGUuQ29udGFjdCxcblx0XHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuQWRkcmVzc1wiOiBUYXJnZXRBbm5vdGF0aW9uVHlwZS5BZGRyZXNzLFxuXHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmllbGRHcm91cFwiOiBUYXJnZXRBbm5vdGF0aW9uVHlwZS5GaWVsZEdyb3VwXG5cdH07XG5cdC8vIFJlZmVyZW5jZVVSTEZhY2V0IGFuZCBDb2xsZWN0aW9uRmFjZXQgZG8gbm90IGhhdmUgVGFyZ2V0IHByb3BlcnR5LlxuXHRpZiAoZmFjZXREZWZpbml0aW9uLiRUeXBlICE9PSBVSUFubm90YXRpb25UeXBlcy5SZWZlcmVuY2VVUkxGYWNldCAmJiBmYWNldERlZmluaXRpb24uJFR5cGUgIT09IFVJQW5ub3RhdGlvblR5cGVzLkNvbGxlY3Rpb25GYWNldCkge1xuXHRcdGFubm90YXRpb25UeXBlID0gYW5ub3RhdGlvblR5cGVNYXBbZmFjZXREZWZpbml0aW9uLlRhcmdldD8uJHRhcmdldD8udGVybV0gfHwgVGFyZ2V0QW5ub3RhdGlvblR5cGUuTm9uZTtcblx0fVxuXG5cdHJldHVybiBhbm5vdGF0aW9uVHlwZTtcbn1cblxuZnVuY3Rpb24gZ2V0RmllbGRHcm91cEZvcm1EYXRhKGZhY2V0RGVmaW5pdGlvbjogUmVmZXJlbmNlRmFjZXRUeXBlcywgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEhlYWRlckZvcm1EYXRhIHtcblx0Ly8gc3BsaXQgaW4gdGhpcyBmcm9tIGFubm90YXRpb24gKyBnZXRGaWVsZEdyb3VwRnJvbURlZmF1bHRcblx0aWYgKCFmYWNldERlZmluaXRpb24pIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZ2V0IEZpZWxkR3JvdXAgZm9ybSBkYXRhIHdpdGhvdXQgZmFjZXQgZGVmaW5pdGlvblwiKTtcblx0fVxuXG5cdGNvbnN0IGZvcm1FbGVtZW50cyA9IGluc2VydEN1c3RvbUVsZW1lbnRzKFxuXHRcdGdldEZvcm1FbGVtZW50c0Zyb21Bbm5vdGF0aW9ucyhmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdGdldEZvcm1FbGVtZW50c0Zyb21NYW5pZmVzdChmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpXG5cdCk7XG5cblx0cmV0dXJuIHtcblx0XHRpZDogSGVhZGVyRmFjZXRGb3JtSUQoeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH0pLFxuXHRcdGxhYmVsOiBmYWNldERlZmluaXRpb24uTGFiZWwgYXMgc3RyaW5nLFxuXHRcdGZvcm1FbGVtZW50c1xuXHR9O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBhcnJheSBvZiBtYW5pZmVzdCBiYXNlZCBmb3JtRWxlbWVudHMuXG4gKlxuICogQHBhcmFtIHtGYWNldFR5cGV9IGZhY2V0RGVmaW5pdGlvbiBmb3IgdGhpcyBvYmplY3RcbiAqIEBwYXJhbSB7Q29udmVydGVyQ29udGV4dH0gY29udmVydGVyQ29udGV4dCBmb3IgdGhpcyBvYmplY3RcbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9IEFubm90YXRpb24gYmFzZWQgRm9ybUVsZW1lbnRzXG4gKi9cbmZ1bmN0aW9uIGdldEZvcm1FbGVtZW50c0Zyb21Bbm5vdGF0aW9ucyhmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBBbm5vdGF0aW9uRm9ybUVsZW1lbnRbXSB7XG5cdGNvbnN0IGFubm90YXRpb25CYXNlZEZvcm1FbGVtZW50czogQW5ub3RhdGlvbkZvcm1FbGVtZW50W10gPSBbXTtcblxuXHQvLyBSZWZlcmVuY2VVUkxGYWNldCBhbmQgQ29sbGVjdGlvbkZhY2V0IGRvIG5vdCBoYXZlIFRhcmdldCBwcm9wZXJ0eS5cblx0aWYgKGZhY2V0RGVmaW5pdGlvbi4kVHlwZSAhPT0gVUlBbm5vdGF0aW9uVHlwZXMuUmVmZXJlbmNlVVJMRmFjZXQgJiYgZmFjZXREZWZpbml0aW9uLiRUeXBlICE9PSBVSUFubm90YXRpb25UeXBlcy5Db2xsZWN0aW9uRmFjZXQpIHtcblx0XHRmYWNldERlZmluaXRpb24uVGFyZ2V0Py4kdGFyZ2V0Py5EYXRhLmZvckVhY2goKGRhdGFGaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcykgPT4ge1xuXHRcdFx0aWYgKCEoZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuID09PSB0cnVlKSkge1xuXHRcdFx0XHRjb25zdCBzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoID0gZ2V0U2VtYW50aWNPYmplY3RQYXRoKGNvbnZlcnRlckNvbnRleHQsIGRhdGFGaWVsZCk7XG5cdFx0XHRcdGlmIChkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZCkge1xuXHRcdFx0XHRcdGNvbnN0IHsgYW5ub3RhdGlvbnMgfSA9IGRhdGFGaWVsZDtcblx0XHRcdFx0XHRhbm5vdGF0aW9uQmFzZWRGb3JtRWxlbWVudHMucHVzaCh7XG5cdFx0XHRcdFx0XHRpc1ZhbHVlTXVsdGlsaW5lVGV4dDogZGF0YUZpZWxkLlZhbHVlPy4kdGFyZ2V0Py5hbm5vdGF0aW9ucz8uVUk/Lk11bHRpTGluZVRleHQgPT09IHRydWUsXG5cdFx0XHRcdFx0XHR0eXBlOiBGb3JtRWxlbWVudFR5cGUuQW5ub3RhdGlvbixcblx0XHRcdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpLFxuXHRcdFx0XHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcobm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGFubm90YXRpb25zPy5VST8uSGlkZGVuKSwgdHJ1ZSkpKSxcblx0XHRcdFx0XHRcdGxhYmVsOiBkYXRhRmllbGQuVmFsdWU/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5Db21tb24/LkxhYmVsIHx8IGRhdGFGaWVsZC5MYWJlbCxcblx0XHRcdFx0XHRcdGlkUHJlZml4OiBIZWFkZXJGYWNldEZvcm1JRCh7IEZhY2V0OiBmYWNldERlZmluaXRpb24gfSwgZGF0YUZpZWxkKSxcblx0XHRcdFx0XHRcdHZhbHVlRm9ybWF0OiBkYXRhRmllbGQuVmFsdWU/LiR0YXJnZXQ/LnR5cGUgPT09IFwiRWRtLkRhdGVcIiA/IFwibG9uZ1wiIDogdW5kZWZpbmVkLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChkYXRhRmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSArIFwiL1wiLFxuXHRcdFx0XHRcdFx0c2VtYW50aWNPYmplY3RQYXRoOiBzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uKSB7XG5cdFx0XHRcdFx0Y29uc3QgeyBhbm5vdGF0aW9ucyB9ID0gZGF0YUZpZWxkO1xuXHRcdFx0XHRcdGFubm90YXRpb25CYXNlZEZvcm1FbGVtZW50cy5wdXNoKHtcblx0XHRcdFx0XHRcdGlzVmFsdWVNdWx0aWxpbmVUZXh0OiBkYXRhRmllbGQuVGFyZ2V0Py4kdGFyZ2V0Py5hbm5vdGF0aW9ucz8uVUk/Lk11bHRpTGluZVRleHQgPT09IHRydWUsXG5cdFx0XHRcdFx0XHR0eXBlOiBGb3JtRWxlbWVudFR5cGUuQW5ub3RhdGlvbixcblx0XHRcdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpLFxuXHRcdFx0XHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcobm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGFubm90YXRpb25zPy5VST8uSGlkZGVuKSwgdHJ1ZSkpKSxcblx0XHRcdFx0XHRcdGxhYmVsOiBkYXRhRmllbGQuVGFyZ2V0Py4kdGFyZ2V0Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5MYWJlbCB8fCBkYXRhRmllbGQuTGFiZWwsXG5cdFx0XHRcdFx0XHRpZFByZWZpeDogSGVhZGVyRmFjZXRGb3JtSUQoeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH0sIGRhdGFGaWVsZCksXG5cdFx0XHRcdFx0XHR2YWx1ZUZvcm1hdDogZGF0YUZpZWxkLlRhcmdldD8uJHRhcmdldD8udHlwZSA9PT0gXCJFZG0uRGF0ZVwiID8gXCJsb25nXCIgOiB1bmRlZmluZWQsXG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpICsgXCIvXCIsXG5cdFx0XHRcdFx0XHRzZW1hbnRpY09iamVjdFBhdGg6IHNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGhcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIGFubm90YXRpb25CYXNlZEZvcm1FbGVtZW50cztcbn1cblxuZnVuY3Rpb24gZ2V0RGF0YVBvaW50RGF0YShmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMpOiBIZWFkZXJEYXRhUG9pbnREYXRhIHtcblx0bGV0IHR5cGUgPSBIZWFkZXJEYXRhUG9pbnRUeXBlLkNvbnRlbnQ7XG5cdGlmIChmYWNldERlZmluaXRpb24uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0KSB7XG5cdFx0aWYgKGZhY2V0RGVmaW5pdGlvbi5UYXJnZXQ/LiR0YXJnZXQ/LlZpc3VhbGl6YXRpb24gPT09IFwiVUkuVmlzdWFsaXphdGlvblR5cGUvUHJvZ3Jlc3NcIikge1xuXHRcdFx0dHlwZSA9IEhlYWRlckRhdGFQb2ludFR5cGUuUHJvZ3Jlc3NJbmRpY2F0b3I7XG5cdFx0fSBlbHNlIGlmIChmYWNldERlZmluaXRpb24uVGFyZ2V0Py4kdGFyZ2V0Py5WaXN1YWxpemF0aW9uID09PSBcIlVJLlZpc3VhbGl6YXRpb25UeXBlL1JhdGluZ1wiKSB7XG5cdFx0XHR0eXBlID0gSGVhZGVyRGF0YVBvaW50VHlwZS5SYXRpbmdJbmRpY2F0b3I7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHsgdHlwZSB9O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBhbm5vdGF0aW9uIGJhc2VkIGhlYWRlciBmYWNldC5cbiAqXG4gKiBAcGFyYW0ge0ZhY2V0VHlwZXN9IGZhY2V0RGVmaW5pdGlvbiBvZiB0aGlzIG9iamVjdFxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0IGZvciB0aGlzIG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHtPYmplY3RQYWdlSGVhZGVyRmFjZXR9IEFubm90YXRpb24gYmFzZWQgaGVhZGVyIGZhY2V0IGNyZWF0ZWRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSGVhZGVyRmFjZXQoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogT2JqZWN0UGFnZUhlYWRlckZhY2V0IHwgdW5kZWZpbmVkIHtcblx0bGV0IGhlYWRlckZhY2V0OiBPYmplY3RQYWdlSGVhZGVyRmFjZXQgfCB1bmRlZmluZWQ7XG5cdHN3aXRjaCAoZmFjZXREZWZpbml0aW9uLiRUeXBlKSB7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5SZWZlcmVuY2VGYWNldDpcblx0XHRcdGhlYWRlckZhY2V0ID0gY3JlYXRlUmVmZXJlbmNlSGVhZGVyRmFjZXQoZmFjZXREZWZpbml0aW9uLCBmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkNvbGxlY3Rpb25GYWNldDpcblx0XHRcdGhlYWRlckZhY2V0ID0gY3JlYXRlQ29sbGVjdGlvbkhlYWRlckZhY2V0KGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCk7XG5cdFx0XHRicmVhaztcblx0fVxuXG5cdHJldHVybiBoZWFkZXJGYWNldDtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBDb252ZXJ0ICYgQnVpbGQgTWFuaWZlc3QgQmFzZWQgSGVhZGVyIEZhY2V0c1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIGdlbmVyYXRlQmluZGluZyhyZXF1ZXN0R3JvdXBJZD86IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdGlmICghcmVxdWVzdEdyb3VwSWQpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cdGNvbnN0IGdyb3VwSWQgPVxuXHRcdFtcIkhlcm9lc1wiLCBcIkRlY29yYXRpb25cIiwgXCJXb3JrZXJzXCIsIFwiTG9uZ1J1bm5lcnNcIl0uaW5kZXhPZihyZXF1ZXN0R3JvdXBJZCkgIT09IC0xID8gXCIkYXV0by5cIiArIHJlcXVlc3RHcm91cElkIDogcmVxdWVzdEdyb3VwSWQ7XG5cblx0cmV0dXJuIFwieyBwYXRoIDogJycsIHBhcmFtZXRlcnMgOiB7ICQkZ3JvdXBJZCA6ICdcIiArIGdyb3VwSWQgKyBcIicgfSB9XCI7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgbWFuaWZlc3QgYmFzZWQgY3VzdG9tIGhlYWRlciBmYWNldC5cbiAqXG4gKiBAcGFyYW0ge01hbmlmZXN0SGVhZGVyRmFjZXR9IGN1c3RvbUhlYWRlckZhY2V0RGVmaW5pdGlvbiBmb3IgdGhpcyBvYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBoZWFkZXJGYWNldEtleSBvZiB0aGlzIG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHtDdXN0b21PYmplY3RQYWdlSGVhZGVyRmFjZXR9IG1hbmlmZXN0IGJhc2VkIGN1c3RvbSBoZWFkZXIgZmFjZXQgY3JlYXRlZFxuICovXG5mdW5jdGlvbiBjcmVhdGVDdXN0b21IZWFkZXJGYWNldChjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb246IE1hbmlmZXN0SGVhZGVyRmFjZXQsIGhlYWRlckZhY2V0S2V5OiBzdHJpbmcpOiBDdXN0b21PYmplY3RQYWdlSGVhZGVyRmFjZXQge1xuXHRjb25zdCBjdXN0b21IZWFkZXJGYWNldElEID0gQ3VzdG9tSGVhZGVyRmFjZXRJRChoZWFkZXJGYWNldEtleSk7XG5cblx0bGV0IHBvc2l0aW9uOiBQb3NpdGlvbiB8IHVuZGVmaW5lZCA9IGN1c3RvbUhlYWRlckZhY2V0RGVmaW5pdGlvbi5wb3NpdGlvbjtcblx0aWYgKCFwb3NpdGlvbikge1xuXHRcdHBvc2l0aW9uID0ge1xuXHRcdFx0cGxhY2VtZW50OiBQbGFjZW1lbnQuQWZ0ZXJcblx0XHR9O1xuXHR9XG5cdHJldHVybiB7XG5cdFx0ZmFjZXRUeXBlOiBGYWNldFR5cGUuUmVmZXJlbmNlLFxuXHRcdGZhY2V0czogW10sXG5cdFx0dHlwZTogY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uLnR5cGUsXG5cdFx0aWQ6IGN1c3RvbUhlYWRlckZhY2V0SUQsXG5cdFx0Y29udGFpbmVySWQ6IGN1c3RvbUhlYWRlckZhY2V0SUQsXG5cdFx0a2V5OiBoZWFkZXJGYWNldEtleSxcblx0XHRwb3NpdGlvbjogcG9zaXRpb24sXG5cdFx0dmlzaWJsZTogY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uLnZpc2libGUsXG5cdFx0ZnJhZ21lbnROYW1lOiBjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb24ubmFtZSxcblx0XHR0aXRsZTogY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uLnRpdGxlLFxuXHRcdHN1YlRpdGxlOiBjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb24uc3ViVGl0bGUsXG5cdFx0c3Rhc2hlZDogY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uLnN0YXNoZWQgfHwgZmFsc2UsXG5cdFx0ZmxleFNldHRpbmdzOiB7IC4uLnsgZGVzaWdudGltZTogRmxleERlc2lnblRpbWVUeXBlLkRlZmF1bHQgfSwgLi4uY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uLmZsZXhTZXR0aW5ncyB9LFxuXHRcdGJpbmRpbmc6IGdlbmVyYXRlQmluZGluZyhjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb24ucmVxdWVzdEdyb3VwSWQpXG5cdH07XG59XG4iXX0=