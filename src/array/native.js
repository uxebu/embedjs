["indexOf", "lastIndexOf"].forEach(
	function(name, idx){
		dojo[name] = function(arr, callback, thisObj){
			// This is due to a bug in Chrome 9, FF 3.6 and 4
			// Do we want to have this in an own feature?
			return typeof thisObj == "undefined" ? 
				Array.prototype[name].call(arr, callback) : 
				Array.prototype[name].call(arr, callback, thisObj);
		}
	}
);
["forEach", "map", "some", "every", "filter"].forEach(
	function(name, idx){
		dojo[name] = function(arr, callback, thisObj){
			if(typeof callback == "string"){
				callback = new Function("item", "index", "array", callback);
			}
			return Array.prototype[name].call(arr, callback, thisObj);
		}
	}
);
