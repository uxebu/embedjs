var args = Array.prototype.slice.call(arguments);
var params = {
	rootPath:"",
	platformName:"",
	sourceDirectory:"",
	featuresFileName:"",
	_help:[
		"getFiles.js rootPath platformName [sourceDirectory] [featuresFileName] [debug]",
		"    rootPath - The path where to all JavaScript tool files, where this file lies",
		"             (if you know how we can find it out inside the script we can remove this parameter :) please provide a patch).",
		"    platformName - The platform file which defines the files that belong to a certain feature, e.g. '../profiles/android.json'.",
		"    sourceDirectory - The path to the javascript source files, defaults to '../src'.",
		"    featuresFileName - The file listing all the features, defaults to '../profiles/kitchensink.profile'.",
		"    debug - If set debugging messages will be shown, default is false."
	]
};
function prepareParams(){
	params.platformName = args[1];
	params.sourceDirectory = endInSlash(args[2] || params.rootPath + "/../../src");
	params.featuresFileName = args[3] || params.rootPath + "/../../profiles/kitchensink.profile";
	params.debug = !!args[4];
};
params.rootPath = environment["user.dir"] + "/" + args[0];
load(params.rootPath + "/_global.js");
handleParams(args);

load(params.rootPath + "/_getFiles.js");
print(params.sourceDirectory+main().join(" "+params.sourceDirectory));