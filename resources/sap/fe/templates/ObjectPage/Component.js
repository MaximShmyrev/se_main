/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/TemplateComponent","sap/ui/model/odata/v4/ODataListBinding","sap/fe/core/CommonUtils","sap/base/Log","sap/fe/core/library","sap/fe/templates/ObjectPage/SectionLayout"],function(T,O,C,L,a,S){"use strict";var V=a.VariantManagement,b=T.extend("sap.fe.templates.ObjectPage.Component",{metadata:{properties:{variantManagement:{type:"sap.fe.core.VariantManagement",defaultValue:V.None},sectionLayout:{type:"sap.fe.templates.ObjectPage.SectionLayout",defaultValue:S.Page},showRelatedApps:{type:"boolean",defaultValue:false},additionalSemanticObjects:{type:"object"},editableHeaderContent:{type:"boolean",defaultValue:true},showBreadCrumbs:{type:"boolean",defaultValue:true},prepareOnEdit:{type:"boolean",defaultValue:false}},library:"sap.fe.templates",manifest:"json"},isContextExpected:function(){return true;},createDeferredContext:function(p){if(!this.DeferredContextCreated){this.DeferredContextCreated=true;var l,t=this,P={"$$groupId":"$auto.Heroes","$$updateGroupId":"$auto"};l=new O(this.getModel(),p.replace("(...)",""),undefined,undefined,undefined,P);t.getRootControl().getController().editFlow.createDocument(l,{creationMode:"Sync"}).finally(function(){t.DeferredContextCreated=false;}).catch(function(){window.history.back();});}},setVariantManagement:function(v){if(v===V.Page){L.error("ObjectPage does not support Page-level variant management yet");v=V.None;}this.setProperty("variantManagement",v);}});return b;},true);
