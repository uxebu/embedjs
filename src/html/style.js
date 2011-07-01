

// =============================
// Style Functions
// =============================

// getComputedStyle drives most of the style code.
// Wherever possible, reuse the returned object.
//
// API functions below that need to access computed styles accept an
// optional computedStyle parameter.
// If this parameter is omitted, the functions will call getComputedStyle themselves.
// This way, calling code can access computedStyle once, and then pass the reference to
// multiple API functions.

// Although we normally eschew argument validation at this
// level, here we test argument 'node' for (duck)type,
// by testing nodeType, ecause 'document' is the 'parentNode' of 'body'
// it is frequently sent to this function even
// though it is not Element.
dojo.getComputedStyle = function(node){
	//	summary:
	//		Returns a "computed style" object.
	//
	//	description:
	//		Gets a "computed style" object which can be used to gather
	//		information about the current state of the rendered node.
	//
	//		Note that this may behave differently on different browsers.
	//		Values may have different formats and value encodings across
	//		browsers.
	//
	//		Note also that this method is expensive.  Wherever possible,
	//		reuse the returned object.
	//
	//		Use the dojo.style() method for more consistent (pixelized)
	//		return values.
	//
	//	node: DOMNode
	//		A reference to a DOM node. Does NOT support taking an
	//		ID string for speed reasons.
	//	example:
	//	|	dojo.getComputedStyle(dojo.byId('foo')).borderWidth;
	//
	//	example:
	//	Reusing the returned object, avoiding multiple lookups:
	//	|	var cs = dojo.getComputedStyle(dojo.byId("someNode"));
	//	|	var w = cs.width, h = cs.height;
	//	returns: CSS2Properties
	
	/* We once had the following impl. Why?
		var s;
		if(node.nodeType == 1){
			var dv = node.ownerDocument.defaultView;
			s = dv.getComputedStyle(node, null);
			if(!s && node.style){
				node.style.display = "";
				s = dv.getComputedStyle(node, null);
			}
		}
		return s || {};
	*/
	
	return node.nodeType == 1 ?
		node.ownerDocument.defaultView.getComputedStyle(node, null) : {};
};

dojo.style = function(	/*DomNode|String*/ node,
						/*String?|Object?*/ style,
						/*String?*/ value){
	//	summary:
	//		Accesses styles on a node. If 2 arguments are
	//		passed, acts as a getter. If 3 arguments are passed, acts
	//		as a setter.
	//	description:
	//		Getting the style value uses the computed style for the node, so the value
	//		will be a calculated value, not just the immediate node.style value.
	//		Also when getting values, use specific style names,
	//		like "borderBottomWidth" instead of "border" since compound values like
	//		"border" are not necessarily reflected as expected.
	//		If you want to get node dimensions, use dojo.marginBox() or
	//		dojo.contentBox().
	//	node:
	//		id or reference to node to get/set style for
	//	style:
	//		the style property to set in DOM-accessor format
	//		("borderWidth", not "border-width") or an object with key/value
	//		pairs suitable for setting each property.
	//	value:
	//		If passed, sets value on the node for style, handling
	//		cross-browser concerns.  When setting a pixel value,
	//		be sure to include "px" in the value. For instance, top: "200px".
	//		Otherwise, in some cases, some browsers will not apply the style.
	//	example:
	//		Passing only an ID or node returns the computed style object of
	//		the node:
	//	|	dojo.style("thinger");
	//	example:
	//		Passing a node and a style property returns the current
	//		normalized, computed value for that property:
	//	|	dojo.style("thinger", "opacity"); // 1 by default
	//
	//	example:
	//		Passing a node, a style property, and a value changes the
	//		current display of the node and returns the new computed value
	//	|	dojo.style("thinger", "opacity", 0.5); // == 0.5
	//
	//	example:
	//		Passing a node, an object-style style property sets each of the values in turn and returns the computed style object of the node:
	//	|	dojo.style("thinger", {
	//	|		"opacity": 0.5,
	//	|		"border": "3px solid black",
	//	|		"height": "300px"
	//	|	});
	//
	// 	example:
	//		When the CSS style property is hyphenated, the JavaScript property is camelCased.
	//		font-size becomes fontSize, and so on.
	//	|	dojo.style("thinger",{
	//	|		fontSize:"14pt",
	//	|		letterSpacing:"1.2em"
	//	|	});
	//
	//	example:
	//		dojo.NodeList implements .style() using the same syntax, omitting the "node" parameter, calling
	//		dojo.style() on every element of the list. See: dojo.query and dojo.NodeList
	//	|	dojo.query(".someClassName").style("visibility","hidden");
	//	|	// or
	//	|	dojo.query("#baz > div").style({
	//	|		opacity:0.75,
	//	|		fontSize:"13pt"
	//	|	});
	//
	//	returns: CSS2Properties||String
	var n = dojo.byId(node);
	var l = arguments.length;
	
	// >>> // Three parameters are handled as a setter.
	// >>> var n = embed.query("div")[0];
	// >>> embed.style(n, "color", "lime");
	// >>> embed.style(n, "color");
	// "lime"
	if (l == 3) {
		return n.style[style] = value; /*Number*/
	}
	// Two parameters and the second is an object, we handle this as a setter.
	// And we iterate over the second parameter, the property is the style.
	//
	// >>> // Setter using an object, tests also getter using a string as a 2nd parameter.
	// >>> var n = embed.query("div")[0];
	// >>> embed.style(n, {color:"red", backgroundColor:"white"});
	// >>> embed.style(n, "color");
	// "red"
	if (l == 2) {
		if (typeof style == "string"){ // inline'd type check
			return n.style[style];
		} else {
			for(var x in style){
				n.style[x] = style[x];
			}
			return;
		}
	}
	// >>> // Return computedStyle if only node is given, just a shortcut.
	// >>> res = embed.style(embed.query("div")[0])
	// >>> typeof res == "object" && "cssText" in res
	// true
	return dojo.getComputedStyle(n);
};

