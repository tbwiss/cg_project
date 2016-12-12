var express = require("express");
var app = express();
var server = require('http').createServer(app);


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});



//[INFO] start server: Takes either in arguments (console!) specified Port and IP or the default values
server.listen(process.argv[2] || process.env.PORT || 3000, process.argv[3] || process.env.IP || "0.0.0.0", function() {
	var addr = server.address();
	console.log("Webserver running at", addr.address + ":" + addr.port);
});
