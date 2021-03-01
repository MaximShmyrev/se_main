/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library"],function(l){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.support",dependencies:["sap.ui.core"],types:["sap.ui.support.Severity"],interfaces:[],controls:[],elements:[],noLibraryCSS:true,version:"1.86.3",extensions:{"sap.ui.support":{internalRules:true}}});sap.ui.support.Severity={Medium:"Medium",High:"High",Low:"Low"};sap.ui.support.Audiences={Control:"Control",Internal:"Internal",Application:"Application"};sap.ui.support.Categories={Accessibility:"Accessibility",Performance:"Performance",Memory:"Memory",Bindings:"Bindings",Consistency:"Consistency",FioriGuidelines:"FioriGuidelines",Functionality:"Functionality",Usability:"Usability",DataModel:"DataModel",Modularization:"Modularization",Usage:"Usage",Other:"Other"};sap.ui.support.HistoryFormats={Abap:"Abap",String:"String"};sap.ui.support.SystemPresets={Accessibility:{id:"Accessibility",title:"Accessibility",description:"Accessibility related rules",selections:[{ruleId:"dialogAriaLabelledBy",libName:"sap.m"},{ruleId:"onlyIconButtonNeedsTooltip",libName:"sap.m"},{ruleId:"inputNeedsLabel",libName:"sap.m"},{ruleId:"titleLevelProperty",libName:"sap.m"},{ruleId:"formTitleOrAriaLabel",libName:"sap.ui.layout"},{ruleId:"formTitleInToolbarAria",libName:"sap.ui.layout"},{ruleId:"formMissingLabel",libName:"sap.ui.layout"},{ruleId:"gridTableAccessibleLabel",libName:"sap.ui.table"},{ruleId:"gridTableColumnTemplateIcon",libName:"sap.ui.table"},{ruleId:"smartFormLabelOrAriaLabel",libName:"sap.ui.comp"},{ruleId:"icontabbarlabels",libName:"sap.m"},{ruleId:"labeltooltip",libName:"sap.m"},{ruleId:"labelfor",libName:"sap.m"},{ruleId:"labelInDisplayMode",libName:"sap.m"},{ruleId:"texttooltip",libName:"sap.m"},{ruleId:"rbText",libName:"sap.m"}]}};return sap.ui.support;});
