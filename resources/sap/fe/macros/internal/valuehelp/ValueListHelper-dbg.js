/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
/* global Promise */
sap.ui.define(
	[
		"sap/ui/thirdparty/jquery",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/Fragment",
		"sap/ui/mdc/field/InParameter",
		"sap/ui/mdc/field/OutParameter",
		"sap/base/Log",
		"sap/ui/dom/units/Rem",
		"sap/fe/core/BusyLocker",
		"sap/fe/core/actions/messageHandling"
		//Just to be loaded for templating
		//"sap/ui/mdc/field/FieldValueHelp"
	],
	function(
		jQuery,
		XMLTemplateProcessor,
		JSONModel,
		XMLPreprocessor,
		Fragment,
		InParameter,
		OutParameter,
		Log,
		Rem,
		BusyLocker,
		messageHandling
	) {
		"use strict";
		var waitForPromise = {};
		var aCachedValueHelp = [];

		function _hasImportanceHigh(oValueListContext) {
			return oValueListContext.Parameters.some(function(oParameter) {
				return (
					oParameter["@com.sap.vocabularies.UI.v1.Importance"] &&
					oParameter["@com.sap.vocabularies.UI.v1.Importance"].$EnumMember === "com.sap.vocabularies.UI.v1.ImportanceType/High"
				);
			});
		}

		function _entityIsSearchable(oValueListInfo) {
			var oCollectionAnnotations =
					oValueListInfo.valueListInfo.$model.getMetaModel().getObject("/" + oValueListInfo.valueListInfo.CollectionPath + "@") ||
					{},
				bSearchable =
					oCollectionAnnotations["@Org.OData.Capabilities.V1.SearchRestrictions"] &&
					oCollectionAnnotations["@Org.OData.Capabilities.V1.SearchRestrictions"].Searchable;
			return bSearchable === undefined ? true : bSearchable;
		}

		function _getCachedValueHelp(sValueHelpQualifierId) {
			return aCachedValueHelp.find(function(oVHElement) {
				return oVHElement.sVLQualifier === sValueHelpQualifierId;
			});
		}

		var ValueListHelper = {
			getColumnVisibility: function(oValueList, oVLParameter) {
				if (!_hasImportanceHigh(oValueList)) {
					return undefined;
				} else if (
					oVLParameter &&
					oVLParameter["@com.sap.vocabularies.UI.v1.Importance"] &&
					oVLParameter["@com.sap.vocabularies.UI.v1.Importance"].$EnumMember === "com.sap.vocabularies.UI.v1.ImportanceType/High"
				) {
					return undefined;
				} else {
					return "{_VHUI>/showAllColumns}";
				}
			},
			hasImportance: function(oValueListContext) {
				return _hasImportanceHigh(oValueListContext.getObject()) ? "Importance/High" : "None";
			},
			getMinScreenWidth: function(oValueList) {
				return _hasImportanceHigh(oValueList) ? "{= ${_VHUI>/minScreenWidth}}" : "416px";
			},
			getTableItemsParameters: function(oValueList, sRequestGroupId, bSuggestion) {
				var sSortFieldName,
					sParameters = "",
					metaModel = oValueList.$model.getMetaModel();

				oValueList.Parameters.find(function(oElement) {
					if (
						metaModel.getObject(
							"/" +
								oValueList.CollectionPath +
								"/" +
								oElement.ValueListProperty +
								"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement/$EnumMember"
						) === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
					) {
						sSortFieldName = metaModel.getObject(
							"/" +
								oValueList.CollectionPath +
								"/" +
								oElement.ValueListProperty +
								"@com.sap.vocabularies.Common.v1.Text/$Path"
						);
					} else {
						sSortFieldName = oElement.ValueListProperty;
					}
					return !(
						metaModel.getObject(
							"/" + oValueList.CollectionPath + "/" + oElement.ValueListProperty + "@com.sap.vocabularies.UI.v1.Hidden"
						) === true
					);
				});

				var bSuspended = oValueList.Parameters.some(function(oParameter) {
					return bSuggestion || oParameter.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterIn";
				});

				if (sRequestGroupId) {
					sParameters = ", parameters: { $$groupId: '" + sRequestGroupId + "' }";
				}

				return (
					"{path: '/" +
					oValueList.CollectionPath +
					"'" +
					sParameters +
					", suspended : " +
					bSuspended +
					", sorter: {path: '" +
					sSortFieldName +
					"', ascending: true}}"
				);
			},
			getPropertyPath: function(oParameters) {
				return !oParameters.UnboundAction
					? "/" + oParameters.EntitySet + "/" + oParameters.Action + "/" + oParameters.Property
					: "/" + oParameters.Action.substring(oParameters.Action.lastIndexOf(".") + 1) + "/" + oParameters.Property;
			},
			getWaitForPromise: function() {
				return waitForPromise;
			},
			getValueListCollectionEntitySet: function(oValueListContext) {
				var mValueList = oValueListContext.getObject();
				return mValueList.$model.getMetaModel().createBindingContext("/" + mValueList.CollectionPath);
			},
			getValueListProperty: function(oPropertyContext) {
				var oValueListModel = oPropertyContext.getModel();
				var mValueList = oValueListModel.getObject("/");
				return mValueList.$model
					.getMetaModel()
					.createBindingContext("/" + mValueList.CollectionPath + "/" + oPropertyContext.getObject());
			},

			getValueListInfo: function(oFVH, oMetaModel, propertyPath, sConditionModel) {
				var sKey,
					sDescriptionPath,
					sFilterFields = "",
					sPropertyName = oMetaModel.getObject(propertyPath + "@sapui.name"),
					sPropertyPath,
					aInParameters = [],
					aOutParameters = [],
					sFieldPropertyPath = "";
				// Adding bAutoExpandSelect (second parameter of requestValueListInfo) as true by default
				return oMetaModel
					.requestValueListInfo(propertyPath, true, oFVH.getBindingContext())
					.then(function(mValueListInfo) {
						var bProcessInOut = oFVH.getInParameters().length + oFVH.getOutParameters().length === 0,
							sQualifier = Object.keys(mValueListInfo)[1] ? Object.keys(mValueListInfo)[1] : Object.keys(mValueListInfo)[0],
							sValueHelpQualifierId;
						// ContextDependentValueHelp should not used in LR-Filterbar, Action/Create-Dialog
						if (
							oFVH.getBindingContext() &&
							(oFVH
								.getParent()
								.getId()
								.indexOf("APD_") < 0 ||
								oFVH
									.getParent()
									.getId()
									.indexOf("CreateDialog") < 0) &&
							oFVH
								.getModel()
								.getMetaModel()
								.getObject(propertyPath + "@")["@com.sap.vocabularies.Common.v1.ValueListRelevantQualifiers"]
						) {
							sValueHelpQualifierId =
								sQualifier === "" ? "DefaultValueHelp::" + oFVH.getId() : oFVH.getId() + "::qualifier::" + sQualifier;
							oFVH.getModel("_VHUI").setProperty("/contextDependentValueHelpId", sValueHelpQualifierId);
							oFVH.getModel("_VHUI").setProperty("/noValidValueHelp", false);
						}
						// No valid qualifier should be handled in mdc
						if (sQualifier === undefined) {
							return oFVH.getModel("_VHUI").setProperty("/noValidValueHelp", true);
						}

						mValueListInfo = mValueListInfo[sValueHelpQualifierId ? sQualifier : ""];

						// Determine the settings
						// TODO: since this is a static function we can't store the infos when filterbar is requested later
						mValueListInfo.Parameters.forEach(function(entry) {
							//All String fields are allowed for filter
							sPropertyPath = "/" + mValueListInfo.CollectionPath + "/" + entry.ValueListProperty;
							var oProperty = mValueListInfo.$model.getMetaModel().getObject(sPropertyPath),
								oPropertyAnnotations = mValueListInfo.$model.getMetaModel().getObject(sPropertyPath + "@") || {};

							// If oProperty is undefined, then the property coming for the entry isn't defined in
							// the metamodel, therefore we don't need to add it in the in/out parameters
							if (oProperty) {
								// Search for the *out Parameter mapped to the local property
								if (!sKey && entry.$Type.indexOf("Out") > 48 && entry.LocalDataProperty.$PropertyPath === sPropertyName) {
									//"com.sap.vocabularies.Common.v1.ValueListParameter".length = 49
									sFieldPropertyPath = sPropertyPath;
									sKey = entry.ValueListProperty;
									//Only the text annotation of the key can specify the description
									sDescriptionPath =
										oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"] &&
										oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"].$Path;
								}
								if (
									!sFilterFields &&
									oProperty.$Type === "Edm.String" &&
									!oPropertyAnnotations["@com.sap.vocabularies.UI.v1.HiddenFilter"] &&
									!oPropertyAnnotations["@com.sap.vocabularies.UI.v1.Hidden"]
								) {
									//TODO: Ask why I can only specify one filter field? Maybe , is the wrong syntax...
									sFilterFields =
										sFilterFields.length > 0 ? sFilterFields + "," + entry.ValueListProperty : entry.ValueListProperty;
								}
								//Collect In and Out Parameter (except the field in question)
								if (
									bProcessInOut &&
									entry.$Type !== "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly" &&
									entry.$Type !== "com.sap.vocabularies.Common.v1.ValueListParameterConstant" &&
									entry.LocalDataProperty &&
									entry.LocalDataProperty.$PropertyPath !== sPropertyName
								) {
									var sValuePath = "";
									if (sConditionModel && sConditionModel.length > 0) {
										sValuePath = sConditionModel + ">/conditions/";
									}
									sValuePath = "{" + sValuePath + entry.LocalDataProperty.$PropertyPath + "}";
									//Out and InOut
									if (entry.$Type.indexOf("Out") > 48) {
										aOutParameters.push(
											new OutParameter({
												value: sValuePath,
												helpPath: entry.ValueListProperty
											})
										);
									}
									//In and InOut
									if (entry.$Type.indexOf("In") > 48) {
										aInParameters.push(
											new InParameter({
												value: sValuePath,
												helpPath: entry.ValueListProperty,
												initialValueFilterEmpty: entry.InitialValueIsSignificant
											})
										);
									}
									//otherwise displayOnly and therefor not considered
								}
								// Collect Constant Parameter
								// We manage constants parameters as in parameters so that the value list table is filtered properly
								if (entry.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterConstant") {
									aInParameters.push(
										new InParameter({
											value: entry.Constant,
											helpPath: entry.ValueListProperty
										})
									);
								}
							}
						});
						return {
							keyValue: sKey,
							descriptionValue: sDescriptionPath,
							fieldPropertyPath: sFieldPropertyPath,
							filters: sFilterFields,
							inParameters: aInParameters,
							outParameters: aOutParameters,
							valueListInfo: mValueListInfo
						};
					})
					.catch(function(exc) {
						var sMsg =
							exc.status && exc.status === 404
								? "Metadata not found (" + exc.status + ") for value help of property " + propertyPath
								: exc.message;
						Log.error(sMsg);
						oFVH.destroyContent();
					});
			},
			createValueHelpDialog: function(propertyPath, oFVH, oTable, oFilterBar, oValueListInfo, bSuggestion) {
				var sFVHClass = oFVH.getMetadata().getName(),
					oWrapper = oFVH.getContent && oFVH.getContent(),
					sWrapperId = oWrapper && oWrapper.getId(),
					sFilterFields = oValueListInfo && oValueListInfo.filters,
					aInParameters = oValueListInfo && oValueListInfo.inParameters,
					aOutParameters = oValueListInfo && oValueListInfo.outParameters,
					contextDependentValueHelpId = oFVH.getModel("_VHUI").getProperty("/contextDependentValueHelpId"),
					that = this;

				//Only do this in case of context dependent value helps or other VH called the first time
				if ((!oTable || contextDependentValueHelpId !== undefined) && sFVHClass.indexOf("FieldValueHelp") > -1) {
					//Complete the field value help control
					oFVH.setTitle(oValueListInfo.valueListInfo.Label);
					//TODO Clarify setKeyPath and setDescriptionPath. They may be for the (F)Fields not for the value helps
					oFVH.setKeyPath(oValueListInfo.keyValue);
					oFVH.setDescriptionPath(oValueListInfo.descriptionValue);
					//TODO: We need $search as the setFilterFields is used for type ahead. If I don't set any field it type ahead doesn't work
					oFVH.setFilterFields(_entityIsSearchable(oValueListInfo) ? "$search" : "");
				}

				function templateFragment(sFragmentName) {
					var oFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment"),
						mValueListInfo = oValueListInfo.valueListInfo,
						oValueListModel = new JSONModel(mValueListInfo),
						oValueListServiceMetaModel = mValueListInfo.$model.getMetaModel(),
						contextDependentValueHelpId = oFVH.getModel("_VHUI").getProperty("/contextDependentValueHelpId"),
						oSourceModel = new JSONModel({
							id: contextDependentValueHelpId ? contextDependentValueHelpId : oFVH.getId(),
							groupId: oFVH.data("requestGroupId") || undefined,
							bSuggestion: bSuggestion,
							valueHelpWithFixedValues: oFVH
								.getModel()
								.getMetaModel()
								.getObject(propertyPath + "@")["@com.sap.vocabularies.Common.v1.ValueListWithFixedValues"]
						});
					return Promise.resolve(
						XMLPreprocessor.process(
							oFragment,
							{ name: sFragmentName },
							{
								//querySelector("*")
								bindingContexts: {
									valueList: oValueListModel.createBindingContext("/"),
									entitySet: oValueListServiceMetaModel.createBindingContext("/" + mValueListInfo.CollectionPath),
									source: oSourceModel.createBindingContext("/")
								},
								models: {
									valueList: oValueListModel,
									entitySet: oValueListServiceMetaModel,
									source: oSourceModel,
									metaModel: oValueListServiceMetaModel
								}
							}
						)
					).then(function(oFragment) {
						var oLogInfo = { path: propertyPath, fragmentName: sFragmentName, fragment: oFragment };
						if (Log.getLevel() === Log.Level.DEBUG) {
							//In debug mode we log all generated fragments
							ValueListHelper.ALLFRAGMENTS = ValueListHelper.ALLFRAGMENTS || [];
							ValueListHelper.ALLFRAGMENTS.push(oLogInfo);
						}
						if (ValueListHelper.logFragment) {
							//One Tool Subscriber allowed
							setTimeout(function() {
								ValueListHelper.logFragment(oLogInfo);
							}, 0);
						}
						return Fragment.load({ definition: oFragment });
					});
				}

				oTable = oTable || templateFragment("sap.fe.macros.internal.valuehelp.ValueListTable");

				//Create filter bar if not there and requested via bSuggestion===false
				if (sFilterFields.length) {
					oFilterBar = oFilterBar || (!bSuggestion && templateFragment("sap.fe.macros.internal.valuehelp.ValueListFilterBar"));
				} else {
					oFilterBar = Promise.resolve();
				}
				return Promise.all([oTable, oFilterBar]).then(function(aControls) {
					var contextDependentValueHelpId = oFVH.getModel("_VHUI").getProperty("/contextDependentValueHelpId"),
						oTable = aControls[0],
						oFilterBar = aControls[1],
						aFilterItems = oFilterBar ? oFilterBar.getFilterItems() : [];
					if (oTable) {
						oTable.setModel(oValueListInfo.valueListInfo.$model);
						var oBinding = oTable.getBinding("items");
						oBinding.attachEventOnce("dataRequested", function() {
							BusyLocker.lock(oTable);
						});
						oBinding.attachEvent("dataReceived", function(oEvent) {
							if (BusyLocker.isLocked(oTable)) {
								BusyLocker.unlock(oTable);
							}
							if (oEvent.getParameter("error")) {
								// show the unbound messages but with a timeout as the messages are otherwise not yet in the message model
								setTimeout(messageHandling.showUnboundMessages, 0);
							}
						});
						Log.info("Value List XML content created [" + propertyPath + "]", oTable.getMetadata().getName(), "MDC Templating");
					}
					if (oFilterBar && aFilterItems.length) {
						oFilterBar.setModel(oValueListInfo.valueListInfo.$model);
						Log.info(
							"Value List XML content created [" + propertyPath + "]",
							oFilterBar.getMetadata().getName(),
							"MDC Templating"
						);
					}
					if (oTable !== oWrapper.getTable() || contextDependentValueHelpId !== undefined) {
						oWrapper.setTable(oTable);
						delete waitForPromise[sWrapperId];
					}
					oTable.setWidth(that.getTableWidth(oTable, that._getWidthInRem(oFVH._getField())));
					// TODO accessing private variable, but why is the table wrapper intermingling with the table width?!
					oWrapper._sTableWidth = oTable.getWidth();
					var sContextualWidth = bSuggestion ? "416px" : "Auto";
					oTable.setContextualWidth(sContextualWidth);

					if (
						(oFilterBar && oFilterBar !== oFVH.getFilterBar() && aFilterItems.length) ||
						(oFilterBar && contextDependentValueHelpId !== undefined)
					) {
						oFVH.setFilterBar(oFilterBar);
					} else {
						oFVH.addDependent(oFilterBar);
					}
					aOutParameters.forEach(function(oOutParameter) {
						oFVH.addOutParameter(oOutParameter);
					});
					aInParameters.forEach(function(oInParameter) {
						oFVH.addInParameter(oInParameter);
					});
					// Removing Value Help InParameter set in Condition because of a VH Constant Parameter set
					oFVH.attachEventOnce("afterClose", function(oEvent) {
						var oFVH = oEvent.oSource;
						var aConditions = oFVH && oFVH.getConditions();
						if (aConditions && aConditions[0] && aConditions[0].inParameters) {
							delete aConditions[0].inParameters;
							oFVH.fireSelect({ conditions: aConditions, add: false, close: true });
						}
					});
					if (contextDependentValueHelpId !== undefined) {
						var oSelectedCacheItem = _getCachedValueHelp(contextDependentValueHelpId);
						if (!oSelectedCacheItem) {
							aCachedValueHelp.push({
								sVLQualifier: contextDependentValueHelpId,
								oVLTable: oTable,
								oVLFilterBar: oFilterBar
							});
						}
					}
				});
			},
			_getWidthInRem: function(oControl) {
				var $width = oControl.$().width(),
					fWidth = $width ? parseFloat(Rem.fromPx($width)) : 0;
				return isNaN(fWidth) ? 0 : fWidth;
			},
			getTableWidth: function(oTable, fMinWidth) {
				var sWidth,
					aColumns = oTable.getColumns(),
					aVisibleColumns =
						(aColumns &&
							aColumns.filter(function(oColumn) {
								return oColumn && oColumn.getVisible();
							})) ||
						[],
					iSumWidth = aVisibleColumns.reduce(function(fSum, oColumn) {
						sWidth = oColumn.getWidth();
						if (sWidth && sWidth.endsWith("px")) {
							sWidth = Rem.fromPx(sWidth);
						}
						var fWidth = parseFloat(sWidth);
						return fSum + (isNaN(fWidth) ? 9 : fWidth);
					}, aVisibleColumns.length);
				return Math.max(iSumWidth, fMinWidth) + "em";
			},
			showValueListInfo: function(propertyPath, oFVH, bSuggestion, sConditionModel) {
				var oModel = oFVH.getModel(),
					oMetaModel = oModel.getMetaModel(),
					oWrapper = oFVH.getContent && oFVH.getContent(),
					sWrapperId = oWrapper && oWrapper.getId(),
					oTable = oWrapper && oWrapper.getTable && oWrapper.getTable(),
					oFilterBar = oFVH && oFVH.getFilterBar && oFVH.getFilterBar(),
					bExists = oTable && oFilterBar,
					oVHUIModel,
					contextDependentValueHelpId;

				// setting the _VHUI model evaluated in the ValueListTable fragment
				oVHUIModel = oFVH.getModel("_VHUI");
				if (!oVHUIModel) {
					oVHUIModel = new JSONModel({});
					oFVH.setModel(oVHUIModel, "_VHUI");
				}
				oVHUIModel.setProperty("/showAllColumns", !bSuggestion);
				oVHUIModel.setProperty("/minScreenWidth", !bSuggestion ? "418px" : undefined);
				contextDependentValueHelpId = oFVH.getModel("_VHUI").getProperty("/contextDependentValueHelpId");

				// switch off internal caching
				if (contextDependentValueHelpId !== undefined && oFVH.getBindingContext()) {
					oTable = undefined;
					oFilterBar = undefined;
					bExists = undefined;
					delete waitForPromise[sWrapperId];
				}

				if (!oFilterBar && oFVH.getDependents().length > 0) {
					var oPotentialFilterBar = oFVH.getDependents()[0];
					if (oPotentialFilterBar.isA("sap.ui.mdc.filterbar.vh.FilterBar")) {
						oFilterBar = oPotentialFilterBar;
					}
				}
				if (waitForPromise[sWrapperId] || bExists) {
					return waitForPromise["promise" + sWrapperId];
				} else {
					if (!oTable) {
						waitForPromise[sWrapperId] = true;
					}
					var oPromise = ValueListHelper.getValueListInfo(oFVH, oMetaModel, propertyPath, sConditionModel)
						.then(function(oValueListInfo) {
							var contextDependentValueHelpId = oFVH.getModel("_VHUI").getProperty("/contextDependentValueHelpId");
							var oSelectedCacheItem = _getCachedValueHelp(contextDependentValueHelpId);
							if (oFVH.getModel("_VHUI").getProperty("/noValidValueHelp")) {
								Log.error("Context dependent value help not found");
								return oFVH.close();
							}
							if (oSelectedCacheItem) {
								oTable = oSelectedCacheItem.oVLTable;
								oFilterBar = oSelectedCacheItem.oVLFilterBar;
							}
							return (
								oValueListInfo &&
								ValueListHelper.createValueHelpDialog(propertyPath, oFVH, oTable, oFilterBar, oValueListInfo, bSuggestion)
							);
						})
						.catch(function(exc) {
							var sMsg =
								exc.status && exc.status === 404
									? "Metadata not found (" + exc.status + ") for value help of property " + propertyPath
									: exc.message;
							Log.error(sMsg);
							oFVH.destroyContent();
						});
					waitForPromise["promise" + sWrapperId] = oPromise;
					return oPromise;
				}
			},
			setValueListFilterFields: function(propertyPath, oFVH, bSuggestion, sConditionModel) {
				var oModel = oFVH.getModel(),
					oMetaModel = oModel.getMetaModel();
				// For ContextDependentValueHelp the func getValueListInfo is also called
				if (
					oFVH.getBindingContext() &&
					oFVH
						.getModel()
						.getMetaModel()
						.getObject(propertyPath + "@")["@com.sap.vocabularies.Common.v1.ValueListRelevantQualifiers"]
				) {
					return;
				}
				return ValueListHelper.getValueListInfo(oFVH, oMetaModel, propertyPath, sConditionModel).then(function(oValueListInfo) {
					oValueListInfo && oFVH.setFilterFields(_entityIsSearchable(oValueListInfo) ? "$search" : "");
				});
			},
			getColumnWidth: function(sDataFieldType, oValueList) {
				if (oValueList && oValueList.Parameters && oValueList.Parameters.length === 1) {
					// in case there is a single parameter its width needs to match the table's hence type is ignored
					return "auto";
				}
				switch (sDataFieldType) {
					case "Edm.Stream":
						return "7em";
					case "Edm.Boolean":
						return "8em";
					case "Edm.Date":
					case "Edm.TimeOfDay":
						return "9em";
					case "Edm.DateTimeOffset":
						return "12em";
					default:
						return "auto";
				}
			}
		};
		return ValueListHelper;
	},
	/* bExport= */ true
);
