// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/model/json/JSONModel","sap/suite/ui/microchart/AreaMicroChartPoint","sap/suite/ui/microchart/AreaMicroChartItem","sap/m/library","sap/ui/thirdparty/jquery"],function(J,A,c,m,q){"use strict";var S=m.Size;var V=m.ValueColor;var D=m.DeviationIndicator;var L=m.LoadState;sap.ui.controller("tiles.indicatorDualTrend.DualTrend",{logError:function(e){this.oDualTrendView.oGenericTile.setState(L.Failed);this.oDualTrendView.oGenericTile.setState(L.Failed);sap.ushell.components.tiles.indicatorTileUtils.util.logError(e);},formSelectStatement:function(o){var t=Object.keys(o);var f="";for(var i=0;i<t.length;i++){if((o[t[i]]!==undefined)&&(o.fullyFormedMeasure)){f+=","+o[t[i]];}}return f;},setThresholdValues:function(){var t=this;try{var T={};T.fullyFormedMeasure=this.DEFINITION_DATA.EVALUATION.COLUMN_NAME;if(this.DEFINITION_DATA.EVALUATION.VALUES_SOURCE=="MEASURE"){switch(this.DEFINITION_DATA.EVALUATION.GOAL_TYPE){case"MI":T.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");T.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;case"MA":T.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");T.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;case"RA":T.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");T.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");T.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;}}else{T.criticalHighValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","FIXED");T.criticalLowValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","FIXED");T.warningHighValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","FIXED");T.warningLowValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","FIXED");T.targetValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","FIXED");T.trendValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","FIXED");}return T;}catch(e){t.logError(e);}},getTrendIndicator:function(t,v){var a=this;t=Number(t);try{var b=D.None;if(t>v){b=D.Down;}else if(t<v){b=D.Up;}return b;}catch(e){a.logError(e);}},getTile:function(){return this.oDualTrendView.oGenericTile;},getTrendColor:function(t){var a=this;try{var i=this.DEFINITION_DATA.EVALUATION.GOAL_TYPE;var r=V.Neutral;if(i==="MI"){if(t.criticalHighValue&&t.warningHighValue){t.criticalHighValue=Number(t.criticalHighValue);t.warningHighValue=Number(t.warningHighValue);if(this.CALCULATED_KPI_VALUE<t.warningHighValue){r=V.Good;}else if(this.CALCULATED_KPI_VALUE<=t.criticalHighValue){r=V.Critical;}else{r=V.Error;}}}else if(i==="MA"){if(t.criticalLowValue&&t.warningLowValue){t.criticalLowValue=Number(t.criticalLowValue);t.warningLowValue=Number(t.warningLowValue);if(this.CALCULATED_KPI_VALUE<t.criticalLowValue){r=V.Error;}else if(this.CALCULATED_KPI_VALUE<=t.warningLowValue){r=V.Critical;}else{r=V.Good;}}}else if(t.warningLowValue&&t.warningHighValue&&t.criticalLowValue&&t.criticalHighValue){t.criticalHighValue=Number(t.criticalHighValue);t.warningHighValue=Number(t.warningHighValue);t.warningLowValue=Number(t.warningLowValue);t.criticalLowValue=Number(t.criticalLowValue);if(this.CALCULATED_KPI_VALUE<t.criticalLowValue||this.CALCULATED_KPI_VALUE>t.criticalHighValue){r=V.Error;}else if((this.CALCULATED_KPI_VALUE>=t.criticalLowValue&&this.CALCULATED_KPI_VALUE<=t.warningLowValue)||(this.CALCULATED_KPI_VALUE>=t.warningHighValue&&this.CALCULATED_KPI_VALUE<=t.criticalHighValue)){r=V.Critical;}else{r=V.Good;}}return r;}catch(e){a.logError(e);}},_updateTileModel:function(n){var a=this.getTile().getModel().getData();q.extend(a,n);this.getTile().getModel().setData(a);},onAfterFinalEvaluation:function(){var t=this;var u=this.DEFINITION_DATA.EVALUATION.ODATA_URL;var E=this.DEFINITION_DATA.EVALUATION.ODATA_ENTITYSET;var M=this.DEFINITION_DATA.EVALUATION.COLUMN_NAME;var v=sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(this.DEFINITION_DATA.EVALUATION_FILTERS,this.DEFINITION_DATA.ADDITIONAL_FILTERS);var d=this.DEFINITION_DATA.TILE_PROPERTIES.dimension;if(d==undefined){this.logError();return;}var g=this.DEFINITION_DATA.EVALUATION.GOAL_TYPE,f=this.DEFINITION_DATA.EVALUATION_VALUES,Q;if(this.DEFINITION_DATA.EVALUATION.VALUES_SOURCE=="MEASURE"){var h=M;switch(g){case"MI":t.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");t.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");t.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");t.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");if(t.sWarningHigh&&t.sCriticalHigh&&t.sTarget){h+=","+t.sWarningHigh+","+t.sCriticalHigh+","+t.sTarget;}break;case"MA":t.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");t.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");t.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");t.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");if(t.sWarningLow&&t.sCriticalLow&&t.sTarget){h+=","+t.sWarningLow+","+t.sCriticalLow+","+t.sTarget;}break;case"RA":t.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");t.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");t.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");t.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");t.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");t.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");if(t.sWarningLow&&t.sCriticalLow&&t.sTarget&&t.sWarningHigh&&t.sCriticalHigh){h+=","+t.sWarningLow+","+t.sCriticalLow+","+t.sTarget+","+t.sWarningHigh+","+t.sCriticalHigh;}break;}Q=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oTileApi.url.addSystemToServiceUrl(u),E,h,d,v);}else{Q=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oTileApi.url.addSystemToServiceUrl(u),E,M,d,v);}var j=sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(t.oConfig.TILE_PROPERTIES.id);if(!j){if(Q){this.queryUriForTrendChart=Q.uri;t.writeData={};try{this.trendChartODataReadRef=Q.model.read(Q.uri,null,null,true,function(a){if(a&&a.results&&a.results.length){if(Q.unit[0]){t.unit=a.results[0][Q.unit[0].name];t.writeData.unit=Q.unit[0];t.writeData.unit.name=Q.unit[0].name;}t.queryUriResponseForTrendChart=a;d=sap.ushell.components.tiles.indicatorTileUtils.util.findTextPropertyForDimension(t.oTileApi.url.addSystemToServiceUrl(u),E,d);a.firstXlabel=a.results[0][d];a.lastXlabel=a.results[a.results.length-1][d];t.writeData.data=a;t.writeData.dimensionName=d;sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,t.writeData);var n=sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system);t.oDualTrendView.oGenericTile.$().wrap("<a href ='"+n+"'></a>");t.oDualTrendView.oGenericTile.setState(L.Loaded);_(a,t.DEFINITION_DATA.EVALUATION.VALUES_SOURCE);}else{t.logError("no Response from QueryServiceUri");}},function(a){if(a&&a.response){t.logError("Data call failed");}});}catch(e){t.logError(e);}}else{t.logError();}v=sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(t.DEFINITION_DATA.EVALUATION_FILTERS,t.DEFINITION_DATA.ADDITIONAL_FILTERS);Q=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oTileApi.url.addSystemToServiceUrl(u),E,M,null,v);if(Q){t.QUERY_SERVICE_MODEL=Q.model;t.queryUriForKpiValue=Q.uri;t.numericODataReadRef=t.QUERY_SERVICE_MODEL.read(Q.uri,null,null,true,function(a){if(a&&a.results&&a.results.length){var s="";var k=a.results[0][t.DEFINITION_DATA.EVALUATION.COLUMN_NAME];t.writeData.numericData=a;if(t.oConfig.EVALUATION.SCALING==-2){k*=100;}s=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(k),t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION);if(t.oConfig.EVALUATION.SCALING==-2){t._updateTileModel({scale:"%"});}var l=t.getTrendIndicator(t.setThresholdValues().trendValue,k);t._updateTileModel({value:s.toString(),valueColor:t.getTrendColor(t.setThresholdValues()),indicator:l});}else{fnError.call(t,"no Response from QueryServiceUri");}});}}else{try{if(j.unit!==undefined){t.unit=j.data.results[0][j.unit.name];}t.queryUriResponseForTrendChart=j.data;d=j.dimensionName;var k=j.numericData.results[0][t.DEFINITION_DATA.EVALUATION.COLUMN_NAME];var l=t.getTrendIndicator(t.setThresholdValues().trendValue,j.data.results[0][t.DEFINITION_DATA.EVALUATION.COLUMN_NAME]);var s=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(k),t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION);t.oDualTrendView.oGenericTile.setState(L.Loaded);_(j.data,t.DEFINITION_DATA.EVALUATION.VALUES_SOURCE);t._updateTileModel({value:s.toString(),valueColor:t.getTrendColor(t.setThresholdValues()),indicator:l});}catch(e){t.logError(e);}}function _(n,o){var p=[];var r=[];var w=[];var x=[];var y=[];var z=[];var B=n.firstXlabel;var C,F,G,H,I;var K=n.lastXlabel;var N=Number(n.results[0][M]);var O=Number(n.results[n.results.length-1][M]);var i;for(i in n.results){n.results[i][d]=Number(i);n.results[i][M]=Number(n.results[i][M]);if(t.sWarningHigh){n.results[i][t.sWarningHigh]=Number(n.results[i][t.sWarningHigh]);}if(t.sCriticalHigh){n.results[i][t.sCriticalHigh]=Number(n.results[i][t.sCriticalHigh]);}if(t.sCriticalLow){n.results[i][t.sCriticalLow]=Number(n.results[i][t.sCriticalLow]);}if(t.sWarningLow){n.results[i][t.sWarningLow]=Number(n.results[i][t.sWarningLow]);}if(t.sTarget){n.results[i][t.sTarget]=Number(n.results[i][t.sTarget]);}if(t.sWarningHigh){w.push(n.results[i][t.sWarningHigh]);}if(t.sCriticalHigh){x.push(n.results[i][t.sCriticalHigh]);}if(t.sCriticalLow){y.push(n.results[i][t.sCriticalLow]);}if(t.sWarningLow){z.push(n.results[i][t.sWarningLow]);}p.push(n.results[i][d]);r.push(n.results[i][M]);}try{B=sap.ushell.components.tiles.indicatorTileUtils.util.formatOdataObjectToString(B);K=sap.ushell.components.tiles.indicatorTileUtils.util.formatOdataObjectToString(K);}catch(e){t.logError(e);}var P=Number(N);if(t.oConfig.EVALUATION.SCALING==-2){P*=100;}var R=Math.min.apply(Math,r);var T=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(P,t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION);if(t.oConfig.EVALUATION.SCALING==-2){T+=" %";}var U=T.toString();var W=Number(O);if(t.oConfig.EVALUATION.SCALING==-2){W*=100;}var X=Math.max.apply(Math,r);var Y=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(W,t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION);if(t.oConfig.EVALUATION.SCALING==-2){Y+=" %";}var Z=Y.toString();try{var $=sap.ushell.components.tiles.indicatorTileUtils.util.formatOdataObjectToString(Math.min.apply(Math,p));var a1=sap.ushell.components.tiles.indicatorTileUtils.util.formatOdataObjectToString(Math.max.apply(Math,p));}catch(e){t.logError(e);}if(o=="MEASURE"){if(w.length!=0){t.firstwH=w[$];t.lastwH=w[a1];}if(x.length!=0){t.firstcH=x[$];t.lastcH=x[a1];}if(y.length!=0){t.firstcL=y[$];t.lastcL=y[a1];}if(z.length!=0){t.firstwL=z[$];t.lastwL=z[a1];}}var b1={width:"100%",height:"100%",unit:t.unit||"",chart:{color:"Neutral",data:n.results},size:"Auto",minXValue:$,maxXValue:a1,minYValue:R,maxYValue:X,firstXLabel:{label:B+"",color:"Neutral"},lastXLabel:{label:K+"",color:"Neutral"},firstYLabel:{label:U+"",color:"Neutral"},lastYLabel:{label:Z+"",color:"Neutral"},minLabel:{},maxLabel:{}},c1;switch(g){case"MA":for(i in f){if(f[i].TYPE=="CL"){b1.minThreshold={color:"Error"};c1={};c1[d]="";c1[M]=Number(f[i].FIXED);t.cl=Number(f[i].FIXED);b1.minThreshold.data=(o=="MEASURE")?n.results:[c1];C=(o=="MEASURE")?t.sCriticalLow:M;}else if(f[i].TYPE=="WL"){b1.maxThreshold={color:"Good"};c1={};c1[d]="";c1[M]=Number(f[i].FIXED);b1.maxThreshold.data=(o=="MEASURE")?n.results:[c1];F=(o=="MEASURE")?t.sWarningLow:M;t.wl=Number(f[i].FIXED);}else if(f[i].TYPE=="TA"){c1={};c1[d]="";c1[M]=Number(f[i].FIXED);b1.target={color:"Neutral"};b1.target.data=(o=="MEASURE")?n.results:[c1];I=(o=="MEASURE")?t.sTarget:M;}}b1.innerMinThreshold={data:[]};b1.innerMaxThreshold={data:[]};if(o=="FIXED"){b1.firstYLabel.color=N<t.cl?"Error":((t.cl<=N)&&(N<=t.wl))?"Critical":(N>t.wl)?"Good":"Neutral";b1.lastYLabel.color=O<t.cl?"Error":((t.cl<=O)&&(O<=t.wl))?"Critical":(O>t.wl)?"Good":"Neutral";}else if(o=="MEASURE"&&t.firstwL&&t.lastwL&&t.firstcL&&t.lastcL){b1.firstYLabel.color=N<t.firstcL?"Error":((t.firstcL<=N)&&(N<=t.firstwL))?"Critical":(N>t.firstwL)?"Good":"Neutral";b1.lastYLabel.color=O<t.lastcL?"Error":((t.lastcL<=O)&&(O<=t.lastwL))?"Critical":(O>t.lastwL)?"Good":"Neutral";}break;case"MI":for(i in f){if(f[i].TYPE=="CH"){c1={};c1[d]="";c1[M]=Number(f[i].FIXED);t.ch=Number(f[i].FIXED);b1.maxThreshold={color:"Error"};b1.maxThreshold.data=(o=="MEASURE")?n.results:[c1];F=(o=="MEASURE")?t.sCriticalHigh:M;}else if(f[i].TYPE=="WH"){c1={};c1[d]="";c1[M]=Number(f[i].FIXED);t.wh=Number(f[i].FIXED);b1.minThreshold={color:"Good"};b1.minThreshold.data=(o=="MEASURE")?n.results:[c1];C=(o=="MEASURE")?t.sWarningHigh:M;}else if(f[i].TYPE=="TA"){c1={};c1[d]="";c1[M]=Number(f[i].FIXED);b1.target={color:"Neutral"};b1.target.data=(o=="MEASURE")?n.results:[c1];I=(o=="MEASURE")?t.sTarget:M;}}if(o=="FIXED"){b1.firstYLabel.color=N>t.ch?"Error":((t.wh<=N)&&(N<=t.ch))?"Critical":(N<t.wh)?"Good":"Neutral";b1.lastYLabel.color=O>t.ch?"Error":((t.wh<=O)&&(O<=t.ch))?"Critical":(O<t.wh)?"Good":"Neutral";}else if(o=="MEASURE"&&t.firstwH&&t.lastwH&&t.firstcH&&t.lastcH){b1.firstYLabel.color=N>t.firstcH?"Error":((t.firstwH<=N)&&(N<=t.firstcH))?"Critical":(N<t.firstwH)?"Good":"Neutral";b1.lastYLabel.color=O>t.lastcH?"Error":((t.lastwH<=O)&&(O<=t.lastcH))?"Critical":(O<t.lastwH)?"Good":"Neutral";}b1.innerMaxThreshold={data:[]};b1.innerMinThreshold={data:[]};break;case"RA":for(i in f){if(f[i].TYPE=="CH"){c1={};c1[d]="";c1[M]=Number(f[i].FIXED);t.ch=Number(f[i].FIXED);b1.maxThreshold={color:"Error"};b1.maxThreshold.data=(o=="MEASURE")?n.results:[c1];F=(o=="MEASURE")?t.sCriticalHigh:M;}else if(f[i].TYPE=="WH"){c1={};c1[d]="";c1[M]=Number(f[i].FIXED);t.wh=Number(f[i].FIXED);b1.innerMaxThreshold={color:"Good"};b1.innerMaxThreshold.data=(o=="MEASURE")?n.results:[c1];H=(o=="MEASURE")?t.sWarningHigh:M;}else if(f[i].TYPE=="WL"){c1={};c1[d]="";c1[M]=Number(f[i].FIXED);t.wl=Number(f[i].FIXED);b1.innerMinThreshold={color:"Good"};b1.innerMinThreshold.data=(o=="MEASURE")?n.results:[c1];G=(o=="MEASURE")?t.sWarningLow:M;}else if(f[i].TYPE=="CL"){c1={};c1[d]="";c1[M]=Number(f[i].FIXED);t.cl=Number(f[i].FIXED);b1.minThreshold={color:"Error"};b1.minThreshold.data=(o=="MEASURE")?n.results:[c1];C=(o=="MEASURE")?t.sCriticalLow:M;}else if(f[i].TYPE=="TA"){c1={};c1[d]="";c1[M]=Number(f[i].FIXED);b1.target={color:"Neutral"};b1.target.data=(o=="MEASURE")?n.results:[c1];I=(o=="MEASURE")?t.sTarget:M;}}if(o=="FIXED"){b1.firstYLabel.color=(N>t.ch||N<t.cl)?"Error":((t.wh<=N)&&(N<=t.ch))||((t.cl<=N)&&(N<=t.wl))?"Critical":((N>=t.wl)&&(N<=t.wh))?"Good":"Neutral";b1.lastYLabel.color=(O>t.ch||O<t.cl)?"Error":((t.wh<=O)&&(O<=t.ch))||((t.cl<=O)&&(O<=t.wl))?"Critical":((O>=t.wl)&&(O<=t.wh))?"Good":"Neutral";}else if(o=="MEASURE"&&t.firstwL&&t.lastwL&&t.firstcL&&t.lastcL&&t.firstwH&&t.lastwH&&t.firstcH&&t.lastcH){b1.firstYLabel.color=(N>t.firstcH||N<t.firstcL)?"Error":((t.firstwH<=N)&&(N<=t.firstcH))||((t.firstcL<=N)&&(N<=t.firstwL))?"Critical":((N>=t.firstwL)&&(N<=t.firstwH))?"Good":"Neutral";b1.lastYLabel.color=(O>t.lastcH||O<t.lastcL)?"Error":((t.lastwH<=O)&&(O<=t.lastcH))||((t.lastcL<=O)&&(O<=t.lastwL))?"Critical":((O>=t.lastwL)&&(O<=t.lastwH))?"Good":"Neutral";}break;}var d1=function(e1,a,b){return new c({color:"{/"+e1+"/color}",points:{path:"/"+e1+"/data",template:new A({x:"{"+a+"}",y:"{"+b+"}"})}});};t.getTile().getTileContent()[1].getContent().setTarget(d1("target",d,I));t.getTile().getTileContent()[1].getContent().setInnerMinThreshold(d1("innerMinThreshold",d,G));t.getTile().getTileContent()[1].getContent().setInnerMaxThreshold(d1("innerMaxThreshold",d,H));t.getTile().getTileContent()[1].getContent().setMinThreshold(d1("minThreshold",d,C));t.getTile().getTileContent()[1].getContent().setMaxThreshold(d1("maxThreshold",d,F));t.getTile().getTileContent()[1].getContent().setChart(d1("chart",d,M));t._updateTileModel(b1);}},flowWithoutDesignTimeCall:function(){this.DEFINITION_DATA=this.oConfig;this._updateTileModel(this.DEFINITION_DATA);if(this.oTileApi.visible.isVisible()&&!this.firstTimeVisible){this.firstTimeVisible=true;}this.onAfterFinalEvaluation();},flowWithDesignTimeCall:function(){var t=this;try{var a=sap.ushell.components.tiles.indicatorTileUtils.cache.getEvaluationById(this.oConfig.EVALUATION.ID);if(a){t.oConfig.EVALUATION_FILTERS=a.EVALUATION_FILTERS;t.flowWithoutDesignTimeCall();}else{sap.ushell.components.tiles.indicatorTileUtils.util.getFilterFromRunTimeService(this.oConfig,function(f){t.oConfig.EVALUATION_FILTERS=f;sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(t.oConfig.TILE_PROPERTIES.id,t.oConfig);t.flowWithoutDesignTimeCall();});}}catch(e){this.logError(e);}},refreshHandler:function(C){if(!C.firstTimeVisible){if(Number(this.oTileApi.configuration.getParameterValueAsString("isSufficient"))){C.flowWithoutDesignTimeCall();}else{C.flowWithDesignTimeCall();}}},visibleHandler:function(i){if(!i){this.firstTimeVisible=false;sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.trendChartODataReadRef);}if(i){this.refreshHandler(this);}},setTextInTile:function(){var t=this;this._updateTileModel({header:t.oTileApi.preview.getTitle()||sap.ushell.components.tiles.indicatorTileUtils.util.getChipTitle(t.oConfig),subheader:t.oTileApi.preview.getDescription()||sap.ushell.components.tiles.indicatorTileUtils.util.getChipSubTitle(t.oConfig)});},onInit:function(){var t=this;this.firstTimeVisible=false;this.oDualTrendView=this.getView();this.oViewData=this.oDualTrendView.getViewData();this.oTileApi=this.oViewData.chip;if(this.oTileApi.visible){this.oTileApi.visible.attachVisible(this.visibleHandler.bind(this));}this.system=this.oTileApi.url.getApplicationSystem();this.oDualTrendView.oGenericTile.setState(L.Loading);if(this.oTileApi.preview.isEnabled()){this.setTextInTile();this._updateTileModel({value:8888,size:S.Auto,frameType:"TwoByOne",state:L.Loading,valueColor:V.Error,indicator:D.None,title:"Liquidity Structure",footer:"Current Quarter",description:"Apr 1st 2013 (B$)",width:"100%",height:"100%",chart:{color:"Good",data:[{day:0,balance:0},{day:30,balance:20},{day:60,balance:20},{day:100,balance:80}]},target:{color:"Error",data:[{day:0,balance:0},{day:30,balance:30},{day:60,balance:40},{day:100,balance:90}]},maxThreshold:{color:"Good",data:[{day:0,balance:0},{day:30,balance:40},{day:60,balance:50},{day:100,balance:100}]},innerMaxThreshold:{color:"Error",data:[]},innerMinThreshold:{color:"Neutral",data:[]},minThreshold:{color:"Error",data:[{day:0,balance:0},{day:30,balance:20},{day:60,balance:30},{day:100,balance:70}]},minXValue:0,maxXValue:100,minYValue:0,maxYValue:100,firstXLabel:{label:"June 123",color:"Error"},lastXLabel:{label:"June 30",color:"Error"},firstYLabel:{label:"0M",color:"Good"},lastYLabel:{label:"80M",color:"Critical"},minLabel:{},maxLabel:{}});this.oDualTrendView.oGenericTile.setState(L.Loaded);}else{try{sap.ushell.components.tiles.indicatorTileUtils.util.getParsedChip(this.oTileApi.configuration.getParameterValueAsString("tileConfiguration"),function(a){t.oConfig=a;t.setTextInTile();t.oDualTrendView.oGenericTile.attachPress(function(){sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(t.trendChartODataReadRef);sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,null);window.location.hash=sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system);});if(Number(t.oTileApi.configuration.getParameterValueAsString("isSufficient"))){sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(t.oConfig.TILE_PROPERTIES.id,t.oConfig);t.flowWithoutDesignTimeCall();}else{t.flowWithDesignTimeCall();}});}catch(e){this.logError(e);}}},_setLocalModelToTile:function(){if(!this.getTile().getModel()){this.getTile().setModel(new J({}));}},onExit:function(){sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.trendChartODataReadRef);}});return{};},true);