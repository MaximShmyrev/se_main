/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/ui/core/InvisibleText","sap/ui/core/ShortcutHintsMixin"],function(l,I,S){"use strict";var B=l.ButtonType;var a={apiVersion:2};a.CSS_CLASS="sapMSB";a.render=function(r,b){var w=b.getWidth(),t=b.getType(),e=b.getEnabled(),T=b.getTitleAttributeValue(),s;r.openStart("div",b).class(a.CSS_CLASS);if(b.getIcon()){r.class(a.CSS_CLASS+"HasIcon");}if(t===B.Accept||t===B.Reject||t===B.Emphasized||t===B.Transparent||t===B.Attention){r.class(a.CSS_CLASS+t);}this.writeAriaAttributes(r,b);r.attr("tabindex",e?"0":"-1");if(T&&!S.isDOMIDRegistered(b.getId())){r.attr("title",T);}if(w!=""||w.toLowerCase()==="auto"){r.style("width",w);}r.openEnd();r.openStart("div").class("sapMSBInner");if(!e){r.class("sapMSBInnerDisabled");}r.openEnd();r.renderControl(b._getTextButton());r.renderControl(b._getArrowButton());r.close("div");if(T){s=b.getId()+"-tooltip";r.openStart("span",s);r.class("sapUiInvisibleText");r.openEnd();r.text(T);r.close("span");}r.close("div");};a.writeAriaAttributes=function(r,b){var A={};this.writeAriaRole(b,A);this.writeAriaLabelledBy(b,A);r.accessibilityState(b,A);};a.writeAriaRole=function(b,A){A["role"]="group";};a.writeAriaLabelledBy=function(b,A){var s="",o=b.getButtonTypeAriaLabelId(),t=b.getTitleAttributeValue(),T;if(b.getText()){s+=b._getTextButton().getId()+"-content";s+=" ";}if(o){s+=o;s+=" ";}if(t){T=b.getId()+"-tooltip";s+=T+" ";}s+=I.getStaticId("sap.m","SPLIT_BUTTON_DESCRIPTION")+" ";s+=I.getStaticId("sap.m","SPLIT_BUTTON_KEYBOARD_HINT");A["labelledby"]={value:s,append:true};};return a;},true);
