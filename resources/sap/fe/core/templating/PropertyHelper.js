sap.ui.define(["sap/fe/core/helpers/BindingExpression"],function(B){"use strict";var _={};var o=B.or;var e=B.equal;var a=B.annotationExpression;function i(w){return w&&w.hasOwnProperty("_type")&&w._type==="Property";}_.isProperty=i;var b=function(P){var w,x;return!!((w=P.annotations)===null||w===void 0?void 0:(x=w.Core)===null||x===void 0?void 0:x.Computed);};_.isComputed=b;var c=function(P){var w,x;return!!((w=P.annotations)===null||w===void 0?void 0:(x=w.Core)===null||x===void 0?void 0:x.Immutable);};_.isImmutable=c;var d=function(P){return!!P.isKey;};_.isKey=d;var h=function(P){return["Edm.Date","Edm.DateTime","Edm.DateTimeOffset"].indexOf(P.type)!==-1;};_.hasDateType=h;var g=function(P){var w,x,y;return((w=P.annotations)===null||w===void 0?void 0:(x=w.Common)===null||x===void 0?void 0:(y=x.Label)===null||y===void 0?void 0:y.toString())||"";};_.getLabel=g;var f=function(P){var w,x;return!!((w=P.annotations)===null||w===void 0?void 0:(x=w.Common)===null||x===void 0?void 0:x.SemanticObject);};_.hasSemanticObject=f;var j=function(P){return o(k(P),m(P));};_.isNonEditableExpression=j;var k=function(P){var w,x;var F=(w=P.annotations)===null||w===void 0?void 0:(x=w.Common)===null||x===void 0?void 0:x.FieldControl;if(typeof F==="object"){return!!F&&e(a(F),1);}return F==="Common.FieldControlType/ReadOnly";};_.isReadOnlyExpression=k;var l=function(P){var w,x;var F=(w=P.annotations)===null||w===void 0?void 0:(x=w.Common)===null||x===void 0?void 0:x.FieldControl;if(typeof F==="object"){return!!F&&e(a(F),7);}return F==="Common.FieldControlType/Mandatory";};_.isRequiredExpression=l;var m=function(P){var w,x;var F=(w=P.annotations)===null||w===void 0?void 0:(x=w.Common)===null||x===void 0?void 0:x.FieldControl;if(typeof F==="object"){return!!F&&e(a(F),0);}return F==="Common.FieldControlType/Inapplicable";};_.isDisabledExpression=m;var n=function(w){return!!w&&w.type!==undefined&&w.type==="Path";};_.isPathExpression=n;var p=function(P){var w,x,y,z;return n((w=P.annotations)===null||w===void 0?void 0:(x=w.Measures)===null||x===void 0?void 0:x.Unit)?(y=P.annotations)===null||y===void 0?void 0:(z=y.Measures)===null||z===void 0?void 0:z.Unit.$target:undefined;};_.getAssociatedUnitProperty=p;var q=function(P){var w,x,y,z;return n((w=P.annotations)===null||w===void 0?void 0:(x=w.Measures)===null||x===void 0?void 0:x.ISOCurrency)?(y=P.annotations)===null||y===void 0?void 0:(z=y.Measures)===null||z===void 0?void 0:z.ISOCurrency.$target:undefined;};_.getAssociatedCurrencyProperty=q;var r=function(P){var w,x,y,z,A,C,D,E;return!!((w=P.annotations)===null||w===void 0?void 0:(x=w.Common)===null||x===void 0?void 0:x.ValueList)||!!((y=P.annotations)===null||y===void 0?void 0:(z=y.Common)===null||z===void 0?void 0:z.ValueListReferences)||!!((A=P.annotations)===null||A===void 0?void 0:(C=A.Common)===null||C===void 0?void 0:C.ValueListWithFixedValues)||!!((D=P.annotations)===null||D===void 0?void 0:(E=D.Common)===null||E===void 0?void 0:E.ValueListMapping);};_.hasValueHelp=r;var s=function(P){var w,x;return!!((w=P.annotations)===null||w===void 0?void 0:(x=w.Common)===null||x===void 0?void 0:x.ValueListWithFixedValues);};_.hasValueHelpWithFixedValues=s;var t=function(P){var w,x;return((w=P.annotations)===null||w===void 0?void 0:(x=w.Common)===null||x===void 0?void 0:x.ValueListForValidation)!==undefined;};_.hasValueListForValidation=t;var u=function(P){var w,x;return!!((w=P.annotations)===null||w===void 0?void 0:(x=w.Common)===null||x===void 0?void 0:x.IsUnit);};_.isUnit=u;var v=function(P){var w,x;return!!((w=P.annotations)===null||w===void 0?void 0:(x=w.Common)===null||x===void 0?void 0:x.IsCurrency);};_.isCurrency=v;return _;},false);