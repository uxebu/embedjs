define(['embed'], function(embed){
	
	var parser = {
		
		data: [],
		
		keywords: ['summary', 'description', 'example', 'returns', 'FIXME', 'TODO'],
		
		run: function(toParse){
			this.crawl(toParse);
			this.sort();
			return this.data;
		},
		
		crawl: function(obj){
		
			for(var propName in obj){
				
				var item = {};
				
				item.name = propName;
				
				item.isPrivate = propName.substring(0, 1) == '_';
				
				switch(true){
					case embed.isFunction(obj[propName]):
						item.type = propName.substring(0, 1).toLowerCase() == propName.substring(0, 1) ? 'function' : 'constructor';
						item.source = obj[propName].toString();
						this.extractComments(item);
						this.extractParams(item);
						this.parseComments(item);
						break;
					case embed.isObject(obj[propName]):
						item.type = 'object';
						break;
					case embed.isString(obj[propName]):
						item.type = 'string';
						break;
					default:
						item.type = typeof obj[propName];
				}
				
				this.data.push(item);
			}
		},
		
		sort: function(){
			this.data.sort(function(a, b){
				return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
			});
		},
		
		extractComments: function(item){
			var lines = item.source.split('\n');
			var comments = [];
			embed.some(lines, function(line, index){
				if(index == 0){
					// skip first line
					return false;
				}
				line = embed.trim(line);
				if(line.indexOf('//') == 0){
					comments.push(line.substring(2));
					return false;
				}else{
					return true; // end parsing.
				}
			}, this);
			item.comments = comments;
		},
		
		extractParams: function(item){
			var params = [];
			var header = item.source.split('\n')[0];
			var paramString = header.substring(header.indexOf('(') + 1, header.indexOf(')'));
			if(paramString.length){
				var paramItems = paramString.split(',');
				embed.forEach(paramItems, function(item){
					var param, hint, optional;
					item = embed.trim(item);
					var hintParts = item.split('*/');
					if(hintParts.length > 1){
						param = embed.trim(hintParts[1]);
						hint = hintParts[0].substring(2, hintParts[0].length);
						if(hint.indexOf('?') != -1){
							hint = embed.trim(hint);
							hint = hint.substring(0, hint.length - 1);
							optional = true;
						}else{
							optional = false;
						}
					}else{
						param = item;
						hint = '';
						optional = false;
					}
					params.push({ name: param, type: hint, optional: optional });
				}, this);
			}
			item.params = params;
		},
		
		parseComments: function(item){
			var doc = {};
			var section;
			var keywords = this.keywords.concat(embed.map(item.params, function(_item){ return _item.name; }));
			embed.forEach(item.comments, function(line){
				line = embed.trim(line);
				// If that line starts with a keyword and a ':',
				// it's likely a section.
				var _parts = line.split(':');
				if(_parts.length == 2 && embed.indexOf(keywords, _parts[0]) != -1){
					// section start
					section = _parts[0];
					!doc[section] && (doc[section] = []);
				}else{
					// section continues
					section && doc[section].push(line);
				}
			}, this);
			
//			for(section in doc){
//				doc[section] = doc[section].join('\n');
//			}
			item.doc = doc;
		}
	};
	
	return parser;

});