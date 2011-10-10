define(['embed', 'feature!lang-is', 'feature!array'], function(embed){

	embed.fromJson = function(/*String*/ json, /* Boolean? */ stripComments){
		// summary:
		// 		Parses a JSON string to return a JavaScript object.
		// description:
		// 		Uses native JSON if possible, if not, it delegates to eval().
		//		The content passed to this method must therefore come
		//		from a trusted source.
		// json: 
		//		a string literal of a JSON item, for instance:
		//			`'{ "foo": [ "bar", 1, { "baz": "thud" } ] }'`
		// stripComments:
		//		If set to true, fromJson() will strip out comments before passing
		//		the string to native JSON, as comments will make JSON.parse() throw
		//		(it's not valid JSON if it contains comments).
	
		return eval("(" + json + ")"); // Object
	};

	embed._escapeString = function(/*String*/str){
		//summary:
		//		Adds escape sequences for non-visual characters, double quote and
		//		backslash and surrounds with double quotes to form a valid string
		//		literal.
		return ('"' + str.replace(/(["\\])/g, '\\$1') + '"').
			replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").
			replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r"); // string
	};

	embed.toJson = function(/*Object*/ it){
		//	summary:
		//		Returns a JSON serialization of an object.
		//	description:
		//		Returns a serialization of an object, uses JSON.stringify() if
		//		possible.
		//		Note that this doesn't check for infinite recursion, so don't do that!
		//	it:
		//		an object to be serialized. Objects may define their own
		//		serialization via a special "__json__" or "json" function
		//		property. If a specialized serializer has been defined, it will
		//		be used as a fallback.
		//	example:
		//		simple serialization of a trivial object
		//		|	var jsonStr = embed.toJson({ howdy: "stranger!", isStrange: true });
		//		|	doh.is('{"howdy":"stranger!","isStrange":true}', jsonStr);
		//	example:
		//		a custom serializer for an objects of a particular class:
		//		|	embed.declare("Furby", null, {
		//		|		furbies: "are strange",
		//		|		furbyCount: 10,
		//		|		__json__: function(){
		//		|		},
		//		|	});
	
		if(it === undefined){
			return "undefined";
		}
		var objtype = typeof it;
		if(objtype == "number" || objtype == "boolean"){
			return it + "";
		}
		if(it === null){
			return "null";
		}
		if(embed.isString(it)){ 
			return embed._escapeString(it); 
		}
		// recurse
		var recurse = arguments.callee;
		// short-circuit for objects that support "json" serialization
		// if they return "self" then just pass-through...
		var newObj;
		var tf = it.__json__||it.json;
		if(embed.isFunction(tf)){
			newObj = tf.call(it);
			if(it !== newObj){
				return recurse(newObj);
			}
		}
		if(it.nodeType && it.cloneNode){ // isNode
			// we can't seriailize DOM nodes as regular objects because they have cycles
			// DOM nodes could be serialized with something like outerHTML, but
			// that can be provided by users in the form of .json or .__json__ function.
			throw new Error("Can't serialize DOM nodes");
		}
	
		// array
		if(embed.isArray(it)){
			var res = embed.map(it, function(obj){
				var val = recurse(obj);
				if(typeof val != "string"){
					val = "undefined";
				}
				return val;
			});
			return "[" + res.join(",") + "]";
		}
		/*
		// look in the registry
		try {
			window.o = it;
			newObj = embed.json.jsonRegistry.match(it);
			return recurse(newObj, prettyPrint, nextIndent);
		}catch(e){
			// console.log(e);
		}
		// it's a function with no adapter, skip it
		*/
		if(objtype == "function"){
			return null; // null
		}
		// generic object code path
		var output = [], key;
		for(key in it){
			var keyStr, val;
			if(typeof key == "number"){
				keyStr = '"' + key + '"';
			}else if(typeof key == "string"){
				keyStr = embed._escapeString(key);
			}else{
				// skip non-string or number keys
				continue;
			}
			val = recurse(it[key]);
			if(typeof val != "string"){
				// skip non-serializable values
				continue;
			}
			// FIXME: use += on Moz!!
			//	 MOW NOTE: using += is a pain because you have to account for the dangling comma...
			output.push(keyStr + ":" + val);
		}
		return "{" + output.join(",") + "}"; // String
	};

	return embed;

});