sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var BlockBlueT4 = BlockBase.extend("main.SharedBlocks.ThursdayT4", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "main.SharedBlocks.ThursdayT4",
						type: "XML"
					},
					Expanded: {
						viewName: "main.SharedBlocks.ThursdayT4",
						type: "XML"
					}
				}
			}
		});

		return BlockBlueT4;

	});