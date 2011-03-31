;(function(){
	// Remember the old query function, so we can still call it.
	var _oldQuery = embed.query;
	// Override embed.query() with a chainable version of itself.
	embed.query = function(query, scope){
		return new embed.ChainableNodeArray(_oldQuery.apply(embed, arguments));
	};
	
	
	// Extend the Array prototype for the NodeList to provide all methods that
	// are reachable by chainable functions.
	embed.ChainableNodeArray = function(arr){
		var ret = []; // For some reason Array.apply(null, arguments) didn't work, so we push all from arr handish into ret, down there.
		enhanceNodeList(ret);
		if (arr){
			for (var i=0, l=arr.length; i<l; i++){
				ret.push(arr[i]);
			}
		}
		return ret;
	};
	
	function enhanceNodeList(obj){
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
		//// The array funciton shall also always be enabled! If natively implemented we leave them out.
		//var arrayFunctions = ["forEach", "map", "some", "every", "filter"];
		//for (var i=0, l=arrayFunctions.length, func; i<l; i++){
		//	func = arrayFunctions[i];
		//	if (func in []) continue; // Don't override native array functions.
		//	obj[func] = (function(func){
		//		return function(){
		//			return embed[func].apply(embed, [this[i]].concat(argsAsArray));
		//		}
		//	})(func);
		//}
	}
})();

