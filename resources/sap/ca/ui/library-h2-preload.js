//@ui5-bundle sap/ca/ui/library-h2-preload.js
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
sap.ui.predefine('sap/ca/ui/library',["sap/ui/core/library","sap/m/library","sap/ui/core/Core"],function(){sap.ui.getCore().initLibrary({name:"sap.ca.ui",dependencies:["sap.ui.core","sap.m"],types:["sap.ca.ui.charts.ChartColor","sap.ca.ui.charts.ChartSelectionMode","sap.ca.ui.charts.ChartSemanticColor"],interfaces:[],controls:["sap.ca.ui.AddPicture","sap.ca.ui.CustomerContext","sap.ca.ui.CustomerControlListItem","sap.ca.ui.DatePicker","sap.ca.ui.ExpansibleFeedListItem","sap.ca.ui.FileUpload","sap.ca.ui.GrowingTileContainer","sap.ca.ui.HierarchicalSelectDialog","sap.ca.ui.Hierarchy","sap.ca.ui.HierarchyItem","sap.ca.ui.InPlaceEdit","sap.ca.ui.Notes","sap.ca.ui.OverflowContainer","sap.ca.ui.OverviewTile","sap.ca.ui.PictureItem","sap.ca.ui.PictureTile","sap.ca.ui.PictureTileContainer","sap.ca.ui.PictureViewer","sap.ca.ui.PictureViewerItem","sap.ca.ui.ZoomableScrollContainer","sap.ca.ui.charts.BarListItem","sap.ca.ui.charts.BubbleChart","sap.ca.ui.charts.Chart","sap.ca.ui.charts.ChartToolBar","sap.ca.ui.charts.ClusterListItem","sap.ca.ui.charts.CombinedChart","sap.ca.ui.charts.HorizontalBarChart","sap.ca.ui.charts.LineChart","sap.ca.ui.charts.StackedHorizontalBarChart","sap.ca.ui.charts.StackedVerticalColumnChart","sap.ca.ui.charts.VerticalBarChart"],elements:["sap.ca.ui.HierarchicalSelectDialogItem"],version:"1.66.0-SNAPSHOT"});var t=sap.ca.ui;t.charts=t.charts||{};t.charts.ChartColor={sapUiChart1:"sapUiChart1",sapUiChart2:"sapUiChart2",sapUiChart3:"sapUiChart3",sapUiChart4:"sapUiChart4",sapUiChart5:"sapUiChart5",sapUiChart6:"sapUiChart6",sapUiChart7:"sapUiChart7",sapUiChart8:"sapUiChart8",sapUiChart9:"sapUiChart9",sapUiChart10:"sapUiChart10",sapUiChart11:"sapUiChart11"};sap.ca.ui.charts.ChartSelectionMode={None:"None",Single:"Single",Multiple:"Multiple"};sap.ca.ui.charts.ChartSemanticColor={NeutralDark:"NeutralDark",Neutral:"Neutral",NeutralLight:"NeutralLight",GoodDark:"GoodDark",Good:"Good",GoodLight:"GoodLight",CriticalDark:"CriticalDark",Critical:"Critical",CriticalLight:"CriticalLight",BadDark:"BadDark",Bad:"Bad",BadLight:"BadLight"};return t;});
sap.ui.require.preload({
	"sap/ca/ui/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.ca.ui","type":"library","embeds":[],"applicationVersion":{"version":"1.86.0"},"title":"SAP UI library: Fiori Commons","description":"SAP UI library: Fiori Commons","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_belize","sap_belize_hcb","sap_belize_hcw","sap_belize_plus","sap_bluecrystal","sap_fiori_3","sap_fiori_3_dark","sap_fiori_3_hcb","sap_fiori_3_hcw","sap_hcb","sap_mvi"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.86","libs":{"sap.ui.core":{"minVersion":"1.86.1"},"sap.m":{"minVersion":"1.86.1"}}},"library":{"i18n":false,"content":{"controls":["sap.ca.ui.AddPicture","sap.ca.ui.CustomerContext","sap.ca.ui.CustomerControlListItem","sap.ca.ui.DatePicker","sap.ca.ui.ExpansibleFeedListItem","sap.ca.ui.FileUpload","sap.ca.ui.GrowingTileContainer","sap.ca.ui.HierarchicalSelectDialog","sap.ca.ui.Hierarchy","sap.ca.ui.HierarchyItem","sap.ca.ui.InPlaceEdit","sap.ca.ui.Notes","sap.ca.ui.OverflowContainer","sap.ca.ui.OverviewTile","sap.ca.ui.PictureItem","sap.ca.ui.PictureTile","sap.ca.ui.PictureTileContainer","sap.ca.ui.PictureViewer","sap.ca.ui.PictureViewerItem","sap.ca.ui.ZoomableScrollContainer","sap.ca.ui.charts.BarListItem","sap.ca.ui.charts.BubbleChart","sap.ca.ui.charts.Chart","sap.ca.ui.charts.ChartToolBar","sap.ca.ui.charts.ClusterListItem","sap.ca.ui.charts.CombinedChart","sap.ca.ui.charts.HorizontalBarChart","sap.ca.ui.charts.LineChart","sap.ca.ui.charts.StackedHorizontalBarChart","sap.ca.ui.charts.StackedVerticalColumnChart","sap.ca.ui.charts.VerticalBarChart"],"elements":["sap.ca.ui.HierarchicalSelectDialogItem"],"types":["sap.ca.ui.charts.ChartColor","sap.ca.ui.charts.ChartSelectionMode","sap.ca.ui.charts.ChartSemanticColor"],"interfaces":[]}}}}'
},"sap/ca/ui/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ca/ui/AddPicture.js":["sap/ca/ui/PictureItem.js","sap/ca/ui/library.js","sap/ca/ui/utils/CanvasHelper.js","sap/ca/ui/utils/resourcebundle.js","sap/ui/core/Control.js"],
"sap/ca/ui/AddPictureRenderer.js":["sap/ca/ui/JS/jquery-fileupload.js","sap/ca/ui/JS/jquery-iframe-transport.js","sap/ca/ui/JS/jquery-ui-widget.js"],
"sap/ca/ui/CustomerContext.js":["sap/ca/ui/CustomerControlListItem.js","sap/ca/ui/library.js","sap/ca/ui/utils/resourcebundle.js","sap/m/Dialog.js","sap/m/List.js","sap/ui/core/Control.js"],
"sap/ca/ui/CustomerControlListItem.js":["sap/ca/ui/library.js","sap/ca/ui/model/format/FormattingLibrary.js","sap/ca/ui/utils/resourcebundle.js","sap/m/CustomListItem.js","sap/m/Label.js","sap/m/ObjectIdentifier.js","sap/m/Text.js"],
"sap/ca/ui/CustomerControlListItemRenderer.js":["sap/m/CustomListItemRenderer.js","sap/ui/core/Renderer.js"],
"sap/ca/ui/DatePicker.js":["sap/ca/ui/library.js","sap/ca/ui/model/type/Date.js","sap/ca/ui/utils/resourcebundle.js","sap/m/InputBase.js","sap/me/Calendar.js"],
"sap/ca/ui/DatePickerRenderer.js":["sap/m/InputBaseRenderer.js","sap/ui/core/Renderer.js"],
"sap/ca/ui/ExpansibleFeedListItem.js":["sap/ca/ui/library.js","sap/ca/ui/utils/resourcebundle.js","sap/m/FeedListItem.js"],
"sap/ca/ui/ExpansibleFeedListItemRenderer.js":["sap/m/FeedListItemRenderer.js","sap/ui/core/Renderer.js"],
"sap/ca/ui/FileUpload.js":["sap/ca/ui/dialog/factory.js","sap/ca/ui/library.js","sap/ca/ui/model/format/FileSizeFormat.js","sap/ca/ui/model/type/Date.js","sap/ca/ui/utils/resourcebundle.js","sap/ui/core/Control.js"],
"sap/ca/ui/FileUploadRenderer.js":["sap/ca/ui/JS/jquery-fileupload.js","sap/ca/ui/JS/jquery-iframe-transport.js","sap/ca/ui/JS/jquery-ui-widget.js","sap/m/ListRenderer.js"],
"sap/ca/ui/GrowingTileContainer.js":["sap/ca/ui/library.js","sap/m/ScrollContainer.js","sap/ui/layout/Grid.js"],
"sap/ca/ui/GrowingTileContainerRenderer.js":["sap/m/ScrollContainerRenderer.js","sap/ui/core/Renderer.js","sap/ui/layout/GridRenderer.js"],
"sap/ca/ui/HierarchicalSelectDialog.js":["sap/ca/ui/library.js","sap/ca/ui/utils/resourcebundle.js","sap/m/Dialog.js","sap/m/NavContainer.js"],
"sap/ca/ui/HierarchicalSelectDialogItem.js":["sap/ca/ui/library.js","sap/ui/core/Item.js"],
"sap/ca/ui/HierarchicalSelectDialogRenderer.js":["sap/m/DialogRenderer.js"],
"sap/ca/ui/Hierarchy.js":["sap/ca/ui/library.js","sap/ui/core/Control.js"],
"sap/ca/ui/HierarchyItem.js":["sap/ca/ui/library.js","sap/ui/core/Control.js","sap/ui/core/theming/Parameters.js","sap/ui/layout/VerticalLayout.js"],
"sap/ca/ui/HierarchyItemRenderer.js":["sap/m/Label.js","sap/m/Link.js","sap/ui/layout/HorizontalLayout.js"],
"sap/ca/ui/InPlaceEdit.js":["sap/ca/ui/library.js","sap/m/Input.js","sap/m/Link.js","sap/m/Select.js","sap/ui/core/Control.js"],
"sap/ca/ui/NavigationHandler.js":["jquery.sap.history.js","sap/m/InstanceManager.js"],
"sap/ca/ui/Notes.js":["sap/ca/ui/library.js","sap/m/List.js","sap/m/MessageToast.js"],
"sap/ca/ui/NotesRenderer.js":["sap/m/ListRenderer.js"],
"sap/ca/ui/OverflowContainer.js":["sap/ca/ui/library.js","sap/ui/core/Control.js"],
"sap/ca/ui/Overlay.js":["sap/ui/core/Popup.js"],
"sap/ca/ui/OverviewTile.js":["sap/ca/ui/library.js","sap/ca/ui/utils/resourcebundle.js","sap/m/Tile.js","sap/ui/core/IconPool.js"],
"sap/ca/ui/OverviewTileRenderer.js":["sap/m/TileRenderer.js"],
"sap/ca/ui/PictureItem.js":["sap/ca/ui/library.js","sap/ui/core/Control.js"],
"sap/ca/ui/PictureTile.js":["sap/ca/ui/library.js","sap/m/CustomTile.js"],
"sap/ca/ui/PictureTileRenderer.js":["sap/m/CustomTileRenderer.js"],
"sap/ca/ui/PictureViewer.js":["sap/ca/ui/library.js","sap/m/TileContainer.js","sap/ui/core/ResizeHandler.js"],
"sap/ca/ui/PictureViewerItem.js":["sap/ca/ui/library.js","sap/ui/core/Control.js"],
"sap/ca/ui/PictureViewerRenderer.js":["sap/m/TileContainerRenderer.js"],
"sap/ca/ui/ZoomableScrollContainer.js":["sap/ca/ui/library.js","sap/m/ScrollContainer.js"],
"sap/ca/ui/ZoomableScrollContainerRenderer.js":["sap/m/ScrollContainerRenderer.js","sap/ui/core/Renderer.js"],
"sap/ca/ui/charts/BarListItem.js":["sap/ca/ui/library.js","sap/m/ListItemBase.js"],
"sap/ca/ui/charts/BarListItemRenderer.js":["sap/m/ListItemBaseRenderer.js","sap/ui/core/Renderer.js"],
"sap/ca/ui/charts/BubbleChart.js":["sap/ca/ui/charts/Chart.js","sap/ca/ui/library.js"],
"sap/ca/ui/charts/BubbleChartRenderer.js":["sap/ca/ui/charts/ChartRenderer.js"],
"sap/ca/ui/charts/Chart.js":["sap/ca/ui/charts/ChartColor.js","sap/ca/ui/charts/ChartFormatter.js","sap/ca/ui/charts/ChartSelectionMode.js","sap/ca/ui/charts/ChartSemanticColor.js","sap/ca/ui/charts/ChartType.js","sap/ca/ui/charts/ClusterList.js","sap/ca/ui/library.js","sap/m/Bar.js","sap/m/Button.js","sap/m/Label.js","sap/m/Page.js","sap/m/PlacementType.js","sap/m/PopoverRenderer.js","sap/m/ResponsivePopover.js","sap/m/ScrollContainer.js","sap/ui/core/Control.js","sap/ui/core/theming/Parameters.js"],
"sap/ca/ui/charts/ChartFormatter.js":["sap/ca/ui/model/format/NumberFormat.js","sap/ca/ui/model/type/Date.js"],
"sap/ca/ui/charts/ChartPopover.js":["sap/ca/ui/utils/resourcebundle.js","sap/m/Label.js","sap/m/List.js","sap/m/ResponsivePopover.js","sap/m/StandardListItem.js","sap/ui/model/json/JSONModel.js"],
"sap/ca/ui/charts/ChartToolBar.js":["sap/ca/ui/Overlay.js","sap/ca/ui/library.js","sap/ca/ui/utils/resourcebundle.js","sap/m/Bar.js","sap/m/Button.js","sap/m/Dialog.js","sap/m/Popover.js","sap/m/Select.js","sap/ui/core/Control.js"],
"sap/ca/ui/charts/ChartType.js":["sap/ca/ui/utils/resourcebundle.js"],
"sap/ca/ui/charts/ClusterList.js":["sap/ca/ui/charts/ClusterListItem.js","sap/ca/ui/utils/resourcebundle.js","sap/m/List.js","sap/ui/core/Element.js","sap/ui/model/json/JSONModel.js"],
"sap/ca/ui/charts/ClusterListItem.js":["sap/ca/ui/library.js","sap/m/ListItemBase.js"],
"sap/ca/ui/charts/ClusterListItemRenderer.js":["sap/m/ListItemBaseRenderer.js","sap/ui/core/Renderer.js"],
"sap/ca/ui/charts/CombinedChart.js":["sap/ca/ui/charts/Chart.js","sap/ca/ui/library.js"],
"sap/ca/ui/charts/CombinedChartRenderer.js":["sap/ca/ui/charts/ChartRenderer.js"],
"sap/ca/ui/charts/HorizontalBarChart.js":["sap/ca/ui/charts/Chart.js","sap/ca/ui/library.js"],
"sap/ca/ui/charts/HorizontalBarChartRenderer.js":["sap/ca/ui/charts/ChartRenderer.js"],
"sap/ca/ui/charts/LineChart.js":["sap/ca/ui/charts/Chart.js","sap/ca/ui/library.js"],
"sap/ca/ui/charts/LineChartRenderer.js":["sap/ca/ui/charts/ChartRenderer.js"],
"sap/ca/ui/charts/StackedHorizontalBarChart.js":["sap/ca/ui/charts/Chart.js","sap/ca/ui/charts/ChartType.js","sap/ca/ui/library.js"],
"sap/ca/ui/charts/StackedHorizontalBarChartRenderer.js":["sap/ca/ui/charts/ChartRenderer.js"],
"sap/ca/ui/charts/StackedVerticalColumnChart.js":["sap/ca/ui/charts/Chart.js","sap/ca/ui/charts/ChartType.js","sap/ca/ui/library.js"],
"sap/ca/ui/charts/StackedVerticalColumnChartRenderer.js":["sap/ca/ui/charts/ChartRenderer.js"],
"sap/ca/ui/charts/VerticalBarChart.js":["sap/ca/ui/charts/Chart.js","sap/ca/ui/library.js"],
"sap/ca/ui/charts/VerticalBarChartRenderer.js":["sap/ca/ui/charts/ChartRenderer.js"],
"sap/ca/ui/dialog/Confirm.controller.js":["sap/ca/ui/utils/resourcebundle.js"],
"sap/ca/ui/dialog/Confirm.view.xml":["sap/ca/ui/dialog/Confirm.controller.js","sap/m/Button.js","sap/m/Dialog.js","sap/m/Label.js","sap/m/Text.js","sap/m/TextArea.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/Grid.js","sap/ui/layout/GridData.js","sap/ui/layout/VerticalLayout.js"],
"sap/ca/ui/dialog/Forward.controller.js":["sap/ca/ui/utils/resourcebundle.js"],
"sap/ca/ui/dialog/Forward.view.xml":["sap/ca/ui/dialog/Forward.controller.js","sap/m/Bar.js","sap/m/Button.js","sap/m/Dialog.js","sap/m/List.js","sap/m/SearchField.js","sap/m/StandardListItem.js","sap/ui/core/mvc/XMLView.js"],
"sap/ca/ui/dialog/SelectItem.controller.js":["sap/ca/ui/utils/resourcebundle.js"],
"sap/ca/ui/dialog/SelectItem.view.xml":["sap/ca/ui/dialog/SelectItem.controller.js","sap/m/Button.js","sap/m/Dialog.js","sap/m/List.js","sap/m/StandardListItem.js","sap/ui/core/mvc/XMLView.js"],
"sap/ca/ui/dialog/factory.js":["sap/ca/ui/dialog/Dialog.js"],
"sap/ca/ui/library.js":["sap/m/library.js","sap/ui/core/Core.js","sap/ui/core/library.js"],
"sap/ca/ui/message/MessageBox.view.xml":["sap/ca/ui/message/MessageBox.controller.js","sap/m/Button.js","sap/m/Dialog.js","sap/m/HBox.js","sap/m/Link.js","sap/m/Text.js","sap/m/TextArea.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/VerticalLayout.js"],
"sap/ca/ui/message/message.js":["sap/ca/ui/dialog/factory.js","sap/ca/ui/utils/resourcebundle.js","sap/m/MessageToast.js","sap/ui/core/library.js"],
"sap/ca/ui/model/format/AmountFormat.js":["sap/ca/ui/model/format/FormatHelper.js","sap/ca/ui/model/format/NumberFormat.js","sap/ca/ui/utils/resourcebundle.js","sap/ui/core/LocaleData.js"],
"sap/ca/ui/model/format/DateFormat.js":["sap/ca/ui/utils/resourcebundle.js","sap/ui/core/format/DateFormat.js"],
"sap/ca/ui/model/format/FileSizeFormat.js":["sap/ca/ui/model/format/FormatHelper.js","sap/ca/ui/model/format/NumberFormat.js","sap/ca/ui/utils/resourcebundle.js","sap/ui/core/LocaleData.js"],
"sap/ca/ui/model/format/FormatHelper.js":["sap/ui/core/LocaleData.js","sap/ui/core/format/NumberFormat.js"],
"sap/ca/ui/model/format/FormattingLibrary.js":["sap/ca/ui/utils/resourcebundle.js"],
"sap/ca/ui/model/format/NumberFormat.js":["sap/ca/ui/model/format/FormatHelper.js","sap/ca/ui/utils/resourcebundle.js","sap/ui/core/LocaleData.js"],
"sap/ca/ui/model/format/QuantityFormat.js":["sap/ca/ui/model/format/FormatHelper.js","sap/ca/ui/model/format/NumberFormat.js","sap/ui/core/LocaleData.js","sap/ui/core/format/NumberFormat.js"],
"sap/ca/ui/model/type/Date.js":["sap/ca/ui/model/format/DateFormat.js","sap/ui/model/SimpleType.js"],
"sap/ca/ui/model/type/DateTime.js":["sap/ca/ui/model/type/Date.js"],
"sap/ca/ui/model/type/FileSize.js":["sap/ca/ui/model/format/FileSizeFormat.js","sap/ui/model/SimpleType.js"],
"sap/ca/ui/model/type/Number.js":["sap/ca/ui/model/format/NumberFormat.js","sap/ui/model/SimpleType.js"],
"sap/ca/ui/model/type/Time.js":["sap/ca/ui/model/type/Date.js"],
"sap/ca/ui/quickoverview/Company.view.xml":["sap/ca/ui/quickoverview/Company.controller.js","sap/m/Label.js","sap/m/Link.js","sap/m/Text.js","sap/ui/core/Icon.js","sap/ui/core/Title.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/form/SimpleForm.js"],
"sap/ca/ui/quickoverview/CompanyLaunch.js":["sap/ca/ui/quickoverview/Quickoverview.js","sap/ui/base/Object.js"],
"sap/ca/ui/quickoverview/Employee.controller.js":["sap/ca/ui/quickoverview/CompanyLaunch.js"],
"sap/ca/ui/quickoverview/Employee.view.xml":["sap/ca/ui/quickoverview/Employee.controller.js","sap/m/Label.js","sap/m/Link.js","sap/m/Text.js","sap/ui/core/Icon.js","sap/ui/core/Title.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/form/SimpleForm.js"],
"sap/ca/ui/quickoverview/EmployeeLaunch.js":["sap/ca/ui/quickoverview/Quickoverview.js","sap/ui/base/Object.js"],
"sap/ca/ui/quickoverview/Quickoverview.js":["sap/ca/ui/utils/resourcebundle.js","sap/ui/base/Object.js"],
"sap/ca/ui/quickoverview/Quickview.view.xml":["sap/ca/ui/quickoverview/Quickview.controller.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js"],
"sap/ca/ui/utils/CanvasHelper.js":["sap/ca/ui/utils/BinaryUtil.js","sap/ca/ui/utils/exif.js"],
"sap/ca/ui/utils/Lessifier.js":["sap/ui/core/theming/Parameters.js"],
"sap/ca/ui/utils/TablePersonalizer.js":["sap/m/TablePersoController.js","sap/ushell/services/Personalization.js"],
"sap/ca/ui/utils/busydialog.js":["sap/ca/ui/images/images.js"],
"sap/ca/ui/utils/resourcebundle.js":["sap/ui/model/resource/ResourceModel.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map