/*!
 * SAPUI5

(c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(['sap/viz/library','./core/BaseChart','./TreemapRenderer'],function(l,B){"use strict";var T=B.extend("sap.viz.ui5.Treemap",{metadata:{library:"sap.viz",aggregations:{general:{type:"sap.viz.ui5.types.RootContainer",multiple:false},title:{type:"sap.viz.ui5.types.Title",multiple:false},legendGroup:{type:"sap.viz.ui5.types.Legend",multiple:false},legend:{type:"sap.viz.ui5.types.legend.Common",multiple:false},xyContainer:{type:"sap.viz.ui5.types.XYContainer",multiple:false},dataLabel:{type:"sap.viz.ui5.types.Datalabel",multiple:false},plotArea:{type:"sap.viz.ui5.types.Treemap",multiple:false},toolTip:{type:"sap.viz.ui5.types.Tooltip",multiple:false},interaction:{type:"sap.viz.ui5.types.controller.Interaction",multiple:false}},events:{selectData:{},deselectData:{},showTooltip:{deprecated:true},hideTooltip:{deprecated:true},initialized:{}},vizChartType:"viz/treemap"}});return T;});
