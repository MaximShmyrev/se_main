sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var BlockBlueT3 = BlockBase.extend("main.SharedBlocks.ThursdayT3", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "main.SharedBlocks.ThursdayT3",
						type: "XML"
					},
					Expanded: {
						viewName: "main.SharedBlocks.ThursdayT3",
						type: "XML"
					}
				}
			}
		});

		return BlockBlueT3;

	});