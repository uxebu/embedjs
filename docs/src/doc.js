require(['embed', '../docs/src/parser', '../profiles/kitchensink'], function(embed, parser){
	
	var docTool = {
			
		data: [],
		
		domNode: null,
		
		itemTemplates: {
			'tpl-function': '<h1><a name="{name}">{name_ext}</a></h1><h2>{type}</h2><div>{detailsTable}</div>',
			'tpl-default': '<h1><a name="{name}">{name}</a></h1><h2>{type}</h2>',
			'tpl-doc-item': '<tr><td>{name}</td><td>{desc}</td></tr>',
			'tpl-doc-param': '<tr><td>{name}</td><td>{type}</td><td>{optional}</td><td>{desc}</td></tr>',
			'toplink': '<div><a href="./#top">back to top</a></div>'
		},
		
		keywordHash: {
			'summary': 'Summary',
			'description': 'Description',
			'example': 'Examples',
			'returns': 'Returns',
			'feature': 'Implemented In',
			'equals': 'Equals',
			'dojodiff': 'Different to Dojo'
		},
			
		init: function(){
			this.domNode = embed.byId('listing');
			this.data = parser.run(embed);
			this.renderTOC();
			this.display();
		},
		
		display: function(){
			embed.forEach(this.data, function(item){
				if(item.isPrivate || item.type != 'function'){
					return;
				}
				
				if(item.type == 'function'){
					item.name_ext = item.name + '(' + embed.map(item.params, function(_item){ return _item.name; }).join(', ') + ')';
					
					var paramDescs = {};
					var detailsTable = '<table>';
					for(var section in item.doc){
						var desc = "";
						var isCode = false;
						embed.forEach(item.doc[section], function(_line){
							if(_line.substring(0,1) == '|'){
								if(!isCode){
									desc += '<pre>';
									isCode = true;
								}
								desc += this.escapeString(_line)+ '\n';
							}else{
								if(isCode){
									desc += '</pre>';
									desc += this.escapeString(_line) + '\n';
									isCode = false;
								}else{
									desc += this.escapeString(_line) + '\n';
								}
							}
						}, this);
						item.doc[section] = desc;
						
						
						if(embed.indexOf(parser.keywords, section) != -1){
							detailsTable += embed.replace(this.itemTemplates['tpl-doc-item'], { name: this.keywordHash[section] || section, desc: item.doc[section] });
						}else{
							paramDescs[section] = item.doc[section];
						}
					}
					if(item.params.length){
						detailsTable += '<tr><td>Parameters</td><td><table>';
						detailsTable += '<thead><tr><td>Name</td><td>Type</td><td>Optional</td><td>Description</td></tr></thead><tbody>'
						embed.forEach(item.params, function(_param){
							_param.desc = paramDescs[_param.name] || '';
							detailsTable += embed.replace(this.itemTemplates['tpl-doc-param'], _param);
						}, this);
						detailsTable += '</tbody></table></td></tr>';
					}
					detailsTable += '</table>';
					
					item.detailsTable = detailsTable;
				}
				
				embed.create('div', {
					className: 'item',
					innerHTML: embed.replace(this.itemTemplates['tpl-' + item.type] || this.itemTemplates['tpl-default'], item) + this.itemTemplates.toplink
				}, this.domNode);
			}, this);
		},
		
		escapeString: function(str){
			var b = document.createElement("b"),
				a = b.appendChild(document.createTextNode(0));
			
			a.nodeValue = str;
			return b.innerHTML;
		},
		
		renderTOC: function(){
			var ul = embed.create('ul', {}, embed.byId('toc'));
			embed.forEach(this.data, function(item){
				if(item.isPrivate || item.type != 'function'){
					return;
				}
				embed.create('li', {
					className: item.type,
					innerHTML: '<a href="./#'+ item.name +'">' + item.name + '</a>'
				}, ul);
			}, this);
		}
		
	};
	
	docTool.init();
	window.docTool = docTool;

});