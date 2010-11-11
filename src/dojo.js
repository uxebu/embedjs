var embed = dojo = {};
var djConfig = dojo.config = {};

dojo.global = window;
dojo.doc = document;
dojo.body = function() {
	return document.body;
};

(function(d){

	// grab the node we were loaded from
	if(document && document.getElementsByTagName){
		var scripts = document.getElementsByTagName("script");
		var rePkg = /dojo[^\/]*\.js(\W|$)/i;
		for(var i = 0; i < scripts.length; i++){
			var src = scripts[i].getAttribute("src");
			if(!src){ continue; }
			var m = src.match(rePkg);
			if(m){
				// find out where we came from
				if(!d.config.baseUrl){
					d.config.baseUrl = src.substring(0, m.index);
				}
				// and find out if we need to modify our behavior
				var cfg = scripts[i].getAttribute("djConfig");
				if(cfg){
					var cfgo = eval("({ "+cfg+" })");
					for(var x in cfgo){
						dojo.config[x] = cfgo[x];
					}
				}
				break; // "first Dojo wins"
			}
		}
	}
	d.baseUrl = d.config.baseUrl;
}(dojo));
