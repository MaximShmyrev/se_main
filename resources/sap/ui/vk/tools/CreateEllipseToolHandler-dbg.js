/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.tools.CreateEllipseToolHandler
sap.ui.define([
	"sap/ui/base/EventProvider",
	"../svg/Element"
], function(
	EventProvider,
	Element
) {
	"use strict";

	var CreateEllipseToolHandler = EventProvider.extend("sap.ui.vk.tools.CreateEllipseToolHandler", {
		metadata: {
		},
		constructor: function(tool) {
			this._priority = 30; // the priority of the handler
			this._tool = tool;
			this._rect = null;
		}
	});

	CreateEllipseToolHandler.prototype._getPosition = function(event) {
		var pos = this._tool._viewport._camera._screenToWorld(event.x - this._rect.x, event.y - this._rect.y);
		var matrix = Element._invertMatrix(this._tool.getGizmo()._root._matrixWorld());
		return Element._transformPoint(pos.x, pos.y, matrix);
	};

	CreateEllipseToolHandler.prototype.hover = function(event) { };

	CreateEllipseToolHandler.prototype.beginGesture = function(event) {
		var gizmo = this._tool.getGizmo();
		if (gizmo && this._inside(event)) {
			this._gesture = true;
			event.handled = true;
			gizmo._startAdding(this._getPosition(event));
		}
	};

	CreateEllipseToolHandler.prototype.move = function(event) {
		if (this._gesture) {
			event.handled = true;
			this._tool.getGizmo()._update(this._getPosition(event));
		}
	};

	CreateEllipseToolHandler.prototype.endGesture = function(event) {
		if (this._gesture) {
			this._gesture = false;
			event.handled = true;
			this._tool.getGizmo()._stopAdding(this._getPosition(event));
		}
	};

	CreateEllipseToolHandler.prototype.click = function(event) { };

	CreateEllipseToolHandler.prototype.doubleClick = function(event) { };

	CreateEllipseToolHandler.prototype.contextMenu = function(event) { };

	CreateEllipseToolHandler.prototype.getViewport = function() {
		return this._tool._viewport;
	};

	// GENERALISE THIS FUNCTION
	CreateEllipseToolHandler.prototype._getOffset = function(obj) {
		var rectangle = obj.getBoundingClientRect();
		var p = {
			x: rectangle.left + window.pageXOffset,
			y: rectangle.top + window.pageYOffset
		};
		return p;
	};

	// GENERALISE THIS FUNCTION
	CreateEllipseToolHandler.prototype._inside = function(event) {
		var id = this._tool._viewport.getIdForLabel();
		var domobj = document.getElementById(id);

		if (domobj == null) {
			return false;
		}

		var offset = this._getOffset(domobj);
		this._rect = {
			x: offset.x,
			y: offset.y,
			w: domobj.offsetWidth,
			h: domobj.offsetHeight
		};

		return (event.x >= this._rect.x && event.x <= this._rect.x + this._rect.w && event.y >= this._rect.y && event.y <= this._rect.y + this._rect.h);
	};

	return CreateEllipseToolHandler;
});