define({
	"embed": "embed",
	
	// Feature 'array'
	
	"array":[
		{
			isAvailable: function(){
				return {}.toString.call([].forEach) == '[object Function]';
			},
			implementation: "array/native"
		},
		{
			isAvailable: function(){
				return true;
			},
			implementation: "array/functional"
		}
	],
	
	"array:native": "array/native",
	
	"array:functional": "array/functional",
	
	// Feature group 'connect'
	
	"connect-connect": "connect/connect",
	
	"connect-event": "connect/event",
	
	"connect-pubsub": "connect/pubsub",
	
	// Feature group 'async'
	
	"async-promise": "async/promise",
	
    "async-when": "async/when",
    
    "async-deferred": "async/deferred",
    
    // Feature 'geolocation' || TODO: Shoudn't this be sth like deviceAPIs?
	
	// "geolocation": "geolocation/w3c", // Removed feature. We don't offer anything here but a memory pointer.
	
	// Feature group 'html'
	
	"html-attr": "html/attr",
	
	"html-element": "html/element",
	
	"html-todom": "html/todom",
	
	"html-class": "html/class",
	
	"html-style": "html/style",
	
    "html-ready": "html/ready",
    
    "html-id": "html/id",
	
	"html-destroy": "html/destroy",
	
	// Feature 'json' || TODO: put this in some group?
    
    "json": [
         {
        	 isAvailable: function(){
	        	return typeof JSON != 'undefined' && typeof JSON.parse == 'function'; 
	         },
        	 implementation: "json/native"
         },
         {
        	 isAvailable: function(){
	        	return true; 
	         },
        	 implementation: "json/dojo-json"
         }
     ],
     
     "json:native": "json/native",
     
     "json:dojo": "json/dojo-json",
    
    // Feature group 'lang'
    
	"lang-toarray": "lang/toarray",
	
	"lang-clone": "lang/clone",
	
	"lang-hitch": "lang/hitch",
	
	"lang-is": "lang/is",
	
	"lang-string": "lang/string",
	
    "lang-mixin": "lang/mixin",
    
    "lang-object": "lang/object",
    
    // Feature group 'transport'
    
	"transport-xhr": "transport/xhr",
	
	"transport-script": "transport/script",
	
	"transport-jsonp": "transport/jsonp",
	
	// Feature 'query'
	
	"query": [
		{
			isAvailable: function(){
				return typeof document.querySelectorAll != 'undefined';
			},
			implementation: "query/qsa-preprocessor"
		},
		{
			isAvailable: function(){
				return true;
			},
			implementation: "query/acme"			
		}
	],

	"query:qsapp": "query/qsa-preprocessor",
	
	"query:qsa":"query/qsa",
	
	"query:simple": "query/simple",
	
	"query:acme": "query/acme",
	
	"query:xpath": "query/xpath",
	
	// Feature group 'queryExtensions'
	
	"queryExtensions-ChainableNodeArray": "queryExtensions/ChainableNodeArray",
	
	// Feature group 'oo'
	
	"oo-declare": "oo/declare",
	
	"oo-delegate": "oo/delegate",
	
	"oo-extend": "oo/extend",
	
	// Feature group 'uri'
	
	"uri": "uri/objectToQuery"
});
