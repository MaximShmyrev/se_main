/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the FilterBar and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	[
		"sap/ui/mdc/FilterBarDelegate",
		"sap/ui/model/json/JSONModel",
		"sap/fe/core/TemplateModel",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/fe/macros/field/FieldHelper",
		"sap/fe/macros/filter/FilterUtils",
		"sap/ui/mdc/odata/v4/TypeUtil",
		"sap/fe/macros/ResourceModel",
		"sap/base/util/merge",
		"sap/fe/macros/DelegateUtil",
		"sap/fe/macros/FilterBarHelper",
		"sap/base/Log",
		"sap/base/util/JSTokenizer",
		"sap/fe/core/templating/PropertyFormatters"
	],
	function(
		FilterBarDelegate,
		JSONModel,
		TemplateModel,
		CommonHelper,
		CommonUtils,
		StableIdHelper,
		FieldHelper,
		FilterUtils,
		TypeUtil,
		ResourceModel,
		mergeObjects,
		DelegateUtil,
		FilterBarHelper,
		Log,
		JSTokenizer,
		PropertyFormatters
	) {
		"use strict";
		var ODataFilterBarDelegate = Object.assign({}, FilterBarDelegate),
			EDIT_STATE_PROPERTY_NAME = "$editState",
			SEARCH_PROPERTY_NAME = "$search",
			VALUE_HELP_TYPE = "FilterFieldValueHelp",
			FETCHED_PROPERTIES_DATA_KEY = "sap_fe_FilterBarDelegate_propertyInfoMap",
			CONDITION_PATH_TO_PROPERTY_PATH_REGEX = /\+|\*/g;

		function _getSearchFilterPropertyInfo() {
			return {
				name: SEARCH_PROPERTY_NAME,
				path: SEARCH_PROPERTY_NAME,
				typeConfig: TypeUtil.getTypeConfig("sap.ui.model.odata.type.String"),
				maxConditions: 1
			};
		}

		function _getEditStateFilterPropertyInfo() {
			return {
				name: EDIT_STATE_PROPERTY_NAME,
				path: EDIT_STATE_PROPERTY_NAME,
				groupLabel: "",
				group: "",
				label: ResourceModel.getText("M_COMMON_FILTERBAR_EDITING_STATUS"),
				tooltip: null,
				hiddenFilter: false,
				typeConfig: TypeUtil.getTypeConfig("sap.ui.model.odata.type.String"),

				defaultFilterConditions: [
					{
						fieldPath: "$editState",
						operator: "DRAFT_EDIT_STATE",
						values: ["0"]
					}
				]
			};
		}

		function _templateEditState(oFilterBar, oModifier) {
			var oThis = new JSONModel({
					id: DelegateUtil.getCustomData(oFilterBar, "localId")
				}),
				oPreprocessorSettings = {
					bindingContexts: {
						"this": oThis.createBindingContext("/")
					},
					models: {
						"this.i18n": ResourceModel.getModel(),
						"this": oThis
					}
				};

			return DelegateUtil.templateControlFragment(
				"sap.fe.macros.filter.DraftEditState",
				oPreprocessorSettings,
				undefined,
				oModifier
			).finally(function() {
				oThis.destroy();
			});
		}

		function _templateCustomFilter(oFilterBar, sIdPrefix, oSelectionFieldInfo, oMetaModel, oModifier) {
			var oThis = new JSONModel({
					id: _generateIdPrefix(DelegateUtil.getCustomData(oFilterBar, "localId"), sIdPrefix)
				}),
				oItemModel = new TemplateModel(oSelectionFieldInfo, oMetaModel),
				oPreprocessorSettings = {
					bindingContexts: {
						"this": oThis.createBindingContext("/"),
						"item": oItemModel.createBindingContext("/")
					},
					models: {
						"this": oThis,
						"item": oItemModel
					}
				};

			return DelegateUtil.templateControlFragment(
				"sap.fe.macros.filter.CustomFilter",
				oPreprocessorSettings,
				undefined,
				oModifier
			).finally(function() {
				oThis.destroy();
				oItemModel.destroy();
			});
		}

		function _getPropertyPath(sConditionPath) {
			return sConditionPath.replace(CONDITION_PATH_TO_PROPERTY_PATH_REGEX, "");
		}

		function _findSelectionField(aSelectionFields, sFlexName) {
			return aSelectionFields.find(function(oSelectionField) {
				return oSelectionField.conditionPath === sFlexName && oSelectionField.availability !== "Hidden";
			});
		}

		function _fetchPropertyInfo(oMetaModel, sEntitySetPath, oFilterFieldInfo) {
			var sAnnotationPath = oFilterFieldInfo.annotationPath,
				sParentPath = sAnnotationPath.substr(0, sAnnotationPath.lastIndexOf("/")),
				oProperty = oMetaModel.getObject(sAnnotationPath),
				oPropertyAnnotations = oMetaModel.getObject(sAnnotationPath + "@"),
				oCollectionAnnotations = oMetaModel.getObject(sParentPath + "/@"),
				oFilterDefaultValue,
				oFilterDefaultValueAnnotation,
				oPropertyInfo,
				sLabel = oFilterFieldInfo.label,
				oPropertyContext = oMetaModel.createBindingContext(sAnnotationPath),
				bRemoveFromAppState =
					oPropertyAnnotations["@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"] ||
					oPropertyAnnotations["@com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"] ||
					oPropertyAnnotations["@com.sap.vocabularies.Analytics.v1.Measure"];

			// check if type can be used for filtering, unsupported types are eg. Edm.Stream, field control, messages -> they have no sap.ui.model.type correspondence
			if (!CommonUtils.isPropertyFilterable(oMetaModel, sEntitySetPath, _getPropertyPath(oFilterFieldInfo.conditionPath), true)) {
				return null;
			}

			oFilterDefaultValueAnnotation = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.FilterDefaultValue"];
			if (oFilterDefaultValueAnnotation) {
				oFilterDefaultValue = oFilterDefaultValueAnnotation["$" + DelegateUtil.getModelType(oProperty.$Type)];
			}

			oPropertyInfo = {
				name: oFilterFieldInfo.conditionPath,
				path: oFilterFieldInfo.conditionPath,
				groupLabel: oFilterFieldInfo.groupLabel,
				group: oFilterFieldInfo.group,
				label: sLabel,
				tooltip: oPropertyAnnotations["@com.sap.vocabularies.Common.v1.QuickInfo"] || null,
				hiddenFilter: oFilterFieldInfo.availability === "Hidden",
				removeFromAppState: bRemoveFromAppState,
				hasValueHelp: PropertyFormatters.hasValueHelp(oPropertyContext.getObject(), { context: oPropertyContext })
			};

			if (oFilterDefaultValue) {
				oPropertyInfo.defaultFilterConditions = [
					{
						fieldPath: oFilterFieldInfo.conditionPath,
						operator: "EQ",
						values: [oFilterDefaultValue]
					}
				];
			}

			// format options
			oPropertyInfo.formatOptions = JSTokenizer.parseJS(FieldHelper.formatOptions(oProperty, { context: oPropertyContext }) || "{}");
			// constraints
			oPropertyInfo.constraints = JSTokenizer.parseJS(FieldHelper.constraints(oProperty, { context: oPropertyContext }) || "{}");

			oPropertyInfo.typeConfig = TypeUtil.getTypeConfig(oProperty.$Type, oPropertyInfo.formatOptions, oPropertyInfo.constraints);
			oPropertyInfo.display = FieldHelper.displayMode(oPropertyAnnotations, oCollectionAnnotations);

			return oPropertyInfo;
		}

		function _generateIdPrefix(sFilterBarId, sControlType, sNavigationPrefix) {
			return sNavigationPrefix
				? StableIdHelper.generate([sFilterBarId, sControlType, sNavigationPrefix])
				: StableIdHelper.generate([sFilterBarId, sControlType]);
		}

		function _templateValueHelp(oSettings, oParameters) {
			return Promise.resolve()
				.then(function() {
					var oThis = new JSONModel({
							idPrefix: oParameters.sVhIdPrefix,
							conditionModel: "$filters",
							navigationPrefix: oParameters.sNavigationPrefix ? "/" + oParameters.sNavigationPrefix : "",
							filterFieldValueHelp: true,
							requestGroupId: oParameters.sValueHelpGroupId,
							useSemanticDateRange: oParameters.bUseSemanticDateRange
						}),
						oPreprocessorSettings = mergeObjects({}, oSettings, {
							bindingContexts: {
								"this": oThis.createBindingContext("/")
							},
							models: {
								"this": oThis
							}
						});

					return DelegateUtil.templateControlFragment("sap.fe.macros.internal.valuehelp.ValueHelp", oPreprocessorSettings, {
						isXML: oSettings.isXML
					})
						.then(function(oVHElement) {
							if (oVHElement) {
								var sAggregationName = "dependents";
								if (oParameters.oModifier) {
									oParameters.oModifier.insertAggregation(oParameters.oControl, sAggregationName, oVHElement, 0);
								} else {
									oParameters.oControl.insertAggregation(sAggregationName, oVHElement, 0, false);
								}
							}
						})
						.finally(function() {
							oThis.destroy();
						});
				})
				.catch(function(oError) {
					Log.error("Error while evaluating DelegateUtil.isValueHelpRequired", oError);
				});
		}

		function _templateFilterField(oSettings, oParameters) {
			var oThis = new JSONModel({
					idPrefix: oParameters.sIdPrefix,
					vhIdPrefix: oParameters.sVhIdPrefix,
					propertyPath: oParameters.sPropertyName,
					navigationPrefix: oParameters.sNavigationPrefix ? "/" + oParameters.sNavigationPrefix : "",
					useSemanticDateRange: oParameters.bUseSemanticDateRange,
					settings: oParameters.oSettings
				}),
				oPreprocessorSettings = mergeObjects({}, oSettings, {
					bindingContexts: {
						"this": oThis.createBindingContext("/")
					},
					models: {
						"this": oThis
					}
				});

			return DelegateUtil.templateControlFragment("sap.fe.macros.FilterField", oPreprocessorSettings, {
				isXML: oSettings.isXML
			}).finally(function() {
				oThis.destroy();
			});
		}

		/**
		 * Method responsible for creating filter field in standalone / personalization filter bar.
		 *
		 * @param {string} sPropertyInfoName Name of the property being added as filter field
		 * @param {object} oParentControl Parent control instance to which the filter field is added
		 * @param {map} mPropertyBag Instance of property bag from Flex API
		 * @returns {Promise} once resolved, a filter field definition is returned
		 */
		ODataFilterBarDelegate.addItem = function(sPropertyInfoName, oParentControl, mPropertyBag) {
			if (!mPropertyBag) {
				// Invoked during runtime.
				return ODataFilterBarDelegate._addP13nItem(sPropertyInfoName, oParentControl);
			}

			var oMetaModel = mPropertyBag.appComponent && mPropertyBag.appComponent.getModel().getMetaModel();
			if (!oMetaModel) {
				return Promise.resolve(null);
			}

			return ODataFilterBarDelegate._addFlexItem(sPropertyInfoName, oParentControl, oMetaModel, mPropertyBag.modifier);
		};

		/**
		 * Responsible to create Filter field in Table adaptation FilterBar.
		 *
		 * @param {string} sPropertyInfoName Entity type property name for which the filter field needs to be created
		 * @param {object} oParentControl Instance of the parent control
		 * @returns {Promise} Once resolved a filter field definition is returned
		 */
		ODataFilterBarDelegate._addP13nItem = function(sPropertyInfoName, oParentControl) {
			return DelegateUtil.fetchModel(oParentControl)
				.then(function(oModel) {
					return ODataFilterBarDelegate._addFlexItem(sPropertyInfoName, oParentControl, oModel.getMetaModel(), undefined);
				})
				.catch(function() {
					Log.error("Model could not be resolved");
					return null;
				});
		};

		ODataFilterBarDelegate.fetchPropertiesForEntity = function(sEntitySetPath, oMetaModel, oFilterControl) {
			var oEntityType = oMetaModel.getObject(sEntitySetPath + "/");
			if (!oFilterControl || !oEntityType) {
				return [];
			}
			var mEntitySetAnnotations = oMetaModel.getObject(sEntitySetPath + "@"),
				mFilterFields = FilterUtils.getConvertedFilterFields(oFilterControl, sEntitySetPath),
				oPropertyInfo,
				aFetchedProperties = [],
				aRequiredProps = (mEntitySetAnnotations && DelegateUtil.getRequiredProperties(mEntitySetAnnotations)) || [],
				aNonFilterableProps = (mEntitySetAnnotations && DelegateUtil.getNonFilterableProperties(mEntitySetAnnotations)) || [],
				//SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression
				mAllowedExpressions = (mEntitySetAnnotations && DelegateUtil.getFilterAllowedExpressions(mEntitySetAnnotations)) || {};

			Object.keys(mFilterFields).forEach(function(sFilterFieldKey) {
				var oConvertedProperty = mFilterFields[sFilterFieldKey];
				var sPropertyPath = _getPropertyPath(oConvertedProperty.conditionPath);
				// TODO double check that this is obsolete, due to additional check in _fetchPropertyInfo (by calling CommonHelper.isPropertyFilterable)
				if (aNonFilterableProps.indexOf(sPropertyPath) === -1) {
					oPropertyInfo = _fetchPropertyInfo(oMetaModel, sEntitySetPath, oConvertedProperty);
					if (oPropertyInfo) {
						if (mAllowedExpressions[sPropertyPath]) {
							oPropertyInfo.filterExpression = mAllowedExpressions[sPropertyPath];
						} else {
							oPropertyInfo.filterExpression = "auto"; // default
						}
						oPropertyInfo.maxConditions = DelegateUtil.isMultiValue(oPropertyInfo) ? -1 : 1;
						oPropertyInfo.required = aRequiredProps.indexOf(sPropertyPath) >= 0;
						oPropertyInfo.visible = oConvertedProperty.availability === "Default";
						oPropertyInfo.label = DelegateUtil.getLocalizedText(oConvertedProperty.label, oFilterControl);
						aFetchedProperties.push(oPropertyInfo);
					}
				}
			});

			if (oFilterControl.data("showDraftEditState")) {
				aFetchedProperties.push(_getEditStateFilterPropertyInfo());
			}

			if (
				FilterBarHelper.checkIfBasicSearchIsVisible(
					oFilterControl.data("hideBasicSearch") === "true",
					oMetaModel.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.SearchRestrictions")
				)
			) {
				aFetchedProperties.push(_getSearchFilterPropertyInfo());
			}

			return aFetchedProperties;
		};

		ODataFilterBarDelegate._addFlexItem = function(sFlexPropertyName, oParentControl, oMetaModel, oModifier) {
			var sIdPrefix = oModifier ? "" : "Adaptation",
				aSelectionFields = FilterUtils.getConvertedFilterFields(oParentControl),
				oSelectionField = _findSelectionField(aSelectionFields, sFlexPropertyName),
				sPropertyPath = _getPropertyPath(sFlexPropertyName),
				bIsXML = !!oModifier && oModifier.targets === "xmlTree";
			if (sFlexPropertyName === EDIT_STATE_PROPERTY_NAME) {
				return _templateEditState(oParentControl, oModifier);
			} else if (sFlexPropertyName === SEARCH_PROPERTY_NAME) {
				return Promise.resolve(null);
			} else if (oSelectionField && oSelectionField.template) {
				return _templateCustomFilter(oParentControl, sIdPrefix, oSelectionField, oMetaModel, oModifier);
			}

			var sNavigationPath = CommonHelper.getNavigationPath(sPropertyPath),
				sEntitySetPath =
					DelegateUtil.getCustomData(oParentControl, "entitySet", oModifier) ||
					DelegateUtil.getCustomData(oParentControl, "targetCollectionName", oModifier),
				oPropertyContext = oMetaModel.createBindingContext(sEntitySetPath + "/" + sPropertyPath),
				oTargetEntityContext = FilterBarHelper.getTargetEntityContext(oPropertyContext),
				sFilterBarId = oModifier ? oModifier.getId(oParentControl) : oParentControl.getId(),
				oSettings = {
					bindingContexts: {
						"entitySet": oTargetEntityContext,
						"property": oPropertyContext
					},
					models: {
						"entitySet": oMetaModel,
						"property": oMetaModel
					},
					isXML: bIsXML
				},
				oParameters = {
					sPropertyName: sPropertyPath,
					sBindingPath: sEntitySetPath,
					sValueHelpType: VALUE_HELP_TYPE,
					oControl: oParentControl,
					oMetaModel: oMetaModel,
					oModifier: oModifier,
					sIdPrefix: _generateIdPrefix(sFilterBarId, sIdPrefix + "FilterField", sNavigationPath),
					sVhIdPrefix: _generateIdPrefix(sFilterBarId, sIdPrefix + VALUE_HELP_TYPE, sNavigationPath),
					sNavigationPrefix: sNavigationPath,
					sValueHelpGroupId: DelegateUtil.getCustomData(oParentControl, "valueHelpRequestGroupId", oModifier),
					bUseSemanticDateRange: DelegateUtil.getCustomData(oParentControl, "useSemanticDateRange", oModifier),
					oSettings: oSelectionField ? oSelectionField.settings : {}
				};

			return DelegateUtil.doesValueHelpExist(oParameters)
				.then(function(bValueHelpExists) {
					if (!bValueHelpExists) {
						return _templateValueHelp(oSettings, oParameters);
					}
					return Promise.resolve();
				})
				.then(_templateFilterField.bind(undefined, oSettings, oParameters));
		};

		function _getCachedProperties(oFilterBar) {
			// properties are not cached during templating
			if (oFilterBar instanceof window.Element) {
				return null;
			}
			return DelegateUtil.getCustomData(oFilterBar, FETCHED_PROPERTIES_DATA_KEY);
		}

		function _setCachedProperties(oFilterBar, aFetchedProperties) {
			// do not cache during templating, else it becomes part of the cached view
			if (oFilterBar instanceof window.Element) {
				return;
			}
			DelegateUtil.setCustomData(oFilterBar, FETCHED_PROPERTIES_DATA_KEY, aFetchedProperties);
		}

		function _getCachedOrFetchPropertiesForEntity(sEntitySet, oMetaModel, oFilterBar) {
			var aFetchedProperties = _getCachedProperties(oFilterBar);

			if (!aFetchedProperties) {
				aFetchedProperties = ODataFilterBarDelegate.fetchPropertiesForEntity(sEntitySet, oMetaModel, oFilterBar);
				_setCachedProperties(oFilterBar, aFetchedProperties);
			}
			return aFetchedProperties;
		}

		/**
		 * Fetches the relevant metadata for the filter bar and returns property info array.
		 * @param {sap.ui.mdc.FilterBar} oFilterBar - the instance of filter bar
		 * @returns {Promise} once resolved an array of property info is returned
		 */
		ODataFilterBarDelegate.fetchProperties = function(oFilterBar) {
			var sEntitySet = DelegateUtil.getCustomData(oFilterBar, "entitySet");
			return DelegateUtil.fetchModel(oFilterBar).then(function(oModel) {
				if (!oModel) {
					return [];
				}
				return _getCachedOrFetchPropertiesForEntity(sEntitySet, oModel.getMetaModel(), oFilterBar);
			});
		};

		ODataFilterBarDelegate.getTypeUtil = function(oPayload) {
			return TypeUtil;
		};

		return ODataFilterBarDelegate;
	},
	/* bExport= */ false
);
