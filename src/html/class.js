define(['embed', 'feature!html-id', 'feature!lang-string'], function(embed){
	
	embed.hasClass = function(/*DomNode|String*/node, /*String*/classStr){
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
		//	| if(embed.hasClass("someNode","aSillyClassName")){ ... }
		return ((" "+ embed.byId(node).className +" ").indexOf(" " + classStr + " ") >= 0);  // Boolean
	};
	
	embed.toggleClass = function(/*DomNode|String*/node, /*String*/classStr, /*Boolean?*/condition){
		//	summary:
		//		Adds a class to node if not present, or removes if present.
		//		Pass a boolean condition if you want to explicitly add or remove.
		//	condition:
		//		If passed, true means to add the class, false means to remove.
		//
		// example:
		//	| embed.toggleClass("someNode", "hovered");
		//
		// example:
		// 	Forcefully add a class
		//	| embed.toggleClass("someNode", "hovered", true);
		//
		// example:
		//	Available in `embed.NodeList` for multiple toggles
		//	| embed.query(".toggleMe").toggleClass("toggleMe");
	
		if(condition === undefined){
			condition = !embed.hasClass(node, classStr);
		}
		embed[condition ? "addClass" : "removeClass"](node, classStr);
	};
	
	var spaces = /\s+/;
	var str2array = function(s){
		if(typeof s == "string" || s instanceof String){
			if(s.indexOf(" ") < 0){
				return [s];
			}else{
				return embed.trim(s).split(spaces);
			}
		}
		// assumed to be an array
		return s;
	};

	embed.addClass = function(node, classStr){
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
		//	|	embed.addClass("someNode", "anewClass");
		//
		// example:
		//	Add two classes at once:
		//	| 	embed.addClass("someNode", "firstClass secondClass");
		//
		// example:
		//	Add two classes at once (using array):
		//	| 	embed.addClass("someNode", ["firstClass", "secondClass"]);
		//
		// example:
		//	Available in `embed.NodeList` for multiple additions
		//	| embed.query("ul > li").addClass("firstLevel");
	
		node = embed.byId(node);
		classStr = str2array(classStr);
		var cls = " " + node.className + " ";
		for(var i = 0, len = classStr.length, c; i < len; ++i){
			c = classStr[i];
			if(c && cls.indexOf(" " + c + " ") < 0){
				cls += c + " ";
			}
		}
		node.className = embed.trim(cls);
	};
	
	embed.removeClass = function(/*DomNode|String*/node, /*String|Array?*/classStr){
		// summary:
		//		Removes the specified classes from node. No `embed.hasClass`
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
		// 	| embed.removeClass("someNode", "firstClass");
		//
		// example:
		//	Remove two classes from some node:
		// 	| embed.removeClass("someNode", "firstClass secondClass");
		//
		// example:
		//	Remove two classes from some node (using array):
		// 	| embed.removeClass("someNode", ["firstClass", "secondClass"]);
		//
		// example:
		//	Remove all classes from some node:
		// 	| embed.removeClass("someNode");
		//
		// example:
		//	Available in `embed.NodeList` for multiple removal
		//	| embed.query(".foo").removeClass("foo");
	
		node = embed.byId(node);
		var cls;
		if(classStr !== undefined){
			classStr = str2array(classStr);
			cls = " " + node.className + " ";
			for(var i = 0, len = classStr.length; i < len; ++i){
				cls = cls.replace(" " + classStr[i] + " ", " ");
			}
			cls = embed.trim(cls);
		}else{
			cls = "";
		}
		if(node.className != cls){ node.className = cls; }
	};
	
	return embed;

});