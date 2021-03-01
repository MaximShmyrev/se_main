// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/performance/trace/FESR","sap/ushell/utils/clone","sap/base/Log","sap/ushell/performance/ShellAnalytics"],function(F,c,U,S){"use strict";var a={HOME_INITIAL:"FLP@LOAD",FINDER_INITIAL:"FLP@LOAD_FINDER",APP_INITIAL:"FLP@DEEP_LINK",NAVIGATION:"NAVIGATION"};var I={APP_START:1,STEP_IN_APP:2,UNKNOWN:3};var f={_fnOriginalOnBeforeCreated:null,_lastTrackedRecord:null,init:function(){if(F.getActive()){S.enable();this._fnOriginalOnBeforeCreated=F.onBeforeCreated;F.onBeforeCreated=this._onBeforeCreatedHandler.bind(this);}},reset:function(){F.onBeforeCreated=this._fnOriginalOnBeforeCreated;S.disable();this._setLastTrackedRecord(null);},_getPerformanceEntries:function(e){return performance.getEntriesByName(e);},_getLastTrackedApplicationId:function(){var C=S.getCurrentApplication();if(C){return C.id;}return null;},_getLastTrackedRecord:function(){return this._lastTrackedRecord;},_setLastTrackedRecord:function(n){this._lastTrackedRecord=n;},_onBeforeCreatedHandler:function(u,o){var d=this._detectScenario(u,o),A=this._getLastTrackedApplicationId();if(A){u.appNameShort=A;}if(!d.scenario){return u;}return this._enhanceRecord(d.scenario,u,d.relatedEvent);},_detectScenario:function(u,o){function b(s,e){var r={scenario:s};if(e){r.relatedEvent=e;}return r;}if(u.stepName==="undetermined_startup"){var l=S.getLastClosedRecord();this._setLastTrackedRecord(l);switch(u.appNameLong){case"sap.ushell.components.homepage":return b(a.HOME_INITIAL);case"sap.ushell.components.pages":return b(a.HOME_INITIAL);case"sap.ushell.components.appfinder":return b(a.FINDER_INITIAL);default:break;}return b(a.APP_INITIAL,l);}var L=this._getLastTrackedRecord(),n=S.getNextNavigationRecords(L);if(n.length===1){var N=n[0];if((N&&L&&!N.isEqual(L))||(!L&&N)){this._setLastTrackedRecord(N);return b(a.NAVIGATION,N);}}else if(n.length>1){this._setLastTrackedRecord(n.pop());return b(a.NAVIGATION,n[0]);}return b(null);},_enhanceRecord:function(d,i,r){switch(d){case a.HOME_INITIAL:return this._enhanceInitialStart(i,d,"FLP-TTI-Homepage");case a.FINDER_INITIAL:return this._enhanceInitialStart(i,d,"FLP-TTI-AppFinder");case a.APP_INITIAL:return this._enhanceInitialAppStart(i,d,r||{});case a.NAVIGATION:return this._enhanceNavigationRecord(i,r||{});default:break;}U.warning("Unknown scenario at the end of execution, unnecessary code executed",null,"sap.ushell.performance.FesrEnhancer");return i;},_enhanceInitialStart:function(i,s,p){var m,e=c(i);e.stepName=s;e.interactionType=I.APP_START;if(p){m=this._getPerformanceEntries(p)[0];if(m){e.timeToInteractive=m.startTime;return e;}U.warning("Scenario '"+s+"' detected but expected performance mark '"+p+"' does not exist",null,"sap.ushell.performance.FesrEnhancer");}return e;},_enhanceNavigationRecord:function(i,r){var e=c(i);e.stepName=r.step||i.stepName;e.appNameShort=r.targetApplication||"";if(r.applicationType==="UI5"){e.interactionType=I.APP_START;}if(e.stepName==="FLP@LOAD"){var m=this._getPerformanceEntries("FLP-TTI-Homepage")[0];if(m){if(m.startTime>r.getTimeStart()){e.timeToInteractive=m.startTime-r.getTimeStart();}}}return e;},_enhanceInitialAppStart:function(i,s,r){var e=c(i);e.stepName=s;e.appNameShort=i.appNameShort;if(r.applicationType==="UI5"){e.interactionType=I.APP_START;}else{e.interactionType=I.STEP_IN_APP;}return e;}};return f;},true);
