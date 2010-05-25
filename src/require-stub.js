var require = function(){};
require.replace = function(){};
require.def = require.modify = function(){
	if(arguments.length == 2 && Object.prototype.toString.call(arguments[1]) == "[object Function]"){
		arguments[1]();
	}
	if(arguments.length == 3){
		arguments[2]();
	}
	if(arguments.length == 4){
		arguments[3]();
	}
};