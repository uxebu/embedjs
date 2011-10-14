define(['embed', 'feature!lang-mixin'], function(embed){

	embed.delegate = embed._delegate = (function(){
		function TMP(){}
		return function(obj, props){
			// summary:
			//		boodman/crockford delegation w/ cornford optimization
			// feature:
			//		oo-delegate
			TMP.prototype = obj;
			var tmp = new TMP();
			TMP.prototype = null;
			if(props){
				embed._mixin(tmp, props);
			}
			return tmp; // Object
		}
	})();

	return embed;

});