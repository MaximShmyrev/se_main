/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
/**
 * This module is overall:
 * SPDX-FileCopyrightText: 2009-2021 SAP SE or an SAP affiliate company and OpenUI5 contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * but contains code has been taken from the component JSON in JavaScript (https://github.com/douglascrockford/JSON-js/blob/master/json2.js) from Douglas Crockford which is licensed under Public Domain:
 * SPDX-FileCopyrightText: Douglas Crockford
 * SPDX-License-Identifier: LicenseRef-JSONinJSPublicDomain
 */
sap.ui.define([],function(){"use strict";
/*
	 * The following code has been taken from the component JSON in JavaScript
	 * from Douglas Crockford which is licensed under Public Domain
	 * (http://www.json.org/ > JavaScript > json-2). The code contains
	 * local modifications.
	 *
	 * Git URL: https://github.com/douglascrockford/JSON-js/blob/ff55d8d4513b149e2511aee01c3a61d372837d1f/json_parse.js
	 */
var J=function(){this.at;this.ch;this.escapee={'"':'"','\'':'\'','\\':'\\','/':'/',b:'\b',f:'\f',n:'\n',r:'\r',t:'\t'};this.text;};J.prototype.error=function(m){throw{name:'SyntaxError',message:m,at:this.at,text:this.text};};J.prototype.next=function(c){if(c&&c!==this.ch){this.error("Expected '"+c+"' instead of '"+this.ch+"'");}this.ch=this.text.charAt(this.at);this.at+=1;return this.ch;};J.prototype.number=function(){var n,s='';if(this.ch==='-'){s='-';this.next('-');}while(this.ch>='0'&&this.ch<='9'){s+=this.ch;this.next();}if(this.ch==='.'){s+='.';while(this.next()&&this.ch>='0'&&this.ch<='9'){s+=this.ch;}}if(this.ch==='e'||this.ch==='E'){s+=this.ch;this.next();if(this.ch==='-'||this.ch==='+'){s+=this.ch;this.next();}while(this.ch>='0'&&this.ch<='9'){s+=this.ch;this.next();}}n=+s;if(!isFinite(n)){this.error("Bad number");}else{return n;}};J.prototype.string=function(){var h,i,s='',q,u;if(this.ch==='"'||this.ch==='\''){q=this.ch;while(this.next()){if(this.ch===q){this.next();return s;}if(this.ch==='\\'){this.next();if(this.ch==='u'){u=0;for(i=0;i<4;i+=1){h=parseInt(this.next(),16);if(!isFinite(h)){break;}u=u*16+h;}s+=String.fromCharCode(u);}else if(typeof this.escapee[this.ch]==='string'){s+=this.escapee[this.ch];}else{break;}}else{s+=this.ch;}}}this.error("Bad string");};J.prototype.name=function(){var n='',a=function(c){return c==="_"||c==="$"||(c>="0"&&c<="9")||(c>="a"&&c<="z")||(c>="A"&&c<="Z");};if(a(this.ch)){n+=this.ch;}else{this.error("Bad name");}while(this.next()){if(this.ch===' '){this.next();return n;}if(this.ch===':'){return n;}if(a(this.ch)){n+=this.ch;}else{this.error("Bad name");}}this.error("Bad name");};J.prototype.white=function(){while(this.ch&&this.ch<=' '){this.next();}};J.prototype.word=function(){switch(this.ch){case't':this.next('t');this.next('r');this.next('u');this.next('e');return true;case'f':this.next('f');this.next('a');this.next('l');this.next('s');this.next('e');return false;case'n':this.next('n');this.next('u');this.next('l');this.next('l');return null;}this.error("Unexpected '"+this.ch+"'");};J.prototype.array=function(){var a=[];if(this.ch==='['){this.next('[');this.white();if(this.ch===']'){this.next(']');return a;}while(this.ch){a.push(this.value());this.white();if(this.ch===']'){this.next(']');return a;}this.next(',');this.white();}}this.error("Bad array");};var o=function(){var k,o={};if(this.ch==='{'){this.next('{');this.white();if(this.ch==='}'){this.next('}');return o;}while(this.ch){if(this.ch>="0"&&this.ch<="9"){k=this.number();}else if(this.ch==='"'||this.ch==='\''){k=this.string();}else{k=this.name();}this.white();this.next(':');if(Object.hasOwnProperty.call(o,k)){this.error('Duplicate key "'+k+'"');}o[k]=this.value();this.white();if(this.ch==='}'){this.next('}');return o;}this.next(',');this.white();}}this.error("Bad object");};J.prototype.value=function(){this.white();switch(this.ch){case'{':return o.call(this);case'[':return this.array();case'"':case'\'':return this.string();case'-':return this.number();default:return this.ch>='0'&&this.ch<='9'?this.number():this.word();}};J.prototype.getIndex=function(){return this.at-1;};J.prototype.getCh=function(){return this.ch;};J.prototype.init=function(s,i){this.text=s;this.at=i||0;this.ch=' ';};J.prototype.setIndex=function(i){if(i<this.at-1){throw new Error("Must not set index "+i+" before previous index "+(this.at-1));}this.at=i;this.next();};J.parseJS=function(s,S){var j=new J();var r;j.init(s,S);r=j.value();if(isNaN(S)){j.white();if(j.getCh()){j.error("Syntax error");}return r;}else{return{result:r,at:j.getIndex()};}};return J;});
