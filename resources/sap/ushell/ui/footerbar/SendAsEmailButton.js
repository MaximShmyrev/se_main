// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/Log","sap/m/Button","sap/m/ButtonRenderer","sap/ushell/Config","sap/ushell/resources"],function(L,B,a,C,r){"use strict";var S=B.extend("sap.ushell.ui.footerbar.SendAsEmailButton",{metadata:{library:"sap.ushell",properties:{beforePressHandler:{type:"any",group:"Misc",defaultValue:null},afterPressHandler:{type:"any",group:"Misc",defaultValue:null}}},renderer:"sap.m.ButtonRenderer"});S.prototype.init=function(){if(B.prototype.init){B.prototype.init.apply(this,arguments);}this.setIcon("sap-icon://email");this.setText(r.i18n.getText("sendEmailBtn"));this.setTooltip(r.i18n.getText("sendEmailBtn_tooltip"));this.attachPress(function(){if(this.getBeforePressHandler()){this.getBeforePressHandler()();}this.sendAsEmailPressed(this.getAfterPressHandler());}.bind(this));};S.prototype.sendAsEmailPressed=function(c){if(sap.ushell.Container.runningInIframe&&sap.ushell.Container.runningInIframe()){sap.ui["require"](["sap/ushell/appRuntime/ui5/AppRuntimeService"],function(b){b.sendMessageToOuterShell("sap.ushell.services.ShellUIService.sendEmailWithFLPButton",{bSetAppStateToPublic:true});});}else{var u=document.URL;var A=C.last("/core/shellHeader/application").title;var s=(A===undefined)?r.i18n.getText("linkToApplication"):r.i18n.getText("linkTo")+"'"+A+"'";sap.ushell.Container.getServiceAsync("AppState").then(function(o){o.setAppStateToPublic(u).done(function(n){sap.m.URLHelper.triggerEmail(null,s,n);}).fail(L.error);});}if(c){c();}};return S;},true);