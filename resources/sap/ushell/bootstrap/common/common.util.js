// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([],function(){"use strict";function d(o){Object.keys(o).filter(function(p){return typeof o[p]==="object";}).forEach(function(p){o[p]=d(o[p]);});return Object.freeze(o);}function g(){return location.protocol+"//"+location.host;}function e(p){if((typeof p==="string")&&p.charAt(p.length-1)!=="/"){return p+"/";}return p;}function m(M,c,C){var a;if(!c){return;}a=C?JSON.parse(JSON.stringify(c)):c;Object.keys(a).forEach(function(k){if(typeof M[k]==="object"&&typeof a[k]==="object"){m(M[k],a[k],false);return;}M[k]=a[k];});}return Object.create(null,{deepFreeze:{value:d},getLocationOrigin:{value:g,writable:true},ensureTrailingSlash:{value:e},mergeConfig:{value:m}});});
