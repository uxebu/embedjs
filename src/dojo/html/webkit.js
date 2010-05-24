require.modify("dojo/html", "dojo/html/webkit", ["dojo"], function(){
dojo.getComputedStyle = function(/*DomNode*/node){
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
};
});

