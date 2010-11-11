tests.register("lang-mixin", 
	[
		function mixin(t){
			t.assertEqual("object", typeof dojo.mixin());
			t.assertEqual("object", typeof dojo.mixin(undefined));
			t.assertEqual("object", typeof dojo.mixin(null));
			var src = {
				foo: function(){
					t.debug("foo");
				},
				bar: "bar"
			};
			var dest = {};
			dojo.mixin(dest, src);
			t.assertEqual("function", typeof dest["foo"]);
			t.assertEqual("string", typeof dest["bar"]);
		}
	]
);