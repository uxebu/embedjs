tests.register("lang.toArray", 
	[

		
		/* no partial in embed API
		
		function partial(t){
			var scope = { foo: "bar" };
			var scope2 = { foo: "baz" };
			function thinger(arg1, arg2){
				return [this.foo, arg1, arg2];
			}
			
			var st1 = dojo.partial(thinger);
			t.assertEqual("bar", st1.call(scope)[0]);
			t.assertEqual(undefined, st1()[0]);
			var st2 = dojo.partial(thinger, "foo", "bar");
			t.assertEqual("bar", st2()[2]);
			var st3 = dojo.partial(thinger, "foo", "bar");
		},

		function nestedPartial(t){
			function thinger(arg1, arg2){
				return [arg1, arg2];
			}
			
			var st1 = dojo.partial(thinger, "foo");
			t.assertEqual(undefined, st1()[1]);
			t.assertEqual("bar", st1("bar")[1]);

			// partials can accumulate
			var st2 = dojo.partial(st1, "thud");
			t.assertEqual("foo", st2()[0]);
			t.assertEqual("thud", st2()[1]);
		},
		
		*/

		function _toArray(t){
			var obj1 = [ 'foo', 'bar', 'spam', 'ham' ];

			function thinger(){
				return dojo._toArray(arguments);
			}
			var obj2 = thinger.apply(this, obj1);
			t.assertEqual(obj1[0], obj2[0]);

			if(dojo.isBrowser){
				//test DomCollection
				var div = document.createElement('div');
				div.innerHTML="<a href='#'>link</a>text";
				var r=dojo._toArray(div.childNodes);
				t.is(2,r.length);
			}
		},
		
		
	]
);
