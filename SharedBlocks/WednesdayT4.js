sap.ui.define(['sap/uxap/BlockBase'],
	function (BlockBase) {
		"use strict";

		var BlockBlueT4 = BlockBase.extend("main.SharedBlocks.WednesdayT4", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "main.SharedBlocks.WednesdayT4",
						type: "XML"
					},
					Expanded: {
						viewName: "main.SharedBlocks.WednesdayT4",
						type: "XML"
					}
				}
			}
		});

		return BlockBlueT4;

	});