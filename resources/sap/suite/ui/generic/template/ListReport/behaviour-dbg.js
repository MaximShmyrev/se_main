// This class contains behaviour information about the LR floorplan which can be used by the framework even before an instance of the LR has been created

sap.ui.define(["sap/ui/core/Fragment"], function(Fragment){
	"use strict";

	var oPlaceholderInfo = {
		getPlaceholderPage: function(sViewId){
			return Fragment.load({
				id: sViewId, 
				name: "sap.suite.ui.generic.template.ListReport.view.fragments.Placeholder", 
				type:  "XML"
			});
		}
	};
	
	function getPlaceholderInfo(){
		return oPlaceholderInfo;
	}

	return {
		getPlaceholderInfo: getPlaceholderInfo
	};
});
