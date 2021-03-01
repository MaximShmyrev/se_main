// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/UIComponent","sap/ui/thirdparty/jquery","sap/base/Log","sap/base/util/ObjectPath","sap/ushell/components/applicationIntegration/AppLifeCycle","sap/ushell/ui/shell/ShellHeadItem","sap/m/NotificationListItem","sap/ushell/ui/shell/ToolAreaItem"],function(U,q,L,O,A,S,N,T){"use strict";var a=U.extend("sap.ushell.components.applicationIntegration.API",{metadata:{version:"1.86.3",dependencies:{version:"1.86.3",libs:["sap.ui.core","sap.m"],components:[]}}});a.prototype.createContent=function(){this.oShellModel=A;};a.prototype.createExtendedShellState=function(s,c){return this.oShellModel.createExtendedShellState(s,c);};a.prototype.applyExtendedShellState=function(s,c){this.oShellModel.applyExtendedShellState(s,c);};a.prototype.showLeftPaneContent=function(i,c,s){if(typeof i==="string"){this.oShellModel.addLeftPaneContent([i],c,s);}else{this.oShellModel.addLeftPaneContent(i,c,s);}};a.prototype.showHeaderItem=function(i,c,s){if(typeof i==="string"){this.oShellModel.addHeaderItem([i],c,s);}else{this.oShellModel.addHeaderItem(i,c,s);}};a.prototype.showRightFloatingContainerItem=function(i,c,s){if(typeof i==="string"){this.oShellModel.addRightFloatingContainerItem([i],c,s);}else{this.oShellModel.addRightFloatingContainerItem(i,c,s);}};a.prototype.showRightFloatingContainer=function(s){this.oShellModel.showRightFloatingContainer(s);};a.prototype.showToolAreaItem=function(i,c,s){this.oShellModel.addToolAreaItem(i,c,s);};a.prototype.showActionButton=function(i,c,s){var b=[],d=[],B;if(typeof i==="string"){i=[i];}b=i.filter(function(I){B=sap.ui.getCore().byId(I);return B instanceof sap.m.Button&&!(B instanceof sap.ushell.ui.launchpad.ActionItem);});d=i.filter(function(I){B=sap.ui.getCore().byId(I);return B instanceof sap.ushell.ui.launchpad.ActionItem;});if(b.length){this.convertButtonsToActions(b,c,s);}if(d.length){this.oShellModel.addActionButton(d,c,s);}};a.prototype.showFloatingActionButton=function(i,c,s){if(typeof i==="string"){this.oShellModel.addFloatingActionButton([i],c,s);}else{this.oShellModel.addFloatingActionButton(i,c,s);}};a.prototype.showHeaderEndItem=function(i,c,s){if(typeof i==="string"){this.oShellModel.addHeaderEndItem([i],c,s);}else{this.oShellModel.addHeaderEndItem(i,c,s);}};a.prototype.setHeaderVisibility=function(v,c,s){this.oShellModel.setHeaderVisibility(v,c,s);};a.prototype.showSubHeader=function(i,c,s){if(typeof i==="string"){this.oShellModel.addSubHeader([i],c,s);}else{this.oShellModel.addSubHeader(i,c,s);}};a.prototype.showSignOutItem=function(c,s){this.oShellModel.showSignOutButton(c,s);};a.prototype.showSettingsItem=function(c,s){this.oShellModel.showSettingsButton(c,s);};a.prototype.hideHeaderItem=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeHeaderItem([i],c,s);}else{this.oShellModel.removeHeaderItem(i,c,s);}};a.prototype.removeToolAreaItem=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeToolAreaItem([i],c,s);}else{this.oShellModel.removeToolAreaItem(i,c,s);}};a.prototype.removeRightFloatingContainerItem=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeRightFloatingContainerItem([i],c,s);}else{this.oShellModel.removeRightFloatingContainerItem(i,c,s);}};a.prototype.hideActionButton=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeActionButton([i],c,s);}else{this.oShellModel.removeActionButton(i,c,s);}};a.prototype.hideLeftPaneContent=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeLeftPaneContent([i],c,s);}else{this.oShellModel.removeLeftPaneContent(i,c,s);}};a.prototype.hideFloatingActionButton=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeFloatingActionButton([i],c,s);}else{this.oShellModel.removeFloatingActionButton(i,c,s);}};a.prototype.hideHeaderEndItem=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeHeaderEndItem([i],c,s);}else{this.oShellModel.removeHeaderEndItem(i,c,s);}};a.prototype.hideSubHeader=function(i,c,s){if(typeof i==="string"){this.oShellModel.removeSubHeader([i],c,s);}else{this.oShellModel.removeSubHeader(i,c,s);}};a.prototype.addShellSubHeader=function(p){var d=new q.Deferred(),t=this,c,C,b=p.controlType,o=p.oControlProperties,i=p.bIsVisible,e=p.bCurrentState,s=p.aStates;if(o&&o.id&&sap.ui.getCore().byId(o.id)){C=sap.ui.getCore().byId(o.id);if(C){if(i){this.showSubHeader(C.getId(),e,s);}d.resolve(C);}}if(b){c=b.replace(/\./g,"/");sap.ui.require([c],function(f){C=new f(o);if(i){t.showSubHeader(C.getId(),e,s);t.oShellModel.addElementToManagedQueue(C);}d.resolve(C);});}else{L.warning("You must specify control type in order to create it");}return d.promise();};a.prototype.addSubHeader=function(c,C,i,b,s){var d=c.replace(/\./g,"/"),o=sap.ui.require(d),e,f,r=false;if(o){r=true;}else if(!O.get(c)){q.sap.require(c);}f=function(C){if(c){if(r){return new o(C);}var g=O.get(c);return new g(C);}L.warning("You must specify control type in order to create it");};e=this.createItem(C,b,s,f);if(i){this.showSubHeader(e.getId(),b,s);}return e;};a.prototype.addUserAction=function(p){var d=new q.Deferred(),t=this,m=this.oShellModel.getModelToUpdate(),c,C,b=p.controlType,o=p.oControlProperties,i=p.bIsVisible,e=p.bCurrentState,s=p.aStates,n;if(o&&o.id&&sap.ui.getCore().byId(o.id)){C=sap.ui.getCore().byId(o.id);if(C){d.resolve(C);}}if(b){if(b==="sap.m.Button"){b="sap.ushell.ui.launchpad.ActionItem";}c=b.replace(/\./g,"/");sap.ui.require([c],function(f){var g=t.oShellModel.getModelToUpdate();t.oShellModel.setModelToUpdate(m,true);var h;if(o){if(o.id){h=o.id;}}C=sap.ui.getCore().byId(h)||new f(o);if(!C.getActionType){C=new f(o);}if(i){t.showActionButton(C.getId(),e,s);t.oShellModel.addElementToManagedQueue(C);}t.oShellModel.setModelToUpdate(g,false);d.resolve(C);});}else{n="You must specify control type in order to create it";L.warning(n);d.reject(n);}return d.promise();};a.prototype.addActionButton=function(c,C,i,b,s){var d,o,e,f,r=false;if(c==="sap.m.Button"){c="sap.ushell.ui.launchpad.ActionItem";}d=c.replace(/\./g,"/");o=sap.ui.require(d);if(o){r=true;}else if(!O.get(c)){q.sap.require(c);}f=function(C){if(c){if(r){return new o(C);}var g=O.get(c);return new g(C);}L.warning("You must specify control type in order to create it");};e=this.createItem(C,b,s,f);if(i){this.showActionButton(e.getId(),b,s);}return e;};a.prototype.addFloatingButton=function(p){var d=new q.Deferred(),t=this,c,C,b=p.controlType,o=p.oControlProperties,i=p.bIsVisible,e=p.bCurrentState,s=p.aStates;if(o&&o.id&&sap.ui.getCore().byId(o.id)){C=sap.ui.getCore().byId(o.id);if(C){if(i){t.oShellModel.addElementToManagedQueue(C);t.showFloatingActionButton(oItem.getId(),e,s);}d.resolve(C);}}if(b){c=b.replace(/\./g,"/");}else{c="sap/m/Button";}sap.ui.require([c],function(f){C=new f(o);if(i){this.showFloatingActionButton(oItem.getId(),e,s);}d.resolve(C);});return d.promise();};a.prototype.addFloatingActionButton=function(c,C,i,b,s){var d,o,e,f,r=false;if(!c){c="sap.m.Button";}d=c.replace(/\./g,"/");o=sap.ui.require(d);if(o){r=true;}else if(!O.get(c)){q.sap.require(c);}f=function(C){if(c){if(r){return new o(C);}var g=O.get(c);return new g(C);}L.warning("You must specify control type in order to create it");};e=this.createItem(C,b,s,f);if(i){this.showFloatingActionButton(e.getId(),b,s);}return e;};a.prototype.addSidePaneContent=function(p){var d=new q.Deferred(),t=this,c,C,b=p.controlType,o=p.oControlProperties,i=p.bIsVisible,e=p.bCurrentState,s=p.aStates;if(o&&o.id&&sap.ui.getCore().byId(o.id)){C=sap.ui.getCore().byId(o.id);if(C){d.resolve(C);}}if(b){c=b.replace(/\./g,"/");sap.ui.require([c],function(f){C=new f(o);if(i){t.oShellModel.addElementToManagedQueue(C);t.showLeftPaneContent(oItem.getId(),e,s);}d.resolve(C);});}else{L.warning("You must specify control type in order to create it");}return d.promise();};a.prototype.addLeftPaneContent=function(c,C,i,b,s){var d=c.replace(/\./g,"/"),o=sap.ui.require(d),e,f,r;if(o){r=true;}else if(!O.get(c)){q.sap.require(c);}f=function(C){if(c){if(r){return new o(C);}var g=O.get(c);return new g(C);}L.warning("You must specify control type in order to create it");};e=this.createItem(C,b,s,f);if(i){this.showLeftPaneContent(e.getId(),b,s);}return e;};a.prototype.addHeaderItem=function(c,C,i,b,s){if(typeof(arguments[0])==="object"&&typeof(arguments[1])==="boolean"){C=arguments[0];i=arguments[1];b=arguments[2];s=arguments[3];}else{L.warning("sap.ushell.renderers.fiori2.Renderer: The parameter 'controlType' of the function 'addHeaderItem' is deprecated. Usage will be ignored!");}var p=C;p.showSeparator=false;var f=function(C){return new S(C);},I=this.createItem(p,b,s,f);if(i){this.showHeaderItem(I.getId(),b,s);}return I;};a.prototype.addRightFloatingContainerItem=function(c,i,C,s){var f=function(c){return new N(c);},I=this.createItem(c,C,s,f);if(i){this.showRightFloatingContainerItem(I.getId(),C,s);}return I;};a.prototype.addToolAreaItem=function(c,i,C,s){var f=function(c){return new T(c);},I=this.createItem(c,C,s,f);if(i){this.showToolAreaItem(I.getId(),C,s);}return I;};a.prototype.addHeaderEndItem=function(c,C,i,b,s){var p=C;p.showSeparator=false;var f=function(C){return new S(C);},I=this.createItem(p,b,s,f);if(i){this.showHeaderEndItem(I.getId(),b,s);}return I;};a.prototype.setLeftPaneVisibility=function(l,v){this.oShellModel.setLeftPaneVisibility(v,false,[l]);};a.prototype.showToolArea=function(l,v){this.oShellModel.showShellItem("/toolAreaVisible",l,v);};a.prototype.setHeaderHiding=function(h){return this.oShellModel.setHeaderHiding(h);};a.prototype.LaunchpadState={App:"app",Home:"home"};a.prototype.createInspection=function(s,c,C,b){this.oShellModel.createInspection(s,c,C,b);};a.prototype.createTriggers=function(t,c,s){this.oShellModel.createTriggers(t,c,s);};a.prototype.convertButtonsToActions=function(i,c,s){var p={},b,t=this;i.forEach(function(I){b=sap.ui.getCore().byId(I);p.id=b.getId();p.text=b.getText();p.icon=b.getIcon();p.tooltip=b.getTooltip();p.enabled=b.getEnabled();p.visible=b.getVisible();if(b.mEventRegistry&&b.mEventRegistry.press){p.press=b.mEventRegistry.press[0].fFunction;}b.destroy();t.addActionButton("sap.ushell.ui.launchpad.ActionItem",p,p.visible,c,s);});};a.prototype.createItem=function(c,C,s,f){var i;if(c&&c.id){i=sap.ui.getCore().byId(c.id);}if(!i){i=f(c);if(C){this.oShellModel.addElementToManagedQueue(i);}}return i;};a.prototype.addEntryInShellStates=function(n,e,f,r,s){this.oShellModel.addEntryInShellStates(n,e,f,r,s);};a.prototype.removeCustomItems=function(s,i,c,b){if(typeof i==="string"){this.oShellModel.removeCustomItems(s,[i],c,b);}else{this.oShellModel.removeCustomItems(s,i,c,b);}};a.prototype.addCustomItems=function(s,i,c,b){if(typeof i==="string"){this.oShellModel.addCustomItems(s,[i],c,b);}else{this.oShellModel.addCustomItems(s,i,c,b);}};return a;});
