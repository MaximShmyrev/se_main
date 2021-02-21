sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var BlockBlueT4 = BlockBase.extend("main.SharedBlocks.MondayT4", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "main.SharedBlocks.MondayT4",
						type: "XML"
					},
					Expanded: {
						viewName: "main.SharedBlocks.MondayT4",
						type: "XML"
					}
				}
			}
		});

		return BlockBlueT4;

	});