var f1fo = { 'blah': "blah" };
var f1foStr = "blah=blah";

var f2fo = { 
	blah: "blah",
	multi: [
		"thud",
		"thonk"
	],
	textarea: "textarea_value"
};
var f2foStr = "blah=blah&multi=thud&multi=thonk&textarea=textarea_value";

var f5fo = { 'bl\u00E5h': 'bl\u00E1h' };
var f5foStr = "bl%C3%A5h=bl%C3%A1h";

tests.register("uri",
	[
		function objectToQuery(t){
			t.is(f1foStr , dojo.objectToQuery(f1fo));
			t.is(f5foStr , dojo.objectToQuery(f5fo));
		}
		
		function objectToQueryArr(t){
			t.is(f2foStr, dojo.objectToQuery(f2fo));
		}
	]
);