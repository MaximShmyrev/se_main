// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils","sap/ui/core/Popup","sap/ui/core/library","sap/ui/thirdparty/jquery","sap/base/Log","sap/ui/core/UIComponent","sap/ushell/services/AppConfiguration","sap/ushell/ui/footerbar/AddBookmarkButton","sap/ushell/services/_AppState/AppStatePersistencyMethod","sap/ushell/EventHub","sap/ushell/components/applicationIntegration/application/PostMessageAPIInterface","sap/ui/thirdparty/URI","sap/base/util/ObjectPath","sap/ushell/Config","sap/ushell/utils/testableHelper","sap/base/util/UriParameters"],function(u,P,c,q,L,U,A,a,b,E,d,f,O,C,t,g){"use strict";var S="sap.ushell.";var D=new U(),p={};var o={"sap.ushell.services.CrossApplicationNavigation":{oServiceCalls:{"hrefForExternal":{executeServiceCallFn:function(e){return new q.Deferred().resolve(sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal(e.oMessageData.body.oArgs)).promise();}},"getSemanticObjectLinks":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("CrossApplicationNavigation").getSemanticObjectLinks(e.oMessageData.body.sSemanticObject,e.oMessageData.body.mParameters,e.oMessageData.body.bIgnoreFormFactors,undefined,undefined,e.oMessageData.body.bCompactIntents);}},"isIntentSupported":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported(e.oMessageData.body.aIntents);}},"isNavigationSupported":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("CrossApplicationNavigation").isNavigationSupported(e.oMessageData.body.aIntents);}},"backToPreviousApp":{executeServiceCallFn:function(){sap.ushell.Container.getService("CrossApplicationNavigation").backToPreviousApp();return new q.Deferred().resolve().promise();}},"historyBack":{executeServiceCallFn:function(e){sap.ushell.Container.getService("CrossApplicationNavigation").historyBack(e.oMessageData.body.iSteps);return new q.Deferred().resolve().promise();}},"getAppStateData":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("CrossApplicationNavigation").getAppStateData(e.oMessageData.body.sAppStateKey);}},"toExternal":{executeServiceCallFn:function(e){var m=u.clone(e.oMessageData.body.oArgs);u.storeSapSystemToLocalStorage(m);return new q.Deferred().resolve(sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(m)).promise();}},"registerBeforeAppCloseEvent":{executeServiceCallFn:function(e){e.oContainer.setProperty("beforeAppCloseEvent",{enabled:true,params:e.oMessageData.body},true);return new q.Deferred().resolve().promise();}},"expandCompactHash":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("CrossApplicationNavigation").expandCompactHash(e.oMessageData.body.sHashFragment);}},"getDistinctSemanticObjects":{executeServiceCallFn:function(){return sap.ushell.Container.getService("CrossApplicationNavigation").getDistinctSemanticObjects();}},"getLinks":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("CrossApplicationNavigation").getLinks(e.oMessageData.body);}},"getPrimaryIntent":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("CrossApplicationNavigation").getPrimaryIntent(e.oMessageData.body.sSemanticObject,e.oMessageData.body.mParameters);}},"hrefForAppSpecificHash":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("CrossApplicationNavigation").hrefForAppSpecificHash(e.oMessageData.body.sAppHash);}},"isInitialNavigation":{executeServiceCallFn:function(){return sap.ushell.Container.getService("CrossApplicationNavigation").hrefForAppSpecificHash();}},"getAppState":{executeServiceCallFn:function(e){var m=new q.Deferred();sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(D,e.oMessageData.body.sAppStateKey).done(function(n){delete n._oServiceInstance;m.resolve(n);});return m.promise();}},"setInnerAppRoute":{executeServiceCallFn:function(e){var m=sap.ushell.Container.getService("URLParsing"),H=m.parseShellHash(window.hasher.getHash()),n;if(H.appSpecificRoute===e.oMessageData.body.appSpecificRoute){return new q.Deferred().resolve().promise();}H.appSpecificRoute=e.oMessageData.body.appSpecificRoute;n="#"+m.constructShellHash(H);window.hasher.changed.active=false;window.hasher.replaceHash(n);window.hasher.changed.active=true;return new q.Deferred().resolve().promise();}},"setInnerAppStateData":{executeServiceCallFn:function(e){var K=h.prototype._setInnerAppStateData(e);return new q.Deferred().resolve(K).promise();}}}},"sap.ushell.ui5service.ShellUIService":{oServiceCalls:{"setTitle":{executeServiceCallFn:function(e){return new q.Deferred().resolve(e.oContainer.getShellUIService().setTitle(e.oMessageData.body.sTitle)).promise();}},"setBackNavigation":{executeServiceCallFn:function(e){return e.executeSetBackNavigationService(e.oMessage,e.oMessageData);}}}},"sap.ushell.services.ShellUIService":{oServiceCalls:{"setTitle":{executeServiceCallFn:function(e){return new q.Deferred().resolve(e.oContainer.getShellUIService().setTitle(e.oMessageData.body.sTitle)).promise();}},"setHierarchy":{executeServiceCallFn:function(e){return new q.Deferred().resolve(e.oContainer.getShellUIService().setHierarchy(e.oMessageData.body.aHierarchyLevels)).promise();}},"setRelatedApps":{executeServiceCallFn:function(e){return new q.Deferred().resolve(e.oContainer.getShellUIService().setRelatedApps(e.oMessageData.body.aRelatedApps)).promise();}},"setDirtyFlag":{executeServiceCallFn:function(e){sap.ushell.Container.setDirtyFlag(e.oMessageData.body.bIsDirty);return new q.Deferred().resolve().promise();}},"showShellUIBlocker":{executeServiceCallFn:function(e){s(e.oMessageData.body.bShow);return new q.Deferred().resolve().promise();}},"getFLPUrl":{executeServiceCallFn:function(e){var I=false;if(e.oMessageData.body&&e.oMessageData.body.bIncludeHash===true){I=true;}return new q.Deferred().resolve(sap.ushell.Container.getFLPUrl(I)).promise();}},"getShellGroupIDs":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("Bookmark").getShellGroupIDs((e.oMessageData.body?e.oMessageData.body.bGetAll:undefined));}},"addBookmark":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("Bookmark").addBookmarkByGroupId(e.oMessageData.body.oParameters,e.oMessageData.body.groupId);}},"addBookmarkDialog":{executeServiceCallFn:function(e){var m=new a();m.firePress({});return new q.Deferred().resolve().promise();}},"getShellGroupTiles":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("LaunchPage").getTilesByGroupId(e.oMessageData.body.groupId);}},"sendUrlAsEmail":{executeServiceCallFn:function(e){var m=C.last("/core/shellHeader/application").title;var n=(m===undefined)?sap.ushell.resources.i18n.getText("linkToApplication"):sap.ushell.resources.i18n.getText("linkTo")+"'"+m+"'";l("",n,document.URL,"","",document.URL,true);return new q.Deferred().resolve().promise();}},"sendEmailWithFLPButton":{executeServiceCallFn:function(e){var m=C.last("/core/shellHeader/application").title;var n=(m===undefined)?sap.ushell.resources.i18n.getText("linkToApplication"):sap.ushell.resources.i18n.getText("linkTo")+"'"+m+"'";l("",n,document.URL,"","",document.URL,e.oMessageData.body.bSetAppStateToPublic);return new q.Deferred().resolve().promise();}},"sendEmail":{executeServiceCallFn:function(e){l(e.oMessageData.body.sTo,e.oMessageData.body.sSubject,e.oMessageData.body.sBody,e.oMessageData.body.sCc,e.oMessageData.body.sBcc,e.oMessageData.body.sIFrameURL,e.oMessageData.body.bSetAppStateToPublic);}},"processHotKey":{executeServiceCallFn:function(e){var m;try{m=new KeyboardEvent('keydown',e.oMessageData.body);}catch(n){var I=document.createEvent("KeyboardEvent"),r="";if(e.oMessageData.body.altKey){r+="Alt ";}if(e.oMessageData.body.ctrlKey){r+="Control ";}if(e.oMessageData.body.shiftKey){r+="Shift ";}I.initKeyboardEvent("keydown",false,false,null,e.oMessageData.body.key,e.oMessageData.body.keyCode,r,0,false);m=I;}document.dispatchEvent(m);return new q.Deferred().resolve().promise();}}}},"sap.ushell.services.Container":{oServiceCalls:{"setDirtyFlag":{executeServiceCallFn:function(e){sap.ushell.Container.setDirtyFlag(e.oMessageData.body.bIsDirty);return new q.Deferred().resolve().promise();}},"getFLPUrl":{executeServiceCallFn:function(e){var I=false;if(e.oMessageData.body&&e.oMessageData.body.bIncludeHash===true){I=true;}return new q.Deferred().resolve(sap.ushell.Container.getFLPUrl(I)).promise();}},"getFLPConfig":{executeServiceCallFn:function(e){var m=new q.Deferred();sap.ushell.Container.getFLPConfig().then(function(F){m.resolve(F);});return m.promise();}}}},"sap.ushell.services.AppState":{oServiceCalls:{"getAppState":{executeServiceCallFn:function(e){var m=new q.Deferred();sap.ushell.Container.getService("AppState").getAppState(e.oMessageData.body.sKey).done(function(n){delete n._oServiceInstance;m.resolve(n);}).fail(function(n){delete n._oServiceInstance;m.resolve(n);});return m.promise();}},"_saveAppState":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("AppState")._saveAppState(e.oMessageData.body.sKey,e.oMessageData.body.sData,e.oMessageData.body.sAppName,e.oMessageData.body.sComponent,e.oMessageData.body.bTransient,e.oMessageData.body.iPersistencyMethod,e.oMessageData.body.oPersistencySettings);}},"_loadAppState":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("AppState")._loadAppState(e.oMessageData.body.sKey);}},"deleteAppState":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("AppState").deleteAppState(e.oMessageData.body.sKey);}},"makeStatePersistent":function(e){return sap.ushell.Container.getService("AppState").makeStatePersistent(e.oMessageData.body.sKey,e.oMessageData.body.iPersistencyMethod,e.oMessageData.body.oPersistencySettings);}}},"sap.ushell.services.Bookmark":{oServiceCalls:{"addBookmarkUI5":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("Bookmark").addBookmark(e.oMessageData.body.oParameters,e.oMessageData.body.vContainer);}},"addBookmark":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("Bookmark").addBookmarkByGroupId(e.oMessageData.body.oParameters,e.oMessageData.body.groupId);}},"getShellGroupIDs":{executeServiceCallFn:function(){return sap.ushell.Container.getService("Bookmark").getShellGroupIDs();}},"addCatalogTileToGroup":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("Bookmark").addCatalogTileToGroup(e.oMessageData.body.sCatalogTileId,e.oMessageData.body.sGroupId,e.oMessageData.body.oCatalogData);}},"countBookmarks":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("Bookmark").countBookmarks(e.oMessageData.body.sUrl);}},"deleteBookmarks":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("Bookmark").deleteBookmarks(e.oMessageData.body.sUrl);}},"updateBookmarks":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("Bookmark").updateBookmarks(e.oMessageData.body.sUrl,e.oMessageData.body.oParameters);}},"getContentNodes":{executeServiceCallFn:function(){var e=q.Deferred();sap.ushell.Container.getService("Bookmark").getContentNodes().then(function(n){e.resolve(n);});return e.promise();}},"addCustomBookmark":{executeServiceCallFn:function(e){var m=q.Deferred();sap.ushell.Container.getService("Bookmark").addCustomBookmark(e.oMessageData.body.sVizType,e.oMessageData.body.oConfig,e.oMessageData.body.vContentNodes).then(function(){m.resolve();});return m.promise();}},"countCustomBookmarks":{executeServiceCallFn:function(e){var m=q.Deferred();sap.ushell.Container.getService("Bookmark").countCustomBookmarks(e.oMessageData.body.oIdentifier).then(function(n){m.resolve(n);});return m.promise();}},"updateCustomBookmarks":{executeServiceCallFn:function(e){var m=q.Deferred();sap.ushell.Container.getService("Bookmark").updateCustomBookmarks(e.oMessageData.body.oIdentifier,e.oMessageData.body.oConfig).then(function(n){m.resolve(n);});return m.promise();}},"deleteCustomBookmarks":{executeServiceCallFn:function(e){var m=q.Deferred();sap.ushell.Container.getService("Bookmark").deleteCustomBookmarks(e.oMessageData.body.oIdentifier).then(function(n){m.resolve(n);});return m.promise();}}}},"sap.ushell.services.AppLifeCycle":{oServiceCalls:{"getFullyQualifiedXhrUrl":{executeServiceCallFn:function(e){var r="",x="",m=new q.Deferred(),n=e.oMessageData.body.path;if(n!=""&&n!=undefined&&n!=null){sap.ushell.Container.getService("AppLifeCycle").getCurrentApplication().getSystemContext().then(function(v){x=v.getFullyQualifiedXhrUrl(n);var H="",w="",y="",F=sap.ushell.Container.getFLPUrl(true),z=new f(F);if(z.protocol()!=null&&z.protocol()!=undefined&&z.protocol()!=""){w=z.protocol()+"://";}if(z.hostname()!=null&&z.hostname()!=undefined&&z.hostname()!=""){H=z.hostname();}if(z.port()!=null&&z.port()!=undefined&&z.port()!=""){y=":"+z.port();}r=w+H+y+x;m.resolve(r);});}return m.promise();}},"getSystemAlias":{executeServiceCallFn:function(e){var m=e.oContainer.getSystemAlias();if(m===null||m===undefined){m="";}return new q.Deferred().resolve(m).promise();}}}},"sap.ushell.services.AppConfiguration":{oServiceCalls:{"setApplicationFullWidth":{executeServiceCallFn:function(e){A.setApplicationFullWidth(e.oMessageData.body.bValue);return new q.Deferred().resolve().promise();}}}},"sap.ushell.appRuntime":{oRequestCalls:{"innerAppRouteChange":{isActiveOnly:true,distributionType:["all"]},"hashChange":{isActiveOnly:true,distributionType:["URL"]},"setDirtyFlag":{isActiveOnly:true,distributionType:["URL"]},"themeChange":{isActiveOnly:false,distributionType:["all"]},"uiDensityChange":{isActiveOnly:false,distributionType:["all"]}},oServiceCalls:{"hashChange":{executeServiceCallFn:function(e){window.hasher.disableBlueBoxHashChangeTrigger=true;window.hasher.replaceHash(e.oMessageData.body.newHash);window.hasher.disableBlueBoxHashChangeTrigger=false;return new q.Deferred().resolve().promise();}}}},"sap.ushell.services.UserInfo":{oServiceCalls:{"getThemeList":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("UserInfo").getThemeList();}},"openThemeManager":{executeServiceCallFn:function(e){E.emit("openThemeManager",Date.now());return new q.Deferred().resolve().promise();}}}},"sap.ushell.services.ShellNavigation":{oServiceCalls:{"toExternal":{executeServiceCallFn:function(e){sap.ushell.Container.getService("ShellNavigation").toExternal(e.oMessageData.body.oArgs,undefined,e.oMessageData.body.bWriteHistory);return new q.Deferred().resolve().promise();}},"toAppHash":{executeServiceCallFn:function(e){sap.ushell.Container.getService("ShellNavigation").toAppHash(e.oMessageData.body.sAppHash,e.oMessageData.body.bWriteHistory);return new q.Deferred().resolve().promise();}}}},"sap.ushell.services.NavTargetResolution":{oServiceCalls:{"getDistinctSemanticObjects":{executeServiceCallFn:function(){return sap.ushell.Container.getService("NavTargetResolution").getDistinctSemanticObjects();}},"expandCompactHash":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("NavTargetResolution").expandCompactHash(e.oMessageData.body.sHashFragment);}},"resolveHashFragment":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("NavTargetResolution").expandCompactHash(e.oMessageData.body.sHashFragment);}},"isNavigationSupported":{executeServiceCallFn:function(e){return sap.ushell.Container.getService("NavTargetResolution").isNavigationSupported(e.oMessageData.body.aIntents);}}}},"sap.ushell.services.Renderer":{oServiceCalls:{"addHeaderItem":{executeServiceCallFn:function(e){j("addHeaderItem",e);return new q.Deferred().resolve().promise();}},"addHeaderEndItem":{executeServiceCallFn:function(e){j("addHeaderEndItem",e);return new q.Deferred().resolve().promise();}},"showHeaderItem":{executeServiceCallFn:function(e){sap.ushell.Container.getRenderer("fiori2").showHeaderItem(e.oMessageData.body.aIds,e.oMessageData.body.bCurrentState||true,e.oMessageData.body.aStates);return new q.Deferred().resolve().promise();}},"showHeaderEndItem":{executeServiceCallFn:function(e){sap.ushell.Container.getRenderer("fiori2").showHeaderEndItem(e.oMessageData.body.aIds,e.oMessageData.body.bCurrentState||true,e.oMessageData.body.aStates);return new q.Deferred().resolve().promise();}},"hideHeaderItem":{executeServiceCallFn:function(e){sap.ushell.Container.getRenderer("fiori2").hideHeaderItem(e.oMessageData.body.aIds,e.oMessageData.body.bCurrentState||true,e.oMessageData.body.aStates);return new q.Deferred().resolve().promise();}},"hideHeaderEndItem":{executeServiceCallFn:function(e){sap.ushell.Container.getRenderer("fiori2").hideHeaderEndItem(e.oMessageData.body.aIds,e.oMessageData.body.bCurrentState||true,e.oMessageData.body.aStates);return new q.Deferred().resolve().promise();}},"setHeaderTitle":{executeServiceCallFn:function(e){sap.ushell.Container.getRenderer("fiori2").setHeaderTitle(e.oMessageData.body.sTitle);return new q.Deferred().resolve().promise();}},"setHeaderVisibility":{executeServiceCallFn:function(e){sap.ushell.Container.getRenderer("fiori2").setHeaderVisibility(e.oMessageData.body.bVisible,e.oMessageData.body.bCurrentState||true,e.oMessageData.body.aStates);return new q.Deferred().resolve().promise();}},"createShellHeadItem":{executeServiceCallFn:function(e){var m=e.oMessageData.body.params;m.press=function(){e.oContainer.postMessageRequest("sap.ushell.appRuntime.buttonClick",{buttonId:m.id});};new sap.ushell.ui.shell.ShellHeadItem(m);return new q.Deferred().resolve().promise();}},"showActionButton":{executeServiceCallFn:function(e){sap.ushell.Container.getRenderer("fiori2").showActionButton(e.oMessageData.body.aIds,e.oMessageData.body.bCurrentState,e.oMessageData.body.aStates);return new q.Deferred().resolve().promise();}},"hideActionButton":{executeServiceCallFn:function(e){sap.ushell.Container.getRenderer("fiori2").hideActionButton(e.oMessageData.body.aIds,e.oMessageData.body.bCurrentState,e.oMessageData.body.aStates);return new q.Deferred().resolve().promise();}},"addUserAction":{executeServiceCallFn:function(e){e.oMessageData.body.oParameters.oControlProperties.press=function(){e.oContainer.postMessageRequest("sap.ushell.appRuntime.buttonClick",{buttonId:e.oMessageData.body.oParameters.oControlProperties.id});};sap.ushell.Container.getRenderer("fiori2").addUserAction(e.oMessageData.body.oParameters);return new q.Deferred().resolve().promise();}},"addOptionsActionSheetButton":{executeServiceCallFn:function(e){new sap.m.Button({id:e.oMessageData.body.id,text:e.oMessageData.body.text,icon:e.oMessageData.body.icon,tooltip:e.oMessageData.tooltip,press:function(){e.oContainer.postMessageRequest("sap.ushell.appRuntime.buttonClick",{buttonId:e.oMessageData.body.id});}});sap.ushell.Container.getRenderer("fiori2").showActionButton([e.oMessageData.body.id],false,e.oMessageData.body.aStates);return new q.Deferred().resolve().promise();}},"removeOptionsActionSheetButton":{executeServiceCallFn:function(e){var B=sap.ui.getCore().byId(e.oMessageData.body.id);sap.ushell.Container.getRenderer("fiori2").hideActionButton(e.oMessageData.body.id,false,e.oMessageData.body.aStates);B.destroy();return new q.Deferred().resolve().promise();}}}},"sap.ushell.services.LaunchPage":{oServiceCalls:{"getGroupsForBookmarks":{executeServiceCallFn:function(){return sap.ushell.Container.getService("LaunchPage").getGroupsForBookmarks();}}}}};function h(){Object.keys(o).forEach(function(K){if(K.indexOf(S)!=0){throw new Error("All Post Message APIs must start with '"+S+"' - "+K);}});d.init(true,h.prototype.registerShellCommunicationHandler.bind(this));}h.prototype.getAPIs=function(){return o;};function i(K,e){var m=o[K],n;if(m){if(e.oServiceCalls){Object.keys(e.oServiceCalls).forEach(function(r){m.oServiceCalls[r]=e.oServiceCalls[r];});}if(e.oRequestCalls){Object.keys(e.oRequestCalls).forEach(function(r){m.oRequestCalls[r]=e.oRequestCalls[r];});}return;}n={oRequestCalls:{},oServiceCalls:{}};if(e.oServiceCalls){Object.keys(e.oServiceCalls).forEach(function(r){n.oServiceCalls[r]=e.oServiceCalls[r];});}if(e.oRequestCalls){Object.keys(e.oRequestCalls).forEach(function(r){n.oRequestCalls[r]=e.oRequestCalls[r];});}o[K]=n;}h.prototype._getPostMesageInterface=function(e,I){var m,n=this.getAPIs();if(n[e]){m=n[e];if(m&&m.oRequestCalls&&m.oRequestCalls[I]){return m.oRequestCalls[I];}}return undefined;};h.prototype.registerShellCommunicationHandler=function(e){Object.keys(e).forEach(function(K){i(K,e[K]);});};h.prototype.isActiveOnly=function(e,I){var m=this._getPostMesageInterface(e,I);if(m){return m.isActiveOnly;}return undefined;};h.prototype.getResponseHandler=function(e,I){var m=this._getPostMesageInterface(e,I);if(m){return m.fnResponseHandler;}return undefined;};h.prototype._createNewInnerAppState=function(m){var n=sap.ushell.Container.getService("AppState"),N,H,r,v,V;N=n.createEmptyAppState(undefined,false);if(m.oMessageData.body.sData!==undefined){try{V=JSON.parse(m.oMessageData.body.sData);}catch(e){V=m.oMessageData.body.sData;}}else{V="";}N.setData(V);N.save();v=N.getKey();H=window.hasher.getHash();if(H.indexOf("&/")>0){if(H.indexOf("sap-iapp-state=")>0){r=/(?:sap-iapp-state=)([^&/]+)/.exec(H)[1];H=H.replace(r,v);}else{H=H+"/sap-iapp-state="+v;}}else{H=H+"&/sap-iapp-state="+v;}window.hasher.changed.active=false;window.hasher.replaceHash(H);window.hasher.changed.active=true;return v;};h.prototype._setInnerAppStateData=function(e){return h.prototype._createNewInnerAppState(e);};function s(e){if(e===true&&p.oDlg===undefined){if(q("#canvas")&&q("#canvas").hasClass("sapUshellShellBG")){q("#canvas").removeClass("sapUshellShellBG");p.bClassRemoved=true;}p.oDlg=new P();p.oDlg.setShadow(true);p.oDlg.setModal(true,"sapMDialogBlockLayerInit");p.oDlg.setNavigationMode("SCOPE");p.oDlg.eOpenState=c.OpenState.OPEN;q("#shell-cntnt").css("zIndex",40);p.oDlg._iZIndex=30;p.oDlg._duringOpen();}else if(e===false&&p.oDlg!==undefined){p.oDlg._oLastPosition=p.oDlg._oDefaultPosition;p.oDlg.destroy();if(p.bClassRemoved===true){q("#canvas").addClass("sapUshellShellBG");}p.oDlg=undefined;p.bClassRemoved=false;q("#shell-cntnt").css("zIndex","auto");}}function j(e,m){sap.ushell.Container.getRenderer("fiori2")[e]("sap.ushell.ui.shell.ShellHeadItem",{id:m.oMessageData.body.sId,tooltip:m.oMessageData.body.sTooltip,icon:m.oMessageData.body.sIcon,press:function(){m.oContainer.postMessageRequest("sap.ushell.appRuntime.buttonClick",{buttonId:m.oMessageData.body.sId});}},m.oMessageData.body.bVisible,m.oMessageData.body.bCurrentState||true,m.oMessageData.body.aStates);}function k(){return document.URL;}function l(T,e,B,m,n,I,r){var F=k();function v(I,F){if(I&&I.length>0&&((e&&e.includes(I))||(B&&B.includes(I)))){if(B&&B.includes(I)){B=B.replace(I,F);}if(e&&e.includes(I)){e=e.replace(I,F);}}}if(r){sap.ushell.Container.getService("AppState").setAppStateToPublic(I).done(function(N,x,w,X,y){if(X!==undefined){F=F.replace(x,X);}if(y!==undefined){F=F.replace(w,y);}v(I,F);sap.m.URLHelper.triggerEmail(T,e,B,m,n);}).fail(L.error);}else{v(I,F);sap.m.URLHelper.triggerEmail(T,e,B,m,n);}}var k=t.testableStatic(k,"PostMessageAPI_getBrowserURL");var l=t.testableStatic(l,"PostMessageAPI_sendEmail");return new h();},false);