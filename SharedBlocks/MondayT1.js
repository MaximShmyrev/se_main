sap.ui.define(['sap/uxap/BlockBase'],
	function(BlockBase) {
		"use strict";

		var BlockBlueT1 = BlockBase.extend("main.SharedBlocks.MondayT1", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "main.SharedBlocks.MondayT1",
						type: "XML"
					},
					Expanded: {
						viewName: "main.SharedBlocks.MondayT1",
						type: "XML"
					}
				}
			}

		});

		return BlockBlueT1;

	});