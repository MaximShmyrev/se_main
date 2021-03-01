// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/library","sap/ui/core/Renderer","sap/m/GroupHeaderListItemRenderer"],function(c,R,G){"use strict";var T=c.TextDirection;var C=R.extend(G);C.renderLIAttributes=function(r,l){G.renderLIAttributes(r,l);r.addClass("sapUshellCGHLIContent");};C.renderLIContent=function(r,l){var t=l.getTitleTextDirection();r.write("<span");r.writeAttributeEscaped("class","sapMGHLITitle");if(t!==T.Inherit){r.writeAttribute("dir",t.toLowerCase());}r.write(">");r.renderControl(l.getAggregation("_titleText"));if(l.getDescription()){r.write("</br>");r.write("<span class='sapUshellCGHLIDescription'>");r.renderControl(l.getAggregation("_descriptionText"));r.write("</span>");}r.write("</span>");};return C;});
