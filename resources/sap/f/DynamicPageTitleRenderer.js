/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library"],function(l){"use strict";var D={apiVersion:2};D.render=function(r,d){var o=d._getState(),s="sapFDynamicPageTitle",b=d.getBackgroundDesign(),L=d._getARIALabelReferences(d._bExpandedState)||d.DEFAULT_HEADER_TEXT_ID,a=d._getAriaDescribedByReferences();r.openStart("div",d);r.class(s);if(b){r.class(s+b);}r.openEnd();r.openStart("span",d.getId()+"-focusSpan").class("sapFDynamicPageTitleFocusSpan").attr("role","button").attr("aria-expanded",d._bExpandedState).attr("aria-labelledby",L).attr("aria-describedby",a).attr("tabindex",0);r.openEnd().close("span");this._renderTopArea(r,o);this._renderMainArea(r,o);this._renderSnappedExpandedContentArea(r,o);if(o.hasSnappedTitleOnMobile){this._renderSnappedTitleOnMobile(r,o);}r.renderControl(o.expandButton);r.close("div");};D._renderTopArea=function(r,d){if(d.hasTopContent){r.openStart("div",d.id+"-top");r.class("sapFDynamicPageTitleTop");if(d.hasOnlyBreadcrumbs){r.class("sapFDynamicPageTitleTopBreadCrumbsOnly");}if(d.hasOnlyNavigationActions){r.class("sapFDynamicPageTitleTopNavActionsOnly");}r.openEnd();this._renderTopBreadcrumbsArea(r,d);this._renderTopNavigationArea(r,d);r.close("div");}};D._renderTopBreadcrumbsArea=function(r,d){if(d.breadcrumbs){r.openStart("div",d.id+"-breadcrumbs");r.class("sapFDynamicPageTitleTopLeft");r.openEnd();r.renderControl(d.breadcrumbs);r.close("div");}};D._renderTopNavigationArea=function(r,d){if(d.hasNavigationActions){r.openStart("div",d.id+"-topNavigationArea");r.class("sapFDynamicPageTitleTopRight");r.openEnd();r.close("div");}};D._renderMainArea=function(r,d){r.openStart("div",d.id+"-main");r.class("sapFDynamicPageTitleMain");if(!d.hasContent){r.class("sapFDynamicPageTitleMainNoContent");}r.openEnd();r.openStart("div");r.class("sapFDynamicPageTitleMainInner");r.openEnd();this._renderMainHeadingArea(r,d);this._renderMainContentArea(r,d);this._renderMainActionsArea(r,d);r.close("div");this._renderMainNavigationArea(r,d);r.close("div");};D._renderMainHeadingArea=function(r,d){r.openStart("div",d.id+"-left-inner");r.class("sapFDynamicPageTitleMainHeading");r.style("flex-shrink",d.headingAreaShrinkFactor);r.openEnd();r.openStart("div");r.class("sapFDynamicPageTitleHeading-CTX");r.class("sapFDynamicPageTitleMainHeadingInner");r.openEnd();if(d.heading){r.renderControl(d.heading);}else{if(d.snappedHeading){D._renderSnappedHeading(r,d);}if(d.expandedHeading){D._renderExpandHeading(r,d);}}r.close("div");r.close("div");};D._renderMainContentArea=function(r,d){r.openStart("div",d.id+"-content");r.class("sapFDynamicPageTitleMainContent");r.class("sapFDynamicPageTitleContent-CTX");r.style("flex-shrink",d.contentAreaShrinkFactor);if(d.contentAreaFlexBasis){r.style("flex-basis",d.contentAreaFlexBasis);}r.openEnd();d.content.forEach(r.renderControl,r);r.close("div");};D._renderMainActionsArea=function(r,d){r.openStart("div",d.id+"-mainActions");r.class("sapFDynamicPageTitleMainActions");r.style("flex-shrink",d.actionsAreaShrinkFactor);if(d.actionsAreaFlexBasis){r.style("flex-basis",d.actionsAreaFlexBasis);}r.openEnd();if(d.hasActions){r.renderControl(d.actionBar);}r.close("div");};D._renderMainNavigationArea=function(r,d){if(d.hasNavigationActions){r.openStart("div",d.id+"-mainNavigationAreaWrapper");r.class("sapFDynamicPageTitleMainNavigationArea");r.openEnd();r.renderControl(d.separator);r.openStart("div",d.id+"-mainNavigationArea");r.class("sapFDynamicPageTitleMainNavigationAreaInner");r.openEnd();r.close("div");r.close("div");}};D._renderSnappedExpandedContentArea=function(r,d){if(d.hasAdditionalContent){r.openStart("div");r.class("sapFDynamicPageTitleMainHeadingSnappedExpandContent");r.openEnd();if(d.hasSnappedContent&&!d.hasSnappedTitleOnMobile){D._renderSnappedContent(r,d);}if(d.hasExpandedContent){D._renderExpandContent(r,d);}r.close("div");}};D._renderExpandHeading=function(r,d){r.openStart("div",d.id+"-expand-heading-wrapper");r.openEnd();r.renderControl(d.expandedHeading);r.close("div");};D._renderSnappedHeading=function(r,d){r.openStart("div",d.id+"-snapped-heading-wrapper");if(!d.isSnapped){r.class("sapUiHidden");}r.openEnd();r.renderControl(d.snappedHeading);r.close("div");};D._renderExpandContent=function(r,d){r.openStart("div",d.id+"-expand-wrapper");r.openEnd();d.expandedContent.forEach(r.renderControl,r);r.close("div");};D._renderSnappedContent=function(r,d){r.openStart("div",d.id+"-snapped-wrapper");if(!d.isSnapped){r.class("sapUiHidden");}r.class("sapFDynamicPageTitleSnapped");r.openEnd();d.snappedContent.forEach(r.renderControl,r);r.close("div");};D._renderSnappedTitleOnMobile=function(r,d){r.openStart("div",d.id+"-snapped-title-on-mobile-wrapper");if(!d.isSnapped){r.class("sapUiHidden");}r.class("sapFDynamicPageTitleSnappedTitleOnMobile");r.openEnd();r.renderControl(d.snappedTitleOnMobileContext);r.renderControl(d.snappedTitleOnMobileIcon);r.close("div");};return D;},true);
