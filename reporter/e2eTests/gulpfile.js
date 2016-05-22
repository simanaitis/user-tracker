var gulp = require('gulp'),
    gulpSequence = require('gulp-sequence'),
    args = require('yargs').argv,
    protractorQA = require('gulp-protractor-qa'),
    protractor = require('gulp-protractor').protractor;

var sourceFiles = {
    ui: {
        templates: [
            '../src/js/**/*.html',
            '!../src/js/index.html'
        ]
    },
    e2eSpec: {
        src: './**/*-spec.js',
        template: './config/template.js',
        hub: 'http://localhost:4444/wd/hub',
        config: './config/conf.js'
    }
};


gulp.task('default', function(){
	process.env.singleBrowserName = 'ch';  
    process.env.baseUrl = 'localhost';
    process.env.executionEnv  = 'local';
    process.env.hub = sourceFiles.e2eSpec.hub;
	
	 var setup = {
        configFile: sourceFiles.e2eSpec.config
    };

    return gulp.src(sourceFiles.e2eSpec.src)
        .pipe(protractor(setup));
});
