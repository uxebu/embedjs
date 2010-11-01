


/*********FILE**********
/src/dojo.js
********************/


var dojo = embed = {};
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

;(function(d){
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

	dojo.addOnLoad = dojo.ready = function(/*Object?*/obj, /*String|Function*/functionName){
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

;(function(d){

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



/*********FILE**********
/src/array/array.js
********************/


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



/*********FILE**********
/src/connect/connect.js
********************/


// this file courtesy of the TurboAjax Group, licensed under a Dojo CLA

// low-level delegation machinery
dojo._listener = {
	// create a dispatcher function
	getDispatcher: function(){
		// following comments pulled out-of-line to prevent cloning them 
		// in the returned function.
		// - indices (i) that are really in the array of listeners (ls) will 
		//   not be in Array.prototype. This is the 'sparse array' trick
		//   that keeps us safe from libs that take liberties with built-in 
		//   objects
		// - listener is invoked with current scope (this)
		return function(){
			var ap=Array.prototype, c=arguments.callee, ls=c._listeners, t=c.target;
			// return value comes from original target function
			var r = t && t.apply(this, arguments);
			// make local copy of listener array so it is immutable during processing
			var i, lls;
			lls = [].concat(ls);

			// invoke listeners after target function
			for(i in lls){
				if(!(i in ap)){
					lls[i].apply(this, arguments);
				}
			}
			// return value comes from original target function
			return r;
		};
	},
	// add a listener to an object
	add: function(/*Object*/ source, /*String*/ method, /*Function*/ listener){
		// Whenever 'method' is invoked, 'listener' will have the same scope.
		// Trying to supporting a context object for the listener led to 
		// complexity. 
		// Non trivial to provide 'once' functionality here
		// because listener could be the result of a dojo.hitch call,
		// in which case two references to the same hitch target would not
		// be equivalent. 
		source = source || dojo.global;
		// The source method is either null, a dispatcher, or some other function
		var f = source[method];
		// Ensure a dispatcher
		if(!f || !f._listeners){
			var d = dojo._listener.getDispatcher();
			// original target function is special
			d.target = f;
			// dispatcher holds a list of listeners
			d._listeners = []; 
			// redirect source to dispatcher
			f = source[method] = d;
		}
		// The contract is that a handle is returned that can 
		// identify this listener for disconnect. 
		//
		// The type of the handle is private. Here is it implemented as Integer. 
		// DOM event code has this same contract but handle is Function 
		// in non-IE browsers.
		//
		// We could have separate lists of before and after listeners.
		return f._listeners.push(listener); /*Handle*/
	},
	// remove a listener from an object
	remove: function(/*Object*/ source, /*String*/ method, /*Handle*/ handle){
		var f = (source || dojo.global)[method];
		// remember that handle is the index+1 (0 is not a valid handle)
		if(f && f._listeners && handle--){
			delete f._listeners[handle];
		}
	}
};

// Multiple delegation for arbitrary methods.

// This unit knows nothing about DOM, but we include DOM aware documentation
// and dontFix argument here to help the autodocs. Actual DOM aware code is in
// event.js.

dojo.connect = dojo.on = function(/*Object|null*/ obj, 
						/*String*/ event, 
						/*Object|null*/ context, 
						/*String|Function*/ method,
						/*Boolean?*/ dontFix){
	// summary:
	//		`dojo.connect` is the core event handling and delegation method in
	//		Dojo. It allows one function to "listen in" on the execution of
	//		any other, triggering the second whenever the first is called. Many
	//		listeners may be attached to a function, and source functions may
	//		be either regular function calls or DOM events.
	//
	// description:
	//		Connects listeners to actions, so that after event fires, a
	//		listener is called with the same arguments passed to the original
	//		function.
	//
	//		Since `dojo.connect` allows the source of events to be either a
	//		"regular" JavaScript function or a DOM event, it provides a uniform
	//		interface for listening to all the types of events that an
	//		application is likely to deal with though a single, unified
	//		interface. DOM programmers may want to think of it as
	//		"addEventListener for everything and anything".
	//
	//		When setting up a connection, the `event` parameter must be a
	//		string that is the name of the method/event to be listened for. If
	//		`obj` is null, `dojo.global` is assumed, meaning that connections
	//		to global methods are supported but also that you may inadvertently
	//		connect to a global by passing an incorrect object name or invalid
	//		reference.
	//
	//		`dojo.connect` generally is forgiving. If you pass the name of a
	//		function or method that does not yet exist on `obj`, connect will
	//		not fail, but will instead set up a stub method. Similarly, null
	//		arguments may simply be omitted such that fewer than 4 arguments
	//		may be required to set up a connection See the examples for details.
	//
	//		The return value is a handle that is needed to 
	//		remove this connection with `dojo.disconnect`.
	//
	// obj: 
	//		The source object for the event function. 
	//		Defaults to `dojo.global` if null.
	//		If obj is a DOM node, the connection is delegated 
	//		to the DOM event manager (unless dontFix is true).
	//
	// event:
	//		String name of the event function in obj. 
	//		I.e. identifies a property `obj[event]`.
	//
	// context: 
	//		The object that method will receive as "this".
	//
	//		If context is null and method is a function, then method
	//		inherits the context of event.
	//	
	//		If method is a string then context must be the source 
	//		object object for method (context[method]). If context is null,
	//		dojo.global is used.
	//
	// method:
	//		A function reference, or name of a function in context. 
	//		The function identified by method fires after event does. 
	//		method receives the same arguments as the event.
	//		See context argument comments for information on method's scope.
	//
	// dontFix:
	//		If obj is a DOM node, set dontFix to true to prevent delegation 
	//		of this connection to the DOM event manager.
	//
	// example:
	//		When obj.onchange(), do ui.update():
	//	|	dojo.connect(obj, "onchange", ui, "update");
	//	|	dojo.connect(obj, "onchange", ui, ui.update); // same
	//
	// example:
	//		Using return value for disconnect:
	//	|	var link = dojo.connect(obj, "onchange", ui, "update");
	//	|	...
	//	|	dojo.disconnect(link);
	//
	// example:
	//		When onglobalevent executes, watcher.handler is invoked:
	//	|	dojo.connect(null, "onglobalevent", watcher, "handler");
	//
	// example:
	//		When ob.onCustomEvent executes, customEventHandler is invoked:
	//	|	dojo.connect(ob, "onCustomEvent", null, "customEventHandler");
	//	|	dojo.connect(ob, "onCustomEvent", "customEventHandler"); // same
	//
	// example:
	//		When ob.onCustomEvent executes, customEventHandler is invoked
	//		with the same scope (this):
	//	|	dojo.connect(ob, "onCustomEvent", null, customEventHandler);
	//	|	dojo.connect(ob, "onCustomEvent", customEventHandler); // same
	//
	// example:
	//		When globalEvent executes, globalHandler is invoked
	//		with the same scope (this):
	//	|	dojo.connect(null, "globalEvent", null, globalHandler);
	//	|	dojo.connect("globalEvent", globalHandler); // same

	// normalize arguments
	var a=arguments, args=[], i=0;
	// if a[0] is a String, obj was omitted
	args.push(dojo.isString(a[0]) ? null : a[i++], a[i++]);
	// if the arg-after-next is a String or Function, context was NOT omitted
	var a1 = a[i+1];
	args.push(dojo.isString(a1)||dojo.isFunction(a1) ? a[i++] : null, a[i++]);
	// absorb any additional arguments
	for(var l=a.length; i<l; i++){	args.push(a[i]); }
	// do the actual work
	return dojo._connect.apply(this, args); /*Handle*/
}

// used by non-browser hostenvs. always overriden by event.js
dojo._connect = function(obj, event, context, method){
	var l=dojo._listener, h=l.add(obj, event, dojo.hitch(context, method)); 
	return [obj, event, h, l]; // Handle
}

dojo.disconnect = function(/*Handle*/ handle){
	// summary:
	//		Remove a link created by dojo.connect.
	// description:
	//		Removes the connection between event and the method referenced by handle.
	// handle:
	//		the return value of the dojo.connect call that created the connection.
	if(handle && handle[0] !== undefined){
		dojo._disconnect.apply(this, handle);
		// let's not keep this reference
		delete handle[0];
	}
}

dojo._disconnect = function(obj, event, handle, listener){
	listener.remove(obj, event, handle);
}



/*********FILE**********
/src/connect/event.js
********************/


;(function(){

var del = (dojo._event_listener = {
		add: function(/*DOMNode*/ node, /*String*/ name, /*Function*/ fp){
			if(!node){return;} 
			name = del._normalizeEventName(name);
			node.addEventListener(name, fp, false);
			return fp; /*Handle*/
		},
		remove: function(/*DOMNode*/ node, /*String*/ event, /*Handle*/ handle){
			// summary:
			//		clobbers the listener from the node
			// node:
			//		DOM node to attach the event to
			// event:
			//		the name of the handler to remove the function from
			// handle:
			//		the handle returned from add
			if(node){
				event = del._normalizeEventName(event);
				node.removeEventListener(event, handle, false);
			}
		},
		_normalizeEventName: function(/*String*/ name){
			// Generally, name should be lower case, unless it is special
			// somehow (e.g. a Mozilla DOM event).
			// Remove 'on'.
			return name.slice(0,2) =="on" ? name.slice(2) : name;
		}
	});

	// DOM events
	
	dojo.fixEvent = function(/*Event*/ evt, /*DOMNode*/ sender){
		// summary:
		//		normalizes properties on the event object including event
		//		bubbling methods, keystroke normalization, and x/y positions
		// evt: Event
		//		native event object
		// sender: DOMNode
		//		node to treat as "currentTarget"
		return del._fixEvent(evt, sender);
	};

	dojo.stopEvent = function(/*Event*/ evt){
		// summary:
		//		prevents propagation and clobbers the default action of the
		//		passed event
		// evt: Event
		//		The event object. If omitted, window.event is used on IE.
		evt.preventDefault();
		evt.stopPropagation();
		// NOTE: below, this method is overridden for IE
	};
	
	// Unify connect and event listeners
	dojo._connect = function(obj, event, context, method, dontFix){
		// FIXME: need a more strict test
		var isNode = obj && (obj.nodeType||obj.attachEvent||obj.addEventListener);
		// choose one of three listener options: raw (connect.js), DOM event on a Node, custom event on a Node
		// we need the third option to provide leak prevention on broken browsers (IE)
		var lid = isNode ? 1 : 0, l = [dojo._listener, del][lid];
		// create a listener
		var h = l.add(obj, event, dojo.hitch(context, method));
		// formerly, the disconnect package contained "l" directly, but if client code
		// leaks the disconnect package (by connecting it to a node), referencing "l" 
		// compounds the problem.
		// instead we return a listener id, which requires custom _disconnect below.
		// return disconnect package
		return [ obj, event, h, lid ];
	};

	dojo._disconnect = function(obj, event, handle, listener){
		([dojo._listener, del][listener]).remove(obj, event, handle);
	};

	
})();



/*********FILE**********
/src/connect/pubsub.js
********************/



// topic publish/subscribe

dojo._topics = {};

dojo.subscribe = function(/*String*/ topic, /*Object|null*/ context, /*String|Function*/ method){
	//	summary:
	//		Attach a listener to a named topic. The listener function is invoked whenever the
	//		named topic is published (see: dojo.publish).
	//		Returns a handle which is needed to unsubscribe this listener.
	//	context:
	//		Scope in which method will be invoked, or null for default scope.
	//	method:
	//		The name of a function in context, or a function reference. This is the function that
	//		is invoked when topic is published.
	//	example:
	//	|	dojo.subscribe("alerts", null, function(caption, message){ alert(caption + "\n" + message); });
	//	|	dojo.publish("alerts", [ "read this", "hello world" ]);																	

	// support for 2 argument invocation (omitting context) depends on hitch
	return [topic, dojo._listener.add(dojo._topics, topic, dojo.hitch(context, method))]; /*Handle*/
}

dojo.unsubscribe = function(/*Handle*/ handle){
	//	summary:
	//	 	Remove a topic listener. 
	//	handle:
	//	 	The handle returned from a call to subscribe.
	//	example:
	//	|	var alerter = dojo.subscribe("alerts", null, function(caption, message){ alert(caption + "\n" + message); };
	//	|	...
	//	|	dojo.unsubscribe(alerter);
	if(handle){
		dojo._listener.remove(dojo._topics, handle[0], handle[1]);
	}
}

dojo.publish = function(/*String*/ topic, /*Array*/ args){
	//	summary:
	//	 	Invoke all listener method subscribed to topic.
	//	topic:
	//	 	The name of the topic to publish.
	//	args:
	//	 	An array of arguments. The arguments will be applied 
	//	 	to each topic subscriber (as first class parameters, via apply).
	//	example:
	//	|	dojo.subscribe("alerts", null, function(caption, message){ alert(caption + "\n" + message); };
	//	|	dojo.publish("alerts", [ "read this", "hello world" ]);	

	// Note that args is an array, which is more efficient vs variable length
	// argument list.  Ideally, var args would be implemented via Array
	// throughout the APIs.
	var f = dojo._topics[topic];
	if(f){
		f.apply(this, args||[]);
	}
}

dojo.connectPublisher = function(	/*String*/ topic, 
									/*Object|null*/ obj, 
									/*String*/ event){
	//	summary:
	//	 	Ensure that every time obj.event() is called, a message is published
	//	 	on the topic. Returns a handle which can be passed to
	//	 	dojo.disconnect() to disable subsequent automatic publication on
	//	 	the topic.
	//	topic:
	//	 	The name of the topic to publish.
	//	obj: 
	//	 	The source object for the event function. Defaults to dojo.global
	//	 	if null.
	//	event:
	//	 	The name of the event function in obj. 
	//	 	I.e. identifies a property obj[event].
	//	example:
	//	|	dojo.connectPublisher("/ajax/start", dojo, "xhrGet");
	var pf = function(){ dojo.publish(topic, arguments); }
	return event ? dojo.connect(obj, event, pf) : dojo.connect(obj, pf); //Handle
};



/*********FILE**********
<<<<<<< HEAD
/src/oo/extend.js
********************/


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



/*********FILE**********
/src/lang/is.js
********************/


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



/*********FILE**********
=======
>>>>>>> 88bad071aa234f65b7cc7fddbc1f2030ab2d051d
/src/lang/hitch.js
********************/


dojo._hitchArgs = function(scope, method /*,...*/){
	var pre = dojo._toArray(arguments, 2);
	var named = dojo.isString(method);
	return function(){
		// arrayify arguments
		var args = dojo._toArray(arguments);
		// locate our method
		var f = named ? (scope||dojo.global)[method] : method;
		// invoke with collected args
		return f && f.apply(scope || this, pre.concat(args)); // mixed
 	} // Function
}

dojo.hitch = function(/*Object*/scope, /*Function|String*/method /*,...*/){
	//	summary:
	//		Returns a function that will only ever execute in the a given scope.
	//		This allows for easy use of object member functions
	//		in callbacks and other places in which the "this" keyword may
	//		otherwise not reference the expected scope.
	//		Any number of default positional arguments may be passed as parameters
	//		beyond "method".
	//		Each of these values will be used to "placehold" (similar to curry)
	//		for the hitched function.
	//	scope:
	//		The scope to use when method executes. If method is a string,
	//		scope is also the object containing method.
	//	method:
	//		A function to be hitched to scope, or the name of the method in
	//		scope to be hitched.
	//	example:
	//	|	dojo.hitch(foo, "bar")();
	//		runs foo.bar() in the scope of foo
	//	example:
	//	|	dojo.hitch(foo, myFunction);
	//		returns a function that runs myFunction in the scope of foo
	if(arguments.length > 2){
		return dojo._hitchArgs.apply(dojo, arguments); // Function
	}
	if(!method){
		method = scope;
		scope = null;
	}
	if(dojo.isString(method)){
		scope = scope || dojo.global;
		if(!scope[method]){ throw(['dojo.hitch: scope["', method, '"] is null (scope="', scope, '")'].join('')); }
		return function(){ return scope[method].apply(scope, arguments || []); }; // Function
	}
	return !scope ? method : function(){ return method.apply(scope, arguments || []); }; // Function
}



/*********FILE**********
/src/promise/promise.js
********************/


;(function(d){

(function(){
	dojo.__mutator = function(){};		
	var freeze = Object.freeze || function(){};
	// A deferred provides an API for creating and resolving a promise.
	dojo.Promise = function(/*Function?*/canceller){
		// summary:
		//		Deferreds provide a generic means for encapsulating an asynchronous
		// 		operation and notifying users of the completion and result of the operation. 
		// description:
		//		The dojo.Deferred API is based on the concept of promises that provide a
		//		generic interface into the eventual completion of an asynchronous action.
		//		The motivation for promises fundamentally is about creating a 
		//		separation of concerns that allows one to achieve the same type of 
		//		call patterns and logical data flow in asynchronous code as can be 
		//		achieved in synchronous code. Promises allows one 
		//		to be able to call a function purely with arguments needed for 
		//		execution, without conflating the call with concerns of whether it is 
		//		sync or async. One shouldn't need to alter a call's arguments if the 
		//		implementation switches from sync to async (or vice versa). By having 
		//		async functions return promises, the concerns of making the call are 
		//		separated from the concerns of asynchronous interaction (which are 
		//		handled by the promise).
		// 
		//  	The dojo.Deferred is a type of promise that provides methods for fulfilling the 
		// 		promise with a successful result or an error. The most important method for 
		// 		working with Dojo's promises is the then() method, which follows the 
		// 		CommonJS proposed promise API. An example of using a Dojo promise:
		//		
		//		| 	var resultingPromise = someAsyncOperation.then(function(result){
		//		|		... handle result ...
		//		|	},
		//		|	function(error){
		//		|		... handle error ...
		//		|	});
		//	
		//		The .then() call returns a new promise that represents the result of the 
		// 		execution of the callback. The callbacks will never affect the original promises value.
		//
		//		The dojo.Deferred instances also provide the following functions for backwards compatibility:
		//
		//			* addCallback(handler)
		//			* addErrback(handler)
		//			* callback(result)
		//			* errback(result)
		//
		//		Callbacks are allowed to return promisesthemselves, so
		//		you can build complicated sequences of events with ease.
		//
		//		The creator of the Deferred may specify a canceller.  The canceller
		//		is a function that will be called if Deferred.cancel is called
		//		before the Deferred fires. You can use this to implement clean
		//		aborting of an XMLHttpRequest, etc. Note that cancel will fire the
		//		deferred with a CancelledError (unless your canceller returns
		//		another kind of error), so the errbacks should be prepared to
		//		handle that error for cancellable Deferreds.
		// example:
		//	|	var deferred = new dojo.Deferred();
		//	|	setTimeout(function(){ deferred.callback({success: true}); }, 1000);
		//	|	return deferred;
		// example:
		//		Deferred objects are often used when making code asynchronous. It
		//		may be easiest to write functions in a synchronous manner and then
		//		split code using a deferred to trigger a response to a long-lived
		//		operation. For example, instead of register a callback function to
		//		denote when a rendering operation completes, the function can
		//		simply return a deferred:
		//
		//		|	// callback style:
		//		|	function renderLotsOfData(data, callback){
		//		|		var success = false
		//		|		try{
		//		|			for(var x in data){
		//		|				renderDataitem(data[x]);
		//		|			}
		//		|			success = true;
		//		|		}catch(e){ }
		//		|		if(callback){
		//		|			callback(success);
		//		|		}
		//		|	}
		//
		//		|	// using callback style
		//		|	renderLotsOfData(someDataObj, function(success){
		//		|		// handles success or failure
		//		|		if(!success){
		//		|			promptUserToRecover();
		//		|		}
		//		|	});
		//		|	// NOTE: no way to add another callback here!!
		// example:
		//		Using a Deferred doesn't simplify the sending code any, but it
		//		provides a standard interface for callers and senders alike,
		//		providing both with a simple way to service multiple callbacks for
		//		an operation and freeing both sides from worrying about details
		//		such as "did this get called already?". With Deferreds, new
		//		callbacks can be added at any time.
		//
		//		|	// Deferred style:
		//		|	function renderLotsOfData(data){
		//		|		var d = new dojo.Deferred();
		//		|		try{
		//		|			for(var x in data){
		//		|				renderDataitem(data[x]);
		//		|			}
		//		|			d.callback(true);
		//		|		}catch(e){ 
		//		|			d.errback(new Error("rendering failed"));
		//		|		}
		//		|		return d;
		//		|	}
		//
		//		|	// using Deferred style
		//		|	renderLotsOfData(someDataObj).then(null, function(){
		//		|		promptUserToRecover();
		//		|	});
		//		|	// NOTE: addErrback and addCallback both return the Deferred
		//		|	// again, so we could chain adding callbacks or save the
		//		|	// deferred for later should we need to be notified again.
		// example:
		//		In this example, renderLotsOfData is syncrhonous and so both
		//		versions are pretty artificial. Putting the data display on a
		//		timeout helps show why Deferreds rock:
		//
		//		|	// Deferred style and async func
		//		|	function renderLotsOfData(data){
		//		|		var d = new dojo.Deferred();
		//		|		setTimeout(function(){
		//		|			try{
		//		|				for(var x in data){
		//		|					renderDataitem(data[x]);
		//		|				}
		//		|				d.callback(true);
		//		|			}catch(e){ 
		//		|				d.errback(new Error("rendering failed"));
		//		|			}
		//		|		}, 100);
		//		|		return d;
		//		|	}
		//
		//		|	// using Deferred style
		//		|	renderLotsOfData(someDataObj).then(null, function(){
		//		|		promptUserToRecover();
		//		|	});
		//
		//		Note that the caller doesn't have to change his code at all to
		//		handle the asynchronous case.
		var result, finished, isError, head, nextListener;
		var promise = this.promise = {};
		
		function complete(value){
			if(finished){
				throw new Error("This deferred has already been resolved");				
			}
			result = value;
			finished = true;
			notify();
		}
		function notify(){
			var mutated;
			while(!mutated && nextListener){
				var listener = nextListener;
				nextListener = nextListener.next;
				if(mutated = (listener.progress == dojo.__mutator)){ // assignment and check
					finished = false;
				}
				var func = (isError ? listener.error : listener.resolved);
				if (func) {
					try {
						var newResult = func(result);
						if (newResult && typeof newResult.then === "function") {
							newResult.then(dojo.hitch(listener.deferred, "resolve"), dojo.hitch(listener.deferred, "reject"));
							continue;
						}
						var unchanged = mutated && newResult === undefined;
						listener.deferred[unchanged && isError ? "reject" : "resolve"](unchanged ? result : newResult);
					}
					catch (e) {
						listener.deferred.reject(e);
					}
				}else {
					if(isError){
						listener.deferred.reject(result);
					}else{
						listener.deferred.resolve(result);
					}
				}
			}	
		}
		// calling resolve will resolve the promise
		this.resolve = function(value){
			// summary:
			//		Fulfills the Deferred instance successfully with the provide value
			this.fired = 0;
			this.results = [value, null];
			complete(value);
		};
		
		
		// calling error will indicate that the promise failed
		this.reject = function(error){
			// summary:
			//		Fulfills the Deferred instance as an error with the provided error 
			isError = true;
			this.fired = 1;
			complete(error);
			this.results = [null, error];
			if(!error || error.log !== false){
				(dojo.config.deferredOnError || function(x){ console.error(x); })(error);
			}
		};
		// call progress to provide updates on the progress on the completion of the promise
		this.progress = function(update){
			// summary
			//		Send progress events to all listeners
			var listener = nextListener;
			while(listener){
				var progress = listener.progress;
				progress && progress(update);
				listener = listener.next;	
			}
		};
		// provide the implementation of the promise
		this.then = promise.then = function(/*Function?*/resolvedCallback, /*Function?*/errorCallback, /*Function?*/progressCallback){
			// summary
			// 		Adds a fulfilledHandler, errorHandler, and progressHandler to be called for 
			// 		completion of a promise. The fulfilledHandler is called when the promise 
			// 		is fulfilled. The errorHandler is called when a promise fails. The 
			// 		progressHandler is called for progress events. All arguments are optional 
			// 		and non-function values are ignored. The progressHandler is not only an 
			// 		optional argument, but progress events are purely optional. Promise 
			// 		providers are not required to ever create progress events.
			// 
			// 		This function will return a new promise that is fulfilled when the given 
			// 		fulfilledHandler or errorHandler callback is finished. This allows promise 
			// 		operations to be chained together. The value returned from the callback 
			// 		handler is the fulfillment value for the returned promise. If the callback 
			// 		throws an error, the returned promise will be moved to failed state.
			//	
			// example:
			// 		An example of using a CommonJS compliant promise:
  			//		|	asyncComputeTheAnswerToEverything().
			//		|		then(addTwo).
			//		|		then(printResult, onError);
  			//		|	>44 
			// 		
			var returnDeferred = progressCallback == dojo.__mutator ? this : new dojo.Promise(promise.cancel);
			var listener = {
				resolved: resolvedCallback, 
				error: errorCallback, 
				progress: progressCallback, 
				deferred: returnDeferred
			}; 
			if(nextListener){
				head = head.next = listener;
			}
			else{
				nextListener = head = listener;
			}
			if(finished){
				notify();
			}
			return returnDeferred.promise;
		};
		var deferred = this;
		this.cancel = promise.cancel = function () {
			// summary:
			//		Cancels the asynchronous operation
			if(!finished){
				var error = canceller && canceller(deferred);
				if(!finished){
					if (!(error instanceof Error)) {
						error = new Error(error);
					}
					error.log = false;
					deferred.reject(error);
				}
			}
		}
		freeze(promise);
	};
})();

})(dojo);



/*********FILE**********
/src/promise/when.js
********************/


dojo.when = function(promiseOrValue, /*Function?*/callback, /*Function?*/errback, /*Function?*/progressHandler){
	// summary:
	//		This provides normalization between normal synchronous values and 
	//		asynchronous promises, so you can interact with them in a common way
	//	example:
	//		|	function printFirstAndList(items){
	//		|		dojo.when(findFirst(items), console.log);
	//		|		dojo.when(findLast(items), console.log);
	//		|	}
	//		|	function findFirst(items){
	//		|		return dojo.when(items, function(items){
	//		|			return items[0];
	//		|		});
	//		|	}
	//		|	function findLast(items){
	//		|		return dojo.when(items, function(items){
	//		|			return items[items.length];
	//		|		});
	//		|	}
	//		And now all three of his functions can be used sync or async.
	//		|	printFirstAndLast([1,2,3,4]) will work just as well as
	//		|	printFirstAndLast(dojo.xhrGet(...));
	
	if(promiseOrValue && typeof promiseOrValue.then === "function"){
		return promiseOrValue.then(callback, errback, progressHandler);
	}
	return callback(promiseOrValue);
};



/*********FILE**********
/src/oo/extend.js
********************/


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



/*********FILE**********
/src/deferred/deferred.js
********************/


dojo.Deferred = dojo.Promise;

dojo.extend(dojo.Deferred, {
	callback: function(value){
		this.resolve(value);
	},
	errback: function(error){
		this.reject(error);
	},
	addCallbacks: function(/*Function?*/callback, /*Function?*/errback){
		this.then(callback, errback, dojo.__mutator);
		return this;
	},
	addCallback: function (/*Function*/callback) {
		return this.addCallbacks(dojo.hitch.apply(dojo, arguments));
	},

	addErrback: function (/*Function*/errback) {
		return this.addCallbacks(null, dojo.hitch.apply(dojo, arguments));
	},

	addBoth: function (/*Function*/callback) {
		var enclosed = dojo.hitch.apply(dojo, arguments);
		return this.addCallbacks(enclosed, enclosed);
	},
	fired: -1
});



/*********FILE**********
/src/destroy/destroy.js
********************/


;(function(d){

	var _destroyContainer = null,
		_destroyDoc;

	d.destroy = function(/*String|DomNode*/node){
		//	summary:
		//		Removes a node from its parent, clobbering it and all of its
		//		children.
		//
		//	description:
		//		Removes a node from its parent, clobbering it and all of its
		//		children. Function only works with DomNodes, and returns nothing.
		//
		//	node:
		//		A String ID or DomNode reference of the element to be destroyed
		//
		//	example:
		//	Destroy a node byId:
		//	|	dojo.destroy("someId");
		//
		//	example:
		//	Destroy all nodes in a list by reference:
		//	|	dojo.query(".someNode").forEach(dojo.destroy);

		node = dojo.byId(node);
		try{
			var doc = node.ownerDocument;
			// cannot use _destroyContainer.ownerDocument since this can throw an exception on IE
			if(!_destroyContainer || _destroyDoc != doc){
				_destroyContainer = doc.createElement("div");
				_destroyDoc = doc;
			}
			_destroyContainer.appendChild(node.parentNode ? node.parentNode.removeChild(node) : node);
			// NOTE: see http://trac.dojotoolkit.org/ticket/2931. This may be a bug and not a feature
			_destroyContainer.innerHTML = "";
		}catch(e){
			/* squelch */
		}
	};
})(dojo);



/*********FILE**********
/src/html/html.js
********************/


;(function(d){

	var byId = d.byId;
	
	// support stuff for dojo._toDom
	var tagWrap = {
			option: ["select"],
			tbody: ["table"],
			thead: ["table"],
			tfoot: ["table"],
			tr: ["table", "tbody"],
			td: ["table", "tbody", "tr"],
			th: ["table", "thead", "tr"],
			legend: ["fieldset"],
			caption: ["table"],
			colgroup: ["table"],
			col: ["table", "colgroup"],
			li: ["ul"]
		},
		reTag = /<\s*([\w\:]+)/,
		masterNode = {}, masterNum = 0,
		masterName = "__" + d._scopeName + "ToDomId";

	// generate start/end tag strings to use
	// for the injection for each special tag wrap case.
	for(var param in tagWrap){
		var tw = tagWrap[param];
		tw.pre  = param == "option" ? '<select multiple="multiple">' : "<" + tw.join("><") + ">";
		tw.post = "</" + tw.reverse().join("></") + ">";
		// the last line is destructive: it reverses the array,
		// but we don't care at this point
	}

	d._toDom = function(frag, doc){
		//	summary:
		// 		converts HTML string into DOM nodes.

		doc = doc || d.doc;
		var masterId = doc[masterName];
		if(!masterId){
			doc[masterName] = masterId = ++masterNum + "";
			masterNode[masterId] = doc.createElement("div");
		}

		// make sure the frag is a string.
		frag += "";

		// find the starting tag, and get node wrapper
		var match = frag.match(reTag),
			tag = match ? match[1].toLowerCase() : "",
			master = masterNode[masterId],
			wrap, i, fc, df;
		if(match && tagWrap[tag]){
			wrap = tagWrap[tag];
			master.innerHTML = wrap.pre + frag + wrap.post;
			for(i = wrap.length; i; --i){
				master = master.firstChild;
			}
		}else{
			master.innerHTML = frag;
		}

		// one node shortcut => return the node itself
		if(master.childNodes.length == 1){
			return master.removeChild(master.firstChild); // DOMNode
		}

		// return multiple nodes as a document fragment
		df = doc.createDocumentFragment();
		while(fc = master.firstChild){ // intentional assignment
			df.appendChild(fc);
		}
		return df; // DOMNode
	}

	d._docScroll = function(){
		var n = d.global;
		return "pageXOffset" in n? { x:n.pageXOffset, y:n.pageYOffset } :
			(n=d.doc.documentElement, n.clientHeight? { x:n.scrollLeft, y:n.scrollTop } :
			(n=d.body(), { x:n.scrollLeft||0, y:n.scrollTop||0 }));
	};

	var _insertBefore = function(/*DomNode*/node, /*DomNode*/ref){
		var parent = ref.parentNode;
		if(parent){
			parent.insertBefore(node, ref);
		}
	};

	var _insertAfter = function(/*DomNode*/node, /*DomNode*/ref){
		//	summary:
		//		Try to insert node after ref
		var parent = ref.parentNode;
		if(parent){
			if(parent.lastChild == ref){
				parent.appendChild(node);
			}else{
				parent.insertBefore(node, ref.nextSibling);
			}
		}
	};

	d.place = function(node, refNode, position){
		//	summary:
		//		Attempt to insert node into the DOM, choosing from various positioning options.
		//		Returns the first argument resolved to a DOM node.
		//
		//	node: String|DomNode
		//		id or node reference, or HTML fragment starting with "<" to place relative to refNode
		//
		//	refNode: String|DomNode
		//		id or node reference to use as basis for placement
		//
		//	position: String|Number?
		//		string noting the position of node relative to refNode or a
		//		number indicating the location in the childNodes collection of refNode.
		//		Accepted string values are:
		//	|	* before
		//	|	* after
		//	|	* replace
		//	|	* only
		//	|	* first
		//	|	* last
		//		"first" and "last" indicate positions as children of refNode, "replace" replaces refNode,
		//		"only" replaces all children.  position defaults to "last" if not specified
		//
		//	returns: DomNode
		//		Returned values is the first argument resolved to a DOM node.
		//
		//		.place() is also a method of `dojo.NodeList`, allowing `dojo.query` node lookups.
		//
		// example:
		//		Place a node by string id as the last child of another node by string id:
		//	|	dojo.place("someNode", "anotherNode");
		//
		// example:
		//		Place a node by string id before another node by string id
		//	|	dojo.place("someNode", "anotherNode", "before");
		//
		// example:
		//		Create a Node, and place it in the body element (last child):
		//	|	dojo.place("<div></div>", dojo.body());
		//
		// example:
		//		Put a new LI as the first child of a list by id:
		//	|	dojo.place("<li></li>", "someUl", "first");

		refNode = byId(refNode);
		if(typeof node == "string"){ // inline'd type check
			node = node.charAt(0) == "<" ? d._toDom(node, refNode.ownerDocument) : byId(node);
		}
		if(typeof position == "number"){ // inline'd type check
			var cn = refNode.childNodes;
			if(!cn.length || cn.length <= position){
				refNode.appendChild(node);
			}else{
				_insertBefore(node, cn[position < 0 ? 0 : position]);
			}
		}else{
			switch(position){
				case "before":
					_insertBefore(node, refNode);
					break;
				case "after":
					_insertAfter(node, refNode);
					break;
				case "replace":
					refNode.parentNode.replaceChild(node, refNode);
					break;
				case "only":
					d.empty(refNode);
					refNode.appendChild(node);
					break;
				case "first":
					if(refNode.firstChild){
						_insertBefore(node, refNode.firstChild);
						break;
					}
					// else fallthrough...
				default: // aka: last
					refNode.appendChild(node);
			}
		}
		return node; // DomNode
	};
	
	d.create = function(tag, attrs, refNode, pos){
		//	summary:
		//		Create an element, allowing for optional attribute decoration
		//		and placement.
		//
		// description:
		//		A DOM Element creation function. A shorthand method for creating a node or
		//		a fragment, and allowing for a convenient optional attribute setting step,
		//		as well as an optional DOM placement reference.
		//|
		//		Attributes are set by passing the optional object through `dojo.attr`.
		//		See `dojo.attr` for noted caveats and nuances, and API if applicable.
		//|
		//		Placement is done via `dojo.place`, assuming the new node to be the action 
		//		node, passing along the optional reference node and position.
		//
		// tag: String|DomNode
		//		A string of the element to create (eg: "div", "a", "p", "li", "script", "br"),
		//		or an existing DOM node to process.
		//
		// attrs: Object
		//		An object-hash of attributes to set on the newly created node.
		//		Can be null, if you don't want to set any attributes/styles.
		//		See: `dojo.attr` for a description of available attributes.
		//		TODO: Clarify what attrs are allowed.
		//
		// refNode: String?|DomNode?
		//		Optional reference node. Used by `dojo.place` to place the newly created
		//		node somewhere in the dom relative to refNode. Can be a DomNode reference
		//		or String ID of a node.
		//
		// pos: String?
		//		Optional positional reference. Defaults to "last" by way of `dojo.place`,
		//		though can be set to "first","after","before","last", "replace" or "only"
		//		to further control the placement of the new node relative to the refNode.
		//		'refNode' is required if a 'pos' is specified.
		//
		// returns: DomNode
		//
		// example:
		//	Create a DIV:
		//	|	var n = dojo.create("div");
		//
		// example:
		//	Create a DIV with content:
		//	|	var n = dojo.create("div", { innerHTML:"<p>hi</p>" });
		//
		// example:
		//	Place a new DIV in the BODY, with no attributes set
		//	|	var n = dojo.create("div", null, dojo.body());
		//
		// example:
		//	Create an UL, and populate it with LI's. Place the list as the first-child of a 
		//	node with id="someId":
		//	|	var ul = dojo.create("ul", null, "someId", "first");
		//	|	var items = ["one", "two", "three", "four"];
		//	|	dojo.forEach(items, function(data){
		//	|		dojo.create("li", { innerHTML: data }, ul);
		//	|	});
		//
		// example:
		//	Create an anchor, with an href. Place in BODY:
		//	|	dojo.create("a", { href:"foo.html", title:"Goto FOO!" }, dojo.body());
		//
		// example:
		//	Create a `dojo.NodeList()` from a new element (for syntatic sugar):
		//	|	dojo.query(dojo.create('div'))
		//	|		.addClass("newDiv")
		//	|		.onclick(function(e){ console.log('clicked', e.target) })
		//	|		.place("#someNode"); // redundant, but cleaner.

		var doc = d.doc;
		if(refNode){
			refNode = byId(refNode);
			doc = refNode.ownerDocument;
		}
		if(typeof tag == "string"){ // inline'd type check
			tag = doc.createElement(tag);
		}
		if(attrs){
			//d.attr(tag, attrs);
			for(var prop in attrs){
				switch(prop){
					case 'class':
						tag.className = attrs[prop];
						break;
					default:
						tag[prop] = attrs[prop];
				}
			}
		}
		if(refNode){ d.place(tag, refNode, pos); }
		return tag; // DomNode
	};
	
	d.empty = function(node){
		byId(node).innerHTML = "";
	};

})(dojo);



/*********FILE**********
/src/lang/string.js
********************/


/*=====
dojo.trim = function(str){
	//	summary:
	//		Trims whitespace from both sides of the string
	//	str: String
	//		String to be trimmed
	//	returns: String
	//		Returns the trimmed string
	//	description:
	//		This version of trim() was selected for inclusion into the base due
	//		to its compact size and relatively good performance
	//		(see [Steven Levithan's blog](http://blog.stevenlevithan.com/archives/faster-trim-javascript)
	//		Uses String.prototype.trim instead, if available.
	//		The fastest but longest version of this function is located at
	//		dojo.string.trim()
	return "";	// String
}
=====*/

dojo.trim = String.prototype.trim ?
	function(str){ return str.trim(); } :
	function(str){ return str.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };

/*=====
dojo.replace = function(tmpl, map, pattern){
	//	summary:
	//		Performs parameterized substitutions on a string. Throws an
	//		exception if any parameter is unmatched. 
	//	tmpl: String
	//		String to be used as a template.
	//	map: Object|Function
	//		If an object, it is used as a dictionary to look up substitutions.
	//		If a function, it is called for every substitution with following
	//		parameters: a whole match, a name, an offset, and the whole template
	//		string (see https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/String/replace
	//		for more details).
	//	pattern: RegEx?
	//		Optional regular expression objects that overrides the default pattern.
	//		Must be global and match one item. The default is: /\{([^\}]+)\}/g,
	//		which matches patterns like that: "{xxx}", where "xxx" is any sequence
	//		of characters, which doesn't include "}".
	//	returns: String
	//		Returns the substituted string.
	//	example:
	//	|	// uses a dictionary for substitutions:
	//	|	dojo.replace("Hello, {name.first} {name.last} AKA {nick}!",
	//	|	  {
	//	|	    nick: "Bob",
	//	|	    name: {
	//	|	      first:  "Robert",
	//	|	      middle: "X",
	//	|	      last:   "Cringely"
	//	|	    }
	//	|	  });
	//	|	// returns: Hello, Robert Cringely AKA Bob!
	//	example:
	//	|	// uses an array for substitutions:
	//	|	dojo.replace("Hello, {0} {2}!",
	//	|	  ["Robert", "X", "Cringely"]);
	//	|	// returns: Hello, Robert Cringely!
	//	example:
	//	|	// uses a function for substitutions:
	//	|	function sum(a){
	//	|	  var t = 0;
	//	|	  dojo.forEach(a, function(x){ t += x; });
	//	|	  return t;
	//	|	}
	//	|	dojo.replace(
	//	|	  "{count} payments averaging {avg} USD per payment.",
	//	|	  dojo.hitch(
	//	|	    { payments: [11, 16, 12] },
	//	|	    function(_, key){
	//	|	      switch(key){
	//	|	        case "count": return this.payments.length;
	//	|	        case "min":   return Math.min.apply(Math, this.payments);
	//	|	        case "max":   return Math.max.apply(Math, this.payments);
	//	|	        case "sum":   return sum(this.payments);
	//	|	        case "avg":   return sum(this.payments) / this.payments.length;
	//	|	      }
	//	|	    }
	//	|	  )
	//	|	);
	//	|	// prints: 3 payments averaging 13 USD per payment.
	//	example:
	//	|	// uses an alternative PHP-like pattern for substitutions:
	//	|	dojo.replace("Hello, ${0} ${2}!",
	//	|	  ["Robert", "X", "Cringely"], /\$\{([^\}]+)\}/g);
	//	|	// returns: Hello, Robert Cringely!
	return "";	// String
}
=====*/

var _pattern = /\{([^\}]+)\}/g;
dojo.replace = function(tmpl, map, pattern){
	return tmpl.replace(pattern || _pattern, dojo.isFunction(map) ?
		map : function(_, k){ return dojo.getObject(k, false, map); });
};



/*********FILE**********
/src/html/class.js
********************/


dojo.hasClass = function(/*DomNode|String*/node, /*String*/classStr){
	//	summary:
	//		Returns whether or not the specified classes are a portion of the
	//		class list currently applied to the node.
	//
	//	node:
	//		String ID or DomNode reference to check the class for.
	//
	//	classStr:
	//		A string class name to look for.
	//
	//	example:
	//	| if(dojo.hasClass("someNode","aSillyClassName")){ ... }
	return ((" "+ dojo.byId(node).className +" ").indexOf(" " + classStr + " ") >= 0);  // Boolean
};

dojo.toggleClass = function(/*DomNode|String*/node, /*String*/classStr, /*Boolean?*/condition){
	//	summary:
	//		Adds a class to node if not present, or removes if present.
	//		Pass a boolean condition if you want to explicitly add or remove.
	//	condition:
	//		If passed, true means to add the class, false means to remove.
	//
	// example:
	//	| dojo.toggleClass("someNode", "hovered");
	//
	// example:
	// 	Forcefully add a class
	//	| dojo.toggleClass("someNode", "hovered", true);
	//
	// example:
	//	Available in `dojo.NodeList` for multiple toggles
	//	| dojo.query(".toggleMe").toggleClass("toggleMe");

	if(condition === undefined){
		condition = !dojo.hasClass(node, classStr);
	}
	dojo[condition ? "addClass" : "removeClass"](node, classStr);
};

(function(){
	var spaces = /\s+/;
	var str2array = function(s){
		if(typeof s == "string" || s instanceof String){
			if(s.indexOf(" ") < 0){
				return [s];
			}else{
				return dojo.trim(s).split(spaces);
			}
		}
		// assumed to be an array
		return s;
	};

	dojo.addClass = function(node, classStr){
		//	summary:
		//		Adds the specified classes to the end of the class list on the
		//		passed node. Will not re-apply duplicate classes.
		//
		//	node: DomNode|String
		//		String ID or DomNode reference to add a class string too
		//
		//	classStr: String|Array
		//		A String class name to add, or several space-separated class names,
		//		or an array of class names.
		//
		// example:
		//	Add a class to some node:
		//	|	dojo.addClass("someNode", "anewClass");
		//
		// example:
		//	Add two classes at once:
		//	| 	dojo.addClass("someNode", "firstClass secondClass");
		//
		// example:
		//	Add two classes at once (using array):
		//	| 	dojo.addClass("someNode", ["firstClass", "secondClass"]);
		//
		// example:
		//	Available in `dojo.NodeList` for multiple additions
		//	| dojo.query("ul > li").addClass("firstLevel");
	
		node = dojo.byId(node);
		classStr = str2array(classStr);
		var cls = " " + node.className + " ";
		for(var i = 0, len = classStr.length, c; i < len; ++i){
			c = classStr[i];
			if(c && cls.indexOf(" " + c + " ") < 0){
				cls += c + " ";
			}
		}
		node.className = dojo.trim(cls);
	};
	
	dojo.removeClass = function(/*DomNode|String*/node, /*String|Array?*/classStr){
		// summary:
		//		Removes the specified classes from node. No `dojo.hasClass`
		//		check is required.
		//
		// node:
		// 		String ID or DomNode reference to remove the class from.
		//
		// classStr:
		//		An optional String class name to remove, or several space-separated
		//		class names, or an array of class names. If omitted, all class names
		//		will be deleted.
		//
		// example:
		//	Remove a class from some node:
		// 	| dojo.removeClass("someNode", "firstClass");
		//
		// example:
		//	Remove two classes from some node:
		// 	| dojo.removeClass("someNode", "firstClass secondClass");
		//
		// example:
		//	Remove two classes from some node (using array):
		// 	| dojo.removeClass("someNode", ["firstClass", "secondClass"]);
		//
		// example:
		//	Remove all classes from some node:
		// 	| dojo.removeClass("someNode");
		//
		// example:
		//	Available in `dojo.NodeList` for multiple removal
		//	| dojo.query(".foo").removeClass("foo");
	
		node = dojo.byId(node);
		var cls;
		if(classStr !== undefined){
			classStr = str2array(classStr);
			cls = " " + node.className + " ";
			for(var i = 0, len = classStr.length; i < len; ++i){
				cls = cls.replace(" " + classStr[i] + " ", " ");
			}
			cls = dojo.trim(cls);
		}else{
			cls = "";
		}
		if(node.className != cls){ node.className = cls; }
	};
})();



/*********FILE**********
/src/html/style.js
********************/


;(function(d){

	// =============================
	// Style Functions
	// =============================

	// getComputedStyle drives most of the style code.
	// Wherever possible, reuse the returned object.
	//
	// API functions below that need to access computed styles accept an
	// optional computedStyle parameter.
	// If this parameter is omitted, the functions will call getComputedStyle themselves.
	// This way, calling code can access computedStyle once, and then pass the reference to
	// multiple API functions.

	// Although we normally eschew argument validation at this
	// level, here we test argument 'node' for (duck)type,
	// by testing nodeType, ecause 'document' is the 'parentNode' of 'body'
	// it is frequently sent to this function even
	// though it is not Element.
	d._getComputedStyle = function(node){
		//	summary:
		//		Returns a "computed style" object.
		//
		//	description:
		//		Gets a "computed style" object which can be used to gather
		//		information about the current state of the rendered node.
		//
		//		Note that this may behave differently on different browsers.
		//		Values may have different formats and value encodings across
		//		browsers.
		//
		//		Note also that this method is expensive.  Wherever possible,
		//		reuse the returned object.
		//
		//		Use the dojo.style() method for more consistent (pixelized)
		//		return values.
		//
		//	node: DOMNode
		//		A reference to a DOM node. Does NOT support taking an
		//		ID string for speed reasons.
		//	example:
		//	|	dojo.getComputedStyle(dojo.byId('foo')).borderWidth;
		//
		//	example:
		//	Reusing the returned object, avoiding multiple lookups:
		//	|	var cs = dojo.getComputedStyle(dojo.byId("someNode"));
		//	|	var w = cs.width, h = cs.height;
		//	returns: CSS2Properties
		
		/* We once had the following impl. Why?
			var s;
			if(node.nodeType == 1){
				var dv = node.ownerDocument.defaultView;
				s = dv.getComputedStyle(node, null);
				if(!s && node.style){
					node.style.display = "";
					s = dv.getComputedStyle(node, null);
				}
			}
			return s || {};
		*/
		
		return node.nodeType == 1 ?
			node.ownerDocument.defaultView.getComputedStyle(node, null) : {};
	};



	var _floatStyle = "cssFloat",
		_floatAliases = { "cssFloat": _floatStyle, "styleFloat": _floatStyle, "float": _floatStyle }
	;

	// public API

	d._style = function(	/*DomNode|String*/ node,
							/*String?|Object?*/ style,
							/*String?*/ value){
		//	summary:
		//		Accesses styles on a node. If 2 arguments are
		//		passed, acts as a getter. If 3 arguments are passed, acts
		//		as a setter.
		//	description:
		//		Getting the style value uses the computed style for the node, so the value
		//		will be a calculated value, not just the immediate node.style value.
		//		Also when getting values, use specific style names,
		//		like "borderBottomWidth" instead of "border" since compound values like
		//		"border" are not necessarily reflected as expected.
		//		If you want to get node dimensions, use dojo.marginBox() or
		//		dojo.contentBox().
		//	node:
		//		id or reference to node to get/set style for
		//	style:
		//		the style property to set in DOM-accessor format
		//		("borderWidth", not "border-width") or an object with key/value
		//		pairs suitable for setting each property.
		//	value:
		//		If passed, sets value on the node for style, handling
		//		cross-browser concerns.  When setting a pixel value,
		//		be sure to include "px" in the value. For instance, top: "200px".
		//		Otherwise, in some cases, some browsers will not apply the style.
		//	example:
		//		Passing only an ID or node returns the computed style object of
		//		the node:
		//	|	dojo.style("thinger");
		//	example:
		//		Passing a node and a style property returns the current
		//		normalized, computed value for that property:
		//	|	dojo.style("thinger", "opacity"); // 1 by default
		//
		//	example:
		//		Passing a node, a style property, and a value changes the
		//		current display of the node and returns the new computed value
		//	|	dojo.style("thinger", "opacity", 0.5); // == 0.5
		//
		//	example:
		//		Passing a node, an object-style style property sets each of the values in turn and returns the computed style object of the node:
		//	|	dojo.style("thinger", {
		//	|		"opacity": 0.5,
		//	|		"border": "3px solid black",
		//	|		"height": "300px"
		//	|	});
		//
		// 	example:
		//		When the CSS style property is hyphenated, the JavaScript property is camelCased.
		//		font-size becomes fontSize, and so on.
		//	|	dojo.style("thinger",{
		//	|		fontSize:"14pt",
		//	|		letterSpacing:"1.2em"
		//	|	});
		//
		//	example:
		//		dojo.NodeList implements .style() using the same syntax, omitting the "node" parameter, calling
		//		dojo.style() on every element of the list. See: dojo.query and dojo.NodeList
		//	|	dojo.query(".someClassName").style("visibility","hidden");
		//	|	// or
		//	|	dojo.query("#baz > div").style({
		//	|		opacity:0.75,
		//	|		fontSize:"13pt"
		//	|	});
		//
		//	returns: Number
		//	returns: CSS2Properties||String||Number

		var n = dojo.byId(node), l = arguments.length;
		style = _floatAliases[style] || style;
		if(l == 3){
			return n.style[style] = value; /*Number*/
		}
		var s = d._getComputedStyle(n);
		if(l == 2 && typeof style != "string"){ // inline'd type check
			for(var x in style){
				d._style(node, x, style[x]);
			}
			return s;
		}
		return (l == 1) ? s : parseFloat(s[style] || n.style[style]) || s[style]; /* CSS2Properties||String||Number */
	}
	
})(dojo);

dojo.getComputedStyle = dojo._getComputedStyle;
dojo.style = dojo._style;



/*********FILE**********
/src/json/dojo-json.js
********************/


dojo.fromJson = function(/*String*/ json){
	// summary:
	// 		Parses a [JSON](http://json.org) string to return a JavaScript object.
	// description:
	// 		Throws for invalid JSON strings, but it does not use a strict JSON parser. It
	// 		delegates to eval().  The content passed to this method must therefore come
	//		from a trusted source.
	// json: 
	//		a string literal of a JSON item, for instance:
	//			`'{ "foo": [ "bar", 1, { "baz": "thud" } ] }'`

	return eval("(" + json + ")"); // Object
};

dojo._escapeString = function(/*String*/str){
	//summary:
	//		Adds escape sequences for non-visual characters, double quote and
	//		backslash and surrounds with double quotes to form a valid string
	//		literal.
	return ('"' + str.replace(/(["\\])/g, '\\$1') + '"').
		replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").
		replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r"); // string
};

dojo.toJsonIndentStr = "\t";
dojo.toJson = function(/*Object*/ it, /*Boolean?*/ prettyPrint, /*String?*/ _indentStr){
	//	summary:
	//		Returns a [JSON](http://json.org) serialization of an object.
	//	description:
	//		Returns a [JSON](http://json.org) serialization of an object.
	//		Note that this doesn't check for infinite recursion, so don't do that!
	//	it:
	//		an object to be serialized. Objects may define their own
	//		serialization via a special "__json__" or "json" function
	//		property. If a specialized serializer has been defined, it will
	//		be used as a fallback.
	//	prettyPrint:
	//		if true, we indent objects and arrays to make the output prettier.
	//		The variable `dojo.toJsonIndentStr` is used as the indent string --
	//		to use something other than the default (tab), change that variable
	//		before calling dojo.toJson().
	//	_indentStr:
	//		private variable for recursive calls when pretty printing, do not use.
	//	example:
	//		simple serialization of a trivial object
	//		|	var jsonStr = dojo.toJson({ howdy: "stranger!", isStrange: true });
	//		|	doh.is('{"howdy":"stranger!","isStrange":true}', jsonStr);
	//	example:
	//		a custom serializer for an objects of a particular class:
	//		|	dojo.declare("Furby", null, {
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
	if(dojo.isString(it)){ 
		return dojo._escapeString(it); 
	}
	// recurse
	var recurse = arguments.callee;
	// short-circuit for objects that support "json" serialization
	// if they return "self" then just pass-through...
	var newObj;
	_indentStr = _indentStr || "";
	var nextIndent = prettyPrint ? _indentStr + dojo.toJsonIndentStr : "";
	var tf = it.__json__||it.json;
	if(dojo.isFunction(tf)){
		newObj = tf.call(it);
		if(it !== newObj){
			return recurse(newObj, prettyPrint, nextIndent);
		}
	}
	if(it.nodeType && it.cloneNode){ // isNode
		// we can't seriailize DOM nodes as regular objects because they have cycles
		// DOM nodes could be serialized with something like outerHTML, but
		// that can be provided by users in the form of .json or .__json__ function.
		throw new Error("Can't serialize DOM nodes");
	}

	var sep = prettyPrint ? " " : "";
	var newLine = prettyPrint ? "\n" : "";

	// array
	if(dojo.isArray(it)){
		var res = dojo.map(it, function(obj){
			var val = recurse(obj, prettyPrint, nextIndent);
			if(typeof val != "string"){
				val = "undefined";
			}
			return newLine + nextIndent + val;
		});
		return "[" + res.join("," + sep) + newLine + _indentStr + "]";
	}
	/*
	// look in the registry
	try {
		window.o = it;
		newObj = dojo.json.jsonRegistry.match(it);
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
			keyStr = dojo._escapeString(key);
		}else{
			// skip non-string or number keys
			continue;
		}
		val = recurse(it[key], prettyPrint, nextIndent);
		if(typeof val != "string"){
			// skip non-serializable values
			continue;
		}
		// FIXME: use += on Moz!!
		//	 MOW NOTE: using += is a pain because you have to account for the dangling comma...
		output.push(newLine + nextIndent + keyStr + ":" + sep + val);
	}
	return "{" + output.join("," + sep) + newLine + _indentStr + "}"; // String
};



/*********FILE**********
<<<<<<< HEAD
/src/uri/objectToQuery.js
********************/


dojo.objectToQuery = function(/*Object*/ map){
	//	summary:
	//		takes a name/value mapping object and returns a string representing
	//		a URL-encoded version of that object.
	//	example:
	//		this object:
	//
	//		|	{ 
	//		|		blah: "blah",
	//		|		multi: [
	//		|			"thud",
	//		|			"thonk"
	//		|		]
	//		|	};
	//
	//	yields the following query string:
	//	
	//	|	"blah=blah&multi=thud&multi=thonk"
	//
	//	TODO:
	//		This originates in dojo._base.xhr. Do we want to keep 
	//		it here or move it over?
	var enc = encodeURIComponent;
	var pairs = [];
	var backstop = {};
	for(var name in map){
		var value = map[name];
		if(value != backstop[name]){
			var assign = enc(name) + "=";
			if(dojo.isArray(value)){
				for(var i=0; i < value.length; i++){
					pairs.push(assign + enc(value[i]));
				}
			}else{
				pairs.push(assign + enc(value));
			}
		}
	}
	return pairs.join("&"); // String
};




/*********FILE**********
/src/jsonp/jsonp.js
********************/


/*=====
dojo.declare("dojo.jsonp.__ioArgs", null, {
	constructor: function(){
		//	summary:
		//		The following properties are allowed for dojo.jsonp.get.
		//	jsonp: String
		//		The URL parameter name that indicates the JSONP callback string.
		//		For instance, when using Yahoo JSONP calls it is normally, 
		//		jsonp: "callback". For AOL JSONP calls it is normally 
		//		jsonp: "c".
		//	content: Object
		//		Contains properties with string values. These properties will be 
		//		serialized as name1=value2 and passed in the request.
		//	error: Function
		//		Called on timoeut or if an Exception is thrown in load function.
		//	load: Function
		//		Called when requested data is recieved.
		//	handle: Function
		//		Called always, independent of errors or timeouts.
		//	timeout: Integer
		//		Milliseconds to wait for the response. If this time passes, then 
		//		the error callbacks are called.
		//	url: String
		//		URL to server endpoint.
		this.jsonp = jsonp;
		this.content = content;
		this.error = error;
		this.load = load;
		this.handle = handle;
		this.timeout = timeout;
		this.url = url;
	}
});
=====*/

(function(){
	var _id = 0;
	var _timeouts = {};
	dojo.jsonp = function(/* dojo.jsonp.__ioArgs */ args){
		//	summary:
		//		sends a get request using a dynamically created script tag.
		if(!args.url){
			throw new Error("dojo.jsonp: No URL specified.");
		}
		if(!args.jsonp){
			throw new Error("dojo.jsonp: No callback param specified.");
		}
		
		_id++;
		var funcName = "jsonp_callback_" + _id;
	
		// timeout
		var timeout = args.timeout || 3000;
		_timeouts[_id] = setTimeout(function(){
			dojo.jsonp[funcName] = function(){};
			clearTimeout(_timeouts[_id]);
			if(args.error){
				args.error(null,{});
			}
			if(args.handle){
				args.handle(null,{});
			}
		},timeout);
		
		
		// create/append callback
		args.url += '?' + args.jsonp + '=dojo.jsonp.' + funcName;
		
		dojo.jsonp[funcName] = function(data){
			clearTimeout(_timeouts[_id]);
			try{ // TODO: Do we really want to do this, or do we want to get rid of expensive try/catch blocks?
				if(args.load){
					args.load(data,{});
				}
			}catch(e){
				if(args.error){
					args.error(null,{});
				}
			}
			if(args.handle){
				args.handle(data,{});
			}
		};
		
		if(args.content){
			args.url += '&' + dojo.objectToQuery(args.content);
		}
		
		// create script element
		var doc = dojo.doc;
		var element = doc.createElement("script");
		element.type = "text/javascript";
		element.src = args.url;
		element.charset = "utf-8";
		return doc.getElementsByTagName("head")[0].appendChild(element);
	};
})();



/*********FILE**********
=======
>>>>>>> 88bad071aa234f65b7cc7fddbc1f2030ab2d051d
/src/lang/to-array.js
********************/


dojo._toArray = function(obj, offset, startWith){
	return (startWith||[]).concat(Array.prototype.slice.call(obj, offset||0));
};



/*********FILE**********
/src/lang/clone.js
********************/


dojo.clone = function(/*anything*/ o){
	// summary:
	//		Clones objects (including DOM nodes) and all children.
	//		Warning: do not clone cyclic structures.
	
	if(!o || typeof o != "object" || dojo.isFunction(o)){
		// null, undefined, any non-object, or function
		return o;	// anything
	}
	if(o.nodeType && "cloneNode" in o){
		// DOM Node
		return o.cloneNode(true); // Node
	}
	if(o instanceof Date){
		// Date
		return new Date(o.getTime());	// Date
	}
	var r, i, l, s, name;
	if(dojo.isArray(o)){
		// array
		r = [];
		for(i = 0, l = o.length; i < l; ++i){
			if(i in o){
				r.push(dojo.clone(o[i]));
			}
		}
//we don't clone functions for performance reasons
//	}else if(dojo.isFunction(o)){
//		// function
//		r = function(){ return o.apply(this, arguments); };
	}else{
		// generic objects
		r = o.constructor ? new o.constructor() : {};
	}
	var empty = {};
	for(name in o){
		// the "tobj" condition avoid copying properties in "source"
		// inherited from Object.prototype.  For example, if target has a custom
		// toString() method, don't overwrite it with the toString() method
		// that source inherited from Object.prototype
		s = o[name];
		if(!(name in r) || (r[name] !== s && (!(name in empty) || empty[name] !== s))){
			r[name] = dojo.clone(s);
		}
	}
	return r; // Object
		
}



/*********FILE**********
/src/uri/objectToQuery.js
********************/


dojo.objectToQuery = function(/*Object*/ map){
	//	summary:
	//		takes a name/value mapping object and returns a string representing
	//		a URL-encoded version of that object.
	//	example:
	//		this object:
	//
	//		|	{ 
	//		|		blah: "blah",
	//		|		multi: [
	//		|			"thud",
	//		|			"thonk"
	//		|		]
	//		|	};
	//
	//	yields the following query string:
	//	
	//	|	"blah=blah&multi=thud&multi=thonk"
	//
	//	TODO:
	//		This originates in dojo._base.xhr. Do we want to keep 
	//		it here or move it over?
	var enc = encodeURIComponent;
	var pairs = [];
	var backstop = {};
	for(var name in map){
		var value = map[name];
		if(value != backstop[name]){
			var assign = enc(name) + "=";
			if(dojo.isArray(value)){
				for(var i=0; i < value.length; i++){
					pairs.push(assign + enc(value[i]));
				}
			}else{
				pairs.push(assign + enc(value));
			}
		}
	}
	return pairs.join("&"); // String
};




/*********FILE**********
/src/transport/xhr.js
********************/


;(function(_d){
	var cfg = _d.config;
	
	
	_d._xhrObj = function(){
		return new XMLHttpRequest();
	}

	_d._isDocumentOk = function(http){
		var stat = http.status || 0,
			lp = location.protocol;
		return (stat >= 200 && stat < 300) || 	// Boolean
			stat == 304 || 						// allow any 2XX response code
			stat == 1223 || 						// get it out of the cache
			(!stat && (lp == "file:" || lp == "chrome:" || lp == "app:") ); // Internet Explorer mangled the status code OR we're Titanium requesting a local file
	}

	_d._getText = function(/*URI*/ uri, /*Boolean*/ fail_ok){
		// summary: Read the contents of the specified uri and return those contents.
		// uri:
		//		A relative or absolute uri. If absolute, it still must be in
		//		the same "domain" as we are.
		// fail_ok:
		//		Default false. If fail_ok and loading fails, return null
		//		instead of throwing.
		// returns: The response text. null is returned when there is a
		//		failure and failure is okay (an exception otherwise)

		// NOTE: must be declared before scope switches ie. this._xhrObj()
		var http = _d._xhrObj();

		http.open('GET', uri, false);
		try{
			http.send(null);
			if(!d._isDocumentOk(http)){
				var err = Error("Unable to load "+uri+" status:"+ http.status);
				err.status = http.status;
				err.responseText = http.responseText;
				throw err;
			}
		}catch(e){
			if(fail_ok){ return null; } // null
			// rethrow the exception
			throw e;
		}
		return http.responseText; // String
	};
	
	
	dojo._blockAsync = false;

	// MOW: remove dojo._contentHandlers alias in 2.0
	var handlers = _d._contentHandlers = dojo.contentHandlers = {
		// summary: 
		//		A map of availble XHR transport handle types. Name matches the
		//		`handleAs` attribute passed to XHR calls.
		//
		// description:
		//		A map of availble XHR transport handle types. Name matches the
		//		`handleAs` attribute passed to XHR calls. Each contentHandler is
		//		called, passing the xhr object for manipulation. The return value
		//		from the contentHandler will be passed to the `load` or `handle` 
		//		functions defined in the original xhr call. 
		//		
		// example:
		//		Creating a custom content-handler:
		//	|	dojo.contentHandlers.makeCaps = function(xhr){
		//	|		return xhr.responseText.toUpperCase();
		//	|	}
		//	|	// and later:
		//	|	dojo.xhrGet({ 
		//	|		url:"foo.txt",
		//	|		handleAs:"makeCaps",
		//	|		load: function(data){ /* data is a toUpper version of foo.txt */ }
		//	|	});

		text: function(xhr){ 
			// summary: A contentHandler which simply returns the plaintext response data
			return xhr.responseText; 
		},
		json: function(xhr){
			// summary: A contentHandler which returns a JavaScript object created from the response data
			return _d.fromJson(xhr.responseText || null);
		}
	};

	/*=====
	dojo.__IoArgs = function(){
		//	url: String
		//		URL to server endpoint.
		//	content: Object?
		//		Contains properties with string values. These
		//		properties will be serialized as name1=value2 and
		//		passed in the request.
		//	timeout: Integer?
		//		Milliseconds to wait for the response. If this time
		//		passes, the then error callbacks are called.
		//	preventCache: Boolean?
		//		Default is false. If true, then a
		//		"dojo.preventCache" parameter is sent in the request
		//		with a value that changes with each request
		//		(timestamp). Useful only with GET-type requests.
		//	handleAs: String?
		//		Acceptable values depend on the type of IO
		//		transport (see specific IO calls for more information).
		// 	rawBody: String?
		// 		Sets the raw body for an HTTP request. If this is used, then the content
		// 		property is ignored. This is mostly useful for HTTP methods that have
		// 		a body to their requests, like PUT or POST. This property can be used instead
		// 		of postData and putData for dojo.rawXhrPost and dojo.rawXhrPut respectively.
		//	ioPublish: Boolean?
		//		Set this explicitly to false to prevent publishing of topics related to
		// 		IO operations. Otherwise, if djConfig.ioPublish is set to true, topics
		// 		will be published via dojo.publish for different phases of an IO operation.
		// 		See dojo.__IoPublish for a list of topics that are published.
		//	load: Function?
		//		This function will be
		//		called on a successful HTTP response code.
		//	error: Function?
		//		This function will
		//		be called when the request fails due to a network or server error, the url
		//		is invalid, etc. It will also be called if the load or handle callback throws an
		//		exception, unless djConfig.debugAtAllCosts is true.  This allows deployed applications
		//		to continue to run even when a logic error happens in the callback, while making
		//		it easier to troubleshoot while in debug mode.
		//	handle: Function?
		//		This function will
		//		be called at the end of every request, whether or not an error occurs.
		this.url = url;
		this.content = content;
		this.timeout = timeout;
		this.form = form;
		this.preventCache = preventCache;
		this.handleAs = handleAs;
		this.ioPublish = ioPublish;
		this.load = function(response, ioArgs){
			// ioArgs: dojo.__IoCallbackArgs
			//		Provides additional information about the request.
			// response: Object
			//		The response in the format as defined with handleAs.
		}
		this.error = function(response, ioArgs){
			// ioArgs: dojo.__IoCallbackArgs
			//		Provides additional information about the request.
			// response: Object
			//		The response in the format as defined with handleAs.
		}
		this.handle = function(loadOrError, response, ioArgs){
			// loadOrError: String
			//		Provides a string that tells you whether this function
			//		was called because of success (load) or failure (error).
			// response: Object
			//		The response in the format as defined with handleAs.
			// ioArgs: dojo.__IoCallbackArgs
			//		Provides additional information about the request.
		}
	}
	=====*/

	/*=====
	dojo.__IoCallbackArgs = function(args, xhr, url, query, handleAs, id, canDelete, json){
		//	args: Object
		//		the original object argument to the IO call.
		//	xhr: XMLHttpRequest
		//		For XMLHttpRequest calls only, the
		//		XMLHttpRequest object that was used for the
		//		request.
		//	url: String
		//		The final URL used for the call. Many times it
		//		will be different than the original args.url
		//		value.
		//	query: String
		//		For non-GET requests, the
		//		name1=value1&name2=value2 parameters sent up in
		//		the request.
		//	handleAs: String
		//		The final indicator on how the response will be
		//		handled.
		//	id: String
		//		For dojo.io.script calls only, the internal
		//		script ID used for the request.
		//	canDelete: Boolean
		//		For dojo.io.script calls only, indicates
		//		whether the script tag that represents the
		//		request can be deleted after callbacks have
		//		been called. Used internally to know when
		//		cleanup can happen on JSONP-type requests.
		//	json: Object
		//		For dojo.io.script calls only: holds the JSON
		//		response for JSONP-type requests. Used
		//		internally to hold on to the JSON responses.
		//		You should not need to access it directly --
		//		the same object should be passed to the success
		//		callbacks directly.
		this.args = args;
		this.xhr = xhr;
		this.url = url;
		this.query = query;
		this.handleAs = handleAs;
		this.id = id;
		this.canDelete = canDelete;
		this.json = json;
	}
	=====*/


	/*=====
	dojo.__IoPublish = function(){
		// 	summary:
		// 		This is a list of IO topics that can be published
		// 		if djConfig.ioPublish is set to true. IO topics can be
		// 		published for any Input/Output, network operation. So,
		// 		dojo.xhr, dojo.io.script and dojo.io.iframe can all
		// 		trigger these topics to be published.
		//	start: String
		//		"/dojo/io/start" is sent when there are no outstanding IO
		// 		requests, and a new IO request is started. No arguments
		// 		are passed with this topic.
		//	send: String
		//		"/dojo/io/send" is sent whenever a new IO request is started.
		// 		It passes the dojo.Deferred for the request with the topic.
		//	load: String
		//		"/dojo/io/load" is sent whenever an IO request has loaded
		// 		successfully. It passes the response and the dojo.Deferred
		// 		for the request with the topic.
		//	error: String
		//		"/dojo/io/error" is sent whenever an IO request has errored.
		// 		It passes the error and the dojo.Deferred
		// 		for the request with the topic.
		//	done: String
		//		"/dojo/io/done" is sent whenever an IO request has completed,
		// 		either by loading or by erroring. It passes the error and
		// 		the dojo.Deferred for the request with the topic.
		//	stop: String
		//		"/dojo/io/stop" is sent when all outstanding IO requests have
		// 		finished. No arguments are passed with this topic.
		this.start = "/dojo/io/start";
		this.send = "/dojo/io/send";
		this.load = "/dojo/io/load";
		this.error = "/dojo/io/error";
		this.done = "/dojo/io/done";
		this.stop = "/dojo/io/stop";
	}
	=====*/


	dojo._ioSetArgs = function(/*dojo.__IoArgs*/args,
			/*Function*/canceller,
			/*Function*/okHandler,
			/*Function*/errHandler){
		//	summary: 
		//		sets up the Deferred and ioArgs property on the Deferred so it
		//		can be used in an io call.
		//	args:
		//		The args object passed into the public io call. Recognized properties on
		//		the args object are:
		//	canceller:
		//		The canceller function used for the Deferred object. The function
		//		will receive one argument, the Deferred object that is related to the
		//		canceller.
		//	okHandler:
		//		The first OK callback to be registered with Deferred. It has the opportunity
		//		to transform the OK response. It will receive one argument -- the Deferred
		//		object returned from this function.
		//	errHandler:
		//		The first error callback to be registered with Deferred. It has the opportunity
		//		to do cleanup on an error. It will receive two arguments: error (the 
		//		Error object) and dfd, the Deferred object returned from this function.

		var ioArgs = {args: args, url: args.url};

		// set up the query params
		var miArgs = [{}];
	
		if(args.content){
			// stuff in content over-rides what's set by form
			miArgs.push(args.content);
		}
		if(args.preventCache){
			miArgs.push({"dojo.preventCache": new Date().valueOf()});
		}
		ioArgs.query = _d.objectToQuery(_d.mixin.apply(null, miArgs));
	
		// .. and the real work of getting the deferred in order, etc.
		ioArgs.handleAs = args.handleAs || "text";
		var d = new _d.Deferred(canceller);
		d.addCallbacks(okHandler, function(error){
			return errHandler(error, d);
		});

		//Support specifying load, error and handle callback functions from the args.
		//For those callbacks, the "this" object will be the args object.
		//The callbacks will get the deferred result value as the
		//first argument and the ioArgs object as the second argument.
		var ld = args.load;
		if(ld && _d.isFunction(ld)){
			d.addCallback(function(value){
				return ld.call(args, value, ioArgs);
			});
		}
		var err = args.error;
		if(err && _d.isFunction(err)){
			d.addErrback(function(value){
				return err.call(args, value, ioArgs);
			});
		}
		var handle = args.handle;
		if(handle && _d.isFunction(handle)){
			d.addBoth(function(value){
				return handle.call(args, value, ioArgs);
			});
		}

		//Plug in topic publishing, if dojo.publish is loaded.
		// TODO: What is this? Do we want it?
// deactivated all "cfg.ioPublish" to reduce dependency to dojo.publish, which is not default integrated
// should be moved into a separate 
		//if(cfg.ioPublish && _d.publish && ioArgs.args.ioPublish !== false){
		//	d.addCallbacks(
		//		function(res){
		//			_d.publish("/dojo/io/load", [d, res]);
		//			return res;
		//		},
		//		function(res){
		//			_d.publish("/dojo/io/error", [d, res]);
		//			return res;
		//		}
		//	);
		//	d.addBoth(function(res){
		//		_d.publish("/dojo/io/done", [d, res]);
		//		return res;
		//	});
		//}

		d.ioArgs = ioArgs;
	
		// FIXME: need to wire up the xhr object's abort method to something
		// analagous in the Deferred
		return d;
	}

	var _deferredCancel = function(/*Deferred*/dfd){
		// summary: canceller function for dojo._ioSetArgs call.
		
		dfd.canceled = true;
		var xhr = dfd.ioArgs.xhr;
		var _at = typeof xhr.abort;
		if(_at == "function" || _at == "object" || _at == "unknown"){
			xhr.abort();
		}
		var err = dfd.ioArgs.error;
		if(!err){
			err = new Error("xhr cancelled");
			err.dojoType="cancel";
		}
		return err;
	}
	var _deferredOk = function(/*Deferred*/dfd){
		// summary: okHandler function for dojo._ioSetArgs call.

		var ret = handlers[dfd.ioArgs.handleAs](dfd.ioArgs.xhr);
		return ret === undefined ? null : ret;
	}
	var _deferError = function(/*Error*/error, /*Deferred*/dfd){
		// summary: errHandler function for dojo._ioSetArgs call.

		if(!dfd.ioArgs.args.failOk){
			console.error(error);
		}
		return error;
	}

	// avoid setting a timer per request. It degrades performance on IE
	// something fierece if we don't use unified loops.
	var _inFlightIntvl = null;
	var _inFlight = [];
	
	
	//Use a separate count for knowing if we are starting/stopping io calls.
	//Cannot use _inFlight.length since it can change at a different time than
	//when we want to do this kind of test. We only want to decrement the count
	//after a callback/errback has finished, since the callback/errback should be
	//considered as part of finishing a request.
	var _pubCount = 0;
	var _checkPubCount = function(dfd){
		if(_pubCount <= 0){
			_pubCount = 0;
// deactivated all "cfg.ioPublish" to reduce dependency to dojo.publish, which is not default integrated
			//if(cfg.ioPublish && _d.publish && (!dfd || dfd && dfd.ioArgs.args.ioPublish !== false)){
			//	_d.publish("/dojo/io/stop");
			//}
		}
	};

	var _watchInFlight = function(){
		//summary: 
		//		internal method that checks each inflight XMLHttpRequest to see
		//		if it has completed or if the timeout situation applies.
		
		var now = (new Date()).getTime();
		// make sure sync calls stay thread safe, if this callback is called
		// during a sync call and this results in another sync call before the
		// first sync call ends the browser hangs
		if(!_d._blockAsync){
			// we need manual loop because we often modify _inFlight (and therefore 'i') while iterating
			// note: the second clause is an assigment on purpose, lint may complain
			for(var i = 0, tif; i < _inFlight.length && (tif = _inFlight[i]); i++){
				var dfd = tif.dfd;
				var func = function(){
					if(!dfd || dfd.canceled || !tif.validCheck(dfd)){
						_inFlight.splice(i--, 1); 
						_pubCount -= 1;
					}else if(tif.ioCheck(dfd)){
						_inFlight.splice(i--, 1);
						tif.resHandle(dfd);
						_pubCount -= 1;
					}else if(dfd.startTime){
						//did we timeout?
						if(dfd.startTime + (dfd.ioArgs.args.timeout || 0) < now){
							_inFlight.splice(i--, 1);
							var err = new Error("timeout exceeded");
							err.dojoType = "timeout";
							dfd.errback(err);
							//Cancel the request so the io module can do appropriate cleanup.
							dfd.cancel();
							_pubCount -= 1;
						}
					}
				};
				if(dojo.config.debugAtAllCosts){
					func.call(this);
				}else{
					try{
						func.call(this);
					}catch(e){
						dfd.errback(e);
					}
				}
			}
		}

		_checkPubCount(dfd);

		if(!_inFlight.length){
			clearInterval(_inFlightIntvl);
			_inFlightIntvl = null;
			return;
		}
	}

	dojo._ioCancelAll = function(){
		//summary: Cancels all pending IO requests, regardless of IO type
		//(xhr, script, iframe).
		try{
			_d.forEach(_inFlight, function(i){
				try{
					i.dfd.cancel();
				}catch(e){/*squelch*/}
			});
		}catch(e){/*squelch*/}
	}

	_d._ioNotifyStart = function(/*Deferred*/dfd){
		// summary:
		// 		If dojo.publish is available, publish topics
		// 		about the start of a request queue and/or the
		// 		the beginning of request.
		// description:
		// 		Used by IO transports. An IO transport should
		// 		call this method before making the network connection.
// deactivated all "cfg.ioPublish" to reduce dependency to dojo.publish, which is not default integrated
		//if(cfg.ioPublish && _d.publish && dfd.ioArgs.args.ioPublish !== false){
		//	if(!_pubCount){
		//		_d.publish("/dojo/io/start");
		//	}
		//	_pubCount += 1;
		//	_d.publish("/dojo/io/send", [dfd]);
		//}
	}

	_d._ioWatch = function(dfd, validCheck, ioCheck, resHandle){
		// summary: 
		//		Watches the io request represented by dfd to see if it completes.
		// dfd: Deferred
		//		The Deferred object to watch.
		// validCheck: Function
		//		Function used to check if the IO request is still valid. Gets the dfd
		//		object as its only argument.
		// ioCheck: Function
		//		Function used to check if basic IO call worked. Gets the dfd
		//		object as its only argument.
		// resHandle: Function
		//		Function used to process response. Gets the dfd
		//		object as its only argument.
		var args = dfd.ioArgs.args;
		if(args.timeout){
			dfd.startTime = (new Date()).getTime();
		}
		
		_inFlight.push({dfd: dfd, validCheck: validCheck, ioCheck: ioCheck, resHandle: resHandle});
		if(!_inFlightIntvl){
			_inFlightIntvl = setInterval(_watchInFlight, 50);
		}
		// handle sync requests
		//A weakness: async calls in flight
		//could have their handlers called as part of the
		//_watchInFlight call, before the sync's callbacks
		// are called.
		if(args.sync){
			_watchInFlight();
		}
	}

	var _defaultContentType = "application/x-www-form-urlencoded";

	var _validCheck = function(/*Deferred*/dfd){
		return dfd.ioArgs.xhr.readyState; //boolean
	}
	var _ioCheck = function(/*Deferred*/dfd){
		return 4 == dfd.ioArgs.xhr.readyState; //boolean
	}
	var _resHandle = function(/*Deferred*/dfd){
		var xhr = dfd.ioArgs.xhr;
		if(_d._isDocumentOk(xhr)){
			dfd.callback(dfd);
		}else{
			var err = new Error("Unable to load " + dfd.ioArgs.url + " status:" + xhr.status);
			err.status = xhr.status;
			err.responseText = xhr.responseText;
			dfd.errback(err);
		}
	}

	dojo._ioAddQueryToUrl = function(/*dojo.__IoCallbackArgs*/ioArgs){
		//summary: Adds query params discovered by the io deferred construction to the URL.
		//Only use this for operations which are fundamentally GET-type operations.
		if(ioArgs.query.length){
			ioArgs.url += (ioArgs.url.indexOf("?") == -1 ? "?" : "&") + ioArgs.query;
			ioArgs.query = null;
		}		
	}

	/*=====
	dojo.declare("dojo.__XhrArgs", dojo.__IoArgs, {
		constructor: function(){
			//	summary:
			//		In addition to the properties listed for the dojo._IoArgs type,
			//		the following properties are allowed for dojo.xhr* methods.
			//	handleAs: String?
			//		Acceptable values are: text (default), json, json-comment-optional,
			//		json-comment-filtered, javascript, xml. See `dojo.contentHandlers`
			//	sync: Boolean?
			//		false is default. Indicates whether the request should
			//		be a synchronous (blocking) request.
			//	headers: Object?
			//		Additional HTTP headers to send in the request.
			//	failOk: Boolean?
			//		false is default. Indicates whether a request should be
			//		allowed to fail (and therefore no console error message in
			//		the event of a failure)
			//	overrideMimeType: String?
			//		Calls the overrideMimeType method, if applicable, to
			//		override the default MIME type for the resource with the one
			//		given in this param.
			this.handleAs = handleAs;
			this.sync = sync;
			this.headers = headers;
			this.failOk = failOk;
			this.overrideMimeType = overrideMimeType;
		}
	});
	=====*/

	dojo.xhr = function(/*String*/ method, /*dojo.__XhrArgs*/ args, /*Boolean?*/ hasBody){
		//	summary:
		//		Sends an HTTP request with the given method.
		//	description:
		//		Sends an HTTP request with the given method.
		//		See also dojo.xhrGet(), xhrPost(), xhrPut() and dojo.xhrDelete() for shortcuts
		//		for those HTTP methods. There are also methods for "raw" PUT and POST methods
		//		via dojo.rawXhrPut() and dojo.rawXhrPost() respectively.
		//	method:
		//		HTTP method to be used, such as GET, POST, PUT, DELETE.  Should be uppercase.
		//	hasBody:
		//		If the request has an HTTP body, then pass true for hasBody.

		//Make the Deferred object for this xhr request.
		var dfd = _d._ioSetArgs(args, _deferredCancel, _deferredOk, _deferError);
		var ioArgs = dfd.ioArgs;

		//Pass the args to _xhrObj, to allow alternate XHR calls based specific calls, like
		//the one used for iframe proxies.
		var xhr = ioArgs.xhr = _d._xhrObj(ioArgs.args);
		//If XHR factory fails, cancel the deferred.
		if(!xhr){
			dfd.cancel();
			return dfd;
		}

		//Allow for specifying the HTTP body completely.
		if("postData" in args){
			ioArgs.query = args.postData;
		}else if("putData" in args){
			ioArgs.query = args.putData;
		}else if("rawBody" in args){
			ioArgs.query = args.rawBody;
		}else if((arguments.length > 2 && !hasBody) || "POST|PUT".indexOf(method.toUpperCase()) == -1){
			//Check for hasBody being passed. If no hasBody,
			//then only append query string if not a POST or PUT request.
			_d._ioAddQueryToUrl(ioArgs);
		}

		// IE 6 is a steaming pile. It won't let you call apply() on the native function (xhr.open).
		// workaround for IE6's apply() "issues"
		xhr.open(method, ioArgs.url, args.sync !== true, args.user || undefined, args.password || undefined);
		if(args.headers){
			for(var hdr in args.headers){
				if(hdr.toLowerCase() === "content-type" && !args.contentType){
					args.contentType = args.headers[hdr];
				}else if(args.headers[hdr]){
					//Only add header if it has a value. This allows for instnace, skipping
					//insertion of X-Requested-With by specifying empty value.
					xhr.setRequestHeader(hdr, args.headers[hdr]);
				}
			}
		}
		// FIXME: is this appropriate for all content types?
		xhr.setRequestHeader("Content-Type", args.contentType || _defaultContentType);
		if(!args.headers || !("X-Requested-With" in args.headers)){
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		}
		// FIXME: set other headers here!
		if(args.overrideMinmeType && xhr.overrideMimeType){
			xhr.overrideMimeType(args.overrideMimeType);
		}
		_d._ioNotifyStart(dfd);
		if(dojo.config.debugAtAllCosts){
			xhr.send(ioArgs.query);
		}else{
			try{
				xhr.send(ioArgs.query);
			}catch(e){
				ioArgs.error = e;
				dfd.cancel();
			}
		}
		_d._ioWatch(dfd, _validCheck, _ioCheck, _resHandle);
		xhr = null;
		return dfd; // dojo.Deferred
	}

	dojo.xhrGet = function(/*dojo.__XhrArgs*/ args){
		//	summary: 
		//		Sends an HTTP GET request to the server.
		return _d.xhr("GET", args); // dojo.Deferred
	}

	dojo.rawXhrPost = dojo.xhrPost = function(/*dojo.__XhrArgs*/ args){
		//	summary:
		//		Sends an HTTP POST request to the server. In addtion to the properties
		//		listed for the dojo.__XhrArgs type, the following property is allowed:
		//	postData:
		//		String. Send raw data in the body of the POST request.
		return _d.xhr("POST", args, true); // dojo.Deferred
	}

	dojo.rawXhrPut = dojo.xhrPut = function(/*dojo.__XhrArgs*/ args){
		//	summary:
		//		Sends an HTTP PUT request to the server. In addtion to the properties
		//		listed for the dojo.__XhrArgs type, the following property is allowed:
		//	putData:
		//		String. Send raw data in the body of the PUT request.
		return _d.xhr("PUT", args, true); // dojo.Deferred
	}

	dojo.xhrDelete = function(/*dojo.__XhrArgs*/ args){
		//	summary:
		//		Sends an HTTP DELETE request to the server.
		return _d.xhr("DELETE", args); //dojo.Deferred
	}
	
}(dojo));



/*********FILE**********
/src/transport/script.js
********************/


dojo.attachScript = function(params){
	//	summary:
	//		creates a new <script> tag pointing to the specified URL and
	//		adds it to the document.
	//	description:
	//		Attaches the script element to the DOM. Use this method if you
	//		just want to attach a script to the DOM and do not care when or
	//		if it loads.
	var doc = dojo.doc;
	var element = doc.createElement("script");
	element.type = "text/javascript";
	element.src = params.url;
	//element.id = id;
	element.charset = "utf-8";
	return doc.getElementsByTagName("head")[0].appendChild(element);
};



/*********FILE**********
/src/transport/jsonp.js
********************/


/*=====
dojo.declare("dojo.jsonp.__ioArgs", null, {
	constructor: function(){
		//	summary:
		//		The following properties are allowed for dojo.jsonp.get.
		//	jsonp: String
		//		The URL parameter name that indicates the JSONP callback string.
		//		For instance, when using Yahoo JSONP calls it is normally, 
		//		jsonp: "callback". For AOL JSONP calls it is normally 
		//		jsonp: "c".
		//	content: Object
		//		Contains properties with string values. These properties will be 
		//		serialized as name1=value2 and passed in the request.
		//	error: Function
		//		Called on timoeut or if an Exception is thrown in load function.
		//	load: Function
		//		Called when requested data is recieved.
		//	handle: Function
		//		Called always, independent of errors or timeouts.
		//	timeout: Integer
		//		Milliseconds to wait for the response. If this time passes, then 
		//		the error callbacks are called.
		//	url: String
		//		URL to server endpoint.
		this.jsonp = jsonp;
		this.content = content;
		this.error = error;
		this.load = load;
		this.handle = handle;
		this.timeout = timeout;
		this.url = url;
	}
});
=====*/

(function(){
	var _id = 0;
	var _timeouts = {};
	dojo.jsonp = function(/* dojo.jsonp.__ioArgs */ args){
		//	summary:
		//		sends a get request using a dynamically created script tag.
		if(!args.url){
			throw new Error("dojo.jsonp: No URL specified.");
		}
		if(!args.jsonp){
			throw new Error("dojo.jsonp: No callback param specified.");
		}
		
		_id++;
		var funcName = "jsonp_callback_" + _id;
	
		// timeout
		var timeout = args.timeout || 3000;
		_timeouts[_id] = setTimeout(function(){
			dojo.jsonp[funcName] = function(){};
			clearTimeout(_timeouts[_id]);
			if(args.error){
				args.error(null,{});
			}
			if(args.handle){
				args.handle(null,{});
			}
		},timeout);
		
		
		// create/append callback
		args.url += '?' + args.jsonp + '=dojo.jsonp.' + funcName;
		
		dojo.jsonp[funcName] = function(data){
			clearTimeout(_timeouts[_id]);
			try{ // TODO: Do we really want to do this, or do we want to get rid of expensive try/catch blocks?
				if(args.load){
					args.load(data,{});
				}
			}catch(e){
				if(args.error){
					args.error(null,{});
				}
			}
			if(args.handle){
				args.handle(data,{});
			}
		};
		
		if(args.content){
			args.url += '&' + dojo.objectToQuery(args.content);
		}
		
		// create script element
		return dojo.attachScript(args);
	};
})();



/*********FILE**********
/src/oo/declare.js
********************/


// this file courtesy of the TurboAjax Group, licensed under a Dojo CLA

dojo.declare = function(/*String*/ className, /*Function|Function[]*/ superclass, /*Object*/ props){
	//	summary: 
	//		Create a feature-rich constructor from compact notation
	//
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



/*********FILE**********
/src/oo/delegate.js
********************/


dojo.delegate = dojo._delegate = (function(){
	// boodman/crockford delegation w/ cornford optimization
	function TMP(){}
	return function(obj, props){
		TMP.prototype = obj;
		var tmp = new TMP();
		TMP.prototype = null;
		if(props){
			dojo._mixin(tmp, props);
		}
		return tmp; // Object
	}
})();



/*********FILE**********
/src/query/qsa-preprocessor.js
********************/


dojo.query = function(query, scope){
	//	summary:
	//		Returns nodes which match the given CSS3 selector, searching the
	//		entire document by default but optionally taking a node to scope
	//		the search by. Returns an instance of dojo.NodeList.
	//	description:
	//		dojo.query() is the swiss army knife of DOM node manipulation in
	//		Dojo. Much like Prototype's "$$" (bling-bling) function or JQuery's
	//		"$" function, dojo.query provides robust, high-performance
	//		CSS-based node selector support with the option of scoping searches
	//		to a particular sub-tree of a document.
	//
	//		Supported Selectors:
	//		--------------------
	//
	//		dojo.query() supports a rich set of CSS3 selectors, including:
	//
	//			* class selectors (e.g., `.foo`)
	//			* node type selectors like `span`
	//			* ` ` descendant selectors
	//			* `>` child element selectors 
	//			* `#foo` style ID selectors
	//			* `*` universal selector
	//			* `~`, the immediately preceeded-by sibling selector
	//			* `+`, the preceeded-by sibling selector
	//			* attribute queries:
	//			|	* `[foo]` attribute presence selector
	//			|	* `[foo='bar']` attribute value exact match
	//			|	* `[foo~='bar']` attribute value list item match
	//			|	* `[foo^='bar']` attribute start match
	//			|	* `[foo$='bar']` attribute end match
	//			|	* `[foo*='bar']` attribute substring match
	//			* `:first-child`, `:last-child`, and `:only-child` positional selectors
	//			* `:empty` content emtpy selector
	//			* `:checked` pseudo selector
	//			* `:nth-child(n)`, `:nth-child(2n+1)` style positional calculations
	//			* `:nth-child(even)`, `:nth-child(odd)` positional selectors
	//			* `:not(...)` negation pseudo selectors
	//
	//		Any legal combination of these selectors will work with
	//		`dojo.query()`, including compound selectors ("," delimited).
	//		Very complex and useful searches can be constructed with this
	//		palette of selectors and when combined with functions for
	//		manipulation presented by dojo.NodeList, many types of DOM
	//		manipulation operations become very straightforward.
	//		
	//		Unsupported Selectors:
	//		----------------------
	//
	//		While dojo.query handles many CSS3 selectors, some fall outside of
	//		what's resaonable for a programmatic node querying engine to
	//		handle. Currently unsupported selectors include:
	//		
	//			* namespace-differentiated selectors of any form
	//			* all `::` pseduo-element selectors
	//			* certain pseduo-selectors which don't get a lot of day-to-day use:
	//			|	* `:root`, `:lang()`, `:target`, `:focus`
	//			* all visual and state selectors:
	//			|	* `:root`, `:active`, `:hover`, `:visisted`, `:link`,
	//				  `:enabled`, `:disabled`
	//			* `:*-of-type` pseudo selectors
	//		
	//		dojo.query and XML Documents:
	//		-----------------------------
	//		
	//		`dojo.query` (as of dojo 1.2) supports searching XML documents
	//		in a case-sensitive manner. If an HTML document is served with
	//		a doctype that forces case-sensitivity (e.g., XHTML 1.1
	//		Strict), dojo.query() will detect this and "do the right
	//		thing". Case sensitivity is dependent upon the document being
	//		searched and not the query used. It is therefore possible to
	//		use case-sensitive queries on strict sub-documents (iframes,
	//		etc.) or XML documents while still assuming case-insensitivity
	//		for a host/root document.
	//
	//		Non-selector Queries:
	//		---------------------
	//
	//		If something other than a String is passed for the query,
	//		`dojo.query` will return a new `dojo.NodeList` instance
	//		constructed from that parameter alone and all further
	//		processing will stop. This means that if you have a reference
	//		to a node or NodeList, you can quickly construct a new NodeList
	//		from the original by calling `dojo.query(node)` or
	//		`dojo.query(list)`.
	//
	//	query:
	//		The CSS3 expression to match against. For details on the syntax of
	//		CSS3 selectors, see <http://www.w3.org/TR/css3-selectors/#selectors>
	//	root:
	//		A DOMNode (or node id) to scope the search from. Optional.
	//	returns: DOMCollection || Array
	//		The matching nodes. DOMCollection is enumerable, so you can use
	//		it with dojo.forEach.
	//	example:
	//		search the entire document for elements with the class "foo":
	//	|	dojo.query(".foo");
	//		these elements will match:
	//	|	<span class="foo"></span>
	//	|	<span class="foo bar"></span>
	//	|	<p class="thud foo"></p>
	//	example:
	//		search the entire document for elements with the classes "foo" *and* "bar":
	//	|	dojo.query(".foo.bar");
	//		these elements will match:
	//	|	<span class="foo bar"></span>
	//		while these will not:
	//	|	<span class="foo"></span>
	//	|	<p class="thud foo"></p>
	//	example:
	//		find `<span>` elements which are descendants of paragraphs and
	//		which have a "highlighted" class:
	//	|	dojo.query("p span.highlighted");
	//		the innermost span in this fragment matches:
	//	|	<p class="foo">
	//	|		<span>...
	//	|			<span class="highlighted foo bar">...</span>
	//	|		</span>
	//	|	</p>
	//	example:
	//		set an "odd" class on all odd table rows inside of the table
	//		`#tabular_data`, using the `>` (direct child) selector to avoid
	//		affecting any nested tables:
	//	|	dojo.query("#tabular_data > tbody > tr:nth-child(odd)").addClass("odd");
	//	example:
	//		remove all elements with the class "error" from the document
	//		and store them in a list:
	//	|	var errors = dojo.query(".error").orphan();
	//	example:
	//		add an onclick handler to every submit button in the document
	//		which causes the form to be sent via Ajax instead:
	//	|	dojo.query("input[type='submit']").onclick(function(e){
	//	|		dojo.stopEvent(e); // prevent sending the form
	//	|		var btn = e.target;
	//	|		dojo.xhrPost({
	//	|			form: btn.form,
	//	|			load: function(data){
	//	|				// replace the form with the response
	//	|				var div = dojo.doc.createElement("div");
	//	|				dojo.place(div, btn.form, "after");
	//	|				div.innerHTML = data;
	//	|				dojo.style(btn.form, "display", "none");
	//	|			}
	//	|		});
	//	|	});
	//	issues:
	//		On webkit, the following queries will not work as expected:
	//		(Note that these are bugs webkit's querySelector engine.)
	//	|	dojo.query('[foo|="bar"]') // will also return elements with foo="bar"
	//	|	dojo.query('option:checked') // will return an empty list
	//	dojo-incompatibilities:
	//		dojo.query will not return a dojo.NodeList Instance! On webkit it will
	//		return a DOMCollection or an empty Array.
	//	TODO: 
	//		Update the inline doc when we know if dojo.query "does" support
	//		chaining.
	
	
	// scope normalization
	if(typeof scope == "string"){
		scope = dojo.byId(scope);
		if(!scope){
			return [];
		}
	}

	scope = scope || dojo.doc;
	
	/*
	QUERY NORMALIZATION:

	`dojo.query` accepts selectors that start with combinators like "> *"
	or "+ a". It accepts even queries that consist only of a combinator.
	These queries throw errors with querySelectorAll.

	Markup like
			<div><p id="myP"><strong>foo</strong></p></div>
	returns the "strong" element with
			document.getElementById("myP").querySelectorAll("div strong");
	Which is incompatible with dojo.query

	For these reasons, the query is normalized before execution:
	- When the query ends with a combinator (">", "+", "~"), append a universal selector ("*").
	- When the root is document, and the query starts with a child combinator, return the appropriate element.
	- When the root is document, and the query starts with an other combinator than ">", return an empty result.
	- When the root element does not have an id, add a synthetic id.
	- Prefix the query with the id of the root element.
	- Execute the query with QSA.
	- Remove the synthetic id, if added.
	- Return the results.

	*/

	// Normalize selectors ending with a combinator
	if (/[>+~]\s*$/.test(query)){
		query += "*";
	}

	var queryRoot = scope; // `querySelectorAll` will be called on this node.

	// check if scope is a document node
	if(scope.nodeType == 9){
		// if the query starts with a child combinator, try scope.querySelector()
		// with the first segment _without_ leading child operator and check
		// if it is scope.documentElement.
		if(/^\s*>/.test(query)){
			// split the query up into the selector that the documentElement must match
			// and the rest of the query.
			var queryParts = query.replace(/^\s*>/, "").match(/([^\s>+~]+)(.*)/);
			if (!queryParts) {
				return [];
			}

			var docElmQuery = queryParts[1];
			query = queryParts[2];

			// Check if the documentElement matches the first segment of the selector
			if(scope.querySelector(docElmQuery) !== scope.documentElement){
				return [];
			}

			// If documentElement matches the first segment of the selector,
			// and the rest of the query is empty return documentElement.
			if(!query){
				return [scope.documentElement];
			}

			// execute the rest of the selector against scope.documentElement
			scope = scope.documentElement;
		}

		// if the query starts with a ajdacent combinator or a general sibling combinator,
		// return an empty array
		else if(/^\s*[+~]/.test(query)){
			return [];
		}
	}

	// check if the root is an element node.
	// We can't use an "else" branch here, because the scope might have changed
	if(scope.nodeType == 1){
		// we need to prefix the query with an id to make QSA work like
		// expected. For details check http://ejohn.org/blog/thoughts-on-queryselectorall/
		var originalId = scope.id;
		var rootId = originalId;
		if(!originalId){
			rootId = scope.id =  "d---dojo-query-synthetic-id-" + new Date().getTime(); // is this "secure" enough?
			var syntheticIdSet = true;
		}

		query = "#" + rootId + " " + query;

		// we need to start the query one element up the chain to make sibling
		// and adjacent combinators work.
		queryRoot = scope.parentNode;
	}

	// invalid queries:
	// [">", "body >", "#t >", ".foo >", "> *", "> h3", ">", "> *", "> [qux]", "> [qux]", "> [qux]", ">", "> *", ">*", "+", "~", "#foo ~", "#foo~", "#t span.foo:not(span:first-child)"]

	var n = queryRoot.querySelectorAll(query);

	// Remove synthetic id from element if set before
	if(syntheticIdSet){
		scope.id = "";
	}
	
	return n || [];
};
