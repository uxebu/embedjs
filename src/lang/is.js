define(['embed'], function(embed){

	// Crockford (ish) functions

	embed.isString = function(/*anything*/ it){
		//	summary:
		//		Return true if it is a String
		return (typeof it == "string" || it instanceof String); // Boolean
	};

	embed.isArray = function(/*anything*/ it){
		//	summary:
		//		Return true if it is an Array
		return it && (it instanceof Array || typeof it == "array"); // Boolean
	};

	embed.isFunction = function(/*anything*/ it){
		// summary:
		//		Returns true if it is a Function.
		var t = typeof it; // must evaluate separately due to bizarre Opera bug. See #8937
		//Firefox thinks object HTML element is a function, so test for nodeType.
		//Safari (incl webkit mobile on iOS) thinks of NodeLists as funtions, so we need to check this.
		// TODO: Find a less expensive way to test this instead of toString.
		// TODO Check if this affects webkit mobile on android.
		return it && (t == "function" || it instanceof Function) && !it.nodeType && it.toString() != "[object NodeList]"; // Boolean
	};
	
	embed.isObject = function(/*anything*/ it){
		// summary:
		//		Returns true if it is a JavaScript object (or an Array, a Function
		//		or null)
		return it !== undefined &&
			(it === null || typeof it == "object" || embed.isArray(it) || embed.isFunction(it)); // Boolean
	};

	embed.isArrayLike = function(/*anything*/ it){
		//	summary:
		//		similar to embed.isArray() but more permissive
		//	description:
		//		Doesn't strongly test for "arrayness".  Instead, settles for "isn't
		//		a string or number and has a length property". Arguments objects
		//		and DOM collections will return true when passed to
		//		embed.isArrayLike(), but will return false when passed to
		//		embed.isArray().
		//	returns:
		//		If it walks like a duck and quacks like a duck, return `true`
		var d = embed;
		return it && it !== undefined && // Boolean
			// keep out built-in constructors (Number, String, ...) which have length
			// properties
			!d.isString(it) && !d.isFunction(it) &&
			!(it.tagName && it.tagName.toLowerCase() == 'form') &&
			(d.isArray(it) || isFinite(it.length));
	};

	embed.isAlien = function(/*anything*/ it){
		// summary:
		//		Returns true if it is a built-in function or some other kind of
		//		oddball that *should* report as a function but doesn't
		return it && !embed.isFunction(it) && /\{\s*\[native code\]\s*\}/.test(String(it)); // Boolean
	};

	embed.isNumeric = function(n){
		// summary:
		//		Returns true if it is numeric.
		return n==parseFloat(n);
	};

	embed.isNumber = function(n){
		// summary:
		//		Returns true if it is a Number.
		return typeof n == "number" || n instanceof Number;
	};

	return embed;
});
