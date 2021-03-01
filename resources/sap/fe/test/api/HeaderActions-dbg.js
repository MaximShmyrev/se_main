sap.ui.define(["./HeaderAPI", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder", "./APIHelper"], function(
	HeaderAPI,
	Utils,
	OpaBuilder,
	FEBuilder,
	APIHelper
) {
	"use strict";

	/**
	 * Constructor.
	 * @param {sap.fe.test.builder.FEBuilder} oHeaderBuilder the FEBuilder instance to operate on
	 * @param {string} [vHeaderDescription] the Header description (optional), used to log message
	 * @returns {sap.fe.test.api.HeaderActions} the instance
	 * @class
	 * @private
	 */
	var HeaderActions = function(oHeaderBuilder, vHeaderDescription) {
		this._sObjectPageLayoutId = vHeaderDescription.id;
		this._sHeaderContentId = vHeaderDescription.headerContentId;
		this._sViewId = vHeaderDescription.viewId;
		this._sPaginatorId = vHeaderDescription.paginatorId;
		this._sBreadCrumbId = vHeaderDescription.breadCrumbId;
		return HeaderAPI.call(this, oHeaderBuilder, vHeaderDescription);
	};
	HeaderActions.prototype = Object.create(HeaderAPI.prototype);
	HeaderActions.prototype.constructor = HeaderActions;
	HeaderActions.prototype.isAction = true;

	/**
	 * Execute a header toolbar action. The action is identified either by id or by a string representing
	 * the label of the action.
	 *
	 * @param {string | sap.fe.test.api.ActionIdentifier} vActionIdentifier the action identifier or its label
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @experimental
	 */
	HeaderActions.prototype.iExecuteAction = function(vActionIdentifier) {
		var oOverflowToolbarBuilder = this.createOverflowToolbarBuilder(this._sObjectPageLayoutId);
		return this.prepareResult(
			oOverflowToolbarBuilder
				.doOnContent(this.createActionMatcher(vActionIdentifier), OpaBuilder.Actions.press())
				.description(Utils.formatMessage("Executing header action '{0}'", vActionIdentifier))
				.execute()
		);
	};

	/**
	 * Execute the Edit action in the ObjectPage Header Toolbar.
	 *
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @experimental
	 */
	HeaderActions.prototype.iExecuteEdit = function() {
		return this.iExecuteAction({ service: "StandardAction", action: "Edit", unbound: true });
	};

	/**
	 * Execute the Delete action in the ObjectPage Header Toolbar.
	 *
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @experimental
	 */
	HeaderActions.prototype.iExecuteDelete = function() {
		return this.iExecuteAction({ service: "StandardAction", action: "Delete", unbound: true });
	};

	/**
	 * Execute the Related Apps action in the ObjectPage Header Toolbar.
	 *
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @experimental
	 */
	HeaderActions.prototype.iExecuteRelatedApps = function() {
		return this.iExecuteAction({ service: "fe", action: "RelatedApps", unbound: true });
	};

	/**
	 * Executes an action in the currently open drop down menu. The action is identified by a string representing
	 * the label of the action.
	 *
	 * @param {string} vAction the label of the action or its state
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @experimental
	 */
	HeaderActions.prototype.iExecuteMenuAction = function(vAction) {
		return this.prepareResult(APIHelper.createMenuActionExecutorBuilder(vAction).execute());
	};

	/**
	 * Execute a paginator down button click on the object page.
	 *
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @sap-restricted
	 */
	HeaderActions.prototype.iExecutePaginatorDown = function() {
		return this.prepareResult(
			this.createPaginatorBuilder(
				OpaBuilder.Matchers.properties({ icon: "sap-icon://navigation-down-arrow" }),
				this._sViewId + "--" + this._sPaginatorId,
				{ visible: true, enabled: true }
			)
				.doPress()
				.description("Paginator button Down pressed")
				.execute()
		);
	};

	/**
	 * Execute a paginator up button click on the object page.
	 *
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @sap-restricted
	 */
	HeaderActions.prototype.iExecutePaginatorUp = function() {
		return this.prepareResult(
			this.createPaginatorBuilder(
				OpaBuilder.Matchers.properties({ icon: "sap-icon://navigation-up-arrow" }),
				this._sViewId + "--" + this._sPaginatorId,
				{ visible: true, enabled: true }
			)
				.doPress()
				.description("Paginator button Up pressed")
				.execute()
		);
	};

	/**
	 * Navigate by a Breadcrumb link on the object page.
	 *
	 * @param {string} sLink Text label of the link to be navigated to
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @sap-restricted
	 */
	HeaderActions.prototype.iNavigateByBreadcrumb = function(sLink) {
		return this.prepareResult(
			OpaBuilder.create(this)
				.hasId(this._sBreadCrumbId)
				.doOnAggregation("links", OpaBuilder.Matchers.properties({ text: sLink }), OpaBuilder.Actions.press())
				.description(Utils.formatMessage("Navigating by Breadcrumb link '{0}'", sLink))
				.execute()
		);
	};

	/**
	 * Execute the <code>Save as Tile</code> action.
	 *
	 * @param {string} sBookmarkTitle the title of the new tile
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @experimental
	 */
	HeaderActions.prototype.iExecuteSaveAsTile = function(sBookmarkTitle) {
		var sShareId = "fe::Share",
			oOverflowToolbarBuilder = this.createOverflowToolbarBuilder(this._sObjectPageLayoutId);

		return this.prepareResult(
			oOverflowToolbarBuilder
				.doOnContent(FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sShareId))), OpaBuilder.Actions.press())
				.description(Utils.formatMessage("Pressing header '{0}' Share button", this.getIdentifier()))
				.success(APIHelper.createSaveAsTileExecutorBuilder(sBookmarkTitle))
				.execute()
		);
	};

	/**
	 * Execute the Send E-Mail action.
	 *
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @experimental
	 */
	HeaderActions.prototype.iExecuteSendEmail = function() {
		var sShareId = "fe::Share",
			oOverflowToolbarBuilder = this.createOverflowToolbarBuilder(this._sObjectPageLayoutId);

		return this.prepareResult(
			oOverflowToolbarBuilder
				.doOnContent(FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sShareId))), OpaBuilder.Actions.press())
				.description(Utils.formatMessage("Pressing header '{0}' Share button", this.getIdentifier()))
				.success(APIHelper.createSendEmailExecutorBuilder())
				.execute()
		);
	};

	/**
	 * Click a link within the Object Page header.
	 * The link is identified either by id or by a string representing the content of the field.
	 *
	 * @param {object|string} vLinkIdentifier The link to be clicked. If passed as an object use the following pattern:
	 * <code><pre>
	 * 	{
	 * 		<dataField>: <name of field related to the link>
	 *  }
	 * </pre></code>
	 * @returns {object} an object extending a jQuery promise.
	 *
	 * @private
	 * @experimental
	 */
	HeaderActions.prototype.iClickLink = function(vLinkIdentifier) {
		var oHeaderContentBuilder = this.getObjectPageDynamicHeaderContentBuilder(this._sHeaderContentId);
		return this.prepareResult(
			oHeaderContentBuilder
				.doOnChildren(
					[FEBuilder.Matchers.type("sap.m.Link"), this.createFieldMatcher(vLinkIdentifier, "DataField")],
					OpaBuilder.Actions.press()
				)
				.description(Utils.formatMessage("Pressing link '{0}'", vLinkIdentifier))
				.execute()
		);
	};

	return HeaderActions;
});
