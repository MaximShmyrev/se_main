/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["ui5loader","sap/ui/core/Control","sap/ui/core/Core","sap/base/util/deepClone","sap/base/util/merge","sap/ui/integration/widgets/Card","sap/ui/integration/Designtime","sap/ui/model/json/JSONModel","sap/ui/integration/util/CardMerger","sap/m/Label","sap/m/Title","sap/m/Panel","sap/m/HBox","sap/m/VBox","sap/ui/core/Icon","sap/m/ResponsivePopover","sap/m/Popover","sap/m/Text","sap/base/Log","sap/ui/core/Popup","sap/base/i18n/ResourceBundle","sap/ui/thirdparty/URI","sap/ui/dom/includeStylesheet","sap/base/util/LoaderExtensions","sap/ui/core/theming/Parameters","sap/base/util/ObjectPath","sap/m/FormattedText","sap/m/MessageStrip"],function(u,C,b,d,c,e,D,J,f,L,T,P,H,V,I,R,g,h,k,l,p,U,q,r,t,O,F,M){"use strict";var v=g.prototype.init;g.prototype.init=function(){v.apply(this,arguments);var a=this.oPopup._applyPosition,i=this;this.oPopup._applyPosition=function(){var j=i.close;i.close=function(){};a.apply(this,arguments);i.close=j;};};function w(s){if(s&&s.nodeType!==1){return 0;}var z=parseInt(window.getComputedStyle(s).getPropertyValue('z-index'));if(isNaN(z)){return w(s.parentNode);}return z+1;}var x=/\{\{(?!parameters.)(?!destinations.)([^\}\}]+)\}\}/g,y=5000,A=b.getLibraryResourceBundle("sap.ui.integration");var B=C.extend("sap.ui.integration.designtime.editor.CardEditor",{metadata:{library:"sap.ui.integration",properties:{card:{type:"any",defaultValue:null},mode:{type:"string",defaultValue:"admin"},language:{type:"string",defaultValue:""},allowDynamicValues:{type:"boolean",defaultValue:false},allowSettings:{type:"boolean",defaultValue:false},designtime:{type:"object"}},aggregations:{_formContent:{type:"sap.ui.core.Control",multiple:true,visibility:"hidden"},_preview:{type:"sap.ui.integration.designtime.editor.CardPreview",multiple:false,visibility:"hidden"},_messageStrip:{type:"sap.m.MessageStrip",multiple:false,visibility:"hidden"}},events:{ready:{}}},renderer:function(o,a){o.openStart("div");a.getMode()==="translation"?o.addClass("sapUiIntegrationCardEditorTranslation"):o.addClass("sapUiIntegrationCardEditorPreview");o.addClass("sapUiIntegrationCardEditor");o.writeClasses();o.writeElementData(a);o.openEnd();if(a.isReady()){o.openStart("div");a.getMode()==="translation"?o.addClass("sapUiIntegrationCardEditorTranslationForm"):o.addClass("sapUiIntegrationCardEditorForm");if(a.getMode()!=="translation"){o.addClass("settingsButtonSpace");}o.writeClasses();o.openEnd();if(a.getMode()!=="translation"){o.renderControl(a.getAggregation("_messageStrip"));}var j=a.getAggregation("_formContent");if(j){var m;var s;var z;var G;var K=[];var N=2;var Q;var S=function(){return new sap.m.FlexItemData({growFactor:1,baseSize:"0"});};var W=function(){if(K.length>0){var a1=N-K.length;for(var n=0;n<a1;n++){K.push(new V().setLayoutData(S()));}m.addContent(new H({items:K}));K=[];}};for(var i=0;i<j.length;i++){var X=j[i];if(a.getMode()!=="translation"){if(X.isA("sap.m.Panel")){if(m){W();if(m.getContent().length>0){o.renderControl(m);}}m=X;m.addStyleClass("sapUiIntegrationCardEditorItem");if(i===j.length-1){W();if(m.getContent().length>0){o.renderControl(m);}}continue;}if(X.isA("sap.m.Label")){X.addStyleClass("sapUiIntegrationCardEditorItemLabel");var Y=X.getDependents()&&X.getDependents()[0];var Z=null;Z=new H({items:[X.addStyleClass("description")]});if(Y){Z.addItem(Y);}if(X._oMessageIcon){Z.addItem(X._oMessageIcon);}if(X._cols===1){if(K.length===N){m.addContent(new H({items:K}));K=[];}G=Z?Z:X;continue;}W();if(X._sOriginalType==="boolean"){z=Z?Z:X;}else{m.addContent(Z?Z:X);}}else if(X._cols===1){K.push(new V({items:[G,X]}).setLayoutData(S()));G=null;}else if(z){X.setLayoutData(S());z.setLayoutData(S());m.addContent(new H({items:[z,X]}));z=null;}else{m.addContent(X);}if(i===j.length-1){W();if(m.getContent().length>0){o.renderControl(m);}}}else{if(i===0){s=X;o.renderControl(s);s.addStyleClass("sapUiIntegrationCardEditorTranslationPanel");continue;}if(X.isA("sap.m.Panel")){if(m&&m.getContent().length>0){s.addContent(m);}m=X;m.addStyleClass("sapUiIntegrationCardEditorTranslationSubPanel");continue;}if(X.isA("sap.m.FormattedText")){continue;}if(X.isA("sap.m.Label")){m.addContent(X);continue;}if(X.isOrigLangField){Q=X;continue;}Q.setLayoutData(S());X.setLayoutData(S());var $=new H({items:[Q,X]});m.addContent($);if(i===j.length-1){s.addContent(m);}}}}o.close("div");var _=a.getAggregation("_preview");_&&o.renderControl(_);}o.close("div");}});B.prototype.init=function(){this._ready=false;this._aFieldReadyPromise=[];this._oResourceBundle=A;this._appliedLayerManifestChanges=[];this._currentLayerManifestChanges={};this._mDestinationDataProviders={};this.setAggregation("_messageStrip",new M({showIcon:false}));};B.prototype.isReady=function(){return this._ready;};function E(o,s,a,i){i=i||"";a=a||[];if(typeof o==="object"){if(!o[s]){for(var n in o){E(o[n],s,a,i+"/"+n);}}else{if(o.type){a.push({path:o.pathvalue||i.substring(1),value:o.pathvalue||"{context>"+i.substring(1)+"/value}",object:o});}else{a.push({path:i.substring(1),object:o});for(var n in o){E(o[n],s,a,i+"/"+n);}}}}return a;}B.prototype._filterManifestChangesByLayer=function(m){var a=[],o={":layer":f.layers[this.getMode()]},i=f.layers[this.getMode()];m.manifestChanges.forEach(function(j){var n=j.hasOwnProperty(":layer")?j[":layer"]:1000;if(n<i){a.push(j);}else if(n===i){o=j;}});m.manifestChanges=a;this._currentLayerManifestChanges=o;};B.prototype.setCard=function(a,s){this._ready=false;if(a===this.getProperty("card")){return this;}if(this._oEditorCard){this._oEditorCard.destroy();}if(this._oDesigntimeInstance){this._oDesigntimeInstance.destroy();}this.setProperty("card",a,s);Promise.resolve().then(function(){this._initCard(a);}.bind(this));return this;};B.prototype.setLanguage=function(s,S){if(!s||typeof s!=="string"){return this;}this._language=s.replace("-","_");this.setProperty("language",s,S);if(!B._languages[this._language]){this._language=this._language.split("_")[0];}if(!B._languages[this._language]){k.warning("The language: "+s+" is currently unknown, some UI controls might show "+s+" instead of the language name.");}return this;};B.prototype.onAfterRendering=function(){if(this.getDomRef()){this._iZIndex=w(this.getDomRef());l.setInitialZIndex(this._iZIndex);}};B.prototype._getOriginalManifestJson=function(){try{return this._oEditorCard._oCardManifest._oManifest.getRawJson();}catch(a){return{};}};B.prototype._initCard=function(a){if(typeof a==="string"){try{a=JSON.parse(a);}catch(i){var j=b.byId(a);if(!j){var m=document.getElementById(a);if(m&&m.tagName&&m.tagName==="ui-integration-card"){j=m._getControl();}}a=j;}}if(a&&a.isA&&a.isA("sap.ui.integration.widgets.Card")){a={manifest:a.getManifest(),manifestChanges:a.getManifestChanges(),host:a.getHost(),baseUrl:a.getBaseUrl()};}if(typeof a==="object"){var n=f.layers[this.getMode()];if(a.manifestChanges){this._filterManifestChangesByLayer(a);}this._oEditorCard=new e(a);var o=this;this._oEditorCard._prepareToApplyManifestSettings=function(){e.prototype._prepareToApplyManifestSettings.apply(this,arguments);if(!o._oEditorCard._isManifestReady){return;}if(o._manifestModel){return;}o._appliedLayerManifestChanges=a.manifestChanges;var s=o._oEditorCard.getManifestEntry("/");var _=c({},s);o._oProviderCard=o._oEditorCard;o._oProviderCard._editorManifest=s;o._beforeManifestModel=new J(_);if(n<f.layers["translation"]&&o._currentLayerManifestChanges){s=f.mergeCardDelta(s,[o._currentLayerManifestChanges]);}o._manifestModel=new J(s);o._originalManifestModel=new J(o._getOriginalManifestJson());o._initInternal();if(!o._oEditorCard.getModel("i18n")){o._oEditorCard._loadDefaultTranslations();}o.setModel(o._oEditorCard.getModel("i18n"),"i18n");o._createContextModel();};this._oEditorCard.onBeforeRendering();}};B.prototype._initInternal=function(){var s=this._oEditorCard.getManifestEntry("/sap.card/designtime"),o=this._manifestModel.getProperty("/sap.card/configuration"),a,i=this.getDesigntime();if(i){if(typeof i==="function"){a=new Promise(function(j,m){var n=new i();this._applyDesigntimeDefaults(n.getSettings());j(n);}.bind(this));}else if(typeof i==="object"){a=new Promise(function(j,m){sap.ui.require(["sap/ui/integration/Designtime"],function(D){var n=D.extend("test.Designtime");n.prototype.create=function(){return i;};var z=new n();this._applyDesigntimeDefaults(z.getSettings());j(z);}.bind(this));}.bind(this));}}else if(s){a=this._oEditorCard.loadDesigntime().then(function(j){this._applyDesigntimeDefaults(j.getSettings());return j;}.bind(this));}else{a=Promise.resolve(this._createParameterDesigntime(o));}a.then(function(j){this._oDesigntimeInstance=j;if(this.getMode()==="admin"||this.getMode()==="all"){this._addDestinationSettings(o,this._oDesigntimeInstance);}this._settingsModel=new J(this._oDesigntimeInstance.getSettings());this.setModel(this._settingsModel,"currentSettings");this.setModel(this._settingsModel,"items");this._oProviderCard.setModel(this._settingsModel,"items");this._applyDesigntimeLayers();this._requireFields().then(function(){this._startEditor();}.bind(this));}.bind(this));};B.prototype.getCurrentSettings=function(){var s=this._settingsModel.getProperty("/"),m={},N;if(s&&s.form&&s.form.items){for(var n in s.form.items){var i=s.form.items[n];if(i.editable&&i.visible){if(this.getMode()!=="translation"){if(i.translatable&&!i._changed&&i._translatedDefaultPlaceholder&&!this._currentLayerManifestChanges[i.manifestPath]){continue;}else{m[i.manifestpath]=i.value;}}else if(i.translatable&&i.value){m[i.manifestpath]=i.value;}if(i._next&&(this.getAllowSettings())){if(i._next.editable===false){N=N||{};N[i._settingspath+"/editable"]=false;}if(i._next.visible===false){N=N||{};N[i._settingspath+"/visible"]=false;}if(typeof i._next.allowDynamicValues==="boolean"&&this.getAllowDynamicValues()){N=N||{};N[i._settingspath+"/allowDynamicValues"]=i._next.allowDynamicValues;}}}}}m[":layer"]=f.layers[this.getMode()];m[":errors"]=this.checkCurrentSettings()[":errors"];if(N){m[":designtime"]=N;}return m;};B.prototype.checkCurrentSettings=function(){var s=this._settingsModel.getProperty("/"),m={};if(s&&s.form&&s.form.items){for(var n in s.form.items){var i=s.form.items[n];if(i.editable){if((i.isValid||i.required)&&!(this.getMode()==="translation"&&i.translatable)){if(i.isValid){m[i.manifestpath]=i.isValid(i);}m[i.manifestpath]=true;var a=i.value;var j=i.type;if(j==="string"&&a===""){m[i.manifestpath]=a;}if((j==="date"||j==="datetime")&&isNaN(Date.parse(a))){m[i.manifestpath]=a;}if(j==="integer"){if(isNaN(parseInt(a))){m[i.manifestpath]=a;}else if(a<i.min||a>i.max){m[i.manifestpath]=a;}}if(j==="number"){if(isNaN(parseFloat(a))){m[i.manifestpath]=a;}else if(a<i.min||a>i.max){m[i.manifestpath]=a;}}}}}m[":layer"]=f.layers[this.getMode()];}m[":errors"]=Object.values(m).indexOf(false)>-1;return m;};B.prototype._createContextModel=function(){var i=this._oEditorCard.getHostInstance(),j=new J({}),m=new J([]);this.setModel(j,"context");this.setModel(m,"contextflat");m._getPathObject=function(n){var a=this.getData().filter(function(o){if(o.path===n){return true;}});return a.length?a[0]:null;};m._getValueObject=function(n){var a=this.getData()||[];a=a.filter(function(o){if(o.value===n||o.object.value===n){return true;}});return a.length?a[0]:null;};var s=new Promise(function(a,n){if(i&&i.getContext){var o=false;setTimeout(function(){if(o){return;}k.error("Card Editor context could not be determined with "+y+".");o=true;a({});},y);i.getContext().then(function(z){if(o){k.error("Card Editor context returned after more than "+y+". Context is ignored.");}o=true;a(z||{});});}else{a({});}});s.then(function(o){var a={};a["empty"]=B._contextEntries.empty;for(var n in o){a[n]=o[n];}a["card.internal"]=B._contextEntries["card.internal"];j.setData(a);m.setData(E(a,"label"));});j.getProperty=function(a,o){var n=this.resolve(a,o);if(n.endsWith("/value")){this._mValues=this._mValues||{};if(this._mValues.hasOwnProperty(n)){return this._mValues[n];}this._mValues[n]=undefined;i.getContextValue(n.substring(1)).then(function(z){this._mValues[n]=z;this.checkUpdate();}.bind(this));return undefined;}else{return J.prototype.getProperty.apply(this,arguments);}};};B.fieldMap={"string":"sap/ui/integration/designtime/editor/fields/StringField","integer":"sap/ui/integration/designtime/editor/fields/IntegerField","number":"sap/ui/integration/designtime/editor/fields/NumberField","boolean":"sap/ui/integration/designtime/editor/fields/BooleanField","date":"sap/ui/integration/designtime/editor/fields/DateField","datetime":"sap/ui/integration/designtime/editor/fields/DateTimeField","string[]":"sap/ui/integration/designtime/editor/fields/ListField","destination":"sap/ui/integration/designtime/editor/fields/DestinationField"};B.Fields=null;B.prototype._requireFields=function(){if(B.Fields){return Promise.resolve();}return new Promise(function(a){sap.ui.require(Object.values(B.fieldMap),function(){B.Fields={};for(var n in B.fieldMap){B.Fields[n]=arguments[Object.keys(B.fieldMap).indexOf(n)];}a();});});};B.prototype._createLabel=function(o){var a=new L({text:o.label,required:o.required&&o.editable||false,visible:o.visible,objectBindings:{currentSettings:{path:"currentSettings>"+o._settingspath},items:{path:"items>/form/items"}}});a._cols=o.cols||2;a._sOriginalType=o.type;if(o.description){var i=new I({src:"sap-icon://message-information",color:"Marker",size:"12px",useIconTooltip:false,visible:this.getMode()!=="translation"});i.addStyleClass("sapUiIntegrationCardEditorDescriptionIcon");a.addDependent(i);a._oDescriptionIcon=i;i.onmouseover=function(i){this._getPopover().getContent()[0].applySettings({text:o.description});this._getPopover().openBy(i);i.addDependent(this._getPopover());}.bind(this,i);i.onmouseout=function(i){this._getPopover().close();i.removeDependent(this._getPopover());}.bind(this,i);}var m=new I({src:"sap-icon://message-information",size:"12px",useIconTooltip:false});m.addStyleClass("sapUiIntegrationCardEditorMessageIcon");a._oMessageIcon=m;return a;};B.prototype._getPopover=function(){if(this._oPopover){return this._oPopover;}var o=new h({text:""});o.addStyleClass("sapUiTinyMargin sapUiIntegrationCardEditorDescriptionText");this._oPopover=new R({showHeader:false,content:[o]});this._oPopover.addStyleClass("sapUiIntegrationCardEditorPopover");return this._oPopover;};B.prototype._updateProviderCard=function(a){if(this._ready){var m=this._oProviderCard._editorManifest;if(a.length===0){return;}for(var i=0;i<a.length;i++){var o=a[i];o.config._cancel=true;}delete m["sap.card"].header;delete m["sap.card"].content;delete m["sap.card"].data;m["sap.card"].type="List";var j=this._oProviderCard;this._oProviderCard=new e({manifest:m,baseUrl:this._getBaseUrl(),host:this._oProviderCard.getHost()});this._oProviderCard.setManifestChanges([this.getCurrentSettings()]);this._oProviderCard._editorManifest=m;var n=this;this._oProviderCard._fillFiltersModel=function(){if(!n._oProviderCard._oDataProviderFactory){return;}n._bIgnoreUpdates=true;for(var i=0;i<a.length;i++){var o=a[i];o.config._cancel=false;n._addValueListModel(o.config,o.field,true);}n._bIgnoreUpdates=false;};this._oProviderCard.setVisible(false);this._oProviderCard.setModel(this._settingsModel,"items");this._oProviderCard.onBeforeRendering();if(j&&j!==this._oEditorCard){j.destroy();}}};B.prototype._createField=function(o){var a=new B.Fields[o.type]({configuration:o,mode:this.getMode(),host:this._oEditorCard.getHostInstance(),objectBindings:{currentSettings:{path:"currentSettings>"+o._settingspath},items:{path:"items>/form/items"}},visible:o.visible});this._aFieldReadyPromise.push(a._readyPromise);var i=this._settingsModel.bindProperty(o._settingspath+"/value");i.attachChange(function(){if(!this._bIgnoreUpdates){o._changed=true;if(o._dependentFields&&o._dependentFields.length>0){this._updateProviderCard(o._dependentFields);}this._updatePreview();}}.bind(this));this._addValueListModel(o,a);a._cols=o.cols||2;return a;};B.prototype._addValueListModel=function(o,a,j){if(o.enum&&o.enum.length>0&&o.enum[0]!==""){o.enum=[""].concat(o.enum);}if(o.values&&o.values.data&&this._oProviderCard&&this._oProviderCard._oDataProviderFactory){var m=new J({});var n=this._oProviderCard._oDataProviderFactory.create(o.values.data);n.bindObject({path:"items>/form/items"});var s=n.getData();this._settingsModel.setProperty(o._settingspath+"/_loading",true);s.then(function(W){if(o._cancel){o._values=[];return;}var X=o.values.data.path;if(X&&X!=="/"){if(X.startsWith("/")){X=X.substring(1);}if(X.endsWith("/")){X=X.substring(0,X.length-1);}var Y=X.split("/");var Z=O.get(Y,W);if(Array.isArray(Z)&&Z.length>0&&o.type!=="string[]"){Z=[{}].concat(Z);O.set(Y,Z,W);}}else if(Array.isArray(W)&&W.length>0&&o.type!=="string[]"){W=[{}].concat(W);}o._values=W;m.setData(W);m.checkUpdate(true);this._settingsModel.setProperty(o._settingspath+"/_loading",false);}.bind(this)).catch(function(){o._values={};m.setData({});m.checkUpdate(true);this._settingsModel.setProperty(o._settingspath+"/_loading",false);}.bind(this));a.setModel(m,undefined);a.bindObject({path:o.values.data.path||"/"});if(!j){var z=JSON.stringify(o.values.data);if(z){var G=/parameters\.([^\}\}]+)|destinations\.([^\}\}]+)|\{items\>[\/?\w+]+\}/g,K=z.match(G);if(K){for(var i=0;i<K.length;i++){var N="/value";var Q="/sap.card/configuration/";if(K[i].indexOf("destinations.")===0||K[i].indexOf("parameters.")===0){if(K[i].indexOf("destinations.")===0){N="/name";}Q=Q+K[i].replace(".","/")+N;}else if(K[i].indexOf("{items>")===0){Q=Q+"parameters/"+K[i].slice(7,-1);}var S=this._mItemsByPaths[Q];if(S){S._dependentFields=S._dependentFields||[];S._dependentFields.push({field:a,config:o});}}}}}}};B.prototype._addItem=function(o){var m=this.getMode();if(this.getAllowDynamicValues()===false||!o.allowDynamicValues){o.allowDynamicValues=false;}if(this.getAllowSettings()===false){o.allowSettings=false;}o._beforeValue=this._beforeManifestModel.getProperty(o.manifestpath);o.__cols=o.cols||2;if(o.visible===false||(!o.translatable&&m==="translation"&&o.type!=="group")){return;}if(o.type==="group"){var a=new P({headerText:o.label,visible:o.visible,expandable:o.expandable!==false,expanded:o.expanded!==false,width:"auto",backgroundDesign:"Transparent",objectBindings:{currentSettings:{path:"currentSettings>"+o._settingspath},items:{path:"items>/form/items"}}});this.addAggregation("_formContent",a);a._cols=o.cols||2;if(o.hint){this._addHint(o.hint);}return;}var n=null;if(m==="translation"){if(typeof o.value==="string"&&o.value.indexOf("{")===0){return;}o._language={value:o.value};o.cols=1;delete o.values;var i=d(o,10);i._settingspath+="/_language";i.editable=false;i.required=false;i.value=i._beforeValue;if(!i.value){i.value="-";}var j=this._createLabel(i);this.addAggregation("_formContent",j);var s=this._createField(i);s.isOrigLangField=true;this.addAggregation("_formContent",s);o.value=o._translatedDefaultValue||"";o.editable=o.visible=o.translatable;if(this._currentLayerManifestChanges){o.value=this._currentLayerManifestChanges[o.manifestpath]||o.value;}o.label=o._translatedLabel||"";o.required=false;}else{n=this._createLabel(o);this.addAggregation("_formContent",n);}var s=this._createField(o);s.setAssociation("_messageIcon",n&&n._oMessageIcon);this.addAggregation("_formContent",s);if(o.hint&&o.type==="boolean"){this._addHint(o.hint);}if(n){n._oMessageIcon.onmouseover=function(s){s._showMessage();}.bind(this,s);n._oMessageIcon.onmouseout=function(s){s._hideMessage();}.bind(this,s);}o.cols=o.__cols;delete o.__cols;};B.prototype._addHint=function(s){s=s.replace(/<a href/g,"<a target='blank' href");var o=new F({htmlText:s});this.addAggregation("_formContent",o);};B.prototype._getCurrentLanguageSpecificText=function(K){var s=this._language;if(this._oTranslationBundle){var a=this._oTranslationBundle.getText(K,[],true);if(a===undefined){return"";}return a;}if(!s){return"";}var i=this._oEditorCard.getManifestEntry("/sap.app/i18n");if(!i){return"";}if(typeof i==="string"){var j=[s];if(s.indexOf("_")>-1){j.push(s.substring(0,s.indexOf("_")));}this._oTranslationBundle=p.create({url:this._getBaseUrl()+i,async:false,locale:s,supportedLocales:j,fallbackLocale:""});return this._getCurrentLanguageSpecificText(K);}};B.prototype._getBaseUrl=function(){if(this._oEditorCard&&this._oEditorCard.isReady()){return this._oEditorCard.getBaseUrl()||this.oCardEditor._oEditorCard._oCardManifest.getUrl();}return"";};B.prototype._startEditor=function(){var s=this._settingsModel.getProperty("/");var i;if(s.form&&s.form.items){i=s.form.items;if(this.getMode()==="translation"){this._addItem({type:"group",translatable:true,expandable:false,label:A.getText("CARDEDITOR_ORIGINALLANG")+": "+(B._languages[this._language]||this.getLanguage())});}var a=false;for(var m in i){var o=i[m];if(o.type==="group"){break;}else if(o.visible){a=true;break;}}if(a){this._addItem({type:"group",translatable:true,label:A.getText("CARDEDITOR_PARAMETERS_GENERALSETTINGS")});}this._mItemsByPaths={};for(var n in i){var o=i[n];if(o.manifestpath){this._mItemsByPaths[o.manifestpath]=o;}if(o){o.label=o.label||n;var j=this._currentLayerManifestChanges[o.manifestpath];o._changed=j!==undefined;if(o.type==="string"){o._translatedDefaultPlaceholder=this._getManifestDefaultValue(o.manifestpath)||o.defaultValue;var z=null,G=o._translatedDefaultPlaceholder;if(G){if(this._isValueWithHandlebarsTranslation(G)){z=G.substring(2,G.length-2);}else if(G.startsWith("{i18n>")){z=G.substring(6,G.length-1);}if(z){o.translatable=true;o._translatedDefaultValue=this.getModel("i18n").getResourceBundle().getText(z);if(o._changed){o.value=j;}else{o.value=o._translatedDefaultValue;}if(this.getMode()==="translation"){o._translatedDefaultValue=this._getCurrentLanguageSpecificText(z);}}}if(this.getMode()==="translation"){if(this._isValueWithHandlebarsTranslation(o.label)){o._translatedLabel=this._getCurrentLanguageSpecificText(o.label.substring(2,o.label.length-2),true);}else if(o.label&&o.label.startsWith("{i18n>")){o._translatedLabel=this._getCurrentLanguageSpecificText(o.label.substring(6,o.label.length-1),true);}}}}}}for(var n in i){var o=i[n];this._addItem(o);}if(this.getMode()!=="translation"){this._initPreview().then(function(){Promise.all(this._aFieldReadyPromise).then(function(){this._ready=true;this.fireReady();}.bind(this));}.bind(this));}else{Promise.all(this._aFieldReadyPromise).then(function(){this._ready=true;this.fireReady();}.bind(this));}};B.prototype.destroy=function(){if(this._oEditorCard){this._oEditorCard.destroy();}if(this._oPopover){this._oPopover.destroy();}if(this._oDesigntimeInstance){this._oDesigntimeInstance.destroy();}this._manifestModel=null;this._originalManifestModel=null;this._settingsModel=null;C.prototype.destroy.apply(this,arguments);};B.prototype._initPreview=function(){return new Promise(function(a,i){sap.ui.require(["sap/ui/integration/designtime/editor/CardPreview"],function(j){var o=new j({settings:this._oDesigntimeInstance.getSettings(),card:this._oEditorCard});this.setAggregation("_preview",o);a();}.bind(this));}.bind(this));};B.prototype._updatePreview=function(){var o=this.getAggregation("_preview");if(o){o.update();}};B.prototype._applyDesigntimeDefaults=function(s){s=s||{};s.form=s.form||{};s.form.items=s.form.items||{};s.preview=s.preview||{modes:"Abstract"};var i=s.form.items||s.form.items;for(var n in i){var o=i[n];if(o.manifestpath){o.value=this._manifestModel.getProperty(o.manifestpath);}if(o.visible===undefined||o.visible===null){o.visible=true;}if(typeof o.translatable!=="boolean"){o.translatable=false;}if(o.editable===undefined||o.editable===null){o.editable=true;}if(!o.label){o.label=n;}if(!o.type||o.type==="enum"){o.type="string";}if(o.value===undefined||o.value===null){switch(o.type){case"boolean":o.value=o.defaultValue||false;break;case"integer":case"number":o.value=o.defaultValue||0;break;case"string[]":o.value=o.defaultValue||[];break;default:o.value=o.defaultValue||"";}}if(o.type==="group"){if(o.visible===undefined||o.value===null){o.visible=true;}}o._settingspath="/form/items/"+n;}};B.prototype._applyDesigntimeLayers=function(s){if(this._appliedLayerManifestChanges&&Array.isArray(this._appliedLayerManifestChanges)){for(var i=0;i<this._appliedLayerManifestChanges.length;i++){var o=this._appliedLayerManifestChanges[i][":designtime"];if(o){var K=Object.keys(o);for(var j=0;j<K.length;j++){this._settingsModel.setProperty(K[j],o[K[j]]);}}}}if(this._currentLayerManifestChanges){var o=this._currentLayerManifestChanges[":designtime"];if(o){var K=Object.keys(o);for(var j=0;j<K.length;j++){var a=K[j],n=a.substring(0,a.lastIndexOf("/")+1)+"_next";if(!this._settingsModel.getProperty(n)){this._settingsModel.setProperty(n,{});}var n=a.substring(0,a.lastIndexOf("/")+1)+"_next",m=a.substring(a.lastIndexOf("/")+1);this._settingsModel.setProperty(n+"/"+m,o[K[j]]);}}}};B.prototype._createParameterDesigntime=function(o){var s={},a="/sap.card/configuration/parameters/",m=this.getMode();if(o&&o.parameters){s.form=s.form||{};s.form.items=s.form.items||{};var i=s.form.items;Object.keys(o.parameters).forEach(function(n){i[n]=c({manifestpath:a+n+"/value",editable:(m!=="translation"),_settingspath:"/form/items/"+n},o.parameters[n]);var j=i[n];if(!j.type){j.type="string";}if(!j.hasOwnProperty("visible")){j.visible=true;}});}return new D(s);};B.prototype._addDestinationSettings=function(o){var s=this._oDesigntimeInstance.getSettings(),i="/sap.card/configuration/destinations/";s.form=s.form||{};s.form.items=s.form.items||{};if(s&&o&&o.destinations){if(!s.form.items["destination.group"]){s.form.items["destination.group"]={label:A.getText("CARDEDITOR_DESTINATIONS")||"Destinations",type:"group",visible:true};}var j=s.form.items;Object.keys(o.destinations).forEach(function(n){var _=[{}],m=this._oEditorCard.getHostInstance();j[n+".destinaton"]=c({manifestpath:i+n+"/name",visible:true,type:"destination",editable:true,allowDynamicValues:false,allowSettings:false,value:o.destinations[n].name,defaultValue:o.destinations[n].defaultUrl,_settingspath:"/form/items/"+[n+".destinaton"],_values:_,_destinationName:n},o.destinations[n]);if(typeof j[n+".destinaton"].label==="undefined"){j[n+".destinaton"].label=n;}if(m){j[n+".destinaton"]._loading=true;this._oEditorCard.getHostInstance().getDestinations().then(function(n,a){j[n+".destinaton"]._values=_.concat(a);j[n+".destinaton"]._loading=false;this._settingsModel.checkUpdate(true);j[n+".destinaton"].value=o.destinations[n].name;}.bind(this,n));}}.bind(this));}};B.prototype._getManifestDefaultValue=function(s){return this._originalManifestModel.getProperty(s);};B.prototype._isValueWithHandlebarsTranslation=function(a){if(typeof a==="string"){return!!a.match(x);}return false;};B._contextEntries={empty:{label:A.getText("CARDEDITOR_CONTEXT_EMPTY_VAL"),type:"string",description:A.getText("CARDEDITOR_CONTEXT_EMPTY_DESC"),placeholder:"",value:""},"card.internal":{label:A.getText("CARDEDITOR_CONTEXT_CARD_INTERNAL_VAL"),todayIso:{type:"string",label:A.getText("CARDEDITOR_CONTEXT_CARD_TODAY_VAL"),description:A.getText("CARDEDITOR_CONTEXT_CARD_TODAY_DESC"),tags:[],placeholder:A.getText("CARDEDITOR_CONTEXT_CARD_TODAY_VAL"),customize:["format.dataTime"],value:"{{parameters.TODAY_ISO}}"},nowIso:{type:"string",label:A.getText("CARDEDITOR_CONTEXT_CARD_NOW_VAL"),description:A.getText("CARDEDITOR_CONTEXT_CARD_NOW_DESC"),tags:[],placeholder:A.getText("CARDEDITOR_CONTEXT_CARD_NOW_VAL"),customize:["dateFormatters"],value:"{{parameters.NOW_ISO}}"},currentLanguage:{type:"string",label:A.getText("CARDEDITOR_CONTEXT_CARD_LANG_VAL"),description:A.getText("CARDEDITOR_CONTEXT_CARD_LANG_VAL"),tags:["technical"],customize:["languageFormatters"],placeholder:A.getText("CARDEDITOR_CONTEXT_CARD_LANG_VAL"),value:"{{parameters.LOCALE}}"}}};B._languages={};B._appendThemeVars=function(){var o=document.getElementById("sap-ui-integration-editor-style");if(o&&o.parentNode){o.parentNode.removeChild(o);}var a=["sapUiButtonHoverBackground","sapUiBaseBG","sapUiContentLabelColor","sapUiTileSeparatorColor","sapUiHighlight","sapUiListSelectionBackgroundColor","sapUiNegativeText","sapUiCriticalText","sapUiPositiveText","sapUiChartScrollbarBorderColor"],s=document.createElement("style");s.setAttribute("id","sap-ui-integration-editor-style");for(var i=0;i<a.length;i++){a[i]="--"+a[i]+":"+t.get(a[i]);}s.innerHTML=".sapUiIntegrationCardEditor, .sapUiIntegrationFieldSettings, .sapUiIntegrationIconSelectList {"+a.join(";")+"}";document.body.appendChild(s);};B.init=function(){this.init=function(){};B._appendThemeVars();b.attachThemeChanged(function(){B._appendThemeVars();});var s=sap.ui.require.toUrl("sap.ui.integration.designtime.editor.css.CardEditor".replace(/\./g,"/")+".css");q(s);r.loadResource("sap/ui/integration/designtime/editor/languages.json",{dataType:"json",failOnError:false,async:true}).then(function(o){B._languages=o;});};B.init();return B;});
