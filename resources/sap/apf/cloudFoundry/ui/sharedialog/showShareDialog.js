sap.ui.define(["sap/apf/cloudFoundry/ui/utils/ComponentCorrector","sap/ui/core/library"],function(C,a){'use strict';var P="sap.apf.cloudFoundry.ui.sharedialog";var V=a.mvc.ViewType;function s(c,o){C.createView(c.getComponent(),{viewName:P+".view.ShareDialog",type:V.XML,viewData:{oCoreApi:c,oController:o}});}return{show:s};});