// A very early implementation of a loader
var loader = {
	// We store some global information here, so we dont need to pass them around.
	globals: {
		modules:{},
		dependencyData:{}, // Indexed by the directory where the __deps__.js file was loaded from, so we dont load them multiple times.
		modulesAdded:{}
	},
	handleParams: function(args){
		function showHelpText(){
			print(loader.params._help.join("\n"));
			quit();
		};
		if (args.length<2){
			loader.showHelpText();
		} else {
			loader.prepareParams();
		}
	},
	endInSlash: function(path){
		return path.substr(-1)!="/" ? path+"/" : path;
	},
	_loadJsonFile: function(fileName, throwError){
		var ret = null;
		try{
			var req = new XMLHttpRequest();
			req.open("GET", fileName, false);
			req.send("");

			if (req.readyState == 4){
				if (req.status == 200){
					ret = JSON.parse(req.responseText);
				}else{
					console.log("There was a problem retrieving the dependency data:\n" +
						req.statusText);
				}
			}
		}catch(e){
			if (typeof throwError=="undefined" || throwError!=false){
				console.error("ERROR: reading file '" + fileName + "' at line "+ e.lineNumber);
				for (var key in e){ if (typeof e[key]!="function") console.error(key, ((""+e[key]).length>100 ? e[key].substr(0, 100)+"..." : e[key])) }
			}
		}
		return ret;
	},
	_loadTextFile: function(fileName, throwError){
		var ret = null;
		try{
			var req = new XMLHttpRequest();
			req.open("GET", fileName, false);
			req.send("");

			if (req.readyState == 4){
				if (req.status == 200){
					ret = req.responseText;
				}else{
					console.log("There was a problem retrieving the dependency data:\n" +
						req.statusText);
				}
			}
		}catch(e){
			if (typeof throwError=="undefined" || throwError!=false){
				console.error("ERROR: reading file '" + fileName);
				for (var key in e){ if (typeof e[key]!="function") console.error(key, ((""+e[key]).length>100 ? e[key].substr(0, 100)+"..." : e[key])) }
			}
		}
		return ret;
	},
	load: function(params){
		// summary:
		// 		Load the platform JSON file (like Android.json) which contains all the features mapped to the exact js files.
		// description:
		// 		If features are given resolve teh dependencies and concat the files resulting form that.

		loader.params = params;

		// Split the modules that shall only be included, e.g. oo,array => ["oo", "array"]
		var features = loader._loadTextFile(loader.params.featuresFileName);
		features = features ? features.split(",") : [];

		var modules = loader._loadJsonFile(loader.params.platformName);
		loader.globals.modules = modules;
		var files = [];
		if (features.length==0){
			for (var m in modules){
				console.log("Adding feature:     ", m);
				var moduleFiles = modules[m].map(resolveDeps)
				console.log(moduleFiles.length ? ("+++ " + moduleFiles.join(" ")) : "");
				files = files.concat(moduleFiles);
				loader.globals.modulesAdded[m] = true;
			}
		} else {
			for (var i=0, l=features.length, f; i<l; i++){
				var f = features[i];
				if (typeof modules[f]=="undefined"){
					console.error("ERROR: Feature '" + f + "' not defined in '" + params.platformName + "'. ");
					console.error("Make sure (or create) the feature exists or you may have a typo in the feature name.");
					console.error("Giving up :(\n\n");
					quit();
				}
				console.log("Adding feature:     ", f);
				var moduleFiles = [];
				modules[f].map(loader.resolveDeps).map(function(arr){ moduleFiles = moduleFiles.concat(arr); });
				console.log(moduleFiles.length ? ("+++ " + moduleFiles.join(" ")) : "");
				files = files.concat(moduleFiles);
			}
		}
		console.log("\nCleaning up file list, removing doubles, etc.");
		// Remove doubles but never the first occurence, since this would break the file order dependencies.
		var files = files.map(function(item, index){return (files.slice(0, index).indexOf(""+item)!=-1) ? null : item; })
						.filter(function(item){ return item==null ? false : true });

		var begin = '<script type="text/javascript" src="' + loader.params.relativePath;
		var ending = '"></scr'+''+'ipt>';
		document.write(begin + files.join(ending+"\n"+begin) + ending);

	},
	resolveFeature: function(feature){
		var ret = [];
		if (!loader.globals.modulesAdded[feature]){
			console.log('  Resolving feature:', feature);
			var parts = feature.split("-");
			var ns = parts[0]; // The namespace of the feature, like "oo" in "oo" or "oo-declare or "oo-extend".
			var f = parts.length>1 ? parts[1] : null; // The exact feature if given, like for "oo-declare".
			var data = loader.globals.modules;
			if (f===null){
				// If the feature is only "oo" then we use ALL files given inside "oo".
				ret = data[ns];
				for (var i=0, l=ret.length; i<l; i++){
					ret = loader.resolveDeps(ret[i]);
				}
			} else {
				// A features like "oo-declare" means we only want the features inside "oo"
				// where the file is "*declare.*", if given of course.
				for (var j=0, l=data[ns].length, file; j<l; j++){
					file = data[ns][j];
					if (file.indexOf(f)!=-1){
						ret = loader.resolveDeps(file);
					}
				}
			}
			console.log('    Adding files:       ===>', ret);
		} else {
			console.log("  Depends on '" + feature + "', already resolved before.");
		}
		return ret;
	},
	resolveDeps: function(file){
		// summary:
		// 		Resolve the dependencies of file (e.g. array/_default.js).
		// description:
		// 		If a dependencies.json file exists in the path where the js file is in, e.g. "array",
		// 		then we load all according files again (which are namely features, which need to be
		// 		mapped to files again, resolveFeature() does that).
		if (typeof loader.globals.dependencyData[file]=="undefined"){
			var path = file.split("/");
			var f = path.pop(); // The filename e.g. "declare.js"
			console.log("loading json");
			var deps = loader._loadJsonFile(loader.params.sourceDirectory + (path.length?path.join("/"):"") + "/dependencies.json", false);
			//globals.dependencyData[file] = (typeof deps[f]!="undefined" ? deps[f] : []).map(resolveFeature);
			loader.globals.dependencyData[file] = loader.reduce((deps && typeof deps[f]!="undefined" ? deps[f] : [])
											.map(loader.resolveFeature)) // Resolve the features
											.filter(function(i){return !!i;}); // Return empty elements that map might had returned.
		}
		return loader.globals.dependencyData[file].concat([file]); // I don't know if we want to KNOW here that we have to concat "file" too.
	},
	reduce: function(arr){
		// flatten the array
		var ret = [];
		arr.map(function(i){ ret = ret.concat(i) });
		return ret;
	}
}