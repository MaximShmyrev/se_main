/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/m/Label","sap/m/Dialog","sap/ui/model/json/JSONModel","sap/m/SearchField","sap/m/Button","sap/m/Toolbar","sap/m/ToolbarSpacer","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/List","sap/m/CustomListItem","sap/m/ScrollContainer","sap/ui/model/Sorter","sap/base/Log","sap/m/VBox","sap/ui/rta/Utils","sap/m/library","sap/ui/layout/VerticalLayout","sap/m/Text"],function(M,L,D,J,S,B,T,a,F,b,c,d,e,f,g,V,U,m,h,i){"use strict";var j=m.ButtonType;var k=m.ListType;var l=m.LabelDesign;var A=M.extend("sap.ui.rta.plugin.additionalElements.AddElementsDialog",{metadata:{library:"sap.ui.rta",properties:{customFieldEnabled:{type:"boolean",defaultValue:false},businessContextVisible:{type:"boolean",defaultValue:false},title:{type:"string"}},events:{opened:{},openCustomField:{}}}});A.prototype.init=function(){this._oTextResources=sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");this._bAscendingSortOrder=false;this._oDialog=new D().addStyleClass("sapUIRtaFieldRepositoryDialog");this._oDialog.addStyleClass(U.getRtaStyleClassName());this._oDialog.removeStyleClass("sapUiPopupWithPadding");this._oDialog.setModel(new J({elements:[]}));var C=this._createContent();var n=this._createButtons();C.forEach(function(o){this._oDialog.addContent(o);},this);n.forEach(function(o){this._oDialog.addButton(o);},this);this._oDialog.setInitialFocus(this._oInput);};A.prototype.exit=function(){this._oDialog.destroy();};A.prototype._createContent=function(){this._oInput=new S({width:"100%",liveChange:[this._updateModelFilter,this]});var r=new B({text:"",icon:"sap-icon://sort",press:[this._resortList,this]});this._oCustomFieldButton=new B({text:"",icon:"sap-icon://add",tooltip:this._oTextResources.getText("BTN_FREP_CCF"),enabled:this.getCustomFieldEnabled(),press:[this._redirectToCustomFieldCreation,this]});this._oToolbarSpacer1=new a();this.oInputFields=new T({content:[this._oInput,r,this._oToolbarSpacer1,this._oCustomFieldButton]});this._oBCContainer=new h({visible:this.getBusinessContextVisible(),content:[new i({text:this._oTextResources.getText("BUSINESS_CONTEXT_TITLE")})]}).addStyleClass("sapUIRtaBusinessContextContainer");var o=new L({design:l.Standard,text:{parts:[{path:"label"},{path:"parentPropertyName"},{path:"duplicateName"}],formatter:function(t,P,u){if(u&&P){t+=" ("+P+")";}return t;}}});var n=new L({text:{parts:[{path:"originalLabel"}],formatter:function(O){if(O){return this._oTextResources.getText("LBL_FREP",O);}return"";}.bind(this)},visible:{parts:[{path:"originalLabel"}],formatter:function(O){if(O){return true;}return false;}}});var v=new V();v.addItem(o);v.addItem(n);var s=new f("label",this._bAscendingSortOrder);this._oList=new c({mode:"MultiSelect",includeItemInSelection:true,growing:true,growingScrollToLoad:true}).setNoDataText(this._oTextResources.getText("MSG_NO_FIELDS",this._oTextResources.getText("MULTIPLE_CONTROL_NAME").toLowerCase()));var p=new d({type:k.Active,selected:"{selected}",tooltip:"{tooltip}",content:[v]}).addStyleClass("sapUIRtaListItem");this._oList.bindItems({path:"/elements",template:p,sorter:s,templateShareable:false,key:function(C){switch(C.getProperty("type")){case"invisible":return C.getProperty("elementId");case"odata":return C.getProperty("name");case"delegate":return C.getProperty("name");case"custom":return C.getProperty("key");default:g.error("sap.ui.rta.plugin.additionalElements.AddElementsDialog#_createContent: unsupported data type");}}});var q=new e({content:this._oList,vertical:true,horizontal:false}).addStyleClass("sapUIRtaCCDialogScrollContainer");return[this.oInputFields,this._oBCContainer,q];};A.prototype._createButtons=function(){this._oOKButton=new B({text:this._oTextResources.getText("BTN_FREP_OK"),press:[this._submitDialog,this],type:j.Emphasized});var C=new B({text:this._oTextResources.getText("BTN_FREP_CANCEL"),press:[this._cancelDialog,this]});return[this._oOKButton,C];};A.prototype._submitDialog=function(){this._oDialog.close();this._fnResolve();};A.prototype._cancelDialog=function(){this._oList.removeSelections();this._oDialog.close();this._fnReject();};A.prototype.setElements=function(E){this._oDialog.getModel().setProperty("/elements",E);};A.prototype.getElements=function(){return this._oDialog.getModel().getProperty("/elements");};A.prototype.getSelectedElements=function(){return this._oDialog.getModel().getObject("/elements").filter(function(E){return E.selected;});};A.prototype.open=function(){return new Promise(function(r,n){this._fnResolve=r;this._fnReject=n;this._oDialog.attachAfterOpen(function(){this.fireOpened();}.bind(this));this._oDialog.open();}.bind(this));};A.prototype._resortList=function(){this._bAscendingSortOrder=!this._bAscendingSortOrder;var o=this._oList.getBinding("items");var s=[];s.push(new f("label",this._bAscendingSortOrder));o.sort(s);};A.prototype._updateModelFilter=function(E){var v=E.getParameter("newValue");var o=this._oList.getBinding("items");if((typeof v)==="string"){var n=new F("label",b.Contains,v);var O=new F("originalLabel",b.Contains,v);var p=new F("parentPropertyName",b.Contains,v);var q=new F("duplicateName",b.EQ,true);var P=new F({filters:[p,q],and:true});var r=new F({filters:[n,O,P],and:false});o.filter([r]);}else{o.filter([]);}};A.prototype._redirectToCustomFieldCreation=function(){this.fireOpenCustomField();this._oDialog.close();};A.prototype.setTitle=function(t){M.prototype.setProperty.call(this,"title",t,true);this._oDialog.setTitle(t);};A.prototype.setCustomFieldEnabled=function(C){this.setProperty("customFieldEnabled",C,true);this._oCustomFieldButton.setEnabled(this.getProperty("customFieldEnabled"));};A.prototype._setBusinessContextVisible=function(n){this.setProperty("businessContextVisible",n,true);this._oBCContainer.setVisible(this.getProperty("businessContextVisible"));};A.prototype.getList=function(){return this._oList;};A.prototype.addBusinessContext=function(n){this._removeBusinessContexts();var o=new i({text:this._oTextResources.getText("MSG_NO_BUSINESS_CONTEXTS")});if(n&&n.length>0){n.forEach(function(C){o=new i({text:C.BusinessContextDescription});this._oBCContainer.addContent(o);},this);}else{this._oBCContainer.addContent(o);}this._setBusinessContextVisible(true);};A.prototype._removeBusinessContexts=function(){var n;var o=this._oBCContainer.getContent().length;for(n=0;n<o;n++){this._oBCContainer.removeContent(1);}};return A;});