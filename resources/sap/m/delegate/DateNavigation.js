/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.getCore().loadLibrary("sap.ui.unified");sap.ui.define(['sap/ui/base/EventProvider','sap/ui/core/date/UniversalDate','sap/ui/unified/calendar/CalendarUtils','sap/ui/unified/calendar/CalendarDate','sap/ui/unified/library'],function(E,U,C,a,u){"use strict";var P=u.CalendarIntervalType;var D=E.extend("sap.m.delegate.DateNavigation",{constructor:function(){E.apply(this,arguments);this._unit=P.Day;this._start=new Date();this._step=1;}});D.HOURS24=1000*3600*24;D.prototype.setUnit=function(p){this._unit=p;};D.prototype.setStart=function(d){this._start=d;};D.prototype.setStep=function(s){this._step=s;};D.prototype.setCurrent=function(d){this._current=d;};D.prototype.getUnit=function(){return this._unit;};D.prototype.getStart=function(){return this._start;};D.prototype.getStep=function(){return this._step;};D.prototype.getCurrent=function(){return this._current;};D.prototype.getEnd=function(){var c=C._createUniversalUTCDate(this.getStart(),undefined,true);switch(this.getUnit()){case P.Day:case P.Week:case P.OneMonth:c.setUTCDate(c.getUTCDate()+this.getStep()-1);break;case P.Hour:c.setUTCHours(c.getUTCHours()+this.getStep()-1);break;case P.Month:c.setUTCMonth(c.getUTCMonth()+this.getStep()-1);break;default:break;}return C._createLocalDate(c,true);};D.prototype.next=function(){var n=C._createUniversalUTCDate(this.getStart(),undefined,true);var N=this.getCurrent()?C._createUniversalUTCDate(this.getCurrent(),undefined,true):C._createUniversalUTCDate(this.getStart(),undefined,true);switch(this.getUnit()){case P.Hour:N.setUTCHours(N.getUTCHours()+this.getStep());this.setCurrent(C._createLocalDate(N,true));n.setUTCHours(n.getUTCHours()+this.getStep());this.setStart(C._createLocalDate(n,true));break;case P.Week:case P.Day:N.setUTCDate(N.getUTCDate()+this.getStep());this.setCurrent(C._createLocalDate(N,true));n.setUTCDate(n.getUTCDate()+this.getStep());this.setStart(C._createLocalDate(n,true));break;case P.Month:N.setUTCMonth(N.getUTCMonth()+this.getStep());this.setCurrent(C._createLocalDate(N,true));n.setUTCMonth(n.getUTCMonth()+this.getStep());this.setStart(C._createLocalDate(n,true));break;case P.OneMonth:N.setUTCMonth(N.getUTCMonth()+1,1);this.setCurrent(C._createLocalDate(N,true));n.setUTCMonth(n.getUTCMonth()+1,1);this.setStart(C._createLocalDate(n,true));break;default:break;}};D.prototype.previous=function(){var n=C._createUniversalUTCDate(this.getStart(),undefined,true);var N=this.getCurrent()?C._createUniversalUTCDate(this.getCurrent(),undefined,true):C._createUniversalUTCDate(this.getStart(),undefined,true);switch(this.getUnit()){case P.Hour:N.setUTCHours(N.getUTCHours()-this.getStep());this.setCurrent(C._createLocalDate(N,true));n.setUTCHours(n.getUTCHours()-this.getStep());this.setStart(C._createLocalDate(n,true));break;case P.Week:case P.Day:N.setUTCDate(N.getUTCDate()-this.getStep());this.setCurrent(C._createLocalDate(N,true));n.setUTCDate(n.getUTCDate()-this.getStep());this.setStart(C._createLocalDate(n,true));break;case P.Month:N.setUTCMonth(N.getUTCMonth()-this.getStep());this.setCurrent(C._createLocalDate(N,true));n.setUTCMonth(n.getUTCMonth()-this.getStep());this.setStart(C._createLocalDate(n,true));break;case P.OneMonth:N.setUTCMonth(N.getUTCMonth()-1,1);this.setCurrent(C._createLocalDate(N,true));n.setUTCMonth(n.getUTCMonth()-1,1);this.setStart(C._createLocalDate(n,true));break;default:break;}};D.prototype.toDate=function(t){var n,c,h,N=C._createUniversalUTCDate(t,undefined,true),o=C._createUTCDate(t,true);this.setCurrent(t);switch(this.getUnit()){case P.OneMonth:if(C.monthsDiffer(this.getStart(),t)){var f=C.getFirstDateOfMonth(o);this.setStart(C._createLocalDate(f,true));}break;case P.Day:c=C._createUniversalUTCDate(this.getStart(),undefined,true);c.setUTCDate(c.getUTCDate()+this.getStep());if(t.valueOf()>=c.valueOf()){h=1+Math.ceil((t.valueOf()-c.valueOf())/(D.HOURS24));n=C._createUniversalUTCDate(this.getStart(),undefined,true);n.setUTCDate(n.getUTCDate()+h);this.setStart(C._createLocalDate(n,true));}else if(t.valueOf()<this.getStart().valueOf()){n=C._createUniversalUTCDate(t,undefined,true);this.setStart(C._createLocalDate(n,true));}break;case P.Month:c=C._createUniversalUTCDate(this.getStart());c.setUTCMonth(c.getUTCMonth()+this.getStep());if(N.getTime()>=c.valueOf()){h=1+C._monthsBetween(t,C._createLocalDate(c,true));n=C._createUniversalUTCDate(this.getStart(),undefined,true);n.setUTCMonth(n.getUTCMonth()+h);this.setStart(C._createLocalDate(n,true));}else if(t.valueOf()<this.getStart().valueOf()){n=C._createUniversalUTCDate(t,undefined,true);this.setStart(C._createLocalDate(n,true));}break;case P.Week:var T=C.getFirstDateOfWeek(o);if(this.getStart().valueOf()!==T.valueOf()){this.setStart(C._createLocalDate(T,true));}break;case P.Hour:c=this.getEnd(this.getStart());var b=C._createUniversalUTCDate(c,undefined,true);if(N.getTime()<C._createUniversalUTCDate(this.getStart(),undefined,true).getTime()||N.getTime()>b.getTime()){this.setStart(t);}break;default:break;}};return D;});