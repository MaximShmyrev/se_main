// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/Sorter"],function(C,S){"use strict";var s={id:"spaceAssignmentColumnSpaceId",description:"spaceAssignmentColumnSpaceDescription",title:"spaceAssignmentColumnSpaceTitle"};return C.extend("sap.ushell.applications.PageComposer.controller.ViewSettingsSpaceAssignmentCreated",{constructor:function(P){this.PageDetailController=P;},handleSpaceAssignmentDialogConfirm:function(e){var p=e.getParameters(),c="spaceAssignmentTable",t=this.PageDetailController.byId(c),b=t.getBinding("items");if(p.sortItem){b.sort(new S(p.sortItem.getKey(),p.sortDescending));this.PageDetailController.updateSortIndicators(p.sortItem.getKey(),p.sortDescending,s,t.getColumns());}else{b.sort(new S("id",true));this.PageDetailController.updateSortIndicators("id",true,s,t.getColumns());}}});});
