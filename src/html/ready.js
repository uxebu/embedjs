define(['embed'], function(embed){

	embed._loaders = [];
	embed._loadNotifying = false;

	embed._onto = function(arr, obj, fn){
		if(!fn){
			arr.push(obj);
		}else if(fn){
			var func = (typeof fn == "string") ? obj[fn] : fn;
			arr.push(function(){ func.call(obj); });
		}
	};

	embed.ready = embed.addOnLoad = function(/*Object?*/obj, /*String|Function*/functionName){
		// summary:
		//		Registers a function to be triggered after the DOM has finished
		//		loading and widgets declared in markup have been instantiated.
		//		Images and CSS files may or may not have finished downloading when
		//		the specified function is called.  (Note that widgets' CSS and HTML
		//		code is guaranteed to be downloaded before said widgets are
		//		instantiated.)
		//
		// equals:
		//		embed.ready() is an alias for embed.addOnLoad()
		//
		// example:
		//	|	embed.addOnLoad(functionPointer);
		//	|	embed.addOnLoad(object, "functionName");
		//	|	embed.addOnLoad(object, function(){ /* ... */});	
		// feature:
		//		html-ready

		embed._onto(embed._loaders, obj, functionName);

		//Added for xdomain loading. embed.addOnLoad is used to
		//indicate callbacks after doing some embed.require() statements.
		//In the xdomain case, if all the requires are loaded (after initial
		//page load), then immediately call any listeners.
		if(document.readyState === "complete" || ( embed._postLoad && !embed._loadNotifying )){
			embed._callLoaded();
		}
	};

	embed._callLoaded = function(){

		// The "object" check is for IE, and the other opera check fixes an
		// issue in Opera where it could not find the body element in some
		// widget test cases.  For 0.9, maybe route all browsers through the
		// setTimeout (need protection still for non-browser environments
		// though). This might also help the issue with FF 2.0 and freezing
		// issues where we try to do sync xhr while background css images are
		// being loaded (trac #2572)? Consider for 0.9.

		setTimeout("embed.loaded();", 0);
	};

	embed.loaded = function(){
		// summary:
		//		signal fired when initial environment and package loading is
		//		complete. You should use embed.addOnLoad() instead of doing a 
		//		direct embed.connect() to this method in order to handle
		//		initialization tasks that require the environment to be
		//		initialized.
		// feature:
		//		html-ready
		embed._loadNotifying = true;
		embed._postLoad = true;
		var mll = embed._loaders;

		//Clear listeners so new ones can be added
		//For other xdomain package loads after the initial load.
		embed._loaders = [];

		for(var x = 0; x < mll.length; x++){
			mll[x]();
		}

		embed._loadNotifying = false;

		//Make sure nothing else got added to the onload queue
		//after this first run. If something did, and we are not waiting for any
		//more inflight resources, run again.
		if(embed._postLoad && mll.length){
			embed._callLoaded();
		}
	};

	embed._initFired = false;
	embed._loadInit = function(){

		if(!embed._initFired){
			embed._initFired = true;

			document.removeEventListener("DOMContentLoaded", embed._loadInit, false);

			embed._callLoaded();
		}
	};

	embed.doc.addEventListener("DOMContentLoaded", embed._loadInit, false);
	embed.global.addEventListener("load", embed._loadInit, false);

	return embed;

});