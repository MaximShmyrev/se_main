sap.ui.define(["sap/m/Dialog","sap/m/Button","sap/ui/model/json/JSONModel","sap/ui/core/mvc/ViewType","sap/ui/model/resource/ResourceModel","sap/ovp/app/resources","sap/base/util/merge"],function(D,B,J,V,R,O,m){"use strict";var a={dialogBox:undefined,oSaveButton:undefined,oResetButton:undefined,oOvpResourceBundle:sap.ui.getCore().getLibraryResourceBundle("sap.ovp"),getDialogBox:function(c){return new Promise(function(r,b){var o,A,d,e;if(!this.dialogBox){this.oSaveButton=new B({text:O&&O.getText("save"),type:"Emphasized"});var C=new B({text:O&&O.getText("cancelBtn")});this.oResetButton=new B({text:O&&O.getText("resetButton")});this.dialogBox=new D({title:O&&O.getText("settingsDialogTitle"),buttons:[this.oSaveButton,C,this.oResetButton],afterClose:function(h){this.dialogBox.destroyContent();}.bind(this)});this.dialogBox.addStyleClass("sapOvpSettingsDialogBox");this.dialogBox.setBusyIndicatorDelay(0);C.attachPress(function(h){this.dialogBox.close();}.bind(this));}if(c.getParent()){o=c.getParent().getModel("ui").getData();A=m({},o);var M=c.getModel(A.globalFilterModel),f=M.getMetaModel(),E=f.getODataEntityContainer().entitySet;A["allEntityTypes"]=[];for(var i=0;E&&i<E.length;i++){var s=E[i].entityType;A["allEntityTypes"].push({name:f.getODataEntityType(s).name});}if(A.globalFilterEntityType){A.showGlobalFilters=true;}else{A.showGlobalFilters=false;}if(!A.containerLayout){A.containerLayout="fixed";}e=new J(A);d=new sap.ui.core.mvc.XMLView("appSettingsView",{viewName:"sap.ovp.cards.rta.AppSettingsDialog",type:V.XML});d.setModel(e);var g=this.oOvpResourceBundle?O.oResourceModel:null;d.setModel(g,"ovpResourceModel");this.dialogBox.addContent(d);d.loaded().then(function(v){r(this.dialogBox);}.bind(this));}}.bind(this));}};return a;},true);