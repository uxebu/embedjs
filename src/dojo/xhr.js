(function(d){
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
