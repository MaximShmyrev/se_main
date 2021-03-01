/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/m/Popover"],function(l,P){"use strict";var a=l.PlacementType;return function(){this.createPopover=function(i,p,o){var t=this,b=new P(i.getId()+"-popup",{showArrow:false,placement:a.VerticalPreferredBottom,showHeader:true,initialFocus:i,horizontalScrolling:true,beforeClose:function(){if(t.bMessageValueStateActive){t._getValueStateHeader().removeStyleClass("sapMPseudoFocus");t.bMessageValueStateActive=false;}}});return _(b,i);};this.resizePopup=function(i){var p=this.getPopover();if(this.getItemsContainer()&&p){if(this._sPopoverContentWidth){p.setContentWidth(this._sPopoverContentWidth);}else{p.setContentWidth((i.$().outerWidth())+"px");}setTimeout(function(){if(p&&p.isOpen()&&p.$().outerWidth()<i.$().outerWidth()){p.setContentWidth((i.$().outerWidth())+"px");}},0);}};function _(p,i){p.open=function(){this.openBy(i,false,true);};p.oPopup.setAnimations(function(r,R,o){o();},function(r,R,c){c();});return p;}};});
