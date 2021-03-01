import { getSelectionVariant } from "sap/fe/core/converters/controls/Common/DataVisualization";
import { ConverterContext } from "../../templates/BaseConverter";
import { Property } from "@sap-ux/annotation-converter";
import { EntityType } from "@sap-ux/vocabularies-types";
import { SelectOptionType, SelectionVariantTypeTypes } from "@sap-ux/vocabularies-types/dist/generated/UI";

export type FilterConditions = {
	operator: string;
	values: Array<string>;
	isEmpty?: boolean | null;
};

const aValidTypes = [
	"Edm.Boolean",
	"Edm.Byte",
	"Edm.Date",
	"Edm.DateTime",
	"Edm.DateTimeOffset",
	"Edm.Decimal",
	"Edm.Double",
	"Edm.Float",
	"Edm.Guid",
	"Edm.Int16",
	"Edm.Int32",
	"Edm.Int64",
	"Edm.SByte",
	"Edm.Single",
	"Edm.String",
	"Edm.Time",
	"Edm.TimeOfDay"
];

const oExcludeMap: Record<string, any> = {
	"Contains": "NotContains",
	"StartsWith": "NotStartsWith",
	"EndsWith": "NotEndsWith",
	"Empty": "NotEmpty",
	"NotEmpty": "Empty",
	"LE": "NOTLE",
	"GE": "NOTGE",
	"LT": "NOTLT",
	"GT": "NOTGT",
	"BT": "NOTBT",
	"NE": "EQ",
	"EQ": "NE"
};

/**
 * Method to get the compliant value type based on data type.
 *
 * @param  sValue - Raw value
 * @param  sType - Property Metadata type for type conversion
 * @returns - value to be propagated to the condition.
 */

export function getTypeCompliantValue(sValue: any, sType: string) {
	let oValue;
	if (aValidTypes.indexOf(sType) > -1) {
		oValue = sValue;
		if (sType === "Edm.Boolean") {
			oValue = sValue === "true" || (sValue === "false" ? false : undefined);
		} else if (sType === "Edm.Double" || sType === "Edm.Single") {
			oValue = isNaN(sValue) ? undefined : parseFloat(sValue);
		} else if (sType === "Edm.Byte" || sType === "Edm.Int16" || sType === "Edm.Int32" || sType === "Edm.SByte") {
			oValue = isNaN(sValue) ? undefined : parseInt(sValue, 10);
		} else if (sType === "Edm.Date") {
			oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
				? sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)[0]
				: sValue.match(/^(\d{8})/) && sValue.match(/^(\d{8})/)[0];
		} else if (sType === "Edm.DateTimeOffset") {
			if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\+(\d{1,4})/)) {
				oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\+(\d{1,4})/)[0];
			} else if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})/)) {
				oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})/)[0] + "+0000";
			} else if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)) {
				oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)[0] + "T00:00:00+0000";
			} else if (sValue.indexOf("Z") === sValue.length - 1) {
				oValue = sValue.split("Z")[0] + "+0100";
			} else {
				oValue = undefined;
			}
		} else if (sType === "Edm.TimeOfDay") {
			oValue = sValue.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/) ? sValue.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/)[0] : undefined;
		}
	}
	return oValue;
}

/**
 * Method to create a condition.
 * @param  sOption - Operator to be used.
 * @param  oV1 - Lower Value
 * @param  oV2 - Higher Value
 * @param sSign
 * @returns - condition.
 */
export function createConditions(sOption: string, oV1: any, oV2: any, sSign: string | undefined) {
	let oValue = oV1,
		oValue2,
		sInternalOperation: any;
	const oCondition: Record<string, FilterConditions[]> = {};
	oCondition.values = [];
	oCondition.isEmpty = null as any;
	if (oV1 === undefined || oV1 === null) {
		return;
	}

	switch (sOption) {
		case "CP":
			sInternalOperation = "Contains";
			if (oValue) {
				const nIndexOf = oValue.indexOf("*");
				const nLastIndex = oValue.lastIndexOf("*");

				// only when there are '*' at all
				if (nIndexOf > -1) {
					if (nIndexOf === 0 && nLastIndex !== oValue.length - 1) {
						sInternalOperation = "EndsWith";
						oValue = oValue.substring(1, oValue.length);
					} else if (nIndexOf !== 0 && nLastIndex === oValue.length - 1) {
						sInternalOperation = "StartsWith";
						oValue = oValue.substring(0, oValue.length - 1);
					} else {
						oValue = oValue.substring(1, oValue.length - 1);
					}
				} else {
					/* TODO Add diagonostics Log.warning("Contains Option cannot be used without '*'.") */
					return;
				}
			}
			break;
		case "EQ":
			sInternalOperation = oV1 === "" ? "Empty" : sOption;
			break;
		case "NE":
			sInternalOperation = oV1 === "" ? "NotEmpty" : sOption;
			break;
		case "BT":
			if (oV2 === undefined || oV2 === null) {
				return;
			}
			oValue2 = oV2;
			sInternalOperation = sOption;
			break;
		case "LE":
		case "GE":
		case "GT":
		case "LT":
			sInternalOperation = sOption;
			break;
		default:
			/* TODO Add diagonostics Log.warning("Selection Option is not supported : '" + sOption + "'"); */
			return;
	}
	if (sSign === "E") {
		sInternalOperation = oExcludeMap[sInternalOperation];
	}
	oCondition.operator = sInternalOperation;
	if (sInternalOperation !== "Empty") {
		oCondition.values.push(oValue);
		if (oValue2) {
			oCondition.values.push(oValue2);
		}
	}
	return oCondition;
}

/* Method to get the operator from the Selection Option */
export function getOperator(sOperator: string): string {
	return sOperator.split("/")[1];
}

/*  Method to get the filterConditions from the Selection Variant */
function getFiltersConditionsFromSelectionVariant(
	entityType: EntityType,
	selectionVariant: SelectionVariantTypeTypes
): Record<string, FilterConditions[]> {
	const ofilterConditions: Record<string, FilterConditions[]> = {};
	if (selectionVariant) {
		const aSelectOptions = selectionVariant.SelectOptions;
		const aValidProperties = entityType.entityProperties;
		aSelectOptions?.forEach((selectOption: SelectOptionType) => {
			const propertyName: any = selectOption.PropertyName;
			const sPropertyName: string = propertyName.value;
			const Ranges: any = selectOption.Ranges;
			for (let i = 0; i < aValidProperties.length; i++) {
				if (sPropertyName === aValidProperties[i].name) {
					const oValidProperty = aValidProperties[i];
					const aConditions: any[] = [];
					Ranges?.forEach((Range: any) => {
						const sign: string | undefined = Range.Sign;
						const sOption: string | undefined = Range.Option ? getOperator(Range.Option) : undefined;
						const oValue1: any = getTypeCompliantValue(Range.Low, oValidProperty.type);
						const oValue2: any = Range.High ? getTypeCompliantValue(Range.High, oValidProperty.type) : undefined;
						if ((oValue1 !== undefined || oValue1 !== null) && sOption) {
							const oCondition = createConditions(sOption, oValue1, oValue2, sign);
							aConditions.push(oCondition);
							if (aConditions.length) {
								ofilterConditions[sPropertyName] = aConditions;
							}
						}
					});
				}
			}
		});
	}
	return ofilterConditions;
}

const getDefaultValueFilters = function(entityType: EntityType): Record<string, FilterConditions[]> {
	const properties = entityType.entityProperties;
	const filterConditions: Record<string, FilterConditions[]> = {};
	if (properties) {
		properties.forEach((property: Property) => {
			const defaultFilterValue = property.annotations?.Common?.FilterDefaultValue;
			if (defaultFilterValue) {
				const PropertyName = property.name;
				filterConditions[PropertyName] = [
					{
						operator: "EQ",
						values: [defaultFilterValue]
					}
				];
			}
		});
	}
	return filterConditions;
};

function getEditStatusFilter(entityType: EntityType, converterContext: ConverterContext): Record<string, FilterConditions[]> {
	const ofilterConditions: Record<string, FilterConditions[]> = {};
	const targetAnnotations = converterContext.getEntitySetForEntityType(entityType)?.annotations;
	if (targetAnnotations?.Common?.DraftRoot || targetAnnotations?.Common?.DraftNode) {
		ofilterConditions["$editState"] = [
			{
				operator: "DRAFT_EDIT_STATE",
				values: ["ALL"]
			}
		];
	}
	return ofilterConditions;
}

export function getFilterConditions(entityType: EntityType, converterContext: ConverterContext): Record<string, FilterConditions[]> {
	let filterConditions = {};
	const selectionVariant = getSelectionVariant(entityType, converterContext);
	const editStateFilter = getEditStatusFilter(entityType, converterContext);
	const defaultFilters = getDefaultValueFilters(entityType);
	if (selectionVariant || (selectionVariant && defaultFilters)) {
		filterConditions = getFiltersConditionsFromSelectionVariant(entityType, selectionVariant);
	} else if (defaultFilters) {
		filterConditions = defaultFilters;
	}
	if (editStateFilter) {
		filterConditions = { ...filterConditions, ...editStateFilter };
	}
	return filterConditions;
}
