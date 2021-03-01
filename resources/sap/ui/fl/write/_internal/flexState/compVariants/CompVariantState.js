/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/UriParameters","sap/ui/fl/Layer","sap/ui/fl/Change","sap/ui/fl/apply/_internal/flexObjects/Variant","sap/ui/fl/Utils","sap/ui/fl/apply/_internal/flexState/FlexState","sap/ui/fl/registry/Settings","sap/ui/fl/write/_internal/Storage"],function(U,L,C,V,a,F,S,b){"use strict";function g(i){switch(i.fileType){case"change":case"variant":return"changes";case"comp_variant_change":return"compVariantChanges";default:}}function c(P,i){var q=P.changeToBeAddedOrDeleted.getDefinition();var s=g(q);i[s].push(q);var I=q.fileName;var t=F.getCompEntitiesByIdMap(P.reference);t[I]=q;}function d(P,i){var q=P.changeToBeAddedOrDeleted.getDefinition();var s=g(q);var t=-1;i[s].some(function(E,I){if(E.fileName===q.fileName){t=I;return true;}});if(t>-1){i[s].splice(t,1);}var v=F.getCompEntitiesByIdMap(P.reference);delete v[q.fileName];}function e(P,i,s){var q=F.getCompVariantsMap(P.reference)._getOrCreate(P.persistencyKey);if(!q[s]){var t={fileName:a.createDefaultFileName(s),fileType:"change",changeType:s,layer:L.USER,reference:P.reference,selector:{persistencyKey:P.persistencyKey},support:{generator:P.generator||"CompVariantState."+s,sapui5Version:sap.ui.version}};if(P.compositeCommand){t.support.generator.compositeCommand=P.compositeCommand;}var v=new C(C.createInitialFileContent(t));q[s]=v;F.getCompEntitiesByIdMap(P.reference)[v.getId()]=v;}q[s].setContent(i);return q[s];}function r(O,q){for(var i=0;i<O.length;i++){if((O[i].fileName||O[i].getFileName())===q.fileName){O.splice(i,1);break;}}}function f(M,i){if(i.isVariant()){return M.variants;}switch(i.getChangeType()){case"defaultVariant":return M.defaultVariants;case"standardVariant":return M.standardVariants;default:return M.changes;}}function w(i,s){return b.write({flexObjects:[i.getDefinition()],layer:i.getLayer(),transport:i.getRequest(),isLegacyVariant:i.isVariant()}).then(function(q){if(q&&q.response&&q.response[0]){i.setResponse(q.response[0]);}else{i.setState(C.states.PERSISTED);}return s;}).then(function(s){f(s.changes.comp,i).push(i.getDefinition());return i.getDefinition();});}function u(O,q){for(var i=0;i<O.length;i++){if(O[i].fileName===q.fileName){O.splice(i,1,q);break;}}}function h(i,s){return b.update({flexObject:i.getDefinition(),layer:i.getLayer(),transport:i.getRequest()}).then(function(q){if(q&&q.response){i.setResponse(q.response);}else{i.setState(C.states.PERSISTED);}return s;}).then(function(s){var O=f(s.changes.comp,i);u(O,i.getDefinition());return i.getDefinition();});}function j(i,q,s,t){return b.remove({flexObject:i.getDefinition(),layer:i.getLayer(),transport:i.getRequest()}).then(function(){delete q[i.getId()];if(i.getChangeType()==="standardVariant"){s.standardVariant=undefined;}else if(i.getChangeType()==="defaultVariant"){s.defaultVariant=undefined;}else{r(f(s,i),i.getDefinition());}return t;}).then(function(t){r(f(t.changes.comp,i),i.getDefinition());return i.getDefinition();});}function n(i){return i&&(i.getPendingAction()==="NEW"||i.getPendingAction()==="UPDATE"||i.getPendingAction()==="DELETE");}function k(i){return i.variants.concat(i.changes).concat(i.defaultVariant).concat(i.standardVariant);}function l(i){var I={};if(typeof(i.texts)==="object"){Object.keys(i.texts).forEach(function(q){I[q]={value:i.texts[q],type:"XFLD"};});}return I;}function m(i){if(i.layer){return i.layer;}if(i.isUserDependent){return L.USER;}var s=U.fromQuery(window.location.search).get("sap-ui-layer")||"";s=s.toUpperCase();if(s){return s;}if(!i.isVariant){return L.CUSTOMER;}var P=S.getInstanceOrUndef().isPublicLayerAvailable();return P?L.PUBLIC:L.CUSTOMER;}function o(P){var i=F.getCompEntitiesByIdMap(P.reference);return i[P.id];}var p={};p.setDefault=function(P){var i={defaultVariantName:P.defaultVariantId};return e(P,i,"defaultVariant");};p.setExecuteOnSelect=function(P){var i={executeOnSelect:P.executeOnSelect};return e(P,i,"standardVariant");};p.add=function(P){if(!P){return undefined;}var i=P.changeSpecificData;var I={changeType:i.type,service:i.ODataService,content:i.content,reference:P.reference,fileType:i.isVariant?"variant":"change",packageName:i.packageName,layer:m(i),favorite:!!i.favorite,executeOnSelect:!!i.executeOnSelect,selector:{persistencyKey:P.persistencyKey},texts:l(i)};var q=C.createInitialFileContent(I);var s=i.isVariant?V:C;var t=new s(q);var v=F.getCompVariantsMap(P.reference);var M=v._getOrCreate(P.persistencyKey);f(M,t).push(t);var x=t.getId();var y=F.getCompEntitiesByIdMap(P.reference);y[x]=t;return t;};p.updateVariant=function(P){var v=o(P);if(!v){throw new Error("Variant to be modified is not persisted via sap.ui.fl.");}if(P.name){v.setText("variantName",P.name);}var i=v.getContent();var E=i.executeOnSelect;var q=i.favorite;var s=P.content||i;if(P.favorite!==undefined){s.favorite=P.favorite;}else if(q!==undefined){s.favorite=q;}if(P.executeOnSelect!==undefined){s.executeOnSelect=P.executeOnSelect;}else if(E!==undefined){s.executeOnSelect=E;}v.setContent(s);v.setFavorite(!!s.favorite);v.setExecuteOnSelect(!!s.executeOnSelect);};p.removeVariant=function(P){var v=o(P);v.markForDeletion();};p.updateState=function(P){var i=F.getFlexObjectsFromStorageResponse(P.reference);if(P.changeToBeAddedOrDeleted){switch(P.changeToBeAddedOrDeleted.getPendingAction()){case"NEW":c(P,i);break;case"DELETE":d(P,i);break;default:break;}}};p.persist=function(P){var R=P.reference;var s=P.persistencyKey;var i=F.getCompVariantsMap(R);var q=i._getOrCreate(s);var t=F.getCompEntitiesByIdMap(R);var v=F.getStorageResponse(R);var x=k(q).filter(n).map(function(y){switch(y.getPendingAction()){case"NEW":return w(y,v);case"UPDATE":return h(y,v);case"DELETE":return j(y,t,q,v);default:break;}});return Promise.all(x);};return p;});