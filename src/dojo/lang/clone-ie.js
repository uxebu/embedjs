
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
	
	// IE doesn't recognize some custom functions in for..in
	var extraNames = dojo._extraNames, extraLen = extraNames.length;
	if(extraLen){
		for(i = 0; i < extraLen; ++i){
			name = extraNames[i];
			s = o[name];
			if(!(name in r) || (r[name] !== s && (!(name in empty) || empty[name] !== s))){
				r[name] = s; // functions only, we don't clone them
			}
		}
	}
	
	return r; // Object
		
}
