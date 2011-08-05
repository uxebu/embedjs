define(['embed', 'feature!html-id'], function(embed){

	embed.query = function(query, scope){
		// summary: Works with ".className", "#id", and ".className .className"
		
		// scope normalization
		if(typeof scope == "string"){
			scope = embed.byId(scope);
			if(!scope){
				return [];
			}
		}
		scope = scope || embed.doc;
		
		var parts = query.split(" ");
		if (parts.length > 1){
			return embed.query(parts.slice(1).join(" "), embed.query(parts[0]));
		}
		if (query.charAt(0)=="."){
			return scope.getElementsByClassName(query.substr(1));
		}
		if (query.charAt(0)=="#"){
			return [document.getElementById(query.substr(1))];
		}
		return [];
	};

	return embed;

});