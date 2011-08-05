define(['embed'], function(embed){

	// NOTE: dojo's JSON impl differs from native!
	//	(e.g. revier function)
	
	var commentRegExp = /(\/\*([\s\S]*?)\*\/|\/\/(.*)$)/mg;
	
	embed.toJson = function(/* Mixed */ data){
		return JSON.stringify(data);
	};
	
	embed.fromJson = function(/* String */ json, /* Boolean? */ stripComments){
		if(stripComments){
			json = json.replace(commentRegExp, '');
		}
		return JSON.parse(json);
	}
	
	return embed;

});