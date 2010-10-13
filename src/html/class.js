dojo.hasClass = function(/*DomNode|String*/node, /*String*/classStr){
	//	summary:
	//		Returns whether or not the specified classes are a portion of the
	//		class list currently applied to the node.
	//
	//	node:
	//		String ID or DomNode reference to check the class for.
	//
	//	classStr:
	//		A string class name to look for.
	//
	//	example:
	//	| if(dojo.hasClass("someNode","aSillyClassName")){ ... }
	return ((" "+ dojo.byId(node).className +" ").indexOf(" " + classStr + " ") >= 0);  // Boolean
};

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
		//	summary:
		//		Adds the specified classes to the end of the class list on the
		//		passed node. Will not re-apply duplicate classes.
		//
		//	node: DomNode|String
		//		String ID or DomNode reference to add a class string too
		//
		//	classStr: String|Array
		//		A String class name to add, or several space-separated class names,
		//		or an array of class names.
		//
		// example:
		//	Add a class to some node:
		//	|	dojo.addClass("someNode", "anewClass");
		//
		// example:
		//	Add two classes at once:
		//	| 	dojo.addClass("someNode", "firstClass secondClass");
		//
		// example:
		//	Add two classes at once (using array):
		//	| 	dojo.addClass("someNode", ["firstClass", "secondClass"]);
		//
		// example:
		//	Available in `dojo.NodeList` for multiple additions
		//	| dojo.query("ul > li").addClass("firstLevel");
	
		node = dojo.byId(node);
		classStr = str2array(classStr);
		var cls = " " + node.className + " ";
		for(var i = 0, len = classStr.length, c; i < len; ++i){
			c = classStr[i];
			if(c && cls.indexOf(" " + c + " ") < 0){
				cls += c + " ";
			}
		}
		node.className = dojo.trim(cls);
	};
	
	dojo.removeClass = function(/*DomNode|String*/node, /*String|Array?*/classStr){
		// summary:
		//		Removes the specified classes from node. No `dojo.hasClass`
		//		check is required.
		//
		// node:
		// 		String ID or DomNode reference to remove the class from.
		//
		// classStr:
		//		An optional String class name to remove, or several space-separated
		//		class names, or an array of class names. If omitted, all class names
		//		will be deleted.
		//
		// example:
		//	Remove a class from some node:
		// 	| dojo.removeClass("someNode", "firstClass");
		//
		// example:
		//	Remove two classes from some node:
		// 	| dojo.removeClass("someNode", "firstClass secondClass");
		//
		// example:
		//	Remove two classes from some node (using array):
		// 	| dojo.removeClass("someNode", ["firstClass", "secondClass"]);
		//
		// example:
		//	Remove all classes from some node:
		// 	| dojo.removeClass("someNode");
		//
		// example:
		//	Available in `dojo.NodeList` for multiple removal
		//	| dojo.query(".foo").removeClass("foo");
	
		node = dojo.byId(node);
		var cls;
		if(classStr !== undefined){
			classStr = str2array(classStr);
			cls = " " + node.className + " ";
			for(var i = 0, len = classStr.length; i < len; ++i){
				cls = cls.replace(" " + classStr[i] + " ", " ");
			}
			cls = dojo.trim(cls);
		}else{
			cls = "";
		}
		if(node.className != cls){ node.className = cls; }
	};
})();