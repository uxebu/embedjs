require.modify("dojo", "dojo/getProp_bb46_fix", null, function(){

// This file contains fixes for the browser contained in BlackBerry OS 4.6

(function(dojo){
	var getProp = dojo._getProp;

	// `attr in window` might evaluate to true, even if the proprty does not exist
	dojo._getProp = function(/*Array*/parts, /*Boolean*/create, /*Object*/context){
		var obj=context || dojo.global;
		if(obj === window && create && parts.length && typeof window[parts[0]] === "undefined"){
			window[parts[0]] = {};
		}

		return getProp(parts, create, context);
	}
}(dojo));

});
