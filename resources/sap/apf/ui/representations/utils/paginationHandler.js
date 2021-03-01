/* SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.utils.paginationHandler");(function(){'use strict';sap.apf.ui.representations.utils.PaginationHandler=function(){this.pagingOption={top:100,skip:0};};sap.apf.ui.representations.utils.PaginationHandler.prototype.constructor=sap.apf.ui.representations.utils.PaginationHandler;function _(p,t){p.pagingOption.skip=t.getData().tableData.length;p.pagingOption.top=99;}function a(p,t){var T=t.tableControl.getModel();var d=T.getData();_(p,T);if(!p.bPaginationTriggered&&(p.pagingOption.skip<t.nDataResponseCount)){t.tableControl.getParent().setBusy(true);sap.ui.getCore().applyChanges();var A=t.oApi.getActiveStep();p.bPaginationTriggered=true;t.oApi.updatePath(function(s,S){p.bPaginationTriggered=false;if(s===A){T.setData(d);t.markSelectionInTable();t.tableControl.getParent().setBusy(false);if(T.getData().tableData.length>=t.nDataResponseCount){t.oLoadMoreLink.setVisible(false);}}});}}function b(p,t){t.oLoadMoreLink.setVisible(true);t.oLoadMoreLink.attachPress(function(){a(p,t);});}function c(p,t){var d=t.tableControl;t.tableControl.attachFirstVisibleRowChanged(function(e){var i=e.getParameter("firstVisibleRow");var v=d.getVisibleRowCount();var f=p.pagingOption.top+p.pagingOption.skip;if(i+v+10>f){a(p,t);}});}sap.apf.ui.representations.utils.PaginationHandler.prototype.attachPaginationOnTable=function(t){if(sap.ui.Device.system.desktop){c(this,t);}else{b(this,t);}};sap.apf.ui.representations.utils.PaginationHandler.prototype.getPagingOption=function(t){var d,s;if(t){d=t;s=0;}else if(this.pagingOption.top!==100&&this.pagingOption.skip!==0){d=this.pagingOption.top;s=this.pagingOption.skip;}else{d=100;s=0;}this.pagingOption={inlineCount:t?false:true,top:d,skip:s};return this.pagingOption;};sap.apf.ui.representations.utils.PaginationHandler.prototype.resetPaginationOption=function(){this.pagingOption={top:100,skip:0};};}());
