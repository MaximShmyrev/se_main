sap.ui.define(["sap/fe/macros/MacroMetadata","sap/fe/core/helpers/BindingExpression"],function(M,B){"use strict";var c=B.compileBinding;var r=B.resolveBindingString;var e=B.equal;var i=B.ifElse;
/*!
   * ${copyright}
   */
var F=M.extend("sap.fe.macros.Field",{name:"Field",namespace:"sap.fe.macros",fragment:"sap.fe.macros.Field",metadata:{stereotype:"xmlmacro",properties:{metaPath:{type:"sap.ui.model.Context",required:true},contextPath:{type:"sap.ui.model.Context",required:true},id:{type:"string",required:true},editable:{type:"boolean",required:false}},events:{onChange:{type:"function"}}},create:function(p){p.editModeExpression=c(i(e(r(p.editable,"boolean"),true),"Editable","Display"));return p;}});return F;},false);
