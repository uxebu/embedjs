define(['embed'], function(embed){

	embed._getProp = function(/*Array*/parts, /*Boolean*/create, /*Object?*/context){
		var obj=context || embed.global;
		for(var i=0, p; obj && (p=parts[i]); i++){
			//if(i == 0 && d._scopeMap[p]){
			//	p = d._scopeMap[p];
			//}
			obj = (p in obj ? obj[p] : (create ? obj[p]={} : undefined));
		}
		return obj; // mixed
	};

	embed.setObject = function(/*String*/name, /*Object*/value, /*Object?*/context){
		// summary:
		//		Set a property from a dot-separated string, such as "A.B.C"
		//	description:
		//		Useful for longer api chains where you have to test each object in
		//		the chain, or when you have an object reference in string format.
		//		Objects are created as needed along `path`. Returns the passed
		//		value if setting is successful or `undefined` if not.
		//	name:
		//		Path to a property, in the form "A.B.C".
		//	context:
		//		Optional. Object to use as root of path. Defaults to
		//		`embed.global`.
		//	example:
		//		set the value of `foo.bar.baz`, regardless of whether
		//		intermediate objects already exist:
		//	|	embed.setObject("foo.bar.baz", value);
		//	example:
		//		without `embed.setObject`, we often see code like this:
		//	|	// ensure that intermediate objects are available
		//	|	if(!obj["parent"]){ obj.parent = {}; }
		//	|	if(!obj.parent["child"]){ obj.parent.child= {}; }
		//	|	// now we can safely set the property
		//	|	obj.parent.child.prop = "some value";
		//		wheras with `embed.setObject`, we can shorten that to:
		//	|	embed.setObject("parent.child.prop", "some value", obj);
		// feature:
		//		lang-object
		var parts=name.split("."), p=parts.pop(), obj=embed._getProp(parts, true, context);
		return obj && p ? (obj[p]=value) : undefined; // Object
	};

	embed.getObject = function(/*String*/name, /*Boolean?*/create, /*Object?*/context){
		// summary:
		//		Get a property from a dot-separated string, such as "A.B.C"
		//	description:
		//		Useful for longer api chains where you have to test each object in
		//		the chain, or when you have an object reference in string format.
		//	name:
		//		Path to an property, in the form "A.B.C".
		//	create:
		//		Optional. Defaults to `false`. If `true`, Objects will be
		//		created at any point along the 'path' that is undefined.
		//	context:
		//		Optional. Object to use as root of path. Defaults to
		//		'embed.global'. Null may be passed.
		// feature:
		//		lang-object
		return embed._getProp(name.split("."), create, context); // Object
	};

	return embed;

});