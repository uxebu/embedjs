<?php
/**
 * This is a helper file to create the JS files containing the fileLoaded calls.
 * 
 * Example:
 * 
 * getHtml.php?id=html_xhr-test&file=tests/xhr.html
 * 
 * The id needs to be the one that is asked for at the beginning of the test group, e.g.:
 * 
 * doh.showBox('html_xhr-test');
 * 
 * 
 */ 
die(
	"doh.fileLoaded('".$_GET['id']."',".
	json_encode(array(
		"html" => file_get_contents($_GET['file'].".html")
	)).
	");"
);