sap.ui.define(["sap/ui/base/Object","sap/base/util/extend"],function(B,e){"use strict";function g(t){var s=t.oAppComponent.suppressDataLossPopup();var o;var O;function d(a,b,c,m,i){var D,f;o=a;O=b;var F=i?"sap.suite.ui.generic.template.fragments.DataLossTechnicalError":"sap.suite.ui.generic.template.fragments.DataLoss";c.getDialogFragmentAsync(F,{onDataLossOK:function(){f.close();o();},onDataLossCancel:function(){f.close();O();}},"dataLoss").then(function(h){f=h;m=m||"LeavePage";D=f.getModel("dataLoss");D.setProperty("/mode",m);f.open();});}function G(){var a=t.oNavigationControllerProxy.getActiveComponents();var f,F,b;a.forEach(function(c){var r=t.componentRegistry[c];if(r.utils.isDraftEnabled()){return;}b=b||r;var u=r.oComponent.getModel("ui");if(u.getProperty("/editable")){f=f||r;}if(r.aUnsavedDataCheckFunctions&&r.aUnsavedDataCheckFunctions.some(function(U){return U();})){F=F||r;}});return{relevantRegistryEntry:F||f||b,hasExternalChanges:!!F};}function p(f,n,m,i){var r=G();var h=r.relevantRegistryEntry&&(r.hasExternalChanges||t.oAppComponent.getModel().hasPendingChanges());var a=r.relevantRegistryEntry?function(){r.relevantRegistryEntry.utils.cancelEdit(null,h);f();}:f;var N=!s&&h;if(N){d(a,n,r.relevantRegistryEntry.oControllerUtils.oCommonUtils,m,i);}else{a();}}function P(f,c,m,n,i){var r=new Promise(function(R,a){var b=function(){var r=f();R(r);};var N=function(){c();a();};if(n){p(b,N,m,i);}else{t.oApplicationProxy.performAfterSideEffectExecution(p.bind(null,b,N,m,i),true);}});return r;}return{performIfNoDataLoss:P};}return B.extend("sap.suite.ui.generic.template.lib.DataLossHandler",{constructor:function(t){e(this,g(t));}});});