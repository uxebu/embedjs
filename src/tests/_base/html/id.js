tests.register("tests._base.html.id", 
	[
		function byId(t){
			
			doh.showBox('html_id-test');
			
			doh.f(dojo.byId(null));
			doh.f(dojo.byId(undefined));

			doh.f(dojo.byId("baz"));
			doh.f(dojo.byId("foobar"));
			doh.f(dojo.byId("dude"));
			doh.f(dojo.byId("cattle"));
			doh.f(dojo.byId("cattle2"));

			doh.f(dojo.byId("lamps"));
			doh.f(dojo.byId("blue"));
			doh.t(dojo.byId("chairs"));
			
			doh.t(dojo.byId("ranch"));
			doh.t(dojo.byId("cattle3"));
			doh.is("span", dojo.byId("fish").nodeName.toLowerCase());
			
			var startNode = dojo.byId("start");
			var clonedNode = dojo.clone(startNode);
			clonedNode.id= "clonedStart";
			clonedNode.innerHTML= "This is a cloned div";
			dojo.body().appendChild(clonedNode);

			doh.is("This is a cloned div", dojo.byId("clonedStart").innerHTML);
		}
	]
);
