/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/layout/form/Form'],function(F){"use strict";function i(e){return e.getParent().isA("sap.ui.layout.form.FormElement");}function I(f){if((f instanceof F)&&f.getLayout()&&f.getLayout().getMetadata().getName()==="sap.ui.layout.form.GridLayout"){return false;}return true;}return{palette:{group:"LAYOUT",icons:{svg:"sap/ui/layout/designtime/form/Form.icon.svg"}},aggregations:{title:{ignore:true},toolbar:{ignore:function(f){return!f.getToolbar();},domRef:function(f){return f.getToolbar().getDomRef();}},formContainers:{propagateRelevantContainer:true,propagateMetadata:function(e){if(i(e)){return{actions:"not-adaptable"};}},childNames:{singular:"GROUP_CONTROL_NAME",plural:"GROUP_CONTROL_NAME_PLURAL"},domRef:":sap-domref",actions:{move:function(f){if(I(f)){return"moveControls";}else{return null;}},createContainer:function(f){if(I(f)){return{changeType:"addGroup",isEnabled:true,getCreatedContainerId:function(n){return n;}};}else{return null;}}}}}};});
