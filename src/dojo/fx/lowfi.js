require.modify("dojo/fx", "dojo/fx/lowfi", ["dojo", "dojo/html"], function(){
// A pseudo-animation module. Animations are simply skipped
// document.body is hidden during the transition

(function(d){

	var fx = d.fx = {},
		byId = d.byId,
		mixin = d.mixin;

	fx.slideTo = function(args){
		// summary: Change the style of the given node, by modifying either left and top value or both.
		// description: If you only pass in a left value, the top value will
		// 		not be touched, and vice versa.
		var node = args.node = byId(args.node);

		return {
			play : function(){
				var b = document.body;
					d = b.style.display;

				b.style.display = "none";

				if (typeof args.left != "undefined") {
					node.style.left = args.left + args.unit;
				}
				if (typeof args.top!= "undefined") {
					node.style.top = args.top + args.unit;
				}

				if (typeof args.onEnd === "function") {
					args.onEnd();
				}

				b.style.display = d;
			}
		}
	}

}(dojo));
});