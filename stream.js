var fs = require('fs'); 
var readStream = fs.createReadStream('bigfilelogs.txt');  

var stream = require('stream'); 
var xtream = new stream.Transform( { objectMode: true } );

xtream._transform = function(chunk, encoding, done) {
	var strData = chunk.toString();

	if (this._invalidLine) {
		strData = this._invalidLine + strData;
	};

	var objLines = strData.split("\n"); 
	this._invalidLine = objLines.splice(objLines.length-1, 1)[0];  
	this.push(objLines);

	done();
};

xtream._flush = function(done) {
	if (this._invalidLine) {   
		this.push([this._invalidLine]); 
	};

	this._invalidLine = null;
	done();
};

readStream.pipe(xtream);

xtream.on('readable', function(){ 
	while (lines = xtream.read()) { 
		lines.forEach(function(line, index){
			console.log(line + '\n');  
		});   
	}
});