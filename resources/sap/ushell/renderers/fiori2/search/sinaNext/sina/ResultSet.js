// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sinaDefine(['../core/core','./SinaObject','../core/Log'],function(c,S,L){"use strict";return S.derive({_meta:{properties:{id:{required:false,default:function(){return c.generateId();}},title:{required:true},items:{required:false,default:function(){return[];},aggregation:true},query:{required:true},log:{required:false,default:function(){return new L();}}}},toString:function(){var r=[];for(var i=0;i<this.items.length;++i){var a=this.items[i];r.push(a.toString());}return r.join('\n');}});});
