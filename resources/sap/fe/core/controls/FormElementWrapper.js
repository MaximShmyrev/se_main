sap.ui.define(["sap/ui/core/Control","sap/ui/Device"],function(C,D){"use strict";return C.extend("sap.fe.core.controls.FormElementWrapper",{metadata:{interfaces:["sap.ui.core.IFormContent"],properties:{width:{type:"sap.ui.core.CSSSize",defaultValue:null},formDoNotAdjustWidth:{type:"boolean",defaultValue:false}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:false}}},renderer:function(r,c){r.write("<div");r.writeControlData(c);r.writeClasses();r.addStyle("min-height","1rem");r.addStyle("width",c.getWidth());if(D.browser.msie){r.addStyle("display","block");}else{r.addStyle("display","inline-block");}r.writeStyles();r.write(">");r.renderControl(c.getContent());r.write("</div>");}});});