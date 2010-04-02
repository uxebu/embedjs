require.def("dojo/oo/delegate", [
	"require",
	"dojo"
], function(require, dojo){

dojo.delegate = dojo._delegate = (function(){
	// boodman/crockford delegation w/ cornford optimization
	function TMP(){}
	return function(obj, props){
		TMP.prototype = obj;
		var tmp = new TMP();
		TMP.prototype = null;
		if(props){
			dojo._mixin(tmp, props);
		}
		return tmp; // Object
	}
})();
return dojo.delegate; });