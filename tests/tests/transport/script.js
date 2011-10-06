tests.register("transport-script",
	[	
		function attachScript(t){
			var found = false,
				id = '_dohTestAttachScript',
				src = 'tests/transport/timeout.js';
			
			var script = embed.attachScript({
				id: id,
				url: src
			});
			
			var scripts = document.getElementsByTagName('script');
			for(var i=0, m=scripts.length; i<m; i++){
				var node = scripts[i];
				console.log(node, node.id == id, node.src == src);
				if(node.id == id){
					// src correct?
					t.assertTrue(node.src.indexOf(src) + src.length == node.src.length);
					// should be the exact same node as returned
					t.assertEqual(script, node);
					found = true;
					break;
				}
			}
			
			// should be found…
			t.assertTrue(found);
		}
	]
);