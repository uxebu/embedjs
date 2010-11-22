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
					
					// comment filtering :(
					var lines = req.responseText.split("\n");
					var lines = lines.map(function(line){
						line =  line.replace(/\/\/.*/, "");
						return line.replace(/\/\*.*\*\//, "");
					});
					ret = JSON.parse(lines.join(""));
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
		
		// first, get the build config file
		this.buildConfig = this._loadJsonFile(params.pathToBuildConfig + 'build-config.json');
		this.buildConfig.paths.relativeRoot = params.pathToBuildConfig;
		
		// get profile and feature list
		var profile = params.profile || this.buildConfig.defaults.profile;
		if(!this.buildConfig.profiles[profile]){
			console.error("Given profile " + profile + " is not specified in build-config.json.");
			return;
		}
		this.profileName = profile;
		this.profile = this.buildConfig.profiles[profile];
		
		// get the platform and implementation details
		this.platform = params.platform || this.buildConfig.defaults.platform;
		var pathToPlatforms = params.pathToBuildConfig + this.buildConfig.paths.platforms + '/';
		var _baseModules = loader._loadJsonFile(pathToPlatforms + '_base.json');
		var _specificModules = loader._loadJsonFile(pathToPlatforms + this.platform + '.json');
		for(var prop in _specificModules){
			_baseModules[prop] = _specificModules[prop];
		}
		this.implementations = _baseModules;
		
		console.log('Loading files for profile ' + this.profileName + ' at platform ' + this.platform);

		// go...
		var modules = loader.globals.modules = this.implementations;
		var features = this.profile;
		var files = [];
		if (features.length==0){
			for (var m in modules){
				console.info("Adding feature:     ", m);
				var moduleFiles = modules[m].map(resolveDeps)
				console.log(moduleFiles.length ? ("+++ " + moduleFiles.join(" ")) : "");
				files = files.concat(moduleFiles);
				loader.globals.modulesAdded[m] = true;
			}
		} else {
			for (var i=0, l=features.length, f; i<l; i++){
				var f = features[i];
				if (typeof modules[f]=="undefined"){
					console.error("ERROR: Feature '" + f + "' not defined in '" + this.platform + "'. ");
					console.error("Make sure (or create) the feature exists or you may have a typo in the feature name.");
					console.error("Giving up :(\n\n");
					quit();
				}
				console.log("Adding feature:     ", f);
				var moduleFiles = [];
				modules[f].map(loader.resolveDeps).map(function(arr){ moduleFiles = moduleFiles.concat(arr); });
				console.log(moduleFiles.length ? ("+++ " + moduleFiles.join(" ")) : "");
				files = files.concat(moduleFiles);
				console.log("Done with feature", f);
				console.log(files);
				console.log('-----------------------------------------------');
			}
		}
		console.log("\nCleaning up file list, removing doubles, etc.");
		// Remove doubles but never the first occurence, since this would break the file order dependencies.
		var files = files.map(function(item, index){return (files.slice(0, index).indexOf(""+item)!=-1) ? null : item; })
						.filter(function(item){ return item==null ? false : true });
console.log(files);
files.forEach(function(fileName){
	setTimeout(function(){
		var s = '<script type="text/javascript" src="' + loader.buildConfig.paths.relativeRoot + loader.buildConfig.paths.source + '/' + fileName + '"></scr'+''+'ipt>';
		document.write(s);
	}, 10);
});
//		var begin = '<script type="text/javascript" src="' + this.buildConfig.paths.relativeRoot + this.buildConfig.paths.source + '/';
//		var ending = '"></scr'+''+'ipt>';
//		document.write(begin + files.join(ending+"\n"+begin) + ending);

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
			var deps = loader._loadJsonFile(loader.buildConfig.paths.relativeRoot + loader.buildConfig.paths.source + '/' + (path.length?path.join("/"):"") + "/dependencies.json", false);
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