
// topic publish/subscribe

dojo._topics = {};

dojo.subscribe = function(/*String*/ topic, /*Object|null*/ context, /*String|Function*/ method){
	//	summary:
	//		Attach a listener to a named topic. The listener function is invoked whenever the
	//		named topic is published (see: dojo.publish).
	//		Returns a handle which is needed to unsubscribe this listener.
	//	context:
	//		Scope in which method will be invoked, or null for default scope.
	//	method:
	//		The name of a function in context, or a function reference. This is the function that
	//		is invoked when topic is published.
	//	example:
	//	|	dojo.subscribe("alerts", null, function(caption, message){ alert(caption + "\n" + message); });
	//	|	dojo.publish("alerts", [ "read this", "hello world" ]);																	

	// support for 2 argument invocation (omitting context) depends on hitch
	return [topic, dojo._listener.add(dojo._topics, topic, dojo.hitch(context, method))]; /*Handle*/
}

dojo.unsubscribe = function(/*Handle*/ handle){
	//	summary:
	//	 	Remove a topic listener. 
	//	handle:
	//	 	The handle returned from a call to subscribe.
	//	example:
	//	|	var alerter = dojo.subscribe("alerts", null, function(caption, message){ alert(caption + "\n" + message); };
	//	|	...
	//	|	dojo.unsubscribe(alerter);
	if(handle){
		dojo._listener.remove(dojo._topics, handle[0], handle[1]);
	}
}

dojo.publish = function(/*String*/ topic, /*Array*/ args){
	//	summary:
	//	 	Invoke all listener method subscribed to topic.
	//	topic:
	//	 	The name of the topic to publish.
	//	args:
	//	 	An array of arguments. The arguments will be applied 
	//	 	to each topic subscriber (as first class parameters, via apply).
	//	example:
	//	|	dojo.subscribe("alerts", null, function(caption, message){ alert(caption + "\n" + message); };
	//	|	dojo.publish("alerts", [ "read this", "hello world" ]);	

	// Note that args is an array, which is more efficient vs variable length
	// argument list.  Ideally, var args would be implemented via Array
	// throughout the APIs.
	var f = dojo._topics[topic];
	if(f){
		f.apply(this, args||[]);
	}
}

dojo.connectPublisher = function(	/*String*/ topic, 
									/*Object|null*/ obj, 
									/*String*/ event){
	//	summary:
	//	 	Ensure that every time obj.event() is called, a message is published
	//	 	on the topic. Returns a handle which can be passed to
	//	 	dojo.disconnect() to disable subsequent automatic publication on
	//	 	the topic.
	//	topic:
	//	 	The name of the topic to publish.
	//	obj: 
	//	 	The source object for the event function. Defaults to dojo.global
	//	 	if null.
	//	event:
	//	 	The name of the event function in obj. 
	//	 	I.e. identifies a property obj[event].
	//	example:
	//	|	dojo.connectPublisher("/ajax/start", dojo, "xhrGet");
	var pf = function(){ dojo.publish(topic, arguments); }
	return event ? dojo.connect(obj, event, pf) : dojo.connect(obj, pf); //Handle
};
