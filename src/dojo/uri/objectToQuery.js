dojo.objectToQuery = function(/*Object*/ map){
	//	summary:
	//		takes a name/value mapping object and returns a string representing
	//		a URL-encoded version of that object.
	//	example:
	//		this object:
	//
	//		|	{ 
	//		|		blah: "blah",
	//		|		multi: [
	//		|			"thud",
	//		|			"thonk"
	//		|		]
	//		|	};
	//
	//	yields the following query string:
	//	
	//	|	"blah=blah&multi=thud&multi=thonk"
	//
	//	TODO:
	//		This originates in dojo._base.xhr. Do we want to keep 
	//		it here or move it over?
	var enc = encodeURIComponent;
	var pairs = [];
	var backstop = {};
	for(var name in map){
		var value = map[name];
		if(value != backstop[name]){
			var assign = enc(name) + "=";
			if(dojo.isArray(value)){
				for(var i=0; i < value.length; i++){
					pairs.push(assign + enc(value[i]));
				}
			}else{
				pairs.push(assign + enc(value));
			}
		}
	}
	return pairs.join("&"); // String
};

