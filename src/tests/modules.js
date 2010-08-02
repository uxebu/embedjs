addScript("_base/object.js");
addScript("_base/declare.js");
addScript("_base/lang.js");
//addScript("_base/html.js");
addScript("_base/string.js");
addScript("_base/deferred.js");
addScript("_base/array.js");
addScript("_base/connect.js");
addScript("_base/json.js");
addScript("io/script.js");

// html tests
addScript("_base/html/getHtml.php?id=html_id-test&file=id");
addScript("_base/html/id.js");

addScript("_base/html/getHtml.php?id=html_html-test&file=html");
addScript("_base/html/html.js");

addScript("_base/html/getHtml.php?id=html_element-test&file=element");
addScript("_base/html/element.js");

addScript("_base/html/getHtml.php?id=html_query-test&file=query");
addScript("_base/html/query.js");

addScript("_base/html/getHtml.php?id=html_xhr-test&file=xhr");
addScript("_base/html/xhr.js");


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

// Lets store some stats in here.
doh._stats = {
	groups:[],
	groupsByName:{} // Store refs to the group here.
};
doh._groupStarted = function(group){
	if (typeof this._stats.groupsByName[group]=="undefined"){
		var groupData = {name:group, numTests:0, numFailures:0};
		this._stats.groups.push(groupData);
		this._stats.groupsByName[group] = groupData;
	}
	
	doh.infoNode.innerHTML = "Testing group " + this._stats.groups.length + "/" + this._groupCount + ": " + group;
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
	var curGroup = this._stats.groupsByName[group];
	var percentFailures = parseInt(curGroup.numFailures/curGroup.numTests*100, 10);
	var link = doh._groupResultNodes[group].outer.getElementsByTagName("a");
	if (link.length>0){
		link[0].setAttribute("style", "width:" + percentFailures + "%");
	}
}

doh._testStarted = function(group, fixture){
	doh._currentTestName = fixture.name;
}

doh._testFinished = function(group, fixture, success){
	var curGroup = this._stats.groupsByName[group];
	curGroup.numTests++;
	var html = '<div ';
	var resultString = success ? 'passed' : 'failed';
	var id = '';
	
	html += 'class="' + resultString + '" ';
	if(!success){
		curGroup.numFailures++;
		id = ( group + '-' + fixture.name ).replace(/'|"/g,"");
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
	
	doh.infoNode.innerHTML = 'Tests finished.';
	dojo.body().innerHTML = "";
	dojo.body().appendChild(doh.resultsNode);
}

// test box setup

doh._testBoxes = {};

doh.showBox = function(id){
	dojo.body().innerHTML = doh._testBoxes[id];
};

doh.registerTestBox = function(id, html){
	doh._testBoxes[id] = html;
};

doh.fileLoaded = function(id, data){
	doh.registerTestBox(id, data.html);
}


setTimeout(function(){
	//doh.resultsNode = document.getElementById('results');
	doh._docFragment = document.createDocumentFragment();
	doh.resultsNode = document.createElement('pre');
	doh.resultsNode.id = "results";
	doh._docFragment.appendChild(doh.resultsNode);
	doh.infoNode = document.getElementById("statusInfo");
	
	doh.run();
	doh.infoNode.innerHTML = "Running tests ...";
}, 200); // Just to be sure ...
