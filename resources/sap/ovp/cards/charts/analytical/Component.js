sap.ui.define(["sap/ovp/cards/generic/Component","sap/ovp/cards/charts/VizAnnotationManager","sap/ovp/cards/jUtils"],function(C,V,u){"use strict";return C.extend("sap.ovp.cards.charts.analytical.Component",{metadata:{properties:{"headerExtensionFragment":{"type":"string","defaultValue":"sap.ovp.cards.generic.KPIHeader"},"contentFragment":{"type":"string","defaultValue":"sap.ovp.cards.charts.analytical.analyticalChart"},"controllerName":{"type":"string","defaultValue":"sap.ovp.cards.charts.analytical.analyticalChart"}},version:"1.86.1",library:"sap.ovp",includes:[],dependencies:{libs:["sap.viz"],components:[]},config:{}},onAfterRendering:function(){u.setAttributeToMultipleElements(".tabindex0","tabindex",0);u.setAttributeToMultipleElements(".tabindex-1","tabindex",-1);}});});
