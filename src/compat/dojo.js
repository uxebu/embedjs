//
//	This file implements a layer that makes embedJS API compatible to dojo,
//	so you can put an embedJS build "under" this compat layer and on top
//	you get exactly the API you are used to from dojo.
//	Of course, you can also purely use embedJS, which is optimized and
//	trimmed to be as efficient as possible on mobile.
//	But to get started this makes it a lot easier for developers who are used to the Dojo API.
//

// promoted methods
dojo._toArray = dojo.toArray;

// dojo.io.*
dojo.setObject("dojo.io.script");
dojo.io.script.get = dojo.jsonp;
dojo.io.script.attach = dojo.attachScript;

// to makes sure require/provide calls
// don't break code.
dojo.provide = function(resourceName){
	return dojo.getObject(resourceName + "", true); // Object
};
dojo.require = function(){};