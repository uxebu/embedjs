define(['embed', 'feature!lang-mixin'], function(embed){

	embed.extend = function(/*Object*/ constructor, /*Object...*/ props){
		// summary:
		//		Adds all properties and methods of props to constructor's
		//		prototype, making them available to all instances created with
		//		constructor.
		for(var i=1, l=arguments.length; i<l; i++){
			embed._mixin(constructor.prototype, arguments[i]);
		}
		return constructor; // Object
	}

	return embed;

});