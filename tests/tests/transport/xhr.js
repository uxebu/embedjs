
var f1NoValueObj = null;
var f1NoValue2Obj = 'blah';
var f2MultiObj = [ 'thud', 'thonk' ];
var f2TextareaObj = 'textarea_value';
var f2fileParam1Obj = '';
var f4ActionObj = 'Form with input named action';
var f6Checkbox1Obj = 'foo';
var f6Checkbox2Obj = null;
var f6Radio1Obj = null;
var f6Radio2Obj = 'bam';


var f1fo = { 'blah': "blah" };
var f1foStr = "blah=blah";
var f1foJson = '{"blah":"blah"}';

var f2fo = { 
	blah: "blah",
	multi: [
		"thud",
		"thonk"
	],
	textarea: "textarea_value"
};
var f2foStr = "blah=blah&multi=thud&multi=thonk&textarea=textarea_value";
var f2foJson = '{"blah":"blah","multi":["thud","thonk"],"textarea":"textarea_value"}';

var f3fo = { 
	spaces: "string with spaces"
};
var f3foStr = "spaces=string%20with%20spaces&";
var f3foJson = '{"spaces":"string with spaces"}';

//var f5fo = { 'blåh': "bláh" };
var f5fo = { 'bl\u00E5h': 'bl\u00E1h' };
var f5foStr = "bl%C3%A5h=bl%C3%A1h";
var f5foJson = '{"blåh":"bláh"}';

var f6fo = {
	cb_group: "foo",
	radio_group: "bam"
};

var f6fo1 = {
	cb_group: "boo",
	radio_group: "baz"
};

var f6fo2 = {
	cb_group: ["foo","boo"],
	radio_group: "baz"
};

var topics = [
	"/dojo/io/start",
	"/dojo/io/send",
	"/dojo/io/load",
	"/dojo/io/error",
	"/dojo/io/done",
	"/dojo/io/stop"
];

var topicCount = {
};

	
tests.register("transport-xhr",
	[
		
		function _start(t){
			//doh.showBox('html_xhr-test');

			dojo.config.ioPublish = true;
			dojo.forEach(topics, function(topic){
				try{
					topicCount[topic] = 0;
					dojo.subscribe(topic, function(){
						topicCount[topic] += 1;
						//console.log("##"+ topic + ": " + topicCount[topic]);
					});
				}catch(e){
					
				}
			});
		},
		
		/* No fieldToObject in API
		function inputNodeValueFromId(t){
			t.is(f1NoValueObj, dojo.fieldToObject('f1_no_value'));
			t.is(f1NoValue2Obj, dojo.fieldToObject('f1_no_value2'));
			t.is(f2MultiObj, dojo.fieldToObject('f2_multi'));
			t.is(f2TextareaObj, dojo.fieldToObject('f2_textarea'));
			t.is(f2fileParam1Obj, dojo.fieldToObject('f2_fileParam1'));
			t.is(f4ActionObj, dojo.fieldToObject('f4_action'));
			t.is(f6Checkbox1Obj, dojo.fieldToObject('f6_checkbox1'));
			t.is(f6Checkbox2Obj, dojo.fieldToObject('f6_checkbox2'));
			t.is(f6Radio1Obj, dojo.fieldToObject('f6_radio1'));
			t.is(f6Radio2Obj, dojo.fieldToObject('f6_radio2'));
			t.is(null, dojo.fieldToObject('some_id_that_doesnt_exist'));
		},
		
		function formNodeValueFromNode(t){
			t.is(f1NoValueObj, dojo.fieldToObject(dojo.byId('f1_no_value')));
			t.is(f1NoValue2Obj, dojo.fieldToObject(dojo.byId('f1_no_value2')));
			t.is(f2MultiObj, dojo.fieldToObject(dojo.byId('f2_multi')));
			t.is(f2TextareaObj, dojo.fieldToObject(dojo.byId('f2_textarea')));
			t.is(f2fileParam1Obj, dojo.fieldToObject(dojo.byId('f2_fileParam1')));
			t.is(f4ActionObj, dojo.fieldToObject(dojo.byId('f4_action')));
			t.is(f6Checkbox1Obj, dojo.fieldToObject(dojo.byId('f6_checkbox1')));
			t.is(f6Checkbox2Obj, dojo.fieldToObject(dojo.byId('f6_checkbox2')));
			t.is(f6Radio1Obj, dojo.fieldToObject(dojo.byId('f6_radio1')));
			t.is(f6Radio2Obj, dojo.fieldToObject(dojo.byId('f6_radio2')));
			t.is(null, dojo.fieldToObject(dojo.byId('some_id_that_doesnt_exist')));
		},
		*/
		/* No formToObject in API
		function formNodeToObject(t){
			t.is(f1fo , dojo.formToObject(dojo.byId("f1")));
			t.is(f5fo , dojo.formToObject(dojo.byId("f5")));
		},
		function formIdToObject(t){
			t.is(f1fo , dojo.formToObject("f1"));
			t.is(f5fo , dojo.formToObject("f5"));
		},
		function formToObjectRadioGroup(t){
			t.is(f6fo , dojo.formToObject("f6"));
			
			dojo.byId('f6_checkbox1').checked = false;
			dojo.byId('f6_checkbox2').checked = true;
			dojo.byId('f6_radio1').checked = true;
			t.is(f6fo1 , dojo.formToObject("f6"));

			dojo.byId('f6_checkbox1').checked = true;
			t.is(f6fo2 , dojo.formToObject("f6"));

			dojo.byId('f6_checkbox2').checked = false; // reset back to defaults
			dojo.byId('f6_radio2').checked = true;
		},
		function formToObjectWithMultiSelect(t){
			t.is(f2fo , dojo.formToObject("f2"));
		},
		*/
		
		/* not in API, see above
		function formToQuery(t){
			t.is(f1foStr, dojo.formToQuery("f1"));
			t.is(f5foStr, dojo.formToQuery("f5"));
		},
		function formToQueryArr(t){
			t.is(f2foStr, dojo.formToQuery("f2"));
		},
		function formToJson(t){
			t.is(f1foJson, dojo.formToJson("f1"));
			t.is(f5foJson, dojo.formToJson("f5"));
		},
		function formToJsonArr(t){
			t.is(f2foJson, dojo.formToJson("f2"));
		},
		function queryToObject(t){
			t.is(f1fo , dojo.queryToObject(f1foStr));
			t.is(f2fo , dojo.queryToObject(f2foStr));
			t.is(f3fo , dojo.queryToObject(f3foStr));
			t.is(f5fo , dojo.queryToObject(f5foStr));
		},
		*/
		function textContentHandler(t){
			t.is("foo bar baz ", 
				dojo._contentHandlers.text({
					responseText: "foo bar baz "
				})
			);
		},
		function jsonContentHandler(t){
			var jsonObj = {
				foo: "bar",
				baz: [
					{ thonk: "blarg" },
					"xyzzy!"
				]
			};
			t.is(jsonObj, 
				dojo._contentHandlers.json({
					responseText: dojo.toJson(jsonObj)
				})
			);
		},
		/* No comment-filtered in content handlers
		*/
		/* No JS in content handlers
		function jsContentHandler(t){
			var jsonObj = {
				foo: "bar",
				baz: [
					{ thonk: "blarg" },
					"xyzzy!"
				]
			};
			t.is(jsonObj,
				dojo._contentHandlers["javascript"]({
					responseText: "("+dojo.toJson(jsonObj)+")"
				})
			);
			t.t(dojo._contentHandlers["javascript"]({
					responseText: "true;"
				})
			);
			t.f(dojo._contentHandlers["javascript"]({
					responseText: "false;"
				})
			);
		},
		*/
		/* No XML in content-handlers
		function xmlContentHandler(t){
			var fauxXhr = { responseText: "<foo><bar baz='thonk'>blarg</bar></foo>" };
			if("DOMParser" in dojo.global){
				var parser = new DOMParser();
				fauxXhr.responseXML = parser.parseFromString(fauxXhr.responseText, "text/xml");
			}
			var xmlDoc = dojo._contentHandlers["xml"](fauxXhr);
			t.is("foo", xmlDoc.documentElement.tagName);
		},
		*/
		function xhrGet(t){
			var d = new doh.Deferred();
			var td = dojo.xhrGet({
				url: "tests/transport/xhr.html", // self
				preventCache: true,
				load: function(text, ioArgs){
					t.is(4, ioArgs.xhr.readyState);
					return text; //must return a value here or the parent test deferred fails.
				}
			});
			t.t(td instanceof dojo.Deferred);
			td.addCallback(d, "callback");
			return d;
		},
		function xhrGet404(t){
			var d = new doh.Deferred();
			try{
				var td = dojo.xhrGet({
					url: "xhr_blarg.html", // doesn't exist
					error: function(err, ioArgs){
						t.is(404, ioArgs.xhr.status);
						return err; //must return a value here or the parent test deferred fails.
					}
				});
				// td.addErrback(d, "callback");
			}catch(e){
				d.callback(true);
			}
			// return d;
		},
		function xhrGetContent(t){
			var d = new doh.Deferred();
			var td = dojo.xhrGet({
				url: "tests/transport/xhr.html?color=blue",
				content: {
					foo: [ "bar", "baz" ],
					thud: "thonk",
					xyzzy: 3
				}
			});
			td.addCallback(function(text){
				// console.debug(td, td.xhr, td.args);
				t.is("tests/transport/xhr.html?color=blue&foo=bar&foo=baz&thud=thonk&xyzzy=3", 
						td.ioArgs.url);
				d.callback(true);
			});
			return d;
		},
		/* No form in API
		function xhrGetForm(t){
			var d = new doh.Deferred();
			var td = dojo.xhrGet({
				url: "tests/html/xhr.html", // self
				form: "f3"
			});
			td.addCallback(function(xhr){
				// console.debug(td.args.url);
				t.is("_base/html/xhr.html?spaces=string%20with%20spaces", td.ioArgs.url);
				d.callback(true);
			});
			return d;
		},
		function xhrGetFormWithContent(t){
			// ensure that stuff passed via content over-rides
			// what's specified in the form
			var d = new doh.Deferred();
			var td = dojo.xhrGet({
				url: "xhr.html", // self
				form: "f3",
				content: { spaces: "blah" }
			});
			td.addCallback(function(xhr){
				// console.debug(td.args.url);
				t.is("xhr.html?spaces=blah", td.ioArgs.url);
				d.callback(true);
			});
			return d;
		},
		*/
		function xhrPost(t){
			var d = new doh.Deferred();
			var td = dojo.xhrPost({
				url: "tests/transport/xhr.html?foo=bar", // self
				content: { color: "blue"},
				handle: function(res, ioArgs){
					if((dojo._isDocumentOk(ioArgs.xhr))||
						(ioArgs.xhr.status == 405)
					){
						d.callback(true);
					}else{
						d.errback(false);
					}								
				}
			});
			// t.t(td instanceof dojo.Deferred);
			return d;
		},
		function xhrPostWithContent(t){
			var d = new doh.Deferred();
			var td = dojo.xhrPost({
				url: "tests/transport/xhr.html",
				content: {
					foo: [ "bar", "baz" ],
					thud: "thonk",
					xyzzy: 3
				}
			});
			td.addBoth(function(text){
				t.is("foo=bar&foo=baz&thud=thonk&xyzzy=3", 
						td.ioArgs.query);
				if(	(dojo._isDocumentOk(td.ioArgs.xhr))||
					(td.ioArgs.xhr.status == 405)
				){
					d.callback(true);
				}else{
					d.errback(false);
				}
			});
			return d;
		},
		/* No form in API
		function xhrPostForm(t){
			var d = new doh.Deferred();
			var form = dojo.byId("f4");

			//Make sure we can send a form to its 
			//action URL.   See trac: #2844.
			var td = dojo.xhrPost({
				form: form
			});
			td.addCallback(function(){
				d.callback(true);
			});
			td.addErrback(function(error){
				d.callback(error);
			});
			// t.t(td instanceof dojo.Deferred);
			return d;
		},
		*/
		function rawXhrPost(t){
			var d = new doh.Deferred();
			var td = dojo.rawXhrPost({
				url: "tests/transport/xhr.html", // self
				postData: "foo=bar&color=blue&height=average",
				handle: function(res, ioArgs){
					if((dojo._isDocumentOk(ioArgs.xhr))||
						(ioArgs.xhr.status == 405)
					){
						d.callback(true);
					}else{
						d.errback(false);
					}								
				}
			});
			// t.t(td instanceof dojo.Deferred);
			return d;
		},
		function xhrPut(t){
			var d = new doh.Deferred();
			var td = dojo.xhrPut({
				url: "tests/transport/xhr.html?foo=bar", // self
				content: { color: "blue"},
				handle: function(res, ioArgs){
					if((dojo._isDocumentOk(ioArgs.xhr))||
						(ioArgs.xhr.status == 403) || (ioArgs.xhr.status == 405)
					){
						d.callback(true);
					}else{
						d.errback(false);
					}								
				}
			});
			// t.t(td instanceof dojo.Deferred);
			return d;
		},
		function xhrDelete(t){
			var d = new doh.Deferred();
			var td = dojo.xhrDelete({
				url: "tests/transport/xhr.html", // self
				preventCache: true,
				handle: function(res, ioArgs){
					if((dojo._isDocumentOk(ioArgs.xhr))||
						(ioArgs.xhr.status == 403) || (ioArgs.xhr.status == 405)
					){
						d.callback(true);
					}else{
						d.errback(false);
					}								
				}
			});
			// t.t(td instanceof dojo.Deferred);
			return d;
		},
		function xhrCancel(t){
			var d = new doh.Deferred();
			var td = dojo.xhrPost({
				url: "tests/transport/xhr.html", // self
				handle: function(res, ioArgs){
					if(res instanceof Error && res.dojoType == "cancel"){
						d.callback(true);
					}else{
						d.errback(false);
					}								
				}
			});
			td.cancel();
			// t.t(td instanceof dojo.Deferred);
			return d;
		},
		
		/* No ioPublish in API
		function ioPublish(t){
		
			//These numbers will look a bit odd at this point, since
			//some of the topics publish after this test is run.
			
			// We have three less transports
			t.is(1, topicCount["/dojo/io/start"]);
			t.is(9, topicCount["/dojo/io/send"]);
			t.is(6, topicCount["/dojo/io/load"]);
			t.is(2, topicCount["/dojo/io/error"]);
			t.is(8, topicCount["/dojo/io/done"]);
			t.is(0, topicCount["/dojo/io/stop"]);

			
//			dojo.forEach(topics, function(topic){
//				console.log(topic + ": " + topicCount[topic]);
//			});
			
		}
		*/
	]
);
