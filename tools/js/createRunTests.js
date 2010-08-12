
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

function renderRunTestsTpl(content, platform, isWidget){
	// summary: Render the runTests.html.tpl for the given platform.
	var filename = isWidget ? "embedJS/" : "../../build/";
	filename += "embed-kitchensink-" + platform + ".js"
	var ret = content.replace("${embedjs_filename}", filename);
	var ret = ret.replace("${platform}", platform);
	return ret;
}

function renderIndexTpl(platforms){
	// summary: Take the index.html.tpl apart and render the {loop} part in there for all platforms.
	var tpl = readFile(RUN_TESTS_DIR+"/index.html.tpl");
	// Parse out the ONE loop that is in the index.html.tpl
	var loop = tpl.match(/([.\s\S]*)\{loop\}([.\s\S]*)\{endloop\}([.\s\S]*)/);
	var loopContent = loop[2];
	var ret = "";
	for (var i=0, l=platforms.length, p; i<l; i++){
		p = platforms[i];
		ret += 	loopContent.replace(/\$\{platform\}/g, p);
	}
	return loop[1] + ret + loop[3];
}

function writeFile(fileName, content){
	var f = new FileWriter(fileName);
	f.write(content);
	f.close();
}

//
//	Main
//
var platforms = getPlatforms(PLATFORMS_DIR);
var tpl = readFile(RUN_TESTS_DIR+"/runTests.html.tpl");
importPackage(java.io); // So we can use FileWriter.
for (var i=0, l=platforms.length, p; i<l; i++){
	p = platforms[i];
	// Write the normal file.
	var destFile = RUN_TESTS_DIR+"/runTests-" + p + ".html";
	print("Writing '" + destFile + "'");
	writeFile(destFile, renderRunTestsTpl(tpl, p));
	// Write the test file for the widget env.
	var destFile = RUN_TESTS_DIR+"/runTests-widget-" + p + ".html";
	print("Writing '" + destFile + "'");
	writeFile(destFile, renderRunTestsTpl(tpl, p, true));
}
destFile = RUN_TESTS_DIR+"/index.html";
print("Writing '" + destFile + "'");
writeFile(destFile, renderIndexTpl(platforms));
