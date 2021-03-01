/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery",'./library','sap/ui/core/Control','sap/suite/ui/commons/util/FeedItemUtils',"sap/base/Log","sap/base/security/encodeCSS","sap/base/security/encodeXML","sap/base/security/URLListValidator","./FeedTileRenderer"],function(q,l,C,F,L,e,a,U,b){"use strict";var c=C.extend("sap.suite.ui.commons.FeedTile",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{displayDuration:{type:"int",group:"Misc",defaultValue:5},displayArticleImage:{type:"boolean",group:"Behavior",defaultValue:true},source:{type:"string",group:"Misc",defaultValue:null},defaultImages:{type:"sap.ui.core.URI[]",group:"Misc",defaultValue:null}},aggregations:{items:{type:"sap.suite.ui.commons.FeedItem",multiple:true,singularName:"item"}},events:{press:{}}}});c.prototype.init=function(){this._currentItemIndex=0;this._stagedModel=null;this._defaultImageIndex=-1;};c.prototype.cycle=function(){if(this._stagedModel){L.debug("FeedTile: Updating news tile with new model");this.setModel(this._stagedModel);this._stagedModel=null;var n=this.getItems().length;if(this._currentItemIndex>=n){this._currentItemIndex=0;}return;}var i=this.getItems();this._currentItemIndex=(this._currentItemIndex+1)%i.length;var $=q("#"+this.getId()+"-next-feedTileImage");var d=q("#"+this.getId()+"-feedTileImage");if(q.support.cssTransitions){$.addClass("sapSuiteFTItemRight").removeClass('sapSuiteFTItemHidden');d.addClass('sapSuiteFTItemCenter');setTimeout(function(){var o=false;var A=null;A=function(){q(this).unbind("webkitTransitionEnd transitionend");if(!o){o=true;}else{$.removeClass("sapSuiteFTItemSliding");d.removeClass("sapSuiteFTItemSliding").addClass("sapSuiteFTItemHidden").removeClass("sapSuiteFTItemLeft").addClass("sapSuiteFTItemRight");d.detach();$.after(d);this.flipIds($,d);setTimeout(function(){this.setNextItemValues(this);}.bind(this),100);this._timeoutId=setTimeout(function(){this.cycle();}.bind(this),this.getDisplayDuration()*1000);}};d.bind("webkitTransitionEnd transitionend",A.bind(this));$.bind("webkitTransitionEnd transitionend",A.bind(this));d.addClass('sapSuiteFTItemSliding').removeClass('sapSuiteFTItemCenter').addClass('sapSuiteFTItemLeft');$.addClass('sapSuiteFTItemSliding').removeClass('sapSuiteFTItemRight').addClass('sapSuiteFTItemCenter');}.bind(this),60);}else{$.css("left","100%");$.removeClass("sapSuiteFTItemHidden");$.animate({left:"0%"},400);d.animate({left:"-100%"},400,function(){d.addClass("sapSuiteFTItemHidden");d.css("left","0");this.flipIds($,d);setTimeout(function(){this.setNextItemValues(this);}.bind(this),100);this._timeoutId=setTimeout(function(){this.cycle();}.bind(this),this.getDisplayDuration()*1000);}.bind(this));}};c.prototype.onAfterRendering=function(){var d=this.getDisplayDuration()*1000;if(this.getItems().length>1){if(typeof this._timeoutId==="number"){clearTimeout(this._timeoutId);delete this._timeoutId;}this._timeoutId=setTimeout(function(){this.cycle();}.bind(this),d);}};c.prototype.onclick=function(E){var d=this.getCurrentItem();var i="";if(d&&d.getId()){i=d.getId();}this.firePress({itemId:i});};c.prototype.getCurrentItem=function(){var i=this.getItems();if(i.length){return i[this._currentItemIndex];}};c.prototype.getNextItem=function(){var i=this.getItems();if(i.length&&i.length>1){return i[(this._currentItemIndex+1)%i.length];}};c.prototype.setNextItemValues=function(){var n=this.getNextItem();var i=this.getId();var B=n.getImage();if(!B||!this.getDisplayArticleImage()){B=this.getDefaultImage();}q("#"+i+"-next-feedTileImage").css("background-image","url("+e(B)+")");q("#"+i+"-next-feedTileTitle").html(a(n.getTitle()));q("#"+i+"-next-feedTileSource").html(a(n.getSource()));q("#"+i+"-next-feedTileAge").html(a(F.calculateFeedItemAge(n.getPublicationDate())));return this;};c.prototype.flipIds=function($,d){var i=this.getId();d.attr("id",i+"-next-feedTileImage");d.find("#"+i+"-feedTileText").attr("id",i+"-next-feedTileText");d.find("#"+i+"-feedTileTitle").attr("id",i+"-next-feedTileTitle");d.find("#"+i+"-feedTileSource").attr("id",i+"-next-feedTileSource");d.find("#"+i+"-feedTileAge").attr("id",i+"-next-feedTileAge");$.attr("id",i+"-feedTileImage");$.find("#"+i+"-next-feedTileText").attr("id",i+"-feedTileText");$.find("#"+i+"-next-feedTileTitle").attr("id",i+"-feedTileTitle");$.find("#"+i+"-next-feedTileSource").attr("id",i+"-feedTileSource");$.find("#"+i+"-next-feedTileAge").attr("id",i+"-feedTileAge");};c.prototype.setDisplayDuration=function(d){if(d<3){d=3;L.error("FeedTile: displayDuration should be equal or more than 3 seconds.");}this.setProperty("displayDuration",d);return this;};c.prototype.stageModel=function(m){this._stagedModel=m;};c.prototype.getDefaultImage=function(){var d="";var D=this.getDefaultImages();if(D&&D.length>0){var i=D.length;if(this._defaultImageIndex===-1){var r=Math.floor(Math.random()*i);this._defaultImageIndex=r;d=D[r];}else{var I=(this._defaultImageIndex+1)>=i?0:this._defaultImageIndex+1;this._defaultImageIndex=I;d=D[I];}}return d;};c.prototype.setDefaultImages=function(d){if(d&&d.length>0){var v=[];var D=null;for(var i=0;i<d.length;i++){D=d[i];var f=U.validate(D);if(f){v.push(D);}else{L.error("Invalid Url:'"+D);}}if(v.length<=0){L.error("Default Images are not set because supplied Urls are invalid");}else{this.setProperty("defaultImages",v);}}return this;};return c;});
