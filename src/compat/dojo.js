//
//	This file implements a layer that makes EmbedJS API compatible to dojo,
//	so you can put an EmbedJS build "under" this compat layer and on top
//	you get exactly the API you are used to from dojo.
//	Of course, you can also purely use EmbedJS, which is optimized and
//	trimmed to be as efficient as possible on mobile.
//	But to get started this makes it a lot easier for developers who are used to the Dojo API.
//

define(['embed'], function(embed){
	
	embed.global.dojo = embed;

	// promoted methods
	dojo._toArray = embed.toArray;
	dojo._toDom = embed.toDom;

	// dojo.io.*
	embed.setObject("dojo.io.script");
	dojo.io.script.get = embed.jsonp;
	dojo.io.script.attach = embed.attachScript;

	// to makes sure require/provide calls
	// don't break code.
	dojo.provide = function(resourceName){
		return dojo.getObject(resourceName + "", true); // Object
	};
	dojo.require = function(){};
	
	return dojo;
});
