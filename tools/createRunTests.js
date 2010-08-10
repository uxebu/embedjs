
var PLATFORMS_DIR = arguments[0];
var RUN_TESTS_DIR = arguments[1];


function getPlatforms(dir){
	var params = {output:""};
	runCommand("ls", dir, params);
	platforms = params.output.split("\n")
				.map(function(i){ return i.replace(/\.json/, "") }) // Remove the extension .json.
				.filter(function(i){ return !!i }); // Remove empty values.
	return platforms;
}

function renderTpl(content, platform, isWidget){
	var filename = isWidget ? "embedJS/" : "../../build/";
	filename += "embed-kitchensink-" + platform + ".js"
	var ret = content.replace("${embedjs_filename}", filename);
	var ret = ret.replace("${platform}", platform);
	return ret;
}

//
//	Main
//
var platforms = getPlatforms(PLATFORMS_DIR);
var tpl = readFile(RUN_TESTS_DIR+"/runTests.html.tpl");
importPackage(java.io); // So we can use FileWriter.
for (var i=0, l=platforms.length, p; i<l; i++){
	p = platforms[i];
	var destFile = RUN_TESTS_DIR+"/runTests-" + p + ".html";
	print("Writing '" + destFile + "'");
	var f = new FileWriter(destFile);
	f.write(renderTpl(tpl, p));
	f.close();
}