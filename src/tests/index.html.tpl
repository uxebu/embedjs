<!DOCTYPE html>
<html>
	<head>
		<title>EmbedJS Test Runner</title>
		<style type="text/css">
			body,html{
				background-color:white;
				color:black;
			}
		</style>
	</head>
	<body>
	    <script type="text/javascript">
	    	function runTests(platform){
				if (window["widget"]){
					window.location.href = "runTests-widget" + platform + ".html";
				} else {
					window.location = "runTests-" + platform + ".html";
				}
		    }
	    </script>
	    
		<table border="1">
			<tr>
				<th>Platform</th>
				<th>Execute</th>
			</tr>
			{loop}
			<tr>
				<td>${platform}</td>
				<td><button onclick="runTests('${platform}');">run tests</button></td>
			</tr>
			{endloop}
		</table>
	</body>
</html>

