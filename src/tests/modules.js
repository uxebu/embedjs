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
	//doh.resultsNode.innerHTML += ( "<div>" + msg + "</div>" );
};

// group result logging
doh._groupResultNodes = {};

doh._groupStarted = function(group){
	if(!doh._groupResultNodes[group]){
		var node = document.createElement('div');
		doh.resultsNode.appendChild(node);
		node.innerHTML = '<h1>' + group + '</h1>';
		node.className = 'groupResults'
		var inner = document.createElement('div');
		inner.className = "inner";
		node.appendChild(inner);
		doh._groupResultNodes[group] = { outer: node, inner: inner };
	}
}

doh._groupFinished = function(group, success){
	doh._groupResultNodes[group].outer.className += success ? ' passed' : ' failed';
}

doh._testStarted = function(group, fixture){
}

doh._testFinished = function(group, fixture, success){	
	doh._groupResultNodes[group].inner.innerHTML += ( '<div class="' + (success ? 'passed' : 'failed') + '">' + fixture.name + ': ' + (success ? 'passed' : 'failed') + '</div>' );
}

// report

doh._report = function(){
	
	group = "Tests finished. Summary:";
	doh._groupStarted(group);
	doh._groupResultNodes[group].outer.className += ' summary';
	
	doh._groupResultNodes[group].inner.innerHTML += ( '<div>' + this._testCount + ' tests in ' + this._groupCount + ' groups.</div>' );
	doh._groupResultNodes[group].inner.innerHTML += ( '<div>' + this._errorCount + ' errors.</div>' );
	doh._groupResultNodes[group].inner.innerHTML += ( '<div>' + this._failureCount + ' failures.</div>' );
	
	doh._groupResultNodes[group].outer.className += ( ( this._errorCount + this._failureCount == 0 ) ? ' passed' : ' failed' );
}

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