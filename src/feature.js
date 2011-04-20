define(['implementations'], function(implementations){

	return {
		
	    load: function (name, req, load, config) {
		
			console.log('Feature plugin called:', name);
		
			var fileName,
				featureInfo = implementations[name],
				hasMultipleImpls = Object.prototype.toString.call(featureInfo) == '[object Array]';
			
			if(config.isBuild && hasMultipleImpls){
				// In build context, we want all possible
				// implementations included, but we don't
				// want to actually load them, as this will
				// break the whole process (loading the modules
				// will add 'feature!featureName' to the list
				// of already defined modules, thus leading to
				// a conflict when we try to 'register' another
				// module for the same feature).
				for(var i=0, m=featureInfo.length; i<m; i++){
					fileName = featureInfo[i].file;
			        req([fileName], function (value) {});
				}
				
				// We're done here now.
				return;
			}
			
			if(hasMultipleImpls){
				// We have different implementations available,
				// test for the one to use.
				for(var i=0, m=featureInfo.length; i<m; i++){
					if(featureInfo[i].isAvailable()){
						fileName = featureInfo[i].file;
						break;
					}
				}
			}else{
				fileName = featureInfo;
			}
			
			console.log('Loading:', config.baseUrl + fileName);
			
	        req([fileName], function (value) {
	            load(value);
	        });
	    }
	    
	};
	
});
