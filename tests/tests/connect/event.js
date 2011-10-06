require(['text!../tests/tests/connect/event.html'], function(html){
	
	function simulateClick(domNode) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		return domNode.dispatchEvent(evt);
	}
	
	tests.register("connect-event",
		[
		 	function _start(t){
		 		document.body.innerHTML = html;
		 	},
		 	
		 	function simpleConnect(t){
				var d = new doh.Deferred();
		 		var node = document.getElementById('inner');
		 		var conn = embed.connect(node, 'onclick', function(){
		 			embed.disconnect(conn);
					d.callback(true);
		 		});
		 		simulateClick(node);

				return d;
		 	},
		 	
		 	function simpleDisconnect(t){
				var d = new doh.Deferred();
		 		var node = document.getElementById('inner');
		 		
		 		var timer = setTimeout(function(){ d.callback(true); }, 500);
		 		
		 		var conn = embed.connect(node, 'onclick', function(e){
		 			clearTimeout(timer);
		 			embed.disconnect(conn);
		 		});
	 			embed.disconnect(conn);
		 		simulateClick(node);

		 		return d;
		 	},
		 	
		 	function stopEvent(t){
		 		var node = document.getElementById('inner');
		 		var conn = embed.connect(node, 'onclick', function(e){
		 			embed.disconnect(conn);
		 			embed.stopEvent(e);
		 		});
		 		var res = simulateClick(node);
		 		t.assertTrue(res === false);
		 	}
		]
	);

});
