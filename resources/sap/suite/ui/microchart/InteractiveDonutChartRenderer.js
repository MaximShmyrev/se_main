/*!
 * SAPUI5

(c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/thirdparty/jquery",'./library',"sap/ui/core/theming/Parameters","sap/ui/Device","sap/m/library","sap/base/Log"],function(q,l,P,D,M,L){"use strict";var I={};I.TOTAL_RADIUS_ABSOLUTE=3.625;I.OUTER_RADIUS_ABSOLUTE=3.25;I.SELECTION_THICKNESS_ABSOLUTE=0.375;I.HOLE_SIZE_RATIO_COMPACT=0.48;I.HOLE_SIZE_RATIO_COZY=0.48;I.SEGMENT_HALF_GAP_SIZE=0;I.SEGMENT_HALF_GAP_SIZE_HCB=0.5;I.GHOST_BORDER_HALF_THICKNESS_HCB=0.5;I.render=function(r,c){if(!c._bThemeApplied){return;}this._aSegments=c.getSegments();var s=c._iVisibleSegments;this._fSegmentHalfGapSize=this.SEGMENT_HALF_GAP_SIZE;this._fGhostHalfGapSize=0;if(this._isThemeHighContrast()){this._fSegmentHalfGapSize=this.SEGMENT_HALF_GAP_SIZE_HCB;this._fGhostHalfGapSize=this.GHOST_BORDER_HALF_THICKNESS_HCB;}r.write("<div");r.addClass("sapSuiteIDC");r.writeControlData(c);r.writeClasses();if(!c._isChartEnabled()){var a=c.getTooltip_AsString();if(typeof a==="string"||a instanceof String){r.writeAttributeEscaped("title",a);}}var A={};A.role="listbox";A.roledescription=c._oRb.getText("INTERACTIVEDONUTCHART");A.multiselectable=true;A.disabled=!c._isChartEnabled();A.labelledby=c.getAriaLabelledBy();A.describedby=this._getAriaDescribedBy(c,s);r.writeAccessibilityState(c,A);r.write(">");if(!c.getSelectionEnabled()){this._renderDisabledOverlay(r,c);}this._renderDonut(r,c,s);this._renderLegend(r,c,s);r.write("</div>");};I._renderDonut=function(r,c,s){var S,f,a,b,t,d,o,h,C=c._bCompact;r.write("<div");r.addClass("sapSuiteIDCChart");r.writeClasses();r.write(">");r.write("<svg");r.addClass("sapSuiteIDCChartSVG");r.writeClasses();r.writeAttribute("viewBox","-2 -2 104 104");r.writeAttribute("focusable","false");r.write(">");r.write("<g");r.writeAttribute("transform","translate(50.5 50.5)");r.write(">");t=50;o=(this.OUTER_RADIUS_ABSOLUTE/this.TOTAL_RADIUS_ABSOLUTE)*t;if(C){d=this.HOLE_SIZE_RATIO_COMPACT*o;}else{d=this.HOLE_SIZE_RATIO_COZY*o;}h=t*(this.SELECTION_THICKNESS_ABSOLUTE/this.TOTAL_RADIUS_ABSOLUTE);f=this._calculateSum(c);a=0.0;var i;for(i=0;i<s;i++){S=this._aSegments[i];if(S.getValue()>0){b=this._calculateSegmentPath(f,S.getValue(),a,o+h,d-h,this._fGhostHalfGapSize);r.write("<path");r.writeAttributeEscaped("d",b);r.writeAttribute("data-sap-ui-idc-selection-index",i);r.addClass(l.InteractiveDonutChart.CHART_SEGMENT_GHOST.CSSCLASS);if(S.getSelected()){r.addClass(l.InteractiveDonutChart.CHART_SEGMENT_GHOST.CSSCLASS_SELECTED);}r.writeClasses();r.writeStyles();r.write(">");if(c._isChartEnabled()){this._renderTitle(S.getTooltip_AsString(),r);}r.write("</path>");a+=this._aSegments[i].getValue();}}a=0.0;for(i=0;i<s;i++){S=this._aSegments[i];if(S.getValue()>0){b=this._calculateSegmentPath(f,S.getValue(),a,o,d,0);r.write("<path");r.writeAttributeEscaped("d",b);r.writeAttributeEscaped("fill",this._getSegmentColor(i,s));r.writeAttribute("cursor","pointer");r.writeAttribute("data-sap-ui-idc-selection-index",i);r.addClass(l.InteractiveDonutChart.CHART_SEGMENT.CSSCLASS);if(S.getSelected()){r.addClass(l.InteractiveDonutChart.CHART_SEGMENT.CSSCLASS_SELECTED);}r.writeClasses();r.write(">");if(c._isChartEnabled()){this._renderTitle(S.getTooltip_AsString(),r);}r.write("</path>");a+=this._aSegments[i].getValue();}}r.write("</g>");r.write("</svg>");r.write("</div>");};I._renderLegend=function(r,c,s){r.write("<div");r.addClass("sapSuiteIDCLegend");r.writeClasses();r.write(">");for(var i=0;i<s;i++){this._renderLegendSegment(r,c,i,s);}r.write("</div>");};I._renderLegendSegment=function(r,c,i,s){var S=this._aSegments[i],a=S.getLabel(),d=S.getDisplayedValue()||String(S.getValue()),t,C=S._getSemanticColor();if(S._bNullValue){d=c._oRb.getText("INTERACTIVECHART_NA");}d=d.substring(0,l.InteractiveDonutChart.CHART_SEGMENT_LABEL_MAXLENGTH);var t=S.getTooltip_Text();var A;if(t&&t.trim()){A=t;}else{A=a;if(A){A=A+" "+d;}else{A=d;}if(C){A+=" "+C;}}var o={};o.role="option";o.label=A.trim();o.selected=S.getSelected();o.posinset=i+1;o.setsize=s;r.write("<div");r.writeAccessibilityState(S,o);r.writeAttributeEscaped("id",c.getId()+"-interactionArea-"+i);r.writeAttributeEscaped("data-sap-ui-idc-selection-index",i);r.addClass("sapSuiteIDCLegendSegment");if(S.getSelected()){r.addClass(l.InteractiveDonutChart.SEGMENT_CSSCLASS_SELECTED);}if(i===0&&c.getSelectionEnabled()){r.writeAttribute("tabindex","0");}if(c._isChartEnabled()){t=S.getTooltip_AsString();if(typeof t==="string"||t instanceof String){r.writeAttributeEscaped("title",t);}}r.writeClasses();r.write(">");C=S.getColor();if(C!==M.ValueColor.Neutral){r.write("<div");r.addClass("sapSuiteIDCSemanticMarker");r.addClass("sapSuiteICSemanticColor"+C);r.writeClasses();r.write(">");r.write("</div>");}r.write("<div");r.addClass("sapSuiteIDCLegendMarker");r.writeClasses();r.writeAttributeEscaped("style","background-color: "+this._getSegmentColor(i,s));r.write(">");r.write("</div>");r.write("<div");r.addClass("sapSuiteIDCLegendLabelValue");r.writeClasses();r.write(">");r.write("<div");r.addClass("sapSuiteIDCLegendLabel");r.writeClasses();r.write(">");r.writeEscaped(a);r.write("</div>");r.write("<div");r.addClass("sapSuiteIDCLegendValue");r.writeClasses();r.write(">");r.writeEscaped(d);r.write("</div>");r.write("</div>");r.write("</div>");};I._getSegmentColor=function(p,s){var w=1-(s-p)/s,c=P.get("_sap_suite_ui_microchart_InteractiveDonutChart_SegmentFillColor")||"white";if(this._isThemeHighContrast()){return c;}return this._mixColors(c,"#ffffff",w);};I._calculateSegmentPath=function(s,a,b,o,i,c){var m=0.01,S,d,e,f,g,h,E,j,k,n=this._fSegmentHalfGapSize+c,G=Math.pow(2*n,2),p,r,t,u;o=this._formatFloat(o);i=this._formatFloat(i);h=this._calculateCircleFraction(s,b);E=this._calculateCircleFraction(s,b+a);j=this._calculateCircleFraction(s,a);if(j<=Math.PI){k=0;}else{k=1;}if(s===a){p=i;r=o;t=0;u=0;}else{p=Math.sqrt(Math.pow(i,2)+G);r=Math.sqrt(Math.pow(o,2)+G);t=Math.atan(n/i);u=Math.atan(n/o);}d={"x":this._formatFloat(p*Math.sin(h+t)),"y":this._formatFloat(-p*Math.cos(h+t))};e={"x":this._formatFloat(r*Math.sin(h+u)),"y":this._formatFloat(-r*Math.cos(h+u))};f={"x":this._formatFloat(o*Math.sin(E-u)-m),"y":this._formatFloat(-o*Math.cos(E-u))};g={"x":this._formatFloat(i*Math.sin(E-t)-m),"y":this._formatFloat(-i*Math.cos(E-t))};S="";S+="M"+d.x+" "+d.y+" ";S+="L"+e.x+" "+e.y+" ";S+="A"+o+","+o+" 0 "+k+",1"+" "+f.x+","+f.y+" ";S+="L"+g.x+" "+g.y+" ";S+="A"+i+","+i+" 0 "+k+",0"+" "+d.x+","+d.y;return S;};I._formatFloat=function(v){return parseFloat(v.toFixed(2));};I._calculateSum=function(c){var s=0;var d=c.getDisplayedSegments();for(var i=0;i<this._aSegments.length&&i<d;i++){var v=this._aSegments[i].getValue();if(v>0){s+=v;}}return s;};I._calculateCircleFraction=function(s,a){return(2*Math.PI*a)/s;};I._renderDisabledOverlay=function(r){r.write("<div");r.addClass("sapSuiteIDCDisabledOverlay");r.writeClasses();r.write(">");r.write("</div>");};I._getAriaDescribedBy=function(c,s){var a=[];for(var i=0;i<s;i++){a.push(c.getId()+"-interactionArea-"+i);}return a.join(",");};I._mixColors=function(c,a,w){if(w===1||c.toLowerCase()===a.toLowerCase()){return c;}var C=this._hexToRgb(c);var b=this._hexToRgb(a);var s=Math.round((C[0]+(Math.abs(C[0]-b[0])*w))%255);var d=Math.round((C[1]+(Math.abs(C[1]-b[1])*w))%255);var e=Math.round((C[2]+(Math.abs(C[2]-b[2])*w))%255);return"#"+this._intToHex(s)+this._intToHex(d)+this._intToHex(e);};I._isThemeHighContrast=function(){return/(hcw|hcb)/g.test(sap.ui.getCore().getConfiguration().getTheme());};I._hexToRgb=function(h){var c=[];h=h.replace(/[^0-9a-f]+/ig,'');if(h.length===3){c=h.split('');}else if(h.length===6){c=h.match(/(\w{2})/g);}else{L.warning("Invalid color input: hex string must be in the format #FFFFFF or #FFF");}return c.map(function(x){return parseInt(x,16);});};I._intToHex=function(v){var h=v.toString(16);if(h.length===1){h='0'+h;}return h;};I._renderTitle=function(t,r){if(typeof t==="string"||t instanceof String){r.write("<title>");if(D.browser.msie){t=t.split("\n");for(var j=0;j<t.length;j++){r.writeEscaped(t[j]);if(j<t.length-1){r.write("<br>");}}}else{r.writeEscaped(t);}r.write("</title>");}};return I;},true);
