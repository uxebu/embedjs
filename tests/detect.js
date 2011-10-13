define(['implementations'], function(impls){
	var map = {},
		isArray = function(it){ return {}.toString.call(it) == '[object Array]'; };

	for(var name in impls){
		var featureInfo = impls[name],
			mapItem = map[name] = {};
		
		if(isArray(featureInfo)){
			for(var i=0, m=featureInfo.length; i<m; i++){
				if(featureInfo[i].isAvailable()){
					mapItem.implementedBy = featureInfo[i].implementation;
					mapItem.testSource = featureInfo[i].isAvailable.toString();
					break;
				}
			}
		}else{
			mapItem.implementedBy = featureInfo;
		}
	}
	
	return map;
});