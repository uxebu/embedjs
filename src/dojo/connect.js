require.def("dojo/connect", ["dojo"], function(){
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
});