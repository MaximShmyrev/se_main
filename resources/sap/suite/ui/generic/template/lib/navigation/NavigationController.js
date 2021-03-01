/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object","sap/base/util/merge","sap/base/util/extend","sap/base/util/isEmptyObject","sap/base/util/UriParameters","sap/ui/core/ComponentContainer","sap/ui/core/routing/HashChanger","sap/ui/core/routing/History","sap/ui/core/library","sap/suite/ui/generic/template/genericUtilities/FeError","sap/suite/ui/generic/template/genericUtilities/FeLogger","sap/suite/ui/generic/template/genericUtilities/oDataModelHelper","sap/suite/ui/generic/template/genericUtilities/ProcessObserver","sap/suite/ui/generic/template/genericUtilities/Queue","sap/suite/ui/generic/template/genericUtilities/testableHelper","sap/suite/ui/generic/template/lib/CRUDHelper","sap/suite/ui/generic/template/lib/navigation/routingHelper","sap/suite/ui/generic/template/lib/navigation/startupParameterHelper","sap/suite/ui/generic/template/lib/TemplateComponent","sap/ui/fl/ControlPersonalizationAPI","sap/suite/ui/generic/template/js/placeholderHelper"],function(B,m,e,a,U,C,H,b,c,F,d,D,P,Q,t,f,r,s,T,g,p){"use strict";var h="lib.navigation.NavigationController";var l=new d(h).getLogger();var k=c.routing.HistoryDirection;var o=b.getInstance();function n(i){i=i||o.getDirection();return i===k.Backwards;}var q=r.getCrossAppNavService();var A="sap-iapp-state--create";var u="sap-iapp-state--history";function v(R){var i=R.substring(R.length-5,R.length);if(i==="query"){return R.substring(0,R.length-5);}return R;}function N(i){if(i.indexOf("/")===0){return i;}return"/"+i;}function w(j){var G="";var R="";var I=Object.keys(j).sort();I.forEach(function(J){var V=j[J];if(Array.isArray(V)){var K=V.sort();for(var i=0;i<K.length;i++){var L=K[i];R=R+G+J+"="+L;G="&";}}else{R=R+G+J+"="+V;G="&";}});return R;}function x(i,j){i=i||"";var G=(i.charAt(i.length-1)==="/")?"?":"/?";return i+(j?G+j:"");}function y(G,I){var S=[];var J=q.createEmptyAppState(G.oAppComponent,true);var K=J.getKey();var L;var M;var O;var R;var V;var W,X;var Y;var Z;var $;var _=Promise.resolve();var a1=(new Q()).start();function b1(i){var j=i.iHashChangeCount+1;X={iHashChangeCount:j,backTarget:i.iHashChangeCount,componentsDisplayed:Object.create(null),LeaveByBack:true,backSteps:1};}function c1(){G.oBusyHelper.setBusyReason("HashChange",true);Z={};M=n();if(M){G.oBusyHelper.getUnbusy().then(function(){M=false;});Y={mode:-1};if(S.length){var i=S.pop();R=i.isInitialNavigation;O=i.myIntentPromise;V=i.previousHashes;V.push(i.currentHash);b1(i.currentHash);return;}}else{R=!q||q.isInitialNavigation();}G.myIntentPromise=sap.ushell&&sap.ushell.Container&&new Promise(function(Q2){sap.ushell.Container.getServiceAsync("AppLifeCycle").then(function(R2){var S2=R2.getCurrentApplication();var T2=function(){S2=S2||R2.getCurrentApplication();var U2=S2.getIntent();Q2(U2);};if(S2){T2();}else{R2.attachAppLoaded(null,T2);}});});O=G.myIntentPromise?Promise.all([G.myIntentPromise,sap.ushell.Container.getServiceAsync("URLParsing")]).then(function(Q2){var R2=e({},Q2[0]);var S2=Q2[1];R2.appSpecificRoute="&/";var T2=S2.constructShellHash(R2);return"#"+T2;}):Promise.resolve("");h1();var j=!M&&!I.oHashChanger.getHash()&&G.oAppComponent.getComponentData();var P2=j&&j.startupParameters;if(P2){s.parametersToNavigation(G,P2).then(function(Q2){if(Q2){W={treeNode:G.mRoutingTree.root,keys:[],appStates:Object.create(null)};m2(Q2);}I.initialize(!!Q2);});}else{I.initialize();}}var d1=Promise.resolve();var e1=Promise.resolve();var f1=new P();function g1(){var i=n();if(!i){S.push({isInitialNavigation:R,myIntentPromise:O,currentHash:X,previousHashes:V});}O=null;X=null;V=null;W=null;$=null;Z=null;}function h1(){X={iHashChangeCount:0,backTarget:0,componentsDisplayed:Object.create(null)};V=[];Y=null;$=null;}function i1(){y2(G.mRoutingTree.root.sRouteName);return G.mRoutingTree.root.componentCreated;}function j1(){return I.oAppComponent.getManifestEntry("sap.app").title;}function k1(){var i=sap.ushell&&sap.ushell.Container;return i&&i.getServiceAsync("URLParsing");}function l1(i,j,P2){if(!i){return Promise.resolve();}var Q2=i&&G.componentRegistry[i];var R2=[];var S2=Q2&&Q2.methods.getUrlParameterInfo;if(S2){R2.push(Q2.viewRegistered.then(function(){var T2=j&&N(j);return S2(T2,X.componentsDisplayed[Q2.route]===1).then(function(U2){e(P2,U2);});}));}R2.push(Q2.oStatePreserverPromise.then(function(T2){var U2=j&&N(j);return T2.getUrlParameterInfo(U2,X.componentsDisplayed[Q2.route]===1).then(function(V2){e(P2,V2);});}));return Promise.all(R2);}function m1(i){var j=i.treeNode.componentId;var P2=i.treeNode.getPath(2,i.keys);var Q2=i.appStates;return l1(j,P2,Q2);}function n1(i,j){if(i.treeNode===j.treeNode){j.appStates=i.appStates;return Promise.resolve();}if(j.treeNode.fCLLevel===0||j.treeNode.fCLLevel===3){return m1(j);}return G.oFlexibleColumnLayoutHandler.getAppStatesPromiseForNavigation(i,j);}function o1(i,j,P2){var Q2=G.mRoutingTree[i];return l1(Q2.componentId,P2,j);}function p1(i,j){var P2;if(!i&&j instanceof T){var Q2=j&&G.componentRegistry[j.getId()];var R2=Q2&&Q2.methods.getTitle;P2=R2&&R2();}else if(!i&&j&&j.title){P2=j.title;}P2=P2||j1();G.oShellServicePromise.then(function(S2){S2.setTitle(P2);}).catch(function(){l.warning("No ShellService available");});}function q1(i){var j=[G.oPagesDataLoadedObserver.getProcessFinished(true)];var P2=null;var Q2=X.iHashChangeCount;delete W.componentsDisplayed;var R2=-1;for(var S2 in G.componentRegistry){var T2=G.componentRegistry[S2];var U2=T2.oControllerUtils&&T2.oControllerUtils.oServices.oTemplateCapabilities.oMessageButtonHelper;var V2=X.componentsDisplayed[T2.route]===1;var W2=T2.utils.getTemplatePrivateModel();W2.setProperty("/generic/isActive",V2);if(V2){j.push(T2.oViewRenderedPromise);if(T2.viewLevel>R2){R2=T2.viewLevel;P2=T2.oComponent;}}else{T2.utils.suspendBinding();}if(U2){U2.setEnabled(V2);}}var X2=a(X.componentsDisplayed)||(G.oFlexibleColumnLayoutHandler&&G.oFlexibleColumnLayoutHandler.isAppTitlePrefered());p1(X2,i||P2);Promise.all(j).then(function(){if(Q2===X.iHashChangeCount&&a(Z)){G.oAppComponent.firePageDataLoaded();}});}var r1=q1.bind(null,null);t.testable(function(i){W=i;V.push(X);X={backTarget:0,componentsDisplayed:Object.create(null)};},"setCurrentIdentity");t.testable(function(i){K=i;},"setHistoryKey");function s1(){return W;}function t1(j,P2){if(Array.isArray(j)&&j.length<2){j=j[0];}if(Array.isArray(P2)&&P2.length<2){P2=P2[0];}if(Array.isArray(j)){if(Array.isArray(P2)){if(j.length===P2.length){j=j.sort();P2=P2.sort();return j.every(function(Q2,i){return Q2===P2[i];});}return false;}return false;}return P2===j;}function u1(i){if(!W||W.treeNode!==i.treeNode){return false;}for(var j=i.treeNode;j.level>0;j=G.mRoutingTree[j.parentRoute]){if(!j.noKey&&i.keys[j.level]!==W.keys[j.level]){return false;}}if(a(W.appStates)){return a(i.appStates);}var P2=e(Object.create(null),i.appStates,W.appStates);for(var Q2 in P2){var R2=(Q2===u)?K:i.appStates[Q2];if(!t1(R2,W.appStates[Q2])){return false;}}return true;}function v1(i,j,P2){var Q2=Object.create(null);for(var R2=i;R2.level>0;R2=G.mRoutingTree[R2.parentRoute]){if(!R2.noKey){Q2["keys"+R2.level]=j[R2.level];}}var S2=!a(P2);var T2=i.sRouteName+(S2?"query":"");if(S2){Q2["query"]=P2;}return{route:T2,parameters:Q2};}function w1(i){var j=v1(Y.identity.treeNode,Y.identity.keys,Y.identity.appStates);if(!G.ghostapp){I.oRouter.navTo(j.route,j.parameters,i);}}function x1(i){if(!i||!Y.identity){return;}var j=function(Q2,R2,S2){S2=R2?R2.getId():S2;var T2=G.componentRegistry[S2];(T2.methods.presetDisplayMode||Function.prototype)(i,Q2);};for(var P2=Y.identity.treeNode;P2;P2=P2.parentRoute&&G.mRoutingTree[P2.parentRoute]){if(P2.componentId){j(X.componentsDisplayed[P2.sRouteName]===1,null,P2.componentId);}else{P2.componentCreated.then(j.bind(null,false));}if(P2.fCLLevel===0||P2.fCLLevel===3){break;}}}function y1(i){var j;if(i){if(i.identity){i.identity.appStates[u]=K;}if(Y||(W&&W.preset)){if(i.identity){Y={identity:i.identity,followUpNeeded:true,mode:Y?Y.mode:0};x1(i.displayMode);}return;}if(i.identity&&u1(i.identity)){return;}j=i.mode;Y={identity:i.identity,mode:j};x1(i.displayMode);}else{j=1;}Y.followUpNeeded=Y.identity&&j<0;if(Y.identity||(j===-1&&X.backTarget)){G.oBusyHelper.setBusyReason("HashChange",!G.ghostapp);a1.stop();}else{Y=null;}if(j>=0){w2(Y.identity);w1(j===1);}else if(!G.ghostapp){window.history.go(j);}}function z1(i,j){i.text=((i.headerTitle!==j)&&j)||"";if($&&$.linkInfos.length>i.level){$.adjustNavigationHierarchy();}}function A1(i,j){var P2=Object.create(null);if(G.oFlexibleColumnLayoutHandler){G.oFlexibleColumnLayoutHandler.adaptBreadCrumbUrlParameters(P2,i);}var Q2={treeNode:i};var R2={treeNode:i,keys:W.keys.slice(0,i.level+1),appStates:P2};var S2;var T2=m1(R2).then(function(){var U2=v1(i,W.keys,P2);S2=I.oRouter.getURL(U2.route,U2.parameters);P2[u]=K;U2=v1(i,W.keys,P2);Q2.fullLink=I.oRouter.getURL(U2.route,U2.parameters);});j.push(T2);Q2.navigate=function(U2,V2){if(G.oFlexibleColumnLayoutHandler&&!V2){var W2;for(var X2=V[X.backTarget];X2.backTarget>0&&!W2;X2=V[X2.backTarget]){if(X2.identity.treeNode===i){W2=X2.identity;}}G.oFlexibleColumnLayoutHandler.adaptPreferredLayout(P2,i,W2);}G.oBusyHelper.setBusy(T2.then(function(){return M1(R2,false,U2);}));};Q2.adaptBreadCrumbLink=function(U2){T2.then(function(){var V2=H.getInstance();var W2=V2.hrefForAppSpecificHash?V2.hrefForAppSpecificHash(S2):"#/"+S2;U2.setHref(W2);});};return Q2;}function B1(i,j){var P2={title:j.treeNode.headerTitle||"",icon:j.treeNode.titleIconUrl||"",subtitle:j.treeNode.text,intent:i+j.fullLink};return P2;}function C1(){var j=[];var P2=[O];var Q2=G.oFlexibleColumnLayoutHandler&&G.oFlexibleColumnLayoutHandler.hasNavigationMenuSelfLink(W);for(var R2=Q2?W.treeNode:G.mRoutingTree[W.treeNode.parentRoute];R2;R2=G.mRoutingTree[R2.parentRoute]){var S2=A1(R2,P2);j[R2.level]=S2;}var T2=Promise.all(P2);var U2=function(){G.oShellServicePromise.then(function(V2){V2.setHierarchy([]);T2.then(function(W2){var X2=W2[0];var Y2=[];for(var i=j.length-1;i>=0;i--){Y2.push(B1(X2,j[i]));}V2.setHierarchy(Y2);});}).catch(function(){l.warning("No ShellService available");});};$={linkInfos:j,adjustNavigationHierarchy:U2};U2();}function D1(){return $.linkInfos;}function E1(i){var j=W;if(Y&&Y.identity&&!Y.followUpNeeded){W=Y.identity;}else{W=Object.create(null);var P2=i.getParameter("config");var Q2=v(P2.name);W.treeNode=G.mRoutingTree[Q2];var R2=i.getParameter("arguments");W.appStates=R2["?query"]||Object.create(null);W.keys=[""];for(var S2=W.treeNode;S2.level>0;S2=G.mRoutingTree[S2.parentRoute]){W.keys[S2.level]=S2.noKey?"":R2["keys"+S2.level];}}W.previousIdentity=j;W.componentsDisplayed=Object.create(null);W.componentsDisplayed[W.treeNode.sRouteName]=1;C1();}function F1(i,j){var P2=f1.getProcessFinished(true).then(function(){var Q2={identity:{treeNode:W.treeNode,keys:W.keys,appStates:e(Object.create(null),W.appStates)},mode:1};if(Array.isArray(j)&&j.length<2){j=j[0];}if(j){Q2.identity.appStates[i]=j;}else{delete Q2.identity.appStates[i];}y1(Q2);});G.oBusyHelper.setBusy(P2);return P2;}var G1;function H1(i,j,P2,Q2,R2){if(!i||(Array.isArray(i)&&i.length===0)){return f2(j);}var S2=Array.isArray(i)?i:[i];var T2=(S2.length===1&&(!W||W.treeNode.level>0))&&D.analyseContext(S2[0]);var U2=T2&&G.mEntityTree[T2.entitySet];var V2=U2&&(U2.level===1?["",T2.key]:G.oApplicationProxy.getIdentityKeyForContext(S2[0]));var W2=V2?Promise.resolve({treeNode:U2,keys:V2}):new Promise(function(Y2,Z2){var $2=0,_2;var a3=function(){if($2==S2.length){Y2(_2);}else{var b3=S2[$2];var c3=R1(_2,b3,true,true);c3.then(function(d3){$2++;_2=d3;a3();});}};a3();});var X2=W2.then(function(Y2){Y2.appStates=R2||Object.create(null);var Z2;if(Y2.treeNode.fCLLevel===0||Y2.treeNode.fCLLevel===3){Z2=m1(Y2);}else{Z2=G.oFlexibleColumnLayoutHandler.getAppStatesPromiseForNavigation(W,Y2);}if(!j&&Q2&&Q2.bIsCreate&&Q2.bIsDraft&&!Q2.bIsDraftModified){G1={index:V.length,path:i.getPath(),identity:Y2,displayMode:Y1()};}return Z2.then(function(){return M1(Y2,j,P2);});});G.oBusyHelper.setBusy(X2);return X2;}function I1(j){if(!G1||G1.path!==j.getPath()){return null;}var P2;var Q2=function(W2,i){return W2!==P2.identity.keys[i];};for(var i=G1.index+1;i<V.length;i++){P2=V[i];if(!P2.identity.treeNode||P2.identity.treeNode.level<G1.identity.treeNode.level||G1.identity.keys.some(Q2)){return null;}}var R2=0;for(var S2=X;S2.iHashChangeCount!==G1.index;S2=V[S2.backTarget]){if(S2.iHashChangeCount<G1.index){return null;}R2--;}var T2=V[G1.index].identity;var U2={treeNode:T2.treeNode,keys:T2.keys,appStates:Object.create(null)};var V2=y1.bind(null,{identity:U2,mode:R2,displayMode:G1.displayMode});if(T2.treeNode.fCLLevel===0||T2.treeNode.fCLLevel===3){e(U2.appStates,T2.appStates);return Promise.resolve(V2);}return G.oFlexibleColumnLayoutHandler.getSpecialDraftCancelPromise(W,T2,U2.appStates).then(function(){return V2;});}function J1(i,j){var P2=D.analyseContext(i);var Q2={keys:["",P2.key],appStates:Object.create(null)};var R2=a1.makeQueuable(M1.bind(null,Q2,true,j));if(W.treeNode.level===1){Q2.treeNode=W.treeNode;e(Q2.appStates,W.appStates);return Promise.resolve(R2);}var S2=G.oApplicationProxy.fillSiblingKeyPromise(W.treeNode,W.keys,Q2.keys);return S2.then(function(T2){Q2.treeNode=T2;if(T2===W.treeNode){e(Q2.appStates,W.appStates);return R2;}var U2=G.oFlexibleColumnLayoutHandler.getAppStatesPromiseForNavigation(W,Q2);return U2.then(function(){return R2;});});}function K1(i,j){if((i&&i.treeNode)!==j.treeNode){return Promise.resolve(false);}if(G.oFlexibleColumnLayoutHandler&&!G.oFlexibleColumnLayoutHandler.areIdentitiesLayoutEquivalent(i,j)){return Promise.resolve(false);}var P2=true;var Q2=i.treeNode.sRouteName;for(var R2=i.treeNode;R2.level>0;R2=G.mRoutingTree[R2.parentRoute]){var S2=R2.noKey||i.keys[R2.level]===j.keys[R2.level];if(!S2&&R2.noOData){return Promise.resolve(false);}P2=P2&&S2;if(R2.noOData){Q2=R2.parentRoute;}}if(P2){return Promise.resolve(true);}var T2=G.mRoutingTree[Q2];var U2=i.keys.slice(0,T2.level+1);var V2=j.keys.slice(0,T2.level+1);var W2=T2.getPath(2,U2);var X2=T2.getPath(2,V2);return G.oApplicationProxy.areTwoKnownPathesIdentical(W2,X2,T2.level===1,i,j);}function L1(i){var j=V[X.backTarget];var P2=-1;if(j&&(i.level===0||(G.oFlexibleColumnLayoutHandler&&i.fCLLevel===0))){for(;j.backTarget>0&&j.identity.treeNode&&j.identity.treeNode.level>i.level;P2--){j=V[j.backTarget];}}return j&&{candidateHash:j,candidateCount:P2};}function M1(i,j,P2){var Q2=L1(i.treeNode);var R2=K1(Q2&&Q2.candidateHash.identity,i);var S2=R2.then(function(T2){var U2=T2?Q2.candidateCount:(0+!!j);var V2={identity:i,mode:U2,displayMode:P2};y1(V2);});G.oBusyHelper.setBusy(S2);return S2;}function N1(){if(M){return f2(true);}var i=G.componentRegistry[W.treeNode.componentId];var j=i.utils.getTemplatePrivateModel();var P2=O1();m2({title:P2.dataLoadFailedTitle,text:P2.dataLoadFailedText,description:"",viewLevel:j.getProperty("/generic/viewLevel")});return Promise.resolve();}function O1(){return{dataLoadFailedTitle:G.getText("ST_ERROR"),dataLoadFailedText:G.getText("ST_GENERIC_ERROR_LOAD_DATA_TEXT")};}function P1(i,j,P2,Q2){if(!j){return{treeNode:G.mRoutingTree.root,key:""};}var R2=D.analyseContext(j);var S2=(i.level&&i.entitySet===R2.entitySet)?i:i.children.indexOf(R2.entitySet)>=0&&G.mEntityTree[R2.entitySet];if(S2){return{treeNode:S2,key:R2.key};}if(P2){var T2=G.oAppComponent.getModel();var U2=T2.getMetaModel();var V2=U2.getODataEntitySet(R2.entitySet);var W2=U2.getODataEntityType(V2.entityType);var X2;var Y2=i.children.some(function($2){S2=G.mEntityTree[$2];X2=S2.navigationProperty;if(!X2){return false;}var _2=U2.getODataAssociationEnd(W2,X2);return!!_2&&_2.multiplicity.endsWith("1");});if(Y2){return{treeNode:S2,navigationProperty:X2};}}if(Q2&&i.level>0){var Z2=G.mRoutingTree[i.parentRoute];return P1(Z2,j,P2,true);}}function Q1(i,j,P2,Q2){if(Q2.navigationProperty){return new Promise(function(S2,T2){var U2=P2.getModel();U2.createBindingContext(Q2.navigationProperty,P2,null,function(V2){var W2=V2&&Q1(i,j,V2,{treeNode:Q2.treeNode,key:D.analyseContext(V2).key});if(W2){W2.then(S2,T2);}else{T2();}});});}var R2=j.slice(0,Q2.treeNode.level);R2.push(Q2.key);return Promise.resolve({treeNode:Q2.treeNode,keys:R2});}function R1(i,j,P2,Q2){var R2=(i&&i.treeNode)||(W&&W.treeNode)||G.mRoutingTree.root;var S2=(i&&i.keys)||(W&&W.keys)||[""];var T2=P1(R2,j,P2,Q2);return T2?Q1(R2,S2,j,T2):Promise.reject();}function S1(i,j,P2){var Q2={treeNode:i,keys:P2||W.keys.slice(0,i.level+1),appStates:j};if(i.fCLLevel===0||i.fCLLevel===3){return m1(Q2);}return G.oFlexibleColumnLayoutHandler.getAppStatesPromiseForNavigation(W,Q2);}function T1(i){var j=R1({treeNode:G.mRoutingTree.root},i,false,true);var P2=j.then(function(Q2){Q2.appStates=Object.create(null);var R2;if(Q2.treeNode===W.treeNode){Object.assign(Q2.appStates,W.appStates);R2={identity:Q2,mode:1,displayMode:1};y1(R2);return null;}var S2=S1(Q2.treeNode,Q2.appStates);return S2.then(M1.bind(null,Q2,true,1));});G.oBusyHelper.setBusy(P2);return P2;}function U1(i){var j;var P2=0;for(j=X;j.backTarget>0&&(!j.identity||!j.identity.treeNode||j.identity.treeNode.level>i);P2++){j=V[j.backTarget];}if(!R&&(P2===0||!j.identity.treeNode||j.identity.treeNode.level>i)){window.history.go(-P2-1);return Promise.resolve();}var Q2=-P2||1;var R2=r2(i);var S2={treeNode:R2,keys:W.keys.slice(0,R2.level+1),appStates:Object.create(null)};var T2=S1(S2.treeNode,S2.appStates).then(function(){if(Q2<0&&(S2.treeNode.fCLLevel===1||S2.treeNode.fCLLevel===2)&&j.identity.treeNode===S2.treeNode){for(;j.backTarget>0&&!G.oFlexibleColumnLayoutHandler.areIdentitiesLayoutEquivalent(j.identity,S2);Q2--){j=V[j.backTarget];if(j.identity.treeNode!==S2.treeNode){break;}}}var U2={identity:S2,mode:Q2,displayMode:S2.treeNode.isDraft?6:1};y1(U2);});G.oBusyHelper.setBusy(T2);return T2;}var V1;function W1(i,j,P2,Q2){var R2=G.mEntityTree[i];var S2=G.componentRegistry[R2.componentId];var T2;if(j){var U2=q.createEmptyAppState(G.oAppComponent);U2.setData(j);U2.save();T2=U2.getKey();}var V2=W?W.keys.slice(0,R2.level):[""];V2.push("-");Q2=Q2||Object.create(null);var W2=S1(R2,Q2,V2);var X2=W2.then(function(){if(T2){Q2[A]=T2;}var Y2={treeNode:R2,keys:V2,appStates:Q2};V1=P2;if(u1(Y2)){var Z2={componentsDisplayed:X.componentsDisplayed,isNonDraftCreate:true};return s2("-",Z2,S2.oComponent);}else{var $2=!W||!!(S2&&S2.nonDraftCreateContext);return M1(Y2,$2,4);}});G.oBusyHelper.setBusy(X2);return X2;}function X1(i){var j=R1(null,i,false,false);var P2=j.then(function(Q2){Q2.appStates=Object.create(null);e(Q2.appStates,W.appStates);delete Q2.appStates[A];var R2={identity:Q2,mode:1};y1(R2);});G.oBusyHelper.setBusy(P2);return P2;}function Y1(){var i=G.componentRegistry[W.treeNode.componentId];var j=i.utils.getTemplatePrivateModel();var P2=j.getProperty("/objectPage/displayMode")||0;return P2;}function Z1(i,j,P2,Q2,R2){var S2=W.keys.slice(0,i.level);S2.push(j?P2:"");var T2=Object.create(null);var U2=S1(i,T2,S2);var V2=U2.then(function(){var W2={treeNode:i,keys:S2,appStates:T2};return M1(W2,Q2,R2);});G.oBusyHelper.setBusy(V2);return V2;}function $1(P2,Q2,R2,S2,T2){var U2;var V2=true;for(var i=0;i<P2.children.length&&!U2;i++){var W2=P2.children[i];var X2=G.mEntityTree[W2];if(X2[P2.level?"navigationProperty":"sRouteName"]===Q2){U2=X2.sRouteName;V2=!X2.noKey;}}var Y2=!U2&&R2&&P2.embeddedComponents[R2];if(Y2){for(var j=0;j<Y2.pages.length&&!U2;j++){var Z2=Y2.pages[j];if(Z2.navigationProperty===Q2){U2=P2.sRouteName+"/"+R2+"/"+Q2;V2=!(Z2.routingSpec&&Z2.routingSpec.noKey);}}}if(U2){var $2=G.mRoutingTree[U2];return Z1($2,V2,S2,T2,Y1());}return Promise.reject();}function _1(i,j,P2,Q2){var R2=R1({treeNode:i},j,true,false);var S2=R2.then(function(T2){T2.appStates=Object.create(null);var U2=S1(T2.treeNode,T2.appStates,T2.keys);return U2.then(M1.bind(null,T2,Q2,P2));});G.oBusyHelper.setBusy(S2);return S2;}function a2(){return!!Y;}function b2(i){l.info("Navigate back");if(X.backTarget&&N(o.getPreviousHash()||"")!==N(X.hash)){G.oBusyHelper.setBusyReason("HashChange",true);}X.LeaveByBack=!X.forwardingInfo;if(X.LeaveByBack){X.backSteps=i;}window.history.go(-i);}function c2(j,P2,Q2,R2){var S2=G.oAppComponent.getObjectPageHeaderType()==="Dynamic"&&G.oAppComponent.getObjectPageVariantManagement()==="VendorLayer";var T2;var U2=new U(window.location.href);if(U2.mParams["sap-ui-layer"]){var V2=U2.mParams["sap-ui-layer"];for(var i=0;i<V2.length;i++){if(V2[i].toUpperCase()==="VENDOR"){T2=true;break;}}}j=N(j||"");l.info("Navigate to hash: "+j);if(j===X.hash){l.info("Navigation suppressed since hash is the current hash");return;}X.targetHash=j;if(X.backTarget&&N(o.getPreviousHash()||"")===j){I.navigateBack();return;}var W2=W?W.treeNode.level:0;if(S2&&T2){if(!R2){if(!G.oFlexibleColumnLayoutHandler){g.clearVariantParameterInURL();}else{if(W2>=Q2){if(Q2===1){g.clearVariantParameterInURL();}else if(Q2===2){var X2;for(var Y2 in G.componentRegistry){if(G.componentRegistry[Y2].viewLevel===2){X2=G.componentRegistry[Y2];break;}}var Z2=X2.oController.byId("template::ObjectPage::ObjectPageVariant");g.clearVariantParameterInURL(Z2);}}}}}G.oBusyHelper.setBusyReason("HashChange",true);X.LeaveByReplace=P2;if(P2){I.oHashChanger.replaceHash(j);}else{I.oHashChanger.setHash(j);}}function d2(i,j,P2,Q2,R2,S2){var T2=j.then(function(U2){i=x(i,U2);if(R2){X.backwardingInfo={count:R2.count,index:R2.index,targetHash:N(i)};b2(R2.count);}else{c2(i,Q2,P2,S2);}return i;});G.oBusyHelper.setBusy(T2);return T2;}function e2(i,j,P2){var Q2=V[X.backTarget];return Q2&&Q2.hash&&N(Q2.hash.split("?")[0])===N(j)&&{count:1,index:X.backTarget};}function f2(i){if(W.treeNode.level===0){return Promise.resolve();}var j={treeNode:G.mRoutingTree["root"],keys:[""],appStates:Object.create(null)};var P2=m1(j);var Q2=P2.then(M1.bind(null,j,i));G.oBusyHelper.setBusy(Q2);return Q2;}function g2(j,P2){var Q2=X.componentsDisplayed;var R2=function(T2){var U2=G.componentRegistry[T2.getId()];(U2.methods.presetDisplayMode||Function.prototype)(P2,Q2[U2.route]===1);};for(var i=0;i<j.length;i++){var S2=j[i];S2.then(R2);}}function h2(i,j,P2,Q2,R2){var S2={};var T2=G.oFlexibleColumnLayoutHandler&&G.oFlexibleColumnLayoutHandler.getFCLAppStatesPromise(i,S2);var U2=o1(i,S2,j);var V2=(T2?Promise.all([T2,U2]):U2).then(w.bind(null,S2));var W2=e2(Q2,j,P2);var X2=d2(j,V2,P2,Q2,W2,R2);G.oBusyHelper.setBusy(X2);return X2;}function i2(j,P2,Q2,R2,S2){if(typeof j==="string"){var T2=j;var U2=N(T2);if(U2==="/"){return f2(Q2);}var V2=U2.split("/");var W2=V2.length-1;var X2=[];var Y2;switch(W2){case 1:Y2=V2[1].split("(")[0];break;default:Y2="";var Z2="";for(var i=0;i<W2;i++){var $2=V2[i+1];var _2=$2.indexOf("(");if(_2>0){$2=$2.substring(0,_2);}Y2=Y2+Z2+$2;Z2="/";}Y2=Y2.replace(r.getEmbeddedComponentsPatternDelimiter(),"/");}g2(X2,R2||0);return h2(Y2,T2,W2,Q2,S2);}return H1(j,Q2,R2);}function j2(i,j){X.componentsDisplayed[i]=j;var P2=G.mRoutingTree[i];var Q2=P2.componentId;if(Q2){var R2=G.componentRegistry[Q2];var S2=R2.utils.getTemplatePrivateModel();S2.setProperty("/generic/isActive",j===1);}}function k2(i){var j,P2,Q2,R2,S2,T2=null,U2,V2;if(i){j=i.entitySet;P2=i.text;T2=i.icon;V2=i.description;}if(j){U2=G.oAppComponent.getModel().getMetaModel();if(U2){Q2=U2.getODataEntitySet(j);R2=U2.getODataEntityType(Q2.entityType);S2=R2["com.sap.vocabularies.UI.v1.HeaderInfo"];}if(S2&&S2.TypeImageUrl&&S2.TypeImageUrl.String){T2=S2.TypeImageUrl.String;}}G.oTemplatePrivateGlobalModel.setProperty("/generic/messagePage",{text:P2,icon:T2,description:V2});if(G.oFlexibleColumnLayoutHandler){G.oFlexibleColumnLayoutHandler.displayMessagePage(i,X.componentsDisplayed);}else{var W2=I.oRouter.getTargets();W2.display("messagePage");for(var X2 in X.componentsDisplayed){j2(X2,5);}}q1(i);}function l2(){if(!a(Z)){var j=null;for(var i=0;!j;i++){j=Z[i];}Z={};k2(j);}}function m2(i){if(I.oTemplateContract.oFlexibleColumnLayoutHandler){i.viewLevel=i.viewLevel||0;Z[i.viewLevel]=i;var j=Promise.all([e1,I.oTemplateContract.oPagesDataLoadedObserver.getProcessFinished(true)]);j.then(l2);j.then(G.oBusyHelper.setBusyReason.bind(null,"HashChange",false));return;}k2(i);G.oBusyHelper.setBusyReason("HashChange",false);}function n2(){var i=[];var j=W.componentsDisplayed||X.componentsDisplayed;for(var P2 in G.componentRegistry){var Q2=G.componentRegistry[P2];if(j[Q2.route]===1){i.push(P2);}}return i;}function o2(){var i=[];for(var j in G.componentRegistry){i.push(j);}return i;}function p2(i){return W.keys.slice(0,i+1);}function q2(){var i=W.treeNode.componentId;var j=G.componentRegistry[i];var P2=!!j.nonDraftCreateContext;if(P2){var Q2=Object.assign({},X);Q2.isNonDraftCreate=P2;return Q2;}return X;}function r2(i){return G.oApplicationProxy.getAncestralNode(W.treeNode,i);}function s2(j,P2,Q2){var R2=Q2.getId();var S2=G.componentRegistry[R2];var T2=p2(S2.viewLevel);var U2=S2.route;var V2=P2.componentsDisplayed[U2];var W2=V2===1;var X2=function(b3){S2.sCurrentBindingPath=b3;var c3=function(){S2.utils.bindComponent(S2.sCurrentBindingPath,W2);if(R2===W.treeNode.componentId){for(var Y2=W.treeNode;Y2.level>0;Y2=G.mRoutingTree[Y2.parentRoute]){Y2.bindElement(G.oNavigationHost,null,true);if(Y2.contextTargets){for(var i=0;i<Y2.contextTargets.length;i++){var e3=Y2.contextTargets[i];Y2.bindElement(e3,null,false);}}}}S2.utils.refreshBinding();S2.oStatePreserverPromise.then(function(f3){f3.applyAppState(b3,W2);});return(S2.methods.onActivate||Function.prototype)(b3,W2);};var d3=S2.fnViewRegisteredResolve?S2.viewRegistered.then(c3):(c3()||Promise.resolve());return Promise.all([d3,S2.viewRegistered]).then(function(){S2.aKeys=T2;});};X.componentsDisplayed[U2]=1;if(P2.isNonDraftCreate&&j==="-"){var Y2=G.mRoutingTree[U2];var Z2=G.mRoutingTree[Y2.parentRoute];var $2=Z2.getPath(2,T2);var _2=G.oAppComponent.getModel();var a3=$2?new Promise(function(i){var b3={canonicalRequest:!G.bCreateRequestsCanonical};_2.createBindingContext($2,null,b3,i);}):Promise.resolve();return a3.then(function(i){var b3=i?Y2.navigationProperty:"/"+Q2.getEntitySet();var c3=W.appStates[A];var d3=c3?new Promise(function(e3){var f3=q.getAppState(G.oAppComponent,c3);f3.done(e3);f3.fail(e3.bind(null,null));}):Promise.resolve();return d3.then(function(e3){S2.nonDraftCreateContext=V1||S2.nonDraftCreateContext||f.createNonDraft(i,b3,_2,e3&&e3.getData(),G.oApplicationProxy.mustRequireRequestsCanonical());V1=null;return X2(S2.nonDraftCreateContext.getPath());});});}delete S2.nonDraftCreateContext;return X2(j);}function t2(i,j,P2){return s2(i,j,P2).then(r1);}function u2(i,j,P2){var Q2={};if(j||P2){var R2=i.level;for(var S2=0;S2<R2;S2++){Q2[S2]=G.oPaginatorInfo[S2];}}G.oPaginatorInfo=Q2;}function v2(i){return G.oApplicationProxy.getAlternativeIdentityPromise(i);}function w2(i){if(!L){return;}var j=G.oFlexibleColumnLayoutHandler;var P2=G.oTemplatePrivateGlobalModel;var Q2=G.mRoutingTree;var R2=["FE-VIEW-CREATED","FE-VIEW-CREATED-FIRSTTIMEONLY","FE-HEADER-LOADED-FIRSTTIMEONLY","FE-DATA-LOADED-FIRSTTIMEONLY"];p.setPlaceholder(i,j,P2,Q2,R2);}var x2=Object.create(null);function y2(i,j){if(x2[i.sRouteName]){return;}var P2=I.oRouter.getViews();var Q2=I.createHostView();var R2=Q2.getController();R2.setRouteName(i.sRouteName);var S2=L&&i.behaviour.getPlaceholderInfo();var T2=S2&&S2.getPlaceholderPage(Q2.getId());if(T2){T2.then(function(V2){var W2=Q2.byId("placeholderHost");W2.addPage(V2);W2.to(V2);});}x2[i.sRouteName]=Q2;P2.setView(i.sRouteName,Q2);var U2=Q2.byId("host");O2(U2,i.sRouteName,j);}function z2(i){var j=G.mRoutingTree;if(j&&j[i]){y2(j[i],true);}}function A2(i){a1.stop();f1.startProcess();E1(i);y2(W.treeNode);w2(W);W.treeNode.display();if(G.oFlexibleColumnLayoutHandler){_=G.oFlexibleColumnLayoutHandler.handleBeforeRouteMatched(W);}}function B2(){var i={isInitialNavigation:R,historicalEntries:[]};for(var j=X;j.iHashChangeCount>0;j=V[j.backTarget]){var P2=(j===X)?W:j.identity;var Q2=P2.treeNode&&{sRouteName:P2.treeNode.sRouteName,keys:P2.keys,appStates:P2.appStates};i.historicalEntries.push(Q2);}J.setData(i);J.save();var R2=W.appStates[u];if(R2===K||!(R2||X.backTarget||R)){return false;}y1({identity:{treeNode:W.treeNode,keys:W.keys,appStates:e(Object.create(null),W.appStates)},mode:1});return true;}function C2(){f1.stopProcess();if(Y&&Y.followUpNeeded&&Y.identity&&!u1(Y.identity)){y1();return;}G.oBusyHelper.setBusyReason("HashChange",false);var P2=W.treeNode.level;var Q2=N(I.oHashChanger.getHash()||"");l.info("Route matched with hash "+Q2);var R2;if(X.backwardingInfo){R2=X;R2.identity=W.previousIdentity;delete W.previousIdentity;V.push(R2);var S2=R2.iHashChangeCount+1;X={iHashChangeCount:S2,forwardingInfo:{bIsProgrammatic:true,bIsBack:true,iHashChangeCount:S2,targetHash:R2.backwardingInfo.targetHash,componentsDisplayed:R2.componentsDisplayed},backTarget:V[R2.backwardingInfo.index].backTarget,componentsDisplayed:Object.create(null)};}if(X.forwardingInfo&&X.forwardingInfo.targetHash&&X.forwardingInfo.targetHash!==Q2){X.hash=Q2;var T2=X.forwardingInfo.targetHash;delete X.forwardingInfo.targetHash;c2(T2,true);return;}var U2=false;for(var i=0;i<G.aStateChangers.length;i++){var V2=G.aStateChangers[i];if(V2.isStateChange(W.appStates)){U2=true;}}if(U2){Y=null;X.hash=Q2;if(!B2()){a1.start();}return;}G.oTemplatePrivateGlobalModel.setProperty("/generic/routeLevel",P2);var W2=X.forwardingInfo;delete X.forwardingInfo;if(!W2){W2={componentsDisplayed:X.componentsDisplayed,isNonDraftCreate:!W.treeNode.isDraft&&W.keys[W.treeNode.level]==="-"};var X2=X.iHashChangeCount;W2.iHashChangeCount=X2+1;var Y2=o.getDirection();if(Y){W2.bIsProgrammatic=!!Y.identity;W2.bIsBack=Y.mode<0;if(W2.bIsBack){X.backSteps=0-Y.mode;}W2.bIsForward=!W2.bIsBack&&(Y2===k.Forwards);X.LeaveByReplace=Y.mode===1;}else{W2.bIsProgrammatic=(Q2===X.targetHash);W2.bIsBack=!!(X.LeaveByBack||(!W2.bIsProgrammatic&&(Y2===k.Backwards)));W2.bIsForward=!W2.bIsBack&&(Y2===k.Forwards);X.LeaveByReplace=W2.bIsProgrammatic&&X.LeaveByReplace;if(!W2.bIsProgrammatic&&W.previousIdentity&&W.previousIdentity.treeNode.level>0&&!W.previousIdentity.treeNode.isDraft){var Z2=W2.isNonDraftCreate||W.treeNode!==W.previousIdentity.treeNode;for(var j=1;!Z2&&j<W.keys.length;j++){Z2=W.keys[j]!==W.previousIdentity.keys[j];}if(Z2){var $2=G.componentRegistry[W.previousIdentity.treeNode.componentId];var _2=$2.oComponent.getModel("ui");if(_2.getProperty("/editable")){$2.utils.cancelEdit();}}}}X.LeaveByBack=W2.bIsBack;R2=X;R2.identity=W.previousIdentity;delete W.previousIdentity;V.push(R2);X={iHashChangeCount:W2.iHashChangeCount,componentsDisplayed:Object.create(null)};if(R2.LeaveByReplace){X.backTarget=R2.backTarget;}else if(W2.bIsBack){var a3=R2.backTarget;for(var b3=R2.backSteps||1;b3>0;b3--){a3=V[a3].backTarget;}X.backTarget=a3;}else{X.backTarget=X2;}}Y=null;X.hash=Q2;var c3=function(d3){if(d3){var e3={identity:d3.identity,mode:1,displayMode:d3.displayMode};y1(e3);return;}if(B2()){return;}u2(W.treeNode,W2.bIsProgrammatic,W2.bIsBack);if(G.oFlexibleColumnLayoutHandler){e1=G.oFlexibleColumnLayoutHandler.handleRouteMatched(W2);}else{e1=W.treeNode.componentCreated.then(function(f3){return t2(W2.isNonDraftCreate?"-":W.treeNode.getPath(2,W.keys),W2,f3);});}G.oBusyHelper.setBusy(e1);e1.then(a1.start);};if(W2.bIsBack){G.oBusyHelper.setBusy(v2(W).then(c3));}else{c3();}}function D2(){var i=Promise.all([_,d1.then(function(){return G.oStatePreserversAvailablePromise;})]);var j=i.then(C2,G.oBusyHelper.setBusyReason.bind(null,"HashChange",false));G.oBusyHelper.setBusy(j);I2();}function E2(j){V.push(X);var P2;if(j){var Q2=j.getData();R=Q2.isInitialNavigation;for(var i=Q2.historicalEntries.length;i>0;i--){var R2=Q2.historicalEntries[i-1];P2={iHashChangeCount:V.length,backTarget:V.length-1};if(R2){P2.identity={treeNode:G.mRoutingTree[R2.sRouteName],keys:R2.keys,appStates:R2.appStates};}V.push(P2);}}else{P2={iHashChangeCount:1,backTarget:0,identity:W};V.push(P2);}b1(P2);D2();}var F2=E2.bind(null,null);function G2(i){if(M&&!V.length){var j=W.appStates[u];var P2=j&&q.getAppState(G.oAppComponent,j);if(P2){P2.done(E2);P2.fail(F2);}else{F2();}return;}D2();}function H2(){W={appStates:Object.create(null),keys:[]};m2({title:G.getText("ST_ERROR"),text:G.getText("ST_GENERIC_UNKNOWN_NAVIGATION_TARGET"),description:""});G.oBusyHelper.setBusyReason("HashChange",false);}function I2(){var i;for(var j=W.treeNode;j;j=i){var P2=j.componentId&&G.componentRegistry[j.componentId];if(P2){var Q2=P2.utils.getTemplatePrivateModel();Q2.setProperty("/generic/currentActiveChildContext",j.selectedPath);}i=G.mRoutingTree[j.parentRoute];if(i){i.selectedPath=j.getPath(3,W.keys);}}}I.oRouter.attachBeforeRouteMatched(A2);I.oRouter.attachRouteMatched(G2);I.oRouter.attachBypassed(H2);var J2=[];function K2(i,j){I[i]=j;J2.push(i);}function L2(){J2.forEach(function(i){I[i]=a1.makeQueuable(I[i]);});I.routerInitialized=Function.prototype;}function M2(i){d1=Promise.all([d1,i.componentCreated]);}function N2(i,j){for(var P2 in j){var Q2=j[P2];i.setModel(Q2,P2||undefined);}}function O2(i,j,P2){var Q2=G.mRoutingTree[j];var R2=Q2.page.component.name;var S2=Q2.entitySet;var T2=Q2.fCLLevel-(Q2.fCLLevel===3||!G.oFlexibleColumnLayoutHandler);var U2=T2<0?G.oNavigationObserver:G.aNavigationObservers[T2];var V2=new P();var W2=T2<0?G.oHeaderLoadingObserver:G.aHeaderLoadingObservers[T2];W2.addObserver(V2);var X2={};var Y2={appComponent:G.oAppComponent,isLeaf:!Q2.page.pages||!Q2.page.pages.length,entitySet:S2,navigationProperty:Q2.navigationProperty,componentData:{registryEntry:{oAppComponent:G.oAppComponent,route:j,routeConfig:Q2.page,viewLevel:Q2.level,routingSpec:Q2.page.routingSpec,oNavigationObserver:U2,oHeaderLoadingObserver:V2,preprocessorsData:X2}}};if(Q2.page.component.settings){e(Y2,Q2.page.component.settings);}G.oAppComponent.runAsOwner(function(){var Z2=sap.ui.core.Component.create({name:R2,settings:Y2,handleValidation:true,manifest:true});Z2.then(function($2){if(P2){N2(i,G.oAppComponent.oModels);i.setComponent($2);$2.onBeforeRendering();}else{i.setComponent($2);}});});}I.routerInitialized=L2;I.treeNodeFirstDisplay=M2;I.navigate=c2;K2("navigateBack",y1.bind(null,{mode:-1}));I.activateOneComponent=s2;I.afterActivation=r1;I.addUrlParameterInfoForRoute=o1;I.getApplicableStateForIdentityAddedPromise=m1;I.adaptAppStates=n1;I.setVisibilityOfRoute=j2;I.getActiveComponents=n2;I.getAllComponents=o2;I.getRootComponentPromise=i1;I.getActivationInfo=q2;I.getCurrentKeys=p2;I.getAppTitle=j1;I.getParsedShellHashFromFLP=k1;K2("navigateByExchangingQueryParam",F1);K2("navigateToSubContext",H1);I.getSwitchToSiblingPromise=J1;I.getSpecialDraftCancelPromise=I1;I.getCurrentIdentity=s1;K2("navigateToIdentity",M1);K2("navigateAfterActivation",T1);K2("navigateUpAfterDeletion",U1);K2("navigateForNonDraftCreate",W1);K2("adaptUrlAfterNonDraftCreateSaved",X1);K2("navigateToChild",$1);K2("navigateFromNodeAccordingToContext",_1);I.isNavigating=a2;I.getLinksToUpperLayers=D1;I.setTextForTreeNode=z1;K2("navigationContextNotFound",N1);I.clearHistory=a1.makeQueuable(h1);I.suspend=g1;I.restore=c1;I.prepareHostView=y2;I.preloadComponent=z2;I.navigateToMessagePage=m2;var O2=t.testable(O2,"createTemplateComponent");var k1=t.testable(k1,"getParsedShellHashFromFLP");var z2=t.testable(z2,"preloadComponent");t.testable(function(i){I.createHostView=i;},"setCreateHostView");t.testable(function(i){y2=i;},"setPrepareHostView");G.oBusyHelper.setBusy((k1()||Promise.resolve()).then(function(i){var j=i&&i.parseParameters(document.location.search);if(j&&j["sap-ui-xx-placeholder"]){L=j["sap-ui-xx-placeholder"][0];if(L==="FE-VIEW-CREATED"||L==="FE-VIEW-CREATED-FIRSTTIMEONLY"||L==="FE-DATA-LOADED"||L==="FE-DATA-LOADED-FIRSTTIMEONLY"||L==="FE-HEADER-LOADED"||L==="FE-HEADER-LOADED-FIRSTTIMEONLY"){G.oTemplatePrivateGlobalModel.setProperty("/generic/placeholderValue",L);}else{G.oTemplatePrivateGlobalModel.setProperty("/generic/placeholdersShown",Object.create(null));}}else{G.oTemplatePrivateGlobalModel.setProperty("/generic/placeholdersShown",Object.create(null));}return r.generateRoutingStructure(G).then(c1);}));return{navigateToRoot:a1.makeQueuable(f2),navigateToContext:a1.makeQueuable(i2),navigateToMessagePage:m2,navigateBack:function(){I.navigateBack();}};}function z(i,j){var R=j.oAppComponent.getRouter();var G={oAppComponent:j.oAppComponent,oRouter:R,oHashChanger:R.getHashChanger(),oTemplateContract:j};j.oNavigationControllerProxy=G;var I=new Promise(function(J){G.initialize=function(K){R.initialize(K);J();G.routerInitialized();};G.fnInitializationResolve=J;});j.oBusyHelper.setBusy(I);e(i,y(j,G));}var E=B.extend("sap.suite.ui.generic.template.lib.navigation.NavigationController",{metadata:{library:"sap.suite.ui.generic.template"},constructor:function(i){B.apply(this,arguments);t.testableStatic(z,"NavigationController")(this,i);}});E._sChanges="Changes";return E;});
