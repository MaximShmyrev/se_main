/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/mdc/condition/FilterOperatorUtil","sap/ui/mdc/condition/Operator","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/json/JSONModel"],function(F,O,a,b,J){"use strict";var f=sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");var E={ALL:{id:"ALL",display:f.getText("C_DRAFT_EDIT_STATE_DRAFT_ALL_FILTER")},UNCHANGED:{id:"UNCHANGED",display:f.getText("C_DRAFT_EDIT_STATE_DRAFT_UNCHANGED_FILTER")},OWN_DRAFT:{id:"OWN_DRAFT",display:f.getText("C_DRAFT_EDIT_STATE_DRAFT_OWN_DRAFT_FILTER")},LOCKED:{id:"LOCKED",display:f.getText("C_DRAFT_EDIT_STATE_DRAFT_LOCKED_FILTER")},UNSAVED_CHANGES:{id:"UNSAVED_CHANGES",display:f.getText("C_DRAFT_EDIT_STATE_DRAFT_UNSAVED_CHANGES_FILTER")}};function g(e){switch(e){case E.UNCHANGED.id:return new a({filters:[new a({path:"IsActiveEntity",operator:b.EQ,value1:true}),new a({path:"HasDraftEntity",operator:b.EQ,value1:false})],and:true});case E.OWN_DRAFT.id:return new a({path:"IsActiveEntity",operator:b.EQ,value1:false});case E.LOCKED.id:return new a({filters:[new a({path:"IsActiveEntity",operator:b.EQ,value1:true}),new a({path:"SiblingEntity/IsActiveEntity",operator:b.EQ,value1:null}),new a({path:"DraftAdministrativeData/InProcessByUser",operator:b.NE,value1:""})],and:true});case E.UNSAVED_CHANGES.id:return new a({filters:[new a({path:"IsActiveEntity",operator:b.EQ,value1:true}),new a({path:"SiblingEntity/IsActiveEntity",operator:b.EQ,value1:null}),new a({path:"DraftAdministrativeData/InProcessByUser",operator:b.EQ,value1:""})],and:true});default:return new a({filters:[new a({path:"IsActiveEntity",operator:b.EQ,value1:false}),new a({path:"SiblingEntity/IsActiveEntity",operator:b.EQ,value1:null})],and:false});}}F.addOperator(new O({name:"DRAFT_EDIT_STATE",valueTypes:["self"],tokenParse:"^(.*)$",format:function(v){return v&&v.values;},getModelFilter:function(c,s){return g(c.values[0]);}}));E.getEditStatesContext=function(){return new J([E.ALL,E.UNCHANGED,E.OWN_DRAFT,E.LOCKED,E.UNSAVED_CHANGES]).bindContext("/").getBoundContext();};E.getFilterForEditState=g;return E;},true);