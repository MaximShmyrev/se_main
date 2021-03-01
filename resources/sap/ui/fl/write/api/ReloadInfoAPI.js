/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/LayerUtils","sap/ui/fl/Layer","sap/ui/fl/Utils","sap/ui/fl/write/api/VersionsAPI","sap/ui/fl/write/api/FeaturesAPI","sap/ui/fl/write/api/PersistenceWriteAPI","sap/base/util/UriParameters"],function(L,a,U,V,F,P){"use strict";function i(r){return F.isVersioningEnabled(r.layer).then(function(v){return v&&V.isDraftAvailable({selector:r.selector,layer:r.layer});});}function b(r){var u=r.layer===a.USER;if(u){return Promise.resolve(false);}return P.hasHigherLayerChanges({selector:r.selector,ignoreMaxLayerParameter:r.ignoreMaxLayerParameter,upToLayer:r.layer});}var R={getReloadReasonsForStart:function(r){var u=R.hasMaxLayerParameterWithValue({value:r.layer});var c=!!U.getParameter(sap.ui.fl.Versions.UrlParameter);return Promise.all([(!u)?b(r):false,(!c)?i(r):false]).then(function(d){r.hasHigherLayerChanges=d[0];r.isDraftAvailable=d[1];return r;});},hasVersionParameterWithValue:function(p){return U.hasParameterAndValue(sap.ui.fl.Versions.UrlParameter,p.value);},hasMaxLayerParameterWithValue:function(p){var s=L.FL_MAX_LAYER_PARAM;return U.hasParameterAndValue(s,p.value);},handleUrlParametersForStandalone:function(r){if(r.hasHigherLayerChanges){r.parameters=U.handleUrlParameters(r.parameters,L.FL_MAX_LAYER_PARAM,r.layer);}var v=new RegExp("\&*"+sap.ui.fl.Versions.UrlParameter+"=-?\\d*\&?","g");r.parameters=r.parameters.replace(v,"");if(r.isDraftAvailable&&!r.onExit){r.parameters=U.handleUrlParameters(r.parameters,sap.ui.fl.Versions.UrlParameter,sap.ui.fl.Versions.Draft);}if(r.versionSwitch){r.parameters=U.handleUrlParameters(r.parameters,sap.ui.fl.Versions.UrlParameter,r.version);}if(r.parameters==="?"){r.parameters="";}return r.parameters;},handleParametersOnStart:function(r){var p=U.getParsedURLHash();p.params=p.params||{};if(r.hasHigherLayerChanges){p.params[L.FL_MAX_LAYER_PARAM]=[r.layer];}if(r.isDraftAvailable){p.params[sap.ui.fl.Versions.UrlParameter]=[sap.ui.fl.Versions.Draft];}return p;},initialDraftGotActivated:function(r){if(r.versioningEnabled){var u=this.hasVersionParameterWithValue({value:sap.ui.fl.Versions.Draft.toString()});return!V.isDraftAvailable(r)&&u;}return false;},getReloadMethod:function(r){var o={NOT_NEEDED:"NO_RELOAD",RELOAD_PAGE:"HARD_RELOAD",VIA_HASH:"CROSS_APP_NAVIGATION"};r.reloadMethod=o.NOT_NEEDED;r.isDraftAvailable=r.isDraftAvailable||R.hasVersionParameterWithValue({value:sap.ui.fl.Versions.Draft.toString()});if(r.activeVersion>sap.ui.fl.Versions.Original){r.activeVersionNotSelected=r.activeVersion&&!R.hasVersionParameterWithValue({value:r.activeVersion.toString()});}r.hasHigherLayerChanges=R.hasMaxLayerParameterWithValue({value:r.layer});r.initialDraftGotActivated=R.initialDraftGotActivated(r);if(r.initialDraftGotActivated){r.isDraftAvailable=false;}if(r.changesNeedReload||r.isDraftAvailable||r.hasHigherLayerChanges||r.initialDraftGotActivated||r.activeVersionNotSelected){r.reloadMethod=o.RELOAD_PAGE;if(!r.changesNeedReload&&U.getUshellContainer()){r.reloadMethod=o.VIA_HASH;}}return r;}};return R;});
