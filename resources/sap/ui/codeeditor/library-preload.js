//@ui5-bundle sap/ui/codeeditor/library-preload.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine('sap/ui/codeeditor/library',["sap/ui/core/Core","sap/ui/core/library"],function(){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.codeeditor",dependencies:["sap.ui.core"],types:[],interfaces:[],controls:["sap.ui.codeeditor.CodeEditor"],elements:[],noLibraryCSS:false,version:"1.86.3"});return sap.ui.codeeditor;});
sap.ui.require.preload({
	"sap/ui/codeeditor/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.ui.codeeditor","type":"library","embeds":[],"applicationVersion":{"version":"1.86.3"},"title":"UI5 library: sap.ui.codeeditor","description":"UI5 library: sap.ui.codeeditor","resources":"resources.json","offline":true,"openSourceComponents":[{"name":"ace","packagedWithMySelf":true,"version":"1.4.4"}]},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_hcb"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.86","libs":{"sap.ui.core":{"minVersion":"1.86.3"}}},"library":{"i18n":{"bundleUrl":"messagebundle.properties","supportedLocales":["","ar","bg","ca","cs","da","de","el","en","en-GB","en-US-sappsd","en-US-saprigi","en-US-saptrc","es","es-MX","et","fi","fr","hi","hr","hu","it","iw","ja","kk","ko","lt","lv","ms","nl","no","pl","pt","ro","ru","sh","sk","sl","sv","th","tr","uk","vi","zh-CN","zh-TW"]},"content":{"controls":["sap.ui.codeeditor.CodeEditor"],"elements":[],"types":[],"interfaces":[]}}}}',
	"sap/ui/codeeditor/CodeEditor.js":function(){sap.ui.loader.config({shim:{'sap/ui/codeeditor/js/ace/ace':{exports:'ace'},'sap/ui/codeeditor/js/ace/ext-language_tools':{deps:['sap/ui/codeeditor/js/ace/ace']},'sap/ui/codeeditor/js/ace/ext-beautify':{deps:['sap/ui/codeeditor/js/ace/ace']},'sap/ui/codeeditor/js/ace/mode-javascript':{deps:['sap/ui/codeeditor/js/ace/ace']},'sap/ui/codeeditor/js/ace/mode-json':{deps:['sap/ui/codeeditor/js/ace/ace']}}});sap.ui.define(["./library","sap/ui/core/Core","sap/ui/core/Control","sap/ui/core/RenderManager","sap/ui/core/ResizeHandler","sap/ui/Device","sap/ui/thirdparty/jquery","sap/ui/codeeditor/js/ace/ace","sap/ui/codeeditor/js/ace/ext-language_tools","sap/ui/codeeditor/js/ace/ext-beautify","sap/ui/codeeditor/js/ace/mode-javascript","sap/ui/codeeditor/js/ace/mode-json"],function(l,C,a,R,b,D,q,c){"use strict";
var d=a.extend("sap.ui.codeeditor.CodeEditor",{
metadata:{library:"sap.ui.codeeditor",properties:{value:{type:"string",group:"Misc",defaultValue:""},type:{type:"string",group:"Appearance",defaultValue:"javascript"},width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"100%"},editable:{type:"boolean",group:"Behavior",defaultValue:true},lineNumbers:{type:"boolean",group:"Behavior",defaultValue:true},valueSelection:{type:"boolean",group:"Behavior",defaultValue:false},maxLines:{type:"int",group:"Behavior",defaultValue:0},colorTheme:{type:"string",group:"Behavior",defaultValue:"default"},syntaxHints:{type:"boolean",group:"Behavior",defaultValue:true}},events:{liveChange:{parameters:{value:{type:"string"},editorEvent:{type:"object"}}},change:{parameters:{value:{type:"string"},oldValue:{type:"string"}}}},defaultProperty:"content"},
renderer:{apiVersion:2,render:function(r,o){r.openStart("div",o).class("sapCEd").style("width",o.getWidth()).style("height",o.getHeight()).attr("data-sap-ui-syntaxhints",o.getSyntaxHints()).attr("role","application").attr("aria-roledescription",C.getLibraryResourceBundle("sap.ui.codeeditor").getText("CODEEDITOR_ROLE_DESCRIPTION"));var t=o.getTooltip_AsString();if(t){r.attr("title",t);}r.openEnd();r.close("div");}}
});
var p=sap.ui.require.toUrl("sap/ui/codeeditor/js/ace");c.config.set("basePath",p);var L=c.require("ace/ext/language_tools");
d.prototype.init=function(){this._bIsRenderingPhase=false;this._oEditorDomRef=document.createElement("div");this._oEditorDomRef.style.height="100%";this._oEditorDomRef.style.width="100%";this._oEditor=c.edit(this._oEditorDomRef);var s=this._oEditor.getSession();s.setUseWorker(false);s.setValue("");s.setUseWrapMode(true);s.setMode("ace/mode/javascript");var u=C.getConfiguration().getTheme().toLowerCase();var e="tomorrow";if(u.indexOf("hcb")>-1){e="chaos";}else if(u.indexOf("hcw")>-1){e="github";}else if(u==="sap_fiori_3"){e="crimson_editor";}else if(u==="sap_fiori_3_dark"){e="clouds_midnight";}this._oEditor.setTheme("ace/theme/"+e);this._oEditor.setOptions({enableBasicAutocompletion:true,enableSnippets:true,enableLiveAutocompletion:true});this._oEditor.renderer.setShowGutter(true);this._oEditor.addEventListener("change",function(E){if(!this.getEditable()){return;}var v=this.getCurrentValue();this.fireLiveChange({value:v,editorEvent:E});}.bind(this));this._oEditor.addEventListener("blur",function(){if(this._bIsRenderingPhase){return;}var v=this.getCurrentValue(),f=this.getValue();this.setProperty("value",v,true);if(v!=f&&this.getEditable()){this.fireChange({value:v,oldValue:f});}}.bind(this));this._oEditor.addEventListener("showGutterTooltip",function(t){if(D.browser.internet_explorer){return;}var $=q(t.$element),f=$.parents(".sapMDialog");if(f&&f.css("transform")){var m=f.position();$.css("transform","translate(-"+m.left+"px, -"+m.top+"px)");}});};
d.prototype.exit=function(){this._deregisterResizeListener();this._oEditor.destroy();q(this._oEditorDomRef).remove();this._oEditorDomRef=null;this._oEditor=null;};
d.prototype.onBeforeRendering=function(){this._bIsRenderingPhase=true;var o=this.getDomRef();if(o&&!R.isPreservedContent(o)){R.preserveContent(o);}this._deregisterResizeListener();};
d.prototype.onAfterRendering=function(){this._bIsRenderingPhase=false;var o=this.getDomRef(),P=this.getMetadata().getPropertyDefaults();setTimeout(function(){if(this.getMaxLines()===P.maxLines&&this.getHeight()===P.height&&o.height<20){o.style.height="3rem";}}.bind(this),0);o.appendChild(this._oEditorDomRef);var e=this.getEditable();this._oEditor.setReadOnly(!e);if(e){this._oEditor.renderer.$cursorLayer.element.style.display="";}else{this._oEditor.renderer.$cursorLayer.element.style.display="none";}this._oEditor.getSession().setMode("ace/mode/"+this.getType());this._oEditor.setOption("maxLines",this.getMaxLines());this._oEditor.renderer.setShowGutter(this.getLineNumbers());this._oEditor.getSession().setValue(this.getValue());if(!this.getValueSelection()){this._oEditor.selection.clearSelection();}this._oEditor.renderer.updateText();this._oEditor.resize();this._registerResizeListener();};
d.prototype._registerResizeListener=function(){if(!this._iResizeListenerId){this._iResizeListenerId=b.register(this._oEditorDomRef,function(){this._oEditor.resize();this._deregisterResizeListener();}.bind(this));}};
d.prototype._deregisterResizeListener=function(){if(this._iResizeListenerId){b.deregister(this._iResizeListenerId);this._iResizeListenerId=null;}};
d.prototype.focus=function(){this._oEditor.focus();return this;};
d.prototype.setColorTheme=function(t){this.setProperty("colorTheme",t,true);if(t==="default"){t="tomorrow";}else if(t==="hcb"){t="tomorrow_night";}else if(t==="hcb_bright"){t="tomorrow_night_bright";}else if(t==="hcb_blue"){t="tomorrow_night_blue";}this._oEditor.setTheme("ace/theme/"+t);return this;};
d.prototype.getCurrentValue=function(){return this._oEditor.getValue();};
d.prototype.addCustomCompleter=function(o){L.addCompleter({getCompletions:function(e,s,P,f,g){o.getCompletions(g,{oPos:P,sPrefix:f});}});};
d.prototype.getInternalEditorInstance=function(){return this._oEditor;};
d.prototype.prettyPrint=function(){c.require("ace/ext/beautify").beautify(this._oEditor.session);};
d.prototype.destroy=function(s){this._oEditor.destroy(s);a.prototype.destroy.call(this,s);};
d.prototype.onfocusout=function(){this._oEditor.getSession().setUseWorker(false);};
d.prototype.onfocusin=function(){this._oEditor.getSession().setUseWorker(true);};
return d;});
}
},"sap/ui/codeeditor/library-preload"
);
//# sourceMappingURL=library-preload.js.map