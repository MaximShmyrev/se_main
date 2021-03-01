/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/rta/util/changeVisualization/ChangeIndicator","sap/ui/rta/util/changeVisualization/ChangeIndicatorRegistry","sap/ui/core/Component","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/fl/write/api/PersistenceWriteAPI","sap/ui/fl/Layer","sap/ui/core/Fragment","sap/ui/model/json/JSONModel","sap/ui/model/resource/ResourceModel","sap/base/util/restricted/_difference","sap/ui/fl/Utils","sap/ui/fl/apply/_internal/changes/Utils","sap/ui/dt/OverlayRegistry","sap/base/util/deepEqual","sap/ui/events/KeyCodes","sap/m/ButtonType"],function(C,a,b,c,J,P,L,F,d,R,e,f,g,O,h,K,B){"use strict";var V={add:["createContainer","addDelegateProperty","reveal","addIFrame"],move:["move"],rename:["rename"],combinesplit:["combine","split"],remove:["remove"]};var i="all";var j=C.extend("sap.ui.rta.util.changeVisualization.ChangeVisualization",{metadata:{properties:{rootControlId:{type:"string"},isActive:{type:"boolean",defaultValue:false}},aggregations:{popover:{type:"sap.m.Popover",multiple:false}}},constructor:function(){C.prototype.constructor.apply(this,arguments);this._oChangeIndicatorRegistry=new b({commandCategories:V});this._oTextBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");this.setModel(new R({bundle:this._oTextBundle}),"i18n");this._oPopoverModel=new d();this._oPopoverModel.setDefaultBindingMode("OneWay");this._oChangeIndicatorModel=new d({active:this.getIsActive()});this._oChangeIndicatorModel.setDefaultBindingMode("OneWay");}});j.prototype.setRootControlId=function(r){if(this.getRootControlId()&&this.getRootControlId()!==r){this._reset();}this.setProperty("rootControlId",r);};j.prototype.setIsActive=function(A){if(A===this.getIsActive()){return;}this.setProperty("isActive",A);if(this._oChangeIndicatorModel){this._updateIndicatorModel({active:A});}if(this._oToolbarButton){this._oToolbarButton.setType(A?B.Emphasized:B.Transparent);this._oToolbarButton.setTooltip(this._oTextBundle.getText(A?"BUT_CHANGEVISUALIZATION_HIDECHANGES":"BUT_CHANGEVISUALIZATION_SHOWCHANGES"));}};j.prototype.exit=function(){this._oChangeIndicatorRegistry.destroy();};j.prototype._reset=function(){this._oChangeIndicatorRegistry.reset();};j.prototype.toggleActive=function(E){if(!this._oToolbarButton){this._oToolbarButton=sap.ui.getCore().byId(E.getParameter("id"));}var I=this.getIsActive();if(I){this.setIsActive(false);}else{this._updateChangeRegistry().then(this._updatePopoverModel.bind(this));this._togglePopover();}};j.prototype._updatePopoverModel=function(){var k=Object.keys(V).map(function(s){return{key:s,count:this._getChangesForCommandCategory(s).length,title:this._getCommandCategoryLabel(s)};}.bind(this));k.unshift({key:i,count:this._getChangesForCommandCategory(i).length,title:this._getCommandCategoryLabel(i)});this._oPopoverModel.setData(k);};j.prototype._getChangesForCommandCategory=function(s){var r=this._oChangeIndicatorRegistry.getChanges();return r.filter(function(o){return s===i?o.commandCategory!==undefined:s===o.commandCategory;});};j.prototype._getCommandCategoryLabel=function(s){var l="TXT_CHANGEVISUALIZATION_OVERVIEW_"+s.toUpperCase();return this._oTextBundle.getText(l);};j.prototype._togglePopover=function(){var p=this.getPopover();if(!p){F.load({name:"sap.ui.rta.util.changeVisualization.ChangesListPopover",id:c.get(this.getRootControlId()).createId("changeVisualization_changesListPopover"),controller:this}).then(function(p){this._oToolbarButton.addDependent(p);p.setModel(this._oPopoverModel,"commandModel");p.openBy(this._oToolbarButton);this.setPopover(p);}.bind(this));return;}if(p.isOpen()){p.close();}else{p.openBy(this._oToolbarButton);}};j.prototype.selectCommandCategory=function(E){this.getPopover().close();this.setIsActive(true);var s=E.getSource().getBindingContext("commandModel").getObject().key;var r=this._getChangesForCommandCategory(s);this._updateIndicatorModel({selectedChange:undefined,commandCategory:s});return Promise.all(r.map(function(o){return this._getChangedElements(o,false).then(function(k){this._oChangeIndicatorRegistry.addSelectorsForChangeId(o.change.getId(),k,false);}.bind(this));}.bind(this))).then(function(){this._updateChangeIndicators();this._setFocusedIndicator();}.bind(this));};j.prototype._getChangedElements=function(o,D){var k=c.get(this.getRootControlId());return this._getInfoFromChangeHandler(k,o.change).then(function(I){var s=[o.change.getSelector()];if(I){if(D){s=I.dependentControls;}else{s=I.affectedControls;}}var p=s.map(function(S){return J.bySelector(S,k);});return Promise.all(p).then(function(E){return E.map(function(l){if(o.commandCategory==="remove"&&l){return l.getParent();}return l;});});});};j.prototype._getInfoFromChangeHandler=function(A,o){var k=J.bySelector(o.getSelector(),A);if(k){var p={modifier:J,appComponent:A,view:f.getViewForControl(k)};var m=g.getControlIfTemplateAffected(o,k,p);return g.getChangeHandler(o,m,p).then(function(l){if(l&&typeof l.getChangeVisualizationInfo==="function"){return l.getChangeVisualizationInfo(o,A);}});}return Promise.resolve();};j.prototype._collectChanges=function(){var o=c.get(this.getRootControlId());var p={oComponent:o,selector:o,invalidateCache:false,includeVariants:true,currentLayer:L.CUSTOMER};return P._getUIChanges(p);};j.prototype._updateChangeRegistry=function(){return this._collectChanges().then(function(k){var r=this._oChangeIndicatorRegistry.getChangeIds();var o=k.reduce(function(m,n){m[n.getId()]=n;return m;},{});var l=Object.keys(o);e(r,l).forEach(function(s){this._oChangeIndicatorRegistry.removeChange(s);}.bind(this));e(l,r).forEach(function(s){this._oChangeIndicatorRegistry.registerChange(o[s]);}.bind(this));}.bind(this));};j.prototype._selectChange=function(E){var s=E.getParameter("changeId");this._updateIndicatorModel({selectedChange:s});if(s===undefined){this._updateChangeIndicators();return;}var o=this._oChangeIndicatorRegistry.getChange(s);this._getChangedElements(o,true).then(function(k){this._oChangeIndicatorRegistry.addSelectorsForChangeId(o.change.getId(),k,true);this._updateChangeIndicators();}.bind(this));};j.prototype._updateIndicatorModel=function(D){this._oChangeIndicatorModel.setData(Object.assign({},this._oChangeIndicatorModel.getData(),D));};j.prototype._updateChangeIndicators=function(){var s=this._oChangeIndicatorRegistry.getChangeIndicatorData();var I={};Object.keys(s).forEach(function(S){var k=s[S];var o=O.getOverlay(S);if(!o||!o.getDomRef()){return undefined;}I[S]={posX:parseInt(o.getDomRef().getClientRects()[0].x),posY:parseInt(o.getDomRef().getClientRects()[0].y),changes:this._filterRelevantChanges(k)};if(!this._oChangeIndicatorRegistry.hasChangeIndicator(S)){this._createChangeIndicator(o,S);}}.bind(this));if(!h(I,this._oChangeIndicatorModel.getData().content)){this._updateIndicatorModel({content:I});}};j.prototype._filterRelevantChanges=function(k){if(!Array.isArray(k)){return k;}var r=this._oChangeIndicatorModel.getData();return k.filter(function(o){return((!r.selectedChange&&!o.dependent&&(r.commandCategory==='all'||r.commandCategory===o.commandCategory))||(!!r.selectedChange&&o.id===r.selectedChange));});};j.prototype._createChangeIndicator=function(o,s){var k=new a({changes:"{changes}",mode:{path:"changes",formatter:function(l){var S=this.getModel().getData().selectedChange;return(!!S&&(l||[]).some(function(m){return m.dependent;}))?"dependent":"change";}},posX:"{posX}",posY:"{posY}",visible:"{= ${/active} && ${changes}.length > 0}",overlayId:o.getId(),selectorId:s,selectChange:this._selectChange.bind(this),keyPress:this._onIndicatorKeyPress.bind(this)});k.setModel(this._oChangeIndicatorModel);k.bindElement("/content/"+s);k.setModel(this.getModel("i18n"),"i18n");k.placeAt(sap.ui.getCore().getStaticAreaRef());this._oChangeIndicatorRegistry.registerChangeIndicator(s,k);};j.prototype._onIndicatorKeyPress=function(E){var o=E.getParameter("originalEvent");var k=o.keyCode;var I=E.getSource();if(k===K.ARROW_UP||k===K.ARROW_LEFT||(k===K.TAB&&o.shiftKey)){o.stopPropagation();o.preventDefault();this._setFocusedIndicator(I,-1);}else if(k===K.ARROW_DOWN||k===K.ARROW_RIGHT||k===K.TAB){o.stopPropagation();o.preventDefault();this._setFocusedIndicator(I,1);}else if(k===K.ESCAPE){this.setIsActive(false);}};j.prototype._setFocusedIndicator=function(s,D){var v=this._oChangeIndicatorRegistry.getChangeIndicators().filter(function(o){return o.getVisible();}).sort(function(o,k){var l=o.getPosY()-k.getPosY();var m=o.getPosX()-k.getPosX();return l||m;});if(v.length===0){return;}var I=s?(v.length+v.indexOf(s)+D)%v.length:0;v[I].focus();};return j;});
