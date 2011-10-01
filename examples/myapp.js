define(['feature!html-element'],function(embed){
	return {
		
		containerNode: null,
		
		kickoff: function(){
			this.renderNodes();
		},
	
		renderNodes: function(){
			this.containerNode = embed.create('div', {
				innerHTML: 'It works!'
			}, embed.body());
		}
		
	};
});