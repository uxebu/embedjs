// parts of this file courtesy of the TurboAjax Group, licensed under a embed CLA
define(['embed', 'feature!lang-hitch', 'feature!lang-is'], function(embed){

	// low-level delegation machinery
	embed._listener = {
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
			// because listener could be the result of a embed.hitch call,
			// in which case two references to the same hitch target would not
			// be equivalent. 
			source = source || embed.global;
			// The source method is either null, a dispatcher, or some other function
			var f = source[method];
			// Ensure a dispatcher
			if(!f || !f._listeners){
				var d = embed._listener.getDispatcher();
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
			var f = (source || embed.global)[method];
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
	
	embed.connect = embed.on = function(/*Object|null*/ obj, /*String*/ event, /*Object|null*/ context, /*String|Function*/ method, /*Boolean?*/ dontFix){
		// summary:
		//		`embed.connect` is the core event handling and delegation method in
		//		embed. It allows one function to "listen in" on the execution of
		//		any other, triggering the second whenever the first is called. Many
		//		listeners may be attached to a function, and source functions may
		//		be either regular function calls or DOM events.
		//
		// description:
		//		Connects listeners to actions, so that after event fires, a
		//		listener is called with the same arguments passed to the original
		//		function.
		//
		//		Since `embed.connect` allows the source of events to be either a
		//		"regular" JavaScript function or a DOM event, it provides a uniform
		//		interface for listening to all the types of events that an
		//		application is likely to deal with though a single, unified
		//		interface. DOM programmers may want to think of it as
		//		"addEventListener for everything and anything".
		//
		//		When setting up a connection, the `event` parameter must be a
		//		string that is the name of the method/event to be listened for. If
		//		`obj` is null, `embed.global` is assumed, meaning that connections
		//		to global methods are supported but also that you may inadvertently
		//		connect to a global by passing an incorrect object name or invalid
		//		reference.
		//
		//		`embed.connect` generally is forgiving. If you pass the name of a
		//		function or method that does not yet exist on `obj`, connect will
		//		not fail, but will instead set up a stub method. Similarly, null
		//		arguments may simply be omitted such that fewer than 4 arguments
		//		may be required to set up a connection See the examples for details.
		//
		//		The return value is a handle that is needed to 
		//		remove this connection with `embed.disconnect`.
		//
		// obj: 
		//		The source object for the event function. 
		//		Defaults to `embed.global` if null.
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
		//		embed.global is used.
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
		//	|	embed.connect(obj, "onchange", ui, "update");
		//	|	embed.connect(obj, "onchange", ui, ui.update); // same
		//
		// example:
		//		Using return value for disconnect:
		//	|	var link = embed.connect(obj, "onchange", ui, "update");
		//	|	...
		//	|	embed.disconnect(link);
		//
		// example:
		//		When onglobalevent executes, watcher.handler is invoked:
		//	|	embed.connect(null, "onglobalevent", watcher, "handler");
		//
		// example:
		//		When ob.onCustomEvent executes, customEventHandler is invoked:
		//	|	embed.connect(ob, "onCustomEvent", null, "customEventHandler");
		//	|	embed.connect(ob, "onCustomEvent", "customEventHandler"); // same
		//
		// example:
		//		When ob.onCustomEvent executes, customEventHandler is invoked
		//		with the same scope (this):
		//	|	embed.connect(ob, "onCustomEvent", null, customEventHandler);
		//	|	embed.connect(ob, "onCustomEvent", customEventHandler); // same
		//
		// example:
		//		When globalEvent executes, globalHandler is invoked
		//		with the same scope (this):
		//	|	embed.connect(null, "globalEvent", null, globalHandler);
		//	|	embed.connect("globalEvent", globalHandler); // same
	
		// normalize arguments
		var a=arguments, args=[], i=0;
		// if a[0] is a String, obj was omitted
		args.push(embed.isString(a[0]) ? null : a[i++], a[i++]);
		// if the arg-after-next is a String or Function, context was NOT omitted
		var a1 = a[i+1];
		args.push(embed.isString(a1)||embed.isFunction(a1) ? a[i++] : null, a[i++]);
		// absorb any additional arguments
		for(var l=a.length; i<l; i++){	args.push(a[i]); }
		// do the actual work
		return embed._connect.apply(this, args); /*Handle*/
	}
	
	// used by non-browser hostenvs. always overriden by event.js
	embed._connect = function(obj, event, context, method){
		var l=embed._listener, h=l.add(obj, event, embed.hitch(context, method)); 
		return [obj, event, h, l]; // Handle
	}
	
	embed.disconnect = function(/*Handle*/ handle){
		// summary:
		//		Remove a link created by embed.connect.
		// description:
		//		Removes the connection between event and the method referenced by handle.
		// handle:
		//		the return value of the embed.connect call that created the connection.
		if(handle && handle[0] !== undefined){
			embed._disconnect.apply(this, handle);
			// let's not keep this reference
			delete handle[0];
		}
	}
	
	embed._disconnect = function(obj, event, handle, listener){
		listener.remove(obj, event, handle);
	}
	
	return embed;

});
