var embed,dojo;embed=dojo={};embed.config={};embed.global=this;embed.doc=this.document||null;embed.body=function(){var _1=embed;return _1.doc&&_1.doc.body;};embed.version="0.1";(function(_2){var _3=_2._getProp;_2._getProp=function(_4,_5,_6){var _7=_6||_2.global;if(_7===window&&_5&&_4.length&&typeof window[_4[0]]==="undefined"){window[_4[0]]={};}return _3(_4,_5,_6);};}(dojo));["indexOf","lastIndexOf","forEach","map","some","every","filter"].forEach(function(_8,_9){dojo[_8]=function(_a,_b,_c){if((_9>1)&&(typeof _b=="string")){_b=new Function("item","index","array",_b);}return Array.prototype[_8].call(_a,_b,_c);};});dojo.isString=function(it){return (typeof it=="string"||it instanceof String);};dojo.isArray=function(it){return it&&(it instanceof Array||typeof it=="array");};dojo.isFunction=(function(){var _d=function(it){var t=typeof it;return it&&(t=="function"||it instanceof Function)&&!it.nodeType;};return dojo.isSafari?function(it){if(typeof it=="function"&&it=="[object NodeList]"){return false;}return _d(it);}:_d;})();dojo.isObject=function(it){return it!==undefined&&(it===null||typeof it=="object"||dojo.isArray(it)||dojo.isFunction(it));};dojo.isArrayLike=function(it){var d=dojo;return it&&it!==undefined&&!d.isString(it)&&!d.isFunction(it)&&!(it.tagName&&it.tagName.toLowerCase()=="form")&&(d.isArray(it)||isFinite(it.length));};dojo.isAlien=function(it){return it&&!dojo.isFunction(it)&&/\{\s*\[native code\]\s*\}/.test(String(it));};dojo.isNumeric=function(n){return n==parseFloat(n);};dojo.isNumber=function(n){return typeof n=="number"||n instanceof Number;};dojo._hitchArgs=function(_e,_f){var pre=dojo.toArray(arguments,2);var _10=dojo.isString(_f);return function(){var _11=dojo.toArray(arguments);var f=_10?(_e||dojo.global)[_f]:_f;return f&&f.apply(_e||this,pre.concat(_11));};};dojo.hitch=function(_12,_13){if(arguments.length>2){return dojo._hitchArgs.apply(dojo,arguments);}if(!_13){_13=_12;_12=null;}if(dojo.isString(_13)){_12=_12||dojo.global;if(!_12[_13]){throw (["dojo.hitch: scope[\"",_13,"\"] is null (scope=\"",_12,"\")"].join(""));}return function(){return _12[_13].apply(_12,arguments||[]);};}return !_12?_13:function(){return _13.apply(_12,arguments||[]);};};dojo._listener={getDispatcher:function(){return function(){var ap=Array.prototype,c=arguments.callee,ls=c._listeners,t=c.target;var r=t&&t.apply(this,arguments);var i,lls;lls=[].concat(ls);for(i in lls){if(!(i in ap)){lls[i].apply(this,arguments);}}return r;};},add:function(_14,_15,_16){_14=_14||dojo.global;var f=_14[_15];if(!f||!f._listeners){var d=dojo._listener.getDispatcher();d.target=f;d._listeners=[];f=_14[_15]=d;}return f._listeners.push(_16);},remove:function(_17,_18,_19){var f=(_17||dojo.global)[_18];if(f&&f._listeners&&_19--){delete f._listeners[_19];}}};dojo.connect=dojo.on=function(obj,_1a,_1b,_1c,_1d){var a=arguments,_1e=[],i=0;_1e.push(dojo.isString(a[0])?null:a[i++],a[i++]);var a1=a[i+1];_1e.push(dojo.isString(a1)||dojo.isFunction(a1)?a[i++]:null,a[i++]);for(var l=a.length;i<l;i++){_1e.push(a[i]);}return dojo._connect.apply(this,_1e);};dojo._connect=function(obj,_1f,_20,_21){var l=dojo._listener,h=l.add(obj,_1f,dojo.hitch(_20,_21));return [obj,_1f,h,l];};dojo.disconnect=function(_22){if(_22&&_22[0]!==undefined){dojo._disconnect.apply(this,_22);delete _22[0];}};dojo._disconnect=function(obj,_23,_24,_25){_25.remove(obj,_23,_24);};(function(){var del=(dojo._event_listener={add:function(_26,_27,fp){if(!_26){return;}_27=del._normalizeEventName(_27);_26.addEventListener(_27,fp,false);return fp;},remove:function(_28,_29,_2a){if(_28){_29=del._normalizeEventName(_29);_28.removeEventListener(_29,_2a,false);}},_normalizeEventName:function(_2b){return _2b.slice(0,2)=="on"?_2b.slice(2):_2b;}});dojo.fixEvent=function(evt,_2c){return del._fixEvent(evt,_2c);};dojo.stopEvent=function(evt){evt.preventDefault();evt.stopPropagation();};dojo._connect=function(obj,_2d,_2e,_2f,_30){var _31=obj&&(obj.nodeType||obj.attachEvent||obj.addEventListener);var lid=_31?1:0,l=[dojo._listener,del][lid];var h=l.add(obj,_2d,dojo.hitch(_2e,_2f));return [obj,_2d,h,lid];};dojo._disconnect=function(obj,_32,_33,_34){([dojo._listener,del][_34]).remove(obj,_32,_33);};})();dojo._topics={};dojo.subscribe=function(_35,_36,_37){return [_35,dojo._listener.add(dojo._topics,_35,dojo.hitch(_36,_37))];};dojo.unsubscribe=function(_38){if(_38){dojo._listener.remove(dojo._topics,_38[0],_38[1]);}};dojo.publish=function(_39,_3a){var f=dojo._topics[_39];if(f){f.apply(this,_3a||[]);}};dojo.connectPublisher=function(_3b,obj,_3c){var pf=function(){dojo.publish(_3b,arguments);};return _3c?dojo.connect(obj,_3c,pf):dojo.connect(obj,pf);};(function(d){(function(){dojo.__mutator=function(){};var _3d=Object.freeze||function(){};dojo.Promise=function(_3e){var _3f,_40,_41,_42,_43;var _44=this.promise={};function _45(_46){if(_40){throw new Error("This deferred has already been resolved");}_3f=_46;_40=true;_47();};function _47(){var _48;while(!_48&&_43){var _49=_43;_43=_43.next;if(_48=(_49.progress==dojo.__mutator)){_40=false;}var _4a=(_41?_49.error:_49.resolved);if(_4a){try{var _4b=_4a(_3f);if(_4b&&typeof _4b.then==="function"){_4b.then(dojo.hitch(_49.deferred,"resolve"),dojo.hitch(_49.deferred,"reject"));continue;}var _4c=_48&&_4b===undefined;_49.deferred[_4c&&_41?"reject":"resolve"](_4c?_3f:_4b);}catch(e){_49.deferred.reject(e);}}else{if(_41){_49.deferred.reject(_3f);}else{_49.deferred.resolve(_3f);}}}};this.resolve=function(_4d){this.fired=0;this.results=[_4d,null];_45(_4d);};this.reject=function(_4e){_41=true;this.fired=1;_45(_4e);this.results=[null,_4e];if(!_4e||_4e.log!==false){(dojo.config.deferredOnError||function(x){})(_4e);}};this.progress=function(_4f){var _50=_43;while(_50){var _51=_50.progress;_51&&_51(_4f);_50=_50.next;}};this.then=_44.then=function(_52,_53,_54){var _55=_54==dojo.__mutator?this:new dojo.Promise(_44.cancel);var _56={resolved:_52,error:_53,progress:_54,deferred:_55};if(_43){_42=_42.next=_56;}else{_43=_42=_56;}if(_40){_47();}return _55.promise;};var _57=this;this.cancel=_44.cancel=function(){if(!_40){var _58=_3e&&_3e(_57);if(!_40){if(!(_58 instanceof Error)){_58=new Error(_58);}_58.log=false;_57.reject(_58);}}};_3d(_44);};})();})(dojo);dojo.when=function(_59,_5a,_5b,_5c){if(_59&&typeof _59.then==="function"){return _59.then(_5a,_5b,_5c);}return _5a(_59);};(function(d){var _5d={},_5e;for(var i in {toString:1}){_5e=[];break;}dojo._extraNames=_5e=_5e||["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString"];d._mixin=function(_5f,_60){var _61,s,i=0,l=_5e.length;for(_61 in _60){s=_60[_61];if(s!==_5d[_61]&&s!==_5f[_61]){_5f[_61]=s;}}if(l&&_60){for(;i<l;++i){_61=_5e[i];s=_60[_61];if(s!==_5d[_61]&&s!==_5f[_61]){_5f[_61]=s;}}}return _5f;};dojo.mixin=function(obj,_62){if(!obj){obj={};}for(var i=1,l=arguments.length;i<l;i++){d._mixin(obj,arguments[i]);}return obj;};dojo.safeMixin=function(_63,_64){var _65,t,i=0,l=d._extraNames.length;var op=Object.prototype,_66=op.toString,_67="constructor";for(_65 in _64){t=_64[_65];if((t!==op[_65]||!(_65 in op))&&_65!=_67){if(_66.call(t)=="[object Function]"){t.nom=_65;}_63[_65]=t;}}for(;i<l;++i){_65=d._extraNames[i];t=_64[_65];if((t!==op[_65]||!(_65 in op))&&_65!=_67){if(_66.call(t)=="[object Function]"){t.nom=_65;}_63[_65]=t;}}return _63;};}(dojo));dojo.extend=function(_68,_69){for(var i=1,l=arguments.length;i<l;i++){dojo._mixin(_68.prototype,arguments[i]);}return _68;};dojo.Deferred=dojo.Promise;dojo.extend(dojo.Deferred,{callback:function(_6a){this.resolve(_6a);},errback:function(_6b){this.reject(_6b);},addCallbacks:function(_6c,_6d){this.then(_6c,_6d,dojo.__mutator);return this;},addCallback:function(_6e){return this.addCallbacks(dojo.hitch.apply(dojo,arguments));},addErrback:function(_6f){return this.addCallbacks(null,dojo.hitch.apply(dojo,arguments));},addBoth:function(_70){var _71=dojo.hitch.apply(dojo,arguments);return this.addCallbacks(_71,_71);},fired:-1});dojo.byId=function(id,doc){return (typeof id=="string")?(doc||document).getElementById(id):id;};(function(d){var _72=null,_73;d.destroy=function(_74){_74=dojo.byId(_74);try{var doc=_74.ownerDocument;if(!_72||_73!=doc){_72=doc.createElement("div");_73=doc;}_72.appendChild(_74.parentNode?_74.parentNode.removeChild(_74):_74);_72.innerHTML="";}catch(e){}};})(dojo);(function(d){d._getComputedStyle=function(_75){return _75.nodeType==1?_75.ownerDocument.defaultView.getComputedStyle(_75,null):{};};var _76="cssFloat",_77={"cssFloat":_76,"styleFloat":_76,"float":_76};d._style=function(_78,_79,_7a){var n=dojo.byId(_78),l=arguments.length;_79=_77[_79]||_79;if(l==3){return n.style[_79]=_7a;}var s=d._getComputedStyle(n);if(l==2&&typeof _79!="string"){for(var x in _79){d._style(_78,x,_79[x]);}return s;}return (l==1)?s:parseFloat(s[_79]||n.style[_79])||s[_79];};})(dojo);dojo.getComputedStyle=dojo._getComputedStyle;dojo.style=dojo._style;(function(d){var _7b={"class":"className","for":"htmlFor",tabindex:"tabIndex",readonly:"readOnly",colspan:"colSpan",frameborder:"frameBorder",rowspan:"rowSpan",valuetype:"valueType"},_7c={classname:"class",htmlfor:"for",tabindex:"tabIndex",readonly:"readOnly"},_7d={innerHTML:1,className:1,htmlFor:0,value:1};var _7e=function(_7f){return _7c[_7f.toLowerCase()]||_7f;};var _80=function(_81,_82){var _83=_81.getAttributeNode&&_81.getAttributeNode(_82);return _83&&_83.specified;};d.hasAttr=function(_84,_85){var lc=_85.toLowerCase();return _7d[_7b[lc]||_85]||_80(d.byId(_84),_7c[lc]||_85);};var _86={},_87=0,_88="_attrid",_89={col:1,colgroup:1,table:1,tbody:1,tfoot:1,thead:1,tr:1,title:1};d.attr=function(_8a,_8b,_8c){_8a=d.byId(_8a);var _8d=arguments.length,_8e;if(_8d==2&&typeof _8b!="string"){for(var x in _8b){d.attr(_8a,x,_8b[x]);}return _8a;}var lc=_8b.toLowerCase(),_8f=_7b[lc]||_8b,_90=_7d[_8f],_91=_7c[lc]||_8b;if(_8d==3){do{if(_8f=="style"&&typeof _8c!="string"){d.style(_8a,_8c);break;}if(_8f=="innerHTML"){_8a[_8f]=_8c;break;}if(d.isFunction(_8c)){var _92=d.attr(_8a,_88);if(!_92){_92=_87++;d.attr(_8a,_88,_92);}if(!_86[_92]){_86[_92]={};}var h=_86[_92][_8f];if(h){d.disconnect(h);}else{try{delete _8a[_8f];}catch(e){}}_86[_92][_8f]=d.connect(_8a,_8f,_8c);break;}if(_90||typeof _8c=="boolean"){_8a[_8f]=_8c;break;}_8a.setAttribute(_91,_8c);}while(false);return _8a;}_8c=_8a[_8f];if(_90&&typeof _8c!="undefined"){return _8c;}if(_8f!="href"&&(typeof _8c=="boolean"||d.isFunction(_8c))){return _8c;}return _80(_8a,_91)?_8a.getAttribute(_91):null;};d.removeAttr=function(_93,_94){d.byId(_93).removeAttribute(_7e(_94));};})(dojo);(function(d){var _95=d.byId;var _96={option:["select"],tbody:["table"],thead:["table"],tfoot:["table"],tr:["table","tbody"],td:["table","tbody","tr"],th:["table","thead","tr"],legend:["fieldset"],caption:["table"],colgroup:["table"],col:["table","colgroup"],li:["ul"]},_97=/<\s*([\w\:]+)/,_98={},_99=0,_9a="__"+d._scopeName+"ToDomId";for(var _9b in _96){var tw=_96[_9b];tw.pre=_9b=="option"?"<select multiple=\"multiple\">":"<"+tw.join("><")+">";tw.post="</"+tw.reverse().join("></")+">";}d._toDom=function(_9c,doc){doc=doc||d.doc;var _9d=doc[_9a];if(!_9d){doc[_9a]=_9d=++_99+"";_98[_9d]=doc.createElement("div");}_9c+="";var _9e=_9c.match(_97),tag=_9e?_9e[1].toLowerCase():"",_9f=_98[_9d],_a0,i,fc,df;if(_9e&&_96[tag]){_a0=_96[tag];_9f.innerHTML=_a0.pre+_9c+_a0.post;for(i=_a0.length;i;--i){_9f=_9f.firstChild;}}else{_9f.innerHTML=_9c;}if(_9f.childNodes.length==1){return _9f.removeChild(_9f.firstChild);}df=doc.createDocumentFragment();while(fc=_9f.firstChild){df.appendChild(fc);}return df;};d._docScroll=function(){var n=d.global;return "pageXOffset" in n?{x:n.pageXOffset,y:n.pageYOffset}:(n=d.doc.documentElement,n.clientHeight?{x:n.scrollLeft,y:n.scrollTop}:(n=d.body(),{x:n.scrollLeft||0,y:n.scrollTop||0}));};var _a1=function(_a2,ref){var _a3=ref.parentNode;if(_a3){_a3.insertBefore(_a2,ref);}};var _a4=function(_a5,ref){var _a6=ref.parentNode;if(_a6){if(_a6.lastChild==ref){_a6.appendChild(_a5);}else{_a6.insertBefore(_a5,ref.nextSibling);}}};d.place=function(_a7,_a8,_a9){_a8=_95(_a8);if(typeof _a7=="string"){_a7=_a7.charAt(0)=="<"?d._toDom(_a7,_a8.ownerDocument):_95(_a7);}if(typeof _a9=="number"){var cn=_a8.childNodes;if(!cn.length||cn.length<=_a9){_a8.appendChild(_a7);}else{_a1(_a7,cn[_a9<0?0:_a9]);}}else{switch(_a9){case "before":_a1(_a7,_a8);break;case "after":_a4(_a7,_a8);break;case "replace":_a8.parentNode.replaceChild(_a7,_a8);break;case "only":d.empty(_a8);_a8.appendChild(_a7);break;case "first":if(_a8.firstChild){_a1(_a7,_a8.firstChild);break;}default:_a8.appendChild(_a7);}}return _a7;};d.create=function(tag,_aa,_ab,pos){var doc=d.doc;if(_ab){_ab=_95(_ab);doc=_ab.ownerDocument;}if(typeof tag=="string"){tag=doc.createElement(tag);}if(_aa){for(var _ac in _aa){switch(_ac){case "class":tag.className=_aa[_ac];break;default:tag[_ac]=_aa[_ac];}}}if(_ab){d.place(tag,_ab,pos);}return tag;};d.empty=function(_ad){_95(_ad).innerHTML="";};})(dojo);dojo._getProp=function(_ae,_af,_b0){var obj=_b0||dojo.global;for(var i=0,p;obj&&(p=_ae[i]);i++){obj=(p in obj?obj[p]:(_af?obj[p]={}:undefined));}return obj;};dojo.setObject=function(_b1,_b2,_b3){var _b4=_b1.split("."),p=_b4.pop(),obj=dojo._getProp(_b4,true,_b3);return obj&&p?(obj[p]=_b2):undefined;};dojo.getObject=function(_b5,_b6,_b7){return dojo._getProp(_b5.split("."),_b6,_b7);};dojo.trim=String.prototype.trim?function(str){return str.trim();}:function(str){return str.replace(/^\s\s*/,"").replace(/\s\s*$/,"");};var _pattern=/\{([^\}]+)\}/g;dojo.replace=function(_b8,map,_b9){return _b8.replace(_b9||_pattern,dojo.isFunction(map)?map:function(_ba,k){return dojo.getObject(k,false,map);});};dojo.hasClass=function(_bb,_bc){return ((" "+dojo.byId(_bb).className+" ").indexOf(" "+_bc+" ")>=0);};dojo.toggleClass=function(_bd,_be,_bf){if(_bf===undefined){_bf=!dojo.hasClass(_bd,_be);}dojo[_bf?"addClass":"removeClass"](_bd,_be);};(function(){var _c0=/\s+/;var _c1=function(s){if(typeof s=="string"||s instanceof String){if(s.indexOf(" ")<0){return [s];}else{return dojo.trim(s).split(_c0);}}return s;};dojo.addClass=function(_c2,_c3){_c2=dojo.byId(_c2);_c3=_c1(_c3);var cls=" "+_c2.className+" ";for(var i=0,len=_c3.length,c;i<len;++i){c=_c3[i];if(c&&cls.indexOf(" "+c+" ")<0){cls+=c+" ";}}_c2.className=dojo.trim(cls);};dojo.removeClass=function(_c4,_c5){_c4=dojo.byId(_c4);var cls;if(_c5!==undefined){_c5=_c1(_c5);cls=" "+_c4.className+" ";for(var i=0,len=_c5.length;i<len;++i){cls=cls.replace(" "+_c5[i]+" "," ");}cls=dojo.trim(cls);}else{cls="";}if(_c4.className!=cls){_c4.className=cls;}};})();(function(d){d._loaders=[];d._loadNotifying=false;d._onto=function(arr,obj,fn){if(!fn){arr.push(obj);}else{if(fn){var _c6=(typeof fn=="string")?obj[fn]:fn;arr.push(function(){_c6.call(obj);});}}};dojo.ready=dojo.addOnLoad=function(obj,_c7){d._onto(d._loaders,obj,_c7);if(document.readyState==="complete"||(d._postLoad&&!d._loadNotifying)){d._callLoaded();}};dojo._callLoaded=function(){setTimeout("dojo.loaded();",0);};dojo.loaded=function(){d._loadNotifying=true;d._postLoad=true;var mll=d._loaders;d._loaders=[];for(var x=0;x<mll.length;x++){mll[x]();}d._loadNotifying=false;if(d._postLoad&&mll.length){d._callLoaded();}};dojo._initFired=false;dojo._loadInit=function(){if(!dojo._initFired){dojo._initFired=true;document.removeEventListener("DOMContentLoaded",dojo._loadInit,false);dojo._callLoaded();}};document.addEventListener("DOMContentLoaded",dojo._loadInit,false);window.addEventListener("load",dojo._loadInit,false);})(dojo);dojo.toJson=function(_c8){return JSON.stringify(_c8);};dojo.fromJson=function(_c9){return JSON.parse(_c9);};dojo.toArray=function(obj,_ca,_cb){return (_cb||[]).concat(Array.prototype.slice.call(obj,_ca||0));};dojo.clone=function(o){if(!o||typeof o!="object"||dojo.isFunction(o)){return o;}if(o.nodeType&&"cloneNode" in o){return o.cloneNode(true);}if(o instanceof Date){return new Date(o.getTime());}var r,i,l,s,_cc;if(dojo.isArray(o)){r=[];for(i=0,l=o.length;i<l;++i){if(i in o){r.push(dojo.clone(o[i]));}}}else{r=o.constructor?new o.constructor():{};}var _cd={};for(_cc in o){s=o[_cc];if(!(_cc in r)||(r[_cc]!==s&&(!(_cc in _cd)||_cd[_cc]!==s))){r[_cc]=dojo.clone(s);}}return r;};dojo.objectToQuery=function(map){var enc=encodeURIComponent;var _ce=[];var _cf={};for(var _d0 in map){var _d1=map[_d0];if(_d1!=_cf[_d0]){var _d2=enc(_d0)+"=";if(dojo.isArray(_d1)){for(var i=0;i<_d1.length;i++){_ce.push(_d2+enc(_d1[i]));}}else{_ce.push(_d2+enc(_d1));}}}return _ce.join("&");};(function(_d3){var cfg=_d3.config;_d3._xhrObj=function(){return new XMLHttpRequest();};_d3._isDocumentOk=function(_d4){var _d5=_d4.status||0,lp=location.protocol;return (_d5>=200&&_d5<300)||_d5==304||_d5==1223||(!_d5&&(lp=="file:"||lp=="chrome:"||lp=="app:"));};_d3._getText=function(uri,_d6){var _d7=_d3._xhrObj();_d7.open("GET",uri,false);try{_d7.send(null);if(!_d3._isDocumentOk(_d7)){var err=Error("Unable to load "+uri+" status:"+_d7.status);err.status=_d7.status;err.responseText=_d7.responseText;throw err;}}catch(e){if(_d6){return null;}throw e;}return _d7.responseText;};dojo._blockAsync=false;var _d8=_d3._contentHandlers=dojo.contentHandlers={text:function(xhr){return xhr.responseText;},json:function(xhr){return _d3.fromJson(xhr.responseText||null);}};dojo._ioSetArgs=function(_d9,_da,_db,_dc){var _dd={args:_d9,url:_d9.url};var _de=[{}];if(_d9.content){_de.push(_d9.content);}if(_d9.preventCache){_de.push({"dojo.preventCache":new Date().valueOf()});}_dd.query=_d3.objectToQuery(_d3.mixin.apply(null,_de));_dd.handleAs=_d9.handleAs||"text";var d=new _d3.Deferred(_da);d.addCallbacks(_db,function(_df){return _dc(_df,d);});var ld=_d9.load;if(ld&&_d3.isFunction(ld)){d.addCallback(function(_e0){return ld.call(_d9,_e0,_dd);});}var err=_d9.error;if(err&&_d3.isFunction(err)){d.addErrback(function(_e1){return err.call(_d9,_e1,_dd);});}var _e2=_d9.handle;if(_e2&&_d3.isFunction(_e2)){d.addBoth(function(_e3){return _e2.call(_d9,_e3,_dd);});}d.ioArgs=_dd;return d;};var _e4=function(dfd){dfd.canceled=true;var xhr=dfd.ioArgs.xhr;var _e5=typeof xhr.abort;if(_e5=="function"||_e5=="object"||_e5=="unknown"){xhr.abort();}var err=dfd.ioArgs.error;if(!err){err=new Error("xhr cancelled");err.dojoType="cancel";}return err;};var _e6=function(dfd){var ret=_d8[dfd.ioArgs.handleAs](dfd.ioArgs.xhr);return ret===undefined?null:ret;};var _e7=function(_e8,dfd){if(!dfd.ioArgs.args.failOk){}return _e8;};var _e9=null;var _ea=[];var _eb=0;var _ec=function(dfd){if(_eb<=0){_eb=0;}};var _ed=function(){var now=(new Date()).getTime();if(!_d3._blockAsync){for(var i=0,tif;i<_ea.length&&(tif=_ea[i]);i++){var dfd=tif.dfd;var _ee=function(){if(!dfd||dfd.canceled||!tif.validCheck(dfd)){_ea.splice(i--,1);_eb-=1;}else{if(tif.ioCheck(dfd)){_ea.splice(i--,1);tif.resHandle(dfd);_eb-=1;}else{if(dfd.startTime){if(dfd.startTime+(dfd.ioArgs.args.timeout||0)<now){_ea.splice(i--,1);var err=new Error("timeout exceeded");err.dojoType="timeout";dfd.errback(err);dfd.cancel();_eb-=1;}}}}};if(dojo.config.debugAtAllCosts){_ee.call(this);}else{try{_ee.call(this);}catch(e){dfd.errback(e);}}}}_ec(dfd);if(!_ea.length){clearInterval(_e9);_e9=null;return;}};dojo._ioCancelAll=function(){try{_d3.forEach(_ea,function(i){try{i.dfd.cancel();}catch(e){}});}catch(e){}};_d3._ioNotifyStart=function(dfd){};_d3._ioWatch=function(dfd,_ef,_f0,_f1){var _f2=dfd.ioArgs.args;if(_f2.timeout){dfd.startTime=(new Date()).getTime();}_ea.push({dfd:dfd,validCheck:_ef,ioCheck:_f0,resHandle:_f1});if(!_e9){_e9=setInterval(_ed,50);}if(_f2.sync){_ed();}};var _f3="application/x-www-form-urlencoded";var _f4=function(dfd){return dfd.ioArgs.xhr.readyState;};var _f5=function(dfd){return 4==dfd.ioArgs.xhr.readyState;};var _f6=function(dfd){var xhr=dfd.ioArgs.xhr;if(_d3._isDocumentOk(xhr)){dfd.callback(dfd);}else{var err=new Error("Unable to load "+dfd.ioArgs.url+" status:"+xhr.status);err.status=xhr.status;err.responseText=xhr.responseText;dfd.errback(err);}};dojo._ioAddQueryToUrl=function(_f7){if(_f7.query.length){_f7.url+=(_f7.url.indexOf("?")==-1?"?":"&")+_f7.query;_f7.query=null;}};dojo.xhr=function(_f8,_f9,_fa){var dfd=_d3._ioSetArgs(_f9,_e4,_e6,_e7);var _fb=dfd.ioArgs;var xhr=_fb.xhr=_d3._xhrObj(_fb.args);if(!xhr){dfd.cancel();return dfd;}if("postData" in _f9){_fb.query=_f9.postData;}else{if("putData" in _f9){_fb.query=_f9.putData;}else{if("rawBody" in _f9){_fb.query=_f9.rawBody;}else{if((arguments.length>2&&!_fa)||"POST|PUT".indexOf(_f8.toUpperCase())==-1){_d3._ioAddQueryToUrl(_fb);}}}}xhr.open(_f8,_fb.url,_f9.sync!==true,_f9.user||undefined,_f9.password||undefined);if(_f9.headers){for(var hdr in _f9.headers){if(hdr.toLowerCase()==="content-type"&&!_f9.contentType){_f9.contentType=_f9.headers[hdr];}else{if(_f9.headers[hdr]){xhr.setRequestHeader(hdr,_f9.headers[hdr]);}}}}xhr.setRequestHeader("Content-Type",_f9.contentType||_f3);if(!_f9.headers||!("X-Requested-With" in _f9.headers)){xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");}if(_f9.overrideMinmeType&&xhr.overrideMimeType){xhr.overrideMimeType(_f9.overrideMimeType);}_d3._ioNotifyStart(dfd);if(dojo.config.debugAtAllCosts){xhr.send(_fb.query);}else{try{xhr.send(_fb.query);}catch(e){_fb.error=e;dfd.cancel();}}_d3._ioWatch(dfd,_f4,_f5,_f6);xhr=null;return dfd;};dojo.xhrGet=function(_fc){return _d3.xhr("GET",_fc);};dojo.rawXhrPost=dojo.xhrPost=function(_fd){return _d3.xhr("POST",_fd,true);};dojo.rawXhrPut=dojo.xhrPut=function(_fe){return _d3.xhr("PUT",_fe,true);};dojo.xhrDelete=function(_ff){return _d3.xhr("DELETE",_ff);};}(dojo));dojo.attachScript=function(_100){var doc=dojo.doc;var _101=doc.createElement("script");_101.type="text/javascript";_101.src=_100.url;_101.charset="utf-8";return doc.getElementsByTagName("head")[0].appendChild(_101);};(function(){var _102=0;var _103={};dojo.jsonp=function(args){if(!args.url){throw new Error("dojo.jsonp: No URL specified.");}if(!args.jsonp){throw new Error("dojo.jsonp: No callback param specified.");}_102++;var _104="jsonp_callback_"+_102;var _105=args.timeout||3000;_103[_102]=setTimeout(function(){dojo.jsonp[_104]=function(){};clearTimeout(_103[_102]);if(args.error){args.error(null,{});}if(args.handle){args.handle(null,{});}},_105);args.url+="?"+args.jsonp+"=dojo.jsonp."+_104;dojo.jsonp[_104]=function(data){clearTimeout(_103[_102]);try{if(args.load){args.load(data,{});}}catch(e){if(args.error){args.error(null,{});}}if(args.handle){args.handle(data,{});}};if(args.content){args.url+="&"+dojo.objectToQuery(args.content);}return dojo.attachScript(args);};})();dojo.delegate=dojo._delegate=(function(){function TMP(){};return function(obj,_106){TMP.prototype=obj;var tmp=new TMP();TMP.prototype=null;if(_106){dojo._mixin(tmp,_106);}return tmp;};})();dojo.declare=function(_107,_108,_109){var dd=arguments.callee,_10a;if(dojo.isArray(_108)){_10a=_108;_108=_10a.shift();}if(_10a){dojo.forEach(_10a,function(m,i){if(!m){throw (_107+": mixin #"+i+" is null");}_108=dd._delegate(_108,m);});}var ctor=dd._delegate(_108);_109=_109||{};ctor.extend(_109);dojo.extend(ctor,{declaredClass:_107,_constructor:_109.constructor});ctor.prototype.constructor=ctor;return dojo.setObject(_107,ctor);};dojo.mixin(dojo.declare,{_delegate:function(base,_10b){var bp=(base||0).prototype,mp=(_10b||0).prototype,dd=dojo.declare;var ctor=dd._makeCtor();dojo.mixin(ctor,{superclass:bp,mixin:mp,extend:dd._extend});if(base){ctor.prototype=dojo._delegate(bp);}dojo.extend(ctor,dd._core,mp||0,{_constructor:null,preamble:null});ctor.prototype.constructor=ctor;ctor.prototype.declaredClass=(bp||0).declaredClass+"_"+(mp||0).declaredClass;return ctor;},_extend:function(_10c){var i,fn;for(i in _10c){if(dojo.isFunction(fn=_10c[i])&&!0[i]){fn.nom=i;fn.ctor=this;}}dojo.extend(this,_10c);},_makeCtor:function(){return function(){this._construct(arguments);};},_core:{_construct:function(args){var c=args.callee,s=c.superclass,ct=s&&s.constructor,m=c.mixin,mct=m&&m.constructor,a=args,ii,fn;if(a[0]){if(((fn=a[0].preamble))){a=fn.apply(this,a)||a;}}if((fn=c.prototype.preamble)){a=fn.apply(this,a)||a;}if(ct&&ct.apply){ct.apply(this,a);}if(mct&&mct.apply){mct.apply(this,a);}if((ii=c.prototype._constructor)){ii.apply(this,args);}if(this.constructor.prototype==c.prototype&&(ct=this.postscript)){ct.apply(this,args);}},_findMixin:function(_10d){var c=this.constructor,p,m;while(c){p=c.superclass;m=c.mixin;if(m==_10d||(m instanceof _10d.constructor)){return p;}if(m&&m._findMixin&&(m=m._findMixin(_10d))){return m;}c=p&&p.constructor;}},_findMethod:function(name,_10e,_10f,has){var p=_10f,c,m,f;do{c=p.constructor;m=c.mixin;if(m&&(m=this._findMethod(name,_10e,m,has))){return m;}if((f=p[name])&&(has==(f==_10e))){return p;}p=c.superclass;}while(p);return !has&&(p=this._findMixin(_10f))&&this._findMethod(name,_10e,p,has);},inherited:function(name,args,_110){var a=arguments;if(typeof a[0]!="string"){_110=args;args=name;name=args.callee.nom;}a=_110||args;var c=args.callee,p=this.constructor.prototype,fn,mp;if(this[name]!=c||p[name]==c){mp=(c.ctor||0).superclass||this._findMethod(name,c,p,true);if(!mp){throw (this.declaredClass+": inherited method \""+name+"\" mismatch");}p=this._findMethod(name,c,mp,false);}fn=p&&p[name];if(!fn){throw (mp.declaredClass+": inherited method \""+name+"\" not found");}return fn.apply(this,a);}}});(function(){var acme={trim:function(str){str=str.replace(/^\s+/,"");for(var i=str.length-1;i>=0;i--){if(/\S/.test(str.charAt(i))){str=str.substring(0,i+1);break;}}return str;},forEach:function(arr,_111,_112){if(!arr||!arr.length){return;}for(var i=0,l=arr.length;i<l;++i){_111.call(_112||window,arr[i],i,arr);}},byId:function(id,doc){if(typeof id=="string"){return (doc||document).getElementById(id);}else{return id;}},doc:document,NodeList:Array};var n=navigator;var dua=n.userAgent;var dav=n.appVersion;var tv=parseFloat(dav);acme.isOpera=(dua.indexOf("Opera")>=0)?tv:undefined;acme.isKhtml=(dav.indexOf("Konqueror")>=0)?tv:undefined;acme.isWebKit=parseFloat(dua.split("WebKit/")[1])||undefined;acme.isChrome=parseFloat(dua.split("Chrome/")[1])||undefined;var _113=Math.max(dav.indexOf("WebKit"),dav.indexOf("Safari"),0);if(_113&&!acme.isChrome){acme.isSafari=parseFloat(dav.split("Version/")[1]);if(!acme.isSafari||parseFloat(dav.substr(_113+7))<=419.3){acme.isSafari=2;}}if(document.all&&!acme.isOpera){acme.isIE=parseFloat(dav.split("MSIE ")[1])||undefined;}Array._wrap=function(arr){return arr;};(function(d){var trim=d.trim;var each=d.forEach;var qlc=d._NodeListCtor=d.NodeList;var _114=function(){return d.doc;};var _115=((d.isWebKit||d.isMozilla)&&((_114().compatMode)=="BackCompat"));var _116=!!_114().firstChild["children"]?"children":"childNodes";var _117=">~+";var _118=false;var _119=function(){return true;};var _11a=function(_11b){if(_117.indexOf(_11b.slice(-1))>=0){_11b+=" * ";}else{_11b+=" ";}var ts=function(s,e){return trim(_11b.slice(s,e));};var _11c=[];var _11d=-1,_11e=-1,_11f=-1,_120=-1,_121=-1,inId=-1,_122=-1,lc="",cc="",_123;var x=0,ql=_11b.length,_124=null,_125=null;var _126=function(){if(_122>=0){var tv=(_122==x)?null:ts(_122,x);_124[(_117.indexOf(tv)<0)?"tag":"oper"]=tv;_122=-1;}};var _127=function(){if(inId>=0){_124.id=ts(inId,x).replace(/\\/g,"");inId=-1;}};var _128=function(){if(_121>=0){_124.classes.push(ts(_121+1,x).replace(/\\/g,""));_121=-1;}};var _129=function(){_127();_126();_128();};var _12a=function(){_129();if(_120>=0){_124.pseudos.push({name:ts(_120+1,x)});}_124.loops=(_124.pseudos.length||_124.attrs.length||_124.classes.length);_124.oquery=_124.query=ts(_123,x);_124.otag=_124.tag=(_124["oper"])?null:(_124.tag||"*");if(_124.tag){_124.tag=_124.tag.toUpperCase();}if(_11c.length&&(_11c[_11c.length-1].oper)){_124.infixOper=_11c.pop();_124.query=_124.infixOper.query+" "+_124.query;}_11c.push(_124);_124=null;};for(;lc=cc,cc=_11b.charAt(x),x<ql;x++){if(lc=="\\"){continue;}if(!_124){_123=x;_124={query:null,pseudos:[],attrs:[],classes:[],tag:null,oper:null,id:null,getTag:function(){return (_118)?this.otag:this.tag;}};_122=x;}if(_11d>=0){if(cc=="]"){if(!_125.attr){_125.attr=ts(_11d+1,x);}else{_125.matchFor=ts((_11f||_11d+1),x);}var cmf=_125.matchFor;if(cmf){if((cmf.charAt(0)=="\"")||(cmf.charAt(0)=="'")){_125.matchFor=cmf.slice(1,-1);}}_124.attrs.push(_125);_125=null;_11d=_11f=-1;}else{if(cc=="="){var _12b=("|~^$*".indexOf(lc)>=0)?lc:"";_125.type=_12b+cc;_125.attr=ts(_11d+1,x-_12b.length);_11f=x+1;}}}else{if(_11e>=0){if(cc==")"){if(_120>=0){_125.value=ts(_11e+1,x);}_120=_11e=-1;}}else{if(cc=="#"){_129();inId=x+1;}else{if(cc=="."){_129();_121=x;}else{if(cc==":"){_129();_120=x;}else{if(cc=="["){_129();_11d=x;_125={};}else{if(cc=="("){if(_120>=0){_125={name:ts(_120+1,x),value:null};_124.pseudos.push(_125);}_11e=x;}else{if((cc==" ")&&(lc!=cc)){_12a();}}}}}}}}}return _11c;};var _12c=function(_12d,_12e){if(!_12d){return _12e;}if(!_12e){return _12d;}return function(){return _12d.apply(window,arguments)&&_12e.apply(window,arguments);};};var _12f=function(i,arr){var r=arr||[];if(i){r.push(i);}return r;};var _130=function(n){return (1==n.nodeType);};var _131="";var _132=function(elem,attr){if(!elem){return _131;}if(attr=="class"){return elem.className||_131;}if(attr=="for"){return elem.htmlFor||_131;}if(attr=="style"){return elem.style.cssText||_131;}return (_118?elem.getAttribute(attr):elem.getAttribute(attr,2))||_131;};var _133={"*=":function(attr,_134){return function(elem){return (_132(elem,attr).indexOf(_134)>=0);};},"^=":function(attr,_135){return function(elem){return (_132(elem,attr).indexOf(_135)==0);};},"$=":function(attr,_136){var tval=" "+_136;return function(elem){var ea=" "+_132(elem,attr);return (ea.lastIndexOf(_136)==(ea.length-_136.length));};},"~=":function(attr,_137){var tval=" "+_137+" ";return function(elem){var ea=" "+_132(elem,attr)+" ";return (ea.indexOf(tval)>=0);};},"|=":function(attr,_138){var _139=" "+_138+"-";return function(elem){var ea=" "+_132(elem,attr);return ((ea==_138)||(ea.indexOf(_139)==0));};},"=":function(attr,_13a){return function(elem){return (_132(elem,attr)==_13a);};}};var _13b=(typeof _114().firstChild.nextElementSibling=="undefined");var _13c=!_13b?"nextElementSibling":"nextSibling";var _13d=!_13b?"previousElementSibling":"previousSibling";var _13e=(_13b?_130:_119);var _13f=function(node){while(node=node[_13d]){if(_13e(node)){return false;}}return true;};var _140=function(node){while(node=node[_13c]){if(_13e(node)){return false;}}return true;};var _141=function(node){var root=node.parentNode;var i=0,tret=root[_116],ci=(node["_i"]||-1),cl=(root["_l"]||-1);if(!tret){return -1;}var l=tret.length;if(cl==l&&ci>=0&&cl>=0){return ci;}root["_l"]=l;ci=-1;for(var te=root["firstElementChild"]||root["firstChild"];te;te=te[_13c]){if(_13e(te)){te["_i"]=++i;if(node===te){ci=i;}}}return ci;};var _142=function(elem){return !((_141(elem))%2);};var _143=function(elem){return ((_141(elem))%2);};var _144={"checked":function(name,_145){return function(elem){return !!("checked" in elem?elem.checked:elem.selected);};},"first-child":function(){return _13f;},"last-child":function(){return _140;},"only-child":function(name,_146){return function(node){if(!_13f(node)){return false;}if(!_140(node)){return false;}return true;};},"empty":function(name,_147){return function(elem){var cn=elem.childNodes;var cnl=elem.childNodes.length;for(var x=cnl-1;x>=0;x--){var nt=cn[x].nodeType;if((nt===1)||(nt==3)){return false;}}return true;};},"contains":function(name,_148){var cz=_148.charAt(0);if(cz=="\""||cz=="'"){_148=_148.slice(1,-1);}return function(elem){return (elem.innerHTML.indexOf(_148)>=0);};},"not":function(name,_149){var p=_11a(_149)[0];var _14a={el:1};if(p.tag!="*"){_14a.tag=1;}if(!p.classes.length){_14a.classes=1;}var ntf=_14b(p,_14a);return function(elem){return (!ntf(elem));};},"nth-child":function(name,_14c){var pi=parseInt;if(_14c=="odd"){return _143;}else{if(_14c=="even"){return _142;}}if(_14c.indexOf("n")!=-1){var _14d=_14c.split("n",2);var pred=_14d[0]?((_14d[0]=="-")?-1:pi(_14d[0])):1;var idx=_14d[1]?pi(_14d[1]):0;var lb=0,ub=-1;if(pred>0){if(idx<0){idx=(idx%pred)&&(pred+(idx%pred));}else{if(idx>0){if(idx>=pred){lb=idx-idx%pred;}idx=idx%pred;}}}else{if(pred<0){pred*=-1;if(idx>0){ub=idx;idx=idx%pred;}}}if(pred>0){return function(elem){var i=_141(elem);return (i>=lb)&&(ub<0||i<=ub)&&((i%pred)==idx);};}else{_14c=idx;}}var _14e=pi(_14c);return function(elem){return (_141(elem)==_14e);};}};var _14f=(d.isIE)?function(cond){var clc=cond.toLowerCase();if(clc=="class"){cond="className";}return function(elem){return (_118?elem.getAttribute(cond):elem[cond]||elem[clc]);};}:function(cond){return function(elem){return (elem&&elem.getAttribute&&elem.hasAttribute(cond));};};var _14b=function(_150,_151){if(!_150){return _119;}_151=_151||{};var ff=null;if(!("el" in _151)){ff=_12c(ff,_130);}if(!("tag" in _151)){if(_150.tag!="*"){ff=_12c(ff,function(elem){return (elem&&(elem.tagName==_150.getTag()));});}}if(!("classes" in _151)){each(_150.classes,function(_152,idx,arr){var re=new RegExp("(?:^|\\s)"+_152+"(?:\\s|$)");ff=_12c(ff,function(elem){return re.test(elem.className);});ff.count=idx;});}if(!("pseudos" in _151)){each(_150.pseudos,function(_153){var pn=_153.name;if(_144[pn]){ff=_12c(ff,_144[pn](pn,_153.value));}});}if(!("attrs" in _151)){each(_150.attrs,function(attr){var _154;var a=attr.attr;if(attr.type&&_133[attr.type]){_154=_133[attr.type](a,attr.matchFor);}else{if(a.length){_154=_14f(a);}}if(_154){ff=_12c(ff,_154);}});}if(!("id" in _151)){if(_150.id){ff=_12c(ff,function(elem){return (!!elem&&(elem.id==_150.id));});}}if(!ff){if(!("default" in _151)){ff=_119;}}return ff;};var _155=function(_156){return function(node,ret,bag){while(node=node[_13c]){if(_13b&&(!_130(node))){continue;}if((!bag||_157(node,bag))&&_156(node)){ret.push(node);}break;}return ret;};};var _158=function(_159){return function(root,ret,bag){var te=root[_13c];while(te){if(_13e(te)){if(bag&&!_157(te,bag)){break;}if(_159(te)){ret.push(te);}}te=te[_13c];}return ret;};};var _15a=function(_15b){_15b=_15b||_119;return function(root,ret,bag){var te,x=0,tret=root[_116];while(te=tret[x++]){if(_13e(te)&&(!bag||_157(te,bag))&&(_15b(te,x))){ret.push(te);}}return ret;};};var _15c=function(node,root){var pn=node.parentNode;while(pn){if(pn==root){break;}pn=pn.parentNode;}return !!pn;};var _15d={};var _15e=function(_15f){var _160=_15d[_15f.query];if(_160){return _160;}var io=_15f.infixOper;var oper=(io?io.oper:"");var _161=_14b(_15f,{el:1});var qt=_15f.tag;var _162=("*"==qt);var ecs=_114()["getElementsByClassName"];if(!oper){if(_15f.id){_161=(!_15f.loops&&_162)?_119:_14b(_15f,{el:1,id:1});_160=function(root,arr){var te=d.byId(_15f.id,(root.ownerDocument||root));if(!te||!_161(te)){return;}if(9==root.nodeType){return _12f(te,arr);}else{if(_15c(te,root)){return _12f(te,arr);}}};}else{if(ecs&&/\{\s*\[native code\]\s*\}/.test(String(ecs))&&_15f.classes.length&&!_115){_161=_14b(_15f,{el:1,classes:1,id:1});var _163=_15f.classes.join(" ");_160=function(root,arr,bag){var ret=_12f(0,arr),te,x=0;var tret=root.getElementsByClassName(_163);while((te=tret[x++])){if(_161(te,root)&&_157(te,bag)){ret.push(te);}}return ret;};}else{if(!_162&&!_15f.loops){_160=function(root,arr,bag){var ret=_12f(0,arr),te,x=0;var tret=root.getElementsByTagName(_15f.getTag());while((te=tret[x++])){if(_157(te,bag)){ret.push(te);}}return ret;};}else{_161=_14b(_15f,{el:1,tag:1,id:1});_160=function(root,arr,bag){var ret=_12f(0,arr),te,x=0;var tret=root.getElementsByTagName(_15f.getTag());while((te=tret[x++])){if(_161(te,root)&&_157(te,bag)){ret.push(te);}}return ret;};}}}}else{var _164={el:1};if(_162){_164.tag=1;}_161=_14b(_15f,_164);if("+"==oper){_160=_155(_161);}else{if("~"==oper){_160=_158(_161);}else{if(">"==oper){_160=_15a(_161);}}}}return _15d[_15f.query]=_160;};var _165=function(root,_166){var _167=_12f(root),qp,x,te,qpl=_166.length,bag,ret;for(var i=0;i<qpl;i++){ret=[];qp=_166[i];x=_167.length-1;if(x>0){bag={};ret.nozip=true;}var gef=_15e(qp);for(var j=0;(te=_167[j]);j++){gef(te,ret,bag);}if(!ret.length){break;}_167=ret;}return ret;};var _168={},_169={};var _16a=function(_16b){var _16c=_11a(trim(_16b));if(_16c.length==1){var tef=_15e(_16c[0]);return function(root){var r=tef(root,new qlc());if(r){r.nozip=true;}return r;};}return function(root){return _165(root,_16c);};};var nua=navigator.userAgent;var wk="WebKit/";var _16d=(d.isWebKit&&(nua.indexOf(wk)>0)&&(parseFloat(nua.split(wk)[1])>528));var _16e=d.isIE?"commentStrip":"nozip";var qsa="querySelectorAll";var _16f=(!!_114()[qsa]&&(!d.isSafari||(d.isSafari>3.1)||_16d));var _170=/n\+\d|([^ ])?([>~+])([^ =])?/g;var _171=function(_172,pre,ch,post){return ch?(pre?pre+" ":"")+ch+(post?" "+post:""):_172;};var _173=function(_174,_175){_174=_174.replace(_170,_171);if(_16f){var _176=_169[_174];if(_176&&!_175){return _176;}}var _177=_168[_174];if(_177){return _177;}var qcz=_174.charAt(0);var _178=(-1==_174.indexOf(" "));if((_174.indexOf("#")>=0)&&(_178)){_175=true;}var _179=(_16f&&(!_175)&&(_117.indexOf(qcz)==-1)&&(!d.isIE||(_174.indexOf(":")==-1))&&(!(_115&&(_174.indexOf(".")>=0)))&&(_174.indexOf(":contains")==-1)&&(_174.indexOf(":checked")==-1)&&(_174.indexOf("|=")==-1));if(_179){var tq=(_117.indexOf(_174.charAt(_174.length-1))>=0)?(_174+" *"):_174;return _169[_174]=function(root){try{if(!((9==root.nodeType)||_178)){throw "";}var r=root[qsa](tq);r[_16e]=true;return r;}catch(e){return _173(_174,true)(root);}};}else{var _17a=_174.split(/\s*,\s*/);return _168[_174]=((_17a.length<2)?_16a(_174):function(root){var _17b=0,ret=[],tp;while((tp=_17a[_17b++])){ret=ret.concat(_16a(tp)(root));}return ret;});}};var _17c=0;var _17d=d.isIE?function(node){if(_118){return (node.getAttribute("_uid")||node.setAttribute("_uid",++_17c)||_17c);}else{return node.uniqueID;}}:function(node){return (node._uid||(node._uid=++_17c));};var _157=function(node,bag){if(!bag){return 1;}var id=_17d(node);if(!bag[id]){return bag[id]=1;}return 0;};var _17e="_zipIdx";var _17f=function(arr){if(arr&&arr.nozip){return (qlc._wrap)?qlc._wrap(arr):arr;}var ret=new qlc();if(!arr||!arr.length){return ret;}if(arr[0]){ret.push(arr[0]);}if(arr.length<2){return ret;}_17c++;if(d.isIE&&_118){var _180=_17c+"";arr[0].setAttribute(_17e,_180);for(var x=1,te;te=arr[x];x++){if(arr[x].getAttribute(_17e)!=_180){ret.push(te);}te.setAttribute(_17e,_180);}}else{if(d.isIE&&arr.commentStrip){try{for(var x=1,te;te=arr[x];x++){if(_130(te)){ret.push(te);}}}catch(e){}}else{if(arr[0]){arr[0][_17e]=_17c;}for(var x=1,te;te=arr[x];x++){if(arr[x][_17e]!=_17c){ret.push(te);}te[_17e]=_17c;}}}return ret;};d.query=function(_181,root){qlc=d._NodeListCtor;if(!_181){return new qlc();}if(_181.constructor==qlc){return _181;}if(typeof _181!="string"){return new qlc(_181);}if(typeof root=="string"){root=d.byId(root);if(!root){return new qlc();}}root=root||_114();var od=root.ownerDocument||root.documentElement;_118=(root.contentType&&root.contentType=="application/xml")||(d.isOpera&&(root.doctype||od.toString()=="[object XMLDocument]"))||(!!od)&&(d.isIE?od.xml:(root.xmlVersion||od.xmlVersion));var r=_173(_181)(root);if(r&&r.nozip&&!qlc._wrap){return r;}return _17f(r);};d.query.pseudos=_144;d._filterQueryResult=function(_182,_183){var _184=new d._NodeListCtor();var _185=_14b(_11a(_183)[0]);for(var x=0,te;te=_182[x];x++){if(_185(te)){_184.push(te);}}return _184;};})(acme);dojo.query=dojo._query=acme.query;})();