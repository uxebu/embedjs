define(function(){
	
	var embed = {};
	embed.config = {};
	embed.global = this;
	embed.doc = this.document || null;
	embed.body = function() {
		// summary:
		//		Returns a reference to the body element.
		// description:
		//		Returns the body element of the document that
		//		EmbedJS is loaded into. If called in a non-browser
		//		environment, it returns undefined.
		// returns:
		//		body element if available, or undefined if not.
		// feature:
		//		embed
		var ebd = embed;
		return ebd.doc && ebd.doc.body;
	};
	embed.version = "0.2.1";
	
	return embed;
});
