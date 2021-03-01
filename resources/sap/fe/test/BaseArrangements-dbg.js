sap.ui.define(
	["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/ui/thirdparty/jquery", "sap/base/util/UriParameters", "./Utils", "./Stubs"],
	function(Opa5, OpaBuilder, jQuery, UriParameters, Utils, Stubs) {
		"use strict";

		// All common arrangements for all Opa tests are defined here
		return Opa5.extend("sap.fe.test.BaseArrangements", {
			/**
			 * Constructor.
			 *
			 * @param {object} mSettings
			 * @param {string} mSettings.launchUrl
			 * @param {object} mSettings.launchParameters
			 */
			constructor: function(mSettings) {
				Opa5.apply(this);
				var oUriParams = new UriParameters(window.location.href),
					mDefaultLaunchParameters = {
						"sap-ui-log-level": "ERROR",
						"sap-ui-xx-viewCache": true
					};
				if (oUriParams.get("useBackendUrl")) {
					mDefaultLaunchParameters.useBackendUrl = oUriParams.get("useBackendUrl");
				}
				this._mSettings = Utils.mergeObjects(
					{
						launchParameters: mDefaultLaunchParameters
					},
					mSettings
				);
			},

			iStartMyApp: function(sAppHash, mSandboxParams) {
				var sLaunchUrl = this._mSettings.launchUrl,
					mUrlParameters = Utils.mergeObjects(this._mSettings.launchParameters, mSandboxParams),
					sUrlParameters = Object.keys(mUrlParameters).reduce(function(sCurrent, sKey) {
						return sCurrent + "&" + sKey + "=" + mUrlParameters[sKey];
					}, ""),
					sStartupUrl = sLaunchUrl + (sUrlParameters ? "?" + sUrlParameters.substring(1) : "") + (sAppHash ? "#" + sAppHash : "");

				this.iStartMyAppInAFrame(sStartupUrl);

				// We need to reset the native navigation functions in the iFrame
				// as the navigation mechanism in Fiori elements uses them
				// (they are overridden in OPA by the iFrameLauncher)
				// We also need to override native confirm dialog, as it blocks the test
				return OpaBuilder.create(this)
					.success(function() {
						var oWindow = Opa5.getWindow();

						Stubs.stubAll(oWindow);
					})
					.description(Utils.formatMessage("Started url '{0}' in iFrame", sStartupUrl))
					.execute();
			},

			resetTestData: function() {
				function _deleteDatabase(sName) {
					return new Promise(function(resolve, reject) {
						var oRequest = indexedDB.deleteDatabase(sName);
						oRequest.onsuccess = resolve;
						oRequest.onerror = reject;
					});
				}

				localStorage.clear();
				sessionStorage.clear();

				if (indexedDB) {
					if (typeof indexedDB.databases === "function") {
						// browser supports enumerating existing databases - wipe all.
						return indexedDB.databases().then(function(aDatabases) {
							return Promise.all(
								aDatabases.map(function(oDatabase) {
									return _deleteDatabase(oDatabase.name);
								})
							);
						});
					} else {
						// browser does not support enumerating databases (e.g. Firefox) - at least delete the UI5 cache.
						return _deleteDatabase("ui5-cachemanager-db");
					}
				} else {
					// no indexedDB
					return Promise.resolve();
				}
			},

			iResetTestData: function(bIgnoreRedeploy) {
				var that = this,
					bSuccess = false;

				return OpaBuilder.create(this)
					.success(function() {
						//clear local storage so no flex change / variant management zombies exist
						that.resetTestData()
							.finally(function() {
								bSuccess = true;
							})
							.catch(function(oError) {
								throw oError;
							});

						return OpaBuilder.create(this)
							.check(function() {
								return bSuccess;
							})
							.execute();
					})
					.description(Utils.formatMessage("Resetting test data"))
					.execute();
			},

			iTearDownMyApp: function() {
				return OpaBuilder.create(this)
					.do(function() {
						var oWindow = Opa5.getWindow();
						Stubs.restoreAll(oWindow);
					})
					.do(this.iTeardownMyAppFrame.bind(this))
					.description("Tearing down my app")
					.execute();
			}
		});
	}
);
