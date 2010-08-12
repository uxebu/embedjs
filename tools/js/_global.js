//
//	Make console.log work when debug is turned on.
//	Implement console.error
//
if (typeof console=="undefined"){
	var console = {
		_log:function(){
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
		},
		log:function(){
			if (!params.debug) return;
			this._log.apply(this, arguments);
		},
		error:function(){
			this._log.apply(this, arguments);
		}
	}
};

function handleParams(args){
	function showHelpText(){
		print(params._help.join("\n"));
		quit();
	};
	if (args.length<2){
		showHelpText();
	} else {
		prepareParams();
	}
};

function endInSlash(path){
	return path.substr(-1)!="/" ? path+"/" : path;
};

function _loadJsonFile(fileName, throwError){
	var ret = null;
	try{
		eval("ret = "+readFile(fileName));
	}catch(e){
		if (typeof throwError=="undefined" || throwError!=false){
			console.error("ERROR: reading file '" + fileName + "' at line "+ e.lineNumber);
			for (var key in e){ if (typeof e[key]!="function") console.error(key, ((""+e[key]).length>100 ? e[key].substr(0, 100)+"..." : e[key])) }
		}
	}
	return ret;
};

function _loadTextFile(fileName, throwError){
	var ret = null;
	try{
		ret = readFile(fileName);
	}catch(e){
		if (typeof throwError=="undefined" || throwError!=false){
			console.error("ERROR: reading file '" + fileName);
			for (var key in e){ if (typeof e[key]!="function") console.error(key, ((""+e[key]).length>100 ? e[key].substr(0, 100)+"..." : e[key])) }
		}
	}
	return ret;
};

