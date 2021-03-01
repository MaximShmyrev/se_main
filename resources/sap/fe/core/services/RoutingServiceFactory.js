sap.ui.define(["sap/ui/core/service/Service","sap/ui/core/service/ServiceFactory","sap/ui/core/Component","sap/ui/base/BindingParser","sap/fe/core/helpers/SemanticKeyHelper","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/base/Log","sap/ui/base/EventProvider","sap/fe/core/BusyLocker","sap/fe/core/helpers/ModelHelper","sap/fe/core/helpers/EditState","sap/fe/core/actions/messageHandling"],function(S,c,C,B,d,F,e,L,E,f,M,g,h){"use strict";var R=E.extend("sap.fe.core.services.RoutingServiceEventing",{metadata:{events:{"routeMatched":{},"afterRouteMatched":{}}}});var k=S.extend("sap.fe.core.services.RoutingService",{init:function(){var t=this;var o=this.getContext();if(o.scopeType==="component"){this.oAppComponent=o.scopeObject;this.oModel=this.oAppComponent.getModel();this.oMetaModel=this.oModel.getMetaModel();this.oRouter=this.oAppComponent.getRouter();this.oRouterProxy=this.oAppComponent.getRouterProxy();this.eventProvider=new R();var r=this.oAppComponent.getManifestEntry("/sap.ui5/routing");var a=this.oAppComponent.getManifestEntry("/sap.ui5/rootView");this._parseRoutingConfiguration(r,a);var A=this.oAppComponent.getManifestEntry("/sap.app");this.outbounds=A&&A.crossNavigation&&A.crossNavigation.outbounds;}this.initPromise=Promise.resolve(t);},exit:function(){this.eventProvider.fireEvent("routeMatched",{});this.eventProvider.destroy();},_parseRoutingConfiguration:function(r,o){var t=this,j=o&&o.viewName==="sap.fe.templates.RootContainer.view.Fcl";this._mTargets={};Object.keys(r.targets).forEach(function(T){t._mTargets[T]=Object.assign({targetName:T},r.targets[T]);if(t._mTargets[T].contextPattern!==undefined){t._mTargets[T].viewLevel=t._getViewLevelFromPattern(t._mTargets[T].contextPattern);}});this._mRoutes={};for(var s in r.routes){var l=r.routes[s],m=Array.isArray(l.target)?l.target:[l.target],n=Array.isArray(r.routes)?l.name:s,p=l.pattern;if(p.length<8||p.indexOf(":?query:")!==p.length-8){L.error("Pattern for route "+n+" doesn't end with '?:query:' : "+p);}var q=t._getViewLevelFromPattern(p);t._mRoutes[n]={name:n,pattern:p,targets:m,routeLevel:q};for(var i=0;i<m.length;i++){var P=t._mTargets[m[i]].parent;if(P){m.push(P);}}if(!j){if(t._mTargets[m[0]].viewLevel===undefined||t._mTargets[m[0]].viewLevel<q){t._mTargets[m[0]].viewLevel=q;}t._mTargets[m[0]].FCLLevel=-1;}else if(m.length===1&&t._mTargets[m[0]].controlAggregation!=="beginColumnPages"){t._mTargets[m[0]].FCLLevel=3;}else{m.forEach(function(T){switch(t._mTargets[T].controlAggregation){case"beginColumnPages":t._mTargets[T].FCLLevel=0;break;case"midColumnPages":t._mTargets[T].FCLLevel=1;break;default:t._mTargets[T].FCLLevel=2;}});}}Object.keys(t._mTargets).forEach(function(T){while(t._mTargets[T].parent){var P=t._mTargets[T].parent;t._mTargets[P].viewLevel=t._mTargets[P].viewLevel||t._mTargets[T].viewLevel;t._mTargets[P].contextPattern=t._mTargets[P].contextPattern||t._mTargets[T].contextPattern;t._mTargets[P].FCLLevel=t._mTargets[P].FCLLevel||t._mTargets[T].FCLLevel;t._mTargets[P].controlAggregation=t._mTargets[P].controlAggregation||t._mTargets[T].controlAggregation;T=P;}});var u=[],v=[],D;for(var N in t._mRoutes){var w=t._mRoutes[N].routeLevel;if(w===0){u.push(N);}else if(w===1){v.push(N);}}if(u.length===1){D=u[0];}else if(v.length===1){D=v[0];}if(D){var x=t._mRoutes[D].targets.slice(-1)[0];t.sRootEntitySet="";if(t._mTargets[x].options&&t._mTargets[x].options.settings){t.sRootEntitySet=t._mTargets[x].options.settings.entitySet;}if(!t.sRootEntitySet){L.error("Cannot determine default entitySet: entitySet missing in default target: "+x);}}else{L.error("Cannot determine default entitySet: no default route found.");}Object.keys(t._mTargets).map(function(T){return t._mTargets[T];}).sort(function(a,b){return a.viewLevel<b.viewLevel?-1:1;}).forEach(function(a){if(a.options){var b=a.options.settings;if(!b.fullContextPath){if(a.viewLevel===0||a.viewLevel===undefined){b.fullContextPath="/";}else{b.fullContextPath="/"+b.entitySet+"/";}}Object.keys(b.navigation||{}).forEach(function(y){var z=t._mRoutes[b.navigation[y].detail.route];if(z&&z.targets){z.targets.forEach(function(T){if(t._mTargets[T].options&&t._mTargets[T].options.settings&&!t._mTargets[T].options.settings.fullContextPath){t._mTargets[T].options.settings.fullContextPath=b.fullContextPath+y+"/";}});}});}});},_getViewLevelFromPattern:function(p){p=p.replace(":?query:","");if(p&&p[0]!=="/"&&p[0]!=="?"){p="/"+p;}return p.split("/").length-1;},_getRouteInformation:function(r){return this._mRoutes[r];},_getTargetInformation:function(t){return this._mTargets[t];},_getComponentId:function(o,s){if(s.indexOf(o+"---")===0){return s.substr(o.length+3);}return s;},getTargetInformationFor:function(o){var t=this._getComponentId(o._sOwnerId,o.getId());var a=this;var s=null;Object.keys(this._mTargets).forEach(function(T){if(a._mTargets[T].id===t||a._mTargets[T].viewId===t){s=T;}});return this._getTargetInformation(s);},getLastSemanticMapping:function(){return this.oLastSemanticMapping;},setLastSemanticMapping:function(m){this.oLastSemanticMapping=m;},navigateTo:function(o,r,p,P){var t;if(!p){t=d.getSemanticPath(o);}else{var m=this.prepareParameters(p,r,o);t=this.oRouter.getURL(r,m);}this.oRouterProxy.navToHash(t,P);},prepareParameters:function(p,t,o){var P;try{var s=o.getPath();var a=s.split("/");P=Object.keys(p).reduce(function(r,i){var j=p[i];var l=B.complexParser(j);var m=l.parts||[l];var n=m.map(function(q){var u=q.path.split("../");var v=a.slice(0,a.length-u.length+1);v.push(u[u.length-1]);return o.getObject(v.join("/"));});if(l.formatter){r[i]=l.formatter.apply(this,n);}else{r[i]=n.join("");}return r;},{});}catch(b){L.error("Could not parse the parameters for the navigation to route "+t);P=undefined;}return P;},navigateToContext:function(o,p,v,a){var t,r=null;if(p.targetPath&&v&&v.navigation){var b=v.navigation[p.targetPath].detail;t=b.route;if(b.parameters){r=this.prepareParameters(b.parameters,t,o);}}var T=this._getPathFromContext(o,p);if(T.length===0&&this.bExitOnNavigateBackToRoot){return this.oRouterProxy.exitFromApp();}if(p.asyncContext||p.bDeferredContext){T+="(...)";}var l=this._calculateLayout(T,p);if(l){T+="?layout="+l;}var n={oAsyncContext:p.asyncContext,bDeferredContext:p.bDeferredContext,bTargetEditable:p.editable,bPersistOPScroll:p.bPersistOPScroll,useContext:p.updateFCLLevel===-1||p.bRecreateContext?undefined:o};if(p.checkNoHashChange){var s=this.oRouterProxy.getHash().replace(/[&?]{1}sap-iapp-state=[A-Z0-9]+/,"");if(T===s){var m=this.oRouter.getRouteInfoByHash(this.oRouterProxy.getHash());m.navigationInfo=n;m.routeInformation=this._getRouteInformation(this.sCurrentRouteName);m.routePattern=this.sCurrentRoutePattern;m.views=this.aCurrentViews;this.oRouterProxy.storeFocusForHash(0,null,this.oRouterProxy.getHash());this.eventProvider.fireEvent("routeMatched",m);this.eventProvider.fireEvent("afterRouteMatched",m);return Promise.resolve();}}if(p.transient&&p.editable==true&&T.indexOf("(...)")===-1){if(T.indexOf("?")>-1){T+="&i-action=create";}else{T+="?i-action=create";}}if(a&&a.name==="sap.fe.templates.ListReport"){var i=this.oRouter.getRouteInfoByHash(T);if(i){var j=this._getRouteInformation(i.name);if(j&&j.targets&&j.targets.length>0){var q=j.targets[j.targets.length-1];var u=this._getTargetInformation(q);if(u&&u.name==="sap.fe.templates.ObjectPage"){h.removeUnboundTransitionMessages();}}}}this.navigationInfoQueue.push(n);if(t&&r!=null){this.oRouter.navTo(t,r);return Promise.resolve();}else{return this.oRouterProxy.navToHash(T,false,p.noPreservationCache);}},isCurrentStateImpactedBy:function(o){var p=o.getPath();if(this.oRouterProxy.isCurrentStateImpactedBy(p)){return true;}else if(/^[^\(\)]+\([^\(\)]+\)$/.test(p)){var s;if(this.oLastSemanticMapping&&this.oLastSemanticMapping.technicalPath===p){s=this.oLastSemanticMapping.semanticPath;}else{s=d.getSemanticPath(o);}return s!=p?this.oRouterProxy.isCurrentStateImpactedBy(s):false;}else{return false;}},_getPathFromContext:function(o,p){var P;if(o.isA("sap.ui.model.odata.v4.ODataListBinding")&&o.isRelative()){P=o.getHeaderContext().getPath();}else{P=o.getPath();}if(p.updateFCLLevel===-1){var r=new RegExp("/[^/]*$");P=P.replace(r,"");if(this.oLastSemanticMapping&&this.oLastSemanticMapping.technicalPath===P){P=this.oLastSemanticMapping.semanticPath;}}else if(M.isDraftSupported(o)){var s=d.getSemanticPath(o);if(s!==P){this.oLastSemanticMapping={technicalPath:P,semanticPath:s};P=s;}}if(P[0]==="/"){P=P.substring(1);}return P;},_calculateLayout:function(p,P){var a=P.FCLLevel;if(P.updateFCLLevel){a+=P.updateFCLLevel;if(a<0){a=0;}}return this.oAppComponent.getRootViewController().calculateLayout(a,p,P.sLayout);},_onRouteMatched:function(o){var a=this.oAppComponent.getAppStateHandler(),t=this;var p=o.getParameters();if(this.navigationInfoQueue.length){p.navigationInfo=this.navigationInfoQueue[0];this.navigationInfoQueue=this.navigationInfoQueue.slice(1);}else{p.navigationInfo={};}if(a.checkIfRouteChangedByIApp()){p.navigationInfo.bReasonIsIappState=true;a.resetRouteChangedByIApp();}this.sCurrentRouteName=o.getParameter("name");this.sCurrentRoutePattern=o.getParameters().config.pattern;this.aCurrentViews=o.getParameter("views");p.routeInformation=this._getRouteInformation(this.sCurrentRouteName);p.routePattern=this.sCurrentRoutePattern;this.eventProvider.fireEvent("routeMatched",p);this.eventProvider.fireEvent("afterRouteMatched",p);g.cleanProcessedEditState();if(!history.state||history.state.feLevel===undefined){this.oRouterProxy.restoreHistory().then(function(){t.oRouterProxy.resolveRouteMatch();}).catch(function(b){L.error("Error while restoring history",b);});}else{this.oRouterProxy.resolveRouteMatch();}},attachRouteMatched:function(D,a,l){this.eventProvider.attachEvent("routeMatched",D,a,l);},detachRouteMatched:function(a,l){this.eventProvider.detachEvent("routeMatched",a,l);},attachAfterRouteMatched:function(D,a,l){this.eventProvider.attachEvent("afterRouteMatched",D,a,l);},detachAfterRouteMatched:function(a,l){this.eventProvider.detachEvent("afterRouteMatched",a,l);},getRouteFromHash:function(r,a){var H=r.getHashChanger().hash;var o=r.getRouteInfoByHash(H);return a.getMetadata().getManifestEntry("/sap.ui5/routing/routes").filter(function(b){return b.name===o.name;})[0];},getTargetsFromRoute:function(r,a){var t=r.target;var b=this;if(typeof t==="string"){return[this._mTargets[t]];}else{var T=[];t.forEach(function(s){T.push(b._mTargets[s]);});return T;}},initializeRouting:function(){var t=this;this.oRouter.attachRouteMatched(this._onRouteMatched.bind(this));this.navigationInfoQueue=[];g.resetEditState();this.bExitOnNavigateBackToRoot=false;var i=t.oRouter.getHashChanger().getHash().indexOf("sap-iapp-state")!==-1,o=t.oAppComponent.getComponentData(),s=o&&o.startupParameters,H=s!==undefined&&Object.keys(s).length!==0,a=Promise.resolve();if(!i&&H){var b=t.oRouter.getHashChanger().getHash();if(s.preferredMode&&s.preferredMode[0]==="create"&&!b){a=t._managePreferredModeCreateStartup();}else{a=t._manageDeeplinkStartup(s);}}return a;},getDefaultCreateHash:function(){var H=this.getRootEntitySet()+"(...)";if(this.oRouter.getRouteInfoByHash(H)){return H;}else{throw new Error("No route match for creating a new "+this.getRootEntitySet());}},_managePreferredModeCreateStartup:function(){var t=this;return this.oMetaModel.requestObject("/"+this.getRootEntitySet()+"@").then(function(o){var m,b=true;if(o["@com.sap.vocabularies.Common.v1.DraftRoot"]&&o["@com.sap.vocabularies.Common.v1.DraftRoot"]["NewAction"]){m="/"+t.getRootEntitySet()+"@com.sap.vocabularies.Common.v1.DraftRoot/NewAction@Org.OData.Core.V1.OperationAvailable";}else if(o["@com.sap.vocabularies.Session.v1.StickySessionSupported"]&&o["@com.sap.vocabularies.Session.v1.StickySessionSupported"]["NewAction"]){m="/"+t.getRootEntitySet()+"@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction@Org.OData.Core.V1.OperationAvailable";}if(m){var n=t.oMetaModel.getObject(m);if(n===false){b=false;}}else{var i=o["@Org.OData.Capabilities.V1.InsertRestrictions"];if(i&&i.Insertable===false){b=false;}}if(b){var p=t.getDefaultCreateHash();t.oRouter.getHashChanger().replaceHash(p);t.bExitOnNavigateBackToRoot=true;}}).catch(function(){L.error("Cannot fetch the Annotations");});},_manageDeeplinkStartup:function(s){var t=this,a;return this.oMetaModel.requestObject("/$EntityContainer/").then(function(){var l=t._getNavigablePages(t.oAppComponent.getManifest()["sap.ui5"].routing);a=t._findTargetPagesFromStartupParams(l,s);var b=a.map(function(p){var o,i;if(p.isSemanticKeyNavigation){o=t._createFilter(p.draft,p.semanticKeys,s);}else{o=t._createFilter(p.draft,p.technicalKeys,s);}i=t.oModel.bindList("/"+p.entitySet,undefined,undefined,o);return i.requestContexts(0,2);});return Promise.all(b);}).then(function(v){if(v.length){var b=[];v.forEach(function(i){if(i.length===1){b.push(i[0]);}});if(b.length===v.length&&!t.oRouter.getHashChanger().getHash()){var H=t._buildStartupHash(a,b);if(H){t.oRouter.getHashChanger().replaceHash(H);}}}}).catch(function(b){L.info("Could not find results for list bind: "+b);});},_getNavigablePages:function(r){var a=r.routes,t=r.targets,p={};for(var i=0;i<a.length;i++){var P={},s=a[i].pattern,T=a[i].target,l=s.split("/").length-1;P["pattern"]=s;if(s===":?query:"||s===""){continue;}if(l===1&&s.split("/")[l]===":?query:"){l=0;}P["level"]=l;if(Array.isArray(T)){P["target"]=T[T.length-1];}else{P["target"]=T;}if(t[P.target].options&&t[P.target].options.settings){P["allowDeepLinking"]=t[P.target].options.settings.allowDeepLinking;P["entitySet"]=t[P.target].options.settings.entitySet;}if(!P["allowDeepLinking"]&&P["level"]!==0){continue;}else if(!p[P.level]){p[P.level]=[];}p[P.level].push(P);}return p;},_findTargetPagesFromStartupParams:function(p,s){var l=0,r=[],b=true;while(b&&l in p){var o=p[l];b=false;for(var i=0;i<o.length;++i){var O=o[i];if(!O.entitySet&&O.level===0){O.entitySet=this.getRootEntitySet();}if(!O.entitySet){continue;}O.entityType=this.oMetaModel.getObject("/$EntityContainer/"+O.entitySet+"/");O.draft=this.oMetaModel.getObject("/$EntityContainer/"+O.entitySet+"@com.sap.vocabularies.Common.v1.DraftRoot")||this.oMetaModel.getObject("/$EntityContainer/"+O.entitySet+"@com.sap.vocabularies.Common.v1.DraftNode");O.technicalKeys=O.entityType["$Key"];O.semanticKeys=this.oMetaModel.getObject("/$EntityContainer/"+O.entitySet+"/@com.sap.vocabularies.Common.v1.SemanticKey");if(this._checkForKeys(O.semanticKeys,s)){O.isSemanticKeyNavigation=true;r.push(O);b=true;break;}else if(O.level===0&&this._checkForKeys(O.technicalKeys,s)){O.isSemanticKeyNavigation=false;r.push(O);b=true;break;}}++l;}return r;},_createFilter:function(D,K,s){var a=[];for(var j=0;j<K.length;j++){var p=K[j].$PropertyPath;if(!p){p=K[j];if(p==="IsActiveEntity"){D=false;}}var v=s[p][0];if(v){a.push(new F(p,e.EQ,v));}else{return undefined;}}if(D){var o=new F({filters:[new F("IsActiveEntity","EQ",false),new F("SiblingEntity/IsActiveEntity","EQ",null)],and:false});a.push(o);}var b=new F(a,true);return b;},_checkForKeys:function(K,p){if(K&&K.length){for(var j=0;j<K.length;j++){var P=K[j].$PropertyPath;if(!P){P=K[j];}var a=p[P];if(!a||(a&&a.length>1)){return false;}}return true;}return false;},_buildStartupHash:function(r,a){var H;if(a.length===1){var t=a[0].getPath(),s=d.getSemanticPath(a[0]);if(s!==t){this.oLastSemanticMapping={technicalPath:t,semanticPath:s};}H=s.substring(1);}else if(a.length>1){var p=r[r.length-1].pattern.split("/");H=p.map(function(P,i){var K=P.split("(")[0];var v=a[i].getPath().split("(")[1];return K+"("+v;}).join("/");}return H;},getOutbounds:function(){return this.outbounds;},getRootEntitySet:function(){return this.sRootEntitySet;}});return c.extend("sap.fe.core.services.RoutingServiceFactory",{createInstance:function(s){var r=new k(s);return r.initPromise;}});},true);
