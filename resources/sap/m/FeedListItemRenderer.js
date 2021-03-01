/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ListItemBaseRenderer","sap/ui/core/Renderer","sap/ui/Device"],function(L,R,D){"use strict";var F=R.extend(L);F.renderLIAttributes=function(r,c){r.addClass("sapMFeedListItemTitleDiv");r.addClass("sapMFeedListShowSeparatorsAll");};F.renderLIContent=function(r,c){var m=c.getId(),i=D.system.phone;r.write('<div');r.addClass('sapMFeedListItem');r.writeClasses();r.write('>');if(c.getShowIcon()){this._writeImageControl(r,c,m);}if(c.getActions().length>0){r.write("<div");r.writeAttributeEscaped("id",m+"-action-button");r.addClass('sapMFeedListItemActionButton');r.writeClasses();r.write(">");r.renderControl(c.getAggregation("_actionButton"));r.write("</div>");}if(i){r.write('<div class= "sapMFeedListItemHeader sapUiSelectable ');if(c.getShowIcon()){r.write('sapMFeedListItemHasFigure ');}if(c.getSender()&&c.getTimestamp()){r.write('sapMFeedListItemFullHeight');}r.write('" >');if(c.getSender()){r.write('<p id="'+m+'-name" class="sapMFeedListItemTextName sapUiSelectable">');r.renderControl(c._getLinkSender(false));r.write('</p>');}if(c.getTimestamp()){r.write('<p id="'+m+'-timestamp" class="sapMFeedListItemTimestamp sapUiSelectable">');r.writeEscaped(c.getTimestamp());r.write('</p>');}r.write('</div>');r.write('<div class="sapMFeedListItemText sapUiSelectable">');this._writeText(r,c,m,i);if(c._checkTextIsExpandable()){this._writeCollapsedText(r,c,m);}else{r.write(c._sFullText);r.write('</span>');}r.write('</div>');if(c.getInfo()){r.write('<p class="sapMFeedListItemFooter sapUiSelectable">');if(c.getInfo()){r.write('<span id="'+m+'-info" class="sapMFeedListItemInfo sapUiSelectable">');r.writeEscaped(c.getInfo());r.write('</span>');}r.write('</p>');}}else{r.write('<div class= "sapMFeedListItemText ');if(c.getShowIcon()){r.write('sapMFeedListItemHasFigure');}r.write('" >');r.write('<div id="'+m+'-text" class="sapMFeedListItemTextText sapUiSelectable">');if(c.getSender()){r.write('<span id="'+m+'-name" class="sapMFeedListItemTextName sapUiSelectable">');r.renderControl(c._getLinkSender(true));r.write('</span>');}this._writeText(r,c,m,i);if(c._checkTextIsExpandable()){this._writeCollapsedText(r,c,m);}else{r.write(c._sFullText);r.write('</span>');}r.write('</div>');if(c.getInfo()||c.getTimestamp()){r.write('<p class="sapMFeedListItemFooter sapUiSelectable">');if(!sap.ui.getCore().getConfiguration().getRTL()){if(c.getInfo()){this._writeInfo(r,c,m);if(c.getTimestamp()){r.write("<span>&#160&#160&#x00B7&#160&#160</span>");}}if(c.getTimestamp()){this._writeTimestamp(r,c,m);}}else{if(c.getTimestamp()){this._writeTimestamp(r,c,m);}if(c.getInfo()){if(c.getTimestamp()){r.write("<span>&#160&#160&#x00B7&#160&#160</span>");}this._writeInfo(r,c,m);}}r.write('</p>');}r.write('</div>');}r.write('</div>');};F._writeImageControl=function(r,c,i){r.write('<figure id="'+i+'-figure"');r.addClass('sapMFeedListItemFigure');if(!c.getIcon()){r.addClass('sapMFeedListItemIsDefaultIcon');}r.writeClasses();r.write('>');r.renderControl(c._getImageControl());r.write('</figure>');};F._writeCollapsedText=function(r,c,i){if(c._bTextExpanded){r.write(c._sFullText);r.write('</span>');r.write('<span id="'+i+'-threeDots" class ="sapMFeedListItemTextString">');r.write("&#32");r.write('</span>');}else{r.write(c._sShortText);r.write('</span>');r.write('<span id="'+i+'-threeDots" class ="sapMFeedListItemTextString">');r.write("&#32&#46&#46&#46&#32");r.write('</span>');}var l=c._getLinkExpandCollapse();l.addStyleClass("sapMFeedListItemLinkExpandCollapse");r.renderControl(l);};F._writeTimestamp=function(r,c,i){r.write('<span id="'+i+'-timestamp"');r.addClass('sapMFeedListItemTimestampText');r.addClass('sapUiSelectable');if(c.getUnread()){r.addClass('sapMFeedListItem-Unread');}r.writeClasses();r.write(">");r.writeEscaped(c.getTimestamp());r.write('</span>');};F._writeInfo=function(r,c,i){r.write('<span id="'+i+'-info"');r.addClass('sapMFeedListItemInfoText');r.addClass('sapUiSelectable');if(c.getUnread()){r.addClass('sapMFeedListItem-Unread');}r.writeClasses();r.write(">");r.writeEscaped(c.getInfo());r.write('</span>');};F._writeText=function(r,c,i,I){r.write('<span id="'+i+'-realtext"');I?r.addClass('sapMFeedListItemText'):r.addClass('sapMFeedListItemTextString');r.addClass('sapMFeedListItemText');r.addClass('sapUiSelectable');if(c.getUnread()){r.addClass('sapMFeedListItem-Unread');}r.writeClasses();r.write(">");};return F;},true);