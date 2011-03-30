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

	var methodHash = {
		"true": "add",
		"false": "remove",
		"undefined": "toggle"
	};
	dojo.byId(node).classList[methodHash[condition + ""]](classStr);
};

dojo.addClass = function(node, classStr){
	node = dojo.byId(node);
	var classes = classStr.split ? classStr.split(" ") : classStr;
	for (var i=0, l=classes.length; i<l; i++){
		classes[i].length && node.classList.add(classes[i]);
	}
};

dojo.removeClass = function(node, classStr){
	node = dojo.byId(node);
	if (classStr === undefined){
		node.className = "";
	} else {
		var classes = classStr.split ? classStr.split(" ") : classStr;
		for (var i=0, l=classes.length; i<l; i++){
			classes[i].length && node.classList.remove(classes[i]);
		}
	}
};
