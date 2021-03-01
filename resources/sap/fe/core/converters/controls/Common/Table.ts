import {
	CriticalityType,
	DataField,
	DataFieldAbstractTypes,
	DataFieldForAnnotation,
	EnumValue,
	LineItem,
	PathAnnotationExpression,
	PresentationVariantTypeTypes,
	PropertyAnnotationValue,
	PropertyPath,
	SelectionVariantType,
	SelectOptionType,
	UIAnnotationTypes
} from "@sap-ux/vocabularies-types";
import {
	ActionType,
	AvailabilityType,
	CreationMode,
	HorizontalAlign,
	ManifestTableColumn,
	ManifestWrapper,
	NavigationSettingsConfiguration,
	NavigationTargetConfiguration,
	SelectionMode,
	TableColumnSettings,
	TableManifestConfiguration,
	VariantManagementType,
	VisualizationType
} from "../../ManifestSettings";
import { EntitySet, EntityType, NavigationProperty, Property } from "@sap-ux/annotation-converter";
import { ConverterContext, TemplateType } from "../../templates/BaseConverter";
import { TableID } from "../../helpers/ID";
import { NavigationPropertyRestrictionTypes } from "@sap-ux/vocabularies-types/dist/generated/Capabilities";
import {
	AnnotationAction,
	BaseAction,
	CustomAction,
	getActionsFromManifest,
	isActionNavigable,
	removeDuplicateActions
} from "sap/fe/core/converters/controls/Common/Action";
import { ConfigurableObject, CustomElement, insertCustomElements, Placement } from "sap/fe/core/converters/helpers/ConfigurableObject";
import {
	collectRelatedProperties,
	ComplexPropertyInfo,
	isDataFieldAlwaysHidden,
	isDataFieldForActionAbstract,
	isDataFieldTypes,
	getSemanticObjectPath,
	CollectedProperties
} from "sap/fe/core/converters/annotations/DataField";
import {
	annotationExpression,
	BindingExpression,
	bindingExpression,
	compileBinding,
	constant,
	Expression,
	ExpressionOrPrimitive,
	formatResult,
	ifElse,
	or,
	equal,
	isConstant,
	and,
	not
} from "sap/fe/core/helpers/BindingExpression";
import { Draft, UI } from "sap/fe/core/converters/helpers/BindingHelper";
import { KeyHelper } from "sap/fe/core/converters/helpers/Key";
import tableFormatters from "sap/fe/core/formatters/TableFormatter";
import { MessageType } from "sap/fe/core/formatters/TableFormatterTypes";
import { getTargetObjectPath, isPathDeletable, isPathInsertable } from "sap/fe/core/templating/DataModelPathHelper";
import { replaceSpecialChars } from "sap/fe/core/helpers/StableIdHelper";
import { IssueCategory, IssueSeverity, IssueType } from "sap/fe/core/converters/helpers/IssueManager";
import * as Edm from "@sap-ux/vocabularies-types/dist/Edm";
import { isProperty } from "sap/fe/core/templating/PropertyHelper";

import { AggregationHelper } from "../../helpers/Aggregation";

export type TableAnnotationConfiguration = {
	autoBindOnInit: boolean;
	collection: string;
	enableControlVM?: boolean;
	filterId?: string;
	id: string;
	isEntitySet: boolean;
	navigationPath: string;
	p13nMode?: string;
	row?: {
		action?: string;
		press?: string;
		rowHighlighting: BindingExpression<MessageType>;
		rowNavigated: BindingExpression<boolean>;
	};
	selectionMode: string;
	show?: {
		create?: string | boolean;
		delete?: string | boolean;
		paste?: BindingExpression<boolean>;
	};
	displayMode?: boolean;
	threshold: number;
	entityName: string;
	sortConditions?: string;

	/** Create new entries */
	create: CreateBehaviour | CreateBehaviourExternal;
	parentEntityDeleteEnabled?: BindingExpression<boolean>;
	title: string;
};

/**
 * New entries are created within the app (default case)
 */
type CreateBehaviour = {
	mode: CreationMode;
	append: Boolean;
	newAction?: string;
	navigateToTarget?: string;
};

/**
 * New entries are created by navigating to some target
 */
type CreateBehaviourExternal = {
	mode: "External";
	outbound: string;
	outboundDetail: NavigationTargetConfiguration["outboundDetail"];
	navigationSettings: NavigationSettingsConfiguration;
};

type TableCapabilityRestriction = {
	isDeletable: boolean;
	isUpdatable: boolean;
};

export type TableFiltersConfiguration = {
	enabled?: string | boolean;
	paths: [
		{
			annotationPath: string;
		}
	];
	showCounts?: boolean;
};

export type SelectionVariantConfiguration = {
	propertyNames: string[];
	text: string;
};

export type TableControlConfiguration = {
	createAtEnd: boolean;
	creationMode: CreationMode;
	disableAddRowButtonForEmptyData: boolean;
	useCondensedTableLayout: boolean;
	enableExport: boolean;
	headerVisible: boolean;
	filters?: Record<string, TableFiltersConfiguration>;
	type: TableType;
	selectAll?: boolean;
	selectionLimit: number;
	enablePaste: boolean;
	enableFullScreen: boolean;
};

export type TableType = "GridTable" | "ResponsiveTable";

enum ColumnType {
	Default = "Default", // Default Type
	Annotation = "Annotation"
}

export type BaseTableColumn = ConfigurableObject & {
	id: string;
	width?: string;
	name: string;
	availability: AvailabilityType;
	type: ColumnType; //Origin of the source where we are getting the templated information from,
	isNavigable?: boolean;
	settings?: TableColumnSettings;
	semanticObjectPath?: string;
	propertyInfos?: string[];
	sortable: boolean;
};

export type CustomTableColumn = BaseTableColumn & {
	header?: string;
	horizontalAlign?: HorizontalAlign;
	template: string;
};

export type AnnotationTableColumn = BaseTableColumn & {
	annotationPath: string;
	relativePath: string;
	label?: string;
	groupLabel?: string;
	group?: string;
	isGroupable?: boolean;
	isKey?: boolean;
	exportSettings?: {
		template?: string;
		label?: string;
	};
};

type TableColumn = CustomTableColumn | AnnotationTableColumn;

export type CustomColumn = CustomElement<TableColumn>;

export type TableVisualization = {
	type: VisualizationType.Table;
	annotation: TableAnnotationConfiguration;
	control: TableControlConfiguration;
	columns: TableColumn[];
	actions: BaseAction[];
};

type SorterType = {
	name: string;
	descending: boolean;
};

/**
 * Returns an array of all annotation based and manifest based table actions.
 *
 * @param {LineItem} lineItemAnnotation
 * @param {string} visualizationPath
 * @param {ConverterContext} converterContext
 * @param {NavigationSettingsConfiguration} navigationSettings
 * @returns {BaseAction} the complete table actions
 */
export function getTableActions(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext,
	navigationSettings?: NavigationSettingsConfiguration
): BaseAction[] {
	const aAnnotationActions: BaseAction[] = getTableAnnotationActions(lineItemAnnotation, visualizationPath, converterContext);
	return insertCustomElements(
		aAnnotationActions,
		getActionsFromManifest(
			converterContext.getManifestControlConfiguration(visualizationPath).actions,
			converterContext,
			aAnnotationActions,
			navigationSettings,
			true
		),
		{ isNavigable: "overwrite", enableOnSelect: "overwrite", enableAutoScroll: "overwrite" }
	);
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
export function getTableColumns(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext,
	navigationSettings?: NavigationSettingsConfiguration
): TableColumn[] {
	const annotationColumns = getColumnsFromAnnotations(lineItemAnnotation, visualizationPath, converterContext);
	const manifestColumns = getColumnsFromManifest(
		converterContext.getManifestControlConfiguration(visualizationPath).columns,
		annotationColumns as AnnotationTableColumn[],
		converterContext,
		converterContext.getAnnotationEntityType(lineItemAnnotation),
		navigationSettings
	);

	return insertCustomElements(annotationColumns, manifestColumns, {
		width: "overwrite",
		isNavigable: "overwrite",
		availability: "overwrite",
		settings: "overwrite"
	});
}

export function createTableVisualization(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext,
	presentationVariantAnnotation?: PresentationVariantTypeTypes,
	isCondensedTableLayoutCompliant?: boolean
): TableVisualization {
	const tableManifestConfig = getTableManifestConfiguration(
		lineItemAnnotation,
		visualizationPath,
		converterContext,
		isCondensedTableLayoutCompliant
	);
	const { navigationPropertyPath } = splitPath(visualizationPath);
	const dataModelPath = converterContext.getDataModelObjectPath();
	const entityName: string = dataModelPath.targetEntitySet ? dataModelPath.targetEntitySet.name : dataModelPath.startingEntitySet.name,
		isEntitySet: boolean = navigationPropertyPath.length === 0;
	const navigationOrCollectionName = isEntitySet ? entityName : navigationPropertyPath;
	const navigationSettings = converterContext.getManifestWrapper().getNavigationConfiguration(navigationOrCollectionName);
	const columns = getTableColumns(lineItemAnnotation, visualizationPath, converterContext, navigationSettings);
	return {
		type: VisualizationType.Table,
		annotation: getTableAnnotationConfiguration(
			lineItemAnnotation,
			visualizationPath,
			converterContext,
			tableManifestConfig,
			columns,
			presentationVariantAnnotation
		),
		control: tableManifestConfig,
		actions: removeDuplicateActions(getTableActions(lineItemAnnotation, visualizationPath, converterContext, navigationSettings)),
		columns: columns
	};
}

export function createDefaultTableVisualization(converterContext: ConverterContext): TableVisualization {
	const tableManifestConfig = getTableManifestConfiguration(undefined, "", converterContext, false);
	const columns = getColumnsFromEntityType(converterContext.getEntityType(), [], [], converterContext);
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
function hasActionRequiringContext(lineItemAnnotation: LineItem): boolean {
	return lineItemAnnotation.some(dataField => {
		if (dataField.$Type === UIAnnotationTypes.DataFieldForAction) {
			return dataField.Inline !== true;
		} else if (dataField.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation) {
			return dataField.Inline !== true && dataField.RequiresContext;
		}
	});
}

function hasActionRequiringSelection(manifestActions: Record<string, CustomAction>): boolean {
	let requiresSelectionKey: boolean = false;
	if (manifestActions) {
		requiresSelectionKey = Object.keys(manifestActions).some(actionKey => {
			const action = manifestActions[actionKey];
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
export function getCapabilityRestriction(visualizationPath: string, converterContext: ConverterContext): TableCapabilityRestriction {
	const { navigationPropertyPath } = splitPath(visualizationPath);
	const navigationPropertyPathParts = navigationPropertyPath.split("/");
	const oCapabilityRestriction = { isDeletable: true, isUpdatable: true };
	let currentEntitySet: EntitySet | undefined = converterContext.getEntitySet();
	while (
		(oCapabilityRestriction.isDeletable || oCapabilityRestriction.isUpdatable) &&
		currentEntitySet &&
		navigationPropertyPathParts.length > 0
	) {
		const pathsToCheck: string[] = [];
		navigationPropertyPathParts.reduce((paths, navigationPropertyPathPart) => {
			if (paths.length > 0) {
				paths += "/";
			}
			paths += navigationPropertyPathPart;
			pathsToCheck.push(paths);
			return paths;
		}, "");
		let hasRestrictedPathOnDelete = false,
			hasRestrictedPathOnUpdate = false;
		currentEntitySet.annotations.Capabilities?.NavigationRestrictions?.RestrictedProperties.forEach(
			(restrictedNavProp: NavigationPropertyRestrictionTypes) => {
				if (restrictedNavProp?.NavigationProperty?.type === "NavigationPropertyPath") {
					if (restrictedNavProp.DeleteRestrictions?.Deletable === false) {
						hasRestrictedPathOnDelete =
							hasRestrictedPathOnDelete || pathsToCheck.indexOf(restrictedNavProp.NavigationProperty.value) !== -1;
					} else if (restrictedNavProp.UpdateRestrictions?.Updatable === false) {
						hasRestrictedPathOnUpdate =
							hasRestrictedPathOnUpdate || pathsToCheck.indexOf(restrictedNavProp.NavigationProperty.value) !== -1;
					}
				}
			}
		);
		oCapabilityRestriction.isDeletable = !hasRestrictedPathOnDelete;
		oCapabilityRestriction.isUpdatable = !hasRestrictedPathOnUpdate;
		const navPropName = navigationPropertyPathParts.shift();
		if (navPropName) {
			const navProp: NavigationProperty = currentEntitySet.entityType.navigationProperties.find(
				navProp => navProp.name == navPropName
			) as NavigationProperty;
			if (navProp && !navProp.containsTarget && currentEntitySet.navigationPropertyBinding.hasOwnProperty(navPropName)) {
				currentEntitySet = currentEntitySet.navigationPropertyBinding[navPropName];
			} else {
				// Contained navProp means no entitySet to report to
				currentEntitySet = undefined;
			}
		}
	}
	if (currentEntitySet !== undefined && currentEntitySet.annotations) {
		if (oCapabilityRestriction.isDeletable) {
			// If there is still an entity set, check the entity set deletable status
			oCapabilityRestriction.isDeletable = currentEntitySet.annotations.Capabilities?.DeleteRestrictions?.Deletable !== false;
		}
		if (oCapabilityRestriction.isUpdatable) {
			// If there is still an entity set, check the entity set updatable status
			oCapabilityRestriction.isUpdatable = currentEntitySet.annotations.Capabilities?.UpdateRestrictions?.Updatable !== false;
		}
	}
	return oCapabilityRestriction;
}

function getSelectionMode(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext,
	isEntitySet: boolean,
	targetCapabilities: TableCapabilityRestriction
): string {
	if (!lineItemAnnotation) {
		return SelectionMode.None;
	}
	const tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
	let selectionMode = tableManifestSettings.tableSettings?.selectionMode;
	const manifestActions = getActionsFromManifest(
		converterContext.getManifestControlConfiguration(visualizationPath).actions,
		converterContext,
		[],
		undefined,
		false
	);
	let isParentDeletable, parentEntitySetDeletable;
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
function getTableAnnotationActions(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext
): BaseAction[] {
	const tableActions: BaseAction[] = [];
	if (lineItemAnnotation) {
		lineItemAnnotation.forEach((dataField: DataFieldAbstractTypes) => {
			let tableAction: AnnotationAction | undefined;
			if (
				isDataFieldForActionAbstract(dataField) &&
				!(dataField.annotations?.UI?.Hidden === true) &&
				!dataField.Inline &&
				!dataField.Determining
			) {
				const key = KeyHelper.generateKeyFromDataField(dataField);
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

function getCriticalityBindingByEnum(CriticalityEnum: EnumValue<CriticalityType>) {
	let criticalityProperty;
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

function getHighlightRowBinding(
	criticalityAnnotation: PathAnnotationExpression<CriticalityType> | EnumValue<CriticalityType> | undefined,
	isDraftRoot: boolean
): Expression<MessageType> {
	let defaultHighlightRowDefinition: MessageType | Expression<MessageType> = MessageType.None;
	if (criticalityAnnotation) {
		if (typeof criticalityAnnotation === "object") {
			defaultHighlightRowDefinition = annotationExpression(criticalityAnnotation) as Expression<MessageType>;
		} else {
			// Enum Value so we get the corresponding static part
			defaultHighlightRowDefinition = getCriticalityBindingByEnum(criticalityAnnotation);
		}
	}
	return ifElse(
		isDraftRoot && Draft.IsNewObject,
		MessageType.Information as MessageType,
		formatResult([defaultHighlightRowDefinition], tableFormatters.rowHighlighting)
	);
}

function _getCreationBehaviour(
	lineItemAnnotation: LineItem | undefined,
	tableManifestConfiguration: TableControlConfiguration,
	converterContext: ConverterContext,
	navigationSettings: NavigationSettingsConfiguration
): TableAnnotationConfiguration["create"] {
	const navigation = navigationSettings?.create || navigationSettings?.detail;

	// cross-app
	if (navigation?.outbound && navigation.outboundDetail && navigationSettings?.create) {
		return {
			mode: "External",
			outbound: navigation.outbound,
			outboundDetail: navigation.outboundDetail,
			navigationSettings: navigationSettings
		};
	}

	let newAction;
	if (lineItemAnnotation) {
		// in-app
		const targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);
		const targetAnnotations = converterContext.getEntitySetForEntityType(targetEntityType)?.annotations;
		newAction = targetAnnotations?.Common?.DraftRoot?.NewAction || targetAnnotations?.Session?.StickySessionSupported?.NewAction; // TODO: Is there really no 'NewAction' on DraftNode? targetAnnotations?.Common?.DraftNode?.NewAction

		if (tableManifestConfiguration.creationMode === CreationMode.CreationRow && newAction) {
			// A combination of 'CreationRow' and 'NewAction' does not make sense
			// TODO: Or does it?
			throw Error(`Creation mode '${CreationMode.CreationRow}' can not be used with a custom 'new' action (${newAction})`);
		}
		if (navigation?.route) {
			// route specified
			return {
				mode: tableManifestConfiguration.creationMode,
				append: tableManifestConfiguration.createAtEnd,
				newAction: newAction,
				navigateToTarget: tableManifestConfiguration.creationMode === CreationMode.NewPage ? navigation.route : undefined // navigate only in NewPage mode
			};
		}
	}

	// no navigation or no route specified - fallback to inline create if original creation mode was 'NewPage'
	if (tableManifestConfiguration.creationMode === CreationMode.NewPage) {
		tableManifestConfiguration.creationMode = CreationMode.Inline;
	}

	return {
		mode: tableManifestConfiguration.creationMode,
		append: tableManifestConfiguration.createAtEnd,
		newAction: newAction
	};
}

const _getRowConfigurationProperty = function(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext,
	navigationSettings: NavigationSettingsConfiguration,
	targetPath: string
) {
	let pressProperty, navigationTarget;
	let criticalityProperty: ExpressionOrPrimitive<MessageType> = MessageType.None;
	const targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);
	if (navigationSettings && lineItemAnnotation) {
		navigationTarget = navigationSettings.display?.target || navigationSettings.detail?.outbound;
		if (navigationTarget) {
			pressProperty =
				".handlers.onChevronPressNavigateOutBound( $controller ,'" + navigationTarget + "', ${$parameters>bindingContext})";
		} else if (targetEntityType) {
			const targetEntitySet = converterContext.getEntitySetForEntityType(targetEntityType);
			navigationTarget = navigationSettings.detail?.route;
			if (navigationTarget) {
				criticalityProperty = getHighlightRowBinding(
					lineItemAnnotation.annotations?.UI?.Criticality,
					!!targetEntitySet?.annotations?.Common?.DraftRoot || !!targetEntitySet?.annotations?.Common?.DraftNode
				);
				pressProperty =
					"._routing.navigateForwardToContext(${$parameters>bindingContext}, { callExtension: true, targetPath: '" +
					targetPath +
					"', editable : " +
					(targetEntitySet?.annotations?.Common?.DraftRoot || targetEntitySet?.annotations?.Common?.DraftNode
						? "!${$parameters>bindingContext}.getProperty('IsActiveEntity')"
						: "undefined") +
					"})"; //Need to access to DraftRoot and DraftNode !!!!!!!
			} else {
				criticalityProperty = getHighlightRowBinding(lineItemAnnotation.annotations?.UI?.Criticality, false);
			}
		}
	}
	const rowNavigatedExpression: Expression<boolean> = formatResult(
		[bindingExpression("/deepestPath", "internal")],
		tableFormatters.navigatedRow,
		targetEntityType
	);
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
export const getColumnsFromEntityType = function(
	entityType: EntityType,
	annotationColumns: AnnotationTableColumn[] = [],
	nonSortableColumns: string[],
	converterContext: ConverterContext
): AnnotationTableColumn[] {
	const tableColumns: AnnotationTableColumn[] = [];
	const aggregationHelper = new AggregationHelper(entityType, converterContext);

	entityType.entityProperties.forEach((property: Property) => {
		// Catch already existing columns - which were added before by LineItem Annotations
		const exists = annotationColumns.some(column => {
			return column.name === property.name;
		});

		// if target type exists, it is a complex property and should be ignored
		if (!property.targetType && !exists) {
			tableColumns.push(
				getColumnDefinitionFromProperty(
					property,
					converterContext.getEntitySetBasedAnnotationPath(property.fullyQualifiedName),
					property.name,
					true,
					true,
					nonSortableColumns,
					aggregationHelper,
					converterContext
				)
			);
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
const getColumnDefinitionFromProperty = function(
	property: Property,
	fullPropertyPath: string,
	relativePath: string,
	useDataFieldPrefix: boolean,
	availableForAdaptation: boolean,
	nonSortableColumns: string[],
	aggregationHelper: AggregationHelper,
	converterContext: ConverterContext,
	descriptionProperty?: Property
): AnnotationTableColumn {
	const name = useDataFieldPrefix ? relativePath : "Property::" + relativePath;
	const key = (useDataFieldPrefix ? "DataField::" : "Property::") + replaceSpecialChars(relativePath);
	const semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, property.fullyQualifiedName);
	const isHidden = property.annotations?.UI?.Hidden === true;
	const groupPath: String = _sliceAtSlash(property.name, true, false);
	const isGroup: boolean = groupPath != property.name;
	const descriptionLabel: string | undefined = descriptionProperty ? _getLabel(descriptionProperty) : undefined;
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
	} as AnnotationTableColumn;
};

/**
 * Returns boolean true for valid columns, false for invalid columns.
 *
 * @param {DataFieldAbstractTypes} dataField Different DataField types defined in the annotations
 * @returns {boolean} True for valid columns, false for invalid columns
 * @private
 */
const _isValidColumn = function(dataField: DataFieldAbstractTypes) {
	switch (dataField.$Type) {
		case UIAnnotationTypes.DataFieldForAction:
		case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
			return !!dataField.Inline;
		case UIAnnotationTypes.DataFieldWithAction:
		case UIAnnotationTypes.DataFieldWithIntentBasedNavigation:
			return false;
		case UIAnnotationTypes.DataField:
		case UIAnnotationTypes.DataFieldWithUrl:
		case UIAnnotationTypes.DataFieldForAnnotation:
		case UIAnnotationTypes.DataFieldWithNavigationPath:
			return true;
		default:
		// Todo: Replace with proper Log statement once available
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
const _getLabel = function(property: DataFieldAbstractTypes | Property, isGroup: boolean = false): string | undefined {
	if (!property) {
		return undefined;
	}
	if (isProperty(property)) {
		return property.annotations?.Common?.Label?.toString() || property.name;
	} else if (isDataFieldTypes(property)) {
		if (!!isGroup && property.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath") {
			return compileBinding(annotationExpression(property.Label));
		}
		return property.Value?.$target?.annotations?.Common?.Label || property.Label || property.Value?.$target?.name;
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
const _createRelatedColumns = function(
	columnsToBeCreated: Record<string, CollectedProperties>,
	existingColumns: AnnotationTableColumn[],
	nonSortableColumns: string[],
	converterContext: ConverterContext,
	entityType: EntityType
): AnnotationTableColumn[] {
	const relatedColumns: AnnotationTableColumn[] = [];
	const relatedPropertyNameMap: Record<string, string> = {};
	const aggregationHelper = new AggregationHelper(entityType, converterContext);

	Object.keys(columnsToBeCreated).forEach(name => {
		const { value, description } = columnsToBeCreated[name],
			annotationPath = converterContext.getAbsoluteAnnotationPath(name),
			// Check whether the related column already exists.
			relatedColumn = existingColumns.find(column => column.name === name);
		if (relatedColumn === undefined) {
			// Case 1: Create a new property column and set it to hidden.
			// Key contains DataField prefix to ensure all property columns have the same key format.
			relatedColumns.push(
				getColumnDefinitionFromProperty(
					value,
					annotationPath,
					name,
					true,
					false,
					nonSortableColumns,
					aggregationHelper,
					converterContext,
					description
				)
			);
		} else if (relatedColumn.annotationPath !== annotationPath) {
			// Case 2: The existing column points to a LineItem.
			const newName = "Property::" + name;
			// Checking whether the related property column has already been created in a previous iteration.
			if (!existingColumns.some(column => column.name === newName)) {
				// Create a new property column with 'Property::' prefix,
				// Set it to hidden as it is only consumed by Complex property infos.
				relatedColumns.push(
					getColumnDefinitionFromProperty(
						value,
						annotationPath,
						name,
						false,
						false,
						nonSortableColumns,
						aggregationHelper,
						converterContext
					)
				);
				relatedPropertyNameMap[name] = newName;
			}
		}
	});

	// The property 'name' has been prefixed with 'Property::' for uniqueness.
	// Update the same in other propertyInfos[] references which point to this property.
	existingColumns.forEach(column => {
		column.propertyInfos = column.propertyInfos?.map(propertyInfo => relatedPropertyNameMap[propertyInfo] ?? propertyInfo);
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
const _getAnnotationColumnName = function(dataField: DataFieldAbstractTypes) {
	// This is needed as we have flexibility changes already that we have to check against
	if (isDataFieldTypes(dataField)) {
		return dataField.Value?.path;
	} else if (dataField.$Type === UIAnnotationTypes.DataFieldForAnnotation && dataField.Target?.$target?.Value?.path) {
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
const _getRelativePath = function(dataField: DataFieldAbstractTypes): string {
	let relativePath: string = "";

	switch (dataField.$Type) {
		case UIAnnotationTypes.DataField:
		case UIAnnotationTypes.DataFieldWithNavigationPath:
			relativePath = (dataField as DataField)?.Value?.path;
			break;

		case UIAnnotationTypes.DataFieldForAnnotation:
			relativePath = (dataField as DataFieldForAnnotation)?.Target?.value;
			break;

		case UIAnnotationTypes.DataFieldForAction:
		case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
			relativePath = KeyHelper.generateKeyFromDataField(dataField);
			break;
	}

	return relativePath;
};

const _sliceAtSlash = function(path: String, isLastSlash: boolean, isLastPart: boolean) {
	const iSlashIndex = isLastSlash ? path.lastIndexOf("/") : path.indexOf("/");

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
const getColumnsFromAnnotations = function(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext
): TableColumn[] {
	const entityType = converterContext.getAnnotationEntityType(lineItemAnnotation),
		annotationColumns: AnnotationTableColumn[] = [],
		columnsToBeCreated: Record<string, CollectedProperties> = {},
		nonSortableColumns: string[] =
			(converterContext.getEntitySet()?.annotations?.Capabilities?.SortRestrictions
				?.NonSortableProperties as Edm.PropertyPath[])?.map((property: PropertyPath) => property.value) ?? [];

	if (lineItemAnnotation) {
		// Get columns from the LineItem Annotation
		lineItemAnnotation.forEach(lineItem => {
			if (!_isValidColumn(lineItem)) {
				return;
			}
			const semanticObjectAnnotationPath =
				isDataFieldTypes(lineItem) && lineItem.Value?.$target?.fullyQualifiedName
					? getSemanticObjectPath(converterContext, lineItem)
					: undefined;
			const relativePath = _getRelativePath(lineItem);
			// Determine properties which are consumed by this LineItem.
			const relatedPropertiesInfo: ComplexPropertyInfo = collectRelatedProperties(lineItem, converterContext);
			const relatedPropertyNames: string[] = Object.keys(relatedPropertiesInfo.properties);
			const groupPath: String = _sliceAtSlash(relativePath, true, false);
			const isGroup: boolean = groupPath != relativePath;
			annotationColumns.push({
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(lineItem.fullyQualifiedName),
				semanticObjectPath: semanticObjectAnnotationPath,
				type: ColumnType.Annotation,
				key: KeyHelper.generateKeyFromDataField(lineItem),
				width: lineItem.annotations?.HTML5?.CssDefaults?.width || undefined,
				availability: isDataFieldAlwaysHidden(lineItem) ? AvailabilityType.Hidden : AvailabilityType.Default,
				propertyInfos: relatedPropertyNames.length > 0 ? relatedPropertyNames : undefined,
				name: _getAnnotationColumnName(lineItem),
				groupLabel: isGroup ? _getLabel(lineItem) : null,
				group: isGroup ? groupPath : null,
				label: _getLabel(lineItem, isGroup),
				relativePath: relativePath,
				isNavigable: true,
				sortable: lineItem.$Type === UIAnnotationTypes.DataField && nonSortableColumns.indexOf(relativePath) === -1,
				exportSettings: {
					template: relatedPropertiesInfo.exportSettingsTemplate
				}
			} as AnnotationTableColumn);

			// Collect information of related columns to be created.
			relatedPropertyNames.forEach(name => {
				columnsToBeCreated[name] = relatedPropertiesInfo.properties[name];
			});
		});
	}

	// Get columns from the Properties of EntityType
	let tableColumns = getColumnsFromEntityType(entityType, annotationColumns, nonSortableColumns, converterContext);
	tableColumns = tableColumns.concat(annotationColumns);

	// Create a propertyInfo for each related property.
	const relatedColumns = _createRelatedColumns(columnsToBeCreated, tableColumns, nonSortableColumns, converterContext, entityType);
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
const _getPropertyNames = function(
	properties: string[] | undefined,
	annotationColumns: AnnotationTableColumn[],
	converterContext: ConverterContext,
	entityType: EntityType
): string[] | undefined {
	let matchedProperties: string[] | undefined;

	if (properties) {
		matchedProperties = properties.map(function(propertyPath) {
			const annotationColumn = annotationColumns.find(function(annotationColumn) {
				return annotationColumn.relativePath === propertyPath && annotationColumn.propertyInfos === undefined;
			});
			if (annotationColumn) {
				return annotationColumn.name;
			} else {
				const relatedColumns = _createRelatedColumns(
					{ [propertyPath]: { value: entityType.resolvePath(propertyPath) } },
					annotationColumns,
					[],
					converterContext,
					entityType
				);
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
const getColumnsFromManifest = function(
	columns: Record<string, ManifestTableColumn>,
	annotationColumns: AnnotationTableColumn[],
	converterContext: ConverterContext,
	entityType: EntityType,
	navigationSettings?: NavigationSettingsConfiguration
): Record<string, CustomColumn> {
	const internalColumns: Record<string, CustomColumn> = {};

	for (const key in columns) {
		const manifestColumn = columns[key];

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
				anchor: manifestColumn.position?.anchor,
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

export function getP13nMode(visualizationPath: string, converterContext: ConverterContext): string | undefined {
	const manifestWrapper: ManifestWrapper = converterContext.getManifestWrapper();
	const tableManifestSettings: TableManifestConfiguration = converterContext.getManifestControlConfiguration(visualizationPath);
	const variantManagement: VariantManagementType = manifestWrapper.getVariantManagement();
	const hasVariantManagement: boolean = ["Page", "Control"].indexOf(variantManagement) > -1;
	const aPersonalization: string[] = [];
	if (hasVariantManagement) {
		if (tableManifestSettings?.tableSettings?.personalization !== undefined) {
			// Personalization configured in manifest.
			const personalization: any = tableManifestSettings.tableSettings.personalization;
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

function getDeleteHidden(currentEntitySet: EntitySet | undefined, navigationPath: string) {
	let isDeleteHidden: any = false;
	if (currentEntitySet && navigationPath) {
		// Check if UI.DeleteHidden is pointing to parent path
		const deleteHiddenAnnotation = currentEntitySet.navigationPropertyBinding[navigationPath]?.annotations?.UI?.DeleteHidden;
		if (deleteHiddenAnnotation && (deleteHiddenAnnotation as any).path) {
			if ((deleteHiddenAnnotation as any).path.indexOf("/") > 0) {
				const aSplitHiddenPath = (deleteHiddenAnnotation as any).path.split("/");
				const sNavigationPath = aSplitHiddenPath[0];
				const partnerName = (currentEntitySet as any).entityType.navigationProperties.find(
					(navProperty: any) => navProperty.name === navigationPath
				).partner;
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
		isDeleteHidden = currentEntitySet && currentEntitySet.annotations?.UI?.DeleteHidden;
	}
	return isDeleteHidden;
}

/**
 * Returns visibility for Delete button
 * @param converterContext
 * @param navigationPath
 * @param isTargetDeletable
 */

export function getDeleteVisible(
	converterContext: ConverterContext,
	navigationPath: string,
	isTargetDeletable: boolean
): BindingExpression<boolean> {
	const currentEntitySet = converterContext.getEntitySet();
	const isDeleteHidden: any = getDeleteHidden(currentEntitySet, navigationPath);
	let isParentDeletable, parentEntitySetDeletable;
	if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
		isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), navigationPath);
		parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable) : isParentDeletable;
	}
	//do not show case the delete button if parentEntitySetDeletable is false
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

export function getCreateVisible(
	converterContext: ConverterContext,
	creationMode: CreationMode | "External",
	isInsertable: Expression<boolean>
): Expression<boolean> {
	const currentEntitySet = converterContext.getEntitySet();
	const dataModelObjectPath = converterContext.getDataModelObjectPath();
	const isCreateHidden: Expression<boolean> = currentEntitySet
		? annotationExpression(
				(currentEntitySet?.annotations.UI?.CreateHidden as PropertyAnnotationValue<boolean>) || false,
				dataModelObjectPath.navigationProperties.map(navProp => navProp.name)
		  )
		: constant(false);
	// if there is a custom new action the create button will be bound against this new action (instead of a POST action).
	// The visibility of the create button then depends on the new action's OperationAvailable annotation (instead of the insertRestrictions):
	// OperationAvailable = true or undefined -> create is visible
	// OperationAvailable = false -> create is not visible
	const newActionName: BindingExpression<string> = currentEntitySet?.annotations.Common?.DraftRoot?.NewAction;
	const showCreateForNewAction = newActionName
		? annotationExpression(converterContext?.getEntityType().actions[newActionName].annotations?.Core?.OperationAvailable, [], true)
		: undefined;

	// - If it's statically not insertable -> create is not visible
	// - If create is statically hidden -> create is not visible
	// - If it's an ALP template -> create is not visible
	// -
	// - Otherwise
	// 	 - If the create mode is external -> create is visible
	// 	 - If we're on the list report -> create is visible
	// 	 - Otherwise
	// 	   - This depends on the value of the the UI.IsEditable
	return ifElse(
		or(
			or(
				equal(showCreateForNewAction, false),
				and(isConstant(isInsertable), equal(isInsertable, false), equal(showCreateForNewAction, undefined))
			),
			isConstant(isCreateHidden) && equal(isCreateHidden, true),
			converterContext.getTemplateType() === TemplateType.AnalyticalListPage
		),
		false,
		ifElse(
			or(creationMode === "External", converterContext.getTemplateType() === TemplateType.ListReport),
			true,
			and(not(isCreateHidden), UI.IsEditable)
		)
	);
}

/**
 * Returns visibility for Create button
 *
 * @param converterContext
 * @param creationBehaviour
 * @returns {*} Expression or Boolean value of createhidden
 */

export function getPasteEnabled(
	converterContext: ConverterContext,
	creationBehaviour: TableAnnotationConfiguration["create"],
	isInsertable: Expression<boolean>
): Expression<boolean> {
	// If create is not visible -> it's not enabled
	// If create is visible ->
	// 	 If it's in the ListReport -> not enabled
	//	 If it's insertable -> enabled
	return ifElse(
		equal(getCreateVisible(converterContext, creationBehaviour.mode, isInsertable), true),
		converterContext.getTemplateType() === TemplateType.ObjectPage && isInsertable,
		false
	);
}

/**
 * Returns a JSON string containing Presentation Variant sort conditions.
 *
 * @param presentationVariantAnnotation {PresentationVariantTypeTypes | undefined} Presentation variant annotation
 * @param columns Converter processed table columns
 * @returns {string | undefined} Sort conditions for a Presentation variant.
 */
function getSortConditions(
	presentationVariantAnnotation: PresentationVariantTypeTypes | undefined,
	columns: TableColumn[]
): string | undefined {
	let sortConditions: string | undefined;
	if (presentationVariantAnnotation?.SortOrder) {
		const sorters: SorterType[] = [];
		const conditions = {
			sorters: sorters
		};
		presentationVariantAnnotation.SortOrder.forEach(condition => {
			const propertyName = (condition.Property as PropertyPath)?.$target?.name;
			const sortColumn = columns.find(column => column.name === propertyName) as AnnotationTableColumn;
			sortColumn?.propertyInfos?.forEach(relatedPropertyName => {
				// Complex PropertyInfo. Add each related property for sorting.
				conditions.sorters.push({
					name: relatedPropertyName,
					descending: !!condition.Descending
				});
			});

			if (!sortColumn?.propertyInfos?.length) {
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

export function getTableAnnotationConfiguration(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext,
	tableManifestConfiguration: TableControlConfiguration,
	columns: TableColumn[],
	presentationVariantAnnotation?: PresentationVariantTypeTypes
): TableAnnotationConfiguration {
	// Need to get the target
	const { navigationPropertyPath } = splitPath(visualizationPath);
	const title: any = converterContext.getDataModelObjectPath().targetEntityType.annotations?.UI?.HeaderInfo?.TypeNamePlural;
	const entitySet = converterContext.getDataModelObjectPath().startingEntitySet;
	const pageManifestSettings: ManifestWrapper = converterContext.getManifestWrapper();
	const isEntitySet: boolean = navigationPropertyPath.length === 0,
		p13nMode: string | undefined = getP13nMode(visualizationPath, converterContext),
		id = isEntitySet && entitySet ? TableID(entitySet.name, "LineItem") : TableID(visualizationPath);
	const targetCapabilities = getCapabilityRestriction(visualizationPath, converterContext.getConverterContextFor(entitySet));
	const selectionMode = getSelectionMode(lineItemAnnotation, visualizationPath, converterContext, isEntitySet, targetCapabilities);
	let threshold = isEntitySet ? 30 : 10;
	if (presentationVariantAnnotation?.MaxItems) {
		threshold = presentationVariantAnnotation.MaxItems as number;
	}

	const navigationOrCollectionName = isEntitySet && entitySet ? entitySet.name : navigationPropertyPath;
	const navigationSettings = pageManifestSettings.getNavigationConfiguration(navigationOrCollectionName);
	const creationBehaviour = _getCreationBehaviour(lineItemAnnotation, tableManifestConfiguration, converterContext, navigationSettings);
	let isParentDeletable: any, parentEntitySetDeletable;
	if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
		isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), undefined, true);
		if (isParentDeletable?.currentEntityRestriction) {
			parentEntitySetDeletable = undefined;
		} else {
			parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable, true) : isParentDeletable;
		}
	}
	const dataModelObjectPath = converterContext.getDataModelObjectPath();
	const isInsertable: Expression<boolean> = isPathInsertable(dataModelObjectPath);

	return {
		id: id,
		entityName: entitySet ? entitySet.name : "",
		collection: getTargetObjectPath(converterContext.getDataModelObjectPath()),
		navigationPath: navigationPropertyPath,
		isEntitySet: isEntitySet,
		row: _getRowConfigurationProperty(
			lineItemAnnotation,
			visualizationPath,
			converterContext,
			navigationSettings,
			navigationOrCollectionName
		),
		p13nMode: p13nMode,
		show: {
			"delete": getDeleteVisible(converterContext, navigationPropertyPath, targetCapabilities.isDeletable),
			create: compileBinding(getCreateVisible(converterContext, creationBehaviour?.mode, isInsertable)),
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

function isInDisplayMode(converterContext: ConverterContext): boolean {
	const templateType = converterContext.getTemplateType();
	if (templateType === TemplateType.AnalyticalListPage || templateType === TemplateType.ListReport) {
		return true;
	}
	// updatable will be handled at the property level
	return false;
}

/**
 * Split the visualization path into the navigation property path and annotation.
 *
 * @param visualizationPath
 * @returns {object}
 */
function splitPath(visualizationPath: string) {
	let [navigationPropertyPath, annotationPath] = visualizationPath.split("@");

	if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
		// Drop trailing slash
		navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
	}
	return { navigationPropertyPath, annotationPath };
}

export function getSelectionVariantConfiguration(
	selectionVariantPath: string,
	converterContext: ConverterContext
): SelectionVariantConfiguration | undefined {
	const resolvedTarget = converterContext.getEntityTypeAnnotation(selectionVariantPath);
	const selection: SelectionVariantType = resolvedTarget.annotation as SelectionVariantType;

	if (selection) {
		const propertyNames: string[] = [];
		selection.SelectOptions?.forEach((selectOption: SelectOptionType) => {
			const propertyName: any = selectOption.PropertyName;
			const PropertyPath: string = propertyName.value;
			if (propertyNames.indexOf(PropertyPath) === -1) {
				propertyNames.push(PropertyPath);
			}
		});
		return {
			text: selection.Text as string,
			propertyNames: propertyNames
		};
	}
	return undefined;
}

export function getTableManifestConfiguration(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext,
	isCondensedTableLayoutCompliant: boolean = false
): TableControlConfiguration {
	const tableManifestSettings: TableManifestConfiguration = converterContext.getManifestControlConfiguration(visualizationPath);
	const tableSettings = tableManifestSettings.tableSettings;
	let quickSelectionVariant: any;
	const quickFilterPaths: { annotationPath: string }[] = [];
	let enableExport = true;
	let creationMode = CreationMode.NewPage;
	let filters;
	let createAtEnd = true;
	let disableAddRowButtonForEmptyData = false;
	let condensedTableLayout = false;
	let hideTableTitle = false;
	let tableType: TableType = "ResponsiveTable";
	let enableFullScreen = false;
	let selectionLimit = 200;
	let enablePaste = converterContext.getTemplateType() === "ObjectPage";
	const shellServices = converterContext.getShellServices();
	const userContentDensity = shellServices?.getContentDensity();
	const appContentDensity = converterContext.getManifestWrapper().getContentDensities();
	if ((appContentDensity?.cozy === true && appContentDensity?.compact !== true) || userContentDensity === "cozy") {
		isCondensedTableLayoutCompliant = false;
	}
	if (tableSettings && lineItemAnnotation) {
		const targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);
		tableSettings?.quickVariantSelection?.paths?.forEach((path: { annotationPath: string }) => {
			quickSelectionVariant = targetEntityType.resolvePath("@" + path.annotationPath);
			// quickSelectionVariant = converterContext.getEntityTypeAnnotation(path.annotationPath);
			if (quickSelectionVariant) {
				quickFilterPaths.push({ annotationPath: path.annotationPath });
			}
			filters = {
				quickFilters: {
					enabled:
						converterContext.getTemplateType() === TemplateType.ListReport
							? "{= ${pageInternal>hasPendingFilters} !== true}"
							: true,
					showCounts: tableSettings?.quickVariantSelection?.showCounts,
					paths: quickFilterPaths
				}
			};
		});
		creationMode = tableSettings.creationMode?.name || creationMode;
		createAtEnd = tableSettings.creationMode?.createAtEnd !== undefined ? tableSettings.creationMode?.createAtEnd : true;
		disableAddRowButtonForEmptyData = !!tableSettings.creationMode?.disableAddRowButtonForEmptyData;
		condensedTableLayout = tableSettings.condensedTableLayout !== undefined ? tableSettings.condensedTableLayout : false;
		hideTableTitle = !!tableSettings.quickVariantSelection?.hideTableTitle;
		tableType = tableSettings?.type || "ResponsiveTable";
		enableFullScreen = tableSettings.enableFullScreen || false;
		if (enableFullScreen === true && converterContext.getTemplateType() === TemplateType.ListReport) {
			enableFullScreen = false;
			converterContext
				.getDiagnostics()
				.addIssue(IssueCategory.Manifest, IssueSeverity.Low, IssueType.FULLSCREENMODE_NOT_ON_LISTREPORT);
		}
		selectionLimit = tableSettings.selectAll === true || tableSettings.selectionLimit === 0 ? 0 : tableSettings.selectionLimit || 200;
		enablePaste = converterContext.getTemplateType() === "ObjectPage" && tableSettings.enablePaste !== false;
		enableExport =
			tableSettings.enableExport !== undefined
				? tableSettings.enableExport
				: converterContext.getTemplateType() !== "ObjectPage" || enablePaste;
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
