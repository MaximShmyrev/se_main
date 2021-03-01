// This class contains behaviour information about the OP floorplan which can be used by the framework even before an instance of the OP has been created

sap.ui.define(["sap/ui/core/Fragment"], function(Fragment){
	"use strict";

	var oPlaceholderInfo = {
		getPlaceholderPage: function(sViewId){
			return Fragment.load({
				id: sViewId, 
				name: "sap.suite.ui.generic.template.ObjectPage.view.fragments.Placeholder", 
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
