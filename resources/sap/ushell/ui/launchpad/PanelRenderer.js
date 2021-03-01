// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(function(){"use strict";var P={};P.render=function(r,c){if(!c.getVisible()){return;}r.write("<section");r.writeControlData(c);r.addClass("sapMPanel");r.addClass("sapUshellPanel");if(!c.getTranslucent()){r.addClass("sapMPanelBG");}r.addStyle("width",c.getWidth());r.addStyle("height",c.getHeight());r.writeClasses();r.writeStyles();r.write(">");var h=c.getHeaderContent();var l=h.length;if(c.getHeaderText()||l>0||c.getHeaderBar()){r.write("<header");r.addClass("sapMPanelHdr");r.addClass("sapUshellCatalogHeader");r.writeClasses();r.write(">");if(c.getHeaderText()||l>0){r.write("<");r.write(c.getHeaderLevel().toLowerCase());r.write(">");if(c.getHeaderText()){r.writeEscaped(c.getHeaderText());}for(var j=0;j<l;j++){r.renderControl(h[j]);}r.write("</");r.write(c.getHeaderLevel().toLowerCase());r.write(">");}if(c.getHeaderBar()){r.renderControl(c.getHeaderBar());}r.write("</header>");}r.write("<div");r.addClass("sapMPanelContent");r.addClass("sapUshellPanelContent");r.writeClasses();r.write(">");var C=c.getContent();var L=C.length;for(var i=0;i<L;i++){r.renderControl(C[i]);}r.write("</div>");r.write("</section>");};return P;},true);
