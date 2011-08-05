define(['embed'], function(embed){

	embed.toArray = function(obj, offset, startWith){
		return (startWith||[]).concat(Array.prototype.slice.call(obj, offset||0));
	};
	
	return embed;

});
