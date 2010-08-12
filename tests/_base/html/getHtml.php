<?php
die(
	"doh.fileLoaded('".$_GET['id']."',".
	json_encode(array(
		"html" => file_get_contents($_GET['file'].".html")
	)).
	");"
);