sap.ui.define(["sap/ui/thirdparty/jquery",'./library','sap/ui/core/Control','sap/suite/ui/commons/MicroProcessFlow','sap/ui/core/ValueState'],function(q,l,C,M,V){"use strict";var r=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");var D={"Error":"sap-icon://message-error","None":null,"Success":"sap-icon://message-success","Warning":"sap-icon://message-warning","Information":"sap-icon://message-information"};var a=C.extend("sap.suite.ui.commons.MicroProcessFlowItem",{metadata:{library:"sap.suite.ui.commons",properties:{key:{type:"string",group:"Misc",defaultValue:null},icon:{type:"string",group:"Appearance",defaultValue:null},title:{type:"string",group:"Misc",defaultValue:null},state:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:V.Standard},showIntermediary:{type:"boolean",group:"Appearance",defaultValue:false},stepWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},showSeparator:{type:"boolean",group:"Appearance",defaultValue:true}},aggregations:{customControl:{type:"sap.ui.core.Control",multiple:false,singularName:"customControl"},intermediary:{type:"sap.ui.core.Control",multiple:false,singularName:"intermediary"}},events:{press:{allowPreventDefault:true,parameters:{item:"object"}}}},onAfterRendering:function(){this._setupEvents();this._setAccessibility();},renderer:function(R,m){var f=function(){R.write("<div");R.writeAttributeEscaped("id",m.getId()+"-separator");R.addClass("sapSuiteUiCommonsMicroProcessFlowItemSeparatorWrapper");R.writeClasses();R.addStyle("width",m._getStepWidth());R.writeStyles();R.write(">");R.write("<div ");R.addClass("sapSuiteUiCommonsMicroProcessFlowItemSeparator");if(!m.getShowSeparator()||I){R.addClass("sapSuiteUiCommonsMicroProcessFlowItemHiddenSeparator");}R.writeClasses();R.write(">");R.write("</div>");if(S){b();}R.write("</div>");};var b=function(){var o=m.getIntermediary();R.write("<div class=\"sapSuiteUiCommonsMicroProcessFlowItemIntermediary\" >");if(o){R.renderControl(o);}else{R.write("<div class=\"sapSuiteUiCommonsMicroProcessFlowItemOnHoldElement\" >");R.write("</div>");}R.write("</div>");};var i=m.getIcon()||m._getIconByState(),I=m.getParent()._isLastItem(m),s=m.getId(),S=m.getShowIntermediary(),c=m.getCustomControl(),t=m.getTitle();R.write("<div ");R.addClass("sapSuiteUiCommonsMicroProcessFlowItemWrapper");R.writeClasses(m);R.writeControlData(m);R.write(">");R.write("<div");if(t){R.writeAttributeEscaped("title",t);}R.writeAttributeEscaped("id",s+"-item");R.writeAttribute("class","sapSuiteUiCommonsMicroProcessFlowItemContent");R.write(">");if(c){R.renderControl(c);}else{R.write("<div tabindex=\"0\" id=\""+s+"-itemContent\" class=\"sapSuiteUiCommonsMicroProcessFlowItem sapSuiteUiCommonsMicroProcessFlowItem"+m.getState()+"\"");R.writeAttributeEscaped("aria-label",m._getAriaText());R.writeAttributeEscaped("role","option");R.write(">");if(i){R.renderControl(new sap.ui.core.Icon({tooltip:m.getTitle(),src:i}).addStyleClass("sapSuiteUiCommonsMicroProcessFlowItemIcon"));}R.write("</div>");}R.write("</div>");if(!I||S){f();}R.write("</div>");}});a.prototype.getFocusDomRef=function(){var c=this.getCustomControl();return c?c.getFocusDomRef():this.getDomRef("itemContent");};a.prototype._setAccessibility=function(){var $=this._getAccessibleItem(),A=this._getAriaText();if($.attr("tabindex")!=="0"){$.attr("tabindex",0);}$.attr("aria-label",A);$.attr("role","option");$.attr("aria-posinset",this._iIndex);$.attr("aria-setsize",this._iItemsCount);};a.prototype._getAccessibleItem=function(){var $=q(this.getFocusDomRef());return $.attr("tabindex")==="0"?$:this.$("item");};a.prototype._setupEvents=function(){var $=this.$("item"),h=this.hasListeners("press");$.on("touchstart click",this._click.bind(this));if(h){$.mousedown(function(e){q(this).addClass("sapSuiteUiCommonsMicroProcessFlowItemPressed");});$.mouseup(function(e){q(this).removeClass("sapSuiteUiCommonsMicroProcessFlowItemPressed");});}if(h){$.css("cursor","pointer");$.attr("role","button");}};a.prototype._getAriaText=function(){var t=r.getText("MICRO_PROCESS_FLOW_ITEM");switch(this.getState()){case V.Error:t+=" - "+r.getText("MICRO_PROCESS_FLOW_ERROR");break;case V.Warning:t+=" - "+r.getText("MICRO_PROCESS_FLOW_WARNING");break;case V.Success:t+=" - "+r.getText("MICRO_PROCESS_FLOW_SUCCESS");break;case V.Information:t+=" - "+r.getText("MICRO_PROCESS_FLOW_INFORMATION");break;}if(this.getTitle()){t+=" - "+this.getTitle();}return t;};a.prototype._isCompact=function(){return q("body").hasClass("sapUiSizeCompact")||this.$().is(".sapUiSizeCompact")||this.$().closest(".sapUiSizeCompact").length>0;};a.prototype._getStepWidth=function(){var w=this.getStepWidth();if(!w){w=this._isCompact()?"1rem":"1.5rem";}return w;};a.prototype._setAccessibilityData=function(i,I){this._iIndex=i;this._iItemsCount=I;};a.prototype._click=function(e){var p=this.getParent();if(p){p._bKeyBoard=false;}this._firePress(e);};a.prototype._firePress=function(e){if(this.hasListeners("press")){this.firePress({item:this.getFocusDomRef()});if(e.preventDefault){e.preventDefault();}if(e.stopPropagation){e.stopPropagation();}}};a.prototype._getIconByState=function(){return D[this.getState()];};return a;});
