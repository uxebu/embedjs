dojo.Deferred = dojo.Promise;

dojo.extend(dojo.Deferred, {
	callback: function(value){
		this.resolve(value);
	},
	errback: function(error){
		this.reject(error);
	},
	addCallbacks: function(/*Function?*/callback, /*Function?*/errback){
		this.then(callback, errback, dojo.__mutator);
		return this;
	},
	addCallback: function (/*Function*/callback) {
		return this.addCallbacks(dojo.hitch.apply(dojo, arguments));
	},

	addErrback: function (/*Function*/errback) {
		return this.addCallbacks(null, dojo.hitch.apply(dojo, arguments));
	},

	addBoth: function (/*Function*/callback) {
		var enclosed = dojo.hitch.apply(dojo, arguments);
		return this.addCallbacks(enclosed, enclosed);
	},
	fired: -1
});