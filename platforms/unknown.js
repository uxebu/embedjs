define({
	"embed": "embed",
	
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
	
	"connect-connect": "connect/connect",
	
	"connect-event": "connect/event",
	
	"connect-pubsub": "connect/pubsub",
	
	"async-promise": "async/promise",
	
    "async-when": "async/when",
    
    "async-deferred": "async/deferred",
	
	"geolocation": "geolocation/w3c",
	
	"html-attr": "html/attr",
	
	"html-element": "html/element",
	
	"html-todom": "html/todom",
	
	"html-class": "html/class",
	
	"html-style": "html/style",
	
    "html-ready": "html/ready",
    
    "html-id": "html/id",
	
	"html-destroy": "html/destroy",
    
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
    
	"lang-toarray": "lang/toarray",
	
	"lang-clone": "lang/clone",
	
	"lang-hitch": "lang/hitch",
	
	"lang-is": "lang/is",
	
	"lang-string": "lang/string",
	
    "lang-mixin": "lang/mixin",
    
    "lang-object": "lang/object",
    
	"transport-xhr": "transport/xhr",
	
	"transport-script": "transport/script",
	
	"transport-jsonp": "transport/jsonp",
	
	"query": "query/qsa-preprocessor",
	
	"query:qsa":"query/qsa",
	
	"query:simple": "query/simple",
	
	"queryExtensions-ChainableNodeArray": "queryExtensions/ChainableNodeArray",
	
	"oo-declare": "oo/declare",
	
	"oo-delegate": "oo/delegate",
	
	"oo-extend": "oo/extend",
	
	"uri": "uri/objectToQuery"
});
