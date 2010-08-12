require.def("dojo/fx", ["dojo"], function(){
//dojo.provide("dojo.fx");

(function(d){
	// This is intermediate code mimiking the dojo animation patterns
	// Since CSS transitions do not support features such as stop/resume,
	// events during the animation, synchronization and custom easing

	var fx = d.fx = {},
		byId = d.byId,
		mixin = d.mixin;

	function _connect(args){
		var _connectMap = {
			onEnd: "webkitTransitionEnd"
		}, conn = [];

		// connect all events in case a function has been passed.
		// This doesn't support connecting to events in any other way
		// e.g. dojo.connect(anim, "onEnd", function(){}) won't work here
		for (var i in args){
			if (_connectMap[i]){
				conn[i] = dojo.connect(args.node, _connectMap[i], (function(key){
					return function(){
						// Disconnect event once fired
						dojo.disconnect(conn[key]);
						args[key]();
					}
				})(i));
			}
		}
	}

	function _animate(args){
		_connect(args);

		if (args.beforeBegin){
			args.beforeBegin();
		}

		// Set all transition style properties
		dojo.style(args.node, {
			webkitTransitionProperty: args.property,
			webkitTransitionDuration: args.duration/1000+"s",
			webkitTransitionTimingFunction: args.easing,
			webkitTransitionDelay: args.delay
		});

		// Set the actual style value
		// setTimeout gets called because the animation needs to be executed on a new callstack
		setTimeout(function(){
			dojo.style(args.node, args.property, args.propertyValue);
		}, 0);
	}

	fx.slideTo = function(/*Object?*/ args){
		// summary: Animate a node to a certain position.
		// example:
		//	|	dojo.fx.slideTo({ node: node, left:"40", top:"50", units:"px" }).play()
		args.node = byId(args.node);
		args = mixin({
			units: "px",
			property: "-webkit-transform",
			easing: "linear",
			duration: "1000"
		}, args);

		// Determine which webkit translate function and paramters to use.
		var top = typeof args.top!="undefined" ? (args.top + args.units) : false,
			left = typeof args.left!="undefined" ? (args.left + args.units) : false;
		if (top && left){
			args.propertyValue = 'translate(' + left + ',' + top + ')';
		}else if (top){
			args.propertyValue = 'translateY(' + top + ')';
		}else if (left){
			args.propertyValue = 'translateX(' + left + ')';
		}else{
			throw new Error("slideTo needs top or left value");
		}

		return {
			play: function(){
				_animate(args);
			}
		};
	}

	d.slideBy = function(){

	}

	fx._fadeDefaults = {
		property: "opacity",
		easing: "linear",
		duration: 1000,
		delay: 0
	};

	d.fadeOut = fx.fadeOut = function(/*Object*/ args){
		// example:
		//	|	dojo.fx.fadeOut({ node: node }).play()
		args.node = byId(args.node);

		args = mixin(fx._fadeDefaults, {
			end: 0
		}, args);

		// determination of webkit translate function
		args.propertyValue = args.end;

		return {
			play: function(){
				_animate(args);
			}
		};
	}

	fx.fadeIn = function(/*Object*/ args){
		// example:
		//	|	dojo.fx.fadeIn({ node: node }).play()
		args.node = byId(args.node);

		args = mixin(fx._fadeDefaults, {
			end: 1
		}, args);

		// determination of webkit translate function
		args.propertyValue = args.end;

		return {
			play: function(){
				_animate(args);
			}
		};
	}
})(dojo);

});