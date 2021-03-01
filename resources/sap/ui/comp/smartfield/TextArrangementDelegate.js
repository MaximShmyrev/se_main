/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/comp/library","sap/ui/base/Object","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/base/assert"],function(c,B,F,a,b){"use strict";var T=c.smartfield.TextInEditModeSource;var d=B.extend("sap.ui.comp.smartfield.TextArrangementDelegate",{constructor:function(o){B.apply(this,arguments);this.oTextArrangementType=null;this.oFactory=o;this.oSmartField=o._oParent;this.bValidMetadata=false;this.sBindingContextPath="";}});d.prototype.setValue=function(v,o){var s=this.oSmartField,C=s._oControl;if(this.bValidMetadata&&(v!==o)&&C){var i=C[C.current],h=i&&i.getBinding("value");if(!h){return;}var m=s.isPropertyBeingUpdatedByModel("value");switch(s._getComputedTextInEditModeSource()){case T.NavigationProperty:var D=!!s.getModel().getData(h.getBindings()[1].getPath(),s.getBindingContext(),true);if((m&&!D)||!m){i.setValue(v);}return;case T.ValueList:case T.ValueListNoValidation:if(!m){i.setValue(v);}else if(this._sTextArrangementLastReadValue!==v){this.fetchIDAndDescriptionCollectionIfRequired();}return;}}};d.getPaths=function(t,m){var v=m.property&&m.property.valueListAnnotation;switch(t){case T.NavigationProperty:var n=m.annotations.text;if(!n){return{};}return{keyField:n.entityType.key.propertyRef[0].name,descriptionField:n.property.typePath,entitySetName:n.entitySet.name};case T.ValueList:if(!v){return{};}return{keyField:v.keyField,descriptionField:v.descriptionField,entitySetName:m.property.valueListEntitySet&&m.property.valueListEntitySet.name};case T.ValueListNoValidation:if(!v){return{};}return{valueListNoValidation:true,keyField:v.keyField,descriptionField:v.descriptionField,entitySetName:m.property.valueListEntitySet.name};}};d.prototype.getBindingInfo=function(s){var v=s.valueListNoValidation,o={},S=this.oSmartField,h=this.oFactory,m=h._oMetaData;this.oTextArrangementType=s&&s.type;if(!this.oTextArrangementType){var i=S.getBindingInfo("value");this.oTextArrangementType=(i&&i.type)||{};var t=d.getPaths(h._bTextInDisplayModeValueList?T.ValueList:S._getComputedTextInEditModeSource(),m);if(s.sDisplayFormat){o.displayFormat=s.sDisplayFormat;}this.oTextArrangementType=h._oTypes.getType(m.property,Object.assign(o,this.oTextArrangementType.oFormatOptions),this.oTextArrangementType.oConstraints,{composite:true,keyField:t.keyField,descriptionField:t.descriptionField,valueListNoValidation:v});this.oStringType=h._oTypes.getType(m.property,Object.assign(o,this.oTextArrangementType.oFormatOptions),this.oTextArrangementType.oConstraints);}var j=this.getTextAnnotationPropertyPath();if(j===""||j.indexOf("undefined")!==-1){j="__$$SmartFieldNotExistingBindingPath";}if(s.skipValidation){return{model:m.model,type:this.oStringType,path:m.path};}return{model:m.model,type:this.oTextArrangementType,parts:[{path:m.path},{path:j}]};};d.prototype.getTextAnnotationPropertyPath=function(s){s=s||{};var t=s.textInEditModeSource||this.oSmartField._getComputedTextInEditModeSource(),o=this.oFactory,m=o._oMetaData;if(o._bTextInDisplayModeValueList){t=T.ValueList;}switch(t){case T.NavigationProperty:var h=s.textAnnotation||m.annotations.text;return o._oHelper.getTextAnnotationPropertyPath(h);case T.ValueList:var E=s.edmValueListKeyProperty||m.property.valueListKeyProperty,i=s.bindingContextPath||this.sBindingContextPath;return o._oHelper.getAbsolutePropertyPathToValueListEntity({property:E,bindingContextPath:i});case T.ValueListNoValidation:var E=s&&s.edmValueListKeyProperty||m.property.valueListKeyProperty,i=s&&s.bindingContextPath||this.sBindingContextPath,h=s&&s.textAnnotation||m&&m.annotations&&m.annotations.text;var n=this.oSmartField&&this.oSmartField.getBinding("value")&&this.oSmartField.getBinding("value").vOriginalValue!==this.oSmartField.getBinding("value").getValue();if(h&&i!=="/undefined"&&!n){var j=o._oHelper.getTextAnnotationPropertyPath(h);if(j&&j!==this.oFactory.getMetaData().path){return j;}}return o._oHelper.getAbsolutePropertyPathToValueListEntity({property:E,bindingContextPath:i});case T.None:return"";default:return"";}};d.prototype.checkRequiredMetadata=function(t,s){var o=this.oFactory,m=o._oMetaData;switch(t){case T.None:return false;case T.NavigationProperty:var n=m.annotations.text,E;if(n){E=n.entityType;}var C={propertyName:m.property&&m.property.property&&m.property.property.name,entityType:m.entityType,entityTypeOfNavigationProperty:E,textAnnotation:m.property&&m.property.property&&m.property.property["com.sap.vocabularies.Common.v1.Text"]};if(s){return o._oHelper.checkNavigationPropertyRequiredMetadataNoAsserts(C);}else{return o._oHelper.checkNavigationPropertyRequiredMetadata(C);}break;case T.ValueList:case T.ValueListNoValidation:var v={propertyName:m.property&&m.property.property&&m.property.property.name,entityType:m.entityType,valueListAnnotation:m.property&&m.property.valueListAnnotation};if(s){return o._oHelper.checkValueListRequiredMetadataForTextArrangmentNoAsserts(v);}else{return o._oHelper.checkValueListRequiredMetadataForTextArrangment(v);}break;default:return false;}};d.prototype.onBeforeValidateValue=function(v,s){var S=this.oSmartField;if(!S.getBindingContext()){return;}var o=this.onFetchIDAndDescriptionCollectionSuccess.bind(this,{success:s.success});var O=this.onFetchIDAndDescriptionCollectionError.bind(this,{error:s.error});var h={value:v,success:o,error:O,filterFields:s.filterFields};this.fetchIDAndDescriptionCollection(h);var i=S._oControl.edit;if(i&&v){i.setBusyIndicatorDelay(300);i.setBusy(true);}};d.prototype.fetchIDAndDescriptionCollectionIfRequired=function(){var s=this.oSmartField;var t=s._getComputedTextInEditModeSource();var m=this.oFactory&&this.oFactory.getMetaData();var o=m&&m.annotations&&m.annotations.text;var n=this.oSmartField&&this.oSmartField.getBinding("value")&&this.oSmartField.getBinding("value").vOriginalValue!==this.oSmartField.getBinding("value").getValue();if(o&&((m&&o.path===m.path)||this.sBindingContextPath==="/undefined"||n)){o=null;}if(t===T.ValueList||(!o&&t===T.ValueListNoValidation&&this.oFactory._getDisplayBehaviourConfiguration()!=="idOnly")||this.oFactory._bTextInDisplayModeValueList){var I="value",v=s.getBinding(I).getValue(),u=(v==null)||(v==="");if(!u){var h=["keyField"];var S={value:v,oldValue:v,updateBusyIndicator:false,initialRendering:true};this.fetchIDAndDescriptionCollection({value:v,filterFields:h,success:this.onFetchIDAndDescriptionCollectionSuccess.bind(this,S)});}}};d.prototype.fetchIDAndDescriptionCollection=function(s){var v=s.value;if((v==null)||(v==="")){return;}var S=this.oSmartField,i=S._oControl.edit,I=i&&i.getBindingInfo("value"),V=!!(I&&I.skipPropertyUpdate),h=S.isPropertyBeingUpdatedByModel("value");if(V&&!h){i.attachEventOnce("change",function o(C){var j=!!C.getParameter("validated");if(j){s.filterFields=["keyField"];}this.readODataModel(s);},this);}else{if(h){s.filterFields=["keyField"];}this.readODataModel(s);}};d.prototype.readODataModel=function(s){var S=this.oSmartField,h,A,t=S._getComputedTextInEditModeSource(),m=S.getControlFactory().getMetaData(),i=d.getPaths(this.oFactory._bTextInDisplayModeValueList?T.ValueList:t,m),k=i.keyField,D=i.descriptionField;if(!D){return;}A=this.getAdditionalFiltersData(S,m);var o={keyFieldPath:k,descriptionFieldPath:D,aFilterFields:s.filterFields};for(h in A){s.filterFields.push(h);o[h]=A[h];}this._sTextArrangementLastReadValue=s.value;if(this.oTextArrangementType&&this.oTextArrangementType.oFormatOptions&&this.oTextArrangementType.oFormatOptions.displayFormat==="UpperCase"&&s.value){s.value=s.value.toUpperCase();}var j=this.getFilters(s.value,o);var u={"$select":k+","+D,"$top":2};var p="/"+i.entitySetName;var l={filters:j,urlParameters:u,success:s.success,error:s.error};var O=S.getModel();O.read(p,l);};d.prototype.getAdditionalFiltersData=function(s,D){var C,i,h,I,v,A={};if(D&&D.annotations&&D.annotations.valueListData){i=D.annotations.valueListData.inParams;C=D.annotations.valueListData.constParams;}if(C){for(h in C){A[h]=C[h];}}if(i){for(I in i){v=i[I];if(v!==D.annotations.valueListData.keyField){A[v]=s.getBindingContext().getProperty(I);}}}return A;};d.prototype.onFetchIDAndDescriptionCollectionSuccess=function(s,D,r){s=Object.assign({updateBusyIndicator:true},s);if(!this.oSmartField){return;}var S=this.oSmartField,i=S._oControl.edit,I=i&&i.getBinding("value"),o=S._oControl.display;if(I&&s.updateBusyIndicator){i.setBusyIndicatorDelay(0);i.setBusy(false);}if(typeof s.success==="function"){s.success(D.results);}var h=function(S,D,k,l){var O=S.getModel(),v=S.getTextInEditModeSource()==="ValueListNoValidation"||S._getComputedTextInEditModeSource()==="ValueListNoValidation";b(Array.isArray(D.results)," - "+this.getMetadata().getName());if(O){var m=O.getKey(D.results[0]);if(v&&D.results.length!==1){this.sBindingContextPath="/"+m;this.bindPropertyForValueList(k,l,true);}else if(typeof m==="string"){this.sBindingContextPath="/"+m;this.bindPropertyForValueList(k,l,false,v);}}};if(S.getMode()==="display"){var u=function(){h.call(this,S,D,"text",o);};if(s.initialRendering){u.call(this);}}if(I&&S.getMode()==="edit"&&S.isTextInEditModeSourceNotNone()){var j=function(){h.call(this,S,D,"value",i);};if(s.initialRendering){j.call(this);}i.attachEventOnce("validationSuccess",j,this);}};d.prototype.onFetchIDAndDescriptionCollectionError=function(s,E){var i=this.oSmartField._oControl.edit;if(i){i.setBusyIndicatorDelay(0);i.setBusy(false);}if(typeof s.error==="function"){s.error(E);}};d.prototype.bindPropertyForValueList=function(p,i,s,v){var S=this.oSmartField,o={},t,h,j,k=S._getComputedTextInEditModeSource();if(k===T.ValueList||k===T.ValueListNoValidation||this.oFactory._bTextInDisplayModeValueList){h=i&&i.getBinding(p);if(this.oFactory&&h){j=h.getType();if((!j||!j.isA("sap.ui.comp.smartfield.type.TextArrangement"))&&this.oFactory._getTextArrangementType){t=this.oFactory._getTextArrangementType();if(t){j=t;}}if(j){o={type:j};}o.skipValidation=s;o.bValueListNoValidation=v;i.bindProperty(p,this.getBindingInfo(o));}}};d.prototype.getFilters=function(v,s){this.destroyFilters();var h=s.aFilterFields;var A;if(h.length===1){switch(h[0]){case"keyField":this.oIDFilter=g(v,s);return[this.oIDFilter];case"descriptionField":this.oDescriptionFilter=e(v,s);return[this.oDescriptionFilter];}}this.oIDFilter=g(v,s);this.oDescriptionFilter=e(v,s);A=f(s);this.oFilters=new F({and:true,filters:[new F({and:false,filters:[this.oIDFilter,this.oDescriptionFilter]})]});if(A.aFilters.length>0){this.oFilters.aFilters.push(A);}return[this.oFilters];};function g(v,s){return new F({value1:v,path:s.keyFieldPath,operator:a.EQ});}function e(v,s){return new F({value1:v,path:s.descriptionFieldPath,operator:a.Contains});}function f(s){var h,j=[],i;for(h in s){for(i=0;i<s.aFilterFields.length;i++){if(s.aFilterFields[i]==h){j.push(new F({value1:s[h],path:h,operator:a.EQ}));}}}return new F({and:true,filters:j});}d.prototype.destroyFilters=function(){if(this.oIDFilter){this.oIDFilter.destroy();this.oIDFilter=null;}if(this.oDescriptionFilter){this.oDescriptionFilter.destroy();this.oDescriptionFilter=null;}if(this.oFilters){this.oFilters.destroy();this.oFilters=null;}};d.prototype.destroy=function(){this.oSmartField=null;this.bValidMetadata=false;this.sBindingContextPath="";this.destroyFilters();};return d;});
