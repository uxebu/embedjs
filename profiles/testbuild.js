// This is a profile definition, i.e. a summary
// of what features should be included in embed.
// This replaces the profile section in the old
// build-config.json.
// In a build, point the build tool to this file,
// e.g. 
// path/to/requirejs/buildj.sh name=../profiles/testbuild out=built.js baseUrl=. paths.implementations=../platforms/unknown

define([
	"feature!array",
	"feature!lang-object"
],
function(embed){
	// This is the place to attach
	// embed to the global namespace,
	// if we want to.
	embed.global.embed = embed;
	
	return embed;
});