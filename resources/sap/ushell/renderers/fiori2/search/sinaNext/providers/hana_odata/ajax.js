// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sinaDefine(['../../core/core','../../core/ajax'],function(c,a){"use strict";var m={};m.Exception=c.Exception.derive({_init:function(d){c.Exception.prototype._init.apply(this,[d]);}});var p=function(d){try{return c.Promise.reject(new m.Exception({message:JSON.parse(d.responseText).error.details,description:'Error by hana odata ajax call',previous:d}));}catch(e){return c.Promise.reject(d);}};var b=function(o){return function(){return o.apply(this,arguments).then(function(r){return r;},function(e){if(!(e instanceof a.Exception)){return c.Promise.reject(e);}return p(e);});};};m.createAjaxClient=function(){var d=new a.Client({csrf:false});d.postJson=b(d.postJson);d.getJson=b(d.getJson);d.mergeJson=b(d.mergeJson);return d;};return m;});
