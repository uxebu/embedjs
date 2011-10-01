// This profile contains methods for
// OO dev.

define([
	"feature!oo-declare",
	"feature!oo-delegate",
	"feature!oo-extend"
],
function(embed){
	// This is the place to attach
	// embed to the global namespace,
	// if we want to.
	embed.global.embed = embed;
	
	return embed;
});