//@ui5-bundle sap/ushell/applications/PageComposer/Component-h2-preload.js
// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.predefine('sap/ushell/applications/PageComposer/Component',["sap/ui/core/InvisibleMessage","sap/ui/core/UIComponent","./controller/ErrorDialog","sap/ui/model/json/JSONModel","./util/PagePersistence","sap/ushell/utils","sap/ui/core/routing/History"],function(I,U,E,J,P,u,H){"use strict";return U.extend("sap.ushell.applications.PageComposer.Component",{metadata:{"manifest":"json"},_oTransportPromise:null,init:function(){U.prototype.init.apply(this,arguments);u.setPerformanceMark("FLPPage-manage.startInitialization",{bUseUniqueMark:true});this.getRouter().initialize();var c=this.getComponentData();var s=c&&c.startupParameters;this._handleStartupParams(s||{});this.getModel("PageRepository").setHeaders({"sap-language":sap.ushell.Container.getUser().getLanguage(),"sap-client":sap.ushell.Container.getLogonSystem().getClient()});this.getModel("PageRepository").getMetaModel().loaded().then(this.setMetaModelData.bind(this));this.getModel("PageRepository").attachMetadataFailed(function(e){this.getRouter().navTo("ODataError",e,true);}.bind(this));this.getModel("PageRepository").attachBatchRequestSent(function(){u.setPerformanceMark("FLPPage-manage.startLoadPage");});this.getModel("PageRepository").attachBatchRequestCompleted(function(){u.setPerformanceMark("FLPPage-manage.endLoadPage");});this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(),"message");this.setModel(new J({editMode:false,deepLink:H.getInstance().getDirection()===undefined}),"settings");this._oInvisibleMessageInstance=I.getInstance();},getPageRepository:function(){if(!this.oPagePersistenceInstance){this.oPagePersistenceInstance=new P(this.getModel("PageRepository"),this.getModel("i18n").getResourceBundle(),this.getModel("message"));}return this.oPagePersistenceInstance;},getInvisibleMessageInstance:function(){return this._oInvisibleMessageInstance;},isTransportSupported:function(){return true;},_handleStartupParams:function(s){var p=s.pageId&&s.pageId[0];var m=s.mode&&s.mode[0];if(p){m="view";this.getRouter().navTo(m,{pageId:encodeURIComponent(p)},true);}},showErrorDialog:function(e){E.open(e,this.getModel("i18n"));},createTransportComponent:function(p){if(this.isTransportSupported()){if(!this._oTransportPromise){this._oTransportPromise=this.createComponent({async:true,usage:"transportInformation"});}return this._oTransportPromise.then(function(t){t.reset({"package":p});return t;});}return Promise.reject();},setMetaModelData:function(){var m=this.getModel("PageRepository").getMetaModel(),M={copySupported:!!m.getODataFunctionImport("copyPage"),deleteSupported:!!m.getODataFunctionImport("deletePage"),createSupported:this.getMetadata().getConfig().enableCreate,translationSupported:!!m.getODataEntitySet("translationSet")};this.setModel(new J(M),"SupportedOperationModel");},castBoolean:function(f){return JSON.parse(f||"true");},setMetaModelDataSapDelivered:function(){var m=this.getModel("PageRepository").getMetaModel(),M={copySupported:this.castBoolean(m.getODataEntitySet("pagesMasterSet")["sap:creatable"])||!!m.getODataFunctionImport("copyPage"),deleteSupported:this.castBoolean(m.getODataEntitySet("pagesMasterSet")["sap:deletable"]),createSupported:this.castBoolean(m.getODataEntitySet("pagesMasterSet")["sap:creatable"]),updateSupported:this.castBoolean(m.getODataEntitySet("pagesMasterSet")["sap:updatable"])};this.setModel(new J(M),"SupportedOperationModel");}});});
sap.ui.require.preload({
	"sap/ushell/applications/PageComposer/manifest.json":'{"_version":"1.21.0","sap.app":{"i18n":{"bundleUrl":"i18n/i18n.properties","supportedLocales":["","ar","bg","ca","cs","da","de","el","en","en_US_sappsd","en_US_saptrc","es","et","fi","fr","hi","hr","hu","it","iw","ja","kk","ko","lt","lv","ms","nl","no","pl","pt","ro","ru","sh","sk","sl","sv","th","tr","uk","vi","zh_CN","zh_TW"],"fallbackLocale":"en"},"id":"sap.ushell.applications.PageComposer","type":"application","embeddedBy":"","title":"{{PageComposer.AppTitle}}","ach":"CA-FLP-FE-DT","dataSources":{"PageRepositoryService":{"uri":"/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/pages/metadata.xml"}}},"cdsViews":[],"offline":false},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":false,"phone":false},"fullWidth":true},"sap.ui5":{"autoPrefixId":true,"componentUsages":{"transportInformation":{"name":"sap.ushell_abap.workbenchTransport","lazy":true}},"services":{"ShellUIService":{"factoryName":"sap.ushell.ui5service.ShellUIService"}},"dependencies":{"minUI5Version":"1.72.0","libs":{"sap.f":{"lazy":false},"sap.m":{"lazy":false},"sap.ui.core":{"lazy":false},"sap.ui.layout":{"lazy":false},"sap.ushell":{"lazy":false}},"components":{"sap.ushell_abap.workbenchTransport":{"lazy":true,"manifest":true}}},"models":{"PageRepository":{"dataSource":"PageRepositoryService","preload":true,"settings":{"defaultCountMode":"Inline","useBatch":true,"metadataUrlParams":{"sap-value-list":"none"}}},"i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties","settings":{"supportedLocales":["","ar","bg","ca","cs","da","de","el","en","en_US_sappsd","en_US_saptrc","es","et","fi","fr","hi","hr","hu","it","iw","ja","kk","ko","lt","lv","ms","nl","no","pl","pt","ro","ru","sh","sk","sl","sv","th","tr","uk","vi","zh_CN","zh_TW"],"fallbackLocale":"en"}}},"rootView":{"viewName":"sap.ushell.applications.PageComposer.view.App","type":"XML","async":true,"id":"pageComposer"},"handleValidation":false,"config":{"fullWidth":true,"sapFiori2Adaptation":true,"enableCreate":true,"enablePreview":true,"checkLanguageMismatch":true},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"sap.ushell.applications.PageComposer.view","controlId":"pageComposer","controlAggregation":"pages","async":true,"fullWidth":true},"routes":[{"pattern":"","name":"overview","target":"overview"},{"pattern":"view/{pageId}:?query:","name":"view","target":"view"},{"pattern":"error/{pageId}","name":"error","target":"error"},{"pattern":"unsupported/{pageId}","name":"unsupported","target":"unsupported"},{"pattern":"ODataError","name":"ODataError","target":"ODataError"}],"targets":{"overview":{"viewId":"pageOverview","viewName":"PageOverview"},"view":{"viewId":"view","viewName":"PageDetail"},"error":{"viewId":"error","viewName":"ErrorPage"},"unsupported":{"viewId":"unsupported","viewName":"ErrorPage"},"ODataError":{"viewId":"ODataErrorPage","viewName":"ODataErrorPage"}}},"contentDensities":{"compact":true,"cozy":true}}}'
},"sap/ushell/applications/PageComposer/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/applications/PageComposer/Component.js":["sap/ui/core/InvisibleMessage.js","sap/ui/core/UIComponent.js","sap/ui/core/routing/History.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/controller/ErrorDialog.js","sap/ushell/applications/PageComposer/util/PagePersistence.js","sap/ushell/utils.js"],
"sap/ushell/applications/PageComposer/controller/App.controller.js":["sap/ushell/applications/PageComposer/controller/BaseController.js"],
"sap/ushell/applications/PageComposer/controller/BaseController.js":["sap/base/Log.js","sap/m/MessageBox.js","sap/m/library.js","sap/ui/core/Fragment.js","sap/ui/core/SortOrder.js","sap/ui/core/UIComponent.js","sap/ui/core/mvc/Controller.js","sap/ui/core/routing/History.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/util/Transport.js","sap/ushell/library.js"],
"sap/ushell/applications/PageComposer/controller/BaseDialog.controller.js":["sap/ui/core/Fragment.js","sap/ui/core/library.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/controller/BaseController.js"],
"sap/ushell/applications/PageComposer/controller/CatalogSelector.controller.js":["sap/ui/core/Fragment.js","sap/ui/core/mvc/Controller.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js"],
"sap/ushell/applications/PageComposer/controller/ConfirmChangesDialog.controller.js":["sap/m/MessageToast.js","sap/ushell/applications/PageComposer/controller/BaseDialog.controller.js"],
"sap/ushell/applications/PageComposer/controller/ContextSelector.controller.js":["sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ushell/applications/PageComposer/controller/BaseDialog.controller.js"],
"sap/ushell/applications/PageComposer/controller/CopyPageDialog.controller.js":["sap/ushell/applications/PageComposer/controller/BaseDialog.controller.js"],
"sap/ushell/applications/PageComposer/controller/CreatePageDialog.controller.js":["sap/ushell/applications/PageComposer/controller/BaseDialog.controller.js"],
"sap/ushell/applications/PageComposer/controller/DeleteDialog.controller.js":["sap/ushell/applications/PageComposer/controller/BaseDialog.controller.js"],
"sap/ushell/applications/PageComposer/controller/EditDialog.controller.js":["sap/ushell/applications/PageComposer/controller/BaseDialog.controller.js"],
"sap/ushell/applications/PageComposer/controller/ErrorDialog.js":["sap/m/MessageToast.js","sap/ui/core/Fragment.js","sap/ui/model/json/JSONModel.js"],
"sap/ushell/applications/PageComposer/controller/ErrorPage.controller.js":["sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/controller/BaseController.js"],
"sap/ushell/applications/PageComposer/controller/Page.js":["sap/f/GridContainerItemLayoutData.js","sap/m/GenericTile.js","sap/m/ImageContent.js","sap/m/NumericContent.js","sap/m/TileContent.js","sap/m/library.js","sap/ui/core/MessageType.js","sap/ui/core/message/Message.js","sap/ui/events/KeyCodes.js","sap/ui/model/json/JSONModel.js","sap/ushell/Config.js","sap/ushell/library.js"],
"sap/ushell/applications/PageComposer/controller/PageDetail.controller.js":["sap/base/Log.js","sap/m/ButtonType.js","sap/m/MessageBox.js","sap/m/MessageItem.js","sap/m/MessagePopover.js","sap/m/MessageToast.js","sap/ui/core/BusyIndicator.js","sap/ui/core/Fragment.js","sap/ui/core/MessageType.js","sap/ui/core/library.js","sap/ui/core/message/Message.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/controller/BaseController.js","sap/ushell/applications/PageComposer/controller/ConfirmChangesDialog.controller.js","sap/ushell/applications/PageComposer/controller/Page.js","sap/ushell/applications/PageComposer/controller/TileSelector.js","sap/ushell/library.js","sap/ushell/resources.js","sap/ushell/services/Container.js","sap/ushell/utils.js"],
"sap/ushell/applications/PageComposer/controller/PageOverview.controller.js":["sap/m/ColumnListItem.js","sap/m/ListType.js","sap/m/MessageToast.js","sap/m/ObjectIdentifier.js","sap/m/Text.js","sap/ui/core/BusyIndicator.js","sap/ui/model/Sorter.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/controller/BaseController.js","sap/ushell/applications/PageComposer/util/FilterFactory.js","sap/ushell/utils.js"],
"sap/ushell/applications/PageComposer/controller/PagePreviewDialog.controller.js":["sap/ui/core/Fragment.js","sap/ui/core/mvc/Controller.js","sap/ui/model/Filter.js","sap/ui/model/json/JSONModel.js","sap/ushell/Config.js"],
"sap/ushell/applications/PageComposer/controller/TileSelector.js":["sap/base/strings/formatMessage.js","sap/m/Button.js","sap/m/List.js","sap/m/OverflowToolbar.js","sap/m/ResponsivePopover.js","sap/m/StandardListItem.js","sap/m/Text.js","sap/m/library.js","sap/ui/core/Fragment.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/model/Sorter.js","sap/ui/model/json/JSONModel.js","sap/ushell/library.js","sap/ushell/services/Container.js","sap/ushell/utils/clone.js"],
"sap/ushell/applications/PageComposer/controller/ViewSettingsCustomerCreatedDialog.controller.js":["sap/ui/core/format/DateFormat.js","sap/ui/core/mvc/Controller.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/model/Sorter.js"],
"sap/ushell/applications/PageComposer/controller/ViewSettingsSapDeliveredDialog.controller.js":["sap/ui/core/format/DateFormat.js","sap/ui/core/mvc/Controller.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/model/Sorter.js"],
"sap/ushell/applications/PageComposer/controller/ViewSettingsSpaceAssignmentDialog.controller.js":["sap/ui/core/mvc/Controller.js","sap/ui/model/Sorter.js"],
"sap/ushell/applications/PageComposer/controller/ViewSettingsTileSelector.controller.js":["sap/ui/core/Fragment.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/controller/BaseController.js"],
"sap/ushell/applications/PageComposer/util/FilterFactory.js":["sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ushell/utils/clone.js"],
"sap/ushell/applications/PageComposer/util/PagePersistence.js":["sap/ui/core/MessageType.js","sap/ushell/library.js","sap/ushell/utils/clone.js"],
"sap/ushell/applications/PageComposer/view/App.view.xml":["sap/m/NavContainer.js","sap/ui/core/mvc/XMLView.js","sap/ushell/applications/PageComposer/controller/App.controller.js"],
"sap/ushell/applications/PageComposer/view/CatalogSelector.fragment.xml":["sap/m/SelectDialog.js","sap/m/StandardListItem.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/ConfirmChangesDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/ContextSelector.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/List.js","sap/m/OverflowToolbar.js","sap/m/SearchField.js","sap/m/StandardListItem.js","sap/m/Text.js","sap/m/Toolbar.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/CopyPageDialog.fragment.xml":["sap/base/strings/formatMessage.js","sap/m/Button.js","sap/m/Dialog.js","sap/m/Input.js","sap/m/Label.js","sap/m/Text.js","sap/ui/core/ComponentContainer.js","sap/ui/core/Fragment.js","sap/ui/layout/form/SimpleForm.js"],
"sap/ushell/applications/PageComposer/view/CreatePageDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Input.js","sap/m/Label.js","sap/ui/core/ComponentContainer.js","sap/ui/core/Fragment.js","sap/ui/layout/form/SimpleForm.js"],
"sap/ushell/applications/PageComposer/view/DeleteDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Text.js","sap/ui/core/ComponentContainer.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/DiscardChangesPopover.fragment.xml":["sap/m/Button.js","sap/m/ResponsivePopover.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/EditDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Text.js","sap/ui/core/ComponentContainer.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/ErrorDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Link.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/ErrorPage.view.xml":["sap/m/Link.js","sap/m/MessagePage.js","sap/ui/core/mvc/XMLView.js","sap/ushell/applications/PageComposer/controller/ErrorPage.controller.js"],
"sap/ushell/applications/PageComposer/view/ODataErrorPage.view.xml":["sap/m/MessagePage.js","sap/ui/core/mvc/XMLView.js"],
"sap/ushell/applications/PageComposer/view/Page.fragment.xml":["sap/ui/core/Fragment.js","sap/ui/core/dnd/DropInfo.js","sap/ushell/ui/launchpad/Page.js","sap/ushell/ui/launchpad/Section.js"],
"sap/ushell/applications/PageComposer/view/PageContent.fragment.xml":["sap/base/strings/formatMessage.js","sap/m/Button.js","sap/m/FlexItemData.js","sap/m/OverflowToolbar.js","sap/m/ScrollContainer.js","sap/m/ToggleButton.js","sap/m/ToolbarSpacer.js","sap/m/VBox.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js","sap/ui/layout/DynamicSideContent.js","sap/ushell/applications/PageComposer/view/Page.fragment.xml","sap/ushell/applications/PageComposer/view/TileSelector.fragment.xml"],
"sap/ushell/applications/PageComposer/view/PageDetail.view.xml":["sap/f/DynamicPage.js","sap/f/DynamicPageTitle.js","sap/m/Button.js","sap/m/HBox.js","sap/m/IconTabBar.js","sap/m/IconTabFilter.js","sap/m/Label.js","sap/m/ObjectStatus.js","sap/m/OverflowToolbar.js","sap/m/Title.js","sap/m/ToolbarSpacer.js","sap/ui/core/CustomData.js","sap/ui/core/ExtensionPoint.js","sap/ui/core/Fragment.js","sap/ui/core/mvc/XMLView.js","sap/ushell/applications/PageComposer/controller/PageDetail.controller.js","sap/ushell/applications/PageComposer/view/PageContent.fragment.xml","sap/ushell/applications/PageComposer/view/PageInfo.fragment.xml","sap/ushell/applications/PageComposer/view/SpaceAssignment.fragment.xml"],
"sap/ushell/applications/PageComposer/view/PageInfo.fragment.xml":["sap/m/Input.js","sap/m/Label.js","sap/m/Text.js","sap/ui/core/Fragment.js","sap/ui/layout/form/SimpleForm.js"],
"sap/ushell/applications/PageComposer/view/PageOverview.view.xml":["sap/m/IconTabBar.js","sap/m/IconTabFilter.js","sap/m/Page.js","sap/ui/core/Fragment.js","sap/ui/core/mvc/XMLView.js","sap/ushell/applications/PageComposer/controller/PageOverview.controller.js","sap/ushell/applications/PageComposer/view/TableCustomerCreated.fragment.xml","sap/ushell/applications/PageComposer/view/TableSapDelivered.fragment.xml"],
"sap/ushell/applications/PageComposer/view/PagePreviewDialog.fragment.xml":["sap/base/strings/formatMessage.js","sap/m/Bar.js","sap/m/Button.js","sap/m/Dialog.js","sap/m/Title.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js","sap/ushell/applications/PageComposer/controller/Page.js","sap/ushell/ui/launchpad/Page.js","sap/ushell/ui/launchpad/Section.js"],
"sap/ushell/applications/PageComposer/view/SpaceAssignment.fragment.xml":["sap/base/strings/formatMessage.js","sap/m/Button.js","sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/Label.js","sap/m/ObjectIdentifier.js","sap/m/OverflowToolbar.js","sap/m/OverflowToolbarButton.js","sap/m/SearchField.js","sap/m/Table.js","sap/m/Text.js","sap/m/ToolbarSpacer.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/TableCustomerCreated.fragment.xml":["sap/base/strings/formatMessage.js","sap/m/Button.js","sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/FlexItemData.js","sap/m/Label.js","sap/m/ObjectIdentifier.js","sap/m/ObjectStatus.js","sap/m/OverflowToolbar.js","sap/m/OverflowToolbarButton.js","sap/m/SearchField.js","sap/m/Table.js","sap/m/Text.js","sap/m/Title.js","sap/m/ToolbarSpacer.js","sap/m/VBox.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/TableSapDelivered.fragment.xml":["sap/base/strings/formatMessage.js","sap/m/Button.js","sap/m/Column.js","sap/m/Label.js","sap/m/OverflowToolbar.js","sap/m/OverflowToolbarButton.js","sap/m/SearchField.js","sap/m/Table.js","sap/m/Text.js","sap/m/Title.js","sap/m/ToolbarSpacer.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/TileInfoPopover.fragment.xml":["sap/base/strings/formatMessage.js","sap/m/GenericTileScope.js","sap/m/HBox.js","sap/m/Label.js","sap/m/MessageStrip.js","sap/m/ResponsivePopover.js","sap/m/Select.js","sap/m/Text.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/core/Item.js","sap/ui/layout/form/SimpleForm.js","sap/ushell/library.js"],
"sap/ushell/applications/PageComposer/view/TileSelector.fragment.xml":["sap/m/Button.js","sap/m/CustomListItem.js","sap/m/FlexItemData.js","sap/m/HBox.js","sap/m/IconTabBar.js","sap/m/IconTabFilter.js","sap/m/List.js","sap/m/Menu.js","sap/m/MenuButton.js","sap/m/MenuItem.js","sap/m/OverflowToolbar.js","sap/m/OverflowToolbarButton.js","sap/m/ScrollContainer.js","sap/m/SearchField.js","sap/m/Text.js","sap/m/Title.js","sap/m/ToolbarSpacer.js","sap/m/VBox.js","sap/m/library.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js","sap/ui/core/dnd/DragInfo.js","sap/ushell/library.js","sap/ushell/ui/CustomGroupHeaderListItem.js"],
"sap/ushell/applications/PageComposer/view/ViewSettingsCustomerCreatedDialog.fragment.xml":["sap/m/DateRangeSelection.js","sap/m/ViewSettingsCustomItem.js","sap/m/ViewSettingsDialog.js","sap/m/ViewSettingsFilterItem.js","sap/m/ViewSettingsItem.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/ViewSettingsSapDeliveredDialog.fragment.xml":["sap/m/ViewSettingsDialog.js","sap/m/ViewSettingsItem.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/ViewSettingsSpaceAssignmentDialog.fragment.xml":["sap/m/ViewSettingsDialog.js","sap/m/ViewSettingsItem.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/ViewSettingsTileSelector.fragment.xml":["sap/m/GroupHeaderListItem.js","sap/m/List.js","sap/m/StandardListItem.js","sap/m/ViewSettingsCustomTab.js","sap/m/ViewSettingsDialog.js","sap/ui/core/Fragment.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map