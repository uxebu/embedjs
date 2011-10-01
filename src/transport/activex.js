define(['embed', 'feature!transport-xhr'], function(embed){

	embed._XMLHTTP_PROGIDS = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];

	embed._xhrObj = function(){
		// summary:
		//		does the work of portably generating a new XMLHTTPRequest object.
		var http, last_e;
			for(var i=0; i<3; ++i){
				var progid = d._XMLHTTP_PROGIDS[i];
				try{
					http = new ActiveXObject(progid);
				}catch(e){
					last_e = e;
				}

				if(http){
					d._XMLHTTP_PROGIDS = [progid];  // so faster next time
					break;
				}
			}

		if(!http){
			throw new Error("XMLHTTP not available: "+last_e);
		}

		return http; // XMLHTTPRequest instance
	}

	return embed;

});
