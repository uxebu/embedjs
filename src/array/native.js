define(['embed'], function(embed){
	
	embed.indexOf = function(arr, value, fromIndex){
		// summary:
		//		locates the first index of the provided value in the
		//		passed array. If the value is not found, -1 is returned.
		// description:
		//		This method corresponds to the JavaScript 1.6 Array.indexOf method, with one difference: when
		//		run over sparse arrays, the EmbedJS function invokes the callback for every index whereas JavaScript
		//		1.6's indexOf skips the holes in the sparse array.
		//		For details on this method, see:
		//			https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/indexOf
		// example:
		// 		>>> // Positive usage example for indexOf()
		// 		>>> embed.indexOf([2,4,6], 4) // Find number 4 in the given array.
		// 		1
		// 		>>> // Failing usage example for indexOf()
		// 		>>> embed.indexOf([2,4,6], 3) // Find number 3 in the given array, will not be found.
		// 		-1
		return arr.indexOf(value, fromIndex);
	};

	embed.lastIndexOf = function(arr, value, fromIndex){
		// In chrome and ff there seems to be passed 0 if thisObj is undefined.
		// >>> // Test for specific chrome+ff bug, third parameter
		// >>> embed.lastIndexOf([1,2,3,4,5,6], 3)
		// 2
		if (arguments.length < 3) {
			return arr.lastIndexOf(value);
		} else {
			return arr.lastIndexOf(value, fromIndex);
		}
	};

	["forEach", "map", "some", "every", "filter"].forEach(
		function(name, idx){
			embed[name] = function(arr, callback, thisObj){
				if(typeof callback == "string"){
					callback = new Function("item", "index", "array", callback);
				}
				return Array.prototype[name].call(arr, callback, thisObj);
			};
		}
	);
	
	return embed;
});
