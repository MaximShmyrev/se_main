sap.ui.define(['sap/uxap/BlockBase'],
	function(BlockBase) {
		"use strict";

		var BlockBlueT1 = BlockBase.extend("main.SharedBlocks.ThursdayT1", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "main.SharedBlocks.ThursdayT1",
						type: "XML"
					},
					Expanded: {
						viewName: "main.SharedBlocks.ThursdayT1",
						type: "XML"
					}
				}
			}

		});

		return BlockBlueT1;

	});