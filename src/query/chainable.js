;(function(){
	
	var _oldQuery = embed.query;
	
	embed.query = function(query, scope){
		return new NodeList(_oldQuery.apply(embed, arguments));
	}
	
	// Extend the Array prototype for the NodeList to provide all methods that
	// are reachable by chainable functions.
	var NodeList = function(arr){
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
		var chainedFunctions = "attr addClass connect removeAttr removeClass style toggleClass place".split(" ");
		for (var i=0, l=chainedFunctions.length, func; i<l; i++){
			func = chainedFunctions[i];
			// Create the functions on the object. I am sure this could be more efficiently done, i.e.
			// on the prototype. Feel free to optimize it!
			obj[func] = (function(func){
				return function(){
					var ret;
					for (var i=0, l=this.length; i<l; i++){
						// Concatenate this[i]+arguments into one array to be able to pass them as ONE array.
						var argsAsArray = [].splice.call(arguments,0); // Convert arguments into an array, so we can use cancat() on it.
						ret = embed[func].apply(embed, [this[i]].concat(argsAsArray));
					}
					return ret; // Return the last return value.
				}
			})(func);
		}
	}
	
})();