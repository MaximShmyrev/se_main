//@ui5-bundle sap/fe/placeholder/library-preload.js
sap.ui.predefine('sap/fe/placeholder/controller/Placeholder.controller',["sap/ui/core/mvc/Controller"],function(C){"use strict";return C.extend("sap.fe.placeholder.controller.Placeholder",{isPlaceholder:function(){return true;},setPlaceholderOption:function(o){this.oOptions=o;},getOptions:function(k){return this.oOptions[k];},istargetNavigated:function(t){if(!this.aTargetNavigated){this.aTargetNavigated=[];}if(this.aTargetNavigated.indexOf(t.id)===-1){this.sCurrentTargetId=t.id;return false;}else{return true;}},currentTargetNavigated:function(){if(!this.aTargetNavigated){this.aTargetNavigated=[];}if(this.aTargetNavigated&&this.aTargetNavigated.indexOf(this.sCurrentTargetId)===-1){this.aTargetNavigated.push(this.sCurrentTargetId);}}});},true);
/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.predefine('sap/fe/placeholder/library',["sap/ui/core/Core","sap/ui/core/library"],function(){"use strict";sap.ui.getCore().initLibrary({name:"sap.fe.placeholder",dependencies:["sap.ui.core"],types:[],interfaces:[],controls:[],elements:[],version:"1.86.1",noLibraryCSS:false,extensions:{}});return sap.fe.placeholder;});
sap.ui.require.preload({
	"sap/fe/placeholder/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.fe.placeholder","type":"library","embeds":[],"applicationVersion":{"version":"1.86.1"},"title":"UI5 library: sap.fe.placeholder","description":"UI5 library: sap.fe.placeholder","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_belize","sap_belize_hcb","sap_belize_hcw","sap_belize_plus","sap_fiori_3","sap_fiori_3_dark","sap_fiori_3_hcb","sap_fiori_3_hcw"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.86","libs":{"sap.ui.core":{"minVersion":"1.86.2"}}},"library":{"i18n":false,"content":{"controls":[],"elements":[],"types":[],"interfaces":[]}}}}',
	"sap/fe/placeholder/view/PlaceholderLR.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc" displayBlock="true" height="100%" controllerName="sap.fe.placeholder.controller.Placeholder" xmlns="http://www.w3.org/1999/xhtml"><div class="sapFePlaceholderContainer">\n\n\t<div class="sapFeHeader sapFeResponsivePadding sapFePageHeader"><div class="sapFeHeaderTitle"><div class="sapFeHeaderTitleTextContainer"><div class="sapFeHeaderTitleText sapFeText sapFeTextWeightL sapFeTextWidthL"/></div><div class="sapFeHeaderTitleActions"><div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/></div></div><div class="sapFeHeaderContent"><div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop"><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop"><div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/><div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop"><div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/><div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop"><div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/><div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop"><div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/><div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/></div></div></div></div>\n\n\t<div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeContent sapFeResponsivePadding"><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTable sapFeTable4Cols"><div class="sapFeText sapFeTextWeightL sapFeTextWidthXL sapFeTableTitle"/><div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderRow"><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/></div></div><div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableRow"><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div></div><div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableRow"><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div></div><div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableRow"><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div></div><div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableRow"><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div></div><div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableRow"><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div></div><div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableRow"><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div></div><div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableRow"><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div></div><div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableRow"><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div><div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell"><div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/></div></div></div></div>\n</div></mvc:View>',
	"sap/fe/placeholder/view/PlaceholderOP.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc" displayBlock="true" height="100%" controllerName="sap.fe.placeholder.controller.Placeholder" xmlns="http://www.w3.org/1999/xhtml"><div class="sapFePlaceholderContainer">\n\n<div class="sapFeHeader sapFeResponsivePadding sapFeObjectPageHeader">\n    <div class="sapFeHeaderTitle">\n        <div class="sapFeHeaderTitleTextContainer">\n            <div class="sapFeHeaderTitleText sapFeText sapFeTextWeightL sapFeTextWidthL"/>\n        </div>\n        <div class="sapFeHeaderTitleActions">\n            <div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/>\n        </div>\n    </div>\n    <div class="sapFeHeaderContent">\n        <div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop">\n            <div class="sapFeAvatar sapFeAvatarSizeM sapFeAvatarShapeSquare"/>\n            <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop">\n                <div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/>\n                <div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/>\n            </div>\n            <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop">\n                <div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/>\n                <div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/>\n            </div>\n            <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop">\n                <div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/>\n                <div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/>\n            </div>\n        </div>\n    </div>\n    <div class="sapFeAnchorBar sapFeHorizontalContent">\n        <div class="sapFeText sapFeTextWeightL sapFeTextWidthM sapFeAnchorBarItem"/>\n        <div class="sapFeText sapFeTextWeightL sapFeTextWidthM sapFeAnchorBarItem"/>\n        <div class="sapFeText sapFeTextWeightL sapFeTextWidthM sapFeAnchorBarItem"/>\n    </div>\n</div>\n\n<div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeContent sapFeResponsivePadding">\n    <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeObjectPageSection">\n        <div class="sapFeText sapFeTextWeightL sapFeTextWidthXL sapFeObjectPageSectionTitle"/>\n        <div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeCols4">\n            <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop">\n                <div class="sapFeText sapFeTextWeightL sapFeTextWidthL"/>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFePaddingTop">\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/>\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFePaddingTop">\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/>\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/>\n                </div>\n            </div>\n            <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop">\n                <div class="sapFeText sapFeTextWeightL sapFeTextWidthL"/>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFePaddingTop">\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/>\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFePaddingTop">\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/>\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/>\n                </div>\n            </div>\n            <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop">\n                <div class="sapFeText sapFeTextWeightL sapFeTextWidthL"/>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFePaddingTop">\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/>\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFePaddingTop">\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/>\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/>\n                </div>\n            </div>\n            <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop">\n                <div class="sapFeText sapFeTextWeightL sapFeTextWidthL"/>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFePaddingTop">\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/>\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFePaddingTop">\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthM sapFeHeaderTitleAction"/>\n                    <div class="sapFeText sapFeTextWeightS sapFeTextWidthS sapFeHeaderTitleAction"/>\n                </div>\n            </div>\n        </div>\n        <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTable sapFeTable4Cols">\n            <div class="sapFeText sapFeTextWeightL sapFeTextWidthXL sapFeTableTitle"/>\n            <div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderRow">\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableColmnHeaderCell sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableColmnHeaderText sapFeTableText"/>\n                </div>\n            </div>\n            <div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableRow">\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n            </div>\n            <div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableRow">\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n            </div>\n            <div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableRow">\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n            </div>\n            <div class="sapFeHorizontalLayout sapFeHorizontalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableRow">\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n                <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell">\n                    <div class="sapFeText sapFeTextWeightM sapFeTextWidthM sapFeTableText"/>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n</div></mvc:View>'
},"sap/fe/placeholder/library-preload"
);
//# sourceMappingURL=library-preload.js.map