// set up ======================================================================
var express = require('express'),
	app = express(),						// create our app w/ express
	port = process.env.PORT || 3002;		// set the port

// configuration ===============================================================

app.configure(function() {
	app.use(express.static(__dirname + '/build')); // set the static files location /build/img will be /img for users
	app.use(express.logger('dev'));			// log every request to the console
	app.use(express.bodyParser());			// pull information from html in POST
	app.use(express.methodOverride());		// simulate DELETE and PUT
});


app.listen(port);
console.log("App listening on port " + port);