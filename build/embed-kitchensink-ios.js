var embed,dojo;embed=dojo={};embed.config={};embed.global=this;embed.doc=this.document||null;embed.body=function(){var _1=embed;return _1.doc&&_1.doc.body;};embed.version="0.1";["indexOf","lastIndexOf","forEach","map","some","every","filter"].forEach(function(_2,_3){dojo[_2]=function(_4,_5,_6){if((_3>1)&&(typeof _5=="string")){_5=new Function("item","index","array",_5);}return Array.prototype[_2].call(_4,_5,_6);};});dojo.isString=function(it){return (typeof it=="string"||it instanceof String);};dojo.isArray=function(it){return it&&(it instanceof Array||typeof it=="array");};dojo.isFunction=(function(){var _7=function(it){var t=typeof it;return it&&(t=="function"||it instanceof Function)&&!it.nodeType;};return dojo.isSafari?function(it){if(typeof it=="function"&&it=="[object NodeList]"){return false;}return _7(it);}:_7;})();dojo.isObject=function(it){return it!==undefined&&(it===null||typeof it=="object"||dojo.isArray(it)||dojo.isFunction(it));};dojo.isArrayLike=function(it){var d=dojo;return it&&it!==undefined&&!d.isString(it)&&!d.isFunction(it)&&!(it.tagName&&it.tagName.toLowerCase()=="form")&&(d.isArray(it)||isFinite(it.length));};dojo.isAlien=function(it){return it&&!dojo.isFunction(it)&&/\{\s*\[native code\]\s*\}/.test(String(it));};dojo.isNumeric=function(n){return n==parseFloat(n);};dojo.isNumber=function(n){return typeof n=="number"||n instanceof Number;};dojo._hitchArgs=function(_8,_9){var _a=dojo.toArray(arguments,2);var _b=dojo.isString(_9);return function(){var _c=dojo.toArray(arguments);var f=_b?(_8||dojo.global)[_9]:_9;return f&&f.apply(_8||this,_a.concat(_c));};};dojo.hitch=function(_d,_e){if(arguments.length>2){return dojo._hitchArgs.apply(dojo,arguments);}if(!_e){_e=_d;_d=null;}if(dojo.isString(_e)){_d=_d||dojo.global;if(!_d[_e]){throw (["dojo.hitch: scope[\"",_e,"\"] is null (scope=\"",_d,"\")"].join(""));}return function(){return _d[_e].apply(_d,arguments||[]);};}return !_d?_e:function(){return _e.apply(_d,arguments||[]);};};dojo._listener={getDispatcher:function(){return function(){var ap=Array.prototype,c=arguments.callee,ls=c._listeners,t=c.target;var r=t&&t.apply(this,arguments);var i,_f;_f=[].concat(ls);for(i in _f){if(!(i in ap)){_f[i].apply(this,arguments);}}return r;};},add:function(_10,_11,_12){_10=_10||dojo.global;var f=_10[_11];if(!f||!f._listeners){var d=dojo._listener.getDispatcher();d.target=f;d._listeners=[];f=_10[_11]=d;}return f._listeners.push(_12);},remove:function(_13,_14,_15){var f=(_13||dojo.global)[_14];if(f&&f._listeners&&_15--){delete f._listeners[_15];}}};dojo.connect=dojo.on=function(obj,_16,_17,_18,_19){var a=arguments,_1a=[],i=0;_1a.push(dojo.isString(a[0])?null:a[i++],a[i++]);var a1=a[i+1];_1a.push(dojo.isString(a1)||dojo.isFunction(a1)?a[i++]:null,a[i++]);for(var l=a.length;i<l;i++){_1a.push(a[i]);}return dojo._connect.apply(this,_1a);};dojo._connect=function(obj,_1b,_1c,_1d){var l=dojo._listener,h=l.add(obj,_1b,dojo.hitch(_1c,_1d));return [obj,_1b,h,l];};dojo.disconnect=function(_1e){if(_1e&&_1e[0]!==undefined){dojo._disconnect.apply(this,_1e);delete _1e[0];}};dojo._disconnect=function(obj,_1f,_20,_21){_21.remove(obj,_1f,_20);};(function(){var del=(dojo._event_listener={add:function(_22,_23,fp){if(!_22){return;}_23=del._normalizeEventName(_23);_22.addEventListener(_23,fp,false);return fp;},remove:function(_24,_25,_26){if(_24){_25=del._normalizeEventName(_25);_24.removeEventListener(_25,_26,false);}},_normalizeEventName:function(_27){return _27.slice(0,2)=="on"?_27.slice(2):_27;}});dojo.fixEvent=function(evt,_28){return del._fixEvent(evt,_28);};dojo.stopEvent=function(evt){evt.preventDefault();evt.stopPropagation();};dojo._connect=function(obj,_29,_2a,_2b,_2c){var _2d=obj&&(obj.nodeType||obj.attachEvent||obj.addEventListener);var lid=_2d?1:0,l=[dojo._listener,del][lid];var h=l.add(obj,_29,dojo.hitch(_2a,_2b));return [obj,_29,h,lid];};dojo._disconnect=function(obj,_2e,_2f,_30){([dojo._listener,del][_30]).remove(obj,_2e,_2f);};})();dojo._topics={};dojo.subscribe=function(_31,_32,_33){return [_31,dojo._listener.add(dojo._topics,_31,dojo.hitch(_32,_33))];};dojo.unsubscribe=function(_34){if(_34){dojo._listener.remove(dojo._topics,_34[0],_34[1]);}};dojo.publish=function(_35,_36){var f=dojo._topics[_35];if(f){f.apply(this,_36||[]);}};dojo.connectPublisher=function(_37,obj,_38){var pf=function(){dojo.publish(_37,arguments);};return _38?dojo.connect(obj,_38,pf):dojo.connect(obj,pf);};(function(d){(function(){dojo.__mutator=function(){};var _39=Object.freeze||function(){};dojo.Promise=function(_3a){var _3b,_3c,_3d,_3e,_3f;var _40=this.promise={};function _41(_42){if(_3c){throw new Error("This deferred has already been resolved");}_3b=_42;_3c=true;_43();};function _43(){var _44;while(!_44&&_3f){var _45=_3f;_3f=_3f.next;if(_44=(_45.progress==dojo.__mutator)){_3c=false;}var _46=(_3d?_45.error:_45.resolved);if(_46){try{var _47=_46(_3b);if(_47&&typeof _47.then==="function"){_47.then(dojo.hitch(_45.deferred,"resolve"),dojo.hitch(_45.deferred,"reject"));continue;}var _48=_44&&_47===undefined;_45.deferred[_48&&_3d?"reject":"resolve"](_48?_3b:_47);}catch(e){_45.deferred.reject(e);}}else{if(_3d){_45.deferred.reject(_3b);}else{_45.deferred.resolve(_3b);}}}};this.resolve=function(_49){this.fired=0;this.results=[_49,null];_41(_49);};this.reject=function(_4a){_3d=true;this.fired=1;_41(_4a);this.results=[null,_4a];if(!_4a||_4a.log!==false){(dojo.config.deferredOnError||function(x){})(_4a);}};this.progress=function(_4b){var _4c=_3f;while(_4c){var _4d=_4c.progress;_4d&&_4d(_4b);_4c=_4c.next;}};this.then=_40.then=function(_4e,_4f,_50){var _51=_50==dojo.__mutator?this:new dojo.Promise(_40.cancel);var _52={resolved:_4e,error:_4f,progress:_50,deferred:_51};if(_3f){_3e=_3e.next=_52;}else{_3f=_3e=_52;}if(_3c){_43();}return _51.promise;};var _53=this;this.cancel=_40.cancel=function(){if(!_3c){var _54=_3a&&_3a(_53);if(!_3c){if(!(_54 instanceof Error)){_54=new Error(_54);}_54.log=false;_53.reject(_54);}}};_39(_40);};})();})(dojo);dojo.when=function(_55,_56,_57,_58){if(_55&&typeof _55.then==="function"){return _55.then(_56,_57,_58);}return _56(_55);};(function(d){var _59={},_5a;for(var i in {toString:1}){_5a=[];break;}dojo._extraNames=_5a=_5a||["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString"];d._mixin=function(_5b,_5c){var _5d,s,i=0,l=_5a.length;for(_5d in _5c){s=_5c[_5d];if(s!==_59[_5d]&&s!==_5b[_5d]){_5b[_5d]=s;}}if(l&&_5c){for(;i<l;++i){_5d=_5a[i];s=_5c[_5d];if(s!==_59[_5d]&&s!==_5b[_5d]){_5b[_5d]=s;}}}return _5b;};dojo.mixin=function(obj,_5e){if(!obj){obj={};}for(var i=1,l=arguments.length;i<l;i++){d._mixin(obj,arguments[i]);}return obj;};dojo.safeMixin=function(_5f,_60){var _61,t,i=0,l=d._extraNames.length;var op=Object.prototype,_62=op.toString,_63="constructor";for(_61 in _60){t=_60[_61];if((t!==op[_61]||!(_61 in op))&&_61!=_63){if(_62.call(t)=="[object Function]"){t.nom=_61;}_5f[_61]=t;}}for(;i<l;++i){_61=d._extraNames[i];t=_60[_61];if((t!==op[_61]||!(_61 in op))&&_61!=_63){if(_62.call(t)=="[object Function]"){t.nom=_61;}_5f[_61]=t;}}return _5f;};}(dojo));dojo.extend=function(_64,_65){for(var i=1,l=arguments.length;i<l;i++){dojo._mixin(_64.prototype,arguments[i]);}return _64;};dojo.Deferred=dojo.Promise;dojo.extend(dojo.Deferred,{callback:function(_66){this.resolve(_66);},errback:function(_67){this.reject(_67);},addCallbacks:function(_68,_69){this.then(_68,_69,dojo.__mutator);return this;},addCallback:function(_6a){return this.addCallbacks(dojo.hitch.apply(dojo,arguments));},addErrback:function(_6b){return this.addCallbacks(null,dojo.hitch.apply(dojo,arguments));},addBoth:function(_6c){var _6d=dojo.hitch.apply(dojo,arguments);return this.addCallbacks(_6d,_6d);},fired:-1});dojo.byId=function(id,doc){return (typeof id=="string")?(doc||document).getElementById(id):id;};(function(d){var _6e=null,_6f;d.destroy=function(_70){_70=dojo.byId(_70);try{var doc=_70.ownerDocument;if(!_6e||_6f!=doc){_6e=doc.createElement("div");_6f=doc;}_6e.appendChild(_70.parentNode?_70.parentNode.removeChild(_70):_70);_6e.innerHTML="";}catch(e){}};})(dojo);(function(d){d._getComputedStyle=function(_71){return _71.nodeType==1?_71.ownerDocument.defaultView.getComputedStyle(_71,null):{};};var _72="cssFloat",_73={"cssFloat":_72,"styleFloat":_72,"float":_72};d._style=function(_74,_75,_76){var n=dojo.byId(_74),l=arguments.length;_75=_73[_75]||_75;if(l==3){return n.style[_75]=_76;}var s=d._getComputedStyle(n);if(l==2&&typeof _75!="string"){for(var x in _75){d._style(_74,x,_75[x]);}return s;}return (l==1)?s:parseFloat(s[_75]||n.style[_75])||s[_75];};})(dojo);dojo.getComputedStyle=dojo._getComputedStyle;dojo.style=dojo._style;(function(d){var _77={"class":"className","for":"htmlFor",tabindex:"tabIndex",readonly:"readOnly",colspan:"colSpan",frameborder:"frameBorder",rowspan:"rowSpan",valuetype:"valueType"},_78={classname:"class",htmlfor:"for",tabindex:"tabIndex",readonly:"readOnly"},_79={innerHTML:1,className:1,htmlFor:0,value:1};var _7a=function(_7b){return _78[_7b.toLowerCase()]||_7b;};var _7c=function(_7d,_7e){var _7f=_7d.getAttributeNode&&_7d.getAttributeNode(_7e);return _7f&&_7f.specified;};d.hasAttr=function(_80,_81){var lc=_81.toLowerCase();return _79[_77[lc]||_81]||_7c(d.byId(_80),_78[lc]||_81);};var _82={},_83=0,_84="_attrid",_85={col:1,colgroup:1,table:1,tbody:1,tfoot:1,thead:1,tr:1,title:1};d.attr=function(_86,_87,_88){_86=d.byId(_86);var _89=arguments.length,_8a;if(_89==2&&typeof _87!="string"){for(var x in _87){d.attr(_86,x,_87[x]);}return _86;}var lc=_87.toLowerCase(),_8b=_77[lc]||_87,_8c=_79[_8b],_8d=_78[lc]||_87;if(_89==3){do{if(_8b=="style"&&typeof _88!="string"){d.style(_86,_88);break;}if(_8b=="innerHTML"){_86[_8b]=_88;break;}if(d.isFunction(_88)){var _8e=d.attr(_86,_84);if(!_8e){_8e=_83++;d.attr(_86,_84,_8e);}if(!_82[_8e]){_82[_8e]={};}var h=_82[_8e][_8b];if(h){d.disconnect(h);}else{try{delete _86[_8b];}catch(e){}}_82[_8e][_8b]=d.connect(_86,_8b,_88);break;}if(_8c||typeof _88=="boolean"){_86[_8b]=_88;break;}_86.setAttribute(_8d,_88);}while(false);return _86;}_88=_86[_8b];if(_8c&&typeof _88!="undefined"){return _88;}if(_8b!="href"&&(typeof _88=="boolean"||d.isFunction(_88))){return _88;}return _7c(_86,_8d)?_86.getAttribute(_8d):null;};d.removeAttr=function(_8f,_90){d.byId(_8f).removeAttribute(_7a(_90));};})(dojo);(function(d){var _91=d.byId;var _92={option:["select"],tbody:["table"],thead:["table"],tfoot:["table"],tr:["table","tbody"],td:["table","tbody","tr"],th:["table","thead","tr"],legend:["fieldset"],caption:["table"],colgroup:["table"],col:["table","colgroup"],li:["ul"]},_93=/<\s*([\w\:]+)/,_94={},_95=0,_96="__"+d._scopeName+"ToDomId";for(var _97 in _92){var tw=_92[_97];tw.pre=_97=="option"?"<select multiple=\"multiple\">":"<"+tw.join("><")+">";tw.post="</"+tw.reverse().join("></")+">";}d._toDom=function(_98,doc){doc=doc||d.doc;var _99=doc[_96];if(!_99){doc[_96]=_99=++_95+"";_94[_99]=doc.createElement("div");}_98+="";var _9a=_98.match(_93),tag=_9a?_9a[1].toLowerCase():"",_9b=_94[_99],_9c,i,fc,df;if(_9a&&_92[tag]){_9c=_92[tag];_9b.innerHTML=_9c.pre+_98+_9c.post;for(i=_9c.length;i;--i){_9b=_9b.firstChild;}}else{_9b.innerHTML=_98;}if(_9b.childNodes.length==1){return _9b.removeChild(_9b.firstChild);}df=doc.createDocumentFragment();while(fc=_9b.firstChild){df.appendChild(fc);}return df;};d._docScroll=function(){var n=d.global;return "pageXOffset" in n?{x:n.pageXOffset,y:n.pageYOffset}:(n=d.doc.documentElement,n.clientHeight?{x:n.scrollLeft,y:n.scrollTop}:(n=d.body(),{x:n.scrollLeft||0,y:n.scrollTop||0}));};var _9d=function(_9e,ref){var _9f=ref.parentNode;if(_9f){_9f.insertBefore(_9e,ref);}};var _a0=function(_a1,ref){var _a2=ref.parentNode;if(_a2){if(_a2.lastChild==ref){_a2.appendChild(_a1);}else{_a2.insertBefore(_a1,ref.nextSibling);}}};d.place=function(_a3,_a4,_a5){_a4=_91(_a4);if(typeof _a3=="string"){_a3=_a3.charAt(0)=="<"?d._toDom(_a3,_a4.ownerDocument):_91(_a3);}if(typeof _a5=="number"){var cn=_a4.childNodes;if(!cn.length||cn.length<=_a5){_a4.appendChild(_a3);}else{_9d(_a3,cn[_a5<0?0:_a5]);}}else{switch(_a5){case "before":_9d(_a3,_a4);break;case "after":_a0(_a3,_a4);break;case "replace":_a4.parentNode.replaceChild(_a3,_a4);break;case "only":d.empty(_a4);_a4.appendChild(_a3);break;case "first":if(_a4.firstChild){_9d(_a3,_a4.firstChild);break;}default:_a4.appendChild(_a3);}}return _a3;};d.create=function(tag,_a6,_a7,pos){var doc=d.doc;if(_a7){_a7=_91(_a7);doc=_a7.ownerDocument;}if(typeof tag=="string"){tag=doc.createElement(tag);}if(_a6){for(var _a8 in _a6){switch(_a8){case "class":tag.className=_a6[_a8];break;default:tag[_a8]=_a6[_a8];}}}if(_a7){d.place(tag,_a7,pos);}return tag;};d.empty=function(_a9){_91(_a9).innerHTML="";};})(dojo);dojo._getProp=function(_aa,_ab,_ac){var obj=_ac||dojo.global;for(var i=0,p;obj&&(p=_aa[i]);i++){obj=(p in obj?obj[p]:(_ab?obj[p]={}:undefined));}return obj;};dojo.setObject=function(_ad,_ae,_af){var _b0=_ad.split("."),p=_b0.pop(),obj=dojo._getProp(_b0,true,_af);return obj&&p?(obj[p]=_ae):undefined;};dojo.getObject=function(_b1,_b2,_b3){return dojo._getProp(_b1.split("."),_b2,_b3);};dojo.trim=String.prototype.trim?function(str){return str.trim();}:function(str){return str.replace(/^\s\s*/,"").replace(/\s\s*$/,"");};var _pattern=/\{([^\}]+)\}/g;dojo.replace=function(_b4,map,_b5){return _b4.replace(_b5||_pattern,dojo.isFunction(map)?map:function(_b6,k){return dojo.getObject(k,false,map);});};dojo.hasClass=function(_b7,_b8){return ((" "+dojo.byId(_b7).className+" ").indexOf(" "+_b8+" ")>=0);};dojo.toggleClass=function(_b9,_ba,_bb){if(_bb===undefined){_bb=!dojo.hasClass(_b9,_ba);}dojo[_bb?"addClass":"removeClass"](_b9,_ba);};(function(){var _bc=/\s+/;var _bd=function(s){if(typeof s=="string"||s instanceof String){if(s.indexOf(" ")<0){return [s];}else{return dojo.trim(s).split(_bc);}}return s;};dojo.addClass=function(_be,_bf){_be=dojo.byId(_be);_bf=_bd(_bf);var cls=" "+_be.className+" ";for(var i=0,len=_bf.length,c;i<len;++i){c=_bf[i];if(c&&cls.indexOf(" "+c+" ")<0){cls+=c+" ";}}_be.className=dojo.trim(cls);};dojo.removeClass=function(_c0,_c1){_c0=dojo.byId(_c0);var cls;if(_c1!==undefined){_c1=_bd(_c1);cls=" "+_c0.className+" ";for(var i=0,len=_c1.length;i<len;++i){cls=cls.replace(" "+_c1[i]+" "," ");}cls=dojo.trim(cls);}else{cls="";}if(_c0.className!=cls){_c0.className=cls;}};})();(function(d){d._loaders=[];d._loadNotifying=false;d._onto=function(arr,obj,fn){if(!fn){arr.push(obj);}else{if(fn){var _c2=(typeof fn=="string")?obj[fn]:fn;arr.push(function(){_c2.call(obj);});}}};dojo.ready=dojo.addOnLoad=function(obj,_c3){d._onto(d._loaders,obj,_c3);if(document.readyState==="complete"||(d._postLoad&&!d._loadNotifying)){d._callLoaded();}};dojo._callLoaded=function(){setTimeout("dojo.loaded();",0);};dojo.loaded=function(){d._loadNotifying=true;d._postLoad=true;var mll=d._loaders;d._loaders=[];for(var x=0;x<mll.length;x++){mll[x]();}d._loadNotifying=false;if(d._postLoad&&mll.length){d._callLoaded();}};dojo._initFired=false;dojo._loadInit=function(){if(!dojo._initFired){dojo._initFired=true;document.removeEventListener("DOMContentLoaded",dojo._loadInit,false);dojo._callLoaded();}};document.addEventListener("DOMContentLoaded",dojo._loadInit,false);window.addEventListener("load",dojo._loadInit,false);})(dojo);dojo.toJson=function(_c4){return JSON.stringify(_c4);};dojo.fromJson=function(_c5){return JSON.parse(_c5);};dojo.toArray=function(obj,_c6,_c7){return (_c7||[]).concat(Array.prototype.slice.call(obj,_c6||0));};dojo.clone=function(o){if(!o||typeof o!="object"||dojo.isFunction(o)){return o;}if(o.nodeType&&"cloneNode" in o){return o.cloneNode(true);}if(o instanceof Date){return new Date(o.getTime());}var r,i,l,s,_c8;if(dojo.isArray(o)){r=[];for(i=0,l=o.length;i<l;++i){if(i in o){r.push(dojo.clone(o[i]));}}}else{r=o.constructor?new o.constructor():{};}var _c9={};for(_c8 in o){s=o[_c8];if(!(_c8 in r)||(r[_c8]!==s&&(!(_c8 in _c9)||_c9[_c8]!==s))){r[_c8]=dojo.clone(s);}}return r;};dojo.objectToQuery=function(map){var enc=encodeURIComponent;var _ca=[];var _cb={};for(var _cc in map){var _cd=map[_cc];if(_cd!=_cb[_cc]){var _ce=enc(_cc)+"=";if(dojo.isArray(_cd)){for(var i=0;i<_cd.length;i++){_ca.push(_ce+enc(_cd[i]));}}else{_ca.push(_ce+enc(_cd));}}}return _ca.join("&");};(function(_cf){var cfg=_cf.config;_cf._xhrObj=function(){return new XMLHttpRequest();};_cf._isDocumentOk=function(_d0){var _d1=_d0.status||0,lp=location.protocol;return (_d1>=200&&_d1<300)||_d1==304||_d1==1223||(!_d1&&(lp=="file:"||lp=="chrome:"||lp=="app:"));};_cf._getText=function(uri,_d2){var _d3=_cf._xhrObj();_d3.open("GET",uri,false);try{_d3.send(null);if(!_cf._isDocumentOk(_d3)){var err=Error("Unable to load "+uri+" status:"+_d3.status);err.status=_d3.status;err.responseText=_d3.responseText;throw err;}}catch(e){if(_d2){return null;}throw e;}return _d3.responseText;};dojo._blockAsync=false;var _d4=_cf._contentHandlers=dojo.contentHandlers={text:function(xhr){return xhr.responseText;},json:function(xhr){return _cf.fromJson(xhr.responseText||null);}};dojo._ioSetArgs=function(_d5,_d6,_d7,_d8){var _d9={args:_d5,url:_d5.url};var _da=[{}];if(_d5.content){_da.push(_d5.content);}if(_d5.preventCache){_da.push({"dojo.preventCache":new Date().valueOf()});}_d9.query=_cf.objectToQuery(_cf.mixin.apply(null,_da));_d9.handleAs=_d5.handleAs||"text";var d=new _cf.Deferred(_d6);d.addCallbacks(_d7,function(_db){return _d8(_db,d);});var ld=_d5.load;if(ld&&_cf.isFunction(ld)){d.addCallback(function(_dc){return ld.call(_d5,_dc,_d9);});}var err=_d5.error;if(err&&_cf.isFunction(err)){d.addErrback(function(_dd){return err.call(_d5,_dd,_d9);});}var _de=_d5.handle;if(_de&&_cf.isFunction(_de)){d.addBoth(function(_df){return _de.call(_d5,_df,_d9);});}d.ioArgs=_d9;return d;};var _e0=function(dfd){dfd.canceled=true;var xhr=dfd.ioArgs.xhr;var _e1=typeof xhr.abort;if(_e1=="function"||_e1=="object"||_e1=="unknown"){xhr.abort();}var err=dfd.ioArgs.error;if(!err){err=new Error("xhr cancelled");err.dojoType="cancel";}return err;};var _e2=function(dfd){var ret=_d4[dfd.ioArgs.handleAs](dfd.ioArgs.xhr);return ret===undefined?null:ret;};var _e3=function(_e4,dfd){if(!dfd.ioArgs.args.failOk){}return _e4;};var _e5=null;var _e6=[];var _e7=0;var _e8=function(dfd){if(_e7<=0){_e7=0;}};var _e9=function(){var now=(new Date()).getTime();if(!_cf._blockAsync){for(var i=0,tif;i<_e6.length&&(tif=_e6[i]);i++){var dfd=tif.dfd;var _ea=function(){if(!dfd||dfd.canceled||!tif.validCheck(dfd)){_e6.splice(i--,1);_e7-=1;}else{if(tif.ioCheck(dfd)){_e6.splice(i--,1);tif.resHandle(dfd);_e7-=1;}else{if(dfd.startTime){if(dfd.startTime+(dfd.ioArgs.args.timeout||0)<now){_e6.splice(i--,1);var err=new Error("timeout exceeded");err.dojoType="timeout";dfd.errback(err);dfd.cancel();_e7-=1;}}}}};if(dojo.config.debugAtAllCosts){_ea.call(this);}else{try{_ea.call(this);}catch(e){dfd.errback(e);}}}}_e8(dfd);if(!_e6.length){clearInterval(_e5);_e5=null;return;}};dojo._ioCancelAll=function(){try{_cf.forEach(_e6,function(i){try{i.dfd.cancel();}catch(e){}});}catch(e){}};_cf._ioNotifyStart=function(dfd){};_cf._ioWatch=function(dfd,_eb,_ec,_ed){var _ee=dfd.ioArgs.args;if(_ee.timeout){dfd.startTime=(new Date()).getTime();}_e6.push({dfd:dfd,validCheck:_eb,ioCheck:_ec,resHandle:_ed});if(!_e5){_e5=setInterval(_e9,50);}if(_ee.sync){_e9();}};var _ef="application/x-www-form-urlencoded";var _f0=function(dfd){return dfd.ioArgs.xhr.readyState;};var _f1=function(dfd){return 4==dfd.ioArgs.xhr.readyState;};var _f2=function(dfd){var xhr=dfd.ioArgs.xhr;if(_cf._isDocumentOk(xhr)){dfd.callback(dfd);}else{var err=new Error("Unable to load "+dfd.ioArgs.url+" status:"+xhr.status);err.status=xhr.status;err.responseText=xhr.responseText;dfd.errback(err);}};dojo._ioAddQueryToUrl=function(_f3){if(_f3.query.length){_f3.url+=(_f3.url.indexOf("?")==-1?"?":"&")+_f3.query;_f3.query=null;}};dojo.xhr=function(_f4,_f5,_f6){var dfd=_cf._ioSetArgs(_f5,_e0,_e2,_e3);var _f7=dfd.ioArgs;var xhr=_f7.xhr=_cf._xhrObj(_f7.args);if(!xhr){dfd.cancel();return dfd;}if("postData" in _f5){_f7.query=_f5.postData;}else{if("putData" in _f5){_f7.query=_f5.putData;}else{if("rawBody" in _f5){_f7.query=_f5.rawBody;}else{if((arguments.length>2&&!_f6)||"POST|PUT".indexOf(_f4.toUpperCase())==-1){_cf._ioAddQueryToUrl(_f7);}}}}xhr.open(_f4,_f7.url,_f5.sync!==true,_f5.user||undefined,_f5.password||undefined);if(_f5.headers){for(var hdr in _f5.headers){if(hdr.toLowerCase()==="content-type"&&!_f5.contentType){_f5.contentType=_f5.headers[hdr];}else{if(_f5.headers[hdr]){xhr.setRequestHeader(hdr,_f5.headers[hdr]);}}}}xhr.setRequestHeader("Content-Type",_f5.contentType||_ef);if(!_f5.headers||!("X-Requested-With" in _f5.headers)){xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");}if(_f5.overrideMinmeType&&xhr.overrideMimeType){xhr.overrideMimeType(_f5.overrideMimeType);}_cf._ioNotifyStart(dfd);if(dojo.config.debugAtAllCosts){xhr.send(_f7.query);}else{try{xhr.send(_f7.query);}catch(e){_f7.error=e;dfd.cancel();}}_cf._ioWatch(dfd,_f0,_f1,_f2);xhr=null;return dfd;};dojo.xhrGet=function(_f8){return _cf.xhr("GET",_f8);};dojo.rawXhrPost=dojo.xhrPost=function(_f9){return _cf.xhr("POST",_f9,true);};dojo.rawXhrPut=dojo.xhrPut=function(_fa){return _cf.xhr("PUT",_fa,true);};dojo.xhrDelete=function(_fb){return _cf.xhr("DELETE",_fb);};}(dojo));dojo.attachScript=function(_fc){var doc=dojo.doc;var _fd=doc.createElement("script");_fd.type="text/javascript";_fd.src=_fc.url;_fd.charset="utf-8";return doc.getElementsByTagName("head")[0].appendChild(_fd);};(function(){var _fe=0;var _ff={};dojo.jsonp=function(args){if(!args.url){throw new Error("dojo.jsonp: No URL specified.");}if(!args.jsonp){throw new Error("dojo.jsonp: No callback param specified.");}_fe++;var _100="jsonp_callback_"+_fe;var _101=args.timeout||3000;_ff[_fe]=setTimeout(function(){dojo.jsonp[_100]=function(){};clearTimeout(_ff[_fe]);if(args.error){args.error(null,{});}if(args.handle){args.handle(null,{});}},_101);args.url+="?"+args.jsonp+"=dojo.jsonp."+_100;dojo.jsonp[_100]=function(data){clearTimeout(_ff[_fe]);try{if(args.load){args.load(data,{});}}catch(e){if(args.error){args.error(null,{});}}if(args.handle){args.handle(data,{});}};if(args.content){args.url+="&"+dojo.objectToQuery(args.content);}return dojo.attachScript(args);};})();dojo.delegate=dojo._delegate=(function(){function TMP(){};return function(obj,_102){TMP.prototype=obj;var tmp=new TMP();TMP.prototype=null;if(_102){dojo._mixin(tmp,_102);}return tmp;};})();dojo.declare=function(_103,_104,_105){var dd=arguments.callee,_106;if(dojo.isArray(_104)){_106=_104;_104=_106.shift();}if(_106){dojo.forEach(_106,function(m,i){if(!m){throw (_103+": mixin #"+i+" is null");}_104=dd._delegate(_104,m);});}var ctor=dd._delegate(_104);_105=_105||{};ctor.extend(_105);dojo.extend(ctor,{declaredClass:_103,_constructor:_105.constructor});ctor.prototype.constructor=ctor;return dojo.setObject(_103,ctor);};dojo.mixin(dojo.declare,{_delegate:function(base,_107){var bp=(base||0).prototype,mp=(_107||0).prototype,dd=dojo.declare;var ctor=dd._makeCtor();dojo.mixin(ctor,{superclass:bp,mixin:mp,extend:dd._extend});if(base){ctor.prototype=dojo._delegate(bp);}dojo.extend(ctor,dd._core,mp||0,{_constructor:null,preamble:null});ctor.prototype.constructor=ctor;ctor.prototype.declaredClass=(bp||0).declaredClass+"_"+(mp||0).declaredClass;return ctor;},_extend:function(_108){var i,fn;for(i in _108){if(dojo.isFunction(fn=_108[i])&&!0[i]){fn.nom=i;fn.ctor=this;}}dojo.extend(this,_108);},_makeCtor:function(){return function(){this._construct(arguments);};},_core:{_construct:function(args){var c=args.callee,s=c.superclass,ct=s&&s.constructor,m=c.mixin,mct=m&&m.constructor,a=args,ii,fn;if(a[0]){if(((fn=a[0].preamble))){a=fn.apply(this,a)||a;}}if((fn=c.prototype.preamble)){a=fn.apply(this,a)||a;}if(ct&&ct.apply){ct.apply(this,a);}if(mct&&mct.apply){mct.apply(this,a);}if((ii=c.prototype._constructor)){ii.apply(this,args);}if(this.constructor.prototype==c.prototype&&(ct=this.postscript)){ct.apply(this,args);}},_findMixin:function(_109){var c=this.constructor,p,m;while(c){p=c.superclass;m=c.mixin;if(m==_109||(m instanceof _109.constructor)){return p;}if(m&&m._findMixin&&(m=m._findMixin(_109))){return m;}c=p&&p.constructor;}},_findMethod:function(name,_10a,_10b,has){var p=_10b,c,m,f;do{c=p.constructor;m=c.mixin;if(m&&(m=this._findMethod(name,_10a,m,has))){return m;}if((f=p[name])&&(has==(f==_10a))){return p;}p=c.superclass;}while(p);return !has&&(p=this._findMixin(_10b))&&this._findMethod(name,_10a,p,has);},inherited:function(name,args,_10c){var a=arguments;if(typeof a[0]!="string"){_10c=args;args=name;name=args.callee.nom;}a=_10c||args;var c=args.callee,p=this.constructor.prototype,fn,mp;if(this[name]!=c||p[name]==c){mp=(c.ctor||0).superclass||this._findMethod(name,c,p,true);if(!mp){throw (this.declaredClass+": inherited method \""+name+"\" mismatch");}p=this._findMethod(name,c,mp,false);}fn=p&&p[name];if(!fn){throw (mp.declaredClass+": inherited method \""+name+"\" not found");}return fn.apply(this,a);}}});dojo.query=function(_10d,_10e){if(typeof _10e=="string"){_10e=dojo.byId(_10e);if(!_10e){return [];}}_10e=_10e||dojo.doc;if(/[>+~]\s*$/.test(_10d)){_10d+="*";}var _10f=_10e;if(_10e.nodeType==9){if(/^\s*>/.test(_10d)){var _110=_10d.replace(/^\s*>/,"").match(/([^\s>+~]+)(.*)/);if(!_110){return [];}var _111=_110[1];_10d=_110[2];if(_10e.querySelector(_111)!==_10e.documentElement){return [];}if(!_10d){return [_10e.documentElement];}_10e=_10e.documentElement;}else{if(/^\s*[+~]/.test(_10d)){return [];}}}if(_10e.nodeType==1){var _112=_10e.id;var _113=_112;if(!_112){_113=_10e.id="d---dojo-query-synthetic-id-"+new Date().getTime();var _114=true;}_10d="#"+_113+" "+_10d;_10f=_10e.parentNode||_10e;}var n=_10f.querySelectorAll(_10d);if(_114){_10e.id="";}return n||[];};(function(){var _115=embed.query;embed.query=function(_116,_117){return new _118(_115.apply(embed,arguments));};var _118=function(arr){var ret=[];_119(ret);if(arr){for(var i=0,l=arr.length;i<l;i++){ret.push(arr[i]);}}return ret;};function _119(obj){var _11a="attr addClass connect removeAttr removeClass style toggleClass place".split(" ");for(var i=0,l=_11a.length,func;i<l;i++){func=_11a[i];obj[func]=(function(func){return function(){var ret;for(var i=0,l=this.length;i<l;i++){var _11b=[].splice.call(arguments,0);ret=embed[func].apply(embed,[this[i]].concat(_11b));}return ret;};})(func);}};})();embed.geolocation=navigator.geolocation;