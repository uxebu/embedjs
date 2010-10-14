tests.register("tests.oo.delegate", 
	[
		function delegate(t){
			var a = {
				x: 1,
				y: function(){ return 2; },
				z1: 99
			};
			var b = {
				x: 11,
				y: function(){ return 12; },
				z2: 33,
				toString: function(){ return "bark!"; },
				toLocaleString: function(){ return "le bark-s!"; }
			};
			t.is(1, a.x);
			t.is(2, a.y());
			t.is(99, a.z1);
			var c = dojo.delegate(a, b);
			t.is(1, a.x);
			t.is(2, a.y());
			t.is(99, a.z1);
			t.is(11, c.x);
			t.is(12, c.y());
			t.is("bark!", c.toString());
			t.is("le bark-s!", c.toLocaleString());
			t.is(99, c.z1);
			t.is(33, c.z2);
		}
	]
);