/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/ui/core/LocaleData','sap/ui/core/delegate/ItemNavigation','sap/ui/unified/calendar/CalendarUtils','sap/ui/unified/calendar/CalendarDate','sap/ui/unified/library','sap/ui/core/format/DateFormat','sap/ui/core/library','sap/ui/core/Locale',"./MonthsRowRenderer","sap/ui/dom/containsOrEquals","sap/ui/thirdparty/jquery","sap/ui/unified/DateRange"],function(C,L,I,a,c,l,D,d,e,M,f,q,g){"use strict";var h=d.CalendarType;var j=C.extend("sap.ui.unified.calendar.MonthsRow",{metadata:{library:"sap.ui.unified",properties:{date:{type:"object",group:"Data"},startDate:{type:"object",group:"Data"},months:{type:"int",group:"Appearance",defaultValue:12},intervalSelection:{type:"boolean",group:"Behavior",defaultValue:false},singleSelection:{type:"boolean",group:"Behavior",defaultValue:true},showHeader:{type:"boolean",group:"Appearance",defaultValue:false}},aggregations:{selectedDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"selectedDate"},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.ui.unified.CalendarLegend",multiple:false}},events:{select:{},focus:{parameters:{date:{type:"object"},notVisible:{type:"boolean"}}}}}});j.prototype.init=function(){this._oFormatYyyymm=D.getInstance({pattern:"yyyyMMdd",calendarType:h.Gregorian});this._oFormatLong=D.getInstance({pattern:"MMMM y"});this._mouseMoveProxy=q.proxy(this._handleMouseMove,this);this._rb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");};j.prototype.exit=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation;}if(this._sInvalidateMonths){clearTimeout(this._sInvalidateMonths);}};j.prototype.onAfterRendering=function(){_.call(this);w.call(this);};j.prototype.onsapfocusleave=function(E){if(!E.relatedControlId||!f(this.getDomRef(),sap.ui.getCore().byId(E.relatedControlId).getFocusDomRef())){if(this._bMouseMove){z.call(this,true);u.call(this,this._getDate());this._bMoveChange=false;this._bMousedownChange=false;v.call(this);}if(this._bMousedownChange){this._bMousedownChange=false;v.call(this);}}};j.prototype.invalidate=function(O){if(!this._bDateRangeChanged&&(!O||!(O instanceof g))){C.prototype.invalidate.apply(this,arguments);}else if(this.getDomRef()&&!this._sInvalidateMonths){if(this._bInvalidateSync){x.call(this);}else{this._sInvalidateMonths=setTimeout(x.bind(this),0);}}};j.prototype.removeAllSelectedDates=function(){this._bDateRangeChanged=true;var R=this.removeAllAggregation("selectedDates");return R;};j.prototype.destroySelectedDates=function(){this._bDateRangeChanged=true;var b=this.destroyAggregation("selectedDates");return b;};j.prototype.removeAllSpecialDates=function(){this._bDateRangeChanged=true;var R=this.removeAllAggregation("specialDates");return R;};j.prototype.destroySpecialDates=function(){this._bDateRangeChanged=true;var b=this.destroyAggregation("specialDates");return b;};j.prototype.setDate=function(b){if(b){var i=c.fromLocalJSDate(b);this._oDate=i;p.call(this,i,false);}return this.setProperty("date",b);};j.prototype._getDate=function(){if(!this._oDate){this._oDate=new c();}return this._oDate;};j.prototype.setStartDate=function(S){a._checkJSDateObject(S);var b,Y,O;Y=S.getFullYear();a._checkYearInValidRange(Y);b=c.fromLocalJSDate(S);this.setProperty("startDate",S,true);this._oStartDate=b;this._oStartDate.setDate(1);if(this.getDomRef()){O=this._getDate().toLocalJSDate();this._bNoRangeCheck=true;this.displayDate(S);this._bNoRangeCheck=false;if(O&&this.checkDateFocusable(O)){this.setDate(O);}}return this;};j.prototype._getStartDate=function(){if(!this._oStartDate){this._oStartDate=new c();this._oStartDate.setDate(1);}return this._oStartDate;};j.prototype.displayDate=function(b){p.call(this,c.fromLocalJSDate(b),true);return this;};j.prototype._getLocale=function(){var P=this.getParent();if(P&&P.getLocale){return P.getLocale();}else if(!this._sLocale){this._sLocale=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString();}return this._sLocale;};j.prototype._getLocaleData=function(){var P=this.getParent();if(P&&P._getLocaleData){return P._getLocaleData();}else if(!this._oLocaleData){var b=this._getLocale();var i=new e(b);this._oLocaleData=L.getInstance(i);}return this._oLocaleData;};j.prototype._getFormatLong=function(){var b=this._getLocale();if(this._oFormatLong.oLocale.toString()!=b){var i=new e(b);this._oFormatLong=D.getInstance({style:"long"},i);}return this._oFormatLong;};j.prototype.getIntervalSelection=function(){var P=this.getParent();if(P&&P.getIntervalSelection){return P.getIntervalSelection();}else{return this.getProperty("intervalSelection");}};j.prototype.getSingleSelection=function(){var P=this.getParent();if(P&&P.getSingleSelection){return P.getSingleSelection();}else{return this.getProperty("singleSelection");}};j.prototype.getSelectedDates=function(){var P=this.getParent();if(P&&P.getSelectedDates){return P.getSelectedDates();}else{return this.getAggregation("selectedDates",[]);}};j.prototype.getSpecialDates=function(){var P=this.getParent();if(P&&P.getSpecialDates){return P.getSpecialDates();}else{return this.getAggregation("specialDates",[]);}};j.prototype._getShowHeader=function(){var P=this.getParent();if(P&&P._getShowItemHeader){return P._getShowItemHeader();}else{return this.getProperty("showHeader");}};j.prototype.getAriaLabelledBy=function(){var P=this.getParent();if(P&&P.getAriaLabelledBy){return P.getAriaLabelledBy();}else{return this.getAssociation("ariaLabelledBy",[]);}};j.prototype._setLegendControlOrigin=function(b){this._oLegendControlOrigin=b;};j.prototype.getLegend=function(){var P=this.getParent();if(this._oLegendControlOrigin){return this._oLegendControlOrigin.getLegend();}if(P&&P.getLegend){return P.getLegend();}else{return this.getAssociation("ariaLabelledBy",[]);}};j.prototype._setAriaRole=function(R){this._ariaRole=R;return this;};j.prototype._getAriaRole=function(){return this._ariaRole?this._ariaRole:"gridcell";};j.prototype._checkDateSelected=function(b){var R,S,E,T,A=0,B=0,F=0,i,G,H;a._checkCalendarDate(b);G=this.getSelectedDates();H=new c(b);H.setDate(1);T=H.toUTCJSDate().getTime();for(i=0;i<G.length;i++){R=G[i];S=R.getStartDate();A=0;if(S){S=c.fromLocalJSDate(S);S.setDate(1);A=S.toUTCJSDate().getTime();}E=R.getEndDate();B=0;if(E){E=c.fromLocalJSDate(E);E.setDate(1);B=E.toUTCJSDate().getTime();}if(T==A&&!E){F=1;break;}else if(T==A&&E){F=2;if(E&&T==B){F=5;}break;}else if(E&&T==B){F=3;break;}else if(E&&T>A&&T<B){F=4;break;}if(this.getSingleSelection()){break;}}return F;};j.prototype._getDateType=function(b){a._checkCalendarDate(b);var T,R,i,S,A=0,E,B=0,F,G=this.getSpecialDates(),H=new c(b);H.setDate(1);F=H.toUTCJSDate().getTime();for(i=0;i<G.length;i++){R=G[i];S=R.getStartDate();A=0;if(S){S=c.fromLocalJSDate(S);S.setDate(1);A=S.toUTCJSDate().getTime();}E=R.getEndDate();B=0;if(E){E=c.fromLocalJSDate(E);E.setDate(a._daysInMonth(E));B=E.toUTCJSDate().getTime();}if((F==A&&!E)||(F>=A&&F<=B)){T={type:R.getType(),tooltip:R.getTooltip_AsString()};break;}}return T;};j.prototype._checkMonthEnabled=function(b){a._checkCalendarDate(b);var P=this.getParent();if(P&&P._oMinDate&&P._oMaxDate){if(a._isOutside(b,P._oMinDate,P._oMaxDate)){return false;}}return true;};j.prototype._handleMouseMove=function(E){if(!this.$().is(":visible")){z.call(this,true);}var T=q(E.target);if(T.hasClass("sapUiCalItemText")){T=T.parent();}if(T.hasClass("sapUiCalItem")){var O=this._getDate();var F=c.fromLocalJSDate(this._oFormatYyyymm.parse(T.attr("data-sap-month")));F.setDate(1);if(!F.isSame(O)){this.setDate(F.toLocalJSDate());u.call(this,F,true);this._bMoveChange=true;}}};j.prototype.onmouseup=function(E){if(this._bMouseMove){z.call(this,true);var F=this._getDate();var b=this._oItemNavigation.getItemDomRefs();for(var i=0;i<b.length;i++){var $=q(b[i]);if($.attr("data-sap-month")==this._oFormatYyyymm.format(F.toUTCJSDate(),true)){$.trigger("focus");break;}}if(this._bMoveChange){var T=q(E.target);if(T.hasClass("sapUiCalItemText")){T=T.parent();}if(T.hasClass("sapUiCalItem")){F=c.fromLocalJSDate(this._oFormatYyyymm.parse(T.attr("data-sap-month")));F.setDate(1);}u.call(this,F);this._bMoveChange=false;this._bMousedownChange=false;v.call(this);}}if(this._bMousedownChange){this._bMousedownChange=false;v.call(this);}};j.prototype.onsapselect=function(E){var S=u.call(this,this._getDate());if(S){v.call(this);}E.stopPropagation();E.preventDefault();};j.prototype.onsapselectmodifiers=function(E){this.onsapselect(E);};j.prototype.onsappageupmodifiers=function(E){var F=new c(this._getDate());var Y=F.getYear();if(E.metaKey||E.ctrlKey){F.setYear(Y-10);}else{var i=this.getMonths();if(i<=12){F.setYear(Y-1);}else{F.setMonth(F.getMonth()-i);}}this.fireFocus({date:F.toLocalJSDate(),notVisible:true});E.preventDefault();};j.prototype.onsappagedownmodifiers=function(E){var F=new c(this._getDate());var Y=F.getYear();if(E.metaKey||E.ctrlKey){F.setYear(Y+10);}else{var i=this.getMonths();if(i<=12){F.setYear(Y+1);}else{F.setMonth(F.getMonth()+i);}}this.fireFocus({date:F.toLocalJSDate(),notVisible:true});E.preventDefault();};j.prototype.onThemeChanged=function(){if(this._bNoThemeChange){return;}this._bNamesLengthChecked=undefined;this._bLongWeekDays=undefined;var b=this._getLocaleData();var A=b.getMonthsStandAlone("wide");var B=this.$("months").children();var E=this._getStartDate().getMonth();for(var i=0;i<B.length;i++){var $=q(q(B[i]).children(".sapUiCalItemText"));$.text(A[(i+E)%12]);}w.call(this);};j.prototype.checkDateFocusable=function(b){a._checkJSDateObject(b);if(this._bNoRangeCheck){return false;}var S=this._getStartDate();var E=new c(S);E.setDate(1);E.setMonth(E.getMonth()+this.getMonths());var i=c.fromLocalJSDate(b);return i.isSameOrAfter(S)&&i.isBefore(E);};j.prototype.applyFocusInfo=function(i){this._oItemNavigation.focusItem(this._oItemNavigation.getFocusedIndex());return this;};function _(){var b=this._getDate();var Y=this._oFormatYyyymm.format(b.toUTCJSDate(),true);var A=0;var R=this.$("months").get(0);var B=this.$("months").children(".sapUiCalItem");for(var i=0;i<B.length;i++){var $=q(B[i]);if($.attr("data-sap-month")===Y){A=i;break;}}if(!this._oItemNavigation){this._oItemNavigation=new I();this._oItemNavigation.attachEvent(I.Events.AfterFocus,k,this);this._oItemNavigation.attachEvent(I.Events.FocusAgain,m,this);this._oItemNavigation.attachEvent(I.Events.BorderReached,n,this);this.addDelegate(this._oItemNavigation);this._oItemNavigation.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"],saphome:["alt"],sapend:["alt"]});this._oItemNavigation.setCycling(false);this._oItemNavigation.setColumns(1,true);}this._oItemNavigation.setRootDomRef(R);this._oItemNavigation.setItemDomRefs(B);this._oItemNavigation.setFocusedIndex(A);this._oItemNavigation.setPageSize(B.length);}function k(b){var i=b.getParameter("index");var E=b.getParameter("event");if(!E){return;}var O=this._getDate();var F=new c(O);var A=this._oItemNavigation.getItemDomRefs();var $=q(A[i]);F=c.fromLocalJSDate(this._oFormatYyyymm.parse($.attr("data-sap-month")));F.setDate(1);this.setDate(F.toLocalJSDate());this.fireFocus({date:F.toLocalJSDate(),notVisible:false});if(E.type=="mousedown"){o.call(this,E,F,i);}}function m(b){var i=b.getParameter("index");var E=b.getParameter("event");if(!E){return;}if(E.type=="mousedown"){var F=this._getDate();o.call(this,E,F,i);}}function n(b){var E=b.getParameter("event");var i=this.getMonths();var O=this._getDate();var F=new c(O);if(E.type){switch(E.type){case"sapnext":case"sapnextmodifiers":F.setMonth(F.getMonth()+1);break;case"sapprevious":case"sappreviousmodifiers":F.setMonth(F.getMonth()-1);break;case"sappagedown":F.setMonth(F.getMonth()+i);break;case"sappageup":F.setMonth(F.getMonth()-i);break;default:break;}this.fireFocus({date:F.toLocalJSDate(),notVisible:true});}}function o(E,F,i){if(E.button){return;}var S=u.call(this,F);if(S){this._bMousedownChange=true;}if(this._bMouseMove){z.call(this,true);this._bMoveChange=false;}else if(S&&this.getIntervalSelection()&&this.$().is(":visible")){y.call(this,true);}E.preventDefault();E.setMark("cancelAutoClose");}function p(b,N){a._checkCalendarDate(b);var Y=b.getYear();a._checkYearInValidRange(Y);var F=true;if(!this.getDate()||!b.isSame(c.fromLocalJSDate(this.getDate()))){var i=new c(b);i.setDate(1);F=this.checkDateFocusable(b.toLocalJSDate());if(!this._bNoRangeCheck&&!F){throw new Error("Date must be in visible date range; "+this);}this.setProperty("date",b.toLocalJSDate());this._oDate=i;}if(this.getDomRef()){if(F){r.call(this,this._oDate,N);}else{s.call(this,N);}}}function r(b,N){var Y=this._oFormatYyyymm.format(b.toUTCJSDate(),true);var A=this._oItemNavigation.getItemDomRefs();var $;for(var i=0;i<A.length;i++){$=q(A[i]);if($.attr("data-sap-month")==Y){if(document.activeElement!=A[i]){if(N){this._oItemNavigation.setFocusedIndex(i);}else{this._oItemNavigation.focusItem(i);}}break;}}}function s(N){var b=this._getStartDate();var $=this.$("months");if($.length>0){var R=sap.ui.getCore().createRenderManager();this.getRenderer().renderMonths(R,this,b);R.flush($[0]);R.destroy();}t.call(this);_.call(this);if(!N){this._oItemNavigation.focusItem(this._oItemNavigation.getFocusedIndex());}}function t(){var S=this._getStartDate();if(this._getShowHeader()){var $=this.$("Head");if($.length>0){var b=this._getLocaleData();var R=sap.ui.getCore().createRenderManager();this.getRenderer().renderHeaderLine(R,this,b,S);R.flush($[0]);R.destroy();}}}function u(b,A){if(!this._checkMonthEnabled(b)){return false;}var S=this.getSelectedDates();var B;var i=0;var P=this.getParent();var E=this;var F;if(P&&P.getSelectedDates){E=P;}if(this.getSingleSelection()){if(S.length>0){B=S[0];F=B.getStartDate();if(F){F=c.fromLocalJSDate(F);F.setDate(1);}}else{B=new g();E.addAggregation("selectedDates",B);}if(this.getIntervalSelection()&&(!B.getEndDate()||A)&&F){var G;if(b.isBefore(F)){G=F;F=b;if(!A){B.setProperty("startDate",F.toLocalJSDate());B.setProperty("endDate",G.toLocalJSDate());}}else if(b.isSameOrAfter(F)){G=b;if(!A){B.setProperty("endDate",G.toLocalJSDate());}}}else{B.setProperty("startDate",b.toLocalJSDate());B.setProperty("endDate",undefined);}}else{if(this.getIntervalSelection()){throw new Error("Calender don't support multiple interval selection");}else{var H=this._checkDateSelected(b);if(H>0){for(i=0;i<S.length;i++){F=S[i].getStartDate();if(F){F=c.fromLocalJSDate(F);F.setDate(1);if(b.isSame(F)){E.removeAggregation("selectedDates",i);break;}}}}else{B=new g({startDate:b.toLocalJSDate()});E.addAggregation("selectedDates",B);}}}return true;}function v(){if(this._bMouseMove){z.call(this,true);}this.fireSelect();}function w(){if(!this._bNamesLengthChecked){var i=0;var A=this.$("months").children();var T=false;var B=this.getMonths();var E=Math.ceil(12/B);var F=0;var G=this._getLocaleData();var H=G.getMonthsStandAlone("wide");var $;for(var b=0;b<E;b++){if(B<12){for(i=0;i<A.length;i++){$=q(q(A[i]).children(".sapUiCalItemText"));$.text(H[(i+F)%12]);}F=F+B;if(F>11){F=11;}}for(i=0;i<A.length;i++){var J=A[i];if(Math.abs(J.clientWidth-J.scrollWidth)>1){T=true;break;}}if(T){break;}}if(B<12){F=this._getStartDate().getMonth();for(i=0;i<A.length;i++){$=q(q(A[i]).children(".sapUiCalItemText"));$.text(H[(i+F)%12]);}}if(T){this._bLongMonth=false;var K=G.getMonthsStandAlone("abbreviated");F=this._getStartDate().getMonth();for(i=0;i<A.length;i++){$=q(q(A[i]).children(".sapUiCalItemText"));$.text(K[(i+F)%12]);}}else{this._bLongMonth=true;}this._bNamesLengthChecked=true;}}function x(){this._sInvalidateMonths=undefined;s.call(this,this._bNoFocus);this._bDateRangeChanged=undefined;this._bNoFocus=undefined;}function y(){q(window.document).on('mousemove',this._mouseMoveProxy);this._bMouseMove=true;}function z(){q(window.document).off('mousemove',this._mouseMoveProxy);this._bMouseMove=undefined;}return j;});
