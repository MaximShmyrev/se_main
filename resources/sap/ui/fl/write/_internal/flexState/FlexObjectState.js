/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/restricted/_omit","sap/ui/fl/apply/_internal/flexState/FlexState","sap/ui/fl/apply/_internal/flexState/ManifestUtils","sap/ui/fl/apply/_internal/ChangesController","sap/ui/fl/ChangePersistenceFactory","sap/ui/fl/LayerUtils","sap/ui/fl/Utils"],function(_,F,M,C,a,L,U){"use strict";var b={};function i(p){p.reference=M.getFlexReferenceForControl(p.selector);return F.initialize({componentId:U.getAppComponentForControl(p.selector).getId(),reference:p.reference,componentData:{},manifest:{}});}function g(p){var m=F.getCompEntitiesByIdMap(p.reference);var e=Object.keys(m).map(function(k){return m[k];});return L.filterChangeOrChangeDefinitionsByCurrentLayer(e,p.currentLayer);}function c(p){if(!p.reference){var A=C.getAppComponentForSelector(p.selector);p.reference=M.getFlexReferenceForControl(A);}return a.getChangePersistenceForComponent(p.reference);}function d(p){var o=c(p);return o.getChangesForComponent(_(p,["invalidateCache","selector"]),p.invalidateCache);}b.getFlexObjects=function(p){return i(p).then(function(){var e=g(p);var f=d(p);return Promise.all([e,f]).then(function(E){return E[0].concat(E[1]);});});};return b;});
