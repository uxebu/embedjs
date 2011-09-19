var _jsToolsPath = arguments[0][0] == '/' ? arguments[0] : environment["user.dir"] + "/" + arguments[0];
load(_jsToolsPath + "fileUtil.js");

var filepath = arguments[1];
var filename = arguments[2];
var contents = fileUtil.readFile(filename);
var cleaned = ';(function(){var a={};';

var statements = contents.split('define(');

print(statements.length);
statements.forEach(function(_s){
	print('statement:');
	print(_s);
	print('');
});

// last one is the build profile
// statements.pop();

// filter out feature plugin and impl map
statements = statements.filter(function(_s){
	return _s.length > 0 && _s.indexOf('"feature"') != 0 && _s.indexOf('"implementations"') != 0;
});

print(statements.length);
statements.forEach(function(_s, index){
	print('-----------------------');
	
	// get function body
	
	var start = _s.indexOf('function(');
	var end = _s.lastIndexOf(')');
	
	print(start + ' - ' + end);
	
	var func = _s.substring(start, end);
	print('func:');
	print(func);
	
	start = func.indexOf('{') + 1;
	end = func.lastIndexOf('return');
	
	var body = func.substring(start, end);

	print('');
	print('body:');
	print(body);

	if(index == 0){
		// The first staement is from embed.js, there we need to get rid of the 'var a = {};'
		start = body.indexOf(';') + 1; 
		body = body.substring(start, body.length);
	}
	
	cleaned += body;
})

cleaned += '})();';

var output = filepath + '/' + filename;

fileUtil.saveUtf8File(output, cleaned);

