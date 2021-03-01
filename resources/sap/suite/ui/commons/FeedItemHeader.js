/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/m/ListItemBase','./library','sap/ui/core/HTML',"sap/base/security/URLListValidator","sap/base/Log","./FeedItemHeaderRenderer"],function(L,l,H,U,a,F){"use strict";var b=L.extend("sap.suite.ui.commons.FeedItemHeader",{metadata:{deprecated:true,library:"sap.suite.ui.commons",properties:{title:{type:"string",group:"Misc",defaultValue:null},image:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},link:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},source:{type:"string",group:"Misc",defaultValue:null},publicationDate:{type:"object",group:"Misc",defaultValue:null},description:{type:"string",group:"Misc",defaultValue:null}}}});b.prototype.exit=function(e){if(this._htmlControl){this._htmlControl.destroy();}L.prototype.exit.apply(this);};b.prototype.setImage=function(i){if(i){var v=U.validate(i);if(v){this.setProperty("image",i);}else{a.error("Invalid Url:'"+i+"'. Property 'image' of FeedItemHeader not set");}}return this;};b.prototype.setLink=function(s){if(s){var v=U.validate(s);if(v){this.setProperty("link",s);}else{a.error("Invalid Url:'"+s+"'. Property 'link' of FeedItemHeader not set");}}return this;};b.prototype.onclick=function(e){this.firePress({link:this.getLink()});e.preventDefault();};b.prototype._getHtmlControl=function(){if(!this._htmlControl){this._htmlControl=new H({id:this.getId()+"-feedItemHeaderDescription",sanitizeContent:true});}return this._htmlControl;};return b;});