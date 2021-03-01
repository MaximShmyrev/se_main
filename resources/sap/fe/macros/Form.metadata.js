/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["./MacroMetadata"],function(M){"use strict";var F=M.extend("sap.fe.macros.Form",{name:"Form",namespace:"sap.fe.macros",fragment:"sap.fe.macros.Form",metadata:{stereotype:"xmlmacro",designtime:"sap/fe/macros/Form.designtime",properties:{entitySet:{type:"sap.ui.model.Context",required:true,$kind:["NavigationProperty","EntitySet"]},facet:{type:"sap.ui.model.Context",$Type:["com.sap.vocabularies.UI.v1.CollectionFacet","com.sap.vocabularies.UI.v1.ReferenceFacet"]},facetSource:{type:"string"},id:{type:"string"},formTitle:{type:"string"},displayMode:{type:"boolean"},useFormContainerLabels:{type:"string"},partOfPreview:{type:"boolean",defaultValue:true},valueHelpRequestGroupId:{type:"string"}},events:{onChange:{type:"function"}}}});return F;});
