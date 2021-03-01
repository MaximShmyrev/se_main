/* global QUnit */
sap.ui.define(
	[
		"sap/ui/base/Object",
		"sap/ui/test/Opa5",
		"./Utils",
		"./BaseArrangements",
		"./BaseActions",
		"./BaseAssertions",
		"sap/ui/test/opaQunit",
		"sap/base/Log"
	],
	function(BaseObject, Opa5, Utils, BaseArrangements, BaseActions, BaseAssertions, opaQunit, Log) {
		"use strict";

		/**
		 * Sync all JourneyRunner instances.
		 *
		 * @type {Promise<void>}
		 * @private
		 */
		var _pRunning = Promise.resolve();

		var _oDefaultRunner;

		/**
		 * A JourneyRunner for executing integration tests with given settings.
		 */
		var JourneyRunner = BaseObject.extend("sap.fe.test.JourneyRunner", {
			/**
			 * Constructor.
			 *
			 * @param {object} [mSettings] the settings object
			 * @param {object} [mSettings.pages] the available Opa pages
			 * @param {object} [mSettings.opaConfig] the Opa configuration
			 * @param {string} [mSettings.launchUrl] the url to the launching page (usually a FLP.html)
			 * @param {object} [mSettings.launchParameters] the url launch parameters
			 * @param {boolean} [mSettings.async] if false (default), only one JourneyRunner is executed at a time
			 */
			constructor: function(mSettings) {
				BaseObject.apply(this);
				// store a copy of the settings object
				this._mInstanceSettings = Utils.mergeObjects(mSettings);
			},

			/**
			 * Execute the tests in the given order.
			 *
			 * @param {object} [mSettings] the settings object for the tests to run. Overrides instance settings
			 * @param {object} [mSettings.pages] the available Opa pages
			 * @param {object} [mSettings.opaConfig] the Opa configuration
			 * @param {string} [mSettings.launchUrl] the url to the launching page (usually a FLP.html)
			 * @param {object} [mSettings.launchParameters] the url launch parameters
			 * @param {boolean} [mSettings.async] if false (default), only one JourneyRunner is executed at a time
			 * @param {string[]|Function[]} vJourneys the journeys to be executed. If it is a string, it will be interpreted
			 * as module path to the file that should be loaded. Else it is expected to be function.
			 * @returns {Promise<void>} a promise that is resolved after all tests are executed
			 */
			run: function(mSettings, vJourneys) {
				var iJourneyParameterIndex = 1;
				if (!Utils.isOfType(mSettings, Object)) {
					iJourneyParameterIndex = 0;
					mSettings = Utils.mergeObjects(this._mInstanceSettings);
				} else {
					mSettings = Utils.mergeObjects(this._mInstanceSettings, mSettings);
				}

				var aJourneys = Utils.getParametersArray(iJourneyParameterIndex, arguments),
					bAsync = mSettings.async,
					pSyncPromise;

				if (bAsync) {
					pSyncPromise = Promise.resolve();
				} else {
					pSyncPromise = _pRunning;
				}

				pSyncPromise = pSyncPromise
					.then(this._preRunActions.bind(this, mSettings))
					.then(this._runActions.bind(this, aJourneys))
					.then(this._postRunActions.bind(this, mSettings))
					.catch(function(oError) {
						Log.error("JourneyRunner.run failed", oError);
					});

				if (!bAsync) {
					_pRunning = pSyncPromise;
				}

				return pSyncPromise;
			},

			getBaseActions: function() {
				return new BaseActions();
			},

			getBaseAssertions: function() {
				return new BaseAssertions();
			},

			getBaseArrangements: function(mSettings) {
				return new BaseArrangements(mSettings);
			},

			_preRunActions: function(mSettings) {
				Log.setLevel(1, "sap.ui.test.matchers.Properties");
				Log.setLevel(1, "sap.ui.test.matchers.Ancestor");

				Opa5.extendConfig(this._getOpaConfig(mSettings));
				Opa5.createPageObjects(mSettings.pages);
			},

			_runActions: function(aJourneys) {
				var that = this,
					pPromiseChain = Promise.resolve(),
					fnRunnerResolve,
					pRunnerEnds = new Promise(function(resolve) {
						fnRunnerResolve = resolve;
					});

				Log.info("JourneyRunner started");

				QUnit.done(function() {
					Log.info("JourneyRunner ended");
					fnRunnerResolve();
				});

				aJourneys.forEach(function(vJourney) {
					if (Utils.isOfType(vJourney, String)) {
						pPromiseChain = pPromiseChain.then(function() {
							return new Promise(function(resolve, reject) {
								sap.ui.require([vJourney], function(oJourney) {
									resolve(oJourney);
								});
							});
						});
					} else {
						pPromiseChain = pPromiseChain.then(function() {
							return vJourney;
						});
					}
					pPromiseChain = pPromiseChain.then(that._runJourney);
				});
				return pPromiseChain.then(function() {
					return pRunnerEnds;
				});
			},

			_runJourney: function(vJourney) {
				if (Utils.isOfType(vJourney, Function)) {
					vJourney.call();
				}
			},

			_postRunActions: function() {
				Opa5.resetConfig();
			},

			_getOpaConfig: function(mSettings) {
				var oConfig = Object.assign(
					{
						viewNamespace: "sap.fe.templates",
						autoWait: true,
						timeout: 60,
						logLevel: "ERROR",
						disableHistoryOverride: true,
						asyncPolling: true
					},
					mSettings.opaConfig
				);

				if (!oConfig.actions) {
					oConfig.actions = this.getBaseActions();
				}
				if (!oConfig.assertions) {
					oConfig.assertions = this.getBaseAssertions();
				}
				if (!oConfig.arrangements) {
					oConfig.arrangements = this.getBaseArrangements(mSettings);
				}

				return oConfig;
			}
		});

		JourneyRunner.getDefaultRunner = function() {
			if (!_oDefaultRunner) {
				_oDefaultRunner = new JourneyRunner();
			}
			return _oDefaultRunner;
		};

		JourneyRunner.setDefaultRunner = function(oDefaultRunner) {
			_oDefaultRunner = oDefaultRunner;
		};

		JourneyRunner.run = function() {
			var oRunner = JourneyRunner.getDefaultRunner();
			oRunner.run.apply(oRunner, arguments);
		};

		return JourneyRunner;
	}
);
