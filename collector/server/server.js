var loopback = require('loopback');
var boot = require('loopback-boot');
var useragent = require('express-useragent');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

app.use(loopback.context());
app.use(loopback.token());
app.use(function setDomain(req, res, next) {
  var loopbackContext = loopback.getCurrentContext();

  if(req.headers && req.headers.referer){
    loopbackContext.set('host', req.headers.origin.slice(req.headers.origin.indexOf('://') + 3));
  }

  var userId = req.url.slice(req.url.indexOf('/api/users/')+11, req.url.indexOf('/visits'));
  if(userId){
    loopbackContext.set('userId', userId);
  }

  var visitId = ~req.url.indexOf('/event') ? req.url.slice(req.url.indexOf('/api/Visits/')+11, req.url.indexOf('/event')) : false;
  if(visitId){
    loopbackContext.set('visitId', visitId);
  }

  var source = req.headers['user-agent'],
    ua = useragent.parse(source);

  var userHeadersInfo = {
      browserName: ua.browser,
      browserVersion: ua.version,
      operatingSystem: ua.os,
      IP: req.connection.remoteAddress
  };

  loopbackContext.set('userHeadersInfo', userHeadersInfo);

  next();
});

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
