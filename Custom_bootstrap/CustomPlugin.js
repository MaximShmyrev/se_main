(function() {

	'use strict';
	jQuery.sap.log.debug("Custom boostrap is loaded");
	jQuery.sap.declare("se.CustomPlugin");
	jQuery.sap.require("sap.ffp.utils.ExtensionUtils");
	
	var user = sap.ushell.Container.getUser().getId();
	sessionStorage.setItem("USERNAME", user);

	// sap.ffp.extensions.registerFFPExtension(sap.ffp.extensions.extensionTypes.LOAD_HOMEPAGE,
	// 	function(groups) {
	// 		window.document.title = "Главное меню";

	// 	}
	// );

	window.open("http://portal.samaraenergo.ru:50000/com.sap.portal.resourcerepository/repo/fioriApplications/main/index.html", '_self');

}());