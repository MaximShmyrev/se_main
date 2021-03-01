/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define('sap/ui/debug/Highlighter',["sap/ui/thirdparty/jquery","sap/base/util/uid","sap/ui/dom/jquery/rect"],function(q,u){"use strict";var H=function(i,f,c,b){this.sId=i||u();this.bFilled=(f==true);this.sColor=c||'blue';if(isNaN(b)){this.iBorderWidth=2;}else if(b<=0){this.iBorderWidth=0;}else{this.iBorderWidth=b;}};H.prototype.highlight=function(d){if(!d||!d.parentNode){return;}var h=(this.sId?window.document.getElementById(this.sId):null);if(!h){h=d.ownerDocument.createElement("DIV");h.setAttribute("id",this.sId);h.style.position="absolute";h.style.border=this.iBorderWidth+"px solid "+this.sColor;h.style.display="none";h.style.margin="0px";h.style.padding="0px";if(this.bFilled){h.innerHTML="<div style='background-color:"+this.sColor+";opacity:0.2;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=20);height:100%;width:100%'>&nbsp;</div>";}d.ownerDocument.body.appendChild(h);}var r=q(d).rect();h.style.top=(r.top-this.iBorderWidth)+"px";h.style.left=(r.left-this.iBorderWidth)+"px";h.style.width=(r.width)+"px";h.style.height=(r.height)+"px";h.style.display="block";};H.prototype.hide=function(){var h=(this.sId?window.document.getElementById(this.sId):null);if(!h){return;}h.style.display="none";};return H;},true);
