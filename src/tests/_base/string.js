require.def("tests/_base/string", [], function(){

tests.register("tests._base.string",
	[
		
		function test_trim(t){
			t.is("astoria", dojo.trim("   \f\n\r\t      astoria           "));
			t.is("astoria", dojo.trim("astoria                            "));
			t.is("astoria", dojo.trim("                            astoria"));
			t.is("astoria", dojo.trim("astoria"));
			t.is("a", dojo.trim("   a   "));
		}
	]
);

});