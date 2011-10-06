require(['feature!async-promise'], function(embed){
// To test this, we need a progress-capable
// promise implementation. There is a deferred
// impl in DOH, but that's not capable of emitting
// progress, so we use Embed's promise impl here.

var delay = function(ms){
	var d = new embed.Promise();
	setTimeout(function(){
		d.progress(0.5);
	},ms/2);
	setTimeout(function(){
		d.resolve();
	},ms);
	return d.promise;
};

doh.register("async-when", 
	[
		function simpleWhen(t){
			var td = new doh.Deferred();
			dojo.when(delay(), function(){
				td.callback(true);
			});
			return td;
		},
		function progress(t){
			var td = new doh.Deferred();
			var percentDone;
			dojo.when(delay(), function(){
				t.is(percentDone, 0.5);
				td.callback(true);
			},function(){},
			function(completed){
				percentDone = completed;
			});
			return td;
		}
	]
);

});