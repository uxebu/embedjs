define(['embed', 'feature!html-destroy'], function(embed){

	// find a way to access to destroyContainer
	// need to add embed.addOnWindowUnload

//	embed.addOnWindowUnload(function(){
//		_destroyContainer = null; //prevent IE leak
//	};

	return embed;

});