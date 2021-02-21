sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var BlockBlueT2 = BlockBase.extend("main.SharedBlocks.ThursdayT2", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "main.SharedBlocks.ThursdayT2",
						type: "XML"
					},
					Expanded: {
						viewName: "main.SharedBlocks.ThursdayT2",
						type: "XML"
					}
				}
			}
		});

		return BlockBlueT2;

	});