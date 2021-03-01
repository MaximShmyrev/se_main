sap.ui.define(["../../ManifestSettings","../../templates/BaseConverter","../../helpers/ID","sap/fe/core/converters/controls/Common/Action","sap/fe/core/converters/helpers/ConfigurableObject","sap/fe/core/converters/annotations/DataField","sap/fe/core/helpers/BindingExpression","sap/fe/core/converters/helpers/BindingHelper","sap/fe/core/converters/helpers/Key","sap/fe/core/formatters/TableFormatter","sap/fe/core/formatters/TableFormatterTypes","sap/fe/core/templating/DataModelPathHelper","sap/fe/core/helpers/StableIdHelper","sap/fe/core/converters/helpers/IssueManager","sap/fe/core/templating/PropertyHelper","../../helpers/Aggregation"],function(M,B,I,A,C,D,a,b,K,t,T,c,S,d,P,e){"use strict";var _={};var f=e.AggregationHelper;var g=P.isProperty;var h=d.IssueType;var j=d.IssueSeverity;var k=d.IssueCategory;var r=S.replaceSpecialChars;var l=c.isPathInsertable;var m=c.isPathDeletable;var p=c.getTargetObjectPath;var q=T.MessageType;var s=K.KeyHelper;var U=b.UI;var u=b.Draft;var v=a.not;var w=a.and;var x=a.isConstant;var y=a.equal;var z=a.or;var E=a.ifElse;var F=a.formatResult;var G=a.constant;var H=a.compileBinding;var J=a.bindingExpression;var L=a.annotationExpression;var N=D.getSemanticObjectPath;var O=D.isDataFieldTypes;var Q=D.isDataFieldForActionAbstract;var R=D.isDataFieldAlwaysHidden;var V=D.collectRelatedProperties;var W=C.Placement;var X=C.insertCustomElements;var Y=A.removeDuplicateActions;var Z=A.isActionNavigable;var $=A.getActionsFromManifest;var a1=I.TableID;var b1=B.TemplateType;var c1=M.VisualizationType;var d1=M.VariantManagementType;var e1=M.SelectionMode;var f1=M.HorizontalAlign;var g1=M.CreationMode;var h1=M.AvailabilityType;var i1=M.ActionType;function j1(n,i){return o1(n)||n1(n,i)||l1(n,i)||k1();}function k1(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function l1(o,i){if(!o)return;if(typeof o==="string")return m1(o,i);var n=Object.prototype.toString.call(o).slice(8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return Array.from(n);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return m1(o,i);}function m1(n,o){if(o==null||o>n.length)o=n.length;for(var i=0,$1=new Array(o);i<o;i++){$1[i]=n[i];}return $1;}function n1(n,i){if(typeof Symbol==="undefined"||!(Symbol.iterator in Object(n)))return;var o=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=n[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){o.push(_s.value);if(i&&o.length===i)break;}}catch($1){_d=true;_e=$1;}finally{try{if(!_n&&_i["return"]!=null)_i["return"]();}finally{if(_d)throw _e;}}return o;}function o1(i){if(Array.isArray(i))return i;}function p1(o,i,n){if(i in o){Object.defineProperty(o,i,{value:n,enumerable:true,configurable:true,writable:true});}else{o[i]=n;}return o;}var q1;(function(q1){q1["Default"]="Default";q1["Annotation"]="Annotation";})(q1||(q1={}));function r1(i,n,o,$1){var _1=z1(i,n,o);return X(_1,$(o.getManifestControlConfiguration(n).actions,o,_1,$1,true),{isNavigable:"overwrite",enableOnSelect:"overwrite",enableAutoScroll:"overwrite"});}_.getTableActions=r1;function s1(i,n,o,$1){var _1=M1(i,n,o);var a2=O1(o.getManifestControlConfiguration(n).columns,_1,o,o.getAnnotationEntityType(i),$1);return X(_1,a2,{width:"overwrite",isNavigable:"overwrite",availability:"overwrite",settings:"overwrite"});}_.getTableColumns=s1;function t1(i,n,o,$1,_1){var a2=Z1(i,n,o,_1);var b2=X1(n),c2=b2.navigationPropertyPath;var d2=o.getDataModelObjectPath();var e2=d2.targetEntitySet?d2.targetEntitySet.name:d2.startingEntitySet.name,f2=c2.length===0;var g2=f2?e2:c2;var h2=o.getManifestWrapper().getNavigationConfiguration(g2);var i2=s1(i,n,o,h2);return{type:c1.Table,annotation:V1(i,n,o,a2,i2,$1),control:a2,actions:Y(r1(i,n,o,h2)),columns:i2};}_.createTableVisualization=t1;function u1(i){var n=Z1(undefined,"",i,false);var o=E1(i.getEntityType(),[],[],i);return{type:c1.Table,annotation:V1(undefined,"",i,n,o),control:n,actions:[],columns:o};}_.createDefaultTableVisualization=u1;function v1(i){return i.some(function(n){if(n.$Type==="com.sap.vocabularies.UI.v1.DataFieldForAction"){return n.Inline!==true;}else if(n.$Type==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){return n.Inline!==true&&n.RequiresContext;}});}function w1(i){var n=false;if(i){n=Object.keys(i).some(function(o){var $1=i[o];return $1.requiresSelection===true;});}return n;}function x1(i,n){var o=X1(i),$1=o.navigationPropertyPath;var _1=$1.split("/");var a2={isDeletable:true,isUpdatable:true};var b2=n.getEntitySet();var c2=function(){var h2,i2;var j2=[];_1.reduce(function(o2,p2){if(o2.length>0){o2+="/";}o2+=p2;j2.push(o2);return o2;},"");var k2=false,l2=false;(h2=b2.annotations.Capabilities)===null||h2===void 0?void 0:(i2=h2.NavigationRestrictions)===null||i2===void 0?void 0:i2.RestrictedProperties.forEach(function(o2){var p2;if((o2===null||o2===void 0?void 0:(p2=o2.NavigationProperty)===null||p2===void 0?void 0:p2.type)==="NavigationPropertyPath"){var q2,r2;if(((q2=o2.DeleteRestrictions)===null||q2===void 0?void 0:q2.Deletable)===false){k2=k2||j2.indexOf(o2.NavigationProperty.value)!==-1;}else if(((r2=o2.UpdateRestrictions)===null||r2===void 0?void 0:r2.Updatable)===false){l2=l2||j2.indexOf(o2.NavigationProperty.value)!==-1;}}});a2.isDeletable=!k2;a2.isUpdatable=!l2;var m2=_1.shift();if(m2){var n2=b2.entityType.navigationProperties.find(function(n2){return n2.name==m2;});if(n2&&!n2.containsTarget&&b2.navigationPropertyBinding.hasOwnProperty(m2)){b2=b2.navigationPropertyBinding[m2];}else{b2=undefined;}}};while((a2.isDeletable||a2.isUpdatable)&&b2&&_1.length>0){c2();}if(b2!==undefined&&b2.annotations){if(a2.isDeletable){var d2,e2;a2.isDeletable=((d2=b2.annotations.Capabilities)===null||d2===void 0?void 0:(e2=d2.DeleteRestrictions)===null||e2===void 0?void 0:e2.Deletable)!==false;}if(a2.isUpdatable){var f2,g2;a2.isUpdatable=((f2=b2.annotations.Capabilities)===null||f2===void 0?void 0:(g2=f2.UpdateRestrictions)===null||g2===void 0?void 0:g2.Updatable)!==false;}}return a2;}_.getCapabilityRestriction=x1;function y1(i,n,o,$1,_1){var a2;if(!i){return e1.None;}var b2=o.getManifestControlConfiguration(n);var c2=(a2=b2.tableSettings)===null||a2===void 0?void 0:a2.selectionMode;var d2=$(o.getManifestControlConfiguration(n).actions,o,[],undefined,false);var e2,f2;if(o.getTemplateType()===b1.ObjectPage){e2=m(o.getDataModelObjectPath(),undefined);f2=e2?H(e2,true):e2;}if(c2&&c2===e1.None){if(_1.isDeletable||f2!=="false"){return"{= ${ui>/editMode} === 'Editable' ? '"+e1.Multi+"' : 'None'}";}else{c2=e1.None;}}else if(!c2||c2===e1.Auto){c2=e1.Multi;}if(v1(i)||w1(d2)){return c2;}else if(_1.isDeletable||f2!=="false"){if(!$1){return"{= ${ui>/editMode} === 'Editable' ? '"+c2+"' : 'None'}";}else{return c2;}}return e1.None;}function z1(i,n,o){var $1=[];if(i){i.forEach(function(_1){var a2,b2;var c2;if(Q(_1)&&!(((a2=_1.annotations)===null||a2===void 0?void 0:(b2=a2.UI)===null||b2===void 0?void 0:b2.Hidden)===true)&&!_1.Inline&&!_1.Determining){var d2=s.generateKeyFromDataField(_1);switch(_1.$Type){case"com.sap.vocabularies.UI.v1.DataFieldForAction":c2={type:i1.DataFieldForAction,annotationPath:o.getEntitySetBasedAnnotationPath(_1.fullyQualifiedName),key:d2,isNavigable:true};break;case"com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":c2={type:i1.DataFieldForIntentBasedNavigation,annotationPath:o.getEntitySetBasedAnnotationPath(_1.fullyQualifiedName),key:d2};break;default:break;}}if(c2){$1.push(c2);}});}return $1;}function A1(i){var n;switch(i){case"UI.CriticalityType/Negative":n=q.Error;break;case"UI.CriticalityType/Critical":n=q.Warning;break;case"UI.CriticalityType/Positive":n=q.Success;break;case"UI.CriticalityType/Information":n=q.Information;break;case"UI.CriticalityType/Neutral":default:n=q.None;}return n;}function B1(i,n){var o=q.None;if(i){if(typeof i==="object"){o=L(i);}else{o=A1(i);}}return E(n&&u.IsNewObject,q.Information,F([o],t.rowHighlighting));}function C1(i,n,o,$1){var _1=($1===null||$1===void 0?void 0:$1.create)||($1===null||$1===void 0?void 0:$1.detail);if((_1===null||_1===void 0?void 0:_1.outbound)&&_1.outboundDetail&&($1===null||$1===void 0?void 0:$1.create)){return{mode:"External",outbound:_1.outbound,outboundDetail:_1.outboundDetail,navigationSettings:$1};}var a2;if(i){var b2,c2,d2,e2,f2;var g2=o.getAnnotationEntityType(i);var h2=(b2=o.getEntitySetForEntityType(g2))===null||b2===void 0?void 0:b2.annotations;a2=(h2===null||h2===void 0?void 0:(c2=h2.Common)===null||c2===void 0?void 0:(d2=c2.DraftRoot)===null||d2===void 0?void 0:d2.NewAction)||(h2===null||h2===void 0?void 0:(e2=h2.Session)===null||e2===void 0?void 0:(f2=e2.StickySessionSupported)===null||f2===void 0?void 0:f2.NewAction);if(n.creationMode===g1.CreationRow&&a2){throw Error("Creation mode '".concat(g1.CreationRow,"' can not be used with a custom 'new' action (").concat(a2,")"));}if(_1===null||_1===void 0?void 0:_1.route){return{mode:n.creationMode,append:n.createAtEnd,newAction:a2,navigateToTarget:n.creationMode===g1.NewPage?_1.route:undefined};}}if(n.creationMode===g1.NewPage){n.creationMode=g1.Inline;}return{mode:n.creationMode,append:n.createAtEnd,newAction:a2};}var D1=function(i,n,o,$1,_1){var a2,b2;var c2=q.None;var d2=o.getAnnotationEntityType(i);if($1&&i){var e2,f2;b2=((e2=$1.display)===null||e2===void 0?void 0:e2.target)||((f2=$1.detail)===null||f2===void 0?void 0:f2.outbound);if(b2){a2=".handlers.onChevronPressNavigateOutBound( $controller ,'"+b2+"', ${$parameters>bindingContext})";}else if(d2){var g2;var h2=o.getEntitySetForEntityType(d2);b2=(g2=$1.detail)===null||g2===void 0?void 0:g2.route;if(b2){var i2,j2,k2,l2,m2,n2,o2,p2,q2,r2;c2=B1((i2=i.annotations)===null||i2===void 0?void 0:(j2=i2.UI)===null||j2===void 0?void 0:j2.Criticality,!!(h2===null||h2===void 0?void 0:(k2=h2.annotations)===null||k2===void 0?void 0:(l2=k2.Common)===null||l2===void 0?void 0:l2.DraftRoot)||!!(h2===null||h2===void 0?void 0:(m2=h2.annotations)===null||m2===void 0?void 0:(n2=m2.Common)===null||n2===void 0?void 0:n2.DraftNode));a2="._routing.navigateForwardToContext(${$parameters>bindingContext}, { callExtension: true, targetPath: '"+_1+"', editable : "+((h2===null||h2===void 0?void 0:(o2=h2.annotations)===null||o2===void 0?void 0:(p2=o2.Common)===null||p2===void 0?void 0:p2.DraftRoot)||(h2===null||h2===void 0?void 0:(q2=h2.annotations)===null||q2===void 0?void 0:(r2=q2.Common)===null||r2===void 0?void 0:r2.DraftNode)?"!${$parameters>bindingContext}.getProperty('IsActiveEntity')":"undefined")+"})";}else{var s2,t2;c2=B1((s2=i.annotations)===null||s2===void 0?void 0:(t2=s2.UI)===null||t2===void 0?void 0:t2.Criticality,false);}}}var u2=F([J("/deepestPath","internal")],t.navigatedRow,d2);return{press:a2,action:a2?"Navigation":undefined,rowHighlighting:H(c2),rowNavigated:H(u2)};};var E1=function(i){var n=arguments.length>1&&arguments[1]!==undefined?arguments[1]:[];var o=arguments.length>2?arguments[2]:undefined;var $1=arguments.length>3?arguments[3]:undefined;var _1=[];var a2=new f(i,$1);i.entityProperties.forEach(function(b2){var c2=n.some(function(d2){return d2.name===b2.name;});if(!b2.targetType&&!c2){_1.push(F1(b2,$1.getEntitySetBasedAnnotationPath(b2.fullyQualifiedName),b2.name,true,true,o,a2,$1));}});return _1;};_.getColumnsFromEntityType=E1;var F1=function(i,n,o,$1,_1,a2,b2,c2,d2){var e2,f2;var g2=$1?o:"Property::"+o;var h2=($1?"DataField::":"Property::")+r(o);var i2=N(c2,i.fullyQualifiedName);var j2=((e2=i.annotations)===null||e2===void 0?void 0:(f2=e2.UI)===null||f2===void 0?void 0:f2.Hidden)===true;var k2=L1(i.name,true,false);var l2=k2!=i.name;var m2=d2?H1(d2):undefined;return{key:h2,isKey:i.isKey,isGroupable:b2.isPropertyGroupable(i),type:q1.Annotation,label:H1(i,l2),groupLabel:l2?H1(i):null,group:l2?k2:null,annotationPath:n,semanticObjectPath:i2,availability:!_1||j2?h1.Hidden:h1.Adaptation,name:g2,relativePath:o,sortable:!j2&&a2.indexOf(o)===-1,exportSettings:{label:m2?m2+" - "+H1(i):undefined}};};var G1=function(i){switch(i.$Type){case"com.sap.vocabularies.UI.v1.DataFieldForAction":case"com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":return!!i.Inline;case"com.sap.vocabularies.UI.v1.DataFieldWithAction":case"com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":return false;case"com.sap.vocabularies.UI.v1.DataField":case"com.sap.vocabularies.UI.v1.DataFieldWithUrl":case"com.sap.vocabularies.UI.v1.DataFieldForAnnotation":case"com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":return true;default:}};var H1=function(i){var n=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(!i){return undefined;}if(g(i)){var o,$1,_1;return((o=i.annotations)===null||o===void 0?void 0:($1=o.Common)===null||$1===void 0?void 0:(_1=$1.Label)===null||_1===void 0?void 0:_1.toString())||i.name;}else if(O(i)){var a2,b2,c2,d2,e2,f2;if(!!n&&i.$Type==="com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath"){return H(L(i.Label));}return((a2=i.Value)===null||a2===void 0?void 0:(b2=a2.$target)===null||b2===void 0?void 0:(c2=b2.annotations)===null||c2===void 0?void 0:(d2=c2.Common)===null||d2===void 0?void 0:d2.Label)||i.Label||((e2=i.Value)===null||e2===void 0?void 0:(f2=e2.$target)===null||f2===void 0?void 0:f2.name);}else{return H(L(i.Label));}};var I1=function(i,n,o,$1,_1){var a2=[];var b2={};var c2=new f(_1,$1);Object.keys(i).forEach(function(d2){var e2=i[d2],f2=e2.value,g2=e2.description,h2=$1.getAbsoluteAnnotationPath(d2),i2=n.find(function(k2){return k2.name===d2;});if(i2===undefined){a2.push(F1(f2,h2,d2,true,false,o,c2,$1,g2));}else if(i2.annotationPath!==h2){var j2="Property::"+d2;if(!n.some(function(k2){return k2.name===j2;})){a2.push(F1(f2,h2,d2,false,false,o,c2,$1));b2[d2]=j2;}}});n.forEach(function(d2){var e2;d2.propertyInfos=(e2=d2.propertyInfos)===null||e2===void 0?void 0:e2.map(function(f2){var g2;return(g2=b2[f2])!==null&&g2!==void 0?g2:f2;});});return a2;};var J1=function(i){var n,o,$1;if(O(i)){var _1;return(_1=i.Value)===null||_1===void 0?void 0:_1.path;}else if(i.$Type==="com.sap.vocabularies.UI.v1.DataFieldForAnnotation"&&((n=i.Target)===null||n===void 0?void 0:(o=n.$target)===null||o===void 0?void 0:($1=o.Value)===null||$1===void 0?void 0:$1.path)){return i.Target.$target.Value.path;}else{return s.generateKeyFromDataField(i);}};var K1=function(i){var n,o,$1,_1;var a2="";switch(i.$Type){case"com.sap.vocabularies.UI.v1.DataField":case"com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":a2=(n=i)===null||n===void 0?void 0:(o=n.Value)===null||o===void 0?void 0:o.path;break;case"com.sap.vocabularies.UI.v1.DataFieldForAnnotation":a2=($1=i)===null||$1===void 0?void 0:(_1=$1.Target)===null||_1===void 0?void 0:_1.value;break;case"com.sap.vocabularies.UI.v1.DataFieldForAction":case"com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":a2=s.generateKeyFromDataField(i);break;}return a2;};var L1=function(i,n,o){var $1=n?i.lastIndexOf("/"):i.indexOf("/");if($1===-1){return i;}return o?i.substring($1+1,i.length):i.substring(0,$1);};var M1=function(i,n,o){var $1,_1,a2,b2,c2,d2;var e2=o.getAnnotationEntityType(i),f2=[],g2={},h2=($1=(_1=(a2=o.getEntitySet())===null||a2===void 0?void 0:(b2=a2.annotations)===null||b2===void 0?void 0:(c2=b2.Capabilities)===null||c2===void 0?void 0:(d2=c2.SortRestrictions)===null||d2===void 0?void 0:d2.NonSortableProperties)===null||_1===void 0?void 0:_1.map(function(k2){return k2.value;}))!==null&&$1!==void 0?$1:[];if(i){i.forEach(function(k2){var l2,m2,n2,o2,p2;if(!G1(k2)){return;}var q2=O(k2)&&((l2=k2.Value)===null||l2===void 0?void 0:(m2=l2.$target)===null||m2===void 0?void 0:m2.fullyQualifiedName)?N(o,k2):undefined;var r2=K1(k2);var s2=V(k2,o);var t2=Object.keys(s2.properties);var u2=L1(r2,true,false);var v2=u2!=r2;f2.push({annotationPath:o.getEntitySetBasedAnnotationPath(k2.fullyQualifiedName),semanticObjectPath:q2,type:q1.Annotation,key:s.generateKeyFromDataField(k2),width:((n2=k2.annotations)===null||n2===void 0?void 0:(o2=n2.HTML5)===null||o2===void 0?void 0:(p2=o2.CssDefaults)===null||p2===void 0?void 0:p2.width)||undefined,availability:R(k2)?h1.Hidden:h1.Default,propertyInfos:t2.length>0?t2:undefined,name:J1(k2),groupLabel:v2?H1(k2):null,group:v2?u2:null,label:H1(k2,v2),relativePath:r2,isNavigable:true,sortable:k2.$Type==="com.sap.vocabularies.UI.v1.DataField"&&h2.indexOf(r2)===-1,exportSettings:{template:s2.exportSettingsTemplate}});t2.forEach(function(w2){g2[w2]=s2.properties[w2];});});}var i2=E1(e2,f2,h2,o);i2=i2.concat(f2);var j2=I1(g2,i2,h2,o,e2);i2=i2.concat(j2);return i2;};var N1=function(i,n,o,$1){var _1;if(i){_1=i.map(function(a2){var b2=n.find(function(b2){return b2.relativePath===a2&&b2.propertyInfos===undefined;});if(b2){return b2.name;}else{var c2=I1(p1({},a2,{value:$1.resolvePath(a2)}),n,[],o,$1);n.push(c2[0]);return c2[0].name;}});}return _1;};var O1=function(i,n,o,$1,_1){var a2={};for(var b2 in i){var c2;var d2=i[b2];s.validateKey(b2);a2[b2]={key:b2,id:"CustomColumn::"+b2,name:"CustomColumn::"+b2,header:d2.header,width:d2.width||undefined,horizontalAlign:d2.horizontalAlign===undefined?f1.Begin:d2.horizontalAlign,type:q1.Default,availability:d2.availability||h1.Default,template:d2.template||"undefined",position:{anchor:(c2=d2.position)===null||c2===void 0?void 0:c2.anchor,placement:d2.position===undefined?W.After:d2.position.placement},isNavigable:Z(d2,_1,true),settings:d2.settings,sortable:false,propertyInfos:N1(d2.properties,n,o,$1)};}return a2;};function P1(i,n){var o=n.getManifestWrapper();var $1=n.getManifestControlConfiguration(i);var _1=o.getVariantManagement();var a2=["Page","Control"].indexOf(_1)>-1;var b2=[];if(a2){var c2;if(($1===null||$1===void 0?void 0:(c2=$1.tableSettings)===null||c2===void 0?void 0:c2.personalization)!==undefined){var d2=$1.tableSettings.personalization;if(d2===true){return"Sort,Column,Filter";}else if(typeof d2==="object"){if(d2.sort){b2.push("Sort");}if(d2.column){b2.push("Column");}if(d2.filter){b2.push("Filter");}return b2.length>0?b2.join(","):undefined;}}else{b2.push("Sort");b2.push("Column");if(_1===d1.Control){b2.push("Filter");}return b2.join(",");}}return undefined;}_.getP13nMode=P1;function Q1(i,n){var o=false;if(i&&n){var $1,_1,a2;var b2=($1=i.navigationPropertyBinding[n])===null||$1===void 0?void 0:(_1=$1.annotations)===null||_1===void 0?void 0:(a2=_1.UI)===null||a2===void 0?void 0:a2.DeleteHidden;if(b2&&b2.path){if(b2.path.indexOf("/")>0){var c2=b2.path.split("/");var d2=c2[0];var e2=i.entityType.navigationProperties.find(function(h2){return h2.name===n;}).partner;if(e2===d2){o=b2;}}else{o=false;}}else{o=b2;}}else{var f2,g2;o=i&&((f2=i.annotations)===null||f2===void 0?void 0:(g2=f2.UI)===null||g2===void 0?void 0:g2.DeleteHidden);}return o;}function R1(i,n,o){var $1=i.getEntitySet();var _1=Q1($1,n);var a2,b2;if(i.getTemplateType()===b1.ObjectPage){a2=m(i.getDataModelObjectPath(),n);b2=a2?H(a2):a2;}if(b2==="false"){return false;}else if(b2&&_1!==true){if(_1){return"{= !${"+(n?n+"/":"")+_1.path+"} && ${ui>/editMode} === 'Editable'}";}else{return"{= ${ui>/editMode} === 'Editable'}";}}else if(_1===true||!o||i.getTemplateType()===b1.AnalyticalListPage){return false;}else if(i.getTemplateType()!==b1.ListReport){if(_1){return"{= !${"+(n?n+"/":"")+_1.path+"} && ${ui>/editMode} === 'Editable'}";}else{return"{= ${ui>/editMode} === 'Editable'}";}}else{return true;}}_.getDeleteVisible=R1;function S1(i,n,o){var $1,_1,a2,b2,c2;var d2=i.getEntitySet();var e2=i.getDataModelObjectPath();var f2=d2?L((d2===null||d2===void 0?void 0:($1=d2.annotations.UI)===null||$1===void 0?void 0:$1.CreateHidden)||false,e2.navigationProperties.map(function(i2){return i2.name;})):G(false);var g2=d2===null||d2===void 0?void 0:(_1=d2.annotations.Common)===null||_1===void 0?void 0:(a2=_1.DraftRoot)===null||a2===void 0?void 0:a2.NewAction;var h2=g2?L(i===null||i===void 0?void 0:(b2=i.getEntityType().actions[g2].annotations)===null||b2===void 0?void 0:(c2=b2.Core)===null||c2===void 0?void 0:c2.OperationAvailable,[],true):undefined;return E(z(z(y(h2,false),w(x(o),y(o,false),y(h2,undefined))),x(f2)&&y(f2,true),i.getTemplateType()===b1.AnalyticalListPage),false,E(z(n==="External",i.getTemplateType()===b1.ListReport),true,w(v(f2),U.IsEditable)));}_.getCreateVisible=S1;function T1(i,n,o){return E(y(S1(i,n.mode,o),true),i.getTemplateType()===b1.ObjectPage&&o,false);}_.getPasteEnabled=T1;function U1(i,n){var o;if(i===null||i===void 0?void 0:i.SortOrder){var $1=[];var _1={sorters:$1};i.SortOrder.forEach(function(a2){var b2,c2,d2,e2;var f2=(b2=a2.Property)===null||b2===void 0?void 0:(c2=b2.$target)===null||c2===void 0?void 0:c2.name;var g2=n.find(function(h2){return h2.name===f2;});g2===null||g2===void 0?void 0:(d2=g2.propertyInfos)===null||d2===void 0?void 0:d2.forEach(function(h2){_1.sorters.push({name:h2,descending:!!a2.Descending});});if(!(g2===null||g2===void 0?void 0:(e2=g2.propertyInfos)===null||e2===void 0?void 0:e2.length)){_1.sorters.push({name:f2,descending:!!a2.Descending});}});o=_1.sorters.length?JSON.stringify(_1):undefined;}return o;}function V1(i,n,o,$1,_1,a2){var b2,c2,d2;var e2=X1(n),f2=e2.navigationPropertyPath;var g2=(b2=o.getDataModelObjectPath().targetEntityType.annotations)===null||b2===void 0?void 0:(c2=b2.UI)===null||c2===void 0?void 0:(d2=c2.HeaderInfo)===null||d2===void 0?void 0:d2.TypeNamePlural;var h2=o.getDataModelObjectPath().startingEntitySet;var i2=o.getManifestWrapper();var j2=f2.length===0,k2=P1(n,o),id=j2&&h2?a1(h2.name,"LineItem"):a1(n);var m2=x1(n,o.getConverterContextFor(h2));var n2=y1(i,n,o,j2,m2);var o2=j2?30:10;if(a2===null||a2===void 0?void 0:a2.MaxItems){o2=a2.MaxItems;}var p2=j2&&h2?h2.name:f2;var q2=i2.getNavigationConfiguration(p2);var r2=C1(i,$1,o,q2);var s2,t2;if(o.getTemplateType()===b1.ObjectPage){var u2;s2=m(o.getDataModelObjectPath(),undefined,true);if((u2=s2)===null||u2===void 0?void 0:u2.currentEntityRestriction){t2=undefined;}else{t2=s2?H(s2,true):s2;}}var v2=o.getDataModelObjectPath();var w2=l(v2);return{id:id,entityName:h2?h2.name:"",collection:p(o.getDataModelObjectPath()),navigationPath:f2,isEntitySet:j2,row:D1(i,n,o,q2,p2),p13nMode:k2,show:{"delete":R1(o,f2,m2.isDeletable),create:H(S1(o,r2===null||r2===void 0?void 0:r2.mode,w2)),paste:H(T1(o,r2,w2))},displayMode:W1(o),create:r2,selectionMode:n2,autoBindOnInit:o.getTemplateType()===b1.ObjectPage,enableControlVM:i2.getVariantManagement()==="Control"&&!!k2,threshold:o2,sortConditions:U1(a2,_1),parentEntityDeleteEnabled:t2,title:g2};}_.getTableAnnotationConfiguration=V1;function W1(i){var n=i.getTemplateType();if(n===b1.AnalyticalListPage||n===b1.ListReport){return true;}return false;}function X1(i){var n=i.split("@"),o=j1(n,2),$1=o[0],_1=o[1];if($1.lastIndexOf("/")===$1.length-1){$1=$1.substr(0,$1.length-1);}return{navigationPropertyPath:$1,annotationPath:_1};}function Y1(i,n){var o=n.getEntityTypeAnnotation(i);var $1=o.annotation;if($1){var _1;var a2=[];(_1=$1.SelectOptions)===null||_1===void 0?void 0:_1.forEach(function(b2){var c2=b2.PropertyName;var d2=c2.value;if(a2.indexOf(d2)===-1){a2.push(d2);}});return{text:$1.Text,propertyNames:a2};}return undefined;}_.getSelectionVariantConfiguration=Y1;function Z1(i,n,o){var $1=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;var _1=o.getManifestControlConfiguration(n);var a2=_1.tableSettings;var b2;var c2=[];var d2=true;var e2=g1.NewPage;var f2;var g2=true;var h2=false;var i2=false;var j2=false;var k2="ResponsiveTable";var l2=false;var m2=200;var n2=o.getTemplateType()==="ObjectPage";var o2=o.getShellServices();var p2=o2===null||o2===void 0?void 0:o2.getContentDensity();var q2=o.getManifestWrapper().getContentDensities();if((q2===null||q2===void 0?void 0:q2.cozy)===true&&(q2===null||q2===void 0?void 0:q2.compact)!==true||p2==="cozy"){$1=false;}if(a2&&i){var r2,s2,t2,u2,v2,w2,x2;var y2=o.getAnnotationEntityType(i);a2===null||a2===void 0?void 0:(r2=a2.quickVariantSelection)===null||r2===void 0?void 0:(s2=r2.paths)===null||s2===void 0?void 0:s2.forEach(function(z2){var A2;b2=y2.resolvePath("@"+z2.annotationPath);if(b2){c2.push({annotationPath:z2.annotationPath});}f2={quickFilters:{enabled:o.getTemplateType()===b1.ListReport?"{= ${pageInternal>hasPendingFilters} !== true}":true,showCounts:a2===null||a2===void 0?void 0:(A2=a2.quickVariantSelection)===null||A2===void 0?void 0:A2.showCounts,paths:c2}};});e2=((t2=a2.creationMode)===null||t2===void 0?void 0:t2.name)||e2;g2=((u2=a2.creationMode)===null||u2===void 0?void 0:u2.createAtEnd)!==undefined?(v2=a2.creationMode)===null||v2===void 0?void 0:v2.createAtEnd:true;h2=!!((w2=a2.creationMode)===null||w2===void 0?void 0:w2.disableAddRowButtonForEmptyData);i2=a2.condensedTableLayout!==undefined?a2.condensedTableLayout:false;j2=!!((x2=a2.quickVariantSelection)===null||x2===void 0?void 0:x2.hideTableTitle);k2=(a2===null||a2===void 0?void 0:a2.type)||"ResponsiveTable";l2=a2.enableFullScreen||false;if(l2===true&&o.getTemplateType()===b1.ListReport){l2=false;o.getDiagnostics().addIssue(k.Manifest,j.Low,h.FULLSCREENMODE_NOT_ON_LISTREPORT);}m2=a2.selectAll===true||a2.selectionLimit===0?0:a2.selectionLimit||200;n2=o.getTemplateType()==="ObjectPage"&&a2.enablePaste!==false;d2=a2.enableExport!==undefined?a2.enableExport:o.getTemplateType()!=="ObjectPage"||n2;}return{filters:f2,type:k2,enableFullScreen:l2,headerVisible:!(b2&&j2),enableExport:d2,creationMode:e2,createAtEnd:g2,disableAddRowButtonForEmptyData:h2,useCondensedTableLayout:i2&&$1,selectionLimit:m2,enablePaste:n2};}_.getTableManifestConfiguration=Z1;return _;},false);