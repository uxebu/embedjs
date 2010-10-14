tests.register("tests.lang.hitch", 
	[
		function hitch(t){
			var scope = { foo: "bar" };
			var scope2 = { foo: "baz" };
			function thinger(){
				return [this.foo, arguments.length];
			}
			
			var st1 = dojo.hitch(scope, thinger);
			t.assertEqual("bar", st1()[0]);
			t.assertEqual(0, st1()[1]);

			var st2 = dojo.hitch(scope2, thinger);
			t.assertEqual("baz", st2()[0]);
			t.assertEqual(0, st1()[1]);
			t.assertEqual(1, st1("blah")[1]);

			// st2 should be "scope proof"
			t.assertEqual("baz", st2.call(scope)[0]);
		},

		function hitchWithArgs(t){
			var scope = { foo: "bar" };
			var scope2 = { foo: "baz" };
			function thinger(){
				return [this.foo, arguments.length];
			}
			
			var st1 = dojo.hitch(scope, thinger, "foo", "bar");
			t.assertEqual("bar", st1()[0]);
			t.assertEqual(2, st1()[1]);
			var st2 = dojo.hitch(scope2, thinger, "foo", "bar");
			t.assertEqual("baz", st2()[0]);
			t.assertEqual(2, st2()[1]);
		},
		
		/* no partial
		
		function hitchAsPartial(t){
			var scope = { foo: "bar" };
			var scope2 = { foo: "baz" };
			function thinger(arg1, arg2){
				return [this.foo, arg1, arg2];
			}
			
			var st1 = dojo.hitch(null, thinger);
			t.assertEqual("bar", st1.call(scope)[0]);
			t.assertEqual(undefined, st1()[0]);
			var st2 = dojo.hitch(null, thinger, "foo", "bar");
			t.assertEqual("bar", st2()[2]);
			var st3 = dojo.hitch(null, thinger, "foo", "bar");
		},
		
		*/
	]
);