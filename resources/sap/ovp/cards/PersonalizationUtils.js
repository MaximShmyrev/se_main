sap.ui.define(['sap/ovp/cards/CommonUtils','sap/ui/fl/write/api/ControlPersonalizationWriteAPI','sap/ovp/cards/ovpLogger'],function(C,a,o){"use strict";var L=new o("OVP.cards.PersonanlizationUtils");function b(h,i){i.every(function(j){if(j.id===h.cardId){j.selectedKey=h.selectedKey;return false;}return true;});return i;}function c(h,i){i.every(function(j){if(j.id===h.cardId){j.visibility=h.visibility;return false;}return true;});return i;}function d(h,i,v){var M=C.getApp(),j=M._getCardId(h.id);i.every(function(k){if(k.id===j){k.visibility=v;return false;}return true;});return i;}function e(h,i){var I=[];var v,t;v=i.filter(function(j){return j.visibility;});i.forEach(function(j,k){if(!j.visibility){I.push({card:j,index:k});}});if(!v[h.oldPosition]||!v[h.position]){return i;}t=v[h.oldPosition];v[h.oldPosition]=v[h.position];v[h.position]=t;I.forEach(function(j){v.splice(j.index,0,j.card);});i=v;return i;}function f(h,i){i.every(function(j){if(j.id===h.cardId){Object.keys(h.dashboardLayout).forEach(function(k){if(!j.dashboardLayout[k]){j.dashboardLayout[k]={};}if(h.dashboardLayout[k].rowSpan){j.dashboardLayout[k].rowSpan=h.dashboardLayout[k].rowSpan;}if(h.dashboardLayout[k].colSpan){j.dashboardLayout[k].colSpan=h.dashboardLayout[k].colSpan;}if(h.dashboardLayout[k].maxColSpan){j.dashboardLayout[k].maxColSpan=h.dashboardLayout[k].maxColSpan;}if(h.dashboardLayout[k].noOfItems){j.dashboardLayout[k].noOfItems=h.dashboardLayout[k].noOfItems;}if(h.dashboardLayout[k].hasOwnProperty('autoSpan')){j.dashboardLayout[k].autoSpan=h.dashboardLayout[k].autoSpan;}if(h.dashboardLayout[k].row){j.dashboardLayout[k].row=h.dashboardLayout[k].row;}if(h.dashboardLayout[k].column){j.dashboardLayout[k].col=h.dashboardLayout[k].column;}if(h.dashboardLayout[k].hasOwnProperty('showOnlyHeader')){j.dashboardLayout[k].showOnlyHeader=h.dashboardLayout[k].showOnlyHeader;}});return false;}return true;});return i;}function m(h,D){if(!Array.isArray(D)||!h){return h;}var M=[];h.forEach(function(k){var n={};Object.keys(k).forEach(function(K){n[K]=k[K];});M.push(n);});var l={VENDOR:[],CUSTOMER_BASE:[],CUSTOMER:[],USER:[]};var i=D.reduce(function(l,k){l[k.getLayer()].push(k);return l;},l);var j=[].concat(i["VENDOR"],i["CUSTOMER_BASE"],i["CUSTOMER"],i["USER"]);j.forEach(function(k){switch(k.getChangeType()){case"viewSwitch":M=b(k.getContent(),M);break;case"visibility":M=c(k.getContent(),M);break;case"hideCardContainer":M=d(k.getContent(),M,false);break;case"unhideCardContainer":M=d(k.getContent(),M,true);break;case"position":M=e(k.getContent(),M);break;case"dragOrResize":M=f(k.getContent(),M);break;default:break;}});return M;}function g(M,D){var h=M.filter(function(i){var H=false;D.forEach(function(j){if(i.id===j.id){H=true;return;}});return!H;});return D.concat(h);}function s(h,v){var l=v?v.byId("ovpLayout"):null;var i=[],j=[],k=[];if(!Array.isArray(h)){h=[h];}h.forEach(function(O){var n=O.content.cardId;O.jsOnly=true;i.push({selectorElement:v.byId(n),changeSpecificData:O});j.push(v.byId(n));k.push(O.changeType);});a.reset({selectors:j,changeTypes:k}).finally(function(){a.add({changes:i},true).then(function(i){return a.save({changes:i,selector:l});}).then(function(){L.info("Personalization changes have been saved in lrep backend");}).catch(function(n){L.error("Personalization changes were not saved",n);});},function(){L.error("Personalization changes were not being added by 'addPersonalizationChanges' function");});}var p={mergeChanges:m,addMissingCardsFromManifest:g,savePersonalization:s};return p;},true);
