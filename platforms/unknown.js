define({
	"embed": "embed",
	
	"array":[
		{
			isAvailable: function(){
			return false;
				return !![].forEach;
			},
			file: "array/native"
		},
		{
			isAvailable: function(){
				return true;
			},
			file: "array/functional"
		}
	],
	
	"lang-mixin": "lang/mixin"
});
