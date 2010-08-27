dojo.query = function(query, scope){
	//	summary:
	//		Returns nodes which match the given CSS3 selector, searching the
	//		entire document by default but optionally taking a node to scope
	//		the search by. Returns an instance of dojo.NodeList.
	//	description:
	//		dojo.query() is the swiss army knife of DOM node manipulation in
	//		Dojo. Much like Prototype's "$$" (bling-bling) function or JQuery's
	//		"$" function, dojo.query provides robust, high-performance
	//		CSS-based node selector support with the option of scoping searches
	//		to a particular sub-tree of a document.
	//
	//		Supported Selectors:
	//		--------------------
	//
	//		dojo.query() supports a rich set of CSS3 selectors, including:
	//
	//			* class selectors (e.g., `.foo`)
	//			* node type selectors like `span`
	//			* ` ` descendant selectors
	//			* `>` child element selectors 
	//			* `#foo` style ID selectors
	//			* `*` universal selector
	//			* `~`, the immediately preceeded-by sibling selector
	//			* `+`, the preceeded-by sibling selector
	//			* attribute queries:
	//			|	* `[foo]` attribute presence selector
	//			|	* `[foo='bar']` attribute value exact match
	//			|	* `[foo~='bar']` attribute value list item match
	//			|	* `[foo^='bar']` attribute start match
	//			|	* `[foo$='bar']` attribute end match
	//			|	* `[foo*='bar']` attribute substring match
	//			* `:first-child`, `:last-child`, and `:only-child` positional selectors
	//			* `:empty` content emtpy selector
	//			* `:checked` pseudo selector
	//			* `:nth-child(n)`, `:nth-child(2n+1)` style positional calculations
	//			* `:nth-child(even)`, `:nth-child(odd)` positional selectors
	//			* `:not(...)` negation pseudo selectors
	//
	//		Any legal combination of these selectors will work with
	//		`dojo.query()`, including compound selectors ("," delimited).
	//		Very complex and useful searches can be constructed with this
	//		palette of selectors and when combined with functions for
	//		manipulation presented by dojo.NodeList, many types of DOM
	//		manipulation operations become very straightforward.
	//		
	//		Unsupported Selectors:
	//		----------------------
	//
	//		While dojo.query handles many CSS3 selectors, some fall outside of
	//		what's resaonable for a programmatic node querying engine to
	//		handle. Currently unsupported selectors include:
	//		
	//			* namespace-differentiated selectors of any form
	//			* all `::` pseduo-element selectors
	//			* certain pseduo-selectors which don't get a lot of day-to-day use:
	//			|	* `:root`, `:lang()`, `:target`, `:focus`
	//			* all visual and state selectors:
	//			|	* `:root`, `:active`, `:hover`, `:visisted`, `:link`,
	//				  `:enabled`, `:disabled`
	//			* `:*-of-type` pseudo selectors
	//		
	//		dojo.query and XML Documents:
	//		-----------------------------
	//		
	//		`dojo.query` (as of dojo 1.2) supports searching XML documents
	//		in a case-sensitive manner. If an HTML document is served with
	//		a doctype that forces case-sensitivity (e.g., XHTML 1.1
	//		Strict), dojo.query() will detect this and "do the right
	//		thing". Case sensitivity is dependent upon the document being
	//		searched and not the query used. It is therefore possible to
	//		use case-sensitive queries on strict sub-documents (iframes,
	//		etc.) or XML documents while still assuming case-insensitivity
	//		for a host/root document.
	//
	//		Non-selector Queries:
	//		---------------------
	//
	//		If something other than a String is passed for the query,
	//		`dojo.query` will return a new `dojo.NodeList` instance
	//		constructed from that parameter alone and all further
	//		processing will stop. This means that if you have a reference
	//		to a node or NodeList, you can quickly construct a new NodeList
	//		from the original by calling `dojo.query(node)` or
	//		`dojo.query(list)`.
	//
	//	query:
	//		The CSS3 expression to match against. For details on the syntax of
	//		CSS3 selectors, see <http://www.w3.org/TR/css3-selectors/#selectors>
	//	root:
	//		A DOMNode (or node id) to scope the search from. Optional.
	//	returns: DOMCollection || Array
	//		The matching nodes. DOMCollection is enumerable, so you can use
	//		it with dojo.forEach.
	//	example:
	//		search the entire document for elements with the class "foo":
	//	|	dojo.query(".foo");
	//		these elements will match:
	//	|	<span class="foo"></span>
	//	|	<span class="foo bar"></span>
	//	|	<p class="thud foo"></p>
	//	example:
	//		search the entire document for elements with the classes "foo" *and* "bar":
	//	|	dojo.query(".foo.bar");
	//		these elements will match:
	//	|	<span class="foo bar"></span>
	//		while these will not:
	//	|	<span class="foo"></span>
	//	|	<p class="thud foo"></p>
	//	example:
	//		find `<span>` elements which are descendants of paragraphs and
	//		which have a "highlighted" class:
	//	|	dojo.query("p span.highlighted");
	//		the innermost span in this fragment matches:
	//	|	<p class="foo">
	//	|		<span>...
	//	|			<span class="highlighted foo bar">...</span>
	//	|		</span>
	//	|	</p>
	//	example:
	//		set an "odd" class on all odd table rows inside of the table
	//		`#tabular_data`, using the `>` (direct child) selector to avoid
	//		affecting any nested tables:
	//	|	dojo.query("#tabular_data > tbody > tr:nth-child(odd)").addClass("odd");
	//	example:
	//		remove all elements with the class "error" from the document
	//		and store them in a list:
	//	|	var errors = dojo.query(".error").orphan();
	//	example:
	//		add an onclick handler to every submit button in the document
	//		which causes the form to be sent via Ajax instead:
	//	|	dojo.query("input[type='submit']").onclick(function(e){
	//	|		dojo.stopEvent(e); // prevent sending the form
	//	|		var btn = e.target;
	//	|		dojo.xhrPost({
	//	|			form: btn.form,
	//	|			load: function(data){
	//	|				// replace the form with the response
	//	|				var div = dojo.doc.createElement("div");
	//	|				dojo.place(div, btn.form, "after");
	//	|				div.innerHTML = data;
	//	|				dojo.style(btn.form, "display", "none");
	//	|			}
	//	|		});
	//	|	});
	//	issues:
	//		On webkit, the following queries will not work as expected:
	//		(Note that these are bugs webkit's querySelector engine.)
	//	|	dojo.query('[foo|="bar"]') // will also return elements with foo="bar"
	//	|	dojo.query('option:checked') // will return an empty list
	//	dojo-incompatibilities:
	//		dojo.query will not return a dojo.NodeList Instance! On webkit it will
	//		return a DOMCollection or an empty Array.
	//	TODO: 
	//		Update the inline doc when we know if dojo.query "does" support
	//		chaining.
	
	
	// scope normalization
	if(typeof scope == "string"){
		scope = d.byId(scope);
		if(!scope){
			return [];
		}
	}

	scope = scope || dojo.doc;
	var n = scope.querySelectorAll(query);
	return n || [];
};