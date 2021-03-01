/*!
 * SAPUI5

        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(['sap/base/util/Version','sap/base/Log'],function(V,L){"use strict";var T={};T.render=function(r,c){var u=new V(sap.ui.getCore().getConfiguration().getCompatibilityVersion("sapMeTabContainer"));if(u.compareTo("1.16")>=0){L.error("The sap.me.TabContainer control is not supported as of SAPUI5 version 1.16. Please us sap.m.IconTabBar instead.");return;}if(!c.getVisible()){return;}r.write("<div");r.writeControlData(c);r.addClass("sapUIMeTabContainer");r.writeClasses();r.writeStyles();r.write(">");r.write("<div ");r.addClass("sapUIMeTabContainerButtons");r.writeClasses();r.write(">");var b=c.getAggregation("tabs");var I=c.getSelectedTab();var a=c.getAggregation("badges");if(b){if(Array.isArray(b)){for(var i=0;i<b.length;i++){if(c._getContentForBtn(b[i].getId())){r.write("<div ");r.addClass("sapUIMeTabContainerTab");if(i===I){r.addClass("sapUIMeTabContainerTabSelected");}r.writeClasses();r.write(">");if(a&&a[i].getText()!=""){r.renderControl(a[i]);}r.renderControl(b[i]);r.write("</div>");}}}else if(b){r.write("<div ");r.addClass("sapUIMeTabContainerTab");r.writeClasses();r.write(">");if(a&&a[0].getText()!=""){r.renderControl(a[0]);}r.renderControl(b);r.write("</div>");}}r.write("</div>");var C=c._getContentForBtn(b[I].getId());if(C!=undefined){r.write("<div ");r.addClass("sapUIMeTabContainerContent");r.writeClasses();r.write(">");r.write("<div id='"+c.getId()+"-arrow'");r.addClass("sapUIMeTabContainerContentArrow");r.writeClasses();r.write(">");r.write("</div>");r.write("<div id='"+c.getId()+"-container'");r.write(" style='height:auto'");r.addClass("sapUIMeTabContainerTabContent");r.writeClasses();r.write(">");r.renderControl(C);r.write("</div>");r.write("</div>");}r.write("</div>");};return T;},true);