;(function(){
	var slice = [].slice;
  var push = [].push;
  
	// Remember the old query function, so we can still call it.
	var _oldQuery = embed.query;
	// Override embed.query() with a chainable version of itself.
	embed.query = function(query, scope){
		return new embed.ChainableNodeArray(_oldQuery.apply(embed, arguments));
	};

	// Extend the Array prototype for the ChainableNodeArray to provide all methods that
	// are reachable by chainable functions.
	embed.ChainableNodeArray = function(arr){
		//var ret = Array.apply(null, arr);
		// "arr" is a NodeList object and WebKit is not able to use that as parameters to push(), ff can though.
		// So let's explicitly convert the NodeList into an array.
		var ret = slice.call(arr);
		makeChainable(ret);
		return ret;
	};

	function makeChainable(obj){
		// add chained functions
		embed.forEach(
			["attr", "addClass", "connect", "removeAttr", "removeClass", "style", "toggleClass", "place"],
			function(func){
				this[func] = function(){
					var argsAsArray = slice.call(arguments); // Convert arguments into an array, so we can use cancat() on it.
					argsAsArray.unshift(null); // creating space needed later for `node` argument
					for (var i=0, l=this.length; i<l; i++){
						// "this[i]" is the current node, since this is the array we are in, the array with all the nodes query() returned.
						// we're adding it as first argument
						argsAsArray[0] = this[i];
						embed[func].apply(embed, argsAsArray);
					}
					return this; // Return the chainable object
				}
			},
			obj
		);

		// The array functions shall also always be enabled! Even the natively implemented once we have to convert their
		// results back to a ChainableNodeArray.
		embed.forEach(
			["forEach", "map", "some", "every", "filter"],
			function(func){
				this[func] = function(){
					var argsAsArray = slice.call(arguments); // Convert arguments into an array
					argsAsArray.unshift(this); // unshifting `this`, so it is used as first argument
					var ret = embed[func].apply(embed, argsAsArray);
					// The result we get returned above is a native array, let's convert
					// it into a chainable one again so the chaining can go on.

					// `some` and `every` return a boolean, `map` and `filter` return an array, `forEach` returns undefined
					// if return value is an array, return a new chainable, else return the return value
					if(ret && "length" in ret){ //TODO: add dependency to embed.is (embed.isArray)?
						return new embed.ChainableNodeArray(ret);
					}
					return ret;
				}
			},
			obj
		);
		
		// enable sub selects (e.g. for filtering)
		obj.query = function(query){
		  var ret = [];
		  embed.forEach(
		    this,
		    function(parentNode){
		      // make a query with the current node as its scope, push all selected nodes to the result array
  		    push.apply(ret, slice.call(embed.query(query, parentNode)));
		    }
		  );
		  makeChainable(ret);
		  return ret;
		};
	}
})();
