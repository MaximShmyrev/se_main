sap.ui.define([
	"sap/base/util/extend",
	"sap/base/util/deepExtend",
	"sap/ui/model/odata/AnnotationHelper",
	"sap/suite/ui/generic/template/js/StableIdHelper",
	"sap/suite/ui/generic/template/js/staticChecksHelper",
	"sap/suite/ui/generic/template/js/preparationHelper",
	"sap/suite/ui/generic/template/genericUtilities/FeLogger"], function (extend, deepExtend, AHModel, StableIdHelper, staticChecksHelper, preparationHelper, FeLogger) {
	"use strict";
	var oLogger = new FeLogger("ObjectPage.Component").getLogger();

	function fnGetTemplateSpecificParameters(oComponentUtils, oMetaModel, oOriginalSettings, oDevice, sLeadingEntitySet) {
	
		function fnGetAnnotationWithDefaults(sAnnotationName, oAnnotation) {
			// Provide optional properties of annotation with defaults according to vocabulary
			// should best be done in metaModel itself
			// if they don't agree:
			// - move at least to a central place in our library (-> preparationHelper? MetaDataAnalyzer?)
			// - don't change original data in metaModel, but create a copy
			var oResult = extend({}, oAnnotation);
			switch (sAnnotationName) {
			case "com.sap.vocabularies.UI.v1.ReferenceFacet":
				if (!oResult["com.sap.vocabularies.UI.v1.PartOfPreview"] || oResult["com.sap.vocabularies.UI.v1.PartOfPreview"].Bool !== "false") {
					oResult["com.sap.vocabularies.UI.v1.PartOfPreview"] = {
							Bool: "true"
					};
				}
				break;
			default:
				break;
			}
			return oResult;
		}
	
		function fnGetTargetAnnotation(oReferenceFacetContext) {
			if (!oReferenceFacetContext.getObject().Target) {
				// clarify how to deal with reference facet without target
				return undefined;
			}
			var sMetaModelPath = AHModel.resolvePath(oMetaModel.getContext(oReferenceFacetContext.sPath + "/Target"));
			return sMetaModelPath && oMetaModel.getContext(sMetaModelPath).getObject();
		}
	
		function fnEnsureSectionAsSubsection(oSection){
			// ensures, that the Section has a SubSection pointing to the same annotation and with the same data, except:
			// - the subSection should not contain subSections again
			// - the subSection should contain an (empty) array of blocks (that the section does not contain)
			// This is needed for:
			// - referenceFacet on 2nd level (subSection should be created refering to the collectionFacet on top level)
			// - empty collectionFacet on top level, that should be replaced with ReplaceFacet extension (although this is rather
			//   replacing the whole section, we expect the extension not to contain a subSection, but we create the subSection)
	
			oSection.subSections = oSection.subSections || [];
			// if subSection already exists, do nothing
			if (oSection.subSections.find(function(oSubSection){
				return oSection.additionalData.facetId === oSubSection.additionalData.facetId;
			})) {
				return;
			}
	
			var oSubSection = extend({}, oSection);
			delete oSubSection.subSections;
			oSubSection.blocks = [];
			oSection.subSections.push(oSubSection);
		}
	
	
		var iMissingIdCounter = 0;
		function fnGetSectionsFromAnnotations(sPath, bHeaderFacet, iLevel, oParentFacet) {
			// Analysis of facets. Needs to be tolerant, as sometimes facets are defined in a way that seems to be meaningless,
			// (sometimes used just to be able to replace them in an extension, not clear, whether this is the only reason)
			// known case:
			// collection facet without any facets
			// reference facet without a target (but with an ID)
			// reference facet with a target pointing to an arbitrary string (without special characters, not pointing to sth. within the service)
			// reference facet with a target pointing to a not existing navigation property
			var aResult = [];
			var aLevelNames = ["sections", "subSections", "blocks"];
			iLevel = iLevel || 0;
			var aFacets = oMetaModel.getObject(sPath);
			if (!Array.isArray(aFacets)) {
				// in case of empty collection facet, metaModel returns {} (instead of [] as would be expected)
				// for anything else, meaning would currently not be clear
				return [];
			}
			aFacets.forEach(function (oFacet, i) {
				var oFacetCurrentLevel = {
						additionalData: {
							facetId: StableIdHelper.getStableId({
								type: "ObjectPage",
								subType: "Facet",
								sRecordType: oFacet.RecordType,
								bIsHeaderFacet: bHeaderFacet,
								sAnnotationPath: oFacet.Target && oFacet.Target.AnnotationPath,
								sAnnotationId: oFacet.ID && oFacet.ID.String
							})
						},
						annotations: {
							Facet: {
								annotation: deepExtend({}, oFacet)
							}
						},
						metaModelPath: sPath + "/" + i
				};
	
				// as intermediate step provide id also as an object with property id to simplify switching from generating facetId during templating
				oFacetCurrentLevel.facetIdAsObject = {
						id: oFacetCurrentLevel.additionalData.facetId 
				};
	
				// Note: fallbackIdByEnumerationForRuntime is not guaranteed to be stable, even from one session to the other, so don't use it in the view (as in
				// view cache it would be kept, but in next session, a different one could be created). In fact, as this class is static, the missingIdCounter is shared
				// between OPs, so depending on the order OP instances are loaded, the ids are different.
				// If it becomes necessary to store an id in the view (e.g. in custom data) - i.e. have an id being stable from one session to the other, though still not over
				// releases, this needs to be changed (either be using separate counters per OP instance, or maybe a completely different approach, e.g. stringifying the corresponding
				// subObject in metaModel). This might make sense to be able to create all infoObjects upfront, or to get rid of infoobjects completely.
				oFacetCurrentLevel.fallbackIdByEnumerationForRuntime = oFacetCurrentLevel.additionalData.facetId || "missingStableId#" + iMissingIdCounter++;
	
				if (oFacet.RecordType === "com.sap.vocabularies.UI.v1.CollectionFacet") {
					var aNextLevel = fnGetSectionsFromAnnotations(sPath + "/" + i + "/Facets", bHeaderFacet, iLevel + 1, oFacetCurrentLevel);
					// in case of empty collectionFacet at top level, create also subSection to be used for ReplaceFacet extension
					if (iLevel === 0 && !oFacetCurrentLevel.subSections && aNextLevel.length === 0) {
						fnEnsureSectionAsSubsection(oFacetCurrentLevel);
					} else {
						var sNextLevel = aLevelNames[iLevel + 1] || "unsupportedNestingLevel";
						oFacetCurrentLevel[sNextLevel] = oFacetCurrentLevel[sNextLevel] || [];
						oFacetCurrentLevel[sNextLevel] = oFacetCurrentLevel[sNextLevel].concat(aNextLevel);
					}
				} else if (oFacet.RecordType === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
					// Id that would would be generated if no id is provided in annotations: Since in the past for some cases sections could be identified in manifest by this id
					// even if a real id was provided in annotation, we need to know this id to be able to merge also manifest settings provided there.
					// This kind of id is only defined for reference facets (and calculated by using the annotation path of the target annotation)
					oFacetCurrentLevel.fallbackIdByAnnotationPathForManifest = StableIdHelper.getStableId({
						type: "ObjectPage",
						subType: "Facet",
						sRecordType: oFacet.RecordType,
						bIsHeaderFacet: bHeaderFacet,
						sAnnotationPath: oFacet.Target && oFacet.Target.AnnotationPath
					});
	
					oFacetCurrentLevel.annotations.Facet.annotation = fnGetAnnotationWithDefaults("com.sap.vocabularies.UI.v1.ReferenceFacet", oFacet);
					// oBlock describes what is actually build out of the reference facet (except the section/subsection structure). Naming comes from ObjectPageSubSections default aggregation
					// - think of whether this is the best naming here
					var oBlock = extend({}, oFacetCurrentLevel);
	
					// Todo: targetAnnotation is not really needed here (when jsut analyzing sections structure), but only later, when normalizing specific properties. Thus, it should be moved there.
					// Currently, we keep it here, as we use fnNormalizeSections on all levels (-> should be split, targetAnnotation only needed on block level)
					oBlock.targetAnnotation = fnGetTargetAnnotation(oMetaModel.getContext(sPath + "/" + i));
					// if facet annotation is inconsistent, targetAnnotation would be undefined. Keep it here anyway, as extension might refer to it
	
					var oSubSection;
	
					switch (iLevel) {
					case 0:
						// ignore reference facet with wrong target on first level (compatibility)
						// don't ignore facet without any target - can be used for replaceFacet extension (if it has an ID) and was not ignored in past
						if (oFacet.Target && !oFacet.Target.AnnotationPath){
							return;
						}
						// if reference facet is defined directly, it's used to create Section, SubSection and Block
						oSubSection = extend({}, oFacetCurrentLevel);
						oSubSection.blocks = [oBlock];
						oFacetCurrentLevel.subSections = [oSubSection];
						break;
					case 1:
						// in case of collection facet on top containing reference facet, create only one subsection also using collectionFacet id, and push reference facets down as blocks
						// be aware: top level collection facet could contain both, reference facets and collection facets
						fnEnsureSectionAsSubsection(oParentFacet);
						oSubSection = oParentFacet.subSections.find(function(oSubSection){
							return oSubSection.additionalData.facetId === oParentFacet.additionalData.facetId;
						});
						oSubSection.blocks.push(oBlock);
						// in old releases, only one SmartForm was created, its id being derived from collection facet. As this could be used by key user changes as anchor to add 
						// extended data, we create an additional SmartForm with that id
						oSubSection.dummyFormId = StableIdHelper.getStableId({type: 'ObjectPageSection', subType: 'SmartForm', sFacet: oParentFacet.additionalData.facetId, sIsPartOfPreview: 'true'});
						return;
					case 2:
						oFacetCurrentLevel.targetAnnotation = oBlock.targetAnnotation;
						// if all reference facets are pointing to fieldgroups, in old releases even with a 3-level hierarchy, only one SmartForm was created. So, even in this case we need
						// an additional SmartForm with id derived from collection facet on second level.
						oParentFacet.dummyFormId = StableIdHelper.getStableId({type: 'ObjectPageSection', subType: 'SmartForm', sFacet: oParentFacet.additionalData.facetId, sIsPartOfPreview: 'true'});
						break;
					default:
						oLogger.warning("UnSupported Nesting of Collectionfacets");
					break;
					}
				}
				aResult.push(oFacetCurrentLevel);
			});
			return aResult;
		}
	
	
		function fnGetNormalizedTableSettings(oSettings) {
			// for ObjectPage, unfortunately an additional settings allTableMultiSelect had been introduced, that just has the same meaning as setting
			// multiSelect on component level, but needs to be supported for compatibility
			oSettings.multiSelect = oSettings.multiSelect || oSettings.allTableMultiSelect;
	
			// tolerance if reference facet points to a not existent navigation property: assume no navigation, i.e. use entiyset of page
			var sTargetMetaModelPath = AHModel.gotoEntitySet(oMetaModel.getContext(oSettings.metaModelPath + "/Target"));
			var sEntitySet = sTargetMetaModelPath && oMetaModel.getObject(sTargetMetaModelPath).name || sLeadingEntitySet;
			//					var oLineItem = preparationHelper.getAnnotation(oMetaModel, oMetaModel.getODataEntitySet(sEntitySet).entityType, oSettings.annotation, oSettings.qualifier);
	
			var oExtensions = oComponentUtils.getControllerExtensions();
			// todo: check, whether fallbackIdByAnnotationPathForManifest could also be used for oExtensions.Sections
			var oExtensionActions = oExtensions && oExtensions.Sections && oExtensions.Sections[oSettings.additionalData.facetId] && oExtensions.Sections[oSettings.additionalData.facetId].Actions;
			var oResult = preparationHelper.getNormalizedTableSettings(oMetaModel, oSettings, oDevice, sEntitySet, oExtensionActions, oSettings.targetAnnotation);
			oResult.variantManagement = !!(oSettings.tableSettings && oSettings.tableSettings.variantManagement);
			// if selection is only needed for delete (button in toolbar), it should be only set when deletion is actually possible
			// in draft, deletion is possible only in edit case, in non-draft, only in display case
			if (oResult.onlyForDelete) {
				oResult.mode = oComponentUtils.isDraftEnabled() ? "{= ${ui>/editable} ? '" + oResult.mode + "' : 'None'}"
						: "{= ${ui>/editable} ? 'None' : '" + oResult.mode + "'}";
			}
			var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
			if (oResult && oResult.createWithParameterDialog && oResult.createWithParameterDialog.fields) {
				staticChecksHelper.checkErrorforCreateWithDialog(oMetaModel.getODataEntityType(oEntitySet.entityType), oResult);
				oResult.createWithParameterDialog.id = StableIdHelper.getStableId({ type: 'ObjectPageAction', subType: 'CreateWithDialog', sFacet: oSettings.additionalData.facetId });
			}
	
			return oResult;
		}
	
		function fnGetNormalizedChartSettings(oSettings) {
			return {
				variantManagement: !!(oSettings.chartSettings && oSettings.chartSettings.variantManagement),
				chartTitle: oSettings.targetAnnotation && oSettings.targetAnnotation.Title
			};
		}
	
		function fnNormalizeSectionSettings(oFacetData) {
			// To avoid the inconsistency introduced in the past to read section settings, the framework now merges the settings coming from id generated from annotations
			// and the id framework generates thus avoid breaking the possibility to define the settings either way.
			var oMergedSectionSettings = oOriginalSettings.sections &&
			extend({}, oOriginalSettings.sections[oFacetData.additionalData.facetId], oOriginalSettings.sections[oFacetData.fallbackIdByAnnotationPathForManifest]);
	
			extend(oFacetData, oMergedSectionSettings, oFacetData);
			// Prio 3: any settings on page level: Maybe only relevant depending on annotation (e.g. tableSettings only relevant for LineItem annotation)
			if (oFacetData.targetAnnotation){
			var oSettings = deepExtend({}, oOriginalSettings, oFacetData);
	
			/*
			 *	To be checked - where is this needed?
			 *
			 * 					var oLoadingBehavior = oSettings && oSettings.loadingBehavior;
	                            if (!oLoadingBehavior) {
	                                // default LoadingBehavior
	                                oSettings.loadingStrategy = "lazyLoading";
	                            } else if (oLoadingBehavior.waitForViewportEnter) {
	                                oSettings.loadingStrategy = oLoadingBehavior.waitForHeaderData ? "lazyLoadingAfterHeader" : "lazyLoading";
	                             } else {
	                                oSettings.loadingStrategy = oLoadingBehavior.waitForHeaderData ? "activateAfterHeaderDataReceived" : "activateWithBindingChange";
	                             }
			 */
	
			// specific analysis for anything defined in the annotation a reference facet is refering to
			// only needed on block level - on sections and subSections level, targetAnnotation is not defined
			// on block level, target annotation could also be undefined, if the reference facet annotation is broken (i.e. not build correctly, or refering to sth. not existentn in the service). In this case, no specific analysis is needed.
			// We would anyway not render anything for this, so there can also not be any settings that might be needed to be analyzed. However, the section, subsection or block it self is needed to provide the corresponding extension points:
			// ReplaceFacet, BeforeFacet, AfterFacet, ReplaceSubSection, BeforeSubSection, AfterSubSection, SmartFormExtension
				// as targetAnnotation is found, we can rely on correct facetAnnotation
				var sAnnotation = oFacetData.annotations.Facet.annotation.Target.AnnotationPath.split("@").pop().split("#")[0];
	
				switch (sAnnotation) {
				case "com.sap.vocabularies.UI.v1.LineItem":
					oFacetData.tableSettings = fnGetNormalizedTableSettings(oSettings);
					break;
				case "com.sap.vocabularies.UI.v1.Chart":
					oFacetData.chartSettings = fnGetNormalizedChartSettings(oSettings);
					break;
					//						further possibilities:
					//						case "com.sap.vocabularies.UI.v1.FieldGroup":
					//						case "com.sap.vocabularies.UI.v1.Identification":
					//						case "com.sap.vocabularies.Communication.v1.Contact":
					//						case "com.sap.vocabularies.UI.v1.DataPoint":
				default: break;
				}
			}
		}
	
		function fnGetTitleVisibility(oSubSectionData) {
			oSubSectionData.bShowTitle = true;
			var rSingleQuote = new RegExp("'", 'g');
			var rDoubleQuote = new RegExp('"', 'g');
			if (oSubSectionData.blocks.length === 1) {
				var oFacetData = oSubSectionData.blocks[0];
				if (oFacetData.targetAnnotation){
					var sSubSectionLabel = oSubSectionData.annotations.Facet.annotation.Label && oSubSectionData.annotations.Facet.annotation.Label.String;
					var sSectionTitle = sSubSectionLabel && sSubSectionLabel.replace(rSingleQuote, "\\'").replace(rDoubleQuote, '\\"');
					// as targetAnnotation is found, we can rely on correct facetAnnotation
					var sAnnotation = oFacetData.annotations.Facet.annotation.Target.AnnotationPath.split("@").pop().split("#")[0];
					if ((sAnnotation === "com.sap.vocabularies.UI.v1.LineItem")
						&& oFacetData.tableSettings
						&& oFacetData.tableSettings.headerInfo) {
						var sTableTitle = oFacetData.tableSettings.headerInfo.TypeNamePlural && oFacetData.tableSettings.headerInfo.TypeNamePlural.String && oFacetData.tableSettings.headerInfo.TypeNamePlural.String.replace(rSingleQuote, "\\'");
						sTableTitle = sTableTitle && sTableTitle.replace(rDoubleQuote, '\\"');
						if (sTableTitle && sTableTitle.indexOf(">") > -1) {
							sTableTitle = "@i18n>" + sTableTitle.split(">")[1].split("}")[0];
						} else {
							sTableTitle = "@i18n>" + sTableTitle;
						}
						if (sSectionTitle && sSectionTitle.indexOf(">") > -1) {
							sSectionTitle = "@i18n>" + sSectionTitle.split(">")[1].split("}")[0];
						} else {
							sSectionTitle = "@i18n>" + sSectionTitle;
						}
						oSubSectionData.bShowTitle = "{parts: [{path: '" + sSectionTitle + "'}, {path: '" + sTableTitle + "'}], formatter: 'sap.suite.ui.generic.template.js.AnnotationHelper.formatSubSectionHeader'}";
					} else if ((sAnnotation === "com.sap.vocabularies.UI.v1.Chart")
						&& oFacetData.chartSettings
						&& oFacetData.chartSettings.chartTitle) {
						var sChartTitle = oFacetData.chartSettings.chartTitle.String && oFacetData.chartSettings.chartTitle.String.replace(rSingleQuote, "\\'");
						sChartTitle = sChartTitle && sChartTitle.replace(rDoubleQuote, '\\"');
						if (sChartTitle && sChartTitle.indexOf(">") > -1) {
							sChartTitle = "@i18n>" + sChartTitle.split(">")[1].split("}")[0];
						} else {
							sChartTitle = "@i18n>" + sChartTitle;
						}
						if (sSectionTitle && sSectionTitle.indexOf(">") > -1) {
							sSectionTitle = "@i18n>" + sSectionTitle.split(">")[1].split("}")[0];
						} else {
							sSectionTitle = "@i18n>" + sSectionTitle;
						}
						oSubSectionData.bShowTitle = "{parts: [{path: '" + sSectionTitle + "'}, {path: '" + sChartTitle + "'}], formatter: 'sap.suite.ui.generic.template.js.AnnotationHelper.formatSubSectionHeader'}";
					}
				}
			}
		}
	
		function getExtensionSectionAndSubsection(sExtensionPointNamePrefix, oFacetViewExtension) {
			var oStableIdTypesAndSubTypeForFacetExtensionSectionsAndSubSections = {
					BeforeFacet: {
						withKey: {
							section: {
								type: "ObjectPageSection",
								subType: "BeforeFacetExtensionSectionWithKey"
							},
							subSection: {
								type: "ObjectPageSection",
								subType: "BeforeFacetExtensionSubSectionWithKey"
							}
						},
						withoutKey: {
							section: {
								type: "ObjectPageSection",
								subType: "BeforeFacetExtensionSection"
							},
							subSection: {
								type: "ObjectPageSection",
								subType: "BeforeFacetExtensionSubSection"
							}
						}
					},
					AfterFacet: {
						withKey: {
							section: {
								type: "ObjectPageSection",
								subType: "AfterFacetExtensionSectionWithKey"
							},
							subSection: {
								type: "ObjectPageSection",
								subType: "AfterFacetExtensionSubSectionWithKey"
							}
						},
						withoutKey: {
							section: {
								type: "ObjectPageSection",
								subType: "AfterFacetExtensionSection"
							},
							subSection: {
								type: "ObjectPageSection",
								subType: "AfterFacetExtensionSubSection"
							}
						}
					}
			};
	
			var oStableIdParameterDefinition = oStableIdTypesAndSubTypeForFacetExtensionSectionsAndSubSections[sExtensionPointNamePrefix][oFacetViewExtension.sKey ? "withKey" : "withoutKey"];
			
			var oStableIdParameter = extend({}, oStableIdParameterDefinition.section);
			oStableIdParameter.sEntitySet = oFacetViewExtension.sEntitySet;
			oStableIdParameter.sFacet = oFacetViewExtension.sFacetId;
			// in case key is explicitly defined by application, use that one - otherwise use key derived from extension point name (4th part of split by |)
			oStableIdParameter.sFacetExtensionKey = oFacetViewExtension.oExtensionDefinition.key || oFacetViewExtension.sKey;
			var sSectionId = StableIdHelper.getStableId(oStableIdParameter);
			
			oStableIdParameter.type = oStableIdParameterDefinition.subSection.type;
			oStableIdParameter.subType = oStableIdParameterDefinition.subSection.subType;
			var sSubSectionId = StableIdHelper.getStableId(oStableIdParameter);
			
			return {
				id: sSectionId,
				additionalData: {
					facetId: oFacetViewExtension.sFacetId
				},
				extensionPointName: oFacetViewExtension.sExtensionPointName,
				extensionPointNamePrefix: oFacetViewExtension.sExtensionPointNamePrefix,
				subSections: [{
					id: sSubSectionId,
					additionalData: {
						facetId: oFacetViewExtension.sFacetId
					},
					extensionPointName: oFacetViewExtension.sExtensionPointName,
					extensionPointNamePrefix: oFacetViewExtension.sExtensionPointNamePrefix,
					blocks: []
				}]
			}; 
		}
	
		function fnGetViewExtensions(){
			// get all the extensions
			var mViewExtensions = oComponentUtils.getViewExtensions() || {};
			return Object.keys(mViewExtensions).map(function(sExtensionPointName) {
				var aKeyParts = sExtensionPointName.split("|");
				return {
					sExtensionPointNamePrefix: aKeyParts[0],
					sEntitySet: aKeyParts[1],
					sFacetId: aKeyParts[2],
					sKey: aKeyParts[3],
					oExtensionDefinition: mViewExtensions[sExtensionPointName],
					sExtensionPointName: sExtensionPointName
				};
			}).filter(function(oViewExtension) {
				// get the current object page instance extension
				return oViewExtension.sEntitySet === sLeadingEntitySet;
			});		
			
		}
		
		function fnAddSectionsFromExtensions(aSectionsFromAnnotations){
			var aViewExtensions = fnGetViewExtensions();
			
			var aResultSections = [];
			aSectionsFromAnnotations.forEach(function (oSectionData) {
				var aBeforeFacetExtensions = aViewExtensions.filter(function(oViewExtension){
					return oViewExtension.sFacetId === oSectionData.additionalData.facetId && oViewExtension.sExtensionPointNamePrefix === "BeforeFacet";
				});
				var aAfterFacetExtensions = aViewExtensions.filter(function(oViewExtension){
					return oViewExtension.sFacetId === oSectionData.additionalData.facetId && oViewExtension.sExtensionPointNamePrefix === "AfterFacet";
				});
				// keep the order
				aResultSections = aResultSections.concat(aBeforeFacetExtensions.map(getExtensionSectionAndSubsection.bind(null, "BeforeFacet")));
				aResultSections.push(oSectionData);
				aResultSections = aResultSections.concat(aAfterFacetExtensions.map(getExtensionSectionAndSubsection.bind(null, "AfterFacet")));
			});
			return aResultSections;
		}
	
		function fnNormalizeBlock(oBlockData){
			fnNormalizeSectionSettings(oBlockData);
		}
	
		function fnIsBlockRelevant(oBlockData){
			return oBlockData.annotations.Facet.annotation.RecordType === "com.sap.vocabularies.UI.v1.ReferenceFacet";
		}
		
		function fnNormalizeSubSection(oSubSectionData){
			fnNormalizeSectionSettings(oSubSectionData);
			oSubSectionData.blocks.forEach(fnNormalizeBlock);
			oSubSectionData.blocks = oSubSectionData.blocks.filter(fnIsBlockRelevant);
			
			// Todo: check, whether it's correct to analyze visibility before segregating blocks and more blocks
			// Title is hidden only, when there's only one block, this one is showing a table or a chart, and this control shows the same title as the subsection
			// Questionable edge cases:
			// - only e block, it matches the criteria, but is not partOfPreview => title would not be shown before user presses show more
			// - multiple blocks, but only one being partOfPreview, that one matches the criteria => title would be shown twice, which seems to be superfluous until user presses show more
			
			/*
			in case of subsection having single block with either a table or chart and subsection title matches table title
			then hide subsection and section title and show only table title
			*/
			fnGetTitleVisibility(oSubSectionData);
			
			// segregate blocks and more blocks
			oSubSectionData.moreBlocks = oSubSectionData.blocks.filter(function (oBlock) {
				return oBlock.annotations.Facet.annotation["com.sap.vocabularies.UI.v1.PartOfPreview"].Bool === "false";
			});
			if (oSubSectionData.moreBlocks.length > 0){
				oSubSectionData.dummyFormIdMoreBlocks = StableIdHelper.getStableId({type: 'ObjectPageSection', subType: 'SmartForm', sFacet: oSubSectionData.additionalData.facetId, sIsPartOfPreview: 'false'});
			}
			oSubSectionData.blocks = oSubSectionData.blocks.filter(function (oBlock) {
				return oBlock.annotations.Facet.annotation["com.sap.vocabularies.UI.v1.PartOfPreview"].Bool === "true";
			});
		}
		
		function fnIsSubSectionRelevant(){
			return true;
		}
	
		function fnNormalizeSection(oSectionData){
			fnNormalizeSectionSettings(oSectionData);
			oSectionData.subSections.forEach(fnNormalizeSubSection);
			oSectionData.subSections = oSectionData.subSections.filter(fnIsSubSectionRelevant);
		}
		
		function fnIsSectionRelevant(){
			return true;
		}
	
		function fnGetSections(){
			var sEntityTypePath = oMetaModel.getMetaContext("/" + sLeadingEntitySet).getPath();
			var aSectionsFromAnnotations = fnGetSectionsFromAnnotations(sEntityTypePath + "/com.sap.vocabularies.UI.v1.Facets", false);
			var aAllSections = fnAddSectionsFromExtensions(aSectionsFromAnnotations);
			aAllSections.forEach(fnNormalizeSection);
			return aAllSections.filter(fnIsSectionRelevant);
		}
	
		return {
			sections: fnGetSections(),
			breadCrumb: oComponentUtils.getBreadCrumbInfo(),
			isSelflinkRequired: true,
			isIndicatorRequired: true,
			isSemanticallyConnected: false
		};
	}
	
	
	return {
		getTemplateSpecificParameters: fnGetTemplateSpecificParameters
	};
});
