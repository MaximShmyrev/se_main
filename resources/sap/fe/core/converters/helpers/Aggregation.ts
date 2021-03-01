import { EntityType, Property } from "@sap-ux/annotation-converter";
import { ConverterContext } from "../templates/BaseConverter";

/**
 * helper class for Aggregation annotations.
 */
export class AggregationHelper {
	_entityType: EntityType;
	_converterContext: ConverterContext;
	_bApplySupported: boolean;
	_bHasPropertyRestrictions: boolean;

	/**
	 * Creates a helper for a specific entity type and a converter context.
	 *
	 * @param entityType the entity type
	 * @param converterContext the context
	 */
	constructor(entityType: EntityType, converterContext: ConverterContext) {
		this._entityType = entityType;
		this._converterContext = converterContext;

		this._bApplySupported =
			this._entityType.annotations?.Aggregation?.ApplySupported ||
			this._converterContext.getEntityContainer().annotations?.Aggregation?.ApplySupported
				? true
				: false;

		this._bHasPropertyRestrictions =
			this._entityType.annotations?.Aggregation?.ApplySupported?.PropertyRestrictions ||
			this._converterContext.getEntityContainer().annotations?.Aggregation?.ApplySupported?.PropertyRestrictions
				? true
				: false;
	}

	/**
	 * Checks if a property is groupable.
	 *
	 * @param property the propoerty to check
	 * @returns undefined if the entity doesn't support analytical queries, true or false otherwise
	 */
	public isPropertyGroupable(property: Property): boolean | undefined {
		if (!this._bApplySupported) {
			return undefined;
		} else {
			return !this._bHasPropertyRestrictions || property.annotations?.Aggregation?.Groupable === true;
		}
	}
}
