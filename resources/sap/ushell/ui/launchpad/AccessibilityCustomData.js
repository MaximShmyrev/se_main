// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/CustomData"],function(C){"use strict";var A=C.extend("sap.ushell.ui.launchpad.AccessibilityCustomData");A.prototype._checkWriteToDom=function(){var i=sap.ui.getCore().getConfiguration().getAccessibility();if(!i){return null;}var k=this.getKey();var c=C.prototype._checkWriteToDom.apply(this,arguments);if(c&&(k.indexOf("aria-")===0||k==="role"||k==="tabindex")){c.key=c.key.replace(/^data-/,"");}return c;};return A;});
