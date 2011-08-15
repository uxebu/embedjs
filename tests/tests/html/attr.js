// This test group tests style methods.

	// TODO: dojo.style could use some more testing,
	//	as we heavily modified dojo's style method.
require(['text!../tests/tests/html/class+style.html'], function(html){
	

tests.register("html-attr",
	[
		function _start(t){
			document.body.innerHTML = html;
		},
		
		function getTypeInput(t){
			doh.f(dojo.hasAttr(dojo.byId("input-no-type"), "type"));
			doh.is(null, dojo.attr(dojo.byId("input-no-type"), "type"));
			doh.t(dojo.hasAttr(dojo.byId("input-with-type"), "type"));
			doh.is("checkbox", dojo.attr(dojo.byId("input-with-type"), "type"));
		},
		function getWithString(t){
			doh.f(dojo.hasAttr("input-no-type", "type"));
			doh.is(null, dojo.attr("input-no-type", "type"));
			doh.t(dojo.hasAttr("input-with-type", "type"));
			doh.is("checkbox", dojo.attr("input-with-type", "type"));
		},
		function attrId(t){
			doh.t(dojo.hasAttr("div-no-tabindex", "id"));
			doh.is("div-no-tabindex", dojo.attr("div-no-tabindex", "id"));
			var div = document.createElement("div");
			doh.f(dojo.hasAttr(div, "id"));
			doh.is(null, dojo.attr(div, "id"));
			dojo.attr(div, "id", "attrId1");
			doh.t(dojo.hasAttr(div, "id"));
			doh.is("attrId1", dojo.attr(div, "id"));
			dojo.removeAttr(div, "id");
			doh.f(dojo.hasAttr(div, "id"));
			doh.is(null, dojo.attr(div, "id"));
		},
		function getTabindexDiv(t){
			doh.f(dojo.hasAttr("div-no-tabindex", "tabIndex"));
			doh.t(dojo.attr("div-no-tabindex", "tabIndex") <= 0);
			doh.t(dojo.hasAttr("div-tabindex-minus-1", "tabIndex"));
			doh.is(-1, dojo.attr("div-tabindex-minus-1", "tabIndex"));
			doh.t(dojo.hasAttr("div-tabindex-0", "tabIndex"));
			doh.is(0, dojo.attr("div-tabindex-0", "tabIndex"));
			doh.is(1, dojo.attr("div-tabindex-1", "tabIndex"));
		},
		function getTabindexInput(t){
				// IE6/7 always reports tabIndex as defined
				doh.f(dojo.hasAttr("input-no-tabindex", "tabIndex"));
				doh.f(dojo.attr("input-no-tabindex", "tabIndex"));
				
			doh.t(dojo.hasAttr("input-tabindex-minus-1", "tabIndex"));
			
				// Opera (at least <= 9) does not support tabIndex="-1"
				doh.is(-1, dojo.attr("input-tabindex-minus-1", "tabIndex"));
				
			doh.t(dojo.hasAttr("input-tabindex-0", "tabIndex"));
			doh.is(0, dojo.attr("input-tabindex-0", "tabIndex"));
			doh.is(1, dojo.attr("input-tabindex-1", "tabIndex"));
		},
		function setTabindexDiv(t){
			var div = document.createElement("div");
			doh.is(null, dojo.attr(div, "tabIndex"));
			dojo.attr(div, "tabIndex", -1);
			
				// Opera (at least <= 9) does not support tabIndex="-1"
				doh.is(-1, dojo.attr(div, "tabIndex"));
			
			dojo.attr(div, "tabIndex", 0);
			doh.is(0, dojo.attr(div, "tabIndex"));
			dojo.attr(div, "tabIndex", 1);
			doh.is(1, dojo.attr(div, "tabIndex"));
		},
		function setTabindexInput(t){
			var input = document.createElement("input");
			doh.t(dojo.attr(input, "tabIndex") <= 0);
			dojo.attr(input, "tabIndex", -1);
			
				// Opera (at least <= 9) does not support tabIndex="-1"
				doh.is(-1, dojo.attr(input, "tabIndex"));
			
			dojo.attr(input, "tabIndex", 0);
			doh.is(0, dojo.attr(input, "tabIndex"));
			dojo.attr(input, "tabIndex", 1);
			doh.is(1, dojo.attr(input, "tabIndex"));
		},
		function removeTabindexFromDiv(t){
			var div = document.createElement("div");
			dojo.attr(div, "tabIndex", 1);
			doh.is(1, dojo.attr(div, "tabIndex"));
			dojo.removeAttr(div, "tabIndex");
			doh.is(null, dojo.attr(div, "tabIndex"));
		},
		function removeDisabledFromInput(t){
			var input = document.createElement("input");
			dojo.attr(input, "disabled", true);
			doh.t(dojo.attr(input, "disabled"));
			dojo.removeAttr(input, "disabled");
			doh.f(dojo.attr(input, "disabled"));
		},
		function removeTabindexFromInput(t){
			var input = document.createElement("input");
			dojo.attr(input, "tabIndex", 1);
			doh.is(1, dojo.attr(input, "tabIndex"));
			dojo.removeAttr(input, "tabIndex");
			doh.is(null, dojo.attr(input, "tabIndex"));
		},
		function setReadonlyInput(t){
			var input = document.createElement("input");
			doh.f(dojo.attr(input, "readonly"));
			dojo.attr(input, "readonly", true);
			doh.is(true, dojo.attr(input, "readonly"));
			dojo.attr(input, "readonly", false);
			doh.is(false, dojo.attr(input, "readonly"));
		},
		function attr_map(t){
			var input = document.createElement("input");
			var ctr= 0;
			dojo.attr(input, {
				"class": "thinger blah",
				"tabIndex": 1,
				"type": "text",
				"onfocus": function(e){
					ctr++;
				}
			});
			dojo.body().appendChild(input);
			doh.is(1, dojo.attr(input, "tabIndex"), "tabIndex");
			
				// IE6/7 treats type="text" as missing, even if it was
				// explicitly specified
				doh.is("text", dojo.attr(input, "type"), "type");
			
			doh.is(0, ctr, "onfocus ctr == 0");
			doh.t(input.className.indexOf("thinger") != -1, "hasClass of thinger");
			doh.t(input.className.indexOf("blah") != -1, "hasClass of blah");
			var def = new doh.Deferred();
			input.focus();
			setTimeout(function(){
				doh.is(1, ctr, "onfocus ctr == 1");
				input.blur();
				input.focus();
				setTimeout(function(){
					doh.is(2, ctr, "onfocus ctr == 2");
					def.callback(true);
				}, 10);
			}, 10);
			return def;
		},
		
		function testLabelForAttr(t){
			// create label with no for attribute make sure requesting
			// it as for and html for returns null
			var label = document.createElement("label");
			
				// IE always assumes that "for" is present
				doh.f(dojo.attr(label, "for"));
				doh.f(dojo.attr(label, "htmlFor"));
			
			// add a for attribute and test that can get by requesting for
			dojo.attr(label, "for", "testId");
			doh.is("testId", dojo.attr(label, "for"));
			// add as htmlFor and make sure it is returned when requested as htmlFor
			var label2 = document.createElement("label");
			dojo.attr(label2, "htmlFor", "testId2");
			doh.is("testId2", dojo.attr(label2, "htmlFor"));
			// check than when requested as for or htmlFor attribute is found
			doh.t(dojo.hasAttr(label, "for"));
			doh.t(dojo.hasAttr(label2, "htmlfor"));
			// test from markup
			var labelNoFor = dojo.byId("label-no-for");
			// make sure testing if has attribute using for or htmlFor 
			// both return null when no value set
			
				// IE always assumes that "for" is present
				doh.f(dojo.hasAttr(labelNoFor, "for"));
				doh.f(dojo.hasAttr(labelNoFor, "htmlFor"));
			
			var labelWithFor = dojo.byId("label-with-for");
			// when markup includes for make certain testing if has attribute
			// using for or htmlFor returns true
			doh.t(dojo.hasAttr(labelWithFor, "for"));
			doh.t(dojo.hasAttr(labelWithFor, "htmlFor"));
			// when markup include for attrib make sure can retrieve using for or htmlFor
			doh.is("input-with-label", dojo.attr(labelWithFor, "for"));
			doh.is("input-with-label", dojo.attr(labelWithFor, "htmlFor"));
		},
		function attrInputTextValue(t){
			doh.is("123", dojo.byId("input-text-value").value);
			doh.is("123", dojo.attr("input-text-value", "value"));
			dojo.attr("input-text-value", "value", "abc");
			doh.is("abc", dojo.byId("input-text-value").value);
			doh.is("abc", dojo.attr("input-text-value", "value"));
			dojo.byId("input-text-value").value = "xyz";
			doh.is("xyz", dojo.byId("input-text-value").value);
			doh.is("xyz", dojo.attr("input-text-value", "value"));
			dojo.byId("input-text-value").value = "123"; // fixes initialization problem when the test is reloaded
		},
		function testInputDisabled(t){
			doh.f(dojo.attr("input-no-disabled", "disabled"));
			doh.t(dojo.attr("input-with-disabled", "disabled"));
			doh.t(dojo.attr("input-with-disabled-true", "disabled"));
		},
		function attr_reconnect(t){
			var input = document.createElement("input");
			var ctr = 0;
			dojo.attr(input, "type", "text");
			dojo.attr(input, "onfocus", function(e){ ctr++; });
			dojo.attr(input, "onfocus", function(e){ ctr++; });
			dojo.attr(input, "onfocus", function(e){ ctr++; });
			dojo.body().appendChild(input);
			
				// IE6/7 treats type="text" as missing, even if it was
				// explicitly specified
				doh.is("text", dojo.attr(input, "type"));
			
			doh.is(0, ctr);
			var def = new doh.Deferred();
			input.focus();
			setTimeout(function(){
				doh.is(1, ctr);
				input.blur();
				input.focus();
				setTimeout(function(){
					doh.is(2, ctr);
					def.callback(true);
				}, 10);
			}, 10);
			return def;
		},
		function attrSpecials(){
			var node = document.createElement("div");
			dojo.body().appendChild(node);
			dojo.attr(node, {
				style: {
					opacity: 0.5,
					width: "30px",
					border: "1px solid black"
				}
			});
			doh.is(0.5, dojo.style(node, "opacity"));
			doh.is("30px", dojo.style(node, "width"));
			doh.is("1px", dojo.style(node, "borderWidth"));
			dojo.attr(node, {
				innerHTML: "howdy!"
			});
			doh.is("howdy!", node.innerHTML);
			doh.is("howdy!", dojo.attr(node, "innerHTML"));
			dojo.attr(node, "innerHTML", "<span>howdy!</span>");
			doh.is(1, node.firstChild.nodeType);
			doh.is("span", node.firstChild.nodeName.toLowerCase());
			doh.is("<span>howdy!</span>", node.innerHTML.toLowerCase());
			doh.is("<span>howdy!</span>", dojo.attr(node, "innerHTML").toLowerCase());
		},
		function attrInnerHtmlTable(t){
			var n = document.createElement('table');
			embed.attr(n, { innerHTML: "<thead><tr><th>1st!</th></tr></thead><tbody></tbody>"});
			doh.is("<thead><tr><th>1st!</th></tr></thead><tbody></tbody>",
					n.innerHTML.toLowerCase().replace(/\s+/g, ""));
		}
	]
);

});
