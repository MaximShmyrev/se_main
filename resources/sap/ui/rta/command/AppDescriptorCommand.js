/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/rta/command/BaseCommand","sap/ui/fl/write/_internal/appVariant/AppVariantInlineChangeFactory","sap/ui/fl/descriptorRelated/api/DescriptorChangeFactory"],function(B,A,D){"use strict";var a=B.extend("sap.ui.rta.command.AppDescriptor",{metadata:{library:"sap.ui.rta",properties:{reference:{type:"string"},appComponent:{type:"object"},layer:{type:"string"},changeType:{type:"string"},parameters:{type:"object"},texts:{type:"object"}},events:{}}});a.prototype.needsReload=true;a.prototype.prepare=function(f){this.setLayer(f.layer);return true;};a.prototype.getPreparedChange=function(){return this._oPreparedChange;};a.prototype.createAndStoreChange=function(){return A.createDescriptorInlineChange({changeType:this.getChangeType(),content:this.getParameters(),texts:this.getTexts()}).then(function(o){return new D().createNew(this.getReference(),o,this.getLayer(),this.getAppComponent());}.bind(this)).then(function(o){var c=o.store();this._oPreparedChange=c;}.bind(this));};return a;});
