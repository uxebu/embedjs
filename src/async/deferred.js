define(['embed', 'feature!async-promise', 'feature!oo-extend', 'feature!lang-hitch'], function(embed){

	embed.Deferred = embed.Promise;

	embed.extend(embed.Deferred, {
		callback: function(value){
			this.resolve(value);
		},
		
		errback: function(error){
			this.reject(error);
		},
		
		addCallbacks: function(/*Function?*/callback, /*Function?*/errback){
			this.then(callback, errback, embed.__mutator);
			return this;
		},
		
		addCallback: function (/*Function*/callback) {
			return this.addCallbacks(embed.hitch.apply(embed, arguments));
		},
	
		addErrback: function (/*Function*/errback) {
			return this.addCallbacks(null, embed.hitch.apply(embed, arguments));
		},
	
		addBoth: function (/*Function*/callback) {
			var enclosed = embed.hitch.apply(embed, arguments);
			return this.addCallbacks(enclosed, enclosed);
		},
		
		fired: -1
	});
	
	return embed;

});
