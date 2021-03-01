import { getDisplayMode, PropertyOrPath } from "sap/fe/core/templating/UIFormatters";
import { DataModelObjectPath, enhanceDataModelPath, getPathRelativeLocation } from "sap/fe/core/templating/DataModelPathHelper";
import { Property } from "@sap-ux/annotation-converter";
import {
	Expression,
	annotationExpression,
	formatResult,
	transformRecursively,
	BindingExpressionExpression,
	BindingExpression,
	compileBinding,
	bindingExpression
} from "sap/fe/core/helpers/BindingExpression";
import { isPathExpression } from "sap/fe/core/templating/PropertyHelper";
import valueFormatters from "sap/fe/core/formatters/ValueFormatter";

export type FormatOptions = {
	valueFormat: String;
	textAlignMode: String;
	displayMode: String;
	textLinesDisplay: String;
	textLinesEdit: String;
	showEmptyIndicator: boolean;
	semanticKeyStyle: String;
	showIconUrl: boolean;
};
/**
 * Recursively add the text arrangement to a binding expression.
 *
 * @param bindingExpression the binding expression to enhance
 * @param fullContextPath the current context path we're on (to properly resolve the text arrangement properties)
 * @returns an updated expression.
 */
export const addTextArrangementToBindingExpression = function(
	bindingExpression: Expression<any>,
	fullContextPath: DataModelObjectPath
): Expression<any> {
	return transformRecursively(bindingExpression, "Binding", (expression: BindingExpressionExpression<any>) => {
		let outExpression: Expression<any> = expression;
		if (expression.modelName === undefined) {
			// In case of default model we then need to resolve the text arrangement property
			const oPropertyDataModelPath = enhanceDataModelPath(fullContextPath, expression.path);
			outExpression = getBindingWithTextArrangement(oPropertyDataModelPath, expression);
		}
		return outExpression;
	});
};
export const getBindingWithTextArrangement = function(
	oPropertyDataModelPath: DataModelObjectPath,
	propertyBindingExpression: Expression<string>
): Expression<string> {
	let outExpression = propertyBindingExpression;
	const oPropertyDefinition = oPropertyDataModelPath.targetObject as Property;
	const targetDisplayMode = getDisplayMode(oPropertyDefinition, oPropertyDataModelPath);
	const commonText = oPropertyDefinition.annotations?.Common?.Text;
	const relativeLocation = getPathRelativeLocation(oPropertyDataModelPath.contextLocation, oPropertyDataModelPath.navigationProperties);
	propertyBindingExpression = formatLabel(oPropertyDataModelPath, propertyBindingExpression);
	if (targetDisplayMode !== "Value" && commonText) {
		switch (targetDisplayMode) {
			case "Description":
				outExpression = annotationExpression(commonText, relativeLocation) as Expression<string>;
				break;
			case "DescriptionValue":
				outExpression = formatResult(
					[annotationExpression(commonText, relativeLocation) as Expression<string>, propertyBindingExpression],
					valueFormatters.formatWithBrackets
				);
				break;
			case "ValueDescription":
				outExpression = formatResult(
					[propertyBindingExpression, annotationExpression(commonText, relativeLocation) as Expression<string>],
					valueFormatters.formatWithBrackets
				);
				break;
		}
	}
	return outExpression;
};

export const formatValueRecursively = function(bindingExpression: Expression<any>, fullContextPath: DataModelObjectPath): Expression<any> {
	return transformRecursively(bindingExpression, "Binding", (expression: BindingExpressionExpression<any>) => {
		let outExpression: Expression<any> = expression;
		if (expression.modelName === undefined) {
			// In case of default model we then need to resolve the text arrangement property
			const oPropertyDataModelPath = enhanceDataModelPath(fullContextPath, expression.path);
			outExpression = formatLabel(oPropertyDataModelPath, expression);
		}
		return outExpression;
	});
};

const EDM_TYPE_MAPPING: Record<string, any> = {
	"Edm.Boolean": { type: "sap.ui.model.odata.type.Boolean" },
	"Edm.Byte": { type: "sap.ui.model.odata.type.Byte" },
	"Edm.Date": { type: "sap.ui.model.odata.type.Date" },
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
	"Edm.Double": { type: "sap.ui.model.odata.type.Double" },
	"Edm.Guid": { type: "sap.ui.model.odata.type.Guid" },
	"Edm.Int16": { type: "sap.ui.model.odata.type.Int16" },
	"Edm.Int32": { type: "sap.ui.model.odata.type.Int32" },
	"Edm.Int64": { type: "sap.ui.model.odata.type.Int64" },
	"Edm.SByte": { type: "sap.ui.model.odata.type.SByte" },
	"Edm.Single": { type: "sap.ui.model.odata.type.Single" },
	"Edm.Stream": { type: "sap.ui.model.odata.type.Stream" },
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

export const formatLabel = function(
	oPropertyDataModelPath: DataModelObjectPath,
	propertyBindingExpression: Expression<string>
): Expression<string> {
	const outExpression: BindingExpressionExpression<any> = propertyBindingExpression as BindingExpressionExpression<any>;
	const oProperty = oPropertyDataModelPath.targetObject;
	if (oProperty._type === "Property") {
		const oTargetMapping = EDM_TYPE_MAPPING[(oProperty as Property).type];
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

export const getValueBinding = function(
	oPropertyPath: DataModelObjectPath,
	entityTypePath: DataModelObjectPath
): BindingExpression<string> {
	const aPropertyPath = getPathRelativeLocation(entityTypePath, oPropertyPath.navigationProperties);
	aPropertyPath.push(oPropertyPath.targetObject.name);
	const oBindingExpression = bindingExpression(aPropertyPath.join("/"));
	return compileBinding(formatLabel(oPropertyPath, oBindingExpression));
};

export const getFieldStyle = function(
	oPropertyPath: PropertyOrPath<Property>,
	oDataField: any,
	oDataModelPath: DataModelObjectPath,
	formatOptions: FormatOptions
): string {
	// algorithm to determine the field fragment to use
	if (!oPropertyPath || typeof oPropertyPath === "string") {
		return "Text";
	}
	const oProperty: Property = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	if (oProperty.annotations?.UI?.IsImageURL) {
		return "Avatar";
	}
	if (oProperty.type === "Edm.Stream") {
		return "Avatar";
	}
	// Datapoint
	if (
		oDataField.$Type === "com.sap.vocabularies.UI.v1.DataPointType" ||
		(oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" &&
			oDataField.Target.$target &&
			oDataField.Target.$target.$Type === "com.sap.vocabularies.UI.v1.DataPointType")
	) {
		return "Datapoint";
		//TODO
	}
	if (oDataField.Criticality) {
		return "ObjectStatus";
	}
	if (oProperty.annotations?.Measures?.ISOCurrency) {
		return "AmountWithCurrency";
	}
	if (oProperty.annotations?.Communication?.IsEmailAddress || oProperty.annotations?.Communication?.IsPhoneNumber) {
		return "Link";
	}
	if (oDataModelPath?.targetEntitySet?.entityType?.annotations?.Common?.SemanticKey) {
		const aSemanticKeys = oDataModelPath.targetEntitySet.entityType.annotations.Common.SemanticKey;
		const bIsSemanticKey = !aSemanticKeys.every(function(oKey) {
			return oKey?.$target?.name !== oProperty.name;
			// need to check if it works also for direct properties
		});
		if (bIsSemanticKey && formatOptions.semanticKeyStyle) {
			if (oDataModelPath.targetEntitySet?.annotations?.Common?.DraftRoot) {
				// we then still check whether this is available at designtime on the entityset
				return "SemanticKeyWithDraftIndicator";
			}
			return formatOptions.semanticKeyStyle === "ObjectIdentifier" ? "ObjectIdentifier" : "LabelSemanticKey";
		}
	}
	if (oProperty.annotations?.UI?.MultiLineText) {
		return "Text";
	}
	const aNavigationProperties = oDataModelPath?.targetEntitySet?.entityType?.navigationProperties || [];
	let bIsUsedInNavigationWithQuickViewFacets = false;
	aNavigationProperties.forEach(oNavProp => {
		if (oNavProp.referentialConstraint && oNavProp.referentialConstraint.length) {
			oNavProp.referentialConstraint.forEach(oRefConstraint => {
				if (oRefConstraint?.sourceProperty === oProperty.name) {
					if (oNavProp?.targetType?.annotations?.UI?.QuickViewFacets) {
						bIsUsedInNavigationWithQuickViewFacets = true;
					}
				}
			});
		}
	});
	if (bIsUsedInNavigationWithQuickViewFacets) {
		return "LinkWithQuickViewForm";
	}
	if (oProperty.annotations?.Common?.SemanticObject) {
		return "LinkWrapper";
	}
	if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
		return "Link";
	}
	return "Text";
};
