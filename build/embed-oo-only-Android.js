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
dojo.extend=function(_1,_2){
for(var i=1,l=arguments.length;i<l;i++){
dojo._mixin(_1.prototype,arguments[i]);
}
return _1;
};
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
["indexOf","lastIndexOf","forEach","map","some","every","filter"].forEach(function(_1,_2){
dojo[_1]=function(_3,_4,_5){
if((_2>1)&&(typeof _4=="string")){
_4=new Function("item","index","array",_4);
}
return Array.prototype[_1].call(_3,_4,_5);
};
});

