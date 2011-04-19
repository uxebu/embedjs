define(['implementations'], function(implementations){

	return {
		
	    load: function (name, req, load, config) {
		
			console.warn('Feature plugin called:', name);
		
			var fileName,
				featureInfo = implementations[name];
			
			if(Object.prototype.toString.call(featureInfo) == '[object Array]'){
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
