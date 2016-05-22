var request = require('request-then');
var loopback = require('loopback');

module.exports = function(EventArray) {

  EventArray.observe('before save', function (ctx, next) {
    var loopbackContext = loopback.getCurrentContext();

    var visitId = loopbackContext.get('visitId');

    if(visitId){
      request('http://localhost:3001/api/Domains?filter=' + encodeURIComponent(JSON.stringify({"where": {"host": loopbackContext.get('host')}})))
        .then(function (response) {
          var domainId = JSON.parse(response.body)[0].id;
          ctx.instance.__data.events.forEach(function (item) {
            item.__data.domainId = domainId;
          });
          request({
            url: 'http://localhost:3001/api/Visits/' + visitId + '/event',
            method: 'POST',
            json: ctx.instance.__data
          })
            .then(function (response) {
              console.log('adding events retreiving request');
              ctx.instance.setId(response.body.id);
              next();
            }, function (error) {
              return next(new Error('Meaning full error'));
            })
        })
    }else{
     next();
    }
  })

};
