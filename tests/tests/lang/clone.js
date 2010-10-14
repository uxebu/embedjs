tests.register("tests.lang.clone", 
	[
		function clone(t) { 
			var obj1 = {
				foo: 'bar',
				answer: 42,
				jan102007: new Date(2007, 0, 10), 
				baz: {
					a: null, 
					b: [1, "b", 2.3, true, false],
					c: {
						d: undefined,
						e: 99,
						f: function(){ console.log(42); return 42; },
						g: /\d+/gm
					}
				},
				toString: function(){ return "meow"; }
			}; 
			var obj2 = dojo.clone(obj1);
			t.assertEqual(obj1.foo, obj2.foo);
			t.assertEqual(obj1.answer, obj2.answer);
			t.assertEqual(obj1.jan102007, obj2.jan102007);
			t.assertEqual(obj1.baz.a, obj2.baz.a);
			for(var i = 0; i < obj1.baz.b.length; ++i){
				t.assertEqual(obj1.baz.b[i], obj2.baz.b[i]);
			}
			t.assertEqual(obj1.baz.c.d, obj2.baz.c.d);
			t.assertEqual(obj1.baz.c.e, obj2.baz.c.e);
			t.assertEqual(obj1.baz.c.f, obj2.baz.c.f);
			t.assertEqual(obj1.baz.c.f(), obj2.baz.c.f());
			t.assertEqual(obj1.baz.c.g, obj2.baz.c.g);
			t.assertEqual(obj1.toString, obj2.toString);
			t.assertEqual(obj1.toString(), obj2.toString());
		},
	]
);