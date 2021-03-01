/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/each","sap/base/util/isPlainObject","sap/base/util/isEmptyObject","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/core/Core","sap/ui/fl/apply/_internal/changes/Utils","sap/ui/fl/write/_internal/condenser/classifications/LastOneWins","sap/ui/fl/write/_internal/condenser/classifications/Reverse","sap/ui/fl/write/_internal/condenser/UIReconstruction","sap/ui/fl/write/_internal/condenser/Utils","sap/ui/fl/Change","sap/ui/fl/Utils","sap/ui/performance/Measurement"],function(e,i,c,J,C,d,L,R,U,f,g,F,M){"use strict";var h={};var j="unclassified";var N={lastOneWins:L,reverse:R};function k(S,a){return a.classification===sap.ui.fl.condenser.Classification.Create&&S[sap.ui.fl.condenser.Classification.Move];}function l(S,a){return a.classification===sap.ui.fl.condenser.Classification.Move&&S[sap.ui.fl.condenser.Classification.Destroy];}function m(a,b){return b.classification===sap.ui.fl.condenser.Classification.Create&&a[sap.ui.fl.condenser.Classification.Destroy];}function n(a,b,D,E){if(!l(a,D)&&!m(a,D)){var G=D.classification;if(!a[G]){D.change=E;E.condenserState="select";a[G]=[D];}else{E.condenserState="delete";}a[G][0].updateChange=E;}if(k(a,D)||m(a,D)){if(a[sap.ui.fl.condenser.Classification.Move]){a[sap.ui.fl.condenser.Classification.Move].forEach(function(D){D.change.condenserState="delete";});delete a[sap.ui.fl.condenser.Classification.Move];}if(a[sap.ui.fl.condenser.Classification.Destroy]){a[sap.ui.fl.condenser.Classification.Destroy].forEach(function(D){D.change.condenserState="delete";});delete a[sap.ui.fl.condenser.Classification.Destroy];}}U.addChange(b,D);}function o(T,a,I,b,D){if(!T[b.type]){T[b.type]={};}var E=T[b.type];if(b.type===f.NOT_INDEX_RELEVANT){if(!E[b.classification]){E[b.classification]={};}var P=E[b.classification];N[b.classification].addToChangesMap(P,b.uniqueKey,D);}else{I.push(D);n(E,a,b,D);}}function p(T,K,a){if(!T[K]){T[K]=[];}T[K].push(a);a.condenserState="select";}function q(a,b){var D=J.getControlIdBySelector(b.getSelector(),a);var E=C.byId(D);if(E){var P={modifier:J,appComponent:a,view:F.getViewForControl(E)};var G=d.getControlIfTemplateAffected(b,E,P);return Promise.resolve(d.getChangeHandler(b,G,P)).then(function(H){if(H&&typeof H.getCondenserInfo==="function"){return H.getCondenserInfo(b,P);}});}return Promise.resolve();}function r(a,b,D,E){var G=b!==undefined?b.affectedControl:J.getControlIdBySelector(D.getSelector(),E);if(!a[G]){a[G]={};}return a[G];}function s(a,b,D,I,E){return E.reduce(function(P,G){return P.then(t.bind(this,a,b,D,I,G));}.bind(this),Promise.resolve());}function t(a,b,D,I,E){return q(a,E).then(function(G){v(G,a);var T=r(b,G,E,a);if(G!==undefined){u(G);o(T,D,I,G,E);}else{p(T,j,E);b[j]=true;}});}function u(a){if(N[a.classification]){a.type=f.NOT_INDEX_RELEVANT;}else{a.type=f.INDEX_RELEVANT;}}function v(a,b){["affectedControl","sourceContainer","targetContainer"].forEach(function(P){if(a&&a[P]){a[P]=J.getControlIdBySelector(a[P],b);}});}function w(O,a){e(O,function(K,S){if(N[K]&&N[K].getChangesFromMap){N[K].getChangesFromMap(O,K).forEach(function(b){a.push(b);});}else if(i(S)){return w(S,a);}else if(Array.isArray(S)){S.forEach(function(b){if(b instanceof g){a.push(b);}else{a.push(b.change);}});}});return a;}function x(a){return w(a,[]);}function y(a,b){e(a,function(K,S){if(i(S)){y(S,b);}else if(Array.isArray(S)){S.forEach(function(O){if(!(O instanceof g)){b.push(O);}});}});return b;}function z(D,E){E.sort(function(a,b){return D.indexOf(a)-D.indexOf(b);});}function A(a,I){var b=a.map(function(D){return D.getId();});I.forEach(function(D){if(b.indexOf(D.getId())===-1){a.push(D);}});}function B(a,b){a.forEach(function(D){var E=D.updateChange;if(E&&E.getState()!==g.states.NEW){var G=D.change;if(E.getFileName()!==G.getFileName()){var H=G.getContent();E.setContent(H);G.condenserState="delete";b=b.map(function(I){if(I.getFileName()===G.getFileName()){return E;}return I;});}else{E.setState(g.states.DIRTY);}E.condenserState="update";}});return b;}h.condense=function(a,b){M.start("Condenser_overall","Condenser overall - CondenserClass",["sap.ui.fl","Condenser"]);var D={};var E={};var G=[];var H=[];var I=[];b.slice(0).reverse().forEach(function(K){if(K instanceof g&&K.isApplyProcessFinished()){I.push(K);}else{H.push(K);}});M.start("Condenser_defineMaps","defining of maps - CondenserClass",["sap.ui.fl","Condenser"]);return s(a,D,E,G,I).then(function(){M.end("Condenser_defineMaps");var K=D[j];if(!K){U.compareAndUpdate(D,E);}var O=x(D);if(K){G.forEach(function(S){S.condenserState="select";});A(O,G);}O=O.concat(H);z(b,O);if(!K){M.start("Condenser_handleIndexRelatedChanges","handle index related changes - CondenserClass",["sap.ui.fl","Condenser"]);var P=y(D,[]);M.start("Condenser_sort","sort index related changes - CondenserClass",["sap.ui.fl","Condenser"]);var Q=U.sortIndexRelatedChanges(E,P);M.end("Condenser_sort");U.swapChanges(Q,O);O=B(P,O);M.end("Condenser_handleIndexRelatedChanges");}M.end("Condenser_overall");return O;});};return h;});
