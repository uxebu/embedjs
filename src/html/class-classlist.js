define(['embed', 'feature!html-id'], function(embed){
		
	embed.hasClass = function(node, classStr){
		return node.classList.contains(classStr);
	}
	
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
	
		var methodHash = {
			"true": "add",
			"false": "remove",
			"undefined": "toggle"
		};
		embed.byId(node).classList[methodHash[condition + ""]](classStr);
	};
	
	embed.addClass = function(node, classStr){
		node = embed.byId(node);
		var classes = classStr.split ? classStr.split(" ") : classStr;
		for (var i=0, l=classes.length; i<l; i++){
			classes[i].length && node.classList.add(classes[i]);
		}
	};
	
	embed.removeClass = function(node, classStr){
		node = embed.byId(node);
		if (classStr === undefined){
			node.className = "";
		} else {
			var classes = classStr.split ? classStr.split(" ") : classStr;
			for (var i=0, l=classes.length; i<l; i++){
				classes[i].length && node.classList.remove(classes[i]);
			}
		}
	};
	
	return embed;
	
});
