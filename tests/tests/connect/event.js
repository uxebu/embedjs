require(['text!../tests/tests/connect/event.html'], function(html){

	document.body.innerHTML = html;
	
	function simulateClick(node) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		console.log('dispatching event:', evt, node);
		return node.dispatchEvent(evt);
	}
	
	tests.register("connect-event",
		[
		 	function simpleConnect(){
		 		var node = document.getElementById('inner');
		 		embed.connect(node, 'onclick', function(){
		 			console.log('clicked!');
		 		});
		 		simulateClick(node);
		 	}
		]
	);

});
