import { FacetTypes, HeaderFacets } from "@sap-ux/vocabularies-types";
import { ManifestSection, ManifestSubSection } from "../ManifestSettings";
import { PageDefinition } from "../TemplateConverter";
import { EntityType } from "@sap-ux/annotation-converter";
import { createCustomSubSections, createSubSections, CustomObjectPageSection, ObjectPageSection } from "../controls/ObjectPage/SubSection";
import { getHeaderFacetsFromAnnotations, getHeaderFacetsFromManifest, ObjectPageHeaderFacet } from "../controls/ObjectPage/HeaderFacet";
import { ConverterContext, TemplateType } from "./BaseConverter";
import { CustomSectionID, SectionID } from "../helpers/ID";
import { ConfigurableRecord, insertCustomElements, Placement, Position } from "../helpers/ConfigurableObject";
import { BaseAction, getActionsFromManifest, removeDuplicateActions } from "sap/fe/core/converters/controls/Common/Action";
import { getHeaderDefaultActions, getFooterDefaultActions } from "sap/fe/core/converters/objectPage/HeaderAndFooterAction";
import { annotationExpression, compileBinding, equal, not } from "sap/fe/core/helpers/BindingExpression";

type ObjectPageDefinition = PageDefinition & {
	headerFacets: ObjectPageHeaderFacet[];
	headerSection?: ObjectPageSection;
	headerActions: BaseAction[];
	sections: ObjectPageSection[];
	footerActions: BaseAction[];
	showHeader: boolean;
	showAnchorBar: boolean;
	useIconTabBar: boolean;
};

const getSectionKey = (facetDefinition: FacetTypes, fallback: string): string => {
	return facetDefinition.ID?.toString() || facetDefinition.Label?.toString() || fallback;
};

/**
 * Create a section that represents the editable header part, it is only visible in edit mode.
 *
 * @param headerFacets
 * @param converterContext
 * @returns {ObjectPageSection} the section representing the editable header parts
 */
function createEditableHeaderSection(headerFacets: HeaderFacets, converterContext: ConverterContext): ObjectPageSection {
	const headerSection: ObjectPageSection = {
		id: "",
		key: "EditableHeaderContent",
		title: "{sap.fe.i18n>T_COMMON_OBJECT_PAGE_HEADER_SECTION}",
		visible: "{= ${ui>/editMode} === 'Editable' }",
		subSections: createSubSections(headerFacets, converterContext)
	};
	return headerSection;
}

/**
 * Creates section definition based on Facet annotation.
 *
 * @param converterContext the converter context
 * @returns {ObjectPageSection[]} all sections
 */
function getSectionsFromAnnotation(converterContext: ConverterContext): ObjectPageSection[] {
	const entityType = converterContext.getEntityType();
	const objectPageSections: ObjectPageSection[] =
		entityType.annotations?.UI?.Facets?.map((facetDefinition: FacetTypes) =>
			getSectionFromAnnotation(facetDefinition, converterContext)
		) || [];
	return objectPageSections;
}

/**
 * Create an annotation based section.
 *
 * @param facet
 * @param converterContext
 * @returns {ObjectPageSection} the current section
 */
function getSectionFromAnnotation(facet: FacetTypes, converterContext: ConverterContext): ObjectPageSection {
	const sectionID = SectionID({ Facet: facet });
	const section: ObjectPageSection = {
		id: sectionID,
		key: getSectionKey(facet, sectionID),
		title: compileBinding(annotationExpression(facet.Label)),
		showTitle: !!facet.Label,
		visible: compileBinding(not(equal(annotationExpression(facet.annotations?.UI?.Hidden), true))),
		subSections: createSubSections([facet], converterContext)
	};
	return section;
}

/**
 * Creates section definition based on manifest definition.
 * @param manifestSections the manifest defined sections
 * @param converterContext
 * @returns {Record<string, CustomObjectPageSection>} the manifest defined sections
 */
function getSectionsFromManifest(
	manifestSections: ConfigurableRecord<ManifestSection>,
	converterContext: ConverterContext
): Record<string, CustomObjectPageSection> {
	const sections: Record<string, CustomObjectPageSection> = {};
	Object.keys(manifestSections).forEach(manifestSectionKey => {
		sections[manifestSectionKey] = getSectionFromManifest(manifestSections[manifestSectionKey], manifestSectionKey, converterContext);
	});
	return sections;
}

/**
 * Create a manifest based custom section.
 * @param customSectionDefinition
 * @param sectionKey
 * @param converterContext
 * @returns {CustomObjectPageSection} the current custom section
 */
function getSectionFromManifest(
	customSectionDefinition: ManifestSection,
	sectionKey: string,
	converterContext: ConverterContext
): CustomObjectPageSection {
	const customSectionID = customSectionDefinition.id || CustomSectionID(sectionKey);
	let position: Position | undefined = customSectionDefinition.position;
	if (!position) {
		position = {
			placement: Placement.After
		};
	}
	let manifestSubSections: Record<string, ManifestSubSection>;
	if (!customSectionDefinition.subSections) {
		// If there is no subSection defined, we add the content of the custom section as subsections
		// and make sure to set the visibility to 'true', as the actual visibility is handled by the section itself
		manifestSubSections = {
			[sectionKey]: {
				...customSectionDefinition,
				position: undefined,
				visible: true
			}
		};
	} else {
		manifestSubSections = customSectionDefinition.subSections;
	}
	const subSections = createCustomSubSections(manifestSubSections, converterContext);

	const customSection: CustomObjectPageSection = {
		id: customSectionID,
		key: sectionKey,
		title: customSectionDefinition.title,
		showTitle: !!customSectionDefinition.title,
		visible: customSectionDefinition.visible !== undefined ? customSectionDefinition.visible : true,
		position: position,
		subSections: insertCustomElements([], subSections, { "title": "overwrite", "actions": "merge" })
	};
	return customSection;
}

export const convertPage = function(converterContext: ConverterContext): ObjectPageDefinition {
	const manifestWrapper = converterContext.getManifestWrapper();
	let headerSection: ObjectPageSection | undefined;
	const entityType: EntityType = converterContext.getEntityType();

	// Retrieve all header facets (from annotations & custom)
	const headerFacets = insertCustomElements(
		getHeaderFacetsFromAnnotations(converterContext),
		getHeaderFacetsFromManifest(manifestWrapper.getHeaderFacets())
	);

	const aAnnotationActions: BaseAction[] = getHeaderDefaultActions(converterContext);

	// Retrieve the page header actions
	const headerActions = insertCustomElements(
		aAnnotationActions,
		getActionsFromManifest(manifestWrapper.getHeaderActions(), converterContext, aAnnotationActions),
		{ isNavigable: "overwrite" }
	);
	// Retrieve the page footer actions
	const footerActions = insertCustomElements(
		getFooterDefaultActions(manifestWrapper.getViewLevel(), converterContext),
		getActionsFromManifest(manifestWrapper.getFooterActions(), converterContext),
		{ isNavigable: "overwrite" }
	);

	if (manifestWrapper.isHeaderEditable() && entityType.annotations.UI?.HeaderFacets) {
		headerSection = createEditableHeaderSection(entityType.annotations.UI?.HeaderFacets, converterContext);
	}

	const sections = insertCustomElements(
		getSectionsFromAnnotation(converterContext),
		getSectionsFromManifest(manifestWrapper.getSections(), converterContext),
		{
			"title": "overwrite",
			"visible": "overwrite",
			"subSections": {
				"actions": "merge",
				"title": "overwrite"
			}
		}
	);

	return {
		template: TemplateType.ObjectPage,
		headerFacets: headerFacets,
		headerSection: headerSection,
		headerActions: removeDuplicateActions(headerActions),
		sections: sections,
		footerActions: footerActions,
		showHeader: manifestWrapper.getShowObjectPageHeader(),
		showAnchorBar: manifestWrapper.getShowAnchorBar(),
		useIconTabBar: manifestWrapper.useIconTabBar()
	};
};
