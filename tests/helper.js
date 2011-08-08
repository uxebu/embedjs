var helper = {

	buildFeatureTree: function(implementations){
		var currentFeatureName;
	    var currentFeatureImpl;
	    var currentFeatureImplName;
	    var featureTree = {};
	    
	    for(var featureName in implementations){
		    var impl = implementations[featureName];
		    var parts = featureName.split(':');
		    if(parts[0] != currentFeatureName){
		    	currentFeatureName = parts[0];
				featureTree[currentFeatureName] = [];
			}
			if(parts[1]){ // specific impl
				currentFeatureImpl = { name: parts[1] , file: impl, req: featureName};
			}else{
				if(typeof impl == 'string'){
					currentFeatureImpl = { name: 'generic', file: impl, req: featureName };
				}else{
					currentFeatureImpl = { name: 'autodetect', file: impl, req: featureName }
				}
			}
			featureTree[currentFeatureName].push(currentFeatureImpl);
		}
	    
	    return featureTree;
	},
	
	buildHTML: function(featureTree){
		var html = '<table id="featureTable"><thead><tr><td>Feature</td><td>Test</td><td>Implementation</td><td></td></tr></thead><tbody>';
		for(var feature in featureTree){
			var impls = featureTree[feature];
			for(var i = 0, m = impls.length; i < m; i++){
				html += '<tr class="'+(i==0?'featureStart':'')+'"><td>' + ( i == 0 ? feature : '') + '</td><td>' + ( i == 0 ? ( '<input type="checkbox" id="' + feature + '" />' ) : '' ) + '</td><td>' + impls[i].name + '</td><td><input class="' + feature + '" type="radio" id="' + impls[i].req + '" name="' + feature + '"' + /* ( impls.length == 1 ? ' disabled ' : '' ) + */ (i == 0 ? ' checked ' : '') + ' /></td></tr>';
			}
		}
		html += '</tbody></table>';
		
		return html;
	},
	
	renderTable: function(implementations){
		var featureTree = this.buildFeatureTree(implementations);
		var html = this.buildHTML(featureTree);
		document.getElementById('featureTable').innerHTML = html;
	},
	
	prepareTests: function(runAll){
		var features = [];
		var tests = [];
		var inputs = document.getElementsByTagName('input');
		for(var i = 0, m = inputs.length; i < m; i++){
			var input = inputs[i];
			if(input.type == 'checkbox' && ( input.checked || runAll )){
				var f = input.id;
				var radios = document.getElementsByClassName(f);
				for (var n = 0, r = radios.length; n < r; n++){
					if(radios[n].checked){
						features.push('feature!' + radios[n].id);
						var parts = f.split('-');
						tests.push('../tests/tests/' + parts[0] + '/' + (parts[1] || parts[0]));
					}
				}
			}
		}
		
		console.log('Features to test:', features);
		require(features, function(embed){
			console.log('Features loaded:', embed);
			// make embed available
			embed.global.embed = embed;
			embed.global.dojo = embed;
			
			require(tests, function(){
				console.log('Tests loaded.');
				document.body.innerHTML = '';
				
				// Register doc tests here:
			 	for(var i = 0, m = docTestQueue.length; i<m; i++){
			 		// DocTests require dojo, so have to leave them out for now.
			 		//doh.registerDocTests(docTestQueue[i]);
				}
			 	
			 	// kick off.
				require(['../tests/modules']);
			});
		});
	}
};

// Doc Test helpers: 

docTestQueue = [];
addDocTest = function(docTest){
	docTestQueue.push(docTest);
};

// Some global UI helpers:

function toggleClass(nodeId, classString){
	var node = document.getElementById(nodeId),
		className = node.className,
		hasClass = (" " + className + " ").indexOf(" " + classString + " ") >= 0;

	if(hasClass){
		node.className = node.className.replace(classString,"");
	}else{
		node.className += ( " " + classString );
	}
}

function toggleInner(group){
	toggleClass(group, 'showDetails');
}

function showMessages(id){
	toggleClass(id, 'showMessages');
}