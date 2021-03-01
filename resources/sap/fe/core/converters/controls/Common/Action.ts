import { Action } from "@sap-ux/vocabularies-types";
import { ActionType, ManifestAction, NavigationSettingsConfiguration, ManifestTableColumn } from "sap/fe/core/converters/ManifestSettings";
import { ConfigurableObject, CustomElement, Placement } from "sap/fe/core/converters/helpers/ConfigurableObject";
import { CustomActionID } from "sap/fe/core/converters/helpers/ID";
import { replaceSpecialChars } from "sap/fe/core/helpers/StableIdHelper";
import {
	annotationExpression,
	bindingExpression,
	BindingExpression,
	compileBinding,
	formatResult,
	isConstant,
	resolveBindingString
} from "sap/fe/core/helpers/BindingExpression";
import fpmFormatter from "sap/fe/core/formatters/FPMFormatter";
import { ConverterContext } from "sap/fe/core/converters/templates/BaseConverter";

export enum ButtonType {
	Accept = "Accept",
	Attention = "Attention",
	Back = "Back",
	Critical = "Critical",
	Default = "Default",
	Emphasized = "Emphasized",
	Ghost = "Ghost",
	Negative = "Negative",
	Neutral = "Neutral",
	Reject = "Reject",
	Success = "Success",
	Transparent = "Transparent",
	Unstyled = "Unstyled",
	Up = "Up"
}

export type BaseAction = ConfigurableObject & {
	id?: string;
	text?: string;
	type: ActionType;
	press?: string;
	enabled?: BindingExpression<boolean>;
	visible?: BindingExpression<boolean>;
	enableOnSelect?: string;
	isNavigable?: boolean;
	enableAutoScroll?: boolean;
	requiresDialog?: string;
	binding?: string;
	buttonType?: ButtonType.Ghost | ButtonType.Transparent | string;
	parentEntityDeleteEnabled?: BindingExpression<boolean>;
	menu?: (string | CustomAction | BaseAction)[];
};

export type AnnotationAction = BaseAction & {
	type: ActionType.DataFieldForIntentBasedNavigation | ActionType.DataFieldForAction;
	annotationPath: string;
	id?: string;
	customData?: string;
};

/**
 * Custom Action Definition
 *
 * @typedef CustomAction
 */
export type CustomAction = CustomElement<
	BaseAction & {
		type: ActionType.Default | ActionType.Menu;
		handlerMethod: string;
		handlerModule: string;
		menu?: (string | CustomAction | BaseAction)[];
		requiresSelection?: boolean;
	}
>;

// Reuse of ConfigurableObject and CustomElement is done for ordering
export type ConverterAction = AnnotationAction | CustomAction;

/**
 * Prepare menu action from manifest actions.
 * @param {Record<string, CustomAction>} actions the manifest definition
 * @param {BaseAction[]} aAnnotationActions the annotation actions definition
 * @returns {Record<string, CustomAction>} the actions from the manifest and menu option added
 */
function prepareMenuAction(actions: Record<string, CustomAction>, aAnnotationActions: BaseAction[]): Record<string, CustomAction> {
	const allActions: Record<string, CustomAction> = {};
	let menuItemKeys: string[] | undefined = [];

	for (const actionKey in actions) {
		const manifestAction: CustomAction = actions[actionKey];
		if (manifestAction.type === ActionType.Menu) {
			const menuItems: (CustomAction | BaseAction)[] = [];
			let _menuItemKeys =
				manifestAction.menu?.map((menuKey: string | CustomAction) => {
					let action: BaseAction | CustomAction | undefined = actions[menuKey as string];

					if (!action) {
						action = aAnnotationActions.find((action: BaseAction) => action.key === menuKey);
					}

					if (
						action?.visible ||
						action?.type === ActionType.DataFieldForAction ||
						action?.type === ActionType.DataFieldForIntentBasedNavigation
					) {
						menuItems.push(action);
					}

					return menuKey as string;
				}) ?? [];

			// Show menu button if it has more then 1 item visible
			if (menuItems.length > 1) {
				manifestAction.menu = menuItems;
			} else {
				_menuItemKeys = [actionKey];
			}

			menuItemKeys = [...menuItemKeys, ..._menuItemKeys];
		}

		allActions[actionKey] = manifestAction;
	}

	// eslint-disable-next-line no-unused-expressions
	menuItemKeys?.forEach((actionKey: string) => delete allActions[actionKey]);
	return allActions;
}

export const removeDuplicateActions = (actions: BaseAction[]): BaseAction[] => {
	const oMenuItemKeys: { [key: string]: any } = {};
	actions.forEach(action => {
		if (action?.menu?.length) {
			action.menu.reduce((item, { key }: any) => {
				if (key && !item[key]) {
					item[key] = true;
				}
				return item;
			}, oMenuItemKeys);
		}
	});
	return actions.filter(action => !oMenuItemKeys[action.key]);
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
export function getActionsFromManifest(
	manifestActions: Record<string, ManifestAction> | undefined,
	converterContext: ConverterContext,
	aAnnotationActions?: BaseAction[],
	navigationSettings?: NavigationSettingsConfiguration,
	considerNavigationSettings?: boolean
): Record<string, CustomAction> {
	const actions: Record<string, CustomAction> = {};
	for (const actionKey in manifestActions) {
		const manifestAction: ManifestAction = manifestActions[actionKey];
		const lastDotIndex = manifestAction.press?.lastIndexOf(".");

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
				anchor: manifestAction.position?.anchor,
				placement: manifestAction.position === undefined ? Placement.After : manifestAction.position.placement
			},
			isNavigable: isActionNavigable(manifestAction, navigationSettings, considerNavigationSettings),
			requiresSelection: manifestAction.requiresSelection === undefined ? false : manifestAction.requiresSelection,
			enableAutoScroll: enableAutoScroll(manifestAction),
			menu: manifestAction.menu ?? []
		};
	}
	return prepareMenuAction(actions, aAnnotationActions ?? []);
}

function getManifestActionEnablement(enabledString: string, converterContext: ConverterContext) {
	const resolvedBinding = resolveBindingString(enabledString, "boolean");
	if (isConstant(resolvedBinding) && typeof resolvedBinding.value === "boolean") {
		// true / false
		return resolvedBinding.value;
	} else if (resolvedBinding._type !== "EmbeddedBinding") {
		// Then it's a module-method reference "sap.xxx.yyy.doSomething"
		const methodPath = resolvedBinding.value as string;
		return compileBinding(
			formatResult(
				[bindingExpression("/", "$view"), methodPath, bindingExpression("selectedContexts", "internal")],
				fpmFormatter.customIsEnabledCheck,
				converterContext.getAnnotationEntityType()
			)
		);
	} else {
		// then it's a binding
		return compileBinding(resolvedBinding);
	}
}

export function getEnabledBinding(actionDefinition: Action | undefined): string {
	if (!actionDefinition) {
		return "true";
	}
	if (!actionDefinition.isBound) {
		return "true";
	}
	const operationAvailable = actionDefinition.annotations?.Core?.OperationAvailable;
	if (operationAvailable) {
		let bindingExpression = compileBinding(annotationExpression(operationAvailable));
		if (bindingExpression) {
			/**
			 * Action Parameter is ignored by the formatter when trigger by templating
			 * here it's done manually
			 **/
			let paramSuffix = actionDefinition.parameters?.[0]?.fullyQualifiedName;
			if (paramSuffix) {
				paramSuffix = paramSuffix.replace(actionDefinition.fullyQualifiedName + "/", "");
				bindingExpression = bindingExpression.replace(paramSuffix + "/", "");
			}
			return bindingExpression;
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

export function getSemanticObjectMapping(aMappings: any[]): any[] {
	const aSemanticObjectMappings: any[] = [];
	aMappings.forEach(oMapping => {
		const oSOMapping = {
			"LocalProperty": {
				"$PropertyPath": oMapping.LocalProperty.value
			},
			"SemanticObjectProperty": oMapping.SemanticObjectProperty
		};
		aSemanticObjectMappings.push(oSOMapping);
	});
	return aSemanticObjectMappings;
}

export function isActionNavigable(
	action: ManifestAction | ManifestTableColumn,
	navigationSettings?: NavigationSettingsConfiguration,
	considerNavigationSettings?: boolean
): boolean {
	let bIsNavigationConfigured: boolean = true;
	if (considerNavigationSettings) {
		const detailOrDisplay = navigationSettings && (navigationSettings.detail || navigationSettings.display);
		bIsNavigationConfigured = detailOrDisplay?.route ? true : false;
	}
	// when enableAutoScroll is true the navigateToInstance feature is disabled
	if (
		(action &&
			action.afterExecution &&
			(action.afterExecution?.navigateToInstance === false || action.afterExecution?.enableAutoScroll === true)) ||
		!bIsNavigationConfigured
	) {
		return false;
	}
	return true;
}

export function enableAutoScroll(action: ManifestAction): boolean {
	return action?.afterExecution?.enableAutoScroll === true;
}
