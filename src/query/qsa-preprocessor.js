define(['embed', 'feature!html-id'], function(embed){

	embed.query = function(query, scope){
		//	summary:
		//		Returns nodes which match the given CSS3 selector, searching the
		//		entire document by default but optionally taking a node to scope
		//		the search by. Returns an instance of Array.
		//	description:
		//		embed.query() is the swiss army knife of DOM node manipulation in
		//		EmbedJS. Much like Prototype's "$$" (bling-bling) function or JQuery's
		//		"$" function, embed.query provides robust, high-performance
		//		CSS-based node selector support with the option of scoping searches
		//		to a particular sub-tree of a document.
		//
		//		Supported Selectors:
		//		--------------------
		//
		//		embed.query() supports a rich set of CSS3 selectors, including:
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
		//		`embed.query()`, including compound selectors ("," delimited).
		//		Very complex and useful searches can be constructed with this
		//		palette of selectors and when combined with functions for
		//		manipulation presented by queryExtensions, many types of DOM
		//		manipulation operations become very straightforward.
		//		
		//		Unsupported Selectors:
		//		----------------------
		//
		//		While embed.query handles many CSS3 selectors, some fall outside of
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
		//		embede.query and XML Documents:
		//		-----------------------------
		//		
		//		`embed.query` (as of dojo 1.2) supports searching XML documents
		//		in a case-sensitive manner. If an HTML document is served with
		//		a doctype that forces case-sensitivity (e.g., XHTML 1.1
		//		Strict), embed.query() will detect this and "do the right
		//		thing". Case sensitivity is dependent upon the document being
		//		searched and not the query used. It is therefore possible to
		//		use case-sensitive queries on strict sub-documents (iframes,
		//		etc.) or XML documents while still assuming case-insensitivity
		//		for a host/root document.
		//
		//	query:
		//		The CSS3 expression to match against. For details on the syntax of
		//		CSS3 selectors, see <http://www.w3.org/TR/css3-selectors/#selectors>
		//	root:
		//		A DOMNode (or node id) to scope the search from. Optional.
		//	returns: DOMCollection || Array
		//		The matching nodes. DOMCollection is enumerable, so you can use
		//		it with embed.forEach.
		//	example:
		//		search the entire document for elements with the class "foo":
		//	|	embed.query(".foo");
		//		these elements will match:
		//	|	<span class="foo"></span>
		//	|	<span class="foo bar"></span>
		//	|	<p class="thud foo"></p>
		//	example:
		//		search the entire document for elements with the classes "foo" *and* "bar":
		//	|	embed.query(".foo.bar");
		//		these elements will match:
		//	|	<span class="foo bar"></span>
		//		while these will not:
		//	|	<span class="foo"></span>
		//	|	<p class="thud foo"></p>
		//	example:
		//		find `<span>` elements which are descendants of paragraphs and
		//		which have a "highlighted" class:
		//	|	embed.query("p span.highlighted");
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
		//	|	embed.query("#tabular_data > tbody > tr:nth-child(odd)").addClass("odd");
		//	example:
		//		remove all elements with the class "error" from the document
		//		and store them in a list:
		//	|	var errors = embed.query(".error").orphan();
		//	example:
		//		add an onclick handler to every submit button in the document
		//		which causes the form to be sent via Ajax instead:
		//	|	embed.query("input[type='submit']").onclick(function(e){
		//	|		embed.stopEvent(e); // prevent sending the form
		//	|		var btn = e.target;
		//	|		embed.xhrPost({
		//	|			form: btn.form,
		//	|			load: function(data){
		//	|				// replace the form with the response
		//	|				var div = embed.doc.createElement("div");
		//	|				embed.place(div, btn.form, "after");
		//	|				div.innerHTML = data;
		//	|				embed.style(btn.form, "display", "none");
		//	|			}
		//	|		});
		//	|	});
		//	issues:
		//		On webkit, the following queries will not work as expected:
		//		(Note that these are bugs webkit's querySelector engine.)
		//	|	embed.query('[foo|="bar"]') // will also return elements with foo="bar"
		//	|	embed.query('option:checked') // will return an empty list
		//	dojo-incompatibilities:
		//		dojo.query will not return a dojo.NodeList Instance! On webkit it will
		//		return a DOMCollection or an empty Array.
		//	TODO: 
		//		Update the inline doc when we know if dojo.query "does" support
		//		chaining. Make all query impls return instances of Array.
		
		
		// scope normalization
		if(typeof scope == "string"){
			scope = embed.byId(scope);
			if(!scope){
				return [];
			}
		}
	
		scope = scope || embed.doc;
		
		/*
		QUERY NORMALIZATION:
	
		`embed.query` accepts selectors that start with combinators like "> *"
		or "+ a". It accepts even queries that consist only of a combinator.
		These queries throw errors with querySelectorAll.
	
		Markup like
				<div><p id="myP"><strong>foo</strong></p></div>
		returns the "strong" element with
				document.getElementById("myP").querySelectorAll("div strong");
		Which is incompatible with embed.query
	
		For these reasons, the query is normalized before execution:
		- When the query ends with a combinator (">", "+", "~"), append a universal selector ("*").
		- When the root is document, and the query starts with a child combinator, return the appropriate element.
		- When the root is document, and the query starts with an other combinator than ">", return an empty result.
		- When the root element does not have an id, add a synthetic id.
		- Prefix the query with the id of the root element.
		- Execute the query with QSA.
		- Remove the synthetic id, if added.
		- Return the results.
	
		*/
	
		// Normalize selectors ending with a combinator
		if (/[>+~]\s*$/.test(query)){
			query += "*";
		}
	
		var queryRoot = scope; // `querySelectorAll` will be called on this node.
	
		// check if scope is a document node
		if(scope.nodeType == 9){
			// if the query starts with a child combinator, try scope.querySelector()
			// with the first segment _without_ leading child operator and check
			// if it is scope.documentElement.
			if(/^\s*>/.test(query)){
				// split the query up into the selector that the documentElement must match
				// and the rest of the query.
				var queryParts = query.replace(/^\s*>/, "").match(/([^\s>+~]+)(.*)/);
				if (!queryParts) {
					return [];
				}
	
				var docElmQuery = queryParts[1];
				query = queryParts[2];
	
				// Check if the documentElement matches the first segment of the selector
				if(scope.querySelector(docElmQuery) !== scope.documentElement){
					return [];
				}
	
				// If documentElement matches the first segment of the selector,
				// and the rest of the query is empty return documentElement.
				if(!query){
					return [scope.documentElement];
				}
	
				// execute the rest of the selector against scope.documentElement
				scope = scope.documentElement;
			}
	
			// if the query starts with a ajdacent combinator or a general sibling combinator,
			// return an empty array
			else if(/^\s*[+~]/.test(query)){
				return [];
			}
		}
	
		// check if the root is an element node.
		// We can't use an "else" branch here, because the scope might have changed
		if(scope.nodeType == 1){
			// we need to prefix the query with an id to make QSA work like
			// expected. For details check http://ejohn.org/blog/thoughts-on-queryselectorall/
			var originalId = scope.id;
			var rootId = originalId;
			if(!originalId){
				rootId = scope.id =  "d---embed-query-synthetic-id-" + new Date().getTime(); // is this "secure" enough?
				var syntheticIdSet = true;
			}
	
			query = "#" + rootId + " " + query;
	
			// we need to start the query one element up the chain to make sibling
			// and adjacent combinators work.
			// If there is no parent node run the query against the scope.
			queryRoot = scope.parentNode || scope;
		}
	
		// invalid queries:
		// [">", "body >", "#t >", ".foo >", "> *", "> h3", ">", "> *", "> [qux]", "> [qux]", "> [qux]", ">", "> *", ">*", "+", "~", "#foo ~", "#foo~", "#t span.foo:not(span:first-child)"]
	
		var n = queryRoot.querySelectorAll(query);
	
		// Remove synthetic id from element if set before
		if(syntheticIdSet){
			scope.id = "";
		}
		
		return n || [];
	};

	return embed;

});