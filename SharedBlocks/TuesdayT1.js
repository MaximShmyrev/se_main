sap.ui.define(['sap/uxap/BlockBase'],
	function(BlockBase) {
		"use strict";

		var BlockBlueT1 = BlockBase.extend("main.SharedBlocks.TuesdayT1", {
			metadata: {
				views: {
					Collapsed: {
						viewName: "main.SharedBlocks.TuesdayT1",
						type: "XML"
					},
					Expanded: {
						viewName: "main.SharedBlocks.TuesdayT1",
						type: "XML"
					}
				}
			}

		});

		return BlockBlueT1;

	});