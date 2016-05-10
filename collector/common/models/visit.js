var request = require('request-then');
var loopback = require('loopback');

module.exports = function(Visit) {

  Visit.observe('before save', function (ctx, next) {
    var loopbackContext = loopback.getCurrentContext();
    var userId = loopbackContext.get('userId');
    var visitId = loopbackContext.get('visitId');
    if(userId && !visitId) {
      request('http://localhost:3001/api/Domains?filter=' + encodeURIComponent(JSON.stringify({"where": {"host": loopbackContext.get('host')}})))
        .then(function handleResponse(response) {
          var visitObj = ctx.instance;
          visitObj.DomainId = JSON.parse(response.body)[0].id;
          request({
            url: 'http://localhost:3001/api/TrackedUsers/' + userId + '/visits',
            method: 'POST',
            json: visitObj
          })
            .then(function (response) {
              ctx.instance.setId(response.body.id);
              next();
            }, function (error) {
              return next(new Error('Meaning full error'));
            })


        })
    }else{
      next();
    }
  });

  Visit.disableRemoteMethod('createChangeStream', true);
  Visit.disableRemoteMethod("count", true);
  Visit.disableRemoteMethod("exists", true);
  Visit.disableRemoteMethod("findById", true);
  Visit.disableRemoteMethod("findOne", true);
  Visit.disableRemoteMethod("update", true);
  Visit.disableRemoteMethod("updateAll", true);
  Visit.disableRemoteMethod("upsert", true);
};
