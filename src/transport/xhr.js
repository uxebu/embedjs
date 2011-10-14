define(['embed', 'feature!json', 'feature!uri', 'feature!lang-is', 'feature!lang-mixin', 'feature!async-deferred'], function(embed){

	var cfg = embed.config;


	embed._xhrObj = function(){
		return new XMLHttpRequest();
	}

	embed._isDocumentOk = function(http){
		var stat = http.status || 0,
			lp = location.protocol;
		return (stat >= 200 && stat < 300) || 	// Boolean
			stat == 304 || 						// allow any 2XX response code
			stat == 1223 || 						// get it out of the cache
			(!stat && (lp == "file:" || lp == "chrome:" || lp == "app:") ); // Internet Explorer mangled the status code OR we're Titanium requesting a local file
	}

	embed._getText = function(/*URI*/ uri, /*Boolean*/ fail_ok){
		// summary: Read the contents of the specified uri and return those contents.
		// uri:
		//		A relative or absolute uri. If absolute, it still must be in
		//		the same "domain" as we are.
		// fail_ok:
		//		Default false. If fail_ok and loading fails, return null
		//		instead of throwing.
		// returns: The response text. null is returned when there is a
		//		failure and failure is okay (an exception otherwise)
		// feature:
		//		transport-xhr

		// NOTE: must be declared before scope switches ie. this._xhrObj()
		var http = embed._xhrObj();

		http.open('GET', uri, false);
		try{
			http.send(null);
			if(!embed._isDocumentOk(http)){
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


	embed._blockAsync = false;

	// MOW: remove embed._contentHandlers alias in 2.0
	var handlers = embed._contentHandlers = embed.contentHandlers = {
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
		//	|	embed.contentHandlers.makeCaps = function(xhr){
		//	|		return xhr.responseText.toUpperCase();
		//	|	}
		//	|	// and later:
		//	|	embed.xhrGet({
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
			//	NOTE: we set the stripComments flag to true, because of
			//	compat to code that comes from working w/ dojo, where
			//	JSON was allowed to have comments in it.
			return embed.fromJson(xhr.responseText || null, true);
		}
	};

	/*=====
	embed.__IoArgs = function(){
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
		//		"embed.preventCache" parameter is sent in the request
		//		with a value that changes with each request
		//		(timestamp). Useful only with GET-type requests.
		//	handleAs: String?
		//		Acceptable values depend on the type of IO
		//		transport (see specific IO calls for more information).
		// 	rawBody: String?
		// 		Sets the raw body for an HTTP request. If this is used, then the content
		// 		property is ignored. This is mostly useful for HTTP methods that have
		// 		a body to their requests, like PUT or POST. This property can be used instead
		// 		of postData and putData for embed.rawXhrPost and embed.rawXhrPut respectively.
		//	ioPublish: Boolean?
		//		Set this explicitly to false to prevent publishing of topics related to
		// 		IO operations. Otherwise, if djConfig.ioPublish is set to true, topics
		// 		will be published via embed.publish for different phases of an IO operation.
		// 		See embed.__IoPublish for a list of topics that are published.
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
			// ioArgs: embed.__IoCallbackArgs
			//		Provides additional information about the request.
			// response: Object
			//		The response in the format as defined with handleAs.
		}
		this.error = function(response, ioArgs){
			// ioArgs: embed.__IoCallbackArgs
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
			// ioArgs: embed.__IoCallbackArgs
			//		Provides additional information about the request.
		}
	}
	=====*/

	/*=====
	embed.__IoCallbackArgs = function(args, xhr, url, query, handleAs, id, canDelete, json){
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
		//		For embed.io.script calls only, the internal
		//		script ID used for the request.
		//	canDelete: Boolean
		//		For embed.io.script calls only, indicates
		//		whether the script tag that represents the
		//		request can be deleted after callbacks have
		//		been called. Used internally to know when
		//		cleanup can happen on JSONP-type requests.
		//	json: Object
		//		For embed.io.script calls only: holds the JSON
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
	embed.__IoPublish = function(){
		// 	summary:
		// 		This is a list of IO topics that can be published
		// 		if djConfig.ioPublish is set to true. IO topics can be
		// 		published for any Input/Output, network operation. So,
		// 		embed.xhr, embed.io.script and embed.io.iframe can all
		// 		trigger these topics to be published.
		//	start: String
		//		"/embed/io/start" is sent when there are no outstanding IO
		// 		requests, and a new IO request is started. No arguments
		// 		are passed with this topic.
		//	send: String
		//		"/embed/io/send" is sent whenever a new IO request is started.
		// 		It passes the embed.Deferred for the request with the topic.
		//	load: String
		//		"/embed/io/load" is sent whenever an IO request has loaded
		// 		successfully. It passes the response and the embed.Deferred
		// 		for the request with the topic.
		//	error: String
		//		"/embed/io/error" is sent whenever an IO request has errored.
		// 		It passes the error and the embed.Deferred
		// 		for the request with the topic.
		//	done: String
		//		"/embed/io/done" is sent whenever an IO request has completed,
		// 		either by loading or by erroring. It passes the error and
		// 		the embed.Deferred for the request with the topic.
		//	stop: String
		//		"/embed/io/stop" is sent when all outstanding IO requests have
		// 		finished. No arguments are passed with this topic.
		this.start = "/embed/io/start";
		this.send = "/embed/io/send";
		this.load = "/embed/io/load";
		this.error = "/embed/io/error";
		this.done = "/embed/io/done";
		this.stop = "/embed/io/stop";
	}
	=====*/


	embed._ioSetArgs = function(/*embed.__IoArgs*/args,
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
			miArgs.push({"embed.preventCache": new Date().valueOf()});
		}
		ioArgs.query = embed.objectToQuery(embed.mixin.apply(null, miArgs));

		// .. and the real work of getting the deferred in order, etc.
		ioArgs.handleAs = args.handleAs || "text";
		var d = new embed.Deferred(canceller);
		d.addCallbacks(okHandler, function(error){
			return errHandler(error, d);
		});

		//Support specifying load, error and handle callback functions from the args.
		//For those callbacks, the "this" object will be the args object.
		//The callbacks will get the deferred result value as the
		//first argument and the ioArgs object as the second argument.
		var ld = args.load;
		if(ld && embed.isFunction(ld)){
			d.addCallback(function(value){
				return ld.call(args, value, ioArgs);
			});
		}
		var err = args.error;
		if(err && embed.isFunction(err)){
			d.addErrback(function(value){
				return err.call(args, value, ioArgs);
			});
		}
		var handle = args.handle;
		if(handle && embed.isFunction(handle)){
			d.addBoth(function(value){
				return handle.call(args, value, ioArgs);
			});
		}

		//Plug in topic publishing, if embed.publish is loaded.
		// TODO: What is this? Do we want it?
// deactivated all "cfg.ioPublish" to reduce dependency to embed.publish, which is not default integrated
// should be moved into a separate
		//if(cfg.ioPublish && _d.publish && ioArgs.args.ioPublish !== false){
		//	d.addCallbacks(
		//		function(res){
		//			_d.publish("/embed/io/load", [d, res]);
		//			return res;
		//		},
		//		function(res){
		//			_d.publish("/embed/io/error", [d, res]);
		//			return res;
		//		}
		//	);
		//	d.addBoth(function(res){
		//		_d.publish("/embed/io/done", [d, res]);
		//		return res;
		//	});
		//}

		d.ioArgs = ioArgs;

		// FIXME: need to wire up the xhr object's abort method to something
		// analagous in the Deferred
		return d;
	}

	var _deferredCancel = function(/*Deferred*/dfd){
		// summary: canceller function for embed._ioSetArgs call.

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
		// summary: okHandler function for embed._ioSetArgs call.

		var ret = handlers[dfd.ioArgs.handleAs](dfd.ioArgs.xhr);
		return ret === undefined ? null : ret;
	}
	var _deferError = function(/*Error*/error, /*Deferred*/dfd){
		// summary: errHandler function for embed._ioSetArgs call.

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
// deactivated all "cfg.ioPublish" to reduce dependency to embed.publish, which is not default integrated
			//if(cfg.ioPublish && _d.publish && (!dfd || dfd && dfd.ioArgs.args.ioPublish !== false)){
			//	_d.publish("/embed/io/stop");
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
		if(!embed._blockAsync){
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
							err.embedType = "timeout";
							dfd.errback(err);
							//Cancel the request so the io module can do appropriate cleanup.
							dfd.cancel();
							_pubCount -= 1;
						}
					}
				};
				if(embed.config.debugAtAllCosts){
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

	embed._ioCancelAll = function(){
		//summary: Cancels all pending IO requests, regardless of IO type
		//(xhr, script, iframe).
		try{
			embed.forEach(_inFlight, function(i){
				try{
					i.dfd.cancel();
				}catch(e){/*squelch*/}
			});
		}catch(e){/*squelch*/}
	}

	embed._ioNotifyStart = function(/*Deferred*/dfd){
		// summary:
		// 		If embed.publish is available, publish topics
		// 		about the start of a request queue and/or the
		// 		the beginning of request.
		// description:
		// 		Used by IO transports. An IO transport should
		// 		call this method before making the network connection.
// deactivated all "cfg.ioPublish" to reduce dependency to embed.publish, which is not default integrated
		//if(cfg.ioPublish && _d.publish && dfd.ioArgs.args.ioPublish !== false){
		//	if(!_pubCount){
		//		_d.publish("/embed/io/start");
		//	}
		//	_pubCount += 1;
		//	_d.publish("/embed/io/send", [dfd]);
		//}
	}

	embed._ioWatch = function(dfd, validCheck, ioCheck, resHandle){
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
		if(embed._isDocumentOk(xhr)){
			dfd.callback(dfd);
		}else{
			var err = new Error("Unable to load " + dfd.ioArgs.url + " status:" + xhr.status);
			err.status = xhr.status;
			err.responseText = xhr.responseText;
			dfd.errback(err);
		}
	}

	embed._ioAddQueryToUrl = function(/*embed.__IoCallbackArgs*/ioArgs){
		//summary: Adds query params discovered by the io deferred construction to the URL.
		//Only use this for operations which are fundamentally GET-type operations.
		if(ioArgs.query.length){
			ioArgs.url += (ioArgs.url.indexOf("?") == -1 ? "?" : "&") + ioArgs.query;
			ioArgs.query = null;
		}
	}

	/*=====
	embed.declare("embed.__XhrArgs", embed.__IoArgs, {
		constructor: function(){
			//	summary:
			//		In addition to the properties listed for the embed._IoArgs type,
			//		the following properties are allowed for embed.xhr* methods.
			//	handleAs: String?
			//		Acceptable values are: text (default), json, json-comment-optional,
			//		json-comment-filtered, javascript, xml. See `embed.contentHandlers`
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

	embed.xhr = function(/*String*/ method, /*embed.__XhrArgs*/ args, /*Boolean?*/ hasBody){
		//	summary:
		//		Sends an HTTP request with the given method.
		//	description:
		//		Sends an HTTP request with the given method.
		//		See also embed.xhrGet(), xhrPost(), xhrPut() and embed.xhrDelete() for shortcuts
		//		for those HTTP methods. There are also methods for "raw" PUT and POST methods
		//		via embed.rawXhrPut() and embed.rawXhrPost() respectively.
		//	method:
		//		HTTP method to be used, such as GET, POST, PUT, DELETE.  Should be uppercase.
		//	hasBody:
		//		If the request has an HTTP body, then pass true for hasBody.
		// feature:
		//		transport-xhr

		//Make the Deferred object for this xhr request.
		var dfd = embed._ioSetArgs(args, _deferredCancel, _deferredOk, _deferError);
		var ioArgs = dfd.ioArgs;

		//Pass the args to _xhrObj, to allow alternate XHR calls based specific calls, like
		//the one used for iframe proxies.
		var xhr = ioArgs.xhr = embed._xhrObj(ioArgs.args);
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
			embed._ioAddQueryToUrl(ioArgs);
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
		if(args.overrideMimeType && xhr.overrideMimeType){
			xhr.overrideMimeType(args.overrideMimeType);
		}
		embed._ioNotifyStart(dfd);
		if(embed.config.debugAtAllCosts){
			xhr.send(ioArgs.query);
		}else{
			try{
				xhr.send(ioArgs.query);
			}catch(e){
				ioArgs.error = e;
				dfd.cancel();
			}
		}
		embed._ioWatch(dfd, _validCheck, _ioCheck, _resHandle);
		xhr = null;
		return dfd; // embed.Deferred
	}

	embed.xhrGet = function(/*embed.__XhrArgs*/ args){
		//	summary:
		//		Sends an HTTP GET request to the server.
		// feature:
		//		transport-xhr
		return embed.xhr("GET", args); // embed.Deferred
	}

	embed.rawXhrPost = embed.xhrPost = function(/*embed.__XhrArgs*/ args){
		//	summary:
		//		Sends an HTTP POST request to the server. In addtion to the properties
		//		listed for the embed.__XhrArgs type, the following property is allowed:
		//	postData:
		//		String. Send raw data in the body of the POST request.
		// feature:
		//		transport-xhr
		return embed.xhr("POST", args, true); // embed.Deferred
	}

	embed.rawXhrPut = embed.xhrPut = function(/*embed.__XhrArgs*/ args){
		//	summary:
		//		Sends an HTTP PUT request to the server. In addtion to the properties
		//		listed for the embed.__XhrArgs type, the following property is allowed:
		//	putData:
		//		String. Send raw data in the body of the PUT request.
		// feature:
		//		transport-xhr
		return embed.xhr("PUT", args, true); // embed.Deferred
	}

	embed.xhrDelete = function(/*embed.__XhrArgs*/ args){
		//	summary:
		//		Sends an HTTP DELETE request to the server.
		// feature:
		//		transport-xhr
		return embed.xhr("DELETE", args); //embed.Deferred
	}
	
	return embed;
	
});
