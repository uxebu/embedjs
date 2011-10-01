// This file contains fixes for the browser contained in BlackBerry OS 4.6
define(['feature!lang-object:default'], function(embed){

	var getProp = embed._getProp;

	// `attr in window` might evaluate to true, even if the proprty does not exist
	embed._getProp = function(/*Array*/parts, /*Boolean*/create, /*Object*/context){
		var obj=context || dojo.global;
		if(obj === window && create && parts.length && typeof window[parts[0]] === "undefined"){
			window[parts[0]] = {};
		}

		return getProp(parts, create, context);
	};
	
	return embed;

});