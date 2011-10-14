define(['embed', 'feature!lang-is'], function(embed){

	embed.clone = function(/*anything*/ o){
		// summary:
		//		Clones objects (including DOM nodes) and all children.
		//		Warning: do not clone cyclic structures.
		// feature:
		//		lang-clone
		
		if(!o || typeof o != "object" || embed.isFunction(o)){
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
		if(embed.isArray(o)){
			// array
			r = [];
			for(i = 0, l = o.length; i < l; ++i){
				if(i in o){
					r.push(embed.clone(o[i]));
				}
			}
	//we don't clone functions for performance reasons
	//	}else if(embed.isFunction(o)){
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
				r[name] = embed.clone(s);
			}
		}
		return r; // Object
			
	}

	return embed;

});