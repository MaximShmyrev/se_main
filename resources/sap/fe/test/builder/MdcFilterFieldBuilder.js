sap.ui.define(["./MdcFieldBuilder","sap/fe/test/Utils"],function(F,U){"use strict";var a=function(){return F.apply(this,arguments);};a.create=function(o){return new a(o);};a.prototype=Object.create(F.prototype);a.prototype.constructor=a;a.prototype.hasValue=function(v,o){return F.prototype.hasConditionValues.apply(this,arguments);};a.prototype.doChangeValue=function(v,c){if(c){this.do(function(f){f.setConditions([]);});}return F.prototype.doChangeValue.call(this,v);};a.Matchers={};a.Actions={};return a;});
