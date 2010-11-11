dojo.readyTestObj = {
	test1: function(){
		this._deferred.callback(true);
	}
};

tests.register("html-ready", 
	[
		function simpleReadyCall(t){
			var d = new doh.Deferred();
			dojo.ready(function(){
				d.callback(true);
			});
			return d;
		},
		
		function lateReadyCall(t){
			var d = new doh.Deferred();
			dojo.ready(function(){
				setTimeout(function(){
					dojo.ready(function(){
						d.callback(true);
					});
				}, 500);
			});
			return d;
		},
		
		function readyWithObject(t){
			dojo.readyTestObj._deferred = new doh.Deferred();
			dojo.ready(dojo.readyTestObj, "test1");
			
			return dojo.readyTestObj._deferred;
		}
	]
);