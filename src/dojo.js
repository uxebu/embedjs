var dojo = {};
var djConfig = dojo.config = {};

dojo.global = window;

dojo.doc = document;
dojo.body = function() {
	return document.body;
}

dojo.provide = function(resourceName){
	// Make sure we have a string.
	resourceName = resourceName + "";
	return dojo.getObject(resourceName, true); // Object
};

dojo.require = function(){};

(function(d){
	var empty = {}, extraNames;
	for(var i in {toString: 1}){ extraNames = []; break; }
	dojo._extraNames = extraNames = extraNames || ["hasOwnProperty", "valueOf", "isPrototypeOf",
		"propertyIsEnumerable", "toLocaleString", "toString"];

	d._mixin = function(/*Object*/ target, /*Object*/ source){
		// summary:
		//		Adds all properties and methods of source to target. This addition
		//		is "prototype extension safe", so that instances of objects
		//		will not pass along prototype defaults.
		var name, s, i = 0, l = extraNames.length;
		for(name in source){
			// the "tobj" condition avoid copying properties in "source"
			// inherited from Object.prototype.  For example, if target has a custom
			// toString() method, don't overwrite it with the toString() method
			// that source inherited from Object.prototype
			s = source[name];
			if(s !== empty[name] && s !== target[name]){
				target[name] = s;
			}
		}
		//>>excludeStart("webkitMobile", kwArgs.webkitMobile);
		// IE doesn't recognize some custom functions in for..in
		if(l && source){
			for(; i < l; ++i){
				name = extraNames[i];
				s = source[name];
				if(s !== empty[name] && s !== target[name]){
					target[name] = s;
				}
			}
		}
		//>>excludeEnd("webkitMobile");
		return target; // Object
	}

	dojo.mixin = function(/*Object*/obj, /*Object...*/props){
		// summary:
		//		Adds all properties and methods of props to obj and returns the
		//		(now modified) obj.
		//	description:
		//		`dojo.mixin` can mix multiple source objects into a
		//		destionation object which is then returned. Unlike regular
		//		`for...in` iteration, `dojo.mixin` is also smart about avoiding
		//		extensions which other toolkits may unwisely add to the root
		//		object prototype
		//	obj:
		//		The object to mix properties into. Also the return value.
		//	props:
		//		One or more objects whose values are successively copied into
		//		obj. If more than one of these objects contain the same value,
		//		the one specified last in the function call will "win".
		//	example:
		//		make a shallow copy of an object
		//	|	var copy = dojo.mixin({}, source);
		//	example:
		//		many class constructors often take an object which specifies
		//		values to be configured on the object. In this case, it is
		//		often simplest to call `dojo.mixin` on the `this` object:
		//	|	dojo.declare("acme.Base", null, {
		//	|		constructor: function(properties){
		//	|			// property configuration:
		//	|			dojo.mixin(this, properties);
		//	|
		//	|			console.log(this.quip);
		//	|			//  ...
		//	|		},
		//	|		quip: "I wasn't born yesterday, you know - I've seen movies.",
		//	|		// ...
		//	|	});
		//	|
		//	|	// create an instance of the class and configure it
		//	|	var b = new acme.Base({quip: "That's what it does!" });
		//	example:
		//		copy in properties from multiple objects
		//	|	var flattened = dojo.mixin(
		//	|		{
		//	|			name: "Frylock",
		//	|			braces: true
		//	|		},
		//	|		{
		//	|			name: "Carl Brutanananadilewski"
		//	|		}
		//	|	);
		//	|
		//	|	// will print "Carl Brutanananadilewski"
		//	|	console.log(flattened.name);
		//	|	// will print "true"
		//	|	console.log(flattened.braces);
		if(!obj){ obj = {}; }
		for(var i=1, l=arguments.length; i<l; i++){
			d._mixin(obj, arguments[i]);
		}
		return obj; // Object
	}
	
	// implementation of safe mixin function
	dojo.safeMixin = function(target, source){
		//	summary:
		//		Mix in properties skipping a constructor and decorating functions
		//		like it is done by dojo.declare.
		//	target: Object
		//		Target object to accept new properties.
		//	source: Object
		//		Source object for new properties.
		//	description:
		//		This function is used to mix in properties like dojo._mixin does,
		//		but it skips a constructor property and decorates functions like
		//		dojo.declare does.
		//
		//		It is meant to be used with classes and objects produced with
		//		dojo.declare. Functions mixed in with dojo.safeMixin can use
		//		this.inherited() like normal methods.
		//
		//		This function is used to implement extend() method of a constructor
		//		produced with dojo.declare().
		//
		//	example:
		//	|	var A = dojo.declare(null, {
		//	|		m1: function(){
		//	|			console.log("A.m1");
		//	|		},
		//	|		m2: function(){
		//	|			console.log("A.m2");
		//	|		}
		//	|	});
		//	|	var B = dojo.declare(A, {
		//	|		m1: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("B.m1");
		//	|		}
		//	|	});
		//	|	B.extend({
		//	|		m2: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("B.m2");
		//	|		}
		//	|	});
		//	|	var x = new B();
		//	|	dojo.safeMixin(x, {
		//	|		m1: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("X.m1");
		//	|		},
		//	|		m2: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("X.m2");
		//	|		}
		//	|	});
		//	|	x.m2();
		//	|	// prints:
		//	|	// A.m1
		//	|	// B.m1
		//	|	// X.m1
		var name, t, i = 0, l = d._extraNames.length;
		var op = Object.prototype, opts = op.toString, cname = "constructor";
		
		// add props adding metadata for incoming functions skipping a constructor
		for(name in source){
			t = source[name];
			if((t !== op[name] || !(name in op)) && name != cname){
				if(opts.call(t) == "[object Function]"){
					// non-trivial function method => attach its name
					t.nom = name;
				}
				target[name] = t;
			}
		}
		// process unenumerable methods on IE
		//TODO: move unneeded iteration to ie branch?
		for(; i < l; ++i){
			name = d._extraNames[i];
			t = source[name];
			if((t !== op[name] || !(name in op)) && name != cname){
				if(opts.call(t) == "[object Function]"){
					// non-trivial function method => attach its name
					t.nom = name;
				}
				target[name] = t;
			}
		}
		return target;
	}

	d._getProp = function(/*Array*/parts, /*Boolean*/create, /*Object*/context){
		var obj=context || d.global;
		for(var i=0, p; obj && (p=parts[i]); i++){
			//if(i == 0 && d._scopeMap[p]){
			//	p = d._scopeMap[p];
			//}
			obj = (p in obj ? obj[p] : (create ? obj[p]={} : undefined));
		}
		return obj; // mixed
	}

	d.setObject = function(/*String*/name, /*Object*/value, /*Object?*/context){
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
		//		`dojo.global`.
		//	example:
		//		set the value of `foo.bar.baz`, regardless of whether
		//		intermediate objects already exist:
		//	|	dojo.setObject("foo.bar.baz", value);
		//	example:
		//		without `dojo.setObject`, we often see code like this:
		//	|	// ensure that intermediate objects are available
		//	|	if(!obj["parent"]){ obj.parent = {}; }
		//	|	if(!obj.parent["child"]){ obj.parent.child= {}; }
		//	|	// now we can safely set the property
		//	|	obj.parent.child.prop = "some value";
		//		wheras with `dojo.setObject`, we can shorten that to:
		//	|	dojo.setObject("parent.child.prop", "some value", obj);
		var parts=name.split("."), p=parts.pop(), obj=d._getProp(parts, true, context);
		return obj && p ? (obj[p]=value) : undefined; // Object
	}

	d.getObject = function(/*String*/name, /*Boolean?*/create, /*Object?*/context){
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
		//		'dojo.global'. Null may be passed.
		return d._getProp(name.split("."), create, context); // Object
	}



	//
	// addOnLoad stuff
	//

	d._loaders = [];
	d._unloaders = [];


	d._onto = function(arr, obj, fn){
		if(!fn){
			arr.push(obj);
		}else if(fn){
			var func = (typeof fn == "string") ? obj[fn] : fn;
			arr.push(function(){ func.call(obj); });
		}
	}

	dojo.addOnLoad = function(/*Object?*/obj, /*String|Function*/functionName){
		// summary:
		//		Registers a function to be triggered after the DOM has finished
		//		loading and widgets declared in markup have been instantiated.
		//		Images and CSS files may or may not have finished downloading when
		//		the specified function is called.  (Note that widgets' CSS and HTML
		//		code is guaranteed to be downloaded before said widgets are
		//		instantiated.)
		// example:
		//	|	dojo.addOnLoad(functionPointer);
		//	|	dojo.addOnLoad(object, "functionName");
		//	|	dojo.addOnLoad(object, function(){ /* ... */});

		d._onto(d._loaders, obj, functionName);

		//Added for xdomain loading. dojo.addOnLoad is used to
		//indicate callbacks after doing some dojo.require() statements.
		//In the xdomain case, if all the requires are loaded (after initial
		//page load), then immediately call any listeners.
		if(d._postLoad && d._inFlightCount == 0 && !d._loadNotifying){
			d._callLoaded();
		}
	}
	
	dojo._getModuleSymbols = function(/*String*/modulename){
		// summary:
		//		Converts a module name in dotted JS notation to an array
		//		representing the path in the source tree
		var syms = modulename.split(".");
		for(var i = syms.length; i>0; i--){
			var parentModule = syms.slice(0, i).join(".");
			if(i == 1 && !d._moduleHasPrefix(parentModule)){
				// Support default module directory (sibling of dojo) for top-level modules
				syms[0] = "../" + syms[0];
			}else{
				var parentModulePath = d._getModulePrefix(parentModule);
				if(parentModulePath != parentModule){
					syms.splice(0, i, parentModulePath);
					break;
				}
			}
		}
		return syms; // Array
	};

	dojo.moduleUrl = function(/*String*/module, /*dojo._Url||String*/url){
		//	summary:
		//		Returns an URL relative to a module.
		//	example:
		//	|	var pngPath = dojo.moduleUrl("acme","images/small.png");
		//	|	console.dir(pngPath); // list the object properties
		//	|	// create an image and set it's source to pngPath's value:
		//	|	var img = document.createElement("img");
		// 	|	// NOTE: we assign the string representation of the url object
		//	|	img.src = pngPath.toString();
		//	|	// add our image to the document
		//	|	dojo.body().appendChild(img);
		//	example:
		//		you may de-reference as far as you like down the package
		//		hierarchy.  This is sometimes handy to avoid lenghty relative
		//		urls or for building portable sub-packages. In this example,
		//		the `acme.widget` and `acme.util` directories may be located
		//		under different roots (see `dojo.registerModulePath`) but the
		//		the modules which reference them can be unaware of their
		//		relative locations on the filesystem:
		//	|	// somewhere in a configuration block
		//	|	dojo.registerModulePath("acme.widget", "../../acme/widget");
		//	|	dojo.registerModulePath("acme.util", "../../util");
		//	|
		//	|	// ...
		//	|
		//	|	// code in a module using acme resources
		//	|	var tmpltPath = dojo.moduleUrl("acme.widget","templates/template.html");
		//	|	var dataPath = dojo.moduleUrl("acme.util","resources/data.json");

		var loc = d._getModuleSymbols(module).join('/');
		if(!loc){ return null; }
		if(loc.lastIndexOf("/") != loc.length-1){
			loc += "/";
		}

		//If the path is an absolute path (starts with a / or is on another
		//domain/xdomain) then don't add the baseUrl.
		var colonIndex = loc.indexOf(":");
		if(loc.charAt(0) != "/" && (colonIndex == -1 || colonIndex > loc.indexOf("/"))){
			loc = d.baseUrl + loc;
		}

		return loc + (url || "");
	};


	d.mixin(d, {
		baseUrl: "",
		_loadedModules: {},
		_inFlightCount: 0,
		_hasResource: {},

		_modulePrefixes: {
			dojo: 	{	name: "dojo", value: "." },
			// dojox: 	{	name: "dojox", value: "../dojox" },
			// dijit: 	{	name: "dijit", value: "../dijit" },
			doh: 	{	name: "doh", value: "../util/doh" },
			tests: 	{	name: "tests", value: "tests" }
		},

		_moduleHasPrefix: function(/*String*/module){
			// summary: checks to see if module has been established
			var mp = d._modulePrefixes;
			return !!(mp[module] && mp[module].value); // Boolean
		},

		_getModulePrefix: function(/*String*/module){
			// summary: gets the prefix associated with module
			var mp = d._modulePrefixes;
			if(d._moduleHasPrefix(module)){
				return mp[module].value; // String
			}
			return module; // String
		},

		_loadedUrls: [],

		//WARNING:
		//		This variable is referenced by packages outside of bootstrap:
		//		FloatingPane.js and undo/browser.js
		_postLoad: false,

		//Egad! Lots of test files push on this directly instead of using dojo.addOnLoad.
		_loaders: [],
		_unloaders: [],
		_loadNotifying: false
	});
})(dojo);

(function(d){

	// grab the node we were loaded from
	if(document && document.getElementsByTagName){
		var scripts = document.getElementsByTagName("script");
		var rePkg = /dojo[^\/]*\.js(\W|$)/i;
		for(var i = 0; i < scripts.length; i++){
			var src = scripts[i].getAttribute("src");
			if(!src){ continue; }
			var m = src.match(rePkg);
			if(m){
				// find out where we came from
				if(!d.config.baseUrl){
					d.config.baseUrl = src.substring(0, m.index);
				}
				// and find out if we need to modify our behavior
				var cfg = scripts[i].getAttribute("djConfig");
				if(cfg){
					var cfgo = eval("({ "+cfg+" })");
					for(var x in cfgo){
						dojo.config[x] = cfgo[x];
					}
				}
				break; // "first Dojo wins"
			}
		}
	}
	d.baseUrl = d.config.baseUrl;
}(dojo));
