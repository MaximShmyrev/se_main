/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(['sap/apf/ui/utils/helper','sap/apf/utils/trace','sap/m/MessageToast'],function(U,t,M){'use strict';function _(m){var a=m.getMessage();while(m.getPrevious()){m=m.getPrevious();a=a+'\n'+m.getMessage();}return a;}sap.ui.controller("sap.apf.ui.reuse.controller.stepGallery",{getGalleryElementsData:function(){var s=this;var g=[];var c=this.oCoreApi.getCategories();var l=this.oCoreApi.getTextNotHtmlEncoded("label");var a=this.oCoreApi.getTextNotHtmlEncoded("steps");var b=this.oCoreApi.getTextNotHtmlEncoded("category");var m;if(c.length===0){m=this.oCoreApi.createMessageObject({code:"6001",aParameters:["Categories"]});this.oCoreApi.putMessage(m);}var i;for(i=0;i<c.length;i++){var G={};var C=c[i];var d;if(!C.label){m=this.oCoreApi.createMessageObject({code:"6002",aParameters:[l,b+": "+d]});this.oCoreApi.putMessage(m);}else{d=this.oCoreApi.getTextNotHtmlEncoded(C.label);G.title=this.oCoreApi.getTextNotHtmlEncoded(C.label);}G.id=C.id;G.stepTemplates=[];C.stepTemplates.forEach(function(o){var e={};if(!o.title){m=s.oCoreApi.createMessageObject({code:"6003",aParameters:["Title"]});s.oCoreApi.putMessage(m);}else{e.title=s.oCoreApi.getTextNotHtmlEncoded(o.title);}e.id=o.id;e.representationtypes=o.getRepresentationInfo();e.representationtypes.forEach(function(r){r.title=s.oCoreApi.getTextNotHtmlEncoded(r.label);if(r.parameter&&r.parameter.orderby){new U(s.oCoreApi).getRepresentationSortInfo(r).done(function(f){var h=[];for(var i=0;i<f.length;i++){f[i].done(function(k){h.push(k);});}r.sortDescription=h;});}});e.defaultRepresentationType=e.representationtypes[0];G.stepTemplates.push(e);});g.push(G);}var S=this.oCoreApi.getStepTemplates();if(S.length===0){m=this.oCoreApi.createMessageObject({code:"6002",aParameters:[a,b]});this.oCoreApi.putMessage(m);}var j={GalleryElements:g};return j;},onInit:function(){if(sap.ui.Device.system.desktop){this.getView().addStyleClass("sapUiSizeCompact");}this.oCoreApi=this.getView().getViewData().oCoreApi;this.oUiApi=this.getView().getViewData().uiApi;var g=this.getGalleryElementsData().GalleryElements;var m=new sap.ui.model.json.JSONModel({"GalleryElements":g});this.getView().setModel(m);},getStepDetails:function(c,s){var g=this.getGalleryElementsData().GalleryElements;var a=g[c].stepTemplates[s];return a;},openHierarchicalSelectDialog:function(){if(this.oHierchicalSelectDialog){this.oHierchicalSelectDialog.destroy();}this.oHierchicalSelectDialog=new sap.ui.jsfragment("sap.apf.ui.reuse.fragment.stepGallery",this);this.oHierchicalSelectDialog.setModel(this.getView().getModel());if(sap.ui.Device.system.desktop){this.oHierchicalSelectDialog.addStyleClass("sapUiSizeCompact");}this.oHierchicalSelectDialog.open();},onStepPress:function(i,r,T){t.logCall("stepGallery.onStepPress -- adds an active step, id=",i," ************************************** ");var c=this;var s=this;var p=c.oCoreApi.getSteps().length;var a=c.oUiApi.getAnalysisPath().getController();this.oCoreApi.checkAddStep(i).done(function(C,m){t.log("onStepPress->continuation",", bCanStepBeAdded",C," oRepresentationType=",r);if(C){c.oHierchicalSelectDialog.close();c.oCoreApi.createStep(i,a.callBackForUpdatePathAndSetLastStepAsActive.bind(a),r);a.refresh(-1);}else{var e=_(m);var f={oController:c,sMessageText:e};var g=new sap.ui.jsfragment("sap.apf.ui.reuse.fragment.addStepCheckDialog",f);g.open();c.oUiApi.getLayoutView().setBusy(false);}var h=c.oCoreApi.getSteps().length;if(p<h){M.show(s.oCoreApi.getTextNotHtmlEncoded("msgToast",["'"+T+"'"]));}});var b=this.oCoreApi.getSteps();var d=(b.length>0)?b[b.length-1].getSelectedRepresentation():{};t.logReturn("onStepPress",", step id=",i,", repr.apfId="+(d?d.apfId:"--"),", selectedRepr=",(d)?d:"error: no step existing");}});});