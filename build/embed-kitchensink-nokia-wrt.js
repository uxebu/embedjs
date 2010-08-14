var dojo={};
var djConfig=dojo.config={};
dojo.global=window;
dojo.doc=document;
dojo.body=function(){
return document.body;
};
dojo.provide=function(_1){
_1=_1+"";
return dojo.getObject(_1,true);
};
dojo.require=function(){
};
(function(d){
var _2={},_3;
for(var i in {toString:1}){
_3=[];
break;
}
dojo._extraNames=_3=_3||["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString"];
d._mixin=function(_4,_5){
var _6,s,i=0,l=_3.length;
for(_6 in _5){
s=_5[_6];
if(s!==_2[_6]&&s!==_4[_6]){
_4[_6]=s;
}
}
if(l&&_5){
for(;i<l;++i){
_6=_3[i];
s=_5[_6];
if(s!==_2[_6]&&s!==_4[_6]){
_4[_6]=s;
}
}
}
return _4;
};
dojo.mixin=function(_7,_8){
if(!_7){
_7={};
}
for(var i=1,l=arguments.length;i<l;i++){
d._mixin(_7,arguments[i]);
}
return _7;
};
dojo.safeMixin=function(_9,_a){
var _b,t,i=0,l=d._extraNames.length;
var op=Object.prototype,_c=op.toString,_d="constructor";
for(_b in _a){
t=_a[_b];
if((t!==op[_b]||!(_b in op))&&_b!=_d){
if(_c.call(t)=="[object Function]"){
t.nom=_b;
}
_9[_b]=t;
}
}
for(;i<l;++i){
_b=d._extraNames[i];
t=_a[_b];
if((t!==op[_b]||!(_b in op))&&_b!=_d){
if(_c.call(t)=="[object Function]"){
t.nom=_b;
}
_9[_b]=t;
}
}
return _9;
};
d._getProp=function(_e,_f,_10){
var obj=_10||d.global;
for(var i=0,p;obj&&(p=_e[i]);i++){
obj=(p in obj?obj[p]:(_f?obj[p]={}:undefined));
}
return obj;
};
d.setObject=function(_11,_12,_13){
var _14=_11.split("."),p=_14.pop(),obj=d._getProp(_14,true,_13);
return obj&&p?(obj[p]=_12):undefined;
};
d.getObject=function(_15,_16,_17){
return d._getProp(_15.split("."),_16,_17);
};
d._loaders=[];
d._unloaders=[];
d._onto=function(arr,obj,fn){
if(!fn){
arr.push(obj);
}else{
if(fn){
var _18=(typeof fn=="string")?obj[fn]:fn;
arr.push(function(){
_18.call(obj);
});
}
}
};
dojo.addOnLoad=function(obj,_19){
d._onto(d._loaders,obj,_19);
if(d._postLoad&&d._inFlightCount==0&&!d._loadNotifying){
d._callLoaded();
}
};
dojo._getModuleSymbols=function(_1a){
var _1b=_1a.split(".");
for(var i=_1b.length;i>0;i--){
var _1c=_1b.slice(0,i).join(".");
if(i==1&&!d._moduleHasPrefix(_1c)){
_1b[0]="../"+_1b[0];
}else{
var _1d=d._getModulePrefix(_1c);
if(_1d!=_1c){
_1b.splice(0,i,_1d);
break;
}
}
}
return _1b;
};
dojo.moduleUrl=function(_1e,url){
var loc=d._getModuleSymbols(_1e).join("/");
if(!loc){
return null;
}
if(loc.lastIndexOf("/")!=loc.length-1){
loc+="/";
}
var _1f=loc.indexOf(":");
if(loc.charAt(0)!="/"&&(_1f==-1||_1f>loc.indexOf("/"))){
loc=d.baseUrl+loc;
}
return loc+(url||"");
};
d.mixin(d,{baseUrl:"",_loadedModules:{},_inFlightCount:0,_hasResource:{},_modulePrefixes:{dojo:{name:"dojo",value:"."},doh:{name:"doh",value:"../util/doh"},tests:{name:"tests",value:"tests"}},_moduleHasPrefix:function(_20){
var mp=d._modulePrefixes;
return !!(mp[_20]&&mp[_20].value);
},_getModulePrefix:function(_21){
var mp=d._modulePrefixes;
if(d._moduleHasPrefix(_21)){
return mp[_21].value;
}
return _21;
},_loadedUrls:[],_postLoad:false,_loaders:[],_unloaders:[],_loadNotifying:false});
dojo.byId=function(id,doc){
return (typeof id=="string")?(doc||document).getElementById(id):id;
};
})(dojo);
(function(d){
if(document&&document.getElementsByTagName){
var _22=document.getElementsByTagName("script");
var _23=/dojo[^\/]*\.js(\W|$)/i;
for(var i=0;i<_22.length;i++){
var src=_22[i].getAttribute("src");
if(!src){
continue;
}
var m=src.match(_23);
if(m){
if(!d.config.baseUrl){
d.config.baseUrl=src.substring(0,m.index);
}
var cfg=_22[i].getAttribute("djConfig");
if(cfg){
var _24=eval("({ "+cfg+" })");
for(var x in _24){
dojo.config[x]=_24[x];
}
}
break;
}
}
}
d.baseUrl=d.config.baseUrl;
}(dojo));
["indexOf","lastIndexOf","forEach","map","some","every","filter"].forEach(function(_1,_2){
dojo[_1]=function(_3,_4,_5){
if((_2>1)&&(typeof _4=="string")){
_4=new Function("item","index","array",_4);
}
return Array.prototype[_1].call(_3,_4,_5);
};
});
dojo._listener={getDispatcher:function(){
return function(){
var ap=Array.prototype,c=arguments.callee,ls=c._listeners,t=c.target;
var r=t&&t.apply(this,arguments);
var i,_1;
_1=[].concat(ls);
for(i in _1){
if(!(i in ap)){
_1[i].apply(this,arguments);
}
}
return r;
};
},add:function(_2,_3,_4){
_2=_2||dojo.global;
var f=_2[_3];
if(!f||!f._listeners){
var d=dojo._listener.getDispatcher();
d.target=f;
d._listeners=[];
f=_2[_3]=d;
}
return f._listeners.push(_4);
},remove:function(_5,_6,_7){
var f=(_5||dojo.global)[_6];
if(f&&f._listeners&&_7--){
delete f._listeners[_7];
}
}};
dojo.connect=function(_8,_9,_a,_b,_c){
var a=arguments,_d=[],i=0;
_d.push(dojo.isString(a[0])?null:a[i++],a[i++]);
var a1=a[i+1];
_d.push(dojo.isString(a1)||dojo.isFunction(a1)?a[i++]:null,a[i++]);
for(var l=a.length;i<l;i++){
_d.push(a[i]);
}
return dojo._connect.apply(this,_d);
};
dojo._connect=function(_e,_f,_10,_11){
var l=dojo._listener,h=l.add(_e,_f,dojo.hitch(_10,_11));
return [_e,_f,h,l];
};
dojo.disconnect=function(_12){
if(_12&&_12[0]!==undefined){
dojo._disconnect.apply(this,_12);
delete _12[0];
}
};
dojo._disconnect=function(obj,_13,_14,_15){
_15.remove(obj,_13,_14);
};
(function(){
var _1=(dojo._event_listener={add:function(_2,_3,fp){
if(!_2){
return;
}
_3=_1._normalizeEventName(_3);
_2.addEventListener(_3,fp,false);
return fp;
},remove:function(_4,_5,_6){
if(_4){
_5=_1._normalizeEventName(_5);
_4.removeEventListener(_5,_6,false);
}
},_normalizeEventName:function(_7){
return _7.slice(0,2)=="on"?_7.slice(2):_7;
}});
dojo.fixEvent=function(_8,_9){
return _1._fixEvent(_8,_9);
};
dojo.stopEvent=function(_a){
_a.preventDefault();
_a.stopPropagation();
};
dojo._connect=function(_b,_c,_d,_e,_f){
var _10=_b&&(_b.nodeType||_b.attachEvent||_b.addEventListener);
var lid=_10?1:0,l=[dojo._listener,_1][lid];
var h=l.add(_b,_c,dojo.hitch(_d,_e));
return [_b,_c,h,lid];
};
dojo._disconnect=function(obj,_11,_12,_13){
([dojo._listener,_1][_13]).remove(obj,_11,_12);
};
})();
dojo._topics={};
dojo.subscribe=function(_1,_2,_3){
return [_1,dojo._listener.add(dojo._topics,_1,dojo.hitch(_2,_3))];
};
dojo.unsubscribe=function(_4){
if(_4){
dojo._listener.remove(dojo._topics,_4[0],_4[1]);
}
};
dojo.publish=function(_5,_6){
var f=dojo._topics[_5];
if(f){
f.apply(this,_6||[]);
}
};
dojo.connectPublisher=function(_7,_8,_9){
var pf=function(){
dojo.publish(_7,arguments);
};
return _9?dojo.connect(_8,_9,pf):dojo.connect(_8,pf);
};
dojo.extend=function(_1,_2){
for(var i=1,l=arguments.length;i<l;i++){
dojo._mixin(_1.prototype,arguments[i]);
}
return _1;
};
dojo._hitchArgs=function(_1,_2){
var _3=dojo._toArray(arguments,2);
var _4=dojo.isString(_2);
return function(){
var _5=dojo._toArray(arguments);
var f=_4?(_1||dojo.global)[_2]:_2;
return f&&f.apply(_1||this,_3.concat(_5));
};
};
dojo.hitch=function(_6,_7){
if(arguments.length>2){
return dojo._hitchArgs.apply(dojo,arguments);
}
if(!_7){
_7=_6;
_6=null;
}
if(dojo.isString(_7)){
_6=_6||dojo.global;
if(!_6[_7]){
throw (["dojo.hitch: scope[\"",_7,"\"] is null (scope=\"",_6,"\")"].join(""));
}
return function(){
return _6[_7].apply(_6,arguments||[]);
};
}
return !_6?_7:function(){
return _7.apply(_6,arguments||[]);
};
};
(function(d){
(function(){
var _1=function(){
};
var _2=Object.freeze||function(){
};
dojo.Deferred=function(_3){
var _4,_5,_6,_7,_8;
var _9=this.promise={};
function _a(_b){
if(_5){
throw new Error("This deferred has already been resolved");
}
_4=_b;
_5=true;
_c();
};
function _c(){
var _d;
while(!_d&&_8){
var _e=_8;
_8=_8.next;
if(_d=(_e.progress==_1)){
_5=false;
}
var _f=(_6?_e.error:_e.resolved);
if(_f){
try{
var _10=_f(_4);
if(_10&&typeof _10.then==="function"){
_10.then(dojo.hitch(_e.deferred,"resolve"),dojo.hitch(_e.deferred,"reject"));
continue;
}
var _11=_d&&_10===undefined;
_e.deferred[_11&&_6?"reject":"resolve"](_11?_4:_10);
}
catch(e){
_e.deferred.reject(e);
}
}else{
if(_6){
_e.deferred.reject(_4);
}else{
_e.deferred.resolve(_4);
}
}
}
};
this.resolve=this.callback=function(_12){
this.fired=0;
this.results=[_12,null];
_a(_12);
};
this.reject=this.errback=function(_13){
_6=true;
this.fired=1;
_a(_13);
this.results=[null,_13];
if(!_13||_13.log!==false){
(dojo.config.deferredOnError||function(x){
console.error(x);
})(_13);
}
};
this.progress=function(_14){
var _15=_8;
while(_15){
var _16=_15.progress;
_16&&_16(_14);
_15=_15.next;
}
};
this.addCallbacks=function(_17,_18){
this.then(_17,_18,_1);
return this;
};
this.then=_9.then=function(_19,_1a,_1b){
var _1c=_1b==_1?this:new dojo.Deferred(_9.cancel);
var _1d={resolved:_19,error:_1a,progress:_1b,deferred:_1c};
if(_8){
_7=_7.next=_1d;
}else{
_8=_7=_1d;
}
if(_5){
_c();
}
return _1c.promise;
};
var _1e=this;
this.cancel=_9.cancel=function(){
if(!_5){
var _1f=_3&&_3(_1e);
if(!_5){
if(!(_1f instanceof Error)){
_1f=new Error(_1f);
}
_1f.log=false;
_1e.reject(_1f);
}
}
};
_2(_9);
};
dojo.extend(dojo.Deferred,{addCallback:function(_20){
return this.addCallbacks(dojo.hitch.apply(dojo,arguments));
},addErrback:function(_21){
return this.addCallbacks(null,dojo.hitch.apply(dojo,arguments));
},addBoth:function(_22){
var _23=dojo.hitch.apply(dojo,arguments);
return this.addCallbacks(_23,_23);
},fired:-1});
})();
dojo.when=function(_24,_25,_26,_27){
if(_24&&typeof _24.then==="function"){
return _24.then(_25,_26,_27);
}
return _25(_24);
};
})(dojo);
(function(d){
var _1=null,_2;
d.destroy=function(_3){
_3=dojo.byId(_3);
try{
var _4=_3.ownerDocument;
if(!_1||_2!=_4){
_1=_4.createElement("div");
_2=_4;
}
_1.appendChild(_3.parentNode?_3.parentNode.removeChild(_3):_3);
_1.innerHTML="";
}
catch(e){
}
};
})(dojo);
(function(d){
var _1=d.byId;
var _2={option:["select"],tbody:["table"],thead:["table"],tfoot:["table"],tr:["table","tbody"],td:["table","tbody","tr"],th:["table","thead","tr"],legend:["fieldset"],caption:["table"],colgroup:["table"],col:["table","colgroup"],li:["ul"]},_3=/<\s*([\w\:]+)/,_4={},_5=0,_6="__"+d._scopeName+"ToDomId";
for(var _7 in _2){
var tw=_2[_7];
tw.pre=_7=="option"?"<select multiple=\"multiple\">":"<"+tw.join("><")+">";
tw.post="</"+tw.reverse().join("></")+">";
}
d._toDom=function(_8,_9){
_9=_9||d.doc;
var _a=_9[_6];
if(!_a){
_9[_6]=_a=++_5+"";
_4[_a]=_9.createElement("div");
}
_8+="";
var _b=_8.match(_3),_c=_b?_b[1].toLowerCase():"",_d=_4[_a],_e,i,fc,df;
if(_b&&_2[_c]){
_e=_2[_c];
_d.innerHTML=_e.pre+_8+_e.post;
for(i=_e.length;i;--i){
_d=_d.firstChild;
}
}else{
_d.innerHTML=_8;
}
if(_d.childNodes.length==1){
return _d.removeChild(_d.firstChild);
}
df=_9.createDocumentFragment();
while(fc=_d.firstChild){
df.appendChild(fc);
}
return df;
};
var _f="className";
d.hasClass=function(_10,_11){
return ((" "+_1(_10)[_f]+" ").indexOf(" "+_11+" ")>=0);
};
var _12=/\s+/,a1=[""],_13=function(s){
if(typeof s=="string"||s instanceof String){
if(s.indexOf(" ")<0){
a1[0]=s;
return a1;
}else{
return s.split(_12);
}
}
return s;
};
d.addClass=function(_14,_15){
_14=_1(_14);
_15=_13(_15);
var cls=" "+_14[_f]+" ";
for(var i=0,len=_15.length,c;i<len;++i){
c=_15[i];
if(c&&cls.indexOf(" "+c+" ")<0){
cls+=c+" ";
}
}
_14[_f]=d.trim(cls);
};
d.removeClass=function(_16,_17){
_16=_1(_16);
var cls;
if(_17!==undefined){
_17=_13(_17);
cls=" "+_16[_f]+" ";
for(var i=0,len=_17.length;i<len;++i){
cls=cls.replace(" "+_17[i]+" "," ");
}
cls=d.trim(cls);
}else{
cls="";
}
if(_16[_f]!=cls){
_16[_f]=cls;
}
};
d.toggleClass=function(_18,_19,_1a){
if(_1a===undefined){
_1a=!d.hasClass(_18,_19);
}
d[_1a?"addClass":"removeClass"](_18,_19);
};
d._docScroll=function(){
var n=d.global;
return "pageXOffset" in n?{x:n.pageXOffset,y:n.pageYOffset}:(n=d.doc.documentElement,n.clientHeight?{x:d._fixIeBiDiScrollLeft(n.scrollLeft),y:n.scrollTop}:(n=d.body(),{x:n.scrollLeft||0,y:n.scrollTop||0}));
};
var _1b=function(_1c,ref){
var _1d=ref.parentNode;
if(_1d){
_1d.insertBefore(_1c,ref);
}
};
var _1e=function(_1f,ref){
var _20=ref.parentNode;
if(_20){
if(_20.lastChild==ref){
_20.appendChild(_1f);
}else{
_20.insertBefore(_1f,ref.nextSibling);
}
}
};
d.place=function(_21,_22,_23){
_22=_1(_22);
if(typeof _21=="string"){
_21=_21.charAt(0)=="<"?d._toDom(_21,_22.ownerDocument):_1(_21);
}
if(typeof _23=="number"){
var cn=_22.childNodes;
if(!cn.length||cn.length<=_23){
_22.appendChild(_21);
}else{
_1b(_21,cn[_23<0?0:_23]);
}
}else{
switch(_23){
case "before":
_1b(_21,_22);
break;
case "after":
_1e(_21,_22);
break;
case "replace":
_22.parentNode.replaceChild(_21,_22);
break;
case "only":
d.empty(_22);
_22.appendChild(_21);
break;
case "first":
if(_22.firstChild){
_1b(_21,_22.firstChild);
break;
}
default:
_22.appendChild(_21);
}
}
return _21;
};
d.create=function(tag,_24,_25,pos){
var doc=d.doc;
if(_25){
_25=_1(_25);
doc=_25.ownerDocument;
}
if(typeof tag=="string"){
tag=doc.createElement(tag);
}
if(_24){
for(var _26 in _24){
switch(_26){
case "class":
tag.className=_24[_26];
break;
default:
tag[_26]=_24[_26];
}
}
}
if(_25){
d.place(tag,_25,pos);
}
return tag;
};
d.empty=function(_27){
_1(_27).innerHTML="";
};
})(dojo);
(function(d){
d._getComputedStyle=function(_1){
return _1.nodeType==1?_1.ownerDocument.defaultView.getComputedStyle(_1,null):{};
};
var _2="cssFloat",_3={"cssFloat":_2,"styleFloat":_2,"float":_2};
d._style=function(_4,_5,_6){
var n=dojo.byId(_4),l=arguments.length;
_5=_3[_5]||_5;
if(l==3){
return n.style[_5]=_6;
}
var s=d._getComputedStyle(n);
if(l==2&&typeof _5!="string"){
for(var x in _5){
d._style(_4,x,_5[x]);
}
return s;
}
return (l==1)?s:parseFloat(s[_5]||n.style[_5])||s[_5];
};
})(dojo);
dojo.getComputedStyle=dojo._getComputedStyle;
dojo.style=dojo._style;
dojo.isString=function(it){
return (typeof it=="string"||it instanceof String);
};
dojo.isArray=function(it){
return it&&(it instanceof Array||typeof it=="array");
};
dojo.isFunction=(function(){
var _1=function(it){
var t=typeof it;
return it&&(t=="function"||it instanceof Function)&&!it.nodeType;
};
return dojo.isSafari?function(it){
if(typeof it=="function"&&it=="[object NodeList]"){
return false;
}
return _1(it);
}:_1;
})();
dojo.isObject=function(it){
return it!==undefined&&(it===null||typeof it=="object"||dojo.isArray(it)||dojo.isFunction(it));
};
dojo.isArrayLike=function(it){
var d=dojo;
return it&&it!==undefined&&!d.isString(it)&&!d.isFunction(it)&&!(it.tagName&&it.tagName.toLowerCase()=="form")&&(d.isArray(it)||isFinite(it.length));
};
dojo.isAlien=function(it){
return it&&!dojo.isFunction(it)&&/\{\s*\[native code\]\s*\}/.test(String(it));
};
dojo.isNumeric=function(n){
return n==parseFloat(n);
};
dojo.isNumber=function(n){
return typeof n=="number"||n instanceof Number;
};
dojo.fromJson=function(_1){
return eval("("+_1+")");
};
dojo._escapeString=function(_2){
return ("\""+_2.replace(/(["\\])/g,"\\$1")+"\"").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r");
};
dojo.toJsonIndentStr="\t";
dojo.toJson=function(it,_3,_4){
if(it===undefined){
return "undefined";
}
var _5=typeof it;
if(_5=="number"||_5=="boolean"){
return it+"";
}
if(it===null){
return "null";
}
if(dojo.isString(it)){
return dojo._escapeString(it);
}
var _6=arguments.callee;
var _7;
_4=_4||"";
var _8=_3?_4+dojo.toJsonIndentStr:"";
var tf=it.__json__||it.json;
if(dojo.isFunction(tf)){
_7=tf.call(it);
if(it!==_7){
return _6(_7,_3,_8);
}
}
if(it.nodeType&&it.cloneNode){
throw new Error("Can't serialize DOM nodes");
}
var _9=_3?" ":"";
var _a=_3?"\n":"";
if(dojo.isArray(it)){
var _b=dojo.map(it,function(_c){
var _d=_6(_c,_3,_8);
if(typeof _d!="string"){
_d="undefined";
}
return _a+_8+_d;
});
return "["+_b.join(","+_9)+_a+_4+"]";
}
if(_5=="function"){
return null;
}
var _e=[],_f;
for(_f in it){
var _10,val;
if(typeof _f=="number"){
_10="\""+_f+"\"";
}else{
if(typeof _f=="string"){
_10=dojo._escapeString(_f);
}else{
continue;
}
}
val=_6(it[_f],_3,_8);
if(typeof val!="string"){
continue;
}
_e.push(_a+_8+_10+":"+_9+val);
}
return "{"+_e.join(","+_9)+_a+_4+"}";
};
dojo.objectToQuery=function(_1){
var _2=encodeURIComponent;
var _3=[];
var _4={};
for(var _5 in _1){
var _6=_1[_5];
if(_6!=_4[_5]){
var _7=_2(_5)+"=";
if(dojo.isArray(_6)){
for(var i=0;i<_6.length;i++){
_3.push(_7+_2(_6[i]));
}
}else{
_3.push(_7+_2(_6));
}
}
}
return _3.join("&");
};
dojo.jsonp={};
dojo.jsonp.attach=function(_1){
var _2=document;
var _3=_2.createElement("script");
_3.type="text/javascript";
_3.src=_1.url;
_3.charset="utf-8";
return _2.getElementsByTagName("head")[0].appendChild(_3);
};
dojo.jsonp._id=0;
dojo.jsonp._timeouts={};
dojo.jsonp.get=function(_4){
if(!_4.url){
throw new Error("dojo.jsonp.get: No URL specified.");
}
if(!_4.jsonp){
throw new Error("dojo.jsonp.get: No callback param specified.");
}
dojo.jsonp._id++;
var _5="jsonp_callback_"+dojo.jsonp._id;
var _6=_4.timeout||3000;
dojo.jsonp._timeouts[dojo.jsonp._id]=setTimeout(function(){
dojo.jsonp[_5]=function(){
};
clearTimeout(dojo.jsonp._timeouts[dojo.jsonp._id]);
if(_4.error){
_4.error(null,{});
}
if(_4.handle){
_4.handle(null,{});
}
},_6);
_4.url+="?"+_4.jsonp+"=dojo.jsonp."+_5;
dojo.jsonp[_5]=function(_7){
clearTimeout(dojo.jsonp._timeouts[dojo.jsonp._id]);
try{
if(_4.load){
_4.load(_7,{});
}
}
catch(e){
if(_4.error){
_4.error(null,{});
}
}
if(_4.handle){
_4.handle(_7,{});
}
};
if(_4.content){
_4.url+="&"+dojo.objectToQuery(_4.content);
}
var _8=dojo.doc;
var _9=_8.createElement("script");
_9.type="text/javascript";
_9.src=_4.url;
_9.charset="utf-8";
return _8.getElementsByTagName("head")[0].appendChild(_9);
};
dojo._toArray=function(_1,_2,_3){
return (_3||[]).concat(Array.prototype.slice.call(_1,_2||0));
};
dojo.clone=function(o){
if(!o||typeof o!="object"||dojo.isFunction(o)){
return o;
}
if(o.nodeType&&"cloneNode" in o){
return o.cloneNode(true);
}
if(o instanceof Date){
return new Date(o.getTime());
}
var r,i,l,s,_1;
if(dojo.isArray(o)){
r=[];
for(i=0,l=o.length;i<l;++i){
if(i in o){
r.push(dojo.clone(o[i]));
}
}
}else{
r=o.constructor?new o.constructor():{};
}
var _2={};
for(_1 in o){
s=o[_1];
if(!(_1 in r)||(r[_1]!==s&&(!(_1 in _2)||_2[_1]!==s))){
r[_1]=dojo.clone(s);
}
}
return r;
};
dojo.trim=String.prototype.trim?function(_1){
return _1.trim();
}:function(_2){
return _2.replace(/^\s\s*/,"").replace(/\s\s*$/,"");
};
var _pattern=/\{([^\}]+)\}/g;
dojo.replace=function(_3,_4,_5){
return _3.replace(_5||_pattern,dojo.isFunction(_4)?_4:function(_6,k){
return dojo.getObject(k,false,_4);
});
};
(function(_1){
var _2=_1.config;
_1._xhrObj=function(){
return new XMLHttpRequest();
};
_1._isDocumentOk=function(_3){
var _4=_3.status||0,lp=location.protocol;
return (_4>=200&&_4<300)||_4==304||_4==1223||(!_4&&(lp=="file:"||lp=="chrome:"||lp=="app:"));
};
_1._getText=function(_5,_6){
var _7=_1._xhrObj();
_7.open("GET",_5,false);
try{
_7.send(null);
if(!d._isDocumentOk(_7)){
var _8=Error("Unable to load "+_5+" status:"+_7.status);
_8.status=_7.status;
_8.responseText=_7.responseText;
throw _8;
}
}
catch(e){
if(_6){
return null;
}
throw e;
}
return _7.responseText;
};
dojo._blockAsync=false;
var _9=_1._contentHandlers=dojo.contentHandlers={text:function(_a){
return _a.responseText;
},json:function(_b){
return _1.fromJson(_b.responseText||null);
}};
dojo._ioSetArgs=function(_c,_d,_e,_f){
var _10={args:_c,url:_c.url};
var _11=[{}];
if(_c.content){
_11.push(_c.content);
}
if(_c.preventCache){
_11.push({"dojo.preventCache":new Date().valueOf()});
}
_10.query=_1.objectToQuery(_1.mixin.apply(null,_11));
_10.handleAs=_c.handleAs||"text";
var d=new _1.Deferred(_d);
d.addCallbacks(_e,function(_12){
return _f(_12,d);
});
var ld=_c.load;
if(ld&&_1.isFunction(ld)){
d.addCallback(function(_13){
return ld.call(_c,_13,_10);
});
}
var err=_c.error;
if(err&&_1.isFunction(err)){
d.addErrback(function(_14){
return err.call(_c,_14,_10);
});
}
var _15=_c.handle;
if(_15&&_1.isFunction(_15)){
d.addBoth(function(_16){
return _15.call(_c,_16,_10);
});
}
d.ioArgs=_10;
return d;
};
var _17=function(dfd){
dfd.canceled=true;
var xhr=dfd.ioArgs.xhr;
var _18=typeof xhr.abort;
if(_18=="function"||_18=="object"||_18=="unknown"){
xhr.abort();
}
var err=dfd.ioArgs.error;
if(!err){
err=new Error("xhr cancelled");
err.dojoType="cancel";
}
return err;
};
var _19=function(dfd){
var ret=_9[dfd.ioArgs.handleAs](dfd.ioArgs.xhr);
return ret===undefined?null:ret;
};
var _1a=function(_1b,dfd){
if(!dfd.ioArgs.args.failOk){
console.error(_1b);
}
return _1b;
};
var _1c=null;
var _1d=[];
var _1e=0;
var _1f=function(dfd){
if(_1e<=0){
_1e=0;
}
};
var _20=function(){
var now=(new Date()).getTime();
if(!_1._blockAsync){
for(var i=0,tif;i<_1d.length&&(tif=_1d[i]);i++){
var dfd=tif.dfd;
var _21=function(){
if(!dfd||dfd.canceled||!tif.validCheck(dfd)){
_1d.splice(i--,1);
_1e-=1;
}else{
if(tif.ioCheck(dfd)){
_1d.splice(i--,1);
tif.resHandle(dfd);
_1e-=1;
}else{
if(dfd.startTime){
if(dfd.startTime+(dfd.ioArgs.args.timeout||0)<now){
_1d.splice(i--,1);
var err=new Error("timeout exceeded");
err.dojoType="timeout";
dfd.errback(err);
dfd.cancel();
_1e-=1;
}
}
}
}
};
if(dojo.config.debugAtAllCosts){
_21.call(this);
}else{
try{
_21.call(this);
}
catch(e){
dfd.errback(e);
}
}
}
}
_1f(dfd);
if(!_1d.length){
clearInterval(_1c);
_1c=null;
return;
}
};
dojo._ioCancelAll=function(){
try{
_1.forEach(_1d,function(i){
try{
i.dfd.cancel();
}
catch(e){
}
});
}
catch(e){
}
};
_1._ioNotifyStart=function(dfd){
};
_1._ioWatch=function(dfd,_22,_23,_24){
var _25=dfd.ioArgs.args;
if(_25.timeout){
dfd.startTime=(new Date()).getTime();
}
_1d.push({dfd:dfd,validCheck:_22,ioCheck:_23,resHandle:_24});
if(!_1c){
_1c=setInterval(_20,50);
}
if(_25.sync){
_20();
}
};
var _26="application/x-www-form-urlencoded";
var _27=function(dfd){
return dfd.ioArgs.xhr.readyState;
};
var _28=function(dfd){
return 4==dfd.ioArgs.xhr.readyState;
};
var _29=function(dfd){
var xhr=dfd.ioArgs.xhr;
if(_1._isDocumentOk(xhr)){
dfd.callback(dfd);
}else{
var err=new Error("Unable to load "+dfd.ioArgs.url+" status:"+xhr.status);
err.status=xhr.status;
err.responseText=xhr.responseText;
dfd.errback(err);
}
};
dojo._ioAddQueryToUrl=function(_2a){
if(_2a.query.length){
_2a.url+=(_2a.url.indexOf("?")==-1?"?":"&")+_2a.query;
_2a.query=null;
}
};
dojo.xhr=function(_2b,_2c,_2d){
var dfd=_1._ioSetArgs(_2c,_17,_19,_1a);
var _2e=dfd.ioArgs;
var xhr=_2e.xhr=_1._xhrObj(_2e.args);
if(!xhr){
dfd.cancel();
return dfd;
}
if("postData" in _2c){
_2e.query=_2c.postData;
}else{
if("putData" in _2c){
_2e.query=_2c.putData;
}else{
if("rawBody" in _2c){
_2e.query=_2c.rawBody;
}else{
if((arguments.length>2&&!_2d)||"POST|PUT".indexOf(_2b.toUpperCase())==-1){
_1._ioAddQueryToUrl(_2e);
}
}
}
}
xhr.open(_2b,_2e.url,_2c.sync!==true,_2c.user||undefined,_2c.password||undefined);
if(_2c.headers){
for(var hdr in _2c.headers){
if(hdr.toLowerCase()==="content-type"&&!_2c.contentType){
_2c.contentType=_2c.headers[hdr];
}else{
if(_2c.headers[hdr]){
xhr.setRequestHeader(hdr,_2c.headers[hdr]);
}
}
}
}
xhr.setRequestHeader("Content-Type",_2c.contentType||_26);
if(!_2c.headers||!("X-Requested-With" in _2c.headers)){
xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
}
if(_2c.overrideMinmeType&&xhr.overrideMimeType){
xhr.overrideMimeType(_2c.overrideMimeType);
}
_1._ioNotifyStart(dfd);
if(dojo.config.debugAtAllCosts){
xhr.send(_2e.query);
}else{
try{
xhr.send(_2e.query);
}
catch(e){
_2e.error=e;
dfd.cancel();
}
}
_1._ioWatch(dfd,_27,_28,_29);
xhr=null;
return dfd;
};
dojo.xhrGet=function(_2f){
return _1.xhr("GET",_2f);
};
dojo.rawXhrPost=dojo.xhrPost=function(_30){
return _1.xhr("POST",_30,true);
};
dojo.rawXhrPut=dojo.xhrPut=function(_31){
return _1.xhr("PUT",_31,true);
};
dojo.xhrDelete=function(_32){
return _1.xhr("DELETE",_32);
};
}(dojo));
dojo.declare=function(_1,_2,_3){
var dd=arguments.callee,_4;
if(dojo.isArray(_2)){
_4=_2;
_2=_4.shift();
}
if(_4){
dojo.forEach(_4,function(m,i){
if(!m){
throw (_1+": mixin #"+i+" is null");
}
_2=dd._delegate(_2,m);
});
}
var _5=dd._delegate(_2);
_3=_3||{};
_5.extend(_3);
dojo.extend(_5,{declaredClass:_1,_constructor:_3.constructor});
_5.prototype.constructor=_5;
return dojo.setObject(_1,_5);
};
dojo.mixin(dojo.declare,{_delegate:function(_6,_7){
var bp=(_6||0).prototype,mp=(_7||0).prototype,dd=dojo.declare;
var _8=dd._makeCtor();
dojo.mixin(_8,{superclass:bp,mixin:mp,extend:dd._extend});
if(_6){
_8.prototype=dojo._delegate(bp);
}
dojo.extend(_8,dd._core,mp||0,{_constructor:null,preamble:null});
_8.prototype.constructor=_8;
_8.prototype.declaredClass=(bp||0).declaredClass+"_"+(mp||0).declaredClass;
return _8;
},_extend:function(_9){
var i,fn;
for(i in _9){
if(dojo.isFunction(fn=_9[i])&&!0[i]){
fn.nom=i;
fn.ctor=this;
}
}
dojo.extend(this,_9);
},_makeCtor:function(){
return function(){
this._construct(arguments);
};
},_core:{_construct:function(_a){
var c=_a.callee,s=c.superclass,ct=s&&s.constructor,m=c.mixin,_b=m&&m.constructor,a=_a,ii,fn;
if(a[0]){
if(((fn=a[0].preamble))){
a=fn.apply(this,a)||a;
}
}
if((fn=c.prototype.preamble)){
a=fn.apply(this,a)||a;
}
if(ct&&ct.apply){
ct.apply(this,a);
}
if(_b&&_b.apply){
_b.apply(this,a);
}
if((ii=c.prototype._constructor)){
ii.apply(this,_a);
}
if(this.constructor.prototype==c.prototype&&(ct=this.postscript)){
ct.apply(this,_a);
}
},_findMixin:function(_c){
var c=this.constructor,p,m;
while(c){
p=c.superclass;
m=c.mixin;
if(m==_c||(m instanceof _c.constructor)){
return p;
}
if(m&&m._findMixin&&(m=m._findMixin(_c))){
return m;
}
c=p&&p.constructor;
}
},_findMethod:function(_d,_e,_f,has){
var p=_f,c,m,f;
do{
c=p.constructor;
m=c.mixin;
if(m&&(m=this._findMethod(_d,_e,m,has))){
return m;
}
if((f=p[_d])&&(has==(f==_e))){
return p;
}
p=c.superclass;
}while(p);
return !has&&(p=this._findMixin(_f))&&this._findMethod(_d,_e,p,has);
},inherited:function(_10,_11,_12){
var a=arguments;
if(typeof a[0]!="string"){
_12=_11;
_11=_10;
_10=_11.callee.nom;
}
a=_12||_11;
var c=_11.callee,p=this.constructor.prototype,fn,mp;
if(this[_10]!=c||p[_10]==c){
mp=(c.ctor||0).superclass||this._findMethod(_10,c,p,true);
if(!mp){
throw (this.declaredClass+": inherited method \""+_10+"\" mismatch");
}
p=this._findMethod(_10,c,mp,false);
}
fn=p&&p[_10];
if(!fn){
throw (mp.declaredClass+": inherited method \""+_10+"\" not found");
}
return fn.apply(this,a);
}}});
dojo.delegate=dojo._delegate=(function(){
function _1(){
};
return function(_2,_3){
_1.prototype=_2;
var _4=new _1();
_1.prototype=null;
if(_3){
dojo._mixin(_4,_3);
}
return _4;
};
})();
dojo.query=function(_1,_2){
if(typeof _2=="string"){
_2=dojo.byId(_2);
if(!_2){
return [];
}
}
_2=_2||dojo.doc;
if(/[>+~]\s*$/.test(_1)){
_1+="*";
}
var _3=_2;
if(_2.nodeType==9){
if(/^\s*>/.test(_1)){
var _4=_1.replace(/^\s*>/,"").match(/([^\s>+~]+)(.*)/);
if(!_4){
return [];
}
var _5=_4[1];
_1=_4[2];
if(_2.querySelector(_5)!==_2.documentElement){
return [];
}
if(!_1){
return [_2.documentElement];
}
_2=_2.documentElement;
}else{
if(/^\s*[+~]/.test(_1)){
return [];
}
}
}
if(_2.nodeType==1){
var _6=_2.id;
var _7=_6;
if(!_6){
_7=_2.id="d---dojo-query-synthetic-id-"+new Date().getTime();
var _8=true;
}
_1="#"+_7+" "+_1;
_3=_2.parentNode;
}
var n=_3.querySelectorAll(_1);
if(_8){
_2.id="";
}
return n||[];
};

