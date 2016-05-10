var gulp           = require('gulp');
var gulpif         = require('gulp-if');
var runSeq         = require('run-sequence');
var args           = require('yargs').argv;
var replace        = require('gulp-replace');
var concat         = require('gulp-concat');
var uglify         = require('gulp-uglify');
var less           = require('gulp-less');
var htmlmin        = require('gulp-htmlmin');
var templates      = require('gulp-angular-templatecache');
var inject         = require('gulp-inject');
var path           = require('path');
var karma          = require('gulp-karma');
var bower          = require('gulp-bower');
var rename         = require('gulp-rename');
var del            = require('del');
var browserify     = require('browserify');
var source         = require('vinyl-source-stream');
var sourcemaps     = require('gulp-sourcemaps');
var buffer         = require('vinyl-buffer');
var gulpFilter     = require('gulp-filter');
var fs             = require('fs');
var imageop        = require('gulp-image-optimization');
var pkg            = require('./package.json');

/* ---------------------------------------------------------------------------------
 *   GET VERSION AND RELEASE DATE INFORMATION FROM COMMAND LINE ARGUMENTS
 * --------------------------------------------------------------------------------*/
var VERSION = pkg.version.replace('v0.0.01');
var DATE = (new Date()).toISOString().split('T')[0];

/* ---------------------------------------------------------------------------------
 *   CONCAT AND MINIFY 3RD PARTY LIBRARIES
 * --------------------------------------------------------------------------------*/
gulp.task('build-libs', function() {
    var libs = [
        'bower_components/Chart.js/chart.min.js',
        'bower_components/jquery/dist/jquery.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-bootstrap-multiselect/dist/angular-bootstrap-multiselect.min.js',
        'bower_components/angular-modal-service/dst/angular-modal-service.js',

        'bower_components/heatmap.js-amd/build/heatmap.js',
        'bower_components/heatmap.js-amd/plugins/angular-heatmap.js'
        ,
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/alertify.js/lib/alertify.js',
        'bower_components/checklist-model/checklist-model.js',
        'bower_components/ui-select/dist/select.js',
        'bower_components/underscore/underscore.js',
        'bower_components/checklist-model/checklist-model.js',
        'bower_components/angular-chart.js/dist/angular-chart.js',

        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/angular-bootstrap/ui-bootstrap.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/angular-map-it/dist/angular-map-it.js'
        //'app/vendors/d3.v3.min.js'
        //'app/vendors/heatmap/heatmap.js'
    ];

    return gulp.src(libs)
        // TODO IMPLEMENT IN MAIN.HTML
        // .pipe(concat('libs-' + VERSION + '.min.js'))
        .pipe(concat('libs.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('build‐js‐pro', function() {
    return runSeq('build-libs', 'build-app');
});

/* ---------------------------------------------------------------------------------
 *   CONCAT AND MINIFY APP SOURCES USING BROWSERIFY
 * --------------------------------------------------------------------------------*/
gulp.task('build-app', function(){
    var b = browserify('./app/src/app.js', { debug:true });
    if (args.react === true) b.transform(reactify);
    return b.bundle()
        .on('error', function(err){
            console.log(err.message);
            this.emit('end');
        })
        // TODO IMPLEMENT IN MAIN.HTML
        // .pipe(source('app-' + VERSION + '.min.js'))
        .pipe(source('app.min.js'))
        .pipe(buffer())
        //.pipe(replace('@VERSION_NUMBER@', VERSION))
        //.pipe(replace('@RELEASE_DATE@', DATE))
        .pipe(sourcemaps.init({loadMaps: true}))
        // TODO FIX
        // .pipe(uglify())
        .pipe(sourcemaps.write('../maps', {
            includeContent: true
        }))
        .pipe(gulp.dest('./build/js'));
});

/* ---------------------------------------------------------------------------------
 *   CREATE LESS FILE WITH ALL INCLUDES
 * --------------------------------------------------------------------------------*/
gulp.task('create-main-less', function() {
    return gulp.src('less/.less')
        .pipe(inject(gulp.src(['app/**/*.less'], {read: false}), {
            starttag: '/* inject:imports */',
            endtag: '/* endinject */',
            transform: function (filepath) {
                return '@import "..' + filepath + '";';
            }
        }))
        .pipe(rename('less/app.less'))
        .pipe(gulp.dest('./build/less'));
});

/* ---------------------------------------------------------------------------------
 *   COPY FONTS TASK
 * --------------------------------------------------------------------------------*/
gulp.task('copy-fonts', function() {
	return gulp.src('./app/fonts/*').pipe(gulp.dest('./build/fonts'));
});
/* ---------------------------------------------------------------------------------
 *   CSS COMPILING TASKS
 * --------------------------------------------------------------------------------*/


<!-- Bootstrap CSS -->
gulp.task('compile-css', function() {
    var css = [
        'bower_components/alertify.js/themes/alertify.core.css',
        'bower_components/alertify.js/themes/alertify.default.css',
        'bower_components/alertify.js/themes/alertify.bootstrap.css',
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/bootstrap/dist/css/bootstrap-theme.css',
        'bower_components/angular-bootstrap/ui-bootstrap-csp.css',
        'bower_components/components-font-awesome/font-awesome.css',
        'bower_components/angular-chart.js/dist/angular-chart.css',

        'app/css/*.css',
        'app/css/elegant-icons-style.css',
        'app/css/style.css',
        'app/css/style-responsive.css',
        'app/css/custom.css'
    ];

    return gulp.src(css)
        .pipe(concat('styles.min.css'))
        // .pipe(uglify())
        .pipe(gulp.dest('./build/css'));
    //return runSeq('create-main-less', 'process-less');
});

/* ---------------------------------------------------------------------------------
 *   CONCAT AND MINIFY LESS FILES
 * --------------------------------------------------------------------------------*/
gulp.task('process-less', function() {
    return gulp.src(['app/less/main.less'])
		.pipe(sourcemaps.init())
        .pipe(less({compress: true}).on('error', errorHandler))
		.pipe(sourcemaps.write())
		.pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('reporter-' + VERSION + '.css'))
		.pipe(sourcemaps.write('../maps', {
            includeContent: true
        }))
        .pipe(gulp.dest('./build/css'));
});



/* ---------------------------------------------------------------------------------
 *   PROCESS IMAGE FILES
 * --------------------------------------------------------------------------------*/
gulp.task('copy-images', function() {
    return gulp.src('app/img/**/*.*')
        .pipe(gulp.dest('./build/img'));
});

/* ---------------------------------------------------------------------------------
 *   MINIFY AND BUILD ANGULAR TEMPLATES TO TEMPLATE CACHE
 * --------------------------------------------------------------------------------*/
gulp.task('angular-templates', function() {
    var htmlmin_options = {
        collapseBooleanAttributes:      true,
        collapseWhitespace:             true,
        removeAttributeQuotes:          true,
        removeComments:                 true, // Only if you don't use comment directives
        removeEmptyAttributes:          true,
        removeRedundantAttributes:      true,
        removeScriptTypeAttributes:     true,
        removeStyleLinkTypeAttributes:  true
    };
    var angular_templatecache_options = {
        standalone: true,
        root: 'app'
    };

    return gulp.src('./app/**/*.html')
        .pipe(htmlmin(htmlmin_options))
        .pipe(templates(angular_templatecache_options))
        .pipe(concat('templates.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});



/* ---------------------------------------------------------------------------------
 *   BUILD INDEX HTML
 * --------------------------------------------------------------------------------*/
gulp.task('build‐site', ['build-libs', 'build-app', 'compile-css', 'copy-fonts', 'angular-templates'], function() {
    return gulp.src('./app/index.html')
        .pipe(inject(gulp.src(['build/css/styles.min.css', 'build/js/libs*.js', 'build/js/styles.min.js', 'build/js/templates*.js', 'build/js/app*.js'], {read: false}), {
            ignorePath: 'build/',
            addRootSlash: false
        }))
        .pipe(gulp.dest('./build'));
});



/* ---------------------------------------------------------------------------------
 *   RUN TESTS USING KARMA
 * --------------------------------------------------------------------------------*/
gulp.task('karma', function() {
    return gulp.src('./noop')
        .pipe(karma({
            configFile: './karma.conf.js',
            action: 'watch'
        }).on('error', errorHandler));
});

gulp.task('karma-production', function() {
    return gulp.src('./noop')
        .pipe(karma({
            configFile: './karma.conf.js',
            reporters: ['progress', 'teamcity', 'coverage'],
            action: 'run'
        }));
});


/* ---------------------------------------------------------------------------------
 *   DELETE BIN AND COVERAGE
 * --------------------------------------------------------------------------------*/
gulp.task('clean-all', function () {
    return del(['build']);
});



/* ---------------------------------------------------------------------------------
 *   RUN BOWER INSTALL
 * --------------------------------------------------------------------------------*/
gulp.task('bower', function() {
    return bower();
});



/* ---------------------------------------------------------------------------------
 *   WATCH DEVELOPMENT FILES FOR CHANGES AND RE-RUN GULP TASKS
 * --------------------------------------------------------------------------------*/
gulp.task('watch', function() {
    var scripts = gulp.watch('app/**/*.js', ['build-app']);
    // var utils = gulp.watch('app/js/**/*.js', ['build-app']);
    var less = gulp.watch(['app/**/*.less'], ['compile-css']);
    var templates = gulp.watch('app/**/*.html', ['angular-templates']);
    var images = gulp.watch('app/img/**/*.*', ['copy-images']);
    var fonts = gulp.watch('app/fonts/**/*.*', ['copy-fonts']);
});



/* ---------------------------------------------------------------------------------
 *   OPTIMIZE IMAGES FILES
 * --------------------------------------------------------------------------------*/
gulp.task('image-optimizer', function(cb) {
    gulp.src(['app/img/*.*']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('build/img')).on('end', cb).on('error', cb);
});



/* ---------------------------------------------------------------------------------
 *   BUILD CONFIGURATIONS
 * --------------------------------------------------------------------------------*/

// development build
gulp.task('dev', function() {
    return runSeq('bower', 'clean-all', ['build‐site', 'copy-images'], 'watch'); //'karma'
});

// Handle the error
function errorHandler (error) {
    console.log(error.toString());
    this.emit('end');
}
