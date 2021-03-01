//@ui5-bundle sap/ushell/components/shell/Settings/Component-h2-preload.js
// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.predefine('sap/ushell/components/shell/Settings/Component',["sap/ui/core/mvc/XMLView","sap/ui/core/UIComponent","sap/ui/model/json/JSONModel","sap/ushell/Config","sap/ushell/EventHub","sap/ushell/resources","sap/ushell/components/shell/Settings/ProfilingLoader","sap/ushell/components/shell/Settings/userAccount/UserAccountEntry","sap/ushell/components/shell/Settings/appearance/AppearanceEntry","sap/ushell/components/shell/Settings/homepage/HomepageEntry","sap/ushell/components/shell/Settings/spaces/SpacesEntry","sap/ushell/components/shell/Settings/userActivities/UserActivitiesEntry","sap/ushell/components/shell/Settings/userProfiling/UserProfilingEntry","sap/ushell/components/shell/Settings/notifications/NotificationsEntry","sap/ushell/components/shell/Settings/userDefaults/UserDefaultsEntry","sap/ushell/components/shell/Settings/userLanguageRegion/UserLanguageRegionEntry"],function(X,U,J,C,E,r,l,a,A,H,S,b,c,N,d,e){"use strict";var D=[];return U.extend("sap.ushell.components.shell.Settings.Component",{metadata:{version:"1.86.3",library:"sap.ushell",dependencies:{libs:["sap.m","sap.ui.layout"]}},init:function(){U.prototype.init.apply(this,arguments);this._addStandardEntityToConfig();l();this._addNotificationSettings().then(function(o){if(o.notificationsAvailable&&this.oSettingsView){this.oSettingsView.setModel(C.createModel("/core/userPreferences",J));}}.bind(this));D.push(E.on("openUserSettings").do(this._openUserSettings.bind(this)));},_addStandardEntityToConfig:function(){var f=C.last("/core/userPreferences/entries");f.push(a.getEntry());f.push(A.getEntry());if(C.last("/core/spaces/configurable")){f.push(S.getEntry());}f.push(e.getEntry());if(C.last("/core/shell/enableRecentActivity")){f.push(b.getEntry());}f.push(c.getEntry());if(C.last("/core/home/enableHomePageSettings")&&!C.last("/core/spaces/enabled")){f.push(H.getEntry());}if(C.last("/core/shell/model/userDefaultParameters")){f.push(d.getEntry());}f=sap.ushell.Container.getRenderer("fiori2").reorderUserPrefEntries(f);C.emit("/core/userPreferences/entries",f);},_addNotificationSettings:function(){var R={notificationsAvailable:false};if(C.last("/core/shell/model/enableNotifications")){sap.ushell.Container.getServiceAsync("Notifications").then(function(s){s._userSettingInitialization();s._getNotificationSettingsAvalability().done(function(f){if(f.settingsAvailable){var g=C.last("/core/userPreferences/entries");g.push(N.getEntry());C.emit("/core/userPreferences/entries",g);R.notificationsAvailable=true;return Promise.resolve(R);}return Promise.resolve(R);});});}return Promise.resolve(R);},_openUserSettings:function(o){if(!this.oDialog){X.create({id:"settingsView",viewName:"sap.ushell.components.shell.Settings.UserSettings"}).then(function(s){this.oSettingsView=s;var m=C.createModel("/core/userPreferences",J);s.setModel(m);s.setModel(r.i18nModel,"i18n");this.oDialog=s.byId("userSettingsDialog");var f=o.controlId||"shell-header";sap.ui.getCore().byId(f).addDependent(s);this.oDialog.open();}.bind(this));}else{this.oDialog.open();}},exit:function(){for(var i=0;i<D.length;i++){D[i].off();}if(this.oSettingsView){this.oSettingsView.destroy();this.oSettingsView=null;this.oDialog=null;}}});});
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/components/shell/Settings/Component.js":["sap/ui/core/UIComponent.js","sap/ui/core/mvc/XMLView.js","sap/ui/model/json/JSONModel.js","sap/ushell/Config.js","sap/ushell/EventHub.js","sap/ushell/components/shell/Settings/ProfilingLoader.js","sap/ushell/components/shell/Settings/appearance/AppearanceEntry.js","sap/ushell/components/shell/Settings/homepage/HomepageEntry.js","sap/ushell/components/shell/Settings/notifications/NotificationsEntry.js","sap/ushell/components/shell/Settings/spaces/SpacesEntry.js","sap/ushell/components/shell/Settings/userAccount/UserAccountEntry.js","sap/ushell/components/shell/Settings/userActivities/UserActivitiesEntry.js","sap/ushell/components/shell/Settings/userDefaults/UserDefaultsEntry.js","sap/ushell/components/shell/Settings/userLanguageRegion/UserLanguageRegionEntry.js","sap/ushell/components/shell/Settings/userProfiling/UserProfilingEntry.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/ContentWrapper.fragment.xml":["sap/m/ObjectHeader.js","sap/m/Page.js","sap/ui/core/Fragment.js"],
"sap/ushell/components/shell/Settings/ErrorContent.fragment.xml":["sap/m/FlexBox.js","sap/m/Text.js","sap/ui/core/Fragment.js"],
"sap/ushell/components/shell/Settings/ProfilingLoader.js":["sap/ushell/Config.js"],
"sap/ushell/components/shell/Settings/UserSettings.controller.js":["sap/base/Log.js","sap/base/util/UriParameters.js","sap/ui/Device.js","sap/ui/core/Fragment.js","sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ushell/EventHub.js","sap/ushell/resources.js","sap/ushell/utils.js","sap/ushell/utils/WindowUtils.js"],
"sap/ushell/components/shell/Settings/UserSettings.view.xml":["sap/m/Bar.js","sap/m/Button.js","sap/m/Dialog.js","sap/m/List.js","sap/m/Page.js","sap/m/SplitApp.js","sap/m/StandardListItem.js","sap/m/Title.js","sap/m/ToggleButton.js","sap/ui/core/CustomData.js","sap/ui/core/mvc/XMLView.js","sap/ushell/components/shell/Settings/UserSettings.controller.js"],
"sap/ushell/components/shell/Settings/appearance/Appearance.controller.js":["sap/base/Log.js","sap/ui/Device.js","sap/ui/core/Component.js","sap/ui/core/mvc/Controller.js","sap/ui/core/theming/Parameters.js","sap/ui/model/json/JSONModel.js","sap/ui/thirdparty/jquery.js","sap/ushell/Config.js","sap/ushell/EventHub.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/appearance/Appearance.view.xml":["sap/m/CheckBox.js","sap/m/CustomListItem.js","sap/m/FlexItemData.js","sap/m/HBox.js","sap/m/IconTabBar.js","sap/m/IconTabFilter.js","sap/m/Label.js","sap/m/List.js","sap/m/MessageStrip.js","sap/m/RadioButton.js","sap/m/RadioButtonGroup.js","sap/m/Switch.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/CustomData.js","sap/ui/core/Icon.js","sap/ui/core/mvc/XMLView.js","sap/ushell/components/shell/Settings/appearance/Appearance.controller.js"],
"sap/ushell/components/shell/Settings/appearance/AppearanceEntry.js":["sap/base/Log.js","sap/ui/core/mvc/XMLView.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/homepage/HomepageEntry.js":["sap/base/Log.js","sap/ui/core/mvc/XMLView.js","sap/ui/model/json/JSONModel.js","sap/ushell/Config.js","sap/ushell/components/SharedComponentUtils.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/homepage/HomepageSetting.view.xml":["sap/m/Label.js","sap/m/RadioButton.js","sap/m/RadioButtonGroup.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/form/SimpleForm.js"],
"sap/ushell/components/shell/Settings/notifications/NotificationsEntry.js":["sap/base/Log.js","sap/ui/core/mvc/XMLView.js","sap/ushell/Config.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/notifications/NotificationsSetting.controller.js":["sap/base/Log.js","sap/base/util/deepClone.js","sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ushell/Config.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/notifications/NotificationsSetting.view.xml":["sap/m/CheckBox.js","sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/ObjectIdentifier.js","sap/m/Switch.js","sap/m/Table.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ushell/components/shell/Settings/notifications/NotificationsSetting.controller.js"],
"sap/ushell/components/shell/Settings/spaces/SpacesEntry.js":["sap/base/Log.js","sap/ui/core/mvc/XMLView.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/spaces/SpacesSetting.controller.js":["sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ushell/Config.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/spaces/SpacesSetting.view.xml":["sap/m/CheckBox.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ushell/components/shell/Settings/spaces/SpacesSetting.controller.js"],
"sap/ushell/components/shell/Settings/userAccount/UserAccountEntry.js":["sap/base/Log.js","sap/ui/core/mvc/XMLView.js","sap/ushell/Config.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/userAccount/UserAccountImgConsentSelector.fragment.xml":["sap/m/CheckBox.js","sap/m/Panel.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"sap/ushell/components/shell/Settings/userAccount/UserAccountSelector.controller.js":["sap/base/Log.js","sap/m/MessageBox.js","sap/m/MessageToast.js","sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ushell/Config.js","sap/ushell/resources.js","sap/ushell/utils.js","sap/ushell/utils/WindowUtils.js"],
"sap/ushell/components/shell/Settings/userAccount/UserAccountSelector.view.xml":["sap/m/IconTabBar.js","sap/m/IconTabFilter.js","sap/m/ObjectHeader.js","sap/ui/core/Fragment.js","sap/ui/core/mvc/XMLView.js","sap/ushell/components/shell/Settings/userAccount/UserAccountImgConsentSelector.fragment.xml","sap/ushell/components/shell/Settings/userAccount/UserAccountSelector.controller.js","sap/ushell/components/shell/Settings/userAccount/UserAccountSetting.fragment.xml"],
"sap/ushell/components/shell/Settings/userAccount/UserAccountSetting.fragment.xml":["sap/m/Button.js","sap/m/Label.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js","sap/ui/layout/form/SimpleForm.js"],
"sap/ushell/components/shell/Settings/userAccount/UserAccountSetting.view.xml":["sap/m/ObjectHeader.js","sap/ui/core/Fragment.js","sap/ui/core/mvc/XMLView.js","sap/ushell/components/shell/Settings/userAccount/UserAccountSelector.controller.js","sap/ushell/components/shell/Settings/userAccount/UserAccountSetting.fragment.xml"],
"sap/ushell/components/shell/Settings/userActivities/UserActivitiesEntry.js":["sap/base/Log.js","sap/ui/core/mvc/XMLView.js","sap/ushell/Config.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/userActivities/UserActivitiesSetting.controller.js":["sap/base/Log.js","sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ushell/Config.js","sap/ushell/components/SharedComponentUtils.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/userActivities/UserActivitiesSetting.view.xml":["sap/m/Button.js","sap/m/CheckBox.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/form/SimpleForm.js","sap/ushell/components/shell/Settings/userActivities/UserActivitiesSetting.controller.js"],
"sap/ushell/components/shell/Settings/userDefaults/Component.js":["sap/ui/core/UIComponent.js","sap/ui/core/mvc/XMLView.js"],
"sap/ushell/components/shell/Settings/userDefaults/UserDefaultsEntry.js":["sap/base/Log.js","sap/base/util/includes.js","sap/ui/core/ComponentContainer.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/userDefaults/UserDefaultsForm.js":["sap/base/util/deepExtend.js","sap/ui/comp/smartform/SmartForm.js","sap/ui/core/Control.js"],
"sap/ushell/components/shell/Settings/userDefaults/controller/ExtendedValueDialog.controller.js":["sap/m/Token.js","sap/ui/comp/library.js","sap/ui/core/Fragment.js","sap/ui/model/json/JSONModel.js"],
"sap/ushell/components/shell/Settings/userDefaults/controller/UserDefaultsSetting.controller.js":["sap/base/Log.js","sap/base/util/deepEqual.js","sap/base/util/deepExtend.js","sap/base/util/extend.js","sap/m/Button.js","sap/m/FlexBox.js","sap/m/FlexItemData.js","sap/m/Input.js","sap/m/MessageBox.js","sap/m/library.js","sap/ui/Device.js","sap/ui/comp/smartfield/SmartField.js","sap/ui/comp/smartfield/SmartLabel.js","sap/ui/comp/smartform/Group.js","sap/ui/comp/smartform/GroupElement.js","sap/ui/comp/smartvariants/PersonalizableInfo.js","sap/ui/core/mvc/Controller.js","sap/ui/layout/GridData.js","sap/ui/model/json/JSONModel.js","sap/ui/model/odata/ODataModel.js","sap/ushell/components/shell/Settings/userDefaults/controller/ExtendedValueDialog.controller.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/userDefaults/view/ExtendedValueDialog.fragment.xml":["sap/ui/comp/valuehelpdialog/ValueHelpDialog.js","sap/ui/core/Fragment.js"],
"sap/ushell/components/shell/Settings/userDefaults/view/UserDefaultsSetting.view.xml":["sap/m/HBox.js","sap/m/Label.js","sap/m/Select.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/comp/smartvariants/SmartVariantManagement.js","sap/ui/core/ListItem.js","sap/ui/core/mvc/XMLView.js","sap/ushell/components/shell/Settings/userDefaults/UserDefaultsForm.js","sap/ushell/components/shell/Settings/userDefaults/controller/UserDefaultsSetting.controller.js"],
"sap/ushell/components/shell/Settings/userLanguageRegion/LanguageRegionSelector.controller.js":["sap/base/Log.js","sap/base/util/UriParameters.js","sap/ui/core/Locale.js","sap/ui/core/LocaleData.js","sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ui/performance/Measurement.js"],
"sap/ushell/components/shell/Settings/userLanguageRegion/LanguageRegionSelector.view.xml":["sap/m/Label.js","sap/m/SegmentedButton.js","sap/m/SegmentedButtonItem.js","sap/m/Select.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Item.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/form/SimpleForm.js","sap/ushell/components/shell/Settings/userLanguageRegion/LanguageRegionSelector.controller.js"],
"sap/ushell/components/shell/Settings/userLanguageRegion/UserLanguageRegionEntry.js":["sap/base/Log.js","sap/ui/core/Locale.js","sap/ui/core/LocaleData.js","sap/ui/core/mvc/XMLView.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/userProfiling/UsageAnalyticsProfiling.js":["sap/base/Log.js","sap/ui/core/mvc/XMLView.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/userProfiling/UsageAnalyticsSelector.controller.js":["sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ushell/resources.js"],
"sap/ushell/components/shell/Settings/userProfiling/UsageAnalyticsSelector.view.xml":["sap/m/CheckBox.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ushell/components/shell/Settings/userProfiling/UsageAnalyticsSelector.controller.js"],
"sap/ushell/components/shell/Settings/userProfiling/UserProfiling.controller.js":["sap/base/Log.js","sap/m/Title.js","sap/ui/core/mvc/Controller.js","sap/ushell/Config.js"],
"sap/ushell/components/shell/Settings/userProfiling/UserProfiling.view.xml":["sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ushell/components/shell/Settings/userProfiling/UserProfiling.controller.js"],
"sap/ushell/components/shell/Settings/userProfiling/UserProfilingEntry.js":["sap/base/Log.js","sap/ui/core/mvc/XMLView.js","sap/ushell/Config.js","sap/ushell/resources.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map