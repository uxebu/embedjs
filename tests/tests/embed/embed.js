tests.register("embed",
	[	
	 	function documentRef(t){
	 		t.is(document, embed.doc);
	 	},
	 	
	 	function globalRef(t){
	 		t.is(window, embed.global);
	 	},
	 	
	 	function body(t){
	 		t.is(document.body, embed.body());
	 	},
	 	
	 	function configObject(t){
	 		t.is('[object Object]', {}.toString.call(embed.config));
	 	},
	 	
	 	function versionString(t){
	 		t.is('[object String]', {}.toString.call(embed.version));
	 	}
	]
);