define(['embed', 'feature!html-id'], function(embed){

	embed.query = function(query, scope){
		
		// scope normalization
		if(typeof scope == "string"){
			scope = embed.byId(scope);
			if(!scope){
				return [];
			}
		}
	
		scope = scope || embed.doc;
		var n = scope.querySelectorAll(query);
		return n || [];
	};

	return embed;

});