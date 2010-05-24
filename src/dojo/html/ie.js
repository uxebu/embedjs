require.modify("dojo/html", "dojo/html/ie", ["dojo"], function(){
(function(d){
	d._getComputedStyle = d.getComputedStyle = function(node){
		// IE (as of 7) doesn't expose Element like sane browsers
		return node.nodeType == 1 /* ELEMENT_NODE*/ ? node.currentStyle : {};
	};

	d._getIeDocumentElementOffset = function(){
		//	summary:
		//		returns the offset in x and y from the document body to the
		//		visual edge of the page
		//	description:
		// The following values in IE contain an offset:
		//	|		event.clientX
		//	|		event.clientY
		//	|		node.getBoundingClientRect().left
		//	|		node.getBoundingClientRect().top
		//	 	But other position related values do not contain this offset,
		//	 	such as node.offsetLeft, node.offsetTop, node.style.left and
		//	 	node.style.top. The offset is always (2, 2) in LTR direction.
		//	 	When the body is in RTL direction, the offset counts the width
		//	 	of left scroll bar's width.  This function computes the actual
		//	 	offset.

		//NOTE: assumes we're being called in an IE browser

		var de = d.doc.documentElement; // only deal with HTML element here, _abs handles body/quirks

		var r = de.getBoundingClientRect(); // works well for IE6+
		//console.debug('rect left,top = ' + r.left+','+r.top + ', html client left/top = ' + de.clientLeft+','+de.clientTop + ', rtl = ' + (!d._isBodyLtr()) + ', quirks = ' + d.isQuirks);
		var l = r.left,
			t = r.top;
			l += de.clientLeft;	// scrollbar size in strict/RTL, or,
			t += de.clientTop;	// HTML border size in strict

		return {
			x: l < 0? 0 : l, // FRAME element border size can lead to inaccurate negative values
			y: t < 0? 0 : t
		};

	};

	d._fixIeBiDiScrollLeft = function(/*Integer*/ scrollLeft){
		// In RTL direction, scrollLeft should be a negative value, but IE < 8
		// returns a positive one. All codes using documentElement.scrollLeft
		// must call this function to fix this error, otherwise the position
		// will offset to right when there is a horizontal scrollbar.

		//>>excludeStart("webkitMobile", kwArgs.webkitMobile);
		var dd = d.doc;
		if(d.isIE < 8 && !d._isBodyLtr()){
			var de = d.isQuirks ? dd.body : dd.documentElement;
			return scrollLeft + de.clientWidth - de.scrollWidth; // Integer
		}
		//>>excludeEnd("webkitMobile");
		return scrollLeft; // Integer
	}
})(dojo);
});