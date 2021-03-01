sap.ui.define(["sap/ui/core/mvc/OverrideExecution","sap/suite/ui/generic/template/lib/TemplateAssembler","sap/suite/ui/generic/template/ListReport/controller/ControllerImplementation","sap/suite/ui/generic/template/ListReport/controllerFrameworkExtensions","sap/suite/ui/generic/template/genericUtilities/testableHelper","sap/suite/ui/generic/template/listTemplates/semanticDateRangeTypeHelper","sap/suite/ui/generic/template/js/staticChecksHelper","sap/suite/ui/generic/template/js/preparationHelper","sap/base/util/deepExtend","sap/suite/ui/generic/template/genericUtilities/FeError","sap/suite/ui/generic/template/js/StableIdHelper","sap/ui/model/Context"],function(O,T,C,c,t,s,a,p,d,F,S,b){"use strict";var e="ListReport.Component";function g(o,f){var v={};return{oControllerSpecification:{getMethods:C.getMethods.bind(null,v),oControllerDefinition:c,oControllerExtensionDefinition:{onInitSmartFilterBar:function(E){},provideExtensionAppStateData:function(h){},restoreExtensionAppStateData:function(G){},ensureFieldsForSelect:function(E,h){},addFilters:function(A,h){}}},init:function(){var h=o.getModel("_templPriv");h.setProperty("/listReport",{});},onActivate:function(){v.onComponentActivate();},getTableForChildContext:function(){return v.getSmartTable();},refreshBinding:function(u,r){v.refreshBinding(u,r);},getItems:function(){return v.getItems();},displayNextObject:function(h){return v.displayNextObject(h);},getTemplateSpecificParameters:function(m,h,D,l,i,M){function j(x,z){var q=m.getODataEntitySet(x);var r=m.getODataEntityType(q.entityType);var A,B,G;B=z.annotationPath;G=!!B&&r[B];if(G&&G.PresentationVariant){if(G.PresentationVariant.Visualizations){A=G.PresentationVariant.Visualizations[0].AnnotationPath;}else if(G.PresentationVariant.Path){var P=G.PresentationVariant.Path.split("@")[1];var H=P&&r[P];A=H.Visualizations[0].AnnotationPath;}}else if(G&&G.Visualizations){A=G.Visualizations[0].AnnotationPath;}return!!(A&&A.indexOf("com.sap.vocabularies.UI.v1.Chart")>-1);}function k(){var B="/"+l;var z=new b(M,B);var A=i.getODataDraftFunctionImportName(z,"NewAction");return!!A;}var L=d({},h);L.bNewAction=h.useNewActionForCreate&&k();var E=f.getControllerExtensions();var n=E&&E.Actions;var q=m.getODataEntitySet(l);var r=m.getODataEntityType(q.entityType);var u=p.getLineItemFromVariant(m,q.entityType);if(L.quickVariantSelectionX){var w=p.getNormalizedTableSettings(m,L,D,l,n,u);var V=L.quickVariantSelectionX.variants||{};for(var K in V){var x=V[K].entitySet||l;var q=m.getODataEntitySet(x);if(!q){delete V[K];continue;}V[K].isSmartChart=j(x,V[K]);if(!V[K].isSmartChart){var y=p.getLineItemFromVariant(m,m.getODataEntitySet(x).entityType,V[K].annotationPath&&V[K].annotationPath.split("#")[1]);V[K].tableSettings=V[K].tableSettings||w;V[K].tableSettings=p.getNormalizedTableSettings(m,V[K],D,x,n,y);if(L.isResponsiveTable===undefined){L.isResponsiveTable=V[K].tableSettings.type==="ResponsiveTable";}else if(L.isResponsiveTable!==(V[K].tableSettings.type==="ResponsiveTable")){throw new F(e,"Variant with key "+K+" resulted in invalid Table Type combination. Please check documentation and update manifest.json.");}}}delete L.tableSettings;if(L.isResponsiveTable===undefined){L.isResponsiveTable=true;}}else{L.tableSettings=p.getNormalizedTableSettings(m,h,D,l,n,u);L.isResponsiveTable=L.tableSettings.type==="ResponsiveTable";if(L.tableSettings.enableMultiEditDialog&&L.isResponsiveTable&&!f.isDraftEnabled()&&!L.isWorklist&&!o.getAppComponent().getFlexibleColumnLayout()){L.multiEdit=true;if(q["Org.OData.Capabilities.V1.UpdateRestrictions"]&&q["Org.OData.Capabilities.V1.UpdateRestrictions"].Updatable&&q["Org.OData.Capabilities.V1.UpdateRestrictions"].Updatable.Bool==="false"){L.multiEdit=false;}else if(L.tableSettings.mode==="None"){L.tableSettings.mode=(L.tableSettings.multiSelect?"MultiSelect":"SingleSelectLeft");}}}L.allControlConfiguration=r["com.sap.vocabularies.UI.v1.SelectionFields"]?r["com.sap.vocabularies.UI.v1.SelectionFields"].slice():[];L.datePropertiesSettings=s.getSemanticDateRangeSettingsForDateProperties(L,r);if(r&&r.property&&h&&L&&L.tableSettings&&L.tableSettings.createWithParameterDialog){a.checkErrorforCreateWithDialog(r,L.tableSettings,h);L.tableSettings.createWithParameterDialog.id=S.getStableId({type:'ListReportAction',subType:'CreateWithDialog'});}L.isSelflinkRequired=true;L.isIndicatorRequired=true;L.isSemanticallyConnected=false;return L;},executeAfterInvokeActionFromExtensionAPI:function(h,i){if(h.oSmartTable){i.setEnabledToolbarButtons(h.oSmartTable);i.setEnabledFooterButtons(h.oSmartTable);}},getCurrentState:function(){return v.getCurrentState.apply(null,arguments);},applyState:function(){v.applyState.apply(null,arguments);},getStatePreserverSettings:function(){return{callAlways:false};}};}t.testableStatic(g,"Component_getMethods");return T.getTemplateComponent(g,"sap.suite.ui.generic.template.ListReport",{metadata:{library:"sap.suite.ui.generic.template",properties:{"templateName":{"type":"string","defaultValue":"sap.suite.ui.generic.template.ListReport.view.ListReport"},"hideChevronForUnauthorizedExtNav":{"type":"boolean","defaultValue":"false"},treeTable:{type:"boolean",defaultValue:false},gridTable:{type:"boolean",defaultValue:false},tableType:{type:"string",defaultValue:undefined},multiSelect:{type:"boolean",defaultValue:false},tableSettings:{type:"object",properties:{type:{type:"string",defaultValue:undefined},multiSelect:{type:"boolean",defaultValue:false},inlineDelete:{type:"boolean",defaultValue:false},selectAll:{type:"boolean",defaultValue:false},selectionLimit:{type:"int",defaultValue:200},enableMultiEditDialog:{type:"boolean",defaultValue:false}}},"createWithFilters":"object","condensedTableLayout":"boolean",smartVariantManagement:{type:"boolean",defaultValue:false},hideTableVariantManagement:{type:"boolean",defaultValue:false},variantManagementHidden:{type:"boolean",defaultValue:false},createWithParameterDialog:{type:"object",properties:{fields:{type:"object"}}},"creationEntitySet":"string","enableTableFilterInPageVariant":{"type":"boolean","defaultValue":false},"useNewActionForCreate":{"type":"boolean","defaultValue":false},"multiContextActions":"object","isWorklist":"boolean","designtimePath":{"type":"string","defaultValue":"sap/suite/ui/generic/template/designtime/ListReport.designtime"},"flexibilityPath":{"type":"string","defaultValue":"sap/suite/ui/generic/template/ListReport/flexibility/ListReport.flexibility"},filterSettings:{type:"object",dateSettings:s.getDateSettingsMetadata()},dataLoadSettings:{type:"object",properties:{loadDataOnAppLaunch:{type:"string",defaultValue:"ifAnyFilterExist"}}},quickVariantSelectionX:{type:"object",properties:{showCounts:{type:"boolean",defaultValue:false},variants:{type:"object",mapEntryProperties:{key:{type:"string",optional:true},annotationPath:{type:"string"},entitySet:{type:"string",optional:true},tableSettings:{type:"object",properties:{type:{type:"string",defaultValue:undefined},multiSelect:{type:"boolean",defaultValue:false},inlineDelete:{type:"boolean",defaultValue:false},selectAll:{type:"boolean",defaultValue:false},selectionLimit:{type:"int",defaultValue:200}}}}}}},quickVariantSelection:{type:"object",properties:{showCounts:{type:"boolean",defaultValue:false},variants:{type:"object",mapEntryProperties:{key:{type:"string",optional:true},annotationPath:{type:"string"}}}}},annotationPath:{type:"string",defaultValue:undefined}},"manifest":"json"}});});