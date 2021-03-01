/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/restricted/_omit","sap/base/util/each","sap/base/util/includes","sap/base/util/isEmptyObject","sap/base/util/merge","sap/base/util/ObjectPath","sap/base/Log","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/core/BusyIndicator","sap/ui/fl/apply/_internal/changes/Reverter","sap/ui/fl/apply/_internal/controlVariants/URLHandler","sap/ui/fl/apply/_internal/flexState/controlVariants/Switcher","sap/ui/fl/apply/_internal/flexState/controlVariants/VariantManagementState","sap/ui/fl/apply/_internal/controlVariants/Utils","sap/ui/fl/changeHandler/Base","sap/ui/fl/Change","sap/ui/fl/Layer","sap/ui/fl/LayerUtils","sap/ui/fl/Utils","sap/ui/model/json/JSONModel"],function(_,e,i,a,m,O,L,J,B,R,U,S,V,b,c,C,d,f,g,h){"use strict";function j(E,P){return n(function(u,v){var M=v.model;var x=v.vmReference;var y=false;var T=u.key;var z=u.key;return Promise.resolve().then(function(){if(O.get([x,"currentVariant"],M.oData)&&M.oData[x].currentVariant!==M.oData[x].originalCurrentVariant){z=M.oData[x].originalCurrentVariant;y=true;return M.updateCurrentVariant({variantManagementReference:x,newVariantReference:T,appComponent:M.oAppComponent,internallyCalled:true});}}).then(function(){if(O.get([x,"modified"],M.oData)===true){var A=V.getControlChangesForVariant({reference:M.sFlexReference,vmReference:x,vReference:z,changeInstance:true});return k({changes:A,vmReference:x,vReference:z,revert:!y,model:M}).then(function(){M.oData[x].originalCurrentVariant=T;M.oData[x].modified=false;M.checkUpdate(true);});}}).then(function(){if(!y){M._callVariantSwitchListeners(x,M.oData[x].currentVariant);}});}.bind(null,E.getParameters(),P),P.model,P.vmReference);}function k(P){var v=P.model._getDirtyChangesFromVariantChanges(P.changes);return Promise.resolve().then(function(){if(P.revert){return R.revertMultipleChanges(v,{appComponent:P.model.oAppComponent,modifier:J,flexController:P.model.oFlexController});}}).then(function(){v.forEach(function(u){V.removeChangeFromVariant({reference:P.model.sFlexReference,change:u,vmReference:P.vmReference,vReference:P.vReference});P.model.oFlexController.deleteChange(u,P.model.oAppComponent);});});}function l(M,v,u){if(u||M.oData[v]){M.oData[v].variantBusy=u;}M.checkUpdate();}function n(u,M,v){M._oVariantSwitchPromise=M._oVariantSwitchPromise.catch(function(){}).then(l.bind(null,M,v,true)).then(u).then(l.bind(null,M,v,false)).catch(function(E){l(M,v,false);throw E;});M.oFlexController.setVariantSwitchPromise(M._oVariantSwitchPromise);return M._oVariantSwitchPromise;}function r(P){return S.switchVariant(P).then(function(){delete this.oData[P.vmReference];}.bind(this)).catch(function(E){L.warning(E.message);});}function s(P,u){return S.switchVariant(P).then(function(){this.oData[P.vmReference].originalCurrentVariant=P.newVReference;this.oData[P.vmReference].currentVariant=P.newVReference;if(this.oData[P.vmReference].updateVariantInURL){U.updateVariantInURL({vmReference:P.vmReference,newVReference:P.newVReference,model:this});}this._callVariantSwitchListeners(P.vmReference,P.newVReference,undefined,u);this.checkUpdate();}.bind(this));}function o(v,u,D){var x=D?f.getCurrentLayer():d.USER;if((v.layer===x)&&(v.key!==u)){return true;}return false;}function w(u){return new Promise(function(v){if(u.getDomRef()){v();}else{u.addEventDelegate({onAfterRendering:function(){v();}});}});}var p=h.extend("sap.ui.fl.variants.VariantModel",{constructor:function(D,F,A,u){this.pSequentialImportCompleted=Promise.resolve();h.apply(this,arguments);this.bObserve=u;if(!F){F=sap.ui.requireSync("sap/ui/fl/FlexControllerFactory").createForControl(A);}this.oFlexController=F;this.oChangePersistence=this.oFlexController._oChangePersistence;this.sFlexReference=this.oChangePersistence.getComponentName();this.oAppComponent=A;this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.fl");this._oVariantSwitchPromise=Promise.resolve();this._oVariantAppliedListeners={};if(a(D)){try{D=V.fillVariantModel({reference:this.sFlexReference});}catch(E){L.error("Variants Map was not found: "+E.message);}}if(D&&typeof D==="object"){Object.keys(D).forEach(function(K){D[K].variants.forEach(function(v){if(!D[K].currentVariant&&(v.key===D[K].defaultVariant)){D[K].currentVariant=v.key;}v.originalTitle=v.title;v.originalFavorite=v.favorite;v.originalExecuteOnSelect=v.executeOnSelect;v.originalVisible=v.visible;});D[K].originalCurrentVariant=D[K].currentVariant;D[K].originalDefaultVariant=D[K].defaultVariant;});this.setData(D);}U.initialize({model:this});}});p.prototype.updateCurrentVariant=function(P){var u={vmReference:P.variantManagementReference,currentVReference:this.oData[P.variantManagementReference].originalCurrentVariant,newVReference:P.newVariantReference,flexController:this.oFlexController,appComponent:P.appComponent||this.oAppComponent,modifier:J,reference:this.sFlexReference};if(P.internallyCalled){return s.call(this,u,P.scenario);}return n(s.bind(this,u,P.scenario),this,P.variantManagementReference);};p.prototype.getCurrentVariantReference=function(v){return this.oData[v].currentVariant;};p.prototype.getVariantManagementReference=function(v){var u="";var I=-1;Object.keys(this.oData).some(function(K){return this.oData[K].variants.some(function(x,y){if(x.key===v){u=K;I=y;return true;}});}.bind(this));return{variantManagementReference:u,variantIndex:I};};p.prototype.getVariant=function(v,u){return V.getVariant({reference:this.sFlexReference,vmReference:u||this.getVariantManagementReference(v).variantManagementReference,vReference:v});};p.prototype.getVariantProperty=function(v,P){return this.getVariant(v).content.content[P];};function q(v){var u=V.getVariantChangesForVariant({vmReference:v,reference:this.sFlexReference});var x=this.oData[v].currentVariant;var D=this.oData[v].defaultVariant;if(this.oData[v]._executeOnSelectionForStandardDefault&&x===D&&x===v&&!u.setExecuteOnSelect){var y=V.getVariant({reference:this.sFlexReference,vmReference:v,vReference:v});y.content.content.executeOnSelect=true;this.oData[v].variants[0].originalExecuteOnSelect=true;this.oData[v].variants[0].executeOnSelect=true;return true;}}p.prototype.attachVariantApplied=function(P){var v=this.getVariantManagementReferenceForControl(sap.ui.getCore().byId(P.vmControlId));return this.waitForVMControlInit(v).then(function(v,P){if(!this._oVariantAppliedListeners[v]){this._oVariantAppliedListeners[v]={};}var I=q.call(this,v);if(P.callAfterInitialVariant||I){var u={appComponent:this.oAppComponent,reference:this.sFlexReference,vmReference:v,flexController:this.oFlexController};V.waitForInitialVariantChanges(u).then(function(){var x=V.getCurrentVariantReference({vmReference:v,reference:this.sFlexReference});this._callVariantSwitchListeners(v,x,P.callback);}.bind(this));}return w(P.control).then(function(){if(b.getRelevantVariantManagementControlId(P.control,this.getVariantManagementControlIds())===P.vmControlId){this.oData[v].showExecuteOnSelection=true;this.checkUpdate(true);this._oVariantAppliedListeners[v][P.control.getId()]=P.callback;}else{L.error("Error in attachVariantApplied: The passed VariantManagement ID does not match the responsible VariantManagement control");}}.bind(this));}.bind(this,v,P));};p.prototype._callVariantSwitchListeners=function(v,N,u,x){if(this._oVariantAppliedListeners[v]){var y;this.oData[v].variants.some(function(z){if(z.key===N){y=m({},z);return true;}});if(x){y.createScenario=x;}if(u){u(y);}else{e(this._oVariantAppliedListeners[v],function(z,u){u(y);});}}};p.prototype.detachVariantApplied=function(v,u){var x=this.getVariantManagementReferenceForControl(sap.ui.getCore().byId(v));if(this._oVariantAppliedListeners[x]){delete this._oVariantAppliedListeners[x][u];}};p.prototype.addChange=function(u){var v=u.getVariantReference();var x=this.getVariantManagementReference(v).variantManagementReference;this.oData[x].modified=!!this.oData[x].variantsEditable;this.checkUpdate(true);return V.addChangeToVariant({reference:this.sFlexReference,change:u,vmReference:x,vReference:v});};p.prototype.removeChange=function(u){var v=u.getVariantReference();var x=this.getVariantManagementReference(v).variantManagementReference;var y=V.removeChangeFromVariant({reference:this.sFlexReference,change:u,vmReference:x,vReference:v});this.checkDirtyStateForControlModels([x]);return y;};p.prototype._getVariantTitleCount=function(N,v){var D=this.getData();return D[v].variants.reduce(function(u,x){if(N.toLowerCase()===x.title.toLowerCase()&&x.visible){u++;}return u;},0);};p.prototype._duplicateVariant=function(P){var N=P.newVariantReference;var u=P.sourceVariantReference;var v=P.variantManagementReference;var x=this.getVariant(u);var y=V.getControlChangesForVariant({vmReference:v,vReference:u,changeInstance:true,reference:this.sFlexReference}).map(function(F){return F.getDefinition();});var D={content:{},controlChanges:y,variantChanges:{}};var z=f.compareAgainstCurrentLayer(x.content.layer,!this._bDesignTimeMode?d.USER:"");Object.keys(x.content).forEach(function(K){if(K==="fileName"){D.content[K]=N;}else if(K==="variantReference"){if(z===0){D.content[K]=x.content["variantReference"];}else if(z===-1){D.content[K]=u;}}else if(K==="content"){D.content[K]=JSON.parse(JSON.stringify(x.content[K]));D.content.content.title=P.title;}else{D.content[K]=x.content[K];}});D.content["layer"]=P.layer;y=D.controlChanges.slice();var A={};var E;D.controlChanges=y.reduce(function(F,G){if(f.compareAgainstCurrentLayer(G.layer,!this._bDesignTimeMode?d.USER:"")===0){A=m({},G);A.variantReference=D.content.fileName;if(!A.support){A.support={};}A.support.sourceChangeFileName=G.fileName;A.packageName="$TMP";E=C.createInitialFileContent(A);F.push(new C(E));}return F;}.bind(this),[]);return D;};p.prototype.copyVariant=function(P){var D=this._duplicateVariant(P);var v={key:D.content.fileName,layer:P.layer,title:D.content.content.title,originalTitle:D.content.content.title,originalExecuteOnSelect:D.content.content.executeOnSelect,executeOnSelect:false,favorite:true,originalFavorite:true,rename:true,change:true,remove:true,visible:true,originalVisible:true};var u=b.createVariant({model:this,variantSpecificData:D});var x=[];[u].concat(u.getControlChanges()).forEach(function(y){x.push(this.oChangePersistence.addDirtyChange(y));}.bind(this));var I=V.addVariantToVariantManagement({variantData:m({},u.getDefinitionWithChanges(),{content:{content:{visible:v.visible,favorite:v.favorite}}}),reference:this.sFlexReference,vmReference:P.variantManagementReference});this.oData[P.variantManagementReference].variants.splice(I,0,v);return this.updateCurrentVariant({variantManagementReference:P.variantManagementReference,newVariantReference:u.getId(),appComponent:P.appComponent,internallyCalled:true,scenario:"saveAs"}).then(function(){return x;});};p.prototype.removeVariant=function(P){var u=this.oChangePersistence.getDirtyChanges().filter(function(v){return(v.getVariantReference&&v.getVariantReference()===P.variant.getId())||v.getId()===P.variant.getId();});return this.updateCurrentVariant({variantManagementReference:P.variantManagementReference,newVariantReference:P.sourceVariantReference,appComponent:P.component}).then(function(){var I=V.removeVariantFromVariantManagement({reference:this.sFlexReference,variant:P.variant,vmReference:P.variantManagementReference});this.oData[P.variantManagementReference].variants.splice(I,1);this.checkUpdate();u.forEach(function(v){this.oChangePersistence.deleteChange(v);}.bind(this));}.bind(this));};p.prototype.collectModelChanges=function(v,u){var D=this.getData()[v];var M=D.variants;var x=[];var P={};M.forEach(function(y){if(y.originalTitle!==y.title){P={variantReference:y.key,changeType:"setTitle",title:y.title,originalTitle:y.originalTitle,layer:u};x.push(P);}if(y.originalFavorite!==y.favorite){P={variantReference:y.key,changeType:"setFavorite",favorite:y.favorite,originalFavorite:y.originalFavorite,layer:u};x.push(P);}if(y.originalExecuteOnSelect!==y.executeOnSelect){P={variantReference:y.key,changeType:"setExecuteOnSelect",executeOnSelect:y.executeOnSelect,originalExecuteOnSelect:y.originalExecuteOnSelect,layer:u};x.push(P);}if(!y.visible&&y.originalVisible){P={variantReference:y.key,changeType:"setVisible",visible:false,layer:u};x.push(P);}});if(D.originalDefaultVariant!==D.defaultVariant){P={variantManagementReference:v,changeType:"setDefault",defaultVariant:D.defaultVariant,originalDefaultVariant:D.originalDefaultVariant,layer:u};x.push(P);}return x;};p.prototype.manageVariants=function(v,u,x,y){return new Promise(function(z){v.attachEventOnce("manage",{resolve:z,variantManagementReference:u,layer:x},this.fnManageClickRta,this);v.openManagementDialog(true,y);}.bind(this));};p.prototype.setVariantProperties=function(v,P,A){var u=-1;var x;var y=null;var D=this.getData();if(P.variantReference){u=this.getVariantManagementReference(P.variantReference).variantIndex;x=D[v].variants[u];}var N={};var z={};switch(P.changeType){case"setTitle":z.title=P.title;x.title=P.title;x.originalTitle=x.title;break;case"setFavorite":z.favorite=P.favorite;x.favorite=P.favorite;x.originalFavorite=x.favorite;break;case"setExecuteOnSelect":z.executeOnSelect=P.executeOnSelect;if(x){x.executeOnSelect=P.executeOnSelect;x.originalExecuteOnSelect=x.executeOnSelect;}break;case"setVisible":z.visible=P.visible;z.createdByReset=false;x.visible=P.visible;x.originalVisible=x.visible;break;case"setDefault":z.defaultVariant=P.defaultVariant;D[v].defaultVariant=P.defaultVariant;D[v].originalDefaultVariant=D[v].defaultVariant;var H=U.getStoredHashParams({model:this});if(H){if(D[v].defaultVariant!==D[v].currentVariant&&H.indexOf(D[v].currentVariant)===-1){U.update({parameters:H.concat(D[v].currentVariant),updateURL:!this._bDesignTimeMode,updateHashEntry:true,model:this});}else if(D[v].defaultVariant===D[v].currentVariant&&H.indexOf(D[v].currentVariant)>-1){H.splice(H.indexOf(D[v].currentVariant),1);U.update({parameters:H,updateURL:!this._bDesignTimeMode,updateHashEntry:true,model:this});}}if(!A&&D[v].currentVariant!==P.defaultVariant){this.updateCurrentVariant({variantManagementReference:v,newVariantReference:P.defaultVariant,appComponent:P.appComponent});}break;default:break;}var E=V.getContent(this.sFlexReference);if(u>-1){var F=V.setVariantData({variantData:z,vmReference:v,previousIndex:u,reference:this.sFlexReference});D[v].variants.splice(u,1);D[v].variants.splice(F,0,x);}else if(E[v]){E[v].defaultVariant=P.defaultVariant;}var G={vmReference:v,add:A,reference:this.sFlexReference};if(A===true){N.changeType=P.changeType;N.layer=P.layer;if(P.changeType==="setDefault"){N.fileType="ctrl_variant_management_change";N.selector=J.getSelector(v,P.appComponent);}else{if(P.changeType==="setTitle"){c.setTextInChange(N,"title",P.title,"XFLD");}N.fileType="ctrl_variant_change";N.selector=J.getSelector(P.variantReference,P.appComponent);}y=this.oFlexController.createBaseChange(N,P.appComponent);y.setContent(z);G.changeContent=y.getDefinition();V.updateChangesForVariantManagementInMap(G);this.oChangePersistence.addDirtyChange(y);}else if(P.change){G.changeContent=P.change.getDefinition();V.updateChangesForVariantManagementInMap(G);this.oChangePersistence.deleteChange(P.change);}this.setData(D);this.checkUpdate(true);return y;};p.prototype._ensureStandardVariantExists=function(v){var D=this.getData();var u=D[v]||{};var x=_(u,["initPromise"]);if(!D[v]||a(x)){D[v]=m(u,{currentVariant:v,originalCurrentVariant:v,defaultVariant:v,originalDefaultVariant:v,variants:[{key:v,title:this._oResourceBundle.getText("STANDARD_VARIANT_TITLE"),originalTitle:this._oResourceBundle.getText("STANDARD_VARIANT_ORIGINAL_TITLE"),favorite:true,originalFavorite:true,executeOnSelect:false,originalExecuteOnSelect:false,visible:true,originalVisible:true,author:b.DEFAULT_AUTHOR}]});this.setData(D);var y={};y[v]={defaultVariant:v,variantManagementChanges:{},variants:[{content:{fileName:v,fileType:"ctrl_variant",variantManagementReference:v,variantReference:"",support:{user:b.DEFAULT_AUTHOR},content:{title:this._oResourceBundle.getText("STANDARD_VARIANT_TITLE"),favorite:true,visible:true,executeOnSelect:false}},controlChanges:[],variantChanges:{}}]};try{var z=V.getContent(this.sFlexReference);m(z,y);}catch(E){L.error("Variants Map was not found: "+E.message);}}};p.prototype.setModelPropertiesForControl=function(v,D,u){this.oData[v].modified=false;this.oData[v].showFavorites=true;var x=this._bDesignTimeMode;if(x!==D){this._bDesignTimeMode=D;if(D){U.clearAllVariantURLParameters({model:this});}else if(x){U.update({parameters:U.getStoredHashParams({model:this}),updateURL:true,updateHashEntry:false,model:this});}}if(!(typeof this.fnManageClick==="function"&&typeof this.fnManageClickRta==="function")){this._initializeManageVariantsEvents();}u.detachManage(this.fnManageClick,this);if(D&&this.oData[v]._isEditable){this.oData[v].variantsEditable=true;this.oData[v].variants.forEach(function(y){y.rename=true;y.change=true;y.remove=o(y,v,D);});}else if(this.oData[v]._isEditable){u.attachManage({variantManagementReference:v},this.fnManageClick,this);this.oData[v].variantsEditable=true;this.oData[v].variants.forEach(function(y){y.remove=o(y,v,D);if(y.layer===d.USER){y.rename=true;y.change=true;}else{y.rename=false;y.change=false;}});}else{this.oData[v].variantsEditable=false;this.oData[v].variants.forEach(function(y){y.remove=false;y.rename=false;y.change=false;});}};p.prototype._initializeManageVariantsEvents=function(){this.fnManageClickRta=function(E,D){var u=this.collectModelChanges(D.variantManagementReference,D.layer);D.resolve(u);};this.fnManageClick=function(E,D){if(!this.oFlexController||!V.getContent(this.sFlexReference)){return;}var u=this.collectModelChanges(D.variantManagementReference,d.USER);var v=[];u.forEach(function(x){x.appComponent=this.oAppComponent;v.push(this.setVariantProperties(D.variantManagementReference,x,true));}.bind(this));this.oChangePersistence.saveDirtyChanges(this.oAppComponent,false,v);};};function t(F,u,v,A){if(!this._bDesignTimeMode){return F.saveSequenceOfDirtyChanges(u,A).then(function(x){if(x){var y=x.response[0];this.oData[v].variants.forEach(function(z){if(z.key===y.fileName){z.author=y.support.user;}});}}.bind(this));}return Promise.resolve();}p.prototype._handleSaveEvent=function(E){if(!this._bDesignTimeMode){var v=E.getSource();var P=E.getParameters();return this._handleSave(v,P);}return Promise.resolve();};p.prototype._handleSave=function(v,P){var A=g.getAppComponentForControl(v);var u=this.getLocalId(v.getId(),A);var N;return n(function(x,A,P){var y=P.def;var z=P.execute;var D=this.getCurrentVariantReference(x);var E=V.getControlChangesForVariant({reference:this.sFlexReference,vmReference:x,vReference:D,changeInstance:true});if(P["overwrite"]){return this.oFlexController.saveSequenceOfDirtyChanges(this._getDirtyChangesFromVariantChanges(E),A).then(function(I){this.checkDirtyStateForControlModels([x]);return I;}.bind(this));}var F=P.layer||d.USER;var G=P.newVariantReference||g.createDefaultFileName();var H={variantManagementReference:x,appComponent:A,layer:F,title:P["name"],sourceVariantReference:D,newVariantReference:G};return this.copyVariant(H).then(function(I){if(y){var K={changeType:"setDefault",defaultVariant:G,originalDefaultVariant:this.oData[x].defaultVariant,appComponent:A,layer:F,variantManagementReference:x};var M=this.setVariantProperties(x,K,true);I.push(M);}if(z){var Q={changeType:"setExecuteOnSelect",executeOnSelect:true,variantReference:G,appComponent:A,layer:F,variantManagementReference:x};var T=this.setVariantProperties(x,Q,true);I.push(T);}this.oData[x].modified=false;this.checkUpdate(true);N=I;return k({changes:E,vmReference:x,vReference:D,model:this}).then(t.bind(this,this.oFlexController,I,x,A));}.bind(this));}.bind(this,u,A,P),this,u).then(function(){return N;});};p.prototype.getLocalId=function(I,A){return J.getSelector(I,A).id;};p.prototype.getVariantManagementReferenceForControl=function(v){var u=v.getId();var A=g.getAppComponentForControl(v);return(A&&A.getLocalId(u))||u;};p.prototype.switchToDefaultForVariantManagement=function(v){if(this.oData[v].currentVariant!==this.oData[v].defaultVariant){B.show(200);this.updateCurrentVariant({variantManagementReference:v,newVariantReference:this.oData[v].defaultVariant}).then(function(){B.hide();});}};p.prototype.switchToDefaultForVariant=function(v){Object.keys(this.oData).forEach(function(u){if(!v||this.oData[u].currentVariant===v){this.switchToDefaultForVariantManagement(u);}}.bind(this));};p.prototype.registerToModel=function(v){var u=this.getVariantManagementReferenceForControl(v);this._ensureStandardVariantExists(u);this.oData[u]._isEditable=v.getEditable();this.oData[u]._executeOnSelectionForStandardDefault=v.getExecuteOnSelectionForStandardDefault();this.oData[u].showExecuteOnSelection=false;v.attachEvent("select",{vmReference:u,model:this},j);v.attachSave(this._handleSaveEvent,this);this.setModelPropertiesForControl(u,false,v);var x=v.getUpdateVariantInURL();this.oData[u].updateVariantInURL=x;U.registerControl({vmReference:u,updateURL:!!x,model:this});U.handleModelContextChange({model:this,vmControl:v});if(this.oData[u].initPromise){this.oData[u].initPromise.resolveFunction();delete this.oData[u].initPromise;}this.oData[u].init=true;};p.prototype.waitForVMControlInit=function(v){if(!this.oData[v]){this.oData[v]={};}else if(this.oData[v].init){return Promise.resolve();}this.oData[v].initPromise={};this.oData[v].initPromise.promise=new Promise(function(u){this.oData[v].initPromise.resolveFunction=u;}.bind(this));return this.oData[v].initPromise.promise;};p.prototype._getDirtyChangesFromVariantChanges=function(u){var v=u.map(function(x){return x.getDefinition().fileName;});return this.oChangePersistence.getDirtyChanges().filter(function(x){return i(v,x.getId())&&!x.assignedToVariant;});};p.prototype.checkDirtyStateForControlModels=function(v){v.forEach(function(u){var x=this.oData[u];if(x.modified===true){var y=this.getCurrentVariantReference(u);var z=V.getControlChangesForVariant({reference:this.sFlexReference,vmReference:u,vReference:y,changeInstance:true});var D=this._getDirtyChangesFromVariantChanges(z);if(D.length===0){x.modified=false;}}}.bind(this));this.checkUpdate(true);};p.prototype.getCurrentControlVariantIds=function(){return Object.keys(this.oData||{}).reduce(function(u,v){return u.concat([this.oData[v].currentVariant]);}.bind(this),[]);};p.prototype.getVariantManagementControlIds=function(){var v;return Object.keys(this.oData||{}).reduce(function(u,x){if(this.oAppComponent.byId(x)){v=this.oAppComponent.createId(x);}else{v=x;}u.push(v);return u;}.bind(this),[]);};p.prototype.resetMap=function(){var v=Object.keys(this.oData);v.forEach(function(u){var P={vmReference:u,currentVReference:this.oData[u].currentVariant||this.oData[u].defaultVariant,newVReference:true,appComponent:this.oAppComponent,flexController:this.oFlexController,modifier:J,reference:this.sFlexReference};return n(r.bind(this,P),this,u);}.bind(this));return this._oVariantSwitchPromise.then(function(){V.resetContent(this.sFlexReference);U.initialize({model:this});U.update({parameters:[],updateHashEntry:true,model:this});}.bind(this));};return p;},true);