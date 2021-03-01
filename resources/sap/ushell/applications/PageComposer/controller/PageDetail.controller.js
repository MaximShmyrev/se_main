// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["./BaseController","./ConfirmChangesDialog.controller","./Page","./TileSelector","sap/base/Log","sap/m/ButtonType","sap/m/MessageBox","sap/m/MessageItem","sap/m/MessagePopover","sap/m/MessageToast","sap/ui/core/BusyIndicator","sap/ui/core/Fragment","sap/ui/core/library","sap/ui/core/message/Message","sap/ui/core/MessageType","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/json/JSONModel","sap/ushell/resources","sap/ushell/library","sap/ushell/utils","sap/ushell/services/Container"],function(B,C,P,T,L,a,M,b,c,d,e,F,f,g,h,i,j,J,u,k,U){"use strict";var I=f.InvisibleMessageMode;var D=k.DisplayFormat;return B.extend("sap.ushell.applications.PageComposer.controller.PageDetail",{Page:P,TileSelector:new T(),onInit:function(){U.setPerformanceMark("FLPPage-manage.startDetailInitialization",{bUseUniqueMark:true});this.setModel(new J());this._oAssignedSpacesTable=this.byId("spaceAssignmentTable");this.getRouter().getRoute("view").attachPatternMatched(this._onPageMatched,this);this.getView().setBusyIndicatorDelay(0);this.Page.init(this);this._oInvisibleMessageInstance=this.getOwnerComponent().getInvisibleMessageInstance();},onBreakpointChanged:function(l){var m,o=this.getModel();if(!o){return;}if(typeof l!=="undefined"){m=(l.getParameters().currentBreakpoint==="S");o.setProperty("/currentBreakpointIsS",m);}else{m=o.getProperty("/currentBreakpointIsS");}this.TileSelector.setEnableDnD(!m);this.TileSelector.showSwitchViewButton(m);},onTabChange:function(E){var s=E.getParameter("selectedKey");if(s==="iconTabBarSpaceAssignment"){this._initSpaceAssignment(this.getModel().getProperty("/page/id"));}},_setDirtyFlag:function(v){sap.ushell.Container.setDirtyFlag(v);},onExit:function(){B.prototype.onExit.apply(this,arguments);if(this.oMessagePopover){this.oMessagePopover.destroy();delete this.oMessagePopover;}this.Page.exit();},handleMessagePopoverPress:function(E){if(!this.oMessagePopover){this.oMessagePopover=new c("messagePopover",{items:{path:"/messages",template:new b({type:"{type}",title:"{message}",activeTitle:"{active}",description:"{description}",counter:"{counter}"})}}).setModel(this.getModel());}this.oMessagePopover.toggle(E.getSource());},onToggleCatalogsButtonPress:function(){var m=this.getModel();if(m.getProperty("/currentBreakpointIsS")){this.switchDynamicSideContentView();}else{this.onUpdateSideContentVisibility();}},onUpdateSideContentVisibility:function(){var l=this.getModel().getProperty("/catalogsExpanded");var t=this.getView().byId("toggleCatalogsButton");t.setPressed(l);this.getModel().setProperty("/catalogsExpanded",!l);var m=l?this.getResourceBundle().getText("Message.Catalogs.nowBeingHidden"):this.getResourceBundle().getText("Message.Catalogs.nowBeingShown");this._oInvisibleMessageInstance.announce(m,I.Polite);},switchDynamicSideContentView:function(){var o=this.getView().byId("pageContent");var t=this.getView().byId("toggleCatalogsButton");o.toggle();var s=o.isSideContentVisible();t.setPressed(s);var m=s?this.getResourceBundle().getText("Message.Catalogs.nowBeingShown"):this.getResourceBundle().getText("Message.Catalogs.nowBeingHidden");this._oInvisibleMessageInstance.announce(m,I.Polite);},_handlePageSaveError:function(s,m){if(s.statusCode==="412"||s.statusCode==="400"){this._showConfirmChangesDialog(s,m);}else{this.showMessageBoxError(s.message,false);}this._setDirtyFlag(true);},_resetModelData:function(){this.getModel().setProperty("/",{page:{},editMode:!!this.oSettingsModel.getProperty("/editMode"),errors:[],warnings:[],info:[],messages:[],catalogsExpanded:true,currentBreakpointIsS:this.getView().byId("pageContent").getCurrentBreakpoint()==="S"});},_onPageMatched:function(l){var A=l.getParameter("arguments");this.sPageID=decodeURIComponent(A.pageId);this.oSettingsModel=this.getOwnerComponent().getModel("settings");this.setTitle(this.getResourceBundle().getText("PageDetails.Title"));this.getView().byId("iconTabBar").setSelectedKey("iconTabBarPageContent");this._resetModelData();this._resetRolesModel();this._deeplinkAccess=this.oSettingsModel.getProperty("/deepLink");this.oSettingsModel.setProperty("/deepLink",true);this.oTransportComponentPromise=this.getOwnerComponent().createTransportComponent();this._enhanceTabBarWithTransports();this._loadPage(this.navigateBack.bind(this));},_loadPage:function(o){U.setPerformanceMark("FLPPage-manage.startLoadPageDetail");var p=this.getPageRepository();this.getView().setBusy(true);this._setDirtyFlag(false);return Promise.all([this.oTransportComponentPromise,p.getPage(this.sPageID),p.getRoles(this.sPageID),new Promise(function(r,l){this.getModel("PageRepository").read("/tileTypeSet",{urlParameters:{$expand:"vizOptions/displayFormats/supported"},success:r,error:l});}.bind(this))]).then(function(l){var t=l[0];var m=l[1];var n=l[2];this._resetRolesModel({available:n.map(function(q){return q.id;})});this._setSupportedOperationModel(m);if(!this._pageDisplayAllowed(m)){this.navigateToUnsupportedPage(m.id);return Promise.resolve();}if(!this.getModel().getProperty("/editMode")){this.getModel().setProperty("/page",m);this.Page.refreshRoleContext();t.setShowAssignButton(true);return Promise.resolve(m);}return this._tryEnablingEditMode(m,t,o);}.bind(this)).finally(function(){var l=this.getView().byId("page");var O={onAfterRendering:function(){U.setPerformanceMark("FLPPage-manage.PageDetailCompletelyLoaded");l.removeEventDelegate(O);}};l.addEventDelegate(O);this.getView().setBusy(false);U.setPerformanceMark("FLPPage-manage.endLoadPageDetail");}.bind(this)).catch(function(E){if(E instanceof Error){L.error(E);}else{L.error(((E&&E.message)?E.message:"Unexpected error"),"PageComposer/controller/PageDetail.controller.js");}this.navigateToErrorPage(this.sPageID);}.bind(this));},_tryEnablingEditMode:function(p,t,o){return this._pageEditAllowed(p).then(function(E){this.getModel().setProperty("/page",p);this.Page.refreshRoleContext();if(!E){this.getModel().setProperty("/editMode",false);t.setShowAssignButton(true);return Promise.resolve(p);}this.checkShowEditDialog(p,this._updatePageWithMetadata.bind(this),o);t.setShowAssignButton(false);sap.ui.getCore().getMessageManager().removeAllMessages();if(!this.getModel().getProperty("/page/sections").length){this.Page.addSection();}else{this._collectMessages();}return this._loadTileSelector().then(function(){return Promise.resolve(p);});}.bind(this));},_loadTileSelector:function(){U.setPerformanceMark("FLPPage-manage.startLoadTileSelector");this.TileSelector.init(this);this.onBreakpointChanged();return this.TileSelector.initTiles().then(function(){this.TileSelector.setAddTileHandler(this.addVisualizationInSection.bind(this));U.setPerformanceMark("FLPPage-manage.endLoadTileSelector");}.bind(this));},_enhanceTabBarWithTransports:function(){this.oTransportComponentPromise.then(function(t){t.setIconTabBar(this.getView().byId("iconTabBar"),this.sPageID,"Page");}.bind(this));},onAssignTransport:function(l){var t=l.getParameter("transportId");this._enhanceModelWithTransportId(t);},_enhanceModelWithTransportId:function(t){var r=this.getResourceBundle();var p=this.getModel().getProperty("/page");p.transportId=t;this.savePageAndUpdateModel(p).then(function(){d.show(r.getText("Message.SavedChanges"),{closeOnBrowserNavigation:false});this._setDirtyFlag(false);}.bind(this)).catch(function(s){this.getPageRepository().getPageWithoutStoringETag(this.sPageID).then(function(R){this._handlePageSaveError(s,R.modifiedByFullname||R.modifiedBy);}.bind(this)).catch(function(){this._handlePageSaveError(s);}.bind(this));}.bind(this)).finally(function(){this.getView().setBusy(false);}.bind(this));},onOpenTileInfo:function(E){var o=E.getSource();this._openTileInfoPopover(o,o.getBindingContext());},_updatePageWithMetadata:function(l){if(l&&l.transportId){this.getModel().setProperty("/page/transportId",l.transportId);this._setDirtyFlag(true);}if(this.getRootView().byId("editDialog")){this.getRootView().byId("editDialog").close();}},_deletePage:function(E){var o=E.getSource().getParent(),t=E.transportId||"",s=this.getResourceBundle().getText("Message.SuccessDeletePage");e.show(0);return this.getPageRepository().deletePage(this.sPageID,t).then(function(){this.navigateBack();d.show(s,{closeOnBrowserNavigation:false});o.close();}.bind(this)).catch(this.handleBackendError.bind(this)).finally(function(){e.hide();});},onEdit:function(){this.getModel().setProperty("/editMode",true);this._loadPage(this.discardChangesAndCancel.bind(this));},onSave:function(){var p=this.getModel().getProperty("/page");var r=this.getResourceBundle();var s=function(l){if(l===M.Action.OK){this.getView().setBusy(true);this.getModel().setProperty("/editMode",false);this.savePageAndUpdateModel(p).then(function(){return this.getPageRepository().getRoles(this.sPageID);}.bind(this)).then(function(m){this._resetRolesModel({available:m.map(function(o){return o.id;})});d.show(r.getText("Message.SavedChanges"),{closeOnBrowserNavigation:false});this._setDirtyFlag(false);}.bind(this)).catch(function(S){this.getPageRepository().getPageWithoutStoringETag(p.id).then(function(m){this._handlePageSaveError(S,m.modifiedByFullname||m.modifiedBy);}.bind(this)).catch(function(){this._handlePageSaveError(S);}.bind(this));}.bind(this)).finally(function(){this.getView().setBusy(false);}.bind(this));}}.bind(this);if(!p.title){this.showMessageBoxError(r.getText("Message.EmptyTitle"));return;}if(!window.navigator.onLine){this.showMessageBoxError(r.getText("Message.NoInternetConnection"));return;}if(this.getModel().getProperty("/errors").length>0){sap.ushell.Container.getServiceAsync("Message").then(function(m){var l=r.getText("Message.PageHasErrors"),t=r.getText("Title.PageHasErrors");m.error(l,t);});return;}if(this.getModel().getProperty("/warnings").length>0){M.confirm(r.getText("Message.PageHasWarnings"),{icon:M.Icon.WARNING,title:r.getText("Title.PageHasWarnings"),actions:[M.Action.YES,M.Action.NO],emphasizedAction:M.Action.YES,initialFocus:M.Action.NO,onClose:function(A){if(A===M.Action.YES){s(M.Action.OK);}}});return;}s(M.Action.OK);},onCancel:function(l){if(!sap.ushell.Container.getDirtyFlag()){this.discardChangesAndCancel();return;}var o=l.getSource();if(!this._oPopover){F.load({id:this.createId("discardChangesFragment"),name:"sap.ushell.applications.PageComposer.view.DiscardChangesPopover",type:"XML",controller:this}).then(function(p){this._oPopover=p;this.getView().addDependent(this._oPopover);this._oPopover.openBy(o);}.bind(this));}else{this._oPopover.openBy(o);}},discardChangesAndCancel:function(){this._reloadPageInfoValueStates();this.getModel().setProperty("/editMode",false);this._loadPage();},_reloadPageInfoValueStates:function(){this._getPageDescriptionError();this._getPageTitleError();},onDelete:function(){var p=this.getModel().getProperty("/page");this.checkShowDeleteDialog(p,this._deletePage.bind(this));},onCopy:function(){var p=this.getModel().getProperty("/page");this.showCopyDialog(p,function(E){var o=E.getSource().getParent();var l=o.getModel().getProperty("/");if(E.transportId){l.transportId=E.transportId;}if(E.devclass){l.devclass=E.devclass;}e.show(0);sap.ushell.Container.getServiceAsync("PageReferencing").then(function(m){return m.createReferencePage(l);}).then(function(r){return this.getPageRepository().copyPage(r);}.bind(this)).then(function(){this.navigateToEdit(l.targetId);d.show(this.getResourceBundle().getText("Message.PageCreated"),{closeOnBrowserNavigation:false});o.close();}.bind(this)).catch(this.handleBackendError.bind(this)).finally(function(){e.hide();});}.bind(this));},onErrorMessageClicked:function(){var p=this.getModel().getProperty("/page");var E=this.formatAssignmentDetailsMessage(p.code);this.showMessageBoxWarning(p.message,E,false);},_showConfirmChangesDialog:function(s,m){if(!this.byId("confirmChangesDialog")){F.load({name:"sap.ushell.applications.PageComposer.view.ConfirmChangesDialog",controller:new C(this.getView(),this.getResourceBundle())}).then(function(o){if(s.statusCode==="412"){var l=sap.ui.getCore().byId("confirmChangesModifiedByText");l.setVisible(true);}var n=m||this.getModel().getProperty("/page/modifiedByFullname");this.getModel().setProperty("/simpleError",{message:s.message,statusCode:s.statusCode,modifiedBy:n,pageNotFound:s.pageNotFound});this.getView().addDependent(o);o.open();}.bind(this));}else{this.byId("confirmChangesDialog").open();}},_formatLength:function(o){return(o?o.length:undefined);},_pageEditAllowed:function(p){var E=!this.checkMasterLanguageMismatch(p);return Promise.resolve(E);},_pageDisplayAllowed:function(p){return!p.isTemplate||!this._deeplinkAccess;},savePageAndUpdateModel:function(p){return this.getPageRepository().updatePage(p).then(function(r){this.sPageID=r.id;this.getModel().setProperty("/page",r);}.bind(this));},_collectMessages:function(){var m=this.Page.collectMessages(),E=m.errors.concat(this._validatePageInfoAndGetErrors()),w=m.warnings,l=m.infos.concat(this._getPageAssignmentMessages()),n=E.concat(w,l);this.getModel().setProperty("/errors",E);this.getModel().setProperty("/warnings",w);this.getModel().setProperty("/infos",l);this.getModel().setProperty("/messages",n);var o=this.getView().byId("buttonValidation");if(E.length){o.setType(a.Negative);}else if(w.length){o.setType(a.Critical);}else{o.setType(a.Neutral);}},_getPageAssignmentMessages:function(){var p=this.getModel().getProperty("/page"),m=this.getPageRepository().getMissingAssignment(p.code),l=[],r=this.getResourceBundle();if(m==="role"){l.push(new g({type:h.Information,message:r.getText("Message.NotAssignedToRoleInformation"),description:r.getText("Message.NotAssignedToRoleInformationDetails")}));}else if(m==="space"){l.push(new g({type:h.Information,message:r.getText("Message.NotAssignedToSpaceInformation"),description:r.getText("Message.NotAssignedToSpaceInformationDetails")}));}return l;},_checkPageHasErrors:function(p){if(p.code!==""){var E=this.formatAssignmentDetailsMessage(p.code);this.showMessageBoxWarning(p.message,E,true);return true;}return false;},onSectionTitleChange:function(){this._collectMessages();this._setDirtyFlag(true);},showContextSelector:function(o){sap.ui.require(["sap/ushell/applications/PageComposer/controller/ContextSelector.controller"],function(l){if(!this.oContextSelectorController){this.oContextSelectorController=new l(this.getRootView(),this.getResourceBundle());}var s=this.getModel("roles").getProperty("/selected");this.oContextSelectorController.openSelector(this.sPageID,s,o).catch(function(m){this.oContextSelectorController.destroy();this.handleBackendError(m);}.bind(this));}.bind(this));},onOpenContextSelector:function(){this.showContextSelector(function(s){this._resetRolesModel({selected:s});this.TileSelector.refreshRoleContext();this.Page.refreshRoleContext();this._collectMessages();}.bind(this));},_delegateFocus:function(o){var l={onAfterRendering:function(){setTimeout(function(){o.focus();o.removeEventDelegate(l);},0);}};o.focus();o.addEventDelegate(l);},addSectionAt:function(s){var S=this.getModel().getProperty("/page/sections");if(!S){L.warning("The Model is not ready yet.");return;}if((!s&&s!==0)||s>S.length){s=S.length;}S.splice(s,0,{title:"",viz:[]});this.getModel().setProperty("/page/sections",S);var p=this.getView().byId("page");this._delegateFocus(p.getSections()[s].byId("title-edit"));this._collectMessages();this._setDirtyFlag(true);},deleteSection:function(s){if((!s&&s!==0)||s<0){return;}var S=this.getModel().getProperty("/page/sections");if(s<S.length){S.splice(s,1);this.getModel().setProperty("/page/sections",S);d.show(this.getResourceBundle().getText("Message.SectionDeleted"));var p=this.getView().byId("page"),l=p.getSections();if(l.length){if(s>(l.length-1)){l[l.length-1].focus();}else{l[s].focus();}}else{this._delegateFocus(p);}this._collectMessages();this._setDirtyFlag(true);}},moveSection:function(o,n){if(!o&&o!==0||!n&&n!==0){return;}var s=this.getModel().getProperty("/page/sections"),S=s.splice(o,1)[0];s.splice(n,0,S);this.getModel().setProperty("/page/sections",s);var l=u.i18n.getText("PageRuntime.Message.SectionMoved");this._oInvisibleMessageInstance.announce(l,I.Polite);this._collectMessages();this._setDirtyFlag(true);},addVisualizationInSection:function(v,s,l){if(!v||!s.length){return;}s.forEach(function(S){var V=this.getModel().getProperty("/page/sections/"+S+"/viz");if(!V){L.warning("The Model is not ready yet.");return;}if(typeof l==="undefined"){l=V.length;}V.splice(l,0,v);this.getModel().setProperty("/page/sections/"+S+"/viz",V);this._collectMessages();this._setDirtyFlag(true);}.bind(this));},removeVisualizationInSection:function(v,s){var p="/page/sections/"+s+"/viz",V=this.getModel().getProperty(p),S=this.getView().byId("page").getSections()[s],o=S.getItemPosition(v);var l=V.splice(v,1);this.getModel().setProperty(p,V);if(l[0].displayFormatHint===D.Compact){d.show(this.getResourceBundle().getText("Message.LinkRemoved"));}else{d.show(this.getResourceBundle().getText("Message.TileRemoved"));}S.focusVisualization(o);this._collectMessages();this._setDirtyFlag(true);},moveVisualizationInSection:function(o,n,l,m,p){if(!o&&o!==0||!n&&n!==0||!l&&l!==0||!m&&m!==0){return false;}var O="/page/sections/"+l+"/viz",N="/page/sections/"+m+"/viz",q=this.getModel().getProperty(O),r=this.getModel().getProperty(N),s=q.splice(o,1);var t=s[0].displayFormatHint;var v=p&&(t||"").indexOf(p)!==0;if(v){s[0].displayFormatHint=p;}r.splice(n,0,s[0]);this.getModel().setProperty(O,q);this.getModel().setProperty(N,r);var w;if(v){if(t===D.Compact){w=u.i18n.getText("PageRuntime.Message.LinkConverted");}else{w=u.i18n.getText("PageRuntime.Message.TileConverted");}}else if(p===D.Compact){w=u.i18n.getText("PageRuntime.Message.LinkMoved");}else{w=u.i18n.getText("PageRuntime.Message.TileMoved");}this._oInvisibleMessageInstance.announce(w,I.Polite);this._collectMessages();this._setDirtyFlag(true);return true;},_validatePageInfoAndGetErrors:function(){var p=[],t=this._getPageTitleError(),o=this._getPageDescriptionError();if(t){p.push(t);}if(o){p.push(o);}return p;},onPageInfoChange:function(){this._collectMessages();this._setDirtyFlag(true);},_getPageTitleError:function(){var o=this.getView().byId("titleInput"),l=!!o.getValue().trim(),E;if(!l){E=new g({type:h.Error,message:this.getResourceBundle().getText("Message.InvalidPageTitle"),description:this.getResourceBundle().getText("Message.InvalidPageTitleDetails")});o.setValueState(f.ValueState.Error);}else{o.setValueState(f.ValueState.None);}return E;},_getPageDescriptionError:function(){var o=this.getView().byId("descriptionInput"),l=!!o.getValue().trim(),E;if(!l){E=new g({type:h.Error,message:this.getResourceBundle().getText("Message.InvalidPageDescription"),description:this.getResourceBundle().getText("Message.InvalidPageDescriptionDetails")});o.setValueState(f.ValueState.Error);}else{o.setValueState(f.ValueState.None);}return E;},_setSupportedOperationModel:function(p){if(p.isTemplate){this.getOwnerComponent().setMetaModelDataSapDelivered();}else{this.getOwnerComponent().setMetaModelData();}},_initSpaceAssignment:function(p){this._oCANService=sap.ushell.Container.getService("CrossApplicationNavigation");this._checkNavigationSupported();this.getView().bindElement({path:"PageRepository>/pageSet('"+encodeURIComponent(p)+"')",parameters:{expand:"spaces"}});},_checkNavigationSupported:function(){var l=[{target:{semanticObject:"FLPSpace",action:"manage"}}];var n;this._oCANService.isNavigationSupported(l,this.getOwnerComponent()).done(function(r){n=r[0].supported;}).fail(function(){n=false;}).always(function(){this.getModel().setProperty("/spaceAssignmentNavigationSupported",n);}.bind(this));},onManageLaunchpadSpaces:function(){this._oCANService.toExternal({target:{semanticObject:"FLPSpace",action:"manage"}});},onSpaceItemPress:function(l){var s=l.getParameter("listItem").getBindingContext("PageRepository").getProperty("id");this._oCANService.toExternal({target:{semanticObject:"FLPSpace",action:"manage"},appSpecificRoute:"&/view/"+encodeURIComponent(s)});},onSearchSpaces:function(l){var s=l.getSource().getValue()||"",t=this.byId("spaceAssignmentTable"),o=t.getBinding("items");o.filter(new i([new i("id",j.Contains,s),new i("description",j.Contains,s),new i("title",j.Contains,s)],false));if(o.getLength()===0){if(s){t.setNoDataText(this.getResourceBundle().getText("Message.NoSpacesFound"));}else{t.setNoDataText(this.getResourceBundle().getText("Message.NoSpaces"));}}},showViewSettingsSpaceAssignmentDialog:function(){if(this._oViewSettingsSpaceAssignmentDialog){this._oViewSettingsSpaceAssignmentDialog.open();return;}sap.ui.require(["sap/ui/Device","sap/ushell/applications/PageComposer/controller/ViewSettingsSpaceAssignmentDialog.controller"],function(l,V){F.load({name:"sap.ushell.applications.PageComposer.view.ViewSettingsSpaceAssignmentDialog",type:"XML",controller:new V(this)}).then(function(o){this._oViewSettingsSpaceAssignmentDialog=o;this.getView().addDependent(o);o.open();}.bind(this));}.bind(this));}});});
