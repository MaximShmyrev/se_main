// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/URI","sap/ui/base/EventProvider","sap/ui/core/LocaleData","sap/base/Log"],function(U,E,L,a){"use strict";function c(o){if(o===undefined){return undefined;}return jQuery.extend(true,{},o);}function g(u){var o;if(u.host&&typeof u.host==="function"&&u.host()){o=u.host();if(typeof u.protocol==="function"&&u.protocol()){o=u.protocol()+"://"+o;}return o;}return"";}function b(t){return t.indexOf("sap_")===0;}var d=function(C){var e=[],B,s,o,S,f=new E();this.getEmail=function(){return C.email;};this.getFirstName=function(){return C.firstName;};this.getFullName=function(){return C.fullName;};this.getTimeZone=function(){return C.timeZone;};this.getInitials=function(){var F=C.fullName||"",I="",n=true;for(var i=0,l=F.length;i<l;++i){if(F[i]===" "){n=true;}else if(n){n=false;I+=F[i];}}return I;};this.getId=function(){return C.id;};this.getLanguage=function(){return C.language;};this.getLanguageBcp47=function(){return C.languageBcp47;};this.getLanguageText=function(){var l=sap.ui.getCore().getConfiguration().getLocale(),h=new L(l),i=sap.ui.getCore().getConfiguration().getLanguageTag();i=i.replace("-","_");var j=h.getLanguages(),k=j[i]||this.getLanguage().toUpperCase();return k;};this.getLastName=function(){return C.lastName;};this.getImage=function(){return C.image;};this.setImage=function(u){C.image=u;f.fireEvent("onSetImage",u);};this.attachOnSetImage=function(F,D){f.attachEvent("onSetImage",F,D);};this.isJamActive=function(){return C.isJamActive===true;};this.isLanguagePersonalized=function(){return C.isLanguagePersonalized===true;};this.getTheme=function(t){if(t===d.prototype.constants.themeFormat.ORIGINAL_THEME){return S.originalTheme.theme;}if(t===d.prototype.constants.themeFormat.THEME_NAME_PLUS_URL){return o.theme+(o.locationPath?"@"+o.locationOrigin+o.locationPath:"");}if(t===d.prototype.constants.themeFormat.NWBC){if(b(o.theme)){return o.theme;}return this.getTheme(d.prototype.constants.themeFormat.THEME_NAME_PLUS_URL);}return o.theme;};this.getThemeRoot=function(t){if(C.ranges&&C.ranges.theme&&C.ranges.theme[t]&&C.ranges.theme[t].themeRoot){return C.ranges.theme[t].themeRoot;}return"";};this.setTheme=function(n){if(this.isSetThemePermitted()===false){var h="setTheme not permitted";a.error(h);throw new Error(h);}o=this._amendTheme({theme:n,root:this.getThemeRoot(n)},s);if(n!==S.originalTheme.theme){this.setChangedProperties({propertyName:"theme",name:"THEME"},S.originalTheme.theme,n);S=o;}this.applyTheme(n);};this.applyTheme=function(n){var t=this;var T=this._amendTheme({theme:n,root:this.getThemeRoot(n)},s),N;o=T;if(T.suppliedRoot){sap.ui.getCore().applyTheme(T.theme,T.suppliedRoot+"/UI5/");}else if(T.path){sap.ui.getCore().applyTheme(T.theme,T.path+"/UI5/");}else{sap.ui.getCore().applyTheme(T.theme);}sap.ui.require(["sap/ushell/components/applicationIntegration/AppLifeCycle"],function(A){N=t.getTheme(d.prototype.constants.themeFormat.NWBC);A.postMessageToIframeApp("sap.ushell.appRuntime","themeChange",{currentThemeId:N,themeServiceRoute:window.location.protocol+"//"+window.location.host+"/comsapuitheming.runtime/themeroot/v1"});});};this.setLanguage=function(n){if(n){this.setChangedProperties({propertyName:"language",name:"LANGUAGE"},C.language,n);C.language=n;}};this.getAccessibilityMode=function(){return C.accessibility;};this.setAccessibilityMode=function(A){if(this.isSetAccessibilityPermitted()===false){var h="setAccessibilityMode not permitted";a.error(h);throw new Error(h);}C.accessibility=A;};this.isSetAccessibilityPermitted=function(){return C.setAccessibilityPermitted;};this.isSetThemePermitted=function(){return C.setThemePermitted;};this.getContentDensity=function(){return C.contentDensity;};this.setContentDensity=function(h){if(this.isSetContentDensityPermitted()===false){var i="setContentDensity not permitted";a.error(i);throw new Error(i);}this.setChangedProperties({propertyName:"contentDensity",name:"CONTENT_DENSITY"},C.contentDensity,h);C.contentDensity=h;};this.isSetContentDensityPermitted=function(){return C.setContentDensityPermitted;};this.getChangedProperties=function(){return jQuery.extend(true,[],e);};this.setChangedProperties=function(p,h,n){e.push({propertyName:p.propertyName,name:p.name,oldValue:h,newValue:n});};this.resetChangedProperties=function(){e=[];};this.resetChangedProperty=function(p){e=e.filter(function(P){return!(p===P.propertyName);});};this.getTrackUsageAnalytics=function(){return C.trackUsageAnalytics;};this.setTrackUsageAnalytics=function(t){this.setChangedProperties({propertyName:"trackUsageAnalytics",name:"TRACKING_USAGE_ANALYTICS"},C.trackUsageAnalytics,t);C.trackUsageAnalytics=t;};this.setImageConsent=function(i){this.setChangedProperties({propertyName:"isImageConsent",name:"ISIMAGECONSENT"},C.isImageConsent,i);C.isImageConsent=i;};this.getImageConsent=function(){return C.isImageConsent;};s={locationPathUi5:(new U(jQuery.sap.getModulePath(""))).absoluteTo(document.location).pathname(),locationPathCustom:C.themeRoot||"",locationOrigin:g(new U(document.location))};if(!s.locationPathUi5){a.warning("User: Could not set UI5 location path");}if(!s.locationPathCustom){a.warning("User: Could not set location path for custom themes");}if(!s.locationOrigin){a.warning("User: Could not set front-end server location origin");}B=C.bootTheme||{theme:"",root:""};o=this._amendTheme(B,s);S=o;};d.prototype._amendTheme=function(t,s){var T={},e,r;function f(R,o){var u,O,p={};u=new U(R);O=g(u);if(O){p.locationOrigin=O;p.locationPath=u.path();}else{p.locationOrigin=o.locationOrigin;p.locationPath=R;}return p;}if(!t||!t.theme||!s){return{originalTheme:{theme:"",root:""},theme:"",suppliedRoot:"",path:"",locationPath:"",locationOrigin:""};}T.originalTheme=c(t);if(T.originalTheme.theme.indexOf("@")>0){e=T.originalTheme.theme.split("@",2);T.theme=e[0];T.suppliedRoot=e[1];r=f(e[1],s);T.locationPath=r.locationPath;T.path=T.locationPath;T.locationOrigin=r.locationOrigin;return T;}T.theme=T.originalTheme.theme;if(T.originalTheme.root){T.suppliedRoot=T.originalTheme.root;r=f(T.originalTheme.root,s);T.locationPath=r.locationPath;T.path=T.locationPath;T.locationOrigin=r.locationOrigin;return T;}T.suppliedRoot="";if(b(T.theme)){T.locationOrigin=s.locationOrigin;T.locationPath=s.locationPathUi5;T.path="";return T;}T.locationOrigin=s.locationOrigin;T.locationPath=s.locationPathCustom;T.path=T.locationPath;return T;};d.prototype.constants={themeFormat:{ORIGINAL_THEME:"O",THEME_NAME_PLUS_URL:"N+U",NWBC:"NWBC"}};return d;},true);
