sap.ui.define(["sap/ui/comp/odata/MetadataAnalyser","sap/ui/base/Object","sap/ui/model/Context","sap/suite/ui/generic/template/AnalyticalListPage/util/OperationCode","sap/suite/ui/generic/template/AnalyticalListPage/util/V4Terms","sap/ui/core/format/DateFormat","sap/ui/model/odata/AnnotationHelper","sap/ui/events/KeyCodes"],function(M,B,C,O,V,D,c,K){"use strict";var F=B.extend("sap.suite.ui.generic.template.AnalyticalListPage.util.FilterUtil");F.createTitle=function(d,s){var t;if(!d){return s;}if(s instanceof Date){return d;}if(d.indexOf(':')!==-1){d=d.substring(0,d.indexOf(':'));}if(d.indexOf(s)===-1){t=d+" ("+s+")";}else{t=d;}return t;};F._updateVisualFilterAria=function(i){var f=i.getItems()[2].getItems()[0];var p=f.getParentProperty();var r=f.getModel("i18n").getResourceBundle();var t=r.getText("VIS_FILTER_ITEM_ARIA");if(f.getIsMandatory()){t+=" "+r.getText("VIS_FILTER_MANDATORY_PROPERTY_ARIA",p);}t+=" "+r.getText("VIS_FILTER_DIALOG_NAVIGATE_ARIA")+" "+r.getText("VIS_FILTER_ACCESS_FIELDS_ARIA");i.getItems()[3].setText(t);};F.getAllMandatoryFilters=function(m,e){var o=new M(m);var a=o.getEntityTypeNameFromEntitySetName(e);var b=o.getFieldsByEntityTypeName(a);var f=[];for(var k in b){var d=b[k];if(d.requiredFilterField){f.push(d.name);}}return f;};F.getAllMandatoryFiltersMapping=function(v,I){var f=[],m=[],b=false;for(var i=0;i<v.length;i++){b=true;for(var j=0;j<I.length;j++){if(v[i]===I[j].valueListProperty){f.push(I[j]);b=false;break;}}if(b){m.push(v[i]);}}var a={aMappedFilterList:f,aMappingMissingFilterList:m};return a;};F.checkFilterHasValueFromSelectionVariant=function(s,f){return s.some(function(a){if(a.PropertyName.PropertyPath===f){return true;}});};F.checkFilterHasValueFromSmartFilterBar=function(s,f){return s.some(function(p){if(p.getName()===f){return true;}});};F.checkFilterHasValueFromSelectionVariantOrSmartFilterBar=function(f,s,S,o){var h=S&&F.checkFilterHasValueFromSelectionVariant(S,f);if(!h){h=F.checkFilterHasValueFromSmartFilterBar(o.getFiltersWithValues(),s);}return h;};F.readProperty=function(o,n){var i=0,p=typeof n==='string'?n.split("."):[];while(i<p.length){if(!o){return undefined;}o=o[p[i++]];}return o;};F.executeFunction=function(o,f,a){var i=0,p,P=typeof f==='string'?f.split("."):[];while(i<P.length){if(!o){return undefined;}p=o;o=o[P[i++]];}return typeof o==='function'?o.apply(p,a):undefined;};F.createTitleFromCode=function(f){var v=F.readProperty(f,"value1"),s=F.readProperty(f,"value2"),o=F.readProperty(f,"operation"),r;if(!v||!o||!O[o]){return undefined;}if(s&&o!=="EQ"){r=v+O[o].code+s;}else if(O[o].position==="last"){r=v+O[o].code;}else if(O[o].position==="mid"){r=O[o].code+v+O[o].code;}else{r=O[o].code+v;}if(f.exclude){r="!("+r+")";}return r;};F.formatFiltersLink=function(o){var i=this.getModel("i18n"),r=i.getResourceBundle();return o?r.getText("VISUAL_FILTER_FILTERS_WITH_COUNT",[o]):r.getText("VISUAL_FILTER_FILTERS");};F.getBooleanValue=function(v,d){if(v&&v.Bool){if(v.Bool.toLowerCase()==="true"){return true;}else if(v.Bool.toLowerCase()==="false"){return false;}}return d;};F.getPrimitiveValue=function(v){var a;if(v){if(v.String){a=v.String;}else if(v.Bool){a=F.getBooleanValue(v);}else if(v.EnumMember){a=v.EnumMember.split("/")[1];}else{a=F.getNumberValue(v);}}return a;};F.getNumberValue=function(v){if(v){var s=Object.keys(v)[0];return(v&&s&&["String","Int","Decimal","Double","Single"].indexOf(s)!==-1)?Number(v[s]):undefined;}};F.getPathOrPrimitiveValue=function(i){if(i){return(i.Path)?"{path:'"+i.Path+"'}":F.getPrimitiveValue(i);}else{return"";}};F.isFilterDiff=function(f,a){if(Array.isArray(f)!=Array.isArray(a)){return true;}if(Array.isArray(f)){return this.isFilterListDiff(f,a);}else{return this.isFilterObjDiff(f,a);}};F.isFilterObjDiff=function(f,b){if(!f||!b){return true;}for(var a in f){if(a=="aFilters"){if(this.isFilterListDiff(f.aFilters,b.aFilters)){return true;}}else if(f[a]!=b[a]){return true;}}return false;};F.convertLocalDatetoUTCDate=function(d){var u=new Date(d.valueOf()+d.getTimezoneOffset()*60*1000);return new Date(u.setHours(0,0,0));};F.getDateInMedium=function(d){return(d instanceof Date)?D.getDateInstance({style:"medium"}).format(d):undefined;};F.getDateTimeInMedium=function(d){return(d instanceof Date)?D.getDateTimeInstance({style:"medium"}).format(d):undefined;};F.isDefaultVariantSelected=function(s){var v=s.oSmartFilterbar.getSmartVariant();return(v&&v.getCurrentVariantId()===v.getDefaultVariantKey());};F.isFilterListDiff=function(l,L){if(!l||!L){return true;}if(l.length!=L.length){return true;}for(var i=0;i<l.length;i++){var f=l[i];var a=L[i];if(this.isFilterObjDiff(f,a)){return true;}}return false;};F.getTextArrangement=function(d,i,t){var l,s=d?d:i,a=(d&&i)?d+" ("+i+")":s;if(i!=="__IS_OTHER__"&&i!=="Other"){switch(t){case sap.ui.comp.smartfilterbar.DisplayBehaviour.descriptionAndId:l=a;break;case sap.ui.comp.smartfilterbar.DisplayBehaviour.descriptionOnly:l=d?d:"";break;case sap.ui.comp.smartfilterbar.DisplayBehaviour.idAndDescription:l=(d&&i)?i+" ("+d+")":s;break;case sap.ui.comp.smartfilterbar.DisplayBehaviour.idOnly:l=i?i:"";break;default:l=a;break;}}else{l=d;}return l;};F.getTooltipForValueHelp=function(i,d,r,a,I){var t="";if(I){if(!a){t=r.getText("DP_WITHOUT_SELECTIONS",d);}else{t=r.getText("DP_SINGLE_SELECTED",[d,a]);}return t;}if(!a){t=i?r.getText("VALUE_HELP",d):r.getText("DROPDOWN_WITHOUT_SELECTIONS",d);}else{if(!i){t=r.getText("DROPDOWN_WITH_SELECTIONS",[d,a]);}else{t=(a===1)?r.getText("VH_SINGLE_SELECTED",[d,a]):r.getText("VH_MULTI_SELECTED",[d,a]);}}return t;};F.getPropertyNameDisplay=function(m,e,p,a,s){var r=a?a.getResourceBundle():undefined,o=m.getMetaModel(),E=o.getODataEntityType(o.getODataEntitySet(e).entityType),b=o.getODataProperty(E,p);var l=(b["com.sap.vocabularies.Common.v1.Label"]&&b["com.sap.vocabularies.Common.v1.Label"].String)?b["com.sap.vocabularies.Common.v1.Label"].String:b["sap:label"];var q=(b["com.sap.vocabularies.Common.v1.QuickInfo"]&&b["com.sap.vocabularies.Common.v1.QuickInfo"].String)?b["com.sap.vocabularies.Common.v1.QuickInfo"].String:b["sap:quickinfo"];if(s&&q){return q;}if(l){if(l.match(/{@i18n>.+}/gi)&&r){l=r.getText(l.substring(l.indexOf(">")+1,l.length-1));}return l;}else{return p;}};F.IsNavigationProperty=function(m,e,n){var o=m.getMetaModel(),E=o.getODataEntityType(o.getODataEntitySet(e).entityType);var a=E['navigationProperty'];var s=false;if(n.indexOf("/")!==-1){for(var i=0;i<a.length;i++){if(a[i].name===n.split("/")[0]){s=true;break;}}}return s;};F.getKeysForNavigationEntitySet=function(m,e,n){if(n){var E=m.getODataEntitySet(e),o=m.getODataEntityType(E.entityType),a=m.getODataAssociationEnd(o,n),N=m.getODataEntityType(a.type),b=this.readProperty(N,"key.propertyRef");if(b&&b.length>1){return b||null;}else{return null;}}else{return null;}};F.isPropertyNonFilterable=function(e,p){if(!e||!p){return false;}var f=e[V.FilterRestrictions];var n=f&&f.NonFilterableProperties;if(n){for(var i=0;i<n.length;i++){if(n[i].PropertyPath===p){return true;}}}return false;};F.getVisualFilterSelectFields=function(m,d,a,u,s,n){var S=[m,d];if(d!=a){if(S.indexOf(a)===-1){S.push(a);}}if(u){if(S.indexOf(u)===-1){S.push(u);}}if(s&&Array.isArray(s)){s.forEach(function(k){if(S.indexOf(k)===-1){S.push(k);}});}if(n){n.forEach(function(k){if(S.indexOf(k.name)===-1){S.push(k.name);}});}return S;};F.getFilterDialogMode=function(m){return m.getProperty("/alp/filterDialogMode");};F.getFilterMode=function(m){return m.getProperty("/alp/filterMode");};F.isVisualFilterLazyLoaded=function(f){if(!f.getLazyLoadVisualFilter()){return false;}var b=this.getFilterDialogMode(f.getModel("_templPriv"));if(b==="compact"){return true;}else if(b==="visual"){return false;}var a=this.getFilterMode(f.getModel("_templPriv"));if(a==="compact"){return true;}return false;};F.formatStringDate=function(d,s){if(!s){var f=D.getDateInstance({pattern:"yyyyMMdd"});if(d!==""){var o=d&&f.parse(d);return F.getDateInMedium(o);}}return d;};F.formatStringDateYearMonth=function(d){if(d!==""){var f=D.getDateTimeInstance({format:"YYYYMMM"});var a=d;var b="-";var p=4;var o=[a.slice(0,p),b,a.slice(p)].join('');var e=new Date(o);return f.format(e);}return d;};F.getResolvedDimensionValue=function(k){return((k===null||k==="")?null:k.toString());};F.isPropertyHidden=function(e){var i=false;if(e){var h=e["com.sap.vocabularies.UI.v1.Hidden"];i=h?h.Bool==="true":false;}return i;};F.isInteger=function(p){return p.toUpperCase().indexOf("EDM.INT")!=-1?true:false;};F.onKeyUpVisualFilter=function(e){if(e.keyCode===K.F4){var f=sap.ui.getCore().byId(e.target.id),b,r;if(f){var o=f.getMetadata().getElementName();switch(o){case"sap.m.Button":if(this.isF4Enabled){b=f;}break;case"sap.m.HeaderContainerItemContainer":var v=f.getItem();if(v){r=v.getId().replace("FilterItemContainer","ValueHelpButton");b=this.getF4ButtonId(r);}break;case"sap.m.CustomListItem":r=f.getId().replace("FilterItemContainer","ValueHelpButton");b=this.getF4ButtonId(r);break;default:break;}}else{if(e.target.id.length>0){r=e.target.id.replace("FilterItemMicroChart","ValueHelpButton");}else{r=e.target.parentElement.id.replace("FilterItemMicroChart","ValueHelpButton");}r=r.slice(0,r.indexOf("-innerChart"));b=this.getF4ButtonId(r);}if(b&&this.isF4Enabled(b)){b.firePress();}}};F.onKeyDownVisualFilter=function(s,e){if(e.keyCode===K.ENTER){if(e.ctrlKey||e.metaKey){s.search();e.stopPropagation();}}};F.getF4ButtonId=function(i){var b=sap.ui.getCore().byId(i);return b;};F.isF4Enabled=function(b){if(b.data("isF4Enabled")){if(b.getVisible()&&b.getEnabled()){return true;}}return false;};F.isAlreadyInParameter=function(i,p){return i&&i.some(function(e){return e.localDataProperty===p;});};F.checkManditoryFieldsFilled=function(s){if(s){var a=s.determineMandatoryFilterItems(),f=s.getFiltersWithValues(),I=true,b=0;if(a.length){if(!f.length||(f.length<a.length)){I=false;}else{for(var i=0;i<a.length;i++){for(var j=0;j<f.length;j++){if(f[j].getName()===a[i].getName()){b++;}}}I=(b===a.length);}}if(I){var S=s.verifySearchAllowed.apply(s,arguments);if(S.hasOwnProperty("error")||S.hasOwnProperty("mandatory")){I=false;}}}return I;};F.getParameter=function(p){var P="$Parameter.";if(p.indexOf(P)>-1){p=p.substring(P.length);}return p;};return F;},true);
