require.def("dojo/event", ["dojo"], function(){
dojo.stopEvent = function(/*Event*/ evt){
	// summary:
	//		prevents propagation and clobbers the default action of the
	//		passed event
	// evt: Event
	//		The event object. If omitted, window.event is used on IE.
	evt.preventDefault();
	evt.stopPropagation();
	// NOTE: below, this method is overridden for IE
}
});
