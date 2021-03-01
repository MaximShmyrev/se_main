/*
 * ! SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/m/MessageBox","sap/ui/comp/util/DateTimeUtil","sap/ui/comp/filterbar/FilterBar","sap/ui/comp/filterbar/FilterGroupItem","sap/ui/comp/filterbar/FilterItem","sap/ui/comp/library","./AdditionalConfigurationHelper","./ControlConfiguration","./FilterProvider","./GroupConfiguration","sap/ui/comp/util/FormatUtil","sap/ui/comp/smartvariants/PersonalizableInfo","sap/ui/comp/smartvariants/SmartVariantManagement","sap/ui/comp/odata/ODataModelUtil","sap/ui/core/library","sap/ui/comp/variants/VariantItem","sap/ui/model/odata/AnnotationHelper","sap/ui/model/Context","sap/ui/comp/filterbar/VariantConverterFrom","sap/base/Log","sap/base/util/merge"],function(q,M,D,F,a,b,l,A,C,c,G,d,P,S,O,f,V,g,h,k,L,m){"use strict";var n=f.ValueState;var o=l.smartfilterbar.FilterType;var p=F.extend("sap.ui.comp.smartfilterbar.SmartFilterBar",{metadata:{library:"sap.ui.comp",designtime:"sap/ui/comp/designtime/smartfilterbar/SmartFilterBar.designtime",properties:{entityType:{type:"string",group:"Misc",defaultValue:null},entitySet:{type:"string",group:"Misc",defaultValue:null},resourceUri:{type:"string",group:"Misc",defaultValue:null},basicSearchFieldName:{type:"string",group:"Misc",defaultValue:null},enableBasicSearch:{type:"boolean",group:"Misc",defaultValue:false},liveMode:{type:"boolean",group:"Misc",defaultValue:false},showMessages:{type:"boolean",group:"Misc",defaultValue:true},considerAnalyticalParameters:{type:"boolean",group:"Misc",defaultValue:false},useDateRangeType:{type:"boolean",group:"Misc",defaultValue:null},suppressSelection:{type:"boolean",group:"Misc",defaultValue:false},considerSelectionVariants:{type:"boolean",group:"Misc",defaultValue:false},defaultSelectionVariantName:{type:"string",group:"Misc",defaultValue:null},useProvidedNavigationProperties:{type:"boolean",group:"Misc",defaultValue:false},navigationProperties:{type:"string",group:"Misc",defaultValue:""}},associations:{smartVariant:{type:"sap.ui.comp.smartvariants.SmartVariantManagement",multiple:false}},aggregations:{controlConfiguration:{type:"sap.ui.comp.smartfilterbar.ControlConfiguration",multiple:true,singularName:"controlConfiguration"},groupConfiguration:{type:"sap.ui.comp.smartfilterbar.GroupConfiguration",multiple:true,singularName:"groupConfiguration"}},events:{pendingChange:{pendingValue:{type:"boolean"}}}},renderer:function(r,e){F.getMetadata().getRenderer().render(r,e);}});p.LIVE_MODE_INTERVAL=300;p.SELECTION_VARIANT_KEY_PREFIX="#";p.prototype.init=function(){if(!c){c=sap.ui.require("sap/ui/comp/smartfilterbar/FilterProvider");}this._bCreateFilterProviderCalled=false;this._aFilterBarViewMetadata=null;this._bSetFilterDataSuspended=false;this._oStoredFilterData={};F.prototype.init.apply(this);sap.ui.getCore().getMessageManager().registerObject(this,true);};p.prototype._initializeMetadata=function(){if(!this.bIsInitialised){O.handleModelInit(this,this._onMetadataInitialised);}};p.prototype._getFlexRuntimeInfoAPI=function(){return sap.ui.getCore().loadLibrary('sap.ui.fl',{async:true}).then(function(){return new Promise(function(r){sap.ui.require(["sap/ui/fl/apply/api/FlexRuntimeInfoAPI"],function(e){r(e);});});});};p.prototype._waitForChanges=function(){if(this.getIsRunningInValueHelpDialog()){return Promise.resolve();}else{return new Promise(function(r){this._getFlexRuntimeInfoAPI().then(function(e){if(e.isFlexSupported({element:this})){e.waitForChanges({element:this}).then(function(){r();});}else{r();}}.bind(this));}.bind(this));}};p.prototype._onMetadataInitialised=function(){var r,e,E,s;this._bMetaModelLoadAttached=false;if(!this.bIsInitialised&&!this._bCreateFilterProviderCalled){e=this.getModel();r=this.getResourceUri();E=this.getEntityType();s=this.getEntitySet();if((e||r)&&(E||s)){this._bCreateFilterProviderCalled=true;this._waitForChanges().then(function(){this._createFilterProvider(e,r,E,s).then(function(i){if(!i){return;}if(this.bIsDestroyed){i.destroy();return;}this._oFilterProvider=i;this._aFilterBarViewMetadata=i.getFilterBarViewMetadata();if(this._aFilterBarViewMetadata){this._attachAdditionalConfigurationChanged();this.bIsInitialised=true;this.setModel(i.oModel,i.sFilterModelName);this.registerGetFiltersWithValues(this.getFiltersWithValues.bind(this));this.registerFetchData(function(v){return this.getFilterDataAsStringForVariant(true,v);}.bind(this));this.registerApplyData(function(j,v){this.setFilterDataAsStringFromVariant(j,true,v);}.bind(this));this._initializeVariantManagement();}i.attachPendingChange(function(j){this.firePendingChange({pendingValue:j.getParameter("pending")});}.bind(this));}.bind(this));}.bind(this));}}};p.prototype.getModelData=function(){return this._oFilterProvider?this._oFilterProvider.getModel().getData():null;};p.prototype.getFilterContextUrl=function(){return this._oFilterProvider?this._oFilterProvider.getFilterContextUrl():null;};p.prototype.getParameterContextUrl=function(){return this._oFilterProvider?this._oFilterProvider.getParameterContextUrl():null;};p.prototype.getFilterBarViewMetadata=function(){return this._aFilterBarViewMetadata;};p.prototype.getAnalyticalParameters=function(){return this._oFilterProvider?this._oFilterProvider.getAnalyticParameters():[];};p.prototype.getSelectionVariants=function(){var s=null;if(this._oFilterProvider){s=this._oFilterProvider.getSelectionVariants();if(Object.keys(s).length<1){s=null;}}return s;};p.prototype._createFilterProvider=function(e,r,E,s){return c._createFilterProvider({basicSearchFieldName:this.getBasicSearchFieldName(),enableBasicSearch:this.getEnableBasicSearch(),entityType:E,entitySet:s,serviceUrl:r,isRunningInValueHelpDialog:this.getIsRunningInValueHelpDialog(),model:e,additionalConfiguration:this.getAdditionalConfiguration(),defaultDropDownDisplayBehaviour:this.data("defaultDropDownDisplayBehaviour"),defaultTokenDisplayBehaviour:this.data("defaultTokenDisplayBehaviour"),dateFormatSettings:this.data("dateFormatSettings"),useContainsAsDefaultFilter:this.data("useContainsAsDefaultFilter"),smartFilter:this,considerAnalyticalParameters:this.getConsiderAnalyticalParameters(),useDateRangeType:this.getUseDateRangeType(),considerSelectionVariants:this.getConsiderSelectionVariants(),considerNavigations:this.getUseProvidedNavigationProperties()?this._createArrayFromString(this.getNavigationProperties()):null,suppressValueListsAssociation:this.getSuppressValueListsAssociation()});};p.prototype._createArrayFromString=function(s){return!s?[]:s.split(",").filter(function(e){return e!==""?e.trim():false;});};p.prototype._attachAdditionalConfigurationChanged=function(){var e,j,i,r;j=this.getGroupConfiguration();r=j.length;for(i=0;i<r;i++){j[i].attachChange(this._handleGroupConfigurationChanged.bind(this));}e=this.getControlConfiguration();r=e.length;for(i=0;i<r;i++){e[i].attachChange(this._handleControlConfigurationChanged.bind(this));}};p.prototype._handleControlConfigurationChanged=function(e){var s,i,j,K,v;s=e.getParameter("propertyName");i=e.oSource;if(!i){return;}K=i.getKey();j=this._getFilterItemByName(K);if(!j){this._handleControlConfigurationChangedForDelayedFilterItems(K,i,s);return;}if(s==="visible"){v=i.getVisible();j.setVisible(v);}else if(s==="label"){v=i.getLabel();j.setLabel(v);}else if(s==="visibleInAdvancedArea"){v=i.getVisibleInAdvancedArea();if(j.setVisibleInAdvancedArea){j.setVisibleInAdvancedArea(v);}}};p.prototype._handleControlConfigurationChangedForDelayedFilterItems=function(K,e,s){var v,i;if(this._aFilterBarViewMetadata){this._aFilterBarViewMetadata.some(function(j){j.fields.some(function(I){if(I.fieldName===K){i=I;}return!!i;});return!!i;});}if(i){if(s==="visible"){v=e.getVisible();i.isVisible=v;}else if(s==="label"){v=e.getLabel();i.label=v;}else if(s==="visibleInAdvancedArea"){v=e.getVisibleInAdvancedArea();i.visibleInAdvancedArea=v;}}};p.prototype._handleGroupConfigurationChanged=function(e){var s,i;s=e.getParameter("propertyName");i=e.oSource;if(s==="label"){this._handleGroupConfigurationLabelChanged(i);}};p.prototype._handleGroupConfigurationLabelChanged=function(e){var i,K,s;if(!e){return;}s=e.getLabel();K=e.getKey();i=this._getFilterGroupItemByGroupName(K);if(i){i.setGroupTitle(s);}else{this._handleGroupConfigurationLabelChangedForDelayedFilterItems(K,s);}};p.prototype._handleGroupConfigurationLabelChangedForDelayedFilterItems=function(K,s){var e=null;if(this._aFilterBarViewMetadata){this._aFilterBarViewMetadata.some(function(i){if(i.groupName===K){e=i;}return!!e;});}if(e){e.groupLabel=s;}};p.prototype._getFilterItemByName=function(N){return this.determineFilterItemByName(N);};p.prototype._getFilterGroupItemByGroupName=function(N){return this.determineFilterItemByName(N);};p.prototype.getAdditionalConfiguration=function(){return new A(this.getControlConfiguration(),this.getGroupConfiguration());};p.prototype.setEntityType=function(e){this.setProperty("entityType",e);this._initializeMetadata();return this;};p.prototype.setEntitySet=function(e){this.setProperty("entitySet",e);this._initializeMetadata();return this;};p.prototype.setResourceUri=function(r){this.setProperty("resourceUri",r);this._initializeMetadata();return this;};p.prototype.propagateProperties=function(){F.prototype.propagateProperties.apply(this,arguments);this._initializeMetadata();};p.prototype._getFilterInformation=function(){var H=this.data("hiddenFields"),e,i,j,r=0,s=0,t,u=[],v;if(this._aFilterBarViewMetadata){r=this._aFilterBarViewMetadata.length;for(i=0;i<r;i++){e=this._aFilterBarViewMetadata[i];t=e.fields;s=t.length;for(j=0;j<s;j++){v=t[j];if(Array.isArray(H)&&H.indexOf(v.name)!==-1){continue;}else if(v.name===c.BASIC_SEARCH_FIELD_ID){this.setBasicSearch(v.control);this._attachToBasicSearch(v.control);continue;}else if(e.groupName===c.BASIC_FILTER_AREA_ID){this._createFieldInAdvancedArea({groupName:F.INTERNAL_GROUP,groupLabel:""},v);}else{this._createFieldInAdvancedArea(e,v);}u.push(v);}}var w=this.getAnalyticalParameters();r=w.length;for(i=0;i<r;i++){v=w[i];this._createAnalyticParameter(v);u.push(v);}}return u;};p.prototype._validateState=function(){var e,i,j,I=false;e=this.getAllFilterItems(true);if(Array.isArray(e)){i=e.length;while(i--){j=this.determineControlByFilterItem(e[i],true);if(j){if(j.__bValidatingToken){this.bIsSearchPending=true;I=true;break;}else if(j.getValueState&&j.getValueState()===n.Error&&!j.data("__mandatoryEmpty")){I=true;break;}}}}if(this._oFilterProvider){return!I&&!this._oFilterProvider._validateConditionTypeFields();}else{return!I;}};p.prototype._isDateRangeTypeFilter=function(s){return!!(this._oFilterProvider&&this._oFilterProvider._mConditionTypeFields[s]);};p.prototype._specialControls=function(e,s){return!!(e.setValue&&(this._isDateRangeTypeFilter(s)||e.isA("sap.m.DatePicker")));};p.prototype._clearErroneusControlValues=function(){var e,i,j,v;e=this.getAllFilterItems(true);if(e){i=e.length;while(i--){j=this.determineControlByFilterItem(e[i],true);if(j){if(j.getValueState&&j.getValueState()===n.Error){v=j.getBinding("value");if(v&&!this._specialControls(j,e[i].getName())){v.checkUpdate(true);}else if(j.setValue){j.setValue("");j.setValueState(n.None);}}}}}};p.prototype._attachToBasicSearch=function(B){if(B){B.attachSearch(function(e){if(e&&e.getParameter("clearButtonPressed")){return;}if(!this.isDialogOpen()){this.search();}}.bind(this));B.attachChange(this._onChange.bind(this));}};p.prototype._onLiveChange=function(e){var i=e.getSource();if(i.data("__validationError")&&!i.getValue()){i.data("__validationError",null);i.setValueState(n.None);delete i.__sValidationText;}};p.prototype._onChange=function(e){var i=e.getSource();if(i.data("__mandatoryEmpty")){i.data("__mandatoryEmpty",null);i.setValueState(n.None);}if(i.data("__validationError")&&!i.getValue()){i.data("__validationError",null);i.setValueState(n.None);}if(i.isA("sap.m.ComboBox")&&i.getValue()){this._filterSetInErrorState(i);if(!i.getSelectedItem()){i.data("__validationError",true);i.setValueState(n.Error);return;}if(i.data("__validationError")){i.data("__validationError",null);i.setValueState(n.None);}}if(this._oFilterProvider._bUpdatingFilterData||this._oFilterProvider._bCreatingInitialModel){return;}if(!i||(i&&!i.__bValidatingToken)){this.fireFilterChange(e);this._oFilterProvider._updateConditionTypeFields(e.getParameter("filterChangeReason"));}else{this._filterSetInErrorState(i);}if(this.isLiveMode()){if(e.getSource().isA("sap.m.MultiComboBox")||e.getSource().isA("sap.m.ComboBox")){this.triggerSearch();}else{this.search();}}};p.prototype._handleChange=function(e){if(e){if(e.attachChange){e.attachChange(this._onChange.bind(this));}if(e.attachLiveChange){e.attachLiveChange(this._onLiveChange.bind(this));}}};p.prototype._handleSelectionChange=function(e){if(e){if(e.attachSelectionChange){e.attachSelectionChange(this._onChange.bind(this));}}};p.prototype._handleEnter=function(i){if(this.isLiveMode()){return;}i.attachBrowserEvent("keydown",function(e){if(e.which===13){i.__bSuggestInProgress=(i._oSuggestionPopup&&i._oSuggestionPopup.isOpen());}});i.attachBrowserEvent("keyup",function(e){if(e.which===13&&!i.__bSuggestInProgress&&(i.isA("sap.m.InputBase")||i.isA("sap.m.Select"))){this.search();}}.bind(this));};p.prototype._createFilterFieldControl=function(e){if(e.conditionType){e.control=e.conditionType.initializeFilterItem();}else if(!e.control&&e.fCreateControl){e.fCreateControl(e);delete e.fCreateControl;}this._handleEnter(e.control);this._handleChange(e.control);if(e.isCustomFilterField&&e.control.isA("sap.m.MultiComboBox")){this._handleSelectionChange(e.control);}};p.prototype._createAnalyticParameter=function(e){e.factory=function(){this._createFilterFieldControl(e);if(!e.control){return;}var i=new a({controlTooltip:e.quickInfo,name:e.fieldName,mandatory:e.isMandatory,visible:e.isVisible,control:e.control,hiddenFilter:false});this._setLabel(i,e.label);this._addParameter(i);}.bind(this);e.groupName=F.INTERNAL_GROUP;return e;};p.prototype._createFieldInAdvancedArea=function(e,i){i.factory=function(){this._createFilterFieldControl(i);var j=new a({controlTooltip:i.quickInfo,name:i.fieldName,groupName:e.groupName,groupTitle:e.groupLabel,entitySetName:i.groupEntitySet,entityTypeName:i.groupEntityType,mandatory:i.isMandatory,visible:i.isVisible,visibleInAdvancedArea:i.visibleInAdvancedArea||(e.groupName===F.INTERNAL_GROUP),control:i.control,hiddenFilter:i.hiddenFilter});if(i.isCustomFilterField){j.data("isCustomField",true);this._attachCustomControlCustomDataChange(j.getControl().getCustomData());}if(i.control&&i.control.getTooltip&&i.control.getTooltip()){j.setControlTooltip(i.control.getTooltip());}if(i.quickInfo){j.setLabelTooltip(i.quickInfo);}this._setLabel(j,i.label);this.addFilterGroupItem(j);}.bind(this);i.groupName=e.groupName;i.groupTitle=e.groupLabel;return i;};p.prototype._setLabel=function(e,s){if(s.match(/{@i18n>.+}/gi)){e.bindProperty("label",s.substring(1,s.length-1));}else{e.setLabel(s);}};p.prototype._logAccessWhenNotInitialized=function(s){if(!this.bIsInitialised){L.error("SmartFilterBar."+s+": called before the SmartFilterBar is initialized");}};p.prototype.ensureLoadedValueHelp=function(s){this._logAccessWhenNotInitialized("ensureLoadedValueHelp");if(this._oFilterProvider){this._oFilterProvider.getAssociatedValueHelpProviders().some(function(v){if(v.sFieldName===s){this._ensureLoadedValueHelpList(v);return true;}}.bind(this));}};p.prototype.ensureLoadedValueList=function(s){if(this._oFilterProvider){this._oFilterProvider.getAssociatedValueListProviders().some(function(v){if(v.sFieldName===s){this._ensureLoadedValueHelpList(v);return true;}}.bind(this));}};p.prototype._ensureLoadedValueHelpList=function(B){if(!B._bValueListRequested){B.loadAnnotation();}};p.prototype._getValueListHelpProvider=function(s){var v=null;if(this._oFilterProvider){this._oFilterProvider.getAssociatedValueListProviders().some(function(e){if(e.sFieldName===s){v=e;}return v!=null;});if(!v){this._oFilterProvider.getAssociatedValueHelpProviders().some(function(e){if(e.sFieldName===s){v=e;}return v!=null;});}}return v;};p.prototype.getDescriptionForKeys=function(e){var i=[];if(e){e.forEach(function(I){var B=this._getValueListHelpProvider(I.filterName);if(B){if(!B._bValueListRequested){B.loadAnnotation();}I.provider=B;i.push(I);}}.bind(this));if(i&&i.length>0){i.forEach(function(I){if(I.provider){I.provider.readData(I.keys);}});}}};p.prototype.ensureLoadedValueHelpList=function(s){this.ensureLoadedValueHelp(s);this.ensureLoadedValueList(s);};p.prototype.getFilters=function(e){this._logAccessWhenNotInitialized("getFilters");if(!e||!e.length){if(this.getIsRunningInValueHelpDialog()){e=this._getAllFieldNames();}else{e=this._getVisibleFieldNames(true);}}return this._oFilterProvider?this._oFilterProvider.getFilters(e):[];};p.prototype.getParameters=function(){this._logAccessWhenNotInitialized("getParameters");return this._oFilterProvider?this._oFilterProvider.getParameters():{};};p.prototype.getAnalyticBindingPath=function(){var B="";this._logAccessWhenNotInitialized("getAnalyticBindingPath");if(this._oFilterProvider){B=this._oFilterProvider.getAnalyticBindingPath();}return B;};p.prototype.getParameterBindingPath=function(){return this.getAnalyticBindingPath();};p.prototype.getControlByKey=function(K){this._logAccessWhenNotInitialized("getControlByKey");return this.determineControlByName(K);};p.prototype._getAllFieldNames=function(){var e,j=[],i,r,I;if(this._oFilterProvider&&this._oFilterProvider._oMetadataAnalyser){e=this._oFilterProvider._oMetadataAnalyser.getFieldsByEntitySetName(this.getEntitySet());}if(e){r=e.length;for(i=0;i<r;i++){I=e[i];if(I){j.push(I.name);}}}return j;};p.prototype._getAllFilterAndParameterNames=function(i){var e=[],v=this.getAllFilterItems(false),j=v.length,I;while(j--){I=v[j];if(I){if(i&&I._isParameter()){continue;}e.push(I.getName());}}return e;};p.prototype._getVisibleFieldNames=function(i){var e=[],v=this.getAllFilterItems(true),j=v.length,I;while(j--){I=v[j];if(I){if(i&&I._isParameter()){continue;}e.push(I.getName());}}return e;};p.prototype._checkHasValueData=function(e){if(!e||e==="false"){return false;}if(typeof e==="boolean"){return e;}else if(typeof e==="string"&&e.toLowerCase()==="true"){return true;}return false;};p.prototype._checkForValues=function(e,i,j){var v=null,r;if(e&&i&&j){if(!i.data("isCustomField")){v=e[i.getName()];if(!v&&j.getSelectedItem&&j.getSelectedItem()){r=c._getFieldMetadata(this._aFilterBarViewMetadata,i.getName());if(r&&(r.type==="Edm.Boolean")){if(j.getSelectedItem().getKey()===""){return false;}}return true;}if(!v&&j.getSelectedKey&&j.getSelectedKey()){return true;}if(v===undefined){return false;}}else{var s=j.data("hasValue");if((s!==undefined)&&(s!=null)){return this._checkHasValueData(s);}else{if(j.getValue){if(j.getValue()){return true;}}if(j.getSelectedItem&&j.getSelectedItem()){return true;}if(j.getSelectedKey&&j.getSelectedKey()){return true;}if(j.getSelectedKeys&&j.getSelectedKeys().length>0){return true;}if(j.getTokens&&j.getTokens().length>0){return true;}}}}return!!v;};p.prototype.getFiltersWithValues=function(){this._logAccessWhenNotInitialized("getFiltersWithValues");return this._getFiltersWithAssignedValues(true);};p.prototype.getAllFiltersWithValues=function(){return this._getFiltersWithAssignedValues(false);};p.prototype._getFiltersWithAssignedValues=function(e){var i=[];var j=this.getAllFilterItems(e),r,s,t=0,u;if(e){r=this.getFilterData();}else if(this._oFilterProvider){r=this._oFilterProvider.getFilledFilterData(this._getAllFilterAndParameterNames());}if(j&&r){t=j.length;while(t--){s=j[t];u=this.determineControlByFilterItem(s,true);if(this._checkForValues(r,s,u)){i.push(s);}}}return i.reverse();};p.prototype.getFilterDataAsStringForVariant=function(e,v){var j={},i=this._oFilterProvider._aFilterBarDateTimeFieldNames;if(i.length>0){j=m(j,this.getFilterData(e));i.forEach(function(s){var r,t,u=c._getFieldMetadata(this._aFilterBarViewMetadata,s);if(u&&(u.type==="Edm.DateTimeOffset")){t=j[s];if(t&&t.low){if(u.filterRestriction===o.interval){r=d.parseDateTimeOffsetInterval(t.low);if(r&&(r.length===2)){t.low=u.ui5Type.parseValue(r[0],"string");t.high=u.ui5Type.parseValue(r[1],"string");}}}}}.bind(this));if(v==="V3"){this._oFilterProvider._aFilterBarDateFieldNames.concat(this._oFilterProvider._aFilterBarTimeFieldNames).forEach(function(s){var r,t=c._getFieldMetadata(this._aFilterBarViewMetadata,s);if(!t){t=this.getParameterMetadata(s);}if(t&&(t.filterType==="date")||(t.filterType==="time")){r=j[s];if(r){if((t.filterRestriction===o.multiple)||(t.filterRestriction===o.auto)){this._processDateRanges(r.ranges);}else if(t.filterRestriction===o.single){j[s]=this._dateConvert(r);}else if(t.filterRestriction===o.interval){if(r.ranges){this._processDateRanges(r.ranges);}else{if(r.low){r.low=this._dateConvert(r.low);}if(r.high){r.high=this._dateConvert(r.high);}}}}}}.bind(this));}return JSON.stringify(j);}else{return this.getFilterDataAsString(e);}};p.prototype._dateConvert=function(v){if(this.isInUTCMode()){if(typeof v==="string"){v=new Date(v);}v=D.localToUtc(v).toJSON();}if(v.indexOf('Z')===(v.length-1)){v=v.substr(0,v.length-1);}return v;};p.prototype._processDateRanges=function(r){if(!Array.isArray(r)){return;}r.forEach(function(R){R.tokenText=null;if(R.value1){R.value1=this._dateConvert(R.value1);}if(R.value2){R.value2=this._dateConvert(R.value2);}}.bind(this));};p.prototype.getFilterData=function(e){if(this._bSetFilterDataSuspended){return Object.assign({},this._oStoredFilterData);}var i=this._oFilterProvider;this._logAccessWhenNotInitialized("getFilterData");if(!i){return null;}return e?i.getFilterData():i.getFilledFilterData(this._getVisibleFieldNames());};p.prototype.getFilterDataAsString=function(e){var i=this._oFilterProvider;this._logAccessWhenNotInitialized("getFilterDataAsString");if(!i){return null;}return e?i.getFilterDataAsString():i.getFilledFilterDataAsString(this._getVisibleFieldNames());};p.prototype.getParameterMetadata=function(N){var e=null,i=this.getAnalyticalParameters();if(N.indexOf(l.ANALYTICAL_PARAMETER_PREFIX)===0){N=N.substring(l.ANALYTICAL_PARAMETER_PREFIX.length);}if(Array.isArray(i)){i.some(function(j){if(j.name===N){e=j;}return e!==null;});}return e;};p.prototype.setFilterDataAsStringFromVariant=function(j,r,v){var J,e=this._oFilterProvider._aFilterBarDateTimeFieldNames;if(j){if(e.length>0){J=JSON.parse(j);e.forEach(function(s){var t,u=c._getFieldMetadata(this._aFilterBarViewMetadata,s);if(u&&(u.type==="Edm.DateTimeOffset")){t=J[s];if(t&&(u.filterRestriction===o.multiple||u.filterRestriction===o.auto)){if(t.ranges){for(var i=0;i<t.ranges.length;i++){delete t.ranges[i].tokenText;}}}}}.bind(this));if(v==="V3"){this._oFilterProvider._aFilterBarDateFieldNames.concat(this._oFilterProvider._aFilterBarTimeFieldNames).forEach(function(s){var t,u=c._getFieldMetadata(this._aFilterBarViewMetadata,s);if(!u){u=this.getParameterMetadata(s);}if(u&&(u.filterType==="date")||(u.filterType==="time")){t=J[s];if(t){if(t.ranges){for(var i=0;i<t.ranges.length;i++){delete t.ranges[i].tokenText;}}}}}.bind(this));}this.setFilterData(J,r);}else{this.setFilterDataAsString(j,r);}}};p.prototype.setFilterData=function(j,r){if(this._bSetFilterDataSuspended){if(r){this._oStoredFilterData=j;}else{this._oStoredFilterData=Object.assign({},this._oStoredFilterData,j);}return;}this._setFilterData(j,r);};p.prototype.suspendSetFilterData=function(){this._bSetFilterDataSuspended=true;};p.prototype.resumeSetFilterData=function(){if(this._bSetFilterDataSuspended){this._bSetFilterDataSuspended=false;this.setFilterData(this._oStoredFilterData,true);this._oStoredFilterData={};}};p.prototype._setFilterData=function(j,r){this._logAccessWhenNotInitialized("setFilterData");if(this._oFilterProvider){this._oFilterProvider.setFilterData(j,r);}if(j&&(Object.keys(j).length===1)&&j._CUSTOM){return;}this.fireFilterChange({afterFilterDataUpdate:true});};p.prototype.setFilterDataAsString=function(j,r){if(j){this.setFilterData(JSON.parse(j),r);}};p.prototype.fireClear=function(){this._clearFilterFields();this.fireEvent("clear",arguments);};p.prototype._clearFilterFields=function(){if(this._oFilterProvider){this._oFilterProvider.clear();this._clearErroneusControlValues();}this.fireFilterChange({afterFilterDataUpdate:true});};p.prototype.fireReset=function(){this._resetFilterFields();this.fireEvent("reset",arguments);};p.prototype._resetFilterFields=function(){if(this._oFilterProvider){this._oFilterProvider.reset();this._clearErroneusControlValues();}this.fireFilterChange({afterFilterDataUpdate:true});};p.prototype.triggerSearch=function(i){if(this.getSuppressSelection()){return;}this._clearDelayedSearch();this._iDelayedSearchId=setTimeout(this["_search"].bind(this),i||0);};p.prototype.search=function(s){if(this.getSuppressSelection()){return undefined;}this._logAccessWhenNotInitialized("search");if(s&&!this.isLiveMode()){return this._search();}this.triggerSearch(0);return true;};p.prototype._search=function(){var e=true,i=false,E,I,H;I=this.verifySearchAllowed();if(I.hasOwnProperty("pending")){if(this._iDelayedSearchId&&!this.getSuppressSelection()){this.triggerSearch();}return undefined;}else if(I.hasOwnProperty("error")){e=false;i=true;}else if(I.hasOwnProperty("mandatory")){e=false;}if(this.isPending()&&!this._bIsPendingChangeAttached){H=function(j){if(j.getParameter("pendingValue")===false){this.detachPendingChange(H);this._bIsPendingChangeAttached=false;this.triggerSearch();}}.bind(this);this._bIsPendingChangeAttached=true;this.attachPendingChange(H);return undefined;}this._clearDelayedSearch();if(e){if(this._isTablet()&&this.getUseToolbar()&&!this.getAdvancedMode()){this.setFilterBarExpanded(false);}this.fireSearch([{selectionSet:this._retrieveCurrentSelectionSet(false,true)}]);}else{if(!this._oResourceBundle){this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");}if(!i){if(!this._sMandatoryErrorMessage){this._sMandatoryErrorMessage=this._oResourceBundle.getText("EMPTY_MANDATORY_MESSAGE");}E=this._sMandatoryErrorMessage;}else{if(!this._sValidationErrorMessage){this._sValidationErrorMessage=this._oResourceBundle.getText("VALIDATION_ERROR_MESSAGE");}E=this._sValidationErrorMessage;}if(this.getShowMessages()&&!this.getLiveMode()){try{M.error(E,{styleClass:(this.$()&&this.$().closest(".sapUiSizeCompact").length)?"sapUiSizeCompact":"",onClose:this._setFocusOnFirstErroneousField.bind(this)});}catch(x){return undefined;}}else{this._setFocusOnFirstErroneousField();L.warning("search was not triggered. "+E);}if(this._bExpandAdvancedFilterArea&&this.rerenderFilters){this.rerenderFilters(true);}}return e;};p.prototype.validateMandatoryFields=function(){this._logAccessWhenNotInitialized("validateMandatoryFields");return this._validateMandatoryFields();};p.prototype.verifySearchAllowed=function(){this._logAccessWhenNotInitialized("verifySearchAllowed");this.bIsSearchPending=false;if(this._validateState()){if(this.validateMandatoryFields()){return{};}return{mandatory:true};}if(this.bIsSearchPending){return{pending:true};}return{error:true};};p.prototype._setFocusOnFirstErroneousField=function(){var e,j,r,i;e=this.getAllFilterItems(true);if(Array.isArray(e)){j=e.length;for(i=0;i<j;i++){r=this.determineControlByFilterItem(e[i],true);if(r&&r.getValueState&&r.getValueState()===n.Error){setTimeout(r["focus"].bind(r),0);break;}}}};p.prototype.setLiveMode=function(e){if(!this._isPhone()){if(e){this.hideGoButton();}else{this.restoreGoButton();}}if(this._oSmartVariantManagement){if(e){if(this._bShowShareState===undefined){this._bShowShareState=this._oSmartVariantManagement.getShowExecuteOnSelection();}this._oSmartVariantManagement.setShowExecuteOnSelection(false);}else if(this._bShowShareState!==undefined){this._oSmartVariantManagement.setShowExecuteOnSelection(this._bShowShareState);}}return this.setProperty("liveMode",e);};p.prototype.isLiveMode=function(){return this._isPhone()?false:this.getLiveMode();};p.prototype._clearDelayedSearch=function(){if(this._iDelayedSearchId){clearTimeout(this._iDelayedSearchId);this._iDelayedSearchId=null;}};p.prototype.isPending=function(){return!this._oFilterProvider?false:this._oFilterProvider.isPending();};p.prototype._validateMandatoryFields=function(){var e=true,i=this.determineMandatoryFilterItems(),j,r=this.getFilterData(),s=0,t;this._bExpandAdvancedFilterArea=false;if(i&&r){s=i.length;while(s--){j=i[s];t=this.determineControlByFilterItem(j,true);if(t&&t.setValueState){if(this._checkForValues(r,j,t)){if(t.data("__mandatoryEmpty")){t.data("__mandatoryEmpty",null);t.setValueState(n.None);}}else{e=false;t.setValueState(n.Error);t.data("__mandatoryEmpty",true);if(j.getGroupName){this._bExpandAdvancedFilterArea=true;}}}}}return e;};p.prototype._setSmartVariant=function(s){var e;if(!s){return;}e=sap.ui.getCore().byId(s);if(e){if(e.isA("sap.ui.comp.smartvariants.SmartVariantManagement")){if(this._oVariantManagement&&!this._oVariantManagement.isPageVariant()){this._replaceVariantManagement(e);this._oSmartVariantManagement=e;}}else{L.error("Control with the id="+s+" not of expected type");}}else{L.error("Control with the id="+s+" not found");}};p.prototype.setSmartVariant=function(s){if(this.getAdvancedMode()){L.error("not supported for the advanced mode");return this;}this.setAssociation("smartVariant",s);this._setSmartVariant(s);return this;};p.prototype.getSmartVariant=function(){if(this.getAdvancedMode()){L.error("not supported for the advanced mode");return null;}var s=this.getAssociation("smartVariant");if(s){return sap.ui.getCore().byId(s);}return this._oSmartVariantManagement;};p.prototype._createVariantManagement=function(){if(this.getAdvancedMode()){return F.prototype._createVariantManagement.apply(this);}this._setSmartVariant(this.getSmartVariant());if(!this._oSmartVariantManagement){this._oSmartVariantManagement=new S(this.getId()+"-variant",{showExecuteOnSelection:true,showShare:true});}return this._oSmartVariantManagement;};p.prototype._initializeVariantManagement=function(){if(!this.getIsRunningInValueHelpDialog()&&this._oSmartVariantManagement&&this.getPersistencyKey()){var e=new P({type:"filterBar",keyName:"persistencyKey",dataSource:this.getEntitySet()||this.getEntityType()});e.setControl(this);this._oSmartVariantManagement.addPersonalizableControl(e);if(this._checkHasValueData(this.data("executeStandardVariantOnSelect"))){this._oSmartVariantManagement._executeOnSelectForStandardVariantByXML(true);}F.prototype._initializeVariantManagement.apply(this,arguments);}else{this.fireInitialise();this.fireInitialized();}};p.prototype.fireInitialized=function(){if(!this.getIsRunningInValueHelpDialog()&&this.getPersistencyKey()&&this.getConsiderSelectionVariants()&&this._oSmartVariantManagement&&this._oSmartVariantManagement.getEnabled()){try{if(!this._oSmartVariantManagement.isPageVariant()){this._prepareSelectionVariants();}}catch(e){}}F.prototype.fireInitialized.apply(this,arguments);};p.prototype._prepareSelectionVariants=function(){var s,e,K=p.SELECTION_VARIANT_KEY_PREFIX,N,v=[],i=this._oSmartVariantManagement;s=this.getSelectionVariants();if(s){i.registerSelectionVariantHandler({callback:this.getSelectionVariant,handler:this},K);s.forEach(function(j){var r=K+j.qualifier;if(j.qualifier){i.insertVariantItem(new V({key:r,text:j.annotation.Text.String,global:true,executeOnSelection:false,lifecycleTransportId:"",lifecyclePackage:"",namespace:"",readOnly:true,labelReadOnly:true,author:""}),0);v.push(r);}else{N=this._defaultSelectionVariantHandling(j);}}.bind(this));if(!i._getDefaultVariantKey()){if(this.getDefaultSelectionVariantName()){e=K+this.getDefaultSelectionVariantName();i.setInitialSelectionKey(e);i.fireSelect({key:e});}else if(N){i.fireSelect({key:i.STANDARDVARIANTKEY});}}i.applyDefaultFavorites(v,true);}};p.prototype._defaultSelectionVariantHandling=function(s){var v,e=this._oSmartVariantManagement,i,j;if(!e||e._sAppStandardVariantKey||!(s&&s.annotation)){return false;}v=this.convertSelectionVariantToInternalVariant(s.annotation);if(!v){return false;}if(!e.isPageVariant()){v.version="V1";j=JSON.parse(v.filterBarVariant);if(e._oStandardVariant){i=JSON.parse(e._oStandardVariant.filterBarVariant);if(i._CUSTOM){j._CUSTOM=i._CUSTOM;v.filterBarVariant=JSON.stringify(j);}}e._oStandardVariant=v;return true;}};p.prototype._adaptFilterVisibilityProperties=function(e){var i,j=[];if(this._oSmartVariantManagement&&this._oSmartVariantManagement._oStandardVariant&&this._oSmartVariantManagement._oStandardVariant.filterbar){m(j,this._oSmartVariantManagement._oStandardVariant.filterbar);}Object.keys(e).forEach(function(E){i=false;j.some(function(r){if(r.name===E){i=true;r.partOfCurrentVariant=true;}return i;});if(!i){j.push({group:this._determineGroupNameByName(E),name:E,partOfCurrentVariant:true,visibleInFilterBar:false,visible:true});}}.bind(this));return j;};p.prototype.getSelectionVariant=function(K){var v=null,s=null,e=K.substring(p.SELECTION_VARIANT_KEY_PREFIX.length);this.getSelectionVariants().some(function(i){if(i.qualifier===e){s=i;return true;}return false;});if(s){if(s.variantContent){v=s.variantContent;}else{v=this.convertSelectionVariantToInternalVariant(s.annotation);s.variantContent=v;}}return v;};p.prototype.convertSelectionVariantToInternalVariant=function(s){var e=JSON.parse(JSON.stringify(s)),v,i,j,r=e.SelectOptions,t=e.Parameters,u;if(r||t){j=new h(null,"/");}if(r){r.forEach(function(w){w.PropertyName=w.PropertyName.PropertyPath;w.Ranges.forEach(function(x){x.Sign=x.Sign.EnumMember.split("/")[1];x.Option=x.Option.EnumMember.split("/")[1];x.Low=x.Low&&g.format(j,x.Low)||null;x.High=x.High&&g.format(j,x.High)||null;});});}if(t){t.forEach(function(w){w.PropertyName=w.PropertyName.PropertyPath.split("/")[1]||w.PropertyName.PropertyPath;w.PropertyValue=g.format(j,w.PropertyValue)||null;});}u=new k();v=u.convert(JSON.stringify(e),this,true);i=JSON.parse(v.payload);if(this._oSmartVariantManagement.isPageVariant()){v[this.getPersistencyKey()]={"version":"V2","filterbar":this._adaptFilterVisibilityProperties(i),"filterBarVariant":JSON.stringify(i)};}else{v={"version":"V2","filterbar":this._adaptFilterVisibilityProperties(i),"filterBarVariant":JSON.stringify(i)};}return v;};p.prototype.getBasicSearchControl=function(){return sap.ui.getCore().byId(this.getBasicSearch());};p.prototype.addFieldToAdvancedArea=function(K){var e;this._logAccessWhenNotInitialized("addFieldToAdvancedArea");e=this._getFilterItemByName(K);if(e&&e.setVisibleInAdvancedArea){e.setVisibleInAdvancedArea(true);}};p.prototype._onCustomFieldCustomDataChange=function(e){var N=e.getParameter("newValue"),v=e.getParameter("oldValue"),s=e.getParameter("name");if(v!==N&&s==="value"){this._updateToolbarText();}};p.prototype._attachCustomControlCustomDataChange=function(e){var j,i;for(i=0;i<e.length;i++){j=e[i];if(j.getKey()==="hasValue"){j.attachEvent("_change",this._onCustomFieldCustomDataChange,this);break;}}};p.prototype.getConditionTypeByKey=function(K){if(this._oFilterProvider._mConditionTypeFields[K]){return this._oFilterProvider._mConditionTypeFields[K].conditionType;}};p.prototype.isInUTCMode=function(){if(this._oFilterProvider&&this._oFilterProvider._oDateFormatSettings){return this._oFilterProvider._oDateFormatSettings.UTC;}return false;};p.prototype.isInitialised=function(){return!!this.bIsInitialised;};p.prototype.associateValueLists=function(){if(this.getSuppressValueListsAssociation()&&this._oFilterProvider){this._oFilterProvider._fireEvent(c.ASSOCIATE_VALUE_LISTS);this._oFilterProvider._bSuppressValueListsAssociation=false;}};p.prototype.getSuppressValueListsAssociation=function(){return false;};p.prototype.setCustomFilterData=function(j){if(this._oFilterProvider&&this._oFilterProvider.getModel()){this._oFilterProvider.getModel().setProperty("/"+c.CUSTOM_FIELDS_MODEL_PROPERTY,j);}};p.prototype.getCustomFilterData=function(){if(this._oFilterProvider&&this._oFilterProvider.getModel()){return this._oFilterProvider.getModel().getProperty("/"+c.CUSTOM_FIELDS_MODEL_PROPERTY);}};p.prototype.refreshFiltersCount=function(){return Promise.all(this._oFilterProvider._getCurrentValidationPromises()).then(function(){return this._updateToolbarText();}.bind(this));};p.prototype.destroy=function(){this._clearDelayedSearch();if(this._oFilterProvider&&this._oFilterProvider.destroy){this._oFilterProvider.destroy();}this._oFilterProvider=null;if(this._oSmartVariantManagement&&this.getConsiderSelectionVariants()){this._oSmartVariantManagement.unregisterSelectionVariantHandler(this);}F.prototype.destroy.apply(this,arguments);sap.ui.getCore().getMessageManager().unregisterObject(this);this._aFilterBarViewMetadata=null;this._bExpandAdvancedFilterArea=null;this._oResourceBundle=null;this._sMandatoryErrorMessage=null;this._sValidationErrorMessage=null;this._oSmartVariantManagement=null;};return p;});
