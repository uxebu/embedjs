define({
	"embed": "embed",
	
	"array":[
		{
			isAvailable: function(){
				return !![].forEach;
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
	
	"destroy-destroy": "destroy/destroy",
	
	"geolocation": "geolocation/w3c",
	
	"html-attr": "html/attr",
	
	"html-element": "html/element",
	
	"html-class": "html/class",
	
	"html-style": "html/style",
	
    "html-ready": "html/ready",
    
    "html-id": "html/id",
    
    "json": "json/json",
    
	"lang-toarray": "lang/to-array",
	
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
