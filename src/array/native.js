define(['embed'], function(embed){
	
	["indexOf", "lastIndexOf"].forEach(
		function(name, idx){
			embed[name] = function(arr, callback, thisObj){
				// This is due to a bug found in in Chrome 9, FF 3.6 and 4:
				// Having undefined as the second parameter to lastIndexOf
				// will result in lastIndeOf interpreting this as 0.
				// TODO: Do we want to have this in an own feature?
				return typeof thisObj == "undefined" ? 
					Array.prototype[name].call(arr, callback) : 
					Array.prototype[name].call(arr, callback, thisObj);
			};
		}
	);
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
