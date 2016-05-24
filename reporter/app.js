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


var webshot = require('webshot'),
	fs      = require('fs');

app.get('/screenshot', function(req, res) {
	var file = 'screenshot.jpeg',
		options = {
			screenSize: {
				width: req.param('width')
			},
			shotSize: {
				width: 'all',
				height: 'all'
			},
			defaultWhiteBackground: true,
			customCSS: 'html, body {background: white!important; }'
		};

	webshot(req.param('url'), file, options,
		function(err) {
			if (err) {
				res.status(500).send({ error: 'Something failed!' });
			} else {
				var bitmap = fs.readFileSync(file);

				res.json({
					base64: new Buffer(bitmap).toString('base64')
				});
			}
		});
});


app.listen(port);
console.log("App listening on port " + port);