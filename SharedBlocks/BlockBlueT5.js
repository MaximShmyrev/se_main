sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var BlockBlueT5 = BlockBase.extend("main.SharedBlocks.BlockBlueT5", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "main.SharedBlocks.BlockBlueT5",
						type: "XML"
					},
					Expanded: {
						viewName: "main.SharedBlocks.BlockBlueT5",
						type: "XML"
					}
				}
			}
		});

		return BlockBlueT5;

	});