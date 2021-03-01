// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/_CommonDataModel/PersonalizationProcessor","sap/base/util/ObjectPath","sap/ui/thirdparty/jquery","sap/base/util/isPlainObject","sap/ushell/services/_CommonDataModel/SiteConverter","sap/base/util/isEmptyObject","sap/base/util/deepClone","sap/base/util/Version","sap/ushell/Config","sap/base/util/includes","sap/base/util/values","sap/ushell/library","sap/ushell/adapters/cdm/v3/_LaunchPage/readApplications"],function(P,O,q,a,S,b,d,V,C,c,e,u,r){"use strict";var D=u.DisplayFormat;var f="sap.ushell.services.CommonDataModel",g={"STATIC_LAUNCHER":"sap.ushell.StaticAppLauncher","DYNAMIC_LAUNCHER":"sap.ushell.DynamicAppLauncher","CARD":"sap.ushell.Card"};function h(A,o,p,s){var i=new q.Deferred();this._oAdapter=A;this._oPersonalizationProcessor=new P();this._oSiteDeferred=i;this._oOriginalSite={};this._oPersonalizedSite={};this._oContentProviderIndex={};this._oSiteConverter=new S();this._oPersonalizationDeltas={};this._oGetSitePromise=A.getSite().then(this._loadAndApplyPersonalization.bind(this)).fail(i.reject);}h.prototype._loadAndApplyPersonalization=function(s){this._oOriginalSite=q.extend(true,{},s);var o=new V(s._version);if(o.compareTo("3.1.0")<0){this._oAdapter.getPersonalization(o).then(function(p){if(p){this._oPersonalizationDeltas=d(p);}else{this._oPersonalizationDeltas={version:"3.0.0",_version:"3.0.0"};}this._triggerMixinPersonalisationInSite(s,p);}.bind(this)).fail(this._oSiteDeferred.reject);}else{this._oPersonalizedPages={};this._oOriginalSite=this._ensureStandardVizTypesPresent(this._oOriginalSite);this._oOriginalSite=this._ensureProperDisplayFormats(this._oOriginalSite);this._oSiteDeferred.resolve(this._oOriginalSite);}};h.prototype._applyPagePersonalization=function(p,o){var s=p.identification.id;if(Object.keys(o).length){var i=o.classicHomePage;if(i&&i.version==="3.1.0"){Object.keys(i).forEach(function(m){if(!o[m]){o[m]=i[m];}});delete o.classicHomePage;o._version=o.version;}var v=new V(o._version||o.version);if(v.compareTo("3.1.0")<0){o={classicHomePage:o,_version:"3.1.0",version:"3.1.0"};}}this._oPersonalizationDeltas=o;var j=o[s]||{};var k=this._oSiteConverter.convertTo("3.0.0",d(p,20));return this._triggerMixinPersonalisationInSite(k,j).then(function(m){this._oPersonalizedPages[s]=this._oSiteConverter.convertTo("3.1.0",d(m,20));return this._oPersonalizedPages[s];}.bind(this));};h.prototype._triggerMixinPersonalisationInSite=function(s,p){return new Promise(function(i,j){this._oPersonalizationProcessor.mixinPersonalization(s,p).done(function(o){this._oPersonalizedSite=this._ensureCompleteSite(o);this._oPersonalizedSite=this._ensureGroupsOrder(this._oPersonalizedSite);this._oPersonalizedSite=this._ensureStandardVizTypesPresent(this._oPersonalizedSite);this._oPersonalizedSite=this._ensureProperDisplayFormats(this._oPersonalizedSite);this._oSiteDeferred.resolve(this._oPersonalizedSite);i(this._oPersonalizedSite);}.bind(this)).fail(function(m){this._oSiteDeferred.reject(m);j();}.bind(this));}.bind(this));};h.prototype.getHomepageGroups=function(){var o=new q.Deferred();this._oSiteDeferred.then(function(s){var G=(s&&s.site&&s.site.payload&&s.site.payload.groupsOrder)?s.site.payload.groupsOrder:[];o.resolve(G);});return o.promise();};h.prototype.getGroups=function(){var o=new q.Deferred();this._oSiteDeferred.then(function(s){var G=[];Object.keys(s.groups).forEach(function(k){G.push(s.groups[k]);});o.resolve(G);});return o.promise();};h.prototype.getGroup=function(i){var o=new q.Deferred();this._oSiteDeferred.then(function(s){var G=s.groups[i];if(G){o.resolve(G);}else{o.reject("Group "+i+" not found");}});return o.promise();};h.prototype.getSite=function(){return this._oSiteDeferred.promise();};h.prototype.getPage=function(p){return new Promise(function(i,j){var E=C.last("/core/shell/enablePersonalization");Promise.resolve(this._oGetSitePromise).then(function(){if(E&&this._oPersonalizedPages[p]){i(this._oPersonalizedPages[p]);return;}if(!E){i(this._getPageFromAdapter(p));return;}Promise.all([this._getPageFromAdapter(p),this._oAdapter.getPersonalization(this._oOriginalSite._version)]).then(function(k){this._applyPagePersonalization(k[0],k[1]).then(i).catch(function(){j("Personalization Processor: Cannot mixin the personalization.");});}.bind(this)).catch(function(){j("CommonDataModel Service: Cannot get page "+p);});}.bind(this)).catch(j);}.bind(this));};h.prototype._getPageFromAdapter=function(p){if(!this._oAdapter.getPage){return Promise.resolve(d(this._oOriginalSite.pages[p],20));}return this._oAdapter.getPage(p).then(function(o){this._oOriginalSite.pages[p]=o;return d(o,20);}.bind(this));};h.prototype._filterForProperPages=function(p){return p.filter(function(o){return!!o;});};h.prototype.getPages=function(p){return new Promise(function(i,j){var E=C.last("/core/shell/enablePersonalization");Promise.resolve(this._oGetSitePromise).then(function(){if(!E){this._getPagesFromAdapter(p).then(function(o){i(this._filterForProperPages(e(o)));}.bind(this));}else{Promise.all([this._getPagesFromAdapter(p),this._oAdapter.getPersonalization(this._oOriginalSite._version)]).then(function(k){var o=k[0];var m=Promise.all(Object.keys(o).map(function(s){if(this._oPersonalizedPages[s]){return Promise.resolve(this._oPersonalizedPages[s]);}return this._applyPagePersonalization(o[s],k[1]).catch(function(){j("Personalization Processor: Cannot mixin the personalization.");});}.bind(this)));m.then(function(n){i(this._filterForProperPages(n));}.bind(this));}.bind(this)).catch(function(){j("CommonDataModel Service: Cannot get pages");});}}.bind(this)).catch(j);}.bind(this));};h.prototype._getPagesFromAdapter=function(p){if(!this._oAdapter.getPages){var o={};for(var s in this._oOriginalSite.pages){if(c(p,this._oOriginalSite.pages[s].identification.id)){o[s]=this._oOriginalSite.pages[s];}}return Promise.resolve(d(o,20));}return this._oAdapter.getPages(p).then(function(i){Object.keys(i).forEach(function(s){this._oOriginalSite.pages[s]=i[s];}.bind(this));return d(i,20);}.bind(this));};h.prototype.getAllPages=function(){return sap.ushell.Container.getServiceAsync("Menu").then(function(m){return m.getSpacesPagesHierarchy();}).then(function(H){var p=[];H.spaces.forEach(function(s){s.pages.forEach(function(o){if(p.indexOf(o.id)===-1){p.push(o.id);}});});return this.getPages(p);}.bind(this));};h.prototype.getApplications=function(){return new Promise(function(i,j){this._oSiteDeferred.then(function(s){var A=s.applications;if(A){i(A);}else{j("CDM applications not found.");}}).fail(j);}.bind(this));};h.prototype.getVizTypes=function(){return new Promise(function(i,j){this._oSiteDeferred.then(function(s){var v=s.vizTypes;if(v){i(v);}else{j("CDM vizTypes not found.");}}).fail(j);}.bind(this));};h.prototype.getVisualizations=function(){return new Promise(function(i,j){this._oSiteDeferred.then(function(s){var v=s.visualizations;if(v){i(v);}else{j("CDM visualizations not found.");}}).fail(j);}.bind(this));};h.prototype.getGroupFromOriginalSite=function(G){var o=new q.Deferred();if(typeof G==="string"&&this._oOriginalSite&&this._oOriginalSite.groups&&this._oOriginalSite.groups[G]){o.resolve(q.extend(true,{},this._oOriginalSite.groups[G]));}else{o.reject("Group does not exist in original site.");}return o.promise();};h.prototype.getOriginalPage=function(p){return d(this._oOriginalSite.pages[p],20);};h.prototype.save=function(p){var o=new q.Deferred(),i,j;if(this._oOriginalSite._version==="3.1.0"){if(!p){return o.reject("No page id was provided").promise();}j=this._oSiteConverter.convertTo("3.0.0",this._oOriginalSite.pages[p]);i=this._oSiteConverter.convertTo("3.0.0",this._oPersonalizedPages[p]);}else{j=this._oOriginalSite;i=this._oPersonalizedSite;}this._oPersonalizationProcessor.extractPersonalization(d(i,20),d(j,20)).done(function(E){if(!b(E)){if(this._oPersonalizationDeltas.version===undefined||this._oPersonalizationDeltas._version===undefined){this._oPersonalizationDeltas.version=this._oOriginalSite._version;this._oPersonalizationDeltas._version=this._oOriginalSite._version;}if(p){this._oPersonalizationDeltas[p]=E;}else{this._oPersonalizationDeltas=E;}this._setPersonalization(this._oPersonalizationDeltas).then(o.resolve).catch(o.reject);}else{o.resolve();}}.bind(this)).fail(function(){o.reject("Personalization Processor: Cannot extract personalization.");});return o.promise();};h.prototype._setPersonalization=function(i,p){if(this._oPendingPersonalizationDeferred){if(!this._oNextPersonalizationQuery){this._oNextPersonalizationQuery={fnNextCall:null,aPromiseResolvers:[]};}return new Promise(function(j,k){this._oNextPersonalizationQuery.fnNextCall=this._setPersonalization.bind(this,i,p);this._oNextPersonalizationQuery.aPromiseResolvers.push({resolve:j,reject:k});}.bind(this));}this._oPendingPersonalizationDeferred=this._oAdapter.setPersonalization(i,p);return new Promise(function(j,k){this._oPendingPersonalizationDeferred.then(j).fail(k).always(function(){delete this._oPendingPersonalizationDeferred;if(this._oNextPersonalizationQuery){var n=this._oNextPersonalizationQuery.fnNextCall();this._cleanupPersonalizationQueuePromises(n,this._oNextPersonalizationQuery.aPromiseResolvers);delete this._oNextPersonalizationQuery;}}.bind(this));}.bind(this));};h.prototype._cleanupPersonalizationQueuePromises=function(n,i){i.forEach(function(p){n.then(p.resolve).catch(p.reject);});};function l(){var p=sap.ushell.Container.getService("PluginManager");return p.loadPlugins("ContentProvider");}h.prototype._getUnreferencedCatalogApplications=function(E){var U={};var A=Object.keys(E.applications).map(function(s){return E.applications[s]["sap.app"].id;}).reduce(function(i,s){i[s]=true;return i;},{});var o=E.catalogs;Object.keys(o).forEach(function(s){var i=o[s].payload.appDescriptors;i.map(function(j){return j.id;}).filter(function(j){return!A[j];}).forEach(function(B){if(!U.hasOwnProperty(s)){U[s]={};}U[s][B]=true;});});return U;};h.prototype._formatUnreferencedApplications=function(s,U){return"One or more apps from "+s+" content provider are not listed among the applications section "+"of the extended site and will be discarded - "+Object.keys(U).map(function(i){var B=Object.keys(U[i]).map(function(j){return"'"+j+"'";});return"From catalog '"+i+"': "+B.join(", ");}).join("; ");};h.prototype._removeUnreferencedApplications=function(E,U){Object.keys(E.catalogs).forEach(function(s){var o=E.catalogs[s].payload;var A=o.appDescriptors;o.appDescriptors=A.filter(function(i){return U[s]&&!U[s][i.id];});});};h.prototype.getExtensionSites=function(){var t=this;var o=new q.Deferred();l().done(function(){var i=Object.keys(t._oContentProviderIndex),T=i.length;if(T===0){o.resolve([]);return;}var G=i.map(function(s,I){var j=t._oContentProviderIndex[s];var k;try{k=j.getSite();if(!k||typeof k.then!=="function"){throw"getSite does not return a Promise";}}catch(E){k=Promise.reject("call to getSite failed: "+E);}return k.then(function(s,m){var n=q.extend(true,{},m);var U=t._getUnreferencedCatalogApplications(m);if(Object.keys(U).length>0){var p=t._formatUnreferencedApplications(s,U);q.sap.log.error(p,null,f);t._removeUnreferencedApplications(n,U);}var L={providerId:s,success:true,site:n};o.notify(L);return L;}.bind(null,s),function(s,m){return{providerId:s,success:false,error:m};}.bind(null,s));});Promise.all(G).then(function(L){o.resolve(L);});});return o.promise();};h.prototype.registerContentProvider=function(i,s){if(this._oContentProviderIndex[i]){q.sap.log.error("a content provider with ID '"+i+"' is already registered",null,f);return;}this._oContentProviderIndex[i]=s;q.sap.log.debug("ContentProvider '"+i+"' was registered",null,f);};h.prototype._ensureCompleteSite=function(p){if(p.groups){var G=p.groups;Object.keys(G).forEach(function(k){if(!G[k]){delete G[k];}else{if(!G[k].payload){G[k].payload={};}if(!G[k].payload.links){G[k].payload.links=[];}if(!G[k].payload.tiles){G[k].payload.tiles=[];}if(!G[k].payload.groups){G[k].payload.groups=[];}}});}return p;};h.prototype._ensureGroupsOrder=function(s){var G=O.get("site.payload.groupsOrder",s),o=s.groups,j,i=0;if(!G){return s;}while(i<G.length){j=G[i];if(!o[j]){G.splice(i,1);}else{i++;}}return s;};h.prototype.getPlugins=(function(){var i,E,p;E=function(s,o){var j,n=Object.keys(o).length;if(n===0){return{};}if(!o.hasOwnProperty("Shell-plugin")){q.sap.log.error("Cannot find inbound with id 'Shell-plugin' for plugin '"+s+"'","plugin startup configuration cannot be determined correctly",f);return{};}if(n>1){q.sap.log.warning("Multiple inbounds are defined for plugin '"+s+"'","plugin startup configuration will be determined using "+"the signature of 'Shell-plugin' inbound.",f);}j=O.get("signature.parameters",o["Shell-plugin"])||{};return Object.keys(j).reduce(function(R,N){var k=O.get(N+".defaultValue.value",j);if(typeof k==="string"){R[N]=k;}return R;},{});};i=function(o){Object.keys(o).filter(function(s){return typeof o[s]==="object";}).forEach(function(s){o[s]=i(o[s]);});return Object.freeze(o);};return function(o){if(o!==undefined){p=o;}if(p){return q.when(p);}p={};return this.getSite().then(function(s){var A=s.applications||{};Object.keys(A).filter(function(j){return O.get("type",this[j]["sap.flp"])==="plugin";},A).forEach(function(j){var k,m,n=this[j],t={};if(!a(n["sap.platform.runtime"])){q.sap.log.error("Cannot find 'sap.platform.runtime' section for plugin '"+j+"'","plugin might not be started correctly","sap.ushell.services.CommonDataModel");}else if(!a(n["sap.platform.runtime"].componentProperties)){q.sap.log.error("Cannot find 'sap.platform.runtime/componentProperties' "+"section for plugin '"+j+"'","plugin might not be started correctly","sap.ushell.services.CommonDataModel");}else{t=n["sap.platform.runtime"].componentProperties;}p[j]={url:t.url,component:n["sap.ui5"].componentName};var v=O.get("crossNavigation.inbounds",n["sap.app"])||{};m=E(j,v);k=q.extend(t.config||{},m);if(k){p[j].config=k;}if(t.asyncHints){p[j].asyncHints=t.asyncHints;}var w=O.get("deviceTypes",n["sap.ui"]);if(w){p[j].deviceTypes=w;}},A);return i(p);},function(v){return v;});};})();h.prototype._mapDisplayFormats=function(i){var o={tile:D.Standard,default:D.Standard,standard:D.Standard,link:D.Compact,compact:D.Compact,flat:D.Flat,flatWide:D.FlatWide,tileWide:D.StandardWide,standardWide:D.StandardWide};var s=Object.keys(o).filter(function(j){return i.indexOf(j)>-1;});return s.map(function(j){return o[j];});};h.prototype._ensureProperDisplayFormats=function(s){if(s.vizTypes){Object.keys(s.vizTypes).forEach(function(k){if(s.vizTypes[k]["sap.flp"]&&s.vizTypes[k]["sap.flp"].vizOptions){var v=s.vizTypes[k];var i=O.get("vizOptions.displayFormats.supported",v["sap.flp"]);var j=O.get("vizOptions.displayFormats.default",v["sap.flp"]);if(i){var m=this._mapDisplayFormats(i);s.vizTypes[k]["sap.flp"].vizOptions.displayFormats.supported=m;}if(j){var M=this._mapDisplayFormats([j])[0];s.vizTypes[k]["sap.flp"].vizOptions.displayFormats.default=M;}}}.bind(this));}if(s.hasOwnProperty("pages")){Object.keys(s.pages).forEach(function(k){var p=s.pages[k];if(p.payload&&p.payload.sections){var o=p.payload.sections;Object.keys(o).forEach(function(i){var j=o[i];Object.keys(j.viz).forEach(function(v){var m=j.viz[v];if(m.displayFormatHint){var M=this._mapDisplayFormats([m.displayFormatHint])[0];m.displayFormatHint=M||m.displayFormatHint;}}.bind(this));}.bind(this));}}.bind(this));}else if(s.hasOwnProperty("groups")){Object.keys(s.groups).forEach(function(G){var o=s.groups[G];o.payload.tiles.forEach(function(t){if(t.displayFormatHint){var m=this._mapDisplayFormats([t.displayFormatHint])[0];t.displayFormatHint=m||t.displayFormatHint;}}.bind(this));}.bind(this));}return s;};h.prototype._ensureStandardVizTypesPresent=function(s){if(!(s._version&&s._version.startsWith("3."))){return s;}if(!s.vizTypes){s.vizTypes={};}if(!s.vizTypes[g.STATIC_LAUNCHER]){s.vizTypes[g.STATIC_LAUNCHER]=q.sap.loadResource("sap/ushell/components/tiles/cdm/applauncher/manifest.json");}if(!s.vizTypes[g.DYNAMIC_LAUNCHER]){s.vizTypes[g.DYNAMIC_LAUNCHER]=q.sap.loadResource("sap/ushell/components/tiles/cdm/applauncherdynamic/manifest.json");}if(!s.vizTypes[g.CARD]){s.vizTypes[g.CARD]=q.sap.loadResource("sap/ushell/services/_CommonDataModel/vizTypeDefaults/cardManifest.json");}return s;};h.prototype.getMenuEntries=function(m){return new Promise(function(i,j){this._oSiteDeferred.then(function(s){var M=O.get("menus."+m+".payload.menuEntries",s);i(d(M)||[]);});}.bind(this));};h.prototype.getContentProviderIds=function(){return new Promise(function(i,j){this._oSiteDeferred.then(function(s){var k=Object.keys(s.systemAliases);var o={};e(s.applications).forEach(function(A){var m=r.getContentProviderId(A);if(c(k,m)){o[m]=true;}});i(Object.keys(o));});}.bind(this));};h.hasNoAdapter=false;return h;},true);