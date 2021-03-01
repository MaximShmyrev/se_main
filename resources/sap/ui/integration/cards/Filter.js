/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/core/Core","sap/base/Log","sap/ui/core/Icon","sap/m/HBox","sap/m/Text","sap/m/Select","sap/ui/core/ListItem","sap/ui/model/json/JSONModel","sap/ui/integration/model/ObservableModel","sap/ui/integration/util/LoadingProvider"],function(C,a,L,I,H,T,S,b,J,O,c){"use strict";var F=C.extend("sap.ui.integration.cards.Filter",{metadata:{properties:{key:{type:"string",defaultValue:""},config:{type:"object",defaultValue:"null"},value:{type:"string",defaultValue:""}},aggregations:{_select:{type:"sap.m.Select",multiple:false,visibility:"hidden"},_loadingProvider:{type:"sap.ui.core.Element",multiple:false,visibility:"hidden"}},associations:{card:{type:"sap.ui.integration.widgets.Card",multiple:false}}},renderer:{apiVersion:2,render:function(r,f){var l=f.isLoading();r.openStart("div",f).class("sapFCardFilter");if(l){r.class("sapFCardFilterLoading");}r.openEnd();if(f._hasError()){r.renderControl(f._getErrorMessage());}else{r.renderControl(f._getSelect());}r.close("div");}}});F.prototype.init=function(){this.setAggregation("_loadingProvider",new c());this.attachEventOnce("_dataReady",function(){this.fireEvent("_ready");});};F.prototype.exit=function(){if(this._oDataProvider){this._oDataProvider.destroy();this._oDataProvider=null;}};F.prototype.isLoading=function(){var l=this.getAggregation("_loadingProvider");return!l.isDataProviderJson()&&l.getLoading();};F.prototype._getSelect=function(){var o=this.getAggregation("_select");if(!o){o=this._createSelect();this.setAggregation("_select",o);}return o;};F.prototype._hasError=function(){return!!this._bError;};F.prototype._getErrorMessage=function(){var m="Unable to load the filter.";return new H({justifyContent:"Center",alignItems:"Center",items:[new I({src:"sap-icon://message-error",size:"1rem"}).addStyleClass("sapUiTinyMargin"),new T({text:m})]});};F.prototype._handleError=function(l){L.error(l);this._bError=true;this.invalidate();};F.prototype._onDataRequestComplete=function(){this.fireEvent("_dataReady");this.hideLoadingPlaceholders();};F.prototype.showLoadingPlaceholders=function(){this.getAggregation("_loadingProvider").setLoading(true);};F.prototype.hideLoadingPlaceholders=function(){this.getAggregation("_loadingProvider").setLoading(false);};F.prototype._onDataChanged=function(){var s=this._getSelect();s.setSelectedKey(this.getValue());this._updateSelected(s.getSelectedItem());};F.prototype._setDataConfiguration=function(d){var m;if(!d){this.fireEvent("_dataReady");return;}if(this._oDataProvider){this._oDataProvider.destroy();}var o=a.byId(this.getCard());this._oDataProvider=o._oDataProviderFactory.create(d,null,true);this.getAggregation("_loadingProvider").setDataProvider(this._oDataProvider);if(d.name){m=this.getModel(d.name);}else if(this._oDataProvider){m=new O();this.setModel(m);}m.attachEvent("change",function(){this._onDataChanged();}.bind(this));this._oDataProvider.attachDataRequested(function(){this.showLoadingPlaceholders();}.bind(this));this._oDataProvider.attachDataChanged(function(e){m.setData(e.getParameter("data"));this._onDataRequestComplete();}.bind(this));this._oDataProvider.attachError(function(e){this._handleError(e.getParameter("message"));this._onDataRequestComplete();}.bind(this));this._oDataProvider.triggerDataUpdate();};F.prototype._updateSelected=function(s){var f=this.getModel("filters"),d=this.getKey();f.setProperty("/"+d,{"value":s.getKey(),"selectedItem":{"title":s.getText(),"key":s.getKey()}});};F.prototype._createSelect=function(){var s=new S(),i,d,e="/",o=this.getConfig();s.attachChange(function(E){var v=E.getParameter("selectedItem").getKey();this.setValue(v);this._updateSelected(E.getParameter("selectedItem"));}.bind(this));if(o&&o.item){e=o.item.path||e;}if(o&&o.item&&o.item.template){i=o.item.template.key;d=o.item.template.title;}if(o&&o.items){i="{key}";d="{title}";this.setModel(new J(o.items));}s.bindItems({path:e,template:new b({key:i,text:d})});s.setSelectedKey(this.getValue());return s;};return F;});