tests.register("tests.oo.extend", 
	[
		function extend(t){
			var src = {
				foo: function(){
					t.debug("foo");
				},
				bar: "bar"
			};
			function dest(){}
			dojo.extend(dest, src);
			var test = new dest();
			t.assertEqual("function", typeof test["foo"]);
			t.assertEqual("string", typeof test["bar"]);
		},
	]
);