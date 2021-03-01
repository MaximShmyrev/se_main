/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// Provides helper sap.gantt.simple.GanttUtils
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Core",
	"sap/gantt/misc/Utility",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/Locale",
	"sap/m/OverflowToolbar",
	"sap/ui/core/theming/Parameters"
], function(jQuery, Core, Utility, DateFormat, Locale, OverflowToolbar, Parameters) {
	"use strict";
	var oContextCache = {};
	var GanttUtils = {

		SHAPE_ID_DATASET_KEY          : "data-sap-gantt-shape-id",
		ROW_ID_DATASET_KEY            : "data-sap-gantt-row-id",
		CONNECTABLE_DATASET_KEY       : "data-sap-gantt-connectable",
		SELECT_FOR_DATASET_KEY        : "sap-gantt-select-for",
		SHAPE_CONNECT_FOR_DATASET_KEY : "sap-gantt-shape-connect-for",
		SHAPE_CONNECT_INDICATOR_WIDTH : 10,

		/**
		 * Try to find the in-row shape instance after rendering
		 */
		shapeElementById: function(sShapeId, sGanttSvgId) {
			var oGanttSvg = jQuery.sap.domById(sGanttSvgId),
				oShapeContainer = oGanttSvg.querySelector("g.sapGanttChartShapes");

			var aNodeList = oShapeContainer.querySelectorAll("[" + GanttUtils.SHAPE_ID_DATASET_KEY + "='" + sShapeId + "']");
			var oElementNode = aNodeList[0];
			if (oElementNode) {
				return jQuery(oElementNode).control(0);
			}

			return null;
		},

		getValueX: function(oShape) {
			var nTimeX;
			var oProp = oShape.getMetadata().getProperty("x");
			if (oProp) {
				nTimeX = oShape.getProperty(oProp.name);
				if (nTimeX !== null && nTimeX !== undefined) {
					return nTimeX;
				}
			}

			var bRTL = Core.getConfiguration().getRTL(),
				vTime = bRTL ? (oShape.getEndTime() || oShape.getTime()) : oShape.getTime();

			if (vTime) {
				nTimeX = oShape.getXByTime(vTime);
			}

			if (!jQuery.isNumeric(nTimeX)) {
				jQuery.sap.log.warning("couldn't convert timestamp to x with value: " + vTime);
			}

			return nTimeX;
		},

		/**
		 * get table row by background rect element
		 * @private
		 */
		getRowInstance: function(oEvent, oTable) {
			var iRowIndex = jQuery(oEvent.target).closest("rect.sapGanttBackgroundSVGRow").data("sapUiIndex");
			if (iRowIndex != null) {
				return oTable.getRows()[iRowIndex];
			}
		},

		/**
		 * get table row from Current Shape
		 * @private
		 */
		getRowInstancefromShape: function(oShape) {
			var oRowSettings = oShape.getParentRowSettings();
			if (oRowSettings != null) {
				return oRowSettings.getParentRow();
			}
		},

		/**
		 * Creates context for measuring size of the font and then the context is put
		 * in cache for later use. Every shape used to have its own 2d context,
		 * but IE11 could not handle that. That is why the 2d context is cached
		 * once for all shapes here.
		 * @param {number} iFontSize Size of font
		 * @param {string} sFontFamily Font family
		 * @returns {CanvasRenderingContext2D} 2d context
		 * @private
		 */
		_get2dContext: function(iFontSize, sFontFamily) {
			if (!oContextCache.context) {
				/* eslint-disable sap-no-element-creation */
				oContextCache.context
					= document.createElement('canvas').getContext("2d");
				/* eslint-enable sap-no-element-creation */
			}
			if (oContextCache.fontSize !== iFontSize
				|| oContextCache.fontFamily !== sFontFamily) {
				oContextCache.context.font = iFontSize + "px " + sFontFamily;
				oContextCache.fontSize = iFontSize;
				oContextCache.fontFamily = sFontFamily;
			}
			return oContextCache.context;
		},

		/**
		 * Returns width of the shape text
		 * @param {string} sText Text in the shape
		 * @param {number} iFontSize font size
		 * @param {string} sFontFamily Font family
		 * @returns {number} width of the shape text
		 * @private
		 */
		getShapeTextWidth: function(sText, iFontSize, sFontFamily) {
			return this._get2dContext(iFontSize, sFontFamily)
				.measureText(sText).width;
		},

		getSelectedTableRowSettings: function(oTable, iSelectedIndex) {
			var aAllRows = oTable.getRows(),
				iFirstVisibleRow = oTable.getFirstVisibleRow();

			if (aAllRows.length === 0) {
				// prevent error in below
				return null;
			}
			var iFirstRowIndex = aAllRows[0].getIndex();

			var iIndex = iSelectedIndex - iFirstVisibleRow;
			if (iFirstRowIndex !== iFirstVisibleRow) {
				// Case that variableRowHeight is enabled and table scroll to the bottom
				iIndex += Math.abs(iFirstRowIndex - iFirstVisibleRow);
			}

			return aAllRows[iIndex].getAggregation("_settings");
		},

		updateGanttRows: function(oDelegator, aRowState, iIndex) {
			var oGantt = oDelegator.getParent().getParent();
			var $svg = jQuery.sap.byId(oGantt.getId() + "-svg"),
				$bgRects = $svg.find("rect.sapGanttBackgroundSVGRow");
			$bgRects.eq(iIndex).toggleClass("sapGanttBackgroundSVGRowSelected", !!aRowState[iIndex].selected);
			$bgRects.eq(iIndex).toggleClass("sapGanttBackgroundSVGRowHovered",  !!aRowState[iIndex].hovered);
		},

		/**
		 * Get shapes element with their Uids
		 *
		 * @param  {string} sContainerId        Gantt chart's dom id
		 * @param  {string[]} aShapeUid            Array of shape uid
		 * @return {object[]}                      Array of shape element
		 */
		getShapesWithUid : function (sContainerId, aShapeUid) {
			var fnElementFromShapeId = function (sShapeUid) {
				var oPart = Utility.parseUid(sShapeUid),
					sShapeId = oPart.shapeId;

				var selector = ["[id='", sContainerId, "']", " [" + GanttUtils.SHAPE_ID_DATASET_KEY + "='", sShapeId, "']"].join("");
				return jQuery(selector).control().filter(function (oElement) {
					return oElement.getShapeUid() === sShapeUid;
				})[0];

			};
			return aShapeUid.map(fnElementFromShapeId);
		},

		/**
		 * Get time formater by lower level of time axis.
		 * Keep the time unit to date if lower level of the time axis is bigger than or equal to date
		 *
		 * @param {object} oGantt  Gantt chart instance
		 *
		 * @return {object} Time formater
		 */
		getTimeFormaterBySmallInterval : function(oGantt) {
			var oAxisTimeStrategy = oGantt.getAxisTimeStrategy(),
				oSmallInterval = oAxisTimeStrategy.getTimeLineOption().smallInterval,
				oUnit = oSmallInterval.unit;

			var oCalendarType = oAxisTimeStrategy.getCalendarType(),
				oCoreLocale = oAxisTimeStrategy.getLocale() ? oAxisTimeStrategy.getLocale() :
					new Locale(Core.getConfiguration().getLanguage().toLowerCase());

			// keep the time unit to date if lower level of the time axis is bigger than or equal to date.
			var sFormat = "yyyyMMMddhhms";
			if (!(oUnit === sap.gantt.config.TimeUnit.minute || oUnit === sap.gantt.config.TimeUnit.hour)) {
				sFormat = "yyyyMMMdd";
			}

			return DateFormat.getDateTimeInstance({
				format: sFormat,
				style: oSmallInterval.style,
				calendarType: oCalendarType
			}, oSmallInterval.locale ? new Locale(oSmallInterval.locale) : oCoreLocale);
		},

		/**
		 * Resets the StrokeDasharray for the Adhoc Lines
		 * @param {sap.gantt.simple.GanttChartWithTable} oGantt
		 */
		resetStrokeDasharray : function(oGantt){
			var aSelectedLine = oGantt.getSimpleAdhocLines().find(function(x){
				return x._getSelected();
			});
			if (aSelectedLine) {
				aSelectedLine._setSelected(false);
				var headerStroke = document.getElementById(aSelectedLine._getHeaderLine().sId);
				var stroke = document.getElementById(aSelectedLine._getLine().sId);
				if (stroke && headerStroke){
					stroke.style.strokeDasharray = aSelectedLine.getStrokeDasharray();
					headerStroke.style.strokeDasharray = aSelectedLine.getStrokeDasharray();
					stroke.style.strokeWidth = aSelectedLine._getStrokeWidth();
					headerStroke.style.strokeWidth = aSelectedLine._getStrokeWidth();
				}
			}

			var aSelectedDeltaLine = oGantt.getDeltaLines().find(function (x) {
				return x._getIsSelected();
			});
			if (aSelectedDeltaLine) {
				var oChartDeltaArea = aSelectedDeltaLine._getChartDeltaArea();
				if (oChartDeltaArea) {
					var $chartdeltaArea = document.getElementById(oChartDeltaArea.sId);
					if (aSelectedDeltaLine._getEnableChartDeltaAreaHighlight() === true) {
						$chartdeltaArea.style.opacity = 0.0;
					}
				}
				var oStartLine = document.getElementById(aSelectedDeltaLine._getStartLine().sId);
				var oEndLine = document.getElementById(aSelectedDeltaLine._getEndLine().sId);
				var oHeaderStartLine = document.getElementById(
					aSelectedDeltaLine._getHeaderStartLine().sId
				);
				var oHeaderEndLine = document.getElementById(
					aSelectedDeltaLine._getHeaderEndLine().sId
				);
				var oForwardMarker = document.getElementById(
					aSelectedDeltaLine._getForwardMarker().sId
				);
				var oBackwardMarker = document.getElementById(
					aSelectedDeltaLine._getBackwardMarker().sId
				);
				var oHeaderDeltaArea = document.getElementById(
					aSelectedDeltaLine._getHeaderDeltaArea().sId
				);
				var markerStroke = Parameters.get("sapUiChartDataPointBorderColor");
				oStartLine.style.strokeDasharray = aSelectedDeltaLine.getStrokeDasharray();
				oEndLine.style.strokeDasharray = aSelectedDeltaLine.getStrokeDasharray();
				oHeaderStartLine.style.strokeDasharray = aSelectedDeltaLine.getStrokeDasharray();
				oHeaderEndLine.style.strokeDasharray = aSelectedDeltaLine.getStrokeDasharray();
				oStartLine.style.strokeWidth = aSelectedDeltaLine._getStrokeWidth();
                oEndLine.style.strokeWidth = aSelectedDeltaLine._getStrokeWidth();
                oHeaderStartLine.style.strokeWidth = aSelectedDeltaLine._getStrokeWidth();
                oHeaderEndLine.style.strokeWidth = aSelectedDeltaLine._getStrokeWidth();
				oForwardMarker.style.fillOpacity = 0;
				oBackwardMarker.style.fillOpacity = 0;
				oHeaderDeltaArea.style.opacity = 1;
				oForwardMarker.style.stroke = null;
				oBackwardMarker.style.stroke = null;
				if (aSelectedDeltaLine._getVisibleMarker() === true) {
					oForwardMarker.style.fillOpacity = 1;
					oBackwardMarker.style.fillOpacity = 1;
					oForwardMarker.style.stroke = markerStroke;
					oBackwardMarker.style.stroke = markerStroke;
				}
				aSelectedDeltaLine._setIsSelected(false);
			}
		},

		/**
		 * returns true if the adhoc lines are present for which the marker type is not none and if they are to be shown from the settings dialog
		 * @param {sap.gantt.simple.GanttChartWithTable} oGantt - Instance of Gantt Chart
		 *
		 * @returns {sap.gantt.simple.AdhocLine} returns adhoc lines are present for which the marker type is not none and if they are to be shown from the settings dialog
		 */
		adhocLinesPresentAndEnabled : function(oGantt){
			return oGantt.getSimpleAdhocLines().filter(function(oAdhocLine){return oAdhocLine.MarkerType != sap.gantt.simple.MarkerType.None; }).length > 0 && oGantt.getEnableAdhocLine();
		},

		/**
		 * Adds the toolbar considering the parameters on the gantt chart
		 * @param {object} oScope scope of the calling function
		 * @param {object} oTable table object of the Gantt Chart
		 * @param {boolean} isExportToExcel boolean to know where the function is called from
		 */
		addToolbarToTable: function (oScope, oTable, isExportToExcel){
			if (oTable.getExtension().length == 0) { //If Table.extension is not present, add a new extension and the Export button.
				var oOverFlowToolBar = new OverflowToolbar();
				if (isExportToExcel){
					oOverFlowToolBar.addContent(oScope.oExportTableToExcelButton);
				}
				oTable.addExtension(oOverFlowToolBar);
			} else {
				if (isExportToExcel){
					oTable.getExtension()[0].addContent(oScope.oExportTableToExcelButton);//Add the Export button to the existing Table.extension.
				}
			}
		},

		/**
		 * This method partitions the shapes into overlapping ranges
		 * @param {array} shapes array of shapes
		 * @param {string} startTimeProperty start time on Gantt chart
		 * @param {string} endTimeProperty end time on Gantt chart
		 * @returns {array} array of array of shapes
		 * @private
		 */
		_partitionShapesIntoOverlappingRanges: function (shapes, startTimeProperty, endTimeProperty) {
			var sGetStartTime = "get" + startTimeProperty.charAt(0).toUpperCase() + startTimeProperty.slice(1);
			var sGetEndTime = "get" + endTimeProperty.charAt(0).toUpperCase() + endTimeProperty.slice(1);

			shapes.sort(function (a, b) {
				if (a[sGetStartTime]() < b[sGetStartTime]()) { return -1; }
				if (a[sGetStartTime]() > b[sGetStartTime]()) { return 1; }
				return 0;
			});
			var fnGetMaxEnd = function (ar) {
				if (ar.length == 0) { return false; }
				ar.sort(function (a, b) {
					var sMEnd = a[sGetEndTime]();
					var sNEnd = b[sGetEndTime]();

					if (sMEnd < sNEnd) { return 1; }
					if (sMEnd > sNEnd) { return -1; }
					return 0;
				});

				return ar[0][sGetEndTime]();

			};
			var aRarray = [];
			var iIndex = 0;
			if (shapes.length > 0) {
				aRarray[iIndex] = [shapes[0]];
			}

			for (var i = 1, l = shapes.length; i < l; i++) {
				if (
					shapes[i][sGetStartTime]() >= shapes[i - 1][sGetStartTime]() &&
					shapes[i][sGetStartTime]() < fnGetMaxEnd(aRarray[iIndex])
				) {
					aRarray[iIndex].push(shapes[i]);
				} else {
					iIndex++;
					aRarray[iIndex] = [shapes[i]];
				}
			}
			return aRarray;
		},

		/**
		 * This method calculates the level of shapes based on start and end time
		 * @param {sap.gantt.simple.BaseShape} allShapes on Gantt chart
		 * @param {string} startTimeProperty start time on Gantt chart
		 * @param {string} endTimeProperty end time on Gantt chart
		 * @returns {object} oResult which contains shapes with the level assigned and maximum level of the shapes
		 */
		calculateLevelForShapes: function (allShapes, startTimeProperty, endTimeProperty) {
			var fnFlatten = function (arr) {
				return arr.reduce(function (flat, toFlatten) {
					return flat.concat(
						Array.isArray(toFlatten) ? fnFlatten(toFlatten) : toFlatten
					);
				}, []);
			};

			var aRanges = this._partitionShapesIntoOverlappingRanges(allShapes, startTimeProperty, endTimeProperty);
			var iMaxLevel = 0;
			var aRangesUpdated = aRanges.map(function (shapeGroup) {
				shapeGroup.map(function (shape, index) {
					var iLevel = index + 1;
					if (shape._setLevel) {
						shape._setLevel(iLevel);
					}
					shape._level = iLevel;

					if (iMaxLevel < iLevel) {
						iMaxLevel = iLevel;
					}
					return shape;
				});
				return shapeGroup;
			});

			var aShapes = fnFlatten(aRangesUpdated);
			var oResult = {
				shapes: aShapes,
				maxLevel: iMaxLevel
			};
			return oResult;
		},

		/**
			 * This method partitions the lines into overlapping ranges
			 * @param {array} lines array of lines
			 * @returns {array} array of array of lines
			 * @private
			 */
			_partitionLinesIntoOverlappingRanges: function (lines) {
				lines.sort(function (a, b) {
					if (a.getTimeStamp() < b.getTimeStamp()) { return -1; }
					if (a.getTimeStamp() > b.getTimeStamp()) { return 1; }
					return 0;
				});
				var fnGetMaxEnd = function (ar) {
					if (ar.length == 0) { return false; }
					ar.sort(function (a, b) {
						var sMEnd;
						if (a instanceof sap.gantt.simple.AdhocLine) {
							sMEnd = a.getTimeStamp();
						} else {
							sMEnd = a.getEndTimeStamp();
						}

						var sNEnd;
						if (b instanceof sap.gantt.simple.AdhocLine) {
							sNEnd = b.getTimeStamp();
						} else {
							sNEnd = b.getEndTimeStamp();
						}

						if (sMEnd < sNEnd) { return 1; }
						if (sMEnd > sNEnd) { return -1; }
						return 0;
					});

					if (ar[0] instanceof sap.gantt.simple.AdhocLine) {
						return ar[0].getTimeStamp();
					} else {
						return ar[0].getEndTimeStamp();
					}
				};
				var aRarray = [];
				var iIndex = 0;
				if (lines.length > 0) {
					aRarray[iIndex] = [lines[0]];
				}

				for (var i = 1, l = lines.length; i < l; i++) {
					if (
						lines[i].getTimeStamp() >= lines[i - 1].getTimeStamp() &&
						lines[i].getTimeStamp() < fnGetMaxEnd(aRarray[iIndex])
					) {
						aRarray[iIndex].push(lines[i]);
					} else {
						iIndex++;
						aRarray[iIndex] = [lines[i]];
					}
				}
				return aRarray;
			},

			/**
			 * This method calculates the level of markers for lines to be drawn on header
			 * @param {sap.gantt.simple.AdhocLine} aAdhocLines on Gantt chart
			 * @param {sap.gantt.simple.DeltaLine} aDeltaLines on Gantt chart
			 * @returns {object} oResult which contains lines with level assigned and maximum level of the lines together
			 */
			calculateLevelForMarkers: function (aAdhocLines, aDeltaLines) {
				var fnFlatten = function (arr) {
					return arr.reduce(function (flat, toFlatten) {
						return flat.concat(
							Array.isArray(toFlatten) ? fnFlatten(toFlatten) : toFlatten
						);
					}, []);
				};

				var aAllLines = aAdhocLines.concat(aDeltaLines);
				var aRanges = this._partitionLinesIntoOverlappingRanges(aAllLines);
				var iMaxLevel = 0;
				var aRangesUpdated = aRanges.map(function (subarr) {
					subarr.map(function (row, index) {
						var iLevel = index + 1;
						row._setLevel(iLevel);
						if (iMaxLevel < iLevel) {
							iMaxLevel = iLevel;
						}
						return row;
					});
					return subarr;
				});

				var aAllLinesUpd = fnFlatten(aRangesUpdated);
				var oResult = {
					adhocLines: aAllLinesUpd.filter(function (line) {
						if (sap.gantt.simple.AdhocLine) {
							return line instanceof sap.gantt.simple.AdhocLine;
						}
					}),
					deltaLines: aAllLinesUpd.filter(function (line) {
						if (sap.gantt.simple.DeltaLine) {
							return line instanceof sap.gantt.simple.DeltaLine;
						}
					}),
					maxLevel: iMaxLevel
				};
				return oResult;
			},

			/**
			 * Gets all the immediate successor shapes
			 * @param {object} oShape shape's instance
			 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Gantt's instance
			 * @returns {array} array of the successor shapes
			 */
			getShapeSuccessors: function(oShape, oGantt) {
				var aShapesToSelect = [];

				// Get successors only if chain selection is enabled for the shape
				if (oShape.getEnableChainSelection()) {
					var aVisibleRls = this._getVisibleRelationships(oGantt);
					var aAssociatedRls = aVisibleRls.filter(function(x){
						return  x.getPredecessor() === oShape.getShapeId();
					});

					aAssociatedRls.forEach(function(rel){
						var mShape = rel.getRelatedInRowShapes(oGantt.getId());
						if (mShape.successor) {
							aShapesToSelect.push(mShape.successor);
						}
					});
					aShapesToSelect = Array.from(new Set(aShapesToSelect));
				}
				return aShapesToSelect;
			},

			/**
			 * Gets all the immediate predecessor shapes
			 * @param {object} oShape shape's instance
			 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Gantt's instance
			 * @returns {array} array of the predecessor shapes
			 */
			getShapePredeccessors: function(oShape, oGantt) {
				var aShapesToSelect = [];

				// Get predecessors only if chain selection is enabled for the shape
				if (oShape.getEnableChainSelection()) {
					var aVisibleRls = this._getVisibleRelationships(oGantt);
					var aAssociatedRls = aVisibleRls.filter(function(x){
						return  x.getSuccessor() === oShape.getShapeId();
					});

					aAssociatedRls.forEach(function(rel){
						var mShape = rel.getRelatedInRowShapes(oGantt.getId());
						if (mShape.predecessor) {
							aShapesToSelect.push(mShape.predecessor);
						}
					});
					aShapesToSelect = Array.from(new Set(aShapesToSelect));
				}

				return aShapesToSelect;
			},

			/**
			 * Selects a shape along with its successors and predecessors
			 * @param {object} mParam shape's instance and event parameters
			 * @param {sap.gantt.GanttChartWithTable} oGantt GanttChart's instance
			 * @returns {array} aShapes the array of shapes which got selected
			 */
			selectAssociatedShapes: function(mParam, oGantt) {
				var oSelectedShape = mParam.shape;
				var oDragDropExtension = oGantt._getDragDropExtension();
				var bNewSelected = !oSelectedShape.getSelected();

				// Check if primary shape is selected or deselected
				if (oDragDropExtension.shapeSelectedOnMouseDown && !oDragDropExtension.initiallySelected && !oGantt.getEnableSelectAndDrag()){
					bNewSelected = oDragDropExtension.shapeSelectedOnMouseDown;
				}

				// Fetch shapes that are required to be changed
				var aShapes = [oSelectedShape];
				if (oSelectedShape.getEnableChainSelection()) {
					aShapes = this._getShapesToSelect(oSelectedShape, oGantt);
				}

				// Update them based on selected flag
				aShapes.forEach(function(shape){
					this.oSelection.updateShape(shape.getShapeUid(), {
						selected: bNewSelected,
						ctrl: true,
						draggable: shape.getDraggable(),
						time: shape.getTime(),
						endTime: shape.getEndTime()
					});
				}.bind(oGantt));

				return aShapes;
			},

			/**
			 * Gets all the immediate shapes related to the shape to be selected
			 * @param {object} oSelectedShape shape's instance
			 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Gantt's instance
			 * @returns {array} array of the successor shapes
			 * @private
			 */
			_getShapesToSelect: function(oSelectedShape, oGantt) {
				var aShapesToSelect = [oSelectedShape];
				var aVisibleRls = this._getVisibleRelationships(oGantt);

				// Getting the related first level relationships
				var aAssociatedRls = aVisibleRls.filter(function(x){
					return  x.getPredecessor() === oSelectedShape.getShapeId() || x.getSuccessor() === oSelectedShape.getShapeId();
				});

				// Extract shapes from associated relationships
				aAssociatedRls.forEach(function(rel){
					var mShape = rel.getRelatedInRowShapes(oGantt.getId());
					if (mShape.predecessor && mShape.predecessor.getSelectableInChainSelection()) {
						aShapesToSelect.push(mShape.predecessor);
					}
					if (mShape.successor && mShape.successor.getSelectableInChainSelection()) {
						aShapesToSelect.push(mShape.successor);
					}
				});

				// Remove duplicates, if any
				aShapesToSelect = Array.from(new Set(aShapesToSelect));
				return aShapesToSelect;
			},

			/**
			 * Gets all the visible relationships on the Gantt
			 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Gantt's instance
			 * @returns {array} array of the all visible relatioships on the GanttChart
			 * @private
			 */
			_getVisibleRelationships: function(oGantt){
				var aRelationships = [];
				oGantt.getTable().getRows().forEach(function(row){
					var aRls = row.getAggregation('_settings').getRelationships();
					aRelationships = aRelationships.concat(aRls);
				});
				aRelationships = Array.from(new Set(aRelationships));
				return aRelationships;
			}
	};

	return GanttUtils;

}, /* bExport= */ true);
