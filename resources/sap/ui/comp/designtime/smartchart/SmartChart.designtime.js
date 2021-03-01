/*
 * ! SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";return{annotations:{semanticObject:{namespace:"com.sap.vocabularies.Common.v1",annotation:"SemanticObject",target:["EntitySet","EntityType","Property"],defaultValue:null,appliesTo:["text"],group:["Behavior"],since:"1.34.1"},fieldVisible:{namespace:"com.sap.vocabularies.Common.v1",annotation:"FieldControlType",target:["Property"],allowList:{values:["Hidden"]},defaultValue:false,appliesTo:["field/#/visible"],group:["Behavior"],since:"1.34.1"},presentationVariant:{namespace:"com.sap.vocabularies.UI.v1",annotation:"PresentationVariant",target:["EntitySet","EntityType"],defaultValue:null,appliesTo:["chartFields"],group:["Behavior"],since:"1.34.1"},chart:{namespace:"com.sap.vocabularies.UI.v1",annotation:"Chart",target:["EntityType"],allowList:{properties:["ChartType","Measures","MeasureAttributes","Dimensions","DimensionAttributes"]},defaultValue:null,appliesTo:["chart"],group:["Behavior"],since:"1.34.1"},dataPoint:{namespace:"com.sap.vocabularies.UI.v1",annotation:"DataPoint",target:["PropertyValue"],defaultValue:null,appliesTo:["dataPoint"],group:["Behavior"],since:"1.48.0"},text:{namespace:"com.sap.vocabularies.Common.v1",annotation:"Text",target:["Property"],defaultValue:null,appliesTo:["text"],group:["Appearance","Behavior"],since:"1.32.1"},textArrangement:{namespace:"com.sap.vocabularies.UI.v1",annotation:"TextArrangement",target:["EntityType","Annotation"],defaultValue:null,appliesTo:["fieldItem/#/value"],group:["Appearance","Behavior"],since:"1.32.1"},IsFiscalYear:{namespace:"com.sap.vocabularies.Common.v1",annotation:"IsFiscalYear",target:["Property"],defaultValue:true,appliesTo:["Dimensions"],group:["Appearance","Behavior"],since:"1.82"},IsFiscalYearPeriod:{namespace:"com.sap.vocabularies.Common.v1",annotation:"IsFiscalYearPeriod",target:["Property"],defaultValue:true,appliesTo:["Dimensions"],group:["Appearance","Behavior"],since:"1.82"},IsCalendarYear:{namespace:"com.sap.vocabularies.Common.v1",annotation:"IsCalendarYear",target:["Property"],defaultValue:null,appliesTo:["Dimensions"],group:["Appearance","Behavior"],since:"1.82"},IsCalendarYearQuarter:{namespace:"com.sap.vocabularies.Common.v1",annotation:"IsCalendarYearQuarter",target:["Property"],defaultValue:null,appliesTo:["Dimensions"],group:["Appearance","Behavior"],since:"1.82"},IsCalendarYearMonth:{namespace:"com.sap.vocabularies.Common.v1",annotation:"IsCalendarYearMonth",target:["Property"],defaultValue:null,appliesTo:["Dimensions"],group:["Appearance","Behavior"],since:"1.82"},IsCalendarYearWeek:{namespace:"com.sap.vocabularies.Common.v1",annotation:"IsCalendarYearWeek",target:["Property"],defaultValue:null,appliesTo:["Dimensions"],group:["Appearance","Behavior"],since:"1.82"}},customData:{dateFormatSettings:{type:"string",defaultValue:"\{'UTC':'true'\}",group:["Appearance"],since:"1.28.1"},skipAnnotationParse:{type:"boolean",defaultValue:null,appliesTo:["content"],since:"1.28.1"},defaultDimensionDisplayBehaviour:{type:"sap.ui.comp.smartfilterbar.DisplayBehaviour",defaultValue:"",since:"1.28.1"},chartQualifier:{type:"string",defaultValue:null,appliesTo:["content"]},presentationVariantQualifier:{type:"string",defaultValue:null,appliesTo:["content"]},p13nDialogSettings:{type:"object",defaultValue:{}}},properties:{entitySet:{ignore:true},smartFilterId:{ignore:true},ignoredFields:{ignore:true},requestAtLeastFields:{ignore:false},ignoreFromPersonalisation:{ignore:true},chartType:{ignore:true},ignoredChartTypes:{ignore:false},useVariantManagement:{ignore:true},useChartPersonalisation:{ignore:true},header:{ignore:false},persistencyKey:{ignore:true},currentVariantId:{ignore:false},enableAutoBinding:{ignore:false},chartBindingPath:{ignore:false},showDrillButtons:{ignore:false},showZoomButtons:{ignore:false},showSemanticNavigationButton:{ignore:false},showVariantManagement:{ignore:false},showDownloadButton:{ignore:false},showDetailsButton:{ignore:false},showDrillBreadcrumbs:{ignore:false},showChartTooltip:{ignore:false},showLegendButton:{ignore:false},legendVisible:{ignore:false},selectionMode:{ignore:false},showFullScreenButton:{ignore:false},useTooltip:{ignore:false},useListForChartTypeSelection:{ignore:true},detailsItemActionFactory:{ignore:false},detailsListActionFactory:{ignore:true},noData:{ignore:false},showChartTypeSelectionButton:{ignore:false},showDimensionsTitle:{ignore:false},showToolbar:{ignore:false},toolbarStyle:{ignore:false},showMeasuresTitle:{ignore:false},activateTimeSeries:{ignore:true}}};});
