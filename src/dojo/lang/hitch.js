require.def("dojo/lang/hitch", [
	"require",
	"dojo",
	"dojo/lang"
], function(require, dojo, dojoLang){

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

return dojo.hitch; });