/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object"],function(O){"use strict";return O.extend("sap.feedback.ui.flpplugin.data.PushContextData",{_sSourceId:null,_sSystemEventTimestamp:null,_sTargetId:null,constructor:function(s,S,t){this._sSourceId=s;this._sSystemEventTimestamp=S;this._sTargetId=t;},getSourceId:function(){return this._sSourceId;},getSystemEventTimestamp:function(){return this._sSystemEventTimestamp;},getTargetId:function(){return this._sTargetId;}});});
