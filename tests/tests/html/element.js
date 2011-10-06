// This test group tests create and place

require(['text!../tests/tests/html/element.html'], function(html){
	
var byClass = function(className, tagName, parentNode){
	var res = [];
	tagName = tagName || '*';
	parentNode = parentNode || document;
	var els = parentNode.getElementsByTagName(tagName);
	for(var i=0, m=els.length; i<m; i++){
		var el = els[i];
		if((' ' + el.className + ' ').indexOf(className) != -1){
			res.push(el);
		}
	}
	return res;
}

var removeList = function(nl){
	for(var i=0, m=nl.length; i<m; i++){
		var _el = nl[i];
		_el.parentNode && _el.parentNode.removeChild(_el);
	}
}

tests.register("html-element", 
	[		
	 	function _start(t){
	 		document.body.innerHTML = html;
		},
	
		function createBasic(t){
			// test plain creation
			var n = dojo.create("div");
			dojo.byId("holder1").appendChild(n);
//			dojo.addClass(n, "testing");
//			var q = dojo.query(".testing");
//			doh.is(1, q.length);
			doh.is("div", n.nodeName.toLowerCase());
		},
		
		function createAttrs(t){
			// test attr creation, no placement
			var n = dojo.create('div', {
				className:"hasClass",
				title:"foo",
				style:"border:2px solid #ededed; padding:3px"
			});
			// plain placement:
			dojo.byId("holder1").appendChild(n);
			
			doh.is("hasClass", n.className);
			doh.is("foo", n.getAttribute("title"));
			//FIXME: apparently attr(n, "style", "foo:bar; baz:bam;") doesn't work in IE?
			// need to test further in attr or document.
			//doh.is(3, dojo.style(n, "padding"));
		},
		
		// This test only tests if Node.innerHTML is
		// working correctly – should we just removing it?
		/*
		function createPlace(t){
			// test only creation and placement, no attr
			var n = dojo.create("div", null, dojo.body());
			n.innerHTML = "<p class='bar'>a</p>";
			var q = n.getElementsByTagName('p');
			
			doh.is(1, q.length);
			doh.t(dojo.hasClass(q[0], "bar"));
		},
		*/
		
		function createHtml(t){
			// test creation, placement, and attr (innerHTML)
			var n = dojo.create("div", {
				innerHTML: "<p class='bar2'>a</p>"
			}, dojo.body());
			var q = n.getElementsByTagName('p');
			
			doh.is(1, q.length);
			doh.is("bar2", q[0].className);
		},
		
		function createPlaceRef(t){
			// test creation and referenced placement, with some attr
			var ref = dojo.byId("holder2").getElementsByTagName('li')[1];
			
			var n = dojo.create("li", { 
				innerHTML:"middle", "class":"middleNode"
			}, ref, "before");
			
			doh.is(3, dojo.byId("holder2").getElementsByTagName('li').length);
			
			var nn = dojo.create("li", { 
				innerHTML:"afterLast", "class":"afterLast"
			}, ref, "after");
			
			var classes = ["first", "middleNode", "last", "afterLast"];
			var q = dojo.byId("holder2").getElementsByTagName('li');
			doh.is(4, q.length);
			
			for(var i=0, m=q.length; i<m; i++){
				doh.is(classes[i], q[i].className);
			};
			
		},
		
//		function destroyList(t){
//			// destroy node byId
//			dojo.destroy("holder2");
//			doh.f(dojo.byId("holder2"));
//			// destroyed because is child of holder
//			doh.is(0, dojo.query(".first").length);
//		},
		
		function createList(t){
			// test creation/placement of a variety of node tags
			var es = ["div", "a", "span", "br", "table", "ul", "dd", "img", "h2"];
			for(var i=0, m=es.length; i<m; i++){
				var el = es[i];
				dojo.create(el, null, "holder3");
			};
			var q = dojo.byId('holder3').getElementsByTagName('*');
			doh.is(q.length, es.length);
			
			dojo.byId('holder3').innerHTML = '';
		},
		
//		function destroyAll(t){
//			var c = function(){
//				// eg: don't destroy firebug lite in page
//				var l = dojo.query("body >");
//				return dojo.filter(l, function(n){
//					return !dojo.hasClass(n, "firebug");
//				})
//			}
//			var n = c();
//			dojo.forEach(n, dojo.destroy);
//
//			// check for deepest embeeded id
//			doh.f(dojo.byId("ancFoo"));
//			doh.is(0, c().length);
//		},

		function recreateOneV1(t){
			var n = dojo.create("h2", {
				"class":"restored",
				innerHTML:"<span>The End</span>"
			}, dojo.body());
			
			var q = byClass('restored', 'h2');
			doh.is(1, q.length);
			removeList(q);
		},

		function recreateOneV2(t){
			var n = dojo.place("<h2 class='restored'><span>The End</span></h2>", dojo.body());
			var q = byClass('restored', 'h2');
			doh.is(1, q.length);
			dojo.body().removeChild(n);
		},
		
		/* No empty() in API
		function emptyDiv(t){
			var n = dojo.create("div", {
				innerHTML: "1<span class='red'>2</span>3<em custom='x'>4</em>5"
			});
			doh.isNot("", n.innerHTML);
			dojo.empty(n);
			doh.is("", n.innerHTML);
			dojo.destroy(n);
		},

		function emptyTable(t){
			var table = dojo.create("table", null, dojo.body()),
				tr1 = dojo.create("tr", null, table),
				td1 = dojo.create("td", {innerHTML: "a"}, tr1),
				td2 = dojo.create("td", {innerHTML: "b"}, tr1),
				tr2 = dojo.create("tr", null, table),
				td3 = dojo.create("td", {innerHTML: "c"}, tr2),
				td4 = dojo.create("td", {innerHTML: "d"}, tr2);
			doh.isNot("", table.innerHTML);
			dojo.empty(table);
			doh.is("", table.innerHTML);
			dojo.destroy(table);
		},
		*/

		function placeDivs(t){
			dojo.place("<p class='disposable'>2</p>", dojo.body());
			var n = byClass('disposable', 'p', dojo.body())[0];
			dojo.place("<p class='disposable'>0</p><p class='disposable'>1</p>", n, "before");
			dojo.place("<p class='disposable'>3</p><p class='disposable'>4</p>", n, "after");
			dojo.place("<span>a</span>", n, "first");
			dojo.place("<span>z</span>", n, "last");
			n = byClass('disposable', 'p', dojo.body());
			doh.is(5, n.length);
			doh.is("0", n[0].innerHTML);
			doh.is("1", n[1].innerHTML);
			doh.is("3", n[3].innerHTML);
			doh.is("4", n[4].innerHTML);
			doh.is("<span>a</span>2<span>z</span>", n[2].innerHTML.toLowerCase());
			removeList(n);
		},

		function placeTable(t){
			dojo.place("<table class='disposable'><tbody></tbody></table>", dojo.body());
			var n = byClass('disposable')[0].getElementsByTagName('tbody')[0];
			dojo.place("<tr><td>2</td></tr>", n);
			dojo.place("<tr><td>0</td></tr><tr><td>1</td></tr>", n, "first");
			dojo.place("<tr><td>3</td></tr><tr><td>4</td></tr>", n, "last");
			n = byClass('disposable')[0].getElementsByTagName('tr');
			doh.is(5, n.length);
			doh.is("<td>0</td>", n[0].innerHTML.toLowerCase());
			doh.is("<td>1</td>", n[1].innerHTML.toLowerCase());
			doh.is("<td>2</td>", n[2].innerHTML.toLowerCase());
			doh.is("<td>3</td>", n[3].innerHTML.toLowerCase());
			doh.is("<td>4</td>", n[4].innerHTML.toLowerCase());
			removeList(byClass('disposable', 'table'));
		},

		function placeReplace(t){
			dojo.place("<p class='disposable'>2</p>", dojo.body());
			var n = byClass('disposable')[0];
			dojo.place("<p class='disposable'>0</p><p class='disposable'>1</p>", n, "replace");
			n = byClass('disposable');
			doh.is(2, n.length);
			doh.is("0", n[0].innerHTML);
			doh.is("1", n[1].innerHTML);
			removeList(n);
		},

		function placeOnly(t){
			dojo.place("<p class='disposable'><em>1</em>2<strong>3</strong></p>", dojo.body());
			var n = byClass('disposable')[0];
			dojo.place("<span>42</span>99", n, "only");
			n = byClass('disposable');
			doh.is(1, n.length);
			doh.is("<span>42</span>99", n[0].innerHTML.toLowerCase());
			removeList(n);
		},
		
		function placeNumber(t){
			var n = dojo.place("<p><em>1</em><em>2</em></p>", dojo.body());
			doh.is(2, n.childNodes.length);
			dojo.place("<span>C</span>", n, 99);
			doh.is(3, n.childNodes.length);
			doh.is("span", n.childNodes[2].tagName.toLowerCase());
			doh.is("C", n.childNodes[2].innerHTML);
			dojo.place("<span>A</span>", n, -1);
			doh.is(4, n.childNodes.length);
			doh.is("span", n.childNodes[0].tagName.toLowerCase());
			doh.is("A", n.childNodes[0].innerHTML);
			dojo.place("<span>B</span>", n, 2);
			doh.is(5, n.childNodes.length);
			doh.is("span", n.childNodes[2].tagName.toLowerCase());
			doh.is("B", n.childNodes[2].innerHTML);
			n.innerHTML = '';
		}
	]
);

});