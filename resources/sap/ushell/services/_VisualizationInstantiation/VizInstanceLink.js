// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/library","sap/ushell/library","sap/m/GenericTile","sap/ushell/services/_VisualizationInstantiation/VizInstance","sap/ui/thirdparty/hasher","sap/ushell/Config","sap/ushell/utils/WindowUtils","sap/ushell/services/AppType","sap/m/ActionSheet"],function(m,u,G,V,h,C,W,A,a){"use strict";var b=m.GenericTileMode;var c=m.GenericTileScope;var D=u.DisplayFormat;var d=G.extend("sap.ushell.ui.launchpad.VizInstanceLink",{metadata:{library:"sap.ushell",properties:{title:{type:"string",defaultValue:"",group:"Appearance",bindable:true},subtitle:{type:"string",defaultValue:"",group:"Appearance",bindable:true},editable:{type:"boolean",defaultValue:false,group:"Behavior",bindable:true},active:{type:"boolean",group:"Misc",defaultValue:false},targetURL:{type:"string",group:"Misc"},mode:{type:"sap.m.GenericTileMode",group:"Appearance",defaultValue:b.LineMode},displayFormat:{type:"string",defaultValue:D.Compact},supportedDisplayFormats:{type:"string[]",defaultValue:[D.Compact]},dataHelpId:{type:"string",defaultValue:""}},defaultAggregation:"tileActions",aggregations:{tileActions:{type:"sap.m.Button",forwarding:{getter:"_getTileActionSheet",aggregation:"buttons"}}}},renderer:G.getMetadata().getRenderer()});d.prototype.init=function(){G.prototype.init.apply(this,arguments);this.attachPress(this._handlePress,this);};d.prototype.exit=function(){if(this._oActionSheet){this._oActionSheet.destroy();}};d.prototype._getTileActionSheet=function(){if(!this._oActionSheet){this._oActionSheet=new a();}return this._oActionSheet;};d.prototype._handlePress=function(){if(this.getEditable()){this._getTileActionSheet().openBy(this);return;}var t=this.getTargetURL();if(!t){return;}if(t[0]==="#"){h.setHash(t);}else{var l=C.last("/core/shell/enableRecentActivity")&&C.last("/core/shell/enableRecentActivityLogging");if(l){var r={title:this.getTitle(),appType:A.URL,url:this.getTargetURL(),appId:this.getTargetURL()};sap.ushell.Container.getRenderer("fiori2").logRecentActivity(r);}W.openURL(t,"_blank");}};d.prototype.load=V.prototype.load;d.prototype.setDataHelpId=function(v){this.data("help-id",v,true);return this.setProperty("dataHelpId",v);};d.prototype.setTitle=function(v){this.setHeader(v);return this.setProperty("title",v);};d.prototype.setSubtitle=function(v){this.setSubheader(v);return this.setProperty("subtitle",v);};d.prototype.setTargetURL=function(v){this.setUrl(v);return this.setProperty("targetURL",v);};d.prototype.setProperty=function(p,v,s){if(p==="title"){this.setProperty("header",v,s);}if(p==="subtitle"){this.setProperty("subheader",v,s);}if(p==="targetURL"){this.setProperty("url",v,s);}if(p==="editable"){if(v){this.setProperty("scope",c.Actions,s);}else{this.setProperty("scope",c.Display,s);}}return G.prototype.setProperty.apply(this,arguments);};d.prototype.getAvailableDisplayFormats=V.prototype.getAvailableDisplayFormats;return d;});
