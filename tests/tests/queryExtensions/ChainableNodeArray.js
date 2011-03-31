tests.register("queryExtension-ChainableNodeArray", 
	[
	 	function _start(t){
			doh.showBox('html_query-test');
		},
		
		function backwardsCompatible(){
			// Make sure though we have a chainable that simple nodes are still returned properly.
			var node = document.getElementById("_foo");
			doh.is(node, embed.query("#_foo")[0]);
		},
		
		function findsClasses(){
			doh.is(2, embed.query(".foo").length);
		},
		
		function isObject(){
			doh.is(typeof embed.query("#_foo"), "object");
		},
		
		function hasStyleFunction(){
			doh.is(typeof embed.query("#_foo").style, "function");
		},
		
		function hasAttrFunction(){
			doh.is(typeof embed.query("#_foo").attr, "function");
		},
		
		function hasAllFunctions(){
			var all = "attr addClass connect removeAttr removeClass style toggleClass place".split(" ");
			var nl = embed.query("#_foo");
			for (var i=0, l=all.length; i<l; i++){
				doh.is("function", typeof nl[all[i]], "function '" + all[i] + "' missing");
			}
		},
		
		function callStyleFunction(){
			var n = embed.query("#_foo")
			n.style("color", "red");
			doh.is("red", embed.style(n[0], "color"));
		},
		
		function callStyleFunctionMultipleNodes(){
			var n = embed.query("#_foo, .foo, .subDiv")
			n.style("color", "red");
			for (var i=0, l=n.length; i<l; i++){
				doh.is("red", embed.style(n[i], "color"));
			}
		},
		
		function callAttrFunction(){
			var n = embed.query("#_foo");
			n.attr("data-x", "f");
			doh.is("f", embed.attr(n[0], "data-x"));
		},
		
		function callAttrFunctionMultipleNodes(){
			var n = embed.query("#_foo, .foo, .subDiv")
			n.attr("data-x", "f");
			for (var i=0, l=n.length; i<l; i++){
				doh.is("f", embed.attr(n[i], "data-x"));
			}
		},
		
		function callAddClassFunction(){
			var n = embed.query("#_foo");
			n.addClass("f");
			doh.assertTrue(embed.hasClass(n[0], "f"));
		},
		
		function callRemoveClassFunction(){
			var n = embed.query("#_foo");
			n.addClass("f");
			n.removeClass("f");
			doh.assertFalse(embed.hasClass(n[0], "f"));
		},
		
		function callMultipleFunctions(){
			var n = embed.query("#_foo");
			n.addClass("f")
			 .attr("data-x", "whateva")
			 .style("color", "blue");
			doh.assertTrue(embed.hasClass(n[0], "f"));
			doh.assertEqual("whateva", embed.attr(n[0], "data-x"));
			doh.assertEqual("blue", embed.style(n[0], "color"));
		},
		
		function callMultipleFunctions1(){
			var n = embed.query("#_foo");
			n.attr("data-x", "y")
			 .addClass("z")
			 .connect("onclick", console.log) // TODO how can we test this? missing assert for this still
			 .removeAttr("data-x")
			 .removeClass("z")
			 .style("color", "white")
			 .toggleClass("u");
			 //.place(); too lazy to look up how it works :)
			doh.assertTrue(embed.hasClass(n[0], "u"));
			doh.assertFalse(embed.hasClass(n[0], "z"));
			doh.assertEqual(null, embed.attr(n[0], "data-x"));
			doh.assertEqual("white", embed.style(n[0], "color"));
		},
		
		//
		// Use array functions in the chaining
		//
		function callArrayMap(){
			embed.query("#_foo").filter(console.log);
			//doh.assertFalse(embed.hasClass(embed.query("#_foo")[0], "f"));
		}
	]
);
