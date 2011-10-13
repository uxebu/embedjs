define(['embed'], function(embed){
	// This makes the embed property available
	// in global scope. It can be used for the
	// 'traditional' non-AMD build scenarios.
	embed.global.embed = embed;
	return embed;
});