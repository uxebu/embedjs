require.def("tests/modules", ["tests/runner-embed",
	"tests/_base/array",
	"tests/_base/lang",
	"tests/_base/object"                           
], function(){
	

// dojo stubs
/*
dojo.provide = function(objString){
	dojo.setObject(objString);
};
*/

doh.debug = function(){
	// summary:
	//		takes any number of arguments and sends them to whatever debugging
	//		or logging facility is available in this environment
	
	var msg = "";
	for(var i = 0, m = arguments.length; i < m; i++){
		msg += arguments[i] + " ";
	}
	//console.log(msg);
	doh.resultsNode.innerHTML += ( "<div>" + msg + "</div>" );
};


require.ready(function(){
	doh.resultsNode = document.getElementById('results');
	doh.run();
});
	

});