var request = require('request-then');
var loopback = require('loopback');

module.exports = function (User) {

  User.observe('before save', function (ctx, next) {
    var loopbackContext = loopback.getCurrentContext();
    if(ctx.instance){
      var userHeadersInfo = loopbackContext.get('userHeadersInfo');
      userHeadersInfo.registrationTime = ctx.instance.registrationTime;
      request('http://localhost:3001/api/Domains?filter=' + encodeURIComponent(JSON.stringify({"where": {"host": loopbackContext.get('host')}})))
        .then(function handleResponse(response) {
          var data = JSON.parse(response.body)[0];
          if (data.scenarioIds && data.scenarioIds.length === 0) {
            next(new Error('Could not find suitable scenario'));
          } else {
            request('http://localhost:3001/api/Domains/' + data.id + '/scenario?filter=' + encodeURIComponent(JSON.stringify({"where": {"status": "true"}})))
              .then(function handleResponse() {
                request({
                  url: 'http://localhost:3001/api/Domains/' + data.id + '/tracked_user', //URL to hit
                  method: 'POST',
                  json: userHeadersInfo
                })
                  .then(function handleResponse(response) {
                    ctx.instance.setId(response.body.id);
                    next();
                  }, function handleError(error) {
                    next(new Error('Unable to register user'));
                  });
              }, function handleError(error) {
                next(new Error('No active scenarios for domain' + currentHost.current + ' was found'));
              });
          }
        }, function handleError(error) {
          return next(new Error('Current domain ' + currentHost.current + ' was not register for tracking'));
        })
    }else{
      next();
    }
  });
};
