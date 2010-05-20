var require = function(){};
require.modify = require.replace = function(){};
require.def = function(){
    if(arguments.length == 2 && Object.prototype.toString.call(arguments[1]) == "[object Function]"){
        arguments[1]();
    }
    if(arguments.length == 3){
        arguments[2]();
    }
};