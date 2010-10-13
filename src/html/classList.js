dojo.hasClass = function(node, classStr){
	return node.classList.contains(classStr);
}

dojo.toggleClass = function(/*DomNode|String*/node, /*String*/classStr, /*Boolean?*/condition){
	//	summary:
	//		Adds a class to node if not present, or removes if present.
	//		Pass a boolean condition if you want to explicitly add or remove.
	//	condition:
	//		If passed, true means to add the class, false means to remove.
	//
	// example:
	//	| dojo.toggleClass("someNode", "hovered");
	//
	// example:
	// 	Forcefully add a class
	//	| dojo.toggleClass("someNode", "hovered", true);
	//
	// example:
	//	Available in `dojo.NodeList` for multiple toggles
	//	| dojo.query(".toggleMe").toggleClass("toggleMe");

	if(condition === undefined){
		condition = !dojo.hasClass(node, classStr);
	}
	dojo[condition ? "addClass" : "removeClass"](node, classStr);
};

(function(){
	var spaces = /\s+/;
	var str2array = function(s){
		if(typeof s == "string" || s instanceof String){
			if(s.indexOf(" ") < 0){
				return [s];
			}else{
				return dojo.trim(s).split(spaces);
			}
		}
		// assumed to be an array
		return s;
	};
	
	dojo.addClass = function(node, classStr){
		var classes = str2array(classStr);
		for (var i=0, l=classes.length; i<l; i++){
			node.classList.add(classes[i]);
		}
	}
	
	dojo.removeClass = function(node, classStr){
		if (classStr === undefined){
			node.className = "";
		} else {
			var classes = str2array(classStr);
			for (var i=0, l=classes.length; i<l; i++){
				node.classList.remove(classes[i]);
			}
		}
	}
})();
