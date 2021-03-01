/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/testrecorder/codeSnippets/ControlSnippetGenerator","sap/ui/testrecorder/interaction/Commands"],function(C,a){"use strict";var O=C.extend("sap.ui.testrecorder.codeSnippets.OPA5ControlSnippetGenerator",{});O.prototype._generate=function(d){var i=d.controlSelector.interaction&&d.controlSelector.interaction.idSuffix;var A=this._getActionAsString(d.action,i);if(A){d.controlSelector.actions=[];}delete d.controlSelector.interaction;var s=this._getSelectorAsString(d.controlSelector);return"this.waitFor("+this._getSelectorWithAction(s,A)+");";};O.prototype._getActionAsString=function(A,i){i=i?'idSuffix: "'+i+'"':"";var p;switch(A){case a.PRESS:p=i&&"{\n"+this._getIndentation(3)+i+"\n"+this._getIndentation(2)+"}";return"new Press("+p+")";case a.ENTER_TEXT:p="{\n"+this._getIndentation(2)+(i&&i+",\n"+this._getIndentation(2))+'text: "test"'+"\n"+this._getIndentation(1)+"}";return"new EnterText("+p+")";default:return"";}};O.prototype._getSelectorWithAction=function(s,A){return s.replace('actions: []','actions: '+A);};return new O();});
