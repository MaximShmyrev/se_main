/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./AnnotationHelper","./ValueListType","./lib/_Helper","sap/base/assert","sap/base/Log","sap/base/util/isEmptyObject","sap/base/util/JSTokenizer","sap/base/util/ObjectPath","sap/ui/base/ManagedObject","sap/ui/base/SyncPromise","sap/ui/model/BindingMode","sap/ui/model/ChangeReason","sap/ui/model/ClientListBinding","sap/ui/model/Context","sap/ui/model/ContextBinding","sap/ui/model/MetaModel","sap/ui/model/PropertyBinding","sap/ui/model/odata/OperationMode","sap/ui/model/odata/type/Boolean","sap/ui/model/odata/type/Byte","sap/ui/model/odata/type/Date","sap/ui/model/odata/type/DateTimeOffset","sap/ui/model/odata/type/Decimal","sap/ui/model/odata/type/Double","sap/ui/model/odata/type/Guid","sap/ui/model/odata/type/Int16","sap/ui/model/odata/type/Int32","sap/ui/model/odata/type/Int64","sap/ui/model/odata/type/Raw","sap/ui/model/odata/type/SByte","sap/ui/model/odata/type/Single","sap/ui/model/odata/type/Stream","sap/ui/model/odata/type/String","sap/ui/model/odata/type/TimeOfDay","sap/ui/thirdparty/URI"],function(A,V,_,a,L,b,J,O,M,S,B,C,c,d,f,g,P,h,k,l,E,D,m,o,G,I,p,q,R,r,s,t,u,T,U){"use strict";var v=M.extend("sap.ui.model.odata.v4._any",{metadata:{properties:{any:"any"}}}),w,x=new Map(),y=L.Level.DEBUG,z=/\$\(/g,F=/^-?\d+$/,H,K,N="sap.ui.model.odata.v4.ODataMetaModel",Q,W=/\(.*\)$/,X=new R(),Y=/\$\)/g,Z=new Map(),$={messageChange:true},a1={"Edm.Boolean":{Type:k},"Edm.Byte":{Type:l},"Edm.Date":{Type:E},"Edm.DateTimeOffset":{constraints:{"$Precision":"precision"},Type:D},"Edm.Decimal":{constraints:{"@Org.OData.Validation.V1.Minimum/$Decimal":"minimum","@Org.OData.Validation.V1.Minimum@Org.OData.Validation.V1.Exclusive":"minimumExclusive","@Org.OData.Validation.V1.Maximum/$Decimal":"maximum","@Org.OData.Validation.V1.Maximum@Org.OData.Validation.V1.Exclusive":"maximumExclusive","$Precision":"precision","$Scale":"scale"},Type:m},"Edm.Double":{Type:o},"Edm.Guid":{Type:G},"Edm.Int16":{Type:I},"Edm.Int32":{Type:p},"Edm.Int64":{Type:q},"Edm.SByte":{Type:r},"Edm.Single":{Type:s},"Edm.Stream":{Type:t},"Edm.String":{constraints:{"@com.sap.vocabularies.Common.v1.IsDigitSequence":"isDigitSequence","$MaxLength":"maxLength"},Type:u},"Edm.TimeOfDay":{constraints:{"$Precision":"precision"},Type:T}},b1={},c1="@com.sap.vocabularies.Common.v1.ValueList",d1="@com.sap.vocabularies.Common.v1.ValueListMapping",e1="@com.sap.vocabularies.Common.v1.ValueListReferences",f1="@com.sap.vocabularies.Common.v1.ValueListRelevantQualifiers",g1="@com.sap.vocabularies.Common.v1.ValueListWithFixedValues",h1=L.Level.WARNING;function i1(e,i,j,n){var r1,s1=e.mSchema2MetadataUrl[i];if(!s1){s1=e.mSchema2MetadataUrl[i]={};s1[j]=false;}else if(!(j in s1)){r1=Object.keys(s1)[0];if(s1[r1]){o1(e,"A schema cannot span more than one document: "+i+" - expected reference URI "+r1+" but instead saw "+j,n);}s1[j]=false;}}function j1(e,i,j,n){var r1,s1,t1,u1;function v1(w1){var x1,y1;if(!(j in w1)){n(h1,s1," does not contain ",j);return;}n(y,"Including ",j," from ",s1);for(y1 in w1){if(y1[0]!=="$"&&p1(y1)===j){x1=w1[y1];i[y1]=x1;n1(x1,i.$Annotations);}}}if(j in i){return i[j];}u1=e.mSchema2MetadataUrl[j];if(u1){t1=Object.keys(u1);if(t1.length>1){o1(e,"A schema cannot span more than one document: "+"schema is referenced by following URLs: "+t1.join(", "),j);}s1=t1[0];u1[s1]=true;n(y,"Namespace ",j," found in $Include of ",s1);r1=e.mMetadataUrl2Promise[s1];if(!r1){n(y,"Reading ",s1);r1=e.mMetadataUrl2Promise[s1]=S.resolve(e.oRequestor.read(s1)).then(e.validate.bind(e,s1));}r1=r1.then(v1);if(j in i){return i[j];}i[j]=r1;return r1;}}function k1(e,i){if(e===i){return"";}if(e.startsWith(i)&&e[i.length]==="#"&&e.indexOf("@",i.length)<0){return e.slice(i.length+1);}}function l1(e){var i=k1(e,d1);return i!==undefined?i:k1(e,c1);}function m1(n,e){return e.some(function(i){return n==="$ReturnType"?i.$ReturnType:i.$Parameter&&i.$Parameter.some(function(j){return j.$Name===n;});});}function n1(e,i,j){var n;function r1(s1,t1){var u1;for(u1 in t1){if(j||!(u1 in s1)){s1[u1]=t1[u1];}}}for(n in e.$Annotations){if(!(n in i)){i[n]={};}r1(i[n],e.$Annotations[n]);}delete e.$Annotations;}function o1(e,i,j){var n=new Error(j+": "+i);e.oModel.reportError(i,N,n);throw n;}function p1(e){return e.slice(0,e.lastIndexOf(".")+1);}H=f.extend("sap.ui.model.odata.v4.ODataMetaContextBinding",{constructor:function(e,i,j){a(!j||j.getModel()===e,"oContext must belong to this model");f.call(this,e,i,j);},initialize:function(){var e=this.oModel.createBindingContext(this.sPath,this.oContext);this.bInitial=false;if(e!==this.oElementContext){this.oElementContext=e;this._fireChange();}},setContext:function(e){a(!e||e.getModel()===this.oModel,"oContext must belong to this model");if(e!==this.oContext){this.oContext=e;if(!this.bInitial){this.initialize();}}}});K=c.extend("sap.ui.model.odata.v4.ODataMetaListBinding",{constructor:function(){c.apply(this,arguments);},_fireFilter:function(){},_fireSort:function(){},checkUpdate:function(e){var i=this.oList.length;this.update();if(e||this.oList.length!==i){this._fireChange({reason:C.Change});}},fetchContexts:function(){var i,e=this.oModel.resolve(this.sPath,this.oContext),j=this;if(!e){return S.resolve([]);}i=e.endsWith("@");if(!i&&!e.endsWith("/")){e+="/";}return this.oModel.fetchObject(e).then(function(n){if(!n){return[];}if(i){e=e.slice(0,-1);}return Object.keys(n).filter(function(r1){return r1[0]!=="$"&&i!==(r1[0]!=="@");}).map(function(r1){return new d(j.oModel,e+r1);});});},getContexts:function(i,e){this.iCurrentStart=i||0;this.iCurrentLength=Math.min(e||Infinity,this.iLength-this.iCurrentStart);return this.getCurrentContexts();},getCurrentContexts:function(){var e=[],i,n=this.iCurrentStart+this.iCurrentLength;for(i=this.iCurrentStart;i<n;i+=1){e.push(this.oList[this.aIndices[i]]);}if(this.oList.dataRequested){e.dataRequested=true;}return e;},setContexts:function(e){this.oList=e;this.updateIndices();this.applyFilter();this.applySort();this.iLength=this._getLength();},update:function(){var e=[],i=this.fetchContexts(),j=this;if(i.isFulfilled()){e=i.getResult();}else{i.then(function(e){j.setContexts(e);j._fireChange({reason:C.Change});});e.dataRequested=true;}this.setContexts(e);}});Q=P.extend("sap.ui.model.odata.v4.ODataMetaPropertyBinding",{constructor:function(){P.apply(this,arguments);this.vValue=undefined;},checkUpdate:function(e,i){var j,n=this;function r1(s1){if(e||s1!==n.vValue){n.vValue=s1;n._fireChange({reason:i||C.Change});}return s1;}j=this.oModel.fetchObject(this.sPath,this.oContext,this.mParameters).then(r1);if(this.mParameters&&this.mParameters.$$valueAsPromise&&j.isPending()){r1(j.unwrap());}else if(j.isRejected()){j.unwrap();}},getValue:function(){return this.vValue;},setContext:function(e){if(this.oContext!==e){this.oContext=e;if(this.bRelative){this.checkUpdate(false,C.Context);}}},setValue:function(){throw new Error("Unsupported operation: ODataMetaPropertyBinding#setValue");}});var q1=g.extend("sap.ui.model.odata.v4.ODataMetaModel",{constructor:function(e,i,j,n,r1){g.call(this);this.aAnnotationUris=j&&!Array.isArray(j)?[j]:j;this.sDefaultBindingMode=B.OneTime;this.mETags={};this.dLastModified=new Date(0);this.oMetadataPromise=null;this.oModel=n;this.mMetadataUrl2Promise={};this.oRequestor=e;this.mSchema2MetadataUrl={};this.mSupportedBindingModes={"OneTime":true,"OneWay":true};this.bSupportReferences=r1!==false;this.mUnsupportedFilterOperators={"All":true,"Any":true};this.sUrl=i;}});q1.prototype.$$valueAsPromise=true;q1.prototype._mergeAnnotations=function(e,j){var n=this;this.validate(this.sUrl,e);e.$Annotations={};Object.keys(e).forEach(function(i){if(e[i].$kind==="Schema"){i1(n,i,n.sUrl);n1(e[i],e.$Annotations);}});j.forEach(function(r1,i){var s1,t1;n.validate(n.aAnnotationUris[i],r1);for(t1 in r1){if(t1[0]!=="$"){if(t1 in e){o1(n,"A schema cannot span more than one document: "+t1,n.aAnnotationUris[i]);}s1=r1[t1];e[t1]=s1;if(s1.$kind==="Schema"){i1(n,t1,n.aAnnotationUris[i]);n1(s1,e.$Annotations,true);}}}});};q1.prototype.attachEvent=function(e){if(!(e in $)){throw new Error("Unsupported event '"+e+"': v4.ODataMetaModel#attachEvent");}return g.prototype.attachEvent.apply(this,arguments);};q1.prototype.bindContext=function(e,i){return new H(this,e,i);};q1.prototype.bindList=function(e,i,j,n){return new K(this,e,i,j,n);};q1.prototype.bindProperty=function(e,i,j){return new Q(this,e,i,j);};q1.prototype.bindTree=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#bindTree");};q1.prototype.fetchCanonicalPath=function(e){return this.fetchUpdateData("",e).then(function(i){if(!i.editUrl){throw new Error(e.getPath()+": No canonical path for transient entity");}if(i.propertyPath){throw new Error("Context "+e.getPath()+" does not point to an entity. It should be "+i.entityPath);}return"/"+i.editUrl;});};q1.prototype.fetchData=function(){return this.fetchEntityContainer().then(function(e){return JSON.parse(JSON.stringify(e));});};q1.prototype.fetchEntityContainer=function(e){var i,j=this;if(!this.oMetadataPromise){i=[S.resolve(this.oRequestor.read(this.sUrl,false,e))];if(this.aAnnotationUris){this.aAnnotationUris.forEach(function(n){i.push(S.resolve(j.oRequestor.read(n,true,e)));});}if(!e){this.oMetadataPromise=S.all(i).then(function(n){var r1=n[0];j._mergeAnnotations(r1,n.slice(1));return r1;});}}return this.oMetadataPromise;};q1.prototype.fetchObject=function(j,n,r1){var s1=this.resolve(j,n),t1=this;if(!s1){L.error("Invalid relative path w/o context",j,N);return S.resolve(null);}return this.fetchEntityContainer().then(function(u1){var v1,w1,x1,y1,z1,A1,B1,C1,D1,E1;function F1(e,i,N1){var O1,P1,Q1,R1,S1="";if(i){P1=i.indexOf("@@");if(P1>0){i=i.slice(0,P1);}}else{i=e;}N1=N1||"";if(v1){B1=R1=E1.filter(I1);if(R1.length!==1){return J1(h1,"Expected a single overload, but found "+R1.length);}if(v1!==b1){S1=R1[0].$Parameter[0].$isCollection?"Collection("+v1+")":v1;}Q1=D1+"("+S1+")"+N1;if(u1.$Annotations[Q1]){if(i==="@"){E1=u1.$Annotations[Q1];O1=u1.$Annotations[D1+N1];if(O1){E1=Object.assign({},O1,E1);}return false;}if(i in u1.$Annotations[Q1]){D1=Q1;E1=u1;return true;}}}D1+=N1;E1=u1;return true;}function G1(i,j){var N1,O1,P1,Q1=i.indexOf("@",2);if(Q1>-1){return J1(h1,"Unsupported path after ",i.slice(0,Q1));}i=i.slice(2);P1=i.indexOf("(");if(P1>0){if(!i.endsWith(")")){return J1(h1,"Expected ')' instead of '",i.slice(-1),"'");}try{O1=J.parseJS("["+i.slice(P1+1,-1).replace(z,"{").replace(Y,"}")+"]");}catch(e){return J1(h1,e.message,": ",e.text.slice(1,e.at),"<--",e.text.slice(e.at,-1));}i=i.slice(0,P1);}N1=i[0]==="."?O.get(i.slice(1),r1.scope):r1&&O.get(i,r1.scope)||(i==="requestCurrencyCodes"||i==="requestUnitsOfMeasure"?t1[i].bind(t1):O.get(i));if(typeof N1!=="function"){return J1(h1,i," is not a function but: "+N1);}try{E1=N1(E1,{$$valueAsPromise:r1&&r1.$$valueAsPromise,arguments:O1,context:new d(t1,j),schemaChildName:C1,overload:B1.length===1?B1[0]:undefined});}catch(e){J1(h1,"Error calling ",i,": ",e);}return true;}function H1(e,i){var N1;if(e==="$ReturnType"){if(i.$ReturnType){E1=i.$ReturnType;return true;}}else if(e&&i.$Parameter){N1=i.$Parameter.filter(function(O1){return O1.$Name===e;});if(N1.length){E1=N1[0];return true;}}return false;}function I1(e){return!e.$IsBound&&v1===b1||e.$IsBound&&v1===e.$Parameter[0].$Type;}function J1(i){var e;if(L.isLoggable(i,N)){e=Array.isArray(y1)?y1.join("/"):y1;L[i===y?"debug":"warning"](Array.prototype.slice.call(arguments,1).join("")+(e?" at /"+e:""),s1,N);}if(i===h1){E1=undefined;}return false;}function K1(e,i){var N1;function O1(){y1=y1||D1&&i&&D1+"/"+i;return J1.apply(this,arguments);}v1=E1&&E1.$Type||v1;if(t1.bSupportReferences&&!(e in u1)){N1=p1(e);E1=j1(t1,u1,N1,O1);}if(e in u1){D1=z1=C1=e;E1=B1=u1[C1];if(!S.isThenable(E1)){return true;}}if(S.isThenable(E1)&&E1.isPending()){return O1(y,"Waiting for ",N1);}return O1(h1,"Unknown qualified name ",e);}function L1(e,i,N1){var O1,P1;if(e==="$Annotations"){return J1(h1,"Invalid segment: $Annotations");}if(i&&typeof E1==="object"&&e in E1){if(e[0]==="$"||F.test(e)){A1=false;}}else{O1=e.indexOf("@@");if(O1<0){if(e.endsWith("@sapui.name")){O1=e.length-11;}else{O1=e.indexOf("@");}}if(O1>0){if(!L1(e.slice(0,O1),i,N1)){return false;}e=e.slice(O1);P1=true;if(E1&&(E1.$kind==="EntitySet"||E1.$kind==="Singleton")){w1=E1;}}if(typeof E1==="string"&&!(P1&&(e==="@sapui.name"||e[1]==="@"))&&!M1(E1,N1.slice(0,i))){return false;}if(A1){if(e[0]==="$"&&e!=="$Parameter"&&e!=="$ReturnType"||F.test(e)){A1=false;}else{if(P1){}else if(e[0]!=="@"&&e.indexOf(".")>0){return K1(e);}else if(E1&&"$Type"in E1){if(!K1(E1.$Type,"$Type")){return false;}}else if(E1&&"$Action"in E1){if(!K1(E1.$Action,"$Action")){return false;}v1=b1;}else if(E1&&"$Function"in E1){if(!K1(E1.$Function,"$Function")){return false;}v1=b1;}else if(!i){D1=z1=C1=C1||u1.$EntityContainer;E1=B1=B1||u1[C1];if(Array.isArray(E1)&&H1(e,E1[0])){return true;}if(e&&e[0]!=="@"&&!(e in B1)){return J1(h1,"Unknown child ",e," of ",C1);}}if(Array.isArray(E1)){if(e==="$Parameter"){return true;}if(e.startsWith("@$ui5.overload@")){e=e.slice(14);P1=true;}if(P1){if(e[1]!=="@"&&!F1(e)){return false;}}else{if(e!==N1[i]&&N1[i][e.length+1]!=="@"&&m1(e,E1)){z1=e;return F1(e,N1[i].slice(e.length),"/"+z1);}if(v1){E1=E1.filter(I1);}if(e==="@$ui5.overload"){return true;}if(E1.length!==1){return J1(h1,"Expected a single overload, but found "+E1.length);}if(H1(e,E1[0])){return true;}E1=E1[0].$ReturnType;D1+="/0/$ReturnType";if(E1){if(e==="value"&&!(u1[E1.$Type]&&u1[E1.$Type].value)){z1=undefined;return true;}if(!K1(E1.$Type,"$Type")){return false;}}if(!e){return true;}}}}}if(!e){return i+1>=N1.length||J1(h1,"Invalid empty segment");}if(e[0]==="@"){if(e==="@sapui.name"){E1=z1;if(E1===undefined){J1(h1,"Unsupported path before @sapui.name");}else if(i+1<N1.length){J1(h1,"Unsupported path after @sapui.name");}return false;}if(e[1]==="@"){if(i+1<N1.length){return J1(h1,"Unsupported path after ",e);}return G1(e,[""].concat(N1.slice(0,i),N1[i].slice(0,O1)).join("/"));}}if(!E1||typeof E1!=="object"){E1=undefined;return!x1&&J1(y,"Invalid segment: ",e);}if(A1&&e[0]==="@"){v1=E1.$Type||v1;E1=u1.$Annotations[D1]||{};A1=false;}else if(e==="$"&&i+1<N1.length){return J1(h1,"Unsupported path after $");}}if(e!=="@"&&e!=="$"){if(e[0]==="@"){x1=true;}z1=A1||e[0]==="@"?e:undefined;D1=A1?D1+"/"+e:undefined;E1=E1[e];}return true;}function M1(e,i){var N1;if(y1){return J1(h1,"Invalid recursion");}y1=i;x1=false;A1=true;E1=u1;if(w1){if(!e){E1=w1;w1=y1=undefined;return true;}C1=w1.$Type;w1=B1=undefined;}N1=e.split("/").every(L1);y1=undefined;return N1;}if(!M1(s1.slice(1))&&S.isThenable(E1)){E1=E1.then(function(){return t1.fetchObject(j,n,r1);});}return E1;});};q1.prototype.fetchUI5Type=function(e,i){var j=this.getMetaContext(e),n=this;if(e.endsWith("/$count")){w=w||new q();return S.resolve(w);}return this.fetchObject(undefined,j).catch(function(){}).then(function(r1){var s1=X,t1;if(!r1){L.warning("No metadata for path '"+e+"', using "+s1.getName(),undefined,N);return s1;}if(i){if(b(i)){i=undefined;}else if("parseKeepsEmptyString"in i&&r1.$Type!=="Edm.String"){if(Object.keys(i).length===1){i=undefined;}else{i=Object.assign({},i);delete i.parseKeepsEmptyString;}}}if(!i&&r1["$ui5.type"]){return r1["$ui5.type"];}if(r1.$isCollection){L.warning("Unsupported collection type, using "+s1.getName(),e,N);}else{t1=a1[r1.$Type];if(t1){s1=new t1.Type(i,n.getConstraints(r1,j.getPath()));}else{L.warning("Unsupported type '"+r1.$Type+"', using "+s1.getName(),e,N);}}if(!i){r1["$ui5.type"]=s1;}return s1;});};q1.prototype.fetchUpdateData=function(e,j,n){var r1=j.getModel(),s1=r1.resolve(e,j),t1=this;function u1(i){var v1=new Error(s1+": "+i);r1.reportError(i,N,v1);throw v1;}return this.fetchObject(this.getMetaPath(s1)).then(function(){return t1.fetchEntityContainer();}).then(function(v1){var w1,x1=v1[v1.$EntityContainer],y1,z1,A1,B1,C1=false,D1,E1,F1,G1;function H1(L1){var i=L1.indexOf("(");return i>=0?L1.slice(i):"";}function I1(i){w1.push({path:D1,prefix:i,type:G1});}function J1(L1){var i=L1.indexOf("(");return i>=0?L1.slice(0,i):L1;}function K1(i){if(i.includes("($uid=")){I1(J1(i));}else{w1.push(i);}}F1=s1.slice(1).split("/");B1=F1.shift();D1="/"+B1;y1=D1;A1=decodeURIComponent(J1(B1));z1=x1[A1];if(!z1){u1("Not an entity set: "+A1);}G1=v1[z1.$Type];e="";E1="";w1=[];K1(B1);F1.forEach(function(i){var L1,M1;D1+="/"+i;if(F.test(i)){I1(w1.pop());y1+="/"+i;}else{M1=decodeURIComponent(J1(i));E1=_.buildPath(E1,M1);L1=C1?{}:G1[M1];if(!L1){if(M1.includes("@")){if(M1.includes("@$ui5.")){u1("Read-only path must not be updated");}C1=true;L1={};}else{u1("Not a (navigation) property: "+M1);}}G1=v1[L1.$Type];if(L1.$kind==="NavigationProperty"){if(z1.$NavigationPropertyBinding&&E1 in z1.$NavigationPropertyBinding){A1=z1.$NavigationPropertyBinding[E1];z1=x1[A1];E1="";w1=[encodeURIComponent(A1)+H1(i)];if(!L1.$isCollection){I1(w1.pop());}}else{K1(i);}y1=D1;e="";}else{e=_.buildPath(e,i);}}});if(n){return S.resolve({editUrl:undefined,entityPath:y1,propertyPath:e});}return S.all(w1.map(function(i){if(typeof i==="string"){return i;}return j.fetchValue(i.path).then(function(L1){var M1;if(!L1){u1("No instance to calculate key predicate at "+i.path);}if(_.hasPrivateAnnotation(L1,"transient")){n=true;return undefined;}M1=_.getPrivateAnnotation(L1,"predicate");if(!M1){u1("No key predicate known at "+i.path);}return i.prefix+M1;},function(L1){u1(L1.message+" at "+i.path);});})).then(function(i){return{editUrl:n?undefined:i.join("/"),entityPath:y1,propertyPath:e};});});};q1.prototype.fetchValueListMappings=function(e,i,j,n){var r1=this,s1=e.getMetaModel();function t1(){var u1=n[0],v1="";if(n.length!==1){throw new Error("Expected a single overload, but found "+n.length);}if(u1.$IsBound){v1=u1.$Parameter[0].$isCollection?"Collection("+u1.$Parameter[0].$Type+")":u1.$Parameter[0].$Type;}return i+"("+v1+")";}return s1.fetchEntityContainer().then(function(u1){var v1,w1=u1.$Annotations,x1,y1=_.namespace(i),z1={},A1=r1===s1,B1,C1;if(j.$Name){x1=t1()+"/"+j.$Name;C1=i+"/"+j.$Name;}B1=Object.keys(w1).filter(function(D1){if(_.namespace(D1)===y1){if(x1?D1===x1||D1===C1:r1.getObject("/"+D1)===j){return true;}if(A1||C1&&_.getMetaPath(D1)===C1){return false;}throw new Error("Unexpected annotation target '"+D1+"' with namespace of data service in "+e.sServiceUrl);}return false;});if(!B1.length){throw new Error("No annotation '"+c1.slice(1)+"' in "+e.sServiceUrl);}if(B1.length===1){v1=w1[B1[0]];}else{v1=Object.assign({},w1[C1],w1[x1]);}Object.keys(v1).forEach(function(D1){var E1=l1(D1);if(E1!==undefined){z1[E1]=v1[D1];["CollectionRoot","SearchSupported"].forEach(function(F1){if(F1 in v1[D1]){throw new Error("Property '"+F1+"' is not allowed in annotation '"+D1.slice(1)+"' for target '"+B1[0]+"' in "+e.sServiceUrl);}});}else if(!A1){throw new Error("Unexpected annotation '"+D1.slice(1)+"' for target '"+B1[0]+"' with namespace of data service in "+e.sServiceUrl);}});return z1;});};q1.prototype.fetchValueListType=function(e){var i=this.getMetaContext(e),j=this;return this.fetchObject(undefined,i).then(function(n){var r1,s1;if(!n){throw new Error("No metadata for "+e);}r1=j.getObject("@",i);if(r1[g1]){return V.Fixed;}for(s1 in r1){if(k1(s1,e1)!==undefined||k1(s1,d1)!==undefined){return V.Standard;}if(k1(s1,c1)!==undefined){return r1[s1].SearchSupported===false?V.Fixed:V.Standard;}}return V.None;});};q1.prototype.getAbsoluteServiceUrl=function(e){var i=new U(this.sUrl).absoluteTo(document.baseURI).pathname().toString();return new U(e).absoluteTo(i).filename("").toString();};q1.prototype.getAllPathReductions=function(e,n,r1,s1){var t1=n.split("/").length,u1,v1={},w1=e.split("/"),x1=this;function y1(j,z1,A1,B1){var i,C1,D1;function E1(F1){if(!r1){y1(j,z1,i-1,true);}if(B1){z1=z1.slice();j=j.slice();}z1.splice(i,F1);j.splice(i,F1);if(!r1){v1[j.join("/")]=true;}}for(i=A1;i>=t1;i-=1){C1=F.test(j[i+1])?i+2:i+1;if(C1<j.length&&z1[i].$Partner===j[C1]&&!z1[C1].$isCollection&&z1[C1].$Partner===j[i].replace(W,"")){E1(C1-i+1);}else if(Array.isArray(z1[i])&&j[i+1]==="$Parameter"){D1=x1.getObject(x1.getMetaPath(j.slice(0,i+1).join("/")+"/@$ui5.overload"));if(D1.length===1&&D1[0].$Parameter[0].$Name===j[i+2]){E1(3);}}else if(s1&&z1[i].$isCollection){break;}}}u1=w1.map(function(i,j){return j<t1||i[0]==="#"||i[0]==="@"||F.test(i)||i==="$Parameter"?{}:x1.getObject(x1.getMetaPath(w1.slice(0,j+1).join("/")))||{};});v1[e]=true;if(!(s1&&u1[w1.length-1].$isCollection)){y1(w1,u1,w1.length-2);}return r1?w1.join("/"):Object.keys(v1);};q1.prototype.getConstraints=function(e,i){var j,n,r1,s1=a1[e.$Type];function t1(u1,v1){if(v1!==undefined){n=n||{};n[u1]=v1;}}if(s1){r1=s1.constraints;for(j in r1){t1(r1[j],j[0]==="@"?this.getObject(i+j):e[j]);}if(e.$Nullable===false){t1("nullable",false);}}return n;};q1.prototype.getData=_.createGetMethod("fetchData");q1.prototype.getETags=function(){return this.mETags;};q1.prototype.getLastModified=function(){return this.dLastModified;};q1.prototype.getMetaContext=function(e){return new d(this,this.getMetaPath(e));};q1.prototype.getMetaPath=function(e){return _.getMetaPath(e);};q1.prototype.getObject=_.createGetMethod("fetchObject");q1.prototype.getOrCreateSharedModel=function(e,i,j){var n,r1;e=this.getAbsoluteServiceUrl(e);n=!!j+e;r1=Z.get(n);if(!r1){r1=new this.oModel.constructor({autoExpandSelect:j,groupId:i,httpHeaders:this.oModel.getHttpHeaders(),operationMode:h.Server,serviceUrl:e,sharedRequests:true,synchronizationMode:"None"});Z.set(n,r1);}return r1;};q1.prototype.getOriginalProperty=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#getOriginalProperty");};q1.prototype.getProperty=q1.prototype.getObject;q1.prototype.getReducedPath=function(e,i){return this.getAllPathReductions(e,i,true,true);};q1.prototype.getUI5Type=_.createGetMethod("fetchUI5Type",true);q1.prototype.getUnitOrCurrencyPath=function(e){var i=this.getObject("@",this.getMetaContext(e)),j=i&&(i["@Org.OData.Measures.V1.Unit"]||i["@Org.OData.Measures.V1.ISOCurrency"]);return j&&j.$Path;};q1.prototype.getValueListType=_.createGetMethod("fetchValueListType",true);q1.prototype.isList=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#isList");};q1.prototype.refresh=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#refresh");};q1.prototype.requestCodeList=function(e,i,j){var n=this.fetchEntityContainer().getResult(),r1=n[n.$EntityContainer],s1=this;if(j&&j.context){if(j.context.getModel()!==this||j.context.getPath()!=="/"){throw new Error("Unsupported context: "+j.context);}}if(i!==undefined&&i!==r1){throw new Error("Unsupported raw value: "+i);}return this.requestObject("/@com.sap.vocabularies.CodeList.v1."+e).then(function(t1){var u1,v1,w1,x1,y1;if(!t1){return null;}u1=s1.getAbsoluteServiceUrl(t1.Url)+"#"+t1.CollectionPath;x1=x.get(u1);if(x1){return x1;}w1=s1.getOrCreateSharedModel(t1.Url,"$direct");v1=w1.getMetaModel();y1="/"+t1.CollectionPath+"/";x1=v1.requestObject(y1).then(function(z1){var A1=y1+"@Org.OData.Core.V1.AlternateKeys",B1=v1.getObject(A1),C1,D1=L1(z1.$Key),E1=y1+D1+"@com.sap.vocabularies.Common.v1.",F1,G1,H1=y1+D1+"@com.sap.vocabularies.CodeList.v1.StandardCode/$Path",I1,J1;function K1(M1,N1){var O1=N1.getProperty(D1),P1={Text:N1.getProperty(J1),UnitSpecificScale:N1.getProperty(G1)};if(I1){P1.StandardCode=N1.getProperty(I1);}if(P1.UnitSpecificScale===null){L.error("Ignoring customizing w/o unit-specific scale for code "+O1+" from "+t1.CollectionPath,t1.Url,N);}else{M1[O1]=P1;}return M1;}function L1(M1){var N1;if(M1&&M1.length===1){N1=M1[0];}else{throw new Error("Single key expected: "+y1);}return typeof N1==="string"?N1:N1[Object.keys(N1)[0]];}if(B1){if(B1.length!==1){throw new Error("Single alternative expected: "+A1);}else if(B1[0].Key.length!==1){throw new Error("Single key expected: "+A1+"/0/Key");}D1=B1[0].Key[0].Name.$PropertyPath;}G1=v1.getObject(E1+"UnitSpecificScale/$Path");J1=v1.getObject(E1+"Text/$Path");F1=[D1,G1,J1];I1=v1.getObject(H1);if(I1){F1.push(I1);}C1=w1.bindList("/"+t1.CollectionPath,null,null,null,{$select:F1});return C1.requestContexts(0,Infinity).then(function(M1){if(!M1.length){L.error("Customizing empty for ",w1.sServiceUrl+t1.CollectionPath,N);}return M1.reduce(K1,{});}).finally(function(){C1.destroy();});});x.set(u1,x1);return x1;});};q1.prototype.requestCurrencyCodes=function(e,i){return this.requestCodeList("CurrencyCodes",e,i);};q1.prototype.requestData=_.createRequestMethod("fetchData");q1.prototype.requestObject=_.createRequestMethod("fetchObject");q1.prototype.requestUI5Type=_.createRequestMethod("fetchUI5Type");q1.prototype.requestUnitsOfMeasure=function(e,i){return this.requestCodeList("UnitsOfMeasure",e,i);};q1.prototype.requestValue4Annotation=function(e,i,j){var n=new v({any:A.value(e,{context:this.createBindingContext(i)}),bindingContexts:j,models:j.getModel()}),r1=n.getBinding("any"),s1;if(r1){if(r1.getBindings){s1=Promise.all(r1.getBindings().map(function(t1){return t1.requestValue();}));}else{s1=r1.requestValue();}}else{s1=Promise.resolve();}return s1.then(function(){return n.getAny();});};q1.prototype.requestValueListInfo=function(e,i,j){var n=this.getMetaPath(e),r1=n.slice(0,n.lastIndexOf("/")).replace("/$Parameter",""),s1=r1.slice(r1.lastIndexOf("/")+1),t1=this;if(!s1.includes(".")){s1=undefined;}return Promise.all([s1||this.requestObject(r1+"/@sapui.name"),this.requestObject(n),this.requestObject(n+"@"),this.requestObject(n+g1),this.requestObject(r1+"/@$ui5.overload")]).then(function(u1){var v1=u1[2],w1=u1[3],x1={},y1=u1[1],z1={};function A1(B1,C1,D1,E1){if(w1!==undefined&&"SearchSupported"in B1){throw new Error("Must not set 'SearchSupported' in annotation "+"'com.sap.vocabularies.Common.v1.ValueList' and annotation "+"'com.sap.vocabularies.Common.v1.ValueListWithFixedValues'");}if("CollectionRoot"in B1){E1=t1.getOrCreateSharedModel(B1.CollectionRoot,undefined,i);if(z1[C1]&&z1[C1].$model===E1){x1[C1]=undefined;}}if(x1[C1]){throw new Error("Annotations '"+c1.slice(1)+"' with identical qualifier '"+C1+"' for property "+e+" in "+x1[C1]+" and "+D1);}x1[C1]=D1;B1=_.clone(B1);B1.$model=E1;delete B1.CollectionRoot;delete B1.SearchSupported;z1[C1]=B1;}if(!y1){throw new Error("No metadata for "+e);}return Promise.all(Object.keys(v1).filter(function(B1){return k1(B1,e1)!==undefined;}).map(function(B1){var C1=v1[B1];return Promise.all(C1.map(function(D1){var E1=t1.getOrCreateSharedModel(D1,undefined,i);return t1.fetchValueListMappings(E1,u1[0],y1,u1[4]).then(function(F1){Object.keys(F1).forEach(function(G1){A1(F1[G1],G1,D1,E1);});});}));})).then(function(){var B1;Object.keys(v1).filter(function(C1){return l1(C1)!==undefined;}).forEach(function(C1){A1(v1[C1],l1(C1),t1.sUrl,t1.oModel);});B1=Object.keys(z1);if(!B1.length){throw new Error("No annotation '"+e1.slice(1)+"' for "+e);}if(w1){if(B1.length>1){throw new Error("Annotation '"+g1.slice(1)+"' but multiple '"+c1.slice(1)+"' for property "+e);}return{"":z1[B1[0]]};}B1=v1[f1];return B1&&j&&j.getBinding?t1.filterValueListRelevantQualifiers(z1,B1,n+f1,j):z1;});});};q1.prototype.filterValueListRelevantQualifiers=function(e,i,j,n){return this.requestValue4Annotation(i,j,n).then(function(r1){var s1={};r1.forEach(function(t1){if(t1 in e){s1[t1]=e[t1];}});return s1;});};q1.prototype.requestValueListType=_.createRequestMethod("fetchValueListType");q1.prototype.resolve=function(e,i){var j,n;if(!e){return i?i.getPath():undefined;}n=e[0];if(n==="/"){return e;}if(!i){return undefined;}if(n==="."){if(e[1]!=="/"){throw new Error("Unsupported relative path: "+e);}e=e.slice(2);}j=i.getPath();return n==="@"||j.endsWith("/")?j+e:j+"/"+e;};q1.prototype.setLegacySyntax=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#setLegacySyntax");};q1.prototype.toString=function(){return N+": "+this.sUrl;};q1.prototype.validate=function(e,j){var i,n,r1,s1,t1,u1;if(!this.bSupportReferences){return j;}for(u1 in j.$Reference){t1=j.$Reference[u1];u1=new U(u1).absoluteTo(this.sUrl).toString();if("$IncludeAnnotations"in t1){o1(this,"Unsupported IncludeAnnotations",e);}for(i in t1.$Include){s1=t1.$Include[i];if(s1 in j){o1(this,"A schema cannot span more than one document: "+s1+" - is both included and defined",e);}i1(this,s1,u1,e);}}r1=j.$LastModified?new Date(j.$LastModified):null;this.mETags[e]=j.$ETag?j.$ETag:r1;n=j.$Date?new Date(j.$Date):new Date();r1=r1||n;if(this.dLastModified<r1){this.dLastModified=r1;}delete j.$Date;delete j.$ETag;delete j.$LastModified;return j;};return q1;});
