/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/Log","../DvlException"],function(L,D){"use strict";var g=function(o){if(typeof o==="number"){var r=o;var m=sap.ve.dvl.DVLRESULT.getDescription?sap.ve.dvl.DVLRESULT.getDescription(r):"";L.error(m,JSON.stringify({errorCode:r}),"sap.ve.dvl");throw new D(r,m);}return o;};return g;},true);
