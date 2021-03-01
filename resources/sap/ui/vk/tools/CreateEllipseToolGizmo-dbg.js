/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.tools.CreateEllipseToolGizmo
sap.ui.define([
	"./Gizmo",
	"../svg/Ellipse"
], function(
	Gizmo,
	Ellipse
) {
	"use strict";

	/**
	 * Constructor for a new CreateEllipseToolGizmo.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Provides UI to display tooltips
	 * @extends sap.ui.vk.tools.Gizmo
	 *
	 * @author SAP SE
	 * @version 1.86.0
	 *
	 * @constructor
	 * @private
	 * @alias sap.ui.vk.tools.CreateEllipseToolGizmo
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CreateEllipseToolGizmo = Gizmo.extend("sap.ui.vk.tools.CreateEllipseToolGizmo", /** @lends sap.ui.vk.tools.CreateEllipseToolGizmo.prototype */ {
		metadata: {
			library: "sap.ui.vk"
		}
	});

	CreateEllipseToolGizmo.prototype.init = function() {
		if (Gizmo.prototype.init) {
			Gizmo.prototype.init.apply(this);
		}

		this._activeElement = null;
	};

	CreateEllipseToolGizmo.prototype.hasDomElement = function() {
		return false;
	};

	CreateEllipseToolGizmo.prototype.show = function(viewport, tool) {
		this._viewport = viewport;
		this._tool = tool;
		var root = viewport._scene.getRootElement();
		while (root.userData.skipIt && root.children.length > 0) {
			root = root.children[ 0 ];
		}
		this._root = root;
	};

	CreateEllipseToolGizmo.prototype.hide = function() {
		this._viewport = null;
		this._tool = null;
		this._root = null;
	};

	CreateEllipseToolGizmo.prototype._startAdding = function(pos) {
		this._startPos = pos;
		this._activeElement = new Ellipse({
			matrix: [ 1, 0, 0, 1, pos.x, pos.y ],
			material: this._tool._material,
			lineStyle: this._tool._lineStyle,
			fillStyle: this._tool._fillStyle
		});

		this._root.add(this._activeElement);
		this._root.rerender();
	};

	CreateEllipseToolGizmo.prototype._update = function(pos) {
		var p1 = this._startPos;
		var activeElement = this._activeElement;
		if (activeElement) {
			var rx = Math.abs(p1.x - pos.x);
			var ry = Math.abs(p1.y - pos.y);
			if (this._tool.getUniformMode()) {
				rx = ry = Math.max(rx, ry);
			}
			activeElement.rx = rx;
			activeElement.ry = ry;
			activeElement.invalidate();
		}
	};

	CreateEllipseToolGizmo.prototype._stopAdding = function(pos) {
		var node = this._activeElement;
		this._tool.fireCompleted({
			node: node,
			parametric: {
				type: "ellipse",
				major: node.rx,
				minor: node.ry
			}
		});

		this._activeElement = null;

		this._tool.setActive(false);
	};

	return CreateEllipseToolGizmo;

});
