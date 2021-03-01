/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/merge","sap/ui/fl/write/connectors/BaseConnector","sap/ui/fl/initial/_internal/connectors/LrepConnector","sap/ui/fl/initial/_internal/connectors/Utils","sap/ui/fl/write/_internal/connectors/Utils","sap/ui/fl/write/_internal/transport/TransportSelection","sap/ui/fl/registry/Settings","sap/ui/fl/Layer","sap/ui/fl/LayerUtils","sap/ui/fl/Utils","sap/ui/fl/Change","sap/ui/core/Component","sap/ui/core/BusyIndicator","sap/base/Log","sap/m/MessageBox","sap/base/util/restricted/_pick"],function(m,B,I,a,W,T,S,L,b,U,C,c,d,e,M,_){"use strict";var R={FLEX_INFO:"/flex/info/",PUBLISH:"/actions/make_changes_transportable/",CHANGES:"/changes/",CONDENSE:"/actions/condense/",VARIANTS:"/variants/",SETTINGS:"/flex/settings",TOKEN:"/actions/getcsrftoken/",APPVARIANTS:"/appdescr_variants/",APPVARIANTS_OVERVIEW:"/app_variant_overview/",UI2PERSONALIZATION:"/ui2personalization/",CONTEXTS:"/flex/contexts/"};var f=function(p){var r;if(p.isLegacyVariant){r=R.VARIANTS;}else if(p.isAppVariant){r=R.APPVARIANTS;}else if(p.isCondensingEnabled){r=R.CONDENSE;}else{r=R.CHANGES;}var P=p.transport?{changelist:p.transport}:{};if(p.skipIam){P.skipIam=p.skipIam;}a.addLanguageInfo(P);I._addClientInfo(P);if(p.flexObject&&!p.isAppVariant){p.fileName=p.flexObject.fileName;}var w=a.getUrl(r,p,P);delete p.reference;delete p.fileName;var t=a.getUrl(R.TOKEN,p);var o=W.getRequestOptions(I,t,p.flexObjects||p.flexObject,"application/json; charset=utf-8","json");return W.sendRequest(w,p.method,o);};var g=function(A){var p=A.getDefinition().layer===L.VENDOR?A.getPackage():"";return new C({fileName:A.getDefinition().fileName,fileType:A.getDefinition().fileType,packageName:p,namespace:A.getNamespace()});};var h=function(p){var t;if(p.transport){t=Promise.resolve({transport:p.transport});}else if(p.isForSmartBusiness){return Promise.resolve();}else{var o=g(p.appVariant);t=new T().openTransportSelection(o);}return t.then(function(i){if(i==="cancel"){return Promise.reject("cancel");}if(i&&i.transport!==undefined){return i.transport;}return Promise.reject(new Error("Transport information could not be determined"));});};return m({},B,{initialConnector:I,layers:I.layers,reset:function(p){d.show(0);var i=[];var t=Promise.resolve();if(p.layer!==L.USER){i=p.changes;t=S.getInstance().then(function(s){if(!s.isProductiveSystem()){return new T().setTransports(i,c.get(p.reference)).then(function(){i.some(function(o){if(o.getRequest()){p.changelist=o.getRequest();return true;}return false;});});}});}return t.then(function(){d.show(0);var P=["reference","layer","changelist","generator"];var j=_(p,P);I._addClientInfo(j);if(p.selectorIds){j.selector=p.selectorIds;}if(p.changeTypes){j.changeType=p.changeTypes;}delete p.reference;var r=a.getUrl(R.CHANGES,p,j);var s=a.getUrl(R.TOKEN,p);var o=W.getRequestOptions(I,s);return W.sendRequest(r,"DELETE",o).then(function(k){if(k&&k.response){k.response.forEach(function(l){l.fileName=l.name;delete l.name;});}d.hide();return k;}).catch(function(E){d.hide();return Promise.reject(E);});});},publish:function(p){var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.fl");var H=function(E){d.hide();var s=r.getText("MSG_TRANSPORT_ERROR",E?[E.message||E]:undefined);var i=r.getText("HEADER_TRANSPORT_ERROR");e.error("transport error"+E);M.show(s,{icon:M.Icon.ERROR,title:i,styleClass:p.transportDialogSettings.styleClass});return"Error";};var t=new T();return t.openTransportSelection(null,p.transportDialogSettings.rootControl,p.transportDialogSettings.styleClass).then(function(o){if(t.checkTransportInfo(o)){d.show(0);var i={reference:p.reference,layer:p.layer};return t._prepareChangesForTransport(o,p.localChanges,p.appVariantDescriptors,i).then(function(){d.hide();if(o.transport==="ATO_NOTIFICATION"){return r.getText("MSG_ATO_NOTIFICATION");}return r.getText("MSG_TRANSPORT_SUCCESS");});}return"Cancel";})['catch'](H);},getFlexInfo:function(p){var P=["layer"];var i=_(p,P);I._addClientInfo(i);var D=a.getUrl(R.FLEX_INFO,p,i);return a.sendRequest(D).then(function(r){return r.response;});},getContexts:function(p){var P=["type","$skip","$filter"];var i=_(p,P);I._addClientInfo(i);var s=a.getUrl(R.CONTEXTS,p,i);return a.sendRequest(s).then(function(r){return r.response;});},loadFeatures:function(p){if(I.settings){I.settings.isVersioningEnabled=false;return Promise.resolve(I.settings);}var P={};I._addClientInfo(P);var F=a.getUrl(R.SETTINGS,p,P);return a.sendRequest(F).then(function(r){r.response.isVersioningEnabled=false;return r.response;});},write:function(p){p.method="POST";return f(p);},condense:function(p){p.method="POST";p.isCondensingEnabled=true;return f(p);},update:function(p){if(p.flexObject.fileType==="variant"){p.isLegacyVariant=true;}p.method="PUT";return f(p);},remove:function(p){var P={namespace:p.flexObject.namespace,layer:p.flexObject.layer};if(p.transport){P.changelist=p.transport;}I._addClientInfo(P);p.fileName=p.flexObject.fileName;var r=p.flexObject.fileType==="variant"?R.VARIANTS:R.CHANGES;var D=a.getUrl(r,p,P);D=decodeURIComponent(D);delete p.fileName;var t=a.getUrl(R.TOKEN,p);var o=W.getRequestOptions(I,t,undefined,"application/json; charset=utf-8","json");return W.sendRequest(D,"DELETE",o);},appVariant:{getManifest:function(p){var A=p.appVarUrl;var r=W.getRequestOptions(I,undefined,undefined,"application/json; charset=utf-8","json");return W.sendRequest(A,"GET",r);},load:function(p){var A=a.getUrl(R.APPVARIANTS,p);var r=W.getRequestOptions(I,undefined,undefined,"application/json; charset=utf-8","json");return W.sendRequest(A,"GET",r);},create:function(p){p.method="POST";p.isAppVariant=true;return f(p);},assignCatalogs:function(p){var P={};P.action=p.action;delete p.action;P.assignFromAppId=p.assignFromAppId;delete p.assignFromAppId;var s=a.getUrl(R.APPVARIANTS,p,P);delete p.reference;var t=a.getUrl(R.TOKEN,p);var r=W.getRequestOptions(I,t,undefined,"application/json; charset=utf-8","json");return W.sendRequest(s,"POST",r);},unassignCatalogs:function(p){var P={};P.action=p.action;delete p.action;var s=a.getUrl(R.APPVARIANTS,p,P);delete p.reference;var t=a.getUrl(R.TOKEN,p);var r=W.getRequestOptions(I,t,undefined,"application/json; charset=utf-8","json");return W.sendRequest(s,"POST",r);},update:function(p){return h(p).then(function(t){if(t){p.transport=t;}delete p.isForSmartBusiness;p.method="PUT";p.isAppVariant=true;return f(p);});},remove:function(p){return h(p).then(function(t){var P={};if(t){P.changelist=t;}delete p.isForSmartBusiness;var D=a.getUrl(R.APPVARIANTS,p,P);delete p.reference;var s=a.getUrl(R.TOKEN,p);var r=W.getRequestOptions(I,s,undefined,"application/json; charset=utf-8","json");return W.sendRequest(D,"DELETE",r);});},list:function(p){var P={};P.layer=p.layer;P["sap.app/id"]=p.reference;delete p.layer;delete p.reference;var A=a.getUrl(R.APPVARIANTS_OVERVIEW,p,P);var r=W.getRequestOptions(I,undefined,undefined,"application/json; charset=utf-8","json");return W.sendRequest(A,"GET",r);}},ui2Personalization:{create:function(p){p.initialConnector=this.initialConnector;var P=U.getLrepUrl();var r=W.getRequestOptions(I,P+R.TOKEN,p.flexObjects||p.flexObject,"application/json; charset=utf-8","json");var u=P+R.UI2PERSONALIZATION;return W.sendRequest(u,"PUT",r);},remove:function(p){p.initialConnector=this.initialConnector;var u=a.getUrl(R.UI2PERSONALIZATION,{url:U.getLrepUrl()},{reference:p.reference,containerkey:p.containerKey,itemname:p.itemName});return W.sendRequest(u,"DELETE");}}});},true);
