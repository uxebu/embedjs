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

// error reporting
doh._testMessages = {};
doh.debug = function(){
	if(!doh._currentTest){
		return;
	}
	
	//msg assembly
	var msg = "", section;
	for(var i = 0, m = arguments.length; i < m; i++){
		msg += arguments[i] + " ";
	}
	
	//section setup
	if(!doh._testMessages[doh._currentGroup]){
		doh._testMessages[doh._currentGroup] = {};
	}
	section = doh._testMessages[doh._currentGroup];
	if(!section[doh._currentTestName]){
		section[doh._currentTestName] = [];
	}
	section = section[doh._currentTestName];
	section.push(msg);
	
	//console.log(msg);
	//doh.resultsNode.innerHTML += ( "<div>" + msg + "</div>" );
};

// group result logging
doh._groupResultNodes = {};

doh._groupStarted = function(group){
	
	if(!doh._groupResultNodes[group]){
		var node = document.createElement('div');
		node.id = group;
		doh.resultsNode.appendChild(node);
		node.innerHTML = '<h1><a href="javascript:toggleInner(\''+group+'\');">' + group + '</a></h1>';
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
	doh._currentTestName = fixture.name;
}

doh._testFinished = function(group, fixture, success){	
	var html = '<div ';
	var resultString = success ? 'passed' : 'failed';
	var id = '';
	
	html += 'class="' + resultString + '" ';
	if(!success){
		id = ( group + '-' + fixture.name ).replace(/'/g,"");
		html += '><a href="javascript:showMessages(\''+ id +'\');"';
	}
	html += '>' + fixture.name;
	if(!success){
		html += '</a><div class="messages" id="'+id+'">' + doh._testMessages[group][fixture.name].join('<hr />') + '</div>';
	}
	html += '</div>';
	doh._groupResultNodes[group].inner.innerHTML += html;
		//( '<div onclick="showMessages();" class="' + (success ? 'passed' : 'failed') + '">' + fixture.name + ': ' + (success ? 'passed' : 'failed') + '</div>' );
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