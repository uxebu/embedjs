tests.register("connect-connect",
	[
		function smokeTest(t){
			// foo sets ok to false
			var ok = false;
			var foo = { "foo": function(){ ok=false; } };
			// connected function sets ok to true
			dojo.connect(foo, "foo", null, function(){ ok=true; });
			foo.foo();
			t.is(true, ok);
		},
		function basicTest(t) {
			var out = '';
			var obj = {
				foo: function() {
					out += 'foo';
				},
				bar: function() {
					out += 'bar';
				},
				baz: function() {
					out += 'baz';
				}
			};
			//
			var foobar = dojo.connect(obj, "foo", obj, "bar");
			dojo.connect(obj, "bar", obj, "baz");
			//
			out = '';
			obj.foo();
			t.is('foobarbaz', out);
			//
			out = '';
			obj.bar();
			t.is('barbaz', out);
			//
			out = '';
			obj.baz();
			t.is('baz', out);
			//
			dojo.connect(obj, "foo", obj, "baz");
			dojo.disconnect(foobar);
			//
			out = '';
			obj.foo();
			t.is('foobaz', out);
			//
			out = '';
			obj.bar();
			t.is('barbaz', out);
			//
			out = '';
			obj.baz();
			t.is('baz', out);
		},
		function args4Test(t){
			// standard 4 args test
			var ok, obj = { foo: function(){ok=false;}, bar: function(){ok=true} };
			dojo.connect(obj, "foo", obj, "bar");
			obj.foo();
			t.is(true, ok);
		},
		function args3Test(t){
			// make some globals
			var ok;
			dojo.global["gFoo"] = function(){ok=false;};
			dojo.global["gOk"] = function(){ok=true;};
			// 3 arg shorthand for globals (a)
			var link = dojo.connect("gFoo", null, "gOk");
			gFoo();
			dojo.disconnect(link);
			t.is(true, ok);
			// 3 arg shorthand for globals (b)
			link = dojo.connect(null, "gFoo", "gOk");
			gFoo();
			dojo.disconnect(link);
			t.is(true, ok);
			// verify disconnections 
			gFoo();
			t.is(false, ok);
		},
		function args2Test(t){
			// make some globals
			var ok;
			dojo.global["gFoo"] = function(){ok=false;};
			dojo.global["gOk"] = function(){ok=true;};
			// 2 arg shorthand for globals 
			var link = dojo.connect("gFoo", "gOk");
			gFoo();
			dojo.disconnect(link);
			t.is(true, ok);
			// 2 arg shorthand for globals, alternate scoping 
			link = dojo.connect("gFoo", gOk);
			gFoo();
			dojo.disconnect(link);
			t.is(true, ok);
		},
		function scopeTest1(t){
			var foo = { ok: true, foo: function(){this.ok=false;} };
			var bar = { ok: false, bar: function(){this.ok=true} };
			// link foo.foo to bar.bar with natural scope
			var link = dojo.connect(foo, "foo", bar, "bar");
			foo.foo();
			t.is(false, foo.ok);
			t.is(true, bar.ok);
		},		
		function scopeTest2(t){
			var foo = { ok: true, foo: function(){this.ok=false;} };
			var bar = { ok: false, bar: function(){this.ok=true} };
			// link foo.foo to bar.bar such that scope is always 'foo'
			var link = dojo.connect(foo, "foo", bar.bar);
			foo.foo();
			t.is(true, foo.ok);
			t.is(false, bar.ok);
		},
		/* No connectPublisher in API
		function connectPublisher(t){
			var foo = { inc: 0, foo: function(){ this.inc++; } };
			var bar = { inc: 0, bar: function(){ this.inc++; } };
			var c1h = dojo.connectPublisher("/blah", foo, "foo");
			var c2h = dojo.connectPublisher("/blah", foo, "foo");
			dojo.subscribe("/blah", bar, "bar");
			foo.foo();
			t.is(1, foo.inc);
			t.is(2, bar.inc);
			dojo.disconnect(c1h);
			foo.foo();
			t.is(2, foo.inc);
			t.is(3, bar.inc);
			dojo.disconnect(c2h);
			foo.foo();
			t.is(3, foo.inc);
			t.is(3, bar.inc);
		}*/
	]
);
