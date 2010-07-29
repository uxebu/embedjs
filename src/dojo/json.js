require.def("dojo/json", ["dojo"], function(){
	
	// NOTE: dojo's JSON impl differs from native!
	//	(e.g. revier function)
	
	dojo.toJson = function(/* Mixed */ data){
		return JSON.stringify(data);
	};
	
	dojo.fromJson = function(/* String */ json){
		return JSON.parse(json);
	}
	
});