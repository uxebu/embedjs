tests.register("query-chainable", 
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
			var res = embed.query("#_foo");
			res.style("color", "red")
			doh.is("red", res.style("color"));
		},
		
		function callAttrFunction(){
			var res = embed.query("#_foo");
			res.attr("data-x", "f");
			doh.is("f", res.attr("data-x"));
		},
		
		function callAddClassFunction(){
			var res = embed.query("#_foo");
			res.addClass("f");
			doh.assertTrue(embed.hasClass(embed.query("#_foo")[0], "f"));
		},
		
		function callRemoveClassFunction(){
			var res = embed.query("#_foo");
			res.addClass("f");
			res.removeClass("f");
			doh.assertFalse(embed.hasClass(embed.query("#_foo")[0], "f"));
		}
	]
);
