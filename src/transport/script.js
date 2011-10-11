define(['embed'], function(embed){

	embed.attachScript = function(params){
		//	summary:
		//		creates a new <script> tag pointing to the specified URL and
		//		adds it to the document.
		//	description:
		//		Attaches the script element to the DOM. Use this method if you
		//		just want to attach a script to the DOM and do not care when or
		//		if it loads.
		//	dojodiff:
		//		In the Dojo Toolkit, this method is available as dojo.io.script.attach()
		var doc = embed.doc;
		var element = doc.createElement("script");
		element.type = "text/javascript";
		element.src = params.url;
		params.id && (element.id = params.id);
		element.charset = "utf-8";
		return doc.getElementsByTagName("head")[0].appendChild(element);
	};

	return embed;
});