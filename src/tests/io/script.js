require.def("tests/io/script", [], function(){

tests.register("tests.io.script", 
	[
	 	/* load option not supported by API
		function ioScriptLoad(t){
			//t.is("undefined", typeof(scriptLoad));
			var d = new doh.Deferred();
			var td = dojo.io.script.get({
				url: "scriptLoad.js"
			});
			td.addBoth(function(res){
				if(typeof(scriptLoad) != "undefined"
					&& t.is("loaded", scriptLoad)){
					d.callback(true);
				}else{
					d.errback(false);
				}
			});
			return d;
		},
		*/
		/* checkstring option not supported by API
		function ioScriptSimple(t){
			var d = new doh.Deferred();
			var td = dojo.io.script.get({
				url: "scriptSimple.js",
				checkString: "myTasks"
			});
			td.addBoth(function(res){
				if(typeof(myTasks) != "undefined"
					&& t.is("Do dishes.", myTasks[1])){
					d.callback(true);
				}else{
					d.errback(false);
				}
			});
			return d;
		},
		*/
		function ioScriptJsonp(t){
			var d = new doh.Deferred();
			var td = dojo.io.script.get({
				url: "io/scriptJsonp.js",
				content: { foo: "bar" },
				jsonp: "callback",
				handle: function(res, ioArgs){
					if(!(res instanceof Error) && 
							t.is("mammal", res.animalType)){
							d.callback(true);
						}else{
							d.errback(false);
						}
				}
			});
			return d;						
		},
		function ioScriptJsonpTimeout(t){
			var d = new doh.Deferred();
			var td = dojo.io.script.get({
				url: "_base/html/timeout.php",
				jsonp: "callback",
				content: {Foo: 'Bar'},
				timeout: 500,
				handleAs: "json",
				preventCache: true,
				handle: function(response, ioArgs){
					if(response instanceof Error && response.dojoType == "timeout"){
						console.debug("FOO OK TEST");
						d.callback(true);
					}else{
						console.debug("FOO FAIL TEST");
						d.errback(false);
					}
				}
			});
			return d;
		}
	]
);

});