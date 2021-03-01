/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log"],function(L){"use strict";var P="visible";var H={};H.applyChange=function(c,C,p){c.setRevertData({originalValue:p.modifier.getVisible(C)});p.modifier.setVisible(C,false);return true;};H.revertChange=function(c,C,p){var r=c.getRevertData();if(r){p.modifier.setVisible(C,r.originalValue);c.resetRevertData();}else{L.error("Attempt to revert an unapplied change.");return false;}return true;};H.completeChangeContent=function(){};H.getCondenserInfo=function(c){return{affectedControl:c.getSelector(),classification:sap.ui.fl.condenser.Classification.Reverse,uniqueKey:P};};return H;},true);