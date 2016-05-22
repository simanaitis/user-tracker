exports.config = {
    seleniumAddress: process.env.hub,
    framework: 'jasmine2',
    getPageTimeout: 20000,
    allScriptsTimeout: 20000,
    multiCapabilities: require('./browsers').model(process.env.singleBrowserName),
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    },
    onPrepare: function() {
        var fileStream = require('fs');

        global.template = require('./template.js').model();
        global.baseUrl = 'http://localhost:3002';
        global.isNotAngularSite = function(flag) {
            browser.ignoreSynchronization = flag;
        };

        global.screenShot = function(data, filename) {
            var stream = fileStream.createWriteStream(filename);
            console.log('Screan shot name: ', filename, 'Done');
            stream.write(new Buffer(data, 'base64'));
            stream.end();
        };

        if (process.env.teamCity) {
            var jasmineReporters = require('jasmine-reporters');
            jasmine.getEnv().addReporter(new jasmineReporters.TeamCityReporter());
        }

        global.isNotAngularSite(true);
        browser.driver.get(baseUrl);
        browser.driver.manage().window().maximize();

        function run() {
                browser.driver.get(baseUrl + ':3002');
        }
    }
};