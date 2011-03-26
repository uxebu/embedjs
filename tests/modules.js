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
		var groupData = {name:group, numTests:0, numFailures:0, startTime: (new Date()).getTime()};
		this._stats.groups.push(groupData);
		this._stats.groupsByName[group] = groupData;
	}
	
	document.title = "Testing group " + this._stats.groups.length + "/" + this._groupCount + ": " + group;
	doh.infoNode && (doh.infoNode.innerHTML = document.title);
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
	if(typeof this._stats.groupsByName[group].endTime != 'undefined'){ // this gets called twice
		return;
	}
	var end = (new Date()).getTime();
	this._stats.groupsByName[group].endTime = end;
	this._stats.groupsByName[group].elapsed = end - this._stats.groupsByName[group].startTime;
	var cg = doh._groups[group];
	var percentFailures = cg.failures / cg.length * 100;
	var link = doh._groupResultNodes[group].outer.getElementsByTagName("a");
	if (link.length>0){
		link[0].style.width = parseInt(percentFailures) + "%"; // setAttribute() fails on WP7 with IE7, so use style attribute directly. grrr
		link[0].innerHTML += " <span>(Passed "+ ( cg.length - cg.failures ) + " tests of " + cg.length + ", elapsed time: " + this._stats.groupsByName[group].elapsed + "ms)</span>"
	}
}

doh._testStarted = function(group, fixture){
	doh._currentTestName = fixture.name;
}

doh._testFinished = function(group, fixture, success){
	if(fixture.name == '_start'){
		return;
	}
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
	
	var percentFailures = (this._errorCount+this._failureCount) / this._testCount * 100;
	var link = doh._groupResultNodes[group].outer.getElementsByTagName("a");
	if (link.length>0){
		link[0].setAttribute("style", "width:" + percentFailures + "%");
		//link[0].innerHTML += " <span>(Passed "+ ( cg.length - cg.failures ) + " tests of " + cg.length + ", elapsed time: " + this._stats.groupsByName[group].elapsed + "ms)</span>"
	}
	
	doh._groupResultNodes[group].inner.innerHTML += ( '<div>' + this._testCount + ' tests in ' + this._groupCount + ' groups.</div>' );
	doh._groupResultNodes[group].inner.innerHTML += ( '<div>' + this._errorCount + ' errors.</div>' );
	doh._groupResultNodes[group].inner.innerHTML += ( '<div>' + this._failureCount + ' failures.</div>' );
	
	var totalTime = 0;
	for (var i=0, l=this._stats.groups.length, g; i<l; i++){
		g = this._stats.groups[i];
		g.elapsed && ( totalTime += g.elapsed);
	}
	doh._groupResultNodes[group].inner.innerHTML += ( '<div>Time: ' + totalTime + 'ms.</div>' );
	
	doh._groupResultNodes[group].outer.className += ( ( this._errorCount + this._failureCount == 0 ) ? ' passed' : ' failed' );
	
	document.title = 'Tests finished.';
	doh.infoNode && (doh.infoNode.innerHTML = document.title);
	//dojo.body().innerHTML = "";
	//dojo.body().appendChild(doh.resultsNode);
	document.body.innerHTML = "";
	document.body.appendChild(doh.resultsNode);
}

// test box setup

doh._testBoxes = {};

doh.showBox = function(id){
	//dojo.body().innerHTML = doh._testBoxes[id];
	document.body.innerHTML = doh._testBoxes[id];
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
	doh.resultsNode.id = "resultsNode";
	doh._docFragment.appendChild(doh.resultsNode);
	doh.infoNode = document.getElementById("statusInfo");
	
	doh.run();
	document.title = "Running tests ...";
	doh.infoNode && (doh.infoNode.innerHTML = document.title);
}, 200); // Just to be sure ...

//*/