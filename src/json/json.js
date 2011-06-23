define(['embed'], function(embed){

	// NOTE: dojo's JSON impl differs from native!
	//	(e.g. revier function)
	
	embed.toJson = function(/* Mixed */ data){
		return JSON.stringify(data);
	};
	
	embed.fromJson = function(/* String */ json){
		return JSON.parse(json);
	}
	
	return embed;

});