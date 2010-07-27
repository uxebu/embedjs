require.def("tests/_base/html", [], function(){
	//	This module loads all tests that need
	//	HTML in the test environment to run
	//	properly.
	
	require(["tests/_base/html/id","text!tests/_base/html/id.html"],function(module,html){
		doh.registerTestBox("html_id-test",html);
	});
	require(["tests/_base/html/html","text!tests/_base/html/html.html"],function(module,html){
		doh.registerTestBox("html_html-test",html);
	});
	require(["tests/_base/html/element","text!tests/_base/html/element.html"],function(module,html){
		doh.registerTestBox("html_element-test",html);
	});
	require(["tests/_base/html/query","text!tests/_base/html/query.html"],function(module,html){
		doh.registerTestBox("html_query-test",html);
	});
	require(["tests/_base/html/xhr","text!tests/_base/html/xhr.html"],function(module,html){
		doh.registerTestBox("html_xhr-test",html);
	});

});
