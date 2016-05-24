var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.use(loopback.context());
app.use(function setDomain(req, res, next) {

  if(req.url.indexOf('download=true') >0){
    res.set('Expires', 'Tue, 03 Jul 2001 06:00:00 GMT');
    res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
    res.set('Content-Type', 'application/force-download');
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Type', 'application/download');
    res.set('Content-Disposition', 'attachment;filename=Data.txt');
    res.set('Content-Transfer-Encoding', 'binary');
  }
  
  next();
});


app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
