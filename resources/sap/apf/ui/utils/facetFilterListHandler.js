/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.ui.utils.facetFilterListHandler');jQuery.sap.require('sap.m.FacetFilterList');jQuery.sap.require('sap.m.FacetFilterItem');jQuery.sap.require('sap.apf.ui.utils.facetFilterListConverter');jQuery.sap.require('sap.apf.ui.utils.facetFilterValueFormatter');
sap.apf.ui.utils.FacetFilterListHandler=function(c,u,C){"use strict";var a=[];var f;var F=new sap.apf.ui.utils.FacetFilterListConverter();function _(d){if(d===null||d.length===0){var m=c.createMessageObject({code:"6010",aParameters:[c.getTextNotHtmlEncoded(C.getLabel())]});c.putMessage(m);f.setActive(false);}}function b(d,s,p,e){var g=new sap.apf.ui.utils.FacetFilterValueFormatter(u,c);var h=g.getFormattedFFData(d,s,p);var m=F.getFFListDataFromFilterValues(h,s,a);var o=f.getModel();o.setSizeLimit(m.length);o.setData(m);var i=o.getData();if(e){i.forEach(function(j){if(j.selected==false){if(!sap.ui.Device.browser.msie){if(Object.values(f.getSelectedKeys()).indexOf(j.text)>-1){f.removeSelectedKey(j.key);}}else{if(Object.keys(f.getSelectedKeys()).indexOf(j.text)>-1){f.removeSelectedKey(j.key);}}}});}o.updateBindings();}this.createFacetFilterList=function(){var t=this;f=new sap.m.FacetFilterList({title:c.getTextNotHtmlEncoded(C.getLabel()),multiSelect:C.isMultiSelection(),key:C.getPropertyName(),growing:false,growingScrollToLoad:true,listClose:this.onListClose.bind(this),listOpen:this.onListOpen.bind(this)});f.bindItems("/",new sap.m.FacetFilterItem({key:'{key}',text:'{text}',selected:'{selected}'}));var m=new sap.ui.model.json.JSONModel([]);m.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);f.setModel(m);if(!C.hasValueHelpRequest()){this.getFacetFilterListData().done(_);}this.getSelectedFFValues().then(function(g){d(g);});return f;function d(g){g.oFilterRestrictionPropagationPromiseForSelectedValues.done(function(n,N){d({aSelectedFilterValues:n,oFilterRestrictionPropagationPromiseForSelectedValues:N});});if(g.aSelectedFilterValues.length>0||(a.length>0)){a=g.aSelectedFilterValues;t.getFacetFilterListData().done(function(e,s,p){b(e,s,p,true);});}}};this.getFacetFilterListData=function(){var s;var o=jQuery.Deferred();var d=C.getValues();d.then(function(e){s=C.getAliasNameIfExistsElsePropertyName()||C.getPropertyName();C.getMetadata().then(function(p){o.resolve(e,s,p);});});return o.promise();};this.getSelectedFFValues=function(){var o=jQuery.Deferred();var d=C.getSelectedValues();d.then(function(s,n){o.resolve({aSelectedFilterValues:s,oFilterRestrictionPropagationPromiseForSelectedValues:n});});return o.promise();};this.setSelectedFFValues=function(d){C.setSelectedValues(d);};this.onListClose=function(){var s=[],S,d,e,g;S=f.getSelectedItems();s=S.map(function(i){return i.getKey();});d=JSON.stringify(s.sort());e=JSON.stringify(a.sort());g=(d!==e);if(g){a=s;this.setSelectedFFValues(s);u.selectionChanged(true);}};this.onListOpen=function(){f.setBusy(true);this.getFacetFilterListData().done(function(d,s,p){b(d,s,p,false);f.setBusy(false);});};};
