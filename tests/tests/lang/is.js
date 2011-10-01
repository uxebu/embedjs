tests.register("lang-is", 
	[
		function isFunction(t){
			t.assertTrue(dojo.isFunction(new Function()));
			t.assertTrue(dojo.isFunction(isFunction));
			t.assertFalse(dojo.isFunction(dojo.doc.getElementsByName("html")));
			t.assertFalse(dojo.isFunction(dojo.doc.createElement("object")));
		},

		function isObject(t){
			t.assertFalse(dojo.isObject(true));
			t.assertFalse(dojo.isObject(false));
			t.assertFalse(dojo.isObject("foo"));
			t.assertTrue(dojo.isObject(new String("foo")));
			t.assertTrue(dojo.isObject(null));
			t.assertTrue(dojo.isObject({}));
			t.assertTrue(dojo.isObject([]));
			t.assertTrue(dojo.isObject(new Array()));
		},

		function isArray(t){
			t.assertTrue(dojo.isArray([]));
			t.assertTrue(dojo.isArray(new Array()));
			t.assertFalse(dojo.isArray({}));
		},

		function isArrayLike(t){
			t.assertFalse(dojo.isArrayLike("thinger"));
			t.assertTrue(dojo.isArrayLike(new Array()));
			t.assertFalse(dojo.isArrayLike({}));
			t.assertTrue(dojo.isArrayLike(arguments));
		},

		function isString(t){
			t.assertFalse(dojo.isString(true));
			t.assertFalse(dojo.isString(false));
			t.assertTrue(dojo.isString("foo"));
			t.assertTrue(dojo.isString(new String("foo")));
			t.assertFalse(dojo.isString(null));
			t.assertFalse(dojo.isString({}));
			t.assertFalse(dojo.isString([]));
		},
	]
);