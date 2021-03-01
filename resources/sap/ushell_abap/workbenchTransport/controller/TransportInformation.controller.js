// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/library","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/json/JSONModel","sap/ushell/Config","sap/ui/model/odata/v2/ODataModel","sap/ui/events/PseudoEvents"],function(C,c,F,a,J,b,O,P){"use strict";var V=c.ValueState;return C.extend("sap.ushell_abap.workbenchTransport.controller.TransportInformation",{onInit:function(){(function(){var p=this.getView().byId("packageInput"),_=function(e){if(p._isSuggestionsPopoverOpen()||e.type===P.events.sapescape.sName){this._handlePackageSuggestion();this.validate();}}.bind(this);p._oSuggestionPopup.attachAfterOpen(function(){if(p.getValue()!==p.getModel().getProperty("/package")){this._handlePackageSuggestion();this.validate();}}.bind(this));p.addEventDelegate({onsapup:_,onsapdown:_,onsaphome:_,onsapend:_,onsappageup:_,onsappagedown:_,onsapescape:_});}.bind(this))();},onAfterRendering:function(){var o=this.getOwnerComponent().getComponentData(),p=o?o.package:"",m=this.getView().getModel();if(p){this._filterTransport(p);m.setProperty("/package",p);m.setProperty("/workbenchRequired",true);m.setProperty("/packageInputReadOnly",true);}},_checkModelValidity:function(w,p,i){return(p.length>0)&&(!i||w.length>0);},_handlePackageSuggestion:function(d){var p=this.getView().byId("packageInput"),s=p.getValue(),o=p.getModel(),e=p.getBinding("suggestionItems").getModel().getProperty("/packageSet('"+encodeURIComponent(s.toUpperCase())+"')/");if(e){if(d){o.setProperty("/package",e.devclass);}o.setProperty("/workbenchRequired",e.transportRequired);this._filterTransport(e.devclass);}else{o.setProperty("/workbenchRequired",!!s.length);}},onPackageLiveChange:function(e){var n=e.getParameters().value,p=this.getView().byId("packageInput"),o=p.getModel();o.setProperty("/workbenchRequest","");p.getBinding("suggestionItems").filter(new F("devclass",a.StartsWith,n.toUpperCase()));p.setValueState(n.length?V.None:V.Error);this._handlePackageSuggestion();this.validate();},onChange:function(e){var p=this.getView().byId("packageInput");if(e.getSource()===p){this._handlePackageSuggestion(true);}this.validate();},_filterTransport:function(s){var f=[new F("devclass",a.EQ,s)],w=this.getView().byId("workbenchRequestSelect");w.getBinding("items").filter(f);},validate:function(){var p=this.getView().byId("packageInput"),o=p.getModel(),w=this.getView().byId("workbenchRequestSelect").getSelectedKey(),i=this._checkModelValidity(w,p.getValue(),o.getProperty("/workbenchRequired"));this.getOwnerComponent().fireChange({valid:i});}});});
