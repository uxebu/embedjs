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
	
	dojo.byId = function(id, doc){
		//	summary:
		//		Returns DOM node with matching `id` attribute or `null`
		//		if not found, similar to "$" function in another library.
		//		If `id` is a DomNode, this function is a no-op.
		//
		//	id: String|DOMNode
		//	 	A string to match an HTML id attribute or a reference to a DOM Node
		//
		//	doc: Document?
		//		Document to work in. Defaults to the current value of
		//		dojo.doc.  Can be used to retrieve
		//		node references from other documents.
		//
		//	example:
		//	Look up a node by ID:
		//	| var n = dojo.byId("foo");
		//
		//	example:
		//	Check if a node exists.
		//	|	if(dojo.byId("bar")){ ... }
		//
		//	example:
		//	Allow string or DomNode references to be passed to a custom function:
		//	| var foo = function(nodeOrId){
		//	|	nodeOrId = dojo.byId(nodeOrId);
		//	|	// ... more stuff
		//	| }
		return (typeof id == "string") ? (doc || document).getElementById(id) : id; // DomNode
	};


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
// this file courtesy of the TurboAjax Group, licensed under a Dojo CLA

dojo.declare = function(/*String*/ className, /*Function|Function[]*/ superclass, /*Object*/ props){
	//	summary: 
	//		Create a feature-rich constructor from compact notation
	//
	//	description:
	//		Create a feature-rich constructor from compact notation
	//
	//	className:
	//		The name of the constructor (loosely, a "class")
	//		stored in the "declaredClass" property in the created prototype
	//	superclass:
	//		May be null, a Function, or an Array of Functions. If an array, 
	//		the first element is used as the prototypical ancestor and
	//		any following Functions become mixin ancestors.
	//	props:
	//		An object whose properties are copied to the
	//		created prototype.
	//		Add an instance-initialization function by making it a property 
	//		named "constructor".
	//	description:
	//		Create a constructor using a compact notation for inheritance and
	//		prototype extension. 
	//
	//		All superclasses (including mixins) must be Functions (not simple Objects).
	//
	//		Mixin ancestors provide a type of multiple inheritance. Prototypes of mixin 
	//		ancestors are copied to the new class: changes to mixin prototypes will
	//		not affect classes to which they have been mixed in.
	//
	//		"className" is cached in "declaredClass" property of the new class.
	//
	//	example:
	//		Declare a class with no ancestors.
	//	|	dojo.declare("my.ClassyThing", null, {
	//	|		aProperty:"string",
	//	|		constructor: function(args){
	//	|			dojo.mixin(this, args);	
	//	|		}
	//	|	});
	//
	//	example:
	//		Declare a class inheriting from my.classed.Foo
	//	|	dojo.declare("my.classes.Bar", my.classes.Foo, {
	//	|		// properties to be added to the class prototype
	//	|		someValue: 2,
	//	|		// initialization function
	//	|		constructor: function(){
	//	|			this.myComplicatedObject = new ReallyComplicatedObject(); 
	//	|		},
	//	|		// other functions
	//	|		someMethod: function(){ 
	//	|			doStuff(); 
	//	|		}
	//	|	);
	//
	//	example:
	//		Declare a class inherting from two mixins, handling multiple constructor args
	//	|	dojo.declare("my.ComplexMix", [my.BaseClass, my.MixedClass],{
	//	|		constructor: function(a, b){
	//	|			// someone called `new my.ComplexMix("something", "maybesomething");`
	//	|		}
	//	|	});
	//	issues:
	//		There are known issues with mutliple inheritance. In general, declare
	//		works fine, but it may not be as precise as the full-blown declare
	//		found in current dojo releases. This is a trade-off for a smaller
	//		and better performance.
	//	dojo-incompatibilities:
	//		See ´issues´ above.

	// process superclass argument
	var dd = arguments.callee, mixins;
	if(dojo.isArray(superclass)){
		mixins = superclass;
		superclass = mixins.shift();
	}
	// construct intermediate classes for mixins
	if(mixins){
		dojo.forEach(mixins, function(m, i){
			if(!m){ throw(className + ": mixin #" + i + " is null"); } // It's likely a required module is not loaded
			superclass = dd._delegate(superclass, m);
		});
	}
	// create constructor
	var ctor = dd._delegate(superclass);
	// extend with "props"
	props = props || {};
	ctor.extend(props);
	// more prototype decoration
	dojo.extend(ctor, { declaredClass: className, _constructor: props.constructor/*, preamble: null*/ });
	// special help for IE
	ctor.prototype.constructor = ctor;
	// create named reference
	return dojo.setObject(className, ctor); // Function
};

dojo.mixin(dojo.declare, {
	_delegate: function(base, mixin){
		var bp = (base || 0).prototype, mp = (mixin || 0).prototype, dd = dojo.declare;
		// fresh constructor, fresh prototype
		var ctor = dd._makeCtor();
		// cache ancestry
		dojo.mixin(ctor, { superclass: bp, mixin: mp, extend: dd._extend });
		// chain prototypes
		if(base){ ctor.prototype = dojo._delegate(bp); }
		// add mixin and core
		dojo.extend(ctor, dd._core, mp || 0, { _constructor: null, preamble: null });
		// special help for IE
		ctor.prototype.constructor = ctor;
		// name this class for debugging
		ctor.prototype.declaredClass = (bp || 0).declaredClass + '_' + (mp || 0).declaredClass;
		return ctor;
	},
	_extend: function(props){
		var i, fn;
		for(i in props){ if(dojo.isFunction(fn=props[i]) && !0[i]){fn.nom=i;fn.ctor=this;} }
		dojo.extend(this, props);
	},
	_makeCtor: function(){
		// we have to make a function, but don't want to close over anything
		return function(){ this._construct(arguments); };
	},
	_core: { 
		_construct: function(args){
			var c = args.callee, s = c.superclass, ct = s && s.constructor, 
				m = c.mixin, mct = m && m.constructor, a = args, ii, fn;
			// side-effect of = used on purpose here, lint may complain, don't try this at home
			if(a[0]){ 
				// FIXME: preambles for each mixin should be allowed
				// FIXME: 
				//		should we allow the preamble here NOT to modify the
				//		default args, but instead to act on each mixin
				//		independently of the class instance being constructed
				//		(for impedence matching)?

				// allow any first argument w/ a "preamble" property to act as a
				// class preamble (not exclusive of the prototype preamble)
				if(/*dojo.isFunction*/((fn = a[0].preamble))){ 
					a = fn.apply(this, a) || a; 
				}
			} 
			// prototype preamble
			if((fn = c.prototype.preamble)){ a = fn.apply(this, a) || a; }
			// FIXME: 
			//		need to provide an optional prototype-settable
			//		"_explicitSuper" property which disables this
			// initialize superclass
			if(ct && ct.apply){ ct.apply(this, a); }
			// initialize mixin
			if(mct && mct.apply){ mct.apply(this, a); }
			// initialize self
			if((ii = c.prototype._constructor)){ ii.apply(this, args); }
			// post construction
			if(this.constructor.prototype == c.prototype && (ct = this.postscript)){ ct.apply(this, args); }
		},
		_findMixin: function(mixin){
			var c = this.constructor, p, m;
			while(c){
				p = c.superclass;
				m = c.mixin;
				if(m == mixin || (m instanceof mixin.constructor)){ return p; }
				if(m && m._findMixin && (m = m._findMixin(mixin))){ return m; }
				c = p && p.constructor;
			}
		},
		_findMethod: function(name, method, ptype, has){
			// consciously trading readability for bytes and speed in this low-level method
			var p=ptype, c, m, f;
			do{
				c = p.constructor;
				m = c.mixin;
				// find method by name in our mixin ancestor
				if(m && (m = this._findMethod(name, method, m, has))){ return m; }
				// if we found a named method that either exactly-is or exactly-is-not 'method'
				if((f = p[name]) && (has == (f == method))){ return p; }
				// ascend chain
				p = c.superclass;
			}while(p);
			// if we couldn't find an ancestor in our primary chain, try a mixin chain
			return !has && (p = this._findMixin(ptype)) && this._findMethod(name, method, p, has);
		},
		inherited: function(name, args, newArgs){
			// summary: 
			//		Call an inherited member function of this declared class.
			//
			// description:
			//		Call an inherited member function of this declared class, allowing advanced
			//		manipulation of passed arguments to inherited functions.
			//		Explicitly cannot handle the case of intending to pass no `newArgs`, though
			//		hoping the use in conjuction with `dojo.hitch`. Calling an inherited 
			//		function directly via hitch() is not supported.
			//
			// name: String? 
			//		The name of the method to call. If omitted, the special `arguments` passed is
			//		used to determine the inherited function. All subsequent positional arguments
			//		are shifted left if `name` has been omitted. (eg: args becomes name)
			//
			// args: Object
			//		An `arguments` object to pass along to the inherited function. Can be in the
			//		`name` position if `name` has been omitted. This is a literal JavaScript `arguments`
			//		object, and must be passed.
			//
			// newArgs: Array?
			//		An Array of argument values to pass to the inherited function. If omitted, 
			//		the original arguments are passed (determined from the `args` variable)
			// 
			// example:
			//		Simply call an inherited function with the same signature.
			//	|	this.inherited(arguments);
			// example:
			//		Call an inherited method, replacing the arguments passed with "replacement" and "args"
			//	|	this.inherited(arguments, [replacement, args]);
			// example:
			//		Call an inherited method, passing an explicit name.
			//	|	this.inherited("method", arguments);
			// example:
			//		Call an inherited method by name, replacing the arguments:
			//	|	this.inherited("method", arguments, [replacement, args]);

			var a = arguments;
			// some magic crap that alters `arguments` to shift in the case of missing `name`
			if(typeof a[0] != "string"){ // inline'd type check
				newArgs = args;
				args = name;
				name = args.callee.nom;
			}
			a = newArgs || args; // WARNING: hitch()ed functions may pass a newArgs you aren't expecting.
			var c = args.callee, p = this.constructor.prototype, fn, mp;
			// if not an instance override
			if(this[name] != c || p[name] == c){
				// start from memoized prototype, or
				// find a prototype that has property 'name' == 'c'
				mp = (c.ctor || 0).superclass || this._findMethod(name, c, p, true);
				if(!mp){ throw(this.declaredClass + ': inherited method "' + name + '" mismatch'); }
				// find a prototype that has property 'name' != 'c'
				p = this._findMethod(name, c, mp, false);
			}
			// we expect 'name' to be in prototype 'p'
			fn = p && p[name];
			if(!fn){ throw( mp.declaredClass + ': inherited method "' + name + '" not found'); }
			// if the function exists, invoke it in our scope
			return fn.apply(this, a);
		}
	}
});
dojo.extend = function(/*Object*/ constructor, /*Object...*/ props){
	// summary:
	//		Adds all properties and methods of props to constructor's
	//		prototype, making them available to all instances created with
	//		constructor.
	for(var i=1, l=arguments.length; i<l; i++){
		dojo._mixin(constructor.prototype, arguments[i]);
	}
	return constructor; // Object
}
// Crockford (ish) functions

dojo.isString = function(/*anything*/ it){
	//	summary:
	//		Return true if it is a String
	return (typeof it == "string" || it instanceof String); // Boolean
}

dojo.isArray = function(/*anything*/ it){
	//	summary:
	//		Return true if it is an Array
	return it && (it instanceof Array || typeof it == "array"); // Boolean
}

/*=====
dojo.isFunction = function(it){
	// summary: Return true if it is a Function
	// it: anything
	return; // Boolean
}
=====*/

dojo.isFunction = (function(){
	var _isFunction = function(/*anything*/ it){
		var t = typeof it; // must evaluate separately due to bizarre Opera bug. See #8937
		//Firefox thinks object HTML element is a function, so test for nodeType.
		return it && (t == "function" || it instanceof Function) && !it.nodeType; // Boolean
	};

	return dojo.isSafari ?
		// only slow this down w/ gratuitious casting in Safari (not WebKit)
		function(/*anything*/ it){
			if(typeof it == "function" && it == "[object NodeList]"){ return false; }
			return _isFunction(it); // Boolean
		} : _isFunction;
})();

dojo.isObject = function(/*anything*/ it){
	// summary:
	//		Returns true if it is a JavaScript object (or an Array, a Function
	//		or null)
	return it !== undefined &&
		(it === null || typeof it == "object" || dojo.isArray(it) || dojo.isFunction(it)); // Boolean
}

dojo.isArrayLike = function(/*anything*/ it){
	//	summary:
	//		similar to dojo.isArray() but more permissive
	//	description:
	//		Doesn't strongly test for "arrayness".  Instead, settles for "isn't
	//		a string or number and has a length property". Arguments objects
	//		and DOM collections will return true when passed to
	//		dojo.isArrayLike(), but will return false when passed to
	//		dojo.isArray().
	//	returns:
	//		If it walks like a duck and quacks like a duck, return `true`
	var d = dojo;
	return it && it !== undefined && // Boolean
		// keep out built-in constructors (Number, String, ...) which have length
		// properties
		!d.isString(it) && !d.isFunction(it) &&
		!(it.tagName && it.tagName.toLowerCase() == 'form') &&
		(d.isArray(it) || isFinite(it.length));
}

dojo.isAlien = function(/*anything*/ it){
	// summary:
	//		Returns true if it is a built-in function or some other kind of
	//		oddball that *should* report as a function but doesn't
	return it && !dojo.isFunction(it) && /\{\s*\[native code\]\s*\}/.test(String(it)); // Boolean
}

dojo.isNumeric = function(n){
	return n==parseFloat(n);
}

dojo.isNumber = function(n){
	return typeof n == "number" || n instanceof Number;
}
["indexOf", "lastIndexOf", "forEach", "map", "some", "every", "filter"].forEach(
	function(name, idx){
		dojo[name] = function(arr, callback, thisObj){
			if((idx > 1) && (typeof callback == "string")){
				callback = new Function("item", "index", "array", callback);
			}
			return Array.prototype[name].call(arr, callback, thisObj);
		}
	}
);
