if (typeof console=="undefined"){
	console = {
		log:function(){
			var out = [];
			for (var i=0, l=arguments.length, arg; i<l; i++){
				arg = arguments[i];
				if (arg && typeof arg["length"]!="undefined"){
					out.push(""+arg);
				} else if (typeof arg=="object"){
					for (var key in arg){
						out.push(key+": "+arg[key]+"\n");
					}
				} else {
					out.push(arg);
				}
			}
			print(out.join("    "));
		}
	}
}

var SRC_DIR = "src/";

//
//	Input parameters passed to the script.
//
var target = arguments[0];
// Split the modules that shall only be included, e.g. oo,array => ["oo", "array"]
var features = arguments[1] ? arguments[1].split(",") : [];


//console.log('target = ', target);
//console.log('features = ', features);

// We store some global information here, so we dont need to pass them around.
var globals = {
	modules:{},
	dependencyData:{}, // Indexed by the directory where the __deps__.js file was loaded from, so we dont load them multiple times.
	modulesAdded:{}
};



function _loadJsonFile(fileName, throwError){
	var ret = null;
	try{
		eval("ret = "+readFile(fileName));
	}catch(e){
		if (typeof throwError=="undefined" || throwError!=false){
			console.log("\n\n=== Error reading file '" + fileName + "' at line "+ e.lineNumber +" ===");
			for (var key in e){ console.log(key, e[key]) }
		}
	}
	return ret;
}

function main(){
	// summary:
	// 		Load the platform JSON file (like Android.json) which contains all the features mapped to the exact js files.
	// description:
	// 		If features are given resolve teh dependencies and concat the files resulting form that.
	var modules = _loadJsonFile(target);
	globals.modules = modules;
	var files = [];
	if (features.length==0){
		for (var m in modules){
			var moduleFiles = modules[m].map(resolveDeps)
			console.log("Adding module:", m, moduleFiles.length ? ("- " + moduleFiles.join(", ")) : "");
			files = files.concat(moduleFiles);
			globals.modulesAdded[m] = true;
		}
	} else {
		for (var i=0, l=features.length, f; i<l; i++){
			if (typeof modules[features[i]]=="undefined"){
				console.log("ERROR: Feature '" + features[i] + "' not defined in '" + target + "'. ");
				console.log("Make sure (or create) the feature exists or you may have a typo in the feature name.");
				console.log("Giving up :(");
				quit();
			}
			var moduleFiles = modules[features[i]].map(resolveDeps);
			console.log("Adding module:", features[i], moduleFiles.length ? ("- " + moduleFiles.join(", ")) : "");
			files = files.concat(moduleFiles);
		}
	}
	// Remove doubles but never the first occurence, since this would break the file order dependencies.
	var files = files.map(function(item, index){ return (files.slice(0, index).indexOf(item)!=-1) ? null : item; })
					//.filter(function(item){ return item==null ? false : true });
	print("\n"+files);
};

function resolveFeature(feature){
	var ret = [];
	if (!globals.modulesAdded[feature]){
		console.log('Resolving feature: ', feature);
		var parts = feature.split("-");
		var ns = parts[0]; // The namespace of the feature, like "oo" in "oo" or "oo-declare or "oo-extend".
		var f = parts.length>1 ? parts[1] : null; // The exact feature if given, like for "oo-declare".
		var data = globals.modules;
		if (f===null){
			// If the feature is only "oo" then we use ALL files given inside "oo".
			ret = data[ns];
			for (var k in ret){
				resolveDeps(ret[k], function(files){
					ret = ret.concat(files);
				});
			}
		} else {
			// A features like "oo-declare" means we only want the features inside "oo"
			// where the file is "*declare.*", if given of course.
			for (var j=0, l=data[ns].length, file; j<l; j++){
				file = data[ns][j];
				if (file.indexOf(f)!=-1){
					ret.push(file);
					resolveDeps(file, function(files){
						ret = ret.concat(files);
					});
				}
			}
		}
	} else {
		console.log("  Depends on '" + feature + "', already resolved before.");
	}
	return ret;
}


function resolveDeps(file){
	// summary:
	// 		Resolve the dependencies of file (e.g. array/_default.js).
	// description:
	// 		If a dependencies.json file exists in the path where the js file is in, e.g. "array",
	// 		then we load all according files again (which are namely features, which need to be
	// 		mapped to files again, resolveFeature() does that).
	if (typeof globals.dependencyData[file]=="undefined"){
		var path = file.split("/");
		var f = path.pop(); // The filename e.g. "declare.js"
		var deps = _loadJsonFile(SRC_DIR + path.join("/") + "/dependencies.json", false);
		//globals.dependencyData[file] = (typeof deps[f]!="undefined" ? deps[f] : []).map(resolveFeature);
		globals.dependencyData[file] = (deps && typeof deps[f]!="undefined" ? deps[f] : [])
										.map(resolveFeature) // Resolve the features
										.filter(function(i){return !!i;}); // Return empty elements that map might had returned.
	}
	return [file].concat(globals.dependencyData[file]); // I don't know if we want to KNOW here that we have to concat "file" too.
};

main();
/*
// The arguments to this file shall be the features that this build shall contain.
// E.g. call like this:
//		jsc build.js -- Android oo-declare,oo-mixin,fx
// And the files for "oo" and "fx" will be returned.
var target = arguments[0];
// Split the params and split the sub modules too (like "oo-mixin" => ["oo", "mixin"])
var features = arguments[1] ? arguments[1].split(",") : [];

// We store some global information here, so we dont need to pass them around.
var globals = {
	profileData:null,
	dependencyData:{}, // Indexed by the directory where the __deps__.js file was loaded from, so we dont load them multiple times.
};

function _callback(data){
	globals.profileData = data;
	var allFiles = [];
	if (features.length==0){ // If no features are given, build the kitchensink, means all features included.
		for (var key in data){
			features.push(key);
		}
	}
	for (var i=0, l=features.length, f, ret; i<l; i++){
		allFiles = allFiles.concat(resolveFeature(features[i]));
	}
	// Remove doubles but never the first occurence, since this would break the file order dependencies.
	var allFiles = allFiles.map(function(item, index){ return (allFiles.slice(0, index).indexOf(item)!=-1) ? null : item; })
							.filter(function(item){ return item==null ? false : true });

	print(allFiles.join(" "));
}

function resolveFeature(feature){
	var parts = feature.split("-");
	var ns = parts[0]; // The namespace of the feature, like "oo" in "oo" or "oo-declare or "oo-extend".
	var f = parts.length>1 ? parts[1] : null; // The exact feature if given, like for "oo-declare".
	var ret = [];
	var data = globals.profileData;
	if (f===null){
		// If the feature is only "oo" then we use ALL files given inside "oo".
		ret = data[ns];
		for (var k in ret){
			resolveDeps(ret[k], function(files){
				ret = ret.concat(files);
			});
		}
	} else {
		// A features like "oo-declare" means we only want the features inside "oo"
		// where the file is "*declare.*", if given of course.
		for (var j=0, l=data[ns].length, file; j<l; j++){
			file = data[ns][j];
			if (file.indexOf(f)!=-1){
				ret.push(file);
				resolveDeps(file, function(files){
					ret = ret.concat(files);
				});
			}
		}
	}
	return ret;
}

var _depsDataStack = [];
function resolveDeps(file, onSuccess){
	var parts = file.split("/");
	var dir = parts[0];
	var f = parts[1];
	_depsDataStack.push({directory:dir, file:f, onSuccess:onSuccess});
	if (typeof globals.dependencyData[dir]!="undefined"){
		_depsCallback(globals.dependencyData[dir]);
	} else {
		// Call the onSuccess when done using the files found as parameters.
		try{
			load("../src/" + dir + "/__deps__.js");
		}catch(e){
			// The file may not exist, so skip it.
			//print(e);
		}
	}
}

function _depsCallback(data){
	var depsData = _depsDataStack.pop();
	var dir = depsData.directory;
	var file = depsData.file;
	globals.dependencyData[dir] = data;

	var ret = [];
	if (typeof data[file]!="undefined"){
		// Let's loop through the features required by the deps and resolve them.
		for (var i=0, l=data[file].length, feature; i<l; i++){
			feature = data[file][i];
			ret = ret.concat(resolveFeature(feature));
		}
	}
	depsData.onSuccess(ret);
}



try{
	load(target);
}catch(e){
	print(e);
}
*/

