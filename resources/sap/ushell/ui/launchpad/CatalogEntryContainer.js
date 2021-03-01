// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/Control","sap/ushell/ui/launchpad/TileContainerUtils","sap/ui/thirdparty/jquery","sap/base/Log","sap/ushell/resources"],function(C,T,q,L,r){"use strict";var a=C.extend("sap.ushell.ui.launchpad.CatalogEntryContainer",{metadata:{properties:{header:{type:"string",group:"Appearance",defaultValue:null},catalogSearchTerm:{type:"string",group:"Appearance",defaultValue:null},catalogTagSelector:{type:"object",group:"Appearance",defaultValue:null}},aggregations:{appBoxesContainer:{type:"sap.ushell.ui.appfinder.AppBox",multiple:true},customTilesContainer:{type:"sap.ushell.ui.launchpad.Tile",multiple:true}}},renderer:{apiVersion:2,render:function(b,c){b.openStart("div",c);b.attr("aria-labeledby",c.getId()+"-title");b.attr("role","group");b.class("sapUshellTileContainer");b.class("sapUshellCatalogTileContainer");b.openEnd();b.openStart("div");b.class("sapUshellTileContainerContent");b.attr("tabindex","-1");b.openEnd();var h=c.getHeader();if(h){if(r.i18n.hasText(h)){h=r.i18n.getText(h);}b.openStart("div");b.class("sapUshellTileContainerHeader");b.class("sapUshellCatalogTileContainerHeader");b.attr("id",c.getId()+"-groupheader");b.openEnd();b.openStart("div");b.class("sapUshellCatalogTileContainerHeaderInner");b.attr("id",c.getId()+"-title");b.openEnd();b.openStart("h2");b.class("sapUshellContainerTitle");b.class("sapUshellCatalogContainerTitle");b.attr("title",h);b.attr("aria-level","2");b.openEnd();b.text(h);b.close("h2");b.close("div");b.close("div");}b.openStart("ul");var i=c.data("containerHeight");if(i){b.style("height",i);}b.class("sapUshellTilesContainer-sortable");b.class("sapUshellInner");b.openEnd();c.getAppBoxesContainer().forEach(function(A){b.renderControl(A);});b.close("ul");b.openStart("ul");if(i){b.style("height",i);}b.class("sapUshellTilesContainer-sortable");b.class("sapUshellInner");b.openEnd();c.getCustomTilesContainer().forEach(function(o){b.renderControl(o);});b.close("ul");b.close("div");b.close("div");}}});a.prototype.setAfterHandleElements=function(c){this.onAfterHandleElements=c;};a.prototype.onAfterUpdate=function(c){this.fnCallback=c;};a.prototype.updateAggregation=function(R){L.debug("Updating CatalogEntryContainer. Reason: ",R);};a.prototype.addNewItem=function(e,n){if(this.catalogState[n]!=="full"){if(this.getAllocatedUnits){if(!this.getAllocatedUnits()){this.catalogState[n]="partial";return false;}}}if(n==="customTilesContainer"){var b=e.getObject&&e.getObject().src;if(b!==undefined){var c;if(b.Chip!==undefined&&b.Chip.getContract!==undefined){c=b.Chip.getContract("preview");}else if(b.getContract!==undefined){c=b.getContract("preview");}if(c!==undefined){c.setEnabled(true);}}sap.ushell.Container.getService("LaunchPage").getCatalogTileViewControl(e.getProperty("src")).done(function(d){e.getProperty("content")[0]=d;});}var N=T.createNewItem.bind(this)(e,n);T.addNewItem.bind(this)(N,n);var i=(n==="appBoxesContainer")?this.getAppBoxesContainer():this.getCustomTilesContainer(),p=e.getPath();this.indexingMaps[n].onScreenPathIndexMap[p]={aItemsRefrenceIndex:i.length-1,isVisible:true};return true;};a.prototype.getNumberResults=function(){return{nAppboxes:this.nNumberOfVisibileElements.appBoxesContainer,nCustom:this.nNumberOfVisibileElements.customTilesContainer};};a.prototype.handleElements=function(R){var n=R,b=this.mBindingInfos[n].binding,B=b.getContexts(),i,s,c;if(!this.catalogState){this.catalogState={};}if(!this.catalogState[R]){this.catalogState[R]="start";}if(!this.indexingMaps){this.indexingMaps={};}if(!this.nNumberOfVisibileElements){this.nNumberOfVisibileElements=[];}if(!this.nNumberOfVisibileElements.customTilesContainer){this.nNumberOfVisibileElements.customTilesContainer=0;}if(!this.nNumberOfVisibileElements.appBoxesContainer){this.nNumberOfVisibileElements.appBoxesContainer=0;}if(!this.filters){this.filters={};}i=(n==="appBoxesContainer")?this.getAppBoxesContainer():this.getCustomTilesContainer();this.indexingMaps[n]=T.indexOnScreenElements(i,false);c=T.markVisibleOnScreenElementsSearchCatalog(B,this.indexingMaps[n],true);if(T.createMissingElementsInOnScreenElementsSearchCatalog(this.indexingMaps[n],B,c,this.addNewItem.bind(this),i,this.filters[n],n,this.processFiltering.bind(this))){if(this.getAllocatedUnits&&this.getAllocatedUnits()){this.catalogState[R]="full";}}i=(n==="appBoxesContainer")?this.getAppBoxesContainer():this.getCustomTilesContainer();s=T.showHideTilesAndHeaders(this.indexingMaps[n],i);this.nNumberOfVisibileElements[n]=s.nCountVisibElelemnts;if(this.fnCallback){this.fnCallback(this);}if(this.onAfterHandleElements){this.onAfterHandleElements(this);}};a.prototype.processFiltering=function(e,n){var p=e.getPath();if(n){var i=this.indexingMaps[n].onScreenPathIndexMap[p];if(i.isVisible&&this.currElementVisible){this.currElementVisible();}}};return a;});
