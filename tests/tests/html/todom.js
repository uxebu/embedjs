// This test group tests the base html methods:
//   create, place, destroy and toDom

require([], function(){

tests.register("html-todom", 
	[

		function toDomSpans(t){
			var n = dojo._toDom("<span>1</span><span>2</span>");
			doh.is(2, n.childNodes.length);
			doh.is("span", n.firstChild.tagName.toLowerCase());
			doh.is("1", n.firstChild.innerHTML);
			doh.is("span", n.lastChild.tagName.toLowerCase());
			doh.is("2", n.lastChild.innerHTML);
		},

		function toDomTr(t){
			var n = dojo._toDom("<tr><td>First!</td></tr>");
			doh.is("tr", n.tagName.toLowerCase());
			doh.is(1, n.childNodes.length);
			doh.is("td", n.firstChild.tagName.toLowerCase());
			doh.is("First!", n.firstChild.innerHTML);
		},

		function toDomText(t){
			var n = dojo._toDom("Hello, world!");
			doh.is(3, n.nodeType);
			doh.is("Hello, world!", n.nodeValue);
		},

		function toDomOption(t){
			var n = dojo._toDom('<option value="1">First</option>');
			doh.f(n.selected);

			var n = dojo._toDom('<option value="1" selected="selected">First</option>');
			doh.t(n.selected);

			n = dojo._toDom('<option value="1">First</option><option value="2" selected>Second</option>');
			doh.f(n.childNodes[0].selected);
			doh.t(n.childNodes[1].selected);
		},

	]
);

});