module.exports = function(config) {
    config.set({
        basePath: '.',
        frameworks: ['jasmine', 'browserify'],
        preprocessors: {
            'tests/*.js': [ 'browserify' ],
            'app/*.js': [ 'browserify' ]
        },
        files: [
            //load angular.js first
            //(unless if you use jQuery which must be first if I remember well)
            'bower_components/angular/angular.js',
            //Then angular-modules
            'bower_components/angular-mocks/angular-mocks.js',
            //libs
            'bower_components/alertify.js/lib/alertify.js',
            //Your app scripts
            'app/*.js',
            //And your specs
            'tests/*.js'
        ],
        exclude: [],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        captureTimeout: 60000,
        singleRun: false
    });
};