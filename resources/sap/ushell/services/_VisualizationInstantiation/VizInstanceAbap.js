// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/_VisualizationInstantiation/VizInstance","sap/m/library","sap/base/Log"],function(V,m,L){"use strict";var a=m.LoadState;var b=V.extend("sap.ushell.ui.launchpad.VizInstanceAbap",{metadata:{library:"sap.ushell"},fragment:"sap.ushell.services._VisualizationInstantiation.VizInstanceAbap"});b.prototype.init=function(){V.prototype.init.apply(this,arguments);this._oChipInstancePromise=sap.ushell.Container.getServiceAsync("PageBuilding").then(function(p){var f=p.getFactory();var i=this.getInstantiationData();var r;var B;if(!i.simplifiedChipFormat){r={chipId:i.chip.id,chip:i.chip};}else{var s=i.chip||{};B=s.bags;r={chipId:s.chipId,configuration:s.configuration?JSON.stringify(s.configuration):"{}"};}var c=f.createChipInstance(r);this._addBagDataToChipInstance(c,B);return c;}.bind(this));};b.prototype._addBagDataToChipInstance=function(c,B){if(!B){return;}var o;var d;var s;var p;for(s in B){o=B[s];d=c.getBag(s);try{for(p in o.properties){d.setProperty(p,o.properties[p]);}for(p in o.texts){d.setText(p,o.texts[p]);}}catch(e){L.error("VizInstanceAbap._addBagDataToChipInstance: "+e.toString());}}};b.prototype.load=function(i){return this._oChipInstancePromise.then(function(r){this._oChipInstance=r;return new Promise(this._oChipInstance.load);}.bind(this)).then(function(){if(i){var p=this._oChipInstance.getContract("preview");if(!p){return Promise.reject(new Error("The chip instance has no preview contract"));}p.setEnabled(true);}var v=this._oChipInstance.getImplementationAsSapui5();var w=parseInt(this._oChipInstance.getConfigurationParameter("col"),10)||1;var h=parseInt(this._oChipInstance.getConfigurationParameter("row"),10)||1;w=w*2;h=h*2;this.setWidth(w);this.setHeight(h);this._setContent(v);return Promise.resolve();}.bind(this)).catch(function(e){this.setState(a.Failed);return Promise.reject(e);}.bind(this));};b.prototype._setVisible=function(v){var o=this._oChipInstance&&!this._oChipInstance.isStub()&&this._oChipInstance.getContract("visible");if(o){o.setVisible(v);}};b.prototype.refresh=function(){if(this._oChipInstance){this._oChipInstance.refresh();}};b.prototype.setActive=function(c,r){this._setVisible(c);if(r){this.refresh();}return this.setProperty("active",c,false);};return b;});