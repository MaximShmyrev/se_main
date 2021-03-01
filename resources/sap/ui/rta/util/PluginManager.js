/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/rta/command/CommandFactory","sap/ui/rta/plugin/Rename","sap/ui/rta/plugin/DragDrop","sap/ui/rta/plugin/RTAElementMover","sap/ui/rta/plugin/CutPaste","sap/ui/rta/plugin/Remove","sap/ui/rta/plugin/CreateContainer","sap/ui/rta/plugin/additionalElements/AdditionalElementsPlugin","sap/ui/rta/plugin/additionalElements/AddElementsDialog","sap/ui/rta/plugin/additionalElements/AdditionalElementsAnalyzer","sap/ui/rta/plugin/Combine","sap/ui/rta/plugin/Split","sap/ui/rta/plugin/Selection","sap/ui/rta/plugin/Settings","sap/ui/rta/plugin/Stretch","sap/ui/rta/plugin/ControlVariant","sap/ui/rta/plugin/iframe/AddIFrame","sap/ui/dt/plugin/ToolHooks","sap/ui/dt/plugin/ContextMenu","sap/ui/dt/plugin/TabHandling","sap/base/util/isEmptyObject","sap/base/util/values"],function(M,C,R,a,b,c,d,e,A,f,g,h,S,i,j,k,l,m,T,n,o,p,v){"use strict";var P=M.extend("sap.ui.rta.util.PluginManager",{metadata:{properties:{plugins:{type:"any",defaultValue:{}}}}});P.prototype.init=function(){this.iEditableOverlaysCount=0;};P.prototype.getEditableOverlaysCount=function(){return this.iEditableOverlaysCount;};P.prototype.getDefaultPlugins=function(F){if(!this._mDefaultPlugins){this._oCommandFactory=new C({flexSettings:F});this._mDefaultPlugins={};this._mDefaultPlugins["selection"]=new i({commandFactory:this._oCommandFactory,multiSelectionRequiredPlugins:[h.getMetadata().getName(),d.getMetadata().getName()],elementEditableChange:this.onElementEditableChange.bind(this)});this._oRTAElementMover=new b({commandFactory:this._oCommandFactory});this._mDefaultPlugins["dragDrop"]=new a({elementMover:this._oRTAElementMover,commandFactory:this._oCommandFactory,dragStarted:this.handleStopCutPaste.bind(this)});this._mDefaultPlugins["rename"]=new R({commandFactory:this._oCommandFactory,editable:this.handleStopCutPaste.bind(this)});this._mDefaultPlugins["additionalElements"]=new A({commandFactory:this._oCommandFactory,analyzer:g,dialog:new f()});this._mDefaultPlugins["createContainer"]=new e({commandFactory:this._oCommandFactory});this._mDefaultPlugins["remove"]=new d({commandFactory:this._oCommandFactory});this._mDefaultPlugins["cutPaste"]=new c({elementMover:this._oRTAElementMover,commandFactory:this._oCommandFactory});this._mDefaultPlugins["settings"]=new j({commandFactory:this._oCommandFactory});this._mDefaultPlugins["combine"]=new h({commandFactory:this._oCommandFactory});this._mDefaultPlugins["split"]=new S({commandFactory:this._oCommandFactory});this._mDefaultPlugins["contextMenu"]=new n();this._mDefaultPlugins["tabHandling"]=new o();this._mDefaultPlugins["stretch"]=new k();this._mDefaultPlugins["controlVariant"]=new l({commandFactory:this._oCommandFactory});this._mDefaultPlugins["addIFrame"]=new m({commandFactory:this._oCommandFactory});this._mDefaultPlugins["toolHooks"]=new T();}return Object.assign({},this._mDefaultPlugins);};P.prototype.preparePlugins=function(F,H,q){if(p(this.getPlugins())){this.setPlugins(this.getDefaultPlugins(F));}else{this._destroyDefaultPlugins(this.getPlugins());}Object.keys(this.getPlugins()).forEach(function(s){if(this.getPlugin(s).attachElementModified){this.getPlugin(s).attachElementModified(H);}}.bind(this));this.provideCommandStack("settings",q);};P.prototype.getPluginList=function(){return v(this.getPlugins());};P.prototype.getPlugin=function(s){return this.getPlugins()[s];};P.prototype.provideCommandStack=function(s,q){if(this.getPlugin(s)){this.getPlugin(s).setCommandStack(q);}};P.prototype.onElementEditableChange=function(E){var q=E.getParameter("editable");if(q){this.iEditableOverlaysCount+=1;}else{this.iEditableOverlaysCount-=1;}};P.prototype.handleStopCutPaste=function(){var q=this.getPlugin("cutPaste");if(q){q.stopCutAndPaste();}};P.prototype._destroyDefaultPlugins=function(q){for(var D in this._mDefaultPlugins){var r=this._mDefaultPlugins[D];if(r&&!r.bIsDestroyed){if(!q||q[D]!==r){r.destroy();}}}};return P;});