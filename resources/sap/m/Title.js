/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','./library','sap/ui/core/library','./TitleRenderer',"sap/m/HyphenationSupport"],function(C,l,c,T,H){"use strict";var a=c.TextDirection;var b=c.TextAlign;var d=c.TitleLevel;var W=l.WrappingType;var e=C.extend("sap.m.Title",{metadata:{library:"sap.m",interfaces:["sap.ui.core.IShrinkable","sap.m.IHyphenation"],properties:{text:{type:"string",group:"Appearance",defaultValue:null},level:{type:"sap.ui.core.TitleLevel",group:"Appearance",defaultValue:d.Auto},titleStyle:{type:"sap.ui.core.TitleLevel",group:"Appearance",defaultValue:d.Auto},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:b.Initial},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:a.Inherit},wrapping:{type:"boolean",group:"Appearance",defaultValue:false},wrappingType:{type:"sap.m.WrappingType",group:"Appearance",defaultValue:W.Normal}},associations:{title:{type:"sap.ui.core.Title",multiple:false}},designtime:"sap/m/designtime/Title.designtime"}});e.prototype._getTitle=function(){var t=this.getTitle();if(t){var o=sap.ui.getCore().byId(t);if(o&&o instanceof sap.ui.core.Title){return o;}}return null;};e.prototype._onTitleChanged=function(){this.invalidate();};e.prototype.setTitle=function(t){var f=this;var o=this._getTitle();if(o){o.invalidate=o.__sapui5_title_originvalidate;o.exit=o.__sapui5_title_origexit;delete o.__sapui5_title_origexit;delete o.__sapui5_title_originvalidate;}this.setAssociation("title",t);var n=this._getTitle();if(n){n.__sapui5_title_originvalidate=n.invalidate;n.__sapui5_title_origexit=n.exit;n.exit=function(){f._onTitleChanged();if(this.__sapui5_title_origexit){this.__sapui5_title_origexit.apply(this,arguments);}};n.invalidate=function(){f._onTitleChanged();this.__sapui5_title_originvalidate.apply(this,arguments);};}return this;};e.prototype.getAccessibilityInfo=function(){var t=this._getTitle()||this;return{role:"heading",description:t.getText(),focusable:false};};e.prototype.getTextsToBeHyphenated=function(){var t=this._getTitle();return{"main":t?t.getText():this.getText()};};e.prototype.getDomRefsForHyphenatedTexts=function(){var D;if(!this._getTitle()){D={"main":this.getDomRef("inner")};}return D;};e.prototype._getAriaLevel=function(){var L=2,f=1;if(this.getTitleStyle()!==d.Auto){L=parseInt(this.getTitleStyle()[f]);}return L;};H.mixInto(e.prototype);return e;});
