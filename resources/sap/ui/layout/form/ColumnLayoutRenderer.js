/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer','sap/ui/Device','./FormLayoutRenderer'],function(R,D,F){"use strict";var C=R.extend(F);C.apiVersion=2;C.getMainClass=function(){return"sapUiFormCL";};C.renderContainers=function(r,l,f){var c=l.getColumnsM();var a=l.getColumnsL();var b=l.getColumnsXL();var d=f.getVisibleFormContainers();var e=d.length;if(e>0){if(e>1||l.getLayoutDataForElement(d[0],"sap.ui.layout.form.ColumnContainerData")){r.openStart("div");r.class("sapUiFormCLContent");r.class("sapUiFormCLColumnsM"+c);r.class("sapUiFormCLColumnsL"+a);r.class("sapUiFormCLColumnsXL"+b);r.openEnd();}for(var i=0;i<e;i++){var o=d[i];this.renderContainer(r,l,o);}if(e>1){r.close("div");}}};C.renderContainer=function(r,l,c){var e=c.getExpandable();var t=c.getToolbar();var T=c.getTitle();var o=l._getContainerSize(c);c._checkProperties();r.openStart("section",c);r.class("sapUiFormCLContainer");r.class("sapUiFormCLContainerS"+o.S.Size);r.class("sapUiFormCLContainerM"+o.M.Size);r.class("sapUiFormCLContainerL"+o.L.Size);r.class("sapUiFormCLContainerXL"+o.XL.Size);if(o.M.Break){r.class("sapUiFormCLContainerMBreak");}if(o.L.Break){r.class("sapUiFormCLContainerLBreak");}if(o.XL.Break){r.class("sapUiFormCLContainerXLBreak");}if(o.S.FirstRow){r.class("sapUiFormCLContainerSFirstRow");}if(o.M.FirstRow){r.class("sapUiFormCLContainerMFirstRow");}if(o.L.FirstRow){r.class("sapUiFormCLContainerLFirstRow");}if(o.XL.FirstRow){r.class("sapUiFormCLContainerXLFirstRow");}if(t){r.class("sapUiFormContainerToolbar");}else if(T){r.class("sapUiFormContainerTitle");}if(!c.getExpanded()){r.class("sapUiFormCLContainerColl");}if(c.getTooltip_AsString()){r.attr('title',c.getTooltip_AsString());}this.writeAccessibilityStateContainer(r,c);r.openEnd();this.renderHeader(r,t,T,c._oExpandButton,e,false,c.getId());r.openStart("div",c.getId()+"-content").class("sapUiFormCLContainerCont").openEnd();var E=c.getVisibleFormElements();for(var i=0;i<E.length;i++){var a=E[i];this.renderElement(r,l,a);if(D.browser.chrome&&i<o.XL.Size-1&&E.length>1&&E.length<=o.XL.Size){r.openStart("div").class("sapUiFormCLElementDummy").openEnd().close("div");}}r.close("div");r.close("section");};C.renderElement=function(r,l,e){var L=e.getLabelControl();var o;r.openStart("div",e);r.class("sapUiFormCLElement");if(e.getTooltip_AsString()){r.attr('title',e.getTooltip_AsString());}r.openEnd();if(L){o=l._getFieldSize(L);r.openStart("div").class("sapUiFormElementLbl").class("sapUiFormCLCellsS"+o.S.Size).class("sapUiFormCLCellsL"+o.L.Size).openEnd();r.renderControl(L);r.close("div");}var f=e.getFieldsForRendering();if(f&&f.length>0){for(var k=0,a=f.length;k<a;k++){var b=f[k];if(!b.isA("sap.ui.core.IFormContent")){throw new Error(b+" is not a valid Form content! Only use valid content in "+l);}o=l._getFieldSize(b);r.openStart("div");r.class("sapUiFormCLCellsS"+o.S.Size);r.class("sapUiFormCLCellsL"+o.L.Size);if(o.S.Break){r.class("sapUiFormCLCellSBreak");}if(o.L.Break){r.class("sapUiFormCLCellLBreak");}if(o.S.Space){r.class("sapUiFormCLCellSSpace"+o.S.Space);}if(o.L.Space){r.class("sapUiFormCLCellLSpace"+o.L.Space);}r.openEnd();r.renderControl(b);r.close("div");}}r.close("div");};return C;},true);
