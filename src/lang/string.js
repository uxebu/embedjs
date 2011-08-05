define(['embed', 'feature!lang-object', 'feature!lang-is'], function(embed){
	/*=====
	embed.trim = function(str){
		//	summary:
		//		Trims whitespace from both sides of the string
		//	str: String
		//		String to be trimmed
		//	returns: String
		//		Returns the trimmed string
		//	description:
		//		This version of trim() was selected for inclusion into the base due
		//		to its compact size and relatively good performance
		//		(see [Steven Levithan's blog](http://blog.stevenlevithan.com/archives/faster-trim-javascript)
		//		Uses String.prototype.trim instead, if available.
		//		The fastest but longest version of this function is located at
		//		embed.string.trim()
		return "";	// String
	}
	=====*/
	
	embed.trim = String.prototype.trim ?
		function(str){ return str.trim(); } :
		function(str){ return str.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };
	
	/*=====
	embed.replace = function(tmpl, map, pattern){
		//	summary:
		//		Performs parameterized substitutions on a string. Throws an
		//		exception if any parameter is unmatched. 
		//	tmpl: String
		//		String to be used as a template.
		//	map: Object|Function
		//		If an object, it is used as a dictionary to look up substitutions.
		//		If a function, it is called for every substitution with following
		//		parameters: a whole match, a name, an offset, and the whole template
		//		string (see https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/String/replace
		//		for more details).
		//	pattern: RegEx?
		//		Optional regular expression objects that overrides the default pattern.
		//		Must be global and match one item. The default is: /\{([^\}]+)\}/g,
		//		which matches patterns like that: "{xxx}", where "xxx" is any sequence
		//		of characters, which doesn't include "}".
		//	returns: String
		//		Returns the substituted string.
		//	example:
		//	|	// uses a dictionary for substitutions:
		//	|	embed.replace("Hello, {name.first} {name.last} AKA {nick}!",
		//	|	  {
		//	|	    nick: "Bob",
		//	|	    name: {
		//	|	      first:  "Robert",
		//	|	      middle: "X",
		//	|	      last:   "Cringely"
		//	|	    }
		//	|	  });
		//	|	// returns: Hello, Robert Cringely AKA Bob!
		//	example:
		//	|	// uses an array for substitutions:
		//	|	embed.replace("Hello, {0} {2}!",
		//	|	  ["Robert", "X", "Cringely"]);
		//	|	// returns: Hello, Robert Cringely!
		//	example:
		//	|	// uses a function for substitutions:
		//	|	function sum(a){
		//	|	  var t = 0;
		//	|	  embed.forEach(a, function(x){ t += x; });
		//	|	  return t;
		//	|	}
		//	|	embed.replace(
		//	|	  "{count} payments averaging {avg} USD per payment.",
		//	|	  embed.hitch(
		//	|	    { payments: [11, 16, 12] },
		//	|	    function(_, key){
		//	|	      switch(key){
		//	|	        case "count": return this.payments.length;
		//	|	        case "min":   return Math.min.apply(Math, this.payments);
		//	|	        case "max":   return Math.max.apply(Math, this.payments);
		//	|	        case "sum":   return sum(this.payments);
		//	|	        case "avg":   return sum(this.payments) / this.payments.length;
		//	|	      }
		//	|	    }
		//	|	  )
		//	|	);
		//	|	// prints: 3 payments averaging 13 USD per payment.
		//	example:
		//	|	// uses an alternative PHP-like pattern for substitutions:
		//	|	embed.replace("Hello, ${0} ${2}!",
		//	|	  ["Robert", "X", "Cringely"], /\$\{([^\}]+)\}/g);
		//	|	// returns: Hello, Robert Cringely!
		return "";	// String
	}
	=====*/
	
	var _pattern = /\{([^\}]+)\}/g;
	embed.replace = function(tmpl, map, pattern){
		return tmpl.replace(pattern || _pattern, embed.isFunction(map) ?
			map : function(_, k){ return embed.getObject(k, false, map); });
	};

	return embed;
	
});