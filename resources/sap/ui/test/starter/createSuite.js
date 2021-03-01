/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(d,c){"use strict";var s,m,b;s=document.querySelector("[src$='createSuite.js']");if(s){m=/^(.*\/)?createSuite.js/.exec(s.getAttribute("src"));if(m){b=m[1]+"../../../../";}}if(b==null){throw new Error("createSuite.js: could not identify script tag!");}function l(u,c){var a=u.length,f=0;if(a===0){c();return;}function g(e){a--;if(e.type==='error'){f++;}e.target.removeEventListener("load",g);e.target.removeEventListener("error",g);if(a===0&&f===0&&c){c();}}for(var i=0;i<u.length;i++){var h=document.createElement("script");h.addEventListener("load",g);h.addEventListener("error",g);h.src=b+u[i];document.head.appendChild(h);}}window["sap-ui-optimized"]=window["sap-ui-optimized"]||(/\.head/.test(l)&&!/pending/.test(l));window["sap-ui-debug-no-reboot"]=true;var p=[];if(/(trident)\/[\w.]+;.*rv:([\w.]+)/i.test(window.navigator.userAgent)){p.push("sap/ui/thirdparty/baseuri.js");p.push("sap/ui/thirdparty/es6-promise.js");p.push("sap/ui/thirdparty/es6-shim-nopromise.js");}else if(/(edge)[ \/]([\w.]+)/i.test(window.navigator.userAgent)||/Version\/(11\.0).*Safari/.test(window.navigator.userAgent)){p.push("sap/ui/thirdparty/es6-promise.js");}l(p,function(){l(["ui5loader.js"],function(){sap.ui.loader.config({async:true});l(["ui5loader-autoconfig.js"],function(){sap.ui.require(d,c);});});});}(["sap/ui/test/starter/_utils"],function(u){"use strict";function r(h){u.addStylesheet("sap/ui/thirdparty/qunit-2.css");u.addStylesheet("sap/ui/test/starter/testsuite.css");return u.whenDOMReady().then(function(){var e=document.body.querySelector("#qunit");if(e==null){e=document.createElement("div");e.id="qunit";document.body.insertBefore(e,document.body.firstChild);}e.innerHTML=h;});}function a(){var d=document.createElement("A");document.head.appendChild(d);d.href=sap.ui.require.toUrl("")+"/../test-resources/sap/ui/qunit/testrunner.html"+"?testpage="+encodeURIComponent(window.location.pathname)+"&autostart=true";window.location.href=d.href;}function b(o){document.title="Available Unit Tests - "+o.name;var l="<h1 id='qunit-header' style='color:#C2CCD1;'>"+document.title+"</h1>"+"<h2 id='qunit-banner' style='background-color:#4646E7;'></h2>"+"<div id='qunit-testrunner-toolbar'>"+"<button id='redirect'>Run All</button>"+"</div>"+"<ol id='qunit-tests'>";o.sortedTests.forEach(function(t){var p=sap.ui.require.toUrl("")+"/../"+t.page;l+="<li class='"+(t.skip?"skipped":"pass")+"'>"+(t.skip?"<em class='qunit-skipped-label'>skipped</em>":"")+"<strong>"+(t.group?"<span class='module-name'>"+t.group+"<span>: ":"")+"<a class='test-name' href='"+p+"' target='_blank'>"+t.name+"</a></strong></li>";});l+="</ol>"+"<div id='redirect-hint'><div>"+"<div>Tests will start in</div>"+"<div id='remaining-time'>*</div>"+"<div>Click or press 'ESC' to cancel</div></div></div>";r(l).then(function(){var d=10*(parseInt(u.getAttribute("data-sap-ui-delay"))||2)+9;function f(){if(d===6){a();}else if(d>6){document.getElementById("remaining-time").textContent=String(Math.floor(d/10));d--;setTimeout(f,100);}else{document.removeEventListener("click",m);document.removeEventListener("keydown",m);var h=document.getElementById("redirect-hint");h.parentNode.removeChild(h);}}function m(e){if(e.type==="click"||e.key==="Escape"){d=-1;e.preventDefault();}}document.addEventListener("keydown",m);document.addEventListener("click",m);document.getElementById("redirect").addEventListener("click",a);f();});}function c(e){r("<h1 id='qunit-header' style='color:#C2CCD1;'>Failed to load Testsuite</h1>"+"<h2 id='qunit-banner' class='qunit-fail'></h2>"+"<ol id='qunit-tests'>"+"<li class='pass'><strong>"+u.encode(e.message||String(e))+"</strong></li>"+"</ol>");}var s=u.getAttribute("data-sap-ui-testsuite");var w=u.getSuiteConfig(s);var J=parent.jsUnitTestSuite;if(!J){w.then(b).catch(c);return;}window.suite=function(){function d(o){var C="/"+window.location.pathname.split("/")[1]+"/";var e=new J();o.sortedTests.forEach(function(t){if(!t.skip){e.addTestPage(C+t.page,t);}});return e;}return w.then(d).catch(function(e){c(e);throw e;});};var S=document.createEvent("CustomEvent");S.initCustomEvent("sap-ui-testsuite-ready",true,true,{});window.dispatchEvent(S);}));
