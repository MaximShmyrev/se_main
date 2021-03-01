/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Control","sap/m/Label","sap/ui/model/Context"],function(C,L,a){"use strict";var b=C.extend("sap.gantt.control.Cell",{metadata:{library:"sap.gantt",properties:{cellCallback:{type:"object"},columnConfig:{type:"object"}}}});b.prototype.setColumnConfig=function(c){this.setProperty("columnConfig",c);if(c){var A=c.getAttributes();if(A&&A.length>0){this._oMapAttributes={};A.forEach(function(o){this._oMapAttributes[o.getObjectTypeKey()]=o.getAttribute();}.bind(this));}}return this;};b.prototype.createCellContent=function(c){var o=this.getCellCallback();if(o&&o.createCellContent){return o.createCellContent(c);}return new L();};b.prototype.updateCellContent=function(c,o,A,O,d){var e=this.getCellCallback();if(e&&e.updateCellContent){e.updateCellContent(c,o,A,O,d);}else{c.setText(o.getProperty(A));}};b.prototype._updateTableCell=function(c,o,$,A){if(!o){return;}if(!(o instanceof a)){o=o.context;}if(!this._oAttributeControl){this._oAttributeControl=this.createCellContent(this.getColumnConfig());}this._oContext=o;var r=this.data("rowTypeName");r=r?r:"type";var O=o.getProperty(r);if(this._oMapAttributes){this.updateCellContent(this._oAttributeControl,o,this._oMapAttributes[O],O,this.getColumnConfig());}else{this.updateCellContent(this._oAttributeControl,o,this.getColumnConfig().getAttribute(),O,this.getColumnConfig());}if(this.bOutput){var R=sap.ui.getCore().createRenderManager(),d=this._oAttributeControl.getRenderer();d.render(R,this._oAttributeControl);if($&&$.length>0){R.flush(this.getDomRef(),false,false);}R.destroy();}};b.prototype.getContentToRender=function(){return this._oAttributeControl;};b.prototype.getAccessibilityInfo=function(){var i=this.getContentToRender();return i&&i.getAccessibilityInfo?i.getAccessibilityInfo():null;};return b;},true);
