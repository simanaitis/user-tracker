var generalHelper = require('./generalHelper.js'),
    nock = require('nock'), // using nock module to mock http response from db
    querystring = require('querystring'),
    mockedObject = {
        "timeNow": 1395047774820,
        "eventType": "scroll",
        "positionX": 1000,
        "positionY": 0,
        "elementId": null,
        "documentHeight": null,
        "documentWidth": null,
        "path": "/stagedWebPage.html",
        "userID": 1
    },
    mockQuery = {
        eventType: 'scroll'
    },
    stringifiedMockQuery = querystring.stringify(mockQuery);

describe('requestsToDB', function() {
    it('accepts search query and returns actions', function() {
        // console.log('nocking: ' + reporter.mongoDBPath + 'actions/?' + stringifiedMockQuery);
        var mongodb = nock(reporter.mongoDBPath)
            .get('/actions/?' + stringifiedMockQuery)
            .reply(200, mockedObject);
        reporter.requestsToDB.getActions(mockQuery, function(response) {
            expect(response).toEqual(mockedObject);
        })
    });
});