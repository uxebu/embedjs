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
(function(d){
/*
 	d.query = function(query, parentNode){
		// summary: Works with ".className", "#id", and ".className .className"
		// Actually we would need querySelectorAll() :-).
		// But we don't have it, so we just kinda fake it.
		var parts = query.split(" ");
		if (parts.length > 1){
			return this.query(parts.slice(1).join(" "), this.query(parts[0], parentNode)[0]);
		}
		var n = parentNode ? parentNode : document;
		if (query.charAt(0)=="."){
			return n.getElementsByClassName(query.substr(1));
		}
		if (query.charAt(0)=="#"){
			return [n.getElementById(query.substr(1))];
		}
		return [];
	};
*/
	
	// modified version of "dojo._base.event"
	var nodeListener = {
		add: function(/*DOMNode*/ node, /*String*/ name, /*Function*/ fp){
			if(!node){return;} 
			name = nodeListener._normalizeEventName(name);
			var oname = name;
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
				event = nodeListener._normalizeEventName(event);
				node.removeEventListener(event, handle, false);
			}
		},
		_normalizeEventName: function(/*String*/ name){
			return name.replace(/^on/, "");
		}
	};
	
	// modified version of "dojo._base.connect"
	// low-level delegation machinery
	var defaultListener = {
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
				var lls = [];
				for(var i in ls){
					lls[i] = ls[i];
				};
				// invoke listeners after target function
				for(var i in lls){
					if(!(i in ap)){
						lls[i].apply(this, arguments);
					}
				}
				// return value comes from original target function
				return r;
			}
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
			if(!f||!f._listeners){
				var disp = defaultListener.getDispatcher();
				// original target function is special
				disp.target = f;
				// dispatcher holds a list of listeners
				disp._listeners = []; 
				// redirect source to dispatcher
				f = source[method] = disp;
			}
			// The contract is that a handle is returned that can 
			// identify this listener for disconnect. 
			//
			// The type of the handle is private. Here is it implemented as Integer. 
			// DOM event code has this same contract but handle is Function 
			// in non-IE browsers.
			//
			// We could have separate lists of before and after listeners.
			return f._listeners.push(listener) ; /*Handle*/
		},
		// remove a listener from an object
		remove: function(/*Object*/ source, /*String*/ method, /*Handle*/ handle){
			var f = (source||dojo.global)[method];
			// remember that handle is the index+1 (0 is not a valid handle)
			if(f && f._listeners && handle--){
				delete f._listeners[handle];
			}
		}
	};

	d.connect = function(node, event, callback){
		// summary: Connect the event on a node to the callback.
// TODO make this loop over multiple nodes if given or if found via util.query() and return an array of handles.
		var args=arguments;
		args[0]=(typeof node=="string") ? d.query(node)[0] : node;
		return d._connect.apply(this, args); /*Handle*/
	};
	
	d._connect = function(obj, event, method){
		var isNode = obj && (obj.nodeType||obj.addEventListener),
			lid = isNode ? 1 : 0, l = [defaultListener, nodeListener][lid],
			h = l.add(obj, event, method); 
		return [obj, event, h, lid]; // Handle
	};
	
	d.disconnect = function(/*Handle*/ handle){
		// summary:
		//		Remove a link created by dojo.connect.
		// description:
		//		Removes the connection between event and the method referenced by handle.
		// handle:
		//		the return value of the dojo.connect call that created the connection.
		if(handle && handle[0] !== undefined){
			d._disconnect.apply(this, handle);
			// let's not keep this reference
			delete handle[0];
		}
	};
	
	d._disconnect = function(obj, event, handle, listener){
		([defaultListener, nodeListener][listener]).remove(obj, event, handle);
	};

	d.connectOnce = function(node, event, callback){
		// summary: Connect the given event and disconnect right after it fired once.
		var n = (typeof node=="string") ? d.query(node)[0] : node;
		var handle = d.connect(n, event, doh.util.hitch(this, function(){
			callback.apply(null, arguments);
			this.disconnect(handle);
		}));
		return handle;
	};
})(dojo);
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
(function(d){

	d._query = function(query, scope){
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
			scope = d.byId(scope);
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

	var byId =
	d._byId = function(id, doc){
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
		return node.nodeType == 1 ?
			node.ownerDocument.defaultView.getComputedStyle(node, null) : {};
	};



	var _floatStyle = d.isIE ? "styleFloat" : "cssFloat",
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

		var n = byId(node), l = arguments.length;
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

	// =============================
	// (CSS) Class Functions
	// =============================
	var _className = "className";

	d.hasClass = function(/*DomNode|String*/node, /*String*/classStr){
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
		return ((" "+ byId(node)[_className] +" ").indexOf(" " + classStr + " ") >= 0);  // Boolean
	};

	var spaces = /\s+/, a1 = [""],
		str2array = function(s){
			if(typeof s == "string" || s instanceof String){
				if(s.indexOf(" ") < 0){
					a1[0] = s;
					return a1;
				}else{
					return s.split(spaces);
				}
			}
			// assumed to be an array
			return s;
		};

	d.addClass = function(/*DomNode|String*/node, /*String|Array*/classStr){
		//	summary:
		//		Adds the specified classes to the end of the class list on the
		//		passed node. Will not re-apply duplicate classes.
		//
	//	node:
		//		String ID or DomNode reference to add a class string too
		//
		//	classStr:
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

		node = byId(node);
		classStr = str2array(classStr);
		var cls = " " + node[_className] + " ";
		for(var i = 0, len = classStr.length, c; i < len; ++i){
			c = classStr[i];
			if(c && cls.indexOf(" " + c + " ") < 0){
				cls += c + " ";
			}
		}
		node[_className] = d.trim(cls);
	};

	d.removeClass = function(/*DomNode|String*/node, /*String|Array?*/classStr){
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

		node = byId(node);
		var cls;
		if(classStr !== undefined){
			classStr = str2array(classStr);
			cls = " " + node[_className] + " ";
			for(var i = 0, len = classStr.length; i < len; ++i){
				cls = cls.replace(" " + classStr[i] + " ", " ");
			}
			cls = d.trim(cls);
		}else{
			cls = "";
		}
		if(node[_className] != cls){ node[_className] = cls; }
	};

	d.toggleClass = function(/*DomNode|String*/node, /*String*/classStr, /*Boolean?*/condition){
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
			condition = !d.hasClass(node, classStr);
		}
		d[condition ? "addClass" : "removeClass"](node, classStr);
	};

	d._docScroll = function(){
		var n = d.global;
		return "pageXOffset" in n? { x:n.pageXOffset, y:n.pageYOffset } :
			(n=d.doc.documentElement, n.clientHeight? { x:d._fixIeBiDiScrollLeft(n.scrollLeft), y:n.scrollTop } :
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

dojo.byId = dojo._byId;
dojo.getComputedStyle = dojo._getComputedStyle;
dojo.style = dojo._style;
dojo.query = dojo._query;
(function(d){

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
/*=====
dojo._toArray = function(obj, offset, startWith){
	//	summary:
	//		Converts an array-like object (i.e. arguments, DOMCollection) to an
	//		array. Returns a new Array with the elements of obj.
	//	obj: Object
	//		the object to "arrayify". We expect the object to have, at a
	//		minimum, a length property which corresponds to integer-indexed
	//		properties.
	//	offset: Number?
	//		the location in obj to start iterating from. Defaults to 0.
	//		Optional.
	//	startWith: Array?
	//		An array to pack with the properties of obj. If provided,
	//		properties in obj are appended at the end of startWith and
	//		startWith is the returned array.
}
=====*/

;(function(){
	var efficient = function(obj, offset, startWith){
		return (startWith||[]).concat(Array.prototype.slice.call(obj, offset||0));
	};

	//>>excludeStart("webkitMobile", kwArgs.webkitMobile);
	var slow = function(obj, offset, startWith){
		var arr = startWith||[];
		for(var x = offset || 0; x < obj.length; x++){
			arr.push(obj[x]);
		}
		return arr;
	};
	//>>excludeEnd("webkitMobile");

	dojo._toArray =
		//>>excludeStart("webkitMobile", kwArgs.webkitMobile);
		dojo.isIE ?  function(obj){
			return ((obj.item) ? slow : efficient).apply(this, arguments);
		} :
		//>>excludeEnd("webkitMobile");
		efficient;

})();
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
;(function(d){

	var fx = d.fx = {},
		byId = d.byId,
		mixin = d.mixin;

	var _anim = function(params){
		// summary: A tiny animation class, providing simply iterations and the
		// 		current percent values and some smaller time handling (incl. fixes).

		this._lastAnimate = null;

		// Ranges 0.00...100.00
		this.percent = 0;

		this.percentPerStep = Math.round((params.rate / params.duration) * 100 * 100) / 100; // Let's stick to two decimals after the comma!!!

		this.play = function(){
			this._lastAnimate = new Date().valueOf();
			if (params.beforeBegin){
				params.beforeBegin();
			}
			this.onAnimate();
		};

		this.onAnimate = function(){
			// summary: Called on every iteration.
			if (params.onAnimate){
				params.onAnimate(this);
			}
			if (this.percent >= 100){
				if (params.onEnd) params.onEnd();
				return;
			}
			this.percent = Math.round((this.percent + this.percentPerStep) * 100) / 100;
			this.percent = this.percent>100 ? 100 : this.percent; // Do never get above 100% ...doh.

			// Call this method again, with the according timeout to finish in time.
// TODO actually imho the timeout value should be calculated so that duration is kept properly, which may mean that the
// timeout must be shorter due to missed frames or whatever slowdown of the anim. Then
// it might skip frames but it finishes in time, which imho is most important!!! Or can even this be configurable? NO! => KISS
			var now = new Date().valueOf(),
				diff = (now - this._lastAnimate), // The time the processing took, so subtract it from the timeout.
				timeout = ((diff < params.rate) ? (params.rate - diff) : 10); // If the diff is negative come again in 10ms, right away.
//console.log('params.rate = ', params.rate, 'diff = ', diff, 'timeout = ', timeout);
			setTimeout(dojo.hitch(this, "onAnimate"), timeout);
			this._lastAnimate = now;
		}
	};

	function _getStartValues(args){
		var ret = {left:null, top:null},
			hasLeft = typeof args.left != "undefined",
			hasTop = typeof args.top != "undefined";
		// If the unit is in percent, we rely on the initial node position to be
		// in percent too. And since dojo.style() ONLY returns px values, we can't
		// use it here!
		if (args.units=="%" && hasLeft){
			var left = args.node.style.left;
			if (left === "" || ""+left === "0"){
				ret.left = 0
			}else if (left.slice(-1) != "%"){
				throw new Error("'left' value must be given in percent, to animate using '%' as units. Value was: '" + left + "'.");
			} else {
				ret.left = parseFloat(left.substr(0, left.length-1));
			}
		}
// TODO do top, and when units is not % ...
		return ret;
	}

	fx.slideTo = function(args){
		// summary: Animate the given node, by modifying either left and top value or both.
		// description: If you only pass in a left value, the top value will
		// 		not be touched, and vice versa.
		var node = args.node = byId(args.node);
		args = mixin({
			units: "px",
			easing: "linear",
			duration: 1000,

			// rate: Integer?
			//		the time in milliseconds to wait before advancing to next frame
			//		(used as a fps timer: 1000/rate = fps)
			rate: 20 /* 50 fps */
		}, args);

		var start = _getStartValues(args),
			offset = args.left - start.left,
			hasLeft = typeof args.left != "undefined",
			hasTop = typeof args.top != "undefined";
		var anim = new _anim({
			duration:args.duration,
			rate:args.rate,
			onAnimate:function(anim){
				if (hasLeft){
					var newLeft = start.left + (offset * anim.percent/100);
					args.node.style.left = newLeft + args.units;
				}
			},
			onEnd:args.onEnd || function(){},
			beforeBegin:args.beforeBegin || function(){}
		});
		return {play:dojo.hitch(anim, "play")};
	}

	fx._fadeDefaults = {
		property: "opacity",
		easing: "linear",
		duration: 1000,
		delay: 0
	};

	fx.fadeIn = function(/*dojo.__FadeArgs*/ args){
		// summary:
		//		Returns an animation that will fade node defined in 'args' from
		//		its current opacity to fully opaque.
		return d._fade(d.mixin(fx._fadeDefaults, { end: 1 }, args)); // dojo.Animation
	};

	fx.fadeOut = function(/*dojo.__FadeArgs*/  args){
		// summary:
		//		Returns an animation that will fade node defined in 'args'
		//		from its current opacity to fully transparent.
		return d._fade(d.mixin(fx._fadeDefaults, { end: 0 }, args)); // dojo.Animation
	};

	d._fade = function(/*Object*/ args){
		//	summary:
		//		Returns an animation that will fade the node defined by
		//		args.node from the start to end values passed (args.start
		//		args.end) (end is mandatory, start is optional)

		var start = args.start ? parseFloat(args.start) : parseFloat(args.node.style[args.property]||0);
		var end = args.end;

		if (start > end){
			var diff = start-end;
			var m = -1;
		}else{
			var diff = end - start;
			var m = 1;
		}

		var anim = new _anim({
			duration:args.duration,
			rate: 20,
			onAnimate:function(anim){
				args.node.style[args.property] = start + (m*(diff/100*anim.percent));
			},
			onEnd:args.onEnd || function(){},
			beforeBegin:args.beforeBegin || function(){}
		});
		return {play:dojo.hitch(anim, "play")};
	};
})(dojo);
dojo.provide("dojo.io.script");

dojo.io.script.attach = function(params){
	//	summary:
	//		creates a new <script> tag pointing to the specified URL and
	//		adds it to the document.
	//	description:
	//		Attaches the script element to the DOM.  Use this method if you
	//		just want to attach a script to the DOM and do not care when or
	//		if it loads.
	var doc = document;
	var element = doc.createElement("script");
	element.type = "text/javascript";
	element.src = params.url;
	//element.id = id;
	element.charset = "utf-8";
	return doc.getElementsByTagName("head")[0].appendChild(element);
};

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

/*=====
dojo.declare("dojo.io.script.__ioArgs", null, {
	constructor: function(){
		//	summary:
		//		The following properties are allowed for dojo.io.script.get.
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

dojo.io.script._id = 0;
dojo.io.script._timeouts = {};
dojo.io.script.get = function(/* dojo.io.script.__ioArgs */ args){
	//	summary:
	//		sends a get request using a dynamically created script tag.
	if(!args.url){
		throw new Error("dojo.io.script.get: No URL specified.");
	}
	if(!args.jsonp){
		throw new Error("dojo.io.script.get: No callback param specified.");
	}
	
	dojo.io.script._id++;
	var funcName = "jsonp_callback_" + dojo.io.script._id;

	// timeout
	var timeout = args.timeout || 3000;
	dojo.io.script._timeouts[dojo.io.script._id] = setTimeout(function(){
		dojo.io.script[funcName] = function(){};
		clearTimeout(dojo.io.script._timeouts[dojo.io.script._id]);
		if(args.error){
			args.error(null,{});
		}
		if(args.handle){
			args.handle(null,{});
		}
	},timeout);
	
	
	// create/append callback
	args.url += '?' + args.jsonp + '=dojo.io.script.' + funcName;
	
	dojo.io.script[funcName] = function(data){
		clearTimeout(dojo.io.script._timeouts[dojo.io.script._id]);
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

// Move to dojo/jsonp.js???????!!!!!!!!!!!
dojo.jsonp = dojo.io.script.get;// Crockford (ish) functions

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
// NOTE: dojo's JSON impl differs from native!
//	(e.g. revier function)

dojo.toJson = function(/* Mixed */ data){
	return JSON.stringify(data);
};

dojo.fromJson = function(/* String */ json){
	return JSON.parse(json);
}
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
(function(d){

(function(){
	var mutator = function(){};		
	var freeze = Object.freeze || function(){};
	// A deferred provides an API for creating and resolving a promise.
	dojo.Deferred = function(/*Function?*/canceller){
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
				if(mutated = (listener.progress == mutator)){ // assignment and check
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
		this.resolve = this.callback = function(value){
			// summary:
			//		Fulfills the Deferred instance successfully with the provide value
			this.fired = 0;
			this.results = [value, null];
			complete(value);
		};
		
		
		// calling error will indicate that the promise failed
		this.reject = this.errback = function(error){
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
		this.addCallbacks = function(/*Function?*/callback, /*Function?*/errback){
			this.then(callback, errback, mutator);
			return this;
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
			var returnDeferred = progressCallback == mutator ? this : new dojo.Deferred(promise.cancel);
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
	dojo.extend(dojo.Deferred, {
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
})();
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

})(dojo);(function(d){
	d._xhrObj = function(){
		return new XMLHttpRequest();
	}

	d._isDocumentOk = function(http){
		var stat = http.status || 0,
			lp = location.protocol;
		return (stat >= 200 && stat < 300) || 	// Boolean
			stat == 304 || 						// allow any 2XX response code
			stat == 1223 || 						// get it out of the cache
			(!stat && (lp == "file:" || lp == "chrome:" || lp == "app:") ); // Internet Explorer mangled the status code OR we're Titanium requesting a local file
	}

	d._getText = function(/*URI*/ uri, /*Boolean*/ fail_ok){
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
		var http = d._xhrObj();

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
	}
}(dojo));
