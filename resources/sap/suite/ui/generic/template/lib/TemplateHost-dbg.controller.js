sap.ui.define(["sap/ui/core/mvc/Controller"], function(mvcController) {
	"use strict";

	return mvcController.extend("sap.suite.ui.generic.template.lib.TemplateHost", {
		
		isPlaceholderShown: function(mPlaceholdersShown){
			var isPlaceholder = !!mPlaceholdersShown[this.sRouteName];
			if (isPlaceholder){
				this.getView().getContent()[1].setHeight("0%");
				this.getView().getContent()[1].setWidth("0%");
			} else {
				this.getView().getContent()[1].setHeight("100%");
				this.getView().getContent()[1].setWidth("100%");
			}
			return isPlaceholder;
		},
		
		setRouteName: function(sRouteName){
			this.sRouteName = sRouteName;
		}
	});
}, /* bExport= */true);