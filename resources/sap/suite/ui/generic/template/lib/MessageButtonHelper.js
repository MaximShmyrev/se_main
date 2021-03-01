sap.ui.define(["sap/ui/base/Object","sap/m/MessagePopover","sap/m/MessagePopoverItem","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/suite/ui/generic/template/lib/MessageUtils","sap/suite/ui/generic/template/genericUtilities/testableHelper",'sap/ui/core/Element',"sap/base/util/extend"],function(B,M,a,F,b,c,t,E,e){"use strict";F=t.observableConstructor(F,true);var p=new F({path:"persistent",operator:b.EQ,value1:false});var s=new F({path:"technical",operator:b.EQ,value1:false});var v=new F({path:"validation",operator:b.EQ,value1:true});var I=new F({filters:[v,new F({path:"validation",operator:b.EQ,value1:false})],and:true});function g(T,h,d){var C=h.controller;var u=C.getOwnerComponent().getModel("ui");var m=C.byId("showMessages");var f=T.oComponentUtils.isDraftEnabled();var A=false;var o;var j;function k(i){return!!(i&&T.oCommonUtils.getPositionableControlId(i));}function l(i){if(h.getGroupTitle){return h.getGroupTitle(i);}return"";}var n;var q=T.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.fragments.MessagePopover",{beforeOpen:function(){var Y=n.getCurrentContexts();if(h.prepareAllMessagesForNavigation){for(var i=0;i<Y.length;i++){var Z=Y[i].getObject();if(!k(Z.controlIds)){h.prepareAllMessagesForNavigation();return;}}}},isPositionable:k,getGroupTitle:l,titlePressed:function(i){c.navigateFromMessageTitleEvent(T.oCommonUtils,i,C);}});q.setModel(sap.ui.getCore().getMessageManager().getMessageModel(),"msg");q.setGroupItems(true);n=q.getBinding("items");var r;(function(){var Y=C.getOwnerComponent();r=new F({path:"target",operator:b.EQ,value1:"/"+Y.getEntitySet()});var Z=Y.getModel("_templPriv");Z.setProperty("/generic/messageCount",0);var $=T.oCommonUtils.getText("MESSAGE_BUTTON_TOOLTIP_P",0);Z.setProperty("/generic/messageButtonTooltip",$);n.attachChange(function(){var _=n.getLength();var a1={iSeverityMessageCount:_};if(_>0){var b1=q.getItems();var c1=0;var d1=0;var e1=0;var f1=0;for(var i=0;i<b1.length;i++){if(b1[i].getType()==="Error"){c1=c1+1;}else if(b1[i].getType()==="Warning"){d1=d1+1;}else if(b1[i].getType()==="Information"){e1=e1+1;}else{f1=f1+1;}}if(c1>0){a1={iSeverityMessageCount:c1,messageSeverity:"Negative",icon:"sap-icon://message-error"};}else if(d1>0){a1={iSeverityMessageCount:d1,messageSeverity:"Critical",icon:"sap-icon://message-warning"};}else if(e1>0){a1={iSeverityMessageCount:e1,messageSeverity:"Emphasized",icon:"sap-icon://message-information"};}else{a1={iSeverityMessageCount:f1,messageSeverity:"Success",icon:"sap-icon://message-success"};}Z.setProperty("/generic/messageBtnIcon",a1.icon);Z.setProperty("/generic/messageSeverity",a1.messageSeverity);}Z.setProperty("/generic/messageCount",a1.iSeverityMessageCount);$=T.oCommonUtils.getText(_===1?"MESSAGE_BUTTON_TOOLTIP_S":"MESSAGE_BUTTON_TOOLTIP_P",_);Z.setProperty("/generic/messageButtonTooltip",$);});})();var L=new F({filters:[v,new F({path:"controlIds",test:function(i){return!!T.oCommonUtils.getPositionableControlId(i);},caseSensitive:true})],and:true});var w=[];var x;var y=0;var N;var z;var D;function G(Y){if(Array.isArray(Y)){var Z=false;for(var i=0;i<Y.length;i++){Z=G(Y[i])||Z;}return Z;}if(Y instanceof Promise){Y.then(N);return false;}D.push(Y);return true;}function H(i){z=i;n.filter(z);}function J(){if(A){o=new F({filters:D,and:false});var i=[o,p];if(T.oServices.oApplication.needsToSuppressTechnicalStateMessages()){i.push(s);}j=new F({filters:i,and:true});H(new F({filters:[j,L],and:false}));if(h.messageSorter){n.sort(h.messageSorter);}}}function R(i,Y){if(i===y&&G(Y)){J();}}function K(i){var Y=i();return G(Y);}function O(){w.forEach(K);}function P(i){x=i;y++;N=R.bind(null,y);var Y=d&&!f&&u.getProperty("/createMode");D=d?[new F({path:Y?"target":"fullTarget",operator:b.StartsWith,value1:x}),r]:[];O();J();}function Q(i){w.push(i);if(x!==undefined&&K(i)){J();}}var S;function U(){S=S||function(){if(n.getLength()>0){q.navigateBack();q.openBy(m);}};setTimeout(S,0);}function V(i){A=i;if(i){if(D){J();}}else{D=null;H(I);}}function W(i){return i?L:z;}function X(i){return i?j:o;}return{adaptToContext:P,toggleMessagePopover:q.toggle.bind(q,m),showMessagePopover:U,registerMessageFilterProvider:Q,setEnabled:V,getMessageFilters:W,getContextFilter:X};}return B.extend("sap.suite.ui.generic.template.lib.MessageButtonHelper",{constructor:function(T,h,i){e(this,(t.testableStatic(g,"MessageButtonHelper"))(T,h,i));}});});