if (typeof console=="undefined"){
	console = {
		log:function(){
			if (!debug) return;
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
var debug = !!arguments[2];


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
			console.log("Adding feature:     ", m);
			var moduleFiles = modules[m].map(resolveDeps)
			console.log(moduleFiles.length ? ("+++ " + moduleFiles.join(" ")) : "");
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
			console.log("Adding feature:     ", features[i]);
			var moduleFiles = [];
			modules[features[i]].map(resolveDeps).map(function(arr){ moduleFiles = moduleFiles.concat(arr) });
			console.log(moduleFiles.length ? ("+++ " + moduleFiles.join(" ")) : "");
			files = files.concat(moduleFiles);
		}
	}
	console.log("\nCleaning up file list, removing doubles, etc.");
	// Remove doubles but never the first occurence, since this would break the file order dependencies.
	var files = files.map(function(item, index){return (files.slice(0, index).indexOf(""+item)!=-1) ? null : item; })
					.filter(function(item){ return item==null ? false : true });
	print(files.join(" "));
};

function resolveFeature(feature){
	var ret = [];
	if (!globals.modulesAdded[feature]){
		console.log('  Resolving feature:', feature);
		var parts = feature.split("-");
		var ns = parts[0]; // The namespace of the feature, like "oo" in "oo" or "oo-declare or "oo-extend".
		var f = parts.length>1 ? parts[1] : null; // The exact feature if given, like for "oo-declare".
		var data = globals.modules;
		if (f===null){
			// If the feature is only "oo" then we use ALL files given inside "oo".
			ret = data[ns];
			for (var i=0, l=ret.length; i<l; i++){
				resolveDeps(ret[i], function(files){
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
		console.log('    Adding files:       ===>', ret);
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
		globals.dependencyData[file] = reduce((deps && typeof deps[f]!="undefined" ? deps[f] : [])
										.map(resolveFeature)) // Resolve the features
										.filter(function(i){return !!i;}); // Return empty elements that map might had returned.
	}
	return [file].concat(globals.dependencyData[file]); // I don't know if we want to KNOW here that we have to concat "file" too.
};

function reduce(arr){
	// flatten the array
	var ret = [];
	arr.map(function(i){ ret = ret.concat(i) });
	return ret;
}

main();