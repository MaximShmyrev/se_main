/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(){"use strict";var f=[],s=a(),S=[],t,r=/\w/;function b(i,B,n,x){if(B>=0){if(n){S[i].branchTracking[B].truthy+=1;}else{S[i].branchTracking[B].falsy+=1;}}if(x>=0){l(i,x);}return n;}function g(E,A,D){var V=parseInt(E.getAttribute(A));return V>0?V:D;}function a(){var s,x=document.getElementsByTagName("script"),i,n;for(i=0,n=x.length;i<n;i+=1){s=x[i];if(/BranchTracking.js$/.test(s.getAttribute("src"))){return s;}}}function c(i,n){var B=blanket.options("branchTracking"),x=false,D,y=f.length,z=i.inputFileName,A,E=i.inputFile,H;if(E.indexOf("// sap-ui-cover-browser msie")>=0){x=true;D=sap.ui.require("sap/ui/Device");if(D&&D.browser.msie){D=undefined;}}f.push(z);S[y]=_$blanket[z]=[];if(B){_$blanket[z].branchTracking=[];}_$blanket[z].source=E.split("\n");_$blanket[z].source.unshift("");_$blanket[z].warnings=[];H=""+falafel(E,{attachComment:x,comment:x,loc:true,range:true,source:E},v.bind(null,B,y,D));A=H.split("\n").length+1;if(A!==_$blanket[z].source.length){w(z,"Line length mismatch! "+_$blanket[z].source.length+" vs. "+A);}n(H);}function d(D,n){if(!("$ignored"in n)){if(n.parent&&d(D,n.parent)){n.$ignored=true;}else{n.$ignored=n.type==="BlockStatement"&&e(D,n);}}return n.$ignored;}function e(D,n){function i(x){return x.type==="Line"&&x.value===" sap-ui-cover-browser msie"&&!(D&&D.browser.msie);}return n.body[0]&&n.body[0].leadingComments&&n.body[0].leadingComments.some(i);}function l(i,n){S[i][n]+=1;}function v(B,i,D,n){var H=S[i],x=H.branchTracking,y=n.loc.start.line,z;function A(){n.update("blanket.$l("+i+", "+y+"); "+n.source());E();return true;}function E(){if(y in H){w(i,"Multiple statements on same line detected"+" – minified code not supported! Line number "+y);}H[y]=0;}function J(){var K=n.loc.source.slice(n.left.range[1],n.right.range[0]);if(K[0]===")"){K=K.slice(1);}if(K.slice(-1)==="("){K=K.slice(0,-1);}return K;}if(D&&d(D,n)){return false;}switch(n.type){case"FunctionDeclaration":case"FunctionExpression":if(n.body.body[0]&&y===n.body.body[0].loc.start.line){w(i,"Function body must not start on same line! Line number "+y);}break;default:}switch(n.type){case"AssignmentExpression":case"ArrayExpression":case"BlockStatement":case"BinaryExpression":case"Block":case"CallExpression":case"CatchClause":case"DebuggerStatement":case"EmptyStatement":case"FunctionExpression":case"Identifier":case"Line":case"Literal":case"MemberExpression":case"NewExpression":case"ObjectExpression":case"Program":case"Property":case"SequenceExpression":case"SwitchCase":case"ThisExpression":case"UnaryExpression":case"UpdateExpression":case"VariableDeclarator":return false;case"ConditionalExpression":if(!B){return false;}n.test.update("blanket.$b("+i+", "+x.length+", "+n.test.source()+")");x.push({alternate:n.alternate.loc,consequent:n.consequent.loc,falsy:0,truthy:0});return true;case"ExpressionStatement":if(n.expression.type==="Literal"&&n.expression.value==="use strict"){return false;}case"DoWhileStatement":case"ForInStatement":case"ForStatement":case"WhileStatement":case"WithStatement":case"BreakStatement":case"ContinueStatement":case"FunctionDeclaration":case"ReturnStatement":case"SwitchStatement":case"ThrowStatement":case"TryStatement":return A(n);case"IfStatement":if(e(undefined,n.consequent)){B=false;}n.test.update("blanket.$b("+i+", "+(B?x.length:-1)+", "+n.test.source()+", "+y+")");E();if(B){x.push({alternate:(n.alternate||n.test).loc,consequent:n.consequent.loc,falsy:0,truthy:0});}return true;case"LogicalExpression":if(!B){return false;}if(n.operator==="||"||n.operator==="&&"){z="blanket.$b("+i+", "+x.length+", "+n.left.source()+") "+J()+" ("+n.right.source()+")";if(!r.test(n.loc.source[n.range[0]])){z=" "+z;}n.update(z);x.push({alternate:n.operator==="&&"?n.left.loc:n.right.loc,consequent:n.operator==="&&"?n.right.loc:n.left.loc,falsy:0,truthy:0});}return true;case"VariableDeclaration":if(n.parent.type==="ForInStatement"||n.parent.type==="ForStatement"){return false;}return A(n);case"LabeledStatement":default:throw new Error(n.source());}}function w(i,M){var n=typeof i==="string"?i:f[i];jQuery.sap.log.warning(M,n,"sap.ui.test.BranchTracking");_$blanket[n].warnings.push(M);}function h(){var M={},i=[],n;QUnit.begin(function(D){n=D.modules.length;D.modules.forEach(function(x){M[x.name]=x;});});QUnit.moduleStart(function(x){i=i.concat(Object.keys(M).filter(function(y){return M[y].tests===x.tests;}));});return function(){return i.length<n?i:undefined;};}if(window.blanket){window._$blanket={};blanket.$b=b;blanket.$l=l;blanket.instrument=c;var G=h(),L=g(s,"data-lines-of-context",3);t=Math.min(g(s,"data-threshold",0),100);sap.ui.require(["sap/ui/test/BlanketReporter"],function(B){blanket.options("reporter",B.bind(null,L,t,G));});}var I,C="sap.ui.base.SyncPromise",F={},j,m,N=0,T,u={},U=new Map();function k(n,x){var B,H=_$blanket[n.$currentFileName],y=F[n.$currentFileName],z;if(n.$oldHits){z=Object.keys(H).filter(function(i){return!(y&&y[i])&&H[i]===n.$oldHits[i];});x.notOk(z.length,"Some lines have not been covered by this module in isolation: "+z);}if(n.$oldBranchTracking){B=Object.keys(H.branchTracking).filter(function(i){return H.branchTracking[i].falsy===n.$oldBranchTracking[i].falsy||H.branchTracking[i].truthy===n.$oldBranchTracking[i].truthy;});x.notOk(B.length,"Some branches have not been fully covered by this module in isolation: "+B);}}function o(R){var i,n=Object.keys(u).length+(U?U.size:0),M="Uncaught (in promise): "+n+" times\n",P,x,y,z;if(n){for(i in u){P=u[i];if(P.getResult()&&P.getResult().stack){M+=P.getResult().stack;}else{M+=P.getResult();}if(P.$error.stack){M+="\n>>> SyncPromise rejected with above reason...\n"+P.$error.stack.split("\n").slice(2).join("\n");}M+="\n\n";}u={};if(U&&U.size){z=U.values();for(;;){y=z.next();if(y.done){break;}x=y.value;M+=(x&&x.stack||x)+"\n\n";}U.clear();}if(R){R(M);}else if(I){jQuery.sap.log.info("Clearing "+n+" uncaught promises",M,C);}}}if(s.getAttribute("data-uncaught-in-promise")!=="true"){window.addEventListener("unhandledrejection",function(E){if(E.reason&&E.reason.$uncaughtInPromise){return;}if(U){U.set(E.promise,E.reason);E.preventDefault();}else{alert("Uncaught (in promise) "+E.reason);}});window.addEventListener("rejectionhandled",function(E){if(U){U.delete(E.promise);}});}function p(P,i){if(i){delete u[P.$id];if(I){jQuery.sap.log.info("Promise "+P.$id+" caught",Object.keys(u),C);}return;}P.$id=N++;P.$error=new Error();u[P.$id]=P;if(I){jQuery.sap.log.info("Promise "+P.$id+" rejected with "+P.getResult(),Object.keys(u),C);}}function q(i,H){var A,n,B,x;H=H||{};A=H.after||function(){};n=H.afterEach||function(){};B=H.before||function(){};x=H.beforeEach||function(){};H.after=function(y){if(window.blanket&&!j&&!T&&!this.__ignoreIsolatedCoverage__&&t>=100&&!y.test.module.stats.bad){k(this,y);}return A.apply(this,arguments);};H.afterEach=function(y){var z=o.bind(null,y.ok.bind(y,false));function D(J){z();throw J;}function E(R){if(R&&typeof R.then==="function"){return R.then(E,D);}z();return R;}try{return E(n.apply(this,arguments));}catch(J){D(J);}};H.before=function(y){var z;this.$currentFileName=jQuery.sap.getResourceName(y.test.module.name);z=window.blanket&&_$blanket[this.$currentFileName];if(z){this.$oldHits=z.slice();if(z.branchTracking){this.$oldBranchTracking=JSON.parse(JSON.stringify(z.branchTracking,["falsy","truthy"]));}z.warnings.forEach(function(M){y.ok(false,M);});}return B.apply(this,arguments);};H.beforeEach=function(y){o();return x.apply(this,arguments);};m(i,H);}if(QUnit.module!==q){m=QUnit.module.bind(QUnit);QUnit.module=q;sap.ui.require(["sap/base/Log","sap/base/util/UriParameters","sap/ui/base/SyncPromise"],function(i,n,x){var y=n.fromQuery(window.location.search);I=i.isLoggable(i.Level.INFO,C);j=y.get("filter");T=y.get("testId");x.listener=p;});QUnit.begin(function(){var i,H;jQuery("#qunit-modulefilter-dropdown-list").css("max-height","none");jQuery("#qunit-modulefilter-dropdown").on("click",function(M){if(M.target.tagName==="LABEL"){setTimeout(function(){jQuery("#qunit-modulefilter-actions").children().first().trigger("click");});}});if(window.blanket){for(i in _$blanket){H=_$blanket[i];F[i]=H.slice();}}});QUnit.done(function(){U=null;});}}());