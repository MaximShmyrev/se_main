/* Tiny Case Change plugin
 *
 * Copyright 2010-2020 Tiny Technologies Inc. All rights reserved.
 *
 * Version: 1.0.1-21
 */

!function(i){"use strict";var r=function(n){var e=n,t=function(){return e};return{get:t,set:function(n){e=n},clone:function(){return r(t())}}},t=function(n){return parseInt(n,10)},u=function(n,e){var t=n-e;return 0==t?0:0<t?1:-1},o=function(n,e,t){return{major:n,minor:e,patch:t}},c=function(n){var e=/([0-9]+)\.([0-9]+)\.([0-9]+)(?:(\-.+)?)/.exec(n);return e?o(t(e[1]),t(e[2]),t(e[3])):o(0,0,0)},a=function(n,e){return!!n&&-1===function(n,e){var t=u(n.major,e.major);if(0!==t)return t;var r=u(n.minor,e.minor);if(0!==r)return r;var o=u(n.patch,e.patch);return 0!==o?o:0}(function(n){return c(function(n){return[n.majorVersion,n.minorVersion].join(".").split(".").slice(0,3).join(".")}(n))}(n),c(e))},n=function(){},f=function(n){return function(){return n}};var e,s,l,p,g=f(!1),m=f(!0),d=function(){return h},h=(e=function(n){return n.isNone()},p={fold:function(n,e){return n()},is:g,isSome:g,isNone:m,getOr:l=function(n){return n},getOrThunk:s=function(n){return n()},getOrDie:function(n){throw new Error(n||"error: getOrDie called on none.")},getOrNull:f(null),getOrUndefined:f(undefined),or:l,orThunk:s,map:d,each:n,bind:d,exists:g,forall:m,filter:d,equals:e,equals_:e,toArray:function(){return[]},toString:f("none()")},Object.freeze&&Object.freeze(p),p),v=function(t){var n=f(t),e=function(){return o},r=function(n){return n(t)},o={fold:function(n,e){return e(t)},is:function(n){return t===n},isSome:m,isNone:g,getOr:n,getOrThunk:n,getOrDie:n,getOrNull:n,getOrUndefined:n,or:e,orThunk:e,map:function(n){return v(n(t))},each:function(n){n(t)},bind:r,exists:r,forall:r,filter:function(n){return n(t)?o:h},toArray:function(){return[t]},toString:function(){return"some("+t+")"},equals:function(n){return n.is(t)},equals_:function(n,e){return n.fold(g,function(n){return e(t,n)})}};return o},y={some:v,none:d,from:function(n){return null===n||n===undefined?h:v(n)}},w=function(e){return function(n){return function(n){if(null===n)return"null";var e=typeof n;return"object"==e&&(Array.prototype.isPrototypeOf(n)||n.constructor&&"Array"===n.constructor.name)?"array":"object"==e&&(String.prototype.isPrototypeOf(n)||n.constructor&&"String"===n.constructor.name)?"string":e}(n)===e}},C=w("array"),E=w("function"),O=Array.prototype.slice,T=Array.prototype.push,R=function(n,e){for(var t=n.length,r=new Array(t),o=0;o<t;o++){var u=n[o];r[o]=e(u,o)}return r},x=function(n,e){for(var t=0,r=n.length;t<r;t++){e(n[t],t)}},k=function(n,e){for(var t=n.length-1;0<=t;t--){e(n[t],t)}},A=function(n){return 0===n.length?y.none():y.some(n[0])},S=(E(Array.from)&&Array.from,function(n,e){return y.from(n.childNodes[e])}),b=function(){return(b=Object.assign||function(n){for(var e,t=1,r=arguments.length;t<r;t++)for(var o in e=arguments[t])Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}).apply(this,arguments)},P="[-'\\.\u2018\u2019\u2024\ufe52\uff07\uff0e]",_="[:\xb7\xb7\u05f4\u2027\ufe13\ufe55\uff1a]",j="[\xb1+*/,;;\u0589\u060c\u060d\u066c\u07f8\u2044\ufe10\ufe14\ufe50\ufe54\uff0c\uff1b]",B="[0-9\u0660-\u0669\u066b\u06f0-\u06f9\u07c0-\u07c9\u0966-\u096f\u09e6-\u09ef\u0a66-\u0a6f\u0ae6-\u0aef\u0b66-\u0b6f\u0be6-\u0bef\u0c66-\u0c6f\u0ce6-\u0cef\u0d66-\u0d6f\u0e50-\u0e59\u0ed0-\u0ed9\u0f20-\u0f29\u1040-\u1049\u1090-\u1099\u17e0-\u17e9\u1810-\u1819\u1946-\u194f\u19d0-\u19d9\u1a80-\u1a89\u1a90-\u1a99\u1b50-\u1b59\u1bb0-\u1bb9\u1c40-\u1c49\u1c50-\u1c59\ua620-\ua629\ua8d0-\ua8d9\ua900-\ua909\ua9d0-\ua9d9\uaa50-\uaa59\uabf0-\uabf9]",N="\\r",D="\\n",U="[\x0B\f\x85\u2028\u2029]",L="[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0c01-\u0c03\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d02\u0d03\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f\u109a-\u109d\u135d-\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b6-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u192b\u1930-\u193b\u19b0-\u19c0\u19c8\u19c9\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f\u1b00-\u1b04\u1b34-\u1b44\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1baa\u1be6-\u1bf3\u1c24-\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf2\u1dc0-\u1de6\u1dfc-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa7b\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe3-\uabea\uabec\uabed\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]",q="[\xad\u0600-\u0603\u06dd\u070f\u17b4\u17b5\u200e\u200f\u202a-\u202e\u2060-\u2064\u206a-\u206f\ufeff\ufff9-\ufffb]",M="[\u3031-\u3035\u309b\u309c\u30a0-\u30fa\u30fc-\u30ff\u31f0-\u31ff\u32d0-\u32fe\u3300-\u3357\uff66-\uff9d]",z="[=_\u203f\u2040\u2054\ufe33\ufe34\ufe4d-\ufe4f\uff3f\u2200-\u22ff<>]",I="[!-#%-*,-\\/:;?@\\[-\\]_{}\xa1\xab\xb7\xbb\xbf;\xb7\u055a-\u055f\u0589\u058a\u05be\u05c0\u05c3\u05c6\u05f3\u05f4\u0609\u060a\u060c\u060d\u061b\u061e\u061f\u066a-\u066d\u06d4\u0700-\u070d\u07f7-\u07f9\u0830-\u083e\u085e\u0964\u0965\u0970\u0df4\u0e4f\u0e5a\u0e5b\u0f04-\u0f12\u0f3a-\u0f3d\u0f85\u0fd0-\u0fd4\u0fd9\u0fda\u104a-\u104f\u10fb\u1361-\u1368\u1400\u166d\u166e\u169b\u169c\u16eb-\u16ed\u1735\u1736\u17d4-\u17d6\u17d8-\u17da\u1800-\u180a\u1944\u1945\u1a1e\u1a1f\u1aa0-\u1aa6\u1aa8-\u1aad\u1b5a-\u1b60\u1bfc-\u1bff\u1c3b-\u1c3f\u1c7e\u1c7f\u1cd3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205e\u207d\u207e\u208d\u208e\u3008\u3009\u2768-\u2775\u27c5\u27c6\u27e6-\u27ef\u2983-\u2998\u29d8-\u29db\u29fc\u29fd\u2cf9-\u2cfc\u2cfe\u2cff\u2d70\u2e00-\u2e2e\u2e30\u2e31\u3001-\u3003\u3008-\u3011\u3014-\u301f\u3030\u303d\u30a0\u30fb\ua4fe\ua4ff\ua60d-\ua60f\ua673\ua67e\ua6f2-\ua6f7\ua874-\ua877\ua8ce\ua8cf\ua8f8-\ua8fa\ua92e\ua92f\ua95f\ua9c1-\ua9cd\ua9de\ua9df\uaa5c-\uaa5f\uaade\uaadf\uabeb\ufd3e\ufd3f\ufe10-\ufe19\ufe30-\ufe52\ufe54-\ufe61\ufe63\ufe68\ufe6a\ufe6b\uff01-\uff03\uff05-\uff0a\uff0c-\uff0f\uff1a\uff1b\uff1f\uff20\uff3b-\uff3d\uff3f\uff5b\uff5d\uff5f-\uff65]",W=0,V=1,$=2,Z=3,F=4,G=5,H=6,J=7,K=8,Q=9,X=10,Y=11,nn=12,en=13,tn=[new RegExp("[A-Za-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f3\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u10a0-\u10c5\u10d0-\u10fa\u10fc\u1100-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1a00-\u1a16\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bc0-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u24b6-\u24e9\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2d00-\u2d25\u2d30-\u2d65\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005\u303b\u303c\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790\ua791\ua7a0-\ua7a9\ua7fa-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uffa0-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]"),new RegExp(P),new RegExp(_),new RegExp(j),new RegExp(B),new RegExp(N),new RegExp(D),new RegExp(U),new RegExp(L),new RegExp(q),new RegExp(M),new RegExp(z),new RegExp("@")],rn=new RegExp("^"+I+"$"),on=tn,un=en,cn=function(n){for(var e=un,t=on.length,r=0;r<t;++r){var o=on[r];if(o&&o.test(n)){e=r;break}}return e},an=/^\s+$/,fn=rn,sn=function(n,e){var t=function(n,e){var t;for(t=e;t<n.length&&!an.test(n[t]);t++);return t}(n,e+1);return"://"===n.slice(e+1,t).join("").substr(0,3)?t:e},ln=function(n,e,t){t=b(b({},{includeWhitespace:!1,includePunctuation:!1}),t);for(var r=[],o=[],u=0;u<n.length;u++){var i=e(n[u]);"\ufeff"!==i&&(r.push(n[u]),o.push(i))}return function(n,e,t,r){for(var o,u,i,c,a,f,s,l=[],p=[],g=0;g<t.length;++g)if(p.push(n[g]),a=c=void 0,f=(u=t)[i=g],s=u[i+1],!(i<0||i>u.length-1&&0!==i||f===W&&s===W||(a=u[i+2],f===W&&(s===$||s===V||s===nn)&&a===W||(c=u[i-1],(f===$||f===V||s===nn)&&s===W&&c===W||!(f!==F&&f!==W||s!==F&&s!==W)||(f===Z||f===V)&&s===F&&c===F||f===F&&(s===Z||s===V)&&a===F||f===K||f===Q||c===K||c===Q||s===K||s===Q||f===G&&s===H||f!==J&&f!==G&&f!==H&&s!==J&&s!==G&&s!==H&&(f===X&&s===X||s===Y&&(f===W||f===F||f===X||f===Y)||f===Y&&(s===W||s===F||s===X)||f===nn))))){var m=e[g];if((r.includeWhitespace||!an.test(m))&&(r.includePunctuation||!fn.test(m))){var d=g-p.length+1,h=g+1,v=e.slice(d,h).join("");if("http"===(o=v)||"https"===o){var y=sn(e,g),w=n.slice(h,y);Array.prototype.push.apply(p,w),g=y}l.push(p)}p=[]}return l}(r,o,function(n){var e=function(t){var r={};return function(n){if(r[n])return r[n];var e=t(n);return r[n]=e}}(cn);return R(n,e)}(o),t)},pn=function(n){return n["char"]},gn=function(t){return R(t.data.split(""),function(n,e){return{"char":n,node:t,offset:e}})},mn=function(n){return function(n){for(var e=[],t=0,r=n.length;t<r;++t){if(!C(n[t]))throw new Error("Arr.flatten item "+t+" was not an array, input: "+n);T.apply(e,n[t])}return e}(R(n,gn))},dn=function(n){var e=n.schema.getShortEndedElements(),t=n.schema.getBlockElements();return function(n){return!!e[n.nodeName]||!!t[n.nodeName]}},hn=function(n,e,t){for(var r=dn(e),o=e.getBody(),u=new tinymce.dom.TreeWalker(n,o),i=u.current();!r(i)&&u[t]()&&!r(u.current());)i=u.current();return i},vn=function(n,e){var t=function(n,e){var t,r=dn(e),o=e.getBody(),u=new tinymce.dom.TreeWalker(n.start,o),i=[],c=[];do{var a=u.current();"false"!==e.dom.getContentEditableParent(a)&&((t=a)&&3===t.nodeType?c.push(a):r(a)&&(i.push(c),c=[]))}while(u.current()!==n.end&&u.next());return i.push(c),i}(function(n,e){var t=S(e.startContainer,e.startOffset).getOr(e.startContainer),r=S(e.endContainer,e.endOffset).getOr(e.endContainer);return{start:hn(t,n,"prev"),end:hn(r,n,"next")}}(n,e),n);return R(t,function(n){var e=mn(n);return ln(e,pn)})},yn=function(n){var e=n["char"].toLocaleUpperCase();n.node.replaceData(n.offset,1,e)},wn=function(n){var e=n["char"].toLocaleLowerCase();n.node.replaceData(n.offset,1,e)},Cn=function(n,e){var t=i.document.createRange();t.setStart(e.node,e.offset),t.setEnd(e.node,e.offset+e["char"].length);var r=1===t.compareBoundaryPoints(i.Range.END_TO_END,n),o=-1===t.compareBoundaryPoints(i.Range.START_TO_START,n);return!r&&!o},En=function(u,n){return function(n,e,t){return n.isSome()&&e.isSome()?y.some(t(n.getOrDie(),e.getOrDie())):y.none()}(A(n),function(n){return 0===n.length?y.none():y.some(n[n.length-1])}(n),function(n,e){var t=i.document.createRange();t.setStart(n.node,n.offset),t.setEnd(e.node,e.offset+e["char"].length);var r=-1===t.compareBoundaryPoints(i.Range.START_TO_START,u),o=1===t.compareBoundaryPoints(i.Range.END_TO_END,u);return r&&o}).getOr(!1)},On=function(n,e){k(n,function(n){k(n,e)})},Tn=function(n,e){On(n,function(n){k(n,e)})},Rn=function(n){return function(n,e,t){return x(n,function(n){t=e(t,n)}),t}(n,function(n,e){return n+e["char"]},"")},xn=function(n){var e=R(n.dom.select("td[data-mce-selected],th[data-mce-selected]"),function(n){var e=i.document.createRange();return e.selectNodeContents(n),e});return 0<e.length?e:[n.selection.getRng()]},kn=function(n,e){e.collapsed?function(n,e){On(vn(n,e),function(n){En(e,n)&&x(n,yn)})}(n,e):function(n,e){Tn(vn(n,e),function(n){Cn(e,n)&&yn(n)})}(n,e)},An=function(n,e){e.collapsed?function(n,e){On(vn(n,e),function(n){En(e,n)&&x(n,wn)})}(n,e):function(n,e){Tn(vn(n,e),function(n){Cn(e,n)&&wn(n)})}(n,e)},Sn=function(n,t,e){var r=e.collapsed?m:function u(r){for(var o=[],n=1;n<arguments.length;n++)o[n-1]=arguments[n];return function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];var t=o.concat(n);return r.apply(null,t)}}(Cn,e),o=function(n,e){return 0<e&&function(n,e){for(var t=0,r=n.length;t<r;t++){if(e(n[t],t))return!0}return!1}(t,function(e){return function(n){return Rn(e).toLowerCase()===n.toLowerCase()}}(n))};On(vn(n,e),function(e,t){k(function(n,e){for(var t=[],r=0,o=n.length;r<o;r++){var u=n[r];e(u,r)&&t.push(u)}return t}(e.slice(1),r),wn),A(e).filter(r).each(function(n){o(e,t)?wn(n):yn(n)})})},bn=["at","by","in","of","on","up","to","en","re","vs","but","off","out","via","bar","mid","per","pro","qua","til","from","into","unto","with","amid","anit","atop","down","less","like","near","over","past","plus","sans","save","than","thru","till","upon","for","and","nor","but","or","yet","so","an","a","some","the"],Pn=function(e){e.addCommand("mceUpperCase",function(){!function(e){e.undoManager.transact(function(){var n=e.selection.getBookmark();x(xn(e),function(n){kn(e,n)}),e.focus(),e.selection.moveToBookmark(n)})}(e)}),e.addCommand("mceLowerCase",function(){!function(e){e.undoManager.transact(function(){var n=e.selection.getBookmark();x(xn(e),function(n){An(e,n)}),e.focus(),e.selection.moveToBookmark(n)})}(e)}),e.addCommand("mceTitleCase",function(){var n=function(n){return n.getParam("casechange_title_case_minors",bn,"array")}(e);!function(e,t){e.undoManager.transact(function(){var n=e.selection.getBookmark();x(xn(e),function(n){Sn(e,t,n)}),e.selection.moveToBookmark(n),e.focus()})}(e,n)})},_n=function(n,e,t,r){return{type:"togglemenuitem",text:t,active:function(n,e){return n===e.get()}(e,r),onAction:function(n,e,t){return function(){t.set(e),n.execCommand(e)}}(n,e,r)}},jn=function(n){if(a(tinymce,"5.0.0"))return console.error("The casechange plugin requires at least version 5.0.0 of TinyMCE"),{};var e=r("mceUpperCase");!function(n,e){n.ui.registry.addNestedMenuItem("casechange",{text:"Capitalization",getSubmenuItems:function(){return[_n(n,"mceLowerCase","lowercase",e),_n(n,"mceUpperCase","UPPERCASE",e),_n(n,"mceTitleCase","Title Case",e)]}})}(n,e),function(t,r){t.ui.registry.addSplitButton("casechange",{tooltip:"Capitalization",icon:"change-case",onAction:function(){t.execCommand(r.get())},onItemAction:function(n,e){r.set(e),t.execCommand(e)},select:function(n){return n===r.get()},fetch:function(n){n([{type:"choiceitem",text:"lowercase",value:"mceLowerCase"},{type:"choiceitem",text:"UPPERCASE",value:"mceUpperCase"},{type:"choiceitem",text:"Title Case",value:"mceTitleCase"}])}})}(n,e),Pn(n)};!function Bn(){tinymce.PluginManager.add("casechange",jn)}()}(window);