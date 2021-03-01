sap.ui.define(["sap/ui/base/Object","sap/ui/generic/app/navigation/service/SelectionVariant","sap/ui/Device","sap/ui/comp/state/UIState","sap/suite/ui/generic/template/listTemplates/listUtils","sap/ui/core/mvc/ControllerExtension","sap/suite/ui/generic/template/genericUtilities/FeLogger","sap/base/util/deepEqual","sap/base/util/extend","sap/base/util/deepExtend","sap/suite/ui/generic/template/genericUtilities/FeError"],function(B,S,D,U,l,C,F,d,e,a,b){"use strict";var c="AnalyticalListPage.controller.IappStateHandler";var L=new F(c).getLogger();function g(s,o,t){var n=t.oServices.oApplication.getNavigationHandler();var f="sap.suite.ui.generic.template.customData";var h="sap.suite.ui.generic.template.genericData";var j="sap.suite.ui.generic.template.extensionData";var k="visual";var m="compact";var p;var I=false,q=false,_=null,r;var u=null;var A=null;var R={appStateKey:"",urlParams:{}};var v={};var w="sap-iapp-state";function x(){return p.then(function(){if(R.appStateKey){return{"sap-iapp-state":[R.appStateKey]};}return R.urlParams;});}function y(i){if(i&&i.editStateFilter!==undefined){var k1=o.byId("editStateFilter");if(k1){k1.setSelectedKey((i.editStateFilter===null)?0:i.editStateFilter);}}var l1=s.oController.getOwnerComponent().getModel("_templPriv");if(i.chartVariantId&&s.oSmartChart){s.oSmartChart.setCurrentVariantId(i.chartVariantId);}if(i.filterMode){l1.setProperty('/alp/filterMode',i.filterMode);s.filterBarController.handleFilterSwitch(i.filterMode);}else{H();}if(i.contentView){var m1=l1.getProperty('/alp/enableHybridMode');if(m1===false&&i.contentView==='charttable'){l1.setProperty('/alp/contentView','chart');}else{((D.system.phone||D.system.tablet&&!D.system.desktop)&&i.contentView==="charttable")?l1.setProperty('/alp/contentView',"chart"):l1.setProperty('/alp/contentView',i.contentView);}}if(i.autoHide){l1.setProperty('/alp/autoHide',i.autoHide);}}function z(i){if(!i){return;}var k1=true;var l1=function(m1){if(!(m1 instanceof C)){throw new b(c,"State must always be retrieved with respect to a ControllerExtension");}var n1=m1.getMetadata().getNamespace();if(!k1){throw new b(c,"State must always be restored synchronously");}return i[n1];};o.templateBaseExtension.restoreExtensionAppStateData(l1);k1=false;}function E(i){i=i||{};if(i.hasOwnProperty(f)&&i.hasOwnProperty(h)){y(i[h]);V(i[f]);z(i[j]);}else{if(i._editStateFilter!==undefined){y({editStateFilter:i._editStateFilter});delete i._editStateFilter;}H();V(i);}if(i[h]){if(i[h].variantDirty===undefined){i[h].variantDirty=true;}o.byId('template::PageVariant')&&o.byId('template::PageVariant').currentVariantSetModified(i[h].variantDirty);}}function G(i){if(s.oSmartFilterbar.isPending()){var k1=function(l1){var m1=l1.getParameters();if(!m1.pendingValue){s.oSmartFilterbar.detachPendingChange(k1);E(i);}};s.oSmartFilterbar.attachPendingChange(k1);}else{E(i);}}function H(){var i=s.oController.getOwnerComponent().getModel("_templPriv"),k1=s.oSmartFilterbar.isCurrentVariantStandard()?s.oController.getOwnerComponent().getDefaultFilterMode():i.getProperty('/alp/filterMode');if(!(k1===k||k1===m)){L.error("Defaulting to Visual filter due to incorrect value of defaultFilterMode in App descriptor");k1=k;}if(k1===k&&s.hideVisualFilter){L.error("Visual filter is hidden defaulting to compact");k1=m;}s.filterBarController.setDefaultFilter(k1);}function J(i){var k1=s.oController.getOwnerComponent().getProperty('smartVariantManagement');if(k1){var l1=i['sap-ui-fe-variant-id'];if(l1&&l1[0]){s.oSmartFilterbar.getSmartVariant().setCurrentVariantId(l1[0]);}}else{var m1=i['sap-ui-fe-variant-id'],n1=i['sap-ui-fe-filterbar-variant-id'],o1=i['sap-ui-fe-chart-variant-id'],p1=i['sap-ui-fe-table-variant-id'];K(n1&&n1[0],o1&&o1[0],p1&&p1[0],m1&&m1[0]);}}function K(i,k1,l1,m1){if(i||m1){s.oSmartFilterbar.getSmartVariant().setCurrentVariantId(i||m1);}if(s.oSmartChart&&(k1||m1)){s.oSmartChart.attachAfterVariantInitialise(function(n1){s.oSmartChart.setCurrentVariantId(k1||m1);});s.oSmartChart.setCurrentVariantId(k1||m1);}if(s.oSmartTable&&(l1||m1)){s.oSmartTable.attachAfterVariantInitialise(function(n1){s.oSmartTable.setCurrentVariantId(l1||m1);});s.oSmartTable.setCurrentVariantId(l1||m1);}}function M(i,k1,l1){var m1=i.appStateKey||"";if(I){return;}A=m1;I=true;s.sNavType=l1;var n1=(!m1&&k1)||{};s.oSmartFilterbar.resumeSetFilterData();J(n1);if(l1!==sap.ui.generic.app.navigation.service.NavType.iAppState&&i.presentationVariant!==undefined){t.oCommonUtils.setControlSortOrder(s,i.presentationVariant);}if(l1!==sap.ui.generic.app.navigation.service.NavType.initial){var o1=i&&i.bNavSelVarHasDefaultsOnly;var p1=new S(i.selectionVariant);var q1=i.semanticDates;v=JSON.parse(i.selectionVariant);if((p1.getSelectOptionsPropertyNames().indexOf("DisplayCurrency")===-1)&&(p1.getSelectOptionsPropertyNames().indexOf("P_DisplayCurrency")===-1)&&(p1.getParameterNames().indexOf("P_DisplayCurrency")===-1)){O(p1,i);}if((!o1||s.oSmartFilterbar.isCurrentVariantStandard())){var r1={selectionVariant:p1,semanticDates:q1};if(l1!==sap.ui.generic.app.navigation.service.NavType.iAppState){s.oController.modifyStartupExtension(r1);}if(o1){var s1=l.getMergedVariants([new S(JSON.stringify(s.oSmartFilterbar.getUiState().getSelectionVariant())),r1.selectionVariant]);r1.selectionVariant=s1;}Y(r1.selectionVariant);X(r1);}else{var t1=new S(JSON.stringify(s.oSmartFilterbar.getUiState().getSelectionVariant())),u1=t1.getSelectOption("sap.suite.ui.generic.template.customData"),v1=t1.getSelectOption("sap.suite.ui.generic.template.genericData");x1=s.oSmartFilterbar.getUiState().getSemanticDates();N(t1,u1,v1,true);var r1={selectionVariant:t1,semanticDates:x1};s.oController.modifyStartupExtension(r1);N(r1.selectionVariant,u1,v1,false);if(!d(r1.selectionVariant,new S(JSON.stringify(s.oSmartFilterbar.getUiState().getSelectionVariant())))){Y(r1.selectionVariant);X(r1);}}if(i.tableVariantId&&s.oSmartTable){s.oSmartTable.setCurrentVariantId(i.tableVariantId);}var w1=s.oController.getOwnerComponent().getModel("_templPriv");if(l1===sap.ui.generic.app.navigation.service.NavType.xAppState&&w1.getProperty('/alp/filterMode')===k){W();}if(i.customData){G(i.customData);}else{H();}if(!o1){s.oSmartFilterbar.checkSearchAllowed(s);if(s.oController.getView().getModel("_templPriv").getProperty("/alp/searchable")){q=true;s.oSmartFilterbar.search();}}R={appStateKey:m1,urlParams:n1};}else{var p1=new S(JSON.stringify(s.oSmartFilterbar.getUiState().getSelectionVariant())),u1=p1.getSelectOption("sap.suite.ui.generic.template.customData"),v1=p1.getSelectOption("sap.suite.ui.generic.template.genericData"),x1=s.oSmartFilterbar.getUiState().getSemanticDates();N(p1,u1,v1,true);var r1={selectionVariant:p1,semanticDates:x1};s.oController.modifyStartupExtension(r1);N(r1.selectionVariant,u1,v1,false);if(!d(r1.selectionVariant,new S(JSON.stringify(s.oSmartFilterbar.getUiState().getSelectionVariant())))){Y(r1.selectionVariant);X(r1);}if(s.oSmartFilterbar.isLiveMode()||s.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled()){s.oSmartFilterbar.checkSearchAllowed(s);if(s.oController.getView().getModel("_templPriv").getProperty("/alp/searchable")){q=true;}}H();}b1();u=null;if(!s.oSmartFilterbar.isLiveMode()){j1();}if(!q){f1();}else{I=false;}if(s.oSmartFilterbar.isCurrentVariantStandard()&&i.bNavSelVarHasDefaultsOnly!==false&&o.byId('template::PageVariant')){o.byId('template::PageVariant').currentVariantSetModified(false);}}function N(i,k1,l1,m1){if(m1){if(k1){i.removeSelectOption("sap.suite.ui.generic.template.customData");}if(l1){i.removeSelectOption("sap.suite.ui.generic.template.genericData");}}else{if(k1){i.massAddSelectOption("sap.suite.ui.generic.template.customData",k1);}if(l1){i.massAddSelectOption("sap.suite.ui.generic.template.genericData",l1);}}}function O(i,k1){var l1=s.oSmartFilterbar.determineMandatoryFilterItems(),m1;for(var n1=0;n1<l1.length;n1++){if(l1[n1].getName().indexOf("P_DisplayCurrency")!==-1){if(k1.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")&&k1.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low){m1=k1.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low;}if(m1){i.addParameter("P_DisplayCurrency",m1);}if(s.alr_visualFilterBar&&m1){s.alr_visualFilterBar.setDisplayCurrency(m1);}break;}}}function P(){var i={};i[f]={};var k1=s.oController.getOwnerComponent().getModel("_templPriv");var l1=s.chartController&&e({},s.chartController._chartInfo);if(l1&&l1.chartSelection){delete l1.chartSelection;}i[h]={chartVariantId:s.oSmartChart&&s.oSmartChart.getCurrentVariantId(),filterMode:k1.getProperty('/alp/filterMode'),contentView:k1.getProperty('/alp/contentView'),autoHide:k1.getProperty('/alp/autoHide'),chartInfo:l1,variantDirty:o.byId('template::PageVariant')&&o.byId('template::PageVariant').currentVariantGetModified()};var m1=o.byId("editStateFilter");if(m1){i[h].editStateFilter=m1.getSelectedKey();}o.getCustomAppStateDataExtension(i[f]);var n1;var o1=true;var p1=function(q1,r1){if(!(q1 instanceof C)){throw new b(c,"State must always be set with respect to a ControllerExtension");}if(!o1){throw new b(c,"State must always be provided synchronously");}if(r1){n1=n1||Object.create(null);var s1=q1.getMetadata().getNamespace();n1[s1]=r1;}};o.templateBaseExtension.provideExtensionAppStateData(p1);o1=false;if(n1){i[j]=n1;}return i;}function Q(){return v;}function T(){var k1=s.oSmartFilterbar.getUiState(),l1=k1.getSelectionVariant(),m1=k1.getSemanticDates(),n1=o.getVisibleSelectionsWithDefaults();for(var i=0;i<n1.length;i++){if(!l1.getValue(n1[i])){l1.addSelectOption(n1[i],"I","EQ","");}}if(s.oController.byId('template::PageVariant').currentVariantGetModified()&&l1.SelectionVariantID){l1.SelectionVariantID="";}return{selectionVariant:JSON.stringify(l1),semanticDates:m1,tableVariantId:s.oSmartTable&&s.oSmartTable.getCurrentVariantId(),customData:P()};}function V(i){o.restoreCustomAppStateDataExtension(i||{});}function W(){var i=a({},s.oSmartFilterbar.getFilterData(true)),k1=s.oController.getOwnerComponent().getModel("_filter");k1.setData(i);s.filterBarController._updateFilterLink();}function X(i){s.oSmartFilterbar.clearVariantSelection();s.oSmartFilterbar.clear();r=i.selectionVariant;c1(i.selectionVariant.toJSONObject(),i.semanticDates,true,false);}function Y(k1){var l1=k1.getParameterNames().concat(k1.getSelectOptionsPropertyNames());for(var i=0;i<l1.length;i++){s.oSmartFilterbar.addFieldToAdvancedArea(l1[i]);}if(s.alr_visualFilterBar&&s.bVisualFilterInitialised){s.alr_visualFilterBar.addVisualFiltersToBasicArea(l1);}}function Z(){if(s._bIsStartingUp){return;}if(I){return;}var i=T();try{u=n.storeInnerAppStateWithImmediateReturn(i,true);}catch(k1){L.error("AnalyticalListPage.fnStoreCurrentAppStateAndAdjustURL: "+k1);}if(u instanceof sap.ui.generic.app.navigation.service.NavError){u=null;return;}if(s.oTemplateUtils.oComponentUtils.isComponentActive()&&u){s.oTemplateUtils.oServices.oApplication.navigateByExchangingQueryParam(w,u.appStateKey);}if(u&&A!==u.appStateKey){R.appStateKey=u.appStateKey;u=null;}}function $(){var i=s.oController.getOwnerComponent().getModel("_templPriv");if(i.getProperty('/alp/filterMode')===k){if(s.alr_visualFilterBar&&s.alr_visualFilterBar.bIsInitialised&&i.getProperty("/alp/searchable")===false){s.oSmartFilterbar.showAdaptFilterDialog("group");}}}function a1(){if(s.oSmartFilterbar.isInitialised()){s.oSmartFilterbar.checkSearchAllowed(s);}}function b1(){var i=s.oController.getOwnerComponent().getModel("_filter");i.setData(a({},s.oSmartFilterbar.getFilterData(true)));s.filterBarController._updateFilterLink();}function c1(i,k1,l1,m1){var n1=new U({selectionVariant:i,semanticDates:k1});s.oSmartFilterbar.setUiState(n1,{replace:l1,strictMode:m1});}function d1(i){p=n.parseNavigation();}function e1(){try{var i=new Promise(function(l1,m1){_=l1;p.done(M);p.fail(m1);});return i;}catch(k1){i1();}}function f1(){I=false;_();}function g1(){return r;}function h1(i){if(!i){var k1=s.oIappStateHandler.fnGetStartUpSelectionVariant();if(k1){var l1=k1.getParameterNames().concat(k1.getSelectOptionsPropertyNames());s.alr_visualFilterBar.addVisualFiltersToBasicArea(l1);}}s.alr_visualFilterBar.updateVisualFilterBindings(true);if(s.oSmartFilterbar.isCurrentVariantStandard()){s.oIappStateHandler.fnCheckMandatory();s.oIappStateHandler.fnCheckToLaunchDialog();}}function i1(){H();b1();if(s.alr_visualFilterBar&&s.alr_visualFilterBar.bIsInitialised){s.oIappStateHandler.fnUpdateVisualFilterBar(true);}}function j1(){var i=false;if(s.oSmartFilterbar.isCurrentVariantStandard()){var k1=s.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardByUser;if(k1!==null){return false;}s.oSmartFilterbar.checkSearchAllowed(s);if(s.oController.getView().getModel("_templPriv").getProperty("/alp/searchable")){var l1=s.oController.getOwnerComponent();var m1=l1.getDataLoadSettings();var n1=m1?m1.loadDataOnAppLaunch:"ifAnyFilterExist";if(n1==="ifAnyFilterExist"){var o1=s.oSmartFilterbar.getFiltersWithValues();i=o1.length?true:false;}else if(n1==="always"){i=true;}else if(n1==="never"){i=false;}if(i){s.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardViaXML=true;}}}return i;}return{getFilterState:P,fnCheckMandatory:a1,fnCheckToLaunchDialog:$,getCurrentAppState:T,fnUpdateSVFB:b1,fnSetDefaultFilter:H,fnRestoreFilterState:G,getUrlParameterInfo:x,onSmartFilterBarInitialise:d1,onSmartFilterBarInitialized:e1,fnStoreCurrentAppStateAndAdjustURL:Z,fnSetFiltersUsingUIState:c1,fnResolveStartUpPromise:f1,fnGetStartUpSelectionVariant:g1,fnUpdateVisualFilterBar:h1,fnOnError:i1,getInitialNavigationContext:Q};}return B.extend("sap.suite.ui.generic.template.AnalyticalListPage.controller.IappStateHandler",{constructor:function(s,o,t){e(this,g(s,o,t));}});});
