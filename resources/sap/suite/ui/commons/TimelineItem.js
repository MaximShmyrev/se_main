/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/Control","sap/m/Text","sap/m/Toolbar","sap/m/ToolbarDesign","sap/m/Link","sap/m/TextArea","sap/m/Popover","sap/m/PlacementType","sap/m/ToolbarSpacer","sap/m/Button","sap/ui/Device","sap/suite/ui/commons/util/ManagedObjectRegister","sap/suite/ui/commons/util/DateUtils","sap/ui/core/Icon","sap/m/library","sap/ui/core/format/DateFormat","sap/ui/base/Object","sap/ui/dom/containsOrEquals","sap/base/security/encodeXML","./TimelineItemRenderer"],function(q,C,T,a,b,L,c,P,d,e,B,D,M,f,I,g,h,j,k,l,m){"use strict";var n=C.extend("sap.suite.ui.commons.TimelineItem",{metadata:{library:"sap.suite.ui.commons",properties:{dateTime:{type:"any",group:"Misc",defaultValue:null},filterValue:{type:"string",group:"Misc",defaultValue:null},icon:{type:"string",group:"Misc",defaultValue:null},iconTooltip:{type:"string",group:"Misc",defaultValue:null},useIconTooltip:{type:"boolean",group:"Accessibility",defaultValue:true},maxCharacters:{type:"int",group:"Behavior",defaultValue:null},replyCount:{type:"int",group:"Misc",defaultValue:null},status:{type:"string",group:"Misc",defaultValue:null},title:{type:"string",group:"Misc",defaultValue:null},text:{type:"string",group:"Misc",defaultValue:null},userName:{type:"string",group:"Misc",defaultValue:null},userNameClickable:{type:"boolean",group:"Misc",defaultValue:false},userPicture:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null}},defaultAggregation:"embeddedControl",aggregations:{customAction:{type:"sap.ui.core.CustomData",multiple:true,singularName:"customAction"},customReply:{type:"sap.ui.core.Control",multiple:false},embeddedControl:{type:"sap.ui.core.Control",multiple:false},replyList:{type:"sap.m.List",multiple:false},suggestionItems:{type:"sap.m.StandardListItem",multiple:true,singularName:"suggestionItem",deprecated:true}},events:{userNameClicked:{parameters:{uiElement:{type:"sap.ui.core.Control"}}},replyPost:{parameters:{value:{type:"string"}}},replyListOpen:{},customActionClicked:{parameters:{value:{type:"string"},key:{type:"string"},linkObj:{type:"sap.m.Link"}}},suggest:{deprecated:true,parameters:{suggestValue:{type:"string"}}},suggestionItemSelected:{deprecated:true,parameters:{selectedItem:{type:"sap.ui.core.Item"}}}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}}}});var r=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons"),S={"Warning":"sapSuiteUiCommonsTimelineStatusWarning","Error":"sapSuiteUiCommonsTimelineStatusError","Success":"sapSuiteUiCommonsTimelineStatusSuccess","Information":"sapSuiteUiCommonsTimelineStatusInformation"};n.prototype.init=function(){this._customReply=false;this._objects=new M();this._nMaxCharactersMobile=500;this._nMaxCharactersDesktop=800;this._sTextShowMore=r.getText("TIMELINE_TEXT_SHOW_MORE");this._registerControls();this._registerPopup();this._orientation="V";};n.prototype.setCustomMessage=function(i){this._objects.getInfoText().setText(i);this._objects.getInfoBar().setVisible(i&&i.length>0);this.invalidate();};n.prototype.setDateTime=function(o){if(o&&this.getBinding("dateTime")&&j.isA(this.getModel(),"sap.ui.model.odata.v4.ODataModel")){var i=h.getDateTimeInstance({pattern:"yyyy-MM-dd'T'HH:mm:ss.SSSZ"});var p=i.parse(o);if(p instanceof Date){o=p;}}this.setProperty("dateTime",o);return this;};n.prototype.applyFocusInfo=function(){this.focus();this.getParent()._moveScrollBar(true);};n.prototype.getFocusDomRef=function(){return this.$("outline")[0];};n.prototype._replyPost=function(){var i=this._objects.getReplyInputArea().getValue();this.fireReplyPost({value:i});};n.prototype._registerPopup=function(){var t=this;this._objects.register("fullText",function(){var o=new T(t.getId()+"-fullText",{text:t.getText()});o.addStyleClass("sapSuiteUiCommonsTimelineItemPopoverText");return o;});this._objects.register("fullTextPopover",function(){var p=new P({placement:d.Bottom,showArrow:false,showHeader:false,contentMinWidth:'300px',contentWidth:'450px',resizable:true,content:[t._objects.getFullText()]});p.addStyleClass("sapSuiteUiCommonsTimelineItemShowMorePopover");return p;});};n.prototype._openReplyDialog=function(){if(this._customReply){this.getCustomReply().openBy(this._objects.getReplyLink());this.fireReplyListOpen();}else{this.fireReplyListOpen();this._objects.getReplyInputArea().setValue('');this._oldReplyInputArea='';this._list=this.getReplyList();if(this._list!==null){this.setAggregation("replyList",null,true);this._objects.getReplyPop().addContent(this._list);}this._objects.getReplyPop().addContent(this._objects.getReplyInputArea());this._objects.getReplyPop().openBy(this._objects.getReplyLink());}};n.prototype._callParentFn=function(){var i=Array.prototype.slice.call(arguments),N=i.shift(),p=this.getParent();if(p&&(typeof p[N]==="function")){return p[N].apply(p,i);}};n.prototype._getCorrectGroupIcon=function(){var i="",o=function(){return this.getParent()&&this.getParent()._renderDblSided;}.bind(this),p=this._isGroupCollapsed();if(this._orientation==="H"){i="sap-icon://navigation-right-arrow";if(!p){i=this._callParentFn("_isLeftAlignment")||o()?"sap-icon://navigation-down-arrow":"sap-icon://navigation-up-arrow";}}else{i="sap-icon://navigation-down-arrow";if(p){i=this._callParentFn("_isLeftAlignment")||o()?"sap-icon://navigation-right-arrow":"sap-icon://navigation-left-arrow";}}return i;};n.prototype.onclick=function(E){var t=this;if(k(this.$("outline").get(0),E.target)){if(this._isGroupHeader){t._performExpandCollapse(t._groupID);}}};n.prototype._performExpandCollapse=function(G){var i=false,E=this._isGroupCollapsed(G);var s=function(F,H){var J=F.find(".sapSuiteUiCommonsTimelineItemBarV"),K,N;if(H.get(0)){K=H.attr("groupId");N=!this._isGroupCollapsed(K);if(N){J.addClass("sapSuiteUiCommonsTimelineGroupNextExpanded");}else{J.removeClass("sapSuiteUiCommonsTimelineGroupNextExpanded");}}}.bind(this),o=function(){var F,H,J;if(!i){F=this._objects.getGroupCollapseIcon&&this._objects.getGroupCollapseIcon();H=this.$();J=this._isGroupCollapsed();if(!J){H.removeClass("sapSuiteUiCommonsTimelineGroupCollapsed");H.addClass("sapSuiteUiCommonsTimelineGroupExpanded");}else{H.addClass("sapSuiteUiCommonsTimelineGroupCollapsed");H.removeClass("sapSuiteUiCommonsTimelineGroupExpanded");}F.setSrc(this._getCorrectGroupIcon());i=true;}}.bind(this),p=function(){if(this.getParent()){this.getParent()._collapsedGroups[G]=!E;}}.bind(this),$=this.$(),t=this,u=$.parent(),v,w,x,y,z,A;p();if(this._orientation==="H"){v=this.$("line");}else{v=$.find(".sapSuiteUiCommonsTimelineGroupHeaderBarWrapper");w=u.next().children("li").first();x=u.prev().children(":visible:last");if(x.get(0)){s(x,$);}if(E){y=u.children().last();s(y,w);}else{s($,w);}}if(E){v.hide();}else{v.show();}A=$.find(".sapSuiteUiCommonsTimelineGroupHeaderMainWrapper");A.attr("aria-expanded",!!E);if(E){A.attr("aria-label",r.getText("TIMELINE_ACCESSIBILITY_GROUP_HEADER")+": "+A.prevObject[0].outerText+" "+r.getText("TIMELINE_ACCESSIBILITY_GROUP_EXPAND"),true);}else{A.attr("aria-label",r.getText("TIMELINE_ACCESSIBILITY_GROUP_HEADER")+": "+A.prevObject[0].outerText+" "+r.getText("TIMELINE_ACCESSIBILITY_GROUP_COLLAPSE"),true);}if(this._orientation!=="H"||E){o();}z=this._callParentFn("_performExpandCollapse",G,E,this);if(z){return new Promise(function(F,H){z.then(function(){o();t._callParentFn("_performUiChanges");F();});});}};n.prototype._getStatusColorClass=function(){var s=this.getStatus();return S[s]||"";};n.prototype._getLineIcon=function(){var t=this,i;this._objects.register("imageControl",function(){var s="sap-icon://circle-task",o=t.getText()==="GroupHeader";if(!o){s=t.getIcon()?t.getIcon():"sap-icon://activity-items";}i=new I(t.getId()+'-icon',{src:s,tooltip:t.getIconTooltip(),useIconTooltip:t.getUseIconTooltip()});i.addStyleClass("sapSuiteUiCommonsTimelineBarIcon");return i;});return this._objects.getImageControl();};n.prototype._isGroupCollapsed=function(i){var p=this.getParent();i=i||this._groupID;return p&&p._collapsedGroups&&p._collapsedGroups[i];};n.prototype._getCollapsedText=function(){var s=this.getText().substring(0,this._nMaxCollapsedLength);var i=s.lastIndexOf(" ");if(i>0){this._sShortText=s.substr(0,i);}else{this._sShortText=s;}return this._sShortText;};n.prototype._toggleTextExpanded=function(E){var t=this,o=E.getSource(),$=o.$(),i=this.$("realtext"),p=$.height(),s=$.position().top,u=i.parent().position().top,v=$.parent().prev(),w,x,N=this.getParent()&&this.getParent()._noAnimation,O=8,y=function(){return t.getParent()&&t.getParent()._renderDblSided;},z=function(V,H,J){v.css("-webkit-line-clamp",J);if(y()||N){v.css("height",V);t._callParentFn("_performUiChanges");}else{v.animate({height:H},250,t._callParentFn("_performUiChanges"));}};if(this._orientation==="V"){x=this.$("threeDots");w=v.children().first();if(!this._expanded){this._textProperties={height:v.css("height"),clamp:v.css("-webkit-line-clamp"),text:w.html()};v.attr("expanded",true);x.hide();w.html(this._encodeHTMLAndLineBreak(this.getText()));var A=r.getText("TIMELINE_TEXT_SHOW_LESS");o.setText(A);o.rerender();z("",w.height(),"");}else{v.attr("expanded",false);o.setText(this._sTextShowMore);o.rerender();x.show();w.html(this._textProperties.text);z(this._textProperties.height,this._textProperties.height,this._textProperties.clamp);}t._expanded=!t._expanded;}else{var F=u-s-p-O,W=q(window).height()-$.offset().top,G=200;if(W<G){F-=(G-W);}this._objects.getFullText().setText(this.getText());this._objects.getFullTextPopover().setOffsetY(Math.floor(F));this._objects.getFullTextPopover().openBy(this._objects.getExpandButton());}};n.prototype._getButtonExpandCollapse=function(){var t=this;this._objects.register("expandButton",function(){return new L(t.getId()+"-fullTextBtn",{text:t._sTextShowMore,press:t._toggleTextExpanded.bind(t)});});return this._objects.getExpandButton();};n.prototype._checkTextIsExpandable=function(){this._nMaxCollapsedLength=this.getMaxCharacters();if(this._nMaxCollapsedLength===0){this._nMaxCollapsedLength=D.system.phone?this._nMaxCharactersMobile:this._nMaxCharactersDesktop;}return this.getText().length>this._nMaxCollapsedLength;};n.prototype.onBeforeRendering=function(){var t=this;if(!this._list){this._list=this.getReplyList();}if(this.getReplyCount()>0){this._objects.getReplyLink().setText(r.getText("TIMELINE_REPLY")+" ("+this.getReplyCount()+")");}else if(this._list&&this._list.getItems().length>0){this._objects.getReplyLink().setText(r.getText("TIMELINE_REPLY")+" ("+this._list.getItems().length+")");}this._objects.getSocialBar().removeAllContent();if(this._callParentFn("getEnableSocial")){this._objects.getSocialBar().addContent(this._objects.getReplyLink());}this._actionList=this.getCustomAction();function F(E,s){t.fireCustomActionClicked({"value":s.value,"key":s.key,"linkObj":this});}for(var i=0;i<this._actionList.length;i++){var o=this._actionList[i].getKey();var v=this._actionList[i].getValue();var p=new L({text:v,tooltip:o});p.addStyleClass("sapSuiteUiCommonsTimelineItemActionLink");p.attachPress({"value":v,"key":o},F);this._objects.getSocialBar().addContent(p);}};n.prototype._encodeHTMLAndLineBreak=function(t){return l(t).replace(/&#xa;/g,"<br>");};n.prototype._getUserPictureControl=function(){var u=this.getUserPicture(),s="2rem",t=this;if(!u){return null;}this._objects.register("userPictureControl",function(){var i=g.ImageHelper.getImageControl(t.getId()+"-userPictureControl",null,t,{height:s,width:s,src:u,tooltip:r.getText("TIMELINE_USER_PICTURE")});i.setDensityAware(false);return i;});this._objects.getUserPictureControl().setSrc(u);return this._objects.getUserPictureControl();};n.prototype._getUserNameLinkControl=function(){var t=this;if(this.getUserNameClickable()){this._objects.register("userNameLink",function(){var i=new L(t.getId()+"-userNameLink",{text:t.getUserName(),press:function(E){t.fireUserNameClicked({uiElement:this});}});i.addStyleClass("sapUiSelectable");return i;});return this._objects.getUserNameLink();}};n.prototype.onAfterRendering=function(){this._expanded=false;this._callParentFn("_itemRendered");};n.prototype._registerControls=function(){var t=this;this._objects.register("infoText",new T(this.getId()+"-infoText",{maxLines:1,width:"100%"}));this._objects.register("infoBar",new a(this.getId()+"-infoBar",{id:this.getId()+"-customMessageInfoBar",content:[this._objects.getInfoText()],design:b.Info,visible:false}));this._objects.register("replyLink",function(){var i=new L(t.getId()+"-replyLink",{text:r.getText("TIMELINE_REPLY"),press:[t._openReplyDialog,t]});i.addStyleClass("sapSuiteUiCommonsTimelineItemActionLink");return i;});this._objects.register("socialBar",function(){var s=new a(t.getId()+"-socialBar",{});s.data("sap-ui-fastnavgroup",null);return s;});this._objects.register("replyInputArea",new c(this.getId()+"-replyInputArea",{height:"4rem",width:"100%"}));this._objects.register("replyPop",function(){return new P(t.getId()+"-replyPop",{initialFocus:t._objects.getReplyInputArea(),title:r.getText("TIMELINE_REPLIES"),placement:d.Vertical,footer:new a({content:[new e(),new B(t.getId()+"-replyButton",{text:r.getText("TIMELINE_REPLY"),press:function(){t._replyPost();t._objects.getReplyPop().close();}})]}),contentHeight:"15rem",contentWidth:"20rem"});});};n.prototype.exit=function(){this._objects.destroyAll();};n.prototype.getDateTimeWithoutStringParse=function(){var o=this.getProperty("dateTime");return f.parseDate(o,false)||"";};n.prototype.setCustomReply=function(R){if(R){this._customReply=true;this.setAggregation("customReply",R,true);}else{this._customReply=false;}return this;};n.prototype.setReplyList=function(i){if(i===null){return this;}this.setAggregation("replyList",i,true);var t=this;this.getReplyList().attachUpdateFinished(function(E){var F=t._objects.getReplyInputArea().getDomRef("inner");if(F){q(F.id).focus();}});return this;};n.prototype.getDateTime=function(){var o=this.getProperty("dateTime");o=f.parseDate(o);if(typeof(o)==="string"&&this instanceof sap.suite.ui.commons.TimelineItem&&this.getBindingPath("dateTime")&&this.getBindingContext()){var p=this.getBindingPath("dateTime");var i=this.getBindingContext().getProperty(p);if(i instanceof Date){return i;}else{return o;}}else{return o;}};return n;});
