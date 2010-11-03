var delay = function(ms){
	var d = new dojo.Promise();
	setTimeout(function(){
		d.progress(0.5);
	},ms/2);
	setTimeout(function(){
		d.resolve();
	},ms);
	return d.promise;
};

doh.register("async-promise", 
	[
		function simpleThen(t){
			var td = new doh.Deferred();
			delay().then(function(){
				td.callback(true);
			});
			return td;
		},
		function thenChaining(t){
			var td = new doh.Deferred();
			var p = delay();
			var p2 = p.then(function(){
				return 1;
			});
			p3 = p2.then(function(){
				return 2;
			});
			p3.then(function(){
				p2.then(function(v){
					t.assertEqual(v, 1);
					p3.then(function(v){
						t.assertEqual(v, 2);
						td.callback(true);
					});
				});
			});
			return td;
		},
		function errorHandler(t){
			var def = new dojo.Promise();
			var handledError;
			dojo.config.deferredOnError = function(e){
				handledError = e;
			};
			def.reject(new Error("test"));
			t.t(handledError instanceof Error);
		},
		function cancelThenDerivative(t){
			var def = new dojo.Promise();
			var def2 = def.then();
			try{
				def2.cancel();
				t.t(true); // Didn't throw an error
			}catch(e){
				t.t(false);
			}
		},
		function cancelPromiseValue(t){
			var cancelledDef;
			var def = new dojo.Promise(function(_def){ cancelledDef = _def; });
			def.promise.cancel();
			t.is(def, cancelledDef);
		},
		function errorResult(t){
			var def = new dojo.Promise();
			var result = new Error("rejected");
			def.reject(result);
			t.is(def.fired, 1);
			t.is(def.results[1], result);
		},
		function globalLeak(t){
			var def = new dojo.Promise();
			def.then(function(){ return def; });
			def.resolve(true);
			t.is(dojo.global.results, undefined, "results is leaking into global");
			t.is(dojo.global.fired, undefined, "fired is leaking into global");
		}
	]
);