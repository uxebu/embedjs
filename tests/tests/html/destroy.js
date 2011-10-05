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
	
tests.register("html-destroy",
	[
	 	function _start(t){
	 		document.body.innerHTML = html;
		},
	 	
		function destroySingle(t){
			// destroy node byId
			dojo.destroy("holder1");
			doh.f(dojo.byId("holder1"));
		},
	 	
		function destroyList(t){
			// destroy node byId
			dojo.destroy("holder2");
			doh.f(dojo.byId("holder2"));
			// destroyed because is child of holder
			doh.is(0, byClass("first").length);
		},
		
		function destroyAll(t){
			var c = function(){
				// eg: don't destroy firebug lite in page
				var l = dojo.query("body >");
				return dojo.filter(l, function(n){
					return !dojo.hasClass(n, "firebug");
				})
			}
			var n = dojo.body().getElementsByTagName('*');
			var el;
			while(el = n[0]){
				console.log(el);
				dojo.destroy(el);
				console.log(el);
				console.log('--');
			}

			// check for deepest embeeded id
			doh.f(dojo.byId("ancFoo"));
			doh.is(0, dojo.body().getElementsByTagName('*').length);
		}
	]
);

});