// This test group tests class methods.

tests.register("html-class", 
	[
		function _start(t){
			doh.showBox('class+style.html');
		},
		
		function testClassFunctions(t){
			var node = dojo.byId("sq100");
			dojo.addClass(node, "a");
			doh.is("a", node.className, "class is a");
			dojo.removeClass(node, "c");
			doh.is("a", node.className, "class is still a");
			t.assertTrue(dojo.hasClass(node, "a"), "class is a, test for a");
			t.assertFalse(dojo.hasClass(node, "b"), "class is a, test for b");
			dojo.addClass(node, "b");
			doh.is("a b", node.className, "class is a b");
			t.assertTrue(dojo.hasClass(node, "a"), "class is a b, test for a");
			t.assertTrue(dojo.hasClass(node, "b"), "class is a b, test for b");
			dojo.removeClass(node, "a");
			doh.is("b", node.className, "class is b");
			t.assertFalse(dojo.hasClass(node, "a"), "class is b, test for a");
			t.assertTrue(dojo.hasClass(node, "b"), "class is b, test for b");
			dojo.toggleClass(node, "a");
			doh.is("b a", node.className, "class is b a");
			t.assertTrue(dojo.hasClass(node, "a"), "class is b a, test for a");
			t.assertTrue(dojo.hasClass(node, "b"), "class is b a, test for b");
			dojo.toggleClass(node, "a");
			doh.is("b", node.className, "class is b (again)");
			t.assertFalse(dojo.hasClass(node, "a"), "class is b (again), test for a");
			t.assertTrue(dojo.hasClass(node, "b"), "class is b (again), test for b");
			dojo.toggleClass(node, "b");
			doh.is("", node.className, "class is blank");
			t.assertFalse(dojo.hasClass(node, "a"), "class is blank, test for a");
			t.assertFalse(dojo.hasClass(node, "b"), "class is blank, test for b");
			dojo.removeClass(node, "c");
			t.assertTrue(!node.className, "no class");
		},
		function testAddClassMultiple(t){
			var node = dojo.byId("sq100");
			dojo.addClass(node, "a");
			t.is("a", node.className, "class is a");
			dojo.addClass(node, "a b");
			t.is("a b", node.className, "class is a b");
			dojo.addClass(node, "b a");
			t.is("a b", node.className, "class is still a b");
			dojo.addClass(node, ["a", "c"]);
			t.is("a b c", node.className, "class is a b c");
			dojo.addClass(node, "d e "); // Trailing slash used to hurt.
			t.is("a b c d e", node.className, "class is a b c d e");
			dojo.addClass(node, "testing");
			t.is("a b c d e testing", node.className, "class is testing");
		},
		function testRemoveClassMultiple(t){
			var node = dojo.byId("sq100");
			dojo.removeClass(node, "testing");
			t.is("a b c d e", node.className, "class is a b c");
			dojo.removeClass(node, "d e ");
			t.is("a b c", node.className, "class is a b c");
			dojo.removeClass(node, "c a");
			t.is("b", node.className, "class is b");
			dojo.removeClass(node);
			t.is("", node.className, "empty class");
			dojo.addClass(node, "  c   b   a ");
			t.is("c b a", node.className, "class is c b a");
			dojo.removeClass(node, " c b ");
			t.is("a", node.className, "class is a");
			dojo.removeClass(node, ["a", "c"]);
			t.is("", node.className, "empty class");
		}
	]
);
