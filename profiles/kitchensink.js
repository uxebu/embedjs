
define([
    	
    	// Feature 'array'
    	
    	'feature!array',
    	
    	// Feature group 'connect'
    	
    	'feature!connect-connect',
    	
    	'feature!connect-event',
    	
    	'feature!connect-pubsub',
    	
    	// Feature group 'async'
    	
    	'feature!async-promise',
    	
    	'feature!async-when',
    	
    	'feature!async-deferred',
    	
    	// Feature group 'html'
    	
    	'feature!html-attr',
    	
    	'feature!html-element',
    	
    	'feature!html-todom',
    	
    	'feature!html-class',
    	
    	'feature!html-style',
    	
    	'feature!html-ready',
    	
    	'feature!html-id',
    	
    	'feature!html-destroy',
    	
    	// Feature 'json'
    	
    	'feature!json',
    	
    	// Feature group 'lang'
    	
    	'feature!lang-toarray',
    	
    	'feature!lang-clone',
    	
    	'feature!lang-hitch',
    	
    	'feature!lang-is',
    	
    	'feature!lang-string',
    	
    	'feature!lang-mixin',
    	
    	'feature!lang-object',
    	
    	// Feature group 'transport'
    	
    	'feature!transport-xhr',
    	
    	'feature!transport-script',
    	
    	'feature!transport-jsonp',
    	
    	// Feature 'query'
    	
    	'feature!query',
    	
    	// Feature group 'queryExtensions'
    	
    	'feature!queryExtensions-ChainableNodeArray',
    	
    	// Feature group 'oo'
    	
    	'feature!oo-declare',
    	
    	'feature!oo-delegate',
    	
    	'feature!oo-extend',
    	
    	// Feature group 'uri'
    	
    	'feature!uri'
],
function(embed){
	// This is the place to attach
	// embed to the global namespace,
	// if we want to.
	embed.global.embed = embed;
	
	return embed;
});
