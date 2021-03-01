/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/ui/core/Core","sap/ui/core/IconPool","sap/m/Dialog","sap/m/Button","sap/m/Bar","sap/m/Title","sap/m/Toolbar","sap/m/ToggleButton"],function(l,C,I,D,B,a,T,b,c){"use strict";var d=l.TitleAlignment;return function(){this.getPickerTitle=function(){return this.getPopover().getCustomHeader().getContentMiddle()[0];};this.getOkButton=function(){var p=this.getPopover(),o=p&&p.getBeginButton();return o||null;};this.getCancelButton=function(){var p=this.getPopover(),o=p&&p.getCustomHeader()&&p.getCustomHeader().getContentRight&&p.getCustomHeader().getContentRight()[0];return o||null;};this.getFilterSelectedButton=function(){var p=this.getPopover(),o=p&&p.getSubHeader()&&p.getSubHeader().getContent()[1];return o||null;};this.setOkPressHandler=function(h){var o=this.getOkButton();o&&o.attachPress(h);return o;};this.setCancelPressHandler=function(h){var o=this.getCancelButton();o&&o.attachPress(h);return o;};this.setShowSelectedPressHandler=function(h){var f=this.getFilterSelectedButton();f&&f.attachPress(h);return f;};this.createPopover=function(i,p,o){var m=C.getLibraryResourceBundle("sap.m"),t=this;return new D(i.getId()+"-popup",{beginButton:new B(i.getId()+"-popup-closeButton",{text:m.getText("SUGGESTIONSPOPOVER_CLOSE_BUTTON")}),stretch:true,titleAlignment:d.Auto,customHeader:new a(i.getId()+"-popup-header",{titleAlignment:d.Auto,contentMiddle:new T(),contentRight:new B({icon:I.getIconURI("decline")})}),subHeader:_(o,p),horizontalScrolling:false,initialFocus:p,beforeOpen:function(){t._updatePickerHeaderTitle();},afterClose:function(){i.focus();l.closeKeyboard();}});};this._updatePickerHeaderTitle=function(){var r=C.getLibraryResourceBundle("sap.m"),p=this.getPickerTitle(),L,f;if(!p){return;}f=this._getInputLabels();if(f.length){L=f[0];if(L&&(typeof L.getText==="function")){p.setText(L.getText());}}else{p.setText(r.getText("COMBOBOX_PICKER_TITLE"));}return p;};this._getInputLabels=function(){return this._fnInputLabels();};function _(o,p){var f=[p];if(o.showSelectedButton){f.push(e());}return new b({content:f});}function e(){var i=I.getIconURI("multiselect-all");return new c({icon:i});}};});
