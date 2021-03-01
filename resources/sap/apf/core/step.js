/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.apf.core.utils.filter");jQuery.sap.require("sap.apf.core.utils.areRequestOptionsEqual");jQuery.sap.require("sap.apf.utils.utils");jQuery.sap.require("sap.apf.utils.filter");jQuery.sap.require("sap.apf.utils.executeFilterMapping");jQuery.sap.require("sap.apf.core.constants");jQuery.sap.require("sap.apf.core.metadataProperty");sap.ui.define(['sap/apf/utils/trace'],function(t){'use strict';function S(m,s,f,r,c){m.check(s!==undefined,"Step: step configuration is missing");m.check(s.binding!==undefined,"No binding assigned to step "+s.id+" in analytical configuration",sap.apf.core.constants.message.code.errorCheckConfiguration);var l=sap.apf.core.constants.representationMetadata.labelDisplayOptions;var a=this;var b,R,C,o;var d={responseData:[]};var A=jQuery.extend(true,{},s);this.type='step';this.title=jQuery.extend(true,{},s.title);this.longTitle=undefined;if(s.longTitle){this.longTitle=jQuery.extend(true,{},s.longTitle);}this.thumbnail=jQuery.extend(true,{},s.thumbnail);this.categories=s.categories;this.destroy=function(){if(b){b.destroy();}R=undefined;C=undefined;o=undefined;b=undefined;a=undefined;};this.getRequestConfiguration=function(){return f.getConfigurationById(s.request);};this.getAdditionalConfigurationProperties=function(){return A;};this.update=function(F,g){var h;var j=this.getFilter();var k=!F.isEqual(C);var n=b.getRequestOptions(k);var p=!sap.apf.core.utils.areRequestOptionsEqual(o,n);var q=f.getConfigurationById(s.request);t.logCall("Step.update",", bFilterChanged",k,", bRequestOptionsChanged",p);c.getMetadata(q.service).then(function(u){t.log("update  -  in oCoreApi.getMetadata().then()");if(!j.isEmpty()&&!s.topNSettings&&(b.getSelectedRepresentation().type==='TableRepresentation')){var v=j.getProperties()[0];var w=[v];var x=u.getPropertyMetadata(q.entityType,v)["sap:text"];if(x){w.push(x);}h={selectionFilter:j,requiredFilterProperties:w};}if(R&&(k||p)){t.log("update() - before sendGetInBatch");R.sendGetInBatch(F,g,n,h);}else{t.log("update() - no request, before callbackAfterRequest");g({},false);}},function(){t.log("update - then.reject() - before callbackAfterRequest");g({},false);});t.logReturn("update");};this.determineFilter=function(g,h){var n;var M;if(this.adjustCumulativeFilter){n=this.adjustCumulativeFilter(g);}if(e()&&this.getFilter().toUrlParam()){var j=f.getConfigurationById(s.filterMapping.requestForMappedFilter);j.selectProperties=s.filterMapping.target.slice();if(s.filterMapping.targetPropertyDisplayOption===l.TEXT||s.filterMapping.targetPropertyDisplayOption===l.KEY_AND_TEXT){c.getMetadata(j.service).done(function(q){var u=q.getPropertyMetadata(j.entityType,j.selectProperties[0]);if(u.text){j.selectProperties.push(u.text);}k.call(this,j);}.bind(this));}else{k.call(this,j);}}else{d.responseData=[];h(this.getFilter(),n);}function k(j){var q=f.createRequest(j);M=g.addAnd(this.getFilter());if(n){M=n.copy().addAnd(this.getFilter());}if(M.isEqual(d.mergedFilter)){h(d.mappedFilter,n);}else{sap.apf.utils.executeFilterMapping(M,q,s.filterMapping.target,p,m);}}function p(q,u,v){if(!u){if(s.filterMapping.keepSource==='true'){q=a.getFilter().addAnd(q);}d.mergedFilter=M;d.mappedFilter=q;d.responseData=v;h(q,n);}}};this.getBinding=function(){return b;};this.getFilter=function(){return b.getFilter(this.getContextInfo());};this.getContextInfo=function(){var g=f.getConfigurationById(s.request);var h={entityType:g.entityType,service:g.service};return h;};this.setData=function(D,F){var g=!F.isEqual(C);C=F.copy();o=jQuery.extend({},b.getRequestOptions(g));b.setData(D);};this.getRepresentationInfo=function(){return b.getRepresentationInfo();};this.getSelectedRepresentationInfo=function(){return b.getSelectedRepresentationInfo();};this.getSelectedRepresentation=function(){return b.getSelectedRepresentation();};this.setSelectedRepresentation=function(r){b.setSelectedRepresentation(r);};this.getFilterInformation=function(g,h){var j=jQuery.Deferred();var k;if(s.longTitle&&s.longTitle.key){k=c.getTextNotHtmlEncoded(s.longTitle.key);}else{k=c.getTextNotHtmlEncoded(s.title.key);}if(e()&&s.filterMapping.keepSource==="true"){jQuery.when(q(g,k),n(g,k)).then(function(v,w){j.resolve([v,w]);});}else if(e()){jQuery.when(n(g,k)).then(function(v){j.resolve([v]);});}else{jQuery.when(q(g,k)).then(function(v){j.resolve([v]);});}return j;function n(){var v=jQuery.Deferred();var w;if(s.filterMapping.targetPropertyLabelKey){w=c.getTextNotHtmlEncoded(s.filterMapping.targetPropertyLabelKey);}var x=s.filterMapping.target[0];var y=f.getConfigurationById(s.filterMapping.requestForMappedFilter);p(x,y).done(function(z){u(v,x,z,w,y,true);});return v;}function p(v,w){var x=jQuery.Deferred();c.getMetadata(w.service).done(function(y){var z;var B=new sap.apf.core.MetadataProperty(y.getPropertyMetadata(w.entityType,v));if(B.text){z=B.text;}var D=[];var E=s.filterMapping.targetPropertyDisplayOption;var F=false;d.responseData.forEach(function(G){if(E===l.TEXT&&z){D.push({text:G[z]});}else if(E===l.KEY_AND_TEXT&&z){D.push({text:c.getTextNotHtmlEncoded("keyAndTextSelection",[G[z],sap.apf.utils.convertToExternalFormat(G[v],B)])});}else{D.push({text:G[v]});F=true;}});D=sap.apf.utils.sortByProperty(D,"text",B);if(F===true){D.forEach(function(G){G.text=sap.apf.utils.convertToExternalFormat(G.text,B);});}x.resolve(D);});return x;}function q(){var v=jQuery.Deferred();var w;var x;var y=f.getConfigurationById(s.binding);var z=f.getConfigurationById(s.request);if(y.requiredFilters&&y.requiredFilters.length===1){w=y.requiredFilters[0];if(y.requiredFilterOptions&&y.requiredFilterOptions.fieldDesc){x=c.getTextNotHtmlEncoded(y.requiredFilterOptions.fieldDesc.key);}}u(v,w,b.getSortedSelections(),x,z,false);return v;}function u(v,w,x,y,z,B){var D;var E;if(!y){D=c.getMetadata(z.service);}if(w){E=c.getMetadata(g.getRequestConfiguration().service);}jQuery.when(D,E).then(function(F,G){var H=false;var I;var J=g.getRequestConfiguration().entityType;var K;if(G){K=G.getFilterableProperties(J).concat(G.getParameterEntitySetKeyProperties(J));}if(!y&&F&&w){y=F.getPropertyMetadata(z.entityType,w)["sap:label"];}if(!w){H=true;I=c.getTextNotHtmlEncoded("noSelectionPossible");}else if(K.indexOf(w)===-1){H=true;I=c.getTextNotHtmlEncoded("filterNotApplicable");}else if(x.length===0){H=true;I=c.getTextNotHtmlEncoded("nothingSelected");}v.resolve({text:k,selectablePropertyLabel:y||w,filterValues:x,infoIcon:B,infoText:B?c.getTextNotHtmlEncoded("infoIconfilterMapping"):undefined,warningIcon:H,warningText:I,stepIndex:h});});}};this.serialize=function(){return{stepId:s.id,binding:b.serialize()};};this.deserialize=function(g){b.deserialize(g.binding);m.check(s.id,g.stepId,"sap.apf.core.step.deserialize inconsistent serialization data - id "+g.stepId);return this;};this.getAssignedNavigationTargets=function(){return s.navigationTargets;};i();function i(){b=f.createBinding(s.binding,undefined,undefined,r);delete A.binding;if(s.request!==undefined&&s.request!==""){R=f.createRequest(s.request);delete A.request;}}function e(){if(s.filterMapping){if(s.filterMapping.requestForMappedFilter&&s.filterMapping.target instanceof Array&&s.filterMapping.keepSource){return true;}m.putMessage(m.createMessageObject({code:"5104"}));}return false;}}sap.apf.core.Step=S;return{constructor:S};},true);
