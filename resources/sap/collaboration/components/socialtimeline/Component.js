/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP AG. All rights reserved
 */
sap.ui.define(['jquery.sap.global','../controls/FilterPopover','../controls/ReplyPopover','../controls/SocialTextArea','./controls/TimelineItemEmbedded','./datahandlers/JamDataHandler','./datahandlers/SMIntegrationDataHandler','./datahandlers/ServiceDataHandler','./datahandlers/TimelineDataHandler','./filter/FilterType','./validation/InputValidator','../utils/CommonUtil','../utils/DateUtil','sap/suite/ui/commons/library','sap/suite/ui/commons/Timeline','sap/suite/ui/commons/TimelineItem','sap/ui/core/CustomData','sap/ui/core/library','sap/ui/core/Item','sap/ui/core/UIComponent','sap/ui/model/json/JSONModel','sap/ui/model/odata/ODataModel','sap/m/Button','sap/m/library','sap/m/Link','sap/m/Popover','sap/m/ResponsivePopover','sap/m/SelectList','sap/m/StandardListItem'],function(q,F,R,S,T,J,a,b,c,d,I,C,D,e,f,g,h,j,k,U,l,O,B,m,L,P,n,o,p){"use strict";var M=j.MessageType;var r=m.ButtonType;var s=m.PlacementType;var t=e.TimelineAxisOrientation;var u=e.TimelineAlignment;var v=U.extend("sap.collaboration.components.socialtimeline.Component",{metadata:{version:"1.0",includes:["../resources/css/SocialTimeline.css"],dependencies:{libs:["sap.collaboration"],components:[],ui5version:""},config:{},customizing:{},rootView:null,publicMethods:["setBusinessObject","setBusinessObjectKey","setBusinessObjectMap","updateTimelineEntry","deleteTimelineEntry"],aggregations:{},properties:{"enableSocial":{type:"boolean",group:"Social",defaultValue:true},"alignment":{type:"sap.suite.ui.commons.TimelineAlignment",group:"Misc",defaultValue:u.Right},"axisOrientation":{type:"sap.suite.ui.commons.TimelineAxisOrientation",group:"Misc",defaultValue:t.Vertical},"noDataText":{type:"string",group:"Misc",defaultValue:null},"showIcons":{type:"boolean",group:"Misc",defaultValue:true},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"width":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},"customFilter":{type:"object[]",group:"Social"}},events:{"customActionPress":{}}},_defaultAttributes:{collaborationHostServiceUrl:"/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData",smiServiceUrl:"/sap/opu/odata/sap/SM_INTEGRATION_V2_SRV",pageSize:10,jamOnly:false},init:function(){this._oLogger=q.sap.log.getLogger("sap.collaboration.components.socialtimeline.Component");this._oCollaborationHostModel;this._oSMIntegrationModel;this._oTimeline;this._oTimelineModelData={enableSocial:true,alignment:u.Right,axisOrientation:t.Vertical,enableBackendFilter:true,enableScroll:true,forceGrowing:true,noDataText:null,showIcons:true,sort:true,visible:true,width:'100%',timelineData:[],suggestions:[]};this._oTimelineModel=new l(this._oTimelineModelData);this._oTimelineModel.setSizeLimit(10000);this._oTimelineModel.bindProperty("/enableSocial").attachChange(this._onEnableSocialChange,this);this._iGrowingThreshold=this._defaultAttributes.pageSize;this._oFilterIcon;this._oContextSelect;this._oAddPostButton;this._oBusinessObjectMap={};this._oBusinessObject={};this._oCommonUtil=new C();this._oDateUtil=new D();this._oLanguageBundle=this._oCommonUtil.getLanguageBundle();this._oTimelineDataHandler;this._oJamDataHandler;this._oSMIntegrationDataHandler;this._oFilterPopover;this._oFilterConstants=new d();this._oFilter={};this._oRepliesData;this._oReplyPopover;this._oAddPostPopover;this._oSocialProfile;this._oTimelineUser={};this._oInputValidator;this._oGettingTimelineData;this._initialize();this._oInputValidator=new I(this);U.prototype.init.apply(this);},exit:function(){if(this._oTimeline){this._oTimeline.destroy();}if(this._oAddPostPopover){this._oAddPostPopover.destroy();}if(this._oReplyPopover){this._oReplyPopover.destroy();}if(this._oFilterPopover){this._oFilterPopover.destroy();}if(this._oSocialProfile){this._oSocialProfile.destroy();}if(this._oInputValidator){this._oInputValidator.destroy();}if(this._oFilterIcon){this._oFilterIcon.destroy();}if(this._oContextSelect){this._oContextSelect.destroy();}if(this._oAddPostButton){this._oAddPostButton.destroy();}},onBeforeRendering:function(){if(this._oInputValidator.areSocialFeaturesEnabled()===true){if(!this._oBusinessObject.key||this._oBusinessObject.key===""){this._oTimeline._filterIcon.setEnabled(false);this._oContextSelect.setEnabled(false);}}else{if(!this._oBusinessObject.key||this._oBusinessObject.key===""){this._oTimeline._filterIcon.setEnabled(false);}this._oContextSelect.setVisible(false);this._oAddPostButton.setVisible(false);}this._getLoggedInUser();this._bindTemplates();},onAfterRendering:function(){},createContent:function(){return this._createTimeline();},setProperty:function(i,w){U.prototype.setProperty.call(this,i,w);this._oLogger.info(i+": "+w);switch(i){case'enableSocial':var E=w;if(E===true){E=this._oInputValidator.validateEnableSocial();}this._oTimelineModel.setProperty("/"+i,E);break;case'customFilter':var x=w;this._oInputValidator.validateCustomFilter();if(x&&x.length!==0){this._oTimeline.setCustomFilter(this._getFilter());this._oTimeline._filterIcon.setEnabled(true);}else{this._oTimeline._filterIcon.setEnabled(false);}break;default:this._oTimelineModel.setProperty("/"+i,w);break;}},setSettings:function(i){for(var w in i){if(i.hasOwnProperty(w)){this.setProperty(w,i[w]);}}},setBusinessObjectMap:function(i){this._oLogger.info("servicePath: "+i.servicePath);this._oLogger.info("collection: "+i.collection);this._oLogger.info("applicationContext: "+i.applicationContext);this._oBusinessObjectMap=i;this._validateBusinessObjectMap();this._defaultAttributes.jamOnly=q.isEmptyObject(this._oBusinessObjectMap.serviceModel);var w;var x;if(this._defaultAttributes.jamOnly){this._oFilter={type:this._oFilterConstants.FILTER_TYPE.feedUpdates};this._oContextSelect.setVisible(false);this._oTimeline._filterIcon.setVisible(false);}else{this._oContextSelect.setVisible(true);this._oTimeline._filterIcon.setVisible(true);w=this._oInputValidator.createTermsUtilityForBackend(this._oBusinessObjectMap.serviceModel);x=new b(this._oBusinessObjectMap.serviceModel,w);}this._oTimelineDataHandler=new c(this._oBusinessObjectMap,this._oJamDataHandler,this._oSMIntegrationDataHandler,x,w,this._iGrowingThreshold,this._oInputValidator.areSocialFeaturesEnabled(),this._oInputValidator.areBackendFeaturesEnabled());},setBusinessObjectKey:function(K){this._oLogger.info("Business Object Key: "+K);if(!this._oTimelineDataHandler){this._oLogger.error("Function setBusinessObjectMap must be called before calling setBusinessObjectKey for the first time.");}this._oTimeline._filterIcon.setEnabled(true);this._oAddPostButton.setEnabled(false);this._oContextSelect.setEnabled(true);this._oBusinessObject={key:K,name:K};this._oTimelineDataHandler.setBusinessObject(this._oBusinessObject);if(!this._defaultAttributes.jamOnly){this._resetFilterAndContextSelector();}this._refreshTimelineModel();},setBusinessObject:function(i){this._oBusinessObject=i;this._oLogger.info("Business Object Key: "+this._oBusinessObject.key);this._oLogger.info("Business Object Name: "+this._oBusinessObject.name);if(!this._oTimelineDataHandler){this._oLogger.error("Function setBusinessObjectMap must be called before calling setBusinessObject for the first time.");}this._validateBusinessObject();if(this._defaultAttributes.jamOnly){this._oAddPostButton.setEnabled(true);}else{this._oTimeline._filterIcon.setEnabled(true);this._oAddPostButton.setEnabled(false);this._oContextSelect.setEnabled(true);this._oTimelineDataHandler.setBusinessObject(this._oBusinessObject);}if(!this._defaultAttributes.jamOnly){this._resetFilterAndContextSelector();}this._refreshTimelineModel();},updateTimelineEntry:function(w,x){var y=sap.ui.getCore().byId(x);var E=y.getAggregation('embeddedControl');var z=E._oFlexbox.getItems();z[0].setText(w);if(z.length>1){for(var i=1;i<z.length;i++){z[i].destroy();}}var A=y.getModel();var G=this._oTimeline.getContent().indexOf(y);A.getData().timelineData[G].timelineItemData.text=w;A.getData().timelineData[G].timelineItemData.timelineEntryDetails=[];},deleteTimelineEntry:function(i){var w=sap.ui.getCore().byId(i);var x=w.getModel();var y=this._oTimeline.getContent().indexOf(w);x.getData().timelineData.splice(y,1);w.destroy();},_initialize:function(){var i=true;if(!this._oCollaborationHostModel){this._oCollaborationHostModel=new O(this._defaultAttributes.collaborationHostServiceUrl,i);}if(!this._oSMIntegrationModel){this._oSMIntegrationModel=new O(this._defaultAttributes.smiServiceUrl,i);}if(!this._oJamDataHandler){this._oJamDataHandler=new J(this._oCollaborationHostModel);}if(!this._oSMIntegrationDataHandler){this._oSMIntegrationDataHandler=new a(this._oSMIntegrationModel);}},_createTimeline:function(){this._oTimeline=new f(this.getId()+"_timeline",{enableSocial:"{/enableSocial}",alignment:"{/alignment}",axisOrientation:"{/axisOrientation}",enableBackendFilter:"{/enableBackendFilter}",enableScroll:"{/enableScroll}",forceGrowing:"{/forceGrowing}",noDataText:"{/noDataText}",showIcons:"{/showIcons}",visible:"{/visible}",width:"{/width}",sort:"{/sort}",data:[],grow:this._onGrow.bind(this),});this._modifyHeaderBar();this._oTimeline.setModel(this._oTimelineModel);return this._oTimeline;},_modifyHeaderBar:function(){var H=this._oTimeline.getHeaderBar();var i=H.getContent();this._oFilterIcon=i[i.length-1];this._oContextSelect=this._createContextSelector();H.insertContent(this._oContextSelect,0);this._oAddPostButton=this._createAddPostButton();H.insertContent(this._oAddPostButton,3);},_createContextSelector:function(){var i=function(E){var w=sap.ui.getCore().byId(this.getId()+"_context_select");var x=sap.ui.getCore().byId(this.getId()+"_context_select_popover");if(x==undefined){var y=[];y.push({context_type:this._oFilterConstants.FILTER_TYPE.systemUpdates,context_text:this._oLanguageBundle.getText("ST_CONTEXT_SYSTEM_UPDATES")});y.push({context_type:this._oFilterConstants.FILTER_TYPE.feedUpdates,context_text:this._oLanguageBundle.getText("ST_CONTEXT_DISCUSSION_POSTS")});var z=new l(y);this.setModel(z,"timeline_context");var A=new k({key:"{context_type}",text:"{context_text}"});var G=new o(this.getId()+"_context_select_list",{selectedKey:this._oFilterConstants.FILTER_TYPE.systemUpdates,selectionChange:[this._onContextSelect,this],width:"15rem"});G.bindAggregation("items",{path:"/",template:A});G.setModel(z);x=new P(this.getId()+"_context_select_popover",{placement:s.VerticalPreferedBottom,title:this._oLanguageBundle.getText("ST_CONTEXT_SELECT_HEADER")});x.addContent(G);}x.getContent()[0].setSelectedKey(this._oFilter.type);x.openBy(w);};var w=new B(this.getId()+"_context_select",{icon:"sap-icon://navigation-down-arrow",iconFirst:false,text:this._oLanguageBundle.getText("ST_CONTEXT_SYSTEM_UPDATES"),type:r.Transparent,press:[i,this]});return w;},_createAddPostButton:function(){if(this._oAddPostPopover===undefined){this._oAddPostPopover=new n(this.createId("_addPostPopover"),{placement:s.Auto,title:this._oLanguageBundle.getText("ST_ADD_POST_TITLE"),contentWidth:"25rem",contentHeight:"10rem",content:new S(this.createId("social_TextArea"),{height:"10rem",width:"100%",enableNotifyAll:false,liveChange:[function(E){E.getParameter("value").trim()!==""?this.byId("addPost_postButton").setEnabled(true):this.byId("addPost_postButton").setEnabled(false);},this],suggest:[this._onSuggest,this],afterSuggestionClose:[function(){if(this.gettingSuggestions){this.gettingSuggestions.request.abort();}},this]}),endButton:new B(this.createId("addPost_postButton"),{text:this._oLanguageBundle.getText("ST_ADD_POST_BUTTON"),enabled:false,press:[this._onAddPost,this],}),beginButton:new B(this.createId("addPost_atMentionButton"),{text:"@",press:[function(){this.byId("social_TextArea").atMentionsButtonPressed();},this]})}).setInitialFocus(this.byId("social_TextArea"));}var A=new B(this.createId("_addPostButton"),{icon:"sap-icon://add",type:r.Transparent,enabled:false,press:[function(){this._oAddPostPopover.openBy(this.byId("_addPostButton"));},this]});return A;},_refreshTimelineModel:function(){var i=this;this._oTimeline.setBusyIndicatorDelay(0).setBusy(true);this._oGettingTimelineData=this._oTimelineDataHandler.getTimelineData(this._oFilter,this._defaultAttributes.jamOnly?this._oBusinessObject:null).then(function(w){i._oTimeline.setBusy(false);i._oFilter.text===undefined||i._oFilter.text===i._oLanguageBundle.getText("ST_FILTER_ALL")?i._oTimeline.setCustomMessage(""):i._oTimeline.setCustomMessage(i._oLanguageBundle.getText("ST_FILTER_TEXT")+" "+i._oFilter.text);i._oTimeline.destroyContent();i._oTimelineModelData.timelineData=w;i._oTimelineModel.setData(i._oTimelineModelData);i._setReplies();},function(E){i._oCommonUtil.displayError();i._oTimeline.setBusy(false);});},_bindTemplates:function(){if(this._oTimeline.getBinding("content").getPath()!=="/timelineData"){var i=new h({key:"{key}",value:"{value}"});var w=new g({dateTime:"{timelineItemData/dateTime}",userName:"{timelineItemData/userName}",title:"{timelineItemData/title}",icon:"{timelineItemData/icon}",filterValue:"{timelineItemData/filterValue}",userNameClickable:"{/enableSocial}",userNameClicked:this._onUserNameClicked,userPicture:"{timelineItemData/userPicture}",embeddedControl:this._createEmbeddedControl(),customAction:{template:i,path:"timelineItemData/customActionData"},customActionClicked:this._onCustomActionClicked.bind(this),replyCount:"{timelineItemData/replyCount}",replyListOpen:this._onReplyListOpen.bind(this)});this._oTimeline.bindAggregation("content",{path:"/timelineData",template:w});}},_createEmbeddedControl:function(i){var w=(i===undefined)?"{}":i;var E=new T({timelineItem:w,expandCollapseClick:[function(){this._oTimeline.adjustUI();},this],atMentionClick:[this._getAtMentionClicked,this]});return E;},_getFilter:function(){var w=this.getCustomFilter();var x=w.length;for(var i=0;i<x;i++){w[i].type=this._oFilterConstants.FILTER_TYPE.custom;}var y=[{text:this._oLanguageBundle.getText("ST_FILTER_ALL"),type:this._oFilterConstants.FILTER_TYPE.systemUpdates}].concat(w);if(!this._oFilterPopover){var z=new l({filter:y});var A=new p({title:"{text}"});this._oFilterPopover=new F(this.getId()+"_filterPopover",{title:this._oLanguageBundle.getText("ST_FILTER_HEADER"),selectionChange:[function(E){this._oFilter=E.getParameter("listItem").getBindingContext().getObject();this._oTimelineDataHandler.reset();this._refreshTimelineModel();},this]}).setModel(z).bindItems("/filter",A);this._oFilterPopover.setSelectedItem(this._oFilterPopover.getItems()[0]);}else{this._oFilterPopover.getModel().setProperty("/filter",y);}return this._oFilterPopover;},_resetFilterAndContextSelector:function(){this._resetFilter();this._oContextSelect.setText(this._oLanguageBundle.getText("ST_CONTEXT_SYSTEM_UPDATES"));},_resetFilter:function(){this._oTimelineModel.setProperty("/sort",true);this._oFilter={type:this._oFilterConstants.FILTER_TYPE.systemUpdates};if(this._oFilterPopover){this._oFilterPopover.setSelectedItem(this._oFilterPopover.getItems()[0]);}},_setReplies:function(){var i=this;var w=this._oTimeline.getContent();w.forEach(function(x){var y=x.getBindingContext().getObject();if(!y._feedEntryData){i._hideReply(x);}else{x.setCustomReply(i._createReplyPopover());}});},_hideReply:function(i){i._replyLink.setVisible(false);},_showSocialProfile:function(i,w,E){if(i){var x=i.getParent().getParent().getParent();if(!x._oSocialProfile){x._oSocialProfile=sap.ui.getCore().createComponent({name:"sap.collaboration.components.socialprofile",id:this.getId()+"_socialProfile"});x._oSocialProfile._defaultAttributes=x._defaultAttributes;}var y={openingControl:w,memberId:E};x._oSocialProfile.setSettings(y);x._oSocialProfile.open();}},_getFeedId:function(i){var w=i.getBindingContext().getPath();var x=w.split("/");var y=x[x.length-1];var z=i.getModel().getData().timelineData[y]._feedEntryData.Id;return z;},_getLoggedInUser:function(){var i=this;var G=this._oJamDataHandler.getSender();G.promise.done(function(w,x){i._oTimelineUser=w;});G.promise.fail(function(E){i._oLogger.error('Failed to get the sender',E.stack);});},_addTimelineItemToTimeline:function(i){var w=this._oTimeline.getModel().getData();w.timelineData.push(i);var x=new g({dateTime:i.timelineItemData.dateTime,userName:i.timelineItemData.userName,title:i.timelineItemData.title,text:i.timelineItemData.text,icon:i.timelineItemData.icon,userNameClickable:true,userNameClicked:this._onUserNameClicked,userPicture:i.timelineItemData.userPicture,embeddedControl:this._createEmbeddedControl(i),replyCount:i.timelineItemData.replyCount,replyListOpen:this._onReplyListOpen.bind(this),customReply:this._createReplyPopover(),});this._oTimeline.insertContent(x,0);var y=w.timelineData.indexOf(i);var z=x.getParent().getModel().createBindingContext("/timelineData/"+y);x.setBindingContext(z);},_validateInputParameters:function(){this._oInputValidator=new I(this);if(!this._oInputValidator.areCustomFiltersValid()){this.destroy();}return this._oInputValidator;},_validateBusinessObjectMap:function(){if(!this._oInputValidator){this._validateInputParameters();}if(!this._oInputValidator.isBusinessObjectMapValid(this._oBusinessObjectMap)){this.destroy();}},_validateBusinessObject:function(){if(!this._oInputValidator){this._validateInputParameters();}if(!this._oInputValidator.isBusinessObjectValid(this._oBusinessObject)){this.destroy();}},_onContextSelect:function(E){var i=E.getParameter("selectedItem");this._oFilter={type:i.getKey()};if(i.getKey()==this._oFilterConstants.FILTER_TYPE.feedUpdates){this._oTimelineModel.setProperty("/sort",false);this._oFilterIcon.setEnabled(false);this._oAddPostButton.setEnabled(true);}else{if(!this._defaultAttributes.jamOnly){this._resetFilter();}this._oFilterIcon.setEnabled(true);this._oAddPostButton.setEnabled(false);}this._oTimelineDataHandler.reset();this._refreshTimelineModel();var w=sap.ui.getCore().byId(this.getId()+"_context_select_popover");w.close();this._oContextSelect.setText(i.getText());},_onGrow:function(){var i=this;if(!this._oGettingTimelineData||this._oGettingTimelineData.state()!="pending"){this._oGettingTimelineData=this._oTimelineDataHandler.getTimelineData(this._oFilter).then(function(w){var x=i._oTimelineModel.getData();x.timelineData=x.timelineData.concat(w);i._oTimelineModel.setData(x);i._setReplies();},function(E){i._oCommonUtil.displayError();});}else{this._oLogger.info("A previous request is still pending.");}},_onUserNameClicked:function(i){var w=i.getSource().getParent().getParent();var x=i.getSource().getParent();var y=i.getSource();if(!w._oSocialProfile){w._oSocialProfile=sap.ui.getCore().createComponent({name:"sap.collaboration.components.socialprofile",id:this.getId()+"_socialProfile"});w._oSocialProfile._defaultAttributes=w._defaultAttributes;}var z=x.getContent().indexOf(y);var A={openingControl:y._userNameLink,memberId:x.getModel().getData().timelineData[z].timelineItemData.userEmail};w._oSocialProfile.setSettings(A);w._oSocialProfile.open();},_onAddPost:function(i){var w=this;var x=this.byId("social_TextArea").convertTextWithFullNamesToEmailAliases();this.byId("_addPostPopover").close();if(x&&x.trim()!==""){this._oTimeline.setBusyIndicatorDelay(0).setBusy(true);this._oJamDataHandler.addPostToExternalObject(x,this._oTimelineDataHandler.getCurrentExternalBO()).then(function(y){w.byId("social_TextArea").clearText();w.byId("addPost_postButton").setEnabled(false);if(w._oFilter.type!==w._oFilterConstants.FILTER_TYPE.systemUpdates&&w._oFilter.type!==w._oFilterConstants.FILTER_TYPE.custom){var z=w._oTimelineDataHandler._mapFeedEntriesToTimelineItems([y])[0];w._addTimelineItemToTimeline(z);if(!w._oTimelineDataHandler.getUserInfoFromBuffer(y.Creator.Email)){w._oTimelineDataHandler.addUserInfoToBuffer(y.Creator);}}}).always(function(){w._oTimeline.setBusy(false);}).fail(function(){w._oCommonUtil.displayError(w._oLanguageBundle.getText("ST_POST_TO_JAM_FAILED"));});}else{this._oLogger.info('Posting an empty comment is not allowed, no feed entry will be created.');}},_onSuggest:function(E){var w=this;if(this.gettingSuggestions){this.gettingSuggestions.request.abort();}var x=E.getSource();var V=E.getParameter("value");if(V.trim()===""){x.showSuggestions([]);}else{this.gettingSuggestions=this._oJamDataHandler.getSuggestions(V);this.gettingSuggestions.promise.done(function(y,z){var A=y.results;if(A.length===0){x.closeSuggestionPopover();}else{var G=[];for(var i=0;i<A.length;i++){G.push({fullName:A[i].FullName,email:A[i].Email,userImage:w._buildThumbnailImageURL(A[i].Id)});}x.showSuggestions(G);}});this.gettingSuggestions.promise.fail(function(i){if(i.response&&i.response.statusCode){w._oCommonUtil.displayError(w._oLanguageBundle.getText("ST_GET_SUGGESTIONS_FAILED"));}});}},_onCustomActionClicked:function(i){var w={};var x=i.getSource().getBindingContext();var y=x.getPath();var z=i.getSource().getModel().getProperty(y+"/timelineItemData/customActionData/oDataEntry");w.oDataEntry=z;w.timelineEntryId=i.getParameters().id;w.key=i.getParameters().key;this.fireCustomActionPress(w);},_getAtMentionClicked:function(i){var w=this;var A=[];var x=i.getSource();var y=i.getParameter("link");var z=this._oJamDataHandler.getAtMentions(y.getModel().getData().feedId);z.promise.done(function(E,G){var H=y.getModel().getProperty("/placeholderIndex");A=E.results;w._showSocialProfile(x,y,A[H].Email);});z.promise.fail(function(){w._oLogger.error('Failed to retrieve the @mentions.');w._oCommonUtil.displayError(w._oCommonUtil.getLanguageBundle().getText('ST_GET_ATMENTIONS_FAILED'));});},_onReplyListOpen:function(E){if(!this._bReplyPopoverIsOpen){this._bReplyPopoverIsOpen=true;var i=E.getSource();try{var w=this._getFeedId(i);if(!w){throw new Error('Failed to get the feed entry ID.');}}catch(x){this._oLogger.error('Failed to get the feed entry ID');this._oCommonUtil.displayError(this._oLanguageBundle.getText('ST_GET_REPLIES_FAILED'));return;}this._getReplies(w,undefined,i);}},_getReplies:function(i,N,w){var x=this;w.getCustomReply().setBusyIndicatorDelay(0).setBusy(true);this.gettingReplies=this._oJamDataHandler.getReplies(i,N);this.gettingReplies.promise.done(function(y,z){x._oRepliesData=y;var A=y.results.reverse();A.forEach(function(E){E.Creator.ThumbnailImage=x._oTimelineDataHandler.buildImageUrl(E.Creator);E.CreatedAt=x._oDateUtil.formatDateToString(E.CreatedAt);});w.getCustomReply().addReplies({data:A,more:x._oRepliesData.__next?true:false});w.getCustomReply().setBusy(false);});this.gettingReplies.promise.fail(function(E){if(E.response&&E.response.statusCode){x._oCommonUtil.displayError(x._oCommonUtil.getLanguageBundle().getText('ST_GET_REPLIES_FAILED'));}});},_createReplyPopover:function(){this._oReplyPopover=new R({socialTextArea:new S({height:"80px",width:"100%",enableNotifyAll:false,suggestionPlacement:s.Top,suggest:[this._onSuggest,this],afterSuggestionClose:[function(){if(this.gettingSuggestions){this.gettingSuggestions.request.abort();}},this]}),postReplyPress:[this._onPostReplyPress,this],moreRepliesPress:[function(E){var i=E.getSource().getParent();if(this._oRepliesData.__next){this._getReplies(undefined,this._oRepliesData.__next,i);}},this],afterClose:[function(E){if(this.gettingReplies){this.gettingReplies.request.abort();}this._bReplyPopoverIsOpen=false;},this],});this._oReplyPopover.getSocialTextArea().attachLiveChange(function(E){E.getParameter("value").trim()!==""?this.enableButton(true):this.enableButton(false);}.bind(this._oReplyPopover));return this._oReplyPopover;},_onPostReplyPress:function(E){var i=this;var V=E.getParameter("value");var w=E.getSource().getParent();var x=w.getBindingContext().getObject();var y=x.timelineItemData.feedId;var z=w.getCustomReply();z.setBusyIndicatorDelay(0).setBusy(true);var A=this._oJamDataHandler.postReply(y,V);z._oReplyTextArea.focus();A.promise.done(function(G,H){z.getTextArea().clearText();z.enableButton(false);var K={Text:G.results.Text,Creator:{Email:i._oTimelineUser.Email,FullName:i._oTimelineUser.FullName},CreatedAt:i._oDateUtil.formatDateToString(G.results.CreatedAt),};var N=i._oTimelineDataHandler.getUserPicture(i._oTimelineUser.Email);N?K.Creator.ThumbnailImage=N:K.Creator.ThumbnailImage=i._oTimelineDataHandler.buildImageUrl(G.results);z.addReply(K);z.setBusy(false);w.setReplyCount(w.getReplyCount()+1);});A.promise.fail(function(G){z.setBusy(false);i._oCommonUtil.displayError(i._oLanguageBundle.getText("ST_POST_REPLY_FAILED"));});},_onEnableSocialChange:function(E){var i=E.getSource().getValue();(i===true)?this._oAddPostButton.setVisible(true):this._oAddPostButton.setVisible(false)},_showFeedUpdatesInTimeline:function(i){var w=this._oTimeline.getMessageStrip();if(i>0){if(!this.byId("refreshLink")){var x=new L(this.createId("refreshLink"),{text:this._oLanguageBundle.getText("GF_REFRESH_FEED"),press:[function(){this._hideFeedUpdatesInTimeline();this._oTimelineDataHandler.reset();this._refreshTimelineModel();},this]});w.setLink(x);w.setType(M.Information);w.setShowIcon(true);}i==1?w.setText(this._oLanguageBundle.getText("GF_NEW_FEED_UPDATE")):w.setText(this._oLanguageBundle.getText("GF_NEW_FEED_UPDATES",i));w.setVisible(true);this._oTimeline.rerender();}},_hideFeedUpdatesInTimeline:function(){var i=this._oTimeline.getMessageStrip();i.close();},_startAutoCheckingForNewUpdates:function(){this._iNewFeedUpdatesCheckerTimeDelay=120000;this._sNewFeedUpdatesCheckerTimeoutId=q.sap.delayedCall(this._iNewFeedUpdatesCheckerTimeDelay,this,this._checkForNewFeedUpdates);},_stopAutoCheckingForNewUpdates:function(){q.sap.clearDelayedCall(this._sNewFeedUpdatesCheckerTimeoutId);},_checkForNewFeedUpdates:function(){var i=function(z,A){this._showFeedUpdatesInTimeline(z);this._sNewFeedUpdatesCheckerTimeoutId=q.sap.delayedCall(this._iNewFeedUpdatesCheckerTimeDelay,this,this._checkForNewFeedUpdates);};var E=function(z){this._oLogger.error("Failed to check for new feed updates.");this._sNewFeedUpdatesCheckerTimeoutId=q.sap.delayedCall(this._iNewFeedUpdatesCheckerTimeDelay,this,this._checkForNewFeedUpdates);};var w=this._oTimeline.getContent()[0];var x=w?w.getBindingContext().getObject()._feedEntryData.TopLevelId:'';var y=this._oTimelineDataHandler.getCurrentExternalBO().Id;this._oJamDataHandler.getFeedUpdatesLatestCount(x,y).done(i.bind(this)).fail(E.bind(this));},_buildThumbnailImageURL:function(i){return this._defaultAttributes.collaborationHostServiceUrl+"/Members('"+i+"')/ThumbnailImage/$value";}});return v;});
