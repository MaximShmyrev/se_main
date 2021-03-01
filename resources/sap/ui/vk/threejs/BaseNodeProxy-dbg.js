/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the BaseNodeProxy class.
sap.ui.define([
	"../BaseNodeProxy"
], function(
	BaseNodeProxyBase
) {
	"use strict";

	/**
	 * Constructor for a new BaseNodeProxy.

	 * The objects of this class should not be created directly, and should only be created through the use of the following methods:
	 * <ul>
	 *   <li>{@link sap.ui.vk.NodeHierarchy#enumerateChildren sap.ui.vk.NodeHierarchy.enumerateChildren}</li>
	 *   <li>{@link sap.ui.vk.NodeHierarchy#enumerateAncestors sap.ui.vk.NodeHierarchy.enumerateAncestors}</li>
	 *   <li>{@link sap.ui.vk.ViewStateManager#enumerateSelection sap.ui.vk.ViewStateManager.enumerateSelection}</li>
	 * </ul>
	 *
	 * @class
	 * Provides a simple, lightweight proxy object to a node in a node hierarchy.
	 *
	 * The objects of this class should not be created directly, and should only be created through the use of the following methods:
	 * <ul>
	 *   <li>{@link sap.ui.vk.NodeHierarchy#enumerateChildren sap.ui.vk.NodeHierarchy.enumerateChildren}</li>
	 *   <li>{@link sap.ui.vk.NodeHierarchy#enumerateAncestors sap.ui.vk.NodeHierarchy.enumerateAncestors}</li>
	 *   <li>{@link sap.ui.vk.ViewStateManager#enumerateSelection sap.ui.vk.ViewStateManager.enumerateSelection}</li>
	 * </ul>
	 *
	 * @public
	 * @author SAP SE
	 * @version 1.86.0
	 * @extends sap.ui.vk.BaseNodeProxy
	 * @implements sap.ui.base.Poolable
	 * @alias sap.ui.vk.threejs.BaseNodeProxy
	 */
	var BaseNodeProxy = BaseNodeProxyBase.extend("sap.ui.vk.threejs.BaseNodeProxy", /** @lends sap.ui.vk.threejs.BaseNodeProxy.prototype */ {
		metadata: {
		}
	});

	/**
	 * Initialize this BaseNodeProxy with its data.
	 *
	 * The <code>init</code> method is called by an object pool when the
	 * object is (re-)activated for a new caller.
	 *
	 * @param {sap.ui.vk.threejs.NodeHierarchy} nodeHierarchy The NodeHierarchy object this BaseNodeProxy object belongs to.
	 * @param {any} nodeRef The reference object of the node for which to get BaseNodeProxy.
	 * @private
	 * @see sap.ui.base.Poolable.prototype#init
	 */
	BaseNodeProxy.prototype.init = function(nodeHierarchy, nodeRef) {
		this._object3D = nodeRef;
	};

	/**
	 * Reset BaseNodeProxy data, needed for pooling.
	 * @private
	 * @see sap.ui.base.Poolable.prototype#reset
	 */
	BaseNodeProxy.prototype.reset = function() {
		this._object3D = null;
	};

	/**
	 * Gets the reference object of the node.
	 * @returns {object} The node's reference object.
	 * @public
	 */
	BaseNodeProxy.prototype.getNodeRef = function() {
		return this._object3D;
	};

	/**
	 * Gets the node reference.
	 * @returns {any} The node reference.
	 * @public
	 */
	BaseNodeProxy.prototype.getNodeId = function() {
		return this._object3D;
	};

	/**
	 * Gets the name of the node.
	 * @returns {string} The node's name.
	 * @public
	 */
	BaseNodeProxy.prototype.getName = function() {
		return this._object3D.name || ("<" + this._object3D.type + ">");
	};

	/**
	 * Gets the metadata of the node.
	 * @return {object} A JSON object containing the node's metadata.
	 * @public
	 */
	// NB: We cannot name the method getMetadata as there already exists sap.ui.base.Object.getMetadata method.
	BaseNodeProxy.prototype.getNodeMetadata = function() {
		return this._object3D.userData.metadata || {};
	};

	/**
	 * Indicates whether the node has child nodes.
	 * @returns {boolean} A value of <code>true</code> indicates that the node has child nodes, and a value of <code>false</code> indicates otherwise.
	 * @public
	 */
	BaseNodeProxy.prototype.getHasChildren = function() {
		return this._object3D.children.length > 0;
	};

	/**
	 * Gets the scene reference that this BaseNodeProxy object wraps.
	 * @returns {any} A scene reference that this BaseNodeProxy object wraps.
	 * @public
	 */
	BaseNodeProxy.prototype.getSceneRef = function() {
		return this._object3D;
	};

	return BaseNodeProxy;
});
