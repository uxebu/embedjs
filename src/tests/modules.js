require.def("tests/modules", ["tests/runner-embed",
	"tests/_base/object",
	"tests/_base/declare",
	"tests/_base/lang",
	"tests/_base/html",
	"tests/_base/string",
	"tests/_base/deferred",
	"tests/_base/array",
	"tests/_base/connect",
	"tests/_base/json",
	"tests/io/script"
], function(){


doh.debug = function(){
	var msg = "";
	for(var i = 0, m = arguments.length; i < m; i++){
		msg += arguments[i] + " ";
	}
	//console.log(msg);
	doh.resultsNode.innerHTML += ( "<div>" + msg + "</div>" );
};

// test box setup

doh._testBoxes = {};

doh.showBox = function(id){
	var parent = dojo.byId("testBoxContainer");
	parent.innerHTML = doh._testBoxes[id];
	
};

doh.registerTestBox = function(id, html){
	doh._testBoxes[id] = html;
};


require.ready(function(){
	
	// We want the html tests to stay in our testBoxContainer.
	doh.testNode = document.getElementById('testBoxContainer');
	dojo.body = function(){
		return doh.testNode;
	};
	
	doh.resultsNode = document.getElementById('results');
	doh.run();
});
	

});