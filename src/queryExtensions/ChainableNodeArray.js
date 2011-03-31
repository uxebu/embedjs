;(function(){
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
		var ret = [];
		// "arr" is a NodeList object and WebKit is not able to use that as parameters to push(), ff can though.
		// So let's explicitly convert the NodeList into an array.
		ret.push.apply(ret, Array.prototype.slice.call(arr, 0));
		makeChainable(ret);
		return ret;
	};
	
	function makeChainable(obj){
		var chainedFunctions = ["attr", "addClass", "connect", "removeAttr", "removeClass", "style", "toggleClass", "place"];
		for (var i=0, l=chainedFunctions.length, func; i<l; i++){
			func = chainedFunctions[i];
			// Create the functions on the object. I am sure this could be more efficiently done, i.e.
			// on the prototype. Feel free to optimize it!
			obj[func] = (function(func){
				return function(){
					var argsAsArray = [].splice.call(arguments,0); // Convert arguments into an array, so we can use cancat() on it.
					for (var i=0, l=this.length; i<l; i++){
						// Concatenate this[i]+arguments into one array to be able to pass them as ONE array.
						// "this[i]" is the current node, since this is the array we are in, the array with all the nodes query() returned.
						embed[func].apply(embed, [this[i]].concat(argsAsArray));
					}
					return this; // Return the last return value.
				}
			})(func);
		}
		
		// The array functions shall also always be enabled! Even the natively implemented once we have to convert their
		// results back to a ChainableNodeArray.
		var arrayFunctions = ["forEach", "map", "some", "every", "filter"];
		for (var i=0, l=arrayFunctions.length, func; i<l; i++){
			func = arrayFunctions[i];
			obj[func] = (function(func){
				return function(){
					var argsAsArray = [].splice.call(arguments,0); // Convert arguments into an array, so we can use cancat() on it.
					var ret = embed[func].apply(embed, [this].concat(argsAsArray));
					// The result we get returned above is a native array, let's convert
					// it into a chainable one again so the chaining can go on.
					return new embed.ChainableNodeArray(ret);
				}
			})(func);
		}
	}
})();

