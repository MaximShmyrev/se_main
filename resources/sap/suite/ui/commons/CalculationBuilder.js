sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/core/Control","./CalculationBuilderItem","./CalculationBuilderExpression","./CalculationBuilderInput","./CalculationBuilderFunction","sap/m/OverflowToolbar","sap/m/OverflowToolbarToggleButton","sap/m/OverflowToolbarButton","sap/m/ToolbarSpacer","sap/m/Title","sap/ui/core/Popup","sap/m/MessageBox","sap/base/Log","sap/base/util/uid","sap/ui/core/library","sap/m/library","sap/ui/core/routing/HashChanger"],function(q,l,C,a,b,c,d,O,e,f,T,g,P,M,L,u,h,m,H){"use strict";var B=m.ButtonType;var j=h.TitleLevel;var I=Object.freeze({SHOW_EXPRESSION:"sap-icon://notification-2",EXPAND_VARIABLE:"sap-icon://disconnected",FULL_SCREEN:"sap-icon://full-screen",EXIT_FULL_SCREEN:"sap-icon://exit-full-screen"});var r=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");var k=l.CalculationBuilderOperatorType,n=l.CalculationBuilderLogicalOperatorType,o=l.CalculationBuilderComparisonOperatorType,p=l.CalculationBuilderItemType,F=l.CalculationBuilderFunctionType,s=l.CalculationBuilderLayoutType,V=l.CalculationBuilderValidationMode;var N=new RegExp(String.fromCharCode(160),"g");var t={abs:{key:"ABS",title:"ABS - Absolute Value",allowed:true},round:{key:"Round",title:"Round",template:["",",",""],allowed:true},roundup:{key:"RoundUp",title:"Round Up",template:["",",",""],allowed:true},rounddown:{key:"RoundDown",title:"Round Down",template:["",",",""],allowed:true},sqrt:{key:"SQRT",title:"SQRT",allowed:true},"case":{key:"Case",title:"Case",description:"CASE ( \"When\" Expression \"Then\" Expression \"Else\" Expression )",template:["",",","",",",""]},ndiv0:{key:"NDIV0",title:"NDIV0"},nodim:{key:"NODIM",title:"NODIM",description:"NODIM ( Variable )"},sumct:{key:"SUMCT",title:"SUMCT",description:"SUMGT ( Variable )"},sumgt:{key:"SUMGT",title:"SUMGT",description:"SUMGT ( Variable )"},sumrt:{key:"SUMRT",title:"SUMRT",description:"SUMRT ( Variable )"}};var v=C.extend("sap.suite.ui.commons.CalculationBuilder",{metadata:{library:"sap.suite.ui.commons",properties:{expression:{type:"string",group:"Misc",defaultValue:null},title:{type:"string",group:"Misc",defaultValue:null},showToolbar:{type:"boolean",group:"Misc",defaultValue:true},wrapItemsInExpression:{type:"boolean",group:"Misc",defaultValue:true},layoutType:{type:"string",group:"Misc",defaultValue:"Default"},showInputToolbar:{type:"boolean",group:"Misc",defaultValue:false},readOnly:{type:"boolean",group:"Misc",defaultValue:false},allowComparisonOperators:{type:"boolean",group:"Misc",defaultValue:true},allowLogicalOperators:{type:"boolean",group:"Misc",defaultValue:true},allowSuggestions:{type:"boolean",group:"Misc",defaultValue:true},allowStringConstants:{type:"boolean",group:"Misc",defaultValue:false},allowStringLiterals:{type:"boolean",group:"Misc",defaultValue:false},validationMode:{type:"sap.suite.ui.commons.CalculationBuilderValidationMode",group:"Misc",defaultValue:V.LiveChange},disabledDefaultTokens:{type:"string",group:"Misc",defaultValue:""}},defaultAggregation:"items",aggregations:{items:{type:"sap.suite.ui.commons.CalculationBuilderItem",multiple:true,singularName:"item",bindable:"bindable",forwarding:{idSuffix:"-expression",aggregation:"items",forwardBinding:true}},variables:{type:"sap.suite.ui.commons.CalculationBuilderVariable",multiple:true,singularName:"Variable",forwarding:{idSuffix:"-expression",aggregation:"variables",forwardBinding:true}},functions:{type:"sap.suite.ui.commons.CalculationBuilderFunction",multiple:true,singularName:"Function",forwarding:{idSuffix:"-expression",aggregation:"functions",forwardBinding:true}},operators:{type:"sap.ui.core.Item",multiple:true,singularName:"Operator",forwarding:{idSuffix:"-expression",aggregation:"operators",forwardBinding:true}},groups:{type:"sap.suite.ui.commons.CalculationBuilderGroup",multiple:true,singularName:"Group",forwarding:{idSuffix:"-expression",aggregation:"groups",forwardBinding:true}}},events:{validateFunction:{parameters:{definition:"object",customFunction:"object",result:"sap.suite.ui.commons.CalculationBuilderValidationResult"}},change:{},afterValidation:{}}},renderer:function(R,i){var w=i.getWrapItemsInExpression()?" sapCalculationBuilderWrapItems ":"",x=i.getLayoutType()===s.TextualOnly,D=i._bShowInput||x?"":"style=\"display:none\"",y=i._isExpressionVisible(),z=i._isInputVisible(),A=i.getReadOnly();R.write("<div");R.writeControlData(i);R.addClass("sapCalculationBuilder");if(i.getReadOnly()){R.addClass("sapCalculationBuilderReadOnly");}R.writeClasses(i);R.write(">");if(i.getShowToolbar()&&!x){R.renderControl(i.getToolbar());}if(y){i._oExpressionBuilder._bReadOnly=A;R.write("<div class=\"sapCalculationBuilderInsideWrapper"+w+"\">");R.renderControl(i._oExpressionBuilder);R.write("</div>");}if(y&&z){R.write("<div class=\"sapCalculationBuilderDelimiterLine\"></div>");}if(z){i._oInput._bReadOnly=A||(i.getLayoutType()===s.VisualTextualReadOnly);R.write("<div");R.addClass("sapCalculationBuilderInputOuterWrapper");if(i._oInput._bReadOnly){R.addClass("sapCalculationBuilderReadOnly");}if(i.getLayoutType()===s.Default||i.getLayoutType()===s.VisualTextualReadOnly){R.addClass("sapCalculationBuilderInputOuterWrapperMargin");}R.writeClasses();R.write(D+">");R.renderControl(i._oInput);R.write("</div>");}R.write("</div>");}});v.prototype.init=function(){this.oHashChanger=new H();this.oHashChanger.init();this._mDisabledTokens={};this._bShowInput=true;this._oFullScreenContainer=null;this._bIsFullScreen=false;this._oExpressionBuilder=new b(this.getId()+"-expression",{change:function(){this._expressionChanged();this.fireChange();}.bind(this)});this.addDependent(this._oExpressionBuilder);this._oInput=new c(this.getId()+"-input",{change:function(E){var i=E.getParameter("value"),w=this._oInput._stringToItems(i),x=E.getParameter("position");this._oExpressionBuilder._smartRender(w);this._setExpression(this._oInput._convertEmptyHashes(i));if(this.getValidationMode()!==V.FocusOut){this._validateInput(i,x);}else{this._oInput._recreateText({text:i,position:x,errors:this._oExpressionBuilder._aErrors});}this._enableOrDisableExpandAllButton();this.fireChange();}.bind(this)});this.addDependent(this._oInput);};v.prototype._expressionChanged=function(){var i="";this._oExpressionBuilder._aErrors=this._oExpressionBuilder._validateSyntax();i=this._oInput._itemsToString({items:this._oExpressionBuilder.getItems(),errors:this._oExpressionBuilder._aErrors});this._setExpression(i);this.fireAfterValidation();this._oInput._displayError(this._oExpressionBuilder._aErrors.length!==0);this._oExpressionBuilder._printErrors();this._enableOrDisableExpandAllButton();};v.prototype.onBeforeRendering=function(){this._resetItems();this._createToolbar();this._oExpressionBuilder._createVariablesMap();this._oInput._aVariables=this.getVariables();if(this._bExpressionSet){this._oExpressionBuilder._setItems(this._oInput._stringToItems(this._sExpressionDirectValue));}this._bExpressionSet=false;this._sExpressionDirectValue="";if(!this._isExpressionVisible()){this._oExpressionBuilder._aErrors=this._oExpressionBuilder._validateSyntax();}this._bRendered=false;};v.prototype.onAfterRendering=function(){this._setExpression(this._oInput._itemsToString({items:this._oExpressionBuilder.getItems(),errors:this._oExpressionBuilder._aErrors}));this._bRendered=true;this._oInput._displayError(this._oExpressionBuilder._aErrors.length>0);this.oHashChanger.attachEvent("hashChanged",function(){if(this._bIsFullScreen){this._toggleFullScreen();}}.bind(this));};v.prototype.exit=function(){if(this.oHashChanger){this.oHashChanger.destroy();}};v.prototype.getToolbar=function(){return this._oToolbar;};v.prototype.getInputToolbar=function(){return this._oInput&&this._oInput._oInputToolbar;};v.prototype.validateParts=function(i){i=i||{};return this._oExpressionBuilder._validateSyntax({items:i.items,from:i.from,to:i.to});};v.prototype.appendError=function(E){this._oExpressionBuilder._aErrors.push(E);};v.prototype.getErrors=function(){return this._oExpressionBuilder._aErrors;};v.prototype.validate=function(){this._resetItems();this._oExpressionBuilder._aErrors=this._oExpressionBuilder._validateSyntax();this.updateErrorsDisplay();};v.prototype.updateErrorsDisplay=function(){var E=this._oExpressionBuilder._aErrors;if(this._isInputVisible()){this._oInput._recreateText({errors:E});this._oInput._displayError(E.length>0);}if(this._isExpressionVisible()){this._oExpressionBuilder._printErrors();}};v.prototype.allowFunction=function(i,A){if(!i){return;}var w=t[i.toLowerCase()];if(w){w.allowed=A;}};v.prototype.updateOrCreateItem=function(K){this._oExpressionBuilder._updateOrCreateItem({key:K});};v.prototype.getErrors=function(){return this._oExpressionBuilder&&this._oExpressionBuilder._aErrors;};v.prototype.getAllowStringConstants=function(){L.warning("This function is deprecated, please use getAllowStringLiterals instead");return this.getAllowStringLiterals();};v.prototype.setAllowStringConstants=function(A){L.warning("This function is deprecated, please use setAllowStringLiterals instead");return this.setAllowStringLiterals(A);};v.prototype._resetItems=function(){this.getItems().forEach(function(i){i._reset();});};v.prototype._validateInput=function(i,w){this._oExpressionBuilder._aErrors=this._oExpressionBuilder._validateSyntax();this.fireAfterValidation();this._oInput._recreateText({text:i,position:w,errors:this._oExpressionBuilder._aErrors});this._oExpressionBuilder._printErrors();this._oInput._displayError(this._oExpressionBuilder._aErrors.length>0);};v.prototype._findInArray=function(K,i,w){return i.some(function(x){var y=w?x["get"+w]():x;return y.toLowerCase()===K;});};v.prototype._findInItems=function(K,i){K=(K||"").toLowerCase();return i.some(function(w){return w.getKey().toLowerCase()===K;});};v.prototype._createErrorText=function(E,w){E=E||this.getErrors();var x="",y=0,z=5;for(var i=0;i<E.length&&y<z;i++){if((E[i].index<0||!q.isNumeric(E[i].index))||!w){y++;x+=E[i].title+"\n";}}return x;};v.prototype._getFunctionMap=function(){return t;};v.prototype._getFunctionDefinition=function(K){K=(K||"").toLowerCase();return t[K]||q.grep(this.getFunctions(),function(i){return i.getKey().toLowerCase()===K;})[0];};v.prototype._getFunctionDescription=function(i){var E;if(i.description){return i.description;}E=r.getText("CALCULATION_BUILDER_EXPRESSION_TITLE");if(i.template){var D=(i.key||"")+" ( ";i.template.forEach(function(K){D+=(K?K:E)+" ";});return D+")";}return(i.key||"")+" ( "+E+" )";};v.prototype._getFunctionTemplateItems=function(i){if(!i){return[];}var w=(i instanceof d)?p.CustomFunction:p.Function;return w===p.Function?(i.template||[]):this._convertToTemplate(i.getItems());};v.prototype._getFunctionAllowParametersCount=function(K){var i=this._getFunctionTemplateItems(this._getFunctionDefinition(K)),w=i.join("");return(w.match(/,/g)||[]).length+1;};v.prototype._convertToTemplate=function(i){return i.map(function(w){return w.getKey();});};v.prototype._isOperator=function(K,A){A=A!==false;K=(K||"").toLowerCase();if(!this._isTokenAllowed(K)){return false;}return this._findInArray(K,Object.keys(k))||(A&&this.getAllowLogicalOperators()&&this._findInArray(K,Object.keys(n)))||(this.getAllowComparisonOperators()&&this._findInArray(K,Object.keys(o)));};v.prototype._isFunction=function(K){return this._isTokenAllowed(K)&&this._findInArray(K,Object.keys(F));};v.prototype._isCustomOperator=function(K){return this._findInItems(K,this.getOperators());};v.prototype._isStringLiteral=function(K){return K&&K.length>=2&&K[0]==="\""&&K[K.length-1]==="\"";};v.prototype._getType=function(K){K=(K||"").toLowerCase();if(!K){return p.Empty;}if(this._isOperator(K)){return p.Operator;}if(this._isCustomOperator(K)){return p.CustomOperator;}if(this._findInArray(K,this.getVariables(),"Key")){return p.Variable;}if(this._isFunction(K)){return p.Function;}if(this._findInArray(K,this.getFunctions(),"Key")){return p.CustomFunction;}if(this.getAllowStringLiterals()&&this._isStringLiteral(K)){return p.Literal;}if(!isNaN(K)){return p.Literal;}return p.Error;};v.prototype._createToolbar=function(){if(this._oToolbar){this._oShowInputButton&&this._oShowInputButton.setVisible(this._isInputVisible());this._oToolbarTitle.setText(this.getTitle());this._oToolbarTitle.setVisible(!!this.getTitle());return;}this._oToolbarTitle=new g({titleStyle:j.H4,text:this.getTitle(),visible:!!this.getTitle()});this._oToolbar=new O(this.getId()+"-toolbar",{content:[this._oToolbarTitle,new T()]}).addStyleClass("sapCalculationBuilderToolbar");this._oShowInputButton=new e({type:B.Transparent,icon:I.SHOW_EXPRESSION,tooltip:r.getText("CALCULATION_BUILDER_TOGGLE_EXPRESSION_BUTTON"),pressed:true,press:function(){this.$().find(".sapCalculationBuilderInputOuterWrapper").toggle();this._bShowInput=!this._bShowInput;}.bind(this)});this._oToolbar.addContent(this._oShowInputButton);this._oToolbar.addContent(this._getExpandAllVariablesButton());this._oToolbar.addContent(new e({type:B.Transparent,icon:I.FULL_SCREEN,tooltip:r.getText("CALCULATION_BUILDER_ENTER_FULL_SCREEN_BUTTON"),press:function(E){var i=E.getSource();this._toggleFullScreen();i.setTooltip(this._bIsFullScreen?r.getText("CALCULATION_BUILDER_EXIT_FULL_SCREEN_BUTTON"):r.getText("CALCULATION_BUILDER_ENTER_FULL_SCREEN_BUTTON"));i.setIcon(this._bIsFullScreen?I.EXIT_FULL_SCREEN:I.FULL_SCREEN);this.invalidate();}.bind(this)}));this._oFullScreenPopup=new P({modal:true,shadow:false,autoClose:false});this.addDependent(this._oToolbar);};v.prototype._getExpandAllVariablesButton=function(){if(!this._oExpandAllVariablesButton){this._oExpandAllVariablesButton=new f({type:B.Transparent,icon:I.EXPAND_VARIABLE,tooltip:r.getText("CALCULATION_BUILDER_EXPAND_ALL_BUTTON"),press:function(E){M.show(r.getText("CALCULATION_BUILDER_EXPAND_ALL_MESSAGE_TEXT"),{icon:M.Icon.WARNING,title:r.getText("CALCULATION_BUILDER_EXPAND_ALL_MESSAGE_TITLE"),actions:[M.Action.OK,M.Action.CANCEL],onClose:function(A){if(A===M.Action.OK){this._oExpressionBuilder._expandAllVariables();}}.bind(this)});}.bind(this)});}return this._oExpandAllVariablesButton;};v.prototype._enableOrDisableExpandAllButton=function(){var i=this.getReadOnly()||this.getLayoutType()===s.VisualTextualReadOnly,$=this._getExpandAllVariablesButton().$();if($[0]){this._getExpandAllVariablesButton().setEnabled(!i&&this.getItems().some(function(w){return w._isVariable()&&w.isExpandable();}));}};v.prototype.setExpression=function(i){this.setProperty("expression",i);this._sExpressionDirectValue=i;if(this._bRendered||this._sExpressionDirectValue){this._bExpressionSet=true;}this._oInput._setupAriaLabel();return this;};v.prototype.getExpression=function(){if(this._bExpressionSet){return this._sExpressionDirectValue;}return this._oInput._itemsToString({createInputText:false,items:this.getItems()});};v.prototype._setExpression=function(i){if(i){i=i.replace(N," ");}this.setProperty("expression",i,true);this._oInput._setupAriaLabel();};v.prototype._toggleFullScreen=function(){var i=function(){this._oFullScreenContainer={};this._oFullScreenContainer.$content=this.$();if(this._oFullScreenContainer.$content){this._oFullScreenContainer.$tempNode=q("<div></div>");this._oFullScreenContainer.$content.before(this._oFullScreenContainer.$tempNode);this._oFullScreenContainer.$overlay=q("<div id='"+u()+"'></div>");this._oFullScreenContainer.$overlay.addClass("sapCalculationBuilderOverlay");this._oFullScreenContainer.$overlay.append(this._oFullScreenContainer.$content);this._oFullScreenPopup.setContent(this._oFullScreenContainer.$overlay);this._oFullScreenPopup.setModal(true);}this._oFullScreenPopup.open(0,P.Dock.BeginTop,P.Dock.BeginTop,q("body"));}.bind(this);var w=function(){this._oFullScreenContainer.$tempNode.replaceWith(this.$());this._oFullScreenPopup.close();this._oFullScreenContainer.$overlay.remove();}.bind(this);this._bIsFullScreen?w():i();this._bIsFullScreen=!this._bIsFullScreen;};v.prototype._getGroupMap=function(){return this._oExpressionBuilder._mGroups;};v.prototype._isExpressionVisible=function(){return this.getLayoutType()!==s.TextualOnly;};v.prototype._isInputVisible=function(){return this.getLayoutType()!==s.VisualOnly;};v.prototype._createFunctionObject=function(i){if(!i){return null;}return i instanceof d?{key:i.getKey(),title:i._getLabel(),description:this._getFunctionDescription({key:i.getKey(),description:i.getDescription(),template:this._convertToTemplate(i.getItems())}),type:p.CustomFunction,functionObject:i}:{key:i.key,title:i.title,description:this._getFunctionDescription(i),type:p.Function,functionObject:i};};v.prototype._getAllFunctions=function(){var i=[];Object.keys(t).forEach(function(K){if(t[K].allowed&&this._isTokenAllowed(K)){i.push(this._createFunctionObject(t[K]));}}.bind(this));this.getFunctions().forEach(function(w){i.push(this._createFunctionObject(w));}.bind(this));return i.sort(function(w,x){return w.title>x.title;});};v.prototype._isTokenAllowed=function(K){return!this._mDisabledTokens[(K||"").toLowerCase()];};v.prototype.setDisabledDefaultTokens=function(i){this._mDisabledTokens={};this.setProperty("disabledDefaultTokens",i);if(i){var w=i.split(";");w.forEach(function(x){if(x){this._mDisabledTokens[x.toLowerCase()]=1;}}.bind(this));}return this;};return v;});
