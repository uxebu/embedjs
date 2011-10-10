define(['../../platforms/unknown'], function(impls){
	
	// overwrite some impls to choose the ones that have the docs.
	
	impls['array'] = 'array/functional';
	impls['html-class'] = 'html/class';
	impls['json'] = 'json/dojo-json';
	
	return impls;
});