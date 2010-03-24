["indexOf", "lastIndexOf", "forEach", "map", "some", "every", "filter"].forEach(
	function(name, idx){
		dojo[name] = function(arr, callback, thisObj){
			if((idx > 1) && (typeof callback == "string")){
				callback = new Function("item", "index", "array", callback);
			}
			return Array.prototype[name].call(arr, callback, thisObj);
		}
	}
);
