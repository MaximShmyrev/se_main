/*!
 * SAPUI5

(c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Core","sap/ui/core/library"],function(C,c){"use strict";sap.ui.getCore().initLibrary({name:"sap.makit",dependencies:["sap.ui.core"],types:["sap.makit.ChartType","sap.makit.LegendPosition","sap.makit.SortOrder","sap.makit.ValueBubblePosition","sap.makit.ValueBubbleStyle"],interfaces:[],controls:["sap.makit.Chart","sap.makit.CombinationChart"],elements:["sap.makit.Axis","sap.makit.Category","sap.makit.CategoryAxis","sap.makit.Column","sap.makit.Layer","sap.makit.MakitLib","sap.makit.Row","sap.makit.Series","sap.makit.Value","sap.makit.ValueAxis","sap.makit.ValueBubble"],version:"1.86.3"});sap.makit.ChartType={Column:"Column",Line:"Line",Bubble:"Bubble",Bar:"Bar",Pie:"Pie",Donut:"Donut",StackedColumn:"StackedColumn",HundredPercentStackedColumn:"HundredPercentStackedColumn",WaterfallColumn:"WaterfallColumn",WaterfallBar:"WaterfallBar"};sap.makit.LegendPosition={Top:"Top",Left:"Left",Bottom:"Bottom",Right:"Right",None:"None"};sap.makit.SortOrder={Ascending:"Ascending",Descending:"Descending",Partial:"Partial",None:"None"};sap.makit.ValueBubblePosition={Top:"Top",Side:"Side"};sap.makit.ValueBubbleStyle={Top:"Top",Float:"Float",FloatTop:"FloatTop"};return sap.makit;});
