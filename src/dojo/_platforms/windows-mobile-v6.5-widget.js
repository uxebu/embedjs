require({
	paths:{
		"dojo/connect":"dojo/connect/ie",
		"dojo/array":"dojo/array/functional",
		"dojo/json":"dojo/json/dojo-json",
		"dojo/lang/clone":"dojo/lanf/clone-ie"
	}
});
require.modify({
	"dojo/xhr":"dojo/xhr/activex",
	"dojo/destroy":"dojo/destroy/memory_leak",
	"dojo/html":"dojo/html/ie"
});
// adding additional modifier for the dojo/html module
require.modify({
	"dojo/html":"dojo/html/query-acme"
})