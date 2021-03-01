sap.ui.define(["sap/fe/core/converters/helpers/ConfigurableObject","sap/fe/core/converters/helpers/ID","sap/fe/core/helpers/BindingExpression","sap/fe/core/converters/helpers/Key","../Common/Form","sap/fe/core/converters/annotations/DataField"],function(C,I,B,K,F,D){"use strict";var _={};var g=D.getSemanticObjectPath;var a=F.getFormElementsFromManifest;var b=F.FormElementType;var c=K.KeyHelper;var n=B.not;var e=B.equal;var d=B.compileBinding;var f=B.annotationExpression;var H=I.HeaderFacetID;var h=I.HeaderFacetFormID;var j=I.HeaderFacetContainerID;var k=I.CustomHeaderFacetID;var P=C.Placement;var l=C.insertCustomElements;function o(i,N){var O=Object.keys(i);if(Object.getOwnPropertySymbols){var Q=Object.getOwnPropertySymbols(i);if(N)Q=Q.filter(function(R){return Object.getOwnPropertyDescriptor(i,R).enumerable;});O.push.apply(O,Q);}return O;}function m(N){for(var i=1;i<arguments.length;i++){var O=arguments[i]!=null?arguments[i]:{};if(i%2){o(Object(O),true).forEach(function(Q){p(N,Q,O[Q]);});}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(N,Object.getOwnPropertyDescriptors(O));}else{o(Object(O)).forEach(function(Q){Object.defineProperty(N,Q,Object.getOwnPropertyDescriptor(O,Q));});}}return N;}function p(i,N,O){if(N in i){Object.defineProperty(i,N,{value:O,enumerable:true,configurable:true,writable:true});}else{i[N]=O;}return i;}var q;(function(q){q["Annotation"]="Annotation";q["XMLFragment"]="XMLFragment";})(q||(q={}));_.HeaderFacetType=q;var r;(function(r){r["Reference"]="Reference";r["Collection"]="Collection";})(r||(r={}));_.FacetType=r;var s;(function(s){s["Default"]="Default";s["NotAdaptable"]="not-adaptable";s["NotAdaptableTree"]="not-adaptable-tree";s["NotAdaptableVisibility"]="not-adaptable-visibility";})(s||(s={}));_.FlexDesignTimeType=s;var t;(function(t){t["ProgressIndicator"]="ProgressIndicator";t["RatingIndicator"]="RatingIndicator";t["Content"]="Content";})(t||(t={}));var T;(function(T){T["None"]="None";T["DataPoint"]="DataPoint";T["Chart"]="Chart";T["Identification"]="Identification";T["Contact"]="Contact";T["Address"]="Address";T["FieldGroup"]="FieldGroup";})(T||(T={}));function u(i){var N,O,Q;var R=[];(N=i.getEntityType().annotations)===null||N===void 0?void 0:(O=N.UI)===null||O===void 0?void 0:(Q=O.HeaderFacets)===null||Q===void 0?void 0:Q.forEach(function(S){var U=J(S,i);if(U){R.push(U);}});return R;}_.getHeaderFacetsFromAnnotations=u;function v(i){var N={};Object.keys(i).forEach(function(O){var Q=i[O];N[O]=M(Q,O);});return N;}_.getHeaderFacetsFromManifest=v;function w(i,N,O){var Q=s.Default;var R=i.ID;if(i.$Type==="com.sap.vocabularies.UI.v1.ReferenceFacet"&&N.$Type==="com.sap.vocabularies.UI.v1.CollectionFacet"){Q=s.NotAdaptableTree;}else{var S=O.getManifestControlConfiguration("@com.sap.vocabularies.UI.v1.HeaderFacets");if(R){var U,V,W;var X=S===null||S===void 0?void 0:(U=S.facets)===null||U===void 0?void 0:(V=U[R])===null||V===void 0?void 0:(W=V.flexSettings)===null||W===void 0?void 0:W.designtime;switch(X){case s.NotAdaptable:case s.NotAdaptableTree:case s.NotAdaptableVisibility:Q=X;}}}return Q;}function x(i,N,O){var Q,R;if(i.$Type==="com.sap.vocabularies.UI.v1.ReferenceFacet"&&!(((Q=i.annotations)===null||Q===void 0?void 0:(R=Q.UI)===null||R===void 0?void 0:R.Hidden)===true)){var S;var U=H({Facet:i}),V=function(i,a1){var b1,c1;return((b1=i.ID)===null||b1===void 0?void 0:b1.toString())||((c1=i.Label)===null||c1===void 0?void 0:c1.toString())||a1;},W=i.Target.value,X=z(i);var Y;var Z;switch(X){case T.FieldGroup:Y=A(i,O);break;case T.DataPoint:Z=G(i);break;}var $=i.annotations;return{type:q.Annotation,facetType:r.Reference,id:U,containerId:j({Facet:i}),key:V(i,U),flexSettings:{designtime:w(i,N,O)},visible:d(n(e(f($===null||$===void 0?void 0:(S=$.UI)===null||S===void 0?void 0:S.Hidden),true))),annotationPath:O.getEntitySetBasedAnnotationPath(i.fullyQualifiedName)+"/",targetAnnotationValue:W,targetAnnotationType:X,headerFormData:Y,headerDataPointData:Z};}return undefined;}function y(i,N){if(i.$Type==="com.sap.vocabularies.UI.v1.CollectionFacet"){var O,Q;var R=[],S=H({Facet:i}),U=function(V,W){var X,Y;return((X=V.ID)===null||X===void 0?void 0:X.toString())||((Y=V.Label)===null||Y===void 0?void 0:Y.toString())||W;};i.Facets.forEach(function(V){var W=x(V,i,N);if(W){R.push(W);}});return{type:q.Annotation,facetType:r.Collection,id:S,containerId:j({Facet:i}),key:U(i,S),flexSettings:{designtime:w(i,i,N)},visible:d(n(e(f((O=i.annotations)===null||O===void 0?void 0:(Q=O.UI)===null||Q===void 0?void 0:Q.Hidden),true))),annotationPath:N.getEntitySetBasedAnnotationPath(i.fullyQualifiedName)+"/",facets:R};}return undefined;}function z(i){var N=T.None;var O={"com.sap.vocabularies.UI.v1.DataPoint":T.DataPoint,"com.sap.vocabularies.UI.v1.Chart":T.Chart,"com.sap.vocabularies.UI.v1.Identification":T.Identification,"com.sap.vocabularies.Communication.v1.Contact":T.Contact,"com.sap.vocabularies.Communication.v1.Address":T.Address,"com.sap.vocabularies.UI.v1.FieldGroup":T.FieldGroup};if(i.$Type!=="com.sap.vocabularies.UI.v1.ReferenceURLFacet"&&i.$Type!=="com.sap.vocabularies.UI.v1.CollectionFacet"){var Q,R;N=O[(Q=i.Target)===null||Q===void 0?void 0:(R=Q.$target)===null||R===void 0?void 0:R.term]||T.None;}return N;}function A(i,N){if(!i){throw new Error("Cannot get FieldGroup form data without facet definition");}var O=l(E(i,N),a(i,N));return{id:h({Facet:i}),label:i.Label,formElements:O};}function E(i,N){var O=[];if(i.$Type!=="com.sap.vocabularies.UI.v1.ReferenceURLFacet"&&i.$Type!=="com.sap.vocabularies.UI.v1.CollectionFacet"){var Q,R;(Q=i.Target)===null||Q===void 0?void 0:(R=Q.$target)===null||R===void 0?void 0:R.Data.forEach(function(S){var U,V;if(!(((U=S.annotations)===null||U===void 0?void 0:(V=U.UI)===null||V===void 0?void 0:V.Hidden)===true)){var W=g(N,S);if(S.$Type==="com.sap.vocabularies.UI.v1.DataField"){var X,Y,Z,$,a1,b1,c1,d1,e1,f1,g1;var h1=S.annotations;O.push({isValueMultilineText:((X=S.Value)===null||X===void 0?void 0:(Y=X.$target)===null||Y===void 0?void 0:(Z=Y.annotations)===null||Z===void 0?void 0:($=Z.UI)===null||$===void 0?void 0:$.MultiLineText)===true,type:b.Annotation,key:c.generateKeyFromDataField(S),visible:d(n(e(f(h1===null||h1===void 0?void 0:(a1=h1.UI)===null||a1===void 0?void 0:a1.Hidden),true))),label:((b1=S.Value)===null||b1===void 0?void 0:(c1=b1.$target)===null||c1===void 0?void 0:(d1=c1.annotations)===null||d1===void 0?void 0:(e1=d1.Common)===null||e1===void 0?void 0:e1.Label)||S.Label,idPrefix:h({Facet:i},S),valueFormat:((f1=S.Value)===null||f1===void 0?void 0:(g1=f1.$target)===null||g1===void 0?void 0:g1.type)==="Edm.Date"?"long":undefined,annotationPath:N.getEntitySetBasedAnnotationPath(S.fullyQualifiedName)+"/",semanticObjectPath:W});}else if(S.$Type==="com.sap.vocabularies.UI.v1.DataFieldForAnnotation"){var i1,j1,k1,l1,m1,n1,o1,p1,q1,r1,s1;var t1=S.annotations;O.push({isValueMultilineText:((i1=S.Target)===null||i1===void 0?void 0:(j1=i1.$target)===null||j1===void 0?void 0:(k1=j1.annotations)===null||k1===void 0?void 0:(l1=k1.UI)===null||l1===void 0?void 0:l1.MultiLineText)===true,type:b.Annotation,key:c.generateKeyFromDataField(S),visible:d(n(e(f(t1===null||t1===void 0?void 0:(m1=t1.UI)===null||m1===void 0?void 0:m1.Hidden),true))),label:((n1=S.Target)===null||n1===void 0?void 0:(o1=n1.$target)===null||o1===void 0?void 0:(p1=o1.annotations)===null||p1===void 0?void 0:(q1=p1.Common)===null||q1===void 0?void 0:q1.Label)||S.Label,idPrefix:h({Facet:i},S),valueFormat:((r1=S.Target)===null||r1===void 0?void 0:(s1=r1.$target)===null||s1===void 0?void 0:s1.type)==="Edm.Date"?"long":undefined,annotationPath:N.getEntitySetBasedAnnotationPath(S.fullyQualifiedName)+"/",semanticObjectPath:W});}}});}return O;}function G(i){var N=t.Content;if(i.$Type==="com.sap.vocabularies.UI.v1.ReferenceFacet"){var O,Q,R,S;if(((O=i.Target)===null||O===void 0?void 0:(Q=O.$target)===null||Q===void 0?void 0:Q.Visualization)==="UI.VisualizationType/Progress"){N=t.ProgressIndicator;}else if(((R=i.Target)===null||R===void 0?void 0:(S=R.$target)===null||S===void 0?void 0:S.Visualization)==="UI.VisualizationType/Rating"){N=t.RatingIndicator;}}return{type:N};}function J(i,N){var O;switch(i.$Type){case"com.sap.vocabularies.UI.v1.ReferenceFacet":O=x(i,i,N);break;case"com.sap.vocabularies.UI.v1.CollectionFacet":O=y(i,N);break;}return O;}function L(i){if(!i){return undefined;}var N=["Heroes","Decoration","Workers","LongRunners"].indexOf(i)!==-1?"$auto."+i:i;return"{ path : '', parameters : { $$groupId : '"+N+"' } }";}function M(i,N){var O=k(N);var Q=i.position;if(!Q){Q={placement:P.After};}return{facetType:r.Reference,facets:[],type:i.type,id:O,containerId:O,key:N,position:Q,visible:i.visible,fragmentName:i.name,title:i.title,subTitle:i.subTitle,stashed:i.stashed||false,flexSettings:m({},{designtime:s.Default},{},i.flexSettings),binding:L(i.requestGroupId)};}return _;},false);