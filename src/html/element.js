define(['embed', 'feature!html-id', 'feature!html-style', 'feature!html-todom'], function(embed){

	embed._docScroll = function(){
		var n = d.global;
		return "pageXOffset" in n? { x:n.pageXOffset, y:n.pageYOffset } :
			(n=embed.doc.documentElement, n.clientHeight? { x:n.scrollLeft, y:n.scrollTop } :
			(n=embed.body(), { x:n.scrollLeft||0, y:n.scrollTop||0 }));
	};

	var _insertBefore = function(/*DomNode*/node, /*DomNode*/ref){
		var parent = ref.parentNode;
		if(parent){
			parent.insertBefore(node, ref);
		}
	};

	var _insertAfter = function(/*DomNode*/node, /*DomNode*/ref){
		//	summary:
		//		Try to insert node after ref
		var parent = ref.parentNode;
		if(parent){
			if(parent.lastChild == ref){
				parent.appendChild(node);
			}else{
				parent.insertBefore(node, ref.nextSibling);
			}
		}
	};

	embed.place = function(node, refNode, position){
		//	summary:
		//		Attempt to insert node into the DOM, choosing from various positioning options.
		//		Returns the first argument resolved to a DOM node.
		//
		//	node: String|DomNode
		//		id or node reference, or HTML fragment starting with "<" to place relative to refNode
		//
		//	refNode: String|DomNode
		//		id or node reference to use as basis for placement
		//
		//	position: String|Number?
		//		string noting the position of node relative to refNode or a
		//		number indicating the location in the childNodes collection of refNode.
		//		Accepted string values are:
		//	|	* before
		//	|	* after
		//	|	* replace
		//	|	* only
		//	|	* first
		//	|	* last
		//		"first" and "last" indicate positions as children of refNode, "replace" replaces refNode,
		//		"only" replaces all children.  position defaults to "last" if not specified
		//
		//	returns: DomNode
		//		Returned values is the first argument resolved to a DOM node.
		//
		//		.place() is also a method of `embed.NodeList`, allowing `embed.query` node lookups.
		//
		// example:
		//		Place a node by string id as the last child of another node by string id:
		//	|	embed.place("someNode", "anotherNode");
		//
		// example:
		//		Place a node by string id before another node by string id
		//	|	embed.place("someNode", "anotherNode", "before");
		//
		// example:
		//		Create a Node, and place it in the body element (last child):
		//	|	embed.place("<div></div>", embed.body());
		//
		// example:
		//		Put a new LI as the first child of a list by id:
		//	|	embed.place("<li></li>", "someUl", "first");	
		// feature:
		//		html-element

		var byId = embed.byId;
		refNode = byId(refNode);
		if(typeof node == "string"){ // inline'd type check
			node = node.charAt(0) == "<" ? embed.toDom(node, refNode.ownerDocument) : byId(node);
		}
		if(typeof position == "number"){ // inline'd type check
			var cn = refNode.childNodes;
			if(!cn.length || cn.length <= position){
				refNode.appendChild(node);
			}else{
				_insertBefore(node, cn[position < 0 ? 0 : position]);
			}
		}else{
			switch(position){
				case "before":
					_insertBefore(node, refNode);
					break;
				case "after":
					_insertAfter(node, refNode);
					break;
				case "replace":
					refNode.parentNode.replaceChild(node, refNode);
					break;
				case "only":
					embed.empty(refNode);
					refNode.appendChild(node);
					break;
				case "first":
					if(refNode.firstChild){
						_insertBefore(node, refNode.firstChild);
						break;
					}
					// else fallthrough...
				default: // aka: last
					refNode.appendChild(node);
			}
		}
		return node; // DomNode
	};
	
	embed.create = function(/* String|DomNode */ tag, /* Object? */ attrs, /* String|DomNode? */refNode, /* String? */pos){
		//	summary:
		//		Create an element, allowing for optional attribute decoration
		//		and placement.
		//
		// description:
		//		A DOM Element creation function. A shorthand method for creating a node or
		//		a fragment, and allowing for a convenient optional attribute setting step,
		//		as well as an optional DOM placement reference.
		//
		//		Attributes are set by passing the optional object through `embed.attr`.
		//		See `embed.attr` for noted caveats and nuances, and API if applicable.
		//
		//		Placement is done via `embed.place`, assuming the new node to be the action 
		//		node, passing along the optional reference node and position.
		//
		// tag: String|DomNode
		//		A string of the element to create (eg: "div", "a", "p", "li", "script", "br"),
		//		or an existing DOM node to process.
		//
		// attrs: Object
		//		An object-hash of attributes to set on the newly created node.
		//		Can be null, if you don't want to set any attributes/styles.
		//		See: `embed.attr` for a description of available attributes.
		//
		// refNode: String?|DomNode?
		//		Optional reference node. Used by `embed.place` to place the newly created
		//		node somewhere in the dom relative to refNode. Can be a DomNode reference
		//		or String ID of a node.
		//
		// pos: String?
		//		Optional positional reference. Defaults to "last" by way of `embed.place`,
		//		though can be set to "first","after","before","last", "replace" or "only"
		//		to further control the placement of the new node relative to the refNode.
		//		'refNode' is required if a 'pos' is specified.
		//
		// returns:
		//		DomNode
		//
		// example:
		//	Create a DIV:
		//	|	var n = embed.create("div");
		//
		// example:
		//	Create a DIV with content:
		//	|	var n = embed.create("div", { innerHTML:"<p>hi</p>" });
		//
		// example:
		//	Place a new DIV in the BODY, with no attributes set
		//	|	var n = embed.create("div", null, embed.body());
		//
		// example:
		//	Create an UL, and populate it with LI's. Place the list as the first-child of a 
		//	node with id="someId":
		//	|	var ul = embed.create("ul", null, "someId", "first");
		//	|	var items = ["one", "two", "three", "four"];
		//	|	embed.forEach(items, function(data){
		//	|		embed.create("li", { innerHTML: data }, ul);
		//	|	});
		//
		// example:
		//	Create an anchor, with an href. Place in BODY:
		//	|	embed.create("a", { href:"foo.html", title:"Goto FOO!" }, embed.body());
		//
		// example:
		//	Use embed.query() for syntatic sugar:
		//	|	embed.query(embed.create('div'))
		//	|		.addClass("newDiv")
		//	|		.onclick(function(e){ console.log('clicked', e.target) })
		//	|		.place("#someNode"); // redundant, but cleaner.	
		// feature:
		//		html-element

		var byId = embed.byId;
		var doc = embed.doc;
		if(refNode){
			refNode = byId(refNode);
			doc = refNode.ownerDocument;
		}
		if(typeof tag == "string"){ // inline'd type check
			tag = doc.createElement(tag);
		}
		if(attrs){
			//embed.attr(tag, attrs);
			for(var propName in attrs){
				var value = attrs[propName];
			
				if(propName == 'style' && typeof value != 'string'){ // inline'd type check
					// special case: setting a style
					embed.style(tag, value);
					break;
				}else if(propName == 'class'){
					tag.className = value;
				}else{
					tag[propName] = value;
				}
			}
		}
		if(refNode){ embed.place(tag, refNode, pos); }
		return tag; // DomNode
	};
	
	embed.empty = function(/* DomNode */node){
		// summary:
		//		Empties (clears) a DomNode.	
		// feature:
		//		html-element
		embed.byId(node).innerHTML = "";
	};
	
	return embed;

});