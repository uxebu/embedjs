define(['embed'], function(embed){

	embed.toArray = function(/* anything */obj, /* Number? */offset, startWith){
		// summary:
		//		Converts an array-like object (i.e. arguments, DOMCollection) to an array. 
		//		Returns a new Array with the elements of obj.
		// obj:
		//		the object to "arrayify". We expect the object to have, at a minimum, a 
		//		length property which corresponds to integer-indexed properties.
		// offset:
		//		The location in obj to start iterating from. Defaults to 0. Optional.
		// startWith:
		//		Optional. An array to pack with the properties of obj. If provided, properties 
		//		in obj are appended at the end of startWith and startWith is the returned array.
		// returns:
		//		Array
		// dojodiff:
		//		In the Dojo Toolkit, this method is available as dojo._toArray().
		// feature:
		//		lang-toarray
		return (startWith||[]).concat(Array.prototype.slice.call(obj, offset||0));
	};
	
	return embed;

});
