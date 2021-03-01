// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/bootstrap/common/common.load.xhrlogon","sap/ushell/bootstrap/common/common.configure.xhrlogon","./abap.bootstrap.utils","./XhrLogonEventHandler"],function(x,c,a,X){"use strict";var h={};h.getLogonMode=function(C){return a.getUrlParameterValue("sap-ushell-xhrLogon-mode")||C&&C.xhrLogon&&C.xhrLogon.mode||"frame";};h.initXhrLogon=function(C){var l=h.getLogonMode(C),o=h.createXhrLogonEventHandler(window,l),L=x.LogonManager.getInstance(),b=x.XHRLogonManager.getInstance();x.start();if(l==="reload"||l==="logoffAndRedirect"){L.unregisterAllHandlers();L.registerAuthHandler("*",function(e){o.handleEvent(e);});}else if(l!=="frame"){sap.ui2.srvc.log.warning("Unknown setting for xhrLogonMode: '"+l+"'. Using default mode 'frame'.",null,"sap.ushell_abap.bootstrap.evo.abap.xhr.handler");}XMLHttpRequest.logger=c.createUi5ConnectedXhrLogger();c.initXhrLogonIgnoreList(b);};h.createXhrLogonEventHandler=function(w,s){return new X(w,s);};return h;});
