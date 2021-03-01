/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Util class used to help create the table/column delegates and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	[
		"sap/ui/mdc/TableDelegate",
		"sap/ui/mdc/FilterBarDelegate",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/Fragment",
		"sap/ui/core/Element",
		"sap/ui/model/json/JSONModel",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/fe/macros/field/FieldHelper"
	],
	function(
		TableDelegate,
		FilterBarDelegate,
		XMLTemplateProcessor,
		XMLPreprocessor,
		Fragment,
		CoreElement,
		JSONModel,
		CommonHelper,
		StableIdHelper,
		FieldHelper
	) {
		"use strict";

		var oDelegateUtil = {},
			NS_MACRODATA = "http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1",
			mDefaultTypeForEdmType = {
				"Edm.Boolean": {
					modelType: "Bool"
				},
				"Edm.Byte": {
					modelType: "Int"
				},
				"Edm.Date": {
					modelType: "Date"
				},
				"Edm.DateTime": {
					modelType: "Date"
				},
				"Edm.DateTimeOffset": {
					modelType: "DateTimeOffset"
				},
				"Edm.Decimal": {
					modelType: "Decimal"
				},
				"Edm.Double": {
					modelType: "Float"
				},
				"Edm.Float": {
					modelType: "Float"
				},
				"Edm.Guid": {
					modelType: "Guid"
				},
				"Edm.Int16": {
					modelType: "Int"
				},
				"Edm.Int32": {
					modelType: "Int"
				},
				"Edm.Int64": {
					modelType: "Int"
				},
				"Edm.SByte": {
					modelType: "Int"
				},
				"Edm.Single": {
					modelType: "Float"
				},
				"Edm.String": {
					modelType: "String"
				},
				"Edm.Time": {
					modelType: "TimeOfDay"
				},
				"Edm.TimeOfDay": {
					modelType: "TimeOfDay"
				},
				"Edm.Stream": {
					//no corresponding modelType - ignore for filtering
				}
			};

		function _retrieveModel() {
			this.control.detachModelContextChange(_retrieveModel, this);
			var sModelName = this.modelName,
				oModel = this.control.getModel(sModelName);

			if (oModel) {
				this.resolve(oModel);
			} else {
				this.control.attachModelContextChange(_retrieveModel, this);
			}
		}

		/**
		 * This is an intermediate fix for missing functionality on MDC site. Once MDC controls are supporting i18n this shall be taken out.
		 * Takes in i18n Keys and makes them.
		 *
		 * @param {string} sTextOrToken String to check and in case of an i18n string transform to proper translation
		 * @param {object} oControl Needed to get the view and the connected resource bundle
		 * @returns {string} Returns either the translated string or if the string never was an i18n string the original input string.
		 * @private
		 */
		oDelegateUtil.getLocalizedText = function(sTextOrToken, oControl) {
			var aMatch = /{([A-Za-z0-9_.|@]+)>([A-Za-z0-9_.|]+)}/.exec(sTextOrToken);
			if (aMatch) {
				var oResourceBundle = oControl.getModel(aMatch[1]).getResourceBundle();
				return oResourceBundle.getText(aMatch[2]);
			}
			return sTextOrToken;
		};

		oDelegateUtil.getCustomData = function(oControl, sProperty, oModifier) {
			if (oModifier) {
				var aCustomData = oModifier.getAggregation(oControl, "customData").filter(function(oCustomData) {
					return oModifier.getProperty(oCustomData, "key") === sProperty;
				});
				if (aCustomData.length === 1) {
					return oModifier.getProperty(aCustomData[0], "value");
				}
				return undefined;
			} else {
				// Delegate invoked from a non-flex change - FilterBarDelegate._addP13nItem for OP table filtering, FilterBarDelegate.fetchProperties etc.
				if (oControl && sProperty) {
					if (oControl instanceof window.Element) {
						return oControl.getAttributeNS(NS_MACRODATA, sProperty);
					}
					if (oControl.data instanceof Function) {
						return oControl.data(sProperty);
					}
				}
				return undefined;
			}
		};

		oDelegateUtil.setCustomData = function(oControl, sProperty, vValue) {
			if (oControl && sProperty) {
				if (oControl instanceof window.Element) {
					return oControl.setAttributeNS(NS_MACRODATA, "customData:" + sProperty, vValue);
				}
				if (oControl.data instanceof Function) {
					return oControl.data(sProperty, vValue);
				}
			}
		};

		oDelegateUtil.fetchPropertiesForEntity = function(sEntitySet, oMetaModel) {
			return oMetaModel.requestObject(sEntitySet + "/");
		};

		oDelegateUtil.fetchAnnotationsForEntity = function(sEntitySet, oMetaModel) {
			return oMetaModel.requestObject(sEntitySet + "@");
		};

		oDelegateUtil.fetchModel = function(oControl) {
			return new Promise(function(resolve, reject) {
				var sModelName = oControl.getDelegate().payload && oControl.getDelegate().payload.modelName,
					oContext = { modelName: sModelName, control: oControl, resolve: resolve };
				_retrieveModel.call(oContext);
			});
		};

		oDelegateUtil.loadMacroLibrary = function() {
			return new Promise(function(resolve, reject) {
				sap.ui.require(["sap/fe/macros/macroLibrary"], function(/*macroLibrary*/) {
					resolve();
				});
			});
		};

		oDelegateUtil.templateControlFragment = function(sFragmentName, oPreprocessorSettings, oOptions, oModifier) {
			oOptions = oOptions || {};
			if (oModifier) {
				return oModifier.templateControlFragment(sFragmentName, oPreprocessorSettings, oOptions.view).then(function(oFragment) {
					// This is required as Flex returns an HTMLCollection as templating result in XML time.
					return oModifier.targets === "xmlTree" && oFragment.length > 0 ? oFragment[0] : oFragment;
				});
			} else {
				return this.loadMacroLibrary()
					.then(function() {
						return XMLPreprocessor.process(
							XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment"),
							{ name: sFragmentName },
							oPreprocessorSettings
						);
					})
					.then(function(oFragment) {
						var oControl = oFragment.firstElementChild;
						if (!!oOptions.isXML && oControl) {
							return oControl;
						}
						return Fragment.load({
							id: oOptions.id,
							definition: oFragment,
							controller: oOptions.controller
						});
					});
			}
		};

		oDelegateUtil.doesValueHelpExist = function(mParameters) {
			var sPropertyName = mParameters.sPropertyName || "",
				sValueHelpType = mParameters.sValueHelpType || "",
				oMetaModel = mParameters.oMetaModel,
				oModifier = mParameters.oModifier,
				sProperty = mParameters.sBindingPath + "/" + sPropertyName,
				oPropertyContext = oMetaModel.createBindingContext(sProperty),
				sValueHelpProperty = FieldHelper.valueHelpProperty(oPropertyContext),
				sGeneratedId = StableIdHelper.generate([
					oModifier
						? StableIdHelper.generate([oModifier.getId(mParameters.oControl), sValueHelpType])
						: StableIdHelper.generate([mParameters.oControl.getId(), sValueHelpType]),
					sPropertyName
				]);

			// unit/currency
			if (sValueHelpProperty.indexOf("$Path") > -1) {
				sValueHelpProperty = oMetaModel.getObject(sValueHelpProperty);
			}
			if (sProperty !== sValueHelpProperty) {
				sGeneratedId = StableIdHelper.generate([sGeneratedId, sValueHelpProperty]);
			}

			var aDependents = oModifier
				? oModifier.getAggregation(mParameters.oControl, "dependents")
				: mParameters.oControl.getAggregation("dependents");
			return Promise.resolve(
				aDependents &&
					aDependents.some(function(oDependent) {
						return oModifier ? oModifier.getId(oDependent) === sGeneratedId : oDependent.getId() === sGeneratedId;
					})
			);
		};

		oDelegateUtil.isValueHelpRequired = function(mParameters, bInFilterField) {
			var sPropertyName = mParameters.sPropertyName || "",
				oMetaModel = mParameters.oMetaModel,
				sProperty = mParameters.sBindingPath + "/" + sPropertyName,
				oPropertyContext = oMetaModel.createBindingContext(sProperty),
				sValueHelpProperty = FieldHelper.valueHelpProperty(oPropertyContext, bInFilterField);
			// TODO use PropertyFormatter.hasValueHelp () => if doing so, QUnit tests fail due to mocked model implementation
			return Promise.all([
				oMetaModel.requestObject(sValueHelpProperty + "@com.sap.vocabularies.Common.v1.ValueListWithFixedValues"),
				oMetaModel.requestObject(sValueHelpProperty + "@com.sap.vocabularies.Common.v1.ValueListReferences"),
				oMetaModel.requestObject(sValueHelpProperty + "@com.sap.vocabularies.Common.v1.ValueListMapping"),
				oMetaModel.requestObject(sValueHelpProperty + "@com.sap.vocabularies.Common.v1.ValueList")
			]).then(function(aResults) {
				return aResults[0] || aResults[1] || aResults[2] || aResults[3];
			});
		};

		oDelegateUtil.isTypeFilterable = function(sType) {
			return sType && sType in mDefaultTypeForEdmType && !!mDefaultTypeForEdmType[sType].modelType;
		};

		oDelegateUtil.getModelType = function(sType) {
			return sType && sType in mDefaultTypeForEdmType && mDefaultTypeForEdmType[sType].modelType;
		};

		oDelegateUtil.isMultiValue = function(oProperty) {
			var bIsMultiValue = true;
			//SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression
			switch (oProperty.filterExpression) {
				case "SearchExpression":
				case "SingleRange":
				case "SingleValue":
					bIsMultiValue = false;
					break;
				default:
					break;
			}
			if (oProperty.type && oProperty.type.indexOf("Boolean") > 0) {
				bIsMultiValue = false;
			}
			return bIsMultiValue;
		};

		oDelegateUtil.getRequiredProperties = function(mEntitySetAnnotations) {
			if (!mEntitySetAnnotations) {
				return [];
			}
			var oFilterRestrictionsAnnotation = mEntitySetAnnotations["@Org.OData.Capabilities.V1.FilterRestrictions"],
				aRequiredProps = [];
			if (oFilterRestrictionsAnnotation && oFilterRestrictionsAnnotation.RequiredProperties) {
				aRequiredProps = oFilterRestrictionsAnnotation.RequiredProperties.map(function(oProperty) {
					return oProperty.$PropertyPath;
				});
			}
			return aRequiredProps;
		};

		oDelegateUtil.getNonFilterableProperties = function(mEntitySetAnnotations) {
			if (!mEntitySetAnnotations) {
				return [];
			}
			var oFilterRestrictionsAnnotation = mEntitySetAnnotations["@Org.OData.Capabilities.V1.FilterRestrictions"],
				aNonFilterableProps = [];
			if (oFilterRestrictionsAnnotation && oFilterRestrictionsAnnotation.NonFilterableProperties) {
				aNonFilterableProps = oFilterRestrictionsAnnotation.NonFilterableProperties.map(function(oProperty) {
					return oProperty.$PropertyPath;
				});
			}
			return aNonFilterableProps;
		};

		oDelegateUtil.getFilterAllowedExpressions = function(mEntitySetAnnotations) {
			if (!mEntitySetAnnotations) {
				return {};
			}
			var mAllowedExpressions = {},
				oFilterRestrictionsAnnotation = mEntitySetAnnotations["@Org.OData.Capabilities.V1.FilterRestrictions"];
			if (oFilterRestrictionsAnnotation && oFilterRestrictionsAnnotation.FilterExpressionRestrictions) {
				oFilterRestrictionsAnnotation.FilterExpressionRestrictions.forEach(function(oProperty) {
					//SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression
					mAllowedExpressions[oProperty.Property.$PropertyPath] = oProperty.AllowedExpressions;
				});
			}
			return mAllowedExpressions;
		};

		return oDelegateUtil;
	}
);
