// This file provides functionality only found in dojo.mini
// Include this file when using original dojo

dojo.isNumeric = function(n){
	return n==parseFloat(n);
}

dojo.isNumber = function(n){
	return typeof n == "number" || n instanceof Number;
}
