require.def("dojo/fx", ["dojo", "dojo/html", "dojo/lang/hitch"], function(){
(function(d){

	var fx = d.fx = {},
		byId = d.byId,
		mixin = d.mixin;

	var _anim = function(params){
		// summary: A tiny animation class, providing simply iterations and the
		// 		current percent values and some smaller time handling (incl. fixes).

		this._lastAnimate = null;

		// Ranges 0.00...100.00
		this.percent = 0;

		this.percentPerStep = Math.round((params.rate / params.duration) * 100 * 100) / 100; // Let's stick to two decimals after the comma!!!

		this.play = function(){
			this._lastAnimate = new Date().valueOf();
			if (params.beforeBegin){
				params.beforeBegin();
			}
			this.onAnimate();
		};

		this.onAnimate = function(){
			// summary: Called on every iteration.
			if (params.onAnimate){
				params.onAnimate(this);
			}
			if (this.percent >= 100){
				if (params.onEnd) params.onEnd();
				return;
			}
			this.percent = Math.round((this.percent + this.percentPerStep) * 100) / 100;
			this.percent = this.percent>100 ? 100 : this.percent; // Do never get above 100% ...doh.

			// Call this method again, with the according timeout to finish in time.
// TODO actually imho the timeout value should be calculated so that duration is kept properly, which may mean that the
// timeout must be shorter due to missed frames or whatever slowdown of the anim. Then
// it might skip frames but it finishes in time, which imho is most important!!! Or can even this be configurable? NO! => KISS
			var now = new Date().valueOf(),
				diff = (now - this._lastAnimate), // The time the processing took, so subtract it from the timeout.
				timeout = ((diff < params.rate) ? (params.rate - diff) : 10); // If the diff is negative come again in 10ms, right away.
//console.log('params.rate = ', params.rate, 'diff = ', diff, 'timeout = ', timeout);
			setTimeout(dojo.hitch(this, "onAnimate"), timeout);
			this._lastAnimate = now;
		}
	};

	function _getStartValues(args){
		var ret = {left:null, top:null},
			hasLeft = typeof args.left != "undefined",
			hasTop = typeof args.top != "undefined";
		// If the unit is in percent, we rely on the initial node position to be
		// in percent too. And since dojo.style() ONLY returns px values, we can't
		// use it here!
		if (args.units=="%" && hasLeft){
			var left = args.node.style.left;
			if (left === "" || ""+left === "0"){
				ret.left = 0
			}else if (left.slice(-1) != "%"){
				throw new Error("'left' value must be given in percent, to animate using '%' as units. Value was: '" + left + "'.");
			} else {
				ret.left = parseFloat(left.substr(0, left.length-1));
			}
		}
// TODO do top, and when units is not % ...
		return ret;
	}

	fx.slideTo = function(args){
		// summary: Animate the given node, by modifying either left and top value or both.
		// description: If you only pass in a left value, the top value will
		// 		not be touched, and vice versa.
		var node = args.node = byId(args.node);
		args = mixin({
			units: "px",
			easing: "linear",
			duration: 1000,

			// rate: Integer?
			//		the time in milliseconds to wait before advancing to next frame
			//		(used as a fps timer: 1000/rate = fps)
			rate: 20 /* 50 fps */
		}, args);

		var start = _getStartValues(args),
			offset = args.left - start.left,
			hasLeft = typeof args.left != "undefined",
			hasTop = typeof args.top != "undefined";
		var anim = new _anim({
			duration:args.duration,
			rate:args.rate,
			onAnimate:function(anim){
				if (hasLeft){
					var newLeft = start.left + (offset * anim.percent/100);
					args.node.style.left = newLeft + args.units;
				}
			},
			onEnd:args.onEnd || function(){},
			beforeBegin:args.beforeBegin || function(){}
		});
		return {play:dojo.hitch(anim, "play")};
	}

	fx._fadeDefaults = {
		property: "opacity",
		easing: "linear",
		duration: 1000,
		delay: 0
	};

	fx.fadeIn = function(/*dojo.__FadeArgs*/ args){
		// summary:
		//		Returns an animation that will fade node defined in 'args' from
		//		its current opacity to fully opaque.
		return d._fade(d.mixin(fx._fadeDefaults, { end: 1 }, args)); // dojo.Animation
	};

	fx.fadeOut = function(/*dojo.__FadeArgs*/  args){
		// summary:
		//		Returns an animation that will fade node defined in 'args'
		//		from its current opacity to fully transparent.
		return d._fade(d.mixin(fx._fadeDefaults, { end: 0 }, args)); // dojo.Animation
	};

	d._fade = function(/*Object*/ args){
		//	summary:
		//		Returns an animation that will fade the node defined by
		//		args.node from the start to end values passed (args.start
		//		args.end) (end is mandatory, start is optional)

		var start = args.start ? parseFloat(args.start) : parseFloat(args.node.style[args.property]||0);
		var end = args.end;

		if (start > end){
			var diff = start-end;
			var m = -1;
		}else{
			var diff = end - start;
			var m = 1;
		}

		var anim = new _anim({
			duration:args.duration,
			rate: 20,
			onAnimate:function(anim){
				args.node.style[args.property] = start + (m*(diff/100*anim.percent));
			},
			onEnd:args.onEnd || function(){},
			beforeBegin:args.beforeBegin || function(){}
		});
		return {play:dojo.hitch(anim, "play")};
	};
})(dojo);
});