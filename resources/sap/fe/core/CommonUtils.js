/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/View","sap/ui/core/Component","sap/m/MessageBox","sap/base/Log","sap/fe/navigation/SelectionVariant","sap/ui/mdc/condition/FilterOperatorUtil","sap/ui/mdc/odata/v4/TypeUtil","sap/fe/core/helpers/StableIdHelper","sap/fe/core/library","sap/fe/core/helpers/ModelHelper","sap/fe/core/helpers/SemanticDateOperators","sap/fe/core/converters/controls/Common/Filter"],function(V,C,M,L,S,F,T,a,b,c,d,e){"use strict";var P=b.ProgrammingModel;var v=["Edm.Boolean","Edm.Byte","Edm.Date","Edm.DateTime","Edm.DateTimeOffset","Edm.Decimal","Edm.Double","Edm.Float","Edm.Guid","Edm.Int16","Edm.Int32","Edm.Int64","Edm.SByte","Edm.Single","Edm.String","Edm.Time","Edm.TimeOfDay"];function g(i){var j=i.getProperty("$Type");if(!i.getProperty("$kind")){switch(j){case"com.sap.vocabularies.UI.v1.DataFieldForAction":case"com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":j=undefined;break;case"com.sap.vocabularies.UI.v1.DataField":case"com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":case"com.sap.vocabularies.UI.v1.DataFieldWithUrl":j=i.getProperty("Value/$Path/$Type");break;case"com.sap.vocabularies.UI.v1.DataFieldForAnnotation":default:var i1=i.getProperty("Target/$AnnotationPath");if(i1){if(i1.indexOf("com.sap.vocabularies.Communication.v1.Contact")>-1){j=i.getProperty("Target/$AnnotationPath/fn/$Path/$Type");}else if(i1.indexOf("com.sap.vocabularies.UI.v1.DataPoint")>-1){j=i.getProperty("Value/$Path/$Type");}else{j=undefined;}}else{j=undefined;}break;}}return j;}function h(i){var j=false;if(i){i.getCurrentContexts().forEach(function(i1){if(i1&&i1.isTransient()){j=true;}});}return j;}function _(i,j,i1){var j1=false;var k1=i.getObject(j+"@Org.OData.Capabilities.V1.FilterRestrictions");if(k1&&k1.NonFilterableProperties){j1=k1.NonFilterableProperties.some(function(l1){return l1.$NavigationPropertyPath===i1||l1.$PropertyPath===i1;});}return j1;}function f(i,j,i1){var j1=i1.split("/"),k1=false,l1="";j1.some(function(m1,n1,o1){if(l1.length>0){l1+="/"+m1;}else{l1=m1;}if(n1===o1.length-1){k1=_(i,j,l1);}else if(i.getObject(j+"/$NavigationPropertyBinding/"+m1)){k1=_(i,j,l1);l1="";j="/"+i.getObject(j+"/$NavigationPropertyBinding/"+m1);}return k1===true;});return k1;}function k(i,j,i1,j1){if(typeof i1!=="string"){throw new Error("sProperty parameter must be a string",i1);}var k1;var l1=i.createBindingContext(j+"/"+i1);if(l1.getProperty("@com.sap.vocabularies.UI.v1.Hidden")===true){return false;}if(!j1&&l1.getProperty("@com.sap.vocabularies.UI.v1.HiddenFilter")){return false;}if(i1.indexOf("/")<0){k1=!_(i,j,i1);}else{k1=!f(i,j,i1);}if(k1&&l1){var m1=g(l1);if(m1){k1=v.indexOf(m1)!==-1;}else{k1=false;}}return k1;}function l(i){return s(i).getShellServices();}function m(i,j,i1){var j1=h1.getShellServices(i);return j1.getLinks({semanticObject:j,params:i1});}function n(j){var i1=[];var j1=Object.keys(j);for(var i=0;i<j1.length;i++){var k1={"LocalProperty":{"$PropertyPath":j1[i]},"SemanticObjectProperty":j[j1[i]]};i1.push(k1);}return i1;}function o(j,i1,j1,k1){for(var i=0;i<j.length;i++){var l1=j[i];var m1=l1.intent;var n1=m1.split("-")[1].split("?")[0];if(i1&&i1.indexOf(n1)===-1){k1.push({text:l1.text,targetSemObject:m1.split("#")[1].split("-")[0],targetAction:n1.split("~")[0],targetParams:j1});}}}function p(i,j,i1,j1){if(j1&&j1.length>0){var k1=i.unavailableActions?i.unavailableActions:[];var l1=i.mapping?n(i.mapping):[];var m1={navigationContexts:j,semanticObjectMapping:l1};o(j1,k1,m1,i1);}}function u(i,i1,j1,k1,l1,m1){var n1=l(j1),o1={},p1="",q1="";var r1;var s1=[];var t1=[];if(i1){if(k1&&k1.length>0){for(var j=0;j<k1.length;j++){var u1=k1[j].$PropertyPath;if(!o1[u1]){o1[u1]={value:i1[u1]};}}}else{var v1=l1.getObject(m1+"/$Type/$Key");for(var w1 in v1){var x1=v1[w1];if(!o1[x1]){o1[x1]={value:i1[x1]};}}}}var y1=t(j1).getViewData();var z1=[];if(y1.additionalSemanticObjects){var A1=Object.keys(y1.additionalSemanticObjects);for(var w1=0;w1<A1.length;w1++){m(j1,A1[w1],o1).then(p.bind(this,y1.additionalSemanticObjects[A1[w1]],i,z1)).catch(function(C1){L.error("Error while retrieving SO Intents",C1);});}}function B1(){var C1=n1.parseShellHash(document.location.hash);p1=C1.semanticObject;q1=C1.action;return m(j1,p1,o1);}B1().then(function(C1){if(C1&&C1.length>0){var D1={};var E1=[];var F1=m1+"@";var G1=m1+"/@";var H1=l1.getObject(F1);r1=q(H1,p1);if(!r1.bHasEntitySetSO){var I1=l1.getObject(G1);r1=q(I1,p1);}t1=r1.aUnavailableActions;t1.push(q1);D1.navigationContexts=i;D1.semanticObjectMapping=r1.aMappings;o(C1,t1,D1,E1);s1=E1.concat(z1);j1.getBindingContext("internal").setProperty("relatedApps/visibility",s1.length>0);j1.getBindingContext("internal").setProperty("relatedApps/items",s1);}else{j1.getBindingContext("internal").setProperty("relatedApps/visibility",false);}}).catch(function(C1){L.error("Cannot read links",C1);});return s1;}function q(i,j){var i1={bHasEntitySetSO:false,aUnavailableActions:[],aMappings:[]};var j1,k1;var l1;for(var m1 in i){if(m1.indexOf("com.sap.vocabularies.Common.v1.SemanticObject")>-1&&i[m1]===j){i1.bHasEntitySetSO=true;j1="@com.sap.vocabularies.Common.v1.SemanticObjectMapping";k1="@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions";if(m1.indexOf("#")>-1){l1=m1.split("#")[1];j1=j1+"#"+l1;k1=k1+"#"+l1;}i1.aMappings=i1.aMappings.concat(i[j1]);i1.aUnavailableActions=i1.aUnavailableActions.concat(i[k1]);break;}}return i1;}function U(i){var j=i.getModel().getMetaModel();var i1=i.getBindingContext();var j1=i1&&i1.getPath();var k1=j.getMetaPath(j1);var l1=k1+"/"+"@com.sap.vocabularies.Common.v1.SemanticKey";var m1=j.getObject(l1);var n1=i1.getObject();if(!n1){i1.requestObject().then(function(n1){return u(i1,n1,i,m1,j,k1);}).catch(function(o1){L.error("Cannot update the related app details",o1);});}else{return u(i1,n1,i,m1,j,k1);}}function r(i){var j=["sap.m.Button","sap.m.OverflowToolbarButton"];if(i&&j.indexOf(i.getMetadata().getName())!==-1&&i.getVisible()&&i.getEnabled()){i.firePress();}}function R(i){if(i==="true"||i===true){return true;}else{return false;}}function s(i){if(i.isA("sap.fe.core.AppComponent")){return i;}var j=C.getOwnerComponentFor(i);if(!j){return i;}else{return s(j);}}function t(i){if(i&&i.isA("sap.ui.core.ComponentContainer")){i=i.getComponentInstance();i=i&&i.getRootControl();}while(i&&!(i instanceof V)){i=i.getParent();}return i;}function w(i,j,i1,j1){var k1=j.getModel("ui").getProperty("/isEditable"),l1=sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates"),m1=l1&&l1.getText("T_COMMON_UTILS_NAVIGATION_AWAY_MSG"),n1=l1&&l1.getText("T_COMMON_UTILS_NAVIGATION_AWAY_CONFIRM_BUTTON"),o1=l1&&l1.getText("T_COMMON_UTILS_NAVIGATION_AWAY_CANCEL_BUTTON");if(i1===P.Sticky&&k1){return M.warning(m1,{actions:[n1,o1],onClose:function(p1){if(p1===n1){var q1=j&&j.getModel("internal");L.info("Navigation confirmed.");if(q1){q1.setProperty("/sessionOn",false);}else{L.warning("Local UIModel couldn't be found.");}i();}else{L.info("Navigation rejected.");}}});}return i();}function x(i,j){var i1=false,j1=i.split("/");if(j1.length>1){i1=j[j1[0]]&&j[j1[0]].hasOwnProperty(j1[1])&&j[j1[0]][j1[1]]===0;}else{i1=j[i]===0;}return i1;}function y(i1,j1){var k1=[];for(var i=0;i<i1.length;i++){var l1=i1[i].entitySet,m1=i1[i].contextData,n1;delete m1["@odata.context"];delete m1["@odata.metadataEtag"];delete m1["SAP__Messages"];n1=Object.keys(m1);for(var j=0;j<n1.length;j++){var o1=n1[j],p1=j1.getObject("/"+l1+"/"+o1+"@");if(p1){if(p1["@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"]||p1["@com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"]||p1["@com.sap.vocabularies.Analytics.v1.Measure"]){delete m1[o1];}else if(p1["@com.sap.vocabularies.Common.v1.FieldControl"]){var q1=p1["@com.sap.vocabularies.Common.v1.FieldControl"];if(q1["$EnumMember"]&&q1["$EnumMember"].split("/")[1]==="Inapplicable"){delete m1[o1];}else if(q1["$Path"]&&h1.isFieldControlPathInapplicable(q1["$Path"],m1)){delete m1[o1];}}}}k1.push(m1);}return k1;}function G(i,j){var i1=i.getObject("/"+j+"/")||{},j1={};for(var k1 in i1){if(i1.hasOwnProperty(k1)&&!/^\$/i.test(k1)&&i1[k1].$kind&&i1[k1].$kind==="Property"){j1[k1]=i1[k1];}}return j1;}function z(i,j){var i1;if(i&&j){i1=i.getObject("/"+j+"@Org.OData.Capabilities.V1.FilterRestrictions/RequiredProperties");}return i1;}function A(i,j){var i1=i&&i.getActions();if(i1){i1.forEach(function(j1){if(j1.data("IBNData")){j.push(j1);}});}return j;}function B(i,j){var i1=this;var j1={};var k1=function(l1){if(l1){var m1=Object.keys(l1);m1.map(function(n1){if(n1.indexOf("_")!==0&&n1.indexOf("odata.context")===-1){j1[n1]={value:l1[n1]};}});}if(i.length){i.forEach(function(n1){var o1=n1.data("IBNData").semanticObject;var p1=n1.data("IBNData").action;i1.getShellServices(j).getLinks({semanticObject:o1,action:p1,params:j1}).then(function(q1){n1.setVisible(q1&&q1.length===1);}).catch(function(q1){L.error("Cannot retrieve the links from the shell service",q1);});});}};if(j&&j.getBindingContext()){j.getBindingContext().requestObject().then(function(l1){return k1(l1);}).catch(function(l1){L.error("Cannot retrieve the links from the shell service",l1);});}else{k1();}}function D(i,j,i1,j1){var k1=i;if(j){if(j1){var l1=E(j.aCustomBundles,i+"|"+j1);k1=l1?i+"|"+j1:i;}return j.getText(k1,i1);}j=sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");return j.getText(k1,i1);}function E(j,i1){if(j.length){for(var i=j.length-1;i>=0;i--){var j1=j[i].hasText(i1);if(j1){return true;}E(j[i].aCustomBundles,i1);}}return false;}function H(i,j,i1,j1){i1=!i1?i.getObject(i.getPath()):i1;var k1=i.getPath().split("/@")[0];k1=i.getObject(k1).$Type;k1=I(i.getModel(),k1);if(j1){return i.getObject("/"+k1+"/"+i1+"@Org.OData.Core.V1.OperationAvailable");}if(j){return"/"+k1+"/"+i1;}else{return{sEntityName:k1,sProperty:i.getObject("/"+k1+"/"+i1+"@Org.OData.Core.V1.OperationAvailable/$Path"),sBindingParameter:i.getObject("/"+k1+"/"+i1+"/@$ui5.overload/0/$Parameter/0/$Name")};}}function I(i,j){var i1=i.getObject("/");for(var j1 in i1){if(typeof i1[j1]==="object"&&i1[j1].$Type===j){return j1;}}}function J(i,j){var i1=i["@com.sap.vocabularies.Common.v1.Text"],j1=i1&&((i&&i["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"])||(j&&j["@com.sap.vocabularies.UI.v1.TextArrangement"]));if(j1){if(j1.$EnumMember==="com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"){return"Description";}else if(j1.$EnumMember==="com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"){return"ValueDescription";}return"DescriptionValue";}return i1?"DescriptionValue":"Value";}function K(j,i1,j1){for(var k1 in i1){j.setProperty("dynamicActions/"+k1,{bEnabled:false,aApplicable:[],aNotApplicable:[]});var l1=[],m1=[];var n1=i1[k1];for(var i=0;i<j1.length;i++){var o1=j1[i];var p1=o1.getObject();if(n1===null&&!!p1["#"+k1]){j.getModel().setProperty(j.getPath()+"/dynamicActions/"+k1+"/bEnabled",true);break;}else if(o1.getObject(n1)){j.getModel().setProperty(j.getPath()+"/dynamicActions/"+k1+"/bEnabled",true);l1.push(o1);}else{m1.push(o1);}}j.getModel().setProperty(j.getPath()+"/dynamicActions/"+k1+"/aApplicable",l1);j.getModel().setProperty(j.getPath()+"/dynamicActions/"+k1+"/aNotApplicable",m1);}}function N(i){var j=T.getDataTypeClassName(i);var i1=T.getBaseType(j);return F.getOperatorsForType(i1);}function O(i,j){var i1=i.filter(function(j1){return j.indexOf(j1)>-1;});return i1.toString()||undefined;}function Q(i,j,i1,j1,k1,l1){var m1=i1.getObject(j+"@Org.OData.Capabilities.V1.FilterRestrictions");var n1=["EQ"];var o1=["EQ","GE","LE","LT","GT","BT","NOTLE","NOTLT","NOTGE","NOTGT"];var p1=["EQ","GE","LE","LT","GT","BT","NE","NOTBT","NOTLE","NOTLT","NOTGE","NOTGT"];var q1=["StartsWith","NotStartsWith","EndsWith","NotEndsWith","Contains","NotContains"];var r1=d.getSupportedOperations();var s1=k1==="true"||k1===true;var t1=[];var u1=typeof l1==="string"?JSON.parse(l1).customData:l1;if(u1&&u1.operatorConfiguration&&u1.operatorConfiguration.length>0){t1=d.getFilterOperations(u1.operatorConfiguration);}else{t1=d.getSemanticDateOperations();}var v1=N(j1);if(m1&&m1.FilterExpressionRestrictions&&m1.FilterExpressionRestrictions.some(function(z1){return z1.Property.$PropertyPath===i;})){if(s1){v1=r1.concat(v1);}var w1=m1.FilterExpressionRestrictions.filter(function(z1){return z1.Property.$PropertyPath===i;});if(w1.some(function(z1){return z1.AllowedExpressions==="SingleValue"||z1.AllowedExpressions==="MultiValue";})){return O(v1,n1);}if(w1.some(function(z1){return z1.AllowedExpressions==="SingleRange";})){var x1=O(v1,j1==="Edm.Date"&&s1?t1:o1);return x1?x1:"";}if(w1.some(function(z1){return z1.AllowedExpressions==="MultiRange";})){return O(v1,p1);}if(w1.some(function(z1){return z1.AllowedExpressions==="SearchExpression";})){return O(v1,q1);}if(w1.some(function(z1){return z1.AllowedExpressions==="MultiRangeOrSearchExpression";})){return O(v1,q1.concat(p1));}return undefined;}else if(j1==="Edm.Date"){t1=d.getSemanticDateOperations();var y1=v1.filter(function(z1){return t1.indexOf(z1)<0;});return y1.toString();}}function W(i,j,i1,j1){var k1=i.getSelectOptionsPropertyNames(),l1=h1.getEntitySetProperties(i1,j1),m1=i.getParameterNames();m1.forEach(function(n1){if(n1.substring(0,2)==="P_"){var o1=n1;n1=n1.slice(2,n1.length);if(k1.indexOf(n1)==-1){if(n1 in l1){var p1=i.getParameter(o1),q1=e.getTypeCompliantValue(p1,l1[n1].$Type),r1;if(q1!==undefined||q1!==null){r1={isEmpty:null,operator:"EQ",values:[q1]};j[n1]=j.hasOwnProperty(n1)?j[n1].concat([r1]):[r1];}}}}});k1.forEach(function(n1){var o1=n1;if(n1.substring(0,2)==="P_"){n1=n1.slice(2,n1.length);if(k1.indexOf(n1)>-1){n1="";}}if(n1 in l1){var p1=[],q1,r1;if(h1.isPropertyFilterable(i1,"/"+j1,n1,true)){q1=i.getSelectOption(o1==n1?n1:o1);r1=h1.getOperatorsForProperty(n1,"/"+j1,i1);p1=q1.reduce(function(s1,t1){var u1=e.getTypeCompliantValue(t1.Low,l1[n1].$Type),v1=t1.High?e.getTypeCompliantValue(t1.High,l1[n1].$Type):undefined;if((u1!==undefined||u1!==null)&&t1.Option){var w1=e.createConditions(t1.Option,u1,v1,t1.Sign);if(!r1||r1.indexOf(w1.operator)>-1){s1.push(w1);}}return s1;},p1);if(p1.length){j[n1]=j.hasOwnProperty(n1)?j[n1].concat(p1):p1;}}}});return j;}function X(i,j,i1){var j1=h1.getAppComponent(i1);var k1=j1.getNavigationService();return k1.mixAttributesAndSelectionVariant(j,i.toJSONString());}function Y(i,j){var i1,j1="",k1=null;var l1=function(q1,r1,s1){var t1={option:"",sign:"I",low:r1,high:s1};switch(q1){case"Contains":t1.option="CP";break;case"StartsWith":t1.option="CP";t1.low+="*";break;case"EndsWith":t1.option="CP";t1.low="*"+t1.low;break;case"BT":case"LE":case"LT":case"GT":case"NE":case"EQ":t1.option=q1;break;case"EEQ":t1.option="EQ";break;case"Empty":t1.option="EQ";t1.low="";break;case"NotContains":t1.option="CP";t1.sign="E";break;case"NOTBT":t1.option="BT";t1.sign="E";break;case"NotStartsWith":t1.option="CP";t1.low+="*";t1.sign="E";break;case"NotEndsWith":t1.option="CP";t1.low="*"+t1.low;t1.sign="E";break;case"NotEmpty":t1.option="NE";t1.low="";break;case"NOTLE":t1.option="LE";t1.sign="E";break;case"NOTGE":t1.option="GE";t1.sign="E";break;case"NOTLT":t1.option="LT";t1.sign="E";break;case"NOTGT":t1.option="GT";t1.sign="E";break;default:L.warning(q1+" is not supported. "+i1+" could not be added to the navigation context");}return t1;};j=j.filter||j;for(var i1 in j){if(!i.getSelectOption(i1)){if(i1==="$editState"){continue;}var m1=j[i1];for(var n1 in m1){var o1=m1[n1];j1=(o1.values[0]&&o1.values[0].toString())||"";k1=(o1.values[1]&&o1.values[1].toString())||null;var p1=l1(o1.operator,j1,k1);if(p1.option){i.addSelectOption(i1,p1.sign,p1.option,p1.low,p1.high);}}}}return i;}function Z(i){var j=c.isStickySessionSupported(i.getModel().getMetaModel());var i1=i.getModel("ui").getProperty("/isEditable");return j&&i1;}function $(j,i1,j1){if(i1&&j&&j.length){for(var i=0;i<j.length;i++){var k1=i1.getSelectOption("DisplayCurrency"),l1=j1&&j1.getSelectOption("DisplayCurrency");if(j[i].$PropertyPath==="DisplayCurrency"&&(!k1||!k1.length)&&l1&&l1.length){var m1=l1[0];var n1=m1["Sign"];var o1=m1["Option"];var p1=m1["Low"];var q1=m1["High"];i1.addSelectOption("DisplayCurrency",n1,o1,p1,q1);}}}}function a1(i,j){var i1=i.getObject(j+"/").$Key;var j1=[];var k1=i.getObject(j+"/");for(var l1 in k1){if(k1[l1].$kind&&k1[l1].$kind==="Property"){var m1=i.getObject(j+"/"+l1+"@")||{},n1=i1.indexOf(l1)>-1,o1=n1||m1["@Org.OData.Core.V1.Immutable"],p1=!m1["@Org.OData.Core.V1.Computed"],q1=!m1["@com.sap.vocabularies.UI.v1.Hidden"];if(o1&&p1&&q1){j1.push(l1);}}}return j1;}function b1(j,i1,j1,k1){return new Promise(function(l1,m1){var n1=j.getComponentData(),o1=(n1&&n1.startupParameters)||{},p1=j.getShellServices();if(!p1.hasUShell()){i1.map(function(i){var q1=k1?"/"+i.$Name:i.getPath().slice(i.getPath().lastIndexOf("/")+1);var r1=k1?q1.slice(1):q1;if(o1[r1]){j1.setProperty(q1,o1[r1][0]);}});return l1(true);}return p1.getStartupAppState(j).then(function(q1){var r1=q1.getData()||{},s1=(r1.selectionVariant&&r1.selectionVariant.SelectOptions)||[];i1.map(function(t1){var u1=k1?"/"+t1.$Name:t1.getPath().slice(t1.getPath().lastIndexOf("/")+1);var v1=k1?u1.slice(1):u1;if(o1[v1]){j1.setProperty(u1,o1[v1][0]);}else if(s1.length>0){for(var i in s1){var w1=s1[i];if(w1.PropertyName===v1){var x1=w1.Ranges.length?w1.Ranges[0]:undefined;if(x1&&x1.Sign==="I"&&x1.Option==="EQ"){j1.setProperty(u1,x1.Low);}}}}});return l1(true);});});}function c1(j){var i1=[];if(j.parameters){var j1=Object.keys(j.parameters)||[];if(j1.length>0){j1.forEach(function(k1){var l1=j.parameters[k1];if(l1.value&&l1.value.value&&l1.value.format==="binding"){var m1={"LocalProperty":{"$PropertyPath":l1.value.value},"SemanticObjectProperty":k1};if(i1.length>0){for(var i=0;i<i1.length;i++){if(i1[i]["LocalProperty"]["$PropertyPath"]!==m1["LocalProperty"]["$PropertyPath"]){i1.push(m1);}}}else{i1.push(m1);}}});}}return i1;}function d1(i,j){var i1=[];var j1={};var k1;var l1=i.controlConfiguration;for(var m1 in l1){if(m1.indexOf("@com.sap.vocabularies.UI.v1.DataPoint")>-1||m1.indexOf("@com.sap.vocabularies.UI.v1.Chart")>-1){if(l1[m1].navigation&&l1[m1].navigation.targetOutbound&&l1[m1].navigation.targetOutbound.outbound){var n1=l1[m1].navigation.targetOutbound.outbound;var o1=j[n1];if(o1.semanticObject&&o1.action){if(m1.indexOf("Chart")>-1){k1=a.generate(["fe","MicroChartLink",m1]);}else{k1=a.generate(["fe","HeaderDPLink",m1]);}var i1=h1.getSemanticObjectMapping(o1);j1[k1]={semanticObject:o1.semanticObject,action:o1.action,semanticObjectMapping:i1};}else{L.error("Cross navigation outbound is configured without semantic object and action for "+n1);}}}}return j1;}function e1(j,i1){var j1=typeof i1==="string"?JSON.parse(i1):i1;for(var i=0;i<j1.length;i++){var k1=(j1[i]["LocalProperty"]&&j1[i]["LocalProperty"]["$PropertyPath"])||(j1[i]["@com.sap.vocabularies.Common.v1.LocalProperty"]&&j1[i]["@com.sap.vocabularies.Common.v1.LocalProperty"]["$Path"]);var l1=j1[i]["SemanticObjectProperty"]||j1[i]["@com.sap.vocabularies.Common.v1.SemanticObjectProperty"];if(j.getSelectOption(k1)){var m1=j.getSelectOption(k1);j.removeSelectOption(k1);j.massAddSelectOption(l1,m1);}}return j;}function f1(i,j){var i1=i.getObject(j+"@com.sap.vocabularies.Common.v1.SemanticObject");var j1=i.getObject(j+"@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions");var k1;var l1;if(!(i1===undefined)){k1=[{semanticObject:i1}];l1={semanticObject:i1};}return{semanticObjectForGetLinks:k1,semanticObject:l1,unavailableActions:j1};}function g1(j,i1){var j1=function(B1,C1){return k1(B1,C1,[]);};var k1=function(B1,C1,D1){if(!B1){return D1;}if(B1 instanceof Array){for(var i in B1){D1=D1.concat(k1(B1[i],C1,[]));}return D1;}if(B1[C1]){D1.push(B1[C1]);}if(typeof B1=="object"&&B1!==null){var E1=Object.keys(B1);if(E1.length>0){for(i=0;i<E1.length;i++){D1=D1.concat(k1(B1[E1[i]],C1,[]));}}}return D1;};var l1=function(B1){return B1.filter(function(C1,D1){return B1.indexOf(C1)===D1;});};var m1=function(r1,z1){var B1=z1.substring(0,z1.lastIndexOf("/"));if(B1.lastIndexOf("/")===0){return z1;}else{var C1=z1.substring(z1.lastIndexOf("/")+1),D1=r1.getContext(B1),E1=c.getTargetEntitySet(D1);return E1+"/"+C1;}};var n1=j.getView();var o1=n1.getBindingContext("internal");if(o1){var p1=j.getOwnerComponent();var q1=sap.ui.core.Component.getOwnerComponentFor(p1);var r1=q1.getMetaModel();var s1=p1.getModel(i1).getData();if(JSON.stringify(s1)==="{}"){s1=p1.getModel(i1)._getObject("/",undefined);}var t1=j1(s1,"semanticObjectPath");t1=l1(t1);var u1=h1.getShellServices(q1);var v1=u1.hrefForExternal();var w1=[];var x1=[];var y1=[];var z1;var A1;if(v1&&v1.indexOf("?")!==-1){v1=v1.split("?")[0];}for(var i=0;i<t1.length;i++){z1=t1[i];A1=h1.getSemanticObjectsFromPath(r1,z1);if(A1.semanticObject){w1.push(A1.semanticObjectForGetLinks);x1.push({semanticObject:A1.semanticObject.semanticObject,unavailableActions:A1.unavailableActions,path:m1(r1,z1)});}}u1.getLinksWithCache(w1).then(function(B1){if(B1&&B1.length>0&&B1[0]!==undefined){var C1={};var D1={};var E1;var F1=function(G1){if(!(v1===G1.intent)){if(x1[i].unavailableActions&&x1[i].unavailableActions.find(function(H1){if(H1===G1.intent.split("-")[1]){return true;}})){return false;}else{y1[i].push(G1);}}};for(var i=0;i<B1.length;i++){y1.push([]);B1[i][0].forEach(F1);D1={semanticObject:x1[i].semanticObject,HasTargets:y1[i].length>0?true:false,HasTargetsNotFiltered:B1[i][0].length>0?true:false};if(C1[x1[i].semanticObject]===undefined){C1[x1[i].semanticObject]={};}E1=x1[i].path.replace(/\//g,"_");if(C1[x1[i].semanticObject][E1]===undefined){C1[x1[i].semanticObject][E1]={};}C1[x1[i].semanticObject][E1]=Object.assign(C1[x1[i].semanticObject][E1],D1);}o1.setProperty("semanticsTargets",C1);}}).catch(function(B1){L.error("fnGetSemanticTargets: Cannot read links",B1);});}}var h1={isPropertyFilterable:k,isFieldControlPathInapplicable:x,removeSensitiveData:y,fireButtonPress:r,getTargetView:t,hasTransientContext:h,updateRelatedAppsDetails:U,resolveStringtoBoolean:R,getAppComponent:s,processDataLossConfirmation:w,getMandatoryFilterFields:z,getEntitySetProperties:G,updateDataFieldForIBNButtonsVisibility:B,getTranslatedText:D,getEntitySetName:I,getActionPath:H,computeDisplayMode:J,setActionEnablement:K,isStickyEditMode:Z,getOperatorsForProperty:Q,addSelectionVariantToConditions:W,addExternalStateFiltersToSelectionVariant:Y,addPageContextToSelectionVariant:X,addDefaultDisplayCurrency:$,getNonComputedVisibleFields:a1,setUserDefaults:b1,getShellServices:l,getIBNActions:A,getHeaderFacetItemConfigForExternalNavigation:d1,getSemanticObjectMapping:c1,setSemanticObjectMappings:e1,getSemanticTargetsFromPageModel:g1,getSemanticObjectsFromPath:f1,getPropertyDataType:g};return h1;});
