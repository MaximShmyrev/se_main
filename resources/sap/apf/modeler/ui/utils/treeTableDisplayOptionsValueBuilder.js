jQuery.sap.declare('sap.apf.modeler.ui.utils.treeTableDisplayOptionsValueBuilder');jQuery.sap.require("sap.apf.modeler.ui.utils.displayOptionsValueBuilder");(function(){"use strict";sap.apf.modeler.ui.utils.TreeTableDisplayOptionsValueBuilder=function(t,o){sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder.apply(this,[t,o]);};sap.apf.modeler.ui.utils.TreeTableDisplayOptionsValueBuilder.prototype=Object.create(sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder.prototype);sap.apf.modeler.ui.utils.TreeTableDisplayOptionsValueBuilder.prototype.constructor=sap.apf.modeler.ui.utils.TreeTableDisplayOptionsValueBuilder;sap.apf.modeler.ui.utils.TreeTableDisplayOptionsValueBuilder.prototype.getLabelDisplayOptions=function(){var l=[{key:"key",name:this.oTextReader("key")},{key:"text",name:this.oTextReader("text")}];return this.oOptionsValueModelBuilder.prepareModel(l,l.length);};sap.apf.modeler.ui.utils.TreeTableDisplayOptionsValueBuilder.prototype.getValidatedLabelDisplayOptions=function(){var t=sap.apf.modeler.ui.utils.textManipulator;var l=[{key:"key",name:this.oTextReader("key")},{key:t.addPrefixText(["text"],this.oTextReader)[0],name:t.addPrefixText([this.oTextReader("text")],this.oTextReader)[0]}];return this.oOptionsValueModelBuilder.prepareModel(l,l.length);};}());
