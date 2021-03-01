// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/Log","sap/ui/model/odata/ODataUtils","sap/ui/thirdparty/datajs","sap/ui/thirdparty/jquery","sap/ushell/resources","sap/ui/model/json/JSONModel","sap/ui/core/library","sap/ushell/ui/launchpad/AccessibilityCustomData"],function(L,O,a,q,r,J,c,A){"use strict";var V=c.mvc.ViewType;sap.ui.controller("sap.ushell.components.appfinder.EasyAccess",{DEFAULT_URL:"/sap/opu/odata/UI2",DEFAULT_NUMBER_OF_LEVELS:3,SEARCH_RESULTS_PER_REQUEST:100,onInit:function(){var t=this;this.translationBundle=r.i18n;this.oView=this.getView();var e=this.oView.getModel("easyAccessSystemsModel");var s=e.bindProperty("/systemSelected");s.attachChange(t.adjustUiOnSystemChange.bind(this));this.menuName=this.oView.getViewData().menuName;this.systemId=null;this.easyAccessCache={};this.easyAccessModel=new J();this.oView.hierarchyFolders.setModel(this.easyAccessModel,"easyAccess");this.oView.hierarchyApps.setModel(this.easyAccessModel,"easyAccess");var m=this.getView().getModel();if(!m.getProperty("/catalogs")){if(!m.getProperty("/groups")||m.getProperty("/groups").length===0){if(typeof sap.ushell.components.getHomepageManager==="function"){this.oHomepageManager=sap.ushell.components.getHomepageManager();this.oHomepageManager.loadPersonalizedGroups();}else{L.error("The homepage manager was not initialised. Tiles in user and sap menu cannot be added to groups.");}}}var S=this.oView.getModel("subHeaderModel");var T=S.bindProperty("/openCloseSplitAppButtonToggled");T.attachChange(t.handleToggleButtonModelChanged.bind(this));if(this.oView.getViewData().enableSearch){var o=S.bindProperty("/search");o.attachChange(t.handleSearchModelChanged.bind(this));}this.checkIfSystemSelectedAndLoadData();},onAfterRendering:function(){setTimeout(function(){this.oView.hierarchyApps.getController()._updateAppBoxedWithPinStatuses();}.bind(this),0);},checkIfSystemSelectedAndLoadData:function(){var s=this.oView.getModel("easyAccessSystemsModel").getProperty("/systemSelected");if(s){this.systemId=s.systemId;this.loadMenuItemsFirstTime(this.oView.getViewData().menuName,s);}},navigateHierarchy:function(p,f){this.oView.hierarchyFolders.setBusy(false);var e=this.easyAccessModel.getProperty(p||"/");if(typeof e.folders!=="undefined"){this.oView.hierarchyFolders.updatePageBindings(p,f);this.oView.hierarchyApps.getController().updatePageBindings(p);return;}this.oView.hierarchyFolders.setBusy(true);this.getMenuItems(this.menuName,this.systemId,e.id,e.level).then(function(p,b){this.easyAccessModel.setProperty(p+"/folders",b.folders);this.easyAccessModel.setProperty(p+"/apps",b.apps);this.oView.hierarchyFolders.updatePageBindings(p,f);this.oView.hierarchyApps.getController().updatePageBindings(p);this.oView.hierarchyFolders.setBusy(false);}.bind(this,p),function(b){this.handleGetMenuItemsError(b);}.bind(this));},handleSearch:function(s){var i=!this.hierarchyAppsSearchResults;if(i){this.hierarchyAppsSearchResults=new sap.ui.view(this.getView().getId()+"hierarchyAppsSearchResults",{type:V.JS,viewName:"sap.ushell.components.appfinder.HierarchyApps",height:"100%",viewData:{easyAccessSystemsModel:this.oView.getModel("easyAccessSystemsModel"),getMoreSearchResults:this.getMoreSearchResults.bind(this)}});this.easyAccessSearchResultsModel=new J();this.easyAccessSearchResultsModel.setSizeLimit(10000);this.hierarchyAppsSearchResults.setModel(this.easyAccessSearchResultsModel,"easyAccess");this.hierarchyAppsSearchResults.setBusyIndicatorDelay(this.getView().BUSY_INDICATOR_DELAY);this.hierarchyAppsSearchResults.addStyleClass(" sapUshellAppsView sapMShellGlobalInnerBackground");this.hierarchyAppsSearchResults.addCustomData(new A({key:"role",value:"region",writeToDom:true}));this.hierarchyAppsSearchResults.addCustomData(new A({key:"aria-label",value:this.oView.oResourceBundle.getText("easyAccessTileContainer"),writeToDom:true}));}this.searchResultFrom=0;this.oView.splitApp.getCurrentDetailPage().setBusy(true);this.easyAccessSearchResultsModel.setProperty("/apps",[]);this.easyAccessSearchResultsModel.setProperty("/total",0);this._getSearchResults(s,this.searchResultFrom).then(function(b){b.results.forEach(function(e){var d=sap.ushell.Container.getService("Bookmark");d.countBookmarks(e.url).then(function(f){e.bookmarkCount=f;});});this.easyAccessSearchResultsModel.setProperty("/apps",b.results);this.easyAccessSearchResultsModel.setProperty("/total",b.count);this.searchResultFrom=b.results.length;if(i){this.oView.splitApp.addDetailPage(this.hierarchyAppsSearchResults);}this.hierarchyAppsSearchResults.updateResultSetMessage(parseInt(b.count,10),true);this.oView.splitApp.getCurrentDetailPage().setBusy(false);if(this.oView.splitApp.getCurrentDetailPage()!==this.hierarchyAppsSearchResults){this.oView.splitApp.toDetail(this.getView().getId()+"hierarchyAppsSearchResults");}}.bind(this),function(e){this.handleGetMenuItemsError(e);this.oView.splitApp.getCurrentDetailPage().setBusy(false);}.bind(this));},getMoreSearchResults:function(){if(this.oView.splitApp.getCurrentDetailPage().setShowMoreResultsBusy){this.oView.splitApp.getCurrentDetailPage().setShowMoreResultsBusy(true);}var s=this.oView.getModel("subHeaderModel");var S=s.getProperty("/search/searchTerm");this._getSearchResults(S,this.searchResultFrom).then(function(b){var C=this.easyAccessSearchResultsModel.getProperty("/apps");var n=C.slice();Array.prototype.push.apply(n,b.results);this.easyAccessSearchResultsModel.setProperty("/apps",n);if(this.oView.splitApp.getCurrentDetailPage().setShowMoreResultsBusy){this.oView.splitApp.getCurrentDetailPage().setShowMoreResultsBusy(false);}this.searchResultFrom=n.length;}.bind(this),function(e){this.handleGetMenuItemsError(e);if(this.oView.splitApp.getCurrentDetailPage().setShowMoreResultsBusy){this.oView.splitApp.getCurrentDetailPage().setShowMoreResultsBusy(true);}}.bind(this));},_getSearchResults:function(s,f){var d=new q.Deferred();var S=this._getODataRequestForSearchUrl(this.menuName,this.systemId,s,f);var R={requestUri:S};var C=this._callODataService(R,this.handleSuccessOnReadFilterResults);C.done(function(b){d.resolve(b);});C.fail(function(e){d.reject(e);});return d.promise();},getSystemNameOrId:function(){var s=this.oView.getModel("easyAccessSystemsModel").getProperty("/systemSelected");if(s){return s.name||s.id;}},adjustUiOnSystemChange:function(){var C=this.easyAccessModel.getData();if(this.systemId&&C&&C.id){this.easyAccessCache[this.systemId]=C;}var s=this.oView.getModel("easyAccessSystemsModel").getProperty("/systemSelected");if(s){this.systemId=s.systemId;var n=this.easyAccessCache[this.systemId];if(n){this.easyAccessModel.setData(n);this.navigateHierarchy("",false);}else{this.oView.hierarchyFolders.setBusy(true);this.oView.hierarchyApps.setBusy(true);this.loadMenuItemsFirstTime(this.menuName,s);}}},handleToggleButtonModelChanged:function(){var s=this.oView.getModel("subHeaderModel");var b=s.getProperty("/openCloseSplitAppButtonVisible");var B=s.getProperty("/openCloseSplitAppButtonToggled");var S=this.getView().splitApp;if(b){if(B&&!S.isMasterShown()){S.showMaster();}else if(S.isMasterShown()){S.hideMaster();}}},handleSearchModelChanged:function(){var s=this.oView.getModel("subHeaderModel");var b=s.getProperty("/activeMenu");if(this.getView().getId().indexOf(b)===-1){return;}var S=s.getProperty("/search/searchTerm");var d=s.getProperty("/search/searchMode");if(d){sap.ui.getCore().byId("appFinderSearch").getCustomData()[0].setValue(this.getView().getId()+"hierarchyAppsSearchResults");if(S){this.handleSearch(S);}}else{sap.ui.getCore().byId("appFinderSearch").getCustomData()[0].setValue("");this.oView.splitApp.toDetail(this.getView().getId()+"hierarchyApps");}},loadMenuItemsFirstTime:function(m,s){return this.getMenuItems(m,s.systemId,"",0).then(function(b){b.text=s.systemName||s.systemId;this.easyAccessModel.setData(b);this.oView.hierarchyFolders.setBusy(false);this.oView.hierarchyApps.setBusy(false);this.navigateHierarchy("",false);}.bind(this),function(e){this.handleGetMenuItemsError(e);this.oView.hierarchyFolders.updatePageBindings("/",false);this.oView.hierarchyApps.getController().updatePageBindings("/");}.bind(this));},handleGetMenuItemsError:function(e){var E=this.getErrorMessage(e);sap.ui.require(["sap/m/MessageBox"],function(M){M.error(E);});this.easyAccessModel.setData("");this.oView.hierarchyFolders.setBusy(false);this.oView.hierarchyApps.setBusy(false);},getErrorMessage:function(e){var m="";if(this.menuName==="SAP_MENU"){m=this.translationBundle.getText("easyAccessSapMenuNameParameter");}else if(this.menuName==="USER_MENU"){m=this.translationBundle.getText("easyAccessUserMenuNameParameter");}if(e){if(e.message){return this.translationBundle.getText("easyAccessErrorGetDataErrorMsg",[m,e.message]);}return this.translationBundle.getText("easyAccessErrorGetDataErrorMsg",[m,e]);}return this.translationBundle.getText("easyAccessErrorGetDataErrorMsgNoReason",m);},getMenuItems:function(m,s,e,b,n){var d=new q.Deferred();if(m!=="SAP_MENU"&&m!=="USER_MENU"){d.reject("Invalid menuType parameter");return d.promise();}if(typeof s!=="string"||s===""){d.reject("Invalid systemId parameter");return d.promise();}if(typeof e!=="string"){d.reject("Invalid entityId parameter");return d.promise();}if(typeof b!=="number"){d.reject("Invalid entityLevel parameter");return d.promise();}if(n&&typeof n!=="number"){d.reject("Invalid numberOfNextLevels parameter");return d.promise();}if(e===""){b=0;}var N;var M=this.getView().getModel();var C=M.getProperty("/easyAccessNumbersOfLevels");if(C){N=C;}else if(n){N=n;}else{N=this.DEFAULT_NUMBER_OF_LEVELS;}var l=b+N+1;var S=this._getODataRequestUrl(m,s,e,l);var R={requestUri:S};var o=this._callODataService(R,this.handleSuccessOnReadMenuItems,{systemId:s,entityId:e,iLevelFilter:l});o.done(function(f){d.resolve(f);});o.fail(function(f){d.reject(f);});return d.promise();},_callODataService:function(R,s,S){var l,i;var t=this;var d=new q.Deferred();if(!S){S={};}if(sap.ushell.Container){l=sap.ushell.Container&&sap.ushell.Container.getUser().getLanguage();if((l)&&(R.requestUri.indexOf("sap-language=")===-1)){R.requestUri=R.requestUri+(R.requestUri.indexOf("?")>=0?"&":"?")+"sap-language="+l;}i=sap.ushell.Container.getLogonSystem()?sap.ushell.Container.getLogonSystem().getClient():"";}sap.ui.require(["sap/ui/thirdparty/datajs"],function(){a.read({requestUri:R.requestUri,headers:{"Cache-Control":"no-cache, no-store, must-revalidate","Pragma":"no-cache","Expires":"0","Accept-Language":(sap.ui&&sap.ui.getCore().getConfiguration().getLanguage())||"","sap-client":(i||""),"sap-language":(l||"")}},function(o,b){if(o&&o.results&&b&&b.statusCode===200){var e=s.bind(t,o,S)();d.resolve(e);}},function(m){d.reject(m);});});return d.promise();},handleSuccessOnReadMenuItems:function(R,p){var o=this._oDataResultFormatter(R.results,p.systemId,p.entityId,p.iLevelFilter);return o;},handleSuccessOnReadFilterResults:function(R){var u;R.results.forEach(function(o,i){u=this._appendSystemToUrl(o,this.systemId);o.url=u;}.bind(this));return{results:R.results,count:R.__count};},_appendSystemToUrl:function(d,s){if(d.url){return d.url+(d.url.indexOf("?")>0?"&":"?")+"sap-system="+s;}},_oDataResultFormatter:function(R,s,e,l){var f={};var o={};if(e===""){o={id:"root",text:"root",level:0,folders:[],apps:[]};f.root=o;}else{o={id:e,folders:[],apps:[]};f[e]=o;}var b;for(var i=0;i<R.length;i++){b=R[i];var p;if(b.level==="01"){p=f.root;}else{p=f[b.parentId];}var m={id:b.Id,text:b.text,subtitle:b.subtitle,icon:b.icon,level:parseInt(b.level,10)};if(b.type==="FL"){m.folders=[];m.apps=[];if(b.level==l-1){m.folders=undefined;m.apps=undefined;}if(p&&p.folders){p.folders.push(m);}f[b.Id]=m;}else{m.url=this._appendSystemToUrl(b,s);if(p&&p.apps){p.apps.push(m);}}}return o;},_getODataRequestUrl:function(m,s,e,l){var S=this._getServiceUrl(m);var b;if(l<10){b="0"+l;}else{b=l.toString();}var d="";if(e){if(decodeURIComponent(e)===e){e=encodeURIComponent(e);}d="('"+e+"')/AllChildren";}S=S+";o="+s+"/MenuItems"+d+"?$filter=level lt '"+b+"'&$orderby=level,text";return S;},_getODataRequestForSearchUrl:function(m,s,t,f){var S=this._getServiceUrl(m);var n=this.SEARCH_RESULTS_PER_REQUEST;t=this._removeWildCards(t);f=!f?0:f;t=O.formatValue(t,"Edm.String");S=S+";o="+s+"/MenuItems?$filter=type ne 'FL' and substringof("+t+", text) or substringof("+t+", subtitle) or substringof("+t+", url)&$orderby=text,subtitle,url&$inlinecount=allpages&$skip="+f+"&$top="+n;return S;},_getServiceUrl:function(m){var s;var M=this.getView().getModel();if(m==="SAP_MENU"){var S=M.getProperty("/sapMenuServiceUrl");if(S){s=S;}else{s=this.DEFAULT_URL+"/EASY_ACCESS_MENU";}}else if(m==="USER_MENU"){var u=M.getProperty("/userMenuServiceUrl");if(u){s=u;}else{s=this.DEFAULT_URL+"/USER_MENU";}}return s;},_removeWildCards:function(t){return t.replace(/\*/g,"");}});});
