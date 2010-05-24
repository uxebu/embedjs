require({
	paths:{
		"dojo/connect":"dojo/connect/ie",
		"dojo/array":"dojo/array/functional"
	}
});
require.modify({
	"dojo/html":"dojo/html/ie",
	"dojo/xhr":"dojo/xhr/activex",
	"dojo/destroy":"dojo/destroy/memory_leak",
	"dojo/html": "dojo/html/query-acme"
});