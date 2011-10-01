define(['embed'], function(embed){

	embed.when = function(promiseOrValue, /*Function?*/callback, /*Function?*/errback, /*Function?*/progressHandler){
		// summary:
		//		This provides normalization between normal synchronous values and 
		//		asynchronous promises, so you can interact with them in a common way
		//	example:
		//		|	function printFirstAndList(items){
		//		|		dojo.when(findFirst(items), console.log);
		//		|		dojo.when(findLast(items), console.log);
		//		|	}
		//		|	function findFirst(items){
		//		|		return dojo.when(items, function(items){
		//		|			return items[0];
		//		|		});
		//		|	}
		//		|	function findLast(items){
		//		|		return dojo.when(items, function(items){
		//		|			return items[items.length];
		//		|		});
		//		|	}
		//		And now all three of his functions can be used sync or async.
		//		|	printFirstAndLast([1,2,3,4]) will work just as well as
		//		|	printFirstAndLast(dojo.xhrGet(...));
		
		if(promiseOrValue && typeof promiseOrValue.then === "function"){
			return promiseOrValue.then(callback, errback, progressHandler);
		}
		return callback(promiseOrValue);
	};
	
	return embed;

});
