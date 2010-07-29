require.def("tests/_base/string", [], function(){

tests.register("tests._base.string",
	[
		
		function test_trim(t){
			t.is("astoria", dojo.trim("   \f\n\r\t      astoria           "));
			t.is("astoria", dojo.trim("astoria                            "));
			t.is("astoria", dojo.trim("                            astoria"));
			t.is("astoria", dojo.trim("astoria"));
			t.is("a", dojo.trim("   a   "));
		},

		function replace(t){
			var s1 = dojo.replace("Hello, {name.first} {name.last} AKA {nick}!",
				{
					nick: "Bob",
					name: {
						first:  "Robert",
						middle: "X",
						last:   "Cringely"
					}
				});
			t.is("Hello, Robert Cringely AKA Bob!", s1);

			var s2 = dojo.replace("Hello, {0} {2}!", ["Robert", "X", "Cringely"]);
			t.is("Hello, Robert Cringely!", s2);

			function sum(a){
				var t = 0;
				dojo.forEach(a, function(x){ t += x; });
				return t;
			}
			var s3 = dojo.replace(
				"{count} payments averaging {avg} USD per payment.",
				dojo.hitch(
					{ payments: [11, 16, 12] },
					function(_, key){
						switch(key){
							case "count": return this.payments.length;
							case "min":   return Math.min.apply(Math, this.payments);
							case "max":   return Math.max.apply(Math, this.payments);
							case "sum":   return sum(this.payments);
							case "avg":   return sum(this.payments) / this.payments.length;
						}
						return "";
					}
				));
			t.is("3 payments averaging 13 USD per payment.", s3);

			var s4 = dojo.replace("Hello, ${0} ${2}!", ["Robert", "X", "Cringely"], /\$\{([^\}]+)\}/g);
			t.is("Hello, Robert Cringely!", s4);
		}
	]
);

});