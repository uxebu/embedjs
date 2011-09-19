// This test group tests style methods.

	// TODO: dojo.style could use some more testing,
	//	as we heavily modified dojo's style method.

require(['text!../tests/tests/html/class+style.html'], function(html){

tests.register("html-style",
	[
		function _start(t){
			document.body.innerHTML = html;
			
			// Init the stuff with what we expect, acutally this belongs in the HTML itself,
			// but how do i build the .js for it? :)
			dojo.style('sq100nopos', {opacity: 1, color: "red", position: "static", backgroundColor: "black"});
			//tests.registerDocTests("../src/html/style.js"); 
		},

		function basicStyle(){
			doh.is(1, dojo.style('sq100nopos', 'opacity'));
			doh.is(0.1, dojo.style('sq100nopos', 'opacity', 0.1));
			doh.is(0.8, dojo.style('sq100nopos', 'opacity', 0.8));
		},
		/**
		 * TODO: Do we really want to test color?
		 * 	Need to find out:
		 * 		a) what the spec says to this
		 * 		b) if browser vendors really comply to it
		 * 		c) what happens on more complex stuff like rgba or hsla...
		 */
		function setColorByName(){
			dojo.style('sq100nopos', 'color', "red");
			doh.is("red", dojo.style('sq100nopos', 'color'));
		},
		function setColorByRgb(){
			dojo.style('sq100nopos', 'color', "rgb(255, 0, 255)");
			doh.is("rgb(255, 0, 255)", dojo.style('sq100nopos', 'color'));
		},
		function setColorByHex(){
			dojo.style('sq100nopos', 'color', "#FFFFFF");
			//doh.is("#FFFFFF", dojo.style('sq100nopos', 'color'));
			doh.is("rgb(255, 255, 255)", dojo.style('sq100nopos', 'color')); // Seems like this is expected...
		},
		function setColorEmpty(){
			dojo.style('sq100nopos', 'color', "");
			doh.is("", dojo.style('sq100nopos', 'color'));
		},
		
		function styleObject(){
			dojo.style('sq100nopos', { 'opacity': 0.1 });
			// Chrome 9 will return 0.10000000149011612 here, which is close enough.
			// Let's just multiply and remove fractions.
			doh.is(1000, parseInt(dojo.style('sq100nopos', 'opacity')*10000)); 
			dojo.style('sq100nopos', { 'opacity': 0.8 });
			doh.is(8000, parseInt(dojo.style('sq100nopos', 'opacity')*10000)); // Same as above
		},
		function defaultPosition(){
			doh.is('static', dojo.style('sq100nopos', 'position'));
		},
		function getBgcolor(t){
			var bgc = dojo.style('sq100nopos', 'backgroundColor');
			doh.t((bgc == "rgb(0, 0, 0)")||(bgc == "black")||(bgc == "#000000"));
		},

		
		/* No position/coords etc in API
		"doh.is(100, dojo.marginBox('sq100').w);",
		"doh.is(100, dojo.marginBox('sq100').h);",

		"doh.is(120, dojo.marginBox('sq100margin10').w);",
		"doh.is(120, dojo.marginBox('sq100margin10').h);",
		"doh.is(100, dojo.contentBox('sq100margin10').w);",
		"doh.is(100, dojo.contentBox('sq100margin10').h);",

		"doh.is(140, dojo.marginBox('sq100margin10pad10').w);",
		"doh.is(140, dojo.marginBox('sq100margin10pad10').h);",

		"doh.is(120, dojo.marginBox('sq100pad10').w);",
		"doh.is(120, dojo.marginBox('sq100pad10').h);",

		"doh.is(110, dojo.marginBox('sq100ltpad10').w);",
		"doh.is(110, dojo.marginBox('sq100ltpad10').h);",
		"doh.is(100, dojo.contentBox('sq100ltpad10').w);",
		"doh.is(100, dojo.contentBox('sq100ltpad10').h);",

		"doh.is(120, dojo.marginBox('sq100ltpad10rbmargin10').w);",
		"doh.is(120, dojo.marginBox('sq100ltpad10rbmargin10').h);",

		"doh.is(120, dojo.marginBox('sq100border10').w);",
		"doh.is(120, dojo.marginBox('sq100border10').h);",
		"doh.is(100, dojo.contentBox('sq100border10').w);",
		"doh.is(100, dojo.contentBox('sq100border10').h);",

		"doh.is(140, dojo.marginBox('sq100border10margin10').w);",
		"doh.is(140, dojo.marginBox('sq100border10margin10').h);",
		"doh.is(100, dojo.contentBox('sq100border10margin10').w);",
		"doh.is(100, dojo.contentBox('sq100border10margin10').h);",

		"doh.is(160, dojo.marginBox('sq100border10margin10pad10').w);",
		"doh.is(160, dojo.marginBox('sq100border10margin10pad10').h);",
		"doh.is(100, dojo.contentBox('sq100border10margin10pad10').w);",
		"doh.is(100, dojo.contentBox('sq100border10margin10pad10').h);",

		// FIXME: the 'correct' w is not 100 on Safari WebKit (2.0.4 [419.3]), the right-margin extends to the document edge
		// "doh.is(100, dojo.marginBox('sq100nopos').w);",
		"doh.is(100, dojo.marginBox('sq100nopos').h);",

		"doh.is(10, dojo._getPadExtents(dojo.byId('sq100ltpad10rbmargin10')).l);",
		"doh.is(10, dojo._getPadExtents(dojo.byId('sq100ltpad10rbmargin10')).t);",
		"doh.is(10, dojo._getPadExtents(dojo.byId('sq100ltpad10rbmargin10')).w);",
		"doh.is(10, dojo._getPadExtents(dojo.byId('sq100ltpad10rbmargin10')).h);",

		"doh.is(0, dojo._getMarginExtents(dojo.byId('sq100ltpad10rbmargin10')).l);",
		"doh.is(0, dojo._getMarginExtents(dojo.byId('sq100ltpad10rbmargin10')).t);",
		"doh.is(10, dojo._getMarginExtents(dojo.byId('sq100ltpad10rbmargin10')).w);",
		"doh.is(10, dojo._getMarginExtents(dojo.byId('sq100ltpad10rbmargin10')).h);",

		"doh.is(10, dojo._getBorderExtents(dojo.byId('sq100border10margin10pad10')).l);",
		"doh.is(10, dojo._getBorderExtents(dojo.byId('sq100border10margin10pad10')).t);",
		"doh.is(20, dojo._getBorderExtents(dojo.byId('sq100border10margin10pad10')).w);",
		"doh.is(20, dojo._getBorderExtents(dojo.byId('sq100border10margin10pad10')).h);",

		"doh.is(20, dojo._getPadBorderExtents(dojo.byId('sq100border10margin10pad10')).l);",
		"doh.is(20, dojo._getPadBorderExtents(dojo.byId('sq100border10margin10pad10')).t);",
		"doh.is(40, dojo._getPadBorderExtents(dojo.byId('sq100border10margin10pad10')).w);",
		"doh.is(40, dojo._getPadBorderExtents(dojo.byId('sq100border10margin10pad10')).h);",

		function scrollUp(){
			dojo.doc.documentElement.scrollTop = 0;
		},

		function coordsBasic(t){
			var pos = dojo.position("sq100", false);
			// console.debug(pos);
			doh.is(100, pos.x);
			doh.is(100, pos.y);
			doh.is(100, pos.w);
			doh.is(100, pos.h);
		},
		function coordsMargin(t){
			// position() is getting us the border-box location
			var pos = dojo.position("sq100margin10", false);
			doh.is(260, pos.x);
			doh.is(110, pos.y);
			doh.is(100, pos.w);
			doh.is(100, pos.h);
			pos = dojo.marginBox("sq100margin10");
			doh.is(120, pos.w);
			doh.is(120, pos.h);
			// Though coords shouldn't be used, test it for backward compatibility.
			// coords returns the border-box location and margin-box size
			pos = dojo.coords("sq100margin10", false);
			doh.is(260, pos.x);
			doh.is(110, pos.y);
			doh.is(120, pos.w);
			doh.is(120, pos.h);
		},
		function coordsBorder(t){
			var pos = dojo.position("sq100border10", false);
			doh.is(100, pos.x);
			doh.is(400, pos.y);
		},
		function sq100nopos(t){
			var pos = dojo.position("sq100nopos", false);
			// console.debug(pos);
			doh.is(0, pos.x);
			doh.t(pos.y > 0);
			// FIXME: the 'correct' w is not 100 on Safari WebKit (2.0.4 [419.3]), the right-margin extends to the document edge
			// doh.is(100, pos.w);
			doh.is(100, pos.h);
		},
		function coordsScrolled(t) {
			var s = document.createElement('div');
			var c = document.createElement('div');
			document.body.appendChild(s);
			s.appendChild(c);
			var x=257, y= 285;
			with (s.style) {
				position = 'absolute';
				overflow = 'scroll';
				border = "10px solid black";
			}
			dojo._setMarginBox(s, x, y, 100, 100);
			dojo._setMarginBox(c, 0, 0, 500, 500);
			s.scrollTop = 200;
			var pos = dojo.position(s, true);
			doh.is(x, pos.x);
			doh.is(y, pos.y);
		},
		*/
		/*
		{
			name: "coordsIframe",
			timeout: 2000,
			runTest: function(){
				var def = new doh.Deferred();
				setTimeout(function(){ try{
					var oldLtr = dojo._isBodyLtr();
					var oldQuirks = dojo.isQuirks;
					dojo.withGlobal(dojo.byId('iframe_quirks').win, function(){
						doh.t(dojo.isQuirks, "isQuirks == true in quirks/iframe");
						doh.f(dojo._isBodyLtr(), "isBodyLtr == false in RTL/iframe");
					        var pos = dojo.position('iframe_00_quirks');
						doh.t(pos.x===0, "quirks iframe element x == 0 (x,y,w,h="+pos.x+","+pos.y+","+pos.w+","+pos.h+")");
						doh.t(pos.y===0, "quirks iframe element y == 0 (x,y,w,h="+pos.x+","+pos.y+","+pos.w+","+pos.h+")");
						doh.t(pos.w>0, "quirks iframe element w > 0 (x,y,w,h="+pos.x+","+pos.y+","+pos.w+","+pos.h+")");
						doh.t(pos.h>0, "quirks iframe element h > 0 (x,y,w,h="+pos.x+","+pos.y+","+pos.w+","+pos.h+")");
					});
					dojo.withGlobal(dojo.byId('iframe_strict').win, function(){
						doh.f(dojo.isQuirks, "isQuirks == false in strict/ifraee");
						doh.f(dojo._isBodyLtr(), "isBodyLtr == false in RTL/iframe");
					        var pos = dojo.position('iframe_00_strict');
						doh.t(pos.x===0, "strict iframe element x == 0 (x,y,w,h="+pos.x+","+pos.y+","+pos.w+","+pos.h+")");
						doh.t(pos.y===0, "strict iframe element y == 0 (x,y,w,h="+pos.x+","+pos.y+","+pos.w+","+pos.h+")");
						doh.t(pos.w>0, "strict iframe element w > 0 (x,y,w,h="+pos.x+","+pos.y+","+pos.w+","+pos.h+")");
						doh.t(pos.h>0, "strict iframe element h > 0 (x,y,w,h="+pos.x+","+pos.y+","+pos.w+","+pos.h+")");
					});
					doh.t(!oldLtr == !dojo._isBodyLtr(), "isBodyLtr restored after withGlobal");
					doh.t(!oldQuirks == !dojo.isQuirks, "isQuirks restored after withGlobal");
					def.callback(true);
				}catch(e){ def.errback(e); } }, 1000);
				return def;
			}
		},
		*/
		/* No isDescendant in API
		function isDescendant(t){
			doh.t(dojo.isDescendant("sq100", dojo.body()));
			doh.t(dojo.isDescendant("sq100", dojo.doc));
			doh.t(dojo.isDescendant("sq100", "sq100"));
			doh.t(dojo.isDescendant(dojo.byId("sq100"), "sq100"));
			doh.f(dojo.isDescendant("sq100", dojo.byId("sq100").firstChild));
			doh.t(dojo.isDescendant(dojo.byId("sq100").firstChild, "sq100"));
		},
		function isDescendantIframe(t){
			var bif = dojo.byId("blah");
			// this test barely makes sense. disabling it for now.
			// doh.t(dojo.isDescendant(bif.contentDocument.getElementById("subDiv"), bif.parentNode));
			var subDiv = getIframeDocument(bif).getElementById("subDiv");
			doh.t(dojo.isDescendant(subDiv, subDiv));
			doh.t(dojo.isDescendant(subDiv, subDiv.parentNode));
			doh.f(dojo.isDescendant(subDiv.parentNode, subDiv));

		},
		*/
		/*
		function testLabelForAttr(t){
			// create label with no for attribute make sure requesting
			// it as for and html for returns null
			var label = document.createElement("label");
			if(!dojo.isIE){
				// IE always assumes that "for" is present
				doh.f(dojo.attr(label, "for"));
				doh.f(dojo.attr(label, "htmlFor"));
			}
			// add a for attribute and test that can get by requesting for
			dojo.attr(label, "for", "testId");
			doh.is("testId", dojo.attr(label, "for"));
			// add as htmlFor and make sure it is returned when requested as htmlFor
			var label2 = document.createElement("label");
			dojo.attr(label2, "htmlFor", "testId2");
			doh.is("testId2", dojo.attr(label2, "htmlFor"));
			// check than when requested as for or htmlFor attribute is found
			doh.t(dojo.hasAttr(label, "for"));
			doh.t(dojo.hasAttr(label2, "htmlfor"));
			// test from markup
			var labelNoFor = dojo.byId("label-no-for");
			// make sure testing if has attribute using for or htmlFor 
			// both return null when no value set
			if(!dojo.isIE){
				// IE always assumes that "for" is present
				doh.f(dojo.hasAttr(labelNoFor, "for"));
				doh.f(dojo.hasAttr(labelNoFor, "htmlFor"));
			}
			var labelWithFor = dojo.byId("label-with-for");
			// when markup includes for make certain testing if has attribute
			// using for or htmlFor returns true
			doh.t(dojo.hasAttr(labelWithFor, "for"));
			doh.t(dojo.hasAttr(labelWithFor, "htmlFor"));
			// when markup include for attrib make sure can retrieve using for or htmlFor
			doh.is("input-with-label", dojo.attr(labelWithFor, "for"));
			doh.is("input-with-label", dojo.attr(labelWithFor, "htmlFor"));
		},
		function attrInnerHtmlDiv(t){
			var n = dojo.create("div", {
					innerHTML: "1<em>2</em>3"
				}, dojo.body());
			doh.is("1<em>2</em>3", n.innerHTML.toLowerCase());
			dojo.destroy(n);
		},
		function attrInnerHtmlTable(t){
			var n = dojo.create("table", {
					innerHTML: "<thead><tr><th>1st!</th></tr></thead><tbody></tbody>"
				}, dojo.body());
			doh.is("<thead><tr><th>1st!</th></tr></thead><tbody></tbody>",
				n.innerHTML.toLowerCase().replace(/\s+/g, ""));
			dojo.destroy(n);
		},
		function attrInputTextValue(t){
			doh.is("123", dojo.byId("input-text-value").value);
			doh.is("123", dojo.attr("input-text-value", "value"));
			dojo.attr("input-text-value", "value", "abc");
			doh.is("abc", dojo.byId("input-text-value").value);
			doh.is("abc", dojo.attr("input-text-value", "value"));
			dojo.byId("input-text-value").value = "xyz";
			doh.is("xyz", dojo.byId("input-text-value").value);
			doh.is("xyz", dojo.attr("input-text-value", "value"));
			dojo.byId("input-text-value").value = "123"; // fixes initialization problem when the test is reloaded
		},
		function testInputDisabled(t){
			doh.f(dojo.attr("input-no-disabled", "disabled"));
			doh.t(dojo.attr("input-with-disabled", "disabled"));
			doh.t(dojo.attr("input-with-disabled-true", "disabled"));
		}
		*/
		/*
		,
		function testIframeDestroy10095(t){
			var iframeWin = dojo.byId('10095_iframe').win;
			doh.t(!iframeWin.document.getElementById('10095_textbox'), "reloaded iframe element destroyed");
		}
		*/
	]
);

});