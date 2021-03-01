/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/suite/ui/commons/library","./SvgBase","sap/ui/base/ManagedObject","sap/ui/core/theming/Parameters","sap/m/ValueCSSColor","sap/m/CheckBox"],function(q,l,S,M,P,V,C){"use strict";var a=l.networkgraph.ElementStatus,H=l.networkgraph.HeaderCheckboxState;var E=S.extend("sap.suite.ui.commons.networkgraph.ElementBase",{metadata:{properties:{title:{type:"string",group:"Misc",defaultValue:null},description:{type:"string",group:"Misc",defaultValue:null},status:{type:"string",group:"Appearance",defaultValue:a.Standard}},aggregations:{attributes:{type:"sap.suite.ui.commons.networkgraph.ElementAttribute",multiple:true,singularName:"attribute"}}},renderer:{}});E.prototype.scrollToElement=function(){var p=this.getParent();if(p){p._scrollToElement(this);}};E.prototype._afterRenderingBase=function(){var p=this.getParent(),$,s;var i=p&&p._isUseNodeHtml()&&this.isA("sap.suite.ui.commons.networkgraph.Node"),I=this.isA("sap.suite.ui.commons.networkgraph.Group");if(!i&&!I){if(this._cannotAppendInnerHtml()){$=this.$().parent();s=this._convertToSvg(q.parseHTML(this._render()));$[0].replaceChild(s,this.$()[0]);}else{this.$()[0].outerHTML=this._render();}}this._afterRendering();};E.prototype._removeFromInvalidatedControls=function(){try{this.getUIArea()._onControlRendered(this);}catch(e){}};E.prototype._setFocus=function(f){var n=f?"addClass":"removeClass";this.$()[n](this.FOCUS_CLASS);};E.prototype._replaceId=function($,s){if($.attr("id")){$.attr("id",$.attr("id")+s);}$.removeAttr("data-sap-ui");var c=$.children();if(c.length===0){return;}c.each(function(i,o){this._replaceId(q(o),s);}.bind(this));};E.prototype._useInLayout=function(){return true;};E.prototype._hasFocus=function(){return this.$().hasClass(this.FOCUS_CLASS);};E.prototype._hasDefaultStatus=function(s){s=s||this.getStatus();return s===a.Error||s===a.Information||s===a.Warning||s===a.Success;};E.prototype._hasCustomStatus=function(s){s=s||this.getStatus();if(s===a.Standard||this._hasDefaultStatus(s)){return false;}return!!s;};E.prototype._isCustomStatusColor=function(s){return s!==E.ColorType.BorderWidth&&s!==E.ColorType.BorderStyle;};E.prototype._getElementId=function(s){return s?this.getId()+s:this.getId();};E.prototype._getColor=function(t,s){var p=this.getParent(),f,o,c="";var b=function(){if(typeof this.getSelected==="function"&&this.getSelected()){if(t===E.ColorType.Background||t===E.ColorType.Content||t===E.ColorType.Border){t="Selected"+t;}if(t==E.ColorType.HeaderContent&&this._isBox()){t=E.ColorType.Content;}}}.bind(this);s=s||this.getStatus();if(!this._hasCustomStatus(s)){return"";}if(!p||!t){return"";}o=p._oStatuses[s];if(o){if(t.indexOf("Focus")!==-1){if(!o.getUseFocusColorAsContentColor()){return"";}t=t.replace("Focus","Content");}b();f="get"+t+"Color";var n=o[f]();if(n){var c=P.get(n);if(!c&&n&&V.isValid(n)){c=n;}}}return c?c:"";};E.prototype._getStatusValue=function(t,s){var p=this.getParent(),o;s=s||this.getStatus();if(!this._hasCustomStatus(s)){return"";}if(!p||!t){return"";}o=p._oStatuses[s];if(o){return o["get"+t]();}return"";};E.prototype._getStatusStyle=function(p,c){var s="";if(!this._hasCustomStatus()){return"";}Object.keys(p).forEach(function(k){var v=this._isCustomStatusColor(p[k])?this._getColor(p[k]):this._getStatusValue(p[k]);if(v){if(s){s+=";";}s+=k+":"+v;}},this);if(c&&s){s="style=\""+s+"\"";}return s;};E.prototype._checkForProcessData=function(){var p=this.getParent();if(p&&p._bRequiresDataProcessing){p._processData();}};E.prototype.getStyleObject=function(s){var r={};if(s){var b=s.split(';');for(var i=0;i<b.length;i++){if(b[i]){var e=b[i].split(':');r[e.splice(0,1)[0]]=e.join(':');}}}return r;};E.prototype.applyStyles=function(r,s){Object.keys(s).forEach(function(A){r.style(A,s[A]);});};E.prototype.getVisibleAttributes=function(){return this.getAttributes().filter(function(A){return A.getVisible();});};E.prototype.setProperty=function(p,v,s){var b=Object.getPrototypeOf(this).aProcessRequiredProperties;M.prototype.setProperty.call(this,p,v,s);if(b&&(b.indexOf(p)!==-1)&&this.getParent()){this.getParent()._bRequiresDataProcessing=true;}};E.prototype.toString=function(){return this.getMetadata()._sClassName+" - "+this.getTitle();};E.prototype._correctTitle=function(c){if(this.getTitle()){var $=this.$().find("."+c);if($[0]){var t=$[0].getBBox().width,m=parseInt($.attr("maxwidth"),10);if(t>m){this._createText($[0],{text:this.getTitle(),hCenter:true});}}}};E.prototype._renderTitle=function(A){var b=10;var h=this._renderControl("g",{"clip-path":"url(#"+this.getId()+"-title-clip)"},false);h+=this._renderText({attributes:{"style":A.style,"class":A.class,x:A.x,y:A.y,maxWidth:A.maxWidth},text:A.title,height:b});h+="</g>";return h;};E.prototype._renderClipPath=function(A){var h=this._renderControl("clipPath",{id:A.id},false);h+=this._renderControl("rect",{x:A.x,y:A.y,width:A.width||this._iWidth,height:A.height||this._iHeight,direction:A.direction||""});h+="</clipPath>";return h;};E.prototype._renderClonedControl=function(o,c){if(o.mapRender){var $=c.$().clone();this._replaceId($,o.idSufix);o.renderManager.unsafeHtml($[0].outerHTML);}else{o.renderManager.renderControl(c);}};E.prototype._appendActionButton=function(A,$){var i=A.id?"id=\""+A.id+"\"":"";var b="<div "+i+" title=\""+A.title+"\"class=\"sapSuiteUiCommonsNetworkGraphDivActionButtonBackground\">";b+="<div class=\"sapSuiteUiCommonsNetworkGraphDivActionButton ";if(!A.enable){b+="sapSuiteUiCommonsNetworkGraphDivActionButtonDisabled\"";b+="style = \" display: none";}b+="\">";b+=this._renderHtmlIcon(A.icon,(A.class||""));b+="</div>";b+="<div class=\"sapSuiteUiCommonsNetworkActionButtonFocusCircle\"></div>";b+="</div>";var c=q(b);if(A.enable&&A.click){c.click(A.click);c.click(function(e){if(this.getParent()){this.getParent().setFocus({item:this,button:c[0]});}}.bind(this));}$.append(c);};E._isRectOnScreen=function(x,X,y,Y,L,r,t,b){return(Math.max(x,X)>L)&&(Math.min(x,X)<r)&&(Math.max(y,Y)>t)&&(Math.min(y,Y)<b);};E.prototype._isOnScreen=function(L,r,t,b){return false;};E.prototype._setHeaderCheckBoxState=function(v){if(v!==H.Hidden){this._getHeaderCheckbox().setSelected(v===H.Checked);this._getHeaderCheckbox().setVisible(true);}else if(this.getAggregation("_checkBox")){this._getHeaderCheckbox().setVisible(false);}this.setProperty("headerCheckBoxState",v);};E.prototype.setVisible=function(v){var g=this.getParent();this.setProperty("visible",v);if(g){g.setFocus(null);g._setupKeyboardNavigation();}return this;};E.prototype.setStatus=function(s){var g=this.getParent();this.setProperty("status",s);if(g&&g._bIsLayedOut){g.updateLegend();}return this;};E.ColorType=Object.freeze({BorderStyle:"BorderStyle",BorderWidth:"BorderWidth",Background:"Background",Border:"Border",Content:"Content",HeaderContent:"HeaderContent",SelectedBorder:"SelectedBorder",SelectedBackground:"SelectedBackground",SelectedContent:"SelectedContent",HoverBackground:"HoverBackground",HoverBorder:"HoverBorder",HoverContent:"HoverContent",Focus:"Focus",HoverFocus:"HoverFocus",SelectedFocus:"SelectedFocus"});return E;});
