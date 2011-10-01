// TODO: We probably do want to have sth like this, gotta still
//	figure out what. Maybe some chached results from has.js. Will
//	have to map that to our internal detection, though.

//
//	This file takes care of loading the appropriate *.js file for the
//	platform we are on, currently. End users will only need to
//	1) include this file in their index.html,
//	2) make sure all the platform specific files embed-*.js are in the same directory 
//	This file has to be in the same directory as the final library file that
//	will be loaded.
//

(function(){
	var ua = window.navigator.userAgent
	
	var map = {
		"android":/android/i,
		"blackberry":/blackberry/i,
		"blackberry4.6":/blackberry4\.6/i,
		"firefox3":/gecko/i,
		"ios":/iphone/i,
		"nokia-wrt":/nokia.*wrt/,
	};
	
	function loadScript(fileName){
console.log(arguments);
		var s = document.createElement("script");
		s.src = fileName;
		s.type = "text/javascript";
		document.body.appendChild(s);
	}
	
	loadScript("embed-kitchensink-" + platform + ".js");
})();
