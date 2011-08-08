hub = function(){
}

failures = 0;
bad = function(){
	failures++;
}

good = function(){
}

// make 'iterations' connections to hub
// roughly half of which will be to 'good' and 
// half to 'bad'
// all connections to 'bad' are disconnected
// test can then be performed on the values
// 'failures' and 'successes'
markAndSweepTest = function(iterations){
	var marked = [];
	// connections
	for(var i=0; i<iterations; i++){
		if(Math.random() < 0.5){
			marked.push(dojo.connect('hub', bad));
		}else{
			dojo.connect('hub', good);
		}
	}
	// Randomize markers (only if the count isn't very high)
	if(i < Math.pow(10, 4)){
		var rm = [ ];
		while(marked.length){
			var m = Math.floor(Math.random() * marked.length);
			rm.push(marked[m]);
			marked.splice(m, 1);
		}
		marked = rm;				
	} 
	for(var m=0; m<marked.length; m++){
		dojo.disconnect(marked[m]);
	}
	// test
	failures = 0;
	hub();
	// return number of disconnected functions that fired (should be 0)
	return failures;
}

markAndSweepSubscribersTest = function(iterations){
	var topic = "hubbins";
	var marked = [];
	// connections
	for(var i=0; i<iterations; i++){
		if(Math.random() < 0.5){
			marked.push(dojo.subscribe(topic, bad));
		}else{
			dojo.subscribe(topic, good);
		}
	}
	// Randomize markers (only if the count isn't very high)
	if(i < Math.pow(10, 4)){
		var rm = [ ];
		while(marked.length){
			var m = Math.floor(Math.random() * marked.length);
			rm.push(marked[m]);
			marked.splice(m, 1);
		}
		marked = rm;				
	} 
	for(var m=0; m<marked.length; m++){
		dojo.unsubscribe(marked[m]);
	}
	// test
	failures = 0;
	dojo.publish(topic);
	// return number of unsubscribed functions that fired (should be 0)
	return failures;
}

tests.register("connect-pubsub",
	[
		function hubConnectDisconnect1000(t){
			t.is(0, markAndSweepTest(1000));
		},

		function publishSubscribe1000(t){
			t.is(markAndSweepSubscribersTest(1000), 0);
		}
	]
);
