/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./FlexBoxCssPropertyMap','sap/ui/Device'],function(F,D){"use strict";var a={};a.setFlexItemStyles=function(r,l){r=r||null;var o=''+l.getOrder(),g=''+l.getGrowFactor(),s=''+l.getShrinkFactor(),b=l.getBaseSize().toLowerCase(),m=l.getMinHeight(),M=l.getMaxHeight(),c=l.getMinWidth(),d=l.getMaxWidth();if(typeof o!=='undefined'){a.setStyle(r,l,"order",o);}if(typeof g!=='undefined'){a.setStyle(r,l,"flex-grow",g);}if(typeof s!=='undefined'){a.setStyle(r,l,"flex-shrink",s);}if(typeof b!=='undefined'){a.setStyle(r,l,"flex-basis",b);}if(typeof m!=='undefined'){a.setStyle(r,l,"min-height",m);}if(typeof M!=='undefined'){a.setStyle(r,l,"max-height",M);}if(typeof c!=='undefined'){a.setStyle(r,l,"min-width",c);}if(typeof d!=='undefined'){a.setStyle(r,l,"max-width",d);}};a.setStyle=function(r,l,p,v){if(typeof(v)==="string"){v=v.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase();}else if(typeof(v)==="number"){v=v.toString();}a.writeStyle(r,l,p,v);};a.writeStyle=function(r,l,p,v){if(D.browser.internet_explorer&&(p==="flex-basis"||p==="flex-preferred-size")){if(l.getParent()){if(l.getParent().getParent().getDirection().indexOf("Row")>-1){p="width";}else{p="height";}}}if(r){if(v==="0"||v){r.style(p,v);}}else{if(l.$().length){if(v!=="0"&&!v){l.$().css(p,null);}else{l.$().css(p,v);}}else{if(l.getParent()){if(v!=="0"&&!v){l.getParent().$().css(p,null);}else{l.getParent().$().css(p,v);}}}}};return a;},true);
