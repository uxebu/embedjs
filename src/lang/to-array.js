dojo.toArray = function(obj, offset, startWith){
	return (startWith||[]).concat(Array.prototype.slice.call(obj, offset||0));
};