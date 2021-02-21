sap.ui.define(['sap/uxap/BlockBase'],
	function(BlockBase) {
		"use strict";

		var BlockBlueT1 = BlockBase.extend("main.SharedBlocks.FridayT1", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "main.SharedBlocks.FridayT1",
						type: "XML"
					},
					Expanded: {
						viewName: "main.SharedBlocks.FridayT1",
						type: "XML"
					}
				}
			}

		});

		return BlockBlueT1;

	});