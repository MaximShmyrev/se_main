/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/events/KeyCodes','sap/ui/thirdparty/jquery'],function(K,q){"use strict";var P={};function c(e,C,a,s){return e.shiftKey==s&&e.altKey==a&&g(e)==C;}function h(e){return e.shiftKey||e.altKey||g(e);}function g(e){return!!(e.metaKey||e.ctrlKey);}P.events={sapdown:{sName:"sapdown",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="ArrowDown"||e.key==="Down"):e.keyCode==K.ARROW_DOWN)&&!h(e);}},sapdownmodifiers:{sName:"sapdownmodifiers",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="ArrowDown"||e.key==="Down"):e.keyCode==K.ARROW_DOWN)&&h(e);}},sapshow:{sName:"sapshow",aTypes:["keydown"],fnCheck:function(e){if(e.key){return(e.key==="F4"&&!h(e))||((e.key==="ArrowDown"||e.key==="Down")&&c(e,false,true,false));}return(e.keyCode==K.F4&&!h(e))||(e.keyCode==K.ARROW_DOWN&&c(e,false,true,false));}},sapup:{sName:"sapup",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="ArrowUp"||e.key==="Up"):e.keyCode==K.ARROW_UP)&&!h(e);}},sapupmodifiers:{sName:"sapupmodifiers",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="ArrowUp"||e.key==="Up"):e.keyCode==K.ARROW_UP)&&h(e);}},saphide:{sName:"saphide",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="ArrowUp"||e.key==="Up"):e.keyCode==K.ARROW_UP)&&c(e,false,true,false);}},sapleft:{sName:"sapleft",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="ArrowLeft"||e.key==="Left"):e.keyCode==K.ARROW_LEFT)&&!h(e);}},sapleftmodifiers:{sName:"sapleftmodifiers",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="ArrowLeft"||e.key==="Left"):e.keyCode==K.ARROW_LEFT)&&h(e);}},sapright:{sName:"sapright",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="ArrowRight"||e.key==="Right"):e.keyCode==K.ARROW_RIGHT)&&!h(e);}},saprightmodifiers:{sName:"saprightmodifiers",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="ArrowRight"||e.key==="Right"):e.keyCode==K.ARROW_RIGHT)&&h(e);}},saphome:{sName:"saphome",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="Home":e.keyCode==K.HOME)&&!h(e);}},saphomemodifiers:{sName:"saphomemodifiers",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="Home":e.keyCode==K.HOME)&&h(e);}},saptop:{sName:"saptop",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="Home":e.keyCode==K.HOME)&&c(e,true,false,false);}},sapend:{sName:"sapend",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="End":e.keyCode==K.END)&&!h(e);}},sapendmodifiers:{sName:"sapendmodifiers",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="End":e.keyCode==K.END)&&h(e);}},sapbottom:{sName:"sapbottom",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="End":e.keyCode==K.END)&&c(e,true,false,false);}},sappageup:{sName:"sappageup",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="PageUp":e.keyCode==K.PAGE_UP)&&!h(e);}},sappageupmodifiers:{sName:"sappageupmodifiers",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="PageUp":e.keyCode==K.PAGE_UP)&&h(e);}},sappagedown:{sName:"sappagedown",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="PageDown":e.keyCode==K.PAGE_DOWN)&&!h(e);}},sappagedownmodifiers:{sName:"sappagedownmodifiers",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="PageDown":e.keyCode==K.PAGE_DOWN)&&h(e);}},sapselect:{sName:"sapselect",aTypes:["keydown"],fnCheck:function(e){if(e.key){return(e.key==="Enter"||e.key==="Spacebar"||e.key===" ")&&!h(e);}return(e.keyCode==K.ENTER||e.keyCode==K.SPACE)&&!h(e);}},sapselectmodifiers:{sName:"sapselectmodifiers",aTypes:["keydown"],fnCheck:function(e){if(e.key){return(e.key==="Enter"||e.key==="Spacebar"||e.key===" ")&&h(e);}return(e.keyCode==K.ENTER||e.keyCode==K.SPACE)&&h(e);}},sapspace:{sName:"sapspace",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="Spacebar"||e.key===" "):e.keyCode==K.SPACE)&&!h(e);}},sapspacemodifiers:{sName:"sapspacemodifiers",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="Spacebar"||e.key===" "):e.keyCode==K.SPACE)&&h(e);}},sapenter:{sName:"sapenter",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="Enter":e.keyCode==K.ENTER)&&!h(e);}},sapentermodifiers:{sName:"sapentermodifiers",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="Enter":e.keyCode==K.ENTER)&&h(e);}},sapbackspace:{sName:"sapbackspace",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="Backspace":e.keyCode==K.BACKSPACE)&&!h(e);}},sapbackspacemodifiers:{sName:"sapbackspacemodifiers",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="Backspace":e.keyCode==K.BACKSPACE)&&h(e);}},sapdelete:{sName:"sapdelete",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="Delete"||e.key==="Del":e.keyCode==K.DELETE)&&!h(e);}},sapdeletemodifiers:{sName:"sapdeletemodifiers",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="Delete"||e.key==="Del":e.keyCode==K.DELETE)&&h(e);}},sapexpand:{sName:"sapexpand",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="+"||e.key==="Add")&&e.location==="NUMPAD":e.keyCode==K.NUMPAD_PLUS)&&!h(e);}},sapexpandmodifiers:{sName:"sapexpandmodifiers",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="+"||e.key==="Add")&&e.location==="NUMPAD":e.keyCode==K.NUMPAD_PLUS)&&h(e);}},sapcollapse:{sName:"sapcollapse",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="-"||e.key==="Subtract")&&e.location==="NUMPAD":e.keyCode==K.NUMPAD_MINUS)&&!h(e);}},sapcollapsemodifiers:{sName:"sapcollapsemodifiers",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="-"||e.key==="Subtract")&&e.location==="NUMPAD":e.keyCode==K.NUMPAD_MINUS)&&h(e);}},sapcollapseall:{sName:"sapcollapseall",aTypes:["keydown"],fnCheck:function(e){return(e.key?(e.key==="*"||e.key==="Multiply")&&e.location==="NUMPAD":e.keyCode==K.NUMPAD_ASTERISK)&&!h(e);}},sapescape:{sName:"sapescape",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="Escape"||e.key==="Esc":e.keyCode==K.ESCAPE)&&!h(e);}},saptabnext:{sName:"saptabnext",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="Tab":e.keyCode==K.TAB)&&!h(e);}},saptabprevious:{sName:"saptabprevious",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="Tab":e.keyCode==K.TAB)&&c(e,false,false,true);}},sapskipforward:{sName:"sapskipforward",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="F6":e.keyCode==K.F6)&&!h(e);}},sapskipback:{sName:"sapskipback",aTypes:["keydown"],fnCheck:function(e){return(e.key?e.key==="F6":e.keyCode==K.F6)&&c(e,false,false,true);}},sapdecrease:{sName:"sapdecrease",aTypes:["keydown"],fnCheck:function(e){var r=sap.ui.getCore().getConfiguration().getRTL();if(e.key){if(r){return(e.key==="ArrowRight"||e.key==="Right"||e.key==="ArrowDown"||e.key==="Down")&&!h(e);}else{return(e.key==="ArrowLeft"||e.key==="Left"||e.key==="ArrowDown"||e.key==="Down")&&!h(e);}}var p=r?K.ARROW_RIGHT:K.ARROW_LEFT;return(e.keyCode==p||e.keyCode==K.ARROW_DOWN)&&!h(e);}},sapminus:{sName:"sapminus",aTypes:["keypress"],fnCheck:function(e){return(e.key?(e.key==='-'||e.key==='Subtract'):String.fromCharCode(e.which)=='-');}},sapdecreasemodifiers:{sName:"sapdecreasemodifiers",aTypes:["keydown"],fnCheck:function(e){var r=sap.ui.getCore().getConfiguration().getRTL();if(e.key){if(r){return(e.key==="ArrowRight"||e.key==="Right"||e.key==="ArrowDown"||e.key==="Down")&&h(e);}else{return(e.key==="ArrowLeft"||e.key==="Left"||e.key==="ArrowDown"||e.key==="Down")&&h(e);}}var p=r?K.ARROW_RIGHT:K.ARROW_LEFT;return(e.keyCode==p||e.keyCode==K.ARROW_DOWN)&&h(e);}},sapincrease:{sName:"sapincrease",aTypes:["keydown"],fnCheck:function(e){var r=sap.ui.getCore().getConfiguration().getRTL();var n;if(e.key){if(r){return(e.key==="ArrowLeft"||e.key==="Left"||e.key==="ArrowUp"||e.key==="Up")&&!h(e);}else{return(e.key==="ArrowRight"||e.key==="Right"||e.key==="ArrowUp"||e.key==="Up")&&!h(e);}}n=r?K.ARROW_LEFT:K.ARROW_RIGHT;return(e.keyCode==n||e.keyCode==K.ARROW_UP)&&!h(e);}},sapplus:{sName:"sapplus",aTypes:["keypress"],fnCheck:function(e){return(e.key?(e.key==='+'||e.key==='Add'):String.fromCharCode(e.which)=='+');}},sapincreasemodifiers:{sName:"sapincreasemodifiers",aTypes:["keydown"],fnCheck:function(e){var r=sap.ui.getCore().getConfiguration().getRTL();if(e.key){if(r){return(e.key==="ArrowLeft"||e.key==="Left"||e.key==="ArrowUp"||e.key==="Up")&&h(e);}else{return(e.key==="ArrowRight"||e.key==="Right"||e.key==="ArrowUp"||e.key==="Up")&&h(e);}}var n=r?K.ARROW_LEFT:K.ARROW_RIGHT;return(e.keyCode==n||e.keyCode==K.ARROW_UP)&&h(e);}},sapprevious:{sName:"sapprevious",aTypes:["keydown"],fnCheck:function(e){var r=sap.ui.getCore().getConfiguration().getRTL();if(e.key){if(r){return(e.key==="ArrowRight"||e.key==="Right"||e.key==="ArrowUp"||e.key==="Up")&&!h(e);}else{return(e.key==="ArrowLeft"||e.key==="Left"||e.key==="ArrowUp"||e.key==="Up")&&!h(e);}}var p=r?K.ARROW_RIGHT:K.ARROW_LEFT;return(e.keyCode==p||e.keyCode==K.ARROW_UP)&&!h(e);}},sappreviousmodifiers:{sName:"sappreviousmodifiers",aTypes:["keydown"],fnCheck:function(e){var r=sap.ui.getCore().getConfiguration().getRTL();if(e.key){if(r){return(e.key==="ArrowRight"||e.key==="Right"||e.key==="ArrowUp"||e.key==="Up")&&h(e);}else{return(e.key==="ArrowLeft"||e.key==="Left"||e.key==="ArrowUp"||e.key==="Up")&&h(e);}}var p=r?K.ARROW_RIGHT:K.ARROW_LEFT;return(e.keyCode==p||e.keyCode==K.ARROW_UP)&&h(e);}},sapnext:{sName:"sapnext",aTypes:["keydown"],fnCheck:function(e){var r=sap.ui.getCore().getConfiguration().getRTL();if(e.key){if(r){return(e.key==="ArrowLeft"||e.key==="Left"||e.key==="ArrowDown"||e.key==="Down")&&!h(e);}else{return(e.key==="ArrowRight"||e.key==="Right"||e.key==="ArrowDown"||e.key==="Down")&&!h(e);}}var n=r?K.ARROW_LEFT:K.ARROW_RIGHT;return(e.keyCode==n||e.keyCode==K.ARROW_DOWN)&&!h(e);}},sapnextmodifiers:{sName:"sapnextmodifiers",aTypes:["keydown"],fnCheck:function(e){var r=sap.ui.getCore().getConfiguration().getRTL();if(e.key){if(r){return(e.key==="ArrowLeft"||e.key==="Left"||e.key==="ArrowDown"||e.key==="Down")&&h(e);}else{return(e.key==="ArrowRight"||e.key==="Right"||e.key==="ArrowDown"||e.key==="Down")&&h(e);}}var n=r?K.ARROW_LEFT:K.ARROW_RIGHT;return(e.keyCode==n||e.keyCode==K.ARROW_DOWN)&&h(e);}},sapdelayeddoubleclick:{sName:"sapdelayeddoubleclick",aTypes:["click"],fnCheck:function(e){var a=q(e.target);var b=e.timeStamp;var d=a.data("sapdelayeddoubleclick_lastClickTimestamp");var l=d||0;a.data("sapdelayeddoubleclick_lastClickTimestamp",b);var f=b-l;return(f>=300&&f<=1300);}}};P.order=["sapdown","sapdownmodifiers","sapshow","sapup","sapupmodifiers","saphide","sapleft","sapleftmodifiers","sapright","saprightmodifiers","saphome","saphomemodifiers","saptop","sapend","sapendmodifiers","sapbottom","sappageup","sappageupmodifiers","sappagedown","sappagedownmodifiers","sapselect","sapselectmodifiers","sapspace","sapspacemodifiers","sapenter","sapentermodifiers","sapexpand","sapbackspace","sapbackspacemodifiers","sapdelete","sapdeletemodifiers","sapexpandmodifiers","sapcollapse","sapcollapsemodifiers","sapcollapseall","sapescape","saptabnext","saptabprevious","sapskipforward","sapskipback","sapprevious","sappreviousmodifiers","sapnext","sapnextmodifiers","sapdecrease","sapminus","sapdecreasemodifiers","sapincrease","sapplus","sapincreasemodifiers","sapdelayeddoubleclick"];P.getBasicTypes=function(){var e=P.events,r=[];for(var n in e){if(e[n].aTypes){for(var j=0,a=e[n].aTypes.length;j<a;j++){var t=e[n].aTypes[j];if(r.indexOf(t)==-1){r.push(t);}}}}this.getBasicTypes=function(){return r.slice();};return r;};P.addEvent=function(e){P.events[e.sName]=e;P.order.push(e.sName);};return P;});
